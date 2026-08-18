import type { ReactNode } from 'react'
import styles from './PlatformBoardStage.module.css'

type Props = {
  children: ReactNode
  /** Extra top margin before the board (homepage). */
  spaced?: boolean
  /** Product-hero split: tilt toward the copy and bleed past the column. */
  split?: boolean
  className?: string
}

export default function PlatformBoardStage({
  children,
  spaced = false,
  split = false,
  className,
}: Props) {
  return (
    <div
      className={[
        styles.stage,
        spaced ? styles.stageSpaced : styles.stageFlush,
        split ? styles.stageSplit : '',
        className ?? '',
      ].join(' ')}
    >
      <div className={styles.glow} aria-hidden />
      <div className={`${styles.stageInner} ${split ? styles.stageInnerSplit : ''}`}>
        {children}
      </div>
    </div>
  )
}
