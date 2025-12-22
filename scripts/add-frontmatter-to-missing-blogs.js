import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const blogDir = path.join(__dirname, '../public/blog')

// Files that need frontmatter
const filesNeedingFrontmatter = [
  'advanced-kubernetes-health-checks-ai.md',
  'ai-based-kubernetes-scaling.md',
  'ai-driven-kubernetes-management.md',
  'ai-driven-kubernetes-orchestration.md',
  'ai-enhanced-kubernetes-deployment-strategies.md',
  'ai-enhanced-kubernetes-security.md',
  'ai-in-kubernetes-devops-workflows.md',
  'ai-kubernetes-maintenance.md',
  'ai-kubernetes-optimization.md',
  'ai-kubernetes-resource-allocation.md',
  'ai-powered-kubernetes-resource-allocation.md',
  'ai-solutions-for-kubernetes.md',
  'alerting-for-kubernetes-error-resolution.md',
  'api-error-tracking-systems.md',
  'api-health-check-strategies.md',
  'api-monitoring-alerts-configuration.md',
  'api-monitoring-for-cloud-infrastructure.md',
  'api-performance-monitoring-tools.md',
  'api-response-time-monitoring-techniques.md',
  'automated-api-monitoring-workflows.md',
  'automated-incident-remediation-tools.md',
  'automated-kubernetes-error-resolution.md',
  'automated-kubernetes-monitoring.md',
  'automated-url-status-checks.md',
  'automating-kubernetes-with-ai.md',
  'best-practices-for-api-monitoring.md',
  'cloud-based-url-monitoring-solutions.md',
  'cloud-incident-resolution-best-practices.md',
  'cloud-infrastructure-automated-remediation.md',
  'cloud-infrastructure-issue-resolution.md',
  'cloud-native-kubernetes-ai-solutions.md',
  'cloud-service-disruption-analysis.md',
  'common-kubernetes-issues-troubleshooting.md',
  'devops-api-monitoring-integration.md',
  'devops-incident-management-strategies.md',
  'devops-kubernetes-issue-management.md',
  'devops-url-monitoring-practices.md',
  'effective-incident-response-plan.md',
  'incident-resolution-in-devops-pipelines.md',
  'kubernetes-ai-driven-fault-tolerance.md',
  'kubernetes-ai-integration.md',
  'kubernetes-ai-management-tools.md',
  'kubernetes-ai-predictive-analytics.md',
  'kubernetes-ai-troubleshooting.md',
  'kubernetes-anomaly-detection-ai.md',
  'kubernetes-auto-remediation-techniques.md',
  'kubernetes-cloud-automation-ai.md',
  'kubernetes-cluster-health-monitoring-tips.md',
  'kubernetes-cluster-management-ai.md',
  'kubernetes-cluster-monitoring-with-ai.md',
  'kubernetes-monitoring-tools-ai.md',
  'kubernetes-node-auto-recovery-strategies.md',
  'kubernetes-performance-ai.md',
  'kubernetes-performance-tuning-with-ai.md',
  'kubernetes-pod-failure-auto-remediation.md',
  'kubernetes-self-healing-infrastructure.md',
  'machine-learning-for-kubernetes-optimization.md',
  'network-outage-troubleshooting-guide.md',
  'predictive-analytics-for-kubernetes-scaling.md',
  'real-time-api-monitoring-solutions.md',
  'real-time-incident-alert-systems.md',
  'real-time-kubernetes-insights-ai.md',
  'system-monitoring-alert-optimization.md',
  'url-availability-monitoring.md',
  'url-downtime-alerts.md',
  'url-health-check-integration.md',
  'url-latency-measurement.md',
  'url-monitoring-best-practices.md',
  'url-monitoring-for-developers.md',
  'url-monitoring-in-cloud-infrastructure.md',
  'url-monitoring-tools.md',
  'url-response-time-analysis.md',
  'url-uptime-tracking.md'
]

// Function to convert filename to title case
function filenameToTitle(filename) {
  const baseName = filename.replace('.md', '')
  return baseName
    .split('-')
    .map(word => {
      // Handle acronyms
      if (word.toUpperCase() === word && word.length <= 3) {
        return word.toUpperCase()
      }
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(' ')
    .replace(/\bAi\b/g, 'AI')
    .replace(/\bApi\b/g, 'API')
    .replace(/\bUrl\b/g, 'URL')
    .replace(/\bDevops\b/g, 'DevOps')
    .replace(/\bKubernetes\b/g, 'Kubernetes')
}

// Function to determine category from filename
function getCategory(filename) {
  const lower = filename.toLowerCase()
  if (lower.includes('kubernetes')) return 'Kubernetes'
  if (lower.includes('api')) return 'API Monitoring'
  if (lower.includes('url')) return 'URL Monitoring'
  if (lower.includes('incident') || lower.includes('remediation')) return 'Incident Management'
  if (lower.includes('cloud')) return 'Cloud Infrastructure'
  if (lower.includes('devops')) return 'DevOps'
  if (lower.includes('monitoring') || lower.includes('alert')) return 'Monitoring'
  return 'DevOps'
}

// Function to generate keywords from title and category
function generateKeywords(title, category) {
  const words = title.toLowerCase().split(/\s+/)
  const keywords = new Set()
  
  // Add main keywords
  words.forEach(word => {
    if (word.length > 3 && !['the', 'for', 'and', 'with', 'from'].includes(word)) {
      keywords.add(word)
    }
  })
  
  // Add category-related keywords
  if (category === 'Kubernetes') keywords.add('kubernetes')
  if (category === 'API Monitoring') keywords.add('api monitoring')
  if (category === 'URL Monitoring') keywords.add('url monitoring')
  
  // Always add these
  keywords.add('AlertMend AI')
  keywords.add('AIOps')
  keywords.add('DevOps')
  
  return Array.from(keywords).slice(0, 8).join(', ')
}

// Function to generate excerpt from content
function generateExcerpt(content, minLength = 50, maxLength = 160) {
  // Remove "Generated on..." lines first
  content = content.replace(/\*Generated on[^\n]*\*/g, '')
  content = content.replace(/^---\s*$/gm, '')
  
  // Remove code blocks, markdown formatting
  let cleanContent = content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/^#+\s+/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^---\s*$/gm, '')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  
  // Remove any remaining artifacts
  cleanContent = cleanContent.replace(/^Advanced\s+Kubernetes\s+Health\s+Checks\s+Ai\s+/i, '')
  cleanContent = cleanContent.replace(/^Unleashing\s+the\s+Power\s+of\s+/i, '')
  
  // Get first few sentences
  const sentences = cleanContent.split(/[.!?]+\s+/).filter(s => s.trim().length > 15)
  
  let excerpt = ''
  if (sentences.length > 0) {
    excerpt = sentences[0].trim()
    // Add more sentences if needed
    for (let i = 1; i < Math.min(sentences.length, 3); i++) {
      const candidate = (excerpt + ' ' + sentences[i].trim()).trim()
      if (candidate.length <= maxLength) {
        excerpt = candidate
      } else {
        break
      }
    }
    
    if (!excerpt.match(/[.!?]$/) && excerpt.length < maxLength - 5) {
      excerpt += '.'
    }
  }
  
  // Ensure minimum length
  if (excerpt.length < minLength) {
    if (sentences.length > 0) {
      const longer = sentences.slice(0, 3).join(' ').trim()
      if (longer.length >= minLength && longer.length <= maxLength) {
        excerpt = longer
        if (!excerpt.match(/[.!?]$/)) excerpt += '.'
      } else {
        excerpt = longer.substring(0, maxLength - 3).trim()
        const lastSpace = excerpt.lastIndexOf(' ')
        if (lastSpace > minLength) {
          excerpt = excerpt.substring(0, lastSpace) + '...'
        } else {
          excerpt = longer.substring(0, maxLength - 3) + '...'
        }
      }
    } else {
      // Fallback
      excerpt = 'A comprehensive guide covering essential topics, best practices, and practical solutions for system management and DevOps operations.'
    }
  }
  
  // Ensure maximum length
  if (excerpt.length > maxLength) {
    excerpt = excerpt.substring(0, maxLength - 3).trim()
    const lastSpace = excerpt.lastIndexOf(' ')
    if (lastSpace > minLength) {
      excerpt = excerpt.substring(0, lastSpace) + '...'
    } else {
      excerpt = excerpt.substring(0, maxLength - 3) + '...'
    }
  }
  
  return excerpt.trim()
}

// Process each file
let processed = 0
let skipped = 0
let errors = 0

filesNeedingFrontmatter.forEach(filename => {
  const filePath = path.join(blogDir, filename)
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filename}`)
    skipped++
    return
  }
  
  try {
    let content = fs.readFileSync(filePath, 'utf-8')
    
    // Check if frontmatter already exists
    if (content.startsWith('---\n')) {
      console.log(`⏭️  Already has frontmatter: ${filename}`)
      skipped++
      return
    }
    
    // Extract title from H1 if available
    const h1Match = content.match(/^#\s+(.+)$/m)
    let title = h1Match ? h1Match[1].trim() : filenameToTitle(filename)
    
    // Clean title - remove markdown formatting
    title = title.replace(/\*\*/g, '').replace(/\*/g, '').trim()
    
    // Fix common title issues
    title = title.replace(/\bAi\b/g, 'AI')
    title = title.replace(/\bApi\b/g, 'API')
    title = title.replace(/\bUrl\b/g, 'URL')
    
    // Ensure title is not too long (max 43 chars for frontmatter)
    if (title.length > 43) {
      title = title.substring(0, 40).trim() + '...'
    }
    
    // Get category
    const category = getCategory(filename)
    
    // Generate excerpt from content
    const excerpt = generateExcerpt(content)
    
    // Generate keywords
    const keywords = generateKeywords(title, category)
    
    // Create frontmatter
    const frontmatter = `---
title: "${title}"
excerpt: "${excerpt}"
date: "2025-12-18"
category: "${category}"
author: "AlertMend Team"
keywords: "${keywords}"
---`

    // Remove any existing "Generated on" line and standalone ---
    content = content.replace(/\*Generated on[^\n]*\*\s*\n/g, '')
    content = content.replace(/^---\s*$/gm, '')
    
    // If content starts with H1, keep it; otherwise add it
    if (!content.match(/^#\s+/m)) {
      content = `# ${title}\n\n${content.trim()}`
    }
    
    // Combine frontmatter with content
    const newContent = `${frontmatter}\n\n${content.trim()}\n`
    
    fs.writeFileSync(filePath, newContent, 'utf-8')
    processed++
    console.log(`✅ Added frontmatter: ${filename}`)
    
  } catch (error) {
    console.error(`❌ Error processing ${filename}:`, error.message)
    errors++
  }
})

console.log(`\n📊 Summary:`)
console.log(`   ✅ Processed: ${processed}`)
console.log(`   ⏭️  Skipped: ${skipped}`)
console.log(`   ❌ Errors: ${errors}`)
console.log(`   📝 Total files checked: ${filesNeedingFrontmatter.length}`)

