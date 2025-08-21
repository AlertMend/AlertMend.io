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
import Script from "next/script";

export const metadata: Metadata = {
  title: "Pricing | AlertMend ",
  description:
    "AlertMend is an all in on marketing automation platform that handles emails, tasks tracking, social media management and everything in between.",
    keywords:'AlertMend pricing, AlertMend plans, AlertMend subscription cost, AlertMend pricing plans, AlertMend monthly plans, AlertMend annual subscription, AlertMend free trial, AlertMend cost comparison, AlertMend package details, AlertMend features and pricing, AlertMend affordable plans, AlertMend enterprise pricing, AlertMend business plans, AlertMend team pricing, AlertMend automation software pricing, AlertMend value for money, AlertMend pricing options, AlertMend pricing overview, AlertMend plan comparison, AlertMend pricing page',
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
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.alertmend.io/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Pricing",
        item: "https://www.alertmend.io/pricing",
      },
    ],
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://www.alertmend.io/pricing#webpage",
    url: "https://www.alertmend.io/pricing",
    name: "Pricing | AlertMend",
    description:
      "Transparent pricing and a 45-day free trial to explore AlertMend’s automation platform.",
    isPartOf: { "@type": "WebSite", url: "https://www.alertmend.io", name: "AlertMend" },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement:[
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://www.alertmend.io"
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Contact",
          item: "https://www.alertmend.io/pricing"
        }
      ]
    }
  };
  return (
    <>
    <Script
      id="ld-breadcrumbs"
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
    />
     <Script
      id="ld-webpage"
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
    />
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
    </>
  );
}
