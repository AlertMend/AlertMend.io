import { TrendingDown, Zap, CheckCircle2, Clock, DollarSign, Activity, Shield } from 'lucide-react'

// Helper function to convert category to URL slug
const categoryToSlug = (category: string): string => {
  const categoryMap: { [key: string]: string } = {
    'Automated Incident Remediation': 'auto-remediation',
    'Cost Optimization': 'kubernetes-cost-optimization',
    'Kubernetes Management': 'kubernetes-management',
    'On-Call Management': 'on-call-management',
  }
  return categoryMap[category] || category.toLowerCase().replace(/\s+/g, '-')
}

// Special slug overrides for specific case studies
const specialSlugOverrides: { [key: string]: string } = {
  'Decklar': 'kubernetes-cost-optimization-case-studies-rombee',
}

// Helper function to generate case study slug
export const generateCaseStudySlug = (category: string, company: string): string => {
  // Check if there's a special override for this company
  if (specialSlugOverrides[company]) {
    return specialSlugOverrides[company]
  }
  const categorySlug = categoryToSlug(category)
  const companySlug = company.toLowerCase().replace(/\s+/g, '-')
  return `${categorySlug}-case-studies-${companySlug}`
}

// Helper function to find case study by slug
export const findCaseStudyBySlug = (slug: string) => {
  return caseStudiesData.find((study) => {
    const expectedSlug = generateCaseStudySlug(study.category, study.company)
    return expectedSlug === slug
  })
}

export const caseStudiesData = [
  {
    company: 'Polymer Search',
    logo: '/logos/polymer-logo.png', // Placeholder: Add logo to public/logos/polymer-logo.png
    title: 'AlertMend Became Polymer\'s Off-Hours SRE',
    companySize: '11–50',
    industry: 'AI / SaaS / Data Analytics',
    region: 'United States',
    infrastructure: 'ECS, SQS, Lambda, MongoDB, Redis, EC2, Datadog',
    challenge: [
      'ECS-based AI worker tasks silently stopped processing SQS messages due to internal errors or deadlocks',
      'Tasks remained "healthy" per ECS health checks, as containers didn\'t crash',
      'Went undetected for hours during nights/weekends due to lack of 24/7 SRE coverage',
      'Datadog alerts fired but lacked actionable guidance',
      'SQS queues backed up silently, delaying downstream workflows',
      'Manual restarts became routine and burdensome',
    ],
    solution: [
      'Integrated AlertMend into observability stack, leveraging Datadog metrics/logs',
      'Alert fired when SQS message backlog exceeded threshold or message age remained high',
      'AlertMend verified alerts before acting by querying Datadog logs for ECS task and checking for missing activity logs',
      'If inactivity confirmed via logs: AlertMend automatically restarted the ECS task with auto-approval in production',
      'Sent detailed Slack summary for review',
      'Post-restart health check: Re-monitored SQS/logs, verified message count was decreasing',
      'If still broken, escalated to #critical Slack channel',
    ],
    keyFeatures: [
      { feature: 'Custom Workflow Builder', impact: 'Combined SQS checks, log scans, ECS restarts, Slack reports' },
      { feature: 'Auto Remediation', impact: 'Auto-restarted stuck ECS tasks with built-in validation' },
      { feature: 'Slack Notifications', impact: 'Shared full incident summaries in Slack' },
      { feature: 'Critical Escalation Channel', impact: 'Triggered manual alerts when automation failed' },
      { feature: 'Datadog Integration', impact: 'Seamless log + alert ingestion, no config changes needed' },
      { feature: 'Production-Ready Workflows', impact: 'Enabled auto-approved flows with audit trails and rollback visibility' },
    ],
    results: [
      { metric: '90%', label: 'Reduction in MTTR (45 min to <5 min)', icon: Clock, color: 'text-green-600' },
      { metric: '100%', label: 'Of known SQS stalls auto-resolved', icon: CheckCircle2, color: 'text-green-600' },
      { metric: '0', label: 'Overnight escalations for repeat issues', icon: Shield, color: 'text-blue-600' },
    ],
    firstMonthResults: [
      { metric: '21x', label: 'Downtime avoided', icon: Activity, color: 'text-green-600' },
      { metric: '25h', label: 'Engineering hours saved', icon: Clock, color: 'text-blue-600' },
      { metric: '$2K', label: 'Engineer cost saving', icon: DollarSign, color: 'text-green-600' },
      { metric: '$3K', label: 'Revenue saved', icon: DollarSign, color: 'text-green-600' },
      { metric: '99%', label: 'Application uptime', icon: CheckCircle2, color: 'text-purple-600' },
    ],
    testimonial: {
      quote: 'AlertMend streamlined our incident management. Faster resolutions, less manual work, and a more focused team. Peace of mind is invaluable.',
      author: 'Yasser Ansari',
      role: 'CEO, Polymer Search',
    },
    category: 'Automated Incident Remediation',
    categoryColor: 'bg-green-100 text-green-700',
  },
  {
    company: 'WareFlex',
    logo: '/logos/wareflex-logo.svg', // Logo file exists
    title: 'Cut GKE Costs by 50% Using AlertMend\'s AI-Powered Optimization',
    companySize: '21–50',
    industry: 'Logistics / Supply Chain Tech',
    region: 'Vietnam (HQ), expanding into North America',
    infrastructure: 'GKE',
    challenge: [
      'Over-provisioned containers and VMs reserved far more resources than they used, inflating costs',
      'Accumulated unused Persistent Volume Claims (PVCs) eating into storage budgets',
      'No centralized automation to identify inefficiencies',
      'Rising GKE costs risked outpacing growth and profits',
    ],
    solution: [
      'Implemented AlertMend\'s Kubernetes Cost Optimization Engine across GKE clusters',
      'Prometheus-driven analysis recommended right-sizing of pods and VMs',
      'Automated resource tuning applied changes safely without requiring manual YAML edits',
      'Identified and safely decommissioned unused or oversized PVCs',
      'Suggested more efficient machine types based on actual usage patterns',
      'Continuous cost monitoring with ongoing alerts and dashboards',
    ],
    keyFeatures: [
      { feature: 'AI-based Resource Right-Sizing', impact: 'Optimized CPU & memory allocation automatically' },
      { feature: 'PVC Usage Auditing & Cleanup', impact: 'Reclaimed underused storage volumes safely' },
      { feature: 'Node Type Recommendations', impact: 'Shifted workloads to cost-effective machine types' },
      { feature: 'Prometheus + K8s Metrics', impact: 'Powered data-driven recommendations' },
      { feature: 'No-YAML Apply Workflow', impact: 'Simplified implementation, reduced risk' },
      { feature: 'Continuous Optimization Engine', impact: 'Ensured ongoing efficiency as usage patterns shifted' },
    ],
    results: [
      { metric: '50%', label: 'Reduction in GKE costs', icon: DollarSign, color: 'text-green-600' },
      { metric: '41%', label: 'Compute cost savings', icon: DollarSign, color: 'text-green-600' },
      { metric: '94%', label: 'Storage cost savings', icon: DollarSign, color: 'text-green-600' },
      { metric: '0%', label: 'Performance regression', icon: Activity, color: 'text-purple-600' },
    ],
    costBreakdown: {
      before: { compute: '$719.42/mo', storage: '$407.66/mo' },
      after: { compute: '$422.42/mo', storage: '$25.66/mo' },
    },
    testimonial: {
      quote: 'AlertMend helped us take control of our Kubernetes costs without adding any manual effort. Within a week, we cut GKE expenses in half, cleaned up unused storage, and right-sized workloads — all without touching a single YAML file. It\'s like having an AI-powered infra co-pilot that just works.',
      author: 'Rajnish Sharma',
      role: 'Founder and CEO of WareFlex',
    },
    category: 'Cost Optimization',
    categoryColor: 'bg-purple-100 text-purple-700',
  },
  {
    company: 'Decklar',
    logo: '/logos/roambee-logo.svg', // Logo file exists
    title: 'Scaled Kubernetes with Confidence Using AlertMend\'s AI Agent',
    companySize: '100–200',
    industry: 'IoT-Driven Logistics & Supply Chain',
    region: 'Global (HQ in Silicon Valley)',
    infrastructure: 'Kubernetes (3,000+ Pods in Production)',
    challenge: [
      '3,000+ pods meant thousands of potential failure points — from failing containers to PVC bloat and service restarts',
      'Prometheus and Kubernetes surfaced alerts, but lacked context, RCA, or resolution paths',
      'Engineers manually investigated incidents by jumping between kubectl, logs, dashboards, and resource specs',
      'Missed health signals (like readiness issues or silent OOM kills) led to performance degradation',
      'No unified place to track, understand, and resolve K8s incidents',
    ],
    solution: [
      'Adopted AlertMend as a Kubernetes operations control layer',
      'Auto-detected unhealthy workloads (crash loops, failing probes, unmounted PVCs)',
      'Grouped issues by namespace, cluster, and impact for unified visibility',
      'Automatically identified root causes: resource starvation, image pull failures, node pressure, misconfigurations',
      'Surfaced recent events, logs, and config diffs in one place',
      'Integrated with Microsoft Teams for streamlined communication and coordination',
      'Enabled UI-based control actions to restart, delete, or scale workloads directly',
    ],
    keyFeatures: [
      { feature: 'Centralized K8s Health View', impact: 'Replaced scattered kubectl/debug tooling' },
      { feature: 'RCA Engine', impact: 'Explained the cause behind each issue in seconds' },
      { feature: 'Issue Auto-Detection', impact: 'Surfaced failing pods, PVCs, probes across clusters' },
      { feature: 'MS Teams Notification', impact: 'Kept the team aligned inside their communication tool' },
      { feature: 'UI-Based Control Actions', impact: 'Reduced friction for triage and fixes' },
      { feature: 'Namespace / Node Filtering', impact: 'Enabled focused troubleshooting at scale' },
    ],
    results: [
      { metric: '3,000+', label: 'Pods managed in one dashboard', icon: Activity, color: 'text-blue-600' },
      { metric: '70%', label: 'Reduction in investigation time', icon: Clock, color: 'text-green-600' },
      { metric: '15-20h', label: 'Saved per week in manual debugging', icon: TrendingDown, color: 'text-purple-600' },
    ],
    testimonial: {
      quote: 'AlertMend became our control tower for Kubernetes. It gave our team instant visibility, pinpointed root causes, and saved hours of manual debugging every week. Managing 3,000+ pods doesn\'t feel chaotic anymore — we finally have clarity and control.',
      author: 'Shailesh Mangal',
      role: 'CTO of Decklar',
    },
    category: 'Kubernetes Management',
    categoryColor: 'bg-blue-100 text-blue-700',
  },
  {
    company: 'AIVOS',
    logo: '/logos/avios-logo.svg', // Logo file exists
    title: 'Slashes Downtime on GCP VMs with AlertMend\'s Auto-Remediation',
    companySize: '1–10',
    industry: 'AI Voice Assistant / Conversational AI',
    region: 'Vietnam',
    infrastructure: 'Google Cloud VMs (no Kubernetes)',
    challenge: [
      'Core AI services inside VMs would occasionally freeze, deadlock, or stop processing jobs — without crashing or failing health checks',
      'GCP VM health appeared normal, masking issues at the application level',
      'Manual restarts were required via SSH or GCP Console — often after users were already affected',
      'No 24/7 monitoring, so incidents frequently went undetected overnight',
      'Engineers lost hours each week reacting to the same issues repeatedly',
    ],
    solution: [
      'Deployed AlertMend agents directly on virtual machines',
      'Built a two-layered remediation strategy: Service-Level Monitoring & Recovery, and VM-Level Remediation',
      'AlertMend monitored system logs and custom health scripts to detect if AI services had stalled',
      'If service was inactive beyond threshold: AlertMend restarted the specific process or container, captured logs for audit, and posted summary to Slack',
      'If VM itself was unresponsive: AlertMend triggered GCP VM auto-restart, ensured boot-time service restoration scripts were triggered, and escalated via Slack to #critical channel',
    ],
    keyFeatures: [
      { feature: 'In-VM Monitoring Agent', impact: 'Enabled fine-grained process supervision inside VMs' },
      { feature: 'Log Pattern Validation', impact: 'Ensured incidents were real before restarting' },
      { feature: 'Service-Level Auto-Remediation', impact: 'Restarted crashed or frozen AI services automatically' },
      { feature: 'GCP VM Restart Automation', impact: 'Recovered entire infrastructure when instances were unresponsive' },
      { feature: 'Slack Summary & Escalation', impact: 'Delivered transparency and ownership without requiring 24/7 ops' },
      { feature: 'Lightweight Setup (No K8s)', impact: 'Allowed deployment in minutes on vanilla GCP VMs' },
    ],
    results: [
      { metric: '90%+', label: 'Service failures auto-remediated', icon: Zap, color: 'text-green-600' },
      { metric: '100%', label: 'Recovery of previously stuck VMs', icon: CheckCircle2, color: 'text-blue-600' },
      { metric: '0', label: 'Overnight alerts for known failures', icon: Activity, color: 'text-purple-600' },
    ],
    testimonial: {
      quote: 'The automation we required was provided by AlertMend. 90% of our recurring service issues are now resolved by it, and it even automatically recovers stuck virtual machines (VMs) while communicating with our team through Slack. It\'s similar to having a backup SRE available at all times.',
      author: 'Phan (Marcus) Dinh Long Nhat',
      role: 'Founder & CEO of AIVOS, ex-Apple',
    },
    category: 'Automated Incident Remediation',
    categoryColor: 'bg-green-100 text-green-700',
  },
]

