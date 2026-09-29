import Hero from '../components/sections/Hero'
import SharedEngine from '../components/sections/SharedEngine'
import Coverage from '../components/sections/Coverage'
import StackWall from '../components/sections/StackWall'
import Testimonials from '../components/sections/Testimonials'
import PilotPlan from '../components/sections/PilotPlan'
import HomeFaq from '../components/sections/HomeFaq'
import IndustriesBand from '../components/enterprise/IndustriesBand'
import SovereigntySection from '../components/enterprise/SovereigntySection'
import CustomerLogoStrip from '../components/sections/CustomerLogoStrip'
import ProductList from '../components/sections/ProductList'
import Outcomes from '../components/sections/Outcomes'
import FinalCTA from '../components/sections/FinalCTA'
import SEO from '../components/SEO'
import { ensureUniqueMetaDescription } from '../utils/descriptionUtils'
import { AudienceProvider, DEFAULT_AUDIENCE } from '../hooks/useAudience'
import { HOME_FAQ } from '../data/homeFaq'

/**
 * Homepage — one URL, two buyers (data teams / platform & SRE).
 * The hero toggle (or ?for=data / ?for=infra) sets the audience; hero copy,
 * product order, outcomes and the final CTA follow it. See hooks/useAudience.
 * hero → logos → coverage (data + infra) → outcomes →
 * product tour → quotes → shared engine (dark) →
 * pilot plan → industries → stack wall → sovereignty → FAQ → CTA. Backgrounds alternate white/grey.
 */
export default function HomePage() {
  const baseDescription =
    'Policy-driven data quality on Snowflake and Oracle, plus AI observability for Kubernetes, VMs and cloud: evidence-backed root cause and automated fixes.'
  const uniqueDescription = ensureUniqueMetaDescription(baseDescription, 'home', 'homepage')

  return (
    <>
      <SEO
        title="AlertMend: Data Quality & Infrastructure Observability"
        description={uniqueDescription}
        keywords="AIOps, observability, APM, distributed tracing, OpenTelemetry, eBPF, AI RCA, auto-remediation, FinOps, on-call, log management, Prometheus, Datadog, Grafana, Alertmanager, data quality monitoring"
        canonical="/"
        structuredData={{
          '@context': 'https://schema.org',
          '@graph': [
            {
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
            },
            {
              // Only the FAQ rendered in the prerendered HTML (default audience),
              // so the markup always matches visible content.
              '@type': 'FAQPage',
              mainEntity: HOME_FAQ[DEFAULT_AUDIENCE].map((item) => ({
                '@type': 'Question',
                name: item.q,
                acceptedAnswer: { '@type': 'Answer', text: item.a },
              })),
            },
          ],
        }}
      />
      <AudienceProvider>
        <Hero />
        <CustomerLogoStrip />
        <Coverage />
        <Outcomes />
        <ProductList />
        <Testimonials />
        <SharedEngine />
        <PilotPlan />
        <StackWall />
        <IndustriesBand />
        <SovereigntySection showControls={false} />
        <HomeFaq />
        <FinalCTA />
      </AudienceProvider>
    </>
  )
}
