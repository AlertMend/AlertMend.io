import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Blog posts data (matching src/utils/blogUtils.ts)
const blogPosts = [
  { slug: 'oomkilled-in-kubernetes', date: '2025-07-01' },
  { slug: 'graceful-shutdown-kubernetes', date: '2025-06-28' },
  { slug: 'load-balancing-long-lived-connections-kubernetes', date: '2025-06-25' },
  { slug: 'rollback-deployments-kubernetes', date: '2025-06-20' },
  { slug: '5-common-kubernetes-challenges', date: '2025-06-15' },
  { slug: 'troubleshooting-networking-errors-kubernetes', date: '2025-06-27' },
  { slug: 'debugging-kubernetes-admission-webhooks', date: '2025-06-14' },
  { slug: 'kubernetes-dns-guide', date: '2025-06-07' },
  { slug: 'kubernetes-node-not-ready-error', date: '2025-05-30' },
  { slug: 'mastering-kubernetes-statefulsets', date: '2025-05-30' },
  { slug: 'imagepullbackoff-errimagepull-kubernetes', date: '2025-05-21' },
  { slug: 'mastering-kubernetes-resource-quotas-requests-limits', date: '2025-05-21' },
  { slug: 'kubernetes-crashloopbackoff', date: '2025-02-28' },
  { slug: 'kubernetes-evicted-pods', date: '2025-02-24' },
  { slug: 'kubernetes-502-bad-gateway', date: '2025-02-01' },
  { slug: '5-ways-aiops-transforming-infrastructure', date: '2024-03-15' },
  { slug: 'kubernetes-auto-remediation-best-practices', date: '2024-03-10' },
  { slug: 'cost-optimization-multi-cloud', date: '2024-03-05' },
  { slug: 'kubernetes-statefulset-volume-recovery-issues', date: '2025-06-10' },
  { slug: 'mastering-load-balancing-persistent-connections-kubernetes', date: '2025-06-22' },
  { slug: 'troubleshooting-unhealthy-elasticsearch-nodes-kubernetes', date: '2025-05-18' },
  { slug: 'understanding-privileged-containers-kubernetes', date: '2025-05-08' },
  { slug: 'troubleshooting-elasticsearch-unassigned-shards-kubernetes', date: '2025-03-30' },
  { slug: 'troubleshooting-kubeapidown', date: '2025-03-25' },
  { slug: 'elasticsearch-cluster-yellow-incident-kubernetes', date: '2025-04-15' },
]

const siteUrl = 'https://www.alertmend.io'
const currentDate = new Date().toISOString().split('T')[0]

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
  
  <!-- Blog -->
  <url>
    <loc>${siteUrl}/blog</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
${blogPosts.map(post => `  <!-- Blog Post: ${post.slug} -->
  <url>
    <loc>${siteUrl}/blog/${post.slug}</loc>
    <lastmod>${post.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${siteUrl}/blog/${post.slug}.html</loc>
    <lastmod>${post.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n')}
  
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

console.log(`✅ Generated sitemap.xml with ${blogPosts.length} blog posts`)
console.log(`   All blog URLs use clean format: /blog/{slug} (no .html)`)

