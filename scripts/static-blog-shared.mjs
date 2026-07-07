import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

export const SITE_URL = 'https://www.alertmend.io'

export function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')
}

export function parseFrontmatter(slug) {
  const mdPath = path.join(root, 'public/blog', `${slug}.md`)
  const md = fs.readFileSync(mdPath, 'utf8')
  const fm = md.match(/^---\n([\s\S]*?)\n---/)
  const meta = {}
  if (fm) {
    fm[1].split('\n').forEach((line) => {
      const m = line.match(/^(\w+):\s*"([^"]*)"$/)
      if (m) meta[m[1]] = m[2]
    })
  }
  return meta
}

export function getRelatedPosts(slug, category) {
  const blogList = JSON.parse(
    fs.readFileSync(path.join(root, 'src/utils/blogList.json'), 'utf8')
  )
  const sameCategoryPosts = blogList
    .filter((p) => p.category === category && p.slug !== slug)
    .slice(0, 3)
  const otherPosts = blogList
    .filter((p) => p.category !== category && p.slug !== slug)
    .slice(0, 7)
  return [...sameCategoryPosts, ...otherPosts].slice(0, 10)
}

export function calendlyUrl(slug) {
  return `https://calendly.com/hello-alertmend/30min?source=blog-post&blog_slug=${slug}`
}

export function signupUrl(slug, source = 'blog') {
  return `https://app.alertmend.io/signup?service=remediation&source=${source}&blog_slug=${slug}`
}

export const CHROME_INLINE_CSS = `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.7; color: #1f2937; background: #fff; -webkit-font-smoothing: antialiased; }
    .navbar { position: fixed; top: 0; left: 0; right: 0; background: rgba(255,255,255,.98); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(229,231,235,.8); z-index: 50; }
    .navbar-container { max-width: 1280px; margin: 0 auto; padding: 0 24px; }
    .navbar-content { display: flex; justify-content: space-between; align-items: center; height: 64px; }
    .navbar-logo { display: flex; align-items: center; gap: 8px; text-decoration: none; color: inherit; }
    .navbar-logo-icon { height: 32px; width: auto; }
    .navbar-links { display: none; align-items: center; gap: 4px; }
    @media (min-width: 1024px) { .navbar-links { display: flex; } }
    .navbar-link { padding: 6px 12px; font-size: 0.875rem; font-weight: 500; color: #3f3f46; text-decoration: none; border-radius: 6px; }
    .navbar-link:hover { color: #09090b; background: #f4f4f5; }
    .navbar-link.active { color: #09090b; background: #fafafa; }
    .navbar-actions { display: none; align-items: center; gap: 10px; margin-left: 16px; padding-left: 16px; border-left: 1px solid #e5e7eb; }
    @media (min-width: 1024px) { .navbar-actions { display: flex; } }
    .navbar-button { padding: 8px 16px; font-size: 0.875rem; font-weight: 600; border-radius: 999px; text-decoration: none; }
    .navbar-button-primary { background: #09090b; color: #fff; }
    .navbar-button-secondary { color: #3f3f46; }
    .main-container { max-width: 1280px; margin: 0 auto; padding: 96px 24px 64px; }
    .content-wrapper { display: grid; grid-template-columns: 1fr; gap: 32px; }
    @media (min-width: 1024px) {
      .content-wrapper { grid-template-columns: minmax(0, 2fr) minmax(280px, 1fr); gap: 40px; align-items: start; }
    }
    .main-col { min-width: 0; max-width: 820px; }
    @media (min-width: 1024px) { .main-col { max-width: none; } }
    .sidebar { display: none; }
    @media (min-width: 1024px) { .sidebar { display: block; } }
    .sidebar-content { position: sticky; top: 96px; display: flex; flex-direction: column; gap: 24px; }
    .sidebar-card { background: #fafafa; border-radius: 8px; padding: 24px; border: 1px solid #e4e4e7; }
    .sidebar-card-title { font-size: 1.125rem; font-weight: 700; color: #09090b; margin: 0 0 16px; }
    .signup-form { display: flex; flex-direction: column; gap: 12px; }
    .signup-form input { width: 100%; padding: 10px 16px; border-radius: 6px; border: 1px solid #d4d4d8; font-size: 1rem; background: #fff; color: #09090b; }
    .signup-form input:focus { outline: none; border-color: #7c3aed; box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.2); }
    .signup-form button { width: 100%; padding: 10px 12px; background: #09090b; color: #fff; font-weight: 600; border-radius: 6px; border: none; cursor: pointer; }
    .signup-form button:hover { background: #27272a; }
    .signup-form button:disabled { opacity: 0.6; cursor: not-allowed; }
    .signup-status { font-size: 0.875rem; font-weight: 500; margin: 0; }
    .signup-status.success { color: #047857; }
    .signup-status.error { color: #dc2626; }
    .related-content-title { font-size: 11px; font-weight: 700; color: #71717a; text-transform: uppercase; letter-spacing: 0.12em; margin: 0 0 16px; }
    .related-posts-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 12px; }
    .related-post-link { color: #3f3f46; text-decoration: none; font-size: 0.875rem; line-height: 1.5; display: block; transition: color 0.15s; }
    .related-post-link:hover { color: #7c3aed; }
    .view-more-link { display: inline-flex; align-items: center; gap: 4px; margin-top: 16px; color: #7c3aed; font-size: 0.875rem; font-weight: 600; text-decoration: none; }
    .view-more-link:hover { color: #6d28d9; }
    .article-header { margin-bottom: 2rem; }
    .article-header h1 { font-size: clamp(1.75rem, 4vw, 2.75rem); font-weight: 700; color: #09090b; line-height: 1.15; letter-spacing: -0.02em; margin-bottom: 1rem; }
    .author-info { display: flex; align-items: center; gap: 12px; margin-bottom: 0.75rem; }
    .author-avatar { width: 40px; height: 40px; border-radius: 50%; background: #09090b; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 600; }
    .author-name { font-weight: 600; color: #111827; }
    .author-meta { font-size: 0.875rem; color: #6b7280; }
    .category-tag { display: inline-block; padding: 4px 10px; background: #ede9fe; color: #5b21b6; border-radius: 6px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
    .promo { margin-top: 3rem; padding-top: 2rem; border-top: 1px solid #e5e7eb; font-size: 1.0625rem; color: #374151; }
    .promo a { color: #7c3aed; font-weight: 600; }
`

export function buildNavHtml(slug, calendly) {
  return `
  <nav class="navbar">
    <div class="navbar-container">
      <div class="navbar-content">
        <a href="/" class="navbar-logo">
          <img src="/logos/alertmend-logo.svg" alt="AlertMend AI" class="navbar-logo-icon">
        </a>
        <div class="navbar-links">
          <a href="/#how-it-works" class="navbar-link">How It Works</a>
          <a href="/#solutions" class="navbar-link">Solutions</a>
          <a href="/case-studies" class="navbar-link">Case Studies</a>
          <a href="/blog" class="navbar-link active">Blog</a>
          <a href="/pricing" class="navbar-link">Pricing</a>
        </div>
        <div class="navbar-actions">
          <a href="https://app.alertmend.io/signup?source=blog-post&blog_slug=${slug}" class="navbar-button navbar-button-secondary">Register</a>
          <a href="${calendly}" class="navbar-button navbar-button-primary" target="_blank" rel="noopener noreferrer">Book a Demo</a>
        </div>
      </div>
    </div>
  </nav>`
}

/** Injected into each blog page script.js (single listener — no inline duplicate). */
export const BLOG_SIGNUP_HANDLER_JS = `
  const signupForm = document.getElementById('blog-signup-form');
  const signupStatus = document.getElementById('blog-signup-status');
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = signupForm.querySelector('input[type="email"]');
      const button = signupForm.querySelector('button[type="submit"]');
      const email = input && input.value ? input.value.trim() : '';
      if (!email || !button || button.disabled) return;
      const blogTitleEl = document.querySelector('.article-header h1, header.article-header--cred h1, h1');
      const blogTitle = (signupForm.getAttribute('data-blog-title') || (blogTitleEl && blogTitleEl.textContent) || document.title || 'this blog post').trim().replace(/\\s*\\|\\s*AlertMend.*$/i, '');
      const buttonLabel = button.textContent;
      button.disabled = true;
      button.textContent = 'Signing up…';
      if (signupStatus) {
        signupStatus.hidden = true;
        signupStatus.textContent = '';
        signupStatus.className = 'signup-status';
      }
      try {
        const response = await fetch('https://api.alertmend.io/contact', {
          method: 'POST',
          headers: { Accept: 'application/json, text/plain, */*', 'Content-Type': 'application/json' },
          body: JSON.stringify({
            full_name: 'Blog subscriber',
            company: '',
            email,
            message: 'Newsletter signup from the AlertMend blog post "' + blogTitle + '". Please add this email to the blog and product updates list.',
            source: 'blog_signup',
          }),
        });
        if (response.ok) {
          if (input) input.value = '';
          if (signupStatus) {
            signupStatus.hidden = false;
            signupStatus.textContent = "Thanks! You're on the list.";
            signupStatus.className = 'signup-status success';
          }
        } else {
          const data = await response.json().catch(() => ({}));
          if (signupStatus) {
            signupStatus.hidden = false;
            signupStatus.textContent = data.error || data.message || 'Something went wrong. Please try again.';
            signupStatus.className = 'signup-status error';
          }
        }
      } catch {
        if (signupStatus) {
          signupStatus.hidden = false;
          signupStatus.textContent = 'Network error. Please check your connection and try again.';
          signupStatus.className = 'signup-status error';
        }
      } finally {
        button.disabled = false;
        button.textContent = buttonLabel || 'Sign up';
      }
    });
  }`

export function appendBlogSignupHandler(scriptSource) {
  const stripped = scriptSource.replace(/\n\s*const signupForm = document\.getElementById\('blog-signup-form'\);[\s\S]*?\n\s*\}\s*(?=\n\}\)\(\);?\s*$)/, '\n')
  return stripped.replace(/\}\)\(\);?\s*$/, `${BLOG_SIGNUP_HANDLER_JS}\n})();`)
}

export function buildSidebarHtml(relatedPosts, blogTitle = '') {
  return `
      <aside class="sidebar">
        <div class="sidebar-content">
          <div class="sidebar-card">
            <div class="sidebar-card-title">Receive blog and product updates</div>
            <form class="signup-form" id="blog-signup-form"${blogTitle ? ` data-blog-title="${esc(blogTitle)}"` : ''} novalidate>
              <input type="email" name="email" placeholder="Email*" required aria-label="Email address">
              <button type="submit">Sign up</button>
              <p class="signup-status" id="blog-signup-status" hidden></p>
            </form>
          </div>

          ${relatedPosts.length > 0 ? `
          <div class="sidebar-card">
            <div class="related-content-title">Related content</div>
            <ul class="related-posts-list">
              ${relatedPosts.map((post) => `<li><a href="/blog/${esc(post.slug)}" class="related-post-link">${esc(post.title)}</a></li>`).join('\n              ')}
            </ul>
            <a href="/blog" class="view-more-link">
              View all posts
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </a>
          </div>
          ` : ''}

          <div class="sidebar-card">
            <div class="related-content-title">Explore AlertMend</div>
            <ul class="related-posts-list">
              <li><a href="/" class="related-post-link">Home</a></li>
              <li><a href="/auto-remediation" class="related-post-link">Automated Incident Remediation</a></li>
              <li><a href="/kubernetes-management" class="related-post-link">Kubernetes Management</a></li>
              <li><a href="/on-call-management" class="related-post-link">On-Call Management</a></li>
              <li><a href="/case-studies" class="related-post-link">Case Studies</a></li>
              <li><a href="/pricing" class="related-post-link">Pricing</a></li>
              <li><a href="/blog" class="related-post-link">All Blog Posts</a></li>
            </ul>
          </div>
        </div>
      </aside>`
}

export function buildArticleHeader(title, author, date, category) {
  return `
    <header class="article-header">
      <h1>${esc(title)}</h1>
      <div class="author-info">
        <div class="author-avatar">${author.charAt(0)}</div>
        <div>
          <div class="author-name">${esc(author)}</div>
          <div class="author-meta">${esc(date)} · ${category}</div>
        </div>
      </div>
      <span class="category-tag">${esc(category)}</span>
    </header>`
}

export const DINESH_AUTHOR = {
  name: 'Dinesh Agrawal',
  role: 'Co-Founder at AlertMend.io',
  credLine: '12+ years in cloud infrastructure and AI-driven incident automation',
  linkedin: 'https://www.linkedin.com/in/dineshagrawal85/',
}

export function dineshJsonLdAuthor() {
  return {
    '@type': 'Person',
    name: DINESH_AUTHOR.name,
    jobTitle: DINESH_AUTHOR.role,
    url: DINESH_AUTHOR.linkedin,
    sameAs: [DINESH_AUTHOR.linkedin],
  }
}

export const ALERTMEND_TEAM = {
  name: 'AlertMend Team',
  role: 'Infrastructure reliability engineering',
  credLine: 'Guides checked against primary vendor documentation',
  linkedin: 'https://www.linkedin.com/company/alertmend/',
}

export const ARVIND_AUTHOR = {
  name: 'Arvind Rajpurohit',
  role: 'AlertMend Engineering',
  credLine: 'Elasticsearch caching and search performance',
  linkedin: null,
}

export const HIMANSHU_AUTHOR = {
  name: 'Himanshu Bansal',
  role: 'AlertMend Engineering',
  credLine: 'Elasticsearch on Kubernetes and JVM operations',
  linkedin: null,
}

export function resolveAuthorProfile(authorName) {
  switch (authorName) {
    case DINESH_AUTHOR.name: return DINESH_AUTHOR
    case ARVIND_AUTHOR.name: return ARVIND_AUTHOR
    case HIMANSHU_AUTHOR.name: return HIMANSHU_AUTHOR
    default: return ALERTMEND_TEAM
  }
}

export const AUTHOR_CRED_CSS = `.article-header--cred{margin-bottom:1.5rem;}
.article-header--cred .authorCredLine--top{margin:0 0 .45rem;}
.article-header--cred .article-meta{font-size:.875rem;color:#6b7280;margin:0;}
.authorCredLine{font-size:.875rem;line-height:1.55;color:#71717a;}
.authorCredLine a,.authorCredLine .authorCredName{color:#3f3f46;font-weight:600;text-decoration:none;}
.authorCredLine a:hover{color:#7c3aed;}
`

/** One-line author credibility for posts with a full bio card at the bottom. */
export function buildAuthorCredLine(author = DINESH_AUTHOR, extraClass = '') {
  const cls = extraClass ? `authorCredLine ${extraClass}` : 'authorCredLine'
  const nameHtml = author.linkedin
    ? `<a href="${author.linkedin}" target="_blank" rel="noopener noreferrer">${esc(author.name)}</a>`
    : `<span class="authorCredName">${esc(author.name)}</span>`
  return `<p class="${cls}">${nameHtml}, ${esc(author.role)} · ${esc(author.credLine)}</p>`
}

/** Article header: title + cred line + date (or custom meta line). */
export function buildCredArticleHeader(title, date, category, authorOrName = DINESH_AUTHOR, metaLine) {
  const author = typeof authorOrName === 'string' ? resolveAuthorProfile(authorOrName) : authorOrName
  const meta = metaLine ?? `${esc(date)} · ${esc(category)}`
  return `
    <header class="article-header article-header--cred">
      <h1>${esc(title)}</h1>
      ${buildAuthorCredLine(author, 'authorCredLine--top')}
      <p class="article-meta">${meta}</p>
    </header>`
}

export function writeStaticBlogOutputs(slug, html) {
  const outDir = path.join(root, 'public/blog', slug)
  const outHtml = path.join(outDir, 'index.html')
  fs.mkdirSync(outDir, { recursive: true })
  fs.writeFileSync(outHtml, html)
  console.log(`✓ Wrote ${outHtml}`)

  const distOutDir = path.join(root, 'dist/blog', slug)
  fs.mkdirSync(distOutDir, { recursive: true })
  fs.writeFileSync(path.join(distOutDir, 'index.html'), html)
  console.log(`✓ Wrote dist/blog/${slug}/index.html`)
}

export function syncHandAuthoredStaticBlog(slug) {
  const src = path.join(root, 'public/blog', slug, 'index.html')
  if (!fs.existsSync(src)) {
    console.warn(`⚠ No index.html for static blog "${slug}"`)
    return
  }
  const html = fs.readFileSync(src, 'utf8')
  writeStaticBlogOutputs(slug, html)
}
