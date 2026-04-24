import { useState } from 'react'

type Status = 'idle' | 'submitting' | 'success' | 'error'

export default function BlogSignupForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || status === 'submitting') return

    setStatus('submitting')
    setMessage('')

    try {
      const response = await fetch('https://api.alertmend.io/contact', {
        method: 'POST',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: 'Blog subscriber',
          company: '',
          email,
          message:
            'Newsletter signup from the AlertMend blog. Please add this email to the blog and product updates list.',
          source: 'blog_signup',
        }),
      })

      if (response.ok) {
        setStatus('success')
        setMessage("Thanks! You're on the list.")
        setEmail('')
        setTimeout(() => {
          setStatus('idle')
          setMessage('')
        }, 5000)
      } else {
        const data = await response.json().catch(() => ({} as Record<string, string>))
        setStatus('error')
        setMessage(data.error || data.message || 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setMessage('Network error. Please check your connection and try again.')
    }
  }

  const isSubmitting = status === 'submitting'

  return (
    <form className="space-y-3" onSubmit={handleSubmit} noValidate>
      <input
        type="email"
        required
        placeholder="Email*"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isSubmitting}
        aria-label="Email address"
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={isSubmitting || !email}
        className="w-full bg-gradient-to-r from-purple-800 to-purple-900 text-white font-semibold py-3 rounded-lg hover:from-purple-900 hover:to-purple-950 transition-all shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'SIGNING UP…' : 'SIGN UP'}
      </button>
      {status === 'success' && (
        <p className="text-sm text-green-700 font-medium" role="status">
          {message}
        </p>
      )}
      {status === 'error' && (
        <p className="text-sm text-red-600 font-medium" role="alert">
          {message}
        </p>
      )}
    </form>
  )
}
