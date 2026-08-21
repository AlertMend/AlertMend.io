import { Link } from 'react-router-dom';
import AlertMendLockup from './AlertMendLockup';
import styles from './Brand.module.css';

type Props = {
  withTag?: boolean
  /** `light` is for dark surfaces: recolors the mark to white so it clears
   *  contrast on the footer canvas, where the brand purple scores 1.8:1. */
  tone?: 'default' | 'light'
};

export default function Brand({ withTag = false, tone = 'default' }: Props) {
  return (
    <Link to="/" className={styles.brand} aria-label="AlertMend home">
      <AlertMendLockup
        className={`${styles.fullLogo} ${tone === 'light' ? styles.fullLogoLight : ''}`}
      />
      {withTag && (
        <span className={styles.tag}>
          AI-Powered Observability
          <br />
          &amp; Automation
        </span>
      )}
    </Link>
  );
}
