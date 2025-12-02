import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, useLocation } from 'react-router-dom'
import { HelmetProvider } from './lib/helmet'
import App from './App.tsx'
import './index.css'
import { setupCanonicalObserver } from './utils/urlUtils'

// TypeScript declaration for Google Analytics gtag
declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date | 'page_view',
      config?: {
        page_path?: string
        page_title?: string
        page_location?: string
        [key: string]: any
      }
    ) => void
    dataLayer?: any[]
  }
}

// Component to track route changes for Google Analytics
function PageTracker() {
  const location = useLocation()

  useEffect(() => {
    // Wait for gtag to be available (async script loading)
    const trackPageView = (retries = 10) => {
      if (typeof window !== 'undefined') {
        // Check if gtag is available
        if (window.gtag) {
          // Use event method for better SPA tracking
          window.gtag('event', 'page_view', {
            page_path: location.pathname + location.search,
            page_title: document.title,
            page_location: window.location.href,
          })
        } else if (window.dataLayer) {
          // Fallback: push directly to dataLayer if gtag isn't available yet
          window.dataLayer.push({
            event: 'page_view',
            page_path: location.pathname + location.search,
            page_title: document.title,
            page_location: window.location.href,
          })
        } else if (retries > 0) {
          // Retry after a short delay if neither is available
          setTimeout(() => trackPageView(retries - 1), 100)
        }
      }
    }

    // Small delay to ensure page title is updated and scripts are loaded
    const timeoutId = setTimeout(() => trackPageView(), 100)

    return () => clearTimeout(timeoutId)
  }, [location.pathname, location.search])

  return null
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <PageTracker />
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
)

// Setup canonical URL observer after React loads
setupCanonicalObserver()

