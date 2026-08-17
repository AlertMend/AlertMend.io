import { useEffect, useRef, useState } from 'react';
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
  { kind: 'route', to: '/observability', label: 'Observability' },
  { kind: 'route', to: '/ai-rca', label: 'AI RCAs' },
  { kind: 'route', to: '/pricing', label: 'Pricing' },
  { kind: 'route', to: '/case-studies', label: 'Customers' },
];

/* "Platform" mega-menu — a Datadog-style multi-column product panel. Each
   item points at a real route or homepage section. `hash` items deep-link
   to a homepage anchor; everything else is a route. */
type MegaItem = { label: string; to: string; hash?: boolean; desc: string };

const megaLinkTo = (it: MegaItem) =>
  it.hash
    ? { pathname: '/', hash: it.to.startsWith('#') ? it.to : `#${it.to}` }
    : it.to;

const MEGA: { label: string; items: MegaItem[] }[] = [
  {
    label: 'Observability',
    items: [
      { label: 'Observability & APM', to: '/observability', desc: 'Metrics, logs & traces, unified' },
      { label: 'Distributed tracing', to: '/observability', desc: 'OpenTelemetry + eBPF spans' },
      { label: 'Service map', to: '/observability', desc: 'Live topology from real traffic' },
      { label: 'Log management', to: '/log-management', desc: 'SQL logs for Kubernetes and VMs' },
      { label: 'Metrics & dashboards', to: '/observability', desc: 'Prometheus / PromQL panels' },
    ],
  },
  {
    label: 'Automate & operate',
    items: [
      { label: 'Kubernetes monitoring', to: '/kubernetes-management', desc: 'Clusters, pods, nodes, health' },
      { label: 'Auto-remediation', to: '/auto-remediation', desc: 'Approved workflows that act' },
      { label: 'Runbooks', to: '/auto-remediation', desc: 'Visual remediation flows' },
      { label: 'On-call & incidents', to: '/on-call-management', desc: 'Schedules & escalation' },
      { label: 'AI root cause', to: '/ai-rca', desc: 'Evidence-backed RCA' },
    ],
  },
  {
    label: 'Optimize & govern',
    items: [
      { label: 'Kubernetes FinOps', to: '/kubernetes-cost-optimization', desc: 'Right-size spend' },
      { label: 'Cloud FinOps (AWS)', to: '/kubernetes-cost-optimization', desc: 'EC2, RDS, ELB + K8s' },
      { label: 'Security & compliance', to: '/security', desc: 'RBAC, audit (SOC 2 in progress)' },
    ],
  },
];

const SIGNUP_URL = 'https://app.alertmend.io/signup';
const PLAYGROUND_URL = 'https://demo.alertmend.io';
const CALENDLY_URL = 'https://calendly.com/hello-alertmend/30min';

export default function Nav() {
  const scrolled = useScrolled(8);
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [platformOpen, setPlatformOpen] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);

  const openMega = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setPlatformOpen(true);
  };
  const closeMega = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setPlatformOpen(false), 120);
  };

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
            <div
              className={styles.megaWrap}
              onMouseEnter={openMega}
              onMouseLeave={closeMega}
            >
              <button
                type="button"
                className={`${styles.link} ${styles.megaTrigger} ${platformOpen ? styles.megaTriggerOpen : ''}`}
                aria-haspopup="true"
                aria-expanded={platformOpen}
                onClick={() => setPlatformOpen(true)}
                onFocus={openMega}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setPlatformOpen(false);
                }}
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
              <div
                className={`${styles.megaPanel} ${platformOpen ? styles.megaOpen : ''}`}
                role="menu"
                aria-label="Platform"
                onMouseEnter={openMega}
                onMouseLeave={closeMega}
              >
                <div className={styles.megaGrid}>
                  {MEGA.map((col) => (
                    <div key={col.label} className={styles.megaCol}>
                      <span className={styles.megaColLabel}>{col.label}</span>
                      {col.items.map((it) => (
                        <Link
                          key={it.label}
                          to={megaLinkTo(it)}
                          className={styles.megaItem}
                          role="menuitem"
                          onClick={() => setPlatformOpen(false)}
                        >
                          <span className={styles.megaItemTitle}>{it.label}</span>
                          <span className={styles.megaItemDesc}>{it.desc}</span>
                        </Link>
                      ))}
                    </div>
                  ))}
                  <Link
                    to="/observability"
                    className={styles.megaFeatured}
                    onClick={() => setPlatformOpen(false)}
                  >
                    <span className={styles.megaFeaturedTag}>New</span>
                    <span className={styles.megaFeaturedTitle}>
                      One live observability console
                    </span>
                    <span className={styles.megaFeaturedDesc}>
                      Metrics, logs, traces & a service map — correlated, with AI
                      root cause on top.
                    </span>
                    <span className={styles.megaFeaturedCta}>
                      Explore observability
                      <Icon name="arrow" size={13} className="arrow" strokeWidth={2.5} />
                    </span>
                  </Link>
                </div>
              </div>
            </div>
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
          <span className={styles.drawerGroupLabel}>Platform</span>
          {MEGA.flatMap((col) => col.items).map((it) => (
            <Link
              key={it.label}
              to={megaLinkTo(it)}
              className={styles.link}
              onClick={() => setDrawerOpen(false)}
            >
              {it.label}
            </Link>
          ))}
          <span className={styles.drawerGroupLabel}>More</span>
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
