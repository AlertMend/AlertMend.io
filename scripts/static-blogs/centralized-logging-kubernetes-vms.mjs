import {
  SITE_URL,
  esc,
  parseFrontmatter,
  getRelatedPosts,
  calendlyUrl,
  CHROME_INLINE_CSS,
  AUTHOR_CRED_CSS,
  DINESH_AUTHOR,
  BLOG_SIGNUP_HANDLER_JS,
  buildNavHtml,
  buildSidebarHtml,
  buildCredArticleHeader,
  dineshJsonLdAuthor,
  writeStaticBlogOutputs,
} from '../static-blog-shared.mjs'

const h1 = 'Centralized Logging for Kubernetes and VMs'
const pageSubtitle = 'Collect Kubernetes and VM logs, keep them in your own S3 or MinIO bucket, and search live or historical lines in seconds. No Elasticsearch cluster to manage.'

const capabilities = [
  {
    title: '1-click log collection',
    body: 'Kubernetes DaemonSet for pods and lightweight agents for VMs. No SDKs, sidecars, or app code changes.',
    icon: 'doc',
  },
  {
    title: 'Kubernetes-aware enrichment',
    body: 'Every line carries namespace, pod, container, node, image, label, and host context for precise filtering.',
    icon: 'filter',
  },
  {
    title: 'Bring your own bucket',
    body: 'Store compressed Parquet logs in your own S3 or MinIO bucket. Your logs stay inside your cloud.',
    icon: 'db',
  },
  {
    title: 'Fast full-text search',
    body: 'Search live and historical logs by namespace, pod, host, label, error text, or time range.',
    icon: 'search',
  },
  {
    title: 'Self-hosted or VPC-native',
    body: 'Run AlertMend on-prem or inside your own VPC. Keep the control plane close to production.',
    icon: 'shield',
  },
  {
    title: 'Crash-safe pipeline',
    body: 'Write-ahead logging and checkpoints protect delivery during pod restarts, node churn, and deploys.',
    icon: 'chip',
  },
]

const flow = [
  {
    step: '01',
    title: 'Collect',
    body: 'Kubernetes pods and VM logs, no code changes.',
    tech: 'DaemonSet · VM agent',
  },
  {
    step: '02',
    title: 'Enrich',
    body: 'Add namespace, pod, node, image, labels, and host context.',
    tech: 'Kubernetes-aware metadata',
  },
  {
    step: '03',
    title: 'Store',
    body: 'Write compressed Parquet logs to your S3 or MinIO bucket.',
    tech: 'Parquet + Zstd',
  },
  {
    step: '04',
    title: 'Search',
    body: 'Search live and historical logs from one place.',
    tech: 'Full-text search',
  },
]

const comparisons = [
  ['Traditional SaaS log tools', 'Fast to start, but teams can feel pressure from ingestion volume, retention decisions, and paying to keep noisy logs searchable.', 'AlertMend stores logs in your bucket and uses compressed Parquet, so retention and cost are easier to reason about.'],
  ['Elastic or OpenSearch stacks', 'Powerful and flexible, but you own index tuning, shard sizing, upgrades, storage growth, and cluster reliability.', 'AlertMend gives you central collection and search without running a separate Elasticsearch cluster.'],
  ['Loki-style DIY logging', 'Great for some teams, but still needs careful label design, storage planning, query tuning, and alert workflow glue.', 'AlertMend combines logs with context, incident routing, RCA, and safe runbooks in one operating path.'],
  ['Cloud provider logs', 'Useful inside one cloud, but cross-cloud, Kubernetes, VM, and self-hosted setups can become fragmented.', 'AlertMend is built for mixed Kubernetes, VM, on-prem, and VPC environments.'],
]

const faq = [
  {
    q: 'Can AlertMend replace my logging tool?',
    a: 'Yes for teams that need centralized logs, fast search, Kubernetes and VM collection, and simple retention in their own bucket. Many teams can use AlertMend as the primary logging tool. Larger teams can also run it beside an existing logging platform while they migrate noisy or high-volume logs.',
  },
  {
    q: 'Is AlertMend an Elasticsearch alternative for logs?',
    a: 'AlertMend is a practical alternative when the goal is centralized log collection and search without operating an Elasticsearch or OpenSearch cluster. It stores logs as compressed Parquet in your S3 or MinIO bucket and provides built-in search for live and historical logs.',
  },
  {
    q: 'Does AlertMend collect Kubernetes logs?',
    a: 'Yes. AlertMend can collect logs from every Kubernetes pod through a per-node DaemonSet and enrich each line with namespace, pod, container, node, image, and label context.',
  },
  {
    q: 'Does AlertMend collect VM and container logs?',
    a: 'Yes. AlertMend supports lightweight agents for VM workloads and containers, so Kubernetes and VM logs can be searched from the same place.',
  },
  {
    q: 'Where are my logs stored?',
    a: 'Logs can live in your own S3 or MinIO bucket as compressed Parquet. That gives your team direct control over retention, security boundaries, and storage cost.',
  },
  {
    q: 'Is AlertMend self-hosted?',
    a: 'Yes. AlertMend supports managed and self-hosted deployments, including on-prem and VPC-native setups for teams that need stronger data control.',
  },
  {
    q: 'Why can AlertMend be more cost efficient than many logging tools?',
    a: 'The cost advantage comes from the architecture: collect once, compress with Parquet and Zstd, store in your own object storage, and avoid maintaining an always-on search cluster for every log line.',
  },
  {
    q: 'Can AlertMend work with Datadog, Grafana, Prometheus, or CloudWatch?',
    a: 'Yes. AlertMend can sit beside existing monitoring tools. You can keep dashboards and alerts where they are, then use AlertMend for log search, correlation, incident routing, RCA, and approved recovery actions.',
  },
  {
    q: 'Can AlertMend trigger auto-recovery from logs?',
    a: 'Yes. Logs can be correlated with metrics, Kubernetes events, VM signals, and alerts. When the pattern is known and safe, AlertMend can trigger approved runbooks and show the recovery path to your team.',
  },
]

function icon(name) {
  const icons = {
    doc: '<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5"/><path d="M10 13h6M10 17h6"/>',
    filter: '<path d="M4 5h16l-6 7v6l-4 2v-8z"/>',
    db: '<ellipse cx="12" cy="5" rx="7" ry="3"/><path d="M5 5v10c0 1.7 3.1 3 7 3s7-1.3 7-3V5"/><path d="M5 10c0 1.7 3.1 3 7 3s7-1.3 7-3"/>',
    search: '<circle cx="11" cy="11" r="6"/><path d="M16 16l4 4"/>',
    shield: '<path d="M12 3l7 3v5c0 4.2-2.8 7.8-7 10-4.2-2.2-7-5.8-7-10V6z"/>',
    chip: '<rect x="7" y="7" width="10" height="10" rx="2"/><path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3"/>',
  }
  return `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.doc}</svg>`
}

function capabilityHtml() {
  return capabilities.map((item) => `
    <article class="capabilityCard">
      <div class="capabilityIcon">${icon(item.icon)}</div>
      <h3>${esc(item.title)}</h3>
      <p>${esc(item.body)}</p>
    </article>`).join('\n')
}

function flowHtml() {
  return flow.map((item) => `
    <article class="flowCard">
      <div class="flowStep">${esc(item.step)}</div>
      <div class="flowBody">
        <h3>${esc(item.title)}</h3>
        <p>${esc(item.body)}</p>
        <div class="flowTech">${esc(item.tech)}</div>
      </div>
    </article>`).join('\n')
}

function comparisonHtml() {
  return comparisons.map(([option, reality, alertmend]) => `
    <tr>
      <td><strong>${esc(option)}</strong></td>
      <td>${esc(reality)}</td>
      <td>${esc(alertmend)}</td>
    </tr>`).join('\n')
}

function faqHtml() {
  return faq.map((item, index) => `
    <div class="faqItem">
      <button class="faqQuestion" type="button" aria-expanded="${index === 0 ? 'true' : 'false'}">${esc(item.q)}</button>
      <div class="faqAnswer" ${index === 0 ? '' : 'hidden'}>${esc(item.a)}</div>
    </div>`).join('\n')
}

function authorCard() {
  return `
    <section class="authorCard" aria-label="About the author">
      <img src="/logos/dinesh.jpeg" alt="Dinesh Agrawal" width="112" height="112" loading="lazy">
      <div>
        <h2>Dinesh Agrawal</h2>
        <p>Software engineer, entrepreneur, and AI incident automation builder. Dinesh has spent 12+ years around cloud infrastructure, reliability workflows, and production automation, including work at Polymer Search and Roambee, and as Co-Founder of FutureApp e-schools.</p>
      </div>
    </section>`
}

function articleContent({ slug, calendly }) {
  return `
    <article class="loggingArticle article-content">
      ${buildCredArticleHeader(h1, '2026-07-16', 'Logging', DINESH_AUTHOR, '2026-07-16 · Logging')}

      <section class="introSummary">
        <div class="introSummaryMain">
          <p class="introKicker">Quick take</p>
          <h2>A logging tool you do not have to babysit</h2>
          <p>${esc(pageSubtitle)}</p>
        </div>
        <div class="introSummarySide" aria-label="AlertMend logging highlights">
          <div><span>Setup</span><strong>1-click agents</strong></div>
          <div><span>Storage</span><strong>Your S3 or MinIO</strong></div>
          <div><span>Ops</span><strong>No Elasticsearch cluster</strong></div>
          <a href="${calendly}&intent=logging-tool-review" target="_blank" rel="noopener noreferrer">Book review</a>
        </div>
      </section>

      <section class="sectionBlock">
        <p class="sectionEyebrow">The 10-second answer</p>
        <div class="answerCard">
          <p><strong>The best logging tool is not the one with the most knobs. It is the one your team can install quickly, trust during incidents, and afford to keep running.</strong></p>
          <p>AlertMend is built for that path: 1-click agents, Kubernetes and VM collection, logs stored in your own S3 or MinIO bucket, full-text search, and a direct path from log evidence to incident response and safe automation.</p>
        </div>
      </section>

      <section class="sectionBlock" id="how-it-works">
        <p class="sectionEyebrow">From container to searchable in one hop</p>
        <h2 class="sectionTitle">How AlertMend works as your logging tool</h2>
        <p class="sectionIntro">Most logging stacks turn into a second production system. You install agents, tune indexes, watch storage, babysit clusters, and still copy log lines into incident channels. AlertMend keeps the useful parts and removes the management drag.</p>
        <div class="flowPanel">
          <div class="flowHeader">
            <p class="flowLabel">Log pipeline</p>
            <h3>From noisy containers to searchable evidence</h3>
          </div>
          <div class="flowGrid">${flowHtml()}</div>
          <div class="flowFooter">
            <span>Result</span>
            <strong>Every useful log line keeps context, lands in your bucket, and stays searchable when production is on fire.</strong>
          </div>
        </div>
      </section>

      <section class="sectionBlock" id="capabilities">
        <p class="sectionEyebrow">Capabilities</p>
        <h2 class="sectionTitle">Everything you expect from a modern logging tool</h2>
        <p class="sectionIntro">This is the practical checklist: collect from Kubernetes and VMs, keep context on every line, search fast, store cheaply, and avoid operating a separate logging cluster.</p>
        <div class="capabilityGrid">${capabilityHtml()}</div>
      </section>

      <section class="sectionBlock" id="search">
        <p class="sectionEyebrow">Search</p>
        <h2 class="sectionTitle">Find the log line you need in seconds</h2>
        <p class="sectionIntro">During an incident, nobody wants to remember a query language, jump across tools, or wait for cold storage. AlertMend keeps live tail and historical search on the same path.</p>
        <div class="searchMock" aria-label="AlertMend log search preview">
          <div class="searchBar">
            <span>🔎 <span class="queryText" data-query-text>level:error namespace:payments</span></span>
            <span class="queryStat">1.24M lines · 38ms</span>
          </div>
          <div class="searchBody">
            <aside class="facetCol">
              <p class="facetTitle">Sources</p>
              <div class="facetItem"><span>Kubernetes</span><strong>1.2M</strong></div>
              <div class="facetItem"><span>VMs</span><strong>480K</strong></div>
              <p class="facetTitle">Level</p>
              <div class="facetItem"><span>error</span><strong>3.4K</strong></div>
              <div class="facetItem"><span>warn</span><strong>18K</strong></div>
              <p class="facetTitle">Namespace</p>
              <div class="facetItem"><span>payments</span><strong>210K</strong></div>
            </aside>
            <div class="logLines">
              <div class="logLine"><span>12:04:33.212</span><span class="badge badgeError">ERROR</span><span class="serviceName">payments-api</span><span>OOMKilled: container exceeded memory limit 512Mi</span></div>
              <div class="logLine"><span>12:04:33.001</span><span class="badge badgeWarn">WARN</span><span class="serviceName">checkout-web</span><span>upstream timeout after 30s calling payments-api</span></div>
              <div class="logLine"><span>12:04:32.884</span><span class="badge badgeError">ERROR</span><span class="serviceName">payments-api</span><span data-result-text>connection reset by peer 10.2.3.4:5432</span></div>
              <div class="logLine"><span>12:04:32.140</span><span class="badge badgeInfo">INFO</span><span class="serviceName">auth-svc</span><span>token refreshed for tenant acme ttl 3600s</span></div>
              <div class="logLine"><span>12:04:31.702</span><span class="badge badgeWarn">WARN</span><span class="serviceName">prod-vm-3</span><span>disk usage on /var at 82%</span></div>
            </div>
          </div>
        </div>
        <div class="queryButtons" aria-label="Example log searches">
          <button class="queryButton isActive" type="button" data-query="level:error namespace:payments" data-result="connection reset by peer 10.2.3.4:5432">payment errors</button>
          <button class="queryButton" type="button" data-query="host:prod-vm-3 disk" data-result="disk usage on /var at 82%">VM disk logs</button>
          <button class="queryButton" type="button" data-query="pod:checkout-* timeout" data-result="upstream timeout after 30s calling payments-api">checkout timeout</button>
        </div>
      </section>

      <section class="sectionBlock" id="cost">
        <div class="costPanel">
          <div>
            <p class="sectionEyebrow">Cost model</p>
            <h2>Keep the logs you need without turning storage into the product.</h2>
            <p>Your logs live in your own bucket as compressed Parquet. That means the expensive part of logging is simpler to reason about: storage is yours, retention is yours, and search does not require a separate cluster to babysit.</p>
          </div>
          <div class="costRows" aria-label="AlertMend logging cost advantages">
            <div class="costRow">
              <span>01</span>
              <div><strong>Use your own object storage</strong><p>S3 or MinIO becomes the long-term log store, not a black-box ingest meter.</p></div>
            </div>
            <div class="costRow">
              <span>02</span>
              <div><strong>Compress before you keep history</strong><p>Parquet plus Zstd packs more searchable history into each gigabyte.</p></div>
            </div>
            <div class="costRow">
              <span>03</span>
              <div><strong>Skip the search-cluster tax</strong><p>No Elasticsearch or OpenSearch cluster to size, shard, upgrade, and rescue.</p></div>
            </div>
          </div>
        </div>
      </section>

      <section class="sectionBlock" id="comparison">
        <p class="sectionEyebrow">Fair comparison</p>
        <h2 class="sectionTitle">Where AlertMend is the smarter logging choice</h2>
        <p class="sectionIntro">If your team already has a massive observability platform and loves it, keep it. AlertMend is strongest when you want practical centralized logs without the heavy management burden, and when logs should lead to a fix instead of another dashboard.</p>
        <div class="compareTableWrap">
          <table class="compareTable">
            <thead><tr><th>Option</th><th>Common tradeoff</th><th>Why AlertMend</th></tr></thead>
            <tbody>${comparisonHtml()}</tbody>
          </table>
        </div>
      </section>

      <section class="sectionBlock" id="automation">
        <p class="sectionEyebrow">Logs should lead to action</p>
        <h2 class="sectionTitle">From log line to root cause to recovery</h2>
        <p class="sectionIntro">A logging tool helps you find evidence. AlertMend goes further: it correlates logs with metrics, Kubernetes events, VM signals, deployment context, and alerts. When the failure pattern is known, it can route the incident, explain the likely root cause, and trigger an approved recovery runbook.</p>
        <div class="answerCard">
          <p>That is the sales story in plain English: AlertMend is not only where logs are stored. It is where production incidents become understandable and fixable.</p>
        </div>
      </section>

      <section class="sectionBlock" id="faq">
        <p class="sectionEyebrow">FAQ</p>
        <h2 class="sectionTitle">Logging tool questions teams ask before switching</h2>
        <div class="faqList">${faqHtml()}</div>
      </section>

      ${authorCard()}

      <section class="ctaBox">
        <h2>Want to see AlertMend with your own logs?</h2>
        <p>Bring one Kubernetes namespace, one VM service, or one noisy log source. We will show how the collection, storage, search, incident context, and automation path would look in your environment.</p>
        <div class="ctaButtons">
          <a class="ctaButton ctaButtonPrimary" href="${calendly}&intent=logging-architecture-review" target="_blank" rel="noopener noreferrer">Book a logging architecture review</a>
        </div>
      </section>
    </article>`
}

export async function build(slug) {
  const assetsBase = `/assets/${slug}`
  const canonical = `${SITE_URL}/blog/${slug}`
  const meta = parseFrontmatter(slug)
  const title = meta.title || 'Centralized Logging for Kubernetes and VMs'
  const description = meta.excerpt || 'Use AlertMend as a logging tool for Kubernetes and VMs with 1-click agents, instant search, your own bucket, and no Elasticsearch to manage.'
  const date = meta.date || '2026-07-16'
  const category = meta.category || 'Logging'
  const keywords = meta.keywords || 'AlertMend logging tool, centralized logging, Kubernetes logging tool'
  const related = getRelatedPosts(slug, category)
  const calendly = calendlyUrl(slug)
  const heroImage = `${SITE_URL}${assetsBase}/hero.svg`

  const blogPosting = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: h1,
    description,
    image: heroImage,
    datePublished: date,
    dateModified: date,
    author: dineshJsonLdAuthor(),
    publisher: {
      '@type': 'Organization',
      name: 'AlertMend AI',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logos/alertmend-logo.svg` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
  }

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }

  const howToJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Use AlertMend as a centralized logging tool',
    description,
    step: flow.map((item, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: item.title,
      text: item.body,
    })),
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)} | AlertMend AI</title>
  <meta name="description" content="${esc(description)}">
  <meta name="keywords" content="${esc(keywords)}">
  <meta name="author" content="${esc(DINESH_AUTHOR.name)}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <link rel="canonical" href="${canonical}">
  <link rel="icon" type="image/svg+xml" href="/logos/alertmend-logo.svg">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${canonical}">
  <meta property="og:title" content="${esc(h1)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:image" content="${heroImage}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(h1)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${heroImage}">
  <script type="application/ld+json">${JSON.stringify(blogPosting)}</script>
  <script type="application/ld+json">${JSON.stringify(howToJsonLd)}</script>
  <script type="application/ld+json">${JSON.stringify(faqJsonLd)}</script>
  <style>${CHROME_INLINE_CSS}${AUTHOR_CRED_CSS}</style>
  <link rel="stylesheet" href="${assetsBase}/styles.css">
</head>
<body>
${buildNavHtml(slug, calendly)}
  <main class="main-container">
    <div class="content-wrapper">
      <div class="main-col">
        ${articleContent({ slug, calendly })}
      </div>
      ${buildSidebarHtml(related, title)}
    </div>
  </main>
  <script src="${assetsBase}/script.js"></script>
  <script>
  (function(){
${BLOG_SIGNUP_HANDLER_JS}
  })();
  </script>
</body>
</html>`

  writeStaticBlogOutputs(slug, html)
}
