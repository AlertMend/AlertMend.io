'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

const GA_TRACKING_ID = 'G-Z8QSJ5NK95'

export function ClientAnalytics() {
  const pathname = usePathname()
  const startTimeRef = useRef<number>(Date.now())
  const scrollDepthRef = useRef<number>(0)

  const searchParams = useSearchParams()

  

  // UTM PARAMS tracking (on initial load)
  useEffect(() => {
    const utmSource = searchParams.get('utm_source')
    const utmMedium = searchParams.get('utm_medium')
    const utmCampaign = searchParams.get('utm_campaign')
    const utmTerm = searchParams.get('utm_term')
    const utmContent = searchParams.get('utm_content')

    if (utmSource || utmMedium || utmCampaign) {
      window.gtag?.('event', 'utm_tracking', {
        event_category: 'Marketing',
        event_label: pathname,
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
        utm_term: utmTerm,
        utm_content: utmContent,
      })

      // Optional: set as user properties (helps in Explore reports)
      window.gtag?.('set', {
        user_properties: {
          utm_source: utmSource,
          utm_medium: utmMedium,
          utm_campaign: utmCampaign,
        },
      })
    }
  }, [])

  // Track page views and time spent
  useEffect(() => {
    const sendTimeSpent = () => {
      const duration = (Date.now() - startTimeRef.current) / 1000
      if (window.gtag) {
        window.gtag('event', 'time_on_page', {
          page_path: pathname,
          time_spent_seconds: duration,
        })
      }
    }

    // Fire on mount
    window.gtag?.('config', GA_TRACKING_ID, {
      page_path: pathname,
    },)

    startTimeRef.current = Date.now()
    scrollDepthRef.current = 0

    return () => {
      sendTimeSpent()
    }
  }, [pathname])

  // Track clicks
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const el = e.target as HTMLElement
      if (!el) return

      const tag = el.tagName
      const section = el.closest('[data-section]')?.getAttribute('data-section') || 'unknown'
      let label = '[unlabeled]'
      let type = 'unknown'

      const isClickable = !!el.closest('a, button, [role="button"], [onclick]')
      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)
      const isImage = tag === 'IMG'
      const isIframe = tag === 'IFRAME'
      const isEmbed = tag === 'EMBED'
      const isText = !isClickable && !isInput && !isImage && !isIframe && !isEmbed

      // 1. Clickable (button/link/etc.)
      if (isClickable) {
        const clickable = el.closest('a, button, [role="button"], [onclick]')!
        type = 'clickable'
        label = clickable.textContent?.trim().slice(0, 100) || '[no text]'
      }

      // 2. Input
      else if (isInput) {
        const input = el as HTMLInputElement
        type = 'input'
        label = input.name || input.placeholder || input.id || '[form field]'
      }

      // 3. Image
      else if (isImage) {
        const img = el as HTMLImageElement
        type = 'image'
        label = "Image "+(img.alt || img.src || '[image]')
      }

      // 4. Iframe / Embed
      else if (isIframe || isEmbed) {
        type = isIframe ? 'iframe' : 'embed'
        label = el.getAttribute('src') || '[embedded content]'
      }

      // 5. Text Element
      else if (isText) {
        const text = el.textContent?.trim()
        if (!text || text.length < 5) return // skip very short text
        type = 'text'
        label = text.slice(0, 100)
      }

      // Fire GA4 event
      window.gtag?.('event', 'click', {
        event_category: 'UI Interaction',
        event_label: label,
        element_type: `${type}`,
        tag,
        section,
        click_location: `PAGE - ${pathname}, SECTION - ${section},Label - ${tag}:${label}`,
        page_path: pathname,
      })
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [pathname])

  // Track scroll depth
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrolled = (scrollTop / docHeight) * 100

      const thresholds = [25, 50, 75, 100]
      console.log('scrolled')
      for (const threshold of thresholds) {
        if (scrolled >= threshold && scrollDepthRef.current < threshold) {
          scrollDepthRef.current = threshold
          window.gtag?.('event', 'scroll_depth', {
            event_category: 'Engagement',
            event_label: `Scrolled ${threshold}%`,
            value: threshold,
            page_path: pathname,
          })
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [pathname])

  return <></>
  <script nowprocket nitro-exclude type="text/javascript" id="sa-dynamic-optimization" data-uuid="457086dd-8bfb-46dd-a38d-2f4a6efd0e7e" src="data:text/javascript;base64,dmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoInNjcmlwdCIpO3NjcmlwdC5zZXRBdHRyaWJ1dGUoIm5vd3Byb2NrZXQiLCAiIik7c2NyaXB0LnNldEF0dHJpYnV0ZSgibml0cm8tZXhjbHVkZSIsICIiKTtzY3JpcHQuc3JjID0gImh0dHBzOi8vZGFzaGJvYXJkLnNlYXJjaGF0bGFzLmNvbS9zY3JpcHRzL2R5bmFtaWNfb3B0aW1pemF0aW9uLmpzIjtzY3JpcHQuZGF0YXNldC51dWlkID0gIjQ1NzA4NmRkLThiZmItNDZkZC1hMzhkLTJmNGE2ZWZkMGU3ZSI7c2NyaXB0LmlkID0gInNhLWR5bmFtaWMtb3B0aW1pemF0aW9uLWxvYWRlciI7ZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpOw=="></script>
}
