import { Shield, TrendingUp, DollarSign, Zap, Activity, Bell, Clock, CheckCircle2, Users } from 'lucide-react'

interface BenefitsProps {
  solutionId?: string
}

interface BenefitItem {
  icon: typeof Shield
  value: string
  title: string
  description: string
  color: string
  bgColor: string
  gradientFrom: string
  gradientVia: string
  gradientTo: string
}

interface SolutionBenefits {
  title: string
  description: string
  benefits: BenefitItem[]
}

export default function Benefits({ solutionId = 'default' }: BenefitsProps) {
  // Default benefits (used when solutionId is 'default' or not specified)
  const defaultBenefits: SolutionBenefits = {
    title: 'Automate Operations. Maximize Uptime. Multiply Engineering Impact.',
    description: 'Our AI eliminates manual work, reduces cloud waste, and keeps systems running smoothly—so your team delivers faster with fewer resources.',
    benefits: [
      {
        icon: Shield,
        value: '99.97%',
        title: 'Uptime',
        description: 'Proactive protection ensures maximum reliability and zero downtime',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        gradientFrom: 'from-green-50/0',
        gradientVia: 'via-green-100/0',
        gradientTo: 'to-green-200/0',
      },
      {
        icon: DollarSign,
        value: '50%',
        title: 'Cost Reduction',
        description: 'Automatic optimization reduces infrastructure spending without impacting performance',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        gradientFrom: 'from-green-50/0',
        gradientVia: 'via-green-100/0',
        gradientTo: 'to-green-200/0',
      },
      {
        icon: TrendingUp,
        value: '< 15s',
        title: 'Response Time',
        description: 'Lightning-fast detection and resolution of incidents before they impact users',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        gradientFrom: 'from-blue-50/0',
        gradientVia: 'via-blue-100/0',
        gradientTo: 'to-blue-200/0',
      },
    ],
  }

  // Solution-specific benefits
  const solutionBenefits: Record<string, SolutionBenefits> = {
    'auto-remediation': {
      title: 'Automated Remediation. Zero Manual Intervention. Maximum Reliability.',
      description: 'Self-healing infrastructure that automatically detects, analyzes, and resolves incidents—eliminating on-call firefighting and reducing MTTR to seconds.',
      benefits: [
        {
          icon: Zap,
          value: '70%',
          title: 'Auto-Remediation Rate',
          description: 'Automatically resolves the majority of recurring incidents without human intervention',
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          gradientFrom: 'from-orange-50/0',
          gradientVia: 'via-orange-100/0',
          gradientTo: 'to-orange-200/0',
        },
        {
          icon: Clock,
          value: '< 15s',
          title: 'Mean Time to Resolution',
          description: 'Lightning-fast incident detection and automated resolution before users are impacted',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          gradientFrom: 'from-green-50/0',
          gradientVia: 'via-green-100/0',
          gradientTo: 'to-green-200/0',
        },
        {
          icon: Shield,
          value: '99.9%',
          title: 'Uptime Guarantee',
          description: 'Proactive protection and automated recovery ensure maximum system availability',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          gradientFrom: 'from-blue-50/0',
          gradientVia: 'via-blue-100/0',
          gradientTo: 'to-blue-200/0',
        },
      ],
    },
    'kubernetes-management': {
      title: 'Intelligent Kubernetes Management. Simplified Operations. Enhanced Performance.',
      description: 'AI-powered Kubernetes management that automates deployments, optimizes resources, and ensures your clusters run at peak efficiency.',
      benefits: [
        {
          icon: Activity,
          value: '40%',
          title: 'Resource Efficiency',
          description: 'Optimize pod placement and resource allocation to maximize cluster utilization',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          gradientFrom: 'from-blue-50/0',
          gradientVia: 'via-blue-100/0',
          gradientTo: 'to-blue-200/0',
        },
        {
          icon: TrendingUp,
          value: '3x',
          title: 'Deployment Speed',
          description: 'Automate CI/CD pipelines and reduce deployment time from hours to minutes',
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          gradientFrom: 'from-purple-50/0',
          gradientVia: 'via-purple-100/0',
          gradientTo: 'to-purple-200/0',
        },
        {
          icon: CheckCircle2,
          value: '95%',
          title: 'Success Rate',
          description: 'Intelligent rollback and health checks ensure successful deployments every time',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          gradientFrom: 'from-green-50/0',
          gradientVia: 'via-green-100/0',
          gradientTo: 'to-green-200/0',
        },
      ],
    },
    'on-call-management': {
      title: 'Smart On-Call. Zero Missed Alerts. Maximum Team Efficiency.',
      description: 'Intelligent alert routing, on-call scheduling, and multi-channel notifications ensure critical incidents never go unnoticed.',
      benefits: [
        {
          icon: Bell,
          value: '0',
          title: 'Missed Alerts',
          description: 'Multi-channel notifications and intelligent routing ensure every critical alert is addressed',
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          gradientFrom: 'from-purple-50/0',
          gradientVia: 'via-purple-100/0',
          gradientTo: 'to-purple-200/0',
        },
        {
          icon: Users,
          value: '3x',
          title: 'On-Call Efficiency',
          description: 'Automated scheduling, escalation policies, and smart routing reduce on-call burden',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          gradientFrom: 'from-blue-50/0',
          gradientVia: 'via-blue-100/0',
          gradientTo: 'to-blue-200/0',
        },
        {
          icon: Clock,
          value: '< 30s',
          title: 'Alert Response Time',
          description: 'Instant notifications across Slack, Teams, email, and phone ensure rapid incident response',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          gradientFrom: 'from-green-50/0',
          gradientVia: 'via-green-100/0',
          gradientTo: 'to-green-200/0',
        },
      ],
    },
    'kubernetes-cost-optimization': {
      title: 'Intelligent Cost Optimization. Maximum Savings. Zero Performance Impact.',
      description: 'AI-driven cost optimization that automatically rightsizes resources, eliminates waste, and reduces cloud spending by up to 50% without sacrificing performance.',
      benefits: [
        {
          icon: DollarSign,
          value: '50%',
          title: 'Cost Reduction',
          description: 'Automatically identify and eliminate wasted resources to cut cloud spending in half',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          gradientFrom: 'from-green-50/0',
          gradientVia: 'via-green-100/0',
          gradientTo: 'to-green-200/0',
        },
        {
          icon: Activity,
          value: '35%',
          title: 'Resource Optimization',
          description: 'Intelligent rightsizing and autoscaling ensure optimal resource utilization',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          gradientFrom: 'from-blue-50/0',
          gradientVia: 'via-blue-100/0',
          gradientTo: 'to-blue-200/0',
        },
        {
          icon: TrendingUp,
          value: '0%',
          title: 'Performance Impact',
          description: 'Cost optimization without compromising application performance or user experience',
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          gradientFrom: 'from-purple-50/0',
          gradientVia: 'via-purple-100/0',
          gradientTo: 'to-purple-200/0',
        },
      ],
    },
  }

  // Get benefits for current solution or default
  const currentBenefits = solutionBenefits[solutionId] || defaultBenefits

  return (
    <section id="benefits" className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden gradient-bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-purple-50 via-purple-100 to-purple-50 text-purple-700 rounded-full text-sm font-bold mb-5 shadow-md border border-purple-200/50">
            <span>Benefits</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-purple-950 mb-4 leading-tight">
            {currentBenefits.title}
          </h2>
          <p className="text-lg md:text-xl text-purple-700 max-w-3xl mx-auto leading-relaxed">
            {currentBenefits.description}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 lg:gap-6">
          {currentBenefits.benefits.map((benefit, index) => {
            const Icon = benefit.icon
            // Extract color name for hover gradient
            const colorMatch = benefit.gradientFrom.match(/from-(\w+)-50/)
            const colorName = colorMatch ? colorMatch[1] : 'green'
            
            // Color mapping for gradient opacity
            const colorMap: Record<string, { from: string; via: string; to: string }> = {
              green: { from: 'rgba(240, 253, 244, 0.6)', via: 'rgba(187, 247, 208, 0.4)', to: 'rgba(134, 239, 172, 0.3)' },
              blue: { from: 'rgba(239, 246, 255, 0.6)', via: 'rgba(191, 219, 254, 0.4)', to: 'rgba(147, 197, 253, 0.3)' },
              orange: { from: 'rgba(255, 247, 237, 0.6)', via: 'rgba(254, 215, 170, 0.4)', to: 'rgba(253, 186, 116, 0.3)' },
              purple: { from: 'rgba(250, 245, 255, 0.6)', via: 'rgba(233, 213, 255, 0.4)', to: 'rgba(196, 181, 253, 0.3)' },
            }
            const hoverColors = colorMap[colorName] || colorMap.green
            
            return (
              <div key={index} className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 border-2 border-gray-200/50 hover:border-purple-300 hover:shadow-xl transition-all duration-300 text-center relative overflow-hidden">
                <div 
                  className="absolute inset-0 bg-gradient-to-br transition-all duration-500 rounded-2xl opacity-0 group-hover:opacity-100"
                  style={{
                    background: `linear-gradient(to bottom right, ${hoverColors.from}, ${hoverColors.via}, ${hoverColors.to})`
                  }}
                ></div>
            <div className="relative z-10">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${benefit.bgColor} ${benefit.color} mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-md`}>
                    <Icon className="h-7 w-7" />
              </div>
                  <div className={`text-3xl md:text-4xl font-bold ${benefit.color} mb-2`}>{benefit.value}</div>
                  <h3 className="text-lg font-bold text-purple-950 mb-2 group-hover:text-purple-900 transition-colors">{benefit.title}</h3>
              <p className="text-base text-purple-700 leading-relaxed">
                    {benefit.description}
              </p>
            </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

