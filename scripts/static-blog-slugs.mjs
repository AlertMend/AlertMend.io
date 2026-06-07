/** Shared list of blog slugs served as static HTML at /blog/{slug} */
export const STATIC_BLOG_SLUGS = ['monitor-docling-using-alertmend']

export function isStaticBlogSlug(slug) {
  return STATIC_BLOG_SLUGS.includes(slug)
}
