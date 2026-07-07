/**
 * One-off generator: upgrades 4 legacy Elasticsearch posts to rich, source-checked,
 * animated troubleshooting guides. Reuses make-error-127 rich CSS classes.
 * AlertMend = infrastructure reliability for Elasticsearch on Kubernetes:
 * detect -> correlate -> AI root cause -> run an approved recovery. No magic claims.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { SITE_URL, esc, CHROME_INLINE_CSS, AUTHOR_CRED_CSS, buildNavHtml, buildSidebarHtml, buildCredArticleHeader, calendlyUrl } from './static-blog-shared.mjs'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const ALERTMEND_LOGO_DATA_URI = `data:image/svg+xml;base64,${fs.readFileSync(path.join(root, 'public/alertmend-logo.svg')).toString('base64')}`
const DATE = '2026-07-04', MODIFIED = '2026-07-04', CAT = 'Elasticsearch'

const SCRIPT_JS = `(function () {
  document.querySelectorAll('[data-faq-toggle]').forEach((b) => {
    b.addEventListener('click', () => {
      const item = b.closest('.faqItem');
      const answer = item && item.querySelector('.faqAnswer');
      const chev = b.querySelector('.faqChevron');
      const open = b.getAttribute('aria-expanded') === 'true';
      b.setAttribute('aria-expanded', open ? 'false' : 'true');
      if (answer) answer.classList.toggle('hidden', open);
      if (chev) chev.classList.toggle('faqChevronOpen', !open);
    });
  });
  document.querySelectorAll('.copyableCode').forEach((block) => {
    const code = block.querySelector('code'); if (!code) return;
    const btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'codeCopyButton'; btn.textContent = 'Copy';
    btn.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(code.textContent || ''); btn.textContent = 'Copied'; setTimeout(() => { btn.textContent = 'Copy'; }, 1600); }
      catch { btn.textContent = 'Select text'; }
    });
    block.appendChild(btn);
  });
})();
`

const ES_POST_CSS = `${AUTHOR_CRED_CSS}
.copyableCode { position: relative; padding-top: 3.25rem; }
.codeCopyButton {
  position: absolute; top: .75rem; right: .75rem; z-index: 2;
  border: 1px solid #3f3f46; border-radius: 6px; padding: .35rem .65rem;
  background: #27272a; color: #f4f4f5; font: 700 .72rem/1.2 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  cursor: pointer;
}
.codeCopyButton:hover { background: #3f3f46; }
.instantFixCommands code, .diagnosisSteps p, .amStepBody { overflow-wrap: anywhere; }
.flowDiagram svg { overflow: visible; }
.flowDiagramCaption { max-width: 68ch; }
.credibilityRow { display:flex; flex-wrap:wrap; gap:8px 16px; align-items:center; margin:-.75rem 0 1.75rem; font-size:.85rem; color:#52525b; }
.credibilityVerified { display:inline-flex; align-items:center; gap:6px; font-weight:700; color:#047857; }
.credibilityDot { color:#d4d4d8; }
.incidentTrace {
  position: relative; overflow: hidden; margin: 1rem 0 1.5rem; padding: 1.1rem;
  border: 1px solid #ddd6fe; border-radius: 10px;
  background: radial-gradient(circle at 8% 0%, rgba(124,58,237,.1), transparent 34%), #faf9ff;
}
.incidentTrace::after {
  content:""; position:absolute; inset:0 auto 0 -42%; width:36%;
  background:linear-gradient(90deg,transparent,rgba(124,58,237,.07),transparent);
  transform:skewX(-12deg); pointer-events:none;
}
.incidentTraceHead { display:flex; justify-content:space-between; gap:1rem; align-items:flex-start; margin-bottom:.8rem; }
.incidentTraceEyebrow { display:block; color:#6d28d9; font-size:.66rem; font-weight:850; letter-spacing:.1em; }
.incidentTraceHead strong { display:block; margin-top:.18rem; color:#18181b; font-size:1rem; }
.incidentTraceHead small { max-width:24rem; color:#71717a; font-size:.72rem; line-height:1.45; text-align:right; }
.incidentTraceRows { display:grid; gap:.5rem; }
.incidentTraceRow {
  display:grid; grid-template-columns:6.2rem minmax(0,1fr); gap:.8rem; align-items:start;
  padding:.72rem .8rem; border:1px solid #e4e4e7; border-radius:8px; background:rgba(255,255,255,.92);
}
.incidentTraceRow span { color:#6d28d9; font-size:.7rem; font-weight:800; letter-spacing:.06em; text-transform:uppercase; }
.incidentTraceRow p { margin:0; color:#3f3f46; font-size:.84rem; line-height:1.55; }
.incidentTraceGuardrail { margin:.75rem 0 0; color:#52525b; font-size:.76rem; }
.incidentTraceGuardrail strong { color:#18181b; }
@media (prefers-reduced-motion:no-preference) {
  .incidentTrace::after { animation: incident-scan 7s ease-in-out infinite; }
  .incidentTraceRow { animation: incident-row 7s ease-in-out infinite; }
  .incidentTraceRow:nth-child(2) { animation-delay:.55s; }
  .incidentTraceRow:nth-child(3) { animation-delay:1.1s; }
  .incidentTraceRow:nth-child(4) { animation-delay:1.65s; }
  @keyframes incident-scan { 0%,18%{left:-42%} 70%,100%{left:118%} }
  @keyframes incident-row { 0%,15%,100%{border-color:#e4e4e7;box-shadow:none} 24%,38%{border-color:#a78bfa;box-shadow:0 0 0 3px rgba(124,58,237,.08)} 52%{border-color:#bbf7d0} }
}
@media (max-width:760px) {
  .incidentTraceHead { flex-direction:column; }
  .incidentTraceHead small { text-align:left; }
  .incidentTraceRow { grid-template-columns:1fr; gap:.15rem; }
  .credibilityRow { flex-direction:column; align-items:flex-start; gap:.35rem; }
  .credibilityDot { display:none; }
}
@media (max-width:1100px) {
  .immediateDiagnosis .diagnosisSteps { grid-template-columns:1fr; }
  .immediateDiagnosis .diagnosisSteps li { padding:.875rem 0; }
  .immediateDiagnosis .diagnosisSteps li + li { padding-left:0; border-left:0; border-top:1px solid #e4e4e7; }
}
@media (max-width:520px) {
  .flowDiagram {
    overflow-x:auto; max-width:100%; padding:.55rem 0 .25rem;
    -webkit-overflow-scrolling:touch; scrollbar-width:thin;
  }
  .flowDiagram::before {
    content:"Swipe to explore →"; position:sticky; left:0; z-index:2; display:block;
    width:max-content; margin:0 0 .45rem; padding:.22rem .48rem; border-radius:999px;
    background:#ede9fe; color:#5b21b6; font-size:.65rem; font-weight:800; letter-spacing:.03em;
  }
  .flowDiagram svg { width:680px !important; min-width:680px; max-width:none; }
  .flowDiagramCaption { position:sticky; left:0; width:calc(100vw - 48px); padding-right:.5rem; }
}
`

// ---------- topical animated SVGs ----------
const gaugeSvg = (id, opts) => {
  // horizontal gauge that fills past a danger mark then recovers, looping
  const { label, marks, fillFrom, fillPeak, fillRecover, peakColor, badge } = opts
  const X = 60, W = 840, Y = 96, H = 46
  const px = (pct) => X + (pct / 100) * W
  return `<figure class="flowDiagram">
      <svg class="${id}" viewBox="0 0 960 270" width="960" height="270" role="img" aria-label="${esc(label)}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" style="display:block;width:100%;height:auto;border-radius:12px;border:1px solid #e4e4e7;background:linear-gradient(180deg,#faf9ff,#f3f1fb);">
        <defs><style>
          @media (prefers-reduced-motion: no-preference) {
            .${id} .g-fill { animation: ${id}-fill 7s ease-in-out infinite; }
            @keyframes ${id}-fill { 0%,100% { width:${(fillFrom / 100) * W}px; fill:#f59e0b } 34% { width:${(fillPeak / 100) * W}px; fill:${peakColor} } 52% { width:${(fillPeak / 100) * W}px; fill:${peakColor} } 78% { width:${(fillRecover / 100) * W}px; fill:#16a34a } }
            .${id} .g-badge { animation: ${id}-badge 7s ease-in-out infinite; }
            @keyframes ${id}-badge { 0%,24% { opacity:0 } 38%,52% { opacity:1 } 66%,100% { opacity:0 } }
          }
        </style></defs>
        <text x="${X}" y="72" font-size="15" font-weight="700" fill="#09090b">${esc(label)}</text>
        <rect x="${X}" y="${Y}" width="${W}" height="${H}" rx="10" fill="#eef0f4" stroke="#e4e4e7"/>
        <rect class="g-fill" x="${X}" y="${Y}" width="${(fillFrom / 100) * W}" height="${H}" rx="10" fill="#f59e0b"/>
        ${marks.map((m) => `<line x1="${px(m.at)}" y1="${Y - 8}" x2="${px(m.at)}" y2="${Y + H + 8}" stroke="${m.color}" stroke-width="2" stroke-dasharray="3 3"/>`).join('')}
        <g class="g-badge"><rect x="${X + W - 168}" y="${Y - 40}" width="168" height="30" rx="15" fill="#7f1d1d"/><text x="${X + W - 84}" y="${Y - 20}" font-size="13" font-weight="700" fill="#fff" text-anchor="middle">${esc(badge)}</text></g>
        <g>${marks.map((m, i) => {
          const lx = 82 + i * 280
          return `<circle cx="${lx}" cy="195" r="5" fill="${m.color}"/><text x="${lx + 12}" y="200" font-size="13" font-weight="700" fill="#3f3f46">${esc(m.label)}</text>`
        }).join('')}</g>
      </svg>
      <figcaption class="flowDiagramCaption">${esc(opts.caption)}</figcaption>
    </figure>`
}

const shardFlowSvg = () => `<figure class="flowDiagram">
      <svg class="es-shard" viewBox="0 0 960 240" width="960" height="240" role="img" aria-label="A Kubernetes node leaves the Elasticsearch cluster; its shards become unassigned, then relocate to the surviving nodes until the cluster is green again." font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" style="display:block;width:100%;height:auto;border-radius:12px;border:1px solid #e4e4e7;background:linear-gradient(180deg,#faf9ff,#f3f1fb);">
        <defs>
          <marker id="es-ar" markerWidth="9" markerHeight="9" refX="6.5" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L7,3 L0,6 Z" fill="#7c3aed"/></marker>
          <style>@media (prefers-reduced-motion: no-preference){ .es-shard .s-arrow{ stroke-dasharray:8 6; animation: es-flow .8s linear infinite } @keyframes es-flow{ to{ stroke-dashoffset:-14 } } .es-shard .s-status{ animation: es-status 6s ease-in-out infinite } @keyframes es-status{ 0%,20%{fill:#16a34a} 34%,68%{fill:#d97706} 82%,100%{fill:#16a34a} } .es-shard .s-gone{ animation: es-gone 6s ease-in-out infinite } @keyframes es-gone{ 0%,20%{opacity:1} 32%,100%{opacity:.25} } }</style>
        </defs>
        <g font-size="13" font-weight="700" fill="#09090b" text-anchor="middle">
          <rect x="60" y="40" width="180" height="70" rx="12" fill="#fff" stroke="#e4e4e7"/><text x="150" y="72">Node A</text><g fill="#7c3aed"><rect x="92" y="82" width="16" height="16" rx="3"/><rect x="116" y="82" width="16" height="16" rx="3"/><rect x="140" y="82" width="16" height="16" rx="3"/></g>
          <rect x="390" y="40" width="180" height="70" rx="12" fill="#fff" stroke="#e4e4e7"/><text x="480" y="72">Node B</text><g fill="#7c3aed"><rect x="422" y="82" width="16" height="16" rx="3"/><rect x="446" y="82" width="16" height="16" rx="3"/></g>
          <g class="s-gone"><rect x="720" y="40" width="180" height="70" rx="12" fill="#fff" stroke="#fecaca"/><text x="810" y="72" fill="#b91c1c">Node C left</text><rect x="770" y="82" width="16" height="16" rx="3" fill="#cbd5e1"/><rect x="794" y="82" width="16" height="16" rx="3" fill="#cbd5e1"/></g>
        </g>
        <line class="s-arrow" x1="716" y1="150" x2="246" y2="150" stroke="#7c3aed" stroke-width="2.5" marker-end="url(#es-ar)"/>
        <rect x="360" y="136" width="256" height="26" rx="13" fill="#fff" stroke="#e4e4e7"/><text x="488" y="153" font-size="12.5" font-weight="600" fill="#3f3f46" text-anchor="middle">shards relocate to A and B</text>
        <g text-anchor="middle"><rect class="s-status" x="360" y="188" width="240" height="30" rx="15" fill="#16a34a"/><text x="480" y="208" font-size="13" font-weight="700" fill="#fff">cluster: green → yellow → green</text></g>
      </svg>
      <figcaption class="flowDiagramCaption">A node leaves, replica copies are temporarily unassigned (yellow), Elasticsearch rebuilds them on surviving nodes, and the cluster returns to green. The cluster turns red only when a primary has no available copy.</figcaption>
    </figure>`

const cacheFlowSvg = () => `<figure class="flowDiagram">
      <svg class="es-cache" viewBox="0 0 960 240" width="960" height="240" role="img" aria-label="Queries hit the Elasticsearch caches; cacheable queries return a fast hit, non-cacheable or evicted queries miss and read from the shard." font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" style="display:block;width:100%;height:auto;border-radius:12px;border:1px solid #e4e4e7;background:linear-gradient(180deg,#faf9ff,#f3f1fb);">
        <defs>
          <marker id="ec-ar" markerWidth="9" markerHeight="9" refX="6.5" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L7,3 L0,6 Z" fill="#7c3aed"/></marker>
          <style>@media (prefers-reduced-motion: no-preference){ .es-cache .c-arrow{ stroke-dasharray:8 6; animation: ec-flow .8s linear infinite } @keyframes ec-flow{ to{ stroke-dashoffset:-14 } } .es-cache .c-hit{ animation: ec-hit 3s ease-in-out infinite } @keyframes ec-hit{ 0%,100%{opacity:.35} 50%{opacity:1} } .es-cache .c-miss{ animation: ec-hit 3s ease-in-out infinite .8s } }</style>
        </defs>
        <g font-size="13" font-weight="700" text-anchor="middle">
          <rect x="40" y="86" width="150" height="66" rx="12" fill="#fff" stroke="#e4e4e7"/><text x="115" y="118" fill="#09090b">Query</text><text x="115" y="138" font-size="11.5" font-weight="400" fill="#52525b">aggregation / filter</text>
          <line class="c-arrow" x1="192" y1="119" x2="356" y2="119" stroke="#7c3aed" stroke-width="2.5" marker-end="url(#ec-ar)"/>
          <rect x="360" y="70" width="220" height="98" rx="14" fill="#faf5ff" stroke="#ddd6fe"/><text x="470" y="104" fill="#5b21b6">Result caches</text><text x="470" y="126" font-size="11.5" font-weight="400" fill="#6d28d9">node query · shard request</text><text x="470" y="146" font-size="11.5" font-weight="400" fill="#6d28d9">eligibility + LRU eviction</text>
          <line class="c-arrow" x1="582" y1="100" x2="742" y2="100" stroke="#16a34a" stroke-width="2.5" marker-end="url(#ec-ar)"/>
          <g class="c-hit"><rect x="748" y="84" width="170" height="34" rx="10" fill="#ecfdf5" stroke="#a7f3d0"/><text x="833" y="106" fill="#047857">HIT · fast</text></g>
          <line class="c-arrow" x1="582" y1="150" x2="742" y2="150" stroke="#dc2626" stroke-width="2.5" marker-end="url(#ec-ar)"/>
          <g class="c-miss"><rect x="748" y="134" width="170" height="34" rx="10" fill="#fef2f2" stroke="#fecaca"/><text x="833" y="156" fill="#b91c1c">MISS · read shard</text></g>
        </g>
      </svg>
      <figcaption class="flowDiagramCaption">Query and request caches can return a fast hit; ineligible or evicted entries read the shard again. Fielddata is different: it supports text sorting and aggregations on heap and can create memory pressure.</figcaption>
    </figure>`

// ---------- shared render ----------
function codeBlock(code) { return `<pre class="codeBlock copyableCode"><code>${esc(code)}</code></pre>` }

function incidentTrace(cfg) {
  return `<div class="incidentTrace" aria-label="Illustrative AlertMend incident workflow">
        <div class="incidentTraceHead">
          <div><span class="incidentTraceEyebrow">ILLUSTRATIVE INCIDENT TRACE</span><strong>${esc(cfg.proof.title)}</strong></div>
          <small>Example workflow using telemetry from your connected Elasticsearch and Kubernetes environment, not a customer result.</small>
        </div>
        <div class="incidentTraceRows">${cfg.proof.rows.map(([label, text]) => `<div class="incidentTraceRow"><span>${esc(label)}</span><p>${text}</p></div>`).join('')}</div>
        <p class="incidentTraceGuardrail"><strong>Enterprise guardrail:</strong> ${cfg.proof.guardrail}</p>
      </div>`
}

function jsonLd(cfg) {
  const canonical = `${SITE_URL}/blog/${cfg.slug}`
  const img = `${SITE_URL}/assets/${cfg.slug}/hero.svg`
  const blog = { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: cfg.title, description: cfg.excerpt, image: img, datePublished: DATE, dateModified: MODIFIED, author: { '@type': 'Person', name: cfg.author }, reviewedBy: { '@type': 'Organization', name: 'AlertMend Engineering' }, publisher: { '@type': 'Organization', name: 'AlertMend AI', logo: { '@type': 'ImageObject', url: `${SITE_URL}/logos/alertmend-logo.svg` } }, mainEntityOfPage: { '@type': 'WebPage', '@id': canonical } }
  const faq = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: cfg.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) }
  const howto = { '@context': 'https://schema.org', '@type': 'HowTo', name: cfg.howtoName, description: cfg.excerpt, step: cfg.diagnose.map(([name, text], i) => ({ '@type': 'HowToStep', position: i + 1, name, text })) }
  return [blog, faq, howto].map((o) => `  <script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n')
}

function renderPost(cfg) {
  const canonical = `${SITE_URL}/blog/${cfg.slug}`
  const cal = calendlyUrl(cfg.slug)
  const img = `${SITE_URL}/assets/${cfg.slug}/hero.svg`
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(cfg.title)} | AlertMend AI</title>
  <meta name="description" content="${esc(cfg.excerpt)}">
  <meta name="keywords" content="${esc(cfg.keywords)}">
  <meta name="author" content="${esc(cfg.author)}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <link rel="canonical" href="${canonical}">
  <link rel="icon" type="image/svg+xml" href="/logos/alertmend-logo.svg">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${canonical}">
  <meta property="og:title" content="${esc(cfg.title)}">
  <meta property="og:description" content="${esc(cfg.excerpt)}">
  <meta property="og:image" content="${img}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(cfg.title)}">
  <meta name="twitter:description" content="${esc(cfg.excerpt)}">
  <meta name="twitter:image" content="${img}">
${jsonLd(cfg)}
  <link rel="stylesheet" href="/assets/make-error-127/styles.css">
  <link rel="stylesheet" href="/assets/${cfg.slug}/styles.css">
  <style>${CHROME_INLINE_CSS}</style>
</head>
<body>
${buildNavHtml(cfg.slug, cal)}
  <div class="main-container">
    <div class="content-wrapper">
      <div class="main-col">
${buildCredArticleHeader(cfg.h1, DATE, CAT, cfg.author)}
      <div class="credibilityRow">
        <span class="credibilityVerified"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>Verified against official Elasticsearch documentation</span>
        <span class="credibilityDot">•</span><span>Technical review: AlertMend Engineering</span>
        <span class="credibilityDot">•</span><span>Last reviewed ${MODIFIED}</span>
        <span class="credibilityDot">•</span><span>${cfg.sources.length} primary sources cited</span>
      </div>
    <div class="dl-blog">
      <section class="heroBand heroBandCompact">
        <p class="heroGuideLabel">Elasticsearch on Kubernetes · primary sources checked ${MODIFIED}</p>
        <div class="instantFix">
          <div class="instantFixTop"><span>THE 10-SECOND ANSWER</span><strong>${esc(cfg.instant.headline)}</strong></div>
          <p>${cfg.instant.para}</p>
          <div class="instantFixCommands">
            ${cfg.instant.cmds.map(([c, l]) => `<code>${esc(c)}</code><span>${esc(l)}</span>`).join('\n            ')}
          </div>
          <div class="manualProof">
            ${cfg.instant.sources.map(([u, l]) => `<a href="${u}" target="_blank" rel="noopener noreferrer">${esc(l)} ↗</a>`).join('\n            ')}
          </div>
        </div>
        <aside class="immediateDiagnosis">
          <div class="diagnosisHeading"><span class="diagnosisEyebrow">Immediate diagnosis</span><strong>${esc(cfg.immediate.title)}</strong></div>
          <ol class="diagnosisSteps">${cfg.immediate.steps.map((s, i) => `<li><span>${i + 1}</span><p>${s}</p></li>`).join('')}</ol>
          <p class="diagnosisCaution"><strong>Avoid the false fix:</strong> ${cfg.immediate.caution}</p>
        </aside>
      </section>

      <nav class="articleToc" aria-label="On this page"><strong>On this page</strong>${cfg.toc.map(([a, l]) => `<a href="#${a}">${esc(l)}</a>`).join('')}</nav>

      <h2 class="sectionHead" id="meaning">${esc(cfg.meaningTitle)}</h2>
      ${cfg.meaning.map((p) => `<p class="bodyText">${p}</p>`).join('\n      ')}
      ${cfg.symptomCode ? codeBlock(cfg.symptomCode) : ''}

      ${cfg.animation}

      <h2 class="sectionHead" id="diagnose">How to diagnose it</h2>
      <div class="amFlow">${cfg.diagnose.map(([t, b], i) => `<div class="amStep"><div class="amStepHead"><span class="amStepNum">${i + 1}</span></div><h3 class="amStepTitle">${esc(t)}</h3><p class="amStepBody">${b}</p></div>`).join('')}</div>

      <h2 class="sectionHead" id="causes">Common causes and fixes</h2>
      <div class="searchIssueGrid">${cfg.causes.map(([term, desc, fix]) => `<div class="searchIssueCard"><h3 class="searchIssueTerm">${esc(term)}</h3><p class="searchIssueDesc">${desc}</p><p class="searchIssueAlert"><strong>Fix:</strong> ${fix}</p></div>`).join('')}</div>

      <h2 class="sectionHead" id="fix">${esc(cfg.fixTitle)}</h2>
      <p class="bodyText">${cfg.fixIntro}</p>
      ${codeBlock(cfg.fixCode)}
      <p class="bodyText">${cfg.fixNote}</p>

      <h2 class="sectionHead" id="prevent">${esc(cfg.preventTitle)}</h2>
      ${cfg.prevent.map((p) => (p.startsWith('CODE:') ? codeBlock(p.slice(5)) : `<p class="bodyText">${p}</p>`)).join('\n      ')}

      <h2 class="sectionHead" id="automate">Detect and recover automatically with AlertMend</h2>
      <p class="bodyText">${cfg.amIntro}</p>
      ${incidentTrace(cfg)}
      <div class="alertmendMethod">${cfg.amSteps.map(([t, b], i) => `<div><span>${i + 1}</span><strong>${esc(t)}</strong><p>${b}</p></div>`).join('')}</div>
      <p class="bodyText productDisclosure"><strong>Deployment control:</strong> AlertMend runs as a managed service or self-hosted, so cluster telemetry and remediation stay inside your environment. Every command in this guide works without AlertMend.</p>

      <h2 class="sectionHead" id="sources">Primary sources and scope</h2>
      <ul class="sourceList">${cfg.sources.map(([u, l, n]) => `<li><a href="${u}" target="_blank" rel="noopener noreferrer">${esc(l)}</a>${n}</li>`).join('')}</ul>
      <div class="reviewPolicy"><strong>Method and disclosure:</strong> Every setting and threshold above is tied to the official Elasticsearch documentation and linked in Primary sources. Defaults and APIs change between versions, so confirm against the version you run. AlertMend publishes this guide and may benefit if readers evaluate its product.</div>

      <h2 class="sectionHead" id="faq">FAQ</h2>
      <div class="faqList">${cfg.faq.map(([q, a], i) => `<div class="faqItem"><button type="button" class="faqQuestion" data-faq-toggle aria-expanded="${i === 0 ? 'true' : 'false'}">${esc(q)}<svg class="faqChevron${i === 0 ? ' faqChevronOpen' : ''}" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 9l6 6 6-6"/></svg></button><div class="faqAnswer${i === 0 ? '' : ' hidden'}">${esc(a)}</div></div>`).join('')}</div>

      <div class="ctaBand">
        <div class="ctaBandTitle">${esc(cfg.ctaTitle)}</div>
        <p class="ctaBandSub">${esc(cfg.ctaSub)}</p>
        <div class="ctaBtnRow"><a href="${cal}" class="ctaBtn" target="_blank" rel="noopener noreferrer">${esc(cfg.ctaLabel)} →</a></div>
      </div>
    </div>
    <div class="promo"><p><strong>Related:</strong> ${cfg.related.map(([s, l]) => `<a href="/blog/${s}">${esc(l)}</a>`).join(' · ')}</p></div>
      </div>
${buildSidebarHtml(cfg.relatedSidebar)}
    </div>
  </div>
  <script src="/assets/${cfg.slug}/script.js" defer></script>
</body>
</html>
`
}

function heroSvg(line1, line2, sub, chips) {
  const c = chips.map((t, i) => { const x = 80 + i * 300, w = t.length * 11 + 36; return `<rect x="${x}" y="470" width="${w}" height="48" rx="24" fill="#12111f" stroke="#312b57"/><text x="${x + w / 2}" y="500" fill="#e9e3ff" text-anchor="middle" font-size="20" font-weight="600">${t}</text>` }).join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"><defs><linearGradient id="hg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0b0b14"/><stop offset="1" stop-color="#241b4d"/></linearGradient></defs><rect width="1200" height="630" fill="url(#hg)"/><g transform="translate(80,76)"><circle cx="25" cy="25" r="25" fill="#fff"/><image href="${ALERTMEND_LOGO_DATA_URI}" x="8" y="6" width="34" height="38" preserveAspectRatio="xMidYMid meet"/><text x="64" y="33" font-size="24" font-weight="700" fill="#fff">AlertMend</text><text x="236" y="33" font-size="18" fill="#8b82b8">· Elasticsearch on Kubernetes</text></g><text x="80" y="238" font-size="64" font-weight="800" fill="#fff">${esc(line1)}</text><text x="80" y="308" font-size="64" font-weight="800" fill="#fff">${esc(line2)}</text><text x="80" y="372" font-size="27" fill="#c4b5fd">${esc(sub)}</text><g>${c}</g><text x="80" y="576" font-size="20" fill="#8b82b8">alertmend.io · Detect, explain, and recover Elasticsearch incidents</text></svg>\n`
}

// ============================ POSTS ============================
const SIDEBAR = [
  { slug: 'troubleshooting-elasticsearch-unassigned-shards-kubernetes', title: 'Elasticsearch Unassigned Shards on Kubernetes' },
  { slug: 'elasticsearch-cluster-yellow-incident-kubernetes', title: 'Elasticsearch Cluster Yellow on Kubernetes' },
  { slug: 'troubleshooting-unhealthy-elasticsearch-nodes-on-kubernetes', title: 'Unhealthy Elasticsearch Nodes on Kubernetes' },
  { slug: 'frequent-garbage-collection-issues-in-elasticsearch-for-better-performance', title: 'Frequent Garbage Collection in Elasticsearch' },
  { slug: 'debugging-kubernetes-oomkilled-exit-code-137-causes-and-solutions', title: 'Kubernetes OOMKilled: Exit Code 137' },
  { slug: '503-no-healthy-upstream', title: '503 No Healthy Upstream: Fix Guide' },
  { slug: 'make-error-127', title: 'Make Error 127: Command Not Found Fix' },
]

const POSTS = [
  {
    slug: 'elasticsearch-disk-out-of-space-incident',
    author: 'Himanshu Bansal',
    title: 'Elasticsearch Disk Out of Space: Fix',
    h1: 'Elasticsearch Disk Out of Space: Diagnose and Fix',
    excerpt: 'Fix Elasticsearch disk out of space: understand the low, high, and flood-stage watermarks, clear the read-only block, free space, and prevent it recurring.',
    keywords: 'elasticsearch disk out of space, elasticsearch flood stage, elasticsearch read only allow delete, disk watermark, elasticsearch low disk watermark, index read-only, elasticsearch out of disk kubernetes, cluster.routing.allocation.disk.watermark',
    howtoName: 'Diagnose an Elasticsearch disk out of space incident',
    hero: ['Elasticsearch Disk', 'Out of Space'],
    heroSub: 'Watermarks, the read-only block, and how to recover.',
    heroChips: ['Flood stage 95%', 'Read-only lock', 'Free & recover'],
    instant: {
      headline: 'A disk crossed the flood-stage watermark, so Elasticsearch made indices read-only.',
      para: 'At the default 95% flood-stage watermark, Elasticsearch sets <code>index.blocks.read_only_allow_delete</code> on indices with a shard on that node. This permits deleting an entire index, not deleting documents, while blocking writes. Free disk first; current versions normally remove the block after usage falls below the high watermark.',
      cmds: [['GET _cat/allocation?v', 'see disk.percent per node'], ["GET */_settings/index.blocks.read_only_allow_delete", 'confirm affected indices'], ['GET _cluster/settings?include_defaults=true', 'check watermark overrides']],
      sources: [['https://www.elastic.co/docs/troubleshoot/elasticsearch/fix-watermark-errors', 'Elastic: fix watermark errors'], ['https://www.elastic.co/docs/troubleshoot/elasticsearch/fix-data-node-out-of-disk', 'Elastic: fix a data node out of disk']],
    },
    immediate: { title: 'Free space, then verify writes', steps: ['Run <code>GET _cat/allocation?v</code> and find the node over its flood-stage threshold.', 'Free disk on that node: delete or roll an old index, expand the volume, or add capacity.', 'Wait until usage is below the high watermark. If the block remains, clear <code>index.blocks.read_only_allow_delete</code> explicitly.'], caution: 'clearing the read-only block <em>before</em> freeing space can let the disk fill completely. Create headroom first.' },
    toc: [['meaning', 'What triggers it'], ['diagnose', 'Diagnose the full disk'], ['causes', 'Common causes'], ['fix', 'Fix it step by step'], ['prevent', 'Prevent recurrence'], ['sources', 'Primary sources']],
    meaningTitle: 'What triggers the read-only block',
    meaning: [
      'Elasticsearch uses three disk watermarks. At the <strong>low</strong> watermark (default 85%) it stops allocating most new shards to the node. At the <strong>high</strong> watermark (90%) it tries to relocate shards away. At the <strong>flood-stage</strong> watermark (95%) it applies a read-only-allow-delete block to every index with a shard on the affected node. The block permits deleting an entire index to recover space; document writes and deletes remain blocked.',
      'This is a safety mechanism, not a bug. The durable recovery sequence is: create headroom, monitor relocation, and verify the block is removed. In current releases Elasticsearch normally removes the block automatically after disk usage falls below the high watermark; clear it manually only if it remains.',
    ],
    symptomCode: 'PUT /my-index/_doc/1\n{"field":"value"}\n\n# HTTP 429 cluster_block_exception:\n# "disk usage exceeded flood-stage watermark,\n# index has read-only-allow-delete block"',
    animation: gaugeSvg('es-disk', { label: 'Disk usage on the hot node', marks: [{ at: 85, label: 'low 85%', color: '#f59e0b' }, { at: 90, label: 'high 90%', color: '#ea580c' }, { at: 95, label: 'flood 95%', color: '#dc2626' }], fillFrom: 78, fillPeak: 96, fillRecover: 68, peakColor: '#dc2626', badge: 'INDEX READ-ONLY', caption: 'Usage crosses the flood-stage watermark and affected indices become read-only. After disk falls below the high watermark, current Elasticsearch releases the block automatically; verify and clear it only if it remains.' }),
    diagnose: [
      ['Find the full node', 'Run <code>GET _cat/allocation?v</code> to see <code>disk.percent</code><code>disk.used</code>and <code>disk.avail</code> for every node. The one above 95% owns the incident.'],
      ['Confirm the block', 'Run <code>GET _all/_settings/index.blocks.read_only_allow_delete</code>. A value of <code>true</code> confirms the flood-stage block was applied.'],
      ['See what is using space', 'Run <code>GET _cat/indices?v&s=store.size:desc</code> to find the largest indices, and check for old or duplicate indices safe to delete.'],
      ['Check for custom watermarks', 'Run <code>GET _cluster/settings?include_defaults=true&flat_settings=true</code> and inspect the <code>cluster.routing.allocation.disk.watermark.*</code> values in case they were changed.'],
    ],
    causes: [
      ['Unbounded index growth', 'Logs or metrics indices grow forever with no rollover or retention.', 'Adopt an ILM policy that rolls over by size or age and deletes old indices.'],
      ['Undersized data volume', 'The PersistentVolume is simply too small for the workload.', 'Expand the PVC (if the StorageClass allows) or add data nodes to spread shards.'],
      ['Oversized shards or too many replicas', 'Large shards and extra replicas multiply on-disk footprint.', 'Right-size shards (tens of GB each) and review replica count for the index.'],
      ['Merge and translog overhead', 'Segment merges and translog need free headroom to operate.', 'Keep 15 to 25% free; do not run data nodes near the watermarks by design.'],
      ['One hot node', 'Uneven allocation fills a single node while others have room.', 'Check allocation balance; the high watermark should relocate shards, so investigate why it did not.'],
    ],
    fixTitle: 'Fix it step by step',
    fixIntro: 'Recover in order: create headroom, verify you are under the watermark, then clear the block. Never clear the block first.',
    fixCode: '# 1. Free space: delete a confirmed-retired index (or expand capacity)\nDELETE /logs-2026.05\n\n# 2. Confirm the node falls below the high watermark\nGET _cat/allocation?v\nGET _cluster/health\n\n# 3. Current versions normally remove the block automatically.\n# If it remains after disk is healthy, clear it explicitly:\nPUT */_settings?expand_wildcards=all\n{ "index.blocks.read_only_allow_delete": null }\n\n# 4. Confirm writes and relocation recover\nGET _cat/recovery?v&active_only=true\nGET _cluster/health?wait_for_status=yellow&timeout=120s',
    fixNote: 'Do not permanently raise watermarks to hide a capacity problem. Elastic recommends the defaults for most clusters; add capacity, reduce retained data, or correct shard sizing instead.',
    preventTitle: 'Prevent it from recurring',
    prevent: [
      'The durable fix is retention plus headroom. Use Index Lifecycle Management to roll over indices by size or age and delete them on schedule, so no index grows without bound.',
      'CODE:PUT _ilm/policy/logs-policy\n{\n  "policy": {\n    "phases": {\n      "hot":    { "actions": { "rollover": { "max_primary_shard_size": "50gb", "max_age": "7d" } } },\n      "delete": { "min_age": "30d", "actions": { "delete": {} } }\n    }\n  }\n}',
      'Then size data volumes so nodes sit comfortably under the low watermark during normal operation, and alert on <code>disk.percent</code> crossing 80% so you act before the flood stage ever triggers.',
    ],
    amIntro: 'A full disk on one data node becomes a cluster-wide write outage in minutes. AlertMend watches disk usage and the read-only block across your Elasticsearch pods and connects them to the underlying volume and recent index growth.',
    amSteps: [
      ['Detect', 'Catch a node crossing the high or flood-stage watermark and the read-only block being applied, before writes fail cluster-wide.'],
      ['Correlate', 'Tie the full node to its PersistentVolume, the fastest-growing indices, and recent ingest changes.'],
      ['Explain', 'Report which node, which watermark, and which indices are driving the fill, with the exact remediation.'],
      ['Recover safely', 'Run an approved runbook, roll or delete per ILM, expand the volume, then clear the read-only block and verify writes resume.'],
    ],
    proof: {
      title: 'Disk watermark → affected indices → guarded recovery',
      rows: [
        ['Signal', '<code>disk.percent</code> crosses the high watermark on <code>es-data-2</code>; ingest latency rises.'],
        ['Correlation', 'The fastest-growing index and its PersistentVolume are attached to the same node; the last ingest change is included.'],
        ['Decision', 'AlertMend recommends capacity or an ILM-safe deletion and explains why clearing the block first is unsafe.'],
        ['Verification', 'After the approved action, disk falls below the high watermark, writes succeed, and relocation trends back to zero.'],
      ],
      guardrail: 'Index deletion and volume changes require explicit approval. Read-only diagnosis and post-action verification can run automatically in managed or self-hosted deployments.',
    },
    sources: [
      ['https://www.elastic.co/docs/troubleshoot/elasticsearch/fix-watermark-errors', 'Elasticsearch: fix watermark errors', 'defines default thresholds, automatic block removal, monitoring, temporary relief, and durable recovery.'],
      ['https://www.elastic.co/docs/troubleshoot/elasticsearch/fix-data-node-out-of-disk', 'Elasticsearch: fix a data node out of disk', 'the two durable paths: increase capacity or reduce retained data.'],
      ['https://www.elastic.co/guide/en/elasticsearch/reference/current/index-lifecycle-management.html', 'Elasticsearch: Index Lifecycle Management', 'rollover and delete phases that prevent unbounded index growth.'],
    ],
    faq: [
      ['How do I fix "index read-only / allow delete"?', 'Free disk on the affected node first and confirm usage is below the high watermark with GET _cat/allocation?v. Current Elasticsearch versions normally remove the block automatically. If it remains, set index.blocks.read_only_allow_delete to null on the affected indices.'],
      ['What are the Elasticsearch disk watermarks?', 'Low (default 85%) stops new shard allocation to the node; high (90%) relocates shards away; flood-stage (95%) makes indices read-only. They are set with cluster.routing.allocation.disk.watermark.low, .high, and .flood_stage.'],
      ['Why did only some indices go read-only?', 'The flood-stage block is applied to indices that have a shard on the node that crossed 95%, not to the whole cluster. Indices whose shards live only on healthy nodes keep accepting writes.'],
      ['Should I raise the flood-stage watermark permanently?', 'No. Raising it is a temporary way to buy time to delete data or add capacity. Running data nodes near 95% removes the headroom that merges and translog need and risks a 100% disk. Restore the defaults after recovery.'],
      ['How do I stop this happening again?', 'Use ILM to roll over and delete indices on a schedule, size volumes so nodes stay under the low watermark, and alert at 80% disk so you act well before the flood stage.'],
    ],
    ctaTitle: 'Catch the watermark before writes stop.',
    ctaSub: 'See AlertMend tie a filling Elasticsearch volume to the index driving it and run the approved cleanup before the read-only block ever triggers.',
    ctaLabel: 'See the disk incident runbook',
    related: [['optimizing-high-jvm-heap-usage-in-elasticsearch', 'High JVM Heap Usage'], ['elasticsearch-shard-relocation-incidents-on-kubernetes', 'Shard Relocation on Kubernetes']],
  },
  {
    slug: 'elasticsearch-shard-relocation-incidents-on-kubernetes',
    author: 'Himanshu Bansal',
    title: 'Elasticsearch Shard Relocation on Kubernetes',
    h1: 'Elasticsearch Shard Relocation Incidents on Kubernetes',
    excerpt: 'Diagnose Elasticsearch shard relocation on Kubernetes: pod evictions, delayed allocation, and how to keep the cluster green through node drains and rollouts.',
    keywords: 'elasticsearch shard relocation, elasticsearch relocating shards kubernetes, unassigned shards, delayed allocation, elasticsearch pod eviction, cluster.routing.allocation.enable, elasticsearch statefulset, elasticsearch rolling restart shards',
    howtoName: 'Diagnose Elasticsearch shard relocation on Kubernetes',
    hero: ['Shard Relocation', 'on Kubernetes'],
    heroSub: 'Pod evictions, delayed allocation, and staying green.',
    heroChips: ['Node drains', 'Delayed allocation', 'Stay green'],
    instant: {
      headline: 'A pod left the cluster, so Elasticsearch is relocating its shards to other nodes.',
      para: 'On Kubernetes, a pod eviction, node drain, or rolling update can remove a data node. Replica copies may become unassigned and rebuild elsewhere, usually making the cluster yellow. Red means a primary has no available copy and needs immediate investigation.',
      cmds: [['GET _cluster/health', 'yellow/red + unassigned count'], ['GET _cat/shards?v', 'RELOCATING / UNASSIGNED / INITIALIZING'], ['GET _cluster/allocation/explain', 'why a shard cannot allocate']],
      sources: [['https://www.elastic.co/docs/deploy-manage/distributed-architecture/shard-allocation-relocation-recovery', 'Elastic: allocation, relocation and recovery'], ['https://www.elastic.co/docs/api/doc/elasticsearch/operation/operation-cluster-allocation-explain', 'Elastic: allocation explain API']],
    },
    immediate: { title: 'Is it recovering, or stuck?', steps: ['Run <code>GET _cluster/health</code>; a falling <code>unassigned_shards</code> means it is recovering on its own.', 'Run <code>GET _cat/recovery?v&active_only=true</code> to watch relocation progress.', 'If shards are stuck, run <code>GET _cluster/allocation/explain</code> for the exact reason.'], caution: 'restarting more pods to "speed it up" usually triggers more relocation. Let in-flight recovery finish first.' },
    toc: [['meaning', 'Why shards relocate'], ['diagnose', 'Diagnose the movement'], ['causes', 'Common causes'], ['fix', 'Fix it step by step'], ['prevent', 'Prevent recurrence'], ['sources', 'Primary sources']],
    meaningTitle: 'Why shards relocate on Kubernetes',
    meaning: [
      'Elasticsearch keeps primary and replica shards on different nodes. When a data node disappears, the cluster promotes replicas, then rebuilds the missing copies elsewhere, which is the relocation you see. On a static host this is rare; on Kubernetes it happens every time a pod is evicted, a node is drained, or a StatefulSet rolls.',
      'The cluster going yellow during this is normal and safe, red is not. The real goal is not to stop relocation but to make it fast, bounded, and avoidable during routine operations, so a rolling restart does not turn into an hour of shard shuffling and heavy I/O.',
    ],
    symptomCode: '# GET _cluster/health\n{\n  "status": "yellow",\n  "relocating_shards": 6,\n  "initializing_shards": 2,\n  "unassigned_shards": 8\n}',
    animation: shardFlowSvg(),
    diagnose: [
      ['Check cluster health', 'Run <code>GET _cluster/health</code>. Note <code>status</code><code>relocating_shards</code><code>initializing_shards</code>and <code>unassigned_shards</code>. A steadily falling unassigned count means healthy recovery.'],
      ['Watch the shards move', 'Run <code>GET _cat/shards?v</code> and <code>GET _cat/recovery?v&active_only=true</code> to see which shards are RELOCATING or INITIALIZING and how far along each is.'],
      ['Explain any stuck shard', 'Run <code>GET _cluster/allocation/explain</code> (optionally for a specific shard). It names the exact blocker: disk watermark, allocation disabled, awareness rules, or no valid node.'],
      ['Correlate with Kubernetes', 'Check <code>kubectl get pods -o wide</code> and recent events for evictions, OOMKills, or a node drain that removed the Elasticsearch pod behind the relocation.'],
    ],
    causes: [
      ['Pod eviction under pressure', 'The node ran low on memory or disk and the kubelet evicted the Elasticsearch pod.', 'Set proper requests and limits, and a PodDisruptionBudget so not all data pods move at once.'],
      ['Rolling update with no delay', 'A StatefulSet rollout removes a pod and shards relocate immediately instead of waiting for it to return.', 'Raise index.unassigned.node_left.delayed_timeout so short restarts do not trigger a full rebuild.'],
      ['Allocation left disabled', 'A prior maintenance set cluster.routing.allocation.enable to none and it was never reset.', 'Set it back to all; check with GET _cluster/settings.'],
      ['Disk watermark on the target', 'Shards cannot relocate onto nodes already above the high watermark.', 'Free disk or add capacity so target nodes can accept shards.'],
      ['No graceful shutdown', 'Pods are killed hard, so replicas are lost abruptly instead of handed off.', 'Use a StatefulSet with a termination grace period and readiness gates; consider the ECK operator.'],
    ],
    fixTitle: 'Fix a rolling restart the safe way',
    fixIntro: 'For planned maintenance, allow primary recovery but temporarily defer replica allocation, restart one pod at a time, and restore allocation immediately afterward. Always wait for cluster stability before touching the next pod.',
    fixCode: '# Before a rolling restart: give a returning node time to reuse local shards\nPUT _all/_settings\n{ "settings": { "index.unassigned.node_left.delayed_timeout": "5m" } }\n\n# Temporarily allow primary allocation only\nPUT _cluster/settings\n{ "persistent": { "cluster.routing.allocation.enable": "primaries" } }\n\n# Optional: reduce recovery work before stopping a node\nPOST /_flush\n\n# ... restart ONE pod and wait for it to rejoin ...\n\n# Re-enable all allocation immediately after the pod returns\nPUT _cluster/settings\n{ "persistent": { "cluster.routing.allocation.enable": null } }\n\n# Do not continue until the cluster is stable\nGET _cluster/health?wait_for_status=green&timeout=120s\nGET _cat/recovery?v&active_only=true',
    fixNote: 'Delayed allocation means a pod that returns within the timeout reuses its existing on-disk shards instead of rebuilding them from scratch, which turns a heavy relocation into a near-instant recovery.',
    preventTitle: 'Prevent relocation storms',
    prevent: [
      'Treat Elasticsearch as a stateful workload. Run it as a StatefulSet (or via the ECK operator) with stable PersistentVolumes, a PodDisruptionBudget, and anti-affinity so replicas never share a node.',
      'CODE:apiVersion: policy/v1\nkind: PodDisruptionBudget\nmetadata:\n  name: es-data-pdb\nspec:\n  maxUnavailable: 1\n  selector:\n    matchLabels:\n      elasticsearch.k8s.elastic.co/cluster-name: my-cluster',
      'Set generous termination grace periods and readiness gates so pods hand off cleanly, and never drain more than one data node at a time. With delayed allocation plus a PDB, routine rollouts stay green.',
    ],
    amIntro: 'Shard relocation on Kubernetes is where cluster health and pod lifecycle collide, and the cause is usually in the Kubernetes layer, not Elasticsearch. AlertMend correlates unassigned and relocating shards with the pod evictions, drains, and rollouts that triggered them.',
    amSteps: [
      ['Detect', 'Catch the cluster going yellow or red and unassigned shards appearing, tied to the exact pod that left.'],
      ['Correlate', 'Link the relocation to the Kubernetes event, an eviction, OOMKill, node drain, or rollout, that caused it.'],
      ['Explain', 'Run allocation-explain and surface the real blocker: a returning pod, a disk watermark, or disabled allocation.'],
      ['Recover safely', 'Apply an approved runbook: re-enable allocation, wait out delayed recovery, or restart the failed pod, then confirm green.'],
    ],
    proof: {
      title: 'Pod lifecycle → shard state → allocation decision',
      rows: [
        ['Signal', '<code>es-data-1</code> leaves during a node drain; replica shards become unassigned and recovery traffic starts.'],
        ['Correlation', 'Kubernetes eviction and StatefulSet rollout events align with the exact Elasticsearch node departure.'],
        ['Decision', '<code>_cluster/allocation/explain</code> shows whether to wait, restore allocation, free disk, or replace the pod.'],
        ['Verification', 'The pod rejoins, unassigned and relocating counts reach zero, and the cluster remains green before the next rollout step.'],
      ],
      guardrail: 'AlertMend never advances a rolling operation while the cluster is unstable. Allocation changes and pod restarts follow approval policy and are fully auditable.',
    },
    sources: [
      ['https://www.elastic.co/docs/deploy-manage/distributed-architecture/shard-allocation-relocation-recovery', 'Elasticsearch: allocation, relocation and recovery', 'how shard copies allocate, move, recover, and protect primary availability.'],
      ['https://www.elastic.co/docs/api/doc/elasticsearch/operation/operation-cluster-allocation-explain', 'Elasticsearch: cluster allocation explain API', 'the API that names why a shard is unassigned, cannot move, or remains on a node.'],
      ['https://www.elastic.co/guide/en/cloud-on-k8s/current/k8s-orchestration.html', 'Elastic Cloud on Kubernetes (ECK): orchestration', 'operator-managed rollouts, graceful shutdown, and stable storage.'],
    ],
    faq: [
      ['Is shard relocation on Kubernetes a problem?', 'Not by itself. A yellow cluster while shards relocate after a pod restart is normal and safe. It becomes a problem when it is slow, frequent, or leaves the cluster red. Delayed allocation and a PodDisruptionBudget keep routine rollouts smooth.'],
      ['How do I stop shards relocating during a rolling restart?', 'Raise index.unassigned.node_left.delayed_timeout and set cluster.routing.allocation.enable to primaries before the restart, restart one pod at a time, then set allocation back to all. A pod that returns within the timeout reuses its own shards.'],
      ['Why are my shards stuck unassigned?', 'Run GET _cluster/allocation/explain. Common blockers are a disk watermark on the target nodes, allocation left disabled from prior maintenance, allocation-awareness rules, or no node that satisfies the shard’s constraints.'],
      ['What causes constant relocation on Kubernetes?', 'Repeated pod evictions from memory or disk pressure, hard pod kills without graceful shutdown, or rollouts without delayed allocation. Fix requests and limits, add a PDB, and use stable PersistentVolumes.'],
      ['Should I use the ECK operator?', 'For production Elasticsearch on Kubernetes it helps: ECK manages graceful shutdown, stable storage, and safe rolling changes, which removes many of the manual steps that otherwise trigger relocation.'],
    ],
    ctaTitle: 'Keep the cluster green through every rollout.',
    ctaSub: 'See AlertMend tie relocating shards to the pod eviction or drain that caused them and run the approved recovery, instead of guessing across two layers.',
    ctaLabel: 'See the relocation runbook',
    related: [['elasticsearch-disk-out-of-space-incident', 'Disk Out of Space'], ['optimizing-high-jvm-heap-usage-in-elasticsearch', 'High JVM Heap Usage']],
  },
  {
    slug: 'optimizing-high-jvm-heap-usage-in-elasticsearch',
    author: 'Himanshu Bansal',
    title: 'Fix High JVM Heap Usage in Elasticsearch',
    h1: 'High JVM Heap Usage in Elasticsearch: Diagnose and Fix',
    excerpt: 'Fix high JVM heap usage in Elasticsearch: size heap correctly, cut fielddata and shard overhead, read circuit breakers, and stop the GC pressure.',
    keywords: 'elasticsearch high jvm heap, elasticsearch heap usage, jvm heap size elasticsearch, elasticsearch circuit breaker, fielddata memory, elasticsearch garbage collection, heap.percent, elasticsearch 31gb heap, reduce shard count',
    howtoName: 'Diagnose high JVM heap usage in Elasticsearch',
    hero: ['High JVM Heap', 'in Elasticsearch'],
    heroSub: 'Heap sizing, fielddata, shards, and GC pressure.',
    heroChips: ['Automatic sizing', 'Old-gen pressure', 'Fewer shards'],
    instant: {
      headline: 'Heap is high because of demand (fielddata, aggregations, shard overhead) or wrong sizing.',
      para: 'Sustained JVM memory pressure above 85% causes longer garbage collection, latency, and circuit-breaker rejections. Keep Elasticsearch automatic heap sizing unless you have measured evidence to override it, then remove the workload driving old-generation pressure.',
      cmds: [['GET _nodes/stats?filter_path=nodes.*.jvm.mem.pools.old', 'calculate old-gen pressure'], ['GET _nodes/stats/breaker', 'which circuit breaker trips'], ['GET _cat/fielddata?v&s=size:desc', 'fielddata memory by field']],
      sources: [['https://www.elastic.co/docs/troubleshoot/elasticsearch/high-jvm-memory-pressure', 'Elastic: high JVM memory pressure'], ['https://www.elastic.co/docs/reference/elasticsearch/jvm-settings', 'Elastic: JVM settings']],
    },
    immediate: { title: 'Measure old-gen pressure, then find demand', steps: ['Use the old-generation pool stats to calculate <code>used_in_bytes / max_in_bytes</code> per node.', 'Check GC logs and circuit breakers to distinguish sustained pressure from a short healthy spike.', 'Find fielddata, expensive searches, mapping growth, bulk requests, or shard count driving the pressure.'], caution: 'increasing heap first can starve the filesystem cache and conceal the workload causing pressure. Prefer automatic sizing; override only after measurement.' },
    toc: [['meaning', 'Why heap fills'], ['diagnose', 'Diagnose the pressure'], ['causes', 'Common causes'], ['fix', 'Fix it step by step'], ['prevent', 'Prevent recurrence'], ['sources', 'Primary sources']],
    meaningTitle: 'Why the heap fills up',
    meaning: [
      'Elasticsearch runs on the JVM, and every shard, mapping, cache, and in-flight request consumes heap. Two forces push it up: <strong>sizing</strong> (too little heap, or paradoxically too much) and <strong>demand</strong> (fielddata on text fields, large aggregations, and the fixed per-shard overhead of running thousands of shards).',
      'When heap stays high the garbage collector runs longer and more often, adding latency, and circuit breakers start rejecting requests to avoid an OutOfMemory crash. High heap is therefore both a symptom and a cause: fix the sizing, then remove the demand that keeps refilling it.',
    ],
    symptomCode: '# GET _cat/nodes?v&h=name,heap.percent,ram.percent\n# name    heap.percent ram.percent\n# es-data-0   92          88\n\n# CircuitBreakingException: [parent] Data too large,\n# data for [<http_request>] would be larger than limit',
    animation: gaugeSvg('es-heap', { label: 'Old-generation JVM memory pressure', marks: [{ at: 75, label: 'investigate trend', color: '#f59e0b' }, { at: 85, label: 'sustained pressure', color: '#dc2626' }], fillFrom: 66, fillPeak: 93, fillRecover: 58, peakColor: '#dc2626', badge: 'REQUESTS REJECTED', caption: 'A healthy sawtooth rises and falls after collection. Sustained old-generation pressure above 85% calls for reducing workload or increasing capacity; breaker limits vary by breaker and configuration.' }),
    diagnose: [
      ['Calculate old-gen pressure', 'Run <code>GET _nodes/stats?filter_path=nodes.*.jvm.mem.pools.old</code> and calculate <code>used_in_bytes / max_in_bytes</code>. Sustained pressure above 85% needs action; a brief sawtooth spike may be normal.'],
      ['Check circuit breakers', 'Run <code>GET _nodes/stats/breaker</code>. The <code>parent</code><code>fielddata</code>and <code>request</code> breakers show what is tripping and how close each is to its limit.'],
      ['Find fielddata hogs', 'Run <code>GET _cat/fielddata?v&s=size:desc</code>. Large fielddata usually means aggregating or sorting on a text field, which loads the whole field into heap.'],
      ['Count your shards', 'Run <code>GET _cat/shards?v | wc -l</code> style checks or <code>GET _cluster/health</code>. Thousands of tiny shards carry fixed heap overhead; Elastic recommends keeping shards in the tens of GB, not hundreds of MB.'],
    ],
    causes: [
      ['Manual heap override is wrong', 'A custom Xms/Xmx ignores node roles or consumes memory needed by the filesystem cache.', 'Return to automatic heap sizing where possible. If you must override, keep Xms equal to Xmx and no more than 50% of memory available to the node or container.'],
      ['Fielddata on text fields', 'Aggregating or sorting on a text field loads every term into heap.', 'Use a keyword sub-field with doc_values for aggregations and sorting instead of enabling fielddata.'],
      ['Too many shards', 'Thousands of small shards multiply per-shard heap overhead.', 'Consolidate with ILM rollover and shrink; target shards in the tens of GB.'],
      ['Expensive aggregations', 'High-cardinality terms aggregations or deep nested aggs build large in-heap structures.', 'Add search.max_buckets limits, use composite aggregations, and cap cardinality.'],
      ['Mapping explosion', 'Dynamic mapping creates thousands of fields, each with overhead.', 'Disable or constrain dynamic mapping and set index.mapping.total_fields.limit deliberately.'],
    ],
    fixTitle: 'Fix it step by step',
    fixIntro: 'Identify the consumer before changing capacity. Correct query and mapping demand first; revisit heap sizing only when the measured workload still exceeds the node.',
    fixCode: '# 1. Measure old-generation memory pressure\nGET _nodes/stats?filter_path=nodes.*.name,nodes.*.jvm.mem.pools.old\n\n# 2. Stop aggregating on text; use the keyword sub-field\nGET /my-index/_search\n{\n  "size": 0,\n  "aggs": { "by_status": { "terms": { "field": "status.keyword" } } }\n}\n\n# 3. Bound runaway aggregations\nPUT _cluster/settings\n{ "persistent": { "search.max_buckets": 20000 } }\n\n# 4. Temporary relief only after confirming fielddata is the consumer\nPOST /my-index/_cache/clear?fielddata=true',
    fixNote: 'Clearing the fielddata cache frees heap immediately but it refills on the next text aggregation. The lasting fix is mapping (keyword + doc_values) and shard count, not repeated cache clears.',
    preventTitle: 'Prevent heap pressure',
    prevent: [
      'Prefer Elasticsearch automatic heap sizing, which considers node roles and available memory. If a measured workload requires a manual override, use a custom JVM options file, keep Xms equal to Xmx, and allocate no more than 50% of memory available to the node or container.',
      'CODE:# Example custom JVM options file for a measured 16Gi container\n# config/jvm.options.d/heap.options\n-Xms8g\n-Xmx8g\n\n# Keep the remaining memory available for the OS and filesystem cache.',
      'Design mappings so aggregations and sorts hit keyword fields with doc_values, use ILM to keep shard counts sane, and alert on heap crossing 80% so you tune before the circuit breakers trip.',
    ],
    amIntro: 'High heap rarely fails cleanly: it degrades latency, trips breakers, and eventually OOMKills the pod, which then triggers shard relocation. AlertMend watches heap, GC, and circuit breakers across nodes and connects a rising trend to the query or mapping behind it.',
    amSteps: [
      ['Detect', 'Catch sustained high heap, long GC pauses, and tripping circuit breakers before a node OOMKills.'],
      ['Correlate', 'Link the pressure to fielddata growth, a heavy aggregation, shard count, or a recent mapping change.'],
      ['Explain', 'Report which node, which breaker, and which consumer is driving heap, with the concrete fix.'],
      ['Recover safely', 'Run an approved runbook, clear fielddata for relief, throttle a query, or restart and reschedule the pod, then verify heap settles.'],
    ],
    proof: {
      title: 'Old-gen pressure → workload evidence → safe action',
      rows: [
        ['Signal', 'Old-generation pressure stays above 85% while GC duration and search latency rise on one data node.'],
        ['Correlation', 'Fielddata growth and a high-cardinality aggregation begin at the same time; breaker estimates identify the consumer.'],
        ['Decision', 'AlertMend recommends the mapping or query change first, with cache clearing labeled as temporary relief.'],
        ['Verification', 'Pressure returns to a healthy sawtooth, breaker trips stop, and latency remains stable after the approved change.'],
      ],
      guardrail: 'Heap changes, query throttling, and pod restarts follow your approval policy. The self-hosted option keeps heap diagnostics and remediation records inside your environment.',
    },
    sources: [
      ['https://www.elastic.co/docs/troubleshoot/elasticsearch/high-jvm-memory-pressure', 'Elasticsearch: high JVM memory pressure', 'the old-generation calculation, 85% sustained-pressure threshold, GC evidence, and workload-reduction guidance.'],
      ['https://www.elastic.co/docs/reference/elasticsearch/jvm-settings', 'Elasticsearch: JVM settings', 'automatic heap sizing and the constraints for a measured manual override.'],
      ['https://www.elastic.co/guide/en/elasticsearch/reference/current/circuit-breaker.html', 'Elasticsearch: circuit breaker settings', 'the parent, fielddata, and request breakers that reject requests to avoid OOM.'],
    ],
    faq: [
      ['What is a healthy JVM heap usage in Elasticsearch?', 'Brief spikes to 75 to 85% after large queries are normal. Sustained usage above ~85% is a problem: GC runs longer, latency rises, and circuit breakers start rejecting requests. Aim to keep steady-state heap comfortably below 75%.'],
      ['How much heap should I give Elasticsearch?', 'Use Elasticsearch automatic heap sizing for most production nodes. If measurement justifies an override, set Xms equal to Xmx and use no more than 50% of the memory available to that node or container so the OS and filesystem cache retain headroom.'],
      ['Should I manually increase heap when pressure is high?', 'Not first. Identify whether fielddata, expensive searches, mapping growth, bulk requests, or shard overhead is driving old-generation pressure. More heap can starve the filesystem cache and postpone the same failure.'],
      ['What causes high heap in Elasticsearch?', 'The usual causes are fielddata from aggregating or sorting on text fields, too many shards adding fixed overhead, expensive high-cardinality aggregations, and mapping explosion. Fix mappings and shard count rather than only clearing caches.'],
      ['How do I reduce fielddata memory?', 'Do not aggregate or sort on text fields. Use a keyword sub-field with disk-backed doc values. Clearing the fielddata cache is temporary relief; correcting the mapping and query is the durable fix.'],
    ],
    ctaTitle: 'Catch heap pressure before the OOMKill.',
    ctaSub: 'See AlertMend tie a rising heap trend and tripping breakers to the query or mapping behind them, and run the approved fix before the pod dies and shards relocate.',
    ctaLabel: 'See the heap-pressure runbook',
    related: [['frequent-garbage-collection-issues-in-elasticsearch-for-better-performance', 'Frequent Garbage Collection'], ['elasticsearch-caching-issues', 'Caching Issues']],
  },
  {
    slug: 'elasticsearch-caching-issues',
    author: 'Arvind Rajpurohit',
    title: 'Elasticsearch Caching Issues: Fix Guide',
    h1: 'Elasticsearch Caching Issues: Diagnose and Fix',
    excerpt: 'Fix Elasticsearch caching issues: the node query, shard request, and fielddata caches, why hit rates drop, and how to size them for fast search.',
    keywords: 'elasticsearch caching issues, elasticsearch query cache, shard request cache, fielddata cache, elasticsearch cache hit rate, indices.queries.cache.size, request_cache, clear cache elasticsearch, elasticsearch slow queries cache',
    howtoName: 'Diagnose Elasticsearch caching issues',
    hero: ['Elasticsearch', 'Caching Issues'],
    heroSub: 'Query, request, and fielddata caches, and why they miss.',
    heroChips: ['Query cache', 'Request cache', 'Fielddata'],
    instant: {
      headline: 'Slow search usually means the right cache is not being used, not that caching is broken.',
      para: 'Elasticsearch has different mechanisms with different rules: the <strong>node query cache</strong> stores eligible filter results, the <strong>shard request cache</strong> stores shard-level responses, and <strong>fielddata</strong> loads text-field data on heap for sorting and aggregation. Diagnose them separately.',
      cmds: [['GET _nodes/stats/indices/query_cache,request_cache,fielddata', 'hit/miss + memory'], ['GET _stats/request_cache,query_cache,fielddata?human', 'compare by index'], ['POST /index/_cache/clear?request=true', 'target one cache only']],
      sources: [['https://www.elastic.co/guide/en/elasticsearch/reference/current/shard-request-cache.html', 'Elastic: shard request cache'], ['https://www.elastic.co/guide/en/elasticsearch/reference/current/query-cache.html', 'Elastic: node query cache']],
    },
    immediate: { title: 'Match the mechanism to the query', steps: ['Read query-cache, request-cache, and fielddata stats by node and index before changing settings.', 'For repeated aggregation dashboards, use <code>size: 0</code> for the default request-cache path and round date math.', 'For text sorting or aggregation, inspect fielddata; high usage is a mapping and heap problem, not evidence of a healthy result cache.'], caution: 'clearing every cache makes subsequent requests slower while entries rebuild. Target a specific cache only after the statistics prove it is relevant.' },
    toc: [['meaning', 'The three caches'], ['diagnose', 'Diagnose cache use'], ['causes', 'Common causes'], ['fix', 'Fix it step by step'], ['prevent', 'Prevent recurrence'], ['sources', 'Primary sources']],
    meaningTitle: 'The three Elasticsearch caches',
    meaning: [
      'The <strong>node query cache</strong> stores eligible filter results per node. The <strong>shard request cache</strong> stores a shard’s response and, by default, caches requests with <code>size: 0</code>; setting <code>request_cache=true</code> can opt other requests in when they are otherwise cacheable. <strong>Fielddata</strong> is different: it loads values for text sorting and aggregation on the JVM heap.',
      'A low hit rate is usually not a broken cache. The query may be ineligible, may contain unrounded <code>now</code>may change its JSON body between requests, or the cache may be evicting before reuse. The fix is to prove eligibility and reuse first, then size a cache only if the working set justifies the memory.',
    ],
    symptomCode: '# GET _nodes/stats/indices/request_cache\n# "request_cache": {\n#   "memory_size_in_bytes": 104857600,\n#   "evictions": 24193,   <- investigate working-set churn\n#   "hit_count": 1201,\n#   "miss_count": 88342   <- check eligibility and exact reuse\n# }',
    animation: cacheFlowSvg(),
    diagnose: [
      ['Read cache stats', 'Run <code>GET _nodes/stats/indices/query_cache,request_cache,fielddata</code>. For each cache compare <code>hit_count</code> to <code>miss_count</code> and watch <code>evictions</code>; high evictions mean the cache is too small or churning.'],
      ['Check whether the query is cacheable', 'By default, the shard request cache caches <code>size: 0</code> requests. <code>request_cache=true</code> can opt in other eligible requests, but non-deterministic queries such as unrounded <code>now</code> still miss.'],
      ['Look at fielddata memory', 'Run <code>GET _cat/fielddata?v&s=size:desc</code>. Large fielddata is text sorting or aggregation loading into heap; that is a mapping problem, not a caching benefit.'],
      ['Compare per node', 'Run <code>GET _cat/nodes?v&h=name,qcm,rcm,fm</code> to see query-cache, request-cache, and fielddata memory per node and spot an imbalanced or saturated node.'],
    ],
    causes: [
      ['Query is not cacheable', 'The request uses unrounded now, a changing body, or the default path with size greater than zero.', 'Use size: 0 for aggregation-only dashboards, round date math, and canonicalize request JSON so identical work produces an identical cache key.'],
      ['Cache too small, high evictions', 'The request or query cache evicts entries before they are reused.', 'Prove reuse first. Then adjust the relevant static node cache setting conservatively, restart as required, and re-measure heap and latency.'],
      ['Fielddata mistaken for a cache win', 'Text aggregations load fielddata into heap; this is not a response-cache hit.', 'Aggregate on keyword sub-fields with disk-backed doc values instead of enabling fielddata on text.'],
      ['Constant writes invalidate caches', 'Frequent refreshes on an index clear its cached results every interval.', 'Increase index.refresh_interval on high-ingest indices so cached aggregations survive longer.'],
      ['Request cache disabled', 'The index or request has request caching turned off.', 'Enable index.requests.cache.enable or pass request_cache=true on the search.'],
    ],
    fixTitle: 'Fix it step by step',
    fixIntro: 'Make the query cacheable, size the cache to fit the working set, and slow the refresh on read-heavy indices so caches survive.',
    fixCode: '# 1. Make a dashboard aggregation cacheable: size:0 + rounded date math\nGET /metrics-*/_search?request_cache=true\n{\n  "size": 0,\n  "query": { "range": { "@timestamp": { "gte": "now-24h/h" } } },\n  "aggs": { "per_hour": { "date_histogram": { "field": "@timestamp", "calendar_interval": "hour" } } }\n}\n\n# 2. Give read-heavy indices a longer refresh so caches are not wiped each second\nPUT /metrics-*/_settings\n{ "index.refresh_interval": "30s" }\n\n# 3. Size the request cache (default is ~1% of heap)\n# elasticsearch.yml:\nindices.requests.cache.size: 2%',
    fixNote: 'The single biggest win is often date rounding: <code>now-24h/h</code> resolves consistently within the hour, so identical dashboard requests can reuse the same cache entry. Cache-size settings are static node settings; change them only after proving eviction is the bottleneck.',
    preventTitle: 'Prevent slow-cache problems',
    prevent: [
      'Design for the read pattern. Aggregation-only dashboards should normally use size:0 with rounded date math, and mappings should send sorting and aggregation to keyword fields with disk-backed doc values rather than text fielddata.',
      'CODE:# mapping: keep a keyword sub-field for aggregations and sorting\n"properties": {\n  "status": {\n    "type": "text",\n    "fields": { "keyword": { "type": "keyword" } }\n  }\n}',
      'On high-ingest indices, relax index.refresh_interval so cached results are not invalidated every second, and monitor cache hit rate and evictions so you tune sizing before users feel the slowdown.',
    ],
    amIntro: 'Cache problems show up as slow search and rising heap long before anyone changes a query. AlertMend watches cache hit rates, evictions, and fielddata memory across nodes and ties a drop in performance to the cache or mapping behind it.',
    amSteps: [
      ['Detect', 'Catch falling cache hit rates, rising evictions, and fielddata growth that precede slow search and heap pressure.'],
      ['Correlate', 'Link the change to a query pattern, a mapping, a refresh interval, or an index that stopped being cacheable.'],
      ['Explain', 'Report which cache and which node, and whether the fix is the query, the mapping, or the cache size.'],
      ['Recover safely', 'Apply an approved change or clear and rewarm a specific cache, then confirm hit rate and latency recover.'],
    ],
    proof: {
      title: 'Latency regression → cache eligibility → measured recovery',
      rows: [
        ['Signal', 'Dashboard p95 latency rises while request-cache misses and evictions increase on a subset of indices.'],
        ['Correlation', 'The query body starts using unrounded <code>now</code> after a dashboard release, creating a new cache key on every request.'],
        ['Decision', 'AlertMend recommends rounded date math and shows why a larger cache or blanket clear would not fix eligibility.'],
        ['Verification', 'Identical requests begin hitting the cache, p95 latency falls, and heap remains stable after the approved query change.'],
      ],
      guardrail: 'Cache clears and static setting changes require policy approval. AlertMend records the before/after hit rate, latency, and heap impact in managed or self-hosted deployments.',
    },
    sources: [
      ['https://www.elastic.co/guide/en/elasticsearch/reference/current/shard-request-cache.html', 'Elasticsearch: shard request cache', 'caches size:0 responses; skips non-cacheable queries; sized with indices.requests.cache.size.'],
      ['https://www.elastic.co/guide/en/elasticsearch/reference/current/query-cache.html', 'Elasticsearch: node query cache', 'caches cacheable filter results per node.'],
      ['https://www.elastic.co/guide/en/elasticsearch/reference/current/modules-fielddata.html', 'Elasticsearch: fielddata', 'why text aggregations load fielddata on heap and how to avoid it.'],
    ],
    faq: [
      ['Why is my Elasticsearch cache hit rate low?', 'Usually the query is ineligible or not repeated exactly. By default, the shard request cache caches size: 0 requests; request_cache=true can opt in other eligible requests. Unrounded now, changing JSON, refreshes, and evictions can still prevent reuse.'],
      ['What is the difference between the query cache and the request cache?', 'The node query cache stores the results of cacheable filter clauses per node. The shard request cache stores the entire response of size: 0 requests, which is what accelerates repeated aggregation dashboards. They solve different problems.'],
      ['Should I clear the Elasticsearch cache to fix slow search?', 'No. Clearing caches makes the next queries slower while they rewarm and hides the real issue. Diagnose which cache should apply, then fix the query shape, mapping, or cache size instead.'],
      ['How do I make aggregation dashboards faster?', 'Send them as size: 0 requests with rounded date math (now-24h/h), which makes the shard request cache reusable across loads in the same window, and give read-heavy indices a longer refresh interval so cached results are not invalidated every second.'],
      ['Is fielddata a cache I should rely on?', 'No. Fielddata loads text-field values onto the JVM heap for sorting and aggregation and is a common cause of pressure. Aggregate and sort on keyword sub-fields with disk-backed doc values instead of enabling fielddata on text.'],
    ],
    ctaTitle: 'Turn slow search back into fast search.',
    ctaSub: 'See AlertMend tie a drop in cache hit rate and rising fielddata to the query or mapping behind it, and apply the approved fix before users notice.',
    ctaLabel: 'See the cache diagnosis workflow',
    related: [['optimizing-high-jvm-heap-usage-in-elasticsearch', 'High JVM Heap Usage'], ['elasticsearch-disk-out-of-space-incident', 'Disk Out of Space']],
  },
]

let count = 0
for (const cfg of POSTS) {
  cfg.relatedSidebar = SIDEBAR.filter((p) => p.slug !== cfg.slug).slice(0, 7)
  const dir = path.join(root, 'public/blog', cfg.slug)
  const assets = path.join(root, 'public/assets', cfg.slug)
  fs.mkdirSync(dir, { recursive: true })
  fs.mkdirSync(assets, { recursive: true })
  fs.writeFileSync(path.join(dir, 'index.html'), renderPost(cfg))
  fs.writeFileSync(path.join(assets, 'script.js'), SCRIPT_JS)
  fs.writeFileSync(path.join(assets, 'styles.css'), ES_POST_CSS)
  fs.writeFileSync(path.join(assets, 'hero.svg'), heroSvg(cfg.hero[0], cfg.hero[1], cfg.heroSub, cfg.heroChips))
  fs.writeFileSync(path.join(root, 'public/blog', `${cfg.slug}.md`), `---
title: "${cfg.title}"
excerpt: "${cfg.excerpt}"
date: "${DATE}"
dateModified: "${MODIFIED}"
category: "${CAT}"
author: "${cfg.author}"
keywords: "${cfg.keywords}"
---

This post is published as a rich interactive page at [/blog/${cfg.slug}](/blog/${cfg.slug}).
`)
  const dl = cfg.excerpt.length
  count++
  console.log(`✓ ${cfg.slug}  (title+suffix ${cfg.title.length + 15}, excerpt ${dl}${dl < 50 || dl > 160 ? ' !!!' : ''})`)
}
console.log(`\nGenerated ${count} Elasticsearch posts.`)
