import { Bell, Activity, Zap, DollarSign, Phone, MessageSquare, TrendingUp, CheckCircle2, BarChart3, AlertTriangle, Gauge, ArrowRight, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import CloudProviders from './CloudProviders'

export default function Solutions() {
  const navigate = useNavigate()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  
  const solutions = [
    {
      id: 'auto-remediation',
      icon: Zap,
      title: 'Automated Incident Remediation and Root Cause Analysis',
      subtitle: 'Self-Healing Infrastructure',
      description: 'Run AI-driven workflows the moment alerts fire. Restart failed pods, resize PVCs, or fix recurring issues automatically with intelligent runbooks.',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      hoverBg: 'from-orange-50/60 via-orange-100/40 to-orange-200/30',
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
      stat: 'Handled 70% of recurring incidents automatically for a SaaS startup.',
    },
    {
      id: 'kubernetes-management',
      icon: Activity,
      title: 'Kubernetes Management with AI',
      subtitle: 'Intelligent Kubernetes Operations',
      description: 'AI-powered Kubernetes cluster management with automated troubleshooting, proactive monitoring, and intelligent resource optimization. Manage multi-cluster environments effortlessly.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      hoverBg: 'from-blue-50/60 via-blue-100/40 to-blue-200/30',
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
      stat: 'Reduced incident response time by 45% for a logistics customer.',
    },
    {
      id: 'on-call-management',
      icon: Bell,
      title: 'On-Call and Incident Alerts',
      subtitle: 'Never Miss a Critical Alert',
      description: 'Receive instant alerts through Slack, Microsoft Teams, email, or phone calls when issues occur. Manage on-call schedules easily and reduce response delays.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      hoverBg: 'from-purple-50/60 via-purple-100/40 to-purple-200/30',
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
      stat: 'Improved on-call efficiency by 3x and reduced missed alerts to zero.',
    },
    {
      id: 'kubernetes-cost-optimization',
      icon: DollarSign,
      title: 'Kubernetes Cost Optimization and Resource Management',
      subtitle: 'Maximize Kubernetes ROI',
      description: 'AI-powered Kubernetes cost optimization that identifies idle workloads, right-sizes containers, and eliminates waste. Save significantly on Kubernetes costs while maintaining system performance.',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      hoverBg: 'from-green-50/60 via-green-100/40 to-green-200/30',
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
      stat: 'One of our customers saved over USD 8,000 per month in Kubernetes costs.',
    },
  ]


  return (
    <section id="solutions" className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden gradient-bg-white">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-40 w-96 h-96 bg-purple-100/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl animate-pulse animate-delay-1s"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-purple-50 via-purple-100 to-purple-50 text-purple-700 rounded-full text-sm font-bold mb-5 shadow-lg backdrop-blur-sm border border-purple-200/50">
            <Sparkles className="h-4 w-4 text-purple-600" />
            <span>Our Solutions</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-purple-950 mb-4 leading-tight">
            Complete Infrastructure Intelligence
          </h2>
          <p className="text-lg md:text-xl text-purple-700 max-w-3xl mx-auto leading-relaxed mb-6">
            AlertMend AI empowers DevOps, SRE, and IT teams with AI-driven reliability, cost optimization, and on-call automation across AWS, Google Cloud, and Azure environments.
          </p>
          <div className="flex justify-center mb-10">
            <CloudProviders />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5 lg:gap-6">
          {solutions.map((solution, index) => {
            const Icon = solution.icon
            const isHovered = hoveredIndex === index
            return (
              <div
                key={index}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => {
                  navigate(`/${solution.id}`)
                  // Scroll to top after navigation
                  setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: 'instant' })
                  }, 0)
                }}
                className="group relative bg-white/80 backdrop-blur-xl rounded-2xl p-6 lg:p-7 border-2 border-gray-200/50 hover:border-purple-300/80 hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer overflow-hidden"
                style={{ 
                  transform: isHovered ? 'translateY(-4px) scale(1.01)' : 'translateY(0) scale(1)',
                }}
              >
                {/* Animated gradient border */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${solution.hoverBg} opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`}></div>
                
                {/* Glow effect */}
                <div className={`absolute -inset-1 bg-gradient-to-r ${solution.hoverBg} rounded-2xl opacity-0 group-hover:opacity-15 blur-lg transition-opacity duration-300 -z-20`}></div>
                
                <div className="relative z-10 flex flex-col h-full">
                  {/* Icon */}
                  <div className="mb-3 relative">
                    <div className={`${solution.bgColor} w-12 h-12 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                      <Icon className={`h-6 w-6 ${solution.color}`} />
                    </div>
                  </div>

                  {/* Title and Subtitle */}
                  <div className="mb-3 flex-grow">
                    <h3 className="text-lg md:text-xl font-bold text-purple-950 mb-2 group-hover:text-purple-900 transition-colors leading-tight">
                      {solution.title}
                    </h3>
                    <p className="text-sm text-purple-700 leading-relaxed">
                      {solution.description}
                    </p>
                  </div>

                  {/* Metrics - Simplified */}
                  <div className="pt-3 border-t border-gray-200/50 mb-3">
                    <div className="grid grid-cols-2 gap-2.5">
                      {solution.metrics.map((metric, idx) => (
                        <div 
                          key={idx} 
                          className="text-center p-2.5 rounded-lg bg-gradient-to-br from-gray-50 to-white group-hover:from-purple-50/50 group-hover:to-white transition-all duration-300 border border-gray-100"
                        >
                          <div className={`text-xl font-bold ${solution.color} mb-1`}>
                            {metric.value}
                          </div>
                          <div className="text-xs text-purple-600 font-semibold uppercase tracking-wide">
                            {metric.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                    
                  {/* CTA Button */}
                  <div className="mt-auto">
                    <div className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-50 to-purple-100/50 rounded-lg border border-purple-200/50 group-hover:from-purple-100 group-hover:to-purple-200/50 group-hover:border-purple-300/80 transition-all duration-300">
                      <span className="text-xs font-bold text-purple-800 group-hover:text-purple-900 transition-colors">
                        Learn More
                      </span>
                      <ArrowRight className="h-4 w-4 text-purple-700 group-hover:translate-x-1 group-hover:text-purple-900 transition-all duration-300" />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}

