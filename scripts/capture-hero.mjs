/**
 * Capture the Hero auto-demo as a frame-perfect video.
 *
 * Why this exists
 * ---------------
 * The Hero's "browser-in-a-browser" auto-demo is a JS state machine
 * (idle → gliding → pressing → modal open → RCA stream → PR press →
 * PR created → modal close → return → pause → repeat) coordinated by
 * a dozen setTimeouts and many CSS transitions/keyframes. On slower
 * devices, GC pauses, or while the page is hydrating, the timeline
 * stretches unevenly and the cursor sometimes arrives late at its
 * click targets, the modal pops in before the press cue lands, the
 * confidence bar lags the conclusion, etc.
 *
 * Baking one perfect cycle into a video file removes every source of
 * variance. The browser just plays back the captured frames in order.
 *
 * Capture strategy
 * ----------------
 * Unlike the AISpotlight capture (which pauses CSS animations and
 * steps `Animation.currentTime` per frame), the Hero demo is driven
 * by JS setTimeouts that move React state. We can't trivially step
 * those, so we use Playwright's recordVideo API to record the page
 * at the browser's native compositor rate at DPR=2, then trim with
 * ffmpeg to exactly one "story beat": from the click on log-ingester
 * (data-cursor-phase="pressing") through the RCA stream, cursor
 * glide to Generate PR, and finishing on the click ring firing on
 * Create PR.
 *
 * The start trim point is found by waiting for the cursor to enter
 * the `pressing` phase via `data-cursor-phase="pressing"` (a stable
 * hook added to Hero.tsx). The wall-clock offset from the start of
 * the recording to that moment is used as the ffmpeg -ss seek; -t
 * pulls exactly TRIM_MS of frames after that.
 *
 * Outputs (all in public/media/)
 * ------------------------------
 *   hero.webm   primary delivery (VP9), 1600 px @ DPR=2 source
 *   hero.mp4    Safari/iOS fallback (H.264)
 *   hero.gif    palette + sierra2_4a dither, 1000 px wide
 *   hero-poster.jpg  RCA-resolved still for <video poster=>
 *
 * Usage
 * -----
 *   npm run dev                    # in a separate terminal
 *   node scripts/capture-hero.mjs  # this script
 *   # …or just `npm run capture:hero`
 */
import { chromium } from 'playwright';
import { mkdir, rm, readdir, stat, copyFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const SITE_URL = process.env.SITE_URL || 'http://localhost:5173/';
const BROWSER_SELECTOR = 'section#top [data-capture="hero-demo"]';
const CURSOR_SELECTOR = '[data-cursor-phase]';

/* Trim window — clipped to the "one-shot story" of the demo rather
 * than a full loop. The timing constants in src/components/sections/
 * Hero.tsx are nominally:
 *
 *   FIRST_DELAY_MS         = 2200   (idle pause before glide begins)
 *   GLIDE_DURATION_MS      = 1300   (cursor travel to Active Incidents)
 *   PRESS_DURATION_MS      =  320   (press cue lingers on log-ingester)
 *   RCA_HOLD_MS            = 9500   (RCA streams + resolves inside modal)
 *   PR_GLIDE_DURATION_MS   = 1100   (cursor travel to Generate PR)
 *   PR_PRESS_DURATION_MS   =  360   (press cue on Generate PR)
 *
 * The captured window starts at the very first frame where
 * data-cursor-phase="pressing" matches (the click ring on log-ingester)
 * and ends after data-cursor-phase="pr-pressing" matches, plus a
 * short hold so the click ring on the Generate PR button is at its
 * peak in the closing frame.
 *
 * We DON'T hardcode the duration — JS setTimeouts drift on real
 * pages (GC, hydration, layout), and the cursor's CSS transition is
 * 1.2s while PR_GLIDE_DURATION_MS is only 1.1s, so the JS state
 * flips to pr-pressing ~100ms BEFORE the visible cursor finishes
 * gliding. Hardcoding a fixed offset cuts off the ring landing.
 * Instead we observe the two events live and let the trim duration
 * fall out from wall-clock measurement. */
const POST_PR_PRESS_HOLD_MS =
  Number(process.env.POST_PR_PRESS_HOLD_MS) || 320;

/* Generous buffer after the trim window finishes so the raw recording
 * captures a few extra frames past where we cut, giving ffmpeg room
 * to land cleanly on the last keyframe instead of dragging the demo
 * mid-state into the trimmed output. */
const POST_TRIM_BUFFER_MS = 1500;

/* The viewport size that Playwright's recordVideo captures at. We
 * pick something tall enough to keep the entire .browser element on
 * screen with room for the badge and a small page margin. */
const VIEWPORT = { width: 1440, height: 1024 };

/* Capture device-pixel-ratio. The .mockup element is max-width: 1100px
 * (CSS pixels). On the real site visitors view it at DPR ≥ 2 (Retina,
 * 4K, etc.) so the .browser content actually rasterises at ~2200 px
 * across. If we record at DPR=1 the source frames are 1100 px wide,
 * the browser then has to upscale to 2200 px on the user's screen,
 * and the playback looks blurry — especially the small font in the
 * RCA modal and the gradient washes.
 *
 * To match what a Retina visitor sees we force Chromium to render the
 * whole page at DPR=2 via:
 *   1. `--force-device-scale-factor=2` launch arg (makes Chromium
 *      composite at 2× internally — required because recordVideo
 *      records the composited surface).
 *   2. `deviceScaleFactor: 2` on the context (keeps Playwright's
 *      hit-testing, screenshots, and bounding-box math consistent
 *      with the rendered surface).
 *   3. `recordVideo.size` pinned to VIEWPORT × DPR so the saved
 *      .webm file actually preserves the 2× raster (otherwise
 *      Playwright would scale the recording back down to viewport
 *      CSS-pixel dimensions and we'd lose the sharpness we just
 *      paid for).
 *
 * boundingBox() still returns CSS pixels, so we multiply by DPR when
 * building the ffmpeg crop filter to map into the raw recording's
 * device-pixel coordinates. */
const DPR = Number(process.env.CAPTURE_DPR) || 2;

const BUILD_DIR = path.join(ROOT, 'build', 'capture-hero');
const RAW_DIR = path.join(BUILD_DIR, 'raw');
const OUT_DIR = path.join(ROOT, 'public', 'media');
const OUT_WEBM = path.join(OUT_DIR, 'hero.webm');
const OUT_MP4 = path.join(OUT_DIR, 'hero.mp4');
const OUT_GIF = path.join(OUT_DIR, 'hero.gif');
const OUT_POSTER = path.join(OUT_DIR, 'hero-poster.jpg');

async function ensureFresh(dir) {
  await rm(dir, { recursive: true, force: true });
  await mkdir(dir, { recursive: true });
}

function runFfmpeg(args, label) {
  return new Promise((resolve, reject) => {
    const p = spawn('ffmpeg', args, { stdio: ['ignore', 'inherit', 'inherit'] });
    p.on('exit', (code) =>
      code === 0
        ? resolve()
        : reject(new Error(`ffmpeg (${label}) exited with code ${code}`)),
    );
    p.on('error', reject);
  });
}

async function fileSizeKB(p) {
  try {
    const s = await stat(p);
    return (s.size / 1024).toFixed(1) + ' KB';
  } catch {
    return '(missing)';
  }
}

function formatMs(ms) {
  return `${(ms / 1000).toFixed(2)}s`;
}

async function main() {
  console.log(`\n▶ Capture target: ${SITE_URL}`);
  console.log(`▶ Trim mode: pressing → pr-pressing + ${POST_PR_PRESS_HOLD_MS}ms hold`);
  console.log(`▶ Viewport: ${VIEWPORT.width}×${VIEWPORT.height} (DPR=${DPR})`);
  console.log(
    `▶ Raw recording size: ${VIEWPORT.width * DPR}×${VIEWPORT.height * DPR}`,
  );

  await ensureFresh(RAW_DIR);
  await mkdir(OUT_DIR, { recursive: true });

  console.log('\n▶ Launching Chromium with recordVideo enabled...');
  /* --force-device-scale-factor makes Chromium composite the entire
   * page at DPR× the CSS-pixel resolution. recordVideo records the
   * composited surface, so this is what actually gives us sharper
   * captured frames — without it, deviceScaleFactor only affects
   * screenshots, not recordVideo. */
  const browser = await chromium.launch({
    headless: true,
    args: [`--force-device-scale-factor=${DPR}`],
  });
  /* recordVideo writes a single .webm to RAW_DIR when the context is
   * closed. The size option pins the OUTPUT resolution of the saved
   * file — we pin it to VIEWPORT × DPR so the raster Chromium
   * actually rendered (at 2×) is preserved in the file instead of
   * being downsampled back to 1× during muxing. */
  const ctx = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: DPR,
    reducedMotion: 'no-preference',
    recordVideo: {
      dir: RAW_DIR,
      size: { width: VIEWPORT.width * DPR, height: VIEWPORT.height * DPR },
    },
  });
  const page = await ctx.newPage();

  /* Mark the wall-clock moment the recording effectively begins.
   * Playwright actually starts recording at context creation, so any
   * delay between here and page.goto is just blank-page frames that
   * we'll trim away below. */
  const recordingStartedAt = Date.now();

  console.log(`▶ Navigating to ${SITE_URL}...`);
  await page.goto(SITE_URL, { waitUntil: 'networkidle', timeout: 30_000 });

  /* The Hero is the top section so it's already in view, but call
   * scrollIntoViewIfNeeded for safety. */
  await page.locator(BROWSER_SELECTOR).scrollIntoViewIfNeeded();

  /* Wait for the cursor to ARRIVE at the log-ingester card and start
   * pressing — that's our canonical "click moment" that the captured
   * video opens on. The cursor's phase transitions are:
   *   idle → gliding → pressing → hidden (modal open) → pr-gliding → pr-pressing → hidden
   * so the first time `data-cursor-phase="pressing"` matches is the
   * exact frame the click ring fires on log-ingester. */
  console.log('▶ Waiting for first click on log-ingester...');
  try {
    await page.waitForSelector(`${CURSOR_SELECTOR}[data-cursor-phase="pressing"]`, {
      timeout: 30_000,
      state: 'attached',
    });
  } catch (err) {
    /* Dump the cursor's actual phase to help diagnose flakes — e.g.
     * if the state machine never advanced because hero/tab visibility
     * gates didn't satisfy. */
    const phase = await page.evaluate(() => {
      const el = document.querySelector('[data-cursor-phase]');
      return el ? el.getAttribute('data-cursor-phase') : 'NO-ELEMENT';
    });
    console.error(`  Diagnostic: cursor phase at timeout = "${phase}"`);
    throw err;
  }
  /* The waitForSelector returns slightly AFTER the className flips,
   * so back-pedal the trim point by one composited frame's worth of
   * time so the trimmed video opens cleanly on the click ring's
   * first frame. */
  const cycleStartOffsetMs = Date.now() - recordingStartedAt - 33;
  console.log(
    `  Click landed ${formatMs(cycleStartOffsetMs)} into the recording.`,
  );

  /* Read the .browser element's bounding box now (while the page is
   * still alive) — we'll use it to crop the recorded video later. */
  const bbox = await page.locator(BROWSER_SELECTOR).boundingBox();
  if (!bbox) {
    throw new Error('Could not read .browser bounding box');
  }
  console.log(
    `▶ .browser bbox: ${Math.round(bbox.width)}×${Math.round(bbox.height)} @ (${Math.round(bbox.x)},${Math.round(bbox.y)})`,
  );

  /* Now wait for the SECOND click — pr-pressing — which fires when
   * the cursor presses the Generate PR button inside the modal. */
  console.log('▶ Waiting for click on Generate PR...');
  await page.waitForSelector(
    `${CURSOR_SELECTOR}[data-cursor-phase="pr-pressing"]`,
    { timeout: 20_000, state: 'attached' },
  );
  const prPressOffsetMs = Date.now() - recordingStartedAt;
  console.log(
    `  PR click state fired ${formatMs(prPressOffsetMs)} into the recording`
    + ` (${formatMs(prPressOffsetMs - cycleStartOffsetMs)} after first click).`,
  );

  /* The state machine flips to "pr-pressing" the instant the timer
   * fires (at PR_GLIDE_DURATION_MS=1100ms), but the cursor's CSS
   * `transition: transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)` is
   * 100ms LONGER than the JS schedule — so the visible cursor is
   * still mid-glide when the state flips. We wait for the actual
   * transitionend event on the cursor so we KNOW it has physically
   * landed on the Generate PR button before computing the trim. */
  console.log('▶ Waiting for cursor to physically land at Generate PR...');
  const cursorLandedOffsetMs = await page.evaluate(async () => {
    const cursor = document.querySelector('[data-cursor-phase]');
    if (!cursor) return null;
    /* If the transition already ended before we attached, just resolve
     * immediately by checking the bounding box overlap with the button.
     * Otherwise listen for the transform transitionend. */
    await new Promise((resolve) => {
      const t = setTimeout(resolve, 1500); // safety fallback
      cursor.addEventListener(
        'transitionend',
        (e) => {
          if (e.propertyName === 'transform') {
            clearTimeout(t);
            resolve();
          }
        },
        { once: false },
      );
    });
    return performance.now();
  });
  const cursorLandedRecordingMs = Date.now() - recordingStartedAt;
  console.log(
    `  Cursor landed ${formatMs(cursorLandedRecordingMs)} into the recording`
    + ` (${formatMs(cursorLandedRecordingMs - prPressOffsetMs)} after pr-pressing fired).`,
  );

  /* Hold for the click ring to be at peak visibility. The ring is a
   * 600ms ease-out CSS animation that starts at the JS pr-pressing
   * fire (NOT at cursor-landed), so by the time the cursor visually
   * arrives the ring is already ~100ms into its run. We then add a
   * short hold so the closing frame catches a few extra frames of
   * "cursor on button + ring still pulsing" before the trim cuts. */
  console.log(`▶ Holding ${formatMs(POST_PR_PRESS_HOLD_MS)} for click ring to peak...`);
  await page.waitForTimeout(POST_PR_PRESS_HOLD_MS + POST_TRIM_BUFFER_MS);

  /* Trim duration: from the first click ring (back-pedaled one frame)
   * up to cursor-landed + POST_PR_PRESS_HOLD_MS. */
  const TRIM_MS =
    cursorLandedRecordingMs + POST_PR_PRESS_HOLD_MS - cycleStartOffsetMs;
  console.log(`▶ Final trim duration: ${formatMs(TRIM_MS)}`);

  console.log('▶ Closing context to flush video to disk...');
  await page.close();
  await ctx.close();
  await browser.close();

  /* Playwright names the recorded file with a random uuid. Find it. */
  const files = await readdir(RAW_DIR);
  const rawWebm = files.find((f) => f.endsWith('.webm'));
  if (!rawWebm) {
    throw new Error(`No .webm produced in ${RAW_DIR}`);
  }
  const rawPath = path.join(RAW_DIR, rawWebm);
  console.log(`▶ Raw recording: ${path.relative(ROOT, rawPath)} (${await fileSizeKB(rawPath)})`);

  /* Build a single ffmpeg filter graph that:
   *   1. Seeks (`-ss`) to the cycle start in the raw recording.
   *   2. Reads (`-t`) exactly TRIM_MS worth of frames.
   *   3. Crops to the .browser bounding box.
   *   4. Scales down to a sensible delivery resolution.
   *
   * `crop=W:H:X:Y` operates on raw recording pixels, while
   * boundingBox() reports CSS pixels. We render at DPR=2 so the raw
   * recording is twice as large in each dimension — multiply the
   * bbox by DPR to map CSS → raw pixel coordinates. */
  const cropW = Math.round(bbox.width * DPR);
  const cropH = Math.round(bbox.height * DPR);
  const cropX = Math.round(bbox.x * DPR);
  const cropY = Math.round(bbox.y * DPR);
  const cropFilter = `crop=${cropW}:${cropH}:${cropX}:${cropY}`;

  /* Deliver at a max width of 1600 px. With DPR=2 capture the source
   * crop is ~2200 px wide; downscaling slightly to 1600 keeps the
   * file size in check while still being well above the ~1100 px
   * CSS dimension the .mockup occupies on a Retina screen, so the
   * browser never has to upscale during playback. */
  const DELIVERY_WIDTH = 1600;
  const scaleFilter =
    cropW > DELIVERY_WIDTH
      ? `scale=${DELIVERY_WIDTH}:-2:flags=lanczos`
      : `scale=trunc(iw/2)*2:trunc(ih/2)*2`;

  const startSec = (cycleStartOffsetMs / 1000).toFixed(3);
  const durSec = (TRIM_MS / 1000).toFixed(3);

  /* ----- WebM (VP9), primary delivery format -----
   * CRF 28 (was 32) — small file growth, big readability win for the
   * small text inside the RCA modal. UI/screencast content benefits
   * more from extra bitrate than typical camera footage does. */
  console.log('\n▶ Encoding WebM (VP9)...');
  await runFfmpeg(
    [
      '-y',
      '-ss', startSec,
      '-i', rawPath,
      '-t', durSec,
      '-c:v', 'libvpx-vp9',
      '-pix_fmt', 'yuv420p',
      '-b:v', '0',
      '-crf', '28',
      '-deadline', 'good',
      '-cpu-used', '2',
      '-row-mt', '1',
      '-vf', `${cropFilter},${scaleFilter}`,
      OUT_WEBM,
    ],
    'webm',
  );

  /* ----- MP4 (H.264), Safari/iOS fallback -----
   * CRF 20 (was 22) — H.264 handles small text well at this rate
   * and the resulting file is still well under 2 MB. */
  console.log('\n▶ Encoding MP4 (H.264)...');
  await runFfmpeg(
    [
      '-y',
      '-ss', startSec,
      '-i', rawPath,
      '-t', durSec,
      '-c:v', 'libx264',
      '-pix_fmt', 'yuv420p',
      '-preset', 'slow',
      '-crf', '20',
      '-movflags', '+faststart',
      '-vf', `${cropFilter},${scaleFilter}`,
      OUT_MP4,
    ],
    'mp4',
  );

  /* ----- GIF (palette + sierra2_4a dither) -----
   * The previous build downscaled the GIF to 800 px and used a
   * coarse bayer dither with only 160 colors — that combination
   * pretty much destroys small text and gradient washes. We now:
   *   - keep the GIF at 1000 px wide (close to the CSS dimension of
   *     the mockup, so playback in Slack/README previews is sharp);
   *   - generate a global palette from full-frame statistics (better
   *     coverage of the violet washes + green resolved-pill);
   *   - bump max_colors to 224 (room for the violet→navy gradient
   *     plus syntax-highlighted code diff);
   *   - use sierra2_4a error-diffusion dither, which preserves edges
   *     and small typography far better than bayer for UI screencaps.
   *
   * File size goes up (~10 MB) but the visual quality leap is worth
   * it — GIFs are usually consumed in shares/Slack previews where
   * legibility matters more than transfer size. */
  console.log('\n▶ Encoding GIF (palette + sierra2_4a dither)...');
  const GIF_WIDTH = 1000;
  const GIF_FPS = 20;
  await runFfmpeg(
    [
      '-y',
      '-ss', startSec,
      '-i', rawPath,
      '-t', durSec,
      '-filter_complex',
      `${cropFilter},fps=${GIF_FPS},scale=${GIF_WIDTH}:-1:flags=lanczos,split [a][b];` +
        ` [a] palettegen=stats_mode=full:max_colors=224 [p];` +
        ` [b][p] paletteuse=dither=sierra2_4a:diff_mode=rectangle`,
      '-loop', '0',
      OUT_GIF,
    ],
    'gif',
  );

  /* ----- Poster (a still picked from inside the RCA-open phase) -----
   * Timeline inside the trimmed video (one-shot story):
   *   t=0          PRESS ring fires on log-ingester
   *   t=320ms      PRESS done, modal mounts and RCA stream begins
   *   t=9820ms     RCA stream finishes (cursor about to reappear)
   *   t=10920ms    PR_GLIDE done, PR_PRESS begins (click on Generate PR)
   *   t=11200ms    VIDEO ENDS — final frame holds the PR click ring
   *
   * Picking t=9.0s lands ~91% through the RCA stream — conclusion +
   * confidence bar + 4 evidence checks are all visible, the footer
   * actions have landed, and the cursor isn't yet drawn over the
   * panel. That's still the single most marketing-friendly still in
   * the whole video and stays well clear of the new t=11.2s end.
   *
   * The poster offset is into the TRIMMED video, so we add it to the
   * cycleStartOffsetMs to get the seek into the raw recording. */
  const POSTER_OFFSET_MS = 9_000;
  const posterSeekSec = ((cycleStartOffsetMs + POSTER_OFFSET_MS) / 1000).toFixed(3);
  console.log(`\n▶ Encoding poster (t=${formatMs(POSTER_OFFSET_MS)} into cycle)...`);
  /* -q:v 2 gives near-lossless JPEG. The poster is what the user
   * sees while the WebM is still streaming in, and it's the LCP
   * candidate so it pays to ship it sharp. The file ends up ~150 KB
   * at 1600 px wide — still well within an LCP budget. */
  await runFfmpeg(
    [
      '-y',
      '-ss', posterSeekSec,
      '-i', rawPath,
      '-frames:v', '1',
      '-q:v', '2',
      '-vf', `${cropFilter},${scaleFilter}`,
      OUT_POSTER,
    ],
    'poster',
  );

  console.log('\n✓ Done.');
  console.log('  Outputs:');
  console.log(`    WebM:   ${path.relative(ROOT, OUT_WEBM)}   (${await fileSizeKB(OUT_WEBM)})`);
  console.log(`    MP4:    ${path.relative(ROOT, OUT_MP4)}    (${await fileSizeKB(OUT_MP4)})`);
  console.log(`    GIF:    ${path.relative(ROOT, OUT_GIF)}    (${await fileSizeKB(OUT_GIF)})`);
  console.log(`    Poster: ${path.relative(ROOT, OUT_POSTER)} (${await fileSizeKB(OUT_POSTER)})`);
}

main().catch((err) => {
  console.error('\n✗ Capture failed:', err);
  process.exit(1);
});
