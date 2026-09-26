import { Plug, Briefcase, Wrench } from 'lucide-react'
import SEO from '../components/SEO'
import { PageHero, Section, CellGrid, CtaBand } from '../components/enterprise/PageKit'
import { ensureUniqueMetaDescription } from '../utils/descriptionUtils'
import { calendlyUrl } from '../lib/calendly'

const TYPES = [
  {
    icon: Plug,
    title: 'Technology partners',
    body: 'Integrate your warehouse, BI tool, pipeline or monitoring product with AlertMend so joint customers see one timeline.',
    action: { label: 'Discuss an integration', href: '/contact' },
  },
  {
    icon: Briefcase,
    title: 'Resellers',
    body: 'Offer AlertMend to your customers in regulated and enterprise markets, with support from our team.',
    action: { label: 'Talk to partnerships', href: '/contact' },
  },
  {
    icon: Wrench,
    title: 'System integrators',
    body: 'Deliver data governance, data quality and platform reliability programmes with AlertMend as the control layer.',
    action: { label: 'Talk to partnerships', href: '/contact' },
  },
]

export default function PartnersPage() {
  const baseDescription =
    'Partner with AlertMend: technology partners, resellers and system integrators delivering data observability, governance and infrastructure reliability.'
  const uniqueDescription = ensureUniqueMetaDescription(baseDescription, 'partners', 'partners')

  return (
    <>
      <SEO
        title="Partner with AlertMend"
        description={uniqueDescription}
        canonical="/partners"
        breadcrumbData={{ items: [{ label: 'Partners' }] }}
      />

      <PageHero
        eyebrow="Partners"
        title="Build, sell and deliver with AlertMend."
        lede="We work with technology vendors, resellers and integrators who serve data and platform teams in demanding industries."
        primary={{ label: 'Contact partnerships', href: '/contact' }}
        secondary={{ label: 'See integrations', href: '/integrations' }}
      />

      <Section eyebrow="Programmes" title="Three ways to partner">
        <CellGrid items={TYPES} />
      </Section>

      <CtaBand
        title="Let's talk about working together."
        lede="Tell us about your customers and where AlertMend fits. We will set up a call with the founders."
        primary={{ label: 'Book a call', href: calendlyUrl('partners-page') }}
        secondary={{ label: 'Send a message', href: '/contact' }}
      />
    </>
  )
}
