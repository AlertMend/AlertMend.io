import { Link } from 'react-router-dom'
import { Play } from 'lucide-react'
import { HOME_PRODUCTS } from '../../data/homeProducts'
import styles from './Hero.module.css'

const SIGNUP_URL = 'https://app.alertmend.io/signup?source=homepage-hero'
const PLAYGROUND_URL = 'https://demo.alertmend.io'

function hexTone(i: number): 'ok' | 'ok2' | 'warn' | 'crit' | 'idle' {
  const r = (i * 37 + 13) % 100
  if (r < 2) return 'crit'
  if (r < 8) return 'warn'
  if (r < 48) return 'ok'
  if (r < 84) return 'ok2'
  return 'idle'
}

const HEX_ROWS = Array.from({ length: 7 }, (_, r) =>
  Array.from({ length: r % 2 ? 14 : 15 }, (_, c) => hexTone(r * 15 + c)),
)

const byId = Object.fromEntries(HOME_PRODUCTS.map((p) => [p.id, p]))

const LOG_ROWS = [
  { t: '12:04:33', lvl: 'err' as const, svc: 'payments-api', msg: 'OOMKilled · limit 512Mi' },
  { t: '12:04:32', lvl: 'warn' as const, svc: 'checkout', msg: 'upstream timeout 30s' },
  { t: '12:04:32', lvl: 'err' as const, svc: 'payments-db', msg: 'connection reset by peer' },
  { t: '12:04:31', lvl: 'info' as const, svc: 'auth-svc', msg: 'token refreshed' },
]

const LOG_BARS = [28, 36, 44, 52, 40, 68, 90, 74, 58, 46, 62, 80, 96, 72, 54, 48, 70, 88, 64, 42]

/**
 * Beautiful compact platform board — every capability, elevated craft.
 */
export default function Hero() {
  return (
    <section className={styles.hero} id="top">
      <div className="container">
        <h1 className={styles.h1}>
          From signal to <span className={styles.accent}>root cause</span>
          <br />
          to an <span className={styles.accent}>approved fix</span>
        </h1>
        <p className={styles.sub}>
          Metrics, logs, and traces on one timeline. AI RCA with evidence. Remediation gated by
          Slack or Teams approval.
        </p>

        <div className={styles.heroCta}>
          <a
            href={SIGNUP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaPrimary}
          >
            Start free
          </a>
          <a
            href={PLAYGROUND_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaSecondary}
          >
            <Play size={13} strokeWidth={2.5} fill="currentColor" />
            Open playground
          </a>
        </div>

        <div className={styles.stage}>
          <div className={styles.glow} aria-hidden />
          <div className={styles.stageInner}>
            <div className={styles.app}>
              <aside className={styles.rail} aria-hidden>
                <img
                  src="/logos/alertmend-logo.svg"
                  alt=""
                  width={20}
                  height={20}
                  className={styles.railLogo}
                />
                {HOME_PRODUCTS.map((p, i) => (
                  <span
                    key={p.id}
                    className={`${styles.railItem} ${i === 1 ? styles.railOn : ''}`}
                  />
                ))}
              </aside>

              <div className={styles.workspace}>
                <header className={styles.topbar}>
                  <div className={styles.chrome} aria-hidden>
                    <i /><i /><i />
                  </div>
                  <div className={styles.topBrand} aria-hidden>
                    <img
                      src="/logos/alertmend-logo.svg"
                      alt=""
                      width={18}
                      height={18}
                      className={styles.topLogo}
                    />
                    <span className={styles.topBrandName}>AlertMend</span>
                  </div>
                  <nav className={styles.tabs} aria-label="Platform surfaces">
                    {HOME_PRODUCTS.map((p) => (
                      <Link key={p.id} to={p.to} className={p.id === 'obs' ? styles.tabActive : styles.tab}>
                        {p.tab}
                      </Link>
                    ))}
                  </nav>
                  <div className={styles.topMeta}>
                    <span className={styles.search} aria-hidden>⌘K · payments</span>
                    <span className={styles.live}><i /> Live</span>
                  </div>
                </header>

                <div className={styles.board}>
                  <div className={styles.kpiRow}>
                    <div className={`${styles.kpi} ${styles.kpiHot}`}>
                      <span>p99 latency</span>
                      <strong>812ms</strong>
                      <svg className={styles.kpiWave} viewBox="0 0 120 28" preserveAspectRatio="none" aria-hidden>
                        <path d="M0 18 C16 14 28 8 44 12 S72 22 88 12 S108 6 120 10" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.6" />
                      </svg>
                    </div>
                    <div className={`${styles.kpi} ${styles.kpiWarn}`}>
                      <span>error rate</span>
                      <strong>0.42%</strong>
                      <svg className={styles.kpiWave} viewBox="0 0 120 28" preserveAspectRatio="none" aria-hidden>
                        <path d="M0 16 C18 12 30 20 48 14 S78 8 96 14 S112 18 120 12" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.6" />
                      </svg>
                    </div>
                    <div className={`${styles.kpi} ${styles.kpiViolet}`}>
                      <span>throughput</span>
                      <strong>48.2k</strong>
                      <svg className={styles.kpiWave} viewBox="0 0 120 28" preserveAspectRatio="none" aria-hidden>
                        <path d="M0 20 C20 18 32 10 50 12 S82 22 98 10 S112 8 120 6" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.6" />
                      </svg>
                    </div>
                    <div className={`${styles.kpi} ${styles.kpiOk}`}>
                      <span>saturation</span>
                      <strong>63%</strong>
                      <svg className={styles.kpiWave} viewBox="0 0 120 28" preserveAspectRatio="none" aria-hidden>
                        <path d="M0 14 C22 16 36 10 54 12 S86 18 102 12 S114 10 120 12" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.6" />
                      </svg>
                    </div>
                  </div>

                  <Link to={byId.k8s.to} className={`${styles.tile} ${styles.tileLink}`}>
                    <div className={styles.tileHead}>
                      <span>Kubernetes</span>
                      <em>1,247 pods</em>
                    </div>
                    <div className={styles.hexMap}>
                      {HEX_ROWS.map((row, r) => (
                        <div key={r} className={`${styles.hexRow} ${r % 2 ? styles.hexOff : ''}`}>
                          {row.map((t, c) => (
                            <i key={c} className={`${styles.hex} ${styles[`hex_${t}`]} ${t === 'crit' || t === 'warn' ? styles.hexLive : ''}`} />
                          ))}
                        </div>
                      ))}
                    </div>
                    <div className={styles.tileTag}>clusters · incidents · RCA</div>
                  </Link>

                  <Link to={byId.obs.to} className={`${styles.tile} ${styles.tileLink}`}>
                    <div className={styles.tileHead}>
                      <span>Observability</span>
                      <em>service map</em>
                    </div>
                    <svg viewBox="0 0 220 92" className={styles.svg} aria-hidden>
                      <g stroke="#e4e4e7" strokeWidth="1.3" fill="none">
                        <path d="M32 46 C62 20, 82 16, 104 16" />
                        <path d="M32 46 C62 72, 82 76, 104 76" />
                        <path d="M134 16 C162 16, 176 16, 196 16" />
                      </g>
                      <path d="M134 76 C162 76, 176 76, 196 76" stroke="#f87171" strokeWidth="1.6" strokeDasharray="3 2" fill="none" />
                      <g fontSize="8.5" fontWeight="700" fontFamily="ui-sans-serif,system-ui,sans-serif">
                        <rect x="8" y="32" width="40" height="28" rx="6" fill="#7c3aed" />
                        <text x="28" y="50" textAnchor="middle" fill="#fff">web</text>
                        <rect x="104" y="2" width="40" height="28" rx="6" fill="#fff" stroke="#e4e4e7" />
                        <text x="124" y="20" textAnchor="middle" fill="#52525b">api</text>
                        <rect x="104" y="62" width="40" height="28" rx="6" fill="#fff" stroke="#e4e4e7" />
                        <text x="124" y="80" textAnchor="middle" fill="#52525b">auth</text>
                        <rect x="186" y="2" width="28" height="28" rx="6" fill="#fff" stroke="#e4e4e7" />
                        <text x="200" y="20" textAnchor="middle" fill="#52525b">kv</text>
                        <rect x="186" y="62" width="28" height="28" rx="6" fill="#fff1f2" stroke="#fecdd3" />
                        <text x="200" y="80" textAnchor="middle" fill="#e11d48">db</text>
                      </g>
                    </svg>
                    <div className={styles.tileTag}>OTel · eBPF · PromQL</div>
                  </Link>

                  <Link to={byId.obs.to} className={`${styles.tile} ${styles.tileLink}`}>
                    <div className={styles.tileHead}>
                      <span>APM</span>
                      <em>812ms</em>
                    </div>
                    <div className={styles.spans}>
                      {[
                        ['GET /checkout', 100, '#7c3aed'],
                        ['api.handle', 84, '#8b5cf6'],
                        ['db.query', 56, '#f43f5e'],
                        ['cache.get', 14, '#a1a1aa'],
                      ].map(([label, w, c]) => (
                        <div key={String(label)} className={styles.spanRow}>
                          <span>{label}</span>
                          <i style={{ width: `${w}%`, background: String(c) }} />
                        </div>
                      ))}
                    </div>
                    <div className={styles.tileTag}>distributed traces</div>
                  </Link>

                  <Link to={byId.rca.to} className={`${styles.tile} ${styles.tileRca} ${styles.tileLink}`}>
                    <div className={styles.tileHead}>
                      <span>AI RCA</span>
                      <em className={styles.conf}>94%</em>
                    </div>
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
                  </Link>

                  {/* Incident loop band: Logs + RF share equal height */}
                  <div className={styles.band}>
                    <Link to={byId.logs.to} className={`${styles.tile} ${styles.tileLogs} ${styles.tileLink}`}>
                      <div className={styles.tileHead}>
                        <span>Logs</span>
                        <em>38ms</em>
                      </div>
                      <div className={styles.sql}>
                        <b>sql ›</b>
                        <code>
                          <span className={styles.kw}>SELECT</span> * <span className={styles.kw}>FROM</span> logs{' '}
                          <span className={styles.kw}>WHERE</span> ns=<span className={styles.str}>&apos;payments&apos;</span>{' '}
                          <span className={styles.kw}>AND</span> level=<span className={styles.str}>&apos;error&apos;</span>
                        </code>
                      </div>
                      <div className={styles.logTable}>
                        <div className={styles.logHead}>
                          <span>time</span><span>lvl</span><span>service</span><span>message</span>
                        </div>
                        {LOG_ROWS.map((row) => (
                          <div key={`${row.t}-${row.svc}`} className={styles.logRow}>
                            <span className={styles.logTime}>{row.t}</span>
                            <em className={styles[row.lvl]}>{row.lvl.toUpperCase()}</em>
                            <span className={styles.logSvc}>{row.svc}</span>
                            <span>{row.msg}</span>
                          </div>
                        ))}
                      </div>
                      <div className={styles.logFoot}>
                        <div className={styles.logBars} aria-hidden>
                          {LOG_BARS.map((h, i) => (
                            <i key={i} style={{ height: `${h}%` }} className={i > 15 ? styles.logBarHot : undefined} />
                          ))}
                        </div>
                        <div className={styles.tileMeta}>
                          <span>1.2M lines · 38ms</span>
                          <span>3 err · 1 warn</span>
                        </div>
                      </div>
                    </Link>

                    <Link to={byId.fix.to} className={`${styles.tile} ${styles.tileRf} ${styles.tileLink}`}>
                      <div className={styles.tileHead}>
                        <span>RF · Remediation</span>
                        <em className={styles.approved}>approved · @alex</em>
                      </div>
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
                    </Link>
                  </div>

                  <Link to={byId.oncall.to} className={`${styles.tile} ${styles.tileWide} ${styles.tileLink}`}>
                    <div className={styles.tileHead}>
                      <span>On-call</span>
                      <em>payments · sev-2</em>
                    </div>
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
                  </Link>

                  <Link to={byId.finops.to} className={`${styles.tile} ${styles.tileWide} ${styles.tileLink}`}>
                    <div className={styles.tileHead}>
                      <span>FinOps</span>
                      <em className={styles.ok}>$1,378 recoverable</em>
                    </div>
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
                        <span><i /> requested</span>
                        <span><b /> used</span>
                      </div>
                    </div>
                    <div className={styles.tileTag}>YAML preview · rollback · per-namespace</div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
