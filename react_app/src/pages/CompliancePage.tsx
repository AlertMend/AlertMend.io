import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import Breadcrumb from '../components/Breadcrumb'
import { Award, Clock } from 'lucide-react'
import { ensureUniqueMetaDescription } from '../utils/descriptionUtils'

export default function CompliancePage() {
  const certifications = [
    { name: 'SOC 2 Type II', description: 'Following best industry practices for security, availability, and confidentiality. Certification coming soon.', comingSoon: true },
    { name: 'ISO 27001', description: 'Adhering to information security management system best practices. Certification in progress.', comingSoon: true },
    { name: 'GDPR', description: 'Following EU General Data Protection Regulation best practices and compliance standards.', comingSoon: false },
    { name: 'HIPAA', description: 'Following healthcare data protection best practices. Available on request.', comingSoon: false },
  ]
  
  // Generate unique meta description for compliance page
  const baseDescription = "AlertMend AI ensures compliance with SOC 2, ISO 27001, GDPR, and HIPAA. Contact our team for more information on our security practices."
  const uniqueDescription = ensureUniqueMetaDescription(baseDescription, 'compliance', 'compliance')

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="AlertMend AI: Compliance & Security in 2025"
        description={uniqueDescription}
        keywords="AlertMend compliance, SOC 2 Type II, ISO 27001, GDPR, HIPAA, compliance certifications, infrastructure compliance, AIOps compliance"
        canonical="/compliance"
      />
      <Navbar />
      <section className="pt-24 pb-20 md:pb-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-br from-purple-50/30 via-white to-blue-50/30">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <Breadcrumb items={[{ label: 'Compliance' }]} />
            </div>
            <div className="text-center mb-12 md:mb-16">
              <div className="inline-block px-5 py-2 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 rounded-full text-sm font-bold mb-8 shadow-md border border-purple-200/50">
                Compliance
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-purple-950 mb-6 leading-tight">
                Compliance & Certifications
              </h1>
              <p className="text-xl md:text-2xl text-purple-700 max-w-3xl mx-auto leading-relaxed mb-12">
                AlertMend follows industry best practices and maintains the highest standards of compliance and security to protect your infrastructure data.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {certifications.map((cert, index) => (
                <div
                  key={index}
                  className="bg-white rounded-3xl p-10 border-2 border-gray-200 hover:border-purple-400 hover:shadow-2xl transition-all duration-300 relative"
                >
                  {cert.comingSoon && (
                    <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                      <Clock className="h-3 w-3" />
                      <span>Coming Soon</span>
                    </div>
                  )}
                  <div className="flex items-start gap-4">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex-shrink-0">
                      <Award className="h-7 w-7" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-purple-950 mb-3">{cert.name}</h3>
                      <p className="text-purple-700 font-medium">{cert.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-purple-50 rounded-3xl p-12 border-2 border-purple-200">
              <h2 className="text-3xl font-bold text-purple-950 mb-6">Request Compliance Information</h2>
              <p className="text-purple-700 mb-6 font-medium">
                Need specific compliance information or have questions about our security practices? Our compliance team is here to help.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-800 to-purple-900 text-white px-8 py-4 rounded-xl font-bold hover:from-purple-900 hover:to-purple-950 transition-all shadow-lg hover:shadow-xl"
              >
                Contact Compliance Team
              </a>
            </div>
          </div>
        </section>
      <Footer />
    </div>
  )
}

