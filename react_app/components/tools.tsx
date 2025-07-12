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

export const Tools = () => {
  const content = [
    {
      title: "Your Kubernetes Copilot for Reliability and Efficiency.",
      description:
        "AlertMend automates troubleshooting, fixes issues faster, and keeps your clusters lean.",
      content: (
        <ImageContainer>
          <BlurImage
            // src="/first.png"
            src="/img/kubernetcopilot.png"
            alt="dashboard"
            height="1000"
            width="1000"
            className="w-full rounded-lg shadow-xl shadow-brand/[0.2]"
          />
        </ImageContainer>
      ),
    },
    {
      title: "Click Cost Optimization for Kubernetes.",
      description:
        "Save on cloud bills while keeping your workloads fast and efficient.",
      content: (
        <ImageContainer>
          <BlurImage
            // src="/second-backup.png"
            src="/img/AlertMend Ai2.gif"
            alt="dashboard"
            height="1000"
            width="1000"
            className="w-full rounded-lg shadow-xl shadow-brand/[0.2]"
          />
        </ImageContainer>
      ),
    },
    {
      title: "Incidents Resolved Before You Even Look.",
      description:
        "Fix incidents instantly with smart, pre-built and customizable workflows that act the moment your alerts fire.",
      content: (
        <ImageContainer>
          <BlurImage
            // src="/fourth-backup.png"
            src="/img/alertmind_GIF.gif"
            alt="dashboard"
            height="1000"
            width="1000"
            className="w-full rounded-lg shadow-xl shadow-brand/[0.2]"
            unoptimized
          />
        </ImageContainer>
      ),
    },
    // {
    //   icon: <IconTerminal className="h-8 w-8 text-secondary" />,
    //   title: "Apps Automation",
    //   description:
    //     "We have cloned zapier and built our very own apps automation platform.",
    //   content: (
    //     <ImageContainer>
    //       <BlurImage
    //         src="/third.png"
    //         alt="dashboard"
    //         height="1000"
    //         width="1000"
    //         className="w-full rounded-lg shadow-xl shadow-brand/[0.2]"
    //       />
    //     </ImageContainer>
    //   ),
    // },
  ];
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const backgrounds = [
    "var(--charcoal)",
    "var(--neutral-900)",
    // "var(--gray-900)",
  ];
  const index = Math.round(scrollYProgress.get() * (backgrounds.length - 1));

  const [gradient, setGradient] = useState(backgrounds[0]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const cardsBreakpoints = content.map((_, index) => index / content.length);
    const closestBreakpointIndex = cardsBreakpoints.reduce(
      (acc, breakpoint, index) => {
        const distance = Math.abs(latest - breakpoint);
        if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
          return index;
        }
        return acc;
      },
      0
    );
    setGradient(backgrounds[closestBreakpointIndex % backgrounds.length]);
  });
  return (
    <motion.div
      animate={{
        background: gradient,
      }}
      transition={{
        duration: 0.5,
      }}
      ref={ref}
      className="w-full relative h-full pt-20 md:pt-40"
      data-section="Tools"
    >
      <div className="px-6">
        <FeatureIconContainer className="flex justify-center items-center overflow-hidden">
          <IconTool className="h-6 w-6 text-cyan-500" />
        </FeatureIconContainer>
        <Heading className="mt-4">Purpose Built Tools for Every Kubernetes Challenge</Heading>
        <Subheading>
          AlertMend delivers targeted solutions for the most common and critical problems in your stack. Built by SREs, for SREs.


        </Subheading>
      </div>
      <StickyScroll content={content} />
    </motion.div>
  );
};

const ImageContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg relative shadow-2xl">
      {children}
      <div className="absolute bottom-0 w-full h-px inset-x-0 bg-gradient-to-r from-transparent via-secondary to-transparent" />
      <div className="absolute bottom-0 w-40 mx-auto h-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </div>
  );
};
