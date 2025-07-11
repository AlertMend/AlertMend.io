import glob from "fast-glob";

interface CaseStudy {
  title: string;
  description: string;
  author: {
    name: string;
    src: string;
  };
  date: string;
  image: string;
  links:{
    name: string;
    href: string;
  }[];
}

export interface CaseStudyWithSlug extends CaseStudy {
  slug: string;
}

async function importCaseStudy(caseStudyFilename: string): Promise<CaseStudyWithSlug> {
  let { caseStudy } = (await import(`../app/(marketing)/case-studies/${caseStudyFilename}`)) as {
    default: React.ComponentType;
    caseStudy: CaseStudy;
  };
  console.log(caseStudy)
  return {
    slug: caseStudyFilename.replace(/(\/page)?\.mdx$/, ""),
    ...caseStudy,
  };
}

export async function getAllCaseStudies() {
  let caseStudyFilenames = await glob("*/page.mdx", {
    cwd: "./app/(marketing)/case-studies",
  });

  let caseStudys = await Promise.all(caseStudyFilenames.map(importCaseStudy));

  return caseStudys.sort((a, z) => +new Date(z.date) - +new Date(a.date));
}
