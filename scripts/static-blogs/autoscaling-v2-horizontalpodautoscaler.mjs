/**
 * Rich blog: Kubernetes HPA v2 configuration and troubleshooting.
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
  buildCredArticleHeader,
  DINESH_AUTHOR,
  AUTHOR_CRED_CSS,
  writeStaticBlogOutputs,
} from '../static-blog-shared.mjs'

const COPY_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>`

function codeBlock(code, label = '') {
  return `<div class="codeWrap">
    ${label ? `<div class="codeLabel">${esc(label)}</div>` : ''}
    <button class="copyBtn" type="button" aria-label="Copy code">${COPY_ICON}<span>Copy</span></button>
    <pre><code>${esc(code)}</code></pre>
  </div>`
}

function header(title, author, date, category, readMinutes) {
  return buildCredArticleHeader(title, date, category, author || DINESH_AUTHOR, `${esc(date)} · ${readMinutes} min read · Technical guide`)
}

export async function build(slug) {
  const meta = parseFrontmatter(slug)
  const title = meta.title || 'Kubernetes HPA v2: Configuration, Formula & Fixes'
  const excerpt = meta.excerpt || 'Configure Kubernetes HPA v2 and diagnose why it is not scaling.'
  const date = meta.date || '2026-07-04'
  const category = meta.category || 'Kubernetes'
  const author = meta.author || 'AlertMend Team'
  const keywords = meta.keywords || 'Kubernetes HPA v2, HorizontalPodAutoscaler, HPA troubleshooting'
  const canonical = `${SITE_URL}/blog/${slug}`
  const assets = `/assets/${slug}`
  const heroImage = `${SITE_URL}${assets}/hero.svg`
  const related = getRelatedPosts(slug, category)
  const demoUrl = calendlyUrl(slug)
  const startUrl = signupUrl(slug, 'blog-hpa-v2')

  const cpuYaml = `apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: checkout-api
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: checkout-api
  minReplicas: 3
  maxReplicas: 30
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
  behavior:
    scaleUp:
      stabilizationWindowSeconds: 0
      policies:
        - type: Percent
          value: 100
          periodSeconds: 60
        - type: Pods
          value: 4
          periodSeconds: 60
      selectPolicy: Max
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
        - type: Percent
          value: 25
          periodSeconds: 60`

  const multiMetricYaml = `metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Pods
    pods:
      metric:
        name: http_requests_per_second
      target:
        type: AverageValue
        averageValue: "40"

# Example calculation:
# CPU recommends 6 replicas; requests/sec recommends 9.
# HPA chooses 9, metrics are not weighted or averaged.`

  const commands = `# 1. Watch current and desired replicas
kubectl get hpa checkout-api -w

# 2. Read metric values, conditions, and scaling events
kubectl describe hpa checkout-api

# 3. Confirm resource metrics are available
kubectl top pods -l app=checkout-api
kubectl get apiservice v1beta1.metrics.k8s.io

# 4. Confirm every container has CPU requests
kubectl get deploy checkout-api -o jsonpath='{range .spec.template.spec.containers[*]}{.name}{" request="}{.resources.requests.cpu}{"\\n"}{end}'

# 5. Inspect raw HPA status and conditions
kubectl get hpa checkout-api -o yaml`

  const customMetricCommands = `# Discover the APIs the HPA can query
kubectl get --raw /apis/custom.metrics.k8s.io/v1beta1 | jq .
kubectl get --raw /apis/external.metrics.k8s.io/v1beta1 | jq .

# Check adapter registration and health
kubectl get apiservice | grep -E 'custom.metrics|external.metrics'
kubectl describe apiservice <adapter-api-service>

# Read the exact metric path used by your adapter
kubectl get --raw '<custom-or-external-metric-path>' | jq .`

  const faq = [
    ['What is the HPA v2 replica formula?', 'For a single metric, desired replicas are approximately ceil(current replicas × current metric value ÷ desired metric value). Kubernetes also applies tolerance, readiness handling, missing-metric logic, stabilization, and scaling policies before changing the target.'],
    ['Why does HPA show <unknown> for TARGETS?', 'The controller could not obtain a usable metric. Check the relevant aggregated API, the metrics adapter, selector labels, and, for CPU or memory utilization, resource requests on every container in the selected pods.'],
    ['Why is desiredReplicas higher but new pods stay Pending?', 'HPA has done its job by updating the workload replica count. Pending pods usually indicate scheduler or cluster-capacity constraints such as insufficient CPU, memory, GPU, affinity, taints, quotas, or unavailable nodes.'],
    ['Why will my HPA not scale down?', 'Common reasons are the scale-down stabilization window, a second metric still recommending more replicas, missing metrics, minReplicas, or a scaleDown policy. Describe the HPA and inspect its conditions and recent recommendations before changing thresholds.'],
    ['Does HPA v2 average multiple metrics?', 'No. It calculates a desired replica count for each metric and chooses the largest recommendation. If one metric cannot be converted into a recommendation, that error can prevent a scale-down, while a valid metric that recommends scale-up can still allow scaling up.'],
    ['Can HPA add Kubernetes nodes?', 'No. HPA changes workload replicas. If those pods cannot be scheduled, a node autoscaler such as Cluster Autoscaler or Karpenter must add capacity, assuming constraints and cloud limits allow it.'],
    ['Should a Deployment manifest set spec.replicas when HPA manages it?', 'Avoid repeatedly applying a fixed replicas value to an HPA-managed workload. It can fight the autoscaler and cause replica churn. Let HPA own the scale subresource after initial rollout.'],
  ]

  const faqLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map(([q, a]) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  })

  const howToLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to diagnose a Kubernetes HPA v2 that is not scaling',
    description: excerpt,
    tool: [{ '@type': 'HowToTool', name: 'kubectl' }],
    step: [
      ['Read HPA status', 'Run kubectl get hpa and compare current metrics, targets, current replicas, and desired replicas.'],
      ['Inspect conditions and events', 'Run kubectl describe hpa and read AbleToScale, ScalingActive, ScalingLimited, and recent events.'],
      ['Verify the metrics pipeline', 'Check resource, custom, or external metrics APIs and confirm the exact metric is queryable.'],
      ['Verify pod requests and readiness', 'For resource utilization, confirm every selected container has requests and inspect startup readiness behavior.'],
      ['Separate HPA from scheduling', 'If desired replicas increased but pods are Pending, inspect scheduler events and cluster capacity.'],
      ['Verify the fix', 'Watch HPA, Deployment, and pod readiness through one complete scale-up and scale-down cycle.'],
    ].map(([name, text], i) => ({ '@type': 'HowToStep', position: i + 1, name, text })),
  })

  const blogLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: title,
    description: excerpt,
    image: heroImage,
    datePublished: date,
    dateModified: '2026-07-04',
    author: { '@type': 'Organization', name: author },
    publisher: {
      '@type': 'Organization',
      name: 'AlertMend AI',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logos/alertmend-logo.svg` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
  })

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)} | AlertMend</title>
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
  <meta property="og:image" content="${heroImage}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(excerpt)}">
  <meta name="twitter:image" content="${heroImage}">
  <script type="application/ld+json">${blogLd}</script>
  <script type="application/ld+json">${faqLd}</script>
  <script type="application/ld+json">${howToLd}</script>
  <link rel="stylesheet" href="${assets}/styles.css">
  <style>${CHROME_INLINE_CSS}${AUTHOR_CRED_CSS}</style>
</head>
<body>
${buildNavHtml(slug, demoUrl)}
<main class="main-container">
  <div class="content-wrapper">
    <div class="main-col">
      ${header(title, author, date, category, 15)}
      <article class="hpaArticle">
        <section class="answerCard">
          <div class="answerEyebrow">THE 10-SECOND ANSWER</div>
          <p><strong>HPA is a control loop, not a traffic detector.</strong> It reads a metric, calculates <code>ceil(current replicas × current ÷ target)</code>then applies readiness rules, stabilization, and scaling policies. When it “does nothing,” first identify which layer stopped the loop: <strong>metric → recommendation → workload → scheduler → capacity.</strong></p>
          <div class="answerLinks">
            <a href="#debug">Jump to the diagnostic runbook</a>
            <a href="#config">Use the production YAML</a>
          </div>
        </section>

        <nav class="toc" aria-label="On this page">
          <span>On this page</span>
          <a href="#simulator">Replica formula</a>
          <a href="#config">Configuration</a>
          <a href="#debug">Troubleshooting</a>
          <a href="#multi-metric">Multiple metrics</a>
          <a href="#alertmend">Automated diagnosis</a>
          <a href="#faq">FAQ</a>
        </nav>

        <section class="intro">
          <p>Kubernetes HPA v2 can be perfectly healthy while your application is still overloaded. It can recommend more replicas that never schedule, wait five minutes before scaling down, or refuse to act because a single container has no CPU request. The useful question is not “is HPA running?” It is <strong>where did the scaling decision stop?</strong></p>
        </section>

        <section id="simulator" class="simSection">
          <div class="sectionKicker">INTERACTIVE CONTROL LOOP</div>
          <h2>Watch one HPA decision, end to end</h2>
          <p class="sectionLead">This simulation shows the boundary most runbooks miss: HPA recommends replicas, the workload creates them, and the scheduler still has to place them.</p>
          <div class="simulator" data-hpa-simulator>
            <div class="simTop">
              <div>
                <div class="simLabel">Scenario</div>
                <div class="simTitle" data-sim-title>CPU spike</div>
              </div>
              <button type="button" class="simReplay" data-sim-replay>Replay loop ↻</button>
            </div>
            <div class="scenarioTabs" role="tablist" aria-label="HPA scenarios">
              <button class="scenarioTab active" type="button" role="tab" aria-selected="true" data-scenario="spike">CPU spike</button>
              <button class="scenarioTab" type="button" role="tab" aria-selected="false" data-scenario="unknown">Metric unknown</button>
              <button class="scenarioTab" type="button" role="tab" aria-selected="false" data-scenario="pending">Pods pending</button>
              <button class="scenarioTab" type="button" role="tab" aria-selected="false" data-scenario="down">Won’t scale down</button>
            </div>
            <div class="loopTrack" aria-label="HPA control loop">
              <div class="loopNode" data-step="1"><span>01</span><b>Observe</b><small data-observe>CPU 140%</small></div>
              <div class="loopArrow" aria-hidden="true">→</div>
              <div class="loopNode" data-step="2"><span>02</span><b>Calculate</b><small data-calculate>ceil(3 × 140/70)</small></div>
              <div class="loopArrow" aria-hidden="true">→</div>
              <div class="loopNode" data-step="3"><span>03</span><b>Recommend</b><small data-recommend>6 replicas</small></div>
              <div class="loopArrow" aria-hidden="true">→</div>
              <div class="loopNode" data-step="4"><span>04</span><b>Realize</b><small data-realize>6 Ready</small></div>
            </div>
            <div class="simReadout">
              <div class="formula" data-formula><span>desiredReplicas</span> = ceil(3 × 140 ÷ 70) = <strong>6</strong></div>
              <div class="diagnosis">
                <span class="diagnosisDot" aria-hidden="true"></span>
                <div><b data-diagnosis-title>Scale-up is working</b><p data-diagnosis>HPA doubles the Deployment from 3 to 6 replicas. Verify the new pods become Ready and latency falls.</p></div>
              </div>
            </div>
          </div>
          <noscript><p class="noscriptNote">Formula example: with 3 replicas, current CPU at 140%, and a 70% target, HPA recommends ceil(3 × 140 ÷ 70) = 6 replicas.</p></noscript>
        </section>

        <section class="conceptSection">
          <div class="sectionKicker">MENTAL MODEL</div>
          <h2>The five boundaries of a scaling incident</h2>
          <div class="boundaryGrid">
            <div><span>1</span><h3>Metric</h3><p>Can the controller read a valid value?</p></div>
            <div><span>2</span><h3>Decision</h3><p>Does the formula recommend a change?</p></div>
            <div><span>3</span><h3>Policy</h3><p>Do limits or stabilization constrain it?</p></div>
            <div><span>4</span><h3>Workload</h3><p>Was the scale target updated?</p></div>
            <div><span>5</span><h3>Capacity</h3><p>Can the scheduler place new pods?</p></div>
          </div>
          <div class="importantNote"><strong>HPA does not add nodes.</strong> If <code>DESIRED</code> increases but pods stay Pending, stop tuning HPA and inspect scheduler events, quotas, affinity, taints, and your node autoscaler.</div>
        </section>

        <section id="config">
          <div class="sectionKicker">PRODUCTION BASELINE</div>
          <h2>A defensible autoscaling/v2 configuration</h2>
          <p class="sectionLead">Start with one metric you can explain. Add a second only when it represents a different bottleneck and you understand how its failure affects scale-down.</p>
          ${codeBlock(cpuYaml, 'hpa.yaml')}
          <div class="annotationGrid">
            <div><code>averageUtilization: 70</code><p>Percentage of requested CPU, not the CPU limit and not node CPU. Missing requests make utilization undefined.</p></div>
            <div><code>maxReplicas: 30</code><p>A safety boundary, not capacity planning. Confirm the cluster and every downstream dependency can handle 30 pods.</p></div>
            <div><code>scaleUp: Max</code><p>Chooses the most permissive scale-up policy shown: up to 100% or 4 pods per 60 seconds.</p></div>
            <div><code>stabilization: 300</code><p>For scale-down, HPA retains the highest recent recommendation in the window to reduce flapping.</p></div>
          </div>
          <div class="warningNote"><strong>Ownership rule:</strong> avoid continuously applying a fixed <code>Deployment.spec.replicas</code> after HPA takes control. Your deployment tool and HPA can otherwise fight over the same scale subresource.</div>
        </section>

        <section id="debug">
          <div class="sectionKicker">INCIDENT RUNBOOK</div>
          <h2>HPA not scaling? Diagnose the symptom you actually have</h2>
          <div class="symptomTableWrap">
            <table class="symptomTable">
              <thead><tr><th>What you see</th><th>Likely boundary</th><th>First proof</th></tr></thead>
              <tbody>
                <tr><td><code>TARGETS &lt;unknown&gt;/70%</code></td><td>Metric pipeline</td><td><code>describe hpa</code> + APIService health</td></tr>
                <tr><td>Metric is high; desired unchanged</td><td>Decision or policy</td><td>Conditions, tolerance, maxReplicas</td></tr>
                <tr><td>Desired increased; pods Pending</td><td>Scheduler or capacity</td><td><code>describe pod</code> Events</td></tr>
                <tr><td>Load fell; replicas stay high</td><td>Stabilization or second metric</td><td>Recent recommendations + all metrics</td></tr>
                <tr><td>Replicas bounce repeatedly</td><td>Noisy metric or startup behavior</td><td>Readiness, startup CPU, policies</td></tr>
              </tbody>
            </table>
          </div>
          ${codeBlock(commands, 'Six-minute first response')}

          <div class="conditionCards">
            <div><code>AbleToScale</code><h3>Can HPA fetch/update scale?</h3><p>False points to the target reference, backoff, or scale subresource, not the metric itself.</p></div>
            <div><code>ScalingActive</code><h3>Can it calculate replicas?</h3><p>False commonly points to missing or invalid metrics, selectors, or resource requests.</p></div>
            <div><code>ScalingLimited</code><h3>Was the answer capped?</h3><p>True means minReplicas, maxReplicas, or behavior limits constrained the recommendation.</p></div>
          </div>

          <h3 class="subhead">1. TARGETS shows &lt;unknown&gt;</h3>
          <p>Do not restart the Deployment. Prove whether the requested metrics API can answer. For CPU or memory <code>Utilization</code>also verify resource requests exist on every container selected by the HPA. A sidecar without a request can invalidate the pod’s utilization contribution.</p>

          <h3 class="subhead">2. Desired replicas rose, but capacity did not</h3>
          <p>HPA’s work ends when it updates the scale target. If pods are Pending, inspect the scheduler’s message: insufficient CPU or memory, untolerated taint, affinity conflict, PVC topology, quota, GPU scarcity, or a node autoscaler that has reached its own limit.</p>

          <h3 class="subhead">3. The workload will not scale down</h3>
          <p>Scale-down is intentionally conservative. Check the stabilization window, every configured metric, <code>minReplicas</code>and missing-metric events. HPA keeps the highest recommendation from the scale-down stabilization window; a second metric can also continue to recommend a larger replica count.</p>

          <h3 class="subhead">4. New pods create another spike</h3>
          <p>Startup CPU can distort the average before a pod is genuinely ready. Use meaningful readiness or startup probes. The controller deliberately handles unready and recently ready pods conservatively, but probes must still describe application readiness accurately.</p>
        </section>

        <section id="multi-metric">
          <div class="sectionKicker">THE MULTI-METRIC TRAP</div>
          <h2>HPA chooses the largest recommendation</h2>
          <p class="sectionLead">Metrics are not averaged and they have no weighting. HPA calculates each recommendation independently, then uses the maximum.</p>
          <div class="metricDecision">
            <div><span>CPU</span><strong>6</strong><small>replicas recommended</small></div>
            <div><span>Requests/sec</span><strong>9</strong><small>replicas recommended</small></div>
            <div class="winner"><span>HPA result</span><strong>9</strong><small>largest recommendation wins</small></div>
          </div>
          ${codeBlock(multiMetricYaml, 'Multiple metrics')}
          <div class="importantNote"><strong>Failure behavior matters:</strong> if one metric cannot produce a recommendation, HPA can still scale up when another valid metric recommends it. A scale-down may be skipped because the missing metric could have recommended more replicas.</div>

          <h3 class="subhead">Custom or external metric missing?</h3>
          <p>Query the aggregated API directly. This separates an HPA configuration error from an adapter, authentication, or monitoring backend problem.</p>
          ${codeBlock(customMetricCommands, 'Metrics adapter checks')}
        </section>

        <section class="decisionSection">
          <div class="sectionKicker">DESIGN REVIEW</div>
          <h2>Before production, answer these seven questions</h2>
          <ol class="reviewList">
            <li><span>01</span><div><b>Does the metric lead the symptom?</b><p>Scale on queue depth or concurrency when CPU rises too late to protect latency.</p></div></li>
            <li><span>02</span><div><b>Is the target tied to a request?</b><p>CPU utilization is a percentage of requested CPU. Changing requests changes scaling behavior.</p></div></li>
            <li><span>03</span><div><b>Can the cluster place maxReplicas?</b><p>Test quotas, topology, node pools, and downstream connection limits.</p></div></li>
            <li><span>04</span><div><b>How quickly can one pod become Ready?</b><p>Scale-up policy cannot outrun image pulls, initialization, or model loading.</p></div></li>
            <li><span>05</span><div><b>What prevents flapping?</b><p>Choose stabilization and policies from observed workload behavior, not copied defaults.</p></div></li>
            <li><span>06</span><div><b>Who owns replicas?</b><p>Remove fixed replica reconciliation from deployment automation once HPA owns scaling.</p></div></li>
            <li><span>07</span><div><b>How will you prove recovery?</b><p>Verify latency, metric value, Ready pods, and a clean scale-down, not just an HPA event.</p></div></li>
          </ol>
        </section>

        <section id="alertmend" class="alertmendSection">
          <div class="amHeader">
            <div>
              <div class="sectionKicker light">FROM SIGNAL TO VERIFIED RECOVERY</div>
              <h2>HPA incidents cross layers. Your diagnosis should too.</h2>
            </div>
            <div class="enterpriseBadge">ENTERPRISE · SELF-HOSTED OPTION</div>
          </div>
          <p class="amLead">A dashboard can show high CPU, <code>ScalingLimited=True</code>and Pending pods as three separate alerts. AlertMend is designed to correlate them into one incident, attach the likely root cause, and route an approved recovery with evidence.</p>
          <div class="incidentTrace">
            <div><span>12:04:08</span><b>Detect</b><p>Checkout latency breaches SLO; HPA reaches 30/30.</p></div>
            <div><span>12:04:12</span><b>Correlate</b><p>New replicas are Pending; node pool has no schedulable CPU.</p></div>
            <div><span>12:04:16</span><b>Diagnose</b><p>HPA is healthy. Cluster capacity, not the target, is the bottleneck.</p></div>
            <div><span>12:04:20</span><b>Act safely</b><p>Open an approved capacity workflow, verify pods Ready, then confirm latency recovery.</p></div>
          </div>
          <p class="illustrative">Illustrative incident trace. Available actions depend on your integrations and approval policy.</p>
          <div class="guardrails">
            <span>Managed or self-hosted</span>
            <span>Read-only collection available</span>
            <span>Approval gates for mutations</span>
            <span>Auditable incident timeline</span>
          </div>
          <div class="ctaRow">
            <a href="${demoUrl}" target="_blank" rel="noopener noreferrer" class="primaryCta">Walk through an HPA incident →</a>
            <a href="${startUrl}" class="secondaryCta">Explore AlertMend</a>
          </div>
        </section>

        <section class="sources">
          <div class="sectionKicker">PRIMARY SOURCES</div>
          <h2>Verify the behavior against Kubernetes</h2>
          <ul>
            <li><a href="https://kubernetes.io/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/" target="_blank" rel="noopener noreferrer">Horizontal Pod Autoscaling, concepts and algorithm</a></li>
            <li><a href="https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/" target="_blank" rel="noopener noreferrer">HorizontalPodAutoscaler walkthrough, resource, custom, and multiple metrics</a></li>
            <li><a href="https://kubernetes.io/docs/reference/kubernetes-api/workload-resources/horizontal-pod-autoscaler-v2/" target="_blank" rel="noopener noreferrer">autoscaling/v2 API reference</a></li>
          </ul>
          <p>Commands and field behavior were reviewed against the upstream Kubernetes documentation on July 4, 2026. Adapter-specific behavior should also be verified against the adapter version running in your cluster.</p>
        </section>

        <section id="faq">
          <div class="sectionKicker">FAQ</div>
          <h2>Kubernetes HPA v2 questions</h2>
          <div class="faqList">
            ${faq.map(([q, a], i) => `<div class="faqItem">
              <button type="button" class="faqQuestion" aria-expanded="${i === 0 ? 'true' : 'false'}" data-faq>
                <span>${esc(q)}</span><span class="faqIcon" aria-hidden="true">+</span>
              </button>
              <div class="faqAnswer${i === 0 ? ' open' : ''}"><p>${esc(a)}</p></div>
            </div>`).join('')}
          </div>
        </section>

        <section class="finalCta">
          <div>
            <div class="sectionKicker">NEXT INCIDENT</div>
            <h2>Know whether HPA, metrics, or capacity failed, before the page escalates.</h2>
          </div>
          <a href="${demoUrl}" target="_blank" rel="noopener noreferrer">Book a technical walkthrough →</a>
        </section>
      </article>
    </div>
    ${buildSidebarHtml(related)}
  </div>
</main>
<script src="${assets}/script.js" defer></script>
</body>
</html>`

  writeStaticBlogOutputs(slug, html)
}
