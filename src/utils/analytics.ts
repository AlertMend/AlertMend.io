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
 * @param additionalParams - Any additional parameters to include
 */
export function trackRegisterClick(
  source: string,
  blogSlug?: string | null,
  additionalParams?: Record<string, any>
) {
  const params: Record<string, any> = {
    event_category: 'registration',
    event_label: 'register_button_click',
    source: source,
    ...additionalParams,
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
 * @param additionalParams - Any additional parameters to include
 */
export function trackPlaygroundClick(
  source: string,
  blogSlug?: string | null,
  additionalParams?: Record<string, any>
) {
  const params: Record<string, any> = {
    event_category: 'engagement',
    event_label: 'playground_button_click',
    source: source,
    ...additionalParams,
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
 * @param additionalParams - Any additional parameters to include
 */
export function trackBookDemoClick(
  source: string,
  blogSlug?: string | null,
  additionalParams?: Record<string, any>
) {
  const params: Record<string, any> = {
    event_category: 'lead_generation',
    event_label: 'book_demo_button_click',
    source: source,
    ...additionalParams,
  }

  if (blogSlug) {
    params.blog_slug = blogSlug
    params.content_type = 'blog_post'
  } else if (source === 'blog-list') {
    params.content_type = 'blog_list'
  }

  trackEvent('book_demo_click', params)
}
