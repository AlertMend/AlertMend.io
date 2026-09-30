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

const TITLE_OVERRIDE = {
  'cost-of-bad-data-roi-calculator': 'The Cost of Bad Data: ROI Calculator',
  'ai-ready-data-checklist': 'AI-Ready Data: a CDO Checklist',
}
const slug = spec.slug
const title = TITLE_OVERRIDE[slug] || spec.title
const h1 = spec.h1
const description = dm(spec.description)
const category = 'Data Observability'
const keywords = spec.keywords
const canonical = `${SITE_URL}/blog/${slug}`
const calendly = calendlyUrl(slug)
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

// interactive widget
const I = spec.interactive || {}
function interactiveHtml() {
  if (I.kind === 'calculator') {
    return `
    <div class="calc" id="calcForm">
      <div class="calcHead">${E(I.title)}</div>
      ${(I.inputs || []).map((inp) => `<div class="calcRow"><label>${E(inp.label)} <span><output id="val-${esc(inp.id)}">${inp.def}</output>${inp.unit ? ' ' + E(inp.unit) : ''}</span></label><input type="range" id="in-${esc(inp.id)}" min="${inp.min}" max="${inp.max}" value="${inp.def}" aria-label="${E(inp.label)}"></div>`).join('')}
      <div class="calcOut">
        ${(I.outputs || []).map((o) => `<div class="calcStat"><span id="out-${esc(o.id)}">--</span><label>${E(o.label)}</label></div>`).join('')}
      </div>
      <p class="calcNote">${E(I.notes)}</p>
    </div>`
  }
  if (I.kind === 'checklist') {
    return `
    <div class="checklist" id="checklist">
      <div class="calcHead">${E(I.title)}</div>
      ${(I.items || []).map((it, i) => `<label class="clItem"><input type="checkbox" id="cl-${i}"><span>${E(it)}</span></label>`).join('')}
      <div class="clResult">
        <div class="clScoreWrap"><span class="clScore" id="clScore">0 / ${(I.items || []).length}</span><span class="clPctBadge" id="clPct">0%</span></div>
        <div class="clBarTrack"><div class="clBar" id="clBar"></div></div>
        <div class="clBand bad" id="clBand">Check the statements that are true for your most important AI initiative.</div>
      </div>
      <p class="calcNote">${E(I.notes)}</p>
    </div>`
  }
  return ''
}

// ---- relatable visuals for a non-technical buyer audience ----
const ICEBERG_SVG = `<svg viewBox="0 0 680 340" width="680" height="340" role="img" aria-label="An iceberg. The small visible tip above the waterline is the incident you see, a broken dashboard. The much larger mass below is the cost you do not see: analyst firefighting hours, decisions made on wrong numbers, missed SLAs and rework, and eroded trust." font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"><rect x="0" y="0" width="680" height="340" rx="14" fill="#eff6ff"/><rect x="0" y="134" width="680" height="206" fill="#dbeafe"/><line x1="0" y1="134" x2="680" y2="134" stroke="#60a5fa" stroke-width="2" stroke-dasharray="7 5"/><text x="664" y="127" text-anchor="end" font-size="11" font-weight="700" fill="#2563eb" letter-spacing="1">WATERLINE</text><polygon points="340,44 302,134 378,134" fill="#ffffff" stroke="#bfdbfe" stroke-width="1.5"/><polygon points="302,134 378,134 476,318 204,318" fill="#bfdbfe" stroke="#93c5fd" stroke-width="1.5"/><text x="340" y="92" text-anchor="middle" font-size="13" font-weight="800" fill="#1e3a8a">The incident</text><text x="340" y="110" text-anchor="middle" font-size="11" fill="#2563eb">you see</text><text x="340" y="192" text-anchor="middle" font-size="13" font-weight="800" fill="#1e3a8a">The cost you don't</text><text x="340" y="222" text-anchor="middle" font-size="11.5" fill="#1e40af">analyst firefighting hours</text><text x="340" y="244" text-anchor="middle" font-size="11.5" fill="#1e40af">decisions made on wrong numbers</text><text x="340" y="266" text-anchor="middle" font-size="11.5" fill="#1e40af">missed SLAs and rework</text><text x="340" y="288" text-anchor="middle" font-size="11.5" fill="#1e40af">eroded trust in the data</text></svg>`
const TWOPATH_SVG = `<svg viewBox="0 0 680 300" width="680" height="300" role="img" aria-label="Your source data flows into an AI or agent that amplifies it. Good data produces trustworthy answers. Bad data produces fast, confident, wrong answers at scale, with no human to catch them." font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"><defs><marker id="ar" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#a5b4fc"/></marker><marker id="arg" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#4ade80"/></marker><marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#f87171"/></marker></defs><rect x="0" y="0" width="680" height="300" rx="14" fill="#faf9ff"/><rect x="26" y="118" width="150" height="64" rx="11" fill="#eef2ff" stroke="#c7d2fe" stroke-width="1.5"/><text x="101" y="145" text-anchor="middle" font-size="13" font-weight="700" fill="#3730a3">Your source</text><text x="101" y="163" text-anchor="middle" font-size="13" font-weight="700" fill="#3730a3">data</text><line x1="176" y1="150" x2="246" y2="150" stroke="#a5b4fc" stroke-width="2.5" marker-end="url(#ar)"/><rect x="250" y="106" width="128" height="88" rx="13" fill="#ede9fe" stroke="#c4b5fd" stroke-width="1.5"/><text x="314" y="144" text-anchor="middle" font-size="15" font-weight="800" fill="#6d28d9">AI / agent</text><text x="314" y="166" text-anchor="middle" font-size="11" fill="#7c3aed">the amplifier</text><line x1="378" y1="132" x2="468" y2="86" stroke="#4ade80" stroke-width="2.5" marker-end="url(#arg)"/><line x1="378" y1="168" x2="468" y2="222" stroke="#f87171" stroke-width="2.5" marker-end="url(#arr)"/><rect x="472" y="52" width="184" height="62" rx="11" fill="#dcfce7" stroke="#86efac" stroke-width="1.5"/><text x="564" y="80" text-anchor="middle" font-size="12.5" font-weight="800" fill="#166534">Trustworthy answers</text><text x="564" y="99" text-anchor="middle" font-size="10.5" fill="#15803d">the AI you were promised</text><rect x="472" y="196" width="184" height="72" rx="11" fill="#fee2e2" stroke="#fca5a5" stroke-width="1.5"/><text x="564" y="222" text-anchor="middle" font-size="12.5" font-weight="800" fill="#991b1b">Fast, confident, wrong</text><text x="564" y="240" text-anchor="middle" font-size="10.5" fill="#b91c1c">at scale, no human to catch it</text></svg>`

const VISUALS = {
  'cost-of-bad-data-roi-calculator': {
    stats: [
      { big: '$12.9M', lbl: 'average annual cost of poor data quality', src: 'Gartner' },
      { big: '~61', lbl: 'data incidents per month at the average organization', src: 'Monte Carlo, 2022' },
      { big: '40%', lbl: 'of a data team time spent firefighting data quality', src: 'Monte Carlo, 2022' },
    ],
    quote: { text: 'A CFO does not fund a data quality program because a report is alarming. They fund it when you hand them a number finance can defend.', attrib: '' },
    example: { title: 'How a duplicated load became a hiring decision', scenario: [
      'A retailer revenue dashboard showed 38% month-over-month growth. Leadership greenlit a warehouse hire and a bigger ad budget on the strength of it.',
      'Two weeks later a data engineer found the overnight job had run twice. Half the "growth" was duplicated rows. Real growth was about 6%.',
    ], lesson: 'The cost was not the five-minute SQL fix. It was the decision made on a number nobody had checked.' },
    graphic: { svg: ICEBERG_SVG, caption: 'The broken dashboard is the tip. The real cost is everything under the waterline.' },
  },
  'ai-ready-data-checklist': {
    stats: [
      { big: '60%', lbl: 'of AI projects abandoned by 2026 without AI-ready data', src: 'Gartner' },
      { big: '63%', lbl: 'of organizations lack, or are unsure of, AI-ready data practices', src: 'Gartner, 2025' },
      { big: '71%', lbl: 'of data pros worry about hallucinated outputs reaching stakeholders', src: 'dbt Labs, 2026' },
    ],
    quote: { text: 'AI does not fix bad data. It scales it, into fast, confident, wrong answers that reach a customer with no human in the loop.', attrib: '' },
    example: { title: 'The confident wrong answer', scenario: [
      'A support AI read a product table where the "discontinued" flag had quietly stopped updating. It told customers a discontinued item was "in stock, ships in two days."',
      'No error. No alert. Just a fluent, wrong answer, at scale, for three weeks.',
    ], lesson: 'A human glancing at a dashboard might have paused. The agent did not, because nothing looked broken.' },
    graphic: { svg: TWOPATH_SVG, caption: 'Whatever your source data is, AI amplifies it. Clean in, trustworthy out. Wrong in, confidently wrong out.' },
  },
}
const V = VISUALS[slug] || {}

function statBandHtml() { return V.stats ? `<div class="statBand">${V.stats.map((s) => `<div class="statCard"><div class="big">${esc(s.big)}</div><div class="lbl">${E(s.lbl)}</div><div class="src">${E(s.src)}</div></div>`).join('')}</div>` : '' }
function conceptFigHtml() { return V.graphic ? `<figure class="conceptFig">${V.graphic.svg}<figcaption>${E(V.graphic.caption)}</figcaption></figure>` : '' }
function exampleBoxHtml() { return V.example ? `<div class="exampleBox"><div class="exHead">In practice: ${E(V.example.title)}</div><div class="exBody">${V.example.scenario.map((p) => `<p>${E(p)}</p>`).join('')}<p class="exLesson">${E(V.example.lesson)}</p></div></div>` : '' }
function pullQuoteHtml() { return V.quote ? `<figure class="pullQuote"><p>${E(V.quote.text)}</p>${V.quote.attrib ? `<figcaption class="attrib">${E(V.quote.attrib)}</figcaption>` : ''}</figure>` : '' }

function renderSection(s) {
  return `
  <section class="sectionBlock" id="${esc(s.id)}">
    <h2 class="sectionTitle">${E(s.heading)}</h2>
    ${(s.paragraphs || []).map((p) => `<p class="bodyText">${E(p)}</p>`).join('')}
    ${(s.bullets && s.bullets.length) ? `<ul class="sourceList">${s.bullets.map((b) => `<li>${E(b)}</li>`).join('')}</ul>` : ''}
  </section>`
}
// interleave the visuals so the page is scannable, not a wall of text
const _secs = (spec.sections || []).map(renderSection)
const _parts = []
_secs.forEach((hSec, i) => {
  _parts.push(hSec)
  if (i === 0) _parts.push(conceptFigHtml())
  if (i === 1) _parts.push(exampleBoxHtml())
  if (i === 2) _parts.push(pullQuoteHtml())
})
const sectionsHtml = _parts.join('')

const interactiveAnchor = I.kind === 'calculator' ? 'calculator' : (I.kind === 'checklist' ? 'assessment' : '')
const tocPills = [
  ...(spec.sections || []).slice(0, 4).map((s) => `<a href="#${esc(s.id)}">${E(s.heading.split(':')[0].split(',')[0].slice(0, 22))}</a>`),
  interactiveAnchor ? `<a href="#${interactiveAnchor}">${I.kind === 'calculator' ? 'Calculator' : 'Self-assessment'}</a>` : '',
  `<a href="#alertmend">Where AlertMend fits</a>`,
  `<a href="#faq">FAQ</a>`,
].filter(Boolean).join('\n    ')

const content = `
${buildCredArticleHeader(h1, DATE, category, author)}
<div class="proofStrip" aria-label="Article verification">
  <strong>✓ Every stat cited to a named source; the ${I.kind === 'calculator' ? 'calculator uses transparent, defensible math' : 'checklist is scoped to source-table readiness'}</strong>
  <span class="dot">•</span>
  <span>Last reviewed ${DATE}</span>
</div>

<article class="ec126 buyer">
  <section class="answerPanel" id="answer">
    <div class="buyerLead">
      <span class="eyebrow">${I.kind === 'calculator' ? 'The CFO version' : 'The CDO version'}</span>
      <h2>${E(spec.answerHeadline)}</h2>
      <p>${E(spec.answerBody)}</p>
    </div>
  </section>

  ${statBandHtml()}

  <nav class="tocPills" aria-label="On this page">
    ${tocPills}
  </nav>

  ${sectionsHtml}

  ${interactiveAnchor ? `
  <section class="sectionBlock" id="${interactiveAnchor}">
    <h2 class="sectionTitle">${I.kind === 'calculator' ? 'Run the numbers' : 'The self-assessment'}</h2>
    ${interactiveHtml()}
  </section>` : ''}

  <section class="sectionBlock" id="alertmend">
    <h2 class="sectionTitle">Where AlertMend fits</h2>
    ${dm(spec.alertmendAngle).split(/\n+/).filter(Boolean).map((p) => `<p class="bodyText">${E(p)}</p>`).join('')}
    <div class="automationCta">
      <p><strong>Want a second set of eyes on the source tables behind your data and AI?</strong> We will map the five pillars to your stack and show what evidence-backed root cause looks like on a table that keeps breaking.</p>
      <a class="ctaButton ctaButtonPrimary" href="${calendly}&intent=data-observability" target="_blank" rel="noopener noreferrer">Book a free consultation &rarr;</a>
    </div>
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
    <h2>${I.kind === 'calculator' ? 'Pressure-test your number against a real pipeline.' : 'Enforce the checklist, do not re-run it by hand.'}</h2>
    <p>AlertMend watches your warehouse across freshness, volume, schema, quality, and lineage, gives evidence-backed root cause when a check fires, and routes a recommend-first fix, in one workspace that also watches the infrastructure beneath your pipelines.</p>
    <div class="ctaButtons">
      <a class="ctaButton ctaButtonPrimary" href="${calendly}" target="_blank" rel="noopener noreferrer">Book a free consultation</a>
      <a class="ctaButton ctaButtonSecondary" href="/blog/bigquery-data-quality-checks">The SQL monitors &rarr;</a>
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
/* calculator */
.calc{margin:.5rem 0;padding:20px;border:1px solid #e4e4e7;border-radius:14px;background:linear-gradient(180deg,#faf8ff,#f1ecfd);}
.calcHead{font-weight:800;color:#18181b;margin-bottom:1rem;font-size:1.08rem;}
.calcRow{display:grid;grid-template-columns:1fr;gap:5px;margin:.8rem 0;}
.calcRow label{font-size:.88rem;color:#3f3f46;font-weight:600;display:flex;justify-content:space-between;gap:10px;}
.calcRow output{color:#7c3aed;font-weight:800;}
.calcRow input[type=range]{width:100%;accent-color:#7c3aed;}
.calcOut{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:1.2rem;}
@media(min-width:640px){.calcOut{grid-template-columns:repeat(5,1fr);}}
.calcStat{text-align:center;padding:14px 8px;background:#fff;border:1px solid #e4e4e7;border-radius:10px;}
.calcStat span{display:block;font-size:1.5rem;font-weight:800;color:#7c3aed;line-height:1.1;font-variant-numeric:tabular-nums;}
.calcStat label{font-size:.66rem;color:#71717a;text-transform:uppercase;letter-spacing:.04em;font-weight:700;margin-top:6px;display:block;line-height:1.3;}
.calcNote{margin:1rem 0 0;font-size:.78rem;color:#a1a1aa;line-height:1.55;}
/* checklist */
.checklist{margin:.5rem 0;padding:20px;border:1px solid #e4e4e7;border-radius:14px;background:linear-gradient(180deg,#faf8ff,#f1ecfd);}
.clItem{display:flex;gap:12px;align-items:flex-start;padding:11px 12px;margin:.4rem 0;background:#fff;border:1px solid #e9e5f2;border-radius:10px;cursor:pointer;font-size:.92rem;color:#27272a;line-height:1.5;}
.clItem input{margin-top:3px;width:18px;height:18px;accent-color:#7c3aed;flex-shrink:0;}
.clResult{margin-top:1.2rem;padding:14px 16px;background:#fff;border:1px solid #e4e4e7;border-radius:12px;}
.clScoreWrap{display:flex;align-items:baseline;gap:10px;}
.clScore{font-size:1.8rem;font-weight:800;color:#7c3aed;font-variant-numeric:tabular-nums;}
.clPctBadge{font-size:.9rem;font-weight:700;color:#71717a;}
.clBarTrack{height:8px;background:#ece7f7;border-radius:999px;margin:.7rem 0;overflow:hidden;}
.clBar{height:100%;width:0;border-radius:999px;background:#7c3aed;transition:width .25s ease;}
.clBand{font-size:.9rem;font-weight:600;}
.clBand.good{color:#047857;} .clBand.warn{color:#b45309;} .clBand.bad{color:#b91c1c;}
/* scannable stat band */
.statBand{display:grid;grid-template-columns:1fr;gap:12px;margin:1.6rem 0;}
@media(min-width:640px){.statBand{grid-template-columns:repeat(3,1fr);}}
.statCard{background:#fff;border:1px solid #e4e4e7;border-top:3px solid #7c3aed;border-radius:14px;padding:18px 18px 16px;}
.statCard .big{font-size:2.3rem;font-weight:800;color:#7c3aed;line-height:1;font-variant-numeric:tabular-nums;}
.statCard .lbl{font-size:.88rem;color:#3f3f46;margin:.55rem 0 .5rem;line-height:1.45;}
.statCard .src{font-size:.68rem;color:#a1a1aa;text-transform:uppercase;letter-spacing:.05em;font-weight:800;}
/* concept graphic */
.conceptFig{margin:1.7rem 0;}
.conceptFig svg{display:block;width:100%;height:auto;border:1px solid #e9e5f2;border-radius:14px;}
.conceptFig figcaption{margin-top:.6rem;font-size:.82rem;color:#71717a;text-align:center;line-height:1.5;}
/* relatable example */
.exampleBox{margin:1.7rem 0;border:1px solid #e4e4e7;border-radius:14px;overflow:hidden;background:#fff;box-shadow:0 6px 22px rgba(9,9,11,.04);}
.exampleBox .exHead{background:#f4f2fb;padding:.75rem 1.3rem;font-weight:800;color:#5b21b6;font-size:.95rem;border-bottom:1px solid #ece7f7;}
.exampleBox .exBody{padding:1.05rem 1.3rem;}
.exampleBox .exBody p{margin:0 0 .65rem;color:#3f3f46;line-height:1.7;font-size:.95rem;}
.exampleBox .exLesson{color:#18181b;font-weight:600;font-size:.93rem;border-top:1px dashed #e4e4e7;padding-top:.7rem;margin-top:.3rem;}
/* pull quote */
.pullQuote{margin:1.9rem 0;padding:1.2rem 1.6rem;border-left:4px solid #7c3aed;background:#faf8ff;border-radius:0 12px 12px 0;}
.pullQuote p{font-family:Georgia,'Times New Roman',serif;font-size:1.3rem;line-height:1.5;color:#27272a;margin:0;font-style:italic;}
.pullQuote .attrib{display:block;margin-top:.65rem;font-size:.82rem;color:#71717a;font-style:normal;font-weight:600;}
`

const widgetJs = `
<script>
(function(){
  var f=document.getElementById('calcForm');
  if(f){
    var ids=['incidents','hours','people','rate','valueAtRisk','reduction'];
    var d=function(x){return '$'+Math.round(x).toLocaleString();};
    var h=function(x){return Math.round(x).toLocaleString();};
    var set=function(id,t){var e=document.getElementById('out-'+id);if(e)e.textContent=t;};
    function upd(){
      var v={};ids.forEach(function(id){var el=document.getElementById('in-'+id);if(!el)return;v[id]=+el.value;var o=document.getElementById('val-'+id);if(o)o.textContent=el.value;});
      var ipy=v.incidents*12, lost=ipy*v.hours*v.people, cost=lost*v.rate, rev=v.valueAtRisk*1000*12, rec=lost*(v.reduction/100), avoided=rec*v.rate;
      set('annualCost',d(cost));set('hoursLost',h(lost));set('revExposed',d(rev));set('hoursRecovered',h(rec));set('costAvoided',d(avoided));
    }
    ids.forEach(function(id){var el=document.getElementById('in-'+id);if(el)el.addEventListener('input',upd);});
    upd();
  }
  var cl=document.getElementById('checklist');
  if(cl){
    var boxes=cl.querySelectorAll('input[type=checkbox]');
    function updc(){
      var n=0;boxes.forEach(function(b){if(b.checked)n++;});
      var total=boxes.length,pct=total?Math.round(n/total*100):0;
      document.getElementById('clScore').textContent=n+' / '+total;
      document.getElementById('clPct').textContent=pct+'%';
      var bar=document.getElementById('clBar');if(bar)bar.style.width=pct+'%';
      var be=document.getElementById('clBand'),band,c;
      if(n>=8){band='Broadly AI-ready for this initiative.';c='good';}
      else if(n>=5){band='Usable, with a clear remediation punch list.';c='warn';}
      else {band='High risk: treat data readiness as a prerequisite before funding the AI work.';c='bad';}
      be.textContent=band;be.className='clBand '+c;
    }
    boxes.forEach(function(b){b.addEventListener('change',updc);});
    updc();
  }
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

const heroAccent = I.kind === 'calculator' ? '#7c3aed' : '#0ea5e9'
const heroSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"><defs><linearGradient id="hg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0e0b1e"/><stop offset="1" stop-color="#2a1163"/></linearGradient></defs><rect width="1200" height="630" fill="url(#hg)"/><g transform="translate(80,80)"><circle cx="22" cy="22" r="22" fill="${heroAccent}"/><text x="22" y="30" font-size="22" font-weight="800" fill="#fff" text-anchor="middle">A</text><text x="56" y="30" font-size="24" font-weight="700" fill="#fff">AlertMend</text><text x="228" y="30" font-size="18" fill="#b9a7e6">· data observability</text></g><text x="80" y="250" font-size="52" font-weight="800" fill="#fff">${esc(h1.slice(0, 34))}</text><text x="80" y="312" font-size="28" font-weight="700" fill="#a78bfa">${I.kind === 'calculator' ? 'Price your data downtime in P&amp;L terms.' : 'A checklist, not a slogan.'}</text><text x="80" y="566" font-size="19" fill="#b9a7e6">alertmend.io · for CDOs and data leaders</text></svg>\n`

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
console.log(`✓ ${slug}  title+suffix ${tl}${tl < 30 || tl > 60 ? ' [LEN!]' : ''}  desc ${description.length}  sections ${(spec.sections || []).length}  interactive ${I.kind}  faqs ${(spec.faq || []).length}  em-dashes ${(html.match(/—/g) || []).length}`)
