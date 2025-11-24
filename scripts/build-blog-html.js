import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { marked } from 'marked'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Blog posts data (matching src/utils/blogUtils.ts)
const blogPosts = [
  { slug: 'oomkilled-in-kubernetes', title: 'How to Fix OOMKilled Errors in Kubernetes', category: 'Kubernetes' },
  { slug: 'graceful-shutdown-kubernetes', title: 'Graceful Shutdown in Kubernetes: Ensuring Safe Pod Termination', category: 'Kubernetes' },
  { slug: 'load-balancing-long-lived-connections-kubernetes', title: 'Load Balancing and Scaling Long-Lived Connections in Kubernetes', category: 'Kubernetes' },
  { slug: 'rollback-deployments-kubernetes', title: 'How to Roll Back Deployments in Kubernetes', category: 'Kubernetes' },
  { slug: '5-common-kubernetes-challenges', title: '5 Common Kubernetes Challenges: Scaling, Networking, GitOps & More', category: 'Kubernetes' },
  { slug: 'troubleshooting-networking-errors-kubernetes', title: 'Troubleshooting Networking Errors in Kubernetes', category: 'Kubernetes' },
  { slug: 'debugging-kubernetes-admission-webhooks', title: 'Debugging Kubernetes Admission Webhooks: A Complete Guide', category: 'Kubernetes' },
  { slug: 'kubernetes-dns-guide', title: 'Mastering Kubernetes DNS: A Guide to Seamless Communication in Your Cluster', category: 'Kubernetes' },
  { slug: 'kubernetes-node-not-ready-error', title: 'How to Troubleshoot and Fix Kubernetes Node Not Ready Error', category: 'Kubernetes' },
  { slug: 'mastering-kubernetes-statefulsets', title: 'Mastering Kubernetes StatefulSets: Basics, Use Cases, and Debugging Tips', category: 'Kubernetes' },
  { slug: 'imagepullbackoff-errimagepull-kubernetes', title: 'How to Troubleshoot and Fix ImagePullBackOff and ErrImagePull in Kubernetes', category: 'Kubernetes' },
  { slug: 'mastering-kubernetes-resource-quotas-requests-limits', title: 'Mastering Kubernetes Resource Quotas, Requests, and Limits for Optimized Cluster Performance', category: 'Kubernetes' },
  { slug: 'kubernetes-crashloopbackoff', title: 'Understanding and Troubleshooting Kubernetes CrashLoopBackOff', category: 'Kubernetes' },
  { slug: 'kubernetes-evicted-pods', title: 'Kubernetes Evicted Pods: Causes, Troubleshooting, and Best Practices', category: 'Kubernetes' },
  { slug: 'kubernetes-502-bad-gateway', title: 'How to Troubleshoot and Fix Kubernetes 502 Bad Gateway Error', category: 'Kubernetes' },
  { slug: '5-ways-aiops-transforming-infrastructure', title: '5 Ways AIOps is Transforming Infrastructure Management', category: 'AIOps' },
  { slug: 'kubernetes-auto-remediation-best-practices', title: 'Kubernetes Auto-Remediation: Best Practices', category: 'Kubernetes' },
  { slug: 'cost-optimization-multi-cloud', title: 'Cost Optimization Strategies for Multi-Cloud Infrastructure', category: 'Cost Optimization' },
  { slug: 'kubernetes-statefulset-volume-recovery-issues', title: 'Kubernetes StatefulSet Volume Recovery Issues: Troubleshooting and Best Practices', category: 'Kubernetes' },
  { slug: 'mastering-load-balancing-persistent-connections-kubernetes', title: 'Mastering Load Balancing for Persistent Connections in Kubernetes', category: 'Kubernetes' },
  { slug: 'troubleshooting-unhealthy-elasticsearch-nodes-kubernetes', title: 'Troubleshooting Unhealthy Elasticsearch Nodes on Kubernetes: Causes and Solutions', category: 'Elasticsearch' },
  { slug: 'understanding-privileged-containers-kubernetes', title: 'Understanding Privileged Containers in Kubernetes: Best Practices and Security Risks', category: 'Kubernetes' },
  { slug: 'troubleshooting-elasticsearch-unassigned-shards-kubernetes', title: 'Troubleshooting Elasticsearch Unassigned Shards Incident on Kubernetes: Causes and Solutions', category: 'Elasticsearch' },
  { slug: 'troubleshooting-kubeapidown', title: 'Troubleshooting KubeAPI Down: Causes and Recovery Steps', category: 'Kubernetes' },
  { slug: 'elasticsearch-cluster-yellow-incident-kubernetes', title: 'Elasticsearch Cluster Yellow Incident on Kubernetes', category: 'Elasticsearch' },
]

// Configure marked options
marked.setOptions({
  gfm: true,
  breaks: false,
  headerIds: true,
  mangle: false,
})

// Read blog markdown files
const blogDir = path.join(__dirname, '../public/blog')
const outputDir = path.join(__dirname, '../dist/blog') // For directory versions (non-HTML)
const blogsHtmlDir = path.join(__dirname, '../dist/blogs') // For HTML files

// Ensure output directories exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}
if (!fs.existsSync(blogsHtmlDir)) {
  fs.mkdirSync(blogsHtmlDir, { recursive: true })
}

// Helper function to calculate read time
const calculateReadTime = (text) => {
  const words = text.split(/\s+/).length
  const minutes = Math.ceil(words / 200)
  return `${minutes} min read`
}

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Read all markdown files
const markdownFiles = fs.readdirSync(blogDir).filter(file => file.endsWith('.md'))

console.log(`Found ${markdownFiles.length} markdown files to convert...`)

markdownFiles.forEach(file => {
  const markdownPath = path.join(blogDir, file)
  const slug = file.replace('.md', '')
  // HTML version goes to /blogs/ directory
  const htmlPath = path.join(blogsHtmlDir, `${slug}.html`)
  // Directory version (non-HTML) goes to /blog/ directory
  const dirPath = path.join(outputDir, slug, 'index.html')
  
  try {
    // Read markdown content
    const markdown = fs.readFileSync(markdownPath, 'utf-8')
    
    // Parse frontmatter
    const frontmatterMatch = markdown.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
    if (!frontmatterMatch) {
      console.warn(`Skipping ${file}: No frontmatter found`)
      return
    }
    
    const frontmatter = frontmatterMatch[1]
    const content = frontmatterMatch[2]
    
    // Parse frontmatter fields
    const metadata = {}
    frontmatter.split('\n').forEach((line) => {
      const match = line.match(/^(\w+):\s*["']?([^"']+)["']?$/)
      if (match) {
        metadata[match[1]] = match[2]
      }
    })
    
    // Helper function to truncate H2 headings to 50-70 characters for SEO
    const truncateH2Heading = (heading, minLength = 50, maxLength = 70) => {
      if (heading.length >= minLength && heading.length <= maxLength) {
        return heading
      }
      if (heading.length < minLength) {
        return heading // Better to have shorter heading than to pad
      }
      if (heading.length > maxLength) {
        let truncated = heading.substring(0, maxLength - 3)
        const lastSpaceIndex = truncated.lastIndexOf(' ')
        if (lastSpaceIndex > maxLength * 0.7) {
          truncated = truncated.substring(0, lastSpaceIndex)
        }
        truncated = truncated.replace(/[.,;:!?\-—–\s]+$/, '').trim()
        if (truncated.length < heading.length) {
          return truncated + '...'
        }
        return truncated
      }
      return heading
    }
    
    // Convert markdown to HTML and replace H1 with H2 (to avoid multiple H1 tags)
    let htmlContent = marked.parse(content)
    // Replace all <h1> tags with <h2> in the markdown content (main title is already H1)
    htmlContent = htmlContent.replace(/<h1>/g, '<h2>').replace(/<\/h1>/g, '</h2>')
    
    // Truncate H2 headings to 50-70 characters for SEO
    htmlContent = htmlContent.replace(/<h2[^>]*>(.*?)<\/h2>/gi, (match, headingText) => {
      // Remove HTML tags from heading text
      const cleanText = headingText.replace(/<[^>]+>/g, '').trim()
      const truncated = truncateH2Heading(cleanText)
      // Preserve the original H2 tag attributes and structure
      const h2Match = match.match(/<h2([^>]*)>/)
      const attributes = h2Match ? h2Match[1] : ''
      return `<h2${attributes}>${truncated}</h2>`
    })
    
    // Get related posts (prioritize same category, then other posts, excluding current post)
    const sameCategoryPosts = blogPosts
      .filter(p => p.category === metadata.category && p.slug !== slug)
      .slice(0, 3)
    
    const otherPosts = blogPosts
      .filter(p => p.category !== metadata.category && p.slug !== slug)
      .slice(0, 7)
    
    // Combine: 3 from same category + 7 from other categories = 10 total
    const relatedPosts = [...sameCategoryPosts, ...otherPosts].slice(0, 10)
    
    // Helper function to truncate blog title to 30-60 characters for SEO
    const truncateBlogTitle = (title, suffix = ' | AlertMend AI', minLength = 30, maxLength = 60) => {
      // If title with suffix fits within max length, return as is
      if (title.length + suffix.length <= maxLength) {
        if (title.length + suffix.length >= minLength) {
          return title + suffix
        }
        return title + suffix
      }
      
      // Calculate how many characters we can use for the title
      // Leave space for suffix and ellipsis if needed
      const availableLength = maxLength - suffix.length - 3 // -3 for "..."
      
      // Truncate title to fit
      let truncatedTitle = title.substring(0, availableLength)
      
      // Try to truncate at a word boundary (space) if possible
      const lastSpaceIndex = truncatedTitle.lastIndexOf(' ')
      if (lastSpaceIndex > availableLength * 0.7) {
        // Only use word boundary if it's not too short
        truncatedTitle = truncatedTitle.substring(0, lastSpaceIndex)
      }
      
      // Remove trailing punctuation and whitespace
      truncatedTitle = truncatedTitle.replace(/[.,;:!?\-—–\s]+$/, '').trim()
      
      return truncatedTitle + '...' + suffix
    }
    
    const shortenedTitle = truncateBlogTitle(metadata.title || slug)
    
    // Helper function to generate unique meta description
    const generateUniqueMetaDescription = (title, excerpt, content, category, maxLength = 160, minLength = 50) => {
      let description = excerpt || ''
      
      // If no excerpt or excerpt is too short, generate from content
      if (!description || description.length < minLength) {
        if (content) {
          const cleanContent = content
            .replace(/[#*`]/g, '')
            .replace(/\n+/g, ' ')
            .trim()
          
          let text = cleanContent.substring(0, 200)
          const lastPeriod = text.lastIndexOf('.')
          if (lastPeriod > 100) {
            text = text.substring(0, lastPeriod + 1)
          }
          description = text.trim()
        }
      }
      
      // If still no description, create one from title and category
      if (!description || description.length < minLength) {
        const categoryText = category ? ` on ${category}` : ''
        description = `Learn how to ${title.toLowerCase()}${categoryText}. Expert tips and best practices from AlertMend AI.`
      }
      
      // Ensure uniqueness by including key terms from title
      const titleWords = title.toLowerCase().split(/\s+/).filter(word => word.length > 4)
      const descriptionLower = description.toLowerCase()
      const missingKeywords = titleWords.filter(word => !descriptionLower.includes(word))
      
      if (missingKeywords.length > 0 && description.length < maxLength - 30) {
        const keywordsToAdd = missingKeywords.slice(0, 2).join(', ')
        description = `${description} Discover solutions for ${keywordsToAdd}.`
      }
      
      // Truncate to max length at word boundary
      if (description.length > maxLength) {
        let truncated = description.substring(0, maxLength - 3)
        const lastSpace = truncated.lastIndexOf(' ')
        if (lastSpace > maxLength * 0.7) {
          truncated = truncated.substring(0, lastSpace)
        }
        truncated = truncated.replace(/[.,;:!?\-—–\s]+$/, '').trim()
        description = truncated + '...'
      }
      
      // Ensure minimum length
      if (description.length < minLength) {
        const padding = `Expert guide on ${category || 'Kubernetes'} troubleshooting.`
        description = description + ' ' + padding
        if (description.length > maxLength) {
          description = description.substring(0, maxLength - 3) + '...'
        }
      }
      
      return description.trim()
    }
    
    const metaDescription = generateUniqueMetaDescription(
      metadata.title || slug,
      metadata.excerpt || '',
      content,
      metadata.category || ''
    )
    
    // Function to create HTML head with specific canonical URL
    const createHTMLHead = (canonicalUrl) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${shortenedTitle}</title>
  <meta name="description" content="${metaDescription.replace(/"/g, '&quot;')}">
  <meta name="author" content="${metadata.author || 'AlertMend Team'}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <link rel="canonical" href="${canonicalUrl}">
  
  <!-- Open Graph -->
  <meta property="og:type" content="article">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:title" content="${shortenedTitle}">
  <meta property="og:description" content="${metaDescription.replace(/"/g, '&quot;')}">
  <meta property="og:image" content="https://alertmend.io/og-image.jpg">
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${canonicalUrl}">
  <meta name="twitter:title" content="${shortenedTitle}">
  <meta name="twitter:description" content="${metaDescription.replace(/"/g, '&quot;')}">
  <meta name="twitter:image" content="https://alertmend.io/og-image.jpg">
  
  <!-- Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "${shortenedTitle}",
    "description": "${metaDescription.replace(/"/g, '\\"')}",
    "image": "https://alertmend.io/og-image.jpg",
    "datePublished": "${metadata.date || ''}",
    "dateModified": "${metadata.date || ''}",
    "author": {
      "@type": "Person",
      "name": "${metadata.author || 'AlertMend Team'}"
    },
    "publisher": {
      "@type": "Organization",
      "name": "AlertMend AI",
      "logo": {
        "@type": "ImageObject",
        "url": "https://alertmend.io/logos/alertmend-logo.svg"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "${canonicalUrl}"
    },
    "articleSection": "${metadata.category || 'Blog'}"
  }
  </script>
  
  <!-- SearchAtlas Dynamic Optimization -->
  <script nowprocket nitro-exclude type="text/javascript" id="sa-dynamic-optimization" data-uuid="457086dd-8bfb-46dd-a38d-2f4a6efd0e7e" src="data:text/javascript;base64,dmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoInNjcmlwdCIpO3NjcmlwdC5zZXRBdHRyaWJ1dGUoIm5vd3Byb2NrZXQiLCAiIik7c2NyaXB0LnNldEF0dHJpYnV0ZSgibml0cm8tZXhjbHVkZSIsICIiKTtzY3JpcHQuc3JjID0gImh0dHBzOi8vZGFzaGJvYXJkLnNlYXJjaGF0bGFzLmNvbS9zY3JpcHRzL2R5bmFtaWNfb3B0aW1pemF0aW9uLmpzIjtzY3JpcHQuZGF0YXNldC51dWlkID0gIjQ1NzA4NmRkLThiZmItNDZkZC1hMzhkLTJmNGE2ZWZkMGU3ZSI7c2NyaXB0LmlkID0gInNhLWR5bmFtaWMtb3B0aW1pemF0aW9uLWxvYWRlciI7ZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpOw=="></script>
  
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.7;
      color: #1f2937;
      background: #ffffff;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    .main-container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 96px 16px 32px;
      margin-top: 64px;
    }
    @media (min-width: 640px) {
      .main-container {
        padding: 96px 24px 32px;
      }
    }
    @media (min-width: 1024px) {
      .main-container {
        padding: 96px 32px 48px;
      }
    }
    .content-wrapper {
      display: grid;
      grid-template-columns: 1fr;
      gap: 32px;
      margin-top: 32px;
    }
    @media (min-width: 1024px) {
      .content-wrapper {
        grid-template-columns: 8fr 4fr;
        gap: 32px;
      }
    }
    .main-content {
      display: flex;
      gap: 24px;
    }
    .social-sidebar {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding-top: 8px;
    }
    .social-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #f3f4f6;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
      text-decoration: none;
    }
    .social-icon:hover {
      background: #f3e8ff;
    }
    .article-content {
      flex: 1;
    }
    article {
      background: #ffffff;
    }
    header {
      margin-bottom: 32px;
    }
    h1 {
      color: #581c87;
      font-size: 2.25rem;
      font-weight: 700;
      line-height: 1.2;
      margin-bottom: 24px;
    }
    @media (min-width: 768px) {
      h1 {
        font-size: 3rem;
      }
    }
    @media (min-width: 1024px) {
      h1 {
        font-size: 3.75rem;
      }
    }
    h2 {
      color: #581c87;
      font-size: 1.875rem;
      font-weight: 700;
      margin-top: 40px;
      margin-bottom: 20px;
      line-height: 1.2;
    }
    @media (min-width: 768px) {
      h2 {
        font-size: 2.25rem;
      }
    }
    h3 {
      color: #581c87;
      font-size: 1.5rem;
      font-weight: 700;
      margin-top: 32px;
      margin-bottom: 16px;
      line-height: 1.2;
    }
    @media (min-width: 768px) {
      h3 {
        font-size: 1.875rem;
      }
    }
    h4, h5, h6 {
      color: #581c87;
      font-weight: 600;
      margin-top: 24px;
      margin-bottom: 12px;
    }
    p {
      margin-bottom: 24px;
      font-size: 1.125rem;
      line-height: 1.75;
      color: #1f2937;
    }
    .author-info {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 16px;
    }
    .author-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #e9d5ff;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #9333ea;
      font-weight: 600;
      font-size: 1rem;
    }
    .author-details {
      display: flex;
      flex-direction: column;
    }
    .author-name {
      font-weight: 600;
      color: #111827;
      font-size: 1rem;
    }
    .author-meta {
      font-size: 0.875rem;
      color: #6b7280;
    }
    .category-tag {
      display: inline-block;
      padding: 4px 12px;
      background: #dbeafe;
      color: #1e40af;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 600;
      margin-top: 16px;
    }
    code {
      background: #f3f4f6;
      color: #9333ea;
      padding: 0.2em 0.4em;
      border-radius: 4px;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
      font-size: 0.9em;
      border: 1px solid #e5e7eb;
    }
    pre {
      background: #1f2937;
      color: #f9fafb;
      padding: 1.5rem;
      border-radius: 8px;
      overflow-x: auto;
      margin: 1.5rem 0;
      border: 1px solid #374151;
    }
    pre code {
      background: none;
      color: #f9fafb;
      padding: 0;
      border: none;
      font-size: 0.875rem;
    }
    a {
      color: #9333ea;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s;
    }
    a:hover {
      color: #7c3aed;
      text-decoration: underline;
    }
    ul, ol {
      margin-bottom: 24px;
      padding-left: 24px;
      font-size: 1.125rem;
      line-height: 1.75;
    }
    li {
      margin-bottom: 12px;
      color: #1f2937;
    }
    blockquote {
      border-left: 4px solid #a855f7;
      padding-left: 24px;
      margin: 32px 0;
      color: #374151;
      font-style: italic;
      font-size: 1.125rem;
      line-height: 1.75;
    }
    img {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
      margin: 2rem 0;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 2rem 0;
      font-size: 1rem;
    }
    th, td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid #e5e7eb;
    }
    th {
      background: #f9fafb;
      font-weight: 600;
      color: #374151;
    }
    tr:hover {
      background: #f9fafb;
    }
    hr {
      border: none;
      border-top: 2px solid #e5e7eb;
      margin: 3rem 0;
    }
    .content {
      font-size: 1.125rem;
      line-height: 1.75;
      color: #1f2937;
    }
    .promotional-section {
      margin-top: 48px;
      padding-top: 32px;
      border-top: 1px solid #e5e7eb;
    }
    .promotional-section p {
      color: #1f2937;
      font-size: 1.125rem;
      line-height: 1.75;
      margin-bottom: 12px;
    }
    .profile-section {
      display: flex;
      flex-direction: column;
      gap: 24px;
      padding-bottom: 32px;
      border-bottom: 1px solid #e5e7eb;
      margin-top: 32px;
    }
    @media (min-width: 640px) {
      .profile-section {
        flex-direction: row;
      }
    }
    .profile-image {
      flex-shrink: 0;
      width: 128px;
      height: 128px;
      border-radius: 8px;
      object-fit: cover;
      border: 1px solid #e5e7eb;
    }
    .profile-content {
      flex: 1;
    }
    .profile-placeholder-arvind {
      display: none;
      width: 128px;
      height: 128px;
      border-radius: 8px;
      background: #f3e8ff;
      border: 1px solid #e5e7eb;
      align-items: center;
      justify-content: center;
      color: #9333ea;
      font-weight: 700;
      font-size: 2rem;
      flex-shrink: 0;
    }
    .profile-placeholder-arvind.show {
      display: flex;
    }
    .profile-name {
      font-size: 1.5rem;
      font-weight: 700;
      color: #581c87;
      margin-bottom: 8px;
    }
    .profile-bio {
      color: #1f2937;
      font-size: 1rem;
      line-height: 1.75;
      margin-bottom: 16px;
    }
    .profile-bio p {
      margin-bottom: 16px;
      font-size: 1rem;
    }
    .linkedin-link {
      display: inline-flex;
      align-items: center;
      color: #9333ea;
      text-decoration: none;
      transition: color 0.2s;
    }
    .linkedin-link:hover {
      color: #7c3aed;
    }
    footer {
      margin-top: 64px;
      padding-top: 32px;
      border-top: 1px solid #e5e7eb;
      color: #6b7280;
      font-size: 0.95rem;
      text-align: center;
    }
    footer a {
      color: #9333ea;
      font-weight: 600;
    }
    .sidebar {
      display: none;
    }
    @media (min-width: 1024px) {
      .sidebar {
        display: block;
      }
    }
    .sidebar-content {
      display: flex;
      flex-direction: column;
      gap: 24px;
      position: sticky;
      top: 96px;
    }
    .sidebar-card {
      background: #faf5ff;
      border-radius: 12px;
      padding: 24px;
      border: 1px solid #e9d5ff;
    }
    .sidebar-card h3 {
      font-size: 1.125rem;
      font-weight: 700;
      color: #581c87;
      margin-bottom: 16px;
      margin-top: 0;
    }
    .signup-form {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .signup-form input {
      width: 100%;
      padding: 12px 16px;
      border-radius: 8px;
      border: 1px solid #d1d5db;
      font-size: 1rem;
    }
    .signup-form input:focus {
      outline: none;
      border-color: #9333ea;
      box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.1);
    }
    .signup-form button {
      width: 100%;
      padding: 12px;
      background: linear-gradient(to right, #6b21a8, #581c87);
      color: white;
      font-weight: 600;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
    }
    .signup-form button:hover {
      background: linear-gradient(to right, #581c87, #4c1d95);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    .related-content-title {
      font-size: 0.875rem;
      font-weight: 700;
      color: #111827;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 16px;
      margin-top: 0;
    }
    .related-posts-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .related-posts-list li {
      margin: 0;
    }
    .related-post-link {
      color: #2563eb;
      text-decoration: underline;
      font-size: 0.875rem;
      line-height: 1.5;
      display: block;
      transition: color 0.2s;
    }
    .related-post-link:hover {
      color: #1e40af;
    }
    .view-more-link {
      display: flex;
      align-items: center;
      gap: 4px;
      margin-top: 16px;
      color: #9333ea;
      font-size: 0.875rem;
      font-weight: 500;
      text-decoration: none;
      transition: color 0.2s;
    }
    .view-more-link:hover {
      color: #7c3aed;
    }
    @media (max-width: 768px) {
      .main-container {
        padding: 80px 16px 32px;
      }
      h1 {
        font-size: 2rem;
      }
      h2 {
        font-size: 1.75rem;
      }
      h3 {
        font-size: 1.25rem;
      }
      p, ul, ol {
        font-size: 1rem;
      }
      .social-sidebar {
        display: none;
      }
      .main-content {
        flex-direction: column;
      }
    }
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      width: 100%;
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(229, 231, 235, 0.8);
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      z-index: 50;
    }
    .navbar-container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 16px;
    }
    @media (min-width: 640px) {
      .navbar-container {
        padding: 0 24px;
      }
    }
    @media (min-width: 1024px) {
      .navbar-container {
        padding: 0 32px;
      }
    }
    .navbar-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 64px;
    }
    .navbar-logo {
      display: flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
      color: inherit;
      padding: 6px 8px;
      border-radius: 8px;
      transition: background 0.2s;
    }
    .navbar-logo:hover {
      background: #f9fafb;
    }
    .navbar-logo-icon {
      width: auto;
      height: 32px;
      max-height: 32px;
      object-fit: contain;
    }
    .navbar-logo-text {
      font-size: 1.25rem;
      font-weight: 700;
      background: linear-gradient(to right, #6b21a8, #7c3aed);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .navbar-links {
      display: none;
      align-items: center;
      gap: 4px;
    }
    @media (min-width: 1024px) {
      .navbar-links {
        display: flex;
      }
    }
    .navbar-link {
      padding: 8px 16px;
      font-size: 0.875rem;
      font-weight: 500;
      color: #7c3aed;
      text-decoration: none;
      border-radius: 8px;
      transition: all 0.2s;
    }
    .navbar-link:hover {
      color: #581c87;
      background: #f9fafb;
    }
    .navbar-link.active {
      color: #7c3aed;
      background: #faf5ff;
    }
    .navbar-actions {
      display: none;
      align-items: center;
      gap: 10px;
      margin-left: 16px;
      padding-left: 16px;
      border-left: 1px solid #e5e7eb;
    }
    @media (min-width: 1024px) {
      .navbar-actions {
        display: flex;
      }
    }
    .navbar-button {
      padding: 8px 16px;
      font-size: 0.875rem;
      font-weight: 500;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .navbar-button-primary {
      background: linear-gradient(to right, #6b21a8, #581c87);
      color: white;
      font-weight: 600;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    }
    .navbar-button-primary:hover {
      background: linear-gradient(to right, #581c87, #4c1d95);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    .navbar-button-secondary {
      color: #7c3aed;
      background: transparent;
    }
    .navbar-button-secondary:hover {
      color: #581c87;
      background: #f9fafb;
    }
    .navbar-button-playground {
      background: #7c3aed;
      color: white;
      font-weight: 600;
    }
    .navbar-button-playground:hover {
      background: #6b21a8;
    }
    .mobile-menu-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border: none;
      background: transparent;
      cursor: pointer;
      color: #374151;
    }
    @media (min-width: 1024px) {
      .mobile-menu-button {
        display: none;
      }
    }
  </style>
</head>
<body>
  <!-- Navbar -->
  <nav class="navbar">
    <div class="navbar-container">
      <div class="navbar-content">
        <!-- Logo -->
        <a href="/" class="navbar-logo">
          <img src="/logos/alertmend-logo.svg" alt="AlertMend AI" class="navbar-logo-icon" onerror="this.style.display='none'; this.nextElementSibling.style.display='inline'; this.parentElement.querySelector('.navbar-logo-text').style.display='inline';" />
          <svg class="navbar-logo-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="display: none;">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span class="navbar-logo-text" style="display: none;">AlertMend AI</span>
        </a>

        <!-- Desktop Navigation -->
        <div class="navbar-links">
          <a href="/#how-it-works" class="navbar-link">How It Works</a>
          <a href="/#solutions" class="navbar-link">Solutions</a>
          <a href="/#benefits" class="navbar-link">Benefits</a>
          <a href="/case-studies" class="navbar-link">Case Studies</a>
          <a href="/blog" class="navbar-link active">Blog</a>
          <a href="/pricing" class="navbar-link">Pricing</a>
        </div>

        <!-- Desktop Actions -->
        <div class="navbar-actions">
          <a href="https://demo.alertmend.io/playground" target="_blank" rel="noopener noreferrer" class="navbar-button navbar-button-playground">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Playground
          </a>
          <a href="https://demo.alertmend.io/signup" target="_blank" rel="noopener noreferrer" class="navbar-button navbar-button-secondary">Register</a>
          <a href="https://calendly.com/hello-alertmend/30min" target="_blank" rel="noopener noreferrer" class="navbar-button navbar-button-primary">Book a Demo</a>
        </div>

        <!-- Mobile Menu Button -->
        <button class="mobile-menu-button" aria-label="Toggle menu">
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>
  </nav>

  <div class="main-container">
    <div class="content-wrapper">
      <!-- Main Content Area (70%) -->
      <div class="main-content">
        <!-- Social Share Icons (Left Sidebar) -->
        <div class="social-sidebar">
          <a href="#" class="social-icon" aria-label="Share on Facebook">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </a>
          <a href="#" class="social-icon" aria-label="Share on Twitter">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
          </a>
          <a href="#" class="social-icon" aria-label="Share on LinkedIn">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </a>
          <a href="#" class="social-icon" aria-label="Copy link">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M8.465 11.293c1.133-1.133 3.109-1.133 4.242 0l.707.707 1.414-1.414-.707-.707c-1.498-1.498-3.94-1.498-5.439 0l-.707.707 1.414 1.414.707-.707zm-2.829 2.829l.707.707c1.498 1.498 3.94 1.498 5.439 0l.707-.707-1.414-1.414-.707.707c-1.133 1.133-3.109 1.133-4.242 0l-.707-.707-1.414 1.414zm11.314-8.485l-6.364 6.364c-.39.39-1.023.39-1.414 0s-.39-1.023 0-1.414l6.364-6.364c.39-.39 1.023-.39 1.414 0s.39 1.023 0 1.414z"/></svg>
          </a>
        </div>

        <!-- Article Content -->
        <div class="article-content">
          <article>
            <header>
              <h1>${metadata.title || slug}</h1>
              
              <!-- Author Info -->
              <div class="author-info">
                <div class="author-avatar">
                  ${(metadata.author || 'AlertMend Team').charAt(0)}
                </div>
                <div class="author-details">
                  <div class="author-name">${metadata.author || 'AlertMend Team'}</div>
                  <div class="author-meta">${calculateReadTime(content)} • ${formatDate(metadata.date || '')}</div>
                </div>
              </div>

              <!-- Category Tag -->
              <div class="category-tag">${metadata.category || 'Blog'}</div>
            </header>

            <!-- Content -->
            <div class="content">
              ${htmlContent}
            </div>

            <!-- Promotional Section -->
            <div class="promotional-section">
              <p>Ready to eliminate manual firefighting and achieve autonomous infrastructure operations?</p>
              <p>See how AlertMend AI can help you reduce costs by 50%, achieve zero downtime, and automate incident remediation across Kubernetes, VMs, and ECS. <a href="https://calendly.com/hello-alertmend/30min" target="_blank" rel="noopener noreferrer">Book a demo.</a></p>
            </div>

            <!-- Horizontal Separator -->
            <hr />

            <!-- Arvind Rajpurohit Profile Section -->
            <div class="profile-section">
              <img src="/logos/arvind.jpeg" alt="Arvind Rajpurohit" class="profile-image" onerror="this.style.display='none'; const placeholder = this.nextElementSibling; if (placeholder) placeholder.classList.add('show');" />
              <div class="profile-placeholder-arvind">AR</div>
              <div class="profile-content">
                <h3 class="profile-name">Arvind Rajpurohit</h3>
                <p class="profile-title" style="color: #9333ea; font-weight: 600; margin-bottom: 1rem; font-size: 1rem;">Co-Founder & CEO</p>
                <div class="profile-bio">
                  <p>Arvind is a Kubestronaut and Kubernetes expert with 15+ years of experience in infrastructure automation. Previously DevOps Team Lead at Roambee and Customer Success Engineer at Shoreline.io (acquired by NVIDIA), he's helped hundreds of teams achieve 99.97% uptime, reduce costs by 50%, and eliminate 90% of manual operations work.</p>
                  <p>As CEO of AlertMend AI, Arvind is building the future of autonomous infrastructure management—where AI doesn't just monitor systems, but understands, predicts, and automatically resolves issues while continuously learning and improving.</p>
                </div>
                <a href="https://www.linkedin.com/in/arvind-rajpurohit-4a332523/" target="_blank" rel="noopener noreferrer" class="linkedin-link">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
              </div>
            </div>
          </article>
        </div>
      </div>

      <!-- Right Sidebar (30%) -->
      <aside class="sidebar">
        <div class="sidebar-content">
          <!-- Email Signup -->
          <div class="sidebar-card">
            <h3>Receive blog and product updates</h3>
            <form class="signup-form">
              <input type="email" placeholder="Email*" required />
              <button type="submit">SIGN UP</button>
            </form>
          </div>

          <!-- Related Content -->
          ${relatedPosts.length > 0 ? `
          <div class="sidebar-card">
            <h3 class="related-content-title">RELATED CONTENT</h3>
            <ul class="related-posts-list">
              ${relatedPosts.map(post => `
                <li>
                  <a href="/blog/${post.slug}" class="related-post-link">${post.title}</a>
                </li>
              `).join('')}
            </ul>
            <a href="/blog" class="view-more-link">
              View All Posts
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
          ` : ''}

          <!-- Additional Internal Links -->
          <div class="sidebar-card">
            <h3 class="related-content-title">EXPLORE ALERTMEND</h3>
            <ul class="related-posts-list">
              <li><a href="/" class="related-post-link">Home</a></li>
              <li><a href="/auto-remediation" class="related-post-link">Automated Incident Remediation</a></li>
              <li><a href="/kubernetes-management" class="related-post-link">Kubernetes Management</a></li>
              <li><a href="/on-call-management" class="related-post-link">On-Call Management</a></li>
              <li><a href="/kubernetes-cost-optimization" class="related-post-link">Cost Optimization</a></li>
              <li><a href="/case-studies" class="related-post-link">Case Studies</a></li>
              <li><a href="/pricing" class="related-post-link">Pricing</a></li>
              <li><a href="/blog" class="related-post-link">All Blog Posts</a></li>
            </ul>
          </div>
        </div>
      </aside>
    </div>
  </div>
</body>
</html>`
    
    // Create a temporary full HTML to extract the body
    // Use a placeholder canonical URL for now (will be overridden per version)
    const tempCanonical = `https://www.alertmend.io/blog/${slug}`
    const tempFullHTML = createHTMLHead(tempCanonical) + `
  
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.7;
      color: #1f2937;
      background: #ffffff;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    .main-container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 96px 16px 32px;
      margin-top: 64px;
    }
    @media (min-width: 640px) {
      .main-container {
        padding: 96px 24px 32px;
      }
    }
    @media (min-width: 1024px) {
      .main-container {
        padding: 96px 32px 48px;
      }
    }
    .content-wrapper {
      display: grid;
      grid-template-columns: 1fr;
      gap: 32px;
      margin-top: 32px;
    }
    @media (min-width: 1024px) {
      .content-wrapper {
        grid-template-columns: 8fr 4fr;
        gap: 32px;
      }
    }
    .main-content {
      display: flex;
      gap: 24px;
    }
    .social-sidebar {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding-top: 8px;
    }
    .social-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #f3f4f6;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
      text-decoration: none;
    }
    .social-icon:hover {
      background: #f3e8ff;
    }
    .article-content {
      flex: 1;
    }
    article {
      background: #ffffff;
    }
    header {
      margin-bottom: 32px;
    }
    h1 {
      color: #581c87;
      font-size: 2.25rem;
      font-weight: 700;
      line-height: 1.2;
      margin-bottom: 24px;
    }
    @media (min-width: 768px) {
      h1 {
        font-size: 3rem;
      }
    }
    @media (min-width: 1024px) {
      h1 {
        font-size: 3.75rem;
      }
    }
    h2 {
      color: #581c87;
      font-size: 1.875rem;
      font-weight: 700;
      margin-top: 40px;
      margin-bottom: 20px;
      line-height: 1.2;
    }
    @media (min-width: 768px) {
      h2 {
        font-size: 2.25rem;
      }
    }
    h3 {
      color: #581c87;
      font-size: 1.5rem;
      font-weight: 700;
      margin-top: 32px;
      margin-bottom: 16px;
      line-height: 1.2;
    }
    @media (min-width: 768px) {
      h3 {
        font-size: 1.875rem;
      }
    }
    h4, h5, h6 {
      color: #581c87;
      font-weight: 600;
      margin-top: 24px;
      margin-bottom: 12px;
    }
    p {
      margin-bottom: 24px;
      font-size: 1.125rem;
      line-height: 1.75;
      color: #1f2937;
    }
    .author-info {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 16px;
    }
    .author-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #e9d5ff;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #9333ea;
      font-weight: 600;
      font-size: 1rem;
    }
    .author-details {
      display: flex;
      flex-direction: column;
    }
    .author-name {
      font-weight: 600;
      color: #111827;
      font-size: 1rem;
    }
    .author-meta {
      font-size: 0.875rem;
      color: #6b7280;
    }
    .category-tag {
      display: inline-block;
      padding: 4px 12px;
      background: #dbeafe;
      color: #1e40af;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 600;
      margin-top: 16px;
    }
    code {
      background: #f3f4f6;
      color: #9333ea;
      padding: 0.2em 0.4em;
      border-radius: 4px;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
      font-size: 0.9em;
      border: 1px solid #e5e7eb;
    }
    pre {
      background: #1f2937;
      color: #f9fafb;
      padding: 1.5rem;
      border-radius: 8px;
      overflow-x: auto;
      margin: 1.5rem 0;
      border: 1px solid #374151;
    }
    pre code {
      background: none;
      color: #f9fafb;
      padding: 0;
      border: none;
      font-size: 0.875rem;
    }
    a {
      color: #9333ea;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s;
    }
    a:hover {
      color: #7c3aed;
      text-decoration: underline;
    }
    ul, ol {
      margin-bottom: 24px;
      padding-left: 24px;
      font-size: 1.125rem;
      line-height: 1.75;
    }
    li {
      margin-bottom: 12px;
      color: #1f2937;
    }
    blockquote {
      border-left: 4px solid #a855f7;
      padding-left: 24px;
      margin: 32px 0;
      color: #374151;
      font-style: italic;
      font-size: 1.125rem;
      line-height: 1.75;
    }
    img {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
      margin: 2rem 0;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 2rem 0;
      font-size: 1rem;
    }
    th, td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid #e5e7eb;
    }
    th {
      background: #f9fafb;
      font-weight: 600;
      color: #374151;
    }
    tr:hover {
      background: #f9fafb;
    }
    hr {
      border: none;
      border-top: 2px solid #e5e7eb;
      margin: 3rem 0;
    }
    .content {
      font-size: 1.125rem;
      line-height: 1.75;
      color: #1f2937;
    }
    .promotional-section {
      margin-top: 48px;
      padding-top: 32px;
      border-top: 1px solid #e5e7eb;
    }
    .promotional-section p {
      color: #1f2937;
      font-size: 1.125rem;
      line-height: 1.75;
      margin-bottom: 12px;
    }
    .profile-section {
      display: flex;
      flex-direction: column;
      gap: 24px;
      padding-bottom: 32px;
      border-bottom: 1px solid #e5e7eb;
      margin-top: 32px;
    }
    @media (min-width: 640px) {
      .profile-section {
        flex-direction: row;
      }
    }
    .profile-image {
      flex-shrink: 0;
      width: 128px;
      height: 128px;
      border-radius: 8px;
      object-fit: cover;
      border: 1px solid #e5e7eb;
    }
    .profile-content {
      flex: 1;
    }
    .profile-placeholder-arvind {
      display: none;
      width: 128px;
      height: 128px;
      border-radius: 8px;
      background: #f3e8ff;
      border: 1px solid #e5e7eb;
      align-items: center;
      justify-content: center;
      color: #9333ea;
      font-weight: 700;
      font-size: 2rem;
      flex-shrink: 0;
    }
    .profile-placeholder-arvind.show {
      display: flex;
    }
    .profile-name {
      font-size: 1.5rem;
      font-weight: 700;
      color: #581c87;
      margin-bottom: 8px;
    }
    .profile-bio {
      color: #1f2937;
      font-size: 1rem;
      line-height: 1.75;
      margin-bottom: 16px;
    }
    .profile-bio p {
      margin-bottom: 16px;
      font-size: 1rem;
    }
    .linkedin-link {
      display: inline-flex;
      align-items: center;
      color: #9333ea;
      text-decoration: none;
      transition: color 0.2s;
    }
    .linkedin-link:hover {
      color: #7c3aed;
    }
    footer {
      margin-top: 64px;
      padding-top: 32px;
      border-top: 1px solid #e5e7eb;
      color: #6b7280;
      font-size: 0.95rem;
      text-align: center;
    }
    footer a {
      color: #9333ea;
      font-weight: 600;
    }
    .sidebar {
      display: none;
    }
    @media (min-width: 1024px) {
      .sidebar {
        display: block;
      }
    }
    .sidebar-content {
      display: flex;
      flex-direction: column;
      gap: 24px;
      position: sticky;
      top: 96px;
    }
    .sidebar-card {
      background: #faf5ff;
      border-radius: 12px;
      padding: 24px;
      border: 1px solid #e9d5ff;
    }
    .sidebar-card h3 {
      font-size: 1.125rem;
      font-weight: 700;
      color: #581c87;
      margin-bottom: 16px;
      margin-top: 0;
    }
    .signup-form {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .signup-form input {
      width: 100%;
      padding: 12px 16px;
      border-radius: 8px;
      border: 1px solid #d1d5db;
      font-size: 1rem;
    }
    .signup-form input:focus {
      outline: none;
      border-color: #9333ea;
      box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.1);
    }
    .signup-form button {
      width: 100%;
      padding: 12px;
      background: linear-gradient(to right, #6b21a8, #581c87);
      color: white;
      font-weight: 600;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
    }
    .signup-form button:hover {
      background: linear-gradient(to right, #581c87, #4c1d95);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    .related-content-title {
      font-size: 0.875rem;
      font-weight: 700;
      color: #111827;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 16px;
      margin-top: 0;
    }
    .related-posts-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .related-posts-list li {
      margin: 0;
    }
    .related-post-link {
      color: #2563eb;
      text-decoration: underline;
      font-size: 0.875rem;
      line-height: 1.5;
      display: block;
      transition: color 0.2s;
    }
    .related-post-link:hover {
      color: #1e40af;
    }
    .view-more-link {
      display: flex;
      align-items: center;
      gap: 4px;
      margin-top: 16px;
      color: #9333ea;
      font-size: 0.875rem;
      font-weight: 500;
      text-decoration: none;
      transition: color 0.2s;
    }
    .view-more-link:hover {
      color: #7c3aed;
    }
    @media (max-width: 768px) {
      .main-container {
        padding: 80px 16px 32px;
      }
      h1 {
        font-size: 2rem;
      }
      h2 {
        font-size: 1.75rem;
      }
      h3 {
        font-size: 1.25rem;
      }
      p, ul, ol {
        font-size: 1rem;
      }
      .social-sidebar {
        display: none;
      }
      .main-content {
        flex-direction: column;
      }
    }
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      width: 100%;
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(229, 231, 235, 0.8);
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      z-index: 50;
    }
    .navbar-container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 16px;
    }
    @media (min-width: 640px) {
      .navbar-container {
        padding: 0 24px;
      }
    }
    @media (min-width: 1024px) {
      .navbar-container {
        padding: 0 32px;
      }
    }
    .navbar-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 64px;
    }
    .navbar-logo {
      display: flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
      color: inherit;
      padding: 6px 8px;
      border-radius: 8px;
      transition: background 0.2s;
    }
    .navbar-logo:hover {
      background: #f9fafb;
    }
    .navbar-logo-icon {
      width: auto;
      height: 32px;
      max-height: 32px;
      object-fit: contain;
    }
    .navbar-logo-text {
      font-size: 1.25rem;
      font-weight: 700;
      background: linear-gradient(to right, #6b21a8, #7c3aed);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .navbar-links {
      display: none;
      align-items: center;
      gap: 4px;
    }
    @media (min-width: 1024px) {
      .navbar-links {
        display: flex;
      }
    }
    .navbar-link {
      padding: 8px 16px;
      font-size: 0.875rem;
      font-weight: 500;
      color: #7c3aed;
      text-decoration: none;
      border-radius: 8px;
      transition: all 0.2s;
    }
    .navbar-link:hover {
      color: #581c87;
      background: #f9fafb;
    }
    .navbar-link.active {
      color: #7c3aed;
      background: #faf5ff;
    }
    .navbar-actions {
      display: none;
      align-items: center;
      gap: 10px;
      margin-left: 16px;
      padding-left: 16px;
      border-left: 1px solid #e5e7eb;
    }
    @media (min-width: 1024px) {
      .navbar-actions {
        display: flex;
      }
    }
    .navbar-button {
      padding: 8px 16px;
      font-size: 0.875rem;
      font-weight: 500;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .navbar-button-primary {
      background: linear-gradient(to right, #6b21a8, #581c87);
      color: white;
      font-weight: 600;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    }
    .navbar-button-primary:hover {
      background: linear-gradient(to right, #581c87, #4c1d95);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    .navbar-button-secondary {
      color: #7c3aed;
      background: transparent;
    }
    .navbar-button-secondary:hover {
      color: #581c87;
      background: #f9fafb;
    }
    .navbar-button-playground {
      background: #7c3aed;
      color: white;
      font-weight: 600;
    }
    .navbar-button-playground:hover {
      background: #6b21a8;
    }
    .mobile-menu-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border: none;
      background: transparent;
      cursor: pointer;
      color: #374151;
    }
    @media (min-width: 1024px) {
      .mobile-menu-button {
        display: none;
      }
    }
  </style>
</head>
<body>
  <!-- Navbar -->
  <nav class="navbar">
    <div class="navbar-container">
      <div class="navbar-content">
        <!-- Logo -->
        <a href="/" class="navbar-logo">
          <img src="/logos/alertmend-logo.svg" alt="AlertMend AI" class="navbar-logo-icon" onerror="this.style.display='none'; this.nextElementSibling.style.display='inline'; this.parentElement.querySelector('.navbar-logo-text').style.display='inline';" />
          <svg class="navbar-logo-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="display: none;">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span class="navbar-logo-text" style="display: none;">AlertMend AI</span>
        </a>

        <!-- Desktop Navigation -->
        <div class="navbar-links">
          <a href="/#how-it-works" class="navbar-link">How It Works</a>
          <a href="/#solutions" class="navbar-link">Solutions</a>
          <a href="/#benefits" class="navbar-link">Benefits</a>
          <a href="/case-studies" class="navbar-link">Case Studies</a>
          <a href="/blog" class="navbar-link active">Blog</a>
          <a href="/pricing" class="navbar-link">Pricing</a>
        </div>

        <!-- Desktop Actions -->
        <div class="navbar-actions">
          <a href="https://demo.alertmend.io/playground" target="_blank" rel="noopener noreferrer" class="navbar-button navbar-button-playground">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Playground
          </a>
          <a href="https://demo.alertmend.io/signup" target="_blank" rel="noopener noreferrer" class="navbar-button navbar-button-secondary">Register</a>
          <a href="https://calendly.com/hello-alertmend/30min" target="_blank" rel="noopener noreferrer" class="navbar-button navbar-button-primary">Book a Demo</a>
        </div>

        <!-- Mobile Menu Button -->
        <button class="mobile-menu-button" aria-label="Toggle menu">
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>
  </nav>

  <div class="main-container">
    <div class="content-wrapper">
      <!-- Main Content Area (70%) -->
      <div class="main-content">
        <!-- Social Share Icons (Left Sidebar) -->
        <div class="social-sidebar">
          <a href="#" class="social-icon" aria-label="Share on Facebook">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </a>
          <a href="#" class="social-icon" aria-label="Share on Twitter">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
          </a>
          <a href="#" class="social-icon" aria-label="Share on LinkedIn">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </a>
          <a href="#" class="social-icon" aria-label="Copy link">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M8.465 11.293c1.133-1.133 3.109-1.133 4.242 0l.707.707 1.414-1.414-.707-.707c-1.498-1.498-3.94-1.498-5.439 0l-.707.707 1.414 1.414.707-.707zm-2.829 2.829l.707.707c1.498 1.498 3.94 1.498 5.439 0l.707-.707-1.414-1.414-.707.707c-1.133 1.133-3.109 1.133-4.242 0l-.707-.707-1.414 1.414zm11.314-8.485l-6.364 6.364c-.39.39-1.023.39-1.414 0s-.39-1.023 0-1.414l6.364-6.364c.39-.39 1.023-.39 1.414 0s.39 1.023 0 1.414z"/></svg>
          </a>
        </div>

        <!-- Article Content -->
        <div class="article-content">
          <article>
            <header>
              <h1>${metadata.title || slug}</h1>
              
              <!-- Author Info -->
              <div class="author-info">
                <div class="author-avatar">
                  ${(metadata.author || 'AlertMend Team').charAt(0)}
                </div>
                <div class="author-details">
                  <div class="author-name">${metadata.author || 'AlertMend Team'}</div>
                  <div class="author-meta">${calculateReadTime(content)} • ${formatDate(metadata.date || '')}</div>
                </div>
              </div>

              <!-- Category Tag -->
              <div class="category-tag">${metadata.category || 'Blog'}</div>
            </header>

            <!-- Content -->
            <div class="content">
              ${htmlContent}
            </div>

            <!-- Promotional Section -->
            <div class="promotional-section">
              <p>Ready to eliminate manual firefighting and achieve autonomous infrastructure operations?</p>
              <p>See how AlertMend AI can help you reduce costs by 50%, achieve zero downtime, and automate incident remediation across Kubernetes, VMs, and ECS. <a href="https://calendly.com/hello-alertmend/30min" target="_blank" rel="noopener noreferrer">Book a demo.</a></p>
            </div>

            <!-- Horizontal Separator -->
            <hr />

            <!-- Arvind Rajpurohit Profile Section -->
            <div class="profile-section">
              <img src="/logos/arvind.jpeg" alt="Arvind Rajpurohit" class="profile-image" onerror="this.style.display='none'; const placeholder = this.nextElementSibling; if (placeholder) placeholder.classList.add('show');" />
              <div class="profile-placeholder-arvind">AR</div>
              <div class="profile-content">
                <h3 class="profile-name">Arvind Rajpurohit</h3>
                <p class="profile-title" style="color: #9333ea; font-weight: 600; margin-bottom: 1rem; font-size: 1rem;">Co-Founder & CEO</p>
                <div class="profile-bio">
                  <p>Arvind is a Kubestronaut and Kubernetes expert with 15+ years of experience in infrastructure automation. Previously DevOps Team Lead at Roambee and Customer Success Engineer at Shoreline.io (acquired by NVIDIA), he's helped hundreds of teams achieve 99.97% uptime, reduce costs by 50%, and eliminate 90% of manual operations work.</p>
                  <p>As CEO of AlertMend AI, Arvind is building the future of autonomous infrastructure management—where AI doesn't just monitor systems, but understands, predicts, and automatically resolves issues while continuously learning and improving.</p>
                </div>
                <a href="https://www.linkedin.com/in/arvind-rajpurohit-4a332523/" target="_blank" rel="noopener noreferrer" class="linkedin-link">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
              </div>
            </div>
          </article>
        </div>
      </div>

      <!-- Right Sidebar (30%) -->
      <aside class="sidebar">
        <div class="sidebar-content">
          <!-- Email Signup -->
          <div class="sidebar-card">
            <h3>Receive blog and product updates</h3>
            <form class="signup-form">
              <input type="email" placeholder="Email*" required />
              <button type="submit">SIGN UP</button>
            </form>
          </div>

          <!-- Related Content -->
          ${relatedPosts.length > 0 ? `
          <div class="sidebar-card">
            <h3 class="related-content-title">RELATED CONTENT</h3>
            <ul class="related-posts-list">
              ${relatedPosts.map(post => `
                <li>
                  <a href="/blog/${post.slug}" class="related-post-link">${post.title}</a>
                </li>
              `).join('')}
            </ul>
            <a href="/blog" class="view-more-link">
              View All Posts
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
          ` : ''}

          <!-- Additional Internal Links -->
          <div class="sidebar-card">
            <h3 class="related-content-title">EXPLORE ALERTMEND</h3>
            <ul class="related-posts-list">
              <li><a href="/" class="related-post-link">Home</a></li>
              <li><a href="/auto-remediation" class="related-post-link">Automated Incident Remediation</a></li>
              <li><a href="/kubernetes-management" class="related-post-link">Kubernetes Management</a></li>
              <li><a href="/on-call-management" class="related-post-link">On-Call Management</a></li>
              <li><a href="/kubernetes-cost-optimization" class="related-post-link">Cost Optimization</a></li>
              <li><a href="/case-studies" class="related-post-link">Case Studies</a></li>
              <li><a href="/pricing" class="related-post-link">Pricing</a></li>
              <li><a href="/blog" class="related-post-link">All Blog Posts</a></li>
            </ul>
          </div>
        </div>
      </aside>
    </div>
  </div>
</body>
</html>`
    
    // Extract body from temp HTML
    const bodyStart = tempFullHTML.indexOf('<body>')
    const htmlBody = tempFullHTML.substring(bodyStart)
    
    // Write both versions: with .html extension and without (directory structure)
    // Version 1: With .html extension (e.g., /blogs/post-name.html)
    // Canonical URL for .html version points to /blogs/
    const canonicalUrlHtml = `https://www.alertmend.io/blogs/${slug}.html`
    const fullHTMLHtml = createHTMLHead(canonicalUrlHtml) + htmlBody
    fs.writeFileSync(htmlPath, fullHTMLHtml, 'utf-8')
    console.log(`✓ Converted ${file} → blogs/${slug}.html (canonical: ${canonicalUrlHtml})`)
    
    // Version 2: Without .html extension (e.g., /blog/post-name/)
    // Canonical URL for non-html version points to /blog/
    const canonicalUrlClean = `https://www.alertmend.io/blog/${slug}`
    const fullHTMLClean = createHTMLHead(canonicalUrlClean) + htmlBody
    // Create directory structure for clean URL
    if (!fs.existsSync(path.dirname(dirPath))) {
      fs.mkdirSync(path.dirname(dirPath), { recursive: true })
    }
    fs.writeFileSync(dirPath, fullHTMLClean, 'utf-8')
    console.log(`✓ Converted ${file} → blog/${slug}/index.html (canonical: ${canonicalUrlClean})`)
  } catch (error) {
    console.error(`✗ Error converting ${file}:`, error.message)
  }
})

console.log(`\n✓ Successfully converted ${markdownFiles.length} blog posts to HTML`)

// Generate blog listing page (index.html for /blog route)
console.log('\nGenerating blog listing page...')

// Collect all blog posts with metadata
const allBlogPosts = []
markdownFiles.forEach(file => {
  const markdownPath = path.join(blogDir, file)
  const slug = file.replace('.md', '')
  
  try {
    const markdown = fs.readFileSync(markdownPath, 'utf-8')
    const frontmatterMatch = markdown.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
    if (!frontmatterMatch) return
    
    const frontmatter = frontmatterMatch[1]
    const metadata = {}
    frontmatter.split('\n').forEach((line) => {
      const match = line.match(/^(\w+):\s*["']?([^"']+)["']?$/)
      if (match) {
        metadata[match[1]] = match[2]
      }
    })
    
    // Parse tags if present
    const tagsMatch = frontmatter.match(/^tags:\s*\[(.*?)\]/m)
    let tags = []
    if (tagsMatch) {
      tags = tagsMatch[1].split(',').map(t => t.trim().replace(/['"]/g, ''))
    }
    
    allBlogPosts.push({
      slug,
      title: metadata.title || slug,
      excerpt: metadata.excerpt || '',
      date: metadata.date || '',
      category: metadata.category || 'Blog',
      tags: tags
    })
  } catch (error) {
    console.warn(`Warning: Could not read metadata from ${file}`)
  }
})

// Sort posts by date (newest first)
allBlogPosts.sort((a, b) => {
  const dateA = new Date(a.date).getTime()
  const dateB = new Date(b.date).getTime()
  return dateB - dateA
})

// Generate blog cards HTML
const blogCardsHTML = allBlogPosts.map(post => {
  const filteredTags = post.tags ? post.tags.filter(tag => tag.toLowerCase() !== post.category.toLowerCase()) : []
  const tagsHTML = filteredTags.length > 0 
    ? `<div class="flex items-center gap-1.5 flex-wrap">
        ${filteredTags.map(tag => `<span class="inline-flex items-center px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium border border-gray-200">${tag}</span>`).join('')}
      </div>`
    : ''
  
  return `
    <article class="group bg-white rounded-xl p-8 border border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-full" onclick="window.location.href='/blog/${post.slug}'">
      <div class="flex items-center gap-2 flex-wrap mb-4">
        <div class="inline-block px-3 py-1.5 bg-purple-50 text-purple-700 rounded-md text-xs font-semibold">
          ${post.category}
        </div>
        ${tagsHTML}
      </div>
      <h2 class="text-xl md:text-2xl font-bold text-gray-900 mb-4 leading-tight group-hover:text-purple-700 transition-colors">${post.title}</h2>
      <p class="text-gray-600 mb-6 leading-relaxed line-clamp-3 flex-grow text-base">${post.excerpt}</p>
      <div class="flex items-center justify-between pt-4 border-t border-gray-100">
        <div class="flex items-center gap-2 text-gray-500 text-sm">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>${formatDate(post.date)}</span>
        </div>
        <div class="text-purple-600 group-hover:text-purple-800 font-semibold text-sm flex items-center gap-2 transition-colors">
          Read More
          <svg class="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </article>`
}).join('')

// Generate full HTML for blog listing page
const blogListingHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AIOps & Kubernetes: AlertMend AI's Insights & Best Practices</title>
  <meta name="description" content="AlertMend AI blog: Get expert insights on AIOps and Kubernetes. Learn best practices for autonomous infrastructure management.">
  <meta name="keywords" content="AIOps blog, Kubernetes best practices, infrastructure automation, DevOps insights, SRE articles, cloud-native operations">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <link rel="canonical" href="https://www.alertmend.io/blog">
  <link rel="icon" type="image/svg+xml" href="/logos/alertmend-logo.svg">
  
  <!-- Tailwind CSS - using CDN for static HTML -->
  <script src="https://cdn.tailwindcss.com"></script>
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.tailwindcss.com https://fonts.googleapis.com https://calendly.com https://www.googletagmanager.com https://dashboard.searchatlas.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://calendly.com https://demo.alertmend.io https://api-demo.alertmend.io https://www.google-analytics.com https://www.googletagmanager.com https://formspree.io https://dashboard.searchatlas.com; frame-src https://calendly.com; object-src 'none'; base-uri 'self'; form-action 'self' https://formspree.io; frame-ancestors 'none'; upgrade-insecure-requests;">
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            purple: {
              50: '#faf5ff',
              100: '#f3e8ff',
              200: '#e9d5ff',
              300: '#d8b4fe',
              400: '#c084fc',
              500: '#a855f7',
              600: '#9333ea',
              700: '#7e22ce',
              800: '#6b21a8',
              900: '#581c87',
              950: '#3b0764',
            }
          }
        }
      }
    }
  </script>
  <style>
    .line-clamp-3 {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  </style>
  
  <!-- SearchAtlas Dynamic Optimization -->
  <script nowprocket nitro-exclude type="text/javascript" id="sa-dynamic-optimization" data-uuid="457086dd-8bfb-46dd-a38d-2f4a6efd0e7e" src="data:text/javascript;base64,dmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoInNjcmlwdCIpO3NjcmlwdC5zZXRBdHRyaWJ1dGUoIm5vd3Byb2NrZXQiLCAiIik7c2NyaXB0LnNldEF0dHJpYnV0ZSgibml0cm8tZXhjbHVkZSIsICIiKTtzY3JpcHQuc3JjID0gImh0dHBzOi8vZGFzaGJvYXJkLnNlYXJjaGF0bGFzLmNvbS9zY3JpcHRzL2R5bmFtaWNfb3B0aW1pemF0aW9uLmpzIjtzY3JpcHQuZGF0YXNldC51dWlkID0gIjQ1NzA4NmRkLThiZmItNDZkZC1hMzhkLTJmNGE2ZWZkMGU3ZSI7c2NyaXB0LmlkID0gInNhLWR5bmFtaWMtb3B0aW1pemF0aW9uLWxvYWRlciI7ZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpOw=="></script>
</head>
<body class="min-h-screen bg-white">
  <section class="pt-24 pb-20 md:pb-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-br from-purple-50/30 via-white to-blue-50/30">
    <div class="max-w-7xl mx-auto">
      <div class="mb-8">
        <nav class="text-sm text-purple-600">
          <a href="/" class="hover:text-purple-800">Home</a>
          <span class="mx-2">/</span>
          <span class="text-gray-600">Blog</span>
        </nav>
      </div>
      <div class="text-center mb-12 md:mb-16">
        <div class="inline-block px-5 py-2 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 rounded-full text-sm font-bold mb-8 shadow-md border border-purple-200/50">
          Blog
        </div>
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-purple-950 mb-6 leading-tight">
          Latest Insights & Updates
        </h1>
        <p class="text-xl md:text-2xl text-purple-700 max-w-3xl mx-auto leading-relaxed mb-12">
          Stay updated with the latest trends, best practices, and insights in AIOps and infrastructure management.
        </p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        ${blogCardsHTML}
      </div>
    </div>
  </section>
</body>
</html>`

// Write blog listing page
const blogListingPath = path.join(outputDir, 'index.html')
fs.writeFileSync(blogListingPath, blogListingHTML, 'utf-8')
console.log(`✓ Generated blog listing page: blog/index.html`)

