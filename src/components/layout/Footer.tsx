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
  { to: '/security', label: 'Security' },
  { to: '/compliance', label: 'Compliance' },
];

const COMPANY = [
  { to: '/about', label: 'About' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/careers', label: 'Careers' },
  { to: '/partners', label: 'Partners' },
  { to: '/contact', label: 'Contact' },
];

const STANDARDS = ['SOC 2 Type II', 'ISO 27001', 'GDPR'];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.brandCol}>
            <Brand tone="light" />
            <p>
              Production operations across your entire cloud. Observe everything, find
              root cause, automate the fix.
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
                <span className={styles.complianceLabel}>Security &amp; compliance</span>
                <Link to="/compliance" className={styles.complianceNote}>
                  <span className={styles.complianceDot} aria-hidden />
                  In progress
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
            <h5>Platform</h5>
            <ul>
              {HOME_PRODUCTS.map((p) => (
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
          <div>© {new Date().getFullYear()} AlertMend AI. All rights reserved.</div>
          <div className={styles.legal}>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
