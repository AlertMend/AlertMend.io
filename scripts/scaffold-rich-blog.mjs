import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

const slug = process.argv[2]
if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  console.error('Usage: npm run scaffold:blog -- <slug> ["Title for frontmatter"]')
  console.error('Example: npm run scaffold:blog -- monitor-patroni-using-alertmend "Patroni HA Monitoring"')
  process.exit(1)
}

const title = process.argv[3] || slug.replace(/-/g, ' ')
const today = new Date().toISOString().split('T')[0]

const blogDir = path.join(root, 'public/blog', slug)
const assetsDir = path.join(root, 'public/assets', slug)
const mdPath = path.join(root, 'public/blog', `${slug}.md`)
const templateDir = path.join(root, 'templates/rich-blog')

if (fs.existsSync(blogDir) || fs.existsSync(mdPath)) {
  console.error(`❌ Blog "${slug}" already exists`)
  process.exit(1)
}

function copyTemplate(name) {
  const src = path.join(templateDir, name)
  const dest = path.join(assetsDir, name)
  let content = fs.readFileSync(src, 'utf8')
  content = content
    .replaceAll('__SLUG__', slug)
    .replaceAll('__TITLE__', title)
    .replaceAll('__EXCERPT__', 'Replace with 50-160 character excerpt for meta description.')
    .replaceAll('__KEYWORDS__', 'keyword one, keyword two, keyword three')
    .replaceAll('__AUTHOR__', 'AlertMend Team')
  fs.writeFileSync(dest, content)
}

fs.mkdirSync(blogDir, { recursive: true })
fs.mkdirSync(assetsDir, { recursive: true })

copyTemplate('styles.css')
copyTemplate('script.js')

let indexHtml = fs.readFileSync(path.join(templateDir, 'index.html'), 'utf8')
indexHtml = indexHtml
  .replaceAll('__SLUG__', slug)
  .replaceAll('__TITLE__', title)
  .replaceAll('__EXCERPT__', 'Replace with 50-160 character excerpt for meta description.')
  .replaceAll('__KEYWORDS__', 'keyword one, keyword two, keyword three')
  .replaceAll('__AUTHOR__', 'AlertMend Team')
fs.writeFileSync(path.join(blogDir, 'index.html'), indexHtml)

// Placeholder hero SVG
fs.writeFileSync(
  path.join(assetsDir, 'hero.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#fafafa"/><text x="600" y="315" text-anchor="middle" font-family="system-ui,sans-serif" font-size="32" fill="#71717a">Replace hero.svg</text></svg>`
)

const frontmatter = `---
title: "${title}"
excerpt: "Replace with 50-160 character summary for meta description and blog cards."
date: "${today}"
category: "AIOps"
author: "AlertMend Team"
tags: ["AIOps", "Kubernetes"]
keywords: "keyword one, keyword two, keyword three, AlertMend"
---

This post is published as a standalone page at [/blog/${slug}](/blog/${slug}).
`

fs.writeFileSync(mdPath, frontmatter)

console.log(`✓ Scaffolded rich blog: ${slug}`)
console.log(`  public/blog/${slug}.md`)
console.log(`  public/blog/${slug}/index.html`)
console.log(`  public/assets/${slug}/`)
console.log('')
console.log('Next steps:')
console.log('  1. Edit index.html, styles.css, and add images to assets/')
console.log('  2. Update frontmatter in public/blog/' + slug + '.md')
console.log('  3. Copy nav + sidebar chrome from monitor-docling-using-alertmend/index.html')
console.log('  4. npm run generate:blog-list')
console.log('  5. npm run dev → http://localhost:5173/blog/' + slug)

try {
  execSync('npm run generate:blog-list', { cwd: root, stdio: 'inherit' })
} catch {
  console.warn('⚠ Run npm run generate:blog-list manually')
}
