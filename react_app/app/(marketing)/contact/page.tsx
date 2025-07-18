import { AmbientColor } from "@/components/ambient-color";
import { ContactForm } from "@/components/contact-form";
import { CTA } from "@/components/cta";
import { Features } from "@/components/features";
import { Testimonials } from "@/components/testimonials";
import { Tools } from "@/components/tools";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | AlertMend ",
  description:
    "AlertMend is an all in on marketing automation platform that handles emails, tasks tracking, social media management and everything in between.",
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
  return (
    <div className="relative overflow-hidden"  data-section="Contact Page">
      <AmbientColor />
      <ContactForm />
    </div>
  );
}
