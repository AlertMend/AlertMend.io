import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const blogsHtmlDir = path.join(__dirname, '../dist/blogs')
const blogDir = path.join(__dirname, '../dist/blog')

// Function to fix HTML description
function fixHtmlDescription(filePath, fileName) {
  try {
    let html = fs.readFileSync(filePath, 'utf-8')
    
    // Extract current description
    const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i)
    if (!descMatch) return false
    
    const currentDesc = descMatch[1]
    const currentLength = currentDesc.length
    
    // If description is too short (< 50 chars) or too long (> 160 chars), fix it
    if (currentLength < 50 || currentLength > 160) {
      // Extract title from HTML
      const titleMatch = html.match(/<title>([^<]+)<\/title>/i)
      const title = titleMatch ? titleMatch[1].replace(/\s*\|\s*AlertMend AI\s*$/i, '').trim() : fileName.replace('.html', '').replace(/-/g, ' ')
      
      // Generate a valid description
      const cleanTitle = title.toLowerCase()
      let newDesc = `Expert guide on ${cleanTitle} for Kubernetes. Learn best practices and solutions.`
      
      // Ensure it's within bounds
      if (newDesc.length > 160) {
        newDesc = newDesc.substring(0, 157).trim() + '...'
      }
      if (newDesc.length < 50) {
        newDesc = `Learn about ${cleanTitle} and discover expert solutions, best practices, and troubleshooting tips for Kubernetes.`
        if (newDesc.length > 160) {
          newDesc = newDesc.substring(0, 157).trim() + '...'
        }
      }
      
      // Replace the description in all places
      html = html.replace(
        /<meta\s+name=["']description["']\s+content=["'][^"']+["']/i,
        `<meta name="description" content="${newDesc.replace(/"/g, '&quot;')}">`
      )
      
      html = html.replace(
        /<meta\s+property=["']og:description["']\s+content=["'][^"']+["']/i,
        `<meta property="og:description" content="${newDesc.replace(/"/g, '&quot;')}">`
      )
      
      html = html.replace(
        /<meta\s+name=["']twitter:description["']\s+content=["'][^"']+["']/i,
        `<meta name="twitter:description" content="${newDesc.replace(/"/g, '&quot;')}">`
      )
      
      // Also fix JSON-LD if present
      html = html.replace(
        /"description":\s*"[^"]*"/,
        `"description": "${newDesc.replace(/"/g, '\\"')}"`
      )
      
      fs.writeFileSync(filePath, html, 'utf-8')
      return { fixed: true, oldLength: currentLength, newLength: newDesc.length }
    }
    return false
  } catch (error) {
    return false
  }
}

let fixedCount = 0

// Fix files in dist/blogs/
if (fs.existsSync(blogsHtmlDir)) {
  const htmlFiles = fs.readdirSync(blogsHtmlDir).filter(file => file.endsWith('.html'))
  
  htmlFiles.forEach(file => {
    const filePath = path.join(blogsHtmlDir, file)
    const result = fixHtmlDescription(filePath, file)
    if (result && result.fixed) {
      fixedCount++
      console.log(`Fixed ${file}: ${result.oldLength} → ${result.newLength} chars`)
    }
  })
}

// Fix files in dist/blog/*/index.html
if (fs.existsSync(blogDir)) {
  const blogSubdirs = fs.readdirSync(blogDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
  
  blogSubdirs.forEach(subdir => {
    const indexPath = path.join(blogDir, subdir, 'index.html')
    if (fs.existsSync(indexPath)) {
      const result = fixHtmlDescription(indexPath, subdir)
      if (result && result.fixed) {
        fixedCount++
        console.log(`Fixed blog/${subdir}/index.html: ${result.oldLength} → ${result.newLength} chars`)
      }
    }
  })
}

console.log(`\nFixed ${fixedCount} HTML files with invalid descriptions.`)
