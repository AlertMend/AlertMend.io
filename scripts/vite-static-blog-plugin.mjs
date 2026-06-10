import fs from 'fs'
import path from 'path'
import { STATIC_BLOG_SLUGS } from './static-blog-slugs.mjs'

/**
 * Serve public/blog/{slug}/index.html at /blog/{slug} in dev and preview,
 * so static blog posts work without .html in the URL (React must not take over).
 */
export function staticBlogPlugin() {
  const serveStaticBlog = (rootDir) => (req, res, next) => {
    const url = (req.url ?? '').split('?')[0]
    const match = url.match(/^\/blog\/([^/]+)\/?$/)
    if (!match || !STATIC_BLOG_SLUGS.includes(match[1])) {
      return next()
    }

    const htmlPath = path.join(rootDir, 'blog', match[1], 'index.html')
    if (!fs.existsSync(htmlPath)) {
      return next()
    }

    res.statusCode = 200
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    fs.createReadStream(htmlPath).pipe(res)
  }

  return {
    name: 'static-blog',
    enforce: 'pre',
    configureServer(server) {
      const publicRoot = path.join(server.config.root, 'public')
      server.middlewares.use(serveStaticBlog(publicRoot))
    },
    configurePreviewServer(server) {
      const distRoot = path.join(server.config.root, 'dist')
      server.middlewares.use(serveStaticBlog(distRoot))
    },
  }
}
