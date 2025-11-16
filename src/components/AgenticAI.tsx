import { Brain, Zap, Shield, Target, CheckCircle2 } from 'lucide-react'

export default function AgenticAI() {
  const capabilities = [
    {
      icon: Brain,
      title: 'Agentic AI Technology',
      description: 'Hundreds of specialized agents. Thousands of production environments. 95% accuracy. Real incidents. Real results.',
    },
    {
      icon: Zap,
      title: 'Autonomous Remediation',
      description: 'Fixes the unfixable. Failed containers. Cascading errors. Faulty add-ons. All resolved. Automatically.',
    },
    {
      icon: Shield,
      title: 'Field-Proven Accuracy',
      description: 'Battle-tested. Production-proven. Consistent results. Across diverse environments. Every time.',
    },
    {
      icon: Target,
      title: 'Context-Aware Intelligence',
      description: 'Understands your infrastructure. Learns your patterns. Adapts to your environment. Optimizes continuously.',
    },
  ]

  return (
    <section className="section-padding container-padding bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="badge bg-primary-500/20 text-primary-300 border border-primary-500/30 mb-6">
            Agentic AI Technology
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-balance">
            Not Another AI Assistant. This One Actually Works.
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto text-balance leading-relaxed">
            Agentic AI that resolves the toughest cloud-native issues—failed containers, cascading errors, 
            faulty add-ons, CRDs, workload breakdowns. Trained on thousands of production environments. 
            95% accuracy. Battle-tested.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {capabilities.map((capability, index) => {
            const Icon = capability.icon
            return (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <div className="bg-primary-500/20 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                  <Icon className="h-7 w-7 text-primary-300" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{capability.title}</h3>
                <p className="text-gray-300 leading-relaxed">{capability.description}</p>
              </div>
            )
          })}
        </div>

        <div className="bg-gradient-to-r from-primary-600/20 to-blue-600/20 rounded-2xl p-8 md:p-12 border border-primary-500/30">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                How It Works
              </h3>
              <p className="text-lg text-gray-300 mb-6">
                Our agentic AI system uses specialized agents that work together to understand context, 
                analyze root causes, and execute remediation—all autonomously.
              </p>
              <ul className="space-y-3">
                {[
                  'Context-aware incident detection',
                  'Multi-agent collaboration for complex issues',
                  'Continuous learning from production patterns',
                  'Autonomous decision-making and execution',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-primary-300 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1 bg-white/5 rounded-xl p-8 border border-white/10">
              <div className="text-center">
                <div className="text-5xl font-bold text-primary-300 mb-2">95%</div>
                <div className="text-lg text-gray-300 mb-4">Accuracy Rate</div>
                <div className="text-sm text-gray-400">
                  Across thousands of production incidents
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

