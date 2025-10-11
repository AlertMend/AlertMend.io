import Home from "@/components/home";
import { getAllCaseStudies } from "@/lib/case-studies";
import { Suspense } from "react";


export default async function Page({}:any) {
  const caseStudies = await getAllCaseStudies()

  return (
    <div className="relative overflow-hidden" data-section="Home Page">
      <Suspense fallback={<div>Loading...</div>}>
        <Home caseStudies={caseStudies}/>
      </Suspense>
    </div>
  );
}
