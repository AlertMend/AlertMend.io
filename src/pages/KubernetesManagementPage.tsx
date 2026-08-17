import {
  Boxes, Activity, ShieldCheck, Search, MessageSquare, Database,
  PlugZap, Eye, Wrench,
} from 'lucide-react'
import SolutionPageTemplate, {
  Accent,
  ConsoleFrame,
} from '../components/SolutionPageTemplate'

/**
 * /kubernetes-management, redesigned product page (dark violet hero +
 * cluster-overview console mock), replacing the legacy SolutionDetailPage
 * template. Every claim maps to a real product surface: cluster overview,
 * incident cards, health rules, drill-down, AI chat, SQL logs.
 */

const SIGNUP_URL = 'https://app.alertmend.io/signup?service=monitoring'

/* Cluster-overview console mock: KPI chips + incident rows + node strip */
function ClusterConsole() {
  const kpis = [
    { label: 'Pods', value: '1,247', sub: '↑ 12' },
    { label: 'Nodes', value: '24', sub: 'healthy' },
    { label: 'Deploys', value: '89', sub: '3 rolling' },
    { label: 'Namespaces', value: '17', sub: '' },
  ]
  const incidents = [
    { sev: 'CRIT', tone: 'text-rose-300 bg-rose-500/10 border-rose-400/30', name: 'RESTART STORM', where: 'log-ingester-86b9968-cvklg · ns: observability' },
    { sev: 'WARN', tone: 'text-amber-300 bg-amber-500/10 border-amber-400/30', name: 'OOMKilled', where: 'payments-svc-7c4d8f-q9p2m · ns: payments' },
    { sev: 'WARN', tone: 'text-amber-300 bg-amber-500/10 border-amber-400/30', name: 'Rollout stuck', where: 'checkout-web v2.31.4 · 3/8 ready' },
  ]
  return (
    <ConsoleFrame title="cluster-overview · prod-us-west-2">
      <div className="grid grid-cols-4 gap-2.5">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 py-2.5">
            <div className="text-[10px] uppercase tracking-wide text-white/45">{k.label}</div>
            <div className="mt-0.5 flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-white">{k.value}</span>
              <span className="text-[10px] font-semibold text-emerald-400">{k.sub}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 space-y-2">
        {incidents.map((i) => (
          <div key={i.name} className="flex items-center gap-3 rounded-lg border border-white/[0.07] bg-white/[0.02] px-3 py-2.5">
            <span className={`rounded border px-1.5 py-0.5 font-mono text-[9px] font-bold ${i.tone}`}>{i.sev}</span>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-white">{i.name}</div>
              <div className="truncate font-mono text-[10px] text-white/45">{i.where}</div>
            </div>
            <span className="rounded-md border border-violet-400/30 bg-violet-500/10 px-2.5 py-1 text-[10px] font-bold text-violet-300">
              View RCA
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-1.5">
        {Array.from({ length: 24 }).map((_, i) => (
          <span
            key={i}
            className={`h-5 flex-1 rounded-sm ${i === 7 ? 'bg-amber-500/70' : i === 15 ? 'bg-amber-500/50' : 'bg-emerald-500/45'}`}
          />
        ))}
      </div>
      <div className="mt-1.5 flex justify-between font-mono text-[9.5px] text-white/40">
        <span>24 nodes</span>
        <span>2 under memory pressure</span>
      </div>
    </ConsoleFrame>
  )
}

/* Spotlight panel: incident → RCA → runbook */
function SpotlightPanel() {
  return (
    <div className="rounded-[10px] border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-white/55">INC-08472 · log-ingester</span>
        <span className="rounded-md border border-rose-400/30 bg-rose-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase text-rose-300">
          CrashLoopBackOff · 50 restarts
        </span>
      </div>
      <div className="mt-4 space-y-2.5 font-mono text-[11px] text-white/65">
        <div className="flex gap-2"><span className="text-emerald-400">✓</span> Pulled pod events, logs, metrics from the last 15m</div>
        <div className="flex gap-2"><span className="text-emerald-400">✓</span> Cross-checked cluster state and recent deploys</div>
        <div className="flex gap-2"><span className="text-emerald-400">✓</span> Matched failure pattern: ephemeral-storage eviction</div>
      </div>
      <div className="mt-4 rounded-lg border border-violet-400/30 bg-violet-500/10 p-4">
        <div className="text-xs font-bold text-violet-300">Root cause · confidence 92%</div>
        <p className="mt-1.5 text-sm leading-relaxed text-zinc-200">
          Ephemeral-storage limit too low for the new log buffer in{' '}
          <b className="text-white">v2.31.4</b>. Raise limit 1Gi → 4Gi in{' '}
          <span className="font-mono text-[11.5px]">values.yaml</span>.
        </p>
        <div className="mt-3 flex gap-2">
          <span className="rounded-md bg-white px-3 py-1.5 text-xs font-bold text-zinc-950">Generate PR</span>
          <span className="rounded-md border border-white/20 px-3 py-1.5 text-xs font-bold text-white/85">Run runbook</span>
        </div>
      </div>
    </div>
  )
}

export default function KubernetesManagementPage() {
  return (
    <SolutionPageTemplate
      seo={{
        title: 'Kubernetes Monitoring & Management with AI',
        description:
          'One overview for every cluster: live CrashLoopBackOff and OOMKilled incidents, health rules without YAML redeploys, pod and node drill-down, and AI root cause.',
        keywords:
          'Kubernetes management, Kubernetes monitoring, cluster overview, CrashLoopBackOff, OOMKilled, health rules, Kubernetes incidents, AI root cause, Kubernetes logs, AlertMend AI',
        canonical: '/kubernetes-management',
      }}
      badge="Kubernetes management"
      headline={
        <>
          Run Kubernetes like it has an <Accent>SRE team built in</Accent>
        </>
      }
      sub="Every cluster on one overview: live incidents, health rules, pod and node drill-down, and AI root cause one click away, without leaving the page."
      signupUrl={SIGNUP_URL}
      checks={['Multi-cluster', 'Agent install in minutes', 'RBAC & audit built in']}
      console={<ClusterConsole />}
      stepsHeading="From kubeconfig to covered in one afternoon"
      stepsSub="Connect a cluster, let the health rules watch it, and act on incidents with evidence attached."
      steps={[
        {
          icon: PlugZap,
          title: 'Connect',
          sub: 'One agent per cluster',
          spec: 'Helm install in minutes · works with EKS, GKE, AKS and self-managed · no sidecars',
        },
        {
          icon: Eye,
          title: 'Watch',
          sub: 'Health rules + live incidents',
          spec: 'restart storms · OOMKilled · stuck rollouts · PVC and job failures surface as cards',
        },
        {
          icon: Wrench,
          title: 'Act',
          sub: 'RCA → fix, with approval',
          spec: 'View RCA on any card · generate a PR or run an approved runbook · full audit trail',
        },
      ]}
      featuresHeading="The Kubernetes surfaces, connected"
      featuresSub="Overview, incidents, health, logs and chat share one data model, a click on any card lands in the evidence."
      features={[
        {
          icon: Boxes,
          title: 'Cluster overview',
          body: 'Scope by cluster and duration; pods, nodes, deploys and namespaces at a glance with active incidents front and center.',
          chips: ['multi-cluster', 'incidents', 'drill-down'],
          big: true,
        },
        {
          icon: Activity,
          title: 'Incident detection',
          body: 'Restart storms, OOMKilled, ContainerCreating hangs and stuck rollouts detected from live cluster state, not just threshold alerts.',
          chips: ['patterns', 'live state'],
        },
        {
          icon: ShieldCheck,
          title: 'Health rules',
          body: 'Per-cluster monitors for pods, nodes, PVCs, jobs and deploys. Toggle severity and state operationally, without redeploying YAML.',
          chips: ['no-YAML', 'per-cluster'],
        },
        {
          icon: Search,
          title: 'Pod & node drill-down',
          body: 'From any incident card into pod metrics, logs, events and resource details, the evidence chain stays connected.',
          chips: ['metrics', 'events', 'logs'],
        },
        {
          icon: MessageSquare,
          title: 'AI cluster chat',
          body: 'Ask questions in plain language, answered from your real inventory, events, logs and metrics, not generic suggestions.',
          chips: ['grounded', 'natural language'],
        },
        {
          icon: Database,
          title: 'Logs you query in SQL',
          body: 'SELECT * FROM logs with namespace, pod and node fields. Fast at production volume.',
          chips: ['SQL', 'indexed'],
        },
      ]}
      spotlight={{
        tag: 'A real incident, end to end',
        title: 'CrashLoopBackOff at 2pm, PR merged by 2:09',
        body: 'A log-ingester pod starts crash-looping after a deploy. AlertMend detects the restart storm, pulls the evidence, writes the root cause, and hands you a ready-to-merge fix.',
        steps: [
          'Restart storm detected on log-ingester (50 restarts)',
          'Events, logs and metrics collected automatically',
          'Root cause: ephemeral-storage eviction after v2.31.4',
          'One click: PR raising the storage limit, with rollback',
        ],
        linkTo: '/ai-rca',
        linkLabel: 'See how AI RCA works',
        panel: <SpotlightPanel />,
      }}
      ctaHeading="Point it at a cluster and watch it work"
      ctaSub="Connect one cluster free, the overview, health rules and AI RCA are live within the hour."
    />
  )
}
