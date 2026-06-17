import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const blogDir = path.join(root, 'public/blog')

/**
 * Rich interactive posts live at public/blog/{slug}/index.html
 * with listing metadata in public/blog/{slug}.md
 */
export function discoverStaticBlogSlugs() {
  if (!fs.existsSync(blogDir)) return []

  return fs
    .readdirSync(blogDir)
    .filter((name) => {
      const dirPath = path.join(blogDir, name)
      if (!fs.statSync(dirPath).isDirectory()) return false
      return (
        fs.existsSync(path.join(dirPath, 'index.html')) &&
        fs.existsSync(path.join(blogDir, `${name}.md`))
      )
    })
    .sort()
}
