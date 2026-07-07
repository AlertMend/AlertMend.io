/**
 * Self-hosted app monitoring cluster (Odoo-style): WordPress/WooCommerce, GitLab,
 * Nextcloud, Mattermost/Rocket.Chat, Jira/Confluence DC, Metabase, n8n.
 * Honest AlertMend framing: detect (app + workers + DB + URL), correlate, explain (AI RCA),
 * recover safely via approved runbooks. No em dashes anywhere.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { SITE_URL, esc, CHROME_INLINE_CSS, AUTHOR_CRED_CSS, buildNavHtml, buildSidebarHtml, buildCredArticleHeader, buildAuthorCredLine, calendlyUrl } from './static-blog-shared.mjs'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const DATE = '2026-07-06', MODIFIED = '2026-07-06'
const AUTHOR = 'Dinesh Agrawal'
const LINKEDIN = 'https://www.linkedin.com/in/dineshagrawal85/'
const ACCENTS = {
  'wordpress-monitoring': ['#1e6ba8', '#0d2e47'],
  'gitlab-monitoring': ['#fc6d26', '#3a1a06'],
  'nextcloud-monitoring': ['#00a2e9', '#052f45'],
  'mattermost-rocketchat-monitoring': ['#6c5ce7', '#1c1746'],
  'jira-confluence-monitoring': ['#0052cc', '#04204d'],
  'metabase-monitoring': ['#13a08b', '#062f29'],
  'n8n-monitoring': ['#ea4b71', '#3f1020'],
}
const accentOf = (slug) => ACCENTS[slug] || ['#7c3aed', '#241b4d']

// Official brand marks (Simple Icons, CC0), colored per-app. Combined posts show both.
const LOGO_SLUGS = {
  'wordpress-monitoring': ['wordpress', 'woocommerce'],
  'gitlab-monitoring': ['gitlab'],
  'nextcloud-monitoring': ['nextcloud'],
  'mattermost-rocketchat-monitoring': ['mattermost', 'rocketdotchat'],
  'jira-confluence-monitoring': ['jira', 'confluence'],
  'metabase-monitoring': ['metabase'],
  'n8n-monitoring': ['n8n'],
}
const _logoCache = {}
function logoPaths(slug) {
  return (LOGO_SLUGS[slug] || []).map((name) => {
    if (_logoCache[name] === undefined) {
      try {
        const svg = fs.readFileSync(path.join(root, 'public/logos/brand', name + '.svg'), 'utf8')
        _logoCache[name] = (svg.match(/d="([^"]+)"/) || [null, ''])[1]
      } catch { _logoCache[name] = '' }
    }
    return _logoCache[name]
  }).filter(Boolean)
}

const SCRIPT_JS = `(function () {
  document.querySelectorAll('[data-faq-toggle]').forEach((b) => {
    b.addEventListener('click', () => {
      const item = b.closest('.faqItem'); const answer = item && item.querySelector('.faqAnswer'); const chev = b.querySelector('.faqChevron');
      const open = b.getAttribute('aria-expanded') === 'true';
      b.setAttribute('aria-expanded', open ? 'false' : 'true');
      if (answer) answer.classList.toggle('hidden', open); if (chev) chev.classList.toggle('faqChevronOpen', !open);
    });
  });
  document.querySelectorAll('.copyableCode').forEach((block) => {
    const code = block.querySelector('code'); if (!code) return;
    const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'codeCopyButton'; btn.textContent = 'Copy';
    btn.addEventListener('click', async () => { try { await navigator.clipboard.writeText(code.textContent || ''); btn.textContent = 'Copied'; setTimeout(() => { btn.textContent = 'Copy'; }, 1600); } catch { btn.textContent = 'Select text'; } });
    block.appendChild(btn);
  });
})();
`

const EXTRA_CSS = `${AUTHOR_CRED_CSS}.authorCredLine a:hover{color:var(--am-accent);}
.proofBar{display:flex;flex-wrap:wrap;gap:8px 16px;align-items:center;margin:-.75rem 0 1.5rem;color:#52525b;font-size:.82rem;}
.proofBar .checked{display:inline-flex;align-items:center;gap:6px;color:#047857;font-weight:700;}
.proofBar .dot{color:#d4d4d8;}
.monitorGrid{display:grid;grid-template-columns:1fr;gap:12px;margin:1.25rem 0 2rem;}
@media (min-width:720px){.monitorGrid{grid-template-columns:repeat(2,1fr);}}
.monitorCard{padding:18px;border:1px solid #e4e4e7;border-radius:10px;background:#fff;}
.monitorTop{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:7px;}
.monitorCard h3{margin:0;color:#18181b;font-size:1rem;}
.signalBadge{flex:0 0 auto;padding:3px 7px;border-radius:999px;background:#f4f4f5;color:#52525b;font-size:.66rem;font-weight:800;letter-spacing:.05em;text-transform:uppercase;}
.monitorCard p{margin:0;color:#52525b;font-size:.87rem;line-height:1.6;}
.authorBioCard{display:flex;gap:24px;align-items:flex-start;flex-wrap:wrap;padding-bottom:1rem;}
.authorBioCard h3{font-size:1.5rem;font-weight:800;color:#09090b;margin:0 0 4px;}
.authorBioRole{color:var(--am-accent);font-weight:600;margin:0 0 14px;}
.authorBioText{color:#3f3f46;line-height:1.75;}
.authorBioLink{display:inline-flex;align-items:center;gap:6px;margin-top:14px;color:#71717a;text-decoration:none;font-weight:600;}
.authorBioLink:hover{color:var(--am-accent);}
.stackFlow{width:100%;height:auto;display:block;border:1px solid #e4e4e7;border-radius:12px;background:linear-gradient(180deg,#faf9ff,#f3f1fb);}
.sectionHead{border-left:4px solid var(--am-accent);padding-left:14px;}
.heroGuideLabel,.instantFixTop span,.diagnosisEyebrow,.answerEyebrow{color:var(--am-accent);}
.searchIssueTerm{color:var(--am-accent);}
.signalBadge{color:var(--am-accent);}
.bodyText a,.sourceList a,.faqAnswer a{color:var(--am-accent);}
.monitorCard{border-top:3px solid var(--am-accent);}
.ctaInline{margin:1.6rem 0;padding:15px 18px;border-left:3px solid var(--am-accent);border-radius:0 10px 10px 0;background:#faf9fb;font-weight:600;color:#27272a;}
.ctaInline a{color:var(--am-accent);}
.brandChip{display:inline-flex;align-items:center;gap:9px;margin:0 0 1.25rem;padding:6px 15px 6px 11px;border:1px solid #e4e4e7;border-radius:999px;background:#fff;}
.brandChip svg{display:block;flex:0 0 auto;}
.brandChip span{font-size:.82rem;font-weight:600;color:#52525b;}
.instantFix::after{display:none;}
`

function authorCard() {
  return `
          <hr style="margin:2.5rem 0 1.75rem;border:none;border-top:1px solid #e4e4e7;">
          <div class="authorBioCard">
            <img src="/logos/dinesh.jpeg" alt="${AUTHOR}" width="128" height="128" loading="lazy" style="width:128px;height:128px;border-radius:12px;object-fit:cover;border:1px solid #e4e4e7;flex-shrink:0;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
            <div style="display:none;width:128px;height:128px;border-radius:12px;border:1px solid #e4e4e7;background:#f4f4f5;align-items:center;justify-content:center;font-weight:800;font-size:2.25rem;color:#3f3f46;flex-shrink:0;">DA</div>
            <div style="flex:1;min-width:240px;">
              <h3>${AUTHOR}</h3>
              <p class="authorBioRole">Co-Founder at AlertMend.io</p>
              <div class="authorBioText">
                <p style="margin:0 0 10px;">${AUTHOR} brings 12+ years of deep experience across cloud and AI-driven automation, building systems that detect, diagnose, and fix production incidents without waiting for a human.</p>
                <p style="margin:0;">At AlertMend.io he focuses on autonomous, self-healing operations, turning manual cloud firefighting into workflows that predict, remediate, and learn.</p>
              </div>
              <a class="authorBioLink" href="${LINKEDIN}" target="_blank" rel="noopener noreferrer" aria-label="${AUTHOR} on LinkedIn">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zM8.34 18V9.94H5.67V18h2.67zM7 8.76a1.55 1.55 0 1 0 0-3.1 1.55 1.55 0 0 0 0 3.1zM18.34 18v-4.42c0-2.37-1.27-3.47-2.96-3.47-1.36 0-1.97.75-2.31 1.28V9.94h-2.67V18h2.67v-4.5c0-.24.02-.48.09-.65.19-.48.63-.98 1.36-.98.96 0 1.35.73 1.35 1.8V18h2.82z"/></svg>
                <span>LinkedIn</span>
              </a>
            </div>
          </div>`
}

function stackSvg(cfg) {
  const [a, b, c, d] = cfg.stack
  const [accent] = accentOf(cfg.slug)
  const applogo = logoPaths(cfg.slug)[0]
  return `<figure style="margin:1.5rem 0 2rem;">
      <svg class="stackFlow" viewBox="0 0 960 150" width="960" height="150" role="img" aria-label="Request path for ${esc(cfg.app)}: user to proxy to application workers to database and cache, the layers monitoring must cover." font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
        <defs>
          <marker id="sf-ar" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L7,3 L0,6 Z" fill="${accent}"/></marker>
          <style>@media (prefers-reduced-motion: no-preference){.stackFlow .sf-l{stroke-dasharray:7 6;animation:sf-d .8s linear infinite}@keyframes sf-d{to{stroke-dashoffset:-13}}}</style>
        </defs>
        ${[a, b, c].map((label, i) => {
          const x = 20 + i * 250
          return `<rect x="${x}" y="45" width="200" height="60" rx="11" fill="#fff" stroke="#ddd6fe"/>${(i === 2 && applogo) ? `<g transform="translate(${x + 8},50) scale(0.78)"><path d="${applogo}" fill="${accent}"/></g>` : ''}<text x="${x + 100}" y="80" font-size="14" font-weight="700" fill="#3f3f46" text-anchor="middle">${esc(label)}</text>` +
            (i < 2 ? `<line class="sf-l" x1="${x + 200}" y1="75" x2="${x + 250}" y2="75" stroke="${accent}" stroke-width="2.5" marker-end="url(#sf-ar)"/>` : '')
        }).join('')}
        <line class="sf-l" x1="820" y1="75" x2="870" y2="75" stroke="#16a34a" stroke-width="2.5" marker-end="url(#sf-ar)"/>
        <rect x="770" y="20" width="180" height="110" rx="11" fill="#ecfdf5" stroke="#a7f3d0"/>
        <text x="860" y="70" font-size="13" font-weight="700" fill="#047857" text-anchor="middle">${esc(c)}</text>
        <text x="860" y="94" font-size="12" fill="#059669" text-anchor="middle">${esc(d)}</text>
      </svg>
      <figcaption style="margin-top:9px;color:#71717a;font-size:.78rem;">${esc(cfg.app)} is only healthy when every layer is: a green process is not proof that users can complete the job.</figcaption>
    </figure>`
}

function codeBlock(code) { return `<pre class="codeBlock copyableCode"><code>${esc(code)}</code></pre>` }

function jsonLd(cfg) {
  const canonical = `${SITE_URL}/blog/${cfg.slug}`, img = `${SITE_URL}/assets/${cfg.slug}/hero.png`
  const article = { '@context': 'https://schema.org', '@type': 'TechArticle', headline: cfg.title, description: cfg.excerpt, image: img, datePublished: DATE, dateModified: MODIFIED, author: { '@type': 'Person', name: AUTHOR, jobTitle: 'Co-Founder at AlertMend.io', url: LINKEDIN, sameAs: [LINKEDIN] }, publisher: { '@type': 'Organization', name: 'AlertMend AI', logo: { '@type': 'ImageObject', url: `${SITE_URL}/logos/alertmend-logo.svg` } }, mainEntityOfPage: { '@type': 'WebPage', '@id': canonical } }
  const faq = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: cfg.faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) }
  return [article, faq].map((o) => `  <script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n')
}

function render(cfg) {
  const canonical = `${SITE_URL}/blog/${cfg.slug}`, cal = calendlyUrl(cfg.slug), img = `${SITE_URL}/assets/${cfg.slug}/hero.png`
  const amSteps = [
    ['Detect', `Watch the ${esc(cfg.app)} URL and user journey from outside, plus the ${esc(cfg.processLabel)}, ${esc(cfg.dbLabel)}, and host resources, so a stall or crash is caught before users report it.`],
    ['Correlate', `Tie the failure to the workload, recent deploy or config change, and ${esc(cfg.dbLabel)} state, so the alert names what broke, not just that a check went red.`],
    ['Explain', `Run AI root-cause analysis in the language of ${esc(cfg.app)} and its stack, with the evidence gathered and the most likely fix.`],
    ['Recover safely', `Run an approved runbook: ${esc(cfg.recover)}, then verify the user-facing endpoint before closing the incident.`],
  ]
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(cfg.title)} | AlertMend AI</title>
  <meta name="description" content="${esc(cfg.excerpt)}">
  <meta name="keywords" content="${esc(cfg.keywords)}">
  <meta name="author" content="${AUTHOR}">
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
${buildCredArticleHeader(cfg.h1, DATE, cfg.category)}
      <div class="brandChip">${logoPaths(cfg.slug).map((d) => `<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="${d}" fill="var(--am-accent)"/></svg>`).join('')}<span>Monitoring guide for ${esc(cfg.app)}</span></div>
      <div class="proofBar">
        <span class="checked"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>Verified against official ${esc(cfg.app)} documentation</span>
        <span class="dot">&bull;</span><span>Last reviewed ${MODIFIED}</span>
        <span class="dot">&bull;</span><span>${cfg.sources.length} primary sources cited</span>
      </div>
    <div class="dl-blog">
      <section class="heroBand heroBandCompact">
        <p class="heroGuideLabel">Self-hosted ${esc(cfg.app)} reliability · sources checked ${MODIFIED}</p>
        <div class="instantFix">
          <div class="instantFixTop"><span>THE 60-SECOND ANSWER</span><strong>${esc(cfg.answerTitle)}</strong></div>
          <p>${cfg.answer}</p>
          <div class="instantFixCommands">
            ${cfg.quickCmds.map(([c, l]) => `<code>${esc(c)}</code><span>${esc(l)}</span>`).join('\n            ')}
          </div>
        </div>
        <aside class="immediateDiagnosis">
          <div class="diagnosisHeading"><span class="diagnosisEyebrow">Immediate triage</span><strong>Up, degraded, or down?</strong></div>
          <ol class="diagnosisSteps">
            ${cfg.triage.map((t, i) => `<li><span>${i + 1}</span><p>${t}</p></li>`).join('\n            ')}
          </ol>
          <p class="diagnosisCaution"><strong>Avoid the false read:</strong> ${cfg.falseRead}</p>
        </aside>
      </section>

      <nav class="articleToc" aria-label="On this page"><strong>On this page</strong>
        <a href="#stack">What keeps ${esc(cfg.app)} up</a>
        <a href="#by-industry">By industry</a>
        <a href="#monitor">What to monitor</a>
        <a href="#checks">Health checks</a>
        <a href="#prometheus">Prometheus &amp; Grafana</a>
        <a href="#alerts">What to alert on</a>
        <a href="#failures">Common failures</a>
        <a href="#by-use-case">By use case</a>
        <a href="#alertmend">Monitor with AlertMend</a>
        <a href="#faq">FAQ</a>
      </nav>

      <h2 class="sectionHead" id="stack">What keeps ${esc(cfg.app)} up</h2>
      ${cfg.intro.map((p) => `<p class="bodyText">${p}</p>`).join('\n      ')}
      ${stackSvg(cfg)}

      <h2 class="sectionHead" id="by-industry">Who runs ${esc(cfg.app)}, and what they watch</h2>
      <p class="sectionSub">Different industries run ${esc(cfg.app)} for different reasons, so the failure that hits hardest changes by sector. Find the row that sounds like you.</p>
      <div class="diyWrap"><table class="compareTable"><thead><tr><th>Industry</th><th>What matters most for ${esc(cfg.app)}</th></tr></thead><tbody>
        ${cfg.industries.map((r) => `<tr><td>${esc(r[0])}</td><td class="diyHighlight">${esc(r[1])}</td></tr>`).join('\n        ')}
      </tbody></table></div>

      <h2 class="sectionHead" id="monitor">What to monitor in ${esc(cfg.app)}</h2>
      <p class="sectionSub">${esc(cfg.monitorSub)}</p>
      <div class="monitorGrid">
        ${cfg.signals.map(([name, badge, body]) => `<div class="monitorCard"><div class="monitorTop"><h3>${esc(name)}</h3><span class="signalBadge">${esc(badge)}</span></div><p>${esc(body)}</p></div>`).join('\n        ')}
      </div>

      <h2 class="sectionHead" id="checks">Copy-paste health checks</h2>
      <p class="bodyText">${esc(cfg.checksIntro)}</p>
      ${codeBlock(cfg.checks)}

      <h2 class="sectionHead" id="prometheus">Monitor ${esc(cfg.app)} with Prometheus and Grafana</h2>
      <p class="bodyText">${cfg.prometheus.intro}</p>
      ${codeBlock(cfg.prometheus.setup)}
      <p class="bodyText">Key metrics to scrape and graph in Grafana:</p>
      <ul class="sourceList">${cfg.prometheus.metrics.map((m) => `<li>${esc(m)}</li>`).join('')}</ul>

      <h2 class="sectionHead" id="alerts">What to alert on</h2>
      <p class="sectionSub">Concrete conditions worth paging on. Start here and tune the thresholds to your own baseline.</p>
      <div class="diyWrap"><table class="compareTable"><thead><tr><th>Alert</th><th>Condition and threshold</th></tr></thead><tbody>
        ${cfg.alerts.map((a) => `<tr><td>${esc(a[0])}</td><td class="diyHighlight">${esc(a[1])}</td></tr>`).join('')}
      </tbody></table></div>

      <div class="ctaInline">That is a lot of signals, alerts, and runbooks to wire up and keep working for ${esc(cfg.app)}. <a href="${cal}" target="_blank" rel="noopener noreferrer">Book a free consultation &rarr;</a> and we will walk through what is already at risk in your ${esc(cfg.app)} setup.</div>

      <h2 class="sectionHead" id="failures">Common failures and safe fixes</h2>
      <div class="searchIssueGrid">${cfg.failures.map(([term, desc, fix]) => `<div class="searchIssueCard"><h3 class="searchIssueTerm">${esc(term)}</h3><p class="searchIssueDesc">${esc(desc)}</p><p class="searchIssueAlert"><strong>Fix:</strong> ${esc(fix)}</p></div>`).join('')}</div>

      <h2 class="sectionHead" id="by-use-case">${esc(cfg.app)} monitoring priorities by use case</h2>
      <p class="sectionSub">The stack is the same; which failure hurts first changes with how you run ${esc(cfg.app)}. Lead your alerts and runbooks with the row that matches you.</p>
      <div class="diyWrap"><table class="compareTable"><thead><tr><th>Use case</th><th>Watch most closely</th><th>What downtime costs</th></tr></thead><tbody>
        ${cfg.useCases.map((r) => `<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td><td class="diyHighlight">${esc(r[2])}</td></tr>`).join('\n        ')}
      </tbody></table></div>

      <h2 class="sectionHead" id="alertmend">Monitor and recover ${esc(cfg.app)} with AlertMend</h2>
      <p class="bodyText">${cfg.amIntro}</p>
      <div class="alertmendMethod">${amSteps.map(([t, b], i) => `<div><span>${i + 1}</span><strong>${esc(t)}</strong><p>${b}</p></div>`).join('')}</div>
      <p class="bodyText productDisclosure"><strong>Deployment control:</strong> AlertMend runs as a managed service or self-hosted, so telemetry and remediation stay inside your environment. Every command in this guide works without AlertMend.</p>

      <h2 class="sectionHead" id="sources">Primary sources</h2>
      <ul class="sourceList">${cfg.sources.map(([l, u]) => `<li><a href="${u}" target="_blank" rel="noopener noreferrer">${esc(l)}</a></li>`).join('')}</ul>
      <div class="reviewPolicy"><strong>Method and disclosure:</strong> commands and behavior above are drawn from the official ${esc(cfg.app)} and component documentation linked in Primary sources, and can change by version, so verify against what you run. AlertMend publishes this guide and may benefit if readers evaluate its product.</div>

      <h2 class="sectionHead" id="faq">${esc(cfg.app)} monitoring FAQ</h2>
      <div class="faqList">${cfg.faqs.map(([q, a], i) => `<div class="faqItem"><button type="button" class="faqQuestion" data-faq-toggle aria-expanded="${i === 0 ? 'true' : 'false'}">${esc(q)}<svg class="faqChevron${i === 0 ? ' faqChevronOpen' : ''}" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 9l6 6 6-6"/></svg></button><div class="faqAnswer${i === 0 ? '' : ' hidden'}">${esc(a)}</div></div>`).join('')}</div>
${authorCard()}
      <div class="ctaBand">
        <div class="ctaBandTitle">${esc(cfg.ctaTitle)}</div>
        <p class="ctaBandSub">${esc(cfg.ctaSub)} The consultation is free and with no obligation, and you leave with a prioritized fix list.</p>
        <div class="ctaBtnRow"><a href="${cal}" class="ctaBtn" target="_blank" rel="noopener noreferrer">Book a free consultation &rarr;</a></div>
      </div>
    </div>
    <div class="promo"><p><strong>Related:</strong> ${cfg.related.map(([s, l]) => `<a href="/blog/${s}">${esc(l)}</a>`).join(' &middot; ')}</p></div>
      </div>
${buildSidebarHtml(cfg.relatedSidebar || cfg.related.map(([slug, title]) => ({ slug, title })))}
    </div>
  </div>
  <script src="/assets/${cfg.slug}/script.js" defer></script>
</body>
</html>
`
}

function heroSvg(cfg) {
  const [accent, accentDark] = accentOf(cfg.slug)
  const lps = logoPaths(cfg.slug)
  const logoSvg = lps.length === 1
    ? `<g transform="translate(956,64) scale(6)"><path d="${lps[0]}" fill="${accent}"/></g>`
    : lps.map((d, i) => `<g transform="translate(${872 + i * 156},72) scale(4.6)"><path d="${d}" fill="${accent}"/></g>`).join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"><defs><linearGradient id="hg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0b0b14"/><stop offset="1" stop-color="${accentDark}"/></linearGradient></defs><rect width="1200" height="630" fill="url(#hg)"/>${logoSvg}<g transform="translate(80,80)"><circle cx="22" cy="22" r="22" fill="${accent}"/><text x="22" y="30" font-size="22" font-weight="800" fill="#fff" text-anchor="middle">A</text><text x="56" y="30" font-size="24" font-weight="700" fill="#fff">AlertMend</text><text x="228" y="30" font-size="18" fill="#8b82b8">· ${esc(cfg.heroKicker)}</text></g><text x="80" y="250" font-size="60" font-weight="800" fill="#fff">${esc(cfg.heroTitle)}</text><text x="80" y="316" font-size="34" font-weight="700" fill="${accent}">${esc(cfg.heroSub)}</text><g font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="19"><rect x="80" y="368" width="1040" height="150" rx="14" fill="#12111f" stroke="#312b57"/>${cfg.heroBullets.map((b, i) => `<text x="108" y="${406 + i * 36}" fill="${accent}">${esc(b[0])}</text><text x="300" y="${406 + i * 36}" fill="#e9e3ff">${esc(b[1])}</text>`).join('')}</g><text x="80" y="566" font-size="19" fill="#8b82b8">alertmend.io · ${esc(cfg.heroFoot)}</text></svg>\n`
}

// ---------------------------------------------------------------------------
const POSTS = [
  {
    slug: 'wordpress-monitoring', app: 'WordPress', category: 'Monitoring',
    industries: [
      ['Retail and e-commerce (WooCommerce)', 'Checkout uptime, payment webhooks, and PHP workers at peak, since every failure is a lost sale'],
      ['Media and publishing', 'Cache hit rate and traffic-spike capacity, so an article going viral does not take the origin down'],
      ['Education and membership', 'Logged-in, uncached performance and sessions, so students and members are never locked out'],
      ['Agencies and multisite', 'Per-site uptime, disk, and tight monitoring around update windows across many client sites'],
      ['Nonprofits and SMBs', 'Uptime, SSL, and restorable backups on a small budget, where downtime costs donations and trust'],
    ],
    faqs: [
      ['Why is my WordPress site slow?', 'WordPress slowness is usually MySQL (slow queries or a bloated autoloaded wp_options) or a missing or cold object cache pushing all load onto the database, sometimes with too few PHP-FPM workers. Add a Redis object cache, trim autoloaded options, add full-page caching, and index or kill slow queries.'],
      ['How do I fix the WordPress white screen of death?', 'A blank page with no error is usually a PHP fatal or the memory_limit being hit, often from a plugin, theme, or update. Enable WP_DEBUG or read the PHP error log, raise memory_limit if the usage is legitimate, and disable the offending plugin.'],
      ['Why is my WordPress site returning a 502 error?', 'A 502 means the web server has no healthy PHP-FPM worker: the pool is down, crash-looping, or every child is busy under load. Restart or scale PHP-FPM, raise pm.max_children within your memory budget, and cache more aggressively to cut backend load.'],
      ['Is wp-cron running on my site?', 'By default wp-cron only fires when someone visits a page, so low-traffic sites miss scheduled posts, emails, and WooCommerce jobs. Disable the pseudo-cron with DISABLE_WP_CRON and run wp-cron from a real system cron every 1 to 5 minutes, and check wp cron event list.'],
      ['Why is WooCommerce checkout failing?', 'Checkout stalls when the payment gateway callback, MySQL, or PHP workers are degraded, so orders sit in pending. Test the full checkout path from outside, watch the gateway webhook, and confirm workers and MySQL have headroom at peak.'],
      ['How many PHP-FPM workers should I run?', 'Set pm.max_children to roughly the RAM available for PHP divided by the average PHP process size. Too few workers cause 502 and 504 errors under load, too many exhaust memory, so watch the pool status page for queueing.'],
      ['How do I monitor WordPress uptime?', 'Poll the homepage plus a logged-in or add-to-cart path from outside on an interval, and separately watch PHP-FPM, MySQL, and disk. A cached homepage alone hides login, admin, and checkout failures.'],
      ['Why are WooCommerce orders stuck in pending payment?', 'The gateway webhook that confirms payment did not reach the site, or wp-cron did not process the status change. Verify the gateway callback URL is reachable and that wp-cron is running on a real schedule.'],
      ['How do I fix "Error establishing a database connection"?', 'MySQL is down, out of connections, or the credentials or host in wp-config.php are wrong. Check the MySQL service, its max_connections, and the database settings, then confirm the site can reach the database host.'],
      ['What uptime should I target for WordPress?', 'For most sites 99.9% uptime, about 45 minutes of downtime per month, is a solid benchmark, and stores or conversion-driven sites often aim for 99.95% or higher. Track it from outside with confirmation checks so a single blip does not page you.'],
      ['Should I monitor WordPress from multiple locations?', 'Yes. Checking from several regions separates a real outage from a regional network, CDN, or DNS issue: if one region fails but others pass it is usually routing or CDN, and if all fail it is the origin, DNS, or SSL. Multi-location checks also reduce false alarms from a single flaky probe.'],
      ['When is WordPress most likely to go down?', 'Right after plugin, theme, or core updates, which are a frequent source of fatal errors, redirect loops, and the white screen. Monitor more tightly around update windows with short check intervals so you catch a broken update before users do.'],
    ],
    prometheus: {
      intro: 'WordPress has no single official exporter, so the standard Prometheus and Grafana stack combines four: blackbox_exporter for the URL and checkout path, mysqld_exporter for MySQL, a PHP-FPM exporter for worker saturation, and node_exporter for host CPU, memory, and disk.',
      setup: '# Probe the site and a checkout path from outside via blackbox_exporter\ncurl -s "http://localhost:9115/probe?module=http_2xx&target=https://your-site.com/checkout/"\n\n# php-fpm exporter reads the pool status page (enable pm.status_path)\n# mysqld_exporter reads SHOW GLOBAL STATUS; node_exporter covers the host',
      metrics: ['blackbox: probe_success and probe_http_duration_seconds for site and checkout', 'php-fpm: active vs total processes and the listen queue', 'mysql: threads_running, slow_queries, and connections', 'node: disk, inode, memory, and CPU'],
    },
    alerts: [
      ['Site or checkout down', 'blackbox probe_success == 0 for 2 to 3 consecutive checks (confirmation checks avoid flapping)'],
      ['Slow responses', 'homepage or checkout response time above your baseline; target 99.9% uptime, higher for stores'],
      ['PHP-FPM saturated', 'listen queue above 0 or active processes at max_children for 5 minutes'],
      ['MySQL pressure', 'threads_running climbing or slow_queries rising'],
      ['wp-cron stalled', 'no successful wp-cron run within the expected window'],
      ['SSL expiring', 'certificate expiry under 14 days'],
    ],
    title: 'WordPress and WooCommerce Monitoring',
    h1: 'WordPress and WooCommerce Monitoring and Auto-Recovery',
    intro: [
      'WordPress powers a huge share of the web, and most production sites are more than PHP and a database: a web server, PHP-FPM workers, MySQL, an object cache, wp-cron, and often WooCommerce all have to work together. A page can render from a full-page cache or CDN while the parts that matter, login, wp-admin, and checkout, are quietly broken.',
      'That is why monitoring WordPress means watching the whole path, not just that the homepage returns 200. The signal that a store is losing money is a failed checkout or a stalled wp-cron, and neither shows up in a simple uptime ping.',
    ],
    excerpt: 'Monitor WordPress and WooCommerce end to end: PHP-FPM, MySQL, object cache, wp-cron, and checkout, then safely auto-recover the common failures.',
    keywords: 'wordpress monitoring, woocommerce monitoring, wordpress uptime, wordpress slow, wordpress white screen of death, php-fpm, wp-cron, wordpress 502, wordpress auto recovery',
    processLabel: 'PHP-FPM workers', dbLabel: 'MySQL',
    stack: ['User / browser', 'Nginx or Apache', 'PHP-FPM + WordPress', 'MySQL + Redis cache'],
    recover: 'restart a wedged PHP-FPM pool, clear a stuck object cache, or trigger wp-cron',
    answerTitle: 'Watch the checkout path, not just that the homepage loads.',
    answer: 'A real WordPress check should prove the site answers, PHP-FPM has free workers, MySQL is responsive, the object cache is healthy, wp-cron is advancing, and for WooCommerce that a test order can reach checkout. A cached homepage can load fine while logged-in and checkout paths are broken.',
    quickCmds: [['curl -I https://site/', 'is it answering?'], ['systemctl status php8.2-fpm', 'workers alive?'], ['wp cron event list', 'wp-cron advancing?']],
    triage: [
      'Load a non-cached page (wp-admin or an add-to-cart action): a cached homepage hides most failures.',
      'Check PHP-FPM pool status for busy vs max children, and the error log for PHP fatals or memory exhaustion.',
      'Check MySQL for slow queries and connection limits, and confirm wp-cron has run recently.',
    ],
    falseRead: 'a fast homepage is usually served from a full-page cache or CDN and says nothing about wp-admin, login, or WooCommerce checkout.',
    monitorSub: 'A green web server does not prove customers can log in or buy. Watch the whole path from browser to database.',
    signals: [
      ['Site and checkout URL', 'journey', 'Poll the homepage plus a logged-in or add-to-cart path from outside; alert on non-200 or slow responses.'],
      ['PHP-FPM workers', 'process', 'Track busy vs max_children and request queueing; exhausted workers cause 502 and 504 errors.'],
      ['MySQL health', 'database', 'Watch slow queries, connections, and a bloated wp_options autoload, the usual root of a slow WordPress.'],
      ['Object cache', 'cache', 'Redis or Memcached hit rate; a down or cold cache pushes all load onto MySQL and slows every page.'],
      ['wp-cron', 'jobs', 'Confirm scheduled events run; a stalled wp-cron silently breaks publishing, emails, and WooCommerce actions.'],
      ['Disk and PHP memory', 'capacity', 'Uploads filling disk, or memory_limit hit, produce failed uploads and the white screen of death.'],
    ],
    checksIntro: 'Run these from the host or a monitor to separate a full outage from a slow or partial failure.',
    checks: '# Site answering (follow redirects, show status)\ncurl -sSI -L https://your-site.com/ | head -n1\n\n# PHP-FPM pool status (enable pm.status_path in the pool config)\ncurl -s http://127.0.0.1/status?full\n\n# MySQL responsiveness and slow queries\nmysqladmin -u root -p status\nmysql -e "SHOW FULL PROCESSLIST;" | grep -i query\n\n# wp-cron and scheduled events (WP-CLI)\nwp cron event list --fields=hook,next_run_relative\n\n# Redis object cache reachable\nredis-cli ping',
    failures: [
      ['White screen of death', 'A blank page with no error usually means a PHP fatal or the memory_limit being hit, often from a plugin, theme, or update.', 'Enable WP_DEBUG or read the PHP error log, raise memory_limit if legitimate, and disable the offending plugin. Keep a governed rollback for the last update.'],
      ['502 or 504 errors', 'The web server has no healthy PHP-FPM worker: the pool is down, crash-looping, or all children are busy under load.', 'Restart or scale the PHP-FPM pool, raise pm.max_children within memory budget, and cache more aggressively to cut backend load.'],
      ['Site is slow', 'Slowness is usually MySQL: slow queries, a huge autoloaded wp_options, or a missing or cold object cache pushing load onto the database.', 'Add or warm a Redis object cache, trim autoloaded options, index or kill slow queries, and add full-page caching.'],
      ['wp-cron not running', 'Scheduled posts, emails, and WooCommerce jobs stop when wp-cron is disabled or never triggered, common on low-traffic sites.', 'Disable pseudo-cron and run wp-cron from a real system cron every 1 to 5 minutes, and alert when events fall behind.'],
      ['WooCommerce checkout failing', 'Orders stall in pending or fail at payment when the gateway callback, MySQL, or PHP workers are degraded.', 'Test the full checkout path from outside, watch the payment gateway webhook, and confirm workers and MySQL have headroom at peak.'],
    ],
    useCases: [
      ['WooCommerce store', 'Checkout URL, payment webhooks, PHP workers at peak, MySQL', 'Lost sales, abandoned carts'],
      ['High-traffic publisher', 'Full-page cache hit rate, PHP-FPM workers, CDN origin errors', 'Traffic spikes overwhelm origin'],
      ['Membership / LMS site', 'Logged-in (uncached) response time, object cache, sessions', 'Members locked out, slow portals'],
      ['Agency / multisite', 'Per-site uptime, disk and inode capacity, wp-cron per site', 'One site takes down the host'],
      ['Headless WordPress', 'REST or GraphQL API latency, PHP workers, cache', 'Front-end app breaks on API stalls'],
    ],
    amIntro: 'Full-page caches and CDNs make a broken WordPress look healthy from the front. AlertMend checks the real user path (login, wp-admin, WooCommerce checkout) alongside PHP-FPM, MySQL, the object cache, and wp-cron, then turns a failure into action.',
    sources: [
      ['WordPress: Hooking WP-Cron to the system scheduler', 'https://developer.wordpress.org/plugins/cron/hooking-wp-cron-into-the-system-task-scheduler/'],
      ['WordPress: Debugging in WordPress (WP_DEBUG)', 'https://wordpress.org/documentation/article/debugging-in-wordpress/'],
      ['WooCommerce: Server requirements', 'https://woocommerce.com/document/server-requirements/'],
      ['PHP-FPM: FastCGI Process Manager status', 'https://www.php.net/manual/en/fpm.status.php'],
      ['MySQL: SHOW PROCESSLIST', 'https://dev.mysql.com/doc/refman/8.0/en/show-processlist.html'],
    ],
    ctaTitle: 'Catch the WordPress failure your cache is hiding.',
    ctaSub: 'See AlertMend watch checkout and wp-admin, tie a slowdown to MySQL or PHP-FPM, and recover a wedged pool before customers bounce.',
    heroKicker: 'WordPress reliability', heroTitle: 'WordPress Monitoring', heroSub: 'PHP-FPM, MySQL, wp-cron, and checkout.',
    heroBullets: [['slow', 'MySQL, autoload bloat, cold cache'], ['502', 'PHP-FPM pool down or saturated'], ['checkout', 'gateway or worker failure at peak']],
    heroFoot: 'Monitor the whole path, not the cached homepage',
    related: [['odoo-monitoring', 'Odoo Monitoring'], ['optimizing-elasticsearch-heap-memory', 'Elasticsearch Heap'], ['top-kubernetes-cost-management-solutions', 'Kubernetes Cost']],
  },
  {
    slug: 'gitlab-monitoring', app: 'GitLab', category: 'Monitoring',
    industries: [
      ['Fintech and regulated', 'Audit, backups, HA, and self-hosted control, where an outage is also a compliance and release risk'],
      ['Enterprise engineering', 'Sidekiq and Gitaly at scale plus Geo replication, since a stall blocks the whole organization'],
      ['Startups and scale-ups', 'CI throughput and single-node reliability, because a slow pipeline is slower shipping'],
      ['Government and defense', 'Air-gapped, self-hosted operation with audit, where sovereignty and uptime both matter'],
      ['Open-source projects', 'Pages, registry, and artifact disk under community load, which shapes contributor experience'],
    ],
    faqs: [
      ['Why is GitLab returning a 502 error?', 'Workhorse or nginx has no healthy Puma to serve, usually because Puma is down, restarting after an upgrade, or out of memory. Run gitlab-ctl status and restart puma, check memory, and confirm database migrations finished before reopening traffic.'],
      ['How do I check the Sidekiq queue in GitLab?', 'Use the Admin area under Monitoring and Background jobs, or gitlab-rails to read Sidekiq queue sizes. A growing backlog means background jobs such as CI, emails, and mirroring are stalling even when the web UI works.'],
      ['Why is git clone or push slow in GitLab?', 'Git operations route through Gitaly, so latency, a full repository disk, or a Gitaly fault makes clone and push slow or fail. Check Gitaly latency and errors and free or expand the repository disk.'],
      ['How do I monitor GitLab?', 'GitLab bundles Prometheus and exposes the /-/health and /-/readiness endpoints, so scrape the metrics and poll readiness, and watch Sidekiq, Gitaly, PostgreSQL, Redis, and disk together. Readiness reports the dependent services, not just the web tier.'],
      ['How do I restart GitLab?', 'Use sudo gitlab-ctl restart to restart everything, or restart a single service such as puma or sidekiq. Check gitlab-ctl status afterward and verify the /-/health endpoint.'],
      ['Why is my GitLab disk filling up?', 'CI artifacts, job logs, LFS objects, and the container registry grow quickly. Set artifact and log expiry, run registry garbage collection, and alert well before the volume fills.'],
      ['What does gitlab-ctl status show?', 'It lists every bundled service, including puma, sidekiq, postgresql, redis, gitaly, and nginx, and whether each is running. It is the first check to run when GitLab misbehaves.'],
      ['Why is Sidekiq not processing jobs?', 'The Sidekiq process is down, out of memory, or blocked on a slow database or Redis. Restart Sidekiq, read its log, and fix the slow dependency behind the backlog.'],
      ['Why did my GitLab upgrade break the instance?', 'A batched background migration or a service can stall after an upgrade and block features or the next upgrade. Check gitlab-ctl status and background migration status, resume the stuck batch, and hold the next upgrade until it completes.'],
      ['How do I monitor GitLab with Prometheus and Grafana?', 'GitLab Omnibus bundles Prometheus and per-service exporters, so expose the Sidekiq exporter (port 8082), Gitaly (prometheus_listen_addr on 9236), and gitlab-exporter by setting their listen addresses in gitlab.rb, point Prometheus at them, and import the GitLab Grafana dashboards. That surfaces Sidekiq queues, Gitaly latency, and Puma request metrics in one place.'],
      ['What should I alert on in GitLab?', 'Page on the readiness endpoint failing, Sidekiq queue latency above about 60 seconds (jobs backing up), Gitaly p99 latency climbing (slow git), disk above 80% on repos or artifacts, and PostgreSQL connections near the limit. Those map to the failures that actually stop CI and git.'],
    ],
    prometheus: {
      intro: 'GitLab Omnibus bundles Prometheus and per-service exporters, so you can scrape them directly or point an external Prometheus at them. The key endpoints are the Sidekiq metrics exporter (port 8082), Gitaly (set prometheus_listen_addr to 0.0.0.0:9236), and gitlab-exporter, and GitLab publishes Grafana dashboards for each service.',
      setup: '# gitlab.rb: expose exporters to an external Prometheus, then reconfigure\ngitlab_exporter["listen_address"] = "0.0.0.0"\nsidekiq["listen_address"] = "0.0.0.0"\ngitaly["configuration"] = { prometheus_listen_addr: "0.0.0.0:9236" }\n# sudo gitlab-ctl reconfigure',
      metrics: ['sidekiq: queue size and job latency per queue', 'gitaly: git RPC rate and latency', 'puma: request duration and worker saturation', 'postgres and redis exporter metrics'],
    },
    alerts: [
      ['Web or API down', 'the /-/readiness endpoint failing or the Puma 5xx rate rising'],
      ['Sidekiq backlog', 'queue latency above about 60 seconds or queue size climbing'],
      ['Gitaly slow', 'git RPC p99 latency above about 1 second'],
      ['Disk pressure', 'repository, artifact, or registry volume above 80%'],
      ['Database', 'PostgreSQL connections near max or replication lag rising'],
      ['Migration stuck', 'a batched background migration not progressing after an upgrade'],
    ],
    title: 'GitLab Self-Hosted Monitoring Guide',
    h1: 'GitLab Self-Hosted Monitoring and Auto-Recovery',
    intro: [
      'Self-hosted GitLab looks like one web application but is really a dozen services behind a single URL: Puma serves the web, Sidekiq runs background jobs, PostgreSQL and Redis hold state, and Gitaly serves every git operation. A green sign-in page says nothing about whether CI is running or clones are fast.',
      'GitLab helps here by bundling Prometheus and exposing health and readiness endpoints, so most of what you need is already available if you watch it. The failures that hurt, a Sidekiq backlog or a slow Gitaly, live in the services behind the URL.',
    ],
    excerpt: 'Monitor self-hosted GitLab end to end: Puma, Sidekiq, PostgreSQL, Redis, and Gitaly, then safely auto-recover 502s, Sidekiq backlogs, and disk pressure.',
    keywords: 'gitlab monitoring, gitlab self-hosted, gitlab 502, gitlab sidekiq queue, gitaly, gitlab slow, gitlab prometheus, gitlab-ctl, gitlab disk full, gitlab auto recovery',
    processLabel: 'Puma and Sidekiq processes', dbLabel: 'PostgreSQL',
    stack: ['User / CI runner', 'Nginx + Workhorse', 'Puma + Sidekiq', 'PostgreSQL + Redis + Gitaly'],
    recover: 'restart a stuck Puma or Sidekiq process, clear a wedged job, or free disk from old artifacts',
    answerTitle: 'Watch Sidekiq and Gitaly, not just that the sign-in page loads.',
    answer: 'A real GitLab check should prove the URL answers, Puma is serving, Sidekiq is draining its queues, PostgreSQL and Redis are healthy, and Gitaly is serving git operations. GitLab bundles Prometheus and a built-in health endpoint, so most of this is already exposed if you watch it.',
    quickCmds: [['gitlab-ctl status', 'all services up?'], ['curl -I https://gitlab/-/health', 'health endpoint'], ['gitlab-ctl tail sidekiq', 'jobs draining?']],
    triage: [
      'Hit the built-in health and readiness endpoints (/-/health, /-/readiness) rather than only the sign-in page.',
      'Check Sidekiq queue depth and latency: a growing backlog means jobs (CI, emails, mirrors) are stalling even when the UI works.',
      'Check Gitaly and disk: slow or failing git clone and push almost always trace to Gitaly latency or a full repository disk.',
    ],
    falseRead: 'the sign-in page can render from Puma while Sidekiq is backed up and CI, webhooks, and emails silently stop.',
    monitorSub: 'GitLab is many services behind one URL. A healthy web page does not prove background jobs or git operations are working.',
    signals: [
      ['URL and health endpoints', 'journey', 'Poll /-/health and /-/readiness plus a real sign-in; readiness reports the dependent services GitLab needs.'],
      ['Puma workers', 'process', 'Web request workers; saturation or crashes surface as 502 and 503 through Workhorse and nginx.'],
      ['Sidekiq queues', 'jobs', 'Background job depth, latency, and failures; a backlog stalls CI, emails, mirroring, and housekeeping.'],
      ['PostgreSQL and Redis', 'database', 'GitLab core state and job/cache store; watch connections, slow queries, and Redis memory.'],
      ['Gitaly', 'git', 'Git RPC latency and errors, the real cause of slow or failing clone and push, plus its disk capacity.'],
      ['Disk and artifacts', 'capacity', 'Repos, CI artifacts, LFS, and the container registry fill disk fast; a full disk takes GitLab down.'],
    ],
    checksIntro: 'GitLab Omnibus ships gitlab-ctl and Prometheus, so start with the built-ins before adding anything.',
    checks: '# Every bundled service and its state\nsudo gitlab-ctl status\n\n# Built-in health and readiness (readiness lists dependent services)\ncurl -s https://your-gitlab/-/readiness?token=... | jq .\ncurl -s https://your-gitlab/-/health\n\n# Sidekiq queue depth and running jobs\nsudo gitlab-rails runner "puts Sidekiq::Queue.all.map { |q| [q.name, q.size] }.to_h"\n\n# Gitaly reachable and disk\nsudo gitlab-ctl tail gitaly | head\ndf -h /var/opt/gitlab',
    failures: [
      ['502 or 503 errors', 'Workhorse or nginx has no healthy Puma to serve: Puma is down, restarting after an upgrade, or out of memory.', 'Restart Puma with gitlab-ctl, check memory and the unicorn/puma logs, and confirm the upgrade or migration finished before reopening traffic.'],
      ['Sidekiq queue backing up', 'Jobs pile up when Sidekiq is stuck, under-resourced, or blocked on a slow database, stalling CI, emails, and mirrors.', 'Inspect queue latency and stuck jobs, restart Sidekiq, add concurrency or a dedicated queue, and fix the slow dependency behind the backlog.'],
      ['Slow or failing git clone and push', 'Git operations route through Gitaly; latency, a saturated disk, or a Gitaly fault makes clone and push slow or fail.', 'Check Gitaly latency and errors, free or expand repository disk, and restart Gitaly if wedged, then verify a test clone.'],
      ['Disk full', 'CI artifacts, job logs, LFS, and the registry grow quickly and a full disk takes the whole instance down.', 'Set artifact and log expiry, run housekeeping and registry garbage collection, and alert well before the volume fills.'],
      ['Stuck background migration', 'After an upgrade, batched background migrations can stall and block features or later upgrades.', 'Check migration status with gitlab-rails, resume or investigate the stuck batch, and hold the next upgrade until it completes.'],
    ],
    useCases: [
      ['CI/CD heavy teams', 'Sidekiq queues, runner availability, artifact disk', 'Pipelines stall, releases blocked'],
      ['Large monorepos', 'Gitaly latency, repository disk, pack housekeeping', 'Slow clone and push for everyone'],
      ['Enterprise / compliance', 'Readiness endpoint, PostgreSQL HA, audit and backups', 'Outage plus audit and recovery risk'],
      ['GitLab Pages / registry', 'Registry disk and garbage collection, object storage', 'Broken images and doc sites'],
      ['Geo / multi-node', 'Replication lag, node health, shared state', 'Stale replicas, failover gaps'],
    ],
    amIntro: 'GitLab hides a dozen services behind one URL, so a green sign-in page is misleading. AlertMend watches the readiness endpoint, Puma, Sidekiq queues, PostgreSQL, Redis, and Gitaly together, then turns a stall into a diagnosed, governed recovery.',
    sources: [
      ['GitLab: Monitoring GitLab (bundled Prometheus)', 'https://docs.gitlab.com/administration/monitoring/'],
      ['GitLab: Health Check endpoints', 'https://docs.gitlab.com/administration/monitoring/health_check/'],
      ['GitLab: Sidekiq administration', 'https://docs.gitlab.com/administration/sidekiq/'],
      ['GitLab: Gitaly documentation', 'https://docs.gitlab.com/administration/gitaly/'],
      ['GitLab: gitlab-ctl command reference', 'https://docs.gitlab.com/omnibus/maintenance/'],
    ],
    ctaTitle: 'See the GitLab backlog before your pipelines stall.',
    ctaSub: 'AlertMend watches Sidekiq, Gitaly, and PostgreSQL behind the GitLab URL, explains the root cause, and runs a governed restart before CI grinds to a halt.',
    heroKicker: 'GitLab reliability', heroTitle: 'GitLab Monitoring', heroSub: 'Puma, Sidekiq, Gitaly, PostgreSQL.',
    heroBullets: [['502', 'Puma down or mid-upgrade'], ['backlog', 'Sidekiq queues not draining'], ['slow git', 'Gitaly latency or full disk']],
    heroFoot: 'Watch the services behind the URL, not just the URL',
    related: [['odoo-monitoring', 'Odoo Monitoring'], ['exit-code-5', 'Exit Code 5'], ['503-no-healthy-upstream', '503 No Healthy Upstream']],
  },
  {
    slug: 'nextcloud-monitoring', app: 'Nextcloud', category: 'Monitoring',
    industries: [
      ['Healthcare', 'Encryption, audit, data residency, and uptime, where file access is patient-data compliance'],
      ['Legal and professional services', 'File locking, versioning, and backups, so document integrity is never in doubt'],
      ['Government and public sector', 'Self-hosted sovereignty, SSO, and scale, replacing consumer cloud with a controlled one'],
      ['Education', 'Large user counts, storage, and sync at term start, when everyone logs in at once'],
      ['Enterprises with data sovereignty needs', 'Backups, HA, and secure external access, to retire SaaS drives without losing reliability'],
    ],
    faqs: [
      ['Why are Nextcloud background jobs not running?', 'The admin overview warns when cron has not run recently, and scheduled tasks such as previews, cleanup, and notifications stop. Use the system cron method and schedule the background job runner every 5 minutes, then alert when the last run falls behind.'],
      ['Why is Nextcloud slow?', 'Slow sync and page loads usually mean a missing memory cache, no Redis, an overloaded database, or too few PHP workers. Configure APCu plus Redis, add PHP-FPM workers within your memory budget, and fix slow database queries.'],
      ['How do I get Nextcloud out of maintenance mode?', 'Confirm no upgrade is running, then run occ maintenance:mode --off, and verify the login and a sync path afterward. A stuck maintenance mode usually follows a failed upgrade or occ command.'],
      ['How do I monitor Nextcloud?', 'Poll the login or WebDAV endpoint from outside, and watch PHP-FPM, the database, Redis file locking, background job freshness, and data-disk space. The occ status command shows real instance state.'],
      ['What causes Nextcloud file locking errors?', 'Transactional file locking runs on Redis, so a down or misconfigured Redis breaks locking and blocks uploads and edits. Restore Redis, verify the locking configuration, and clear stale locks only if it is safe.'],
      ['How do I check Nextcloud status from the command line?', 'Run sudo -u www-data php occ status to see version, install state, and maintenance mode. The occ tool is the admin command line for most Nextcloud operations.'],
      ['Why is Nextcloud sync failing?', 'Sync breaks when background jobs stall, Redis file locking fails, or the data disk is full. Check job freshness, Redis, and free space, then verify a test upload and sync.'],
      ['How often should Nextcloud cron run?', 'Every 5 minutes using the system cron method is the recommended setup. The admin overview flags the instance when the last background run is too old.'],
      ['How do I fix slow Nextcloud uploads?', 'Check the PHP upload and memory limits, Redis file locking, chunking, and data-disk speed. Large files also need adequate PHP timeouts and memory to complete.'],
      ['How do I monitor Nextcloud with Prometheus and Grafana?', 'Use the nextcloud-exporter, which reads the serverinfo app and exposes metrics for Prometheus, then graph them in Grafana. It surfaces active users, shares, storage, database size, and app-update status, and pairs well with node and database exporters for host and DB health.'],
      ['What is status.php in Nextcloud?', 'status.php is a lightweight endpoint in the Nextcloud root that reports whether the instance is installed and not in maintenance mode, which makes it ideal for an external uptime check. For richer data, the serverinfo app returns a full JSON or XML report of users, storage, and health.'],
    ],
    prometheus: {
      intro: 'Nextcloud exposes health two ways out of the box: status.php for a simple up-or-down check, and the serverinfo app, which returns a full instance report in JSON or XML. The common Prometheus path is the nextcloud-exporter, which scrapes serverinfo into Prometheus and Grafana, and Netdata and Datadog integrations do the same.',
      setup: '# Simple up check (installed and not in maintenance mode)\ncurl -s https://your-nextcloud/status.php\n\n# Full instance report via the serverinfo app (needs an app password or NC-Token)\ncurl -s -u monitor:APP_TOKEN "https://your-nextcloud/ocs/v2.php/apps/serverinfo/api/v1/info?format=json"',
      metrics: ['active users over 5 minutes, 1 hour, and 24 hours', 'shares, files, and storage used', 'database size and type', 'available app updates and PHP memory'],
    },
    alerts: [
      ['Instance down', 'status.php not returning installed true'],
      ['Background jobs stale', 'last cron run older than about 15 minutes'],
      ['Data disk pressure', 'data volume above 80%'],
      ['Redis locking down', 'Redis unreachable, which breaks transactional file locking'],
      ['Database', 'connections or slow queries rising'],
      ['Maintenance mode stuck', 'maintenance mode on outside a planned window'],
    ],
    title: 'Nextcloud Monitoring and Auto-Recovery',
    h1: 'Nextcloud Monitoring and Auto-Recovery',
    intro: [
      'Nextcloud is a self-hosted file and collaboration platform built on PHP-FPM, a database, Redis for file locking and caching, and background jobs that must run on a schedule. It feels healthy at the login screen and fails quietly in the background, where sync, previews, and cleanup live.',
      'Monitoring Nextcloud well means watching those background jobs, Redis locking, the database, and data-directory storage, not just that the web login loads. The occ command line exposes real state that a browser check cannot see.',
    ],
    excerpt: 'Monitor self-hosted Nextcloud end to end: PHP-FPM, database, Redis locking, background jobs, and storage, then safely recover the common failures.',
    keywords: 'nextcloud monitoring, nextcloud slow, nextcloud background jobs not running, nextcloud maintenance mode, nextcloud file locking, nextcloud occ, nextcloud php-fpm, nextcloud auto recovery',
    processLabel: 'PHP-FPM workers', dbLabel: 'the database',
    stack: ['User / client', 'Nginx or Apache', 'PHP-FPM + Nextcloud', 'MySQL/Postgres + Redis'],
    recover: 'restart a wedged PHP-FPM pool, clear maintenance mode after a check, or trigger the background job runner',
    answerTitle: 'Watch background jobs and Redis locking, not just that the login page loads.',
    answer: 'A real Nextcloud check should prove the URL answers, PHP-FPM has free workers, the database is responsive, Redis transactional file locking is healthy, background jobs are running (ideally via system cron), and the data directory has space. The web login can work while sync and background jobs are quietly broken.',
    quickCmds: [['sudo -u www-data php occ status', 'app + maintenance state'], ['systemctl status php8.2-fpm', 'workers alive?'], ['redis-cli ping', 'file locking store']],
    triage: [
      'Run occ status to see version, maintenance mode, and whether the instance is installed and healthy.',
      'Check when background jobs last ran: the admin overview warns if cron has not executed recently.',
      'Check Redis (used for transactional file locking) and PHP memory: locking errors and slow sync usually trace here.',
    ],
    falseRead: 'the login page can load while background jobs have not run for hours, so sync, notifications, and previews silently fall behind.',
    monitorSub: 'Nextcloud feels fine at login and fails in the background. Watch jobs, locking, and storage, not just the front page.',
    signals: [
      ['URL and login', 'journey', 'Poll the login and a WebDAV or sync endpoint from outside; alert on non-200 or slow responses.'],
      ['PHP-FPM workers', 'process', 'Busy vs max_children and request queueing; exhausted workers cause slow sync and 502 errors.'],
      ['Database', 'database', 'MySQL, MariaDB, or PostgreSQL health: connections, slow queries, and locks that stall file operations.'],
      ['Redis locking and cache', 'cache', 'Transactional file locking and memory caching run on Redis; a down Redis breaks locking and slows everything.'],
      ['Background jobs (cron)', 'jobs', 'Confirm system cron runs the background job runner every 5 minutes; stalled jobs break previews, sync, and cleanup.'],
      ['Data directory storage', 'capacity', 'The data directory and its disk or object store; a full data volume stops uploads and can wedge the instance.'],
    ],
    checksIntro: 'The occ command-line tool is the fastest way to see real Nextcloud state from the host.',
    checks: '# App state, version, and maintenance mode\nsudo -u www-data php occ status\n\n# Is the instance in maintenance mode? (turn off after checks)\nsudo -u www-data php occ maintenance:mode\n\n# Run the background job runner manually to confirm it works\nsudo -u www-data php occ background:cron\n\n# Redis reachable (file locking + cache)\nredis-cli ping\n\n# Data directory free space\ndf -h /var/www/nextcloud/data',
    failures: [
      ['Background jobs not running', 'The admin overview warns that cron has not run; scheduled tasks (previews, cleanup, notifications, sync housekeeping) stop.', 'Switch to the system cron method, schedule the background runner every 5 minutes, and alert when the last run falls behind.'],
      ['Nextcloud is slow', 'Slow sync and page loads usually mean a missing memory cache, no Redis, an overloaded database, or too few PHP workers.', 'Configure APCu plus Redis, add PHP-FPM workers within memory budget, and index or fix slow database queries.'],
      ['Stuck in maintenance mode', 'After an upgrade or failed occ command the instance stays in maintenance mode and refuses normal access.', 'Confirm no upgrade is running, then clear maintenance mode with occ, and verify the login and a sync path afterward.'],
      ['File locking errors', 'Transactional file locking errors appear when Redis is down or misconfigured, blocking uploads and edits.', 'Restore Redis, verify the locking configuration, and, only if safe, clear stale locks, then confirm uploads work.'],
      ['Data disk full', 'A full data volume stops all uploads and can leave operations half-completed.', 'Alert well before full, expand or clean the data volume and trash, and verify uploads after freeing space.'],
    ],
    useCases: [
      ['Team file sync', 'Background jobs, Redis locking, WebDAV latency', 'Sync stalls, stale files'],
      ['Large media libraries', 'Data disk and object storage, preview generation jobs', 'Failed uploads, missing previews'],
      ['Collabora / OnlyOffice editing', 'Document server health, websockets, memory', 'Live editing breaks'],
      ['Regulated / private cloud', 'Encryption, audit, backups, self-hosted control', 'Compliance and recovery risk'],
      ['Remote workforce', 'External URL and login uptime, TLS expiry', 'Everyone locked out at once'],
    ],
    amIntro: 'Nextcloud looks healthy at the login screen and fails quietly in the background. AlertMend watches background jobs, Redis locking, the database, and data storage alongside the URL, then explains and recovers the failure with an approved runbook.',
    sources: [
      ['Nextcloud: Background jobs configuration', 'https://docs.nextcloud.com/server/latest/admin_manual/configuration_server/background_jobs_configuration.html'],
      ['Nextcloud: Memory caching and Redis', 'https://docs.nextcloud.com/server/latest/admin_manual/configuration_server/caching_configuration.html'],
      ['Nextcloud: Transactional file locking', 'https://docs.nextcloud.com/server/latest/admin_manual/configuration_files/files_locking_transactional.html'],
      ['Nextcloud: Using the occ command', 'https://docs.nextcloud.com/server/latest/admin_manual/occ_command.html'],
      ['Nextcloud: Server tuning', 'https://docs.nextcloud.com/server/latest/admin_manual/installation/server_tuning.html'],
    ],
    ctaTitle: 'Catch the Nextcloud job that quietly stopped running.',
    ctaSub: 'AlertMend watches background jobs, Redis locking, and data storage behind the login page, explains the failure, and recovers it before sync falls apart.',
    heroKicker: 'Nextcloud reliability', heroTitle: 'Nextcloud Monitoring', heroSub: 'Jobs, Redis locking, database, storage.',
    heroBullets: [['slow', 'no cache, DB load, few workers'], ['jobs', 'cron not running in background'], ['locking', 'Redis down breaks file locking']],
    heroFoot: 'Watch background jobs, not just the login page',
    related: [['odoo-monitoring', 'Odoo Monitoring'], ['wordpress-monitoring', 'WordPress Monitoring'], ['top-kubernetes-cost-management-solutions', 'Kubernetes Cost']],
  },
  {
    slug: 'mattermost-rocketchat-monitoring', app: 'Mattermost and Rocket.Chat', category: 'Monitoring',
    industries: [
      ['Defense and government', 'Self-hosted, air-gapped operation with audit, where messaging must stay sovereign'],
      ['Financial services', 'Compliance, message retention, and SSO for regulated, auditable communication'],
      ['Healthcare', 'Data residency, retention, and uptime for secure clinical and operational chat'],
      ['Software and DevOps teams', 'Incident war rooms, integrations, and webhooks that must hold up during an outage'],
      ['Large communities (Rocket.Chat)', 'MongoDB oplog health and scale, so live engagement does not fall behind'],
    ],
    faqs: [
      ['Why is the Mattermost or Rocket.Chat websocket not working?', 'The reverse proxy is not forwarding the websocket upgrade to the chat port, so pages load but live messages do not appear. Add the Upgrade and Connection headers and the correct port to the proxy, then confirm a 101 response.'],
      ['How do I monitor Mattermost?', 'Poll the /api/v4/system/ping endpoint and confirm the websocket upgrade, and watch the process, PostgreSQL, and file storage. A page that loads is not proof that messages are flowing.'],
      ['How do I monitor Rocket.Chat?', 'Poll /api/info and confirm the MongoDB replica set and oplog are healthy, since real-time updates depend on them, and watch the Node process memory and file storage. Live messaging fails when the oplog lags.'],
      ['Why is Rocket.Chat slow or using high CPU or memory?', 'It is often MongoDB oplog issues, very large rooms, or a bad integration loading the Node process. Check the replica set and oplog, restart to reclaim memory, and scale to multiple instances behind the proxy.'],
      ['Does Rocket.Chat need a MongoDB replica set?', 'Yes. Rocket.Chat needs a replica set with a working oplog for real-time updates, and a standalone MongoDB breaks live messaging. Run a replica set and watch replication lag and the oplog window.'],
      ['How do I check Mattermost health?', 'Curl /api/v4/system/ping for status and run pg_isready for PostgreSQL, and add a websocket upgrade check. Together these prove the app, database, and real-time path are working.'],
      ['Why are push notifications not working?', 'The push proxy or gateway certificate or connectivity has failed, so mobile users stop being notified. Check the push proxy status and certificates and confirm outbound connectivity.'],
      ['Why do messages not appear in real time?', 'Either the websocket is broken at the proxy, or for Rocket.Chat the MongoDB oplog is lagging. Verify the proxy forwards the websocket and that the replica set is healthy.'],
      ['How do I restart Mattermost or Rocket.Chat safely?', 'Restart the service with systemd or Docker, wait for the health or ping endpoint to pass, and verify a test login and a live message before closing the incident.'],
      ['How do I monitor Mattermost with Prometheus and Grafana?', 'Enable Performance Monitoring in the Mattermost System Console (Enterprise) and set a listen address such as port 8067, then scrape it with Prometheus and import the Mattermost Grafana dashboards. Key metrics include mattermost_api_time plus cache, cluster, and login metrics, and Mattermost recommends running Prometheus and Grafana on separate servers.'],
      ['What port does Rocket.Chat expose metrics on?', 'Rocket.Chat exposes Prometheus metrics on port 9458 when metrics are enabled in the admin settings. Those metrics include Node.js event-loop lag, heap and garbage collection, messages sent, oplog activity, and push-queue size, which map to the real-time health of the server.'],
    ],
    prometheus: {
      intro: 'Both platforms expose Prometheus metrics natively. In Mattermost (Enterprise), enable Performance Monitoring in the System Console and set a listen address such as port 8067; it exposes mattermost_api_time plus cache, cluster, and login metrics with Mattermost-provided Grafana dashboards. Rocket.Chat exposes metrics on port 9458 when enabled, including Node.js event-loop lag, heap and GC, messages, oplog activity, and push-queue size.',
      setup: '# Rocket.Chat metrics (enable in Admin, then scrape port 9458)\ncurl -s http://your-rocketchat:9458/metrics | head\n\n# Mattermost metrics (Enterprise; set the listen address in the System Console)\ncurl -s http://your-mattermost:8067/metrics | head',
      metrics: ['Node.js event-loop lag, heap, and GC (Rocket.Chat)', 'mattermost_api_time and cluster metrics (Mattermost)', 'messages sent and websocket or DDP sessions', 'oplog activity and push-queue size'],
    },
    alerts: [
      ['Chat down or websocket failing', 'the ping or info endpoint failing, or the websocket upgrade not returning 101'],
      ['Event-loop lag (Rocket.Chat)', 'Node.js event-loop lag rising, which slows the UI and messages'],
      ['MongoDB oplog (Rocket.Chat)', 'replica set unhealthy or the oplog window shrinking'],
      ['Memory', 'the app process memory climbing toward the host limit'],
      ['Push queue backing up', 'the push-notification queue growing, so mobile users miss alerts'],
      ['Database (Mattermost)', 'PostgreSQL connections or latency rising'],
    ],
    title: 'Mattermost and Rocket.Chat Monitoring',
    h1: 'Mattermost and Rocket.Chat Monitoring and Auto-Recovery',
    intro: [
      'Mattermost and Rocket.Chat are self-hosted team chat platforms where the value is real-time messaging, and that depends on a websocket and a healthy database. Mattermost runs a Go server on PostgreSQL, and Rocket.Chat runs a Node server on MongoDB and needs a replica set with a working oplog for live updates.',
      'A page that loads over HTTP is not proof that messages are flowing, because the websocket upgrade can fail at the proxy while login still works. Monitoring team chat means watching the websocket, the app process, and the database together.',
    ],
    excerpt: 'Monitor self-hosted Mattermost and Rocket.Chat: websockets, the app process, PostgreSQL or MongoDB, and file storage, then safely recover common failures.',
    keywords: 'mattermost monitoring, rocket.chat monitoring, mattermost websocket, rocket.chat mongodb oplog, mattermost health check, rocket.chat slow, self-hosted chat monitoring, mattermost auto recovery',
    processLabel: 'chat server process', dbLabel: 'the database',
    stack: ['User / client', 'Reverse proxy + WSS', 'Chat server process', 'PostgreSQL or MongoDB'],
    recover: 'restart a wedged chat process, restore a lagging database replica path, or fix a websocket route',
    answerTitle: 'Watch the websocket, not just that the login page loads.',
    answer: 'A real check for Mattermost or Rocket.Chat should prove the URL answers, the websocket connects (real-time messaging depends on it), the app process is healthy, and the database is responsive: PostgreSQL for Mattermost, MongoDB with a working replica set and oplog for Rocket.Chat. Messages fail to appear live when the websocket or database is degraded even if the page loads.',
    quickCmds: [['curl -I https://chat/', 'is it answering?'], ['curl https://mm/api/v4/system/ping', 'Mattermost health'], ['mongosh --eval "rs.status()"', 'Rocket.Chat replica set']],
    triage: [
      'Confirm the reverse proxy forwards the websocket upgrade: real-time messaging breaks when WSS is not proxied even though pages load.',
      'Check the app process and memory: Rocket.Chat (Node) can climb in memory, Mattermost (Go) is lighter but still crashes under bad config.',
      'Check the database: PostgreSQL health for Mattermost, and for Rocket.Chat the MongoDB replica set status and oplog, which it needs for real-time updates.',
    ],
    falseRead: 'the page can load over HTTP while the websocket upgrade fails, so login works but new messages never appear live.',
    monitorSub: 'Team chat is a real-time app. A loading page is not proof that messages are flowing.',
    signals: [
      ['URL and websocket', 'journey', 'Poll the HTTP endpoint and confirm the WSS upgrade succeeds; live messaging depends on the websocket.'],
      ['App process and memory', 'process', 'The Mattermost (Go) or Rocket.Chat (Node) process; watch restarts and, for Rocket.Chat, memory growth.'],
      ['Database', 'database', 'PostgreSQL for Mattermost; MongoDB replica set health and oplog for Rocket.Chat, required for real-time updates.'],
      ['Reverse proxy WSS', 'proxy', 'The proxy must forward Upgrade and Connection headers to the chat port, or websockets silently fail.'],
      ['File storage', 'storage', 'Local disk or S3 for attachments; a full or unreachable store breaks uploads and previews.'],
      ['Push notifications', 'delivery', 'The push proxy or gateway; failures mean mobile users stop getting notified even when chat works.'],
    ],
    checksIntro: 'Both apps expose a health or ping endpoint; pair it with a database and websocket check.',
    checks: '# Mattermost system ping (returns status)\ncurl -s https://your-mattermost/api/v4/system/ping\n\n# Rocket.Chat basic info / health\ncurl -s https://your-rocketchat/api/info\n\n# Rocket.Chat MongoDB replica set (oplog needed for real-time)\nmongosh --quiet --eval "rs.status().ok"\n\n# Mattermost PostgreSQL reachable\npg_isready -h 127.0.0.1 -p 5432\n\n# Confirm the websocket upgrade is proxied (expect HTTP 101)\ncurl -sI -o /dev/null -w "%{http_code}" -H "Connection: Upgrade" -H "Upgrade: websocket" https://your-chat/',
    failures: [
      ['Websocket not connecting', 'Login works but messages do not appear live because the reverse proxy is not forwarding the websocket upgrade to the chat port.', 'Add the Upgrade and Connection headers and correct port to the proxy config, then confirm a 101 response and live message delivery.'],
      ['Rocket.Chat high memory or CPU', 'The Node process climbs in memory or CPU, often from MongoDB oplog issues, large rooms, or a bad integration.', 'Check the MongoDB replica set and oplog, restart the instance to reclaim memory, and scale to multiple instances behind the proxy.'],
      ['MongoDB replica or oplog issues', 'Rocket.Chat needs a replica set with a working oplog for real-time updates; a standalone or lagging Mongo breaks live messaging.', 'Run MongoDB as a replica set, watch replication lag and oplog window, and restore a healthy secondary before it stalls updates.'],
      ['Mattermost 500 or crash', 'A bad config, failed migration, or PostgreSQL problem takes the Mattermost process down or into an error loop.', 'Read the server log, verify PostgreSQL and the config, restart the service, and verify the ping endpoint and a test login.'],
      ['Push notifications failing', 'Mobile users stop getting notified when the push proxy or gateway certificate or connectivity fails.', 'Check the push proxy status and certificates, confirm outbound connectivity, and alert on push delivery failures.'],
    ],
    useCases: [
      ['Company-wide chat', 'Websocket uptime, app process, database', 'Whole company loses real-time comms'],
      ['Incident / ops war rooms', 'Message latency, push notifications, integrations', 'Alerts and coordination stall'],
      ['Regulated / self-hosted', 'Data residency, audit, backups, TLS', 'Compliance and recovery risk'],
      ['Large communities (Rocket.Chat)', 'MongoDB oplog and lag, memory, instance scaling', 'Live updates fall behind'],
      ['Mobile-heavy teams', 'Push gateway health, websocket, session', 'Users miss messages on mobile'],
    ],
    amIntro: 'Chat looks up when the login page loads, but real-time messaging lives in the websocket and the database. AlertMend watches the WSS upgrade, the app process, and PostgreSQL or MongoDB together, then explains and recovers the failure safely.',
    sources: [
      ['Mattermost: Deployment guide and health', 'https://docs.mattermost.com/deploy/server/deployment-guide.html'],
      ['Mattermost: Proxy and WebSocket configuration', 'https://docs.mattermost.com/configure/proxy-nginx.html'],
      ['Rocket.Chat: Deploy with Docker and MongoDB', 'https://docs.rocket.chat/docs/deploy-with-docker-docker-compose'],
      ['Rocket.Chat: MongoDB and replica set', 'https://docs.rocket.chat/docs/mongodb'],
      ['MongoDB: Check replica set status (rs.status)', 'https://www.mongodb.com/docs/manual/reference/method/rs.status/'],
    ],
    ctaTitle: 'Catch the chat websocket failure before your team does.',
    ctaSub: 'AlertMend watches the websocket, the chat process, and the database behind your Mattermost or Rocket.Chat URL, explains the root cause, and recovers it safely.',
    heroKicker: 'Team chat reliability', heroTitle: 'Chat Monitoring', heroSub: 'Mattermost and Rocket.Chat, real-time.',
    heroBullets: [['websocket', 'proxy not forwarding the upgrade'], ['memory', 'Rocket.Chat Node process climbs'], ['oplog', 'MongoDB replica set required']],
    heroFoot: 'Watch the websocket, not just the page',
    related: [['odoo-monitoring', 'Odoo Monitoring'], ['gitlab-monitoring', 'GitLab Monitoring'], ['503-no-healthy-upstream', '503 No Healthy Upstream']],
  },
  {
    slug: 'jira-confluence-monitoring', app: 'Jira and Confluence Data Center', category: 'Monitoring',
    industries: [
      ['Financial services', 'Data Center compliance, HA, and performance at scale for regulated delivery'],
      ['Government and public sector', 'Self-hosted or air-gapped operation with audit, for sovereignty and control'],
      ['Large enterprises', 'Multi-node cluster, shared home, and thousands of users on org-wide tracking'],
      ['Healthcare and pharma', 'Validated environments, audit, and uptime for compliant project tracking'],
      ['High-growth software orgs', 'Index and Synchrony performance under heavy concurrency, to protect team velocity'],
    ],
    faqs: [
      ['How do I fix a Jira or Confluence OutOfMemoryError?', 'A node ran out of JVM heap, so take a heap dump for root cause, right-size Xmx to the workload, tune the garbage collector, and restart the node. Watch GC pause time afterward to confirm the fix.'],
      ['Why is Jira or Confluence slow?', 'Slowness usually traces to long GC pauses on a node, a saturated database, or a slow shared-home NFS mount. Correlate GC, database, and NFS latency, then fix the saturated layer and rebalance the node.'],
      ['How do I monitor Jira Data Center?', 'Atlassian exposes JMX metrics, so watch per-node JVM heap and GC, the database, the shared home, cluster membership, and the search index, plus each node URL. A single healthy node can hide a degraded cluster.'],
      ['What is the shared home in Data Center?', 'It is a directory, usually on NFS, shared by all nodes for attachments, index snapshots, and configuration. NFS latency or an outage degrades or breaks the whole cluster, so it is critical to monitor.'],
      ['Why will a Data Center node not join the cluster?', 'Node-to-node connectivity or the cluster configuration is wrong after a restart or network change. Check connectivity and the cluster config, resolve the issue, and confirm the node rejoins.'],
      ['Why is Confluence collaborative editing broken?', 'Synchrony is unhealthy or not reachable through the proxy, and it powers collaborative editing. Check Synchrony status and the websocket path, restart Synchrony, and verify live co-editing.'],
      ['How do I tune Jira or Confluence JVM heap?', 'Set Xmx to your workload and available RAM, avoiding oversizing that lengthens GC pauses, and monitor GC pause time. Take a heap dump when an OutOfMemoryError occurs to find the cause.'],
      ['How do I check Jira health per node?', 'Hit each node status endpoint behind the load balancer and watch JVM and GC per node. A single healthy node can mask another node in trouble.'],
      ['Why does Jira freeze intermittently?', 'A node is stuck in garbage collection while the load balancer routes around it, so the site feels slow in bursts. Watch GC pause time per node and restart or rebalance the affected node.'],
      ['How do I enable JMX monitoring in Jira or Confluence?', 'In Jira, go to Administration, then System, then JMX monitoring, and toggle it on; Confluence has the equivalent setting. Then read the MBeans with a JMX client or a JMX exporter. Use remote JMX for production rather than local monitoring, which adds load to the node, and do not refresh the metrics more than about once per second.'],
      ['What JVM heap threshold should I alert on for Data Center?', 'Atlassian recommends alerting when JVM heap usage exceeds about 80% of the available capacity on a node. Pair that with GC pause time, since a node can spend most of its time in garbage collection before it hits an OutOfMemoryError, and watch each node separately because a load balancer hides a single bad node.'],
    ],
    prometheus: {
      intro: 'Atlassian Data Center exposes metrics over JMX. Enable JMX monitoring in the admin console (Jira: Administration, System, JMX monitoring; Confluence has the equivalent), then read the MBeans. For production use remote JMX rather than local, which adds load, and do not poll more than about once per second. To pull JMX into Prometheus or an APM tool, run a JMX exporter that converts the MBeans.',
      setup: '# Enable JMX in the admin console, then run a JMX exporter (Java agent)\n# on each node to convert MBeans for Prometheus and Grafana.\n# Watch JVM heap, GC pause time, DB pool, and the shared-home mount per node.',
      metrics: ['JVM heap used and GC pause time per node', 'database connection pool usage', 'request throughput and latency', 'cluster node count and search index health'],
    },
    alerts: [
      ['JVM heap high', 'heap above 80% of capacity on a node (Atlassian recommended threshold)'],
      ['GC thrash', 'garbage-collection pause time rising or frequent full collections'],
      ['Node down or not joined', 'a cluster node missing from the cluster'],
      ['Shared home slow', 'NFS latency rising or the mount unavailable'],
      ['Database', 'connection pool near max or slow queries'],
      ['Synchrony down (Confluence)', 'the collaborative-editing service unhealthy'],
    ],
    title: 'Jira and Confluence DC Monitoring',
    h1: 'Jira and Confluence Data Center Monitoring and Recovery',
    intro: [
      'Jira and Confluence Data Center run as a cluster of JVM application nodes on a shared home directory and a shared database, sized for large teams and high concurrency. Because a load balancer spreads traffic across nodes, one healthy node can hide another that is stuck in garbage collection or failed to join the cluster.',
      'Monitoring Data Center means watching each node individually: JVM heap and GC, the database, the shared home over NFS, cluster membership, and the search index. The classic outage is a node in GC death that the balancer routes around until the whole cluster degrades.',
    ],
    excerpt: 'Monitor Jira and Confluence Data Center: JVM heap and GC, database, shared home, cluster nodes, and the index, then recover the common failures safely.',
    keywords: 'jira monitoring, confluence monitoring, jira data center, jira outofmemoryerror, jira heap, confluence synchrony, jira cluster node, shared home, jira slow, atlassian monitoring',
    processLabel: 'JVM application nodes', dbLabel: 'the database',
    stack: ['User / API', 'Load balancer', 'JVM app nodes', 'Database + shared home'],
    recover: 'restart a node with GC pressure, rejoin a node to the cluster, or fail traffic away from an unhealthy node',
    answerTitle: 'Watch JVM heap, the shared home, and the cluster, not just the login page.',
    answer: 'A real Jira or Confluence Data Center check should prove the URL answers on each node, JVM heap and garbage collection are healthy, the database is responsive, the shared home (NFS) is reachable and fast, cluster nodes are all joined, and the search index is current. Data Center runs multiple JVM nodes, so a single healthy node can mask a degraded cluster.',
    quickCmds: [['curl -I https://jira/status', 'node status'], ['jstat -gcutil <pid> 1s 3', 'JVM GC pressure'], ['mount | grep shared', 'shared home mounted?']],
    triage: [
      'Check each node individually behind the load balancer, not just the shared URL: one node can be in GC death while others serve.',
      'Check JVM heap and GC (jstat or the built-in metrics): long GC pauses are the classic cause of a slow or frozen instance.',
      'Check the shared home and database: a slow NFS mount or a saturated database degrades every node at once.',
    ],
    falseRead: 'the load balancer can route around a node stuck in garbage collection, so the site feels slow intermittently while every node looks up.',
    monitorSub: 'Data Center is a JVM cluster on shared storage. Health means every node, the database, and the shared home, not one URL.',
    signals: [
      ['Per-node URL and status', 'journey', 'Poll each node behind the balancer plus a real login or API call; a single node in trouble is easy to miss.'],
      ['JVM heap and GC', 'runtime', 'Heap usage and garbage-collection pause time per node; long pauses and near-full heap cause freezes and OutOfMemoryError.'],
      ['Database', 'database', 'PostgreSQL, MySQL, or Oracle health: connections, slow queries, and locks that stall every node.'],
      ['Shared home (NFS)', 'storage', 'Data Center nodes share a home directory; NFS latency or an outage degrades or breaks the whole cluster.'],
      ['Cluster membership', 'cluster', 'All nodes must be joined and communicating; a node that fails to join reduces capacity and can split behavior.'],
      ['Search index and Synchrony', 'app', 'Jira and Confluence rely on a Lucene index; Confluence collaborative editing needs Synchrony to be healthy.'],
    ],
    checksIntro: 'Combine the Atlassian status endpoints with standard JVM and mount checks per node.',
    checks: '# Node status endpoint (per node, behind the balancer)\ncurl -s https://your-jira/status\n\n# JVM garbage-collection pressure (watch the last two columns)\njstat -gcutil <jira_pid> 1s 3\n\n# Shared home mounted and responsive\nmount | grep -i shared-home\ntime ls /var/atlassian/application-data/shared-home > /dev/null\n\n# Database reachable\npg_isready -h db-host -p 5432\n\n# Thread and heap dump when a node is wedged (for RCA)\njstack <jira_pid> > /tmp/jira-threads.txt',
    failures: [
      ['OutOfMemoryError or GC thrash', 'A node runs out of heap or spends most of its time in garbage collection, freezing that node and dropping requests.', 'Take a heap dump for RCA, right-size Xmx to the workload, tune the collector, and restart the node, then watch GC after.'],
      ['Slow instance', 'Intermittent slowness usually traces to GC pauses on a node, a saturated database, or a slow shared-home NFS mount.', 'Correlate GC, database, and NFS latency, fix the saturated layer, and rebalance or restart the affected node.'],
      ['Shared home unavailable', 'Data Center nodes depend on the shared home; NFS latency or an outage degrades or breaks the whole cluster.', 'Restore or fail over the NFS export, verify latency, and confirm every node can read and write the shared home.'],
      ['Cluster node will not join', 'A node fails to join the cluster after a restart or network change, cutting capacity and risking inconsistent behavior.', 'Check node-to-node connectivity and the cluster config, resolve the network or config issue, and confirm the node rejoins.'],
      ['Confluence Synchrony down', 'Collaborative editing in Confluence breaks when Synchrony is unhealthy or not reachable through the proxy.', 'Check Synchrony status and the proxy websocket path, restart Synchrony, and verify live co-editing works.'],
    ],
    useCases: [
      ['Enterprise Jira DC', 'Per-node JVM heap, database, cluster health', 'Company-wide project tracking down'],
      ['Confluence knowledge base', 'Synchrony, index freshness, shared home', 'Editing breaks, stale search'],
      ['Regulated / air-gapped', 'Self-hosted control, audit, backups, HA', 'Compliance and recovery risk'],
      ['High-concurrency teams', 'Thread pools, GC pause time, DB connections', 'Freezes under peak load'],
      ['Large attachments / history', 'Shared home capacity and NFS latency', 'Slow attachments, failed saves'],
    ],
    amIntro: 'Data Center spreads load across JVM nodes on shared storage, so one healthy node hides a degraded cluster. AlertMend watches heap and GC per node, the database, the shared home, and cluster membership together, then explains and recovers the failure safely.',
    sources: [
      ['Atlassian: Jira Data Center monitoring', 'https://confluence.atlassian.com/adminjiraserver/live-monitoring-using-the-jmx-interface-939707304.html'],
      ['Atlassian: Confluence Data Center monitoring', 'https://confluence.atlassian.com/doc/live-monitoring-using-the-jmx-interface-1005780208.html'],
      ['Atlassian: Jira Data Center memory and JVM', 'https://confluence.atlassian.com/adminjiraserver/increasing-jira-application-memory-938846867.html'],
      ['Atlassian: Confluence shared home directory', 'https://confluence.atlassian.com/doc/set-up-a-confluence-data-center-cluster-982322030.html'],
      ['Atlassian: Confluence Synchrony for collaborative editing', 'https://confluence.atlassian.com/doc/administering-collaborative-editing-858771779.html'],
    ],
    ctaTitle: 'Catch the Data Center node in GC death before users feel it.',
    ctaSub: 'AlertMend watches JVM heap, the shared home, the database, and cluster health across your Jira and Confluence nodes, explains the root cause, and recovers safely.',
    heroKicker: 'Atlassian DC reliability', heroTitle: 'Jira & Confluence', heroSub: 'JVM heap, shared home, cluster.',
    heroBullets: [['OOM', 'JVM heap exhausted or GC thrash'], ['shared home', 'NFS latency hits every node'], ['cluster', 'a node fails to join']],
    heroFoot: 'Watch every node, not one URL',
    related: [['odoo-monitoring', 'Odoo Monitoring'], ['optimizing-elasticsearch-heap-memory', 'Elasticsearch Heap'], ['gitlab-monitoring', 'GitLab Monitoring']],
  },
  {
    slug: 'metabase-monitoring', app: 'Metabase', category: 'Monitoring',
    industries: [
      ['SaaS and tech', 'Embedded analytics, query latency, and the app database behind customer-facing dashboards'],
      ['E-commerce and retail', 'Sales dashboards, data-source load, and scheduled reports that drive daily decisions'],
      ['Fintech and finance', 'A real application database (not H2), audit, and scheduled reports for numbers people trust'],
      ['Marketing and growth', 'Dashboard concurrency and caching, so self-serve reporting stays fast'],
      ['Operations and logistics', 'Real-time source queries with timeouts, for live operational visibility'],
    ],
    faqs: [
      ['How do I fix a Metabase OutOfMemoryError?', 'The JVM ran out of heap, usually from a query returning a huge result set or many heavy dashboards at once. Take a heap dump for root cause, raise the JVM Xmx within host limits, cap result rows, and cache expensive questions.'],
      ['Why is Metabase slow?', 'Slow dashboards trace to slow queries on the underlying data source, a saturated application database, or heap pressure. Identify the slow query and source, add caching and query timeouts, and scale heap or the warehouse.'],
      ['Should I use the H2 database for Metabase in production?', 'No. The default embedded H2 file can corrupt on a crash or disk-full and is not recommended for production. Migrate the application database to PostgreSQL or MySQL and back it up.'],
      ['How do I monitor Metabase?', 'Poll the /api/health endpoint and watch JVM heap and GC, the application database, data-source connections, and scheduled-task success. A cached dashboard can render while queries time out.'],
      ['Why are Metabase scheduled reports not sending?', 'The scheduler, email, or Slack integration failed, often silently. Monitor scheduled-task success and verify the email or Slack integration, and alert when a pulse fails.'],
      ['How do I migrate Metabase from H2 to PostgreSQL?', 'Use the built-in load-from-h2 migration to move the application database to PostgreSQL, then back it up. Treat the migration as the durable production fix rather than staying on H2.'],
      ['Why does a Metabase dashboard hang?', 'The underlying data source is down, slow, or at its connection limit, so queries never return. Set query timeouts and watch data-source connectivity so the dashboard fails fast instead of hanging.'],
      ['How much memory does Metabase need?', 'Size the JVM Xmx to your concurrency and query result sizes, since large exports and many dashboards drive heap use. Monitor GC and cap result rows to keep memory in check.'],
      ['How do I check if Metabase is healthy?', 'Curl the /api/health endpoint, which returns 200 when ready, and pair it with JVM and application-database checks. That confirms the app, heap, and its database are all working.'],
      ['How much memory does Metabase need per user?', 'As of Metabase v52 and newer, a rough guide is 1 GB of JVM heap per 20 concurrent users, and a PostgreSQL application database needs about 1 CPU core and 1 GB of RAM per 40 concurrent users. Leave 1 to 2 GB of RAM on the host for the operating system, and raise Xmx gradually rather than allocating all available memory.'],
      ['What does a sawtooth memory pattern in Metabase mean?', 'It means Metabase quickly fills the heap, garbage collection frees it, and it fills again, over and over, which ties up CPU and slows the app. It is a sign of heap pressure from large query results or too many concurrent dashboards, so cap result rows, cache expensive questions, and raise heap within host limits.'],
    ],
    prometheus: {
      intro: 'Metabase runs on the JVM, so the standard approach is JMX plus a tool like VisualVM to watch heap, GC, and threads, with the /api/health endpoint for liveness. Pro and Enterprise plans add Usage Analytics for query volume and performance. Watch for the sawtooth memory pattern, where Metabase fills the heap, triggers GC, and repeats, tying up CPU.',
      setup: '# Liveness\ncurl -s -o /dev/null -w "%{http_code}" https://your-metabase/api/health\n\n# Enable JMX and attach VisualVM (bundled with the JDK) to watch heap and GC,\n# or run a JMX exporter to bring the same metrics into Prometheus and Grafana.',
      metrics: ['JVM heap used and GC pause time (watch for the sawtooth)', 'thread count and blocked threads', 'application-database connections and latency', 'query execution time and concurrency'],
    },
    alerts: [
      ['Not healthy', 'the /api/health endpoint not returning 200'],
      ['Heap pressure', 'JVM heap above 85% or a sustained GC sawtooth'],
      ['Under-sized for load', 'concurrent users above roughly 20 per 1 GB of heap (v52+ sizing)'],
      ['Application database', 'app DB connections or latency rising; never run H2 in production'],
      ['Slow dashboards', 'query execution time above baseline on a data source'],
      ['Scheduled reports failing', 'a pulse or subscription run fails'],
    ],
    title: 'Metabase Monitoring and Auto-Recovery',
    h1: 'Metabase Monitoring and Auto-Recovery',
    intro: [
      'Metabase is a self-hosted business intelligence app that runs on the JVM and leans on two kinds of database: its own application database for state, and the data sources it queries for dashboards. Run in production it should use PostgreSQL or MySQL for that application database, not the default embedded H2 file.',
      'A cached dashboard can render instantly while the JVM is thrashing on heap and new queries time out, so monitoring Metabase means watching heap and garbage collection, the application database, data-source connections, and scheduled reports, not just that a chart loads.',
    ],
    excerpt: 'Monitor self-hosted Metabase: JVM heap, the application database, data-source connections, and scheduled reports, then recover the common failures safely.',
    keywords: 'metabase monitoring, metabase slow, metabase out of memory, metabase h2 database, metabase application database, metabase postgres, metabase scheduled reports, metabase auto recovery',
    processLabel: 'JVM process', dbLabel: 'the application database',
    stack: ['User / dashboard', 'Reverse proxy', 'Metabase JVM', 'App DB + data sources'],
    recover: 'restart a JVM under memory pressure, restore the application database connection, or re-run a failed scheduled report',
    answerTitle: 'Watch JVM heap and the app database, not just that a dashboard loads.',
    answer: 'A real Metabase check should prove the URL answers, JVM heap and garbage collection are healthy, the application database is responsive (use PostgreSQL, not the default H2, in production), connections to your data sources are alive, and scheduled reports and alerts are sending. A single cached dashboard can load while heavy queries are exhausting memory.',
    quickCmds: [['curl -s https://mb/api/health', 'Metabase health'], ['jstat -gcutil <pid> 1s 3', 'JVM GC pressure'], ['pg_isready -h dbhost', 'app database up?']],
    triage: [
      'Hit the /api/health endpoint rather than a cached dashboard, which can render from memory while queries fail.',
      'Check JVM heap and GC: large query results and many concurrent dashboards are the usual cause of Metabase OutOfMemory.',
      'Check the application database: if you are still on the default H2 file, that is a production risk and a common corruption source.',
    ],
    falseRead: 'a cached dashboard can render instantly while the JVM is thrashing on heap and new queries time out.',
    monitorSub: 'Metabase is a JVM app that leans on two databases: its own, and the ones it queries. Watch both plus heap.',
    signals: [
      ['URL and health', 'journey', 'Poll /api/health and a real dashboard load; alert on non-200 or slow first-byte responses.'],
      ['JVM heap and GC', 'runtime', 'Heap and garbage-collection pause time; large results and concurrency drive OutOfMemory and freezes.'],
      ['Application database', 'database', 'Metabase state lives here; use PostgreSQL or MySQL in production, and watch connections and latency (H2 is not safe for prod).'],
      ['Data-source connections', 'connections', 'Connections to the warehouses Metabase queries; a down or slow source makes dashboards hang or error.'],
      ['Scheduled reports and alerts', 'jobs', 'Pulses, subscriptions, and alerts on a schedule; silent failures mean stakeholders stop getting numbers.'],
      ['Query load', 'load', 'Concurrent and long-running queries; a few heavy queries can saturate heap and the connection pool.'],
    ],
    checksIntro: 'Metabase exposes a health endpoint; pair it with JVM and database checks.',
    checks: '# Metabase health endpoint (200 when ready)\ncurl -s -o /dev/null -w "%{http_code}" https://your-metabase/api/health\n\n# JVM garbage-collection pressure\njstat -gcutil <metabase_pid> 1s 3\n\n# Application database reachable (use Postgres in production)\npg_isready -h metabase-appdb-host -p 5432\n\n# Heap dump for RCA when memory is exhausted\njmap -dump:live,format=b,file=/tmp/metabase-heap.hprof <metabase_pid>',
    failures: [
      ['OutOfMemoryError', 'The JVM runs out of heap, usually from a query returning a huge result set or many heavy dashboards at once.', 'Take a heap dump for RCA, raise the JVM Xmx within host limits, cap result rows, and cache expensive questions, then restart.'],
      ['Metabase is slow', 'Slow dashboards trace to slow queries on the underlying data source, a saturated app database, or heap pressure.', 'Identify the slow query and data source, add caching and query timeouts, and scale heap or the data warehouse behind it.'],
      ['H2 application database corruption', 'The default embedded H2 file can corrupt on crash or disk-full and is not recommended for production.', 'Migrate the application database to PostgreSQL or MySQL, back it up, and treat the migration as the durable fix.'],
      ['Scheduled reports not sending', 'Pulses, subscriptions, and alerts stop when the scheduler, email, or Slack integration fails, often silently.', 'Monitor scheduled-task success, verify the email or Slack integration, and alert when a pulse fails rather than discovering it late.'],
      ['Data source connection errors', 'Dashboards hang or error when the warehouse Metabase queries is down, slow, or has hit its connection limit.', 'Watch data-source connectivity and pool usage, set query timeouts, and fail fast with a clear message instead of hanging.'],
    ],
    useCases: [
      ['Company BI / dashboards', 'App DB health, JVM heap, data-source latency', 'Leaders lose visibility into the business'],
      ['Embedded analytics', 'URL and API uptime, query latency, caching', 'Customer-facing dashboards break'],
      ['Scheduled reporting', 'Pulse and subscription success, email or Slack', 'Stakeholders stop getting numbers'],
      ['Large data warehouses', 'Query timeouts, connection pool, result size', 'Heavy queries freeze the instance'],
      ['Self-hosted / regulated', 'Application DB backups, audit, TLS', 'Data and recovery risk'],
    ],
    amIntro: 'A cached Metabase dashboard hides a JVM thrashing on heap and queries timing out. AlertMend watches the health endpoint, JVM heap and GC, the application database, and data-source connections together, then explains and recovers the failure safely.',
    sources: [
      ['Metabase: Monitoring Metabase', 'https://www.metabase.com/docs/latest/installation-and-operation/monitoring-metabase'],
      ['Metabase: Migrate away from the default H2 database', 'https://www.metabase.com/docs/latest/installation-and-operation/migrating-from-h2'],
      ['Metabase: Application database', 'https://www.metabase.com/docs/latest/installation-and-operation/configuring-application-database'],
      ['Metabase: Running in production and Java options', 'https://www.metabase.com/docs/latest/installation-and-operation/running-the-metabase-jar-file'],
      ['Metabase: Health check endpoint', 'https://www.metabase.com/docs/latest/installation-and-operation/running-metabase-on-kubernetes'],
    ],
    ctaTitle: 'Catch the Metabase memory spike before dashboards freeze.',
    ctaSub: 'AlertMend watches JVM heap, the application database, and data-source connections behind your Metabase URL, explains the root cause, and recovers it safely.',
    heroKicker: 'Metabase reliability', heroTitle: 'Metabase Monitoring', heroSub: 'JVM heap, app DB, data sources.',
    heroBullets: [['OOM', 'huge result sets exhaust heap'], ['slow', 'slow source or saturated app DB'], ['H2', 'default DB is a production risk']],
    heroFoot: 'Watch heap and both databases, not a cached dashboard',
    related: [['odoo-monitoring', 'Odoo Monitoring'], ['optimizing-elasticsearch-heap-memory', 'Elasticsearch Heap'], ['gitlab-monitoring', 'GitLab Monitoring']],
  },
  {
    slug: 'n8n-monitoring', app: 'n8n', category: 'Monitoring',
    industries: [
      ['SaaS operations', 'Execution success, webhooks, and the queue, since these automations affect revenue'],
      ['E-commerce and retail', 'Order and fulfillment flows with retries and rate-limit handling, so orders never drop'],
      ['Agencies and consultancies', 'Many client workflows with isolation and uptime, to hold client SLAs'],
      ['AI startups', 'Long-running agent and LLM pipelines with memory and timeout headroom, so chains complete'],
      ['Fintech and data teams', 'PostgreSQL integrity, audit, and execution-data pruning for reliable pipelines'],
    ],
    faqs: [
      ['Why are my n8n executions failing or stuck?', 'A worker is down, a credential expired, or an upstream API is failing or rate-limiting. Check worker health and the failed-execution log, restart stalled workers, and add retry and backoff to the affected node.'],
      ['How do I scale n8n?', 'Use queue mode: run the main process plus dedicated worker processes that consume executions from a Redis queue, and add workers or concurrency for throughput. This also isolates a bad execution from taking down the editor.'],
      ['How do I monitor n8n?', 'Poll the /healthz endpoint and a test webhook, and watch the main and worker processes, the Redis queue depth, PostgreSQL, and the execution success rate. A loading editor is not proof that workflows run.'],
      ['Why is my n8n database growing so large?', 'Unpruned execution data bloats PostgreSQL and slows execution starts. Enable execution data pruning and retention, archive if you need history, and alert on database size and disk.'],
      ['Why is my n8n webhook not working?', 'The reverse proxy is not routing the webhook path or method to n8n, or the public webhook URL is wrong. Verify the proxy forwards the path and method, set WEBHOOK_URL correctly, and test with a real request.'],
      ['What is n8n queue mode?', 'It is a scaling mode where executions run on separate worker processes that pull jobs from a Redis queue instead of running in the main process. It is needed for volume, resilience, and horizontal scaling.'],
      ['Why is n8n using high memory or crashing?', 'The Node process climbs on large payloads or high concurrency, especially without queue mode. Move to queue mode with dedicated workers, cap payload size, and restart to reclaim memory.'],
      ['How do I prune n8n execution data?', 'Set the execution data pruning and retention environment variables so old executions are deleted automatically. Archive first if you need to keep history for audit.'],
      ['Should n8n use PostgreSQL or SQLite?', 'Use PostgreSQL in production. The default SQLite does not handle concurrency or queue mode well and is a common source of failures once you scale.'],
      ['How do I enable Prometheus metrics in n8n?', 'Set N8N_METRICS=true to expose the /metrics endpoint on the main process and workers, and set N8N_METRICS_INCLUDE_QUEUE_METRICS=true to include queue metrics, which are served from the main process. Tune the refresh with N8N_METRICS_QUEUE_METRICS_INTERVAL, then scrape both main and worker instances into Prometheus and Grafana.'],
      ['Why does n8n jobs_waiting keep climbing?', 'If the waiting or enqueued job count keeps rising while CPU is idle, you are under-provisioned on workers or blocked on PostgreSQL or a slow external API. Add worker instances or concurrency and fix the slow dependency behind the backlog; if CPU is also pegged, scale the worker hosts.'],
    ],
    prometheus: {
      intro: 'n8n exposes Prometheus metrics natively. Set N8N_METRICS=true to enable the /metrics endpoint on the main process and workers, and set N8N_METRICS_INCLUDE_QUEUE_METRICS=true to include queue-mode metrics (adjust the refresh with N8N_METRICS_QUEUE_METRICS_INTERVAL). Scrape both main and worker instances and graph them in Grafana.',
      setup: '# Enable metrics on main and workers (environment variables)\nN8N_METRICS=true\nN8N_METRICS_INCLUDE_QUEUE_METRICS=true\nN8N_METRICS_QUEUE_METRICS_INTERVAL=20\n\n# Queue metrics are served from the main process\ncurl -s http://your-n8n:5678/metrics | grep n8n_queue',
      metrics: ['jobs currently being processed across workers', 'jobs completed and jobs failed since start', 'jobs waiting (enqueued) for pickup', 'event-loop lag and process memory'],
    },
    alerts: [
      ['n8n down', 'the /healthz endpoint failing or /metrics unreachable'],
      ['Queue backlog', 'jobs_waiting climbing while CPU is idle (under-provisioned workers or blocked on Postgres or a slow API)'],
      ['Executions failing', 'the failed-execution rate rising'],
      ['Database bloat', 'execution_entity growth or DB disk above 80% (enable pruning)'],
      ['Webhook not received', 'expected webhook triggers stop arriving'],
      ['Worker memory', 'worker process memory climbing on large payloads'],
    ],
    title: 'n8n Monitoring and Auto-Recovery',
    h1: 'n8n Monitoring and Auto-Recovery',
    intro: [
      'n8n is a self-hosted workflow automation platform that runs your integrations and, increasingly, AI agent pipelines. In production it runs the main process for the editor and webhooks, dedicated worker processes in queue mode, a Redis queue, and a PostgreSQL database that holds workflow and execution data.',
      'The editor can load from the main process while every execution silently fails behind a stalled worker, so a loading UI is not proof that automations run. Monitoring n8n means watching executions, workers, the queue, and the database, and pruning execution data before it bloats the database.',
    ],
    excerpt: 'Monitor self-hosted n8n: the main process, queue-mode workers, PostgreSQL, Redis, webhooks, and executions, then safely recover the common failures.',
    keywords: 'n8n monitoring, n8n self-hosted, n8n queue mode, n8n executions failing, n8n webhook not working, n8n database, n8n workers, n8n scaling, n8n auto recovery',
    processLabel: 'main and worker processes', dbLabel: 'PostgreSQL',
    stack: ['Trigger / webhook', 'Reverse proxy', 'n8n main + workers', 'PostgreSQL + Redis'],
    recover: 'restart a stalled worker, drain a stuck queue, or prune execution data before the database fills',
    answerTitle: 'Watch executions and workers, not just that the editor loads.',
    answer: 'A real n8n check should prove the editor URL answers, the main process is up, in queue mode the worker processes are consuming from Redis, PostgreSQL is responsive and not bloated with old execution data, and webhooks are being received. The editor can load while executions are silently failing or queued behind stalled workers.',
    quickCmds: [['curl -s https://n8n/healthz', 'n8n health'], ['redis-cli llen bull:jobs:wait', 'queue backlog'], ['pg_isready -h dbhost', 'database up?']],
    triage: [
      'Hit the /healthz endpoint and load a webhook test URL, not just the editor, which can render while executions fail.',
      'In queue mode, check the Redis queue depth and that worker processes are alive and consuming, or executions pile up.',
      'Check PostgreSQL: execution data grows fast, so a bloated or slow database is a common cause of failures and slow starts.',
    ],
    falseRead: 'the editor loads from the main process while workers are down, so new executions queue up and never run.',
    monitorSub: 'n8n runs your automations. A loading editor is not proof that workflows are actually executing.',
    signals: [
      ['Editor and webhook URL', 'journey', 'Poll /healthz and a test webhook from outside; a received webhook is what proves triggers still fire.'],
      ['Main and worker processes', 'process', 'The main process serves the editor and webhooks; in queue mode, workers run executions and must stay alive.'],
      ['Execution queue (Redis)', 'jobs', 'In queue mode, Bull queues live in Redis; a growing backlog means workers are not keeping up or are stalled.'],
      ['PostgreSQL', 'database', 'Workflow and execution data; watch connections, latency, and table growth from unpruned executions.'],
      ['Execution success rate', 'load', 'Track failed and long-running executions; a spike in failures signals a broken workflow, credential, or upstream API.'],
      ['Webhook reception', 'delivery', 'Confirm inbound webhooks reach n8n through the proxy; a misrouted webhook silently drops triggers.'],
    ],
    checksIntro: 'n8n exposes a health endpoint; in queue mode, pair it with a Redis queue check.',
    checks: '# n8n health endpoint\ncurl -s -o /dev/null -w "%{http_code}" https://your-n8n/healthz\n\n# Queue-mode backlog (Bull waiting jobs in Redis)\nredis-cli llen bull:jobs:wait\n\n# PostgreSQL reachable\npg_isready -h n8n-db-host -p 5432\n\n# Execution data table size (unpruned executions bloat the DB)\npsql -h n8n-db-host -U n8n -c "SELECT pg_size_pretty(pg_total_relation_size(\'execution_entity\'));"',
    failures: [
      ['Executions failing or stuck', 'Executions error or hang because a worker is down, a credential expired, or an upstream API is failing or rate limiting.', 'Check worker health and the failed-execution log, restart stalled workers, fix the credential or add retry and backoff to the node.'],
      ['Queue backing up (queue mode)', 'Jobs pile up in Redis when workers are too few, crashed, or blocked on a slow database or external call.', 'Confirm workers are alive and consuming, add worker concurrency or instances, and fix the slow dependency behind the backlog.'],
      ['Database growing out of control', 'Unpruned execution data bloats PostgreSQL, slowing execution starts and eventually filling disk.', 'Enable execution data pruning and retention, archive if needed, and alert on database size and disk before it fills.'],
      ['Webhook not received', 'A trigger never fires because the reverse proxy is not routing the webhook path or method to n8n.', 'Verify the proxy forwards the webhook path and method, confirm the public webhook URL, and test with a real request.'],
      ['High memory or crash', 'The Node process climbs or crashes on large payloads or many concurrent executions, especially without queue mode.', 'Move to queue mode with dedicated workers, cap payload size, and restart to reclaim memory, then watch execution concurrency.'],
    ],
    useCases: [
      ['Business-critical automations', 'Execution success rate, worker health, webhooks', 'Silent automation failures hit revenue'],
      ['High-volume workflows', 'Queue depth, worker scaling, database size', 'Backlog delays every downstream job'],
      ['AI / agent pipelines', 'Long-running executions, memory, API rate limits', 'Agent chains stall or time out'],
      ['Webhook-driven integrations', 'Webhook reception, proxy routing, retries', 'Dropped triggers, missed events'],
      ['Self-hosted / regulated', 'PostgreSQL backups, credentials, audit', 'Data and recovery risk'],
    ],
    amIntro: 'The n8n editor can load while every execution silently fails behind a stalled worker. AlertMend watches the health endpoint, the main and worker processes, the Redis queue, and PostgreSQL together, then explains and recovers the failure with an approved runbook.',
    sources: [
      ['n8n: Queue mode and scaling', 'https://docs.n8n.io/hosting/scaling/queue-mode/'],
      ['n8n: Execution data and pruning', 'https://docs.n8n.io/hosting/scaling/execution-data/'],
      ['n8n: Configuration and environment variables', 'https://docs.n8n.io/hosting/configuration/environment-variables/'],
      ['n8n: Supported databases (PostgreSQL)', 'https://docs.n8n.io/hosting/configuration/supported-databases-settings/'],
      ['n8n: Webhooks and reverse proxy', 'https://docs.n8n.io/hosting/configuration/configuration-examples/webhook-url/'],
    ],
    ctaTitle: 'Catch the n8n worker that quietly stopped running.',
    ctaSub: 'AlertMend watches executions, workers, the Redis queue, and PostgreSQL behind your n8n editor, explains the failure, and recovers it before automations silently fall behind.',
    heroKicker: 'n8n reliability', heroTitle: 'n8n Monitoring', heroSub: 'Workers, queue, PostgreSQL, webhooks.',
    heroBullets: [['stuck', 'workers down, executions queue'], ['db bloat', 'unpruned execution data'], ['webhook', 'proxy not routing the trigger']],
    heroFoot: 'Watch executions, not just the editor',
    related: [['odoo-monitoring', 'Odoo Monitoring'], ['monitor-litellm-using-alertmend', 'Monitor LiteLLM'], ['gitlab-monitoring', 'GitLab Monitoring']],
  },
]

for (const cfg of POSTS) {
  const dir = path.join(root, 'public/blog', cfg.slug)
  const assets = path.join(root, 'public/assets', cfg.slug)
  fs.mkdirSync(dir, { recursive: true }); fs.mkdirSync(assets, { recursive: true })
  fs.writeFileSync(path.join(dir, 'index.html'), render(cfg))
  fs.writeFileSync(path.join(assets, 'script.js'), SCRIPT_JS)
  fs.writeFileSync(path.join(assets, 'styles.css'), ':root{--am-accent:' + accentOf(cfg.slug)[0] + ';}\n' + EXTRA_CSS)
  fs.writeFileSync(path.join(assets, 'hero.svg'), heroSvg(cfg))
  fs.writeFileSync(path.join(root, 'public/blog', `${cfg.slug}.md`), `---
title: "${cfg.title}"
excerpt: "${cfg.excerpt}"
date: "${DATE}"
dateModified: "${MODIFIED}"
category: "${cfg.category}"
author: "${AUTHOR}"
keywords: "${cfg.keywords}"
---

This post is published as a rich interactive page at [/blog/${cfg.slug}](/blog/${cfg.slug}).
`)
  const tl = cfg.title.length + 15
  console.log(`✓ ${cfg.slug}  title+suffix ${tl}${tl < 30 || tl > 60 ? ' [TITLE LEN!]' : ''}  excerpt ${cfg.excerpt.length}${cfg.excerpt.length < 50 || cfg.excerpt.length > 160 ? ' [EXCERPT LEN!]' : ''}  faqs ${cfg.faqs.length}`)
}
console.log(`\n${POSTS.length} app-monitoring posts generated`)
