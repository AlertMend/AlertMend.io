import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const blogDir = path.join(__dirname, '../public/blog')

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
      let value = doubleQuotedMatch[2]
      // Clean up escaped quotes
      value = value.replace(/\\\\"/g, '"')
      value = value.replace(/\\"/g, '"')
      metadata[doubleQuotedMatch[1]] = value
    } else if (singleQuotedMatch) {
      metadata[singleQuotedMatch[1]] = singleQuotedMatch[2]
    } else if (unquotedMatch) {
      metadata[unquotedMatch[1]] = unquotedMatch[2].trim()
    }
  })
  
  return { metadata, body, frontmatterText }
}

function truncateExcerpt(excerpt, maxLength = 160) {
  if (!excerpt || excerpt.length <= maxLength) return excerpt
  
  // Remove duplicate content (often happens with escaped quotes)
  // Try to detect patterns like: "text"text"text"
  let cleaned = excerpt
  
  // If excerpt is way too long, take first sentence or first part
  if (excerpt.length > maxLength * 2) {
    // Find first sentence
    const firstSentence = excerpt.match(/^[^.!?]+[.!?]/)
    if (firstSentence && firstSentence[0].length <= maxLength) {
      cleaned = firstSentence[0].trim()
    } else {
      // Just take first maxLength chars
      cleaned = excerpt.substring(0, maxLength - 3).trim()
    }
  } else {
    // Truncate intelligently
    cleaned = excerpt.substring(0, maxLength - 3).trim()
    
    // Try to truncate at sentence boundary
    const lastPeriod = cleaned.lastIndexOf('.')
    const lastExclamation = cleaned.lastIndexOf('!')
    const lastQuestion = cleaned.lastIndexOf('?')
    const lastSentence = Math.max(lastPeriod, lastExclamation, lastQuestion)
    
    if (lastSentence >= maxLength * 0.6) {
      cleaned = cleaned.substring(0, lastSentence + 1)
    } else {
      // Try word boundary
      const lastSpace = cleaned.lastIndexOf(' ')
      if (lastSpace >= maxLength * 0.6) {
        cleaned = cleaned.substring(0, lastSpace)
      }
      cleaned += '...'
    }
  }
  
  // Final safety check
  if (cleaned.length > maxLength) {
    cleaned = cleaned.substring(0, maxLength - 3).trim() + '...'
  }
  
  return cleaned
}

function generateExcerpt(body, title, slug) {
  const paragraphs = body
    .split(/\n\s*\n/)
    .filter(p => p.trim().length > 50)
    .filter(p => !p.trim().startsWith('#'))
  
  if (paragraphs.length > 0) {
    let excerpt = paragraphs[0]
      .replace(/\*\*/g, '')
      .replace(/#{1,6}\s+/g, '')
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
      .replace(/`([^`]+)`/g, '$1')
      .trim()
    
    return truncateExcerpt(excerpt, 160)
  }
  
  const cleanTitle = title.replace(/\s*\|\s*AlertMend AI\s*$/, '').toLowerCase()
  return `Learn about ${cleanTitle} and discover expert solutions, best practices, and troubleshooting tips.`
}

function fixTitle(title, slug) {
  if (!title) {
    const stopWords = new Set(['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'from', 'in', 'is', 'it', 'of', 'on', 'or', 'the', 'to', 'vs', 'with'])
    title = slug
      .split('-')
      .map((word, index) => {
        if (word === 'kubernetes') return 'Kubernetes'
        if (word === 'k8s') return 'K8s'
        if (index === 0 || !stopWords.has(word.toLowerCase())) {
          return word.charAt(0).toUpperCase() + word.slice(1)
        }
        return word.toLowerCase()
      })
      .join(' ')
  }
  
  title = title.replace(/\s*\|\s*AlertMend AI\s*$/, '').trim()
  title = title.replace(/Guide Guide/g, 'Guide')
  
  const suffix = ' | AlertMend AI'
  const titleWithSuffix = title + suffix
  const currentLength = titleWithSuffix.length
  
  if (currentLength < 30) {
    if (!title.match(/\b(Guide|Tutorial|Solutions?|Best Practices?)\s*$/i)) {
      if (slug.includes('kubernetes') || slug.includes('k8s')) {
        title += ': Complete Guide'
      } else {
        title += ' Guide'
      }
    }
  } else if (currentLength > 60) {
    const maxLen = 60 - suffix.length
    let truncated = title.substring(0, maxLen)
    const lastSpace = truncated.lastIndexOf(' ')
    if (lastSpace > maxLen * 0.7) {
      truncated = truncated.substring(0, lastSpace)
    }
    title = truncated.trim()
  }
  
  return title
}

function fixFile(filename) {
  const filePath = path.join(blogDir, filename)
  const content = fs.readFileSync(filePath, 'utf-8')
  const parsed = parseFrontmatter(content)
  
  if (!parsed) return false
  
  const { metadata, body } = parsed
  const slug = filename.replace('.md', '')
  let changed = false
  
  // Fix title
  const originalTitle = metadata.title || ''
  const fixedTitle = fixTitle(originalTitle, slug)
  if (fixedTitle !== originalTitle) {
    metadata.title = fixedTitle
    changed = true
  }
  
  // Fix excerpt
  let excerpt = metadata.excerpt || ''
  
  // Clean up excerpt
  excerpt = excerpt.replace(/^["']+|["']+$/g, '')
  excerpt = excerpt.replace(/^\\?"\\?"\\?\\?"/g, '')
  excerpt = excerpt.replace(/\\\\"/g, '"')
  excerpt = excerpt.replace(/\\"/g, '"')
  excerpt = excerpt.trim()
  
  // If excerpt is invalid, generate or fix it
  if (!excerpt || excerpt.length < 50 || excerpt.length > 160) {
    excerpt = generateExcerpt(body, fixedTitle, slug)
    changed = true
  } else {
    // Still clean it up
    const cleaned = truncateExcerpt(excerpt.trim(), 160)
    if (cleaned !== excerpt) {
      excerpt = cleaned
      changed = true
    }
  }
  
  metadata.excerpt = excerpt
  
  if (!changed) return false
  
  // Reconstruct
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
  
  return true
}

// Get all files
const allFiles = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'))

console.log(`Fixing validation issues in ${allFiles.length} files...\n`)

let fixed = 0
allFiles.forEach(file => {
  try {
    if (fixFile(file)) {
      console.log(`✅ Fixed: ${file}`)
      fixed++
    }
  } catch (error) {
    console.log(`❌ Error: ${file} - ${error.message}`)
  }
})

console.log(`\n📊 Fixed ${fixed} files`)

