import { Link } from 'react-router-dom'
import Icon from '../ui/Icon'
import styles from './ProductDashboard.module.css'

/**
 * ProductDashboard — one quiet product visual for the homepage.
 * Dense chrome (hex maps, dual CTAs, long section copy) lives on
 * dedicated product pages, not here.
 */

const TABS = ['Overview', 'APM', 'Logs', 'Traces']

function buildArea(vals: number[], w: number, h: number, pad = 2) {
  const n = vals.length
  const step = (w - pad * 2) / (n - 1)
  const y = (v: number) => pad + (1 - v) * (h - pad * 2)
  const pts = vals.map((v, i) => [pad + i * step, y(v)] as const)
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ')
  const area = `${line} L${pts[n - 1][0].toFixed(1)} ${h - pad} L${pts[0][0].toFixed(1)} ${h - pad} Z`
  return { line, area }
}

function Spark({ vals, color }: { vals: number[]; color: string }) {
  const { line } = buildArea(vals, 120, 26)
  return (
    <svg className={styles.kpiSpark} viewBox="0 0 120 26" preserveAspectRatio="none" aria-hidden>
      <path d={line} fill="none" stroke={color} strokeWidth="1.8" />
    </svg>
  )
}

const reqA = [0.35, 0.42, 0.38, 0.5, 0.62, 0.55, 0.68, 0.72, 0.66, 0.8, 0.88, 0.82, 0.9, 0.86, 0.95]
const reqB = [0.2, 0.24, 0.22, 0.3, 0.34, 0.31, 0.4, 0.44, 0.41, 0.5, 0.55, 0.52, 0.58, 0.55, 0.62]
const p99 = [0.4, 0.44, 0.42, 0.48, 0.46, 0.52, 0.5, 0.58, 0.62, 0.55, 0.6, 0.72, 0.68, 0.82, 0.78]

const LOGS = [
  { t: '12:04:33', lvl: 'ERR', cls: styles.lvlErr, msg: 'payments-api OOMKilled: exceeded memory limit 512Mi' },
  { t: '12:04:32', lvl: 'ERR', cls: styles.lvlErr, msg: 'db.query connection reset by peer 10.2.3.4:5432' },
  { t: '12:04:32', lvl: 'WARN', cls: styles.lvlWarn, msg: 'checkout-web upstream timeout after 30s' },
  { t: '12:04:31', lvl: 'INFO', cls: styles.lvlInfo, msg: 'auth-svc token refreshed for tenant acme' },
]

function ThroughputChart() {
  const a = buildArea(reqA, 460, 150, 6)
  const b = buildArea(reqB, 460, 150, 6)
  return (
    <svg className={styles.chartSvg} viewBox="0 0 460 150" preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id="pdFillA" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.34" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="pdFillB" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((g) => (
        <line key={g} x1="6" x2="454" y1={150 * g} y2={150 * g} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      ))}
      <path d={b.area} fill="url(#pdFillB)" />
      <path d={b.line} fill="none" stroke="#8b5cf6" strokeWidth="2" />
      <path d={a.area} fill="url(#pdFillA)" />
      <path d={a.line} fill="none" stroke="#8b5cf6" strokeWidth="2" />
    </svg>
  )
}

function ServiceMap() {
  return (
    <svg viewBox="0 0 300 150" className={styles.chartSvg} aria-hidden>
      <g stroke="rgba(255,255,255,0.14)" strokeWidth="1.4" fill="none">
        <path d="M52 75 L138 40" />
        <path d="M52 75 L138 110" />
        <path d="M162 40 L250 40" />
        <path d="M162 110 L250 75" />
      </g>
      <path d="M162 110 L250 110" stroke="#f87171" strokeWidth="1.8" strokeDasharray="4 3" fill="none" />
      <g fontFamily="'JetBrains Mono', monospace" fontSize="8.5">
        <circle cx="40" cy="75" r="16" fill="rgba(139, 92, 246,0.16)" stroke="#8b5cf6" strokeWidth="1.4" />
        <text x="40" y="78" textAnchor="middle" fill="#ddd6fe">web</text>
        <circle cx="150" cy="40" r="15" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.24)" strokeWidth="1.3" />
        <text x="150" y="43" textAnchor="middle" fill="#c7ccd4">api</text>
        <circle cx="150" cy="110" r="15" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.24)" strokeWidth="1.3" />
        <text x="150" y="113" textAnchor="middle" fill="#c7ccd4">auth</text>
        <circle cx="262" cy="40" r="15" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.24)" strokeWidth="1.3" />
        <text x="262" y="43" textAnchor="middle" fill="#c7ccd4">cache</text>
        <circle cx="262" cy="110" r="16" fill="rgba(248,113,113,0.14)" stroke="#f87171" strokeWidth="1.8" />
        <text x="262" y="107" textAnchor="middle" fill="#fca5a5" fontWeight="700">db</text>
        <text x="262" y="118" textAnchor="middle" fill="#fca5a5" fontSize="7">5xx</text>
      </g>
    </svg>
  )
}

export default function ProductDashboard() {
  return (
    <section className={styles.section} id="features">
      <div className="container">
        <div className={`${styles.window} reveal`}>
          <div className={styles.topbar}>
            <span className={styles.brandDot} />
            <div className={styles.tabs}>
              {TABS.map((t, i) => (
                <span key={t} className={`${styles.tab} ${i === 0 ? styles.tabActive : ''}`}>
                  {t}
                </span>
              ))}
            </div>
            <div className={styles.topRight}>
              <span className={styles.pill}>prod-us-east-1</span>
              <span className={styles.live}>
                <span className={styles.liveDot} /> Live
              </span>
            </div>
          </div>

          <div className={styles.body}>
            <div className={styles.kpis}>
              <div className={styles.kpi}>
                <div className={styles.kpiLabel}>Requests / s</div>
                <div className={styles.kpiRow}>
                  <span className={styles.kpiValue}>48.2k</span>
                  <span className={`${styles.delta} ${styles.up}`}>▲ 6.4%</span>
                </div>
                <Spark vals={reqA} color="#8b5cf6" />
              </div>
              <div className={styles.kpi}>
                <div className={styles.kpiLabel}>Error rate</div>
                <div className={styles.kpiRow}>
                  <span className={styles.kpiValue}>0.24%</span>
                  <span className={`${styles.delta} ${styles.up}`}>▼ 0.1%</span>
                </div>
                <Spark vals={[0.6, 0.5, 0.55, 0.4, 0.45, 0.3, 0.35, 0.28, 0.3, 0.24, 0.22, 0.25, 0.2, 0.22, 0.18]} color="#34d399" />
              </div>
              <div className={styles.kpi}>
                <div className={styles.kpiLabel}>p99 latency</div>
                <div className={styles.kpiRow}>
                  <span className={styles.kpiValue}>812ms</span>
                  <span className={`${styles.delta} ${styles.amber}`}>▲ 18%</span>
                </div>
                <Spark vals={p99} color="#fbbf24" />
              </div>
              <div className={styles.kpi}>
                <div className={styles.kpiLabel}>Saturation</div>
                <div className={styles.kpiRow}>
                  <span className={styles.kpiValue}>63%</span>
                  <span className={`${styles.delta} ${styles.up}`}>▲ 3%</span>
                </div>
                <Spark vals={[0.5, 0.52, 0.48, 0.55, 0.58, 0.54, 0.6, 0.57, 0.62, 0.6, 0.63, 0.61, 0.64, 0.62, 0.63]} color="#8b5cf6" />
              </div>
            </div>

            <div className={styles.mid}>
              <div className={styles.panel}>
                <div className={styles.panelHead}>
                  <span className={styles.panelTitle}>Request throughput</span>
                  <span className={styles.panelMeta}>req/s · 15m</span>
                </div>
                <ThroughputChart />
              </div>
              <div className={styles.panel}>
                <div className={styles.panelHead}>
                  <span className={styles.panelTitle}>Service map</span>
                  <span className={styles.panelMeta}>checkout</span>
                </div>
                <ServiceMap />
              </div>
            </div>

            <div className={styles.panel}>
              <div className={styles.panelHead}>
                <span className={styles.panelTitle}>Live logs</span>
                <span className={styles.panelMeta}>tail</span>
              </div>
              <div className={styles.logs}>
                {LOGS.map((l, i) => (
                  <div key={i} className={styles.logRow}>
                    <span className={styles.logTime}>{l.t}</span>
                    <span className={`${styles.lvl} ${l.cls}`}>{l.lvl}</span>
                    <span className={styles.logMsg}>{l.msg}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.under}>
          <Link to="/observability" className={styles.underLink}>
            Explore observability
            <Icon name="arrow" size={14} className="arrow" strokeWidth={2.5} />
          </Link>
          <Link to="/ai-rca" className={styles.underLinkQuiet}>
            See AI RCA
          </Link>
        </div>
      </div>
    </section>
  )
}
