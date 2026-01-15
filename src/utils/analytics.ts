/**
 * Google Analytics Event Tracking Utility
 * Provides helper functions for tracking events in Google Analytics
 */

// TypeScript declaration for Google Analytics gtag
declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date | 'page_view',
      config?: {
        page_path?: string
        page_title?: string
        page_location?: string
        [key: string]: any
      }
    ) => void
    dataLayer?: any[]
  }
}

/**
 * Track a Google Analytics event
 * @param eventName - Name of the event (e.g., 'register_click', 'button_click')
 * @param eventParams - Additional parameters for the event
 */
export function trackEvent(eventName: string, eventParams?: Record<string, any>) {
  if (typeof window === 'undefined') return

  const params = {
    ...eventParams,
    event_category: eventParams?.event_category || 'engagement',
    event_label: eventParams?.event_label || eventName,
  }

  // Use gtag if available (preferred method)
  if (window.gtag) {
    window.gtag('event', eventName, params)
  } else if (window.dataLayer) {
    // Fallback: push directly to dataLayer
    window.dataLayer.push({
      event: eventName,
      ...params,
    })
  }
}

/**
 * Track a registration click event with blog source information
 * @param source - Source of the registration (e.g., 'blog-list', 'blog-post', 'navbar')
 * @param blogSlug - Blog post slug if registering from a blog post
 * @param pagePath - Current page path where the click occurred (e.g., '/pricing', '/case-studies', '/')
 * @param additionalParams - Any additional parameters to include
 */
export function trackRegisterClick(
  source: string,
  blogSlug?: string | null,
  pagePath?: string,
  additionalParams?: Record<string, any>
) {
  const params: Record<string, any> = {
    event_category: 'registration',
    event_label: 'register_button_click',
    source: source,
    ...additionalParams,
  }

  // Add current page path
  if (pagePath) {
    params.page_path = pagePath
    // Add readable page name
    const pageName = getPageName(pagePath)
    if (pageName) {
      params.page_name = pageName
    }
  }

  if (blogSlug) {
    params.blog_slug = blogSlug
    params.content_type = 'blog_post'
  } else if (source === 'blog-list') {
    params.content_type = 'blog_list'
  }

  trackEvent('register_click', params)
}

/**
 * Track a playground click event with blog source information
 * @param source - Source of the click (e.g., 'blog-list', 'blog-post', 'navbar')
 * @param blogSlug - Blog post slug if clicking from a blog post
 * @param pagePath - Current page path where the click occurred (e.g., '/pricing', '/case-studies', '/')
 * @param additionalParams - Any additional parameters to include
 */
export function trackPlaygroundClick(
  source: string,
  blogSlug?: string | null,
  pagePath?: string,
  additionalParams?: Record<string, any>
) {
  const params: Record<string, any> = {
    event_category: 'engagement',
    event_label: 'playground_button_click',
    source: source,
    ...additionalParams,
  }

  // Add current page path
  if (pagePath) {
    params.page_path = pagePath
    // Add readable page name
    const pageName = getPageName(pagePath)
    if (pageName) {
      params.page_name = pageName
    }
  }

  if (blogSlug) {
    params.blog_slug = blogSlug
    params.content_type = 'blog_post'
  } else if (source === 'blog-list') {
    params.content_type = 'blog_list'
  }

  trackEvent('playground_click', params)
}

/**
 * Track a book demo click event with blog source information
 * @param source - Source of the click (e.g., 'blog-list', 'blog-post', 'navbar')
 * @param blogSlug - Blog post slug if clicking from a blog post
 * @param pagePath - Current page path where the click occurred (e.g., '/pricing', '/case-studies', '/')
 * @param additionalParams - Any additional parameters to include
 */
export function trackBookDemoClick(
  source: string,
  blogSlug?: string | null,
  pagePath?: string,
  additionalParams?: Record<string, any>
) {
  const params: Record<string, any> = {
    event_category: 'lead_generation',
    event_label: 'book_demo_button_click',
    source: source,
    ...additionalParams,
  }

  // Add current page path
  if (pagePath) {
    params.page_path = pagePath
    // Add readable page name
    const pageName = getPageName(pagePath)
    if (pageName) {
      params.page_name = pageName
    }
  }

  if (blogSlug) {
    params.blog_slug = blogSlug
    params.content_type = 'blog_post'
  } else if (source === 'blog-list') {
    params.content_type = 'blog_list'
  }

  trackEvent('book_demo_click', params)
}

/**
 * Get a readable page name from a path
 */
function getPageName(path: string): string | null {
  const pageNameMap: Record<string, string> = {
    '/': 'Homepage',
    '/pricing': 'Pricing',
    '/case-studies': 'Case Studies',
    '/blog': 'Blog Listing',
    '/auto-remediation': 'Auto Remediation',
    '/kubernetes-management': 'Kubernetes Management',
    '/on-call-management': 'On-Call Management',
    '/kubernetes-cost-optimization': 'Cost Optimization',
    '/about': 'About',
    '/contact': 'Contact',
    '/partners': 'Partners',
    '/careers': 'Careers',
    '/documentation': 'Documentation',
  }

  // Check exact match first
  if (pageNameMap[path]) {
    return pageNameMap[path]
  }

  // Check if it's a blog post (remove .html extension if present)
  const cleanPath = path.replace(/\.html$/, '')
  if (cleanPath.startsWith('/blog/') || cleanPath.startsWith('/blogs/')) {
    return 'Blog Post'
  }

  // Check if it's a case study detail
  if (path.startsWith('/case-studies/')) {
    return 'Case Study Detail'
  }

  return null
}

/**
 * Track a navigation menu click event with blog source information
 * @param menuItem - Name of the menu item clicked (e.g., 'How It Works', 'Solutions', 'Benefits', 'Case Studies', 'Blog', 'Pricing')
 * @param source - Source of the click (e.g., 'blog-list', 'blog-post', 'navbar')
 * @param blogSlug - Blog post slug if clicking from a blog post
 * @param additionalParams - Any additional parameters to include
 */
export function trackNavigationClick(
  menuItem: string,
  source: string,
  blogSlug?: string | null,
  additionalParams?: Record<string, any>
) {
  const params: Record<string, any> = {
    event_category: 'navigation',
    event_label: 'navigation_menu_click',
    menu_item: menuItem,
    source: source,
    ...additionalParams,
  }

  if (blogSlug) {
    params.blog_slug = blogSlug
    params.content_type = 'blog_post'
  } else if (source === 'blog-list') {
    params.content_type = 'blog_list'
  }

  trackEvent('navigation_click', params)
}

/**
 * Store blog source information in sessionStorage
 * This allows tracking blog source across all pages
 */
export function storeBlogSource(source: string, blogSlug?: string | null) {
  if (typeof window === 'undefined') return
  
  try {
    const blogSource = {
      source,
      blogSlug: blogSlug || null,
      timestamp: Date.now(),
    }
    sessionStorage.setItem('blog_source', JSON.stringify(blogSource))
  } catch (e) {
    // sessionStorage might not be available
    console.warn('Could not store blog source:', e)
  }
}

/**
 * Get blog source information from sessionStorage
 */
export function getBlogSource(): { source: string; blogSlug: string | null } | null {
  if (typeof window === 'undefined') return null
  
  try {
    const stored = sessionStorage.getItem('blog_source')
    if (!stored) return null
    
    const blogSource = JSON.parse(stored)
    // Check if stored data is still valid (within 30 minutes)
    const maxAge = 30 * 60 * 1000 // 30 minutes
    if (Date.now() - blogSource.timestamp > maxAge) {
      sessionStorage.removeItem('blog_source')
      return null
    }
    
    return {
      source: blogSource.source,
      blogSlug: blogSource.blogSlug,
    }
  } catch (e) {
    return null
  }
}

/**
 * Clear blog source information from sessionStorage
 */
export function clearBlogSource() {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.removeItem('blog_source')
  } catch (e) {
    // Ignore errors
  }
}
