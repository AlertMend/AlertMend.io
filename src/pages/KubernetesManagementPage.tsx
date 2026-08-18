import {
  Boxes, Activity, ShieldCheck, Search, MessageSquare, Database,
  PlugZap, Eye, Wrench,
} from 'lucide-react'
import SolutionPageTemplate, {
  Accent,
} from '../components/SolutionPageTemplate'

/**
 * /kubernetes-management, product page built on SolutionPageTemplate (white
 * split hero + cluster-overview board mock). Every claim maps to a real
 * product surface: cluster overview, incident cards, health rules,
 * drill-down, AI chat, SQL logs.
 */

const SIGNUP_URL = 'https://app.alertmend.io/signup?service=monitoring'

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
      highlightProduct="k8s"
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
