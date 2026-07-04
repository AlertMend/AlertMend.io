import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const blogDir = path.join(__dirname, '../dist/blog')
const issues = []

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

process.exit(issues.length > 0 ? 1 : 0)
