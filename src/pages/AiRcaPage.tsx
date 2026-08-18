import {
  Brain, GitPullRequest, ShieldCheck, Sparkles, Search, FileText,
  MessageSquare, Link2,
} from 'lucide-react'
import SolutionPageTemplate, { Accent } from '../components/SolutionPageTemplate'

/**
 * /ai-rca, evidence-backed root cause with citations, BYOM, PR fix.
 */

const SIGNUP_URL = 'https://app.alertmend.io/signup?service=ai-rca'

function SpotlightPanel() {
  return (
    <div className="rounded-[10px] border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-white/55">timeline · ~15s typical</span>
        <span className="rounded-md border border-violet-400/30 bg-violet-500/10 px-2 py-0.5 text-[10px] font-bold text-violet-300">
          evidence-backed
        </span>
      </div>
      <div className="mt-4 space-y-2">
        {[
          { t: '0s', label: 'Alert correlated · checkout p99' },
          { t: '3s', label: 'Traces, logs, events fetched' },
          { t: '9s', label: 'Slow span + pool exhaustion linked' },
          { t: '14s', label: 'RCA + runbook posted to Slack' },
        ].map((s) => (
          <div
            key={s.t}
            className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2"
          >
            <span className="w-8 font-mono text-[11px] font-bold text-violet-300">{s.t}</span>
            <span className="text-[13px] text-zinc-200">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AiRcaPage() {
  return (
    <SolutionPageTemplate
      seo={{
        title: 'AI Root Cause Analysis (RCA) in ~15 Seconds',
        description:
          'AlertMend correlates traces, logs, metrics and Kubernetes events into an evidence-backed root cause with confidence scoring, Slack delivery, and GitHub PR Fix.',
        keywords:
          'AI RCA, root cause analysis, AIOps, Kubernetes incident response, GitHub PR fix, BYOM, AlertMend',
        canonical: '/ai-rca',
      }}
      badge="AI RCA"
      headline={
        <>
          Root cause with <Accent>evidence</Accent>, not another dashboard hunt
        </>
      }
      sub="Typical incidents land near ~15 seconds. Complex ones take longer. Every report cites the traces, logs, metrics and events it used, then offers a PR or approved runbook."
      signupUrl={SIGNUP_URL}
      checks={['Evidence citations', 'BYOM for regulated stacks', 'Approval-gated fixes']}
      highlightProduct="rca"
      stepsHeading="From alert to root cause, with receipts"
      stepsSub="Collect the signals, correlate them on one timeline, then write a narrative a human can trust."
      steps={[
        {
          icon: Search,
          title: 'Gather',
          sub: 'Every related signal',
          spec: 'traces · logs · metrics · K8s events · recent deploys pulled automatically',
        },
        {
          icon: Link2,
          title: 'Correlate',
          sub: 'One evidence ledger',
          spec: 'joined on service, trace-id and time, not four tabs open at 3am',
        },
        {
          icon: Brain,
          title: 'Explain',
          sub: 'Narrative + confidence',
          spec: 'cited root cause · suggested fix · PR or runbook ready to approve',
        },
      ]}
      featuresHeading="Built for production incidents"
      featuresSub="Honest product surface, suggest, approve, execute, verify. Not auto-heal by default."
      features={[
        {
          icon: Brain,
          title: 'Evidence-backed RCA',
          body: 'Traces, logs, metrics and Kubernetes events are correlated into a root-cause narrative with citations and a confidence score.',
          chips: ['citations', 'confidence'],
          big: true,
        },
        {
          icon: Sparkles,
          title: 'Bring your own model',
          body: 'Run inference on Azure OpenAI, Anthropic Foundry, or a local Ollama endpoint for air-gapped and regulated environments.',
          chips: ['BYOM', 'air-gapped'],
        },
        {
          icon: GitPullRequest,
          title: 'GitHub PR Fix',
          body: 'From the RCA, open a suggested PR against the repo that owns the failing workload, then review before merge.',
          chips: ['PR', 'review'],
        },
        {
          icon: ShieldCheck,
          title: 'Suggest → approve → execute',
          body: 'Remediation is gated by Slack or Teams approval and written to the audit trail. Not blind auto-heal by default.',
          chips: ['approval', 'audit'],
        },
        {
          icon: MessageSquare,
          title: 'Chat delivery',
          body: 'RCAs land in Slack or Teams with deep links to evidence, responders start at the conclusion.',
          chips: ['Slack', 'Teams'],
        },
        {
          icon: FileText,
          title: 'Closing summary',
          body: 'When the fix lands, a closing summary posts back to the channel with what changed and who approved it.',
          chips: ['summary', 'who/when'],
        },
      ]}
      spotlight={{
        tag: 'Speed with receipts',
        title: 'Paged to explained in about 15 seconds',
        body: 'AlertMend reads live logs and metrics, spots the failure pattern, explains the likely cause with a confidence score, and posts clear next steps where your team already works.',
        steps: [
          'Alert correlated into one incident',
          'Evidence ledger filled from live signals',
          'Root cause written with citations',
          'PR or runbook ready to approve in Slack',
        ],
        linkTo: '/auto-remediation',
        linkLabel: 'See remediation flows',
        panel: <SpotlightPanel />,
      }}
      ctaHeading="See an RCA on your cluster"
      ctaSub="Connect a cluster and get evidence-backed root cause on the next real incident, with citations, not vibes."
    />
  )
}
