import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const blogDir = path.join(__dirname, '../public/blog')

function fixFile(filename) {
  const filePath = path.join(blogDir, filename)
  let content = fs.readFileSync(filePath, 'utf-8')
  let changed = false
  
  // Fix escaped quotes in excerpt
  const excerptMatch = content.match(/^excerpt:\s*"([^"]+)"/m)
  if (excerptMatch) {
    let excerpt = excerptMatch[1]
    const originalExcerpt = excerpt
    
    // Remove problematic escape sequences
    excerpt = excerpt.replace(/^\\?"\\?"\\?\\?"/g, '') // Remove leading escaped quotes
    excerpt = excerpt.replace(/\\\\"/g, '"') // Fix escaped quotes
    excerpt = excerpt.replace(/\\"/g, '"') // Fix escaped quotes
    excerpt = excerpt.replace(/^["']+|["']+$/g, '') // Remove surrounding quotes
    excerpt = excerpt.trim()
    
    // If excerpt is still too long, truncate it
    if (excerpt.length > 160) {
      let truncated = excerpt.substring(0, 157)
      const lastSpace = truncated.lastIndexOf(' ')
      if (lastSpace > 120) {
        truncated = truncated.substring(0, lastSpace)
      }
      excerpt = truncated + '...'
    }
    
    // If excerpt is too short, generate a better one
    if (excerpt.length < 50) {
      const bodyMatch = content.match(/^---\n[\s\S]*?\n---\n\n([\s\S]*)$/)
      if (bodyMatch) {
        const body = bodyMatch[1]
        const firstPara = body.split(/\n\s*\n/).find(p => p.trim().length > 50 && !p.trim().startsWith('#'))
        if (firstPara) {
          excerpt = firstPara
            .replace(/\*\*/g, '')
            .replace(/#{1,6}\s+/g, '')
            .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
            .replace(/`([^`]+)`/g, '$1')
            .trim()
            .substring(0, 157)
        }
      }
    }
    
    if (excerpt !== originalExcerpt && excerpt.length >= 50 && excerpt.length <= 160) {
      content = content.replace(/^excerpt:\s*"[^"]+"/m, `excerpt: "${excerpt.replace(/"/g, '\\"')}"`)
      changed = true
    }
  }
  
  // Fix duplicate "Guide Guide" in titles
  if (content.includes('Guide Guide')) {
    content = content.replace(/Guide Guide/g, 'Guide')
    changed = true
  }
  
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf-8')
    return true
  }
  
  return false
}

const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'))
let fixed = 0

files.forEach(file => {
  if (fixFile(file)) {
    console.log(`✅ Fixed: ${file}`)
    fixed++
  }
})

console.log(`\nFixed ${fixed} files`)

