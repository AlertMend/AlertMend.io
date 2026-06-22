/**
 * Code-generated rich blog: OpenClaw + AlertMend safe infra control via Slack/Telegram.
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
  writeStaticBlogOutputs,
} from '../static-blog-shared.mjs'

export async function build(slug) {
  const assetsBase = `/assets/${slug}`
  const canonical = `${SITE_URL}/blog/${slug}`
  const heroImagePng = `${assetsBase}/openclaw-hero.png`
  const heroImageUrl = `${SITE_URL}${heroImagePng}`

  const meta = parseFrontmatter(slug)
  const title = meta.title || 'OpenClaw: Cloud Infra from Slack & Telegram'
  const excerpt = meta.excerpt || ''
  const date = meta.date || '2026-06-21'
  const category = meta.category || 'DevOps'
  const author = meta.author || 'AlertMend Team'
  const keywords =
    meta.keywords ||
    'OpenClaw Slack, OpenClaw Telegram, OpenClaw cloud infrastructure, self-hosted AI agent gateway, monitor OpenClaw production'

  const relatedPosts = getRelatedPosts(slug, category)
  const postCalendlyUrl = calendlyUrl(slug)

  const FUN_MOMENTS = [
    ['From the couch', 'Check prod between episodes. Phone in hand. Laptop closed. Still know what is running.'],
    ['Walk and triage', 'Slack thread on your morning walk. AlertMend already has context. OpenClaw explains it in plain English.'],
    ['One thread for everything', 'Page, question, fix, confirmation in the same Telegram chat. No context switching.'],
    ['Fix without a terminal', 'Approved restart from chat. Logged in AlertMend. You never typed ssh.'],
  ]

  const CHAT_CAPABILITIES = [
    {
      id: 'health',
      label: 'Fleet health',
      prompt: 'hey, is prod healthy?',
      app: 'Slack',
      backstage: ['You message OpenClaw', 'AlertMend checks 4 services', 'Metrics + incidents pulled', 'Plain-English reply in chat'],
      messages: [
        { role: 'user', text: 'hey, is prod healthy?' },
        { role: 'bot', text: 'All 4 services green. Disk at 62%. No open incidents.' },
        { role: 'user', text: 'anything weird on api-01?' },
        { role: 'bot', text: 'Memory up 12% since yesterday, still within limits. Want me to flag it?' },
      ],
    },
    {
      id: 'disk',
      label: 'Disk & memory',
      prompt: 'which hosts are running hot?',
      app: 'Telegram',
      backstage: ['Question from your phone', 'AlertMend host agents respond', 'Compare CPU, RAM, disk', 'Ranked summary in Telegram'],
      messages: [
        { role: 'user', text: 'which hosts are running hot?' },
        { role: 'bot', text: 'worker-02: disk 89% (watch). api-01: memory 78%. Everything else normal.' },
        { role: 'user', text: 'should I worry about worker-02?' },
        { role: 'bot', text: 'Log rotation runbook ran at 2am last week. Trend is flat. I will alert if it crosses 92%.' },
      ],
    },
    {
      id: 'k8s',
      label: 'Kubernetes pods',
      prompt: 'any crashing pods in prod?',
      app: 'Slack',
      backstage: ['Slack message received', 'AlertMend queries cluster', 'Pod events + restarts scanned', 'Summary in chat, no shell on gateway'],
      messages: [
        { role: 'user', text: 'any crashing pods in prod?' },
        { role: 'bot', text: '2 restarts on payment-worker in the last hour. Main API stable. Ingress healthy.' },
        { role: 'user', text: 'show me the last error' },
        { role: 'bot', text: 'OOMKilled at 14:02, memory limit 512Mi. AlertMend already flagged it. Bump limit or scale?' },
      ],
    },
    {
      id: 'incident',
      label: 'What broke?',
      prompt: 'what happened last night?',
      app: 'Telegram',
      backstage: ['You ask from bed', 'AlertMend incident timeline', 'Auto-remediation log included', 'You did not need to wake up'],
      messages: [
        { role: 'user', text: 'what happened last night?' },
        { role: 'bot', text: 'One incident: disk pressure on worker-02 at 2:14am. Logs auto-rotated. Resolved in 4 min.' },
        { role: 'user', text: 'did I need to wake up?' },
        { role: 'bot', text: 'Nope. Runbook handled it. You slept. Prod did not.' },
      ],
    },
    {
      id: 'restart',
      label: 'Restart service',
      prompt: 'restart staging-api, memory looks high',
      app: 'Slack',
      backstage: ['Restart requested in chat', 'AlertMend validates allowlist', 'Approved runbook executes', 'Logged with your name'],
      messages: [
        { role: 'user', text: 'restart staging-api, memory looks high' },
        { role: 'bot', text: 'Runbook approved', action: 'Restart staging-api' },
        { role: 'bot', text: 'Done. Back in 18s. Logged in AlertMend. Watching for 5 min.' },
        { role: 'user', text: 'perfect, thanks' },
      ],
    },
    {
      id: 'logs',
      label: 'Error summary',
      prompt: 'summarize errors in the last hour',
      app: 'Telegram',
      backstage: ['Natural-language ask', 'AlertMend log aggregation', 'Top errors clustered', 'Readable digest in chat'],
      messages: [
        { role: 'user', text: 'summarize errors in the last hour' },
        { role: 'bot', text: '12 errors total. Top: connection timeout to Redis (8×), usually on checkout. One 503 spike at 13:40, already cleared.' },
        { role: 'user', text: 'is redis down?' },
        { role: 'bot', text: 'Nah, latency spike only. Redis healthy now. Want me to open an incident if it happens again?' },
      ],
    },
  ]

  const renderCapabilityNav = CHAT_CAPABILITIES.map(
    (cap, i) =>
      `<button type="button" class="capabilityPill${i === 0 ? ' capabilityPillActive' : ''}" data-cap-id="${esc(cap.id)}" role="tab" aria-selected="${i === 0 ? 'true' : 'false'}"><span class="capabilityPillLabel">${esc(cap.label)}</span><span class="capabilityPillHint">${esc(cap.prompt)}</span><span class="capabilityPillProgress" aria-hidden="true"></span></button>`
  ).join('\n          ')

  const renderFunMoments = FUN_MOMENTS.map(
    ([title, desc]) =>
      `<div class="signalCard"><h3 class="signalCardTitle">${esc(title)}</h3><p class="signalCardDesc">${esc(desc)}</p></div>`
  ).join('\n        ')

  const renderScenarioReference = CHAT_CAPABILITIES.map((cap) => {
    const dialogue = cap.messages
      .map((m) => {
        const who = m.role === 'user' ? 'You' : 'OpenClaw'
        const action = m.action ? ` [${m.action}]` : ''
        return `${who}: ${m.text}${action}`
      })
      .join(' · ')
    return `<article class="scenarioRefItem">
          <h3 class="scenarioRefTitle">${esc(cap.label)} <span class="scenarioRefApp">(${esc(cap.app)})</span></h3>
          <p class="scenarioRefPrompt"><strong>You ask:</strong> ${esc(cap.prompt)}</p>
          <p class="scenarioRefDialogue"><strong>Example thread:</strong> ${esc(dialogue)}</p>
        </article>`
  }).join('\n        ')

  const renderScenarioReferencePlain = CHAT_CAPABILITIES.map((cap) => {
    const lines = cap.messages
      .map((m) => `<li>${esc(m.role === 'user' ? 'You' : 'OpenClaw')}: ${esc(m.text)}</li>`)
      .join('')
    return `<li><strong>${esc(cap.label)}</strong> (${esc(cap.app)}): ${esc(cap.prompt)}<ul>${lines}</ul></li>`
  }).join('\n          ')

  const FEAR_SCENARIOS = [
    [
      'If you wire OpenClaw to prod directly',
      'Shell, kubectl, or cloud CLI on the gateway.',
      'One typo in Telegram becomes rm -rf, a deleted namespace, or a public S3 bucket. No approval. No undo. Your chat app is now root.',
    ],
    [
      'You ask "restart the API"',
      'The model picks the command.',
      'Wrong service. Wrong environment. You find out from customers, not from an audit log.',
    ],
    [
      'Credentials live on the gateway',
      'kubeconfig and cloud keys next to a webhook.',
      'Compromise that small VM and the attacker owns your fleet. That is the cost of "direct" control.',
    ],
  ]

  const COMPARE = [
    ['Who touches prod', 'OpenClaw runs commands on your servers', 'Only AlertMend does. OpenClaw never connects'],
    ['Credentials', 'SSH keys and kubeconfig on the chat gateway', 'Credentials stay in AlertMend'],
    ['What chat can do', 'Whatever the model invents', 'Only what you allowlisted'],
    ['If the gateway is hacked', 'Full fleet access', 'Chat access only. No path to prod'],
  ]

  const SAFETY = [
    ['No direct path', 'OpenClaw talks to AlertMend, not your servers', 'Safe by design, not safe because you hoped the model behaves'],
    ['You define the boundary', 'Approve runbooks before chat can trigger them', 'Restart yes. Delete namespace no. Your rules.'],
    ['Full audit trail', 'Every action tied to who asked in chat', 'Control you can actually prove in a postmortem'],
    ['Same thread', 'AlertMend pages; OpenClaw explains', 'Incidents and conversation stay together'],
  ]

  const SETUP_STEPS = [
    ['Connect infra in AlertMend', 'VMs, Docker hosts, or Kubernetes. AlertMend is the only thing that touches prod.'],
    ['Wire OpenClaw to AlertMend', 'Chat gateway only. No prod credentials on that box.'],
    ['Ask from Slack or Telegram', 'Natural language in, controlled actions out.'],
  ]

  const FAQ = [
    [
      'Can I ask on Slack to restart my VM?',
      'Yes, if you approved a restart runbook in AlertMend first. Message OpenClaw in Slack or Telegram: "restart prod-api-01" or "bounce the worker VM." AlertMend runs the allowlisted runbook, logs who asked, and OpenClaw confirms in the same thread.',
    ],
    [
      'Can I restart a pod from Telegram?',
      'Yes, when OpenClaw is wired to AlertMend and your Kubernetes cluster is connected. Ask in plain language: "restart the payment-worker pod" or "rollout restart staging-api." AlertMend validates against your runbooks. No kubeconfig on the OpenClaw gateway.',
    ],
    [
      'Can I check prod health from my phone?',
      'That is the main use case. Ask "is prod healthy?" or "which services are down?" from Slack or Telegram. OpenClaw asks AlertMend. You get disk, memory, and incident context in plain English. No SSH, no VPN, no laptop.',
    ],
    [
      'What else can I ask from Slack or Telegram?',
      'Fleet health, disk pressure, crashing pods, error summaries, what broke last night, and approved fixes. If AlertMend monitors it and you allowlisted the runbook, you can ask about it in natural language.',
    ],
    [
      'Can I see disk usage or memory without SSH?',
      'Yes. Ask "which hosts are running hot?" or "disk usage on worker-02." AlertMend agents report real prod metrics. OpenClaw summarizes in chat. Nothing runs on the OpenClaw gateway box except the conversation.',
    ],
    [
      'Can I get an incident summary in the same chat thread?',
      'Yes. Ask "what happened last night?" or "why did we page at 2am?" AlertMend pulls the incident timeline and remediation log. OpenClaw explains it in the same Slack or Telegram thread where you asked.',
    ],
    [
      'How do I connect OpenClaw to AlertMend?',
      'Connect VMs, Docker hosts, or Kubernetes in AlertMend first. Define allowlisted runbooks: restarts, health checks, log summaries. Point OpenClaw at AlertMend as its infra backend. Keep prod credentials in AlertMend only.',
    ],
    [
      'What is OpenClaw vs AlertMend?',
      'OpenClaw is the chat gateway (Slack, Telegram, Discord). AlertMend is the control plane: health checks, runbooks, remediation, audit log. OpenClaw talks. AlertMend touches infra. Together: chat ops without root on your phone.',
    ],
    [
      'Does OpenClaw work with VMs, Docker, and Kubernetes?',
      'OpenClaw is channel-agnostic. AlertMend connects to bare-metal VMs, cloud servers, Docker hosts, and Kubernetes clusters. Same chat flow for all of them. Ask on Slack or Telegram, AlertMend executes on the target you approved.',
    ],
    [
      'Does OpenClaw touch my infrastructure directly?',
      'No. OpenClaw connects to AlertMend for every infra request. AlertMend runs health checks, runbooks, and remediation on your VMs and clusters. The gateway never holds SSH keys or kubeconfig.',
    ],
    [
      'Why not wire OpenClaw directly to production?',
      'Because shell on the gateway means one bad prompt can delete a namespace from chat. AlertMend in the middle gives you allowlists, logging, and control, without giving Telegram root access to prod.',
    ],
    [
      'Is it safe to run fixes from chat?',
      'Safe when AlertMend is in the middle. Chat triggers only pre-approved runbooks: restart VM yes, delete namespace no. Every action is logged with who asked. Direct OpenClaw-to-prod wiring is not safe for production.',
    ],
  ]

  const renderFearScenarios = FEAR_SCENARIOS.map(
    ([when, title, body]) =>
      `<div class="fearScenario"><p class="fearScenarioWhen">${esc(when)}</p><h3 class="fearScenarioTitle">${esc(title)}</h3><p class="fearScenarioBody">${esc(body)}</p></div>`
  ).join('\n        ')

  const MODE_PLAYBOOKS = {
    vps: {
      tabTitle: 'VMs',
      tabSub: 'Bare metal + cloud VMs',
      title: 'VMs and bare metal',
      summary:
        'AlertMend agents watch your servers. OpenClaw asks AlertMend in plain language. No SSH keys on the chat gateway.',
      steps: [
        'Connect your VMs in AlertMend',
        'Define what chat is allowed to do: status, logs, approved restarts',
        'Wire OpenClaw to AlertMend, not to prod',
        'Ask from Slack or Telegram; AlertMend executes',
      ],
      tip: 'If OpenClaw can SSH to prod, you skipped the safety layer.',
    },
    docker: {
      tabTitle: 'Docker hosts',
      tabSub: 'Container servers',
      title: 'Docker hosts',
      summary:
        'Container hosts monitored by AlertMend. OpenClaw never gets docker.sock or shell on the gateway box.',
      steps: [
        'Register Docker hosts in AlertMend',
        'Allowlist runbooks: list containers, restart named service',
        'Keep OpenClaw on a separate small server with no prod access',
        'Every action from chat is logged in AlertMend',
      ],
      tip: 'Mounting docker.sock into OpenClaw is direct infra access. Do not.',
    },
    k8s: {
      tabTitle: 'Kubernetes',
      tabSub: 'Clusters',
      title: 'Kubernetes',
      summary:
        'AlertMend connects to your cluster. OpenClaw handles the conversation; AlertMend enforces what can run.',
      steps: [
        'Connect your cluster in AlertMend',
        'Approve runbooks before chat can trigger them',
        'No kubeconfig on the OpenClaw gateway',
        'Incidents page in Slack; OpenClaw explains in the same thread',
      ],
      tip: 'kubectl on the OpenClaw host is the anti-pattern. AlertMend holds cluster access.',
    },
  }

  const renderModePlaybookPanels = Object.entries(MODE_PLAYBOOKS)
    .map(
      ([id, mode], i) =>
        `<div class="modePlaybookPanel${i === 0 ? '' : ' hidden'}" data-mode-panel="${id}" role="tabpanel" id="mode-panel-${id}" aria-labelledby="mode-tab-${id}">
        <div class="modePlaybookHead">
          <h3 class="modePlaybookTitle">Setup: ${esc(mode.title)}</h3>
        </div>
        <p class="modePlaybookSummary">${esc(mode.summary)}</p>
        <ul class="checkList">${mode.steps.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
        <div class="stepTip"><span>${esc(mode.tip)}</span></div>
      </div>`
    )
    .join('\n        ')

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
    name: 'Connect OpenClaw to AlertMend for safe infra control from chat',
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
    image: heroImageUrl,
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

  const breadcrumbLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Blog', item: `${SITE_URL}/blog` },
      { '@type': 'ListItem', position: 2, name: title, item: canonical },
    ],
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
  <meta property="og:image" content="${heroImageUrl}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(excerpt)}">
  <meta name="twitter:image" content="${heroImageUrl}">
  <script type="application/ld+json">${blogLd}</script>
  <script type="application/ld+json">${faqLd}</script>
  <script type="application/ld+json">${howToLd}</script>
  <script type="application/ld+json">${breadcrumbLd}</script>
  <link rel="stylesheet" href="${assetsBase}/styles.css">
  <style>${CHROME_INLINE_CSS}</style>
</head>
<body>
${buildNavHtml(slug, postCalendlyUrl)}

  <div class="main-container">
    <div class="content-wrapper">
      <div class="main-col">

    <article class="blogArticle" itemscope itemtype="https://schema.org/BlogPosting">
      <link itemprop="mainEntityOfPage" href="${canonical}">
      <meta itemprop="description" content="${esc(excerpt)}">
      <meta itemprop="image" content="${heroImageUrl}">

      <nav class="blogBreadcrumb" aria-label="Breadcrumb">
        <ol class="blogBreadcrumbList">
          <li class="blogBreadcrumbItem"><a href="/blog">Blog</a></li>
          <li class="blogBreadcrumbItem" aria-current="page">${esc(title)}</li>
        </ol>
      </nav>

    <div class="dl-blog">
      <section class="heroBand funBand">
        <div class="heroBrandLockup">
          <img src="${assetsBase}/openclaw-logo-text-dark.svg" alt="OpenClaw" class="heroOpenClawLogo" width="148" height="30">
          <span class="heroBrandSep" aria-hidden="true">×</span>
          <a href="/" class="heroAmLink">
            <img src="/logos/alertmend-logo.svg" alt="AlertMend" class="heroAmLogo" width="128" height="28">
          </a>
        </div>
        <h1 class="funHeadline" itemprop="headline">${esc(title)}</h1>
        <p class="heroLead">Run your cloud from the chat app you already live in. OpenClaw on <strong>Slack or Telegram</strong>. AlertMend on your infra. You ask in plain language from your phone: health checks, incidents, approved fixes, without opening a terminal or VPN.</p>
        <ul class="trustPills">
          <li class="trustPill"><span class="trustPillIcon">◎</span> From your phone</li>
          <li class="trustPill"><span class="trustPillIcon">◎</span> No SSH session</li>
          <li class="trustPill"><span class="trustPillIcon">◎</span> Still in control</li>
          <li class="trustPill"><span class="trustPillIcon">◎</span> AlertMend in the middle</li>
        </ul>
        <p class="pipelineCaption">How a message becomes an action</p>
        <div class="pipeline" style="position:relative">
          <div class="docPacket" aria-hidden="true"></div>
          <div class="pipelineGroup">
            <div class="pipelineNode">
              <div class="pipelineIconRow" aria-hidden="true">
                <img class="pipelineIcon" src="/logos/slack_logo.svg" alt="" width="32" height="32">
                <img class="pipelineIcon" src="${assetsBase}/pipeline-telegram.svg" alt="" width="32" height="32">
              </div>
              <div class="pipelineLabel">Slack</div>
              <div class="pipelineSub">or Telegram</div>
            </div>
            <div class="pipelineArrow" aria-hidden="true">→</div>
          </div>
          <div class="pipelineGroup">
            <div class="pipelineNode">
              <img class="pipelineIcon pipelineIconLobster" src="${assetsBase}/pixel-lobster.svg" alt="OpenClaw" width="32" height="32">
              <div class="pipelineLabel">OpenClaw</div>
              <div class="pipelineSub">chat only</div>
            </div>
            <div class="pipelineArrow" aria-hidden="true">→</div>
          </div>
          <div class="pipelineGroup">
            <div class="pipelineNode pipelineNodeFocus">
              <img class="pipelineIcon" src="/logos/alertmend-logo.svg" alt="" width="32" height="32">
              <div class="pipelineLabel">AlertMend</div>
              <div class="pipelineSub">control plane</div>
            </div>
            <div class="pipelineArrow" aria-hidden="true">→</div>
          </div>
          <div class="pipelineNode">
            <img class="pipelineIcon" src="${assetsBase}/pipeline-infra.svg" alt="" width="32" height="32">
            <div class="pipelineLabel">Your infra</div>
            <div class="pipelineSub">VMs · K8s · cloud</div>
          </div>
        </div>
      </section>

      <p class="articleMetaCompact">
        <span itemprop="author" itemscope itemtype="https://schema.org/Person"><span itemprop="name">${esc(author)}</span></span>
        · <time datetime="${date}" itemprop="datePublished">${esc(date)}</time>
        · ${esc(category)}
      </p>

      <section class="capabilityShowcase" aria-label="Interactive demo of chat capabilities">
        <h2 class="sectionHead capabilityShowcaseHead">What you can do from one message</h2>
        <p class="sectionSub">Pick a scenario or watch them cycle. Every example runs through AlertMend, not shell on prod.</p>
        <div class="capabilityLayout">
          <div class="capabilityNav" role="tablist" aria-label="Chat scenarios">
          ${renderCapabilityNav}
          </div>
          <div class="capabilityStage">
            <div class="promptPreviewWrap" id="prompt-wrap">
              <div class="promptPreviewRow">
                <div class="promptPreviewCol">
                  <span class="promptPreviewLabel">You type</span>
                  <p class="promptPreview" id="prompt-preview" aria-live="polite"></p>
                </div>
                <button type="button" class="promptSendBtn" id="prompt-send" tabindex="-1" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
                </button>
              </div>
            </div>
            <div class="chatDemo chatDemoSlack" id="chat-demo" role="img" aria-label="Animated chat demo">
              <div class="chatDemoChrome" id="chat-demo-chrome">
                <div class="chromeDots"><span class="chromeDot"></span><span class="chromeDot"></span><span class="chromeDot"></span></div>
                <div class="chatDemoAppWrap">
                  <img class="chatSlackLogo" id="chat-slack-logo" src="/logos/slack_logo.svg" alt="" width="22" height="22">
                  <span class="chatDemoChannel" id="chat-demo-channel"># infra-control</span>
                  <span class="chatDemoApp hidden" id="chat-demo-app">Telegram</span>
                </div>
                <span class="liveBadge"><span class="liveDot"></span> Live</span>
              </div>
              <div class="chatDemoBody" id="chat-demo-body"></div>
              <div class="slackComposer" id="chat-composer" aria-hidden="true">
                <div class="slackComposerInner">
                  <span class="slackComposerPlaceholder">Message #infra-control</span>
                </div>
              </div>
            </div>
            <div class="backstage" id="chat-backstage" aria-label="What happens behind the chat">
              <p class="backstageTitle">Behind the chat</p>
              <ol class="backstageSteps" id="backstage-steps"></ol>
              <p class="backstageSuccess hidden" id="backstage-success">✓ Done, logged in AlertMend</p>
            </div>
          </div>
        </div>
        <p class="chatDemoCaption">Tap any scenario above. Same flow every time: you ask in plain language, AlertMend does the work, answer lands in chat.</p>

        <section class="scenarioReference" aria-label="Chat scenario examples">
          <h3 class="scenarioReferenceHead">Example prompts and replies</h3>
          <div class="scenarioReferenceGrid">
        ${renderScenarioReference}
          </div>
        </section>

        <noscript>
          <section class="scenarioReferencePlain" aria-label="Chat scenarios without JavaScript">
            <h3>Chat scenarios</h3>
            <ul>
          ${renderScenarioReferencePlain}
            </ul>
          </section>
        </noscript>
      </section>

      <h2 class="sectionHead">Why teams actually love this</h2>
      <div class="signalGrid reveal visible">
        ${renderFunMoments}
      </div>

      <section class="archDiagram" aria-labelledby="arch-diagram-title">
        <div class="archDiagramCard">
          <h2 id="arch-diagram-title" class="archDiagramTitle">OpenClaw never touches your infra directly</h2>
          <p class="archDiagramLead">You chat on Slack or Telegram. AlertMend runs the commands on VMs, Docker hosts, and Kubernetes. OpenClaw stays on the conversation layer.</p>
          <div class="archFlow" role="img" aria-label="Flow from Slack and Telegram through OpenClaw and AlertMend to your infrastructure">
            <div class="archNode">
              <div class="archNodeIcons" aria-hidden="true">
                <img src="/logos/slack_logo.svg" alt="" width="28" height="28">
                <img src="${assetsBase}/pipeline-telegram.svg" alt="" width="28" height="28">
              </div>
              <span class="archNodeLabel">Slack or Telegram</span>
              <span class="archNodeMeta">where you ask</span>
            </div>
            <span class="archArrow" aria-hidden="true"></span>
            <div class="archNode archNodeGateway">
              <img class="archNodeIcon archNodeIconLobster" src="${assetsBase}/pixel-lobster.svg" alt="" width="32" height="32">
              <span class="archNodeLabel">OpenClaw</span>
              <span class="archNodeMeta">chat only</span>
            </div>
            <span class="archArrow" aria-hidden="true"></span>
            <div class="archNode archNodeAm">
              <img class="archNodeIcon" src="/logos/alertmend-logo.svg" alt="" width="32" height="32">
              <span class="archNodeLabel">AlertMend</span>
              <span class="archNodeMeta">control plane</span>
            </div>
            <span class="archArrow" aria-hidden="true"></span>
            <div class="archNode archNodeInfra">
              <img class="archNodeIcon" src="${assetsBase}/pipeline-infra.svg" alt="" width="32" height="32">
              <span class="archNodeLabel">Your infra</span>
              <span class="archNodeMeta">VMs · K8s · cloud</span>
            </div>
          </div>
          <div class="archBlocked" aria-label="OpenClaw does not connect directly to your infrastructure">
            <div class="archBlockedNodes">
              <span class="archBlockedNode">OpenClaw</span>
              <span class="archBlockedLine" aria-hidden="true"></span>
              <span class="archBlockedBadge">no direct link</span>
              <span class="archBlockedNode">Your infra</span>
            </div>
            <p class="archBlockedNote">No SSH, kubectl, or cloud credentials on the OpenClaw gateway. Only approved AlertMend runbooks touch prod.</p>
          </div>
        </div>
      </section>

      <section class="heroBand fearBand fearBandCompact">
        <p class="heroGuideLabel">The part most tutorials skip</p>
        <h2 class="fearHeadline">OpenClaw wired straight to prod is fast to set up. It is not fun when it goes wrong.</h2>
        <p class="fearLead">Shell on the gateway means one bad prompt can delete a namespace from Telegram. <strong>That is not control.</strong> That is hope with a webhook.</p>
        <div class="fearScenarioGrid">
        ${renderFearScenarios}
        </div>
        <p class="fearBridge"><strong>AlertMend in the middle</strong> keeps the fun (chat from anywhere) and drops the roulette (arbitrary commands on prod).</p>
      </section>

      <section class="heroBand heroBandCompact">
        <p class="heroGuideLabel">The safe pattern</p>
        <p class="seoTldr"><strong>TL;DR:</strong> OpenClaw for chat. AlertMend for infra. <strong>Never wire OpenClaw directly to prod.</strong> That turns your phone into a root shell.</p>
      </section>

      <h2 class="sectionHead">How it works (without the scary parts)</h2>
      <p class="bodyText">You message OpenClaw on <strong>Slack or Telegram</strong>. OpenClaw asks <strong>AlertMend</strong>. AlertMend checks your VMs, containers, or clusters and runs only what you pre-approved. OpenClaw summarizes the answer back in chat.</p>
      <p class="bodyText"><strong>That is the whole model.</strong> Chat on one side. Infra on the other. AlertMend in the middle. OpenClaw never SSHs to prod, never runs kubectl on your gateway, never holds cloud credentials.</p>

      <h2 class="sectionHead">The fun way vs the risky way</h2>
      <div class="diyWrap">
        <table class="compareTable">
          <thead><tr><th>Concern</th><th class="compareBad">Direct to prod 😬</th><th class="compareGood">Via AlertMend ✓</th></tr></thead>
          <tbody>
            ${COMPARE.map(([c, bad, good]) => `<tr><td><strong>${esc(c)}</strong></td><td class="compareBadCell">${esc(bad)}</td><td class="diyHighlight compareGoodCell">${esc(good)}</td></tr>`).join('\n            ')}
          </tbody>
        </table>
      </div>
      <p class="bodyText">Most tutorials show OpenClaw with shell tools. That is fast to set up and painful to regret. <strong>AlertMend in the middle</strong> is the pattern for teams who want chat ops without betting the fleet on model behavior.</p>

      <h2 class="sectionHead">Works for VMs, Docker, and Kubernetes</h2>
      <div class="modeGrid" role="tablist" aria-label="Infra type">
        ${Object.entries(MODE_PLAYBOOKS)
          .map(
            ([id, mode], i) =>
              `<button type="button" role="tab" id="mode-tab-${id}" data-mode-id="${id}" class="modeCard${i === 0 ? ' modeCardActive' : ''}" aria-selected="${i === 0 ? 'true' : 'false'}" aria-controls="mode-panel-${id}"><span class="modeCardTitle">${esc(mode.tabTitle)}</span><span class="modeCardSub">${esc(mode.tabSub)}</span></button>`
          )
          .join('\n        ')}
      </div>
      <div class="modePlaybook">
        ${renderModePlaybookPanels}
      </div>

      <h2 class="sectionHead">Three steps</h2>
      <div class="amFlow">
        ${SETUP_STEPS.map(([t, b], i) => `<div class="amStep"><div class="amStepHead"><span class="amStepNum">${i + 1}</span></div><h3 class="amStepTitle">${esc(t)}</h3><p class="amStepBody">${esc(b)}</p></div>`).join('\n        ')}
      </div>

      <h2 class="sectionHead">Why this is safe (and direct connection is not)</h2>
      <div class="searchIssueGrid">
        ${SAFETY.map(([term, desc]) => `<div class="searchIssueCard"><h3 class="searchIssueTerm">${esc(term)}</h3><p class="searchIssueDesc">${esc(desc)}</p></div>`).join('\n        ')}
      </div>

      <h2 class="sectionHead">FAQ</h2>
      <p class="sectionSub">What you can do from chat, plus how to keep it safe.</p>
      <div class="faqList">
        ${FAQ.map(([q, a], i) => `<details class="faqItem"${i === 0 ? ' open' : ''}><summary class="faqQuestion">${esc(q)}</summary><div class="faqAnswer">${esc(a)}</div></details>`).join('\n        ')}
      </div>

      <div class="ctaBand">
        <div class="ctaBandTitle">Prod in your pocket. From the couch. On Slack or Telegram.</div>
        <p class="ctaBandSub">Talk to an engineer. We'll wire OpenClaw to AlertMend so you can ask, fix, and sleep. All the fun of chat ops. None of the "oops I deleted prod" energy.</p>
        <div class="ctaBtnRow">
          <a href="${postCalendlyUrl}" class="ctaBtn" target="_blank" rel="noopener noreferrer">Talk to an expert →</a>
        </div>
      </div>
    </div>

    </article>

    <div class="promo">
      <p><strong>Related:</strong> <a href="/blog/vibe-coded-app-vm-observability">Vibe-Coded App Observability</a> · <a href="/blog/monitor-langfuse-using-alertmend">Monitor Langfuse in Production</a> · <a href="/case-studies">VM auto-remediation case study</a></p>
    </div>
      </div>

${buildSidebarHtml(relatedPosts)}
    </div>
  </div>

  <script>window.__CHAT_CAPABILITIES__ = ${JSON.stringify(CHAT_CAPABILITIES)};</script>
  <script>window.__OPENCLAW_ASSETS__ = ${JSON.stringify(assetsBase)};</script>
  <script src="${assetsBase}/script.js" defer></script>
</body>
</html>`

  writeStaticBlogOutputs(slug, html)
}
