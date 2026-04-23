import styles from './AmbientBackground.module.css';

export default function AmbientBackground() {
  return (
    <>
      <div className={styles.canvas} aria-hidden />
      <div className={`${styles.orb} ${styles.a}`} aria-hidden />
      <div className={`${styles.orb} ${styles.b}`} aria-hidden />
      <div className={`${styles.orb} ${styles.c}`} aria-hidden />
    </>
  );
}
