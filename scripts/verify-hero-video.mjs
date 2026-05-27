\






]]/**
 * Smoke test: open the dev server in headless Chromium, find the
 * Hero <video>, and confirm it loads, autoplays muted, loops, and
 * has the expected source/dimensions/duration. Companion to
 * scripts/verify-aispotlight-video.mjs.
 *
 * Not wired into `npm run build` — invoke manually after running
 * `npm run capture:hero` to confirm the swap took effect.
 */
import { chromium } from 'playwright';

const URL = process.env.SITE_URL || 'http://localhost:5173/';
const SELECTOR = 'section#top [data-capture="hero-demo"] video';

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 1024 },
});
const page = await ctx.newPage();

const errors = [];
const ok = (msg) => console.log(`✓ ${msg}`);
const fail = (msg) => {
  console.log(`✗ ${msg}`);
  errors.push(msg);
};

await page.goto(URL, { waitUntil: 'networkidle' });
ok(`Loaded ${URL}`);

await page.locator(SELECTOR).scrollIntoViewIfNeeded({ timeout: 10_000 });
ok('Scrolled Hero video into view');

const video = page.locator(SELECTOR);
const count = await video.count();
if (count === 1) ok('Found exactly one <video> in Hero');
else fail(`Expected 1 video, found ${count}`);

await page.waitForFunction(
  (sel) => {
    const v = document.querySelector(sel);
    return v && v.readyState >= 3;
  },
  SELECTOR,
  { timeout: 10_000 },
);
ok('Video readyState ≥ 3 (HAVE_FUTURE_DATA)');

await page.waitForTimeout(1200);

const stats = await page.evaluate((sel) => {
  const v = document.querySelector(sel);
  return {
    currentTime: v?.currentTime ?? null,
    paused: v?.paused ?? null,
    muted: v?.muted ?? null,
    loop: v?.loop ?? null,
    duration: v?.duration ?? null,
    videoWidth: v?.videoWidth ?? null,
    videoHeight: v?.videoHeight ?? null,
    currentSrc: v?.currentSrc ?? null,
  };
}, SELECTOR);

console.log('\nVideo state:');
console.log(JSON.stringify(stats, null, 2));

if (stats.currentTime > 0.5) ok(`Video is playing (currentTime=${stats.currentTime.toFixed(2)}s)`);
else fail(`Video does not appear to be playing (currentTime=${stats.currentTime})`);

if (stats.loop === true) ok('Loop attribute is on');
else fail(`Loop attribute is ${stats.loop}`);

if (stats.muted === true) ok('Muted (required for autoplay)');
else fail(`Muted is ${stats.muted}`);

/* CYCLE_MS in capture-hero.mjs is 20.38s; allow a generous window. */
/* Trimmed window is PRESS → RCA → PR_GLIDE → ~half of PR_PRESS (see
 * scripts/capture-hero.mjs TRIM_MS = 11200). Allow ±1s slack so this
 * passes regardless of small VP9 GOP rounding. */
if (stats.duration > 10 && stats.duration < 13) ok(`Duration ≈ 11.2s (got ${stats.duration.toFixed(2)}s)`);
else fail(`Duration is ${stats.duration}, expected ~11.2s`);

if (stats.currentSrc && stats.currentSrc.endsWith('.webm')) ok('Browser picked the WebM source (primary)');
else if (stats.currentSrc && stats.currentSrc.endsWith('.mp4')) ok('Browser picked the MP4 source (Safari/iOS fallback)');
else fail(`Unexpected currentSrc: ${stats.currentSrc}`);

await browser.close();

if (errors.length === 0) {
  console.log('\n✓ All checks passed.');
} else {
  console.log(`\n✗ ${errors.length} check(s) failed.`);
  process.exit(1);
}
