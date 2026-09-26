import { Link } from 'react-router-dom'
import Icon from '../ui/Icon'
import { useAudience, type Audience } from '../../hooks/useAudience'
import styles from './Outcomes.module.css'

type Metric = {
  /** Customer logo (real results only). */
  logo?: string
  /** Icon for product-fact tiles that have no customer. */
  icon?: 'database' | 'shield' | 'check'
  /** One-line before → after. */
  before: string
  after: string
  value: string
  suffix?: string
  label: string
  /** Customer name for real results, or a short link label for product facts. */
  linkLabel: string
  href: string
}

/**
 * Infra shows real customer results (attributed). Data observability has no
 * published customer result yet, so it shows verifiable product facts from
 * /data-observability instead. Swap in a data customer result when one exists;
 * never invent a number.
 */
const CONTENT: Record<Audience, { tag: string; heading: string; metrics: Metric[] }> = {
  infra: {
    tag: 'Infrastructure outcomes',
    heading: 'Results from production teams.',
    metrics: [
      {
        logo: '/logos/polymer-logo.svg',
        before: '45 min',
        after: 'under 5 min',
        value: '90',
        suffix: '%',
        label: 'MTTR reduction, zero overnight escalations',
        linkLabel: 'Polymer Search',
        href: '/case-studies/auto-remediation-case-studies-polymer-search',
      },
      {
        logo: '/logos/wareflex-logo.svg',
        before: 'storage $407/mo',
        after: '$25/mo',
        value: '50',
        suffix: '%',
        label: 'cut in GKE costs, no performance regression',
        linkLabel: 'WareFlex',
        href: '/case-studies/kubernetes-cost-optimization-case-studies-wareflex',
      },
      {
        logo: '/logos/decklar-logo.svg',
        before: '3,000+ pods, many tools',
        after: 'one dashboard',
        value: '70',
        suffix: '%',
        label: 'less investigation time, 15–20 hours saved a week',
        linkLabel: 'Decklar',
        href: '/case-studies/kubernetes-management-case-studies-decklar',
      },
    ],
  },
  data: {
    tag: 'Data observability',
    heading: 'Built for regulated data teams.',
    metrics: [
      {
        icon: 'database',
        before: 'hand-written SQL',
        after: 'guided wizard',
        value: '87',
        label: 'ready-made checks, built in a wizard with no SQL',
        linkLabel: 'See the checks',
        href: '/data-observability',
      },
      {
        icon: 'shield',
        before: 'credentials shared',
        after: 'kept in your network',
        value: '0',
        label: 'warehouse secrets stored by AlertMend',
        linkLabel: 'How your data stays safe',
        href: '/data-observability',
      },
      {
        icon: 'check',
        before: 'policy clause',
        after: 'check you approve',
        value: '100',
        suffix: '%',
        label: 'of checks approved by a person before they go live',
        linkLabel: 'Policy to checks',
        href: '/data-observability',
      },
    ],
  },
}

export default function Outcomes() {
  const { audience } = useAudience()
  const { tag, heading, metrics } = CONTENT[audience]

  return (
    <section id="outcomes" className={styles.section}>
      <div className="container">
        <div className={`sec-head reveal ${styles.head}`}>
          <span className="sec-tag">{tag}</span>
          <h2>{heading}</h2>
        </div>

        <div className={`${styles.grid} reveal`}>
          {metrics.map((m) => (
            <Link key={m.label} to={m.href} className={styles.tile}>
              <span className={styles.brand}>
                {m.logo ? (
                  <img src={m.logo} alt={m.linkLabel} className={styles.logo} loading="lazy" decoding="async" />
                ) : (
                  m.icon && <Icon name={m.icon} size={16} strokeWidth={1.6} className={styles.factIcon} />
                )}
              </span>
              <span className={styles.numberWrap}>
                <span className={styles.number}>{m.value}</span>
                {m.suffix && <span className={styles.suffix}>{m.suffix}</span>}
              </span>
              <span className={styles.label}>{m.label}</span>
              <span className={styles.delta}>
                <s>{m.before}</s>
                <Icon name="arrow" size={12} strokeWidth={2.2} />
                <b>{m.after}</b>
              </span>
              <span className={styles.caseLink}>
                {m.linkLabel}
                <Icon name="arrow" size={12} className="arrow" strokeWidth={2.5} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
