"use client";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Hero } from "./hero";
import { HeroCluster } from "./hero-cluster";
import { HeroCostOptimization } from "./hero-cost-optimization";
import { HeroOnCall } from "./hero-oncall";

function HeroContent() {
  const sParams = useSearchParams();
  const service = sParams.get("service") || "";

  if (service === "on-call") return <HeroOnCall />;
  if (service === "cost-optimization") return <HeroCostOptimization />;
  if (service === "cluster") return <HeroCluster />;
  return <Hero />; // Default when no service param
}

export const HeroMain = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeroContent />
    </Suspense>
  );
};
