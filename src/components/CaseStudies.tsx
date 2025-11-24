import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Building2 } from 'lucide-react'
import { caseStudiesData, generateCaseStudySlug } from '../data/caseStudies'

function CompanyLogo({ company, logo }: { company: string; logo?: string }) {
  const [imageError, setImageError] = useState(false)

  if (logo && !imageError) {
    return (
      <img 
        src={logo} 
        alt={`${company} logo`}
        className="h-12 w-auto object-contain mb-4"
        onError={() => setImageError(true)}
      />
    )
  }

  // Fallback to icon with company initial
  return (
    <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4 border border-purple-200">
      <Building2 className="h-6 w-6 text-purple-600" />
    </div>
  )
}

export default function CaseStudies() {
  const navigate = useNavigate()
  
  // Show only summary on homepage
  const summaryStudies = caseStudiesData.slice(0, 3)

  return (
    <section id="case-studies" className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden gradient-bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block px-5 py-2 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 rounded-full text-sm font-bold mb-5 shadow-lg">
            Case Studies
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-purple-950 mb-4">
            Real Results. Real Customers.
          </h2>
          <p className="text-lg md:text-xl text-purple-700 max-w-2xl mx-auto leading-relaxed">
            See how teams transformed their infrastructure operations with AlertMend AI
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 lg:gap-6 mb-10">
          {summaryStudies.map((study, index) => {
            const mainResult = study.results[0]
            const ResultIcon = mainResult?.icon || CheckCircle2
            return (
              <div
                key={index}
                className="group bg-white border-2 border-purple-200 rounded-3xl p-6 lg:p-8 hover:border-purple-400 hover:shadow-2xl transition-all duration-500 cursor-pointer relative overflow-hidden transform hover:-translate-y-2"
                onClick={() => navigate(`/case-studies/${generateCaseStudySlug(study.category, study.company)}`)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50/0 via-purple-100/0 to-purple-200/0 group-hover:from-purple-50/50 group-hover:via-purple-100/30 group-hover:to-purple-200/20 transition-all duration-500"></div>
                
                <div className="relative z-10">
                  <div className={`${study.categoryColor} px-4 py-1.5 rounded-full text-xs font-black mb-4 inline-block shadow-md`}>
                    {study.category}
                  </div>
                  <CompanyLogo company={study.company} logo={study.logo} />
                  <h3 className="text-lg font-bold text-purple-950 mb-2 group-hover:text-purple-900 transition-colors">{study.company}</h3>
                  <p className="text-purple-700 mb-5 line-clamp-3 leading-relaxed text-sm">{study.title}</p>
                  
                  <div className={`flex items-center gap-3 p-3 ${mainResult?.color ? mainResult.color.replace('text-', 'bg-').replace('-600', '-50') : 'bg-purple-50'} rounded-xl mb-5 border ${mainResult?.color ? mainResult.color.replace('text-', 'border-').replace('-600', '-100') : 'border-purple-100'}`}>
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
                    <span>Read case study</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        <div className="text-center">
          <button
            onClick={() => navigate('/case-studies')}
            className="group bg-gradient-to-r from-purple-700 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-800 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl inline-flex items-center space-x-2"
          >
            <span>View All Case Studies</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  )
}

