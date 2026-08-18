import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../ui/Icon'
import styles from './AnnounceBar.module.css'

/**
 * Top announcement bar — a Datadog-signature element: a thin, full-width
 * vivid-gradient strip above the nav that promotes one headline item.
 * Datadog uses a purple→blue gradient; we translate the same treatment
 * into AlertMend's blue→cyan so it reads "Datadog-inspired" while staying
 * on-brand. Dismissible, and the choice is remembered for the session.
 */

const STORAGE_KEY = 'am-announce-dismissed-v1'

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
    <div className={styles.bar} role="region" aria-label="Announcement">
      <Link to="/observability" className={styles.inner}>
        <span className={styles.badge}>New</span>
        <span className={styles.text}>
          <b>eBPF auto-instrumentation</b> — zero-code distributed tracing across
          your fleet
        </span>
        <span className={styles.cta}>
          Explore observability
          <Icon name="arrow" size={13} className="arrow" strokeWidth={2.5} />
        </span>
      </Link>
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
