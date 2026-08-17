import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, Search, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { DOCS_NAV } from '../../data/docsNav'
import styles from './DocsLayout.module.css'

type Props = {
  children: ReactNode
  title?: string
  /** Full-bleed landing without sidebar (docs home). */
  hub?: boolean
}

const SIGN_IN = 'https://app.alertmend.io/login'
const APP = 'https://app.alertmend.io'

export default function DocsLayout({ children, title, hub }: Props) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const isHub = hub || pathname === '/documentation'

  useEffect(() => {
    setOpen(false)
    setQuery('')
  }, [pathname])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
      if (e.key === '/' && !isEditableTarget(e.target)) {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return DOCS_NAV
    return DOCS_NAV.map((section) => ({
      ...section,
      items: section.items.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.href.toLowerCase().includes(q),
      ),
    })).filter((section) => section.items.length > 0)
  }, [query])

  const onSearchSubmit = (e: FormEvent) => {
    e.preventDefault()
    const first = filtered[0]?.items[0]
    if (first) navigate(first.href)
  }

  return (
    <div className={styles.shell}>
      <header className={styles.top}>
        <div className={styles.topLeft}>
          {!isHub ? (
            <button
              type="button"
              className={styles.menuBtn}
              aria-expanded={open}
              aria-controls="docs-sidebar"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={16} strokeWidth={1.8} /> : <Menu size={16} strokeWidth={1.8} />}
            </button>
          ) : null}
          <Link to="/" className={styles.brand} aria-label="AlertMend home">
            <img
              src="/logos/alertmend-logo.svg"
              alt=""
              className={styles.logo}
              width={22}
              height={22}
            />
            <span className={styles.brandName}>AlertMend</span>
          </Link>
          <span className={styles.brandSep} aria-hidden="true">
            /
          </span>
          <Link to="/documentation" className={styles.docsLabel}>
            Docs
          </Link>
        </div>

        <form
          className={`${styles.search} ${isHub ? styles.searchHubBar : ''}`}
          onSubmit={onSearchSubmit}
          role="search"
        >
          <Search size={14} strokeWidth={1.8} className={styles.searchIcon} aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search documentation"
            aria-label="Search documentation"
          />
          <kbd className={styles.kbd}>⌘K</kbd>
        </form>

        <div className={styles.topRight}>
          <Link to="/" className={styles.topLink}>
            Website
          </Link>
          <a href={SIGN_IN} className={styles.topLink}>
            Sign in
          </a>
          <a href={APP} className={styles.topCta}>
            Open app
          </a>
        </div>
      </header>

      {isHub ? (
        <div className={styles.hubMain}>{children}</div>
      ) : (
        <div className={styles.grid}>
          <aside
            id="docs-sidebar"
            className={`${styles.sidebar} ${open ? styles.sidebarOpen : ''}`}
          >
            {title ? <div className={styles.mobileTitle}>{title}</div> : null}
            <nav aria-label="Documentation">
              <Link
                to="/documentation"
                className={`${styles.link} ${pathname === '/documentation' ? styles.linkActive : ''}`}
                aria-current={pathname === '/documentation' ? 'page' : undefined}
              >
                Docs home
              </Link>
              {filtered.map((section) => (
                <div key={section.title} className={styles.section}>
                  <div className={styles.sectionTitle}>{section.title}</div>
                  <ul className={styles.list}>
                    {section.items.map((item) => {
                      const active = pathname === item.href
                      return (
                        <li key={item.href}>
                          <Link
                            to={item.href}
                            className={`${styles.link} ${active ? styles.linkActive : ''}`}
                            aria-current={active ? 'page' : undefined}
                          >
                            {item.title}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
              {query && filtered.length === 0 ? (
                <p className={styles.empty}>No matches for “{query}”</p>
              ) : null}
            </nav>
          </aside>

          {open ? (
            <button
              type="button"
              className={styles.backdrop}
              aria-label="Close documentation menu"
              onClick={() => setOpen(false)}
            />
          ) : null}

          <div className={styles.main}>{children}</div>
        </div>
      )}
    </div>
  )
}

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable
}
