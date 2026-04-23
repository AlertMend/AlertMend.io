import { Link } from 'react-router-dom';
import Icon from '../ui/Icon';
import BrandLogo, { simpleIconsUrl, svgPornUrl } from '../ui/BrandLogo';
import styles from './Hero.module.css';

const evidence = [
  <>Pulled <b>pod events, logs, metrics</b> for the last 15m</>,
  <>Cross-checked <b>cluster state</b> and <b>recent deploys</b></>,
  <>Matched failure pattern: <code>ephemeral-storage</code> eviction</>,
  <>Drafted fix and validated against <b>3 sibling pods</b></>,
];

export default function Hero() {
  return (
    <section className={styles.hero} id="top">
      <div className="container">
        <h1 className={styles.h1}>
          <span className={styles.row}>
            AI-Powered <span className={styles.accent}>Observability</span>
          </span>
          <br />
          <span className={styles.row}>
            &amp; <span className={styles.accent}>Automation</span>
          </span>
        </h1>
        <div className={styles.tagline}>Your DevOps from day one.</div>
        <p className={styles.sub}>
          The <b style={{ color: 'var(--text)' }}>AIOps platform</b> for everything in production
          — from microservices to <b style={{ color: 'var(--text)' }}>GPU fleets and ML pipelines</b>.
          AI triage in ~15 seconds, runbooks across pods and VM fleets, and FinOps that cuts your
          Kubernetes, AWS and GPU bill in half.
        </p>

        <div className={styles.heroCta}>
          <Link to="/contact" className="btn btn-primary btn-lg">
            Book a demo
            <Icon name="arrow" size={16} className="arrow" strokeWidth={2.5} />
          </Link>
          <a href="#features" className="btn btn-ghost btn-lg">
            See it in action
          </a>
        </div>

        <div className={styles.heroMeta}>
          <span>
            <Icon name="check" size={14} strokeWidth={3} className={styles.check} /> No credit card
          </span>
          <span>·</span>
          <span>
            <Icon name="check" size={14} strokeWidth={3} className={styles.check} /> Bring your own
            model (BYOM) for regulated environments
          </span>
          <span>·</span>
          <span>
            <Icon name="check" size={14} strokeWidth={3} className={styles.check} /> Live in 1 day
          </span>
        </div>

        <div className={styles.mockup}>
          <div className={styles.browser}>
            <div className={styles.browserBar}>
              <div className={styles.dots}>
                <span /><span /><span />
              </div>
              <div className={styles.url}>app.alertmend.io / incidents / log-ingester</div>
            </div>
            <div className={styles.screen}>
              <div className={styles.stage}>
                {/* Left: incoming incident */}
                <div className={styles.card}>
                  <div className={styles.cardHead}>
                    <span className={styles.cardTitle}>Incident #8472</span>
                    <span className={styles.firingPill}>
                      <span className={styles.firingDot} /> Firing
                    </span>
                  </div>
                  <h4 className={styles.incidentName}>log-ingester</h4>
                  <div className={styles.incidentState}>CrashLoopBackOff · 257 restarts</div>
                  <dl className={styles.meta}>
                    <dt>Cluster</dt>
                    <dd>
                      <BrandLogo slug="kubernetes" alt="" className={styles.metaLogo} />
                      <b>prod-us-east-1</b>
                    </dd>
                    <dt>Namespace</dt>
                    <dd>observability</dd>
                    <dt>Repo</dt>
                    <dd>
                      <BrandLogo
                        src={simpleIconsUrl('github', 'ffffff')}
                        alt=""
                        className={styles.metaLogo}
                      />
                      acme/log-ingester
                    </dd>
                    <dt>Source</dt>
                    <dd className={styles.metaSource}>
                      <span className={styles.metaSrcItem}>
                        <BrandLogo slug="datadog" alt="" className={styles.metaLogo} />
                        Datadog
                      </span>
                      <span className={styles.metaSep}>·</span>
                      <span className={styles.metaSrcItem}>
                        <BrandLogo slug="prometheus" alt="" className={styles.metaLogo} />
                        Prometheus
                      </span>
                    </dd>
                    <dt>Fired</dt>
                    <dd>2 min ago</dd>
                    <dt>On-call</dt>
                    <dd>@alex (auto-paged)</dd>
                  </dl>

                  <div className={styles.timeline}>
                    <div className={styles.timelineLabel}>Recent activity</div>
                    <ul className={styles.timelineList}>
                      <li>
                        <span className={styles.tlDot} data-kind="warn" />
                        <span className={styles.tlTime}>2m</span>
                        <span className={styles.tlText}>Pod evicted · ephemeral-storage</span>
                      </li>
                      <li>
                        <span className={styles.tlDot} data-kind="warn" />
                        <span className={styles.tlTime}>9m</span>
                        <span className={styles.tlText}>Restart attempt #256</span>
                      </li>
                      <li>
                        <span className={styles.tlDot} data-kind="info" />
                        <span className={styles.tlTime}>14m</span>
                        <span className={styles.tlText}>
                          Deploy <code>v2.31.4</code>
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Right: AI agent doing RCA */}
                <div className={styles.agent}>
                  <div className={styles.agentHead}>
                    <span className={styles.aiBadge}>
                      <Icon name="aiOrb" size={16} strokeWidth={2.2} className={styles.aiIco} />
                      AI Root Cause Analysis
                    </span>
                    <span className={styles.timer}>
                      <Icon name="clock" size={12} strokeWidth={2.5} />
                      Resolved in 14.2s
                    </span>
                  </div>

                  <ul className={styles.steps}>
                    {evidence.map((e, i) => (
                      <li key={i} className={styles.step}>
                        <span className={styles.checkIco}>
                          <Icon name="check" size={11} strokeWidth={3.5} />
                        </span>
                        <span>{e}</span>
                      </li>
                    ))}
                  </ul>

                  <div className={styles.diff}>
                    <div className={styles.diffHead}>
                      <BrandLogo
                        src={simpleIconsUrl('github', 'ffffff')}
                        alt=""
                        className={styles.diffIco}
                      />
                      <span className={styles.diffPath}>
                        deploy/log-ingester/values.yaml
                      </span>
                      <span className={styles.diffBadge}>+4 −1</span>
                    </div>
                    <pre className={styles.diffBody}>
                      <span className={styles.diffMinus}>- ephemeralStorage: 1Gi</span>
                      <span className={styles.diffPlus}>+ ephemeralStorage: 4Gi</span>
                      <span className={styles.diffPlus}>+ logRotation:</span>
                      <span className={styles.diffPlus}>+   maxSize: 100Mi</span>
                      <span className={styles.diffPlus}>+   keep: 5</span>
                    </pre>
                  </div>

                  <div className={styles.result}>
                    <div className={styles.resultLabel}>Root cause</div>
                    <div className={styles.resultText}>
                      Pod exceeded its <code>ephemeral-storage: 1Gi</code> limit due to log buildup.
                      Kubelet evicted the pod, triggering restart loop. Sibling pods on the same node
                      are trending toward the same threshold.
                    </div>
                    <div className={styles.conf}>
                      Confidence
                      <span className={styles.confBar}>
                        <span />
                      </span>
                      <b>94%</b>
                    </div>
                  </div>

                  <div className={styles.actions}>
                    <span className={`${styles.act} ${styles.actPrimary}`}>
                      <BrandLogo
                        src={simpleIconsUrl('github', 'ffffff')}
                        alt=""
                        className={styles.actLogo}
                      />
                      Generate PR
                    </span>
                    <span className={`${styles.act} ${styles.actGhost}`}>
                      <Icon name="shieldCheck" size={14} strokeWidth={2.2} />
                      Run runbook
                    </span>
                    <span className={`${styles.act} ${styles.actGhost}`}>
                      <BrandLogo
                        src={svgPornUrl('slack')}
                        alt=""
                        className={styles.actLogo}
                      />
                      Post to Slack
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
