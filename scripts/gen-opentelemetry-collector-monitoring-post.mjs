import path from 'path'
import { fileURLToPath } from 'url'
import {
  AUTHOR_CRED_CSS,
  BLOG_SIGNUP_HANDLER_JS,
  CHROME_INLINE_CSS,
  SITE_URL,
  buildNavHtml,
  buildSidebarHtml,
  calendlyUrl,
  esc,
  getRelatedPosts,
  writeStaticBlogOutputs,
} from './static-blog-shared.mjs'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')

const slug = 'opentelemetry-collector-monitoring'
const title = 'OpenTelemetry Collector Monitoring'
const h1 = 'OpenTelemetry Collector Monitoring: Keep Your Telemetry Pipeline Healthy'
const description = 'Monitor the OpenTelemetry Collector itself: health checks, internal metrics, exporter failures, queue buildup, dropped spans, and safe recovery workflows.'
const publishedDate = '2026-07-14'
const modifiedDate = '2026-07-14'
const category = 'Observability'
const seoKeywords = [
  'OpenTelemetry Collector monitoring',
  'OTel Collector monitoring',
  'monitor OpenTelemetry Collector',
  'OpenTelemetry Collector metrics',
  'otelcol internal metrics',
  'OTel Collector health check',
  'OpenTelemetry Collector health_check',
  'OTel Collector exporter failed',
  'OpenTelemetry Collector exporter send failed',
  'OpenTelemetry Collector queue size',
  'OpenTelemetry Collector queue capacity',
  'OpenTelemetry Collector dropped spans',
  'OpenTelemetry Collector dropped logs',
  'OpenTelemetry Collector dropped metrics',
  'otelcol exporter send failed spans',
  'otelcol exporter enqueue failed spans',
  'otelcol receiver refused spans',
  'OpenTelemetry Collector Kubernetes monitoring',
  'Kubernetes OTel Collector monitoring',
  'OTel Collector zPages',
  'OTel Collector pprof',
  'telemetry pipeline monitoring',
  'observability pipeline monitoring',
  'AlertMend OpenTelemetry Collector',
]
const keywords = seoKeywords.join(', ')
const canonical = `${SITE_URL}/blog/${slug}`
const calendly = calendlyUrl(slug)
const related = getRelatedPosts(slug, category)
const heroImage = `${SITE_URL}/assets/${slug}/hero.svg`
const dineshLinkedin = 'https://www.linkedin.com/in/dineshagrawal85/'
const author = {
  name: 'Dinesh Agrawal',
  role: 'AI Agent Automation Expert',
  linkedin: dineshLinkedin,
}

const faq = [
  {
    q: 'How do I monitor the OpenTelemetry Collector?',
    a: 'Monitor the Collector like production infrastructure. Check the health_check extension, scrape internal metrics on port 8888 where exposed, watch stderr logs, alert on receiver refused items, exporter send failures, failed enqueue, queue size, queue capacity, memory, CPU, uptime, pod restarts, and backend reachability.',
  },
  {
    q: 'What are the most important OpenTelemetry Collector metrics?',
    a: 'Start with receiver accepted and refused items, exporter sent items, exporter send failed items, exporter failed enqueue, exporter queue size and capacity, processor incoming and outgoing items, process uptime, CPU, memory RSS, and heap usage. Metric names can vary by Collector version and Prometheus export settings, so verify names in your own /metrics output.',
  },
  {
    q: 'Why is my OpenTelemetry Collector running but no data appears in the backend?',
    a: 'The most common causes are wrong OTLP endpoint, receiver not enabled in the service pipeline, app exporting to the wrong protocol or port, exporter credentials failure, network policy blocking egress, backend throttling, or queue buildup that eventually drops telemetry.',
  },
  {
    q: 'How do I know if the OpenTelemetry Collector is dropping spans?',
    a: 'Look for increasing receiver refused spans, exporter enqueue failed spans, exporter send failed spans, high queue utilization, retry messages in Collector logs, and gaps between incoming and outgoing pipeline counts. Also check the backend for ingest throttling or authentication failures.',
  },
  {
    q: 'What is the OpenTelemetry Collector health_check extension?',
    a: 'The health_check extension exposes a health endpoint for the Collector process. It is useful for Kubernetes liveness and readiness style checks, but it does not prove that every receiver, processor, exporter, and backend path is healthy. Pair it with internal metrics and log-based checks.',
  },
  {
    q: 'What are zPages and pprof in the OpenTelemetry Collector?',
    a: 'zPages and pprof are diagnostic extensions. zPages help inspect live Collector pipeline behavior, and pprof helps debug CPU, memory, and goroutine issues. They are powerful troubleshooting endpoints, so expose them carefully and restrict access.',
  },
  {
    q: 'Should the Collector run as a DaemonSet or a gateway in Kubernetes?',
    a: 'Use a DaemonSet when every node should have a local agent for node-level or workload-adjacent collection. Use a gateway Deployment when you need central batching, sampling, routing, or export control. Many production setups use both: node agents send to a gateway layer.',
  },
  {
    q: 'Can I monitor the OpenTelemetry Collector with Prometheus and Grafana?',
    a: 'Yes. Expose the Collector internal Prometheus endpoint, usually on port 8888, then scrape it and build alerts for queue utilization, exporter failures, receiver refused items, process memory, and restarts. Grafana is good for visibility, but you still need an escalation and recovery workflow when the pipeline fails.',
  },
  {
    q: 'Can AlertMend monitor and auto-recover OpenTelemetry Collector failures?',
    a: 'Yes. AlertMend can sit beside your existing observability stack, watch Collector pods or VMs, internal metrics, logs, queues, exporter failures, and backend reachability, then route incidents to the right owner and trigger approved recovery actions such as restart, scale, rollback, config validation, or failover.',
  },
  {
    q: 'Is OpenTelemetry Collector monitoring different from application observability?',
    a: 'Yes. Application observability tells you what your services are doing. Collector monitoring tells you whether the telemetry pipeline itself is healthy. If the Collector is failing, your dashboards may look clean only because data stopped arriving.',
  },
]

const howToSteps = [
  { name: 'Expose Collector self-telemetry', text: 'Enable health_check and scrape internal metrics, commonly from the Prometheus endpoint on port 8888.' },
  { name: 'Alert on pipeline failure signals', text: 'Watch receiver refused items, exporter send failures, failed enqueue, queue utilization, memory, CPU, and pod restarts.' },
  { name: 'Correlate with backend and Kubernetes context', text: 'Check exporter destination health, network policy, credentials, throttling, rollout history, resource limits, and OOMKilled events.' },
  { name: 'Automate safe recovery', text: 'Use approved runbooks for restart, scale, rollback, failover, and config validation, with human approval where risk is high.' },
]

const blogPosting = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: h1,
  description,
  keywords,
  image: heroImage,
  datePublished: publishedDate,
  dateModified: modifiedDate,
  author: {
    '@type': 'Person',
    name: author.name,
    jobTitle: author.role,
    url: author.linkedin,
    sameAs: [author.linkedin],
  },
  publisher: {
    '@type': 'Organization',
    name: 'AlertMend AI',
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/logos/alertmend-logo.svg`,
    },
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': canonical,
  },
}

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to monitor the OpenTelemetry Collector',
  description,
  step: howToSteps.map((step, index) => ({
    '@type': 'HowToStep',
    position: index + 1,
    name: step.name,
    text: step.text,
  })),
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.a,
    },
  })),
}

const symptoms = [
  {
    id: 'no-data',
    label: 'No data',
    output: 'otelcol is running\nbackend shows no new traces\nreceiver accepted count is flat',
    meaning: 'The process is alive, but data is not entering the active pipeline or is being exported to the wrong destination.',
    checks: ['Confirm the app exports to the right OTLP endpoint and protocol.', 'Verify the receiver appears in service.pipelines.', 'Check Collector logs for connection, TLS, or auth errors.'],
    fix: 'Fix endpoint or pipeline wiring first. Do not restart the application until you prove the Collector is actually receiving data.',
  },
  {
    id: 'exporter-failed',
    label: 'Exporter failed',
    output: 'exporter send failed spans increasing\nretry backoff in collector logs\nbackend ingest errors',
    meaning: 'The Collector is receiving data but cannot deliver it to the backend. This is often auth, DNS, network, TLS, backend throttling, or exporter config.',
    checks: ['Test backend DNS and network egress from the Collector pod or VM.', 'Validate credentials, headers, TLS settings, and endpoint path.', 'Look for backend rate limits or ingest quota failures.'],
    fix: 'Repair the exporter destination, then watch queue size drain. If the queue keeps growing, scale the gateway or fail over to a secondary export path.',
  },
  {
    id: 'queue-full',
    label: 'Queue full',
    output: 'exporter queue size near capacity\nenqueue failed metrics increasing\ntelemetry lag rising',
    meaning: 'The backend is slow or the Collector is underprovisioned. Once enqueue failures begin, telemetry is being lost.',
    checks: ['Compare queue size with queue capacity.', 'Check CPU, memory, and exporter in-flight requests.', 'Look for backend latency or throttling.'],
    fix: 'Scale gateways, increase safe queue capacity, tune batch settings, reduce burst volume, or route critical telemetry through a separate pipeline.',
  },
  {
    id: 'oom',
    label: 'OOM or restart',
    output: 'pod restarted\nlast state OOMKilled\nmemory rss climbs before crash',
    meaning: 'The Collector is running out of memory or receiving a burst it cannot buffer. A simple restart may only reset the clock.',
    checks: ['Check memory limiter configuration.', 'Inspect queue size, batch sizes, and cardinality-heavy metrics.', 'Review resource requests, limits, and node pressure.'],
    fix: 'Add or tune memory_limiter, right-size pod limits, scale the Collector layer, and reduce high-cardinality or low-value telemetry before export.',
  },
  {
    id: 'refused',
    label: 'Receiver refused',
    output: 'receiver refused spans increasing\naccepted items still increasing\nclient retry errors',
    meaning: 'The receiver is rejecting some telemetry. Causes include malformed payloads, unsupported protocol, backpressure, or pipeline overload.',
    checks: ['Check receiver protocol and payload format.', 'Compare refused counts by signal type.', 'Look for overloaded processors or exporters downstream.'],
    fix: 'Fix client export settings or reduce pressure downstream. If refused counts spike during deploys, correlate with new instrumentation or traffic shape.',
  },
]

function icon(name) {
  const icons = {
    alert: '<svg class="iconSvg" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    book: '<svg class="iconSvg" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    calendar: '<svg class="iconSvg" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    check: '<svg class="iconSvg" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 6 9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    code: '<svg class="iconSvg" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m16 18 6-6-6-6M8 6l-6 6 6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    cpu: '<svg class="iconSvg" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="7" y="7" width="10" height="10" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    database: '<svg class="iconSvg" viewBox="0 0 24 24" fill="none" aria-hidden="true"><ellipse cx="12" cy="5" rx="8" ry="3" stroke="currentColor" stroke-width="1.8"/><path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    flow: '<svg class="iconSvg" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="5" cy="12" r="3" stroke="currentColor" stroke-width="1.8"/><circle cx="19" cy="6" r="3" stroke="currentColor" stroke-width="1.8"/><circle cx="19" cy="18" r="3" stroke="currentColor" stroke-width="1.8"/><path d="M8 12h4a4 4 0 0 0 4-4M8 12h4a4 4 0 0 1 4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    graph: '<svg class="iconSvg" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 19V5m0 14h16M8 16l3-4 3 2 5-7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    k8s: '<svg class="iconSvg" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m12 2 8 4.5v9L12 22l-8-6.5v-9L12 2Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M12 7v10M7.7 9.5l8.6 5M16.3 9.5l-8.6 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    link: '<svg class="iconSvg" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.07 0l2.12-2.12a5 5 0 0 0-7.07-7.07L11 4.93M14 11a5 5 0 0 0-7.07 0L4.81 13.12a5 5 0 0 0 7.07 7.07L13 19.07" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    memory: '<svg class="iconSvg" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="5" y="6" width="14" height="12" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M8 10h8M8 14h5M7 3v3M12 3v3M17 3v3M7 18v3M12 18v3M17 18v3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    phone: '<svg class="iconSvg" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.77.63 2.61a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6.27 6.27l1.29-1.29a2 2 0 0 1 2.11-.45c.84.3 1.71.51 2.61.63A2 2 0 0 1 22 16.92Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    queue: '<svg class="iconSvg" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="m17 15 3 2-3 2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    route: '<svg class="iconSvg" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="6" cy="6" r="3" stroke="currentColor" stroke-width="1.8"/><circle cx="18" cy="18" r="3" stroke="currentColor" stroke-width="1.8"/><path d="M9 6h4a5 5 0 0 1 0 10H9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="m11 13-3 3 3 3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    shield: '<svg class="iconSvg" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="m9 12 2 2 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    tag: '<svg class="iconSvg" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20.59 13.41 11 3.83A2 2 0 0 0 9.59 3H4a1 1 0 0 0-1 1v5.59A2 2 0 0 0 3.83 11l9.58 9.59a2 2 0 0 0 2.83 0l4.35-4.35a2 2 0 0 0 0-2.83Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M7.5 7.5h.01" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
    terminal: '<svg class="iconSvg" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m4 17 5-5-5-5M12 19h8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    whatsapp: '<svg class="iconSvg" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12.04 3.5a8.46 8.46 0 0 0-7.2 12.9L3.8 20.2l3.9-1a8.46 8.46 0 1 0 4.34-15.7Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.75 8.65c.16-.35.33-.36.49-.36h.41c.13 0 .31.05.47.36.16.31.54 1.07.59 1.15.05.08.08.18.02.29-.06.11-.1.18-.2.28l-.3.33c-.1.1-.2.22-.09.42.11.2.48.8 1.03 1.3.71.64 1.3.84 1.5.94.2.1.32.08.44-.05.13-.14.5-.58.63-.78.13-.2.27-.17.45-.1.18.06 1.13.53 1.32.63.2.1.33.15.38.24.05.08.05.48-.11.94-.16.46-.92.89-1.28.93-.33.04-.75.06-1.2-.08-.28-.08-.63-.2-1.08-.4-1.9-.82-3.14-2.72-3.24-2.85-.1-.13-.77-1.02-.77-1.95s.49-1.38.54-1.46Z" fill="currentColor"/></svg>',
  }
  return icons[name] || icons.check
}

function authorCard() {
  return `
  <section class="authorBioCard" aria-label="About the author">
    <img src="/logos/dinesh.jpeg" alt="${esc(author.name)}" width="128" height="128" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
    <div class="authorBioFallback" aria-hidden="true">DA</div>
    <div class="authorBioContent">
      <h3>${esc(author.name)}</h3>
      <p class="authorBioRole">AI Agent Automation Expert</p>
      <div class="authorBioText">
        <p>Dinesh is a software engineer and entrepreneur focused on AI-agent automation for cloud infrastructure, observability pipelines, and incident response.</p>
        <p>Previously at Polymer Search and Roambee, and Co-Founder of FutureApp e-schools, he works on converting noisy telemetry and alerts into safe, auditable automation: diagnosis, escalation, runbooks, and self-healing recovery.</p>
      </div>
      <a class="authorBioLink" href="${author.linkedin}" target="_blank" rel="noopener noreferrer" aria-label="${esc(author.name)} on LinkedIn">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zM8.34 18V9.94H5.67V18h2.67zM7 8.76a1.55 1.55 0 1 0 0-3.1 1.55 1.55 0 0 0 0 3.1zM18.34 18v-4.42c0-2.37-1.27-3.47-2.96-3.47-1.36 0-1.97.75-2.31 1.28V9.94h-2.67V18h2.67v-4.5c0-.24.02-.48.09-.65.19-.48.63-.98 1.36-.98.96 0 1.35.73 1.35 1.8V18h2.82z"/></svg>
        <span>LinkedIn</span>
      </a>
    </div>
  </section>`
}

function faqHtml() {
  return faq.map((item, index) => `
    <div class="faqItem">
      <button class="faqQuestion" type="button" aria-expanded="${index === 0 ? 'true' : 'false'}">
        <span>${esc(item.q)}</span>
        <svg class="faqChevron${index === 0 ? ' faqChevronOpen' : ''}" width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <div class="faqAnswer" ${index === 0 ? '' : 'hidden'}>${esc(item.a)}</div>
    </div>`).join('')
}

function symptomButtonsHtml() {
  return symptoms.map((item, index) => `
    <button class="symptomButton${index === 0 ? ' isActive' : ''}" type="button" data-symptom="${item.id}" aria-pressed="${index === 0 ? 'true' : 'false'}">${esc(item.label)}</button>
  `).join('')
}

function symptomPanelsHtml() {
  return symptoms.map((item, index) => `
    <div class="symptomPanel${index === 0 ? ' isActive' : ''}" data-symptom-panel="${item.id}" ${index === 0 ? '' : 'hidden'}>
      <div class="symptomTerminal">
        <div class="terminalChrome"><span></span><span></span><span></span></div>
        <pre>${esc(item.output)}</pre>
      </div>
      <div class="symptomExplain">
        <span class="eyebrow">Interpretation</span>
        <h3>${esc(item.meaning)}</h3>
        <ul>${item.checks.map((check) => `<li>${esc(check)}</li>`).join('')}</ul>
        <p><strong>Safe fix:</strong> ${esc(item.fix)}</p>
      </div>
    </div>
  `).join('')
}

const content = `
<header class="article-header article-header--cred">
  <div class="brandChip"><img src="/logos/alertmend-logo.svg" alt="" width="30" height="30">AlertMend</div>
  <h1>${esc(h1)}</h1>
  <p class="articleSubtitle">${esc(description)}</p>
  <div class="writerByline" aria-label="Article author">
    <img src="/logos/dinesh.jpeg" alt="${esc(author.name)}" width="44" height="44" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
    <div class="writerFallback" aria-hidden="true">DA</div>
    <div>
      <a href="${author.linkedin}" target="_blank" rel="noopener noreferrer">${esc(author.name)}</a>
      <p class="writerExpertLine">AI-agent automation expert focused on cloud infrastructure, observability pipelines, and safe incident recovery.</p>
      <p class="bylineMeta">${icon('calendar')}<span>${esc(publishedDate)}</span><span class="metaDot">•</span>${icon('tag')}<span>${esc(category)}</span></p>
    </div>
  </div>
</header>

<div class="proofStrip" aria-label="Article verification">
  <strong><span class="proofIcon">${icon('check')}</span> Verified against OpenTelemetry Collector docs</strong>
  <span class="dot">•</span>
  <span>Last reviewed ${modifiedDate}</span>
  <span class="dot">•</span>
  <span>5 primary sources cited</span>
</div>

<article class="otelArticle article-content">
  <section class="heroPanel" id="answer">
    <div class="heroGrid">
      <div class="answerCard">
        <span class="eyebrow">The 10-second answer</span>
        <h2>The Collector is part of production now. Monitor it like a service.</h2>
        <p>If your OpenTelemetry Collector fails, your dashboards can look quiet for the worst possible reason: telemetry stopped arriving. Good Collector monitoring watches health, internal metrics, queue pressure, exporter failures, memory, restarts, and backend reachability.</p>
        <div class="answerChecklist">
          <span>${icon('check')} health_check endpoint</span>
          <span>${icon('graph')} internal metrics on 8888</span>
          <span>${icon('queue')} queue size and failed enqueue</span>
          <span>${icon('alert')} exporter send failures</span>
          <span>${icon('memory')} memory, CPU, restarts</span>
        </div>
        <div class="quickCta">
          <a class="ctaButton ctaButtonPrimary" href="${calendly}&intent=otel-collector-review" target="_blank" rel="noopener noreferrer">Review my Collector alerts</a>
          <a class="ctaButton ctaButtonSecondary" href="#starter-config">Copy starter config</a>
        </div>
      </div>
      <div class="pipelineViz" aria-label="Telemetry pipeline animation">
        <div class="pipelineHeader">
          <span>${icon('flow')} telemetry pipeline</span>
          <strong>healthy</strong>
        </div>
        <div class="pipeTrack">
          <div class="pipeLine"></div>
          <span class="pulseDot pulseDotOne"></span>
          <span class="pulseDot pulseDotTwo"></span>
          <div class="pipeNode"><span>${icon('code')}</span><strong>Apps</strong><small>OTLP</small></div>
          <div class="pipeNode collectorNode"><span>${icon('cpu')}</span><strong>Collector</strong><small>receive · process · export</small></div>
          <div class="pipeNode"><span>${icon('database')}</span><strong>Backend</strong><small>traces · metrics · logs</small></div>
        </div>
        <div class="miniMetrics">
          <div><span>queue</span><strong>42%</strong><em style="width:42%"></em></div>
          <div><span>export</span><strong>ok</strong><em style="width:82%"></em></div>
          <div><span>memory</span><strong>61%</strong><em style="width:61%"></em></div>
        </div>
      </div>
    </div>
  </section>

  <nav class="tocPills" aria-label="On this page">
    <a href="#signals">Signals</a>
    <a href="#decoder">Decoder</a>
    <a href="#starter-config">Config</a>
    <a href="#alerts">Alerts</a>
    <a href="#kubernetes">Kubernetes</a>
    <a href="#mistakes">Mistakes</a>
    <a href="#automation">Automation</a>
    <a href="#sources">Sources</a>
    <a href="#faq">FAQ</a>
  </nav>

  <section class="sectionBlock" id="signals">
    <span class="eyebrow">What to watch</span>
    <h2 class="sectionTitle hasIcon"><span class="headingIcon">${icon('graph')}</span>The Collector failure signals that actually matter</h2>
    <p class="bodyText">The OpenTelemetry Collector has receivers, processors, exporters, connectors, and extensions. Monitoring only the process misses the point. You need to know whether telemetry is entering, moving through, and leaving the pipeline.</p>
    <div class="signalGrid">
      <div class="signalCard">
        <span class="signalIcon">${icon('check')}</span>
        <h3>Health</h3>
        <p>Use the health_check extension for process-level health. Treat it as necessary, not sufficient.</p>
        <code>health_check: 0.0.0.0:13133</code>
      </div>
      <div class="signalCard">
        <span class="signalIcon">${icon('graph')}</span>
        <h3>Receiver intake</h3>
        <p>Watch accepted and refused telemetry by signal type. Refused items mean clients are losing data or retrying.</p>
        <code>otelcol_receiver_refused_spans</code>
      </div>
      <div class="signalCard">
        <span class="signalIcon">${icon('alert')}</span>
        <h3>Exporter delivery</h3>
        <p>Exporter send failures mean the Collector got data but could not deliver it to the destination.</p>
        <code>otelcol_exporter_send_failed_spans</code>
      </div>
      <div class="signalCard">
        <span class="signalIcon">${icon('queue')}</span>
        <h3>Queue pressure</h3>
        <p>Queue size near capacity is the early warning. Failed enqueue is the loss signal.</p>
        <code>otelcol_exporter_queue_size</code>
      </div>
      <div class="signalCard">
        <span class="signalIcon">${icon('memory')}</span>
        <h3>Memory and heap</h3>
        <p>RSS and heap growth often predict OOMKilled restarts before Kubernetes tells you it happened.</p>
        <code>otelcol_process_memory_rss</code>
      </div>
      <div class="signalCard">
        <span class="signalIcon">${icon('k8s')}</span>
        <h3>Runtime context</h3>
        <p>Pod restarts, OOMKilled, rollouts, resource limits, network policy, and backend DNS make the metrics actionable.</p>
        <code>kubectl describe pod</code>
      </div>
    </div>
    <div class="noteBox">
      <strong>Version note:</strong> Collector metric names can vary by version and Prometheus export settings. Always verify the exact names in your own <code>/metrics</code> output before writing alerts.
    </div>
  </section>

  <section class="sectionBlock" id="decoder">
    <h2 class="sectionTitle hasIcon"><span class="headingIcon">${icon('terminal')}</span>Symptom decoder: what the Collector is trying to tell you</h2>
    <p class="bodyText">Engineers usually land on this problem through a symptom, not a metric name. Use this decoder when traces disappear, exporter errors spike, queues fill, or Collector pods keep restarting.</p>
    <div class="symptomTabs" role="tablist" aria-label="Collector symptom decoder">
      ${symptomButtonsHtml()}
    </div>
    <div class="symptomPanels">
      ${symptomPanelsHtml()}
    </div>
  </section>

  <section class="sectionBlock" id="starter-config">
    <h2 class="sectionTitle hasIcon"><span class="headingIcon">${icon('code')}</span>Copy-paste starter config for Collector self-monitoring</h2>
    <p class="bodyText">Use this as a starter pattern, then adapt it to your Collector distribution, version, security policy, and backend. The important part is exposing health and internal metrics, then enabling the extensions in the service section.</p>
    <div class="codePanel">
      <div class="codePanelHeader">
        <span>${icon('code')} otel-collector-self-monitoring.yaml</span>
        <button type="button" data-copy-config>Copy</button>
      </div>
      <pre id="starterConfig"><code>receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318

processors:
  memory_limiter:
    check_interval: 5s
    limit_percentage: 80
    spike_limit_percentage: 20
  batch:
    timeout: 5s
    send_batch_size: 8192

exporters:
  otlp/primary:
    endpoint: observability-backend.example.com:4317
    sending_queue:
      enabled: true
      queue_size: 10000
    retry_on_failure:
      enabled: true
      initial_interval: 5s
      max_interval: 30s
      max_elapsed_time: 300s

extensions:
  health_check:
    endpoint: 0.0.0.0:13133
  pprof:
    endpoint: 0.0.0.0:1777
  zpages:
    endpoint: 0.0.0.0:55679

service:
  extensions: [health_check, pprof, zpages]
  telemetry:
    metrics:
      readers:
        - pull:
            exporter:
              prometheus:
                host: 0.0.0.0
                port: 8888
                without_type_suffix: true
                without_units: true
  pipelines:
    traces:
      receivers: [otlp]
      processors: [memory_limiter, batch]
      exporters: [otlp/primary]
    metrics:
      receivers: [otlp]
      processors: [memory_limiter, batch]
      exporters: [otlp/primary]
    logs:
      receivers: [otlp]
      processors: [memory_limiter, batch]
      exporters: [otlp/primary]</code></pre>
    </div>
    <div class="calloutGrid">
      <div class="calloutCard"><strong>Expose carefully</strong><span>Keep pprof and zPages restricted. They are diagnostic endpoints, not public endpoints.</span></div>
      <div class="calloutCard"><strong>Scrape internal metrics</strong><span>Port 8888 is where the Collector commonly exposes its own Prometheus metrics.</span></div>
      <div class="calloutCard"><strong>Use memory_limiter</strong><span>It is one of the guardrails that prevents telemetry bursts from taking the Collector down.</span></div>
    </div>
  </section>

  <section class="sectionBlock" id="alerts">
    <h2 class="sectionTitle hasIcon"><span class="headingIcon">${icon('alert')}</span>Alert rules that are worth waking someone for</h2>
    <p class="bodyText">Do not wake people for every small movement. Wake them when the telemetry pipeline is losing data, close to losing data, or making the rest of observability untrustworthy.</p>
    <div class="decisionTableWrap" role="region" aria-label="OpenTelemetry Collector alert table">
      <table class="decisionTable">
        <thead>
          <tr>
            <th>Signal</th>
            <th>Why it matters</th>
            <th>First check</th>
            <th>Safe action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Exporter send failures increasing</strong></td>
            <td>Data is received but not delivered.</td>
            <td>Backend endpoint, auth, TLS, DNS, network policy.</td>
            <td>Repair exporter path, fail over, or pause risky rollout.</td>
          </tr>
          <tr>
            <td><strong>Queue utilization above 80%</strong></td>
            <td>The backend is slow or the Collector is overloaded.</td>
            <td>Queue capacity, backend latency, CPU, memory.</td>
            <td>Scale gateway, tune batch, reduce burst, or route critical telemetry.</td>
          </tr>
          <tr>
            <td><strong>Failed enqueue above zero</strong></td>
            <td>The Collector is dropping telemetry.</td>
            <td>Queue full, retry pressure, backend throttling.</td>
            <td>Escalate immediately and preserve evidence.</td>
          </tr>
          <tr>
            <td><strong>Receiver refused items increasing</strong></td>
            <td>Clients may be rejected or misconfigured.</td>
            <td>Protocol, endpoint, payload format, downstream pressure.</td>
            <td>Fix client export config or relieve pipeline pressure.</td>
          </tr>
          <tr>
            <td><strong>Memory RSS near limit</strong></td>
            <td>OOM restarts can silently create telemetry gaps.</td>
            <td>memory_limiter, queue size, batch size, cardinality.</td>
            <td>Scale, tune memory limiter, reduce high-cardinality data.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <section class="sectionBlock" id="kubernetes">
    <h2 class="sectionTitle hasIcon"><span class="headingIcon">${icon('k8s')}</span>Kubernetes checklist for OpenTelemetry Collector monitoring</h2>
    <p class="bodyText">In Kubernetes, Collector failures often look like generic platform problems until you connect the dots. Add these checks so the responder can move from symptom to fix quickly.</p>
    <div class="checklistGrid">
      <div class="checkItem"><span>${icon('check')}</span><strong>DaemonSet or gateway?</strong><p>Know whether the Collector runs on every node, centrally as a Deployment, or both.</p></div>
      <div class="checkItem"><span>${icon('check')}</span><strong>Requests and limits</strong><p>Right-size CPU and memory. Avoid tiny limits that create OOMKilled loops during traffic bursts.</p></div>
      <div class="checkItem"><span>${icon('check')}</span><strong>Probes</strong><p>Use health_check for liveness/readiness, but pair it with pipeline metrics.</p></div>
      <div class="checkItem"><span>${icon('check')}</span><strong>Rollout history</strong><p>Correlate failures with config maps, Collector image changes, operator changes, or backend migration.</p></div>
      <div class="checkItem"><span>${icon('check')}</span><strong>Network and secrets</strong><p>Check egress policy, service DNS, exporter auth headers, TLS certs, and secret rotation.</p></div>
      <div class="checkItem"><span>${icon('check')}</span><strong>Scrape target</strong><p>Make sure Prometheus or your scraper can reach the internal metrics endpoint.</p></div>
    </div>
  </section>

  <section class="sectionBlock" id="mistakes">
    <h2 class="sectionTitle hasIcon"><span class="headingIcon">${icon('alert')}</span>Common mistakes that make Collector incidents worse</h2>
    <div class="mistakeGrid">
      <div class="mistakeCard"><span>${icon('check')}</span><h3>Only checking pod health</h3><p>A healthy pod can still drop spans, fail exports, or build a queue that is about to overflow.</p></div>
      <div class="mistakeCard"><span>${icon('route')}</span><h3>Configuring a receiver but not enabling the pipeline</h3><p>In Collector config, a component is not active until the service pipeline uses it.</p></div>
      <div class="mistakeCard"><span>${icon('queue')}</span><h3>No queue alerts</h3><p>Queue pressure is the early warning. Failed enqueue means you are already losing data.</p></div>
      <div class="mistakeCard"><span>${icon('memory')}</span><h3>No memory limiter</h3><p>Telemetry bursts can turn into OOMKilled loops if the Collector is allowed to grow until Kubernetes kills it.</p></div>
      <div class="mistakeCard"><span>${icon('database')}</span><h3>Ignoring the backend</h3><p>Exporter failures are often caused by the destination, not by the Collector process itself.</p></div>
      <div class="mistakeCard"><span>${icon('phone')}</span><h3>No owner or runbook</h3><p>Alerting on Collector failures without an owner, runbook, and rollback path still leaves teams guessing.</p></div>
    </div>
  </section>

  <section class="sectionBlock" id="automation">
    <h2 class="sectionTitle hasIcon"><span class="headingIcon">${icon('shield')}</span>How you can automate the boring recovery path</h2>
    <p class="bodyText">Once the checks are reliable, many Collector incidents should not stay manual. The key is to automate only actions that are safe, observable, and reversible.</p>
    <div class="automationFlow">
      <div class="automationStep"><span class="flowIcon">${icon('graph')}</span><strong>Detect</strong><span>Queue, refused items, exporter failures, restarts, memory, backend errors.</span></div>
      <div class="automationArrow">→</div>
      <div class="automationStep"><span class="flowIcon">${icon('link')}</span><strong>Correlate</strong><span>Config change, rollout, network policy, credentials, backend throttling, node pressure.</span></div>
      <div class="automationArrow">→</div>
      <div class="automationStep"><span class="flowIcon">${icon('route')}</span><strong>Decide</strong><span>Restart, scale, rollback, fail over, or ask for approval.</span></div>
      <div class="automationArrow">→</div>
      <div class="automationStep"><span class="flowIcon">${icon('check')}</span><strong>Verify</strong><span>Queue drains, exports recover, refused items stop, backend data resumes.</span></div>
    </div>
    <div class="automationCta">
      <div>
        <span class="eyebrow">Best lightweight tool to achieve this</span>
        <h3>AlertMend can sit beside your existing observability stack.</h3>
        <p>AlertMend watches Collector pods, VMs, internal metrics, logs, queue pressure, exporter errors, backend reachability, and Kubernetes context. It can route incidents to Slack, WhatsApp, phone calls, or on-call policies, then trigger approved runbooks such as restart, scale, rollback, config validation, and health verification.</p>
        <p>For enterprise teams, AlertMend supports managed and self-hosted deployment options, with approval gates and audit trails for production automation.</p>
      </div>
      <a class="ctaButton ctaButtonPrimary" href="${calendly}&intent=otel-collector-automation" target="_blank" rel="noopener noreferrer">Book a Collector automation review</a>
    </div>
  </section>

  <section class="sectionBlock" id="sources">
    <h2 class="sectionTitle hasIcon"><span class="headingIcon">${icon('book')}</span>Primary sources checked</h2>
    <p class="bodyText">This guide is based on OpenTelemetry Collector documentation and tuned for practical production operations.</p>
    <ol class="sourceList">
      <li><a href="https://opentelemetry.io/docs/collector/" target="_blank" rel="noopener noreferrer">OpenTelemetry Collector overview</a></li>
      <li><a href="https://opentelemetry.io/docs/collector/internal-telemetry/" target="_blank" rel="noopener noreferrer">OpenTelemetry Collector internal telemetry</a></li>
      <li><a href="https://opentelemetry.io/docs/collector/configuration/" target="_blank" rel="noopener noreferrer">OpenTelemetry Collector configuration</a></li>
      <li><a href="https://opentelemetry.io/docs/collector/troubleshooting/" target="_blank" rel="noopener noreferrer">OpenTelemetry Collector troubleshooting</a></li>
      <li><a href="https://opentelemetry.io/docs/platforms/kubernetes/operator/" target="_blank" rel="noopener noreferrer">OpenTelemetry Operator for Kubernetes</a></li>
    </ol>
  </section>

  <section class="sectionBlock" id="faq">
    <h2 class="sectionTitle hasIcon"><span class="headingIcon">${icon('book')}</span>FAQ</h2>
    <p class="bodyText">These answers target the questions teams usually search when the OpenTelemetry Collector is running, but traces, metrics, logs, or exports are not behaving.</p>
    <div class="faqList">
      ${faqHtml()}
    </div>
  </section>
</article>
`

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)} | AlertMend AI</title>
  <meta name="description" content="${esc(description)}">
  <meta name="keywords" content="${esc(keywords)}">
  <meta name="author" content="${esc(author.name)}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${canonical}">
  <link rel="icon" type="image/svg+xml" href="/logos/alertmend-logo.svg">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${esc(h1)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${heroImage}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(h1)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${heroImage}">
  <script type="application/ld+json">${JSON.stringify(blogPosting)}</script>
  <script type="application/ld+json">${JSON.stringify(howToJsonLd)}</script>
  <script type="application/ld+json">${JSON.stringify(faqJsonLd)}</script>
  <style>${CHROME_INLINE_CSS}${AUTHOR_CRED_CSS}</style>
  <link rel="stylesheet" href="/assets/${slug}/styles.css">
</head>
<body>
${buildNavHtml(slug, calendly)}
  <main class="main-container">
    <div class="content-wrapper">
      <div class="main-col">
        ${content}
        ${authorCard()}
        <div class="ctaBox">
          <h2>Want AlertMend to watch your telemetry pipeline?</h2>
          <p>Bring one OpenTelemetry Collector alert, queue metric, or exporter failure. We will map the signal, owner, runbook, and safe recovery path.</p>
          <div class="ctaButtons">
            <a class="ctaButton ctaButtonPrimary" href="${calendly}" target="_blank" rel="noopener noreferrer">Book an automation review</a>
            <a class="ctaButton ctaButtonSecondary" href="https://app.alertmend.io/signup?service=remediation&source=blog-post&blog_slug=${slug}">Try AlertMend</a>
          </div>
        </div>
      </div>
      ${buildSidebarHtml(related, title)}
    </div>
  </main>
  <script src="/assets/${slug}/script.js"></script>
  <script>
  (function(){
${BLOG_SIGNUP_HANDLER_JS}
  })();
  </script>
</body>
</html>`

writeStaticBlogOutputs(slug, html)
console.log(`✓ Article source root: ${root}`)
