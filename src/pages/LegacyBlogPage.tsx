import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { extractSlugFromOldUrl } from '../utils/blogSlugMapper'

/**
 * Component to handle legacy blog URLs (/blogs/*.html)
 * Redirects to the new blog format (/blog/:slug)
 */
export default function LegacyBlogPage() {
  const params = useParams<{ '*': string }>()
  const navigate = useNavigate()
  
  useEffect(() => {
    const oldPath = params['*'] || ''
    const newSlug = extractSlugFromOldUrl(oldPath)
    
    if (newSlug) {
      // Redirect to the new blog URL format
      navigate(`/blog/${newSlug}`, { replace: true })
    } else {
      // If we can't map it, redirect to blog listing
      navigate('/blog', { replace: true })
    }
  }, [params, navigate])
  
  // Show loading state while redirecting
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-purple-700">Redirecting...</p>
      </div>
    </div>
  )
}

