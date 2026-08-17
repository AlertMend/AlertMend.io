import {
  Activity, Cpu, Network, Database, BarChart3, Brain,
  Boxes, GitMerge,
} from 'lucide-react'
import SolutionPageTemplate, {
  Accent,
  ConsoleFrame,
} from '../components/SolutionPageTemplate'

/**
 * /observability, metrics, logs, traces on one timeline via OTel + eBPF,
 * with a live service map and AI RCA on top. Uses the shared product-page
 * template so it matches Kubernetes / On-call / FinOps.
 */

const SIGNUP_URL = 'https://app.alertmend.io/signup?service=observability'

/* Dense APM console: KPIs + hot paths + waterfall, product-faithful, not a toy SVG. */
function ObservabilityConsole() {
  const kpis = [
    { label: 'p99', value: '812ms', sub: 'checkout', bad: false },
    { label: 'Error rate', value: '4.2%', sub: '↑ spike', bad: true },
    { label: 'Traces / min', value: '1.8k', sub: 'stable', bad: false },
    { label: 'Services', value: '24', sub: '3 red', bad: true },
  ]
  const deps = [
    { from: 'web', to: 'api', rps: '420/s', err: '0.1%' },
    { from: 'api', to: 'auth', rps: '380/s', err: '0.0%' },
    { from: 'auth', to: 'db', rps: '210/s', err: '12%', hot: true },
    { from: 'api', to: 'cache', rps: '1.1k/s', err: '0.0%' },
  ]
  const spans = [
    { name: 'GET /checkout', left: 0, w: 100, ms: '812ms', tone: 'ok' as const },
    { name: 'api.handle', left: 6, w: 82, ms: '740ms', tone: 'ok' as const },
    { name: 'auth.verify', left: 10, w: 14, ms: '61ms', tone: 'ok' as const },
    { name: 'db.query', left: 40, w: 55, ms: '498ms', tone: 'err' as const },
    { name: 'cache.get', left: 24, w: 9, ms: '22ms', tone: 'warn' as const },
  ]
  const bar: Record<(typeof spans)[number]['tone'], string> = {
    ok: 'bg-violet-500',
    warn: 'bg-amber-500',
    err: 'bg-rose-500',
  }

  return (
    <ConsoleFrame title="observability · checkout · last 15m">
      <div className="grid grid-cols-4 gap-2">
        {kpis.map((k) => (
          <div
            key={k.label}
            className="rounded-lg border border-white/[0.07] bg-white/[0.03] px-2.5 py-2"
          >
            <div className="text-[10px] uppercase tracking-wide text-white/45">{k.label}</div>
            <div className="mt-0.5 flex items-baseline gap-1.5">
              <span className={`text-base font-bold tabular-nums ${k.bad ? 'text-rose-300' : 'text-white'}`}>
                {k.value}
              </span>
              <span className={`text-[10px] font-medium ${k.bad ? 'text-rose-400/80' : 'text-white/40'}`}>
                {k.sub}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2.5">
        <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-white/80">Service edges</span>
            <span className="font-mono text-[10px] text-white/40">live traffic</span>
          </div>
          <div className="space-y-1.5">
            {deps.map((d) => (
              <div
                key={`${d.from}-${d.to}`}
                className={`flex items-center gap-2 rounded-md px-2 py-1.5 ${
                  d.hot ? 'border border-rose-400/25 bg-rose-500/10' : 'bg-white/[0.03]'
                }`}
              >
                <span className="font-mono text-[11px] text-white/90">
                  {d.from}
                  <span className="mx-1 text-white/30">→</span>
                  {d.to}
                </span>
                <span className="ml-auto font-mono text-[10px] text-white/45">{d.rps}</span>
                <span
                  className={`font-mono text-[10px] font-semibold ${
                    d.hot ? 'text-rose-300' : 'text-emerald-400/80'
                  }`}
                >
                  {d.err}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-white/80">Hot paths</span>
            <span className="font-mono text-[10px] text-white/40">share of time</span>
          </div>
          {[
            { path: 'GET /checkout', pct: 42, ms: '812ms' },
            { path: 'POST /pay', pct: 28, ms: '1.2s' },
            { path: 'GET /cart', pct: 18, ms: '210ms' },
            { path: 'GET /health', pct: 6, ms: '12ms' },
          ].map((t) => (
            <div key={t.path} className="mb-2 last:mb-0">
              <div className="mb-1 flex justify-between gap-2">
                <span className="truncate font-mono text-[10.5px] text-white/75">{t.path}</span>
                <span className="shrink-0 font-mono text-[10px] text-white/45">{t.ms}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className="h-full rounded-full bg-violet-500/90"
                  style={{ width: `${t.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 rounded-lg border border-white/[0.07] bg-white/[0.02] p-3">
        <div className="mb-2.5 flex items-center justify-between">
          <span className="text-[11px] font-semibold text-white/80">
            Trace · <span className="font-mono text-white/55">a7f3…c21</span>
          </span>
          <span className="rounded border border-rose-400/30 bg-rose-500/10 px-1.5 py-0.5 font-mono text-[10px] font-bold text-rose-300">
            db.query 5xx · 498ms
          </span>
        </div>
        <div className="space-y-1.5">
          {spans.map((s) => (
            <div key={s.name} className="grid grid-cols-[118px_1fr_44px] items-center gap-2">
              <span className="truncate font-mono text-[10.5px] text-white/55">{s.name}</span>
              <div className="relative h-2 overflow-hidden rounded bg-white/[0.06]">
                <div
                  className={`absolute top-0 h-2 rounded ${bar[s.tone]}`}
                  style={{ left: `${s.left}%`, width: `${s.w}%` }}
                />
              </div>
              <span className="text-right font-mono text-[10.5px] tabular-nums text-white/70">{s.ms}</span>
            </div>
          ))}
        </div>
      </div>
    </ConsoleFrame>
  )
}

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
        title: 'Observability: Metrics, Logs & Traces on One Timeline',
        description:
          'Unify metrics, logs and distributed traces on one timeline with OpenTelemetry and eBPF. Live service map, SQL-queryable logs, and evidence-backed AI RCA.',
        keywords:
          'observability, APM, distributed tracing, OpenTelemetry, eBPF, service map, SQL logs, Prometheus, Kubernetes observability, root cause analysis, AlertMend AI',
        canonical: '/observability',
      }}
      badge="Observability"
      headline={
        <>
          Every signal on <Accent>one timeline</Accent>. Then the AI reads it for you.
        </>
      }
      sub="Metrics, logs and distributed traces, collected through OpenTelemetry and eBPF, correlated instead of siloed. Stop stitching four tools together to answer one question."
      signupUrl={SIGNUP_URL}
      checks={['OpenTelemetry-native', 'eBPF zero-code', 'Host in your VPC']}
      console={<ObservabilityConsole />}
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
