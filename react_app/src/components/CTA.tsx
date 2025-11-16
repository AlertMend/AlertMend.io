import { ArrowRight, CheckCircle2 } from 'lucide-react'

interface CTAProps {
  solutionId?: string
}

export default function CTA({ solutionId = 'default' }: CTAProps) {
  // Solution-specific signup URLs
  const signupUrls: Record<string, string> = {
    'default': 'https://demo.alertmend.io/signup',
    'auto-remediation': 'https://demo.alertmend.io/signup',
    'kubernetes-management': 'https://demo.alertmend.io/signup',
    'on-call-management': 'https://demo.alertmend.io/signup?service=on-call',
    'kubernetes-cost-optimization': 'https://demo.alertmend.io/signup',
  }

  // Get signup URL for current solution or default
  const signupUrl = signupUrls[solutionId] || signupUrls['default']

  return (
    <section id="cta" className="py-20 md:py-24 px-4 sm:px-6 lg:px-8 text-purple-800 relative overflow-hidden gradient-bg-white">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-50/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-50/25 rounded-full blur-3xl animate-pulse animate-delay-1s"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-50/20 rounded-full blur-3xl animate-pulse animate-delay-2s"></div>
      </div>
      
      <div className="max-w-5xl mx-auto text-center relative z-10">
        <div className="inline-block px-5 py-2 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 rounded-full text-sm font-bold mb-5 shadow-md border border-purple-200/50">
          Get Started
        </div>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 leading-tight text-purple-950">
          Ready to Transform Your Infrastructure Operations?
        </h2>
        <p className="text-lg md:text-xl text-purple-700 mb-8 max-w-3xl mx-auto leading-relaxed">
          Join teams achieving up to 50% cost savings and zero downtime with autonomous AI operations across Kubernetes, VMs, and ECS.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <button 
            onClick={() => window.open('https://calendly.com/hello-alertmend/30min', '_blank')}
            className="group bg-gradient-to-r from-purple-800 to-purple-900 text-white px-10 py-4 rounded-xl font-semibold text-lg hover:from-purple-900 hover:to-purple-950 transition-all shadow-2xl hover:shadow-xl hover:scale-105 flex items-center justify-center space-x-2"
          >
            <span>Book a Demo</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button 
            onClick={() => window.open(signupUrl, '_blank')}
            className="border-2 border-purple-800 text-purple-900 px-10 py-4 rounded-xl font-semibold text-lg hover:bg-purple-50 hover:border-purple-900 transition-all"
          >
            Start Free Trial
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-8 text-base text-purple-700">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-5 w-5 text-purple-600" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-5 w-5 text-purple-600" />
            <span>Set up in minutes</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-5 w-5 text-purple-600" />
            <span>Cancel anytime</span>
          </div>
        </div>
      </div>
    </section>
  )
}

