import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const blogDir = path.join(__dirname, '../public/blog')
const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'))

let fixedCount = 0

files.forEach(file => {
  const filePath = path.join(blogDir, file)
  let content = fs.readFileSync(filePath, 'utf-8')
  
  // Check if file has frontmatter
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!frontmatterMatch) {
    console.log(`Skipping ${file} - no frontmatter`)
    return
  }
  
  const frontmatter = frontmatterMatch[1]
  let body = frontmatterMatch[2]
  const originalBody = body
  
  // Extract title and excerpt from frontmatter
  const titleMatch = frontmatter.match(/^title:\s*["']?([^"']+)["']?$/m)
  const excerptMatch = frontmatter.match(/^excerpt:\s*["']?([^"']+)["']?$/m)
  
  if (!titleMatch) {
    console.log(`Skipping ${file} - no title in frontmatter`)
    return
  }
  
  const title = titleMatch[1]
  const excerpt = excerptMatch ? excerptMatch[1] : null
  
  // Remove duplicate H1 title (first line starting with #)
  // Split by lines and find the first H1
  const lines = body.split('\n')
  let newLines = []
  let foundH1 = false
  let foundExcerpt = false
  let skipNextEmpty = false
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    
    // Skip empty line if we just removed H1 or excerpt
    if (skipNextEmpty && line.trim() === '') {
      skipNextEmpty = false
      continue
    }
    skipNextEmpty = false
    
    // Skip first H1 if it matches the title (allowing for variations)
    if (!foundH1 && line.match(/^#\s+/)) {
      foundH1 = true
      // Mark to skip next empty line
      skipNextEmpty = true
      continue
    }
    
    // Skip duplicate excerpt paragraph if it matches (check if line contains excerpt)
    if (!foundExcerpt && excerpt) {
      const lineTrimmed = line.trim()
      const excerptTrimmed = excerpt.trim()
      // Check if line matches excerpt exactly or contains it
      if (lineTrimmed === excerptTrimmed || 
          (lineTrimmed.length > 0 && excerptTrimmed.includes(lineTrimmed)) ||
          (lineTrimmed.length > 0 && lineTrimmed.includes(excerptTrimmed.substring(0, 50)))) {
        foundExcerpt = true
        // Mark to skip next empty line
        skipNextEmpty = true
        continue
      }
    }
    
    newLines.push(line)
  }
  
  body = newLines.join('\n')
  
  // Only write if we made changes
  if (body !== originalBody) {
    const newContent = `---\n${frontmatter}\n---\n${body}`
    fs.writeFileSync(filePath, newContent, 'utf-8')
    console.log(`✓ Fixed ${file}`)
    fixedCount++
  } else {
    console.log(`- Skipped ${file} (no duplicates found)`)
  }
})

console.log(`\n✅ Fixed ${fixedCount} out of ${files.length} blog posts`)

