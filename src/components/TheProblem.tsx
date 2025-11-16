import { Activity, Zap, DollarSign, Users } from 'lucide-react'

export default function TheProblem() {
  const problems = [
    {
      icon: Activity,
      title: 'Time Saved',
      description: 'Automate operations. Focus on building. Scale faster',
      stat: '15-20 hrs/week',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: Zap,
      title: 'Instant Resolution',
      description: 'AI-powered fixes in seconds. Proactive protection',
      stat: '< 15s MTTR',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: DollarSign,
      title: 'Cost Savings',
      description: 'Intelligent optimization. Right-sized resources. Maximum efficiency',
      stat: '50% saved',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: Users,
      title: 'Team Empowerment',
      description: 'Automated operations. Reduced workload. Higher productivity',
      stat: '90% efficiency',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
  ]

  return (
    <section id="the-problem" className="section-padding container-padding bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="badge bg-primary-500/20 text-primary-300 border border-primary-500/30 mb-6">
            The Opportunity
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-balance">
            Transform Kubernetes Operations
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto text-balance leading-relaxed">
            Scale confidently. Resolve incidents instantly. Optimize costs automatically. 
            Autonomous AI that empowers teams to focus on innovation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {problems.map((problem, index) => {
            const Icon = problem.icon
            return (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <div className={`${problem.bgColor} ${problem.color} w-14 h-14 rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className="h-7 w-7" />
                </div>
                <div className="text-2xl font-bold text-white mb-2">{problem.stat}</div>
                <h3 className="text-lg font-semibold mb-2 text-white">{problem.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{problem.description}</p>
              </div>
            )
          })}
        </div>

        <div className="bg-gradient-to-r from-primary-600/20 to-blue-600/20 rounded-2xl p-8 md:p-12 border border-primary-500/30 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Autonomous AI That Works
          </h3>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-6">
            Intelligent automation that detects, analyzes, and fixes incidents proactively. 
            Empower your team. Scale confidently. Achieve excellence.
          </p>
          <button
            onClick={() => {
              const element = document.getElementById('how-it-works')
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }
            }}
            className="bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl"
          >
            See How It Works →
          </button>
        </div>
      </div>
    </section>
  )
}

