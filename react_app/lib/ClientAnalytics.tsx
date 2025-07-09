'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

const GA_TRACKING_ID = 'G-Z8QSJ5NK95'

export function ClientAnalytics() {
  const pathname = usePathname()
  const startTimeRef = useRef<number>(Date.now())
  const scrollDepthRef = useRef<number>(0)

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
    })

    startTimeRef.current = Date.now()
    scrollDepthRef.current = 0

    return () => {
      sendTimeSpent()
    }
  }, [pathname])

  // Track clicks
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const tag = target.tagName
      const text = target.innerText?.trim().slice(0, 100) || '[no text]'

      window.gtag?.('event', 'click', {
        event_category: 'UI Interaction',
        event_label: `${tag}: ${text}`,
        page_path: pathname,
      })
    }

    document.addEventListener('click', handleClick)
    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [pathname])

  // Track scroll depth
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrolled = (scrollTop / docHeight) * 100

      const thresholds = [25, 50, 75, 100]

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
}
