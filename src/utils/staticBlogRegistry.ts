/**
 * Blog posts served as self-contained static HTML at /blog/{slug}
 * (public/blog/{slug}/index.html) with assets in /assets/{slug}/.
 * Markdown frontmatter is still used for listing metadata.
 */
export const STATIC_BLOG_SLUGS = new Set([
  'monitor-docling-using-alertmend',
])

export function isStaticBlog(slug: string): boolean {
  return STATIC_BLOG_SLUGS.has(slug)
}

/** URL path for any blog post (static HTML or React markdown). */
export function getBlogPostPath(slug: string): string {
  return `/blog/${slug}`
}
