/**
 * Build a silent 1920×1080 booth loop for AlertMend at LEAP 5.
 *
 * The clip is authored as self-contained HTML (intro → AI RCA demo → CTA)
 * and recorded in headless Chromium. Outputs land in public/media/ for
 * USB playback on booth screens or upload to event portals.
 *
 * Scenes (24s loop @ 30fps)
 * -------------------------
 *   0–4s   Intro — LEAP 5 + AlertMend, booth H1A.P178, Riyadh dates
 *   4–16s  Demo  — embedded aispotlight.mp4 (AI RCA screencast)
 *   16–24s CTA   — value props + alertmend.io + book a meeting
 *
 * Usage
 * -----
 *   npm run build:leap-booth-video
 *
 * Requires ffmpeg and Playwright Chromium. Needs network once to load Inter.
 */
import { chromium } from 'playwright'
import { mkdir, readFile, rm, readdir, stat, writeFile } from 'node:fs/promises'
import { spawn } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '..')

const WIDTH = 1920
const HEIGHT = 1080
const FPS = 30
const LOOP_MS = 24_000
const RECORD_MS = LOOP_MS + 800

const BUILD_DIR = path.join(ROOT, 'build', 'capture-leap-booth')
const RAW_DIR = path.join(BUILD_DIR, 'raw')
const OUT_DIR = path.join(ROOT, 'public', 'media')
const OUT_WEBM = path.join(OUT_DIR, 'leap-booth.webm')
const OUT_MP4 = path.join(OUT_DIR, 'leap-booth.mp4')
const OUT_POSTER = path.join(OUT_DIR, 'leap-booth-poster.jpg')

const LOGO_SVG = path.join(ROOT, 'public', 'logos', 'alertmend-logo.svg')
const LEAP_PNG = path.join(ROOT, 'public', 'logos', 'leap-5.png')
const DEMO_MP4 = path.join(OUT_DIR, 'aispotlight.mp4')

const BOOTH = 'H1A.P178'
const DATES = 'Aug 31 – Sept 3'
const LOCATION = 'Riyadh'
const CALENDLY = 'calendly.com/hello-alertmend'

function runFfmpeg(args, label) {
  return new Promise((resolve, reject) => {
    const p = spawn('ffmpeg', args, { stdio: ['ignore', 'inherit', 'inherit'] })
    p.on('exit', (code) =>
      code === 0 ? resolve() : reject(new Error(`ffmpeg (${label}) exited with code ${code}`)),
    )
    p.on('error', reject)
  })
}

async function fileSizeKB(p) {
  try {
    const s = await stat(p)
    return `${(s.size / 1024).toFixed(1)} KB`
  } catch {
    return '(missing)'
  }
}

function boothHtml({ logoDataUri, leapDataUri, demoFileUri }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700;800;900&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html, body {
    width: ${WIDTH}px;
    height: ${HEIGHT}px;
    overflow: hidden;
    background: #09090b;
    font-family: 'Inter', system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  .root {
    position: relative;
    width: 100%;
    height: 100%;
    animation: master ${LOOP_MS}ms linear infinite;
  }

  .scene {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    opacity: 0;
  }

  /* 0–4s intro, 4–16s demo, 16–24s cta */
  .intro {
    animation: showIntro ${LOOP_MS}ms linear infinite;
    background:
      linear-gradient(135deg, rgba(124, 58, 237, 0.18) 0%, transparent 55%),
      #09090b;
  }

  .demo { animation: showDemo ${LOOP_MS}ms linear infinite; }

  .cta {
    animation: showCta ${LOOP_MS}ms linear infinite;
    background:
      linear-gradient(180deg, #09090b 0%, #131316 100%);
  }

  @keyframes showIntro {
    0%, 1% { opacity: 1; }
    16.5% { opacity: 1; }
    18% { opacity: 0; }
    83% { opacity: 0; }
    84.5% { opacity: 1; }
    100% { opacity: 1; }
  }

  @keyframes showDemo {
    0%, 17% { opacity: 0; }
    18.5% { opacity: 1; }
    65% { opacity: 1; }
    66.5% { opacity: 0; }
    100% { opacity: 0; }
  }

  @keyframes showCta {
    0%, 65% { opacity: 0; }
    67% { opacity: 1; }
    82% { opacity: 1; }
    83.5% { opacity: 0; }
    100% { opacity: 0; }
  }

  .topBar {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0;
    height: 72px;
    background: linear-gradient(
      90deg,
      #c026d3 0%,
      #7c3aed 42%,
      #6366f1 72%,
      #06b6d4 100%
    );
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.35);
  }

  .topBar span {
    font-size: 22px;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #fff;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
  }

  .introBody {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 36px;
    padding: 48px 80px 72px;
  }

  .logoRow {
    display: flex;
    align-items: center;
    gap: 28px;
  }

  .logoRow img.leap {
    height: 120px;
    width: auto;
    border-radius: 16px;
    border: 3px solid rgba(255, 255, 255, 0.45);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.45);
  }

  .logoRow img.am {
    width: 88px;
    height: 88px;
    filter: brightness(0) invert(1);
  }

  .plus {
    font-size: 56px;
    font-weight: 300;
    color: #52525b;
  }

  .introTitle {
    text-align: center;
    font-size: 72px;
    font-weight: 900;
    line-height: 1.05;
    letter-spacing: -0.035em;
    color: #fafafa;
  }

  .introTitle .violet { color: #a78bfa; }

  .introSub {
    text-align: center;
    max-width: 980px;
    font-size: 30px;
    font-weight: 500;
    line-height: 1.45;
    color: #a1a1aa;
  }

  .boothChip {
    display: inline-flex;
    align-items: center;
    gap: 14px;
    margin-top: 8px;
    padding: 18px 32px;
    border-radius: 14px;
    background: rgba(124, 58, 237, 0.14);
    border: 2px solid rgba(167, 139, 250, 0.45);
  }

  .boothChip .label {
    font-size: 16px;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #a5f3fc;
  }

  .boothChip .num {
    font-size: 42px;
    font-weight: 900;
    letter-spacing: 0.02em;
    color: #fafafa;
    font-variant-numeric: tabular-nums;
  }

  .metaRow {
    display: flex;
    align-items: center;
    gap: 18px;
    font-size: 26px;
    font-weight: 600;
    color: #d4d4d8;
  }

  .metaRow .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #71717a;
  }

  .demoLayout {
    flex: 1;
    display: grid;
    grid-template-columns: 420px 1fr;
    gap: 0;
    min-height: 0;
  }

  .demoAside {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 28px;
    padding: 56px 48px;
    background: #0c0c0f;
    border-right: 1px solid #27272a;
  }

  .demoAside h2 {
    font-size: 42px;
    font-weight: 800;
    line-height: 1.12;
    letter-spacing: -0.03em;
    color: #fafafa;
  }

  .demoAside h2 span { color: #a78bfa; }

  .demoAside p {
    font-size: 22px;
    line-height: 1.5;
    color: #a1a1aa;
  }

  .demoAside .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .chip {
    padding: 10px 16px;
    border-radius: 8px;
    border: 1px solid #3f3f46;
    background: #18181b;
    font-size: 16px;
    font-weight: 600;
    color: #e4e4e7;
  }

  .demoFrame {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px 56px;
    background:
      radial-gradient(circle at 30% 20%, rgba(124, 58, 237, 0.12) 0%, transparent 50%),
      #09090b;
  }

  .demoFrame video {
    max-height: 100%;
    max-width: 100%;
    border-radius: 18px;
    border: 1px solid #3f3f46;
    box-shadow: 0 24px 80px rgba(0, 0, 0, 0.55);
  }

  .ctaBody {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 40px;
    padding: 64px 80px;
  }

  .ctaBody h2 {
    text-align: center;
    font-size: 64px;
    font-weight: 900;
    line-height: 1.08;
    letter-spacing: -0.03em;
    color: #fafafa;
  }

  .ctaGrid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    width: 100%;
    max-width: 1400px;
  }

  .ctaCard {
    padding: 32px 28px;
    border-radius: 16px;
    border: 1px solid #3f3f46;
    background: #131316;
    text-align: center;
  }

  .ctaCard strong {
    display: block;
    margin-bottom: 10px;
    font-size: 28px;
    font-weight: 800;
    color: #fafafa;
  }

  .ctaCard span {
    font-size: 20px;
    line-height: 1.45;
    color: #a1a1aa;
  }

  .ctaFoot {
    display: flex;
    align-items: center;
    gap: 32px;
    margin-top: 12px;
  }

  .domain {
    font-size: 44px;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: #a78bfa;
  }

  .meet {
    padding: 16px 28px;
    border-radius: 12px;
    background: #fff;
    color: #18181b;
    font-size: 24px;
    font-weight: 800;
  }
</style>
</head>
<body>
  <div class="root">
    <section class="scene intro">
      <div class="topBar"><span>LEAP 5 · Riyadh</span></div>
      <div class="introBody">
        <div class="logoRow">
          <img class="leap" src="${leapDataUri}" alt="">
          <span class="plus">×</span>
          <img class="am" src="${logoDataUri}" alt="">
        </div>
        <h1 class="introTitle">Meet <span class="violet">AlertMend</span><br>at LEAP 5</h1>
        <p class="introSub">
          AI observability that finds root cause with evidence — and ships an approved fix.
        </p>
        <div class="boothChip">
          <span class="label">Booth</span>
          <span class="num">${BOOTH}</span>
        </div>
        <div class="metaRow">
          <span>${LOCATION}</span>
          <span class="dot"></span>
          <span>${DATES}</span>
        </div>
      </div>
    </section>

    <section class="scene demo">
      <div class="topBar"><span>Live product demo</span></div>
      <div class="demoLayout">
        <aside class="demoAside">
          <h2>From alert to <span>root cause</span> in ~15s</h2>
          <p>Traces, logs, metrics and K8s events on one timeline — with citations and confidence.</p>
          <div class="chips">
            <span class="chip">Observability</span>
            <span class="chip">AI RCA</span>
            <span class="chip">Auto-remediation</span>
          </div>
        </aside>
        <div class="demoFrame">
          <video id="demo" muted playsinline autoplay loop src="${demoFileUri}"></video>
        </div>
      </div>
    </section>

    <section class="scene cta">
      <div class="topBar"><span>Book a meeting · Booth ${BOOTH}</span></div>
      <div class="ctaBody">
        <h2>Stop firefighting.<br>Start approving fixes.</h2>
        <div class="ctaGrid">
          <div class="ctaCard">
            <strong>Observe</strong>
            <span>Metrics, logs, traces and K8s events on one timeline</span>
          </div>
          <div class="ctaCard">
            <strong>Diagnose</strong>
            <span>AI RCA with evidence citations and confidence scoring</span>
          </div>
          <div class="ctaCard">
            <strong>Fix</strong>
            <span>Remediation gated by Slack or Teams approval</span>
          </div>
        </div>
        <div class="ctaFoot">
          <span class="domain">alertmend.io</span>
          <span class="meet">${CALENDLY}</span>
        </div>
      </div>
    </section>
  </div>
</body>
</html>`
}

async function main() {
  console.log('\n▶ LEAP booth video build')
  console.log(`▶ Canvas: ${WIDTH}×${HEIGHT}, loop ${LOOP_MS / 1000}s @ ${FPS}fps`)

  try {
    await stat(DEMO_MP4)
  } catch {
    throw new Error(
      `Missing ${path.relative(ROOT, DEMO_MP4)}. Run npm run capture:aispotlight first, ` +
        'or ensure the demo asset is present.',
    )
  }

  await rm(BUILD_DIR, { recursive: true, force: true })
  await mkdir(RAW_DIR, { recursive: true })
  await mkdir(OUT_DIR, { recursive: true })

  const [logoSvg, leapPng] = await Promise.all([readFile(LOGO_SVG), readFile(LEAP_PNG)])
  const logoDataUri = `data:image/svg+xml;base64,${logoSvg.toString('base64')}`
  const leapDataUri = `data:image/png;base64,${leapPng.toString('base64')}`

  const htmlPath = path.join(BUILD_DIR, 'booth.html')
  const demoFileUri = `file://${DEMO_MP4}`
  await writeFile(htmlPath, boothHtml({ logoDataUri, leapDataUri, demoFileUri }))

  console.log('\n▶ Recording booth loop in Chromium...')
  const browser = await chromium.launch({ headless: true })
  let rawWebm

  try {
    const ctx = await browser.newContext({
      viewport: { width: WIDTH, height: HEIGHT },
      deviceScaleFactor: 1,
      recordVideo: { dir: RAW_DIR, size: { width: WIDTH, height: HEIGHT } },
      reducedMotion: 'no-preference',
    })
    const page = await ctx.newPage()
    await page.goto(`file://${htmlPath}`, { waitUntil: 'load', timeout: 30_000 })
    await page.waitForFunction(() => document.fonts.ready.then(() => true))
    await page.waitForFunction(
      () => {
        const v = document.querySelector('#demo')
        return !!v && v.readyState >= 3
      },
      { timeout: 20_000 },
    )
    await page.evaluate(() => {
      const v = document.querySelector('#demo')
      if (v) {
        v.currentTime = 0
        void v.play()
      }
    })
    await page.waitForTimeout(RECORD_MS)
    const video = page.video()
    await ctx.close()
    rawWebm = video ? await video.path() : null
  } finally {
    await browser.close()
  }

  if (!rawWebm) {
    const files = await readdir(RAW_DIR)
    rawWebm = files.find((f) => f.endsWith('.webm'))
    if (rawWebm) rawWebm = path.join(RAW_DIR, rawWebm)
  }
  if (!rawWebm) throw new Error('Playwright did not produce a raw recording')

  console.log('\n▶ Trimming to one loop and encoding deliverables...')
  const trimSec = (LOOP_MS / 1000).toFixed(3)

  await runFfmpeg(
    [
      '-y',
      '-i',
      rawWebm,
      '-t',
      trimSec,
      '-c:v',
      'libvpx-vp9',
      '-pix_fmt',
      'yuv420p',
      '-b:v',
      '0',
      '-crf',
      '28',
      '-deadline',
      'good',
      '-cpu-used',
      '2',
      '-row-mt',
      '1',
      OUT_WEBM,
    ],
    'webm',
  )

  await runFfmpeg(
    [
      '-y',
      '-i',
      rawWebm,
      '-t',
      trimSec,
      '-c:v',
      'libx264',
      '-pix_fmt',
      'yuv420p',
      '-preset',
      'slow',
      '-crf',
      '18',
      '-movflags',
      '+faststart',
      OUT_MP4,
    ],
    'mp4',
  )

  await runFfmpeg(
    ['-y', '-ss', '1.5', '-i', OUT_MP4, '-frames:v', '1', '-update', '1', '-q:v', '4', OUT_POSTER],
    'poster',
  )

  console.log('\n✓ Done.')
  console.log('  Outputs:')
  console.log(`    WebM:   ${path.relative(ROOT, OUT_WEBM)}   (${await fileSizeKB(OUT_WEBM)})`)
  console.log(`    MP4:    ${path.relative(ROOT, OUT_MP4)}    (${await fileSizeKB(OUT_MP4)})`)
  console.log(`    Poster: ${path.relative(ROOT, OUT_POSTER)} (${await fileSizeKB(OUT_POSTER)})`)
}

main().catch((err) => {
  console.error('\n✗ LEAP booth video build failed:', err.message || err)
  process.exit(1)
})
