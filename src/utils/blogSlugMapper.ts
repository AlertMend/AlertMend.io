/**
 * Maps old blog URL formats to new slug formats
 * This handles legacy URLs from /blogs/*.html to /blog/:slug
 */
export function mapOldBlogUrlToSlug(oldUrl: string): string | null {
  // Remove .html extension if present
  let slug = oldUrl.replace(/\.html$/, '')
  
  // Remove /blogs/ prefix if present
  slug = slug.replace(/^\/?blogs\//, '')
  
  // Decode URL-encoded characters (handles Chinese characters)
  try {
    slug = decodeURIComponent(slug)
  } catch (e) {
    // If decoding fails, continue with original slug
  }
  
  // Create a mapping of old URL patterns to new slugs
  const urlMappings: Record<string, string> = {
    'Kubernetes-Evicted-Pods': 'kubernetes-evicted-pods',
    'kubernetes_502_bad_gateway_error_fix': 'kubernetes-502-bad-gateway',
    'Debugging-Kubernetes-Admission-Webhooks': 'debugging-kubernetes-admission-webhooks',
    'Privileged-Containers-in-Kubernetes': 'understanding-privileged-containers-kubernetes',
    // URLs with Chinese characters (URL-encoded: %E6%8E%92%E6%9F%A5=排查, %E8%A7%A3%E5%86%B3=解决, %E6%98%AF-%E4%BB%80%E4%B9%88=是什么)
    'code-exited-status-1failure解决': 'code-exited-status-1-failure',
    'Code-Exited-Status-1failure解决': 'code-exited-status-1-failure',
    'k8s-node-notready-排查': 'kubernetes-node-not-ready-troubleshooting',
    'K8s-Node-Notready-排查': 'kubernetes-node-not-ready-troubleshooting',
    'cpu-throttling-是-什么': 'what-is-cpu-throttling',
    'Cpu-Throttling-是-什么': 'what-is-cpu-throttling',
  }
  
  // Check if we have a direct mapping (case-insensitive for Chinese character variations)
  const normalizedSlug = slug.toLowerCase()
  for (const [key, value] of Object.entries(urlMappings)) {
    if (slug === key || normalizedSlug === key.toLowerCase()) {
      return value
    }
  }
  
  // Also check for pattern matches (handles case variations)
  if (slug.match(/code.*exit.*status.*1.*failure.*解决/i) || slug.match(/code.*exited.*status.*1.*failure/i)) {
    return 'code-exited-status-1-failure'
  }
  if (slug.match(/k8s.*node.*not.*ready.*排查/i) || slug.match(/k8s.*node.*notready.*排查/i)) {
    return 'kubernetes-node-not-ready-troubleshooting'
  }
  if (slug.match(/cpu.*throttling.*是.*什么/i) || slug.match(/cpu.*throttling.*是-什么/i)) {
    return 'what-is-cpu-throttling'
  }
  
  // Try to convert common patterns:
  // - Replace underscores with hyphens
  // - Convert to lowercase
  // - Handle PascalCase/CamelCase by inserting hyphens before capitals
  let normalized = slug
    .replace(/_/g, '-')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase()
  
  return normalized
}

/**
 * Extracts slug from old blog URL path
 * Handles formats like:
 * - /blogs/Kubernetes-Evicted-Pods.html
 * - /blogs/kubernetes_502_bad_gateway_error_fix.html
 * - blogs/Debugging-Kubernetes-Admission-Webhooks.html
 * - Privileged-Containers-in-Kubernetes.html (from React Router params)
 */
export function extractSlugFromOldUrl(path: string): string | null {
  if (!path) {
    return null
  }
  
  // Remove leading slash if present
  let cleanPath = path.replace(/^\/+/, '')
  
  // Remove /blogs/ prefix if present
  cleanPath = cleanPath.replace(/^blogs\//, '')
  
  // Extract the filename (remove .html extension)
  const filename = cleanPath.replace(/\.html?$/, '')
  
  if (!filename) {
    return null
  }
  
  return mapOldBlogUrlToSlug(filename)
}

