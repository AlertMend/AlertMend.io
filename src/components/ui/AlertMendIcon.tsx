import styles from './logoMask.module.css'

/**
 * Icon only, no wordmark.
 *
 * Painted as a `currentColor` box behind a CSS mask rather than an <img>, so
 * the art follows `color`: the mark is a single flat shape and the brand
 * purple it used to hardcode scored 1.8:1 on the dark surfaces it appears on.
 * Callers set `color` and the logo follows, which replaces the per-surface
 * `filter: brightness(0) invert(1)` hacks — without inlining ~20 KB of path
 * data into every page that renders it.
 *
 * Mask asset: public/logos/alertmend-mark-mask.svg, generated from
 * public/logos/alertmend-logo.svg by scripts/build-logo-assets.mjs.
 */
type Props = {
  className?: string
}

export default function AlertMendIcon({ className }: Props) {
  return (
    <span
      className={`${styles.mask} ${styles.mark}${className ? ` ${className}` : ''}`}
      aria-hidden="true"
    />
  )
}
