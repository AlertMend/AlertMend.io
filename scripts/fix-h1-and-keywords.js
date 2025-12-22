import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const blogDir = path.join(__dirname, '../public/blog')

// AlertMend keywords for different categories
const KEYWORD_TEMPLATES = {
  'Kubernetes': ['Kubernetes', 'AlertMend AI', 'AIOps', 'DevOps', 'container orchestration', 'Kubernetes monitoring', 'Kubernetes troubleshooting', 'Kubernetes automation'],
  'AIOps': ['AIOps', 'AlertMend AI', 'Kubernetes', 'DevOps', 'automated remediation', 'incident management', 'root cause analysis', 'infrastructure monitoring'],
  'Elasticsearch': ['Elasticsearch', 'AlertMend AI', 'Kubernetes', 'search engine', 'log management', 'data analytics', 'cluster management', 'performance optimization'],
  'DevOps': ['DevOps', 'AlertMend AI', 'AIOps', 'Kubernetes', 'CI/CD', 'infrastructure automation', 'monitoring', 'incident response'],
  'Blog': ['AlertMend AI', 'AIOps', 'Kubernetes', 'DevOps', 'monitoring', 'infrastructure management', 'automated remediation']
}

// Files that need H1 added
const NEEDS_H1 = [
  '5-common-kubernetes-challenges.md',
  '5-ways-aiops-transforming-infrastructure.md',
  'cost-optimization-multi-cloud.md',
  'graceful-shutdown-in-kubernetes.md',
  'imagepullbackoff-errimagepull-kubernetes.md',
  'kubernetes-auto-remediation-best-practices.md',
  'kubernetes-crashloopbackoff.md',
  'kubernetes-evicted-pods.md'
]

function parseFrontmatter(content) {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!frontmatterMatch) {
    return { metadata: {}, markdownContent: content }
  }
  
  const frontmatterText = frontmatterMatch[1]
  const markdownContent = frontmatterMatch[2]
  
  const metadata = {}
  frontmatterText.split('\n').forEach(line => {
    const trimmed = line.trim()
    if (!trimmed) return
    
    // Handle keywords
    const keywordsMatch = trimmed.match(/^keywords:\s*["'](.+)["']$/)
    if (keywordsMatch) {
      metadata.keywords = keywordsMatch[1]
      return
    }
    
    const match = trimmed.match(/^(\w+):\s*(.+)$/)
    if (match) {
      const key = match[1]
      let value = match[2].trim().replace(/^["']|["']$/g, '')
      metadata[key] = value
    }
  })
  
  return { metadata, markdownContent }
}

function extractH1(content) {
  const h1Match = content.match(/^#\s+(.+)$/m)
  return h1Match ? h1Match[1].trim() : null
}

function generateKeywords(title, category, existingKeywords = '') {
  // If keywords already exist, return them
  if (existingKeywords && existingKeywords.trim()) {
    return existingKeywords
  }
  
  // Get base keywords from template
  const baseKeywords = KEYWORD_TEMPLATES[category] || KEYWORD_TEMPLATES['Blog']
  
  // Extract additional keywords from title
  const titleWords = title.toLowerCase().split(/\s+/)
  const additionalKeywords = []
  
  // Common technical terms to extract
  const technicalTerms = ['kubernetes', 'elasticsearch', 'devops', 'aiops', 'api', 'monitoring', 'troubleshooting', 'debugging', 'scaling', 'networking', 'security', 'performance', 'optimization']
  
  titleWords.forEach(word => {
    if (technicalTerms.includes(word) && !baseKeywords.includes(word)) {
      additionalKeywords.push(word.charAt(0).toUpperCase() + word.slice(1))
    }
  })
  
  // Combine and deduplicate
  const allKeywords = [...baseKeywords, ...additionalKeywords]
  const uniqueKeywords = [...new Set(allKeywords)]
  
  return uniqueKeywords.slice(0, 10).join(', ')
}

function addH1Heading(content, title) {
  const { metadata, markdownContent } = parseFrontmatter(content)
  
  // Check if H1 already exists
  if (extractH1(markdownContent)) {
    return content
  }
  
  // Create H1 from title (remove " | AlertMend AI" suffix if present)
  const h1Title = title.replace(/\s*\|\s*AlertMend\s+AI\s*$/i, '').trim()
  
  // Insert H1 right after frontmatter, before any content
  const frontmatterMatch = content.match(/^(---\n[\s\S]*?\n---\n)([\s\S]*)$/)
  if (frontmatterMatch) {
    const frontmatter = frontmatterMatch[1]
    const body = frontmatterMatch[2].trim()
    
    // If body doesn't start with H1, add it
    if (!body.match(/^#\s+/m)) {
      return `${frontmatter}# ${h1Title}\n\n${body}`
    }
  }
  
  return content
}

function addKeywordsToFrontmatter(content, keywords) {
  const { metadata, markdownContent } = parseFrontmatter(content)
  
  // If keywords already exist, don't modify
  if (metadata.keywords && metadata.keywords.trim()) {
    return content
  }
  
  // Find frontmatter section and add keywords
  const frontmatterMatch = content.match(/^(---\n)([\s\S]*?)(\n---\n)([\s\S]*)$/)
  if (!frontmatterMatch) {
    return content
  }
  
  const frontmatterStart = frontmatterMatch[1]
  let frontmatterBody = frontmatterMatch[2]
  const frontmatterEnd = frontmatterMatch[3]
  const body = frontmatterMatch[4]
  
  // Add keywords line at the end of frontmatter (before ---)
  const keywordsLine = `keywords: "${keywords}"`
  
  // Check if there's already a keywords line
  if (!frontmatterBody.match(/^keywords:/m)) {
    // Add newline before keywords if frontmatter body doesn't end with newline
    if (!frontmatterBody.endsWith('\n')) {
      frontmatterBody += '\n'
    }
    frontmatterBody += keywordsLine
  }
  
  return `${frontmatterStart}${frontmatterBody}${frontmatterEnd}${body}`
}

function fixBlogFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const { metadata, markdownContent } = parseFrontmatter(content)
    
    let updatedContent = content
    const changes = []
    
    const title = metadata.title || ''
    const category = metadata.category || 'Blog'
    const existingKeywords = metadata.keywords || ''
    
    // Check if H1 is missing
    const hasH1 = extractH1(markdownContent) !== null
    const filename = path.basename(filePath)
    const needsH1 = NEEDS_H1.includes(filename) || !hasH1
    
    if (needsH1 && title) {
      updatedContent = addH1Heading(updatedContent, title)
      changes.push('Added H1 heading')
    }
    
    // Check if keywords are missing
    if (!existingKeywords.trim()) {
      const keywords = generateKeywords(title, category, existingKeywords)
      updatedContent = addKeywordsToFrontmatter(updatedContent, keywords)
      changes.push('Added keywords')
    }
    
    if (changes.length > 0) {
      fs.writeFileSync(filePath, updatedContent, 'utf-8')
      return { success: true, changes }
    }
    
    return { success: false, changes: [] }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Main execution
const mdFiles = fs.readdirSync(blogDir).filter(file => file.endsWith('.md'))

console.log(`Found ${mdFiles.length} blog files\n`)

let fixedCount = 0
const filesToFix = [
  '5-common-kubernetes-challenges.md',
  '5-ways-aiops-transforming-infrastructure.md',
  'cost-optimization-multi-cloud.md',
  'graceful-shutdown-in-kubernetes.md',
  'imagepullbackoff-errimagepull-kubernetes.md',
  'kubernetes-auto-remediation-best-practices.md',
  'kubernetes-crashloopbackoff.md',
  'kubernetes-evicted-pods.md',
  'debugging-kubernetes-hpa-not-scaling.md',
  'debugging-kubernetes-jobs-and-cronjobs-failures.md',
  'debugging-kubernetes-oomkilled-exit-code-137-causes-and-solutions.md',
  'dns-resolution-failures-in-kubernetes.md',
  'elasticsearch-caching-issues.md',
  'elasticsearch-cluster-health-showing-red.md',
  'elasticsearch-cluster-yellow-incident-on-kubernetes.md',
  'elasticsearch-disk-out-of-space-incident.md',
  'elasticsearch-for-slow-index-flushing-issues.md',
  'elasticsearch-shard-relocation-incidents-on-kubernetes.md',
  'elasticsearch-version-mismatch-in-cluster-nodes.md',
  'elasticsearch-virtual-memory-limit-issues-for-optimal-performance.md',
  'frequent-garbage-collection-issues-in-elasticsearch-for-better-performance.md',
  'kubernetes-api-rate-limiting-troubleshooting.md',
  'kubernetes-configmap-and-secret-mount-failures.md',
  'kubernetes-container-volume-usage-issues.md',
  'kubernetes-csi-driver-failures.md',
  'kubernetes-dns-blog.md',
  'kubernetes-initcontainer-failures.md',
  'kubernetes-load-balancer-failures.md',
  'kubernetes-node-pressure-blog.md',
  'kubernetes-persistentvolumeclaim-guide.md',
  'kubernetes-service-discovery-failures.md',
  'load-balancing-and-scaling-long-lived-connections-in-kubernetes.md',
  'managing-high-number-of-queued-threads-in-elasticsearch-thread-pool-for-optimal-performance.md',
  'managing-high-number-of-rejected-threads-in-elasticsearch-thread-pool-for-better-performance.md',
  'mastering-kubernetes-resource-quotas-requests-and-limits-for-optimized-cluster-performance.md',
  'mastering-kubernetes-statefulsets-basics-and-debugging-tips.md',
  'network-connectivity-and-latency-issues-in-elasticsearch.md',
  'optimizing-elasticsearch-for-high-volume-indexing.md',
  'optimizing-elasticsearch-heap-memory.md',
  'optimizing-high-jvm-heap-usage-in-elasticsearch.md',
  'privileged-containers-in-kubernetes.md',
  'roll-back-deployments-in-kubernetes.md',
  'slack-integration.md',
  'teams-webhook-integration.md',
  'troubleshooting-elasticsearch-cluster-failures-and-instability.md',
  'troubleshooting-elasticsearch-unassigned-shards-incident-on-kubernetes.md',
  'troubleshooting-kubernetes-ingress-issues.md',
  'troubleshooting-networking-errors-in-kubernetes.md',
  'troubleshooting-unhealthy-elasticsearch-nodes-on-kubernetes.md',
  'troubleshooting-unhealthy-kubernetes-daemonsets-a-comprehensive-guide.md',
  'understanding-kubernetes-pending-pod.md'
]

for (const filename of filesToFix) {
  const filePath = path.join(blogDir, filename)
  if (fs.existsSync(filePath)) {
    const result = fixBlogFile(filePath)
    if (result.success) {
      fixedCount++
      console.log(`✅ Fixed ${filename}: ${result.changes.join(', ')}`)
    } else if (result.error) {
      console.log(`❌ Error fixing ${filename}: ${result.error}`)
    }
  } else {
    console.log(`⚠️  File not found: ${filename}`)
  }
}

console.log(`\n✅ Fixed ${fixedCount} files`)

