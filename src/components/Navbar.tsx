import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, Zap, Bell, Activity, DollarSign, ChevronDown, Play } from 'lucide-react'
import AlertMendLogo from './AlertMendLogo'
import { trackRegisterClick, trackPlaygroundClick, trackBookDemoClick } from '../utils/analytics'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSolutionsOpen, setIsSolutionsOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const solutionsDropdownRef = useRef<HTMLDivElement>(null)

  // Get current solution from URL path
  const getCurrentSolution = () => {
    const pathname = location.pathname
    const validSolutions = ['auto-remediation', 'kubernetes-management', 'on-call-management', 'kubernetes-cost-optimization']
    
    // Check if we're on a solution page
    for (const solutionId of validSolutions) {
      if (pathname === `/${solutionId}` || pathname.startsWith(`/${solutionId}/`)) {
        return solutionId
      }
    }
    
    return pathname === '/' ? 'default' : null
  }
  
  const currentSolution = getCurrentSolution()

  // Detect if we're on a blog page and extract blog slug
  const getBlogTrackingInfo = () => {
    const pathname = location.pathname
    
    // Check if on blog listing page
    if (pathname === '/blog') {
      return { source: 'blog-list', slug: null }
    }
    
    // Check if on blog post page (/blog/:slug)
    const blogPostMatch = pathname.match(/^\/blog\/(.+)$/)
    if (blogPostMatch) {
      const slug = blogPostMatch[1]
      return { source: 'blog-post', slug }
    }
    
    // Check if on legacy blog post page (/blogs/:slug.html)
    const legacyBlogMatch = pathname.match(/^\/blogs\/(.+)\.html$/)
    if (legacyBlogMatch) {
      const slug = legacyBlogMatch[1]
      return { source: 'blog-post', slug }
    }
    
    return null
  }

  const blogTracking = getBlogTrackingInfo()

  // Solution-specific signup URLs
  const signupUrls: Record<string, string> = {
    'default': 'https://demo.alertmend.io/signup',
    'auto-remediation': 'https://demo.alertmend.io/signup?service=remediation',
    'kubernetes-management': 'https://demo.alertmend.io/signup?service=monitoring',
    'on-call-management': 'https://demo.alertmend.io/signup?service=on-call',
    'kubernetes-cost-optimization': 'https://demo.alertmend.io/signup?service=cost-optimization',
  }

  // Get base signup URL for current solution or default
  let baseSignupUrl = signupUrls[currentSolution || 'default'] || signupUrls['default']
  
  // Add blog tracking parameters if on a blog page
  let signupUrl = baseSignupUrl
  if (blogTracking) {
    const url = new URL(baseSignupUrl)
    url.searchParams.set('source', blogTracking.source)
    if (blogTracking.slug) {
      // Normalize slug: remove .html extension, lowercase, convert underscores to hyphens
      let normalizedSlug = blogTracking.slug.replace(/\.html$/, '').toLowerCase().replace(/_/g, '-')
      url.searchParams.set('blog_slug', normalizedSlug)
    }
    signupUrl = url.toString()
  }

  // Get playground URL with blog tracking parameters
  let playgroundUrl = 'https://demo.alertmend.io/playground'
  if (blogTracking) {
    const url = new URL(playgroundUrl)
    url.searchParams.set('source', blogTracking.source)
    if (blogTracking.slug) {
      // Normalize slug: remove .html extension, lowercase, convert underscores to hyphens
      let normalizedSlug = blogTracking.slug.replace(/\.html$/, '').toLowerCase().replace(/_/g, '-')
      url.searchParams.set('blog_slug', normalizedSlug)
    }
    playgroundUrl = url.toString()
  }

  const solutions = [
    { id: 'default', name: 'Platform Overview', icon: Zap, color: 'text-purple-600' },
    { id: 'auto-remediation', name: 'Automated Incident Remediation', icon: Zap, color: 'text-orange-600' },
    { id: 'kubernetes-management', name: 'Kubernetes Management with AI', icon: Activity, color: 'text-blue-600' },
    { id: 'on-call-management', name: 'On-Call', icon: Bell, color: 'text-purple-600' },
    { id: 'kubernetes-cost-optimization', name: 'Kubernetes Cost Optimization', icon: DollarSign, color: 'text-green-600' },
  ]

  const navItems = [
    { name: 'How It Works', id: 'how-it-works', isRoute: false },
    { name: 'Solutions', id: 'solutions', isRoute: false, hasDropdown: true },
    { name: 'Benefits', id: 'benefits', isRoute: false },
    { name: 'Case Studies', id: 'case-studies', isRoute: true, path: '/case-studies' },
    { name: 'Blog', id: 'blog', isRoute: true, path: '/blog' },
    { name: 'Pricing', id: 'pricing', isRoute: true, path: '/pricing' },
  ]

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (solutionsDropdownRef.current && !solutionsDropdownRef.current.contains(event.target as Node)) {
        setIsSolutionsOpen(false)
      }
    }

    if (isSolutionsOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isSolutionsOpen])

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false)
    setIsSolutionsOpen(false)
  }, [location.pathname])

  const handleClick = (item: typeof navItems[0]) => {
    if (item.hasDropdown) {
      setIsSolutionsOpen(!isSolutionsOpen)
      return
    }
    setIsOpen(false)
    setIsSolutionsOpen(false)
    
    if (item.isRoute && item.path) {
      // Navigate to route and scroll to top after navigation
      navigate(item.path)
      // Use setTimeout to ensure scroll happens after navigation completes
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'instant' })
      }, 0)
    } else {
      // Check if we're on a solution page
      const validSolutions = ['auto-remediation', 'kubernetes-management', 'on-call-management', 'kubernetes-cost-optimization']
      const isOnSolutionPage = validSolutions.some(solutionId => 
        location.pathname === `/${solutionId}` || location.pathname.startsWith(`/${solutionId}/`)
      )
      
      // If on a solution page, scroll to section on current page
      if (isOnSolutionPage) {
        const element = document.getElementById(item.id)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      } else if (location.pathname === '/') {
        // On homepage (Platform Overview), navigate to auto-remediation's How It Works
        navigate(`/auto-remediation#${item.id}`)
        // Wait for navigation then scroll
        setTimeout(() => {
          const element = document.getElementById(item.id)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }, 100)
      } else {
        // Not on homepage or solution page, navigate to auto-remediation with anchor
        navigate(`/auto-remediation#${item.id}`)
        // Wait for navigation then scroll
        setTimeout(() => {
          const element = document.getElementById(item.id)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }, 100)
      }
    }
  }

  const handleSolutionClick = (solutionId: string) => {
    setIsSolutionsOpen(false)
    setIsOpen(false)
    if (solutionId === 'default') {
      navigate('/')
    } else {
      navigate(`/${solutionId}`)
    }
    // Scroll to top when solution changes
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Check if current path matches nav item
  const isActiveRoute = (item: typeof navItems[0]) => {
    if (item.isRoute && item.path) {
      return location.pathname === item.path
    }
    return false
  }

  return (
    <nav className="fixed top-0 w-full bg-white/98 backdrop-blur-md border-b border-gray-200/80 shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button 
            type="button"
            onClick={() => navigate('/')}
            className="group flex items-center -ml-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <AlertMendLogo 
              size="sm"
              className="h-8"
              iconClassName="group-hover:scale-105 transition-transform duration-200"
              textClassName="group-hover:from-purple-800 group-hover:to-purple-700 transition-all duration-200"
            />
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              item.hasDropdown ? (
                <div key={item.id} className="relative" ref={solutionsDropdownRef}>
                  <button
                    type="button"
                    onClick={() => handleClick(item)}
                    className="flex items-center gap-1.5 px-4 py-2 text-purple-700 hover:text-purple-900 hover:bg-gray-50 rounded-lg transition-all duration-200 font-medium text-sm relative group"
                  >
                    <span>{item.name}</span>
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isSolutionsOpen ? 'rotate-180' : ''} text-gray-500`} />
                  </button>
                  
                  {/* Solutions Dropdown */}
                  {isSolutionsOpen && (
                    <div className="absolute top-full left-0 mt-1.5 w-72 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
                      <div className="p-1.5">
                        {solutions.map((solution) => {
                          const SolutionIcon = solution.icon
                          const isSelected = currentSolution === solution.id
                          return (
                            <button
                              type="button"
                              key={solution.id}
                              onClick={() => handleSolutionClick(solution.id)}
                              className={`w-full flex items-center gap-3 px-3 py-2.5 text-left rounded-md transition-all duration-150 ${
                                isSelected 
                                  ? 'bg-purple-50 text-purple-900' 
                                  : 'text-purple-700 hover:bg-gray-50'
                              }`}
                            >
                              <div className={`p-1.5 rounded-md ${isSelected ? 'bg-white shadow-sm' : 'bg-gray-50'}`}>
                                <SolutionIcon className={`h-4 w-4 ${solution.color}`} />
                              </div>
                              <span className={`flex-1 font-medium text-sm ${isSelected ? 'font-semibold' : ''}`}>
                                {solution.name}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => handleClick(item)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 relative ${
                    isActiveRoute(item)
                      ? 'text-purple-700 bg-purple-50'
                      : 'text-purple-700 hover:text-purple-900 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </button>
              )
            ))}
            <div className="ml-4 pl-4 border-l border-gray-200 flex items-center gap-2.5">
              <button 
                type="button"
                onClick={() => {
                  // Track playground click in Google Analytics
                  if (blogTracking) {
                    trackPlaygroundClick(blogTracking.source, blogTracking.slug)
                  } else {
                    trackPlaygroundClick('navbar', null, { solution: currentSolution || 'default' })
                  }
                  window.open(playgroundUrl, '_blank')
                }}
                className="group flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-purple-700 rounded-lg hover:bg-purple-800 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Play className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span>Playground</span>
              </button>
              <button 
                type="button"
                onClick={() => {
                  // Track registration click in Google Analytics
                  if (blogTracking) {
                    trackRegisterClick(blogTracking.source, blogTracking.slug)
                  } else {
                    trackRegisterClick('navbar', null, { solution: currentSolution || 'default' })
                  }
                  window.open(signupUrl, '_blank')
                }}
                className="px-4 py-2 text-sm font-medium text-purple-700 hover:text-purple-900 hover:bg-gray-50 rounded-lg transition-all duration-200"
              >
                Register
              </button>
              <button 
                type="button"
                onClick={() => {
                  // Track book demo click in Google Analytics
                  if (blogTracking) {
                    trackBookDemoClick(blogTracking.source, blogTracking.slug)
                  } else {
                    trackBookDemoClick('navbar', null, { solution: currentSolution || 'default' })
                  }
                  window.open('https://calendly.com/hello-alertmend/30min', '_blank')
                }}
                className="bg-gradient-to-r from-purple-800 to-purple-900 text-white px-5 py-2 rounded-lg hover:from-purple-900 hover:to-purple-950 transition-all shadow-sm hover:shadow-md font-semibold text-sm"
              >
                Book a Demo
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-purple-700 hover:bg-gray-50 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <div className="px-4 pt-2 pb-4 space-y-0.5">
            {navItems.map((item) => (
              item.hasDropdown ? (
                <div key={item.id}>
                  <button
                    type="button"
                    onClick={() => handleClick(item)}
                    className="flex items-center justify-between w-full text-left px-4 py-2.5 text-purple-700 hover:bg-gray-50 rounded-lg transition-all font-medium text-sm"
                  >
                    <span>{item.name}</span>
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isSolutionsOpen ? 'rotate-180' : ''} text-gray-500`} />
                  </button>
                  
                  {/* Mobile Solutions Dropdown */}
                  {isSolutionsOpen && (
                    <div className="ml-4 mt-0.5 space-y-0.5 border-l border-gray-200 pl-4">
                      {solutions.map((solution) => {
                        const SolutionIcon = solution.icon
                        const isSelected = currentSolution === solution.id
                        return (
                          <button
                            type="button"
                            key={solution.id}
                            onClick={() => handleSolutionClick(solution.id)}
                            className={`flex items-center gap-3 w-full text-left px-4 py-2 text-sm rounded-lg transition-all ${
                              isSelected ? 'bg-purple-50 text-purple-900 font-semibold' : 'text-purple-700 hover:bg-gray-50'
                            }`}
                          >
                            <div className={`p-1.5 rounded-md ${isSelected ? 'bg-white' : 'bg-gray-50'}`}>
                              <SolutionIcon className={`h-3.5 w-3.5 ${solution.color}`} />
                            </div>
                            <span className="font-medium flex-1">{solution.name}</span>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => handleClick(item)}
                  className={`block w-full text-left px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
                    isActiveRoute(item)
                      ? 'text-purple-700 bg-purple-50'
                      : 'text-purple-700 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </button>
              )
            ))}
            <div className="pt-3 mt-3 border-t border-gray-200 space-y-2">
              <button 
                type="button"
                onClick={() => {
                  setIsOpen(false)
                  // Track playground click in Google Analytics
                  if (blogTracking) {
                    trackPlaygroundClick(blogTracking.source, blogTracking.slug)
                  } else {
                    trackPlaygroundClick('navbar', null, { solution: currentSolution || 'default' })
                  }
                  window.open(playgroundUrl, '_blank')
                }}
                className="w-full flex items-center justify-center gap-2 text-white bg-purple-700 px-4 py-2.5 rounded-lg hover:bg-purple-800 transition-all font-semibold text-sm shadow-sm"
              >
                <Play className="h-4 w-4" />
                <span>Playground</span>
              </button>
              <button 
                type="button"
                onClick={() => {
                  setIsOpen(false)
                  // Track registration click in Google Analytics
                  if (blogTracking) {
                    trackRegisterClick(blogTracking.source, blogTracking.slug)
                  } else {
                    trackRegisterClick('navbar', null, { solution: currentSolution || 'default' })
                  }
                  window.open(signupUrl, '_blank')
                }}
                className="w-full text-purple-700 hover:text-purple-900 px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-all font-medium text-sm border border-gray-200"
              >
                Register
              </button>
              <button 
                type="button"
                onClick={() => {
                  setIsOpen(false)
                  // Track book demo click in Google Analytics
                  if (blogTracking) {
                    trackBookDemoClick(blogTracking.source, blogTracking.slug)
                  } else {
                    trackBookDemoClick('navbar', null, { solution: currentSolution || 'default' })
                  }
                  window.open('https://calendly.com/hello-alertmend/30min', '_blank')
                }}
                className="w-full bg-gradient-to-r from-purple-800 to-purple-900 text-white px-4 py-2.5 rounded-lg hover:from-purple-900 hover:to-purple-950 transition-all shadow-sm font-semibold text-sm"
              >
                Book a Demo
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

