import { Link } from 'react-router-dom'
import { Building2, HeartPulse, Landmark, ShieldHalf } from 'lucide-react'
import { INDUSTRIES } from '../../data/industries'
import styles from './Enterprise.module.css'

const ICONS: Record<string, typeof Landmark> = {
  'financial-services': Landmark,
  insurance: ShieldHalf,
  healthcare: HeartPulse,
  'public-sector': Building2,
}

/** Homepage band: the four regulated industries, each linking to /industries#id. */
export default function IndustriesBand() {
  return (
    <section className={styles.section} id="industries">
      <div className={styles.wrap}>
        <div className={styles.head}>
          <div>
            <span className={styles.eyebrow}>Industries</span>
            <h2 className={styles.h2}>Built for industries that answer to regulators.</h2>
          </div>
          <p className={styles.lede}>
            Controls you can evidence, deployment that respects data sovereignty, and a human
            approval on every change.
          </p>
        </div>
        <div className={styles.grid4}>
          {INDUSTRIES.map((ind) => {
            const Icon = ICONS[ind.id] ?? Building2
            return (
              <Link key={ind.id} to={`/industries#${ind.id}`} className={styles.cell}>
                <Icon size={22} strokeWidth={1.5} className={styles.icon} />
                <h3 className={styles.cellTitle}>{ind.name}</h3>
                <p className={styles.cellBody}>{ind.short}</p>
                <span className={styles.more} style={{ marginTop: 'auto', paddingTop: 8, fontSize: 14 }}>
                  Learn more →
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
