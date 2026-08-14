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

const slug = 'what-is-observability'
const title = 'What Is Observability? A Complete Guide'
const h1 = 'What Is Observability? The Complete Guide to Logs, Metrics, and Traces'
const description = 'Observability means understanding a system from its telemetry. Learn the three pillars, logs, metrics, and traces, and how it differs from monitoring.'
const publishedDate = '2026-08-14'
const modifiedDate = '2026-08-14'
const category = 'Observability'
const keywords = 'what is observability, observability, observability vs monitoring, three pillars of observability, logs metrics traces, observability tools, opentelemetry, observability meaning, observability explained, distributed tracing, telemetry, observability engineering'
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

const PILLAR_CSS = `
.pillarGrid{display:grid;grid-template-columns:1fr;gap:14px;margin:1.25rem 0 .5rem;}
@media(min-width:820px){.pillarGrid{grid-template-columns:repeat(3,1fr);}}
.pillarCard{padding:18px;border:1px solid #e4e4e7;border-radius:14px;background:#fff;border-top:3px solid #7c3aed;}
.pillarCard h3{margin:0 0 2px;font-size:1.1rem;color:#18181b;}
.pillarCard .pillarQ{display:block;font-size:.78rem;font-weight:700;color:#7c3aed;margin-bottom:.6rem;text-transform:uppercase;letter-spacing:.04em;}
.pillarCard p{margin:0 0 .6rem;color:#3f3f46;font-size:.9rem;line-height:1.6;}
.pillarCard .pillarMeta{font-size:.8rem;color:#71717a;}
.pillarCard .pillarMeta b{color:#3f3f46;}
`

const faq = [
  {
    q: 'What is observability?',
    a: 'Observability is the ability to understand what is happening inside a system from the outside, using the data it emits. In software, that data is its telemetry: logs, metrics, and traces. A system is observable when you can answer new questions about its behavior, including ones you did not anticipate, without shipping new code to instrument for them.',
  },
  {
    q: 'What is the difference between observability and monitoring?',
    a: 'Monitoring watches a known set of metrics and dashboards for known failure modes, the "known-unknowns" you predicted in advance. Observability is the broader capability to explore and ask arbitrary questions about novel problems, the "unknown-unknowns" you did not predict. Monitoring tells you that something is wrong; observability helps you understand why. Monitoring is really an output of an observable system, not a competitor to it.',
  },
  {
    q: 'What are the three pillars of observability?',
    a: 'Logs, metrics, and traces. Logs are discrete, timestamped records of events. Metrics are numeric measurements aggregated over time, like request rate or error count. Traces follow a single request as it moves across services, showing where time was spent and where it failed. Each answers a different question, and correlating all three is what makes a distributed system debuggable.',
  },
  {
    q: 'Is observability just logs, metrics, and traces?',
    a: 'Those are the primary data types, but observability is the capability they enable, not the data itself. Modern practice also uses events and wide, high-cardinality records, plus continuous profiling for code-level performance. The point is not collecting three signals; it is being able to correlate them to answer any question about the system.',
  },
  {
    q: 'What is OpenTelemetry?',
    a: 'OpenTelemetry (OTel) is a vendor-neutral open standard, hosted by the CNCF, for generating and collecting telemetry. It provides one set of SDKs and a collector for traces, metrics, and logs, so you instrument your code once and send the data to any compatible backend. Its main value is avoiding vendor lock-in and standardizing instrumentation across a polyglot stack.',
  },
  {
    q: 'What is the difference between observability and APM?',
    a: 'Application Performance Monitoring (APM) is a category of tooling focused on application performance, typically traces and app-level metrics. Observability is the broader capability across logs, metrics, traces, and events, spanning applications and infrastructure, and aimed at unknown-unknowns rather than a fixed set of performance dashboards. APM is usually one part of a wider observability practice.',
  },
  {
    q: 'What is telemetry?',
    a: 'Telemetry is the raw data a system emits about itself: logs, metrics, traces, and events. Telemetry is the input; observability is what you get when that data is collected, correlated, and made queryable so you can understand the system. You cannot have observability without telemetry, but telemetry alone, sitting uncorrelated in silos, does not make a system observable.',
  },
  {
    q: 'Why is observability important?',
    a: 'Modern systems are distributed, dynamic, and complex: microservices, containers, Kubernetes, and cloud infrastructure fail in novel, emergent ways that no dashboard was built to catch. Observability lets teams debug problems they did not anticipate, understand behavior across service boundaries, and cut mean time to resolution. Without it, every new failure is an archaeology project.',
  },
  {
    q: 'How do I implement observability?',
    a: 'Instrument your services to emit telemetry, ideally with OpenTelemetry so you are not locked to one vendor. Collect the data with an agent or an OTel collector, store it in a backend, and use that backend to query, visualize, and alert. Start with the highest-value signals for your most critical services, standardize naming and labels, and expand from there rather than trying to instrument everything at once.',
  },
  {
    q: 'What is high cardinality, and why does it matter for observability?',
    a: 'Cardinality is the number of unique values a field can take. A status code is low cardinality; a user ID or request ID is high cardinality. High-cardinality data is what lets you slice an incident down to the exact customer or request, which is enormously powerful for debugging, but it is also expensive to store and index. Managing that cost versus query power is one of the central challenges of running observability at scale.',
  },
  {
    q: 'What is an observability platform?',
    a: 'An observability platform ingests, stores, correlates, and lets you query telemetry across your stack, with dashboards, alerting, and open-ended exploration over logs, metrics, and traces. The best ones unify the three pillars so you can pivot from a metric spike to the traces behind it to the logs of the failing request, instead of switching between disconnected tools.',
  },
  {
    q: 'What comes after observability?',
    a: 'Closing the loop. Observability tells you what is wrong and helps you find why, but a human still has to read it and act. The next step is using AI to correlate the telemetry into a probable root cause automatically, and automation to run the governed fix, restart, roll back, or clean up, with an approval gate where the risk is real. Observability is the input to that loop; auto-remediation is the output.',
  },
]

const howToSteps = [
  { name: 'Instrument', text: 'Add telemetry to your services with OpenTelemetry so they emit traces, metrics, and logs without vendor lock-in.' },
  { name: 'Collect', text: 'Gather the telemetry with an agent or an OpenTelemetry collector and forward it to a backend.' },
  { name: 'Store and correlate', text: 'Store the signals in a backend that links traces, metrics, and logs so you can pivot between them.' },
  { name: 'Query, visualize, alert', text: 'Explore the data to answer new questions, build dashboards, and alert on the symptoms that matter.' },
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
  name: 'How to implement observability',
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
  <strong>✓ Grounded in OpenTelemetry, CNCF, and Google SRE definitions of observability</strong>
  <span class="dot">•</span>
  <span>Last reviewed ${modifiedDate}</span>
</div>

<article class="ec126 obs">
  <section class="answerPanel" id="answer">
    <div class="answerGrid">
      <div class="tenSecond">
        <span class="eyebrow">The 30-second answer</span>
        <h2>Observability is understanding a system from the outside in.</h2>
        <p><strong>Observability</strong> is the ability to understand what is happening inside a system using the data it emits, its <strong>telemetry</strong>. A system is observable when you can answer new questions about its behavior, even ones you did not plan for, without shipping new code. Its raw material is the three pillars: logs, metrics, and traces.</p>
        <div class="quickCommandStack" aria-label="Observability in one line">
          <div class="quickCommand"><code>logs</code><span>what happened</span></div>
          <div class="quickCommand"><code>metrics</code><span>how much, how often</span></div>
          <div class="quickCommand"><code>traces</code><span>where the request went</span></div>
        </div>
      </div>
      <div class="signalCard" aria-label="The three telemetry signals">
        <div class="terminalWindow">
          <div class="terminalChrome"><span></span><span></span><span></span></div>
          <div class="terminalBody">
            <div><span class="muted">log</span> ERROR order-svc payment_failed order=8213 reason="declined"</div>
            <div><span class="muted">metric</span> http_requests_total{route="/checkout",status="500"} 1284</div>
            <div><span class="muted">trace</span> checkout 240ms &rarr; payment <span class="error">180ms SLOW</span></div>
          </div>
        </div>
        <div class="flowRail">
          <div class="flowNode"><strong>Collect</strong><span>telemetry</span></div>
          <div class="flowArrow">&rarr;</div>
          <div class="flowNode"><strong>Correlate</strong><span>the signals</span></div>
          <div class="flowArrow">&rarr;</div>
          <div class="flowNode"><strong>Answer</strong><span>any question</span></div>
        </div>
      </div>
    </div>
  </section>

  <nav class="tocPills" aria-label="On this page">
    <a href="#definition">Definition</a>
    <a href="#vs-monitoring">vs Monitoring</a>
    <a href="#pillars">The 3 pillars</a>
    <a href="#how">How it works</a>
    <a href="#otel">OpenTelemetry</a>
    <a href="#why">Why it matters</a>
    <a href="#challenges">Challenges</a>
    <a href="#act">Beyond observing</a>
    <a href="#faq">FAQ</a>
  </nav>

  <section class="sectionBlock" id="definition">
    <h2 class="sectionTitle">What observability actually means</h2>
    <p class="bodyText">The word comes from control theory, where a system is <strong>observable</strong> if you can infer its complete internal state from its external outputs. Applied to software, that translates cleanly: a system is observable when its telemetry lets you understand its internal behavior from the outside, without attaching a debugger or adding new instrumentation for every new question.</p>
    <p class="bodyText">The emphasis on <em>new questions</em> is the whole point. Traditional tooling is built to answer questions you already knew to ask, such as "is CPU above 90 percent." Observability is built for the questions you could not have predicted: "why are checkout requests from one region on one app version failing only for logged-in users." A truly observable system lets you ask that question after the fact and get an answer from data you already have.</p>
    <div class="answerBox">
      <strong>In one sentence:</strong> observability is the property of being able to explain a system's behavior from its telemetry, especially for problems nobody anticipated.
    </div>
  </section>

  <section class="sectionBlock" id="vs-monitoring">
    <h2 class="sectionTitle">Observability vs monitoring: the real difference</h2>
    <p class="bodyText">This is the most common point of confusion, and the distinction is about <strong>known-unknowns versus unknown-unknowns</strong>. Monitoring watches a predefined set of signals for failure modes you predicted. Observability lets you investigate failures you did not predict. They are not rivals: monitoring is one thing you do with an observable system.</p>
    <div class="comparisonTableWrap">
      <table class="comparisonTable">
        <thead>
          <tr><th>Aspect</th><th>Monitoring</th><th>Observability</th></tr>
        </thead>
        <tbody>
          <tr>
            <td data-label="Aspect"><strong>Answers</strong></td>
            <td data-label="Monitoring">Is a known thing broken?</td>
            <td data-label="Observability">Why is this novel thing happening?</td>
          </tr>
          <tr>
            <td data-label="Aspect"><strong>Handles</strong></td>
            <td data-label="Monitoring">Known-unknowns (predicted failures).</td>
            <td data-label="Observability">Unknown-unknowns (emergent failures).</td>
          </tr>
          <tr>
            <td data-label="Aspect"><strong>Interaction</strong></td>
            <td data-label="Monitoring">Watch dashboards and alerts.</td>
            <td data-label="Observability">Ask open-ended, ad hoc questions.</td>
          </tr>
          <tr>
            <td data-label="Aspect"><strong>Data</strong></td>
            <td data-label="Monitoring">Pre-aggregated metrics on set dimensions.</td>
            <td data-label="Observability">High-cardinality, correlated telemetry.</td>
          </tr>
          <tr>
            <td data-label="Aspect"><strong>When it shines</strong></td>
            <td data-label="Monitoring">Stable, well-understood systems.</td>
            <td data-label="Observability">Distributed, fast-changing systems.</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="answerBox"><strong>The short version:</strong> monitoring tells you <em>that</em> something is wrong. Observability helps you understand <em>why</em>. You need both, and monitoring works best as an output of an observable system rather than a separate silo.</div>
    <p class="bodyText" style="margin-top:1rem;">Want the full breakdown? See the dedicated comparison: <a href="/blog/observability-vs-monitoring">Observability vs Monitoring: Key Differences</a>.</p>
  </section>

  <section class="sectionBlock" id="pillars">
    <h2 class="sectionTitle">The three pillars: logs, metrics, and traces</h2>
    <p class="bodyText">Observability rests on three primary kinds of telemetry. None is sufficient alone; the power comes from correlating them, pivoting from a metric spike to the traces behind it to the logs of the exact failing request.</p>
    <div class="pillarGrid">
      <div class="pillarCard">
        <h3>Logs</h3>
        <span class="pillarQ">What happened</span>
        <p>Discrete, timestamped records of individual events, from a request line to a stack trace. The most detailed signal, and the most flexible.</p>
        <p class="pillarMeta"><b>Strength:</b> rich context per event. <b>Limit:</b> high volume and cost, hard to aggregate.</p>
      </div>
      <div class="pillarCard">
        <h3>Metrics</h3>
        <span class="pillarQ">How much, how often</span>
        <p>Numeric measurements aggregated over time, such as request rate, error count, latency percentiles, and saturation. Cheap to store and fast to query.</p>
        <p class="pillarMeta"><b>Strength:</b> efficient, great for trends and alerts. <b>Limit:</b> aggregated, so no per-request detail.</p>
      </div>
      <div class="pillarCard">
        <h3>Traces</h3>
        <span class="pillarQ">Where the request went</span>
        <p>The end-to-end path of a single request across services, with timing for each hop (span). Essential for distributed systems and microservices.</p>
        <p class="pillarMeta"><b>Strength:</b> shows cross-service latency and failures. <b>Limit:</b> often sampled, needs instrumentation.</p>
      </div>
    </div>
    <div class="answerBox"><strong>Beyond the three:</strong> modern practice adds <strong>events</strong> (meaningful state changes), <strong>continuous profiling</strong> (code-level CPU and memory hotspots), and <strong>wide, high-cardinality records</strong> that carry many attributes per event. The three pillars are the foundation, not the ceiling.</div>
  </section>

  <section class="sectionBlock" id="how">
    <h2 class="sectionTitle">How observability works, end to end</h2>
    <p class="bodyText">An observability practice is a pipeline from your running code to a question answered. The stages are the same whether you self-host or buy a platform.</p>
    <div class="stepsGrid">
      <div class="stepCard">
        <span>1</span>
        <h3>Instrument</h3>
        <p>Your services emit telemetry, ideally through <strong>OpenTelemetry</strong> so the instrumentation is not tied to one vendor. Auto-instrumentation covers common frameworks; manual spans cover your business logic.</p>
      </div>
      <div class="stepCard">
        <span>2</span>
        <h3>Collect</h3>
        <p>An agent or an OpenTelemetry <strong>collector</strong> receives, batches, and routes the data, adding metadata like service, environment, and version along the way.</p>
      </div>
      <div class="stepCard">
        <span>3</span>
        <h3>Store and correlate</h3>
        <p>A backend stores logs, metrics, and traces and, crucially, links them by identifiers like trace ID so you can pivot between the three instead of searching them separately.</p>
      </div>
      <div class="stepCard">
        <span>4</span>
        <h3>Query, visualize, alert</h3>
        <p>You explore the data to answer new questions, build dashboards for the known ones, and alert on the symptoms that actually matter to users.</p>
      </div>
    </div>
  </section>

  <section class="sectionBlock" id="otel">
    <h2 class="sectionTitle">OpenTelemetry: the standard that ties it together</h2>
    <p class="bodyText"><strong>OpenTelemetry (OTel)</strong> is the vendor-neutral, CNCF-hosted standard for generating and collecting telemetry. It gives you one set of SDKs and a collector for traces, metrics, and logs, so you <em>instrument once and export anywhere</em>. That matters because it decouples the expensive, invasive part (adding instrumentation to your code) from the replaceable part (the backend you send it to).</p>
    <div class="answerBox"><strong>Why teams standardize on it:</strong> no vendor lock-in, consistent instrumentation across a polyglot stack, a large ecosystem of auto-instrumentation, and the freedom to change or mix backends without re-instrumenting every service. It has become the default answer to "how should we instrument."</div>
  </section>

  <section class="sectionBlock" id="why">
    <h2 class="sectionTitle">Why observability matters now</h2>
    <p class="bodyText">A decade ago, a monolith on a few servers could be understood with logs and a handful of dashboards. Today the same product runs as dozens of services across containers, Kubernetes, queues, and managed cloud dependencies, deployed many times a day. Failures are no longer a single crashed process; they are emergent, cross-service, and often novel.</p>
    <div class="stepsGrid">
      <div class="stepCard">
        <span>1</span>
        <h3>Distributed complexity</h3>
        <p>A single user request can touch a dozen services. Without traces, you cannot tell which hop was slow or which one failed.</p>
      </div>
      <div class="stepCard">
        <span>2</span>
        <h3>Unknown-unknowns</h3>
        <p>Most production incidents are things nobody built a dashboard for. Observability lets you investigate them after the fact from existing data.</p>
      </div>
      <div class="stepCard">
        <span>3</span>
        <h3>Faster resolution</h3>
        <p>Correlated telemetry turns an incident from a multi-team archaeology dig into a guided investigation, which directly cuts mean time to resolution.</p>
      </div>
      <div class="stepCard">
        <span>4</span>
        <h3>Confidence to ship</h3>
        <p>When you can see the effect of a deploy in real time, you release more often and roll back precisely instead of guessing.</p>
      </div>
    </div>
  </section>

  <section class="sectionBlock" id="challenges">
    <h2 class="sectionTitle">The hard parts nobody warns you about</h2>
    <p class="bodyText">Observability is powerful, but it is not free, and the common failure mode is drowning in data you never query.</p>
    <div class="fixTableWrap">
      <table class="fixTable">
        <thead>
          <tr><th>Challenge</th><th>What goes wrong</th><th>How teams manage it</th></tr>
        </thead>
        <tbody>
          <tr>
            <td data-label="Challenge"><strong>Data volume and cost</strong></td>
            <td data-label="Wrong">Telemetry bills rival compute bills; teams store everything and query little.</td>
            <td data-label="Manage">Sample traces, set retention by value, and drop low-signal logs.</td>
          </tr>
          <tr>
            <td data-label="Challenge"><strong>Cardinality explosion</strong></td>
            <td data-label="Wrong">High-cardinality labels blow up metric storage and slow queries.</td>
            <td data-label="Manage">Keep high cardinality in traces and events, not in metric labels.</td>
          </tr>
          <tr>
            <td data-label="Challenge"><strong>Tool sprawl</strong></td>
            <td data-label="Wrong">Logs, metrics, and traces live in three disconnected tools, so nobody can pivot between them.</td>
            <td data-label="Manage">Correlate by trace ID and consolidate onto fewer, linked backends.</td>
          </tr>
          <tr>
            <td data-label="Challenge"><strong>Alert fatigue</strong></td>
            <td data-label="Wrong">Alerting on causes instead of symptoms buries the real signal in noise.</td>
            <td data-label="Manage">Alert on user-facing symptoms and SLOs, not every metric.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <section class="sectionBlock" id="act">
    <h2 class="sectionTitle">Beyond observing: correlating and acting</h2>
    <p class="bodyText">Here is the honest limit of observability on its own: it produces understanding, but a human still has to read the dashboards, connect the signals, decide the cause, and run the fix. On a distributed system at 2 a.m., that human step is the slow, error-prone part. The next evolution is to close that loop.</p>
    <div class="alertmendFlow">
      <h3>From telemetry to a governed fix</h3>
      <p>Observability is the input. AI correlation and automation are what turn it into a resolved incident.</p>
      <div class="recoveryTrack">
        <div class="recoveryStep"><strong>Observe</strong><span>Logs, metrics, and traces show a symptom: errors up, a service degraded, a pod restarting.</span></div>
        <div class="recoveryArrow">&rarr;</div>
        <div class="recoveryStep"><strong>Correlate</strong><span>AI ties the signals, the recent deploy, and the topology into a probable root cause, instead of a wall of alerts.</span></div>
        <div class="recoveryArrow">&rarr;</div>
        <div class="recoveryStep"><strong>Act</strong><span>A runbook restarts, rolls back, or cleans up, with an approval gate where the action is destructive.</span></div>
        <div class="recoveryArrow">&rarr;</div>
        <div class="recoveryStep"><strong>Verify</strong><span>Confirm the symptom cleared and attach the root cause and actions to the incident record.</span></div>
      </div>
    </div>
    <p class="bodyText">This is where <strong>AlertMend</strong> fits. It sits on top of the observability you already have, correlates the telemetry into root cause, and runs governed remediation, so the loop from "something is wrong" to "it is fixed" does not depend on a human being awake and staring at a dashboard. Observability answers <em>what and why</em>. Automation supplies the <em>and then it was fixed</em>.</p>
    <div class="automationCta">
      <p><strong>Already have observability but still firefighting by hand?</strong> Bring one recurring incident and we will map the signals, the root-cause correlation, and the first safe auto-remediation runbook.</p>
      <a class="ctaButton ctaButtonPrimary" href="${calendly}&intent=automation-review" target="_blank" rel="noopener noreferrer">Book a 20-min automation review &rarr;</a>
    </div>
  </section>

  <section class="sectionBlock" id="learn-more">
    <h2 class="sectionTitle">Go deeper</h2>
    <p class="bodyText">This is the foundation. To put it into practice on real stacks, these go one level down:</p>
    <ul class="sourceList">
      <li><a href="/blog/best-1-click-logging-and-metrics-tools">Best logging and metrics tools</a>, for choosing the pillars in practice.</li>
      <li><a href="/blog/opentelemetry-collector-monitoring">OpenTelemetry Collector monitoring</a>, for running the collection layer itself.</li>
      <li><a href="/blog/ai-agent-observability-in-production">AI agent observability in production</a>, for observing LLM and agent workloads.</li>
      <li><a href="/blog/small-fleet-observability-few-clicks">VM and container observability setup</a>, for a fast start on a small fleet.</li>
      <li><a href="/blog/centralized-logging-kubernetes-vms">Centralized logging for Kubernetes and VMs</a>, for the logs pillar at scale.</li>
    </ul>
  </section>

  <section class="sectionBlock" id="sources">
    <h2 class="sectionTitle">Primary sources</h2>
    <p class="bodyText">The definitions above follow the primary literature, not a single vendor's framing.</p>
    <ol class="sourceList">
      <li><a href="https://opentelemetry.io/docs/concepts/observability-primer/" target="_blank" rel="noopener noreferrer">OpenTelemetry: observability primer</a></li>
      <li><a href="https://opentelemetry.io/docs/concepts/signals/" target="_blank" rel="noopener noreferrer">OpenTelemetry: traces, metrics, and logs</a></li>
      <li><a href="https://sre.google/sre-book/monitoring-distributed-systems/" target="_blank" rel="noopener noreferrer">Google SRE Book: monitoring distributed systems</a></li>
      <li><a href="https://www.cncf.io/projects/opentelemetry/" target="_blank" rel="noopener noreferrer">CNCF: the OpenTelemetry project</a></li>
    </ol>
  </section>

  <section class="sectionBlock" id="faq">
    <h2 class="sectionTitle">Observability FAQ</h2>
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
    <h2>Observability tells you what is wrong. We help you fix it.</h2>
    <p>AlertMend sits on top of your existing observability, correlates logs, metrics, and traces into a root cause, and runs governed auto-remediation across VMs, Kubernetes, and production services.</p>
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
  <style>${CHROME_INLINE_CSS}${AUTHOR_CRED_CSS}${PILLAR_CSS}</style>
</head>
<body>
${buildNavHtml(slug, calendly)}
  <div class="main-container">
    <div class="content-wrapper">
      <div class="main-col">
        ${content}
        <div class="promo">
          <p>Ready to turn observability into resolved incidents, not just dashboards?</p>
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

const heroSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"><defs><linearGradient id="hg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0e0b1e"/><stop offset="1" stop-color="#2a1163"/></linearGradient></defs><rect width="1200" height="630" fill="url(#hg)"/><g transform="translate(80,80)"><circle cx="22" cy="22" r="22" fill="#7c3aed"/><text x="22" y="30" font-size="22" font-weight="800" fill="#fff" text-anchor="middle">A</text><text x="56" y="30" font-size="24" font-weight="700" fill="#fff">AlertMend</text><text x="228" y="30" font-size="18" fill="#b9a7e6">· observability</text></g><text x="80" y="250" font-size="62" font-weight="800" fill="#fff">What Is Observability?</text><text x="80" y="314" font-size="30" font-weight="700" fill="#a78bfa">Understand a system from the outside in.</text><g font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="20"><rect x="80" y="366" width="1040" height="150" rx="14" fill="#170f2e" stroke="#3b2a63"/><text x="108" y="404" fill="#c4b5fd">logs</text><text x="320" y="404" fill="#e7defb">what happened</text><text x="108" y="440" fill="#c4b5fd">metrics</text><text x="320" y="440" fill="#e7defb">how much, how often</text><text x="108" y="476" fill="#c4b5fd">traces</text><text x="320" y="476" fill="#e7defb">where the request went</text></g><text x="80" y="566" font-size="19" fill="#b9a7e6">alertmend.io · the three pillars, OpenTelemetry, and closing the loop</text></svg>\n`

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
