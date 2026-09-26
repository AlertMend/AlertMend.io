import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Brand from '../ui/Brand';
import Icon from '../ui/Icon';
import type { IconName } from '../ui/Icon';
import { useScrolled } from '../../hooks/useScrolled';
import { HOME_PRODUCTS, type HomeProductId } from '../../data/homeProducts';
import { SHOW_DATA_PRICING } from '../../data/flags';
import styles from './Nav.module.css';
import { calendlyUrl } from '../../lib/calendly';

/* ============================================================
   Navigation — Platform mega-menu + three flat links (Data, Pricing, Customers)

   Every product surface lives in the Platform panel, so the bar
   itself stays scannable in one glance: Platform → Pricing →
   Customers (Customers points at the case studies index).
   Observability and AI RCAs are deliberately NOT repeated here
   as top-level links; they already appear in the Platform panel
   as "Observability & APM" and "AI root cause" pointing at the
   same routes, and duplicating them split the same destination
   across two places in the bar.

   The right cluster has three levels of emphasis: a quiet
   "Sign in" text link, an outlined "Start free" button, and the
   single high-emphasis "Book a demo" button.
   ============================================================ */

const primaryLinks: Array<{ to: string; label: string }> = [
  /* Data buyers are a separate audience; give them a door in the bar itself
     rather than only inside the Platform panel. */
  { to: '/data-observability', label: 'Data governance' },
  { to: '/industries', label: 'Industries' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/case-studies', label: 'Customers' },
];

/** Neutral line icons only — no third-party brand marks in the nav. */
const PLATFORM_ICONS: Record<HomeProductId, IconName> = {
  k8s: 'cube',
  obs: 'activity',
  dataobs: 'database',
  logs: 'cmdline',
  rca: 'brain',
  fix: 'workflow',
  oncall: 'phone',
  finops: 'dollar',
  mlops: 'cpu',
};

/** Shorter titles where the full product name is too long for a menu row. */
const PLATFORM_TITLES: Partial<Record<HomeProductId, string>> = {
  k8s: 'Kubernetes',
  fix: 'Remediation & runbooks',
};

const PLATFORM_GROUPS: { label: string; ids: HomeProductId[] }[] = [
  { label: 'Observe', ids: ['k8s', 'obs', 'logs'] },
  { label: 'Respond', ids: ['rca', 'fix', 'oncall'] },
  { label: 'Operate', ids: ['finops', 'mlops'] },
  { label: 'Data', ids: ['dataobs'] },
];

const byId = Object.fromEntries(HOME_PRODUCTS.map((p) => [p.id, p])) as Record<
  HomeProductId,
  (typeof HOME_PRODUCTS)[number]
>;

const SIGNUP_URL = 'https://app.alertmend.io/signup';
/** Existing users: the app root (same link the docs' "Open app" uses). */
const APP_URL = 'https://app.alertmend.io';
const CALENDLY_URL = calendlyUrl('nav-book-demo');

export default function Nav() {
  const scrolled = useScrolled(8);
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [platformOpen, setPlatformOpen] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);
  const megaWrapRef = useRef<HTMLDivElement>(null);

  const openMega = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setPlatformOpen(true);
  };

  const closeMega = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setPlatformOpen(false), 120);
  };

  const closeMegaNow = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setPlatformOpen(false);
  };

  useEffect(
    () => () => {
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
    },
    [],
  );

  /* Dismissal for everyone who isn't holding a mouse. `onMouseLeave` never
     fires on touch, so without this the panel stays open until the route
     changes; and Escape bound to the trigger alone stops working the moment
     focus moves into the panel. All three listeners are document-level and
     only mounted while the panel is open. */
  useEffect(() => {
    if (!platformOpen) return;

    const onPointerDown = (e: PointerEvent) => {
      if (!megaWrapRef.current?.contains(e.target as Node)) closeMegaNow();
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      closeMegaNow();
      // Send focus back to the trigger so keyboard users aren't stranded on a
      // link that just became unreachable.
      megaWrapRef.current?.querySelector('button')?.focus();
    };

    const onFocusIn = (e: FocusEvent) => {
      if (!megaWrapRef.current?.contains(e.target as Node)) closeMegaNow();
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKey);
    document.addEventListener('focusin', onFocusIn);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('focusin', onFocusIn);
    };
  }, [platformOpen]);

  useEffect(() => {
    setDrawerOpen(false);
    setPlatformOpen(false);
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

  /* Hash deep-links (e.g. /#integrations) are handled in App ScrollToTop. */

  const isRouteActive = (to: string) =>
    location.pathname === to || location.pathname.startsWith(`${to}/`);

  const renderLink = (
    l: (typeof primaryLinks)[number],
    onClick?: () => void,
  ) => (
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
            <div
              ref={megaWrapRef}
              className={styles.megaWrap}
              onMouseEnter={openMega}
              onMouseLeave={closeMega}
            >
              <button
                type="button"
                className={`${styles.link} ${styles.megaTrigger} ${platformOpen ? styles.megaTriggerOpen : ''}`}
                aria-expanded={platformOpen}
                aria-controls="platform-menu"
                onClick={() => (platformOpen ? closeMegaNow() : openMega())}
              >
                Platform
                <svg
                  className={styles.megaCaret}
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  aria-hidden="true"
                >
                  <path d="M2 3.5 5 6.5 8 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {/* Deliberately not role="menu"/"menuitem": those roles promise
                  arrow-key traversal and a roving tabindex that this panel
                  does not implement. It is a labelled group of ordinary links,
                  so plain nav semantics describe it accurately and Tab works
                  the way users expect. */}
              <div
                id="platform-menu"
                className={`${styles.megaPanel} ${platformOpen ? styles.megaOpen : ''}`}
                aria-label="Platform"
                onMouseEnter={openMega}
                onMouseLeave={closeMega}
              >
                <div className={styles.megaGrid}>
                  <div className={styles.megaProducts}>
                    {PLATFORM_GROUPS.map((group) => (
                      <div
                        key={group.label}
                        className={`${styles.megaCol} ${group.label === 'Data' ? styles.megaColData : ''}`}
                      >
                        <span className={styles.megaColLabel}>{group.label}</span>
                        {group.ids.map((id) => {
                          const p = byId[id]
                          return (
                            <Link
                              key={id}
                              to={p.to}
                              className={styles.megaItem}
                              onClick={() => setPlatformOpen(false)}
                            >
                              <span className={styles.megaItemIco} aria-hidden>
                                <Icon
                                  name={PLATFORM_ICONS[id]}
                                  size={15}
                                  strokeWidth={1.6}
                                />
                              </span>
                              <span className={styles.megaItemText}>
                                <span className={styles.megaItemTitle}>
                                  {PLATFORM_TITLES[id] ?? p.name}
                                </span>
                                <span className={styles.megaItemDesc}>{p.blurb}</span>
                              </span>
                            </Link>
                          )
                        })}
                        {group.label === 'Data' ? (
                          <div className={styles.megaDataLinks}>
                            <Link
                              to="/data-observability#policy"
                              className={styles.megaDataLink}
                              onClick={() => setPlatformOpen(false)}
                            >
                              Policy to checks
                            </Link>
                            {SHOW_DATA_PRICING ? (
                              <Link
                                to="/pricing#data"
                                className={styles.megaDataLink}
                                onClick={() => setPlatformOpen(false)}
                              >
                                Data pricing
                              </Link>
                            ) : null}
                            <a
                              href={CALENDLY_URL}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.megaDataLink}
                              onClick={() => setPlatformOpen(false)}
                            >
                              Book the data demo
                            </a>
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                  <Link
                    to="/data-observability"
                    className={styles.megaFeatured}
                    onClick={() => setPlatformOpen(false)}
                  >
                    <span className={styles.megaFeaturedTag}>Featured</span>
                    <span className={styles.megaFeaturedTitle}>
                      Policy-driven data quality
                    </span>
                    <span className={styles.megaFeaturedDesc}>
                      Turn your data quality policy into live checks on Snowflake and
                      Oracle, with pipeline cause and Power BI impact.
                    </span>
                    <span className={styles.megaFeaturedCta}>
                      Explore data quality
                      <Icon name="arrow" size={13} className="arrow" strokeWidth={2.5} />
                    </span>
                  </Link>
                </div>
              </div>
            </div>
            {primaryLinks.map((l) => renderLink(l))}
          </nav>

          <div className={styles.cta}>
            {/* Right cluster, three levels of emphasis:
                Sign in (text) · Start free (outline) · Book a demo (solid). */}
            <a
              href={APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.link} ${styles.ctaSignIn}`}
            >
              Sign in
            </a>
            <a
              href={SIGNUP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ctaStart}
            >
              Start free
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
          <span className={styles.drawerGroupLabel}>Infrastructure</span>
          {HOME_PRODUCTS.filter((p) => p.group === 'infrastructure').map((p) => (
            <Link
              key={p.id}
              to={p.to}
              className={styles.link}
              onClick={() => setDrawerOpen(false)}
            >
              {p.name}
            </Link>
          ))}
          <span className={styles.drawerGroupLabel}>Data</span>
          {HOME_PRODUCTS.filter((p) => p.group === 'data').map((p) => (
            <Link
              key={p.id}
              to={p.to}
              className={styles.link}
              onClick={() => setDrawerOpen(false)}
            >
              {p.name}
            </Link>
          ))}
          <span className={styles.drawerGroupLabel}>More</span>
          {primaryLinks
            .filter((l) => l.to !== '/data-observability') /* already in the drawer's Data group */
            .map((l) => renderLink(l, () => setDrawerOpen(false)))}
        </nav>

        <div className={styles.drawerCta}>
          <a
            href={SIGNUP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaStart}
            onClick={() => setDrawerOpen(false)}
          >
            Start free
          </a>
          <a
            href={APP_URL}
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
