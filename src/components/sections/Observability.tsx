import type { ReactNode } from 'react';
import Icon from '../ui/Icon';
import styles from './Observability.module.css';

/**
 * Observability section — the connected-telemetry pillar that the site
 * previously never surfaced despite it being one of the largest pieces of
 * the product (APM, distributed tracing on OpenTelemetry + eBPF
 * auto-instrumentation, a live service map, SQL-queryable logs, and
 * metrics/dashboards, all correlated by the AI for RCA).
 *
 * Tone follows Datadog / New Relic: "every signal, one platform, one
 * timeline" — but the claims map 1:1 to what actually ships in
 * auto_remediation (no GPU/MLOps aspirational copy here).
 */

type Surface = {
  ico: ReactNode;
  title: string;
  body: ReactNode;
  tags: string[];
};

const surfaces: Surface[] = [
  {
    ico: <Icon name="activity" size={17} />,
    title: 'APM & distributed tracing',
    body: (
      <>
        Follow a request across every hop — service to service, into the
        database, out to the queue. p50/p95/p99, error rates and span
        waterfalls, with the slow span highlighted.
      </>
    ),
    tags: ['p99', 'span-waterfall', 'errors'],
  },
  {
    ico: <Icon name="cpu" size={17} />,
    title: 'eBPF auto-instrumentation',
    body: (
      <>
        Get golden-signal traces with <b>zero code changes</b>. A kernel-level
        eBPF agent captures HTTP, gRPC and SQL calls the moment it lands on
        the node.
      </>
    ),
    tags: ['no-code', 'kernel', 'grpc', 'sql'],
  },
  {
    ico: <Icon name="layers" size={17} />,
    title: 'Live service map',
    body: (
      <>
        The real topology, drawn from live traffic. See dependencies,
        request rates and where errors propagate — click any node to drop
        into its traces, logs and metrics.
      </>
    ),
    tags: ['topology', 'dependencies', 'drill-down'],
  },
  {
    ico: <Icon name="database" size={17} />,
    title: 'Logs you query in SQL',
    body: (
      <>
        <code>SELECT * FROM logs</code> with namespace, pod and node fields —
        time-range presets and stream selection. Fast at production volume.
      </>
    ),
    tags: ['sql', 'indexed'],
  },
  {
    ico: <Icon name="bar" size={17} />,
    title: 'Metrics & dashboards',
    body: (
      <>
        Prometheus-native panels with data-source selectors, auto-refresh
        and workspace persistence. One source of truth across every team.
      </>
    ),
    tags: ['prometheus', 'panels', 'workspace'],
  },
  {
    ico: <Icon name="brain" size={17} />,
    title: 'AI RCA across every signal',
    body: (
      <>
        Traces, logs, metrics and K8s events land on one timeline — then the
        agent correlates them into a root-cause narrative in{' '}
        <b>~15 seconds</b>, not a dashboard hunt.
      </>
    ),
    tags: ['correlation', 'root-cause', '15s'],
  },
];

/** Inline service-map SVG — three tiers of nodes with an error edge,
 *  purely decorative (aria-hidden). Colors come from the token system so
 *  it recolors with the brand accent. */
function ServiceMapViz() {
  return (
    <svg
      className={styles.vizSvg}
      viewBox="0 0 520 190"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="obsWeb" cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#6d28d9" />
        </radialGradient>
        <radialGradient id="obsNode" cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#1c2942" />
          <stop offset="100%" stopColor="#111a2c" />
        </radialGradient>
        <radialGradient id="obsDb" cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#e05a5a" />
          <stop offset="100%" stopColor="#a11d1d" />
        </radialGradient>
        <filter id="obsGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* healthy edges (curved) */}
      <g stroke="rgba(255,255,255,0.14)" strokeWidth="1.5" fill="none">
        <path d="M94 95 Q165 68 212 54" />
        <path d="M94 95 Q165 122 212 136" />
        <path d="M256 52 Q330 52 392 52" />
        <path d="M256 136 Q330 116 392 97" />
      </g>

      {/* failing edge auth -> db */}
      <path
        id="obsErrEdge"
        d="M256 138 Q330 138 392 138"
        stroke="#f87171"
        strokeWidth="2.2"
        strokeDasharray="5 5"
        fill="none"
      >
        <animate attributeName="stroke-dashoffset" from="20" to="0" dur="0.8s" repeatCount="indefinite" />
      </path>

      {/* live traffic dot travelling web -> auth -> db */}
      <circle r="3.2" fill="#a78bfa">
        <animateMotion dur="2.6s" repeatCount="indefinite" path="M72 95 Q165 122 234 138 Q330 138 414 138" />
        <animate attributeName="opacity" values="0;1;1;0" dur="2.6s" repeatCount="indefinite" />
      </circle>

      {/* nodes */}
      <g fontFamily="'JetBrains Mono', monospace" fontSize="10.5">
        <g>
          <circle cx="72" cy="95" r="23" fill="url(#obsWeb)" stroke="#c4b5fd" strokeWidth="1.5" filter="url(#obsGlow)" />
          <text x="72" y="99" textAnchor="middle" fill="#f5f3ff" fontWeight="700">web</text>
        </g>
        {[
          { x: 234, y: 52, label: 'api' },
          { x: 234, y: 138, label: 'auth' },
          { x: 414, y: 52, label: 'cache' },
          { x: 414, y: 95, label: 'cart' },
        ].map((n) => (
          <g key={n.label}>
            <circle cx={n.x} cy={n.y} r="22" fill="url(#obsNode)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.3" />
            <text x={n.x} y={n.y + 3} textAnchor="middle" fill="rgba(230,232,236,0.82)">{n.label}</text>
          </g>
        ))}
        {/* failing node with pulsing halo */}
        <g>
          <circle cx="414" cy="138" r="22" fill="none" stroke="#f87171" strokeWidth="2">
            <animate attributeName="r" values="22;30;22" dur="1.8s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.7;0;0.7" dur="1.8s" repeatCount="indefinite" />
          </circle>
          <circle cx="414" cy="138" r="22" fill="url(#obsDb)" stroke="#fca5a5" strokeWidth="2" filter="url(#obsGlow)" />
          <text x="414" y="135" textAnchor="middle" fill="#fff" fontWeight="700">db</text>
          <text x="414" y="147" textAnchor="middle" fill="#ffe0e0" fontSize="8">5xx</text>
        </g>
      </g>
    </svg>
  );
}

type Span = { name: string; left: number; width: number; ms: string; kind?: 'warn' | 'err' };
const spans: Span[] = [
  { name: 'GET /checkout', left: 0, width: 100, ms: '812ms' },
  { name: '  api.handle', left: 6, width: 82, ms: '740ms' },
  { name: '  auth.verify', left: 10, width: 14, ms: '61ms' },
  { name: '  db.query', left: 40, width: 55, ms: '498ms', kind: 'err' },
  { name: '  cache.get', left: 24, width: 9, ms: '22ms', kind: 'warn' },
];

export default function Observability() {
  return (
    <section id="observability" className={styles.section}>
      <div className="container">
        <div className={styles.lead}>
          <div className={`${styles.leadCopy} reveal`}>
            <span className="sec-tag">Observability</span>
            <h2>
              Every signal on <em>one timeline</em>. Then the AI reads it for
              you.
            </h2>
            <p>
              Metrics, logs, traces and Kubernetes events collected through
              OpenTelemetry and eBPF — correlated, not siloed. Stop stitching
              four tools together to answer one question.
            </p>
            <div className={styles.pillList}>
              <div className={styles.pillRow}>
                <Icon name="check" size={15} strokeWidth={3} />
                Traces, logs & metrics in a single query surface
              </div>
              <div className={styles.pillRow}>
                <Icon name="check" size={15} strokeWidth={3} />
                eBPF auto-instrumentation — no code changes
              </div>
              <div className={styles.pillRow}>
                <Icon name="check" size={15} strokeWidth={3} />
                Click any anomaly → RCA in ~15 seconds
              </div>
            </div>
          </div>

          <div className={`${styles.viz} reveal`}>
            <div className={styles.vizBar}>
              <span className={styles.dot} />
              <span className={styles.dot} />
              <span className={styles.dot} />
              <span className={styles.vizTitle}>service-map · checkout</span>
              <span className={styles.livePill}>
                <span className={styles.liveDot} /> Live
              </span>
            </div>
            <div className={styles.vizBody}>
              <ServiceMapViz />
              <div className={styles.waterfall}>
                {spans.map((s) => (
                  <div key={s.name} className={styles.span}>
                    <span className={styles.spanName}>{s.name}</span>
                    <span className={styles.track}>
                      <span
                        className={`${styles.bar} ${
                          s.kind === 'err'
                            ? styles.barErr
                            : s.kind === 'warn'
                              ? styles.barWarn
                              : ''
                        }`}
                        style={{ left: `${s.left}%`, width: `${s.width}%` }}
                      />
                    </span>
                    <span className={styles.spanMs}>{s.ms}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={`${styles.grid} reveal`}>
          {surfaces.map((s) => (
            <div key={s.title} className={styles.card}>
              <span className={styles.ico}>{s.ico}</span>
              <h4>{s.title}</h4>
              <p>{s.body}</p>
              <div className={styles.tagRow}>
                {s.tags.map((t) => (
                  <span key={t} className={styles.tag}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className={`${styles.strip} reveal`}>
          <span>
            Built on <b>OpenTelemetry</b> + <b>eBPF</b>, with{' '}
            <b>Prometheus</b>-native metrics.
          </span>
          <a href="/observability">See observability →</a>
        </div>
      </div>
    </section>
  );
}
