import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { HOME_PRODUCTS, type HomeProductId } from '../../data/homeProducts'
import AlertMendIcon from '../ui/AlertMendIcon'
import styles from '../sections/Hero.module.css'

function hexTone(i: number): 'ok' | 'ok2' | 'warn' | 'crit' | 'idle' {
  const r = (i * 37 + 13) % 100
  if (r < 2) return 'crit'
  if (r < 8) return 'warn'
  if (r < 48) return 'ok'
  if (r < 84) return 'ok2'
  return 'idle'
}

function hexRows(count: number, oddLen = 14, evenLen = 15) {
  return Array.from({ length: count }, (_, r) =>
    Array.from({ length: r % 2 ? oddLen : evenLen }, (_, c) => hexTone(r * evenLen + c)),
  )
}

const HEX_ROWS = hexRows(7)

const byId = Object.fromEntries(HOME_PRODUCTS.map((p) => [p.id, p]))

const LOG_ROWS = [
  { t: '12:04:33', lvl: 'err' as const, svc: 'payments-api', msg: 'OOMKilled · limit 512Mi' },
  { t: '12:04:32', lvl: 'warn' as const, svc: 'checkout', msg: 'upstream timeout 30s' },
  { t: '12:04:32', lvl: 'err' as const, svc: 'payments-db', msg: 'connection reset by peer' },
  { t: '12:04:31', lvl: 'info' as const, svc: 'auth-svc', msg: 'token refreshed' },
]

const LOG_BARS = [28, 36, 44, 52, 40, 68, 90, 74, 58, 46, 62, 80, 96, 72, 54, 48, 70, 88, 64, 42]

const SPANS: [string, number, string][] = [
  ['GET /checkout', 100, '#7c3aed'],
  ['api.handle', 84, '#8b5cf6'],
  ['db.query', 56, '#f43f5e'],
  ['cache.get', 14, '#a1a1aa'],
]

type Props = {
  /** HOME_PRODUCTS id — opens that product's workspace instead of the overview. */
  activeProduct?: HomeProductId
}

export default function PlatformBoardMock({ activeProduct }: Props) {
  const activeTab = activeProduct ?? 'obs'

  return (
    <div className={`${styles.app} ${activeProduct ? styles.appCompact : ''}`} data-capture="hero-demo">
      <aside className={styles.rail} aria-hidden>
        <AlertMendIcon className={styles.railLogo} />
        {HOME_PRODUCTS.map((p) => (
          <span
            key={p.id}
            className={`${styles.railItem} ${p.id === activeTab ? styles.railOn : ''}`}
          />
        ))}
      </aside>

      <div className={styles.workspace}>
        <header className={styles.topbar}>
          <div className={styles.chrome} aria-hidden>
            <i />
            <i />
            <i />
          </div>
          <div className={styles.topBrand} aria-hidden>
            <AlertMendIcon className={styles.topLogo} />
            <span className={styles.topBrandName}>AlertMend</span>
          </div>
          <nav className={styles.tabs} aria-label="Platform surfaces">
            {HOME_PRODUCTS.map((p) => (
              <Link
                key={p.id}
                to={p.to}
                className={p.id === activeTab ? styles.tabActive : styles.tab}
              >
                {p.tab}
              </Link>
            ))}
          </nav>
          <div className={styles.topMeta}>
            <span className={styles.search} aria-hidden>
              ⌘K · payments
            </span>
            <span className={styles.live}>
              <i /> Live
            </span>
          </div>
        </header>

        {activeProduct ? <ProductBoard product={activeProduct} /> : <OverviewBoard />}
      </div>
    </div>
  )
}

function Kpi({
  label,
  value,
  tone,
  path,
}: {
  label: string
  value: string
  tone: 'hot' | 'warn' | 'violet' | 'ok'
  path: string
}) {
  const cls = {
    hot: styles.kpiHot,
    warn: styles.kpiWarn,
    violet: styles.kpiViolet,
    ok: styles.kpiOk,
  }[tone]
  return (
    <div className={`${styles.kpi} ${cls}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <svg className={styles.kpiWave} viewBox="0 0 120 28" preserveAspectRatio="none" aria-hidden>
        <path d={path} fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.6" />
      </svg>
    </div>
  )
}

function HexMap({ rows, large }: { rows: ReturnType<typeof hexRows>; large?: boolean }) {
  return (
    <div className={large ? `${styles.hexMap} ${styles.hexMapLg}` : styles.hexMap}>
      {rows.map((row, r) => (
        <div
          key={r}
          className={`${styles.hexRow} ${r % 2 ? (large ? styles.hexOffLg : styles.hexOff) : ''}`}
        >
          {row.map((t, c) => (
            <i
              key={c}
              className={`${styles.hex} ${large ? styles.hexLg : ''} ${styles[`hex_${t}`]} ${
                t === 'crit' || t === 'warn' ? styles.hexLive : ''
              }`}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

function ServiceMap() {
  return (
    <svg viewBox="0 0 220 92" className={styles.svg} aria-hidden>
      <g stroke="#e4e4e7" strokeWidth="1.3" fill="none">
        <path d="M32 46 C62 20, 82 16, 104 16" />
        <path d="M32 46 C62 72, 82 76, 104 76" />
        <path d="M134 16 C162 16, 176 16, 196 16" />
      </g>
      <path
        d="M134 76 C162 76, 176 76, 196 76"
        stroke="#f87171"
        strokeWidth="1.6"
        strokeDasharray="3 2"
        fill="none"
      />
      <g fontSize="8.5" fontWeight="700" fontFamily="ui-sans-serif,system-ui,sans-serif">
        <rect x="8" y="32" width="40" height="28" rx="6" fill="#7c3aed" />
        <text x="28" y="50" textAnchor="middle" fill="#fff">
          web
        </text>
        <rect x="104" y="2" width="40" height="28" rx="6" fill="#fff" stroke="#e4e4e7" />
        <text x="124" y="20" textAnchor="middle" fill="#52525b">
          api
        </text>
        <rect x="104" y="62" width="40" height="28" rx="6" fill="#fff" stroke="#e4e4e7" />
        <text x="124" y="80" textAnchor="middle" fill="#52525b">
          auth
        </text>
        <rect x="186" y="2" width="28" height="28" rx="6" fill="#fff" stroke="#e4e4e7" />
        <text x="200" y="20" textAnchor="middle" fill="#52525b">
          kv
        </text>
        <rect x="186" y="62" width="28" height="28" rx="6" fill="#fff1f2" stroke="#fecdd3" />
        <text x="200" y="80" textAnchor="middle" fill="#e11d48">
          db
        </text>
      </g>
    </svg>
  )
}

function SpanChart() {
  return (
    <div className={styles.spans}>
      {SPANS.map(([label, w, c]) => (
        <div key={label} className={styles.spanRow}>
          <span>{label}</span>
          <i style={{ width: `${w}%`, background: c }} />
        </div>
      ))}
    </div>
  )
}

function SqlBar() {
  return (
    <div className={styles.sql}>
      <b>sql ›</b>
      <code>
        <span className={styles.kw}>SELECT</span> * <span className={styles.kw}>FROM</span> logs{' '}
        <span className={styles.kw}>WHERE</span> ns=
        <span className={styles.str}>&apos;payments&apos;</span> <span className={styles.kw}>AND</span>{' '}
        level=<span className={styles.str}>&apos;error&apos;</span>
      </code>
    </div>
  )
}

function LogTable({ rows }: { rows: typeof LOG_ROWS }) {
  return (
    <div className={styles.logTable}>
      <div className={styles.logHead}>
        <span>time</span>
        <span>lvl</span>
        <span>service</span>
        <span>message</span>
      </div>
      {rows.map((row) => (
        <div key={`${row.t}-${row.svc}`} className={styles.logRow}>
          <span className={styles.logTime}>{row.t}</span>
          <em className={styles[row.lvl]}>{row.lvl.toUpperCase()}</em>
          <span className={styles.logSvc}>{row.svc}</span>
          <span>{row.msg}</span>
        </div>
      ))}
    </div>
  )
}

function LogBars() {
  return (
    <div className={styles.logBars} aria-hidden>
      {LOG_BARS.map((h, i) => (
        <i key={i} style={{ height: `${h}%` }} className={i > 15 ? styles.logBarHot : undefined} />
      ))}
    </div>
  )
}

function Tile({
  title,
  meta,
  children,
  className,
  to,
}: {
  title: string
  meta?: ReactNode
  children: ReactNode
  className?: string
  to?: string
}) {
  const cls = `${styles.tile} ${className ?? ''} ${to ? styles.tileLink : ''}`
  const inner = (
    <>
      <div className={styles.tileHead}>
        <span>{title}</span>
        {typeof meta === 'string' ? <em>{meta}</em> : meta}
      </div>
      {children}
    </>
  )
  return to ? (
    <Link to={to} className={cls}>
      {inner}
    </Link>
  ) : (
    <div className={cls}>{inner}</div>
  )
}

function OverviewBoard() {
  return (
    <div className={`${styles.board} ${styles.boardOverview}`}>
      <div className={styles.kpiRow}>
        <Kpi label="p99 latency" value="812ms" tone="hot" path="M0 18 C16 14 28 8 44 12 S72 22 88 12 S108 6 120 10" />
        <Kpi label="error rate" value="0.42%" tone="warn" path="M0 16 C18 12 30 20 48 14 S78 8 96 14 S112 18 120 12" />
        <Kpi label="throughput" value="48.2k" tone="violet" path="M0 20 C20 18 32 10 50 12 S82 22 98 10 S112 8 120 6" />
        <Kpi label="saturation" value="63%" tone="ok" path="M0 14 C22 16 36 10 54 12 S86 18 102 12 S114 10 120 12" />
      </div>

      <Tile title="Kubernetes" meta="1,247 pods" to={byId.k8s.to}>
        <HexMap rows={HEX_ROWS} />
        <div className={styles.tileTag}>clusters · incidents · RCA</div>
      </Tile>

      <Tile title="Observability" meta="service map" to={byId.obs.to}>
        <ServiceMap />
        <div className={styles.tileTag}>OTel · eBPF · PromQL</div>
      </Tile>

      <Tile title="APM" meta="812ms" to={byId.obs.to}>
        <SpanChart />
        <div className={styles.tileTag}>distributed traces</div>
      </Tile>

      <Tile title="AI RCA" meta={<em className={styles.conf}>94%</em>} className={styles.tileRca} to={byId.rca.to}>
        <p className={styles.rcaText}>
          <b>db.query</b> saturated the pool after deploy <b>v2.31.4</b>
        </p>
        <div className={styles.chips}>
          <span>trace</span>
          <span>logs</span>
          <span>change</span>
          <span>metric</span>
        </div>
        <div className={styles.tileTag}>evidence-backed · ~15s</div>
      </Tile>

      <div className={styles.bottomCols}>
        <div className={styles.bottomCol}>
          <Tile title="Logs" meta="38ms" className={styles.tileLogs} to={byId.logs.to}>
            <SqlBar />
            <LogTable rows={LOG_ROWS} />
            <div className={styles.logFoot}>
              <LogBars />
              <div className={styles.tileMeta}>
                <span>1.2M lines · 38ms</span>
                <span>3 err · 1 warn</span>
              </div>
            </div>
          </Tile>

          <Tile title="On-call" meta="payments · sev-2" to={byId.oncall.to}>
            <div className={styles.oncallRow}>
              <div className={styles.oncall}>
                <strong>@alex</strong>
                <span>primary · until 08:00 IST</span>
              </div>
              <div className={styles.pageCard}>
                <span>page #4821</span>
                <strong>RCA attached</strong>
              </div>
            </div>
            <div className={styles.escTrack} aria-hidden>
              <span className={styles.escOn}>Slack</span>
              <i />
              <span className={styles.escOn}>WhatsApp</span>
              <i />
              <span>Phone</span>
            </div>
            <div className={styles.tileTag}>rotations · escalation · context on every page</div>
          </Tile>
        </div>

        <div className={styles.bottomCol}>
          <Tile
            title="RF · Remediation"
            meta={<em className={styles.approved}>approved · @alex</em>}
            className={styles.tileRf}
            to={byId.fix.to}
          >
            <div className={styles.rfBar}>
              <div className={styles.rfName}>
                <strong>fix-connection-pool</strong>
                <span>RF-1842 · payments</span>
              </div>
              <span className={styles.rfPct}>2/3</span>
              <div className={styles.rfProgress} aria-hidden>
                <i style={{ width: '66%' }} />
              </div>
            </div>
            <ol className={styles.steps}>
              <li className={styles.done}>Scale db pool 20 → 50</li>
              <li className={styles.done}>Restart payments-api (surge 25%)</li>
              <li className={styles.run}>Verify p99 &lt; 300ms · 5m</li>
            </ol>
            <div className={styles.rfActions}>
              <span className={styles.rfBtn}>Generate PR</span>
              <span className={styles.rfGhost}>Rollback</span>
              <span className={styles.rfGhost}>Audit</span>
            </div>
          </Tile>

          <Tile title="FinOps" meta={<em className={styles.ok}>$1,378 recoverable</em>} to={byId.finops.to}>
            <div className={styles.costRow}>
              <div>
                <span>spend · 30d</span>
                <strong>$4,504</strong>
              </div>
              <div>
                <span>right-size</span>
                <strong className={styles.ok}>$412/mo</strong>
              </div>
              <div>
                <span>idle GPU</span>
                <strong className={styles.ok}>$214/mo</strong>
              </div>
            </div>
            <div className={styles.finopsViz} aria-hidden>
              <div className={styles.miniBars}>
                <i style={{ width: '90%' }} />
                <b style={{ width: '36%' }} />
              </div>
              <div className={styles.finopsLegend}>
                <span>
                  <i /> requested
                </span>
                <span>
                  <b /> used
                </span>
              </div>
            </div>
            <div className={styles.tileTag}>YAML preview · rollback · per-namespace</div>
          </Tile>
        </div>
      </div>
    </div>
  )
}

function ProductBoard({ product }: { product: string }) {
  switch (product) {
    case 'k8s':
      return <K8sBoard />
    case 'obs':
      return <ObsBoard />
    case 'logs':
      return <LogsBoard />
    case 'rca':
      return <RcaBoard />
    case 'fix':
      return <RfBoard />
    case 'oncall':
      return <OnCallBoard />
    case 'finops':
      return <FinOpsBoard />
    case 'mlops':
      return <MlopsBoard />
    default:
      return <OverviewBoard />
  }
}

function K8sBoard() {
  const incidents = [
    { sev: 'CRIT', tone: styles.sevCrit, name: 'CrashLoopBackOff', where: 'log-ingester · ns: observability' },
    { sev: 'WARN', tone: styles.sevWarn, name: 'OOMKilled', where: 'payments-api · ns: payments · 512Mi' },
    { sev: 'WARN', tone: styles.sevWarn, name: 'Rollout stuck', where: 'checkout-web v2.31.4 · 3/8 ready' },
  ]
  return (
    <div className={`${styles.board} ${styles.boardCompact}`}>
      <div className={styles.kpiRow}>
        <Kpi label="pods" value="1,247" tone="violet" path="M0 18 C16 14 28 8 44 12 S72 22 88 12 S108 6 120 10" />
        <Kpi label="nodes" value="24" tone="ok" path="M0 14 C22 16 36 10 54 12 S86 18 102 12 S114 10 120 12" />
        <Kpi label="deploys" value="89" tone="warn" path="M0 16 C18 12 30 20 48 14 S78 8 96 14 S112 18 120 12" />
        <Kpi label="incidents" value="3" tone="hot" path="M0 20 C20 18 32 10 50 12 S82 22 98 10 S112 8 120 6" />
      </div>

      <Tile title="Cluster health" meta="prod-us-west-2" className={styles.tileWide}>
        <HexMap rows={HEX_ROWS} />
        <div className={styles.tileTag}>1,247 pods · 2 under memory pressure</div>
      </Tile>

      <Tile title="Live incidents" meta="last 15m" className={styles.tileWide}>
        <div className={styles.incidentList}>
          {incidents.map((i) => (
            <div key={i.name} className={styles.incident}>
              <span className={`${styles.sev} ${i.tone}`}>{i.sev}</span>
              <div className={styles.incidentBody}>
                <strong>{i.name}</strong>
                <span>{i.where}</span>
              </div>
              <span className={styles.rcaChip}>View RCA</span>
            </div>
          ))}
        </div>
      </Tile>

      <Tile title="Nodes" meta="24 healthy · 2 warn" className={styles.tileWide}>
        <div className={styles.nodeStrip} aria-hidden>
          {Array.from({ length: 24 }).map((_, i) => (
            <i key={i} className={i === 7 || i === 15 ? styles.nodeWarn : undefined} />
          ))}
        </div>
        <div className={styles.tileTag}>EKS · GKE · AKS · self-managed</div>
      </Tile>

      <Tile title="AI RCA" meta={<em className={styles.conf}>92%</em>} className={`${styles.tileWide} ${styles.tileRca}`}>
        <p className={styles.rcaText}>
          Ephemeral-storage limit too low for the new log buffer in <b>v2.31.4</b>
        </p>
        <div className={styles.chips}>
          <span>events</span>
          <span>logs</span>
          <span>change</span>
        </div>
        <div className={styles.tileTag}>one click from the incident card</div>
      </Tile>
    </div>
  )
}

function ObsBoard() {
  return (
    <div className={`${styles.board} ${styles.boardCompact}`}>
      <div className={styles.kpiRow}>
        <Kpi label="p99 latency" value="812ms" tone="hot" path="M0 18 C16 14 28 8 44 12 S72 22 88 12 S108 6 120 10" />
        <Kpi label="error rate" value="0.42%" tone="warn" path="M0 16 C18 12 30 20 48 14 S78 8 96 14 S112 18 120 12" />
        <Kpi label="throughput" value="48.2k" tone="violet" path="M0 20 C20 18 32 10 50 12 S82 22 98 10 S112 8 120 6" />
        <Kpi label="saturation" value="63%" tone="ok" path="M0 14 C22 16 36 10 54 12 S86 18 102 12 S114 10 120 12" />
      </div>

      <Tile title="Service map" meta="checkout · live" className={styles.tileWide}>
        <ServiceMap />
        <div className={styles.tileTag}>OTel · eBPF · PromQL</div>
      </Tile>

      <Tile title="APM · GET /checkout" meta="812ms" className={styles.tileWide}>
        <SpanChart />
        <div className={styles.tileTag}>db.query 498ms · pool wait</div>
      </Tile>

      <Tile title="Hot paths" meta="share of time" className={styles.tileWide}>
        <div className={styles.hotPaths}>
          {[
            ['GET /checkout', '812ms', 42],
            ['POST /pay', '1.2s', 28],
            ['GET /cart', '210ms', 18],
            ['GET /health', '12ms', 6],
          ].map(([path, ms, pct]) => (
            <div key={String(path)} className={styles.hotPath}>
              <div className={styles.hotPathHead}>
                <span>{path}</span>
                <em>{ms}</em>
              </div>
              <div className={styles.hotBar}>
                <i style={{ width: `${pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Tile>

      <Tile title="AI RCA" meta={<em className={styles.conf}>94%</em>} className={`${styles.tileWide} ${styles.tileRca}`}>
        <p className={styles.rcaText}>
          <b>db.query</b> saturated the pool after deploy <b>v2.31.4</b>
        </p>
        <div className={styles.chips}>
          <span>trace</span>
          <span>metric</span>
          <span>change</span>
        </div>
        <div className={styles.tileTag}>correlated on the same timeline</div>
      </Tile>
    </div>
  )
}

function LogsBoard() {
  return (
    <div className={`${styles.board} ${styles.boardCompact}`}>
      <div className={styles.kpiRow}>
        <Kpi label="lines scanned" value="1.2M" tone="violet" path="M0 20 C20 18 32 10 50 12 S82 22 98 10 S112 8 120 6" />
        <Kpi label="query" value="38ms" tone="ok" path="M0 14 C22 16 36 10 54 12 S86 18 102 12 S114 10 120 12" />
        <Kpi label="errors" value="3" tone="hot" path="M0 18 C16 14 28 8 44 12 S72 22 88 12 S108 6 120 10" />
        <Kpi label="warnings" value="1" tone="warn" path="M0 16 C18 12 30 20 48 14 S78 8 96 14 S112 18 120 12" />
      </div>

      <Tile title="Log explorer" meta="last 15m" className={`${styles.tileWide} ${styles.tileLogs}`}>
        <SqlBar />
        <LogTable rows={LOG_ROWS} />
      </Tile>

      <Tile title="Fields" meta="schema" className={styles.tileWide}>
        <div className={styles.fields}>
          {['_timestamp', 'namespace', 'service', 'message', 'trace_id', 'pod'].map((f) => (
            <div key={f} className={styles.field}>
              <i />
              {f}
            </div>
          ))}
        </div>
      </Tile>

      <Tile title="Volume" meta="1.2M lines · 38ms" className={styles.tileWide}>
        <LogBars />
        <div className={styles.tileMeta}>
          <span>FROM logs · ns=payments</span>
          <span>Run · 38ms</span>
        </div>
      </Tile>

      <Tile title="Errors" meta="3 err · 1 warn" className={styles.tileWide}>
        <div className={styles.incidentList}>
          <div className={styles.incident}>
            <span className={`${styles.sev} ${styles.sevCrit}`}>ERR</span>
            <div className={styles.incidentBody}>
              <strong>payments-api</strong>
              <span>OOMKilled · limit 512Mi</span>
            </div>
          </div>
          <div className={styles.incident}>
            <span className={`${styles.sev} ${styles.sevCrit}`}>ERR</span>
            <div className={styles.incidentBody}>
              <strong>payments-db</strong>
              <span>connection reset by peer</span>
            </div>
          </div>
        </div>
      </Tile>
    </div>
  )
}

function RcaBoard() {
  return (
    <div className={`${styles.board} ${styles.boardCompact}`}>
      <div className={styles.kpiRow}>
        <Kpi label="confidence" value="94%" tone="ok" path="M0 14 C22 16 36 10 54 12 S86 18 102 12 S114 10 120 12" />
        <Kpi label="typical" value="~15s" tone="violet" path="M0 20 C20 18 32 10 50 12 S82 22 98 10 S112 8 120 6" />
        <Kpi label="citations" value="4" tone="warn" path="M0 16 C18 12 30 20 48 14 S78 8 96 14 S112 18 120 12" />
        <Kpi label="severity" value="sev-2" tone="hot" path="M0 18 C16 14 28 8 44 12 S72 22 88 12 S108 6 120 10" />
      </div>

      <Tile title="Root cause" meta={<em className={styles.conf}>94%</em>} className={`${styles.tileWide} ${styles.tileRca}`}>
        <p className={styles.rcaText}>
          <b>db.query</b> saturated the pool after deploy <b>v2.31.4</b>
        </p>
        <div className={styles.chips}>
          <span>trace</span>
          <span>logs</span>
          <span>change</span>
          <span>metric</span>
        </div>
        <div className={styles.tileTag}>payments-api · prod-us-west-2</div>
      </Tile>

      <Tile title="Evidence" meta="cited" className={styles.tileWide}>
        <ul className={styles.evidence}>
          <li>
            <b>Trace</b> · db.query 498ms · pool wait
          </li>
          <li>
            <b>Log</b> · connection pool exhausted
          </li>
          <li>
            <b>Change</b> · deploy v2.31.4
          </li>
        </ul>
      </Tile>

      <Tile title="Timeline" meta="14.8s" className={styles.tileWide}>
        <ul className={styles.evidence}>
          <li>
            <span className={styles.clock}>0s</span> Alert correlated
          </li>
          <li>
            <span className={styles.clock}>9s</span> Pool exhaustion linked
          </li>
          <li>
            <span className={styles.clock}>14s</span> RCA posted to Slack
          </li>
        </ul>
      </Tile>

      <Tile title="Approved fix" meta={<em className={styles.approved}>ready</em>} className={`${styles.tileWide} ${styles.tileRf}`}>
        <ol className={styles.steps}>
          <li>Scale db pool 20 → 50</li>
          <li>Restart payments-api (surge 25%)</li>
          <li>Verify p99 &lt; 300ms · 5m</li>
        </ol>
        <div className={styles.rfActions}>
          <span className={styles.rfBtn}>Generate PR</span>
          <span className={styles.rfGhost}>Run runbook</span>
        </div>
      </Tile>
    </div>
  )
}

function RfBoard() {
  return (
    <div className={`${styles.board} ${styles.boardCompact}`}>
      <div className={styles.kpiRow}>
        <Kpi label="flow" value="RF-1842" tone="violet" path="M0 20 C20 18 32 10 50 12 S82 22 98 10 S112 8 120 6" />
        <Kpi label="progress" value="2/3" tone="ok" path="M0 14 C22 16 36 10 54 12 S86 18 102 12 S114 10 120 12" />
        <Kpi label="approver" value="@alex" tone="warn" path="M0 16 C18 12 30 20 48 14 S78 8 96 14 S112 18 120 12" />
        <Kpi label="rollback" value="armed" tone="hot" path="M0 18 C16 14 28 8 44 12 S72 22 88 12 S108 6 120 10" />
      </div>

      <Tile
        title="RF · Remediation"
        meta={<em className={styles.approved}>approved · @alex</em>}
        className={`${styles.tileWide} ${styles.tileRf}`}
      >
        <div className={styles.rfBar}>
          <div className={styles.rfName}>
            <strong>fix-connection-pool</strong>
            <span>RF-1842 · payments · sev-2</span>
          </div>
          <span className={styles.rfPct}>2/3</span>
          <div className={styles.rfProgress} aria-hidden>
            <i style={{ width: '66%' }} />
          </div>
        </div>
        <ol className={styles.steps}>
          <li className={styles.done}>Scale db pool 20 → 50</li>
          <li className={styles.done}>Restart payments-api (surge 25%)</li>
          <li className={styles.run}>Verify p99 &lt; 300ms · 5m</li>
        </ol>
        <div className={styles.rfActions}>
          <span className={styles.rfBtn}>Generate PR</span>
          <span className={styles.rfGhost}>Rollback</span>
          <span className={styles.rfGhost}>Audit</span>
        </div>
      </Tile>

      <Tile title="Gate" meta="Slack · #oncall-payments" className={styles.tileWide}>
        <ul className={styles.evidence}>
          <li>
            <b>Trigger</b> · Alertmanager sev ≥ 2
          </li>
          <li>
            <b>RCA</b> · 94% · pool saturated after v2.31.4
          </li>
          <li>
            <b>Approve</b> · @alex · 03:04 IST
          </li>
          <li>
            <b>Audit</b> · every step posted back to the channel
          </li>
        </ul>
        <div className={styles.tileTag}>nothing runs without approval</div>
      </Tile>

      <Tile title="Slack" meta="#oncall-payments" className={styles.tileWide}>
        <p className={styles.rcaText}>
          <b>@alex</b> approved scale pool 20 → 50 at 03:04 IST
        </p>
        <div className={styles.tileTag}>posted back to the channel</div>
      </Tile>

      <Tile title="Audit" meta="immutable" className={styles.tileWide}>
        <ul className={styles.evidence}>
          <li>
            <b>3 steps</b> logged with actor and timestamp
          </li>
          <li>
            <b>Rollback</b> armed for 30 minutes
          </li>
        </ul>
      </Tile>
    </div>
  )
}

function OnCallBoard() {
  return (
    <div className={`${styles.board} ${styles.boardCompact}`}>
      <div className={styles.kpiRow}>
        <Kpi label="on call" value="@alex" tone="violet" path="M0 20 C20 18 32 10 50 12 S82 22 98 10 S112 8 120 6" />
        <Kpi label="severity" value="sev-2" tone="hot" path="M0 18 C16 14 28 8 44 12 S72 22 88 12 S108 6 120 10" />
        <Kpi label="page" value="#4821" tone="warn" path="M0 16 C18 12 30 20 48 14 S78 8 96 14 S112 18 120 12" />
        <Kpi label="until" value="08:00" tone="ok" path="M0 14 C22 16 36 10 54 12 S86 18 102 12 S114 10 120 12" />
      </div>

      <Tile title="Rotation" meta="payments · follow-the-sun" className={styles.tileWide}>
        <div className={styles.oncallRow}>
          <div className={styles.oncall}>
            <strong>@alex</strong>
            <span>primary · until 08:00 IST</span>
          </div>
          <div className={styles.pageCard}>
            <span>next up</span>
            <strong>@sam · 08:00</strong>
          </div>
        </div>
        <div className={styles.tileTag}>rotations · timezone-aware · coverage gaps flagged</div>
      </Tile>

      <Tile title="Page" meta="03:02 IST" className={`${styles.tileWide} ${styles.tileRca}`}>
        <div className={styles.oncallRow}>
          <div className={styles.oncall}>
            <strong>checkout p99</strong>
            <span>RCA attached · confidence 94%</span>
          </div>
          <div className={styles.pageCard}>
            <span>page #4821</span>
            <strong>RCA attached</strong>
          </div>
        </div>
        <p className={styles.rcaText}>
          <b>db.query</b> saturated the pool after deploy <b>v2.31.4</b>
        </p>
      </Tile>

      <Tile title="Escalation" meta="Slack → WhatsApp → Phone" className={styles.tileWide}>
        <div className={styles.escTrack} aria-hidden>
          <span className={styles.escOn}>Slack</span>
          <i />
          <span className={styles.escOn}>WhatsApp</span>
          <i />
          <span>Phone</span>
        </div>
        <ul className={styles.evidence}>
          <li>
            <span className={styles.clock}>0:00</span> Slack · #oncall-payments · sent
          </li>
          <li>
            <span className={styles.clock}>+2:00</span> WhatsApp · @alex · sent
          </li>
          <li>
            <span className={styles.clock}>+5:00</span> Phone · @alex · ringing
          </li>
        </ul>
      </Tile>

      <Tile title="Approve from Slack" meta={<em className={styles.approved}>@alex</em>} className={`${styles.tileWide} ${styles.tileRf}`}>
        <ol className={styles.steps}>
          <li className={styles.done}>Scale db pool 20 → 50</li>
          <li className={styles.run}>Awaiting ack · page still open</li>
        </ol>
        <div className={styles.rfActions}>
          <span className={styles.rfBtn}>Approve fix</span>
          <span className={styles.rfGhost}>Ack</span>
        </div>
      </Tile>
    </div>
  )
}

function FinOpsBoard() {
  const rows = [
    { ns: 'payments', spend: '$1,842', req: 92, used: 34 },
    { ns: 'observability', spend: '$1,210', req: 78, used: 51 },
    { ns: 'checkout', spend: '$964', req: 64, used: 48 },
  ]
  return (
    <div className={`${styles.board} ${styles.boardCompact}`}>
      <div className={styles.kpiRow}>
        <Kpi label="spend · 30d" value="$4,504" tone="violet" path="M0 20 C20 18 32 10 50 12 S82 22 98 10 S112 8 120 6" />
        <Kpi label="recoverable" value="$1,378" tone="ok" path="M0 14 C22 16 36 10 54 12 S86 18 102 12 S114 10 120 12" />
        <Kpi label="right-size" value="$412" tone="warn" path="M0 16 C18 12 30 20 48 14 S78 8 96 14 S112 18 120 12" />
        <Kpi label="idle GPU" value="$214" tone="hot" path="M0 18 C16 14 28 8 44 12 S72 22 88 12 S108 6 120 10" />
      </div>

      <Tile title="Spend by namespace" meta="requested vs used" className={styles.tileWide}>
        <div className={styles.nsList}>
          {rows.map((r) => (
            <div key={r.ns}>
              <div className={styles.nsHead}>
                <span>{r.ns}</span>
                <span>{r.spend}</span>
              </div>
              <div className={styles.miniBars}>
                <i style={{ width: `${r.req}%` }} />
                <b style={{ width: `${r.used}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className={styles.finopsLegend}>
          <span>
            <i /> requested
          </span>
          <span>
            <b /> used
          </span>
        </div>
      </Tile>

      <Tile title="Right-size" meta={<em className={styles.ok}>−$412/mo</em>} className={styles.tileWide}>
        <p className={styles.rcaText}>
          payments-api · CPU <b>2000m → 750m</b>
        </p>
        <pre className={styles.yamlBlock}>
          {`resources:
  requests:
`}
          <span className={styles.yamlDel}>-   cpu: 2000m</span>
          {'\n'}
          <span className={styles.yamlAdd}>+   cpu: 750m</span>
        </pre>
      </Tile>

      <Tile title="Idle GPU" meta="$214/mo" className={styles.tileWide}>
        <p className={styles.rcaText}>
          <b>gpu-h100-04</b> requested 8 GPUs · using 3
        </p>
        <div className={styles.tileTag}>cordon · reschedule · reclaim</div>
      </Tile>

      <Tile title="Apply" meta="preview first" className={styles.tileWide}>
        <div className={styles.rfActions}>
          <span className={styles.rfBtn}>Preview YAML</span>
          <span className={styles.rfGhost}>Apply</span>
          <span className={styles.rfGhost}>Rollback</span>
        </div>
        <div className={styles.tileTag}>per-namespace · reversible</div>
      </Tile>
    </div>
  )
}

function MlopsBoard() {
  const gpus = [
    { name: 'h100-node-01', util: 96, temp: 71, tone: '' },
    { name: 'h100-node-03', util: 12, temp: 42, tone: styles.sevWarn },
    { name: 'a100-node-04', util: 98, temp: 84, tone: styles.sevCrit },
    { name: 'a100-node-06', util: 0, temp: 38, tone: styles.sevCrit },
  ]
  const failures = [
    { sev: 'CRIT', tone: styles.sevCrit, name: 'CUDA OOM', where: 'train-llm-7b · a100-node-04 · 92% mem' },
    { sev: 'CRIT', tone: styles.sevCrit, name: 'DAG task stuck', where: 'kubeflow · featurize · 3 retries' },
    { sev: 'WARN', tone: styles.sevWarn, name: 'Thermal throttle', where: 'a100-node-04 · SM clock −18%' },
  ]
  return (
    <div className={`${styles.board} ${styles.boardCompact}`}>
      <div className={styles.kpiRow}>
        <Kpi label="GPUs" value="48" tone="violet" path="M0 18 C16 14 28 8 44 12 S72 22 88 12 S108 6 120 10" />
        <Kpi label="fleet util" value="72%" tone="ok" path="M0 14 C22 16 36 10 54 12 S86 18 102 12 S114 10 120 12" />
        <Kpi label="p99 infer" value="284ms" tone="warn" path="M0 16 C18 12 30 20 48 14 S78 8 96 14 S112 18 120 12" />
        <Kpi label="alerts" value="2" tone="hot" path="M0 20 C20 18 32 10 50 12 S82 22 98 10 S112 8 120 6" />
      </div>

      <Tile title="GPU fleet" meta="live nvidia-smi" className={styles.tileWide}>
        <div className={styles.nsList}>
          {gpus.map((g) => (
            <div key={g.name}>
              <div className={styles.nsHead}>
                <span>{g.name}</span>
                <span className={g.tone}>{g.temp}°C · {g.util}%</span>
              </div>
              <div className={styles.miniBars}>
                <i style={{ width: '100%' }} />
                <b style={{ width: `${g.util}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className={styles.tileTag}>H100 / A100 · util · memory · thermals</div>
      </Tile>

      <Tile title="ML failure modes" meta="last 15m" className={styles.tileWide}>
        <div className={styles.incidentList}>
          {failures.map((f) => (
            <div key={f.name} className={styles.incident}>
              <span className={`${styles.sev} ${f.tone}`}>{f.sev}</span>
              <div className={styles.incidentBody}>
                <strong>{f.name}</strong>
                <span>{f.where}</span>
              </div>
              <span className={styles.rcaChip}>View RCA</span>
            </div>
          ))}
        </div>
      </Tile>

      <Tile title="Inference" meta="vLLM · p99 drift" className={styles.tileWide}>
        <p className={styles.rcaText}>
          Dynamic batching off target · queue depth <b>18 → 64</b>
        </p>
        <div className={styles.chips}>
          <span>vLLM</span>
          <span>p99</span>
          <span>queue</span>
        </div>
        <div className={styles.tileTag}>NCCL · Kubeflow · Airflow · vector index</div>
      </Tile>
    </div>
  )
}
