import { useParams, Link } from 'react-router-dom';
import StatusPill from '../components/StatusPill';
import { useFetch } from '../lib/useFetch';
import { api } from '../lib/api';
import styles from './IncidentDetailPage.module.css';

/* Incident detail screen — laid out like the RCA modal in the
 * marketing hero demo: left rail of incident metadata, right rail of
 * AI-generated checks + code diff + root cause + confidence bar +
 * footer actions. */
export default function IncidentDetailPage() {
  const { id = '' } = useParams<{ id: string }>();
  const incident = useFetch(() => api.incident(id), [id]);
  const rca      = useFetch(() => api.rca(id), [id]);

  if (incident.loading) {
    return <div className={styles.placeholder}>Loading incident…</div>;
  }
  if (incident.error || !incident.data) {
    return <div className={styles.placeholder}>Incident not found.</div>;
  }
  const i = incident.data;
  const r = rca.data;

  return (
    <article className={styles.modal}>
      <header className={styles.header}>
        <div className={styles.crumb}>
          <Link to="/incidents" className={styles.crumbLink}>Incidents</Link>
          <span className={styles.crumbSlash}>/</span>
          <code>{i.id}</code>
        </div>
        <div className={styles.headerRight}>
          <StatusPill tone={i.severity === 'P1' ? 'red' : 'amber'} dot>{i.severity} · CRITICAL</StatusPill>
          <Link to="/incidents" className={styles.close} aria-label="Close">×</Link>
        </div>
      </header>

      <div className={styles.body}>
        {/* ----- Left rail: incident facts ----- */}
        <aside className={styles.left}>
          <div className={styles.leftHead}>
            <div className={styles.eyebrow}>Incident #{i.number}</div>
            <StatusPill tone="red" dot>{i.status === 'firing' ? 'Firing' : i.status}</StatusPill>
          </div>
          <h1 className={styles.title}>{i.title}</h1>
          <code className={styles.podCode}>{i.pod}</code>
          <div className={styles.reasonRow}>{i.reason} · {i.restarts.toLocaleString()} restarts</div>

          <dl className={styles.meta}>
            <Meta label="Cluster">{i.cluster}</Meta>
            <Meta label="Namespace">{i.namespace}</Meta>
            <Meta label="Repo">acme/cluster-manifests</Meta>
            <Meta label="Source">{i.sources.join(' · ')}</Meta>
            <Meta label="Fired">{relativeTime(i.firedAt)}</Meta>
            <Meta label="On-call">{i.onCall}</Meta>
          </dl>

          <div className={styles.activity}>
            <div className={styles.activityHead}>RECENT ACTIVITY</div>
            {r?.recentActivity.map((a, idx) => (
              <div key={idx} className={styles.activityRow}>
                <span className={`${styles.activityDot} ${idx === 0 ? styles.activityDotHot : idx === 1 ? styles.activityDotWarm : styles.activityDotCool}`} />
                <span className={styles.activityAt}>{a.at}</span>
                <span className={styles.activityLabel}>{a.label}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* ----- Right rail: AI RCA panel ----- */}
        <section className={styles.right}>
          <div className={styles.rcaHead}>
            <span className={styles.rcaBadge}>
              <span className={styles.rcaBadgeMark} aria-hidden />
              AlertMend AI · RCA
            </span>
            {r && (
              <StatusPill tone="green">
                <CheckIcon /> Resolved in {r.resolvedInSeconds.toFixed(1)}s
              </StatusPill>
            )}
          </div>

          {rca.loading && <div className={styles.placeholder}>Investigating…</div>}
          {r && (
            <>
              <ul className={styles.checks}>
                {r.checks.map((c) => (
                  <li key={c.id}><CheckIcon /> <span>{c.label}</span></li>
                ))}
              </ul>

              <div className={styles.diffCard}>
                <div className={styles.diffHead}>
                  <code className={styles.diffFile}><GitHubIcon /> {r.diff.file}</code>
                  <span className={styles.diffStats}>+{r.diff.added} -{r.diff.removed}</span>
                </div>
                <pre className={styles.diffBody}>
{r.diff.patch.split('\n').map((line, idx) => (
  <div key={idx} className={diffLineClass(line)}>{line || '\u00A0'}</div>
))}
                </pre>
              </div>

              <div className={styles.rootCause}>
                <div className={styles.rootCauseLabel}>ROOT CAUSE</div>
                <p className={styles.rootCauseText}>{r.rootCause.text}</p>
                <div className={styles.confidenceRow}>
                  <span className={styles.confidenceLabel}>Confidence</span>
                  <div className={styles.confidenceBar}>
                    <div className={styles.confidenceFill} style={{ width: `${Math.round(r.rootCause.confidence * 100)}%` }} />
                  </div>
                  <span className={styles.confidencePct}>{Math.round(r.rootCause.confidence * 100)}%</span>
                </div>
              </div>
            </>
          )}
        </section>
      </div>

      <footer className={styles.footer}>
        <button className={styles.btn} type="button"><GitHubIcon /> Generate PR</button>
        <button className={styles.btn} type="button"><PlayIcon /> Run runbook</button>
        <button className={styles.btn} type="button"><SlackIcon /> Post to Slack</button>
      </footer>
    </article>
  );
}

function Meta({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <>
      <dt className={styles.metaLabel}>{label}</dt>
      <dd className={styles.metaValue}>{children}</dd>
    </>
  );
}
function diffLineClass(line: string): string {
  if (line.startsWith('+')) return styles.diffAdded;
  if (line.startsWith('-')) return styles.diffRemoved;
  return styles.diffContext;
}
function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.round(diff / 60_000);
  if (m < 60) return `${m} min ago`;
  if (m < 1440) return `${Math.round(m / 60)}h ago`;
  return `${Math.round(m / 1440)}d ago`;
}

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
function GitHubIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-.99-.02-1.95-3.2.7-3.87-1.54-3.87-1.54-.52-1.32-1.28-1.67-1.28-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.69 1.24 3.34.95.1-.74.4-1.24.72-1.53-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.18.92-.26 1.91-.39 2.89-.39.98 0 1.97.13 2.89.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.73.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.07.78 2.16 0 1.56-.01 2.81-.01 3.19 0 .31.21.67.79.55C20.21 21.38 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z"/></svg>
  );
}
function PlayIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M7 5v14l11-7L7 5z" />
    </svg>
  );
}
function SlackIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M5 15a2 2 0 1 1 0-4h2v4H5zm3 0a2 2 0 1 1 4 0v5a2 2 0 1 1-4 0v-5zm2-10a2 2 0 1 1 0 4H8V5a2 2 0 0 1 2 0zm0 3a2 2 0 1 1 0 4H5a2 2 0 1 1 0-4h5zm9 2a2 2 0 1 1 0 4h-2v-4h2zm-3 0a2 2 0 1 1-4 0V5a2 2 0 1 1 4 0v5zm-2 10a2 2 0 1 1 0-4h2v2a2 2 0 0 1-2 2zm0-3a2 2 0 1 1 0-4h5a2 2 0 1 1 0 4h-5z"/></svg>
  );
}
