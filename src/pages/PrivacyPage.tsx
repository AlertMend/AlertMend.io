import SEO from '../components/SEO'
import { PageHero, Section, ActionLink } from '../components/enterprise/PageKit'
import kit from '../components/enterprise/PageKit.module.css'
import { ensureUniqueMetaDescription } from '../utils/descriptionUtils'

// The policy is maintained as a Google Doc. To embed it inline, publish the
// doc (File > Share > Publish to web) and render the /pub?embedded=true URL
// in an iframe; unpublished docs are blocked by Google's X-Frame-Options.
const DOCUMENT_ID = '1-0dRnRwBy7DGAh-7f4qDDjX6fPBVOifXCd2j3OEIjOI'
const PRIVACY_POLICY_URL = `https://docs.google.com/document/d/${DOCUMENT_ID}/edit?tab=t.0#heading=h.sndgwapwljbv`

export default function PrivacyPage() {
  const baseDescription =
    'The AlertMend privacy policy: how we collect, use and protect personal data, and how to contact us about privacy.'
  const uniqueDescription = ensureUniqueMetaDescription(baseDescription, 'privacy', 'privacy')

  return (
    <>
      <SEO
        title="AlertMend Privacy Policy: How We Protect Your Data"
        description={uniqueDescription}
        keywords="AlertMend privacy policy, data protection, GDPR"
        canonical="/privacy"
        breadcrumbData={{ items: [{ label: 'Privacy policy' }] }}
      />

      <PageHero
        eyebrow="Legal"
        title="Privacy policy"
        lede="How AlertMend collects, uses and protects personal data. The full policy is kept as a living document so it always shows the current version."
        primary={{ label: 'Read the privacy policy', href: PRIVACY_POLICY_URL }}
      />

      <Section>
        <div className={kit.legal}>
          <h2>Questions</h2>
          <p>
            Write to <a href="mailto:privacy@alertmend.io">privacy@alertmend.io</a> for any question about this policy
            or to exercise your data rights.
          </p>
          <p>
            <ActionLink action={{ label: 'Trust center', href: '/trust' }} variant="text" />
          </p>
        </div>
      </Section>
    </>
  )
}
