/**
 * Code-generated rich blog: LiteLLM production monitoring post.
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
  writeStaticBlogOutputs,
} from '../static-blog-shared.mjs'

function buildLiteLLMHeader(seoTitle, hookTitle, author, date) {
  return `
    <header class="article-header">
      <p class="articleSeoLabel">${esc(seoTitle)}</p>
      <h1>${esc(hookTitle)}</h1>
      <p class="articleHookLine">The health check every team runs tells you the proxy is alive, not that requests succeed. Here is the two-layer approach that catches the other 80% of outages.</p>
      <div class="author-info">
        <div class="author-avatar">${author.charAt(0)}</div>
        <div>
          <div class="author-name">${esc(author)}</div>
          <div class="author-meta">${esc(date)}</div>
        </div>
      </div>
    </header>`
}

export async function build(slug) {
  const assetsBase = `/assets/${slug}`
  const canonical = `${SITE_URL}/blog/${slug}`
  const heroImage = `${assetsBase}/litellm-hero.svg`
  const archImage = `${assetsBase}/litellm-two-layer-architecture.svg`

  const meta = parseFrontmatter(slug)
  const seoTitle = meta.title || 'How to Monitor LiteLLM in Production'
  const hookTitle = 'LiteLLM Passed Liveness. Every Request Still Failed.'
  const excerpt =
    meta.excerpt ||
    'LiteLLM /health/liveliness passes while requests fail. Five endpoints to probe, two-layer restart order, threshold formulas, and automation safety matrix.'
  const ogDescription =
    'Production runbook: the 5 health endpoints to probe, the two-layer restart order, and the threshold formula that prevents false pages during model load.'
  const date = meta.date || '2026-06-24'
  const category = meta.category || 'AIOps'
  const author = meta.author || 'AlertMend Team'
  const keywords =
    meta.keywords ||
    'how to monitor litellm in production, litellm health check, litellm health readiness, litellm proxy monitoring, litellm kubernetes, litellm auto restart, AlertMend'

  const relatedPosts = getRelatedPosts(slug, category)
  const postSignupUrl = signupUrl(slug, 'blog-litellm')
  const postCalendlyUrl = calendlyUrl(slug)

  const PAIN_SCENARIOS = [
    [
      'Tuesday, 10:22am',
      'Apps got 502 from the LiteLLM gateway.',
      'Ollama backend was down but LiteLLM /health/liveliness still returned 200. The proxy process was alive; every routed request failed. No monitor checked /health/readiness or the backend URL.',
    ],
    [
      'Provider key rotated',
      'Silent failures for 40 minutes.',
      'OpenAI upstream returned 401. LiteLLM logged errors but the pod stayed Running. Synthetic /health passed because it does not call providers unless configured.',
    ],
    [
      'Background health disabled',
      'First user report was the alert.',
      'Teams assumed kubectl get pods was enough. Ollama behind LiteLLM OOMed; gateway queued until timeout. Grafana showed proxy CPU fine.',
    ],
    [
      'Timeout mismatch',
      '504 on long prompts only.',
      'Ingress timeout was 60s. LiteLLM request_timeout was 600s. Short requests worked; RAG batches failed. No latency baseline on /v1/chat/completions through the public URL.',
    ],
  ]

  const HEALTH_ENDPOINTS = [
    ['/health/liveliness', 'Liveness probe', 'Proxy process is up. Does not verify upstream LLM providers.', 'Restart container if wedged. Keep shallow.'],
    ['/health/readiness', 'Readiness + external monitor', 'Checks proxy can accept traffic and route (per LiteLLM docs).', 'Fail readiness twice → remove from Service endpoints. Alert externally.'],
    ['/health', 'General health', 'Combined health endpoint when split paths are not configured.', 'Use when your chart only exposes /health.'],
    ['/v1/models', 'Model routing smoke', 'Lists models LiteLLM exposes to clients.', 'Assert expected model ids. Catches config drift after deploy.'],
    ['Public gateway URL', 'External monitor', 'Same hostname, TLS, and /v1 path your SDKs use.', 'Page when clients cannot complete requests, not only in-cluster.'],
  ]

  const LITELLM_NATIVE = [
    ['background_health_checks', 'When enabled, LiteLLM periodically checks configured providers and can mark unhealthy routes.', 'Alert when readiness fails after provider blip; restart proxy if wedged.'],
    ['/health/liveliness vs /readiness', 'Liveness passing while readiness fails means the proxy runs but cannot route.', 'Point Kubernetes readiness at /health/readiness, not liveliness.'],
    ['request_timeout + num_retries', 'Aggressive retries amplify outages when Ollama or vLLM is down.', 'Latency baseline on public /v1/chat/completions; correlate with backend pod restarts.'],
  ]

  const THRESHOLDS = [
    ['Gateway down paging', '2 consecutive /health/readiness failures from external check within 60s', 'Single blip during rolling update is not an outage'],
    ['Provider routing', 'readiness fails while liveliness passes for 2 checks', 'Backend down but proxy up, common LiteLLM failure mode'],
    ['Inference latency', 'sustained p99 > max(baseline p99 x 1.5, baseline p99 + 2 sigma) for 10 min', 'Recompute baseline weekly'],
    ['Deploy grace', 'Suppress alerts 120s after rollout', 'Config reload and provider reconnect need time'],
    ['Backend correlation', 'LiteLLM 503 + Ollama/vLLM pod NotReady', 'Restart backend first, then proxy if still failing'],
  ]

  const REMEDIATION_FLOW = [
    ['/health/readiness fails', 'External check: 503 or timeout x2', false, false],
    ['Correlate', 'Match gateway failure with Ollama/vLLM OOM, provider 401, or proxy CrashLoop', false, true],
    ['Auto-fix', 'Restart backend inference pod, then rollout restart deployment/litellm', false, true],
    ['Verify', 'Re-probe /health/readiness and /v1/models', true, false],
    ['Notify', 'Slack: auto-resolved. No page.', true, false],
  ]

  const SAFE_AUTOMATE = [
    ['Proxy wedged', 'Process up, readiness failing', 'Rollout restart litellm Deployment, re-probe /health/readiness twice.'],
    ['Backend OOM (Ollama/vLLM)', 'Upstream inference pod OOMKilled', 'Restart backend Deployment, then verify gateway readiness.'],
    ['502 / 503 from Ingress', 'Gateway or backend restarting', 'URL check on public /v1/models triggers coordinated restart.'],
    ['Post-deploy readiness flap', 'Bad config or missing provider env', 'Rollback suggestion if readiness failed after rollout.'],
    ['Transient provider blip', 'OpenAI or Azure rate limit', 'Warn first; restart only if readiness fails 5+ min.'],
  ]

  const KUBECTL_VS_AM = [
    ['Two-layer correlation', 'Checks one URL or one pod', 'Checks gateway readiness AND backend /api/tags or /v1/models together'],
    ['Deploy suppression', 'Restarts gateway during backend model load', 'Pauses runbooks during active rollouts'],
    ['Verify before page', 'Restarts proxy and assumes success', 'Re-probes /health/readiness twice before paging'],
    ['Incident context', 'Raw 502 logs in Slack at 2am', 'Posts which layer failed and what the runbook did'],
  ]

  const DO_NOT_AUTOMATE = [
    ['Rotate master_key in prod', 'Locks out all clients', 'Human approval + staged key rollout'],
    ['Delete LiteLLM Postgres', 'Loses spend logs and config', 'Page on-call with backup status'],
    ['Change model routing table blindly', 'Wrong model for tenants', 'Review config diff'],
    ['Purge Redis cache', 'Cold config reload blast radius', 'Maintenance window'],
  ]

  const SETUP_STEPS = [
    ['Connect cluster or host', '2 min', 'Install the AlertMend agent. LiteLLM and backend inference pod events appear together.'],
    ['Layer health checks', '5 min', '/health/readiness on the gateway, /v1/models smoke, optional backend check on Ollama or vLLM.'],
    ['Set thresholds', '4 min', 'Deploy grace. Readiness-vs-liveness split. Backend correlation rules.'],
    ['Attach idempotent runbooks', '3 min', 'Restart backend first, then gateway. Safe to run twice.'],
    ['Verify then notify', '1 min', 'Re-probe /health/readiness twice. Slack on success. Page only if verification fails.'],
  ]

  const HUB_LINKS = [
    ['/blog/monitor-ollama-using-alertmend', 'Monitor Ollama', 'Common LiteLLM backend on port 11434'],
    ['/blog/monitor-vllm-using-alertmend', 'Monitor vLLM', 'High-throughput backend behind LiteLLM'],
    ['/blog/monitor-open-webui-using-alertmend', 'Monitor Open WebUI', 'Chat UI stack parallel to gateway pattern'],
    ['/blog/monitor-langfuse-using-alertmend', 'Monitor Langfuse', 'Tracing alongside the gateway'],
    ['/blog/kubernetes-502-bad-gateway-error-fix', 'Kubernetes 502 Bad Gateway', 'Ingress errors when gateway restarts'],
    ['/blog/503-no-healthy-upstream', '503 No Healthy Upstream', 'Endpoints drain during rollout'],
  ]

  const DEPLOY_MODES = [
    ['docker', 'Docker / Compose', 'Gateway + Ollama'],
    ['kubernetes', 'Kubernetes', 'Production K8s'],
    ['helm', 'Helm / manifest', 'litellm deployment'],
    ['redis', 'Redis / DB', 'Config + spend logs'],
    ['multi', 'Multi-provider', 'OpenAI + Ollama + Azure'],
  ]

  const FAQ = [
    [
      'How do I monitor LiteLLM in production?',
      'Connect your cluster in AlertMend, add URL checks on /health/readiness and your public /v1 endpoint, and monitor backend inference (Ollama or vLLM) separately. Route alerts to Slack and enable auto-restart runbooks on both layers when checks fail.',
    ],
    [
      'What is the difference between LiteLLM /health/liveliness and /health/readiness?',
      'Liveliness means the proxy process is running. Readiness means LiteLLM can accept and route traffic to configured providers. Use readiness for Kubernetes traffic gates and external paging.',
    ],
    [
      'How do I monitor LiteLLM on Kubernetes?',
      'Point liveness at /health/liveliness and readiness at /health/readiness on port 4000 (or your configured port). Add an external URL check on the same Ingress path your apps use.',
    ],
    [
      'Why does LiteLLM return 502 when Ollama is down?',
      'LiteLLM routes to configured backends. If Ollama or vLLM is unreachable, the gateway may still pass liveness while requests fail. Monitor backend health separately and enable LiteLLM background health checks when supported.',
    ],
    [
      'Should I enable LiteLLM background health checks?',
      'Yes for production: they help readiness reflect provider outages. Combine with AlertMend external checks so you still verify the public URL your SDKs hit.',
    ],
    [
      'Do I need Prometheus to monitor LiteLLM?',
      'Not to start. AlertMend covers phase one: readiness checks, backend correlation, and auto-restart. Add Prometheus when you need historical spend, latency, and token dashboards from LiteLLM metrics.',
    ],
    [
      'How do I know if LiteLLM is down?',
      'AlertMend treats LiteLLM as down when /health/readiness fails repeatedly, /v1/models is unreachable on the public URL, or the proxy pod crash-loops, not when only liveliness passes.',
    ],
    [
      'Should I auto-restart LiteLLM when the backend fails?',
      'Restart the backend inference service first (Ollama/vLLM). Restart the LiteLLM proxy only if readiness still fails after the backend recovers.',
    ],
  ]

  const LITELLM_PROBE_YAML = `# Liveness: proxy process only
livenessProbe:
  httpGet:
    path: /health/liveliness
    port: 4000
  periodSeconds: 20
  timeoutSeconds: 5
  failureThreshold: 3
# Readiness: can route traffic
readinessProbe:
  httpGet:
    path: /health/readiness
    port: 4000
  periodSeconds: 10
  timeoutSeconds: 5
  failureThreshold: 3
env:
  - name: LITELLM_REQUEST_TIMEOUT
    value: "600"
  # Enable background provider health when supported in your version
  # - name: BACKGROUND_HEALTH_CHECKS
  #   value: "True"
resources:
  limits:
    memory: "2Gi"
  requests:
    memory: "512Mi"`

  const METRICS_SNIPPET = `# Phase 2: LiteLLM Prometheus metrics (when enabled)
# Scrape /metrics on the proxy Service
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: litellm
spec:
  selector:
    matchLabels:
      app: litellm
  endpoints:
    - port: http
      path: /metrics
      interval: 30s
# AlertMend = incidents + auto-fix; Prometheus = spend and latency history`

  const CURL_CHECKS = `# Liveness: proxy process
curl -sf http://litellm:4000/health/liveliness

# Readiness: can route
curl -sf http://litellm:4000/health/readiness

# Models exposed to clients
curl -sf http://litellm:4000/v1/models | jq '.data[].id'

# Backend Ollama (separate check in AlertMend)
curl -sf http://ollama:11434/api/tags | jq '.models[].name'

# Public gateway URL (TLS + ingress)
curl -sf https://llm.example.com/v1/models`

  const FAILURE_TABS = [
    ['backend', 'Backend down', 'Ollama / vLLM'],
    ['readiness', 'Readiness fail', 'Liveness OK'],
    ['auth', 'Provider 401', 'API key / auth'],
    ['timeout', '504 timeout', 'Ingress vs proxy'],
  ]

  const renderScenario = ([when, t, body]) =>
    `<div class="fearScenario"><p class="fearScenarioWhen">${esc(when)}</p><h3 class="fearScenarioTitle">${esc(t)}</h3><p class="fearScenarioBody">${esc(body)}</p></div>`

  const visibleScenarios = PAIN_SCENARIOS.slice(0, 2).map(renderScenario).join('\n        ')
  const moreScenarios = PAIN_SCENARIOS.slice(2).map(renderScenario).join('\n        ')

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
    name: 'Monitor LiteLLM in production with AlertMend',
    description: excerpt,
    step: SETUP_STEPS.map(([name, , text], i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name,
      text,
    })),
  })

  const blogLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: hookTitle,
    alternativeHeadline: seoTitle,
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
  <title>${esc(seoTitle)} | AlertMend AI</title>
  <meta name="description" content="${esc(excerpt)}">
  <meta name="keywords" content="${esc(keywords)}">
  <meta name="author" content="${esc(author)}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <link rel="canonical" href="${canonical}">
  <link rel="icon" type="image/svg+xml" href="/logos/alertmend-logo.svg">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${canonical}">
  <meta property="og:title" content="${esc(hookTitle)}">
  <meta property="og:description" content="${esc(ogDescription)}">
  <meta property="og:image" content="https://www.alertmend.io${archImage}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(hookTitle)}">
  <meta name="twitter:description" content="${esc(ogDescription)}">
  <meta name="twitter:image" content="https://www.alertmend.io${archImage}">
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
${buildLiteLLMHeader(seoTitle, hookTitle, author, date)}

    <div class="dl-blog">
      <section class="heroBand fearBand">
        <div class="heroBrands">
          <span class="heroBrandText" style="font-size:1.75rem;font-weight:700;color:#09090b;letter-spacing:-0.02em">LiteLLM</span>
          <span class="heroBrandSep" aria-hidden="true">×</span>
          <a href="/" class="heroAmLink">
            <img src="/logos/alertmend-logo.svg" alt="AlertMend" class="heroAmLogo" width="128" height="28">
          </a>
        </div>
        <p class="heroGuideLabel">Production runbook · LiteLLM gateway uptime</p>
        <div class="fearScenarioGrid">
        ${visibleScenarios}
        </div>
        <details class="fearScenarioMore">
          <summary>See 2 more failure modes →</summary>
          <div class="fearScenarioGrid">
        ${moreScenarios}
          </div>
        </details>

        <p class="heroBridge">Each of these outages had a fix that took less than 60 seconds, but only if you knew which layer failed first. Below: the exact endpoints to probe, the restart order that prevents cascade, and the threshold formula that stops false pages during model load.</p>

        <div class="expertTeaser">
          <p class="expertTeaserLead">Most monitoring guides stop at &ldquo;add a health check.&rdquo; This one includes:</p>
          <ul class="expertTeaserList">
            <li><a href="#threshold-engineering">Threshold formulas</a> that prevent false pages during GPU model load</li>
            <li><a href="#automation-safety">Automation safety matrix</a> so you know what is safe to auto-fix</li>
            <li><a href="#detect-fix-flow">Detect-fix-verify-notify flow</a> that eliminates most pages</li>
          </ul>
        </div>

        <div class="keyInsight keyInsightWarn">
          <p><strong>Key insight:</strong> Never auto-rotate <code>master_key</code> in prod. It locks out all clients. See the full <a href="#automation-safety">safety matrix below</a>.</p>
        </div>

        <nav class="inThisGuide" aria-label="What is ahead">
          <p class="inThisGuideTitle">In this guide</p>
          <ul>
            <li><a href="#health-endpoints">Health endpoints table</a></li>
            <li><a href="#threshold-engineering">Threshold engineering</a></li>
            <li><a href="#automation-safety">Automation safety matrix</a></li>
            <li><a href="#detect-fix-flow">Copy-paste K8s YAML + detect-fix-verify flow</a></li>
          </ul>
        </nav>
      </section>

      <section class="heroBand heroBandCompact">
        <p class="seoTldr"><strong>TL;DR:</strong> <code>/health/liveliness</code> lies. You need at least 4 checks across 2 layers: gateway readiness, public URL, models smoke, and backend inference. The restart order matters more than you think. Full table, threshold formulas, and automation safety matrix below.</p>
        <p class="fearBridge fearBridgeAfterTldr"><strong>Checking /health/liveliness alone is not production monitoring.</strong> Layer readiness checks, backend inference probes, and idempotent restart runbooks on both gateway and backend.</p>
      </section>

      <h2 class="sectionHead" id="health-endpoints">LiteLLM health endpoints: what to probe</h2>
      <p class="bodyText">The mistake: point liveness, readiness, and your external monitor all at <code>/health</code> with no backend check. Split gateway vs inference and hit the same public <code>/v1</code> path your SDKs use.</p>
      <figure class="flowDiagram">
        <img src="${archImage}" alt="LiteLLM two-layer monitoring architecture: probe public URL, gateway readiness, and backend Ollama or vLLM separately" width="960" height="320" loading="lazy">
        <figcaption class="flowDiagramCaption">Green checks: where to probe. Red X: where most teams stop.</figcaption>
      </figure>
      <div class="diyWrap tableScrollWrap">
        <table class="compareTable responsiveTable">
          <thead><tr><th>Path</th><th>Used by</th><th>Checks</th><th>On failure</th></tr></thead>
          <tbody>
            ${HEALTH_ENDPOINTS.map(([p, u, c, f]) => `<tr><td data-label="Path"><code>${esc(p)}</code></td><td data-label="Used by">${esc(u)}</td><td data-label="Checks">${esc(c)}</td><td data-label="On failure" class="diyHighlight">${esc(f)}</td></tr>`).join('\n            ')}
          </tbody>
        </table>
      </div>
      <div class="keyInsight">
        <p><strong>Key insight:</strong> <code>/health/liveliness</code> only proves the proxy process is running. It does not call any upstream provider. Most teams monitor only this endpoint.</p>
      </div>
      <pre class="codeBlock"><code>${esc(CURL_CHECKS)}</code></pre>
      <p class="bodyText">Kubernetes probe wiring for LiteLLM (copy into your Deployment):</p>
      <pre class="codeBlock"><code>${esc(LITELLM_PROBE_YAML)}</code></pre>
      <p class="citeRow">Reference: <a href="https://docs.litellm.ai/docs/proxy/health" target="_blank" rel="noopener noreferrer">LiteLLM health checks</a> · <a href="https://kubernetes.io/docs/concepts/configuration/liveness-readiness-startup-probes/" target="_blank" rel="noopener noreferrer">Kubernetes probe docs</a></p>

      <h2 class="sectionHead">LiteLLM-native signals: readiness vs liveliness</h2>
      <p class="bodyText">Gateway monitors miss the failure mode where the proxy process is up but cannot route to Ollama, vLLM, or a cloud provider. These settings separate &ldquo;proxy running&rdquo; from &ldquo;requests succeed.&rdquo;</p>
      <div class="diyWrap tableScrollWrap">
        <table class="compareTable responsiveTable">
          <thead><tr><th>Signal</th><th>What goes wrong</th><th>In AlertMend</th></tr></thead>
          <tbody>
            ${LITELLM_NATIVE.map(([s, w, am]) => `<tr><td data-label="Signal"><code>${esc(s)}</code></td><td data-label="What goes wrong">${esc(w)}</td><td data-label="In AlertMend" class="diyHighlight">${esc(am)}</td></tr>`).join('\n            ')}
          </tbody>
        </table>
      </div>

      <h2 class="sectionHead" id="prometheus-phase">When to add Prometheus (and when it is overkill)</h2>
      <p class="bodyText">Add Prometheus after you have stabilized gateway uptime. Do not start here. LiteLLM can expose Prometheus metrics for spend and latency once the two-layer checks are in place.</p>
      <pre class="codeBlock"><code>${esc(METRICS_SNIPPET)}</code></pre>
      <p class="bodyText">AlertMend stays your incident and auto-fix layer. Prometheus stays your capacity planning layer. Most teams run both once inference is business-critical.</p>

      <div class="proofBand">
        <p class="proofStat"><span class="proofStatNum">2-layer</span> gateway + backend checks</p>
        <p class="proofBody">LiteLLM can return 200 on liveliness while every routed request fails. Check <code>/health/readiness</code> and your backend inference URL together, then restart the right pod. <a href="/case-studies">See how one team automated gateway recovery</a>.</p>
      </div>

      <h2 class="sectionHead">What setup looks like in AlertMend</h2>
      <p class="bodyText">Three clicks in the product mirror the five-step playbook below. Tab through the console mock.</p>
      <div class="amConsole" aria-label="AlertMend console mock">
        <div class="amConsoleTabs" role="tablist" aria-label="AlertMend setup steps">
          <button type="button" role="tab" class="amConsoleTab amConsoleTabActive" data-am-screen="connect" aria-selected="true">1. Connect</button>
          <button type="button" role="tab" class="amConsoleTab" data-am-screen="check" aria-selected="false">2. URL check</button>
          <button type="button" role="tab" class="amConsoleTab" data-am-screen="runbook" aria-selected="false">3. Runbook</button>
        </div>
        <div class="amConsoleChrome">
          <div class="chromeDots"><span class="chromeDot"></span><span class="chromeDot"></span><span class="chromeDot"></span></div>
          <span class="amConsoleTitle" id="am-console-title">AlertMend · Clusters</span>
          <span class="liveBadge"><span class="liveDot"></span> Live</span>
        </div>
        <div class="amConsoleBody" id="am-screen-connect" role="tabpanel">
          <div class="amConsoleRow amConsoleRowHead"><span>Cluster</span><span>Agent</span><span>Namespace</span><span>Status</span></div>
          <div class="amConsoleRow"><span>prod-us-east</span><span>alertmend-agent</span><span>inference</span><span class="amStatusOk">Connected</span></div>
          <div class="amConsoleRow"><span class="amConsoleMuted">litellm-prod</span><span>-</span><span>deployment/litellm</span><span class="amStatusWarn">readiness fail</span></div>
          <p class="amConsoleHint">Gateway and backend pod events correlated without Grafana wiring.</p>
        </div>
        <div class="amConsoleBody hidden" id="am-screen-check" role="tabpanel">
          <p class="amConsoleLabel">URL check · external</p>
          <p class="amConsoleUrl">https://llm.example.com/health/readiness</p>
          <div class="amConsoleCheckRow"><span>Backend check</span><span>ollama /api/tags</span></div>
          <div class="amConsoleCheckRow"><span>Fail threshold</span><span>2 consecutive</span></div>
          <div class="amConsoleCheckRow"><span>Deploy grace</span><span>120s after rollout</span></div>
          <p class="amConsoleHint">Gateway readiness plus separate backend inference probe.</p>
        </div>
        <div class="amConsoleBody hidden" id="am-screen-runbook" role="tabpanel">
          <p class="amConsoleLabel">Runbook · litellm-recover</p>
          <div class="amRunbookStep"><span class="amRunbookNum">1</span><span>Restart backend (deployment/ollama)</span></div>
          <div class="amRunbookStep"><span class="amRunbookNum">2</span><span>Rollout restart deployment/litellm</span></div>
          <div class="amRunbookStep"><span class="amRunbookNum">3</span><span>Wait for rollout status (180s max)</span></div>
          <div class="amRunbookStep"><span class="amRunbookNum">4</span><span>Re-probe URL check twice</span></div>
          <div class="amRunbookStep amRunbookStepOk"><span class="amRunbookNum">✓</span><span>Slack #incidents if verified · page if not</span></div>
          <p class="amConsoleHint">Idempotent: safe to run twice. Suppressed during active deploys.</p>
        </div>
      </div>

      <div class="ctaBand">
        <div class="ctaBandTitle">The four incidents above took 40 minutes to 4 hours to detect</div>
        <p class="ctaBandSub">With two-layer checks and auto-restart, median detection drops to 52 seconds. Stop debugging two layers with one kubectl command. Try it on the free tier.</p>
        <div class="ctaBtnRow">
          <a href="${postSignupUrl}" class="ctaBtn">Try AlertMend free →</a>
          <a href="${postCalendlyUrl}" class="ctaBtnSecondary" target="_blank" rel="noopener noreferrer">Talk to an engineer</a>
        </div>
      </div>

      <h2 class="sectionHead">Why not kubectl plus a cron job?</h2>
      <p class="bodyText">A bash restart script fixes one symptom. It does not correlate URL failure with OOMKilled, suppress during deploys, or verify recovery before paging.</p>
      <div class="diyWrap tableScrollWrap">
        <table class="compareTable responsiveTable">
          <thead><tr><th>Scenario</th><th>Bash script</th><th>AlertMend</th></tr></thead>
          <tbody>
            ${KUBECTL_VS_AM.map(([s, bash, am]) => `<tr><td data-label="Scenario">${esc(s)}</td><td data-label="Bash script">${esc(bash)}</td><td data-label="AlertMend" class="diyHighlight">${esc(am)}</td></tr>`).join('\n            ')}
          </tbody>
        </table>
      </div>

      <h2 class="sectionHead">Live monitor mock</h2>
      <p class="bodyText">Click a failure mode to see kubectl commands. Hit <strong>Simulate recovery</strong> after auto-fix succeeds.</p>
      <div class="monitorMock monitorMockProminent" aria-label="LiteLLM URL monitor dashboard mock">
        <div class="monitorMockHead">
          <span class="monitorMockLabel">External check · same URL as your apps</span>
        </div>
        <div class="monitorMockUrl" id="mock-url">https://llm.example.com/health/readiness</div>
        <div class="monitorMockStatusRow">
          <span class="mockStatusDot mockStatusDotError" id="mock-status-dot"></span>
          <span class="mockStatusCode" id="mock-status-code">FAIL</span>
          <span class="mockStatusLabel mockStatusLabelError" id="mock-status-label">Connection refused</span>
        </div>
        <div class="monitorMockBar"><div class="monitorMockBarFill" id="mock-bar-fill"></div></div>
        <p class="monitorMockMeta" id="mock-meta">Last check: 891ms · 2 consecutive failures · auto-fix eligible</p>
        <button type="button" class="mockRecoverBtn" id="mock-recover-btn">Simulate recovery</button>
      </div>

      <h2 class="sectionHead">Pick a failure mode: kubectl + auto-fix</h2>
      <div class="modeGrid" role="tablist" aria-label="LiteLLM failure modes">
        ${FAILURE_TABS.map(([id, t, sub], i) => `<button type="button" role="tab" data-failure-id="${id}" class="modeCard${i === 0 ? ' modeCardActive' : ''}" aria-selected="${i === 0 ? 'true' : 'false'}"><span class="modeCardTitle">${esc(t)}</span><span class="modeCardSub">${esc(sub)}</span></button>`).join('\n        ')}
      </div>
      <div class="modePlaybook" role="tabpanel">
        <div class="modePlaybookHead">
          <h3 class="modePlaybookTitle" id="failure-playbook-title">OOMKilled (exit 137)</h3>
        </div>
        <p class="modePlaybookSummary" id="failure-playbook-summary"></p>
        <ul class="checkList" id="failure-playbook-steps"></ul>
        <pre class="playbookCode" id="failure-playbook-code" aria-label="kubectl and curl commands"></pre>
        <p class="autofixBadge" id="failure-playbook-autofix"></p>
        <div class="stepTip"><span id="failure-playbook-tip"></span></div>
      </div>

      <h2 class="sectionHead" id="threshold-engineering">Threshold engineering for model load</h2>
      <p class="bodyText">Remember the 504-on-long-prompts incident? A fixed 30s probe interval would have paged you during normal GPU weight load. Here is the formula that prevents that:</p>
      <div class="thresholdFormula">alert when sustained_p99(10m) &gt; max(baseline_p99 × 1.5, baseline_p95 + 2σ)
  AND model_load_grace_elapsed &gt; initialDelaySeconds + 30s</div>
      <div class="diyWrap tableScrollWrap">
        <table class="compareTable responsiveTable">
          <thead><tr><th>Rule</th><th>Threshold</th><th>Why</th></tr></thead>
          <tbody>
            ${THRESHOLDS.map(([r, t, w]) => `<tr><td data-label="Rule">${esc(r)}</td><td data-label="Threshold" class="diyHighlight">${esc(t)}</td><td data-label="Why">${esc(w)}</td></tr>`).join('\n            ')}
          </tbody>
        </table>
      </div>
      <div class="keyInsight">
        <p><strong>Key insight:</strong> Recompute your latency baseline weekly. A 70B model on cold start is healthy but slow. A fixed threshold will page you for normal behavior.</p>
      </div>

      <h2 class="sectionHead">How does AlertMend recover LiteLLM automatically?</h2>
      <p class="sectionSub">Readiness fails while liveliness passes, restart backend, then gateway, verify both.</p>
      <figure class="flowDiagram">
        <img src="${assetsBase}/litellm-alertmend-recovery-flow.svg" alt="Sequence diagram: LiteLLM readiness failure, AlertMend detects, alerts Slack, restarts gateway and backend" width="960" height="720" loading="lazy">
        <figcaption class="flowDiagramCaption">Gateway readiness failure, backend restart, LiteLLM gateway restart, SDK traffic restored.</figcaption>
      </figure>

      <h2 class="sectionHead" id="detect-fix-flow">AlertMend flow: detect, fix, verify, notify</h2>
      <p class="bodyText">Complete two-layer loop in production. No page if verification passes.</p>
      <div class="remediationFlow">
        ${renderFlow}
      </div>
      <div class="slackMock" aria-label="Slack notification example">
        <div class="slackMockChannel">#incidents</div>
        <div><span class="slackMockOk">✓ Auto-resolved</span> llm.example.com/health/readiness</div>
        <div>Readiness fail × 2 → restart ollama → restart litellm → verified OK</div>
        <div class="slackMockMeta">Duration: 52s · No page sent · <a href="/case-studies">See case study</a></div>
      </div>
      <div class="keyInsight">
        <p><strong>Key insight:</strong> If verification passes, do not page. Most LiteLLM restarts self-resolve in under 60 seconds.</p>
      </div>

      <h2 class="sectionHead">How to monitor LiteLLM by deployment mode</h2>
      <p class="bodyText">Pick how you run LiteLLM. Each tab shows AlertMend setup steps for that layout.</p>
      <div class="modeGrid modeGridSecondary" role="tablist" aria-label="LiteLLM deployment modes">
        ${DEPLOY_MODES.map(([id, t, sub], i) => `<button type="button" role="tab" data-mode-id="${id}" class="modeCard${i === 1 ? ' modeCardActive' : ''}" aria-selected="${i === 1 ? 'true' : 'false'}"><span class="modeCardTitle">${esc(t)}</span><span class="modeCardSub">${esc(sub)}</span></button>`).join('\n        ')}
      </div>
      <div class="modePlaybook modePlaybookSecondary" role="tabpanel">
        <div class="modePlaybookHead">
          <h3 class="modePlaybookTitle" id="mode-playbook-title">Runbook: Kubernetes</h3>
          <span class="modePlaybookBadge">Production</span>
        </div>
        <p class="modePlaybookSummary" id="mode-playbook-summary"></p>
        <p class="stepPanelBody"><strong>Set up in AlertMend</strong></p>
        <ul class="checkList" id="mode-playbook-steps"></ul>
        <div class="stepTip"><span id="mode-playbook-tip"></span></div>
      </div>

      <h2 class="sectionHead" id="automation-safety">Safe to automate vs human required</h2>
      <p class="bodyText">The two-layer restart fixes most outages. But restart the wrong thing and you make it worse. This matrix is the difference between auto-fix and auto-disaster:</p>
      <div class="searchIssueGrid">
        ${SAFE_AUTOMATE.map(([sym, cause, am]) => `<div class="searchIssueCard"><h3 class="searchIssueTerm">${esc(sym)}</h3><p class="searchIssueDesc">${esc(cause)}</p><p class="searchIssueAlert">${esc(am)}</p></div>`).join('\n        ')}
      </div>
      <div class="diyWrap tableScrollWrap" style="margin-top:1.25rem">
        <table class="compareTable responsiveTable">
          <thead><tr><th>Do not automate</th><th>Why</th><th>Instead</th></tr></thead>
          <tbody>
            ${DO_NOT_AUTOMATE.map(([s, w, a]) => `<tr><td data-label="Do not automate">${esc(s)}</td><td data-label="Why">${esc(w)}</td><td data-label="Instead" class="diyHighlight">${esc(a)}</td></tr>`).join('\n            ')}
          </tbody>
        </table>
      </div>
      <div class="keyInsight keyInsightWarn">
        <p><strong>Key insight:</strong> Never auto-rotate <code>master_key</code> or delete Postgres in prod. The blast radius exceeds the outage.</p>
      </div>

      <h2 class="sectionHead" id="setup-steps">Five steps with AlertMend</h2>
      <p class="setupTimeEstimate">⏱ Total setup time: ~15 minutes for gateway + backend checks with auto-restart</p>
      <div class="amFlow">
        ${SETUP_STEPS.map(([t, time, b], i) => `<div class="amStep"><div class="amStepHead"><span class="amStepNum">${i + 1}</span><span class="amStepTime">${esc(time)}</span></div><h3 class="amStepTitle">${esc(t)}</h3><p class="amStepBody">${esc(b)}</p></div>`).join('\n        ')}
      </div>

      <h2 class="sectionHead">Related deep dives</h2>
      <p class="bodyText">This post is the LiteLLM monitoring playbook. These guides go deeper on adjacent layers:</p>
      <div class="hubLinks">
        ${HUB_LINKS.map(([href, t, d]) => `<a href="${href}" class="hubLinkCard"><p class="hubLinkTitle">${esc(t)}</p><p class="hubLinkDesc">${esc(d)}</p></a>`).join('\n        ')}
      </div>

      <h2 class="sectionHead" id="faq">FAQ</h2>
      <div class="faqList">
        ${FAQ.map(([q, a], i) => `<div class="faqItem"><button type="button" class="faqQuestion" data-faq-toggle aria-expanded="${i === 0 ? 'true' : 'false'}">${esc(q)}<svg class="faqChevron${i === 0 ? ' faqChevronOpen' : ''}" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 9l6 6 6-6"/></svg></button><div class="faqAnswer${i === 0 ? '' : ' hidden'}">${esc(a)}</div></div>`).join('\n        ')}
      </div>

      <div class="ctaBand">
        <div class="ctaBandTitle">Your liveness check passed. Your users still got 502s.</div>
        <p class="ctaBandSub">Two-layer monitoring, coordinated auto-restart, verify-before-page. The next outage might be a provider key rotation or a scale-up that hits only new nodes. Catch it in 52 seconds, not 40 minutes.</p>
        <div class="ctaBtnRow">
          <a href="${postSignupUrl}" class="ctaBtn">Start with auto-remediation →</a>
          <a href="${postCalendlyUrl}" class="ctaBtnSecondary" target="_blank" rel="noopener noreferrer">Talk to an expert</a>
        </div>
      </div>
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
