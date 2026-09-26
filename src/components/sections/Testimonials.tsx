import { Link } from 'react-router-dom'
import Icon from '../ui/Icon'
import { caseStudiesData, generateCaseStudySlug } from '../../data/caseStudies'
import { useAudience } from '../../hooks/useAudience'
import styles from './Testimonials.module.css'

/** Homepage-only logo overrides: wordmarks read better than the case-study icons. */
const LOGOS: Record<string, { src: string; wordmark: boolean }> = {
  'Polymer Search': { src: '/logos/polymer-logo.svg', wordmark: true },
  WareFlex: { src: '/logos/wareflex-logo.svg', wordmark: true },
  Decklar: { src: '/logos/decklar-logo.svg', wordmark: true },
  AIVOS: { src: '/logos/avios-logo.svg', wordmark: false },
}

type Quote = {
  company: string
  quote: string
  author: string
  role: string
  href: string
}

const QUOTES: Quote[] = caseStudiesData
  .filter((c) => c.testimonial?.quote)
  .map((c) => ({
    company: c.company,
    quote: c.testimonial.quote,
    author: c.testimonial.author,
    role: c.testimonial.role,
    href: `/case-studies/${generateCaseStudySlug(c.category, c.company)}`,
  }))

export default function Testimonials() {
  const { audience } = useAudience()
  if (QUOTES.length === 0) return null

  return (
    <section className={styles.section} id="customers">
      <div className="container">
        <div className={`sec-head ${styles.head}`}>
          <span className="sec-tag">Customers</span>
          <h2>In their words.</h2>
          <p>
            {audience === 'data'
              ? 'Founders and CTOs running production on AlertMend today. The same platform, evidence and approval model power data observability.'
              : 'Founders and CTOs running production on AlertMend today.'}
          </p>
        </div>

        <div className={styles.grid}>
          {QUOTES.map((q) => {
            const logo = LOGOS[q.company]
            return (
              <figure key={q.company} className={styles.card}>
                <Icon name="message" size={16} strokeWidth={1.6} className={styles.mark} />
                <blockquote className={styles.quote}>“{q.quote}”</blockquote>
                <figcaption className={styles.by}>
                  <span className={styles.logoBox}>
                    {logo ? (
                      <img
                        src={logo.src}
                        alt={logo.wordmark ? q.company : ''}
                        className={logo.wordmark ? styles.wordmark : styles.icon}
                        loading="lazy"
                        decoding="async"
                      />
                    ) : null}
                    {(!logo || !logo.wordmark) && <b>{q.company}</b>}
                  </span>
                  <span className={styles.person}>
                    <strong>{q.author}</strong>
                    <span>{q.role}</span>
                  </span>
                  <Link to={q.href} className={styles.link}>
                    Case study
                    <Icon name="arrow" size={12} strokeWidth={2.4} />
                  </Link>
                </figcaption>
              </figure>
            )
          })}
        </div>
      </div>
    </section>
  )
}
