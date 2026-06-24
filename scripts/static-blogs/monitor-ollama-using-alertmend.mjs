/**
 * Code-generated rich blog: Ollama production monitoring post.
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
  const heroImage = `${assetsBase}/ollama-hero.svg`

  const meta = parseFrontmatter(slug)
  const title = meta.title || 'How to Monitor Ollama in Production'
  const excerpt =
    meta.excerpt ||
    'Monitor Ollama in production: /api/tags and /api/ps checks, OOMKilled auto-restart, verify-before-page Slack alerts. Phase 1 without Prometheus.'
  const date = meta.date || '2026-06-24'
  const category = meta.category || 'AIOps'
  const author = meta.author || 'AlertMend Team'
  const keywords =
    meta.keywords ||
    'how to monitor ollama in production, ollama kubernetes monitoring, ollama health check, ollama oomkilled, ollama auto restart kubernetes, monitor ollama production, ollama uptime, AlertMend'

  const relatedPosts = getRelatedPosts(slug, category)
  const postSignupUrl = signupUrl(slug, 'blog-ollama')
  const postCalendlyUrl = calendlyUrl(slug)

  const PAIN_SCENARIOS = [
    [
      'Friday, 3:42pm',
      'Embeddings returned 500. The vector index aged out.',
      'Ollama /api/tags still returned 200 while /api/generate timed out on every batch. The RAG worker retried silently. Grafana pod metrics looked fine because the process never exited.',
    ],
    [
      'After a GPU node reboot',
      'Chat timed out for 18 minutes.',
      'A 40GB model reloaded from PVC. Readiness passed on process up, not model loaded. Users hit 504 on every prompt while Open WebUI looked fine.',
    ],
    [
      'OOM loop, exit 137',
      'Three restarts before anyone opened Slack.',
      'VRAM pressure under concurrent load. Kubernetes killed the pod. Each cold start evicted the model again. Manual kubectl delete pod was the only playbook.',
    ],
    [
      'Ingress said 502',
      'Apps called the proxy URL, not localhost:11434.',
      'In-cluster curl to the Service worked. External URL through nginx failed during pod rollout. No monitor hit the same hostname users use.',
    ],
  ]

  const HEALTH_ENDPOINTS = [
    ['/', 'Liveness probe', 'Process responding. No model load required.', 'Restart container if wedged. Keep this shallow.'],
    ['/api/tags', 'Readiness + external monitor', 'Lists downloaded models. Fast, no inference cost.', 'Wait for primary model name before traffic. Alert if unreachable 2x.'],
    ['/api/ps', 'VRAM diagnostics', 'Shows models loaded in memory now. Catches eviction under load.', 'Warn when expected model missing from ps but still in tags.'],
    ['/api/generate', 'Inference smoke', 'Tiny prompt, num_predict=1. Catches hung GPU or queue stalls.', 'Alert when tags pass but generate times out.'],
    ['Public inference URL', 'External monitor', 'Same hostname, TLS, and path your apps use.', 'Page when users cannot reach inference, not only in-cluster.'],
  ]

  const OLLAMA_NATIVE = [
    ['OLLAMA_KEEP_ALIVE', 'Models unload after idle timeout. Next request pays cold-start latency that looks like an outage.', 'Set keep_alive to match traffic (e.g. -1 or 30m). AlertMend latency baseline alerts catch spikes before users complain.'],
    ['/api/ps vs /api/tags', 'tags lists installed models on disk. ps lists what is loaded in VRAM right now.', 'In AlertMend: optional check script asserts your model appears in ps during business hours.'],
    ['Model in tags JSON', 'Readiness should confirm llama3.2 (or your model) is present, not just HTTP 200.', 'In AlertMend: URL check body assertion or exec probe with jq before marking healthy.'],
  ]

  const THRESHOLDS = [
    ['API down paging', '2 consecutive /api/tags failures from the same check path within 60s', 'Single blip during model swap is not an outage'],
    ['Inference latency', 'sustained p99 > max(baseline p99 x 1.5, baseline p99 + 2 sigma) for 10 min', 'Recompute baseline weekly from off-peak traffic'],
    ['Model cold start grace', 'Suppress alerts for initialDelaySeconds + 30s after pod Ready', 'Large models on fresh PVC often need 60-120s before /api/tags is reliable'],
    ['OOM auto-fix', 'Exit 137 or OOMKilled + URL check still failing after 1 restart attempt', 'Restart once idempotently. Escalate if OOM repeats within 15 min'],
    ['Open WebUI split', 'WebUI /health 200 AND Ollama /api/tags fail for 2 checks', 'UI can load while backend inference is broken'],
  ]

  const REMEDIATION_FLOW = [
    ['/api/tags fails', 'External check: connection refused x2', false, false],
    ['Correlate', 'AlertMend: OOMKilled exit 137, pod NotReady', false, true],
    ['Auto-fix', 'Rollout restart deployment/ollama', false, true],
    ['Verify', 'Re-probe /api/tags: 200, model listed', true, false],
    ['Notify', 'Slack: auto-resolved. No page.', true, false],
  ]

  const SAFE_AUTOMATE = [
    ['OOMKilled (exit 137)', 'VRAM or container memory limit exceeded', 'In AlertMend: OOM runbook restarts the Deployment, re-probes /api/tags twice, posts model and node context to Slack.'],
    ['CrashLoopBackOff', 'Bad env, missing model, probe too aggressive', 'In AlertMend: attach restart runbook with deploy grace; rollback suggestion in Slack if crash started after rollout.'],
    ['502 / 504 from proxy', 'Pod restarting, upstream timeout', 'In AlertMend: URL check on public hostname triggers restart; suppress alerts during known deploy window.'],
    ['Model evicted under load', 'Cold start on next request', 'In AlertMend: latency baseline alert plus optional /api/ps assertion before auto-restart.'],
    ['GPU node NotReady', 'Node drain or driver glitch', 'In AlertMend: correlate node event with failed inference URL check, restart pod after node recovers.'],
  ]

  const DIFFERENTIATION = [
    ['Deploy suppression', 'A cron restart during rollout makes outages worse.', 'AlertMend pauses runbooks during active rollouts and resumes checks after grace.'],
    ['Correlated incidents', 'Uptime Robot sees 502. kubectl sees OOMKilled. Two tools, no story.', 'AlertMend opens one Slack thread with URL failure plus exit 137 context.'],
    ['Verify before page', 'Scripts restart and assume success. On-call still wakes up.', 'AlertMend re-probes /api/tags twice. Pages only if verification fails.'],
    ['AI incident summary', 'Raw pod events in Slack at 2am help nobody.', 'AlertMend posts plain-language root cause and what the runbook did.'],
  ]

  const DO_NOT_AUTOMATE = [
    ['Delete model PVC', 'Data loss, hours to re-pull', 'Page on-call with disk and model inventory'],
    ['Change quantization at runtime', 'Wrong model behavior', 'Human approval + staged rollout'],
    ['Multi-tenant model purge', 'Cross-team impact', 'Coordinate manually'],
    ['Cluster-wide GPU drain', 'Blast radius across workloads', 'Runbook with maintenance window'],
  ]

  const SETUP_STEPS = [
    ['Connect cluster or host', 'Install the AlertMend agent. Ollama pod events, OOMKilled, and restart history appear without Prometheus wiring.'],
    ['Layer health checks', '/api/tags for liveness, optional /api/generate smoke, and the public URL your apps call through Ingress.'],
    ['Set thresholds', 'Model-load grace after deploy. Baseline-relative latency. Split Open WebUI vs Ollama backend checks.'],
    ['Attach idempotent runbooks', 'Restart Deployment or StatefulSet. Safe to run twice. Include deploy suppression window.'],
    ['Verify then notify', 'Re-probe /api/tags twice. Slack on success. Page only if verification fails after auto-fix.'],
  ]

  const HUB_LINKS = [
    ['/blog/vibe-coded-app-vm-observability', 'Vibe-coded app VM observability', 'Self-hosted LLM stacks on a single GPU VM'],
    ['/blog/debugging-kubernetes-oomkilled-exit-code-137-causes-and-solutions', 'OOMKilled exit 137', 'Memory limits, eviction, and restart playbooks'],
    ['/blog/kubernetes-502-bad-gateway-error-fix', 'Kubernetes 502 Bad Gateway', 'Ingress upstream errors during Ollama rollouts'],
    ['/blog/monitor-langfuse-using-alertmend', 'Monitor Langfuse', 'LLM tracing uptime alongside inference'],
    ['/blog/oomkilled-in-kubernetes', 'OOMKilled in Kubernetes', 'Pod memory pressure fundamentals'],
    ['/blog/docker-container-monitoring-best-practices', 'Docker container monitoring', 'Single-host Ollama and Compose layouts'],
  ]

  const DEPLOY_MODES = [
    ['docker', 'Docker / Compose', 'Single host'],
    ['kubernetes', 'Kubernetes', 'Production K8s'],
    ['systemd', 'systemd on VM', 'Bare metal or VPS'],
    ['gpu', 'GPU scheduling', 'NVIDIA on K8s'],
    ['openwebui', 'Open WebUI stack', 'Chat + Ollama'],
  ]

  const FAQ = [
    [
      'How do I monitor Ollama in production?',
      'Connect your cluster or host in AlertMend, add URL checks on /api/tags and your public inference endpoint, and route alerts to Slack. AlertMend watches OOMKilled events, failed health checks, and pod crashes depending on how you deploy Ollama.',
    ],
    [
      'What is the best Ollama health check endpoint?',
      'Use GET /api/tags on port 11434 for liveness: it confirms the API is up and lists loaded models. For readiness after deploy, wait until your primary model appears in the response. Add a tiny POST /api/generate smoke test when tags alone are not enough.',
    ],
    [
      'How do I monitor Ollama on Kubernetes?',
      'Install the AlertMend agent, probe /api/tags through the same Ingress or Service your apps use, and enable auto-restart on the Ollama Deployment. Set initialDelaySeconds long enough for model load, often 60-120 seconds on a fresh PVC.',
    ],
    [
      'Why does Ollama keep getting OOMKilled?',
      'Model size plus concurrent requests can exceed pod memory or GPU VRAM limits. AlertMend alerts your team and can restart pods automatically. If it keeps recurring, reduce num_parallel, use a smaller quantization, or add GPU replicas.',
    ],
    [
      'Do I need Prometheus to monitor Ollama?',
      'Not to start. Ollama does not ship a native Prometheus /metrics endpoint. Teams add a sidecar exporter that polls /api/ps and /api/tags. AlertMend covers phase one: URL checks, OOMKilled alerts, and auto-restart. Add Prometheus and Grafana when you need VRAM dashboards and token-level telemetry at scale.',
    ],
    [
      'How do I know if Ollama is down?',
      'AlertMend treats Ollama as down when health checks fail, inference requests error, or pods crash repeatedly, not when /api/tags passes but /api/generate still times out.',
    ],
    [
      'Should I auto-restart Ollama when it OOMs?',
      'Yes for availability: enable AlertMend restart runbooks so the pod comes back after transient memory pressure. If OOM repeats within 15 minutes, fix sizing instead of only restarting.',
    ],
    [
      'How do I monitor Ollama behind Open WebUI?',
      'Add a URL check on Open WebUI /health for the UI and a separate check on the Ollama /api/tags endpoint your stack uses. Alert when the UI is up but Ollama checks fail.',
    ],
  ]

  const OLLAMA_PROBE_YAML = `# Liveness: process only (never check model load here)
livenessProbe:
  httpGet:
    path: /
    port: 11434
  periodSeconds: 20
  timeoutSeconds: 5
  failureThreshold: 3
# Readiness: primary model must appear in /api/tags
readinessProbe:
  exec:
    command:
      - sh
      - -c
      - curl -sf http://localhost:11434/api/tags | jq -e '.models[] | select(.name | startswith("llama3.2"))'
  initialDelaySeconds: 90
  periodSeconds: 10
  timeoutSeconds: 5
  failureThreshold: 3
startupProbe:
  httpGet:
    path: /api/tags
    port: 11434
  failureThreshold: 30
  periodSeconds: 10
env:
  - name: OLLAMA_KEEP_ALIVE
    value: "30m"
resources:
  limits:
    memory: "16Gi"
    nvidia.com/gpu: "1"`

  const EXPORTER_SNIPPET = `# Phase 2: Ollama has no native /metrics. Add a sidecar exporter.
- name: ollama-exporter
  image: ghcr.io/maravexa/ollama-exporter:latest
  ports:
    - containerPort: 8000
  env:
    - name: OLLAMA_BASE_URL
      value: "http://localhost:11434"
# Prometheus scrapes :8000/metrics (ollama_up, model VRAM, load events)`

  const CURL_CHECKS = `# Liveness: process up
curl -sf http://ollama:11434/

# Readiness: model listed
curl -sf http://ollama:11434/api/tags | jq '.models[].name'

# VRAM: what is loaded right now (not just on disk)
curl -sf http://ollama:11434/api/ps | jq '.models[] | {name, size_vram}'

# Inference smoke (1 token)
curl -sf http://ollama:11434/api/generate -d '{
  "model": "llama3.2",
  "prompt": "ping",
  "stream": false,
  "options": { "num_predict": 1 }
}' | jq '.response'

# Through the same URL users hit (TLS + ingress)
curl -sf https://inference.example.com/api/tags`

  const FAILURE_TABS = [
    ['oom', 'OOMKilled', 'Exit 137'],
    ['timeout', 'Generate timeout', 'Tags OK, inference hung'],
    ['proxy502', '502 / 504', 'Proxy errors'],
    ['crashloop', 'CrashLoopBackOff', 'Probe or config'],
  ]

  const renderPainScenarios = PAIN_SCENARIOS.map(
    ([when, t, body]) =>
      `<div class="fearScenario"><p class="fearScenarioWhen">${esc(when)}</p><h3 class="fearScenarioTitle">${esc(t)}</h3><p class="fearScenarioBody">${esc(body)}</p></div>`
  ).join('\n        ')

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
    name: 'Monitor Ollama in production with AlertMend',
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
        <div class="heroBrands">
          <a href="https://ollama.com/" target="_blank" rel="noopener noreferrer">
            <img src="${assetsBase}/ollama-logo.svg" alt="Ollama" class="brandLogo" width="142" height="40">
          </a>
          <span class="heroBrandSep" aria-hidden="true">×</span>
          <a href="/" class="heroAmLink">
            <img src="/logos/alertmend-logo.svg" alt="AlertMend" class="heroAmLogo" width="128" height="28">
          </a>
        </div>
        <p class="heroGuideLabel">Production runbook · Ollama uptime</p>
        <h2 class="fearHeadline">Ollama was down. Your RAG pipeline kept calling it anyway.</h2>
        <p class="fearLead">Most teams <strong>install</strong> Ollama. Few teams <strong>monitor the URL their apps hit</strong>, verify inference end-to-end, or auto-restart after OOMKilled. The result: silent embedding failures, chat timeouts, and the same kubectl delete pod ritual every Friday.</p>
        <div class="fearScenarioGrid">
        ${renderPainScenarios}
        </div>
        <p class="fearBridge"><strong>Checking /api/tags once is not production monitoring.</strong> Layer probes, grace periods for model load, and idempotent restart runbooks. Page only when auto-fix verification fails.</p>
      </section>

      <section class="heroBand heroBandCompact">
        <div class="heroAudience">
          <h2 class="heroAudienceTitle">You're in the right place if…</h2>
          <ul class="heroAudienceList">
            <li>You run Ollama on Kubernetes, a GPU VM, or Docker behind Open WebUI or an internal chat API</li>
            <li>Nobody pages you when inference stops, models get evicted, or exit 137 loops start</li>
            <li>You want health checks, Slack alerts, and auto-restart without building Prometheus and Grafana first</li>
          </ul>
        </div>
        <p class="seoTldr"><strong>TL;DR:</strong> Monitor <strong>/api/tags</strong> and your <strong>public inference URL</strong>. When checks fail twice, run an <strong>idempotent pod restart</strong>. <strong>Re-probe twice.</strong> Page on-call only if verification fails.</p>
      </section>

      <h2 class="sectionHead">Ollama health endpoints: what to probe</h2>
      <p class="bodyText">The mistake: wire liveness, readiness, and your external monitor all to <code>/api/tags</code> with no grace period, then wonder why large models flap on every deploy. Split checks by purpose and hit the same hostname your apps use.</p>
      <div class="diyWrap">
        <table class="compareTable">
          <thead><tr><th>Path</th><th>Used by</th><th>Checks</th><th>On failure</th></tr></thead>
          <tbody>
            ${HEALTH_ENDPOINTS.map(([p, u, c, f]) => `<tr><td><code>${esc(p)}</code></td><td>${esc(u)}</td><td>${esc(c)}</td><td class="diyHighlight">${esc(f)}</td></tr>`).join('\n            ')}
          </tbody>
        </table>
      </div>
      <pre class="codeBlock"><code>${esc(CURL_CHECKS)}</code></pre>
      <p class="bodyText">Kubernetes probe wiring for Ollama (copy into your Deployment):</p>
      <pre class="codeBlock"><code>${esc(OLLAMA_PROBE_YAML)}</code></pre>
      <p class="citeRow">Reference: <a href="https://github.com/ollama/ollama/blob/main/docs/api.md" target="_blank" rel="noopener noreferrer">Ollama API docs</a> · <a href="https://kubernetes.io/docs/concepts/configuration/liveness-readiness-startup-probes/" target="_blank" rel="noopener noreferrer">Kubernetes probe docs</a></p>

      <h2 class="sectionHead">Ollama-native signals: /api/ps and keep_alive</h2>
      <p class="bodyText">Generic pod monitors miss the failure modes that only show up in Ollama's API. These three settings separate "process is up" from "inference is ready for production traffic."</p>
      <div class="diyWrap">
        <table class="compareTable">
          <thead><tr><th>Signal</th><th>What goes wrong</th><th>In AlertMend</th></tr></thead>
          <tbody>
            ${OLLAMA_NATIVE.map(([s, w, am]) => `<tr><td><code>${esc(s)}</code></td><td>${esc(w)}</td><td class="diyHighlight">${esc(am)}</td></tr>`).join('\n            ')}
          </tbody>
        </table>
      </div>

      <h2 class="sectionHead">Phase 2: when to add Prometheus</h2>
      <p class="bodyText">Start with URL checks and auto-restart in AlertMend. Add Prometheus when you need historical VRAM graphs, token throughput, and custom SLO dashboards. Ollama requires an exporter sidecar because the API returns JSON, not Prometheus text format.</p>
      <pre class="codeBlock"><code>${esc(EXPORTER_SNIPPET)}</code></pre>
      <p class="bodyText">AlertMend stays your incident and auto-fix layer. Prometheus stays your capacity planning layer. Most teams run both once inference is business-critical.</p>

      <div class="proofBand">
        <p class="proofStat"><span class="proofStatNum">~52s</span> typical AlertMend recovery</p>
        <p class="proofBody">From first failed <code>/api/tags</code> check to verified 200 with model loaded. One AI startup on cloud servers saw <strong>90%+ of recurring failures remediate themselves</strong> after wiring alerts and auto-restart. <a href="/case-studies">Read the case study</a>.</p>
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
          <div class="amConsoleRow"><span class="amConsoleMuted">ollama-prod</span><span>-</span><span>deployment/ollama</span><span class="amStatusWarn">1 restart (1h)</span></div>
          <p class="amConsoleHint">Ollama pod events and OOMKilled history appear without Prometheus wiring.</p>
        </div>
        <div class="amConsoleBody hidden" id="am-screen-check" role="tabpanel">
          <p class="amConsoleLabel">URL check · external</p>
          <p class="amConsoleUrl">https://inference.example.com/api/tags</p>
          <div class="amConsoleCheckRow"><span>Interval</span><span>60s</span></div>
          <div class="amConsoleCheckRow"><span>Fail threshold</span><span>2 consecutive</span></div>
          <div class="amConsoleCheckRow"><span>Body assert</span><span>contains "llama3.2"</span></div>
          <div class="amConsoleCheckRow"><span>Deploy grace</span><span>120s after rollout</span></div>
          <p class="amConsoleHint">Same hostname and TLS your chat and RAG apps use.</p>
        </div>
        <div class="amConsoleBody hidden" id="am-screen-runbook" role="tabpanel">
          <p class="amConsoleLabel">Runbook · ollama-restart</p>
          <div class="amRunbookStep"><span class="amRunbookNum">1</span><span>Rollout restart deployment/ollama</span></div>
          <div class="amRunbookStep"><span class="amRunbookNum">2</span><span>Wait for rollout status (180s max)</span></div>
          <div class="amRunbookStep"><span class="amRunbookNum">3</span><span>Re-probe URL check twice</span></div>
          <div class="amRunbookStep amRunbookStepOk"><span class="amRunbookNum">✓</span><span>Slack #incidents if verified · page if not</span></div>
          <p class="amConsoleHint">Idempotent: safe to run twice. Suppressed during active deploys.</p>
        </div>
      </div>

      <h2 class="sectionHead">Why not kubectl plus a cron job?</h2>
      <p class="bodyText">A bash restart script fixes one symptom. It does not correlate URL failure with OOMKilled, suppress during deploys, or verify recovery before paging.</p>
      <div class="diffGrid">
        ${DIFFERENTIATION.map(([t, problem, am]) => `<div class="diffCard"><h3 class="diffCardTitle">${esc(t)}</h3><p class="diffCardProblem">${esc(problem)}</p><p class="diffCardAm"><strong>In AlertMend:</strong> ${esc(am)}</p></div>`).join('\n        ')}
      </div>

      <h2 class="sectionHead">Live monitor mock</h2>
      <p class="bodyText">Click a failure mode to see kubectl commands. Hit <strong>Simulate recovery</strong> after auto-fix succeeds.</p>
      <div class="monitorMock" aria-label="Ollama URL monitor dashboard mock">
        <div class="monitorMockHead">
          <span class="monitorMockLabel">External check · same URL as your apps</span>
        </div>
        <div class="monitorMockUrl" id="mock-url">https://inference.example.com/api/tags</div>
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
      <div class="modeGrid" role="tablist" aria-label="Ollama failure modes">
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

      <h2 class="sectionHead">Threshold engineering for model load</h2>
      <p class="bodyText">A fixed 30s probe interval pages you during normal cold starts. A fixed 3s latency threshold pages you on large models that are healthy. Use baselines and deploy grace.</p>
      <div class="thresholdFormula">alert when sustained_p99(10m) &gt; max(baseline_p99 × 1.5, baseline_p95 + 2σ)
  AND model_load_grace_elapsed &gt; initialDelaySeconds + 30s</div>
      <div class="diyWrap">
        <table class="compareTable">
          <thead><tr><th>Rule</th><th>Threshold</th><th>Why</th></tr></thead>
          <tbody>
            ${THRESHOLDS.map(([r, t, w]) => `<tr><td>${esc(r)}</td><td class="diyHighlight">${esc(t)}</td><td>${esc(w)}</td></tr>`).join('\n            ')}
          </tbody>
        </table>
      </div>

      <h2 class="sectionHead">How does AlertMend recover Ollama automatically?</h2>
      <p class="sectionSub">Sequence view: health check fails, Slack incident opens, restart runbook runs, inference resumes.</p>
      <figure class="flowDiagram">
        <img src="${assetsBase}/ollama-alertmend-recovery-flow.svg" alt="Sequence diagram: Ollama health check failure, AlertMend detects the failure, alerts Slack, runs auto-recovery runbook, and Ollama returns online" width="960" height="720" loading="lazy">
        <figcaption class="flowDiagramCaption">Normal operation, OOM or API failure, Slack alert with AI summary, runbook restart, chat and RAG traffic restored.</figcaption>
      </figure>

      <h2 class="sectionHead">AlertMend flow: detect, fix, verify, notify</h2>
      <p class="bodyText">This is what a complete Ollama monitoring loop looks like in production. No page if verification passes.</p>
      <div class="remediationFlow">
        ${renderFlow}
      </div>
      <div class="slackMock" aria-label="Slack notification example">
        <div class="slackMockChannel">#incidents</div>
        <div><span class="slackMockOk">✓ Auto-resolved</span> inference.example.com/api/tags</div>
        <div>Connection refused × 2 → rollout restart deployment/ollama → verified 200 OK (llama3.2 loaded)</div>
        <div class="slackMockMeta">Duration: 52s · No page sent · <a href="/case-studies">See case study</a></div>
      </div>

      <h2 class="sectionHead">How to monitor Ollama by deployment mode</h2>
      <p class="bodyText">Pick how you run Ollama. Each tab shows AlertMend setup steps for that layout.</p>
      <div class="modeGrid modeGridSecondary" role="tablist" aria-label="Ollama deployment modes">
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

      <h2 class="sectionHead">Safe to automate vs human required</h2>
      <div class="searchIssueGrid">
        ${SAFE_AUTOMATE.map(([sym, cause, am]) => `<div class="searchIssueCard"><h3 class="searchIssueTerm">${esc(sym)}</h3><p class="searchIssueDesc">${esc(cause)}</p><p class="searchIssueAlert">${esc(am)}</p></div>`).join('\n        ')}
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

      <h2 class="sectionHead">Related deep dives</h2>
      <p class="bodyText">This post is the Ollama monitoring playbook. These guides go deeper on adjacent failures:</p>
      <div class="hubLinks">
        ${HUB_LINKS.map(([href, t, d]) => `<a href="${href}" class="hubLinkCard"><p class="hubLinkTitle">${esc(t)}</p><p class="hubLinkDesc">${esc(d)}</p></a>`).join('\n        ')}
      </div>

      <h2 class="sectionHead">FAQ</h2>
      <div class="faqList">
        ${FAQ.map(([q, a], i) => `<div class="faqItem"><button type="button" class="faqQuestion" data-faq-toggle aria-expanded="${i === 0 ? 'true' : 'false'}">${esc(q)}<svg class="faqChevron${i === 0 ? ' faqChevronOpen' : ''}" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 9l6 6 6-6"/></svg></button><div class="faqAnswer${i === 0 ? '' : ' hidden'}">${esc(a)}</div></div>`).join('\n        ')}
      </div>

      <div class="ctaBand">
        <div class="ctaBandTitle">Monitor Ollama in production without a DIY observability stack</div>
        <p class="ctaBandSub">Typical recovery in under a minute: layered checks, OOMKilled auto-restart, verify-before-page. Start free or talk to an engineer.</p>
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
