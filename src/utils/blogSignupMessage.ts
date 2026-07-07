export function buildBlogSignupMessage(blogTitle: string) {
  const title = blogTitle.trim() || 'this blog post'
  return `Newsletter signup from the AlertMend blog post "${title}". Please add this email to the blog and product updates list.`
}
