import { Link } from 'react-router-dom';
import styles from './Brand.module.css';

type Props = { withTag?: boolean };

export default function Brand({ withTag = false }: Props) {
  return (
    <Link to="/" className={styles.brand} aria-label="AlertMend home">
      <img
        src="/alertmend-full-logo.svg"
        alt="AlertMend"
        className={styles.fullLogo}
        width="160"
        height="40"
        loading="eager"
        decoding="async"
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
