import { useState, useEffect } from 'react'

function getStoredTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  
  // Check localStorage
  const stored = localStorage.getItem('theme')
  if (stored === 'dark' || stored === 'light') {
    return stored
  }
  
  // Check system preference
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  
  return 'light'
}

export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    // Read from DOM first (set by inline script), then fallback to stored
    if (typeof window !== 'undefined') {
      const root = document.documentElement
      if (root.classList.contains('dark')) {
        return 'dark'
      }
      return getStoredTheme()
    }
    return 'light'
  })

  useEffect(() => {
    const root = document.documentElement
    
    // Remove both classes first
    root.classList.remove('dark', 'light')
    
    // Apply theme to DOM
    if (theme === 'dark') {
      root.classList.add('dark')
    }
    
    // Save to localStorage
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => {
      const newTheme = prev === 'light' ? 'dark' : 'light'
      // Update DOM immediately for instant feedback
      const root = document.documentElement
      root.classList.remove('dark', 'light')
      if (newTheme === 'dark') {
        root.classList.add('dark')
      }
      localStorage.setItem('theme', newTheme)
      return newTheme
    })
  }

  return { theme, toggleTheme }
}

