import { Github, BookOpen, MessageSquare } from 'lucide-react'
import SEO from '../components/SEO'
import { PageHero, Section, CellGrid, CtaBand } from '../components/enterprise/PageKit'
import { ensureUniqueMetaDescription } from '../utils/descriptionUtils'

const CHANNELS = [
  {
    icon: Github,
    title: 'GitHub',
    body: 'Follow what we publish and open source.',
    action: { label: 'Open GitHub', href: 'https://github.com/AlertMend' },
  },
  {
    icon: BookOpen,
    title: 'Blog and guides',
    body: 'Practical guides on data quality, Kubernetes, observability and automated fixes.',
    action: { label: 'Read the blog', href: '/blog' },
  },
  {
    icon: MessageSquare,
    title: 'Talk to the team',
    body: 'Questions, feedback or an integration you need. Write to us directly.',
    action: { label: 'Email the team', href: 'mailto:hello@alertmend.io' },
  },
]

export default function CommunityPage() {
  const baseDescription =
    'Follow AlertMend on GitHub, read practical guides on data quality, Kubernetes and observability, and talk directly with the team.'
  const uniqueDescription = ensureUniqueMetaDescription(baseDescription, 'community', 'community')

  return (
    <>
      <SEO
        title="AlertMend Community: GitHub, Guides and the Team"
        description={uniqueDescription}
        keywords="AlertMend community, GitHub, data quality guides, Kubernetes guides"
        canonical="/community"
        breadcrumbData={{ items: [{ label: 'Community' }] }}
      />

      <PageHero
        eyebrow="Community"
        title="Follow what we ship and tell us what you need."
        lede="Guides from the team, our public code, and a direct line to the engineers building AlertMend."
      />

      <Section>
        <CellGrid items={CHANNELS} />
      </Section>

      <CtaBand
        title="Have an integration request?"
        lede="Tell us which warehouse, BI tool or platform you need next."
        primary={{ label: 'Send a request', href: '/contact' }}
        secondary={{ label: 'See integrations', href: '/integrations' }}
      />
    </>
  )
}
