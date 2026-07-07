/**
 * Code-generated rich blog: 503 No Healthy Upstream troubleshooting runbook.
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

function codeBlock(code, lang = 'shell', variant = '') {
  const variantClass = variant ? ` codeBlockWrap--${variant}` : ''
  const stateLabel =
    variant === 'bad'
      ? '<span class="codeBlockState codeBlockStateBad" aria-hidden="true">✗ Problem</span>'
      : variant === 'good'
        ? '<span class="codeBlockState codeBlockStateGood" aria-hidden="true">✓ Healthy</span>'
        : ''
  return `<div class="codeBlockWrap${variantClass}">
  <div class="codeBlockToolbar">
    <span class="codeBlockLang">${esc(lang)}</span>
    <div class="codeBlockToolbarRight">${stateLabel}<button type="button" class="codeCopyBtn" aria-label="Copy code"><span class="codeCopyLabel">Copy</span></button></div>
  </div>
  <span class="codeCopyToast" aria-live="polite"></span>
  <pre class="codeBlock"><code>${esc(code)}</code></pre>
</div>`
}

function buildHeader(title, author, date, category, readMins) {
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

function estimateReadMinutes(...textBlocks) {
  const words = textBlocks.join(' ').split(/\s+/).filter(Boolean).length
  return Math.max(10, Math.round(words / 250))
}

export async function build(slug) {
  const assetsBase = `/assets/${slug}`
  const canonical = `${SITE_URL}/blog/${slug}`
  const heroImage = `${assetsBase}/upstream-hero.svg`
  const flowImage = `${assetsBase}/upstream-flow.svg`

  const meta = parseFrontmatter(slug)
  const pageTitle = meta.title || 'No Healthy Upstream: Meaning & 503 Fixes'
  const h1Title = 'No Healthy Upstream: Meaning, Causes & 503 Fixes'
  const excerpt =
    meta.excerpt ||
    'No healthy upstream means every backend failed health checks. Diagnose empty endpoints, readiness, Envoy, Istio, nginx, and HAProxy with this decision tree.'
  const dateModified = meta.dateModified || meta.date || '2026-01-10'
  const date = meta.date && meta.date !== '2026-01-10' ? meta.date : dateModified
  const category = meta.category || 'Kubernetes'
  const author = meta.author || 'AlertMend Team'
  const keywords =
    meta.keywords ||
    '503 no healthy upstream, no healthy upstream, no healthy backends, upstream error, nginx 503 error, nginx no healthy upstream, kubernetes no healthy upstream, kubernetes service unavailable, envoy no healthy upstream, istio no healthy upstream, load balancer troubleshooting, reverse proxy errors, HAProxy, unhealthy upstream, service health checks'

  const relatedPosts = getRelatedPosts(slug, category)
  const postSignupUrl = signupUrl(slug, 'blog-503-upstream')
  const postCalendlyUrl = calendlyUrl(slug)

  const PAIN_SCENARIOS = [
    {
      when: 'Helm upgrade, 2:14pm',
      title: '503 for every user. Pods looked Running.',
      body: 'Rollout completed green in CI. kubectl get pods showed 3/3 Running. curl returned 503 no healthy upstream. Endpoints were empty, but every pod was Running.',
      failureId: 'probes',
      hash: 'playbook-readiness',
    },
    {
      when: 'Black Friday scale-up',
      title: 'Intermittent 503, then total outage.',
      body: 'HPA added six nodes. New pods passed liveness. Error flipped between no healthy upstream and upstream connect error. Then total outage.',
      failureId: 'rollout',
      hash: 'playbook-rollout',
    },
    {
      when: 'NetworkPolicy added Friday',
      title: 'Worked in staging, 503 in prod.',
      body: 'Policy applied Friday in staging, worked fine. Monday morning: 503 in prod. Pods were Ready; the proxy could not reach them.',
      failureId: 'network',
      hash: 'playbook-networkpolicy',
    },
    {
      when: 'Istio canary at 10%',
      title: '100% traffic, 0% healthy upstream.',
      body: 'kubectl get endpoints still listed three IPs. But Envoy showed healthy_hosts: 0.',
      failureId: 'mesh',
      hash: 'playbook-mesh',
    },
  ]

  const LIFECYCLE_STATES = [
    ['Proxy receives request', 'Ingress, nginx, Envoy, or HAProxy is up', '503 means proxy works; backends do not'],
    ['Upstream pool empty', 'No host passes health check', 'Check endpoints or upstream status'],
    ['Pods Running, not Ready', 'Readiness probe failing', 'describe pod Events'],
    ['Endpoints repopulated', 'At least one Ready pod', '503 should clear within seconds'],
  ]

  const DEBUG_STEPS = [
    ['Confirm the 503 at the edge', 'curl -I the public URL. Note the exact body: no healthy upstream (Envoy/Istio/nginx), no healthy backends, or a generic 503. The string tells you which proxy layer failed.'],
    ['Check Service endpoints', 'kubectl get endpoints <service> -n <ns>. Compare empty ENDPOINTS (<none>) against a healthy list of pod IP:port pairs (see annotated output below).'],
    ['Inspect pod readiness', 'kubectl get pods -l <selector>. If 0/N Ready, readiness probes are failing even when containers show Running.'],
    ['Read ingress or mesh logs', 'kubectl logs -n ingress-nginx <pod> | grep -i upstream. On Istio, check ingressgateway for UH or UF response flags.'],
    ['Correlate with deploy timeline', 'kubectl get events --sort-by=.lastTimestamp. Did 503 start within minutes of a rollout, NetworkPolicy apply, or scale event?'],
    ['Fix root cause and verify', 'Endpoints show pod IPs, curl returns 200, and the state holds for 2+ minutes before you close the incident.'],
  ]

  const HOWTO_STEPS = DEBUG_STEPS

  const ALERTMEND_STEPS = [
    ['Connect cluster or URL', 'Point AlertMend at your ingress URL or in-cluster Service. No agent install on nginx VMs.'],
    ['Add health check', 'Monitor the same path users hit. Alert on consecutive 503 or latency spike.'],
    ['Route to Slack', 'Page includes last rollout, endpoint count, and probe Events pulled from the cluster.'],
    ['Enable safe auto-fix', 'Rollout undo or pod restart when checks fail after deploy. Human approval for destructive actions.'],
  ]

  const HUB_LINKS = [
    ['/blog/kubernetes-crashloopbackoff-fix', 'CrashLoopBackOff fix', 'Pods crash before becoming Ready'],
    ['/blog/kubernetes-imagepullbackoff-fix', 'ImagePullBackOff fix', 'Pods never start, endpoints stay empty'],
    ['/blog/url-monitoring-automated-fixes', 'URL monitoring', 'External checks that catch 503 before users'],
    ['/blog/kubernetes-502-bad-gateway-error-fix', '502 Bad Gateway', 'Proxy reached backend but got invalid response'],
    ['/blog/readiness-probe-failed-http-probe-failed-with-statuscode-503', 'Readiness probe 503', 'HTTP probe failed with statuscode 503, endpoints drain'],
    ['/blog/debugging-kubernetes-oomkilled-exit-code-137-causes-and-solutions', 'OOMKilled exit 137', 'Pods killed under load during scale events'],
  ]

  const FAILURE_TABS = [
    ['endpoints', 'Empty endpoints', 'selector / Ready'],
    ['probes', 'Readiness failing', 'probe path'],
    ['rollout', 'Rollout drain', 'undo deploy'],
    ['network', 'NetworkPolicy', 'DNS / port'],
    ['mesh', 'Mesh ejection', 'Istio / Envoy'],
  ]

  const ALERTMEND_MODE_INSIGHTS = {
    endpoints: {
      sees: 'Endpoint count fell to zero while workload objects still exist. The decisive split is selector mismatch versus failed readiness.',
      automates: 'Collect Service selectors, Pod labels, readiness Events, and the last deployment change. Remediation stays gated until the mismatch is proven.',
    },
    probes: {
      sees: 'Containers are Running, Pod Ready is false, and probe Events name the failing path, port, status code, and first-failure time.',
      automates: 'Correlate the probe failure with the rollout diff. Restart only after a known-good configuration exists; otherwise recommend rollback or require approval.',
    },
    rollout: {
      sees: 'Endpoint count reached zero immediately after a ReplicaSet change, while the previous revision had healthy endpoints.',
      automates: 'A guarded rollout undo is eligible when the deploy-to-drain sequence is unambiguous and recovery verification is configured.',
    },
    network: {
      sees: 'Ready endpoints exist, but a request from the ingress network path cannot reach Pod IP:port. Restarting pods would not change the evidence.',
      automates: 'Attach the relevant NetworkPolicy and namespace-label diff. Policy changes require approval; AlertMend verifies reachability after the change.',
    },
    mesh: {
      sees: 'Kubernetes endpoints remain Ready while Envoy reports no healthy hosts or UH. That isolates the failure to the mesh health model.',
      automates: 'Surface DestinationRule, recent 5xx history, and ejected hosts. Threshold changes remain approval-gated; recovery is verified at both mesh and URL layers.',
    },
  }

  const FAQ = [
    [
      'What does no healthy upstream mean?',
      'No healthy upstream means your reverse proxy, load balancer, or service mesh received the request but has zero backend servers that pass health checks. The proxy itself is usually fine; every upstream host is down, failing probes, or was ejected from the pool. You see HTTP 503 Service Unavailable with a body like "no healthy upstream" or "no healthy backends".',
    ],
    [
      'What does no healthy upstream mean on a website?',
      'When a website shows no healthy upstream, the site\'s load balancer cannot reach any healthy application server behind it. This is a server-side outage at that company, not a problem with your browser or Wi-Fi. Refreshing rarely helps until their ops team restores healthy backends. If you operate the site, check readiness probes, endpoints, and proxy logs.',
    ],
    [
      'What is no healthy upstream?',
      'No healthy upstream is an error message from proxies like nginx, Envoy (Istio), HAProxy, Kong, or cloud load balancers. It means the edge proxy had no backend to forward your request to. Common causes: all pods failing readiness, empty Kubernetes endpoints, exhausted backends, or mesh outlier ejection.',
    ],
    [
      'What does 503 no healthy upstream mean?',
      'HTTP 503 with "no healthy upstream" combines status code 503 (temporarily unavailable) with the proxy-specific detail that every upstream failed health checks. Fix backends first; restarting the proxy alone rarely helps.',
    ],
    [
      'What is no healthy upstream error?',
      'The no healthy upstream error is returned when a reverse proxy cannot find a healthy backend server. It is not an application bug in your browser. Operators should check upstream health, Kubernetes endpoints, nginx upstream blocks, or Envoy cluster health.',
    ],
    [
      'What does no healthy upstream error mean?',
      'It means zero backends are available to handle traffic. Synonyms include error 503 no healthy backends, nginx no live upstreams, HAProxy no healthy IP available for the backend, and Envoy response flag UH (no healthy upstream).',
    ],
    [
      'How to fix no healthy upstream error?',
      'In Kubernetes: kubectl get endpoints, fix readiness probes or Service selectors, check NetworkPolicy. On nginx: verify upstream servers respond on the health path. On Envoy/Istio: check outlier detection and VirtualService subsets. Roll back if the error started right after a deploy.',
    ],
    [
      'What does error 503 no healthy backends mean?',
      'Error 503 no healthy backends is the same class of failure as no healthy upstream. Envoy and many ingress controllers use "backends" in the message. Every backend failed active or passive health checks. Diagnose the same way: confirm at least one backend is healthy before blaming the proxy.',
    ],
    [
      'What does error 503 no healthy IP available for the backend mean?',
      'This is HAProxy\'s wording when no backend server IP is available or healthy. Check backend server status, health checks, and that HAProxy can reach backend IPs on the configured port. Often parallels Kubernetes empty endpoints or all servers marked DOWN.',
    ],
    [
      'What does nginx no healthy upstream mean?',
      'nginx marks upstream servers down after max_fails or failed passive checks. When every server in the upstream block is down, users see 503. Check /var/log/nginx/error.log, test backends with curl, and verify upstream server addresses and ports.',
    ],
    [
      'What does envoy 503 no healthy upstream mean?',
      'Envoy returned a local 503 because its cluster had no healthy hosts. Check for response flag UH, upstream connect errors, or outlier ejection in ingressgateway logs. In Istio, verify DestinationRule outlierDetection and that pod endpoints exist.',
    ],
    [
      'How do I fix 503 no healthy upstream in Kubernetes?',
      'Run kubectl get endpoints <service>. If ENDPOINTS is empty, fix readiness probes or Service selector labels until at least one pod is Ready. If endpoints exist, test connectivity from the ingress pod and check NetworkPolicy.',
    ],
    [
      '503 vs 502: what is the difference?',
      '502 Bad Gateway means the proxy reached a backend but got an invalid response. 503 Service Unavailable with no healthy upstream means the proxy never found a backend to try. Different fixes.',
    ],
    [
      'Why do I see 503 during a rolling update?',
      'New pods may not pass readiness before old pods terminate. Tune maxSurge, use readiness gates, or pause rollout until new pods are Ready. AlertMend can alert when endpoint count hits zero mid-deploy.',
    ],
    [
      'nginx no healthy upstream vs Kubernetes endpoints?',
      'Same symptom, different layer. In Kubernetes, empty endpoints usually means readiness failure. On bare nginx, check upstream {} blocks and passive health checks. Both mean zero backends passed health checks.',
    ],
    [
      'How does Istio cause no healthy upstream?',
      'Outlier detection ejects hosts after consecutive errors. VirtualService subset mismatches can point traffic at labels with no Ready pods. Check DestinationRule and envoy logs on ingressgateway.',
    ],
    [
      'Should I restart nginx or the ingress controller?',
      'Restarting the proxy rarely fixes empty endpoints. Fix backends first. Restart ingress only after confirming endpoints are populated but proxy still returns 503 (stale config cache).',
    ],
    [
      'How does AlertMend help with 503 errors?',
      'AlertMend runs URL checks on your ingress, correlates 503 spikes with rollout events and endpoint drains, pages Slack with kubectl context, and can trigger rollout undo or pod restart when safe.',
    ],
  ]

  const KUBECTL_CHEATSHEET = `# 1. Confirm empty upstream pool
kubectl get endpoints <service-name> -n <namespace>
kubectl get svc <service-name> -n <namespace>

# 2. Pod readiness
kubectl get pods -n <namespace> -l app=<label> -o wide
kubectl describe pod <pod-name> -n <namespace> | grep -A25 "Events:"

# 3. Test from ingress
kubectl exec -it <ingress-pod> -n ingress-nginx -- \\
  curl -s -o /dev/null -w "%{http_code}" http://<service>.<namespace>.svc.cluster.local:8080/health

# 4. Deploy correlation
kubectl get events -n <namespace> --sort-by='.lastTimestamp' | tail -20
kubectl rollout history deployment/<name> -n <namespace>

# 5. Rollback if deploy caused drain
kubectl rollout undo deployment/<name> -n <namespace>`

  const NGINX_SNIPPET = `upstream backend {
    least_conn;
    server backend1:8080 max_fails=3 fail_timeout=30s;
    server backend2:8080 max_fails=3 fail_timeout=30s;
    keepalive 32;
}

server {
    location / {
        proxy_pass http://backend;
        proxy_connect_timeout 5s;
        proxy_read_timeout 60s;
        proxy_next_upstream error timeout http_502 http_503;
    }
}`

  const PROBE_YAML = `readinessProbe:
  httpGet:
    path: /ready
    port: 8080
  periodSeconds: 5
  failureThreshold: 3
startupProbe:
  httpGet:
    path: /health
    port: 8080
  failureThreshold: 30
  periodSeconds: 10`

  const ENVOY_SNIPPET = `# Envoy / Istio: common log lines
# response flag UH = no healthy upstream
# upstream connect error or disconnect/reset before headers

kubectl logs -n istio-system deploy/istio-ingressgateway | grep -iE 'no healthy upstream|UH|upstream connect'

# Check cluster health in admin (debug port-forward)
# curl localhost:15000/clusters | grep -A5 <service-name>`

  const HAPROXY_SNIPPET = `# HAProxy socket, all backends DOWN
echo "show stat" | socat stdio /var/run/haproxy.sock | grep BACKEND
# backend,BACKEND,0,0,0,0,0,0,0,0,0,0,DOWN,...`

  const PROXY_VARIANTS = [
    ['nginx', 'no healthy upstream / no live upstreams', 'All servers in upstream {} marked down after max_fails'],
    ['Envoy / Istio', 'no healthy upstream (response flag UH)', 'Cluster has zero healthy hosts; check outlier ejection'],
    ['HAProxy', 'no healthy IP available for the backend', 'Every backend IP failed checks or is administratively down'],
    ['AWS ALB', '503 no healthy targets', 'Target group has no healthy registered targets'],
    ['Kong', 'failure to get a peer from the ring-balancer', 'No upstream node available in the balancer ring'],
  ]

  const ENDPOINTS_BAD = `NAME   ENDPOINTS   AGE
api    <none>      47m
# ↑ zero backends, ingress returns 503 no healthy upstream`

  const ENDPOINTS_GOOD = `NAME   ENDPOINTS                               AGE
api    10.244.1.42:8080,10.244.2.18:8080       2d
# ↑ at least one IP:port, proxy can forward traffic`

  const CURL_503 = `$ curl -I https://api.example.com/health
HTTP/1.1 503 Service Unavailable

no healthy upstream`

  const CURL_200 = `$ curl -I https://api.example.com/health
HTTP/1.1 200 OK`

  const HAPROXY_BAD_LOG = `# HAProxy error log, every backend DOWN
grep -i "no server available\\|503 no healthy IP" /var/log/haproxy.log
# Jun 27 14:03:11 haproxy[1234]: Server backend/api1 is DOWN.
# Jun 27 14:03:11 haproxy[1234]: backend backend has no server available!`

  const KONG_HEALTHY = `# Kong admin API, healthy target ring
curl -s http://localhost:8001/upstreams/api-upstream/health | jq .
# {
#   "data": [{
#     "health": "HEALTHY",
#     "target": "10.0.1.42:8080"
#   }],
#   "total": 1
# }`

  const ENVOY_ACCESS_LOG = `# Annotated Envoy access log line
[2026-06-27T14:03:11.123Z] "GET /api HTTP/1.1" 503 UF,URX
                                      ↑  ↑
                                      │  └ URX: upstream retry limit exceeded
                                      └──── UF: upstream connection failure
# UH = no healthy upstream (zero healthy hosts in cluster)
# grep ingressgateway logs:
kubectl logs -n istio-system deploy/istio-ingressgateway | grep -E ' 503 |"UF|"UH'`

  const KONG_SNIPPET = `# Kong: failure to get a peer from the ring-balancer
# No upstream node available in the balancer ring

curl -s http://localhost:8001/upstreams/<upstream-name>/health | jq .
# healthy: look for "HEALTHY" vs "UNHEALTHY" per target

curl -s http://localhost:8001/targets | jq '.data[] | {target, health}'

# If targets exist but health is UNHEALTHY: fix backend reachability
# If ring is empty: check DNS for upstream host, Kong upstream config`

  const NETPOL_FIX_YAML = `apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-ingress-to-api
  namespace: production
spec:
  podSelector:
    matchLabels:
      app: api
  policyTypes:
  - Ingress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          kubernetes.io/metadata.name: ingress-nginx
    - podSelector:
        matchLabels:
          app.kubernetes.io/name: ingress-nginx
    ports:
    - protocol: TCP
      port: 8080`

  const REPRO_LAB_YAML = `apiVersion: v1
kind: Namespace
metadata:
  name: upstream-lab
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: demo-api
  namespace: upstream-lab
spec:
  replicas: 2
  selector:
    matchLabels:
      app: demo-api
  template:
    metadata:
      labels:
        app: demo-api
    spec:
      containers:
      - name: nginx
        image: nginx:1.27-alpine
        ports:
        - containerPort: 80
        readinessProbe:
          httpGet:
            path: /intentionally-broken
            port: 80
          periodSeconds: 3
          failureThreshold: 1
---
apiVersion: v1
kind: Service
metadata:
  name: demo-api
  namespace: upstream-lab
spec:
  selector:
    app: demo-api
  ports:
  - port: 80
    targetPort: 80`

  const REPRO_LAB_COMMANDS = `# Safety: use a disposable cluster or non-production context.
kubectl config current-context

# Apply the intentionally broken workload from the manifest above.
kubectl apply -f upstream-lab.yaml
kubectl wait --for=jsonpath='{.status.phase}'=Running pod \\
  -l app=demo-api -n upstream-lab --timeout=90s

# Observe: pods run, readiness fails, and no ready endpoint is published.
kubectl get pods -n upstream-lab
kubectl get endpointslice -n upstream-lab \\
  -l kubernetes.io/service-name=demo-api -o wide

# Repair the readiness path and watch endpoints become ready.
kubectl patch deployment demo-api -n upstream-lab --type=json \\
  -p='[{"op":"replace","path":"/spec/template/spec/containers/0/readinessProbe/httpGet/path","value":"/"}]'
kubectl rollout status deployment/demo-api -n upstream-lab
kubectl get endpointslice -n upstream-lab \\
  -l kubernetes.io/service-name=demo-api -o wide

# Clean up the isolated lab.
kubectl delete namespace upstream-lab`

  const renderScenario = ({ when, title, body, failureId, hash }) =>
    `<div class="fearScenario"><p class="fearScenarioWhen">${esc(when)}</p><p class="fearScenarioTitle">${esc(title)}</p><p class="fearScenarioBody">${esc(body)}</p><a href="#${hash}" class="fearScenarioLink" data-jump-failure="${failureId}">→ See what was wrong</a></div>`

  const mobileLeadScenario = renderScenario(PAIN_SCENARIOS[0])
  const moreScenarios = PAIN_SCENARIOS.slice(1).map(renderScenario).join('\n        ')
  const allScenariosDesktop = PAIN_SCENARIOS.map(renderScenario).join('\n        ')

  const decisionFlowHtml = `
      <nav class="decisionFlow" aria-label="503 no healthy upstream diagnostic tree">
        <div class="decisionFlowStart">
          <span class="decisionFlowNode decisionFlowNodeDark">User sees 503 no healthy upstream</span>
          <span class="decisionFlowArrow" aria-hidden="true">↓</span>
          <span class="decisionFlowNode decisionFlowNodeAccent">kubectl get endpoints → empty?</span>
        </div>
        <div class="decisionFlowBranches">
          <a href="#failure-playbook" class="decisionFlowBranch decisionFlowProbe" data-jump-failure="endpoints">
            <span class="decisionFlowBranchTitle">ENDPOINTS &lt;none&gt;</span>
            <span class="decisionFlowBranchSub">Selector or readiness → fix probes</span>
          </a>
          <a href="#failure-playbook" class="decisionFlowBranch decisionFlowOom" data-jump-failure="rollout">
            <span class="decisionFlowBranchTitle">Started after deploy</span>
            <span class="decisionFlowBranchSub">Rollout drained backends → undo</span>
          </a>
          <a href="#failure-playbook" class="decisionFlowBranch decisionFlowConfig" data-jump-failure="network">
            <span class="decisionFlowBranchTitle">Endpoints exist</span>
            <span class="decisionFlowBranchSub">NetworkPolicy / port mismatch</span>
          </a>
          <a href="#failure-playbook" class="decisionFlowBranch decisionFlowDeploy" data-jump-failure="mesh">
            <span class="decisionFlowBranchTitle">Mesh / Envoy UH flag</span>
            <span class="decisionFlowBranchSub">Outlier ejection → check Istio</span>
          </a>
          <a href="#proxy-variants" class="decisionFlowBranch decisionFlowApp">
            <span class="decisionFlowBranchTitle">Bare nginx / HAProxy</span>
            <span class="decisionFlowBranchSub">All upstream servers DOWN</span>
          </a>
        </div>
        <div class="decisionFlowEnd">
          <span class="decisionFlowArrow" aria-hidden="true">↓</span>
          <span class="decisionFlowNode decisionFlowNodeSuccess">Verify: curl 200 + endpoints show IPs</span>
        </div>
      </nav>
      <details class="decisionFlowFallback">
        <summary>Text summary: five diagnostic paths</summary>
        <p>Five paths: <strong>empty endpoints</strong> (readiness/selector), <strong>post-deploy drain</strong> (rollout undo), <strong>endpoints exist but 503</strong> (NetworkPolicy/port), <strong>mesh ejection</strong> (Envoy UH / Istio), <strong>bare nginx/HAProxy</strong> (upstream block all DOWN).</p>
      </details>`

  const faqLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map(([q, a]) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  })

  const readMins = estimateReadMinutes(pageTitle, excerpt, h1Title, ...FAQ.flat(), ...DEBUG_STEPS.flat(), ...PAIN_SCENARIOS.map((p) => [p.when, p.title, p.body].join(' ')))

  const howToLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to fix 503 no healthy upstream',
    description: excerpt,
    totalTime: 'PT15M',
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
    headline: h1Title,
    description: excerpt,
    image: `https://www.alertmend.io${heroImage}`,
    datePublished: date,
    dateModified: dateModified,
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
  <title>${esc(pageTitle)} | AlertMend AI</title>
  <meta name="description" content="${esc(excerpt)}">
  <meta name="keywords" content="${esc(keywords)}">
  <meta name="author" content="${esc(author)}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <link rel="canonical" href="${canonical}">
  <link rel="icon" type="image/svg+xml" href="/logos/alertmend-logo.svg">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${canonical}">
  <meta property="og:title" content="${esc(pageTitle)} | AlertMend AI">
  <meta property="og:description" content="${esc(excerpt)}">
  <meta property="og:image" content="https://www.alertmend.io${heroImage}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(pageTitle)} | AlertMend AI">
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
${buildHeader(h1Title, author, date, category, readMins)}

    <div class="dl-blog">
      <section class="heroBand fearBand">
        <div class="heroBrands">
          <span class="heroBrandText" style="font-size:1.5rem;font-weight:700;color:#09090b;letter-spacing:-0.02em">No Healthy Upstream</span>
          <span class="heroBrandSep" aria-hidden="true">×</span>
          <a href="/" class="heroAmLink">
            <img src="/logos/alertmend-logo.svg" alt="AlertMend" class="heroAmLogo" width="128" height="28">
          </a>
        </div>
        <p class="heroGuideLabel">Instant answer + reproducible runbook · examples target Kubernetes 1.30 syntax and ingress-nginx</p>

        <div class="instantAnswer">
          <div class="instantAnswerTop">
            <span class="instantAnswerBadge">THE MEANING</span>
            <span class="instantAnswerTime">Answer in 10 seconds</span>
          </div>
          <p class="instantAnswerDefinition"><strong>No healthy upstream</strong> means the proxy received your request, but <strong>zero backend servers passed health checks</strong>. The proxy is usually working; its upstream pool is empty.</p>
          <div class="intentRouter" aria-label="Choose the situation that matches yours">
            <a class="intentCard intentCardOperator" href="#diagnostic-tree">
              <span class="intentCardEyebrow">I operate this service</span>
              <strong>Start with endpoints</strong>
              <code>kubectl get endpoints &lt;service&gt; -n &lt;namespace&gt;</code>
              <span class="intentCardAction">Open the 60-second decision tree →</span>
            </a>
            <a class="intentCard intentCardVisitor" href="#website-error">
              <span class="intentCardEyebrow">I saw this on a website</span>
              <strong>It is not your device</strong>
              <span>The website's servers are unavailable. Check its status page or retry later.</span>
              <span class="intentCardAction">What visitors should do →</span>
            </a>
          </div>
          <div class="trustStrip" aria-label="Guide verification details">
            <span><strong>Primary sources</strong> Kubernetes, Envoy, Istio, nginx, AWS</span>
            <span><strong>Reproducible</strong> isolated failure lab included</span>
            <span><strong>Updated</strong> ${esc(dateModified)}</span>
          </div>
          <div class="diagnosticModel" aria-label="AlertMend diagnostic model">
            <span class="diagnosticModelLabel">THE ALERTMEND METHOD</span>
            <div><strong>Signal</strong><small>503 at the edge</small></div><i>→</i>
            <div><strong>State</strong><small>endpoints + probes</small></div><i>→</i>
            <div><strong>Change</strong><small>rollout + policy</small></div><i>→</i>
            <div><strong>Cause</strong><small>evidence, not guesses</small></div><i>→</i>
            <div><strong>Recover</strong><small>guardrail + verify</small></div>
          </div>
        </div>

        <p class="fearHeadline">HTTP 503. MESSAGE: no healthy upstream. ENDPOINTS: &lt;none&gt;.</p>
        <p class="fearLead">Five distinct failures produce the same 503: empty endpoints, failed readiness, a drained rollout, blocked network traffic, or service-mesh ejection. Match the evidence before restarting anything.</p>
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

        <nav class="inThisGuide" aria-label="What you will learn">
          <p class="inThisGuideTitle">You are in the right place if…</p>
          <ul>
            <li>Users see <strong>503 no healthy upstream</strong> on nginx, Envoy, Istio, or HAProxy</li>
            <li><code>kubectl get pods</code> shows Running but traffic still fails</li>
            <li>503 started during or right after a deploy or scale event</li>
            <li>You need a kubectl-first workflow before touching proxy config</li>
          </ul>
        </nav>

        <div class="fearSeparator" aria-hidden="true"></div>
        <p class="fearBridge"><strong>Restarting the ingress does not repopulate endpoints.</strong> Fix Ready pods first, then verify the proxy sees them.</p>
      </section>

      <section class="heroBand heroBandCompact">
        <p class="seoTldr"><strong>TL;DR:</strong> <strong>No healthy upstream</strong> and <strong>error 503 no healthy backends</strong> mean the same thing: the proxy has no backend that currently passes health checks. Operators should check endpoints first; website visitors cannot fix it locally. Use the <a href="#diagnostic-tree">decision tree</a> or jump to the <a href="#website-error">visitor answer</a>.</p>
      </section>

      <nav class="articleToc" aria-label="On this page">
        <p class="articleTocTitle">On this page</p>
        <ol>
          <li><a href="#meaning">What does no healthy upstream mean?</a></li>
          <li><a href="#reproduce">Reproduce it safely</a></li>
          <li><a href="#diagnostic-tree">Diagnostic decision tree</a></li>
          <li><a href="#no-healthy-backends">Error 503 no healthy backends</a></li>
          <li><a href="#six-step-workflow">Six-step workflow</a></li>
          <li><a href="#three-mistakes">Three mistakes that make 503 worse</a></li>
          <li><a href="#failure-playbook">Failure mode playbooks</a></li>
          <li><a href="#proxy-variants">nginx, Envoy, HAProxy, ALB, Kong</a></li>
          <li><a href="#website-error">Seeing this on a website you visit</a></li>
          <li><a href="#faq">FAQ</a></li>
        </ol>
      </nav>

      <h2 class="sectionHead" id="meaning">What does no healthy upstream mean?</h2>
      <p class="bodyText"><strong>No healthy upstream</strong> means the reverse proxy or load balancer received your request but has zero backend servers passing health checks. The proxy itself is running, every upstream host is down, failing probes, or ejected by the service mesh. Envoy documents this state as <code>no_healthy_upstream</code>: the router rejected the request because it found no healthy upstream. <a href="https://www.envoyproxy.io/docs/envoy/latest/configuration/http/http_conn_man/response_code_details" target="_blank" rel="noopener noreferrer">Envoy reference ↗</a></p>
      <p class="bodyText">You typically see <strong>HTTP 503 Service Unavailable</strong> with a plain-text body such as <code>no healthy upstream</code><code>no healthy backends</code>or <code>upstream server responded with a 503 error</code>. <strong>Upstream servers</strong> are the application instances behind the proxy. When every upstream fails health checks, users get a total outage at the edge even if container processes are still running.</p>

      <span id="what-is-503-upstream" class="anchor-alias" aria-hidden="true"></span>
      <span id="what-is-the-503-no-healthy-upstream-error" class="anchor-alias" aria-hidden="true"></span>

      <div class="diyWrap">
        <table class="compareTable">
          <thead><tr><th>Code</th><th>Name</th><th>Proxy behavior</th><th>Meaning</th></tr></thead>
          <tbody>
            <tr><td><code>502</code></td><td>Bad Gateway</td><td>Proxy reached a backend</td><td class="diyHighlight">Backend returned invalid or corrupt response</td></tr>
            <tr><td><code>503</code></td><td>Service Unavailable</td><td>Proxy has no backend to try</td><td class="diyHighlight">Zero healthy upstreams; pool empty</td></tr>
            <tr><td><code>504</code></td><td>Gateway Timeout</td><td>Proxy reached a backend</td><td class="diyHighlight">Backend did not respond within timeout</td></tr>
          </tbody>
        </table>
      </div>

      <section class="incidentLifecycle" id="incident-lifecycle" aria-labelledby="incident-lifecycle-title">
        <div class="lifecycleHeader">
          <div>
            <span class="lifecycleEyebrow">INTERACTIVE EXPLAINER</span>
            <h3 id="incident-lifecycle-title">Watch a healthy service become a 503</h3>
          </div>
          <span class="lifecycleHint">Choose a state ↓</span>
        </div>
        <div class="lifecycleTabs" role="tablist" aria-label="Incident lifecycle states">
          <button type="button" role="tab" class="lifecycleTab lifecycleTabActive" data-lifecycle-state="healthy" aria-selected="true">1. Healthy</button>
          <button type="button" role="tab" class="lifecycleTab" data-lifecycle-state="readiness" aria-selected="false">2. Probe fails</button>
          <button type="button" role="tab" class="lifecycleTab" data-lifecycle-state="empty" aria-selected="false">3. Endpoints empty</button>
          <button type="button" role="tab" class="lifecycleTab" data-lifecycle-state="blocked" aria-selected="false">4. Network blocked</button>
          <button type="button" role="tab" class="lifecycleTab" data-lifecycle-state="recovered" aria-selected="false">5. Recovered</button>
        </div>

        <div class="lifecycleStage" data-lifecycle-current="healthy" role="tabpanel" aria-live="polite">
          <div class="lifecycleTrack" aria-hidden="true">
            <div class="lifecycleNode lifecycleClient">
              <span class="lifecycleIcon">↗</span>
              <strong>User request</strong>
              <small>GET /checkout</small>
            </div>
            <div class="lifecycleConnector lifecycleConnectorOne"><i></i><i></i><i></i></div>
            <div class="lifecycleNode lifecycleIngress">
              <span class="lifecycleIcon">◇</span>
              <strong>Ingress</strong>
              <small>proxy is healthy</small>
            </div>
            <div class="lifecycleConnector lifecycleConnectorTwo"><i></i><i></i><i></i></div>
            <div class="lifecycleNode lifecycleService">
              <span class="lifecycleIcon">SVC</span>
              <strong>Service</strong>
              <small class="endpointCount">2 ready endpoints</small>
            </div>
            <div class="lifecycleConnector lifecycleConnectorThree"><i></i><i></i><i></i></div>
            <div class="lifecyclePods">
              <div class="lifecyclePod lifecyclePodOne"><span></span><strong>pod-a</strong><small>Running · Ready</small></div>
              <div class="lifecyclePod lifecyclePodTwo"><span></span><strong>pod-b</strong><small>Running · Ready</small></div>
            </div>
          </div>

          <div class="lifecycleResult">
            <span class="lifecycleStatus lifecycleStatusCode">HTTP 200</span>
            <div>
              <strong class="lifecycleResultTitle">Traffic reaches two healthy pods</strong>
              <p class="lifecycleResultText">Both readiness probes pass, so Kubernetes publishes both Pod IPs as ready Service endpoints.</p>
            </div>
            <a class="lifecycleResultLink" href="#reproduce">Reproduce this transition ↓</a>
          </div>
          <div class="lifecycleExpert">
            <span>WHAT ALERTMEND SEES</span>
            <p class="lifecycleExpertText">Edge check is healthy, two ready endpoints exist, and both readiness probes are passing.</p>
            <strong class="lifecycleExpertAction">Action: establish the healthy baseline and watch for state changes.</strong>
          </div>
        </div>
        <noscript><img src="${flowImage}" alt="Request flow: client to ingress to empty upstream pool returning 503" width="960" height="200" loading="lazy"></noscript>
      </section>
      <div class="diyWrap">
        <table class="compareTable">
          <thead><tr><th>Stage</th><th>Meaning</th><th>What to check</th></tr></thead>
          <tbody>
            ${LIFECYCLE_STATES.map(([s, m, n]) => `<tr><td>${esc(s)}</td><td>${esc(m)}</td><td class="diyHighlight">${esc(n)}</td></tr>`).join('\n            ')}
          </tbody>
        </table>
      </div>

      <h3 class="subsectionHead">HTTP 503 Service Unavailable explained</h3>
      <p class="bodyText">HTTP 503 is a 5xx server error indicating the server is temporarily unable to handle the request. With <code>no healthy upstream</code>the condition is usually fixable once backends recover or probes pass. Unlike misconfiguration errors that need code changes, 503 often clears when health checks succeed again.</p>
      <aside class="fieldNote"><span>ALERTMEND FIELD NOTE 01</span><strong>“Running” is process state; “Ready” is traffic eligibility.</strong><p>During this incident, the Ready condition and EndpointSlice are more useful than restart count. A pod can run perfectly while Kubernetes correctly refuses to send it traffic.</p></aside>

      <h2 class="sectionHead" id="reproduce">Reproduce empty upstreams safely</h2>
      <p class="bodyText">This isolated lab creates two nginx pods with an intentionally broken readiness path. The containers run, but Kubernetes marks them NotReady and does not publish them as ready Service endpoints. That reproduces the cluster state behind many <code>no healthy upstream</code> incidents without touching an existing application.</p>
      <div class="labSafety"><strong>Safety:</strong> Run this only in a disposable cluster or an approved non-production context. The manifest uses its own <code>upstream-lab</code> namespace, and the final command deletes that namespace.</div>
      <p class="labDownloadRow"><a href="${assetsBase}/upstream-lab.yaml" download>Download the reproducible lab manifest ↓</a><span>Plain YAML · isolated namespace · cleanup included</span></p>
      ${codeBlock(REPRO_LAB_YAML, 'yaml', 'bad')}
      ${codeBlock(REPRO_LAB_COMMANDS, 'shell')}
      <div class="evidenceGrid">
        <div class="evidenceCard"><span class="evidenceLabel">BROKEN STATE</span><strong>Pods: Running, Ready: 0/1</strong><p>EndpointSlice exists, but its endpoints are not ready for normal Service traffic.</p></div>
        <div class="evidenceArrow" aria-hidden="true">→</div>
        <div class="evidenceCard evidenceCardGood"><span class="evidenceLabel">FIXED STATE</span><strong>Pods: Running, Ready: 1/1</strong><p>The repaired <code>/</code> readiness path passes and ready endpoints return.</p></div>
      </div>
      <p class="citeRow"><strong>Why this works:</strong> Kubernetes removes a Pod IP from matching EndpointSlices when its readiness probe fails. <a href="https://kubernetes.io/docs/concepts/workloads/pods/probes/" target="_blank" rel="noopener noreferrer">Readiness probe documentation ↗</a> · <a href="https://kubernetes.io/docs/concepts/services-networking/endpoint-slices/" target="_blank" rel="noopener noreferrer">EndpointSlice documentation ↗</a></p>
      <aside class="fieldNote"><span>ALERTMEND FIELD NOTE 02</span><strong>Endpoint count is the fastest branching signal.</strong><p>Zero endpoints points toward selectors, readiness, or rollout drain. Endpoints present shifts the investigation toward reachability, ports, proxy state, or mesh ejection.</p></aside>

      <h2 class="sectionHead" id="diagnostic-tree">Diagnostic decision tree</h2>
      <p class="bodyText">Start at <code>kubectl get endpoints</code>. Branch to your failure mode, fix backends, verify curl returns 200.</p>
      <figure class="flowDiagram">
        ${decisionFlowHtml}
        <figcaption class="flowDiagramCaption">Bookmark this flow: endpoints → branch → fix → verify.</figcaption>
      </figure>

      <h3 class="subsectionHead">Representative incident timeline: from deploy to verified recovery</h3>
      <p class="bodyText">This is a representative reconstruction, not a customer claim, showing the evidence sequence AlertMend uses to avoid a reflex restart.</p>
      <ol class="incidentTimeline">
        <li><time>14:02:11</time><div><strong>Deployment revision changes</strong><p>New ReplicaSet starts; old endpoints still serve traffic.</p></div></li>
        <li><time>14:02:37</time><div><strong>Readiness begins failing</strong><p>New pods are Running, but <code>/ready</code> returns 503.</p></div></li>
        <li><time>14:03:04</time><div><strong>Endpoint count reaches zero</strong><p>Old pods terminate before any new pod becomes Ready.</p></div></li>
        <li><time>14:03:06</time><div><strong>External check returns 503</strong><p>Alert includes rollout revision, empty endpoints, and failing probe Events.</p></div></li>
        <li><time>14:03:18</time><div><strong>Guarded rollback starts</strong><p>Policy permits rollback because the deploy-to-drain relationship is unambiguous.</p></div></li>
        <li><time>14:04:02</time><div><strong>Recovery verified</strong><p>Endpoints repopulate, three consecutive URL checks return 200, and the incident closes with evidence.</p></div></li>
      </ol>

      <h2 class="sectionHead" id="no-healthy-backends">Error 503 no healthy backends</h2>
      <p class="bodyText"><strong>Error 503 no healthy backends</strong> is interchangeable with <strong>no healthy upstream</strong> on many proxies. Envoy, Istio ingressgateway, Fastly/Varnish VCL, and several cloud load balancers use "backends" in the message. The diagnosis is identical for all: find why every backend failed health checks, check backend health, not the proxy config.</p>
      <p class="bodyText">Message variants by platform (same root cause, different wording):</p>
      <ul class="checkList">
        <li><code>503 backend is unhealthy</code>CDNs and some PaaS edge layers</li>
        <li><code>health checks failed with these codes: [503]</code>AWS target group health checks</li>
        <li><code>no healthy targets</code>Application Load Balancer (ALB)</li>
        <li><code>503 backend fetch failed</code>Varnish cache miss / backend fetch</li>
        <li><code>no live upstreams</code>nginx when every server in <code>upstream {}</code> is marked down</li>
        <li><code>unhealthy upstream</code>generic reverse-proxy wording</li>
      </ul>

      <h2 class="sectionHead" id="proxy-variants">nginx, Envoy, HAProxy, ALB, and Kong: message variants</h2>
      <p class="bodyText">Different proxies phrase the same root cause differently. Match your exact error text:</p>
      <div class="diyWrap">
        <table class="compareTable">
          <thead><tr><th>Platform</th><th>Typical message</th><th>What it means</th></tr></thead>
          <tbody>
            ${PROXY_VARIANTS.map(([p, m, n]) => `<tr><td><strong>${esc(p)}</strong></td><td><code>${esc(m)}</code></td><td class="diyHighlight">${esc(n)}</td></tr>`).join('\n            ')}
          </tbody>
        </table>
      </div>

      <span id="nginx-upstream" class="anchor-alias" aria-hidden="true"></span>
      <span id="nginx-and-haproxy-upstream-configuration" class="anchor-alias" aria-hidden="true"></span>
      <h3 class="subsectionHead" id="nginx-upstream-config">nginx: upstream blocks and passive health checks</h3>
      <p class="bodyText">On bare metal or VM nginx, the same symptom appears when every <code>server</code> in the <code>upstream</code> block is marked down. <strong>nginx no live upstreams</strong> and <strong>nginx 503 service temporarily unavailable</strong> often mean zero upstream servers passed passive health checks. Use <code>max_fails</code> and <code>fail_timeout</code> with sane timeouts:</p>
      ${codeBlock(NGINX_SNIPPET)}
      <p class="bodyText">Check error logs: <code>grep -i upstream /var/log/nginx/error.log</code>. Test backends directly: <code>curl -v http://backend-ip:8080/health</code>.</p>

      <h3 class="subsectionHead" id="envoy-istio">Envoy 503 no healthy upstream and upstream connect errors</h3>
      <p class="bodyText">Envoy returns a local 503 when a cluster has <code>healthy_hosts: 0</code>. Look for response flag <code>UH</code> (no healthy upstream) in access logs. In Istio, check DestinationRule outlier detection and VirtualService subsets.</p>
      ${codeBlock(ENVOY_SNIPPET)}

      <h3 class="subsectionHead" id="envoy-upstream-connect">upstream connect error or disconnect/reset before headers</h3>
      <p class="bodyText">This Envoy error means the proxy could not establish a TCP connection to any upstream host. <strong>UH</strong> (no healthy upstream) and <strong>UF</strong> (upstream connection failure) often co-occur: the cluster may list hosts, but every connection attempt fails before HTTP headers arrive.</p>
      <p class="bodyText">Common reset reason variants in access logs and debug output:</p>
      <ul class="checkList">
        <li><strong>connection timeout</strong>upstream did not accept TCP within the connect timeout</li>
        <li><strong>connection failure</strong>TCP refused, no route, or immediate RST from the host</li>
        <li><strong>connection termination</strong>peer closed the socket during handshake or before headers</li>
        <li><strong>overflow</strong>circuit breaker or pending-request limit blocked new connections</li>
        <li><strong>remote connection failure</strong>network path failure between Envoy and pod IP</li>
      </ul>
      <p class="bodyText">Parse ingressgateway access logs for response flags:</p>
      ${codeBlock(ENVOY_ACCESS_LOG, 'shell', 'bad')}

      <h3 class="subsectionHead" id="haproxy-alb">HAProxy and AWS ALB: no healthy IP / no healthy targets</h3>
      <p class="bodyText"><strong>Error 503 no healthy IP available for the backend</strong> is HAProxy-specific. <strong>503 no healthy targets</strong> is common on AWS ALB when every target fails health checks. Verify backend server state, security groups, and that health check paths return 200.</p>
      ${codeBlock(HAPROXY_SNIPPET, 'shell', 'bad')}
      ${codeBlock(HAPROXY_BAD_LOG, 'shell', 'bad')}

      <h3 class="subsectionHead" id="kong-ring-balancer">Kong: failure to get a peer from the ring-balancer</h3>
      <p class="bodyText">Kong returns this when the ring-balancer has no upstream node to route to, every target is unhealthy, DNS resolution failed, or the upstream has zero registered targets. Check target health via the Kong admin API before editing routes or plugins.</p>
      ${codeBlock(KONG_SNIPPET)}
      ${codeBlock(KONG_HEALTHY, 'shell', 'good')}

      <h2 class="sectionHead" id="six-step-workflow">503 fix: six-step diagnostic workflow</h2>
      <p class="verifiedNote">Examples target Kubernetes 1.30 syntax and ingress-nginx. Confirm your current context and test changes in staging; behavior can vary by controller and version.</p>
      <div class="amFlow amFlowSix amFlowRunbook">
        <div class="amStep">
          <div class="amStepHead"><span class="amStepNum">1</span></div>
          <h3 class="amStepTitle">${esc(DEBUG_STEPS[0][0])}</h3>
          <p class="amStepBody">${esc(DEBUG_STEPS[0][1])}</p>
        </div>
        <div class="amStep amStepKey">
          <div class="amStepHead"><span class="amStepNum">2</span></div>
          <span class="amStepBadge">Start here</span>
          <h3 class="amStepTitle">${esc(DEBUG_STEPS[1][0])}</h3>
          <p class="amStepBody">${esc(DEBUG_STEPS[1][1])}</p>
        </div>
        <div class="workflowExamples" id="where-to-look">
          <h4 class="amStepSubhead">Correlate curl with endpoints</h4>
          <p class="amStepBody">Match the browser or API error with cluster state. Empty <code>ENDPOINTS</code> means the proxy has nothing to forward to.</p>
          ${codeBlock(CURL_503, 'shell', 'bad')}
          ${codeBlock(ENDPOINTS_BAD, 'shell', 'bad')}
          ${codeBlock(ENDPOINTS_GOOD, 'shell', 'good')}
        </div>
        <div class="amStep">
          <div class="amStepHead"><span class="amStepNum">3</span></div>
          <h3 class="amStepTitle">${esc(DEBUG_STEPS[2][0])}</h3>
          <p class="amStepBody">${esc(DEBUG_STEPS[2][1])}</p>
        </div>
        <div class="amStep">
          <div class="amStepHead"><span class="amStepNum">4</span></div>
          <h3 class="amStepTitle">${esc(DEBUG_STEPS[3][0])}</h3>
          <p class="amStepBody">${esc(DEBUG_STEPS[3][1])}</p>
        </div>
        <div class="amStep">
          <div class="amStepHead"><span class="amStepNum">5</span></div>
          <h3 class="amStepTitle">${esc(DEBUG_STEPS[4][0])}</h3>
          <p class="amStepBody">${esc(DEBUG_STEPS[4][1])}</p>
        </div>
        <div class="amStep">
          <div class="amStepHead"><span class="amStepNum">6</span></div>
          <h3 class="amStepTitle">${esc(DEBUG_STEPS[5][0])}</h3>
          <p class="amStepBody">${esc(DEBUG_STEPS[5][1])}</p>
        </div>
        <div class="workflowExamples workflowExamplesHealthy" id="resolved-state">
          <h4 class="amStepSubhead">What healthy looks like</h4>
          <div class="resolvedCallout">
            <ul class="checkList resolvedChecklist">
              <li><code>kubectl get endpoints</code> lists at least one <code>IP:port</code></li>
              <li><code>curl -I</code> your public URL returns <code>HTTP/1.1 200</code></li>
              <li>Watch for 2+ minutes. Intermittent 503 means readiness is still flapping.</li>
            </ul>
          </div>
          ${codeBlock(CURL_200, 'shell', 'good')}
        </div>
      </div>
      ${codeBlock(KUBECTL_CHEATSHEET)}

      <h2 class="sectionHead" id="three-mistakes">Three mistakes that make 503 worse</h2>
      <p class="bodyText">These are the reflex moves that feel productive but extend outages. Each fails for a mechanical reason, and has a better first step.</p>

      <h3 class="subsectionHead">1. Restarting the ingress controller or nginx</h3>
      <p class="bodyText">Kubernetes populates Service endpoints from Ready pods via kube-proxy, not from the ingress controller process. Restarting nginx or ingress-nginx clears connection pools but does not change which pod IPs are in the endpoints list. If every pod fails readiness, you get the same 503 on a fresh controller. <strong>Instead:</strong> fix Ready pods first, confirm <code>kubectl get endpoints</code> shows IPs, then restart ingress only if endpoints are populated but the proxy still returns 503 (stale config cache).</p>

      <h3 class="subsectionHead">2. Deleting pods to "force refresh"</h3>
      <p class="bodyText">Deleting pods during a broken rollout triggers the Deployment to create replacements that hit the same failing readiness probe. You go from "pods Running but not Ready" to "zero pods while new ones start." During scale events this can cascade across nodes. <strong>Instead:</strong> read probe Events with <code>kubectl describe pod</code>fix the probe path or startup timing, then rollout restart once the probe config is corrected.</p>

      <h3 class="subsectionHead">3. Editing proxy upstream config when endpoints are empty</h3>
      <p class="bodyText">When <code>ENDPOINTS</code> is <code>&lt;none&gt;</code>the proxy is already pointing at a Service with no backends. Changing <code>upstream {}</code> blocks, <code>proxy_pass</code>or VirtualService routes does not create Ready pods, it only changes where an empty pool points. <strong>Instead:</strong> restore at least one healthy backend, verify endpoints repopulate, then tune proxy timeouts or health checks if needed.</p>

      <section class="registryPlaybookZone" id="failure-playbook">
        <span id="playbook-readiness" class="anchor-alias" aria-hidden="true"></span>
        <span id="playbook-rollout" class="anchor-alias" aria-hidden="true"></span>
        <span id="playbook-networkpolicy" class="anchor-alias" aria-hidden="true"></span>
        <span id="playbook-mesh" class="anchor-alias" aria-hidden="true"></span>
        <span id="fix-readiness-probes-that-drain-endpoints" class="anchor-alias" aria-hidden="true"></span>
        <h2 class="sectionHead registryPlaybookHead">Pick a failure mode: upstream playbook</h2>
        <p class="registryPlaybookIntro">Match your kubectl or proxy error to the fix:</p>
        <div class="modeGrid modeGridProminent" role="tablist" aria-label="503 failure modes">
          ${FAILURE_TABS.map(([id, t, sub], i) => `<button type="button" role="tab" data-failure-id="${id}" class="modeCard modeCardProminent${i === 0 ? ' modeCardActive' : ''}" aria-selected="${i === 0 ? 'true' : 'false'}"><span class="modeCardTitle">${esc(t)}</span><span class="modeCardSub">${esc(sub)}</span></button>`).join('\n        ')}
        </div>
        <div class="modePlaybook" role="tabpanel">
          <div class="modePlaybookHead">
            <h3 class="modePlaybookTitle" id="failure-playbook-title">Empty endpoints</h3>
          </div>
          <p class="modePlaybookSummary" id="failure-playbook-summary">kubectl get endpoints shows &lt;none&gt;. The Service selector does not match any Ready pods, or every pod failed readiness.</p>
          <ul class="checkList" id="failure-playbook-steps"><li>kubectl get endpoints &lt;service&gt; -n &lt;ns&gt; confirm ENDPOINTS column is empty</li><li>kubectl get pods -l &lt;selector&gt; check Ready column (0/N means readiness failing)</li><li>kubectl describe svc &lt;service&gt; verify selector labels match pod labels</li><li>Fix label mismatch or readiness probe so at least one pod becomes Ready</li><li>Watch endpoints repopulate: kubectl get endpoints -w</li></ul>
          <pre class="playbookCode" id="failure-playbook-code" aria-label="kubectl commands"># Diagnose empty endpoints
kubectl get endpoints &lt;service-name&gt; -n &lt;namespace&gt;
kubectl get svc &lt;service-name&gt; -n &lt;namespace&gt; -o yaml | grep -A5 selector</pre>
          <pre class="playbookCode playbookCodeSecondary" id="failure-playbook-code-2" aria-label="additional commands" hidden></pre>
          <p class="citeRow" id="failure-playbook-footnote" hidden></p>
          <p class="autofixBadge" id="failure-playbook-autofix">Typical fix: Fix selector or readiness probe, then verify endpoints list pod IPs.</p>
          <div class="stepTip"><span id="failure-playbook-tip">Empty endpoints during rollout is normal for seconds. If it lasts minutes, readiness or selector is broken.</span></div>
          <div class="expertPanel">
            <div><span>WHAT ALERTMEND OBSERVES</span><p id="failure-playbook-alertmend-sees">${esc(ALERTMEND_MODE_INSIGHTS.endpoints.sees)}</p></div>
            <div><span>AUTOMATION BOUNDARY</span><p id="failure-playbook-alertmend-automates">${esc(ALERTMEND_MODE_INSIGHTS.endpoints.automates)}</p></div>
          </div>
        </div>
      </section>

      <div class="ctaBridge">
        <p class="bodyText">You just walked through six diagnostic steps and five failure-mode playbooks. Here is how to automate the workflow.</p>
      </div>

      <h2 class="sectionHead" id="alertmend-setup">Monitor 503 errors with AlertMend</h2>
      <p class="bodyText">External URL checks catch 503 before your users do. AlertMend follows the same evidence chain used throughout this guide: edge signal → endpoint state → probe evidence → recent change → guarded remediation → verified recovery.</p>
      <aside class="fieldNote"><span>ALERTMEND FIELD NOTE 03</span><strong>Automation should require a falsifiable diagnosis.</strong><p>“Restart the pod” is not a diagnosis. AlertMend separates safe evidence collection from state-changing actions, applies approval and policy controls, and verifies the user-facing URL after remediation.</p></aside>
      <div class="amFlow">
        ${ALERTMEND_STEPS.map(([t, b], i) => `<div class="amStep"><div class="amStepHead"><span class="amStepNum">${i + 1}</span></div><h3 class="amStepTitle">${esc(t)}</h3><p class="amStepBody">${esc(b)}</p></div>`).join('\n        ')}
      </div>
      <p class="bodyText preventionNote">See also: <a href="/blog/url-monitoring-automated-fixes">URL monitoring and automated fixes</a> for wiring external checks to in-cluster remediation.</p>

      <h2 class="sectionHead" id="website-error">Seeing no healthy upstream on a website you visit</h2>
      <p class="bodyText">If a third-party site (a bank, game launcher, SaaS app, or API) shows <strong>no healthy upstream</strong> in the browser or app, that is a <em>server-side outage at that company</em>. It is not caused by your phone, browser, or home network. Refreshing or clearing cache rarely fixes it.</p>
      <p class="bodyText">Examples of error text users search for: <code>could not contact entitlement service status code 503 no healthy upstream</code> (game clients), <code>unexpected status 503 service unavailable: no healthy upstream</code> (API gateways), <code>upstream server responded with a 503 error</code> (mobile apps), or payment and travel portals that show a generic <strong>no healthy upstream</strong> message.</p>
      <p class="bodyText"><strong>Platform-specific context</strong>in every case, the problem is on the service operator's side. You cannot fix it from your device.</p>
      <ul class="checkList">
        <li><strong>FiveM</strong><code>could not contact entitlement service, status code: 503, no healthy upstream</code> during Rockstar auth server outages</li>
        <li><strong>Unity</strong>Unity services or Asset Store backend overload returning 503 at the edge</li>
        <li><strong>Railway / Render</strong>your deployed app's platform health check failing; backends never marked healthy</li>
        <li><strong>ChatGPT / Claude</strong>AI API backend capacity exhaustion; edge proxy has no healthy upstream pool</li>
        <li><strong>SumUp</strong>payment terminal backend unavailable at the load balancer</li>
        <li><strong>Snowflake</strong>query execution service temporarily down behind the proxy</li>
        <li><strong>vCenter / ESXi</strong>VMware management plane service overloaded</li>
        <li><strong>Global Entry</strong>CBP kiosk backend outage at airport edge proxies</li>
        <li><strong>Padlet, Udemy, Discord, Spotify</strong>SaaS service-side outage; same symptom, operator must restore healthy backends</li>
      </ul>
      <p class="bodyText">If you run infrastructure for that service, use the kubectl and proxy workflows above. If you are an end user, wait for the operator's status page or retry later.</p>

      <h2 class="sectionHead" id="related-deep-dives">Related deep dives</h2>
      <div class="hubLinks hubLinksCards">
        ${HUB_LINKS.map(([href, t, d]) => `<a href="${href}" class="hubLinkCard"><p class="hubLinkTitle">${esc(t)}</p><p class="hubLinkDesc">${esc(d)}</p></a>`).join('\n        ')}
      </div>

      <h2 class="sectionHead" id="sources">Technical sources and review policy</h2>
      <p class="bodyText">This guide favors primary vendor documentation over secondary tutorials. Technical claims and examples were reviewed against the sources below on ${esc(dateModified)}.</p>
      <ul class="sourceList">
        <li><a href="https://kubernetes.io/docs/concepts/services-networking/service/" target="_blank" rel="noopener noreferrer">Kubernetes Services</a>selectors, backends, and EndpointSlices.</li>
        <li><a href="https://kubernetes.io/docs/concepts/workloads/pods/probes/" target="_blank" rel="noopener noreferrer">Kubernetes probes</a>failed readiness removes Pod IPs from matching EndpointSlices.</li>
        <li><a href="https://www.envoyproxy.io/docs/envoy/latest/configuration/http/http_conn_man/response_code_details" target="_blank" rel="noopener noreferrer">Envoy response-code details</a>definition of <code>no_healthy_upstream</code>.</li>
        <li><a href="https://istio.io/latest/docs/reference/config/networking/destination-rule/" target="_blank" rel="noopener noreferrer">Istio DestinationRule</a>outlier detection and unhealthy-host eviction.</li>
        <li><a href="https://nginx.org/en/docs/http/ngx_http_upstream_module.html" target="_blank" rel="noopener noreferrer">nginx upstream module</a><code>max_fails</code><code>fail_timeout</code>and unavailable servers.</li>
        <li><a href="https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html" target="_blank" rel="noopener noreferrer">AWS ALB target health</a>target-group health-check behavior.</li>
      </ul>
      <div class="reviewPolicy"><strong>Transparency:</strong> AlertMend publishes this article and may benefit if readers evaluate its product. The diagnostic steps above do not require AlertMend. Product behavior and upstream projects change; report a questionable command or outdated claim through the contact link, and the team will review it against current primary documentation.</div>

      <h2 class="sectionHead" id="faq">FAQ</h2>
      <div class="faqList">
        ${FAQ.map(([q, a], i) => `<div class="faqItem"><button type="button" class="faqQuestion" data-faq-toggle aria-expanded="${i === 0 ? 'true' : 'false'}">${esc(q)}<svg class="faqChevron${i === 0 ? ' faqChevronOpen' : ''}" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 9l6 6 6-6"/></svg></button><div class="faqAnswer${i === 0 ? '' : ' hidden'}">${esc(a)}</div></div>`).join('\n        ')}
      </div>

      <div class="ctaBand">
        <div class="ctaBandTitle">Bring us one real 503. We’ll show the evidence chain.</div>
        <p class="ctaBandSub">See AlertMend reconstruct the incident from edge failure to endpoint state, probe evidence, recent change, guarded remediation, and verified recovery, using your environment and your automation policy.</p>
        <div class="ctaBtnRow">
          <a href="${postSignupUrl}" class="ctaBtn">Monitor upstream health →</a>
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
