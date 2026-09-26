import Icon, { type IconName } from '../ui/Icon'
import { useAudience } from '../../hooks/useAudience'
import styles from './SharedEngine.module.css'

type Pillar = {
  icon: IconName
  title: string
  data: string
  infra: string
}

/** The four things both products share. Each pillar shows how it reads for
 *  each buyer; the line for the selected audience is emphasised. */
const PILLARS: Pillar[] = [
  {
    icon: 'eye',
    title: 'The cause, not just the alert',
    data: 'A failed check names the pipeline job that broke it and the reports it affects.',
    infra: 'An incident arrives with the trace, log line and deploy behind it, with a confidence score.',
  },
  {
    icon: 'check',
    title: 'Nothing changes without approval',
    data: 'AlertMend proposes checks from your policy. A person approves each one.',
    infra: 'Automated fixes are proposed, then run the moment you approve them in Slack or Teams.',
  },
  {
    icon: 'shield',
    title: 'Runs inside your network',
    data: 'A read-only agent holds your warehouse credentials. No inbound ports opened.',
    infra: 'Agents in your clusters and VMs. On-prem and bring-your-own-model for regulated estates.',
  },
  {
    icon: 'shieldCheck',
    title: 'Every step on the record',
    data: 'Every check change is versioned with a reason and can be rolled back.',
    infra: 'Every suggestion, approval and action is logged with who and when, with rollback armed.',
  },
]

export default function SharedEngine() {
  const { audience } = useAudience()

  return (
    <section className={`tight ${styles.section}`} id="platform">
      <div className="container">
        <div className={`sec-head ${styles.head}`}>
          <span className="sec-tag">One platform</span>
          <h2>Two teams. One engine.</h2>
          <p>
            Data quality and infrastructure share one model: evidence, approval, audit.
          </p>
        </div>

        <div className={styles.grid}>
          {PILLARS.map((p) => (
            <div key={p.title} className={styles.card}>
              <Icon name={p.icon} size={16} strokeWidth={1.6} className={styles.icon} />
              <h3 className={styles.title}>{p.title}</h3>
              <p className={audience === 'data' ? styles.lineOn : styles.line}>
                <b>Data</b>
                {p.data}
              </p>
              <p className={audience === 'infra' ? styles.lineOn : styles.line}>
                <b>Infra</b>
                {p.infra}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
