import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: 'What problems does AlertMend solve?',
      answer: 'AlertMend eliminates Kubernetes firefighting by automating incident detection, root-cause analysis, and remediation. It fixes issues like CrashLoopBackOff, OOMKilled, 5xx errors, failing rollouts, node pressure, disk full, cost inefficiencies, and more—without manual intervention.',
    },
    {
      question: 'How does AlertMend automatically fix CrashLoopBackOff errors in Kubernetes?',
      answer: 'AlertMend analyzes logs, checks readiness/liveness probes, validates config and secrets, detects OOMKilled events, and applies automated remediations such as restarts, patching configs, adjusting limits, or recreating dependent services. This resolves CrashLoopBackOff incidents in seconds.',
    },
    {
      question: 'Can AlertMend detect and fix Kubernetes 5xx errors?',
      answer: 'Yes. AlertMend monitors API latency, service health, and ingress failures to detect 500/502/503/504 spikes. It then auto-restores service health by restarting pods, scaling replicas, draining problematic nodes, or adjusting readiness probes.',
    },
    {
      question: 'Can AlertMend troubleshoot and fix failed Kubernetes rollouts?',
      answer: 'Absolutely. AlertMend detects failed deployments caused by unhealthy pods, image pull errors, failing probes, or misconfigurations. It can rollback automatically or restore to the last known good state.',
    },
    {
      question: 'How is AlertMend different from monitoring tools like Prometheus, Datadog, and Grafana?',
      answer: 'Monitoring tools show alerts. AlertMend fixes the root cause. It takes signals from Datadog/Prometheus/CloudWatch and performs automated remediation—reducing MTTR and minimizing on-call fatigue.',
    },
    {
      question: 'Does AlertMend support GitOps and CI/CD error troubleshooting?',
      answer: 'Yes. AlertMend detects deployment failures related to Git issues such as: "fatal: refusing to merge unrelated histories", "error: failed to push some refs", Exit code 1 build failures. It notifies the team and can auto-retry or rollback via ArgoCD or Flux.',
    },
    {
      question: 'Can AlertMend fix OOMKilled and resource exhaustion issues?',
      answer: 'Yes. AlertMend identifies memory leaks, CPU spikes, and resource starvation. It automatically adjusts pod limits, restarts containers, or scales replicas to restore service stability.',
    },
    {
      question: 'Does AlertMend reduce cloud and Kubernetes costs?',
      answer: 'AlertMend reduces cloud spend by 40–70% with AI-driven rightsizing, autoscaling optimization, unused resource cleanup, spot instance controls, stale PVC removal, and cluster-efficiency tuning.',
    },
    {
      question: 'How does AlertMend compare to Komodor?',
      answer: 'Komodor provides Kubernetes troubleshooting visibility. AlertMend goes beyond visibility by offering true auto-remediation. Where Komodor shows what happened, AlertMend actually fixes it automatically.',
    },
    {
      question: 'How does AlertMend compare to Shoreline?',
      answer: 'Shoreline offers scripted runbooks. AlertMend provides AI-driven automations with Slack approvals, predefined workflows, cluster insights, and easier onboarding for smaller teams. AlertMend is built for fast setup and automatic fixes, not manual scripting.',
    },
    {
      question: 'Does AlertMend replace PagerDuty, OpsGenie, or Grafana OnCall?',
      answer: 'AlertMend includes an intelligent on-call system with Slack/Teams/WhatsApp/phone alerts, but unlike PagerDuty—it also remediates the incident automatically. Fewer alerts. Faster fixes.',
    },
    {
      question: 'Can AlertMend detect and fix "openocd exited with code 1" or other exit code errors?',
      answer: 'Yes. AlertMend analyzes build logs and identifies root causes of exit code failures, suggesting or executing the fix automatically through pipelines or GitOps flows.',
    },
    {
      question: 'What makes AlertMend different from Rancher?',
      answer: 'Rancher manages clusters. AlertMend manages cluster reliability. Rancher handles provisioning; AlertMend handles troubleshooting + auto-remediation inside the cluster. They are complementary tools.',
    },
    {
      question: 'Can AlertMend help SRE/DevOps teams reduce on-call noise?',
      answer: 'Yes. By automating noisy and repeatable tasks—restart loops, disk full issues, node drains, rollout failures—AlertMend reduces alert fatigue by up to 80%.',
    },
    {
      question: 'How does AlertMend integrate with AWS, GCP, Azure, and on-prem?',
      answer: 'AlertMend deploys as a lightweight agent via Helm and connects securely using TLS/mTLS. It supports: EKS / GKE / AKS, EC2, VMs, ECS/Fargate, Bare-metal clusters, Private VPC-only clusters.',
    },
    {
      question: 'Is AlertMend secure?',
      answer: 'Yes. AlertMend follows SOC2-ready design principles with encrypted communication, RBAC, no customer data access, audit logs, optional mTLS, and compliance integrations via SPIFFE/SPIRE or cert-manager.',
    },
    {
      question: 'Who is AlertMend best suited for?',
      answer: 'Kubernetes-based startups, SaaS companies, DevOps/SRE teams, Companies scaling clusters, Teams without 24/7 SRE coverage, Engineering teams seeking automated reliability + cost reduction.',
    },
    {
      question: 'How quickly can I get started with AlertMend?',
      answer: 'You can deploy AlertMend in under 20 minutes using Helm. Most users see real automated remediations within the first hour.',
    },
    {
      question: 'Can I build my own automation workflows?',
      answer: 'Yes. AlertMend includes a workflow builder allowing: Node.js scripts, Kubernetes API calls, Cloud provider actions, Conditional logic, Slack approval steps, Full custom remediation flows.',
    },
    {
      question: 'Does AlertMend support disk full / PVC full / node pressure remediation?',
      answer: 'Yes. AlertMend detects disk pressure, PVC full events, inode exhaustion, and node memory pressure. It can auto-expand PVCs, clean up image caches, and evict or rebalance workloads.',
    },
  ]

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-20 md:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-800/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-700/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            Frequently asked questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-purple-800/30 backdrop-blur-sm border border-purple-700/50 rounded-xl overflow-hidden transition-all duration-300 hover:border-purple-600/70 hover:shadow-lg"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between group focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                aria-expanded={openIndex === index}
              >
                <span className="text-base md:text-lg font-semibold text-white pr-4 group-hover:text-purple-200 transition-colors">
                  {faq.question}
                </span>
                <div className="flex-shrink-0">
                  {openIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-purple-300 group-hover:text-purple-200 transition-colors" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-purple-400 group-hover:text-purple-300 transition-colors" />
                  )}
                </div>
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-5 border-t border-purple-700/50">
                  <p className="pt-4 text-purple-200 leading-relaxed text-sm md:text-base">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

