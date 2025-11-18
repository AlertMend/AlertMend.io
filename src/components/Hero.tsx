import { ArrowRight, Search, Zap, Activity, Bell, DollarSign } from 'lucide-react'

interface HeroProps {
  solutionId?: string
}

export default function Hero({ solutionId = 'default' }: HeroProps) {
  const handleBookDemo = () => {
    window.open('https://calendly.com/hello-alertmend', '_blank')
  }

  // Solution-specific signup URLs
  const signupUrls: Record<string, string> = {
    'default': 'https://demo.alertmend.io/signup',
    'auto-remediation': 'https://demo.alertmend.io/signup?service=remediation',
    'kubernetes-management': 'https://demo.alertmend.io/signup?service=monitoring',
    'on-call-management': 'https://demo.alertmend.io/signup?service=on-call',
    'kubernetes-cost-optimization': 'https://demo.alertmend.io/signup?service=cost-optimization',
  }

  // Get signup URL for current solution or default
  const signupUrl = signupUrls[solutionId] || signupUrls['default']

  // Solution-specific content
  const solutionContent = {
    'default': {
      badge: { icon: Search, text: 'AI-Powered Infrastructure Automation', color: 'purple' },
      title: 'Maximize Reliability. Minimize Costs. Multiply Engineering Impact.',
      description: 'Our AI eliminates manual DevOps work, reduces cloud waste, and keeps systems resilient—so your team delivers faster with fewer resources.',
      metrics: [
        { value: '50%', label: 'Cost Savings', color: 'text-green-600' },
        { value: '90%', label: 'Time Saved', color: 'text-green-600' },
        { value: '0', label: 'Downtime', color: 'text-blue-600' },
      ],
    },
    'auto-remediation': {
      badge: { icon: Zap, text: 'Automated Incident Remediation', color: 'orange' },
      title: 'Self-Healing Infrastructure with AI',
      description: 'Run AI-driven workflows the moment alerts fire. Restart failed pods, resize PVCs, or fix recurring issues automatically with intelligent runbooks. Handle up to 70% of incidents automatically.',
      metrics: [
        { value: '70%', label: 'Auto-Remediation', color: 'text-orange-600' },
        { value: '<15s', label: 'MTTR', color: 'text-orange-600' },
        { value: '100K+', label: 'Issues Fixed', color: 'text-green-600' },
      ],
    },
    'kubernetes-management': {
      badge: { icon: Activity, text: 'Kubernetes Management with AI', color: 'blue' },
      title: 'Intelligent Kubernetes Operations & Management',
      description: 'AI-powered Kubernetes cluster management with automated troubleshooting, proactive monitoring, and intelligent resource optimization. Manage multi-cluster environments effortlessly and maintain up to 99.97% uptime.',
      metrics: [
        { value: '45%', label: 'Faster Response', color: 'text-blue-600' },
        { value: '99.97%', label: 'Uptime', color: 'text-green-600' },
        { value: '24/7', label: 'Monitoring', color: 'text-blue-600' },
      ],
    },
    'on-call-management': {
      badge: { icon: Bell, text: 'On-Call', color: 'purple' },
      title: 'Never Miss a Critical Alert',
      description: 'Receive instant alerts through Slack, Microsoft Teams, email, or phone calls when issues occur. Manage on-call schedules easily and reduce response delays. Improve on-call efficiency by up to 3x.',
      metrics: [
        { value: '3x', label: 'Efficiency', color: 'text-purple-600' },
        { value: '0', label: 'Missed Alerts', color: 'text-green-600' },
        { value: '<30s', label: 'Alert Time', color: 'text-purple-600' },
      ],
    },
    'kubernetes-cost-optimization': {
      badge: { icon: DollarSign, text: 'Kubernetes Cost Optimization', color: 'green' },
      title: 'Maximize Kubernetes ROI & Reduce Costs',
      description: 'AI-powered Kubernetes cost optimization that identifies idle workloads, right-sizes containers, and eliminates waste. Save significantly on Kubernetes costs while maintaining system performance. Customers save an average of over $8,000 per month.',
      metrics: [
        { value: '50%', label: 'Cost Reduction', color: 'text-green-600' },
        { value: '$8K+', label: 'Monthly Savings', color: 'text-green-600' },
        { value: '0%', label: 'Performance Impact', color: 'text-blue-600' },
      ],
    },
  }

  const content = solutionContent[solutionId as keyof typeof solutionContent] || solutionContent.default
  const BadgeIcon = content.badge.icon
  const badgeColorClass = content.badge.color === 'orange' ? 'bg-orange-50 border-orange-200/50 text-orange-700' :
                          content.badge.color === 'blue' ? 'bg-blue-50 border-blue-200/50 text-blue-700' :
                          content.badge.color === 'green' ? 'bg-green-50 border-green-200/50 text-green-700' :
                          'bg-purple-50 border-purple-200/50 text-purple-700'
  const badgeIconColorClass = content.badge.color === 'orange' ? 'text-orange-600' :
                              content.badge.color === 'blue' ? 'text-blue-600' :
                              content.badge.color === 'green' ? 'text-green-600' :
                              'text-purple-600'

  return (
    <header className="pt-24 pb-16 md:pt-32 md:pb-24 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-white to-blue-50/30 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Text Content */}
          <div>
            <div className={`inline-flex items-center space-x-2 ${badgeColorClass} px-4 py-2 rounded-full mb-6 border w-fit mx-auto`}>
              <BadgeIcon className={`h-4 w-4 ${badgeIconColorClass}`} />
              <span className="text-sm font-semibold">{content.badge.text}</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-purple-950">
              {content.title}
            </h1>
            
            <p className="text-lg md:text-xl lg:text-2xl text-purple-700 mb-8 leading-relaxed max-w-3xl mx-auto">
              {content.description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button 
                onClick={handleBookDemo}
                className="group bg-gradient-to-r from-purple-800 to-purple-900 text-white px-8 py-3.5 rounded-xl font-semibold hover:from-purple-900 hover:to-purple-950 transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center space-x-2"
              >
                <span>Book a Demo</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => window.open(signupUrl, '_blank')}
                className="border-2 border-purple-800 text-purple-900 px-8 py-3.5 rounded-xl font-semibold hover:bg-purple-50 transition-all flex items-center justify-center space-x-2"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-3 gap-6 lg:gap-8 pt-8 border-t border-purple-200/50 max-w-2xl mx-auto">
              {content.metrics.map((metric, index) => (
                <div key={index} className="text-center">
                  <div className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-2 ${metric.color}`}>{metric.value}</div>
                  <div className="text-sm md:text-base text-purple-700 font-medium">{metric.label}</div>
              </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

