import React from "react";
import { Grid } from "./grid";

export const FeaturesGrid = () => {
  const kubernetesGrid = [
    {
      title: "Auto-Recover CrashLooping Pods",
      description:
        "Upon receiving CrashLoopBackOff alerts, automatically restart or redeploy affected pods.",
    },
    {
      title: "Dynamic PVC (Persistent Volume) Resizing",
      description:
        "Resize persistent volumes automatically when storage usage alerts are triggered.",
    },
    {
      title: "Automated Response to Slow-Booting Pods",
      description:
        "On alerts about slow pod startups, initiate diagnostics or restart workflows.",
    },
    {
      title: "Cluster Diagnostics Capture on Failure Alerts",
      description:
        "When failure alerts occur, automatically collect cluster state for faster root cause analysis. Auto-rollback or retry Kubernetes deployments.",
    },
    {
      title: "Auto-Restart Pods on High Memory/CPU Usage",
      description:
        "Detect threshold breaches and restart or reschedule workloads proactively before performance degradation occurs.",
    },
    {
      title: "Deployment Rollback on Failed Health Checks",
      description:
        "If a new deployment fails health checks, automatically roll back to the last known good version without manual intervention.",
    },
  ];

  const vmGrid = [
    {
      title: "Predictive Disk and Log Space Management",
      description:
        "Monitor disk usage and automate disk resizing or log cleanup before storage issues cause downtime.",
    },
    {
      title: "CPU and Resource Utilization Monitoring",
      description:
        "Detect high CPU, memory, or swap usage, and auto-throttle or remediate overloaded VMs.",
    },
    {
      title: "Network Health Monitoring and Recovery",
      description:
        "Continuously check VM connectivity and auto-trigger failover or restart actions for unresponsive systems.",
    },
    {
      title: "Custom Monitoring with User-Defined Scripts",
      description:
        "Enable teams to configure custom shell-based monitors, create alerts,and automate tailored remediation flows.",
    },
    {
      title: "App Down? Auto-Restart to the Rescue",
      description:
        "Detect failed services with smart probes and restart them instantly —before your users notice or support tickets pile up.",
    },
    {
      title: "Hanging App? Auto-Restart Frozen Services",
      description:
        "When an app stops responding but doesn’t crash, AlertMend detects the freeze and restarts it — no waiting for user complaints or painful manual checks.",
    },
  ];
  const dataGrid = [
    {
      title: "Cassandra Health Monitoring",
      description:
        "Run canary queries to monitor health and detect stuck nodes in joining or moving states, triggering auto-remediation.",
    },
    {
      title: "Cassandra Disk Optimization",
      description:
        "Monitor disk usage and automate cleanup and compaction processes to maintain optimal database performance.",
    },
    {
      title: "Kafka Cluster Leadership and Partition Balancing",
      description:
        "Detect leadership changes and trigger automated load rebalancing or repartitioning to maintain data flow stability.",
    },
    {
      title: "Kafka Retry and Lag Management",
      description:
        "Monitor queue sizes and dynamically adjust producer/consumer retry settings to prevent message loss or processing delays.",
    },
    {
      title: "Kafka: Automatic Data Repartitioning",
      description:
        "Automatically adjust partitioning to balance load and reduce data processing bottlenecks.",
    },
    {
      title: "Kafka: Monitoring and Adjusting Retries",
      description:
        "Continuously monitor retry metrics and fine-tune settings to avoid message loss or duplication.",
    },
  ];
  const incidentGrid = [
    {
      title: "Instant Ticket Creation & Status Updates",
      description:
        "Auto-create, assign, and update Jira, PagerDuty, or Opsgenie tickets when alerts are triggered. Link diagnostic logs and resolution steps automatically inside tickets.",
    },
    {
      title: "Dynamic Status Page Management",
      description:
        "Automatically update public or internal Status.io pages based on incident severity and recovery. Auto-rollback statuses when services restore.",
    },
    {
      title: "Slack/Teams War Room Automation",
      description:
        "Instantly spin up incident-specific Slack channels. Auto-post system checks, recovery progress, and ticket updates inside war rooms.",
    },
    {
      title: "Multi-Channel Stakeholder Alerts",
      description:
        "Escalate based on severity. Auto-notify engineering leads, product managers, or execs via Slack, email, or SMS — no missed comms.",
    },
    {
      title: "Auto-Close Tickets After Remediation",
      description:
        "Once remediation is verified, AlertMend updates or closes the ticket with a summary of what was fixed — including logs and fix steps.",
    },
    {
      title: "Incident Timeline & Summary Generation",
      description:
        "Capture every alert, action, and recovery step. Generate a clean timeline for postmortems, compliance, or engineering retros.",
    },
  ];
  const debugGrid = [
    {
      title: "High-CPU Pod/VM Detection and Isolation",
      description:
        "Auto-detect CPU resource spikes. Tag pods/VMs with warning labels or throttle non-critical workloads automatically.",
    },
    {
      title: "Critical Error Log Aggregation",
      description:
        "Collect and compress service logs (e.g., Tomcat, Nginx, Cassandra) upon detecting error thresholds. Attach logs directly to incidents without manual fetching.",
    },
    {
      title: "Multi-Region Cloud Health Checks",
      description:
        "Run parallel automated ping, curl, and API probes across AWS, GCP, Azure regions. Auto-isolate region-specific failures and escalate accordingly.",
    },
    {
      title: "Resource Exhaustion Pre-Warnings",
      description:
        "Auto-monitor system resource limits (CPU throttling, FD exhaustion, Memory Swap). Raise proactive alerts before issues manifest into downtime.",
    },
    {
      title: "Auto-Dump JVM or Python Stack Traces on Errors",
      description:
        "Detect long GC pauses, heap pressure, or Python exceptions. Automatically trigger stack dumps for postmortem use.",
    },
    {
      title: "Live Infra Snapshot for On-Call Triage",
      description:
        "Auto-capture node states, network flows, and logs when incidents fire. Package data into one-click on-call summary (no terminal needed).",
    },
  ];
  const remediationGrid = [
    {
      title: "Predictive Disk Auto Scaling",
      description:
        "Monitor disk usage trends. Auto-extend cloud volumes (AWS EBS, GCP PD, Azure Disk) before reaching critical thresholds.",
    },
    {
      title: "Smart Log Rotation and Cleanup",
      description:
        "Auto-purge old application logs. Compress and archive logs if disk utilization crosses 80%, keeping critical apps online.",
    },
    {
      title: "JVM GC and Memory Auto-Healing",
      description:
        "Detect garbage collection freezes or memory spikes. Gracefully restart JVM processes or trigger heap dumps for post-mortem.",
    },
    {
      title: "Kubernetes CrashLoop Auto-Recovery",
      description:
        "Detect pods stuck in CrashLoopBackOff or ImagePull errors. Auto-redeploy pods with increased timeout thresholds or alternate replica sets.",
    },
    {
      title: "Service Auto-Restart on Health Check Failure",
      description:
        "Continuously monitor service endpoints. If a liveness or readiness probe fails, restart the service gracefully to restore availability.",
    },
    {
      title: "Auto-Rollback on Failed Deployments",
      description:
        "Detect failed canary or blue-green deployments using health checks or metrics. Instantly roll back to the last known good state — no human decision-making needed.",
    },
  ];
  
  
  
  const renderSection = (title: string, subtitle: string, items: any[]) => (
    <div className="py-5 lg:py-10">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white">
          {title}
        </h2>
        <p className="mt-4 text-lg text-neutral-400">{subtitle}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
        {items.map((feature) => (
          <div
            key={feature.title}
            className="relative bg-gradient-to-b from-neutral-900 to-neutral-950 p-6 rounded-3xl overflow-hidden"
          >
            <Grid size={20} />
            <p className="text-base font-bold text-white relative z-20">
              {feature.title}
            </p>
            <p className="text-neutral-400 mt-4 text-base font-normal relative z-20">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {renderSection(
        "Kubernetes Use Cases",
        "Automation-Driven Resilience for Modern Clusters.",
        kubernetesGrid
      )}
      {renderSection(
        "VM Use Cases",
        "Unified Monitoring and Remediation for Virtual Machines.",
        vmGrid
      )}
       {renderSection(
        "Data-Specific Use Cases (Cassandra & Kafka)",
        "Ensuring Resilience and Performance Across Distributed Systems",
        dataGrid
      )}
      {renderSection(
        "Incident Management Workflow Examples",
        "Real-time automation across incidents, system health, and communication.",
         incidentGrid
      )}
      {renderSection(
        "Debugging & Interactive Querying Examples",
        "Auto-capture diagnostics needed for faster root cause analysis.",
         debugGrid
       )}
       {renderSection(
        "Automated Remediation Workflow Examples",
        "Self-healing workflows to resolve incidents without human intervention.",
        remediationGrid
       )}


    </>
  );
};
