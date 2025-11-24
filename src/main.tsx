import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, useLocation } from 'react-router-dom'
import { HelmetProvider } from './lib/helmet'
import App from './App.tsx'
import './index.css'
import { setupCanonicalObserver } from './utils/urlUtils'

// Component to track route changes
function PageTracker() {
  const location = useLocation()

  useEffect(() => {
    // React Helmet (via SEO component) handles canonical URLs
    // We don't need to verify/override them
  }, [location.pathname])

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

