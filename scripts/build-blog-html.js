import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { marked } from 'marked'
import { STATIC_BLOG_SLUGS as STATIC_BLOG_SLUG_LIST } from './static-blog-slugs.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Related-post candidates: the generated, indexable list (hidden and noindex
// posts are already excluded by generate-blog-list.js, which runs first).
const blogPosts = (() => {
  try {
    const list = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/utils/blogList.json'), 'utf8'))
    return list
      .filter((p) => p && p.slug && p.title)
      .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')))
      .map((p) => ({ slug: p.slug, title: p.title, category: p.category || 'Blog', date: p.date || '' }))
  } catch {
    return []
  }
})()

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

/** Slugs with hand-built static HTML in public/blog/{slug}/index.html (skip MD conversion). */
const STATIC_BLOG_SLUGS = new Set(STATIC_BLOG_SLUG_LIST)

function blogPostHref(slug) {
  return `/blog/${slug}`
}

// Ensure output directories exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
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

const escapeHtml = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')

const getAuthorInitials = (author = 'A') => {
  const initials = String(author)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
  return initials || 'A'
}

const renderAuthorAvatar = (metadata) => {
  const author = metadata.author || 'AlertMend Team'
  if (metadata.authorImage) {
    return `<img src="${escapeHtml(metadata.authorImage)}" alt="${escapeHtml(author)}" class="author-photo" loading="lazy" onerror="this.style.display='none'; const fallback = this.nextElementSibling; if (fallback) fallback.classList.add('show');" /><div class="author-avatar author-avatar-fallback">${escapeHtml(getAuthorInitials(author))}</div>`
  }
  return `<div class="author-avatar">${escapeHtml(getAuthorInitials(author))}</div>`
}

// Function to convert slug (lowercase-hyphens) to HTML filename format (Title-Case-With-Hyphens)
// Small words (in, of, the, a, an, etc.) remain lowercase except at the start
const convertSlugToHtmlFilename = (slug) => {
  const stopWords = new Set(['in', 'of', 'the', 'a', 'an', 'and', 'or', 'but', 'for', 'to', 'at', 'on', 'by', 'with', 'from'])
  return slug
    .split('-')
    .map((word, index) => {
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

// Read all markdown files
const markdownFiles = fs.readdirSync(blogDir).filter(file => file.endsWith('.md'))

console.log(`Found ${markdownFiles.length} markdown files to convert...`)

markdownFiles.forEach(file => {
  const markdownPath = path.join(blogDir, file)
  const slug = file.replace('.md', '')
  if (STATIC_BLOG_SLUGS.has(slug)) {
    console.log(`⏭ Skipping ${file} (static HTML blog)`)
    return
  }
  // Directory version (non-HTML) goes to /blog/ directory (keep lowercase/hyphens for React routing)
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
      // Handle keywords which may contain commas and quotes
      const keywordsMatch = line.match(/^keywords:\s*["'](.+)["']$/)
      if (keywordsMatch) {
        metadata.keywords = keywordsMatch[1]
        return
      }
      
      // Handle double-quoted values (like excerpt, title, etc.)
      const doubleQuotedMatch = line.match(/^(\w+):\s*"([^"]*)"$/)
      if (doubleQuotedMatch) {
        // Unescape quotes in the value
        let value = doubleQuotedMatch[2].replace(/\\"/g, '"').replace(/\\\\/g, '\\')
        metadata[doubleQuotedMatch[1]] = value
        return
      }
      
      // Handle single-quoted values
      const singleQuotedMatch = line.match(/^(\w+):\s*'([^']*)'$/)
      if (singleQuotedMatch) {
        metadata[singleQuotedMatch[1]] = singleQuotedMatch[2]
        return
      }
      
      // Handle unquoted values
      const match = line.match(/^(\w+):\s*(.+)$/)
      if (match) {
        metadata[match[1]] = match[2].trim()
      }
    })
    
    // Helper function to truncate H2 headings to 50-70 characters for SEO
    // Headings are for readers: keep them whole (was cutting to 70 chars + "...").
    // eslint-disable-next-line no-unused-vars
    const truncateH2Heading = (heading, minLength = 50, maxLength = 70) => heading
    // eslint-disable-next-line no-unused-vars
    const truncateH2HeadingLegacy = (heading, minLength = 50, maxLength = 70) => {
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
    
    // Wrap tables in a div for better styling and responsiveness
    htmlContent = htmlContent.replace(/<table>/g, '<div class="table-wrapper"><table>')
    htmlContent = htmlContent.replace(/<\/table>/g, '</table></div>')
    
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
    
    // Data posts get data-team calls to action and data-first related links.
    const DATA_RX = /data quality|data observability|data governance|data lineage|data freshness|data contract|data pipeline|bcbs|solvency|snowflake|power bi|dbt|monte carlo|warehouse|great expectations/i
    const isDataText = (t) => DATA_RX.test(t || '')
    const isDataPost = isDataText(`${metadata.title || ''} ${metadata.category || ''} ${metadata.tags || ''} ${slug}`)
    const sameAudience = (p) => isDataText(`${p.title} ${p.category} ${p.slug}`) === isDataPost

    // Related posts: same category first, then the same audience, excluding this post.
    const sameCategoryPosts = blogPosts
      .filter(p => p.category === metadata.category && p.slug !== slug && sameAudience(p))
      .slice(0, 4)
    const otherPosts = blogPosts
      .filter(p => p.slug !== slug && sameAudience(p) && !sameCategoryPosts.includes(p))
      .slice(0, 6)
    const relatedPosts = [...sameCategoryPosts, ...otherPosts].slice(0, 8)
    
    // Helper function to truncate blog title to 30-60 characters for SEO
    const truncateBlogTitle = (title, suffix = ' | AlertMend', minLength = 30, maxLength = 60) => {
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
      
      // Don't publish cut-off titles: Google shortens long titles itself.
      // Keep the full title and drop the brand suffix when it doesn't fit.
      void truncatedTitle
      return title
    }
    
    const shortenedTitle = truncateBlogTitle(metadata.title || slug)
    
    // Helper function to generate unique meta description
    const generateUniqueMetaDescription = (title, excerpt, content, category, maxLength = 160, minLength = 50) => {
      // Use conservative limit (150 chars) to leave room for HTML entity encoding (quotes become &quot;)
      const safeMaxLength = 150
      
      let description = excerpt || ''
      
      // Clean up excerpt - remove any escaped quotes and extra characters
      if (description) {
        description = description.replace(/\\"/g, '"').replace(/\\\\"/g, '"').trim()
      }
      
      // CRITICAL: If excerpt is valid (>= minLength and <= safeMaxLength), use it directly and return early
      // This prevents any content extraction or other logic from overriding a valid excerpt
      if (description && description.length >= minLength && description.length <= safeMaxLength) {
        // Just ensure it's properly formatted (no need to truncate if already within safeMaxLength)
        return description.trim()
      }
      
      // If excerpt is too long, truncate it intelligently
      if (description && description.length > safeMaxLength && description.length >= minLength) {
        let truncated = description.substring(0, safeMaxLength - 3)
        const lastSpace = truncated.lastIndexOf(' ')
        const lastPeriod = truncated.lastIndexOf('.')
        if (lastPeriod >= safeMaxLength * 0.6) {
          truncated = truncated.substring(0, lastPeriod + 1)
        } else if (lastSpace >= safeMaxLength * 0.7) {
          truncated = truncated.substring(0, lastSpace)
        }
        return truncated.trim() + '...'
      }
      
      // IMPORTANT: If excerpt is valid (>= minLength), store it and use it at the end
      const originalValidExcerpt = (description && description.length >= minLength) ? description : null
      
      // IMPORTANT: If excerpt is valid (>= minLength), use it and skip content generation
      const hasValidExcerpt = description && description.length >= minLength
      
      // If no excerpt or excerpt is too short, generate from content
      if (!hasValidExcerpt) {
        if (content) {
          const cleanContent = content
            .replace(/[#*`]/g, '')
            .replace(/\n+/g, ' ')
            .trim()
          
          // Take first sentence or first 200 chars, then find sentence boundary
          let text = cleanContent.substring(0, 200)
          const firstSentenceMatch = text.match(/^[^.!?]+[.!?]/)
          if (firstSentenceMatch && firstSentenceMatch[0].length >= minLength && firstSentenceMatch[0].length <= safeMaxLength) {
            description = firstSentenceMatch[0].trim()
          } else {
            // Try to find a sentence boundary within safeMaxLength
          const lastPeriod = text.lastIndexOf('.')
            const lastExclamation = text.lastIndexOf('!')
            const lastQuestion = text.lastIndexOf('?')
            const lastSentence = Math.max(lastPeriod, lastExclamation, lastQuestion)
            
            if (lastSentence >= minLength && lastSentence <= safeMaxLength) {
              description = text.substring(0, lastSentence + 1).trim()
            } else {
              // Just take safeMaxLength chars at word boundary
              text = cleanContent.substring(0, safeMaxLength)
              const lastSpace = text.lastIndexOf(' ')
              if (lastSpace >= minLength) {
                description = text.substring(0, lastSpace).trim() + '...'
              } else {
                // If word boundary is too short, take more text to ensure minLength
                text = cleanContent.substring(0, Math.min(safeMaxLength, minLength + 50))
                const lastSpace2 = text.lastIndexOf(' ')
                if (lastSpace2 >= minLength) {
                  description = text.substring(0, lastSpace2).trim() + '...'
                } else {
                  // Take at least minLength chars - ensure we get enough text
                  const minText = cleanContent.substring(0, Math.max(minLength + 30, 80)) // Get at least 80 chars to find a good boundary
                  const lastSpaceInMin = minText.lastIndexOf(' ')
                  if (lastSpaceInMin >= minLength) {
                    description = minText.substring(0, lastSpaceInMin).trim() + '...'
                  } else {
                    // Fallback: just take enough chars to meet minLength
                    description = cleanContent.substring(0, minLength + 20).trim() + '...'
                  }
                }
              }
            }
          }
          
          // SAFETY: If content extraction produced a description that's too short, fix it
          if (description && description.length < minLength) {
            // Get more content to build a proper description
            const extendedText = cleanContent.substring(0, minLength + 50)
            const lastSentenceEnd = Math.max(
              extendedText.lastIndexOf('.'),
              extendedText.lastIndexOf('!'),
              extendedText.lastIndexOf('?')
            )
            if (lastSentenceEnd >= minLength) {
              description = extendedText.substring(0, lastSentenceEnd + 1).trim()
            } else {
              const lastSpace = extendedText.lastIndexOf(' ')
              if (lastSpace >= minLength) {
                description = extendedText.substring(0, lastSpace).trim() + '...'
              } else {
                // Last resort: use a generated description
                description = null // Will trigger the fallback below
              }
            }
          }
        }
      }
      
      // If still no description, create one from title and category
      if (!description || description.length < minLength) {
        const cleanTitle = title.replace(/\s*\|\s*AlertMend(?: AI)?\s*$/i, '').trim()
        const categoryText = category ? ` on ${category}` : ''
        description = `Learn how to ${cleanTitle.toLowerCase()}${categoryText}. Expert tips and best practices.`
        // Ensure it fits
        if (description.length > maxLength) {
          description = description.substring(0, maxLength - 3).trim() + '...'
        }
      }
      
      // Ensure uniqueness by including key terms from title (but only if there's room)
      const cleanTitle = title.replace(/\s*\|\s*AlertMend(?: AI)?\s*$/i, '').trim()
      const titleWords = cleanTitle.toLowerCase().split(/\s+/).filter(word => word.length > 4)
      const descriptionLower = description.toLowerCase()
      const missingKeywords = titleWords.filter(word => !descriptionLower.includes(word))
      
      if (missingKeywords.length > 0 && description.length < maxLength - 40) {
        const keywordsToAdd = missingKeywords.slice(0, 2).join(', ')
        // (Disabled: "Discover solutions for <keywords>." read as keyword stuffing.)
        void keywordsToAdd
      }
      
      // STRICT truncation to max length (safeMaxLength already defined above)
      if (description.length > safeMaxLength) {
        let truncated = description.substring(0, safeMaxLength - 3)
        const lastSpace = truncated.lastIndexOf(' ')
        const lastPeriod = truncated.lastIndexOf('.')
        const lastExclamation = truncated.lastIndexOf('!')
        const lastQuestion = truncated.lastIndexOf('?')
        const lastSentenceEnd = Math.max(lastPeriod, lastExclamation, lastQuestion)
        
        // Prefer sentence boundary
        if (lastSentenceEnd >= safeMaxLength * 0.6) {
          truncated = truncated.substring(0, lastSentenceEnd + 1)
        } else if (lastSpace >= safeMaxLength * 0.7) {
          truncated = truncated.substring(0, lastSpace)
        }
        truncated = truncated.replace(/[.,;:!?\-—–\s]+$/, '').trim()
        description = truncated + (truncated.endsWith('.') || truncated.endsWith('!') || truncated.endsWith('?') ? '' : '...')
      }
      
      // Ensure minimum length
      if (description.length < minLength) {
        const padding = `Expert guide on ${category || 'Kubernetes'}.`
        const newDescription = description + ' ' + padding
        if (newDescription.length <= safeMaxLength) {
          description = newDescription
        } else {
          description = padding
        }
      }
      
      // Final safety: if HTML-encoded would exceed maxLength, truncate more
      // Each quote " becomes &quot; (adds 5 chars)
      const quoteCount = (description.match(/"/g) || []).length
      const htmlEncodedLength = description.length + (quoteCount * 5)
      if (htmlEncodedLength > maxLength && description.length > minLength + 20) {
        // Only truncate if we have enough room to still meet minLength after truncation
        const excess = htmlEncodedLength - maxLength
        const charsToRemove = Math.ceil(excess / 6) + 3
        let targetLength = Math.max(minLength + 10, description.length - charsToRemove - 3) // Extra 10 buffer
        let truncated = description.substring(0, targetLength)
        const lastSpace = truncated.lastIndexOf(' ')
        if (lastSpace >= minLength) {
          truncated = truncated.substring(0, lastSpace)
        } else if (targetLength > minLength + 5) {
          // Try a smaller target but still above minLength
          targetLength = Math.max(minLength, targetLength - 10)
          truncated = description.substring(0, targetLength)
          const lastSpace2 = truncated.lastIndexOf(' ')
          if (lastSpace2 >= minLength) {
            truncated = truncated.substring(0, lastSpace2)
          }
        }
        // NEVER go below minLength
        if (truncated.length >= minLength) {
          description = truncated.trim() + (truncated.endsWith('.') ? '' : '...')
        }
        // If truncation would violate minLength, keep original and accept it might be slightly over when encoded
      }
      
      // Final check: ensure minimum length - this is CRITICAL and must always pass
      if (description.length < minLength) {
        const cleanTitle = title.replace(/\s*\|\s*AlertMend(?: AI)?\s*$/i, '').trim()
        const categoryText = category || 'Kubernetes'
        
        // If description is way too short, generate a proper one
        if (description.length < 20) {
          description = `Learn about ${cleanTitle.toLowerCase()} and discover expert solutions, best practices, and troubleshooting tips for ${categoryText}.`
        } else {
          // Just pad it
          const padding = `Expert guide on ${categoryText} with best practices and solutions.`
          const newDescription = description + ' ' + padding
          if (newDescription.length <= safeMaxLength) {
            description = newDescription
          } else {
            description = `Expert guide on ${cleanTitle.toLowerCase()} for ${categoryText}. Learn best practices and solutions.`
          }
        }
        
        // Absolute guarantee: if still too short, use a fallback
        if (description.length < minLength) {
          const cleanTitle = title.replace(/\s*\|\s*AlertMend(?: AI)?\s*$/i, '').trim()
          const categoryText = category || 'Kubernetes'
          description = `Expert guide on ${cleanTitle.toLowerCase()} for ${categoryText}. Learn best practices, troubleshooting tips, and solutions.`
        }
      }
      
      // Final truncation if needed (but preserve minLength)
      if (description.length > safeMaxLength) {
        let truncated = description.substring(0, safeMaxLength - 3)
        const lastSpace = truncated.lastIndexOf(' ')
        if (lastSpace >= minLength) {
          truncated = truncated.substring(0, lastSpace)
        } else {
          // Can't truncate without violating minLength, so keep as is (will be slightly over when encoded)
          truncated = description.substring(0, safeMaxLength)
        }
        description = truncated.trim() + '...'
        
        // Final safety: if still too long, at least ensure it's not below minLength
        if (description.length < minLength) {
          const cleanTitle = title.replace(/\s*\|\s*AlertMend(?: AI)?\s*$/i, '').trim()
          const categoryText = category || 'Kubernetes'
          description = `Expert guide on ${cleanTitle.toLowerCase()} for ${categoryText}. Learn best practices and solutions.`
        }
      }
      
      // CRITICAL: If we had a valid original excerpt but description is now invalid, use the original
      if (originalValidExcerpt && description.length < minLength) {
        // Use the original excerpt, just truncate if needed
        description = originalValidExcerpt
        if (description.length > safeMaxLength) {
          description = description.substring(0, safeMaxLength - 3).trim() + '...'
        }
      }
      
      // ABSOLUTE FINAL CHECK: description MUST be >= minLength (50 chars)
      // This is a hard requirement that cannot be violated
      // If description is too short (like "In today" at 8 chars), generate a proper one
      if (!description || description.length < minLength) {
        const cleanTitle = title.replace(/\s*\|\s*AlertMend(?: AI)?\s*$/i, '').trim()
        const categoryText = category || 'Kubernetes'
        
        // Generate a guaranteed-valid description
        if (description && description.length > 0 && description.length < 20) {
          // Description is way too short (like "In today"), replace it completely
          description = `Learn about ${cleanTitle.toLowerCase()} and discover expert solutions, best practices, and troubleshooting tips for ${categoryText}.`
        } else {
          // Description is close to minLength, try to extend it
          description = `Expert guide on ${cleanTitle.toLowerCase()} for ${categoryText}. Learn best practices, troubleshooting tips, and solutions.`
        }
        
        // Ensure it's within safeMaxLength
        if (description.length > safeMaxLength) {
          description = description.substring(0, safeMaxLength - 3).trim() + '...'
        }
      }
      
      // One more check - if still below minLength (shouldn't happen, but be absolutely safe)
      if (description.length < minLength) {
        const cleanTitle = title.replace(/\s*\|\s*AlertMend(?: AI)?\s*$/i, '').trim()
        description = `Expert guide on ${cleanTitle.toLowerCase()} for ${category || 'Kubernetes'}. Learn best practices and solutions.`
        if (description.length > safeMaxLength) {
          description = description.substring(0, safeMaxLength - 3).trim() + '...'
        }
      }
      
      // FINAL VALIDATION: description MUST be >= minLength (50 chars) - this is non-negotiable
      let finalDesc = description ? description.trim() : ''
      
      // If description is missing or too short, generate a guaranteed-valid one
      if (!finalDesc || finalDesc.length < minLength) {
        const cleanTitle = title.replace(/\s*\|\s*AlertMend(?: AI)?\s*$/i, '').trim()
        const categoryText = category || 'Kubernetes'
        // Generate a guaranteed-valid description (always >= 50 chars)
        finalDesc = `Expert guide on ${cleanTitle.toLowerCase()} for ${categoryText}. Learn best practices, troubleshooting tips, and solutions.`
        // Ensure it fits within safeMaxLength
        if (finalDesc.length > safeMaxLength) {
          finalDesc = finalDesc.substring(0, safeMaxLength - 3).trim() + '...'
        }
      }
      
      // If still too long, truncate intelligently
      if (finalDesc.length > safeMaxLength) {
        let truncated = finalDesc.substring(0, safeMaxLength - 3)
        const lastSpace = truncated.lastIndexOf(' ')
        if (lastSpace >= minLength) {
          truncated = truncated.substring(0, lastSpace)
        }
        finalDesc = truncated.trim() + '...'
      }
      
      // ABSOLUTE FINAL CHECK: must be valid (this should never fail, but be safe)
      // This MUST catch any description that's too short
      if (!finalDesc || finalDesc.length < minLength) {
        const cleanTitle = title.replace(/\s*\|\s*AlertMend(?: AI)?\s*$/i, '').trim()
        finalDesc = `Expert guide on ${cleanTitle.toLowerCase()} for ${category || 'Kubernetes'}. Learn best practices and solutions.`
        // Ensure it fits
        if (finalDesc.length > safeMaxLength) {
          finalDesc = finalDesc.substring(0, safeMaxLength - 3).trim() + '...'
        }
      }
      
      // VERIFY one last time - this is the absolute last check before returning
      const verifiedDesc = (finalDesc || '').trim()
      if (verifiedDesc.length < minLength) {
        // Emergency fallback - this should never happen
        const cleanTitle = title.replace(/\s*\|\s*AlertMend(?: AI)?\s*$/i, '').trim()
        return `Expert guide on ${cleanTitle.toLowerCase()} for ${category || 'Kubernetes'}. Learn best practices.`
      }
      
      return verifiedDesc
    }
    
    let metaDescription = generateUniqueMetaDescription(
      metadata.title || slug,
      metadata.excerpt || '',
      content,
      metadata.category || ''
    )
    
    // ABSOLUTE SAFETY CHECK: Ensure description is always valid (50-160 chars)
    // This is a final safeguard in case the function somehow returns an invalid description
    const currentDescLength = metaDescription ? metaDescription.trim().length : 0
    if (!metaDescription || currentDescLength < 50) {
      const cleanTitle = (metadata.title || slug).replace(/\s*\|\s*AlertMend(?: AI)?\s*$/i, '').trim()
      const categoryText = metadata.category || 'Kubernetes'
      // Generate a guaranteed-valid description (always >= 50 chars)
      metaDescription = `Expert guide on ${cleanTitle.toLowerCase()} for ${categoryText}. Learn best practices, troubleshooting tips, and solutions.`
      // Ensure it fits
      if (metaDescription.length > 150) {
        metaDescription = metaDescription.substring(0, 147).trim() + '...'
      }
      // Double-check it's valid
      if (metaDescription.trim().length < 50) {
        metaDescription = `Learn about ${cleanTitle.toLowerCase()} and discover expert solutions for ${categoryText}.`
      }
    }
    // Verify final length one more time
    if (metaDescription.trim().length < 50) {
      const cleanTitle = (metadata.title || slug).replace(/\s*\|\s*AlertMend(?: AI)?\s*$/i, '').trim()
      metaDescription = `Expert guide on ${cleanTitle.toLowerCase()} for ${metadata.category || 'Kubernetes'}. Learn best practices.`
    }
    
    // Final truncation if needed (accounting for HTML encoding)
    const quoteCount = (metaDescription.match(/"/g) || []).length
    const htmlEncodedLength = metaDescription.length + (quoteCount * 5)
    if (htmlEncodedLength > 160 && metaDescription.length > 50) {
      // Need to truncate to account for HTML encoding
      const excess = htmlEncodedLength - 160
      const charsToRemove = Math.ceil(excess / 6) + 3
      let truncated = metaDescription.substring(0, Math.max(50, metaDescription.length - charsToRemove - 3))
      const lastSpace = truncated.lastIndexOf(' ')
      if (lastSpace >= 50) {
        truncated = truncated.substring(0, lastSpace)
      }
      metaDescription = truncated.trim() + '...'
    }
    
    // FINAL SAFETY CHECK: Ensure metaDescription is valid before writing to HTML
    // This is the absolute last check before the description is written
    // Check the actual length, not just truthiness
    const descLen = metaDescription ? metaDescription.trim().length : 0
    if (!metaDescription || descLen < 50) {
      const cleanTitle = (metadata.title || slug).replace(/\s*\|\s*AlertMend(?: AI)?\s*$/i, '').trim()
      const categoryText = metadata.category || 'Kubernetes'
      // Generate a guaranteed-valid description (always >= 50 chars)
      metaDescription = `Expert guide on ${cleanTitle.toLowerCase()} for ${categoryText}. Learn best practices, troubleshooting tips, and solutions.`
      if (metaDescription.length > 150) {
        metaDescription = metaDescription.substring(0, 147).trim() + '...'
      }
    }
    
    // One more verification right before use
    const finalDescLen = metaDescription ? metaDescription.trim().length : 0
    if (finalDescLen < 50) {
      const cleanTitle = (metadata.title || slug).replace(/\s*\|\s*AlertMend(?: AI)?\s*$/i, '').trim()
      metaDescription = `Expert guide on ${cleanTitle.toLowerCase()} for ${metadata.category || 'Kubernetes'}. Learn best practices and solutions.`
    }
    
    // ABSOLUTE FINAL ASSIGNMENT: Ensure metaDescription is always valid (50+ chars)
    // This is the last line before the template - it MUST ensure a valid description
    // Do a final check and replacement to guarantee validity
    {
      const currentLen = (metaDescription || '').trim().length
      if (currentLen < 50) {
        const cleanTitle = (metadata.title || slug).replace(/\s*\|\s*AlertMend(?: AI)?\s*$/i, '').trim()
        metaDescription = `Expert guide on ${cleanTitle.toLowerCase()} for ${metadata.category || 'Kubernetes'}. Learn best practices and solutions.`
      }
      // One final trim
      metaDescription = metaDescription.trim()
    }
    
    // Helper function to ensure description is always valid (50-160 chars)
    const ensureValidDescription = (desc, title, category, slug) => {
      let cleanDesc = (desc || '').trim()
      // If description is too short, replace it completely
      if (cleanDesc.length < 50) {
        const cleanTitle = (title || slug).replace(/\s*\|\s*AlertMend(?: AI)?\s*$/i, '').trim()
        const categoryText = category || 'Kubernetes'
        cleanDesc = `Expert guide on ${cleanTitle.toLowerCase()} for ${categoryText}. Learn best practices and solutions.`
      }
      // If still too short (shouldn't happen), use minimal fallback
      if (cleanDesc.length < 50) {
        const cleanTitle = (title || slug).replace(/\s*\|\s*AlertMend(?: AI)?\s*$/i, '').trim()
        cleanDesc = `Expert guide on ${cleanTitle.toLowerCase()} for ${category || 'Kubernetes'}. Learn best practices.`
      }
      // Truncate if too long
      if (cleanDesc.length > 150) {
        cleanDesc = cleanDesc.substring(0, 147).trim() + '...'
      }
      return cleanDesc
    }
    
    // Ensure metaDescription is valid before using it - this MUST fix any invalid descriptions
    metaDescription = ensureValidDescription(metaDescription, metadata.title, metadata.category, slug)
    
    // FINAL CHECK: Create a const variable with guaranteed valid description
    // This MUST ensure the description is always >= 50 chars
    let tempDesc = (metaDescription || '').trim()
    if (!tempDesc || tempDesc.length < 50) {
      const cleanTitle = ((metadata.title || slug).replace(/\s*\|\s*AlertMend(?: AI)?\s*$/i, '')).trim()
      tempDesc = `Expert guide on ${cleanTitle.toLowerCase()} for ${metadata.category || 'Kubernetes'}. Learn best practices and solutions.`
    }
    // Absolute guarantee - if still too short, use minimal fallback
    if (tempDesc.length < 50) {
      const cleanTitle = ((metadata.title || slug).replace(/\s*\|\s*AlertMend(?: AI)?\s*$/i, '')).trim()
      tempDesc = `Expert guide on ${cleanTitle.toLowerCase()} for ${metadata.category || 'Kubernetes'}. Learn best practices.`
    }
    // Never publish a description ending in "..." / "....": end on a full
    // sentence when one fits, otherwise on a word with a period.
    const stripEllipsis = (d) => {
      let out = d.replace(/\s*(\.{2,}|…)\s*$/, '').trim()
      if (/[.!?]$/.test(out)) return out
      const lastEnd = Math.max(out.lastIndexOf('. '), out.lastIndexOf('! '), out.lastIndexOf('? '))
      if (lastEnd >= 50) return out.substring(0, lastEnd + 1)
      return out.replace(/[,;:\-—–\s]+$/, '') + '.'
    }
    tempDesc = stripEllipsis(tempDesc)
    const finalMetaDescription = tempDesc

    // Contextual link from the post to the product page that solves it.
    const PRODUCT_LINKS = [
      [/data quality|data observability|snowflake|dbt|airflow|bcbs|power bi|data pipeline/i, '/data-observability', 'Data Observability', 'Turn your data quality policy into live checks, and see the job and reports behind every failure.'],
      [/gpu|mlops|cuda|nvidia|llm|vllm|model serving|inference|ai agent/i, '/gpu-mlops', 'GPU & MLOps monitoring', 'Watch GPU fleets and ML pipelines, with root cause and approved fixes.'],
      [/cost|finops|right-siz|spend|billing/i, '/kubernetes-cost-optimization', 'Kubernetes & AWS cost optimization', 'See spend by namespace and apply right-sizing with a YAML preview and rollback.'],
      [/on-call|on call|pager|escalation|incident management|paging/i, '/on-call-management', 'On-call & incidents', 'Pages that arrive with the root cause and a ready fix attached.'],
      [/log|elasticsearch|opensearch|loki/i, '/log-management', 'Log management', 'Query Kubernetes and VM logs with plain SQL, in your own VPC.'],
      [/runbook|remediat|self-heal|automat|toil/i, '/auto-remediation', 'Automated fixes', 'Remediation flows that run the moment you approve them, with an audit trail.'],
      [/kubernetes|k8s|pod|kubectl|node|helm|container|crashloop|oomkill/i, '/kubernetes-management', 'Kubernetes monitoring & management', 'Every cluster on one overview, with root cause one click away.'],
      [/monitor|observab|trace|apm|metric|prometheus|grafana|datadog|uptime|latency/i, '/observability', 'Observability & APM', 'Metrics, logs and traces on one timeline, with AI root cause on top.'],
    ]
    const ctaHaystack = `${metadata.title || ''} ${metadata.category || ''} ${slug}`
    const productMatch = PRODUCT_LINKS.find(([rx]) => rx.test(ctaHaystack)) || [null, '/ai-rca', 'AI root cause analysis', 'Evidence-backed root cause in about 15 seconds, posted where your team works.']
    const productCtaHtml = `<aside class="product-cta" style="margin: 2.5rem 0; padding: 1.25rem 1.5rem; border: 1px solid rgba(124,58,237,0.2); border-radius: 10px; background: #f5f3ff;">
              <p style="margin: 0 0 4px; font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #6d28d9;">Related AlertMend product</p>
              <p style="margin: 0 0 8px; font-size: 17px; font-weight: 700; color: #18181b;"><a href="${productMatch[1]}" style="color: #18181b;">${productMatch[2]} →</a></p>
              <p style="margin: 0; font-size: 15px; color: #52525b; line-height: 1.55;">${productMatch[3]}</p>
            </aside>`

    // Build tracking URLs for static blog HTML pages.
    // These pages don't run the React `Navbar`, so we must embed source tracking directly.
    const normalizedBlogSlug = String(slug).replace(/\.html$/, '').toLowerCase().replace(/_/g, '-')
    const blogSourceParam = 'blog-post'

    const signupTrackingUrlObj = new URL('https://app.alertmend.io/signup')
    signupTrackingUrlObj.searchParams.set('source', blogSourceParam)
    signupTrackingUrlObj.searchParams.set('blog_slug', normalizedBlogSlug)
    const signupTrackingUrl = signupTrackingUrlObj.toString()

    const playgroundTrackingUrl = 'https://demo.alertmend.io'
    
    
    

    const calendlyTrackingUrlObj = new URL('https://calendly.com/hello-alertmend/30min')
    // Calendly only keeps utm_* params on a booking
    calendlyTrackingUrlObj.searchParams.set('utm_source', 'alertmend.io')
    calendlyTrackingUrlObj.searchParams.set('utm_medium', blogSourceParam)
    calendlyTrackingUrlObj.searchParams.set('utm_campaign', `blog-${normalizedBlogSlug}`)
    const calendlyTrackingUrl = calendlyTrackingUrlObj.toString()
    
    // Function to create HTML head with specific canonical URL
    const createHTMLHead = (canonicalUrl) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${shortenedTitle}</title>
  <meta name="description" content="${((finalMetaDescription && finalMetaDescription.trim().length >= 50) ? finalMetaDescription : `Expert guide on ${((metadata.title || slug).replace(/\s*\|\s*AlertMend(?: AI)?\s*$/i, '')).trim().toLowerCase()} for ${metadata.category || 'Kubernetes'}. Learn best practices and solutions.`).replace(/"/g, '&quot;')}">
  <meta name="keywords" content="${(metadata.keywords || `${metadata.category || 'Blog'}, AlertMend, AIOps, Kubernetes, DevOps`).replace(/"/g, '&quot;')}">
  <meta name="author" content="${metadata.author || 'AlertMend Team'}">
  <meta name="robots" content="${String(metadata.noindex) === 'true' ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'}">
  <link rel="canonical" href="${canonicalUrl}">
  <!-- Favicon - uses SVG logo -->
  <link rel="icon" type="image/svg+xml" href="/logos/alertmend-logo.svg" />
  <link rel="apple-touch-icon" href="/logos/alertmend-logo.svg" />
  
  <!-- Open Graph -->
  <meta property="og:type" content="article">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:title" content="${shortenedTitle}">
  <meta property="og:description" content="${finalMetaDescription.replace(/"/g, '&quot;')}">
  <meta property="og:image" content="https://www.alertmend.io/og-image.jpg">
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${canonicalUrl}">
  <meta name="twitter:title" content="${shortenedTitle}">
  <meta name="twitter:description" content="${finalMetaDescription.replace(/"/g, '&quot;')}">
  <meta name="twitter:image" content="https://www.alertmend.io/og-image.jpg">
  
  <!-- Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": ${JSON.stringify(shortenedTitle)},
    "description": ${JSON.stringify(finalMetaDescription)},
    "image": "https://www.alertmend.io/og-image.jpg",
    "datePublished": "${metadata.date || ''}",
    "dateModified": "${metadata.date || ''}",
    "author": {
      "@type": "Person",
      "name": ${JSON.stringify(metadata.author || 'AlertMend Team')}${metadata.authorLinkedin ? `,
      "url": ${JSON.stringify(metadata.authorLinkedin)},
      "sameAs": [${JSON.stringify(metadata.authorLinkedin)}]` : ''}
    },
    "publisher": {
      "@type": "Organization",
      "name": "AlertMend",
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
  <script nowprocket nitro-exclude type="text/javascript" id="sa-dynamic-optimization" data-uuid="6df6e583-765f-486e-af01-8883dae4a8f2" src="data:text/javascript;base64,dmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoInNjcmlwdCIpO3NjcmlwdC5zZXRBdHRyaWJ1dGUoIm5vd3Byb2NrZXQiLCAiIik7c2NyaXB0LnNldEF0dHJpYnV0ZSgibml0cm8tZXhjbHVkZSIsICIiKTtzY3JpcHQuc3JjID0gImh0dHBzOi8vZGFzaGJvYXJkLnNlYXJjaGF0bGFzLmNvbS9zY3JpcHRzL2R5bmFtaWNfb3B0aW1pemF0aW9uLmpzIjtzY3JpcHQuZGF0YXNldC51dWlkID0gIjZkZjZlNTgzLTc2NWYtNDg2ZS1hZjAxLTg4ODNkYWU0YThmMiI7c2NyaXB0LmlkID0gInNhLWR5bmFtaWMtb3B0aW1pemF0aW9uLWxvYWRlciI7ZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpOw=="></script>
  
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
      padding: 40px 16px 32px;
    }
    @media (min-width: 640px) {
      .main-container {
        padding: 44px 24px 32px;
      }
    }
    @media (min-width: 1024px) {
      .main-container {
        padding: 48px 32px 48px;
      }
    }
    .content-wrapper {
      display: grid;
      grid-template-columns: 1fr;
      gap: 32px;
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
      background: #ede9fe;
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
      color: #0b1220;
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
      color: #0b1220;
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
      color: #0b1220;
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
      color: #0b1220;
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
    .author-avatar,
    .author-photo {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      flex: 0 0 auto;
    }
    .author-avatar { color: #5b21b6 !important; }
    .author-avatar-x {
      background: #ddd6fe;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #7c3aed;
      font-weight: 600;
      font-size: 1rem;
    }
    .author-photo {
      object-fit: cover;
      border: 1px solid #e5e7eb;
      background: #f8fafc;
      box-shadow: 0 6px 18px rgba(15, 23, 42, 0.08);
    }
    .author-avatar-fallback {
      display: none;
    }
    .author-avatar-fallback.show {
      display: flex;
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
      margin-top: 2px;
    }
    .author-summary {
      font-size: 0.875rem;
      line-height: 1.4;
      color: #4b5563;
      margin-top: 2px;
    }
    code {
      background: #f3f4f6;
      color: #7c3aed;
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
      color: #7c3aed;
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
      border-left: 4px solid #7c3aed;
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
    .table-wrapper {
      width: 100%;
      overflow-x: auto;
      margin: 2rem 0;
      -webkit-overflow-scrolling: touch;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 0;
      font-size: 1rem;
      background: #ffffff;
      border: 2px solid #d1d5db;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    }
    thead {
      background: #fafafa;
    }
    th {
      padding: 1rem;
      text-align: left;
      font-weight: 600;
      color: #0b1220;
      border-right: 1px solid #ddd6fe;
      border-bottom: 2px solid #a78bfa;
      background: #fafafa;
      font-size: 0.9375rem;
    }
    th:first-child {
      border-left: none;
    }
    th:last-child {
      border-right: none;
    }
    td {
      padding: 1rem;
      text-align: left;
      border-right: 1px solid #e5e7eb;
      border-bottom: 1px solid #e5e7eb;
      vertical-align: top;
      color: #1f2937;
      line-height: 1.6;
    }
    td:first-child {
      border-left: none;
    }
    td:last-child {
      border-right: none;
    }
    tbody tr:last-child td {
      border-bottom: none;
    }
    tbody tr:nth-child(even) {
      background: #f9fafb;
    }
    tbody tr:hover {
      background: #ede9fe;
    }
    @media (max-width: 768px) {
      .table-wrapper {
        margin: 1.5rem 0;
      }
      table {
        font-size: 0.875rem;
      }
      th, td {
        padding: 0.75rem;
      }
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
      background: #ede9fe;
      border: 1px solid #e5e7eb;
      align-items: center;
      justify-content: center;
      color: #7c3aed;
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
      color: #0b1220;
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
      color: #7c3aed;
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
      color: #7c3aed;
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
      background: #fafafa;
      border-radius: 12px;
      padding: 24px;
      border: 1px solid #ddd6fe;
    }
    .sidebar-card h3 {
      font-size: 1.125rem;
      font-weight: 700;
      color: #0b1220;
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
      border-color: #7c3aed;
      box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.18);
    }
    .signup-form button {
      width: 100%;
      padding: 10px 12px;
      background: #09090b;
      color: white;
      font-weight: 600;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      transition: background 0.15s ease;
    }
    .signup-form button:hover {
      background: #27272a;
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
      color: #7c3aed;
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
      font-size: 1.0625rem;
      font-weight: 700;
      letter-spacing: -0.01em;
      color: #09090b;
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
      padding: 6px 12px;
      font-size: 0.875rem;
      font-weight: 500;
      color: #3f3f46;
      text-decoration: none;
      border-radius: 6px;
      transition: color 0.15s ease, background 0.15s ease;
    }
    .navbar-link:hover {
      color: #09090b;
      background: #f4f4f5;
    }
    .navbar-link.active {
      color: #09090b;
      background: #fafafa;
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
      background: #09090b;
      color: white;
      font-weight: 600;
      border-radius: 999px;
      padding: 8px 14px;
      box-shadow: 0 1px 2px rgba(9, 9, 11, 0.08);
    }
    .navbar-button-primary:hover {
      background: #27272a;
    }
    .navbar-button-secondary {
      color: #3f3f46;
      background: transparent;
    }
    .navbar-button-secondary:hover {
      color: #09090b;
      background: #f4f4f5;
    }
    .navbar-button-playground {
      background: #ede9fe;
      color: #6d28d9;
      font-weight: 600;
      border-radius: 999px;
      padding: 6px 12px;
      border: 1px solid rgba(124, 58, 237, 0.22);
    }
    .navbar-button-playground:hover {
      background: #ddd6fe;
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
    /* ---- Enterprise layer: matches the main site ---- */
    body { color: #1e293b; }
    .navbar { position: sticky; box-shadow: none; border-bottom: 1px solid rgba(11,18,32,0.08); }
    .navbar-content { height: 64px; }
    .am-lockup { display: block; height: 28px; width: 83px; flex: none; background-color: #6d28d9; -webkit-mask: url(/logos/alertmend-lockup-mask.svg) no-repeat center / contain; mask: url(/logos/alertmend-lockup-mask.svg) no-repeat center / contain; }
    .am-lockup-light { background-color: #e2e8f0; }
    .navbar-link { color: #27272a; font-weight: 500; }
    .navbar-button { border-radius: 8px !important; font-weight: 600; }
    .navbar-button-primary { background: #0b1220; color: #fff !important; }
    .navbar-button-primary:hover { background: #1e293b; }
    .navbar-button-outline { border: 1px solid rgba(11,18,32,0.18); color: #0b1220; background: #fff; }
    .navbar-button-outline:hover { border-color: #0b1220; }
    .navbar-mobile-cta { display: inline-flex; }
    @media (min-width: 1024px) { .navbar-mobile-cta { display: none !important; } }
    .main-container { padding-top: 48px; }
    h1 { font-weight: 600 !important; letter-spacing: -0.028em; }
    @media (min-width: 1024px) { h1 { font-size: 3.25rem !important; line-height: 1.08; } }
    h2, h3, h4 { font-weight: 600 !important; letter-spacing: -0.015em; }
    .social-icon { background: #f1f5f9; color: #334155; }
    .social-icon:hover { background: #e2e8f0; }
    .promotional-section { background: #f8fafc !important; border: 1px solid rgba(11,18,32,0.08) !important; border-left: 3px solid #6d28d9 !important; border-radius: 8px !important; }
    .promotional-section .promo-title { font-size: 1.125rem; font-weight: 600; color: #0b1220; margin-bottom: 6px; }
    .sidebar-card { background: #fff !important; border: 1px solid rgba(11,18,32,0.1) !important; border-radius: 10px !important; box-shadow: none !important; }
    .sidebar-cta h3 { font-size: 1.125rem; color: #0b1220; margin: 0 0 8px; }
    .sidebar-eyebrow { margin: 0 0 8px; font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #6d28d9; }
    .sidebar-copy { margin: 0 0 16px; font-size: 14px; line-height: 1.55; color: #475569; }
    .sidebar-btn { display: block; text-align: center; padding: 10px 16px; border-radius: 8px; background: #0b1220; color: #fff !important; font-size: 14px; font-weight: 600; text-decoration: none; }
    .sidebar-btn:hover { background: #1e293b; }
    .sidebar-link { display: block; margin-top: 12px; text-align: center; font-size: 13.5px; font-weight: 600; color: #6d28d9 !important; text-decoration: none; }
    .related-content-title { font-size: 12px !important; font-weight: 700 !important; letter-spacing: 0.1em !important; text-transform: uppercase; color: #64748b !important; }
    .related-post-link { color: #334155 !important; text-decoration: none !important; }
    .related-post-link:hover { color: #6d28d9 !important; }
    .view-more-link { color: #6d28d9 !important; }
    .site-footer, .site-footer * { text-align: left; }
    .site-footer-cols a, .site-footer-base a { font-weight: 400 !important; }
    .site-footer { margin-top: 64px; background: #0b1220; color: #cbd5e1; }
    .site-footer-inner { max-width: 1280px; margin: 0 auto; padding: 56px 24px 40px; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 2fr); gap: 40px; }
    .site-footer-brand p { margin-top: 16px; max-width: 320px; font-size: 14px; line-height: 1.6; color: #94a3b8; }
    .site-footer-cols { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 24px; }
    .site-footer-cols a { display: block; margin-bottom: 10px; font-size: 14px; color: #e2e8f0; text-decoration: none; }
    .site-footer-cols a:hover { color: #fff; text-decoration: underline; }
    .site-footer-h { margin-bottom: 14px; font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #94a3b8; }
    .site-footer-base { max-width: 1280px; margin: 0 auto; padding: 20px 24px 32px; display: flex; justify-content: space-between; gap: 16px; border-top: 1px solid rgba(255,255,255,0.08); font-size: 13px; color: #94a3b8; }
    .site-footer-base a { color: #cbd5e1; text-decoration: none; }
    @media (max-width: 800px) {
      .site-footer-inner { grid-template-columns: 1fr; }
      .site-footer-cols { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .site-footer-base { flex-direction: column; }
    }
  </style>
</head>
<body>
  <!-- Navbar (mirrors the site header) -->
  <nav class="navbar" aria-label="Main">
    <div class="navbar-container">
      <div class="navbar-content">
        <a href="/" class="navbar-logo" aria-label="AlertMend home"><span class="am-lockup" aria-hidden="true"></span></a>
        <div class="navbar-links">
          <a href="/observability" class="navbar-link">Platform</a>
          <a href="/data-observability" class="navbar-link">Data governance</a>
          <a href="/industries" class="navbar-link">Industries</a>
          <a href="/pricing" class="navbar-link">Pricing</a>
          <a href="/case-studies" class="navbar-link">Customers</a>
          <a href="/blog" class="navbar-link active" aria-current="page">Blog</a>
        </div>
        <div class="navbar-actions">
          <a href="https://app.alertmend.io" class="navbar-button navbar-button-secondary">Sign in</a>
          <a href="${signupTrackingUrl}" target="_blank" rel="noopener noreferrer" class="navbar-button navbar-button-outline">Start free</a>
          <a href="${calendlyTrackingUrl}" target="_blank" rel="noopener noreferrer" class="navbar-button navbar-button-primary">Book a demo</a>
        </div>
        <a href="${calendlyTrackingUrl}" target="_blank" rel="noopener noreferrer" class="navbar-button navbar-button-primary navbar-mobile-cta">Book a demo</a>
      </div>
    </div>
  </nav>

  <div class="main-container">
    <div class="content-wrapper">
      <!-- Main Content Area (70%) -->
      <div class="main-content">
        <!-- Social Share Icons (Left Sidebar) -->
        <div class="social-sidebar">
          <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://www.alertmend.io/blog/${slug}`)}" target="_blank" rel="noopener noreferrer" class="social-icon" aria-label="Share on Facebook">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </a>
          <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(`https://www.alertmend.io/blog/${slug}`)}" target="_blank" rel="noopener noreferrer" class="social-icon" aria-label="Share on X">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
          </a>
          <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://www.alertmend.io/blog/${slug}`)}" target="_blank" rel="noopener noreferrer" class="social-icon" aria-label="Share on LinkedIn">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </a>
          <a href="mailto:?subject=${encodeURIComponent(metadata.title || slug)}&body=${encodeURIComponent(`https://www.alertmend.io/blog/${slug}`)}" class="social-icon" aria-label="Share by email">
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
                ${renderAuthorAvatar(metadata)}
                <div class="author-details">
                  <div class="author-name">${escapeHtml(metadata.author || 'AlertMend Team')}</div>
                  ${metadata.authorCredLine ? `<div class="author-summary">${escapeHtml(metadata.authorCredLine)}</div>` : ''}
                  <div class="author-meta">${calculateReadTime(content)} • ${formatDate(metadata.date || '')}</div>
                </div>
              </div>

            </header>

            <!-- Content -->
            <div class="content">
              ${htmlContent}
            </div>

            <!-- Promotional Section -->
            <div class="promotional-section">
              <p class="promo-title">${isDataPost ? 'Turn your data quality policy into live checks' : 'Find the root cause, then fix it with approval'}</p>
              <p>${isDataPost ? 'AlertMend reads your policy, proposes checks with the clause they enforce, and shows the job and reports behind every failure. A read-only agent keeps your data in your network.' : 'AlertMend puts metrics, logs and traces on one timeline, explains incidents with evidence, and runs a fix only after your team approves it.'} <a href="${calendlyTrackingUrl}" target="_blank" rel="noopener noreferrer">Book a demo</a></p>
            </div>

            <!-- Horizontal Separator -->
            <hr />

            ${productCtaHtml}

            <!-- Arvind Rajpurohit Profile Section -->
            <div class="profile-section">
              <img src="/logos/arvind.jpeg" alt="Arvind Rajpurohit" class="profile-image" onerror="this.style.display='none'; const placeholder = this.nextElementSibling; if (placeholder) placeholder.classList.add('show');" />
              <div class="profile-placeholder-arvind">AR</div>
              <div class="profile-content">
                <h3 class="profile-name">Arvind Rajpurohit</h3>
                <p class="profile-title" style="color: #7c3aed; font-weight: 600; margin-bottom: 1rem; font-size: 1rem;">Co-Founder & CEO</p>
                <div class="profile-bio">
                  <p>Arvind is a Kubestronaut and DevOps engineer with over 15 years in infrastructure. Previously DevOps team lead at Roambee and customer success engineer at Shoreline.io (acquired by NVIDIA).</p>
                  <p>As co-founder and CEO of AlertMend, he leads a team building observability that explains every failure with evidence and fixes it only after approval.</p>
                </div>
                <a href="https://www.linkedin.com/in/arvind-rajpurohit-4a332523/" target="_blank" rel="noopener noreferrer" class="linkedin-link" aria-label="Arvind Rajpurohit on LinkedIn">
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
          <!-- Product card -->
          <div class="sidebar-card sidebar-cta">
            <p class="sidebar-eyebrow">${isDataPost ? 'Data observability' : 'AlertMend platform'}</p>
            <h3>${isDataPost ? 'Policy to live checks in minutes' : 'Root cause and approved fixes'}</h3>
            <p class="sidebar-copy">${isDataPost ? 'Checks that cite your policy, with lineage to the failed job and affected reports.' : 'Evidence-backed root cause, and fixes that run only after you approve them in Slack or Teams.'}</p>
            <a class="sidebar-btn" href="${isDataPost ? 'https://app.alertmend.io/signup?service=data-observability&source=blog-post&blog_slug=' + normalizedBlogSlug : signupTrackingUrl}" target="_blank" rel="noopener noreferrer">Start free</a>
            <a class="sidebar-link" href="${isDataPost ? '/data-observability' : '/observability'}">${isDataPost ? 'See data observability' : 'See how it works'} →</a>
          </div>

          <!-- Related Content -->
          ${relatedPosts.length > 0 ? `
          <div class="sidebar-card">
            <h3 class="related-content-title">Related guides</h3>
            <ul class="related-posts-list">
              ${relatedPosts.map(post => `
                <li>
                  <a href="${blogPostHref(post.slug)}" class="related-post-link">${post.title}</a>
                </li>
              `).join('')}
            </ul>
            <a href="/blog" class="view-more-link">
              All guides
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
          ` : ''}

          <!-- Additional Internal Links -->
          <div class="sidebar-card">
            <h3 class="related-content-title">Explore AlertMend</h3>
            <ul class="related-posts-list">
              ${(isDataPost ? [
                ['/data-observability', 'Data observability and governance'],
                ['/trust', 'Data sovereignty and trust center'],
                ['/industries', 'Industries'],
                ['/integrations/snowflake', 'Snowflake integration'],
                ['/pricing#data', 'Data pricing'],
                ['/case-studies', 'Customer stories'],
              ] : [
                ['/observability', 'Observability and APM'],
                ['/ai-rca', 'AI root cause analysis'],
                ['/auto-remediation', 'Automated fixes'],
                ['/kubernetes-management', 'Kubernetes management'],
                ['/kubernetes-cost-optimization', 'Cost optimization'],
                ['/case-studies', 'Customer stories'],
                ['/pricing', 'Pricing'],
              ]).map(([href, label]) => `<li><a href="${href}" class="related-post-link">${label}</a></li>`).join('')}
            </ul>
          </div>
        </div>
      </aside>
    </div>
  </div>

  <footer class="site-footer">
    <div class="site-footer-inner">
      <div class="site-footer-brand">
        <span class="am-lockup am-lockup-light" aria-hidden="true"></span>
        <p>Data observability and infrastructure observability, with AI root cause and fixes your team approves.</p>
      </div>
      <div class="site-footer-cols">
        <div><p class="site-footer-h">Data</p><a href="/data-observability">Data observability</a><a href="/trust">Trust center</a><a href="/industries">Industries</a></div>
        <div><p class="site-footer-h">Infrastructure</p><a href="/observability">Observability and APM</a><a href="/ai-rca">AI RCA</a><a href="/auto-remediation">Automated fixes</a><a href="/kubernetes-management">Kubernetes</a></div>
        <div><p class="site-footer-h">Resources</p><a href="/blog">Blog</a><a href="/documentation">Documentation</a><a href="/case-studies">Case studies</a><a href="/help">Help center</a></div>
        <div><p class="site-footer-h">Company</p><a href="/about">About</a><a href="/security">Security</a><a href="/pricing">Pricing</a><a href="/contact">Contact</a></div>
      </div>
    </div>
    <div class="site-footer-base">
      <span>© ${new Date().getFullYear()} AlertMend. All rights reserved.</span>
      <span><a href="/privacy">Privacy</a> · <a href="/terms">Terms</a></span>
    </div>
  </footer>
</body>
</html>`
    
        // Body markup is already included in createHTMLHead output
    
    // Canonical version: /blog/slug/
    const fullHTMLClean = createHTMLHead(`https://www.alertmend.io/blog/${slug}`)
    if (!fs.existsSync(path.dirname(dirPath))) {
      fs.mkdirSync(path.dirname(dirPath), { recursive: true })
    }
    fs.writeFileSync(dirPath, fullHTMLClean, 'utf-8')
    console.log(`✓ Converted ${file} → blog/${slug}/index.html`)
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
    
    // Hidden (duplicates, redirected) and noindex (off-topic) posts stay out
    // of the listing so the blog index doesn't link to them.
    if (metadata.hidden === 'true' || metadata.noindex === 'true') return

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
        ${filteredTags.map(tag => `<span class="inline-flex items-center px-2.5 py-1 bg-zinc-100 text-zinc-700 rounded-md text-xs font-medium border border-zinc-200">${tag}</span>`).join('')}
      </div>`
    : ''
  
  return `
    <article class="group bg-white rounded-xl p-8 border border-zinc-200 hover:border-zinc-300 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-full" onclick="window.location.href='${blogPostHref(post.slug)}'">
      <div class="flex items-center gap-2 flex-wrap mb-4">
        <div class="inline-block px-3 py-1.5 bg-zinc-50 text-violet-600 rounded-md text-xs font-semibold">
          ${post.category}
        </div>
        ${tagsHTML}
      </div>
      <h2 class="text-xl md:text-2xl font-bold text-zinc-900 mb-4 leading-tight group-hover:text-violet-600 transition-colors">${post.title}</h2>
      <p class="text-zinc-500 mb-6 leading-relaxed line-clamp-3 flex-grow text-base">${post.excerpt}</p>
      <div class="flex items-center justify-between pt-4 border-t border-gray-100">
        <div class="flex items-center gap-2 text-zinc-500 text-sm">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>${formatDate(post.date)}</span>
        </div>
        <div class="text-violet-600 group-hover:text-violet-700 font-semibold text-sm flex items-center gap-2 transition-colors">
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
  <title>AlertMend Blog: Data Quality, Kubernetes and Observability</title>
  <meta name="description" content="Practical guides from the AlertMend team on data quality, data governance, Kubernetes, observability and automated fixes.">
  <meta name="keywords" content="AIOps blog, Kubernetes best practices, infrastructure automation, DevOps insights, SRE articles, cloud-native operations">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <link rel="canonical" href="https://www.alertmend.io/blog">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://www.alertmend.io/blog">
  <meta property="og:title" content="AlertMend Blog: Data Quality, Kubernetes and Observability">
  <meta property="og:description" content="Practical guides from the AlertMend team on data quality, data governance, Kubernetes, observability and automated fixes.">
  <meta property="og:image" content="https://www.alertmend.io/og-image.jpg">
  <meta property="og:site_name" content="AlertMend">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="AlertMend Blog: Data Quality, Kubernetes and Observability">
  <meta name="twitter:description" content="Practical guides from the AlertMend team on data quality, data governance, Kubernetes, observability and automated fixes.">
  <meta name="twitter:image" content="https://www.alertmend.io/og-image.jpg">
  <!-- Favicon - uses SVG logo -->
  <link rel="icon" type="image/svg+xml" href="/logos/alertmend-logo.svg" />
  <link rel="apple-touch-icon" href="/logos/alertmend-logo.svg" />
  
  <!-- Tailwind CSS - using CDN for static HTML -->
  <script src="https://cdn.tailwindcss.com"></script>
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' data: https://cdn.tailwindcss.com https://fonts.googleapis.com https://calendly.com https://www.googletagmanager.com https://dashboard.searchatlas.com https://storage.googleapis.com https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://calendly.com https://app.alertmend.io https://api.alertmend.io https://www.google-analytics.com https://www.googletagmanager.com https://formspree.io https://dashboard.searchatlas.com https://sa.searchatlas.com https://va.vercel-scripts.com; frame-src https://calendly.com; object-src 'none'; base-uri 'self'; form-action 'self' https://formspree.io; upgrade-insecure-requests;">
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            purple: {
              50: '#fafafa',
              100: '#ede9fe',
              200: '#ddd6fe',
              300: '#c4b5fd',
              400: '#a78bfa',
              500: '#7c3aed',
              600: '#7c3aed',
              700: '#6d28d9',
              800: '#5b21b6',
              900: '#4c1d95',
              950: '#09090b',
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
  <script nowprocket nitro-exclude type="text/javascript" id="sa-dynamic-optimization" data-uuid="6df6e583-765f-486e-af01-8883dae4a8f2" src="data:text/javascript;base64,dmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoInNjcmlwdCIpO3NjcmlwdC5zZXRBdHRyaWJ1dGUoIm5vd3Byb2NrZXQiLCAiIik7c2NyaXB0LnNldEF0dHJpYnV0ZSgibml0cm8tZXhjbHVkZSIsICIiKTtzY3JpcHQuc3JjID0gImh0dHBzOi8vZGFzaGJvYXJkLnNlYXJjaGF0bGFzLmNvbS9zY3JpcHRzL2R5bmFtaWNfb3B0aW1pemF0aW9uLmpzIjtzY3JpcHQuZGF0YXNldC51dWlkID0gIjZkZjZlNTgzLTc2NWYtNDg2ZS1hZjAxLTg4ODNkYWU0YThmMiI7c2NyaXB0LmlkID0gInNhLWR5bmFtaWMtb3B0aW1pemF0aW9uLWxvYWRlciI7ZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpOw=="></script>
  
</head>
<body class="min-h-screen bg-white">
  <section class="pt-24 pb-20 md:pb-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-white">
    <div class="max-w-7xl mx-auto">
      <div class="mb-8">
        <nav class="text-sm text-violet-600">
          <a href="/" class="hover:text-violet-700">Home</a>
          <span class="mx-2">/</span>
          <span class="text-zinc-500">Blog</span>
        </nav>
      </div>
      <div class="text-center mb-12 md:mb-16">
        <div class="inline-flex items-center gap-2 px-3 py-1 bg-violet-50 text-violet-700 rounded-full text-[11px] font-bold uppercase tracking-[0.16em] mb-8 border border-violet-200">
          <span class="h-1.5 w-1.5 rounded-full bg-violet-600"></span>
          Blog
        </div>
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-zinc-950 mb-6 leading-tight tracking-tight">
          Latest Insights & Updates
        </h1>
        <p class="text-xl md:text-2xl text-zinc-500 max-w-3xl mx-auto leading-relaxed mb-12">
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
