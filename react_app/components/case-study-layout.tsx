import { useRouter } from "next/navigation";

import { IconArrowLeft } from "@tabler/icons-react";
import { Container } from "./container";
import Image from "next/image";
import { Logo } from "./logo";
import Link from "next/link";
import { format } from "date-fns";
import { CaseStudyWithSlug } from "@/lib/case-studies";
export function CaseStudyLayout({
  caseStudy,
  children,
}: {
  caseStudy: CaseStudyWithSlug;
  children: React.ReactNode;
}) {
  return (
    <Container className="mt-16 lg:mt-32">
      <div className="flex justify-between items-center px-2 py-8">
        <Link href="/case-studies" className="flex space-x-2 items-center">
          <IconArrowLeft className="w-4 h-4 text-muted" />
          <span className="text-sm text-muted">Back</span>
        </Link>
      </div>
      <div className="w-full mx-auto">
        {caseStudy.image ? (
          <Image
            src={caseStudy.image}
            height="800"
            width="800"
            className="h-40 md:h-96 w-full aspect-square object-cover rounded-3xl [mask-image:radial-gradient(circle,white,transparent)]"
            alt={caseStudy.title}
          />
        ) : (
          <div className="h-40 md:h-96 w-full aspect-squace rounded-3xl shadow-derek bg-neutral-900 flex items-center justify-center">
            <Logo />
          </div>
        )}
      </div>
      <div className="xl:relative">
        <div className="mx-auto">
          <article className="pb-8">
            <header className="flex flex-col">
              <h1 className="mt-8 text-4xl font-bold tracking-tight text-neutral-200 sm:text-5xl ">
                {caseStudy.title}
              </h1>
            </header>
            <div className="mt-8 prose prose-invert" style={{maxWidth:'fit-content !important'}} data-mdx-content>
              {children}
            </div>
            <div className="flex space-x-2 items-center pt-12 border-t border-neutral-800 mt-12">
              <div className="flex space-x-2 items-center ">
                <Image
                  src={caseStudy.author.src}
                  alt={caseStudy.author.name}
                  width={20}
                  height={20}
                  className="rounded-full h-5 w-5"
                />
                <p className="text-sm font-normal text-muted">
                  {caseStudy.author.name}
                </p>
              </div>
              <div className="h-5 rounded-lg w-0.5 bg-neutral-700" />
              <time
                dateTime={caseStudy.date}
                className="flex items-center text-base "
              >
                <span className="text-muted text-sm">
                  {format(new Date(caseStudy.date), "MMMM dd, yyyy")}
                </span>
              </time>
            </div>
          </article>
        </div>
      </div>
    </Container>
  );
}
