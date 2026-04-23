import type { ReactNode } from 'react';
import Icon from '../ui/Icon';
import styles from './Features.module.css';

type Card = {
  variant?: 'wide' | 'tall' | 'wideTall' | 'full';
  ico: ReactNode;
  title: ReactNode;
  body: ReactNode;
  tags?: string[];
  preview?: boolean;
  custom?: ReactNode;
};

const cards: Card[] = [
  {
    variant: 'wideTall',
    ico: <Icon name="cube" size={22} />,
    title: 'Kubernetes cluster overview',
    body: (
      <>
        The Kubernetes hub: scope by cluster + duration, see active incidents (RESTART STORM,
        OOMKilled, ContainerCreation, rollout stuck), open{' '}
        <b style={{ color: 'var(--text)', fontWeight: 700 }}>View RCA</b> on any card, and chat with the cluster
        Copilot, without leaving the page.
      </>
    ),
    preview: true,
    tags: ['overview', 'incidents', 'copilot', 'drill-down'],
  },
  {
    ico: <Icon name="message" size={22} />,
    title: 'AlertMend AI chat',
    body: 'Ask cluster questions in plain language. Grounded in your real inventory, events, logs and metrics. Not generic suggestions.',
    tags: ['natural-language', 'grounded'],
  },
  {
    ico: <Icon name="shieldCheck" size={22} />,
    title: 'Health rules',
    body: 'Per-cluster monitors for pods, nodes, PVCs, jobs, deploys. Severity, live state, operational toggle, without redeploying YAML.',
    tags: ['workflow-pod', 'deploy', 'availability'],
  },
  {
    ico: <Icon name="database" size={22} />,
    title: 'Kubernetes logs (SQL)',
    body: (
      <>
        <code className={styles.codeMono}>SELECT * FROM logs</code> with namespace/pod/node fields,
        time-range presets and stream selection.
      </>
    ),
    tags: ['sql', 'streams', 'indexed'],
  },
  {
    ico: <Icon name="bar" size={22} />,
    title: 'Metrics & dashboards',
    body: 'Custom panels, data-source selectors, auto-refresh, persisted via the workspace API. One source of truth across teams.',
    tags: ['panels', 'workspace-api'],
  },
  {
    ico: <Icon name="compass" size={22} />,
    title: 'API monitors',
    body: 'Synthetic HTTP(S) checks with status, body or response-value rules. 90-day uptime ribbons. Wired into incidents & escalation paths.',
    tags: ['synthetic', 'uptime', 'slack'],
  },
  {
    ico: <Icon name="cpu" size={22} />,
    title: 'GPU & MLOps observability',
    body: (
      <>
        First-class for NVIDIA fleets: per-GPU util, memory, ECC, thermal &amp; MIG slices.
        Train-time signals from <b style={{ color: 'var(--text)' }}>PyTorch DDP, Ray, Kubeflow,
        MLflow</b>. Inference health for <b style={{ color: 'var(--text)' }}>vLLM &amp; Triton</b>{' '}
        with KV-cache pressure and p99 drift detection.
      </>
    ),
    tags: ['cuda', 'nccl', 'vllm', 'kubeflow', 'mlflow', 'right-size-gpu'],
  },
  {
    variant: 'wide',
    ico: <Icon name="workflow" size={22} />,
    title: 'Runbooks · visual workflows that act',
    body: 'Trigger on alerts, cron, health policy or webhooks. Run the same command across an entire VM fleet, or fan out into every pod that matches a label. Branch on output. Pause for Slack/Teams approval. Archive logs to S3, then post a closing summary to chat. Same definition, every time.',
    tags: [
      'approval',
      'vm-fleet',
      'k8s-fan-out',
      'slack',
      'teams',
      'prometheus',
      'datadog',
      'jira',
      'pagerduty',
    ],
  },
  {
    ico: <Icon name="dollar" size={22} />,
    title: 'Kubernetes FinOps',
    body: (
      <>
        Spend by namespace, workload, controller. Requested vs used.{' '}
        <b style={{ color: 'var(--text)' }}>Apply recommended fix</b> with YAML preview &amp;
        cluster apply.
      </>
    ),
    tags: ['right-sizing', 'yaml-apply'],
  },
  {
    ico: <Icon name="activity" size={22} />,
    title: 'AWS cost optimization',
    body: (
      <>
        EC2, RDS, ELB, ECS line items. Per-resource{' '}
        <b style={{ color: 'var(--text)' }}>save $/mo</b>, idle-instance cleanup,
        environment-scoped views.
      </>
    ),
    tags: ['ec2', 'rds', 'savings'],
  },
  {
    ico: <Icon name="phone" size={22} />,
    title: 'On-call programs',
    body: 'Schedules & rotations with timezones. Escalation paths chain email → WhatsApp → phone with wait timers. Sustainable paging at scale.',
    tags: ['schedules', 'escalation', 'whatsapp'],
  },
  {
    variant: 'full',
    ico: <Icon name="shield" size={22} />,
    title: 'RBAC, audit & compliance, built in',
    body: 'Granular role-based access controls scope navigation, data and mutating actions. Every page navigation, click and apply is captured in the audit trail with per-user filters and error-only views, for security reviews, break-glass checks and SoC-style separation of duties.',
    custom: (
      <a href="#pricing" className="btn btn-ghost">
        Talk to security
        <Icon name="arrow" size={14} className="arrow" strokeWidth={2.5} />
      </a>
    ),
  },
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
            30+ capabilities across observability, incident response, FinOps, automation,
            GPU &amp; MLOps, and compliance — designed to feel like one product.
          </p>
        </div>

        <div className={`${styles.bento} reveal`}>
          {cards.map((c, i) => {
            if (c.variant === 'full') {
              return (
                <div key={i} className={`${styles.card} ${styles.full}`}>
                  <div className={styles.fullInner}>
                    <div className={styles.icoBox}>{c.ico}</div>
                    <div>
                      <h4 style={{ marginBottom: 4 }}>{c.title}</h4>
                      <p>{c.body}</p>
                    </div>
                    {c.custom}
                  </div>
                </div>
              );
            }
            return (
              <div key={i} className={`${styles.card} ${variantClass(c.variant)}`}>
                <div className={styles.icoBox}>{c.ico}</div>
                <h4>{c.title}</h4>
                <p>{c.body}</p>
                {c.preview && (
                  <div className={styles.preview}>
                    <div className={styles.previewSvg} aria-hidden>
                      <KubernetesPreview />
                    </div>
                  </div>
                )}
                {c.tags && (
                  <div className={styles.tagRow}>
                    {c.tags.map((t) => (
                      <span key={t} className={styles.tag}>
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/** Inline SVG mock of a Kubernetes overview dashboard (since we don't have a screenshot). */
function KubernetesPreview() {
  return (
    <svg viewBox="0 0 760 280" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
      <defs>
        <linearGradient id="kbg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#faf5ff" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>
        <linearGradient id="kacc" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7e22ce" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
      </defs>
      <rect width="760" height="280" fill="url(#kbg)" />
      {/* top bar */}
      <rect x="0" y="0" width="760" height="36" fill="rgba(126,34,206,0.05)" />
      <circle cx="20" cy="18" r="5" fill="#7e22ce" />
      <rect x="34" y="13" width="92" height="10" rx="3" fill="rgba(59,7,100,0.55)" />
      <rect x="140" y="13" width="60" height="10" rx="3" fill="rgba(59,7,100,0.25)" />
      <rect x="700" y="11" width="44" height="14" rx="4" fill="rgba(126,34,206,0.18)" />
      {/* Cluster header */}
      <rect x="20" y="52" width="180" height="14" rx="3" fill="rgba(59,7,100,0.85)" />
      <rect x="20" y="74" width="240" height="9" rx="3" fill="rgba(107,33,168,0.5)" />
      {/* Stat tiles */}
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(${20 + i * 138} 100)`}>
          <rect width="124" height="58" rx="10" fill="#ffffff" stroke="rgba(126,34,206,0.18)" />
          <rect x="12" y="12" width="40" height="8" rx="2" fill="rgba(107,33,168,0.45)" />
          <rect x="12" y="28" width="62" height="14" rx="3" fill="url(#kacc)" />
        </g>
      ))}
      {/* Incident cards */}
      {[
        { y: 178, color: '#dc2626', label: 'RESTART STORM · log-ingester' },
        { y: 218, color: '#d97706', label: 'OOMKilled · payments-svc' },
      ].map((row, i) => (
        <g key={i} transform={`translate(20 ${row.y})`}>
          <rect width="430" height="34" rx="8" fill="#ffffff" stroke={`${row.color}88`} />
          <circle cx="14" cy="17" r="4" fill={row.color} />
          <rect x="26" y="13" width="270" height="9" rx="2" fill="rgba(59,7,100,0.6)" />
          <rect x="350" y="11" width="68" height="14" rx="4" fill="rgba(126,34,206,0.14)" stroke="rgba(126,34,206,0.4)" />
        </g>
      ))}
      {/* Right panel chart */}
      <rect x="470" y="178" width="270" height="74" rx="10" fill="#ffffff" stroke="rgba(126,34,206,0.18)" />
      <polyline
        points="480,238 510,222 540,228 570,210 600,216 630,196 660,202 690,184 720,192 740,178"
        fill="none"
        stroke="url(#kacc)"
        strokeWidth="2.5"
      />
    </svg>
  );
}
