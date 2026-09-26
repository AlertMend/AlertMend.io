import { Database, Activity, Stethoscope } from 'lucide-react'
import SEO from '../components/SEO'
import { PageHero, Section, CellGrid, CtaBand } from '../components/enterprise/PageKit'
import { ensureUniqueMetaDescription } from '../utils/descriptionUtils'
import { calendlyUrl } from '../lib/calendly'

// No public webinar calendar yet: offer live 1:1 walkthroughs instead of
// dated events. Add real sessions here (with recording links) when they exist.
const SESSIONS = [
  {
    icon: Database,
    title: 'Data quality walkthrough',
    body: 'A sample banking policy turned into live checks, with the failed job and the affected Power BI reports.',
    slug: 'data-quality',
  },
  {
    icon: Activity,
    title: 'Infrastructure walkthrough',
    body: 'From alert to evidence-backed root cause to a fix approved in Slack, on a live environment.',
    slug: 'infrastructure',
  },
  {
    icon: Stethoscope,
    title: 'Free infrastructure health check',
    body: 'A read-only scan of your cluster. You leave with a prioritised list of what is about to break.',
    slug: 'health-check',
  },
]

export default function WebinarsPage() {
  const baseDescription =
    'Book a live 30-minute AlertMend walkthrough: data quality from your policy, infrastructure root cause and approved fixes, or a free infrastructure health check.'
  const uniqueDescription = ensureUniqueMetaDescription(baseDescription, 'webinars', 'webinars')

  return (
    <>
      <SEO
        title="Live Walkthroughs | AlertMend"
        description={uniqueDescription}
        keywords="AlertMend walkthrough, data quality demo, Kubernetes health check, infrastructure demo"
        canonical="/webinars"
        breadcrumbData={{ items: [{ label: 'Live walkthroughs' }] }}
      />

      <PageHero
        eyebrow="Live sessions"
        title="Live walkthroughs, on your schedule."
        lede="Pick a session and a time that suits you. Each one is 30 minutes with the team that builds AlertMend."
      />

      <Section>
        <CellGrid
          items={SESSIONS.map((s) => ({
            icon: s.icon,
            title: s.title,
            body: s.body,
            tag: '30 min · live',
            action: { label: 'Book a time', href: calendlyUrl(`walkthrough-${s.slug}`) },
          }))}
        />
      </Section>

      <CtaBand
        title="Not sure which session fits?"
        lede="Tell us what you are trying to solve and we will tailor the walkthrough."
        primary={{ label: 'Book a demo', href: calendlyUrl('webinars-page') }}
        secondary={{ label: 'Contact us', href: '/contact' }}
      />
    </>
  )
}
