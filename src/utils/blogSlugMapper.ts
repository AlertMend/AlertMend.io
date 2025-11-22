/**
 * Maps old blog URL formats to new slug formats
 * This handles legacy URLs from /blogs/*.html to /blog/:slug
 */
export function mapOldBlogUrlToSlug(oldUrl: string): string | null {
  // Remove .html extension if present
  let slug = oldUrl.replace(/\.html$/, '')
  
  // Remove /blogs/ prefix if present
  slug = slug.replace(/^\/?blogs\//, '')
  
  // Create a mapping of old URL patterns to new slugs
  const urlMappings: Record<string, string> = {
    'Kubernetes-Evicted-Pods': 'kubernetes-evicted-pods',
    'kubernetes_502_bad_gateway_error_fix': 'kubernetes-502-bad-gateway',
    'Debugging-Kubernetes-Admission-Webhooks': 'debugging-kubernetes-admission-webhooks',
    'Privileged-Containers-in-Kubernetes': 'understanding-privileged-containers-kubernetes',
  }
  
  // Check if we have a direct mapping
  if (urlMappings[slug]) {
    return urlMappings[slug]
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
 */
export function extractSlugFromOldUrl(path: string): string | null {
  // Extract the filename from the path
  const match = path.match(/\/(?:blogs\/)?([^/]+)\.html?$/)
  if (!match) {
    return null
  }
  
  const filename = match[1]
  return mapOldBlogUrlToSlug(filename)
}

