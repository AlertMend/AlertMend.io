import { useEffect, useState } from 'react'
import Icon from '../ui/Icon'
import styles from './AnnounceBar.module.css'

/**
 * Top announcement bar — event strip promoting AlertMend at LEAP (Riyadh).
 * Dismissible; remembered for the session via STORAGE_KEY.
 */

const STORAGE_KEY = 'am-announce-dismissed-leap-2026-v5'
const CALENDLY_URL = 'https://calendly.com/hello-alertmend/30min'

export default function AnnounceBar() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === '1') setVisible(false)
    } catch {
      /* sessionStorage unavailable (private mode) — just show the bar */
    }
  }, [])

  useEffect(() => {
    document.body.classList.toggle('has-announce', visible)
    return () => document.body.classList.remove('has-announce')
  }, [visible])

  if (!visible) return null

  const dismiss = () => {
    setVisible(false)
    try {
      sessionStorage.setItem(STORAGE_KEY, '1')
    } catch {
      /* ignore */
    }
  }

  return (
    <div className={styles.bar} role="region" aria-label="LEAP announcement">
      <a
        href={CALENDLY_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.inner}
      >
        <img
          src="/logos/leap-5.png"
          alt="LEAP 5"
          className={styles.logo}
          width={120}
          height={62}
        />

        <span className={styles.copy}>
          <span className={styles.headline}>Meet us at LEAP 5</span>
          <span className={styles.meta}>
            <span className={styles.metaItem}>Riyadh</span>
            <span className={styles.dot} aria-hidden="true" />
            <span className={styles.metaItem}>Aug 31 – Sept 3</span>
          </span>
        </span>

        <span className={styles.booth}>
          <span className={styles.boothLabel}>Booth</span>
          <span className={styles.boothNum}>H1A.P178</span>
        </span>

        <span className={styles.cta}>
          Book a meeting
          <Icon name="arrow" size={13} className="arrow" strokeWidth={2.5} />
        </span>
      </a>

      <button
        type="button"
        className={styles.close}
        aria-label="Dismiss announcement"
        onClick={dismiss}
      >
        <Icon name="x" size={15} strokeWidth={2.4} />
      </button>
    </div>
  )
}
