"use client";
import { motion, useMotionValueEvent } from "framer-motion";
import React, { useRef, useState } from "react";
import { FeatureIconContainer } from "./features/feature-icon-container";
import { Heading } from "./heading";
import { Subheading } from "./subheading";
import { StickyScroll } from "./ui/sticky-scroll";
import {
  IconMailForward,
  IconSocial,
  IconTerminal,
  IconTool,
} from "@tabler/icons-react";
import { useScroll } from "framer-motion";
import { BlurImage } from "./blur-image";
import { useRouter } from "next/navigation";

import { Cpu, Cog, PhoneCall, PiggyBank } from "lucide-react";

export const Tools = () => {
  const router = useRouter();
  const features = [
    {
      title: "Cloud On-Call Management and Incident Alerts",
      desc:
        "Receive instant alerts through Slack, Microsoft Teams, email, or phone calls when issues occur. Manage on-call schedules easily and reduce response delays.",
      icon: PhoneCall,
      proof: "Improved on-call efficiency by 3x and reduced missed alerts to zero.",
    },
    {
      title: "AI-Powered Cloud Monitoring and Reliability Automation",
      desc:
        "Automate troubleshooting, accelerate recovery, and maintain service uptime. Detect, diagnose, and fix issues before they affect customers.",
      icon: Cpu,
      proof: "Reduced incident response time by 45% for a logistics customer.",
    },
    {
      title: "Automated Incident Remediation and Root Cause Analysis",
      desc:
        "Run AI-driven workflows the moment alerts fire. Restart failed pods, resize PVCs, or fix recurring issues automatically with intelligent runbooks.",
      icon: Cog,
      proof: "Handled 70% of recurring incidents automatically for a SaaS startup.",
    },
    {
      title: "Cloud Cost Optimization and Resource Management",
      desc:
        "Identify idle workloads, right-size containers, and reduce waste. Save significantly on cloud costs while maintaining system performance.",
      icon: PiggyBank,
      proof: "One of our customers saved over USD 8,000 per month in cloud costs.",
    },
  ];

  return (
    <section className="w-full bg-[#0a0a0a] text-white py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold tracking-tight"
          >
            Smart AI Tools for Teams Using AWS, Google Cloud, or Microsoft Azure
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-3 text-zinc-300 max-w-2xl mx-auto"
          >
            AlertMend empowers DevOps, SRE, and IT teams with AI-driven reliability, cost optimization, and on-call automation across AWS, Google Cloud, and Azure environments.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 * i }}
              className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-700/10 via-slate-600/5 to-transparent p-6 shadow-[0_10px_40px_-15px_rgba(71,85,105,0.5)] hover:shadow-[0_15px_60px_-15px_rgba(71,85,105,0.65)] ${i === 0 ? 'cursor-pointer' : ''}`}
              onClick={i === 0 ? () => router.push('/?service=on-call') : undefined}
            >
              <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-slate-600/20 blur-3xl pointer-events-none" />
              <div className="flex items-start gap-4">
                <div className="shrink-0 rounded-2xl bg-white/5 p-3">
                  <f.icon className="h-6 w-6 text-slate-400" />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-semibold leading-snug">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm text-zinc-300 leading-relaxed">
                    {f.desc}
                  </p>
                  <p className="mt-3 text-sm text-slate-400 italic">
                    {f.proof}
                  </p>
                </div>
              </div>
              <div className="mt-4 h-px w-0 bg-slate-500 transition-all duration-300 group-hover:w-full" />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-14 flex flex-col items-center gap-3"
        >
          
          <a
            href="https://calendly.com/hello-alertmend/30min" 
            target="_blank"
            className="inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-medium bg-white text-black hover:opacity-90 transition"
          >
            Book a 10-minute demo
          </a>
        </motion.div>
      </div>
    </section>
  );
}

// export const Tools = () => {
//   const content = [
//     {
//       title: "Your Kubernetes Copilot for Reliability and Efficiency.",
//       description:
//         "AlertMend automates troubleshooting, fixes issues faster, and keeps your clusters lean.",
//       content: (
//         <ImageContainer>
//           <BlurImage
//             // src="/first.png"
//             src="/img/Managing Kubernet 2.5.gif"
//             alt="dashboard"
//             height="1000"
//             width="1000"
//             className="w-full rounded-lg shadow-xl shadow-brand/[0.2]"
//           />
//         </ImageContainer>
//       ),
//     },
//     {
//       title: "1 Click Cost Optimization for Kubernetes.",
//       description:
//         "Save on cloud bills while keeping your workloads fast and efficient.",
//       content: (
//         <ImageContainer>
//           <BlurImage
//             // src="/second-backup.png"
//             src="/img/AlertMend Ai 3.2.gif"
//             alt="dashboard"
//             height="1000"
//             width="1000"
//             className="w-full rounded-lg shadow-xl shadow-brand/[0.2]"
//           />
//         </ImageContainer>
//       ),
//     },
//     {
//       title: "Incidents Resolved Before You Even Look.",
//       description:
//         "Fix incidents instantly with smart, pre-built and customizable workflows that act the moment your alerts fire.",
//       content: (
//         <ImageContainer>
//           <BlurImage
//             // src="/fourth-backup.png"
//             src="/img/Remidiation Flow v2.4.gif"
//             alt="dashboard"
//             height="1000"
//             width="1000"
//             className="w-full rounded-lg shadow-xl shadow-brand/[0.2]"
//             unoptimized
//           />
//         </ImageContainer>
//       ),
//     },
//     // {
//     //   icon: <IconTerminal className="h-8 w-8 text-secondary" />,
//     //   title: "Apps Automation",
//     //   description:
//     //     "We have cloned zapier and built our very own apps automation platform.",
//     //   content: (
//     //     <ImageContainer>
//     //       <BlurImage
//     //         src="/third.png"
//     //         alt="dashboard"
//     //         height="1000"
//     //         width="1000"
//     //         className="w-full rounded-lg shadow-xl shadow-brand/[0.2]"
//     //       />
//     //     </ImageContainer>
//     //   ),
//     // },
//   ];
//   const ref = useRef<HTMLDivElement>(null);
//   const { scrollYProgress } = useScroll({
//     target: ref,
//     offset: ["start end", "end start"],
//   });
//   const backgrounds = [
//     "var(--charcoal)",
//     "var(--neutral-900)",
//     // "var(--gray-900)",
//   ];
//   const index = Math.round(scrollYProgress.get() * (backgrounds.length - 1));

//   const [gradient, setGradient] = useState(backgrounds[0]);

//   useMotionValueEvent(scrollYProgress, "change", (latest) => {
//     const cardsBreakpoints = content.map((_, index) => index / content.length);
//     const closestBreakpointIndex = cardsBreakpoints.reduce(
//       (acc, breakpoint, index) => {
//         const distance = Math.abs(latest - breakpoint);
//         if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
//           return index;
//         }
//         return acc;
//       },
//       0
//     );
//     setGradient(backgrounds[closestBreakpointIndex % backgrounds.length]);
//   });
//   return (
//     <motion.div
//       // animate={{
//       //   background: gradient,
//       // }}
//       transition={{
//         duration: 0.5,
//       }}
//       ref={ref}
//       className="w-full relative h-full pt-20"
//       data-section="Tools"
//     >
//       <div className="px-6">
//         {/* <FeatureIconContainer className="flex justify-center items-center overflow-hidden">
//           <IconTool className="h-6 w-6 text-cyan-500" />
//         </FeatureIconContainer> */}
//         <Heading className="mt-4">Purpose Built Tools for Every Kubernetes Challenge</Heading>
//         <Subheading>
//           AlertMend delivers targeted solutions for the most common and critical problems in your stack. Built by SREs, for SREs.


//         </Subheading>
//       </div>
//       <StickyScroll content={content} />
//     </motion.div>
//   );
// };

// const ImageContainer = ({ children }: { children: React.ReactNode }) => {
//   return (
//     <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg relative shadow-2xl">
//       {children}
//       <div className="absolute bottom-0 w-full h-px inset-x-0 bg-gradient-to-r from-transparent via-secondary to-transparent" />
//       <div className="absolute bottom-0 w-40 mx-auto h-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
//     </div>
//   );
// };
