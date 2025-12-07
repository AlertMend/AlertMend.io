import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import Breadcrumb from '../components/Breadcrumb'
import { Calendar, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { blogPosts, formatDate } from '../utils/blogUtils'
import { ensureUniqueMetaDescription } from '../utils/descriptionUtils'

export default function BlogPage() {
  const navigate = useNavigate()
  
  // Sort posts by date (newest first)
  const sortedPosts = [...blogPosts].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  
  // Generate unique meta description for blog list page
  const baseDescription = "AlertMend AI blog: Get expert insights on AIOps and Kubernetes. Learn best practices for autonomous infrastructure management."
  const uniqueDescription = ensureUniqueMetaDescription(baseDescription, 'blog-list', 'blog')

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="AlertMend AI: AIOps & Kubernetes Best Practices in 2025"
        description={uniqueDescription}
        canonical="/blog"
        keywords="AIOps blog, Kubernetes best practices, infrastructure automation, DevOps insights, SRE articles, cloud-native operations"
      />
      <Navbar />
      <section className="pt-24 pb-20 md:pb-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-br from-purple-50/30 via-white to-blue-50/30">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <Breadcrumb items={[{ label: 'Blog' }]} />
            </div>
            <div className="text-center mb-12 md:mb-16">
              <div className="inline-block px-5 py-2 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 rounded-full text-sm font-bold mb-8 shadow-md border border-purple-200/50">
                Blog
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-purple-950 mb-6 leading-tight">
                Latest Insights & Updates
              </h1>
              <p className="text-xl md:text-2xl text-purple-700 max-w-3xl mx-auto leading-relaxed mb-12">
                Stay updated with the latest trends, best practices, and insights in AIOps and infrastructure management.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedPosts.map((post) => {
                // Ensure title is not empty or slug - use title if it exists and is different from slug
                const displayTitle = (post.title && post.title.trim() && post.title !== post.slug) ? post.title : post.slug
                const displayExcerpt = post.excerpt && post.excerpt.trim() ? post.excerpt : ''
                return (
                <article
                  key={post.slug}
                  onClick={() => navigate(`/blog/${post.slug}`)}
                  className="group bg-white rounded-xl p-8 border border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-full"
                >
                  <div className="flex items-center gap-2 flex-wrap mb-4">
                    <div className="inline-block px-3 py-1.5 bg-purple-50 text-purple-700 rounded-md text-xs font-semibold">
                      {post.category}
                    </div>
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {post.tags
                          .filter(tag => tag.toLowerCase() !== post.category.toLowerCase())
                          .map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium border border-gray-200"
                            >
                              {tag}
                            </span>
                          ))}
                      </div>
                    )}
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 leading-tight group-hover:text-purple-700 transition-colors">{displayTitle}</h2>
                  {displayExcerpt && (
                    <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3 flex-grow text-base">{displayExcerpt}</p>
                  )}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(post.date)}</span>
                    </div>
                    <div className="text-purple-600 group-hover:text-purple-800 font-semibold text-sm flex items-center gap-2 transition-colors">
                      Read More
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </article>
                )
              })}
            </div>
          </div>
        </section>
      <Footer />
    </div>
  )
}

