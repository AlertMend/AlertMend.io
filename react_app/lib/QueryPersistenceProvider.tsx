'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function QueryPersistenceProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const originalPush = router.push
    const originalReplace = router.replace

    const getQuery = () => {
      const query = searchParams.toString()
      return query ? `?${query}` : ''
    }

    // Patch Next.js navigation
    router.push = (href: string, ...args: any[]) => {
      const finalHref =
        href.includes('?') || href.startsWith('http')
          ? href
          : `${href}${getQuery()}`
      // @ts-ignore
      return originalPush(finalHref, ...args)
    }

    router.replace = (href: string, ...args: any[]) => {
      const finalHref =
        href.includes('?') || href.startsWith('http')
          ? href
          : `${href}${getQuery()}`
      // @ts-ignore
      return originalReplace(finalHref, ...args)
    }

    // Handle plain <a> tags for SPA navigation
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const anchor = target.closest('a') as HTMLAnchorElement | null
      if (!anchor) return

      const href = anchor.getAttribute('href')
    //   if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:')) {
      if (!href || href.startsWith('#') || href.startsWith('mailto:')) {
        return
      }

      const finalHref = href.includes('?') ? href : `${href}${getQuery()}`

      // For new tab (`_blank`), just update the href (no SPA navigation)
      if (anchor.target === '_blank') {
        anchor.setAttribute('href', finalHref)
        return
      }

      // For same tab, prevent reload and use Next.js router
      e.preventDefault()
      router.push(finalHref)
    }

    document.addEventListener('click', handleAnchorClick)

    return () => {
      router.push = originalPush
      router.replace = originalReplace
      document.removeEventListener('click', handleAnchorClick)
    }
  }, [router, searchParams])

  return <>{children}</>
}
