import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Bot,
  Boxes,
  ChevronRight,
  Crosshair,
  Gauge,
  Plug,
  Search,
  Shield,
  Siren,
  Workflow,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import { useMemo, useState, type FormEvent } from 'react'
import SEO from '../components/SEO'
import DocsLayout from '../components/docs/DocsLayout'
import { DOCS_NAV, type DocsNavLink } from '../data/docsNav'
import styles from './DocumentationPage.module.css'

const POPULAR: { label: string; href: string }[] = [
  { label: 'Connect a cluster', href: '/documentation/install-cluster-agent' },
  { label: 'AI RCA', href: '/documentation/ai-rca' },
  { label: 'RF · Remediation', href: '/documentation/remediation-flows' },
  { label: 'AT-QL queries', href: '/documentation/atql' },
  { label: 'Slack approvals', href: '/documentation/slack-app-approval' },
  { label: 'UI map', href: '/documentation/platform-overview' },
]

const STEPS: {
  step: string
  title: string
  body: string
  href: string
  cta: string
}[] = [
  {
    step: '1',
    title: 'Install the agent',
    body: 'Helm with agentId, key, and masterUrl from Add Cluster.',
    href: '/documentation/install-cluster-agent',
    cta: 'Install guide',
  },
  {
    step: '2',
    title: 'Wire alerts',
    body: 'Confirm the service map, then connect Alertmanager or Datadog.',
    href: '/documentation/alerts-incidents',
    cta: 'Alerts & incidents',
  },
  {
    step: '3',
    title: 'Investigate and fix',
    body: 'Run AI RCA, then approve an RF, runbook, or PR Fix.',
    href: '/documentation/ai-rca',
    cta: 'AI RCA',
  },
]

const SECTION_ICONS: Record<string, LucideIcon> = {
  'How to use': Boxes,
  Install: Wrench,
  Observe: Gauge,
  'Target workloads': Crosshair,
  'Alert & on-call': Siren,
  Diagnose: Bot,
  'Fix & automate': Workflow,
  'Connect tools': Plug,
  'Optimize & admin': Shield,
}

export default function DocumentationPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return [] as DocsNavLink[]
    return DOCS_NAV.flatMap((s) => s.items).filter(
      (item) =>
        item.title.toLowerCase().includes(q) || item.href.toLowerCase().includes(q),
    )
  }, [query])

  const onSearch = (e: FormEvent) => {
    e.preventDefault()
    if (matches[0]) navigate(matches[0].href)
  }

  return (
    <DocsLayout title="Docs home" hub>
      <SEO
        title="Documentation | AlertMend"
        description="Product documentation for AlertMend: install the Kubernetes agent, observe signals, run AI RCA, and approve remediation flows."
        keywords="AlertMend documentation, Helm agent, AI RCA, remediation flows, AT-QL, auto-remediation, ECS, VM monitoring, GPU MLOps, Kubernetes monitoring guide"
        canonical="/documentation"
      />

      <div className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <p className={styles.kicker}>Documentation</p>
            <h1 className={styles.h1}>How to use AlertMend</h1>
            <p className={styles.heroLead}>
              Install agents, observe Kubernetes, run AI RCA, and approve fixes. Same names and
              routes as the product.
            </p>

            <form className={styles.heroSearch} onSubmit={onSearch} role="search">
              <Search size={18} strokeWidth={1.7} className={styles.heroSearchIcon} aria-hidden />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search docs (agent, RCA, Slack, AT-QL…)"
                aria-label="Search documentation"
                autoComplete="off"
              />
              <kbd className={styles.heroKbd}>/</kbd>
              <button type="submit" className={styles.heroSearchBtn}>
                Search
              </button>
            </form>

            {query.trim() && matches.length > 0 ? (
              <ul className={styles.suggest} role="listbox">
                {matches.slice(0, 8).map((m) => (
                  <li key={m.href}>
                    <Link to={m.href} className={styles.suggestLink}>
                      <span>{m.title}</span>
                      <ChevronRight size={14} strokeWidth={1.8} />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}

            {query.trim() && matches.length === 0 ? (
              <p className={styles.noMatch}>No docs match “{query.trim()}”.</p>
            ) : null}

            <div className={styles.popular}>
              <span className={styles.popularLabel}>Popular</span>
              {POPULAR.map((p) => (
                <Link key={p.href} to={p.href} className={styles.chip}>
                  {p.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <div className={styles.body}>
          <section className={styles.band}>
            <h2 className={styles.sectionLabel}>Start here</h2>
            <ol className={styles.steps}>
              {STEPS.map((s) => (
                <li key={s.href}>
                  <Link to={s.href} className={styles.stepCard}>
                    <span className={styles.stepNum}>{s.step}</span>
                    <div className={styles.stepText}>
                      <span className={styles.stepTitle}>{s.title}</span>
                      <span className={styles.stepBody}>{s.body}</span>
                    </div>
                    <span className={styles.stepCta}>
                      {s.cta} <ArrowRight size={14} strokeWidth={1.8} />
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </section>

          <section className={styles.catalog}>
            <h2 className={styles.sectionLabel}>All guides</h2>
            <div className={styles.grid}>
              {DOCS_NAV.map((section) => {
                const Icon = SECTION_ICONS[section.title] ?? Boxes
                return (
                  <article key={section.title} className={styles.card}>
                    <header className={styles.cardHead}>
                      <Icon size={15} strokeWidth={1.7} className={styles.cardIcon} />
                      <h3 className={styles.cardTitle}>{section.title}</h3>
                      <span className={styles.cardCount}>{section.items.length}</span>
                    </header>
                    <ul className={styles.cardList}>
                      {section.items.map((item) => (
                        <li key={item.href}>
                          <Link to={item.href} className={styles.cardLink}>
                            {item.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </article>
                )
              })}
            </div>
          </section>

          <aside className={styles.appCta}>
            <div>
              <p className={styles.appCtaTitle}>Already installed?</p>
              <p className={styles.appCtaBody}>
                Open the UI for service map, RCA, and RF · Remediation.
              </p>
            </div>
            <div className={styles.appCtaActions}>
              <a href="https://app.alertmend.io" className={styles.appCtaPrimary}>
                Open app
              </a>
              <Link to="/documentation/platform-overview" className={styles.appCtaSecondary}>
                UI map <ArrowRight size={14} strokeWidth={1.8} />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </DocsLayout>
  )
}
