import Home from "@/components/home";
import { getAllCaseStudies } from "@/lib/case-studies";


export default async function Page({}:any) {
  const caseStudies = await getAllCaseStudies()

  return (
    <div className="relative overflow-hidden" data-section="Home Page">
      <Home caseStudies={caseStudies}/>
    </div>
  );
}
