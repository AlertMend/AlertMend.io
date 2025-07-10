"use client";
import React, { useState } from "react";
import { Container } from "./container";
import { IconCheck } from "@tabler/icons-react";
import { CustomLink } from "./custom-link";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import Balancer from "react-wrap-balancer";
import Beam from "./beam";
import { Switch } from "./switch";
import { Clients } from "./clients";

export const PricingGrid = () => {
  const tiers = [
    {
      title: "SRE/DevOps Playground",
      description: "For individuals trying out the product",
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [
        "Access to all tools for 14 days",
        "No credit card required",
        "Community Support",
        <span key="access">
          Access to{" "}
          <CustomLink href="https://ui.aceternity.com">
            Aceternity UI
          </CustomLink>
        </span>,
      ],
      onClick: () => {
        console.log("clicked");
        window.open("https://demo.alertmend.io/signup", "_blank");
      },
      ctaText: "Get Started",
    },
    {
      title: "Startups",
      description: "",
      monthlyPrice: "50/month + Per VM $10",
      yearlyPrice: "50/month + Per VM $10",
      features: [
        "Unlimited Remediation Flows",
        "Unlimited integrations",
        "AI-Generated RCA",
        "Support: within 24 hours",
      ],
      onClick: () => {
        console.log("clicked");
        window.open("https://demo.alertmend.io/signup", "_blank");
      },
      ctaText: "Get Started",
    },
    {
      title: "Growth",
      description: "",
      monthlyPrice: "500/month + $10/month Per VM $1000",
      yearlyPrice: "500/month + $10/month Per VM $1000",
      features: [
        "For >10 VMs or Kubernetes <100 pods",
        "Unlimited Remediation Flows",
        "Unlimited integrations",
        "AI-Generated RCA",
        "Support: within 6 hours"
      ],
      featured: true,
      onClick: () => {
        console.log("clicked");
        window.open("https://demo.alertmend.io/signup", "_blank");
      },
      ctaText: "Get Started",
    },
    {
      title: "Enterprise/Custom",
      description: "",
      monthlyPrice: "Contact Us for Pricing",
      yearlyPrice: "Contact Us for Pricing",
      features: [
        "Unlimited VMs & Kubernetes",
        "Unlimited Remediation Flows",
        "Unlimited integrations",
        "AI-Generated RCA",
        "Support: within 30 min + Slack/Teams",
      ],
      onClick: () => {
        console.log("clicked");
        window.open("https://demo.alertmend.io/signup", "_blank");
      },
      ctaText: "Book a demo",
    },
  ];
  const [checked, setChecked] = useState(false);
  return (
    <div>
      <div className="flex justify-center" data-section="Pricing">
        <Switch checked={checked} setChecked={setChecked} />
      </div>
      <Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-4 py-20">
        {tiers.map((tier, index) => (
          <div
            key={tier.title + index}
            data-section={"Pricing Plan: " + tier.title }
            className={cn(
              "flex flex-col justify-between items-start px-6 py-4 rounded-lg relative overflow-hidden",
              tier.featured &&
                "bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-neutral-900 to-neutral-950"
            )}
          >
            {tier.featured && <Beam showBeam className="top-0 block" />}
            <div>
              <h3 className="text-base font-normal">{tier.title}</h3>
              <p className="text-lg text-neutral-400 mt-4 font-medium">
                {tier.title === "Enterprise"
                  ? "Custom"
                  : `$${checked ? tier.yearlyPrice : tier.monthlyPrice} / ${
                      checked ? "year" : "month"
                    }`}
              </p>
              <p className="text-sm text-neutral-4000 mt-4">
                {tier.description}
              </p>
              <div className="mt-4">
                {tier.features.map((feature, idx) => (
                  <Step key={`feature-${index}-${idx}`}>{feature}</Step>
                ))}
              </div>
            </div>
            <Button
              variant={tier.featured ? "primary" : "muted"}
              onClick={tier.onClick}
              className="mt-4"
            >
              {tier.ctaText}
            </Button>
          </div>
        ))}
      </Container>
      {/* <Clients /> */}
    </div>
  );
};

const Step = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex gap-2 items-start my-4">
      <IconCheck className="h-4 w-4 text-neutral-300 mt-0.5" />
      <div className="text-sm text-neutral-400">
        <Balancer>{children}</Balancer>
      </div>
    </div>
  );
};
