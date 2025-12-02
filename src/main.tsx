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
      targetId: string | Date,
      config?: {
        page_path?: string
        page_title?: string
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
    // Track pageview in Google Analytics when route changes
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'G-Z8QSJ5NK95', {
        page_path: location.pathname + location.search,
        page_title: document.title,
      })
    }
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

