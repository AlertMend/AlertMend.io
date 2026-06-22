/**
 * Renders openclaw-hero.svg to PNG for OG/Twitter (1200×630).
 * Run: node scripts/capture-openclaw-og.mjs
 */
import { chromium } from 'playwright'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const assetsDir = path.join(root, 'public/assets/openclaw-cloud-infra-slack-telegram')
const svgPath = path.join(assetsDir, 'openclaw-hero.svg')
const outPath = path.join(assetsDir, 'openclaw-hero.png')

const svg = fs.readFileSync(svgPath, 'utf8')
const lobster = fs.readFileSync(path.join(assetsDir, 'pixel-lobster.svg'), 'utf8')
const lobsterDataUri = `data:image/svg+xml;base64,${Buffer.from(lobster).toString('base64')}`
const inlinedSvg = svg.replace(
  /href="https:\/\/www\.alertmend\.io\/assets\/openclaw-cloud-infra-slack-telegram\/pixel-lobster\.svg"/,
  `href="${lobsterDataUri}"`
)

const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>html,body{margin:0;padding:0;background:#fafafa}</style></head>
<body>${inlinedSvg}</body></html>`

const tmpHtml = path.join(assetsDir, '.og-capture.html')
fs.writeFileSync(tmpHtml, html)

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
await page.goto('file://' + tmpHtml)
await page.screenshot({ path: outPath, type: 'png' })
await browser.close()
fs.unlinkSync(tmpHtml)

console.log('✓ Wrote', outPath)
