import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import Breadcrumb from '../components/Breadcrumb'
import { MessageSquare, Github, Slack } from 'lucide-react'
import { ensureUniqueMetaDescription } from '../utils/descriptionUtils'

export default function CommunityPage() {
  // Generate unique meta description for community page
  const baseDescription = "Join the AlertMend AI community! Connect with other users, share experiences, contribute to open-source integrations, and learn from the community on GitHub, Slack, and discussions."
  const uniqueDescription = ensureUniqueMetaDescription(baseDescription, 'community', 'community')
  const platforms = [
    {
      icon: Github,
      title: 'GitHub',
      description: 'Contribute to open-source integrations and report issues',
      link: '#',
    },
    {
      icon: Slack,
      title: 'Slack Community',
      description: 'Join our Slack workspace to connect with other users',
      link: '#',
    },
    {
      icon: MessageSquare,
      title: 'Discussions',
      description: 'Share best practices and get help from the community',
      link: '#',
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="AlertMend AI Community: Join Our Growing Ecosystem"
        description={uniqueDescription}
        keywords="AlertMend community, AIOps community, DevOps community, open source, GitHub, Slack community, infrastructure automation community"
        canonical="/community"
        breadcrumbData={{
          items: [{ label: 'Community' }]
        }}
      />
      <Navbar />
      <main className="pt-24">
        <section className="py-20 md:py-32 container-padding bg-gradient-to-b from-white via-primary-50/30 to-white">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <Breadcrumb items={[{ label: 'Community' }]} />
            </div>
            <div className="text-center mb-20">
              <div className="inline-block px-5 py-2 bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 rounded-full text-sm font-bold mb-6 shadow-lg">
                Community
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
                Join Our Community
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium">
                Connect with other AlertMend users, share experiences, and learn from the community.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {platforms.map((platform, index) => {
                const Icon = platform.icon
                return (
                  <div
                    key={index}
                    className="bg-white rounded-3xl p-10 border-2 border-gray-200 hover:border-primary-400 hover:shadow-2xl transition-all duration-300 text-center"
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-50 text-primary-600 mb-6">
                      <Icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-4">{platform.title}</h3>
                    <p className="text-gray-600 mb-6 font-medium">{platform.description}</p>
                    <a
                      href={platform.link}
                      className="text-primary-600 hover:text-primary-700 font-bold text-sm"
                    >
                      Join Now →
                    </a>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

