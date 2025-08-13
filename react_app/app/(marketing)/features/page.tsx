import { AmbientColor } from "@/components/ambient-color";
import { CTA } from "@/components/cta";
import { Features } from "@/components/features";
import { Features2 } from "@/components/features/features2";
import { FeaturesGrid } from "@/components/features/features-grid";
import { Testimonials } from "@/components/testimonials";
import { Tools } from "@/components/tools";
import { Metadata } from "next";

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

export default function PricingPage() {
  return (
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
  );
}
