/**
 * Code-generated rich blog: URL monitoring and automated fixes.
 */
import {
  SITE_URL,
  esc,
  parseFrontmatter,
  getRelatedPosts,
  calendlyUrl,
  CHROME_INLINE_CSS,
  buildNavHtml,
  buildSidebarHtml,
  buildArticleHeader,
  writeStaticBlogOutputs,
} from '../static-blog-shared.mjs'

export async function build(slug) {
  const assetsBase = `/assets/${slug}`
  const canonical = `${SITE_URL}/blog/${slug}`
  const heroImage = `${assetsBase}/url-monitor-hero.svg`

  const meta = parseFrontmatter(slug)
  const title = meta.title || 'URL Monitoring: Detect and Auto-Fix'
  const excerpt =
    meta.excerpt ||
    'Six-layer URL monitoring, healthz probes, threshold engineering, 5xx kubectl fixes, and AlertMend auto-remediation with verify-before-page.'
  const date = meta.date || '2026-06-23'
  const category = meta.category || 'URL Monitoring'
  const author = meta.author || 'AlertMend Team'
  const keywords =
    meta.keywords ||
    'url monitoring, url monitor, url health check, api health check, automated url monitoring, uptime monitoring, auto remediation, liveness probe, readiness probe, kubernetes'

  const relatedPosts = getRelatedPosts(slug, category)
  const postCalendlyUrl = calendlyUrl(slug)

  const PAIN_SCENARIOS = [
    [
      'Tuesday, 2:14am',
      '503 on /health for 40 minutes. Nobody paged.',
      'The monitor sent one email to a shared inbox. Users hit the error page 12,000 times. No auto-restart ran.',
    ],
    [
      'After every deploy',
      'Same pod restart ritual by hand.',
      'Readiness probe fails for 90 seconds. You kubectl delete pod from muscle memory. preStop would have prevented the 502s.',
    ],
    [
      'Dashboard says green',
      'Grafana looks fine. Customers see 502.',
      'In-cluster metrics are healthy. Ingress cannot reach the app. External URL monitoring catches this in 60 seconds.',
    ],
    [
      'Alert fatigue',
      '47 pages this month. Zero auto-fixes.',
      'Every flapping URL wakes someone up. Transient blips and real outages look the same because nothing verifies recovery.',
    ],
  ]

  const LAYERS = [
    ['DNS', 'A / AAAA / CNAME', 'Resolver or CDN misconfig'],
    ['TCP', 'Port 443 open', 'Firewall or security group'],
    ['TLS', 'Cert chain valid', 'Expired or wrong hostname'],
    ['HTTP', 'Status + body', '200 with empty error page'],
    ['API', '/api/checkout', 'Payment timeout'],
    ['App', 'Pods Ready', 'CrashLoopBackOff'],
  ]

  const HEALTH_ENDPOINTS = [
    ['/healthz/live', 'Liveness probe', 'Process alive only. Never check the database.', 'Restart container if wedged'],
    ['/healthz/ready', 'Readiness probe', 'DB, cache, deps OK. Can be slower (< 1s).', 'Remove from load balancer'],
    ['/healthz', 'Public URL monitor', 'Shallow 200 for external uptime checks.', 'Page if users cannot reach app'],
    ['/healthz/deep', 'On-call diagnostics', 'Full dependency map (auth optional).', 'Debug during incident'],
  ]

  const THRESHOLDS = [
    ['Uptime paging', '2 consecutive failures from 2 distinct regions within 60s', 'Single-region fail is usually carrier noise'],
    ['Latency alert', 'sustained p95 > max(baseline p95 x 1.5, baseline p95 + 2 sigma) for 10 min', 'Recompute baseline weekly from prior 14 days'],
    ['TLS expiry', 'Alert at 60, 30, 14, and 3 days before expiry', '7-day-only alerts mean firefighting on Sunday'],
    ['Auto-fix trigger', '3 consecutive URL failures + in-cluster signal agrees', 'Avoid restarting during deploy suppression window'],
    ['Alert precision', 'Tag each page: real incident / false positive / no action', 'Target 80%+ precision or on-call stops trusting alerts'],
  ]

  const CHECKS = [
    ['HTTP status + body', 'Real success, not empty 200', 'Assert JSON status field or HTML snippet'],
    ['Response time', 'User-visible latency', 'Baseline-relative p95, not round numbers'],
    ['TLS / certificate', 'Chain + hostname + expiry', '60 / 30 / 14 / 3 day ladder'],
    ['DNS', 'Record matches intent', 'External resolver + unauthorized change detection'],
    ['TCP / ICMP', 'Port reachable on network path', 'Catches firewall changes HTTP checks miss'],
  ]

  const SAFE_AUTOMATE = [
    ['502 / 503 / 504', 'Pods not ready, upstream empty, timeout', 'Restart pods, preStop sleep, scale up'],
    ['503 no healthy upstream', 'All backends failing health checks', 'Rollout restart deployment'],
    ['Slow response', 'CPU or memory pressure', 'Horizontal scale, restart leaking pod'],
    ['CrashLoopBackOff', 'OOM, bad config, missing secret', 'Restart, rollback to last good revision'],
    ['SSL expiring', 'Cert not renewed', 'Trigger cert-manager renewal job'],
  ]

  const DO_NOT_AUTOMATE = [
    ['Database failover', 'High blast radius', 'Page on-call with runbook'],
    ['Schema migrations', 'Irreversible without review', 'Human approval required'],
    ['Delete persistent volumes', 'Data loss risk', 'Never automate silently'],
    ['Multi-service rollback', 'Cascading impact', 'Coordinate manually'],
  ]

  const REMEDIATION_FLOW = [
    ['URL check fails', 'External monitor: 503 x3 from US + EU', false, false],
    ['Correlate', 'AlertMend: empty endpoints, readiness failing', false, true],
    ['Auto-fix', 'Rollout restart deployment/api', false, true],
    ['Verify', 'Re-probe URL: 200, 200', true, false],
    ['Notify', 'Slack summary. No page.', true, false],
  ]

  const HUB_LINKS = [
    ['/blog/503-no-healthy-upstream', '503 No Healthy Upstream', 'nginx, Istio, Envoy: no healthy backends'],
    ['/blog/kubernetes-502-bad-gateway-error-fix', 'Kubernetes 502 Bad Gateway', 'preStop hooks, ingress timeouts, deploy races'],
    ['/blog/api-health-check-strategies', 'API Health Check Strategies', 'Expanded health endpoint patterns'],
    ['/blog/automated-url-status-checks', 'Automated URL Status Checks', 'Legacy guide (see this post for the updated playbook)'],
    ['/blog/alertmend-sre-automation-tools', 'AlertMend SRE Automation', 'Runbooks and fleet-wide remediation'],
    ['/blog/24x7-network-monitoring', '24x7 Network Monitoring', 'Layer checks beyond HTTP'],
  ]

  const SETUP_STEPS = [
    ['Add layered URL checks', 'DNS, TLS, HTTP, and API endpoints from 2+ regions every 30 to 60 seconds.'],
    ['Wire health endpoints', 'Public /healthz (shallow), /healthz/ready (deps), /healthz/live (liveness only).'],
    ['Engineer thresholds', 'Multi-geo confirmation before paging; baseline-relative latency; cert ladder.'],
    ['Attach idempotent runbooks', 'Restart, scale, rollback. Must be safe to run twice.'],
    ['Verify then notify', 'Re-probe URL twice. Slack on success; page only if verification fails.'],
  ]

  const FAQ = [
    [
      'What is URL monitoring?',
      'URL monitoring periodically requests an endpoint (usually HTTPS) and checks status code, latency, TLS, and sometimes response content. It reflects what users experience, including DNS, CDN, and ingress layers that in-cluster metrics miss.',
    ],
    [
      'What is the difference between liveness and readiness probes?',
      'Liveness asks "should Kubernetes restart this container?" It must be shallow (process responsive only). Readiness asks "should this pod receive traffic?" It may check databases and caches. Per Kubernetes docs: never put dependency checks on liveness.',
    ],
    [
      'Which endpoint should external URL monitors hit?',
      'Hit a shallow public path like /healthz that returns 200 quickly without heavy DB queries. Use /healthz/ready for readiness probes inside the cluster, not for aggressive external polling unless you accept dependency flapping.',
    ],
    [
      'What failures are safe to automate?',
      'Idempotent, low blast-radius fixes: pod restarts, scaling replicas up, rolling back a bad deploy, renewing TLS certs, deleting stuck pods. Each runbook needs detection, execution, verification, and escalation if verification fails.',
    ],
    [
      'How is URL monitoring different from Prometheus?',
      'Prometheus scrapes metrics from inside your infrastructure. URL monitoring probes the same URLs users hit. Use both: Prometheus for diagnosis, URL checks for user-visible availability and auto-fix triggers.',
    ],
    [
      'When should I page vs auto-fix?',
      'Auto-fix after 2 to 3 consecutive failures when a safe runbook exists. Page only when verification fails after the fix, or when the failure type is on the do-not-automate list (DB failover, PV delete, etc.).',
    ],
    [
      'What is alert precision and why does it matter?',
      'Precision is the percentage of pages that were real incidents requiring immediate action. Below 80%, on-call stops trusting alerts. Track it monthly and fix the noisiest rules before adding new monitors.',
    ],
    [
      'When should I use AlertMend for URL monitoring?',
      'When URL failures should trigger in-cluster remediation (restart, scale, rollback), re-verify the URL, and post to Slack before paging anyone. AlertMend connects external checks to Kubernetes and VM runbooks with AI-assisted RCA on escalation.',
    ],
  ]

  const STATUS_TABS = [
    ['500', '500', 'App error'],
    ['502', '502', 'Bad gateway'],
    ['503', '503', 'Unavailable'],
    ['504', '504', 'Timeout'],
  ]

  const PROBE_YAML = `livenessProbe:
  httpGet:
    path: /healthz/live
    port: 8080
  periodSeconds: 15
  timeoutSeconds: 5
  failureThreshold: 3
readinessProbe:
  httpGet:
    path: /healthz/ready
    port: 8080
  periodSeconds: 5
  timeoutSeconds: 3
  failureThreshold: 2
startupProbe:
  httpGet:
    path: /healthz/started
    port: 8080
  failureThreshold: 30
  periodSeconds: 10
lifecycle:
  preStop:
    exec:
      command: ["sh", "-c", "sleep 5"]`

  const APP_HEALTH_JS = `// Public monitor target (shallow, fast)
app.get('/healthz', (req, res) => res.status(200).json({ status: 'ok' }));

// Liveness: process only — never check DB here
app.get('/healthz/live', (req, res) => res.sendStatus(200));

// Readiness: dependencies OK
app.get('/healthz/ready', async (req, res) => {
  await db.ping();
  res.status(200).json({ status: 'ready' });
});`

  const renderPainScenarios = PAIN_SCENARIOS.map(
    ([when, t, body]) =>
      `<div class="fearScenario"><p class="fearScenarioWhen">${esc(when)}</p><h3 class="fearScenarioTitle">${esc(t)}</h3><p class="fearScenarioBody">${esc(body)}</p></div>`
  ).join('\n        ')

  const renderLayers = LAYERS.map(([title, sub, hint], i) => {
    const arrow = i < LAYERS.length - 1 ? '<span class="layerArrow" aria-hidden="true">→</span>' : ''
    const first = i === 0 ? ' layerNodeFirst' : ''
    return `<div class="layerNode${first}"><p class="layerNodeLabel">Layer ${i + 1}</p><p class="layerNodeTitle">${esc(title)}</p><p class="layerNodeHint">${esc(sub)}</p><p class="layerNodeHint" style="margin-top:0.35rem;color:#991b1b">${esc(hint)}</p></div>${arrow}`
  }).join('\n        ')

  const renderFlow = REMEDIATION_FLOW.map(([t, b, done, action]) => {
    const cls = done ? 'flowStep flowStepDone' : action ? 'flowStep flowStepAction' : 'flowStep'
    return `<div class="${cls}"><span class="flowStepNum">${done ? '✓' : action ? '⚡' : '·'}</span><p class="flowStepTitle">${esc(t)}</p><p class="flowStepBody">${esc(b)}</p></div>`
  }).join('\n        ')

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
    name: 'Set up URL monitoring with automated fixes',
    description: excerpt,
    step: SETUP_STEPS.map(([name, text], i) => ({
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
      <section class="heroBand fearBand">
        <p class="heroGuideLabel">Stop paging humans for fixable outages</p>
        <h2 class="fearHeadline">Your URL monitor fired. Then everyone went back to sleep.</h2>
        <p class="fearLead">Most teams <strong>check</strong> URLs. Few teams <strong>fix</strong> them automatically. The result: the same 503 at 2am, the same kubectl restart, the same alert fatigue by Wednesday.</p>
        <div class="fearScenarioGrid">
        ${renderPainScenarios}
        </div>
        <p class="fearBridge"><strong>Monitoring without remediation is half an SLO.</strong> URL checks should trigger safe fixes, re-probe the endpoint, and only escalate when the fix fails.</p>
      </section>

      <section class="heroBand heroBandCompact">
        <p class="heroGuideLabel">The playbook in one sentence</p>
        <p class="seoTldr"><strong>Monitor the URLs users hit across every layer.</strong> When 2 regions agree on failure, run an <strong>idempotent auto-fix</strong>. <strong>Re-check twice.</strong> Page on-call only if verification fails.</p>
      </section>

      <h2 class="sectionHead">Six layers: where URL monitoring fits</h2>
      <p class="bodyText">A single HTTPS check is a smoke alarm with one sensor. When something breaks, <strong>the layer that alerts first is your root-cause starting point</strong>. Monitor each layer separately where possible.</p>
      <div class="layerStack" role="list" aria-label="Request path layers">
        ${renderLayers}
      </div>
      <p class="citeRow">Reference: <a href="https://kubernetes.io/docs/concepts/configuration/liveness-readiness-startup-probes/" target="_blank" rel="noopener noreferrer">Kubernetes probe docs</a> · <a href="https://sre.google/sre-book/monitoring-distributed-systems/" target="_blank" rel="noopener noreferrer">Google SRE monitoring chapter</a></p>

      <h2 class="sectionHead">Health endpoint architecture</h2>
      <p class="bodyText">The cardinal sin: one <code>/health</code> endpoint wired to liveness, readiness, and your external monitor. When the database blips, liveness restarts every pod and makes the outage worse. Split endpoints by purpose.</p>
      <div class="diyWrap">
        <table class="compareTable">
          <thead><tr><th>Path</th><th>Used by</th><th>Checks</th><th>On failure</th></tr></thead>
          <tbody>
            ${HEALTH_ENDPOINTS.map(([p, u, c, f]) => `<tr><td><code>${esc(p)}</code></td><td>${esc(u)}</td><td>${esc(c)}</td><td class="diyHighlight">${esc(f)}</td></tr>`).join('\n            ')}
          </tbody>
        </table>
      </div>
      <pre class="codeBlock"><code>${esc(APP_HEALTH_JS)}</code></pre>
      <p class="bodyText">Kubernetes probe wiring (copy into your Deployment):</p>
      <pre class="codeBlock"><code>${esc(PROBE_YAML)}</code></pre>
      <p class="citeRow">Deep dive on probe mistakes: <a href="https://devopsbeast.com/blog/kubernetes-probes-done-wrong" target="_blank" rel="noopener noreferrer">Kubernetes Probes Done Wrong</a></p>

      <h2 class="sectionHead">Live monitor mock</h2>
      <p class="bodyText">Click a status code to see kubectl commands and YAML. Hit <strong>Simulate recovery</strong> after an auto-fix succeeds.</p>
      <div class="monitorMock" aria-label="URL monitor dashboard mock">
        <div class="monitorMockHead">
          <span class="monitorMockLabel">External URL check · US + EU regions</span>
        </div>
        <div class="monitorMockUrl">https://api.example.com/healthz</div>
        <div class="monitorMockStatusRow">
          <span class="mockStatusDot mockStatusDotError" id="mock-status-dot"></span>
          <span class="mockStatusCode" id="mock-status-code">503</span>
          <span class="mockStatusLabel mockStatusLabelError" id="mock-status-label">Service Unavailable</span>
        </div>
        <div class="monitorMockBar"><div class="monitorMockBarFill"></div></div>
        <p class="monitorMockMeta">Last check: 412ms · 3 consecutive failures (US + EU) · auto-fix eligible</p>
        <button type="button" class="mockRecoverBtn" id="mock-recover-btn">Simulate recovery</button>
      </div>

      <h2 class="sectionHead">Pick a status code: kubectl + auto-fix</h2>
      <div class="modeGrid" role="tablist" aria-label="HTTP status code">
        ${STATUS_TABS.map(([id, t, sub], i) => `<button type="button" role="tab" data-status-code="${id}" class="modeCard${i === 2 ? ' modeCardActive' : ''}" aria-selected="${i === 2 ? 'true' : 'false'}"><span class="modeCardTitle">${esc(t)}</span><span class="modeCardSub">${esc(sub)}</span></button>`).join('\n        ')}
      </div>
      <div class="modePlaybook" role="tabpanel">
        <div class="modePlaybookHead">
          <h3 class="modePlaybookTitle" id="status-playbook-title">HTTP 503 Service Unavailable</h3>
        </div>
        <p class="modePlaybookSummary" id="status-playbook-summary"></p>
        <ul class="checkList" id="status-playbook-steps"></ul>
        <pre class="playbookCode" id="status-playbook-code" aria-label="kubectl and YAML commands"></pre>
        <p class="autofixBadge" id="status-playbook-autofix"></p>
        <div class="stepTip"><span id="status-playbook-tip"></span></div>
      </div>

      <h2 class="sectionHead">Threshold engineering (not round numbers)</h2>
      <p class="bodyText">"Alert if response time &gt; 3 seconds" pages you on normal behavior for a slow page and misses real regressions on fast pages. Use baselines and multi-region confirmation.</p>
      <div class="thresholdFormula">alert when sustained_p95(10m) &gt; max(baseline_p95 × 1.5, baseline_p95 + 2σ)
  for two consecutive evaluation windows</div>
      <div class="diyWrap">
        <table class="compareTable">
          <thead><tr><th>Rule</th><th>Threshold</th><th>Why</th></tr></thead>
          <tbody>
            ${THRESHOLDS.map(([r, t, w]) => `<tr><td>${esc(r)}</td><td class="diyHighlight">${esc(t)}</td><td>${esc(w)}</td></tr>`).join('\n            ')}
          </tbody>
        </table>
      </div>

      <h2 class="sectionHead">What each URL check should assert</h2>
      <div class="diyWrap">
        <table class="compareTable">
          <thead><tr><th>Check</th><th>What it tells you</th><th>Typical threshold</th></tr></thead>
          <tbody>
            ${CHECKS.map(([c, d, t]) => `<tr><td>${esc(c)}</td><td>${esc(d)}</td><td class="diyHighlight">${esc(t)}</td></tr>`).join('\n            ')}
          </tbody>
        </table>
      </div>

      <h2 class="sectionHead">The automation ladder</h2>
      <p class="bodyText">Every auto-remediation runbook must be <strong>idempotent</strong> (safe to run twice), include <strong>verification</strong>, and <strong>escalate</strong> if verification fails.</p>
      <div class="ladderSteps">
        <div class="ladderStep"><span class="ladderStepNum">1</span><p class="ladderStepTitle">Single failure</p><p class="ladderStepBody">Wait and re-check. One region failing alone is not an outage.</p></div>
        <div class="ladderStep"><span class="ladderStepNum">2</span><p class="ladderStepTitle">Multi-region confirm</p><p class="ladderStepBody">2+ regions fail 2 to 3 times. Run idempotent fix.</p></div>
        <div class="ladderStep"><span class="ladderStepNum">3</span><p class="ladderStepTitle">Verify twice</p><p class="ladderStepBody">URL returns 200 two consecutive probes. Log + Slack.</p></div>
        <div class="ladderStep"><span class="ladderStepNum">4</span><p class="ladderStepTitle">Escalate</p><p class="ladderStepBody">Still broken? Page on-call with RCA context.</p></div>
      </div>

      <h2 class="sectionHead">AlertMend flow: detect, fix, verify, notify</h2>
      <p class="bodyText">This is what a complete URL monitoring + auto-remediation loop looks like in production. No page if verification passes.</p>
      <div class="remediationFlow">
        ${renderFlow}
      </div>
      <div class="slackMock" aria-label="Slack notification example">
        <div class="slackMockChannel">#incidents</div>
        <div><span class="slackMockOk">✓ Auto-resolved</span> api.example.com/healthz</div>
        <div>503 × 3 (US, EU) → rollout restart deployment/api → verified 200 OK</div>
        <div class="slackMockMeta">Duration: 47s · No page sent · <a href="/case-studies">See case study</a></div>
      </div>

      <h2 class="sectionHead">Safe to automate vs human required</h2>
      <div class="searchIssueGrid">
        ${SAFE_AUTOMATE.map(([sym, cause, fix]) => `<div class="searchIssueCard"><h3 class="searchIssueTerm">${esc(sym)}</h3><p class="searchIssueDesc">${esc(cause)}</p><p class="searchIssueAlert"><strong>Auto-fix:</strong> ${esc(fix)}</p></div>`).join('\n        ')}
      </div>
      <div class="diyWrap" style="margin-top:1.25rem">
        <table class="compareTable">
          <thead><tr><th>Do not automate</th><th>Why</th><th>Instead</th></tr></thead>
          <tbody>
            ${DO_NOT_AUTOMATE.map(([s, w, a]) => `<tr><td>${esc(s)}</td><td>${esc(w)}</td><td class="diyHighlight">${esc(a)}</td></tr>`).join('\n            ')}
          </tbody>
        </table>
      </div>

      <h2 class="sectionHead">Five steps with AlertMend</h2>
      <div class="amFlow">
        ${SETUP_STEPS.map(([t, b], i) => `<div class="amStep"><div class="amStepHead"><span class="amStepNum">${i + 1}</span></div><h3 class="amStepTitle">${esc(t)}</h3><p class="amStepBody">${esc(b)}</p></div>`).join('\n        ')}
      </div>

      <h2 class="sectionHead">Related deep dives (hub)</h2>
      <p class="bodyText">This post is the consolidated playbook. These guides go deeper on specific errors and patterns:</p>
      <div class="hubLinks">
        ${HUB_LINKS.map(([href, t, d]) => `<a href="${href}" class="hubLinkCard"><p class="hubLinkTitle">${esc(t)}</p><p class="hubLinkDesc">${esc(d)}</p></a>`).join('\n        ')}
      </div>

      <h2 class="sectionHead">FAQ</h2>
      <div class="faqList">
        ${FAQ.map(([q, a], i) => `<div class="faqItem"><button type="button" class="faqQuestion" data-faq-toggle aria-expanded="${i === 0 ? 'true' : 'false'}">${esc(q)}<svg class="faqChevron${i === 0 ? ' faqChevronOpen' : ''}" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 9l6 6 6-6"/></svg></button><div class="faqAnswer${i === 0 ? '' : ' hidden'}">${esc(a)}</div></div>`).join('\n        ')}
      </div>

      <div class="ctaBand">
        <div class="ctaBandTitle">Wire URL checks to auto-fix today</div>
        <p class="ctaBandSub">Talk to an AlertMend engineer about multi-region URL monitoring, idempotent runbooks, and verification before paging.</p>
        <div class="ctaBtnRow">
          <a href="${postCalendlyUrl}" class="ctaBtn" target="_blank" rel="noopener noreferrer">Talk to an expert →</a>
        </div>
      </div>
    </div>

    <div class="promo">
      <p><strong>Pillar guide:</strong> This page supersedes our older <a href="/blog/automated-url-status-checks">automated URL checks</a> and complements <a href="/blog/api-health-check-strategies">API health check strategies</a>. For specific errors see <a href="/blog/503-no-healthy-upstream">503 upstream</a> and <a href="/blog/kubernetes-502-bad-gateway-error-fix">502 gateway</a>.</p>
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
