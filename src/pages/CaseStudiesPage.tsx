import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Building2 } from 'lucide-react'
import { caseStudiesData, generateCaseStudySlug } from '../data/caseStudies'
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
                        navigate(`/case-studies/${generateCaseStudySlug(study.category, study.company)}`)
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
            <div
              className="relative overflow-hidden rounded-3xl border border-purple-200/70 px-8 py-14 md:px-16 md:py-20 text-center shadow-[0_24px_60px_-28px_rgba(76,29,149,0.32)]"
              style={{
                background:
                  'radial-gradient(ellipse 60% 80% at 0% 100%, rgba(126,34,206,0.18), transparent 70%), radial-gradient(ellipse 60% 80% at 100% 0%, rgba(192,38,211,0.14), transparent 70%), linear-gradient(180deg, #ffffff, #faf5ff)',
              }}
            >
              <span className="relative z-10 inline-flex items-center gap-2 rounded-full border border-purple-300/60 bg-white/70 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-purple-700 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-purple-600 to-fuchsia-500 shadow-[0_0_0_3px_rgba(126,34,206,0.12)]" />
                Get started
              </span>
              <h3
                className="relative z-10 mx-auto mt-5 max-w-3xl text-3xl md:text-5xl font-extrabold tracking-tight leading-[1.1]"
                style={{
                  background: 'linear-gradient(135deg, #3b0764 0%, #4f46e5 50%, #c026d3 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Ready to Transform Your Operations?
              </h3>
              <p className="relative z-10 mx-auto mt-5 mb-9 max-w-2xl text-base md:text-lg text-slate-600 leading-relaxed">
                Join teams using AlertMend AI to eliminate manual firefighting, cut costs, and achieve zero downtime.
              </p>
              <div className="relative z-10 flex flex-col sm:flex-row gap-3 justify-center items-center">
                <button
                  onClick={() => window.open('https://calendly.com/hello-alertmend/30min', '_blank')}
                  className="group inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-[15px] font-semibold !text-white transition-all hover:-translate-y-0.5"
                  style={{
                    background: 'linear-gradient(135deg, #6b21a8 0%, #4f46e5 50%, #c026d3 100%)',
                    boxShadow:
                      '0 14px 40px -10px rgba(126,34,206,0.55), inset 0 1px 0 rgba(255,255,255,0.25)',
                    color: '#ffffff',
                  }}
                >
                  <span className="text-white">Book a Demo</span>
                  <ArrowRight className="h-4 w-4 text-white transition-transform group-hover:translate-x-1" />
                </button>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-purple-300 bg-white px-7 py-3.5 text-[15px] font-semibold text-purple-800 shadow-[0_1px_2px_rgba(76,29,149,0.06)] transition-all hover:border-purple-500 hover:bg-purple-50"
                >
                  Talk to us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

