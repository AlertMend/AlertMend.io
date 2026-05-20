/**
 * Capture the AI Spotlight "RCA screencast" as a frame-perfect video.
 *
 * Why this exists
 * ---------------
 * The live AISpotlight visual is dozens of staggered CSS keyframe
 * animations driven by a JS-side loop that remounts the subtree every
 * 11.5s (see LOOP_INTERVAL_MS in src/components/sections/AISpotlight.tsx).
 * On slower devices, background tabs, or when GC happens at the wrong
 * moment, the sub-animations can desync — the conclusion lands before
 * the evidence chips, or the status pill flips before the corresponding
 * box arrives, etc. The output looks "off" in a way that's hard to pin
 * down because the timing is emergent rather than authored.
 *
 * This script renders the page in headless Chromium once, freezes the
 * JS loop driver so React doesn't remount mid-capture, restarts all CSS
 * animations from t=0, and screenshots the .visual element at 30fps for
 * one full 11.5s cycle. The resulting frames are encoded into:
 *
 *   public/media/aispotlight.webm    primary delivery (VP9, ~few hundred KB)
 *   public/media/aispotlight.mp4     Safari/iOS fallback (H.264)
 *   public/media/aispotlight.gif     shareable still-ish (palette + dither)
 *   public/media/aispotlight-poster.jpg   first-frame poster for <video>
 *
 * The page-level <video autoplay muted loop playsinline> then plays the
 * baked-in timing forever — no JS, no CSS race conditions, no remounts.
 *
 * Usage
 * -----
 *   1. npm run dev    (in a separate terminal, on http://localhost:5173)
 *   2. node scripts/capture-aispotlight.mjs
 *
 * Override SITE_URL or duration via env if you ever need to point at a
 * built preview instead of the Vite dev server.
 */
import { chromium } from 'playwright';
import { mkdir, rm, stat } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const SITE_URL = process.env.SITE_URL || 'http://localhost:5173/';
/* The .visual class is CSS-Modules-hashed at build time, so we target
 * the stable data-attribute we added to AISpotlight.tsx instead. */
const SELECTOR = 'section#ai [data-capture="aispotlight-visual"]';

/* One full RCA cycle (matches LOOP_INTERVAL_MS in AISpotlight.tsx).
 * The internal CSS animations land around t=7.15s, then the panel sits
 * in its resolved state, then `rcaLoopFade` drops opacity from 1 → 0
 * during 94–100% (≈ t=10.81 → t=11.5s). Capturing the FULL 11.5s means
 * the loop-back inside the encoded video happens at opacity 0, which
 * hides the seam visually. */
const CYCLE_MS = Number(process.env.CYCLE_MS) || 11_500;
const FPS = Number(process.env.FPS) || 30;
const TOTAL_FRAMES = Math.round((CYCLE_MS / 1000) * FPS);

/* Tall enough to keep the whole .visual on screen at desktop sizes. */
const VIEWPORT = { width: 1440, height: 1024 };
/* Retina-quality frames. ffmpeg downscales later for GIF. */
const DEVICE_SCALE_FACTOR = 2;

const BUILD_DIR = path.join(ROOT, 'build', 'capture-aispotlight');
const FRAMES_DIR = path.join(BUILD_DIR, 'frames');
const OUT_DIR = path.join(ROOT, 'public', 'media');
const OUT_WEBM = path.join(OUT_DIR, 'aispotlight.webm');
const OUT_MP4 = path.join(OUT_DIR, 'aispotlight.mp4');
const OUT_GIF = path.join(OUT_DIR, 'aispotlight.gif');
const OUT_POSTER = path.join(OUT_DIR, 'aispotlight-poster.jpg');

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
  console.log(
    `▶ Duration: ${formatMs(CYCLE_MS)} @ ${FPS}fps → ${TOTAL_FRAMES} frames`,
  );
  console.log(`▶ Viewport: ${VIEWPORT.width}×${VIEWPORT.height} @ ${DEVICE_SCALE_FACTOR}x DPR`);

  await ensureFresh(FRAMES_DIR);
  await mkdir(OUT_DIR, { recursive: true });

  console.log('\n▶ Launching Chromium...');
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: DEVICE_SCALE_FACTOR,
    reducedMotion: 'no-preference',
  });
  const page = await ctx.newPage();

  console.log(`▶ Navigating to ${SITE_URL}...`);
  await page.goto(SITE_URL, { waitUntil: 'networkidle', timeout: 30_000 });

  console.log('▶ Scrolling AI Spotlight into view...');
  await page.locator(SELECTOR).scrollIntoViewIfNeeded();

  console.log('▶ Waiting for .reveal.visible class on .visual...');
  await page.waitForSelector(`${SELECTOR}.reveal.visible`, { timeout: 15_000 });

  /* Wait for the alertmend logo inside .rca to finish loading so the
   * first frame isn't a missing-image placeholder. */
  await page.waitForFunction(
    (sel) => {
      const img = document.querySelector(`${sel} img`);
      return !!img && img.complete && img.naturalWidth > 0;
    },
    SELECTOR,
    { timeout: 10_000 },
  );

  /* Freeze ALL JS timers. The AISpotlight loop driver uses setInterval
   * to remount the .rca subtree every 11.5s; if it fires mid-capture
   * the screenshot stream would catch a half-built panel. We also
   * preemptively cancel pending setTimeouts to be safe.
   *
   * This alone is NOT enough — the CSS animations themselves keep
   * running on the browser's real-time clock, and a single screenshot
   * at 2x DPR takes ~150ms, so a 30fps capture loop drifts ~5x slower
   * than the animation. We deal with that next by freezing the Web
   * Animations timeline and stepping it manually. */
  console.log('▶ Freezing JS timers (so React cannot remount mid-capture)...');
  await page.evaluate(() => {
    const intervalSentinel = window.setInterval(() => {}, 1e9);
    for (let i = 1; i <= intervalSentinel; i++) window.clearInterval(i);
    const timeoutSentinel = window.setTimeout(() => {}, 1e9);
    for (let i = 1; i <= timeoutSentinel; i++) window.clearTimeout(i);
  });

  /* Pause every CSS animation on the page and rewind it to t=0. The
   * Web Animations API exposes every CSS keyframe animation as an
   * Animation object via document.getAnimations(); pausing them
   * decouples the captured frames from wall-clock time entirely.
   *
   * After this call, the only thing that advances the visual state is
   * our explicit `Animation.currentTime = t` step below, run once per
   * captured frame. Screenshot duration no longer matters. */
  console.log('▶ Pausing & rewinding all CSS animations to t=0...');
  const animCount = await page.evaluate(() => {
    const all = document.getAnimations();
    for (const a of all) {
      a.pause();
      a.currentTime = 0;
    }
    /* Stash the animations on window so the per-frame step doesn't
     * have to scan the entire document tree every time. */
    window.__capturedAnimations = all;
    return all.length;
  });
  console.log(`  Found ${animCount} animations to drive.`);
  if (animCount === 0) {
    throw new Error(
      'No CSS animations found on page. The .reveal.visible class may not have applied yet, or animations finished before we paused them.',
    );
  }

  console.log(`\n▶ Capturing ${TOTAL_FRAMES} frames (step-driven)...`);
  const visual = page.locator(SELECTOR);
  const startWall = Date.now();
  const frameMs = 1000 / FPS;

  for (let i = 0; i < TOTAL_FRAMES; i++) {
    const t = i * frameMs;
    /* Advance every animation to t milliseconds, then wait for two
     * requestAnimationFrame ticks so the browser definitely composites
     * the new state before our screenshot reads pixels. Without this
     * the screenshot races the compositor and we get torn/stale frames
     * (especially common at 2x DPR where compositing takes longer). */
    await page.evaluate(
      ({ tMs }) =>
        new Promise((resolve) => {
          const all = window.__capturedAnimations || document.getAnimations();
          for (const a of all) {
            try {
              a.currentTime = tMs;
            } catch {
              /* Animation may have been GC'd; safe to ignore. */
            }
          }
          requestAnimationFrame(() => requestAnimationFrame(resolve));
        }),
      { tMs: t },
    );

    const filename = path.join(FRAMES_DIR, `f-${String(i).padStart(5, '0')}.png`);
    await visual.screenshot({ path: filename });

    if ((i + 1) % 30 === 0 || i + 1 === TOTAL_FRAMES) {
      const pct = Math.round((100 * (i + 1)) / TOTAL_FRAMES);
      const wall = ((Date.now() - startWall) / 1000).toFixed(1);
      console.log(
        `  ${String(i + 1).padStart(3)}/${TOTAL_FRAMES} frames (${pct}%, ${wall}s wall)`,
      );
    }
  }

  const wallMs = Date.now() - startWall;
  console.log(
    `✓ Captured ${TOTAL_FRAMES} frames in ${formatMs(wallMs)} wall-time ` +
      `(animation timeline: ${formatMs(CYCLE_MS)}).`,
  );

  await browser.close();

  /* ----- Encode WebM (VP9) -- primary delivery format -----
   * VP9 in WebM gives the best size/quality at this resolution and is
   * supported by every browser we care about (Chrome 25+, Firefox 28+,
   * Safari 14.1+, Edge). pix_fmt yuv420p keeps it compatible with
   * hardware decoders. CRF 30 + b:v 0 is "constant quality, target
   * given visual quality, ignore bitrate"; tweakable if you want
   * smaller files. */
  console.log('\n▶ Encoding WebM (VP9)...');
  await runFfmpeg(
    [
      '-y',
      '-framerate', String(FPS),
      '-i', path.join(FRAMES_DIR, 'f-%05d.png'),
      '-c:v', 'libvpx-vp9',
      '-pix_fmt', 'yuv420p',
      '-b:v', '0',
      '-crf', '30',
      '-deadline', 'good',
      '-cpu-used', '2',
      '-row-mt', '1',
      '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2',
      OUT_WEBM,
    ],
    'webm',
  );

  /* ----- Encode MP4 (H.264) -- Safari/iOS fallback ----- */
  console.log('\n▶ Encoding MP4 (H.264)...');
  await runFfmpeg(
    [
      '-y',
      '-framerate', String(FPS),
      '-i', path.join(FRAMES_DIR, 'f-%05d.png'),
      '-c:v', 'libx264',
      '-pix_fmt', 'yuv420p',
      '-preset', 'slow',
      '-crf', '20',
      '-movflags', '+faststart',
      '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2',
      OUT_MP4,
    ],
    'mp4',
  );

  /* ----- Encode GIF (palette + bayer dither) -----
   * GIFs hate gradients and fine UI text. Two-pass palette generation
   * with diff stats_mode keeps the palette stable across frames; bayer
   * dithering preserves anti-aliased edges instead of mushing them. We
   * also downscale to 720px wide because retina GIF is wasteful. */
  console.log('\n▶ Encoding GIF (palette + bayer dither)...');
  const GIF_WIDTH = 720;
  const GIF_FPS = 24;
  await runFfmpeg(
    [
      '-y',
      '-framerate', String(FPS),
      '-i', path.join(FRAMES_DIR, 'f-%05d.png'),
      '-filter_complex',
      `fps=${GIF_FPS},scale=${GIF_WIDTH}:-1:flags=lanczos,split [a][b];` +
        ` [a] palettegen=stats_mode=diff:max_colors=192 [p];` +
        ` [b][p] paletteuse=dither=bayer:bayer_scale=4:diff_mode=rectangle`,
      '-loop', '0',
      OUT_GIF,
    ],
    'gif',
  );

  /* ----- Encode poster (still frame for <video poster=>) -----
   * Pick a frame from the resolved phase (~t=8.2s = frame 246 @ 30fps)
   * so the static still shows a completed RCA, not an in-progress one.
   * That's a much better thumbnail when JS is slow to start or when
   * the video is muted on a paused tab. */
  const posterFrame = Math.min(TOTAL_FRAMES - 1, Math.round(8.2 * FPS));
  const posterSource = path.join(
    FRAMES_DIR,
    `f-${String(posterFrame).padStart(5, '0')}.png`,
  );
  console.log(`\n▶ Encoding poster (frame ${posterFrame} = t=${formatMs((posterFrame / FPS) * 1000)})...`);
  await runFfmpeg(
    ['-y', '-i', posterSource, '-q:v', '4', OUT_POSTER],
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
