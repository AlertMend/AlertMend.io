interface Testimonial {
  src: string;
  quote: string;
  name: string;
  logo?: string;
  designation?: string;
}

export const testimonials: Testimonial[] = [
  {
    name: "Yasser Ansari",
    quote:
      "AlertMend streamlined our incident management. Faster resolutions, less manual work, and a more focused team. Peace of mind is invaluable",
    src: "/img/avatar1.png",
    logo: "/img/polymer-logo.png",
    designation: "CEO, Polymer",
  },
  {
    name: "Rajnish Sharma",
    quote:
      "AlertMend helped us take control of our Kubernetes costs without adding any manual effort. Within a week, we cut GKE expenses in half, cleaned up unused storage, and right-sized workloads — all without touching a single YAML file. It’s like having an AI-powered infra co-pilot that just works.",
    src: "/img/avatar-people-person-business.jpg",
    logo: "/img/wareflex-logo.svg",
    designation: "Founder and CEO of Wareflex",
  },
  {
    name: "Shailesh Mangal",
    quote:
      "This AI has transformed the way I work! It's like having a brilliant assistant who knows exactly what I need before I even ask.",
    src: "/img/avatar3.jpg",
    designation: "CTO, Roambee",
  },
  {
    name: "Phan (Marcus) Dinh Long Nhat",
    quote:
      "The automation we required was provided by AlertMend. 90% of our recurring service issues are now resolved by it, and it even automatically recovers stuck virtual machines (VMs) while communicating with our team through Slack. It's similar to having a backup SRE available at all times.",
    src: "/img/avatar4.avif",
    designation: "Founder & CEO, AIVOS",
  },
  {
    name: "Alice Johnson3",
    quote:
      "This AI has transformed the way I work! It's like having a brilliant assistant who knows exactly what I need before I even ask.",
    src: "https://i.pravatar.cc/150?img=3",
    designation: "Senior Software Engineer",
  }
];
