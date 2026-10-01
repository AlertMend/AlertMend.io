import { Link } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import SEO from '../components/SEO'
import SovereigntySection from '../components/enterprise/SovereigntySection'
import styles from '../components/enterprise/Enterprise.module.css'
import { INDUSTRIES } from '../data/industries'
import { calendlyUrl } from '../lib/calendly'

export default function IndustriesPage() {
  return (
    <>
      <SEO
        title="Data Observability for Banking & Insurance | AlertMend"
        description="Data observability for financial services, banking and insurance, plus healthcare and public sector: data quality, data governance and data sovereignty."
        canonical="/industries"
        keywords="data observability for financial services, data observability for banking, data observability for insurance, data governance banking, BCBS 239 data quality, Solvency II data quality, healthcare data integrity, public sector data sovereignty, AlertMend"
        breadcrumbData={{ items: [{ label: 'Industries' }] }}
      />

      <section className={styles.pageHero}>
        <div className={styles.wrap}>
          <span className={styles.eyebrow}>Data observability for regulated industries</span>
          <h1 className={styles.h1}>Built for industries that answer to regulators.</h1>
          <p className={styles.lede}>
            Financial services firms, banks, insurers, healthcare providers and public bodies use
            AlertMend for data observability and data governance, to prove their data is under control and to keep critical systems running, without moving sensitive data
            out of their environment.
          </p>
          <nav className={styles.jump} aria-label="Industries on this page">
            {INDUSTRIES.map((i) => (
              <a key={i.id} href={`#${i.id}`}>
                {i.name}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <section className={styles.section} style={{ borderTop: 0 }}>
        <div className={styles.wrap}>
          {INDUSTRIES.map((ind) => (
            <article key={ind.id} id={ind.id} className={styles.industry}>
              <div>
                <span className={styles.eyebrow}>{ind.name}</span>
                <h2 className={styles.industryH}>{ind.headline}</h2>
                <p className={styles.lede}>{ind.intro}</p>
                <p className={styles.cellBody} style={{ marginTop: 18 }}>
                  <strong style={{ color: '#0b1220' }}>Deployment: </strong>
                  {ind.deployment}
                </p>
                {ind.links?.map((l) => (
                  <Link key={l.to} to={l.to} className={styles.more} style={{ marginTop: 18 }}>
                    {l.label} →
                  </Link>
                ))}
              </div>
              <div>
                <h3 className={styles.subH}>The challenge</h3>
                <ul className={styles.pain}>
                  {ind.challenges.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
                <h3 className={styles.subH}>Data quality and governance</h3>
                <ul className={styles.checks} style={{ gridTemplateColumns: '1fr', marginBottom: 28 }}>
                  {ind.data.map((d) => (
                    <li key={d}>
                      <CheckCircle2 size={17} strokeWidth={2} className={styles.checkIcon} />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
                <h3 className={styles.subH}>Infrastructure reliability</h3>
                <ul className={styles.checks} style={{ gridTemplateColumns: '1fr' }}>
                  {ind.infra.map((d) => (
                    <li key={d}>
                      <CheckCircle2 size={17} strokeWidth={2} className={styles.checkIcon} />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <SovereigntySection showControls={false} />

      <section className={styles.cta}>
        <div className={`${styles.wrap} ${styles.ctaInner}`}>
          <div>
            <h2 className={styles.h2}>Talk to us about your regulatory context.</h2>
            <p className={styles.lede}>
              Bring your data quality policy or your incident history. We will show how AlertMend
              fits your controls and your deployment rules.
            </p>
          </div>
          <div className={styles.heroCtas} style={{ marginTop: 0 }}>
            <a href={calendlyUrl('industries')} target="_blank" rel="noopener noreferrer" className={styles.btnPrimary}>
              Book a conversation
            </a>
            <Link to="/trust" className={styles.btnSecondary}>
              Trust center
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
