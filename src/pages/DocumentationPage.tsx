import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import Breadcrumb from '../components/Breadcrumb'
import { Code, Zap, Settings, FileText, MessageSquare, Webhook, Server } from 'lucide-react'
import { ensureUniqueMetaDescription } from '../utils/descriptionUtils'

export default function DocumentationPage() {
  const docs = [
    {
      icon: Zap,
      title: 'Quick Start',
      description: 'Get up and running in minutes',
      links: [
        { name: 'Installation', url: '#' },
        { name: 'First Steps', url: '#' },
        { name: 'Configuration', url: '#' },
      ],
    },
    {
      icon: Settings,
      title: 'Kubernetes',
      description: 'Complete guide for K8s integration',
      links: [
        { name: 'Cluster Setup', url: '#' },
        { name: 'Pod Monitoring', url: '#' },
        { name: 'Auto-Remediation', url: '#' },
      ],
    },
    {
      icon: Server,
      title: 'Virtual Machines',
      description: 'VM monitoring and management',
      links: [
        { name: 'VM Discovery', url: '#' },
        { name: 'Resource Monitoring', url: '#' },
        { name: 'Auto-Scaling', url: '#' },
        { name: 'Pre-Defined Actions Using AlertMend VM', url: '/documentation/alertmend-vm-actions', external: false },
      ],
    },
    {
      icon: Settings,
      title: 'AWS ECS',
      description: 'ECS task and service management',
      links: [
        { name: 'ECS Integration', url: '#' },
        { name: 'Task Monitoring', url: '#' },
        { name: 'Service Optimization', url: '#' },
      ],
    },
    {
      icon: MessageSquare,
      title: 'Slack Integration',
      description: 'Configure Slack for approvals and notifications',
      links: [
        { name: 'How to configure a Slack App for approval', url: '/documentation/slack-app-approval', external: false },
        { name: 'How to Get a Slack Token and Channel ID', url: '/documentation/slack-token-channel', external: false },
        { name: 'How to Setup Slack channel for RCA', url: '/documentation/slack-rca-channel', external: false },
      ],
    },
    {
      icon: MessageSquare,
      title: 'Microsoft Teams Integration',
      description: 'Configure MS Teams for approvals and notifications',
      links: [
        { name: 'How to configure a MS Team for approval', url: '/documentation/ms-teams-approval', external: false },
        { name: 'How to configure a MS Team In RF', url: '/documentation/ms-teams-rf', external: false },
        { name: 'How to Create an Incoming Webhook URL in MS Teams', url: '/documentation/ms-teams-webhook', external: false },
      ],
    },
    {
      icon: Webhook,
      title: 'Integrations',
      description: 'Connect with monitoring and alerting tools',
      links: [
        { name: 'How to setup custom webhook with Datadog monitors', url: '/documentation/datadog-webhook', external: false },
      ],
    },
    {
      icon: Code,
      title: 'API Reference',
      description: 'Complete API documentation',
      links: [
        { name: 'Authentication', url: '#' },
        { name: 'Endpoints', url: '#' },
        { name: 'Webhooks', url: '#' },
      ],
    },
    {
      icon: FileText,
      title: 'Guides & Tutorials',
      description: 'Step-by-step tutorials',
      links: [
        { name: 'Best Practices', url: '#' },
        { name: 'Troubleshooting', url: '#' },
        { name: 'Advanced Config', url: '#' },
      ],
    },
  ]
  
  // Generate unique meta description for documentation page
  const baseDescription = "AlertMend AI documentation: Explore our AIOps platform documentation for Kubernetes, VMs, and ECS. Start reducing downtime and cutting costs today."
  const uniqueDescription = ensureUniqueMetaDescription(baseDescription, 'documentation', 'documentation')

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="AlertMend AI: Kubernetes, VMs, ECS Documentation (2025)"
        description={uniqueDescription}
        keywords="AlertMend documentation, AIOps documentation, Kubernetes monitoring guide, infrastructure automation docs, AlertMend setup"
        canonical="/documentation"
      />
      <Navbar />
      <section className="pt-24 pb-20 md:pb-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-br from-purple-50/30 via-white to-blue-50/30">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <Breadcrumb items={[{ label: 'Documentation' }]} />
            </div>
            <div className="text-center mb-12 md:mb-16">
              <div className="inline-block px-5 py-2 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 rounded-full text-sm font-bold mb-8 shadow-md border border-purple-200/50">
                Documentation
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-purple-950 mb-6 leading-tight">
                Complete Documentation
              </h1>
              <p className="text-xl md:text-2xl text-purple-700 max-w-3xl mx-auto leading-relaxed mb-12">
                Everything you need to integrate and use AlertMend across Kubernetes, VMs, and ECS.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {docs.map((doc, index) => {
                const Icon = doc.icon
                return (
                  <div
                    key={index}
                    className="bg-white rounded-3xl p-8 border-2 border-gray-200 hover:border-purple-400 hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 mb-6">
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="text-2xl font-bold text-purple-950 mb-3">{doc.title}</h3>
                    <p className="text-purple-700 mb-6 font-medium">{doc.description}</p>
                    <ul className="space-y-2">
                      {doc.links.map((link, idx) => (
                        <li key={idx}>
                          <a
                            href={link.url}
                            target={link.external ? '_blank' : undefined}
                            rel={link.external ? 'noopener noreferrer' : undefined}
                            className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center gap-2 group"
                          >
                            <span>{link.name}</span>
                            {link.external && (
                              <svg className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            )}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      <Footer />
    </div>
  )
}

