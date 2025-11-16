import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import Breadcrumb from '../components/Breadcrumb'
import { Shield, Lock, Eye, CheckCircle2 } from 'lucide-react'
import { ensureUniqueMetaDescription } from '../utils/descriptionUtils'

export default function SecurityPage() {
  const features = [
    {
      icon: Lock,
      title: 'Encryption',
      description: 'All data is encrypted in transit and at rest using industry-standard AES-256 encryption.',
    },
    {
      icon: Shield,
      title: 'Access Controls',
      description: 'Role-based access control (RBAC) ensures only authorized users can access your infrastructure data.',
    },
    {
      icon: Eye,
      title: 'Audit Logging',
      description: 'Comprehensive audit logs track all actions and changes for security and compliance.',
    },
    {
      icon: CheckCircle2,
      title: 'Compliance',
      description: 'We maintain SOC 2 Type II, ISO 27001, and GDPR compliance certifications.',
    },
  ]
  
  // Generate unique meta description for security page
  const baseDescription = "AlertMend AI: Secure your infrastructure with our AIOps platform. Benefit from compliance certifications and advanced security. Protect your data."
  const uniqueDescription = ensureUniqueMetaDescription(baseDescription, 'security', 'security')

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Security & Compliance | AlertMend AI"
        description={uniqueDescription}
        keywords="AlertMend security, enterprise security, SOC 2, ISO 27001, GDPR compliance, data encryption, infrastructure security, AIOps security"
        canonical="/security"
      />
      <Navbar />
      <section className="pt-24 pb-20 md:pb-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-br from-purple-50/30 via-white to-blue-50/30">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <Breadcrumb items={[{ label: 'Security' }]} />
            </div>
            <div className="text-center mb-12 md:mb-16">
              <div className="inline-block px-5 py-2 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 rounded-full text-sm font-bold mb-8 shadow-md border border-purple-200/50">
                Security
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-purple-950 mb-6 leading-tight">
                Security & Compliance
              </h1>
              <p className="text-xl md:text-2xl text-purple-700 max-w-3xl mx-auto leading-relaxed mb-12">
                Your infrastructure data is protected with enterprise-grade security measures and compliance certifications.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div
                    key={index}
                    className="bg-white rounded-3xl p-8 border-2 border-gray-200 hover:border-purple-400 hover:shadow-2xl transition-all duration-300 text-center"
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 mb-6">
                      <Icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold text-purple-950 mb-4">{feature.title}</h3>
                    <p className="text-purple-700 font-medium">{feature.description}</p>
                  </div>
                )
              })}
            </div>

            <div className="bg-white rounded-3xl p-12 border-2 border-gray-200">
              <h2 className="text-3xl font-bold text-purple-950 mb-6">Security Practices</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-purple-950 mb-4">Infrastructure Security</h3>
                  <ul className="space-y-2 text-purple-700">
                    <li>• Multi-factor authentication (MFA) required</li>
                    <li>• Regular security audits and penetration testing</li>
                    <li>• Automated vulnerability scanning</li>
                    <li>• Secure API endpoints with rate limiting</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-purple-950 mb-4">Data Protection</h3>
                  <ul className="space-y-2 text-purple-700">
                    <li>• Data encryption at rest and in transit</li>
                    <li>• Regular automated backups</li>
                    <li>• Data retention policies</li>
                    <li>• GDPR-compliant data handling</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      <Footer />
    </div>
  )
}

