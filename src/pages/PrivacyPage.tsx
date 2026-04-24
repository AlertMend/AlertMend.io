import SEO from '../components/SEO'
import Breadcrumb from '../components/Breadcrumb'
import { ExternalLink, FileText, Mail } from 'lucide-react'
import { ensureUniqueMetaDescription } from '../utils/descriptionUtils'

// To embed the live Google Doc inline, set ENABLE_EMBED to true AFTER
// publishing the doc via File > Share > Publish to web in Google Docs.
// Until then, /preview and /pub URLs are blocked by Google's X-Frame-Options
// for un-published docs and render as a "This content is blocked" panel,
// so we default to a clean fallback card with a prominent external link.
const ENABLE_EMBED = false

export default function PrivacyPage() {
  const documentId = '1-0dRnRwBy7DGAh-7f4qDDjX6fPBVOifXCd2j3OEIjOI'
  const privacyPolicyUrl = `https://docs.google.com/document/d/${documentId}/edit?tab=t.0#heading=h.sndgwapwljbv`
  const embedUrl = `https://docs.google.com/document/d/${documentId}/pub?embedded=true`
  
  // Generate unique meta description for privacy page
  const baseDescription = "AlertMend AI Privacy: Understand how AlertMend AI collects and protects your data. Review our policy and contact us for more information."
  const uniqueDescription = ensureUniqueMetaDescription(baseDescription, 'privacy', 'privacy')

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="AlertMend AI Privacy Policy 2025: Data Protection Explained"
        description={uniqueDescription}
        keywords="AlertMend privacy policy, data protection, privacy, GDPR, data security"
        canonical="/privacy"
        breadcrumbData={{
          items: [{ label: 'Privacy Policy' }]
        }}
      />
      <section className="pt-24 pb-20 md:pb-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-br from-purple-50/30 via-white to-blue-50/30">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <Breadcrumb items={[{ label: 'Privacy Policy' }]} />
            </div>
            <div className="text-center mb-12 md:mb-16">
              <div className="inline-block px-5 py-2 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 rounded-full text-sm font-bold mb-8 shadow-md border border-purple-200/50">
                Privacy
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-purple-950 mb-6 leading-tight">
                Privacy Policy
              </h1>
              <p className="text-xl md:text-2xl text-purple-700 max-w-3xl mx-auto leading-relaxed mb-12">Your privacy is important to us</p>
            </div>

            {!ENABLE_EMBED ? (
              /* Clean fallback card. Used while the Google Doc has not been
                 "Published to web" - in that state the /preview and /pub
                 URLs both render Google's "This content is blocked" panel,
                 which looks broken. */
              <div className="bg-white rounded-3xl p-10 md:p-14 border-2 border-purple-100 shadow-lg mb-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 mb-6">
                  <FileText className="h-8 w-8" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-purple-950 mb-3">
                  Our Privacy Policy
                </h2>
                <p className="text-base md:text-lg text-gray-600 max-w-xl mx-auto mb-8 leading-relaxed">
                  The full AlertMend Privacy Policy is maintained as a living document. Open
                  it in Google Docs to read the latest version.
                </p>
                <a
                  href={privacyPolicyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-800 to-purple-900 !text-white px-7 py-3.5 rounded-xl font-semibold hover:from-purple-900 hover:to-purple-950 transition-all shadow-lg hover:shadow-xl"
                  style={{ color: '#ffffff' }}
                >
                  <span className="text-white">Read the Privacy Policy</span>
                  <ExternalLink className="h-5 w-5 text-white" />
                </a>
              </div>
            ) : (
              /* Embed (only renders when the doc has been published to web) */
              <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-gray-200 shadow-lg mb-8">
                <div className="mb-5 flex items-center justify-between flex-wrap gap-3">
                  <h2 className="text-xl md:text-2xl font-bold text-purple-950">
                    Our Privacy Policy
                  </h2>
                  <a
                    href={privacyPolicyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold transition-colors text-sm"
                  >
                    <span>Open in Google Docs</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
                <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                  <iframe
                    src={embedUrl}
                    title="AlertMend Privacy Policy"
                    className="w-full block"
                    style={{ height: '80vh', minHeight: '720px', border: 'none' }}
                  />
                </div>
              </div>
            )}

            {/* Contact Information */}
            <div className="mt-8 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-50 text-purple-600 mb-3">
                <Mail className="h-6 w-6" />
              </div>
              <p className="text-purple-900 font-semibold mb-2">
                Questions about our Privacy Policy?
              </p>
              <a
                href="mailto:privacy@alertmend.io"
                className="text-purple-600 hover:text-purple-700 font-semibold"
              >
                privacy@alertmend.io
              </a>
            </div>
          </div>
        </section>
    </div>
  )
}

