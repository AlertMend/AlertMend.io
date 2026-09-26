import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { trackHomeAudience } from '../utils/analytics'

/**
 * Homepage audience — which buyer the page is speaking to.
 *
 * The homepage serves two prospects with one URL: data teams (data quality /
 * data observability) and platform/SRE teams (infrastructure observability).
 * The hero toggle sets it; sales can preselect a side with a link:
 *
 *   https://alertmend.io/?for=data
 *   https://alertmend.io/?for=infra
 *
 * Prerender always renders DEFAULT_AUDIENCE; the URL param / session choice is
 * applied in an effect after hydration, so server and client markup match.
 */
export type Audience = 'data' | 'infra'

export const DEFAULT_AUDIENCE: Audience = 'data'

const STORAGE_KEY = 'am_home_audience'

const ALIASES: Record<string, Audience> = {
  data: 'data',
  'data-observability': 'data',
  dq: 'data',
  infra: 'infra',
  infrastructure: 'infra',
  platform: 'infra',
  sre: 'infra',
  devops: 'infra',
}

function parseAudience(value: string | null): Audience | null {
  if (!value) return null
  return ALIASES[value.trim().toLowerCase()] ?? null
}

type AudienceContextValue = {
  audience: Audience
  setAudience: (next: Audience) => void
}

const AudienceContext = createContext<AudienceContextValue>({
  audience: DEFAULT_AUDIENCE,
  setAudience: () => {},
})

export function AudienceProvider({ children }: { children: ReactNode }) {
  const [audience, setAudienceState] = useState<Audience>(DEFAULT_AUDIENCE)

  useEffect(() => {
    let initial: Audience | null = null
    let method: 'url' | 'session' = 'url'
    try {
      initial = parseAudience(new URLSearchParams(window.location.search).get('for'))
    } catch {
      /* ignore */
    }
    if (!initial) {
      method = 'session'
      try {
        initial = parseAudience(window.sessionStorage.getItem(STORAGE_KEY))
      } catch {
        /* storage blocked */
      }
    }
    if (initial) {
      setAudienceState(initial)
      trackHomeAudience(initial, method)
    } else {
      trackHomeAudience(DEFAULT_AUDIENCE, 'default')
    }
  }, [])

  const setAudience = useCallback((next: Audience) => {
    setAudienceState(next)
    trackHomeAudience(next, 'toggle')
    try {
      window.sessionStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* storage blocked */
    }
    try {
      // Keep the URL shareable (?for=…) without adding a history entry.
      const url = new URL(window.location.href)
      url.searchParams.set('for', next)
      window.history.replaceState(window.history.state, '', url.toString())
    } catch {
      /* ignore */
    }
  }, [])

  return (
    <AudienceContext.Provider value={{ audience, setAudience }}>
      {children}
    </AudienceContext.Provider>
  )
}

export function useAudience(): AudienceContextValue {
  return useContext(AudienceContext)
}
