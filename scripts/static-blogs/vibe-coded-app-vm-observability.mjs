/**
 * Code-generated rich blog: VM observability for vibe-coded apps.
 */
import {
  SITE_URL,
  esc,
  parseFrontmatter,
  getRelatedPosts,
  calendlyUrl,
  CHROME_INLINE_CSS,
  buildNavHtml,
  buildSidebarHtml,
  buildArticleHeader,
  writeStaticBlogOutputs,
} from '../static-blog-shared.mjs'

export async function build(slug) {
  const assetsBase = `/assets/${slug}`
  const canonical = `${SITE_URL}/blog/${slug}`
  const heroImage = `${assetsBase}/vm-observability-hero.svg`

  const meta = parseFrontmatter(slug)
  const title = meta.title || 'Vibe-Coded App in Production: What About Observability?'
  const excerpt = meta.excerpt || ''
  const date = meta.date || '2026-06-20'
  const category = meta.category || 'DevOps'
  const author = meta.author || 'AlertMend Team'
  const keywords =
    meta.keywords ||
    'vibe coding deploy, monitor app in production, server observability, VPS monitoring, basic server monitoring, AI coded app production'

  const relatedPosts = getRelatedPosts(slug, category)
  const postCalendlyUrl = calendlyUrl(slug)

  const FEAR_SCENARIOS = [
    [
      'Tonight, 3am',
      'Your app died hours ago. You do not know yet.',
      'The server still accepts SSH. The cloud console looks green. Nobody was paged. You find out from a user DM at breakfast.',
    ],
    [
      'Right before a demo',
      'The site shows 502. You cannot see why.',
      'nginx is running. Your app process is not. You tested localhost yesterday and assumed production was the same.',
    ],
    [
      'Week two on a $12 server',
      'Disk fills. The app starts failing writes.',
      'Logs and Docker layers grow quietly. No alert fired because nobody watched disk. A restart does not fix a full disk.',
    ],
    [
      'The silent hang',
      'The process exists. Requests stop working.',
      'PID is there. CPU looks idle. Users time out and leave. You only notice when signup emails stop.',
    ],
  ]

  const MINIMUM_STACK = [
    ['Is it up?', 'HTTP check on / or /health every 1 to 5 minutes', 'UptimeRobot, Better Stack, or AlertMend URL check'],
    ['Is the server healthy?', 'CPU, memory, and disk on the host, not just SSH', 'df -h, free -h, or a lightweight agent'],
    ['What broke?', 'App logs you can read without guessing', 'journalctl, docker logs, or pm2 logs'],
    ['Who gets pinged?', 'Slack or email when checks fail twice', 'Avoid finding out from users first'],
  ]

  const SKIPPED = [
    [
      'Process dies overnight',
      'The app exits after a deploy or memory spike. The server still accepts SSH.',
      'Add a restart policy (systemd, Docker, PM2) plus an external uptime check.',
    ],
    [
      'Disk fills silently',
      'Logs and Docker layers grow until writes fail and the app crashes.',
      'Alert when disk use crosses 85%. Rotate logs with logrotate.',
    ],
    [
      'Memory leak',
      'The app slows down over days. You only notice when users complain.',
      'Watch process memory with pm2 monit or host-level metrics.',
    ],
    [
      'Bad deploy',
      'You pushed a broken build. No rollback signal, no alert.',
      'Health check after deploy; keep the last working release one command away.',
    ],
  ]

  const ALERT_FIRST = [
    ['Site down', 'HTTP check fails twice in a row', 'Page on-call or yourself in Slack'],
    ['Disk above 85%', 'df on the server crosses threshold', 'Clean logs/images before the disk is full'],
    ['Process not running', 'systemctl inactive or container exited', 'Auto-restart plus alert if it keeps failing'],
    ['High memory', 'App or server memory sustained above 90%', 'Restart or resize before OOM kills the process'],
  ]

  const SETUP_STEPS = [
    ['Add a health endpoint', 'Return 200 from GET /health with a cheap DB or cache ping if you have one.'],
    ['Pick one log command', 'journalctl -u app, docker logs -f, or pm2 logs, and save it in your runbook.'],
    ['Schedule two checks', 'External uptime ping plus a weekly df -h / free -h reminder on the server.'],
    ['Wire one alert channel', 'Slack webhook or email when the uptime check fails. That is enough for day one.'],
  ]

  const FAQ = [
    [
      'Do I need Kubernetes for observability?',
      'No. A single server with an HTTP uptime check, log access, disk monitoring, and one alert channel covers most indie and MVP apps.',
    ],
    [
      'What is the minimum observability for a production app?',
      'Four things: uptime check, host disk/memory awareness, readable logs, and alerts to Slack or email when something fails.',
    ],
    [
      'I deployed with Cursor / Bolt / Replit. What did I skip?',
      'AI coding tools generate the app and deploy steps. They rarely add health endpoints, log rotation, disk alerts, or on-call routing.',
    ],
    [
      'Does it matter how my app is deployed?',
      'Yes for which commands you run. In practice there are only three patterns on a server: systemd, Docker, or PM2. The four observability questions stay the same for all of them.',
    ],
    [
      'Is SSH enough to know my app is healthy?',
      'No. SSH only proves the server is on. Your app process can be dead, stuck, or returning 502 while SSH works fine.',
    ],
    [
      'When should I use AlertMend instead of DIY scripts?',
      'When you are tired of SSH at 2am, want Slack incidents with context, or need auto-restart on servers without running Kubernetes.',
    ],
  ]

  const renderFearScenarios = FEAR_SCENARIOS.map(
    ([when, title, body]) =>
      `<div class="fearScenario"><p class="fearScenarioWhen">${esc(when)}</p><h3 class="fearScenarioTitle">${esc(title)}</h3><p class="fearScenarioBody">${esc(body)}</p></div>`
  ).join('\n        ')

  const MODES = [
    ['systemd', 'systemd', 'Linux service unit'],
    ['docker', 'Docker', 'Container on a server'],
    ['pm2', 'PM2 / Node', 'Process manager'],
  ]

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
    name: 'Add minimum observability to a production-deployed app',
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
        <p class="heroGuideLabel">Read this before you close the terminal</p>
        <h2 class="fearHeadline">You deployed your app. You did not deploy observability.</h2>
        <p class="fearLead">Cursor, Bolt, Replit, and Lovable optimize for <strong>shipping</strong>. They do not leave you with uptime checks, log access, disk alerts, or anyone to page when production breaks. The server looks fine. Your users may not.</p>
        <div class="fearScenarioGrid">
        ${renderFearScenarios}
        </div>
        <p class="fearBridge"><strong>Deploy is not the finish line.</strong> Without observability, your first production incident is not a question of if. It is a question of whether you find out before or after your users do.</p>
      </section>

      <section class="heroBand heroBandCompact">
        <p class="heroGuideLabel">The fix (minimum viable observability)</p>
        <p class="seoTldr"><strong>Good news:</strong> You do not need Kubernetes or a metrics stack on day one. You need four things: an <strong>uptime check</strong>, <strong>disk and memory</strong> awareness, <strong>logs</strong> you can read in one command, and <strong>one alert channel</strong> when something fails twice.</p>
      </section>

      <h2 class="sectionHead">The lie you are living with right now</h2>
      <p class="bodyText">Most vibe-coded deploys end with: URL loads in browser, screenshot for Twitter, close laptop. That proves the app worked <strong>once</strong>, at <strong>one moment</strong>, from <strong>your machine</strong>.</p>
      <p class="bodyText">It does not prove the process will stay up, that disk will not fill, that nginx can reach the app tomorrow, or that anyone will tell you when signup stops working. <strong>Refreshing the URL is not observability.</strong></p>

      <h2 class="sectionHead">Minimum observability stack (no Kubernetes required)</h2>
      <div class="diyWrap">
        <table class="compareTable">
          <thead><tr><th>Question</th><th>What to do</th><th>Example</th></tr></thead>
          <tbody>
            ${MINIMUM_STACK.map(([q, d, e]) => `<tr><td>${esc(q)}</td><td>${esc(d)}</td><td class="diyHighlight">${esc(e)}</td></tr>`).join('\n            ')}
          </tbody>
        </table>
      </div>

      <h2 class="sectionHead">What vibe coding usually skips</h2>
      <div class="searchIssueGrid">
        ${SKIPPED.map(([term, desc, fix]) => `<div class="searchIssueCard"><h3 class="searchIssueTerm">${esc(term)}</h3><p class="searchIssueDesc">${esc(desc)}</p><p class="searchIssueAlert"><strong>Fix:</strong> ${esc(fix)}</p></div>`).join('\n        ')}
      </div>

      <h2 class="sectionHead">There are only a few ways you actually get deployed</h2>
      <p class="bodyText">We have wired observability on production apps from solo founders to teams running AI services on cloud servers. Every vibe-coded stack <em>looks</em> different in the repo. Once you are on a real server, <strong>you almost always land in one of three deployment patterns</strong>. The AI tool that generated your code does not change that.</p>
      <div class="diyWrap">
        <table class="compareTable">
          <thead><tr><th>How you are deployed</th><th>Typical vibe-coded stack</th><th>What to check first</th></tr></thead>
          <tbody>
            <tr><td><strong>systemd service</strong></td><td>Python FastAPI, Node API, Go binary on Ubuntu</td><td class="diyHighlight">systemctl status · journalctl -u</td></tr>
            <tr><td><strong>Docker / Compose</strong></td><td>AI-generated Dockerfile on a DigitalOcean or AWS server</td><td class="diyHighlight">docker ps · docker logs · healthcheck</td></tr>
            <tr><td><strong>PM2 process</strong></td><td>Node / Next.js API running directly on the host</td><td class="diyHighlight">pm2 list · pm2 logs · pm2 monit</td></tr>
          </tbody>
        </table>
      </div>
      <p class="bodyText">nginx or Caddy in front of the app is common across all three. That is why you can see <strong>502 Bad Gateway</strong> while SSH still works: the proxy is up, your app process is not. Pick your pattern below. The observability basics stay the same.</p>

      <h2 class="sectionHead">Day 1 setup: pick your deployment pattern</h2>
      <p class="bodyText">Choose the one that matches how your app actually runs in production.</p>
      <div class="modeGrid" role="tablist" aria-label="Deployment type">
        ${MODES.map(([id, t, sub], i) => `<button type="button" role="tab" data-mode-id="${id}" class="modeCard${i === 0 ? ' modeCardActive' : ''}" aria-selected="${i === 0 ? 'true' : 'false'}"><span class="modeCardTitle">${esc(t)}</span><span class="modeCardSub">${esc(sub)}</span></button>`).join('\n        ')}
      </div>
      <div class="modePlaybook" role="tabpanel">
        <div class="modePlaybookHead">
          <h3 class="modePlaybookTitle" id="mode-playbook-title">Day 1: systemd service</h3>
        </div>
        <p class="modePlaybookSummary" id="mode-playbook-summary"></p>
        <ul class="checkList" id="mode-playbook-steps"></ul>
        <div class="stepTip"><span id="mode-playbook-tip"></span></div>
      </div>

      <h2 class="sectionHead">Four steps to add observability today</h2>
      <div class="amFlow">
        ${SETUP_STEPS.map(([t, b], i) => `<div class="amStep"><div class="amStepHead"><span class="amStepNum">${i + 1}</span></div><h3 class="amStepTitle">${esc(t)}</h3><p class="amStepBody">${esc(b)}</p></div>`).join('\n        ')}
      </div>

      <h2 class="sectionHead">What to alert on first</h2>
      <div class="diyWrap">
        <table class="compareTable">
          <thead><tr><th>Signal</th><th>When</th><th>Action</th></tr></thead>
          <tbody>
            ${ALERT_FIRST.map(([s, w, a]) => `<tr><td>${esc(s)}</td><td>${esc(w)}</td><td class="diyHighlight">${esc(a)}</td></tr>`).join('\n            ')}
          </tbody>
        </table>
      </div>

      <h2 class="sectionHead">Example health check (copy-paste)</h2>
      <pre class="codeBlock"><code># Express.js: add before app.listen()
app.get('/health', (req, res) => res.status(200).json({ ok: true }));

# Then verify from your laptop or an uptime monitor
curl -sf https://your-domain.com/health</code></pre>

      <h2 class="sectionHead">When DIY monitoring stops scaling</h2>
      <p class="bodyText">Cron scripts and free uptime pings work until they do not: multiple servers, silent process hangs, or 2am SSH sessions to restart services. One AI startup on cloud servers saw core services freeze while the console stayed green. After wiring alerts and auto-restart, <strong>90%+ of recurring failures remediated themselves</strong>. <a href="/case-studies">Read the case study</a>.</p>

      <h2 class="sectionHead">FAQ</h2>
      <div class="faqList">
        ${FAQ.map(([q, a], i) => `<div class="faqItem"><button type="button" class="faqQuestion" data-faq-toggle aria-expanded="${i === 0 ? 'true' : 'false'}">${esc(q)}<svg class="faqChevron${i === 0 ? ' faqChevronOpen' : ''}" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 9l6 6 6-6"/></svg></button><div class="faqAnswer${i === 0 ? '' : ' hidden'}">${esc(a)}</div></div>`).join('\n        ')}
      </div>

      <div class="ctaBand">
        <div class="ctaBandTitle">Do not wait for the 3am DM</div>
        <p class="ctaBandSub">Talk to an AlertMend engineer about uptime checks, Slack alerts, and auto-restart for vibe-coded apps in production. No Kubernetes required.</p>
        <div class="ctaBtnRow">
          <a href="${postCalendlyUrl}" class="ctaBtn" target="_blank" rel="noopener noreferrer">Talk to an expert →</a>
        </div>
      </div>
    </div>

    <div class="promo">
      <p><strong>Related:</strong> <a href="/blog/docker-container-monitoring-best-practices">Docker Container Monitoring</a> · <a href="/blog/make-error-127">make error 127 Complete Guide</a> · <a href="/case-studies">Server auto-remediation case study</a></p>
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
