import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const blogDir = path.join(__dirname, '../dist/blog')
const issues = []

// Check all .html files
const htmlFiles = fs.readdirSync(blogDir).filter(file => file.endsWith('.html') && file !== 'index.html')

console.log(`Checking ${htmlFiles.length} .html files...\n`)

htmlFiles.forEach(file => {
  const filePath = path.join(blogDir, file)
  const slug = file.replace('.html', '')
  const content = fs.readFileSync(filePath, 'utf-8')
  
  const canonicalMatch = content.match(/<link rel="canonical" href="([^"]+)">/)
  if (!canonicalMatch) {
    issues.push({
      file: file,
      issue: 'Missing canonical URL',
      expected: `https://www.alertmend.io/blog/${slug}.html`
    })
  } else {
    const canonical = canonicalMatch[1]
    const expected = `https://www.alertmend.io/blog/${slug}.html`
    if (canonical !== expected) {
      issues.push({
        file: file,
        issue: 'Incorrect canonical URL',
        found: canonical,
        expected: expected
      })
    }
  }
})

// Check all directory/index.html files
const dirs = fs.readdirSync(blogDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name)

console.log(`Checking ${dirs.length} directory/index.html files...\n`)

dirs.forEach(dir => {
  const indexPath = path.join(blogDir, dir, 'index.html')
  if (!fs.existsSync(indexPath)) {
    issues.push({
      file: `${dir}/index.html`,
      issue: 'Missing index.html file'
    })
    return
  }
  
  const content = fs.readFileSync(indexPath, 'utf-8')
  const canonicalMatch = content.match(/<link rel="canonical" href="([^"]+)">/)
  if (!canonicalMatch) {
    issues.push({
      file: `${dir}/index.html`,
      issue: 'Missing canonical URL',
      expected: `https://www.alertmend.io/blog/${dir}`
    })
  } else {
    const canonical = canonicalMatch[1]
    const expected = `https://www.alertmend.io/blog/${dir}`
    if (canonical !== expected) {
      issues.push({
        file: `${dir}/index.html`,
        issue: 'Incorrect canonical URL',
        found: canonical,
        expected: expected
      })
    }
  }
})

// Summary
console.log('\n' + '='.repeat(80))
console.log('CANONICAL URL CHECK SUMMARY')
console.log('='.repeat(80))

if (issues.length === 0) {
  console.log('✅ All canonical URLs are correct!')
  console.log(`   - ${htmlFiles.length} .html files checked`)
  console.log(`   - ${dirs.length} directory/index.html files checked`)
} else {
  console.log(`❌ Found ${issues.length} issue(s):\n`)
  issues.forEach((issue, index) => {
    console.log(`${index + 1}. ${issue.file}`)
    console.log(`   Issue: ${issue.issue}`)
    if (issue.found) {
      console.log(`   Found: ${issue.found}`)
    }
    if (issue.expected) {
      console.log(`   Expected: ${issue.expected}`)
    }
    console.log('')
  })
}

// Check for consistency between .html and directory versions
console.log('\n' + '='.repeat(80))
console.log('CONSISTENCY CHECK')
console.log('='.repeat(80))

let consistencyIssues = 0
htmlFiles.forEach(file => {
  const slug = file.replace('.html', '')
  const htmlPath = path.join(blogDir, file)
  const dirPath = path.join(blogDir, slug, 'index.html')
  
  if (!fs.existsSync(dirPath)) {
    consistencyIssues++
    console.log(`⚠️  ${slug}: Has .html file but missing directory/index.html`)
  }
})

dirs.forEach(dir => {
  const htmlFile = `${dir}.html`
  const htmlPath = path.join(blogDir, htmlFile)
  
  if (!fs.existsSync(htmlPath)) {
    consistencyIssues++
    console.log(`⚠️  ${dir}: Has directory/index.html but missing .html file`)
  }
})

if (consistencyIssues === 0) {
  console.log('✅ All blogs have both .html and directory versions')
} else {
  console.log(`\n⚠️  Found ${consistencyIssues} consistency issue(s)`)
}

process.exit(issues.length > 0 || consistencyIssues > 0 ? 1 : 0)

