import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import ROIMetrics from '../components/ROIMetrics'
import HowItWorks from '../components/HowItWorks'
import Solutions from '../components/Solutions'
import Integrations from '../components/Integrations'
import Benefits from '../components/Benefits'
import CaseStudies from '../components/CaseStudies'
import LatestBlogPosts from '../components/LatestBlogPosts'
import CTA from '../components/CTA'
import LanguageSupport from '../components/LanguageSupport'
import FAQ from '../components/FAQ'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import { ensureUniqueMetaDescription } from '../utils/descriptionUtils'

export default function HomePage() {
  const solutionId = 'default'
  
  // Generate unique meta description for homepage
  const baseDescription = "AlertMend AI: Automate incident management for Kubernetes, VMs, and ECS. Cut costs, reduce downtime with our AIOps platform. Optimize now!"
  const uniqueDescription = ensureUniqueMetaDescription(baseDescription, 'home', 'homepage')

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="AlertMend: Automate Kubernetes & Optimize Cloud Costs"
        description={uniqueDescription}
        keywords="AIOps, Kubernetes, incident management, auto-remediation, SRE, DevOps, cloud-native, cost optimization, VM monitoring, ECS management, infrastructure automation, AI operations, Kubernetes monitoring, container orchestration"
        canonical="/"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "AlertMend AI",
          "applicationCategory": "DevOpsApplication",
          "operatingSystem": "Kubernetes, Cloud, AWS, GCP, Azure",
          "offers": {
            "@type": "Offer",
            "price": "99",
            "priceCurrency": "USD"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "ratingCount": "150"
          },
          "description": "AIOps platform for Kubernetes, VMs, and ECS that auto-detects, analyzes, and fixes incidents. Eliminate on-call firefighting and reduce costs by 50%.",
          "url": "https://alertmend.io",
          "provider": {
            "@type": "Organization",
            "name": "AlertMend AI",
            "url": "https://alertmend.io",
            "logo": "https://alertmend.io/logos/alertmend-logo.svg",
            "email": "hello@alertmend.io"
          },
          "logo": "https://alertmend.io/logos/alertmend-logo.svg"
        }}
      />
      <Navbar />
      {/* Streamlined Flow: Hero → ROI → (How It Works if solution selected) → Solutions (only if default) → Benefits → Proof → CTA */}
      <Hero solutionId={solutionId} />
      
      <ROIMetrics />
      
      {/* Show How It Works for specific solutions */}
      {solutionId !== 'default' && <HowItWorks solutionId={solutionId} />}
      
      {/* Show Solutions section only for default page */}
      {solutionId === 'default' && <Solutions />}
      
      <Integrations />
      
      <Benefits solutionId={solutionId} />
      
      <CaseStudies />
      
      <LatestBlogPosts />
      
      <CTA solutionId={solutionId} />
      
      <LanguageSupport />
      
      <FAQ />
      
      <Footer />
    </div>
  )
}

