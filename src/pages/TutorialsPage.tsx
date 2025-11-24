import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import Breadcrumb from '../components/Breadcrumb'
import { PlayCircle, Clock, ArrowRight } from 'lucide-react'
import { ensureUniqueMetaDescription } from '../utils/descriptionUtils'

export default function TutorialsPage() {
  // Generate unique meta description for tutorials page
  const baseDescription = "Learn AlertMend AI with step-by-step tutorials. Master Kubernetes monitoring, VM auto-scaling, ECS optimization, and advanced auto-remediation workflows."
  const uniqueDescription = ensureUniqueMetaDescription(baseDescription, 'tutorials', 'tutorials')
  const tutorials = [
    {
      title: 'Getting Started with Kubernetes Monitoring',
      duration: '15 min',
      level: 'Beginner',
      platform: 'Kubernetes',
    },
    {
      title: 'Setting Up VM Auto-Scaling',
      duration: '20 min',
      level: 'Intermediate',
      platform: 'Virtual Machines',
    },
    {
      title: 'ECS Task Optimization Guide',
      duration: '25 min',
      level: 'Intermediate',
      platform: 'AWS ECS',
    },
    {
      title: 'Advanced Auto-Remediation Workflows',
      duration: '30 min',
      level: 'Advanced',
      platform: 'All Platforms',
    },
    {
      title: 'Cost Optimization Strategies',
      duration: '18 min',
      level: 'Intermediate',
      platform: 'All Platforms',
    },
    {
      title: 'Multi-Cloud Infrastructure Management',
      duration: '35 min',
      level: 'Advanced',
      platform: 'All Platforms',
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="AlertMend AI Tutorials: Step-by-Step Learning Guides"
        description={uniqueDescription}
        keywords="AlertMend tutorials, Kubernetes tutorials, AIOps tutorials, infrastructure automation tutorials, video tutorials, learning guides"
        canonical="/tutorials"
        breadcrumbData={{
          items: [{ label: 'Tutorials' }]
        }}
      />
      <Navbar />
      <main className="pt-24">
        <section className="py-20 md:py-32 container-padding bg-gradient-to-b from-white via-primary-50/30 to-white">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <Breadcrumb items={[{ label: 'Tutorials' }]} />
            </div>
            <div className="text-center mb-20">
              <div className="inline-block px-5 py-2 bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 rounded-full text-sm font-bold mb-6 shadow-lg">
                Tutorials
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
                Step-by-Step Tutorials
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium">
                Learn how to get the most out of AlertMend with our comprehensive video and written tutorials.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tutorials.map((tutorial, index) => (
                <div
                  key={index}
                  className="bg-white rounded-3xl p-8 border-2 border-gray-200 hover:border-primary-400 hover:shadow-2xl transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="px-3 py-1 bg-primary-50 text-primary-700 rounded-lg text-xs font-bold">
                      {tutorial.platform}
                    </div>
                    <div className="flex items-center gap-1 text-gray-500 text-sm">
                      <Clock className="h-4 w-4" />
                      <span>{tutorial.duration}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <PlayCircle className="h-6 w-6 text-primary-600" />
                    <h3 className="text-xl font-black text-gray-900">{tutorial.title}</h3>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 font-medium">{tutorial.level}</span>
                    <a
                      href="#"
                      className="text-primary-600 hover:text-primary-700 font-bold text-sm flex items-center gap-2"
                    >
                      Watch
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

