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

export const metadata: Metadata = {
  title: "CaseStudy | AlertMend ",
  description:
    "",
  openGraph: {
    images: ["/img/alertmend_logo.jpg"],
  },
};

export default async function ArticlesIndex() {
  let casestudies = await getAllCaseStudies();

  return (
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
  );
}
