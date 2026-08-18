/**
 * Render the social share card to public/og-image.jpg.
 *
 * Why this exists
 * ---------------
 * Every page on the site points og:image / twitter:image at
 * https://www.alertmend.io/og-image.jpg (see the ogImage default in
 * src/components/SEO.tsx and the head templates in
 * scripts/build-blog-html.js). That file used to be missing entirely, so
 * Vercel's SPA fallback answered the request with index.html at
 * content-type text/html and every LinkedIn / Slack / X unfurl showed a
 * broken image.
 *
 * Rather than hand-maintaining a JPEG in a design tool, the card is
 * authored here as HTML that reuses the marketing design tokens
 * (near-black + zinc neutrals, one violet accent, Inter, the real logo)
 * and rendered once in headless Chromium. Editing copy means editing this
 * file and re-running the script, which keeps the card honest when the
 * homepage positioning changes.
 *
 * Output
 * ------
 *   public/og-image.jpg   1200x630, the size LinkedIn / Slack / X expect
 *
 * The page is rendered at deviceScaleFactor 2 and screenshotted with
 * scale: 'css', so Chromium downsamples a 2400x1260 buffer into the
 * 1200x630 file. That keeps the type crisp instead of aliased, which a
 * straight 1x render would give.
 *
 * Usage
 * -----
 *   npm run build:og-image
 *
 * No dev server needed — the card is self-contained and set via
 * page.setContent(). Inter is pulled from Google Fonts, so this needs
 * network access; if the webfont fails to load the render is aborted
 * rather than silently shipping a system-font card.
 */
import { chromium } from 'playwright'
import { readFile, writeFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '..')

const WIDTH = 1200
const HEIGHT = 630
const OUTPUT = path.join(ROOT, 'public', 'og-image.jpg')
const LOGO = path.join(ROOT, 'public', 'logos', 'alertmend-logo.svg')

/* Kept in sync with the homepage hero + SEO description. */
const HEADLINE = ['From signal to root cause,', 'to an approved fix.']
const SUBLINE =
  'Metrics, logs, and traces on one timeline. AI RCA with evidence. Remediation gated by Slack or Teams approval.'
const CHIPS = ['Observability', 'AI RCA', 'Remediation', 'On-call', 'FinOps']

const card = (logoDataUri) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html, body {
    width: ${WIDTH}px;
    height: ${HEIGHT}px;
    overflow: hidden;
  }

  body {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    padding: 60px 68px 56px;
    background: #09090b;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  /* Single restrained violet accent, no second hue. */
  body::before {
    content: '';
    position: absolute;
    top: -280px;
    right: -220px;
    width: 820px;
    height: 820px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(124, 58, 237, 0.30) 0%, rgba(124, 58, 237, 0.10) 42%, transparent 70%);
  }

  body::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 4px;
    background: #7c3aed;
  }

  .row { position: relative; display: flex; align-items: center; }

  .brand { gap: 13px; }

  .brand img {
    width: 40px;
    height: 40px;
    object-fit: contain;
    /* Source mark is violet; flatten to white for the near-black card. */
    filter: brightness(0) invert(1);
  }

  .brandName {
    font-size: 29px;
    font-weight: 700;
    letter-spacing: -0.025em;
    color: #fafafa;
  }

  .middle { position: relative; }

  h1 {
    font-size: 68px;
    font-weight: 800;
    line-height: 1.06;
    letter-spacing: -0.035em;
    color: #fafafa;
  }

  h1 .accent { color: #a78bfa; }

  p {
    max-width: 880px;
    margin-top: 26px;
    font-size: 25px;
    font-weight: 400;
    line-height: 1.48;
    letter-spacing: -0.011em;
    color: #a1a1aa;
  }

  .foot { justify-content: space-between; }

  .chips { display: flex; align-items: center; gap: 10px; }

  .chip {
    padding: 9px 16px;
    border: 1px solid #27272a;
    border-radius: 8px;
    background: #131316;
    font-size: 17px;
    font-weight: 500;
    letter-spacing: -0.01em;
    color: #d4d4d8;
  }

  .domain {
    font-size: 21px;
    font-weight: 600;
    letter-spacing: -0.015em;
    color: #a78bfa;
  }
</style>
</head>
<body>
  <div class="row brand">
    <img src="${logoDataUri}" alt="">
    <span class="brandName">AlertMend</span>
  </div>

  <div class="middle">
    <h1>${HEADLINE[0]}<br><span class="accent">${HEADLINE[1]}</span></h1>
    <p>${SUBLINE}</p>
  </div>

  <div class="row foot">
    <div class="chips">
      ${CHIPS.map((chip) => `<span class="chip">${chip}</span>`).join('\n      ')}
    </div>
    <span class="domain">alertmend.io</span>
  </div>
</body>
</html>`

const run = async () => {
  const logoSvg = await readFile(LOGO)
  const logoDataUri = `data:image/svg+xml;base64,${logoSvg.toString('base64')}`

  const browser = await chromium.launch()
  try {
    const page = await browser.newPage({
      viewport: { width: WIDTH, height: HEIGHT },
      deviceScaleFactor: 2,
    })

    await page.setContent(card(logoDataUri), { waitUntil: 'load' })
    await page.waitForFunction(() => document.fonts.ready.then(() => true))

    const interLoaded = await page.evaluate(() =>
      document.fonts.check("700 68px 'Inter'"),
    )
    if (!interLoaded) {
      throw new Error(
        'Inter did not load from Google Fonts. Check network access and re-run, ' +
          'otherwise the card would ship with a system-font fallback.',
      )
    }

    const buffer = await page.screenshot({
      type: 'jpeg',
      quality: 92,
      scale: 'css',
    })
    await writeFile(OUTPUT, buffer)
  } finally {
    await browser.close()
  }

  const { size } = await stat(OUTPUT)
  console.log(
    `✓ Wrote ${path.relative(ROOT, OUTPUT)} (${WIDTH}x${HEIGHT}, ${(size / 1024).toFixed(0)} KB)`,
  )
}

run().catch((error) => {
  console.error(`✗ Failed to build og-image.jpg: ${error.message}`)
  process.exit(1)
})
