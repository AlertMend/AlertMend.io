import { AmbientColor } from "@/components/ambient-color";
import { AnimatedSvg } from "@/components/animated-svg";
import { Clients } from "@/components/clients";
import { ContactForm } from "@/components/contact-form";
import { Container } from "@/components/container";
import { CTA } from "@/components/cta";
import { FAQs } from "@/components/faqs";
import { Features } from "@/components/features";
import { FeatureIconContainer } from "@/components/features/feature-icon-container";
import { Features2 } from "@/components/features/features2";
import { Heading } from "@/components/heading";
import { Hero } from "@/components/hero";
import { HeroCluster } from "@/components/hero-cluster";
import { HeroCostOptimization } from "@/components/hero-cost-optimization";
import { HeroMain } from "@/components/hero-main";
import { Integrations } from "@/components/intrgrations";
import { Language } from "@/components/language";
import { PricingGrid } from "@/components/pricing-grid";
import { Subheading } from "@/components/subheading";
import { Testimonials, Testimonials2 } from "@/components/testimonials";
import { TestimonialsSlider } from "@/components/testimonials/slider";
import { TestimonialsSlider2 } from "@/components/testimonials/slider2";
import { Tools } from "@/components/tools";
import { getAllCaseStudies } from "@/lib/case-studies";
import { IconReceiptFilled } from "@tabler/icons-react";

export default async function Home({}:any) {
  const caseStudies = await getAllCaseStudies()

  return (
    <div className="relative overflow-hidden" data-section="Home Page">
      <AmbientColor />
      <HeroMain />
      <Clients />
      <Tools />
      <Integrations />
      <Language />
      <Testimonials />
      <Testimonials2 testimonials={caseStudies}/>
      <Features2 />
      <ContactForm />
      <div className="py-20" data-section="Pricing">
        {/* <FeatureIconContainer className="flex justify-center items-center overflow-hidden">
          <IconReceiptFilled className="h-6 w-6 text-cyan-500" />
        </FeatureIconContainer> */}
        <Heading className="pt-4">Pricing Model</Heading>
        <Subheading>
        45 Days Free Trial
        </Subheading>
        <PricingGrid />
        <FAQs />
      </div>
      {/* <CTA /> */}
    </div>
  );
}
