import {
  Columns,
  Workflow,
  Database,
  FileBarChart2,
  Users,
  Check,
} from 'lucide-react'
import { withBrandLogo } from '../../data/brandLogos'
import styles from './Enterprise.module.css'
import dd from './DataDepth.module.css'

/* Feedback sections for /data-observability: lineage and impact analysis
   (with business impact) and policy as the data contract. */

/* ---------------- Lineage and impact ---------------- */

type NodeState = 'ok' | 'cause' | 'fail' | 'impact'
const LINEAGE: { col: string; nodes: { name: string; kind: string; state: NodeState }[] }[] = [
  {
    col: 'Source',
    nodes: [
      { name: 'Core banking', kind: 'Oracle', state: 'ok' },
      { name: 'Trades feed', kind: 'SFTP drop', state: 'ok' },
    ],
  },
  {
    col: 'Pipeline',
    nodes: [
      { name: 'Nightly positions load', kind: 'Airflow DAG', state: 'cause' },
      { name: 'Customer load', kind: 'ODI job', state: 'ok' },
    ],
  },
  {
    col: 'Warehouse',
    nodes: [
      { name: 'Daily positions', kind: 'Snowflake table', state: 'fail' },
      { name: 'Bank accounts', kind: 'Snowflake table', state: 'ok' },
    ],
  },
  {
    col: 'Reports',
    nodes: [
      { name: 'Liquidity risk', kind: 'Power BI', state: 'impact' },
      { name: 'Daily P&L', kind: 'Power BI', state: 'impact' },
      { name: 'Regulatory returns', kind: 'Power BI', state: 'impact' },
    ],
  },
]

const STATE_LABEL: Record<NodeState, string> = {
  ok: 'Healthy',
  cause: 'Root cause',
  fail: 'Check failed',
  impact: 'Affected',
}

/* Desktop lineage view: an SVG graph drawn like the product's lineage screen.
   Phones get the stacked column list below instead. */

type GNode = { id: string; x: number; y: number; kind: string; brand?: string; name: string; state: NodeState }

const NODE_W = 248

// Square icon marks for the graph; the site's default Snowflake and Oracle
// logos are wordmarks that shrink to unreadable at 28px.
const GRAPH_LOGOS: Record<string, string> = {
  Snowflake: 'https://cdn.svgporn.com/logos/snowflake-icon.svg',
}

// Oracle has no square icon on the logo CDNs, so draw its red capsule mark inline.
const INLINE_MARKS = new Set(['Oracle', 'Oracle ODI'])
const NODE_H = 72

const G_NODES: GNode[] = [
  { id: 'feed', x: 24, y: 116, kind: 'SFTP drop', name: 'Trades feed', state: 'ok' },
  { id: 'core', x: 24, y: 234, kind: 'Oracle database', brand: 'Oracle', name: 'Core banking', state: 'ok' },
  { id: 'dag', x: 306, y: 174, kind: 'Airflow DAG', brand: 'Airflow', name: 'Nightly positions', state: 'cause' },
  { id: 'odi', x: 306, y: 352, kind: 'Oracle ODI job', brand: 'Oracle ODI', name: 'Customer load', state: 'ok' },
  { id: 'pos', x: 588, y: 174, kind: 'Snowflake table', brand: 'Snowflake', name: 'Daily positions', state: 'fail' },
  { id: 'acc', x: 588, y: 352, kind: 'Snowflake table', brand: 'Snowflake', name: 'Bank accounts', state: 'ok' },
  { id: 'r1', x: 872, y: 80, kind: 'Power BI report', brand: 'Power BI', name: 'Liquidity risk', state: 'impact' },
  { id: 'r2', x: 872, y: 174, kind: 'Power BI report', brand: 'Power BI', name: 'Daily P&L', state: 'impact' },
  { id: 'r3', x: 872, y: 268, kind: 'Power BI report', brand: 'Power BI', name: 'Regulatory returns', state: 'impact' },
  { id: 'r4', x: 872, y: 362, kind: 'Power BI report', brand: 'Power BI', name: 'Customer 360', state: 'ok' },
]

const G_EDGES: { from: string; to: string; hot?: 'cause' | 'impact' }[] = [
  { from: 'feed', to: 'dag' },
  { from: 'core', to: 'dag' },
  { from: 'core', to: 'odi' },
  { from: 'dag', to: 'pos', hot: 'cause' },
  { from: 'odi', to: 'acc' },
  { from: 'pos', to: 'r1', hot: 'impact' },
  { from: 'pos', to: 'r2', hot: 'impact' },
  { from: 'pos', to: 'r3', hot: 'impact' },
  { from: 'acc', to: 'r3' },
  { from: 'acc', to: 'r4' },
]

const G_COLS = [
  { x: 24, label: 'Source' },
  { x: 306, label: 'Pipeline' },
  { x: 588, label: 'Warehouse' },
  { x: 872, label: 'Reports' },
]

const STATE_COLOR: Record<NodeState, string> = {
  ok: '#10b981',
  cause: '#d97706',
  fail: '#dc2626',
  impact: '#7c3aed',
}

function LineageGraph() {
  const byId = Object.fromEntries(G_NODES.map((n) => [n.id, n]))
  // When several edges enter the same node, spread their end points so the
  // arrowheads don't stack on top of each other.
  const incoming = (id: string) => G_EDGES.filter((e) => e.to === id).sort((p, q) => byId[p.from].y - byId[q.from].y)
  const endOffset = (e: { from: string; to: string }) => {
    const list = incoming(e.to)
    if (list.length < 2) return 0
    const i = list.findIndex((x) => x.from === e.from)
    return (i - (list.length - 1) / 2) * 16
  }
  const edgePath = (a: GNode, b: GNode, off = 0) => {
    const x1 = a.x + NODE_W
    const y1 = a.y + NODE_H / 2
    const x2 = b.x - 3
    const y2 = b.y + NODE_H / 2 + off
    const dx = (x2 - x1) / 2
    return `M${x1},${y1} C${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}`
  }

  return (
    <div className={dd.graphFrame}>
      <div className={dd.graphBar}>
        <div className={dd.graphTitle}>
          <span className={dd.graphDots} aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span>Lineage</span>
          <span className={dd.graphCrumb}>Daily positions</span>
        </div>
        <ul className={dd.legend}>
          <li><i style={{ background: STATE_COLOR.cause }} />Root cause</li>
          <li><i style={{ background: STATE_COLOR.fail }} />Check failed</li>
          <li><i style={{ background: STATE_COLOR.impact }} />Affected</li>
          <li><i style={{ background: STATE_COLOR.ok }} />Healthy</li>
        </ul>
      </div>

      <svg
        className={dd.graph}
        viewBox="0 0 1148 450"
        role="img"
        aria-label="Lineage example: the Airflow nightly positions load is the root cause of a failed check on the Daily positions table in Snowflake, which affects three Power BI reports."
      >
        <defs>
          <pattern id="lg-dots" width="18" height="18" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="#e2e8f0" />
          </pattern>
          <marker id="lg-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M0,0 L8,4 L0,8 z" fill="#cbd5e1" />
          </marker>
          <marker id="lg-arrow-cause" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M0,0 L8,4 L0,8 z" fill={STATE_COLOR.fail} />
          </marker>
          <marker id="lg-arrow-impact" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M0,0 L8,4 L0,8 z" fill={STATE_COLOR.impact} />
          </marker>
          <filter id="lg-shadow" x="-10%" y="-20%" width="120%" height="150%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#0b1220" floodOpacity="0.08" />
          </filter>
        </defs>

        <rect width="1148" height="450" fill="url(#lg-dots)" />

        {G_COLS.map((c) => (
          <text key={c.label} x={c.x} y={48} className={dd.gCol}>
            {c.label.toUpperCase()}
          </text>
        ))}

        {G_EDGES.map((e) => {
          const d = edgePath(byId[e.from], byId[e.to], endOffset(e))
          const color = e.hot === 'cause' ? STATE_COLOR.fail : e.hot === 'impact' ? STATE_COLOR.impact : '#cbd5e1'
          return (
            <g key={`${e.from}-${e.to}`}>
              <path
                d={d}
                fill="none"
                stroke={color}
                strokeWidth={e.hot ? 2 : 1.5}
                strokeOpacity={e.hot ? 0.9 : 1}
                markerEnd={`url(#lg-arrow${e.hot ? `-${e.hot}` : ''})`}
              />
              {e.hot && <path d={d} fill="none" stroke={color} strokeWidth={2} className={dd.flow} />}
            </g>
          )
        })}

        {G_NODES.map((n) => {
          const inlineOracle = n.brand ? INLINE_MARKS.has(n.brand) : false
          const brand = n.brand && !inlineOracle ? { logoSrc: GRAPH_LOGOS[n.brand] ?? withBrandLogo({ label: n.brand }).logoSrc } : null
          const color = STATE_COLOR[n.state]
          const hot = n.state !== 'ok'
          const label = STATE_LABEL[n.state]
          const pillW = label.length * 6.6 + 20
          return (
            <g key={n.id} transform={`translate(${n.x},${n.y})`}>
              {n.state === 'fail' && (
                <rect x={-4} y={-4} width={NODE_W + 8} height={NODE_H + 8} rx={14} fill="none" stroke={color} strokeWidth={3} className={dd.pulse} />
              )}
              <g filter="url(#lg-shadow)">
                <rect width={NODE_W} height={NODE_H} rx={12} fill="#fff" stroke={hot ? color : '#e2e8f0'} strokeWidth={hot ? 1.5 : 1} />
              </g>
              <rect x={14} y={14} width={44} height={44} rx={10} fill="#f8fafc" stroke="#e2e8f0" />
              {inlineOracle ? (
                <rect x={22} y={27} width={28} height={18} rx={9} fill="none" stroke="#F80000" strokeWidth={4.5} />
              ) : brand?.logoSrc ? (
                <image href={brand.logoSrc} x={22} y={22} width={28} height={28} preserveAspectRatio="xMidYMid meet" />
              ) : (
                <g transform="translate(24,24)" stroke="#475569" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 6a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z" />
                </g>
              )}
              <text x={70} y={33} className={dd.gName}>{n.name}</text>
              <text x={70} y={52} className={dd.gKind}>{n.kind}</text>
              {hot && (
                <g transform={`translate(${NODE_W - pillW - 12},-11)`}>
                  <rect width={pillW} height={22} rx={11} fill={color} />
                  <text x={pillW / 2} y={15} textAnchor="middle" className={dd.gPill} fill="#fff">
                    {label}
                  </text>
                </g>
              )}
            </g>
          )
        })}
      </svg>

      <div className={dd.graphFoot}>
        <span><b>Root cause</b> Nightly positions (Airflow DAG) failed after 3 retries</span>
        <span><b>Check</b> Freshness on Daily positions, policy clause 4.2</span>
        <span><b>Impact</b> 3 Power BI reports flagged</span>
      </div>
    </div>
  )
}

export function LineageImpact() {
  return (
    <section className={styles.sectionAlt} id="lineage">
      <div className={styles.wrap}>
        <div className={styles.head}>
          <div>
            <span className={styles.eyebrow}>Lineage and impact analysis</span>
            <h2 className={styles.h2}>Upstream cause. Downstream impact. Before anyone asks.</h2>
          </div>
          <p className={styles.lede}>
            When a check fails, AlertMend walks the lineage both ways: up to the job that broke the table, and down to the
            reports that will show the wrong number. When the platform underneath is the cause,
            AI root cause analysis shows that too, with a fix your team approves.
          </p>
        </div>

        <LineageGraph />

        <div className={`${dd.lineage} ${dd.mobileOnly}`} role="img" aria-label="Lineage example: the Airflow DAG positions_nightly caused a failed check on FINANCE.DAILY_POSITIONS, which affects three Power BI reports.">
          {LINEAGE.map((c, ci) => (
            <div key={c.col} className={dd.lcol}>
              <span className={dd.lcolLabel}>{c.col}</span>
              {c.nodes.map((n) => (
                <div key={n.name} className={`${dd.node} ${dd[n.state]}`}>
                  <span className={dd.nodeKind}>
                    {ci === 3 ? <FileBarChart2 size={13} aria-hidden="true" /> : <Database size={13} aria-hidden="true" />}
                    {n.kind}
                  </span>
                  <span className={dd.nodeName}>{n.name}</span>
                  {n.state !== 'ok' && <span className={dd.nodeState}>{STATE_LABEL[n.state]}</span>}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className={`${styles.grid4} ${dd.impactGrid}`}>
          <div className={styles.cell}>
            <span className={styles.icon}><Workflow size={20} strokeWidth={1.75} aria-hidden="true" /></span>
            <h3 className={styles.cellTitle}>Upstream cause</h3>
            <p className={styles.cellBody}>The DAG, dbt model or ODI job behind the failure, with its error and run history.</p>
          </div>
          <div className={styles.cell}>
            <span className={styles.icon}><FileBarChart2 size={20} strokeWidth={1.75} aria-hidden="true" /></span>
            <h3 className={styles.cellTitle}>Downstream impact</h3>
            <p className={styles.cellBody}>Every Power BI report that reads the table, flagged as affected until the data is fixed.</p>
          </div>
          <div className={styles.cell}>
            <span className={styles.icon}><Users size={20} strokeWidth={1.75} aria-hidden="true" /></span>
            <h3 className={styles.cellTitle}>Business impact</h3>
            <p className={styles.cellBody}>The alert lists the business reports at risk, so the people who rely on them hear first.</p>
          </div>
          <div className={styles.cell}>
            <span className={styles.icon}><Columns size={20} strokeWidth={1.75} aria-hidden="true" /></span>
            <h3 className={styles.cellTitle}>Schema change impact</h3>
            <p className={styles.cellBody}>A dropped or retyped column is flagged with the reports that read the table.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------- Policy as the data contract ---------------- */

const CONTRACT = [
  { clause: '4.2', expectation: 'Positions are loaded by 06:00 every business day', check: 'Freshness · SLA 06:00', owner: 'Treasury data' },
  { clause: '4.5', expectation: 'Column set and types of DAILY_POSITIONS do not change without notice', check: 'Schema change', owner: 'Treasury data' },
  { clause: '5.1', expectation: 'Every account has exactly one ACCOUNT_ID', check: 'Uniqueness + completeness', owner: 'Core banking' },
  { clause: '5.3', expectation: 'Daily row count stays within the normal range', check: 'Volume vs baseline', owner: 'Core banking' },
]

export function PolicyContract() {
  return (
    <section className={styles.section} id="contracts">
      <div className={styles.wrap}>
        <div className={styles.head}>
          <div>
            <span className={styles.eyebrow}>Data contracts</span>
            <h2 className={styles.h2}>Your policy is the data contract.</h2>
          </div>
          <p className={styles.lede}>
            Producers and consumers agree expectations once, in the policy or contract document you already keep.
            AlertMend turns each clause into a live check with an owner, so a breach is caught and routed, not discovered
            in a meeting.
          </p>
        </div>

        <div className={dd.tableWrap}>
          <table className={dd.table}>
            <thead>
              <tr>
                <th scope="col">Clause</th>
                <th scope="col">Expectation</th>
                <th scope="col">Live check</th>
                <th scope="col">Owner</th>
              </tr>
            </thead>
            <tbody>
              {CONTRACT.map((r) => (
                <tr key={r.clause}>
                  <td className={dd.mono} data-label="Clause">§{r.clause}</td>
                  <td data-label="Expectation">{r.expectation}</td>
                  <td data-label="Live check">
                    <span className={dd.checkPill}>{r.check}</span>
                  </td>
                  <td data-label="Owner">{r.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ul className={`${styles.checks} ${dd.contractPoints}`}>
          <li><Check className={styles.checkIcon} size={16} aria-hidden="true" />Every check cites the clause it enforces</li>
          <li><Check className={styles.checkIcon} size={16} aria-hidden="true" />Owners approve checks before they go live</li>
          <li><Check className={styles.checkIcon} size={16} aria-hidden="true" />Schema changes flagged before consumers break</li>
          <li><Check className={styles.checkIcon} size={16} aria-hidden="true" />Every check change versioned for audit</li>
        </ul>
      </div>
    </section>
  )
}
