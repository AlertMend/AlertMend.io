import type { ReactNode } from 'react'
import Icon from '../ui/Icon'
import AlertMendIcon from '../ui/AlertMendIcon'
import styles from '../sections/ProductList.module.css'

export type RcaReportStory = {
  duration: string
  confidence: number
  severity: string
  where: string
  target: string
  summary: ReactNode
  evidenceSources: string[]
  evidenceLines: string[]
  conclusion: ReactNode
  remediation: ReactNode[]
  foot: string[]
}

/** Homepage ProductList GPU incident — keep that tab unchanged. */
export const GPU_RCA: RcaReportStory = {
  duration: '14.8s',
  confidence: 94,
  severity: 'CRITICAL · TRAINING STALLED',
  where: 'cluster: prod-gpu · ns: ml-training',
  target: 'llama-ft-7b · step 42,184',
  summary: (
    <>
      Distributed training hung on NCCL all-reduce because GPU 3 on{' '}
      <b>gpu-h100-04</b> is thermally throttling at 89°C — idle GPUs cost ~$98/hr while hung.
    </>
  ),
  evidenceSources: ['Job', 'GPU telemetry', 'NCCL trace', 'Node'],
  evidenceLines: [
    'Job · step stall > 12m on all-reduce',
    'GPU · SM clock 540 MHz · temp 89°C · fans 100%',
    'NCCL · collective wait on rank 3',
    'Node · throttle events on gpu-h100-04',
  ],
  conclusion: (
    <>
      Root cause is inadequate cooling on <b>gpu-h100-04</b>, not application code.
    </>
  ),
  remediation: [
    <>Cordon <b>gpu-h100-04</b></>,
    <>Checkpoint at step 42,000</>,
    <>Reschedule training onto healthy nodes</>,
  ],
  foot: ['GPU → Telemetry', 'NCCL → Trace', 'Node → Health'],
}

/** Same payments incident as the homepage hero AI RCA tile. */
export const PAYMENTS_RCA: RcaReportStory = {
  duration: '14.8s',
  confidence: 94,
  severity: 'CRITICAL · POOL SATURATED',
  where: 'cluster: prod-us-west-2 · ns: payments',
  target: 'payments-api · deploy v2.31.4',
  summary: (
    <>
      <b>db.query</b> saturated the connection pool after deploy <b>v2.31.4</b>. Checkout
      p99 is 812ms (↑ 4.1×) while workers wait on a pool that never grew.
    </>
  ),
  evidenceSources: ['Trace', 'Logs', 'Change', 'Metric'],
  evidenceLines: [
    'Trace · db.query 498ms · 5xx · pool wait',
    'Log · payments-api · connection pool exhausted',
    'Change · deploy v2.31.4 · pool max unchanged',
    'Metric · checkout p99 812ms · ↑ 4.1×',
  ],
  conclusion: (
    <>
      Root cause is an undersized pool after <b>v2.31.4</b>, not application code.
    </>
  ),
  remediation: [
    <>Scale db pool 20 → 50</>,
    <>Restart payments-api (surge 25%)</>,
    <>Verify p99 &lt; 300ms · 5m</>,
  ],
  foot: ['Trace → db.query', 'Logs → payments-api', 'Change → v2.31.4'],
}

export default function RcaReportMock({ story }: { story: RcaReportStory }) {
  return (
    <div className={styles.rcaCard}>
      <div className={styles.rcaChrome} aria-hidden>
        <span className={styles.dots}>
          <i />
          <i />
          <i />
        </span>
        <AlertMendIcon className={styles.rcaChromeLogo} />
        <strong>AI RCA</strong>
        <em>
          {story.duration} · {story.confidence}% confidence
        </em>
        <span className={styles.live}>
          <i /> Live
        </span>
      </div>

      <div className={styles.rcaAgent}>
        <div className={styles.rcaBrand}>
          <AlertMendIcon className={styles.rcaLogo} />
          <span>v2.1</span>
        </div>
        <em>
          <i /> RCA · {story.duration}
        </em>
      </div>

      <div className={styles.rcaInc}>
        <div className={styles.rcaIncTop}>
          <span className={styles.crit}>
            <i />
            {story.severity}
          </span>
          <span className={styles.rcaWhere}>{story.where}</span>
        </div>
        <div className={styles.rcaTarget}>
          <b>&gt;</b>
          <span>{story.target}</span>
        </div>
      </div>

      <div className={styles.rcaBody}>
        <article className={styles.rcaSum}>
          <header>
            <span className={`${styles.rcaIco} ${styles.rcaIcoSum}`}>
              <Icon name="activity" size={12} strokeWidth={2.4} />
            </span>
            Executive summary
          </header>
          <p>{story.summary}</p>
        </article>

        <article className={styles.rcaEv}>
          <header>
            <span className={`${styles.rcaIco} ${styles.rcaIcoEv}`}>
              <Icon name="layers" size={12} strokeWidth={2.4} />
            </span>
            Evidence collected
            <span className={styles.rcaCount}>{story.evidenceSources.length} sources</span>
          </header>
          <div className={styles.rcaTags}>
            {story.evidenceSources.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
          <ul>
            {story.evidenceLines.map((line) => (
              <li key={line}>
                <b>&gt;</b> {line}
              </li>
            ))}
          </ul>
        </article>

        <article className={styles.rcaCon}>
          <header>
            <span className={`${styles.rcaIco} ${styles.rcaIcoCon}`}>
              <Icon name="check-thick" size={12} strokeWidth={2.6} />
            </span>
            Conclusion
            <div className={styles.rcaConf}>
              <span>Confidence</span>
              <i>
                <b style={{ width: `${story.confidence}%` }} />
              </i>
              <em>{story.confidence}%</em>
            </div>
          </header>
          <p>{story.conclusion}</p>
        </article>

        <article className={styles.rcaRem}>
          <header>
            <span className={`${styles.rcaIco} ${styles.rcaIcoRem}`}>
              <Icon name="rotate" size={12} strokeWidth={2.4} />
            </span>
            Remediation
          </header>
          <ol>
            {story.remediation.map((step, i) => (
              <li key={i}>
                <i>{i + 1}</i>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </article>
      </div>

      <div className={styles.rcaFoot}>
        {story.foot.map((f) => (
          <span key={f}>{f}</span>
        ))}
      </div>
    </div>
  )
}
