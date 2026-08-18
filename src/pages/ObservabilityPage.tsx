import {
  Activity, Cpu, Network, Database, BarChart3, Brain,
  Boxes, GitMerge,
} from 'lucide-react'
import SolutionPageTemplate, {
  Accent,
} from '../components/SolutionPageTemplate'

/**
 * /observability, metrics, logs, traces on one timeline via OTel + eBPF,
 * with a live service map and AI RCA on top. Uses the shared product-page
 * template so it matches Kubernetes / On-call / FinOps.
 */

const SIGNUP_URL = 'https://app.alertmend.io/signup?service=observability'

function SpotlightPanel() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-xs text-white/55">checkout · p99 spike</span>
        <span className="rounded-full border border-rose-400/30 bg-rose-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase text-rose-300">
          correlated
        </span>
      </div>
      <div className="mt-4 space-y-2.5 font-mono text-[11px] text-white/65">
        <div className="flex gap-2"><span className="text-emerald-400">✓</span> Trace waterfall isolated slow span</div>
        <div className="flex gap-2"><span className="text-emerald-400">✓</span> Error logs joined on trace-id</div>
        <div className="flex gap-2"><span className="text-emerald-400">✓</span> Service map edge auth→db lit red</div>
      </div>
      <div className="mt-4 rounded-xl border border-violet-400/25 bg-violet-500/10 p-4">
        <div className="text-xs font-bold text-violet-300">Root cause · confidence 94%</div>
        <p className="mt-1.5 text-sm leading-relaxed text-zinc-200">
          <b className="text-white">db.query</b> saturated the connection pool during a checkout
          traffic spike; auth retries amplified load. Raise pool size and add a circuit breaker
          on the auth→db path.
        </p>
      </div>
    </div>
  )
}

export default function ObservabilityPage() {
  return (
    <SolutionPageTemplate
      seo={{
        title: 'Observability & APM: Metrics, Logs & Traces | AlertMend',
        description:
          'Unify metrics, logs and distributed traces on one timeline with OpenTelemetry and eBPF. Live service map, SQL-queryable logs, and evidence-backed AI RCA.',
        keywords:
          'observability, APM, distributed tracing, OpenTelemetry, eBPF, service map, SQL logs, Prometheus, Kubernetes observability, root cause analysis, AlertMend AI',
        canonical: '/observability',
      }}
      badge="Observability & APM"
      headline={
        <>
          Every signal on <Accent>one timeline</Accent>. Then the AI reads it for you.
        </>
      }
      sub="Metrics, logs and distributed traces, collected through OpenTelemetry and eBPF, correlated instead of siloed. Stop stitching four tools together to answer one question."
      signupUrl={SIGNUP_URL}
      checks={['OpenTelemetry-native', 'eBPF zero-code', 'Host in your VPC']}
      highlightProduct="obs"
      stepsHeading="From four data types to one answer"
      stepsSub="The same pipeline every time: collect every signal, correlate it on one timeline, and let the agent explain what broke."
      steps={[
        {
          icon: Boxes,
          title: 'Collect',
          sub: 'OpenTelemetry + eBPF',
          spec: 'OTLP gateway for SDK spans · kernel eBPF agent for zero-code traces · Prometheus scrape · log tailers',
        },
        {
          icon: GitMerge,
          title: 'Correlate',
          sub: 'One timeline, not four tools',
          spec: 'metrics · logs · traces · K8s events joined on service, trace-id and time',
        },
        {
          icon: Brain,
          title: 'Explain',
          sub: 'AI RCA with evidence',
          spec: 'the agent reads the correlated signals and writes the root-cause narrative',
        },
      ]}
      featuresHeading="Every observability surface, connected"
      featuresSub="Not six tools bolted together, one data model, so a click in the service map lands you in the exact trace, log line and metric."
      features={[
        {
          icon: Activity,
          title: 'APM & distributed tracing',
          body: 'Follow one request across every hop, service to service, into the database, out to the queue. p50/p95/p99, error rates, and span waterfalls with the slow span highlighted.',
          chips: ['p99', 'span waterfall', 'error rates'],
          big: true,
        },
        {
          icon: Cpu,
          title: 'eBPF auto-instrumentation',
          body: 'Golden-signal traces with zero code changes. A kernel-level eBPF agent captures HTTP, gRPC and SQL the moment it lands on the node.',
          chips: ['no-code', 'HTTP · gRPC · SQL'],
        },
        {
          icon: Network,
          title: 'Live service map',
          body: 'The real topology, drawn from live traffic. Dependencies, request rates and where errors propagate, click any node to drop into its traces, logs and metrics.',
          chips: ['topology', 'drill-down'],
        },
        {
          icon: Database,
          title: 'Logs you query in SQL',
          body: 'SELECT * FROM logs with namespace / pod / node fields, time-range presets and stream selection. Fast at production volume.',
          chips: ['SQL', 'indexed'],
        },
        {
          icon: BarChart3,
          title: 'Metrics & dashboards',
          body: 'Prometheus-native panels with data-source selectors, auto-refresh and workspace persistence. One source of truth across every team.',
          chips: ['Prometheus', 'workspace API'],
        },
        {
          icon: Brain,
          title: 'AI RCA across every signal',
          body: 'Traces, logs, metrics and Kubernetes events land on one timeline, then the agent correlates them into a root-cause narrative, not a dashboard hunt.',
          chips: ['correlation', 'evidence'],
        },
      ]}
      spotlight={{
        tag: 'Correlated, not collected',
        title: 'A spike in latency, explained before you open a dashboard',
        body: 'When the service map lights up red, AlertMend already has the trace, the failing span, the correlated error logs and the pod events on one timeline, and turns them into a root-cause narrative in about 15 seconds.',
        steps: [
          'Anomaly detected on p99 latency for checkout',
          'Slow span isolated: db.query 498ms (5xx)',
          'Correlated logs: connection pool exhausted',
          'Root cause + suggested fix, ready to apply',
        ],
        linkTo: '/ai-rca',
        linkLabel: 'See AI RCA',
        panel: <SpotlightPanel />,
      }}
      ctaHeading="See your whole stack on one timeline"
      ctaSub="Connect a cluster and get metrics, logs, traces and a live service map in minutes, with AI root cause on top."
    />
  )
}
