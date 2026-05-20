import styles from './CustomerLogoStrip.module.css';

/** Raster/SVG assets in `/public/logos/` are copied from each company's official site;
 *  re-download if branding changes:
 *  - Decklar — footer SVG from decklar.com (wp-content uploads)
 *  - WareFlex — mark from wareflex.io (`WareflexLogo*.svg`)
 *  - Polymer — dark wordmark from polymersearch.com Webflow CDN (`logo (4).svg`,
 *    readable on light backgrounds)
 */
const customers = [
  {
    name: 'Decklar',
    subtitle: 'IoT logistics',
    logoSrc: '/logos/decklar-logo.svg',
  },
  {
    name: 'WareFlex',
    subtitle: 'Logistics infra',
    logoSrc: '/logos/wareflex-logo.svg',
  },
  {
    name: 'Polymer Search',
    subtitle: 'Search & data',
    logoSrc: '/logos/polymer-logo.svg',
  },
];

/** Renders as its own narrow <section> directly below the hero so the social
 *  proof gets visual weight independent of the hero copy. Sits in the page's
 *  white "room" between the hero and the cool-gray Pains band. */
export default function CustomerLogoStrip() {
  return (
    <section className={styles.section} aria-label="Companies using AlertMend">
      <div className="container">
        <p className={styles.label}>Trusted by teams running production at</p>
        <ul className={styles.list}>
          {customers.map((c) => (
            <li key={c.name} className={styles.item}>
              <img
                src={c.logoSrc}
                alt={c.name}
                className={styles.logoImg}
                loading="lazy"
                decoding="async"
              />
              <span className={styles.sub}>{c.subtitle}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
