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
      // Unescape the value
      let value = doubleQuotedMatch[2]
      value = value.replace(/\\"/g, '"')
      value = value.replace(/\\\\/g, '\\')
      metadata[doubleQuotedMatch[1]] = value
    } else if (singleQuotedMatch) {
      metadata[singleQuotedMatch[1]] = singleQuotedMatch[2]
    } else if (unquotedMatch) {
      metadata[unquotedMatch[1]] = unquotedMatch[2].trim()
    }
  })
  
  return { metadata, body, frontmatterText }
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
    
    // Limit to 160 chars
    if (excerpt.length > 160) {
      let truncated = excerpt.substring(0, 157)
      const lastSpace = truncated.lastIndexOf(' ')
      if (lastSpace > 100) {
        truncated = truncated.substring(0, lastSpace)
      }
      excerpt = truncated + '...'
    }
    
    if (excerpt.length >= 50 && excerpt.length <= 160) {
      return excerpt
    }
  }
  
  // Fallback
  const cleanTitle = title.replace(/\s*\|\s*AlertMend AI\s*$/, '').toLowerCase()
  return `Learn about ${cleanTitle} and discover expert solutions, best practices, and troubleshooting tips for effective implementation.`
}

function fixFile(filename) {
  const filePath = path.join(blogDir, filename)
  const content = fs.readFileSync(filePath, 'utf-8')
  const parsed = parseFrontmatter(content)
  
  if (!parsed) return false
  
  const { metadata, body, frontmatterText } = parsed
  const slug = filename.replace('.md', '')
  let changed = false
  let newMetadata = { ...metadata }
  
  // Fix title - remove duplicate "Guide Guide"
  if (metadata.title) {
    let title = metadata.title.replace(/\s*\|\s*AlertMend AI\s*$/, '').trim()
    title = title.replace(/Guide Guide/g, 'Guide')
    
    // Ensure title is 30-60 chars with suffix
    const suffix = ' | AlertMend AI'
    const titleWithSuffix = title + suffix
    
    if (titleWithSuffix.length < 30) {
      if (!title.includes('Guide') && !title.includes('Tutorial')) {
        title += ' Guide'
      }
    } else if (titleWithSuffix.length > 60) {
      const maxLen = 60 - suffix.length
      let truncated = title.substring(0, maxLen)
      const lastSpace = truncated.lastIndexOf(' ')
      if (lastSpace > maxLen * 0.7) {
        truncated = truncated.substring(0, lastSpace)
      }
      title = truncated.trim()
    }
    
    if (title !== metadata.title) {
      newMetadata.title = title
      changed = true
    }
  }
  
  // Fix excerpt
  let excerpt = metadata.excerpt || ''
  
  // Clean up escaped quotes and weird characters
  excerpt = excerpt.replace(/^["']+|["']+$/g, '') // Remove surrounding quotes
  excerpt = excerpt.replace(/^\\?"\\?"\\?\\?"/g, '') // Remove leading escaped quotes
  excerpt = excerpt.replace(/\\\\"/g, '"') // Fix escaped quotes
  excerpt = excerpt.replace(/\\"/g, '"') // Fix escaped quotes
  excerpt = excerpt.trim()
  
  // If excerpt is invalid, generate new one
  if (!excerpt || excerpt.length < 50 || excerpt.length > 160) {
    excerpt = generateExcerpt(body, newMetadata.title || metadata.title || slug, slug)
    changed = true
  } else {
    // Just clean it up but keep it if it's valid
    const cleaned = excerpt.trim()
    if (cleaned !== metadata.excerpt) {
      excerpt = cleaned
      changed = true
    }
  }
  
  newMetadata.excerpt = excerpt
  
  if (!changed) return false
  
  // Reconstruct frontmatter
  const newFrontmatter = `---
title: "${newMetadata.title.replace(/"/g, '\\"')}"
excerpt: "${newMetadata.excerpt.replace(/"/g, '\\"')}"
date: "${newMetadata.date || new Date().toISOString().split('T')[0]}"
category: "${newMetadata.category || 'Kubernetes'}"
author: "${newMetadata.author || 'AlertMend Team'}"
${newMetadata.keywords ? `keywords: "${newMetadata.keywords.replace(/"/g, '\\"')}"` : ''}
---`
  
  const newContent = `${newFrontmatter}\n\n${body}`
  fs.writeFileSync(filePath, newContent, 'utf-8')
  
  return true
}

// Get list of files with issues from build output
const problemFiles = [
  'code-exited-status-1failure解决.md',
  'codoor.md',
  'error-command-failed-with-exit-code-137.md',
  'error-runtime-exited-with-error-signal-killed-runtime.exiterror.md',
  'opa-test.md',
  'kubernetes-for-dummies-pdf-1.md',
  'unable-to-merge-unrelated-histories-in-this-repository.md',
]

let fixed = 0
problemFiles.forEach(file => {
  if (fixFile(file)) {
    console.log(`✅ Fixed: ${file}`)
    fixed++
  }
})

console.log(`\nFixed ${fixed} files`)

