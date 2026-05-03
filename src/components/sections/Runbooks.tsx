import type { CSSProperties } from 'react';
import Icon from '../ui/Icon';
import BrandLogo, { simpleIconsUrl, svgPornUrl } from '../ui/BrandLogo';
import styles from './Runbooks.module.css';

type NodeKind = 'trigger' | 'condition' | 'approval' | 'remediate' | 'summary' | undefined;

type Brand = { src: string; alt: string };

type Node = {
  kind: NodeKind;
  position: CSSProperties;
  ico: { name: any; bg: string; fg: string };
  label: string;
  title: string;
  sub: string;
  brand?: Brand;
};

// Original organic staircase layout
const nodes: Node[] = [
  {
    kind: 'trigger',
    position: { left: '4%', top: '50px' },
    ico: { name: 'bolt', bg: 'rgba(248,113,113,0.16)', fg: 'var(--red)' },
    label: 'Trigger',
    title: 'Alert fired',
    sub: 'CrashLoopBackOff · prod cluster',
    brand: { src: simpleIconsUrl('prometheus'), alt: 'Prometheus' },
  },
  {
    kind: undefined,
    position: { left: '28%', top: '130px' },
    ico: { name: 'cmdline', bg: 'rgba(99,102,241,0.16)', fg: '#6366f1' },
    label: 'Command',
    title: 'Run pod diagnostic',
    sub: 'kubectl describe + logs · last 5m',
    brand: { src: simpleIconsUrl('kubernetes'), alt: 'Kubernetes' },
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
    ico: { name: 'check-thick', bg: 'rgba(168,85,247,0.18)', fg: '#a855f7' },
    label: 'Approval · Slack',
    title: 'Approve restart',
    sub: '@oncall · 5 min timeout',
    brand: { src: svgPornUrl('slack'), alt: 'Slack' },
  },
  {
    kind: undefined,
    position: { left: '76%', top: '220px' },
    ico: { name: 'send', bg: 'rgba(52,211,153,0.16)', fg: 'var(--green)' },
    label: 'Send Message',
    title: 'Slack info post',
    sub: '#sre-ops · transient blip',
    brand: { src: svgPornUrl('slack'), alt: 'Slack' },
  },
  {
    kind: 'remediate',
    position: { left: '28%', top: '320px' },
    ico: { name: 'rotate', bg: 'rgba(168,85,247,0.18)', fg: '#a855f7' },
    label: 'Remediation',
    title: 'Rollout restart',
    sub: 'Fan out · all pods · label tier=api',
    brand: { src: simpleIconsUrl('kubernetes'), alt: 'Kubernetes' },
  },
  {
    kind: 'summary',
    position: { left: '60%', top: '360px' },
    ico: { name: 'shieldCheck', bg: 'rgba(52,211,153,0.16)', fg: 'var(--green)' },
    label: 'Closing summary',
    title: 'Post to Slack',
    sub: 'What ran · who approved · audit link',
    brand: { src: svgPornUrl('slack'), alt: 'Slack' },
  },
];

type Chip = { label: string; logo?: string; domain?: string; soon?: boolean };

const actionBlocks: Chip[] = [
  { label: 'Command' },
  { label: 'Predefined' },
  { label: 'Delay' },
  { label: 'Approval' },
  { label: 'Send Message' },
  { label: 'Declare Incident' },
  { label: 'REST API' },
];

const integrations: Chip[] = [
  { label: 'Slack', logo: svgPornUrl('slack'), domain: 'slack.com' },
  { label: 'Microsoft Teams', logo: simpleIconsUrl('microsoftteams'), domain: 'microsoft.com' },
  { label: 'Google Meet', logo: simpleIconsUrl('googlemeet'), domain: 'meet.google.com' },
  { label: 'Prometheus', logo: simpleIconsUrl('prometheus'), domain: 'prometheus.io' },
  { label: 'Datadog', logo: simpleIconsUrl('datadog'), domain: 'datadoghq.com' },
  { label: 'PagerDuty', logo: simpleIconsUrl('pagerduty'), domain: 'pagerduty.com' },
  { label: 'Jira', logo: simpleIconsUrl('jira'), domain: 'atlassian.com' },
  { label: 'GitHub', logo: simpleIconsUrl('github', '181717'), domain: 'github.com' },
  { label: 'GitLab', logo: simpleIconsUrl('gitlab', 'FC6D26'), domain: 'gitlab.com' },
  { label: 'Kubernetes', logo: svgPornUrl('kubernetes'), domain: 'kubernetes.io' },
  { label: 'AWS', logo: svgPornUrl('aws'), domain: 'aws.amazon.com' },
  { label: 'CloudWatch', logo: svgPornUrl('aws-cloudwatch'), domain: 'aws.amazon.com' },
  { label: 'Azure Monitor', logo: svgPornUrl('microsoft-azure'), domain: 'azure.microsoft.com' },
  { label: 'Grafana', logo: svgPornUrl('grafana'), domain: 'grafana.com' },
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
                  <radialGradient id="rbpulse" cx="0.5" cy="0.5" r="0.5">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity="1" />
                    <stop offset="60%" stopColor="#a855f7" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                  </radialGradient>
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
                {/* All paths start a few pixels outside source so traveling pulses don't clip into source nodes */}
                {/* Trigger right (224,96) -> Command left (278,176) */}
                <path id="rb-e1" d="M 224 96 C 248 96, 252 176, 278 176" stroke="url(#rbedge)" strokeWidth="2" fill="none" markerEnd="url(#rbarrow)" />
                {/* Command right (464,176) -> If/else left (518,176) */}
                <path id="rb-e2" d="M 464 176 L 518 176" stroke="url(#rbedge)" strokeWidth="2" fill="none" markerEnd="url(#rbarrow)" />
                {/* If/else right (704,160) -> Approval left (758,86) */}
                <path id="rb-e3" d="M 704 160 C 728 160, 730 86, 758 86" stroke="url(#rbedge)" strokeWidth="2" fill="none" markerEnd="url(#rbarrow)" />
                {/* If/else right (704,195) -> Send Msg left (758,266) */}
                <path id="rb-e4" d="M 704 195 C 728 195, 730 266, 758 266" stroke="url(#rbedge)" strokeWidth="2" fill="none" markerEnd="url(#rbarrow)" />
                {/* Approval bottom-left (756,136) -> Remediation top (380,320) — routes LEFT of Send Message */}
                <path id="rb-e5" d="M 756 136 C 716 136, 716 320, 380 320" stroke="url(#rbedge)" strokeWidth="2" fill="none" markerEnd="url(#rbarrow)" />
                {/* Remediation right (464,366) -> Summary left (598,406) */}
                <path id="rb-e6" d="M 464 366 C 510 366, 510 406, 598 406" stroke="url(#rbedge)" strokeWidth="2" fill="none" markerEnd="url(#rbarrow)" />

                {/* Traveling pulses along each edge */}
                {[
                  { id: 'rb-e1', dur: '2.2s', begin: '0s' },
                  { id: 'rb-e2', dur: '1.6s', begin: '0.4s' },
                  { id: 'rb-e3', dur: '1.8s', begin: '0.9s' },
                  { id: 'rb-e4', dur: '1.8s', begin: '1.2s' },
                  { id: 'rb-e5', dur: '2.4s', begin: '1.6s' },
                  { id: 'rb-e6', dur: '1.8s', begin: '2.2s' },
                ].map((p) => (
                  <g key={p.id}>
                    <circle r="6" fill="url(#rbpulse)" opacity="0.5">
                      <animateMotion dur={p.dur} begin={p.begin} repeatCount="indefinite" rotate="auto">
                        <mpath xlinkHref={`#${p.id}`} />
                      </animateMotion>
                    </circle>
                    <circle r="2.5" fill="#a855f7">
                      <animateMotion dur={p.dur} begin={p.begin} repeatCount="indefinite" rotate="auto">
                        <mpath xlinkHref={`#${p.id}`} />
                      </animateMotion>
                    </circle>
                  </g>
                ))}
              </svg>

              {nodes.map((n, i) => (
                <div
                  key={i}
                  className={`${styles.node} ${nodeKindClass(n.kind)}`}
                  style={{ ...n.position, animationDelay: `${i * 0.18}s` } as CSSProperties}
                >
                  <div className={styles.nodeH}>
                    <span className={styles.nodeIco} style={{ background: n.ico.bg, color: n.ico.fg }}>
                      <Icon name={n.ico.name} size={14} strokeWidth={2.5} />
                    </span>
                    <span className={styles.nodeKind}>{n.label}</span>
                    {n.brand && (
                      <BrandLogo
                        src={n.brand.src}
                        alt={n.brand.alt}
                        className={styles.nodeBrand}
                      />
                    )}
                  </div>
                  <div className={styles.nodeTitle}>{n.title}</div>
                  <div className={styles.nodeSub}>{n.sub}</div>
                  <span className={styles.nodeShine} aria-hidden />
                </div>
              ))}
            </div>

            <div className={styles.palette}>
              <div className={styles.paletteGroup}>
                <div className={styles.paletteLabel}>Action blocks</div>
                <div className={styles.chipRow}>
                  {actionBlocks.map((p) => (
                    <span key={p.label} className={styles.chip}>
                      {p.label}
                    </span>
                  ))}
                </div>
              </div>
              <div className={styles.paletteGroup}>
                <div className={styles.paletteLabel}>Integrations</div>
                <div className={styles.chipRow}>
                  {integrations.map((p) => (
                    <span
                      key={p.label}
                      className={`${styles.chip} ${styles.chipBrand} ${p.soon ? styles.chipSoon : ''}`}
                    >
                      <BrandLogo
                        src={p.logo!}
                        domain={p.domain}
                        alt=""
                        className={styles.chipLogo}
                      />
                      {p.label}
                      {p.soon && <span className={styles.chipSoonTag}>soon</span>}
                    </span>
                  ))}
                </div>
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
