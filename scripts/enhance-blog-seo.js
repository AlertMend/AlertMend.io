import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const blogDir = path.join(__dirname, '../public/blog')

// Read a blog file
function readBlogFile(filename) {
  const filePath = path.join(blogDir, filename)
  return fs.readFileSync(filePath, 'utf-8')
}

// Write a blog file
function writeBlogFile(filename, content) {
  const filePath = path.join(blogDir, filename)
  fs.writeFileSync(filePath, content, 'utf-8')
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
  
  return { metadata, body }
}

// Generate better title from slug
function generateBetterTitle(slug, currentTitle) {
  // If title is already good, return it
  if (currentTitle && currentTitle.length > 20 && !currentTitle.toLowerCase().startsWith(slug)) {
    return currentTitle
  }
  
  const stopWords = new Set(['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'from', 'in', 'is', 'it', 'of', 'on', 'or', 'the', 'to', 'vs', 'with'])
  
  let title = slug
    .split('-')
    .map((word, index) => {
      // Handle special cases
      if (word === 'kubernetes') return 'Kubernetes'
      if (word === 'k8s') return 'K8s'
      if (word === 'argocd') return 'ArgoCD'
      if (word === 'jenkins') return 'Jenkins'
      if (word === 'aws' || word === 'eks' || word === 'gke' || word === 'aks') return word.toUpperCase()
      if (word === 'vs') return 'vs'
      
      // Capitalize first word and words not in stop words
      if (index === 0 || !stopWords.has(word.toLowerCase())) {
        return word.charAt(0).toUpperCase() + word.slice(1)
      }
      return word.toLowerCase()
    })
    .join(' ')
  
  // Add descriptive suffix if title is too short
  if (title.length < 30) {
    if (slug.includes('kubernetes') || slug.includes('k8s')) {
      title += ': Complete Guide and Best Practices'
    } else if (slug.includes('error') || slug.includes('troubleshoot')) {
      title += ': How to Fix and Resolve'
    } else if (slug.includes('vs') || slug.includes('comparison')) {
      title += ': Comprehensive Comparison Guide'
    } else {
      title += ': Complete Guide'
    }
  }
  
  return title
}

// Generate better excerpt
function generateBetterExcerpt(title, body, category) {
  // Extract first meaningful paragraph
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
    
    // Limit to 160 characters
    if (excerpt.length > 160) {
      excerpt = excerpt.substring(0, 157) + '...'
    }
    return excerpt
  }
  
  // Fallback excerpt
  return `Learn about ${title.toLowerCase()} and discover expert solutions, best practices, and troubleshooting tips for effective implementation.`
}

// Generate better keywords
function generateBetterKeywords(title, slug, category, existingKeywords) {
  const keywords = new Set()
  
  // Add category and base terms
  keywords.add(category)
  keywords.add('AlertMend AI')
  keywords.add('AIOps')
  
  // Extract important words from title and slug
  const words = (title + ' ' + slug)
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 3)
    .filter(w => !['complete', 'guide', 'best', 'practices', 'how', 'what', 'when', 'where', 'which'].includes(w))
  
  words.slice(0, 8).forEach(w => keywords.add(w))
  
  // Add relevant terms based on category
  if (category === 'Kubernetes') {
    keywords.add('container orchestration')
    keywords.add('DevOps')
    keywords.add('cloud native')
  } else if (category === 'Troubleshooting') {
    keywords.add('error resolution')
    keywords.add('system monitoring')
    keywords.add('debugging')
  } else if (category === 'Cost Optimization') {
    keywords.add('cloud cost management')
    keywords.add('resource optimization')
  }
  
  // Add terms from existing keywords if provided
  if (existingKeywords) {
    existingKeywords.split(',').forEach(k => keywords.add(k.trim()))
  }
  
  return Array.from(keywords).join(', ')
}

console.log('Blog SEO Enhancement Tool')
console.log('This tool enhances blog post titles, excerpts, and keywords for better SEO')
console.log('')

// Get list of files to process
const files = process.argv.slice(2)

if (files.length === 0) {
  console.log('Usage: node enhance-blog-seo.js <filename1.md> [filename2.md] ...')
  console.log('Example: node enhance-blog-seo.js exit-code-5.md 503-no-healthy-upstream.md')
  process.exit(1)
}

let processed = 0
let updated = 0

files.forEach(filename => {
  if (!filename.endsWith('.md')) {
    console.log(`⏭️  Skipping ${filename} (not a .md file)`)
    return
  }
  
  try {
    const content = readBlogFile(filename)
    const parsed = parseFrontmatter(content)
    
    if (!parsed) {
      console.log(`❌ Error: ${filename} - Could not parse frontmatter`)
      return
    }
    
    const { metadata, body } = parsed
    const slug = filename.replace('.md', '')
    
    // Generate enhanced metadata
    const betterTitle = generateBetterTitle(slug, metadata.title)
    const betterExcerpt = generateBetterExcerpt(metadata.title || betterTitle, body, metadata.category)
    const betterKeywords = generateBetterKeywords(betterTitle, slug, metadata.category, metadata.keywords)
    
    // Check if updates are needed
    const needsUpdate = 
      metadata.title !== betterTitle ||
      (metadata.excerpt && metadata.excerpt.length < 100) ||
      (metadata.keywords && metadata.keywords.split(',').length < 5)
    
    if (needsUpdate) {
      // Update frontmatter
      const newFrontmatter = `---
title: "${betterTitle.replace(/"/g, '\\"')}"
excerpt: "${betterExcerpt.replace(/"/g, '\\"')}"
date: "${metadata.date || new Date().toISOString().split('T')[0]}"
category: "${metadata.category || 'Kubernetes'}"
author: "${metadata.author || 'AlertMend Team'}"
keywords: "${betterKeywords}"
---`
      
      const newContent = `${newFrontmatter}\n\n${body}`
      writeBlogFile(filename, newContent)
      
      console.log(`✅ Enhanced: ${filename}`)
      console.log(`   Title: "${metadata.title}" → "${betterTitle}"`)
      updated++
    } else {
      console.log(`✓ Already optimized: ${filename}`)
    }
    
    processed++
  } catch (error) {
    console.log(`❌ Error processing ${filename}: ${error.message}`)
  }
})

console.log('')
console.log(`📊 Summary: ${processed} processed, ${updated} updated`)

