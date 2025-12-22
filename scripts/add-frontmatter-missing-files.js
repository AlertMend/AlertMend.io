import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const blogDir = path.join(__dirname, '../public/blog')

// Files that need frontmatter added
const filesToFix = [
  'ai-driven-it-operations-management.md',
  'aiops-for-predictive-analytics-in-devops.md',
  'aiops-implementation-strategies.md',
  'aiops-integration-with-existing-it-workflows.md',
  'aiops-solutions-for-alerting-systems.md',
  'automating-certificate-renewal-in-kubernetes.md',
  'best-practices-for-certificate-manager-kubernetes.md',
  'certificate-manager-kubernetes-setup-guide.md',
  'certificate-manager-kubernetes-tutorial.md',
  'cloud-infrastructure-kubernetes-v1350.md',
  'cloud-infrastructure-monitoring-with-aiops.md',
  'devops-automation-using-aiops-tools.md',
  'devops-with-kubernetes-v1350.md',
  'kubernetes-certificate-expiration-monitoring.md',
  'kubernetes-certificate-manager-integration.md',
  'kubernetes-ingress-certificate-configuration.md',
  'kubernetes-ssl-certificate-management.md',
  'kubernetes-stable-version-benefits.md',
  'kubernetes-v1350-alerting-setup.md',
  'kubernetes-v1350-deployment-strategies.md',
  'kubernetes-v1350-features-overview.md',
  'kubernetes-v1350-monitoring-tools.md',
  'machine-learning-in-cloud-infrastructure-monitoring.md',
  'real-time-system-monitoring-with-aiops.md',
  'secure-kubernetes-with-certificate-manager.md',
  'timbernetes-kubernetes-scaling-solutions.md',
  'timbernetes-kubernetes-upgrade-guide.md',
  'timbernetes-system-monitoring-integration.md',
  'troubleshooting-kubernetes-certificate-manager-issues.md',
  'using-aiops-to-enhance-network-performance.md'
]

// Function to convert slug to Title Case
function toTitleCase(str) {
  if (!str) return ''
  return str.replace(/-/g, ' ')
            .split(' ')
            .map(word => {
              const smallWords = new Set(['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'in', 'nor', 'of', 'on', 'or', 'so', 'the', 'to', 'up', 'yet', 'vs', 'it'])
              if (smallWords.has(word.toLowerCase())) {
                return word.toLowerCase()
              }
              return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            })
            .join(' ')
            .replace(/^(.)|\s(.)/g, c => c.toUpperCase())
}

// Function to generate excerpt from content
function generateExcerpt(content, minLength = 50, maxLength = 160) {
  // Remove frontmatter if present
  content = content.replace(/^---\n[\s\S]*?\n---\n/, '')
  
  const cleanContent = content
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/<[^>]+>/g, '') // Remove HTML tags
    .replace(/[#*`]/g, '') // Remove markdown formatting
    .replace(/\*Generated on.*\*/g, '') // Remove generated dates
    .replace(/---/g, '') // Remove separators
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .trim()

  let excerpt = cleanContent.substring(0, maxLength)
  // Try to end at a sentence boundary
  const lastPeriod = excerpt.lastIndexOf('.')
  if (lastPeriod > minLength) {
    excerpt = excerpt.substring(0, lastPeriod + 1)
  } else {
    // If no good sentence boundary, truncate at word boundary
    const lastSpace = excerpt.lastIndexOf(' ')
    if (lastSpace > minLength) {
      excerpt = excerpt.substring(0, lastSpace) + '...'
    } else if (excerpt.length > minLength) {
      excerpt += '...'
    }
  }
  
  if (excerpt.length < minLength) {
    const fallback = cleanContent.substring(0, Math.min(cleanContent.length, maxLength))
    if (fallback.length >= minLength) {
      excerpt = fallback + '...'
    } else {
      excerpt = "A comprehensive guide on " + cleanContent.substring(0, Math.min(cleanContent.length, 40)) + "..."
    }
  }
  
  return excerpt.trim().substring(0, maxLength)
}

// Function to extract H1 heading
function extractH1(content) {
  const h1Match = content.match(/^#\s+(.+)$/m)
  return h1Match ? h1Match[1].trim() : null
}

// Function to determine category
function determineCategory(filename, content) {
  const lowerContent = content.toLowerCase()
  const lowerFilename = filename.toLowerCase()
  
  if (lowerFilename.includes('kubernetes') || lowerContent.includes('kubernetes') || lowerContent.includes('k8s') || lowerContent.includes('pod') || lowerContent.includes('container')) {
    return 'Kubernetes'
  }
  if (lowerContent.includes('aiops') || lowerContent.includes('ai-driven') || lowerContent.includes('ai agent')) {
    return 'AIOps'
  }
  if (lowerContent.includes('devops') || lowerContent.includes('git') || lowerContent.includes('ci/cd')) {
    return 'DevOps'
  }
  if (lowerFilename.includes('certificate') || lowerFilename.includes('ssl') || lowerFilename.includes('tls')) {
    return 'Kubernetes'
  }
  return 'DevOps'
}

// Function to generate keywords
function generateKeywords(title, category, content) {
  const keywords = new Set(['AlertMend AI'])
  
  if (category) {
    keywords.add(category)
  }
  
  // Add AIOps or DevOps
  if (category === 'AIOps' || content.toLowerCase().includes('aiops')) {
    keywords.add('AIOps')
  }
  if (category === 'DevOps' || content.toLowerCase().includes('devops')) {
    keywords.add('DevOps')
  }
  
  // Add Kubernetes if relevant
  if (category === 'Kubernetes' || content.toLowerCase().includes('kubernetes')) {
    keywords.add('Kubernetes')
  }
  
  // Extract key terms from title
  const titleWords = title.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/)
  titleWords.forEach(word => {
    if (word.length > 3 && word !== 'with' && word !== 'from' && word !== 'this') {
      keywords.add(word.charAt(0).toUpperCase() + word.slice(1))
    }
  })
  
  return Array.from(keywords).slice(0, 10).join(', ')
}

// Process files
let fixedCount = 0

for (const filename of filesToFix) {
  const filePath = path.join(blogDir, filename)
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filename}`)
    continue
  }
  
  try {
    let content = fs.readFileSync(filePath, 'utf-8')
    
    // Check if frontmatter already exists
    if (content.trim().startsWith('---')) {
      console.log(`✓ ${filename} already has frontmatter`)
      continue
    }
    
    // Extract H1 for title
    const h1Title = extractH1(content) || toTitleCase(filename.replace('.md', ''))
    
    // Generate title (ensure it's not too long - max 43 chars without suffix)
    let title = h1Title.replace(/^\#\s*/, '').trim()
    if (title.length > 43) {
      // Truncate at word boundary
      const words = title.split(' ')
      title = words[0]
      for (let i = 1; i < words.length; i++) {
        if ((title + ' ' + words[i]).length <= 43) {
          title += ' ' + words[i]
        } else {
          break
        }
      }
    }
    
    // Generate excerpt
    const excerpt = generateExcerpt(content)
    
    // Determine category
    const category = determineCategory(filename, content)
    
    // Generate keywords
    const keywords = generateKeywords(title, category, content)
    
    // Create frontmatter
    const frontmatter = `---
title: "${title}"
excerpt: "${excerpt}"
date: "${new Date().toISOString().split('T')[0]}"
category: "${category}"
author: "AlertMend Team"
keywords: "${keywords}"
---

`
    
    // Remove "Generated on" lines if present
    content = content.replace(/\*Generated on.*\*/g, '').trim()
    
    // Remove leading separator lines
    content = content.replace(/^---+\s*\n+/gm, '').trim()
    
    // Combine frontmatter with content
    const newContent = frontmatter + content
    
    fs.writeFileSync(filePath, newContent, 'utf-8')
    console.log(`✅ Fixed ${filename}`)
    fixedCount++
  } catch (error) {
    console.error(`❌ Error processing ${filename}:`, error.message)
  }
}

console.log(`\n✅ Fixed ${fixedCount} files with frontmatter`)

