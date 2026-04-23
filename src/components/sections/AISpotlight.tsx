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
              <div className={styles.rcaTop}>
                <div className={styles.rcaTopLeft}>
                  <span className={`${styles.badge} ${styles.crit}`}>CRITICAL · RESTART STORM</span>
                  <span className={styles.cluster}>cluster: prod · ns: autosre</span>
                </div>
                <span className={`${styles.badge} ${styles.ok}`}>RCA · 14.8s</span>
              </div>

              <div className={styles.row}>
                <div className={styles.rowLabel}>Resource</div>
                <div className={styles.line}>
                  <span className={styles.k}>log-ingester-86b99687d7-cvklg</span>
                </div>
              </div>

              <div className={`${styles.box} ${styles.sumBox}`}>
                <div className={styles.sumLabel}>Executive summary</div>
                <div className={styles.sumText}>
                  The pod is experiencing frequent restarts due to{' '}
                  <b style={{ color: 'var(--text)' }}>ephemeral-storage pressure</b> on its node,
                  disrupting log ingestion.
                </div>
              </div>

              <div className={`${styles.box} ${styles.evBox}`}>
                <div className={styles.evLabel}>Evidence collected</div>
                <div className={styles.evLine}>
                  <span className={styles.evArrow}>›</span> Pod YAML, eviction msg:{' '}
                  <span className={styles.k}>"node low on ephemeral-storage"</span>
                </div>
                <div className={styles.evLine}>
                  <span className={styles.evArrow}>›</span> Container Status,{' '}
                  <span className={styles.k}>257 restarts</span>, last reason:{' '}
                  <span className={styles.k}>Error</span>
                </div>
                <div className={styles.evLine}>
                  <span className={styles.evArrow}>›</span> Pod Logs, pod did not live long enough to log
                </div>
                <div className={styles.evLine}>
                  <span className={styles.evArrow}>›</span> Node metrics, no significant memory
                  pressure detected
                </div>
              </div>

              <div className={`${styles.box} ${styles.concBox}`}>
                <div className={styles.concLabel}>Conclusion · confidence: high</div>
                <div className={styles.concText}>
                  Ephemeral-storage exhaustion on the scheduling node is causing eviction loops on
                  this workload.
                </div>
              </div>

              <div className={styles.remBlock}>
                <div className={styles.remLabel}>Remediation</div>
                <ol className={styles.remList}>
                  <li>
                    Set explicit <b style={{ color: 'var(--text)' }}>ephemeral-storage</b> requests
                    &amp; limits on the pod
                  </li>
                  <li>Reschedule onto a node with larger ephemeral storage</li>
                  <li>Add cluster-wide ephemeral-storage monitoring</li>
                </ol>
              </div>

              <div className={styles.tagRow}>
                <span className={styles.deepTag}>Pod → Metrics</span>
                <span className={styles.deepTag}>Pod → Logs</span>
                <span className={styles.deepTag}>Pod → Details</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
