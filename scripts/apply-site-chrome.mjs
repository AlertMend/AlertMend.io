// Gives hand-authored static blog posts (public/blog/<slug>/index.html, copied
// into dist by Vite) the same header and footer as the rest of the site.
// Runs after `vite build`. Idempotent: pages already carrying the site chrome
// are skipped.
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const blogDist = path.join(__dirname, '../dist/blog')
const MARKER = 'data-site-chrome="1"'

const CSS = `
  <style ${MARKER}>
    .navbar { position: sticky !important; top: 0; border-bottom: 1px solid rgba(11,18,32,0.08) !important; box-shadow: none !important; background: rgba(255,255,255,0.97) !important; }
    .navbar-content { height: 64px; display: flex; align-items: center; justify-content: space-between; }
    .am-lockup { display: block; height: 28px; width: 83px; flex: none; background-color: #6d28d9; -webkit-mask: url(/logos/alertmend-lockup-mask.svg) no-repeat center / contain; mask: url(/logos/alertmend-lockup-mask.svg) no-repeat center / contain; }
    .am-lockup-light { background-color: #e2e8f0; }
    .navbar-link { color: #27272a !important; font-weight: 500; }
    .navbar-button { border-radius: 8px !important; font-weight: 600 !important; }
    .navbar-button-primary { background: #0b1220 !important; color: #fff !important; }
    .navbar-button-primary:hover { background: #1e293b !important; }
    .navbar-button-secondary { color: #3f3f46 !important; background: transparent !important; }
    .navbar-button-outline { border: 1px solid rgba(11,18,32,0.18); color: #0b1220 !important; background: #fff; }
    .navbar-mobile-cta { display: inline-flex; }
    @media (min-width: 1024px) { .navbar-mobile-cta { display: none !important; } }
    .main-container { padding-top: 48px !important; }
    .site-footer, .site-footer * { text-align: left; }
    .site-footer-cols a, .site-footer-base a { font-weight: 400 !important; }
    .site-footer { margin-top: 64px; background: #0b1220; color: #cbd5e1; font-family: inherit; }
    .site-footer-inner { max-width: 1280px; margin: 0 auto; padding: 56px 24px 40px; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 2fr); gap: 40px; }
    .site-footer-brand p { margin-top: 16px; max-width: 320px; font-size: 14px; line-height: 1.6; color: #94a3b8; }
    .site-footer-cols { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 24px; }
    .site-footer-cols a { display: block; margin-bottom: 10px; font-size: 14px; color: #e2e8f0; text-decoration: none; }
    .site-footer-cols a:hover { color: #fff; text-decoration: underline; }
    .site-footer-h { margin: 0 0 14px; font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #94a3b8; }
    .site-footer-base { max-width: 1280px; margin: 0 auto; padding: 20px 24px 32px; display: flex; justify-content: space-between; gap: 16px; border-top: 1px solid rgba(255,255,255,0.08); font-size: 13px; color: #94a3b8; }
    .site-footer-base a { color: #cbd5e1; text-decoration: none; }
    @media (max-width: 700px) { .main-container table { display: block; max-width: 100%; overflow-x: auto; } }
    @media (max-width: 800px) {
      .site-footer-inner { grid-template-columns: 1fr; }
      .site-footer-cols { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .site-footer-base { flex-direction: column; }
    }
  </style>`

function nav(slug) {
  const signup = `https://app.alertmend.io/signup?source=blog-post&blog_slug=${encodeURIComponent(slug)}`
  const demo = `https://calendly.com/hello-alertmend/30min?utm_source=alertmend.io&utm_medium=blog-post&utm_campaign=blog-${encodeURIComponent(slug)}`
  return `<nav class="navbar" aria-label="Main">
    <div class="navbar-container">
      <div class="navbar-content">
        <a href="/" class="navbar-logo" aria-label="AlertMend home"><span class="am-lockup" aria-hidden="true"></span></a>
        <div class="navbar-links">
          <a href="/observability" class="navbar-link">Platform</a>
          <a href="/data-observability" class="navbar-link">Data governance</a>
          <a href="/industries" class="navbar-link">Industries</a>
          <a href="/pricing" class="navbar-link">Pricing</a>
          <a href="/case-studies" class="navbar-link">Customers</a>
          <a href="/blog" class="navbar-link active" aria-current="page">Blog</a>
        </div>
        <div class="navbar-actions">
          <a href="https://app.alertmend.io" class="navbar-button navbar-button-secondary">Sign in</a>
          <a href="${signup}" target="_blank" rel="noopener noreferrer" class="navbar-button navbar-button-outline">Start free</a>
          <a href="${demo}" target="_blank" rel="noopener noreferrer" class="navbar-button navbar-button-primary">Book a demo</a>
        </div>
        <a href="${demo}" target="_blank" rel="noopener noreferrer" class="navbar-button navbar-button-primary navbar-mobile-cta">Book a demo</a>
      </div>
    </div>
  </nav>`
}

const FOOTER = `
  <footer class="site-footer">
    <div class="site-footer-inner">
      <div class="site-footer-brand">
        <span class="am-lockup am-lockup-light" aria-hidden="true"></span>
        <p>Data observability and infrastructure observability, with AI root cause and fixes your team approves.</p>
      </div>
      <div class="site-footer-cols">
        <div><p class="site-footer-h">Data</p><a href="/data-observability">Data observability</a><a href="/trust">Trust center</a><a href="/industries">Industries</a></div>
        <div><p class="site-footer-h">Infrastructure</p><a href="/observability">Observability and APM</a><a href="/ai-rca">AI RCA</a><a href="/auto-remediation">Automated fixes</a><a href="/kubernetes-management">Kubernetes</a></div>
        <div><p class="site-footer-h">Resources</p><a href="/blog">Blog</a><a href="/documentation">Documentation</a><a href="/case-studies">Case studies</a><a href="/help">Help center</a></div>
        <div><p class="site-footer-h">Company</p><a href="/about">About</a><a href="/security">Security</a><a href="/pricing">Pricing</a><a href="/contact">Contact</a></div>
      </div>
    </div>
    <div class="site-footer-base">
      <span>© ${new Date().getFullYear()} AlertMend. All rights reserved.</span>
      <span><a href="/privacy">Privacy</a> · <a href="/terms">Terms</a></span>
    </div>
  </footer>
`

let updated = 0
for (const entry of fs.readdirSync(blogDist, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue
  const file = path.join(blogDist, entry.name, 'index.html')
  if (!fs.existsSync(file)) continue
  let html = fs.readFileSync(file, 'utf8')
  if (html.includes(MARKER)) continue
  // Only pages still carrying the old blog header.
  if (!html.includes('href="/#how-it-works"')) continue
  html = html.replace(/<nav class="navbar">[\s\S]*?<\/nav>/, nav(entry.name))
  html = html.replace('</head>', `${CSS}\n</head>`)
  if (!html.includes('class="site-footer"')) html = html.replace(/<\/body>(?![\s\S]*<\/body>)/, `${FOOTER}</body>`)
  html = html.replace(/alt="AlertMend AI"/g, 'alt="AlertMend"')
  fs.writeFileSync(file, html)
  updated++
}
console.log(`✓ Applied site header and footer to ${updated} hand-authored blog pages`)
