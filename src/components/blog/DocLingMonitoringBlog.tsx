import { useState } from 'react'
import {
  AlertTriangle,
  BellRing,
  Bot,
  ChevronDown,
  Clock,
  Code2,
  Container,
  Cpu,
  Eye,
  Lightbulb,
  Link2,
  Radio,
  RotateCcw,
  Server,
  Terminal,
  HardDrive,
  Gauge,
  Workflow,
  ArrowRight,
} from 'lucide-react'
import styles from './DocLingMonitoringBlog.module.css'

const CALENDLY_URL = 'https://calendly.com/hello-alertmend/30min'
const SIGNUP_REMEDIATION = 'https://app.alertmend.io/signup?service=remediation&source=blog-docling'

type DeployModeId = 'library' | 'cli' | 'serve' | 'kubernetes' | 'mcp'

interface DeployMode {
  id: DeployModeId
  title: string
  sub: string
  icon: typeof Server
  summary: string
  checks: string[]
  healthCmd?: string
  syntheticCmd?: string
  codeExample?: string
  tip: string
  alertmendSteps: string[]
  dashboardLabel: string
  alertExample: string
}

const ALERTMEND_FLOW = [
  {
    n: 1,
    icon: Link2,
    title: 'Connect',
    body: 'Connect your cluster in AlertMend. Docling health and restart events show up without building a separate monitoring stack.',
  },
  {
    n: 2,
    icon: Eye,
    title: 'Add a health check',
    body: 'Add a URL check for your Docling endpoint. AlertMend verifies the service is actually ready to parse documents, not just running.',
  },
  {
    n: 3,
    icon: BellRing,
    title: 'Alert your team',
    body: 'When something breaks, AlertMend opens a Slack incident with a plain-language summary and links to the details your on-call needs.',
  },
  {
    n: 4,
    icon: RotateCcw,
    title: 'Auto-recover',
    body: 'Turn on the out-of-memory runbook. AlertMend brings Docling back online automatically instead of waiting for someone to restart it manually.',
  },
] as const

const SIGNAL_HIERARCHY = [
  {
    signal: 'Docling not ready to serve traffic',
    action: 'Alert the team',
    alertmend: 'URL health check fails twice in a row → Slack incident.',
  },
  {
    signal: 'Pod killed from memory pressure',
    action: 'Alert and restart',
    alertmend: 'Out-of-memory runbook restarts the service and posts what happened.',
  },
  {
    signal: 'Conversions getting slow',
    action: 'Warn first',
    alertmend: 'Latency alert before a full outage.',
  },
  {
    signal: 'Still starting after a deploy',
    action: 'Wait',
    alertmend: 'Deploy grace period so boot-up does not false-alarm.',
  },
  {
    signal: 'Background jobs piling up',
    action: 'Alert the team',
    alertmend: 'Queue alert + worker restart when jobs stop finishing.',
  },
] as const

const OBS_WATCH_SIGNALS = [
  { icon: Radio, label: 'Ready check', sub: 'Can it parse?' },
  { icon: Cpu, label: 'Memory', sub: 'Out-of-memory kills' },
  { icon: Clock, label: 'Speed', sub: 'Slow or stuck jobs' },
  { icon: Workflow, label: 'Queue', sub: 'Backlog growing' },
] as const

const DEPLOYMENT_MODES: DeployMode[] = [
  {
    id: 'library',
    title: 'Python library',
    sub: 'Embedded in your app',
    icon: Code2,
    summary:
      'Install with pip install docling and call DocumentConverter inside your Python service, worker, or notebook pipeline. No separate HTTP server; Docling runs in-process.',
    checks: [
      'Alert on conversion exceptions and error rates in application logs',
      'Track conversion duration (p95/p99) from your app metrics or APM',
      'Watch process memory: model loads can spike RSS during large PDFs',
      'If the host runs on Kubernetes, watch the parent pod for OOMKilled events',
    ],
    codeExample: `from docling.document_converter import DocumentConverter

converter = DocumentConverter()
doc = converter.convert("sample.pdf").document
print(doc.export_to_markdown())`,
    tip: 'Wrap convert() calls with timing metrics so AlertMend log alerts can fire on slow or failed parses.',
    alertmendSteps: [
      'Connect the cluster or VM where your Docling worker runs',
      'Alert on conversion errors in logs',
      'Alert when memory use gets too high',
      'Auto-restart the worker when it crashes',
    ],
    dashboardLabel: 'app-ingestion-worker',
    alertExample: 'ConversionError rate > 5%: log alert triggered',
  },
  {
    id: 'cli',
    title: 'CLI & batch jobs',
    sub: 'Cron, Airflow, CI',
    icon: Terminal,
    summary:
      'Run docling from the shell for one-off conversions or schedule batch jobs via CronJob, Airflow, or CI pipelines. Exit code and job duration are your primary signals.',
    checks: [
      'Alert when scheduled jobs fail (non-zero exit code) or miss their SLA window',
      'Track job duration: batch runs that suddenly take 3× longer often precede OOM',
      'Watch disk space on job runners; Docling writes intermediate files locally',
      'For Kubernetes CronJobs, watch job failure counts and backoff limits',
    ],
    healthCmd: `docling https://example.com/sample.pdf
echo $?  # 0 = success`,
    tip: 'Use AlertMend Kubernetes alerts on CronJob failure events, or wire CI/webhook notifications for pipeline failures.',
    alertmendSteps: [
      'Connect the cluster where your scheduled Docling jobs run',
      'Alert when a batch job fails or misses its window',
      'Send job details to Slack so someone can investigate',
      'Optionally retry the job automatically after cleanup',
    ],
    dashboardLabel: 'docling-batch-cron',
    alertExample: 'CronJob docling-nightly failed: 3 consecutive misses',
  },
  {
    id: 'serve',
    title: 'Docling Serve',
    sub: 'Docker or VM API',
    icon: Server,
    summary:
      'Run the FastAPI server from docling-serve as a standalone API via pip, Docker (quay.io/docling-project/docling-serve), or on a VM. Default port is 5001 with a /health endpoint.',
    checks: [
      'Poll GET /health every minute; alert when not 200',
      'Readiness on GET /ready or /readyz (503 until models finish loading)',
      'Scrape GET /metrics when DOCLING_SERVE_OTEL_ENABLE_METRICS=true (Prometheus)',
      'Latency SLOs on POST /v1/convert/file for synchronous conversions',
      'For async jobs, poll /v1/status/{task_id} and alert on stuck tasks',
      'CPU/memory alerts on the host or container running docling-serve',
    ],
    healthCmd: `curl -sf http://localhost:5001/health`,
    syntheticCmd: `curl -sf -X POST http://localhost:5001/v1/convert/file \\
  -F "files=@sample.pdf" -o /dev/null -w "%{http_code}"`,
    tip: 'GPU images (docling-serve-cu*) need explicit version tags; pin the image and alert on CUDA OOM separately.',
    alertmendSteps: [
      'Add a URL check on your Docling API ready endpoint',
      'Alert after two failed checks in a row',
      'Optionally run a small test conversion on a schedule',
      'Restart the container automatically if checks keep failing',
    ],
    dashboardLabel: 'docling-serve-prod',
    alertExample: 'Docling Serve /health failed: 502 from load balancer',
  },
  {
    id: 'kubernetes',
    title: 'Kubernetes',
    sub: 'Docling Serve on K8s',
    icon: Container,
    summary:
      'Deploy docling-serve containers as a Deployment or StatefulSet behind a Service and Ingress. Combine HTTP checks with pod-level Kubernetes observability.',
    checks: [
      'Poll GET /health and /ready on the in-cluster Service or Ingress (port 5001)',
      'Readiness on /ready: 503 during model boot is normal; alert if stuck >10 min',
      'Pod restart counts, OOMKilled, and CrashLoopBackOff on the Docling deployment',
      'Memory trend alerts: docling-serve can leak RAM across jobs (known upstream issue)',
      'For RQ async mode: alert when Redis queue depth grows (worker may be down)',
      'Synthetic /v1/convert/file check through the same path clients use',
    ],
    healthCmd: `curl -sf http://docling.default.svc.cluster.local:5001/health`,
    syntheticCmd: `curl -sf -X POST http://docling:5001/v1/convert/file \\
  -F "files=@sample.pdf" -w "%{http_code}"`,
    tip: 'Set memory limits with headroom: Docling images are 4–9 GB and spike on 100+ page PDFs.',
    alertmendSteps: [
      'Install the AlertMend agent in your cluster',
      'Out-of-memory and crash events on Docling show up with context',
      'Enable auto-restart when a Docling pod dies from memory pressure',
      'Add a URL check through the same address your apps use',
    ],
    dashboardLabel: 'docling-prod',
    alertExample: 'Docling pod OOMKilled: auto-remediation triggered',
  },
  {
    id: 'mcp',
    title: 'MCP server',
    sub: 'Agent tool calls',
    icon: Bot,
    summary:
      'Expose Docling to AI agents via the Model Context Protocol (MCP). Agents call document tools over stdio or HTTP depending on your MCP transport setup.',
    checks: [
      'If MCP is HTTP-backed, poll the server endpoint for availability and latency',
      'Alert on tool-call failures reported by your agent orchestration layer',
      'Track document tool timeout rates: agents retry aggressively and amplify load',
      'Verify the underlying Docling process (library or Serve) the MCP server wraps is healthy',
    ],
    tip: 'MCP is only as reliable as the Docling backend. Check both the agent gateway and the parser underneath.',
    alertmendSteps: [
      'Add a health check on your agent gateway if it is HTTP-based',
      'Alert when tool calls start timing out',
      'Apply the same Docling health check to the parser running underneath',
      'Restart the backend when timeouts spike',
    ],
    dashboardLabel: 'docling-mcp-gateway',
    alertExample: 'MCP tool docling_parse timeout rate > 10%',
  },
]

/** Production failure modes (GitHub issues, docling-serve ops). */
const TOP_SEARCH_ISSUES = [
  {
    icon: HardDrive,
    term: 'Memory creep',
    desc: 'Memory use climbs job after job until the service crashes mid-batch.',
    alertMend: 'Memory alert + scheduled restart between large batches.',
  },
  {
    icon: Cpu,
    term: 'Out of memory on big PDFs',
    desc: 'Large documents exhaust available memory. The service restarts and in-flight work fails.',
    alertMend: 'Slack alert + auto-restart runbook brings Docling back online.',
  },
  {
    icon: Gauge,
    term: 'GPU runs out of memory',
    desc: 'The API looks fine but the next OCR job fails.',
    alertMend: 'Restart GPU workers between heavy batches.',
  },
  {
    icon: Radio,
    term: 'Looks healthy but is not ready',
    desc: 'The process is running but not accepting work yet.',
    alertMend: 'Check readiness, not just "is it up." Suppress alerts during deploys.',
  },
  {
    icon: Workflow,
    term: 'Jobs stuck in the queue',
    desc: 'The API responds but background work stops finishing.',
    alertMend: 'Queue alert + restart stuck workers.',
  },
  {
    icon: Clock,
    term: 'Stuck on one file',
    desc: 'One bad document blocks everything else.',
    alertMend: 'Timeout alert + restart to clear the blockage.',
  },
]

const FAQ_ITEMS = [
  {
    q: 'How do I monitor Docling in production?',
    a: 'Connect your cluster in AlertMend, add a health check on your Docling endpoint, and route alerts to Slack. AlertMend watches for crashes, failed jobs, and conversion errors depending on how you run Docling.',
  },
  {
    q: 'How do I monitor docling-serve health checks?',
    a: 'In AlertMend, add a URL check on the ready endpoint (not just the basic health endpoint). That confirms Docling can actually parse documents. AlertMend notifies your team after repeated failures.',
  },
  {
    q: 'Why does Docling keep running out of memory?',
    a: 'Large PDFs and long-running jobs can exhaust memory. AlertMend alerts your team when it happens and can restart the service automatically. If it keeps recurring, increase the memory allocated to Docling.',
  },
  {
    q: 'What is the difference between docling-serve /health and /ready?',
    a: 'The health endpoint means the process is running. The ready endpoint means Docling is loaded and can accept work. AlertMend should check ready. During deploys, AlertMend can wait before alerting so boot-up does not cause false alarms.',
  },
  {
    q: 'How do I fix a Docling memory leak?',
    a: 'Use AlertMend to alert when memory gets high and schedule restarts between large batches. That keeps the pipeline moving while you adjust sizing or split workloads.',
  },
  {
    q: 'How do I monitor Docling background workers?',
    a: 'AlertMend can watch worker crashes and growing job backlogs even when the main API looks fine. Enable a restart runbook when jobs stop completing.',
  },
  {
    q: 'How do I know if Docling is down?',
    a: 'AlertMend treats Docling as down when health checks fail, jobs error out, or the service crashes, not when a superficial "up" check passes but parsing still fails.',
  },
  {
    q: 'Should I auto-restart Docling on every OOMKilled?',
    a: 'Yes. Enable AlertMend\'s out-of-memory runbook: your team gets a Slack alert with what happened, and Docling comes back online automatically. If it keeps happening, give Docling more memory.',
  },
]

export const DOCLING_BLOG_FAQ = FAQ_ITEMS

/** HowTo steps for FAQ / HowTo JSON-LD (Google + AI crawlers). */
export const DOCLING_HOWTO_STEPS = ALERTMEND_FLOW.map(({ title, body }) => ({
  title,
  body,
  docling: '',
}))

export default function DocLingMonitoringBlog() {
  const [activeMode, setActiveMode] = useState<DeployModeId>('kubernetes')
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const mode = DEPLOYMENT_MODES.find((m) => m.id === activeMode)!

  return (
    <div className={`${styles.root} not-prose`}>
      <section className={`${styles.heroBand} reveal`}>
        <div className={styles.heroBrands}>
          <a
            href="https://www.docling.ai/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Docling (opens docling.ai)"
          >
            <img
              src="/media/blog/docling-logo.png"
              alt="Docling"
              className={styles.brandLogo}
              width={142}
              height={40}
            />
          </a>
          <span className={styles.heroBrandSep} aria-hidden="true">
            ×
          </span>
          <a href="/" className={styles.heroAmLink} aria-label="AlertMend">
            <img
              src="/logos/alertmend-logo.svg"
              alt="AlertMend"
              className={styles.heroAmLogo}
              width={128}
              height={28}
            />
          </a>
        </div>
        <p className={styles.heroGuideLabel}>
          Runbook · Docling observability in production
        </p>

        <div className={styles.heroAudience}>
          <h2 className={styles.heroAudienceTitle}>You&apos;re in the right place if…</h2>
          <ul className={styles.heroAudienceList}>
            <li>You already run Docling in production (API, Kubernetes, Python library, or batch jobs)</li>
            <li>Your RAG, ingestion, or agent pipeline stops when Docling goes offline</li>
            <li>You want next-generation AI observability out of the box, not another DIY monitoring stack</li>
          </ul>
          <p className={styles.heroAudienceNote}>
            This is not a Docling tutorial. It assumes Docling is already in your stack and shows
            how to connect it to{' '}
            <a href="/">AlertMend</a>, a state-of-the-art AI observability platform with monitoring,
            AI-powered incident analysis, and auto-recovery built in. Docling observability in a few
            clicks.
          </p>
        </div>

        <p className={styles.seoTldr}>
          <strong>TL;DR:</strong> Plug Docling into AlertMend, the next-generation AI observability
          platform, and get health checks, Slack alerts, and auto-restart out of the box.
        </p>

        <div className={styles.heroContext}>
          <div className={styles.heroContextBlock}>
            <h2 className={styles.heroContextTitle}>When Docling stops working</h2>
            <p className={styles.heroContextBody}>
              Large PDFs can exhaust memory. Deploys can leave Docling starting up while your pipeline
              already sends traffic. Background jobs can pile up while the API still looks fine.
            </p>
            <p className={styles.heroContextBody}>
              These are common in production. The gap is usually not Docling itself. It is catching
              the failure early and recovering without a manual restart.
            </p>
          </div>
          <div className={styles.heroContextBlock}>
            <h2 className={styles.heroContextTitle}>Why AlertMend</h2>
            <p className={styles.heroContextBody}>
              AlertMend is a next-generation AI observability platform built for production AI
              workloads. Teams use it to monitor Kubernetes and document pipelines without wiring
              Prometheus, Grafana, and PagerDuty themselves.
            </p>
            <p className={styles.heroContextBody}>
              For Docling: connect your cluster, add a health check, and AlertMend delivers Slack
              alerts with AI-powered root-cause analysis and auto-recovery runbooks, out of the box,
              in a few clicks.
            </p>
          </div>
        </div>

        <p className={styles.pipelineCaption}>What AlertMend watches</p>
        <div className={styles.pipeline}>
          {OBS_WATCH_SIGNALS.map(({ icon: Icon, label, sub }, i) => (
            <span key={label} className={styles.pipelineGroup}>
              {i > 0 && <ArrowRight className={styles.pipelineArrow} size={18} strokeWidth={1.6} />}
              <div className={`${styles.pipelineNode} ${i === 0 ? styles.pipelineNodeFocus : ''}`}>
                <Icon className={styles.pipelineIcon} strokeWidth={1.6} />
                <div className={styles.pipelineLabel}>{label}</div>
                <div className={styles.pipelineSub}>{sub}</div>
              </div>
            </span>
          ))}
          <ArrowRight className={styles.pipelineArrow} size={18} strokeWidth={1.6} />
          <div className={styles.pipelineNode}>
            <BellRing className={styles.pipelineIcon} strokeWidth={1.6} />
            <div className={styles.pipelineLabel}>Alert + fix</div>
            <div className={styles.pipelineSub}>Slack + auto-recover</div>
          </div>
        </div>
      </section>

      <h2 className={`${styles.sectionHead} reveal`}>How auto-recovery works</h2>
      <p className={`${styles.sectionSub} reveal`}>
        A simple sequence view: Docling fails, AlertMend detects and alerts Slack,
        runs the restart runbook, and your pipeline is back online.
      </p>
      <figure className={`${styles.flowDiagram} reveal`}>
        <img
          src="/media/blog/docling-alertmend-recovery-flow.svg"
          alt="Sequence diagram: Docling out of memory, AlertMend detects the failure, alerts Slack, runs auto-recovery runbook, and Docling returns online"
          width={960}
          height={720}
          loading="lazy"
        />
        <figcaption className={styles.flowDiagramCaption}>
          Normal operation, failure, Slack alert with AI summary, runbook restart, pipeline restored.
        </figcaption>
      </figure>

      <p className={`${styles.bodyText} reveal`}>
        Pick how you run Docling below. Each section shows what to set up in AlertMend.
      </p>

      <h2 className={`${styles.sectionHead} reveal`}>When to alert your team</h2>
      <p className={`${styles.sectionSub} reveal`}>
        What to watch for, and how AlertMend handles each case.
      </p>
      <div className={`${styles.diyWrap} reveal`}>
        <table className={styles.compareTable}>
          <thead>
            <tr>
              <th>Signal</th>
              <th>Action</th>
              <th>In AlertMend</th>
            </tr>
          </thead>
          <tbody>
            {SIGNAL_HIERARCHY.map(({ signal, action, alertmend }) => (
              <tr key={signal}>
                <td>{signal}</td>
                <td className={styles.diyHighlight}>{action}</td>
                <td>{alertmend}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className={`${styles.sectionHead} reveal`}>Set up in four steps</h2>
      <p className={`${styles.sectionSub} reveal`}>
        AlertMend is out-of-the-box AI observability. Here is how to connect Docling.
      </p>
      <div className={`${styles.amFlow} reveal`}>
        {ALERTMEND_FLOW.map(({ n, icon: Icon, title, body }) => (
          <div key={n} className={styles.amStep}>
            <div className={styles.amStepHead}>
              <span className={styles.amStepNum}>{n}</span>
              <Icon className={styles.amStepIcon} size={16} strokeWidth={1.6} />
            </div>
            <h3 className={styles.amStepTitle}>{title}</h3>
            <p className={styles.amStepBody}>{body}</p>
          </div>
        ))}
      </div>

      <h2 className={`${styles.sectionHead} reveal`}>Runbook by deployment mode</h2>
      <p className={`${styles.sectionSub} reveal`}>
        Same observability goal, different signals depending on how you run Docling.
      </p>
      <div className={`${styles.modeGrid} reveal`} role="tablist" aria-label="Docling deployment modes">
        {DEPLOYMENT_MODES.map((m) => {
          const Icon = m.icon
          return (
            <button
              key={m.id}
              type="button"
              role="tab"
              aria-selected={activeMode === m.id}
              className={`${styles.modeCard} ${activeMode === m.id ? styles.modeCardActive : ''}`}
              onClick={() => setActiveMode(m.id)}
            >
              <Icon className={styles.modeCardIcon} size={18} strokeWidth={1.6} />
              <span className={styles.modeCardTitle}>{m.title}</span>
              <span className={styles.modeCardSub}>{m.sub}</span>
            </button>
          )
        })}
      </div>

      <div className={styles.modePlaybook} key={activeMode} role="tabpanel">
        <div className={styles.modePlaybookHead}>
          <h3 className={styles.modePlaybookTitle}>Runbook: {mode.title}</h3>
          <span className={styles.modePlaybookBadge}>Production</span>
        </div>
        <p className={styles.modePlaybookSummary}>{mode.summary}</p>
        <p className={styles.stepPanelBody}>
          <strong>Set up in AlertMend</strong>
        </p>
        <ul className={styles.checkList}>
          {mode.alertmendSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ul>
        <div className={styles.stepTip}>
          <Lightbulb className={styles.stepTipIcon} size={16} strokeWidth={1.6} />
          <span>{mode.tip}</span>
        </div>
      </div>

      {/* Live dashboard mock: label follows selected mode */}
      <div className={`${styles.dashboardWrap} reveal`}>
        <div className={styles.dashboard} role="img" aria-label={`AlertMend uptime dashboard for ${mode.title}`}>
          <div className={styles.dashboardChrome}>
            <div className={styles.chromeDots}>
              <span className={styles.chromeDot} />
              <span className={styles.chromeDot} />
              <span className={styles.chromeDot} />
            </div>
            <span className={styles.dashboardTitle}>AlertMend · {mode.dashboardLabel}</span>
            <span className={styles.liveBadge}>
              <span className={styles.liveDot} />
              Live
            </span>
          </div>
          <div className={styles.dashboardBody}>
            <div className={styles.metricCard}>
              <div className={styles.metricLabel}>
                {mode.id === 'cli' || mode.id === 'library' ? 'Job / error rate' : 'Health check'}
              </div>
              <div className={`${styles.metricValue} ${mode.id === 'cli' ? styles.metricValueWarn : styles.metricValueOk}`}>
                {mode.id === 'cli' ? '1 fail' : mode.id === 'library' ? '0.3%' : '200 OK'}
              </div>
            </div>
            <div className={styles.metricCard}>
              <div className={styles.metricLabel}>p95 latency</div>
              <div className={`${styles.metricValue} ${styles.metricValueWarn}`}>4.2s</div>
              <div className={styles.metricBar}>
                <div className={styles.metricBarFill} />
              </div>
            </div>
            <div className={styles.metricCard}>
              <div className={styles.metricLabel}>
                {mode.id === 'kubernetes' ? 'Pod restarts (1h)' : 'Memory pressure'}
              </div>
              <div className={styles.metricValue}>{mode.id === 'kubernetes' ? '2' : '82%'}</div>
            </div>
          </div>
          <div className={styles.alertToast}>
            <AlertTriangle className={styles.alertIcon} size={16} strokeWidth={1.6} />
            <div className={styles.alertText}>
              <div className={styles.alertTitle}>{mode.alertExample}</div>
              <div className={styles.alertMeta}>{mode.dashboardLabel} · Slack #incidents · 12s ago</div>
            </div>
          </div>
        </div>
      </div>

      <h2 className={`${styles.sectionHead} reveal`}>Common problems</h2>
      <p className={`${styles.sectionSub} reveal`}>
        What goes wrong in production, and how AlertMend helps.
      </p>
      <div className={`${styles.searchIssueGrid} reveal`}>
        {TOP_SEARCH_ISSUES.map(({ icon: Icon, term, desc, alertMend }) => (
          <div key={term} className={styles.searchIssueCard}>
            <div className={styles.searchIssueHead}>
              <Icon className={styles.searchIssueIcon} size={16} strokeWidth={1.6} />
              <h3 className={styles.searchIssueTerm}>{term}</h3>
            </div>
            <p className={styles.searchIssueDesc}>{desc}</p>
            <p className={styles.searchIssueAlert}>
              <strong>In AlertMend:</strong> {alertMend}
            </p>
          </div>
        ))}
      </div>

      <h2 className={`${styles.sectionHead} reveal`}>FAQ</h2>
      <div className={`${styles.faqList} reveal`}>
        {FAQ_ITEMS.map((item, i) => (
          <div key={item.q} className={styles.faqItem}>
            <button
              type="button"
              className={styles.faqQuestion}
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              aria-expanded={openFaq === i}
            >
              {item.q}
              <ChevronDown
                className={`${styles.faqChevron} ${openFaq === i ? styles.faqChevronOpen : ''}`}
                size={18}
                strokeWidth={1.6}
              />
            </button>
            {openFaq === i && <div className={styles.faqAnswer}>{item.a}</div>}
          </div>
        ))}
      </div>

      <div className={`${styles.ctaBand} reveal`}>
        <div className={styles.ctaBandTitle}>Next-generation AI observability for Docling</div>
        <p className={styles.ctaBandSub}>
          AlertMend gives you monitoring, AI-powered incident analysis, and auto-recovery out of
          the box. Connect Docling in a few clicks. No custom stack required.
        </p>
        <div className={styles.ctaBtnRow}>
          <a href={SIGNUP_REMEDIATION} className={styles.ctaBtn}>
            Start with auto-remediation
            <ArrowRight size={16} strokeWidth={2} />
          </a>
          <button
            type="button"
            className={styles.ctaBtnSecondary}
            onClick={() => window.open(CALENDLY_URL, '_blank')}
          >
            Book a demo
          </button>
        </div>
      </div>
    </div>
  )
}
