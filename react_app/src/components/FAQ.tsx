import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: 'What problems does AlertMend solve?',
      answer: 'AlertMend AI solves critical infrastructure management challenges including incident remediation, cost optimization, on-call management, and Kubernetes operations. It automatically detects, analyzes, and fixes issues across Kubernetes, VMs, and ECS, reducing manual work by up to 90% and cutting infrastructure costs by up to 50%. The platform eliminates the need for constant firefighting and enables teams to achieve zero downtime operations.',
    },
    {
      question: 'How is AlertMend different from just using monitoring tools?',
      answer: 'While traditional monitoring tools only alert you to problems, AlertMend AI goes beyond detection to automatically analyze root causes and execute fixes. It uses AI-powered workflows to remediate incidents in seconds, learns from past incidents to improve over time, and proactively prevents issues before they impact your systems. Unlike monitoring tools that require manual intervention, AlertMend acts autonomously to maintain system reliability.',
    },
    {
      question: 'Can AlertMend fix Kubernetes issues without manual intervention?',
      answer: 'Yes, AlertMend AI can automatically fix many Kubernetes issues without manual intervention. It can restart failed pods, resize PVCs, adjust resource limits, scale services, and execute custom remediation scripts. The platform handles up to 70% of recurring incidents automatically with intelligent runbooks. For complex issues requiring human judgment, AlertMend provides detailed analysis and recommendations, but always allows you to review and approve actions before execution.',
    },
    {
      question: 'What kinds of problems can AlertMend handle on VMs?',
      answer: 'AlertMend AI can handle a wide range of VM-related problems including high CPU/memory usage, disk space issues, service failures, network connectivity problems, and auto-scaling needs. It can automatically restart services, scale VM instances, clean up disk space, and optimize resource allocation. The platform integrates with major cloud providers (AWS, GCP, Azure) and can manage VMs across hybrid and multi-cloud environments.',
    },
    {
      question: 'Can I trust AlertMend to act on its own?',
      answer: 'Yes, AlertMend AI is designed with safety and reliability in mind. You have full control over what actions it can take through configurable runbooks and approval workflows. The platform provides detailed audit logs of all actions, allows you to set safety limits and rollback capabilities, and learns from your preferences over time. Many customers start with read-only monitoring and gradually enable automated remediation as they build confidence. AlertMend has a 98.5% success rate in automated remediation.',
    },
    {
      question: 'Can AlertMend help me understand why issues happen (RCA)?',
      answer: 'Absolutely. AlertMend AI includes advanced Root Cause Analysis (RCA) capabilities that automatically analyze incidents to identify underlying causes. It correlates events across your infrastructure, examines historical patterns, and provides detailed explanations of why issues occurred. The platform learns from each incident to improve its analysis over time, helping you understand not just what happened, but why it happened and how to prevent similar issues in the future.',
    },
    {
      question: 'How does AlertMend help with Kubernetes management?',
      answer: 'AlertMend AI provides comprehensive Kubernetes management through AI-powered cluster monitoring, automated troubleshooting, proactive health checks, and intelligent resource optimization. It manages multi-cluster environments from a single dashboard, handles pod failures automatically, optimizes resource allocation, and maintains up to 99.97% uptime. The platform supports AWS EKS, GCP GKE, Azure AKS, and on-premise Kubernetes deployments, making it easy to manage your entire K8s infrastructure.',
    },
    {
      question: 'How does AlertMend integrate with my existing stack?',
      answer: 'AlertMend AI integrates seamlessly with your existing infrastructure stack. It connects with popular monitoring tools like Datadog, Prometheus, Grafana, and Alertmanager, notification platforms including Slack, Microsoft Teams, and PagerDuty, and cloud providers AWS, GCP, and Azure. The platform also supports webhooks for custom integrations and works with Kubernetes, VMs, and ECS. Setup typically takes just minutes, and AlertMend can start monitoring your infrastructure immediately without disrupting your current workflows.',
    },
    {
      question: 'Does AlertMend help reduce on-call load?',
      answer: 'Yes, AlertMend AI significantly reduces on-call load by automatically handling up to 70% of incidents without requiring human intervention. It intelligently routes alerts, eliminates false positives through smart filtering, and provides context-rich notifications only when human attention is needed. The platform improves on-call efficiency by up to 3x, reduces missed alerts to zero, and ensures team members are only notified for issues that truly require their expertise. This means fewer late-night pages and more time for strategic work.',
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

