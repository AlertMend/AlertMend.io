// One-shot pre-push audit of dist/: meta completeness, duplicate titles/descriptions,
// internal links that have no prerendered HTML, and sitemap/prerender drift.
import fs from 'node:fs'
import path from 'node:path'

const distDir = path.resolve('dist')

const htmlFiles = []
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full)
    else if (entry.name.endsWith('.html')) htmlFiles.push(full)
  }
}
walk(distDir)

const routeFor = (file) => {
  const rel = path.relative(distDir, file)
  if (rel === 'index.html') return '/'
  return '/' + rel.replace(/\/index\.html$/, '').replace(/\.html$/, '')
}

const pick = (html, re) => {
  const m = html.match(re)
  return m ? m[1].trim() : ''
}

const pages = htmlFiles.map((file) => {
  const html = fs.readFileSync(file, 'utf-8')
  return {
    route: routeFor(file),
    file,
    title: pick(html, /<title[^>]*>([\s\S]*?)<\/title>/i),
    desc: pick(html, /<meta[^>]+name="description"[^>]+content="([^"]*)"/i),
    canonical: pick(html, /<link[^>]+rel="canonical"[^>]+href="([^"]*)"/i),
    ogTitle: pick(html, /<meta[^>]+property="og:title"[^>]+content="([^"]*)"/i),
    ogImage: pick(html, /<meta[^>]+property="og:image"[^>]+content="([^"]*)"/i),
    h1Count: (html.match(/<h1[\s>]/gi) || []).length,
    hrefs: [...html.matchAll(/href="(\/[^"#?]*)"/g)].map((m) => m[1]),
    html
  }
})

const problems = []
const report = (kind, detail) => problems.push({ kind, detail })

// 1. meta completeness
for (const p of pages) {
  if (!p.title) report('missing <title>', p.route)
  if (!p.desc) report('missing meta description', p.route)
  if (!p.canonical) report('missing canonical', p.route)
  if (!p.ogImage) report('missing og:image', p.route)
  if (p.h1Count === 0) report('no <h1>', p.route)
  if (p.h1Count > 1) report(`${p.h1Count} <h1> tags`, p.route)
  if (p.desc && (p.desc.length < 70 || p.desc.length > 165)) {
    report(`meta description length ${p.desc.length}`, p.route)
  }
}

// 2. duplicate titles / descriptions
const groupBy = (key) => {
  const map = new Map()
  for (const p of pages) {
    const v = p[key]
    if (!v) continue
    if (!map.has(v)) map.set(v, [])
    map.get(v).push(p.route)
  }
  return [...map.entries()].filter(([, routes]) => routes.length > 1)
}
for (const [title, routes] of groupBy('title')) {
  report('duplicate <title>', `"${title.slice(0, 60)}" -> ${routes.join(', ')}`)
}
for (const [desc, routes] of groupBy('desc')) {
  report('duplicate description', `"${desc.slice(0, 55)}..." -> ${routes.join(', ')}`)
}

// 3. canonical must match its own route
for (const p of pages) {
  if (!p.canonical) continue
  const canonPath = p.canonical.replace(/^https?:\/\/[^/]+/, '').replace(/\/$/, '') || '/'
  const own = p.route.replace(/\/$/, '') || '/'
  if (canonPath !== own) report('canonical != route', `${own} -> ${canonPath}`)
}

// 4. internal links with no prerendered HTML (SPA-fallback only)
const known = new Set(pages.map((p) => p.route.replace(/\/$/, '') || '/'))
const assetExists = (link) => fs.existsSync(path.join(distDir, link.replace(/^\//, '')))
const missing = new Map()
for (const p of pages) {
  for (const href of new Set(p.hrefs)) {
    const clean = href.replace(/\/$/, '') || '/'
    if (known.has(clean)) continue
    if (assetExists(href)) continue
    if (!missing.has(clean)) missing.set(clean, new Set())
    missing.get(clean).add(p.route)
  }
}
for (const [link, from] of [...missing].sort()) {
  report('link has no static HTML', `${link}  (linked from ${[...from].slice(0, 3).join(', ')}${from.size > 3 ? ` +${from.size - 3} more` : ''})`)
}

// 5. sitemap vs prerender drift
const sitemap = fs.readFileSync('public/sitemap.xml', 'utf-8')
const sitemapRoutes = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((m) => m[1].replace(/^https?:\/\/[^/]+/, '').replace(/\/$/, '') || '/')
const notPrerendered = sitemapRoutes.filter((r) => !known.has(r))

console.log(`Audited ${pages.length} HTML files in dist/\n`)
const byKind = new Map()
for (const { kind, detail } of problems) {
  if (!byKind.has(kind)) byKind.set(kind, [])
  byKind.get(kind).push(detail)
}
for (const [kind, details] of [...byKind].sort((a, b) => b[1].length - a[1].length)) {
  console.log(`\n## ${kind} (${details.length})`)
  for (const d of details.slice(0, 25)) console.log(`   - ${d}`)
  if (details.length > 25) console.log(`   ... +${details.length - 25} more`)
}

console.log(`\n## sitemap URLs with no prerendered HTML (${notPrerendered.length} of ${sitemapRoutes.length})`)
for (const r of notPrerendered.slice(0, 30)) console.log(`   - ${r}`)
if (notPrerendered.length > 30) console.log(`   ... +${notPrerendered.length - 30} more`)
