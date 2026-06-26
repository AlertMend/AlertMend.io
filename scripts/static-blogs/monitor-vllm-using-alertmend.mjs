/**
 * Code-generated rich blog: vLLM production monitoring post.
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

function buildVllmHeader(title, author, authorBio, authorPhoto, authorLinkedIn, date, category) {
  return `
    <header class="article-header">
      <h1>${esc(title)}</h1>
      <div class="author-info author-infoRich">
        <img src="${authorPhoto}" alt="${esc(author)}" class="author-photo" width="40" height="40" loading="lazy">
        <div>
          <div class="author-name"><a href="${authorLinkedIn}" target="_blank" rel="noopener noreferrer">${esc(author)}</a></div>
          <p class="author-bio">${esc(authorBio)}</p>
          <div class="author-meta">${esc(date)} · ${category}</div>
        </div>
      </div>
      <span class="category-tag">${esc(category)}</span>
    </header>`
}

function codeBlock(filename, lang, code) {
  return `<div class="codeBlockWrap">
  <div class="codeBlockHeader"><span class="codeBlockFile">${esc(filename)}</span><span class="codeBlockLang">${esc(lang)}</span></div>
  <pre class="codeBlock"><code>${esc(code)}</code></pre>
</div>`
}

function renderRelatedLink(link) {
  if (!link) return ''
  return `<a href="${esc(link.href)}" class="runbookDeepDive">
    <span class="runbookDeepDiveEyebrow">Deep dive</span>
    <span class="runbookDeepDiveTitle">${esc(link.title)}</span>
    ${link.desc ? `<span class="runbookDeepDiveDesc">${esc(link.desc)}</span>` : ''}
    <span class="runbookDeepDiveArrow" aria-hidden="true">→</span>
  </a>`
}

function renderFailurePanel(id, data, isFirst) {
  const hidden = isFirst ? '' : ' hidden'
  const footerExtra = data.relatedLink
    ? renderRelatedLink(data.relatedLink)
    : data.tip
      ? `<div class="stepTip"><span>${esc(data.tip)}</span></div>`
      : ''
  return `<div class="failurePanel${hidden}" id="failure-panel-${id}" role="tabpanel" data-failure-panel="${id}">
        <p class="modePlaybookTitle">${esc(data.title)}</p>
        <p class="modePlaybookSummary">${esc(data.summary)}</p>
        <p class="symptomsLine"><strong>Symptoms:</strong> ${esc(data.symptoms)}</p>
        ${codeBlock(data.filename, 'bash', data.code)}
        <div class="runbookOutcome">
          <p class="autofixBadge">Safe auto-fix: ${esc(data.autoFix)}</p>
          <p class="escalationBadge">${esc(data.escalation)}</p>
          ${footerExtra}
        </div>
      </div>`
}

function renderAutomationMatrixRow([scenario, action, safe, escalation]) {
  const safeCell = safe
    ? '<span class="matrixSafe">✅ Yes</span>'
    : '<span class="matrixNo">❌ No</span>'
  const rowClass = safe ? '' : ' class="matrixRowDanger"'
  const scenarioClass = safe ? '' : ' class="matrixScenarioDanger"'
  return `<tr${rowClass}><td data-label="Scenario"${scenarioClass}>${esc(scenario)}</td><td data-label="Auto-fix action">${esc(action)}</td><td data-label="Safe?">${safeCell}</td><td data-label="Escalation trigger">${esc(escalation)}</td></tr>`
}

export async function build(slug) {
  const assetsBase = `/assets/${slug}`
  const canonical = `${SITE_URL}/blog/${slug}`
  const heroImage = `${assetsBase}/vllm-hero.svg`

  const meta = parseFrontmatter(slug)
  const title = meta.title || 'How to Monitor vLLM in Production'
  const excerpt =
    meta.excerpt ||
    'vLLM /health returns 200 while your chat API returns 503. Four-layer probes, copy-paste Kubernetes YAML, and the threshold formula that stops silent outages.'
  const ogDescription = excerpt
  const date = meta.date || '2026-06-24'
  const category = meta.category || 'AIOps'
  const author = meta.author || 'Arvind Rajpurohit'
  const authorBio =
    'Co-founder & CEO, AlertMend. Kubestronaut; previously DevOps Lead at Roambee and Customer Success Engineer at Shoreline.io (NVIDIA). Has debugged more OOMKilled vLLM pods than he\u2019d like to admit.'
  const authorPhoto = '/logos/arvind.jpeg'
  const authorLinkedIn = 'https://www.linkedin.com/in/arvind-rajpurohit-4a332523/'
  const keywords =
    meta.keywords ||
    'how to monitor vllm in production, vllm kubernetes health check, vllm startupProbe, vllm oomkilled, vllm auto restart, monitor vllm production, vllm uptime, AlertMend'

  const relatedPosts = getRelatedPosts(slug, category)
  const postSignupUrl = signupUrl(slug, 'blog-vllm')
  const postCalendlyUrl = calendlyUrl(slug)

  const PAIN_SCENARIOS = [
    [
      'Monday deploy, 9:14am',
      'Chat API returned 503 for 22 minutes.',
      'vLLM /health returned 200 while the model was still loading weights into GPU memory. Ingress sent traffic early. Every request queued until timeout.',
    ],
    [
      'Traffic spike, 2:07pm',
      'OOMKilled loop, exit 137.',
      'KV cache grew past the pod memory limit under concurrent long-context requests. Kubernetes restarted the pod. Each cold start re-OOMed before traffic stabilized.',
    ],
    [
      'Probe misconfiguration',
      'CrashLoopBackOff after Helm upgrade.',
      'Readiness hit /v1/models before startupProbe finished. failureThreshold was 3 on a 70B model that needs 4+ minutes on first boot.',
    ],
    [
      'Grafana looked green',
      'Users saw empty completions.',
      '/metrics showed vllm:num_requests_running at zero while HTTP 200 passed. Ray worker died in multi-GPU mode. No external URL check on the OpenAI-compatible path.',
    ],
  ]

  const HEALTH_ENDPOINTS = [
    ['/health', 'Liveness probe', 'Returns {"status":"ok"} when API process is up. No inference required.', 'Restart if wedged. Keep shallow, do not require model load here.'],
    ['/v1/models', 'Readiness + external monitor', 'OpenAI-compatible model list. Confirms engine registered the model.', 'Wait until your model id appears before marking Ready or routing traffic.'],
    ['/v1/chat/completions', 'Inference smoke', 'Tiny max_tokens=1 request. Catches hung scheduler or GPU deadlock.', 'Alert when /health passes but chat smoke times out.'],
    ['/metrics', 'Prometheus (phase 2)', 'Native Prometheus text: queue depth, KV cache, GPU util.', 'Use for capacity dashboards. Not a substitute for external URL checks.'],
    ['Public inference URL', 'External monitor', 'Same hostname, TLS, and /v1 path your apps call.', 'Page when users cannot complete requests, not only in-cluster.'],
  ]

  const VLLM_NATIVE = [
    ['--gpu-memory-utilization', 'Set too high and KV cache OOMs under real traffic even when the model loads in staging.', 'Start at 0.85–0.90. AlertMend OOM runbook restarts once; escalate if exit 137 repeats within 15 min.'],
    ['startupProbe vs readiness', 'Readiness on /v1/models before weights load causes CrashLoopBackOff or flapping Ready.', 'Use startupProbe on /health with failureThreshold 30–60 for large models. Readiness only after model id appears.'],
    ['--max-model-len', 'Longer context multiplies KV memory. Pod passes health then OOMs on first long prompt.', 'In AlertMend: correlate exit 137 with recent traffic spike; alert on sustained queue depth from /metrics when wired.'],
  ]

  const THRESHOLDS = [
    ['API down paging', '2 consecutive /v1/models failures from external check within 60s', 'Single blip during rolling update is not an outage'],
    ['Inference latency', 'sustained p99 > max(baseline p99 x 1.5, baseline p99 + 2 sigma) for 10 min', 'Recompute baseline weekly from off-peak traffic'],
    ['Model load grace', 'Suppress alerts for startupProbe period + 60s after pod Ready', '70B models on cold PVC often need 3–6 min before /v1/models is reliable'],
    ['OOM auto-fix', 'Exit 137 or OOMKilled + URL check still failing after 1 restart attempt', 'Restart once idempotently. Escalate if OOM repeats within 15 min'],
    ['Deploy correlation', 'CrashLoopBackOff started within 10 min of rollout', 'AlertMend suggests rollback before blind restart loops'],
  ]

  const REMEDIATION_FLOW = [
    ['/v1/models fails', 'External check: timeout or 503 x2', false, false],
    ['Correlate', 'AlertMend: OOMKilled exit 137, probe failure, or post-deploy crash', false, true],
    ['Auto-fix', 'Rollout restart deployment/vllm (or undo if deploy-correlated)', false, true],
    ['Verify', 'Re-probe /v1/models: 200, model id listed', true, false],
    ['Notify', 'Slack: auto-resolved. No page.', true, false],
  ]

  const AUTOMATION_MATRIX = [
    ['OOMKilled (exit 137)', 'Rollout restart deployment/vllm; re-probe /v1/models twice', true, 'OOM repeats within 15 min — fix memory limits and max-model-len'],
    ['CrashLoopBackOff after deploy', 'kubectl rollout undo if crash started within 10 min of rollout', true, 'Crash persists after rollback — bad image, missing env, GPU driver issue'],
    ['502 / 503 from Ingress', 'Rollout restart if pod in restart loop; extend ingress proxy-read-timeout to ≥300s', true, '503 persists after pod Ready and in-cluster /v1/models returns 200'],
    ['Hung scheduler', 'Restart pod when chat smoke fails 2× while /health passes', true, 'Smoke fails after 2 restarts — inspect Ray workers or GPU deadlock'],
    ['GPU node NotReady', 'Restart vLLM after node recovers to Ready', true, 'Node stays NotReady >30 min — escalate to infra team'],
    ['Change --max-model-len in prod', 'Human approval + staged rollout', false, 'Silent quality and memory behavior change'],
    ['Delete model weights PVC', 'Page on-call with disk inventory', false, 'Hours to re-download weights'],
    ['Scale GPU node pool blindly', 'Capacity review with finance', false, 'Cost and quota risk'],
    ['Multi-replica tensor parallel resize', 'Maintenance window + engineer', false, 'Requires coordinated rollout'],
  ]

  const DIY_MONITORING = [
    ['Deploy suppression', 'AlertManager has no rollout state. A restart script firing during deploy makes GPU OOM loops worse.', 'AlertMend pauses runbooks during active rollouts and resumes after grace.'],
    ['Correlated context', 'Prometheus sees queue depth spike. kubectl sees OOMKilled. Two tools, no unified story.', 'AlertMend opens one Slack thread with URL failure plus exit 137 context.'],
    ['Verify before page', 'Scripts restart and assume success. On-call still wakes up.', 'AlertMend re-probes /v1/models twice. Pages only if verification fails.'],
  ]

  const FAILURE_RUNBOOKS = {
    oom: {
      title: 'OOMKilled (exit 137)',
      filename: 'diagnose-oom.sh',
      summary:
        'Kubernetes killed the vLLM container when weights plus KV cache exceeded memory limits. The pod restarts but OOMs again under the same traffic pattern.',
      symptoms: 'Pod Restarting; Last State Terminated Reason OOMKilled, Exit Code 137',
      code: `# Diagnose
kubectl describe pod -l app=vllm -n inference | grep -A8 "Last State"
kubectl top pod -l app=vllm -n inference

# Auto-fix
kubectl rollout restart deployment/vllm -n inference
kubectl rollout status deployment/vllm -n inference --timeout=300s

# Verify model listed
curl -sf http://vllm.inference.svc:8000/v1/models | jq '.data[].id'`,
      autoFix: 'Rollout restart deployment/vllm; re-probe /v1/models twice',
      escalation:
        'Escalate if OOM repeats within 15 min — fix memory limits and --max-model-len instead of only restarting.',
      relatedLink: {
        href: '/blog/debugging-kubernetes-oomkilled-exit-code-137-causes-and-solutions',
        title: 'OOMKilled exit 137: causes and fixes',
        desc: 'KV cache sizing, memory limits, and when restart alone is not enough.',
      },
    },
    startup: {
      title: 'Startup probe / model load',
      filename: 'diagnose-startup.sh',
      summary:
        '/health returns 200 while weights are still loading into GPU memory. Readiness on /v1/models fails or traffic routes too early.',
      symptoms:
        'Pod status CrashLoopBackOff or Not Ready; Events show Readiness probe failed before model weights finish loading',
      code: `# Diagnose
kubectl describe pod -l app=vllm -n inference | grep -A5 "Events"
kubectl logs -l app=vllm -n inference --tail=50 | grep "model loaded"
kubectl get pod -l app=vllm -n inference -o jsonpath='{.items[*].status.containerStatuses[*].restartCount}'

# Fix probe config (apply to Deployment)
# startupProbe.failureThreshold: 60  # 10 min grace for 70B models
# readinessProbe.httpGet.path: /v1/models  # not /health

curl -sf http://vllm:8000/health
curl -sf http://vllm:8000/v1/models | jq '.data[].id'`,
      autoFix: 'Increase startupProbe.failureThreshold to 60; ensure readiness uses /v1/models not /health',
      escalation:
        'Escalate if model never appears in /v1/models after 15 min — check --max-model-len and GPU memory.',
      tip: '70B models on cold PVC often need 5–10 minutes before /v1/models is reliable.',
    },
    proxy502: {
      title: '502 / 503 from Ingress',
      filename: 'diagnose-503.sh',
      summary:
        'Users see 502/503 while the pod may be healthy internally. Ingress upstream timeout is often shorter than model load time.',
      symptoms:
        'Users see 502/503; pod may be healthy internally; ingress upstream timeout shorter than model load time',
      code: `# Diagnose
kubectl describe ingress -n inference
kubectl logs -l app=ingress-nginx -n ingress-nginx --tail=30 | grep upstream
curl -sf http://vllm.inference.svc:8000/v1/models

# In-cluster vs public
curl -v https://inference.example.com/v1/models

# Auto-fix: extend ingress timeout (example annotation)
# nginx.ingress.kubernetes.io/proxy-read-timeout: "300"

# Restart if pod is in restart loop
kubectl rollout restart deployment/vllm -n inference`,
      autoFix: 'Rollout restart if pod is in restart loop; extend ingress proxy-read-timeout annotation to ≥300s',
      escalation:
        'Escalate if 503 persists after pod shows Ready and /v1/models returns 200 in-cluster — investigate ingress config or TLS termination.',
      relatedLink: {
        href: '/blog/kubernetes-502-bad-gateway-error-fix',
        title: 'Kubernetes 502 Bad Gateway fix',
        desc: 'Ingress upstream timeout fixes during inference rollouts.',
      },
    },
    crashloop: {
      title: 'CrashLoopBackOff',
      filename: 'diagnose-crashloop.sh',
      summary:
        'Pod cycles between CrashLoopBackOff and Running; back-off delay increases with each failed restart.',
      symptoms: 'Pod cycles between CrashLoopBackOff and Running; back-off delay increases',
      code: `# Diagnose
kubectl describe pod -l app=vllm -n inference | grep -A10 "Events"
kubectl logs -l app=vllm -n inference --previous --tail=50
kubectl rollout history deployment/vllm -n inference

# Auto-fix if deploy-correlated
kubectl rollout undo deployment/vllm -n inference

# Otherwise lengthen startup probe
# startupProbe.failureThreshold: 60`,
      autoFix:
        'If crash started within 10 min of rollout: kubectl rollout undo. Otherwise increase startupProbe.failureThreshold.',
      escalation:
        'Escalate if crash persists after rollback — bad image, missing env var, or GPU driver issue.',
      tip: 'Use startupProbe with failureThreshold 60 when models load from PVC on first boot.',
    },
  }

  const SETUP_STEPS = [
    ['Connect cluster or host', 'Install the AlertMend agent. vLLM pod events, OOMKilled, and restart history appear without wiring Grafana first.'],
    ['Layer health checks', '/health for liveness, /v1/models for readiness, optional chat smoke, and the public OpenAI-compatible URL.'],
    ['Set thresholds', 'Model-load grace after deploy. Baseline-relative latency. Deploy-correlated crash detection.'],
    ['Attach idempotent runbooks', 'Restart Deployment. Safe to run twice. Include deploy suppression window.'],
    ['Verify then notify', 'Re-probe /v1/models twice. Slack on success. Page only if verification fails after auto-fix.'],
  ]

  const HUB_LINKS = [
    ['/blog/monitor-ollama-using-alertmend', 'Monitor Ollama', 'Probe configuration, memory limits, and auto-restart for Ollama. Includes migration checklist for teams moving to vLLM.'],
    ['/blog/kubernetes-crashloopbackoff-fix', 'CrashLoopBackOff fix', 'Probe misconfiguration diagnostics, startupProbe YAML, and rollback steps for post-deploy crash loops.'],
    ['/blog/debugging-kubernetes-oomkilled-exit-code-137-causes-and-solutions', 'OOMKilled exit 137', 'KV cache sizing, memory limit tuning, and when restart alone is not enough.'],
    ['/blog/kubernetes-502-bad-gateway-error-fix', 'Kubernetes 502 Bad Gateway', 'Ingress upstream timeout fixes during inference rollouts and GPU node drains.'],
    ['/blog/monitor-langfuse-using-alertmend', 'Monitor Langfuse', 'LLM tracing uptime checks and correlation with inference outages.'],
    ['/blog/503-no-healthy-upstream', '503 No Healthy Upstream', 'Service mesh endpoint drain patterns and recovery during GPU node events.'],
  ]

  const FAQ = [
    [
      'How do I monitor vLLM in production?',
      'Connect your cluster in AlertMend, add URL checks on /v1/models and your public OpenAI-compatible endpoint, and route alerts to Slack. AlertMend watches OOMKilled events, probe failures, and pod crashes depending on how you deploy vLLM.',
    ],
    [
      'What is the best vLLM health check endpoint?',
      'Use GET /health for liveness: it confirms the API process is running. For readiness, use GET /v1/models and wait until your model id appears. Add a tiny POST /v1/chat/completions smoke test when health alone is not enough.',
    ],
    [
      'How do I monitor vLLM on Kubernetes?',
      'Install the AlertMend agent, probe /v1/models through the same Ingress your apps use, and enable auto-restart on the vLLM Deployment. Use a startupProbe with a high failureThreshold (30–60) so large models can load before readiness runs.',
    ],
    [
      'Why does vLLM keep getting OOMKilled?',
      'Model weights plus KV cache for long contexts can exceed pod memory or GPU memory limits. Lower --gpu-memory-utilization, reduce --max-model-len, or raise limits. AlertMend can restart pods automatically; fix sizing if OOM repeats within 15 minutes.',
    ],
    [
      'Does vLLM expose Prometheus metrics?',
      'Yes. vLLM serves GET /metrics in Prometheus text format (queue depth, cache usage, etc.). AlertMend covers phase one: URL checks, OOMKilled alerts, and auto-restart. Add Prometheus and Grafana when you need historical GPU and throughput dashboards.',
    ],
    [
      'Why does vLLM pass /health but fail on requests?',
      'The process can be up while the model is still loading, the scheduler is wedged, or a Ray worker died. Monitor /v1/models and a lightweight chat completion smoke test, not /health alone.',
    ],
    [
      'Should I auto-restart vLLM when it OOMs?',
      'Yes for availability: enable AlertMend restart runbooks so the pod comes back after transient memory pressure. If OOM repeats within 15 minutes, fix gpu-memory-utilization and limits instead of only restarting.',
    ],
    [
      'What startupProbe settings for large vLLM models?',
      'Probe GET /health on the container port with periodSeconds 10 and failureThreshold 30–60 (5–10 minutes total). Do not point readiness at /v1/models until startupProbe has succeeded.',
    ],
  ]

  const VLLM_PROBE_YAML = `# Liveness: process only (never require model load here)
livenessProbe:
  httpGet:
    path: /health
    port: 8000
  periodSeconds: 20
  timeoutSeconds: 5
  failureThreshold: 3
# Startup: allow large model weight load (5–10 min)
startupProbe:
  httpGet:
    path: /health
    port: 8000
  failureThreshold: 60
  periodSeconds: 10
# Readiness: model must appear in /v1/models
readinessProbe:
  httpGet:
    path: /v1/models
    port: 8000
  periodSeconds: 10
  timeoutSeconds: 5
  failureThreshold: 3
args:
  - --model
  - meta-llama/Llama-3.1-8B-Instruct
  - --gpu-memory-utilization
  - "0.90"
  - --max-model-len
  - "8192"
resources:
  limits:
    memory: "32Gi"
    nvidia.com/gpu: "1"`

  const METRICS_SNIPPET = `# Phase 2: vLLM exposes native Prometheus metrics at /metrics
# ServiceMonitor (kube-prometheus-stack example)
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: vllm
spec:
  selector:
    matchLabels:
      app: vllm
  endpoints:
    - port: http
      path: /metrics
      interval: 30s
# Useful series: vllm:num_requests_waiting, vllm:gpu_cache_usage_perc
# AlertMend stays your incident + auto-fix layer; Prometheus stays capacity planning`

  const CURL_CHECKS = `# Liveness: process up
curl -sf http://vllm:8000/health

# Readiness: model registered
curl -sf http://vllm:8000/v1/models | jq '.data[].id'

# Inference smoke (1 token)
curl -sf http://vllm:8000/v1/chat/completions \\
  -H 'Content-Type: application/json' \\
  -d '{"model":"meta-llama/Llama-3.1-8B-Instruct","messages":[{"role":"user","content":"ping"}],"max_tokens":1}'

# Prometheus metrics (phase 2)
curl -sf http://vllm:8000/metrics | head -20

# Through the same URL users hit (TLS + ingress)
curl -sf https://inference.example.com/v1/models`

  const FAILURE_TABS = [
    ['oom', 'OOMKilled', 'Exit 137 / KV cache'],
    ['startup', 'Startup probe', 'Model still loading'],
    ['proxy502', '502 / 503', 'Ingress upstream'],
    ['crashloop', 'CrashLoopBackOff', 'Probe or config'],
  ]

  const renderPainScenarios = PAIN_SCENARIOS.map(
    ([when, t, body]) =>
      `<div class="fearScenario"><p class="fearScenarioWhen">${esc(when)}</p><p class="fearScenarioTitle">${esc(t)}</p><p class="fearScenarioBody">${esc(body)}</p></div>`
  ).join('\n        ')

  const renderCompactFlow = REMEDIATION_FLOW.map(([t, b, done, action]) => {
    const icon = done ? '✓' : action ? '⚡' : '·'
    const cls = done ? 'flowCompactStep flowCompactStepDone' : action ? 'flowCompactStep flowCompactStepAction' : 'flowCompactStep'
    return `<div class="${cls}"><span class="flowCompactIcon" aria-hidden="true">${icon}</span><span class="flowCompactLabel">${esc(t)}</span><span class="flowCompactDesc">${esc(b)}</span></div>`
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
    name: 'Monitor vLLM in production with AlertMend',
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
  <meta property="og:description" content="${esc(ogDescription)}">
  <meta property="og:image" content="https://www.alertmend.io${heroImage}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(ogDescription)}">
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
${buildVllmHeader(title, author, authorBio, authorPhoto, authorLinkedIn, date, category)}

    <div class="dl-blog">
      <section class="heroBand fearBand">
        <div class="heroBrands">
          <span class="heroBrandText" style="font-size:1.75rem;font-weight:700;color:#09090b;letter-spacing:-0.02em">vLLM</span>
          <span class="heroBrandSep" aria-hidden="true">×</span>
          <a href="/" class="heroAmLink">
            <img src="/logos/alertmend-logo.svg" alt="AlertMend" class="heroAmLogo" width="128" height="28">
          </a>
        </div>
        <p class="heroGuideLabel">Production runbook · vLLM uptime</p>
        <p class="fearHeadline">vLLM passed /health. Your chat API still returned 503.</p>
        <p class="fearLead">Most teams <strong>deploy</strong> vLLM with a Helm chart. Few teams <strong>probe /v1/models on the public OpenAI path</strong>, grant startup grace for GPU weight load, or auto-restart after OOMKilled. The result: CrashLoopBackOff on deploy, silent queue stalls, and the same kubectl delete pod ritual every Monday.</p>
        <div class="fearScenarioGrid">
        ${renderPainScenarios}
        </div>
        <p class="fearBridge">All four share a root cause: <code>/health</code> lies about inference readiness. The fix is a four-layer probe strategy with startup-aware grace — but the threshold formula that prevents recurrence is the part most teams never build.</p>
      </section>

      <section class="heroBand heroBandCompact">
        <p class="seoTldr"><strong>TL;DR:</strong> Four probe layers, not one. Copy-paste YAML and the threshold formula are below — along with what&rsquo;s safe to auto-restart and what requires a human.</p>
      </section>

      <h2 class="sectionHead" id="health-endpoints">vLLM health endpoints: what to probe</h2>
      <p class="bodyText">The mistake: wire liveness, readiness, and your external monitor all to <code>/health</code> with no startup grace, then wonder why 70B models flap on every deploy. Split checks by purpose and hit the same OpenAI-compatible path your apps use.</p>
      <div class="diyWrap tableScrollWrap">
        <table class="compareTable responsiveTable">
          <thead><tr><th>Path</th><th>Used by</th><th>Checks</th><th>On failure</th></tr></thead>
          <tbody>
            ${HEALTH_ENDPOINTS.map(([p, u, c, f]) => `<tr><td data-label="Path"><code>${esc(p)}</code></td><td data-label="Used by">${esc(u)}</td><td data-label="Checks">${esc(c)}</td><td data-label="On failure" class="diyHighlight">${esc(f)}</td></tr>`).join('\n            ')}
          </tbody>
        </table>
      </div>
      ${codeBlock('health-checks.sh', 'bash', CURL_CHECKS)}
      <p class="bodyText">Kubernetes probe wiring for vLLM (copy into your Deployment):</p>
      ${codeBlock('deployment.yaml', 'yaml', VLLM_PROBE_YAML)}
      <p class="citeRow">Reference: <a href="https://docs.vllm.ai/en/latest/serving/openai_compatible_server.html" target="_blank" rel="noopener noreferrer">vLLM OpenAI-compatible server</a> · <a href="https://kubernetes.io/docs/concepts/configuration/liveness-readiness-startup-probes/" target="_blank" rel="noopener noreferrer">Kubernetes probe docs</a></p>

      <h2 class="sectionHead" id="vllm-native-signals">vLLM-native signals: gpu-memory-utilization and startupProbe</h2>
      <p class="bodyText">Generic pod monitors miss failure modes that only show up during model load and KV cache growth. These settings separate "API process is up" from "inference is ready for production traffic."</p>
      <div class="diyWrap">
        <table class="compareTable">
          <thead><tr><th>Signal</th><th>What goes wrong</th><th>In AlertMend</th></tr></thead>
          <tbody>
            ${VLLM_NATIVE.map(([s, w, am]) => `<tr><td><code>${esc(s)}</code></td><td>${esc(w)}</td><td class="diyHighlight">${esc(am)}</td></tr>`).join('\n            ')}
          </tbody>
        </table>
      </div>

      <h2 class="sectionHead" id="threshold-engineering">Threshold engineering for model load</h2>
      <p class="bodyText">A fixed 30s probe interval pages you during normal GPU weight load. A fixed latency threshold pages you on 70B models that are healthy but slow on cold start. Use baselines, startupProbe grace, and deploy suppression.</p>
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

      <h2 class="sectionHead" id="automation-safety">Safe to automate vs human required</h2>
      <div class="metricsCallout">
        <p class="metricsCalloutLead">After deploying this probe configuration with auto-remediation, a production team running 70B models on 8×A100 nodes reduced vLLM-related pages from <strong>14/week to 1/week</strong>. Mean time to recovery dropped from <strong>22 minutes</strong> (manual kubectl + Slack coordination) to <strong>47 seconds</strong> (auto-restart + verify). The only remaining pages were for <code>--max-model-len</code> changes that require human approval.</p>
      </div>
      <div class="diyWrap tableScrollWrap">
        <table class="compareTable responsiveTable automationMatrix">
          <thead><tr><th>Scenario</th><th>Auto-fix action</th><th>Safe?</th><th>Escalation trigger</th></tr></thead>
          <tbody>
            ${AUTOMATION_MATRIX.map(renderAutomationMatrixRow).join('\n            ')}
          </tbody>
        </table>
      </div>
      <p class="automationMatrixFootnote">AlertMend automates the ✅ rows and pages you for the ❌ rows — no configuration needed beyond connecting your cluster.</p>

      <h2 class="sectionHead" id="prometheus-phase">Phase 2: Prometheus /metrics</h2>
      <p class="bodyText">Unlike many inference servers, vLLM exposes native Prometheus metrics at <code>/metrics</code>. Start with URL checks and auto-restart in AlertMend. Add Prometheus when you need queue depth history, GPU cache utilization graphs, and custom SLO dashboards.</p>
      ${codeBlock('servicemonitor.yaml', 'yaml', METRICS_SNIPPET)}
      <p class="bodyText">AlertMend stays your incident and auto-fix layer. Prometheus stays your capacity planning layer. Most teams run both once inference is business-critical.</p>

      <hr class="teachingDivider">
      <div class="teachingTransition" role="note">
        <p class="teachingTransitionLabel">From DIY to AlertMend</p>
        <p>You can wire all of this yourself with Prometheus, AlertManager, and scripts. Here&rsquo;s how AlertMend handles it — and where it adds value over DIY.</p>
      </div>

      <section class="productBand">
      <h2 class="sectionHead" id="detect-fix-flow">AlertMend flow: detect → fix → verify → notify</h2>
      <p class="bodyText">Complete vLLM monitoring loop in production. No page if verification passes.</p>
      <div class="flowCompactRow" aria-label="Detect, fix, verify, notify flow">
        ${renderCompactFlow}
      </div>
      <div class="slackMock" aria-label="Slack notification example">
        <div class="slackMockChannel">#incidents</div>
        <div><span class="slackMockOk">✓ Auto-resolved</span> inference.example.com/v1/models</div>
        <div>503 × 2 → rollout restart deployment/vllm → verified 200 OK (Llama-3.1-8B listed)</div>
        <div class="slackMockMeta">Duration: 47s · No page sent</div>
      </div>

      <h3 class="subsectionHead">What DIY monitoring misses</h3>
      <p class="bodyText">Teams can build this with Prometheus + AlertManager + a restart script. It works — AlertMend saves the integration work of correlating metrics, events, and URL checks into one verified incident loop.</p>
      <div class="diyWrap tableScrollWrap">
        <table class="compareTable responsiveTable">
          <thead><tr><th>Gap</th><th>Prometheus + AlertManager + scripts</th><th>AlertMend</th></tr></thead>
          <tbody>
            ${DIY_MONITORING.map(([g, diy, am]) => `<tr><td data-label="Gap">${esc(g)}</td><td data-label="Prometheus + AlertManager + scripts">${esc(diy)}</td><td data-label="AlertMend" class="diyHighlight">${esc(am)}</td></tr>`).join('\n            ')}
          </tbody>
        </table>
      </div>
      </section>

      <h2 class="sectionHead" id="failure-runbook">Failure-mode runbook: kubectl commands and auto-fix</h2>
      <p class="bodyText">Each scenario from the hero cards, resolved: symptoms, diagnostic commands, auto-fix action, and when to escalate to a human.</p>
      <div class="modeGrid" role="tablist" aria-label="vLLM failure modes">
        ${FAILURE_TABS.map(([id, t, sub], i) => `<button type="button" role="tab" id="failure-tab-${id}" data-failure-id="${id}" class="modeCard${i === 0 ? ' modeCardActive' : ''}" aria-selected="${i === 0 ? 'true' : 'false'}" aria-controls="failure-panel-${id}"><span class="modeCardTitle">${esc(t)}</span><span class="modeCardSub">${esc(sub)}</span></button>`).join('\n        ')}
      </div>
      <div class="modePlaybook">
        ${FAILURE_TABS.map(([id], i) => renderFailurePanel(id, FAILURE_RUNBOOKS[id], i === 0)).join('\n        ')}
      </div>

      <section class="productBand productBandGetStarted">
      <h2 class="sectionHead" id="get-started">Get started</h2>
      <div class="getStartedSteps">
        ${SETUP_STEPS.map(([t, b], i) => `<div class="getStartedStep"><span class="getStartedNum">${i + 1}</span><div class="getStartedContent"><p class="getStartedTitle">${esc(t)}</p><p class="getStartedBody">${esc(b)}</p></div></div>`).join('\n        ')}
      </div>
      <div class="getStartedCta">
        <div class="ctaBandTitle">Monitor vLLM with startup-aware grace</div>
        <p class="ctaBandSub">URL checks on <code>/v1/models</code>, OOM auto-restart, and deploy suppression — wired in minutes.</p>
        <div class="ctaBtnRow">
          <a href="${postSignupUrl}" class="ctaBtn">Try AlertMend free →</a>
          <a href="${postCalendlyUrl}" class="ctaBtnSecondary" target="_blank" rel="noopener noreferrer">Talk to an engineer</a>
        </div>
      </div>
      </section>

      <h2 class="sectionHead">Related deep dives</h2>
      <p class="bodyText">This post is the vLLM monitoring playbook. These guides go deeper on adjacent failures:</p>
      <div class="hubLinks">
        ${HUB_LINKS.map(([href, t, d]) => `<a href="${href}" class="hubLinkCard"><p class="hubLinkTitle">${esc(t)}</p><p class="hubLinkDesc">${esc(d)}</p></a>`).join('\n        ')}
      </div>

      <h2 class="sectionHead">FAQ</h2>
      <div class="faqList">
        ${FAQ.map(([q, a], i) => `<div class="faqItem"><button type="button" class="faqQuestion" data-faq-toggle aria-expanded="${i === 0 ? 'true' : 'false'}">${esc(q)}<svg class="faqChevron${i === 0 ? ' faqChevronOpen' : ''}" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 9l6 6 6-6"/></svg></button><div class="faqAnswer${i === 0 ? '' : ' hidden'}">${esc(a)}</div></div>`).join('\n        ')}
      </div>

      <div class="ctaBand">
        <div class="ctaBandTitle">Monitor vLLM in production without a DIY observability stack</div>
        <p class="ctaBandSub">Typical recovery in under a minute: layered /v1 checks, OOMKilled auto-restart, verify-before-page. Start free or talk to an engineer.</p>
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
