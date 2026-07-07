/**
 * Flagship showcase: AlertMend runbook automation that chains connectors to resolve
 * complex cross-stack incidents (alert -> query -> AWS -> kubectl on runtime-chosen
 * pods -> Slack/WhatsApp approval -> notify + audit). Anchored in an e-commerce
 * flash-sale scenario, with a multi-industry section. All honest per features doc.
 * No em dashes anywhere.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { SITE_URL, esc, CHROME_INLINE_CSS, AUTHOR_CRED_CSS, buildNavHtml, buildSidebarHtml, buildCredArticleHeader, calendlyUrl, appendBlogSignupHandler } from './static-blog-shared.mjs'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const DATE = '2026-07-07', MODIFIED = '2026-07-07'
const AUTHOR = 'Dinesh Agrawal'
const LINKEDIN = 'https://www.linkedin.com/in/dineshagrawal85/'
const ACCENT = '#7c3aed', ACCENT_DARK = '#241b4d'

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
.instantFix{position:relative;margin-bottom:1rem;padding:1.15rem;overflow:hidden;border:1px solid #ddd6fe;border-radius:14px;background:#fff;box-shadow:0 8px 28px rgba(9,9,11,.05);}
.instantFixTop{display:flex;flex-direction:column;align-items:flex-start;gap:.35rem;margin-bottom:.6rem;}
.instantFixTop span{color:var(--am-accent);font-size:.65rem;font-weight:800;letter-spacing:.09em;text-transform:uppercase;}
.instantFixTop strong{color:#18181b;font-size:.95rem;line-height:1.45;}
.instantFix>p{margin:0 0 .9rem;max-width:680px;color:#3f3f46;font-size:1rem;line-height:1.6;}
.instantFixCommands{display:grid;grid-template-columns:max-content minmax(0,1fr);gap:.4rem .8rem;align-items:center;padding:.75rem;border-radius:8px;background:#18181b;}
.instantFixCommands code{color:#ddd6fe;font-size:.75rem;}
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
.rbStep{display:grid;grid-template-columns:2rem 1fr;gap:14px;padding:16px 0;border-bottom:1px solid #f0f0f2;}
.rbStep:last-child{border-bottom:0;}
.rbStepNum{display:grid;place-items:center;width:2rem;height:2rem;border-radius:50%;background:#ede9fe;color:var(--am-accent);font-weight:800;font-size:.85rem;}
.rbStep h3{margin:0 0 3px;color:#18181b;font-size:1.02rem;}
.rbStep p{margin:0;color:#3f3f46;font-size:.92rem;line-height:1.62;}
.rbStep .rbConn{display:inline-block;margin-top:6px;font-size:.72rem;font-weight:700;color:var(--am-accent);background:#f5f3ff;padding:2px 8px;border-radius:999px;}
.calloutBox{margin:1.5rem 0;padding:18px 20px;border-left:3px solid var(--am-accent);border-radius:0 10px 10px 0;background:#f7f5ff;color:#3f3f46;line-height:1.7;}
.calloutBox strong{color:#18181b;}
.ctaInline{margin:1.6rem 0;padding:15px 18px;border-left:3px solid var(--am-accent);border-radius:0 10px 10px 0;background:#faf9fb;font-weight:600;color:#27272a;}
.ctaInline a{color:var(--am-accent);}
.authorBioCard{display:flex;gap:24px;align-items:flex-start;flex-wrap:wrap;padding-bottom:1rem;}
.authorBioCard h3{font-size:1.5rem;font-weight:800;color:#09090b;margin:0 0 4px;}
.authorBioRole{color:var(--am-accent);font-weight:600;margin:0 0 14px;}
.authorBioText{color:#3f3f46;line-height:1.75;}
.authorBioLink{display:inline-flex;align-items:center;gap:6px;margin-top:14px;color:#71717a;text-decoration:none;font-weight:600;}
`

const BOLT = 'M13 3v7h6l-8 11v-7H5l8-11z'

function authorCard() {
  return `
          <hr style="margin:2.5rem 0 1.75rem;border:none;border-top:1px solid #e4e4e7;">
          <div class="authorBioCard">
            <img src="/logos/dinesh.jpeg" alt="${AUTHOR}" width="128" height="128" loading="lazy" style="width:128px;height:128px;border-radius:12px;object-fit:cover;border:1px solid #e4e4e7;flex-shrink:0;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
            <div style="display:none;width:128px;height:128px;border-radius:12px;border:1px solid #e4e4e7;background:#f4f4f5;align-items:center;justify-content:center;font-weight:800;font-size:2.25rem;color:#3f3f46;flex-shrink:0;">DA</div>
            <div style="flex:1;min-width:240px;">
              <h3>${AUTHOR}</h3>
              <p class="authorBioRole">Co-Founder at AlertMend.io</p>
              <div class="authorBioText">
                <p style="margin:0 0 10px;">${AUTHOR} brings 12+ years of deep experience across cloud and AI-driven automation, building systems that detect, diagnose, and fix production incidents without waiting for a human.</p>
                <p style="margin:0;">At AlertMend.io he focuses on autonomous, self-healing operations, turning manual cloud firefighting into workflows that predict, remediate, and learn.</p>
              </div>
              <a class="authorBioLink" href="${LINKEDIN}" target="_blank" rel="noopener noreferrer" aria-label="${AUTHOR} on LinkedIn">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zM8.34 18V9.94H5.67V18h2.67zM7 8.76a1.55 1.55 0 1 0 0-3.1 1.55 1.55 0 0 0 0 3.1zM18.34 18v-4.42c0-2.37-1.27-3.47-2.96-3.47-1.36 0-1.97.75-2.31 1.28V9.94h-2.67V18h2.67v-4.5c0-.24.02-.48.09-.65.19-.48.63-.98 1.36-.98.96 0 1.35.73 1.35 1.8V18h2.82z"/></svg>
                <span>LinkedIn</span>
              </a>
            </div>
          </div>`
}

// Animated runbook flow: alert -> query -> AWS -> kubectl (runtime pods) -> approval -> notify
function flowSvg() {
  const nodes = [
    ['Alert', 'from anywhere', '#3f3f46', false],
    ['Query', 'find blast radius', '#3f3f46', false],
    ['AWS action', 'scale / drain', '#3f3f46', false],
    ['kubectl', 'affected pods, at runtime', ACCENT, true],
    ['Approval', 'Slack / WhatsApp', ACCENT, true],
    ['Notify + audit', 'summary, Jira, log', '#16a34a', false],
  ]
  const W = 160, GAP = 12, Y = 70, H = 92
  return `<figure class="flowDiagram" style="overflow-x:auto;">
      <svg class="rb-anim" viewBox="0 0 1032 220" width="1032" height="220" role="img" aria-label="One runbook chains six steps: an alert triggers it, it queries metrics to find the blast radius, runs an AWS action, restarts the affected pods chosen at runtime, pauses for a Slack or WhatsApp approval, then notifies and records an audit trail." font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" style="display:block;min-width:1000px;border-radius:12px;border:1px solid #e4e4e7;background:linear-gradient(180deg,#faf9ff,#f3f1fb);">
        <defs>
          <marker id="rb-ar" markerWidth="9" markerHeight="9" refX="6.5" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L7,3 L0,6 Z" fill="${ACCENT}"/></marker>
          <style>@media (prefers-reduced-motion: no-preference){.rb-anim .rb-l{stroke-dasharray:7 6;animation:rb-f .8s linear infinite}@keyframes rb-f{to{stroke-dashoffset:-13}}}</style>
        </defs>
        <text x="16" y="34" font-size="15" font-weight="800" fill="#09090b">One runbook, one minute</text>
        <text x="16" y="54" font-size="12.5" fill="#71717a">Triggered automatically. Stops for a human only at the approval gate.</text>
        ${nodes.map((n, i) => {
          const x = 16 + i * (W + GAP)
          const accent = n[3]
          const box = `<rect x="${x}" y="${Y}" width="${W}" height="${H}" rx="12" fill="${accent ? '#faf5ff' : '#fff'}" stroke="${accent ? ACCENT : '#e4e4e7'}" stroke-width="${accent ? 1.5 : 1}"/>` +
            `<circle cx="${x + 24}" cy="${Y + 26}" r="13" fill="${n[2]}" opacity="0.12"/><path d="${BOLT}" transform="translate(${x + 15},${Y + 15}) scale(0.8)" fill="${n[2]}"/>` +
            `<text x="${x + 44}" y="${Y + 31}" font-size="13.5" font-weight="800" fill="#18181b">${esc(n[0])}</text>` +
            `<text x="${x + 14}" y="${Y + 60}" font-size="11.5" fill="#52525b">${esc(n[1])}</text>` +
            (n[3] ? `<text x="${x + 14}" y="${Y + 78}" font-size="10" font-weight="800" fill="${ACCENT}">${i === 3 ? 'RUNTIME-TARGETED' : 'HUMAN GATE'}</text>` : '')
          const arrow = i < nodes.length - 1 ? `<line class="rb-l" x1="${x + W}" y1="${Y + H / 2}" x2="${x + W + GAP}" y2="${Y + H / 2}" stroke="${ACCENT}" stroke-width="2.5" marker-end="url(#rb-ar)"/>` : ''
          return box + arrow
        }).join('')}
      </svg>
      <figcaption class="flowDiagramCaption">The hard incidents span five systems. A runbook chains them into one governed flow, and targets the fix at the resources the alert actually named.</figcaption>
    </figure>`
}

function codeBlock(code) { return `<pre class="codeBlock copyableCode"><code>${esc(code)}</code></pre>` }

const INCIDENT_SNIPPET = `# Illustrative runbook: checkout incident (the same flow, as config)
trigger:
  on_alert: checkout_error_rate > 5%          # Alertmanager or Datadog
steps:
  - query   prometheus: rate(http_5xx{service="checkout"}[2m]) by (pod)
  - branch  if database_saturated:
      - aws   rds create-read-replica    (or asg scale +2)
  - kubectl rollout restart deploy/checkout -n shop
            # target comes from the alert; fans out to every pod of the service
  - approve channel=slack to=oncall-lead      # human gate before the restart
  - notify  slack #incidents  +  jira create  +  write audit log`

const CFG = {
  slug: 'cross-stack-incident-automation',
  title: 'Automate Complex Incidents with Runbooks',
  h1: 'Runbook Automation: Resolve Complex, Cross-Stack Incidents',
  excerpt: 'One runbook can take an alert, query metrics, run an AWS action, restart the exact affected pods, and get a Slack or WhatsApp approval, end to end.',
  keywords: 'runbook automation, automated incident remediation, incident response automation, self-healing infrastructure, kubectl automation, aws automation, slack approval workflow, cross-stack automation, whatsapp incident approval, AlertMend',
  category: 'Automation',
  faqs: [
    ['What is a runbook in AlertMend?', 'A runbook is a visual, graph-based workflow that automates an operational playbook. It starts on a trigger (an alert, a schedule, or a webhook), then runs steps that query metrics, execute commands on VMs or inside Kubernetes pods, call cloud APIs, branch on conditions, pause for approval, and notify a channel, all from one place.'],
    ['Can one runbook run AWS commands and kubectl in the same flow?', 'Yes. A single runbook can query Prometheus, run an AWS action such as scaling a group or archiving to S3, then run kubectl or an in-pod command against the affected workload, and finish with a Slack or WhatsApp approval and a summary. The whole cross-system chain runs as one governed flow.'],
    ['How does it decide which pods to act on?', 'It reads the affected resource from the alert (the pod, namespace, and service) and targets the action there at runtime, rather than a hardcoded list. It can also fan out across every pod that matches a label selector, so one runbook covers many different incidents.'],
    ['Does it require approval before making changes?', 'It can. Destructive or customer-impacting steps sit behind an approval gate that routes to Slack, Microsoft Teams, WhatsApp, or Email. The runbook pauses until the right person approves, and low-risk steps can run without a gate.'],
    ['What can trigger a runbook?', 'An alert firing (from Alertmanager, Datadog, or PagerDuty), a cron schedule, a health policy, a chat slash-command, or a custom webhook. Reactive when something breaks, or proactive on a timer.'],
    ['Can it send a WhatsApp or Slack approval?', 'Yes. Approvals and notifications route to Slack, Microsoft Teams, WhatsApp, and Email, so the on-call lead can approve a change from their phone and the thread becomes the record of what happened.'],
    ['Is there an audit trail?', 'Every step, query, command, output, and approval is recorded, so the incident thread doubles as the audit trail. That matters for regulated environments and post-incident review, and pairs with RBAC on who can approve.'],
    ['Can it run the same action across many pods or VMs at once?', 'Yes. A step can fan out across every connected VM in a fleet, or across every pod that matches a label selector in a connected cluster, so one execution applies the same check or fix to a whole slice instead of one-off sessions.'],
    ['How is this different from a shell script or a Lambda?', 'A script runs one thing in one place with no gate and no record. A runbook chains steps across alerts, metrics, cloud, and Kubernetes, decides targets at runtime, pauses for human approval where it matters, and logs everything, without you building and maintaining the glue.'],
    ['Can it call a system that has no built-in connector?', 'Yes. A REST API step calls any HTTPS endpoint between other steps, and a custom webhook can trigger a runbook from any upstream, so the automation is not limited to the built-in integrations.'],
  ],
}

function jsonLd() {
  const canonical = `${SITE_URL}/blog/${CFG.slug}`, img = `${SITE_URL}/assets/${CFG.slug}/hero.png`
  const article = { '@context': 'https://schema.org', '@type': 'TechArticle', headline: CFG.title, description: CFG.excerpt, image: img, datePublished: DATE, dateModified: MODIFIED, author: { '@type': 'Person', name: AUTHOR, jobTitle: 'Co-Founder at AlertMend.io', url: LINKEDIN, sameAs: [LINKEDIN] }, publisher: { '@type': 'Organization', name: 'AlertMend AI', logo: { '@type': 'ImageObject', url: `${SITE_URL}/logos/alertmend-logo.svg` } }, mainEntityOfPage: { '@type': 'WebPage', '@id': canonical } }
  const faq = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: CFG.faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) }
  return [article, faq].map((o) => `  <script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n')
}

function render() {
  const canonical = `${SITE_URL}/blog/${CFG.slug}`, cal = calendlyUrl(CFG.slug), img = `${SITE_URL}/assets/${CFG.slug}/hero.png`
  const related = [['odoo-monitoring', 'Odoo Monitoring'], ['gitlab-monitoring', 'GitLab Monitoring'], ['top-kubernetes-cost-management-solutions', 'Kubernetes Cost Management']]
  const relatedSidebar = [
    { slug: 'gitlab-monitoring', title: 'GitLab Self-Hosted Monitoring' },
    { slug: 'odoo-monitoring', title: 'Odoo Monitoring and Auto-Recovery' },
    { slug: 'wordpress-monitoring', title: 'WordPress and WooCommerce Monitoring' },
    { slug: 'n8n-monitoring', title: 'n8n Monitoring and Auto-Recovery' },
    { slug: 'reduce-mttr-for-ai-agents', title: 'Reduce MTTR for AI Agents' },
    { slug: 'top-kubernetes-cost-management-solutions', title: 'Top Kubernetes Cost Management Solutions' },
  ]
  const steps = [
    ['Trigger: the alert starts it', 'The checkout error alert fires from Alertmanager or Datadog and starts the runbook automatically. No one has to notice, open a dashboard, or run the first command.', 'Alertmanager, Datadog, PagerDuty, webhook'],
    ['Query: find the blast radius', 'The runbook queries Prometheus (or the application database) to localize the failure: which service, which pods, and whether PostgreSQL is saturated. That result decides what happens next, so the flow adapts to this incident, not a generic one.', 'Prometheus, VictoriaMetrics, Datadog'],
    ['Cloud: fix the bottleneck', 'If the database is the constraint, the runbook runs an AWS action to add a read replica or scale the checkout group. If disk is the problem, it archives to S3 and reclaims space. The cloud change happens in the same flow.', 'AWS actions, S3'],
    ['Kubernetes: restart the affected pods, at runtime', 'The runbook restarts only the pods the alert actually named, chosen at runtime from the service and readiness state, not a fixed list. It runs kubectl or an in-pod command, and can fan out across every pod matching the failing service.', 'kubectl, in-pod exec, label fan-out'],
    ['Approval: get the human sign-off', 'Before a customer-impacting change during a live sale, the runbook pauses for a Slack or WhatsApp approval from the on-call lead. One tap approves. Low-risk steps run without a gate; risky ones wait for a person.', 'Slack, Teams, WhatsApp, Email'],
    ['Notify and record', 'It posts a full summary to Slack, opens or updates a Jira incident, and records every step, query, command, output, and approval. The thread is the resolution and the audit trail at once.', 'Slack, Jira, audit log'],
  ]
  const connectors = [
    ['Triggers', 'Alertmanager, Datadog, PagerDuty, cron, chat slash-command, and custom webhooks start a runbook, reactively or on a schedule.'],
    ['Metric and data queries', 'Prometheus, VictoriaMetrics, and Datadog queries pull the signal a step needs to decide what to do next.'],
    ['Cloud actions', 'Run AWS actions and archive to S3 inside the flow, so the cloud change is part of the remediation, not a separate console visit.'],
    ['Kubernetes', 'Run kubectl and in-pod commands against the affected workload, and fan out across every pod that matches a label selector.'],
    ['Approvals and messaging', 'Route approvals and summaries to Slack, Microsoft Teams, WhatsApp, and Email, so a human can approve from their phone.'],
    ['Incident and ITSM', 'Declare an incident, open or update a Jira issue, page through PagerDuty, or spin up a war-room bridge, from the same run.'],
    ['REST API glue', 'Call any HTTPS endpoint between steps, so a runbook reaches systems that have no built-in connector.'],
    ['Fleet fan-out', 'Run the same check or fix across every connected VM, or every matching pod, in one execution instead of many manual sessions.'],
  ]
  const industries = [
    ['Retail and e-commerce', 'A checkout or payment incident at peak: query the failing service, scale on AWS, restart the exact affected pods, and approve in Slack before the customer-impacting change, protecting revenue during the sale.'],
    ['Fintech and payments', 'A payment-worker backlog: query the queue depth, scale consumers, restart the stuck workers, require a signed approval, and keep the full audit trail that compliance needs.'],
    ['Logistics and IoT', 'A device-ingestion pipeline backing up: check Kafka lag, scale the consumer group, restart the affected pods, and page the on-call engineer over WhatsApp with the summary.'],
    ['SaaS platforms', 'A noisy-neighbor tenant degrading others: identify and reschedule the affected pods at runtime, throttle the offender, and notify the account team, without touching the healthy tenants.'],
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
${buildCredArticleHeader(CFG.h1, DATE, CFG.category)}
      <div class="brandChip"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="${BOLT}" fill="${ACCENT}"/></svg><span>AlertMend automation and runbooks</span></div>
      <div class="proofBar" style="display:flex;flex-wrap:wrap;gap:8px 16px;align-items:center;margin:-.75rem 0 1.5rem;color:#52525b;font-size:.82rem;">
        <span style="display:inline-flex;align-items:center;gap:6px;font-weight:700;color:#047857;"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>Governed automation with approvals and audit</span>
        <span style="color:#d4d4d8;">&bull;</span><span>Last reviewed ${MODIFIED}</span>
      </div>
    <div class="dl-blog">
      <section class="heroBand heroBandCompact">
        <p class="heroGuideLabel">AlertMend automation · runbooks that span your whole stack</p>
        <div class="instantFix">
          <div class="instantFixTop"><span>THE 60-SECOND ANSWER</span><strong>The incidents that need five tools and four people are exactly what a runbook is for.</strong></div>
          <p>A hard incident is rarely one command. It is an alert, then a query to find the blast radius, then a cloud change, then a restart of the <em>specific</em> affected pods, then a human approval. AlertMend runs that whole chain as one governed workflow, and stops for a person only where it should.</p>
          <div class="instantFixCommands">
            <code>alert fires</code><span>trigger, no human needed</span>
            <code>query &rarr; AWS &rarr; kubectl</code><span>targeted at runtime</span>
            <code>Slack / WhatsApp approve</code><span>human gate, then done</span>
          </div>
        </div>
      </section>

      <nav class="articleToc" aria-label="On this page"><strong>On this page</strong>
        <a href="#scenario">The scenario</a>
        <a href="#flow">One runbook</a>
        <a href="#steps">Step by step</a>
        <a href="#config">The runbook config</a>
        <a href="#connectors">The connectors</a>
        <a href="#runtime">Runtime targeting</a>
        <a href="#governance">Governance</a>
        <a href="#industries">By industry</a>
        <a href="#faq">FAQ</a>
      </nav>

      <h2 class="sectionHead" id="scenario">The 9pm flash-sale incident</h2>
      <p class="bodyText">It is 9:04pm on the night of a flash sale. Checkout error rate jumps from 0.2% to 7%. The alert fires. In most teams this starts a scramble: one person opens Grafana to find which service, another checks the database, another opens the AWS console to look at autoscaling, another runs kubectl to hunt the bad pods, and someone asks in Slack for permission to restart anything. Twenty-five minutes and four people later checkout recovers, after the sale has already lost thousands of orders.</p>
      <p class="bodyText">The problem is not that any one step is hard. It is that the steps live in five different tools, the right target changes every incident, and nobody wants to run a risky command during peak without a second pair of eyes. That combination, cross-system, runtime-specific, and governed, is precisely what a runbook automates.</p>

      <h2 class="sectionHead" id="flow">One runbook, start to finish</h2>
      ${flowSvg()}

      <h2 class="sectionHead" id="steps">The same incident, automated</h2>
      <div>${steps.map((s, i) => `<div class="rbStep"><div class="rbStepNum">${i + 1}</div><div><h3>${esc(s[0])}</h3><p>${s[1]}</p><span class="rbConn">${esc(s[2])}</span></div></div>`).join('')}</div>

      <h2 class="sectionHead" id="config">The runbook, written out</h2>
      <p class="bodyText">You build this on a canvas, but here is the same flow as config so you can see how each step passes its result into the next. It is illustrative; the real runbook is visual and versioned.</p>
      ${codeBlock(INCIDENT_SNIPPET)}
      <div class="calloutBox"><strong>The payoff:</strong> the manual version of this took about 25 minutes and four people, and the sale lost orders the whole time. The runbook runs the same chain in under a minute with a single approval tap, so the incident becomes a Slack notification instead of a war room. On a typical checkout outage that is thousands of orders saved per event.</div>

      <div class="ctaInline">Want to see this run against your own stack? <a href="${cal}" target="_blank" rel="noopener noreferrer">Book a free consultation &rarr;</a> and we will map one of your recurring incidents to a runbook.</div>

      <h2 class="sectionHead" id="connectors">What it connects to</h2>
      <p class="sectionSub">The power is in the chain. A runbook can reach across all of these in a single flow, and pass the result of one step into the next.</p>
      <div class="rbGrid">${connectors.map((c) => `<div class="rbCard"><h3>${esc(c[0])}</h3><p>${esc(c[1])}</p></div>`).join('')}</div>

      <h2 class="sectionHead" id="runtime">Why runtime targeting is the hard part</h2>
      <p class="bodyText">The difficult part of automation is not running a command. It is running it on the <em>right thing</em>. A static runbook that restarts a fixed list of pods is useless the moment the next incident hits a different service. AlertMend reads the affected resource from the alert, the pod, the namespace, the service, and targets the action there, so one runbook covers a whole class of incidents instead of one.</p>
      <div class="calloutBox"><strong>Concretely:</strong> the same "checkout is failing" runbook restarts the payment pods tonight and the search pods next week, because it acts on whatever the alert named, and it can fan out across every pod that matches the failing service rather than a hand-typed list.</div>

      <h2 class="sectionHead" id="governance">Automation you can trust in production</h2>
      <p class="bodyText">Automation without guardrails is how a small incident becomes a big one. AlertMend gates destructive or customer-impacting steps behind approvals that route to Slack, Microsoft Teams, WhatsApp, or Email, scopes who is allowed to approve with RBAC, and records every step, command, output, and approval. The incident thread becomes the audit trail, which is what regulated teams and post-incident reviews need.</p>

      <h2 class="sectionHead" id="industries">The same pattern, by industry</h2>
      <p class="sectionSub">The flash-sale example is retail, but the shape, alert to query to cloud to targeted fix to approval, repeats across sectors. Find yours.</p>
      <div class="diyWrap"><table class="compareTable"><thead><tr><th>Industry</th><th>The runbook, applied</th></tr></thead><tbody>
        ${industries.map((r) => `<tr><td>${esc(r[0])}</td><td class="diyHighlight">${esc(r[1])}</td></tr>`).join('\n        ')}
      </tbody></table></div>

      <h2 class="sectionHead" id="faq">Runbook automation FAQ</h2>
      <div class="faqList">${CFG.faqs.map(([q, a], i) => `<div class="faqItem"><button type="button" class="faqQuestion" data-faq-toggle aria-expanded="${i === 0 ? 'true' : 'false'}">${esc(q)}<svg class="faqChevron${i === 0 ? ' faqChevronOpen' : ''}" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 9l6 6 6-6"/></svg></button><div class="faqAnswer${i === 0 ? '' : ' hidden'}">${esc(a)}</div></div>`).join('')}</div>
${authorCard()}
      <div class="ctaBand">
        <div class="ctaBandTitle">Turn your worst recurring incident into a one-minute runbook.</div>
        <p class="ctaBandSub">Bring the incident that always needs a war room. We will map it to an AlertMend runbook, alert to query to cloud to targeted fix to approval, and show it running with the guardrails on. The consultation is free and with no obligation.</p>
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
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"><defs><linearGradient id="hg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0b0b14"/><stop offset="1" stop-color="${ACCENT_DARK}"/></linearGradient></defs><rect width="1200" height="630" fill="url(#hg)"/><g transform="translate(80,80)"><circle cx="22" cy="22" r="22" fill="${ACCENT}"/><text x="22" y="30" font-size="22" font-weight="800" fill="#fff" text-anchor="middle">A</text><text x="56" y="30" font-size="24" font-weight="700" fill="#fff">AlertMend</text><text x="228" y="30" font-size="18" fill="#8b82b8">· automation &amp; runbooks</text></g><path d="${BOLT}" transform="translate(980,70) scale(6)" fill="${ACCENT}"/><text x="80" y="250" font-size="58" font-weight="800" fill="#fff">Runbook Automation</text><text x="80" y="316" font-size="33" font-weight="700" fill="${ACCENT}">Alert to fix, across your whole stack.</text><g font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="19"><rect x="80" y="368" width="1040" height="150" rx="14" fill="#12111f" stroke="#312b57"/><text x="108" y="406" fill="#a78bfa">chain</text><text x="300" y="406" fill="#e9e3ff">alert, query, AWS, kubectl, approval</text><text x="108" y="442" fill="#a78bfa">target</text><text x="300" y="442" fill="#e9e3ff">the exact affected pods, at runtime</text><text x="108" y="478" fill="#a78bfa">govern</text><text x="300" y="478" fill="#e9e3ff">Slack / WhatsApp approval + full audit</text></g><text x="80" y="566" font-size="19" fill="#8b82b8">alertmend.io · one runbook, one minute, with the guardrails on</text></svg>\n`
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
