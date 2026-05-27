import styles from './StatusPill.module.css';

/* Color-coded pill used for severities, statuses, and outcomes across
 * the mock UI. The visual treatment matches the marketing site's pill
 * style: tinted soft background + solid accent text, no shadows. */
type Tone = 'violet' | 'green' | 'amber' | 'red' | 'neutral';

export interface StatusPillProps {
  tone?: Tone;
  children: React.ReactNode;
  dot?: boolean;
}

export default function StatusPill({ tone = 'neutral', children, dot }: StatusPillProps) {
  return (
    <span className={`${styles.pill} ${styles[tone]}`}>
      {dot && <span className={styles.dot} aria-hidden />}
      {children}
    </span>
  );
}
