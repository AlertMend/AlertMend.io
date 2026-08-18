import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowRight, Building2 } from 'lucide-react'
import { findCaseStudyBySlug, generateCaseStudySlug } from '../data/caseStudies'
import SEO from '../components/SEO'
import Breadcrumb from '../components/Breadcrumb'
import { ensureUniqueMetaDescription } from '../utils/descriptionUtils'
import styles from './CaseStudyDetailPage.module.css'

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
      <Building2 size={16} strokeWidth={1.7} />
    </div>
  )
}

/* Browsers treat an existing hyphen as a soft wrap opportunity, which split
   "Off-Hours" across two lines. Hyphenated words are pinned instead. */
function renderTitle(title: string) {
  return title.split(/(\s+)/).map((part, index) =>
    part.includes('-') ? (
      <span key={`${part}-${index}`} className={styles.pinned}>
        {part}
      </span>
    ) : (
      part
    ),
  )
}

/* `infrastructure` mixes list form ("ECS, SQS, Lambda") with prose that carries
   commas inside parentheses ("Kubernetes (3,000+ Pods in Production)"), so the
   split has to ignore any comma nested in brackets. */
function splitStack(infrastructure?: string): string[] {
  if (!infrastructure) return []
  const parts: string[] = []
  let depth = 0
  let current = ''

  for (const char of infrastructure) {
    if (char === '(') depth += 1
    if (char === ')') depth = Math.max(0, depth - 1)
    if (char === ',' && depth === 0) {
      parts.push(current)
      current = ''
      continue
    }
    current += char
  }
  parts.push(current)

  return parts.map((part) => part.trim()).filter(Boolean)
}

function pctSaved(before: string, after: string): string {
  const b = parseFloat(before.replace(/[^0-9.]/g, ''))
  const a = parseFloat(after.replace(/[^0-9.]/g, ''))
  if (!b || Number.isNaN(a)) return '—'
  return `${(((b - a) / b) * 100).toFixed(1)}%`
}

export default function CaseStudyDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [slug])

  const study = findCaseStudyBySlug(slug || '')

  if (!study) {
    return (
      <div className={styles.page}>
        <SEO
          title="Case Study Not Found | AlertMend"
          description="The requested case study could not be found."
        />
        <div className={`container ${styles.notFound}`}>
          <h1>Case study not found</h1>
          <Link to="/case-studies" className="btn btn-primary">
            Back to case studies
          </Link>
        </div>
      </div>
    )
  }

  const caseStudyUrl = `/case-studies/${generateCaseStudySlug(study.category, study.company)}`
  const baseDescription = `How ${study.company} used AlertMend: ${study.title}. ${study.results[0]?.metric || ''} ${study.results[0]?.label || ''}.`
  const uniqueDescription = ensureUniqueMetaDescription(
    baseDescription,
    'case-study',
    generateCaseStudySlug(study.category, study.company),
  )

  const metaBits = [
    study.industry,
    study.companySize ? `${study.companySize} employees` : null,
    study.region,
  ].filter(Boolean) as string[]
  const stackItems = splitStack(study.infrastructure)

  return (
    <div className={styles.page}>
      <SEO
        title={`${study.company} Case Study | AlertMend`}
        description={uniqueDescription}
        keywords={`${study.company} case study, ${study.category.toLowerCase()}, AlertMend, ${study.industry?.toLowerCase() || ''}`}
        canonical={caseStudyUrl}
        ogType="article"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          name: `${study.company} - ${study.title}`,
          description: study.testimonial.quote,
          url: `https://www.alertmend.io${caseStudyUrl}`,
          author: { '@type': 'Organization', name: 'AlertMend' },
          publisher: {
            '@type': 'Organization',
            name: 'AlertMend',
            logo: {
              '@type': 'ImageObject',
              url: 'https://alertmend.io/logos/alertmend-logo.svg',
            },
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://www.alertmend.io${caseStudyUrl}`,
          },
        }}
        breadcrumbData={{
          items: [
            { label: 'Case Studies', path: '/case-studies' },
            { label: study.company },
          ],
        }}
      />

      <section className={`zone-dark ${styles.hero}`}>
        <div className={`container ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <Breadcrumb
              items={[
                { label: 'Case Studies', path: '/case-studies' },
                { label: study.company },
              ]}
            />
            <div className={styles.heroBrand}>
              <CompanyLogo company={study.company} logo={study.logo} />
              <span className={styles.company}>{study.company}</span>
              <span className={styles.cat}>{study.category}</span>
            </div>
            <h1 className={styles.h1}>{renderTitle(study.title)}</h1>
            {metaBits.length > 0 ? (
              <p className={styles.metaLine}>{metaBits.join(' · ')}</p>
            ) : null}
            {stackItems.length > 0 ? (
              <div className={styles.stack}>
                <span className={styles.stackLabel}>Stack</span>
                <div className={styles.stackChips}>
                  {stackItems.map((item) => (
                    <span key={item} className={styles.chip}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div className={styles.heroStats}>
            {study.results.map((result) => (
              <div key={result.label} className={styles.heroStat}>
                <div className={styles.heroStatValue}>{result.metric}</div>
                <div className={styles.heroStatLabel}>{result.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className={styles.body}>
        <div className={`container ${styles.content}`}>
          <div className={styles.split}>
            <section className={styles.block}>
              <h2 className={styles.h2}>Challenge</h2>
              <ul className={styles.list}>
                {study.challenge.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
            <section className={styles.block}>
              <h2 className={styles.h2}>Solution</h2>
              <ul className={styles.list}>
                {study.solution.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          </div>

          {study.keyFeatures && study.keyFeatures.length > 0 ? (
            <section className={styles.block}>
              <h2 className={styles.h2}>What they used</h2>
              <div className={styles.features}>
                {study.keyFeatures.map((feature) => (
                  <div key={feature.feature} className={styles.feature}>
                    <h3 className={styles.featureTitle}>{feature.feature}</h3>
                    <p className={styles.featureBody}>{feature.impact}</p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {study.costBreakdown ? (
            <section className={styles.block}>
              <h2 className={styles.h2}>Cost breakdown</h2>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th />
                      <th>Before</th>
                      <th>After</th>
                      <th>Saved</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Compute</td>
                      <td>{study.costBreakdown.before.compute}</td>
                      <td>{study.costBreakdown.after.compute}</td>
                      <td>
                        {pctSaved(
                          study.costBreakdown.before.compute,
                          study.costBreakdown.after.compute,
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>Storage</td>
                      <td>{study.costBreakdown.before.storage}</td>
                      <td>{study.costBreakdown.after.storage}</td>
                      <td>
                        {pctSaved(
                          study.costBreakdown.before.storage,
                          study.costBreakdown.after.storage,
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}

          {study.firstMonthResults && study.firstMonthResults.length > 0 ? (
            <section className={styles.block}>
              <h2 className={styles.h2}>First month</h2>
              <div className={styles.monthGrid}>
                {study.firstMonthResults.map((result) => (
                  <div key={result.label} className={styles.monthItem}>
                    <div className={styles.monthValue}>{result.metric}</div>
                    <div className={styles.monthLabel}>{result.label}</div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          <blockquote className={styles.quote}>
            <p>“{study.testimonial.quote}”</p>
            <footer>
              <strong>{study.testimonial.author}</strong>
              <span>{study.testimonial.role}</span>
            </footer>
          </blockquote>

          <aside className={styles.cta}>
            <div>
              <p className={styles.ctaTitle}>Want results like {study.company}?</p>
              <p className={styles.ctaBody}>
                Book a demo for RCA, remediation flows, and cost findings on your stack.
              </p>
            </div>
            <div className={styles.ctaActions}>
              <a
                href={DEMO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.ctaBtn} ${styles.ctaBtnPrimary}`}
              >
                Book a demo
                <ArrowRight size={14} strokeWidth={2} />
              </a>
              <button
                type="button"
                className={`${styles.ctaBtn} ${styles.ctaBtnGhost}`}
                onClick={() => navigate('/case-studies')}
              >
                All case studies
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
