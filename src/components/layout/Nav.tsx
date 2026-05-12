import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Brand from '../ui/Brand';
import Icon from '../ui/Icon';
import { useScrolled } from '../../hooks/useScrolled';
import styles from './Nav.module.css';

// Industry-standard structure: ~5 top-level items. Deep section anchors
// ("AI RCAs", "MLOps") are reachable via the Platform link and by scrolling
// — keeping them at the top level made the bar feel busy.
const sectionLinks = [
  { hash: '#features', label: 'Platform' },
];

const routeLinks = [
  { to: '/pricing', label: 'Pricing' },
  { to: '/case-studies', label: 'Customers' },
  { to: '/documentation', label: 'Docs' },
  { to: '/blog', label: 'Blog' },
];

const SIGNUP_URL = 'https://app.alertmend.io/signup';
const PLAYGROUND_URL = 'https://app.alertmend.io/playground?source=homepage';
const CALENDLY_URL = 'https://calendly.com/hello-alertmend/30min';

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
            <a
              href={PLAYGROUND_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ctaPlayground}
            >
              <span className={styles.liveDot} aria-hidden />
              <span className={styles.liveLabel}>Live</span>
              <span className={styles.playgroundLabel}>Playground</span>
            </a>
            <a
              href={SIGNUP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.link} ${styles.ctaSignIn}`}
            >
              Sign in
            </a>
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`btn btn-primary ${styles.ctaPrimary}`}
            >
              Book a demo
              <Icon name="arrow" size={14} className="arrow" strokeWidth={2.5} />
            </a>
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
          <a
            href={PLAYGROUND_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
            onClick={() => setDrawerOpen(false)}
          >
            <Icon name="play" size={12} strokeWidth={1.8} />
            Playground
          </a>
          <a
            href={SIGNUP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
            onClick={() => setDrawerOpen(false)}
          >
            Sign in
          </a>
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            onClick={() => setDrawerOpen(false)}
          >
            Book a demo
            <Icon name="arrow" size={14} className="arrow" strokeWidth={2.5} />
          </a>
        </div>
      </aside>
    </>
  );
}
