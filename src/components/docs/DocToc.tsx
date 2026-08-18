import { useEffect, useState } from 'react'
import styles from './DocToc.module.css'

export type TocHeading = {
  id: string
  text: string
  level: 2 | 3
}

/** Distance from the viewport top at which a heading counts as "current". */
const ACTIVE_OFFSET = 96

/**
 * "On this page" rail for doc articles. Fills the right gutter next to the
 * 820px article column and highlights the section currently under the header.
 */
export default function DocToc({ headings }: { headings: TocHeading[] }) {
  const [active, setActive] = useState(headings[0]?.id ?? '')

  useEffect(() => {
    if (headings.length === 0) return

    let frame = 0
    const update = () => {
      frame = 0
      let current = headings[0].id
      for (const heading of headings) {
        const el = document.getElementById(heading.id)
        if (!el) continue
        if (el.getBoundingClientRect().top - ACTIVE_OFFSET > 0) break
        current = heading.id
      }
      setActive(current)
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [headings])

  if (headings.length < 2) return null

  return (
    <aside className={styles.toc}>
      <nav aria-labelledby="doc-toc-title">
        <p id="doc-toc-title" className={styles.title}>
          On this page
        </p>
        <ul className={styles.list}>
          {headings.map((heading) => (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                className={`${styles.link} ${heading.level === 3 ? styles.linkSub : ''} ${
                  active === heading.id ? styles.linkActive : ''
                }`}
                aria-current={active === heading.id ? 'true' : undefined}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
