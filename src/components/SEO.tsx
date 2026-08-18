import { Helmet } from '../lib/helmet'
import { useLocation } from 'react-router-dom'
import { normalizePathname } from '../utils/urlUtils'
import { LEGACY_KEYWORDS } from '../data/legacyKeywords'

/**
 * Unions a page's keywords with the ones production already serves for that
 * route, so a copy rewrite can add terms but never silently drop one. Matching
 * is case-insensitive; the page's own spelling wins, and its terms lead.
 */
function mergeLegacyKeywords(keywords: string, route: string): string {
  const own = keywords.split(',').map((k) => k.trim()).filter(Boolean)
  const seen = new Set(own.map((k) => k.toLowerCase()))
  const merged = [...own]
  for (const legacy of LEGACY_KEYWORDS[route] ?? []) {
    if (!seen.has(legacy.toLowerCase())) {
      seen.add(legacy.toLowerCase())
      merged.push(legacy)
    }
  }
  return merged.join(', ')
}

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  canonical?: string
  ogImage?: string
  ogType?: string
  noindex?: boolean
  structuredData?: object
  breadcrumbData?: {
    items: Array<{ label: string; path?: string }>
  }
  extraStructuredData?: object[]
}

export default function SEO({
  title = 'AlertMend: AI Observability & Automation for Kubernetes & AWS',
  description = 'AlertMend unifies metrics, logs, and traces, runs evidence-backed AI RCA, and remediates only after Slack or Teams approval — with rollback and a full audit trail.',
  keywords = 'AIOps, Kubernetes, incident management, RF remediation, SRE, DevOps, observability, AI RCA, cost optimization, VM monitoring, infrastructure automation, Kubernetes monitoring',
  canonical,
  ogImage = 'https://www.alertmend.io/og-image.jpg',
  ogType = 'website',
  noindex = false,
  structuredData,
  breadcrumbData,
  extraStructuredData,
}: SEOProps) {
  const location = useLocation()
  const siteUrl = 'https://www.alertmend.io'
  const fullTitle = title.includes('AlertMend') ? title : `${title} | AlertMend AI`
  
  // Generate canonical URL - use provided canonical directly, or fallback to pathname
  // If canonical is provided, use it directly (already normalized by the component)
  // Otherwise, use the current pathname
  let canonicalUrl: string
  if (canonical) {
    // Use canonical prop directly - it's already normalized by the component that provides it
    canonicalUrl = canonical.startsWith('http') ? canonical : `${siteUrl}${canonical.startsWith('/') ? canonical : `/${canonical}`}`
  } else {
    // Fallback: normalize the pathname
    const normalizedPath = normalizePathname(location.pathname)
    canonicalUrl = `${siteUrl}${normalizedPath}`
  }

  // Route key for the legacy-keyword union, derived from the canonical so it
  // matches what production serves rather than the in-app pathname.
  const keywordRoute = canonicalUrl.replace(siteUrl, '').replace(/\/$/, '') || '/'
  const mergedKeywords = mergeLegacyKeywords(keywords, keywordRoute)

  // Build breadcrumb structured data if provided
  const breadcrumbStructuredData = breadcrumbData ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${siteUrl}/`,
      },
      ...breadcrumbData.items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: item.label,
        item: item.path ? `${siteUrl}${item.path}` : canonicalUrl,
      })),
    ],
  } : null

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={mergedKeywords} />
      <meta name="author" content="AlertMend AI" />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'} />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="theme-color" content="#7c3aed" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="AlertMend AI" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
      
      {/* Breadcrumb Structured Data */}
      {breadcrumbStructuredData && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbStructuredData)}
        </script>
      )}

      {extraStructuredData?.map((data, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}
    </Helmet>
  )
}

