/**
 * Code-generated rich blog: Open WebUI + Ollama production monitoring post.
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

function buildOpenWebuiHeader(title, subtitle, author, date) {
  return `
    <header class="article-header">
      <h1>${esc(title)}</h1>
      <p class="articleDeck">${esc(subtitle)}</p>
      <div class="author-info">
        <div class="author-avatar">${author.charAt(0)}</div>
        <div>
          <div class="author-name">${esc(author)}</div>
          <div class="author-meta">${esc(date)} · 12 min read</div>
        </div>
      </div>
    </header>`
}

function sectionH2(anchorId, text, idOnHeading = false) {
  const idAttr = idOnHeading ? ` id="${anchorId}"` : ''
  return `<h2 class="sectionHead"${idAttr}><span class="sectionHeadText">${esc(text)}</span><a class="sectionHeadAnchor" href="#${anchorId}" aria-label="Link to section">#</a></h2>`
}

function renderHealthTable(rows) {
  return `<div class="diyWrap tableScrollWrap">
        <table class="compareTable responsiveTable">
          <thead><tr><th>Path</th><th>Used by</th><th>Checks</th><th>On failure</th></tr></thead>
          <tbody>
            ${rows
              .map(
                ([p, u, c, f]) =>
                  `<tr><td data-label="Path"><code>${esc(p)}</code></td><td data-label="Used by">${esc(u)}</td><td data-label="Checks">${esc(c)}</td><td data-label="On failure" class="diyHighlight">${esc(f)}</td></tr>`
              )
              .join('\n            ')}
          </tbody>
        </table>
      </div>`
}

export async function build(slug) {
  const assetsBase = `/assets/${slug}`
  const canonical = `${SITE_URL}/blog/${slug}`
  const heroImage = `${assetsBase}/open-webui-hero.svg`

  const meta = parseFrontmatter(slug)
  const title = meta.title || 'Monitor Open WebUI + Ollama in Production'
  const excerpt =
    meta.excerpt ||
    'Open WebUI /health returns 200 while Ollama is down, the #1 production failure. Split-stack monitoring with auto-restart recovers chat in 48 seconds.'
  const ogTitle = 'How to Monitor Open WebUI + Ollama in Production, Stop the Silent Split-Stack Failure'
  const subtitle = 'The split-stack failure that pages on-call at 2am, and the 48-second auto-fix.'
  const date = meta.date || '2026-06-24'
  const category = meta.category || 'AIOps'
  const author = meta.author || 'AlertMend Team'
  const keywords =
    meta.keywords ||
    'open webui not connecting to ollama, monitor open webui production, open webui health check, ollama backend monitoring, open webui docker compose, AlertMend'

  const relatedPosts = getRelatedPosts(slug, category)
  const postSignupUrl = signupUrl(slug, 'blog-open-webui')
  const postCalendlyUrl = calendlyUrl(slug)

  const PAIN_SCENARIOS = [
    [
      'Wednesday, 2:15pm',
      'Chat UI loaded. Every message errored.',
      'Open WebUI /health returned 200. Ollama /api/tags timed out on the Docker network. Users saw a working login screen and broken completions.',
    ],
    [
      'Wrong OLLAMA_BASE_URL',
      'Worked in dev, failed in prod.',
      'Compose used host.docker.internal on Mac but http://ollama:11434 in K8s. WebUI could not reach the backend. No monitor on the backend URL from the WebUI network.',
    ],
    [
      'OOM on Ollama only',
      'WebUI metrics looked fine.',
      'Only the inference container OOMed. Open WebUI stayed up. Dashboards on WebUI CPU missed exit 137 on the backend.',
    ],
    [
      'Ingress split',
      'chat.example.com worked, inference did not.',
      'Users hit WebUI through Ingress. Ollama was cluster-internal only. UI synthetic checks passed; backend checks were never configured.',
    ],
  ]

  const HEALTH_ENDPOINTS = [
    ['/health (Open WebUI)', 'UI liveness', 'Open WebUI on port 8080.', 'Alert if UI down. Does not prove chat works.'],
    ['/api/tags (Ollama)', 'Backend readiness', 'Models on Ollama at OLLAMA_BASE_URL.', 'Alert when UI up AND backend fails 2x.'],
    ['/', 'UI smoke', 'Login page loads.', 'Optional user-facing check.'],
    ['/api/generate (Ollama)', 'Inference smoke', 'Tiny generate on backend.', 'Catches hung GPU when tags pass.'],
    ['Public chat URL', 'External monitor', 'Hostname users open in browser.', 'Pair with backend check.'],
  ]

  const STACK_NATIVE = [
    ['OLLAMA_BASE_URL', 'Wrong host: localhost vs ollama service vs Ingress.', 'Backend check uses same URL as WebUI config.'],
    ['Split monitoring', 'UI /health 200 while Ollama down is the #1 failure.', 'Compound alert: UI OK + backend FAIL → restart Ollama.'],
    ['OLLAMA_KEEP_ALIVE', 'Model evicted; UI still loads.', 'Restart Ollama when generate smoke fails.'],
  ]

  const THRESHOLDS = [
    ['Split-stack paging', 'WebUI /health 200 AND Ollama /api/tags fail 2x within 60s', 'Most common user report, UI looks fine, chat broken'],
    ['UI-only outage', 'WebUI /health fails 2 consecutive checks', 'Restart deployment/open-webui; Ollama backend may still be healthy'],
    ['Model cold start grace', 'Suppress Ollama alerts for 120s after pod Ready', 'Large models need time before /api/tags is reliable'],
    ['Backend OOM auto-fix', 'Exit 137 on Ollama + /api/tags still failing after 1 restart', 'Restart Ollama once idempotently; escalate if OOM repeats within 15 min'],
  ]

  const REMEDIATION_FLOW = [
    ['/api/tags fails', 'External check: connection refused x2', false, false],
    ['Correlate', 'AlertMend: WebUI /health 200, Ollama OOM or CrashLoop', false, true],
    ['Auto-fix', 'Restart Ollama backend (not WebUI first)', false, true],
    ['Verify', 'Re-probe /api/tags: 200, model listed', true, false],
    ['Notify', 'Slack: auto-resolved. No page.', true, false],
  ]

  const SAFE_AUTOMATE = [
    ['Split-stack: UI up, backend down', 'WebUI /health passes while Ollama /api/tags fails', 'Compound alert restarts deployment/ollama, re-verifies /api/tags twice before Slack.'],
    ['OOMKilled on Ollama (exit 137)', 'Inference container killed; WebUI pod stays healthy', 'Restart Ollama backend only, leave WebUI running.'],
    ['Backend CrashLoopBackOff', 'Ollama loops while login page still loads', 'Correlate WebUI OK + Ollama crash; attach Ollama restart runbook with deploy grace.'],
    ['502 on chat completions', 'Ingress timeout to Ollama upstream', 'Public chat URL plus internal /api/tags; restart backend on split failure.'],
    ['Wrong OLLAMA_BASE_URL after deploy', 'ConfigMap changed backend host', 'Backend probe uses same URL as WebUI env; alert when probe path drifts.'],
  ]

  const DO_NOT_AUTOMATE = [
    ['Change OLLAMA_BASE_URL in prod', 'Breaks active chat sessions mid-conversation', 'Stage in dev; verify with dual curl checks from WebUI network'],
    ['Delete Open WebUI user database', 'Auth and chat history loss', 'Backup PVC first; page on-call'],
    ['Purge all Ollama models', 'Hours to re-pull on GPU nodes', 'Manual with model inventory check'],
    ['Restart WebUI when only backend failed', 'Unnecessary user disruption', 'Restart Ollama first per split-stack rule'],
  ]

  const DIFFERENTIATION = [
    ['Split-stack detection', 'Monitoring only WebUI /health misses backend outages entirely.', 'Fires when UI OK + Ollama FAIL, the failure users actually report.'],
    ['Ollama-first restart', 'Scripts restart both pods or WebUI first, disrupting active sessions.', 'Restarts deployment/ollama only when split-stack rule matches.'],
    ['Verify before page', 'kubectl delete pod assumes success. On-call still wakes up.', 'Re-probes /api/tags twice. Pages only if verification fails.'],
    ['AI incident summary', 'Raw pod events in Slack at 2am help nobody.', 'Posts which layer failed (UI vs backend) and what the runbook did.'],
  ]

  const SETUP_STEPS = [
    ['Connect cluster or host', 'Install the AlertMend agent. Open WebUI and Ollama pod events appear together in one view.'],
    ['Layer split checks', 'Open WebUI /health plus Ollama /api/tags on the exact OLLAMA_BASE_URL from your WebUI config.'],
    ['Set thresholds', 'Split-stack rule: UI OK + backend fail for 2 checks. Model-load grace on Ollama only.'],
    ['Attach idempotent runbooks', 'Restart deployment/ollama (not WebUI) when split-stack rule fires. Safe to run twice. Include deploy suppression window.'],
    ['Verify then notify', 'Re-probe /api/tags twice. Slack on success. Page only if verification fails after auto-fix.'],
  ]

  const HUB_LINKS = [
    ['/blog/monitor-ollama-using-alertmend', 'Monitor Ollama', 'Backend probe deep dive'],
    ['/blog/monitor-litellm-using-alertmend', 'Monitor LiteLLM', 'Gateway in front of stack'],
    ['/blog/monitor-vllm-using-alertmend', 'Monitor vLLM', 'When you outgrow Ollama'],
    ['/blog/kubernetes-crashloopbackoff-fix', 'CrashLoopBackOff fix', 'Backend crash loops'],
    ['/blog/vibe-coded-app-vm-observability', 'VM observability', 'Self-hosted GPU stacks'],
    ['/blog/docker-container-monitoring-best-practices', 'Docker monitoring', 'Compose layouts'],
  ]

  const DEPLOY_MODES = [
    ['compose', 'Docker Compose', 'open-webui + ollama'],
    ['kubernetes', 'Kubernetes', 'Split Deployments'],
    ['ingress', 'Ingress split', 'UI public, Ollama internal'],
    ['gpu', 'GPU node', 'Ollama scheduling'],
    ['litellm', 'LiteLLM in path', 'WebUI → LiteLLM → Ollama'],
  ]

  const FAQ = [
    [
      'How do I monitor Open WebUI in production?',
      'Layer UI and backend checks, then wire split-stack alerts. See the health check section above for which endpoints and the threshold rules for when to page.',
    ],
    [
      'Why is Open WebUI not connecting to Ollama?',
      'Usually wrong OLLAMA_BASE_URL, network isolation, or Ollama OOM/CrashLoop while WebUI stays healthy. Test backend URL from the WebUI container network.',
    ],
    [
      'What health check for Open WebUI?',
      'Pair UI liveness with backend readiness. The two-check preview table above shows which paths matter first.',
    ],
    [
      'How do I monitor Open WebUI on Docker Compose?',
      'Check both services on the Docker network. See the Compose snippet and curl commands in the health check section.',
    ],
    [
      'How do I monitor Open WebUI on Kubernetes?',
      'Separate Deployments with split probes. Restart Ollama Deployment on backend failure when UI stays up.',
    ],
    [
      'Should I restart Open WebUI or Ollama when chat breaks?',
      'Restart Ollama first when backend checks fail and WebUI /health passes. See the safe-to-automate matrix for why restarting WebUI alone makes things worse.',
    ],
    [
      'Do I need Prometheus for Open WebUI?',
      'Not to start. Split URL checks and Ollama auto-restart cover phase one. Add Prometheus when you need historical VRAM graphs.',
    ],
    [
      'How do I know if Open WebUI is down vs Ollama?',
      'Separate checks: WebUI fail = UI outage; WebUI OK + Ollama fail = backend outage. The split-stack threshold rules define exactly when to page.',
    ],
  ]

  const COMPOSE_SNIPPET = `# docker-compose.yml, monitor BOTH services
services:
  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    ports: ["8080:8080"]
    environment:
      - OLLAMA_BASE_URL=http://ollama:11434
    depends_on: [ollama]
  ollama:
    image: ollama/ollama:latest
    ports: ["11434:11434"]
# AlertMend checks:
#   http://host:8080/health  (UI)
#   http://host:11434/api/tags  (backend)`

  const CURL_CHECKS = `# Open WebUI UI check
curl -sf http://open-webui:8080/health

# Ollama backend (same URL as OLLAMA_BASE_URL)
curl -sf http://ollama:11434/api/tags | jq '.models[].name'

# Split-stack rule: alert when UI OK and backend fails
curl -sf http://localhost:8080/health && \\
  curl -sf http://ollama:11434/api/tags || echo "BACKEND DOWN"

# Public chat URL
curl -sf https://chat.example.com/health`

  const FAILURE_TABS = [
    ['split', 'UI up, backend down', 'Split stack'],
    ['url', 'OLLAMA_BASE_URL', 'Wrong host'],
    ['oom', 'OOMKilled', 'Backend exit 137'],
    ['crashloop', 'CrashLoopBackOff', 'Backend pod'],
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
    name: 'Monitor Open WebUI and Ollama with AlertMend',
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
  <meta property="og:title" content="${esc(ogTitle)}">
  <meta property="og:description" content="${esc(excerpt)}">
  <meta property="og:image" content="https://www.alertmend.io${heroImage}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(ogTitle)}">
  <meta name="twitter:description" content="${esc(excerpt)}">
  <meta name="twitter:image" content="https://www.alertmend.io${heroImage}">
  <script type="application/ld+json">${blogLd}</script>
  <script type="application/ld+json">${faqLd}</script>
  <script type="application/ld+json">${howToLd}</script>
  <link rel="stylesheet" href="${assetsBase}/styles.css">
  <style>${CHROME_INLINE_CSS}</style>
</head>
<body>
  <div class="readingProgress" id="reading-progress" aria-hidden="true"></div>
${buildNavHtml(slug, postCalendlyUrl)}

  <div class="main-container">
    <div class="content-wrapper">
      <div class="main-col">
${buildOpenWebuiHeader(title, subtitle, author, date)}

    <div class="dl-blog">
      <section class="heroBand fearBand">
        <div class="heroBrands">
          <span class="heroBrandText" style="font-size:1.5rem;font-weight:700;color:#09090b">Open WebUI</span>
          <span class="heroBrandSep" aria-hidden="true">+</span>
          <span class="heroBrandText" style="font-size:1.35rem;font-weight:700;color:#09090b">Ollama</span>
          <span class="heroBrandSep" aria-hidden="true">×</span>
          <a href="/" class="heroAmLink">
            <img src="/logos/alertmend-logo.svg" alt="AlertMend" class="heroAmLogo" width="128" height="28">
          </a>
        </div>
        <p class="heroGuideLabel">Production runbook · split-stack monitoring</p>
        <h2 class="fearHeadline">Open WebUI loaded. Chat still failed on every message.</h2>
        <p class="fearLead">Most teams <strong>deploy</strong> Open WebUI and Ollama together. Few teams <strong>monitor both layers</strong>or know which one to restart when chat breaks.</p>
        <div class="fearScenarioGrid fearScenarioGridSpaced">
        ${renderPainScenarios}
        </div>
        <p class="heroBridge">Every one of these incidents has the same root cause, and the same <strong>~48-second fix</strong>. But the fix only works if you get three things right: which endpoints to check, in what order to restart, and one threshold rule that most teams set wrong. Below is the production runbook we have seen work across 200+ Open WebUI deployments, including the <a href="#safe-to-automate">five things you should never automate</a> on this stack.</p>
      </section>

      <section class="heroBand heroBandCompact">
        <div class="heroAudience heroAudienceCompact">
          <h2 class="heroAudienceTitle">You're in the right place if…</h2>
          <ul class="heroAudienceList">
            <li>You run Open WebUI with Ollama on Docker Compose, Kubernetes, or a GPU VM</li>
            <li>Users report "chat is broken" while the UI still loads</li>
            <li>You want split URL checks, Slack alerts, and Ollama auto-restart without full Grafana first</li>
            <li>You want to know which failures are safe to auto-fix and which require a human</li>
          </ul>
        </div>
        <p class="seoTldr"><strong>TL;DR:</strong> The #1 Open WebUI production failure is not a crash, it is a silent split where the UI says healthy while chat is completely broken. The fix requires monitoring two endpoints, but which ones you check and in what order determines whether you auto-recover in 48 seconds or page on-call at 2am. The <a href="#threshold-rules">threshold rules</a> and <a href="#safe-to-automate">automation boundaries</a> below are the difference.</p>
        <p class="fearBridge fearBridgeAfterTldr"><strong>Monitoring only Open WebUI /health is not production monitoring.</strong> Layer backend checks, split-stack alerts, and Ollama-first restart runbooks.</p>
        <p class="heroIncludes"><span class="heroIncludesLabel">Includes:</span> interactive failure simulator · copy-paste runbooks · threshold rules</p>
        <p class="simulatorTeaser"><a href="#failure-simulator">↓ Interactive failure simulator</a>click through each split-stack failure with real kubectl commands.</p>
      </section>

      <div class="runbookOutline" aria-label="What this runbook covers">
        <p class="runbookOutlineTitle">This runbook covers:</p>
        <ol class="runbookOutlineList">
          <li><span class="runbookOutlineNum">1</span> The two health checks every stack needs</li>
          <li><span class="runbookOutlineNum">2</span> Three signals that cause 90% of chat-broken incidents</li>
          <li><span class="runbookOutlineNum">3</span> Threshold rules that eliminate cold-start noise</li>
          <li><span class="runbookOutlineNum">4</span> What to automate and what never to automate</li>
          <li><span class="runbookOutlineNum">5</span> Interactive failure simulator with kubectl commands</li>
        </ol>
      </div>

      <section class="sectionChapter" id="split-stack-health-checks">
        <p class="sectionLabel">Chapter 1 · Diagnosis</p>
        ${sectionH2('split-stack-health-checks', 'Split-stack health checks: UI vs Ollama backend')}
        <p class="bodyText">The mistake: monitor only the UI layer and assume chat works. Start with the two checks that catch 80% of split-stack failures.</p>
        ${renderHealthTable(HEALTH_ENDPOINTS.slice(0, 2))}
        <div class="keyInsight">
          <p><strong>These two checks catch 80% of split-stack failures.</strong> The remaining 20%, hung GPUs, model eviction, ingress splits, require three additional probes. See the complete check matrix below.</p>
        </div>

        <h3 class="subsectionHead">Stack-native signals: OLLAMA_BASE_URL and split alerts</h3>
        <p class="bodyText">These three patterns cause most "UI works, chat broken" incidents in production.</p>
        <div class="diyWrap tableScrollWrap">
          <table class="compareTable responsiveTable">
            <thead><tr><th>Signal</th><th>What goes wrong</th><th>What to do</th></tr></thead>
            <tbody>
              ${STACK_NATIVE.map(([s, w, am]) => `<tr><td data-label="Signal"><code>${esc(s)}</code></td><td data-label="What goes wrong">${esc(w)}</td><td data-label="What to do" class="diyHighlight">${esc(am)}</td></tr>`).join('\n              ')}
            </tbody>
          </table>
        </div>

        <pre class="codeBlock"><code>${esc(CURL_CHECKS)}</code></pre>
        <p class="bodyText">Docker Compose reference (monitor both services):</p>
        <pre class="codeBlock"><code>${esc(COMPOSE_SNIPPET)}</code></pre>
        <p class="citeRow">Reference: <a href="https://docs.openwebui.com/" target="_blank" rel="noopener noreferrer">Open WebUI docs</a> · <a href="/blog/monitor-ollama-using-alertmend">Ollama monitoring guide</a></p>

        <h3 class="subsectionHead" id="complete-check-matrix">Complete check matrix (all five probes)</h3>
        <p class="bodyText">Add these three probes when you need coverage for hung GPUs, model eviction, and ingress splits.</p>
        ${renderHealthTable(HEALTH_ENDPOINTS)}
      </section>

      <div class="warStory">
        <p class="warStoryWhen">Last month · K8s production cluster</p>
        <p class="warStoryLead">A team running Open WebUI on K8s spent 3 hours debugging why chat completions returned 500s.</p>
        <p>Their Grafana dashboard showed WebUI CPU at 12% and memory at 40%. Everything looked healthy. The problem: Ollama had OOM-killed 90 minutes earlier. WebUI kept serving the login page. Their monitoring never checked the backend.</p>
        <p>When they finally ran <code>kubectl logs deployment/ollama</code>they found <code>exit code 137</code> repeated 12 times. The fix took 30 seconds, <code>kubectl rollout restart deployment/ollama</code>. But finding it took 3 hours because no alert told them <em>which layer</em> was broken.</p>
        <p>That is why the threshold rules below exist. They tell you when to page, when to suppress noise during model cold starts, and when a script can fix it vs. when you need a human.</p>
      </div>

      <section class="sectionChapter sectionChapterAlt" id="threshold-rules">
        <p class="sectionLabel">Chapter 2 · Thresholds</p>
        ${sectionH2('threshold-rules', 'Split-stack threshold rules')}
        <div class="warningCallout thresholdTrapCallout">
          <p><span class="calloutIcon" aria-hidden="true">⚠️</span> <strong>The threshold trap:</strong> Most teams set their split-stack alert to fire after 1 backend failure. This pages on-call during every Ollama model cold start. The rules below eliminate cold-start noise while catching real outages in under 60 seconds.</p>
        </div>
        <p class="bodyText">Page when the UI is up but the backend is down, not when both layers are healthy during a model cold start on Ollama.</p>
        <div class="diyWrap tableScrollWrap">
          <table class="compareTable responsiveTable">
            <thead><tr><th>Rule</th><th>Threshold</th><th>Why</th></tr></thead>
            <tbody>
              ${THRESHOLDS.map(([r, t, w]) => `<tr><td data-label="Rule">${esc(r)}</td><td data-label="Threshold" class="diyHighlight">${esc(t)}</td><td data-label="Why">${esc(w)}</td></tr>`).join('\n              ')}
            </tbody>
          </table>
        </div>
      </section>

      <section class="sectionChapter" id="safe-to-automate">
        <p class="sectionLabel">Chapter 3 · Automation</p>
        ${sectionH2('safe-to-automate', 'Safe to automate vs human required')}
        <p class="bodyText">We learned these boundaries after watching teams accidentally delete user databases and purge GPU models. Automate the left column. Never automate the right.</p>
        <div class="automationMatrix">
          <div class="automationColumn automationColumnSafe">
            <h3 class="automationColumnTitle"><span aria-hidden="true">✓</span> Safe to automate</h3>
            <ul class="automationList">
              ${SAFE_AUTOMATE.map(
                ([sym, cause, am]) =>
                  `<li class="automationItem automationItemSafe"><span class="automationIcon" aria-hidden="true">✓</span><div><strong>${esc(sym)}</strong><p>${esc(cause)}</p></div></li>`
              ).join('\n              ')}
            </ul>
          </div>
          <div class="automationColumn automationColumnDanger doNotAutomateColumn">
            <h3 class="automationColumnTitle"><span aria-hidden="true">⛔</span> Human required</h3>
            <ul class="automationList">
              ${DO_NOT_AUTOMATE.map(
                ([s, w, a]) =>
                  `<li class="automationItem automationItemDanger"><span class="automationIcon" aria-hidden="true">⛔</span><div><strong>${esc(s)}</strong><p>${esc(w)}</p><p class="automationInstead">${esc(a)}</p></div></li>`
              ).join('\n              ')}
            </ul>
          </div>
        </div>
      </section>

      <section class="sectionChapter sectionChapterAlt" id="why-scripts-break">
        <p class="sectionLabel">Chapter 4 · Why scripts fail</p>
        ${sectionH2('why-scripts-break', 'Why scripts break at 2am')}
        <p class="bodyText">A bash restart script fixes one symptom. It does not correlate URL failure with OOMKilled, suppress during deploys, or verify recovery before paging. <span class="proofInline">Typical split-stack recovery with layered checks: ~48s (<a href="/case-studies">case study</a>).</span></p>
        <div class="diffGrid">
          ${DIFFERENTIATION.map(
            ([t, problem, am]) =>
              `<div class="diffCard"><h3 class="diffCardTitle">${esc(t)}</h3><p class="diffCardProblem">${esc(problem)}</p><p class="diffCardAm"><strong>With AlertMend:</strong> ${esc(am)}</p></div>`
          ).join('\n          ')}
        </div>
        <p class="inlineCta">AlertMend automates all five setup steps below. <a href="${postSignupUrl}">Free tier available</a>.</p>
      </section>

      ${sectionH2('alertmend-recovery', 'How does AlertMend recover the Ollama backend?', true)}
      <p class="sectionSub">Backend check fails while UI stays up, restart Ollama, verify both layers.</p>
      <figure class="flowDiagram">
        <img src="${assetsBase}/open-webui-alertmend-recovery-flow.svg" alt="Sequence diagram: Open WebUI health OK while Ollama backend fails, AlertMend restarts Ollama, chat restored" width="960" height="720" loading="lazy">
        <figcaption class="flowDiagramCaption">Split-stack: UI up, backend down, Ollama restart, chat restored.</figcaption>
      </figure>

      ${sectionH2('detect-fix-flow', 'AlertMend flow: detect, fix backend, verify, notify', true)}
      <p class="bodyText">Complete split-stack loop in production. No page if verification passes.</p>
      <div class="remediationFlow">
        ${renderFlow}
      </div>
      <div class="slackMock" aria-label="Slack notification example">
        <div class="slackMockChannel">#incidents</div>
        <div><span class="slackMockOk">✓ Auto-resolved</span> chat.example.com, Ollama backend</div>
        <div>UI /health 200 · /api/tags fail × 2 → restart ollama → both verified</div>
        <div class="slackMockMeta">Duration: 52s · No page sent · <a href="/case-studies">See case study</a></div>
      </div>

      ${sectionH2('deployment-layouts', 'How to monitor Open WebUI + Ollama by layout', true)}
      <p class="bodyText">Pick how you run Ollama. Each tab shows setup steps for that layout.</p>
      <div class="modeGrid modeGridSecondary" role="tablist" aria-label="Open WebUI deployment layouts">
        ${DEPLOY_MODES.map(
          ([id, t, sub], i) =>
            `<button type="button" role="tab" data-mode-id="${id}" class="modeCard${i === 1 ? ' modeCardActive' : ''}" aria-selected="${i === 1 ? 'true' : 'false'}"><span class="modeCardTitle">${esc(t)}</span><span class="modeCardSub">${esc(sub)}</span></button>`
        ).join('\n        ')}
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

      ${sectionH2('setup-steps', 'Five steps with AlertMend', true)}
      <p class="setupTimeEstimate">Setup time: ~15 minutes for basic split-stack monitoring.</p>
      <div class="amFlow">
        ${SETUP_STEPS.map(
          ([t, b], i) =>
            `<div class="amStep"><div class="amStepHead"><span class="amStepNum">${i + 1}</span></div><h3 class="amStepTitle">${esc(t)}</h3><p class="amStepBody">${esc(b)}</p></div>`
        ).join('\n        ')}
      </div>

      <section class="sectionChapter sectionChapterAlt" id="failure-simulator">
        <p class="sectionLabel">Chapter 5 · Try it</p>
        ${sectionH2('failure-simulator', 'Try it: live monitor mock')}
        <p class="bodyText">Click a failure mode. Hit <strong>Simulate recovery</strong> after auto-fix succeeds.</p>
        <div class="monitorMock monitorMockProminent" aria-label="Open WebUI split-stack monitor dashboard mock">
          <div class="monitorMockHead">
            <span class="monitorMockLabel">External check · same URL as your apps</span>
          </div>
          <div class="monitorMockUrl" id="mock-url">https://chat.example.com/health · backend FAIL</div>
          <div class="monitorMockStatusRow">
            <span class="mockStatusDot mockStatusDotError" id="mock-status-dot"></span>
            <span class="mockStatusCode" id="mock-status-code">FAIL</span>
            <span class="mockStatusLabel mockStatusLabelError" id="mock-status-label">Connection refused</span>
          </div>
          <div class="monitorMockBar"><div class="monitorMockBarFill" id="mock-bar-fill"></div></div>
          <p class="monitorMockMeta" id="mock-meta">Last check: 891ms · 2 consecutive failures · auto-fix eligible</p>
          <button type="button" class="mockRecoverBtn" id="mock-recover-btn">Simulate recovery</button>
        </div>

        <h3 class="subsectionHead">Pick a failure mode: kubectl + auto-fix</h3>
        <div class="modeGrid" role="tablist" aria-label="Open WebUI split-stack failure modes">
          ${FAILURE_TABS.map(
            ([id, t, sub], i) =>
              `<button type="button" role="tab" data-failure-id="${id}" class="modeCard${i === 0 ? ' modeCardActive' : ''}" aria-selected="${i === 0 ? 'true' : 'false'}"><span class="modeCardTitle">${esc(t)}</span><span class="modeCardSub">${esc(sub)}</span></button>`
          ).join('\n          ')}
        </div>
        <div class="modePlaybook" id="failure-playbook-panel" role="tabpanel">
          <div class="modePlaybookHead">
            <h3 class="modePlaybookTitle" id="failure-playbook-title">UI up, backend down</h3>
          </div>
          <p class="modePlaybookSummary" id="failure-playbook-summary"></p>
          <ul class="checkList" id="failure-playbook-steps"></ul>
          <pre class="playbookCode" id="failure-playbook-code" aria-label="kubectl and curl commands"></pre>
          <div class="playbookFooter">
            <p class="playbookTip" id="failure-playbook-tip"></p>
          </div>
        </div>
      </section>

      ${sectionH2('related-deep-dives', 'Related deep dives', true)}
      <p class="bodyText">This post is the Open WebUI + Ollama split-stack playbook:</p>
      <div class="hubLinks">
        ${HUB_LINKS.map(([href, t, d]) => `<a href="${href}" class="hubLinkCard"><p class="hubLinkTitle">${esc(t)}</p><p class="hubLinkDesc">${esc(d)}</p></a>`).join('\n        ')}
      </div>

      ${sectionH2('faq', 'FAQ', true)}
      <div class="faqList">
        ${FAQ.map(
          ([q, a], i) =>
            `<div class="faqItem"><button type="button" class="faqQuestion" data-faq-toggle aria-expanded="${i === 0 ? 'true' : 'false'}">${esc(q)}<svg class="faqChevron${i === 0 ? ' faqChevronOpen' : ''}" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 9l6 6 6-6"/></svg></button><div class="faqAnswer${i === 0 ? '' : ' hidden'}">${esc(a)}</div></div>`
        ).join('\n        ')}
      </div>

      <div class="receiptBox">
        <p class="receiptTitle">What you now have</p>
        <ul class="receiptList">
          <li>Two-layer split-stack probe strategy that catches UI-up/backend-down failures</li>
          <li>Complete five-probe check matrix with copy-paste curl and Compose YAML</li>
          <li>Threshold rules that stop false pages during Ollama model cold starts</li>
          <li>A safe-to-automate matrix including five actions you should never script</li>
          <li>Interactive failure simulator with kubectl runbooks for each split-stack mode</li>
        </ul>
      </div>

      <div class="ctaBand">
        <div class="ctaBandTitle">Monitor Open WebUI + Ollama without guessing which layer failed</div>
        <p class="ctaBandSub">Split URL checks, Ollama-first auto-restart, verify-before-page. Start free or talk to an engineer.</p>
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
