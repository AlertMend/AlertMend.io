// General rich static-post generator for Data Observability content.
// Spec-driven: supports prose, code blocks, comparison tables, step flows,
// callouts, a stat band, reusable concept diagrams, an example box, a pull
// quote, FAQ, sources, and the AlertMend CTA. Dinesh byline (net-new standard).
//
// Usage: node scripts/gen-data-rich-post.mjs <spec.json> [YYYY-MM-DD]
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import {
  AUTHOR_CRED_CSS, BLOG_SIGNUP_HANDLER_JS, CHROME_INLINE_CSS, DINESH_AUTHOR, SITE_URL,
  buildCredArticleHeader, buildNavHtml, buildSidebarHtml, calendlyUrl, dineshJsonLdAuthor,
  esc, getRelatedPosts, writeStaticBlogOutputs,
} from './static-blog-shared.mjs'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const specPath = process.argv[2]
const DATE = process.argv[3] || '2026-09-30'
const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'))

// house rule: no em dashes
const dm = (t) => String(t == null ? '' : t).replace(/\s*[—–]\s*/g, ', ').replace(/\s+,/g, ',')
const E = (t) => esc(dm(t))

const slug = spec.slug
const title = spec.title
const h1 = spec.h1
const description = dm(spec.description)
const category = 'Data Observability'
const keywords = spec.keywords
const canonical = `${SITE_URL}/blog/${slug}`
const calendly = calendlyUrl(slug)
const signupUrl = `https://app.alertmend.io/signup?service=data-observability&source=blog&blog_slug=${slug}`
const related = getRelatedPosts(slug, category)
const heroImage = `${SITE_URL}/assets/${slug}/hero.svg`
const styleHref = '/assets/exit-code-126/styles.css'
const scriptHref = '/assets/exit-code-126/script.js'
const author = { ...DINESH_AUTHOR, role: 'AI agent automation expert', credLine: '12+ years in cloud infrastructure and incident automation' }

const blogPosting = {
  '@context': 'https://schema.org', '@type': 'TechArticle', headline: title, description, image: heroImage,
  datePublished: DATE, dateModified: DATE, author: dineshJsonLdAuthor(),
  publisher: { '@type': 'Organization', name: 'AlertMend AI', logo: { '@type': 'ImageObject', url: `${SITE_URL}/logos/alertmend-logo.svg` } },
  mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
}
const faqJsonLd = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: (spec.faq || []).map((i) => ({ '@type': 'Question', name: dm(i.q), acceptedAnswer: { '@type': 'Answer', text: dm(i.a) } })) }

function authorCard() {
  return `
  <section class="authorBioCard" aria-label="About the author">
    <img src="/logos/dinesh.jpeg" alt="${E(author.name)}" width="128" height="128" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
    <div class="authorBioFallback" aria-hidden="true">DA</div>
    <div class="authorBioContent">
      <h3>${E(author.name)}</h3>
      <p class="authorBioRole">Cloud infrastructure and AI-driven incident automation</p>
      <div class="authorBioText">
        <p>${E(author.name)} brings 12+ years of deep experience across cloud infrastructure and AI-driven automation, building systems that observe, diagnose, and recover from production and data incidents without waiting for a human.</p>
        <p>At AlertMend he works on data and infrastructure observability that correlates telemetry into root cause and runs governed recovery across warehouses, pipelines, VMs, and Kubernetes.</p>
      </div>
      <a class="authorBioLink" href="${author.linkedin}" target="_blank" rel="noopener noreferrer" aria-label="${E(author.name)} on LinkedIn">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zM8.34 18V9.94H5.67V18h2.67zM7 8.76a1.55 1.55 0 1 0 0-3.1 1.55 1.55 0 0 0 0 3.1zM18.34 18v-4.42c0-2.37-1.27-3.47-2.96-3.47-1.36 0-1.97.75-2.31 1.28V9.94h-2.67V18h2.67v-4.5c0-.24.02-.48.09-.65.19-.48.63-.98 1.36-.98.96 0 1.35.73 1.35 1.8V18h2.82z"/></svg>
        <span>LinkedIn</span>
      </a>
    </div>
  </section>`
}

// ---------- reusable concept diagrams ----------
const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
// All diagrams stay inside the data-quality product truth (DATA_OBSERVABILITY_ALIGNMENT_SPEC):
// Snowflake + Oracle, policy-to-checks, cause-and-impact (never "root cause"/RCA/confidence),
// no schema-drift, no auto-remediation.
function diagramPolicyToChecks() {
  const w = 680
  const nodes = [
    { t: 'Your policy', s: 'PDF, e.g. BCBS 239', c: '#2563eb' },
    { t: 'Checks proposed', s: 'each cites its clause', c: '#7c3aed' },
    { t: 'You approve', s: 'nothing auto-goes-live', c: '#d97706' },
    { t: 'Live checks', s: 'Snowflake & Oracle', c: '#059669' },
  ]
  const boxW = 146, boxH = 66, gap = 14, y = 52
  const x0 = (w - (nodes.length * boxW + (nodes.length - 1) * gap)) / 2
  const boxes = nodes.map((n, i) => { const x = x0 + i * (boxW + gap); return `<g transform="translate(${x},${y})"><rect width="${boxW}" height="${boxH}" rx="12" fill="#fff" stroke="${n.c}" stroke-width="1.5"/><rect width="${boxW}" height="4" rx="2" fill="${n.c}"/><text x="${boxW / 2}" y="30" text-anchor="middle" font-size="13.5" font-weight="800" fill="#18181b">${n.t}</text><text x="${boxW / 2}" y="50" text-anchor="middle" font-size="10.5" fill="#71717a">${n.s}</text></g>` }).join('')
  const arrows = [0, 1, 2].map((i) => { const x1 = x0 + i * (boxW + gap) + boxW, x2 = x0 + (i + 1) * (boxW + gap); return `<line x1="${x1}" y1="${y + boxH / 2}" x2="${x2 - 4}" y2="${y + boxH / 2}" stroke="#a1a1aa" stroke-width="2" marker-end="url(#pc)"/>` }).join('')
  return `<svg viewBox="0 0 ${w} 150" width="${w}" height="150" role="img" aria-label="From policy to live checks: upload your policy, AlertMend proposes checks that each cite the clause they enforce, you approve every one, then the checks run live on Snowflake and Oracle." font-family="${FONT}"><defs><marker id="pc" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#a1a1aa"/></marker></defs><rect width="${w}" height="150" rx="14" fill="#faf9ff"/><text x="${w / 2}" y="26" text-anchor="middle" font-size="12" font-weight="800" fill="#5b21b6" letter-spacing="1">FROM POLICY TO LIVE CHECKS</text>${arrows}${boxes}</svg>`
}
function diagramCauseImpact() {
  const w = 680, cx = 40, cy = 92
  const fail = `<g transform="translate(${cx},${cy})"><rect width="150" height="66" rx="12" fill="#fef2f2" stroke="#f87171" stroke-width="1.5"/><rect width="150" height="4" rx="2" fill="#dc2626"/><text x="75" y="30" text-anchor="middle" font-size="13.5" font-weight="800" fill="#991b1b">A check fails</text><text x="75" y="50" text-anchor="middle" font-size="10.5" fill="#b91c1c">uniqueness · account_id</text></g>`
  const cause = `<g transform="translate(258,26)"><rect width="196" height="60" rx="11" fill="#fff" stroke="#e4e4e7" stroke-width="1.5"/><text x="14" y="26" font-size="12.5" font-weight="800" fill="#18181b">Cause</text><text x="14" y="46" font-size="10.5" fill="#71717a">the Airflow / Oracle ODI job that broke it</text></g>`
  const impact = `<g transform="translate(258,120)"><rect width="196" height="60" rx="11" fill="#fff" stroke="#e4e4e7" stroke-width="1.5"/><text x="14" y="26" font-size="12.5" font-weight="800" fill="#18181b">Impact</text><text x="14" y="46" font-size="10.5" fill="#71717a">the Power BI reports that read the table</text></g>`
  const alert = `<g transform="translate(508,66)"><rect width="150" height="72" rx="12" fill="#f4f2fb" stroke="#c4b5fd" stroke-width="1.5"/><text x="75" y="30" text-anchor="middle" font-size="13" font-weight="800" fill="#5b21b6">Alert</text><text x="75" y="48" text-anchor="middle" font-size="10" fill="#7c3aed">Slack / Teams, with the</text><text x="75" y="62" text-anchor="middle" font-size="10" fill="#7c3aed">policy clause it enforces</text></g>`
  const arrows = `<line x1="190" y1="${cy + 20}" x2="254" y2="66" stroke="#a1a1aa" stroke-width="2" marker-end="url(#ci)"/><line x1="190" y1="${cy + 46}" x2="254" y2="150" stroke="#a1a1aa" stroke-width="2" marker-end="url(#ci)"/><line x1="454" y1="56" x2="504" y2="92" stroke="#a1a1aa" stroke-width="2" marker-end="url(#ci)"/><line x1="454" y1="150" x2="504" y2="112" stroke="#a1a1aa" stroke-width="2" marker-end="url(#ci)"/>`
  return `<svg viewBox="0 0 ${w} 206" width="${w}" height="206" role="img" aria-label="Cause and impact: when a check fails, AlertMend names the Airflow or Oracle ODI job that caused it and the Power BI reports it affects, then alerts Slack or Teams with the policy clause the check enforces." font-family="${FONT}"><defs><marker id="ci" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#a1a1aa"/></marker></defs><rect width="${w}" height="206" rx="14" fill="#fbfbfd"/><text x="${w / 2}" y="18" text-anchor="middle" font-size="12" font-weight="800" fill="#5b21b6" letter-spacing="1">CAUSE AND IMPACT, NOT JUST AN ALERT</text>${arrows}${fail}${cause}${impact}${alert}</svg>`
}
function diagramCheckCatalog() {
  const chips = ['Completeness', 'Uniqueness', 'Validity', 'Format', 'Referential integrity', 'Numeric range', 'Volume', 'Freshness', 'Anomaly (z-score)', 'Trend']
  const w = 680, perRow = 5, cw = 122, ch = 40, gapX = 12, gapY = 12
  const x0 = (w - (perRow * cw + (perRow - 1) * gapX)) / 2, y0 = 52
  const cards = chips.map((t, i) => { const r = Math.floor(i / perRow), c = i % perRow; const x = x0 + c * (cw + gapX), y = y0 + r * (ch + gapY); return `<g transform="translate(${x},${y})"><rect width="${cw}" height="${ch}" rx="9" fill="#fff" stroke="#e4e4e7"/><circle cx="15" cy="${ch / 2}" r="4" fill="#7c3aed"/><text x="26" y="${ch / 2 + 4}" font-size="10.5" font-weight="700" fill="#27272a">${t}</text></g>` }).join('')
  return `<svg viewBox="0 0 ${w} 170" width="${w}" height="170" role="img" aria-label="The 87-check catalog spans completeness, uniqueness, validity, format, referential integrity, numeric range, volume, freshness, anomaly (z-score) and trend checks." font-family="${FONT}"><rect width="${w}" height="170" rx="14" fill="#faf9ff"/><text x="${w / 2}" y="30" text-anchor="middle" font-size="12" font-weight="800" fill="#5b21b6" letter-spacing="1">87 READY-MADE CHECKS, NO SQL NEEDED</text>${cards}</svg>`
}
function diagramDataFlow() {
  const w = 680
  const nodes = [
    { t: 'Sources', s: 'apps, systems' },
    { t: 'Ingest', s: 'Airflow / ODI' },
    { t: 'Snowflake / Oracle', s: 'the tables' },
    { t: 'Power BI', s: 'reports' },
  ]
  const boxW = 138, boxH = 60, gap = 20, y = 74
  const x0 = (w - (nodes.length * boxW + (nodes.length - 1) * gap)) / 2
  const boxes = nodes.map((n, i) => { const x = x0 + i * (boxW + gap); const broke = i === 2; return `<g transform="translate(${x},${y})"><rect width="${boxW}" height="${boxH}" rx="11" fill="${broke ? '#fef2f2' : '#fff'}" stroke="${broke ? '#f87171' : '#e4e4e7'}" stroke-width="1.5"/><text x="${boxW / 2}" y="27" text-anchor="middle" font-size="12.5" font-weight="800" fill="${broke ? '#991b1b' : '#18181b'}">${n.t}</text><text x="${boxW / 2}" y="45" text-anchor="middle" font-size="10" fill="${broke ? '#b91c1c' : '#71717a'}">${n.s}</text></g>` }).join('')
  const arrows = [0, 1, 2].map((i) => { const x1 = x0 + i * (boxW + gap) + boxW, x2 = x0 + (i + 1) * (boxW + gap); return `<line x1="${x1}" y1="${y + boxH / 2}" x2="${x2 - 4}" y2="${y + boxH / 2}" stroke="#a1a1aa" stroke-width="2" marker-end="url(#df)"/>` }).join('')
  const bx = x0 + 2 * (boxW + gap) + boxW / 2
  const impact = `<path d="M ${bx} ${y} L ${bx} ${y - 26} L ${x0 + 3 * (boxW + gap) + boxW / 2} ${y - 26} L ${x0 + 3 * (boxW + gap) + boxW / 2} ${y - 4}" fill="none" stroke="#f87171" stroke-width="2" stroke-dasharray="5 4" marker-end="url(#dfr)"/><text x="${w / 2}" y="${y - 32}" text-anchor="middle" font-size="10.5" fill="#b91c1c" font-weight="700">a bad table here shows up in every report that reads it</text>`
  return `<svg viewBox="0 0 ${w} 170" width="${w}" height="170" role="img" aria-label="Data flows from sources through Airflow or ODI ingest into Snowflake or Oracle, then into Power BI reports. A bad table in the warehouse reaches every report that reads it." font-family="${FONT}"><defs><marker id="df" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#a1a1aa"/></marker><marker id="dfr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#f87171"/></marker></defs><rect width="${w}" height="170" rx="14" fill="#fbfbfd"/>${impact}${arrows}${boxes}</svg>`
}
const DIAGRAMS = { policyToChecks: diagramPolicyToChecks, causeImpact: diagramCauseImpact, checkCatalog: diagramCheckCatalog, dataFlow: diagramDataFlow }
function diagramHtml() {
  const d = spec.diagram
  if (!d || !DIAGRAMS[d.kind]) return ''
  return `<figure class="conceptFig">${DIAGRAMS[d.kind]()}${d.caption ? `<figcaption>${E(d.caption)}</figcaption>` : ''}</figure>`
}

// ---------- scannable helpers ----------
function statBandHtml() {
  const s = spec.stats
  if (!s || !s.length) return ''
  const cls = s.length === 2 ? ' statBand2' : ''
  return `<div class="statBand${cls}">${s.map((x) => `<div class="statCard"><div class="big">${esc(x.big)}</div><div class="lbl">${E(x.lbl)}</div>${x.src ? `<div class="src">${E(x.src)}</div>` : ''}</div>`).join('')}</div>`
}
function exampleBoxHtml() {
  const ex = spec.example
  if (!ex) return ''
  return `<div class="exampleBox"><div class="exHead">In practice: ${E(ex.title)}</div><div class="exBody">${(ex.scenario || []).map((p) => `<p>${E(p)}</p>`).join('')}${ex.lesson ? `<p class="exLesson">${E(ex.lesson)}</p>` : ''}</div></div>`
}
function pullQuoteHtml() {
  const q = spec.quote
  if (!q) return ''
  return `<figure class="pullQuote"><p>${E(q.text)}</p>${q.attrib ? `<figcaption class="attrib">${E(q.attrib)}</figcaption>` : ''}</figure>`
}
function audienceBlock() {
  const a = spec.audience
  if (!a || !a.length) return ''
  return `<div class="audienceCard"><div class="audHead">You are in the right place if</div><ul>${a.map((x) => `<li>${E(x)}</li>`).join('')}</ul></div>`
}

// ---------- block renderers ----------
let codeCount = 0
function renderBlock(b) {
  if (!b || !b.type) return ''
  if (b.type === 'prose') {
    return `${(b.paragraphs || []).map((p) => `<p class="bodyText">${E(p)}</p>`).join('')}${(b.bullets && b.bullets.length) ? `<ul class="sourceList">${b.bullets.map((x) => `<li>${E(x)}</li>`).join('')}</ul>` : ''}`
  }
  if (b.type === 'code') {
    const id = `code${++codeCount}`
    const label = b.label || (b.language ? String(b.language).toUpperCase() : 'CODE')
    return `<figure class="codeCard"><figcaption class="codeHead"><span>${E(label)}</span><button type="button" class="codeCopy" data-copy="${id}">Copy</button></figcaption><pre id="${id}"><code>${esc(dm(b.code))}</code></pre></figure>`
  }
  if (b.type === 'table') {
    const headers = b.headers || []
    const rows = b.rows || []
    return `<figure class="cmpWrap"><table class="cmpTable"><thead><tr>${headers.map((h) => `<th>${E(h)}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c, i) => `<td${i === 0 ? ' class="cmpRowHead"' : ''}>${E(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>${b.caption ? `<figcaption>${E(b.caption)}</figcaption>` : ''}</figure>`
  }
  if (b.type === 'steps') {
    return `<ol class="stepFlow">${(b.steps || []).map((s) => `<li><div class="stepTitle">${E(s.title)}</div><div class="stepBody">${E(s.body)}</div></li>`).join('')}</ol>`
  }
  if (b.type === 'callout') {
    const tone = ['info', 'warn', 'good'].includes(b.tone) ? b.tone : 'info'
    return `<div class="noteCard note-${tone}">${b.title ? `<div class="noteTitle">${E(b.title)}</div>` : ''}<p>${E(b.body)}</p></div>`
  }
  return ''
}
function renderSection(s) {
  const blocks = s.blocks && s.blocks.length ? s.blocks : [{ type: 'prose', paragraphs: s.paragraphs || [], bullets: s.bullets || [] }]
  return `
  <section class="sectionBlock" id="${esc(s.id)}">
    <h2 class="sectionTitle">${E(s.heading)}</h2>
    ${blocks.map(renderBlock).join('\n    ')}
  </section>`
}

// interleave the scannable visuals after the first sections
const _secs = (spec.sections || []).map(renderSection)
const _parts = []
_secs.forEach((hSec, i) => {
  _parts.push(hSec)
  if (i === 0) _parts.push(diagramHtml())
  if (i === 1) _parts.push(exampleBoxHtml())
  if (i === 2) _parts.push(pullQuoteHtml())
})
const sectionsHtml = _parts.join('')

const tocPills = [
  ...(spec.sections || []).slice(0, 4).map((s) => `<a href="#${esc(s.id)}">${E(s.heading.split(':')[0].split(',')[0].slice(0, 24))}</a>`),
  `<a href="#alertmend">Where AlertMend fits</a>`,
  `<a href="#faq">FAQ</a>`,
].filter(Boolean).join('\n    ')

const eyebrow = spec.eyebrow || 'The short answer'
const proofLine = spec.proofLine || 'Every external stat cited to a named source; every check names an owner and a first action'
const alertmentFitParas = dm(spec.alertmendAngle || '').split(/\n+/).filter(Boolean)

const content = `
${buildCredArticleHeader(h1, DATE, category, author)}
<div class="proofStrip" aria-label="Article verification">
  <strong>✓ ${E(proofLine)}</strong>
  <span class="dot">•</span>
  <span>Last reviewed ${DATE}</span>
</div>

<article class="ec126 rich">
  <section class="answerPanel" id="answer">
    <div class="buyerLead">
      <span class="eyebrow">${E(eyebrow)}</span>
      <h2>${E(spec.answerHeadline)}</h2>
      <p>${E(spec.answerBody)}</p>
    </div>
  </section>

  ${audienceBlock()}

  ${statBandHtml()}

  <nav class="tocPills" aria-label="On this page">
    ${tocPills}
  </nav>

  ${sectionsHtml}

  <section class="sectionBlock" id="alertmend">
    <h2 class="sectionTitle">Where AlertMend fits</h2>
    ${alertmentFitParas.map((p) => `<p class="bodyText">${E(p)}</p>`).join('')}
  </section>

  ${(spec.sources && spec.sources.length) ? `
  <section class="sectionBlock" id="sources">
    <h2 class="sectionTitle">Sources</h2>
    <ol class="sourceList">
      ${spec.sources.map((s) => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${E(s.title)}</a></li>`).join('')}
    </ol>
  </section>` : ''}

  <section class="sectionBlock" id="faq">
    <h2 class="sectionTitle">FAQ</h2>
    <div class="faqList">
    ${(spec.faq || []).map((item, index) => `
      <div class="faqItem">
        <button type="button" class="faqQuestion" data-faq-toggle aria-expanded="${index === 0 ? 'true' : 'false'}">
          ${E(item.q)}
          <svg class="faqChevron${index === 0 ? ' faqChevronOpen' : ''}" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
        </button>
        <div class="faqAnswer${index === 0 ? '' : ' hidden'}">${E(item.a)}</div>
      </div>`).join('')}
    </div>
  </section>

  <section class="ctaBox">
    <h2>${E(spec.ctaHeadline || 'See your policy turned into checks.')}</h2>
    <p>AlertMend turns your data quality policy into live checks on Snowflake and Oracle, through a read-only agent inside your network. When a check fails, it names the Airflow or Oracle ODI job that caused it and the Power BI reports it affects, and every check cites the policy clause it enforces.</p>
    <div class="ctaButtons">
      <a class="ctaButton ctaButtonPrimary" href="${signupUrl}" target="_blank" rel="noopener noreferrer">Start free</a>
      <a class="ctaButton ctaButtonSecondary" href="${calendly}" target="_blank" rel="noopener noreferrer">Book the data demo</a>
    </div>
  </section>
  ${authorCard()}
</article>`

const extraCss = `
.buyerLead{background:var(--am-surface,#fff);border:1px solid #e4e4e7;border-left:4px solid #7c3aed;border-radius:14px;padding:1.4rem 1.5rem;box-shadow:0 8px 28px rgba(9,9,11,.05);}
.buyerLead .eyebrow{display:block;color:#7c3aed;font-size:.68rem;font-weight:800;letter-spacing:.09em;text-transform:uppercase;margin-bottom:.5rem;}
.buyerLead h2{font-size:1.3rem;line-height:1.35;color:#18181b;margin:0 0 .6rem;}
.buyerLead p{margin:0;color:#3f3f46;font-size:.98rem;line-height:1.7;}
.sourceList li{margin:.35rem 0;line-height:1.6;}
/* audience block */
.audienceCard{margin:1.4rem 0;padding:1.1rem 1.4rem;border:1px solid #e9e5f2;border-radius:14px;background:#faf9ff;}
.audienceCard .audHead{font-size:.72rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#7c3aed;margin-bottom:.6rem;}
.audienceCard ul{margin:0;padding-left:1.15rem;}
.audienceCard li{margin:.3rem 0;color:#3f3f46;line-height:1.6;font-size:.95rem;}
/* stat band */
.statBand{display:grid;grid-template-columns:1fr;gap:12px;margin:1.6rem 0;}
@media(min-width:640px){.statBand{grid-template-columns:repeat(3,1fr);}.statBand2{grid-template-columns:repeat(2,1fr);}}
.statCard{background:#fff;border:1px solid #e4e4e7;border-top:3px solid #7c3aed;border-radius:14px;padding:18px 18px 16px;}
.statCard .big{font-size:2.3rem;font-weight:800;color:#7c3aed;line-height:1;font-variant-numeric:tabular-nums;}
.statCard .lbl{font-size:.88rem;color:#3f3f46;margin:.55rem 0 .5rem;line-height:1.45;}
.statCard .src{font-size:.68rem;color:#a1a1aa;text-transform:uppercase;letter-spacing:.05em;font-weight:800;}
/* concept graphic */
.conceptFig{margin:1.7rem 0;}
.conceptFig svg{display:block;width:100%;height:auto;border:1px solid #e9e5f2;border-radius:14px;}
.conceptFig figcaption{margin-top:.6rem;font-size:.82rem;color:#71717a;text-align:center;line-height:1.5;}
/* example */
.exampleBox{margin:1.7rem 0;border:1px solid #e4e4e7;border-radius:14px;overflow:hidden;background:#fff;box-shadow:0 6px 22px rgba(9,9,11,.04);}
.exampleBox .exHead{background:#f4f2fb;padding:.75rem 1.3rem;font-weight:800;color:#5b21b6;font-size:.95rem;border-bottom:1px solid #ece7f7;}
.exampleBox .exBody{padding:1.05rem 1.3rem;}
.exampleBox .exBody p{margin:0 0 .65rem;color:#3f3f46;line-height:1.7;font-size:.95rem;}
.exampleBox .exLesson{color:#18181b;font-weight:600;font-size:.93rem;border-top:1px dashed #e4e4e7;padding-top:.7rem;margin-top:.3rem;}
/* pull quote */
.pullQuote{margin:1.9rem 0;padding:1.2rem 1.6rem;border-left:4px solid #7c3aed;background:#faf8ff;border-radius:0 12px 12px 0;}
.pullQuote p{font-family:Georgia,'Times New Roman',serif;font-size:1.3rem;line-height:1.5;color:#27272a;margin:0;font-style:italic;}
.pullQuote .attrib{display:block;margin-top:.65rem;font-size:.82rem;color:#71717a;font-style:normal;font-weight:600;}
/* code card */
.codeCard{margin:1.3rem 0;border:1px solid #e4e4e7;border-radius:12px;overflow:hidden;background:#0f172a;}
.codeCard .codeHead{display:flex;align-items:center;justify-content:space-between;padding:.5rem .9rem;background:#111827;border-bottom:1px solid #1f2937;}
.codeCard .codeHead span{font-size:.7rem;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:#93c5fd;}
.codeCard .codeCopy{font-size:.72rem;font-weight:700;color:#cbd5e1;background:#1f2937;border:1px solid #334155;border-radius:6px;padding:.2rem .6rem;cursor:pointer;}
.codeCard .codeCopy:hover{background:#334155;color:#fff;}
.codeCard pre{margin:0;padding:1rem 1.1rem;overflow-x:auto;background:#0f172a;}
.codeCard code{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:.82rem;line-height:1.6;color:#e2e8f0;white-space:pre;}
/* comparison table */
.cmpWrap{margin:1.5rem 0;overflow-x:auto;border:1px solid #e4e4e7;border-radius:12px;}
.cmpTable{border-collapse:collapse;width:100%;min-width:540px;font-size:.9rem;}
.cmpTable th,.cmpTable td{text-align:left;padding:.7rem .9rem;border-bottom:1px solid #eee;vertical-align:top;line-height:1.5;}
.cmpTable thead th{background:#faf8ff;color:#5b21b6;font-weight:800;font-size:.78rem;text-transform:uppercase;letter-spacing:.03em;border-bottom:2px solid #ece7f7;}
.cmpTable tbody tr:last-child td{border-bottom:none;}
.cmpTable .cmpRowHead{font-weight:700;color:#18181b;}
/* step flow */
.stepFlow{list-style:none;counter-reset:sf;margin:1.4rem 0;padding:0;}
.stepFlow li{counter-increment:sf;position:relative;padding:.2rem 0 1.1rem 3rem;border-left:2px solid #ece7f7;margin-left:1rem;}
.stepFlow li:last-child{border-left-color:transparent;}
.stepFlow li::before{content:counter(sf);position:absolute;left:-1rem;top:-2px;width:2rem;height:2rem;border-radius:50%;background:#7c3aed;color:#fff;font-weight:800;font-size:.9rem;display:flex;align-items:center;justify-content:center;}
.stepFlow .stepTitle{font-weight:700;color:#18181b;margin-bottom:.2rem;}
.stepFlow .stepBody{color:#3f3f46;font-size:.93rem;line-height:1.65;}
/* callout */
.noteCard{margin:1.3rem 0;padding:1rem 1.2rem;border-radius:12px;border:1px solid #e4e4e7;background:#fbfbfd;}
.noteCard .noteTitle{font-weight:800;margin-bottom:.35rem;font-size:.92rem;}
.noteCard p{margin:0;color:#3f3f46;line-height:1.7;font-size:.94rem;}
.note-info{border-left:4px solid #2563eb;background:#eff6ff;} .note-info .noteTitle{color:#1e40af;}
.note-warn{border-left:4px solid #d97706;background:#fffbeb;} .note-warn .noteTitle{color:#92400e;}
.note-good{border-left:4px solid #059669;background:#ecfdf5;} .note-good .noteTitle{color:#065f46;}
`

const widgetJs = `
<script>
(function(){
  document.querySelectorAll('.codeCopy').forEach(function(btn){
    btn.addEventListener('click', function(){
      var pre = document.getElementById(btn.getAttribute('data-copy'));
      if(!pre) return;
      var txt = pre.innerText || pre.textContent || '';
      var done = function(){ var o = btn.textContent; btn.textContent='Copied'; setTimeout(function(){ btn.textContent=o; }, 1400); };
      if(navigator.clipboard && navigator.clipboard.writeText){ navigator.clipboard.writeText(txt).then(done).catch(done); }
      else { try{ var ta=document.createElement('textarea'); ta.value=txt; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); done(); }catch(e){} }
    });
  });
})();
</script>`

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)} | AlertMend AI</title>
  <meta name="description" content="${esc(description)}">
  <meta name="keywords" content="${esc(keywords)}">
  <meta name="author" content="${esc(author.name)}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
  <link rel="canonical" href="${canonical}">
  <link rel="icon" type="image/svg+xml" href="/logos/alertmend-logo.svg">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${canonical}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:image" content="${heroImage}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${heroImage}">
  <script type="application/ld+json">${JSON.stringify(blogPosting)}</script>
  <script type="application/ld+json">${JSON.stringify(faqJsonLd)}</script>
  <link rel="stylesheet" href="${styleHref}">
  <style>${CHROME_INLINE_CSS}${AUTHOR_CRED_CSS}${extraCss}</style>
</head>
<body>
${buildNavHtml(slug, calendly)}
  <div class="main-container">
    <div class="content-wrapper">
      <div class="main-col">
        ${content}
      </div>
      ${buildSidebarHtml(related, title)}
    </div>
  </div>
  <script src="${scriptHref}"></script>
  <script>${BLOG_SIGNUP_HANDLER_JS}</script>
  ${widgetJs}
</body>
</html>`

const heroSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630" font-family="${FONT}"><defs><linearGradient id="hg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0e0b1e"/><stop offset="1" stop-color="#2a1163"/></linearGradient></defs><rect width="1200" height="630" fill="url(#hg)"/><g transform="translate(80,80)"><circle cx="22" cy="22" r="22" fill="#7c3aed"/><text x="22" y="30" font-size="22" font-weight="800" fill="#fff" text-anchor="middle">A</text><text x="56" y="30" font-size="24" font-weight="700" fill="#fff">AlertMend</text><text x="228" y="30" font-size="18" fill="#b9a7e6">· data observability</text></g><text x="80" y="250" font-size="50" font-weight="800" fill="#fff">${esc(h1.slice(0, 36))}</text><text x="80" y="312" font-size="26" font-weight="700" fill="#a78bfa">${esc((spec.heroSub || 'Freshness, volume, schema, quality, lineage.').slice(0, 44))}</text><text x="80" y="566" font-size="19" fill="#b9a7e6">alertmend.io · for data leaders and stewards</text></svg>\n`

const assetDir = path.join(root, 'public/assets', slug)
fs.mkdirSync(assetDir, { recursive: true })
fs.writeFileSync(path.join(assetDir, 'hero.svg'), heroSvg)

fs.writeFileSync(path.join(root, 'public/blog', `${slug}.md`), `---
title: "${title}"
excerpt: "${description}"
date: "${DATE}"
dateModified: "${DATE}"
category: "${category}"
author: "${author.name}"
keywords: "${keywords}"
---

This post is published as a standalone page at [/blog/${slug}](/blog/${slug}).
`)

writeStaticBlogOutputs(slug, html)
const tl = title.length + 15
const nBlocks = (spec.sections || []).reduce((a, s) => a + ((s.blocks || []).length || 1), 0)
console.log(`✓ ${slug}  title+suffix ${tl}${tl < 30 || tl > 60 ? ' [LEN!]' : ''}  desc ${description.length}${description.length < 50 || description.length > 160 ? ' [DESC!]' : ''}  sections ${(spec.sections || []).length}  blocks ${nBlocks}  code ${codeCount}  faqs ${(spec.faq || []).length}  diagram ${spec.diagram ? spec.diagram.kind : 'none'}  em-dashes ${(html.match(/—/g) || []).length}`)
