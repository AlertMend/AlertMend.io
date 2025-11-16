import { Settings, Zap, DollarSign, Shield, TrendingUp, Activity } from 'lucide-react'

interface FeaturesProps {
  onFeatureClick?: (feature: string) => void
}

export default function Features({ onFeatureClick }: FeaturesProps) {
  const features = [
    {
      id: 'k8s-management',
      icon: Settings,
      title: 'Kubernetes Solutions',
      description: 'Auto-troubleshoot and resolve issues. Works with AWS, GCP, Azure, and all major tools.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      id: 'auto-remediation',
      icon: Zap,
      title: 'Automated Incident Remediation',
      description: 'Detect and fix issues in seconds. Pre-built workflows. Zero human intervention.',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      id: 'cost-optimization',
      icon: DollarSign,
      title: 'Cost Optimization',
      description: 'Cut cloud costs by 50%. Predictive scaling. Smart resource management. Automatic.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ]

  const additionalFeatures = [
    {
      icon: Shield,
      title: 'Cloud Integration',
      description: 'AWS, GCP, Azure. All major tools. One integration.',
    },
    {
      icon: TrendingUp,
      title: '99.97% Uptime',
      description: 'Auto-fix issues before they impact users',
    },
    {
      icon: Activity,
      title: 'Instant Response',
      description: 'Detect. Fix. Verify. All in seconds.',
    },
  ]

  const handleClick = (id: string) => {
    if (onFeatureClick) {
      onFeatureClick(id)
    }
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <section id="features" className="section-padding container-padding bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="badge bg-primary-100 text-primary-700 mb-4">
            Core Features
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold heading-gradient mb-5 text-balance">
            Automate. Optimize. Scale.
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto text-balance leading-relaxed">
            Three solutions. One goal: zero manual work, maximum reliability.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 lg:gap-6 mb-12">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.id}
                onClick={() => handleClick(feature.id)}
                className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 card-hover cursor-pointer"
              >
                <div className={`${feature.bgColor} w-14 h-14 rounded-xl flex items-center justify-center mb-5 shadow-sm`}>
                  <Icon className={`h-7 w-7 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold text-purple-950 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-5">{feature.description}</p>
                <button 
                  onClick={() => handleClick(feature.id)}
                  className="mt-auto text-primary-600 font-semibold hover:text-primary-700 flex items-center space-x-2 group"
                  aria-label={`Learn more about ${feature.title}`}
                >
                  <span>Learn more</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            )
          })}
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          {additionalFeatures.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="bg-gray-50 p-5 rounded-xl border border-gray-200"
              >
                <Icon className="h-6 w-6 text-primary-600 mb-3" />
                <h4 className="text-lg font-semibold text-purple-950 mb-2">{feature.title}</h4>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

