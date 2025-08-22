"use client";
import React, { useState } from "react";
import Accordion from "./accordion";
import { Heading } from "./heading";

const questions = [
  {
    id: 1,
    title: "What problems does AlertMend solve?",
    description:
      "AlertMend helps DevOps and SRE teams reduce manual toil, eliminate alert fatigue, and fix infrastructure issues faster — whether in Kubernetes or VM environments.",
  },
  {
    id: 2,
    title: "How is AlertMend different from just using monitoring tools?",
    description:
      "Monitoring tools only tell you what’s wrong. AlertMend takes the next step — it automatically fixes known issues or routes them for fast approval, so you don’t waste time on the same alerts over and over.",
  },
  {
    id: 3,
    title: "Can AlertMend fix Kubernetes issues without manual intervention?",
    description:
      "Yes. AlertMend can detect and auto-remediate issues like pod restarts, CrashLoopBackOff, PVC pressure, unhealthy workloads, and more — either instantly or after Slack/email approval.",
  },
  {
    id: 4,
    title: "What kinds of problems can AlertMend handle on VMs?",
    description:
      "AlertMend supports actions like restarting failed services, cleaning up disk space, rebooting VMs, or running custom remediation scripts — helping you manage both containerized and legacy infrastructure.",
  },
  {
    id: 5,
    title: "Can I trust AlertMend to act on its own?",
    description:
      "Yes. You can fully control how and when actions run — automatically, with approval, or in dry-run mode. Every step is logged, reported, and auditable.",
  },
  {
    id: 6,
    title: "Can AlertMend help me understand why issues happen (RCA)?",
    description:
      "Yes. AlertMend includes Root Cause Analysis for failed workloads and incidents. It correlates logs, metrics, and deployment history to explain why something failed — not just what failed.",
  },
  {
    id: 7,
    title: "How does AlertMend help with Kubernetes management?",
    description:
      "AlertMend continuously scans your clusters for reliability risks — including unhealthy pods, misconfigured resources, overprovisioned workloads, and missing probes. It helps you fix them with one click or automate them entirely.",
  },
  {
    id: 8,
    title: "How does AlertMend integrate with my existing stack?",
    description:
      "AlertMend connects with Prometheus, Datadog, Alertmanager, CloudWatch, New Relic, and more — and works with your existing alerting channels like Slack, Teams, and email.",
  },
  {
    id: 9,
    title: "Does AlertMend help reduce on-call load?",
    description:
      "Definitely. It handles routine, repeatable issues automatically — so your on-call engineers are only interrupted when truly needed.",
  }
];

export const FAQs = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="max-w-3xl mx-auto pt-20 px-8" data-section="FAQs">
      <Heading className="pt-4">Frequently asked questions</Heading>
      <div className="grid gap-5 pt-10">
        {questions.map((item, i) => (
          <Accordion
            key={i}
            data-section={"FAQ: "+ item.title}
            i={i}
            expanded={expanded}
            setExpanded={setExpanded}
            title={item.title}
            description={item.description}
          />
        ))}
      </div>
    </div>
  );
};
