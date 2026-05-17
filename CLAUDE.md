# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install              # install deps
npm run dev              # Vite dev server (SPA only — does NOT generate blog HTML)
npm run lint             # ESLint, --max-warnings 0
npm run preview          # preview the built dist/

# Build pipeline (each step can be run individually)
npm run generate:blog-list   # scan public/blog/*.md → src/utils/blogList.json
npm run build:sitemap        # scripts/generate-sitemap.js → public/sitemap.xml
npm run build:blog           # markdown → dist/blogs/*.html AND dist/blog/<slug>/index.html, then fix-html-descriptions.js
npm run validate:blogs       # SEO compliance gate; ❌ on errors, ⚠️ on warnings (see VALIDATION.md)
npm run prerender            # SSR marketing routes from scripts/prerender-routes.tsx (needs vite build first)

npm run build                # full pipeline: generate:blog-list → build:sitemap → build:blog → validate:blogs → tsc → vite build → prerender
```

There is no test runner configured. CI (`.github/workflows/validate-blogs.yml`) only runs `validate:blogs` on PRs that touch `public/blog/**` or the blog scripts.

## Architecture

Vite + React 18 + TypeScript SPA marketing site deployed on Vercel. The non-obvious complexity is the blog pipeline and the dual prerendering strategy — most pages are React-rendered into static HTML at build time, while blog posts are generated *outside* of React directly from markdown.

### Three rendering paths

1. **Marketing pages** (`/`, `/pricing`, `/about`, etc.) — `scripts/prerender-routes.tsx` mounts `<App>` under `StaticRouter` with `react-helmet-async`, serializes to HTML, and writes `dist/<route>/index.html`. Requires `dist/.vite/manifest.json` from `vite build` to wire up CSS/JS chunks. The `routesToPrerender` list in that script must be kept in sync with `App.tsx` routes and `vercel.json` rewrites.
2. **Blog posts via clean URL** (`/blog/<slug>`) — `dist/blog/<slug>/index.html` written by `scripts/build-blog-html.js` directly from `public/blog/<slug>.md` using `marked` (no React on the generation path). Same file is served by Vercel rewrites; React Router also handles this path in the browser via `BlogPostDetailPage.tsx`.
3. **Blog posts via legacy `.html` URL** (`/blogs/<Title-Case-Slug>.html`) — same generator writes a second copy to `dist/blogs/*.html`. Filenames are Title-Case-With-Hyphens; the slug→filename mapping has hand-picked overrides in `canonicalFilenameOverrides` inside `build-blog-html.js`. These files are kept for SEO/incoming links; the React app has a `/blogs/*` legacy route.

### Blog data flow

`public/blog/*.md` (frontmatter: title/excerpt/date/category/author/keywords) is the source of truth. `generate:blog-list` parses frontmatter into `src/utils/blogList.json` which is statically imported by `src/utils/blogUtils.ts` and used to render the blog list page. The runtime React `BlogPostDetailPage` *also* `fetch()`s the raw `.md` at request time and renders with `react-markdown` — so the same content has three rendering implementations (build-blog-html.js, React Markdown, and the post-processed HTML files). Keep markdown parsing behavior aligned between `scripts/build-blog-html.js` and `BlogPostDetailPage.tsx` when changing how posts render.

The `blogPosts` array hard-coded at the top of `scripts/build-blog-html.js` is *not* the full list — only ~25 curated featured posts. The script iterates `public/blog/*.md` itself, so adding a new markdown file is enough to generate HTML, but featured/highlighted posts must also be added there.

### SEO is a hard constraint, not a guideline

Validation gates the build. The full ruleset lives in `README.md` and `VALIDATION.md`; the enforcement code is in:

- `src/utils/titleUtils.ts` — title 30-60 chars (incl. ` | AlertMend AI` suffix), H2s 50-70 chars
- `src/utils/descriptionUtils.ts` — meta description 50-160 chars, unique per page
- `src/utils/urlUtils.ts` — canonical URL normalization (lowercase, no trailing slash, underscores→hyphens, no query/hash)
- `src/components/SEO.tsx` — single source of truth for meta tags via `react-helmet-async`
- `scripts/validate-blogs.js` — fails the build if rules are violated
- `scripts/fix-html-descriptions.js` — auto-runs after `build:blog` to repair descriptions <50 chars

Watch out: the SEO base URL is **`https://www.alertmend.io`** in `src/utils/urlUtils.ts` and `src/components/SEO.tsx`, but the sitemap, robots.txt, and README quote **`https://alertmend.io`** (no `www`). Be deliberate about which you use.

### Helmet wrapper

`src/lib/helmet.ts` exists because `react-helmet-async` exports differently under ESM (Vite browser build) vs CommonJS (Node-side `tsx` prerender). Import `Helmet`/`HelmetProvider` from `./lib/helmet`, not from `react-helmet-async` directly, or prerender will break.

### Vercel routing

`vercel.json` rewrites every named route to its prerendered `<route>/index.html`. `/blog/:slug` and `/blog/:slug.html` rewrite to `/index.html` (so the React SPA handles them — the prerender does *not* cover individual blog posts; those come from the build-blog-html output served as static files alongside SPA fallback). The catch-all `/(.*)` → `/index.html` is the SPA fallback. CSP and security headers are also set here.

### TypeScript projects

`tsconfig.json` (app, `strict`, `noUnusedLocals`/`noUnusedParameters` on) → `tsconfig.node.json` (Vite config) and `tsconfig.prerender.json` (the prerender script). `tsc` in the build only typechecks (`noEmit: true`); Vite handles emit.

## Adding a blog post

1. Drop `public/blog/<slug>.md` with the frontmatter block (`title`, `excerpt` 50-160 chars, `date`, `category`, `author`, optional `keywords`).
2. `npm run build:blog` regenerates static HTML in `dist/blog/<slug>/index.html` and `dist/blogs/<Title-Case>.html`.
3. To feature the post on the homepage/related-posts surfaces, add an entry to the `blogPosts` array at the top of `scripts/build-blog-html.js`.
4. `npm run validate:blogs` before committing — CI runs this on PRs that touch blog files.
