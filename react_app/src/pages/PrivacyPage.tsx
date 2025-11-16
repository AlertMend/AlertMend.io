import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import Breadcrumb from '../components/Breadcrumb'
import { ExternalLink } from 'lucide-react'
import { ensureUniqueMetaDescription } from '../utils/descriptionUtils'

export default function PrivacyPage() {
  // Google Docs Privacy Policy URL
  const privacyPolicyUrl = 'https://docs.google.com/document/d/1-0dRnRwBy7DGAh-7f4qDDjX6fPBVOifXCd2j3OEIjOI/edit?tab=t.0#heading=h.sndgwapwljbv'
  
  // Extract document ID for embed URL
  // For embedding, the doc needs to be published. Use this format:
  // https://docs.google.com/document/d/DOCUMENT_ID/preview
  const documentId = '1-0dRnRwBy7DGAh-7f4qDDjX6fPBVOifXCd2j3OEIjOI'
  const embedUrl = `https://docs.google.com/document/d/${documentId}/preview`
  
  // Generate unique meta description for privacy page
  const baseDescription = "AlertMend AI Privacy: Understand how AlertMend AI collects and protects your data. Review our policy and contact us for more information."
  const uniqueDescription = ensureUniqueMetaDescription(baseDescription, 'privacy', 'privacy')

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="AlertMend AI Privacy Policy: Data Protection in 2025"
        description={uniqueDescription}
        keywords="AlertMend privacy policy, data protection, privacy, GDPR, data security"
        canonical="/privacy"
        breadcrumbData={{
          items: [{ label: 'Privacy Policy' }]
        }}
      />
      <Navbar />
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

            {/* Embedded Google Doc */}
            <div className="bg-white rounded-3xl p-8 md:p-12 border-2 border-gray-200 shadow-lg mb-8">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-purple-950">Our Privacy Policy</h2>
                <a
                  href={privacyPolicyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold transition-colors"
                >
                  <span>Open in Google Docs</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
              
              <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50" style={{ minHeight: '600px' }}>
                <iframe
                  src={embedUrl}
                  className="w-full h-full"
                  style={{ minHeight: '600px', border: 'none' }}
                  title="AlertMend Privacy Policy"
                  allow="clipboard-read; clipboard-write"
                  onError={() => {
                    console.log('Iframe failed to load. Document may need to be published.')
                  }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-4 text-center">
                Note: If the document doesn't appear above, please ensure it's published in Google Docs, or click the link below to view it directly.
              </p>
            </div>

            {/* Fallback message and direct link */}
            <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200 text-center">
              <p className="text-purple-700 mb-4">
                If the document doesn't load, you can view it directly on Google Docs.
              </p>
              <a
                href={privacyPolicyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-800 to-purple-900 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-900 hover:to-purple-950 transition-all shadow-lg hover:shadow-xl"
              >
                <span>View Privacy Policy</span>
                <ExternalLink className="h-5 w-5" />
              </a>
            </div>

            {/* Contact Information */}
            <div className="mt-8 text-center">
              <p className="text-purple-700 mb-2">
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
      <Footer />
    </div>
  )
}

