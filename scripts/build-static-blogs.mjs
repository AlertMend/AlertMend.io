/**
 * Builds self-contained static blog HTML pages from source templates + assets.
 * Output: public/blog/{slug}/index.html + public/assets/{slug}/
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { STATIC_BLOG_SLUGS } from './static-blog-slugs.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

for (const slug of STATIC_BLOG_SLUGS) {
  buildStaticBlog(slug)
}

function buildStaticBlog(slug) {
const assetsBase = `/assets/${slug}`
const canonical = `https://www.alertmend.io/blog/${slug}`

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

const title = meta.title || 'Docling Observability'
const excerpt = meta.excerpt || ''
const date = meta.date || '2026-06-06'
const category = meta.category || 'AIOps'
const author = meta.author || 'AlertMend Team'
const keywords = meta.keywords || 'Docling observability, AlertMend'

const signupUrl =
  'https://app.alertmend.io/signup?service=remediation&source=blog-docling&blog_slug=' + slug
const calendlyUrl =
  'https://calendly.com/hello-alertmend/30min?source=blog-post&blog_slug=' + slug

const SIGNAL_HIERARCHY = [
  ['Docling not ready to serve traffic', 'Alert the team', 'URL health check fails twice in a row → Slack incident.'],
  ['Pod killed from memory pressure', 'Alert and restart', 'Out-of-memory runbook restarts the service and posts what happened.'],
  ['Conversions getting slow', 'Warn first', 'Latency alert before a full outage.'],
  ['Still starting after a deploy', 'Wait', 'Deploy grace period so boot-up does not false-alarm.'],
  ['Background jobs piling up', 'Alert the team', 'Queue alert + worker restart when jobs stop finishing.'],
]

const ALERTMEND_FLOW = [
  ['Connect', 'Connect your cluster in AlertMend. Docling health and restart events show up without building a separate monitoring stack.'],
  ['Add a health check', 'Add a URL check for your Docling endpoint. AlertMend verifies the service is actually ready to parse documents, not just running.'],
  ['Alert your team', 'When something breaks, AlertMend opens a Slack incident with a plain-language summary and links to the details your on-call needs.'],
  ['Auto-recover', 'Turn on the out-of-memory runbook. AlertMend brings Docling back online automatically instead of waiting for someone to restart it manually.'],
]

const TOP_ISSUES = [
  ['Memory creep', 'Memory use climbs job after job until the service crashes mid-batch.', 'Memory alert + scheduled restart between large batches.'],
  ['Out of memory on big PDFs', 'Large documents exhaust available memory. The service restarts and in-flight work fails.', 'Slack alert + auto-restart runbook brings Docling back online.'],
  ['GPU runs out of memory', 'The API looks fine but the next OCR job fails.', 'Restart GPU workers between heavy batches.'],
  ['Looks healthy but is not ready', 'The process is running but not accepting work yet.', 'Check readiness, not just "is it up." Suppress alerts during deploys.'],
  ['Jobs stuck in the queue', 'The API responds but background work stops finishing.', 'Queue alert + restart stuck workers.'],
  ['Stuck on one file', 'One bad document blocks everything else.', 'Timeout alert + restart to clear the blockage.'],
]

const FAQ = [
  ['How do I monitor Docling in production?', 'Connect your cluster in AlertMend, add a health check on your Docling endpoint, and route alerts to Slack. AlertMend watches for crashes, failed jobs, and conversion errors depending on how you run Docling.'],
  ['How do I monitor docling-serve health checks?', 'In AlertMend, add a URL check on the ready endpoint (not just the basic health endpoint). That confirms Docling can actually parse documents. AlertMend notifies your team after repeated failures.'],
  ['Why does Docling keep running out of memory?', 'Large PDFs and long-running jobs can exhaust memory. AlertMend alerts your team when it happens and can restart the service automatically. If it keeps recurring, increase the memory allocated to Docling.'],
  ['What is the difference between docling-serve /health and /ready?', 'The health endpoint means the process is running. The ready endpoint means Docling is loaded and can accept work. AlertMend should check ready. During deploys, AlertMend can wait before alerting so boot-up does not cause false alarms.'],
  ['How do I fix a Docling memory leak?', 'Use AlertMend to alert when memory gets high and schedule restarts between large batches. That keeps the pipeline moving while you adjust sizing or split workloads.'],
  ['How do I monitor Docling background workers?', 'AlertMend can watch worker crashes and growing job backlogs even when the main API looks fine. Enable a restart runbook when jobs stop completing.'],
  ['How do I know if Docling is down?', 'AlertMend treats Docling as down when health checks fail, jobs error out, or the service crashes, not when a superficial "up" check passes but parsing still fails.'],
  ['Should I auto-restart Docling on every OOMKilled?', 'Yes. Enable AlertMend\'s out-of-memory runbook: your team gets a Slack alert with what happened, and Docling comes back online automatically. If it keeps happening, give Docling more memory.'],
]

const MODES = [
  ['library', 'Python library', 'Embedded in your app'],
  ['cli', 'CLI & batch jobs', 'Cron, Airflow, CI'],
  ['serve', 'Docling Serve', 'Docker or VM API'],
  ['kubernetes', 'Kubernetes', 'Docling Serve on K8s'],
  ['mcp', 'MCP server', 'Agent tool calls'],
]

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')

const faqLd = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map(([q, a]) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
})

const howToLd = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Connect Docling to AlertMend for production observability',
  description: excerpt,
  step: ALERTMEND_FLOW.map(([name, text], i) => ({
    '@type': 'HowToStep',
    position: i + 1,
    name,
    text,
  })),
})

const blogLd = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: title,
  description: excerpt,
  image: `https://www.alertmend.io${assetsBase}/docling-hero.svg`,
  datePublished: date,
  dateModified: date,
  author: { '@type': 'Person', name: author },
  publisher: {
    '@type': 'Organization',
    name: 'AlertMend AI',
    logo: { '@type': 'ImageObject', url: 'https://www.alertmend.io/logos/alertmend-logo.svg' },
  },
  mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
})

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)} | AlertMend AI</title>
  <meta name="description" content="${esc(excerpt)}">
  <meta name="keywords" content="${esc(keywords)}">
  <meta name="author" content="${esc(author)}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <link rel="canonical" href="${canonical}">
  <link rel="icon" type="image/svg+xml" href="/logos/alertmend-logo.svg">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${canonical}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(excerpt)}">
  <meta property="og:image" content="https://www.alertmend.io${assetsBase}/docling-hero.svg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(excerpt)}">
  <meta name="twitter:image" content="https://www.alertmend.io${assetsBase}/docling-hero.svg">
  <script type="application/ld+json">${blogLd}</script>
  <script type="application/ld+json">${faqLd}</script>
  <script type="application/ld+json">${howToLd}</script>
  <link rel="stylesheet" href="${assetsBase}/styles.css">
  <style>
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
    .page-wrap { max-width: 820px; margin: 0 auto; padding: 96px 24px 64px; }
    .article-header { margin-bottom: 2rem; }
    .article-header h1 { font-size: clamp(1.75rem, 4vw, 2.75rem); font-weight: 700; color: #09090b; line-height: 1.15; letter-spacing: -0.02em; margin-bottom: 1rem; }
    .author-info { display: flex; align-items: center; gap: 12px; margin-bottom: 0.75rem; }
    .author-avatar { width: 40px; height: 40px; border-radius: 50%; background: #09090b; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 600; }
    .author-name { font-weight: 600; color: #111827; }
    .author-meta { font-size: 0.875rem; color: #6b7280; }
    .category-tag { display: inline-block; padding: 4px 10px; background: #ede9fe; color: #5b21b6; border-radius: 6px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
    .promo { margin-top: 3rem; padding-top: 2rem; border-top: 1px solid #e5e7eb; font-size: 1.0625rem; color: #374151; }
    .promo a { color: #7c3aed; font-weight: 600; }
  </style>
</head>
<body>
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
          <a href="${calendlyUrl}" class="navbar-button navbar-button-primary" target="_blank" rel="noopener noreferrer">Book a Demo</a>
        </div>
      </div>
    </div>
  </nav>

  <div class="page-wrap">
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
    </header>

    <div class="dl-blog">
      <section class="heroBand">
        <div class="heroBrands">
          <a href="https://www.docling.ai/" target="_blank" rel="noopener noreferrer">
            <img src="${assetsBase}/docling-logo.png" alt="Docling" class="brandLogo" width="142" height="40">
          </a>
          <span class="heroBrandSep" aria-hidden="true">×</span>
          <a href="/" class="heroAmLink">
            <img src="/logos/alertmend-logo.svg" alt="AlertMend" class="heroAmLogo" width="128" height="28">
          </a>
        </div>
        <p class="heroGuideLabel">Runbook · Docling observability in production</p>
        <div class="heroAudience">
          <h2 class="heroAudienceTitle">You're in the right place if…</h2>
          <ul class="heroAudienceList">
            <li>You already run Docling in production (API, Kubernetes, Python library, or batch jobs)</li>
            <li>Your RAG, ingestion, or agent pipeline stops when Docling goes offline</li>
            <li>You want next-generation AI observability out of the box, not another DIY monitoring stack</li>
          </ul>
          <p class="heroAudienceNote">This is not a Docling tutorial. It assumes Docling is already in your stack and shows how to connect it to <a href="/">AlertMend</a>, a state-of-the-art AI observability platform with monitoring, AI-powered incident analysis, and auto-recovery built in.</p>
        </div>
        <p class="seoTldr"><strong>TL;DR:</strong> Plug Docling into AlertMend and get health checks, Slack alerts, and auto-restart out of the box.</p>
        <div class="heroContext">
          <div class="heroContextBlock">
            <h2 class="heroContextTitle">When Docling stops working</h2>
            <p class="heroContextBody">Large PDFs can exhaust memory. Deploys can leave Docling starting up while your pipeline already sends traffic. Background jobs can pile up while the API still looks fine.</p>
            <p class="heroContextBody">These are common in production. The gap is usually not Docling itself. It is catching the failure early and recovering without a manual restart.</p>
          </div>
          <div class="heroContextBlock">
            <h2 class="heroContextTitle">Why AlertMend</h2>
            <p class="heroContextBody">AlertMend is a next-generation AI observability platform built for production AI workloads. Teams use it to monitor Kubernetes and document pipelines without wiring Prometheus, Grafana, and PagerDuty themselves.</p>
            <p class="heroContextBody">For Docling: connect your cluster, add a health check, and AlertMend delivers Slack alerts with AI-powered root-cause analysis and auto-recovery runbooks, out of the box, in a few clicks.</p>
          </div>
        </div>
        <p class="pipelineCaption">What AlertMend watches</p>
        <div class="pipeline">
          <div class="pipelineNode pipelineNodeFocus"><div class="pipelineLabel">Ready check</div><div class="pipelineSub">Can it parse?</div></div>
          <div class="pipelineNode"><div class="pipelineLabel">Memory</div><div class="pipelineSub">Out-of-memory kills</div></div>
          <div class="pipelineNode"><div class="pipelineLabel">Speed</div><div class="pipelineSub">Slow or stuck jobs</div></div>
          <div class="pipelineNode"><div class="pipelineLabel">Queue</div><div class="pipelineSub">Backlog growing</div></div>
          <div class="pipelineNode"><div class="pipelineLabel">Alert + fix</div><div class="pipelineSub">Slack + auto-recover</div></div>
        </div>
      </section>

      <h2 class="sectionHead">How auto-recovery works</h2>
      <p class="sectionSub">A simple sequence view: Docling fails, AlertMend detects and alerts Slack, runs the restart runbook, and your pipeline is back online.</p>
      <figure class="flowDiagram">
        <img src="${assetsBase}/docling-alertmend-recovery-flow.svg" alt="Sequence diagram: Docling out of memory, AlertMend detects the failure, alerts Slack, runs auto-recovery runbook, and Docling returns online" width="960" height="720" loading="lazy">
        <figcaption class="flowDiagramCaption">Normal operation, failure, Slack alert with AI summary, runbook restart, pipeline restored.</figcaption>
      </figure>

      <p class="bodyText">Pick how you run Docling below. Each section shows what to set up in AlertMend.</p>

      <h2 class="sectionHead">When to alert your team</h2>
      <div class="diyWrap">
        <table class="compareTable">
          <thead><tr><th>Signal</th><th>Action</th><th>In AlertMend</th></tr></thead>
          <tbody>
            ${SIGNAL_HIERARCHY.map(([s, a, m]) => `<tr><td>${esc(s)}</td><td class="diyHighlight">${esc(a)}</td><td>${esc(m)}</td></tr>`).join('\n            ')}
          </tbody>
        </table>
      </div>

      <h2 class="sectionHead">Set up in four steps</h2>
      <div class="amFlow">
        ${ALERTMEND_FLOW.map(([t, b], i) => `<div class="amStep"><div class="amStepHead"><span class="amStepNum">${i + 1}</span></div><h3 class="amStepTitle">${esc(t)}</h3><p class="amStepBody">${esc(b)}</p></div>`).join('\n        ')}
      </div>

      <h2 class="sectionHead">Runbook by deployment mode</h2>
      <div class="modeGrid" role="tablist" aria-label="Docling deployment modes">
        ${MODES.map(([id, t, sub], i) => `<button type="button" role="tab" data-mode-id="${id}" class="modeCard${i === 3 ? ' modeCardActive' : ''}" aria-selected="${i === 3 ? 'true' : 'false'}"><span class="modeCardTitle">${esc(t)}</span><span class="modeCardSub">${esc(sub)}</span></button>`).join('\n        ')}
      </div>
      <div class="modePlaybook" role="tabpanel">
        <div class="modePlaybookHead">
          <h3 class="modePlaybookTitle" id="mode-playbook-title">Runbook: Kubernetes</h3>
          <span class="modePlaybookBadge">Production</span>
        </div>
        <p class="modePlaybookSummary" id="mode-playbook-summary"></p>
        <p class="stepPanelBody"><strong>Set up in AlertMend</strong></p>
        <ul class="checkList" id="mode-playbook-steps"></ul>
        <div class="stepTip"><span id="mode-playbook-tip"></span></div>
      </div>

      <div class="dashboardWrap">
        <div class="dashboard" role="img" aria-label="AlertMend uptime dashboard">
          <div class="dashboardChrome">
            <div class="chromeDots"><span class="chromeDot"></span><span class="chromeDot"></span><span class="chromeDot"></span></div>
            <span class="dashboardTitle" id="dash-title">AlertMend · docling-prod</span>
            <span class="liveBadge"><span class="liveDot"></span> Live</span>
          </div>
          <div class="dashboardBody">
            <div class="metricCard">
              <div class="metricLabel" id="metric-primary-label">Health check</div>
              <div class="metricValue metricValueOk" id="metric-primary">200 OK</div>
            </div>
            <div class="metricCard">
              <div class="metricLabel">p95 latency</div>
              <div class="metricValue metricValueWarn">4.2s</div>
              <div class="metricBar"><div class="metricBarFill"></div></div>
            </div>
            <div class="metricCard">
              <div class="metricLabel" id="metric-secondary-label">Pod restarts (1h)</div>
              <div class="metricValue" id="metric-secondary">2</div>
            </div>
          </div>
          <div class="alertToast">
            <div class="alertText">
              <div class="alertTitle" id="dash-alert">Docling pod OOMKilled: auto-remediation triggered</div>
              <div class="alertMeta" id="dash-alert-meta">docling-prod · Slack #incidents · 12s ago</div>
            </div>
          </div>
        </div>
      </div>

      <h2 class="sectionHead">Common problems</h2>
      <div class="searchIssueGrid">
        ${TOP_ISSUES.map(([term, desc, am]) => `<div class="searchIssueCard"><h3 class="searchIssueTerm">${esc(term)}</h3><p class="searchIssueDesc">${esc(desc)}</p><p class="searchIssueAlert"><strong>In AlertMend:</strong> ${esc(am)}</p></div>`).join('\n        ')}
      </div>

      <h2 class="sectionHead">FAQ</h2>
      <div class="faqList">
        ${FAQ.map(([q, a], i) => `<div class="faqItem"><button type="button" class="faqQuestion" data-faq-toggle aria-expanded="${i === 0 ? 'true' : 'false'}">${esc(q)}<svg class="faqChevron${i === 0 ? ' faqChevronOpen' : ''}" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 9l6 6 6-6"/></svg></button><div class="faqAnswer${i === 0 ? '' : ' hidden'}">${esc(a)}</div></div>`).join('\n        ')}
      </div>

      <div class="ctaBand">
        <div class="ctaBandTitle">Next-generation AI observability for Docling</div>
        <p class="ctaBandSub">AlertMend gives you monitoring, AI-powered incident analysis, and auto-recovery out of the box. Connect Docling in a few clicks.</p>
        <div class="ctaBtnRow">
          <a href="${signupUrl}" class="ctaBtn">Start with auto-remediation →</a>
          <a href="${calendlyUrl}" class="ctaBtnSecondary" target="_blank" rel="noopener noreferrer">Book a demo</a>
        </div>
      </div>
    </div>

    <div class="promo">
      <p>Ready to eliminate manual firefighting? <a href="${calendlyUrl}" target="_blank" rel="noopener noreferrer">Book a demo</a> to see AlertMend on your Docling stack.</p>
    </div>
  </div>

  <script src="${assetsBase}/script.js" defer></script>
</body>
</html>`

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
