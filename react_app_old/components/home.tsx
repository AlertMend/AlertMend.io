"use client";
import { AmbientColor } from "@/components/ambient-color";
import { Clients } from "@/components/clients";
import { ContactForm } from "@/components/contact-form";
import { FAQs } from "@/components/faqs";
import { Features2 } from "@/components/features/features2";
import { Heading } from "@/components/heading";
import { HeroMain } from "@/components/hero-main";
import { Integrations } from "@/components/intrgrations";
import { Language } from "@/components/language";
import { PricingGrid } from "@/components/pricing-grid";
import { Subheading } from "@/components/subheading";
import { Testimonials, Testimonials2 } from "@/components/testimonials";
import { Tools } from "@/components/tools";
import { getAllCaseStudies } from "@/lib/case-studies";
import { useSearchParams } from "next/navigation";
import { KeyFeatures } from "./key-features";
import { ClientsOnCall } from "./clients-oncall";
import { PricingGridOnCall } from "./pricing-grid-oncall";
import { Suspense } from "react";

export default function Home({caseStudies}:any) {
  const sParams = useSearchParams();
  const service = sParams.get("service") || "";

  if(service=='on-call'){
    return (
        <Suspense fallback={<div>Loading...</div>}>
        <div className="relative overflow-hidden" data-section="Home Page">
            <HeroMain />
            <KeyFeatures />
            <div className="pt-20">
            <ClientsOnCall />
            </div>
            <div className="py-20" data-section="Pricing">
                <Heading className="pt-4">Pricing Model</Heading>
                <Subheading>
                45 Days Free Trial
                </Subheading>
                <PricingGridOnCall />
                <FAQs />
            </div>
        </div>
        </Suspense>
    )
  }
  return (
    <div className="relative overflow-hidden" data-section="Home Page">
      <AmbientColor />
      <HeroMain />
      <Clients />
      <Tools />
      <Integrations />
      <Language />
      <Testimonials />
      <Suspense fallback={<div>Loading...</div>}>
      <Testimonials2 testimonials={caseStudies}/>
      </Suspense>
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
