import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const blogDir = path.join(__dirname, '../dist/blog')
const issues = []

// Get all HTML files (excluding index.html)
const htmlFiles = fs.readdirSync(blogDir)
  .filter(file => file.endsWith('.html') && file !== 'index.html')
  .map(file => ({
    file,
    slug: file.replace('.html', '')
  }))

console.log(`\n🔍 Verifying canonical URLs for ${htmlFiles.length} blogs...\n`)

htmlFiles.forEach(({ file, slug }) => {
  const htmlPath = path.join(blogDir, file)
  const dirPath = path.join(blogDir, slug, 'index.html')
  
  // Check HTML file
  if (!fs.existsSync(htmlPath)) {
    issues.push({ type: 'missing', file: file, issue: 'HTML file does not exist' })
    return
  }
  
  const htmlContent = fs.readFileSync(htmlPath, 'utf-8')
  const htmlCanonicalMatch = htmlContent.match(/<link rel="canonical" href="([^"]+)">/)
  
  if (!htmlCanonicalMatch) {
    issues.push({ type: 'missing', file: file, issue: 'Missing canonical URL in HTML file' })
  } else {
    const htmlCanonical = htmlCanonicalMatch[1]
    const expectedHtml = `https://www.alertmend.io/blog/${slug}.html`
    if (htmlCanonical !== expectedHtml) {
      issues.push({
        type: 'incorrect',
        file: file,
        issue: 'HTML file has incorrect canonical URL',
        found: htmlCanonical,
        expected: expectedHtml
      })
    }
  }
  
  // Check directory/index.html file
  if (!fs.existsSync(dirPath)) {
    issues.push({ type: 'missing', file: `${slug}/index.html`, issue: 'Directory index.html does not exist' })
    return
  }
  
  const dirContent = fs.readFileSync(dirPath, 'utf-8')
  const dirCanonicalMatch = dirContent.match(/<link rel="canonical" href="([^"]+)">/)
  
  if (!dirCanonicalMatch) {
    issues.push({ type: 'missing', file: `${slug}/index.html`, issue: 'Missing canonical URL in directory/index.html' })
  } else {
    const dirCanonical = dirCanonicalMatch[1]
    const expectedDir = `https://www.alertmend.io/blog/${slug}`
    if (dirCanonical !== expectedDir) {
      issues.push({
        type: 'incorrect',
        file: `${slug}/index.html`,
        issue: 'Directory/index.html has incorrect canonical URL',
        found: dirCanonical,
        expected: expectedDir
      })
    }
  }
})

// Summary
console.log('='.repeat(80))
console.log('CANONICAL URL VERIFICATION RESULTS')
console.log('='.repeat(80))

if (issues.length === 0) {
  console.log('\n✅ ALL CANONICAL URLs ARE CORRECT!\n')
  console.log(`   ✓ ${htmlFiles.length} HTML files have canonical with .html extension`)
  console.log(`   ✓ ${htmlFiles.length} directory/index.html files have canonical without .html extension`)
  console.log('\n   Format verification:')
  console.log('   - HTML files: https://www.alertmend.io/blog/{slug}.html ✓')
  console.log('   - Directory files: https://www.alertmend.io/blog/{slug} ✓')
} else {
  console.log(`\n❌ Found ${issues.length} issue(s):\n`)
  
  const missingIssues = issues.filter(i => i.type === 'missing')
  const incorrectIssues = issues.filter(i => i.type === 'incorrect')
  
  if (missingIssues.length > 0) {
    console.log('Missing canonical URLs:')
    missingIssues.forEach((issue, idx) => {
      console.log(`  ${idx + 1}. ${issue.file}: ${issue.issue}`)
    })
    console.log('')
  }
  
  if (incorrectIssues.length > 0) {
    console.log('Incorrect canonical URLs:')
    incorrectIssues.forEach((issue, idx) => {
      console.log(`  ${idx + 1}. ${issue.file}`)
      console.log(`     Issue: ${issue.issue}`)
      console.log(`     Found: ${issue.found}`)
      console.log(`     Expected: ${issue.expected}`)
      console.log('')
    })
  }
}

// Show sample verification
console.log('\n' + '='.repeat(80))
console.log('SAMPLE VERIFICATION')
console.log('='.repeat(80))

const sampleSlug = htmlFiles[0].slug
const sampleHtml = fs.readFileSync(path.join(blogDir, `${sampleSlug}.html`), 'utf-8')
const sampleDir = fs.readFileSync(path.join(blogDir, sampleSlug, 'index.html'), 'utf-8')

const sampleHtmlCanonical = sampleHtml.match(/<link rel="canonical" href="([^"]+)">/)?.[1]
const sampleDirCanonical = sampleDir.match(/<link rel="canonical" href="([^"]+)">/)?.[1]

console.log(`\nSample blog: ${sampleSlug}\n`)
console.log(`HTML file canonical:     ${sampleHtmlCanonical}`)
console.log(`Directory file canonical: ${sampleDirCanonical}`)
console.log(`\n✓ HTML has .html extension: ${sampleHtmlCanonical?.endsWith('.html') ? 'YES' : 'NO'}`)
console.log(`✓ Directory has no .html: ${!sampleDirCanonical?.endsWith('.html') ? 'YES' : 'NO'}`)

process.exit(issues.length > 0 ? 1 : 0)

