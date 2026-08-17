import SEO from '../components/SEO'
import Breadcrumb from '../components/Breadcrumb'
import { Users, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ensureUniqueMetaDescription } from '../utils/descriptionUtils'

export default function PartnersPage() {
  const navigate = useNavigate()
  const partnerTypes = [
    {
      icon: Users,
      title: 'Technology Partners',
      description: 'Integrate AlertMend with your platform and offer enhanced value to your customers.',
    },
    {
      icon: Users,
      title: 'Reseller Partners',
      description: 'Sell AlertMend to your customers and earn competitive commissions.',
    },
    {
      icon: Users,
      title: 'System Integrators',
      description: 'Help customers implement and optimize AlertMend in their infrastructure.',
    },
  ]
  
  // Generate unique meta description for partners page
  const baseDescription = "Partner with AlertMend AI to help organizations achieve autonomous infrastructure operations. Join our ecosystem of technology partners, resellers, and system integrators."
  const uniqueDescription = ensureUniqueMetaDescription(baseDescription, 'partners', 'partners')

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Partner with AlertMend AI: Improve Infrastructure Management"
        description={uniqueDescription}
        canonical="/partners"
      />
      <section className="pt-24 pb-20 md:pb-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden hero-dark">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <Breadcrumb items={[{ label: 'Partners' }]} />
            </div>
            <div className="text-center mb-12 md:mb-16">
              <div className="inline-block px-5 py-2 bg-gradient-to-r from-brand-50 to-brand-100 text-brand-700 rounded-full text-sm font-bold mb-8 shadow-md border border-brand-200/50">
                Partners
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand-900 mb-6 leading-tight">
                Partner With Us
              </h1>
              <p className="text-xl md:text-2xl text-brand-700 max-w-3xl mx-auto leading-relaxed mb-12">
                Join our partner ecosystem and help organizations achieve autonomous infrastructure operations.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {partnerTypes.map((type, index) => {
                const Icon = type.icon
                return (
                  <div
                    key={index}
                    className="bg-white rounded-3xl p-10 border-2 border-gray-200 hover:border-brand-400 hover:shadow-2xl transition-all duration-300 text-center"
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 mb-6">
                      <Icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-brand-900 mb-4">{type.title}</h3>
                    <p className="text-brand-700 font-medium mb-6">{type.description}</p>
                    <button
                      onClick={() => navigate('/contact')}
                      className="text-brand-600 hover:text-brand-700 font-semibold text-sm flex items-center justify-center gap-2"
                    >
                      Learn More
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                )
              })}
            </div>

            <div className="text-center bg-brand-50 rounded-3xl p-12 border-2 border-brand-200">
              <h2 className="text-3xl font-bold text-brand-900 mb-4">Ready to Partner?</h2>
              <p className="text-brand-700 mb-6 font-medium">
                Contact our partnerships team to discuss how we can work together.
              </p>
              <button
                onClick={() => navigate('/contact')}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-800 to-brand-900 text-white px-8 py-4 rounded-xl font-semibold hover:from-brand-900 hover:to-brand-900 transition-all shadow-lg hover:shadow-xl"
              >
                Contact Partnerships
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </section>
    </div>
  )
}

