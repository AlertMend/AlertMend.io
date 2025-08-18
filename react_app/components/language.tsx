"use client";
import { motion } from "framer-motion";
import React, { useRef, useState } from "react";
import { FeatureIconContainer } from "./features/feature-icon-container";
import { Heading } from "./heading";
import { Subheading } from "./subheading";
import {
  IconWorld,
} from "@tabler/icons-react";
import { useScroll } from "framer-motion";
import { Container } from "./container";
import Image from "next/image";

export const Language = () => {
 
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

  return (
    <motion.div
      animate={{
        background: gradient,
      }}
      transition={{
        duration: 0.5,
      }}
      ref={ref}
      className="w-full relative h-full pt-0 md:pt-0 pb-20"
      data-section="Language"
    >
      <div className="px-6">
        {/* <FeatureIconContainer className="flex justify-center items-center overflow-hidden">
          <IconWorld className="h-6 w-6 text-cyan-500" />
        </FeatureIconContainer> */}
        <Heading className="mt-4">Available in Your Language</Heading>
        <Subheading>
  <p>
    AlertMend supports multiple languages including Vietnamese, Japanese, and more
    so you can use the app in the language you&apos;re most comfortable with.
  </p>
   <div className="flex mt-10 items-center justify-center gap-4">
    <Container className="rounded-lg bg-neutral-900 border border-neutral-800 shadow-sm mx-0 p-2">
      <Image src={'/img/flag/icon-flag-vn.svg'} width={'30'} height={'30'} alt={'flag-vn'} />
    </Container>
    <Container className="rounded-lg bg-neutral-900 border border-neutral-800 shadow-sm mx-0 p-2">
      <Image src={'/img/flag/icon-flag-ja.svg'} width={'30'} height={'30'} alt={'flag-ja'} />
    </Container>
  </div>
  {/* <p className="mt-2">
    Just choose your preferred language from the menu and you&apos;re ready to go.
  </p> */}
</Subheading>
      </div>
    </motion.div>
  );
};
