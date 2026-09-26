import { useEffect, useState } from 'react'
import SEO from '../components/SEO'
import ent from '../components/enterprise/Enterprise.module.css'
import { Check } from 'lucide-react'
import { ensureUniqueMetaDescription } from '../utils/descriptionUtils'
import { SHOW_DATA_PRICING } from '../data/flags'
import { calendlyUrl } from '../lib/calendly'

const SIGNUP_URL = 'https://app.alertmend.io/signup'
const DATA_SIGNUP_URL = 'https://app.alertmend.io/signup?service=data-observability'
const DEMO_URL = calendlyUrl('pricing-infra')
const DATA_DEMO_URL = calendlyUrl('pricing-data')

type Plan = {
  name: string
  label: string
  description: string
  features: string[]
  popular: boolean
  buttonText: string
  href?: string
}

const infraPlans: Plan[] = [
  {
    name: 'SRE/DevOps Playground',
    label: 'Free',
    description: 'For individuals trying out the product',
    features: [
      'Unlimited remediation flows',
      'Unlimited integrations',
      'AI RCA',
      'Support: Immediate',
    ],
    popular: false,
    buttonText: 'Start free',
    href: SIGNUP_URL,
  },
  {
    name: 'Startups',
    label: '',
    description: 'Up to about 10 VMs or a small cluster',
    features: [
      'Unlimited remediation flows',
      'Unlimited integrations',
      'AI RCA',
      'Support: Immediate',
    ],
    popular: false,
    buttonText: 'Book a demo',
    href: DEMO_URL,
  },
  {
    name: 'Growth',
    label: '',
    description: 'For >10 VMs or Kubernetes <100 pods',
    features: [
      'Unlimited remediation flows',
      'Unlimited integrations',
      'AI RCA',
      'Support: Immediate',
    ],
    popular: true,
    buttonText: 'Book a demo',
    href: DEMO_URL,
  },
  {
    name: 'Enterprise/Custom',
    label: '',
    description: 'On-prem, bring your own model, custom SLAs',
    features: [
      'Unlimited VMs & Kubernetes',
      'Unlimited remediation flows',
      'Unlimited integrations',
      'AI RCA',
      'On premise setup',
      'Support: Immediate',
    ],
    popular: false,
    buttonText: 'Book a demo',
    href: DEMO_URL,
  },
]

/* Data plans. Priced by monitored datasets; checks and users are never
   metered. Dataset limits are deliberately not shown until they are
   approved: cards say what changes between tiers instead. */
const dataPlans: Plan[] = [
  {
    name: 'Free',
    label: 'Free',
    description: 'Try it on your own data',
    features: [
      'A starter set of datasets',
      'Unlimited checks and users',
      'Policy to checks and Data Quality Copilot',
      'Slack and Teams alerts',
    ],
    popular: false,
    buttonText: 'Start free',
    href: DATA_SIGNUP_URL,
  },
  {
    name: 'Team',
    label: '',
    description: 'One data team, one project',
    features: [
      'Everything in Free',
      'More datasets',
      'Pipeline links (Airflow, Oracle ODI)',
      'Power BI impact',
    ],
    popular: true,
    buttonText: 'Talk to us',
    href: DATA_DEMO_URL,
  },
  {
    name: 'Business',
    label: '',
    description: 'Several teams and domains',
    features: [
      'Everything in Team',
      'More datasets and connections',
      'Incidents and escalation',
      'Audit export',
    ],
    popular: false,
    buttonText: 'Talk to us',
    href: DATA_DEMO_URL,
  },
  {
    name: 'Enterprise',
    label: '',
    description: 'Regulated, large estates',
    features: [
      'Everything in Business',
      'Unlimited datasets and connections',
      'On-prem deployment',
      'Custom SLAs',
      'Security review support',
    ],
    popular: false,
    buttonText: 'Talk to us',
    href: DATA_DEMO_URL,
  },
]

/** Included on every data plan, so cards only show what changes. */
const DATA_INCLUDED = [
  'Unlimited checks',
  'Unlimited users',
  'Checks proposed from your policy, each citing its clause',
  '87 ready-made checks, no SQL',
  'Cause and impact on every failure',
  'Read-only agent, credentials stay in your network',
  'Every check change approved, versioned and reversible',
]

type Tier = 'Free' | 'Team' | 'Business' | 'Enterprise'
const TIERS: Tier[] = ['Free', 'Team', 'Business', 'Enterprise']

/** Comparison rows: the first tier that includes each item. */
const DATA_COMPARE: { label: string; from: Tier | 'all'; note?: Partial<Record<Tier, string>> }[] = [
  { label: 'Monitored datasets', from: 'all', note: { Free: 'Starter', Team: 'More', Business: 'More', Enterprise: 'Unlimited' } },
  { label: 'Warehouse connections', from: 'all', note: { Free: 'Starter', Team: 'Starter', Business: 'More', Enterprise: 'Unlimited' } },
  { label: 'Checks and users', from: 'all', note: { Free: 'Unlimited', Team: 'Unlimited', Business: 'Unlimited', Enterprise: 'Unlimited' } },
  { label: 'Policy to checks and Copilot', from: 'all' },
  { label: 'Snowflake and Oracle', from: 'all' },
  { label: 'Slack and Teams alerts', from: 'all' },
  { label: 'Pipeline links (Airflow, Oracle ODI)', from: 'Team' },
  { label: 'Power BI impact', from: 'Team' },
  { label: 'Incidents and escalation', from: 'Business' },
  { label: 'Audit export', from: 'Business' },
  { label: 'On-prem deployment', from: 'Enterprise' },
  { label: 'Custom SLAs and security review support', from: 'Enterprise' },
]

const DATA_FAQ = [
  {
    q: 'How is data observability priced?',
    a: 'One plan price per tier, based on how many datasets you monitor. Checks and users are never metered, so turning your whole policy into checks does not raise the bill.',
  },
  {
    q: 'What counts as a dataset?',
    a: 'A table or view you choose to monitor. Every check, user and alert on it is included.',
  },
  {
    q: 'Can we try it on our own data?',
    a: 'Yes. Start on the Free plan, or ask us for a pilot on your own warehouse with your data owners in the loop.',
  },
  {
    q: 'Can we keep our current data quality tool?',
    a: 'Yes. AlertMend runs alongside your current tools.',
  },
  {
    q: 'Does our data leave our network?',
    a: 'No. The read-only agent runs queries inside your network and sends back only results. AlertMend stores no warehouse secrets.',
  },
]

function PlanGrid({ plans }: { plans: Plan[] }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-16 items-stretch">
      {plans.map((plan) => (
        <div
          key={plan.name}
          className={`flex flex-col h-full bg-white rounded-lg p-8 border transition-colors duration-200 ${
            plan.popular ? 'border-[#0b1220] ring-1 ring-[#0b1220]' : 'border-zinc-200 hover:border-zinc-300'
          }`}
        >
          <div className="mb-6">
            <div
              className={`items-center justify-start ${
                plan.popular || plan.label
                  ? 'flex h-7 mb-3'
                  : 'hidden md:flex md:h-7 md:mb-3'
              }`}
            >
              {plan.popular ? (
                <span className="inline-block px-3 py-1 bg-[#0b1220] text-white rounded-full text-[11px] font-semibold uppercase tracking-wider">
                  Recommended
                </span>
              ) : plan.label ? (
                <span className="inline-block px-3 py-1 bg-brand-50 text-brand-700 rounded-full text-xs font-bold border border-brand-200">
                  {plan.label}
                </span>
              ) : null}
            </div>
            <h3 className="text-xl font-semibold text-zinc-900 mb-3 leading-tight md:flex md:items-center md:min-h-[50px]">
              {plan.name}
            </h3>
            <p
              aria-hidden={plan.description ? undefined : true}
              className={`text-zinc-500 text-sm font-medium leading-tight md:flex md:items-start md:h-[48px] ${
                plan.description ? '' : 'hidden'
              }`}
            >
              {plan.description || '\u00A0'}
            </p>
          </div>
          <ul className="space-y-3 mb-8 flex-1">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <Check className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-1" />
                <span className="text-zinc-700 text-sm font-medium">{feature}</span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => {
              const url =
                plan.href ??
                (plan.buttonText === 'Book a demo' || plan.buttonText === 'Talk to us'
                  ? DEMO_URL
                  : SIGNUP_URL)
              window.open(url, '_blank', 'noopener,noreferrer')
            }}
            className={`w-full mt-auto py-3 rounded-lg font-semibold text-sm transition-colors border ${
              plan.popular
                ? 'bg-[#0b1220] !text-white border-[#0b1220] hover:bg-[#1e293b]'
                : 'bg-white !text-zinc-900 border-zinc-300 hover:border-zinc-900'
            }`}
          >
            {plan.buttonText}
          </button>
        </div>
      ))}
    </div>
  )
}

export default function PricingPage() {
  const baseDescription =
    'AlertMend pricing for Kubernetes and cloud ops, and data quality plans with unlimited checks. Compare plans and book a demo.'
  const uniqueDescription = ensureUniqueMetaDescription(baseDescription, 'pricing', 'pricing')

  const [tab, setTab] = useState<'infrastructure' | 'data'>('infrastructure')

  useEffect(() => {
    if (!SHOW_DATA_PRICING) return
    if (typeof window === 'undefined') return
    let fromHome: string | null = null
    try {
      fromHome = window.sessionStorage.getItem('am_home_audience')
    } catch {
      /* storage blocked */
    }
    const params = new URLSearchParams(window.location.search)
    if (window.location.hash === '#data' || params.get('for') === 'data' || (!window.location.hash && fromHome === 'data')) {
      setTab('data')
    }
  }, [])

  const selectTab = (next: 'infrastructure' | 'data') => {
    setTab(next)
    if (typeof window === 'undefined') return
    const hash = next === 'data' ? '#data' : ''
    const url = `${window.location.pathname}${window.location.search}${hash}`
    window.history.replaceState(null, '', url)
  }

  const showingData = SHOW_DATA_PRICING && tab === 'data'

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="AlertMend Pricing: Infrastructure and Data Quality Plans"
        description={uniqueDescription}
        keywords="AlertMend pricing, AIOps pricing, infrastructure automation pricing, Kubernetes monitoring pricing, data quality pricing"
        canonical="/pricing"
        breadcrumbData={{
          items: [{ label: 'Pricing' }],
        }}
      />
      <section className={ent.pageHero}>
        <div className={ent.wrap}>
          <span className={ent.eyebrow}>Pricing</span>
          <h1 className={ent.h1}>
            {showingData ? 'One plan price. Unlimited checks.' : 'Start free. Pay when you go to production.'}
          </h1>
          <p className={ent.lede}>
            {showingData
              ? 'Turn your whole policy into checks without the bill going up. Priced by monitored datasets; checks and users are never metered.'
              : 'A free workspace to evaluate AlertMend, and paid plans for teams running it in production.'}
          </p>
        </div>
      </section>
      <section className="px-4 sm:px-6 lg:px-8 pt-12 pb-20 md:pb-28 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto">
          {SHOW_DATA_PRICING ? (
            <div
              className="mb-10 flex w-fit items-center gap-1 rounded-lg border border-zinc-200 bg-white p-1"
              role="tablist"
              aria-label="Pricing category"
            >
              {(
                [
                  { id: 'infrastructure', label: 'Infrastructure' },
                  { id: 'data', label: 'Data' },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  role="tab"
                  aria-selected={tab === opt.id}
                  onClick={() => selectTab(opt.id)}
                  className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
                    tab === opt.id
                      ? 'bg-[#0b1220] !text-white'
                      : 'bg-transparent !text-zinc-600 hover:!text-zinc-900'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          ) : null}

          <PlanGrid plans={showingData ? dataPlans : infraPlans} />

          {SHOW_DATA_PRICING && tab === 'infrastructure' ? (
            <p className="text-sm text-zinc-600 -mt-8 mb-8">
              Looking for data quality pricing?{' '}
              <button
                type="button"
                onClick={() => selectTab('data')}
                className="font-semibold !text-brand-700 underline underline-offset-2 hover:!text-brand-900"
              >
                See the Data plans
              </button>
            </p>
          ) : null}

          {showingData ? (
            <div className="-mt-6 rounded-lg border border-zinc-200 bg-white p-6 md:p-8">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.12em] !text-brand-700">
                Included in every data plan
              </p>
              <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
                {DATA_INCLUDED.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm font-medium !text-zinc-700">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </section>

      {showingData ? (
        <section className="bg-white px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-2 text-3xl font-semibold tracking-tight text-[#0b1220]">Compare data plans</h2>
            <p className="mb-10 text-zinc-600">
              Priced by monitored datasets. Checks and users are never metered.
            </p>
            <div className="overflow-x-auto rounded-lg border border-zinc-200">
              <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-zinc-50">
                    <th className="px-4 py-3 font-semibold text-zinc-500" scope="col">
                      &nbsp;
                    </th>
                    {TIERS.map((t) => (
                      <th key={t} scope="col" className="px-4 py-3 text-center font-semibold text-zinc-900">
                        {t}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DATA_COMPARE.map((row) => {
                    const start = row.from === 'all' ? 0 : TIERS.indexOf(row.from)
                    return (
                      <tr key={row.label} className="border-t border-zinc-200">
                        <th scope="row" className="px-4 py-3 font-medium text-zinc-700">
                          {row.label}
                        </th>
                        {TIERS.map((t, i) => (
                          <td key={t} className="px-4 py-3 text-center">
                            {row.note?.[t] ? (
                              <span className="font-semibold text-zinc-800">{row.note[t]}</span>
                            ) : i >= start ? (
                              <Check className="mx-auto h-4 w-4 text-brand-600" aria-label="Included" />
                            ) : (
                              <span className="text-zinc-300" aria-label="Not included">
                                —
                              </span>
                            )}
                          </td>
                        ))}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <h2 className="mb-6 mt-20 text-3xl font-semibold tracking-tight text-[#0b1220]">Data pricing questions</h2>
            <div className="flex max-w-3xl flex-col gap-3">
              {DATA_FAQ.map((item, i) => (
                <details key={item.q} className="group rounded-lg border border-zinc-200 bg-white" open={i === 0}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold text-zinc-900">
                    {item.q}
                    <span className="text-xl leading-none text-zinc-400 group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="px-5 pb-5 text-sm leading-relaxed text-zinc-600">{item.a}</p>
                </details>
              ))}
            </div>

            <div className="mt-16 flex flex-col items-start gap-3">
              <p className="text-lg font-semibold text-zinc-900">Want a number for your estate?</p>
              <p className="max-w-xl text-zinc-600">
                Tell us roughly how many tables you want to monitor and we will send you a plan price.
              </p>
              <a
                href={DATA_DEMO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center rounded-lg bg-[#0b1220] px-6 py-3 text-sm font-semibold !text-white hover:bg-[#1e293b]"
              >
                Get a data plan price
              </a>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  )
}
