import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Brand from '../ui/Brand';
import Icon from '../ui/Icon';
import { useScrolled } from '../../hooks/useScrolled';
import styles from './Nav.module.css';

const sectionLinks = [
  { hash: '#features', label: 'Platform' },
  { hash: '#ai', label: 'AI RCAs' },
  { hash: '#mlops', label: 'MLOps' },
  { hash: '#integrations', label: 'Integrations' },
];

const routeLinks = [
  { to: '/blog', label: 'Blog' },
  { to: '/case-studies', label: 'Customers' },
];

export default function Nav() {
  const scrolled = useScrolled(8);
  const location = useLocation();
  const onHome = location.pathname === '/';
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Close the mobile drawer whenever the route or hash changes.
  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname, location.hash]);

  // Lock body scroll when the drawer is open.
  useEffect(() => {
    if (!drawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [drawerOpen]);

  // Close on Escape.
  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [drawerOpen]);

  // Whenever we land on / with a hash (either from a fresh route or from
  // clicking a same-page hash link), smooth-scroll to the target section.
  // Retry briefly because the section may not be mounted on first paint.
  useEffect(() => {
    if (!onHome || !location.hash) return;
    let raf = 0;
    let attempts = 0;
    const tryScroll = () => {
      const el = document.querySelector(location.hash);
      if (el) {
        const y = (el as HTMLElement).getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top: y, behavior: 'smooth' });
        return;
      }
      if (attempts++ < 30) raf = requestAnimationFrame(tryScroll);
    };
    raf = requestAnimationFrame(tryScroll);
    return () => cancelAnimationFrame(raf);
  }, [onHome, location.hash, location.key]);

  const isRouteActive = (to: string) =>
    location.pathname === to || location.pathname.startsWith(`${to}/`);

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
        <div className={`container ${styles.nav}`}>
          <Brand />

          <nav className={styles.links} aria-label="Primary">
            {sectionLinks.map((l) => (
              <Link
                key={l.hash}
                to={{ pathname: '/', hash: l.hash }}
                className={styles.link}
              >
                {l.label}
              </Link>
            ))}
            {routeLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`${styles.link} ${isRouteActive(l.to) ? styles.linkActive : ''}`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className={styles.cta}>
            <Link to="/contact" className={`btn btn-ghost ${styles.ctaGhost}`}>
              Talk to us
            </Link>
            <Link to="/contact" className={`btn btn-primary ${styles.ctaPrimary}`}>
              Book a demo
              <Icon name="arrow" size={14} className="arrow" strokeWidth={2.5} />
            </Link>
          </div>

          <button
            type="button"
            aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={drawerOpen}
            aria-controls="mobile-nav-drawer"
            className={`${styles.hamburger} ${drawerOpen ? styles.hamburgerOpen : ''}`}
            onClick={() => setDrawerOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* Mobile drawer + scrim */}
      <div
        className={`${styles.scrim} ${drawerOpen ? styles.scrimOpen : ''}`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden
      />
      <aside
        id="mobile-nav-drawer"
        className={`${styles.drawer} ${drawerOpen ? styles.drawerOpen : ''}`}
        aria-hidden={!drawerOpen}
      >
        <div className={styles.drawerHead}>
          <Brand />
          <button
            type="button"
            aria-label="Close menu"
            className={styles.drawerClose}
            onClick={() => setDrawerOpen(false)}
          >
            <Icon name="x" size={20} strokeWidth={2.2} />
          </button>
        </div>
        <nav className={styles.drawerLinks} aria-label="Mobile">
          {sectionLinks.map((l) => (
            <Link
              key={l.hash}
              to={{ pathname: '/', hash: l.hash }}
              onClick={() => setDrawerOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          {routeLinks.map((l) => (
            <Link key={l.to} to={l.to}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className={styles.drawerCta}>
          <Link to="/contact" className="btn btn-ghost">
            Talk to us
          </Link>
          <Link to="/contact" className="btn btn-primary">
            Book a demo
            <Icon name="arrow" size={14} className="arrow" strokeWidth={2.5} />
          </Link>
        </div>
      </aside>
    </>
  );
}
