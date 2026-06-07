/**
 * Slugs that render a custom React layout instead of plain markdown on /blog routes.
 * Markdown source is still used for SEO metadata, static HTML generation, and prerender text.
 */
export const ENHANCED_BLOG_SLUGS = new Set([
  'monitor-docling-using-alertmend',
])

export function isEnhancedBlog(slug: string): boolean {
  return ENHANCED_BLOG_SLUGS.has(slug)
}
