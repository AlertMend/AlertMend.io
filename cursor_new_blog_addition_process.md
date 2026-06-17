# New blog addition process
_Exported on 14/06/2026 at 9:50:05 GMT+5:30 from Cursor (3.7.27)_

---

**User**

can you add a simple blog -> "How to monitor DocLing using AlertMend"

---

**Cursor**

Searching the repo for DocLing references and reviewing an existing post's format before adding the new blog.


Creating the blog post and regenerating the blog list.


Generating HTML and updating the sitemap for the new post.


Added the new blog post. Here’s what was created:

**File:** `public/blog/monitor-docling-using-alertmend.md`  
**Slug:** `monitor-docling-using-alertmend`  
**URL:** `/blog/monitor-docling-using-alertmend`

The post covers:
- What to monitor (availability, latency, errors, resource pressure, queue depth)
- Setting up a health endpoint
- URL monitoring in AlertMend
- Kubernetes metrics and auto-remediation
- A synthetic conversion check to validate end-to-end parsing

Also ran:
- `npm run generate:blog-list` — post is in the blog index (652 posts)
- `npm run build:blog` — static HTML at `dist/blogs/monitor-docling-using-alertmend.html`
- `npm run build:sitemap` — sitemap updated

**Local preview:**
```bash
npm run dev
```
Then open `http://localhost:5173/blog/monitor-docling-using-alertmend`

If you want changes to the content, tone, or DocLing setup details, say what to adjust.

---

**User**

Now, this is pretty old style blog

Can we make it more dynamic and intutive using some images or even animation

+ 

Keep it mind that it should pull lot of traffic

---

**Cursor**

Exploring how blog posts are rendered and what patterns exist for richer, more engaging content.


Building a rich interactive blog component with animations, improved SEO, and wiring it into the blog page.


The DocLing blog is now a **rich interactive experience** on the React route (`/blog/monitor-docling-using-alertmend`), while the markdown source stays updated for SEO and static HTML generation.

## What changed

### Interactive React layout
On `/blog/monitor-docling-using-alertmend`, the plain markdown wall is replaced with a custom component that includes:

- **Animated document pipeline** — PDF → DocLing → JSON → RAG, with a moving packet animation
- **Live dashboard mock** — pulsing metrics, latency bar, and a sliding OOM alert toast
- **Signal cards** — five monitoring priorities with icons
- **Architecture diagram** — animated AlertMend monitor ring
- **4-step interactive wizard** — click through Health → URL → K8s → Synthetic setup
- **FAQ accordion** — optimized for Google featured snippets
- **Dark CTA band** — conversion-focused demo prompt

Scroll-reveal animations use the same `.reveal` pattern as the homepage.

### SEO / traffic improvements
- **Better keywords:** DocLing monitoring, RAG pipeline, Kubernetes, OOMKilled
- **FAQ schema** (`FAQPage` JSON-LD) for rich search results
- **Custom OG image:** `/media/blog/docling-hero.svg` (pipeline diagram for social shares)
- **Expanded markdown** with FAQ + hero image for the static HTML path (`/blogs/*.html`)

### New files
| File | Purpose |
|------|---------|
| `src/components/blog/DocLingMonitoringBlog.tsx` | Interactive blog content |
| `src/components/blog/DocLingMonitoringBlog.module.css` | Animations + layout |
| `src/components/blog/enhancedBlogRegistry.ts` | Slug registry for future enhanced posts |
| `public/media/blog/docling-hero.svg` | OG / social preview image |

### Preview locally
```bash
npm run dev
```
Open: `http://localhost:5173/blog/monitor-docling-using-alertmend`

---

**Note:** The enhanced layout only applies on `/blog/...` (React route). The static HTML at `/blogs/monitor-docling-using-alertmend.html` still uses markdown with the hero SVG and FAQ — good for crawlers, but without the animations.

If you want to go further for traffic, next steps could be:
1. A short **screen recording** (like the Hero section) showing AlertMend detecting a DocLing OOM
2. A **"Featured" badge** on the blog index for this post
3. **Internal links** from related Kubernetes/RAG posts pointing here

Say which of those you want and I can add them.

---

**User**

I think Docling can run saveral ways

---

**Cursor**

Researching DocLing deployment options so we can update the blog to cover them accurately.


Updating the blog to cover DocLing's deployment modes (library, CLI, Docling Serve, Docker, Kubernetes, MCP) with mode-specific monitoring guidance.


Good call — the blog was too Kubernetes-centric. DocLing actually ships several run modes, and the post now reflects that.

## Five ways DocLing runs (now in the blog)

| Mode | What it is | How AlertMend monitors it |
|------|------------|---------------------------|
| **Python library** | `pip install docling`, `DocumentConverter` in your app | Log alerts, conversion duration metrics, memory on the host pod |
| **CLI & batch jobs** | `docling file.pdf` via CronJob, Airflow, CI | Job failure alerts, duration SLAs, CronJob failure events |
| **Docling Serve** | FastAPI REST API (`docling-serve run` or Docker, port **5001**) | `/health` URL checks, `/v1/convert/file` latency SLOs, async task polling |
| **Kubernetes** | docling-serve as a Deployment/Service | URL checks + pod OOM/restart alerts + auto-remediation |
| **MCP server** | Document tools for AI agents (LangChain, CrewAI, etc.) | Tool timeout alerts + health of the DocLing backend underneath |

## What changed in the UI

On `/blog/monitor-docling-using-alertmend` you now get:

- **Interactive mode picker** — click a deployment style to see a tailored monitoring playbook
- **Dynamic dashboard mock** — metrics and alert examples change per mode
- **Mode comparison table** — quick reference for library vs Serve vs K8s vs MCP
- **Correct Docling Serve API paths** — `/health` on port 5001, `/v1/convert/file` (not the old generic `/convert` on 8080)
- **Updated FAQ** — includes “What are the different ways to run DocLing?” for search traffic

The markdown source was updated too, so the static HTML path stays aligned for crawlers.

Refresh the dev page and try clicking through the five mode tabs — the playbook and dashboard update for each one. If you want, we can add a sixth tab for a specific setup you use (e.g. only async `/v1/convert/source` with a queue worker).

---

**User**

whats the URL?

---

**Cursor**

**Production:** [https://www.alertmend.io/blog/monitor-docling-using-alertmend](https://www.alertmend.io/blog/monitor-docling-using-alertmend)

**Local dev** (with `npm run dev`): [http://localhost:5173/blog/monitor-docling-using-alertmend](http://localhost:5173/blog/monitor-docling-using-alertmend)

That’s the interactive React version with the deployment mode picker. Static HTML (no animations) would be at `/blogs/monitor-docling-using-alertmend.html` after a build.

---

**User**

http://localhost:5173/blog/monitor-docling-using-alertmend

=> this shows blank

---

**Cursor**

Investigating why the blog page renders blank — checking the dev server, route, and component loading.


Identifying the issue: `.reveal` elements start at `opacity: 0`, and `useScrollReveal` runs before async blog content mounts, so they never get `.visible`. Fixing by re-attaching scroll reveal after the post loads.


The blank page was a bug — not missing content.

**Cause:** The interactive sections use the `.reveal` class, which starts at `opacity: 0`. Scroll-reveal runs on route change, but the blog content loads **after** that (async markdown fetch). By the time the DocLing component mounted, the observer had already run, so nothing ever got `.visible` — the page looked empty.

**Fix:** Re-attach scroll reveal once the post finishes loading in `BlogPostDetailPage`.

**What to do:**
1. Hard refresh: `Cmd+Shift+R` on [http://localhost:5173/blog/monitor-docling-using-alertmend](http://localhost:5173/blog/monitor-docling-using-alertmend)
2. If it’s still blank, check whether dev is on **5174** instead (when 5173 is already in use): [http://localhost:5174/blog/monitor-docling-using-alertmend](http://localhost:5174/blog/monitor-docling-using-alertmend)

You should see the title, deployment mode picker, animated dashboard, and the rest of the interactive content. If not, say what you see (completely white vs. header only vs. “Post Not Found”).

---

**User**

its blank when I select python library

---

**Cursor**

Selecting "Python library" remounts the playbook with `.reveal` but scroll-reveal doesn't re-run, leaving it at `opacity: 0`. Checking and fixing.


The playbook panel remounts on mode switch with `.reveal` (opacity: 0) but scroll-reveal never re-runs. Removing `.reveal` from the interactive panel and adding a Python library code example.


Same root cause, different trigger.

When you clicked **Python library**, the playbook panel **remounted** with the `.reveal` class (`opacity: 0`). Scroll-reveal only ran once on initial page load, so the new panel never got `.visible` — it looked blank even though the content was there.

**Fix applied:**
- Removed `.reveal` from the mode playbook panel (it already has its own slide-in animation)
- Added a **Python code example** for the library mode so that tab has more visible content

Hard refresh and click **Python library** again — you should see the playbook with checks, sample `DocumentConverter` code, and the tip box.

If anything still looks off, let me know which tab.

---

**User**

Don't use —

---

**Cursor**

Removing em dashes from the DocLing blog source files.


Removed all em dashes (`—`) from the DocLing blog. Replaced them with colons, semicolons, or periods depending on context.

Updated files:
- `src/components/blog/DocLingMonitoringBlog.tsx`
- `public/blog/monitor-docling-using-alertmend.md`
- `src/utils/blogList.json` (regenerated excerpt)

Example changes:
- `"server—DocLing"` → `"server; DocLing"`
- `"Availability — HTTP"` → `"Availability: HTTP"`
- Alert toasts: `"failed — 502"` → `"failed: 502"`

Hard refresh the page to see the updates.

---

**User**

Can you search web, and see whats the most searched terms using Docling monitoring/observability issues

And include those into this blog

---

**Cursor**

Integrating top Docling monitoring search topics from GitHub issues and docling-serve docs into the blog.


Updated the blog with the **most searched Docling monitoring/observability topics** from GitHub issues, docling-serve OTEL docs, and community threads.

## What people search for most

| Search term | Why it matters |
|-------------|----------------|
| **Docling memory leak** | RAM grows per job and is not released ([#366](https://github.com/docling-project/docling-serve/issues/366), [#474](https://github.com/docling-project/docling-serve/issues/474)) |
| **Docling OOMKilled** | 4-9 GB images + large PDFs hit container limits |
| **GPU / CUDA OOM** | EasyOCR/VRAM not released after jobs ([#2954](https://github.com/docling-project/docling/issues/2954)) |
| **Docling health check** | `/health` vs `/ready`: liveness vs models loaded |
| **OpenTelemetry / Prometheus** | `DOCLING_SERVE_OTEL_ENABLE_METRICS`, scrape `/metrics` |
| **Async queue / RQ workers** | Stuck `/v1/status/{task_id}`, no HTTP probes on worker pods ([#349](https://github.com/docling-project/docling-serve/issues/349)) |
| **Slow or hanging PDF** | Large tables, arXiv PDFs run 15+ min or hang ([#2120](https://github.com/docling-project/docling/issues/2120), [#2109](https://github.com/docling-project/docling/issues/2109)) |
| **Docling observability** | OTEL traces from API to RQ workers |

## What was added to the blog

**Interactive page** (`/blog/monitor-docling-using-alertmend`):
- New **“Top searched monitoring issues”** card grid (8 items with AlertMend actions)
- **OpenTelemetry setup** block (`/metrics`, `/ready`, env vars)
- Expanded **FAQ** (memory leak, health vs ready, RQ workers, GPU, slow PDFs)
- Richer **Docling Serve / Kubernetes** playbooks (readiness, OTEL, memory trend, RQ)

**Markdown / SEO**:
- Updated **keywords** (memory leak, OOMKilled, OpenTelemetry, health check, etc.)
- New excerpt targeting those queries
- Full markdown section mirroring the search-term table + OTEL + FAQ

Hard refresh the page to see the new **“Top searched monitoring issues”** section below the dashboard.

---

**User**

we should use the name and logo properly

---

**Cursor**

Fixing branding to the official "Docling" name and adding the logo. Checking current usage and placing the logo asset.


Updating branding to official "Docling" (not "DocLing") and adding the logo to the blog hero.


Updated branding to match the official **Docling** identity (capital **D**, lowercase **ocling**), not "DocLing".

## Changes

**Name**
- All user-facing copy now uses **Docling** (library) and **Docling Serve** (API server)
- Page title: **"How to Monitor Docling Using AlertMend"**
- Package/CLI names stay lowercase: `docling`, `docling-serve`

**Logo**
- Added official logo at `public/media/blog/docling-logo.png`
- **Interactive blog hero:** logo links to [docling.ai](https://www.docling.ai/) with a short attribution line
- **Markdown/static HTML:** centered logo at the top of the post

**Other**
- OG hero SVG updated to say "Docling"
- Keywords and FAQ text aligned to official spelling

Hard refresh `/blog/monitor-docling-using-alertmend` to see the logo in the hero band above the pipeline animation. The page `<h1>` will also show "How to Monitor **Docling** Using AlertMend".

---

**User**

Also, monitor is file

But its more about making sure its up and running

---

**Cursor**

Reframing the blog around keeping Docling up and running (health/uptime), not file monitoring.


Reframed the blog around **keeping Docling up and running**, not monitoring files or generic observability.

## Messaging shift

**Before:** "How to Monitor Docling..." (sounds like watching documents/files)  
**After:** **"How to Keep Docling Running with AlertMend"** (uptime, health, recovery)

Core idea now: your RAG pipeline needs Docling **online** — responding on `/health`, models loaded on `/ready`, workers healthy, auto-recovery when something crashes.

## What changed

| Area | New focus |
|------|-----------|
| **Title / H1** | How to Keep Docling Running with AlertMend |
| **Hero** | "Your RAG pipeline needs Docling **online**, not just installed" |
| **Playbooks** | "Keep it running: {mode}" instead of "Monitoring playbook" |
| **Sections** | "Common reasons Docling goes down", "Is Docling actually running?", "Uptime checks by deployment mode" |
| **Signals** | Is it responding? Usable? Erroring? Will it stay up? Is the queue draining? |
| **FAQ** | Led by "How do I know if Docling is up and running?" |
| **CTA** | "Keep Docling online before your RAG pipeline breaks" |

Health checks are front and center: `/health` (process alive) vs `/ready` (models loaded), plus synthetic conversion to prove parsing still works.

The URL stays `/blog/monitor-docling-using-alertmend` so existing links don't break. Hard refresh to see the new title and copy.

---

**User**

I thnk it completely misses how AlertMend makes it easy to make it up n running

---

**Cursor**

Exploring how AlertMend is presented in the product and marketing site so we can reframe the blog around what it actually does to keep Docling running.


Adding a product-focused "How AlertMend keeps Docling running" section and reframing the post around AlertMend's connect → check → alert → auto-fix flow.


Reframing the blog around AlertMend's product flow: connect → observe → respond → automate, with concrete steps instead of generic ops advice.


Reframed the post so **AlertMend is the story**, not generic Docling ops advice.

### What changed

**Hero and intro** now lead with “connect in minutes, no Grafana stack” instead of a generic uptime guide.

**New centerpiece: “Keep Docling running in 4 steps”**
1. **Connect** (~5 min) – Helm agent or VM registration  
2. **Point at Docling** (~2 min) – URL check on `/ready`, K8s OOM/CrashLoop watched automatically  
3. **Get paged** – Slack incident + AI RCA with evidence  
4. **Auto-fix** – runbooks for OOM restart, memory leak rollout, queue scaling  

**“Why not wire it yourself?”** comparison table (DIY curl/Prometheus/kubectl vs AlertMend UI).

**Deployment mode picker** now shows **“What you do in AlertMend”** as the primary list, with Docling endpoints as secondary reference.

**CTA** updated with [Start free](https://app.alertmend.io/signup?source=blog-docling) and auto-remediation signup, not just Calendly.

**Markdown source** (`public/blog/monitor-docling-using-alertmend.md`) updated to match for static HTML/SEO.

Preview at `/blog/monitor-docling-using-alertmend` with `npm run dev`. If you want the static HTML rebuilt too, run `npm run generate:blog-list && npm run build:blog`.

---

**User**

we can do better at top to set context and build trust

---

**Cursor**

Reviewing the hero and how other pages establish context and trust.


Redesigning the hero: dual branding, clear problem/context framing, and scannable trust signals before the pipeline diagram.


The top of the post is reworked to set context and build trust before the how-to.

### What changed

**Dual branding** — Docling × AlertMend logos side by side, with “Integration guide · For teams running Docling in production” so readers know who this is for and why both names appear.

**Two-column context block**
- **The context** — What Docling is (IBM open-source, RAG/ingestion role), how teams run it, and the gap: Docling does not ship monitoring or auto-recovery. The pain is real (OOM on big PDFs, `/ready` stuck).
- **What AlertMend adds** — Clear product positioning (AIOps for K8s/cloud), concrete capabilities (Helm connect, `/ready` checks, Slack + AI RCA, OOM runbooks), plus an editorial trust line linking to Kubernetes monitoring and auto-remediation pages.

**Trust pills** — Scannable proof points: ~10 min setup, `/ready` checks, OOM auto-restart, Slack + AI RCA, no Grafana stack.

**Pipeline reframed** — Caption “Where Docling sits in your stack”; the Docling node is highlighted with “AlertMend watches here” instead of generic “Any mode”.

**Tighter intro below** — The repeat paragraph about deployment modes is shortened to a single bridge into the steps section.

Refresh `/blog/monitor-docling-using-alertmend` to see it. If you want to go further, we could add a one-line case study proof (e.g. Decklar’s K8s scale) in the credibility row, but I kept it product-accurate rather than implying existing Docling customers.

---

**User**

I don't think we are telling people why to use Docling

They already use it

We are helping it in its observability

---

**Cursor**

Reframing the hero and intro for teams already running Docling, focusing on observability rather than explaining what Docling is.


Good call. The top assumed people needed to learn what Docling is. It now assumes they already run it and focuses on observability.

### Reframed hero

**Tagline:** “Docling observability · You already run it; AlertMend keeps it online”

**Left column — “What breaks in production”**  
OOM on large PDFs, stuck `/ready`, memory leaks, async workers stalling while the API returns 200. No IBM/parser explainer.

**Right column — “What AlertMend covers”**  
How to plug observability into the deployment they already have: `/ready` checks, OOM/CrashLoop tracking, Slack + RCA, runbooks.

### Diagram replaced

Instead of PDF → Docling → JSON → RAG (product education), it now shows:

**`/ready` → OOMKilled → Conversion SLA → Queue depth → Slack + RCA → auto-fix**

Caption: “Signals AlertMend watches on your deployment”

### Rest of page

- Section renamed to **“Observability setup in 4 steps”**
- Intro bridge shortened to “pick your deployment mode” without re-explaining Docling
- Markdown source updated to match

Refresh `/blog/monitor-docling-using-alertmend` to see it.

---

**User**

this is not working

---

**Cursor**

The "Start free" button likely has a contrast issue — checking its styles now.


Tailwind's `prose` styles are overriding the CTA link colors inside the blog article. Excluding the enhanced layout from `prose` and fixing button styles.


The **Start free** button was invisible because Tailwind’s `prose` styles were overriding link colors inside the blog article — dark violet text on a near-black button.

**Fix:**
1. Enhanced blog layout is **outside** the `prose` wrapper so typography link rules no longer apply to its CTAs.
2. **Explicit white text** on `.amCtaPrimary` (including hover and the arrow icon).

Refresh the page — **Start free** should now show white text on the dark button. The bottom **Start with auto-remediation** button got the same treatment.

---

**User**

<system_notification>
The following task has finished. If you were already aware, ignore this notification and do not restate prior responses.

<task>
kind: shell
status: aborted
task_id: 970067
title: Start Vite dev server
detail: terminated_by_user
output_path: /Users/dinesh/.cursor/projects/Users-dinesh-work-AlertMend-io/terminals/970067.txt
</task>
</system_notification>
<user_query>Briefly inform the user about the task result and perform any follow-up actions (if needed). If there's no follow-ups needed, don't explicitly say that.</user_query>

---

**Cursor**

The **Start free** button fix is in place. Tailwind’s `prose` styles were painting link text dark on the dark button, so the enhanced Docling blog layout now renders outside `prose`, and the primary CTA uses explicit white text and icon styling.

Hard-refresh `/blog/monitor-docling-using-alertmend` to confirm the button reads clearly. Run `npm run dev` again if you need a local preview.

---

**User**

we can remove this

---

**Cursor**

Removed the mid-page CTA row (Start free, See auto-remediation, Kubernetes monitoring). The bottom CTA band at the end of the post is unchanged.

---

**User**

is this really world class?

Do you think if a SRE with 20 years of experience writing the blog would write like this?

---

**Cursor**

Reviewing the post with an SRE lens—checking tone, specificity, and whether it reads like operational writing or marketing copy.


Honest answer: it reads like marketing copy, not a veteran SRE runbook. Rewriting the voice—denser, more operational, fewer sales sections.


Rewriting for an SRE runbook voice: removing sales sections, adding signal hierarchy, and tightening operational language.


No. Before this pass it read like a landing page with blog SEO bolted on, not something a senior SRE would publish.

A 20-year SRE would not write:
- **"~10 min to first alert"** and **"No Grafana required"** trust pills (marketing, not ops)
- **"Why not wire it yourself?"** (sales comparison, not a runbook)
- The same four ideas repeated across hero, 4-step cards, DIY table, failure cards, FAQ, and deployment matrix
- **"Monitoring → Add URL Check"** UI copy without saying *when* to page vs warn vs suppress
- Failure advice without tradeoffs (auto-restart is a band-aid; `/ready` 503 during deploy is normal)

They *would* write:
- **Signal hierarchy** (page / warn / suppress) with reasons
- **Specific failure modes** they've actually seen (OOM at 847 MiB, `/health` lying, queue stall)
- **Honest caveats** (restart fixes availability, not root cause; tune limits after the first incident)
- **One runbook per deployment mode**, not six sections saying the same thing

I rewrote the post toward that voice:
- Hero opens with **failure modes you will hit**, not product pitch
- Removed trust pills and the DIY comparison table
- Added **"What to page on"** hierarchy table
- Renamed sections to **Wire-up checklist**, **Runbook by deployment mode**, **Known production failures**
- FAQ now answers probe choice, auto-restart tradeoffs, async workers (practitioner questions)
- Cut duplicate sections (signal cards, deployment matrix)
- CTA: **"Run this on your cluster"** instead of **"Get monitored in 10 minutes"**

It's closer, but still a product blog. A true SRE post would include your actual probe intervals, memory limits, and a real incident anecdote. If you want to push further, we can add a concrete example (e.g. "docling-serve on GKE, 12Gi limit, /ready every 30s") and trim the dashboard mock if it feels too marketing.

---

**User**

And it is SEO ready?

I want to pull lot of traffic from google or AI chat bots like chatGPT

---

**Cursor**

Auditing SEO and AI-discoverability across the blog post, metadata, and static HTML pipeline.


Honestly: partially ready — fixing SEO gaps (schema, keywords, query-shaped FAQs, TL;DR for AI crawlers).


**Short answer:** It was close on content, weak on discoverability. I tightened several SEO gaps; traffic still depends on indexing time, backlinks, and Docling search volume (niche).

### What was already in good shape
- FAQ JSON-LD on the React route (Google rich results)
- Custom OG image, canonical URL, sitemap entry at `/blog/monitor-docling-using-alertmend`
- Static HTML from `build:blog` at `/blog/.../index.html` and `/blogs/...html` for crawlers that skip JS
- High-intent keywords in the body (OOMKilled, `/ready`, memory leak, docling-serve)

### What was missing (now fixed)
| Gap | Fix |
|-----|-----|
| Stale title/excerpt in `blogList.json` | Regenerated; title now leads with **"Docling Observability: Monitor docling-serve…"** |
| FAQ questions too terse for search/AI | Rewritten as full queries: *"How do I monitor docling-serve health checks?"*, *"Why does Docling keep getting OOMKilled?"*, etc. |
| No **HowTo** schema | Added 4-step HowTo JSON-LD for Google + AI extraction |
| No **TL;DR** for ChatGPT/Perplexity | Added at top of React page and markdown |
| Weak `keywords` meta | Expanded frontmatter + passed through to meta tags |
| H2s not matching search queries | Added *"How to monitor docling-serve in production"*, *"How to fix Docling OOMKilled in Kubernetes"* |

### What still limits traffic (honest)
1. **Docling is a niche topic** — search volume is small vs generic K8s posts. You will not get massive traffic unless Docling adoption spikes or you rank for broader terms.
2. **React route is not prerendered** — Google renders JS, but ChatGPT/Bing may lean on the static markdown HTML. Run `npm run build:blog` on deploy so `/blogs/*.html` stays current.
3. **No backlinks yet** — Google and AI bots trust pages other sites cite. Share on Docling GitHub discussions, IBM/community channels, HN, Reddit r/LocalLLaMA.
4. **Dual URL** — `/blog/slug` (React) vs `/blogs/*.html` (static). Both exist; canonical points to `/blog/slug`. Fine, but do not promote both.

### For AI chatbots specifically
They favor: **clear TL;DR**, **question-shaped headings**, **FAQ with direct answers**, **code snippets**, **entity names** (Docling, docling-serve, Kubernetes). The post now has those. They still may not cite you until the URL appears in their training/index data or gets linked from authoritative sources.

**Before deploy:** `npm run generate:blog-list && npm run build:blog && npm run build:sitemap` so static HTML and sitemap match the updated copy.

---

**User**

what is this?

---

**Cursor**

That box is a **TL;DR summary** added at the top of the hero for SEO and AI crawlers (Google snippets, ChatGPT, Perplexity). The idea is to give them one tight paragraph that answers “how do I monitor Docling?” without reading the whole post.

The full text is:

> **TL;DR:** Monitor docling-serve with synthetics on `/ready` (port 5001), page on OOMKilled and failed /ready checks, and auto-restart pods when memory leaks or large PDFs kill the process. AlertMend wires this without hand-rolling Prometheus and curl cron jobs.

Your screenshot is just a narrow crop, so it looks cut off (“docling-s”, “Prom”). The full sentence should wrap normally on the page.

It’s optional. For an SRE runbook, **“TL;DR:”** can feel bloggy. If you prefer, we can drop the label and fold it into a normal opening line, or remove the box and keep the summary only in markdown for static HTML crawlers.

---

**User**

it feels like AlertMend is doing nothing

---

**Cursor**

FAQ answers read like generic ops advice with AlertMend missing. Reviewing the post and tying each recommendation to concrete AlertMend actions.


Rewriting FAQs, failure responses, and signal hierarchy so each answer names what AlertMend does—not just generic ops advice.


You were right. That FAQ read like generic SRE advice (“yes, restart, tune limits”) with no mention of what AlertMend actually does.

The post had drifted toward **what to do in theory** instead of **what AlertMend does for you**. Same issue in the signal table, failure cards, and wire-up steps.

**Updated pattern everywhere:** symptom → **In AlertMend:** concrete action.

Example for the FAQ you flagged:

> **Should I auto-restart Docling on every OOMKilled?**  
> Yes. **In AlertMend, enable the OOMKilled runbook** on the docling-serve Deployment: AlertMend detects exit 137, opens a Slack incident with memory and restart context, and **rollout-restarts the pod without kubectl**. Then raise memory requests—OOM here is usually RSS leak or undersized limits, not a flake.

Also updated:
- **“What to page on”** table → third column is **In AlertMend**
- **Failure mode cards** → **In AlertMend:** not “First response”
- **Wire-up checklist** → each step starts with AlertMend UI/actions
- **Hero** → **What AlertMend does** (RCA, runbooks, URL checks)

Refresh the page and expand that FAQ again—it should now read as an AlertMend runbook, not a kubectl cheat sheet.

---

**User**

I think we are exposing tech details too much

---

**Cursor**

Simplifying copy across the post—outcomes and AlertMend actions first, less jargon.


Simplifying user-facing copy and hiding deep technical reference material in the deployment playbooks.


You were right — it read like internal runbook notes (exit 137, kubectl, RSS, rollout-restart) instead of a product story.

**What changed:**
- **FAQ and hero** now focus on outcomes: Slack alerts, auto-restart, “give Docling more memory” — not K8s internals
- **That OOM FAQ** is now: enable AlertMend’s out-of-memory runbook → Slack alert → service comes back automatically
- **Removed** the curl/OTEL code block and the per-mode “signals to watch” lists
- **Deployment playbooks** show only the 4 AlertMend setup steps
- **Tables and diagrams** use plain labels (“Ready check”, “Out of memory”) instead of `/ready`, OOMKilled, p95

SEO keywords (`OOMKilled`, `/ready`, etc.) stay in the page **meta and markdown source** for Google and AI crawlers, but the on-page experience is simpler.

Refresh and check that FAQ again — it should feel like “what AlertMend does for you,” not a kubectl cheat sheet.

---

**User**

lets provide the context first so reader is assured that he/she is reading the right blog

---

**Cursor**

Adding a clear “you’re in the right place” opener before the problem/solution sections.


Added a **“You’re in the right place if…”** block at the top of the hero, before the TL;DR and problem/solution columns.

It tells readers upfront:
- They **already run Docling** (API, K8s, library, or batch)
- Their **pipeline depends on it staying online**
- They want **alerts and auto-recovery**, not a getting-started guide

Plus a short note: *this is observability with AlertMend, not a Docling tutorial.*

Refresh the page — the assurance block should appear right under the Docling × AlertMend logos.

---

**User**

This is not a Docling tutorial. It assumes Docling is already in your stack and shows how AlertMend keeps it running with health checks, Slack alerts, and auto-recovery.

=> shows how we can setup its observability in just few clicks

---

**Cursor**

Updated. That line now reads:

> This is not a Docling tutorial. It assumes Docling is already in your stack and shows how to set up its observability in AlertMend in just a few clicks.

---

**User**

I think we should present AlertMend as state of the art out the box most used new generation AI observability tool

---

**Cursor**

Updating the hero and key intro copy to position AlertMend as next-generation, out-of-the-box AI observability—without overclaiming across the whole post.


Updated the hero to position **AlertMend** as the platform, not just a setup tool.

**Audience note (the line you highlighted):**
> This is not a Docling tutorial… shows how to connect it to **AlertMend**, a **state-of-the-art AI observability platform** with monitoring, **AI-powered incident analysis**, and **auto-recovery built in**. Docling observability in a few clicks.

**Also updated:**
- New checklist item: *next-generation AI observability out of the box*
- **Why AlertMend** column (replaces generic “What AlertMend does”) — built for production AI workloads, no DIY Prometheus/Grafana stack
- TL;DR and bottom CTA aligned to the same positioning
- Markdown + meta excerpt synced

I did not use “most used” literally since we do not have a public stat to back it. If you have a number or customer logos you want cited, we can add a one-line proof row under the hero.

---

**User**

Don't use —

---

**Cursor**

Removed all em dashes (`—`) from the Docling blog component and markdown source. Replaced with commas, periods, or short rephrases (e.g. “out of the box, not another DIY stack” instead of “out of the box—not”).

---

**User**

CTA not visible

---

**Cursor**

Fixing the bottom CTA button contrast—the same prose/link override issue as before.


The CTA inherits `--text` (likely light) from the page, causing white-on-white button text. Fixing with explicit dark button colors.


Fixed. The white **Start with auto-remediation** button was inheriting the page’s light `--text` color, so the label was white on white.

The CTA now uses explicit dark text (`#09090b`) on the white button, including hover and visited states. Refresh the page and the button should read clearly.

---

**User**

these flow charts are generally very helpful for engineers and business leaders to understand

---

**Cursor**

Adding a sequence-style flow diagram (like the Patroni example) showing how AlertMend detects Docling failures and auto-recovers.


Exactly — sequence diagrams like the Patroni failover example work well because they show **who does what, in what order**, without requiring readers to parse prose or YAML.

That pattern is now on the Docling post:

**Engineer view** — Four swimlanes (Docling serve → Kubernetes → AlertMend → Slack/your team) walk through normal operation, OOM failure, detection, alert with AI summary, runbook restart, and health check passing again.

**Leader view** — The outcome box at the bottom states the business result: *“RAG / ingestion pipeline keeps moving”* and *“Minutes of downtime, not hours of manual firefighting.”*

It sits in the **“How auto-recovery works”** section on `/blog/monitor-docling-using-alertmend`, right after the hero pipeline strip. The diagram CSS is wired up so it renders full-width with a border and caption.

Preview locally:

```bash
npm run dev
# http://localhost:5173/blog/monitor-docling-using-alertmend
```

If you want to push this pattern further, a good next addition would be a **second, simpler 4-step horizontal flow** (Detect → Alert → Fix → Verify) for executives who want the story in one glance, while keeping the sequence diagram for engineers. Say if you want that added.

---

**User**

can we add logos as well here?

---

**Cursor**

I'll locate the project logos and update the sequence diagram SVG to include them in each swimlane header.


External logo refs won't load when the diagram is used as an `<img>`, so I'll embed the logos inline in the SVG.


Creating the updated diagram with logos embedded inline so they render when the SVG is used as an `<img>`.


Done. Each swimlane header in the sequence diagram now includes its brand logo:

| Column | Logo |
|--------|------|
| **Docling serve** | Docling logo (embedded PNG) |
| **Kubernetes** | Official K8s helm wheel (inline SVG) |
| **AlertMend** | AlertMend mascot (inline SVG) |
| **Slack / your team** | Slack hash mark (inline SVG) |

Logos are embedded directly in the SVG file so they still render when the diagram is loaded as an `<img>` (external logo URLs would be blocked in that case). Header boxes are slightly taller to fit logo + label.

Refresh `/blog/monitor-docling-using-alertmend` to see the update. If anything looks off in sizing or alignment, say which column and we can tweak it.

---

**User**

logos can be bigger and visible

---

**Cursor**

I'll increase logo size and adjust the header layout so each brand mark reads clearly at a glance.


Redesigning headers with a stacked layout: larger logos on top, labels below. Fixing the Docling wordmark aspect ratio so it isn't squashed into a tiny square.


Updated the diagram headers so logos read clearly at a glance:

**Layout change:** Each header is now **logo on top, label below** (68px tall, up from 52px).

**Logo sizes:**
- **Docling** — 90×26px wordmark (correct aspect ratio; it was previously squashed into a 22px square)
- **Kubernetes** — ~34px helm wheel (scale 0.138, up from 0.088)
- **AlertMend** — ~33px mascot (scale 0.082, up from 0.055)
- **Slack** — ~36px hash (scale 0.28, up from 0.173)

Hard refresh `/blog/monitor-docling-using-alertmend` to see the update. If you want them even larger, we can bump the header boxes once more.

---

**User**

we should keep it simple. not sure if we really need kubernetes here

---

**Cursor**

Removing the Kubernetes swimlane and simplifying the flow to Docling → AlertMend → Slack.


Good call. Kubernetes was adding infrastructure detail that most readers do not need for the story.

The diagram is now **three columns**:

| Docling serve | AlertMend | Slack / your team |
|---|---|---|

**Simplified flow:**
1. **Normal** — Docling parsing PDFs, health check OK
2. **Failure** — Out of memory → health check fails → incident opened
3. **Alert** — Slack message with AI summary
4. **Fix** — AlertMend restart runbook → Docling back online
5. **Verify** — Health check passes again

No pod restarts, OOM events, or K8s event wiring. The message is: **Docling fails → AlertMend catches it → team knows → auto-restart → pipeline restored.**

Refresh the blog page to see it. The Kubernetes deployment section below the diagram is unchanged for teams that do run on K8s; it is just out of this overview diagram.

---

**User**

Do you think its proffessional?

---

**Cursor**

Yes — for a blog post aimed at engineers and business leaders, it reads as professional enough to publish.

**What works well**

- **Clear story in one glance:** Docling fails → AlertMend catches it → Slack alert → auto-restart → back online. That is exactly what leaders need.
- **Real logos:** Docling, AlertMend, and Slack make it feel credible, not like a generic template.
- **Good visual hierarchy:** Phase labels, state boxes (green/red/purple), and the outcome callout at the bottom land in the right order.
- **Right level of simplicity:** Dropping Kubernetes was the right call. This now reads like a product story, not an infrastructure diagram.

**What keeps it from feeling “enterprise-polished”**

- **ALL CAPS everywhere** (`DOCLING SERVE`, `HEALTH CHECK OK`) gives it a slightly diagram-template feel. Title case would look more refined.
- **Some labels are still engineer-facing** (“LARGE PDF / MEMORY PRESSURE”, “HEALTH CHECK FAILS”). Leaders understand the gist, but softer wording would broaden appeal.
- **It is clearly a custom SVG**, not a Figma-polished asset like you might see on Stripe or Datadog. That is fine for a blog, but it will not feel like a standalone marketing asset.

**Verdict:** Professional for an in-article explainer — trustworthy, readable, and on-brand. If you want it to feel more “executive-ready,” the highest-impact tweaks would be:

1. Title case instead of all caps  
2. Softer phase names (“Docling runs out of memory” instead of “LARGE PDF / MEMORY PRESSURE”)  
3. Slightly more whitespace between steps  

Want me to apply those polish passes?

---

**User**

logos are not centered, lables not visible

---

**Cursor**

Fixing logo centering and improving label visibility in the sequence diagram.


I'll check the generated SVG and confirm the logo embeds are correct.


Checking the Docling logo asset and cleaning up the SVG structure.


Regenerating the SVG with cleaner logo embedding, larger labels, and better visual centering.


Updated the sequence diagram in `public/media/blog/docling-alertmend-recovery-flow.svg` with these fixes:

**Logo centering**
- Each logo is positioned with `center_x - (width / 2)` so Docling, AlertMend, and Slack sit in the middle of their header boxes
- Header layout is logo on top, label below (taller 80px boxes for clearer spacing)
- Docling wordmark is wider (120×34) for better balance

**Label visibility**
- Arrow labels (`Health check OK`, `Restart Docling`, etc.) now use **12px bold** text in near-black (`#09090b`)
- Each arrow label sits on a **white pill** with a light border so it stays readable over the purple/green arrows
- Phase headers (`Normal operation`, `Auto-recovery runbook`, etc.) are **13px bold** with darker gray (`#27272a`)

Refresh the blog page to see it:

`http://localhost:5173/blog/monitor-docling-using-alertmend`

If the Docling wordmark still looks visually off (the PNG has the owl on the left), we can trim or swap that asset next.

---

**User**

Now, you made changes in dist

Previously when we were writing blogs
it was just a md file

---

**Cursor**

I'll trace how blog posts are authored and built in this repo so we can compare the old markdown-only flow with what's happening now.


You're right to flag this. For most posts, the workflow is still **one markdown file**. The Docling post is an exception, and **`dist/` should never be edited by hand**.

## Normal blog workflow (unchanged)

For almost every post, the source of truth is:

**`public/blog/<slug>.md`** (with YAML frontmatter)

That single file drives everything:

| Step | What it produces |
|------|------------------|
| `generate:blog-list` | `src/utils/blogList.json` |
| `build:blog` | `dist/blogs/<slug>.html` (standalone SEO HTML) |
| Vite + prerender | `dist/blog/<slug>/index.html` (React route snapshot) |
| Dev server | `/blog/<slug>` fetches the same `.md` and renders it with `react-markdown` |

So for a typical post: write MD, run build, done. No React components required.

## What changed for the Docling post

This post uses an **enhanced layout** on top of the markdown. The registry is explicit:

```1:7:src/components/blog/enhancedBlogRegistry.ts
/**
 * Slugs that render a custom React layout instead of plain markdown on /blog routes.
 * Markdown source is still used for SEO metadata, static HTML generation, and prerender text.
 */
export const ENHANCED_BLOG_SLUGS = new Set([
  'monitor-docling-using-alertmend',
])
```

On `/blog/monitor-docling-using-alertmend`, `BlogPostDetailPage` swaps `ReactMarkdown` for the custom component:

```350:354:src/pages/BlogPostDetailPage.tsx
                    <div className={useEnhancedLayout ? 'max-w-none' : 'prose prose-lg max-w-none'}>
                      <div className="text-gray-800 leading-7">
                        {useEnhancedLayout ? (
                          <DocLingMonitoringBlog />
                        ) : (
```

So this post now has **two layers**:

| Layer | Files | Purpose |
|-------|-------|---------|
| Markdown (still required) | `public/blog/monitor-docling-using-alertmend.md` | Frontmatter, SEO, sitemap, static HTML build, prerender fallback text |
| Custom React (new) | `DocLingMonitoringBlog.tsx`, `.module.css`, SVG in `public/media/blog/` | Rich layout on the live `/blog/` route (diagram, deployment picker, FAQ, etc.) |

The diagram fix was to **`public/media/blog/docling-alertmend-recovery-flow.svg`**, not to `dist/` directly.

## About `dist/`

`dist/` is **build output**. It gets regenerated by `npm run build`. You may see copies there like:

- `dist/blog/monitor-docling-using-alertmend.md`
- `dist/blog/monitor-docling-using-alertmend/index.html`
- `dist/blogs/Monitor-Docling-Using-Alertmend.html`

Those are artifacts from the build pipeline, not sources to edit. In dev (`npm run dev`), Vite serves from `public/` and the React app, so SVG changes show up without touching `dist/`.

## Practical implication

- **Most blogs:** still just `public/blog/foo.md`
- **Docling blog:** MD + React component + assets. Content can drift if you only update one side.
- **Before deploy:** run a full build so `dist/` picks up markdown, SVG, and prerendered HTML.

If you want to go back to “markdown only” for this post, you’d remove it from `enhancedBlogRegistry.ts` and put the content back into the `.md` file. The custom layout was added for the sequence diagram and richer UX, not because the blog system changed globally.

I'm in **Ask mode**, so I can't revert or rebuild `dist/` from here. Switch to **Agent mode** if you want that cleaned up or the post simplified back to markdown-only.

---

**User**

now, can't we need everything in a html and assets

like monitor-docling-using-alertmend.html
And all the images/css in

assets/monitor-docling-using-alertmend/

---

**Cursor**

I'll check how standalone blog HTML and assets are built today so we can see if a self-contained `monitor-docling-using-alertmend.html` + assets folder fits the existing pipeline.


Yes — you can absolutely move to a **self-contained HTML + assets folder** model. The repo doesn't work that way today, but it's a reasonable simplification for a rich post like Docling.

## What you have today

Three parallel paths for the same post:

| Path | Source | Output |
|------|--------|--------|
| Markdown | `public/blog/monitor-docling-using-alertmend.md` | Generated HTML at build time |
| Standalone HTML (Path B) | Same MD → `scripts/build-blog-html.js` | `dist/blogs/Monitor-Docling-Using-Alertmend.html` |
| React route (Path C) | MD + `DocLingMonitoringBlog.tsx` | `/blog/monitor-docling-using-alertmend` in the SPA |

Important details about the current HTML build:

- HTML is **generated from markdown**, not hand-written
- CSS is **inlined** in one giant `<style>` block inside `build-blog-html.js` (shared for all posts)
- Images live in shared folders like `public/media/blog/`, not per-post asset dirs
- The filename is **Title-Case**, not slug-case: `Monitor-Docling-Using-Alertmend.html`

So the Docling post is actually the **most complex** case: MD + React component + shared media. That's the opposite of "one HTML file + one assets folder."

## What you're proposing

```
public/blogs/monitor-docling-using-alertmend.html   (or dist/blogs/...)
public/assets/monitor-docling-using-alertmend/
  recovery-flow.svg
  docling-logo.png
  styles.css
  ...
```

That's a clean, portable model. **Yes, it works.** Many SEO-focused sites do exactly this.

## What you'd need to decide

**1. Source of truth**

Either:

- **Hand-authored HTML** in `public/blogs/` (checked into git), copied to `dist/` on build, or
- Keep a thin build step that only copies HTML + assets (no markdown → HTML conversion)

**2. Blog index metadata**

The blog listing still needs title, date, excerpt, category. Today that comes from MD frontmatter → `blogList.json`. With HTML-only you'd need one of:

- A small `monitor-docling-using-alertmend.json` sidecar
- Meta tags parsed from the HTML `<head>`
- A single registry entry in `generate-blog-list.js`

**3. The React route**

Right now `/blog/monitor-docling-using-alertmend` renders the custom React layout. With HTML-only you'd typically:

- **Redirect** `/blog/monitor-docling-using-alertmend` → `/blogs/monitor-docling-using-alertmend.html`, or
- Drop the React route entirely and only serve the static HTML

You can remove `DocLingMonitoringBlog.tsx`, `enhancedBlogRegistry.ts` entry, and related CSS.

**4. Interactive bits**

The deployment mode picker and scroll-reveal sections are React/CSS-module features. In pure HTML you'd use:

- Plain HTML + a small `<script>` for toggles, or
- Static sections (no picker)

The sequence diagram SVG works fine as a static asset reference.

**5. URL naming**

You said `monitor-docling-using-alertmend.html`. The site today uses Title-Case for `/blogs/*.html` URLs (SEO/history). You can use lowercase slug-style if you prefer — just update sitemap, canonical URLs, and any slug mappers consistently.

## Recommended layout (if you go this route)

```
public/
  blogs/
    monitor-docling-using-alertmend.html    ← full page, hand-authored or templated once
  assets/
    monitor-docling-using-alertmend/
      styles.css
      recovery-flow.svg
      docling-logo.png
      docling-hero.svg
```

In the HTML:

```html
<link rel="stylesheet" href="/assets/monitor-docling-using-alertmend/styles.css">
<img src="/assets/monitor-docling-using-alertmend/recovery-flow.svg" alt="...">
```

Vite already serves everything under `public/` as static files in dev and copies it to `dist/` on build — **no need to touch `dist/` manually**.

## Trade-offs

| Self-contained HTML + assets | Current MD + React |
|------------------------------|-------------------|
| Simple to author and reason about | Three rendering paths to keep in sync |
| No TypeScript/React for blog content | Rich interactive layout |
| Per-post CSS/images colocated | Shared design system via React |
| Good for crawlers (one static page) | Enhanced UX on `/blog/` route |
| Nav/footer duplicated or templated | Nav/footer from site shell |

## Practical recommendation

For **this one post**, a self-contained HTML bundle is a good fit because you already outgrew plain markdown.

For **most posts**, keep markdown-only — it's still just `public/blog/foo.md`.

Hybrid approach many teams use:

- **Default:** MD → auto-generated HTML (current pipeline)
- **Exception posts:** static HTML + `assets/<slug>/`, registered in blog list, React route redirects to HTML

That gives you the simplicity you want without rewriting the whole blog system.

---

I'm in **Ask mode**, so I can't implement this. If you want to switch, **Agent mode** can:

1. Create `public/assets/monitor-docling-using-alertmend/` and move assets
2. Build the standalone HTML from the current React layout
3. Remove the enhanced React path
4. Wire sitemap + blog list + optional redirect

Want lowercase `monitor-docling-using-alertmend.html`, or keep the existing Title-Case `/blogs/` URL pattern?

---

**User**

You are in agent mode now,
Please implement

---

**Cursor**

Implementing a self-contained HTML + assets bundle for the Docling post. Exploring the current layout and build wiring first.


Implementing the static HTML bundle: creating the build script, assets, and wiring it into the pipeline.


Creating the HTML generator script — the largest piece:


The Docling post is now a self-contained static HTML bundle. Here is what changed:

## New structure

```
public/blogs/monitor-docling-using-alertmend.html     ← full page (source of truth)
public/assets/monitor-docling-using-alertmend/
  styles.css
  script.js                                           ← mode picker + FAQ accordion
  docling-logo.png
  docling-hero.svg
  docling-alertmend-recovery-flow.svg
public/blog/monitor-docling-using-alertmend.md        ← frontmatter only (blog index metadata)
```

## Removed

- `DocLingMonitoringBlog.tsx` / `.module.css`
- `enhancedBlogRegistry.ts`
- React enhanced layout path

## Wiring

| Area | Change |
|------|--------|
| **Build** | `npm run build:static-blogs` generates HTML; chained into `build:blog` |
| **MD → HTML** | Docling slug skipped in `build-blog-html.js` |
| **Sitemap** | Canonical URL: `/blogs/monitor-docling-using-alertmend.html` |
| **Vercel** | 301 from `/blog/monitor-docling-using-alertmend` → static HTML |
| **React app** | Blog index cards link to static HTML; `/blog/...` redirects in dev |
| **Registry** | `src/utils/staticBlogRegistry.ts` for future static posts |

## URLs

- **Live post:** `/blogs/monitor-docling-using-alertmend.html`
- **Old React route:** redirects to the static page

## Regenerating after edits

Edit `scripts/build-static-blogs.mjs`, assets, or CSS, then:

```bash
npm run build:static-blogs
```

Or run a full `npm run build` before deploy (Vite copies `public/blogs/` and `public/assets/` into `dist/`).

Preview locally: `npm run dev` → open `/blogs/monitor-docling-using-alertmend.html`

---

**User**

my previous articles had .html in the end?

---

**Cursor**

Let me check how your existing blog URLs are structured versus the new Docling post.


Short answer: **some older posts have `.html`, but most recent ones do not**, and the Docling URL does not match the old naming pattern exactly.

## How your blog URLs work today

There are really **three** patterns in this repo:

### 1. Older posts (before ~Dec 18, 2025) — two URLs

| URL | Example |
|-----|---------|
| React route | `/blog/oomkilled-in-kubernetes` |
| Standalone HTML | `/blogs/OOMKilled-in-Kubernetes.html` |

So yes, many older articles **do** have a `.html` version, but under `/blogs/` with **Title-Case** filenames, not lowercase slugs.

Examples from `dist/blogs/`:
- `/blogs/OOMKilled-in-Kubernetes.html`
- `/blogs/Debugging-Kubernetes-Admission-Webhooks.html`
- `/blogs/Troubleshooting-Networking-Errors-in-Kubernetes.html`

### 2. Newer posts (after Dec 18, 2025) — one URL, no `.html`

| URL | Example |
|-----|---------|
| React only | `/blog/some-new-post-slug` |

The sitemap logic treats these as **new blogs**: `/blog/{slug}` only, no `/blogs/*.html` entry. That is **558 posts** in your current setup.

### 3. Docling post (what we just built) — new static pattern

| URL | Example |
|-----|---------|
| Static HTML | `/blogs/monitor-docling-using-alertmend.html` |

This is `.html` like the old standalone path, but:
- Uses **lowercase slug** (`monitor-docling-using-alertmend.html`)
- Old posts use **Title Case** (`Monitor-Docling-Using-Alertmend.html` would be the old style)
- It is **not** on `/blog/monitor-docling-using-alertmend` anymore (that redirects to the HTML file)

## So relative to your history

| Question | Answer |
|----------|--------|
| Did previous articles end in `.html`? | **Some did**, at `/blogs/Title-Case.html` |
| Did all of them? | **No** — newer ones are `/blog/slug` only |
| Is Docling matching the old pattern? | **Partly** — same `/blogs/` + `.html` idea, different filename style |

If you want Docling to match the **old SEO filenames** exactly, the URL would be more like:

`/blogs/Monitor-Docling-Using-Alertmend.html`

If you want it to match **newer posts**, it would be:

`/blog/monitor-docling-using-alertmend` (no `.html`)

Tell me which convention you prefer and we can align it.

---

**User**

lets do no .html
match SEO for "Newer posts (after Dec 18, 2025) — one URL, no .html"

---

**Cursor**

Switching the Docling post to `/blog/monitor-docling-using-alertmend` (no `.html`), served as static `index.html` like newer posts.


Done. The Docling post now follows the **newer post URL pattern** — no `.html`.

## URL

**Before:** `/blogs/monitor-docling-using-alertmend.html`  
**Now:** `/blog/monitor-docling-using-alertmend`

Same pattern as your other post-Dec-2025 articles.

## File layout

```
public/blog/monitor-docling-using-alertmend/index.html   ← static page
public/assets/monitor-docling-using-alertmend/           ← CSS, JS, images
```

Removed `public/blogs/monitor-docling-using-alertmend.html`.

## SEO

- Canonical: `https://www.alertmend.io/blog/monitor-docling-using-alertmend`
- Sitemap: single entry at `/blog/monitor-docling-using-alertmend` (no `/blogs/` duplicate)
- Vercel redirect to `.html` removed

## Dev preview

```bash
npm run dev
```

Open: `http://localhost:5173/blog/monitor-docling-using-alertmend`

Blog index cards still use a full page load for this post so you get the static HTML (not the React markdown stub).

---

**User**

its not working

---

**Cursor**

React Router is intercepting `/blog/monitor-docling-using-alertmend` instead of serving the static `index.html`. Investigating and fixing dev and production routing.


React Router is catching the URL before the static `index.html` can load, causing a redirect loop. Adding dev/preview middleware and Vercel rewrites so `/blog/{slug}` serves the static page.


The plugin works on a fresh dev server. Port 5173 was still running an old instance without the fix. Hardening the plugin and syncing slug config.


The problem was twofold:

1. **React was taking the route** — `/blog/monitor-docling-using-alertmend` hit `BlogPostDetailPage`, which showed “Loading post…” and tried to redirect to the same URL (infinite loop).
2. **Stale dev server on port 5173** — your screenshot shows `localhost:5173`, but the fix only applies after restarting dev. A fresh server on **5174** serves the static HTML correctly.

## Fixes applied

- **Vite dev/preview plugin** (`scripts/vite-static-blog-plugin.mjs`) — serves `public/blog/{slug}/index.html` at `/blog/{slug}` before React loads
- **Vercel rewrite** — `/blog/monitor-docling-using-alertmend` → `.../index.html` (URL stays clean, no `.html`)
- **Removed broken redirect** in `BlogPostDetailPage` that caused the loading loop

## What you need to do

**Restart the dev server** so it picks up the new Vite config:

```bash
# Stop the old server on 5173 (Ctrl+C in that terminal), then:
npm run dev
```

Then open:

`http://localhost:5173/blog/monitor-docling-using-alertmend`

You should see the full Docling static page (hero, sequence diagram, deployment modes), not the React loading spinner.

If it still fails, hard-refresh or try an incognito window to avoid a cached SPA shell.

---

**User**

<system_notification>
The following task has finished. If you were already aware, ignore this notification and do not restate prior responses.

<task>
kind: shell
status: error
task_id: 652912
title: Start dev server to test static blog routing
detail: exit_code=137
output_path: /Users/dinesh/.cursor/projects/Users-dinesh-work-AlertMend-io/terminals/652912.txt
</task>
</system_notification>
<user_query>Briefly inform the user about the task result and perform any follow-up actions (if needed). If there's no follow-ups needed, don't explicitly say that.</user_query>

---

**Cursor**

The dev server I started for testing was killed (exit 137), so it is not running anymore. That does not affect the fix itself.

**What was wrong:** `/blog/monitor-docling-using-alertmend` was handled by React (`BlogPostDetailPage`), which showed “Loading post…” and never served your static HTML.

**What we fixed:**
- Vite plugin serves `public/blog/monitor-docling-using-alertmend/index.html` at the clean URL in dev/preview
- Vercel rewrite does the same in production
- Removed the redirect loop in `BlogPostDetailPage`

**To verify locally**, restart dev and open the post:

```bash
npm run dev
```

Then visit: `http://localhost:5173/blog/monitor-docling-using-alertmend`

You should see the full static Docling page (hero, diagram, deployment modes), not the loading spinner.

---

**User**

:x: ERRORS (1):
   :x: monitor-docling-using-alertmend.md: Title too long (91 chars, max 60): “Docling Observability: Monitor docling-serve, Fix OOMKilled, Keep It Running | AlertMend AI”
:x: Validation FAILED. Please fix the errors above before committing.
Error: Command “npm run build” exited with 1

---

**Cursor**

Checking the blog frontmatter and validation rules to fix the title length.


The validator counts ` | AlertMend AI` toward the 60-char limit, so the frontmatter title must be ≤43 characters. Shortening it now.


Fixing validation: the frontmatter title is correct, but a stale `dist/blogs/Monitor-Docling-Using-Alertmend.html` is still being picked up. Updating validation to use static blog paths and removing stale artifacts.


Fixing double-error logic for static blogs when HTML is missing.


The build failure had two causes, and both are fixed.

**1. Title too long** — The frontmatter title was already shortened to `"Docling Observability: Monitor & Recover"` (55 chars with the ` | AlertMend AI` suffix).

**2. Stale HTML artifact** — Validation was still reading an old file at `dist/blogs/Monitor-Docling-Using-Alertmend.html` (91-char title) from before the static-blog migration. The new static page at `dist/blog/monitor-docling-using-alertmend/index.html` had the correct title, but the validator matched the stale file via fuzzy slug matching.

**Changes made:**

- **`scripts/validate-blogs.js`** — Static blog slugs are validated at `dist/blog/{slug}/index.html` instead of `dist/blogs/*.html`. H1 warnings are skipped for metadata-only markdown stubs.
- **`scripts/build-blog-html.js`** — On skip, removes any leftover `dist/blogs/*.html` for static slugs so old artifacts do not linger.

`npm run validate:blogs` now passes. The stale file was removed during `build:blog`. You can re-run `npm run build` when ready.

---

**User**

right now the space in the side is complete blank

can we add "Related content" section like we have on other blogs



---

**Cursor**

I'll find how other blog posts render the Related content sidebar and mirror that on the static Docling page.


Updating the static blog generator to add a two-column layout with a Related content sidebar, matching other blog posts.


Added a right sidebar to the Docling static blog, matching the layout on other blog posts.

**What changed:**

1. **Two-column layout** — Main content on the left (~66%), sidebar on the right (~33%) at `1024px+` wide screens. On smaller screens the sidebar is hidden (same as other posts).

2. **Sidebar sections:**
   - **Receive blog and product updates** — Email signup form wired to the same `api.alertmend.io/contact` endpoint as the React blog
   - **Related content** — 10 posts (3 from AIOps, 7 from other categories), pulled from `blogList.json`
   - **Explore AlertMend** — Links to key product pages

3. **Regenerated** — Run `npm run build:static-blogs` (or restart dev) to see it at `/blog/monitor-docling-using-alertmend`.

The sidebar is sticky as you scroll, so related links stay visible on desktop. Refresh the page if you already have it open.

