import SEO from '../components/SEO'
import { PageHero, Section } from '../components/enterprise/PageKit'
import kit from '../components/enterprise/PageKit.module.css'
import { ensureUniqueMetaDescription } from '../utils/descriptionUtils'

// TODO(founders/legal): confirm the "last updated" date and whether these
// terms are current; enterprise customers are covered by their own agreement.
const LAST_UPDATED = 'March 2024'

export default function TermsPage() {
  const baseDescription =
    'AlertMend terms of service: use licence, service availability, limitation of liability and how to contact us about these terms.'
  const uniqueDescription = ensureUniqueMetaDescription(baseDescription, 'terms', 'terms')

  return (
    <>
      <SEO
        title="AlertMend Terms of Service"
        description={uniqueDescription}
        keywords="AlertMend terms of service, terms and conditions"
        canonical="/terms"
        breadcrumbData={{ items: [{ label: 'Terms of service' }] }}
      />

      <PageHero eyebrow="Legal" title="Terms of service" meta={`Last updated: ${LAST_UPDATED}`} />

      <Section>
        <div className={kit.legal}>
          <h2>Agreement to terms</h2>
          <p>
            By accessing or using AlertMend's services, you agree to be bound by these Terms of Service and all
            applicable laws and regulations.
          </p>

          <h2>Use licence</h2>
          <p>Permission is granted to use AlertMend for your internal business operations. This licence does not include:</p>
          <ul>
            <li>Resale or commercial use of the service</li>
            <li>Modification or reverse engineering of the platform</li>
            <li>Use of the service for any illegal purpose</li>
          </ul>

          <h2>Service availability</h2>
          <p>
            We strive to maintain 99.9% uptime but do not guarantee uninterrupted access. We reserve the right to
            modify or discontinue services with reasonable notice.
          </p>

          <h2>Limitation of liability</h2>
          <p>
            AlertMend shall not be liable for any indirect, incidental or consequential damages arising from the use of
            our services.
          </p>

          <h2>Contact</h2>
          <p>
            For questions about these terms, contact <a href="mailto:legal@alertmend.io">legal@alertmend.io</a>.
          </p>
        </div>
      </Section>
    </>
  )
}
