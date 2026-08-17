import type { ReactNode, CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../ui/Icon';
import BrandLogo, { svgPornUrl } from '../ui/BrandLogo';
import styles from './Features.module.css';

/** Official Kubernetes logo (full-color helm wheel) served by svgporn. */
const K8S_LOGO_URL = svgPornUrl('kubernetes');

type Card = {
  variant?: 'wide' | 'tall' | 'wideTall' | 'full';
  ico: ReactNode;
  title: ReactNode;
  body: ReactNode;
  tags?: string[];
  /** Deep-link into a real product / solution page. */
  to?: string;
  custom?: ReactNode;
};

const cards: Card[] = [
  {
    to: '/observability',
    ico: (
      <BrandLogo
        src={K8S_LOGO_URL}
        alt="Kubernetes"
        className={styles.k8sIcoLogo}
      />
    ),
    title: 'Kubernetes cluster overview',
    body: (
      <>
        Scope by cluster + duration, see active incidents (restart storms, OOMKilled, stuck
        rollouts), and open <b style={{ color: 'var(--text)', fontWeight: 700 }}>View RCA</b>{' '}
        on any card without leaving the page.
      </>
    ),
    tags: ['overview', 'incidents', 'drill-down'],
  },
  {
    to: '/ai-rca',
    ico: <Icon name="message" size={16} strokeWidth={1.6} />,
    title: 'AlertMend AI chat',
    body: 'Ask cluster questions in plain language. Grounded in your real inventory, events, logs and metrics. Not generic suggestions.',
    tags: ['natural-language', 'grounded'],
  },
  {
    to: '/kubernetes-management',
    ico: <Icon name="shieldCheck" size={16} strokeWidth={1.6} />,
    title: 'Health rules',
    body: 'Per-cluster monitors for pods, nodes, PVCs, jobs, deploys. Severity, live state, operational toggle, without redeploying YAML.',
    tags: ['workflow-pod', 'deploy', 'availability'],
  },
  {
    to: '/log-management',
    ico: <Icon name="database" size={16} strokeWidth={1.6} />,
    title: 'Kubernetes logs (SQL)',
    body: (
      <>
        <code className={styles.codeMono}>SELECT * FROM logs</code> with
        namespace/pod/node fields, time-range presets and stream selection.
      </>
    ),
    tags: ['sql', 'indexed'],
  },
  {
    to: '/observability',
    ico: <Icon name="bar" size={16} strokeWidth={1.6} />,
    title: 'Metrics & dashboards',
    body: 'PromQL panels, data-source selectors, auto-refresh, persisted via the workspace API. One source of truth across teams.',
    tags: ['promql', 'workspace-api'],
  },
  {
    to: '/observability',
    ico: <Icon name="activity" size={16} strokeWidth={1.6} />,
    title: 'Distributed tracing & APM',
    body: (
      <>
        Follow one request across every hop with{' '}
        <b style={{ color: 'var(--text)' }}>OpenTelemetry &amp; eBPF</b> auto-instrumentation.
        p50/p95/p99, error rates and span waterfalls, plus GenAI token, cost and latency when
        you instrument LLM calls.
      </>
    ),
    tags: ['otel', 'ebpf', 'genai-apm', 'service-map'],
  },
  {
    to: '/auto-remediation',
    ico: <Icon name="workflow" size={16} strokeWidth={1.6} />,
    title: 'Remediation with approval',
    body: 'Trigger on alerts, cron or webhooks. Fan out across VMs and pods, pause for Slack approval, open a GitHub PR Fix from RCA, then verify before you close.',
    tags: ['approval', 'pr-fix', 'audit', 'slack'],
  },
  {
    to: '/kubernetes-cost-optimization',
    ico: <Icon name="dollar" size={16} strokeWidth={1.6} />,
    title: 'Kubernetes & AWS FinOps',
    body: (
      <>
        Spend by namespace, workload and controller, plus EC2 / RDS / ELB line items.{' '}
        <b style={{ color: 'var(--text)' }}>Apply recommended fix</b> with YAML preview &amp;
        cluster apply.
      </>
    ),
    tags: ['right-sizing', 'yaml-apply', 'aws'],
  },
  {
    to: '/on-call-management',
    ico: <Icon name="phone" size={16} strokeWidth={1.6} />,
    title: 'On-call programs',
    body: 'Schedules & rotations with timezones. Escalation paths chain email → WhatsApp → phone with wait timers. Sustainable paging at scale.',
    tags: ['schedules', 'escalation', 'whatsapp'],
  },
  {
    variant: 'full',
    ico: <Icon name="shield" size={16} strokeWidth={1.6} />,
    title: 'RBAC, audit & compliance controls',
    body: 'Role-based access scopes navigation, data and mutating actions. Every apply and remediation run is captured in the audit trail. SOC 2 Type II is in progress — ask us about the current control set.',
    custom: (
      <Link to="/security" className="btn btn-ghost">
        Talk to security
        <Icon name="arrow" size={14} className="arrow" strokeWidth={2.5} />
      </Link>
    ),
  },
];

/* Per-tile accent hues — restrained set applied in card order. */
const TILE = [
  '#7c3aed',
  '#6366f1',
  '#059669',
  '#d97706',
  '#0284c7',
  '#0d9488',
  '#2563eb',
  '#16a34a',
  '#ea580c',
  '#4f46e5',
];

function variantClass(v?: Card['variant']) {
  if (!v) return '';
  if (v === 'wide') return styles.wide;
  if (v === 'tall') return styles.tall;
  if (v === 'wideTall') return `${styles.wide} ${styles.tall}`;
  if (v === 'full') return styles.full;
  return '';
}

export default function Features() {
  return (
    <section id="features">
      <div className="container">
        <div className="sec-head reveal">
          <span className="sec-tag">Platform</span>
          <h2>One platform. Every operational surface.</h2>
          <p>
            Observability, AI RCA, approved remediation, on-call, FinOps and logs — designed to
            feel like one product. Open any tile for the deep walkthrough.
          </p>
        </div>

        <div className={`${styles.bento} reveal`}>
          {cards.map((c, i) => {
            const tileStyle = { '--tile': TILE[i % TILE.length] } as CSSProperties;
            const className = `${styles.card} ${variantClass(c.variant)}`;

            if (c.variant === 'full') {
              return (
                <div key={i} className={`${styles.card} ${styles.full}`} style={tileStyle}>
                  <div className={styles.fullInner}>
                    <div>
                      <div className={styles.head}>
                        <span className={styles.ico}>{c.ico}</span>
                        <h4 style={{ marginBottom: 0 }}>{c.title}</h4>
                      </div>
                      <p>{c.body}</p>
                    </div>
                    {c.custom}
                  </div>
                </div>
              );
            }

            const inner = (
              <>
                <div className={styles.head}>
                  <span className={styles.ico}>{c.ico}</span>
                  <h4>{c.title}</h4>
                </div>
                <p>{c.body}</p>
                {c.tags && (
                  <div className={styles.tagRow}>
                    {c.tags.map((t) => (
                      <span key={t} className={styles.tag}>
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                {c.to && (
                  <span className={styles.more}>
                    Open
                    <Icon name="arrow" size={14} className="arrow" strokeWidth={2.4} />
                  </span>
                )}
              </>
            );

            if (c.to) {
              return (
                <Link key={i} to={c.to} className={className} style={tileStyle}>
                  {inner}
                </Link>
              );
            }

            return (
              <div key={i} className={className} style={tileStyle}>
                {inner}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
