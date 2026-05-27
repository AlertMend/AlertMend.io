import { type ReactNode } from 'react';
import styles from './PageHeader.module.css';

export interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  trailing?: ReactNode;
}

export default function PageHeader({ eyebrow, title, description, trailing }: PageHeaderProps) {
  return (
    <div className={styles.header}>
      <div>
        {eyebrow && <div className={styles.eyebrow}>{eyebrow}</div>}
        <h1 className={styles.title}>{title}</h1>
        {description && <p className={styles.description}>{description}</p>}
      </div>
      {trailing && <div className={styles.trailing}>{trailing}</div>}
    </div>
  );
}
