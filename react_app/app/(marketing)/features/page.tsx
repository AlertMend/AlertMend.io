import { AmbientColor } from "@/components/ambient-color";
import { CTA } from "@/components/cta";
import { Features } from "@/components/features";
import { Features2 } from "@/components/features/features2";
import { FeaturesGrid } from "@/components/features/features-grid";
import { Testimonials } from "@/components/testimonials";
import { Tools } from "@/components/tools";
import { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Features | AlertMend ",
  description:
    "AlertMend is an all in on marketing automation platform that handles emails, tasks tracking, social media management and everything in between.",
    keywords:
    'AlertMend features, automation, email automation, task tracking, social media management, business productivity, workflow automation, team collaboration, AI-powered automation, campaign management,AlertMend notifications,AlertM monitoring features,AlertMend benefits,AlertMend overview',
  openGraph: {
    images: [ {
      url: 'https://www.alertmend.io/img/AlertMend Ai 3.2.gif',
      width: 1200,
      height: 630,
      alt: 'AlertMend Logo',
    },
  ],
  },
  alternates: {
    canonical: 'https://www.alertmend.io/features',
  },
};

export default function FeauresPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.alertmend.io",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Features",
        item: "https://www.alertmend.io/features",
      },
    ],
  };
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://www.alertmend.io/features#webpage",
    url: "https://www.alertmend.io/features",
    name: "Features | AlertMend",
    description:
      "Explore AlertMend features including email automation, task tracking, social media management, workflow automation, collaboration, and monitoring.",
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
          name: "Features",
          item: "https://www.alertmend.io/features"
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
    <div className="relative overflow-hidden"  data-section="Features Page">
      <AmbientColor />
      <Tools />
      <Features2 />
      <FeaturesGrid />

      <div className="pb-40">
        <Testimonials />
      </div>
      {/* <CTA /> */}
    </div>
    </>
  );
}
