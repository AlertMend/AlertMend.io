import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import Breadcrumb from '../components/Breadcrumb'
import { ensureUniqueMetaDescription } from '../utils/descriptionUtils'

export default function TermsPage() {
  // Generate unique meta description for terms page
  const baseDescription = "AlertMend AI Terms: Review the terms of service for AlertMend AI's AIOps platform. Understand your rights and responsibilities."
  const uniqueDescription = ensureUniqueMetaDescription(baseDescription, 'terms', 'terms')
  
  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="AlertMend AI Terms of Service for 2025"
        description={uniqueDescription}
        keywords="AlertMend terms of service, terms and conditions, AIOps terms, service agreement, legal terms"
        canonical="/terms"
      />
      <Navbar />
      <section className="pt-24 pb-20 md:pb-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-br from-purple-50/30 via-white to-blue-50/30">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <Breadcrumb items={[{ label: 'Terms of Service' }]} />
            </div>
            <div className="text-center mb-12 md:mb-16">
              <div className="inline-block px-5 py-2 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 rounded-full text-sm font-bold mb-8 shadow-md border border-purple-200/50">
                Legal
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-purple-950 mb-6 leading-tight">
                Terms of Service
              </h1>
              <p className="text-xl md:text-2xl text-purple-700 max-w-3xl mx-auto leading-relaxed mb-12">Last updated: March 2024</p>
            </div>

            <div className="prose prose-lg max-w-none bg-white rounded-3xl p-12 border-2 border-gray-200">
              <h2 className="text-2xl font-bold text-purple-950 mb-4">Agreement to Terms</h2>
              <p className="text-purple-700 mb-6 leading-relaxed">
                By accessing or using AlertMend AI's services, you agree to be bound by these Terms of Service and all applicable laws and regulations.
              </p>

              <h2 className="text-2xl font-bold text-purple-950 mb-4 mt-8">Use License</h2>
              <p className="text-purple-700 mb-6 leading-relaxed">
                Permission is granted to use AlertMend AI for your internal business operations. This license does not include:
              </p>
              <ul className="list-disc pl-6 text-purple-700 mb-6 space-y-2">
                <li>Resale or commercial use of the service</li>
                <li>Modification or reverse engineering of the platform</li>
                <li>Use of the service for any illegal purpose</li>
              </ul>

              <h2 className="text-2xl font-bold text-purple-950 mb-4 mt-8">Service Availability</h2>
              <p className="text-purple-700 mb-6 leading-relaxed">
                We strive to maintain 99.9% uptime but do not guarantee uninterrupted access. We reserve the right to modify or discontinue services with reasonable notice.
              </p>

              <h2 className="text-2xl font-bold text-purple-950 mb-4 mt-8">Limitation of Liability</h2>
              <p className="text-purple-700 mb-6 leading-relaxed">
                AlertMend AI shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services.
              </p>

              <h2 className="text-2xl font-bold text-purple-950 mb-4 mt-8">Contact Information</h2>
              <p className="text-purple-700 mb-6 leading-relaxed">
                For questions about these Terms, contact us at legal@alertmend.io
              </p>
            </div>
          </div>
        </section>
      <Footer />
    </div>
  )
}

