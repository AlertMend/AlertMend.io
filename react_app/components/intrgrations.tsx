import { cn } from "@/lib/utils";
import Image from "next/image";
import { Heading } from "./heading";
export function Integrations() {
  const features = [
    {
      title: "AWS EKS",
      description:
        "Run and fix your workloads directly on Amazon EKS.",
      icon: <Image
        width={40}
        height={40}
        alt="Integration"
        src="/img/intrgrations/aws.png"
      />,
    },
    {
      title: "Azure AKS",
      description:
        "Easily automate and troubleshoot apps on Azure AKS.",
      icon: <Image
        width={40}
        height={40}
        alt="Integration"
        src="/img/intrgrations/azure.png"
      />,
    },
    {
      title: "Google Cloud GKE",
      description:
        "Monitor and repair GKE clusters with no extra setup.",
      icon: <Image
        width={40}
        height={40}
        alt="Integration"
        src="/img/intrgrations/GoogleCloudGKESupport.png"
      />,
    },
    {
      title: "Multi-Cloud",
      description: "Use on any Kubernetes — cloud, hybrid, or on-prem.",
      icon: <Image
        width={40}
        height={40}
        alt="Integration"
        src="/img/intrgrations/multicloudnative.png"
      />,
    },
  ];
  return (
    <div className="px-6">
       <Heading className="mt-4">Run Kubernetes Anywhere, Without the Chaos</Heading>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  relative z-10 py-10 max-w-7xl mx-auto pb-20">
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
        "flex flex-col lg:border-r  py-10 relative group/feature border-neutral-800",
        (index === 0 || index === 4) && "lg:border-l border-neutral-800",
        // index < 4 && "lg:border-b border-neutral-800"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-800 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-800 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-neutral-400">
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
