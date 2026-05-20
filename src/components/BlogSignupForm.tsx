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
        className="w-full px-4 py-2.5 rounded-md border border-zinc-300 bg-white text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 disabled:opacity-60 transition-colors"
      />
      <button
        type="submit"
        disabled={isSubmitting || !email}
        className="w-full bg-zinc-950 text-white font-semibold py-2.5 rounded-md hover:bg-zinc-900 transition-colors shadow-[0_1px_2px_rgba(9,9,11,0.16)] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Signing up…' : 'Sign up'}
      </button>
      {status === 'success' && (
        <p className="text-sm text-emerald-700 font-medium" role="status">
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
