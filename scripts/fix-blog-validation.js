import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const blogDir = path.join(__dirname, '../public/blog')

// SEO validation rules
const SEO_RULES = {
  titleMinLength: 30,
  titleMaxLength: 60,
  descriptionMinLength: 50,
  descriptionMaxLength: 160,
  suffix: ' | AlertMend AI',
  suffixLength: 17,
}

// Parse frontmatter
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) return null
  
  const frontmatterText = match[1]
  const body = match[2]
  
  const metadata = {}
  frontmatterText.split('\n').forEach((line) => {
    const trimmed = line.trim()
    if (!trimmed) return
    
    const keywordsMatch = trimmed.match(/^keywords:\s*["'](.+)["']$/)
    if (keywordsMatch) {
      metadata.keywords = keywordsMatch[1]
      return
    }
    
    const doubleQuotedMatch = trimmed.match(/^(\w+):\s*"([^"]*)"$/)
    const singleQuotedMatch = trimmed.match(/^(\w+):\s*'([^']*)'$/)
    const unquotedMatch = trimmed.match(/^(\w+):\s*(.+)$/)
    
    if (doubleQuotedMatch) {
      metadata[doubleQuotedMatch[1]] = doubleQuotedMatch[2]
    } else if (singleQuotedMatch) {
      metadata[singleQuotedMatch[1]] = singleQuotedMatch[2]
    } else if (unquotedMatch) {
      metadata[unquotedMatch[1]] = unquotedMatch[2].trim()
    }
  })
  
  return { metadata, body, frontmatterText }
}

// Fix title length
function fixTitle(title, slug) {
  if (!title) {
    // Generate from slug
    const stopWords = new Set(['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'from', 'in', 'is', 'it', 'of', 'on', 'or', 'the', 'to', 'vs', 'with'])
    title = slug
      .split('-')
      .map((word, index) => {
        if (word === 'kubernetes') return 'Kubernetes'
        if (word === 'k8s') return 'K8s'
        if (word === 'argocd') return 'ArgoCD'
        if (word === 'jenkins') return 'Jenkins'
        if (word === 'aws' || word === 'eks' || word === 'gke' || word === 'aks') return word.toUpperCase()
        if (index === 0 || !stopWords.has(word.toLowerCase())) {
          return word.charAt(0).toUpperCase() + word.slice(1)
        }
        return word.toLowerCase()
      })
      .join(' ')
    
    // Add descriptive suffix if needed
    if (title.length < 15) {
      if (slug.includes('kubernetes') || slug.includes('k8s')) {
        title += ': Complete Guide'
      } else if (slug.includes('error') || slug.includes('troubleshoot')) {
        title += ': Troubleshooting Guide'
      } else {
        title += ' Guide'
      }
    }
  }
  
  // Remove suffix if present
  title = title.replace(/\s*\|\s*AlertMend AI\s*$/, '').trim()
  
  // Don't add "Guide" if it already ends with "Guide"
  const alreadyHasGuide = /\b(Guide|Tutorial|Solutions?|Best Practices?)\s*$/i.test(title)
  
  // Check length with suffix
  const titleWithSuffix = title + SEO_RULES.suffix
  const currentLength = titleWithSuffix.length
  
  if (currentLength < SEO_RULES.titleMinLength) {
    // Too short - add descriptive text (but don't duplicate)
    if (!alreadyHasGuide) {
      if (slug.includes('kubernetes') || slug.includes('k8s')) {
        title += ': Complete Guide'
      } else if (slug.includes('error') || slug.includes('troubleshoot') || slug.includes('fix')) {
        title += ': How to Fix'
      } else {
        title += ' Guide'
      }
    }
  } else if (currentLength > SEO_RULES.titleMaxLength) {
    // Too long - truncate intelligently
    const maxTitleLength = SEO_RULES.titleMaxLength - SEO_RULES.suffixLength
    let truncated = title.substring(0, maxTitleLength)
    
    // Try to truncate at word boundary
    const lastSpace = truncated.lastIndexOf(' ')
    if (lastSpace > maxTitleLength * 0.7) {
      truncated = truncated.substring(0, lastSpace)
    }
    
    // Remove trailing punctuation
    truncated = truncated.replace(/[.,;:!?\-—–\s]+$/, '').trim()
    title = truncated
  }
  
  return title
}

// Fix excerpt length
function fixExcerpt(excerpt, title, slug, body) {
  if (!excerpt || excerpt.length < SEO_RULES.descriptionMinLength) {
    // Generate from body
    const paragraphs = body
      .split(/\n\s*\n/)
      .filter(p => p.trim().length > 50)
      .filter(p => !p.trim().startsWith('#'))
    
    if (paragraphs.length > 0) {
      excerpt = paragraphs[0]
        .replace(/\*\*/g, '')
        .replace(/#{1,6}\s+/g, '')
        .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
        .replace(/`([^`]+)`/g, '$1')
        .trim()
    }
    
    if (!excerpt || excerpt.length < SEO_RULES.descriptionMinLength) {
      // Fallback
      excerpt = `Learn about ${title.toLowerCase().replace(/\s*\|\s*AlertMend AI\s*$/, '')} and discover expert solutions, best practices, and troubleshooting tips.`
    }
  }
  
  // Truncate if too long (be strict - must be <= 160)
  if (excerpt.length > SEO_RULES.descriptionMaxLength) {
    // Start with max length minus ellipsis
    let truncated = excerpt.substring(0, SEO_RULES.descriptionMaxLength - 3)
    
    // Try to truncate at sentence boundary
    const lastPeriod = truncated.lastIndexOf('.')
    const lastExclamation = truncated.lastIndexOf('!')
    const lastQuestion = truncated.lastIndexOf('?')
    const lastSentence = Math.max(lastPeriod, lastExclamation, lastQuestion)
    
    if (lastSentence >= SEO_RULES.descriptionMaxLength * 0.65) {
      truncated = truncated.substring(0, lastSentence + 1)
    } else {
      // Try word boundary
      const lastSpace = truncated.lastIndexOf(' ')
      if (lastSpace >= SEO_RULES.descriptionMaxLength * 0.65) {
        truncated = truncated.substring(0, lastSpace)
      }
      truncated += '...'
    }
    
    excerpt = truncated.trim()
    
    // Final check - if still too long, hard truncate
    if (excerpt.length > SEO_RULES.descriptionMaxLength) {
      excerpt = excerpt.substring(0, SEO_RULES.descriptionMaxLength - 3).trim() + '...'
    }
  }
  
  return excerpt
}

// Fix a blog file
function fixBlogFile(filename) {
  const filePath = path.join(blogDir, filename)
  const content = fs.readFileSync(filePath, 'utf-8')
  const parsed = parseFrontmatter(content)
  
  if (!parsed) {
    return { fixed: false, error: 'Could not parse frontmatter' }
  }
  
  const { metadata, body, frontmatterText } = parsed
  const slug = filename.replace('.md', '')
  
  let needsFix = false
  const changes = []
  
  // Fix title
  const originalTitle = metadata.title || ''
  const fixedTitle = fixTitle(originalTitle, slug)
  if (fixedTitle !== originalTitle) {
    metadata.title = fixedTitle
    needsFix = true
    changes.push(`Title: "${originalTitle}" → "${fixedTitle}"`)
  }
  
  // Fix excerpt
  const originalExcerpt = metadata.excerpt || ''
  const fixedExcerpt = fixExcerpt(originalExcerpt, fixedTitle, slug, body)
  if (fixedExcerpt !== originalExcerpt) {
    metadata.excerpt = fixedExcerpt
    needsFix = true
    changes.push(`Excerpt: ${originalExcerpt.length} → ${fixedExcerpt.length} chars`)
  }
  
  if (!needsFix) {
    return { fixed: false, changes: [] }
  }
  
  // Reconstruct frontmatter
  const newFrontmatter = `---
title: "${metadata.title.replace(/"/g, '\\"')}"
excerpt: "${metadata.excerpt.replace(/"/g, '\\"')}"
date: "${metadata.date || new Date().toISOString().split('T')[0]}"
category: "${metadata.category || 'Kubernetes'}"
author: "${metadata.author || 'AlertMend Team'}"
${metadata.keywords ? `keywords: "${metadata.keywords.replace(/"/g, '\\"')}"` : ''}
---`
  
  const newContent = `${newFrontmatter}\n\n${body}`
  fs.writeFileSync(filePath, newContent, 'utf-8')
  
  return { fixed: true, changes }
}

// Main execution
const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'))

console.log(`Fixing validation issues in ${files.length} blog files...\n`)

let fixedCount = 0
let totalChanges = 0

files.forEach(filename => {
  try {
    const result = fixBlogFile(filename)
    if (result.fixed) {
      console.log(`✅ Fixed: ${filename}`)
      result.changes.forEach(change => console.log(`   ${change}`))
      fixedCount++
      totalChanges += result.changes.length
    }
  } catch (error) {
    console.log(`❌ Error fixing ${filename}: ${error.message}`)
  }
})

console.log(`\n📊 Summary:`)
console.log(`   Files fixed: ${fixedCount}`)
console.log(`   Total changes: ${totalChanges}`)
console.log(`   Files checked: ${files.length}`)

