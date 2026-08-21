import { Link } from 'react-router-dom'
import BrandLogo from '../ui/BrandLogo'
import { integrations, type IntegrationCategory } from '../../data/integrations'
import styles from './Integrations.module.css'

const CATEGORY_ORDER: IntegrationCategory[] = [
  'Observability',
  'Data',
  'Cloud',
  'Incident & On-call',
  'Collaboration',
  'CI/CD',
  'Issue tracking',
]

const grouped = CATEGORY_ORDER.map((cat) => ({
  cat,
  items: integrations.filter((i) => i.category === cat),
})).filter((g) => g.items.length > 0)

export default function Integrations() {
  return (
    <section id="integrations" className={styles.section}>
      <div className="container">
        <div className={`sec-head reveal ${styles.head}`}>
          <span className="sec-tag">Integrations</span>
          <h2>Works with the tools you already run.</h2>
        </div>

        <div className={`${styles.wall} reveal`}>
          {grouped.map((g) => (
            <div key={g.cat} className={styles.group}>
              <span className={styles.groupLabel}>{g.cat}</span>
              <div className={styles.grid}>
                {g.items.map((i) => (
                  <Link
                    key={i.slug}
                    to={`/integrations/${i.slug}`}
                    className={styles.cell}
                    aria-label={`${i.name} integration`}
                  >
                    <span className={styles.logoChip}>
                      <BrandLogo
                        src={i.logoSrc}
                        slug={i.iconSlug}
                        tint={i.logoTint}
                        domain={i.domain}
                        alt={i.name}
                        className={styles.logoImg}
                      />
                    </span>
                    <span className={styles.cellName}>{i.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
