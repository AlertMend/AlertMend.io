import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const blogDir = path.join(__dirname, '../public/blog')

// Function to remove Chinese characters
function removeChineseChars(str) {
  return str.replace(/[\u4e00-\u9fff]/g, '').trim()
}

// Function to improve title - make it descriptive and 30-60 chars (with suffix)
function improveTitle(originalTitle, slug) {
  let title = removeChineseChars(originalTitle)
  
  // Remove " | AlertMend AI" suffix if present for processing
  title = title.replace(/\s*\|\s*AlertMend AI\s*$/i, '').trim()
  
  // Convert to Title Case
  title = title.replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
  
  const suffix = ' | AlertMend AI'
  const maxLength = 60
  const minLength = 30
  
  // If title is too short, expand it
  if (title.length + suffix.length < minLength) {
    // Common expansions based on keywords
    const expansions = {
      'bright server': 'Bright Server Monitoring and DevOps Guide',
      'co to monitor': 'What to Monitor in Your IT Infrastructure',
      'domain robot': 'Domain Robot Management and Automation Guide',
      'elektro dns': 'Elektro DNS Configuration and Management Guide',
      'hw log': 'Hardware Logging and System Monitoring Guide',
      'ip mon': 'IP Monitoring and Network Management Guide',
      'livemonitor': 'LiveMonitor Real-Time System Monitoring Guide',
      'monitoring pro': 'Monitoring Pro Advanced System Management Guide',
      'one time seo': 'One-Time SEO Optimization Strategy Guide',
      'petrova ai': 'Petrova AI Recruitment Platform Overview Guide',
      'ping api': 'Ping API Network Testing and Monitoring Guide',
      'port tool': 'Port Tool Network Port Management Guide',
      'port tools': 'Port Tools Network Port Management Solutions',
      'porting tools': 'Porting Tools Software Migration Guide',
      'rapid iptv': 'Rapid IPTV Streaming Service Management Guide',
      'rapidiptv': 'RapidIPTV Streaming Service Management Guide',
      'reboot careers': 'Reboot Careers Technology Job Opportunities Guide',
      'ro dashboard': 'RO Dashboard Operations Management Guide',
      'robot tracking': 'Robot Tracking System Implementation Guide',
      'root robots': 'Root Robots Programming and Development Guide',
      'sms advanced': 'SMS Advanced Messaging Service Integration Guide',
      'sms ping': 'SMS Ping Network Testing and Monitoring Guide',
      'svg heartbeat': 'SVG Heartbeat Monitoring and Visualization Guide',
      'the livenx': 'The LiveNX Network Monitoring Platform Guide',
      'ubuntu': 'Ubuntu Ping Command Installation and Troubleshooting Guide',
      'upt careers': 'UPT Careers Technology Job Opportunities Guide',
      'upt jobs': 'UPT Jobs Technology Employment Opportunities Guide',
      'uptime pro': 'Uptime Pro System Monitoring and Availability Guide',
      'vps mx': 'VPS MX Mail Server Configuration Guide',
      'wordpress': 'WordPress Website Development and Management Guide'
    }
    
    const lowerTitle = title.toLowerCase()
    if (expansions[lowerTitle]) {
      title = expansions[lowerTitle]
    } else {
      // Generic expansion
      title = title + ' Complete Guide'
    }
  }
  
  // Remove double spaces
  title = title.replace(/\s+/g, ' ').trim()
  
  // Ensure title with suffix is within limits
  let fullTitle = title + suffix
  if (fullTitle.length < minLength) {
    title = title + ' for DevOps and System Management'
    fullTitle = title + suffix
  }
  
  if (fullTitle.length > maxLength) {
    // Trim to fit
    const availableLength = maxLength - suffix.length
    title = title.substring(0, availableLength).trim()
    // Try to end at word boundary
    const lastSpace = title.lastIndexOf(' ')
    if (lastSpace > availableLength * 0.7) {
      title = title.substring(0, lastSpace)
    }
    fullTitle = title + suffix
  }
  
  // Final check - ensure minimum length
  if (fullTitle.length < minLength) {
    title = 'Complete ' + title
    fullTitle = title + suffix
  }
  
  // Remove any double spaces one more time
  title = title.replace(/\s+/g, ' ').trim()
  
  // Ensure title (without suffix) is appropriate length
  // The suffix " | AlertMend AI" (17 chars) will be added by the build process
  // So we want title to be 13-43 chars (30-60 with suffix)
  const maxTitleWithoutSuffix = 43
  const minTitleWithoutSuffix = 13 // 30 - 17 = 13
  
  // If title is too long, trim at word boundary
  if (title.length > maxTitleWithoutSuffix) {
    const trimmed = title.substring(0, maxTitleWithoutSuffix).trim()
    const lastSpace = trimmed.lastIndexOf(' ')
    // Only use word boundary if it doesn't cut too much off
    if (lastSpace > maxTitleWithoutSuffix * 0.75) {
      title = trimmed.substring(0, lastSpace)
    } else {
      title = trimmed
    }
  }
  
  // Ensure minimum length - add descriptive words if needed
  if (title.length < minTitleWithoutSuffix) {
    if (!title.toLowerCase().includes('guide')) {
      title = title + ' Guide'
    } else if (!title.toLowerCase().includes('complete')) {
      title = 'Complete ' + title
    } else {
      title = title + ' Overview'
    }
  }
  
  // Return title WITHOUT suffix (build process adds it)
  return title.trim()
}

// Function to generate improved excerpt (50-160 chars)
function generateExcerpt(content, minLength = 50, maxLength = 160) {
  // Remove Chinese characters
  content = removeChineseChars(content)
  
  // Clean content - remove code blocks, HTML, markdown formatting
  let cleanContent = content
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/<[^>]+>/g, '') // Remove HTML tags
    .replace(/^#+\s+/gm, '') // Remove markdown headers
    .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold
    .replace(/\*([^*]+)\*/g, '$1') // Remove italic
    .replace(/`([^`]+)`/g, '$1') // Remove inline code
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .replace(/\s+/g, ' ') // Multiple spaces to single
    .trim()
  
  // Remove any leading metadata-like text (e.g., "co to monitor Elevating...")
  cleanContent = cleanContent.replace(/^[a-z\s]+(Elevating|Understanding|Exploring|Unveiling)/i, '$1')
  
  // Try to extract a meaningful first sentence/paragraph
  const sentences = cleanContent.split(/[.!?]+\s+/).filter(s => s.trim().length > 15)
  
  let excerpt = ''
  if (sentences.length > 0) {
    // Take first sentence, ensure it's meaningful
    excerpt = sentences[0].trim()
    
    // If first sentence is too short, combine with second
    if (excerpt.length < minLength && sentences.length > 1) {
      excerpt = (excerpt + ' ' + sentences[1].trim()).trim()
    }
    
    // Add period if missing and length allows
    if (!excerpt.match(/[.!?]$/) && excerpt.length < maxLength - 5) {
      excerpt += '.'
    }
  }
  
  // If still no good excerpt, take first N characters
  if (!excerpt || excerpt.length < 20) {
    excerpt = cleanContent.substring(0, Math.min(cleanContent.length, maxLength)).trim()
    // Try to end at sentence boundary
    const lastPeriod = excerpt.lastIndexOf('.')
    if (lastPeriod > minLength) {
      excerpt = excerpt.substring(0, lastPeriod + 1)
    } else {
      // End at word boundary
      const lastSpace = excerpt.lastIndexOf(' ')
      if (lastSpace > minLength - 10) {
        excerpt = excerpt.substring(0, lastSpace) + '...'
      }
    }
  }
  
  // Ensure minimum length
  if (excerpt.length < minLength) {
    // Try to extend with next sentence or more content
    if (sentences.length > 1 && excerpt.length < minLength) {
      const combined = sentences.slice(0, 3).join(' ').trim()
      if (combined.length >= minLength && combined.length <= maxLength) {
        excerpt = combined
        if (!excerpt.match(/[.!?]$/)) {
          excerpt += '.'
        }
      } else {
        // Take first part that fits
        excerpt = combined.substring(0, maxLength - 3).trim()
        const lastSpace = excerpt.lastIndexOf(' ')
        if (lastSpace > minLength) {
          excerpt = excerpt.substring(0, lastSpace) + '...'
        } else {
          excerpt += '...'
        }
      }
    }
    
    // If still too short, use generic but relevant fallback
    if (excerpt.length < minLength) {
      const generic = 'A comprehensive guide covering essential topics, best practices, and practical solutions for system management and DevOps operations.'
      excerpt = generic.substring(0, maxLength).trim()
    }
  }
  
  // Ensure maximum length
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

// Function to improve content - remove Chinese characters
function improveContent(content) {
  // Remove Chinese characters from content
  const lines = content.split('\n')
  const cleanedLines = lines.map(line => removeChineseChars(line))
  return cleanedLines.join('\n').replace(/\n{3,}/g, '\n\n') // Remove excessive newlines
}

// Files with issues
const problematicFiles = [
  'bright-server.md',
  'co-to-monitor.md',
  'domain-robot-1.md',
  'domain-robot.md',
  'elektro-dns.md',
  'hw-log.md',
  'ip-mon.md',
  'livemonitor.md',
  'monitoring-pro.md',
  'one-time-seo-1.md',
  'one-time-seo.md',
  'petrova-ai.md',
  'ping-api.md',
  'port-tool.md',
  'port-tools.md',
  'porting-tools.md',
  'rapid-iptv.md',
  'rapidiptv.md',
  'reboot-careers.md',
  'ro-dashboard.md',
  'robot-tracking.md',
  'root-robots.md',
  'sms-advanced.md',
  'sms-ping.md',
  'svg-heartbeat.md',
  'the-livenx.md',
  'ubuntu-没有-ping.md',
  'ubuntu.md',
  'upt-careers.md',
  'upt-jobs.md',
  'uptime-pro-1.md',
  'uptime-pro.md',
  'vps-mx-1.md',
  'wordpress.md'
]

let fixedCount = 0

problematicFiles.forEach(filename => {
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
    const bodyContent = frontmatterMatch[2]
    
    // Parse current frontmatter
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
    
    // Fix title
    const slug = filename.replace('.md', '')
    const improvedTitle = improveTitle(metadata.title || slug, slug)
    
    // Fix excerpt
    const improvedExcerpt = generateExcerpt(bodyContent)
    
    // Improve content body
    const improvedBody = improveContent(bodyContent)
    
    // Reconstruct frontmatter
    const newFrontmatter = `---
title: "${improvedTitle}"
excerpt: "${improvedExcerpt}"
date: "${metadata.date || '2025-12-18'}"
category: "${metadata.category || 'Blog'}"
author: "${metadata.author || 'AlertMend Team'}"
keywords: "${metadata.keywords || 'AlertMend AI, AIOps, DevOps'}"
---
`
    
    // Write updated content
    const newContent = newFrontmatter + '\n' + improvedBody
    fs.writeFileSync(filePath, newContent, 'utf-8')
    
    fixedCount++
    console.log(`✅ Fixed: ${filename}`)
    console.log(`   Title: ${improvedTitle.substring(0, 60)}${improvedTitle.length > 60 ? '...' : ''}`)
    console.log(`   Excerpt: ${improvedExcerpt.length} chars`)
    
  } catch (error) {
    console.error(`❌ Error processing ${filename}:`, error.message)
  }
})

console.log(`\n✅ Fixed ${fixedCount} files`)

