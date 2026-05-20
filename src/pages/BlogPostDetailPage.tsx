import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import SEO from '../components/SEO'
import Breadcrumb from '../components/Breadcrumb'
import BlogSignupForm from '../components/BlogSignupForm'
import { Linkedin, ArrowRight } from 'lucide-react'
import { getBlogPost, formatDate, BlogPost, blogPosts } from '../utils/blogUtils'
import { truncateBlogTitle, truncateH2Heading } from '../utils/titleUtils'
import { generateUniqueMetaDescription } from '../utils/descriptionUtils'
import { mapOldBlogUrlToSlug } from '../utils/blogSlugMapper'
import { normalizeBlogMarkdown } from '../utils/markdownNormalize'

export default function BlogPostDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [navigating, setNavigating] = useState(false)

  // Determine if this is HTML version and normalize slug for canonical URL
  const isHtmlVersion = location.pathname.startsWith('/blogs/') && location.pathname.endsWith('.html')
  let loadingCanonicalUrl = ''
  if (slug) {
    // Normalize slug for canonical URL
    let cleanSlug = slug.replace(/\.html$/, '')
    cleanSlug = cleanSlug.toLowerCase().replace(/_/g, '-')
    loadingCanonicalUrl = isHtmlVersion 
      ? `/blogs/${cleanSlug}.html`
      : `/blog/${cleanSlug}`
  }

  useEffect(() => {
    if (slug) {
      // Reset loading state when slug changes
      setLoading(true)
      setPost(null)
      setNavigating(false)
      
      // Scroll to top when navigating to a new post
      window.scrollTo({ top: 0, behavior: 'instant' })
      
      // Normalize slug: remove .html extension, then map old URLs (including Chinese characters) to new slugs
      let cleanSlug = slug.replace(/\.html$/, '')
      
      // Try to map old URL format to new slug (handles Chinese characters and legacy formats)
      const mappedSlug = mapOldBlogUrlToSlug(cleanSlug)
      if (mappedSlug) {
        cleanSlug = mappedSlug
      } else {
        // Fallback: convert underscores to hyphens, lowercase
        cleanSlug = cleanSlug.toLowerCase().replace(/_/g, '-')
      }
      
      getBlogPost(cleanSlug).then((data) => {
        setPost(data)
        setLoading(false)
      }).catch(() => {
        setPost(null)
        setLoading(false)
      })
    }
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        {loadingCanonicalUrl && (
          <SEO
            title="Loading..."
            description="Loading blog post..."
            canonical={loadingCanonicalUrl}
          />
        )}
        <div className="pt-32 pb-20 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
            <p className="text-zinc-600">Loading post...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        <div className="pt-32 pb-20 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-zinc-950 mb-4">Post Not Found</h1>
            <button
              onClick={() => navigate('/blog')}
              className="text-violet-600 hover:text-violet-700 underline"
            >
              Return to Blog
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Calculate read time (rough estimate: 200 words per minute)
  const calculateReadTime = (content: string) => {
    const words = content.split(/\s+/).length
    const minutes = Math.ceil(words / 200)
    return `${minutes} min read`
  }

  // Get related posts (prioritize same category, then other posts, excluding current post)
  const sameCategoryPosts = blogPosts
    .filter(p => p.category === post.category && p.slug !== post.slug)
    .slice(0, 3)
  
  const otherPosts = blogPosts
    .filter(p => p.category !== post.category && p.slug !== post.slug)
    .slice(0, 7)
  
  // Combine: 3 from same category + 7 from other categories = 10 total
  const relatedPosts = [...sameCategoryPosts, ...otherPosts].slice(0, 10)

  const readTime = post.content ? calculateReadTime(post.content) : '5 min read'
  // Canonical URL should match the current URL format
  // If accessed via /blogs/slug.html, canonical should be /blogs/slug.html
  // If accessed via /blog/slug, canonical should be /blog/slug
  // Always use normalized slug (lowercase, hyphens) for canonical URL
  const blogPostUrl = isHtmlVersion 
    ? `/blogs/${post.slug}.html`  // HTML version: /blogs/normalized-slug.html
    : `/blog/${post.slug}`         // Non-HTML version: /blog/normalized-slug
  
  // Modify content tone for /blog routes to make it unique (keep /blogs routes unchanged)
  const getModifiedContent = (content: string): string => {
    if (isHtmlVersion) {
      // Keep original content for /blogs routes
      return content
    }
    
    // Modify content tone slightly for /blog routes to avoid duplication
    // Replace common phrases with variations (subtle changes that maintain meaning)
    let modifiedContent = content
    
    // Replace common phrases with variations - more subtle changes
    const replacements: [RegExp, string][] = [
      [/In this article/gi, 'In this comprehensive guide'],
      [/In this guide/gi, 'In this detailed article'],
      [/This article/gi, 'This comprehensive guide'],
      [/This guide/gi, 'This detailed article'],
      [/we'll explore/gi, 'we will dive deep into'],
      [/we'll discuss/gi, 'we will examine'],
      [/we'll cover/gi, 'we will analyze'],
      [/Let's explore/gi, 'Let us dive into'],
      [/Let's discuss/gi, 'Let us examine'],
      [/understanding/gi, 'comprehending'],
      [/learn how to/gi, 'discover the process of'],
      [/learn about/gi, 'gain insights into'],
      [/common causes/gi, 'primary factors'],
      [/common issues/gi, 'frequent challenges'],
      [/best practices/gi, 'proven strategies'],
      [/troubleshooting/gi, 'diagnosing and resolving'],
      [/solutions/gi, 'effective approaches'],
      [/important to/gi, 'crucial to'],
      [/essential to/gi, 'vital to'],
      [/ensure that/gi, 'guarantee that'],
      [/make sure/gi, 'verify'],
      [/can help/gi, 'can assist'],
      [/can be/gi, 'may be'],
      [/should be/gi, 'ought to be'],
      [/will help/gi, 'will assist'],
      [/provides/gi, 'delivers'],
      [/offers/gi, 'furnishes'],
      [/allows/gi, 'enables'],
      [/ensures/gi, 'guarantees'],
      [/explore/gi, 'examine'],
      [/discuss/gi, 'analyze'],
      [/cover/gi, 'address'],
      [/delve into/gi, 'investigate'],
      [/examine/gi, 'explore'],
      [/analyze/gi, 'review'],
      [/review/gi, 'examine'],
    ]
    
    // Apply replacements (simple approach - patterns already match whole phrases)
    replacements.forEach(([pattern, replacement]) => {
      modifiedContent = modifiedContent.replace(pattern, replacement)
    })
    
    return modifiedContent
  }
  
  // Use original title for display (no modifications)
  const displayTitle = post.title
  // Repair structural markdown issues introduced by the upstream content
  // pipeline (empty headings, split-across-lines headings, orphan list
  // markers, inline code-fence opens) before tone-modifying the prose.
  const normalizedContent = normalizeBlogMarkdown(post.content || '')
  const displayContent = getModifiedContent(normalizedContent)
  
  // Truncate title to 30-60 characters for SEO (use original title)
  const seoTitle = truncateBlogTitle(post.title)
  
  // Generate unique meta description for SEO (50-160 characters)
  const metaDescription = generateUniqueMetaDescription(
    post.title,
    post.excerpt,
    isHtmlVersion ? post.content : displayContent,
    post.category
  )
  
  return (
    <div className="min-h-screen bg-white">
      <SEO
        title={seoTitle}
        description={metaDescription}
        keywords={post.keywords || `${post.category}, AlertMend AI, AIOps, Kubernetes, DevOps`}
        canonical={blogPostUrl}
        ogType="article"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": seoTitle,
          "description": metaDescription,
          "image": "https://alertmend.io/og-image.jpg",
          "datePublished": post.date,
          "dateModified": post.date,
          "author": {
            "@type": "Person",
            "name": post.author || "AlertMend Team"
          },
          "publisher": {
            "@type": "Organization",
            "name": "AlertMend AI",
            "logo": {
              "@type": "ImageObject",
              "url": "https://alertmend.io/logos/alertmend-logo.svg"
            }
          },
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://www.alertmend.io${blogPostUrl}`
          },
          "articleSection": post.category
        }}
        breadcrumbData={{
          items: [
            { label: 'Blog', path: '/blog' },
            { label: post.title }
          ]
        }}
      />
      <main className="pt-24">
        <article className="pt-8 pb-8 md:pb-12 container-padding">
          <div className="max-w-7xl mx-auto">
            <Breadcrumb items={[
              { label: 'Blog', path: '/blog' },
              { label: post.title }
            ]} />
            <div className="mt-8">

            <div className="grid lg:grid-cols-12 gap-8">
              {/* Main Content Area (70%) */}
              <div className="lg:col-span-8">
                <div className="flex gap-6">
                  {/* Content */}
                  <div className="flex-1">
                    {/* Header */}
                    <header className="mb-8">
                      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-zinc-950 mb-6 leading-tight tracking-tight">
                        {displayTitle}
                      </h1>
                      
                      {/* Author Info */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-white font-semibold">
                          {post.author?.charAt(0) || 'A'}
                        </div>
                        <div>
                          <div className="font-semibold text-zinc-900">{post.author || 'AlertMend Team'}</div>
                          <div className="text-sm text-zinc-500">{readTime} • {formatDate(post.date)}</div>
                        </div>
                      </div>

                      {/* Category tag */}
                      <div className="inline-block px-2.5 py-0.5 bg-violet-50 text-violet-700 border border-violet-200 rounded-md text-xs font-semibold uppercase tracking-wider">
                        {post.category}
                      </div>
                    </header>

                    {/* Content */}
                    <div className="prose prose-lg max-w-none">
                      <div className="text-gray-800 leading-7">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            h1: ({ node, ...props }) => <h2 className="text-3xl md:text-4xl font-bold text-zinc-950 mt-10 mb-5 first:mt-0 leading-tight tracking-tight" {...props} />,
                            h2: ({ node, children, ...props }: any) => {
                              // Extract text from children (can be string, array, or ReactNode)
                              let headingText = ''
                              if (typeof children === 'string') {
                                headingText = children
                              } else if (Array.isArray(children)) {
                                headingText = children
                                  .map((child: any) => {
                                    if (typeof child === 'string') return child
                                    if (typeof child === 'object' && child?.props?.children) {
                                      return typeof child.props.children === 'string' 
                                        ? child.props.children 
                                        : String(child.props.children)
                                    }
                                    return String(child)
                                  })
                                  .join('')
                              } else if (children) {
                                headingText = String(children)
                              }
                              const truncatedText = truncateH2Heading(headingText.trim())
                              return <h2 className="text-2xl md:text-3xl font-bold text-zinc-950 mt-10 mb-5 leading-tight tracking-tight" {...props}>{truncatedText}</h2>
                            },
                            h3: ({ node, ...props }) => <h3 className="text-xl md:text-2xl font-bold text-zinc-950 mt-8 mb-4 leading-tight tracking-tight" {...props} />,
                            p: ({ node, ...props }) => <p className="text-zinc-700 leading-7 mb-6 text-lg" {...props} />,
                            ul: ({ node, ...props }) => <ul className="list-disc mb-6 space-y-3 text-zinc-700 ml-6 text-lg leading-7" {...props} />,
                            ol: ({ node, ...props }) => <ol className="list-decimal mb-6 space-y-3 text-zinc-700 ml-6 text-lg leading-7" {...props} />,
                            li: ({ node, ...props }) => <li className="text-zinc-700 leading-7" {...props} />,
                            blockquote: ({ node, ...props }) => <blockquote className="border-l-2 border-violet-500 bg-violet-50/40 pl-5 pr-4 py-2 italic text-zinc-700 my-8 text-lg leading-7 rounded-r-md" {...props} />,
                            code: ({ node, inline, ...props }: any) => 
                              inline ? (
                                <code className="bg-violet-50 text-violet-700 border border-violet-100 px-1.5 py-0.5 rounded text-[0.92em] font-mono" {...props} />
                              ) : (
                                <code className="block bg-zinc-950 text-zinc-100 p-5 rounded-lg overflow-x-auto my-6 text-sm leading-6" {...props} />
                              ),
                            pre: ({ node, ...props }) => <pre className="bg-zinc-950 text-zinc-100 p-5 rounded-lg overflow-x-auto my-6 text-sm leading-6" {...props} />,
                            a: ({ node, ...props }) => <a className="text-violet-600 hover:text-violet-700 underline underline-offset-2" {...props} />,
                            strong: ({ node, ...props }) => <strong className="font-bold text-zinc-950" {...props} />,
                            em: ({ node, ...props }) => <em className="italic text-zinc-700" {...props} />,
                            hr: ({ node, ...props }) => <hr className="my-8 border-zinc-200" {...props} />,
                            img: ({ node, ...props }) => <img className="rounded-lg my-8 w-full" {...props} />,
                            table: ({ node, ...props }) => (
                              <div className="table-wrapper">
                                <table {...props} />
                              </div>
                            ),
                          }}
                        >
                          {displayContent}
                        </ReactMarkdown>
                      </div>
                    </div>

                    {/* Promotional Section */}
                    <div className="mt-12 pt-8 border-t border-zinc-200">
                      <p className="text-zinc-700 text-lg leading-7 mb-3">
                        Ready to eliminate manual firefighting and achieve autonomous infrastructure operations?
                      </p>
                      <p className="text-zinc-700 text-lg leading-7 mb-6">
                        See how AlertMend AI can help you reduce costs by 50%, achieve zero downtime, and automate incident remediation across Kubernetes, VMs, and ECS.{' '}
                        <button
                          onClick={() => window.open('https://calendly.com/hello-alertmend/30min', '_blank')}
                          className="text-violet-600 hover:text-violet-700 font-semibold underline underline-offset-2 inline-flex items-center gap-1"
                        >
                          Book a demo.
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </p>
                    </div>

                    {/* Horizontal Separator */}
                    <hr className="my-8 border-zinc-200" />

                     {/* Arvind Rajpurohit Profile Section */}
                     <div className="flex flex-col sm:flex-row gap-6 pb-8">
                       {/* Profile Picture */}
                       <div className="flex-shrink-0 relative w-32 h-32">
                         <img
                           src="/logos/arvind.jpeg"
                           alt="Arvind Rajpurohit"
                           className="w-32 h-32 rounded-lg object-cover border border-zinc-200"
                           style={{ display: 'block', position: 'relative', zIndex: 10 }}
                           onError={(e) => {
                             const target = e.target as HTMLImageElement
                             target.style.display = 'none'
                             const placeholder = target.parentElement?.querySelector('.profile-placeholder-arvind') as HTMLElement
                             if (placeholder) {
                               placeholder.style.display = 'flex'
                             }
                           }}
                           onLoad={(e) => {
                             const target = e.target as HTMLImageElement
                             const placeholder = target.parentElement?.querySelector('.profile-placeholder-arvind') as HTMLElement
                             if (placeholder) {
                               placeholder.style.display = 'none'
                             }
                           }}
                         />
                         <div 
                           className="profile-placeholder-arvind w-32 h-32 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-700 font-bold text-2xl absolute top-0 left-0"
                           style={{ display: 'none', zIndex: 0 }}
                         >
                           AR
                         </div>
                       </div>

                       {/* Profile Content */}
                       <div className="flex-1">
                         <h3 className="text-2xl font-bold text-zinc-950 mb-2">
                           Arvind Rajpurohit
                         </h3>
                         <p className="text-violet-600 font-semibold mb-4">Co-Founder &amp; CEO</p>
                         <div className="text-zinc-700 leading-7 space-y-4 mb-4">
                           <p>
                             Arvind Rajpurohit - 15+ years in Kubernetes and infrastructure automation. Former DevOps Lead at Roambee and Customer Success Engineer at Shoreline.io (acquired by NVIDIA). Helped teams reach 99.97% uptime, reduce costs by 50%, and cut manual work by 90%.
                           </p>
                           <p>
                             As CEO of AlertMend AI, building autonomous infrastructure where AI predicts, fixes, and learns.
                           </p>
                         </div>
                         {/* LinkedIn Icon */}
                         <a
                           href="https://www.linkedin.com/in/arvind-rajpurohit-4a332523/"
                           target="_blank"
                           rel="noopener noreferrer"
                           className="inline-flex items-center text-zinc-500 hover:text-violet-600 transition-colors"
                         >
                           <Linkedin className="h-5 w-5" />
                         </a>
                       </div>
                     </div>
                   </div>
                 </div>
                </div>

              {/* Sidebar (30%) */}
              <div className="lg:col-span-4">
                <div className="space-y-6 sticky top-24">
                  {/* Email Signup */}
                  <div className="bg-zinc-50 rounded-lg p-6 border border-zinc-200">
                    <h3 className="text-lg font-bold text-zinc-950 mb-4">Receive blog and product updates</h3>
                    <BlogSignupForm />
                  </div>

                  {/* Related Content */}
                  {relatedPosts.length > 0 && (
                    <div className="bg-zinc-50 rounded-lg p-6 border border-zinc-200 mb-6">
                      <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-[0.12em] mb-4">Related content</h3>
                      <ul className="space-y-3">
                        {relatedPosts.map((relatedPost) => (
                          <li key={relatedPost.slug}>
                            <a
                              href={`/blog/${relatedPost.slug}`}
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                if (!navigating) {
                                  setNavigating(true)
                                  navigate(`/blog/${relatedPost.slug}`)
                                }
                              }}
                              className="text-left text-zinc-700 hover:text-violet-600 text-sm leading-relaxed cursor-pointer block transition-colors"
                            >
                              {relatedPost.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                      <a
                        href="/blog"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          if (!navigating) {
                            setNavigating(true)
                            navigate('/blog')
                          }
                        }}
                        className="mt-4 text-violet-600 hover:text-violet-700 text-sm font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        View all posts
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    </div>
                  )}

                  {/* Additional Internal Links */}
                  <div className="bg-white rounded-lg p-6 border border-zinc-200">
                    <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-[0.12em] mb-4">Explore AlertMend</h3>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <a href="/" className="text-zinc-700 hover:text-violet-600 transition-colors">Home</a>
                      </li>
                      <li>
                        <a href="/auto-remediation" className="text-zinc-700 hover:text-violet-600 transition-colors">Automated Incident Remediation</a>
                      </li>
                      <li>
                        <a href="/kubernetes-management" className="text-zinc-700 hover:text-violet-600 transition-colors">Kubernetes Management</a>
                      </li>
                      <li>
                        <a href="/on-call-management" className="text-zinc-700 hover:text-violet-600 transition-colors">On-Call Management</a>
                      </li>
                      <li>
                        <a href="/kubernetes-cost-optimization" className="text-zinc-700 hover:text-violet-600 transition-colors">Cost Optimization</a>
                      </li>
                      <li>
                        <a href="/case-studies" className="text-zinc-700 hover:text-violet-600 transition-colors">Case Studies</a>
                      </li>
                      <li>
                        <a href="/pricing" className="text-zinc-700 hover:text-violet-600 transition-colors">Pricing</a>
                      </li>
                      <li>
                        <a href="/blog" className="text-zinc-700 hover:text-violet-600 transition-colors">All Blog Posts</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </article>
      </main>
    </div>
  )
}

