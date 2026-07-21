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
  writeStaticBlogOutputs,
} from '../static-blog-shared.mjs'

function buildOllamaHeader(title, author, date) {
  return `
    <header class="article-header">
      <h1>${esc(title)}</h1>
      <div class="author-info">
        <div class="author-avatar">${author.charAt(0)}</div>
        <div>
          <div class="author-name">${esc(author)}</div>
          <div class="author-meta">${esc(date)} · 12 min read</div>
        </div>
      </div>
    </header>`
}

export async function build(slug) {
  const assetsBase = `/assets/${slug}`
  const canonical = `${SITE_URL}/blog/${slug}`
  const heroImage = `${assetsBase}/ollama-hero.svg`

  const meta = parseFrontmatter(slug)
  const title = meta.title || 'How to Monitor Ollama in Production'
  const excerpt =
    meta.excerpt ||
    'Five Ollama health endpoints most teams miss, K8s probe YAML, threshold formula for cold starts, and safe-to-automate matrix for OOMKilled and CrashLoopBackOff.'
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
      'Friday evening load test. VRAM spiked under concurrent embeddings. kubectl describe showed OOMKilled, exit 137. We ran kubectl delete pod three times thinking the process was wedged. Each restart re-loaded the 40GB model, hit the same memory ceiling, and OOMed again within 90 seconds. Grafana showed the pod as Running the whole time.',
    ],
    [
      'Ingress said 502',
      'Apps called the proxy URL, not localhost:11434.',
      'Deploy looked green. In-cluster curl to the ClusterIP returned /api/tags 200. Users hit 502 on inference.example.com because nginx routed to a pod still in ContainerCreating. Our monitor checked localhost:11434 from inside the cluster. Nobody checked the hostname users typed in the browser.',
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
    ['OLLAMA_KEEP_ALIVE', 'Models unload after idle timeout. Next request pays cold-start latency that looks like an outage.', 'Set keep_alive to match traffic (e.g. -1 or 30m). Latency baseline alerts catch spikes before users complain.'],
    ['/api/ps vs /api/tags', 'tags lists installed models on disk. ps lists what is loaded in VRAM right now.', 'Optional check script asserts your model appears in ps during business hours.'],
    ['Model in tags JSON', 'Readiness should confirm llama3.2 (or your model) is present, not just HTTP 200.', 'URL check body assertion or exec probe with jq before marking healthy.'],
  ]

  const PROMETHEUS_DECISION = [
    ['Need historical VRAM graphs?', 'Add Prometheus + sidecar exporter'],
    ['Need token throughput dashboards?', 'Add Prometheus'],
    ['Need SLO burn rate alerts?', 'Add Prometheus'],
    ['Just need "is it up?" + auto-restart', 'AlertMend alone is enough for phase one'],
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
    ['Correlate', 'Match URL failure with OOMKilled exit 137 or pod NotReady', false, true],
    ['Auto-fix', 'Rollout restart deployment/ollama', false, true],
    ['Verify', 'Re-probe /api/tags: 200, model listed', true, false],
    ['Notify', 'Slack: auto-resolved. No page.', true, false],
  ]

  const SAFE_AUTOMATE = [
    ['OOMKilled (exit 137)', 'VRAM or container memory limit exceeded', 'Rollout restart Deployment, re-probe /api/tags twice. Escalate if OOM repeats within 15 min.'],
    ['CrashLoopBackOff', 'Bad env, missing model, probe too aggressive', 'Restart with deploy grace. Rollback suggestion if crash started after rollout.'],
    ['502 / 504 from proxy', 'Pod restarting, upstream timeout', 'Restart on public URL failure. Suppress during known deploy window.'],
    ['Model evicted under load', 'Cold start on next request', 'Latency baseline alert before auto-restart. Optional /api/ps assertion.'],
    ['GPU node NotReady', 'Node drain or driver glitch', 'Restart pod after node recovers. Correlate node event with URL failure.'],
  ]

  const DO_NOT_AUTOMATE = [
    ['Delete model PVC', 'Data loss, hours to re-pull', 'Page on-call with disk and model inventory'],
    ['Change quantization at runtime', 'Wrong model behavior', 'Human approval + staged rollout'],
    ['Multi-tenant model purge', 'Cross-team impact', 'Coordinate manually'],
    ['Cluster-wide GPU drain', 'Blast radius across workloads', 'Runbook with maintenance window'],
  ]

  const DIFFERENTIATION = [
    ['Deploy suppression', 'A cron restart during rollout makes outages worse.', 'Pauses runbooks during active rollouts and resumes checks after grace.'],
    ['Correlated incidents', 'Uptime Robot sees 502. kubectl sees OOMKilled. Two tools, no story.', 'Opens one Slack thread with URL failure plus exit 137 context.'],
    ['Verify before page', 'Scripts restart and assume success. On-call still wakes up.', 'Re-probes /api/tags twice. Pages only if verification fails.'],
    ['AI incident summary', 'Raw pod events in Slack at 2am help nobody.', 'Posts plain-language root cause and what the runbook did.'],
  ]

  const SETUP_STEPS = [
    ['Connect cluster or host', '2 min', 'Install the AlertMend agent. Ollama pod events, OOMKilled, and restart history appear without Prometheus wiring.'],
    ['Layer health checks', '5 min', '/api/tags for liveness, optional /api/generate smoke, and the public URL your apps call through Ingress.'],
    ['Set thresholds', '8 min', 'Model-load grace after deploy. Baseline-relative latency. Split Open WebUI vs Ollama backend checks.'],
    ['Attach idempotent runbooks', '5 min', 'Restart Deployment or StatefulSet. Safe to run twice. Include deploy suppression window.'],
    ['Verify then notify', '2 min', 'Re-probe /api/tags twice. Slack on success. Page only if verification fails after auto-fix.'],
  ]

  const HUB_LINKS = [
    ['/blog/monitor-litellm-using-alertmend', 'Monitor LiteLLM', 'OpenAI gateway in front of Ollama'],
    ['/blog/kubernetes-crashloopbackoff-fix', 'CrashLoopBackOff fix', 'Probe misconfig and post-deploy crash loops'],
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
      'What latency threshold should I set for Ollama /api/generate smoke checks?',
      'A fixed number will page you on healthy large models. See the baseline-relative formula in the threshold engineering section above. Recompute weekly from off-peak traffic.',
    ],
    [
      'Which Ollama failures should I never auto-restart?',
      'Never auto-delete model PVCs, change quantization at runtime, purge multi-tenant models, or drain GPU nodes cluster-wide. See the safe-to-automate matrix for the full line between script and human.',
    ],
    [
      'How do I prevent false pages during Ollama model cold starts?',
      'Suppress alerts for initialDelaySeconds + 30s after pod Ready, and use baseline-relative latency instead of fixed timeouts. The full formula is in threshold engineering above.',
    ],
    [
      'Can I monitor multiple Ollama instances behind a load balancer?',
      'Yes, but check each backend independently. A load balancer can return 200 while one replica is OOMKilled. Per-replica /api/tags checks catch what a single VIP check misses.',
    ],
    [
      'How do I monitor Ollama behind Open WebUI?',
      'Split checks: Open WebUI /health for the UI, Ollama /api/tags for inference. Alert when the UI is up but backend checks fail. See the Open WebUI deployment tab above.',
    ],
    [
      'Why does Ollama keep getting OOMKilled?',
      'Model size plus concurrent requests exceed pod memory or GPU VRAM limits. Restart once for availability. If OOM repeats within 15 minutes, fix sizing instead of only restarting.',
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

  const renderScenario = ([when, t, body]) =>
    `<div class="fearScenario"><p class="fearScenarioWhen">${esc(when)}</p><h3 class="fearScenarioTitle">${esc(t)}</h3><p class="fearScenarioBody">${esc(body)}</p></div>`

  const visibleScenarios = PAIN_SCENARIOS.slice(0, 2).map(renderScenario).join('\n        ')
  const moreScenarios = PAIN_SCENARIOS.slice(2).map(renderScenario).join('\n        ')

  const renderFlow = REMEDIATION_FLOW.map(([t, b, done, action]) => {
    const cls = done ? 'flowStep flowStepDone' : action ? 'flowStep flowStepAction' : 'flowStep'
    return `<div class="${cls}"><span class="flowStepNum">${done ? '✓' : action ? '⚡' : '·'}</span><p class="flowStepTitle">${esc(t)}</p><p class="flowStepBody">${esc(b)}</p></div>`
  }).join('\n        ')

  const renderSafeItems = SAFE_AUTOMATE.map(
    ([sym, cause, fix]) =>
      `<li class="automationItem automationItemSafe"><span class="automationIcon" aria-hidden="true">✓</span><div><strong>${esc(sym)}</strong><p>${esc(cause)}. ${esc(fix)}</p></div></li>`
  ).join('\n            ')

  const renderDangerItems = DO_NOT_AUTOMATE.map(
    ([sym, why, instead]) =>
      `<li class="automationItem automationItemDanger"><span class="automationIcon" aria-hidden="true">⛔</span><div><strong>${esc(sym)}</strong><p>${esc(why)}. ${esc(instead)}.</p></div></li>`
  ).join('\n            ')

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
${buildOllamaHeader(title, author, date)}

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
        <p class="fearLead">Most teams <strong>install</strong> Ollama. Few teams <strong>monitor the URL their apps actually hit</strong>, or auto-restart after OOMKilled.</p>
        <p class="fearLeadSecondary">Not every failure should be auto-fixed. Some automations cause data loss or cross-team outages.</p>
        <div class="fearScenarioGrid">
        ${visibleScenarios}
        </div>
        <details class="fearScenarioMore">
          <summary>See the failure that looked healthy in Grafana →</summary>
          <div class="fearScenarioGrid">
        ${moreScenarios}
          </div>
        </details>
        <p class="heroBridge">Every one of these was preventable. Below: the formula one team used to cut false pages during model cold starts, and why a fixed timeout will never work. Some auto-restarts cause worse outages than the failure itself. The matrix for which is which is further down.</p>
      </section>

      <section class="heroBand heroBandCompact">
        <div class="heroAudience heroAudienceCompact">
          <h2 class="heroAudienceTitle">You're in the right place if…</h2>
          <ul class="heroAudienceList">
            <li>You run Ollama on Kubernetes, a GPU VM, or Docker behind Open WebUI or an internal chat API</li>
            <li>Nobody pages you when inference stops, models get evicted, or exit 137 loops start</li>
          </ul>
        </div>
        <p class="seoTldr"><strong>TL;DR:</strong> Most teams monitor one endpoint and restart manually, but three of Ollama&apos;s five endpoints matter more than the one you&apos;re checking, and some auto-restarts cause worse outages than the failure itself. This guide covers which probes to layer, <a href="#threshold-engineering">the formula that stops false pages during normal deploys</a>, and <a href="#automation-safety">the line between safe automation and data loss</a>.</p>
        <p class="fearBridge fearBridgeAfterTldr"><strong>Checking /api/tags once is not production monitoring.</strong> Layer probes, grace periods for model load, and idempotent restart runbooks.</p>
      </section>

      <details class="jumpNavCollapsible">
        <summary>Jump to a section</summary>
        <nav class="inThisGuide inThisGuideTeasers" aria-label="Jump to section">
          <ul>
            <li><a href="#health-endpoints">The five endpoints most guides get wrong (and the one teams skip)</a></li>
            <li><a href="#threshold-engineering">The formula that stops false pages during normal deploys</a></li>
            <li><a href="#automation-safety">The line between safe automation and data loss</a></li>
            <li><a href="#setup-steps">Five steps from zero to auto-remediation (~15 min)</a></li>
          </ul>
        </nav>
      </details>

      <section class="sectionChapter" id="health-endpoints">
        <p class="sectionLabel">Chapter 1 · Diagnosis</p>
        <h2 class="sectionHead">Ollama health endpoints: what to probe</h2>
        <p class="cliffhanger">Every Ollama guide says &ldquo;check <code>/api/tags</code>.&rdquo; That is the equivalent of checking if nginx is running and calling it production monitoring. Here is what actually breaks, and the order you should check it in.</p>
        <div class="warningCallout">
          <p><span class="calloutIcon" aria-hidden="true">⚠️</span> <strong>The mistake:</strong> wire liveness, readiness, and your external monitor all to <code>/api/tags</code> with no grace period, then wonder why large models flap on every deploy.</p>
        </div>
        <div class="endpointMissCallout">
          <p><strong>The endpoint most teams miss:</strong> <code>Public inference URL</code>. If your apps call inference.example.com but your monitor checks localhost:11434, you are monitoring a different system than your users see.</p>
        </div>
        <div class="diyWrap tableScrollWrap">
          <table class="compareTable responsiveTable">
            <thead><tr><th>Path</th><th>Used by</th><th>Checks</th><th>On failure</th></tr></thead>
            <tbody>
              ${HEALTH_ENDPOINTS.map(([p, u, c, f]) => `<tr><td data-label="Path"><code>${esc(p)}</code></td><td data-label="Used by">${esc(u)}</td><td data-label="Checks">${esc(c)}</td><td data-label="On failure" class="diyHighlight">${esc(f)}</td></tr>`).join('\n            ')}
            </tbody>
          </table>
        </div>
        <div class="scrollHook">
          <p>These probes catch crashes. They do not prevent the 2am false page during a normal model cold start. That requires <a href="#threshold-engineering">threshold math</a>, and knowing <a href="#automation-safety">which failures are safe for a script to fix</a> vs. which need a human.</p>
        </div>
        <pre class="codeBlock"><code>${esc(CURL_CHECKS)}</code></pre>
        <p class="bodyText">Kubernetes probe wiring for Ollama (copy into your Deployment):</p>
        <pre class="codeBlock"><code>${esc(OLLAMA_PROBE_YAML)}</code></pre>
        <p class="citeRow">Reference: <a href="https://github.com/ollama/ollama/blob/main/docs/api.md" target="_blank" rel="noopener noreferrer">Ollama API docs</a> · <a href="https://kubernetes.io/docs/concepts/configuration/liveness-readiness-startup-probes/" target="_blank" rel="noopener noreferrer">Kubernetes probe docs</a></p>
      </section>

      <section class="sectionChapter sectionChapterAlt" id="threshold-engineering">
        <p class="sectionLabel">Chapter 2 · Thresholds</p>
        <h2 class="sectionHead">The formula that stops false pages during cold starts</h2>
        <p class="bodyText">Remember the Friday 3:42pm embedding failure? <code>/api/tags</code> passed while generate timed out. A fixed 30s probe interval would have paged you during normal GPU weight load.</p>
        <div class="formulaCard">
          <p class="formulaCardLabel">Key formula</p>
          <div class="thresholdFormula">alert when sustained_p99(10m) &gt; max(baseline_p99 × 1.5, baseline_p95 + 2σ)
  AND model_load_grace_elapsed &gt; initialDelaySeconds + 30s</div>
        </div>
        <div class="diyWrap tableScrollWrap">
          <table class="compareTable responsiveTable">
            <thead><tr><th>Rule</th><th>Threshold</th><th>Why</th></tr></thead>
            <tbody>
              ${THRESHOLDS.map(([r, t, w]) => `<tr><td data-label="Rule">${esc(r)}</td><td data-label="Threshold" class="diyHighlight">${esc(t)}</td><td data-label="Why">${esc(w)}</td></tr>`).join('\n            ')}
            </tbody>
          </table>
        </div>
      </section>

      <section class="sectionChapter" id="automation-safety">
        <p class="sectionLabel">Chapter 3 · Automation</p>
        <h2 class="sectionHead">Safe to automate vs human required</h2>
        <p class="bodyText">The difference between a production runbook and a dangerous script is knowing where to stop. Here is the line.</p>
        <div class="automationMatrix">
          <div class="automationColumn automationColumnSafe">
            <h3 class="automationColumnTitle"><span aria-hidden="true">✓</span> Safe to automate</h3>
            <ul class="automationList">
            ${renderSafeItems}
            </ul>
          </div>
          <div class="automationColumn automationColumnDanger">
            <h3 class="automationColumnTitle"><span aria-hidden="true">⛔</span> Human required</h3>
            <ul class="automationList">
            ${renderDangerItems}
            </ul>
          </div>
        </div>
      </section>

      <section class="sectionChapter sectionChapterAlt">
        <p class="sectionLabel">Chapter 4 · Ollama-specific</p>
        <h2 class="sectionHead">Ollama-native signals: /api/ps and keep_alive</h2>
        <p class="bodyText">Generic pod monitors miss failure modes that only show up in Ollama&apos;s API.</p>
        <div class="diyWrap tableScrollWrap">
          <table class="compareTable responsiveTable">
            <thead><tr><th>Signal</th><th>What goes wrong</th><th>In AlertMend</th></tr></thead>
            <tbody>
              ${OLLAMA_NATIVE.map(([s, w, am]) => `<tr><td data-label="Signal"><code>${esc(s)}</code></td><td data-label="What goes wrong">${esc(w)}</td><td data-label="In AlertMend" class="diyHighlight">${esc(am)}</td></tr>`).join('\n            ')}
            </tbody>
          </table>
        </div>
        <div class="keyInsight">
          <p><strong>Key insight:</strong> A model listed in <code>/api/tags</code> is not necessarily loaded in VRAM. After a cold start, <code>/api/tags</code> returns 200 while inference times out for 60-120 seconds. This is the #1 cause of false &ldquo;Ollama is healthy&rdquo; signals.</p>
        </div>
      </section>

      <section class="sectionChapter" id="prometheus-phase">
        <p class="sectionLabel">Chapter 5 · When to scale observability</p>
        <h2 class="sectionHead">When to add Prometheus (and when it is overkill)</h2>
        <p class="bodyText">Do not start here. Ollama has no native <code>/metrics</code> endpoint. You need a sidecar exporter, which means Prometheus is a second component to maintain.</p>
        <div class="diyWrap tableScrollWrap">
          <table class="compareTable responsiveTable">
            <thead><tr><th>Question</th><th>If yes →</th></tr></thead>
            <tbody>
              ${PROMETHEUS_DECISION.map(([q, a]) => `<tr><td data-label="Question">${esc(q)}</td><td data-label="If yes" class="diyHighlight">${esc(a)}</td></tr>`).join('\n            ')}
            </tbody>
          </table>
        </div>
        <pre class="codeBlock"><code>${esc(EXPORTER_SNIPPET)}</code></pre>
      </section>

      <section class="sectionChapter sectionChapterAlt">
        <p class="sectionLabel">Chapter 6 · Why scripts fail</p>
        <h2 class="sectionHead">Why scripts break at 2am</h2>
        <p class="bodyText">A bash restart script fixes one symptom. It does not correlate URL failure with OOMKilled, suppress during deploys, or verify recovery before paging. <span class="proofInline">Typical recovery with layered checks: ~52s (<a href="/case-studies">case study</a>).</span></p>
        <div class="diyWrap tableScrollWrap">
          <table class="compareTable responsiveTable">
            <thead><tr><th>Scenario</th><th>Bash script</th><th>AlertMend</th></tr></thead>
            <tbody>
              ${DIFFERENTIATION.map(([s, bash, am]) => `<tr><td data-label="Scenario">${esc(s)}</td><td data-label="Bash script">${esc(bash)}</td><td data-label="AlertMend" class="diyHighlight">${esc(am)}</td></tr>`).join('\n            ')}
            </tbody>
          </table>
        </div>
        <p class="inlineCta">AlertMend handles layered checks and verify-before-page out of the box. <a href="${postSignupUrl}">Free tier available</a>.</p>
      </section>

      <h2 class="sectionHead">How does AlertMend recover Ollama automatically?</h2>
      <figure class="flowDiagram">
        <img src="${assetsBase}/ollama-alertmend-recovery-flow.svg" alt="Sequence diagram: Ollama health check failure, AlertMend detects, alerts Slack, runs auto-recovery runbook" width="960" height="720" loading="lazy">
        <figcaption class="flowDiagramCaption">Health check fails, restart runbook runs, inference resumes. Typical duration: 52s.</figcaption>
      </figure>

      <h2 class="sectionHead" id="detect-fix-flow">Detect, fix, verify, notify</h2>
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
      <div class="modeGrid modeGridSecondary" role="tablist" aria-label="Ollama deployment modes">
        ${DEPLOY_MODES.map(([id, t, sub], i) => `<button type="button" role="tab" data-mode-id="${id}" class="modeCard${i === 1 ? ' modeCardActive' : ''}" aria-selected="${i === 1 ? 'true' : 'false'}" aria-controls="mode-playbook-panel" id="mode-tab-${id}"><span class="modeCardTitle">${esc(t)}</span><span class="modeCardSub">${esc(sub)}</span></button>`).join('\n        ')}
      </div>
      <div class="modePlaybook modePlaybookSecondary" id="mode-playbook-panel" role="tabpanel" aria-labelledby="mode-tab-kubernetes">
        <div class="modePlaybookHead">
          <h3 class="modePlaybookTitle" id="mode-playbook-title">Runbook: Kubernetes</h3>
          <span class="modePlaybookBadge">Production</span>
        </div>
        <p class="modePlaybookSummary" id="mode-playbook-summary"></p>
        <p class="stepPanelBody"><strong>Set up in AlertMend</strong></p>
        <ul class="checkList" id="mode-playbook-steps"></ul>
        <div class="stepTip"><span id="mode-playbook-tip"></span></div>
      </div>

      <h2 class="sectionHead" id="setup-steps">Five steps with AlertMend</h2>
      <p class="setupTimeEstimate">Setup time: ~15 minutes for basic monitoring. ~30 minutes with custom thresholds and runbooks.</p>
      <div class="amFlow">
        ${SETUP_STEPS.map(([t, time, b], i) => `<div class="amStep"><div class="amStepHead"><span class="amStepNum">${i + 1}</span><span class="amStepTime">${esc(time)}</span></div><h3 class="amStepTitle">${esc(t)}</h3><p class="amStepBody">${esc(b)}</p></div>`).join('\n        ')}
      </div>

      <h2 class="sectionHead">Try it: live monitor mock</h2>
      <p class="bodyText">Click a failure mode. Hit <strong>Simulate recovery</strong> after auto-fix succeeds.</p>
      <div class="monitorMock monitorMockProminent" aria-label="Ollama URL monitor dashboard mock">
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
        <button type="button" class="mockRecoverBtn" id="mock-recover-btn" aria-label="Simulate Ollama recovery after OOMKilled failure">Simulate recovery</button>
      </div>

      <h2 class="sectionHead">Pick a failure mode: kubectl commands</h2>
      <div class="modeGrid" role="tablist" aria-label="Ollama failure modes">
        ${FAILURE_TABS.map(([id, t, sub], i) => `<button type="button" role="tab" data-failure-id="${id}" class="modeCard${i === 0 ? ' modeCardActive' : ''}" aria-selected="${i === 0 ? 'true' : 'false'}" aria-controls="failure-playbook-panel" id="failure-tab-${id}"><span class="modeCardTitle">${esc(t)}</span><span class="modeCardSub">${esc(sub)}</span></button>`).join('\n        ')}
      </div>
      <div class="modePlaybook" id="failure-playbook-panel" role="tabpanel" aria-labelledby="failure-tab-oom">
        <div class="modePlaybookHead">
          <h3 class="modePlaybookTitle" id="failure-playbook-title">Runbook: OOMKilled</h3>
        </div>
        <p class="modePlaybookSummary" id="failure-playbook-summary"></p>
        <ul class="checkList" id="failure-playbook-steps"></ul>
        <pre class="playbookCode" id="failure-playbook-code" aria-label="kubectl and curl commands"></pre>
        <div class="playbookFooter">
          <p class="playbookTip" id="failure-playbook-tip"></p>
        </div>
      </div>

      <h2 class="sectionHead">Related deep dives</h2>
      <div class="hubLinks">
        ${HUB_LINKS.map(([href, t, d]) => `<a href="${href}" class="hubLinkCard"><p class="hubLinkTitle">${esc(t)}</p><p class="hubLinkDesc">${esc(d)}</p></a>`).join('\n        ')}
      </div>

      <h2 class="sectionHead" id="faq">FAQ</h2>
      <div class="faqList">
        ${FAQ.map(([q, a], i) => `<div class="faqItem"><button type="button" class="faqQuestion" data-faq-toggle aria-expanded="${i === 0 ? 'true' : 'false'}">${esc(q)}<svg class="faqChevron${i === 0 ? ' faqChevronOpen' : ''}" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 9l6 6 6-6"/></svg></button><div class="faqAnswer${i === 0 ? '' : ' hidden'}">${esc(a)}</div></div>`).join('\n        ')}
      </div>

      <div class="receiptBox">
        <p class="receiptTitle">What you now have</p>
        <ul class="receiptList">
          <li>Five-layer probe strategy that catches failures <code>/api/tags</code> misses</li>
          <li>Production Kubernetes YAML with model-aware readiness</li>
          <li>The threshold formula that stops false pages during cold starts</li>
          <li>A safe-to-automate matrix for every common Ollama failure</li>
          <li>Copy-paste runbooks for OOMKilled, CrashLoopBackOff, and proxy errors</li>
        </ul>
      </div>

      <div class="ctaBand">
        <div class="ctaBandTitle">Your tags check passed. Your users still got 500s.</div>
        <p class="ctaBandSub">The next outage might be model eviction under load or a proxy URL nobody monitors. Wire the checks above, or let AlertMend run them for you.</p>
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
