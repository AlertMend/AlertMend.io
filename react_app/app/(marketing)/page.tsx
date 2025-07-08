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
import { PricingGrid } from "@/components/pricing-grid";
import { Subheading } from "@/components/subheading";
import { Testimonials, Testimonials2 } from "@/components/testimonials";
import { TestimonialsSlider } from "@/components/testimonials/slider";
import { TestimonialsSlider2 } from "@/components/testimonials/slider2";
import { Tools } from "@/components/tools";
import { getAllCaseStudies } from "@/lib/case-studies";
import { IconReceiptFilled } from "@tabler/icons-react";

export default async function Home() {
  const caseStudies = await getAllCaseStudies()
  return (
    <div className="relative overflow-hidden">
      <AmbientColor />
      <Hero />
      <Clients />
      <Tools />
      <Testimonials />
      <Testimonials2 testimonials={caseStudies}/>
      <Features2 />
      <ContactForm />
      <div className="py-20 sm:py-40">
        <FeatureIconContainer className="flex justify-center items-center overflow-hidden">
          <IconReceiptFilled className="h-6 w-6 text-cyan-500" />
        </FeatureIconContainer>
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
