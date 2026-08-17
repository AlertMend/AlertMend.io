import {
  DollarSign, Gauge, FileCode2, Trash2, Cloud, ShieldCheck,
  BarChart3, Lightbulb, Rocket,
} from 'lucide-react'
import SolutionPageTemplate, {
  Accent,
  ConsoleFrame,
} from '../components/SolutionPageTemplate'

/**
 * /kubernetes-cost-optimization, redesigned product page. Console mock
 * shows spend-by-namespace with requested-vs-used and a right-sizing
 * recommendation with YAML preview & apply.
 */

const SIGNUP_URL = 'https://app.alertmend.io/signup?service=cost-optimization'

/* FinOps console: namespace spend bars (requested vs used) + recommendation */
function CostConsole() {
  const rows = [
    { ns: 'payments', spend: '$1,842', req: 92, used: 34 },
    { ns: 'observability', spend: '$1,210', req: 78, used: 51 },
    { ns: 'checkout', spend: '$964', req: 64, used: 48 },
    { ns: 'auth', spend: '$488', req: 38, used: 29 },
  ]
  return (
    <ConsoleFrame title="finops · prod-us-west-2 · last 30d">
      <div className="flex items-baseline justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-wide text-white/45">Cluster spend / mo</div>
          <div className="text-xl font-bold text-white">$4,504</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-wide text-white/45">Recoverable</div>
          <div className="text-xl font-bold text-emerald-400">$1,378</div>
        </div>
      </div>

      <div className="mt-3 space-y-2.5">
        {rows.map((r) => (
          <div key={r.ns}>
            <div className="flex justify-between font-mono text-[10.5px] text-white/55">
              <span>{r.ns}</span>
              <span>{r.spend}</span>
            </div>
            <div className="relative mt-1 h-2.5 overflow-hidden rounded bg-white/[0.07]">
              <span
                className="absolute top-0 h-2.5 rounded bg-white/20"
                style={{ width: `${r.req}%` }}
              />
              <span
                className="absolute top-0 h-2.5 rounded bg-violet-500"
                style={{ width: `${r.used}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-4 font-mono text-[9.5px] text-white/45">
        <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-violet-500" /> used</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-white/20" /> requested</span>
      </div>

      <div className="mt-3 rounded-lg border border-emerald-400/25 bg-emerald-500/[0.07] px-3 py-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-white">payments-api · right-size CPU 2000m → 750m</span>
          <span className="font-mono text-[10.5px] font-bold text-emerald-400">save $412/mo</span>
        </div>
        <div className="mt-2 flex gap-2">
          <span className="rounded-md bg-white px-2.5 py-1 text-[10px] font-bold text-zinc-950">Preview YAML</span>
          <span className="rounded-md border border-white/20 px-2.5 py-1 text-[10px] font-bold text-white/85">Apply to cluster</span>
        </div>
      </div>
    </ConsoleFrame>
  )
}

/* Spotlight panel: YAML diff preview */
function SpotlightPanel() {
  return (
    <div className="rounded-[10px] border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-white/55">deploy/payments-api/values.yaml</span>
        <span className="rounded-md border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
          −$412/mo
        </span>
      </div>
      <div className="mt-3 overflow-hidden rounded-lg border border-white/10 bg-black/40 p-3.5 font-mono text-[11px] leading-relaxed">
        <div className="text-white/40">resources:</div>
        <div className="text-white/40">&nbsp;&nbsp;requests:</div>
        <div className="bg-rose-500/10 text-rose-300">−&nbsp;&nbsp;&nbsp;cpu: 2000m</div>
        <div className="bg-emerald-500/10 text-emerald-300">+&nbsp;&nbsp;&nbsp;cpu: 750m</div>
        <div className="bg-rose-500/10 text-rose-300">−&nbsp;&nbsp;&nbsp;memory: 4Gi</div>
        <div className="bg-emerald-500/10 text-emerald-300">+&nbsp;&nbsp;&nbsp;memory: 1.5Gi</div>
      </div>
      <div className="mt-3 space-y-1.5 font-mono text-[11px] text-white/55">
        <div><span className="text-emerald-400">✓</span> based on p95 usage over 30 days + headroom</div>
        <div><span className="text-emerald-400">✓</span> approval required · rollback on regression</div>
      </div>
      <div className="mt-3 flex gap-2">
        <span className="rounded-md bg-white px-3 py-1.5 text-xs font-bold text-zinc-950">Apply with approval</span>
        <span className="rounded-lg border border-white/20 px-3 py-1.5 text-xs font-bold text-white/85">Open PR instead</span>
      </div>
    </div>
  )
}

export default function KubernetesCostOptimizationPage() {
  return (
    <SolutionPageTemplate
      seo={{
        title: 'Kubernetes & AWS Cost Optimization (FinOps)',
        description:
          'See Kubernetes and AWS spend by namespace, workload and controller. Right-sizing with YAML preview, idle cleanup, and EC2, RDS and ELB line items.',
        keywords:
          'Kubernetes cost optimization, FinOps, right-sizing, requested vs used, cloud cost, AWS cost optimization, EC2 RDS savings, idle resources, YAML apply, AlertMend AI',
        canonical: '/kubernetes-cost-optimization',
      }}
      badge="FinOps"
      headline={
        <>
          <Accent>Cut the bill</Accent> without touching reliability
        </>
      }
      sub="Spend by namespace, workload and controller, with requested-vs-used side by side. Apply right-sizing with a YAML preview, approvals and rollback, and see AWS line items in the same view."
      signupUrl={SIGNUP_URL}
      checks={['Requested vs used', 'YAML preview & apply', 'EC2 / RDS / ELB line items']}
      console={<CostConsole />}
      stepsHeading="Measure. Recommend. Apply."
      stepsSub="No spreadsheets and no blind edits, every recommendation carries its evidence and its escape hatch."
      steps={[
        {
          icon: BarChart3,
          title: 'Measure',
          sub: 'Spend where it actually happens',
          spec: 'per namespace, workload and controller · requested vs used from live metrics · 30-day windows',
        },
        {
          icon: Lightbulb,
          title: 'Recommend',
          sub: 'Right-sizing with evidence',
          spec: 'p95 usage + headroom → concrete requests/limits · idle EC2, unattached volumes, forgotten RDS flagged',
        },
        {
          icon: Rocket,
          title: 'Apply',
          sub: 'Preview, approve, roll back',
          spec: 'YAML diff preview · cluster apply or PR · approval-gated with rollback on regression',
        },
      ]}
      featuresHeading="FinOps that engineers actually run"
      featuresSub="Cost data joined to the same metrics and workloads the rest of the platform watches, so savings never fight reliability."
      features={[
        {
          icon: DollarSign,
          title: 'Spend by namespace & workload',
          body: 'The bill broken down where decisions get made: namespace, workload, controller, not one opaque cloud invoice.',
          chips: ['namespace', 'workload', 'controller'],
          big: true,
        },
        {
          icon: Gauge,
          title: 'Requested vs used',
          body: 'See over-provisioning directly: what each workload asks for versus what it actually consumes at p95.',
          chips: ['p95', 'headroom'],
        },
        {
          icon: FileCode2,
          title: 'YAML preview & apply',
          body: 'Every right-sizing change shows its exact YAML diff before anything touches the cluster, apply directly or open a PR.',
          chips: ['diff', 'PR', 'cluster apply'],
        },
        {
          icon: Trash2,
          title: 'Idle cleanup',
          body: 'Idle instances, unattached volumes and forgotten resources surfaced with their monthly cost, ready to reclaim.',
          chips: ['idle EC2', 'volumes'],
        },
        {
          icon: Cloud,
          title: 'AWS line items',
          body: 'EC2, RDS and ELB spend in the same view as your Kubernetes costs, scoped by environment.',
          chips: ['EC2', 'RDS', 'ELB'],
        },
        {
          icon: ShieldCheck,
          title: 'Guardrails',
          body: 'Approval-gated changes, rollback on regression, and a full audit trail, savings without surprise incidents.',
          chips: ['approvals', 'rollback', 'audit'],
        },
      ]}
      spotlight={{
        tag: 'A recommendation, end to end',
        title: 'From “why is the bill up?” to a merged diff',
        body: 'payments-api requests 2 CPUs and uses a third of one. AlertMend shows the gap, writes the exact YAML change, and applies it behind an approval, with rollback armed if latency regresses.',
        steps: [
          'Requested-vs-used gap flagged on payments-api',
          'Recommendation: CPU 2000m → 750m, memory 4Gi → 1.5Gi',
          'YAML diff previewed · approved in one click',
          'Applied with rollback armed · $412/mo recovered',
        ],
        linkTo: '/kubernetes-management',
        linkLabel: 'See Kubernetes management',
        panel: <SpotlightPanel />,
      }}
      ctaHeading="Find out what your cluster really needs"
      ctaSub="Connect a cluster and get requested-vs-used plus right-sizing recommendations on day one, read-only until you approve a change."
    />
  )
}
