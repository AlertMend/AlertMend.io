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

// Function to convert slug (lowercase-hyphens) to HTML filename format (Title_Case_With_Underscores)
const convertSlugToHtmlFilename = (slug) => {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('_')
}

// Blog posts data (dynamically loaded from generated list)
const blogListPath = path.join(__dirname, '../src/utils/blogList.json')
const blogPosts = JSON.parse(fs.readFileSync(blogListPath, 'utf-8'))

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
  const htmlFilename = convertSlugToHtmlFilename(post.slug)
  return `  <!-- Blog Post: ${post.slug} -->
  <url>
    <loc>${siteUrl}/blog/${post.slug}</loc>
    <lastmod>${post.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${siteUrl}/blogs/${htmlFilename}.html</loc>
    <lastmod>${post.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
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

console.log(`✅ Generated sitemap.xml with ${blogPosts.length} blog posts`)
console.log(`   Blog URLs include both /blog/{slug} and /blogs/{slug}.html entries`)

