import {
  FileText, Search, Database, Filter, Shield, Boxes, Cpu, Zap,
} from 'lucide-react'
import SolutionPageTemplate, {
  Accent,
} from '../components/SolutionPageTemplate'

/**
 * /log-management — SQL logs for Kubernetes + VMs.
 */

const SIGNUP_URL = 'https://app.alertmend.io/signup?service=log-management'

/**
 * Defines the term the rest of the page leans on. Grounded in the real
 * /logs behaviour documented at /documentation/logs-query: SELECT-only,
 * must target `FROM logs`, time range comes from the UI picker, and a
 * no-SQL filter mode exists alongside it.
 */
function SqlLogsExplainer() {
  const fields = [
    'severity',
    'message',
    'kubernetes_namespace_name',
    'kubernetes_pod_name',
    'service',
    'trace_id',
  ]

  return (
    <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:gap-14">
      <div>
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-violet-700">
          The short answer
        </span>
        <h2 className="mt-3 text-[1.65rem] font-bold tracking-tight text-zinc-950 md:text-3xl">
          What &ldquo;SQL logs&rdquo; actually means
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-zinc-600">
          Most logging tools make you learn a proprietary search syntax. AlertMend does not.
          Every log line we collect is stored as a row, and the things you filter on are
          ordinary columns: severity, message, service, trace ID, and the full Kubernetes
          context of the pod that emitted it. So you search your logs with the{' '}
          <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[13px] text-zinc-800">
            SELECT
          </code>{' '}
          statement you already know.
        </p>
        <p className="mt-3.5 text-[15px] leading-relaxed text-zinc-600">
          It is a real query, not a search box with SQL styling. You pick the columns you want
          back, filter with <span className="font-medium text-zinc-800">WHERE</span>, and sort
          with <span className="font-medium text-zinc-800">ORDER BY</span>.
        </p>

        <dl className="mt-7 grid gap-3 sm:grid-cols-3">
          {[
            { t: 'Read-only', d: 'Only SELECT runs. Nothing can mutate or delete a log line.' },
            { t: 'One table', d: 'Every query targets FROM logs. No schema hunting.' },
            { t: 'Time in the UI', d: 'The range picker controls the window, not your query text.' },
          ].map((x) => (
            <div key={x.t} className="rounded-[10px] border border-zinc-200/80 bg-zinc-50/70 p-3.5">
              <dt className="text-[13px] font-semibold text-zinc-950">{x.t}</dt>
              <dd className="mt-1 text-[12.5px] leading-relaxed text-zinc-500">{x.d}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-6 text-[13.5px] leading-relaxed text-zinc-500">
          Prefer not to write SQL? The same explorer has a filter mode where you type
          predicates and AlertMend builds the statement for you. Note that log SQL is separate
          from AT-QL, which selects pods, nodes and VMs for automation targeting.
        </p>
      </div>

      <div className="grid gap-3">
        <div className="overflow-hidden rounded-[10px] border border-zinc-200/80 bg-white">
          <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-2.5">
            <span className="text-[12px] font-semibold text-zinc-950">SQL mode</span>
            <span className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[10.5px] text-zinc-500">
              default
            </span>
          </div>
          <pre className="overflow-x-auto px-4 py-3.5 font-mono text-[12.5px] leading-[1.7] text-zinc-700">
            <code>
              <span className="text-violet-700">SELECT</span> _timestamp, kubernetes_pod_name, message{'\n'}
              <span className="text-violet-700">FROM</span> logs{'\n'}
              <span className="text-violet-700">WHERE</span> kubernetes_namespace_name ={' '}
              <span className="text-emerald-700">&apos;production&apos;</span>{'\n'}
              {'  '}<span className="text-violet-700">AND</span> severity ={' '}
              <span className="text-emerald-700">&apos;ERROR&apos;</span>{'\n'}
              <span className="text-violet-700">ORDER BY</span> _timestamp <span className="text-violet-700">DESC</span>
            </code>
          </pre>
        </div>

        <div className="overflow-hidden rounded-[10px] border border-zinc-200/80 bg-white">
          <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-2.5">
            <span className="text-[12px] font-semibold text-zinc-950">Filter mode</span>
            <span className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[10.5px] text-zinc-500">
              no SQL
            </span>
          </div>
          <pre className="overflow-x-auto px-4 py-3.5 font-mono text-[12.5px] leading-[1.7] text-zinc-700">
            <code>
              kubernetes_namespace_name = <span className="text-emerald-700">&apos;production&apos;</span>{'\n'}
              <span className="text-violet-700">and</span> severity ={' '}
              <span className="text-emerald-700">&apos;ERROR&apos;</span>
            </code>
          </pre>
        </div>

        <div className="rounded-[10px] border border-zinc-200/80 bg-zinc-50/70 p-4">
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
            Columns you filter on
          </div>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {fields.map((f) => (
              <span
                key={f}
                className="rounded-md border border-zinc-200 bg-white px-2 py-0.5 font-mono text-[11.5px] text-zinc-600"
              >
                {f}
              </span>
            ))}
            <span className="rounded-md border border-dashed border-zinc-300 px-2 py-0.5 font-mono text-[11.5px] text-zinc-400">
              + node, container, image, labels
            </span>
          </div>
        </div>
      </div>
    </div>
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
          'Query Kubernetes and VM logs with plain SQL. Every line is a row, with pod, namespace and severity as columns. Self-host in your VPC. No Elasticsearch.',
        keywords:
          'log management, Kubernetes logs, SQL logs, VM logs, container logs, self-hosted logging, AlertMend',
        canonical: '/log-management',
      }}
      badge="Log management"
      headline={
        <>
          Search your logs with <Accent>SQL you already know</Accent>
        </>
      }
      sub="Every line from your Kubernetes pods and VMs becomes a row you can query with SELECT, where pod, namespace and severity are just columns. No proprietary search syntax to learn, and no Elasticsearch to run."
      signupUrl={SIGNUP_URL}
      checks={['No new query language', 'K8s + VM collection', 'Runs in your VPC']}
      highlightProduct="logs"
      explainer={<SqlLogsExplainer />}
      stepsHeading="From container to searchable in one hop"
      stepsSub="Collect every line, enrich it with the Kubernetes context of the pod that emitted it, store it where you control it, then query it."
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
      featuresSub="Zero-touch collection, a query language you already know, and a crash-safe pipeline, without babysitting a search cluster."
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
          body: 'Pick your columns, filter with WHERE on any pod, namespace or severity field, and sort by timestamp. Queries are read-only and land on the same timeline Observability uses.',
          chips: ['SELECT only', 'indexed'],
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
        title: 'Your data stays in your cloud',
        body: 'Logs live in infrastructure you control, so there are no per-GB ingestion bills and no search cluster to keep alive.',
        steps: [
          'DaemonSet + VM agents start tailing in minutes',
          'Lines enriched with namespace, pod, node, labels',
          'Stored in your environment',
          'Queried with SELECT, alongside your traces',
        ],
        linkTo: '/observability',
        linkLabel: 'See Observability',
        panel: <SpotlightPanel />,
      }}
      ctaHeading="Own your logs. Query them with SELECT."
      ctaSub="Set up in minutes across Kubernetes and VMs, search with SQL you already know, and never run an Elasticsearch cluster again."
    />
  )
}
