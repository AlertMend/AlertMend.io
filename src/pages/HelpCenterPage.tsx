import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import Breadcrumb from '../components/Breadcrumb'
import { HelpCircle, Search, Book, MessageCircle } from 'lucide-react'
import { ensureUniqueMetaDescription } from '../utils/descriptionUtils'

export default function HelpCenterPage() {
  // Generate unique meta description for help center page
  const baseDescription = "Get help with AlertMend AI. Find answers to common questions, troubleshooting guides, installation instructions, and connect with our support team."
  const uniqueDescription = ensureUniqueMetaDescription(baseDescription, 'help', 'help')
  const categories = [
    {
      icon: Book,
      title: 'Getting Started',
      articles: ['Quick Start Guide', 'Installation', 'First Configuration', 'Connecting Your Infrastructure'],
    },
    {
      icon: HelpCircle,
      title: 'Troubleshooting',
      articles: ['Common Issues', 'Debugging Tips', 'Performance Optimization', 'Error Messages'],
    },
    {
      icon: MessageCircle,
      title: 'Support',
      articles: ['Contact Support', 'Submit a Ticket', 'Live Chat', 'Community Forum'],
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="AlertMend AI Help Center: Get Support & Documentation"
        description={uniqueDescription}
        keywords="AlertMend help, AlertMend support, troubleshooting, documentation, FAQ, customer support, AIOps help"
        canonical="/help"
        breadcrumbData={{
          items: [{ label: 'Help Center' }]
        }}
      />
      <Navbar />
      <main className="pt-24">
        <section className="py-20 md:py-32 container-padding bg-gradient-to-b from-white via-primary-50/30 to-white">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <Breadcrumb items={[{ label: 'Help Center' }]} />
            </div>
            <div className="text-center mb-20">
              <div className="inline-block px-5 py-2 bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 rounded-full text-sm font-bold mb-6 shadow-lg">
                Help Center
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
                How Can We Help?
              </h1>
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search for help articles..."
                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-primary-400 focus:outline-none text-lg"
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {categories.map((category, index) => {
                const Icon = category.icon
                return (
                  <div
                    key={index}
                    className="bg-white rounded-3xl p-8 border-2 border-gray-200 hover:border-primary-400 hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-50 text-primary-600 mb-6">
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-6">{category.title}</h3>
                    <ul className="space-y-3">
                      {category.articles.map((article, idx) => (
                        <li key={idx}>
                          <a
                            href="#"
                            className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-2"
                          >
                            {article}
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
      </main>
      <Footer />
    </div>
  )
}

