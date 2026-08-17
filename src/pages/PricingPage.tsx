import SEO from '../components/SEO'
import Breadcrumb from '../components/Breadcrumb'
import { Check } from 'lucide-react'
import { ensureUniqueMetaDescription } from '../utils/descriptionUtils'

const SIGNUP_URL = 'https://app.alertmend.io/signup'
const DEMO_URL = 'https://calendly.com/hello-alertmend/30min'

export default function PricingPage() {
  
  // Generate unique meta description for pricing page
  const baseDescription = "AlertMend AI: AIOps pricing for Kubernetes, VMs, and ECS. Automate incident resolution, cut costs, and achieve zero downtime. Explore plans now!"
  const uniqueDescription = ensureUniqueMetaDescription(baseDescription, 'pricing', 'pricing')

  const plans = [
    {
      name: 'SRE/DevOps Playground',
      label: 'Free',
      description: 'For individuals trying out the product',
      features: [
        'Unlimited Remediation Flows',
        'Unlimited integrations',
        'AI-Generated RCA',
        'Support: Immediate',
      ],
      popular: false,
      buttonText: 'Get Started',
    },
    {
      name: 'Startups',
      label: '',
      description: '',
      features: [
        'Unlimited Remediation Flows',
        'Unlimited integrations',
        'AI-Generated RCA',
        'Support: Immediate',
      ],
      popular: false,
      buttonText: 'Get Started',
    },
    {
      name: 'Growth',
      label: '',
      description: 'For >10 VMs or Kubernetes <100 pods',
      features: [
        'Unlimited Remediation Flows',
        'Unlimited integrations',
        'AI-Generated RCA',
        'Support: Immediate',
      ],
      popular: true,
      buttonText: 'Get Started',
    },
    {
      name: 'Enterprise/Custom',
      label: '',
      description: '',
      features: [
        'Unlimited VMs & Kubernetes',
        'Unlimited Remediation Flows',
        'Unlimited integrations',
        'AI-Generated RCA',
        'On premise setup',
        'Support: Immediate',
      ],
      popular: false,
      buttonText: 'Book a demo',
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="AlertMend AI Pricing: Infrastructure Automation Plans in 2025"
        description={uniqueDescription}
        keywords="AlertMend pricing, AIOps pricing, infrastructure automation pricing, Kubernetes monitoring pricing, cost-effective AIOps"
        canonical="/pricing"
        breadcrumbData={{
          items: [{ label: 'Pricing' }]
        }}
      />
      <section className="pt-24 pb-20 md:pb-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden hero-dark">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <Breadcrumb items={[{ label: 'Pricing' }]} />
            </div>
            <div className="text-center mb-12 md:mb-16">
              <div className="inline-block px-5 py-2 bg-gradient-to-r from-brand-50 to-brand-100 text-brand-700 rounded-full text-sm font-bold mb-8 shadow-md border border-brand-200/50">
                Pricing Model
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand-900 mb-6 leading-tight">
                Pricing Model
              </h1>
              <p className="text-xl md:text-2xl text-brand-700 max-w-3xl mx-auto leading-relaxed mb-12">
                45 Days Free Trial
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-16 items-stretch">
              {plans.map((plan, index) => (
                <div
                  key={index}
                  className={`relative flex flex-col h-full bg-white rounded-xl p-8 border-2 transition-all duration-300 hover:shadow-xl ${
                    plan.popular
                      ? 'border-brand-400 shadow-xl lg:scale-105'
                      : 'border-gray-200 shadow-lg hover:border-brand-200'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-brand-600 to-brand-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                        Recommended
                      </div>
                    </div>
                  )}
                  {/* Header block reserves consistent vertical slots for the
                      label badge and description so titles + features lists
                      align across cards whether or not those fields are
                      populated.  The description slot is a *fixed* height
                      (not min) sized for a 2-line wrap so an empty
                      description and a 2-line description take the same
                      vertical space. */}
                  <div className="text-center mb-6">
                    <div className="h-7 mb-3 flex items-center justify-center">
                      {plan.label && (
                        <span className="inline-block px-3 py-1 bg-brand-50 text-brand-700 rounded-full text-xs font-bold border border-brand-200">
                          {plan.label}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">{plan.name}</h3>
                    <p className="text-gray-600 text-sm font-medium h-[48px] flex items-center justify-center leading-tight">
                      {plan.description || '\u00A0'}
                    </p>
                  </div>
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-brand-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-sm font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => {
                      const url = plan.buttonText === 'Book a demo' ? DEMO_URL : SIGNUP_URL
                      window.open(url, '_blank', 'noopener,noreferrer')
                    }}
                    className={`w-full mt-auto py-3 rounded-xl font-bold text-sm transition-all ${
                      plan.popular
                        ? 'bg-gradient-to-r from-brand-800 to-brand-900 !text-white hover:from-brand-900 hover:to-brand-900 shadow-lg hover:shadow-xl'
                        : 'bg-gray-100 text-brand-900 hover:bg-gray-200 border border-gray-200'
                    }`}
                  >
                    {plan.buttonText}
                  </button>
                </div>
              ))}
            </div>

          </div>
        </section>
    </div>
  )
}

