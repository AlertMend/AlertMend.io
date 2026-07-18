import { useEffect } from 'react'
import {
  FileText, Search, Database, Filter, Zap, Shield, Boxes, Server,
  ArrowRight, CheckCircle2, XCircle, Cloud, Coins, Activity, Cpu, Lock,
} from 'lucide-react'
import SEO from '../components/SEO'

const SIGNUP_URL = 'https://app.alertmend.io/signup?service=log-management'
const DEMO_URL = 'https://calendly.com/hello-alertmend'

/* Log level type, shared by the search console mock below */
type Line = { level: 'INFO' | 'WARN' | 'ERROR' }

/* ------------------------------------------------------------------ */
/* Pipeline stages                                                     */
/* ------------------------------------------------------------------ */

const STAGES = [
  { icon: Boxes, title: 'Collect', sub: 'Every pod and VM container', tone: 'blue', spec: 'DaemonSet (K8s) + agent (VMs) · CRI & Docker JSON · no sidecars' },
  { icon: Filter, title: 'Enrich', sub: 'Kubernetes context on each line', tone: 'purple', spec: 'node · pod · container · image · labels · multiline' },
  { icon: Database, title: 'Store', sub: 'Cost-efficient, in your bucket', tone: 'emerald', spec: 'Parquet + Zstd → your S3 / MinIO · WAL crash-safe' },
  { icon: Search, title: 'Search', sub: 'Live tail + full history', tone: 'amber', spec: 'full-text index · filter any label · sub-second' },
]
const SPEC_CHIPS = ['Rust agent', 'gRPC streaming', 'Parquet + Zstd', 'S3 / MinIO', 'On-prem or VPC', 'No Elasticsearch']
const toneMap: Record<string, string> = {
  blue: 'from-blue-500/20 to-blue-600/5 text-blue-300 ring-blue-400/30',
  purple: 'from-purple-500/20 to-purple-600/5 text-purple-300 ring-purple-400/30',
  emerald: 'from-emerald-500/20 to-emerald-600/5 text-emerald-300 ring-emerald-400/30',
  amber: 'from-amber-500/20 to-amber-600/5 text-amber-300 ring-amber-400/30',
}

/* ------------------------------------------------------------------ */
/* Search console mock                                                 */
/* ------------------------------------------------------------------ */

const FACETS = [
  { label: 'Sources', items: [['Kubernetes', '1.2M'], ['VMs', '480K']] },
  { label: 'Level', items: [['error', '3.4K'], ['warn', '18K'], ['info', '1.2M']] },
  { label: 'Namespace', items: [['payments', '210K'], ['checkout', '96K'], ['auth', '54K']] },
]

type Row = { t: string; level: Line['level']; svc: string; where: string; msg: string }
const ROWS: Row[] = [
  { t: '12:04:33.212', level: 'ERROR', svc: 'payments-api', where: 'pod/payments-api-7d9c', msg: 'OOMKilled: container exceeded memory limit 512Mi' },
  { t: '12:04:33.001', level: 'WARN', svc: 'checkout-web', where: 'pod/checkout-web-5f2', msg: 'upstream timeout after 30s calling payments-api' },
  { t: '12:04:32.884', level: 'ERROR', svc: 'payments-api', where: 'pod/payments-api-7d9c', msg: 'connection reset by peer 10.2.3.4:5432' },
  { t: '12:04:32.140', level: 'INFO', svc: 'auth-svc', where: 'vm/prod-vm-3', msg: 'token refreshed for tenant acme (ttl 3600s)' },
  { t: '12:04:31.702', level: 'WARN', svc: 'prod-vm-3', where: 'vm/prod-vm-3', msg: 'disk usage on /var at 82%' },
  { t: '12:04:31.219', level: 'INFO', svc: 'search-api', where: 'pod/search-api-9ab', msg: 'reindexed 12,480 docs in 1.3s' },
]
const rowLevel: Record<Line['level'], string> = {
  ERROR: 'bg-rose-50 text-rose-700 ring-rose-200',
  WARN: 'bg-amber-50 text-amber-700 ring-amber-200',
  INFO: 'bg-slate-100 text-slate-600 ring-slate-200',
}

/* ------------------------------------------------------------------ */
/* Feature bento                                                       */
/* ------------------------------------------------------------------ */

const FEATURES = [
  { icon: FileText, title: 'Zero-touch collection', body: 'A per-node DaemonSet in Kubernetes and a lightweight agent on VMs tail every container. No sidecars, SDKs, or code changes.', big: true },
  { icon: Filter, title: 'Kubernetes-aware enrichment', body: 'Every line is tagged with host, node, container, image and pod labels for precise filtering.' },
  { icon: Database, title: 'Bring your own bucket', body: 'Compressed Parquet in your own S3 or MinIO. Nothing leaves your cloud.' },
  { icon: Search, title: 'Full-text search', body: 'Sub-second queries across live and historical logs via a built-in inverted index.' },
  { icon: Shield, title: 'Self-hosted', body: 'Run entirely on-prem or in your VPC. No Elasticsearch cluster to babysit.' },
  { icon: Cpu, title: 'Crash-safe pipeline', body: 'Write-ahead log and checkpoints survive pod restarts, so no line is lost.' },
]

const DIFFERENTIATORS = [
  { icon: Zap, label: '1-click agent setup' },
  { icon: Cloud, label: 'Runs on-prem or in your VPC' },
  { icon: Lock, label: 'Bring your own S3 bucket' },
  { icon: Coins, label: 'Cost-efficient storage' },
]

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function LogManagementPage() {
  useEffect(() => window.scrollTo({ top: 0, behavior: 'instant' }), [])

  return (
    <div className="bg-white">
      <SEO
        title="Log Management for Kubernetes & VMs"
        description="Collect, store, and search logs from every container, in Kubernetes or on your VMs. 1-click agent setup, bring your own S3 bucket, on-prem or VPC, with fast full-text search and no Elasticsearch to run."
        keywords="log management, Kubernetes logs, VM logs, container logs, log search, log aggregation, self-hosted logging, AlertMend AI"
        canonical="/log-management"
      />

      {/* ============ HERO (copy + pipeline visual) ============ */}
      <header className="relative overflow-hidden pt-10 pb-6 md:pt-14 md:pb-8 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-purple-50 via-white to-blue-50" />
        <div className="absolute -top-24 -right-24 -z-10 h-96 w-96 rounded-full bg-blue-200/30 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 -z-10 h-96 w-96 rounded-full bg-purple-200/30 blur-3xl" />

        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] text-purple-950">
            Centralized Logs,<br className="hidden sm:block" />{' '}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-purple-800 bg-clip-text text-transparent">Instant Search</span>
          </h1>
          <p className="mt-5 text-lg md:text-xl leading-relaxed text-purple-700 max-w-2xl mx-auto">
            Collect logs from every Kubernetes pod and VM container, keep them in your own bucket, and search them in seconds.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-x-3 gap-y-3">
            {DIFFERENTIATORS.map((d) => (
              <div key={d.label} className="inline-flex items-center gap-2 rounded-full border border-purple-200/70 bg-white px-4 py-2 shadow-sm">
                <d.icon className="h-4 w-4 text-purple-600 shrink-0" />
                <span className="text-sm font-semibold text-purple-800">{d.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a href={DEMO_URL} target="_blank" rel="noreferrer"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-800 to-purple-900 px-8 py-3.5 font-semibold !text-white shadow-lg hover:shadow-xl hover:scale-[1.03] transition-all">
              Book a Demo <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a href={SIGNUP_URL} target="_blank" rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-purple-800 px-8 py-3.5 font-semibold !text-purple-900 hover:bg-purple-50 transition-all">
              Start Free Trial
            </a>
          </div>
        </div>

        {/* Pipeline visual, part of the first screen */}
        <div className="max-w-6xl mx-auto mt-12 md:mt-14 rounded-3xl bg-gradient-to-br from-slate-950 to-purple-950 p-6 md:p-8 shadow-2xl">
          <p className="text-center text-xs md:text-sm font-bold uppercase tracking-wider text-blue-300">
            From container to searchable in one hop
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {STAGES.map((s, i) => (
              <div key={s.title} className="relative">
                <div className={`h-full rounded-2xl bg-gradient-to-b ${toneMap[s.tone]} ring-1 p-5 backdrop-blur`}>
                  <div className="flex items-center gap-2 text-xs font-bold text-white/50">STEP {i + 1}</div>
                  <s.icon className="mt-3 h-7 w-7" />
                  <h3 className="mt-3 text-base font-bold text-white">{s.title}</h3>
                  <p className="mt-1 text-sm text-slate-300">{s.sub}</p>
                  <p className="mt-3 pt-3 border-t border-white/10 font-mono text-[11px] leading-5 text-slate-400">{s.spec}</p>
                </div>
                {i < STAGES.length - 1 && (
                  <div className="hidden md:flex absolute top-1/2 -right-2 z-10 -translate-y-1/2 items-center justify-center h-6 w-6 rounded-full bg-white text-slate-900 shadow">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {SPEC_CHIPS.map((c) => (
              <span key={c} className="rounded-full border border-white/15 bg-white/5 px-3 py-1 font-mono text-xs text-slate-300">{c}</span>
            ))}
          </div>
        </div>
      </header>

      {/* ============ SEARCH CONSOLE MOCK ============ */}
      <section className="px-4 sm:px-6 lg:px-8 pt-8 pb-16 md:pt-8 md:pb-20 bg-gradient-to-b from-white to-purple-50/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-sm font-bold uppercase tracking-wider text-purple-600">Search</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-purple-950">Find any log line in seconds</h2>
            <p className="mt-3 text-purple-700">Filter by namespace, pod, container, host, or any label. Live tail and historical search use the same query.</p>
          </div>

          <div className="rounded-2xl border border-purple-200/60 bg-white shadow-2xl overflow-hidden">
            {/* search bar */}
            <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3">
              <Search className="h-4 w-4 text-slate-400 shrink-0" />
              <div className="flex flex-wrap items-center gap-1.5 font-mono text-sm">
                <span className="rounded bg-purple-100 px-2 py-0.5 text-purple-700">level:error</span>
                <span className="rounded bg-blue-100 px-2 py-0.5 text-blue-700">namespace:payments</span>
                <span className="text-slate-500">timeout</span>
                <span className="inline-block h-4 w-px bg-slate-300 animate-pulse" />
              </div>
              <span className="ml-auto hidden sm:flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                <Activity className="h-3.5 w-3.5" /> 1.24M lines · 38ms
              </span>
            </div>

            <div className="grid md:grid-cols-[200px_1fr]">
              {/* facets */}
              <aside className="hidden md:block border-r border-slate-200 p-4 bg-slate-50/60">
                {FACETS.map((f) => (
                  <div key={f.label} className="mb-5 last:mb-0">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">{f.label}</div>
                    <ul className="space-y-1.5">
                      {f.items.map(([k, v]) => (
                        <li key={k} className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">{k}</span>
                          <span className="text-slate-400 tabular-nums">{v}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </aside>

              {/* results */}
              <div className="divide-y divide-slate-100 font-mono text-[12.5px]">
                {ROWS.map((r, i) => (
                  <div key={i} className="flex items-start gap-3 px-4 py-2.5 hover:bg-purple-50/50 transition-colors">
                    <span className="shrink-0 text-slate-400 tabular-nums">{r.t}</span>
                    <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ring-1 ${rowLevel[r.level]}`}>{r.level}</span>
                    <span className="shrink-0 text-purple-700 font-semibold">{r.svc}</span>
                    <span className="hidden lg:inline shrink-0 text-slate-400">{r.where}</span>
                    <span className="text-slate-700 truncate">{r.msg}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ COST ============ */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="relative max-w-6xl mx-auto overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-purple-800 to-purple-950 p-8 md:p-14 shadow-2xl">
          <div className="absolute -top-16 -right-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl" />

          <div className="relative text-center max-w-3xl mx-auto">
            <span className="text-sm font-bold uppercase tracking-wider text-blue-200">Cost</span>
            <h2 className="mt-3 text-3xl md:text-5xl font-bold text-white leading-tight">
              Keep every log.<br className="hidden sm:block" /> Pay cloud-storage prices.
            </h2>
            <p className="mt-5 text-lg md:text-xl text-purple-100">
              Your logs live in your own bucket as compressed Parquet, so you pay cheap object-storage rates, not per-GB ingestion fees or an always-on search cluster.
            </p>
          </div>

          <div className="relative mt-10 grid gap-5 md:grid-cols-2 max-w-4xl mx-auto">
            {/* Ordinary setup */}
            <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-6 md:p-7">
              <h3 className="text-sm font-bold uppercase tracking-wider text-purple-200/70">Typical hosted logging</h3>
              <ul className="mt-5 space-y-3.5">
                {[
                  'Per-GB ingestion fees on every log line',
                  'Separate charges to retain history',
                  'Always-on search cluster to run and scale',
                  'Data leaves your cloud, plus egress',
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-300/80" />
                    <span className="text-purple-100/70 leading-relaxed">{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* AlertMend */}
            <div className="rounded-2xl bg-white/15 ring-2 ring-white/30 p-6 md:p-7 shadow-xl backdrop-blur">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">AlertMend</h3>
              <ul className="mt-5 space-y-3.5">
                {[
                  'Object-storage rates for your own bucket',
                  'Compressed Parquet keeps history cheap',
                  'No cluster to run, scale, or pay for',
                  'Data never leaves your cloud',
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
                    <span className="font-medium text-white leading-relaxed">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FEATURE BENTO ============ */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-sm font-bold uppercase tracking-wider text-purple-600">Capabilities</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-purple-950">Everything you need to run logs yourself</h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title}
                className="group rounded-2xl border border-slate-200/70 bg-white p-7 shadow-sm hover:shadow-xl hover:border-purple-200 hover:-translate-y-1 transition-all duration-300">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-blue-100 text-purple-700 group-hover:scale-110 transition-transform">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-purple-950">{f.title}</h3>
                <p className="mt-2 text-purple-700 leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="px-4 sm:px-6 lg:px-8 pb-24">
        <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-br from-purple-800 to-purple-950 px-8 py-14 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-white/5 blur-2xl" />
          <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-blue-400/10 blur-2xl" />
          <Server className="mx-auto h-10 w-10 text-blue-300" />
          <h2 className="mt-5 text-3xl md:text-4xl font-bold text-white">Own your logs. Search them in seconds.</h2>
          <p className="mt-4 text-lg text-purple-100 max-w-2xl mx-auto">
            Set up in minutes across Kubernetes and VMs, keep every line in your own bucket, and never run a log cluster again.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a href={DEMO_URL} target="_blank" rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-3.5 font-semibold !text-purple-900 hover:scale-[1.03] transition-transform shadow-lg">
              Book a Demo <ArrowRight className="h-4 w-4" />
            </a>
            <a href={SIGNUP_URL} target="_blank" rel="noreferrer"
              className="inline-flex items-center justify-center rounded-xl border-2 border-white/70 bg-white/5 px-8 py-3.5 font-semibold !text-white hover:bg-white/15 transition-colors">
              Start Free Trial
            </a>
          </div>
          <div className="mt-7 flex flex-wrap justify-center gap-6 text-sm text-purple-200">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> No credit card required</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> Set up in minutes</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> Self-hosted option</span>
          </div>
        </div>
      </section>
    </div>
  )
}
