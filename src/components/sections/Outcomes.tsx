import { Link } from 'react-router-dom'
import Icon from '../ui/Icon'
import styles from './Outcomes.module.css'

type Metric = {
  value: string
  suffix?: string
  label: string
  customer: string
  caseStudyHref: string
}

const metrics: Metric[] = [
  {
    value: '90',
    suffix: '%',
    label: 'MTTR reduction',
    customer: 'Polymer Search',
    caseStudyHref: '/case-studies/auto-remediation-case-studies-polymer-search',
  },
  {
    value: '50',
    suffix: '%',
    label: 'cut in cloud spend',
    customer: 'WareFlex',
    caseStudyHref: '/case-studies/kubernetes-cost-optimization-case-studies-wareflex',
  },
  {
    value: '70',
    suffix: '%',
    label: 'less investigation time',
    customer: 'Decklar',
    caseStudyHref: '/case-studies/kubernetes-cost-optimization-case-studies-rombee',
  },
]

export default function Outcomes() {
  return (
    <section id="outcomes" className={styles.section}>
      <div className="container">
        <div className={`sec-head reveal ${styles.head}`}>
          <span className="sec-tag">Outcomes</span>
          <h2>Results from production teams.</h2>
        </div>

        <div className={`${styles.grid} reveal`}>
          {metrics.map((m) => (
            <Link key={m.customer} to={m.caseStudyHref} className={styles.tile}>
              <span className={styles.numberWrap}>
                <span className={styles.number}>{m.value}</span>
                {m.suffix && <span className={styles.suffix}>{m.suffix}</span>}
              </span>
              <span className={styles.label}>{m.label}</span>
              <span className={styles.caseLink}>
                {m.customer}
                <Icon name="arrow" size={12} className="arrow" strokeWidth={2.5} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
