import { CheckCircle, Server, Network, GitBranch, BarChart3 } from 'lucide-react'

export default function K8sManagement() {
  const capabilities = [
    'Multi-cluster management',
    'Real-time health monitoring',
    'Auto-scaling & resource allocation',
    'RBAC & namespace management',
    'Deployment rollback & version control',
    'Service mesh integration',
  ]

  const metrics = [
    { label: 'Clusters Managed', value: '10,000+', icon: Server },
    { label: 'Nodes Monitored', value: '50,000+', icon: Network },
    { label: 'Deployments', value: '1M+', icon: GitBranch },
    { label: 'Uptime', value: '99.9%', icon: BarChart3 },
  ]

  return (
    <section id="k8s-management" className="section-padding container-padding bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="badge bg-blue-100 text-blue-700 mb-4">
              Visualize
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold heading-gradient mb-6 text-balance">
              See Everything. Understand Instantly.
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed text-balance">
              Multi-cluster visibility. Contextual workspaces. Real-time insights. 
              Status, history, dependencies—all in one place. All intelligently organized.
            </p>

            <div className="space-y-4 mb-8">
              {capabilities.map((capability, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-lg">{capability}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => window.open('https://calendly.com/hello-alertmend', '_blank')}
              className="btn-primary"
              aria-label="Book a demo to see Kubernetes solutions in action"
            >
              Book a Demo
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
            <div className="grid grid-cols-2 gap-6 mb-8">
              {metrics.map((metric, index) => {
                const Icon = metric.icon
                return (
                  <div key={index} className="bg-gradient-to-br from-blue-50 to-primary-50 p-6 rounded-xl">
                    <Icon className="h-8 w-8 text-primary-600 mb-3" />
                    <div className="text-3xl font-bold text-gray-900 mb-1">{metric.value}</div>
                    <div className="text-sm text-gray-600">{metric.label}</div>
                  </div>
                )
              })}
            </div>

            <div className="bg-gray-900 rounded-xl p-6 text-green-400 font-mono text-sm">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>kubectl get clusters</span>
              </div>
              <div className="space-y-2">
                <div>NAME STATUS NODES VERSION</div>
                <div>prod-cluster Ready 12 v1.28.0</div>
                <div>staging-cluster Ready 6 v1.28.0</div>
                <div>dev-cluster Ready 3 v1.27.0</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

