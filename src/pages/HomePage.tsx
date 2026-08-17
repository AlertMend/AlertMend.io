import Hero from '../components/sections/Hero'
import CustomerLogoStrip from '../components/sections/CustomerLogoStrip'
import ProductList from '../components/sections/ProductList'
import Outcomes from '../components/sections/Outcomes'
import FinalCTA from '../components/sections/FinalCTA'
import SEO from '../components/SEO'
import { ensureUniqueMetaDescription } from '../utils/descriptionUtils'

/**
 * Homepage — lean:
 * hero → logos → product list → outcomes → CTA.
 */
export default function HomePage() {
  const baseDescription =
    'AI-powered observability and automation: metrics, logs and traces on one timeline via OpenTelemetry and eBPF, evidence-backed AI RCA, and approved remediation.'
  const uniqueDescription = ensureUniqueMetaDescription(baseDescription, 'home', 'homepage')

  return (
    <>
      <SEO
        title="AlertMend: AI-Powered Observability and Automation"
        description={uniqueDescription}
        keywords="AIOps, observability, APM, distributed tracing, OpenTelemetry, eBPF, AI RCA, auto-remediation, FinOps, on-call, log management"
        canonical="/"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'AlertMend',
          applicationCategory: 'DevOpsApplication',
          operatingSystem: 'Kubernetes, Cloud, Linux',
          description: baseDescription,
          url: 'https://alertmend.io',
          provider: {
            '@type': 'Organization',
            name: 'AlertMend',
            url: 'https://alertmend.io',
            logo: 'https://alertmend.io/logos/alertmend-logo.svg',
            email: 'hello@alertmend.io',
          },
          logo: 'https://alertmend.io/logos/alertmend-logo.svg',
        }}
      />
      <Hero />
      <CustomerLogoStrip />
      <ProductList />
      <Outcomes />
      <FinalCTA />
    </>
  )
}
