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
    const trackPageView = (retries = 20) => {
      if (typeof window !== 'undefined') {
        const pagePath = location.pathname + location.search
        const pageTitle = document.title
        const pageLocation = window.location.href

        // Check if gtag is available
        if (window.gtag) {
          // For GA4 SPA tracking, use config with page_path update
          // This is the recommended method for single-page applications
          window.gtag('config', 'G-Z8QSJ5NK95', {
            page_path: pagePath,
            page_title: pageTitle,
            page_location: pageLocation,
          })
        } else if (window.dataLayer) {
          // Fallback: push directly to dataLayer if gtag isn't available yet
          window.dataLayer.push({
            event: 'page_view',
            page_path: pagePath,
            page_title: pageTitle,
            page_location: pageLocation,
          })
        } else if (retries > 0) {
          // Retry after a short delay if neither is available
          setTimeout(() => trackPageView(retries - 1), 100)
        }
      }
    }

    // Wait a bit longer to ensure gtag script is fully loaded
    const timeoutId = setTimeout(() => trackPageView(), 300)

    return () => clearTimeout(timeoutId)
  }, [location.pathname, location.search])

  return null
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <PageTracker />
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
)

// Setup canonical URL observer after React loads
setupCanonicalObserver()

