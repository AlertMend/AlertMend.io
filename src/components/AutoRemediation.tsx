import { AlertTriangle, CheckCircle2, Clock, Zap, Brain, Shield } from 'lucide-react'

export default function AutoRemediation() {
  const remediationTypes = [
    {
      icon: AlertTriangle,
      title: 'Crash-Looping Pods',
      description: 'Auto-recover pods. Smart restarts. Root cause analysis. Fixed in seconds.',
      time: '< 30s',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      icon: Zap,
      title: 'Network Health',
      description: 'Auto-fix network issues. Service mesh problems. Instant resolution.',
      time: '< 1min',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      icon: Shield,
      title: 'Predictive Scaling',
      description: 'Predict and prevent issues. Auto-scale. Smart log rotation. No exhaustion.',
      time: '< 2min',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Brain,
      title: 'Custom Workflows',
      description: 'Pre-built templates. Custom rules. Instant action on alerts.',
      time: '< 3min',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ]

  const stats = [
    { label: 'Issues Detected', value: '15,234', trend: '+12%' },
    { label: 'Auto-Resolved', value: '14,891', trend: '98%' },
    { label: 'Avg Resolution Time', value: '45s', trend: '-30%' },
    { label: 'Uptime Improvement', value: '99.97%', trend: '+0.5%' },
  ]

  return (
    <section id="auto-remediation" className="section-padding container-padding bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="badge bg-green-100 text-green-700 mb-4">
            Troubleshoot
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold heading-gradient mb-6 text-balance">
            Detect. Analyze. Fix. All Automatic.
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto text-balance leading-relaxed">
            MTTR slashed to seconds. AI-driven root cause analysis. One-click fixes. 
            Autonomous self-healing. Even in the most complex environments.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {remediationTypes.map((type, index) => {
            const Icon = type.icon
            return (
              <div
                key={index}
                className="bg-white p-6 rounded-xl border-2 border-gray-100 card-hover"
              >
                <div className={`${type.bgColor} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                  <Icon className={`h-6 w-6 ${type.color}`} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{type.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{type.description}</p>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>{type.time}</span>
                </div>
              </div>
            )
          })}
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Remediation Workflow</h3>
            <div className="space-y-4">
              {[
                { step: '1', title: 'Detection', desc: 'AI monitors 24/7', icon: AlertTriangle },
                { step: '2', title: 'Analysis', desc: 'ML-powered root cause analysis', icon: Brain },
                { step: '3', title: 'Remediation', desc: 'Auto-fix deployed instantly', icon: Zap },
                { step: '4', title: 'Verification', desc: 'Confirm & log results', icon: CheckCircle2 },
              ].map((item, index) => {
                const Icon = item.icon
                return (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="bg-white rounded-full p-2 shadow-sm">
                      <Icon className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{item.step}. {item.title}</div>
                      <div className="text-sm text-gray-600">{item.desc}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Performance Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600 mb-2">{stat.label}</div>
                  <div className="text-sm text-green-600 font-semibold">{stat.trend}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

