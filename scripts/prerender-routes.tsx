import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { HelmetProvider } from '../src/lib/helmet'
import App from '../src/App'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const distDir = path.join(__dirname, '../dist')
const manifestPath = path.join(distDir, '.vite/manifest.json')

if (!fs.existsSync(manifestPath)) {
  console.error('✗ Manifest file not found. Make sure to run `vite build` before prerendering.')
  process.exit(1)
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))
// Find the entry point (usually index.html or the entry with isEntry: true)
const entryKey = 'index.html'
const entry = manifest[entryKey] || Object.values(manifest).find((m: any) => m.isEntry)

if (!entry) {
  console.error('✗ Unable to find entry point in manifest. Cannot prerender pages.')
  process.exit(1)
}

const makeModulePreloadLinks = (entryName: string, seen = new Set<string>()): string => {
  const chunk = manifest[entryName]
  if (!chunk || seen.has(entryName)) {
    return ''
  }
  seen.add(entryName)
  let links = ''
  if (chunk.imports) {
    chunk.imports.forEach((importName: string) => {
      const imported = manifest[importName]
      if (imported) {
        links += `<link rel="modulepreload" href="/${imported.file}" crossorigin />\n`
        if (imported.css) {
          imported.css.forEach((cssFile: string) => {
            links += `<link rel="stylesheet" href="/${cssFile}" />\n`
          })
        }
        links += makeModulePreloadLinks(importName, seen)
      }
    })
  }
  return links
}

// Get all CSS files from the entry and its imports
const getAllCssFiles = (entryName: string, seen = new Set<string>()): string[] => {
  const chunk = manifest[entryName]
  if (!chunk || seen.has(entryName)) {
    return []
  }
  seen.add(entryName)
  let cssFiles: string[] = []
  
  // Add CSS from this chunk
  if (chunk.css) {
    cssFiles.push(...chunk.css)
  }
  
  // Add CSS from imported chunks
  if (chunk.imports) {
    chunk.imports.forEach((importName: string) => {
      cssFiles.push(...getAllCssFiles(importName, seen))
    })
  }
  
  return cssFiles
}

const scriptTag = `<script type="module" crossorigin src="/${entry.file}"></script>`
const allCssFiles = getAllCssFiles(entryKey)
const cssLinks = allCssFiles.map((cssFile: string) => `<link rel="stylesheet" href="/${cssFile}">`).join('\n')
const preloadLinks = makeModulePreloadLinks(entryKey)

const routesToPrerender = [
  '/',
  '/auto-remediation',
  '/kubernetes-management',
  '/on-call-management',
  '/kubernetes-cost-optimization',
  '/pricing',
  '/case-studies',
  '/about',
  '/partners',
  '/documentation',
  '/contact',
  '/careers',
  '/security',
  '/compliance',
  '/terms',
  '/privacy',
  '/help',
  '/community',
  '/tutorials',
  '/webinars'
]

const outputPathForRoute = (route: string) => {
  if (route === '/') {
    return path.join(distDir, 'index.html')
  }
  const routePath = route.replace(/^\//, '')
  return path.join(distDir, routePath, 'index.html')
}

const ensureDirForFile = (filePath: string) => {
  const dir = path.dirname(filePath)
  fs.mkdirSync(dir, { recursive: true })
}

console.log('\nPrerendering static HTML for marketing pages...')

routesToPrerender.forEach((route) => {
  const helmetContext: { helmet?: any } = {}
  const markup = ReactDOMServer.renderToString(
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={route}>
        <App />
      </StaticRouter>
    </HelmetProvider>
  )

  const { helmet } = helmetContext
  const htmlAttrs = helmet?.htmlAttributes?.toString() || 'lang="en"'
  const bodyAttrs = helmet?.bodyAttributes?.toString() || ''

  const head = `
  <meta charset="utf-8" />
  <!-- Favicon - uses SVG logo -->
  <link rel="icon" type="image/svg+xml" href="/logos/alertmend-logo.svg" />
  <link rel="apple-touch-icon" href="/logos/alertmend-logo.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-Z8QSJ5NK95"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-Z8QSJ5NK95');
  </script>
  ${cssLinks}
  ${helmet?.title?.toString() || '<title>AlertMend AI</title>'}
  ${helmet?.meta?.toString() || ''}
  ${helmet?.link?.toString() || ''}
  ${preloadLinks}
  <!-- SearchAtlas Dynamic Optimization -->
  <script nowprocket nitro-exclude type="text/javascript" id="sa-dynamic-optimization" data-uuid="457086dd-8bfb-46dd-a38d-2f4a6efd0e7e" src="data:text/javascript;base64,dmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoInNjcmlwdCIpO3NjcmlwdC5zZXRBdHRyaWJ1dGUoIm5vd3Byb2NrZXQiLCAiIik7c2NyaXB0LnNldEF0dHJpYnV0ZSgibml0cm8tZXhjbHVkZSIsICIiKTtzY3JpcHQuc3JjID0gImh0dHBzOi8vZGFzaGJvYXJkLnNlYXJjaGF0bGFzLmNvbS9zY3JpcHRzL2R5bmFtaWNfb3B0aW1pemF0aW9uLmpzIjtzY3JpcHQuZGF0YXNldC51dWlkID0gIjQ1NzA4NmRkLThiZmItNDZkZC1hMzhkLTJmNGE2ZWZkMGU3ZSI7c2NyaXB0LmlkID0gInNhLWR5bmFtaWMtb3B0aW1pemF0aW9uLWxvYWRlciI7ZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpOw=="></script>
  `

  const document = `<!DOCTYPE html>
<html ${htmlAttrs}>
<head>
${head}
</head>
<body ${bodyAttrs}>
  <div id="root">${markup}</div>
  ${scriptTag}
</body>
</html>`

  const outputFile = outputPathForRoute(route)
  ensureDirForFile(outputFile)
  fs.writeFileSync(outputFile, document.trim(), 'utf-8')
  console.log(`✓ Prerendered ${route} -> ${path.relative(distDir, outputFile)}`)
})

console.log('✓ Prerendering complete.\n')

