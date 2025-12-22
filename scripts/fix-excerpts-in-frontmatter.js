import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const blogDir = path.join(__dirname, '../public/blog')

// Files that need excerpt fixes
const filesNeedingFix = [
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

function generateCleanExcerpt(content, minLength = 50, maxLength = 160) {
  // Remove frontmatter if present
  content = content.replace(/^---\n[\s\S]*?\n---\n/, '')
  
  // Remove "Generated on..." lines
  content = content.replace(/\*Generated on[^\n]*\*/g, '')
  content = content.replace(/^---\s*$/gm, '')
  
  // Remove code blocks, markdown formatting
  let cleanContent = content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/^#+\s+/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  
  // Remove common prefixes and code snippets
  cleanContent = cleanContent.replace(/^(Advanced\s+Kubernetes\s+Health\s+Checks\s+Ai|Ai-Based\s+Kubernetes\s+Scaling|Ai-Driven\s+Kubernetes\s+Management|Api\s+Error\s+Tracking\s+Systems|Url\s+Monitoring\s+Tools|Api\s+Response\s+Time\s+Monitoring\s+Techniques)\s+/i, '')
  cleanContent = cleanContent.replace(/^(Unleashing|Harnessing|Exploring|Understanding|Unlocking)\s+the\s+(Power|Potential|Fundamentals)\s+of\s+/i, '')
  
  // Remove code command snippets that might appear in excerpts
  cleanContent = cleanContent.replace(/bash\s+curl[^\s]*\s+/gi, '')
  cleanContent = cleanContent.replace(/curl\s+-o[^\s]*\s+/gi, '')
  cleanContent = cleanContent.replace(/https?:\/\/[^\s]+\s*/gi, '')
  cleanContent = cleanContent.replace(/Total\s+Time:[^\s]+\s*/gi, '')
  
  // Get first few sentences
  const sentences = cleanContent.split(/[.!?]+\s+/).filter(s => {
    const trimmed = s.trim()
    return trimmed.length > 15 && 
           !trimmed.match(/^(Generated|In today|This article|This guide)/i) &&
           !trimmed.includes('Generated on')
  })
  
  let excerpt = ''
  if (sentences.length > 0) {
    excerpt = sentences[0].trim()
    
    // Add more sentences if needed
    for (let i = 1; i < Math.min(sentences.length, 3); i++) {
      const candidate = (excerpt + ' ' + sentences[i].trim()).trim()
      if (candidate.length <= maxLength - 5) {
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
      } else if (longer.length > minLength) {
        excerpt = longer.substring(0, maxLength - 3).trim()
        const lastSpace = excerpt.lastIndexOf(' ')
        if (lastSpace > minLength) {
          excerpt = excerpt.substring(0, lastSpace) + '...'
        } else {
          excerpt = longer.substring(0, maxLength - 3) + '...'
        }
      }
    }
    
    if (excerpt.length < minLength) {
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

let processed = 0
let errors = 0

filesNeedingFix.forEach(filename => {
  const filePath = path.join(blogDir, filename)
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filename}`)
    return
  }
  
  try {
    let content = fs.readFileSync(filePath, 'utf-8')
    
    // Check if frontmatter exists
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
    if (!frontmatterMatch) {
      console.log(`⚠️  No frontmatter found: ${filename}`)
      return
    }
    
    const frontmatter = frontmatterMatch[1]
    const bodyContent = frontmatterMatch[2]
    
    // Generate clean excerpt from body content
    const cleanExcerpt = generateCleanExcerpt(bodyContent)
    
    // Update excerpt in frontmatter
    const newFrontmatter = frontmatter.replace(
      /excerpt:\s*"[^"]*"/,
      `excerpt: "${cleanExcerpt}"`
    )
    
    // Also fix title if it has "Ai" instead of "AI"
    let fixedFrontmatter = newFrontmatter.replace(/title:\s*"([^"]*)"/, (match, title) => {
      const fixed = title.replace(/\bAi\b/g, 'AI').replace(/\bApi\b/g, 'API').replace(/\bUrl\b/g, 'URL')
      if (fixed !== title && fixed.length <= 43) {
        return `title: "${fixed}"`
      }
      return match
    })
    
    const newContent = `---\n${fixedFrontmatter}\n---\n${bodyContent}`
    fs.writeFileSync(filePath, newContent, 'utf-8')
    
    processed++
    console.log(`✅ Fixed excerpt: ${filename}`)
    
  } catch (error) {
    console.error(`❌ Error processing ${filename}:`, error.message)
    errors++
  }
})

console.log(`\n📊 Summary:`)
console.log(`   ✅ Processed: ${processed}`)
console.log(`   ❌ Errors: ${errors}`)

