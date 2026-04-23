import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
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

  // Smooth-scroll in-page hash links when already on home.
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!onHome) return;
      const target = e.target as HTMLElement;
      const a = target.closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const id = a.getAttribute('href');
      if (!id || id.length <= 1) return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      const y = (el as HTMLElement).getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: y, behavior: 'smooth' });
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [onHome]);

  // After navigating to home with a hash, smooth-scroll to the section.
  useEffect(() => {
    if (!onHome || !location.hash) return;
    const el = document.querySelector(location.hash);
    if (!el) return;
    const y = (el as HTMLElement).getBoundingClientRect().top + window.scrollY - 70;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }, [onHome, location.hash]);

  const handleSectionClick = (hash: string) => (e: React.MouseEvent) => {
    if (onHome) return; // Anchor scroll handled above
    e.preventDefault();
    navigate(`/${hash}`);
  };

  const isRouteActive = (to: string) =>
    location.pathname === to || location.pathname.startsWith(`${to}/`);

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
        <div className={`container ${styles.nav}`}>
          <Brand />

          <nav className={styles.links} aria-label="Primary">
            {sectionLinks.map((l) => (
              <a
                key={l.hash}
                href={onHome ? l.hash : `/${l.hash}`}
                onClick={handleSectionClick(l.hash)}
                className={styles.link}
              >
                {l.label}
              </a>
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
            <a
              key={l.hash}
              href={onHome ? l.hash : `/${l.hash}`}
              onClick={(e) => {
                handleSectionClick(l.hash)(e);
                setDrawerOpen(false);
              }}
            >
              {l.label}
            </a>
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
