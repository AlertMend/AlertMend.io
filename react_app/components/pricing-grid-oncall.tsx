"use client";
import React from "react";
import { Container } from "./container";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import Balancer from "react-wrap-balancer";

export const PricingGridOnCall = () => {
  const tiers = [
    {
      title: "Starter — Free",
      description: "For individuals and small teams just getting started",
      price: "$0 / forever",
      features: [
        "5 min. monitoring interval",
        "Status page on AlertMend subdomain only",
        "Basic on-call rotation",
        "Slack & Teams alerts",
        "20 monitors included",
        "No call / WhatsApp",
      ],
      onClick: () => {
        window.open("https://demo.alertmend.io/signup", "_blank");
      },
      ctaText: "Start Free",
    },
    {
      title: "Pro — Startup Plan",
      description: "For growing teams that need reliability",
      price: "$9 / month",
      features: [
        "30 sec. monitoring interval",
        "AI-powered incident summaries",
        "Multi-region checks",
        "Voice, Call & WhatsApp escalations",
        "Internal & public status pages (with custom domain)",
        "Exportable audit logs",
        "Priority support",
      ],
      featured: true,
      onClick: () => {
        window.open("https://demo.alertmend.io/signup", "_blank");
      },
      ctaText: "Upgrade Now",
    },
  ];

  return (
    <Container className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10">
      {tiers.map((tier, index) => (
        <div
          key={tier.title + index}
          className={cn(
            "flex flex-col justify-between items-start px-6 py-6 rounded-xl border shadow-sm relative overflow-hidden",
            tier.featured &&
              "bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-neutral-900 to-neutral-950 text-white border-neutral-700"
          )}
        >
          <div>
            <h3 className="text-lg font-semibold">{tier.title}</h3>
            <p className="text-sm text-neutral-400 mt-2">{tier.description}</p>
            <p className="text-xl font-bold mt-4">{tier.price}</p>
            <div className="mt-4 space-y-2">
              {tier.features.map((feature, idx) => (
                <Step key={`${tier.title}-feature-${idx}`}>{feature}</Step>
              ))}
            </div>
          </div>
          <Button
            variant={tier.featured ? "primary" : "muted"}
            onClick={tier.onClick}
            className="mt-6 w-full"
          >
            {tier.ctaText}
          </Button>
        </div>
      ))}
    </Container>
  );
};

const Step = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex gap-2 items-start text-sm">
      <Balancer>{children}</Balancer>
    </div>
  );
};
