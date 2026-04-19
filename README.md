# AlertMend AI - AIOps Platform  

Autonomous AIOps platform that automatically detects, analyzes, and resolves incidents across Kubernetes, VMs, and ECS. Stop firefighting. Cut costs by 50%. Achieve zero downtime.

## 🚀 Quick Start  

```bash
# Install dependencies
npm install

# Run development server
npm run dev
   
# Build for production
npm run build

# Generate sitemap
npm run build:sitemap

# Generate static HTML blog posts
npm run build:blog
```

## 📋 SEO Rules and Best Practices

This project follows strict SEO guidelines to ensure optimal search engine visibility. All pages must comply with these rules:

### 1. Page Title Rules
**Requirement:** Page titles must be between 30 and 60 characters (including suffix)

**Implementation:**
- ✅ All blog post titles are automatically truncated using `truncateBlogTitle()` function
- ✅ Title truncation happens in:
  - `src/pages/BlogPostDetailPage.tsx` (React component)
  - `scripts/build-blog-html.js` (Static HTML generation)
- ✅ Titles are truncated at word boundaries when possible
- ✅ Trailing punctuation is removed
- ✅ Suffix ` | AlertMend AI` (17 characters) is included in character count

**Location:** `src/utils/titleUtils.ts`

**Example:**
```typescript
// ❌ Bad: 101 characters
"Troubleshooting Unhealthy Elasticsearch Nodes on Kubernetes: Causes and Solutions | AlertMend AI"

// ✅ Good: 58 characters
"Unhealthy Elasticsearch Nodes on Kubernetes | AlertMend AI"
```

### 2. Meta Description Rules
**Requirement:** Meta descriptions must be unique and between 50-160 characters

**Implementation:**
- ✅ All blog posts use `generateUniqueMetaDescription()` function
- ✅ All pages use `ensureUniqueMetaDescription()` function for page-specific uniqueness
- ✅ Descriptions are generated from:
  - Post excerpt (if available and unique)
  - Post content (first meaningful sentences)
  - Title and category (if excerpt/content unavailable)
- ✅ Key terms from title are included to ensure uniqueness
- ✅ Page-specific suffixes added to ensure uniqueness across all pages
- ✅ Descriptions are truncated at word boundaries
- ✅ Applied to:
  - Meta description tag
  - Open Graph description
  - Twitter Card description
  - Structured data (BlogPosting schema)

**Location:** `src/utils/descriptionUtils.ts`

**Example:**
```typescript
// Each blog post gets a unique description:
// - Includes title keywords
// - Mentions category when relevant
// - Includes specific terms from content
// - Always 50-160 characters

// Each page gets a unique description:
// - HomePage: "Discover how AlertMend AI transforms infrastructure operations."
// - Solution pages: "Get started with [solution type] today."
// - Other pages: Page-specific unique suffixes
```

**Post-Processing Validation:**
- ✅ A post-processing script (`scripts/fix-html-descriptions.js`) runs after HTML generation
- ✅ Automatically fixes any HTML files with descriptions < 50 characters
- ✅ Extracts title from HTML and generates a valid description (50-160 chars)
- ✅ Updates all meta tags: `description`, `og:description`, `twitter:description`, and JSON-LD
- ✅ Integrated into the build process (`npm run build:blog`)
- ✅ Ensures 100% compliance with SEO description length requirements

**Location:** `scripts/fix-html-descriptions.js`

### 2.1. Meta Keywords Rules
**Requirement:** All pages should have meta keywords tag (optional but recommended)

**Implementation:**
- ✅ All pages include relevant meta keywords
- ✅ Keywords are page-specific and relevant to content
- ✅ Solution pages have solution-specific keywords
- ✅ Blog posts include category and topic keywords

**Location:** All page components use `keywords` prop in `SEO` component

### 3. Canonical URL Rules
**Requirement:** All canonical URLs must:
- Use `https://alertmend.io` domain
- Remove trailing slashes (except root)
- Remove query parameters and hash fragments
- Be unique for each page

**Implementation:**
- ✅ Pre-React script in `index.html` sets initial canonical
- ✅ `SEO` component uses `useLocation` to set canonical dynamically
- ✅ `urlUtils.ts` provides normalization functions
- ✅ `PageTracker` component verifies canonical on route changes
- ✅ `MutationObserver` watches for DOM changes
- ✅ Periodic safety checks every 5 seconds

**Location:** 
- `src/utils/urlUtils.ts`
- `src/components/SEO.tsx`
- `src/main.tsx`

### 4. H1 Heading Rules
**Requirement:** Each page must have exactly ONE H1 heading

**Implementation:**
- ✅ Blog posts: Main title is H1, markdown H1 tags are converted to H2
- ✅ Conversion happens in:
  - `src/pages/BlogPostDetailPage.tsx` (React component)
  - `scripts/build-blog-html.js` (Static HTML generation)
- ✅ All markdown `<h1>` tags are replaced with `<h2>` tags

**Example:**
```markdown
<!-- In markdown file -->
# Troubleshooting Kubernetes Issues

<!-- Rendered as -->
<h2>Troubleshooting Kubernetes Issues</h2>
<!-- Main page title is the only <h1> -->
```

### 5. H2 Heading Rules
**Requirement:** H2 headings must be between 50 and 70 characters for optimal SEO visibility

**Implementation:**
- ✅ All H2 headings are automatically truncated using `truncateH2Heading()` function
- ✅ H2 truncation happens in:
  - `src/pages/BlogPostDetailPage.tsx` (React component)
  - `scripts/build-blog-html.js` (Static HTML generation)
- ✅ Headings are truncated at word boundaries when possible
- ✅ Trailing punctuation is removed
- ✅ Ellipsis (`...`) is added when truncation occurs
- ✅ Ensures headings are visible on web pages and extractable by search engines for SERP display

**Location:** `src/utils/titleUtils.ts`

**Example:**
```typescript
// ❌ Bad: 95 characters (too long)
"Understanding How to Troubleshoot and Fix Common Kubernetes Networking Errors and Connection Issues"

// ✅ Good: 68 characters (within range)
"Understanding How to Troubleshoot and Fix Common Kubernetes Networking..."
```

### 6. Internal Links Rules
**Requirement:** Blog posts should have at least 14+ internal links

**Implementation:**
- ✅ "EXPLORE ALERTMEND" section with 8 internal links
- ✅ Related posts section with 5+ links
- ✅ Navigation links in header
- ✅ Footer links
- ✅ Related content links use anchor tags (not buttons)

**Location:** 
- `src/pages/BlogPostDetailPage.tsx`
- `scripts/build-blog-html.js`

### 7. Robots.txt Rules
**Requirement:** 
- No `Crawl-delay` directive (allows search engines to crawl at normal rate)
- Proper `Disallow` rules for admin/private areas
- Sitemap URL included

**Implementation:**
- ✅ `Crawl-delay` directive removed from `public/robots.txt`
- ✅ Sitemap URL: `https://alertmend.io/sitemap.xml`

### 8. 404 Page Rules
**Requirement:** Non-existent pages must return proper 404 status code

**Implementation:**
- ✅ `NotFoundPage` component created
- ✅ Catch-all route (`path="*"`) in `App.tsx`
- ✅ Returns proper 404 page instead of homepage
- ✅ SEO set to `noindex` for 404 pages

**Location:** `src/pages/NotFoundPage.tsx`

### 9. Content Security Policy (CSP) Rules
**Requirement:** CSP headers must be present for security

**Implementation:**
- ✅ CSP headers added in `vercel.json`
- ✅ CSP meta tag added in `index.html` (fallback)
- ✅ Additional security headers:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `X-XSS-Protection: 1; mode=block`
  - `Referrer-Policy: strict-origin-when-cross-origin`

**Location:**
- `vercel.json` (headers configuration)
- `index.html` (meta tags)

### 10. Logo Rules
**Requirement:** 
- Use SVG format (`alertmend-logo.svg`) for all logos
- Remove white padding from logo
- Proper sizing for navbar and footer

**Implementation:**
- ✅ All logo references use `alertmend-logo.svg`
- ✅ Favicon uses SVG format
- ✅ Logo dimensions optimized (364x400 viewBox)
- ✅ White background removed from SVG
- ✅ Size classes: `sm` (24px), `md` (32px), `lg` (40px)

**Location:**
- `src/components/AlertMendLogo.tsx`
- `public/logos/alertmend-logo.svg`
- `index.html` (favicon)

### 11. Sitemap Rules
**Requirement:** 
- All URLs must be clean (no `.html` extension)
- All URLs must use `https://alertmend.io` domain
- Blog post URLs must match canonical URLs

**Implementation:**
- ✅ Sitemap auto-generated by `scripts/generate-sitemap.js`
- ✅ All blog URLs are clean (e.g., `/blog/my-post`)
- ✅ Vercel rewrite rules serve static HTML files
- ✅ Redirect rules redirect `.html` URLs to clean URLs

**Location:**
- `scripts/generate-sitemap.js`
- `vercel.json`

### 12. Inline Styles Rules
**Requirement:** HTML elements should use CSS files for styling, not inline styles

**Implementation:**
- ✅ All static inline styles moved to CSS classes in `src/index.css`
- ✅ Utility classes created for common patterns:
  - `.gradient-bg-white` - White gradient background
  - `.gradient-bg-purple` - Purple gradient background
  - `.profile-placeholder-arvind` - Profile placeholder styles
  - `.iframe-container` - Iframe container styles
  - `.animate-delay-1s`, `.animate-delay-2s` - Animation delay utilities
- ✅ Dynamic inline styles (e.g., `width: ${percent}%`) are acceptable as they require runtime values
- ✅ All gradient backgrounds use CSS classes instead of inline styles

**Location:** `src/index.css`

**Example:**
```css
/* ✅ Good: CSS class */
.gradient-bg-white {
  background: linear-gradient(135deg, #ffffff 0%, ...);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
}

/* ❌ Bad: Inline style */
<div style={{ background: 'linear-gradient(...)' }}>
```

## 📁 Project Structure

```
Alertmend-AI/
├── public/
│   ├── blog/              # Markdown blog posts
│   ├── logos/             # Logo files
│   ├── robots.txt         # Robots.txt file
│   └── sitemap.xml        # Auto-generated sitemap
├── src/
│   ├── components/        # React components
│   │   ├── SEO.tsx        # SEO component
│   │   ├── AlertMendLogo.tsx  # Logo component
│   │   └── ...
│   ├── pages/             # Page components
│   │   ├── BlogPostDetailPage.tsx
│   │   └── ...
│   ├── utils/             # Utility functions
│   │   ├── titleUtils.ts      # Title truncation
│   │   ├── descriptionUtils.ts # Meta description generation
│   │   ├── urlUtils.ts        # Canonical URL utilities
│   │   └── blogUtils.ts       # Blog utilities
│   └── ...
├── scripts/
│   ├── build-blog-html.js         # Static HTML generation
│   ├── fix-html-descriptions.js   # Post-processing: Fixes invalid meta descriptions
│   ├── validate-blogs.js          # Validates blog HTML files for SEO compliance
│   └── generate-sitemap.js        # Sitemap generation
└── vercel.json            # Vercel configuration
```

## 🔧 Build Process

1. **Generate Sitemap:** `npm run build:sitemap`
2. **Generate Blog HTML:** `npm run build:blog`
   - Generates static HTML files from markdown blog posts
   - Automatically runs post-processing script to fix invalid descriptions
   - Ensures all meta descriptions are 50-160 characters
3. **Validate Blogs:** `npm run validate:blogs` (runs automatically in build)
   - Validates all blog HTML files for SEO compliance
   - Checks title lengths, description lengths, H1/H2 structure, etc.
4. **TypeScript Compilation:** `tsc`
5. **Vite Build:** `vite build`

All blog posts are converted to static HTML files during build for better SEO. The build process includes automatic validation and fixing of SEO issues.

## 🌐 Deployment

The project is deployed on Vercel with:
- Clean URLs (no `.html` extension)
- Static HTML files for blog posts
- Proper redirects and rewrites
- Security headers (CSP, etc.)

## 📊 SEO Checklist

- [x] Page titles are 30-60 characters
- [x] Meta descriptions are unique and 50-160 characters
- [x] Meta keywords are present on all pages
- [x] Canonical URLs are set correctly
- [x] Only one H1 per page
- [x] H2 headings are 50-70 characters
- [x] Internal links (14+ per blog post)
- [x] No crawl-delay in robots.txt
- [x] 404 page returns proper status
- [x] CSP headers are present
- [x] Sitemap is up-to-date
- [x] Logo uses SVG format
- [x] All URLs are clean (no .html)
- [x] Inline styles moved to CSS files

## 🛠️ Development

### Adding a New Blog Post

1. Create a markdown file in `public/blog/` with frontmatter:
```markdown
---
title: "Your Blog Post Title"
excerpt: "Your excerpt here (50-160 characters)"
date: "2025-01-15"
category: "Kubernetes"
author: "Author Name"
---

# Your Blog Post Title

Your content here...
```

2. Add the post to `src/utils/blogUtils.ts`:
```typescript
{
  slug: 'your-blog-post-slug',
  title: 'Your Blog Post Title',
  excerpt: 'Your excerpt here',
  date: '2025-01-15',
  category: 'Kubernetes',
  author: 'Author Name',
}
```

3. Run `npm run build:blog` to generate static HTML
4. The title and description will be automatically optimized for SEO
5. The post-processing script will automatically fix any invalid descriptions if needed

### Blog Validation and Quality Assurance

The project includes automatic validation and fixing of blog HTML files:

**Validation Script:** `scripts/validate-blogs.js`
- Validates all generated HTML files for SEO compliance
- Checks:
  - Title lengths (30-60 characters)
  - Meta description lengths (50-160 characters)
  - H1/H2 structure (exactly one H1, H2s are 50-70 chars)
  - Code block formatting
  - Frontmatter structure

**Post-Processing Script:** `scripts/fix-html-descriptions.js`
- Automatically fixes invalid meta descriptions (< 50 characters)
- Generates valid descriptions from page titles
- Updates all meta tags (description, og:description, twitter:description, JSON-LD)
- Runs automatically as part of `npm run build:blog`
- Ensures 100% compliance with SEO requirements

**Running Validation:**
```bash
# Validate all blog HTML files
npm run validate:blogs

# The validation runs automatically during build
npm run build
```

### SEO Utilities

**Title Truncation:**
```typescript
import { truncateBlogTitle, truncateH2Heading } from '../utils/titleUtils'

const seoTitle = truncateBlogTitle(post.title) // 30-60 characters
const h2Heading = truncateH2Heading(headingText) // 50-70 characters
```

**Meta Description Generation:**
```typescript
import { generateUniqueMetaDescription } from '../utils/descriptionUtils'

const metaDescription = generateUniqueMetaDescription(
  post.title,
  post.excerpt,
  post.content,
  post.category
) // 50-160 characters, unique 
```

## 📝 Notes

- All blog titles are automatically truncated to 30-60 characters
- All H2 headings are automatically truncated to 50-70 characters
- All meta descriptions are automatically generated to be unique and 50-160 characters
- Invalid meta descriptions are automatically fixed during build via post-processing script
- Canonical URLs are automatically set for all pages
- Static HTML files are generated during build for better SEO
- Blog HTML files are validated for SEO compliance during build
- Logo uses SVG format for better performance and scalability

## 🔗 Links

- **Website:** https://alertmend.io
- **Playground:** https://app.alertmend.io/playground
- **Book a Demo:** https://calendly.com/hello-alertmend/30min
- **Signup:** https://app.alertmend.io/signup
