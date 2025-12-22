import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const blogDir = path.join(__dirname, '../public/blog')

// Function to generate proper excerpt
function generateExcerpt(content, minLength = 50, maxLength = 160) {
  // Remove code blocks, HTML, markdown formatting
  let cleanContent = content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/^#+\s+/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  
  // Remove reference content markers
  cleanContent = cleanContent.replace(/===+[\s\S]*?===+/g, '')
  cleanContent = cleanContent.replace(/REFERENCE CONTENT[\s\S]*?SOURCE \d+:/gi, '')
  cleanContent = cleanContent.replace(/This information is tailored[\s\S]*$/i, '')
  
  const sentences = cleanContent.split(/[.!?]+\s+/).filter(s => s.trim().length > 20)
  
  let excerpt = ''
  if (sentences.length > 0) {
    excerpt = sentences[0].trim()
    if (excerpt.length < minLength && sentences.length > 1) {
      excerpt = (excerpt + ' ' + sentences[1].trim()).trim()
    }
    if (!excerpt.match(/[.!?]$/) && excerpt.length < maxLength - 5) {
      excerpt += '.'
    }
  }
  
  if (!excerpt || excerpt.length < minLength) {
    if (sentences.length > 1) {
      const combined = sentences.slice(0, 3).join(' ').trim()
      if (combined.length >= minLength && combined.length <= maxLength) {
        excerpt = combined
        if (!excerpt.match(/[.!?]$/)) {
          excerpt += '.'
        }
      } else {
        excerpt = combined.substring(0, maxLength - 3).trim()
        const lastSpace = excerpt.lastIndexOf(' ')
        if (lastSpace > minLength) {
          excerpt = excerpt.substring(0, lastSpace) + '...'
        } else {
          excerpt += '...'
        }
      }
    } else {
      excerpt = cleanContent.substring(0, Math.min(cleanContent.length, maxLength)).trim()
      const lastSpace = excerpt.lastIndexOf(' ')
      if (lastSpace > minLength) {
        excerpt = excerpt.substring(0, lastSpace) + '...'
      }
    }
  }
  
  if (excerpt.length < minLength) {
    excerpt = 'A comprehensive guide covering essential topics, best practices, and practical solutions for system management and DevOps operations.'
  }
  
  if (excerpt.length > maxLength) {
    excerpt = excerpt.substring(0, maxLength - 3).trim()
    const lastSpace = excerpt.lastIndexOf(' ')
    if (lastSpace > minLength) {
      excerpt = excerpt.substring(0, lastSpace) + '...'
    } else {
      excerpt = excerpt.substring(0, maxLength - 3) + '...'
    }
  }
  
  return excerpt.trim()
}

// Files to fix
const filesToFix = [
  'deny-access-to-this-computer-from-the-network.md',
  'does-telegram-tell-when-you-screenshot.md',
  'equipment-uptime-definition.md',
  // Also fix validation errors
  'best-practices-for-disclosing-open-source-components-to-customers.md',
  'big-data-on-kubernetes-pdf.md',
  'error-remote-origin-already-exists-1.md',
  'error-remote-origin-already-exists.md',
  'git-config-global-http-sslbackend-schannel.md',
  'it-configuration-governance-tools-real-time-drift-detection.md',
  'kubernetes-explorer.md',
  'kubernetes-resource-optimization-software.md',
  'real-time-configuration-drift-detection-capabilities.md',
  'real-time-kubernetes-resource-optimization-solutions.md',
  'top-kubernetes-cost-management-solutions.md',
  'ubuntu.md',
  'uptime-pro-1.md',
  'what-is-sli-in-shipping.md'
]

filesToFix.forEach(filename => {
  const filePath = path.join(blogDir, filename)
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filename}`)
    return
  }
  
  try {
    let content = fs.readFileSync(filePath, 'utf-8')
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
    
    if (!frontmatterMatch) {
      console.log(`⚠️  No frontmatter found: ${filename}`)
      return
    }
    
    const frontmatter = frontmatterMatch[1]
    let bodyContent = frontmatterMatch[2]
    
    // Parse frontmatter
    const metadata = {}
    frontmatter.split('\n').forEach((line) => {
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
    
    // Fix excerpt
    const improvedExcerpt = generateExcerpt(bodyContent)
    
    // For the three main files, check if they have raw reference content
    const hasRawReferences = bodyContent.includes('REFERENCE CONTENT FROM TOP') || 
                            bodyContent.includes('SOURCE 1:') ||
                            bodyContent.includes('utilize this information to comprehend')
    
    if (hasRawReferences && ['deny-access-to-this-computer-from-the-network.md', 'does-telegram-tell-when-you-screenshot.md', 'equipment-uptime-definition.md'].includes(filename)) {
      // These files need proper content - for now just fix the excerpt
      console.log(`⚠️  ${filename} has raw reference content - excerpt fixed but content needs manual review`)
    }
    
    // Update frontmatter excerpt
    const newFrontmatter = frontmatter.replace(
      /excerpt:\s*"[^"]*"/,
      `excerpt: "${improvedExcerpt}"`
    )
    
    const newContent = `---\n${newFrontmatter}\n---\n${bodyContent}`
    fs.writeFileSync(filePath, newContent, 'utf-8')
    
    console.log(`✅ Fixed excerpt: ${filename}`)
    
  } catch (error) {
    console.error(`❌ Error processing ${filename}:`, error.message)
  }
})

console.log(`\n✅ Processed ${filesToFix.length} files`)




