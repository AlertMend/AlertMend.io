import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, MapPin, CalendarDays, ShieldCheck } from 'lucide-react'
import SEO from '../components/SEO'
import { PageHero, Section } from '../components/enterprise/PageKit'
import styles from '../components/enterprise/Enterprise.module.css'
import kit from '../components/enterprise/PageKit.module.css'
import { ensureUniqueMetaDescription } from '../utils/descriptionUtils'
import { calendlyUrl } from '../lib/calendly'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    full_name: '',
    company: '',
    email: '',
    message: '',
  })
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const baseDescription =
    'Contact AlertMend about data observability, infrastructure observability, AI root cause analysis and automated fixes. Book a demo or send the team a message.'
  const uniqueDescription = ensureUniqueMetaDescription(baseDescription, 'contact', 'contact')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormStatus('submitting')
    setErrorMessage('')

    try {
      const response = await fetch('https://api.alertmend.io/contact', {
        method: 'POST',
        headers: {
          Accept: 'application/json, text/plain, */*',
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
        setTimeout(() => {
          setFormStatus('idle')
        }, 5000)
      } else {
        const data = await response.json().catch(() => ({}))
        setFormStatus('error')
        setErrorMessage(data.error || data.message || 'Your message could not be sent. Please try again.')
      }
    } catch (error) {
      setFormStatus('error')
      setErrorMessage('Network error. Please check your connection and try again.')
    }
  }

  const update =
    (key: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setFormData({ ...formData, [key]: e.target.value })

  return (
    <>
      <SEO
        title="Contact AlertMend: Demos, Support and Partnerships"
        description={uniqueDescription}
        keywords="Contact AlertMend, AlertMend support, book a demo, data observability demo, infrastructure observability demo"
        canonical="/contact"
        breadcrumbData={{ items: [{ label: 'Contact' }] }}
      />

      <PageHero
        eyebrow="Contact"
        title="Talk to the team that builds AlertMend."
        lede="Questions about data quality, infrastructure, security reviews or pricing. Send a message, or book 30 minutes and see the product on a live environment."
      />

      <Section>
        <div className={kit.split}>
          <div>
            <h2 className={styles.h2}>Other ways to reach us</h2>
            <ul className={kit.details}>
              <li>
                <CalendarDays className={kit.detailIcon} size={20} aria-hidden="true" />
                <div>
                  <p className={kit.detailLabel}>Book a demo</p>
                  <p className={kit.detailValue}>
                    <a href={calendlyUrl('contact-page')} target="_blank" rel="noopener noreferrer">
                      Pick a 30-minute slot
                    </a>
                  </p>
                </div>
              </li>
              <li>
                <Mail className={kit.detailIcon} size={20} aria-hidden="true" />
                <div>
                  <p className={kit.detailLabel}>Email</p>
                  <p className={kit.detailValue}>
                    <a href="mailto:hello@alertmend.io">hello@alertmend.io</a>
                  </p>
                </div>
              </li>
              <li>
                <ShieldCheck className={kit.detailIcon} size={20} aria-hidden="true" />
                <div>
                  <p className={kit.detailLabel}>Security reviews</p>
                  <p className={kit.detailValue}>
                    Start with the <Link to="/trust">trust center</Link>, or ask us for security documentation.
                  </p>
                </div>
              </li>
              <li>
                <MapPin className={kit.detailIcon} size={20} aria-hidden="true" />
                <div>
                  <p className={kit.detailLabel}>Office</p>
                  <p className={kit.detailValue}>
                    32 Pekin Street, #05-01
                    <br />
                    Singapore 048762
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className={kit.form} id="contactId" aria-label="Contact form">
            <div className={kit.formRow}>
              <div className={kit.field}>
                <label htmlFor="full_name" className={kit.label}>
                  Full name
                </label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  autoComplete="name"
                  value={formData.full_name}
                  onChange={update('full_name')}
                  className={kit.input}
                  required
                />
              </div>
              <div className={kit.field}>
                <label htmlFor="company" className={kit.label}>
                  Company
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  autoComplete="organization"
                  value={formData.company}
                  onChange={update('company')}
                  className={kit.input}
                  required
                />
              </div>
            </div>
            <div className={kit.field}>
              <label htmlFor="email" className={kit.label}>
                Work email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={update('email')}
                className={kit.input}
                required
              />
            </div>
            <div className={kit.field}>
              <label htmlFor="message" className={kit.label}>
                How can we help?
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={update('message')}
                rows={6}
                className={kit.input}
                required
              />
            </div>

            <div aria-live="polite">
              {formStatus === 'success' && (
                <p className={`${kit.notice} ${kit.noticeOk}`}>
                  Thank you. Your message has been sent and the team will reply by email.
                </p>
              )}
              {formStatus === 'error' && (
                <p className={`${kit.notice} ${kit.noticeErr}`}>
                  {errorMessage || 'Your message could not be sent. Please try again.'}
                </p>
              )}
            </div>

            <button type="submit" disabled={formStatus === 'submitting'} className={`${styles.btnPrimary} ${kit.submit}`}>
              {formStatus === 'submitting' ? 'Sending…' : 'Send message'}
            </button>
            <p className={kit.fine}>
              We use your details only to reply. See our <Link to="/privacy">privacy policy</Link>.
            </p>
          </form>
        </div>
      </Section>
    </>
  )
}
