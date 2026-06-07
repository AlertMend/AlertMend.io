import SEO from '../components/SEO'
import Breadcrumb from '../components/Breadcrumb'
import { Calendar, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useMemo } from 'react'
import { blogPosts, formatDate } from '../utils/blogUtils'
import { getBlogPostPath, isStaticBlog } from '../utils/staticBlogRegistry'
import { ensureUniqueMetaDescription } from '../utils/descriptionUtils'

/**
 * Blog index page.
 *
 * Re-skinned to match the new homepage design system: near-black + zinc
 * neutrals with a single restrained violet accent (`#7c3aed`). The page
 * uses Tailwind utilities because it's part of the legacy chrome, but
 * every chromatic value has been swapped from the old purple/fuchsia/
 * indigo mix to the new single-hue palette so the blog feels like part
 * of the same site as the homepage rather than a separate product.
 */
export default function BlogPage() {
  const navigate = useNavigate()

  const sortedPosts = useMemo(() => {
    try {
      const posts = blogPosts || []
      if (!Array.isArray(posts) || posts.length === 0) {
        return []
      }
      return [...posts]
        .map(post => {
          let excerpt = ''
          if (post && post.excerpt) {
            if (typeof post.excerpt === 'string') {
              excerpt = post.excerpt.trim()
            } else if (typeof post.excerpt === 'object' && post.excerpt !== null) {
              excerpt = String(post.excerpt).trim()
            }
          }
          return {
            ...post,
            excerpt: excerpt || ''
          }
        })
        .sort((a, b) => {
          try {
            const dateA = new Date(a.date || 0).getTime()
            const dateB = new Date(b.date || 0).getTime()
            return dateB - dateA
          } catch {
            return 0
          }
        })
    } catch (error) {
      console.error('Error processing blog posts:', error)
      return []
    }
  }, [])

  const baseDescription = "AlertMend AI blog: Get expert insights on AIOps and Kubernetes. Learn best practices for autonomous infrastructure management."
  const uniqueDescription = ensureUniqueMetaDescription(baseDescription, 'blog-list', 'blog')

  if (!sortedPosts || sortedPosts.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <SEO
          title="AlertMend AI: AIOps & Kubernetes Best Practices in 2025"
          description={uniqueDescription}
          canonical="/blog"
          keywords="AIOps blog, Kubernetes best practices, infrastructure automation, DevOps insights, SRE articles, cloud-native operations"
        />
        <section className="pt-24 pb-20 md:pb-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-zinc-600">Loading blog posts...</p>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="AlertMend AI: AIOps & Kubernetes Best Practices in 2025"
        description={uniqueDescription}
        canonical="/blog"
        keywords="AIOps blog, Kubernetes best practices, infrastructure automation, DevOps insights, SRE articles, cloud-native operations"
      />
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-32 px-4 sm:px-6 lg:px-8">
        {/* Single corner violet wash — anchors the brand color without
            painting the page. Matches the new home ambient pattern. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(ellipse 60% 40% at 50% -10%, rgba(124,58,237,0.10), transparent 60%)',
          }}
        />
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Breadcrumb items={[{ label: 'Blog' }]} />
          </div>
          <div className="text-center mb-14 md:mb-20">
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-violet-700">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-600 shadow-[0_0_0_3px_rgba(124,58,237,0.14)]" />
              Blog
            </span>
            <h1 className="mx-auto mt-6 max-w-4xl text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] text-zinc-950">
              Latest insights &amp; updates
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg md:text-xl text-zinc-500 leading-relaxed">
              Field notes from the AlertMend team on AIOps, Kubernetes, GPU &amp; ML pipelines, incident response, and SRE automation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
            {sortedPosts.map((post) => {
              const displayTitle = (post.title && post.title.trim() && post.title !== post.slug) ? post.title : post.slug
              const displayExcerpt = post.excerpt && post.excerpt.length > 0 ? post.excerpt : null
              return (
                <article
                  key={post.slug}
                  onClick={() => {
                    if (isStaticBlog(post.slug)) {
                      window.location.assign(getBlogPostPath(post.slug))
                    } else {
                      navigate(getBlogPostPath(post.slug))
                    }
                  }}
                  className="group relative flex h-full cursor-pointer flex-col rounded-lg border border-zinc-200 bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-[0_1px_2px_rgba(9,9,11,0.04),0_12px_24px_-16px_rgba(9,9,11,0.16)]"
                >
                  <div className="mb-4 flex flex-wrap items-center gap-1.5">
                    <span className="inline-flex items-center rounded-md border border-violet-200 bg-violet-50 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-violet-700">
                      {post.category}
                    </span>
                    {post.tags && post.tags.length > 0 && (
                      <>
                        {post.tags
                          .filter(tag => tag.toLowerCase() !== post.category.toLowerCase())
                          .slice(0, 2)
                          .map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[11px] font-medium text-zinc-600"
                            >
                              {tag}
                            </span>
                          ))}
                      </>
                    )}
                  </div>
                  <h2 className="mb-3 text-xl md:text-[22px] font-bold leading-snug tracking-tight text-zinc-950 transition-colors group-hover:text-violet-700">
                    {displayTitle}
                  </h2>
                  {displayExcerpt ? (
                    <p className="mb-6 line-clamp-3 flex-grow text-[15px] leading-relaxed text-zinc-600">{displayExcerpt}</p>
                  ) : (
                    <p className="mb-6 line-clamp-3 flex-grow text-[15px] leading-relaxed text-zinc-500 italic">
                      Read more about {displayTitle}...
                    </p>
                  )}
                  <div className="mt-auto flex items-center justify-between border-t border-zinc-100 pt-4">
                    <div className="flex items-center gap-2 text-[13px] text-zinc-500">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{formatDate(post.date)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[13px] font-semibold text-violet-600 transition-colors group-hover:text-violet-700">
                      Read more
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
