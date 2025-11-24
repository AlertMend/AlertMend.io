import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const blogDir = path.join(__dirname, '../dist/blog')

console.log('🧪 Testing blog navigation links...\n')

// Test 1: Check if related content links are anchor tags (not buttons)
console.log('Test 1: Checking related content links structure...')
const testHtmlFile = path.join(blogDir, 'oomkilled-in-kubernetes.html')
if (fs.existsSync(testHtmlFile)) {
  const content = fs.readFileSync(testHtmlFile, 'utf-8')
  
  // Check for related content section
  const relatedContentMatch = content.match(/<!-- Related Content -->([\s\S]*?)<!-- Additional Internal Links -->/)
  if (relatedContentMatch) {
    const relatedContent = relatedContentMatch[1]
    
    // Check if links are anchor tags
    const buttonMatches = relatedContent.match(/<button[^>]*onclick[^>]*>/gi)
    const anchorMatches = relatedContent.match(/<a[^>]*href=["']\/blog\//gi)
    
    if (buttonMatches && buttonMatches.length > 0) {
      console.log('  ❌ Found buttons with onclick in related content')
      console.log(`     Found ${buttonMatches.length} button(s)`)
    } else if (anchorMatches && anchorMatches.length > 0) {
      console.log(`  ✅ Related content uses anchor tags (${anchorMatches.length} links found)`)
    } else {
      console.log('  ⚠️  No related content links found')
    }
  } else {
    console.log('  ⚠️  Related content section not found')
  }
} else {
  console.log('  ⚠️  Test file not found')
}

// Test 2: Check if links have proper href attributes
console.log('\nTest 2: Checking link href attributes...')
if (fs.existsSync(testHtmlFile)) {
  const content = fs.readFileSync(testHtmlFile, 'utf-8')
  const linkMatches = content.matchAll(/<a[^>]*class=["']related-post-link["'][^>]*href=["']([^"']+)["']/gi)
  const links = Array.from(linkMatches)
  
  if (links.length > 0) {
    console.log(`  ✅ Found ${links.length} related content links with proper href attributes:`)
    links.slice(0, 3).forEach((match, idx) => {
      console.log(`     ${idx + 1}. ${match[1]}`)
    })
  } else {
    console.log('  ⚠️  No related content links found')
  }
}

// Test 3: Check for duplicate onclick handlers
console.log('\nTest 3: Checking for duplicate event handlers...')
if (fs.existsSync(testHtmlFile)) {
  const content = fs.readFileSync(testHtmlFile, 'utf-8')
  
  // Check if there are multiple onclick handlers on the same element
  const onclickMatches = content.matchAll(/onclick=["']([^"']+)["']/gi)
  const onclicks = Array.from(onclickMatches)
  
  if (onclicks.length > 0) {
    console.log(`  ⚠️  Found ${onclicks.length} onclick handler(s) in HTML`)
    // Check if any are in related content section
    const relatedSection = content.match(/<!-- Related Content -->([\s\S]*?)<!-- Additional Internal Links -->/)
    if (relatedSection) {
      const relatedOnclicks = relatedSection[1].match(/onclick=/gi)
      if (relatedOnclicks) {
        console.log(`  ❌ Found ${relatedOnclicks.length} onclick handler(s) in related content section`)
      } else {
        console.log('  ✅ No onclick handlers in related content section (using anchor tags)')
      }
    }
  } else {
    console.log('  ✅ No onclick handlers found (using standard anchor tags)')
  }
}

console.log('\n✅ Navigation link testing complete!')
console.log('\n📝 Summary:')
console.log('   - Related content links should use anchor tags with href attributes')
console.log('   - No onclick handlers should be on related content links')
console.log('   - React component uses preventDefault and stopPropagation to prevent multiple navigations')

