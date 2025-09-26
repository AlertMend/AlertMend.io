import { cn } from "@/lib/utils";
import Image from "next/image";
import { Heading } from "./heading";
export function KeyFeatures() {
  const features = [
    {
      title: "Fast Setup",
      description: "On-call scheduling in minutes.",
      icon: "⚡",
    },
    {
      title: "URL Monitors",
      description: "Check latency, SSL expiry & uptime instantly.",
      icon: "🌐",
    },
    {
      title: "AI Assistance",
      description: "Smart filtering & root cause hints.",
      icon: "🤖",
    },
    {
      title: "Status Pages",
      description: "Internal & public pages to share system health.",
      icon: "📢",
    },
    {
      title: "Call Escalations",
      description: "Reach engineers via call & SMS.",
      icon: "📞",
    },
    {
      title: "Easy Integrations",
      description: "Slack, Teams, webhooks & more.",
      icon: "🔗",
    },
  ];
  return (
    <div className="px-6">
      <Heading className="my-4">Why AlertMend for On-Call?</Heading>
    
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  relative z-10 py-10 max-w-7xl mx-auto pb-20">
        {features.map((feature, index) => (
          <Integration key={feature.title} {...feature} index={index} />
        ))}
      </div>
    </div>
  );
}

const Integration = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r py-10 relative group/feature border-neutral-800",
        (index % 3 === 0) && "lg:border-l border-neutral-800",
        index < 3 && "lg:border-b border-neutral-800"
      )}
    >
      {index < 3 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-800 to-transparent pointer-events-none" />
      )}
      {index >= 3 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-800 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-neutral-400 text-4xl">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-100">
          {title}
        </span>
      </div>
      <p className="text-sm text-neutral-300 max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};
