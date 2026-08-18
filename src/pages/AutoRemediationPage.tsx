import {
  Workflow, GitBranch, ShieldCheck, MessageSquare, RotateCcw, ClipboardCheck,
  Zap, Play, Eye,
} from 'lucide-react'
import SolutionPageTemplate, {
  Accent,
} from '../components/SolutionPageTemplate'

/**
 * /auto-remediation, approved remediation flows (RF) / runbooks.
 */

const SIGNUP_URL = 'https://app.alertmend.io/signup?service=auto-remediation'

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
        title: 'Auto-Remediation & Approved Runbooks | AlertMend',
        description:
          'Approved remediation flows that act on incidents: visual runbooks, Slack and Teams approval gates, Kubernetes and cloud actions, rollback, and an audit trail.',
        keywords:
          'RF remediation, runbooks, remediation flows, Slack approval, Kubernetes automation, incident response, AlertMend',
        canonical: '/auto-remediation',
      }}
      badge="RF · Remediation"
      headline={
        <>
          Approved workflows that <Accent>act</Accent>, with an audit trail
        </>
      }
      sub="Visual remediation flows from alert to fix: fan-out, Slack approval, Kubernetes actions, verify, and post the summary back. Suggest → approve → execute, not blind auto-heal."
      signupUrl={SIGNUP_URL}
      checks={['Slack / Teams approval', 'Rollback armed', 'Full audit trail']}
      highlightProduct="fix"
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
