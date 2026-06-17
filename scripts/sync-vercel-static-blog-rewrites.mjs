import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { discoverStaticBlogSlugs } from './discover-static-blogs.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const vercelPath = path.join(root, 'vercel.json')

const slugs = discoverStaticBlogSlugs()
const config = JSON.parse(fs.readFileSync(vercelPath, 'utf8'))

const staticRewrites = slugs.map((slug) => ({
  source: `/blog/${slug}`,
  destination: `/blog/${slug}/index.html`,
}))

const staticSources = new Set(staticRewrites.map((r) => r.source))

const otherRewrites = config.rewrites.filter((r) => {
  if (staticSources.has(r.source)) return false
  // Remove stale static blog rewrites (directory index targets under /blog/)
  if (
    r.source?.startsWith('/blog/') &&
    !r.source.includes(':') &&
    r.destination?.endsWith('/index.html')
  ) {
    return false
  }
  return true
})

const blogIndexIdx = otherRewrites.findIndex((r) => r.source === '/blog')
const insertAt = blogIndexIdx >= 0 ? blogIndexIdx + 1 : 0

const before = otherRewrites.slice(0, insertAt)
const after = otherRewrites.slice(insertAt)
config.rewrites = [...before, ...staticRewrites, ...after]

fs.writeFileSync(vercelPath, JSON.stringify(config, null, 2) + '\n')
console.log(`✓ vercel.json: ${staticRewrites.length} static blog rewrite(s)`)
