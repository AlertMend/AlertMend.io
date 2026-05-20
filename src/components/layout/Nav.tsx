import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Brand from '../ui/Brand';
import Icon from '../ui/Icon';
import { useScrolled } from '../../hooks/useScrolled';
import styles from './Nav.module.css';

/* ============================================================
   Navigation — industry-standard 5 primary links

   Most SaaS navs (Linear, Vercel, Datadog, Sentry) settle on
   ~5 primary links so the eye can scan the bar in one glance.
   We collapse the old 4-section + 3-route split into a clean
   5-link primary group: Platform → AI RCAs → Integrations →
   Pricing → Customers → Blog (Customers points at the case
   studies index).

   The right cluster is intentionally quiet: a small "Sign in"
   text link, a `● LIVE Playground` pill that signals the
   running product without competing for the primary CTA, and
   the single high-emphasis `Book a demo` button. The Playground
   pill is the only chip in the nav that uses violet, so the eye
   resolves "real product → live → click here", with the demo
   button still winning as the primary action.
   ============================================================ */
const primaryLinks: Array<
  | { kind: 'hash'; hash: string; label: string }
  | { kind: 'route'; to: string; label: string }
> = [
  { kind: 'hash', hash: '#features', label: 'Platform' },
  { kind: 'hash', hash: '#ai', label: 'AI RCAs' },
  { kind: 'hash', hash: '#integrations', label: 'Integrations' },
  { kind: 'route', to: '/pricing', label: 'Pricing' },
  { kind: 'route', to: '/case-studies', label: 'Customers' },
];

const SIGNUP_URL = 'https://app.alertmend.io/signup';
const PLAYGROUND_URL = 'https://app.alertmend.io/playground?source=homepage';
const CALENDLY_URL = 'https://calendly.com/hello-alertmend/30min';

export default function Nav() {
  const scrolled = useScrolled(8);
  const location = useLocation();
  const onHome = location.pathname === '/';
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!drawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [drawerOpen]);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [drawerOpen]);

  /* Smooth-scroll to anchors when landing on `/#section` (either from a
     fresh route or a same-page hash click). Retries briefly because the
     section may not be mounted on first paint. */
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

  const renderLink = (
    l: (typeof primaryLinks)[number],
    onClick?: () => void,
  ) =>
    l.kind === 'hash' ? (
      <Link
        key={l.hash}
        to={{ pathname: '/', hash: l.hash }}
        className={styles.link}
        onClick={onClick}
      >
        {l.label}
      </Link>
    ) : (
      <Link
        key={l.to}
        to={l.to}
        className={`${styles.link} ${isRouteActive(l.to) ? styles.linkActive : ''}`}
        onClick={onClick}
      >
        {l.label}
      </Link>
    );

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
        <div className={`container ${styles.nav}`}>
          <Brand />

          <nav className={styles.links} aria-label="Primary">
            {primaryLinks.map((l) => renderLink(l))}
          </nav>

          <div className={styles.cta}>
            {/* Quiet right cluster. Sign in + Playground sit at low
                emphasis so the primary "Book a demo" wins the eye. The
                Playground pill carries the only violet accent in the
                nav, signalling "running product" without competing
                with the demo CTA. */}
            <a
              href={SIGNUP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.link} ${styles.ctaSignIn}`}
            >
              Sign in
            </a>
            <a
              href={PLAYGROUND_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ctaPlayground}
              aria-label="Open the live playground"
            >
              <span className={styles.ctaPlaygroundDot} aria-hidden="true" />
              <span className={styles.ctaPlaygroundLive}>LIVE</span>
              <span>Playground</span>
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
          {primaryLinks.map((l) => renderLink(l, () => setDrawerOpen(false)))}
        </nav>
        <div className={styles.drawerCta}>
          <a
            href={PLAYGROUND_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaPlayground}
            onClick={() => setDrawerOpen(false)}
          >
            <span className={styles.ctaPlaygroundDot} aria-hidden="true" />
            <span className={styles.ctaPlaygroundLive}>LIVE</span>
            <span>Playground</span>
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
