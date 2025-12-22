import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const blogDir = path.join(__dirname, '../public/blog')

// Function to remove Chinese characters
function removeChineseChars(str) {
  return str.replace(/[\u4e00-\u9fff]/g, '').trim().replace(/\s+/g, ' ')
}

const problematicFiles = [
  'wordpress.md',
  'ubuntu-没有-ping.md',
  'ubuntu.md'
]

problematicFiles.forEach(filename => {
  const filePath = path.join(blogDir, filename)
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filename}`)
    return
  }
  
  try {
    let content = fs.readFileSync(filePath, 'utf-8')
    
    // Remove Chinese from frontmatter (keywords, title, excerpt)
    content = content.replace(/keywords:\s*"([^"]+)"/g, (match, keywords) => {
      const cleaned = removeChineseChars(keywords).replace(/,\s*,/g, ',').replace(/^,|,$/g, '')
      return `keywords: "${cleaned}"`
    })
    
    // Remove Chinese from title
    content = content.replace(/title:\s*"([^"]+)"/g, (match, title) => {
      const cleaned = removeChineseChars(title)
      return `title: "${cleaned}"`
    })
    
    // Remove Chinese from excerpt
    content = content.replace(/excerpt:\s*"([^"]+)"/g, (match, excerpt) => {
      const cleaned = removeChineseChars(excerpt)
      return `excerpt: "${cleaned}"`
    })
    
    // Remove Chinese from body content
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
    if (frontmatterMatch) {
      const frontmatter = frontmatterMatch[1]
      let bodyContent = frontmatterMatch[2]
      
      // Remove Chinese from body
      bodyContent = removeChineseChars(bodyContent)
      
      content = `---\n${frontmatter}\n---\n\n${bodyContent}`
    }
    
    fs.writeFileSync(filePath, content, 'utf-8')
    console.log(`✅ Cleaned: ${filename}`)
    
  } catch (error) {
    console.error(`❌ Error processing ${filename}:`, error.message)
  }
})

console.log(`\n✅ Cleaned ${problematicFiles.length} files`)




