import { Link } from 'react-router-dom';
import styles from './Brand.module.css';

type Props = { withTag?: boolean };

export default function Brand({ withTag = false }: Props) {
  return (
    <Link to="/" className={styles.brand} aria-label="AlertMend home">
      <span className={styles.markChip} aria-hidden>
        <span className={styles.mark} role="img" aria-label="AlertMend logo" />
      </span>
      <span className={styles.word}>AlertMend</span>
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
