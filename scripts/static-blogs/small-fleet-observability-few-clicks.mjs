/**
 * Code-generated rich blog: unified observability for small VM + container fleets.
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
  const heroImage = `${assetsBase}/hero.svg`

  const meta = parseFrontmatter(slug)
  const title = meta.title || 'VM & Container Observability Setup'
  const excerpt = meta.excerpt || ''
  const date = meta.date || '2026-07-10'
  const category = meta.category || 'Observability'
  const author = meta.author || 'AlertMend Team'
  const keywords =
    meta.keywords ||
    'vm monitoring, docker monitoring, container monitoring, logs metrics and traces, on-call escalation, AlertMend'

  const relatedPosts = getRelatedPosts(slug, category)
  const postSignupUrl = signupUrl(slug, 'blog-small-fleet')
  const postCalendlyUrl = calendlyUrl(slug)

  const SIGNAL_PILLARS = [
    [
      'Metrics',
      'CPU, memory, disk, and container health on every host',
      'See pressure before the process dies, not after SSH fails.',
    ],
    [
      'Logs',
      'Host journal, Docker stdout, and app logs in one query surface',
      'Jump from an alert to the exact error line without hopping tools.',
    ],
    [
      'Traces',
      'Request paths across containers and services on your VMs',
      'Find which hop slowed down or failed when users feel latency.',
    ],
    [
      'Alerts + on-call',
      'Thresholds, Slack incidents, schedules, and escalation',
      'The right person gets paged, with context, not a raw graph.',
    ],
  ]

  const FAILURE_MODES = [
    [
      'Container exits, host still green',
      'SSH works. Cloud console looks fine. Your API container exited an hour ago.',
      'Container exit and restart alerts plus an external URL check on the public path.',
    ],
    [
      'Disk fills from logs and layers',
      'Writes start failing. Restarts do not help because the volume is full.',
      'Disk threshold alerts before 85%, with a cleanup runbook when it keeps climbing.',
    ],
    [
      'Slow requests, no single red metric',
      'CPU is fine. Memory is fine. Users still time out on one endpoint.',
      'Trace the slow path, then alert on latency and error rate for that service.',
    ],
    [
      'Alert fires, nobody owns it',
      'Slack fills up. The primary is offline. The issue sits until morning.',
      'On-call schedule with escalation to secondary, phone, or WhatsApp when unacked.',
    ],
  ]

  const ALERTMEND_FLOW = [
    [
      'Connect your VMs',
      'Add your 3 to 4 hosts in AlertMend. Containers on those hosts show up without standing up Prometheus, Loki, Tempo, and Grafana yourself.',
    ],
    [
      'Turn on the three signals',
      'Enable metrics, log collection, and traces for the services that matter. One workspace holds all three so incidents are not split across tools.',
    ],
    [
      'Set alerts that page people',
      'Wire URL checks, resource thresholds, and error-rate rules to Slack or Teams. AlertMend opens an incident with a plain-language summary and deep links.',
    ],
    [
      'Add on-call escalation',
      'Define primary and secondary rotations. If the first person does not acknowledge, AlertMend escalates so critical issues do not sit in an unread channel.',
    ],
  ]

  const WHEN_TO_ALERT = [
    [
      'Public URL fails twice',
      'Page on-call',
      'Synthetic check → Slack incident → escalate if unacked.',
    ],
    [
      'Container exited or restart loop',
      'Alert and optionally restart',
      'Exit/restart signal + runbook to bring the container back.',
    ],
    [
      'Disk above 85%',
      'Warn, then page if rising',
      'Host metric alert before writes fail.',
    ],
    [
      'Error rate or p95 latency spike',
      'Page with traces attached',
      'Metrics trip the alert; traces show which hop broke.',
    ],
    [
      'Primary does not acknowledge',
      'Escalate',
      'On-call policy moves to secondary, then phone or WhatsApp.',
    ],
  ]

  const FAQ = [
    [
      'How do I monitor VMs and Docker containers in one place?',
      'Connect your hosts in AlertMend, enable metrics, logs, and traces for the containers that serve traffic, then add URL checks and on-call routing. You get unified observability without assembling a DIY stack.',
    ],
    [
      'How do I get logs, metrics, and traces together for a small fleet?',
      'Metrics tell you something is wrong. Logs tell you what failed. Traces tell you where in the request path it failed. AlertMend keeps all three in one workspace so on-call does not jump between tools during an incident.',
    ],
    [
      'How do I monitor Docker containers on VMs?',
      'After you connect the VM, AlertMend surfaces container health, restarts, and resource use alongside host metrics. Pair that with log collection and a URL check on the public endpoint your users hit.',
    ],
    [
      'How do I set up on-call escalation without PagerDuty?',
      'AlertMend includes on-call schedules and escalation policies. Route to Slack or Teams first, then escalate to secondary, SMS, phone, or WhatsApp when the primary does not acknowledge.',
    ],
    [
      'Do I need OpenTelemetry to monitor 3 to 4 VMs?',
      'It helps if your apps already emit OTel traces, but you do not need a full collector farm on day one. Start with host and container metrics, logs, and URL checks in AlertMend, then add traces for the services that own user-facing latency.',
    ],
    [
      'What should I alert on first for Linux server monitoring?',
      'Start with: public URL down, container exit or restart loop, disk above 85%, and sustained high memory. Wire those to on-call with escalation. Add latency and error-rate alerts once traces and app metrics are flowing.',
    ],
    [
      'Is AlertMend a Prometheus Grafana Loki alternative for small teams?',
      'Those tools work, but you still own collectors, storage, dashboards, alert rules, and a separate pager. AlertMend is next-generation AI observability: signals, AI-assisted incident context, alerts, and on-call escalation in one product you can connect in a few clicks.',
    ],
    [
      'How do I monitor Docker Compose in production?',
      'Connect the VM that runs Compose, enable container metrics and logs for each service, add a URL check on the public hostname, and route failures to on-call with escalation. AlertMend can also restart exited containers when you enable a runbook.',
    ],
    [
      'Can AlertMend auto-recover failed containers on VMs?',
      'Yes. For repeat failures like exited containers or resource pressure, enable a restart runbook so AlertMend can bring the service back while your on-call gets the Slack summary and evidence.',
    ],
  ]

  const MODES = [
    ['docker', 'Docker Compose', 'Few containers on 1 to 2 VMs'],
    ['systemd', 'Systemd + Docker', 'Host services plus containers'],
    ['multi', 'Multi-VM fleet', '3 to 4 hosts, shared apps'],
    ['hybrid', 'Hybrid cloud VMs', 'Mix of cloud and on-prem'],
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
    name: 'How to set up VM and Docker monitoring with AlertMend',
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
    image: `https://www.alertmend.io${heroImage}`,
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
  <meta property="og:image" content="https://www.alertmend.io${heroImage}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(excerpt)}">
  <meta name="twitter:image" content="https://www.alertmend.io${heroImage}">
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
${buildArticleHeader(title, author, date, category)}

    <div class="dl-blog">
      <section class="heroBand">
        <div class="heroBrands">
          <a href="/" class="heroAmLink">
            <img src="/logos/alertmend-logo.svg" alt="AlertMend" class="heroAmLogo" width="128" height="28">
          </a>
        </div>
        <p class="heroGuideLabel">Runbook · VM monitoring, Docker observability, on-call</p>
        <div class="heroAudience">
          <h2 class="heroAudienceTitle">You're in the right place if…</h2>
          <ul class="heroAudienceList">
            <li>You run about 3 to 4 Linux VMs with a handful of Docker containers (Compose, systemd, or mixed)</li>
            <li>You want logs, metrics, and traces in one observability platform, not three separate tools</li>
            <li>You need alerts and on-call escalation without standing up Prometheus, Loki, Tempo, and a pager</li>
          </ul>
          <p class="heroAudienceNote">This is not a Docker or Linux tutorial. It assumes your VMs and containers are already running and shows how to connect them to <a href="/">AlertMend</a> for unified observability, alerts, and on-call in a few clicks.</p>
        </div>
        <p class="seoTldr"><strong>TL;DR:</strong> Connect your VMs and Docker containers to AlertMend for logs, metrics, and traces in one place, then wire alerts and on-call escalation without a DIY monitoring stack.</p>
        <div class="heroContext">
          <div class="heroContextBlock">
            <h2 class="heroContextTitle">When a small fleet goes quiet</h2>
            <p class="heroContextBody">Three VMs and a few containers feel simple until one container exits overnight, disk fills from log layers, or a slow hop only shows up in traces. Metrics alone look green while users already feel the outage.</p>
            <p class="heroContextBody">The gap is rarely "we need more dashboards." It is having all three signals in one place, plus a path from alert to the person who can act.</p>
          </div>
          <div class="heroContextBlock">
            <h2 class="heroContextTitle">Why AlertMend</h2>
            <p class="heroContextBody">AlertMend is a next-generation AI observability platform for production workloads on Kubernetes, VMs, and containers. Teams use it when they want monitoring, AI-assisted incident context, and on-call routing without assembling the stack piece by piece.</p>
            <p class="heroContextBody">For a small fleet: connect the hosts, turn on logs + metrics + traces, set alerts, and add escalation. Out of the box, in a few clicks.</p>
          </div>
        </div>
        <p class="pipelineCaption">What you get in one place</p>
        <div class="pipeline">
          <div class="pipelineNode pipelineNodeFocus"><div class="pipelineLabel">Metrics</div><div class="pipelineSub">Hosts + containers</div></div>
          <div class="pipelineNode"><div class="pipelineLabel">Logs</div><div class="pipelineSub">Journal + Docker</div></div>
          <div class="pipelineNode"><div class="pipelineLabel">Traces</div><div class="pipelineSub">Request paths</div></div>
          <div class="pipelineNode"><div class="pipelineLabel">Alerts</div><div class="pipelineSub">Slack / Teams</div></div>
          <div class="pipelineNode"><div class="pipelineLabel">On-call</div><div class="pipelineSub">Escalate if needed</div></div>
        </div>
      </section>

      <h2 class="sectionHead">How to get logs, metrics, and traces in one place</h2>
      <p class="sectionSub">A simple sequence: your VMs and containers emit signals, AlertMend correlates them, alerts Slack, and escalates when on-call does not acknowledge.</p>
      <figure class="flowDiagram">
        <img src="${assetsBase}/recovery-flow.svg" alt="Sequence diagram: VM and Docker monitoring with logs metrics traces flowing into AlertMend, Slack alert, and on-call escalation" width="960" height="640" loading="lazy">
        <figcaption class="flowDiagramCaption">Connect hosts, collect logs metrics and traces, alert the team, escalate if unacked.</figcaption>
      </figure>

      <h2 class="sectionHead">What VM and container monitoring should cover</h2>
      <div class="searchIssueGrid">
        ${SIGNAL_PILLARS.map(
          ([term, desc, am]) =>
            `<div class="searchIssueCard"><h3 class="searchIssueTerm">${esc(term)}</h3><p class="searchIssueDesc">${esc(desc)}</p><p class="searchIssueAlert"><strong>Why it matters:</strong> ${esc(am)}</p></div>`
        ).join('\n        ')}
      </div>

      <h2 class="sectionHead">How to set up VM monitoring in four steps</h2>
      <div class="amFlow">
        ${ALERTMEND_FLOW.map(
          ([t, b], i) =>
            `<div class="amStep"><div class="amStepHead"><span class="amStepNum">${i + 1}</span></div><h3 class="amStepTitle">${esc(t)}</h3><p class="amStepBody">${esc(b)}</p></div>`
        ).join('\n        ')}
      </div>

      <h2 class="sectionHead">How to monitor Docker containers on VMs</h2>
      <div class="modeGrid" role="tablist" aria-label="Small fleet deployment modes">
        ${MODES.map(
          ([id, t, sub], i) =>
            `<button type="button" role="tab" data-mode-id="${id}" class="modeCard${i === 0 ? ' modeCardActive' : ''}" aria-selected="${i === 0 ? 'true' : 'false'}"><span class="modeCardTitle">${esc(t)}</span><span class="modeCardSub">${esc(sub)}</span></button>`
        ).join('\n        ')}
      </div>
      <div class="modePlaybook" role="tabpanel">
        <div class="modePlaybookHead">
          <h3 class="modePlaybookTitle" id="mode-playbook-title">Runbook: Docker Compose</h3>
          <span class="modePlaybookBadge">Production</span>
        </div>
        <p class="modePlaybookSummary" id="mode-playbook-summary"></p>
        <p class="stepPanelBody"><strong>Set up in AlertMend</strong></p>
        <ul class="checkList" id="mode-playbook-steps"></ul>
        <div class="stepTip"><span id="mode-playbook-tip"></span></div>
      </div>

      <div class="dashboardWrap">
        <div class="dashboard" role="img" aria-label="AlertMend small fleet observability dashboard">
          <div class="dashboardChrome">
            <div class="chromeDots"><span class="chromeDot"></span><span class="chromeDot"></span><span class="chromeDot"></span></div>
            <span class="dashboardTitle" id="dash-title">AlertMend · fleet-prod</span>
            <span class="liveBadge"><span class="liveDot"></span> Live</span>
          </div>
          <div class="dashboardBody">
            <div class="metricCard">
              <div class="metricLabel" id="metric-primary-label">URL check</div>
              <div class="metricValue metricValueOk" id="metric-primary">200 OK</div>
            </div>
            <div class="metricCard">
              <div class="metricLabel">p95 latency</div>
              <div class="metricValue metricValueWarn">820ms</div>
              <div class="metricBar"><div class="metricBarFill"></div></div>
            </div>
            <div class="metricCard">
              <div class="metricLabel" id="metric-secondary-label">Container restarts (1h)</div>
              <div class="metricValue" id="metric-secondary">1</div>
            </div>
          </div>
          <div class="alertToast">
            <div class="alertText">
              <div class="alertTitle" id="dash-alert">api container exited: Slack incident + escalate if unacked</div>
              <div class="alertMeta" id="dash-alert-meta">vm-02 · Slack #oncall · 8s ago</div>
            </div>
          </div>
        </div>
      </div>

      <h2 class="sectionHead">How to set up on-call escalation for server alerts</h2>
      <div class="diyWrap">
        <table class="compareTable">
          <thead><tr><th>Signal</th><th>Action</th><th>In AlertMend</th></tr></thead>
          <tbody>
            ${WHEN_TO_ALERT.map(
              ([s, a, m]) =>
                `<tr><td>${esc(s)}</td><td class="diyHighlight">${esc(a)}</td><td>${esc(m)}</td></tr>`
            ).join('\n            ')}
          </tbody>
        </table>
      </div>

      <h2 class="sectionHead">Common Linux server and Docker monitoring failures</h2>
      <div class="searchIssueGrid">
        ${FAILURE_MODES.map(
          ([term, desc, am]) =>
            `<div class="searchIssueCard"><h3 class="searchIssueTerm">${esc(term)}</h3><p class="searchIssueDesc">${esc(desc)}</p><p class="searchIssueAlert"><strong>In AlertMend:</strong> ${esc(am)}</p></div>`
        ).join('\n        ')}
      </div>

      <h2 class="sectionHead">FAQ</h2>
      <div class="faqList">
        ${FAQ.map(
          ([q, a], i) =>
            `<div class="faqItem"><button type="button" class="faqQuestion" data-faq-toggle aria-expanded="${i === 0 ? 'true' : 'false'}">${esc(q)}<svg class="faqChevron${i === 0 ? ' faqChevronOpen' : ''}" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 9l6 6 6-6"/></svg></button><div class="faqAnswer${i === 0 ? '' : ' hidden'}">${esc(a)}</div></div>`
        ).join('\n        ')}
      </div>

      <div class="ctaBand">
        <div class="ctaBandTitle">Logs, metrics, traces, and on-call in one place</div>
        <p class="ctaBandSub">AlertMend gives small fleets next-generation AI observability out of the box. Connect a few VMs, turn on the three signals, and wire escalation in a few clicks.</p>
        <div class="ctaBtnRow">
          <a href="${postSignupUrl}" class="ctaBtn">Start with AlertMend →</a>
          <a href="${postCalendlyUrl}" class="ctaBtnSecondary" target="_blank" rel="noopener noreferrer">Book a demo</a>
        </div>
      </div>
    </div>

    <div class="promo">
      <p>Ready to stop piecing together monitoring tools? <a href="${postCalendlyUrl}" target="_blank" rel="noopener noreferrer">Book a demo</a> to see AlertMend on your VM and container fleet.</p>
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
