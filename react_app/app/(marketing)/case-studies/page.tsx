import { type Metadata } from "next";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { FeatureIconContainer } from "@/components/features/feature-icon-container";
import { IconClipboardText } from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";
import { truncate } from "@/lib/utils";
import { format } from "date-fns";
import { getAllCaseStudies } from "@/lib/case-studies";
import { CaseStudyCard } from "@/components/case-study-card";
import Script from "next/script";

export const metadata: Metadata = {
  title: "CaseStudy | AlertMend ",
  description:
    "",
    keywords:
    'AlertMend case studies, AlertMend customer success stories, AlertMend client experiences, automation case studies, workflow automation examples, business productivity case studies, AI automation success, email automation case study, task tracking case study, social media management case study, team collaboration success stories, business workflow optimization, automation ROI examples, AlertMend industry use cases, AlertMend customer benefits, real-world automation results, AlertMend implementation examples, campaign management case study, AlertMend monitoring case study, AlertMend impact overview',
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

export default async function ArticlesIndex() {
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
        name: "Case-Studies",
        item: "https://www.alertmend.io/case-studies",
      },
    ],
  };
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://www.alertmend.io/case-studies#webpage",
    url: "https://www.alertmend.io/case-studies",
    name: "Case-Studies | AlertMend",
    description:
      "Explore AlertMend customer success stories, client experiences, and automation case studies showcasing real-world results.",
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
          name: "Case-Studies",
          item: "https://www.alertmend.io/case-studies"
        }
      ]
    }
  };
  
  let casestudies = await getAllCaseStudies();

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
    <div className="relative overflow-hidden py-20 md:py-0"  data-section="Case Studies Page">
      <Container className="flex flex-col items-center justify-between pb-20">
        <div className="relative z-20 py-10 md:pt-40">
          {/* <FeatureIconContainer className="flex justify-center items-center overflow-hidden">
            <IconClipboardText className="h-6 w-6 text-cyan-500" />
          </FeatureIconContainer> */}
          <Heading as="h1" className="mt-4">
            Case Studies
          </Heading>
          <Subheading className="text-center">
            Discover insightful resources and expert advice from our seasoned
            team to elevate your knowledge.
          </Subheading>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full relative z-20">
          {casestudies.slice(0, 4).map((caseStudy, index) => (
            <CaseStudyCard caseStudy={caseStudy} key={caseStudy.title + index} />
          ))}
        </div>

        <div className="w-full py-20">
          <p className="text-2xl font-bold text-white mb-10">More Posts</p>

          <div className="divide-y divide-neutral-800">
            {casestudies.slice(0, 4).map((caseStudy, index) => (
              <Link
                href={`/case-studies/${caseStudy.slug}`}
                key={caseStudy.slug + index}
                className="flex md:flex-row flex-col items-start justify-between md:items-center group py-4"
              >
                <div>
                  <p className="text-neutral-300 text-lg font-medium group-hover:text-white transition duration-200">
                    {caseStudy.title}
                  </p>
                  <p className="text-neutral-300 text-sm mt-2 max-w-xl group-hover:text-white transition duration-200">
                    {truncate(caseStudy.description, 80)}
                  </p>

                  
                </div>
               
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </div>
    </>
  );
}
