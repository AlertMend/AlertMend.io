import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const blogDir = path.join(__dirname, '../public/blog')

// Check if file exists
function fileExists(filepath) {
  return fs.existsSync(filepath)
}

// Read file content
function readFile(filename) {
  const filepath = path.join(blogDir, filename)
  if (!fileExists(filepath)) {
    return null
  }
  return fs.readFileSync(filepath, 'utf-8')
}

// Validate blog format
function validateBlogFormat(filename) {
  const content = readFile(filename)
  if (!content) {
    return { valid: false, errors: ['File not found'] }
  }

  const errors = []
  const warnings = []

  // Check 1: Must start with frontmatter
  if (!content.startsWith('---\n')) {
    errors.push('Missing frontmatter start (---)')
    return { valid: false, errors }
  }

  // Check 2: Must have frontmatter end
  const frontmatterEnd = content.indexOf('\n---\n')
  if (frontmatterEnd === -1) {
    errors.push('Missing frontmatter end (---)')
    return { valid: false, errors }
  }

  // Extract frontmatter and body
  const frontmatterText = content.substring(4, frontmatterEnd)
  const body = content.substring(frontmatterEnd + 5).trim()

  // Parse frontmatter
  const frontmatter = {}
  frontmatterText.split('\n').forEach((line) => {
    const trimmed = line.trim()
    if (!trimmed) return
    
    const doubleQuotedMatch = trimmed.match(/^(\w+):\s*"([^"]*)"$/)
    const singleQuotedMatch = trimmed.match(/^(\w+):\s*'([^']*)'$/)
    const unquotedMatch = trimmed.match(/^(\w+):\s*(.+)$/)
    
    if (doubleQuotedMatch) {
      frontmatter[doubleQuotedMatch[1]] = doubleQuotedMatch[2]
    } else if (singleQuotedMatch) {
      frontmatter[singleQuotedMatch[1]] = singleQuotedMatch[2]
    } else if (unquotedMatch) {
      frontmatter[unquotedMatch[1]] = unquotedMatch[2].trim()
    }
  })

  // Check 3: Required frontmatter fields
  const requiredFields = ['title', 'excerpt', 'date', 'category', 'author']
  requiredFields.forEach(field => {
    if (!frontmatter[field]) {
      errors.push(`Missing required frontmatter field: ${field}`)
    }
  })

  // Check 4: Title format
  if (frontmatter.title) {
    if (frontmatter.title.length < 10) {
      warnings.push('Title is very short (should be at least 10 characters)')
    }
    if (frontmatter.title.length > 70) {
      warnings.push('Title is very long (may be truncated in search results)')
    }
  }

  // Check 5: Excerpt format
  if (frontmatter.excerpt) {
    if (frontmatter.excerpt.length < 50) {
      warnings.push('Excerpt is short (should be 50-160 characters for SEO)')
    }
    if (frontmatter.excerpt.length > 160) {
      warnings.push('Excerpt is too long (should be 50-160 characters for SEO)')
    }
  }

  // Check 6: Date format (should be YYYY-MM-DD)
  if (frontmatter.date && !/^\d{4}-\d{2}-\d{2}$/.test(frontmatter.date)) {
    warnings.push(`Date format should be YYYY-MM-DD, got: ${frontmatter.date}`)
  }

  // Check 7: Body should start with H1
  const h1Match = body.match(/^#\s+(.+)$/m)
  if (!h1Match) {
    errors.push('Body must start with H1 heading (# Title)')
  } else {
    // Check 8: H1 should match or be similar to title
    const h1Title = h1Match[1].trim()
    const frontmatterTitle = frontmatter.title || ''
    // Allow some difference but should be related
    if (h1Title.toLowerCase().replace(/[^\w]/g, '') !== 
        frontmatterTitle.toLowerCase().replace(/[^\w]/g, '').substring(0, h1Title.length)) {
      warnings.push(`H1 title "${h1Title}" may not match frontmatter title "${frontmatterTitle}"`)
    }
  }

  // Check 9: Code blocks should be properly closed
  const codeBlockMatches = body.match(/```/g)
  if (codeBlockMatches && codeBlockMatches.length % 2 !== 0) {
    errors.push('Unclosed code block (odd number of ``` markers)')
  }

  // Check 10: Should have multiple H2 sections (at least 3 for a good blog post)
  const h2Matches = body.match(/^##\s+/gm)
  if (!h2Matches || h2Matches.length < 3) {
    warnings.push(`Blog post has only ${h2Matches ? h2Matches.length : 0} H2 sections (should have at least 3-5 for good structure)`)
  }

  // Check 11: Content length (should be substantial)
  const wordCount = body.split(/\s+/).length
  if (wordCount < 300) {
    warnings.push(`Content is very short (${wordCount} words, should be at least 500+ words for SEO)`)
  }

  // Check 12: Keywords field (optional but recommended)
  if (!frontmatter.keywords) {
    warnings.push('Missing keywords field (recommended for SEO)')
  } else if (frontmatter.keywords.split(',').length < 5) {
    warnings.push(`Keywords field has few keywords (${frontmatter.keywords.split(',').length}, should have 5-10 for better SEO)`)
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    stats: {
      wordCount,
      h2Count: h2Matches ? h2Matches.length : 0,
      codeBlocks: codeBlockMatches ? codeBlockMatches.length / 2 : 0
    }
  }
}

// Fix common format issues
function fixBlogFormat(filename) {
  const content = readFile(filename)
  if (!content) {
    return { fixed: false, error: 'File not found' }
  }

  let fixedContent = content
  let changes = []

  // Fix 1: Ensure frontmatter format
  if (!content.startsWith('---\n')) {
    fixedContent = '---\n' + fixedContent
    changes.push('Added frontmatter start')
  }

  // Fix 2: Ensure proper spacing after frontmatter
  const frontmatterEnd = fixedContent.indexOf('\n---\n')
  if (frontmatterEnd !== -1) {
    const afterFrontmatter = fixedContent.substring(frontmatterEnd + 5)
    if (!afterFrontmatter.startsWith('\n')) {
      fixedContent = fixedContent.substring(0, frontmatterEnd + 5) + '\n' + afterFrontmatter
      changes.push('Added spacing after frontmatter')
    }
  }

  // Fix 3: Ensure H1 matches title (if H1 exists)
  const h1Match = fixedContent.match(/^---\n[\s\S]*?\n---\n\n#\s+(.+)$/m)
  if (h1Match) {
    // H1 is there, we'll leave it as is (user may want to keep it different)
  } else {
    // Check if we need to add H1
    const frontmatterMatch = fixedContent.match(/^---\n([\s\S]*?)\n---\n\n([\s\S]*)$/)
    if (frontmatterMatch) {
      const frontmatterText = frontmatterMatch[1]
      const body = frontmatterMatch[2]
      const titleMatch = frontmatterText.match(/^title:\s*["']([^"']+)["']$/m)
      if (titleMatch && !body.trim().startsWith('#')) {
        const title = titleMatch[1]
        fixedContent = fixedContent.replace(
          /^---\n[\s\S]*?\n---\n\n/,
          `---\n${frontmatterText}\n---\n\n# ${title}\n\n`
        )
        changes.push('Added H1 heading matching title')
      }
    }
  }

  // Fix 4: Remove trailing whitespace
  const lines = fixedContent.split('\n')
  const cleanedLines = lines.map(line => line.replace(/\s+$/, ''))
  if (cleanedLines.join('\n') !== fixedContent) {
    fixedContent = cleanedLines.join('\n') + '\n'
    changes.push('Removed trailing whitespace')
  }

  return {
    fixed: changes.length > 0,
    changes,
    content: fixedContent
  }
}

// Main execution
const files = process.argv.slice(2)

if (files.length === 0) {
  // Validate all files
  const allFiles = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'))
  console.log(`Validating ${allFiles.length} blog files...\n`)
  
  let totalErrors = 0
  let totalWarnings = 0
  const filesWithIssues = []

  allFiles.forEach(filename => {
    const result = validateBlogFormat(filename)
    if (!result.valid || result.warnings.length > 0) {
      filesWithIssues.push({ filename, ...result })
      totalErrors += result.errors.length
      totalWarnings += result.warnings.length
    }
  })

  // Report results
  console.log(`\n📊 Validation Summary:`)
  console.log(`   Total files: ${allFiles.length}`)
  console.log(`   Files with issues: ${filesWithIssues.length}`)
  console.log(`   Total errors: ${totalErrors}`)
  console.log(`   Total warnings: ${totalWarnings}`)

  if (filesWithIssues.length > 0) {
    console.log(`\n📝 Files with issues:\n`)
    filesWithIssues.slice(0, 10).forEach(({ filename, errors, warnings, stats }) => {
      console.log(`\n${filename}:`)
      if (errors.length > 0) {
        errors.forEach(e => console.log(`  ❌ ${e}`))
      }
      if (warnings.length > 0) {
        warnings.forEach(w => console.log(`  ⚠️  ${w}`))
      }
      if (stats) {
        console.log(`  📊 ${stats.wordCount} words, ${stats.h2Count} H2 sections, ${stats.codeBlocks} code blocks`)
      }
    })
    if (filesWithIssues.length > 10) {
      console.log(`\n... and ${filesWithIssues.length - 10} more files with issues`)
    }
  } else {
    console.log(`\n✅ All files validated successfully!`)
  }
} else {
  // Validate specific files
  files.forEach(filename => {
    if (!filename.endsWith('.md')) {
      console.log(`⏭️  Skipping ${filename} (not a .md file)`)
      return
    }

    console.log(`\nValidating ${filename}...`)
    const result = validateBlogFormat(filename)
    
    if (result.valid && result.warnings.length === 0) {
      console.log(`✅ ${filename} is valid!`)
      if (result.stats) {
        console.log(`   Stats: ${result.stats.wordCount} words, ${result.stats.h2Count} H2 sections`)
      }
    } else {
      if (result.errors.length > 0) {
        console.log(`❌ Errors:`)
        result.errors.forEach(e => console.log(`   - ${e}`))
      }
      if (result.warnings.length > 0) {
        console.log(`⚠️  Warnings:`)
        result.warnings.forEach(w => console.log(`   - ${w}`))
      }
      if (result.stats) {
        console.log(`📊 Stats: ${result.stats.wordCount} words, ${result.stats.h2Count} H2 sections`)
      }
    }
  })
}

