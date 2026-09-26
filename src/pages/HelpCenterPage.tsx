import { BookOpen, LifeBuoy, MessageCircle } from 'lucide-react'
import SEO from '../components/SEO'
import { PageHero, Section, CellGrid, CtaBand, ActionLink } from '../components/enterprise/PageKit'
import styles from '../components/enterprise/Enterprise.module.css'
import kit from '../components/enterprise/PageKit.module.css'
import { ensureUniqueMetaDescription } from '../utils/descriptionUtils'
import { calendlyUrl } from '../lib/calendly'

const CATEGORIES = [
  {
    icon: BookOpen,
    title: 'Getting started',
    articles: [
      { label: 'Quick start: install, observe, fix', href: '/documentation' },
      { label: 'Connect a Kubernetes cluster', href: '/documentation/install-cluster-agent' },
      { label: 'Add VM and host collectors', href: '/documentation/install-vm-collectors' },
      { label: 'Platform overview', href: '/documentation/platform-overview' },
    ],
  },
  {
    icon: LifeBuoy,
    title: 'Using AlertMend',
    articles: [
      { label: 'Handle alerts and incidents', href: '/documentation/alerts-incidents' },
      { label: 'Run AI root cause analysis', href: '/documentation/ai-rca' },
      { label: 'Build a remediation flow', href: '/documentation/remediation-flows' },
      { label: 'Integrations overview', href: '/documentation/integrations' },
    ],
  },
  {
    icon: MessageCircle,
    title: 'Talk to us',
    articles: [
      { label: 'Email hello@alertmend.io', href: 'mailto:hello@alertmend.io' },
      { label: 'Book a call with the team', href: calendlyUrl('help-center') },
      { label: 'Send a message', href: '/contact' },
      { label: 'Security and compliance questions', href: '/security' },
    ],
  },
]

export default function HelpCenterPage() {
  const baseDescription =
    'AlertMend help center: setup guides for clusters, VMs and integrations, root cause analysis and remediation flows, and direct access to the team.'
  const uniqueDescription = ensureUniqueMetaDescription(baseDescription, 'help', 'help')

  return (
    <>
      <SEO
        title="AlertMend Help Center: Guides and Support"
        description={uniqueDescription}
        keywords="AlertMend help, AlertMend support, documentation, setup guides"
        canonical="/help"
        breadcrumbData={{ items: [{ label: 'Help center' }] }}
      />

      <PageHero
        eyebrow="Help center"
        title="How can we help?"
        lede="Setup guides live in the documentation. For anything else, the engineers who build AlertMend answer directly."
        primary={{ label: 'Open documentation', href: '/documentation' }}
        secondary={{ label: 'Contact support', href: '/contact' }}
      />

      <Section>
        <CellGrid
          items={CATEGORIES.map((c) => ({
            icon: c.icon,
            title: c.title,
            children: (
              <ul className={styles.checks} style={{ gridTemplateColumns: '1fr', marginTop: 6 }}>
                {c.articles.map((a) => (
                  <li key={a.href}>
                    <ActionLink action={{ label: a.label, href: a.href }} variant="text" />
                  </li>
                ))}
              </ul>
            ),
          }))}
        />
        <p className={kit.meta}>Can't find what you need? Email hello@alertmend.io and include your workspace name.</p>
      </Section>

      <CtaBand
        title="Prefer to see it live?"
        lede="Book 30 minutes and we will walk through your setup with you."
        primary={{ label: 'Book a call', href: calendlyUrl('help-center-cta') }}
        secondary={{ label: 'Tutorials', href: '/tutorials' }}
      />
    </>
  )
}
