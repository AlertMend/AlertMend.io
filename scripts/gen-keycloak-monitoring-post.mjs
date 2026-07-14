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

const slug = 'keycloak-monitoring'
const title = 'Keycloak Monitoring Guide for Self-Hosted SSO'
const h1 = 'Keycloak Monitoring: A Production Guide for Self-Hosted SSO'
const description = 'A practical Keycloak monitoring guide for self-hosted SSO: health checks, metrics, login probes, Prometheus alerts, Kubernetes probes, and safe recovery.'
const publishedDate = '2026-07-14'
const modifiedDate = '2026-07-14'
const category = 'Observability'
const seoKeywords = [
  'Keycloak monitoring',
  'self hosted Keycloak monitoring',
  'Keycloak health check',
  'Keycloak health endpoint',
  'Keycloak metrics',
  'Keycloak Prometheus metrics',
  'Keycloak login failures',
  'Keycloak OIDC monitoring',
  'Keycloak Kubernetes monitoring',
  'Keycloak database connection pool',
  'Keycloak cache monitoring',
  'Keycloak cluster monitoring',
  'Keycloak 503',
  'Keycloak login latency',
  'Keycloak auto recovery',
  'AlertMend Keycloak monitoring',
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
    q: 'How do I monitor Keycloak?',
    a: 'Monitor Keycloak at four layers: health endpoints, Prometheus metrics, real login or OIDC journey checks, and runtime context from Kubernetes, VMs, database, cache, and network. Health alone is not enough because Keycloak can be running while login, token exchange, or database access is degraded.',
  },
  {
    q: 'Which Keycloak health endpoints should I check?',
    a: 'Keycloak exposes /health/started, /health/live, /health/ready, and /health when health checks are enabled. The endpoints return HTTP 200 on success and 503 on failure. Use readiness to decide if an instance should receive traffic, and liveness to decide if the process should be replaced.',
  },
  {
    q: 'What port exposes Keycloak health and metrics?',
    a: 'Keycloak exposes management endpoints such as /health and /metrics on the management interface when enabled. The default management port is 9000. Keep this interface private and scrape it from your monitoring network, not from the public internet.',
  },
  {
    q: 'What are the most important Keycloak Prometheus metrics?',
    a: 'Start with HTTP request duration, request count, active requests, login and user event counters, database pool metrics such as agroal_active_count and agroal_awaiting_count, JVM memory and GC metrics, cache hit ratio, cache evictions, and cluster metrics when running multiple nodes.',
  },
  {
    q: 'Why is Keycloak up but users cannot log in?',
    a: 'Common causes include database connection pool exhaustion, bad realm or client config, identity provider outage, token endpoint errors, TLS or certificate failures, cluster split, cache issues, high GC, CPU saturation, or a bad rollout that readiness checks did not catch.',
  },
  {
    q: 'How do I monitor Keycloak login failures?',
    a: 'Enable metrics and user event metrics, then track login, login failure, token refresh, and client activity at a safe cardinality. Keep tags conservative. Keycloak warns that adding client and identity provider dimensions can increase memory use and monitoring load on large installs.',
  },
  {
    q: 'How should I monitor Keycloak on Kubernetes?',
    a: 'Use HTTP probes against the management health endpoints, scrape the management metrics endpoint, watch pod restarts and OOMKilled events, monitor database reachability, check config map and secret rollouts, and test a synthetic login journey through the ingress path users actually take.',
  },
  {
    q: 'Is /health/ready enough for Keycloak monitoring?',
    a: 'No. /health/ready tells you whether an instance is ready to serve requests, but it does not prove that users can complete a login, receive a token, refresh a token, reach an external identity provider, or that cache and cluster behavior are healthy under load.',
  },
  {
    q: 'Can AlertMend monitor and auto-recover Keycloak?',
    a: 'Yes. AlertMend can sit beside Keycloak, Prometheus, Grafana, Kubernetes, VM monitors, and log tools. It can correlate login failures, health endpoint failures, pod restarts, database pool pressure, cache symptoms, cluster issues, and recent rollouts, then route the incident or run approved recovery actions.',
  },
  {
    q: 'What safe auto-fixes make sense for Keycloak?',
    a: 'Safe fixes include restarting one unhealthy pod, scaling a gateway or Keycloak deployment when the database can handle it, rolling back a bad config or image, refreshing an expired certificate or secret workflow with approval, and failing traffic away from an unhealthy instance. Dangerous actions need approval and verification.',
  },
]

const howToSteps = [
  { name: 'Enable health and metrics', text: 'Enable Keycloak health checks and metrics, then expose them only on the private management interface.' },
  { name: 'Monitor the login journey', text: 'Add a synthetic OIDC check that verifies discovery, authorize, token, JWKS, and refresh behavior through the same path users take.' },
  { name: 'Alert on real failure signals', text: 'Watch login failures, token errors, HTTP latency, active requests, database pool waits, JVM memory, cache hit ratio, cluster size, and restarts.' },
  { name: 'Automate safe recovery', text: 'Use approved runbooks for restart, scale, rollback, failover, secret validation, and post-fix verification.' },
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
  name: 'How to monitor self-hosted Keycloak',
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
    id: 'login-down',
    label: 'Login down',
    output: 'app status: healthy\nlogin page: 504 or endless redirect\ntoken endpoint: elevated 5xx',
    meaning: 'The application can be healthy while SSO is the actual outage. Treat login as a production dependency, not a side system.',
    checks: ['Run a synthetic OIDC flow through the public ingress path.', 'Check Keycloak HTTP 5xx, token endpoint errors, and recent realm or client changes.', 'Verify external identity provider and database reachability.'],
    fix: 'Route the incident to the identity owner, preserve recent config changes, and roll back the last client, realm, ingress, or image change if the timing matches.',
  },
  {
    id: 'ready-503',
    label: 'Ready 503',
    output: 'GET /health/ready -> 503\nchecks show database or cluster DOWN\npod still running',
    meaning: 'The process exists, but this instance should not receive user traffic. Readiness failure usually points to startup, database, cluster, or shutdown state.',
    checks: ['Read the JSON health checks, not just the HTTP status.', 'Check database connection pool and cluster health.', 'Inspect rollout history and pod events.'],
    fix: 'Remove the instance from traffic, verify other replicas are healthy, then restart or roll back only after capturing logs and config diff.',
  },
  {
    id: 'db-pool',
    label: 'DB pool',
    output: 'agroal_awaiting_count rising\nlogin latency rising\nactive DB connections near max',
    meaning: 'Keycloak threads are waiting for database connections. Raising the pool blindly can move the bottleneck into the database.',
    checks: ['Check database CPU, locks, slow queries, and connection limits.', 'Compare active, available, and awaiting pool metrics.', 'Check cache hit ratio because poor cache behavior can amplify database reads.'],
    fix: 'Reduce pressure, tune HTTP threads or pool size carefully, increase cache size where justified, and verify with a load test before making it permanent.',
  },
  {
    id: 'cache-cluster',
    label: 'Cache or cluster',
    output: 'sessions disappear after login\ncluster size differs by node\ncache evictions spike',
    meaning: 'Distributed session or cache behavior is degraded. Users may see random logout, invalid sessions, or inconsistent identity state.',
    checks: ['Compare cluster size across nodes.', 'Check cache hit ratio, cache evictions, flow-control blocks, retransmissions, and network policy.', 'Review recent node, cache, or JGroups changes.'],
    fix: 'Fail traffic away from the unhealthy node, fix networking or cache config, and roll restart carefully so active sessions are protected as much as possible.',
  },
  {
    id: 'jvm',
    label: 'JVM pressure',
    output: 'jvm_memory_used_bytes rising\nGC overhead increasing\npod restarts OOMKilled',
    meaning: 'Keycloak is under memory pressure. Large realms, high login volume, cache sizing, metrics cardinality, or bad heap settings can all contribute.',
    checks: ['Check JVM heap, GC pauses, container memory, and event metric cardinality.', 'Look for spikes in active requests and login attempts.', 'Compare memory growth with recent rollout or config changes.'],
    fix: 'Scale cautiously, tune heap and limits, reduce high-cardinality metrics, and roll back the change that introduced the pressure.',
  },
]

function icon(name) {
  const icons = {
    alert: '<svg class="iconSvg" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    book: '<svg class="iconSvg" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    calendar: '<svg class="iconSvg" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    check: '<svg class="iconSvg" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 6 9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    clock: '<svg class="iconSvg" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/><path d="M12 7v5l3 2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    code: '<svg class="iconSvg" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m16 18 6-6-6-6M8 6l-6 6 6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    database: '<svg class="iconSvg" viewBox="0 0 24 24" fill="none" aria-hidden="true"><ellipse cx="12" cy="5" rx="8" ry="3" stroke="currentColor" stroke-width="1.8"/><path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    flow: '<svg class="iconSvg" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="5" cy="12" r="3" stroke="currentColor" stroke-width="1.8"/><circle cx="19" cy="6" r="3" stroke="currentColor" stroke-width="1.8"/><circle cx="19" cy="18" r="3" stroke="currentColor" stroke-width="1.8"/><path d="M8 12h4a4 4 0 0 0 4-4M8 12h4a4 4 0 0 1 4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    graph: '<svg class="iconSvg" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 19V5m0 14h16M8 16l3-4 3 2 5-7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    k8s: '<svg class="iconSvg" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m12 2 8 4.5v9L12 22l-8-6.5v-9L12 2Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M12 7v10M7.7 9.5l8.6 5M16.3 9.5l-8.6 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    key: '<svg class="iconSvg" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="7.5" cy="14.5" r="4.5" stroke="currentColor" stroke-width="1.8"/><path d="M11 11 21 1m-3 3 3 3m-6 0 3 3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    memory: '<svg class="iconSvg" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="5" y="6" width="14" height="12" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M8 10h8M8 14h5M7 3v3M12 3v3M17 3v3M7 18v3M12 18v3M17 18v3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    phone: '<svg class="iconSvg" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.77.63 2.61a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6.27 6.27l1.29-1.29a2 2 0 0 1 2.11-.45c.84.3 1.71.51 2.61.63A2 2 0 0 1 22 16.92Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
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
        <p>Dinesh is a software engineer and entrepreneur focused on AI-agent automation for cloud infrastructure, self-hosted systems, observability, and incident response.</p>
        <p>Previously at Polymer Search and Roambee, and Co-Founder of FutureApp e-schools, he works on converting noisy production signals into safe, auditable automation: diagnosis, escalation, runbooks, and self-healing recovery.</p>
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
        <span class="eyebrow">What it means</span>
        <h3>${esc(item.meaning)}</h3>
        <ul>${item.checks.map((check) => `<li>${esc(check)}</li>`).join('')}</ul>
        <p><strong>Safe fix:</strong> ${esc(item.fix)}</p>
      </div>
    </div>
  `).join('')
}

const content = `
<header class="article-header article-header--cred">
  <h1>${esc(h1)}</h1>
  <div class="writerByline" aria-label="Article author">
    <img src="/logos/dinesh.jpeg" alt="${esc(author.name)}" width="44" height="44" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
    <div class="writerFallback" aria-hidden="true">DA</div>
    <div>
      <a href="${author.linkedin}" target="_blank" rel="noopener noreferrer">${esc(author.name)}</a>
      <p class="writerExpertLine">AI-agent automation expert focused on cloud infrastructure, self-hosted systems, observability, and safe incident recovery.</p>
      <p class="bylineMeta">${icon('calendar')}<span>${esc(publishedDate)}</span><span class="metaDot">•</span>${icon('tag')}<span>${esc(category)}</span></p>
    </div>
  </div>
</header>

<div class="proofStrip" aria-label="Article verification">
  <strong><span class="proofIcon">${icon('check')}</span> Verified against Keycloak observability docs</strong>
  <span class="dot">•</span>
  <span>Last reviewed ${modifiedDate}</span>
  <span class="dot">•</span>
  <span>7 primary sources cited</span>
</div>

<article class="keycloakArticle article-content">
  <section class="heroPanel" id="answer">
    <div class="heroGrid">
      <div class="answerCard">
        <span class="eyebrow">Production scenario</span>
        <h2>The app is healthy, but login is down.</h2>
        <p>That is the Keycloak monitoring problem. App dashboards may stay green while sign-in, token refresh, admin access, and API authentication are broken.</p>
        <p>The fix is to monitor Keycloak like a production dependency: health, metrics, real OIDC flows, database pool pressure, cache behavior, cluster state, logs, and runtime events.</p>
        <div class="answerChecklist">
          <span>${icon('check')} /health/ready and /health/live</span>
          <span>${icon('graph')} /metrics on management port</span>
          <span>${icon('key')} login and token journey</span>
          <span>${icon('database')} database pool waits</span>
          <span>${icon('shield')} safe recovery runbooks</span>
        </div>
        <div class="quickCta">
          <a class="ctaButton ctaButtonPrimary" href="${calendly}&intent=keycloak-monitoring-review" target="_blank" rel="noopener noreferrer">Review my Keycloak monitoring</a>
          <a class="ctaButton ctaButtonSecondary" href="#signals">See signals</a>
        </div>
      </div>
      <div class="incidentMap" aria-label="Keycloak login outage map">
        <div class="incidentMapHeader">
          <span>${icon('key')} Login outage map</span>
          <strong>App uptime is not login uptime</strong>
        </div>
        <div class="incidentRows">
          <div class="incidentRow incidentRowOk">
            <div class="incidentStep">1</div>
            <div class="incidentCopy"><strong>App check passes</strong><span>Homepage and API return 200, so the app dashboard stays green.</span></div>
            <div class="incidentSignal">App healthy</div>
          </div>
          <div class="incidentRow">
            <div class="incidentStep">2</div>
            <div class="incidentCopy"><strong>User starts login</strong><span>The browser redirects to Keycloak for authorize, token, session, or refresh flow.</span></div>
            <div class="incidentSignal">OIDC journey</div>
          </div>
          <div class="incidentRow incidentRowWarn">
            <div class="incidentStep">3</div>
            <div class="incidentCopy"><strong>Keycloak dependency fails</strong><span>Readiness returns 503, DB wait rises, cache/cluster breaks, or token endpoint throws 5xx.</span></div>
            <div class="incidentSignal">Ready 503 · DB wait high</div>
          </div>
          <div class="incidentRow incidentRowImpact">
            <div class="incidentStep">4</div>
            <div class="incidentCopy"><strong>User cannot sign in</strong><span>The product looks available, but new sessions and token refreshes are blocked.</span></div>
            <div class="incidentSignal">Login failures rising</div>
          </div>
        </div>
        <p class="incidentTakeaway"><strong>Monitor the journey:</strong> synthetic login + Keycloak health + metrics + database, cache, cluster, and runtime context.</p>
      </div>
    </div>
  </section>

  <nav class="tocPills" aria-label="On this page">
    <a href="#use-case">Use case</a>
    <a href="#signals">Signals</a>
    <a href="#decoder">Decoder</a>
    <a href="#config">Config</a>
    <a href="#alerts">Alerts</a>
    <a href="#kubernetes">Kubernetes</a>
    <a href="#mistakes">Mistakes</a>
    <a href="#automation">Automation</a>
    <a href="#sources">Sources</a>
    <a href="#faq">FAQ</a>
  </nav>

  <section class="sectionBlock" id="use-case">
    <span class="eyebrow">Production scenario</span>
    <h2 class="sectionTitle hasIcon"><span class="headingIcon">${icon('key')}</span>The self-hosted SSO outage most teams miss</h2>
    <p class="bodyText">A common Keycloak incident starts with a confusing symptom: the product API is healthy, the database for the app is healthy, and the home page loads. But new users cannot log in, existing sessions cannot refresh tokens, and internal admins cannot reach the admin console.</p>
    <div class="storyPanel">
      <div><strong>09:42</strong><span>Traffic rises after a campaign.</span></div>
      <div><strong>09:48</strong><span>Keycloak database pool starts queuing requests.</span></div>
      <div><strong>09:51</strong><span>Login latency increases, token endpoint shows 5xx.</span></div>
      <div><strong>09:54</strong><span>Readiness fails on one pod, cluster traffic still hits weak nodes.</span></div>
      <div><strong>09:58</strong><span>Support tickets say “I cannot log in.” App dashboards still look okay.</span></div>
    </div>
    <div class="noteBox">
      <strong>Key point:</strong> if Keycloak is your identity layer, login is part of uptime. Monitor the full authentication journey, not only the app behind it.
    </div>
  </section>

  <section class="sectionBlock" id="signals">
    <h2 class="sectionTitle hasIcon"><span class="headingIcon">${icon('graph')}</span>What to monitor in Keycloak</h2>
    <p class="bodyText">Keycloak has solid observability primitives, but many self-hosted deployments do not turn them into actionable alerts. Start with these layers.</p>
    <div class="signalGrid">
      <div class="signalCard">
        <span class="signalIcon">${icon('check')}</span>
        <h3>Health endpoints</h3>
        <p>Use /health/started, /health/live, /health/ready, and /health to separate startup, liveness, readiness, and aggregate status.</p>
        <code>GET :9000/health/ready</code>
      </div>
      <div class="signalCard">
        <span class="signalIcon">${icon('graph')}</span>
        <h3>HTTP metrics</h3>
        <p>Track request count, latency, status, active requests, and bandwidth. Spiking latency is often the first sign of Keycloak overload.</p>
        <code>http_server_requests_seconds_count</code>
      </div>
      <div class="signalCard">
        <span class="signalIcon">${icon('key')}</span>
        <h3>User event metrics</h3>
        <p>Monitor logins, login failures, token refreshes, and client activity. Keep labels conservative to avoid high cardinality.</p>
        <code>--event-metrics-user-enabled=true</code>
      </div>
      <div class="signalCard">
        <span class="signalIcon">${icon('database')}</span>
        <h3>Database pool</h3>
        <p>Watch active, available, and awaiting connections. Pool waits often explain login latency and token endpoint failures.</p>
        <code>agroal_awaiting_count</code>
      </div>
      <div class="signalCard">
        <span class="signalIcon">${icon('memory')}</span>
        <h3>JVM pressure</h3>
        <p>Track heap, committed memory, GC pauses, GC overhead, container CPU, and OOMKilled restarts.</p>
        <code>jvm_gc_overhead</code>
      </div>
      <div class="signalCard">
        <span class="signalIcon">${icon('flow')}</span>
        <h3>Cache and cluster</h3>
        <p>Monitor cache hit ratio, evictions, cluster size, flow-control blocking, retransmissions, and network partition events.</p>
        <code>vendor_cluster_size</code>
      </div>
    </div>
  </section>

  <section class="sectionBlock" id="decoder">
    <h2 class="sectionTitle hasIcon"><span class="headingIcon">${icon('terminal')}</span>Symptom decoder: from login pain to root cause</h2>
    <p class="bodyText">A good Keycloak alert should say more than “pod unhealthy.” It should point responders toward the likely owner and first safe fix.</p>
    <div class="symptomTabs" role="tablist" aria-label="Keycloak symptom decoder">
      ${symptomButtonsHtml()}
    </div>
    <div class="symptomPanels">
      ${symptomPanelsHtml()}
    </div>
  </section>

  <section class="sectionBlock" id="config">
    <h2 class="sectionTitle hasIcon"><span class="headingIcon">${icon('code')}</span>Starter configuration for self-hosted Keycloak observability</h2>
    <p class="bodyText">Exact flags depend on your Keycloak version and packaging, but the production pattern is stable: enable health, enable metrics, keep management endpoints private, and collect user event metrics carefully.</p>
    <div class="codePanel">
      <div class="codePanelHeader">
        <span>${icon('code')} keycloak-observability-start.txt</span>
        <button type="button" data-copy-config>Copy</button>
      </div>
      <pre id="starterConfig"><code># Build with health and metrics enabled
bin/kc.sh build \
  --health-enabled=true \
  --metrics-enabled=true

# Start with management endpoints on the private management interface
bin/kc.sh start \
  --http-management-port=9000 \
  --http-management-health-enabled=true

# Optional: enable user event metrics for login visibility
# Keep tags limited on large installations.
bin/kc.sh start \
  --metrics-enabled=true \
  --event-metrics-user-enabled=true \
  --event-metrics-user-events=login,logout,refresh_token</code></pre>
    </div>
    <div class="calloutGrid">
      <div class="calloutCard"><strong>Keep port 9000 private</strong><span>Health and metrics belong on the management network, not on the public login path.</span></div>
      <div class="calloutCard"><strong>Use a real login check</strong><span>Probe discovery, authorize, token, refresh, JWKS, and redirect behavior through the real ingress path.</span></div>
      <div class="calloutCard"><strong>Watch cardinality</strong><span>Realm tags are useful. Client and IDP tags can be expensive on large installs.</span></div>
    </div>
  </section>

  <section class="sectionBlock" id="alerts">
    <h2 class="sectionTitle hasIcon"><span class="headingIcon">${icon('alert')}</span>Alert rules that matter for Keycloak</h2>
    <p class="bodyText">The best alerts are tied to user impact: login is slow, token exchange fails, readiness drops, the database pool queues, cache behavior changes, or the cluster loses shape.</p>
    <div class="decisionTableWrap" role="region" aria-label="Keycloak monitoring alert table">
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
            <td><strong>OIDC login journey fails</strong></td>
            <td>Users cannot sign in even if the app is healthy.</td>
            <td>Discovery, authorize, token, redirect, JWKS, IDP.</td>
            <td>Escalate to identity owner and check recent config changes.</td>
          </tr>
          <tr>
            <td><strong>/health/ready returns 503</strong></td>
            <td>The instance should not receive traffic.</td>
            <td>Health JSON, database check, cluster check, rollout.</td>
            <td>Drain traffic, restart isolated pod, or roll back if tied to deploy.</td>
          </tr>
          <tr>
            <td><strong>agroal_awaiting_count rises</strong></td>
            <td>Requests are waiting for database connections.</td>
            <td>DB CPU, locks, pool size, slow queries, cache hit ratio.</td>
            <td>Reduce pressure, tune pool carefully, or scale with DB capacity in mind.</td>
          </tr>
          <tr>
            <td><strong>Login failures spike</strong></td>
            <td>Users, clients, or identity providers may be failing authentication.</td>
            <td>Event metrics, realm/client changes, IDP status, TLS.</td>
            <td>Roll back config or route to the team owning the realm/client.</td>
          </tr>
          <tr>
            <td><strong>Cluster size differs by node</strong></td>
            <td>Session and cache behavior can become inconsistent.</td>
            <td>Network policy, JGroups, node events, cache transport.</td>
            <td>Fail traffic away from weak nodes and repair cluster networking.</td>
          </tr>
          <tr>
            <td><strong>JVM GC overhead or memory rises</strong></td>
            <td>Login latency and restarts usually follow.</td>
            <td>Heap, container memory, event tag cardinality, traffic spike.</td>
            <td>Scale, tune heap and limits, reduce metrics cardinality, verify after fix.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <section class="sectionBlock" id="kubernetes">
    <h2 class="sectionTitle hasIcon"><span class="headingIcon">${icon('k8s')}</span>Kubernetes checklist for Keycloak</h2>
    <p class="bodyText">Kubernetes can restart Keycloak, but it cannot understand whether your identity journey is healthy unless you give it the right checks and give responders the right context.</p>
    <div class="checklistGrid">
      <div class="checkItem"><span>${icon('check')}</span><strong>Probe externally</strong><p>Keycloak containers may not include curl. Use HTTP probes from Kubernetes against management health endpoints.</p></div>
      <div class="checkItem"><span>${icon('check')}</span><strong>Scrape privately</strong><p>Expose /metrics only on the management interface and scrape it from your monitoring namespace.</p></div>
      <div class="checkItem"><span>${icon('check')}</span><strong>Correlate rollouts</strong><p>Keycloak image, realm config, client secrets, ingress, TLS, and database changes often explain sudden failures.</p></div>
      <div class="checkItem"><span>${icon('check')}</span><strong>Watch OOMKilled</strong><p>Memory pressure, GC overhead, and high-cardinality event metrics can lead to restart loops.</p></div>
      <div class="checkItem"><span>${icon('check')}</span><strong>Check database capacity</strong><p>Scaling Keycloak without database headroom can make login slower, not faster.</p></div>
      <div class="checkItem"><span>${icon('check')}</span><strong>Test the public route</strong><p>Run a synthetic login through the same ingress, TLS, domain, and redirect path as users.</p></div>
    </div>
  </section>

  <section class="sectionBlock" id="mistakes">
    <h2 class="sectionTitle hasIcon"><span class="headingIcon">${icon('alert')}</span>Common mistakes in self-hosted Keycloak monitoring</h2>
    <div class="mistakeGrid">
      <div class="mistakeCard"><span>${icon('check')}</span><h3>Only checking the pod</h3><p>A running pod does not prove login, token exchange, refresh, redirect, or external IDP access works.</p></div>
      <div class="mistakeCard"><span>${icon('key')}</span><h3>No synthetic login</h3><p>Health checks are process checks. Synthetic login is the user-impact check.</p></div>
      <div class="mistakeCard"><span>${icon('database')}</span><h3>Blindly increasing DB pool size</h3><p>More connections can overload the database. Confirm the bottleneck first.</p></div>
      <div class="mistakeCard"><span>${icon('graph')}</span><h3>High-cardinality event tags</h3><p>Client and identity provider tags are useful, but on large installs they can increase memory and monitoring load.</p></div>
      <div class="mistakeCard"><span>${icon('flow')}</span><h3>Ignoring cluster signals</h3><p>Cluster size, flow control, retransmissions, and cache evictions explain many random session problems.</p></div>
      <div class="mistakeCard"><span>${icon('phone')}</span><h3>No owner for SSO alerts</h3><p>Login outages need a named identity owner, escalation path, and rollback playbook.</p></div>
    </div>
  </section>

  <section class="sectionBlock" id="automation">
    <h2 class="sectionTitle hasIcon"><span class="headingIcon">${icon('shield')}</span>The lightweight way to automate Keycloak recovery</h2>
    <p class="bodyText">You can automate Keycloak carefully. The safe pattern is detect, correlate, choose the lowest-risk runbook, verify, and escalate when a human decision is needed.</p>
    <div class="automationFlow">
      <div class="automationStep"><span class="flowIcon">${icon('key')}</span><strong>Detect</strong><span>Login failure, token errors, readiness failure, DB waits, JVM pressure, cache or cluster symptoms.</span></div>
      <div class="automationArrow">→</div>
      <div class="automationStep"><span class="flowIcon">${icon('route')}</span><strong>Correlate</strong><span>Realm change, client secret rotation, image rollout, ingress change, database pressure, node issue.</span></div>
      <div class="automationArrow">→</div>
      <div class="automationStep"><span class="flowIcon">${icon('shield')}</span><strong>Act</strong><span>Restart one pod, scale cautiously, rollback config, fail traffic away, or ask for approval.</span></div>
      <div class="automationArrow">→</div>
      <div class="automationStep"><span class="flowIcon">${icon('check')}</span><strong>Verify</strong><span>Ready returns 200, synthetic login passes, token endpoint recovers, DB waits drop.</span></div>
    </div>
    <div class="automationCta">
      <div class="automationCtaCopy">
        <span class="eyebrow">Automate the response</span>
        <h3>A lightweight control plane for self-hosted Keycloak.</h3>
        <p>AlertMend can watch Keycloak health endpoints, Prometheus metrics, logs, Kubernetes events, VM signals, database pool pressure, cache symptoms, cluster shape, and synthetic login checks.</p>
        <p>When the signal is clear, it can route the incident to Slack, WhatsApp, phone call, or on-call policy, then run an approved recovery workflow with verification and audit.</p>
        <div class="ctaButtonRow">
          <a class="ctaButton ctaButtonPrimary" href="${calendly}&intent=keycloak-automation" target="_blank" rel="noopener noreferrer">Book a Keycloak automation review</a>
        </div>
      </div>
      <div class="automationProofList" aria-label="AlertMend Keycloak automation capabilities">
        <div><span>${icon('check')}</span><strong>Managed or self-hosted</strong><small>Run AlertMend in the deployment model your team needs.</small></div>
        <div><span>${icon('shield')}</span><strong>Approval gates</strong><small>Use human approval before risky recovery actions.</small></div>
        <div><span>${icon('route')}</span><strong>Escalation built in</strong><small>Route to Slack, WhatsApp, phone calls, or on-call policy.</small></div>
        <div><span>${icon('check')}</span><strong>Verified recovery</strong><small>Confirm login, readiness, token flow, and database pressure after the fix.</small></div>
      </div>
    </div>
  </section>

  <section class="sectionBlock" id="sources">
    <h2 class="sectionTitle hasIcon"><span class="headingIcon">${icon('book')}</span>Primary sources checked</h2>
    <p class="bodyText">This guide is based on Keycloak’s observability, management interface, metrics, health, cache, and clustering documentation.</p>
    <ol class="sourceList">
      <li><a href="https://www.keycloak.org/server/management-interface" target="_blank" rel="noopener noreferrer">Keycloak management interface</a></li>
      <li><a href="https://www.keycloak.org/observability/health" target="_blank" rel="noopener noreferrer">Keycloak health checks</a></li>
      <li><a href="https://www.keycloak.org/observability/metrics-for-troubleshooting" target="_blank" rel="noopener noreferrer">Keycloak troubleshooting using metrics</a></li>
      <li><a href="https://www.keycloak.org/observability/metrics-for-troubleshooting-http" target="_blank" rel="noopener noreferrer">Keycloak HTTP metrics</a></li>
      <li><a href="https://www.keycloak.org/observability/event-metrics" target="_blank" rel="noopener noreferrer">Keycloak user event metrics</a></li>
      <li><a href="https://www.keycloak.org/observability/metrics-for-troubleshooting-database" target="_blank" rel="noopener noreferrer">Keycloak database metrics</a></li>
      <li><a href="https://www.keycloak.org/observability/metrics-for-troubleshooting-cache" target="_blank" rel="noopener noreferrer">Keycloak local cache metrics</a></li>
      <li><a href="https://www.keycloak.org/observability/metrics-for-troubleshooting-clustering-and-network" target="_blank" rel="noopener noreferrer">Keycloak clustering metrics</a></li>
    </ol>
  </section>

  <section class="sectionBlock" id="faq">
    <h2 class="sectionTitle hasIcon"><span class="headingIcon">${icon('book')}</span>FAQ</h2>
    <p class="bodyText">These answers target the questions teams usually search when self-hosted Keycloak is running, but login, token refresh, SSO, OIDC, or admin access is failing.</p>
    <div class="faqList">
      ${faqHtml()}
    </div>
  </section>
</article>
`

const articleContent = `
<header class="article-header article-header--cred">
  <h1>${esc(h1)}</h1>
  <div class="writerByline" aria-label="Article author">
    <img src="/logos/dinesh.jpeg" alt="${esc(author.name)}" width="44" height="44" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
    <div class="writerFallback" aria-hidden="true">DA</div>
    <div>
      <a href="${author.linkedin}" target="_blank" rel="noopener noreferrer">${esc(author.name)}</a>
      <p class="writerExpertLine">AI-agent automation expert focused on cloud infrastructure, self-hosted systems, observability, and safe incident recovery.</p>
      <p class="bylineMeta">${icon('calendar')}<span>${esc(publishedDate)}</span><span class="metaDot">•</span>${icon('tag')}<span>${esc(category)}</span></p>
    </div>
  </div>
</header>

<div class="proofStrip" aria-label="Article verification">
  <strong><span class="proofIcon">${icon('check')}</span> Verified against Keycloak observability docs</strong>
  <span class="dot">•</span>
  <span>Last reviewed ${modifiedDate}</span>
  <span class="dot">•</span>
  <span>8 primary sources cited</span>
</div>

<article class="keycloakArticle article-content">
  <section class="heroPanel" id="answer">
    <div class="answerCard">
      <span class="eyebrow">Production playbook</span>
      <h2>Do not ask only whether the pod is alive. Ask whether users can sign in.</h2>
      <p>The painful Keycloak outage is not always a red pod. Sometimes the application homepage returns 200, APIs are green, and the first real signal is a Slack message from sales: “customers cannot log in.”</p>
      <p>If Keycloak is your SSO layer, login is part of uptime. Monitor it as its own production dependency: health endpoints, metrics, a real OIDC journey, database pool pressure, cache behavior, cluster state, logs, and recent changes.</p>
      <div class="answerChecklist">
        <span>${icon('check')} Readiness and liveness</span>
        <span>${icon('key')} Synthetic login journey</span>
        <span>${icon('database')} Database pool waits</span>
        <span>${icon('flow')} Cache and cluster health</span>
        <span>${icon('shield')} Safe recovery runbooks</span>
      </div>
      <div class="quickCta">
        <a class="ctaButton ctaButtonPrimary" href="${calendly}&intent=keycloak-monitoring-review" target="_blank" rel="noopener noreferrer">Review my Keycloak monitoring</a>
        <a class="ctaButton ctaButtonSecondary" href="#first-checks">See the checks</a>
      </div>
    </div>
  </section>

  <nav class="tocPills" aria-label="On this page">
    <a href="#incident">Incident</a>
    <a href="#first-checks">First checks</a>
    <a href="#health">Health</a>
    <a href="#metrics">Metrics</a>
    <a href="#login-probe">Login probe</a>
    <a href="#alerts">Alerts</a>
    <a href="#kubernetes">Kubernetes</a>
    <a href="#automation">Automation</a>
    <a href="#sources">Sources</a>
    <a href="#faq">FAQ</a>
  </nav>

  <section class="sectionBlock" id="incident">
    <span class="eyebrow">Real incident shape</span>
    <h2 class="sectionTitle hasIcon"><span class="headingIcon">${icon('key')}</span>The outage that fools normal dashboards</h2>
    <p class="bodyText">A lot of teams discover this the hard way: their application monitoring says everything is fine, but nobody can create a session. The app dashboard is not lying. It is just watching the wrong dependency.</p>
    <div class="storyPanel">
      <div><strong>09:42</strong><span>Homepage and public APIs are healthy. App uptime dashboard stays green.</span></div>
      <div><strong>09:47</strong><span>Login attempts begin queuing because Keycloak is waiting on its database pool.</span></div>
      <div><strong>09:51</strong><span>Token endpoint latency rises. A few requests return 5xx.</span></div>
      <div><strong>09:54</strong><span>One Keycloak pod starts failing readiness, but traffic still reaches a weak path.</span></div>
      <div><strong>09:58</strong><span>Support tickets arrive: “I cannot log in.” The app itself still looks available.</span></div>
    </div>
    <div class="noteBox">
      <strong>Operator rule:</strong> do not treat Keycloak as a sidecar to the app. Treat it as a Tier 1 dependency with its own SLO, alerts, owner, and recovery plan.
    </div>
  </section>

  <section class="sectionBlock" id="first-checks">
    <span class="eyebrow">First 10 minutes</span>
    <h2 class="sectionTitle hasIcon"><span class="headingIcon">${icon('terminal')}</span>What to check when login starts failing</h2>
    <p class="bodyText">Start with evidence that separates four questions: is the instance ready, is the login path broken, is the database waiting, and did a rollout or config change cause it?</p>
    <div class="codePanel">
      <div class="codePanelHeader">
        <span>${icon('terminal')} keycloak-first-checks.sh</span>
      </div>
      <pre><code># 1. Check the management health endpoints.
curl -fsS http://keycloak:9000/health/ready
curl -fsS http://keycloak:9000/health | jq .

# 2. Confirm metrics are being scraped.
curl -fsS http://keycloak:9000/metrics \
  | grep -E 'http_server_requests|agroal_|jvm_|vendor_'

# 3. Check the pods and recent restarts.
kubectl get pods -n keycloak -o wide
kubectl describe pod -n keycloak &lt;pod-name&gt;
kubectl logs -n keycloak &lt;pod-name&gt; --since=20m

# 4. Look for recent changes near the first failure.
kubectl rollout history deployment/keycloak -n keycloak
kubectl get events -n keycloak --sort-by=.lastTimestamp</code></pre>
    </div>
    <div class="calloutGrid">
      <div class="calloutCard"><strong>Do not stop at HTTP 200</strong><span>A working home page does not prove authorize, token, refresh, redirect, or external identity provider flow.</span></div>
      <div class="calloutCard"><strong>Read the health JSON</strong><span>The 503 tells you there is a problem. The health body usually tells you where to look first.</span></div>
      <div class="calloutCard"><strong>Correlate with change</strong><span>Realm config, client secret, ingress, certificate, image, JVM, and database changes explain many sudden failures.</span></div>
    </div>
  </section>

  <section class="sectionBlock" id="health">
    <h2 class="sectionTitle hasIcon"><span class="headingIcon">${icon('check')}</span>Health endpoints: necessary, but not enough</h2>
    <p class="bodyText">Keycloak exposes health endpoints when health checks are enabled. Use them for instance state and traffic decisions, but do not confuse them with a real user login check.</p>
    <div class="decisionTableWrap" role="region" aria-label="Keycloak health endpoint table">
      <table class="decisionTable">
        <thead>
          <tr>
            <th>Endpoint</th>
            <th>Use it for</th>
            <th>What it does not prove</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>/health/started</strong></td>
            <td>Startup state.</td>
            <td>Login, token exchange, redirect, or user flow.</td>
          </tr>
          <tr>
            <td><strong>/health/live</strong></td>
            <td>Whether the process should be restarted.</td>
            <td>Whether the instance should receive production login traffic.</td>
          </tr>
          <tr>
            <td><strong>/health/ready</strong></td>
            <td>Whether the instance is ready for traffic.</td>
            <td>Whether a full OIDC login succeeds through your public ingress.</td>
          </tr>
          <tr>
            <td><strong>/health</strong></td>
            <td>Aggregate health view for troubleshooting.</td>
            <td>The business impact or the exact owner of the failure.</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="noteBox">
      Keycloak health endpoints return HTTP 200 for UP and 503 for DOWN. In production, scrape them on the private management interface, commonly port 9000, and avoid exposing that interface publicly.
    </div>
  </section>

  <section class="sectionBlock" id="metrics">
    <h2 class="sectionTitle hasIcon"><span class="headingIcon">${icon('graph')}</span>The Keycloak metrics that actually move incidents forward</h2>
    <p class="bodyText">Prometheus metrics should help a responder choose the next action. These are the signals I would want on the screen before touching a production Keycloak deployment.</p>
    <div class="signalGrid">
      <div class="signalCard">
        <span class="signalIcon">${icon('graph')}</span>
        <h3>HTTP requests</h3>
        <p>Count, latency, status code, active requests, and bandwidth for endpoints such as authorize, token, userinfo, and admin routes.</p>
        <code>http_server_requests_seconds_count</code>
      </div>
      <div class="signalCard">
        <span class="signalIcon">${icon('key')}</span>
        <h3>User events</h3>
        <p>Logins, login failures, token refreshes, logout, client login, and other events. Keep dimensions conservative on large installations.</p>
        <code>--event-metrics-user-enabled=true</code>
      </div>
      <div class="signalCard">
        <span class="signalIcon">${icon('database')}</span>
        <h3>Database pool</h3>
        <p>Active, available, and awaiting connections. Waiting connections often explain slow login and token endpoint errors.</p>
        <code>agroal_active_count · agroal_awaiting_count</code>
      </div>
      <div class="signalCard">
        <span class="signalIcon">${icon('memory')}</span>
        <h3>JVM and container</h3>
        <p>Heap, non-heap, GC overhead, CPU throttling, OOMKilled restarts, and request spikes.</p>
        <code>jvm_memory_used_bytes · jvm_gc_overhead</code>
      </div>
      <div class="signalCard">
        <span class="signalIcon">${icon('flow')}</span>
        <h3>Cache behavior</h3>
        <p>Hit ratio, evictions, misses, and cache pressure. Poor cache behavior can push more work into the database.</p>
        <code>vendor_cache_* metrics</code>
      </div>
      <div class="signalCard">
        <span class="signalIcon">${icon('route')}</span>
        <h3>Cluster and network</h3>
        <p>Cluster size, retransmissions, dropped messages, and flow-control blocking. These explain random session and cache behavior.</p>
        <code>vendor_cluster_size</code>
      </div>
    </div>
  </section>

  <section class="sectionBlock" id="login-probe">
    <h2 class="sectionTitle hasIcon"><span class="headingIcon">${icon('key')}</span>Add a synthetic login check, not just a health check</h2>
    <p class="bodyText">If you only monitor /health/ready, you can miss the thing users care about. A synthetic check should exercise the same route a browser or service uses in production.</p>
    <div class="checklistGrid">
      <div class="checkItem"><span>${icon('check')}</span><strong>OIDC discovery</strong><p>Fetch /.well-known/openid-configuration and verify issuer, endpoints, and JWKS URI.</p></div>
      <div class="checkItem"><span>${icon('check')}</span><strong>Authorize redirect</strong><p>Confirm the authorize endpoint returns the expected redirect behavior for a test client.</p></div>
      <div class="checkItem"><span>${icon('check')}</span><strong>Token exchange</strong><p>Validate token endpoint latency and failure rate with a safe synthetic identity.</p></div>
      <div class="checkItem"><span>${icon('check')}</span><strong>JWKS</strong><p>Verify signing keys are reachable and rotate expectations are understood.</p></div>
      <div class="checkItem"><span>${icon('check')}</span><strong>Refresh token</strong><p>Test refresh behavior if your application depends on long sessions.</p></div>
      <div class="checkItem"><span>${icon('shield')}</span><strong>Safe identity</strong><p>Use a dedicated synthetic test user or client. Do not monitor with a real customer account.</p></div>
    </div>
  </section>

  <section class="sectionBlock" id="decoder">
    <h2 class="sectionTitle hasIcon"><span class="headingIcon">${icon('terminal')}</span>Symptom decoder: what the alert is trying to tell you</h2>
    <p class="bodyText">The goal is not to create more Keycloak alerts. The goal is to make the first page actionable: likely cause, first checks, owner, and safe next move.</p>
    <div class="symptomTabs" role="tablist" aria-label="Keycloak symptom decoder">
      ${symptomButtonsHtml()}
    </div>
    <div class="symptomPanels">
      ${symptomPanelsHtml()}
    </div>
  </section>

  <section class="sectionBlock" id="config">
    <h2 class="sectionTitle hasIcon"><span class="headingIcon">${icon('code')}</span>Starter configuration</h2>
    <p class="bodyText">Use your Keycloak version’s exact flags and deployment method, but the production shape is stable: enable health, enable metrics, keep management endpoints private, and be deliberate with user event metrics.</p>
    <div class="codePanel">
      <div class="codePanelHeader">
        <span>${icon('code')} keycloak-observability-start.txt</span>
        <button type="button" data-copy-config>Copy</button>
      </div>
      <pre id="starterConfig"><code># Build with health and metrics enabled.
bin/kc.sh build \
  --health-enabled=true \
  --metrics-enabled=true

# Start with management endpoints on a private management interface.
bin/kc.sh start \
  --http-management-port=9000 \
  --http-management-health-enabled=true

# Optional: user event metrics for login visibility.
# Keep labels limited on large installations.
bin/kc.sh start \
  --metrics-enabled=true \
  --event-metrics-user-enabled=true \
  --event-metrics-user-events=login,logout,refresh_token</code></pre>
    </div>
  </section>

  <section class="sectionBlock" id="alerts">
    <h2 class="sectionTitle hasIcon"><span class="headingIcon">${icon('alert')}</span>Prometheus alerts worth starting with</h2>
    <p class="bodyText">Treat these as starting points. Check the exact metric names and labels in your scrape output, because labels differ by Keycloak version, distribution, and scrape setup.</p>
    <div class="codePanel">
      <div class="codePanelHeader">
        <span>${icon('alert')} keycloak-alerts.yaml</span>
      </div>
      <pre><code>groups:
  - name: keycloak-sso
    rules:
      - alert: KeycloakReadinessDown
        expr: up{job="keycloak"} == 0
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "Keycloak metrics target is down"
          runbook: "Check management port, pod state, service, and recent rollout"

      - alert: KeycloakDatabasePoolWaiting
        expr: max_over_time(agroal_awaiting_count{job="keycloak"}[5m]) &gt; 0
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Keycloak is waiting for database connections"
          runbook: "Check DB CPU, locks, slow queries, pool limits, and login latency"

      - alert: KeycloakLoginPath5xx
        expr: sum(rate(http_server_requests_seconds_count{job="keycloak",status=~"5.."}[5m])) &gt; 0
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Keycloak is returning 5xx responses"
          runbook: "Check token, authorize, IDP, database, cache, and recent config changes"</code></pre>
    </div>
    <div class="noteBox">
      I would rather start with five alerts people trust than thirty nobody reads. Add more only when each alert has an owner, a runbook, and a verification step.
    </div>
  </section>

  <section class="sectionBlock" id="kubernetes">
    <h2 class="sectionTitle hasIcon"><span class="headingIcon">${icon('k8s')}</span>Kubernetes checks for Keycloak</h2>
    <p class="bodyText">Kubernetes can help you remove a bad instance from traffic, but it cannot understand your SSO journey unless you wire the right probes and alerts around it.</p>
    <div class="codePanel">
      <div class="codePanelHeader">
        <span>${icon('k8s')} probes.yaml</span>
      </div>
      <pre><code>readinessProbe:
  httpGet:
    path: /health/ready
    port: 9000
  initialDelaySeconds: 20
  periodSeconds: 10
  failureThreshold: 3

livenessProbe:
  httpGet:
    path: /health/live
    port: 9000
  initialDelaySeconds: 60
  periodSeconds: 20
  failureThreshold: 3</code></pre>
    </div>
    <div class="checklistGrid">
      <div class="checkItem"><span>${icon('check')}</span><strong>Use HTTP probes</strong><p>Do not depend on curl existing inside the Keycloak container.</p></div>
      <div class="checkItem"><span>${icon('check')}</span><strong>Watch restarts</strong><p>OOMKilled, CrashLoopBackOff, and rollout events should appear beside Keycloak metrics.</p></div>
      <div class="checkItem"><span>${icon('check')}</span><strong>Scale carefully</strong><p>More Keycloak pods can create more database pressure if the database is the bottleneck.</p></div>
      <div class="checkItem"><span>${icon('check')}</span><strong>Track config drift</strong><p>Secrets, certs, realm exports, client config, and ingress changes often create login failures.</p></div>
    </div>
  </section>

  <section class="sectionBlock" id="automation">
    <h2 class="sectionTitle hasIcon"><span class="headingIcon">${icon('shield')}</span>What to automate after the checks are trustworthy</h2>
    <p class="bodyText">The first useful automation is not magic. It is a careful loop that reduces toil without hiding risk.</p>
    <div class="decisionTableWrap" role="region" aria-label="Keycloak automation runbook table">
      <table class="decisionTable">
        <thead>
          <tr>
            <th>Condition</th>
            <th>Safe automation</th>
            <th>Verification</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>One pod fails readiness</strong></td>
            <td>Capture logs, confirm other replicas are healthy, restart or drain only that pod.</td>
            <td>Ready returns 200 and synthetic login passes.</td>
          </tr>
          <tr>
            <td><strong>Recent rollout matches failure time</strong></td>
            <td>Prepare rollback and request approval if customer impact is active.</td>
            <td>Token endpoint, authorize flow, and error rate recover.</td>
          </tr>
          <tr>
            <td><strong>Database pool waiting</strong></td>
            <td>Notify DB owner, attach pool and DB evidence, avoid blind scale-up.</td>
            <td>Awaiting count drops and login latency normalizes.</td>
          </tr>
          <tr>
            <td><strong>Login failures spike</strong></td>
            <td>Route to identity owner with realm, client, IDP, certificate, and config diff context.</td>
            <td>Synthetic login and real user error rate recover.</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="automationCta">
      <div class="automationCtaCopy">
        <span class="eyebrow">Where AlertMend helps</span>
        <h3>Turn trusted Keycloak alerts into safe action.</h3>
        <p>AlertMend can sit beside Prometheus, Grafana, Kubernetes, VM monitors, Datadog, logs, and your existing alerting tools. It correlates Keycloak health, login failures, database pressure, cache and cluster symptoms, pod events, and recent changes.</p>
        <p>When the failure pattern is safe, it can run an approved recovery workflow. When it is not safe, it can route the incident to Slack, WhatsApp, phone call, or your on-call policy with the evidence attached.</p>
        <div class="ctaButtonRow">
          <a class="ctaButton ctaButtonPrimary" href="${calendly}&intent=keycloak-automation" target="_blank" rel="noopener noreferrer">Book a Keycloak automation review</a>
        </div>
      </div>
      <div class="automationProofList" aria-label="AlertMend Keycloak automation capabilities">
        <div><span>${icon('check')}</span><strong>Works beside your stack</strong><small>Prometheus, Grafana, Kubernetes, VM monitors, logs, Datadog, PagerDuty, Slack, and more.</small></div>
        <div><span>${icon('shield')}</span><strong>Enterprise control</strong><small>Managed or self-hosted deployment, approval gates, audit trail, and local control.</small></div>
        <div><span>${icon('whatsapp')}</span><strong>Escalation that reaches people</strong><small>Slack, WhatsApp, phone calls, and on-call policies for urgent identity outages.</small></div>
        <div><span>${icon('check')}</span><strong>Verified recovery</strong><small>Confirm readiness, token flow, synthetic login, and database pressure after the action.</small></div>
      </div>
    </div>
  </section>

  <section class="sectionBlock" id="sources">
    <h2 class="sectionTitle hasIcon"><span class="headingIcon">${icon('book')}</span>Primary sources checked</h2>
    <p class="bodyText">This guide is grounded in Keycloak’s own observability, management interface, health, HTTP, event, database, cache, and clustering documentation.</p>
    <ol class="sourceList">
      <li><a href="https://www.keycloak.org/server/management-interface" target="_blank" rel="noopener noreferrer">Keycloak management interface</a></li>
      <li><a href="https://www.keycloak.org/observability/health" target="_blank" rel="noopener noreferrer">Keycloak health checks</a></li>
      <li><a href="https://www.keycloak.org/observability/metrics-for-troubleshooting" target="_blank" rel="noopener noreferrer">Keycloak troubleshooting using metrics</a></li>
      <li><a href="https://www.keycloak.org/observability/metrics-for-troubleshooting-http" target="_blank" rel="noopener noreferrer">Keycloak HTTP metrics</a></li>
      <li><a href="https://www.keycloak.org/observability/event-metrics" target="_blank" rel="noopener noreferrer">Keycloak user event metrics</a></li>
      <li><a href="https://www.keycloak.org/observability/metrics-for-troubleshooting-database" target="_blank" rel="noopener noreferrer">Keycloak database metrics</a></li>
      <li><a href="https://www.keycloak.org/observability/metrics-for-troubleshooting-cache" target="_blank" rel="noopener noreferrer">Keycloak local cache metrics</a></li>
      <li><a href="https://www.keycloak.org/observability/metrics-for-troubleshooting-clustering-and-network" target="_blank" rel="noopener noreferrer">Keycloak clustering and network metrics</a></li>
    </ol>
  </section>

  <section class="sectionBlock" id="faq">
    <h2 class="sectionTitle hasIcon"><span class="headingIcon">${icon('book')}</span>FAQ</h2>
    <p class="bodyText">Short answers for the questions teams usually search when self-hosted Keycloak is up, but login, SSO, OIDC, token refresh, or admin access is failing.</p>
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
        ${articleContent}
        ${authorCard()}
        <div class="ctaBox">
          <h2>Want AlertMend to watch your self-hosted Keycloak?</h2>
          <p>Bring one real login failure, readiness failure, or Keycloak metric. We will map the signal, owner, runbook, and safe recovery path.</p>
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
