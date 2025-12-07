import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import Breadcrumb from '../components/Breadcrumb'
import { Linkedin, ArrowRight } from 'lucide-react'
import { getBlogPost, formatDate, BlogPost, blogPosts } from '../utils/blogUtils'
import { truncateBlogTitle, truncateH2Heading } from '../utils/titleUtils'
import { generateUniqueMetaDescription } from '../utils/descriptionUtils'

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
      
      // Normalize slug: remove .html extension, convert underscores to hyphens, lowercase
      let cleanSlug = slug.replace(/\.html$/, '')
      cleanSlug = cleanSlug.toLowerCase().replace(/_/g, '-')
      
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
        <Navbar />
        <div className="pt-32 pb-20 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-purple-700">Loading post...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="pt-32 pb-20 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-purple-900 mb-4">Post Not Found</h1>
            <button
              onClick={() => navigate('/blog')}
              className="text-purple-600 hover:text-purple-800 underline"
            >
              Return to Blog
            </button>
          </div>
        </div>
        <Footer />
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
  
  // Modify title for /blog routes to make it unique (keep /blogs routes unchanged)
  const getModifiedTitle = (title: string, slug: string): string => {
    if (isHtmlVersion) {
      // Keep original title for /blogs routes
      return title
    }
    
    // Modify title for /blog routes to add uniqueness
    // Use consistent variations based on slug hash for same slug
    const titleHash = slug.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
    
    // Check if title already has common suffixes
    const hasGuide = title.toLowerCase().includes('guide')
    const hasTroubleshooting = title.toLowerCase().includes('troubleshooting')
    const hasFix = title.toLowerCase().includes('fix') || title.toLowerCase().startsWith('how to')
    
    // Add prefix variations for titles without "How to" or "Fix"
    if (!hasFix && !title.toLowerCase().startsWith('understanding')) {
      const prefixes = ['How to', 'Understanding', 'Mastering', 'Complete Guide to']
      const prefix = prefixes[titleHash % prefixes.length]
      const newTitle = `${prefix} ${title}`
      // Check if it fits within 60 chars (before truncation)
      if (newTitle.length <= 60) {
        return newTitle
      }
    }
    
    // Add suffix variations for titles that don't have them
    if (!hasGuide && !hasTroubleshooting) {
      const suffixes = ['Guide', 'Tips', 'Solutions', 'Best Practices']
      const suffix = suffixes[titleHash % suffixes.length]
      const newTitle = `${title}: ${suffix}`
      // Check if it fits within 60 chars (before truncation)
      if (newTitle.length <= 60) {
        return newTitle
      }
    }
    
    // If title is already long or has variations, just add a subtle modifier
    const modifiers = ['Complete', 'Expert', 'Advanced', 'Practical']
    const modifier = modifiers[titleHash % modifiers.length]
    if (title.length + modifier.length + 1 <= 60) {
      return `${modifier} ${title}`
    }
    
    // Return original if can't modify without breaking length
    return title
  }
  
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
  
  const displayTitle = getModifiedTitle(post.title, post.slug)
  const displayContent = getModifiedContent(post.content || '')
  
  // Truncate title to 30-60 characters for SEO (use original title for SEO, modified for display)
  const seoTitle = truncateBlogTitle(isHtmlVersion ? post.title : displayTitle)
  
  // Generate unique meta description for SEO (50-160 characters)
  const metaDescription = generateUniqueMetaDescription(
    isHtmlVersion ? post.title : displayTitle,
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
      <Navbar />
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
                      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-purple-950 mb-6 leading-tight">
                        {displayTitle}
                      </h1>
                      
                      {/* Author Info */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-semibold">
                          {post.author?.charAt(0) || 'A'}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{post.author || 'AlertMend Team'}</div>
                          <div className="text-sm text-gray-600">{readTime} • {formatDate(post.date)}</div>
                        </div>
                      </div>

                      {/* Tag */}
                      <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm font-semibold">
                        {post.category}
                      </div>
                    </header>

                    {/* Content */}
                    <div className="prose prose-lg max-w-none">
                      <div className="text-gray-800 leading-7">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            h1: ({ node, ...props }) => <h2 className="text-3xl md:text-4xl font-bold text-purple-950 mt-10 mb-5 first:mt-0 leading-tight" {...props} />,
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
                              return <h2 className="text-2xl md:text-3xl font-bold text-purple-950 mt-10 mb-5 leading-tight" {...props}>{truncatedText}</h2>
                            },
                            h3: ({ node, ...props }) => <h3 className="text-xl md:text-2xl font-bold text-purple-950 mt-8 mb-4 leading-tight" {...props} />,
                            p: ({ node, ...props }) => <p className="text-gray-800 leading-7 mb-6 text-lg" {...props} />,
                            ul: ({ node, ...props }) => <ul className="list-disc mb-6 space-y-3 text-gray-800 ml-6 text-lg leading-7" {...props} />,
                            ol: ({ node, ...props }) => <ol className="list-decimal mb-6 space-y-3 text-gray-800 ml-6 text-lg leading-7" {...props} />,
                            li: ({ node, ...props }) => <li className="text-gray-800 leading-7" {...props} />,
                            blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-purple-400 pl-6 italic text-gray-700 my-8 text-lg leading-7" {...props} />,
                            code: ({ node, inline, ...props }: any) => 
                              inline ? (
                                <code className="bg-gray-100 text-purple-700 px-2 py-1 rounded text-base font-mono" {...props} />
                              ) : (
                                <code className="block bg-gray-900 text-gray-100 p-5 rounded-lg overflow-x-auto my-6 text-sm leading-6" {...props} />
                              ),
                            pre: ({ node, ...props }) => <pre className="bg-gray-900 text-gray-100 p-5 rounded-lg overflow-x-auto my-6 text-sm leading-6" {...props} />,
                            a: ({ node, ...props }) => <a className="text-blue-600 hover:text-blue-800 underline" {...props} />,
                            strong: ({ node, ...props }) => <strong className="font-bold text-purple-950" {...props} />,
                            em: ({ node, ...props }) => <em className="italic text-gray-800" {...props} />,
                            hr: ({ node, ...props }) => <hr className="my-8 border-gray-200" {...props} />,
                            img: ({ node, ...props }) => <img className="rounded-lg my-8 w-full" {...props} />,
                          }}
                        >
                          {displayContent}
                        </ReactMarkdown>
                      </div>
                    </div>

                    {/* Promotional Section */}
                    <div className="mt-12 pt-8 border-t border-gray-200">
                      <p className="text-gray-800 text-lg leading-7 mb-3">
                        Ready to eliminate manual firefighting and achieve autonomous infrastructure operations?
                      </p>
                      <p className="text-gray-800 text-lg leading-7 mb-6">
                        See how AlertMend AI can help you reduce costs by 50%, achieve zero downtime, and automate incident remediation across Kubernetes, VMs, and ECS.{' '}
                        <button
                          onClick={() => window.open('https://calendly.com/hello-alertmend/30min', '_blank')}
                          className="text-purple-700 hover:text-purple-900 font-semibold underline inline-flex items-center gap-1"
                        >
                          Book a demo.
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </p>
                    </div>

                    {/* Horizontal Separator */}
                    <hr className="my-8 border-gray-200" />

                     {/* Arvind Rajpurohit Profile Section */}
                     <div className="flex flex-col sm:flex-row gap-6 pb-8">
                       {/* Profile Picture */}
                       <div className="flex-shrink-0 relative w-32 h-32">
                         <img
                           src="/logos/arvind.jpeg"
                           alt="Arvind Rajpurohit"
                           className="w-32 h-32 rounded-lg object-cover border border-gray-200"
                           style={{ display: 'block', position: 'relative', zIndex: 10 }}
                           onError={(e) => {
                             // Fallback to placeholder if image doesn't exist
                             const target = e.target as HTMLImageElement
                             target.style.display = 'none'
                             const placeholder = target.parentElement?.querySelector('.profile-placeholder-arvind') as HTMLElement
                             if (placeholder) {
                               placeholder.style.display = 'flex'
                             }
                           }}
                           onLoad={(e) => {
                             // Ensure placeholder is hidden when image loads successfully
                             const target = e.target as HTMLImageElement
                             const placeholder = target.parentElement?.querySelector('.profile-placeholder-arvind') as HTMLElement
                             if (placeholder) {
                               placeholder.style.display = 'none'
                             }
                           }}
                         />
                         <div 
                           className="profile-placeholder-arvind w-32 h-32 rounded-lg bg-purple-100 border border-gray-200 flex items-center justify-center text-purple-700 font-bold text-2xl absolute top-0 left-0"
                           style={{ display: 'none', zIndex: 0 }}
                         >
                           AR
                         </div>
                       </div>

                       {/* Profile Content */}
                       <div className="flex-1">
                         <h3 className="text-2xl font-bold text-purple-950 mb-2">
                           Arvind Rajpurohit
                         </h3>
                         <p className="text-purple-700 font-semibold mb-4">Co-Founder & CEO</p>
                         <div className="text-gray-800 leading-7 space-y-4 mb-4">
                           <p>
                             Arvind Rajpurohit — 15+ years in Kubernetes and infrastructure automation. Former DevOps Lead at Roambee and Customer Success Engineer at Shoreline.io (acquired by NVIDIA). Helped teams reach 99.97% uptime, reduce costs by 50%, and cut manual work by 90%.
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
                           className="inline-flex items-center text-purple-700 hover:text-purple-900 transition-colors"
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
                  <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
                    <h3 className="text-lg font-bold text-purple-900 mb-4">Receive blog and product updates</h3>
                    <form className="space-y-3">
                      <input
                        type="email"
                        placeholder="Email*"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-800 to-purple-900 text-white font-semibold py-3 rounded-lg hover:from-purple-900 hover:to-purple-950 transition-all shadow-lg hover:shadow-xl"
                      >
                        SIGN UP
                      </button>
                    </form>
                  </div>

                  {/* Related Content */}
                  {relatedPosts.length > 0 && (
                    <div className="bg-purple-50 rounded-xl p-6 border border-purple-100 mb-6">
                      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">RELATED CONTENT</h3>
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
                              className="text-left text-blue-600 hover:text-blue-800 underline text-sm leading-relaxed cursor-pointer block"
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
                        className="mt-4 text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center gap-1 cursor-pointer"
                      >
                        View All Posts
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    </div>
                  )}

                  {/* Additional Internal Links */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">EXPLORE ALERTMEND</h3>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <a href="/" className="text-blue-600 hover:text-blue-800 underline">Home</a>
                      </li>
                      <li>
                        <a href="/auto-remediation" className="text-blue-600 hover:text-blue-800 underline">Automated Incident Remediation</a>
                      </li>
                      <li>
                        <a href="/kubernetes-management" className="text-blue-600 hover:text-blue-800 underline">Kubernetes Management</a>
                      </li>
                      <li>
                        <a href="/on-call-management" className="text-blue-600 hover:text-blue-800 underline">On-Call Management</a>
                      </li>
                      <li>
                        <a href="/kubernetes-cost-optimization" className="text-blue-600 hover:text-blue-800 underline">Cost Optimization</a>
                      </li>
                      <li>
                        <a href="/case-studies" className="text-blue-600 hover:text-blue-800 underline">Case Studies</a>
                      </li>
                      <li>
                        <a href="/pricing" className="text-blue-600 hover:text-blue-800 underline">Pricing</a>
                      </li>
                      <li>
                        <a href="/blog" className="text-blue-600 hover:text-blue-800 underline">All Blog Posts</a>
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
      <Footer />
    </div>
  )
}

