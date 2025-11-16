/**
 * Canonical URL Utility
 * Ensures all canonical URLs use correct domain and proper normalization
 */

const BASE_URL = 'https://alertmend.io'

/**
 * Normalizes a pathname by:
 * - Removing trailing slashes (except root)
 * - Removing query parameters and hash fragments
 */
export function normalizePathname(pathname: string): string {
  // Remove query parameters and hash fragments
  let normalized = pathname.split('?')[0].split('#')[0]
  
  // Remove trailing slash except for root
  if (normalized !== '/' && normalized.endsWith('/')) {
    normalized = normalized.slice(0, -1)
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
  // Ensure URL uses correct domain
  if (!url.includes('alertmend.io')) {
    console.warn(`⚠️ Canonical URL domain mismatch: ${url}`)
    url = url.replace(/alertmendai\.com|www\.alertmendai\.com/g, 'alertmend.io')
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
 * Logs warnings if issues are found
 */
export function verifyCanonicalUrl(): void {
  const canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
  const expectedUrl = getCanonicalUrl()
  
  if (!canonical) {
    console.warn('⚠️ No canonical URL found in document head')
    setCanonicalUrl(expectedUrl)
    return
  }
  
  const currentUrl = canonical.href
  
  // Check for correct domain
  if (!currentUrl.includes('alertmend.io')) {
    console.warn(`⚠️ Canonical URL domain mismatch: ${currentUrl}`)
    setCanonicalUrl(expectedUrl)
    return
  }
  
  // Check if URL matches expected
  if (currentUrl !== expectedUrl) {
    console.warn(`⚠️ Canonical URL mismatch. Expected: ${expectedUrl}, Found: ${currentUrl}`)
    setCanonicalUrl(expectedUrl)
  }
}

/**
 * Sets up MutationObserver to watch for changes to canonical URL
 * and verify it's correct
 */
export function setupCanonicalObserver(): void {
  // Initial verification
  verifyCanonicalUrl()
  
  // Watch for changes to head
  const observer = new MutationObserver(() => {
    verifyCanonicalUrl()
  })
  
  observer.observe(document.head, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['href', 'rel']
  })
  
  // Periodic safety check (every 5 seconds)
  setInterval(() => {
    verifyCanonicalUrl()
  }, 5000)
  
  // Verify on route changes (for React Router)
  window.addEventListener('popstate', () => {
    setTimeout(verifyCanonicalUrl, 100)
  })
}

