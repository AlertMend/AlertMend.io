import { Helmet } from '../lib/helmet'
import { useLocation } from 'react-router-dom'
import { normalizePathname } from '../utils/urlUtils'

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
}

export default function SEO({
  title = 'AlertMend AI: Automate Infrastructure Management',
  description = 'AlertMend AI: Automate incident management for Kubernetes, VMs, and ECS. Cut costs, reduce downtime with our AIOps platform. Optimize now!',
  keywords = 'AIOps, Kubernetes, incident management, auto-remediation, SRE, DevOps, cloud-native, cost optimization, VM monitoring, ECS management, infrastructure automation, AI operations, Kubernetes monitoring, container orchestration, observability',
  canonical,
  ogImage = 'https://alertmend.io/og-image.jpg',
  ogType = 'website',
  noindex = false,
  structuredData,
  breadcrumbData,
}: SEOProps) {
  const location = useLocation()
  const siteUrl = 'https://www.alertmend.io'
  const fullTitle = title.includes('AlertMend') ? title : `${title} | AlertMend AI`
  
  // Generate canonical URL with proper normalization
  // If canonical is provided, use it (e.g., '/blog' for blog page)
  // Otherwise, use the current pathname
  let canonicalPath: string
  if (canonical) {
    canonicalPath = canonical.startsWith('/') ? canonical : `/${canonical}`
  } else {
    canonicalPath = location.pathname
  }
  
  // Normalize the pathname (remove trailing slash except root, remove query/hash)
  const normalizedPath = normalizePathname(canonicalPath)
  const canonicalUrl = `${siteUrl}${normalizedPath}`

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
      <meta name="keywords" content={keywords} />
      <meta name="author" content="AlertMend AI" />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'} />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="theme-color" content="#9333ea" />
      
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
    </Helmet>
  )
}

