'use client'
import { AmbientColor } from "@/components/ambient-color";
import dynamic from "next/dynamic";
const BookDemo = dynamic(()=>import('./BookDemo'),{ssr:false})
import Script from "next/script";
export default function BookingPage() {
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
        name: "Book A Demo",
        item: "https://calendly.com/hello-alertmend/30min",
      },
    ],
  };
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://calendly.com/hello-alertmend/30min#webpage",
    url: "https://calendly.com/hello-alertmend/30min",
    name: "Book A Demo | AlertMend",
    description:
      "Schedule a live demo of AlertMend to explore automation features, workflow management, and team collaboration benefits",
    isPartOf: { "@type": "WebSite", url: "https://alertmend.io", name: "AlertMend" },
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
          name: "Book A Demo",
          item: "https://calendly.com/hello-alertmend/30min"
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
    <div className="relative overflow-hidden py-20"  data-section="Book Demo">
      <AmbientColor />
      <BookDemo/>
    </div>
    </>
  );
}
