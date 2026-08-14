import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import {
  AUTHOR_CRED_CSS,
  BLOG_SIGNUP_HANDLER_JS,
  CHROME_INLINE_CSS,
  DINESH_AUTHOR,
  SITE_URL,
  buildCredArticleHeader,
  buildNavHtml,
  buildSidebarHtml,
  calendlyUrl,
  dineshJsonLdAuthor,
  esc,
  getRelatedPosts,
  writeStaticBlogOutputs,
} from './static-blog-shared.mjs'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')

const slug = 'observability-vs-monitoring'
const title = 'Observability vs Monitoring: Key Differences'
const h1 = 'Observability vs Monitoring: What Is Actually Different'
const description = 'Observability vs monitoring explained: monitoring catches known failures, observability investigates the unknown. See the differences and when you need each.'
const publishedDate = '2026-08-14'
const modifiedDate = '2026-08-14'
const category = 'Observability'
const keywords = 'observability vs monitoring, monitoring vs observability, difference between observability and monitoring, is observability the same as monitoring, monitoring and observability, observability or monitoring, does observability replace monitoring, observability vs monitoring vs apm'
const canonical = `${SITE_URL}/blog/${slug}`
const calendly = calendlyUrl(slug)
const related = getRelatedPosts(slug, category)
const heroImage = `${SITE_URL}/assets/${slug}/hero.svg`
const styleHref = '/assets/exit-code-126/styles.css'
const scriptHref = '/assets/exit-code-126/script.js'
const author = {
  ...DINESH_AUTHOR,
  role: 'AI agent automation expert',
  credLine: '12+ years in cloud infrastructure and incident automation',
}

const faq = [
  {
    q: 'Is observability the same as monitoring?',
    a: 'No. Monitoring is the practice of watching a known set of signals for failure modes you predicted in advance. Observability is the broader ability to understand a system from its telemetry, including problems you did not predict. They overlap and work together, but they are not the same thing: monitoring tells you a known thing is broken, observability helps you understand why something novel is happening.',
  },
  {
    q: 'What is the difference between observability and monitoring?',
    a: 'The core difference is known-unknowns versus unknown-unknowns. Monitoring answers questions you defined ahead of time, like "is error rate above five percent," using pre-aggregated metrics and dashboards. Observability lets you ask new, open-ended questions after the fact, like "why are only logged-in users on one app version failing checkout," using high-cardinality, correlated logs, metrics, and traces.',
  },
  {
    q: 'Does observability replace monitoring?',
    a: 'No, it extends it. You still want monitoring: alerts on the symptoms you can predict, like a service being down or an SLO burning. Observability is what you reach for when an alert fires and you need to understand a failure nobody built a dashboard for. In practice, monitoring is one of the things you do with an observable system, so the two are complementary rather than competing.',
  },
  {
    q: 'Is monitoring part of observability?',
    a: 'Yes, in the modern view monitoring is an output of an observable system. If your system emits rich telemetry, monitoring is the layer that watches specific signals from it and alerts. So rather than "monitoring versus observability," it is more accurate to say monitoring is one capability that observability enables, alongside open-ended investigation.',
  },
  {
    q: 'What is the difference between observability, monitoring, and APM?',
    a: 'Monitoring watches predefined signals and alerts. APM (application performance monitoring) is a category of tooling focused on application performance, usually traces and app-level metrics. Observability is the broadest of the three: the capability to understand any part of the system, apps and infrastructure, from correlated telemetry, including unknown-unknowns. APM and monitoring are typically parts of an observability practice.',
  },
  {
    q: 'Do I need both monitoring and observability?',
    a: 'Yes. Monitoring gives you fast, reliable alerts on the failures you can anticipate, which is essential for on-call. Observability gives you the depth to investigate the failures you cannot anticipate, which is what actually resolves modern incidents. Teams that only monitor get paged but cannot explain why; teams that only explore have no alerting. You want both, ideally from the same telemetry.',
  },
  {
    q: 'Why is observability better for microservices and distributed systems?',
    a: 'Because failures in distributed systems are emergent and cross-service. A single user request touches many services, and the failure is often an unpredictable interaction between them. Predefined monitoring dashboards cannot anticipate every such failure. Observability, especially distributed tracing plus high-cardinality data, lets you follow a request across services and slice an incident by any dimension after it happens.',
  },
  {
    q: 'Can you have monitoring without observability?',
    a: 'Yes, and most legacy setups do: dashboards and threshold alerts on a handful of metrics, with no ability to ask new questions. It works for stable, well-understood systems, but it breaks down when a novel failure appears and the only data you have is the metrics you thought to collect in advance. Observability is what fills that gap.',
  },
  {
    q: 'Is observability just logs, metrics, and traces?',
    a: 'No. Logs, metrics, and traces are the primary data, but observability is the capability of understanding the system from that data, especially correlating the three to answer unanticipated questions. Collecting the three signals in disconnected tools does not make you observable; being able to pivot between them to explain any behavior does.',
  },
  {
    q: 'How do I move from monitoring to observability?',
    a: 'Keep your monitoring, then add depth. Instrument services with OpenTelemetry so you emit traces alongside metrics and logs, push high-cardinality attributes into traces and events rather than metric labels, correlate the three by trace ID, and shift alerting toward user-facing symptoms and SLOs. The goal is not to replace dashboards but to be able to investigate beyond them.',
  },
]

const howToSteps = [
  { name: 'Keep monitoring in place', text: 'Retain your alerts on predictable symptoms like service-down and SLO burn; observability adds to them rather than replacing them.' },
  { name: 'Add traces with OpenTelemetry', text: 'Instrument services to emit distributed traces alongside metrics and logs, without vendor lock-in.' },
  { name: 'Correlate the signals', text: 'Link logs, metrics, and traces by identifiers like trace ID so you can pivot between them during an investigation.' },
  { name: 'Alert on symptoms, explore for cause', text: 'Alert on user-facing symptoms and SLOs, and use open-ended queries over high-cardinality telemetry to find the cause.' },
]

const blogPosting = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: title,
  description,
  image: heroImage,
  datePublished: publishedDate,
  dateModified: modifiedDate,
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
  mainEntity: faq.map((item) => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: item.a } })),
}

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to move from monitoring to observability',
  description,
  step: howToSteps.map((step, index) => ({ '@type': 'HowToStep', position: index + 1, name: step.name, text: step.text })),
}

function authorCard() {
  return `
  <section class="authorBioCard" aria-label="About the author">
    <img src="/logos/dinesh.jpeg" alt="${esc(author.name)}" width="128" height="128" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
    <div class="authorBioFallback" aria-hidden="true">DA</div>
    <div class="authorBioContent">
      <h3>${esc(author.name)}</h3>
      <p class="authorBioRole">Cloud infrastructure and AI-driven incident automation</p>
      <div class="authorBioText">
        <p>${esc(author.name)} brings 12+ years of deep experience across cloud infrastructure and AI-driven automation, building systems that observe, diagnose, and recover from production incidents without waiting for a human.</p>
        <p>At AlertMend he works on AI agents that correlate telemetry into root cause and run governed recovery workflows across VMs, Kubernetes, CI/CD, and production services.</p>
      </div>
      <a class="authorBioLink" href="${author.linkedin}" target="_blank" rel="noopener noreferrer" aria-label="${esc(author.name)} on LinkedIn">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zM8.34 18V9.94H5.67V18h2.67zM7 8.76a1.55 1.55 0 1 0 0-3.1 1.55 1.55 0 0 0 0 3.1zM18.34 18v-4.42c0-2.37-1.27-3.47-2.96-3.47-1.36 0-1.97.75-2.31 1.28V9.94h-2.67V18h2.67v-4.5c0-.24.02-.48.09-.65.19-.48.63-.98 1.36-.98.96 0 1.35.73 1.35 1.8V18h2.82z"/></svg>
        <span>LinkedIn</span>
      </a>
    </div>
  </section>`
}

const content = `
${buildCredArticleHeader(h1, publishedDate, category, author)}
<div class="proofStrip" aria-label="Article verification">
  <strong>✓ A practical comparison grounded in OpenTelemetry and Google SRE definitions</strong>
  <span class="dot">•</span>
  <span>Last reviewed ${modifiedDate}</span>
</div>

<article class="ec126 obsvm">
  <section class="answerPanel" id="answer">
    <div class="answerGrid">
      <div class="tenSecond">
        <span class="eyebrow">The 30-second answer</span>
        <h2>Monitoring tells you something broke. Observability tells you why.</h2>
        <p><strong>Monitoring</strong> watches signals you defined in advance for failures you predicted, the known-unknowns. <strong>Observability</strong> lets you ask new questions about failures you did not predict, the unknown-unknowns. They are not rivals: monitoring is one thing you do with an observable system, and you want both.</p>
        <div class="quickCommandStack" aria-label="One-line contrast">
          <div class="quickCommand"><code>monitoring</code><span>known-unknowns, alerts</span></div>
          <div class="quickCommand"><code>observability</code><span>unknown-unknowns, questions</span></div>
          <div class="quickCommand"><code>both</code><span>detect, then explain</span></div>
        </div>
      </div>
      <div class="signalCard" aria-label="Monitoring alert vs observability query">
        <div class="terminalWindow">
          <div class="terminalChrome"><span></span><span></span><span></span></div>
          <div class="terminalBody">
            <div><span class="muted">monitoring</span> ALERT: error_rate above 5% on /checkout</div>
            <div><span class="muted">observability</span> why? errors grouped by version, region, route</div>
            <div><span class="good">&rarr;</span> v2.3 &middot; eu-west &middot; /checkout = 98% of errors</div>
          </div>
        </div>
        <div class="flowRail">
          <div class="flowNode"><strong>Monitor</strong><span>detects</span></div>
          <div class="flowArrow">&rarr;</div>
          <div class="flowNode"><strong>Observe</strong><span>explains</span></div>
          <div class="flowArrow">&rarr;</div>
          <div class="flowNode"><strong>Fix</strong><span>resolves</span></div>
        </div>
      </div>
    </div>
  </section>

  <nav class="tocPills" aria-label="On this page">
    <a href="#definitions">Definitions</a>
    <a href="#core">The core difference</a>
    <a href="#table">Side by side</a>
    <a href="#superset">Better monitoring?</a>
    <a href="#data">The data difference</a>
    <a href="#both">Do you need both?</a>
    <a href="#evolve">Monitoring to observability</a>
    <a href="#act">Beyond both</a>
    <a href="#faq">FAQ</a>
  </nav>

  <section class="sectionBlock" id="definitions">
    <h2 class="sectionTitle">Two quick definitions</h2>
    <p class="bodyText"><strong>Monitoring</strong> is collecting a predefined set of signals and watching them for conditions you decided matter in advance: is the service up, is latency above a threshold, is the disk filling. It is dashboards and alerts on known failure modes.</p>
    <p class="bodyText"><strong>Observability</strong> is the ability to understand a system's behavior from the outside using its telemetry, so you can answer questions you did not plan for. It is less a tool and more a property: a system is observable if its data lets you explain what it is doing, including novel failures.</p>
    <div class="answerBox"><strong>The trap:</strong> treating them as competing products to choose between. They operate at different levels. Monitoring is a practice; observability is a property of the system that makes good monitoring, and much more, possible.</div>
  </section>

  <section class="sectionBlock" id="core">
    <h2 class="sectionTitle">The core difference: known vs unknown</h2>
    <p class="bodyText">The cleanest way to separate them is the kind of problem each is built for. Monitoring handles <strong>known-unknowns</strong>: failures you can imagine ahead of time, so you build a dashboard and an alert for them. "The database might run out of connections" becomes a connection-pool alert.</p>
    <p class="bodyText">Observability handles <strong>unknown-unknowns</strong>: failures nobody imagined, so there was never a dashboard for them. "Checkout is slow, but only for returning users, on one app version, in one region, when a specific feature flag is on" is not something you pre-built an alert for. Observability lets you discover that shape after the incident starts, from data you were already collecting.</p>
    <div class="answerBox"><strong>Rule of thumb:</strong> if you could have predicted the failure, monitoring covers it. If you could not, you need observability. Modern, distributed systems produce far more of the second kind, which is why observability rose to prominence.</div>
  </section>

  <section class="sectionBlock" id="table">
    <h2 class="sectionTitle">Observability vs monitoring, side by side</h2>
    <div class="comparisonTableWrap">
      <table class="comparisonTable">
        <thead>
          <tr><th>Dimension</th><th>Monitoring</th><th>Observability</th></tr>
        </thead>
        <tbody>
          <tr>
            <td data-label="Dimension"><strong>Core question</strong></td>
            <td data-label="Monitoring">Is a known thing broken?</td>
            <td data-label="Observability">Why is this novel thing happening?</td>
          </tr>
          <tr>
            <td data-label="Dimension"><strong>Failure type</strong></td>
            <td data-label="Monitoring">Known-unknowns you predicted.</td>
            <td data-label="Observability">Unknown-unknowns you did not.</td>
          </tr>
          <tr>
            <td data-label="Dimension"><strong>How you use it</strong></td>
            <td data-label="Monitoring">Watch dashboards, receive alerts.</td>
            <td data-label="Observability">Ask open-ended, ad hoc questions.</td>
          </tr>
          <tr>
            <td data-label="Dimension"><strong>Data</strong></td>
            <td data-label="Monitoring">Pre-aggregated metrics on fixed dimensions.</td>
            <td data-label="Observability">High-cardinality, correlated logs, metrics, traces.</td>
          </tr>
          <tr>
            <td data-label="Dimension"><strong>Output</strong></td>
            <td data-label="Monitoring">Detection: something is wrong.</td>
            <td data-label="Observability">Explanation: here is why.</td>
          </tr>
          <tr>
            <td data-label="Dimension"><strong>Best for</strong></td>
            <td data-label="Monitoring">Stable, well-understood systems.</td>
            <td data-label="Observability">Distributed, fast-changing systems.</td>
          </tr>
          <tr>
            <td data-label="Dimension"><strong>Relationship</strong></td>
            <td data-label="Monitoring">A capability built on telemetry.</td>
            <td data-label="Observability">The property that enables monitoring and more.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <section class="sectionBlock" id="superset">
    <h2 class="sectionTitle">Is observability just better monitoring?</h2>
    <p class="bodyText">No, and the distinction matters. "Better monitoring" would mean more dashboards and more alerts. Observability is a different capability: open-ended investigation of things you never dashboarded. You can have a wall of dashboards and still not be observable, if the underlying data cannot answer a new question.</p>
    <p class="bodyText">The more accurate framing is that <strong>monitoring is a subset of what observability enables</strong>. Once a system emits rich, correlated telemetry, monitoring is the layer that watches specific signals from it and alerts. So the two are not on the same axis: one is a practice, the other is a property that makes the practice, and ad hoc investigation, possible.</p>
    <div class="answerBox"><strong>Put differently:</strong> monitoring is asking a question you already wrote down. Observability is being able to ask a question you only thought of during the incident.</div>
  </section>

  <section class="sectionBlock" id="data">
    <h2 class="sectionTitle">Why the data is the real dividing line</h2>
    <p class="bodyText">The capability gap comes down to the data each relies on. Monitoring usually runs on <strong>pre-aggregated metrics</strong>: cheap, fast, and perfect for trends and alerts, but aggregated on a fixed set of dimensions you chose in advance. Once aggregated, the detail is gone, so you cannot slice by a dimension you did not plan for.</p>
    <p class="bodyText">Observability depends on <strong>high-cardinality, correlated telemetry</strong>: traces, wide events, and logs that carry many attributes per record, like user ID, version, region, and feature flag. Because the detail is preserved, you can group and filter by any of those after the fact, which is exactly what answering an unknown-unknown requires. That richness is also why observability costs more to store and is a real engineering trade-off.</p>
    <div class="answerBox"><strong>The one-liner:</strong> monitoring throws away detail to be cheap and fast; observability keeps detail so you can ask new questions. Neither is wrong; they serve different jobs.</div>
  </section>

  <section class="sectionBlock" id="both">
    <h2 class="sectionTitle">Do you need both? Yes, and here is how they combine</h2>
    <p class="bodyText">This is not a choice. In a healthy setup they hand off to each other during every incident.</p>
    <div class="stepsGrid">
      <div class="stepCard">
        <span>1</span>
        <h3>Monitoring detects</h3>
        <p>An SLO burns or an alert on a user-facing symptom fires. This is the fast, reliable "wake someone up" layer, and it should stay.</p>
      </div>
      <div class="stepCard">
        <span>2</span>
        <h3>Observability explains</h3>
        <p>The on-call engineer opens the telemetry, follows the trace, and slices the errors by version and region to find the actual cause, including one nobody predicted.</p>
      </div>
      <div class="stepCard">
        <span>3</span>
        <h3>You fix and learn</h3>
        <p>The fix ships, and the new failure mode you just discovered can become a monitored signal, so next time it is a known-unknown.</p>
      </div>
      <div class="stepCard">
        <span>4</span>
        <h3>The loop tightens</h3>
        <p>Over time, more failures move from "we had to investigate" to "we alert on it directly," while observability stays ready for the next novel one.</p>
      </div>
    </div>
    <div class="answerBox"><strong>Anti-pattern:</strong> alerting on everything observability can see. Keep alerts on symptoms that matter to users; use observability for the open-ended investigation. Alerting on every cause just recreates alert fatigue.</div>
  </section>

  <section class="sectionBlock" id="evolve">
    <h2 class="sectionTitle">Moving from monitoring to observability</h2>
    <p class="bodyText">You do not rip out monitoring; you add depth underneath it. A practical path:</p>
    <div class="stepsGrid">
      <div class="stepCard">
        <span>1</span>
        <h3>Keep your alerts</h3>
        <p>Retain the alerts on predictable symptoms. They are your on-call safety net and cost little to keep.</p>
      </div>
      <div class="stepCard">
        <span>2</span>
        <h3>Add traces via OpenTelemetry</h3>
        <p>Instrument services to emit distributed traces alongside metrics and logs, using OpenTelemetry so you avoid vendor lock-in.</p>
      </div>
      <div class="stepCard">
        <span>3</span>
        <h3>Move cardinality to traces and events</h3>
        <p>Put high-cardinality attributes like user and request IDs into traces and wide events, not metric labels, to keep costs sane.</p>
      </div>
      <div class="stepCard">
        <span>4</span>
        <h3>Correlate and shift alerting to SLOs</h3>
        <p>Link the three signals by trace ID, and move alerting toward user-facing symptoms and SLOs rather than every internal metric.</p>
      </div>
    </div>
    <div class="ctaInline" style="margin:1.5rem 0;padding:15px 18px;border-left:3px solid #7c3aed;border-radius:0 10px 10px 0;background:#f6f4ff;font-weight:600;color:#27272a;">New to the concept? Start with the foundation: <a href="/blog/what-is-observability" style="color:#7c3aed;">What Is Observability?</a></div>
  </section>

  <section class="sectionBlock" id="act">
    <h2 class="sectionTitle">Beyond both: acting on what you find</h2>
    <p class="bodyText">Here is the shared limit. Monitoring detects, observability explains, but a human still has to read it all and run the fix. On a distributed system at 2 a.m., that manual step is the slow part. The next layer closes the loop: correlate the telemetry into a probable root cause automatically, then run the governed remediation.</p>
    <div class="alertmendFlow">
      <h3>Detect, explain, then act</h3>
      <p>AlertMend sits on top of your monitoring and observability and adds the step after "here is why."</p>
      <div class="recoveryTrack">
        <div class="recoveryStep"><strong>Monitor</strong><span>An alert or SLO burn flags a user-facing symptom.</span></div>
        <div class="recoveryArrow">&rarr;</div>
        <div class="recoveryStep"><strong>Observe + correlate</strong><span>AI ties the telemetry, the recent deploy, and the topology into a probable root cause instead of a wall of alerts.</span></div>
        <div class="recoveryArrow">&rarr;</div>
        <div class="recoveryStep"><strong>Act</strong><span>A runbook restarts, rolls back, or cleans up, with an approval gate where the action is destructive.</span></div>
        <div class="recoveryArrow">&rarr;</div>
        <div class="recoveryStep"><strong>Verify</strong><span>Confirm the symptom cleared and attach the root cause and actions to the incident.</span></div>
      </div>
    </div>
    <div class="automationCta">
      <p><strong>Have both monitoring and observability and still firefighting by hand?</strong> Bring one recurring incident and we will map the signals, the root-cause correlation, and the first safe auto-remediation runbook.</p>
      <a class="ctaButton ctaButtonPrimary" href="${calendly}&intent=automation-review" target="_blank" rel="noopener noreferrer">Book a 20-min automation review &rarr;</a>
    </div>
  </section>

  <section class="sectionBlock" id="sources">
    <h2 class="sectionTitle">Primary sources</h2>
    <p class="bodyText">Grounded in the primary literature rather than a single vendor's framing.</p>
    <ol class="sourceList">
      <li><a href="https://opentelemetry.io/docs/concepts/observability-primer/" target="_blank" rel="noopener noreferrer">OpenTelemetry: observability primer</a></li>
      <li><a href="https://sre.google/sre-book/monitoring-distributed-systems/" target="_blank" rel="noopener noreferrer">Google SRE Book: monitoring distributed systems</a></li>
      <li><a href="https://sre.google/workbook/alerting-on-slos/" target="_blank" rel="noopener noreferrer">Google SRE Workbook: alerting on SLOs</a></li>
      <li><a href="/blog/what-is-observability">AlertMend: What Is Observability? (the foundation)</a></li>
    </ol>
  </section>

  <section class="sectionBlock" id="faq">
    <h2 class="sectionTitle">Observability vs monitoring FAQ</h2>
    <div class="faqList">
    ${faq.map((item, index) => `
      <div class="faqItem">
        <button type="button" class="faqQuestion" data-faq-toggle aria-expanded="${index === 0 ? 'true' : 'false'}">
          ${esc(item.q)}
          <svg class="faqChevron${index === 0 ? ' faqChevronOpen' : ''}" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
        </button>
        <div class="faqAnswer${index === 0 ? '' : ' hidden'}">${esc(item.a)}</div>
      </div>
    `).join('')}
    </div>
  </section>

  <section class="ctaBox">
    <h2>Detection and explanation are not the finish line. Resolution is.</h2>
    <p>AlertMend sits on top of your monitoring and observability, correlates telemetry into a root cause, and runs governed auto-remediation across VMs, Kubernetes, and production services.</p>
    <div class="ctaButtons">
      <a class="ctaButton ctaButtonPrimary" href="${calendly}" target="_blank" rel="noopener noreferrer">Book a reliability review</a>
      <a class="ctaButton ctaButtonSecondary" href="/auto-remediation">See automated remediation</a>
    </div>
  </section>
  ${authorCard()}
</article>`

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)} | AlertMend AI</title>
  <meta name="description" content="${esc(description)}">
  <meta name="keywords" content="${esc(keywords)}">
  <meta name="author" content="${esc(author.name)}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
  <link rel="canonical" href="${canonical}">
  <link rel="icon" type="image/svg+xml" href="/logos/alertmend-logo.svg">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${canonical}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:image" content="${heroImage}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${heroImage}">
  <script type="application/ld+json">${JSON.stringify(blogPosting)}</script>
  <script type="application/ld+json">${JSON.stringify(faqJsonLd)}</script>
  <script type="application/ld+json">${JSON.stringify(howToJsonLd)}</script>
  <link rel="stylesheet" href="${styleHref}">
  <style>${CHROME_INLINE_CSS}${AUTHOR_CRED_CSS}</style>
</head>
<body>
${buildNavHtml(slug, calendly)}
  <div class="main-container">
    <div class="content-wrapper">
      <div class="main-col">
        ${content}
        <div class="promo">
          <p>Ready to turn detection and explanation into resolved incidents?</p>
          <p>See how AlertMend AI correlates telemetry into root cause and automates safe remediation across Kubernetes, VMs, and CI/CD. <a href="${calendly}" target="_blank" rel="noopener noreferrer">Book a demo. &rarr;</a></p>
        </div>
      </div>
      ${buildSidebarHtml(related, title)}
    </div>
  </div>
  <script src="${scriptHref}"></script>
  <script>${BLOG_SIGNUP_HANDLER_JS}</script>
</body>
</html>`

const heroSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"><defs><linearGradient id="hg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0e0b1e"/><stop offset="1" stop-color="#2a1163"/></linearGradient></defs><rect width="1200" height="630" fill="url(#hg)"/><g transform="translate(80,80)"><circle cx="22" cy="22" r="22" fill="#7c3aed"/><text x="22" y="30" font-size="22" font-weight="800" fill="#fff" text-anchor="middle">A</text><text x="56" y="30" font-size="24" font-weight="700" fill="#fff">AlertMend</text><text x="228" y="30" font-size="18" fill="#b9a7e6">· observability</text></g><text x="80" y="248" font-size="56" font-weight="800" fill="#fff">Observability vs Monitoring</text><text x="80" y="312" font-size="30" font-weight="700" fill="#a78bfa">Detection tells you what. Explanation tells you why.</text><g font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="19"><rect x="80" y="364" width="1040" height="152" rx="14" fill="#170f2e" stroke="#3b2a63"/><text x="106" y="402" fill="#c4b5fd">monitoring</text><text x="360" y="402" fill="#e7defb">known-unknowns, alerts, dashboards</text><text x="106" y="438" fill="#c4b5fd">observability</text><text x="360" y="438" fill="#e7defb">unknown-unknowns, open questions</text><text x="106" y="476" fill="#c4b5fd">both</text><text x="360" y="476" fill="#e7defb">detect first, then explain, then fix</text></g><text x="80" y="566" font-size="19" fill="#b9a7e6">alertmend.io · the real difference, and why you need both</text></svg>\n`

const assetDir = path.join(root, 'public/assets', slug)
fs.mkdirSync(assetDir, { recursive: true })
fs.writeFileSync(path.join(assetDir, 'hero.svg'), heroSvg)

fs.writeFileSync(path.join(root, 'public/blog', `${slug}.md`), `---
title: "${title}"
excerpt: "${description}"
date: "${publishedDate}"
dateModified: "${modifiedDate}"
category: "${category}"
author: "${author.name}"
keywords: "${keywords}"
---

This post is published as a standalone page at [/blog/${slug}](/blog/${slug}).
`)

writeStaticBlogOutputs(slug, html)
const tl = title.length + 15
console.log(`✓ ${slug}  title+suffix ${tl}${tl < 30 || tl > 60 ? ' [LEN!]' : ''}  desc ${description.length}  faqs ${faq.length}`)
