import { Link } from 'react-router-dom'
import styles from './AudienceChooser.module.css'

const cards = [
  {
    tag: 'Data & governance',
    heading: 'Data observability from your policy',
    body: 'Turn DQ policy into live checks on Snowflake and Oracle. When something fails, see the pipeline job and the Power BI reports it hits.',
    href: '/data-observability',
    cta: 'Open data observability',
  },
  {
    tag: 'Platform & SRE',
    heading: 'Infrastructure observability that acts',
    body: 'Metrics, logs and traces on one timeline. Evidence-backed root cause, and remediations that wait for approval in Slack or Teams.',
    href: '/observability',
    cta: 'Open infrastructure',
  },
] as const

export default function AudienceChooser() {
  return (
    <section className={`tight ${styles.section}`}>
      <div className="container">
        <div className={`sec-head ${styles.chooserHead}`}>
          <span className="sec-tag">Where do you want to start?</span>
          <h2>Two doors. One platform.</h2>
          <p>Both are first-class. Choose the surface your team lives in today.</p>
        </div>
        <div className={styles.grid}>
          {cards.map((card) => (
            <Link key={card.href} to={card.href} className={styles.card}>
              <span className="sec-tag">{card.tag}</span>
              <h3 className={styles.heading}>{card.heading}</h3>
              <p className={styles.body}>{card.body}</p>
              <span className={styles.cta}>
                {card.cta}
                <span aria-hidden="true"> →</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
