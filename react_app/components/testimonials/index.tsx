"use client";
import React from "react";
import { TestimonialsSlider } from "./slider";
import { FeatureIconContainer } from "../features/feature-icon-container";
import { Heading } from "../heading";
import { Subheading } from "../subheading";
import { TbLocationBolt } from "react-icons/tb";
import { cn } from "@/lib/utils";
import { testimonials } from "@/constants/page-testimonials";
import Image from "next/image";
import { TestimonialsGrid } from "./grid";
import { AmbientColor } from "../ambient-color";
import { TestimonialsSlider2 } from "./slider2";

export const Testimonials = () => {
  return (
    <div className="relative pt-20">
      <AmbientColor />
      <div className="pb-20">
        <FeatureIconContainer className="flex justify-center items-center overflow-hidden">
          <TbLocationBolt className="h-6 w-6 text-cyan-500" />
        </FeatureIconContainer>
        <Heading className="pt-4">Loved by Engineers. Built for Impact.</Heading>
        <Subheading>
          AlertMend powers the people behind today’s most reliable systems.
        </Subheading>
      </div>

      <div className="py-60 relative">
        <div className="absolute inset-0 h-full w-full bg-charcoal opacity-30 [mask-image:radial-gradient(circle_at_center,transparent_10%,white_90%)]">
          <TestimonialsGrid />
        </div>
        <TestimonialsSlider />
      </div>
      <div className="absolute bottom-0 inset-x-0 h-40 w-full bg-gradient-to-t from-charcoal to-transparent"></div>
    </div>
  );
};


export const Testimonials2 = ({testimonials}:any) => {
  return (
    <div className="relative">
      <AmbientColor />
      <div className="pb-0">
        <FeatureIconContainer className="flex justify-center items-center overflow-hidden">
          <TbLocationBolt className="h-6 w-6 text-cyan-500" />
        </FeatureIconContainer>
        <Heading className="pt-4">Case Studies</Heading>
        <Subheading>
          AlertMend powers the people behind today’s most reliable systems.
        </Subheading>
      </div>

      <div className="pb-30 relative">
        {/* <div className="absolute inset-0 h-full w-full bg-charcoal opacity-30 [mask-image:radial-gradient(circle_at_center,transparent_10%,white_90%)]">
          <TestimonialsGrid />
        </div> */}
        <TestimonialsSlider2 page_testimonials={testimonials}/>
      </div>
      {/* <div className="absolute bottom-0 inset-x-0 h-40 w-full bg-gradient-to-t from-charcoal to-transparent"></div> */}
    </div>
  );
};