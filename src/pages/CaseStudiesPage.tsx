import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Building2 } from 'lucide-react'
import { caseStudiesData, generateCaseStudySlug } from '../data/caseStudies'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import Breadcrumb from '../components/Breadcrumb'
import { ensureUniqueMetaDescription } from '../utils/descriptionUtils'

function CompanyLogo({ company, logo }: { company: string; logo?: string }) {
  const [imageError, setImageError] = useState(false)

  if (logo && !imageError) {
    return (
      <img 
        src={logo} 
        alt={`${company} logo`}
        className="h-16 w-auto object-contain mb-4"
        onError={() => setImageError(true)}
      />
    )
  }

  // Fallback to icon with company initial
  return (
    <div className="h-16 w-16 rounded-lg bg-purple-100 flex items-center justify-center mb-4 border border-purple-200">
      <Building2 className="h-8 w-8 text-purple-600" />
    </div>
  )
}

export default function CaseStudiesPage() {
  const navigate = useNavigate()

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])
  
  // Generate unique meta description for case studies page
  const baseDescription = "Discover how leading companies use AlertMend AI to reduce costs by 50%, achieve zero downtime, and eliminate manual firefighting. Read real case studies from Polymer Search, WareFlex, Decklar, and more."
  const uniqueDescription = ensureUniqueMetaDescription(baseDescription, 'case-studies', 'case-studies')

  return (
    <div className="min-h-screen">
      <SEO
        title="Case Studies - Real Customer Success Stories | AlertMend AI"
        description={uniqueDescription}
        keywords="AlertMend case studies, customer success stories, Kubernetes cost optimization, auto-remediation success, AIOps case studies, infrastructure automation success"
        canonical="/case-studies"
        breadcrumbData={{
          items: [{ label: 'Case Studies' }]
        }}
      />
      <Navbar />
      <section className="pt-24 pb-20 md:pb-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-br from-purple-50/30 via-white to-blue-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Breadcrumb items={[{ label: 'Case Studies' }]} />
          </div>
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-block px-5 py-2 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 rounded-full text-sm font-bold mb-8 shadow-md border border-purple-200/50">
              Case Studies
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-purple-950 mb-6 leading-tight">
              Real Results. Real Customers.
            </h1>
            <p className="text-xl md:text-2xl text-purple-700 max-w-3xl mx-auto leading-relaxed mb-12">
              See how teams transformed their infrastructure operations with AlertMend AI
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {caseStudiesData.map((study, index) => {
              const mainResult = study.results[0]
              const ResultIcon = mainResult?.icon || CheckCircle2
              return (
                <div
                  key={index}
                  className="group bg-white border-2 border-purple-200 rounded-2xl p-8 hover:border-purple-400 hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden"
                  onClick={() => navigate(`/case-studies/${generateCaseStudySlug(study.category, study.company)}`)}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-50/0 via-purple-100/0 to-purple-200/0 group-hover:from-purple-50/50 group-hover:via-purple-100/30 group-hover:to-purple-200/20 transition-all duration-500"></div>
                  
                  <div className="relative z-10">
                    <div className={`${study.categoryColor} px-5 py-2 rounded-full text-xs font-bold mb-6 inline-block shadow-md`}>
                      {study.category}
                    </div>
                    <CompanyLogo company={study.company} logo={study.logo} />
                    <h2 className="text-2xl font-bold text-purple-900 mb-3 group-hover:text-purple-800 transition-colors">
                      {study.company}
                    </h2>
                    <p className="text-purple-700 mb-6 line-clamp-3 leading-relaxed">
                      {study.title}
                    </p>
                    
                    <div className={`flex items-center gap-4 p-4 ${mainResult?.color ? mainResult.color.replace('text-', 'bg-').replace('-600', '-50') : 'bg-purple-50'} rounded-xl mb-6 border ${mainResult?.color ? mainResult.color.replace('text-', 'border-').replace('-600', '-100') : 'border-purple-100'}`}>
                      <ResultIcon className={`h-8 w-8 ${mainResult?.color || 'text-purple-700'}`} />
                      <div>
                        <div className={`text-2xl font-bold ${mainResult?.color || 'text-purple-700'}`}>
                          {mainResult?.metric}
                        </div>
                        <div className="text-xs text-purple-700 font-medium mt-1">{mainResult?.label}</div>
                      </div>
                    </div>

                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/case-studies/${study.company.toLowerCase().replace(/\s+/g, '-')}`)
                      }}
                      className="text-purple-700 font-semibold text-sm hover:text-purple-900 flex items-center space-x-2 group-hover:translate-x-1 transition-transform"
                    >
                      <span>Read full case study</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="text-center">
            <div className="bg-gradient-to-r from-purple-700 to-purple-600 rounded-2xl p-8 md:p-12 text-white shadow-xl">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Ready to Transform Your Operations?
              </h3>
              <p className="text-lg text-purple-100 mb-6 max-w-2xl mx-auto">
                Join teams using AlertMend AI to eliminate manual firefighting, cut costs, and achieve zero downtime
              </p>
              <button 
                onClick={() => window.open('https://calendly.com/hello-alertmend/30min', '_blank')}
                className="bg-white text-purple-800 px-8 py-4 rounded-xl font-semibold hover:bg-purple-50 transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 mx-auto"
              >
                <span>Book a Demo</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}

