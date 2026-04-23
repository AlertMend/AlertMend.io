import Hero from '../components/sections/Hero'
import Pains from '../components/sections/Pains'
import Features from '../components/sections/Features'
import AISpotlight from '../components/sections/AISpotlight'
import Services from '../components/sections/Services'
import MLOps from '../components/sections/MLOps'
import Runbooks from '../components/sections/Runbooks'
import HowItWorks from '../components/sections/HowItWorks'
import Integrations from '../components/sections/Integrations'
import Outcomes from '../components/sections/Outcomes'
import FinalCTA from '../components/sections/FinalCTA'
import SEO from '../components/SEO'
import { ensureUniqueMetaDescription } from '../utils/descriptionUtils'

export default function HomePage() {
  const baseDescription =
    "AlertMend is AI-Powered Observability and Automation. AI-generated RCAs in ~15 seconds, on-call automation, FinOps for Kubernetes & AWS, and runbooks that fan out across your fleet."
  const uniqueDescription = ensureUniqueMetaDescription(baseDescription, 'home', 'homepage')

  return (
    <>
      <SEO
        title="AlertMend: AI-Powered Observability and Automation for Kubernetes & AWS"
        description={uniqueDescription}
        keywords="AIOps, Kubernetes, incident management, auto-remediation, SRE, DevOps, cloud-native, cost optimization, VM monitoring, ECS management, infrastructure automation, AI operations, Kubernetes monitoring, container orchestration, observability, GPU MLOps, runbooks, FinOps"
        canonical="/"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'AlertMend AI',
          applicationCategory: 'DevOpsApplication',
          operatingSystem: 'Kubernetes, Cloud, AWS, GCP, Azure',
          offers: {
            '@type': 'Offer',
            price: '99',
            priceCurrency: 'USD',
          },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.8',
            ratingCount: '150',
          },
          description:
            'AIOps platform for Kubernetes, VMs, and ECS that auto-detects, analyzes, and fixes incidents. Eliminate on-call firefighting and reduce costs by 50%.',
          url: 'https://alertmend.io',
          provider: {
            '@type': 'Organization',
            name: 'AlertMend AI',
            url: 'https://alertmend.io',
            logo: 'https://alertmend.io/logos/alertmend-logo.svg',
            email: 'hello@alertmend.io',
          },
          logo: 'https://alertmend.io/logos/alertmend-logo.svg',
        }}
      />
      <Hero />
      <Pains />
      <Features />
      <AISpotlight />
      <Services />
      <MLOps />
      <Runbooks />
      <HowItWorks />
      <Integrations />
      <Outcomes />
      <FinalCTA />
    </>
  )
}
