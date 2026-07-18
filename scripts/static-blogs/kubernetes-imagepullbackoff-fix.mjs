/**
 * Code-generated rich blog: Kubernetes ImagePullBackOff fix runbook.
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

function buildImagePullHeader(title, author, date, category) {
  return `
    <header class="article-header">
      <h1>${esc(title)}</h1>
      <div class="author-info">
        <div class="author-avatar">${author.charAt(0)}</div>
        <div>
          <div class="author-name">${esc(author)}</div>
          <div class="author-meta">${esc(date)} · 8 min read · ${category}</div>
        </div>
      </div>
      <span class="category-tag">${esc(category)}</span>
    </header>`
}

export async function build(slug) {
  const assetsBase = `/assets/${slug}`
  const canonical = `${SITE_URL}/blog/${slug}`
  const heroImage = `${assetsBase}/imagepull-hero.svg`
  const flowImage = `${assetsBase}/imagepull-state-flow.svg`

  const meta = parseFrontmatter(slug)
  const title = meta.title || 'Kubernetes ImagePullBackOff: Fix Guide'
  const excerpt =
    meta.excerpt ||
    'ImagePullBackOff fix for ECR, GCR, and Docker Hub: kubectl describe steps, copy-paste auth and tag fixes, rate limits, and the 90-day secret expiry trap.'
  const date = meta.date || '2026-06-24'
  const category = meta.category || 'Kubernetes'
  const author = meta.author || 'Arvind Rajpurohit'
  const keywords =
    meta.keywords ||
    'imagepullbackoff kubernetes fix, errimagepull, kubernetes imagepullbackoff, image pull secret kubernetes, failed to pull image, ecr imagepullbackoff, docker hub rate limit kubernetes'

  const relatedPosts = getRelatedPosts(slug, category)
  const postSignupUrl = signupUrl(slug, 'blog-imagepull')
  const postCalendlyUrl = calendlyUrl(slug)

  const PAIN_SCENARIOS = [
    [
      'New cluster, first deploy',
      'Every pod ImagePullBackOff.',
      'Greenfield EKS cluster, first Helm install. kubectl get pods showed 0/3 ready for 20 minutes. We assumed the registry was unreachable and started checking security groups and NAT gateways. describe Events on the third pod finally showed: Failed to pull image "myregistry.io/api:v1.0.0": unauthorized. The Deployment had no imagePullSecrets and the default ServiceAccount was never patched. Deleting pods three times only reset the backoff timer. Fix took 45 minutes because we chased network first.',
    ],
    [
      'Typo in image tag',
      'Worked yesterday, broken today.',
      'CI promoted v2.3.1 but the manifest still referenced myapp:v2.3.0. kubectl describe showed: Failed to pull image: manifest unknown: 404 Not Found. We thought someone deleted the image in ECR until aws ecr list-images proved v2.3.0 was never pushed for this repo. The rollout had "completed" because old pods on cached images kept serving traffic. Every new ReplicaSet replica stuck in ImagePullBackOff while kubectl rollout status looked green.',
    ],
    [
      'Expired registry token',
      'Pulls failed after 90 days.',
      'ECR pull secret created manually in January with kubectl create secret docker-registry. Worked fine until a March scale-up. Every new node provisioned during an HPA event hit ImagePullBackOff simultaneously. Existing nodes had cached layers, so the deploy looked healthy until traffic spiked and the cluster autoscaler added eight nodes at once. describe Events: unauthorized: authentication required. We thought ECR was down. It was a stale secret from a token that expired months earlier.',
    ],
    [
      'Docker Hub rate limit',
      'Intermittent ErrImagePull on new nodes.',
      'Staging cluster on a small node pool. Deploy to existing nodes worked because the image was cached locally. Monday load test scaled from 3 to 12 nodes: nine fresh nodes all ErrImagePull within two minutes. Events: toomanyrequests: You have reached your pull rate limit. We wasted an hour blaming the CI pipeline until we correlated failures with node creation time. No docker-registry secret on the ServiceAccount. The deploy had "worked" right up until scale-up.',
    ],
  ]

  const LIFECYCLE_STATES = [
    ['ContainerCreating', 'Kubelet pulling image', 'Normal first phase'],
    ['ErrImagePull', 'Pull failed', 'Read describe Events message'],
    ['ImagePullBackOff', 'Backing off before retry', 'Fix auth/tag, not delete loop'],
    ['Running', 'Pull succeeded', 'Verify digest if needed'],
  ]

  const DEBUG_STEPS = [
    ['kubectl get pods', 'Find ImagePullBackOff or ErrImagePull. Note namespace and pod name.'],
    ['kubectl describe pod <name>', 'Read Events. Match the message to a failure mode below.'],
    ['Verify image reference', 'Compare manifest image: tag with what exists in the registry.'],
    ['Check imagePullSecrets', 'Secret must exist in the same namespace as the pod.'],
    ['Fix and watch', 'Pod should reach Running after a successful pull.'],
  ]

  const COMMON_CAUSES = [
    ['Missing imagePullSecrets', 'Private registry without credentials.', 'Create docker-registry secret; add to pod spec.'],
    ['Wrong image tag', 'Typo or deleted tag.', 'Fix image: in Deployment.'],
    ['Expired credentials', 'ECR/GCR token expired.', 'Refresh pull secret or use IRSA.'],
    ['Docker Hub rate limit', 'Anonymous pull limits.', 'Add account secret or mirror.'],
    ['Network / firewall', 'Node cannot reach registry.', 'Check egress and DNS.'],
    ['Init container image', 'init:imagepullbackoff blocks main app.', 'Fix init image first.'],
  ]

  const DO_NOT_AUTOMATE = [
    ['Change image tag blindly', 'Wrong version ships to prod', 'Human verifies CI tag against registry'],
    ['Delete registry creds', 'Breaks all pulls cluster-wide', 'Approved rotation only'],
    ['Force :latest pulls', 'Rate limits and un-debuggable deploys', 'Pin digests or immutable tags'],
  ]

  const HUB_LINKS = [
    ['/blog/kubernetes-crashloopbackoff-fix', 'CrashLoopBackOff fix', 'After image pulls succeed'],
    ['/blog/kubernetes-init-crashloopbackoff', 'Init failures', 'Init container pull issues'],
    ['/blog/503-no-healthy-upstream', '503 upstream', 'Pods never become ready'],
    ['/blog/monitor-ollama-using-alertmend', 'Monitor Ollama', 'Large GPU images and pull timeouts'],
    ['/blog/debugging-kubernetes-oomkilled-exit-code-137-causes-and-solutions', 'OOMKilled', 'After pull succeeds'],
    ['/blog/make-error-127', 'make: error 127', 'CI image build failures'],
  ]

  const FAILURE_TABS = [
    ['auth', '🔒', 'Unauthorized', 'Pull secret'],
    ['tag', '🏷️', 'Wrong tag', 'manifest unknown'],
    ['init', '📦', 'Init container', 'init pull'],
    ['rate', '⏱️', 'Rate limit', 'Docker Hub'],
  ]

  const FAQ = [
    [
      'What is ImagePullBackOff in Kubernetes?',
      'ImagePullBackOff means Kubernetes failed to pull your container image and is waiting between retries with exponential backoff (10s, 20s, 40s, up to 5 minutes). Run kubectl describe pod and read the Events section. The fix is always in the pull error message: unauthorized, manifest unknown, or rate limit exceeded.',
    ],
    [
      'What is the difference between ErrImagePull and ImagePullBackOff?',
      'ErrImagePull is the immediate pull failure event. ImagePullBackOff is the waiting state kubelet enters after repeated ErrImagePull events. It backs off before trying again. Fix the underlying pull error; do not just delete the pod hoping backoff will help.',
    ],
    [
      'How do I fix ImagePullBackOff?',
      'Run kubectl describe pod <name> -n <namespace> and read Events. For unauthorized: create or refresh imagePullSecrets. For manifest unknown: fix the image: tag in your Deployment. For rate limits: add an authenticated Docker Hub secret or mirror to a private registry. Then kubectl rollout restart deployment/<name> or wait for the next retry.',
    ],
    [
      'How do I create an image pull secret for Kubernetes?',
      'kubectl create secret docker-registry regcred --docker-server=<registry-host> --docker-username=<user> --docker-password=<password> -n <namespace>. Add imagePullSecrets: [{name: regcred}] to your pod spec or patch the default ServiceAccount so all pods in the namespace inherit it.',
    ],
    [
      'Why does ImagePullBackOff happen after months of working?',
      'Common causes: expired ECR/GCR token in a manually created pull secret, deleted image tag in the registry, rotated CI credentials that were not updated in the cluster, or Docker Hub rate limits after node scale-up. Check describe Events for the exact message.',
    ],
    [
      'ImagePullBackOff vs CrashLoopBackOff?',
      'ImagePullBackOff: the container image never started, kubelet cannot pull the image. CrashLoopBackOff: the image pulled successfully but the container process keeps exiting. Different root causes, different fixes.',
    ],
    [
      'How do I fix ImagePullBackOff on AWS ECR?',
      'Refresh the pull secret with aws ecr get-login-password, or prefer EKS IRSA: attach AmazonEC2ContainerRegistryReadOnly to the pod ServiceAccount so nodes pull without a long-lived secret. Image format: ACCOUNT.dkr.ecr.REGION.amazonaws.com/repo:tag.',
    ],
    [
      'How do I prevent ImagePullBackOff?',
      'Pin image digests or immutable tags in CI, use IRSA or Workload Identity instead of manual pull secrets, mirror Docker Hub images to a private registry, and validate image references in CI before kubectl apply.',
    ],
  ]

  const KUBECTL_DIAGNOSTIC = `# 1. Find stuck pulls
kubectl get pods -A | grep -iE 'imagepull|errimage'
kubectl get pods -A -o wide | grep -i imagepull

# 2. Read the actual error (most important)
kubectl describe pod <pod-name> -n <namespace>
kubectl get events -n <namespace> --field-selector involvedObject.name=<pod-name> --sort-by='.lastTimestamp'

# Match the Events message to a failure mode, then jump to the fix:
# Unauthorized     → registry playbook (auth tab) or AWS ECR section
# manifest unknown → registry playbook (tag tab)
# toomanyrequests  → registry playbook (rate tab) or Docker Hub section
# Init container   → registry playbook (init tab)

# Full fix commands live in the registry sections below:
# AWS ECR (#aws-ecr) · GCR / AR (#gcr-ar) · Docker Hub (#docker-hub)`

  const ECR_SNIPPET = `# AWS ECR, refresh pull secret (tokens expire every 12 hours)
AWS_REGION=us-east-1
ACCOUNT_ID=123456789012
ECR_HOST=\${ACCOUNT_ID}.dkr.ecr.\${AWS_REGION}.amazonaws.com

kubectl create secret docker-registry ecr-regcred \\
  --docker-server=\${ECR_HOST} \\
  --docker-username=AWS \\
  --docker-password="$(aws ecr get-login-password --region \${AWS_REGION})" \\
  -n my-namespace --dry-run=client -o yaml | kubectl apply -f -

# Deployment image reference:
# image: \${ECR_HOST}/myapp:v2.3.1

# Preferred on EKS, IRSA (no long-lived pull secret):
# 1. Create IAM role with AmazonEC2ContainerRegistryReadOnly
# 2. Annotate ServiceAccount: eks.amazonaws.com/role-arn=arn:aws:iam::...
# 3. Pods using that SA pull from ECR automatically`

  const GCR_SNIPPET = `# Google Artifact Registry / GCR, service account key
kubectl create secret docker-registry gcr-regcred \\
  --docker-server=https://us-docker.pkg.dev \\
  --docker-username=_json_key \\
  --docker-password="$(cat service-account-key.json)" \\
  -n my-namespace

# Deployment image reference:
# image: us-docker.pkg.dev/PROJECT_ID/REPO_NAME/myapp:v2.3.1

# Preferred on GKE, Workload Identity:
# 1. Grant roles/artifactregistry.reader to the GSA linked to your KSA
# 2. Annotate KSA: iam.gke.io/gcp-service-account=gsa@project.iam.gserviceaccount.com
# 3. No pull secret needed for Artifact Registry`

  const DOCKERHUB_SNIPPET = `# Docker Hub, authenticated pulls avoid rate limits
# Anonymous: 100 pulls / 6h per IP. Authenticated: much higher limits.

kubectl create secret docker-registry dockerhub \\
  --docker-server=https://index.docker.io/v1/ \\
  --docker-username=YOUR_DOCKERHUB_USER \\
  --docker-password=YOUR_ACCESS_TOKEN \\
  -n my-namespace

kubectl patch serviceaccount default \\
  -p '{"imagePullSecrets":[{"name":"dockerhub"}]}' -n my-namespace

# For Docker Hub org images:
# image: docker.io/myorg/myapp:v2.3.1`

  const SECRET_YAML = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  template:
    spec:
      imagePullSecrets:
        - name: regcred
      containers:
        - name: api
          image: myregistry.io/myapp:v2.3.1
          imagePullPolicy: IfNotPresent`

  const PIN_DIGEST = `# Pin by digest in production (immutable, debuggable)
containers:
  - name: api
    image: myregistry.io/myapp@sha256:abc123def456...
    imagePullPolicy: IfNotPresent`

  const CI_VERIFY = `#!/bin/bash
# Fail CI if the image tag does not exist before deploy
set -euo pipefail
IMAGE="\${1:?usage: verify-image.sh myregistry.io/myapp:v2.3.1}"
docker manifest inspect "\$IMAGE" > /dev/null
echo "OK: \$IMAGE exists"`

  const renderPainScenarios = PAIN_SCENARIOS.map(
    ([when, t, body]) =>
      `<div class="fearScenario"><p class="fearScenarioWhen">${esc(when)}</p><h3 class="fearScenarioTitle">${esc(t)}</h3><p class="fearScenarioBody">${esc(body)}</p></div>`
  ).join('\n        ')

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
    name: 'Fix Kubernetes ImagePullBackOff',
    description: excerpt,
    step: DEBUG_STEPS.map(([name, text], i) => ({
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
${buildImagePullHeader(title, author, date, category)}

    <div class="dl-blog">
      <section class="heroBand fearBand">
        <div class="heroBrands">
          <span class="heroBrandText" style="font-size:1.5rem;font-weight:700;color:#09090b">ImagePullBackOff</span>
          <span class="heroBrandSep" aria-hidden="true">×</span>
          <a href="/" class="heroAmLink">
            <img src="/logos/alertmend-logo.svg" alt="AlertMend" class="heroAmLogo" width="128" height="28">
          </a>
        </div>
        <p class="heroGuideLabel">Kubernetes runbook · image pull failures</p>
        <p class="fearHeadline">STATUS: ImagePullBackOff. The container never started.</p>
        <p class="fearLead">You deleted the pod three times. The image still would not pull. During scale-up, every new node joined the outage. The backoff timer climbed to five minutes and the cluster looked dead while old cached pods kept serving traffic. Most teams fix the wrong thing first. The fix depends on which error message you see in Events, and one of them has a 90-day time bomb most teams do not know about.</p>
        <div class="fearScenarioGrid">
        ${renderPainScenarios}
        </div>

        <nav class="inThisGuide" aria-label="What you will learn">
          <p class="inThisGuideTitle">In this guide</p>
          <ul>
            <li><a href="#why-delete-worse">Why deleting pods makes ImagePullBackOff worse</a></li>
            <li><a href="#registry-playbook">Copy-paste fix for ECR, GCR, and Docker Hub</a></li>
            <li><a href="#aws-ecr">The 90-day secret expiry time bomb</a></li>
            <li><a href="#automation-framework">What is safe to automate (and what is not)</a></li>
            <li><a href="#prevention">Prevention checklist to stop repeat incidents</a></li>
          </ul>
        </nav>

        <div class="fearSeparator" aria-hidden="true"></div>
        <p class="fearBridge"><strong>Deleting the pod does not fix a wrong image tag or missing pull secret.</strong> Read describe Events, fix auth or tag, refresh secrets, then verify the pod reaches Running.</p>
      </section>

      <section class="heroBand heroBandCompact">
        <p class="seoTldr"><strong>TL;DR:</strong> ImagePullBackOff is never the real error. It is the timer. The real error is in <code>kubectl describe</code> Events. Below: the exact Events messages, what each means, and the copy-paste fix for each registry (ECR, GCR, Docker Hub, Harbor).</p>
      </section>

      <h2 class="sectionHead" id="what-is-imagepull">What is ImagePullBackOff?</h2>
      <p class="bodyText">Kubernetes could not pull your container image. <strong>ErrImagePull</strong> is the immediate error; <strong>ImagePullBackOff</strong> is the wait between retries. The kubelet backs off exponentially: 10s, 20s, 40s, up to five minutes. The fix is always in the pull error message in Events: <strong>unauthorized</strong> (auth), <strong>manifest unknown</strong> (wrong tag), <strong>toomanyrequests</strong> (rate limit), init container failures, or network/DNS issues.</p>
      <figure class="flowDiagram">
        <img src="${flowImage}" alt="ImagePullBackOff state flow: ContainerCreating to ErrImagePull to ImagePullBackOff to Running" width="960" height="200" loading="lazy">
        <figcaption class="flowDiagramCaption">ImagePullBackOff is the timer. ErrImagePull in Events is the cause.</figcaption>
      </figure>
      <div class="diyWrap">
        <table class="compareTable">
          <thead><tr><th>Status</th><th>Meaning</th><th>Next step</th></tr></thead>
          <tbody>
            ${LIFECYCLE_STATES.map(([s, m, n]) => `<tr><td><code>${esc(s)}</code></td><td>${esc(m)}</td><td class="diyHighlight">${esc(n)}</td></tr>`).join('\n            ')}
            <tr><td><code>CrashLoopBackOff</code></td><td>Image pulled then crashed</td><td class="diyHighlight">Different failure. See <a href="/blog/kubernetes-crashloopbackoff-fix">CrashLoopBackOff runbook</a></td></tr>
          </tbody>
        </table>
      </div>
      <p class="statusHook">Notice <code>CrashLoopBackOff</code> in the table? That is a different problem with a different fix, but teams confuse them constantly. See the <a href="/blog/kubernetes-crashloopbackoff-fix">CrashLoopBackOff runbook</a>.</p>

      <div class="jumpNav" id="jump-to-fix">
        <p class="jumpNavTitle">Found the error in Events? Jump to your fix:</p>
        <div class="jumpNavGrid">
          <button type="button" class="jumpNavBtn" data-jump-failure="auth" id="unauthorized"><span aria-hidden="true">🔒</span> Unauthorized</button>
          <button type="button" class="jumpNavBtn" data-jump-failure="tag" id="wrong-tag"><span aria-hidden="true">🏷️</span> Manifest Unknown</button>
          <button type="button" class="jumpNavBtn" data-jump-failure="rate" id="rate-limit"><span aria-hidden="true">⏱️</span> Rate Limit</button>
          <button type="button" class="jumpNavBtn" data-jump-failure="init" id="init-container"><span aria-hidden="true">📦</span> Init Container</button>
        </div>
      </div>

      <h2 class="sectionHead" id="five-step-workflow">ImagePullBackOff fix: five-step workflow</h2>
      <p class="verifiedNote">Commands verified on Kubernetes 1.30.</p>
      <div class="amFlow">
        ${DEBUG_STEPS.map(([t, b], i) => `<div class="amStep"><div class="amStepHead"><span class="amStepNum">${i + 1}</span></div><h3 class="amStepTitle">${esc(t)}</h3><p class="amStepBody">${esc(b)}</p></div>`).join('\n        ')}
      </div>
      <pre class="codeBlock"><code>${esc(KUBECTL_DIAGNOSTIC)}</code></pre>

      <h2 class="sectionHead" id="three-mistakes">Three mistakes that turn ImagePullBackOff into an outage</h2>
      <div class="insightGrid">
        <div class="insightCard">
          <h3 class="insightCardTitle">1. Deleting pods in a loop</h3>
          <p class="insightCardBody">kubectl delete pod forces an immediate retry but never fixes auth or tag errors. Worse: if you have a PodDisruptionBudget, the delete may not even reschedule. You reset the backoff timer, burn on-call attention, and the same Events message comes back on the next pull attempt.</p>
        </div>
        <div class="insightCard">
          <h3 class="insightCardTitle">2. Using :latest in production</h3>
          <p class="insightCardBody">When a pull fails with manifest unknown on a :latest tag, you cannot tell which digest you were trying to pull. Rollbacks become guesswork. Pin immutable tags or digests in CI so every failed pull points to an exact artifact you can verify in the registry.</p>
        </div>
        <div class="insightCard">
          <h3 class="insightCardTitle">3. Manual pull secrets instead of IRSA</h3>
          <p class="insightCardBody">kubectl create secret docker-registry embeds a token that goes stale. ECR tokens expire every 12 hours; manually created secrets can appear fine for months, then fail on the next scale-up when new nodes have no cached image. IRSA or Workload Identity removes the time bomb entirely.</p>
        </div>
      </div>

      <hr class="sectionBreak" aria-hidden="true">

      <section class="registryPlaybookZone" id="registry-playbook">
        <h2 class="sectionHead registryPlaybookHead">Pick a failure mode: registry playbook</h2>
        <p class="registryPlaybookIntro">Found your error? Click it for the exact fix:</p>
        <div class="modeGrid modeGridProminent" role="tablist" aria-label="ImagePullBackOff failure modes">
          ${FAILURE_TABS.map(([id, icon, t, sub], i) => `<button type="button" role="tab" data-failure-id="${id}" class="modeCard modeCardProminent${i === 0 ? ' modeCardActive' : ''}" aria-selected="${i === 0 ? 'true' : 'false'}"><span class="modeCardIcon" aria-hidden="true">${icon}</span><span class="modeCardTitle">${esc(t)}</span><span class="modeCardSub">${esc(sub)}</span></button>`).join('\n        ')}
        </div>
        <div class="modePlaybook" role="tabpanel">
          <div class="modePlaybookHead">
            <h3 class="modePlaybookTitle" id="failure-playbook-title">Unauthorized</h3>
          </div>
          <p class="modePlaybookSummary" id="failure-playbook-summary"></p>
          <ul class="checkList" id="failure-playbook-steps"></ul>
          <pre class="playbookCode" id="failure-playbook-code" aria-label="kubectl commands"></pre>
          <p class="autofixBadge" id="failure-playbook-autofix"></p>
          <div class="stepTip"><span id="failure-playbook-tip"></span></div>
        </div>
      </section>

      <h2 class="sectionHead">Fix private registry: imagePullSecrets</h2>
      <p class="bodyText">Private ECR, GCR, Artifact Registry, Harbor, and GitLab registries require credentials. The secret must live in the <strong>same namespace</strong> as the pod, or be attached to the ServiceAccount.</p>
      <pre class="codeBlock"><code>${esc(SECRET_YAML)}</code></pre>

      <h2 class="sectionHead" id="aws-ecr">AWS ECR: refresh token or use IRSA</h2>
      <p class="bodyText">ECR tokens expire every 12 hours. Manually created pull secrets go stale. On EKS, prefer IRSA so pods pull without a long-lived secret.</p>
      <div class="ecrTimeBomb">
        <p><strong>12-hour to 90-day failure cascade:</strong> ECR tokens expire every 12 hours. If you created a pull secret manually in January, it worked until March, then every deploy and scale-up failed simultaneously. IRSA eliminates this entirely.</p>
      </div>
      <pre class="codeBlock"><code>${esc(ECR_SNIPPET)}</code></pre>

      <h2 class="sectionHead" id="gcr-ar">GCR / Artifact Registry: key or Workload Identity</h2>
      <p class="bodyText">On GKE, Workload Identity is the production pattern. You do not need a pull secret to rotate. For other clusters, use a service account JSON key in a docker-registry secret.</p>
      <pre class="codeBlock"><code>${esc(GCR_SNIPPET)}</code></pre>

      <h2 class="sectionHead" id="docker-hub">Docker Hub: beat rate limits</h2>
      <p class="bodyText">Anonymous Docker Hub pulls are limited to 100 per 6 hours per IP. Node scale-ups and fresh clusters hit this fast. Authenticate with a pull secret or mirror images to your private registry.</p>
      <pre class="codeBlock"><code>${esc(DOCKERHUB_SNIPPET)}</code></pre>
      <p class="citeRow">Reference: <a href="https://kubernetes.io/docs/concepts/containers/images/" target="_blank" rel="noopener noreferrer">Kubernetes container images</a> · <a href="https://docs.aws.amazon.com/AmazonECR/latest/userguide/Registries.html" target="_blank" rel="noopener noreferrer">AWS ECR docs</a></p>

      <h2 class="sectionHead" id="common-causes">Common ImagePullBackOff causes</h2>
      <div class="searchIssueGrid">
        ${COMMON_CAUSES.map(([term, desc, fix]) => `<div class="searchIssueCard"><h3 class="searchIssueTerm">${esc(term)}</h3><p class="searchIssueDesc">${esc(desc)}</p><p class="searchIssueAlert"><strong>Fix:</strong> ${esc(fix)}</p></div>`).join('\n        ')}
      </div>

      <div class="insightCallout backoffTeaser" id="delete-pod-teaser">
        <p>There is a reason deleting the pod makes it worse. (Hint: the backoff timer goes up to <strong>___</strong> minutes.)</p>
      </div>

      <h2 class="sectionHead" id="why-delete-worse">Why deleting the pod makes ImagePullBackOff worse</h2>
      <p class="bodyText">ImagePullBackOff is a backoff state, not a bug in the pod object. When you kubectl delete pod, Kubernetes creates a replacement that hits the same pull error immediately. You have not changed the image reference, the pull secret, or the registry state. You have only interrupted the backoff clock.</p>
      <p class="bodyText">Worse: deleting can mask the pattern. If three replicas fail pulls on a staggered schedule, deleting one at a time makes it look intermittent. The describe Events on the surviving pods still show the real error. Fix the pull message once, then rollout restart if needed.</p>
      <pre class="codeBlock"><code># What delete actually does (same error, fresh pod name):
kubectl delete pod api-7f9c2b8d4-xk2mn -n production
# New pod: api-7f9c2b8d4-qm8zt → same Events: unauthorized

# What fix + restart does:
kubectl apply -f deployment-with-fixed-secret.yaml
kubectl rollout restart deployment/api -n production
kubectl rollout status deployment/api -n production</code></pre>
      <div class="proofBand proofBandInline">
        <p class="proofStat"><span class="proofStatNum">5 min</span> max backoff between retries</p>
        <p class="proofBody">After repeated ErrImagePull events, kubelet waits up to five minutes before the next pull attempt. Deleting the pod resets that clock briefly, then you wait again. Fix the root cause once and the pod reaches Running on the next successful pull.</p>
      </div>

      <h2 class="sectionHead" id="automation-framework">What is safe to automate vs human required</h2>
      <p class="bodyText">Not every ImagePullBackOff should wake someone up. Use this framework before wiring auto-remediation:</p>
      <div class="searchIssueGrid">
        <div class="searchIssueCard">
          <h3 class="searchIssueTerm">Safe to automate</h3>
          <p class="searchIssueDesc">Transient registry blip (short network failure): restart after backoff if pull succeeds on retry. Post-secret-rotation: rollout restart after a human refreshes the pull secret, then verify Running. Node-specific failure: cordon the node if only one host cannot pull.</p>
        </div>
        <div class="searchIssueCard">
          <h3 class="searchIssueTerm">Human required</h3>
          <p class="searchIssueDesc">Wrong image tag, expired credentials that need registry login, init container image typos, and Docker Hub rate limits that need auth or mirroring. Automation should surface describe Events and stop. It should not guess a new image tag.</p>
        </div>
      </div>
      <div class="diyWrap" style="margin-top:1.25rem">
        <table class="compareTable">
          <thead><tr><th>Do not automate</th><th>Why</th><th>Instead</th></tr></thead>
          <tbody>
            ${DO_NOT_AUTOMATE.map(([s, w, a]) => `<tr><td>${esc(s)}</td><td>${esc(w)}</td><td class="diyHighlight">${esc(a)}</td></tr>`).join('\n            ')}
          </tbody>
        </table>
      </div>

      <h2 class="sectionHead" id="prevention">After you fix the pull: prevent the next outage</h2>
      <p class="bodyText">These four practices work on any cluster, with or without third-party tooling:</p>
      <h3 class="subsectionHead">1. Pin image digests in production</h3>
      <p class="bodyText">Immutable digests make every deploy auditable and make manifest unknown errors debuggable.</p>
      <pre class="codeBlock"><code>${esc(PIN_DIGEST)}</code></pre>
      <h3 class="subsectionHead">2. Use IRSA or Workload Identity, not manual secrets</h3>
      <p class="bodyText">On EKS and GKE, attach registry read permissions to the pod ServiceAccount. No 12-hour token cliff, no 90-day surprise. See the <a href="#aws-ecr">ECR</a> and <a href="#gcr-ar">GCR</a> sections above.</p>
      <h3 class="subsectionHead">3. Mirror Docker Hub to a private registry</h3>
      <p class="bodyText">Pull public images once into ECR, GCR, or Harbor. Point Deployments at your mirror. Node scale-ups never hit Docker Hub rate limits.</p>
      <h3 class="subsectionHead">4. Verify image tags exist in CI before deploy</h3>
      <p class="bodyText">Catch typos before kubectl apply. Three lines in your pipeline:</p>
      <pre class="codeBlock"><code>${esc(CI_VERIFY)}</code></pre>
      <p class="bodyText preventionNote">If you want to automate monitoring after these fixes, <a href="${postSignupUrl}">AlertMend</a> surfaces describe Events in Slack when pulls fail again and verifies pods reach Running after secret rotation.</p>

      <h2 class="sectionHead">Related deep dives</h2>
      <div class="hubLinks">
        ${HUB_LINKS.map(([href, t, d]) => `<a href="${href}" class="hubLinkCard"><p class="hubLinkTitle">${esc(t)}</p><p class="hubLinkDesc">${esc(d)}</p></a>`).join('\n        ')}
      </div>

      <h2 class="sectionHead" id="faq">FAQ</h2>
      <div class="faqList">
        ${FAQ.map(([q, a], i) => `<div class="faqItem"><button type="button" class="faqQuestion" data-faq-toggle aria-expanded="${i === 0 ? 'true' : 'false'}">${esc(q)}<svg class="faqChevron${i === 0 ? ' faqChevronOpen' : ''}" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 9l6 6 6-6"/></svg></button><div class="faqAnswer${i === 0 ? '' : ' hidden'}">${esc(a)}</div></div>`).join('\n        ')}
      </div>

      <div class="ctaBand">
        <div class="ctaBandTitle">You fixed the pull. The next incident will be different.</div>
        <p class="ctaBandSub">You've refreshed the secret, fixed the tag, and verified the pod is Running. The next failure might be an expired token in 90 days, a Docker Hub rate limit during Black Friday scale-up, or an init container image nobody maintains. AlertMend surfaces describe Events in Slack when pulls fail again and verifies recovery after you fix secrets and tags.</p>
        <div class="ctaBtnRow">
          <a href="${postSignupUrl}" class="ctaBtn">Monitor pull failures free →</a>
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
