/**
 * Quick smoke test: open the dev server in headless Chromium, scroll
 * to the AI Spotlight section, and confirm the new <video> element
 * actually loads + starts playing the recorded screencast. Prints a
 * compact PASS/FAIL summary so CI / a human can tell at a glance.
 *
 * Not wired into `npm run build` — invoke manually after running
 * `npm run capture:aispotlight` to confirm the swap took effect.
 */
import { chromium } from 'playwright';

const URL = process.env.SITE_URL || 'http://localhost:5173/';
const SELECTOR = 'section#ai [data-capture="aispotlight-visual"] video';

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 1024 },
  deviceScaleFactor: 2,
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
ok('Scrolled .visual into view');

const video = page.locator(SELECTOR);
const count = await video.count();
if (count === 1) ok('Found exactly one <video> in .visual');
else fail(`Expected 1 video, found ${count}`);

/* Wait for the video to fully load enough to play. readyState >= 3
 * (HAVE_FUTURE_DATA) means the browser can confidently play forward. */
await page.waitForFunction(
  (sel) => {
    const v = document.querySelector(sel);
    return v && v.readyState >= 3;
  },
  SELECTOR,
  { timeout: 10_000 },
);
ok('Video readyState ≥ 3 (HAVE_FUTURE_DATA)');

/* Give the autoplay path a beat, then check that the video has
 * actually advanced its currentTime — that proves it is playing,
 * not just paused with the poster showing. */
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

if (stats.duration > 10 && stats.duration < 13) ok(`Duration ≈ 11.5s (got ${stats.duration.toFixed(2)}s)`);
else fail(`Duration is ${stats.duration}, expected ~11.5s`);

if (stats.videoWidth === 1088 && stats.videoHeight === 1730) ok(`Native resolution is 1088×1730 as captured`);
else fail(`Native resolution is ${stats.videoWidth}×${stats.videoHeight}, expected 1088×1730`);

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
