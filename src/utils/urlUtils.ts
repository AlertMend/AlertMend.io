/**
 * Canonical URL Utility
 * Ensures all canonical URLs use correct domain and proper normalization
 */

const BASE_URL = 'https://www.alertmend.io'

/**
 * Normalizes a pathname by:
 * - Removing trailing slashes (except root)
 * - Removing query parameters and hash fragments
 * - Normalizing blog post slugs (underscores to hyphens, lowercase)
 */
export function normalizePathname(pathname: string): string {
  // Remove query parameters and hash fragments
  let normalized = pathname.split('?')[0].split('#')[0]
  
  // Remove trailing slash except for root
  if (normalized !== '/' && normalized.endsWith('/')) {
    normalized = normalized.slice(0, -1)
  }
  
  // Normalize blog post URLs: convert underscores to hyphens and lowercase
  // Handle /blogs/slug.html and /blog/slug patterns
  if (normalized.startsWith('/blogs/') || normalized.startsWith('/blog/')) {
    const parts = normalized.split('/')
    if (parts.length >= 3) {
      let slug = parts[2]
      // Check if slug has .html extension
      const hasHtmlExtension = slug.endsWith('.html')
      if (hasHtmlExtension) {
        slug = slug.replace('.html', '')
      }
      // Normalize slug: lowercase and convert underscores to hyphens
      const normalizedSlug = slug.toLowerCase().replace(/_/g, '-')
      // Reconstruct path with normalized slug
      if (normalized.startsWith('/blogs/')) {
        normalized = `/blogs/${normalizedSlug}${hasHtmlExtension ? '.html' : ''}`
      } else {
        normalized = `/blog/${normalizedSlug}`
      }
    }
  }
  
  return normalized
}

/**
 * Generates a canonical URL ensuring:
 * - Always uses www subdomain
 * - Pathname is normalized
 * - No query parameters or hash fragments
 */
export function getCanonicalUrl(pathname?: string): string {
  const currentPath = pathname || window.location.pathname
  const normalized = normalizePathname(currentPath)
  return `${BASE_URL}${normalized}`
}

/**
 * Sets the canonical URL in the document head
 * Returns true if successful, false otherwise
 */
export function setCanonicalUrl(url: string): boolean {
  // Ensure URL uses correct domain with www subdomain
  if (!url.includes('www.alertmend.io')) {
    console.warn(`⚠️ Canonical URL domain mismatch: ${url}`)
    // Normalize to www.alertmend.io
    url = url.replace(/https?:\/\/(www\.)?alertmend(ai)?\.(io|com)/g, 'https://www.alertmend.io')
  }
  
  // Remove existing canonical links
  const existingCanonicals = document.querySelectorAll('link[rel="canonical"]')
  existingCanonicals.forEach(link => link.remove())
  
  // Create and add new canonical link
  const link = document.createElement('link')
  link.rel = 'canonical'
  link.href = url
  document.head.appendChild(link)
  
  return true
}

/**
 * Verifies the canonical URL is correct
 * Note: React Helmet sets canonical URLs via the SEO component.
 * We should NOT override canonical URLs set by React Helmet (they have data-rh="true" attribute).
 */
export function verifyCanonicalUrl(): void {
  const canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
  
  // If React Helmet has set a canonical URL (has data-rh attribute), don't override it
  if (canonical && canonical.hasAttribute('data-rh')) {
    // React Helmet is managing this canonical URL, don't interfere
    return
  }
  
  // Only set canonical URL if React Helmet hasn't set one yet
  // This is a fallback for pages that don't use the SEO component
  if (!canonical) {
    const expectedUrl = getCanonicalUrl()
    setCanonicalUrl(expectedUrl)
  }
}

/**
 * Sets up MutationObserver to watch for changes to canonical URL
 * Note: We don't actively verify/override canonical URLs set by React Helmet
 * This is just a fallback for pages that don't use the SEO component
 */
export function setupCanonicalObserver(): void {
  // Only set initial canonical if React Helmet hasn't set one
  // Wait a bit for React to render
  setTimeout(() => {
    verifyCanonicalUrl()
  }, 1000)
}

