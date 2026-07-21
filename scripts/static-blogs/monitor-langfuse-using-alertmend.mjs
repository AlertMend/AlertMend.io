/**
 * Code-generated rich blog: Langfuse observability post.
 */
import {
  SITE_URL,
  esc,
  parseFrontmatter,
  getRelatedPosts,
  calendlyUrl,
  signupUrl,
  CHROME_INLINE_CSS,
  buildNavHtml,
  buildSidebarHtml,
  buildArticleHeader,
  writeStaticBlogOutputs,
} from '../static-blog-shared.mjs'

export async function build(slug) {
const assetsBase = `/assets/${slug}`
const canonical = `${SITE_URL}/blog/${slug}`

const meta = parseFrontmatter(slug)
const title = meta.title || 'How to Monitor Langfuse in Production'
const excerpt = meta.excerpt || ''
const date = meta.date || '2026-06-20'
const category = meta.category || 'AIOps'
const author = meta.author || 'AlertMend Team'
const keywords = meta.keywords || 'Langfuse observability, AlertMend'

const relatedPosts = getRelatedPosts(slug, category)
const postSignupUrl = signupUrl(slug, 'blog-langfuse')
const postCalendlyUrl = calendlyUrl(slug)

const SIGNAL_HIERARCHY = [
  ['Langfuse not ready to serve traffic', 'Alert the team', 'Ready check fails twice in a row → Slack incident.'],
  ['Database unreachable', 'Alert and restart', 'Deep health check fails → restart web pods and post context to Slack.'],
  ['Worker stopped ingesting traces', 'Alert the team', 'Worker health check fails → restart langfuse-worker.'],
  ['Still starting after a deploy', 'Wait', 'Deploy grace period so boot-up does not false-alarm.'],
  ['Trace ingestion lagging', 'Warn first', 'Latency alert before the UI looks empty to your team.'],
]

const ALERTMEND_FLOW = [
  ['Connect', 'Connect your cluster in AlertMend. Langfuse web, worker, and restart events show up without wiring Prometheus and PagerDuty yourself.'],
  ['Add a health check', 'Add a URL check on /api/public/ready with failIfDatabaseUnavailable=true when you need Postgres and ClickHouse in the check.'],
  ['Alert your team', 'When something breaks, AlertMend opens a Slack incident with a plain-language summary and links to the details your on-call needs.'],
  ['Auto-recover', 'Turn on restart runbooks for langfuse-web and langfuse-worker. AlertMend brings Langfuse back online instead of waiting for a manual kubectl restart.'],
]

const TOP_ISSUES = [
  ['Postgres connection lost', 'The UI may load but traces stop saving. Apps still run but you lose observability.', 'Deep health check + Slack alert + restart web and worker pods.'],
  ['Worker stopped processing', 'The web UI looks fine but new traces never appear.', 'Worker health check on /api/health + auto-restart runbook.'],
  ['Looks healthy but is not ready', 'Basic health passes while Langfuse is still starting or shutting down.', 'Check /api/public/ready, not just health. Suppress alerts during deploys.'],
  ['ClickHouse or MinIO full', 'Ingestion slows, then fails silently while the process stays up.', 'Disk alert + restart after cleanup runbook.'],
  ['High trace volume spike', 'Memory climbs on web or worker during a traffic burst.', 'Memory alert + scale or restart before an outage.'],
  ['SDK errors but UI is up', 'Apps log ingestion failures while synthetic checks still pass.', 'Log alert on ingestion errors + correlate with Langfuse pod restarts.'],
]

const FAQ = [
  ['How do I monitor Langfuse in production?', 'Connect your cluster in AlertMend, add health checks on /api/public/ready and the worker /api/health endpoint, and route alerts to Slack. AlertMend watches web pods, workers, and database connectivity depending on how you deploy Langfuse.'],
  ['How do I monitor Langfuse health checks?', 'In AlertMend, add a URL check on /api/public/ready for the web service. Use ?failIfDatabaseUnavailable=true on /api/public/health when you want Postgres in the check. AlertMend notifies your team after repeated failures.'],
  ['What is the difference between Langfuse /health and /ready?', 'Health means the API process is running. Ready means Langfuse can accept traffic. During graceful shutdown, ready fails first. AlertMend should check ready for paging. Use deploy grace periods so boot-up does not false-alarm.'],
  ['How do I monitor langfuse-worker?', 'Add a separate URL check on the worker /api/health endpoint (default port 3030). The worker validates database connectivity. In AlertMend, enable a restart runbook when worker checks fail even if the web UI still loads.'],
  ['Why did Langfuse stop accepting traces?', 'Common causes: worker crash, Postgres or ClickHouse unreachable, or disk full on ClickHouse or MinIO. AlertMend alerts on failed health checks and worker restarts so you catch it before your team notices missing traces.'],
  ['How do I monitor self-hosted Langfuse on Kubernetes?', 'Install the AlertMend agent, add URL checks through the same Ingress your SDKs use, and enable auto-restart on langfuse-web and langfuse-worker Deployments. Probe /api/public/health at the pod root path, not through a custom base path prefix.'],
  ['How do I know if Langfuse is down?', 'AlertMend treats Langfuse as down when ready checks fail, the worker stops ingesting, or pods crash repeatedly, not when a superficial health check passes but traces still do not land.'],
  ['Should I auto-restart Langfuse when the database blips?', 'Yes for availability: enable AlertMend restart runbooks so web and worker come back after a transient DB or ClickHouse issue. If it keeps recurring, fix sizing or connection pool limits instead of only restarting.'],
]

const MODES = [
  ['docker', 'Docker Compose', 'Self-hosted stack'],
  ['kubernetes', 'Kubernetes Helm', 'Production K8s'],
  ['cloud', 'Langfuse Cloud', 'Hosted SaaS'],
  ['worker', 'Worker service', 'Trace ingestion'],
  ['sdk', 'SDK clients', 'App-side checks'],
]

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
  name: 'Connect Langfuse to AlertMend for production observability',
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
  image: `https://www.alertmend.io${assetsBase}/langfuse-hero.svg`,
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
  <meta property="og:image" content="https://www.alertmend.io${assetsBase}/langfuse-hero.svg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(excerpt)}">
  <meta name="twitter:image" content="https://www.alertmend.io${assetsBase}/langfuse-hero.svg">
  <script type="application/ld+json">${blogLd}</script>
  <script type="application/ld+json">${faqLd}</script>
  <script type="application/ld+json">${howToLd}</script>
  <link rel="stylesheet" href="${assetsBase}/styles.css">
  <style>${CHROME_INLINE_CSS}</style>
</head>
<body>
${buildNavHtml(slug, postCalendlyUrl)}

  <div class="main-container">
    <div class="content-wrapper">
      <div class="main-col">
${buildArticleHeader(title, author, date)}

    <div class="dl-blog">
      <section class="heroBand">
        <div class="heroBrands">
          <a href="https://langfuse.com/" target="_blank" rel="noopener noreferrer">
            <img src="${assetsBase}/langfuse-logo.png" alt="Langfuse" class="brandLogo" width="142" height="40">
          </a>
          <span class="heroBrandSep" aria-hidden="true">×</span>
          <a href="/" class="heroAmLink">
            <img src="/logos/alertmend-logo.svg" alt="AlertMend" class="heroAmLogo" width="128" height="28">
          </a>
        </div>
        <p class="heroGuideLabel">Production runbook · How to monitor Langfuse</p>
        <div class="heroAudience">
          <h2 class="heroAudienceTitle">You're in the right place if…</h2>
          <ul class="heroAudienceList">
            <li>You already run Langfuse in production (self-hosted, Kubernetes, or Langfuse Cloud)</li>
            <li>Your LLM apps depend on Langfuse for traces, evals, and prompt management</li>
            <li>You want next-generation AI observability out of the box, not another DIY monitoring stack</li>
          </ul>
          <p class="heroAudienceNote">This is not a Langfuse tutorial. It assumes Langfuse is already in your stack and shows how to connect it to <a href="/">AlertMend</a>, a state-of-the-art AI observability platform with monitoring, AI-powered incident analysis, and auto-recovery built in.</p>
        </div>
        <p class="seoTldr"><strong>TL;DR:</strong> Monitor self-hosted Langfuse with /api/public/ready and worker health checks, Slack alerts when traces stop, and auto-restart runbooks in AlertMend.</p>
        <div class="heroContext">
          <div class="heroContextBlock">
            <h2 class="heroContextTitle">When Langfuse stops accepting traces</h2>
            <p class="heroContextBody">Postgres or ClickHouse can drop while the UI still loads. langfuse-worker can stop ingesting while /api/public/health still returns 200. Deploys can leave Langfuse warming up while SDKs already send traces.</p>
            <p class="heroContextBody">Teams usually notice when the trace explorer goes quiet, not when the first health check fails. The fix is monitoring ready + worker endpoints, not only "is the process up."</p>
          </div>
          <div class="heroContextBlock">
            <h2 class="heroContextTitle">Why AlertMend for Langfuse uptime</h2>
            <p class="heroContextBody">Self-hosted Langfuse needs more than a curl cron: web ready checks, worker health, database blips, and pod restarts on Kubernetes. AlertMend is built for production AI infrastructure, not generic uptime pings.</p>
            <p class="heroContextBody">Connect your cluster, point checks at /api/public/ready and worker /api/health, and get Slack incidents with AI summaries plus auto-restart runbooks when trace ingestion stops.</p>
          </div>
        </div>
        <p class="pipelineCaption">What AlertMend watches</p>
        <div class="pipeline">
          <div class="pipelineNode pipelineNodeFocus"><div class="pipelineLabel">Ready check</div><div class="pipelineSub">Can it serve?</div></div>
          <div class="pipelineNode"><div class="pipelineLabel">Worker</div><div class="pipelineSub">Trace ingestion</div></div>
          <div class="pipelineNode"><div class="pipelineLabel">Database</div><div class="pipelineSub">Postgres + ClickHouse</div></div>
          <div class="pipelineNode"><div class="pipelineLabel">Ingestion</div><div class="pipelineSub">SDK errors</div></div>
          <div class="pipelineNode"><div class="pipelineLabel">Alert + fix</div><div class="pipelineSub">Slack + auto-recover</div></div>
        </div>
      </section>

      <h2 class="sectionHead">How does AlertMend recover Langfuse automatically?</h2>
      <p class="sectionSub">Sequence view: Langfuse fails a ready check, AlertMend opens a Slack incident, runs the restart runbook, and LLM trace ingestion resumes.</p>
      <figure class="flowDiagram">
        <img src="${assetsBase}/langfuse-alertmend-recovery-flow.svg" alt="Sequence diagram: Langfuse database failure, AlertMend detects the failure, alerts Slack, runs auto-recovery runbook, and Langfuse returns online" width="960" height="720" loading="lazy">
        <figcaption class="flowDiagramCaption">Normal operation, failure, Slack alert with AI summary, runbook restart, tracing restored.</figcaption>
      </figure>

      <p class="bodyText">Pick how you run Langfuse below. Each section shows what to set up in AlertMend.</p>

      <h2 class="sectionHead">When should you alert on Langfuse failures?</h2>
      <div class="diyWrap">
        <table class="compareTable">
          <thead><tr><th>Signal</th><th>Action</th><th>In AlertMend</th></tr></thead>
          <tbody>
            ${SIGNAL_HIERARCHY.map(([s, a, m]) => `<tr><td>${esc(s)}</td><td class="diyHighlight">${esc(a)}</td><td>${esc(m)}</td></tr>`).join('\n            ')}
          </tbody>
        </table>
      </div>

      <h2 class="sectionHead">How do you set up Langfuse monitoring in AlertMend?</h2>
      <div class="amFlow">
        ${ALERTMEND_FLOW.map(([t, b], i) => `<div class="amStep"><div class="amStepHead"><span class="amStepNum">${i + 1}</span></div><h3 class="amStepTitle">${esc(t)}</h3><p class="amStepBody">${esc(b)}</p></div>`).join('\n        ')}
      </div>

      <h2 class="sectionHead">How to monitor Langfuse by deployment mode</h2>
      <div class="modeGrid" role="tablist" aria-label="Langfuse deployment modes">
        ${MODES.map(([id, t, sub], i) => `<button type="button" role="tab" data-mode-id="${id}" class="modeCard${i === 1 ? ' modeCardActive' : ''}" aria-selected="${i === 1 ? 'true' : 'false'}"><span class="modeCardTitle">${esc(t)}</span><span class="modeCardSub">${esc(sub)}</span></button>`).join('\n        ')}
      </div>
      <div class="modePlaybook" role="tabpanel">
        <div class="modePlaybookHead">
          <h3 class="modePlaybookTitle" id="mode-playbook-title">Runbook: Kubernetes Helm</h3>
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
            <span class="dashboardTitle" id="dash-title">AlertMend · langfuse-prod</span>
            <span class="liveBadge"><span class="liveDot"></span> Live</span>
          </div>
          <div class="dashboardBody">
            <div class="metricCard">
              <div class="metricLabel" id="metric-primary-label">Ready check</div>
              <div class="metricValue metricValueOk" id="metric-primary">200 OK</div>
            </div>
            <div class="metricCard">
              <div class="metricLabel">Ingestion lag</div>
              <div class="metricValue metricValueWarn">42s</div>
              <div class="metricBar"><div class="metricBarFill"></div></div>
            </div>
            <div class="metricCard">
              <div class="metricLabel" id="metric-secondary-label">Pod restarts (1h)</div>
              <div class="metricValue" id="metric-secondary">1</div>
            </div>
          </div>
          <div class="alertToast">
            <div class="alertText">
              <div class="alertTitle" id="dash-alert">Langfuse worker health failed: auto-remediation triggered</div>
              <div class="alertMeta" id="dash-alert-meta">langfuse-prod · Slack #incidents · 12s ago</div>
            </div>
          </div>
        </div>
      </div>

      <h2 class="sectionHead">Why does Langfuse stop accepting traces?</h2>
      <div class="searchIssueGrid">
        ${TOP_ISSUES.map(([term, desc, am]) => `<div class="searchIssueCard"><h3 class="searchIssueTerm">${esc(term)}</h3><p class="searchIssueDesc">${esc(desc)}</p><p class="searchIssueAlert"><strong>In AlertMend:</strong> ${esc(am)}</p></div>`).join('\n        ')}
      </div>

      <h2 class="sectionHead">FAQ</h2>
      <div class="faqList">
        ${FAQ.map(([q, a], i) => `<div class="faqItem"><button type="button" class="faqQuestion" data-faq-toggle aria-expanded="${i === 0 ? 'true' : 'false'}">${esc(q)}<svg class="faqChevron${i === 0 ? ' faqChevronOpen' : ''}" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 9l6 6 6-6"/></svg></button><div class="faqAnswer${i === 0 ? '' : ' hidden'}">${esc(a)}</div></div>`).join('\n        ')}
      </div>

      <div class="ctaBand">
        <div class="ctaBandTitle">Monitor Langfuse in production without a DIY stack</div>
        <p class="ctaBandSub">AlertMend watches Langfuse ready checks, worker health, and pod crashes, then alerts Slack and auto-restarts. Connect in a few clicks.</p>
        <div class="ctaBtnRow">
          <a href="${postSignupUrl}" class="ctaBtn">Start with auto-remediation →</a>
          <a href="${postCalendlyUrl}" class="ctaBtnSecondary" target="_blank" rel="noopener noreferrer">Book a demo</a>
        </div>
      </div>
    </div>

    <div class="promo">
      <p>Ready to eliminate manual firefighting? <a href="${postCalendlyUrl}" target="_blank" rel="noopener noreferrer">Book a demo</a> to see AlertMend on your Langfuse stack.</p>
    </div>
      </div>

${buildSidebarHtml(relatedPosts)}
    </div>
  </div>

  <script src="${assetsBase}/script.js" defer></script>
</body>
</html>`

writeStaticBlogOutputs(slug, html)
}
