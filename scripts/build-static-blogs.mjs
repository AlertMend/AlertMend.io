/**
 * Builds rich interactive static blog pages.
 * - If scripts/static-blogs/{slug}.mjs exists, runs its build() generator.
 * - Otherwise syncs hand-authored public/blog/{slug}/index.html to dist.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import { discoverStaticBlogSlugs } from './discover-static-blogs.mjs'
import { syncHandAuthoredStaticBlog } from './static-blog-shared.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const slugs = discoverStaticBlogSlugs()

if (slugs.length === 0) {
  console.log('No rich static blogs found (need public/blog/{slug}/index.html + {slug}.md)')
}

for (const slug of slugs) {
  const builderPath = path.join(__dirname, 'static-blogs', `${slug}.mjs`)
  if (fs.existsSync(builderPath)) {
    const mod = await import(pathToFileURL(builderPath).href)
    await mod.build(slug)
  } else {
    syncHandAuthoredStaticBlog(slug)
  }
}
