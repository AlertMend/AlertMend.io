# Blog Validation Guide

This document explains the blog validation process that ensures all blog posts meet SEO requirements before deployment.

## Validation Script

The `scripts/validate-blogs.js` script validates all blog posts before build to ensure they meet SEO requirements.

## Running Validation

```bash
# Run validation manually
npm run validate:blogs

# Validation runs automatically during build
npm run build
```

## What Gets Validated

### Markdown Files

- ✅ **Required frontmatter fields:**
  - `title` - Blog post title
  - `excerpt` - Short description (50-160 characters)
  - `date` - Publication date
  - `category` - Post category
  - `author` - Author name

- ✅ **Recommended frontmatter fields:**
  - `keywords` - SEO keywords (recommended, but not required)

- ✅ **SEO requirements:**
  - Title length: 30-60 characters (including " | AlertMend AI" suffix)
  - Excerpt length: 50-160 characters
  - Keywords count: Minimum 3 keywords recommended
  - Content should start with H1 heading

### Generated HTML Files

- ✅ **Required meta tags:**
  - `<title>` tag with proper length (30-60 chars)
  - `<meta name="description">` with proper length (50-160 chars)
  - `<meta name="keywords">` present
  - `<meta name="robots">` allows indexing (`index, follow`)
  - `<link rel="canonical">` URL present and correct

- ✅ **Recommended elements:**
  - Structured data (JSON-LD schema)
  - Open Graph tags
  - Twitter Card tags

### Sitemap

- ✅ All blog posts must be included in `public/sitemap.xml`

## Validation Rules

| Rule | Requirement | Status |
|------|-------------|--------|
| Title length | 30-60 characters (with suffix) | ❌ Fails build |
| Excerpt length | 50-160 characters | ❌ Fails build |
| Keywords | Recommended (3+ keywords) | ⚠️ Warning |
| Meta tags | All required tags present | ❌ Fails build |
| Canonical URL | Must be present and valid | ❌ Fails build |
| Robots meta | Must allow indexing | ❌ Fails build |
| Sitemap | Must include all blogs | ❌ Fails build |
| Structured data | Recommended | ⚠️ Warning |
| H1 heading | Recommended | ⚠️ Warning |

## Error vs Warning

- **❌ Errors**: Fail the build - must be fixed before deployment
- **⚠️ Warnings**: Don't fail the build - recommended to fix for better SEO

## Common Issues

### Title Too Long

**Error:** `Title too long (XX chars, max 60)`

**Fix:** Shorten the title. Remember that " | AlertMend AI" (17 characters) is automatically added.

**Example:**
```markdown
# ❌ Bad
title: "A Very Long Blog Post Title That Exceeds the Maximum Length"

# ✅ Good  
title: "Short Blog Title"
```

### Excerpt Too Long

**Error:** `Excerpt too long (XX chars, max 160)`

**Fix:** Shorten the excerpt to 160 characters or less.

**Example:**
```markdown
# ❌ Bad
excerpt: "This is a very long excerpt that exceeds the maximum allowed length of 160 characters and will cause the validation to fail..."

# ✅ Good
excerpt: "Short, concise excerpt under 160 characters that summarizes the blog post effectively."
```

### Missing Keywords

**Warning:** `Missing recommended frontmatter field: keywords`

**Fix:** Add keywords to frontmatter.

**Example:**
```markdown
---
title: "Your Blog Post Title"
excerpt: "Your excerpt here"
keywords: "keyword1, keyword2, keyword3, keyword4"
---
```

### Missing Meta Tags in HTML

**Error:** `Missing meta [tag name]`

**Fix:** This usually means the HTML generation script failed. Check:
1. Frontmatter is correct in markdown file
2. Build script ran successfully
3. HTML file was generated correctly

## Integration

### Build Process

Validation runs automatically during `npm run build`:

```json
"build": "npm run generate:blog-list && npm run build:sitemap && npm run build:blog && npm run validate:blogs && ..."
```

If validation fails, the build stops and you must fix errors before proceeding.

### Pre-commit Hook (Optional)

You can add a pre-commit hook to validate before committing:

```bash
# Install husky (if not already installed)
npm install --save-dev husky

# Add pre-commit hook
npx husky add .husky/pre-commit "npm run validate:blogs"
```

### GitHub Actions

A GitHub Actions workflow (`/.github/workflows/validate-blogs.yml`) automatically validates blog posts on pull requests.

## Fixing Validation Errors

1. **Read the error message** - It tells you exactly what's wrong
2. **Fix the issue** in the markdown file
3. **Regenerate HTML** - Run `npm run build:blog`
4. **Re-run validation** - Run `npm run validate:blogs`
5. **Repeat** until all errors are fixed

## Tips

- Always run `npm run validate:blogs` before committing blog changes
- Keep titles concise and descriptive
- Write excerpts that are 50-160 characters
- Add keywords relevant to your content
- Use H1 headings to structure your content












