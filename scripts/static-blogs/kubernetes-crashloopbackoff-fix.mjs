/**
 * Code-generated rich blog: Kubernetes CrashLoopBackOff fix runbook.
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

const DEFAULT_EXCERPT =
  'CrashLoopBackOff fix: answer in the last terminated container, not the current one. Five-step workflow, annotated kubectl output, failure-mode playbooks.'

function estimateReadMinutes(...textBlocks) {
  const words = textBlocks.join(' ').split(/\s+/).filter(Boolean).length
  return Math.max(10, Math.round(words / 250))
}

function buildCrashloopHeader(title, author, date, category, readMins) {
  return `
    <header class="article-header">
      <h1>${esc(title)}</h1>
      <div class="author-info">
        <div class="author-avatar">${author.charAt(0)}</div>
        <div>
          <div class="author-name">${esc(author)}</div>
          <div class="author-meta">${esc(date)} · ${readMins} min read · ${category}</div>
        </div>
      </div>
      <span class="category-tag">${esc(category)}</span>
    </header>`
}

const COPY_BTN_SVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>`

function codeBlock(code) {
  return `<div class="codeBlockWrap">
  <button type="button" class="codeCopyBtn" aria-label="Copy code to clipboard">${COPY_BTN_SVG}<span class="codeCopyLabel">Copy</span></button>
  <span class="codeCopyToast" aria-live="polite"></span>
  <pre class="codeBlock"><code>${esc(code)}</code></pre>
</div>`
}

function renderPlaybookSection({ id, title, badge, summary, events, logs, steps, fixCode, verify, tip, autoFix }) {
  const stepsHtml = steps.map((s) => `<li>${esc(s)}</li>`).join('\n          ')
  return `<section class="failurePlaybook" id="${id}">
        <h3 class="failurePlaybookTitle">${esc(title)}${badge ? ` <span class="failurePlaybookBadge">${esc(badge)}</span>` : ''}</h3>
        <p class="failurePlaybookSummary">${summary}</p>
        <h4 class="failurePlaybookSubhead">What you see in Events</h4>
        <pre class="eventsExample"><code>${esc(events)}</code></pre>
        <h4 class="failurePlaybookSubhead">What you see in logs --previous</h4>
        <p class="failurePlaybookLogs">${logs}</p>
        <h4 class="failurePlaybookSubhead">Diagnostic steps</h4>
        <ul class="checkList">${stepsHtml}</ul>
        <h4 class="failurePlaybookSubhead">Fix</h4>
        ${codeBlock(fixCode)}
        <h4 class="failurePlaybookSubhead">Verify</h4>
        <p class="failurePlaybookVerify">${verify}</p>
        ${tip ? `<div class="stepTip"><span>${tip}</span></div>` : ''}
        ${autoFix ? `<p class="autofixBadge">Typical fix: ${esc(autoFix)}</p>` : ''}
      </section>`
}

export async function build(slug) {
  const assetsBase = `/assets/${slug}`
  const canonical = `${SITE_URL}/blog/${slug}`
  const heroImage = `${assetsBase}/crashloop-hero.svg`

  const meta = parseFrontmatter(slug)
  const title = meta.title || 'CrashLoopBackOff in Kubernetes: Diagnose, Fix, and Prevent'
  const excerpt = meta.excerpt || DEFAULT_EXCERPT
  const date = meta.date || '2026-06-24'
  const category = meta.category || 'Kubernetes'
  const author = meta.author || 'Himanshu Bansal'
  const keywords =
    meta.keywords ||
    'crashloopbackoff kubernetes fix, kubernetes crashloopbackoff, crash loop back off, kubectl crashloopbackoff, pod crashloopbackoff fix, kubernetes pod restarting'

  const relatedPosts = getRelatedPosts(slug, category)
  const postSignupUrl = signupUrl(slug, 'blog-crashloop')
  const postCalendlyUrl = calendlyUrl(slug)

  const PAIN_SCENARIOS = [
    {
      when: 'OOM looks like a bug',
      title: 'Exit 137, restart count 47.',
      body: 'logs --previous were empty. On-call spent an hour debugging "application code." The actual cause was somewhere they never looked.',
      anchor: '#failure-oom',
    },
    {
      when: 'After helm upgrade, 11:03am',
      title: 'Every pod in CrashLoopBackOff.',
      body: 'The backoff timer climbed to 5 minutes. The container was healthy — Kubernetes disagreed.',
      anchor: '#failure-probe',
    },
    {
      when: 'Init container succeeded',
      title: 'Main container still loops.',
      body: 'kubectl logs showed "connection refused." One renamed key hid in plain sight.',
      anchor: '#failure-config',
    },
    {
      when: 'Grafana pod restart graph spiked',
      title: 'Nobody knew which deploy caused it.',
      body: 'CrashLoopBackOff started 4 minutes after a rollout. Nobody could tell which deploy caused it — until they checked one command.',
      anchor: '#failure-deploy',
    },
  ]

  const LIFECYCLE_STATES = [
    ['Running', 'Container started and passed probes', 'Normal operation'],
    ['Error', 'Container exited with non-zero code', 'Check logs --previous for stack trace'],
    ['CrashLoopBackOff', 'Kubelet backing off before next restart', 'Read Events: Back-off restarting failed container'],
    ['OOMKilled', 'Kernel killed container over memory limit', 'Exit 137, raise limits or fix leak'],
    ['ImagePullBackOff', 'Cannot pull image', 'Different failure, see ImagePullBackOff runbook'],
  ]

  const DEBUG_STEPS = [
    ['Find crashing pods', 'Run kubectl get pods -o wide. Confirm CrashLoopBackOff status and restart count. Note the node; GPU or memory pressure can be node-specific.'],
    ['Read pod Events', 'Run kubectl describe pod and scroll to Events. Look for Liveness probe failed, OOMKilled, Error, or CreateContainerConfigError.'],
    ['Get logs from the last crash', 'Run kubectl logs <pod> --previous. The current instance may be empty if the container died immediately.'],
    ['Check deploy timeline', 'Run kubectl get events --sort-by=.lastTimestamp. Did the crash start right after a rollout or ConfigMap change?'],
    ['Fix root cause, then verify', 'Restart count should stop climbing. Watch for 2+ minutes before closing the incident.'],
  ]

  const HOWTO_STEPS = [
    ['Find crashing pods', 'kubectl get pods -o wide — confirm CrashLoopBackOff status and restart count'],
    ['Read pod Events', 'kubectl describe pod — scroll to Events for probe, OOM, or config errors'],
    ['Get logs from the last crash', 'kubectl logs <pod> --previous — read the last terminated container'],
    ['Check deploy timeline', 'kubectl get events --sort-by=.lastTimestamp — correlate crash with rollout'],
    ['Fix root cause, then verify', 'Restart count should stop climbing for 2+ minutes before closing the incident'],
  ]

  const DO_NOT_AUTOMATE = [
    ['Delete StatefulSet PVC', 'Data loss', 'Human approval only'],
    ['Change production Secrets blindly', 'Security and config risk', 'Review diff + staged rollout'],
    ['Scale to zero in prod', 'Outage', 'Maintenance window'],
    ['Force delete pod on every crash', 'Masks root cause', 'Diagnose logs --previous first'],
  ]

  const HUB_LINKS = [
    ['/blog/kubernetes-imagepullbackoff-fix', 'ImagePullBackOff fix', 'When the image never starts, different status'],
    ['/blog/debugging-kubernetes-oomkilled-exit-code-137-causes-and-solutions', 'OOMKilled exit 137', 'Memory limits and eviction'],
    ['/blog/kubernetes-exit-code-137', 'Exit code 137', 'Quick reference for OOM signal'],
    ['/blog/503-no-healthy-upstream', '503 No Healthy Upstream', 'When pods crash during rollout and endpoints drain'],
    ['/blog/monitor-vllm-using-alertmend', 'Monitor vLLM', 'Probe misconfig on GPU inference pods'],
    ['/blog/monitor-ollama-using-alertmend', 'Monitor Ollama', 'Model-load grace and startupProbe patterns'],
  ]

  const PROBE_FIX_YAML = `# startupProbe: protect slow-start apps (migrations, model load)
startupProbe:
  httpGet:
    path: /health
    port: 8080
  failureThreshold: 30
  periodSeconds: 10
# liveness: shallow check only (never put expensive checks here)
livenessProbe:
  httpGet:
    path: /health
    port: 8080
  periodSeconds: 20
  failureThreshold: 3
# readiness: traffic gate (can be stricter than liveness)
readinessProbe:
  httpGet:
    path: /ready
    port: 8080
  periodSeconds: 10
  failureThreshold: 3`

  const FAILURE_PLAYBOOKS = [
    {
      id: 'failure-probe',
      title: 'Probe failure',
      badge: 'Liveness / readiness',
      summary:
        'Liveness or readiness probes fail during startup. Kubernetes kills the container before migrations, cache warm, or model load finish.',
      events: `Warning  Unhealthy  3m   Readiness probe failed: HTTP probe failed with statuscode: 503
Warning  Unhealthy  3m   Liveness probe failed: Get "http://10.244.1.42:8080/health": dial tcp 10.244.1.42:8080: connect: connection refused
Normal   Killing    3m   Container api failed liveness probe, will be restarted`,
      logs:
        'Often empty or shows the app mid-startup. The probe killed the container before it could log a fatal error. Check describe Events first.',
      steps: [
        'kubectl describe pod: grep Events for probe failures',
        'Check if crash started right after deploy (probe config change)',
        'Add startupProbe with high failureThreshold (see YAML below)',
        'Move expensive checks off liveness. Keep liveness shallow.',
        'Verify pod stays Ready for 2+ minutes after fix',
      ],
      fixCode: `# Diagnose
kubectl describe pod <pod-name> -n <namespace> | grep -A20 "Events:"
kubectl get pod <pod-name> -o yaml | grep -A15 "livenessProbe\\|readinessProbe\\|startupProbe"

# Fix: add startupProbe to Deployment
${PROBE_FIX_YAML}

kubectl apply -f deployment-with-startup-probe.yaml
kubectl rollout status deployment/<name> -n <namespace>`,
      verify:
        'kubectl get pods shows Running with restart count stable for 2+ minutes. No new Unhealthy or Killing events in describe.',
      tip: '<strong>GPU/LLM inference pods (Ollama, vLLM, LiteLLM):</strong> Model load can take 2–5 minutes. startupProbe failureThreshold should be measured in minutes, not seconds. See <a href="/blog/monitor-ollama-using-alertmend">Ollama</a> and <a href="/blog/monitor-vllm-using-alertmend">vLLM</a> runbooks.',
      autoFix: 'Add startupProbe · Lengthen failureThreshold · Keep liveness shallow',
    },
    {
      id: 'failure-oom',
      title: 'OOMKilled (exit 137)',
      badge: 'Memory limit',
      summary:
        'Container exceeded memory limits. The kernel kills the process instantly — often before logs flush.',
      events: `Warning  BackOff    2m   Back-off restarting failed container
Warning  Failed     3m   Error: OOMKilled
Normal   Pulled     3m   Container image already present on machine`,
      logs:
        'Often empty. The kernel sent SIGKILL (exit 137) before the process could write to stdout. describe pod Last State is your primary signal.',
      steps: [
        'kubectl describe pod: Last State Terminated, Reason OOMKilled',
        'Compare memory limits to application heap or model size',
        'kubectl top pod to see live usage vs limit',
        'Raise limits or fix memory leak',
        'Restart once if transient spike; escalate if OOM repeats within 15 min',
      ],
      fixCode: `# Diagnose
kubectl describe pod <pod-name> -n <namespace> | grep -A8 "Last State"
kubectl top pod <pod-name> -n <namespace>

# Check node memory pressure
kubectl describe node <node-name> | grep -A5 "Allocated resources"

# Fix: raise limits in Deployment
kubectl patch deployment <name> -n <namespace> --type='json' \\
  -p='[{"op":"replace","path":"/spec/template/spec/containers/0/resources/limits/memory","value":"512Mi"}]'

kubectl rollout restart deployment/<name> -n <namespace>`,
      verify:
        'describe shows Last State Reason no longer OOMKilled. Restart count stable. No new OOMKilled events for 2+ minutes.',
      tip: 'See <a href="/blog/debugging-kubernetes-oomkilled-exit-code-137-causes-and-solutions">OOMKilled exit 137 deep dive</a> for JVM, Node, and LLM memory patterns.',
      autoFix: 'Raise memory limits · Restart once after fix · Watch for repeat OOM',
    },
    {
      id: 'failure-config',
      title: 'Config / Secret error',
      badge: 'Secret / env',
      summary:
        'App exits on boot: missing env var, wrong Secret key, invalid ConfigMap mount.',
      events: `Warning  Failed     1m   Error: secret "db-credentials" not found
Warning  Failed     1m   CreateContainerConfigError: couldn't find key DATABASE_URL in Secret production/db-credentials
Warning  BackOff    2m   Back-off restarting failed container`,
      logs: `Error: Missing required environment variable DATABASE_URL
connection refused: postgres://...@db:5432/app
FATAL: could not connect to database`,
      steps: [
        'kubectl logs <pod> --previous for "missing" or "connection refused"',
        'kubectl describe pod for CreateContainerConfigError events',
        'kubectl get secret <name> -o jsonpath (check keys exist)',
        'Diff deployment env against last working revision',
        'Fix Secret/ConfigMap, then rollout restart',
      ],
      fixCode: `# Diagnose
kubectl logs <pod-name> -n <namespace> --previous --tail=50
kubectl describe pod <pod-name> -n <namespace> | grep -i "config\\|secret\\|env"

# List keys (not values) in Secret
kubectl get secret <secret-name> -n <namespace> -o jsonpath='{.data}' | jq 'keys'

# Compare with deployment env refs
kubectl get deployment <name> -n <namespace> -o yaml | grep -A30 "env:"

# Fix: update Secret or deployment env key name
kubectl apply -f fixed-secret.yaml
kubectl rollout restart deployment/<name> -n <namespace>`,
      verify:
        'No CreateContainerConfigError in Events. logs --previous shows app starting, not immediate exit. Pod reaches Running.',
      tip: 'Init containers that only check file existence miss wrong Secret values. Init passed; main container failed on connect.',
      autoFix: 'Fix Secret key · kubectl apply · rollout restart',
    },
    {
      id: 'failure-deploy',
      title: 'Post-deploy crash',
      badge: 'Rollback path',
      summary:
        'CrashLoopBackOff started within minutes of helm upgrade or kubectl apply. The fix is often rollback, not more restarts.',
      events: `Normal   ScalingReplicaSet  4m   Scaled up replica set api-7f9c2b8d4 to 3
Warning  BackOff            3m   Back-off restarting failed container
Warning  Unhealthy          3m   Readiness probe failed: HTTP 503`,
      logs:
        'May show app errors from the bad revision — stack trace, config mismatch, or probe failure introduced by the deploy.',
      steps: [
        'kubectl rollout history deployment/<name>',
        'Note revision number before the bad deploy',
        'kubectl rollout undo deployment/<name>',
        'kubectl rollout status until Ready',
        'Compare crash start time in Events to rollout timestamp',
      ],
      fixCode: `# Diagnose timeline
kubectl get events -n <namespace> --sort-by='.lastTimestamp' | tail -20
kubectl rollout history deployment/<name> -n <namespace>

# Rollback
kubectl rollout undo deployment/<name> -n <namespace>
kubectl rollout status deployment/<name> -n <namespace> --timeout=180s

# Verify pods healthy
kubectl get pods -l app=<label> -n <namespace>`,
      verify:
        'All replicas Running. Restart count not climbing. Rollout history shows reverted revision.',
      tip: 'If crash started within 10 min of rollout, undo before debugging application code.',
      autoFix: 'kubectl rollout undo · Verify Ready for 2+ min',
    },
    {
      id: 'failure-entrypoint',
      title: 'Bad command or entrypoint',
      badge: 'Exit 127 / 1',
      summary:
        'Image starts but binary path is wrong, shebang missing, or entrypoint script not executable.',
      events: `Warning  BackOff    2m   Back-off restarting failed container
Warning  Failed     3m   Error: container api exited with code 127`,
      logs: `/bin/sh: 1: /app/start.sh: not found
exec: "/usr/local/bin/myapp": stat /usr/local/bin/myapp: no such file or directory
standard_init_linux.go: exec user process caused: no such file or directory`,
      steps: [
        'kubectl logs <pod> --previous — look for exit 127 or "not found"',
        'Verify CMD/ENTRYPOINT in Dockerfile matches image contents',
        'kubectl run --rm -it debug --image=<same-image> -- /bin/sh to inspect paths',
        'Fix Dockerfile or deployment command/args',
        'Rebuild image and redeploy',
      ],
      fixCode: `# Diagnose
kubectl logs <pod-name> -n <namespace> --previous --tail=30
kubectl get pod <pod-name> -o jsonpath='{.spec.containers[0].command}'

# Interactive debug (same image)
kubectl run debug-shell --rm -it --restart=Never \\
  --image=<your-image>:<tag> -n <namespace> -- /bin/sh

# Fix: correct command in Deployment
kubectl patch deployment <name> -n <namespace> --type='json' \\
  -p='[{"op":"replace","path":"/spec/template/spec/containers/0/command","value":["/app/server"]}]'`,
      verify:
        'logs --previous shows app startup logs, not shell errors. Container stays Running with stable restart count.',
      tip: 'Exit 127 almost always means wrong path or missing binary — not application logic.',
      autoFix: 'Fix CMD/ENTRYPOINT · Rebuild image · Redeploy',
    },
    {
      id: 'failure-init',
      title: 'Init container dependency failure',
      badge: 'Init vs main',
      summary:
        'Init container passed a shallow check; main container fails because the dependency is not actually ready.',
      events: `Normal   Started    2m   Started container init-wait
Normal   Pulled     2m   Container image "busybox" already present
Normal   Created    2m   Created container init-wait
Normal   Started    1m   Started container api
Warning  BackOff    1m   Back-off restarting failed container`,
      logs: `connection refused: postgres://db:5432
waiting for database: dial tcp 10.96.0.5:5432: connect: connection refused`,
      steps: [
        'kubectl logs <pod> -c <init-container> — what did init actually check?',
        'kubectl logs <pod> --previous — main container error',
        'Init should wait for TCP open or HTTP 200, not just file mount',
        'Add proper wait-for-it or init probe pattern',
        'Fix init container script, redeploy',
      ],
      fixCode: `# Diagnose both containers
kubectl logs <pod-name> -c init-wait -n <namespace>
kubectl logs <pod-name> -n <namespace> --previous --tail=50

# Fix: init waits for TCP, not file existence
# initContainers:
#   - name: wait-for-db
#     image: busybox:1.36
#     command: ['sh', '-c', 'until nc -z db 5432; do sleep 2; done']

kubectl apply -f deployment-with-proper-init.yaml
kubectl rollout status deployment/<name> -n <namespace>`,
      verify:
        'Init logs show successful wait. Main container starts and stays Running. No connection refused in logs --previous.',
      tip: 'File-existence checks pass even when Secret values are wrong. TCP/HTTP checks catch real readiness.',
      autoFix: 'Fix init wait logic · Redeploy · Verify main container connects',
    },
  ]

  const FAQ = [
    [
      'What is CrashLoopBackOff in Kubernetes?',
      'CrashLoopBackOff means a container keeps exiting and Kubernetes is waiting longer between restart attempts (exponential backoff: 10s, 20s, 40s, up to 5 minutes). Fix the root cause in logs --previous, not by deleting the pod repeatedly.',
    ],
    [
      'How do I fix CrashLoopBackOff?',
      'Run kubectl describe pod and kubectl logs <pod> --previous. Fix the error shown (probe, OOM, missing env, bad image). If it started after a deploy, try kubectl rollout undo.',
    ],
    [
      'Why is kubectl logs empty during CrashLoopBackOff?',
      'The current container may have died before writing logs. Use kubectl logs <pod> --previous to read the last crashed instance.',
    ],
    [
      'CrashLoopBackOff vs ImagePullBackOff?',
      'ImagePullBackOff means Kubernetes cannot pull the container image. CrashLoopBackOff means the image pulled but the container process exits repeatedly.',
    ],
    [
      'Should I delete the pod to fix CrashLoopBackOff?',
      'Deleting forces an immediate restart but does not fix config errors, OOM, or bad probes. Diagnose first. Delete only after fixing root cause or when wedged in long backoff.',
    ],
    [
      'How do I know if a liveness probe caused the crash?',
      'kubectl describe pod shows Liveness probe failed in Events. The container restarts even though the app might have recovered if given more startup time.',
    ],
    [
      'How do I prevent CrashLoopBackOff on deploy?',
      'Use startupProbe for slow-start apps, set realistic memory limits, validate Secrets in CI, and add deploy grace on probes so liveness does not kill pods during migrations.',
    ],
    [
      'CrashLoopBackOff on GPU / LLM pods?',
      'Model load can take 2–5 minutes. Without startupProbe grace, liveness kills the container during weight load. See our Ollama and vLLM monitoring runbooks for probe patterns on inference workloads.',
    ],
  ]

  const KUBECTL_CHEATSHEET = `# 1. Find crashing pods
kubectl get pods -A | grep -i crash
kubectl get pods -o wide -n <namespace>

# 2. Events and probe failures
kubectl describe pod <pod-name> -n <namespace>
kubectl get events -n <namespace> --field-selector involvedObject.name=<pod-name> --sort-by='.lastTimestamp'

# 3. Logs from the LAST crash (most important)
kubectl logs <pod-name> -n <namespace> --previous --tail=100

# 4. Multi-container: pick the crashing container
kubectl logs <pod-name> -c <container-name> --previous

# 5. Rollback if crash started after deploy
kubectl rollout history deployment/<name> -n <namespace>
kubectl rollout undo deployment/<name> -n <namespace>
kubectl rollout status deployment/<name> -n <namespace>`

  const DESCRIBE_ANNOTATED = `Name:             api-7f9c2b8d4-xk2mn
Namespace:        production
Status:           Running
IP:               10.244.1.42
...
Containers:
  api:
    State:          Waiting
      Reason:       CrashLoopBackOff          ← status you see in kubectl get pods
    Last State:     Terminated
      Reason:       OOMKilled                 ← root cause: memory, not "random crash"
      Exit Code:    137                       ← 137 = OOMKilled (check limits)
    Restart Count:  14
    Limits:
      memory:       256Mi                     ← often too low for JVM / Node / LLM
...
Events:
  Type     Reason     Age   Message
  ----     ------     ----  -------
  Warning  BackOff    2m    Back-off restarting failed container    ← timer, not cause
  Warning  Unhealthy  3m    Liveness probe failed: HTTP 503         ← probe killing pod?
  Normal   Killing    3m    Container api failed liveness probe       ← fix startupProbe`

  const RESOLVED_POD = `NAME                    READY   STATUS    RESTARTS   AGE
api-7f9c2b8d4-xk2mn     1/1     Running   14         47m
                        ↑                  ↑
                   healthy            stable — not climbing`

  const renderScenario = ({ when, title, body, anchor }) =>
    `<div class="fearScenario"><p class="fearScenarioWhen">${esc(when)}</p><p class="fearScenarioTitle">${esc(title)}</p><p class="fearScenarioBody">${esc(body)}</p><a href="${anchor}" class="fearScenarioLink">→ See what we found</a></div>`

  const mobileLeadScenario = renderScenario(PAIN_SCENARIOS[0])
  const moreScenarios = PAIN_SCENARIOS.slice(1).map(renderScenario).join('\n        ')
  const allScenariosDesktop = PAIN_SCENARIOS.map(renderScenario).join('\n        ')

  const playbooksHtml = FAILURE_PLAYBOOKS.map(renderPlaybookSection).join('\n      ')

  const faqLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map(([q, a]) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  })

  const readMins = estimateReadMinutes(
    title,
    excerpt,
    ...FAQ.flat(),
    ...DEBUG_STEPS.flat(),
    ...FAILURE_PLAYBOOKS.map((p) => [p.summary, p.events, p.logs, p.verify].join(' ')),
    KUBECTL_CHEATSHEET,
    DESCRIBE_ANNOTATED
  )

  const howToLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to fix CrashLoopBackOff in Kubernetes',
    description: excerpt,
    totalTime: 'PT10M',
    tool: [{ '@type': 'HowToTool', name: 'kubectl' }],
    step: HOWTO_STEPS.map(([name, text], i) => ({
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

  const decisionFlowHtml = `
      <nav class="decisionFlow" aria-label="CrashLoopBackOff diagnostic decision tree: start with kubectl describe pod, read Events, then branch to five paths">
        <div class="decisionFlowStart">
          <span class="decisionFlowNode decisionFlowNodeDark">Pod: CrashLoopBackOff</span>
          <span class="decisionFlowArrow" aria-hidden="true">↓</span>
          <span class="decisionFlowNode decisionFlowNodeAccent">kubectl describe pod → read Events</span>
        </div>
        <div class="decisionFlowBranches">
          <a href="#failure-oom" class="decisionFlowBranch decisionFlowOom">
            <span class="decisionFlowBranchTitle">OOMKilled</span>
            <span class="decisionFlowBranchSub">Exit 137 → raise limits</span>
          </a>
          <a href="#failure-probe" class="decisionFlowBranch decisionFlowProbe">
            <span class="decisionFlowBranchTitle">Probe failed</span>
            <span class="decisionFlowBranchSub">Liveness/readiness → startupProbe</span>
          </a>
          <a href="#failure-config" class="decisionFlowBranch decisionFlowConfig">
            <span class="decisionFlowBranchTitle">Config error</span>
            <span class="decisionFlowBranchSub">Secret/env → fix keys</span>
          </a>
          <a href="#failure-entrypoint" class="decisionFlowBranch decisionFlowApp">
            <span class="decisionFlowBranchTitle">App exit</span>
            <span class="decisionFlowBranchSub">logs --previous → stack trace</span>
          </a>
          <a href="#failure-deploy" class="decisionFlowBranch decisionFlowDeploy">
            <span class="decisionFlowBranchTitle">After deploy</span>
            <span class="decisionFlowBranchSub">4 min post-rollout → rollout undo</span>
          </a>
        </div>
        <div class="decisionFlowEnd">
          <span class="decisionFlowArrow" aria-hidden="true">↓</span>
          <span class="decisionFlowNode decisionFlowNodeDark">kubectl logs POD --previous</span>
          <span class="decisionFlowArrow" aria-hidden="true">↓</span>
          <span class="decisionFlowNode decisionFlowNodeSuccess">Verify: restart count stops climbing</span>
        </div>
      </nav>
      <details class="decisionFlowFallback">
        <summary>Text summary: five diagnostic paths</summary>
        <p>Five diagnostic paths: <strong>OOMKilled</strong> (exit 137 → raise limits), <strong>Probe failed</strong> (liveness/readiness → startupProbe), <strong>Config error</strong> (Secret/env → fix keys), <strong>App exit</strong> (logs --previous → stack trace), <strong>After deploy</strong> (correlate with rollout → kubectl rollout undo).</p>
      </details>`

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
${buildCrashloopHeader(title, author, date, category, readMins)}

    <div class="dl-blog">
      <section class="heroBand fearBand">
        <div class="heroBrands">
          <span class="heroBrandText" style="font-size:1.5rem;font-weight:700;color:#09090b;letter-spacing:-0.02em">CrashLoopBackOff</span>
          <span class="heroBrandSep" aria-hidden="true">×</span>
          <a href="/" class="heroAmLink">
            <img src="/logos/alertmend-logo.svg" alt="AlertMend" class="heroAmLogo" width="128" height="28">
          </a>
        </div>
        <p class="heroGuideLabel">Kubernetes runbook · pod crash loops</p>
        <p class="fearHeadline">RESTARTS: 14. STATUS: CrashLoopBackOff. LOGS: empty.</p>
        <p class="fearLead">You ran <code>kubectl logs</code> and got nothing. The answer was in <code>--previous</code> the whole time — but only after you knew where to look. Meanwhile the backoff timer climbed, and your deploy looked "successful" because the ReplicaSet rolled out.</p>
        <div class="fearScenarioMobile">
        ${mobileLeadScenario}
        </div>
        <details class="fearScenarioMore">
          <summary>3 more production scenarios →</summary>
          <div class="fearScenarioGrid">
        ${moreScenarios}
          </div>
        </details>
        <div class="fearScenarioGrid fearScenarioGridDesktop">
        ${allScenariosDesktop}
        </div>
        <p class="fearBridge">If any of that sounds familiar, start here. This is the workflow we use on real incidents, from <code>kubectl describe</code> to the fix that actually sticks. <strong>Deleting the pod is not a fix.</strong> The backoff timer resets; the root cause does not.</p>
      </section>

      <section class="heroBand heroBandCompact">
        <p class="seoTldr"><strong>TL;DR:</strong> The fix is always in the <em>last terminated container</em>, not the current one. Below: the <a href="#five-step-workflow">five-step workflow</a> that finds it, <a href="#describe-output">annotated describe output</a> that teaches you to read it, and <a href="#failure-modes">failure-mode playbooks</a> for every common root cause. Don't delete the pod — the backoff timer resets but the root cause doesn't.</p>
      </section>

      <nav class="articleToc" aria-label="On this page">
        <p class="articleTocTitle">On this page</p>
        <ol>
          <li><a href="#what-is-crashloop">What is CrashLoopBackOff?</a></li>
          <li><a href="#diagnostic-tree">Diagnostic decision tree</a></li>
          <li><a href="#five-step-workflow">Five-step workflow</a></li>
          <li><a href="#describe-output">Annotated describe output</a></li>
          <li><a href="#failure-modes">Failure mode playbooks</a></li>
          <li><a href="#manual-vs-escalate">When to fix manually vs escalate</a></li>
          <li><a href="#faq">FAQ</a></li>
        </ol>
      </nav>

      <h2 class="sectionHead" id="what-is-crashloop">What is CrashLoopBackOff?</h2>
      <p class="bodyText">Kubernetes restarted your container, it exited again, and the kubelet is waiting longer before the next try. The status <strong>CrashLoopBackOff</strong> is the backoff timer, not the root cause. The cause is in the last terminated container's logs and the pod Events.</p>

      <h3 class="subsectionHead">Exponential backoff timer</h3>
      <p class="bodyText">Between restart attempts, kubelet waits longer each time — capped at five minutes. Most engineers know "it backs off" but not the exact schedule:</p>
      <div class="diyWrap">
        <table class="compareTable backoffTable">
          <thead><tr><th>Restart attempt</th><th>Wait before next try</th></tr></thead>
          <tbody>
            <tr><td>1</td><td>10s</td></tr>
            <tr><td>2</td><td>20s</td></tr>
            <tr><td>3</td><td>40s</td></tr>
            <tr><td>4</td><td>80s</td></tr>
            <tr><td>5</td><td>160s</td></tr>
            <tr><td>6+</td><td>300s (5 min cap)</td></tr>
          </tbody>
        </table>
      </div>
      <p class="thresholdFormula">Formula: <code>min(10 × 2<sup>n−1</sup>, 300)</code> seconds · Reset: timer returns to 10s after the container runs successfully for 10 minutes.</p>
      <div class="operationalCallout">
        <p><strong>Operational impact:</strong> By restart 6, you're waiting 5 minutes per attempt — that's 5 minutes of zero traffic to that pod replica. After restart 14 (where our hero scenario starts), the pod has been failing for over an hour.</p>
      </div>

      <div class="diyWrap">
        <table class="compareTable">
          <thead><tr><th>Status</th><th>Meaning</th><th>Next step</th></tr></thead>
          <tbody>
            ${LIFECYCLE_STATES.map(([s, m, n]) => `<tr><td><code>${esc(s)}</code></td><td>${esc(m)}</td><td class="diyHighlight">${esc(n)}</td></tr>`).join('\n            ')}
          </tbody>
        </table>
      </div>

      <h2 class="sectionHead" id="diagnostic-tree">Diagnostic decision tree</h2>
      <p class="bodyText">Start at describe Events, branch to your failure mode, confirm with <code>logs --previous</code>, verify restart count stops climbing.</p>
      <figure class="flowDiagram">
        ${decisionFlowHtml}
        <figcaption class="flowDiagramCaption">Bookmark this flow: describe → Events → branch → logs --previous → verify.</figcaption>
      </figure>

      <h2 class="sectionHead" id="five-step-workflow">CrashLoopBackOff fix: five-step workflow</h2>
      <div class="amFlow">
        ${DEBUG_STEPS.map(([t, b], i) => {
          const keyClass = i === 2 ? ' amStepKey' : ''
          const badge = i === 2 ? '<span class="amStepBadge">Most engineers miss this</span>' : ''
          return `<div class="amStep${keyClass}"><div class="amStepHead"><span class="amStepNum">${i + 1}</span></div>${badge}<h3 class="amStepTitle">${esc(t)}</h3><p class="amStepBody">${esc(b)}</p></div>`
        }).join('\n        ')}
      </div>
      ${codeBlock(KUBECTL_CHEATSHEET)}

      <div class="resolvedCallout" id="resolved-state">
        <h3 class="subsectionHead">What a resolved pod looks like</h3>
        <p class="bodyText">After the fix, confirm the pod is actually healthy — not just temporarily between crashes.</p>
        ${codeBlock(RESOLVED_POD)}
        <ul class="checkList resolvedChecklist">
          <li>Watch for 2+ minutes. If restart count doesn't increase, the fix is holding.</li>
          <li>If it climbs again: you fixed a symptom, not the root cause. Go back to Step 2 and re-read Events.</li>
        </ul>
      </div>

      <h2 class="sectionHead" id="describe-output">Where to look in kubectl describe</h2>
      <p class="bodyText">Engineers scan terminal output instinctively. These are the three sections that matter, with notes on what each line means.</p>
      ${codeBlock(DESCRIBE_ANNOTATED)}
      <p class="citeRow">Reference: <a href="https://kubernetes.io/docs/concepts/configuration/liveness-readiness-startup-probes/" target="_blank" rel="noopener noreferrer">Kubernetes probe documentation</a></p>

      <h2 class="sectionHead" id="failure-modes">Diagnose by failure mode</h2>
      <p class="bodyText">Find your symptom below. Each failure mode has diagnostic commands, the fix, and a verification step.</p>
      <div class="failurePlaybookIndex">
        <a href="#failure-probe" class="failurePlaybookIndexLink">Probe failure</a>
        <a href="#failure-oom" class="failurePlaybookIndexLink">OOMKilled</a>
        <a href="#failure-config" class="failurePlaybookIndexLink">Config error</a>
        <a href="#failure-deploy" class="failurePlaybookIndexLink">Post-deploy</a>
        <a href="#failure-entrypoint" class="failurePlaybookIndexLink">Bad entrypoint</a>
        <a href="#failure-init" class="failurePlaybookIndexLink">Init container</a>
      </div>
      ${playbooksHtml}

      <h2 class="sectionHead" id="manual-vs-escalate">When to fix manually vs escalate</h2>
      <div class="diyWrap">
        <table class="compareTable">
          <thead><tr><th>Do not automate</th><th>Why</th><th>Instead</th></tr></thead>
          <tbody>
            ${DO_NOT_AUTOMATE.map(([s, w, a]) => `<tr><td>${esc(s)}</td><td>${esc(w)}</td><td class="diyHighlight">${esc(a)}</td></tr>`).join('\n            ')}
          </tbody>
        </table>
      </div>

      <h2 class="sectionHead" id="related-deep-dives">Related deep dives</h2>
      <div class="hubLinks hubLinksCards">
        ${HUB_LINKS.map(([href, t, d]) => `<a href="${href}" class="hubLinkCard"><p class="hubLinkTitle">${esc(t)}</p><p class="hubLinkDesc">${esc(d)}</p></a>`).join('\n        ')}
      </div>

      <h2 class="sectionHead" id="faq">FAQ</h2>
      <div class="faqList">
        ${FAQ.map(([q, a], i) => `<div class="faqItem"><button type="button" class="faqQuestion" data-faq-toggle aria-expanded="${i === 0 ? 'true' : 'false'}">${esc(q)}<svg class="faqChevron${i === 0 ? ' faqChevronOpen' : ''}" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 9l6 6 6-6"/></svg></button><div class="faqAnswer${i === 0 ? '' : ' faqAnswerCollapsed'}">${esc(a)}</div></div>`).join('\n        ')}
      </div>

      <div class="ctaBand">
        <div class="ctaBandTitle">You just ran the five-step workflow. Automate the next one.</div>
        <p class="ctaBandSub">You ran <code>kubectl describe</code>, read Events, checked <code>logs --previous</code>, and correlated with deploy timing — five steps, maybe 10 minutes if you knew where to look. AlertMend runs this workflow automatically: it captures <code>logs --previous</code> before the container restarts, correlates with the last rollout, and triggers safe rollback or restart. It pages you only when the automated fix fails. <strong>Manual:</strong> ~15 minutes per pod × N pods. <strong>Automated:</strong> 30 seconds, verified.</p>
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
