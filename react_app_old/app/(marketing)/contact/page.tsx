import { AmbientColor } from "@/components/ambient-color";
import { ContactForm } from "@/components/contact-form";
import { CTA } from "@/components/cta";
import { Features } from "@/components/features";
import { Testimonials } from "@/components/testimonials";
import { Tools } from "@/components/tools";
import { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Contact | AlertMend ",
  description:
    "AlertMend is an all in on marketing automation platform that handles emails, tasks tracking, social media management and everything in between.",
    keywords:'AlertMend contact, AlertMend support, AlertMend customer support, AlertMend sales team, AlertMend help desk, AlertMend inquiries, contact AlertMend team, AlertMend demo request, AlertMend partnership inquiries, AlertMend business inquiries, AlertMend technical support, AlertMend customer service, AlertMend assistance, get in touch with AlertMend, AlertMend contact information, AlertMend product demo, schedule a call with AlertMend, AlertMend feedback, AlertMend contact details, AlertMend consultation request',
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

export default function ContactPage() {
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
        name: "Contact",
        item: "https://www.alertmend.io/contact",
      },
    ],
  };
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://www.alertmend.io/contact#webpage",
    url: "https://www.alertmend.io/contact",
    name: "Contact | AlertMend",
    description:
      "Get in touch with the AlertMend team for support, sales inquiries, partnerships, or to request a demo.",
    isPartOf: { "@type": "WebSite", url: "https://www.alertmend.io", name: "AlertMend" },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
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
          item: "https://www.alertmend.io/contact"
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
    <div className="relative overflow-hidden"  data-section="Contact Page">
      <AmbientColor />
      <div className="py-20">
      <ContactForm />
      </div>
    </div>
    </>
  );
}
