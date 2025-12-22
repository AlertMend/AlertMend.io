import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const blogDir = path.join(__dirname, '../public/blog')

// Function to convert a string to Title Case
function toTitleCase(str) {
  if (!str) return ''
  return str.replace(/-/g, ' ')
            .split(' ')
            .map(word => {
              // List of common small words to keep lowercase unless it's the first word
              const smallWords = new Set(['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'in', 'nor', 'of', 'on', 'or', 'so', 'the', 'to', 'up', 'yet', 'vs'])
              if (smallWords.has(word.toLowerCase())) {
                return word.toLowerCase()
              }
              return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            })
            .join(' ')
            .replace(/^(.)|\s(.)/g, c => c.toUpperCase()); // Ensure first letter of each word is capitalized
}

// Function to generate a simple excerpt from content
function generateExcerpt(content, minLength = 50, maxLength = 160) {
  const cleanContent = content
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/<[^>]+>/g, '') // Remove HTML tags
    .replace(/[#*`]/g, '') // Remove markdown formatting
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
    // If still too short, try to extend or use a fallback
    const fallback = cleanContent.substring(0, Math.min(cleanContent.length, maxLength))
    if (fallback.length >= minLength) {
      excerpt = fallback + '...'
    } else {
      excerpt = "A comprehensive guide on " + toTitleCase(cleanContent.substring(0, Math.min(cleanContent.length, 40))) + "..."
    }
  }
  return excerpt.trim().substring(0, maxLength);
}

// Function to extract H1 heading
function extractH1(content) {
  const h1Match = content.match(/^#\s*(.+)/m)
  return h1Match ? h1Match[1].trim() : null
}

// Function to determine category based on keywords or content
function determineCategory(content) {
  const lowerContent = content.toLowerCase()
  if (lowerContent.includes('kubernetes') || lowerContent.includes('k8s') || lowerContent.includes('pod') || lowerContent.includes('container')) {
    return 'Kubernetes'
  }
  if (lowerContent.includes('devops') || lowerContent.includes('git') || lowerContent.includes('ci/cd') || lowerContent.includes('automation')) {
    return 'DevOps'
  }
  if (lowerContent.includes('error') || lowerContent.includes('troubleshooting') || lowerContent.includes('fix')) {
    return 'Troubleshooting'
  }
  if (lowerContent.includes('cost optimization') || lowerContent.includes('cloud cost')) {
    return 'Cost Optimization'
  }
  if (lowerContent.includes('aiops') || lowerContent.includes('ai agent')) {
    return 'AIOps'
  }
  return 'Blog' // Default category
}

// Function to generate keywords
function generateKeywords(title, category) {
  const smallWords = new Set(['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'in', 'nor', 'of', 'on', 'or', 'so', 'the', 'to', 'up', 'yet', 'vs'])
  const baseKeywords = new Set(['AlertMend AI', 'AIOps', 'DevOps'])
  const titleWords = title.toLowerCase().split(/\s+/)
  titleWords.forEach(word => {
    if (word.length > 3 && !smallWords.has(word)) {
      baseKeywords.add(word)
    }
  })
  if (category && category !== 'Blog') {
    baseKeywords.add(category)
  }
  return Array.from(baseKeywords).join(', ')
}

const markdownFiles = fs.readdirSync(blogDir).filter(file => file.endsWith('.md'))

const filesWithoutFrontmatter = []
const filesWithFrontmatter = []

markdownFiles.forEach(file => {
  const filePath = path.join(blogDir, file)
  let content = fs.readFileSync(filePath, 'utf-8')

  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)

  if (!frontmatterMatch) {
    filesWithoutFrontmatter.push(file)

    const h1Title = extractH1(content)
    const slugFromFilename = file.replace('.md', '')
    const title = h1Title ? toTitleCase(h1Title) : toTitleCase(slugFromFilename)
    // Ensure title is within 43 chars (60 with suffix)
    const maxTitleLength = 43
    let finalTitle = title
    if (finalTitle.length > maxTitleLength) {
      finalTitle = finalTitle.substring(0, maxTitleLength).trim()
      // Try to end at word boundary
      const lastSpace = finalTitle.lastIndexOf(' ')
      if (lastSpace > maxTitleLength * 0.7) {
        finalTitle = finalTitle.substring(0, lastSpace)
      }
    }
    const category = determineCategory(content)
    const excerpt = generateExcerpt(content)
    const keywords = generateKeywords(finalTitle, category)

    const newFrontmatter = `---
title: "${finalTitle}"
excerpt: "${excerpt}"
date: "2025-12-18"
category: "${category}"
author: "AlertMend Team"
keywords: "${keywords}"
---
`
    content = newFrontmatter + '\n' + content
    fs.writeFileSync(filePath, content, 'utf-8')
  } else {
    filesWithFrontmatter.push(file)
  }
})

console.log(`✅ Processed ${filesWithoutFrontmatter.length} files without frontmatter`)
console.log(`⏭️  Skipped ${filesWithFrontmatter.length} files (already have frontmatter)`)
if (filesWithoutFrontmatter.length > 0) {
  console.log(`\n📝 Files updated:`)
  filesWithoutFrontmatter.slice(0, 10).forEach(f => console.log(`  - ${f}`))
  if (filesWithoutFrontmatter.length > 10) {
    console.log(`  ... and ${filesWithoutFrontmatter.length - 10} more`)
  }
}




