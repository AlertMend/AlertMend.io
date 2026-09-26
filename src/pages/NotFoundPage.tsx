import SEO from '../components/SEO'
import { ActionLink } from '../components/enterprise/PageKit'
import styles from '../components/enterprise/Enterprise.module.css'
import kit from '../components/enterprise/PageKit.module.css'

const POPULAR = [
  { label: 'Data observability', href: '/data-observability' },
  { label: 'Infrastructure observability', href: '/observability' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Blog', href: '/blog' },
  { label: 'Documentation', href: '/documentation' },
  { label: 'Contact', href: '/contact' },
]

export default function NotFoundPage() {
  return (
    <>
      <SEO title="Page not found | AlertMend" description="The page you are looking for does not exist." noindex={true} />
      <section className={kit.notFound}>
        <div className={styles.wrap}>
          <span className={kit.code}>404</span>
          <h1 className={styles.h2}>We couldn't find that page.</h1>
          <p className={styles.lede} style={{ marginTop: 16, maxWidth: 560 }}>
            It may have moved, or the link may be out of date. These are the places most people are looking for.
          </p>
          <div className={styles.heroCtas}>
            <ActionLink action={{ label: 'Go to the homepage', href: '/' }} variant="primary" />
            <ActionLink action={{ label: 'Contact us', href: '/contact' }} variant="secondary" />
          </div>
          <ul className={styles.checks} style={{ marginTop: 48, maxWidth: 560 }}>
            {POPULAR.map((p) => (
              <li key={p.href}>
                <ActionLink action={p} variant="text" />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
