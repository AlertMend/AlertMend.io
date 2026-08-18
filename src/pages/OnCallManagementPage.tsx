import {
  Bell, CalendarDays, PhoneCall, MessageSquare, Filter, ClipboardCheck,
  Route, CheckCheck,
} from 'lucide-react'
import SolutionPageTemplate, {
  Accent,
} from '../components/SolutionPageTemplate'

/**
 * /on-call-management, redesigned product page. Console mock shows a live
 * rotation + escalation chain; spotlight walks a 3am page that arrives with
 * the RCA already attached.
 */

const SIGNUP_URL = 'https://app.alertmend.io/signup?service=on-call'

/* Spotlight panel: the 3am page with RCA + approve-from-Slack */
function SpotlightPanel() {
  return (
    <div className="rounded-[10px] border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#4A154B] text-sm font-bold text-white">#</span>
        <div>
          <div className="text-sm font-semibold text-white">#oncall-payments</div>
          <div className="font-mono text-[10px] text-white/45">AlertMend · 03:02</div>
        </div>
      </div>
      <div className="mt-4 rounded-lg border border-white/10 bg-white/[0.04] p-4">
        <div className="text-xs font-bold text-rose-300">P1 · checkout p99 breach · prod-us-east-1</div>
        <p className="mt-2 text-sm leading-relaxed text-zinc-200">
          <b className="text-white">Root cause:</b> db.query saturating the connection pool after
          deploy v2.31.4. Runbook ready: raise pool max 20 → 50.
        </p>
        <div className="mt-3 flex gap-2">
          <span className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white">✓ Approve & run</span>
          <span className="rounded-md border border-white/20 px-3 py-1.5 text-xs font-bold text-white/85">Snooze 15m</span>
        </div>
      </div>
      <div className="mt-3 space-y-1.5 font-mono text-[11px] text-white/55">
        <div><span className="text-emerald-400">03:04</span> @alex approved from Slack</div>
        <div><span className="text-emerald-400">03:05</span> runbook executed · pool 20 → 50</div>
        <div><span className="text-emerald-400">03:07</span> p99 back under SLO · incident resolved</div>
      </div>
    </div>
  )
}

export default function OnCallManagementPage() {
  return (
    <SolutionPageTemplate
      seo={{
        title: 'On-Call Management & Incident Alerts | AlertMend',
        description:
          'Timezone-aware schedules and rotations, escalation chains across Slack, Teams, WhatsApp, email and phone, and pages that arrive with the AI root cause attached.',
        keywords:
          'on-call management, on-call schedules, escalation policy, incident alerts, PagerDuty alternative, WhatsApp alerts, phone call alerts, AI triage, AlertMend AI',
        canonical: '/on-call-management',
      }}
      badge="On-call & incidents"
      headline={
        <>
          Pages the <Accent>right human</Accent>, with the answer attached
        </>
      }
      sub="Timezone-aware rotations, escalation chains that actually escalate, and every page delivered with the AI root cause and a ready runbook, so the person woken up can fix it, not investigate it."
      signupUrl={SIGNUP_URL}
      checks={['Timezone-aware rotations', 'Escalation with wait timers', 'Full audit trail']}
      highlightProduct="oncall"
      stepsHeading="Route. Page. Resolve."
      stepsSub="The same path every incident: correlate the noise, page through the chain, resolve with an approved fix."
      steps={[
        {
          icon: Route,
          title: 'Route',
          sub: 'Correlate before you page',
          spec: 'alerts from Alertmanager, Datadog webhooks, VictoriaMetrics and custom sources deduped into one incident',
        },
        {
          icon: Bell,
          title: 'Page',
          sub: 'Schedules + escalation chains',
          spec: 'Slack / Teams → WhatsApp → email → phone with wait timers · follow-the-sun rotations',
        },
        {
          icon: CheckCheck,
          title: 'Resolve',
          sub: 'Approve the fix from chat',
          spec: 'RCA attached to the page · approve an AlertMend runbook from Slack · closing summary posted back',
        },
      ]}
      featuresHeading="Sustainable paging at scale"
      featuresSub="Everything an on-call program needs, wired into the same platform that explains and fixes the incident."
      features={[
        {
          icon: CalendarDays,
          title: 'Schedules & rotations',
          body: 'Timezone-aware rotations with overrides and handoffs, follow-the-sun without spreadsheet math.',
          chips: ['timezones', 'overrides'],
          big: true,
        },
        {
          icon: PhoneCall,
          title: 'Escalation chains',
          body: 'Chain Slack, Teams, WhatsApp, email and phone with per-step wait timers and automatic backup escalation.',
          chips: ['wait timers', 'backup'],
        },
        {
          icon: Filter,
          title: 'Noise control',
          body: 'Dedupe and correlate alerts from every source into one incident, so a single failure pages once, not forty times.',
          chips: ['dedupe', 'correlation'],
        },
        {
          icon: MessageSquare,
          title: 'Chat-native response',
          body: 'Acknowledge, approve runbooks and get closing summaries inside Slack or Teams, no console hop at 3am.',
          chips: ['Slack', 'Teams'],
        },
        {
          icon: Bell,
          title: 'Pages with answers',
          body: 'Every page carries the AI root cause and suggested fix, so responders start at the conclusion instead of the dashboards.',
          chips: ['RCA attached', '~15s typical'],
        },
        {
          icon: ClipboardCheck,
          title: 'Audit trail',
          body: 'Every page, acknowledgment, approval and executed action is recorded with who and when, SoC-style separation of duties.',
          chips: ['who/when', 'compliance'],
        },
      ]}
      spotlight={{
        tag: 'The 3am page, rewritten',
        title: 'Woken at 03:02, back asleep by 03:10',
        body: "A P1 fires overnight. Instead of a bare alert, the page arrives with the root cause and a prepared fix, approval happens from bed, in Slack, with the audit trail written for the morning.",
        steps: [
          'P1 fires · correlated from 14 raw alerts into one incident',
          'Page hits Slack, then WhatsApp, with RCA attached',
          'Responder taps Approve & run on the prepared runbook',
          'Fix verified, incident closed, summary posted to the channel',
        ],
        linkTo: '/auto-remediation',
        linkLabel: 'See remediation flows',
        panel: <SpotlightPanel />,
      }}
      ctaHeading="Give your on-call their nights back"
      ctaSub="Set up a rotation and an escalation chain in minutes, pages with answers from day one."
    />
  )
}
