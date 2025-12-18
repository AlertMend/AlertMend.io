import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const blogsHtmlDir = path.join(__dirname, '../dist/blogs')

// Read all HTML files
const htmlFiles = fs.readdirSync(blogsHtmlDir).filter(file => file.endsWith('.html'))

let fixedCount = 0

htmlFiles.forEach(file => {
  const filePath = path.join(blogsHtmlDir, file)
  let html = fs.readFileSync(filePath, 'utf-8')
  
  // Extract current description
  const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i)
  if (!descMatch) return
  
  const currentDesc = descMatch[1]
  const currentLength = currentDesc.length
  
  // If description is too short (< 50 chars), fix it
  if (currentLength < 50) {
    // Extract title from HTML
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i)
    const title = titleMatch ? titleMatch[1].replace(/\s*\|\s*AlertMend AI\s*$/i, '').trim() : file.replace('.html', '').replace(/-/g, ' ')
    
    // Generate a valid description
    const cleanTitle = title.toLowerCase()
    const newDesc = `Expert guide on ${cleanTitle} for Kubernetes. Learn best practices and solutions.`
    
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
    fixedCount++
    console.log(`Fixed ${file}: ${currentLength} → ${newDesc.length} chars`)
  }
})

console.log(`\nFixed ${fixedCount} HTML files with invalid descriptions.`)

