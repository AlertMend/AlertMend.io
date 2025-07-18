import { AmbientColor } from "@/components/ambient-color";
import { CTA } from "@/components/cta";
import { FeatureIconContainer } from "@/components/features/feature-icon-container";
import { Heading } from "@/components/heading";
import { Hero } from "@/components/hero";
import { PricingGrid } from "@/components/pricing-grid";
import { Subheading } from "@/components/subheading";
import { Testimonials } from "@/components/testimonials";
import { TestimonialsMarquee } from "@/components/testimonials/marquee";
import { IconReceiptFilled } from "@tabler/icons-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing | AlertMend ",
  description:
    "AlertMend is an all in on marketing automation platform that handles emails, tasks tracking, social media management and everything in between.",
  openGraph: {
    images: [ {
      url: 'https://www.alertmend.io/img/AlertMend Ai 3.2.gif',
      width: 1200,
      height: 630,
      alt: 'AlertMend Logo',
    },
  ],
  },
};

export default function PricingPage() {
  return (
    <div className="relative overflow-hidden">
      <AmbientColor />
      <div className="py-20 sm:py-40"  data-section="Pricing Page">
        {/* <FeatureIconContainer className="flex justify-center items-center overflow-hidden">
          <IconReceiptFilled className="h-6 w-6 text-cyan-500" />
        </FeatureIconContainer> */}
        <Heading as="h1" className="mt-4">
        Pricing Model
        </Heading>
        <Subheading>
        45 Days Free Trial
        </Subheading>
        <PricingGrid />
      </div>
      <div className="pb-40">
        {/* <TestimonialsMarquee /> */}
      </div>
      {/* <CTA /> */}
    </div>
  );
}
