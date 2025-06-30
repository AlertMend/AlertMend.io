interface Testimonial {
  src: string;
  quote: string;
  name: string;
  designation?: string;
}

export const testimonials: Testimonial[] = [
  {
    name: "Yasser Ansari",
    quote:
      "AlertMend streamlined our incident management. Faster resolutions, less manual work, and a more focused team. Peace of mind is invaluable",
    src: "https://i.pravatar.cc/150?img=1",
    designation: "CEO, Polymer",
  },
  {
    name: "Engineering Lead",
    quote:
      "AlertMend helped us uncover blind spots and slash our GKE spend — all without touching a single YAML file.",
    src: "https://i.pravatar.cc/150?img=2",
    designation: "Wareflex",
  },
  {
    name: "Alice Johnson1",
    quote:
      "This AI has transformed the way I work! It's like having a brilliant assistant who knows exactly what I need before I even ask.",
    src: "https://i.pravatar.cc/150?img=3",
    designation: "Senior Software Engineer",
  },
  {
    name: "Alice Johnson2",
    quote:
      "This AI has transformed the way I work! It's like having a brilliant assistant who knows exactly what I need before I even ask.",
    src: "https://i.pravatar.cc/150?img=3",
    designation: "Senior Software Engineer",
  },
  {
    name: "Alice Johnson3",
    quote:
      "This AI has transformed the way I work! It's like having a brilliant assistant who knows exactly what I need before I even ask.",
    src: "https://i.pravatar.cc/150?img=3",
    designation: "Senior Software Engineer",
  }
];
