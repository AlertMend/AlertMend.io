import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Building2 } from 'lucide-react'
import { caseStudiesData, generateCaseStudySlug } from '../data/caseStudies'
import SEO from '../components/SEO'
import Breadcrumb from '../components/Breadcrumb'
import { ensureUniqueMetaDescription } from '../utils/descriptionUtils'
import styles from './CaseStudiesPage.module.css'

const DEMO_URL = 'https://calendly.com/hello-alertmend/30min'

function CompanyLogo({ company, logo }: { company: string; logo?: string }) {
  const [imageError, setImageError] = useState(false)

  if (logo && !imageError) {
    return (
      <img
        src={logo}
        alt={`${company} logo`}
        className={styles.logo}
        onError={() => setImageError(true)}
      />
    )
  }

  return (
    <div className={styles.logoFallback} aria-hidden>
      <Building2 size={18} strokeWidth={1.7} />
    </div>
  )
}

export default function CaseStudiesPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  const baseDescription =
    'See how Polymer Search, WareFlex, Decklar, and AIVOS use AlertMend for AI RCA, auto-remediation, and Kubernetes cost control.'
  const uniqueDescription = ensureUniqueMetaDescription(
    baseDescription,
    'case-studies',
    'case-studies',
  )

  return (
    <div className={styles.page}>
      <SEO
        title="Case Studies | AlertMend"
        description={uniqueDescription}
        keywords="AlertMend case studies, customer success, Kubernetes cost optimization, auto-remediation, AIOps"
        canonical="/case-studies"
        breadcrumbData={{ items: [{ label: 'Case Studies' }] }}
      />

      <section className={`zone-dark ${styles.hero}`}>
        <div className={`container ${styles.heroInner}`}>
          <Breadcrumb items={[{ label: 'Case Studies' }]} />
          <p className="sec-tag">Customers</p>
          <h1 className={styles.h1}>
            Real results from teams running AlertMend
          </h1>
          <p className={styles.lead}>
            Off-hours remediation, GKE cost cuts, and Kubernetes control at scale, written up by the
            people who ship with AlertMend.
          </p>
        </div>
      </section>

      <section className={styles.list}>
        <div className="container">
          <div className={styles.grid}>
            {caseStudiesData.map((study) => {
              const href = `/case-studies/${generateCaseStudySlug(study.category, study.company)}`
              const main = study.results[0]
              return (
                <Link key={href} to={href} className={styles.card}>
                  <div className={styles.cardTop}>
                    <span className={styles.cat}>{study.category}</span>
                    <CompanyLogo company={study.company} logo={study.logo} />
                    <h2 className={styles.company}>{study.company}</h2>
                    <p className={styles.title}>{study.title}</p>
                  </div>
                  <div className={styles.cardFoot}>
                    <div className={styles.metric}>
                      <span className={styles.metricValue}>{main?.metric}</span>
                      <span className={styles.metricLabel}>{main?.label}</span>
                    </div>
                    <span className={styles.read}>
                      Read case study <ArrowRight size={14} strokeWidth={1.8} />
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className={`tight ${styles.ctaSec}`}>
        <div className={`container ${styles.cta}`}>
          <div className={styles.ctaCopy}>
            <p className="sec-tag">Next step</p>
            <h2 className={styles.ctaTitle}>Want results like these?</h2>
            <p className={styles.ctaBody}>
              Book a demo and we will walk through RCA, remediation flows, and cost findings on your
              stack.
            </p>
          </div>
          <div className={styles.ctaActions}>
            <a
              href={DEMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Book a demo
              <ArrowRight size={14} strokeWidth={2} />
            </a>
            <Link to="/contact" className="btn btn-ghost">
              Talk with us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
