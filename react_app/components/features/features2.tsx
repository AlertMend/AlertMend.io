"use client";
import Image from "next/image";
import Marquee from "react-fast-marquee";

export function Features2() {
  const logos = [
    {
      name: "Azure",
      src: "img/tech/Azure_logo.png",
    },
    {
      name: "AWS",
      src: "img/tech/Aws.png",
    },
    {
      name: "DataDog",
      src: "img/tech/datadog.png",
    },
    {
      name: "Kubernetes",
      src: "img/tech/Kubernetees_logo.png",
    },
    {
      name: "Jenkins",
      src: "img/tech/jenkin.png",
    },
    {
      name: "Slack",
      src: "img/tech/slack.png",
    },
    {
      name: "Pagerduty",
      src: "img/tech/pagerduty.png",
    },
    {
      name: "Webhook",
      src: "img/tech/webhooks.svg",
    },
    {
      name: "Prometheus",
      src: "img/tech/prometheus.png",
    },
    {
      name: "GoogleCloud",
      src: "img/tech/googlecloud.png",
    },
    {
      name: "Jira",
      src: "img/tech/jira.png",
    },
    {
      name: "Grafana",
      src: "img/tech/grafana.png",
    },
    {
      name: "Msteam",
      src: "img/tech/MS_Team_Logo.png",
    }
  ];

  return (
    <div className="relative z-20 px-4 py-10 md:px-8 md:py-40" 
      data-section="Features"
    >
      <h2 className="bg-gradient-to-b bg-clip-text text-center font-sans text-2xl font-bold md:text-5xl  text-neutral-300 stext-transparent sfrom-white sto-neutral-600">
       Automate Your Kubernetes Ops
      </h2>
      <p className="mt-4 text-center font-sans text-base text-neutral-300">
        AlertMend comes with a wide range of integrations and powerful pre-built workflows to 
        <br/> automate alert response, remediation, and cost optimization, helping your team get value, fast.
      </p>

      <div className="relative mx-auto mt-20 flex h-full w-full max-w-7xl flex-wrap justify-center gap-10 [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
        <Marquee pauseOnHover direction="right">
          {logos.map((logo, idx) => (
            <Image
              key={logo.name + "logo-marquee" + idx}
              src={`/${logo.src}`}
              alt={logo.name}
              width="70"
              height="70"
              className="mx-0 object-contain filter md:mx-10 dark:invert"
            />
          ))}
        </Marquee>
      </div>
      <div className="relative mx-auto mt-4 flex h-full w-full max-w-7xl flex-wrap justify-center gap-10 [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)] md:mt-20 md:gap-40">
        <Marquee pauseOnHover direction="left">
          {logos.map((logo, idx) => (
            <Image
              key={logo.name + "logo-marquee-second" + idx}
              src={`/${logo.src}`}
              alt={logo.name}
              width="70"
              height="70"
              className="mx-0 object-contain filter md:mx-10 dark:invert"
            />
          ))}
        </Marquee>
      </div>
    </div>
  );
}
