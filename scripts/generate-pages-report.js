import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const distDir = path.join(__dirname, '../dist')
const blogDir = path.join(__dirname, '../dist/blog')
const reportPath = path.join(__dirname, '../PAGES_REPORT.md')

const report = {
  generatedAt: new Date().toISOString(),
  summary: {
    totalPages: 0,
    blogPages: 0,
    otherPages: 0,
    issues: []
  },
  pages: []
}

// Helper function to extract metadata from HTML
function extractMetadata(htmlContent, filePath) {
  const metadata = {
    title: '',
    description: '',
    canonical: '',
    ogUrl: '',
    twitterUrl: '',
    hasTitle: false,
    hasDescription: false,
    hasCanonical: false,
    hasOgUrl: false,
    hasTwitterUrl: false
  }
  
  // Extract title (handle both with and without data-rh attribute)
  const titleMatch = htmlContent.match(/<title[^>]*>([^<]+)<\/title>/i)
  if (titleMatch) {
    metadata.title = titleMatch[1].trim()
    metadata.hasTitle = true
  }
  
  // Extract meta description (handle both with and without data-rh attribute)
  const descMatch = htmlContent.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i)
  if (descMatch) {
    metadata.description = descMatch[1].trim().replace(/&#x27;/g, "'").replace(/&quot;/g, '"')
    metadata.hasDescription = true
  }
  
  // Extract canonical URL (handle both with and without data-rh attribute)
  const canonicalMatch = htmlContent.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i)
  if (canonicalMatch) {
    metadata.canonical = canonicalMatch[1].trim()
    metadata.hasCanonical = true
  }
  
  // Extract Open Graph URL (handle both with and without data-rh attribute)
  const ogUrlMatch = htmlContent.match(/<meta[^>]*property=["']og:url["'][^>]*content=["']([^"']+)["']/i)
  if (ogUrlMatch) {
    metadata.ogUrl = ogUrlMatch[1].trim()
    metadata.hasOgUrl = true
  }
  
  // Extract Twitter URL (handle both with and without data-rh attribute)
  const twitterUrlMatch = htmlContent.match(/<meta[^>]*name=["']twitter:url["'][^>]*content=["']([^"']+)["']/i)
  if (twitterUrlMatch) {
    metadata.twitterUrl = twitterUrlMatch[1].trim()
    metadata.hasTwitterUrl = true
  }
  
  return metadata
}

// Scan blog pages
console.log('📊 Scanning blog pages...')
const blogsHtmlDir = path.join(__dirname, '../dist/blogs')
const blogHtmlFiles = fs.existsSync(blogsHtmlDir)
  ? fs.readdirSync(blogsHtmlDir).filter(file => file.endsWith('.html'))
  : []

blogHtmlFiles.forEach(file => {
  const filePath = path.join(blogsHtmlDir, file)
  const slug = file.replace('.html', '')
  const htmlContent = fs.readFileSync(filePath, 'utf-8')
  const metadata = extractMetadata(htmlContent, filePath)
  
  const pageInfo = {
    type: 'blog-html',
    path: `/blogs/${file}`,
    slug: slug,
    file: `blogs/${file}`,
    ...metadata,
    issues: []
  }
  
  // Check for issues
  if (!metadata.hasTitle) pageInfo.issues.push('Missing title tag')
  if (!metadata.hasDescription) pageInfo.issues.push('Missing meta description')
  if (!metadata.hasCanonical) pageInfo.issues.push('Missing canonical URL')
  if (!metadata.hasOgUrl) pageInfo.issues.push('Missing Open Graph URL')
  if (!metadata.hasTwitterUrl) pageInfo.issues.push('Missing Twitter URL')
  
  // Check canonical URL format (should be /blogs/{slug}.html)
  if (metadata.hasCanonical && !metadata.canonical.includes('/blogs/')) {
    pageInfo.issues.push(`Canonical URL should be in /blogs/ directory (found: ${metadata.canonical})`)
  }
  if (metadata.hasCanonical && !metadata.canonical.endsWith('.html')) {
    pageInfo.issues.push(`Canonical URL should end with .html (found: ${metadata.canonical})`)
  }
  
  // Check if OG and Twitter URLs match canonical
  if (metadata.hasCanonical && metadata.hasOgUrl && metadata.canonical !== metadata.ogUrl) {
    pageInfo.issues.push(`Open Graph URL doesn't match canonical (OG: ${metadata.ogUrl}, Canonical: ${metadata.canonical})`)
  }
  
  if (metadata.hasCanonical && metadata.hasTwitterUrl && metadata.canonical !== metadata.twitterUrl) {
    pageInfo.issues.push(`Twitter URL doesn't match canonical (Twitter: ${metadata.twitterUrl}, Canonical: ${metadata.canonical})`)
  }
  
  report.pages.push(pageInfo)
  report.summary.blogPages++
  
  if (pageInfo.issues.length > 0) {
    report.summary.issues.push({
      page: pageInfo.path,
      issues: pageInfo.issues
    })
  }
})

// Scan blog directory/index.html files
const blogDirs = fs.readdirSync(blogDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name)

blogDirs.forEach(dir => {
  const indexPath = path.join(blogDir, dir, 'index.html')
  if (!fs.existsSync(indexPath)) return
  
  const htmlContent = fs.readFileSync(indexPath, 'utf-8')
  const metadata = extractMetadata(htmlContent, indexPath)
  
  const pageInfo = {
    type: 'blog-directory',
    path: `/blog/${dir}/`,
    slug: dir,
    file: `${dir}/index.html`,
    ...metadata,
    issues: []
  }
  
  // Check for issues
  if (!metadata.hasTitle) pageInfo.issues.push('Missing title tag')
  if (!metadata.hasDescription) pageInfo.issues.push('Missing meta description')
  if (!metadata.hasCanonical) pageInfo.issues.push('Missing canonical URL')
  if (!metadata.hasOgUrl) pageInfo.issues.push('Missing Open Graph URL')
  if (!metadata.hasTwitterUrl) pageInfo.issues.push('Missing Twitter URL')
  
  // Check canonical URL format (should NOT have .html)
  if (metadata.hasCanonical && metadata.canonical.endsWith('.html')) {
    pageInfo.issues.push(`Canonical URL should NOT end with .html (found: ${metadata.canonical})`)
  }
  
  // Check if OG and Twitter URLs match canonical
  if (metadata.hasCanonical && metadata.hasOgUrl && metadata.canonical !== metadata.ogUrl) {
    pageInfo.issues.push(`Open Graph URL doesn't match canonical (OG: ${metadata.ogUrl}, Canonical: ${metadata.canonical})`)
  }
  
  if (metadata.hasCanonical && metadata.hasTwitterUrl && metadata.canonical !== metadata.twitterUrl) {
    pageInfo.issues.push(`Twitter URL doesn't match canonical (Twitter: ${metadata.twitterUrl}, Canonical: ${metadata.canonical})`)
  }
  
  report.pages.push(pageInfo)
  report.summary.blogPages++
  
  if (pageInfo.issues.length > 0) {
    report.summary.issues.push({
      page: pageInfo.path,
      issues: pageInfo.issues
    })
  }
})

// Scan other pages in dist directory
console.log('📊 Scanning other pages...')
function scanDirectory(dir, basePath = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  
  entries.forEach(entry => {
    const fullPath = path.join(dir, entry.name)
    const relativePath = path.join(basePath, entry.name)
    
    if (entry.isDirectory()) {
      // Skip node_modules and other non-page directories
      if (['node_modules', '.git', 'assets', 'logos'].includes(entry.name)) {
        return
      }
      
      // Check for index.html in directory
      const indexPath = path.join(fullPath, 'index.html')
      if (fs.existsSync(indexPath)) {
        const htmlContent = fs.readFileSync(indexPath, 'utf-8')
        const metadata = extractMetadata(htmlContent, indexPath)
        
        const pageInfo = {
          type: 'page',
          path: `/${relativePath}/`,
          file: `${relativePath}/index.html`,
          ...metadata,
          issues: []
        }
        
        // Check for issues
        if (!metadata.hasTitle) pageInfo.issues.push('Missing title tag')
        if (!metadata.hasDescription) pageInfo.issues.push('Missing meta description')
        if (!metadata.hasCanonical) pageInfo.issues.push('Missing canonical URL')
        
        report.pages.push(pageInfo)
        report.summary.otherPages++
        
        if (pageInfo.issues.length > 0) {
          report.summary.issues.push({
            page: pageInfo.path,
            issues: pageInfo.issues
          })
        }
      }
      
      // Recursively scan subdirectories
      scanDirectory(fullPath, relativePath)
    } else if (entry.name === 'index.html' && basePath === '') {
      // Root index.html
      const htmlContent = fs.readFileSync(fullPath, 'utf-8')
      const metadata = extractMetadata(htmlContent, fullPath)
      
      const pageInfo = {
        type: 'page',
        path: '/',
        file: 'index.html',
        ...metadata,
        issues: []
      }
      
      // Check for issues
      if (!metadata.hasTitle) pageInfo.issues.push('Missing title tag')
      if (!metadata.hasDescription) pageInfo.issues.push('Missing meta description')
      if (!metadata.hasCanonical) pageInfo.issues.push('Missing canonical URL')
      
      report.pages.push(pageInfo)
      report.summary.otherPages++
      
      if (pageInfo.issues.length > 0) {
        report.summary.issues.push({
          page: pageInfo.path,
          issues: pageInfo.issues
        })
      }
    }
  })
}

scanDirectory(distDir)

report.summary.totalPages = report.pages.length

// Generate Markdown report
console.log('📝 Generating report...')

let markdown = `# Pages Report\n\n`
markdown += `**Generated:** ${new Date(report.generatedAt).toLocaleString()}\n\n`
markdown += `## Summary\n\n`
markdown += `- **Total Pages:** ${report.summary.totalPages}\n`
markdown += `- **Blog Pages:** ${report.summary.blogPages}\n`
markdown += `- **Other Pages:** ${report.summary.otherPages}\n`
markdown += `- **Pages with Issues:** ${report.summary.issues.length}\n\n`

if (report.summary.issues.length === 0) {
  markdown += `✅ **All pages are properly configured!**\n\n`
} else {
  markdown += `⚠️ **Found ${report.summary.issues.length} page(s) with issues**\n\n`
}

// Issues section
if (report.summary.issues.length > 0) {
  markdown += `## Issues\n\n`
  report.summary.issues.forEach((item, idx) => {
    markdown += `### ${idx + 1}. ${item.page}\n\n`
    item.issues.forEach(issue => {
      markdown += `- ❌ ${issue}\n`
    })
    markdown += `\n`
  })
}

// Blog pages section
const blogPages = report.pages.filter(p => p.type.startsWith('blog'))
markdown += `## Blog Pages (${blogPages.length})\n\n`
markdown += `### HTML Files (${blogPages.filter(p => p.type === 'blog-html').length})\n\n`
markdown += `| Slug | Title | Canonical URL | Issues |\n`
markdown += `|------|-------|---------------|--------|\n`

blogPages
  .filter(p => p.type === 'blog-html')
  .sort((a, b) => a.slug.localeCompare(b.slug))
  .forEach(page => {
    const title = page.title.substring(0, 50) + (page.title.length > 50 ? '...' : '')
    const issues = page.issues.length > 0 ? `❌ ${page.issues.length}` : '✅'
    markdown += `| ${page.slug} | ${title} | ${page.canonical || 'N/A'} | ${issues} |\n`
  })

markdown += `\n### Directory Files (${blogPages.filter(p => p.type === 'blog-directory').length})\n\n`
markdown += `| Slug | Title | Canonical URL | Issues |\n`
markdown += `|------|-------|---------------|--------|\n`

blogPages
  .filter(p => p.type === 'blog-directory')
  .sort((a, b) => a.slug.localeCompare(b.slug))
  .forEach(page => {
    const title = page.title.substring(0, 50) + (page.title.length > 50 ? '...' : '')
    const issues = page.issues.length > 0 ? `❌ ${page.issues.length}` : '✅'
    markdown += `| ${page.slug} | ${title} | ${page.canonical || 'N/A'} | ${issues} |\n`
  })

// Other pages section
const otherPages = report.pages.filter(p => p.type === 'page')
if (otherPages.length > 0) {
  markdown += `\n## Other Pages (${otherPages.length})\n\n`
  markdown += `| Path | Title | Canonical URL | Issues |\n`
  markdown += `|------|-------|---------------|--------|\n`
  
  otherPages
    .sort((a, b) => a.path.localeCompare(b.path))
    .forEach(page => {
      const title = page.title.substring(0, 50) + (page.title.length > 50 ? '...' : '')
      const issues = page.issues.length > 0 ? `❌ ${page.issues.length}` : '✅'
      markdown += `| ${page.path} | ${title} | ${page.canonical || 'N/A'} | ${issues} |\n`
    })
}

// Detailed issues section
if (report.summary.issues.length > 0) {
  markdown += `\n## Detailed Issues\n\n`
  report.summary.issues.forEach((item, idx) => {
    const page = report.pages.find(p => p.path === item.page)
    if (!page) return
    
    markdown += `### ${idx + 1}. ${item.page}\n\n`
    markdown += `**File:** ${page.file}\n\n`
    markdown += `**Title:** ${page.title || 'N/A'}\n\n`
    markdown += `**Canonical:** ${page.canonical || 'N/A'}\n\n`
    markdown += `**Issues:**\n\n`
    item.issues.forEach(issue => {
      markdown += `- ❌ ${issue}\n`
    })
    markdown += `\n`
  })
}

// Write report
fs.writeFileSync(reportPath, markdown, 'utf-8')
console.log(`\n✅ Report generated: ${reportPath}`)
console.log(`\n📊 Summary:`)
console.log(`   Total Pages: ${report.summary.totalPages}`)
console.log(`   Blog Pages: ${report.summary.blogPages}`)
console.log(`   Other Pages: ${report.summary.otherPages}`)
console.log(`   Pages with Issues: ${report.summary.issues.length}`)

