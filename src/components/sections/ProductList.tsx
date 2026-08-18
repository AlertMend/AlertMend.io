import { useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { HOME_PRODUCTS } from '../../data/homeProducts'
import Icon from '../ui/Icon'
import BrandLogo, { simpleIconsUrl, svgPornUrl } from '../ui/BrandLogo'
import RcaReportMock, { GPU_RCA } from '../mocks/RcaReportMock'
import styles from './ProductList.module.css'

type Media = { node: ReactNode }

function hexTone(i: number): 'ok' | 'warn' | 'crit' | 'idle' {
  const r = (i * 37 + 11) % 100
  if (r < 2) return 'crit'
  if (r < 8) return 'warn'
  if (r < 72) return 'ok'
  return 'idle'
}

function Console({
  title,
  meta,
  children,
}: {
  title: string
  meta?: string
  children: ReactNode
}) {
  return (
    <div className={styles.console}>
      <div className={styles.topbar}>
        <span className={styles.dots} aria-hidden><i /><i /><i /></span>
        <strong>{title}</strong>
        {meta && <em>{meta}</em>}
        <span className={styles.live}><i /> Live</span>
      </div>
      <div className={styles.body}>{children}</div>
    </div>
  )
}

function K8sMock() {
  const rows = Array.from({ length: 12 }, (_, r) =>
    Array.from({ length: r % 2 ? 18 : 19 }, (_, c) => hexTone(r * 19 + c + 3)),
  )
  const incidents = [
    { sev: 'crit', title: 'CrashLoopBackOff', target: 'payments-api · ns/prod', rca: true },
    { sev: 'crit', title: 'OOMKilled', target: 'checkout-web · ns/prod', rca: true },
    { sev: 'warn', title: 'Disk pressure', target: 'node gpu-h100-04', rca: false },
    { sev: 'warn', title: 'ImagePullBackOff', target: 'ml-worker · ns/training', rca: false },
  ] as const
  return (
    <Console title="Kubernetes" meta="prod-gpu-east · 1,247 pods">
      <div className={styles.kpis}>
        <div><span>Critical</span><b className={styles.bad}>2</b><small>RCA ready</small></div>
        <div><span>Warning</span><b className={styles.warn}>5</b><small>open</small></div>
        <div><span>Namespaces</span><b>41</b><small>healthy 38</small></div>
        <div><span>Nodes</span><b>128</b><small>GPU 24</small></div>
      </div>

      <div className={styles.k8sMain}>
        <div className={styles.hexMap}>
          <div className={styles.hexHead}>
            <span>Cluster map</span>
            <em>pods by health</em>
          </div>
          <div className={styles.hexGrid}>
            {rows.map((row, r) => (
              <div key={r} className={`${styles.hexRow} ${r % 2 ? styles.hexOff : ''}`}>
                {row.map((t, c) => (
                  <i key={c} className={`${styles.hex} ${styles[`hex_${t}`]} ${t === 'crit' || t === 'warn' ? styles.hexPulse : ''}`} />
                ))}
              </div>
            ))}
          </div>
          <div className={styles.hexLegend}>
            <span><i className={styles.hex_ok} /> healthy</span>
            <span><i className={styles.hex_warn} /> warning</span>
            <span><i className={styles.hex_crit} /> critical</span>
            <span><i className={styles.hex_idle} /> idle</span>
          </div>
        </div>

        <div className={styles.k8sSide}>
          <div className={styles.panelHead}>
            <span>Incidents</span>
            <em>2 with RCA</em>
          </div>
          {incidents.map((inc) => (
            <div key={inc.title + inc.target} className={styles.k8sInc}>
              <b className={inc.sev === 'crit' ? styles.bad : styles.warn}>
                {inc.sev === 'crit' ? 'CRIT' : 'WARN'}
              </b>
              <div>
                <strong>{inc.title}</strong>
                <span>{inc.target}</span>
              </div>
              {inc.rca ? <em>View RCA</em> : <em className={styles.muted}>Watching</em>}
            </div>
          ))}
          <div className={styles.k8sNs}>
            <header>Hot namespaces</header>
            {['prod', 'payments', 'ml-training', 'ingress'].map((ns) => (
              <span key={ns}>{ns}</span>
            ))}
          </div>
        </div>
      </div>
    </Console>
  )
}

/** APM metrics + distributed trace waterfall — same screen. */
function ObsMock() {
  const txs = [
    { path: 'GET /api/external/fail', pct: 68, ms: '12.67s', err: '100%' },
    { path: 'GET /health', pct: 14, ms: '42ms', err: '0%' },
    { path: 'POST /api/checkout', pct: 9, ms: '890ms', err: '0%' },
    { path: 'GET /api/cart', pct: 5, ms: '210ms', err: '0%' },
  ]
  const spans = [
    { name: 'GET /api/external/fail-network', left: 0, w: 96, tone: 'err', dur: '627ms' },
    { name: 'http.client · payments-upstream', left: 8, w: 78, tone: 'api', dur: '510ms' },
    { name: 'db · CREATE TABLE tmp_orders', left: 12, w: 36, tone: 'db', dur: '180ms' },
    { name: 'db · SELECT inventory', left: 50, w: 24, tone: 'db', dur: '96ms' },
  ]
  return (
    <Console title="Observability" meta="APM · Traces · last 1h">
      <div className={styles.kpis}>
        <div>
          <span>Most time</span>
          <b>68.6%</b>
          <small>GET /api/external/fail</small>
        </div>
        <div>
          <span>P95 latency</span>
          <b>14.36s</b>
          <small>18 traces</small>
        </div>
        <div>
          <span>Error rate</span>
          <b className={styles.bad}>22%</b>
          <small>Critical</small>
        </div>
        <div>
          <span>Traces</span>
          <b>21</b>
          <small>8 transactions</small>
        </div>
      </div>

      <div className={styles.obsGrid}>
        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <span>Top transactions</span>
            <em>share · latency · errors</em>
          </div>
          {txs.map((t) => (
            <div key={t.path} className={styles.tx}>
              <div className={styles.txMain}>
                <strong>{t.path}</strong>
                <div className={styles.bar}><i style={{ width: `${t.pct}%` }} /></div>
              </div>
              <span>{t.ms}</span>
              <b className={t.err === '0%' ? styles.muted : styles.bad}>{t.err}</b>
            </div>
          ))}
        </div>

        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <span>Time consumed</span>
            <em>req/s · 15m</em>
          </div>
          <svg className={styles.chart} viewBox="0 0 360 110" preserveAspectRatio="none" aria-hidden>
            <defs>
              <linearGradient id="plFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[28, 55, 82].map((y) => (
              <line key={y} x1="0" x2="360" y1={y} y2={y} stroke="rgba(255,255,255,0.06)" />
            ))}
            <polygon fill="url(#plFill)" points="0,110 0,78 45,76 90,72 135,68 180,22 225,18 270,62 315,70 360,74 360,110" />
            <polyline fill="none" stroke="#8b5cf6" strokeWidth="2.2" points="0,78 45,76 90,72 135,68 180,22 225,18 270,62 315,70 360,74" />
            <polyline fill="none" stroke="#38bdf8" strokeWidth="1.7" points="0,86 45,85 90,84 135,82 180,48 225,46 270,78 315,84 360,86" />
            <polyline fill="none" stroke="#f87171" strokeWidth="1.7" points="0,92 45,92 90,91 135,90 180,40 225,36 270,82 315,90 360,92" />
          </svg>
          <div className={styles.legend}>
            <span><i style={{ background: '#8b5cf6' }} /> fail</span>
            <span><i style={{ background: '#38bdf8' }} /> health</span>
            <span><i style={{ background: '#f87171' }} /> errors</span>
          </div>
        </div>
      </div>

      <div className={styles.panel}>
        <div className={styles.panelHead}>
          <span>Trace · GET /api/external/fail-network</span>
          <em><b className={styles.bad}>502</b> · 627ms · API bottleneck</em>
        </div>
        <div className={styles.wfAxis} aria-hidden>
          <span>0ms</span><span>200</span><span>400</span><span>627ms</span>
        </div>
        {spans.map((s) => (
          <div key={s.name} className={styles.wf}>
            <span>{s.name}</span>
            <div className={styles.wfTrack}>
              <i
                className={styles[`span_${s.tone}`]}
                style={{ width: `${s.w}%`, marginLeft: `${s.left}%` }}
              />
            </div>
            <em>{s.dur}</em>
          </div>
        ))}
      </div>
    </Console>
  )
}

function LogsMock() {
  const rows = [
    { t: '14:02:11.102', sev: 'INFO', msg: 'checkout.session started · cart_id=8f2a' },
    { t: '14:02:11.884', sev: 'WARN', msg: 'retrying payment gateway · attempt 2/3' },
    { t: '14:02:12.441', sev: 'ERROR', msg: 'Sent 502 in 10153ms · upstream timeout' },
    { t: '14:02:12.502', sev: 'ERROR', msg: 'socket closed · external dependency unreachable' },
    { t: '14:02:13.018', sev: 'INFO', msg: 'fallback queue enqueued · order_id=9912' },
    { t: '14:02:13.220', sev: 'WARN', msg: 'circuit breaker half-open · payments-api' },
  ]
  return (
    <Console title="Log explorer" meta="SQL · 119 events">
      <div className={styles.sql}>
        <code>
          SELECT _timestamp, service, severity, message FROM logs
          WHERE severity IN (&apos;ERROR&apos;,&apos;WARN&apos;) ORDER BY _timestamp DESC
        </code>
        <span>Run</span>
      </div>
      <div className={styles.logsLayout}>
        <aside>
          <header>Fields</header>
          {['_timestamp', 'severity', 'service', 'message', 'trace_id', 'host'].map((f) => (
            <label key={f}><i />{f}</label>
          ))}
        </aside>
        <div className={styles.logTable}>
          <div className={styles.logHead}>
            <span>Timestamp</span><span>Sev</span><span>Message</span>
          </div>
          {rows.map((r) => (
            <div key={r.t + r.msg} className={styles.logRow}>
              <span className={styles.mono}>{r.t}</span>
              <span className={styles[`sev_${r.sev}`]}>{r.sev}</span>
              <span>{r.msg}</span>
            </div>
          ))}
        </div>
      </div>
    </Console>
  )
}

function RcaMock() {
  return <RcaReportMock story={GPU_RCA} />
}

function RfMock() {
  const nodes = [
    {
      kind: 'trigger',
      left: '4%',
      top: '9%',
      label: 'Trigger',
      title: 'Alert fired',
      sub: 'CrashLoopBackOff · prod cluster',
      ico: 'bolt' as const,
      bg: 'rgba(248,113,113,0.18)',
      fg: '#f87171',
      brand: { src: simpleIconsUrl('prometheus', 'E6522C'), alt: 'Alertmanager' },
    },
    {
      kind: 'cmd',
      left: '28%',
      top: '28%',
      label: 'Command',
      title: 'Run pod diagnostic',
      sub: 'kubectl describe + logs · last 5m',
      ico: 'cmdline' as const,
      bg: 'rgba(99,102,241,0.18)',
      fg: '#a5b4fc',
      brand: { src: svgPornUrl('kubernetes'), alt: 'Kubernetes' },
    },
    {
      kind: 'iff',
      left: '52%',
      top: '28%',
      label: 'If / else',
      title: 'restarts > 5?',
      sub: 'Branch on container status',
      ico: 'activity' as const,
      bg: 'rgba(251,191,36,0.16)',
      fg: '#fbbf24',
    },
    {
      kind: 'appr',
      left: '76%',
      top: '8%',
      label: 'Approval · Slack',
      title: 'Approve restart',
      sub: '@oncall · 5 min timeout',
      ico: 'check-thick' as const,
      bg: 'rgba(124,58,237,0.2)',
      fg: '#c4b5fd',
      brand: { src: svgPornUrl('slack'), alt: 'Slack' },
    },
    {
      kind: 'msg',
      left: '76%',
      top: '48%',
      label: 'Send Message',
      title: 'Slack info post',
      sub: '#sre-ops · transient blip',
      ico: 'send' as const,
      bg: 'rgba(52,211,153,0.16)',
      fg: '#34d399',
      brand: { src: svgPornUrl('slack'), alt: 'Slack' },
    },
    {
      kind: 'fix',
      left: '28%',
      top: '68%',
      label: 'Remediation',
      title: 'Rollout restart',
      sub: 'Fan out · all pods · label tier=api',
      ico: 'rotate' as const,
      bg: 'rgba(124,58,237,0.2)',
      fg: '#c4b5fd',
      brand: { src: svgPornUrl('kubernetes'), alt: 'Kubernetes' },
    },
    {
      kind: 'sum',
      left: '60%',
      top: '78%',
      label: 'Closing summary',
      title: 'Post to Slack',
      sub: 'What ran · who approved · audit link',
      ico: 'shieldCheck' as const,
      bg: 'rgba(52,211,153,0.16)',
      fg: '#34d399',
      brand: { src: svgPornUrl('slack'), alt: 'Slack' },
    },
  ]

  /* Edge endpoints are % of the same 1000×460 space the nodes sit in. */
  const edges = [
    { id: 'pl-e1', d: 'M 220 90 C 250 90, 250 168, 280 168', dur: '2.2s', begin: '0s' },
    { id: 'pl-e2', d: 'M 460 168 L 520 168', dur: '1.6s', begin: '0.4s' },
    { id: 'pl-e3', d: 'M 700 155 C 730 155, 730 78, 760 78', dur: '1.8s', begin: '0.9s' },
    { id: 'pl-e4', d: 'M 700 185 C 730 185, 730 260, 760 260', dur: '1.8s', begin: '1.2s' },
    { id: 'pl-e5', d: 'M 760 120 C 700 120, 700 313, 370 313', dur: '2.4s', begin: '1.6s' },
    { id: 'pl-e6', d: 'M 460 350 C 520 350, 520 400, 600 400', dur: '1.8s', begin: '2.2s' },
  ]

  return (
    <Console title="RF · Remediation" meta="CrashLoopBackOff · Active">
      <div className={styles.rfApp}>
        <div className={styles.rfBar}>
          <div className={styles.rfTabs}>
            <span className={styles.rfTabOn}>
              <Icon name="workflow" size={13} strokeWidth={2.4} />
              Auto-remediate · CrashLoopBackOff
            </span>
            <span>Disk pressure · VM fleet</span>
            <span>Cost · right-size pods</span>
          </div>
          <div className={styles.rfBarRight}>
            <span className={styles.rfActive}><i /> Active</span>
            <span className={styles.rfPlay}>
              <Icon name="play" size={11} />
              Play
            </span>
          </div>
        </div>

        <div className={styles.rfStage}>
          <svg className={styles.rfEdges} viewBox="0 0 1000 460" preserveAspectRatio="none" aria-hidden>
            <defs>
              <linearGradient id="plRfEdge" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#818cf8" stopOpacity="0.95" />
              </linearGradient>
              <radialGradient id="plRfPulse" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0%" stopColor="#c4b5fd" stopOpacity="1" />
                <stop offset="60%" stopColor="#7c3aed" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
              </radialGradient>
              <marker
                id="plRfArrow"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#a78bfa" />
              </marker>
            </defs>
            {edges.map((e) => (
              <path
                key={e.id}
                id={e.id}
                d={e.d}
                stroke="url(#plRfEdge)"
                strokeWidth="2.4"
                fill="none"
                markerEnd="url(#plRfArrow)"
              />
            ))}
            {edges.map((e) => (
              <g key={`${e.id}-pulse`}>
                <circle r="5.5" fill="url(#plRfPulse)" opacity="0.55">
                  <animateMotion dur={e.dur} begin={e.begin} repeatCount="indefinite" rotate="auto">
                    <mpath href={`#${e.id}`} />
                  </animateMotion>
                </circle>
                <circle r="2.2" fill="#c4b5fd">
                  <animateMotion dur={e.dur} begin={e.begin} repeatCount="indefinite" rotate="auto">
                    <mpath href={`#${e.id}`} />
                  </animateMotion>
                </circle>
              </g>
            ))}
          </svg>

          {nodes.map((n) => (
            <div
              key={n.title}
              className={`${styles.rfNode} ${styles[`rf_${n.kind}`]}`}
              style={{ left: n.left, top: n.top }}
            >
              <div className={styles.rfNodeH}>
                <span className={styles.rfIco} style={{ background: n.bg, color: n.fg }}>
                  <Icon name={n.ico} size={13} strokeWidth={2.4} />
                </span>
                <em>{n.label}</em>
                {n.brand && (
                  <BrandLogo src={n.brand.src} alt={n.brand.alt} className={styles.rfBrand} />
                )}
              </div>
              <strong>{n.title}</strong>
              <span>{n.sub}</span>
            </div>
          ))}
        </div>

        <div className={styles.rfPalette}>
          <header>Action blocks</header>
          <div>
            {['Command', 'Predefined', 'Delay', 'Approval', 'Send Message', 'Declare Incident', 'REST API'].map((c) => (
              <span key={c}>{c}</span>
            ))}
          </div>
        </div>
      </div>
    </Console>
  )
}

function OnCallMock() {
  return (
    <Console title="On-call" meta="payments · SEV-2">
      <div className={styles.kpis}>
        <div><span>Primary</span><b>@alex</b><small>until 08:00 IST</small></div>
        <div><span>Backup</span><b>@mira</b><small>next</small></div>
        <div><span>Open pages</span><b>3</b><small>2 with RCA</small></div>
        <div><span>MTTA</span><b>4m</b><small>last 7d</small></div>
      </div>
      <div className={styles.pages}>
        {[
          ['#4821', 'CrashLoopBackOff · payments-api', 'RCA attached'],
          ['#4819', 'Latency spike · checkout', 'escalated'],
          ['#4814', 'Disk pressure · redis-0', 'ack’d'],
        ].map(([id, title, st]) => (
          <div key={id}>
            <span className={styles.mono}>{id}</span>
            <p>{title}</p>
            <em>{st}</em>
          </div>
        ))}
      </div>
    </Console>
  )
}

function FinOpsMock() {
  const rows = [
    { ns: 'payments', spend: '$1,842', req: 92, used: 34 },
    { ns: 'observability', spend: '$1,210', req: 78, used: 51 },
    { ns: 'checkout', spend: '$964', req: 64, used: 48 },
    { ns: 'ml-training', spend: '$488', req: 88, used: 22 },
  ]
  return (
    <Console title="FinOps" meta="prod-us-west-2 · last 30d">
      <div className={styles.kpis}>
        <div><span>Cluster spend</span><b>$4,504</b><small>last 30d</small></div>
        <div><span>Recoverable</span><b className={styles.ok}>$1,378</b><small>safe to reclaim</small></div>
        <div><span>Right-size</span><b className={styles.ok}>$412/mo</b><small>CPU + mem</small></div>
        <div><span>Idle GPU</span><b className={styles.ok}>$214/mo</b><small>3 nodes</small></div>
      </div>

      <div className={styles.finMain}>
        <div className={styles.finSpend}>
          <div className={styles.panelHead}>
            <span>Spend by namespace</span>
            <em>requested vs used</em>
          </div>
          {rows.map((r) => (
            <div key={r.ns} className={styles.finRow}>
              <div className={styles.finRowTop}>
                <strong>{r.ns}</strong>
                <span>{r.spend}</span>
              </div>
              <div className={styles.finDual}>
                <i style={{ width: `${r.req}%` }} />
                <b style={{ width: `${r.used}%` }} />
              </div>
            </div>
          ))}
          <div className={styles.finLegend}>
            <span><i /> requested</span>
            <span><b /> used</span>
          </div>
        </div>

        <div className={styles.finRec}>
          <div className={styles.panelHead}>
            <span>Right-size recommendation</span>
            <em className={styles.ok}>−$412/mo</em>
          </div>
          <div className={styles.finRecTitle}>
            payments-api · CPU 2000m → 750m
          </div>
          <div className={styles.finYaml}>
            <div className={styles.finYamlHead}>deploy/payments-api/values.yaml</div>
            <pre>
              <code>resources:</code>
              <code>  requests:</code>
              <code className={styles.finDel}>−   cpu: 2000m</code>
              <code className={styles.finAdd}>+   cpu: 750m</code>
              <code className={styles.finDel}>−   memory: 4Gi</code>
              <code className={styles.finAdd}>+   memory: 1.5Gi</code>
            </pre>
          </div>
          <div className={styles.finChecks}>
            <span>✓ based on p95 usage · 30d + headroom</span>
            <span>✓ approval required · rollback on regression</span>
          </div>
          <div className={styles.finActions}>
            <span className={styles.finPrimary}>Preview YAML</span>
            <span className={styles.finGhost}>Apply to cluster</span>
          </div>
        </div>
      </div>
    </Console>
  )
}

const MEDIA: Record<string, Media> = {
  k8s: { node: <K8sMock /> },
  obs: { node: <ObsMock /> },
  logs: { node: <LogsMock /> },
  rca: { node: <RcaMock /> },
  fix: { node: <RfMock /> },
  oncall: { node: <OnCallMock /> },
  finops: { node: <FinOpsMock /> },
}

export default function ProductList() {
  const [active, setActive] = useState('obs')
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => {
      setActive((cur) => {
        const i = HOME_PRODUCTS.findIndex((p) => p.id === cur)
        return HOME_PRODUCTS[(i + 1) % HOME_PRODUCTS.length].id
      })
    }, 9000)
    return () => window.clearInterval(id)
  }, [paused])

  const product = HOME_PRODUCTS.find((p) => p.id === active) ?? HOME_PRODUCTS[0]
  const media = MEDIA[product.id]
  const idx = String(HOME_PRODUCTS.findIndex((p) => p.id === product.id) + 1).padStart(2, '0')

  return (
    <section id="products" className={styles.section}>
      <div className="container">
        <div className={`sec-head ${styles.head}`}>
          <span className="sec-tag">Products</span>
          <h2>One console. Every surface that matters.</h2>
          <p>Flip through the real product — then go deeper on any page.</p>
        </div>

        <div className={styles.rail}>
          <div className={styles.tabs} role="tablist" aria-label="Product surfaces">
            {HOME_PRODUCTS.map((p) => (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={p.id === active}
                className={p.id === active ? styles.tabOn : styles.tab}
                onClick={() => {
                  setPaused(true)
                  setActive(p.id)
                }}
              >
                {p.tab}
              </button>
            ))}
          </div>

          <div className={styles.shell} key={product.id}>
            <div className={styles.meta}>
              <div className={styles.copy}>
                <span className={styles.idx}>{idx}</span>
                <div>
                  <h3>{product.name}</h3>
                  <p>{product.line}</p>
                </div>
              </div>
              <Link to={product.to} className={styles.cta}>
                Explore {product.tab}
                <ArrowRight size={15} strokeWidth={2.2} />
              </Link>
            </div>
            <div className={styles.viewport} aria-hidden>
              {media.node}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
