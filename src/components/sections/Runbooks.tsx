import type { CSSProperties } from 'react';
import Icon from '../ui/Icon';
import styles from './Runbooks.module.css';

type NodeKind = 'trigger' | 'condition' | 'approval' | 'remediate' | 'summary' | undefined;

type Node = {
  kind: NodeKind;
  position: CSSProperties;
  ico: { name: any; bg: string; fg: string };
  label: string;
  title: string;
  sub: string;
};

const nodes: Node[] = [
  {
    kind: 'trigger',
    position: { left: '4%', top: '50px' },
    ico: { name: 'bolt', bg: 'rgba(248,113,113,0.16)', fg: 'var(--red)' },
    label: 'Trigger',
    title: 'Alert fired',
    sub: 'CrashLoopBackOff · prod cluster',
  },
  {
    kind: undefined,
    position: { left: '28%', top: '130px' },
    ico: { name: 'cmdline', bg: 'rgba(99,102,241,0.16)', fg: '#a5b4fc' },
    label: 'Command',
    title: 'Run pod diagnostic',
    sub: 'kubectl describe + logs · last 5m',
  },
  {
    kind: 'condition',
    position: { left: '52%', top: '130px' },
    ico: { name: 'activity', bg: 'rgba(251,191,36,0.16)', fg: 'var(--amber)' },
    label: 'If / else',
    title: 'restarts > 5?',
    sub: 'Branch on container status',
  },
  {
    kind: 'approval',
    position: { left: '76%', top: '40px' },
    ico: { name: 'check-thick', bg: 'rgba(168,85,247,0.18)', fg: '#d8b4fe' },
    label: 'Approval · Slack',
    title: 'Approve restart',
    sub: '@oncall · 5 min timeout',
  },
  {
    kind: undefined,
    position: { left: '76%', top: '220px' },
    ico: { name: 'send', bg: 'rgba(52,211,153,0.16)', fg: 'var(--green)' },
    label: 'Send Message',
    title: 'Slack info post',
    sub: '#sre-ops · transient blip',
  },
  {
    kind: 'remediate',
    position: { left: '28%', top: '320px' },
    ico: { name: 'rotate', bg: 'rgba(168,85,247,0.18)', fg: '#d8b4fe' },
    label: 'Remediation',
    title: 'Rollout restart',
    sub: 'Fan out · all pods · label tier=api',
  },
  {
    kind: 'summary',
    position: { left: '60%', top: '360px' },
    ico: { name: 'shieldCheck', bg: 'rgba(52,211,153,0.16)', fg: 'var(--green)' },
    label: 'Closing summary',
    title: 'Post to Slack',
    sub: 'What ran · who approved · audit link',
  },
];

const palette = [
  { label: 'Command' },
  { label: 'Predefined' },
  { label: 'Delay' },
  { label: 'Approval' },
  { label: 'Send Message' },
  { label: 'Declare Incident' },
  { label: 'Google Meet' },
  { label: 'Prometheus' },
  { label: 'Victoria Metrics' },
  { label: 'Datadog' },
  { label: 'PagerDuty' },
  { label: 'Jira' },
  { label: 'REST API' },
  { label: 'GitHub PR' },
  { label: 'GitLab MR' },
  { label: 'CloudWatch · soon', soon: true },
  { label: 'Azure Monitor · soon', soon: true },
  { label: 'Grafana · soon', soon: true },
];

const rail = [
  {
    num: '8',
    title: 'Trigger sources',
    desc: 'Alerts, cron, HealthPolicy, webhooks, chat slash-commands, custom integrations.',
  },
  {
    num: '∞',
    title: 'Fleet fan-out',
    desc: 'Run the same step on every connected VM, or every pod that matches a label selector.',
  },
  {
    num: '3+',
    title: 'Approval channels',
    desc: 'In-product, Slack, Microsoft Teams, Email. Pause until the right humans confirm.',
  },
  {
    num: '100%',
    title: 'Audited',
    desc: 'Every step, approval, command and output recorded for compliance and break-glass review.',
  },
];

function nodeKindClass(k: NodeKind) {
  if (!k) return '';
  return styles[k] ?? '';
}

export default function Runbooks() {
  return (
    <section id="runbooks">
      <div className="container">
        <div className="sec-head reveal">
          <span className="sec-tag">Runbooks · No-code automation</span>
          <h2>
            Build your own <span className="hero-h-accent">AI workflows</span>.
          </h2>
          <p>
            Drag-and-drop nodes for Kubernetes, AWS, Slack, Teams, Jira, PagerDuty, Prometheus,
            Datadog, REST APIs and your own webhooks. Conditional logic, human-in-the-loop
            approvals, fan-out across pods or VM fleets, and a full audit trail.
          </p>
        </div>

        <div className={`${styles.wrap} reveal`}>
          <div className={styles.canvas}>
            <div className={styles.bar}>
              <div className={styles.tabs}>
                <span className={`${styles.tab} ${styles.tabActive}`}>
                  <Icon name="workflow" size={14} strokeWidth={2.5} />
                  Auto-remediate · CrashLoopBackOff
                </span>
                <span className={styles.tab}>Disk pressure · VM fleet</span>
                <span className={styles.tab}>Cost · right-size pods</span>
              </div>
              <div className={styles.barActions}>
                <span className={styles.activePill}>
                  <span className={styles.activeDot} /> ACTIVE
                </span>
                <button className={styles.playBtn}>
                  <Icon name="play" size={11} />
                  Play
                </button>
              </div>
            </div>

            <div className={styles.stage}>
              <svg className={styles.edges} viewBox="0 0 1000 460" preserveAspectRatio="none" aria-hidden>
                <defs>
                  <linearGradient id="rbedge" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0.7" />
                  </linearGradient>
                  <marker
                    id="rbarrow"
                    viewBox="0 0 10 10"
                    refX="8"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#6366f1" />
                  </marker>
                </defs>
                <path d="M 200 80 C 260 80, 260 160, 320 160" stroke="url(#rbedge)" strokeWidth="2" fill="none" markerEnd="url(#rbarrow)" />
                <path d="M 460 160 C 520 160, 520 160, 580 160" stroke="url(#rbedge)" strokeWidth="2" fill="none" markerEnd="url(#rbarrow)" />
                <path d="M 720 140 C 780 140, 780 70, 840 70" stroke="url(#rbedge)" strokeWidth="2" fill="none" markerEnd="url(#rbarrow)" />
                <path d="M 720 180 C 780 180, 780 250, 840 250" stroke="url(#rbedge)" strokeWidth="2" fill="none" markerEnd="url(#rbarrow)" />
                <path d="M 920 110 C 920 170, 480 250, 460 320" stroke="url(#rbedge)" strokeWidth="2" fill="none" markerEnd="url(#rbarrow)" />
                <path d="M 460 360 C 540 360, 540 400, 620 400" stroke="url(#rbedge)" strokeWidth="2" fill="none" markerEnd="url(#rbarrow)" />
              </svg>

              {nodes.map((n, i) => (
                <div key={i} className={`${styles.node} ${nodeKindClass(n.kind)}`} style={n.position}>
                  <div className={styles.nodeH}>
                    <span className={styles.nodeIco} style={{ background: n.ico.bg, color: n.ico.fg }}>
                      <Icon name={n.ico.name} size={14} strokeWidth={2.5} />
                    </span>
                    <span className={styles.nodeKind}>{n.label}</span>
                  </div>
                  <div className={styles.nodeTitle}>{n.title}</div>
                  <div className={styles.nodeSub}>{n.sub}</div>
                </div>
              ))}
            </div>

            <div className={styles.palette}>
              <div className={styles.paletteLabel}>Action blocks</div>
              <div className={styles.chipRow}>
                {palette.map((p) => (
                  <span key={p.label} className={`${styles.chip} ${p.soon ? styles.chipSoon : ''}`}>
                    {p.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.rail}>
            {rail.map((r) => (
              <div key={r.title} className={styles.railCard}>
                <div className={styles.railNum}>{r.num}</div>
                <div className={styles.railH}>{r.title}</div>
                <p>{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
