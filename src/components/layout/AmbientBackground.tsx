import styles from './AmbientBackground.module.css';

/**
 * CSS-only ambient background.
 *
 * Renders four fixed, pointer-event-disabled layers behind the page:
 *   1. a faint grid (zinc on white) that fades past the fold via a
 *      vertical mask — no animation, no network calls;
 *   2-4. three corner radial violet washes (top-left, top-right,
 *      bottom-center) that anchor the brand color without flooding
 *      the page with purple.
 *
 * No images, no SVG fetches, no JS animation loops. Everything is a
 * single CSS gradient stack, so the layer is essentially free to render
 * and survives the SSR prerender step unchanged.
 */
export default function AmbientBackground() {
  return (
    <>
      <div className={styles.grid} aria-hidden />
      <div className={`${styles.wash} ${styles.washA}`} aria-hidden />
      <div className={`${styles.wash} ${styles.washB}`} aria-hidden />
      <div className={`${styles.wash} ${styles.washC}`} aria-hidden />
    </>
  );
}
