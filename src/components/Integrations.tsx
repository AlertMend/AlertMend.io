import { useState } from 'react'
import { Bell, Activity, Settings, AlertCircle, Webhook, Server, CheckSquare } from 'lucide-react'

// Integration logos - All logos are in public/logos/ directory
// Format: { name: 'Name', logo: '/logos/name-logo.png', icon: IconComponent, color: 'text-color', bg: 'bg-white' }
const integrations = [
  { name: 'Slack', logo: '/logos/Slack_logo.png', icon: null, color: 'text-purple-600', bg: 'bg-white' }, // ✓ Logo exists
  { name: 'PagerDuty', logo: '/logos/pagerduty-logo.svg', icon: Bell, color: 'text-purple-600', bg: 'bg-white' }, // ✓ Logo exists
  { name: 'Splunk', logo: '/logos/splunk-logo.png', icon: Activity, color: 'text-green-600', bg: 'bg-white' }, // ✓ Logo exists
  { name: 'Prometheus', logo: '/logos/prometheus.png', icon: null, color: 'text-red-600', bg: 'bg-white' }, // ✓ Logo exists
  { name: 'Google Cloud', logo: '/logos/gcp-logo.png', icon: null, color: 'text-blue-600', bg: 'bg-white' }, // ✓ Logo exists
  { name: 'Jira', logo: '/logos/Jira_Logo.png', icon: CheckSquare, color: 'text-blue-600', bg: 'bg-white' }, // ✓ Logo exists
  { name: 'Grafana', logo: '/logos/Grafana_Logo.png', icon: null, color: 'text-orange-600', bg: 'bg-white' }, // ✓ Logo exists
  { name: 'MS Teams', logo: '/logos/MS_Team_Logo.png', icon: null, color: 'text-blue-600', bg: 'bg-white' }, // ✓ Logo exists
  { name: 'AWS', logo: '/logos/aws-logo.png', icon: null, color: 'text-orange-600', bg: 'bg-white' }, // ✓ Logo exists
  { name: 'AWS CloudWatch', logo: '/logos/cloudwatch.png', icon: null, color: 'text-orange-600', bg: 'bg-white' }, // ✓ Logo exists
  { name: 'Datadog', logo: '/logos/datadog-logo.svg', icon: null, color: 'text-purple-600', bg: 'bg-white' }, // ✓ Logo exists
  { name: 'Alertmanager', logo: null, icon: Bell, color: 'text-orange-600', bg: 'bg-white' }, // Uses icon fallback (logo file doesn't exist)
  { name: 'AWS ECS', logo: '/logos/ecs-logo.png', icon: null, color: 'text-purple-600', bg: 'bg-white' }, // ✓ Logo exists
  { name: 'Jenkins', logo: '/logos/jenkins-logo.png', icon: Settings, color: 'text-red-600', bg: 'bg-white' }, // ✓ Logo exists
  { name: 'Kubernetes', logo: '/logos/kubernetes-logo.png', icon: null, color: 'text-blue-600', bg: 'bg-white' }, // ✓ Logo exists
  { name: 'Opsgenie', logo: '/logos/opsgenie-logo.png', icon: AlertCircle, color: 'text-orange-600', bg: 'bg-white' }, // ✓ Logo exists
  { name: 'Azure', logo: '/logos/azure-logo.png', icon: null, color: 'text-blue-600', bg: 'bg-white' }, // ✓ Logo exists
  { name: 'Webhooks', logo: '/logos/webhook-logo.png', icon: Webhook, color: 'text-green-600', bg: 'bg-white' }, // ✓ Logo exists
  { name: 'VMs', logo: '/logos/vm-logo.png', icon: Server, color: 'text-green-600', bg: 'bg-white' }, // ⚠ Placeholder: Uses icon fallback
]

function IntegrationBadge({ integration }: { integration: any }) {
  const [imageError, setImageError] = useState(false)
  const Icon = integration.icon
  
  return (
    <div
      className={`flex flex-col items-center justify-center p-6 w-[160px] ${integration.bg} rounded-xl border border-white/20 hover:border-white/50 hover:shadow-lg transition-all group backdrop-blur-sm`}
    >
        {integration.logo && !imageError ? (
        <img 
          src={integration.logo} 
          alt={`${integration.name} logo`}
          className="h-12 w-auto object-contain opacity-90 group-hover:opacity-100 transition-opacity mb-2"
          onError={() => {
            // Silently handle image load errors - fallback to icon will be used
            setImageError(true);
          }}
          onLoad={() => {
            // Logo loaded successfully
          }}
        />
      ) : Icon ? (
        <Icon 
          className={`h-12 w-12 ${integration.color} opacity-80 group-hover:opacity-100 transition-opacity mb-2`}
        />
      ) : (
        <div className="w-16 h-16 rounded-lg bg-gray-200/50 flex items-center justify-center mb-2 border border-gray-300/50">
          <span className="text-xs font-bold text-gray-600">{integration.name.charAt(0)}</span>
        </div>
      )}
      <span className={`text-xs font-semibold text-gray-700 opacity-90 group-hover:opacity-100 transition-opacity text-center`}>
        {integration.name}
      </span>
    </div>
  )
}

export default function Integrations() {
  // Duplicate integrations for seamless loop
  const duplicatedIntegrations = [...integrations, ...integrations, ...integrations]

  return (
    <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden gradient-bg-purple">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-800/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-700/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <div className="inline-block px-5 py-2 bg-purple-800/50 backdrop-blur-sm text-purple-200 rounded-full text-sm font-bold mb-5 shadow-lg border border-purple-700/50">
            Integrations
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-purple-950 mb-4 leading-tight">
            Works with Your Stack
          </h2>
          <p className="text-purple-200 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            AlertMend AI comes with a wide range of integrations and powerful pre-built workflows to automate alert response, remediation, and cost optimization, helping your team get value fast.
          </p>
        </div>

        {/* Animated Scrolling Container */}
        <div className="relative overflow-hidden">
          <div className="flex animate-scroll-left gap-8">
            {duplicatedIntegrations.map((integration, index) => (
              <div key={index} className="flex-shrink-0">
                <IntegrationBadge integration={integration} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
