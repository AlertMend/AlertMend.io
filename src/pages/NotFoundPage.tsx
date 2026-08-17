import { useNavigate } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'
import SEO from '../components/SEO'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="404 - Page Not Found | AlertMend AI"
        description="The page you're looking for doesn't exist."
        noindex={true}
      />
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-20">
        <div className="text-center max-w-2xl">
          <h1 className="text-9xl font-bold text-brand-100 mb-4">404</h1>
          <h2 className="text-4xl font-bold text-brand-900 mb-4">Page Not Found</h2>
          <p className="text-lg text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/')}
              className="group bg-gradient-to-r from-brand-800 to-brand-900 text-white px-8 py-3 rounded-xl font-semibold hover:from-brand-900 hover:to-brand-900 transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center space-x-2"
            >
              <Home className="h-5 w-5" />
              <span>Go to Homepage</span>
            </button>
            <button
              onClick={() => navigate(-1)}
              className="border-2 border-brand-800 text-brand-900 px-8 py-3 rounded-xl font-semibold hover:bg-brand-50 transition-all flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Go Back</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

