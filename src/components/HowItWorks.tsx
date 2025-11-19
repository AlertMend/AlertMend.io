import { AlertCircle, Zap, CheckCircle2, ArrowRight, Activity, Clock, Database, AlertTriangle, Bell, MessageSquare, Webhook, Target, Shield, Gauge, TrendingUp, Users, BarChart3, DollarSign, Mail, Box, Phone } from 'lucide-react'
import CloudProviders from './CloudProviders'
import ToolLogos from './ToolLogos'

interface HowItWorksProps {
  solutionId?: string
}

export default function HowItWorks({ solutionId }: HowItWorksProps) {
  const monitoringTools = [
    { name: 'Datadog', logo: '/logos/datadog-logo.svg', icon: null, color: 'text-purple-600', bg: 'bg-purple-50' }, // ✓ Logo exists
    { name: 'Grafana', logo: '/logos/Grafana_Logo.png', icon: null, color: 'text-orange-600', bg: 'bg-orange-50' }, // ✓ Logo exists
    { name: 'Alertmanager', logo: null, icon: Bell, color: 'text-orange-600', bg: 'bg-orange-50' }, // Uses icon fallback (logo file doesn't exist)
    { name: 'Prometheus', logo: '/logos/prometheus.png', icon: null, color: 'text-red-600', bg: 'bg-red-50' }, // ✓ Logo exists
    { name: 'Webhooks', logo: '/logos/webhook-logo.png', icon: Webhook, color: 'text-green-600', bg: 'bg-green-50' }, // ✓ Logo exists
  ]

  const notificationTools = [
    { name: 'Slack', logo: '/logos/Slack_logo.png', icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-50' }, // ✓ Logo exists
    { name: 'MS Teams', logo: '/logos/MS_Team_Logo.png', icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-50' }, // ✓ Logo exists
    { name: 'Webhooks', logo: '/logos/webhook-logo.png', icon: Webhook, color: 'text-green-600', bg: 'bg-green-50' }, // ✓ Logo exists
  ]

  // Solution-specific steps data
  const solutionSteps: { [key: string]: any[] } = {
    'auto-remediation': [
      {
        number: '01',
        title: 'Alert Detection',
        description: 'Receive alerts from monitoring tools and trigger remediation workflows.',
        icon: AlertTriangle,
        bgColor: 'bg-orange-50',
        textColor: 'text-orange-600',
        details: [
          'Integrate with Alertmanager, Datadog, Prometheus, or webhooks',
          'Automatic alert parsing and classification',
          'Trigger remediation workflows based on alert type',
        ],
        tools: [
          { name: 'Alertmanager', logo: null, icon: Bell, color: 'text-orange-600', bg: 'bg-orange-50' },
          { name: 'Datadog', logo: '/logos/datadog-logo.svg', icon: null, color: 'text-purple-600', bg: 'bg-purple-50' },
          { name: 'PagerDuty', logo: '/logos/pagerduty-logo.png', icon: Bell, color: 'text-red-600', bg: 'bg-red-50' },
          { name: 'CloudWatch', logo: '/logos/cloudwatch.png', icon: null, color: 'text-orange-600', bg: 'bg-orange-50' },
          { name: 'New Relic', logo: '/logos/NewRelic_Logo.png', icon: null, color: 'text-blue-600', bg: 'bg-blue-50' },
          { name: 'Webhooks', logo: '/logos/webhook-logo.png', icon: Webhook, color: 'text-green-600', bg: 'bg-green-50' },
        ],
      },
      {
        number: '02',
        title: 'Root Cause Analysis',
        description: 'AI analyzes the issue to identify the root cause automatically.',
        icon: Target,
        bgColor: 'bg-orange-50',
        textColor: 'text-orange-600',
        details: [
          'AI-powered root cause analysis (RCA)',
          'Correlation with historical incidents',
          'Context-aware issue identification',
          'RCA sent over Slack',
          'Engineers can ask follow-up questions on Slack itself',
        ],
        tools: [
          { name: 'Prometheus', logo: '/logos/prometheus.png', icon: null, color: 'text-red-600', bg: 'bg-red-50' },
          { name: 'Grafana', logo: '/logos/Grafana_Logo.png', icon: null, color: 'text-orange-600', bg: 'bg-orange-50' },
          { name: 'Splunk', logo: '/logos/splunk-logo.png', icon: null, color: 'text-green-600', bg: 'bg-green-50' },
          { name: 'Datadog', logo: '/logos/datadog-logo.svg', icon: null, color: 'text-purple-600', bg: 'bg-purple-50' },
          { name: 'Jaeger', logo: '/logos/jaeger-logo.png', icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50' },
        ],
      },
      {
        number: '03',
        title: 'Execute Remediation',
        description: 'Automatically execute fixes using pre-built or custom runbooks.',
        icon: Zap,
        bgColor: 'bg-green-50',
        textColor: 'text-green-600',
        details: [
          'Restart failed pods or containers',
          'Resize PVCs or adjust resource limits',
          'Scale services up or down',
          'Execute custom remediation scripts',
        ],
        tools: [
          { name: 'Kubernetes', logo: '/logos/kubernetes-logo.png', icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50' },
          { name: 'Docker', logo: null, icon: Box, color: 'text-blue-500', bg: 'bg-blue-50' },
          { name: 'GCP', logo: '/logos/gcp-logo.png', icon: null, color: 'text-blue-500', bg: 'bg-blue-50' },
          { name: 'Azure', logo: '/logos/azure-logo.png', icon: null, color: 'text-blue-600', bg: 'bg-blue-50' },
          { name: 'ECS', logo: '/logos/ecs-logo.png', icon: null, color: 'text-purple-600', bg: 'bg-purple-50' },
        ],
      },
      {
        number: '04',
        title: 'Verify and Notify',
        description: 'Verify the fix worked and notify teams via Slack, Teams, or email.',
        icon: CheckCircle2,
        bgColor: 'bg-green-50',
        textColor: 'text-green-600',
        details: [
          'Automatic verification of remediation success',
          'Send notifications to Slack, Teams, or email',
          'Update incident status and create audit logs',
          'Learn from outcomes to improve future remediation',
        ],
        tools: [
          { name: 'Slack', logo: '/logos/Slack_logo.png', icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-50' },
          { name: 'MS Teams', logo: '/logos/MS_Team_Logo.png', icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-50' },
          { name: 'Jira', logo: '/logos/Jira_Logo.png', icon: null, color: 'text-blue-600', bg: 'bg-blue-50' },
          { name: 'Opsgenie', logo: '/logos/opsgenie-logo.png', icon: Bell, color: 'text-orange-600', bg: 'bg-orange-50' },
          { name: 'Email', logo: null, icon: Mail, color: 'text-gray-600', bg: 'bg-gray-50' },
        ],
      },
    ],
    'kubernetes-management': [
      {
        number: '01',
        title: 'Connect Kubernetes Clusters',
        description: 'Integrate with your Kubernetes clusters across any cloud provider.',
        icon: Activity,
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-600',
        details: [
          'One-click installation with read-only RBAC permissions',
          'Support for AWS EKS, GCP GKE, Azure AKS, and on-premise',
          'Multi-cluster management from a single dashboard',
        ],
        tools: [
          { name: 'AWS EKS', logo: '/logos/aws-logo.png', icon: null, color: 'text-orange-600', bg: 'bg-orange-50' },
          { name: 'GCP GKE', logo: '/logos/gcp-logo.png', icon: null, color: 'text-blue-600', bg: 'bg-blue-50' },
          { name: 'Azure AKS', logo: '/logos/azure-logo.png', icon: null, color: 'text-blue-600', bg: 'bg-blue-50' },
          { name: 'Kubernetes', logo: '/logos/kubernetes-logo.png', icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50' },
        ],
      },
      {
        number: '02',
        title: 'AI-Powered Cluster Management',
        description: 'Single unified view with intelligent monitoring and automated management of Kubernetes resources.',
        icon: Gauge,
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-600',
        details: [
          'Single unified view of all clusters',
          'Real-time monitoring of pods, deployments, and services',
          'AI-driven health checks and anomaly detection',
          'Talk to your cluster in natural language',
          'Automated scaling and resource allocation',
        ],
      },
      {
        number: '03',
        title: 'Automated Troubleshooting',
        description: 'AI analyzes Kubernetes issues and resolves them automatically.',
        icon: TrendingUp,
        bgColor: 'bg-green-50',
        textColor: 'text-green-600',
        details: [
          'Automatic diagnosis of pod failures and resource issues',
          'Intelligent troubleshooting workflows for K8s',
          'Pre-built runbooks for common Kubernetes problems',
        ],
      },
      {
        number: '04',
        title: 'Maintain Cluster Reliability',
        description: 'Continuous optimization and proactive management of Kubernetes infrastructure.',
        icon: Shield,
        bgColor: 'bg-green-50',
        textColor: 'text-green-600',
        details: [
          'Proactive issue prevention and health monitoring',
          'Namespace and RBAC management',
          'Continuous learning and optimization',
        ],
      },
    ],
    'on-call-management': [
      {
        number: '01',
        title: 'Connect Alert Sources',
        description: 'Integrate with your existing monitoring tools and alerting systems.',
        icon: MessageSquare,
        bgColor: 'bg-purple-50',
        textColor: 'text-purple-600',
        details: [
          'Connect or Use in house monitoring tools (Datadog, Prometheus, Grafana, or any webhook-based alerting)',
          'Configure alert routing rules and severity levels',
          'Set up multi-channel notification preferences',
        ],
      },
      {
        number: '02',
        title: 'Configure On-Call Schedules',
        description: 'Set up intelligent on-call rotations and escalation policies.',
        icon: Users,
        bgColor: 'bg-purple-50',
        textColor: 'text-purple-600',
        details: [
          'Create on-call schedules with automatic rotation',
          'Define escalation policies for different alert types',
          'Set up backup and override schedules',
        ],
      },
      {
        number: '03',
        title: 'Receive Instant Alerts',
        description: 'Get notified through your preferred channels when incidents occur.',
        icon: Bell,
        bgColor: 'bg-purple-50',
        textColor: 'text-purple-600',
        details: [
          'Multi-channel alerts: Slack, Teams, Email, SMS, Phone, Phone Call, WhatsApp',
          'Smart alert grouping and deduplication',
          'Context-rich notifications with incident details',
        ],
        tools: [
          { name: 'Slack', logo: '/logos/Slack_logo.png', icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-50' },
          { name: 'MS Teams', logo: '/logos/MS_Team_Logo.png', icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-50' },
          { name: 'Email', logo: null, icon: Mail, color: 'text-gray-600', bg: 'bg-gray-50' },
          { name: 'SMS', logo: null, icon: MessageSquare, color: 'text-green-600', bg: 'bg-green-50' },
          { name: 'Phone', logo: null, icon: Phone, color: 'text-blue-600', bg: 'bg-blue-50' },
          { name: 'Phone Call', logo: null, icon: Bell, color: 'text-purple-600', bg: 'bg-purple-50' },
          { name: 'WhatsApp', logo: null, icon: MessageSquare, color: 'text-green-600', bg: 'bg-green-50' },
        ],
      },
      {
        number: '04',
        title: 'Track and Respond',
        description: 'Monitor alert status, acknowledge incidents, and track response times.',
        icon: CheckCircle2,
        bgColor: 'bg-green-50',
        textColor: 'text-green-600',
        details: [
          'Real-time alert dashboard and status tracking',
          'One-click acknowledgment and assignment',
          'Response time analytics and reporting',
        ],
      },
    ],
    'kubernetes-cost-optimization': [
      {
        number: '01',
        title: 'Kubernetes Cost Analysis',
        description: 'Analyze your Kubernetes infrastructure costs and identify optimization opportunities.',
        icon: BarChart3,
        bgColor: 'bg-purple-100',
        iconBgColor: 'bg-purple-600',
        textColor: 'text-green-600',
        details: [
          'Connect to Kubernetes clusters and cloud billing APIs',
          'Analyze pod, node, and storage usage patterns',
          'Identify idle pods, over-provisioned resources, and unused PVCs',
        ],
      },
      {
        number: '02',
        title: 'Right-Sizing Recommendations',
        description: 'Get AI-powered recommendations for optimal Kubernetes resource allocation.',
        icon: Target,
        bgColor: 'bg-purple-100',
        iconBgColor: 'bg-purple-600',
        textColor: 'text-green-600',
        details: [
          'Analyze CPU, memory requests and limits across pods',
          'Recommend optimal container resource allocations',
          'Suggest node pool optimizations and reserved instances',
        ],
      },
      {
        number: '03',
        title: 'Automated Kubernetes Optimization',
        description: 'Automatically optimize Kubernetes resources with zero performance impact.',
        icon: TrendingUp,
        bgColor: 'bg-purple-100',
        iconBgColor: 'bg-purple-600',
        textColor: 'text-green-600',
        details: [
          'Automated right-sizing of pod requests and limits',
          'Intelligent HPA and VPA configuration',
          'Storage cleanup and PVC optimization',
        ],
      },
      {
        number: '04',
        title: 'Track Kubernetes Savings',
        description: 'Monitor Kubernetes cost reductions and ROI with detailed analytics.',
        icon: DollarSign,
        bgColor: 'bg-purple-100',
        iconBgColor: 'bg-purple-600',
        textColor: 'text-green-600',
        details: [
          'Real-time Kubernetes cost tracking and savings reports',
          'Per-namespace and per-workload cost analysis',
          'Budget alerts and cost forecasting for K8s',
        ],
      },
    ],
  }

  // Default steps (used when no solutionId or solutionId is 'default')
  const defaultSteps = [
    {
      number: '01',
      title: 'Connect & Monitor',
      description: 'Connect your infrastructure. Monitor 24/7.',
      icon: Activity,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      tools: null,
      details: null,
    },
    {
      number: '02',
      title: 'Detect & Analyze',
      description: 'AI detects. ML analyzes. Proactive protection.',
      icon: AlertCircle,
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      tools: monitoringTools,
      details: null,
    },
    {
      number: '03',
      title: 'Remediate Automatically',
      description: 'Auto-fix in seconds. Notifications sent automatically.',
      icon: Zap,
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      tools: notificationTools,
      details: null,
    },
    {
      number: '04',
      title: 'Verify & Optimize',
      description: 'Verify. Learn. Optimize. Continuously.',
      icon: CheckCircle2,
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      tools: null,
      details: null,
    },
  ]

  // Use solution-specific steps if solutionId is provided, otherwise use default
  const steps = solutionId && solutionSteps[solutionId] ? solutionSteps[solutionId] : defaultSteps

  return (
    <section id="how-it-works" className="py-16 md:py-20 container-padding relative overflow-hidden gradient-bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block px-5 py-2 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 rounded-full text-sm font-bold mb-5 shadow-lg">
            Process
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-purple-950 mb-4">
            How It Works
          </h2>
          <p className="text-lg md:text-xl text-purple-700 max-w-2xl mx-auto leading-relaxed">
            A simple, intelligent process that automates infrastructure operations end-to-end
          </p>
        </div>

        <div className="relative mb-12">
          {/* Enhanced connecting line for desktop */}
          <div className="hidden lg:block absolute top-20 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-orange-200 via-green-200 to-green-300 rounded-full opacity-60"></div>
          <div className="hidden lg:block absolute top-20 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-orange-400 via-green-400 to-green-500 rounded-full blur-sm opacity-40"></div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 relative">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={index} className="relative group">
                  {/* Arrow connector for desktop */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-20 right-0 transform translate-x-1/2 z-20">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-purple-200 group-hover:border-purple-400 group-hover:scale-110 transition-all duration-300">
                        <ArrowRight className="h-5 w-5 text-purple-600" />
                      </div>
                    </div>
                  )}
                  
                  {/* Step Card */}
                  <div className="bg-white rounded-2xl p-6 lg:p-8 border-2 border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all duration-300 h-full relative overflow-hidden text-left">
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-50/0 to-purple-100/0 group-hover:from-purple-50/50 group-hover:to-purple-100/30 transition-all duration-500 rounded-2xl"></div>
                    
                    <div className="relative z-10">
                      {/* Step number badge - hide for cost optimization */}
                      {solutionId !== 'kubernetes-cost-optimization' && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg">
                          {index + 1}
                        </div>
                      </div>
                      )}
                      
                      {/* Icon - Purple square with green icon inside for cost optimization */}
                      {solutionId === 'kubernetes-cost-optimization' && step.iconBgColor ? (
                        <div className={`${step.iconBgColor} w-16 h-16 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300 relative z-10`}>
                          <Icon className={`h-8 w-8 ${step.textColor}`} />
                        </div>
                      ) : (
                        <div className={`${step.bgColor} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300 relative z-10`}>
                          <Icon className={`h-8 w-8 ${step.textColor}`} />
                      </div>
                      )}
                      
                      {/* Title */}
                      <h3 className="text-lg lg:text-xl font-bold text-purple-950 mb-3 group-hover:text-purple-900 transition-colors text-left">
                        {step.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-gray-700 leading-relaxed text-sm mb-4 text-left">
                        {step.description}
                      </p>
                      
                      {/* Solution-specific details */}
                      {step.details && (
                        <div className="mt-4 space-y-2.5 text-left">
                          {step.details.map((detail: string, idx: number) => (
                            <div key={idx} className="flex items-start gap-2.5 text-sm text-gray-700">
                              <CheckCircle2 className={`h-5 w-5 ${step.textColor} flex-shrink-0 mt-0.5`} />
                              <span className="leading-relaxed flex-1">{detail}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Tools/Logos for solution-specific steps */}
                      {solutionId && step.tools && (
                        <div className="mt-6 pt-5 border-t border-gray-100">
                          <ToolLogos tools={step.tools} />
                        </div>
                      )}
                      
                      {/* Cloud Providers in Step 1 (default only) */}
                      {!solutionId && index === 0 && (
                        <div className="mt-6 pt-5 border-t border-gray-200">
                          <CloudProviders />
                        </div>
                      )}
                      
                      {/* Monitoring Tools in Step 2 (default only) */}
                      {!solutionId && index === 1 && step.tools && (
                        <div className="mt-6 pt-5 border-t border-gray-200">
                          <div className="text-xs font-semibold text-purple-600 mb-3 uppercase tracking-wide text-center">Integrates with</div>
                          <ToolLogos tools={step.tools} />
                        </div>
                      )}
                      
                      {/* Notification Tools in Step 3 (default only) */}
                      {!solutionId && index === 2 && step.tools && (
                        <div className="mt-6 pt-5 border-t border-gray-200">
                          <div className="text-xs font-semibold text-purple-600 mb-3 uppercase tracking-wide text-center">Notifies via</div>
                          <ToolLogos tools={step.tools} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Real Examples - Solution Specific */}
        {(() => {
          // Solution-specific examples data
          const solutionExamples: { [key: string]: { title: string; description: string; examples: any[] } } = {
            'auto-remediation': {
              title: 'Automatic Remediation in Action',
              description: 'See how AlertMend AI automatically detects, analyzes, and fixes issues across different platforms in seconds',
              examples: [
                {
                  platform: 'Kubernetes',
                  platformColor: 'from-purple-700 to-purple-600',
                  title: 'Pod Crash Recovery',
                  issue: 'Crash-looping pod due to memory limit exceeded',
                  issueIcon: AlertTriangle,
                  alertmendTime: '15s',
                  manualTime: '30+ min',
                  steps: [
                    'Identified root cause: memory limit too low',
                    'Automatically adjusted resource allocation',
                    'Restarted pod with optimized configuration',
                  ],
                },
                {
                  platform: 'Virtual Machines',
                  platformColor: 'from-purple-700 to-purple-600',
                  title: 'Auto-Scaling',
                  issue: 'Sustained high CPU usage (95%+) for 5+ minutes',
                  issueIcon: Activity,
                  alertmendTime: '12s',
                  manualTime: '45+ min',
                  steps: [
                    'Detected CPU spike pattern',
                    'Provisioned 2 additional VM instances',
                    'Distributed workload automatically',
                  ],
                },
                {
                  platform: 'AWS ECS',
                  platformColor: 'from-purple-700 to-purple-600',
                  title: 'Memory Optimization',
                  issue: 'Task failures due to memory constraints (OOM errors)',
                  issueIcon: Database,
                  alertmendTime: '18s',
                  manualTime: '60+ min',
                  steps: [
                    'Analyzed memory usage patterns',
                    'Updated task definition with optimal memory',
                    'Redeployed service automatically',
                  ],
                },
              ],
            },
            'kubernetes-management': {
              title: 'Kubernetes Management in Action',
              description: 'See how AlertMend AI provides intelligent Kubernetes cluster management and troubleshooting',
              examples: [
                {
                  platform: 'Kubernetes',
                  platformColor: 'from-blue-700 to-blue-600',
                  title: 'Pod Health Monitoring',
                  issue: 'Multiple pods in CrashLoopBackOff state across namespace',
                  issueIcon: AlertTriangle,
                  alertmendTime: '8s',
                  manualTime: '25+ min',
                  steps: [
                    'Detected failing pods across 3 namespaces',
                    'AI analyzed logs and identified image pull errors',
                    'Automatically restarted pods with correct image tags',
                  ],
                },
                {
                  platform: 'Kubernetes',
                  platformColor: 'from-blue-700 to-blue-600',
                  title: 'Resource Quota Resolution',
                  issue: 'Pods unable to start due to resource quota limits',
                  issueIcon: Gauge,
                  alertmendTime: '10s',
                  manualTime: '40+ min',
                  steps: [
                    'Identified resource quota exhaustion',
                    'Recommended and applied quota adjustments',
                    'Automatically scheduled pending pods',
                  ],
                },
                {
                  platform: 'Kubernetes',
                  platformColor: 'from-blue-700 to-blue-600',
                  title: 'Node Not Ready Recovery',
                  issue: 'Worker node became unresponsive and marked NotReady',
                  issueIcon: Activity,
                  alertmendTime: '20s',
                  manualTime: '60+ min',
                  steps: [
                    'Detected node NotReady status',
                    'Cordoned node and drained workloads safely',
                    'Migrated pods to healthy nodes automatically',
                  ],
                },
              ],
            },
            'kubernetes-cost-optimization': {
              title: 'Cost Optimization in Action',
              description: 'See how AlertMend AI automatically optimizes Kubernetes resources and reduces costs',
              examples: [
                {
                  platform: 'Kubernetes',
                  platformColor: 'from-green-700 to-green-600',
                  title: 'Pod Right-Sizing',
                  issue: 'Over-provisioned pods using only 30% of allocated resources',
                  issueIcon: BarChart3,
                  alertmendTime: '5 min',
                  manualTime: '2+ hours',
                  steps: [
                    'Analyzed CPU and memory usage patterns',
                    'Recommended optimal resource requests and limits',
                    'Applied right-sizing automatically with zero downtime',
                  ],
                },
                {
                  platform: 'Kubernetes',
                  platformColor: 'from-green-700 to-green-600',
                  title: 'Unused PVC Cleanup',
                  issue: '50+ unused PersistentVolumeClaims consuming storage',
                  issueIcon: Database,
                  alertmendTime: '3 min',
                  manualTime: '1+ hour',
                  steps: [
                    'Identified unused PVCs across all namespaces',
                    'Verified no active pods using the volumes',
                    'Safely deleted unused PVCs and recovered storage',
                  ],
                },
                {
                  platform: 'Kubernetes',
                  platformColor: 'from-green-700 to-green-600',
                  title: 'Node Pool Optimization',
                  issue: 'Inefficient node pool configuration causing high costs',
                  issueIcon: Target,
                  alertmendTime: '10 min',
                  manualTime: '4+ hours',
                  steps: [
                    'Analyzed workload requirements and node utilization',
                    'Recommended cost-effective node pool configuration',
                    'Migrated workloads to optimized node pool',
                  ],
                },
              ],
            },
            'on-call-management': {
              title: 'On-Call in Action',
              description: 'See how AlertMend AI streamlines on-call operations and reduces response times',
              examples: [
                {
                  platform: 'Alerting',
                  platformColor: 'from-purple-700 to-purple-600',
                  title: 'Smart Alert Routing',
                  issue: 'Critical production alert requires immediate attention',
                  issueIcon: Bell,
                  alertmendTime: '2s',
                  manualTime: '15+ min',
                  steps: [
                    'Analyzed alert severity and context',
                    'Routed to on-call engineer based on expertise',
                    'Sent notifications via Slack, PagerDuty, and SMS',
                  ],
                },
                {
                  platform: 'Incident Response',
                  platformColor: 'from-purple-700 to-purple-600',
                  title: 'Automated Escalation',
                  issue: 'Alert not acknowledged within SLA timeframe',
                  issueIcon: AlertCircle,
                  alertmendTime: '5 min',
                  manualTime: '30+ min',
                  steps: [
                    'Detected unacknowledged critical alert',
                    'Automatically escalated to team lead',
                    'Created incident ticket and notified stakeholders',
                  ],
                },
                {
                  platform: 'Response Analytics',
                  platformColor: 'from-purple-700 to-purple-600',
                  title: 'Response Time Optimization',
                  issue: 'Need to improve team response time metrics',
                  issueIcon: Clock,
                  alertmendTime: 'Real-time',
                  manualTime: 'Manual tracking',
                  steps: [
                    'Tracked response times across all incidents',
                    'Identified bottlenecks in on-call workflow',
                    'Provided recommendations for improvement',
                  ],
                },
              ],
            },
          }

          // Default examples (for default solution or when no solutionId)
          const defaultExamples = {
            title: 'Automatic Remediation in Action',
            description: 'See how AlertMend AI automatically detects, analyzes, and fixes issues across different platforms in seconds',
            examples: [
              {
                platform: 'Kubernetes',
                platformColor: 'from-purple-700 to-purple-600',
                title: 'Pod Crash Recovery',
                issue: 'Crash-looping pod due to memory limit exceeded',
                issueIcon: AlertTriangle,
                alertmendTime: '15s',
                manualTime: '30+ min',
                steps: [
                  'Identified root cause: memory limit too low',
                  'Automatically adjusted resource allocation',
                  'Restarted pod with optimized configuration',
                ],
              },
              {
                platform: 'Virtual Machines',
                platformColor: 'from-purple-700 to-purple-600',
                title: 'Auto-Scaling',
                issue: 'Sustained high CPU usage (95%+) for 5+ minutes',
                issueIcon: Activity,
                alertmendTime: '12s',
                manualTime: '45+ min',
                steps: [
                  'Detected CPU spike pattern',
                  'Provisioned 2 additional VM instances',
                  'Distributed workload automatically',
                ],
              },
              {
                platform: 'AWS ECS',
                platformColor: 'from-purple-700 to-purple-600',
                title: 'Memory Optimization',
                issue: 'Task failures due to memory constraints (OOM errors)',
                issueIcon: Database,
                alertmendTime: '18s',
                manualTime: '60+ min',
                steps: [
                  'Analyzed memory usage patterns',
                  'Updated task definition with optimal memory',
                  'Redeployed service automatically',
                ],
              },
            ],
          }

          const examplesData = solutionId && solutionExamples[solutionId] 
            ? solutionExamples[solutionId] 
            : defaultExamples

          return (
            <div className="mt-12">
              <div className="text-center mb-10">
                <div className="inline-block px-5 py-2 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 rounded-full text-sm font-bold mb-5 shadow-lg">
              Real Examples
            </div>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-purple-950 mb-4">
                  {examplesData.title}
            </h3>
            <p className="text-lg md:text-xl text-purple-700 max-w-3xl mx-auto leading-relaxed">
                  {examplesData.description}
            </p>
          </div>

              <div className="grid md:grid-cols-3 gap-5 lg:gap-6">
                {examplesData.examples.map((example, idx) => {
                  const IssueIcon = example.issueIcon
                  return (
                    <div key={idx} className="group bg-white rounded-2xl p-6 lg:p-8 border-2 border-gray-200 hover:border-purple-300 hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/0 to-purple-100/0 group-hover:from-purple-50/40 group-hover:to-purple-100/20 transition-all duration-500"></div>
              
              <div className="relative z-10">
                {/* Platform Badge */}
                        <div className="flex items-center gap-2 mb-4">
                          <div className={`px-3 py-1.5 bg-gradient-to-r ${example.platformColor} text-white rounded-lg text-xs font-bold shadow-md`}>
                            {example.platform}
                  </div>
                </div>

                {/* Title */}
                        <h4 className="text-lg lg:text-xl font-bold text-purple-950 mb-3">{example.title}</h4>

                {/* Problem */}
                        <div className="mb-4 p-3 bg-orange-50 rounded-xl border border-orange-200">
                  <div className="flex items-start gap-3">
                            <IssueIcon className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-semibold text-orange-900 mb-1">Issue Detected</div>
                              <div className="text-xs text-orange-700 leading-relaxed">{example.issue}</div>
                    </div>
                  </div>
                </div>

                {/* Time Comparison */}
                        <div className="mb-4 p-4 bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl border-2 border-green-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-semibold text-green-900">AlertMend</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-gray-400" />
                      <span className="text-sm font-semibold text-gray-600">Manual</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-center">
                              <div className="text-3xl font-bold text-green-600 mb-1">{example.alertmendTime}</div>
                      <div className="text-xs text-green-700 font-medium">Auto-fixed</div>
                    </div>
                    <div className="text-gray-300 text-2xl">vs</div>
                    <div className="text-center">
                              <div className="text-3xl font-bold text-gray-400 mb-1">{example.manualTime}</div>
                      <div className="text-xs text-gray-500 font-medium">Manual fix</div>
                    </div>
                  </div>
                </div>

                {/* Solution Steps */}
                        <div className="space-y-2">
                          {example.steps.map((step: string, stepIdx: number) => (
                            <div key={stepIdx} className="flex items-start gap-2 text-sm text-purple-700">
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                              <span>{step}</span>
                  </div>
                          ))}
                  </div>
                </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })()}
      </div>
    </section>
  )
}

