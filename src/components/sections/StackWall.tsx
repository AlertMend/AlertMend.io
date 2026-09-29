import { Link } from 'react-router-dom'
import BrandLogo from '../ui/BrandLogo'
import { withBrandLogo } from '../../data/brandLogos'
import { findIntegrationBySlug } from '../../data/integrations'
import { useAudience, type Audience } from '../../hooks/useAudience'
import styles from './StackWall.module.css'

/**
 * Homepage "works with" wall. Lists only integrations the product pages
 * already claim.
 */
const STACKS: Record<Audience, { heading: string; sub: string; live: string[] }> = {
  data: {
    heading: 'Plugs into your data stack.',
    sub: 'Checks on your warehouse and lakehouse, pipeline runs from dbt, Airflow and Oracle ODI, report impact in Power BI, alerts in Slack or Teams.',
    live: [
      'Snowflake',
      'Oracle',
      'BigQuery',
      'Redshift',
      'Databricks',
      'Postgres',
      'dbt',
      'Airflow',
      'Oracle ODI',
      'Power BI',
      'Microsoft Teams',
      'Slack',
    ],
  },
  infra: {
    heading: 'Plugs into your stack.',
    sub: 'Keep your monitoring. AlertMend ingests the alerts you already have and adds root cause and automated fixes on top.',
    live: [
      'Kubernetes',
      'AWS',
      'Google Cloud',
      'Prometheus',
      'Datadog',
      'Grafana',
      'PagerDuty',
      'Slack',
      'Microsoft Teams',
      'Jira',
      'GitHub',
    ],
  },
}

function Chip({ label }: { label: string }) {
  const ref = withBrandLogo({ label })
  // Only link to /integrations/<slug> when that detail page exists.
  const slug = ref.to?.startsWith('/integrations/') ? ref.to.slice('/integrations/'.length) : null
  const to = slug && findIntegrationBySlug(slug) ? ref.to : undefined
  const inner = (
    <>
      <BrandLogo
        src={ref.logoSrc}
        slug={ref.iconSlug}
        tint={ref.logoTint}
        domain={ref.domain}
        alt=""
        className={styles.logo}
      />
      <span>{label}</span>
    </>
  )
  const cls = styles.chip
  return to ? (
    <Link to={to} className={cls}>
      {inner}
    </Link>
  ) : (
    <div className={cls}>{inner}</div>
  )
}

export default function StackWall() {
  const { audience } = useAudience()
  const stack = STACKS[audience]

  return (
    <section className={`tight ${styles.section}`} id="integrations">
      <div className="container">
        <div className={`sec-head ${styles.head}`}>
          <span className="sec-tag">Works with</span>
          <h2>{stack.heading}</h2>
          <p>{stack.sub}</p>
        </div>
        <div className={styles.wall}>
          {stack.live.map((l) => (
            <Chip key={l} label={l} />
          ))}
        </div>
      </div>
    </section>
  )
}
