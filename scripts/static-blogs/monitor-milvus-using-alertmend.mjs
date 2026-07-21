/**
 * Code-generated rich blog: Milvus observability post.
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
  const title = meta.title || 'Milvus Observability'
  const excerpt = meta.excerpt || ''
  const date = meta.date || '2026-06-14'
  const category = meta.category || 'AIOps'
  const author = meta.author || 'AlertMend Team'
  const keywords = meta.keywords || 'Milvus observability, AlertMend'

  const relatedPosts = getRelatedPosts(slug, category)
  const postSignupUrl = signupUrl(slug, 'blog-milvus')
  const postCalendlyUrl = calendlyUrl(slug)

  const SIGNAL_HIERARCHY = [
    ['Milvus not accepting queries', 'Alert the team', 'URL health check fails twice in a row opens a Slack incident.'],
    ['Query node out of memory', 'Alert and restart', 'Out-of-memory runbook restarts the pod and posts what happened.'],
    ['Search latency climbing', 'Warn first', 'Latency alert before similarity search fully degrades.'],
    ['Still starting after a deploy', 'Wait', 'Deploy grace period so cluster boot does not false-alarm.'],
    ['Index build stuck', 'Alert the team', 'Index job alert plus restart when builds hang past SLA.'],
  ]

  const ALERTMEND_FLOW = [
    ['Connect', 'Connect your cluster in AlertMend. Milvus pod health and restart events show up without wiring Prometheus and Grafana yourself.'],
    ['Add a health check', 'Add a URL check on your Milvus proxy or API endpoint. AlertMend verifies vector search is actually reachable, not just that a pod is running.'],
    ['Alert your team', 'When something breaks, AlertMend opens a Slack incident with a plain-language summary and the context your on-call needs.'],
    ['Auto-recover', 'Turn on the out-of-memory runbook. AlertMend brings Milvus query nodes back online automatically instead of waiting for a manual restart.'],
  ]

  const TOP_ISSUES = [
    ['Query node memory spike', 'Large collections and hot shards push query node RAM until Kubernetes kills the pod.', 'Slack alert plus auto-restart runbook brings search back online.'],
    ['Search latency spikes', 'p95 search time jumps while inserts still succeed. Users see slow RAG retrieval.', 'Latency warning first, then page if SLO is breached.'],
    ['Index build never finishes', 'Bulk embedding jobs stall; new vectors are not searchable.', 'Index job timeout alert and restart of index or data nodes.'],
    ['Looks up but queries fail', 'Health endpoint passes but collections are not queryable.', 'Check the endpoint your apps use, not only internal metrics port.'],
    ['etcd or metadata errors', 'Cluster metadata flaps; Milvus components cannot coordinate.', 'Pod crash alerts on etcd and Milvus coordinators with restart runbooks.'],
    ['Insert backlog growing', 'Ingestion outpaces flush; segments pile up and search degrades.', 'Backlog alert plus scale or restart data nodes when flush stalls.'],
  ]

  const FAQ = [
    ['How do I monitor Milvus in production?', 'Connect your cluster in AlertMend, add a health check on your Milvus API endpoint, and route alerts to Slack. AlertMend watches query node crashes, search errors, and index build failures depending on how you deploy Milvus.'],
    ['How do I monitor Milvus on Kubernetes?', 'In AlertMend, install the agent on your cluster, enable out-of-memory and crash alerts on Milvus query and data node pods, and add a URL check through the same address your RAG app uses for search.'],
    ['Why does Milvus keep running out of memory?', 'Large vector collections and high query concurrency can exhaust query node memory. AlertMend alerts your team when it happens and can restart pods automatically. If it keeps recurring, increase memory limits or add query nodes.'],
    ['How do I monitor Milvus search latency?', 'In AlertMend, set a latency SLO on your search endpoint or wire metrics alerts when p95 search time crosses your threshold. Warn before you page so on-call can act before RAG retrieval fails.'],
    ['What Milvus metrics should I alert on?', 'AlertMend can watch health checks, pod restarts, memory pressure, and slow search without you hand-rolling Prometheus rules. For DIY metrics, teams often watch search latency, query node memory, and index build duration on port 9091.'],
    ['How do I fix Milvus OOMKilled on query nodes?', 'Enable AlertMend\'s out-of-memory runbook on the query node Deployment. Your team gets a Slack alert with memory context, and Milvus comes back online automatically. Then raise limits or shard collections.'],
    ['How do I know if Milvus is down?', 'AlertMend treats Milvus as down when health checks fail, search requests error, or query nodes crash, not when a metrics port responds but similarity search still fails.'],
    ['Should I auto-restart Milvus on every OOMKilled?', 'Yes. Enable AlertMend\'s out-of-memory runbook: Slack alert with what happened, automatic pod restart, and your RAG pipeline keeps moving. Tune memory if repeats happen.'],
  ]

  const MODES = [
    ['lite', 'Milvus Lite', 'Embedded in Python'],
    ['standalone', 'Standalone', 'Docker or VM'],
    ['helm', 'Kubernetes Helm', 'Distributed cluster'],
    ['cloud', 'Zilliz Cloud', 'Managed vectors'],
    ['pymilvus', 'PyMilvus client', 'App talks to remote Milvus'],
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
    name: 'Connect Milvus to AlertMend for production observability',
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
    image: `${SITE_URL}${assetsBase}/milvus-hero.svg`,
    datePublished: date,
    dateModified: date,
    author: { '@type': 'Person', name: author },
    publisher: {
      '@type': 'Organization',
      name: 'AlertMend AI',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logos/alertmend-logo.svg` },
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
  <meta property="og:image" content="${SITE_URL}${assetsBase}/milvus-hero.svg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(excerpt)}">
  <meta name="twitter:image" content="${SITE_URL}${assetsBase}/milvus-hero.svg">
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
          <a href="https://milvus.io/" target="_blank" rel="noopener noreferrer">
            <img src="${assetsBase}/milvus-logo.svg" alt="Milvus" class="brandLogo" width="142" height="40">
          </a>
          <span class="heroBrandSep" aria-hidden="true">×</span>
          <a href="/" class="heroAmLink">
            <img src="/logos/alertmend-logo.svg" alt="AlertMend" class="heroAmLogo" width="128" height="28">
          </a>
        </div>
        <p class="heroGuideLabel">Runbook · Milvus observability in production</p>
        <div class="heroAudience">
          <h2 class="heroAudienceTitle">You're in the right place if…</h2>
          <ul class="heroAudienceList">
            <li>You already run Milvus in production (Helm on Kubernetes, standalone Docker, Milvus Lite, or Zilliz Cloud)</li>
            <li>Your RAG, recommendation, or similarity search pipeline stops when vector search goes offline</li>
            <li>You want next-generation AI observability out of the box, not another DIY Prometheus and Grafana stack</li>
          </ul>
          <p class="heroAudienceNote">This is not a Milvus tutorial. It assumes Milvus is already in your stack and shows how to connect it to <a href="/">AlertMend</a>, a state-of-the-art AI observability platform with monitoring, AI-powered incident analysis, and auto-recovery built in. Milvus observability in a few clicks.</p>
        </div>
        <p class="seoTldr"><strong>TL;DR:</strong> Plug Milvus into AlertMend for health checks on your search endpoint, Slack alerts on query node crashes, and auto-restart when memory pressure kills pods.</p>
        <div class="heroContext">
          <div class="heroContextBlock">
            <h2 class="heroContextTitle">When Milvus stops working</h2>
            <p class="heroContextBody">Query nodes can run out of memory on large collections. Index builds can hang while inserts look fine. Search latency spikes while the metrics port still responds.</p>
            <p class="heroContextBody">These are common in production vector workloads. The gap is usually catching failure early and recovering without manually restarting query nodes at 2 a.m.</p>
          </div>
          <div class="heroContextBlock">
            <h2 class="heroContextTitle">Why AlertMend</h2>
            <p class="heroContextBody">AlertMend is a next-generation AI observability platform built for production AI workloads. Teams use it to monitor Kubernetes and vector pipelines without wiring Prometheus, Grafana, and PagerDuty themselves.</p>
            <p class="heroContextBody">For Milvus: connect your cluster, add a health check on your search endpoint, and AlertMend delivers Slack alerts with AI-powered root-cause analysis and auto-recovery runbooks, out of the box.</p>
          </div>
        </div>
        <p class="pipelineCaption">What AlertMend watches</p>
        <div class="pipeline">
          <div class="pipelineNode pipelineNodeFocus"><div class="pipelineLabel">Health check</div><div class="pipelineSub">Can it search?</div></div>
          <div class="pipelineNode"><div class="pipelineLabel">Memory</div><div class="pipelineSub">Query node pressure</div></div>
          <div class="pipelineNode"><div class="pipelineLabel">Latency</div><div class="pipelineSub">Slow similarity search</div></div>
          <div class="pipelineNode"><div class="pipelineLabel">Index</div><div class="pipelineSub">Stuck builds</div></div>
          <div class="pipelineNode"><div class="pipelineLabel">Alert + fix</div><div class="pipelineSub">Slack + auto-recover</div></div>
        </div>
      </section>

      <h2 class="sectionHead">How auto-recovery works</h2>
      <p class="sectionSub">Milvus fails under memory pressure, AlertMend detects it, alerts Slack, runs the restart runbook, and vector search is back online.</p>
      <figure class="flowDiagram">
        <img src="${assetsBase}/milvus-alertmend-recovery-flow.svg" alt="Sequence diagram: Milvus query node failure, AlertMend detects, alerts Slack, runs auto-recovery, Milvus returns online" width="960" height="720" loading="lazy">
        <figcaption class="flowDiagramCaption">Normal search, failure, Slack alert with AI summary, runbook restart, RAG pipeline restored.</figcaption>
      </figure>

      <p class="bodyText">Pick how you run Milvus below. Each section shows what to set up in AlertMend.</p>

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
      <div class="modeGrid" role="tablist" aria-label="Milvus deployment modes">
        ${MODES.map(([id, t, sub], i) => `<button type="button" role="tab" data-mode-id="${id}" class="modeCard${i === 2 ? ' modeCardActive' : ''}" aria-selected="${i === 2 ? 'true' : 'false'}"><span class="modeCardTitle">${esc(t)}</span><span class="modeCardSub">${esc(sub)}</span></button>`).join('\n        ')}
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
        <div class="dashboard" role="img" aria-label="AlertMend Milvus dashboard">
          <div class="dashboardChrome">
            <div class="chromeDots"><span class="chromeDot"></span><span class="chromeDot"></span><span class="chromeDot"></span></div>
            <span class="dashboardTitle" id="dash-title">AlertMend · milvus-prod</span>
            <span class="liveBadge"><span class="liveDot"></span> Live</span>
          </div>
          <div class="dashboardBody">
            <div class="metricCard">
              <div class="metricLabel" id="metric-primary-label">Health check</div>
              <div class="metricValue metricValueOk" id="metric-primary">200 OK</div>
            </div>
            <div class="metricCard">
              <div class="metricLabel">p95 search</div>
              <div class="metricValue metricValueWarn">890ms</div>
              <div class="metricBar"><div class="metricBarFill"></div></div>
            </div>
            <div class="metricCard">
              <div class="metricLabel" id="metric-secondary-label">Pod restarts (1h)</div>
              <div class="metricValue" id="metric-secondary">1</div>
            </div>
          </div>
          <div class="alertToast">
            <div class="alertText">
              <div class="alertTitle" id="dash-alert">Milvus query node OOM: auto-remediation triggered</div>
              <div class="alertMeta" id="dash-alert-meta">milvus-prod · Slack #incidents · 8s ago</div>
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
        <div class="ctaBandTitle">Next-generation AI observability for Milvus</div>
        <p class="ctaBandSub">AlertMend gives you monitoring, AI-powered incident analysis, and auto-recovery out of the box. Connect Milvus in a few clicks.</p>
        <div class="ctaBtnRow">
          <a href="${postSignupUrl}" class="ctaBtn">Start with auto-remediation →</a>
          <a href="${postCalendlyUrl}" class="ctaBtnSecondary" target="_blank" rel="noopener noreferrer">Book a demo</a>
        </div>
      </div>
    </div>

    <div class="promo">
      <p>Ready to eliminate manual firefighting? <a href="${postCalendlyUrl}" target="_blank" rel="noopener noreferrer">Book a demo</a> to see AlertMend on your Milvus stack.</p>
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
