import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const blogDir = path.join(__dirname, '../public/blog')
const distBlogsDir = path.join(__dirname, '../dist/blogs')
const distBlogDir = path.join(__dirname, '../dist/blog')
const sitemapPath = path.join(__dirname, '../public/sitemap.xml')

const errors = []
const warnings = []

// Required frontmatter fields
const requiredFrontmatterFields = ['title', 'excerpt', 'date', 'category', 'author']
const recommendedFrontmatterFields = ['keywords']

// SEO validation rules
const SEO_RULES = {
  titleMinLength: 30,
  titleMaxLength: 60,
  descriptionMinLength: 50,
  descriptionMaxLength: 160,
  keywordsMinCount: 3,
}

// Helper function to parse frontmatter from markdown
function parseFrontmatter(content) {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!frontmatterMatch) {
    return { frontmatter: null, content: content }
  }
  
  const frontmatterText = frontmatterMatch[1]
  const markdownContent = frontmatterMatch[2]
  
  const frontmatter = {}
  frontmatterText.split('\n').forEach((line) => {
    const trimmed = line.trim()
    if (!trimmed) return
    
    // Handle keywords which may contain commas and quotes
    const keywordsMatch = trimmed.match(/^keywords:\s*["'](.+)["']$/)
    if (keywordsMatch) {
      frontmatter.keywords = keywordsMatch[1]
      return
    }
    
    // Match double-quoted strings
    const doubleQuotedMatch = trimmed.match(/^(\w+):\s*"([^"]*)"$/)
    // Match single-quoted strings
    const singleQuotedMatch = trimmed.match(/^(\w+):\s*'([^']*)'$/)
    // Match unquoted values
    const unquotedMatch = trimmed.match(/^(\w+):\s*(.+)$/)
    
    if (doubleQuotedMatch) {
      frontmatter[doubleQuotedMatch[1]] = doubleQuotedMatch[2]
    } else if (singleQuotedMatch) {
      frontmatter[singleQuotedMatch[1]] = singleQuotedMatch[2]
    } else if (unquotedMatch) {
      frontmatter[unquotedMatch[1]] = unquotedMatch[2].trim()
    }
  })
  
  return { frontmatter, content: markdownContent }
}

// Validate markdown file
function validateMarkdownFile(filePath, filename) {
  const content = fs.readFileSync(filePath, 'utf-8')
  const { frontmatter, content: markdownContent } = parseFrontmatter(content)
  
  if (!frontmatter) {
    errors.push(`❌ ${filename}: Missing frontmatter (must start with ---)`)
    return false
  }
  
  let isValid = true
  
  // Check required fields
  for (const field of requiredFrontmatterFields) {
    if (!frontmatter[field]) {
      errors.push(`❌ ${filename}: Missing required frontmatter field: ${field}`)
      isValid = false
    }
  }
  
  // Check recommended fields
  if (!frontmatter.keywords) {
    warnings.push(`⚠️  ${filename}: Missing recommended frontmatter field: keywords`)
  }
  
  // Validate title length (accounting for " | AlertMend AI" suffix which is 17 chars)
  if (frontmatter.title) {
    const titleWithSuffix = frontmatter.title + ' | AlertMend AI'
    if (titleWithSuffix.length < SEO_RULES.titleMinLength) {
      errors.push(`❌ ${filename}: Title too short (${titleWithSuffix.length} chars, min ${SEO_RULES.titleMinLength}): "${titleWithSuffix}"`)
      isValid = false
    }
    if (titleWithSuffix.length > SEO_RULES.titleMaxLength) {
      errors.push(`❌ ${filename}: Title too long (${titleWithSuffix.length} chars, max ${SEO_RULES.titleMaxLength}): "${titleWithSuffix}"`)
      isValid = false
    }
  }
  
  // Validate excerpt/description length
  if (frontmatter.excerpt) {
    if (frontmatter.excerpt.length < SEO_RULES.descriptionMinLength) {
      errors.push(`❌ ${filename}: Excerpt too short (${frontmatter.excerpt.length} chars, min ${SEO_RULES.descriptionMinLength}): "${frontmatter.excerpt}"`)
      isValid = false
    }
    if (frontmatter.excerpt.length > SEO_RULES.descriptionMaxLength) {
      errors.push(`❌ ${filename}: Excerpt too long (${frontmatter.excerpt.length} chars, max ${SEO_RULES.descriptionMaxLength}): "${frontmatter.excerpt}"`)
      isValid = false
    }
  }
  
  // Validate keywords count
  if (frontmatter.keywords) {
    const keywordCount = frontmatter.keywords.split(',').length
    if (keywordCount < SEO_RULES.keywordsMinCount) {
      warnings.push(`⚠️  ${filename}: Keywords count low (${keywordCount}, recommended ${SEO_RULES.keywordsMinCount}+)`)
    }
  }
  
  // Check if content has at least one H1
  if (!markdownContent.match(/^#\s+.+$/m)) {
    warnings.push(`⚠️  ${filename}: Content should start with H1 heading`)
  }
  
  return isValid
}

// Extract meta tag content from HTML
function extractMetaTag(html, tagName, attribute = 'content') {
  const regex = new RegExp(`<meta\\s+name=["']${tagName}["']\\s+content=["']([^"']+)["']`, 'i')
  const match = html.match(regex)
  return match ? match[1] : null
}

// Extract canonical URL from HTML
function extractCanonical(html) {
  const regex = /<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i
  const match = html.match(regex)
  return match ? match[1] : null
}

// Extract title from HTML
function extractTitle(html) {
  const regex = /<title>([^<]+)<\/title>/i
  const match = html.match(regex)
  return match ? match[1] : null
}

// Validate HTML file
function validateHTMLFile(htmlFilePath, slug) {
  if (!fs.existsSync(htmlFilePath)) {
    errors.push(`❌ ${slug}: HTML file not found at ${htmlFilePath}`)
    return false
  }
  
  const html = fs.readFileSync(htmlFilePath, 'utf-8')
  let isValid = true
  
  // Check if content is present in HTML body (ensures content loads on first hit)
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
  if (!bodyMatch || !bodyMatch[1]) {
    errors.push(`❌ ${slug}: Missing body content in HTML`)
    isValid = false
  } else {
    const bodyContent = bodyMatch[1]
    // Check if there's actual content (not just empty divs or loading placeholders)
    const textContent = bodyContent.replace(/<[^>]+>/g, '').trim()
    if (textContent.length < 500) {
      errors.push(`❌ ${slug}: Body content too short (${textContent.length} chars), content may not load properly on first hit`)
      isValid = false
    }
    
    // Check for loading placeholders that suggest content needs JS
    if (bodyContent.includes('Loading') && !bodyContent.includes('article-content')) {
      warnings.push(`⚠️  ${slug}: Possible loading placeholder detected, ensure content is server-rendered`)
    }
    
    // Ensure main article content is present
    if (!bodyContent.includes('article-content') && !bodyContent.includes('content')) {
      warnings.push(`⚠️  ${slug}: Main content area not found, content may not render correctly`)
    }
  }
  
  // Check required meta tags
  const title = extractTitle(html)
  const description = extractMetaTag(html, 'description')
  const keywords = extractMetaTag(html, 'keywords')
  const robots = extractMetaTag(html, 'robots')
  const canonical = extractCanonical(html)
  
  if (!title) {
    errors.push(`❌ ${slug}: Missing <title> tag`)
    isValid = false
  } else {
    // Validate title length
    if (title.length < SEO_RULES.titleMinLength || title.length > SEO_RULES.titleMaxLength) {
      errors.push(`❌ ${slug}: Title length invalid (${title.length} chars, should be ${SEO_RULES.titleMinLength}-${SEO_RULES.titleMaxLength}): "${title}"`)
      isValid = false
    }
  }
  
  if (!description) {
    errors.push(`❌ ${slug}: Missing meta description`)
    isValid = false
  } else {
    // Validate description length
    if (description.length < SEO_RULES.descriptionMinLength || description.length > SEO_RULES.descriptionMaxLength) {
      errors.push(`❌ ${slug}: Description length invalid (${description.length} chars, should be ${SEO_RULES.descriptionMinLength}-${SEO_RULES.descriptionMaxLength}): "${description}"`)
      isValid = false
    }
  }
  
  if (!keywords) {
    errors.push(`❌ ${slug}: Missing meta keywords`)
    isValid = false
  } else {
    const keywordCount = keywords.split(',').length
    if (keywordCount < SEO_RULES.keywordsMinCount) {
      warnings.push(`⚠️  ${slug}: Keywords count low (${keywordCount}, recommended ${SEO_RULES.keywordsMinCount}+)`)
    }
  }
  
  if (!robots) {
    errors.push(`❌ ${slug}: Missing meta robots tag`)
    isValid = false
  } else if (!robots.includes('index')) {
    errors.push(`❌ ${slug}: Meta robots should allow indexing (current: "${robots}")`)
    isValid = false
  }
  
  if (!canonical) {
    errors.push(`❌ ${slug}: Missing canonical URL`)
    isValid = false
  } else if (!canonical.startsWith('https://www.alertmend.io')) {
    errors.push(`❌ ${slug}: Canonical URL should start with https://www.alertmend.io (current: "${canonical}")`)
    isValid = false
  }
  
  // Check for structured data (JSON-LD)
  if (!html.includes('application/ld+json')) {
    warnings.push(`⚠️  ${slug}: Missing structured data (JSON-LD)`)
  }
  
  return isValid
}

// Check if blog is in sitemap
function checkSitemap(slug, sitemapContent) {
  // Check for both /blog/{slug} and /blogs/{slug}.html formats
  const blogPattern = new RegExp(`/blog/${slug.replace(/-/g, '-')}(?!-)`, 'i')
  const blogsPattern = new RegExp(`/blogs/[^<]*${slug.replace(/-/g, '-')}[^<]*\\.html`, 'i')
  
  if (!blogPattern.test(sitemapContent) && !blogsPattern.test(sitemapContent)) {
    errors.push(`❌ ${slug}: Not found in sitemap`)
    return false
  }
  return true
}

// Main validation function
function validateAllBlogs() {
  console.log('🔍 Starting blog validation...\n')
  
  // Step 1: Validate markdown files
  console.log('📝 Validating markdown files...')
  const markdownFiles = fs.readdirSync(blogDir).filter(file => file.endsWith('.md'))
  const slugs = []
  
  for (const file of markdownFiles) {
    const filePath = path.join(blogDir, file)
    const slug = file.replace('.md', '')
    slugs.push(slug)
    
    validateMarkdownFile(filePath, file)
  }
  
  console.log(`   ✓ Validated ${markdownFiles.length} markdown files\n`)
  
  // Step 2: Check if HTML files exist and validate them
  console.log('🌐 Validating generated HTML files...')
  
  let htmlFilesFound = 0
  for (const slug of slugs) {
    // Check in dist/blogs/ directory
    const htmlFiles = []
    
    // Try to find HTML file - it might have different casing
    if (fs.existsSync(distBlogsDir)) {
      const files = fs.readdirSync(distBlogsDir)
      // Normalize slug for comparison (handle case-insensitive matching)
      const normalizedSlug = slug.toLowerCase().replace(/-/g, '-')
      
      // Try exact match first
      let matchingFile = files.find(f => {
        const fileName = f.toLowerCase().replace('.html', '').replace(/-/g, '-')
        return fileName === normalizedSlug
      })
      
      // If no exact match, try fuzzy match (ignoring case and special characters)
      if (!matchingFile) {
        matchingFile = files.find(f => {
          const fileName = f.toLowerCase().replace('.html', '').replace(/[^a-z0-9-]/g, '')
          const normalizedSlugClean = normalizedSlug.replace(/[^a-z0-9-]/g, '')
          return fileName.includes(normalizedSlugClean) || normalizedSlugClean.includes(fileName)
        })
      }
      
      if (matchingFile) {
        htmlFiles.push(path.join(distBlogsDir, matchingFile))
      }
    }
    
    if (htmlFiles.length === 0) {
      // Only error if dist directory exists (might not exist on first run)
      if (fs.existsSync(distBlogsDir)) {
        errors.push(`❌ ${slug}: No HTML file found in dist/blogs/`)
      } else {
        warnings.push(`⚠️  ${slug}: dist/blogs/ directory not found (run build:blog first)`)
      }
    } else {
      htmlFilesFound++
      for (const htmlFile of htmlFiles) {
        validateHTMLFile(htmlFile, slug)
      }
    }
  }
  
  console.log(`   ✓ Validated ${htmlFilesFound} HTML files\n`)
  
  // Step 3: Validate sitemap
  console.log('🗺️  Validating sitemap...')
  if (fs.existsSync(sitemapPath)) {
    const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8')
    
    for (const slug of slugs) {
      checkSitemap(slug, sitemapContent)
    }
    
    console.log(`   ✓ Validated sitemap entries\n`)
  } else {
    errors.push('❌ Sitemap file not found')
  }
  
  // Step 4: Report results
  console.log('\n' + '='.repeat(60))
  console.log('📊 VALIDATION RESULTS')
  console.log('='.repeat(60) + '\n')
  
  if (warnings.length > 0) {
    console.log(`⚠️  WARNINGS (${warnings.length}):`)
    warnings.forEach(w => console.log(`   ${w}`))
    console.log('')
  }
  
  if (errors.length > 0) {
    console.log(`❌ ERRORS (${errors.length}):`)
    errors.forEach(e => console.log(`   ${e}`))
    console.log('')
    console.log('❌ Validation FAILED. Please fix the errors above before committing.')
    process.exit(1)
  } else {
    console.log('✅ All validations passed!')
    if (warnings.length > 0) {
      console.log(`   (${warnings.length} warnings - consider fixing these)`)
    }
    process.exit(0)
  }
}

// Run validation
validateAllBlogs()

