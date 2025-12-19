import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Case studies data (matching src/data/caseStudies.ts)
const caseStudiesData = [
  { company: 'Polymer Search', category: 'Automated Incident Remediation' },
  { company: 'WareFlex', category: 'Cost Optimization' },
  { company: 'Decklar', category: 'Kubernetes Management' },
  { company: 'AIVOS', category: 'Automated Incident Remediation' },
]

// Special slug overrides for specific case studies
const specialSlugOverrides = {
  'Decklar': 'kubernetes-cost-optimization-case-studies-rombee',
}

// Helper function to convert category to URL slug
const categoryToSlug = (category) => {
  const categoryMap = {
    'Automated Incident Remediation': 'auto-remediation',
    'Cost Optimization': 'kubernetes-cost-optimization',
    'Kubernetes Management': 'kubernetes-management',
    'On-Call Management': 'on-call-management',
  }
  return categoryMap[category] || category.toLowerCase().replace(/\s+/g, '-')
}

// Helper function to generate case study slug
const generateCaseStudySlug = (category, company) => {
  // Check if there's a special override for this company
  if (specialSlugOverrides[company]) {
    return specialSlugOverrides[company]
  }
  const categorySlug = categoryToSlug(category)
  const companySlug = company.toLowerCase().replace(/\s+/g, '-')
  return `${categorySlug}-case-studies-${companySlug}`
}

// Function to convert slug (lowercase-hyphens) to HTML filename format (Title-Case-With-Hyphens)
// Small words (in, of, the, a, an, etc.) remain lowercase except at the start
const convertSlugToHtmlFilename = (slug) => {
  const stopWords = new Set(['in', 'of', 'the', 'a', 'an', 'and', 'or', 'but', 'for', 'to', 'at', 'on', 'by', 'with', 'from'])
  return slug
    .split('-')
    .map((word, index) => {
      // Always capitalize first word, lowercase stop words in middle, capitalize others
      if (index === 0 || !stopWords.has(word.toLowerCase())) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      }
      return word.toLowerCase()
    })
    .join('-')
}

// Canonical filename overrides supplied by SEO team
const canonicalFilenameOverrides = {
  'dns-resolution-failures-in-kubernetes': 'DNS-Resolution-Failures-in-Kubernetes.html',
  'debugging-kubernetes-admission-webhooks': 'Debugging-Kubernetes-Admission-Webhooks.html',
  'debugging-kubernetes-hpa-not-scaling': 'Debugging-Kubernetes-HPA-Not-Scaling.html',
  'debugging-kubernetes-jobs-and-cronjobs-failures': 'Debugging-Kubernetes-Jobs-and-CronJobs-Failures.html',
  'debugging-kubernetes-oomkilled-exit-code-137-causes-and-solutions': 'Debugging-Kubernetes-OOMKilled-(Exit-Code-137)-Causes-and-Solutions.html',
  'elasticsearch-caching-issues': 'Elasticsearch-Caching-Issues.html',
  'elasticsearch-cluster-health-showing-red': 'Elasticsearch-Cluster-Health-Showing-Red.html',
  'elasticsearch-cluster-yellow-incident-on-kubernetes': 'Elasticsearch-Cluster-Yellow-Incident-on-Kubernetes.html',
  'elasticsearch-disk-out-of-space-incident': 'Elasticsearch-Disk-Out-of-Space-Incident.html',
  'elasticsearch-shard-allocation-failures': 'Elasticsearch-Shard-Allocation-Failures.html',
  'elasticsearch-shard-relocation-incidents-on-kubernetes': 'Elasticsearch-Shard-Relocation-Incidents-on-Kubernetes.html',
  'elasticsearch-version-mismatch-in-cluster-nodes': 'Elasticsearch-Version-Mismatch-in-Cluster-Nodes.html',
  'elasticsearch-virtual-memory-limit-issues-for-optimal-performance': 'Elasticsearch-Virtual-Memory-Limit-Issues-for-Optimal-Performance.html',
  'elasticsearch-for-slow-index-flushing-issues': 'Elasticsearch-for-Slow-Index-Flushing-Issues.html',
  'frequent-garbage-collection-issues-in-elasticsearch-for-better-performance': 'Frequent-Garbage-Collection-Issues-in-Elasticsearch-for-Better-Performance.html',
  'graceful-shutdown-in-kubernetes': 'Graceful-Shutdown-in-Kubernetes.html',
  'kubernetes-api-rate-limiting-troubleshooting': 'Kubernetes-API-Rate-Limiting-Troubleshooting.html',
  'kubernetes-csi-driver-failures': 'Kubernetes-CSI-Driver-Failures.html',
  'kubernetes-configmap-and-secret-mount-failures': 'Kubernetes-ConfigMap-and-Secret-Mount-Failures.html',
  'kubernetes-container-volume-usage-issues': 'Kubernetes-Container-Volume-Usage-Issues.html',
  'kubernetes-dns-blog': 'Kubernetes-DNS-blog.html',
  'kubernetes-evicted-pods': 'Kubernetes-Evicted-Pods.html',
  'kubernetes-initcontainer-failures': 'Kubernetes-InitContainer-Failures.html',
  'kubernetes-load-balancer-failures': 'Kubernetes-Load-Balancer-Failures.html',
  'kubernetes-node-pressure-blog': 'Kubernetes-Node-Pressure-Blog.html',
  'kubernetes-service-discovery-failures': 'Kubernetes-Service-Discovery-Failures.html',
  'kubernetes-statefulset-volume-recovery-issues-troublshooting': 'Kubernetes-StatefulSet-Volume-Recovery-Issues-troublshooting.html',
  'kubernetes-statefulset-volume-recovery-issues': 'Kubernetes-StatefulSet-Volume-Recovery-Issues.html',
  'kubernetes-persistentvolumeclaim-guide': 'Kubernetes_PersistentVolumeClaim_Guide.html',
  'load-balancing-and-scaling-long-lived-connections-in-kubernetes': 'Load-Balancing-and-Scaling-Long-Lived-Connections-in-Kubernetes.html',
  'managing-high-number-of-queued-threads-in-elasticsearch-thread-pool-for-optimal-performance': 'Managing-High-Number-of-Queued-Threads-in-Elasticsearch-Thread-Pool-for-Optimal-Performance.html',
  'managing-high-number-of-rejected-threads-in-elasticsearch-thread-pool-for-better-performance': 'Managing-High-Number-of-Rejected-Threads-in-Elasticsearch-Thread-Pool-for-Better-Performance.html',
  'mastering-kubernetes-statefulsets-basics-and-debugging-tips': 'Mastering-Kubernetes-StatefulSets-Basics-and-Debugging-Tips.html',
  'mastering-load-balancing-for-persistent-connections-in-kubernetes': 'Mastering-Load-Balancing-for-Persistent-Connections-in-Kubernetes.html',
  'mastering-kubernetes-resource-quotas-requests-and-limits-for-optimized-cluster-performance': 'Mastering_Kubernetes_Resource_Quotas_Requests_and_Limits_for_Optimized_Cluster_Performance.html',
  'network-connectivity-and-latency-issues-in-elasticsearch': 'Network-Connectivity-and-Latency-Issues-in-Elasticsearch.html',
  'oomkilled-in-kubernetes': 'OOMKilled-in-Kubernetes.html',
  'optimizing-elasticsearch-heap-memory': 'Optimizing-Elasticsearch-Heap-Memory.html',
  'optimizing-elasticsearch-for-high-volume-indexing': 'Optimizing-Elasticsearch-for-High-Volume-Indexing.html',
  'optimizing-high-jvm-heap-usage-in-elasticsearch': 'Optimizing-High-JVM-Heap-Usage-in-Elasticsearch.html',
  'privileged-containers-in-kubernetes': 'Privileged-Containers-in-Kubernetes.html',
  'resolving-imagepullbackoff-and-errimagepull-in-kubernetes': 'Resolving_ImagePullBackOff_and_ErrImagePull_in_Kubernetes.html',
  'resolving-kubernetes-node-not-ready-error': 'Resolving_Kubernetes_Node_Not_Ready_Error.html',
  'roll-back-deployments-in-kubernetes': 'Roll-Back-Deployments-in-Kubernetes.html',
  'troubleshooting-elasticsearch-backlog-of-pending-tasks': 'Troubleshooting-Elasticsearch-Backlog-of-Pending-Tasks.html',
  'troubleshooting-elasticsearch-cluster-failures-and-instability': 'Troubleshooting-Elasticsearch-Cluster-Failures-and-Instability.html',
  'troubleshooting-elasticsearch-shard-initialization-failures-on-kubernetes': 'Troubleshooting-Elasticsearch-Shard-Initialization-Failures-on-Kubernetes.html',
  'troubleshooting-elasticsearch-unassigned-shards-incident-on-kubernetes': 'Troubleshooting-Elasticsearch-Unassigned-Shards-Incident-on-Kubernetes.html',
  'troubleshooting-kubeapidown': 'Troubleshooting-KubeAPIDown.html',
  'troubleshooting-kubernetes-ingress-issues': 'Troubleshooting-Kubernetes-Ingress-Issues.html',
  'troubleshooting-networking-errors-in-kubernetes': 'Troubleshooting-Networking-Errors-in-Kubernetes.html',
  'troubleshooting-unhealthy-elasticsearch-nodes-on-kubernetes': 'Troubleshooting-Unhealthy-Elasticsearch-Nodes-on-Kubernetes.html',
  'troubleshooting-unhealthy-kubernetes-daemonsets-a-comprehensive-guide': 'Troubleshooting-Unhealthy-Kubernetes-DaemonSets-A-Comprehensive-Guide.html',
  'understanding-kubernetes-crashloopbackoff': 'Understanding_Kubernetes_CrashLoopBackOff.html',
  'understanding-kubernetes-pending-pod': 'Understanding_Kubernetes_Pending-pod.html',
  'understanding-kubernetes-terminating-state': 'Understanding_Kubernetes_Terminating_State.html',
  'kubernetes-502-bad-gateway-error-fix': 'kubernetes_502_bad_gateway_error_fix.html',
  'slack-integration': 'slack-integration.html'
}
// Blog posts data (dynamically loaded from generated list)
const blogListPath = path.join(__dirname, '../src/utils/blogList.json')
const blogPosts = JSON.parse(fs.readFileSync(blogListPath, 'utf-8'))

const siteUrl = 'https://www.alertmend.io'
const currentDate = new Date().toISOString().split('T')[0]

// Helper function to normalize date format (ensures YYYY-MM-DD with two-digit day)
const normalizeDate = (dateString) => {
  if (!dateString) return currentDate
  // Match YYYY-MM-D or YYYY-MM-DD format
  const match = dateString.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/)
  if (match) {
    const [, year, month, day] = match
    // Pad month and day to two digits
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
  }
  return dateString
}

// Generate sitemap XML
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  
  <!-- Homepage -->
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Solutions -->
  <url>
    <loc>${siteUrl}/auto-remediation</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${siteUrl}/kubernetes-management</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${siteUrl}/on-call-management</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${siteUrl}/kubernetes-cost-optimization</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- Case Studies -->
  <url>
    <loc>${siteUrl}/case-studies</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
${caseStudiesData.map(study => {
  const slug = generateCaseStudySlug(study.category, study.company)
  return `  <url>
    <loc>${siteUrl}/case-studies/${slug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
}).join('\n')}
  
  <!-- Blog -->
  <url>
    <loc>${siteUrl}/blog</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
${blogPosts.map(post => {
  const defaultFilename = `${convertSlugToHtmlFilename(post.slug)}.html`
  const htmlFilename = canonicalFilenameOverrides[post.slug] || defaultFilename
  const normalizedDate = normalizeDate(post.date)
  
  // Automatically detect new blogs: blogs dated after Dec 18, 2025 are "new blogs"
  // New blogs only have /blog/{slug} entries (no /blogs/ entries)
  const newBlogCutoffDate = new Date('2025-12-18')
  const postDate = new Date(post.date || normalizedDate)
  const isNewBlog = postDate > newBlogCutoffDate
  
  // Also check hardcoded list for any legacy new blogs that might have earlier dates
  const legacyNewBlogsOnly = [
    'alertmend-kubernetes',
    'exit-status-127',
    'oomkilled',
    'fatal-not-a-git-repository',
    'openocd-exited-with-code-1',
    'kubectl-rollout',
    '5xx-errors',
    '5xx-error',
    '5xx-server-error',
    'crashloopbackoff-kubernetes',
    'fatal-refusing-to-merge-unrelated-histories',
    'error-failed-to-push-some-refs-to'
  ]
  
  const isLegacyNewBlog = legacyNewBlogsOnly.includes(post.slug)
  const isNewBlogFinal = isNewBlog || isLegacyNewBlog
  
  if (isNewBlogFinal) {
    // New blogs: only /blog/{slug} entry
    return `  <!-- Blog Post: ${post.slug} -->
  <url>
    <loc>${siteUrl}/blog/${post.slug}</loc>
    <lastmod>${normalizedDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
  } else {
    // Existing blogs: both /blog/{slug} and /blogs/{slug}.html entries
    return `  <!-- Blog Post: ${post.slug} -->
  <url>
    <loc>${siteUrl}/blog/${post.slug}</loc>
    <lastmod>${normalizedDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${siteUrl}/blogs/${htmlFilename}</loc>
    <lastmod>${normalizedDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
  }
}).join('\n')}
  
  <!-- Main Pages -->
  <url>
    <loc>${siteUrl}/pricing</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${siteUrl}/about</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${siteUrl}/contact</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${siteUrl}/partners</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${siteUrl}/documentation</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${siteUrl}/documentation/slack-app-approval</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${siteUrl}/documentation/slack-token-channel</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${siteUrl}/documentation/slack-rca-channel</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${siteUrl}/documentation/ms-teams-approval</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${siteUrl}/documentation/ms-teams-rf</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${siteUrl}/documentation/ms-teams-webhook</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${siteUrl}/documentation/datadog-webhook</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${siteUrl}/documentation/alertmend-vm-actions</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${siteUrl}/careers</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${siteUrl}/help</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${siteUrl}/community</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${siteUrl}/tutorials</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${siteUrl}/webinars</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  
  <!-- Legal Pages -->
  <url>
    <loc>${siteUrl}/privacy</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${siteUrl}/terms</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${siteUrl}/security</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${siteUrl}/compliance</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  
</urlset>
`

// Write sitemap to public directory
const sitemapPath = path.join(__dirname, '../public/sitemap.xml')
fs.writeFileSync(sitemapPath, sitemap, 'utf-8')

// Count new blogs (automatically detected by date > Dec 18, 2025, plus legacy list)
const newBlogCutoffDate = new Date('2025-12-18')
const legacyNewBlogsOnly = [
  'alertmend-kubernetes',
  'exit-status-127',
  'oomkilled',
  'fatal-not-a-git-repository',
  'openocd-exited-with-code-1',
  'kubectl-rollout',
  '5xx-errors',
  '5xx-error',
  '5xx-server-error',
  'crashloopbackoff-kubernetes',
  'fatal-refusing-to-merge-unrelated-histories',
  'error-failed-to-push-some-refs-to'
]
const newBlogsCount = blogPosts.filter(post => {
  const postDate = new Date(post.date || normalizeDate(post.date))
  const isNewBlogByDate = postDate > newBlogCutoffDate
  const isLegacyNewBlog = legacyNewBlogsOnly.includes(post.slug)
  return isNewBlogByDate || isLegacyNewBlog
}).length

console.log(`✅ Generated sitemap.xml with ${blogPosts.length} blog posts`)
console.log(`   ${newBlogsCount} new blogs use /blog/{slug} only`)
console.log(`   ${blogPosts.length - newBlogsCount} existing blogs include both /blog/{slug} and /blogs/{slug}.html`)

