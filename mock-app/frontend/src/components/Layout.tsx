import { Outlet, NavLink } from 'react-router-dom';
import styles from './Layout.module.css';

/* App shell: a fixed-width sidebar on the left + a slim top bar + the
 * routed page. Mirrors the layout the marketing hero demo previews so
 * visitors flowing from /alertmend.io to the mock app feel continuity.
 *
 * Navigation links are kept minimal (Dashboard, Incidents, Runbooks,
 * Agents) — matching the icon column in the hero mockup. */
const navLinks = [
  { to: '/',          label: 'Dashboard',  icon: DashboardIcon  },
  { to: '/incidents', label: 'Incidents',  icon: IncidentsIcon  },
  { to: '/runbooks',  label: 'Runbooks',   icon: RunbooksIcon   },
  { to: '/agents',    label: 'Agents',     icon: AgentsIcon     },
] as const;

export default function Layout() {
  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <div className={styles.brandMark} aria-hidden />
          <div>
            <div className={styles.brandName}>AlertMend</div>
            <div className={styles.brandSub}>Cluster console</div>
          </div>
        </div>
        <nav className={styles.nav}>
          {navLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
              }
            >
              <Icon />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className={styles.sidebarFooter}>
          <div className={styles.sidebarFooterLabel}>Mock backend</div>
          <div className={styles.sidebarFooterValue}>localhost:4000</div>
        </div>
      </aside>

      <div className={styles.main}>
        <header className={styles.topbar}>
          <div className={styles.crumb}>
            <span className={styles.crumbDim}>app.alertmend.io</span>
            <span className={styles.crumbSlash}>/</span>
            <span>clusters</span>
            <span className={styles.crumbSlash}>/</span>
            <span>prod-us-east-1</span>
          </div>
          <div className={styles.topbarRight}>
            <button className={styles.topbarChip} type="button">
              <span className={styles.topbarDot} aria-hidden />
              Last 24 hours
            </button>
            <button className={styles.topbarChip} type="button">
              prod-us-east-1
            </button>
          </div>
        </header>
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

/* ----- Inline icon set (16px, 1.6 stroke) so the layout has zero deps
 *       on an icon library. The marketing site uses the same stroke
 *       weight + viewBox conventions. ----- */
function svgProps() {
  return {
    width: 16,
    height: 16,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
}
function DashboardIcon() {
  return (
    <svg {...svgProps()}>
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  );
}
function IncidentsIcon() {
  return (
    <svg {...svgProps()}>
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <circle cx="12" cy="17" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}
function RunbooksIcon() {
  return (
    <svg {...svgProps()}>
      <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v18H6.5A2.5 2.5 0 0 1 4 17.5Z" />
      <path d="M4 17.5A2.5 2.5 0 0 1 6.5 15H20" />
    </svg>
  );
}
function AgentsIcon() {
  return (
    <svg {...svgProps()}>
      <rect x="3" y="4" width="18" height="6" rx="1.5" />
      <rect x="3" y="14" width="18" height="6" rx="1.5" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
      <line x1="7" y1="17" x2="7.01" y2="17" />
    </svg>
  );
}
