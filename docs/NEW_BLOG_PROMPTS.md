# Rich blog prompts for Cursor

Copy-paste these prompts when authoring a new post. Read `docs/NEW_BLOG_GUIDE.md` for the full workflow.

**Reference post:** `monitor-docling-using-alertmend`  
**Before prompting:** run `npm run scaffold:blog -- <slug> "<title>"`

Replace placeholders:
- `{TOOL}` — product name with correct spelling (e.g. Docling, Patroni)
- `{slug}` — lowercase hyphenated slug (e.g. `monitor-patroni-using-alertmend`)
- `{category}` — blog category (e.g. Kubernetes, AIOps, Elasticsearch)

---

## Standing custom instructions (always apply)

These are your standing editorial rules from the Docling post iteration. **Apply to every rich blog**, whether you use a step prompt or the one-shot prompt below.

Paste this block into any Cursor session when working on blogs:

```
STANDING BLOG INSTRUCTIONS — always follow:

FORMAT & UX
- Rich interactive posts only: static HTML + per-post assets (not markdown walls)
- Make it dynamic and intuitive: use images, animated UI mocks, interactive tabs,
  FAQ accordions, and sequence diagrams — not a plain text article
- Optimize for traffic: SEO keywords, FAQ schema, TL;DR, question-shaped H2s
- Sequence/swimlane diagrams help engineers AND business leaders — include one
- Diagrams: embed logos inline (vendor + AlertMend + Slack), big and centered,
  title case labels (not ALL CAPS), arrow labels on white pills for readability
- Keep diagrams simple: 3 columns max (e.g. {TOOL} → AlertMend → Slack), no K8s
  swimlane unless the story needs it
- Related content sidebar on desktop (email signup + related posts + Explore links)
- One bottom CTA only (no mid-page CTA row)
- CTA buttons must use explicit colors (white text on dark btn, dark text on white btn)

COPY & VOICE
- Don't use em dashes (—). Use commas, periods, or colons instead
- Readers ALREADY use {TOOL} — do not teach what the product is
- Angle: observability / keeping it online (not "monitoring files" or generic ops)
- Open with "You're in the right place if…" so readers know this is the right post
- Not a {TOOL} tutorial — observability with AlertMend in a few clicks
- SRE runbook voice (20-year veteran), not marketing landing page copy
- No trust pills ("10 min setup", "No Grafana required"), no DIY comparison tables
- Every recommendation: symptom → "In AlertMend:" concrete action
- Position AlertMend as state-of-the-art, next-generation AI observability, out of the box
  (do not claim "most used" without a public stat)
- On-page copy simple for business readers; technical terms (OOMKilled, /ready) OK in
  meta keywords and JSON-LD, not in body tables/buttons

BRANDING
- Use official product name and logo (correct spelling, link to vendor site)
- AlertMend × vendor dual branding in hero when it's an integration post

RESEARCH
- Search web/GitHub for top searched monitoring/observability terms for {TOOL}
- FAQ questions = full Google phrases; H2s shaped as search queries

TECHNICAL
- URL: /blog/{slug} — no .html
- Never edit dist/ by hand
- Do not use .reveal scroll-reveal on panels that remount (causes invisible content)
- Frontmatter title ≤ 43 chars (build adds " | AlertMend AI")
```

---

## Master prompt (attach standing instructions)

Use this as your default Cursor message for any new post:

```
@docs/NEW_BLOG_GUIDE.md
@docs/NEW_BLOG_PROMPTS.md
@public/blog/monitor-docling-using-alertmend/index.html

Read the "Standing custom instructions" section in NEW_BLOG_PROMPTS.md and follow every rule.

Create a rich interactive blog:
- Slug: {slug}
- Title: {title}
- Tool: {TOOL}
- Category: {category}

Make it dynamic and intuitive with images, animations, sequence diagrams, and
interactive sections. Pull search traffic from Google and AI chatbots.

Then run scaffold, implement, generate:blog-list, build:static-blogs, validate:blogs.
```

---

## 1. Full blog (one-shot)

Use when you want Cursor to scaffold, implement, and wire everything.

```
Read docs/NEW_BLOG_GUIDE.md and docs/NEW_BLOG_PROMPTS.md.

Create a rich interactive blog post:

- Slug: {slug}
- Title: {title}
- Tool/product: {TOOL}
- Category: {category}
- Angle: {TOOL} observability with AlertMend (readers already run {TOOL}; we help keep it online)

Steps:
1. Run: npm run scaffold:blog -- {slug} "{title}"
2. Copy nav, sidebar, and inline chrome CSS from public/blog/monitor-docling-using-alertmend/index.html into public/blog/{slug}/index.html
3. Build the full page following the Docling reference (hero, TL;DR, sequence diagram, 4-step setup, FAQ, CTA, related sidebar)
4. Add public/assets/{slug}/ styles, script.js (FAQ accordion + signup), hero.svg, and recovery-flow.svg sequence diagram with logos
5. Update public/blog/{slug}.md frontmatter (title ≤ 43 chars, excerpt 50–160 chars, keywords)
6. Run: npm run generate:blog-list && npm run build:static-blogs && npm run validate:blogs

Constraints (see Standing custom instructions):
- Dynamic and intuitive: images, animated dashboard mock, interactive mode tabs, FAQ accordion, sequence diagram SVG
- No em dashes (—)
- SRE runbook voice, not marketing fluff
- Every recommendation must say what AlertMend does (URL check, Slack incident, runbook, auto-restart)
- Readers already use {TOOL}; observability angle, not a product tutorial
- Violet accent only (#7c3aed)
- CTA buttons need explicit colors (white on dark, dark on white)
- Do not edit dist/ by hand
- URL: /blog/{slug} (no .html)

Preview: npm run dev → http://localhost:5173/blog/{slug}
```

---

## 2. Scaffold only

Use when you want to fill in content yourself after scaffold.

```
Run npm run scaffold:blog -- {slug} "{title}"

Then copy nav, sidebar, and the inline <style> chrome block from
public/blog/monitor-docling-using-alertmend/index.html into
public/blog/{slug}/index.html.

Do not change dist/. Run npm run generate:blog-list after scaffold.
```

---

## 3. Research search terms

Run before writing copy so FAQ and H2s match real queries.

```
Search the web and GitHub for the most searched {TOOL} monitoring, observability, and production failure topics.

Return:
1. Top 8–10 search queries (full phrases people type into Google)
2. For each: common failure mode + what teams try first
3. GitHub issue links where relevant

Then suggest:
- 8 FAQ questions (full question phrasing for SEO)
- 5 H2 headings shaped as search queries
- 15 keywords for frontmatter

Tool: {TOOL}
Context: integration guide with AlertMend for teams already running {TOOL} in production
```

---

## 4. Write hero + audience block

Paste research output into this prompt.

```
Write the hero section for public/blog/{slug}/index.html.

Include:
- Dual branding: {TOOL} logo × AlertMend (use official spelling and link to vendor site)
- Tagline: "{TOOL} observability · You already run it; AlertMend keeps it online"
- "You're in the right place if…" (3 bullets: already run {TOOL}, pipeline depends on it, want alerts + auto-recovery)
- One line: not a {TOOL} tutorial; connect to AlertMend in a few clicks
- TL;DR paragraph for SEO/AI crawlers (one sentence)
- Two columns: "When {TOOL} stops working" (failure modes) vs "Why AlertMend" (connect, health checks, Slack + AI RCA, runbooks)
- Pipeline strip: 5 signals AlertMend watches (plain labels, not jargon)

Voice: senior SRE runbook. No em dashes. No "10 min setup" trust pills.
Output: HTML snippets matching classes in public/assets/monitor-docling-using-alertmend/styles.css
```

---

## 5. Sequence diagram (SVG)

```
Create public/assets/{slug}/recovery-flow.svg

3-column sequence diagram (like the Docling post):
| {TOOL} | AlertMend | Slack / your team |

Flow:
1. Normal operation — {TOOL} healthy
2. Failure — out of memory / health check fails
3. Alert — Slack message with AI summary
4. Fix — AlertMend restart runbook
5. Verify — healthy again
6. Outcome box: pipeline keeps moving, minutes not hours

Requirements:
- Embed logos inline in SVG (Docling/vendor logo, AlertMend mascot from /logos/alertmend-logo.svg, Slack hash)
- Title case labels, not ALL CAPS
- Logo on top, label below, centered in header boxes
- Arrow labels on white pills for readability
- Reference: public/assets/monitor-docling-using-alertmend/docling-alertmend-recovery-flow.svg

No Kubernetes swimlane unless I ask for it.
```

---

## 6. Four-step setup + deployment modes

```
For {TOOL}, add to public/blog/{slug}/index.html:

1. "When to alert your team" table: Signal | Action | In AlertMend (5 rows)
2. "Set up in four steps" cards: Connect → Health check → Alert team → Auto-recover
3. Deployment mode picker (if {TOOL} runs multiple ways):
   - Tab buttons + playbook panel that updates on click
   - Each mode: summary + "Set up in AlertMend" bullet list + tip
   - Dashboard mock that updates per mode (metric labels + sample alert toast)

Wire interactivity in public/assets/{slug}/script.js (copy pattern from monitor-docling-using-alertmend/script.js).

Do not use .reveal / scroll-reveal on panels that remount on tab switch (causes invisible content).

Modes for {TOOL}: {list modes, e.g. library, CLI, K8s, Docker API, MCP}
```

---

## 7. FAQ + JSON-LD

```
Write 8 FAQ items for {TOOL} + AlertMend observability.

Rules:
- Questions = full Google search phrases ("How do I monitor {TOOL} health checks?")
- Answers: symptom → "In AlertMend:" concrete action (not generic kubectl advice)
- Plain language on page; technical terms OK in meta/keywords only
- No em dashes

Add to:
1. FAQ accordion HTML in public/blog/{slug}/index.html
2. FAQPage JSON-LD in <head>
3. HowTo JSON-LD for the 4 setup steps

Match schema pattern in public/blog/monitor-docling-using-alertmend/index.html
```

---

## 8. SEO + frontmatter pass

```
Audit SEO for public/blog/{slug}:

1. public/blog/{slug}.md frontmatter:
   - title ≤ 43 chars (build adds " | AlertMend AI", max 60 total)
   - excerpt 50–160 chars
   - keywords: 10+ high-intent terms including {TOOL} + AlertMend

2. index.html <head>:
   - title, description, keywords, canonical https://www.alertmend.io/blog/{slug}
   - og:image → /assets/{slug}/hero.svg (or PNG)
   - BlogPosting JSON-LD

3. H2s shaped as search queries

4. Run npm run generate:blog-list && npm run validate:blogs
   Fix any validation errors.

Report what changed and final character counts for title/excerpt.
```

---

## 9. Voice cleanup (SRE pass)

```
Review public/blog/{slug}/index.html and public/assets/{slug}/.

Rewrite toward senior SRE runbook voice:

Remove:
- Trust pills ("10 min setup", "No Grafana required")
- DIY comparison tables ("why not wire it yourself")
- Repeated four-step pitch in hero, FAQ, and every section
- Generic ops advice without "In AlertMend:"

Add:
- Specific failure modes (not vague "things break")
- When to page vs warn vs suppress
- Honest caveats (auto-restart is availability, not root cause)

Keep AlertMend as the product story but dense and operational.
No em dashes. Do not expose exit codes / kubectl unless in a collapsible technical note.

Run npm run build:static-blogs after edits.
```

---

## 10. AlertMend positioning pass

```
The post reads like generic ops advice. Reframe public/blog/{slug}/ so AlertMend is the story.

Every section pattern: symptom → In AlertMend: [URL check | Slack incident | runbook | auto-restart]

Update:
- Hero "Why AlertMend" column
- Signal hierarchy table (third column = In AlertMend)
- Failure mode cards
- FAQ answers
- Wire-up checklist steps (start with AlertMend UI action)
- Bottom CTA: state-of-the-art AI observability, out of the box, few clicks

Position AlertMend as next-generation AI observability for production AI/K8s workloads.
Do not claim "most used" without a stat.
No em dashes.
```

---

## 11. Simplify for business readers

```
The post exposes too much infra jargon on-page (/ready, OOMKilled, exit 137, kubectl).

Simplify user-facing copy in public/blog/{slug}/:
- Outcomes first: Slack alert, auto-restart, "give it more memory"
- Plain labels in tables and diagrams ("Ready check", "Out of memory")
- Keep technical keywords in public/blog/{slug}.md meta only

Remove curl/OTEL code blocks unless I ask.
Deployment playbooks: only 4 AlertMend setup bullets per mode.

Do not dumb down the sequence diagram labels too much.
```

---

## 12. Code generator (optional)

Use when the post has large data arrays (FAQ, modes, issues) like Docling.

```
Create scripts/static-blogs/{slug}.mjs that exports async function build(slug).

Use helpers from scripts/static-blog-shared.mjs:
- parseFrontmatter, getRelatedPosts, esc, CHROME_INLINE_CSS
- buildNavHtml, buildSidebarHtml, buildArticleHeader, writeStaticBlogOutputs

Copy structure from scripts/static-blogs/monitor-docling-using-alertmend.mjs.
Content arrays (FAQ, modes, signal table, top issues) live at top of the file.

Run npm run build:static-blogs to regenerate public/blog/{slug}/index.html.

Do not duplicate chrome HTML; use shared helpers.
```

---

## 13. Pre-ship QA

```
QA public/blog/{slug} before merge:

1. npm run dev → /blog/{slug} shows full static page (not React loading spinner)
2. Hard refresh; test FAQ accordion and mode tabs (if any)
3. "Start with auto-remediation" CTA: visible text (not white-on-white)
4. Related content sidebar visible on desktop (1024px+)
5. npm run validate:blogs passes
6. npm run build passes

Checklist from docs/NEW_BLOG_GUIDE.md page checklist — mark each item done or fix.

List any issues found and fix them.
```

---

## 14. Fix build validation errors

```
npm run validate:blogs failed for {slug}.

Read scripts/validate-blogs.js rules and fix:
- Title length (frontmatter title + " | AlertMend AI" must be 30–60 chars)
- Excerpt 50–160 chars
- Static HTML at dist/blog/{slug}/index.html (run build:static-blogs first)
- Body content ≥ 500 chars, article-content region present

Fix and re-run validate:blogs until it passes.
```

---

## 15. Related content sidebar missing

```
The right sidebar is blank on /blog/{slug}.

Copy sidebar structure from public/blog/monitor-docling-using-alertmend/index.html:
- Email signup form (id blog-signup-form)
- Related content (10 posts from blogList.json)
- Explore AlertMend links

Ensure content-wrapper grid at 1024px+: main-col + sidebar.
Signup handler must be in public/assets/{slug}/script.js (copy from monitor-docling-using-alertmend).

Regenerate with npm run build:static-blogs if using a code generator.
```

---

## Prompt order (recommended)

| Step | Prompt |
|------|--------|
| 1 | **3** Research search terms |
| 2 | **1** or **2** Scaffold + implement |
| 3 | **4** Hero + audience |
| 4 | **5** Sequence diagram |
| 5 | **6** Setup + modes |
| 6 | **7** FAQ + JSON-LD |
| 7 | **9** SRE voice cleanup |
| 8 | **10** AlertMend positioning |
| 9 | **11** Simplify (if too technical) |
| 10 | **8** SEO + frontmatter |
| 11 | **13** Pre-ship QA |

---

## Cursor tip

Attach context for better results:

```
@docs/NEW_BLOG_GUIDE.md
@docs/NEW_BLOG_PROMPTS.md
@public/blog/monitor-docling-using-alertmend/index.html
@public/assets/monitor-docling-using-alertmend/styles.css
@scripts/static-blog-shared.mjs
```

Then run prompt **1** or the step-specific prompt you need.
