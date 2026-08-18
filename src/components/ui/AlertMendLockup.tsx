import styles from './logoMask.module.css'

/**
 * Full lockup: icon, divider rule, and the AlertMend wordmark.
 *
 * Painted as a `currentColor` box behind a CSS mask rather than an <img>, so
 * the art follows `color` — the brand purple scores 1.8:1 on the dark footer,
 * where Brand passes `tone="light"`. See AlertMendIcon for the full rationale.
 *
 * Mask asset: public/logos/alertmend-lockup-mask.svg, generated from
 * public/alertmend-full-logo.svg by scripts/build-logo-assets.mjs.
 */
type Props = {
  className?: string
}

export default function AlertMendLockup({ className }: Props) {
  return (
    <span
      className={`${styles.mask} ${styles.lockup}${className ? ` ${className}` : ''}`}
      aria-hidden="true"
    />
  )
}
