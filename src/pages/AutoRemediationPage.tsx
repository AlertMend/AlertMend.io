import {
  Workflow, GitBranch, ShieldCheck, MessageSquare, RotateCcw, ClipboardCheck,
  Zap, Play, Eye,
} from 'lucide-react'
import SolutionPageTemplate, {
  Accent,
  ConsoleFrame,
} from '../components/SolutionPageTemplate'

/**
 * /auto-remediation, approved remediation flows (RF) / runbooks.
 */

const SIGNUP_URL = 'https://app.alertmend.io/signup?service=auto-remediation'

function RfConsole() {
  const nodes = [
    { id: '1', label: 'Alert', sub: 'Alertmanager · sev-2', state: 'done' },
    { id: '2', label: 'AI RCA', sub: '94% · pool saturated', state: 'done' },
    { id: '3', label: 'Slack approve', sub: '@alex · ✅', state: 'done' },
    { id: '4', label: 'Scale pool', sub: '20 → 50', state: 'running' },
    { id: '5', label: 'Verify p99', sub: '5m window', state: 'queued' },
    { id: '6', label: 'Summary', sub: 'post to channel', state: 'queued' },
  ]
  const tone: Record<string, string> = {
    done: 'border-emerald-400/30 bg-emerald-500/10 text-emerald-300',
    running: 'border-violet-400/30 bg-violet-500/10 text-violet-200',
    queued: 'border-white/10 bg-white/[0.03] text-white/45',
  }

  return (
    <ConsoleFrame title="RF-1842 · fix-connection-pool · payments">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wide text-white/40">
            Remediation flow
          </div>
          <div className="mt-0.5 text-sm font-semibold text-white">fix-connection-pool</div>
        </div>
        <span className="rounded-md border border-violet-400/30 bg-violet-500/10 px-2.5 py-1 text-[10px] font-bold uppercase text-violet-300">
          2/6 running
        </span>
      </div>

      <div className="mt-3 space-y-1.5">
        {nodes.map((n, i) => (
          <div
            key={n.id}
            className={`flex items-center gap-3 rounded-lg border px-3 py-2 ${tone[n.state]}`}
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-black/20 font-mono text-[10px] font-bold">
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-[12px] font-semibold text-white">{n.label}</div>
              <div className="truncate font-mono text-[10px] text-white/45">{n.sub}</div>
            </div>
            <span className="font-mono text-[10px] font-bold uppercase tracking-wide">
              {n.state}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <span className="rounded-md border border-white/15 px-2 py-1 text-[10px] text-white/55">
          Rollback armed
        </span>
        <span className="rounded-md border border-white/15 px-2 py-1 text-[10px] text-white/55">
          Audit · @alex
        </span>
        <span className="rounded-md border border-white/15 px-2 py-1 text-[10px] text-white/55">
          Slack · #oncall-payments
        </span>
      </div>
    </ConsoleFrame>
  )
}

function SpotlightPanel() {
  return (
    <div className="rounded-[10px] border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-white/55">RF builder · visual</span>
        <span className="rounded-md border border-emerald-400/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
          approved
        </span>
      </div>
      <div className="mt-4 space-y-2 font-mono text-[11px] text-white/65">
        <div className="flex gap-2"><span className="text-emerald-400">✓</span> Trigger: Alertmanager sev≥2</div>
        <div className="flex gap-2"><span className="text-emerald-400">✓</span> Gate: Slack ✅ from on-call</div>
        <div className="flex gap-2"><span className="text-emerald-400">✓</span> Action: kubectl scale + verify</div>
        <div className="flex gap-2"><span className="text-emerald-400">✓</span> Rollback: previous pool size</div>
      </div>
      <div className="mt-4 rounded-lg border border-violet-400/25 bg-violet-500/10 p-3 text-[13px] text-zinc-200">
        Every step is auditable. Nothing runs without the approval policy you set.
      </div>
    </div>
  )
}

export default function AutoRemediationPage() {
  return (
    <SolutionPageTemplate
      seo={{
        title: 'Auto-Remediation & Runbooks',
        description:
          'Approved remediation flows that act on incidents: visual runbooks, Slack and Teams approval gates, Kubernetes and cloud actions, rollback, and an audit trail.',
        keywords:
          'auto-remediation, runbooks, remediation flows, Slack approval, Kubernetes automation, incident response, AlertMend AI',
        canonical: '/auto-remediation',
      }}
      badge="Remediation & runbooks"
      headline={
        <>
          Approved workflows that <Accent>act</Accent>, with an audit trail
        </>
      }
      sub="Visual remediation flows from alert to fix: fan-out, Slack approval, Kubernetes actions, verify, and post the summary back. Suggest → approve → execute, not blind auto-heal."
      signupUrl={SIGNUP_URL}
      checks={['Slack / Teams approval', 'Rollback armed', 'Full audit trail']}
      console={<RfConsole />}
      stepsHeading="Suggest. Approve. Execute."
      stepsSub="The same path every time: evidence in, human gate, action out, proof written back."
      steps={[
        {
          icon: Eye,
          title: 'Suggest',
          sub: 'From RCA or a saved RF',
          spec: 'AI proposes steps or you pick a visual runbook · every action is typed and scoped',
        },
        {
          icon: MessageSquare,
          title: 'Approve',
          sub: 'In Slack or Teams',
          spec: '✅ / 🛑 reactions · wait timers · backup approver · who/when recorded',
        },
        {
          icon: Play,
          title: 'Execute',
          sub: 'Act, verify, roll back',
          spec: 'kubectl / cloud actions · verify window · rollback on regression · channel summary',
        },
      ]}
      featuresHeading="Remediation you can trust at 3am"
      featuresSub="Visual builders, chat-native gates, and SoC-style separation of duties, automation without surprise."
      features={[
        {
          icon: Workflow,
          title: 'Visual remediation flows',
          body: 'Build runbooks as graphs: triggers, branches, approvals, Kubernetes actions, and verify steps, not a wall of YAML.',
          chips: ['RF builder', 'branches'],
          big: true,
        },
        {
          icon: ShieldCheck,
          title: 'Approval gates',
          body: 'Nothing risky runs without Slack or Teams approval. Policies define who can approve what.',
          chips: ['Slack', 'Teams'],
        },
        {
          icon: Zap,
          title: 'Actions that ship',
          body: 'Scale, restart, patch limits, run scripts, with dry-run and scoped credentials.',
          chips: ['kubectl', 'scripts'],
        },
        {
          icon: RotateCcw,
          title: 'Rollback armed',
          body: 'Every apply can carry a rollback path. If verification fails, the previous state comes back.',
          chips: ['verify', 'rollback'],
        },
        {
          icon: ClipboardCheck,
          title: 'Audit trail',
          body: 'Every suggestion, approval, and executed step is recorded with actor and timestamp.',
          chips: ['who/when', 'compliance'],
        },
        {
          icon: GitBranch,
          title: 'PR when you prefer GitOps',
          body: 'Prefer a pull request over a live apply? Generate the diff and review in GitHub before merge.',
          chips: ['PR', 'GitOps'],
        },
      ]}
      spotlight={{
        tag: 'Safe automation',
        title: 'From page to fix without leaving Slack',
        body: 'A sev-2 fires, RCA attaches a prepared RF, on-call taps approve, the pool scales, p99 recovers, and the closing summary posts back, with rollback still armed.',
        steps: [
          'Alert triggers RF-1842',
          'Slack approval from the primary on-call',
          'Scale + verify steps run',
          'Summary posted · audit written',
        ],
        linkTo: '/ai-rca',
        linkLabel: 'See AI RCA',
        panel: <SpotlightPanel />,
      }}
      ctaHeading="Automate the toil. Keep the human gate."
      ctaSub="Start with one approved remediation flow on a noisy alert, then expand with the same audit model."
    />
  )
}
