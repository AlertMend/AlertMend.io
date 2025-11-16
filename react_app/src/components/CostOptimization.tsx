import { DollarSign, TrendingDown, PieChart, Target, ArrowRight } from 'lucide-react'

export default function CostOptimization() {
  const optimizations = [
    {
      title: 'Predictive Disk Auto-Scaling',
      description: 'Predict demand. Auto-scale. No over-provisioning. Save 25-40%.',
      savings: '25-40%',
      icon: Target,
    },
    {
      title: 'Smart Log Rotation',
      description: 'Auto-rotate logs. Optimize storage. Cut costs 20-35%.',
      savings: '20-35%',
      icon: TrendingDown,
    },
    {
      title: 'Resource Usage Monitoring',
      description: 'Track usage. Find waste. Auto-optimize. Save 15-30%.',
      savings: '15-30%',
      icon: PieChart,
    },
    {
      title: 'Automated Optimization',
      description: 'AI recommendations. Auto-actions. Reduce costs 10-25%.',
      savings: '10-25%',
      icon: ArrowRight,
    },
  ]

  const costBreakdown = [
    { category: 'Compute', current: 45000, optimized: 28000, color: 'bg-blue-500' },
    { category: 'Storage', current: 12000, optimized: 8500, color: 'bg-green-500' },
    { category: 'Network', current: 8000, optimized: 6500, color: 'bg-purple-500' },
    { category: 'Other', current: 5000, optimized: 3000, color: 'bg-yellow-500' },
  ]

  const totalCurrent = costBreakdown.reduce((sum, item) => sum + item.current, 0)
  const totalOptimized = costBreakdown.reduce((sum, item) => sum + item.optimized, 0)
  const totalSavings = totalCurrent - totalOptimized
  const savingsPercent = ((totalSavings / totalCurrent) * 100).toFixed(1)

  return (
    <section id="cost-optimization" className="section-padding container-padding bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="badge bg-purple-100 text-purple-700 mb-4">
            Optimize
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold heading-gradient mb-6 text-balance">
            Cut Costs 50%. Automatically.
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto text-balance leading-relaxed">
            Dynamic right-sizing. Intelligent placement. Predictive autoscaling. 
            Zero-downtime migration. Same performance. Half the cost.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <h3 className="text-2xl font-bold text-purple-950 mb-6">Optimization Strategies</h3>
            <div className="space-y-6">
              {optimizations.map((opt, index) => {
                const Icon = opt.icon
                return (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="bg-purple-50 rounded-lg p-3">
                      <Icon className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-purple-950">{opt.title}</h4>
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                          Save {opt.savings}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">{opt.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <h3 className="text-2xl font-bold text-purple-950 mb-6">Cost Analysis</h3>
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-4xl font-bold text-gray-900">${(totalCurrent / 1000).toFixed(0)}k</div>
                  <div className="text-sm text-gray-600">Current Monthly Cost</div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-green-600">${(totalOptimized / 1000).toFixed(0)}k</div>
                  <div className="text-sm text-gray-600">Optimized Cost</div>
                </div>
              </div>
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-700 mb-1">
                  ${(totalSavings / 1000).toFixed(0)}k saved ({savingsPercent}%)
                </div>
                <div className="text-sm text-green-600">Potential monthly savings</div>
              </div>
            </div>

            <div className="space-y-4">
              {costBreakdown.map((item, index) => {
                const currentPercent = (item.current / totalCurrent) * 100
                const optimizedPercent = (item.optimized / totalCurrent) * 100
                return (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-gray-700">{item.category}</span>
                      <span className="text-gray-600">
                        ${(item.current / 1000).toFixed(0)}k → ${(item.optimized / 1000).toFixed(0)}k
                      </span>
                    </div>
                    <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`absolute left-0 top-0 h-full ${item.color} opacity-30`}
                        style={{ width: `${currentPercent}%` }}
                      />
                      <div
                        className={`absolute left-0 top-0 h-full ${item.color}`}
                        style={{ width: `${optimizedPercent}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 md:p-12 text-white text-center">
          <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-80" />
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Start Saving Today
          </h3>
          <p className="text-lg text-purple-100 mb-6 max-w-2xl mx-auto">
            Get a free cost analysis of your Kubernetes infrastructure and see 
            how much you could save with intelligent optimization.
          </p>
          <button 
            onClick={() => window.open('https://calendly.com/hello-alertmend', '_blank')}
            className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors shadow-lg"
          >
            Book a Demo
          </button>
        </div>
      </div>
    </section>
  )
}

