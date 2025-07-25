import { Link } from "next-view-transitions";
import React from "react";
import { BlurImage } from "./blur-image";
import { Logo } from "./logo";
import Image from "next/image";
import Balancer from "react-wrap-balancer";
import { truncate } from "@/lib/utils";
import { CaseStudyWithSlug } from "@/lib/case-studies";

export const CaseStudyCard = ({ caseStudy }: { caseStudy: CaseStudyWithSlug }) => {
  return (
    <Link
      className="shadow-derek rounded-3xl group border border-transparent hover:border-neutral-800 w-full hover:bg-neutral-900  overflow-hidden  hover:scale-[1.02] transition duration-200"
      href={`/case-studies/${caseStudy.slug}`}
      data-section={"Case Study Card: "+caseStudy.title}
    >
      {caseStudy.image ? (
        <BlurImage
          src={caseStudy.image || ""}
          alt={caseStudy.title}
          height="800"
          width="800"
          className="h-72 object-cover object-top w-full rounded-3xl"
        />
      ) : (
        <div className="h-72 flex items-center justify-center group-hover:bg-neutral-900">
          <Logo />
        </div>
      )}
      <div className="p-4 md:p-8 group-hover:bg-neutral-900">
        <p className="text-lg font-bold mb-4">
          <Balancer>{caseStudy.title}</Balancer>
        </p>
        {/* <p className="text-left text-sm mt-2 text-muted">
          {truncate(caseStudy.description, 100)}
        </p> */}
        <div className="flex space-x-2 items-center  mt-6">
          
        </div>
      </div>
    </Link>
  );
};
