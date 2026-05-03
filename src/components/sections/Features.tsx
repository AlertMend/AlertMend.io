import type { ReactNode } from 'react';
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
  preview?: boolean;
  custom?: ReactNode;
};

const cards: Card[] = [
  {
    variant: 'wideTall',
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
            GPU &amp; MLOps, and compliance - designed to feel like one product.
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

/** Inline SVG mock of a Kubernetes overview dashboard, branded with the K8s
 *  helm icon and real-sounding pod names so it reads as a product surface
 *  rather than abstract placeholder bars. */
function KubernetesPreview() {
  const stats = [
    { label: 'Pods', value: '1,247', sub: '↑ 12' },
    { label: 'Nodes', value: '24', sub: 'healthy' },
    { label: 'Deploys', value: '89', sub: '3 rolling' },
    { label: 'Namespaces', value: '17', sub: '' },
  ];
  const incidents = [
    {
      sev: '#dc2626',
      sevLabel: 'CRIT',
      title: 'RESTART STORM',
      pod: 'log-ingester-86b9968-cvklg',
      ns: 'observability',
    },
    {
      sev: '#d97706',
      sevLabel: 'WARN',
      title: 'OOMKilled',
      pod: 'payments-svc-7c4d8f-q9p2m',
      ns: 'payments',
    },
  ];

  return (
    <svg
      viewBox="0 0 760 280"
      preserveAspectRatio="xMidYMid meet"
      width="100%"
      height="100%"
      fontFamily="-apple-system, system-ui, sans-serif"
    >
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

      {/* Top bar with K8s logo, cluster selector, AlertMend Kubernetes Agent badge */}
      <rect x="0" y="0" width="760" height="38" fill="rgba(126,34,206,0.05)" />
      <image
        href={K8S_LOGO_URL}
        x="16" y="8" width="22" height="22"
        preserveAspectRatio="xMidYMid meet"
      />
    
      <text x="46" y="24" fontSize="12" fontWeight="700" fill="#3b0764">
        prod-us-west-2
      </text>
      <text x="46" y="24" dx="116" fontSize="11" fill="rgba(107,33,168,0.7)">
        · last 24h
      </text>
      {/* Branded "AlertMend Kubernetes Agent" pill, top-right.
          Width sized to fit "AlertMend  ·  Kubernetes Agent  ●  LIVE" with
          breathing room, and positioned with a comfortable right margin so
          the SVG's `xMidYMid slice` aspect-ratio scaling can't clip it. */}
      <g transform="translate(478 7)">
        <rect
          width="266"
          height="24"
          rx="12"
          fill="#ffffff"
          stroke="rgba(126,34,206,0.35)"
        />
        {/* AlertMend brandmark */}
        <image
          href="/logos/alertmend-logo.png"
          x="8"
          y="4"
          width="16"
          height="16"
          preserveAspectRatio="xMidYMid meet"
        />
        <text x="30" y="16" fontSize="10" fontWeight="800" fill="#3b0764" letterSpacing="0.01em">
          AlertMend
        </text>
        <text x="86" y="16" fontSize="10" fontWeight="500" fill="rgba(107,33,168,0.55)">
          ·
        </text>
        <text x="94" y="16" fontSize="10" fontWeight="600" fill="#6b21a8" letterSpacing="0.005em">
          Kubernetes Agent
        </text>
        {/* Live dot */}
        <circle cx="220" cy="12" r="3" fill="#10b981">
          <animate attributeName="opacity" values="1;0.4;1" dur="1.6s" repeatCount="indefinite" />
        </circle>
        <text x="228" y="15.5" fontSize="8.5" fontWeight="800" fill="#047857" letterSpacing="0.07em">
          LIVE
        </text>
      </g>

      {/* Section heading */}
      <text x="20" y="62" fontSize="13" fontWeight="700" fill="#1f0a47">
        Cluster overview
      </text>
      <text x="20" y="80" fontSize="10" fill="rgba(107,33,168,0.7)">
        4 namespaces with active incidents
      </text>

      {/* Stat tiles with K8s resource icons */}
      {stats.map((s, i) => (
        <g key={i} transform={`translate(${20 + i * 138} 92)`}>
          <rect width="124" height="58" rx="10" fill="#ffffff" stroke="rgba(126,34,206,0.18)" />
          <g transform="translate(12 12)">
            <ResourceGlyph kind={s.label} />
          </g>
          <text x="40" y="22" fontSize="9" fontWeight="700" fill="rgba(107,33,168,0.7)" letterSpacing="0.06em">
            {s.label.toUpperCase()}
          </text>
          <text x="40" y="40" fontSize="16" fontWeight="800" fill="#1f0a47">
            {s.value}
          </text>
          {s.sub ? (
            <text x="40" y="51" fontSize="8.5" fill="#047857" fontWeight="600">
              {s.sub}
            </text>
          ) : null}
        </g>
      ))}

      {/* Incident cards */}
      {incidents.map((row, i) => (
        <g key={i} transform={`translate(20 ${168 + i * 40})`}>
          <rect width="430" height="34" rx="8" fill="#ffffff" stroke={`${row.sev}55`} />
          {/* Pod glyph */}
          <g transform="translate(10 9)">
            <PodGlyph color={row.sev} />
          </g>
          <rect x="32" y="9" width="42" height="14" rx="4" fill={`${row.sev}1a`} />
          <text x="53" y="19" textAnchor="middle" fontSize="8" fontWeight="800" fill={row.sev} letterSpacing="0.05em">
            {row.sevLabel}
          </text>
          <text x="84" y="15" fontSize="10" fontWeight="700" fill="#1f0a47">
            {row.title}
          </text>
          <text x="84" y="27" fontSize="9" fill="rgba(59,7,100,0.65)" fontFamily="ui-monospace, Menlo, monospace">
            {row.pod}
            <tspan dx="6" fill="rgba(107,33,168,0.55)">· ns: {row.ns}</tspan>
          </text>
          {/* View RCA chip */}
          <g transform="translate(345 8)">
            <rect width="74" height="18" rx="9" fill="rgba(126,34,206,0.1)" stroke="rgba(126,34,206,0.4)" />
            <text x="37" y="12.5" textAnchor="middle" fontSize="9" fontWeight="700" fill="#6b21a8" letterSpacing="0.04em">
              VIEW RCA
            </text>
          </g>
        </g>
      ))}

      {/* Right panel chart - CPU trend */}
      <g>
        <rect x="470" y="168" width="270" height="74" rx="10" fill="#ffffff" stroke="rgba(126,34,206,0.18)" />
        <text x="482" y="184" fontSize="9" fontWeight="700" fill="rgba(107,33,168,0.7)" letterSpacing="0.06em">
          CPU · prod-us-west-2
        </text>
        <text x="724" y="184" textAnchor="end" fontSize="9" fill="#047857" fontWeight="600">
          ↑ 22%
        </text>
        {/* faint baseline grid */}
        <line x1="480" y1="216" x2="730" y2="216" stroke="rgba(126,34,206,0.08)" />
        <line x1="480" y1="228" x2="730" y2="228" stroke="rgba(126,34,206,0.08)" />
        <polyline
          points="480,232 510,220 540,224 570,210 600,214 630,196 660,202 690,186 720,194 730,180"
          fill="none"
          stroke="url(#kacc)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* end-point dot */}
        <circle cx="730" cy="180" r="3" fill="#7e22ce" />
      </g>
    </svg>
  );
}

/** Tiny resource glyph for a stat tile (Pods, Nodes, Deploys, Namespaces). */
function ResourceGlyph({ kind }: { kind: string }) {
  const stroke = '#7e22ce';
  if (kind === 'Pods') {
    // hex pod
    return (
      <svg width="20" height="20" viewBox="0 0 24 24">
        <polygon
          points="12,2 21,7 21,17 12,22 3,17 3,7"
          fill="rgba(126,34,206,0.12)"
          stroke={stroke}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (kind === 'Nodes') {
    // server stack
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.6">
        <rect x="3" y="4" width="18" height="6" rx="1.5" />
        <rect x="3" y="14" width="18" height="6" rx="1.5" />
        <circle cx="7" cy="7" r="0.9" fill={stroke} stroke="none" />
        <circle cx="7" cy="17" r="0.9" fill={stroke} stroke="none" />
      </svg>
    );
  }
  if (kind === 'Deploys') {
    // rocket / arrow up-right
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 19L19 5" />
        <path d="M9 5h10v10" />
      </svg>
    );
  }
  // Namespaces - braces
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3H6a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2 2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h2" />
      <path d="M16 3h2a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2 2 2 0 0 0-2 2v4a2 2 0 0 1-2 2h-2" />
    </svg>
  );
}

/** Hex pod glyph used inside incident rows. */
function PodGlyph({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <polygon
        points="12,2 21,7 21,17 12,22 3,17 3,7"
        fill={`${color}1a`}
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
