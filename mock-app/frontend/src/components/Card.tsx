import { type ReactNode } from 'react';
import styles from './Card.module.css';

export interface CardProps {
  title?: ReactNode;
  subtitle?: ReactNode;
  /** Right-aligned slot in the header — usually a status pill or "LIVE" badge. */
  trailing?: ReactNode;
  children?: ReactNode;
  /** Drop the inner padding for full-bleed children (e.g. tables). */
  bare?: boolean;
}

export default function Card({ title, subtitle, trailing, children, bare }: CardProps) {
  return (
    <section className={styles.card}>
      {(title || trailing) && (
        <header className={styles.header}>
          <div className={styles.headTitle}>
            {title && <div className={styles.title}>{title}</div>}
            {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
          </div>
          {trailing && <div className={styles.trailing}>{trailing}</div>}
        </header>
      )}
      <div className={bare ? styles.bodyBare : styles.body}>{children}</div>
    </section>
  );
}
