import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import Breadcrumb from '../components/Breadcrumb'
import { Mail, MapPin, Phone, Send } from 'lucide-react'
import { ensureUniqueMetaDescription } from '../utils/descriptionUtils'
import { useState } from 'react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    full_name: '',
    company: '',
    email: '',
    message: '',
  })
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  
  // Generate unique meta description for contact page
  const baseDescription = "Contact AlertMend AI for AIOps. Automate infrastructure and achieve zero downtime with our platform. Get in touch today!"
  const uniqueDescription = ensureUniqueMetaDescription(baseDescription, 'contact', 'contact')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormStatus('submitting')
    setErrorMessage('')

    try {
      const response = await fetch('https://api-demo.alertmend.io/contact', {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: formData.full_name,
          company: formData.company,
          email: formData.email,
          message: formData.message,
        }),
      })

      if (response.ok) {
        setFormStatus('success')
        setFormData({ full_name: '', company: '', email: '', message: '' })
        // Reset success message after 5 seconds
        setTimeout(() => {
          setFormStatus('idle')
        }, 5000)
      } else {
        const data = await response.json().catch(() => ({}))
        setFormStatus('error')
        setErrorMessage(data.error || data.message || 'There was an error submitting the form. Please try again.')
      }
    } catch (error) {
      setFormStatus('error')
      setErrorMessage('Network error. Please check your connection and try again.')
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Contact AlertMend: Connect for Incident Management"
        description={uniqueDescription}
        keywords="Contact AlertMend, AlertMend support, book demo, AIOps consultation, infrastructure automation contact"
        canonical="/contact"
        breadcrumbData={{
          items: [{ label: 'Contact' }]
        }}
      />
      <Navbar />
      <section className="pt-24 pb-20 md:pb-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-br from-purple-50/30 via-white to-blue-50/30">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <Breadcrumb items={[{ label: 'Contact' }]} />
            </div>
            <div className="text-center mb-12 md:mb-16">
              <div className="inline-block px-5 py-2 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 rounded-full text-sm font-bold mb-8 shadow-md border border-purple-200/50">
                Contact Us
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-purple-950 mb-6 leading-tight">
                Get in Touch
              </h1>
              <p className="text-xl md:text-2xl text-purple-700 max-w-3xl mx-auto leading-relaxed mb-12">
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold text-purple-950 mb-8">Contact Information</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-50 text-purple-600">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-purple-950 mb-1">Email</h3>
                      <a href="mailto:hello@alertmend.io" className="text-purple-600 hover:text-purple-700 font-medium">
                        hello@alertmend.io
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-50 text-purple-600">
                      <Phone className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-purple-950 mb-1">Phone</h3>
                      <a href="tel:+6512345678" className="text-purple-600 hover:text-purple-700 font-medium">
                        +65 1234 5678
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-50 text-purple-600">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-purple-950 mb-1">Address</h3>
                      <p className="text-gray-600 font-medium">
                        32 Pekin Street, #05-01<br />
                        Singapore 048762
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <header className="mb-4">
                  <strong>Fill in your details</strong>
                </header>
                <form 
                  onSubmit={handleSubmit}
                  className="wpcf7-form init space-y-6"
                  id="contactId"
                >
                  <div>
                    <label htmlFor="full_name" className="block text-sm font-bold text-purple-950 mb-2">
                      Full Name:
                    </label>
                    <span className="wpcf7-form-control-wrap">
                      <input
                        type="text"
                        id="full_name"
                        name="full_name"
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none wpcf7-form-control"
                        required
                      />
                    </span>
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-sm font-bold text-purple-950 mb-2">
                      Company:
                    </label>
                    <span className="wpcf7-form-control-wrap">
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none wpcf7-form-control"
                        required
                      />
                    </span>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-bold text-purple-950 mb-2">
                      Your email:
                    </label>
                    <span className="wpcf7-form-control-wrap">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none wpcf7-form-control"
                        required
                      />
                    </span>
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-bold text-purple-950 mb-2">
                      Your message:
                    </label>
                    <span className="wpcf7-form-control-wrap">
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows={6}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none wpcf7-form-control wpcf7-textarea"
                        required
                      />
                    </span>
                  </div>
                  
                  {formStatus === 'success' && (
                    <div className="p-4 bg-green-50 border-2 border-green-200 rounded-xl text-green-800 font-medium">
                      Thank you! Your message has been sent successfully. We'll get back to you soon.
                    </div>
                  )}
                  
                  {formStatus === 'error' && (
                    <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-800 font-medium">
                      {errorMessage || 'There was an error sending your message. Please try again.'}
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    disabled={formStatus === 'submitting'}
                    className="wpcf7-form-control wpcf7-submit has-spinner w-full bg-gradient-to-r from-purple-800 to-purple-900 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-purple-900 hover:to-purple-950 transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {formStatus === 'submitting' ? 'Sending...' : 'Send'}
                    {formStatus !== 'submitting' && <Send className="h-5 w-5" />}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      <Footer />
    </div>
  )
}

