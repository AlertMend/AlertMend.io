import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Quote, CheckCircle2, ArrowRight, Building2 } from 'lucide-react'
import { caseStudiesData } from '../data/caseStudies'
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
        className="h-20 w-auto object-contain mb-6"
        onError={() => setImageError(true)}
      />
    )
  }

  // Fallback to icon with company initial
  return (
    <div className="h-20 w-20 rounded-lg bg-purple-100 flex items-center justify-center mb-6 border border-purple-200">
      <Building2 className="h-10 w-10 text-purple-600" />
    </div>
  )
}

export default function CaseStudyDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [slug])

  // Find case study by slug (company name in lowercase)
  const study = caseStudiesData.find(
    (s) => s.company.toLowerCase().replace(/\s+/g, '-') === slug
  )

  if (!study) {
    return (
      <div className="min-h-screen">
        <SEO
          title="Case Study Not Found | AlertMend AI"
          description="The requested case study could not be found."
          noindex={true}
        />
        <Navbar />
        <div className="pt-24 pb-20 text-center relative overflow-hidden gradient-bg-white">
          <h1 className="text-3xl font-bold text-purple-900 mb-4">Case Study Not Found</h1>
          <button
            onClick={() => navigate('/case-studies')}
            className="text-purple-700 hover:text-purple-900"
          >
            Back to Case Studies
          </button>
        </div>
        <Footer />
      </div>
    )
  }

  const caseStudyUrl = `/case-studies/${study.company.toLowerCase().replace(/\s+/g, '-')}`
  
  // Generate unique meta description for case study detail page
  const baseDescription = `Learn how ${study.company} achieved ${study.results[0]?.metric || 'significant'} ${study.results[0]?.label || 'results'} using AlertMend AI. ${study.testimonial.quote.substring(0, 120)}...`
  const uniqueDescription = ensureUniqueMetaDescription(baseDescription, 'case-study', study.company.toLowerCase().replace(/\s+/g, '-'))

  return (
    <div className="min-h-screen">
      <SEO
        title={`${study.company} Case Study - ${study.title} | AlertMend AI`}
        description={uniqueDescription}
        keywords={`${study.company} case study, ${study.category.toLowerCase()}, AlertMend success story, ${study.industry?.toLowerCase() || ''}`}
        canonical={caseStudyUrl}
        ogType="article"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "CaseStudy",
          "name": `${study.company} - ${study.title}`,
          "description": study.testimonial.quote,
          "url": `https://www.alertmend.io${caseStudyUrl}`,
          "author": {
            "@type": "Organization",
            "name": "AlertMend AI"
          },
          "publisher": {
            "@type": "Organization",
            "name": "AlertMend AI",
            "logo": {
              "@type": "ImageObject",
              "url": "https://alertmend.io/logos/alertmend-logo.svg"
            }
          },
          "datePublished": new Date().toISOString(),
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://www.alertmend.io${caseStudyUrl}`
          }
        }}
        breadcrumbData={{
          items: [
            { label: 'Case Studies', path: '/case-studies' },
            { label: study.company }
          ]
        }}
      />
      <Navbar />
      <section className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden gradient-bg-white">
        <div className="max-w-5xl mx-auto">
          <Breadcrumb items={[
            { label: 'Case Studies', path: '/case-studies' },
            { label: study.company }
          ]} />

          {/* Hero Section */}
          <div className="mb-16">
            <div className={`${study.categoryColor} px-5 py-2 rounded-full text-sm font-bold mb-6 inline-block shadow-lg`}>
              {study.category}
            </div>
            <CompanyLogo company={study.company} logo={study.logo} />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-purple-900 mb-6 leading-tight">
              {study.company}
            </h1>
            <p className="text-xl md:text-2xl text-purple-700 leading-relaxed mb-6">
              {study.title}
            </p>
            
            {/* Customer Overview */}
            {(study.companySize || study.industry || study.region || study.infrastructure) && (
              <div className="bg-white rounded-2xl p-6 md:p-8 border border-purple-200 shadow-lg mb-8">
                <h3 className="text-lg font-bold text-purple-900 mb-4">Customer Overview</h3>
                <div className="grid sm:grid-cols-2 gap-4 text-purple-700">
                  {study.companySize && (
                    <div>
                      <span className="font-semibold">Company Size:</span> {study.companySize}
                    </div>
                  )}
                  {study.industry && (
                    <div>
                      <span className="font-semibold">Industry:</span> {study.industry}
                    </div>
                  )}
                  {study.region && (
                    <div>
                      <span className="font-semibold">Region:</span> {study.region}
                    </div>
                  )}
                  {study.infrastructure && (
                    <div>
                      <span className="font-semibold">Infrastructure:</span> {study.infrastructure}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Results Overview */}
          <div className="grid sm:grid-cols-3 gap-6 mb-16">
            {study.results.map((result, idx) => {
              const ResultIcon = result.icon
              return (
                <div
                  key={idx}
                  className="bg-white p-8 rounded-2xl border border-purple-200 shadow-lg hover:shadow-xl transition-all text-center"
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl ${result.color.replace('text-', 'bg-').replace('-600', '-50')} mb-4`}>
                    <ResultIcon className={`h-8 w-8 ${result.color}`} />
                  </div>
                  <div className={`text-4xl font-bold ${result.color} mb-2`}>
                    {result.metric}
                  </div>
                  <div className="text-sm text-purple-700 font-medium">{result.label}</div>
                </div>
              )
            })}
          </div>

          {/* Challenge Section */}
          <div className="bg-white rounded-2xl p-8 md:p-12 mb-8 border border-purple-200 shadow-lg">
            <h2 className="text-2xl md:text-3xl font-bold text-purple-900 mb-6 flex items-center space-x-3">
              <span className="w-3 h-3 bg-purple-700 rounded-full"></span>
              <span>The Challenge</span>
            </h2>
            <ul className="space-y-4">
              {study.challenge.map((item, idx) => (
                <li key={idx} className="flex items-start space-x-4 text-purple-700">
                  <span className="text-purple-500 mt-1 text-xl">•</span>
                  <span className="text-lg leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Solution Section */}
          <div className="bg-white rounded-2xl p-8 md:p-12 mb-8 border border-purple-200 shadow-lg">
            <h2 className="text-2xl md:text-3xl font-bold text-purple-900 mb-6 flex items-center space-x-3">
              <CheckCircle2 className="h-8 w-8 text-purple-700" />
              <span>Solution with AlertMend</span>
            </h2>
            <ul className="space-y-4 mb-8">
              {study.solution.map((item, idx) => (
                <li key={idx} className="flex items-start space-x-4 text-purple-700">
                  <CheckCircle2 className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
                  <span className="text-lg leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
            
            {/* Key Features Used */}
            {study.keyFeatures && study.keyFeatures.length > 0 && (
              <div className="mt-8 pt-8 border-t border-purple-200">
                <h3 className="text-xl md:text-2xl font-bold text-purple-900 mb-6">Key Features Used</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-purple-50">
                        <th className="border border-purple-200 px-4 py-3 text-left text-purple-900 font-bold">Feature</th>
                        <th className="border border-purple-200 px-4 py-3 text-left text-purple-900 font-bold">Purpose / Impact</th>
                      </tr>
                    </thead>
                    <tbody>
                      {study.keyFeatures.map((feature, idx) => (
                        <tr key={idx} className="hover:bg-purple-50/50">
                          <td className="border border-purple-200 px-4 py-3 text-purple-800 font-semibold">{feature.feature}</td>
                          <td className="border border-purple-200 px-4 py-3 text-purple-700">{feature.impact}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
          
          {/* Cost Breakdown (for WareFlex) */}
          {study.costBreakdown && (
            <div className="bg-white rounded-2xl p-8 md:p-12 mb-8 border border-purple-200 shadow-lg">
              <h2 className="text-2xl md:text-3xl font-bold text-purple-900 mb-6">Cost Breakdown</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-purple-50">
                      <th className="border border-purple-200 px-4 py-3 text-left text-purple-900 font-bold"></th>
                      <th className="border border-purple-200 px-4 py-3 text-center text-purple-900 font-bold">Before</th>
                      <th className="border border-purple-200 px-4 py-3 text-center text-purple-900 font-bold">After</th>
                      <th className="border border-purple-200 px-4 py-3 text-center text-purple-900 font-bold">% Saved</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-purple-50/50">
                      <td className="border border-purple-200 px-4 py-3 text-purple-800 font-semibold">Total Compute Cost</td>
                      <td className="border border-purple-200 px-4 py-3 text-center text-purple-700">{study.costBreakdown.before.compute}</td>
                      <td className="border border-purple-200 px-4 py-3 text-center text-green-600 font-semibold">{study.costBreakdown.after.compute}</td>
                      <td className="border border-purple-200 px-4 py-3 text-center text-green-600 font-bold">41.27%</td>
                    </tr>
                    <tr className="hover:bg-purple-50/50">
                      <td className="border border-purple-200 px-4 py-3 text-purple-800 font-semibold">Total Storage Cost</td>
                      <td className="border border-purple-200 px-4 py-3 text-center text-purple-700">{study.costBreakdown.before.storage}</td>
                      <td className="border border-purple-200 px-4 py-3 text-center text-green-600 font-semibold">{study.costBreakdown.after.storage}</td>
                      <td className="border border-purple-200 px-4 py-3 text-center text-green-600 font-bold">93.71%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-6 text-purple-700 italic text-lg">
                AlertMend helped reduce compute costs by <strong className="text-green-600">41%</strong> and storage costs by <strong className="text-green-600">over 90%</strong>, enabling massive savings within just one week.
              </p>
            </div>
          )}
          
          {/* First Month Results (for Polymer Search) */}
          {study.firstMonthResults && study.firstMonthResults.length > 0 && (
            <div className="bg-gradient-to-br from-green-50 to-purple-50 rounded-2xl p-8 md:p-12 mb-8 border border-purple-200 shadow-lg">
              <h2 className="text-2xl md:text-3xl font-bold text-purple-900 mb-6">First Month Results</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {study.firstMonthResults.map((result, idx) => {
                  const ResultIcon = result.icon
                  return (
                    <div
                      key={idx}
                      className="bg-white p-6 rounded-xl border border-purple-200 shadow-md text-center"
                    >
                      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${result.color.replace('text-', 'bg-').replace('-600', '-50')} mb-3`}>
                        <ResultIcon className={`h-6 w-6 ${result.color}`} />
                      </div>
                      <div className={`text-3xl font-bold ${result.color} mb-2`}>
                        {result.metric}
                      </div>
                      <div className="text-sm text-purple-700 font-medium">{result.label}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Testimonial */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl p-8 md:p-12 mb-12 border border-purple-200 shadow-lg">
            <Quote className="h-10 w-10 text-purple-700 mb-6" />
            <p className="text-xl md:text-2xl text-purple-900 italic mb-8 leading-relaxed font-medium">
              "{study.testimonial.quote}"
            </p>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-purple-700 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {study.testimonial.author.charAt(0)}
              </div>
              <div>
                <div className="font-bold text-purple-900 text-lg">{study.testimonial.author}</div>
                <div className="text-purple-700">{study.testimonial.role}</div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-purple-700 to-purple-600 rounded-2xl p-8 md:p-12 text-white text-center shadow-xl">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Transform Your Operations?
            </h3>
            <p className="text-lg text-purple-100 mb-8 max-w-2xl mx-auto">
              Join teams using AlertMend AI to eliminate manual firefighting, cut costs, and achieve zero downtime
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.open('https://calendly.com/hello-alertmend/30min', '_blank')}
                className="bg-white text-purple-800 px-8 py-4 rounded-xl font-semibold hover:bg-purple-50 transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <span>Book a Demo</span>
                <ArrowRight className="h-5 w-5" />
              </button>
              <button 
                onClick={() => navigate('/case-studies')}
                className="border-2 border-white/40 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 hover:border-white/60 transition-all"
              >
                View All Case Studies
              </button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}

