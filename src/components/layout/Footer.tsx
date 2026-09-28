import { Link } from 'react-router-dom';
import Brand from '../ui/Brand';
import { HOME_PRODUCTS } from '../../data/homeProducts';
import styles from './Footer.module.css';

/* Same source of truth as the Platform nav menu, so the footer cannot drift
   from the actual product set.

   Tutorials / Webinars / Help / Community are listed here because they are
   routed, prerendered and in the sitemap, but had no inbound internal link
   anywhere on the site — crawlers could only reach them from sitemap.xml,
   which passes no link equity and reads as an orphaned page. */
const RESOURCES = [
  { to: '/documentation', label: 'Documentation' },
  { to: '/blog', label: 'Blog' },
  { to: '/case-studies', label: 'Case studies' },
  { to: '/tutorials', label: 'Tutorials' },
  { to: '/webinars', label: 'Webinars' },
  { to: '/help', label: 'Help center' },
  { to: '/community', label: 'Community' },
];

const COMPANY = [
  { to: '/about', label: 'About' },
  { to: '/industries', label: 'Industries' },
  { to: '/trust', label: 'Trust center' },
  { to: '/security', label: 'Security' },
  { to: '/compliance', label: 'Compliance' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/careers', label: 'Careers' },
  { to: '/partners', label: 'Partners' },
  { to: '/contact', label: 'Contact' },
];

const STANDARDS = ['Agent in your network', 'On-prem & air-gapped', 'Bring your own model', 'Full audit trail'];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.brandCol}>
            <Brand tone="light" />
            <p>
              Production health for platform and data teams. Observe infrastructure,
              turn data quality policy into live checks, and act with approval.
            </p>
            <div className={styles.backedBy}>
              <span className={styles.backedByLabel}>Backed by</span>
              <a
                href="https://www.antler.co/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.backedByLink}
                aria-label="Antler"
              >
                <img
                  src="/logos/antler-logo.png"
                  alt="Antler"
                  className={styles.backedByLogo}
                  loading="lazy"
                  decoding="async"
                  width={96}
                  height={28}
                />
              </a>
            </div>

            <div className={styles.compliance}>
              <div className={styles.complianceHead}>
                <span className={styles.complianceLabel}>Built for regulated teams</span>
                <Link to="/trust" className={styles.complianceNote}>
                  Trust center →
                </Link>
              </div>
              <div className={styles.complianceList}>
                {STANDARDS.map((name) => (
                  <span key={name} className={styles.complianceChip}>
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.col}>
            <h5>Infrastructure</h5>
            <ul>
              {HOME_PRODUCTS.filter((p) => p.group === 'infrastructure').map((p) => (
                <li key={p.id}>
                  <Link to={p.to}>{p.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.col}>
            <h5>Data</h5>
            <ul>
              {HOME_PRODUCTS.filter((p) => p.group === 'data').map((p) => (
                <li key={p.id}>
                  <Link to={p.to}>{p.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.col}>
            <h5>Resources</h5>
            <ul>
              {RESOURCES.map((l) => (
                <li key={l.to}>
                  <Link to={l.to}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.col}>
            <h5>Company</h5>
            <ul>
              {COMPANY.map((l) => (
                <li key={l.to}>
                  <Link to={l.to}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <div>© {new Date().getFullYear()} AlertMend. All rights reserved.</div>
          <div className={styles.legal}>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
