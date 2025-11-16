import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Bell, Activity, Zap, DollarSign, Phone, MessageSquare, TrendingUp, CheckCircle2, BarChart3, AlertTriangle, Gauge, Shield, Target, Users } from 'lucide-react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import ROIMetrics from '../components/ROIMetrics'
import HowItWorks from '../components/HowItWorks'
import Integrations from '../components/Integrations'
import Benefits from '../components/Benefits'
import CaseStudies from '../components/CaseStudies'
import CTA from '../components/CTA'
import LanguageSupport from '../components/LanguageSupport'
import FAQ from '../components/FAQ'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import { ensureUniqueMetaDescription } from '../utils/descriptionUtils'

export default function SolutionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  
  // Get solution ID from URL path or params
  const getSolutionId = () => {
    const pathname = location.pathname
    if (pathname.startsWith('/solutions/')) {
      // Map old solution URLs to new IDs
      const solutionIdMap: Record<string, string> = {
        'ai-monitoring': 'kubernetes-management',
        'cost-optimization': 'kubernetes-cost-optimization',
      }
      const mappedId = solutionIdMap[id || '']
      return mappedId || id || 'auto-remediation'
    }
    // Direct route (e.g., /auto-remediation)
    const pathSegments = pathname.split('/').filter(Boolean)
    if (pathSegments.length > 0) {
      const solutionId = pathSegments[0]
      // Map valid solution IDs
      const validIds = ['auto-remediation', 'kubernetes-management', 'on-call-management', 'kubernetes-cost-optimization']
      if (validIds.includes(solutionId)) {
        return solutionId
      }
    }
    return 'auto-remediation'
  }
  
  const [selectedSolutionId, setSelectedSolutionId] = useState<string>(getSolutionId())
  const navigate = useNavigate()

  // Scroll to top when component mounts or solution changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  // Update selected solution when URL changes
  useEffect(() => {
    const newSolutionId = getSolutionId()
    setSelectedSolutionId(newSolutionId)
    // Scroll to top when solution changes
    window.scrollTo({ top: 0, behavior: 'instant' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, id])

  const solutions = {
    'on-call-management': {
      icon: Bell,
      title: 'On-Call and Incident Alerts',
      subtitle: 'Never Miss a Critical Alert',
      description: 'Receive instant alerts through Slack, Microsoft Teams, email, or phone calls when issues occur. Manage on-call schedules easily and reduce response delays.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      stat: 'Improved on-call efficiency by 3x and reduced missed alerts to zero.',
      features: [
        { icon: MessageSquare, text: 'Multi-channel alerts: Slack, Teams, Email, Phone, WhatsApp' },
        { icon: Bell, text: 'Intelligent on-call scheduling and rotation' },
        { icon: Phone, text: 'Escalation policies and incident routing' },
        { icon: CheckCircle2, text: 'Zero missed alerts with smart notifications' },
      ],
      metrics: [
        { value: '3x', label: 'On-Call Efficiency' },
        { value: '0', label: 'Missed Alerts' },
      ],
      steps: [
        {
          number: '01',
          title: 'Connect Alert Sources',
          description: 'Integrate with your existing monitoring tools and alerting systems.',
          icon: MessageSquare,
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
          details: [
            'Multi-channel alerts: Slack, Teams, Email, SMS, Phone, WhatsApp',
            'Smart alert grouping and deduplication',
            'Context-rich notifications with incident details',
          ],
        },
        {
          number: '04',
          title: 'Track and Respond',
          description: 'Monitor alert status, acknowledge incidents, and track response times.',
          icon: CheckCircle2,
          details: [
            'Real-time alert dashboard and status tracking',
            'One-click acknowledgment and assignment',
            'Response time analytics and reporting',
          ],
        },
      ],
    },
    'kubernetes-management': {
      icon: Activity,
      title: 'Kubernetes Management with AI',
      subtitle: 'Intelligent Kubernetes Operations',
      description: 'AI-powered Kubernetes cluster management with automated troubleshooting, proactive monitoring, and intelligent resource optimization. Manage multi-cluster environments effortlessly and maintain 99.97% uptime.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      stat: 'Reduced incident response time by 45% for a logistics customer.',
      features: [
        { icon: Activity, text: 'Real-time Kubernetes cluster monitoring' },
        { icon: Gauge, text: 'AI-driven health checks and anomaly detection' },
        { icon: TrendingUp, text: 'Automated pod and deployment management' },
        { icon: CheckCircle2, text: 'Multi-cluster management and RBAC' },
      ],
      metrics: [
        { value: '45%', label: 'Faster Response Time' },
        { value: '99.97%', label: 'Uptime' },
      ],
      steps: [
        {
          number: '01',
          title: 'Connect Kubernetes Clusters',
          description: 'Integrate with your Kubernetes clusters across any cloud provider.',
          icon: Activity,
          details: [
            'One-click installation with read-only RBAC permissions',
            'Support for AWS EKS, GCP GKE, Azure AKS, and on-premise',
            'Multi-cluster management from a single dashboard',
          ],
        },
        {
          number: '02',
          title: 'AI-Powered Cluster Management',
          description: 'Single unified view with intelligent monitoring and automated management of Kubernetes resources.',
          icon: Gauge,
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
          details: [
            'Proactive issue prevention and health monitoring',
            'Namespace and RBAC management',
            'Continuous learning and optimization',
          ],
        },
      ],
    },
    'auto-remediation': {
      icon: Zap,
      title: 'Automated Incident Remediation and Root Cause Analysis',
      subtitle: 'Self-Healing Infrastructure',
      description: 'Run AI-driven workflows the moment alerts fire. Restart failed pods, resize PVCs, or fix recurring issues automatically with intelligent runbooks.',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      stat: 'Handled 70% of recurring incidents automatically for a SaaS startup.',
      features: [
        { icon: Zap, text: 'AI-driven automated remediation workflows' },
        { icon: AlertTriangle, text: 'Automatic root cause analysis (RCA)' },
        { icon: CheckCircle2, text: 'Pre-built runbooks for common issues' },
        { icon: Activity, text: 'Self-healing infrastructure capabilities' },
      ],
      metrics: [
        { value: '70%', label: 'Auto-Remediation' },
        { value: '<15s', label: 'MTTR' },
      ],
      steps: [
        {
          number: '01',
          title: 'Alert Detection',
          description: 'Receive alerts from monitoring tools and trigger remediation workflows.',
          icon: AlertTriangle,
          details: [
            'Integrate with Alertmanager, Datadog, Prometheus, or webhooks',
            'Automatic alert parsing and classification',
            'Trigger remediation workflows based on alert type',
          ],
        },
        {
          number: '02',
          title: 'Root Cause Analysis',
          description: 'AI analyzes the issue to identify the root cause automatically.',
          icon: Target,
          details: [
            'AI-powered root cause analysis (RCA)',
            'Correlation with historical incidents',
            'Context-aware issue identification',
            'RCA sent over Slack',
            'Engineers can ask follow-up questions on Slack itself',
          ],
        },
        {
          number: '03',
          title: 'Execute Remediation',
          description: 'Automatically execute fixes using pre-built or custom runbooks.',
          icon: Zap,
          details: [
            'Restart failed pods or containers',
            'Resize PVCs or adjust resource limits',
            'Scale services up or down',
            'Execute custom remediation scripts',
          ],
        },
        {
          number: '04',
          title: 'Verify and Notify',
          description: 'Verify the fix worked and notify teams via Slack, Teams, or email.',
          icon: CheckCircle2,
          details: [
            'Automatic verification of remediation success',
            'Send notifications to Slack, Teams, or email',
            'Update incident status and create audit logs',
            'Learn from outcomes to improve future remediation',
          ],
        },
      ],
    },
    'kubernetes-cost-optimization': {
      icon: DollarSign,
      title: 'Kubernetes Cost Optimization and Resource Management',
      subtitle: 'Maximize Kubernetes ROI',
      description: 'AI-powered Kubernetes cost optimization that identifies idle workloads, right-sizes containers, and eliminates waste. Save significantly on Kubernetes costs while maintaining system performance.',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      stat: 'One of our customers saved over USD 8,000 per month in Kubernetes costs.',
      features: [
        { icon: DollarSign, text: 'Automated Kubernetes cost analysis and optimization' },
        { icon: BarChart3, text: 'Pod and container right-sizing recommendations' },
        { icon: TrendingUp, text: 'Intelligent HPA and VPA configuration' },
        { icon: CheckCircle2, text: 'Zero performance impact' },
      ],
      metrics: [
        { value: '50%', label: 'Cost Reduction' },
        { value: '$8K+', label: 'Monthly Savings' },
      ],
      steps: [
        {
          number: '01',
          title: 'Kubernetes Cost Analysis',
          description: 'Analyze your Kubernetes infrastructure costs and identify optimization opportunities.',
          icon: BarChart3,
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
          details: [
            'Real-time Kubernetes cost tracking and savings reports',
            'Per-namespace and per-workload cost analysis',
            'Budget alerts and cost forecasting for K8s',
          ],
        },
      ],
    },
  }

  const solution = solutions[selectedSolutionId as keyof typeof solutions]

  if (!solution) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-purple-900 mb-4">Solution Not Found</h1>
            <button
              onClick={() => navigate('/')}
              className="text-purple-600 hover:text-purple-800 underline"
            >
              Return to Home
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // Generate unique meta description for solution page
  const uniqueDescription = ensureUniqueMetaDescription(
    solution.description,
    'solution',
    selectedSolutionId
  )

  // Generate SEO-friendly titles (30-60 characters)
  const getSolutionTitle = (solutionId: string, title: string, subtitle: string): string => {
    const suffix = ' | AlertMend AI' // 17 characters
    const maxTitleLength = 60 - suffix.length // 43 characters available
    
    // Create shorter, more concise titles
    const shortTitles: Record<string, string> = {
      'auto-remediation': 'Auto-Remediation & Root Cause Analysis',
      'kubernetes-management': 'Kubernetes Management with AI',
      'on-call-management': 'On-Call Management & Incident Alerts',
      'kubernetes-cost-optimization': 'Kubernetes Cost Optimization',
    }
    
    const shortTitle = shortTitles[solutionId] || title
    const finalTitle = shortTitle.length <= maxTitleLength 
      ? `${shortTitle}${suffix}`
      : `${shortTitle.substring(0, maxTitleLength - 3)}...${suffix}`
    
    // Ensure minimum 30 characters
    if (finalTitle.length < 30) {
      return `${shortTitle} - ${subtitle.substring(0, 12)}${suffix}`
    }
    
    return finalTitle
  }

  const seoTitle = getSolutionTitle(selectedSolutionId, solution.title, solution.subtitle)

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title={seoTitle}
        description={uniqueDescription}
        keywords={`${solution.title}, ${solution.subtitle}, AlertMend AI, AIOps, Kubernetes, infrastructure automation, ${selectedSolutionId === 'auto-remediation' ? 'auto-remediation, incident management' : selectedSolutionId === 'kubernetes-management' ? 'Kubernetes management, cluster monitoring' : selectedSolutionId === 'on-call-management' ? 'on-call management, incident alerts' : 'cost optimization, Kubernetes cost management'}`}
        canonical={`/${selectedSolutionId}`}
      />
      <Navbar />
      
      <Hero solutionId={selectedSolutionId} />
      
      <ROIMetrics />
      
      <HowItWorks solutionId={selectedSolutionId} />
      
      <Integrations />
      
      <Benefits solutionId={selectedSolutionId} />
      
      <CaseStudies />
      
      <CTA solutionId={selectedSolutionId} />
      
      <LanguageSupport />
      
      <FAQ />

      <Footer />
    </div>
  )
}
