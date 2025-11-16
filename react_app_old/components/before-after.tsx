"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Container } from "./container";
import { IconPhoneEnd, IconTimeDuration15, IconZoomMoney } from "@tabler/icons-react";
import React from "react";
import { useId } from "react";

function StatsWithGridBackground() {
  const items = [
    {
      title: "Engineering Time Saved",
      icon: IconTimeDuration15,
      value: "~45 mins",
    },
    {
      title: "Cost Avoided in downtime and productivity",
      icon: IconZoomMoney,
      value: "$3000",
    },
    {
      title: "On-Call Stress",
      icon: IconPhoneEnd,
      value: "Eliminated",
    },
  ];
  return (
    <div className="py-20">
      <div className="mx-auto max-w-7xl border border-neutral-800">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {items.map((item, index) => (
            <div
              key={"card" + index}
              className={cn(
                "group/card relative overflow-hidden p-10",
                index !== items.length - 1 &&
                  "border-b border-neutral-800 md:border-b-0 md:border-r",
              )}
            >
              <Grid size={20} />
              <EdgeElement />

              <div className="flex items-center gap-2">
                <IconContainer>
                  <item.icon className="text-white" />
                </IconContainer>
                <p className="text-3xl font-bold text-neutral-200">
                  {item.value}
                </p>
              </div>
              <p className="text-balance text-balance mt-4 text-base text-neutral-300">
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const EdgeElement = () => {
  return (
    <div className="absolute right-0 top-0 h-10 w-10 overflow-hidden border-b border-l  transition duration-200 group-hover/card:-translate-y-14 group-hover/card:translate-x-14 border-neutral-800 bg-neutral-900 shadow-[-3px_4px_9px_0px_rgba(255,255,255,0.2)]">
      <div className="absolute left-0 top-0 h-[1px] w-[141%] origin-top-left rotate-45 bg-neutral-800" />
    </div>
  );
};
const IconContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-b to-[50%] p-1 from-neutral-800 to-black">
      <div className="flex h-full w-full items-center justify-center rounded-lg bg-gradient-to-b from-[#5D5D5D] to-neutral-900">
        {children}
      </div>
    </div>
  );
};

const Grid = ({
  pattern,
  size,
}: {
  pattern?: number[][];
  size: number;
}) => {
  const p = pattern ?? [
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
  ];
  return (
    <div className="pointer-events-none absolute left-1/2 top-0 -ml-20 -mt-2 h-full w-full [mask-image:linear-gradient(white,transparent)]">
      <div className="absolute inset-0 bg-gradient-to-r opacity-100 [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] from-zinc-900/30 to-zinc-900/30">
        <GridPattern
          width={size ?? 20}
          height={size ?? 20}
          x="-12"
          y="4"
          squares={p}
          className="absolute inset-0 h-full w-full mix-blend-overlay fill-white/10 stroke-white/10"
        />
      </div>
    </div>
  );
};

function GridPattern({
  width,
  height,
  x,
  y,
  squares,
  ...props
}: {
  width: number;
  height: number;
  x: number | string;
  y: number | string;
  squares: number[][];
} & React.SVGProps<SVGSVGElement>) {
  const patternId = useId();

  return (
    <svg aria-hidden="true" {...props}>
      <defs>
        <pattern
          id={patternId}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path d={`M.5 ${height}V.5H${width}`} fill="none" />
        </pattern>
      </defs>
      <rect
        width="100%"
        height="100%"
        strokeWidth={0}
        fill={`url(#${patternId})`}
      />
      {squares && (
        <svg x={x} y={y} className="overflow-visible">
          {squares.map(([x, y],index) => (
            <rect
              strokeWidth="0"
              key={`${index} sizes`}
              width={width + 1}
              height={height + 1}
              x={x * width}
              y={y * height}
            />
          ))}
        </svg>
      )}
    </svg>
  );
}



// Local Card Component
function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-neutral-900 border border-neutral-800 shadow-xl",
        className
      )}
    >
      {children}
    </div>
  );
}

function CardContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("p-6 md:p-10", className)}>{children}</div>;
}

export default function BeforeAfter() {
  return (
    <Container className="py-40 px-6"
        data-section="Before vs After"
        >
    <main className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-start">
      {/* Hero Section */}
      <section className="w-full text-center py-20">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-bold mb-4"
        >
           Before vs After AlertMend: A Real Incident Flow
        </motion.h1>
      </section>

      {/* Comparison Table Section */}
      <section className="w-full max-w-6xl px-4 md:px-0">
        <Card className="bg-neutral-900 border border-neutral-800 shadow-xl rounded-2xl overflow-hidden">
          <CardContent className="p-6 md:p-10">

            <div className="overflow-x-auto">
              <table className="w-full text-sm md:text-base text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-800 text-neutral-300">
                    <th className="p-4 font-semibold">Alert</th>
                    <th className="p-4 font-semibold">Before AlertMend</th>
                    <th className="p-4 font-semibold">After AlertMend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  <tr>
                    <td className="p-4">Step 1</td>
                    <td className="p-4">Engineer wakes up, logs into Slack, checks logs manually</td>
                    <td className="p-4">AlertMend analyzes logs, confirms CrashLoop pattern</td>
                  </tr>
                  <tr>
                    <td className="p-4">Step 2</td>
                    <td className="p-4">SSH into cluster, fetch pod logs, check for OOM or config issues</td>
                    <td className="p-4">Auto-runs validated remediation flow (restart with adjusted memory)</td>
                  </tr>
                  <tr>
                    <td className="p-4">Step 3</td>
                    <td className="p-4">Escalate to SRE lead due to repeat crashes</td>
                    <td className="p-4">Recovery confirmed within 2 minutes</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold">Resolution Time</td>
                    <td className="p-4 font-bold">~48 minutes</td>
                    <td className="p-4 font-bold">2.4 minutes</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold">Impact</td>
                    <td className="p-4">Lost sleep, burnout, risk of downtime</td>
                    <td className="p-4">Uptime maintained, no human intervention</td>
                  </tr>
                </tbody>
              </table>
            </div>

          </CardContent>
        </Card>
        <StatsWithGridBackground/>

        {/* Gradient Feedback Box */}
        <div className="mt-10 p-15 text-center text-2xl bg-gradient-to-b from-neutral-900 to-neutral-950 p-10 rounded-3xl">
          <p className="text-center text-3xl font-bold mb-6">Engineer Feedback</p>
          &ldquo;Before AlertMend, every alert was a manual fire drill. Now, most incidents are auto-resolved while I’m asleep.&rdquo;
        </div>
      </section>
    </main>
    </Container>
  );
}
