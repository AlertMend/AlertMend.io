import {
  FileText, Search, Database, Filter, Shield, Boxes, Cpu, Zap,
} from 'lucide-react'
import SolutionPageTemplate, {
  Accent,
  ConsoleFrame,
} from '../components/SolutionPageTemplate'

/**
 * /log-management — SQL logs for Kubernetes + VMs.
 */

const SIGNUP_URL = 'https://app.alertmend.io/signup?service=log-management'

function LogsConsole() {
  const rows = [
    { t: '12:04:33.212', sev: 'ERR', msg: 'OOMKilled · payments-api exceeded 512Mi', hot: true },
    { t: '12:04:33.001', sev: 'WARN', msg: 'upstream timeout after 30s · checkout → payments', hot: false },
    { t: '12:04:32.884', sev: 'ERR', msg: 'connection reset by peer 10.2.3.4:5432', hot: true },
    { t: '12:04:32.140', sev: 'INFO', msg: 'token refreshed for tenant acme · ttl 3600s', hot: false },
    { t: '12:04:31.702', sev: 'WARN', msg: 'disk usage on /var at 82% · prod-vm-3', hot: false },
    { t: '12:04:31.219', sev: 'INFO', msg: 'reindexed 12,480 docs in 1.3s · search-api', hot: false },
  ]
  const sevTone: Record<string, string> = {
    ERR: 'text-rose-300 bg-rose-500/10 border-rose-400/30',
    WARN: 'text-amber-300 bg-amber-500/10 border-amber-400/30',
    INFO: 'text-zinc-400 bg-white/[0.04] border-white/10',
  }

  return (
    <ConsoleFrame title="log explorer · last 15m">
      <div className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-black/30 px-3 py-2 font-mono text-[11px]">
        <span className="text-violet-300">sql ›</span>
        <span className="truncate text-white/70">
          SELECT * FROM logs WHERE ns=&apos;payments&apos; AND level=&apos;error&apos;
        </span>
        <span className="ml-auto shrink-0 rounded-md bg-violet-600 px-2 py-0.5 text-[10px] font-bold text-white">
          Run · 38ms
        </span>
      </div>

      <div className="mt-3 grid grid-cols-[110px_1fr] gap-2.5">
        <aside className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-2.5">
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-white/40">
            Fields
          </div>
          {['_timestamp', 'namespace', 'service', 'message', 'trace_id', 'pod'].map((f) => (
            <div key={f} className="flex items-center gap-1.5 py-1 font-mono text-[10.5px] text-white/55">
              <span className="h-1.5 w-1.5 rounded-sm bg-violet-400/70" />
              {f}
            </div>
          ))}
        </aside>

        <div className="overflow-hidden rounded-lg border border-white/[0.07] bg-white/[0.02]">
          <div className="grid grid-cols-[88px_42px_1fr] gap-2 border-b border-white/[0.06] px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wide text-white/35">
            <span>Time</span>
            <span>Sev</span>
            <span>Message</span>
          </div>
          {rows.map((r) => (
            <div
              key={r.t + r.msg}
              className={`grid grid-cols-[88px_42px_1fr] items-center gap-2 border-b border-white/[0.04] px-2.5 py-1.5 last:border-0 ${
                r.hot ? 'bg-rose-500/[0.06]' : ''
              }`}
            >
              <span className="font-mono text-[10.5px] tabular-nums text-white/45">{r.t}</span>
              <span className={`rounded border px-1 py-0.5 text-center font-mono text-[9px] font-bold ${sevTone[r.sev]}`}>
                {r.sev}
              </span>
              <span className="truncate text-[11px] text-white/75">{r.msg}</span>
            </div>
          ))}
        </div>
      </div>
    </ConsoleFrame>
  )
}

function SpotlightPanel() {
  return (
    <div className="rounded-[10px] border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-xs text-white/55">vs Elasticsearch</span>
        <span className="rounded-md border border-emerald-400/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
          self-host
        </span>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
          <div className="text-[11px] font-semibold text-white/40">Typical hosted logging</div>
          <ul className="mt-2 space-y-1.5 text-[12px] text-zinc-400">
            <li>Per-GB ingestion fees</li>
            <li>Separate retain charges</li>
            <li>Always-on search cluster</li>
            <li>Data leaves your cloud</li>
          </ul>
        </div>
        <div className="rounded-lg border border-violet-400/25 bg-violet-500/10 p-3">
          <div className="text-[11px] font-semibold text-violet-300">AlertMend</div>
          <ul className="mt-2 space-y-1.5 text-[12px] text-zinc-200">
            <li>SELECT * FROM logs</li>
            <li>Same timeline as traces &amp; metrics</li>
            <li>No Elasticsearch to run</li>
            <li>VPC or on-prem</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default function LogManagementPage() {
  return (
    <SolutionPageTemplate
      seo={{
        title: 'Log Management for Kubernetes & VMs',
        description:
          'Collect and query Kubernetes and VM logs with SQL, SELECT * FROM logs with pod, namespace and node fields. Self-host in your VPC. No Elasticsearch.',
        keywords:
          'log management, Kubernetes logs, SQL logs, VM logs, container logs, self-hosted logging, AlertMend',
        canonical: '/log-management',
      }}
      badge="Log management"
      headline={
        <>
          SQL logs you <Accent>own</Accent>
        </>
      }
      sub="Collect logs from every Kubernetes pod and VM container, then query them with SELECT * FROM logs, on the same timeline as your traces and metrics."
      signupUrl={SIGNUP_URL}
      checks={['SQL explorer', 'K8s + VM collection', 'Runs in your VPC']}
      console={<LogsConsole />}
      stepsHeading="From container to searchable in one hop"
      stepsSub="Collect every line, enrich with Kubernetes context, store it where you control it, and query with SQL."
      steps={[
        {
          icon: Boxes,
          title: 'Collect',
          sub: 'Every pod and VM container',
          spec: 'DaemonSet (K8s) + agent (VMs) · CRI & Docker JSON · no sidecars',
        },
        {
          icon: Filter,
          title: 'Enrich',
          sub: 'Kubernetes context on each line',
          spec: 'node · pod · container · image · labels · multiline',
        },
        {
          icon: Database,
          title: 'Store & query',
          sub: 'Your VPC, your data',
          spec: 'SELECT * FROM logs · indexed · VPC or on-prem · no Elasticsearch',
        },
      ]}
      featuresHeading="Everything you need to run logs yourself"
      featuresSub="Zero-touch collection, SQL exploration, and a crash-safe pipeline, without babysitting a search cluster."
      features={[
        {
          icon: FileText,
          title: 'Zero-touch collection',
          body: 'A per-node DaemonSet in Kubernetes and a lightweight agent on VMs tail every container. No sidecars, SDKs, or code changes.',
          chips: ['DaemonSet', 'VM agent'],
          big: true,
        },
        {
          icon: Filter,
          title: 'Kubernetes-aware enrichment',
          body: 'Every line is tagged with host, node, container, image and pod labels for precise filtering.',
          chips: ['labels', 'multiline'],
        },
        {
          icon: Search,
          title: 'SQL log explorer',
          body: 'SELECT * FROM logs with namespace / pod / node fields, time-range presets and stream selection, on the same timeline Observability uses.',
          chips: ['SQL', 'indexed'],
        },
        {
          icon: Zap,
          title: 'Fast at production volume',
          body: 'Indexed queries across live and historical logs, filtered by any Kubernetes label.',
          chips: ['sub-second', 'live tail'],
        },
        {
          icon: Shield,
          title: 'Self-hosted',
          body: 'Run entirely on-prem or in your VPC. No Elasticsearch cluster to babysit.',
          chips: ['VPC', 'on-prem'],
        },
        {
          icon: Cpu,
          title: 'Crash-safe pipeline',
          body: 'Write-ahead log and checkpoints survive pod restarts, so no line is lost.',
          chips: ['WAL', 'checkpoints'],
        },
      ]}
      spotlight={{
        tag: 'Own your logs',
        title: 'Query logs in SQL. Keep them in your VPC.',
        body: 'Logs stay in infrastructure you control, so you query with SQL instead of babysitting an Elasticsearch cluster.',
        steps: [
          'DaemonSet + VM agents start tailing in minutes',
          'Lines enriched with namespace, pod, node, labels',
          'Stored in your environment',
          'Queried with SELECT * FROM logs alongside traces',
        ],
        linkTo: '/observability',
        linkLabel: 'See Observability',
        panel: <SpotlightPanel />,
      }}
      ctaHeading="Own your logs. Query them in SQL."
      ctaSub="Set up in minutes across Kubernetes and VMs, query with SQL, and never run an Elasticsearch cluster again."
    />
  )
}
