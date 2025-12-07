import { useNavigate } from 'react-router-dom'
import { Calendar, ArrowRight } from 'lucide-react'
import { blogPosts, formatDate } from '../utils/blogUtils'

export default function LatestBlogPosts() {
  const navigate = useNavigate()
  
  // Get latest 6 blog posts
  const latestPosts = [...blogPosts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6)

  return (
    <section id="latest-blog-posts" className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden gradient-bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block px-5 py-2 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 rounded-full text-sm font-bold mb-5 shadow-md border border-purple-200/50">
            Latest Insights
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-purple-950 mb-4">
            Latest Blog Posts
          </h2>
          <p className="text-lg md:text-xl text-purple-700 max-w-2xl mx-auto leading-relaxed">
            Stay updated with the latest trends, best practices, and insights in AIOps and infrastructure management.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {latestPosts.map((post) => {
            // Ensure title is not empty or slug
            const displayTitle = post.title && post.title !== post.slug ? post.title : post.title || post.slug
            return (
            <article
              key={post.slug}
              onClick={() => navigate(`/blog/${post.slug}`)}
              className="group bg-white rounded-xl p-6 border border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-full"
            >
              <div className="flex items-center gap-2 flex-wrap mb-3">
                <div className="inline-block px-3 py-1 bg-purple-50 text-purple-700 rounded-md text-xs font-semibold">
                  {post.category}
                </div>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-purple-700 transition-colors">
                {displayTitle}
              </h3>
              <p className="text-gray-600 mb-4 leading-relaxed line-clamp-2 flex-grow text-sm">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-gray-500 text-xs">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(post.date)}</span>
                </div>
                <div className="text-purple-600 group-hover:text-purple-800 font-semibold text-xs flex items-center gap-1 transition-colors">
                  Read More
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </article>
            )
          })}
        </div>

        <div className="text-center">
          <button
            onClick={() => navigate('/blog')}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-800 to-purple-900 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-900 hover:to-purple-950 transition-all shadow-lg hover:shadow-xl"
          >
            View All Blog Posts
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  )
}

