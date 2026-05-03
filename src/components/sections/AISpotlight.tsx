import Icon from '../ui/Icon';
import styles from './AISpotlight.module.css';

const bullets: { html: React.ReactNode }[] = [
  {
    html: (
      <>
        <b>Executive summary → Evidence → Conclusion → Remediation</b>. Every report follows the
        same readable contract.
      </>
    ),
  },
  {
    html: (
      <>
        <b>Bring your own model</b>. Point inference at a local or self-hosted model for
        air-gapped, regulated or data-residency-sensitive environments.
      </>
    ),
  },
  {
    html: (
      <>
        <b>Slack-native delivery + cluster-overview View RCA</b>. Works for both alert-driven and
        proactively-detected incidents.
      </>
    ),
  },
  {
    html: (
      <>
        <b>Deep links</b> back into Pod metrics, Pod logs and resource details, so the responder
        jumps from narrative to live evidence.
      </>
    ),
  },
];

export default function AISpotlight() {
  return (
    <section id="ai" className={styles.section}>
      <div className="container">
        <div className={styles.spotlight}>
          <div className={`${styles.text} reveal`}>
            <span className="sec-tag">Flagship · AI RCAs</span>
            <h2 className={styles.h2}>
              Every Kubernetes alert gets a structured root cause in ~15 seconds.
            </h2>
            <p className={styles.p}>
              A Kubernetes-specialized model auto-collects the evidence (pod YAML, container status,
              logs, node metrics, events), reaches a conclusion{' '}
              <b style={{ color: 'var(--text)' }}>with confidence level</b>, and posts the
              remediation steps directly into the Slack alert thread. It also runs proactively on
              failures the platform discovers itself: restart storms, OOM loops, scheduling stalls,
              even when no external alert paged.
            </p>
            <ul className={styles.list}>
              {bullets.map((b, i) => (
                <li key={i}>
                  <Icon name="check" size={16} strokeWidth={3} className={styles.checkIco} />
                  <div>{b.html}</div>
                </li>
              ))}
            </ul>
            <div className={styles.cta}>
              <a href="#pricing" className="btn btn-primary">
                See an RCA on your cluster
                <Icon name="arrow" size={14} className="arrow" strokeWidth={2.5} />
              </a>
              <a href="#features" className="btn btn-ghost">
                Learn more
              </a>
            </div>
          </div>

          <div className={`${styles.visual} reveal`}>
            <div className={styles.rca}>
              <span className={styles.scan} aria-hidden />

              {/* Agent header — branded "AlertMend AI" identity bar with the
                  cycling status pill on the right. */}
              <div className={styles.agentHead}>
                <span className={styles.agentBrand}>
                  <img
                    src="/logos/alertmend-logo.png"
                    alt="AlertMend"
                    className={styles.agentLogo}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className={styles.agentName}>AlertMend AI</span>
                  <span className={styles.agentVer}>v2.1</span>
                </span>
                {/* Status pill cycles through real engineering phases as the
                    RCA streams in, then crossfades to the final "RCA · 14.8s"
                    resolved badge. Each phase is a separately stacked badge
                    so the swap doesn't cause layout shift. */}
                <span className={styles.rcaStatus}>
                  <span className={`${styles.badge} ${styles.statusGen} ${styles.statusP1}`}>
                    <span className={styles.statusDot} aria-hidden />
                    Collecting evidence…
                  </span>
                  <span className={`${styles.badge} ${styles.statusGen} ${styles.statusP2}`}>
                    <span className={styles.statusDot} aria-hidden />
                    Analyzing patterns…
                  </span>
                  <span className={`${styles.badge} ${styles.statusGen} ${styles.statusP3}`}>
                    <span className={styles.statusDot} aria-hidden />
                    Generating remediation…
                  </span>
                  <span className={`${styles.badge} ${styles.ok} ${styles.statusFinal}`}>
                    <Icon name="check" size={11} strokeWidth={3} />
                    RCA · 14.8s
                  </span>
                </span>
              </div>

              {/* Incident header — severity pill + cluster + target resource,
                  presented as a single "what we're diagnosing" panel. */}
              <div className={`${styles.incHead} ${styles.streamResource}`}>
                <div className={styles.incTopRow}>
                  <span className={`${styles.badge} ${styles.crit}`}>
                    <span className={styles.critDot} aria-hidden />
                    CRITICAL · TRAINING STALLED
                  </span>
                  <span className={styles.cluster}>cluster: prod-gpu · ns: ml-training</span>
                </div>
                <div className={styles.incResource}>
                  <span className={styles.incCaret}>›</span>
                  <span className={styles.k}>llama-ft-7b · step 42,184</span>
                </div>
              </div>

              <div className={`${styles.box} ${styles.sumBox}`}>
                <div className={styles.sectionHead}>
                  <span className={`${styles.sectionIco} ${styles.sectionIcoSum}`}>
                    <Icon name="message" size={11} strokeWidth={2.4} />
                  </span>
                  <span className={`${styles.sumLabel} ${styles.sectionLabel}`}>
                    Executive summary
                  </span>
                </div>
                <div className={styles.sumText}>
                  Distributed training is hung on{' '}
                  <b style={{ color: 'var(--text)' }}>NCCL all-reduce</b> because GPU 3 on{' '}
                  <b style={{ color: 'var(--text)' }}>gpu-h100-04</b> is thermally throttling to
                  35% SM clock. The other 7 H100s are idling at{' '}
                  <b style={{ color: 'var(--text)' }}>~$98/hr</b> with zero gradient progress.
                </div>
              </div>

              <div className={`${styles.box} ${styles.evBox}`}>
                <div className={styles.sectionHead}>
                  <span className={`${styles.sectionIco} ${styles.sectionIcoEv}`}>
                    <Icon name="database" size={11} strokeWidth={2.4} />
                  </span>
                  <span className={`${styles.evLabel} ${styles.sectionLabel}`}>
                    Evidence collected
                  </span>
                  <span className={styles.evCount}>4 sources</span>
                </div>

                {/* Source chips light up green sequentially as each cluster
                    query returns evidence. */}
                <div className={styles.evSources}>
                  <span className={`${styles.evChip} ${styles.evChip1}`}>
                    <span className={styles.evChipDot} aria-hidden />
                    Job
                  </span>
                  <span className={`${styles.evChip} ${styles.evChip2}`}>
                    <span className={styles.evChipDot} aria-hidden />
                    GPU telemetry
                  </span>
                  <span className={`${styles.evChip} ${styles.evChip3}`}>
                    <span className={styles.evChipDot} aria-hidden />
                    NCCL trace
                  </span>
                  <span className={`${styles.evChip} ${styles.evChip4}`}>
                    <span className={styles.evChipDot} aria-hidden />
                    Node
                  </span>
                </div>

                <div className={styles.evLine}>
                  <span className={styles.evArrow}>›</span> Job, 8× H100 SXM,{' '}
                  <span className={styles.k}>NCCL_TIMEOUT=1800s</span>, no step progress for{' '}
                  <span className={styles.k}>12m 04s</span>
                </div>
                <div className={styles.evLine}>
                  <span className={styles.evArrow}>›</span> gpu-h100-04 dev 3, SM clock{' '}
                  <span className={styles.k}>540 MHz</span> (35%), temp{' '}
                  <span className={styles.k}>89 °C</span>,{' '}
                  <span className={styles.k}>HW_SLOWDOWN</span>
                </div>
                <div className={styles.evLine}>
                  <span className={styles.evArrow}>›</span> NCCL trace, all-reduce stuck on{' '}
                  <span className={styles.k}>rank 27</span>, ring topology, ETA →{' '}
                  <span className={styles.k}>timeout</span>
                </div>
                <div className={styles.evLine}>
                  <span className={styles.evArrow}>›</span> Node, fans at{' '}
                  <span className={styles.k}>100% PWM</span>, inlet temp{' '}
                  <span className={styles.k}>31 °C</span> (SLA: 27 °C)
                </div>
              </div>

              <div className={`${styles.box} ${styles.concBox}`}>
                <div className={styles.sectionHead}>
                  <span className={`${styles.sectionIco} ${styles.sectionIcoConc}`}>
                    <Icon name="check" size={11} strokeWidth={3} />
                  </span>
                  <span className={`${styles.concLabel} ${styles.sectionLabel}`}>
                    Conclusion
                  </span>
                  {/* Confidence meter — fills from 0% → 94% during the analyze
                      phase, replacing the old "confidence: high" text. */}
                  <span className={styles.conf}>
                    <span className={styles.confLabel}>Confidence</span>
                    <span className={styles.confTrack}>
                      <span className={styles.confFill} aria-hidden />
                    </span>
                    <span className={styles.confValue}>94%</span>
                  </span>
                </div>
                <div className={styles.concText}>
                  A single H100 on gpu-h100-04 is HW-throttling from inadequate cooling, blocking
                  the all-reduce ring and freezing the entire job — burning ~$98/hr across 7
                  idle GPUs.
                </div>
              </div>

              <div className={styles.remBlock}>
                <div className={styles.sectionHead}>
                  <span className={`${styles.sectionIco} ${styles.sectionIcoRem}`}>
                    <Icon name="workflow" size={11} strokeWidth={2.4} />
                  </span>
                  <span className={`${styles.remLabel} ${styles.sectionLabel}`}>
                    Remediation
                  </span>
                </div>
                <ol className={styles.remList}>
                  <li>
                    <span className={styles.remNum}>1</span>
                    <span>
                      Cordon{' '}
                      <b style={{ color: 'var(--text)' }}>gpu-h100-04</b>, evict rank 27, and
                      resume the run from{' '}
                      <b style={{ color: 'var(--text)' }}>checkpoint step 42,000</b>
                    </span>
                  </li>
                  <li>
                    <span className={styles.remNum}>2</span>
                    <span>
                      Tag node{' '}
                      <b style={{ color: 'var(--text)' }}>hardware-fault=cooling</b>; open a
                      ticket for inlet airflow inspection
                    </span>
                  </li>
                  <li>
                    <span className={styles.remNum}>3</span>
                    <span>
                      Add HealthPolicy: H100 SM clock &lt; 80% nominal for &gt; 60s →
                      auto-cordon node
                    </span>
                  </li>
                </ol>
              </div>

              <div className={styles.tagRow}>
                <span className={styles.deepTag}>
                  <Icon name="bar" size={10} strokeWidth={2.4} />
                  GPU → Telemetry
                </span>
                <span className={styles.deepTag}>
                  <Icon name="compass" size={10} strokeWidth={2.4} />
                  NCCL → Trace
                </span>
                <span className={styles.deepTag}>
                  <Icon name="database" size={10} strokeWidth={2.4} />
                  Node → Health
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
