import SEO from '../components/SEO'
import Breadcrumb from '../components/Breadcrumb'
import { Check } from 'lucide-react'
import { ensureUniqueMetaDescription } from '../utils/descriptionUtils'

const SIGNUP_URL = 'https://app.alertmend.io/signup'
const DEMO_URL = 'https://calendly.com/hello-alertmend/30min'

export default function PricingPage() {
  
  const baseDescription = "AlertMend pricing for Kubernetes, VMs, and cloud ops. Observe, run AI RCA, and approve remediations. Compare plans and book a demo."
  const uniqueDescription = ensureUniqueMetaDescription(baseDescription, 'pricing', 'pricing')

  const plans = [
    {
      name: 'SRE/DevOps Playground',
      label: 'Free',
      description: 'For individuals trying out the product',
      features: [
        'Unlimited RF · Remediation',
        'Unlimited integrations',
        'AI RCA',
        'Support: Immediate',
      ],
      popular: false,
      buttonText: 'Start free',
    },
    {
      name: 'Startups',
      label: '',
      description: '',
      features: [
        'Unlimited RF · Remediation',
        'Unlimited integrations',
        'AI RCA',
        'Support: Immediate',
      ],
      popular: false,
      buttonText: 'Book a demo',
    },
    {
      name: 'Growth',
      label: '',
      description: 'For >10 VMs or Kubernetes <100 pods',
      features: [
        'Unlimited RF · Remediation',
        'Unlimited integrations',
        'AI RCA',
        'Support: Immediate',
      ],
      popular: true,
      buttonText: 'Book a demo',
    },
    {
      name: 'Enterprise/Custom',
      label: '',
      description: '',
      features: [
        'Unlimited VMs & Kubernetes',
        'Unlimited RF · Remediation',
        'Unlimited integrations',
        'AI RCA',
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
        title="AlertMend Pricing: Plans for production ops"
        description={uniqueDescription}
        keywords="AlertMend pricing, AIOps pricing, infrastructure automation pricing, Kubernetes monitoring pricing"
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
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-brand-500/10 border border-brand-400/30 text-brand-300 text-[11px] font-bold uppercase tracking-[0.16em] mb-6">
                Choose your plan
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand-900 mb-6 leading-tight">
                Pricing
              </h1>
              <p className="text-xl md:text-2xl text-brand-700 max-w-3xl mx-auto leading-relaxed">
                Free playground to start. Paid plans when you are ready for production.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-16 items-stretch">
              {plans.map((plan, index) => (
                <div
                  key={index}
                  className={`flex flex-col h-full bg-white rounded-lg p-8 border-2 transition-shadow duration-300 hover:shadow-xl ${
                    plan.popular
                      ? 'border-brand-500 shadow-xl'
                      : 'border-zinc-200 shadow-lg'
                  }`}
                >
                  {/* From `md` up the cards sit side by side, so the badge row,
                      title and description get reserved vertical slots and
                      every feature list starts on the same baseline regardless
                      of which fields a tier populates or whether its title
                      wraps. The description slot is a *fixed* height (not min)
                      so an empty and a 2-line description occupy the same
                      space. Below `md` the cards are stacked, where reserving
                      those slots would only add dead space, so the header
                      flows at its natural height instead. */}
                  <div className="text-center mb-6">
                    <div
                      className={`items-center justify-center ${
                        plan.popular || plan.label
                          ? 'flex h-7 mb-3'
                          : 'hidden md:flex md:h-7 md:mb-3'
                      }`}
                    >
                      {plan.popular ? (
                        <span className="inline-block px-3 py-1 bg-brand-600 text-white rounded-full text-[11px] font-bold uppercase tracking-wider">
                          Recommended
                        </span>
                      ) : plan.label ? (
                        <span className="inline-block px-3 py-1 bg-brand-50 text-brand-700 rounded-full text-xs font-bold border border-brand-200">
                          {plan.label}
                        </span>
                      ) : null}
                    </div>
                    <h3 className="text-xl font-bold text-zinc-900 mb-3 leading-tight md:flex md:items-center md:justify-center md:min-h-[50px]">
                      {plan.name}
                    </h3>
                    <p
                      aria-hidden={plan.description ? undefined : true}
                      className={`text-zinc-500 text-sm font-medium leading-tight md:flex md:items-center md:justify-center md:h-[48px] ${
                        plan.description ? '' : 'hidden'
                      }`}
                    >
                      {plan.description || '\u00A0'}
                    </p>
                  </div>
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-brand-600 flex-shrink-0 mt-0.5" />
                        <span className="text-zinc-700 text-sm font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {/* `src/index.css` has `.hero-dark [class*="text-zinc-9"] { color: #fff }`
                      at specificity (0,2,0), which outranks any single-class
                      Tailwind color utility (0,1,0). Inside these white cards
                      that would paint the label white on a near-white fill, so
                      the label color needs the `!` modifier to survive. */}
                  <button
                    onClick={() => {
                      const url = plan.buttonText === 'Book a demo' ? DEMO_URL : SIGNUP_URL
                      window.open(url, '_blank', 'noopener,noreferrer')
                    }}
                    className={`w-full mt-auto py-3 rounded-lg font-bold text-sm transition-colors border ${
                      plan.popular
                        ? 'bg-brand-600 !text-white border-brand-600 hover:bg-brand-700 hover:border-brand-700 shadow-md'
                        : 'bg-zinc-100 !text-zinc-900 border-zinc-300 hover:bg-zinc-200'
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

