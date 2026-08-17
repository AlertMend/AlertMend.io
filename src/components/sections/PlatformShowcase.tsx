import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import styles from './PlatformShowcase.module.css'

/**
 * PlatformShowcase — AlertMend incident loop (See → Explain → Fix).
 *
 * Own composition: light marketing band, three numbered phases, dark
 * AlertMend console. Not a Datadog Products accordion / hex-map clone.
 */

type Phase = {
  id: string
  step: string
  title: string
  line: string
  to: string
  cta: string
  doors: { label: string; to: string }[]
  panel: ReactNode
}

const ROTATE_MS = 6500

function SeePanel() {
  return (
    <div className={styles.panel}>
      <div className={styles.kpis}>
        {[
          ['Error rate', '0.42%', '↑ 0.18', 'bad'],
          ['p99 latency', '812ms', '↑ 18%', 'bad'],
          ['Req/s', '4.2k', 'steady', 'ok'],
          ['Saturation', '91%', 'pool', 'warn'],
        ].map(([l, v, m, t]) => (
          <div key={l} className={styles.kpi}>
            <span className={styles.kpiLabel}>{l}</span>
            <span className={styles.kpiValue}>{v}</span>
            <span className={`${styles.kpiMeta} ${styles[`tone_${t}`]}`}>{m}</span>
          </div>
        ))}
      </div>
      <div className={styles.row2}>
        <div className={styles.block}>
          <div className={styles.blockLabel}>Service path · checkout</div>
          <div className={styles.path}>
            {['web', 'api', 'auth', 'db'].map((n, i) => (
              <div key={n} className={styles.pathNode}>
                {i > 0 && <span className={`${styles.pathEdge} ${i === 3 ? styles.pathHot : ''}`} />}
                <div className={`${styles.node} ${i === 3 ? styles.nodeHot : ''}`}>{n}</div>
              </div>
            ))}
          </div>
          <div className={styles.sparkRow} aria-hidden>
            <svg viewBox="0 0 280 48" preserveAspectRatio="none">
              <path
                d="M0 32 C20 30, 40 28, 60 26 S100 18, 120 22 S160 34, 180 28 S220 12, 240 10 S260 14, 280 8"
                fill="none"
                stroke="#a78bfa"
                strokeWidth="2"
              />
              <path
                d="M0 38 C30 36, 50 40, 80 36 S140 30, 170 34 S210 42, 240 40 S260 36, 280 34"
                fill="none"
                stroke="rgba(255,255,255,0.22)"
                strokeWidth="1.5"
              />
            </svg>
          </div>
        </div>
        <div className={styles.block}>
          <div className={styles.blockLabel}>Live signals</div>
          <ul className={styles.signalList}>
            <li><em>trace</em> db.query · 498ms · span failing</li>
            <li><em>log</em> connection reset ×214 · 15m</li>
            <li><em>metric</em> pool util 100% · ns/payments</li>
            <li><em>event</em> deploy v2.31.4 · 47m ago</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

function ExplainPanel() {
  return (
    <div className={styles.panel}>
      <div className={styles.rcaHead}>
        <div>
          <div className={styles.brandLine}>AlertMend AI · RCA</div>
          <div className={styles.mono}>INC-08472 · prod-us-east-1 · checkout</div>
        </div>
        <div className={styles.conf}>
          <strong>94%</strong>
          <span>confidence · 14.8s</span>
        </div>
      </div>
      <p className={styles.lede}>
        p99 on <b>/checkout</b> jumped after deploy <b>v2.31.4</b>.{' '}
        <b>db.query</b> saturated the connection pool; auth retries amplified 5xx.
      </p>
      <div className={styles.evidence}>
        {[
          ['Trace', 'db.query 498ms · 5xx on auth → db'],
          ['Logs', 'connection reset ×214 in 15m'],
          ['Change', 'deploy 47m before first alert'],
          ['Metric', 'pool util 100% · p99 ↑18%'],
        ].map(([k, v]) => (
          <div key={k} className={styles.ev}>
            <span>{k}</span>
            <p>{v}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function FixPanel() {
  return (
    <div className={styles.panel}>
      <div className={styles.fixHead}>
        <div>
          <div className={styles.blockLabel}>Approved remediation</div>
          <div className={styles.fixName}>fix-connection-pool</div>
        </div>
        <span className={styles.approved}>Approved · @alex</span>
      </div>
      <ol className={styles.steps}>
        {[
          { s: 'done', t: 'Scale db connection pool 20 → 50' },
          { s: 'done', t: 'Restart payments-api rollout (surge 25%)' },
          { s: 'run', t: 'Verify p99 < 300ms for 5 minutes' },
          { s: 'wait', t: 'Post closing summary to #oncall-payments' },
        ].map((r, i) => (
          <li key={i} className={`${styles.step} ${styles[`st_${r.s}`]}`}>
            <span>{i + 1}</span>
            <p>{r.t}</p>
            <em>{r.s === 'done' ? 'done' : r.s === 'run' ? 'running' : 'queued'}</em>
          </li>
        ))}
      </ol>
      <div className={styles.fixFoot}>
        <span>PR opened · right-size payments-api · save $412/mo</span>
        <span className={styles.chip}>rollback ready</span>
      </div>
    </div>
  )
}

const PHASES: Phase[] = [
  {
    id: 'see',
    step: '01',
    title: 'See',
    line: 'Metrics, logs, traces, and cluster health on one timeline — OpenTelemetry and eBPF.',
    to: '/observability',
    cta: 'Explore observability',
    doors: [
      { label: 'Kubernetes', to: '/kubernetes-management' },
      { label: 'Logs', to: '/log-management' },
    ],
    panel: <SeePanel />,
  },
  {
    id: 'explain',
    step: '02',
    title: 'Explain',
    line: 'AI RCA with cited evidence and confidence — not a black-box guess.',
    to: '/ai-rca',
    cta: 'See AI RCA',
    doors: [
      { label: 'On-call', to: '/on-call-management' },
    ],
    panel: <ExplainPanel />,
  },
  {
    id: 'fix',
    step: '03',
    title: 'Fix',
    line: 'Approved runbooks and PR fixes — auditable, reversible, posted back to Slack.',
    to: '/auto-remediation',
    cta: 'See remediation',
    doors: [
      { label: 'FinOps', to: '/kubernetes-cost-optimization' },
      { label: 'On-call', to: '/on-call-management' },
    ],
    panel: <FixPanel />,
  },
]

export default function PlatformShowcase() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const current = PHASES[active]

  const select = useCallback((i: number) => {
    setActive(i)
    setPaused(true)
  }, [])

  useEffect(() => {
    if (paused) return
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % PHASES.length)
    }, ROTATE_MS)
    return () => window.clearInterval(id)
  }, [paused])

  return (
    <section id="features" className={styles.section}>
      <div className="container">
        <div className={`sec-head reveal ${styles.head}`}>
          <span className="sec-tag">How it works</span>
          <h2>From signal to fix — one loop.</h2>
          <p>
            AlertMend is built around the incident path, not a product catalog.
            See the blast radius, explain the cause, fix with approval.
          </p>
        </div>

        <div
          className={`${styles.loop} reveal`}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className={styles.phases} role="tablist" aria-label="Incident loop">
            {PHASES.map((p, i) => {
              const on = i === active
              return (
                <button
                  key={p.id}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  className={`${styles.phase} ${on ? styles.phaseOn : ''}`}
                  onClick={() => select(i)}
                >
                  <span className={styles.step}>{p.step}</span>
                  <span className={styles.phaseTitle}>{p.title}</span>
                  <span className={styles.phaseLine}>{p.line}</span>
                  {on && !paused && <span className={styles.progress} aria-hidden />}
                </button>
              )
            })}
          </div>

          <div className={styles.console} key={current.id}>
            <div className={styles.chrome}>
              <span className={styles.brandDot} aria-hidden />
              <span className={styles.chromeTitle}>alertmend · {current.title.toLowerCase()}</span>
              <span className={styles.live}><i /> Live</span>
            </div>
            {current.panel}
          </div>

          <div className={styles.foot}>
            <Link to={current.to} className={styles.primaryLink}>
              {current.cta}
              <ArrowRight size={15} strokeWidth={2.4} />
            </Link>
            <div className={styles.doors}>
              {current.doors.map((d) => (
                <Link key={d.to + d.label} to={d.to} className={styles.door}>
                  {d.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
