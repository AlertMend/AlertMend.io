# Rich interactive blog guide

Every new blog post on AlertMend.io is a **rich static HTML page** with its own CSS, JS, and images. There is no markdown-only path for new posts.

**Reference implementation:** `monitor-docling-using-alertmend`

**AI prompts:** `docs/NEW_BLOG_PROMPTS.md` — includes **Standing custom instructions** (dynamic UX, no em dashes, diagram rules, etc.) plus step-by-step prompts.

---

## Quick start (new post)

```bash
npm run scaffold:blog -- your-post-slug "Your Post Title"
```

This creates:

```
public/blog/your-post-slug.md              # listing metadata (frontmatter)
public/blog/your-post-slug/index.html      # the page (edit this)
public/assets/your-post-slug/
  styles.css
  script.js
  hero.svg                                 # replace with real OG image
```

Then:

1. **Copy chrome** from `public/blog/monitor-docling-using-alertmend/index.html` into your `index.html` (nav, sidebar, inline chrome CSS in `<style>`). The scaffold template is content-only until you add chrome.
2. **Write content** in `index.html` and extend `styles.css` / `script.js`.
3. **Update frontmatter** in `public/blog/your-post-slug.md` (title, excerpt, keywords).
4. **Add images** to `public/assets/your-post-slug/` (diagrams, logos, hero for social).
5. **Regenerate indexes:**

```bash
npm run generate:blog-list
```

6. **Preview** (restart dev if you just scaffolded):

```bash
npm run dev
# http://localhost:5173/blog/your-post-slug
```

7. **Before commit:**

```bash
npm run validate:blogs
npm run build
```

---

## URL

All new posts use:

```
https://www.alertmend.io/blog/{slug}
```

- Lowercase slug, hyphens only
- No `.html` in the public URL

---

## File layout

| Path | Purpose |
|------|---------|
| `public/blog/{slug}.md` | Frontmatter for blog index, sitemap, validation |
| `public/blog/{slug}/index.html` | Full static page (source of truth for content) |
| `public/assets/{slug}/` | Per-post CSS, JS, SVG, PNG |
| `scripts/static-blogs/{slug}.mjs` | Optional code generator (Docling uses this) |

**Never edit `dist/` by hand.** Vite copies `public/` on build.

---

## Two ways to author HTML

### A. Hand-authored (default)

Edit `public/blog/{slug}/index.html` directly. On build, `npm run build:static-blogs` syncs it to `dist/blog/{slug}/index.html`.

### B. Code-generated (optional)

For posts with lots of dynamic sections (FAQ arrays, mode pickers, tables), add `scripts/static-blogs/{slug}.mjs` that exports:

```js
export async function build(slug) {
  // assemble HTML, call writeStaticBlogOutputs(slug, html) from static-blog-shared.mjs
}
```

See `scripts/static-blogs/monitor-docling-using-alertmend.mjs` for a full example. If a builder exists, it runs on every `build:static-blogs` and overwrites `index.html`.

---

## Registry (automatic)

Rich posts are **auto-discovered** when both exist:

- `public/blog/{slug}/index.html`
- `public/blog/{slug}.md`

`npm run generate:blog-list` updates:

- `src/utils/blogList.json`
- `src/utils/staticBlogRegistry.ts`
- `scripts/static-blog-slugs.mjs`
- `vercel.json` rewrites (so `/blog/{slug}` serves static HTML, not React)

No manual registry edits needed after scaffold.

---

## Frontmatter rules

```yaml
---
title: "Short title here"
excerpt: "50–160 character summary for meta description."
date: "2026-06-14"
category: "Kubernetes"
author: "AlertMend Team"
tags: ["Kubernetes", "AIOps"]
keywords: "keyword one, keyword two, keyword three, AlertMend"
---
```

| Field | Rule |
|-------|------|
| `title` | ≤ **43 chars** in frontmatter (` | AlertMend AI` adds 17 chars; max total 60) |
| `excerpt` | 50–160 chars |
| `keywords` | 3+ terms recommended |
| Required | `title`, `excerpt`, `date`, `category`, `author` |

---

## Page checklist (rich post)

Every rich post should include:

- [ ] **“You’re in the right place if…”** audience block
- [ ] **TL;DR** for SEO / AI crawlers
- [ ] **Sequence or flow diagram** (SVG in assets)
- [ ] **4-step AlertMend setup** (connect → check → alert → auto-fix)
- [ ] **FAQ accordion** with full question phrasing + `FAQPage` JSON-LD
- [ ] **Related content sidebar** (copy from Docling chrome)
- [ ] **Bottom CTA** with `source=blog&blog_slug={slug}` on signup links
- [ ] **Meta tags:** title, description, keywords, canonical, OG, Twitter
- [ ] **JSON-LD:** `BlogPosting`, optional `FAQPage` and `HowTo`

---

## Content guidelines

Also see **Standing custom instructions** in `docs/NEW_BLOG_PROMPTS.md` for the full list (dynamic UX, no em dashes, diagram rules, AlertMend positioning, etc.).

### Audience

Readers **already use the tool**. Focus on observability, uptime, and recovery with AlertMend.

### Voice

- SRE runbook tone, not marketing copy
- Lead with **failure modes** readers will hit
- Every fix should say **what AlertMend does** (URL check, Slack incident, runbook)
- **No em dashes (`—`)** anywhere in user-facing copy
- **Dynamic and intuitive:** prefer images, animated mocks, interactive tabs, and sequence diagrams over plain prose walls

### UX (rich posts)

- Sequence diagrams: 3 columns, embedded logos, title case, business outcome at bottom
- Animated dashboard mock, mode picker tabs, FAQ accordion
- Related content sidebar on desktop

### SEO for Google + AI

- Question-shaped H2s (*“How to monitor X in production”*)
- FAQ answers name AlertMend actions
- Entity names in keywords meta
- Custom `hero.svg` or PNG for OG/Twitter

### Design

- Violet accent only (`#7c3aed`)
- Match tokens in `src/styles/global.css`
- CTA buttons: explicit colors (do not rely on inherited link styles)

---

## Commands

| Command | When |
|---------|------|
| `npm run scaffold:blog -- <slug> ["Title"]` | New post |
| `npm run dev` | Local preview |
| `npm run generate:blog-list` | After frontmatter or new slug |
| `npm run build:static-blogs` | After HTML/CSS/JS edits |
| `npm run validate:blogs` | Before commit |
| `npm run build` | Full production build |

---

## Build pipeline

```bash
npm run generate:blog-list   # blog index + static registry + vercel rewrites
npm run build:sitemap
npm run build:blog           # includes build:static-blogs
npm run validate:blogs
tsc && vite build && npm run prerender
```

---

## Legacy markdown posts

Older posts in `public/blog/*.md` (without a `{slug}/index.html` folder) still render via React `react-markdown`. **Do not add new posts that way.** Migrate legacy posts to the rich layout when you refresh them.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| “Loading post…” spinner | Restart `npm run dev`. Registry + Vite plugin must know the slug. |
| Blank page after mode/tab switch | Do not use scroll-reveal `.reveal` on remounting panels |
| Build fails on title length | Shorten frontmatter `title` to ≤ 43 chars |
| CTA text invisible | Use explicit button colors in CSS |
| Production shows React page | Run `generate:blog-list` to sync `vercel.json` rewrites |

---

## File map

| File | Role |
|------|------|
| `templates/rich-blog/` | Scaffold starter files |
| `scripts/scaffold-rich-blog.mjs` | `npm run scaffold:blog` |
| `scripts/discover-static-blogs.mjs` | Finds rich posts on disk |
| `scripts/static-blog-shared.mjs` | Shared nav, sidebar, meta helpers |
| `scripts/build-static-blogs.mjs` | Build orchestrator |
| `scripts/static-blogs/*.mjs` | Per-post code generators |
| `scripts/vite-static-blog-plugin.mjs` | Dev/preview routing |
| `docs/NEW_BLOG_PROMPTS.md` | Cursor prompts for each authoring step |
