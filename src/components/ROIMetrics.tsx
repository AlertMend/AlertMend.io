import { DollarSign, AlertCircle, Clock, TrendingUp } from 'lucide-react'

export default function ROIMetrics() {
  const metrics = [
    {
      icon: DollarSign,
      value: '$10M+',
      label: 'Saved in Kubernetes costs',
      description: 'Across all customers',
      iconColor: 'text-green-600',
      iconBg: 'bg-green-50',
      valueColor: 'text-green-600',
    },
    {
      icon: AlertCircle,
      value: '100K+',
      label: 'Production incidents resolved',
      description: 'Automatically fixed',
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50',
      valueColor: 'text-blue-600',
    },
    {
      icon: Clock,
      value: '90%',
      label: 'Engineering time saved',
      description: 'On manual operations',
      iconColor: 'text-green-600',
      iconBg: 'bg-green-50',
      valueColor: 'text-green-600',
    },
    {
      icon: TrendingUp,
      value: '80%',
      label: 'Reduction in escalations',
      description: 'Fewer tickets and alerts',
      iconColor: 'text-green-600',
      iconBg: 'bg-green-50',
      valueColor: 'text-green-600',
    },
  ]

  return (
    <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden gradient-bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-purple-50 via-purple-100 to-purple-50 text-purple-700 rounded-full text-sm font-bold mb-5 shadow-md border border-purple-200/50">
            <span>Proven Results</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-purple-950 mb-4 leading-tight">
            Trusted by Teams Worldwide
          </h2>
          <p className="text-lg md:text-xl text-purple-700 max-w-3xl mx-auto leading-relaxed">
            Real impact from teams using AlertMend AI across industries
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {metrics.map((metric, index) => {
            const Icon = metric.icon
            return (
              <div 
                key={index} 
                className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200/50 hover:border-purple-300 hover:shadow-xl transition-all duration-300 text-center"
              >
                {/* Gradient background on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50/0 via-purple-50/0 to-purple-100/0 group-hover:from-purple-50/60 group-hover:via-purple-50/30 group-hover:to-purple-100/40 transition-all duration-500 rounded-2xl"></div>
                
                <div className="relative z-10">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${metric.iconBg} ${metric.iconColor} mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-md`}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <div className={`text-2xl md:text-3xl font-bold ${metric.valueColor} mb-2`}>
                    {metric.value}
                  </div>
                  <div className="text-base font-bold text-purple-900 mb-1.5">
                    {metric.label}
                  </div>
                  <div className="text-sm text-purple-600">
                    {metric.description}
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

