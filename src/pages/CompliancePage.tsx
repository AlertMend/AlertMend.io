import SEO from '../components/SEO'
import { PageHero, Section, CtaBand } from '../components/enterprise/PageKit'
import kit from '../components/enterprise/PageKit.module.css'
import { ensureUniqueMetaDescription } from '../utils/descriptionUtils'
import { calendlyUrl } from '../lib/calendly'

// TODO(founders): confirm HIPAA before listing it. Hidden until a documented programme exists.
const FRAMEWORKS = [
  {
    name: 'SOC 2 Type II',
    scope: 'Security, availability and confidentiality controls.',
    status: 'In progress',
    ok: false,
  },
  {
    name: 'ISO 27001',
    scope: 'Information security management system.',
    status: 'In progress',
    ok: false,
  },
  {
    name: 'GDPR',
    scope: 'EU General Data Protection Regulation practices for personal data.',
    status: 'Aligned',
    ok: true,
  },
]

export default function CompliancePage() {
  const baseDescription =
    'AlertMend compliance status: SOC 2 Type II and ISO 27001 in progress, GDPR aligned. Contact us for the current control set.'
  const uniqueDescription = ensureUniqueMetaDescription(baseDescription, 'compliance', 'compliance')

  return (
    <>
      <SEO
        title="Compliance at AlertMend: SOC 2, ISO 27001 and GDPR"
        description={uniqueDescription}
        keywords="AlertMend compliance, SOC 2 Type II, ISO 27001, GDPR"
        canonical="/compliance"
        breadcrumbData={{ items: [{ label: 'Compliance' }] }}
      />

      <PageHero
        eyebrow="Compliance"
        title="Where we stand, stated plainly."
        lede="The frameworks we follow and their current status. We will share the detailed control set with your security or risk team."
        secondary={{ label: 'Trust center', href: '/trust' }}
        primary={{ label: 'Request the control set', href: calendlyUrl('compliance-page') }}
      />

      <Section title="Framework status">
        <table className={kit.table}>
          <thead>
            <tr>
              <th scope="col">Framework</th>
              <th scope="col">Scope</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {FRAMEWORKS.map((f) => (
              <tr key={f.name}>
                <td>{f.name}</td>
                <td>{f.scope}</td>
                <td>
                  <span className={`${kit.status} ${f.ok ? kit.statusOk : ''}`}>{f.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <CtaBand
        title="Need compliance details for a review?"
        lede="Tell us which framework or questionnaire you are working through."
        primary={{ label: 'Contact us', href: '/contact' }}
        secondary={{ label: 'Security practices', href: '/security' }}
      />
    </>
  )
}
