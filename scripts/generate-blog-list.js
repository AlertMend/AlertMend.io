import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Generate blog list from markdown files
const blogDir = path.join(__dirname, '../public/blog')
const outputPath = path.join(__dirname, '../src/utils/blogList.json')

const markdownFiles = fs.readdirSync(blogDir).filter(file => file.endsWith('.md'))

const blogList = []

markdownFiles.forEach(file => {
  const markdownPath = path.join(blogDir, file)
  const slug = file.replace('.md', '')
  
  try {
    const markdown = fs.readFileSync(markdownPath, 'utf-8')
    const frontmatterMatch = markdown.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
    if (!frontmatterMatch) return
    
    const frontmatter = frontmatterMatch[1]
    const metadata = {}
    
    // Parse frontmatter fields (handle quoted and unquoted values)
    // Handle double-quoted strings (may contain single quotes)
    frontmatter.split('\n').forEach((line) => {
      const trimmed = line.trim()
      if (!trimmed) return
      
      // Match double-quoted strings (allows single quotes inside)
      const doubleQuotedMatch = trimmed.match(/^(\w+):\s*"([^"]*)"$/)
      // Match single-quoted strings (allows double quotes inside)
      const singleQuotedMatch = trimmed.match(/^(\w+):\s*'([^']*)'$/)
      // Match unquoted values
      const unquotedMatch = trimmed.match(/^(\w+):\s*(.+)$/)
      
      if (doubleQuotedMatch) {
        metadata[doubleQuotedMatch[1]] = doubleQuotedMatch[2]
      } else if (singleQuotedMatch) {
        metadata[singleQuotedMatch[1]] = singleQuotedMatch[2]
      } else if (unquotedMatch) {
        metadata[unquotedMatch[1]] = unquotedMatch[2].trim()
      }
    })
    
    // Parse tags if present
    const tagsMatch = frontmatter.match(/^tags:\s*\[(.*?)\]/m)
    let tags = []
    if (tagsMatch) {
      tags = tagsMatch[1].split(',').map(t => t.trim().replace(/['"]/g, ''))
    }
    
    // Parse hidden field (exclude hidden blogs from list)
    const hidden = metadata.hidden === 'true' || metadata.hidden === true
    if (hidden) return // Skip hidden blogs
    
    blogList.push({
      slug,
      title: metadata.title || slug,
      excerpt: metadata.excerpt || '',
      date: metadata.date || new Date().toISOString().split('T')[0],
      category: metadata.category || 'Blog',
      author: metadata.author || 'AlertMend Team',
      tags: tags.length > 0 ? tags : []
    })
  } catch (error) {
    console.warn(`Warning: Could not read metadata from ${file}:`, error.message)
  }
})

// Sort by date (newest first)
blogList.sort((a, b) => {
  const dateA = new Date(a.date).getTime()
  const dateB = new Date(b.date).getTime()
  return dateB - dateA
})

// Write JSON file
fs.writeFileSync(outputPath, JSON.stringify(blogList, null, 2), 'utf-8')
console.log(`✅ Generated blog list with ${blogList.length} blogs: ${outputPath}`)

