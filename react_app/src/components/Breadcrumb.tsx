import { useNavigate, useLocation } from 'react-router-dom'
import { ChevronRight, Home, Zap, Activity, Bell, DollarSign } from 'lucide-react'
import { Helmet } from 'react-helmet-async'

interface BreadcrumbItem {
  label: string
  path?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  showSolutions?: boolean
}

export default function Breadcrumb({ items, showSolutions = false }: BreadcrumbProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const siteUrl = 'https://alertmend.io'

  // All solutions for breadcrumb
  const allSolutions = [
    { id: 'auto-remediation', label: 'Automated Incident Remediation', icon: Zap, path: '/auto-remediation' },
    { id: 'kubernetes-management', label: 'Kubernetes Management', icon: Activity, path: '/kubernetes-management' },
    { id: 'on-call-management', label: 'On-Call', icon: Bell, path: '/on-call-management' },
    { id: 'kubernetes-cost-optimization', label: 'Cost Optimization', icon: DollarSign, path: '/kubernetes-cost-optimization' },
  ]

  // Check if current page is a solution page
  const currentPath = location.pathname
  const isSolutionPage = allSolutions.some(sol => currentPath.includes(sol.id))

  // Build breadcrumb list for structured data
  const breadcrumbList = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: `${siteUrl}/`,
    },
    ...items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 2,
      name: item.label,
      item: item.path ? `${siteUrl}${item.path}` : `${siteUrl}${location.pathname}`,
    })),
  ]

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbList,
  }

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      <nav 
        className="mb-6 text-sm text-purple-700 flex items-center flex-wrap gap-2" 
        aria-label="Breadcrumb"
      >
        <button
          onClick={() => navigate('/')}
          className="flex items-center hover:text-purple-900 transition-colors font-medium"
          aria-label="Home"
        >
          <Home className="h-4 w-4 mr-1" />
          <span>Home</span>
        </button>
        
        {/* Show Solutions section if on solution page or if showSolutions is true */}
        {(isSolutionPage || showSolutions) && (
          <>
            <ChevronRight className="h-4 w-4 text-purple-400" />
            <span className="text-purple-600 font-medium">Solutions</span>
            <ChevronRight className="h-4 w-4 text-purple-400" />
            <div className="flex items-center flex-wrap gap-2">
              {allSolutions.map((solution, index) => {
                const SolutionIcon = solution.icon
                const isActive = currentPath.includes(solution.id)
                return (
                  <div key={solution.id} className="flex items-center gap-2">
                    {index > 0 && <span className="text-purple-300">•</span>}
                    <button
                      onClick={() => navigate(solution.path)}
                      className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-all ${
                        isActive
                          ? 'text-purple-900 bg-purple-100 font-semibold'
                          : 'text-purple-600 hover:text-purple-900 hover:bg-purple-50'
                      }`}
                    >
                      <SolutionIcon className="h-3.5 w-3.5" />
                      <span className="text-xs">{solution.label}</span>
                    </button>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {/* Regular breadcrumb items */}
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4 text-purple-400" />
            {item.path && index < items.length - 1 ? (
              <button
                onClick={() => navigate(item.path!)}
                className="hover:text-purple-900 transition-colors font-medium"
              >
                {item.label}
              </button>
            ) : (
              <span className="text-purple-900 font-semibold" aria-current="page">
                {item.label}
              </span>
            )}
          </div>
        ))}
      </nav>
    </>
  )
}

