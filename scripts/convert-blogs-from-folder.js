import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Normalize slug: remove .html, convert to lowercase, replace underscores with hyphens
function normalizeSlug(folderName) {
  return folderName
    .replace(/\.html$/i, '')
    .toLowerCase()
    .replace(/_/g, '-')
    .replace(/[()]/g, '')
    .trim()
}

// Extract metadata and content from .mdx file
function parseMDX(mdxContent) {
  // Extract blog metadata
  const blogMatch = mdxContent.match(/export const blog = \{([\s\S]*?)\};/)
  const metadataMatch = mdxContent.match(/export const metadata = \{([\s\S]*?)\};/)
  
  let title = ''
  let description = ''
  let date = ''
  let author = 'AlertMend Team'
  let category = 'Blog'
  let canonical = ''
  
  if (blogMatch) {
    const blogContent = blogMatch[1]
    const titleMatch = blogContent.match(/title:\s*["']([^"']+)["']/)
    const descMatch = blogContent.match(/description:\s*["']([^"']+)["']/)
    const dateMatch = blogContent.match(/date:\s*["']([^"']+)["']/)
    const authorMatch = blogContent.match(/author:\s*\{\s*name:\s*["']([^"']+)["']/)
    
    if (titleMatch) title = titleMatch[1]
    if (descMatch) description = descMatch[1]
    if (dateMatch) date = dateMatch[1]
    if (authorMatch) author = authorMatch[1]
  }
  
  if (metadataMatch) {
    const metaContent = metadataMatch[1]
    const canonicalMatch = metaContent.match(/canonical:\s*["']([^"']+)["']/)
    if (canonicalMatch) canonical = canonicalMatch[1]
  }
  
  // Extract content after the last --- separator (after the export default line)
  const contentMatch = mdxContent.match(/export default[\s\S]*?---\s*([\s\S]*)$/)
  let content = ''
  if (contentMatch) {
    content = contentMatch[1].trim()
  } else {
    // Fallback: try to find content after any --- separator
    const parts = mdxContent.split('---')
    if (parts.length > 1) {
      content = parts[parts.length - 1].trim()
    }
  }
  
  // Clean up content: remove JSX image tags and convert to markdown
  content = content
    .replace(/<div[^>]*>[\s\S]*?<\/div>/g, '') // Remove div wrappers
    .replace(/<img[^>]*src=["']([^"']+)["'][^>]*alt=["']([^"']+)["'][^>]*\/?>/g, '![$2]($1)') // Convert img to markdown
    .replace(/style=\{[^}]*\}/g, '') // Remove style attributes
    .replace(/<img[^>]*\/?>/g, '') // Remove any remaining img tags
    .trim()
  
  // Determine category from title/content
  if (title.toLowerCase().includes('elasticsearch')) {
    category = 'Elasticsearch'
  } else if (title.toLowerCase().includes('kubernetes') || title.toLowerCase().includes('k8s')) {
    category = 'Kubernetes'
  } else if (title.toLowerCase().includes('aiops') || title.toLowerCase().includes('ai')) {
    category = 'AIOps'
  } else if (title.toLowerCase().includes('cost')) {
    category = 'Cost Optimization'
  }
  
  return {
    title,
    description,
    date,
    author,
    category,
    canonical,
    content
  }
}

// Main function
const blogsDir = path.join(__dirname, '../blogs')
const publicBlogDir = path.join(__dirname, '../public/blog')

// Ensure public/blog directory exists
if (!fs.existsSync(publicBlogDir)) {
  fs.mkdirSync(publicBlogDir, { recursive: true })
}

// Get existing blog slugs
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

// Find all .mdx files
const mdxFiles = []
function findMDXFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      findMDXFiles(fullPath)
    } else if (entry.name === 'page.mdx') {
      mdxFiles.push(fullPath)
    }
  }
}

findMDXFiles(blogsDir)
console.log(`Found ${mdxFiles.length} .mdx files in blogs folder`)

let added = 0
let skipped = 0

mdxFiles.forEach(mdxPath => {
  try {
    const mdxContent = fs.readFileSync(mdxPath, 'utf-8')
    const folderName = path.basename(path.dirname(mdxPath))
    const slug = normalizeSlug(folderName)
    
    // Check if blog already exists
    if (existingBlogs.has(slug)) {
      console.log(`⏭️  Skipping ${slug} (already exists)`)
      skipped++
      return
    }
    
    // Parse MDX
    const { title, description, date, author, category, canonical, content } = parseMDX(mdxContent)
    
    if (!title || !content) {
      console.warn(`⚠️  Skipping ${slug}: missing title or content`)
      skipped++
      return
    }
    
    // Create markdown frontmatter
    const frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
excerpt: "${(description || '').replace(/"/g, '\\"')}"
date: "${date || new Date().toISOString().split('T')[0]}"
category: "${category}"
author: "${author}"
---`
    
    const markdown = `${frontmatter}\n\n${content}\n`
    
    // Write to public/blog
    const outputPath = path.join(publicBlogDir, `${slug}.md`)
    fs.writeFileSync(outputPath, markdown, 'utf-8')
    console.log(`✅ Added ${slug}.md`)
    added++
  } catch (error) {
    console.error(`❌ Error processing ${mdxPath}:`, error.message)
  }
})

console.log(`\n📊 Summary:`)
console.log(`   Added: ${added}`)
console.log(`   Skipped: ${skipped}`)
console.log(`   Total: ${mdxFiles.length}`)

