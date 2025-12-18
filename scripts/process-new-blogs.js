import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const newBlogsDir = path.join(__dirname, '../new_blogs/md_files')
const publicBlogDir = path.join(__dirname, '../public/blog')

// Ensure public/blog directory exists
if (!fs.existsSync(publicBlogDir)) {
  fs.mkdirSync(publicBlogDir, { recursive: true })
}

// Get existing blog slugs to avoid duplicates
const existingBlogs = new Set()
if (fs.existsSync(publicBlogDir)) {
  const files = fs.readdirSync(publicBlogDir)
  files.forEach(file => {
    if (file.endsWith('.md')) {
      existingBlogs.add(file.replace('.md', ''))
    }
  })
}

console.log(`Found ${existingBlogs.size} existing blogs in public/blog`)

// Function to extract title from content
function extractTitle(content) {
  // Try to find H1 title
  const h1Match = content.match(/^#\s+(.+)$/m)
  if (h1Match) {
    return h1Match[1].trim()
  }
  
  // Try to find first H2 as title
  const h2Match = content.match(/^##\s+(.+)$/m)
  if (h2Match) {
    return h2Match[1].trim()
  }
  
  return null
}

// Function to generate excerpt from content
function generateExcerpt(content, title) {
  // Remove markdown headers and code blocks for excerpt
  let text = content
    .replace(/^#{1,6}\s+.+$/gm, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]+`/g, '')
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    .replace(/[*_]{1,2}([^*_]+)[*_]{1,2}/g, '$1')
    .replace(/\n+/g, ' ')
    .trim()
  
  // Find first substantial paragraph (at least 50 chars)
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20)
  if (sentences.length > 0) {
    let excerpt = sentences[0].trim()
    if (sentences.length > 1 && excerpt.length < 100) {
      excerpt += '. ' + sentences[1].trim()
    }
    // Limit to 160 characters
    if (excerpt.length > 160) {
      excerpt = excerpt.substring(0, 157) + '...'
    }
    return excerpt
  }
  
  // Fallback: use title with context
  return `Learn about ${title.toLowerCase()} and how to effectively manage it in your infrastructure.`
}

// Function to determine category from title/content
function determineCategory(title, content) {
  const titleLower = title.toLowerCase()
  const contentLower = content.toLowerCase()
  
  if (titleLower.includes('kubernetes') || titleLower.includes('k8s') || 
      contentLower.includes('kubernetes') || contentLower.includes('kubectl')) {
    return 'Kubernetes'
  }
  if (titleLower.includes('elasticsearch')) {
    return 'Elasticsearch'
  }
  if (titleLower.includes('exit code') || titleLower.includes('error') || 
      titleLower.includes('fatal') || titleLower.includes('troubleshooting')) {
    return 'Troubleshooting'
  }
  if (titleLower.includes('git') || titleLower.includes('github') || 
      titleLower.includes('repository')) {
    return 'DevOps'
  }
  if (titleLower.includes('cost') || titleLower.includes('optimization') || 
      titleLower.includes('resource optimization')) {
    return 'Cost Optimization'
  }
  if (titleLower.includes('argocd') || titleLower.includes('jenkins') || 
      titleLower.includes('ci/cd') || titleLower.includes('deployment')) {
    return 'DevOps'
  }
  if (titleLower.includes('ssl') || titleLower.includes('certificate') || 
      titleLower.includes('tls')) {
    return 'Security'
  }
  
  return 'Kubernetes' // Default category
}

// Function to generate keywords from title and content
function generateKeywords(title, category) {
  const titleWords = title.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 3)
    .slice(0, 5)
  
  const baseKeywords = [category, 'AlertMend AI', 'AIOps']
  
  // Add relevant keywords based on category
  if (category === 'Kubernetes') {
    baseKeywords.push('container orchestration', 'DevOps')
  } else if (category === 'Troubleshooting') {
    baseKeywords.push('error resolution', 'system monitoring')
  }
  
  return [...new Set([...titleWords, ...baseKeywords])].join(', ')
}

// Function to clean content
function cleanContent(content, filename) {
  let cleaned = content
  
  // Skip files that are entirely reference content (they need manual rewriting)
  if (cleaned.includes('REFERENCE CONTENT FROM TOP 5 GOOGLE SEARCH RESULTS')) {
    // Check if there's any original content before the reference section
    const refStart = cleaned.indexOf('REFERENCE CONTENT FROM TOP 5 GOOGLE SEARCH RESULTS')
    const beforeRef = cleaned.substring(0, refStart).trim()
    
    // If there's minimal content before references, skip this file (return null)
    if (beforeRef.length < 200) {
      return null // Signal to skip this file
    }
    
    // If there's substantial content before, use it
    cleaned = beforeRef
  }
  
  // Remove markdown code blocks that wrap the entire content (like in 503-no-healthy-upstream.md)
  cleaned = cleaned.replace(/^```markdown\n/gm, '')
  cleaned = cleaned.replace(/^```\n?$/gm, '')
  
  // Clean up excessive separators
  cleaned = cleaned.replace(/={3,}/g, '')
  cleaned = cleaned.replace(/-{3,}/g, '---')
  
  // Remove source attribution blocks
  cleaned = cleaned.replace(/SOURCE \d+:.*?\n/g, '')
  
  // Ensure there's a proper H1 title at the start
  if (!cleaned.trim().startsWith('#')) {
    // Try to extract title from first line or use filename
    const firstLine = cleaned.split('\n')[0].trim()
    if (firstLine && !firstLine.match(/^#/)) {
      // Add H1 if not present
      const title = extractTitle(cleaned) || firstLine
      cleaned = `# ${title}\n\n${cleaned}`
    }
  }
  
  return cleaned.trim()
}

// Main processing function
function processBlogFile(filePath) {
  try {
    const filename = path.basename(filePath)
    const slug = filename.replace('.md', '').toLowerCase()
    
    // Skip if already exists
    if (existingBlogs.has(slug)) {
      return { status: 'skipped', slug, reason: 'already exists' }
    }
    
    // Read file content
    let content = fs.readFileSync(filePath, 'utf-8')
    
    // Clean content (returns null if file should be skipped)
    content = cleanContent(content, filename)
    if (content === null) {
      return { status: 'skipped', slug, reason: 'reference content only - needs manual rewrite' }
    }
    
    // Extract or generate title
    let title = extractTitle(content)
    if (!title) {
      // Fallback to filename-based title
      const stopWords = new Set(['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'from', 'in', 'is', 'it', 'of', 'on', 'or', 'the', 'to', 'vs', 'with'])
      title = slug
        .split('-')
        .map((word, index) => {
          // Capitalize first word and words not in stop words list
          if (index === 0 || !stopWords.has(word.toLowerCase())) {
            return word.charAt(0).toUpperCase() + word.slice(1)
          }
          return word.toLowerCase()
        })
        .join(' ')
    } else {
      // Clean up title - capitalize properly
      title = title.trim()
      // If title is all lowercase or has weird casing, fix it
      if (title === title.toLowerCase() || title.includes('kubernetes') || title.includes('exit code')) {
        const stopWords = new Set(['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'from', 'in', 'is', 'it', 'of', 'on', 'or', 'the', 'to', 'vs', 'with'])
        title = title
          .split(/\s+/)
          .map((word, index) => {
            // Capitalize first word and important words
            if (index === 0 || !stopWords.has(word.toLowerCase())) {
              // Handle special cases
              if (word.toLowerCase() === 'kubernetes') return 'Kubernetes'
              if (word.toLowerCase() === 'k8s') return 'K8s'
              if (word.toLowerCase() === 'argocd') return 'ArgoCD'
              if (word.toLowerCase() === 'jenkins') return 'Jenkins'
              if (word.toLowerCase() === 'aws' || word.toLowerCase() === 'eks') return word.toUpperCase()
              return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            }
            return word.toLowerCase()
          })
          .join(' ')
      }
    }
    
    // Remove the H1 from content (we'll keep it but frontmatter has the title)
    content = content.replace(/^#\s+.+$/m, '').trim()
    
    // Generate metadata
    const category = determineCategory(title, content)
    const excerpt = generateExcerpt(content, title)
    const keywords = generateKeywords(title, category)
    const date = new Date().toISOString().split('T')[0] // Today's date
    const author = 'AlertMend Team'
    
    // Create frontmatter
    const frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
excerpt: "${excerpt.replace(/"/g, '\\"')}"
date: "${date}"
category: "${category}"
author: "${author}"
keywords: "${keywords}"
---`
    
    // Reconstruct markdown with H1 title
    const markdown = `${frontmatter}\n\n# ${title}\n\n${content}\n`
    
    // Write to public/blog
    const outputPath = path.join(publicBlogDir, filename)
    fs.writeFileSync(outputPath, markdown, 'utf-8')
    
    return { status: 'added', slug, title }
  } catch (error) {
    return { status: 'error', slug: path.basename(filePath), error: error.message }
  }
}

// Process all files
console.log(`\nProcessing files from ${newBlogsDir}...\n`)

if (!fs.existsSync(newBlogsDir)) {
  console.error(`Error: Directory ${newBlogsDir} does not exist`)
  process.exit(1)
}

const files = fs.readdirSync(newBlogsDir)
  .filter(file => file.endsWith('.md'))
  .map(file => path.join(newBlogsDir, file))

console.log(`Found ${files.length} markdown files to process\n`)

const results = {
  added: [],
  skipped: [],
  errors: []
}

files.forEach(filePath => {
  const result = processBlogFile(filePath)
  if (result.status === 'added') {
    console.log(`✅ Added: ${result.slug} - ${result.title}`)
    results.added.push(result)
  } else if (result.status === 'skipped') {
    console.log(`⏭️  Skipped: ${result.slug} (${result.reason})`)
    results.skipped.push(result)
  } else {
    console.log(`❌ Error: ${result.slug} - ${result.error}`)
    results.errors.push(result)
  }
})

console.log(`\n📊 Summary:`)
console.log(`   ✅ Added: ${results.added.length}`)
console.log(`   ⏭️  Skipped: ${results.skipped.length}`)
console.log(`   ❌ Errors: ${results.errors.length}`)
console.log(`   📝 Total processed: ${files.length}`)

