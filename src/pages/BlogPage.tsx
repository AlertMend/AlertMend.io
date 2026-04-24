import SEO from '../components/SEO'
import Breadcrumb from '../components/Breadcrumb'
import { Calendar, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useMemo } from 'react'
import { blogPosts, formatDate } from '../utils/blogUtils'
import { ensureUniqueMetaDescription } from '../utils/descriptionUtils'

export default function BlogPage() {
  const navigate = useNavigate()
  
  // Sort posts by date (newest first) and ensure excerpts are properly handled
  // Ensure blogPosts is available and is an array - use empty array as fallback
  const sortedPosts = useMemo(() => {
    try {
      const posts = blogPosts || []
      if (!Array.isArray(posts) || posts.length === 0) {
        return []
      }
      return [...posts]
        .map(post => {
          // Ensure excerpt is always a string and properly trimmed
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
  
  // Generate unique meta description for blog list page
  const baseDescription = "AlertMend AI blog: Get expert insights on AIOps and Kubernetes. Learn best practices for autonomous infrastructure management."
  const uniqueDescription = ensureUniqueMetaDescription(baseDescription, 'blog-list', 'blog')

  // Ensure we always have posts to render
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
            <p className="text-gray-600">Loading blog posts...</p>
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
        {/* Ambient washes */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(126,34,206,0.10), transparent 60%), radial-gradient(ellipse 50% 40% at 90% 10%, rgba(192,38,211,0.08), transparent 60%), radial-gradient(ellipse 50% 40% at 10% 30%, rgba(79,70,229,0.07), transparent 60%)',
          }}
        />
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Breadcrumb items={[{ label: 'Blog' }]} />
          </div>
          <div className="text-center mb-14 md:mb-20">
            <span className="inline-flex items-center gap-2 rounded-full border border-purple-300/60 bg-white/70 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-purple-700 backdrop-blur-sm shadow-[0_8px_24px_-12px_rgba(126,34,206,0.35)]">
              <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-purple-600 to-fuchsia-500 shadow-[0_0_0_3px_rgba(126,34,206,0.12)]" />
              Blog
            </span>
            <h1
              className="mx-auto mt-6 max-w-4xl text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05]"
              style={{
                background: 'linear-gradient(135deg, #3b0764 0%, #4f46e5 50%, #c026d3 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Latest insights & updates
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg md:text-xl text-slate-600 leading-relaxed">
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
                  onClick={() => navigate(`/blog/${post.slug}`)}
                  className="group relative flex h-full cursor-pointer flex-col rounded-2xl border border-purple-100 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-purple-300 shadow-[0_4px_18px_-10px_rgba(76,29,149,0.18)] hover:shadow-[0_24px_40px_-20px_rgba(126,34,206,0.32)]"
                >
                  <div className="mb-5 flex flex-wrap items-center gap-1.5">
                    <span className="inline-flex items-center rounded-full border border-purple-200 bg-purple-50/80 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-purple-700">
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
                              className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600"
                            >
                              {tag}
                            </span>
                          ))}
                      </>
                    )}
                  </div>
                  <h2 className="mb-3 text-xl md:text-[22px] font-bold leading-snug tracking-tight text-purple-950 transition-colors group-hover:text-purple-700">
                    {displayTitle}
                  </h2>
                  {displayExcerpt ? (
                    <p className="mb-6 line-clamp-3 flex-grow text-[15px] leading-relaxed text-slate-600">{displayExcerpt}</p>
                  ) : (
                    <p className="mb-6 line-clamp-3 flex-grow text-[15px] leading-relaxed text-slate-500 italic">
                      Read more about {displayTitle}...
                    </p>
                  )}
                  <div className="mt-auto flex items-center justify-between border-t border-purple-100/70 pt-4">
                    <div className="flex items-center gap-2 text-[13px] text-slate-500">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{formatDate(post.date)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[13px] font-semibold text-purple-700 transition-colors group-hover:text-fuchsia-600">
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

