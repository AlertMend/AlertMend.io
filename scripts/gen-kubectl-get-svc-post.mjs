/**
 * Revive of /blog/kubectl-get-svc (was a thin markdown post with weak CTR at pos ~4).
 * Rewritten as a rich static post that covers the whole GSC query cluster: what svc
 * means, reading the output columns, all-namespaces, output formats, describe/endpoints,
 * service URL, oc get svc, and EXTERNAL-IP pending. Kubernetes-blue, official docs cited.
 * Aligned to current standard (cred header, working signup, free consultation). No em dashes.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { SITE_URL, esc, CHROME_INLINE_CSS, AUTHOR_CRED_CSS, ARVIND_AUTHOR, buildNavHtml, buildSidebarHtml, buildCredArticleHeader, calendlyUrl, appendBlogSignupHandler } from './static-blog-shared.mjs'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const DATE = '2025-12-15', MODIFIED = '2026-07-07'
// Old article (revive): keep the original author, Arvind. See dont-reassign-author-on-old-rewrites.
const author = {
  ...ARVIND_AUTHOR,
  role: 'Co-Founder & CEO',
  credLine: 'Kubestronaut and Kubernetes expert with 15+ years in infrastructure automation',
  linkedin: 'https://www.linkedin.com/in/arvind-rajpurohit-4a332523/',
}
const AUTHOR = author.name
const LINKEDIN = author.linkedin
const ACCENT = '#326ce5', ACCENT_DARK = '#0b2447'
const K8S_LOGO = (() => { try { return (fs.readFileSync(path.join(root, 'public/logos/brand/kubernetes.svg'), 'utf8').match(/d="([^"]+)"/) || [null, ''])[1] } catch { return '' } })()

const SCRIPT_JS = `(function () {
  document.querySelectorAll('[data-faq-toggle]').forEach((b) => {
    b.addEventListener('click', () => {
      const item = b.closest('.faqItem'); const answer = item && item.querySelector('.faqAnswer'); const chev = b.querySelector('.faqChevron');
      const open = b.getAttribute('aria-expanded') === 'true';
      b.setAttribute('aria-expanded', open ? 'false' : 'true');
      if (answer) answer.classList.toggle('hidden', open); if (chev) chev.classList.toggle('faqChevronOpen', !open);
    });
  });
  document.querySelectorAll('.copyableCode').forEach((block) => {
    const code = block.querySelector('code'); if (!code) return;
    const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'codeCopyButton'; btn.textContent = 'Copy';
    btn.addEventListener('click', async () => { try { await navigator.clipboard.writeText(code.textContent || ''); btn.textContent = 'Copied'; setTimeout(() => { btn.textContent = 'Copy'; }, 1600); } catch { btn.textContent = 'Select text'; } });
    block.appendChild(btn);
  });
})();
`

const ANSWER_CARD_CSS = `
:root{--am-accent:${ACCENT};}
.instantFix{position:relative;margin-bottom:1rem;padding:1.15rem;overflow:hidden;border:1px solid #c7dbfa;border-radius:14px;background:#fff;box-shadow:0 8px 28px rgba(9,9,11,.05);}
.instantFixTop{display:flex;flex-direction:column;align-items:flex-start;gap:.35rem;margin-bottom:.6rem;}
.instantFixTop span{color:var(--am-accent);font-size:.65rem;font-weight:800;letter-spacing:.09em;text-transform:uppercase;}
.instantFixTop strong{color:#18181b;font-size:.95rem;line-height:1.45;}
.instantFix>p{margin:0 0 .9rem;max-width:680px;color:#3f3f46;font-size:1rem;line-height:1.6;}
.instantFixCommands{display:grid;grid-template-columns:max-content minmax(0,1fr);gap:.4rem .8rem;align-items:center;padding:.75rem;border-radius:8px;background:#18181b;}
.instantFixCommands code{color:#c7dbfa;font-size:.75rem;}
.instantFixCommands span{color:#a1a1aa;font-size:.72rem;}
.sectionHead{border-left:4px solid var(--am-accent);padding-left:14px;}
.heroGuideLabel{color:var(--am-accent);}
.bodyText a,.sourceList a,.faqAnswer a{color:var(--am-accent);}
.brandChip{display:inline-flex;align-items:center;gap:9px;margin:0 0 1.25rem;padding:6px 15px 6px 11px;border:1px solid #e4e4e7;border-radius:999px;background:#fff;}
.brandChip span{font-size:.82rem;font-weight:600;color:#52525b;}
.rbGrid{display:grid;grid-template-columns:1fr;gap:12px;margin:1.25rem 0 2rem;}
@media(min-width:720px){.rbGrid{grid-template-columns:repeat(2,1fr);}}
.rbCard{padding:18px;border:1px solid #e4e4e7;border-radius:10px;background:#fff;border-top:3px solid var(--am-accent);}
.rbCard h3{margin:0 0 4px;color:#18181b;font-size:1rem;}
.rbCard p{margin:0;color:#52525b;font-size:.88rem;line-height:1.6;}
.calloutBox{margin:1.5rem 0;padding:18px 20px;border-left:3px solid var(--am-accent);border-radius:0 10px 10px 0;background:#eff5fe;color:#3f3f46;line-height:1.7;}
.calloutBox strong{color:#18181b;}
.ctaInline{margin:1.6rem 0;padding:15px 18px;border-left:3px solid var(--am-accent);border-radius:0 10px 10px 0;background:#f5f9ff;font-weight:600;color:#27272a;}
.ctaInline a{color:var(--am-accent);}
.authorBioCard{display:flex;gap:24px;align-items:flex-start;flex-wrap:wrap;padding-bottom:1rem;}
.authorBioCard h3{font-size:1.5rem;font-weight:800;color:#09090b;margin:0 0 4px;}
.authorBioRole{color:var(--am-accent);font-weight:600;margin:0 0 14px;}
.authorBioText{color:#3f3f46;line-height:1.75;}
.authorBioLink{display:inline-flex;align-items:center;gap:6px;margin-top:14px;color:#71717a;text-decoration:none;font-weight:600;}
`

function codeBlock(code) { return `<pre class="codeBlock copyableCode"><code>${esc(code)}</code></pre>` }

function authorCard() {
  return `
          <hr style="margin:2.5rem 0 1.75rem;border:none;border-top:1px solid #e4e4e7;">
          <div class="authorBioCard">
            <img src="/logos/arvind.jpeg" alt="${AUTHOR}" width="128" height="128" loading="lazy" style="width:128px;height:128px;border-radius:12px;object-fit:cover;border:1px solid #e4e4e7;flex-shrink:0;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
            <div style="display:none;width:128px;height:128px;border-radius:12px;border:1px solid #e4e4e7;background:#f4f4f5;align-items:center;justify-content:center;font-weight:800;font-size:2.25rem;color:#3f3f46;flex-shrink:0;">AR</div>
            <div style="flex:1;min-width:240px;">
              <h3>${AUTHOR}</h3>
              <p class="authorBioRole">Co-Founder &amp; CEO</p>
              <div class="authorBioText">
                <p style="margin:0 0 10px;">Arvind is a Kubestronaut and Kubernetes expert with 15+ years of experience in infrastructure automation.</p>
                <p style="margin:0;">Previously DevOps Team Lead at Roambee and Customer Success Engineer at Shoreline.io (acquired by NVIDIA), he has helped teams improve uptime, reduce cloud cost, and eliminate manual operations work. At AlertMend, Arvind focuses on safe autonomous remediation for Kubernetes, VMs, and production reliability incidents.</p>
              </div>
              <a class="authorBioLink" href="${LINKEDIN}" target="_blank" rel="noopener noreferrer" aria-label="${AUTHOR} on LinkedIn">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zM8.34 18V9.94H5.67V18h2.67zM7 8.76a1.55 1.55 0 1 0 0-3.1 1.55 1.55 0 0 0 0 3.1zM18.34 18v-4.42c0-2.37-1.27-3.47-2.96-3.47-1.36 0-1.97.75-2.31 1.28V9.94h-2.67V18h2.67v-4.5c0-.24.02-.48.09-.65.19-.48.63-.98 1.36-.98.96 0 1.35.73 1.35 1.8V18h2.82z"/></svg>
                <span>LinkedIn</span>
              </a>
            </div>
          </div>`
}

const BASIC = `# List Services in the current namespace
kubectl get svc

# svc, service, and services are the same resource
kubectl get service
kubectl get services

# Typical output
NAME         TYPE           CLUSTER-IP     EXTERNAL-IP    PORT(S)        AGE
kubernetes   ClusterIP      10.96.0.1      <none>         443/TCP        30d
web          ClusterIP      10.96.120.45   <none>         80/TCP         5d
api          LoadBalancer   10.96.88.7     34.120.10.5    80:31840/TCP   2d`

const LIST = `# A specific namespace
kubectl get svc -n my-namespace

# Every namespace (adds a NAMESPACE column)
kubectl get svc -A
kubectl get svc --all-namespaces

# Filter by label
kubectl get svc -l app=web

# Sort, and watch for live changes
kubectl get svc --sort-by=.metadata.name
kubectl get svc -w`

const FORMATS = `# Wider table (adds the SELECTOR column)
kubectl get svc -o wide

# Full definition
kubectl get svc web -o yaml
kubectl get svc web -o json

# Extract one field with jsonpath
kubectl get svc web -o jsonpath='{.spec.clusterIP}'

# Pick your own columns
kubectl get svc -o custom-columns=NAME:.metadata.name,TYPE:.spec.type,IP:.spec.clusterIP

# Just the names
kubectl get svc -o name`

const DESCRIBE = `# Detail: selector, ports, endpoints, and events
kubectl describe svc web

# The pods actually backing the Service
kubectl get endpoints web
kubectl get endpointslices -l kubernetes.io/service-name=web`

const URL = `# Local cluster (minikube): print a reachable URL
minikube service web --url

# LoadBalancer: the external IP
kubectl get svc web -o jsonpath='{.status.loadBalancer.ingress[0].ip}'

# NodePort: the 3xxxx port opened on every node
kubectl get svc web -o jsonpath='{.spec.ports[0].nodePort}'

# OpenShift uses the oc CLI, same syntax
oc get svc
oc get svc -A`

const RUNBOOK_SNIPPET = `# Illustrative runbook: a Service lost its endpoints (auto-triage + fix)
trigger:
  on_alert: endpoints_ready{service="web"} == 0     # AlertMend detects the drop
steps:
  - query   kubectl get svc web -o jsonpath='{.spec.selector}'
  - query   kubectl get pods -l <selector> -o wide   # matching pods, and are they Ready?
  - branch  if pods_match and pods_not_ready:         # backends exist but unhealthy
      - approve  channel=slack                        # human gate before a restart
      - kubectl  rollout restart deploy/web           # recover the backing pods
  - branch  if no_pods_match:                         # selector matches no labels
      - notify   slack: "selector mismatch, config fix needed" + the diff
  - notify  slack summary  +  jira create  +  audit log`

const CFG = {
  slug: 'kubectl-get-svc',
  title: 'kubectl get svc: List and Read Services',
  h1: 'kubectl get svc: List, Read, and Troubleshoot Kubernetes Services',
  excerpt: 'kubectl get svc lists Kubernetes Services. Learn what svc means, how to read the output, list all namespaces, and fix a pending EXTERNAL-IP.',
  keywords: 'kubectl get svc, kubectl get services, kubectl get svc all namespaces, what is svc in kubernetes, svc meaning, kubectl get svc output, kubectl describe svc, oc get svc, kubernetes service, kubectl list services, get svc',
  category: 'Kubernetes',
  columns: [
    ['NAME', 'The Service name. Reach it in-cluster at name.namespace.svc.cluster.local.'],
    ['TYPE', 'ClusterIP (internal only, the default), NodePort, LoadBalancer (external), or ExternalName (a DNS alias).'],
    ['CLUSTER-IP', 'The stable internal IP. None means a headless Service (DNS returns the pod IPs directly).'],
    ['EXTERNAL-IP', 'The external address for a LoadBalancer or NodePort. Shows <none>, or <pending> while a load balancer is being provisioned.'],
    ['PORT(S)', 'The Service port, and for NodePort the port:nodePort mapping (for example 80:31840/TCP).'],
    ['AGE', 'How long the Service has existed.'],
  ],
  issues: [
    ['EXTERNAL-IP stuck on <pending>', 'A LoadBalancer Service is waiting for the cloud provider to assign an address. On bare metal with no load-balancer controller it stays pending forever. Use a cloud that provisions load balancers, install MetalLB, or switch to NodePort.'],
    ['Service has no endpoints', 'The Service selector matches no ready pods, so nothing serves traffic. Run kubectl get endpoints <name>; an empty list means the selector does not equal your pod labels, or the pods are not Ready.'],
    ['Service is not reachable', 'The port or targetPort is wrong, a NetworkPolicy is blocking it, or DNS is failing. Check kubectl describe svc, confirm targetPort matches the container port, and test from a pod in the cluster.'],
    ['Wrong or missing CLUSTER-IP', 'A headless Service (clusterIP: None) has no single IP by design. Otherwise a missing IP points at an admission or quota problem when the Service was created.'],
  ],
  faqs: [
    ['What does svc mean in kubectl?', 'svc is the short name that kubectl uses for a Service. kubectl get svc, kubectl get service, and kubectl get services are the exact same command; svc, service, and services are aliases for the same resource. You can see the mapping with kubectl api-resources.'],
    ['What is a Service (svc) in Kubernetes?', 'A Service is a stable network endpoint, a fixed IP address and DNS name, for a set of pods selected by a label. Because pods are ephemeral and change IP when they restart, other workloads talk to the Service instead of directly to pods, and Kubernetes load-balances across the healthy ones.'],
    ['How do I list services in all namespaces?', 'Run kubectl get svc -A, or the long form kubectl get svc --all-namespaces. It lists every Service in the cluster and adds a NAMESPACE column so you can tell them apart.'],
    ['How do I get services in a specific namespace?', 'Use kubectl get svc -n <namespace> (or --namespace <namespace>). Without the flag, kubectl only shows the Services in your current namespace.'],
    ['What do the kubectl get svc output columns mean?', 'NAME is the Service name; TYPE is ClusterIP, NodePort, LoadBalancer, or ExternalName; CLUSTER-IP is the internal IP (None for headless); EXTERNAL-IP is the external address (or <none> or <pending>); PORT(S) is the port, plus the nodePort for NodePort; and AGE is how long it has existed.'],
    ['How do I get a service URL?', 'On a local cluster, minikube service <name> --url prints a reachable URL. On a real cluster, a LoadBalancer Service is reachable at its EXTERNAL-IP and port, and a NodePort Service at any node IP plus the 3xxxx nodePort.'],
    ['Why is EXTERNAL-IP showing <pending>?', 'The Service is type LoadBalancer and is waiting for the cloud provider to assign an external address. On bare metal or a local cluster with no load-balancer controller it stays pending. Install MetalLB, use a managed cloud, or switch the Service to NodePort.'],
    ['How do I see the pods behind a service?', 'Run kubectl get endpoints <name> (or kubectl describe svc <name>). The endpoints are the pod IPs the Service routes to. An empty list means the selector matches no Ready pods, which is the most common reason a Service returns nothing.'],
    ['Is kubectl get svc the same as kubectl get service?', 'Yes. svc, service, and services all refer to the Service resource, so the three commands are identical. svc is just the shortest alias.'],
    ['What is oc get svc?', 'oc is the OpenShift command-line tool, and oc get svc is its equivalent of kubectl get svc, with the same flags such as -A, -n, and -o. If you are on OpenShift, use oc; on plain Kubernetes, use kubectl.'],
  ],
  sources: [
    ['Kubernetes: kubectl get reference', 'https://kubernetes.io/docs/reference/kubectl/generated/kubectl_get/'],
    ['Kubernetes: Service concept', 'https://kubernetes.io/docs/concepts/services-networking/service/'],
    ['Kubernetes: Service types (ClusterIP, NodePort, LoadBalancer)', 'https://kubernetes.io/docs/concepts/services-networking/service/#publishing-services-service-types'],
    ['Kubernetes: kubectl cheat sheet', 'https://kubernetes.io/docs/reference/kubectl/cheatsheet/'],
  ],
}

function jsonLd() {
  const canonical = `${SITE_URL}/blog/${CFG.slug}`, img = `${SITE_URL}/assets/${CFG.slug}/hero.png`
  const article = { '@context': 'https://schema.org', '@type': 'TechArticle', headline: CFG.title, description: CFG.excerpt, image: img, datePublished: DATE, dateModified: MODIFIED, author: { '@type': 'Person', name: AUTHOR, jobTitle: author.role, url: LINKEDIN, sameAs: [LINKEDIN] }, publisher: { '@type': 'Organization', name: 'AlertMend AI', logo: { '@type': 'ImageObject', url: `${SITE_URL}/logos/alertmend-logo.svg` } }, mainEntityOfPage: { '@type': 'WebPage', '@id': canonical } }
  const faq = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: CFG.faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) }
  return [article, faq].map((o) => `  <script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n')
}

function render() {
  const canonical = `${SITE_URL}/blog/${CFG.slug}`, cal = calendlyUrl(CFG.slug), img = `${SITE_URL}/assets/${CFG.slug}/hero.png`
  const related = [['kubernetes-crashloopbackoff-fix', 'Fix CrashLoopBackOff'], ['503-no-healthy-upstream', '503 No Healthy Upstream'], ['top-kubernetes-cost-management-solutions', 'Kubernetes Cost Management']]
  const relatedSidebar = [
    { slug: 'kubernetes-crashloopbackoff-fix', title: 'Kubernetes CrashLoopBackOff Fix' },
    { slug: '503-no-healthy-upstream', title: '503 No Healthy Upstream' },
    { slug: 'kubernetes-imagepullbackoff-fix', title: 'ImagePullBackOff and ErrImagePull' },
    { slug: 'autoscaling-v2-horizontalpodautoscaler', title: 'Kubernetes HPA v2' },
    { slug: 'top-kubernetes-cost-management-solutions', title: 'Top Kubernetes Cost Management Solutions' },
  ]
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(CFG.title)} | AlertMend AI</title>
  <meta name="description" content="${esc(CFG.excerpt)}">
  <meta name="keywords" content="${esc(CFG.keywords)}">
  <meta name="author" content="${AUTHOR}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <link rel="canonical" href="${canonical}">
  <link rel="icon" type="image/svg+xml" href="/logos/alertmend-logo.svg">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${canonical}">
  <meta property="og:title" content="${esc(CFG.title)}">
  <meta property="og:description" content="${esc(CFG.excerpt)}">
  <meta property="og:image" content="${img}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(CFG.title)}">
  <meta name="twitter:description" content="${esc(CFG.excerpt)}">
  <meta name="twitter:image" content="${img}">
${jsonLd()}
  <link rel="stylesheet" href="/assets/make-error-127/styles.css">
  <link rel="stylesheet" href="/assets/${CFG.slug}/styles.css">
  <style>${CHROME_INLINE_CSS}${AUTHOR_CRED_CSS}${ANSWER_CARD_CSS}</style>
</head>
<body>
${buildNavHtml(CFG.slug, cal)}
  <div class="main-container">
    <div class="content-wrapper">
      <div class="main-col">
${buildCredArticleHeader(CFG.h1, DATE, CFG.category, author)}
      <div class="brandChip"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="${K8S_LOGO}" fill="${ACCENT}"/></svg><span>Kubernetes command reference</span></div>
      <div class="proofBar" style="display:flex;flex-wrap:wrap;gap:8px 16px;align-items:center;margin:-.75rem 0 1.5rem;color:#52525b;font-size:.82rem;">
        <span style="display:inline-flex;align-items:center;gap:6px;font-weight:700;color:#047857;"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>Verified against the official kubectl and Kubernetes docs</span>
        <span style="color:#d4d4d8;">&bull;</span><span>Last reviewed ${MODIFIED}</span>
        <span style="color:#d4d4d8;">&bull;</span><span>${CFG.sources.length} primary sources</span>
      </div>
    <div class="dl-blog">
      <section class="heroBand heroBandCompact">
        <p class="heroGuideLabel">Kubernetes reference · kubectl get svc</p>
        <div class="instantFix">
          <div class="instantFixTop"><span>THE 30-SECOND ANSWER</span><strong>kubectl get svc lists the Services in your current namespace.</strong></div>
          <p><code>svc</code> is just the short name for <strong>Service</strong>, so <code>kubectl get svc</code>, <code>get service</code>, and <code>get services</code> are the same command. Add <code>-A</code> for every namespace, <code>-o wide</code> for more detail, and <code>describe</code> for the pods behind a Service.</p>
          <div class="instantFixCommands">
            <code>kubectl get svc</code><span>current namespace</span>
            <code>kubectl get svc -A</code><span>every namespace</span>
            <code>kubectl describe svc &lt;name&gt;</code><span>detail + endpoints</span>
          </div>
        </div>
      </section>

      <nav class="articleToc" aria-label="On this page"><strong>On this page</strong>
        <a href="#basics">What svc means</a>
        <a href="#output">Read the output</a>
        <a href="#list">List services</a>
        <a href="#formats">Output formats</a>
        <a href="#describe">Describe and endpoints</a>
        <a href="#url">Get a service URL</a>
        <a href="#issues">Common issues</a>
        <a href="#automate">Automate the fix</a>
        <a href="#faq">FAQ</a>
      </nav>

      <h2 class="sectionHead" id="basics">What svc means, and the basic command</h2>
      <p class="bodyText"><code>svc</code> is the short alias kubectl uses for a <strong>Service</strong>. A Service gives a stable IP address and DNS name to a set of pods selected by a label, so other workloads can reach them even as pods restart and change IP. Running <code>kubectl get svc</code> lists the Services in your current namespace.</p>
      ${codeBlock(BASIC)}

      <h2 class="sectionHead" id="output">Reading the kubectl get svc output</h2>
      <p class="sectionSub">Every column tells you something specific. This is what to look for when you run the command.</p>
      <div class="diyWrap"><table class="compareTable"><thead><tr><th>Column</th><th>What it means</th></tr></thead><tbody>
        ${CFG.columns.map((r) => `<tr><td><code>${esc(r[0])}</code></td><td>${esc(r[1])}</td></tr>`).join('\n        ')}
      </tbody></table></div>

      <h2 class="sectionHead" id="list">List services: one namespace, or all</h2>
      <p class="bodyText">By default kubectl only shows the current namespace. Use <code>-n</code> for a specific one and <code>-A</code> for every namespace, which is how you answer "list all services" across the cluster.</p>
      ${codeBlock(LIST)}

      <h2 class="sectionHead" id="formats">Output formats: wide, yaml, json, jsonpath</h2>
      <p class="bodyText">The default table is a summary. Change the format to see the full definition or to script against a single field.</p>
      ${codeBlock(FORMATS)}

      <h2 class="sectionHead" id="describe">Describe a service and see its endpoints</h2>
      <p class="bodyText"><code>kubectl describe svc</code> shows the selector, ports, and events, and the endpoints are the pods actually backing the Service. An empty endpoints list is the number-one reason a Service returns nothing.</p>
      ${codeBlock(DESCRIBE)}

      <h2 class="sectionHead" id="url">Get a service URL (and oc get svc)</h2>
      <p class="bodyText">How you reach a Service depends on its type. Locally, minikube prints a URL; on a cluster it is the EXTERNAL-IP for a LoadBalancer or a node IP plus nodePort for a NodePort. On OpenShift, use <code>oc</code> instead of <code>kubectl</code>.</p>
      ${codeBlock(URL)}

      <div class="ctaInline">Tired of running these by hand every time something breaks? <a href="${cal}" target="_blank" rel="noopener noreferrer">Book a free consultation &rarr;</a> and see how AlertMend watches Services and endpoints for you.</div>

      <h2 class="sectionHead" id="issues">Common issues and fixes</h2>
      <div class="rbGrid">${CFG.issues.map((c) => `<div class="rbCard"><h3>${esc(c[0])}</h3><p>${esc(c[1])}</p></div>`).join('')}</div>
      <div class="calloutBox"><strong>From command to continuous:</strong> <code>kubectl get svc</code> shows the state right now. AlertMend watches your Services, their endpoints, and the pods behind them continuously, so a Service that loses its endpoints or a LoadBalancer stuck pending raises an alert with the root cause, before a user finds it first. Every command on this page works without AlertMend.</div>

      <h2 class="sectionHead" id="automate">Automate the fix with a runbook</h2>
      <p class="bodyText">Running these commands by hand works once. When the same Service problem recurs, an AlertMend runbook can detect it, run the diagnosis for you, and fix the recoverable cases automatically. Here is the "Service lost its endpoints" case, written out as an illustrative runbook.</p>
      ${codeBlock(RUNBOOK_SNIPPET)}
      <p class="bodyText">The logic branches on the actual cause: if the backing pods exist but are unhealthy, it restarts them behind an approval; if the selector matches nothing, it flags a config fix instead of blindly restarting. The full pattern, alert to query to targeted fix to approval, is in <a href="/blog/cross-stack-incident-automation">cross-stack incident automation</a>, and the scheduled, fleet-wide version is in <a href="/blog/automate-ops-toil">runbook automation for toil</a>.</p>

      <h2 class="sectionHead" id="sources">Primary sources</h2>
      <ul class="sourceList">${CFG.sources.map(([l, u]) => `<li><a href="${u}" target="_blank" rel="noopener noreferrer">${esc(l)}</a></li>`).join('')}</ul>

      <h2 class="sectionHead" id="faq">kubectl get svc FAQ</h2>
      <div class="faqList">${CFG.faqs.map(([q, a], i) => `<div class="faqItem"><button type="button" class="faqQuestion" data-faq-toggle aria-expanded="${i === 0 ? 'true' : 'false'}">${esc(q)}<svg class="faqChevron${i === 0 ? ' faqChevronOpen' : ''}" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 9l6 6 6-6"/></svg></button><div class="faqAnswer${i === 0 ? '' : ' hidden'}">${esc(a)}</div></div>`).join('')}</div>
${authorCard()}
      <div class="ctaBand">
        <div class="ctaBandTitle">Stop finding broken Services from a user complaint.</div>
        <p class="ctaBandSub">AlertMend watches your Kubernetes Services, endpoints, and the pods behind them, and raises an alert with the root cause when a Service loses its backends or a load balancer stalls. The consultation is free and with no obligation.</p>
        <div class="ctaBtnRow"><a href="${cal}" class="ctaBtn" target="_blank" rel="noopener noreferrer">Book a free consultation &rarr;</a></div>
      </div>
    </div>
    <div class="promo"><p><strong>Related:</strong> ${related.map(([s, l]) => `<a href="/blog/${s}">${esc(l)}</a>`).join(' &middot; ')}</p></div>
      </div>
${buildSidebarHtml(relatedSidebar, CFG.h1)}
    </div>
  </div>
  <script src="/assets/${CFG.slug}/script.js" defer></script>
</body>
</html>
`
}

function heroSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"><defs><linearGradient id="hg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0b0b14"/><stop offset="1" stop-color="${ACCENT_DARK}"/></linearGradient></defs><rect width="1200" height="630" fill="url(#hg)"/><g transform="translate(80,80)"><circle cx="22" cy="22" r="22" fill="${ACCENT}"/><text x="22" y="30" font-size="22" font-weight="800" fill="#fff" text-anchor="middle">A</text><text x="56" y="30" font-size="24" font-weight="700" fill="#fff">AlertMend</text><text x="228" y="30" font-size="18" fill="#8ba6cf">· Kubernetes reference</text></g><path d="${K8S_LOGO}" transform="translate(980,66) scale(6)" fill="${ACCENT}"/><text x="80" y="248" font-size="52" font-weight="800" fill="#fff" font-family="ui-monospace, SFMono-Regular, Menlo, monospace">kubectl get svc</text><text x="80" y="308" font-size="32" font-weight="700" fill="${ACCENT}">List, read, and troubleshoot Services.</text><g font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="19"><rect x="80" y="360" width="1040" height="150" rx="14" fill="#12131f" stroke="#243056"/><text x="108" y="398" fill="#8ab4f8">svc</text><text x="240" y="398" fill="#e7edfb">= short name for Service</text><text x="108" y="434" fill="#8ab4f8">-A</text><text x="240" y="434" fill="#e7edfb">list every namespace</text><text x="108" y="470" fill="#8ab4f8">describe</text><text x="240" y="470" fill="#e7edfb">the pods behind the Service</text></g><text x="80" y="560" font-size="19" fill="#8ba6cf">alertmend.io · the complete kubectl get svc reference</text></svg>\n`
}

const dir = path.join(root, 'public/blog', CFG.slug)
const assets = path.join(root, 'public/assets', CFG.slug)
fs.mkdirSync(dir, { recursive: true }); fs.mkdirSync(assets, { recursive: true })
fs.writeFileSync(path.join(dir, 'index.html'), render())
fs.writeFileSync(path.join(assets, 'script.js'), appendBlogSignupHandler(SCRIPT_JS))
fs.writeFileSync(path.join(assets, 'styles.css'), '/* base from make-error-127; accent + answer-card inlined in <style> */\n')
fs.writeFileSync(path.join(assets, 'hero.svg'), heroSvg())
fs.writeFileSync(path.join(root, 'public/blog', `${CFG.slug}.md`), `---
title: "${CFG.title}"
excerpt: "${CFG.excerpt}"
date: "${DATE}"
dateModified: "${MODIFIED}"
category: "${CFG.category}"
author: "${AUTHOR}"
keywords: "${CFG.keywords}"
---

This post is published as a rich interactive page at [/blog/${CFG.slug}](/blog/${CFG.slug}).
`)
const tl = CFG.title.length + 15
console.log(`✓ ${CFG.slug}  title+suffix ${tl}${tl < 30 || tl > 60 ? ' [LEN!]' : ''}  excerpt ${CFG.excerpt.length}  faqs ${CFG.faqs.length}`)
