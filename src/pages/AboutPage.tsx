import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import Breadcrumb from '../components/Breadcrumb'
import { Target, Users, Award, Zap, Linkedin } from 'lucide-react'
import { ensureUniqueMetaDescription } from '../utils/descriptionUtils'

export default function AboutPage() {
  const values = [
    {
      icon: Target,
      title: 'Mission',
      description: 'Empower teams to achieve zero-downtime operations through autonomous AI-driven infrastructure management.',
    },
    {
      icon: Users,
      title: 'Team',
      description: 'Built by SREs and DevOps engineers who understand the pain of on-call rotations and manual firefighting.',
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Committed to delivering the most reliable, intelligent, and user-friendly AIOps platform in the market.',
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'Continuously pushing the boundaries of what AI can do for infrastructure operations and reliability.',
    },
  ]
  
  // Generate unique meta description for about page
  const baseDescription = "Learn about AlertMend AI's mission to empower teams with autonomous AI-driven infrastructure management. Meet our founders and advisors who are revolutionizing AIOps."
  const uniqueDescription = ensureUniqueMetaDescription(baseDescription, 'about', 'about')

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Meet the AlertMend AI Team: Your AIOps Solution Experts"
        description={uniqueDescription}
        keywords="About AlertMend, AlertMend team, AIOps founders, infrastructure automation team, SRE team, DevOps experts"
        canonical="/about"
        breadcrumbData={{
          items: [{ label: 'About' }]
        }}
      />
      <Navbar />
      <section className="pt-24 pb-20 md:pb-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-br from-purple-50/30 via-white to-blue-50/30">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <Breadcrumb items={[{ label: 'About' }]} />
            </div>
            <div className="text-center mb-12 md:mb-16">
              <div className="inline-block px-5 py-2 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 rounded-full text-sm font-bold mb-8 shadow-md border border-purple-200/50">
                About Us
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-purple-950 mb-6 leading-tight">
                Building the Future of AIOps
              </h1>
              <p className="text-xl md:text-2xl text-purple-700 max-w-3xl mx-auto leading-relaxed mb-12">
                We're on a mission to eliminate manual infrastructure management and make autonomous operations a reality for every team.
              </p>
            </div>

            <div className="max-w-4xl mx-auto mb-20">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 md:p-10 lg:p-12 border border-purple-200/50 shadow-lg">
                <div className="space-y-8">
                  <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                    AlertMend AI was born from the frustration of endless on-call rotations, 3 AM incident responses, and the constant firefighting that comes with managing complex infrastructure across Kubernetes, VMs, and ECS.
                  </p>
                  <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                    Our team of experienced SREs and DevOps engineers set out to build an AI-powered platform that could not just monitor infrastructure, but truly understand it, predict issues, and automatically resolve them—all while learning and improving over time.
                  </p>
                  <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                    Today, AlertMend AI helps hundreds of teams achieve up to 99.97% uptime, reduce infrastructure costs by up to 50%, and eliminate up to 90% of manual operations work. We're just getting started.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mt-8">
              {values.map((value, index) => {
                const Icon = value.icon
                return (
                  <div
                    key={index}
                    className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border-2 border-purple-200/50 hover:border-purple-400 hover:shadow-xl transition-all duration-300 text-center relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-50/0 via-purple-100/0 to-purple-200/0 group-hover:from-purple-50/50 group-hover:via-purple-100/30 group-hover:to-purple-200/20 transition-all duration-500 rounded-2xl"></div>
                    
                    <div className="relative z-10">
                      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-md">
                        <Icon className="h-7 w-7" />
                      </div>
                      <h3 className="text-xl font-bold text-purple-900 mb-3 group-hover:text-purple-800 transition-colors">{value.title}</h3>
                      <p className="text-gray-700 leading-relaxed">{value.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Founders Section */}
        <section className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden gradient-bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <div className="inline-block px-5 py-2 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 rounded-full text-sm font-bold mb-8 shadow-md border border-purple-200/50">
                Who We Are
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-purple-950 mb-6 leading-tight">
                Meet the Founders
              </h2>
              <p className="text-lg md:text-xl text-purple-700 max-w-3xl mx-auto leading-relaxed">
                Built by experienced entrepreneurs and engineers who understand the challenges of modern infrastructure management
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto mt-8">
              {/* Founder 1 - Arvind Rajpurohit */}
              <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 lg:p-10 border-2 border-purple-200/50 hover:border-purple-400 hover:shadow-xl transition-all duration-300 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50/0 via-purple-100/0 to-purple-200/0 group-hover:from-purple-50/50 group-hover:via-purple-100/30 group-hover:to-purple-200/20 transition-all duration-500 rounded-2xl"></div>
                
                <div className="relative z-10">
                  {/* Avatar Image */}
                  <div className="w-28 h-28 mx-auto mb-6 rounded-full overflow-hidden border-4 border-purple-200 shadow-xl group-hover:scale-110 transition-transform duration-300">
                    <img
                      src="/logos/arvind.jpeg"
                      alt="Arvind Rajpurohit"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        const parent = target.parentElement
                        if (parent) {
                          parent.className = 'w-28 h-28 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-xl group-hover:scale-110 transition-transform duration-300'
                          parent.textContent = 'AR'
                        }
                      }}
                    />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-purple-950 mb-3 group-hover:text-purple-800 transition-colors">Arvind Rajpurohit</h3>
                  <p className="text-purple-600 font-semibold mb-6">Co-Founder & CEO</p>
                  
                  <p className="text-gray-700 leading-relaxed mb-8 text-left">
                    Arvind is a Kubestronaut and experienced DevOps engineer with over 15 years in infrastructure management. Previously DevOps Team Lead at Roambee and Customer Success Engineer at Shoreline.io (acquired by NVIDIA), he brings deep expertise in Kubernetes, automation, and building AI-driven platforms for infrastructure operations.
                  </p>
                  
                  <a
                    href="https://www.linkedin.com/in/arvind-rajpurohit-4a332523/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition-all shadow-md hover:shadow-lg hover:scale-105"
                  >
                    <Linkedin className="h-5 w-5" />
                    <span>Connect on LinkedIn</span>
                  </a>
                </div>
              </div>

              {/* Founder 2 - Dinesh Agrawal */}
              <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 lg:p-10 border-2 border-purple-200/50 hover:border-purple-400 hover:shadow-xl transition-all duration-300 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50/0 via-purple-100/0 to-purple-200/0 group-hover:from-purple-50/50 group-hover:via-purple-100/30 group-hover:to-purple-200/20 transition-all duration-500 rounded-2xl"></div>
                
                <div className="relative z-10">
                  {/* Avatar Image */}
                  <div className="w-28 h-28 mx-auto mb-6 rounded-full overflow-hidden border-4 border-purple-200 shadow-xl group-hover:scale-110 transition-transform duration-300">
                    <img
                      src="/logos/dinesh.jpeg"
                      alt="Dinesh Agrawal"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        const parent = target.parentElement
                        if (parent) {
                          parent.className = 'w-28 h-28 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-xl group-hover:scale-110 transition-transform duration-300'
                          parent.textContent = 'DA'
                        }
                      }}
                    />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-purple-950 mb-3 group-hover:text-purple-800 transition-colors">Dinesh Agrawal</h3>
                  <p className="text-purple-600 font-semibold mb-6">Co-Founder & CTO</p>
                  
                  <p className="text-gray-700 leading-relaxed mb-8 text-left">
                    Dinesh is a seasoned software engineer and entrepreneur with extensive experience building scalable systems. Previously Software Engineer at Polymer Search and Roambee, and Co-Founder of FutureApp e-schools, he combines technical expertise with entrepreneurial vision to drive AlertMend AI's mission of autonomous infrastructure management.
                  </p>
                  
                  <a
                    href="https://www.linkedin.com/in/dineshagrawal85/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition-all shadow-md hover:shadow-lg hover:scale-105"
                  >
                    <Linkedin className="h-5 w-5" />
                    <span>Connect on LinkedIn</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Advisors Section */}
        <section className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <div className="inline-block px-5 py-2 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 rounded-full text-sm font-bold mb-8 shadow-md border border-purple-200/50">
                Our Advisors
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-purple-950 mb-6 leading-tight">
                Trusted Advisors
              </h2>
              <p className="text-lg md:text-xl text-purple-700 max-w-3xl mx-auto leading-relaxed">
                Industry experts guiding our vision and strategy
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 lg:gap-10 max-w-6xl mx-auto mt-8">
              {/* Advisor 1 - Mike */}
              <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 border-2 border-purple-200/50 hover:border-purple-400 hover:shadow-xl transition-all duration-300 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50/0 via-purple-100/0 to-purple-200/0 group-hover:from-purple-50/50 group-hover:via-purple-100/30 group-hover:to-purple-200/20 transition-all duration-500 rounded-2xl"></div>
                
                <div className="relative z-10">
                  {/* Avatar Placeholder */}
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-xl group-hover:scale-110 transition-transform duration-300">
                    MJ
                  </div>
                  
                  <h3 className="text-xl font-bold text-purple-950 mb-3 group-hover:text-purple-800 transition-colors">Mike</h3>
                  <p className="text-purple-600 font-semibold mb-4">Advisor</p>
                  
                  <p className="text-gray-700 leading-relaxed text-sm mt-2">
                    Strategic advisor with extensive experience in technology and business development.
                  </p>
                </div>
              </div>

              {/* Advisor 2 - Erik */}
              <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 border-2 border-purple-200/50 hover:border-purple-400 hover:shadow-xl transition-all duration-300 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50/0 via-purple-100/0 to-purple-200/0 group-hover:from-purple-50/50 group-hover:via-purple-100/30 group-hover:to-purple-200/20 transition-all duration-500 rounded-2xl"></div>
                
                <div className="relative z-10">
                  {/* Avatar Placeholder */}
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-xl group-hover:scale-110 transition-transform duration-300">
                    EK
                  </div>
                  
                  <h3 className="text-xl font-bold text-purple-950 mb-3 group-hover:text-purple-800 transition-colors">Erik</h3>
                  <p className="text-purple-600 font-semibold mb-4">Mentor</p>
                  
                  <p className="text-gray-700 leading-relaxed text-sm mt-2">
                    Technology advisor with deep expertise in cloud infrastructure and DevOps practices.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      <Footer />
    </div>
  )
}

