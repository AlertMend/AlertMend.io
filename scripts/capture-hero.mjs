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
 * at the browser's native compositor rate, then trim with ffmpeg to
 * exactly one cycle starting and ending at the same "idle, about to
 * glide" frame — which makes the resulting video loop seamlessly.
 *
 * The trim point is found by waiting for the cursor to enter the
 * `gliding` phase via `data-cursor-phase="gliding"` (a stable hook
 * added to Hero.tsx). The wall-clock offset from the start of the
 * recording to that moment is used as the ffmpeg -ss seek; -t pulls
 * exactly CYCLE_MS of frames after that.
 *
 * Outputs (all in public/media/)
 * ------------------------------
 *   hero.webm   primary delivery (VP9)
 *   hero.mp4    Safari/iOS fallback (H.264)
 *   hero.gif    palette + bayer dither, downscaled
 *   hero-poster.jpg  RCA-modal-open still for <video poster=>
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

/* Hero auto-demo cycle length, computed from the timing constants in
 * src/components/sections/Hero.tsx:
 *
 *   FIRST_DELAY_MS         = 2200   (idle pause before glide begins)
 *   GLIDE_DURATION_MS      = 1300   (cursor travel to Active Incidents)
 *   PRESS_DURATION_MS      =  320   (press cue lingers)
 *   RCA_HOLD_MS            = 9500   (RCA streams + resolves inside modal)
 *   PR_GLIDE_DURATION_MS   = 1100   (cursor travel to Generate PR)
 *   PR_PRESS_DURATION_MS   =  360   (press cue on Generate PR)
 *   PR_CREATED_HOLD_MS     = 2600   (PR created success state held)
 *   RETURN_DELAY_MS        =  700   (gap before cursor returns home)
 *   PAUSE_BETWEEN_MS       = 4500   (idle pause before next glide)
 *
 * One full press-to-press cycle = the same sum, just rotated so the
 * trim starts at the click instead of at the glide:
 *   PRESS + RCA + PR_GLIDE + PR_PRESS + PR_HOLD + RETURN + PAUSE + GLIDE
 *   = 320 + 9500 + 1100 + 360 + 2600 + 700 + 4500 + 1300
 *   = 20380ms
 *
 * Starting at the click moment (data-cursor-phase="pressing", first
 * frame the click ring fires on the log-ingester card) and ending at
 * the next click moment keeps the loop seamless AND skips the boring
 * idle + glide pre-roll so the video opens directly on the most
 * engaging beat of the demo — the click that opens the RCA modal. */
const CYCLE_MS = Number(process.env.CYCLE_MS) || 20_380;

/* Generous buffer after the cycle finishes so the recording captures
 * the trailing "idle, about to glide" frame plus a couple of safety
 * frames before we tear the context down. */
const POST_CYCLE_BUFFER_MS = 1500;

/* The viewport size that Playwright's recordVideo captures at. We
 * pick something tall enough to keep the entire .browser element on
 * screen with room for the badge and a small page margin. */
const VIEWPORT = { width: 1440, height: 1024 };

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
  console.log(`▶ Cycle duration: ${formatMs(CYCLE_MS)}`);
  console.log(`▶ Viewport: ${VIEWPORT.width}×${VIEWPORT.height}`);

  await ensureFresh(RAW_DIR);
  await mkdir(OUT_DIR, { recursive: true });

  console.log('\n▶ Launching Chromium with recordVideo enabled...');
  const browser = await chromium.launch({ headless: true });
  /* recordVideo writes a single .webm to RAW_DIR when the context is
   * closed. The size option pins the output resolution to the
   * viewport so the saved video is at exactly the CSS pixel size we
   * trim/crop against later. */
  const ctx = await browser.newContext({
    viewport: VIEWPORT,
    /* deviceScaleFactor affects screenshots but not recordVideo
     * output (recordVideo always records at CSS-pixel viewport
     * resolution). Keep it at 1 to avoid making the trace huge. */
    deviceScaleFactor: 1,
    reducedMotion: 'no-preference',
    recordVideo: {
      dir: RAW_DIR,
      size: VIEWPORT,
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
  await page.waitForSelector(`${CURSOR_SELECTOR}[data-cursor-phase="pressing"]`, {
    timeout: 15_000,
    state: 'attached',
  });
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

  /* Hold for one full cycle plus a small buffer so the video file
   * extends safely past the trim window. */
  console.log(`▶ Holding for ${formatMs(CYCLE_MS + POST_CYCLE_BUFFER_MS)}...`);
  await page.waitForTimeout(CYCLE_MS + POST_CYCLE_BUFFER_MS);

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
   *   2. Reads (`-t`) exactly CYCLE_MS worth of frames.
   *   3. Crops to the .browser bounding box.
   *   4. Scales down to a sensible delivery resolution.
   *
   * `crop=W:H:X:Y` operates on the input frame in input pixels (=
   * viewport CSS pixels, since recordVideo size matches viewport).
   * The bbox numbers come from boundingBox() which is in the same
   * CSS-pixel space. They match. */
  const cropW = Math.round(bbox.width);
  const cropH = Math.round(bbox.height);
  const cropX = Math.round(bbox.x);
  const cropY = Math.round(bbox.y);
  const cropFilter = `crop=${cropW}:${cropH}:${cropX}:${cropY}`;

  /* Deliver at a max width of 1280px to keep file size down — the
   * Hero is above the fold and LCP-critical, so we don't want a
   * 3-megabyte video preceding the user's first paint. Browsers
   * scale it back up to whatever CSS pixel size .browser occupies. */
  const DELIVERY_WIDTH = 1280;
  const scaleFilter =
    cropW > DELIVERY_WIDTH
      ? `scale=${DELIVERY_WIDTH}:-2:flags=lanczos`
      : `scale=trunc(iw/2)*2:trunc(ih/2)*2`;

  const startSec = (cycleStartOffsetMs / 1000).toFixed(3);
  const durSec = (CYCLE_MS / 1000).toFixed(3);

  /* ----- WebM (VP9), primary delivery format ----- */
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
      '-crf', '32',
      '-deadline', 'good',
      '-cpu-used', '2',
      '-row-mt', '1',
      '-vf', `${cropFilter},${scaleFilter}`,
      OUT_WEBM,
    ],
    'webm',
  );

  /* ----- MP4 (H.264), Safari/iOS fallback ----- */
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
      '-crf', '22',
      '-movflags', '+faststart',
      '-vf', `${cropFilter},${scaleFilter}`,
      OUT_MP4,
    ],
    'mp4',
  );

  /* ----- GIF (palette + bayer dither), shareable still-ish format -----
   * 24fps and 800px wide because GIFs hate gradients and we don't
   * want a 10MB asset just for Slack previews. */
  console.log('\n▶ Encoding GIF (palette + bayer dither)...');
  const GIF_WIDTH = 800;
  const GIF_FPS = 18;
  await runFfmpeg(
    [
      '-y',
      '-ss', startSec,
      '-i', rawPath,
      '-t', durSec,
      '-filter_complex',
      `${cropFilter},fps=${GIF_FPS},scale=${GIF_WIDTH}:-1:flags=lanczos,split [a][b];` +
        ` [a] palettegen=stats_mode=diff:max_colors=160 [p];` +
        ` [b][p] paletteuse=dither=bayer:bayer_scale=4:diff_mode=rectangle`,
      '-loop', '0',
      OUT_GIF,
    ],
    'gif',
  );

  /* ----- Poster (a still picked from inside the RCA-open phase) -----
   * With the cycle now starting at the click on log-ingester, the
   * timeline inside the trimmed video is:
   *   t=0          PRESS ring fires on log-ingester
   *   t=320ms      PRESS done, modal mounts and RCA stream begins
   *   t=9820ms     RCA stream finishes (cursor about to reappear)
   *
   * Picking t=9.0s lands ~91% through the stream — the conclusion +
   * confidence bar + 4 evidence checks are all visible, the PR
   * footer buttons have landed, and the cursor isn't yet drawn over
   * the panel. That's the single most marketing-friendly still in
   * the entire cycle.
   *
   * The poster offset is into the TRIMMED video, so we add it to the
   * cycleStartOffsetMs to get the seek into the raw recording. */
  const POSTER_OFFSET_MS = 9_000;
  const posterSeekSec = ((cycleStartOffsetMs + POSTER_OFFSET_MS) / 1000).toFixed(3);
  console.log(`\n▶ Encoding poster (t=${formatMs(POSTER_OFFSET_MS)} into cycle)...`);
  await runFfmpeg(
    [
      '-y',
      '-ss', posterSeekSec,
      '-i', rawPath,
      '-frames:v', '1',
      '-q:v', '4',
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
