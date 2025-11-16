import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import Breadcrumb from '../components/Breadcrumb'
import { MapPin, Briefcase, ArrowRight } from 'lucide-react'
import { ensureUniqueMetaDescription } from '../utils/descriptionUtils'

export default function CareersPage() {
  const jobs = [
    {
      title: 'Senior DevOps Engineer',
      location: 'Singapore / Remote',
      type: 'Full-time',
      department: 'Engineering',
    },
    {
      title: 'AI/ML Engineer',
      location: 'Singapore / Remote',
      type: 'Full-time',
      department: 'Engineering',
    },
    {
      title: 'Product Manager',
      location: 'Singapore',
      type: 'Full-time',
      department: 'Product',
    },
    {
      title: 'Customer Success Manager',
      location: 'Remote',
      type: 'Full-time',
      department: 'Customer Success',
    },
  ]
  
  // Generate unique meta description for careers page
  const baseDescription = "Join the AlertMend AI team! We're hiring a Senior DevOps Engineer, AI/ML Engineer, and more. Apply now or submit your resume for future opportunities in 2025."
  const uniqueDescription = ensureUniqueMetaDescription(baseDescription, 'careers', 'careers')

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="AlertMend AI Careers: Join Our Team Today!"
        description={uniqueDescription}
        keywords="AlertMend careers, AIOps jobs, DevOps jobs, SRE jobs, infrastructure automation careers, tech jobs Singapore"
        canonical="/careers"
        breadcrumbData={{
          items: [{ label: 'Careers' }]
        }}
      />
      <Navbar />
      <section className="pt-24 pb-20 md:pb-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-br from-purple-50/30 via-white to-blue-50/30">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <Breadcrumb items={[{ label: 'Careers' }]} />
            </div>
            <div className="text-center mb-12 md:mb-16">
              <div className="inline-block px-5 py-2 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 rounded-full text-sm font-bold mb-8 shadow-md border border-purple-200/50">
                Careers
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-purple-950 mb-6 leading-tight">
                Join Our Team
              </h1>
              <p className="text-xl md:text-2xl text-purple-700 max-w-3xl mx-auto leading-relaxed mb-12">
                Help us build the future of autonomous infrastructure management. We're looking for talented individuals who share our passion for AIOps and reliability.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {jobs.map((job, index) => (
                <div
                  key={index}
                  className="bg-white rounded-3xl p-8 border-2 border-gray-200 hover:border-primary-400 hover:shadow-2xl transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-purple-950 mb-2">{job.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          <span>{job.type}</span>
                        </div>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-primary-50 text-primary-700 rounded-lg text-xs font-bold">
                      {job.department}
                    </div>
                  </div>
                  <a
                    href="#"
                    className="text-primary-600 hover:text-primary-700 font-bold text-sm flex items-center gap-2"
                  >
                    View Details
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              ))}
            </div>

            <div className="text-center bg-purple-50 rounded-3xl p-12 border-2 border-purple-200">
              <h2 className="text-3xl font-bold text-purple-950 mb-4">Don't see a role that fits?</h2>
              <p className="text-purple-700 mb-6 font-medium">
                We're always looking for talented people. Send us your resume and we'll keep you in mind for future opportunities.
              </p>
              <a
                href="mailto:careers@alertmend.io"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-800 to-purple-900 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-900 hover:to-purple-950 transition-all shadow-lg hover:shadow-xl"
              >
                Send Resume
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>
          </div>
        </section>
      <Footer />
    </div>
  )
}

