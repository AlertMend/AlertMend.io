import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import StatusPill from '../components/StatusPill';
import { useFetch } from '../lib/useFetch';
import { api } from '../lib/api';
import styles from './DashboardPage.module.css';

/* Cluster overview screen. Mirrors the three-column layout the
 * marketing hero demo shows: Active Incidents + Deployments on the
 * left, Cluster Insights (restart storms) in the middle, AI Copilot
 * prompts on the right. */
export default function DashboardPage() {
  const incidents   = useFetch(() => api.incidents({ status: 'firing' }));
  const deployments = useFetch(() => api.deployments());
  const insights    = useFetch(() => api.insights());
  const copilot     = useFetch(() => api.copilot());
  const agents      = useFetch(() => api.agents({ cluster: 'prod-us-east-1' }));

  const unhealthy = agents.data?.counts.unhealthy ?? 0;

  return (
    <>
      <PageHeader
        eyebrow="Cluster overview"
        title="prod-us-east-1"
        description="Live signals across pods, deploys, and AI Copilot suggestions for this cluster."
        trailing={
          <StatusPill tone={unhealthy > 0 ? 'red' : 'green'} dot>
            {unhealthy > 0 ? `${unhealthy} agent(s) unhealthy` : 'All agents healthy'}
          </StatusPill>
        }
      />

      <div className={styles.banner}>
        <span className={styles.bannerDot} aria-hidden />
        <span><strong>{unhealthy}</strong> Agent(s) Detected as Unhealthy</span>
        <span className={styles.bannerMeta}>Last updated 0:05 ago · IST</span>
      </div>

      <div className={styles.grid}>
        {/* ----- Left column: Active Incidents + Deployments ----- */}
        <div className={styles.colLeft}>
          <Card
            title="Active Incidents"
            trailing={
              <StatusPill tone="violet">
                {incidents.data ? `${incidents.data.total}/${incidents.data.counts.firing}` : '—'}
              </StatusPill>
            }
          >
            {incidents.loading && <Skeleton lines={3} />}
            {incidents.error && <ErrorRow message={incidents.error} />}
            {incidents.data?.items.map((i) => (
              <Link key={i.id} to={`/incidents/${i.id}`} className={styles.incident}>
                <div className={styles.incidentTop}>
                  <span className={styles.incidentTitle}>{i.title}</span>
                  <StatusPill tone={i.severity === 'P1' ? 'red' : 'amber'}>{i.severity}</StatusPill>
                </div>
                <div className={styles.incidentMeta}>
                  <span className={styles.exitChip}>Exit {i.exitCode}</span>
                  <span className={styles.incidentReason}>{i.reason} · {i.restarts} restarts</span>
                </div>
                <div className={styles.incidentFoot}>
                  <span className={styles.incidentAgo}>{relativeTime(i.firedAt)}</span>
                  <span className={styles.viewRca}>View RCA →</span>
                </div>
              </Link>
            ))}
          </Card>

          <Card
            title="Deployments"
            trailing={
              <StatusPill tone="green">
                {deployments.data
                  ? `${deployments.data.items.filter((d) => d.result === 'success').length}/${deployments.data.total} ok`
                  : '—'}
              </StatusPill>
            }
          >
            {deployments.loading && <Skeleton lines={2} />}
            {deployments.data?.items.slice(0, 2).map((d) => (
              <div key={d.id} className={styles.deploy}>
                <div className={styles.deployName}>{d.service}</div>
                <div className={styles.deployVersions}>
                  <code>{d.fromVersion}</code>
                  <span className={styles.deployArrow}>→</span>
                  <code>{d.toVersion}</code>
                </div>
                <div className={styles.deployFoot}>
                  <StatusPill tone={d.result === 'success' ? 'green' : d.result === 'rolled-back' ? 'amber' : 'red'}>
                    {d.result}
                  </StatusPill>
                  <span className={styles.deployAgo}>{relativeTime(d.finishedAt)}</span>
                </div>
              </div>
            ))}
          </Card>
        </div>

        {/* ----- Middle column: Cluster Insights (restart-storm rows) ----- */}
        <div className={styles.colMid}>
          <Card
            title={<><span className={styles.diamond}>◆</span> Cluster Insights</>}
            trailing={
              <StatusPill tone="green" dot>LIVE</StatusPill>
            }
          >
            {insights.loading && <Skeleton lines={3} />}
            {insights.data?.items.map((it) => (
              <article key={it.id} className={styles.insight}>
                <div className={styles.insightHead}>
                  <StatusPill tone={it.kind === 'restart-storm' ? 'red' : 'amber'} dot>
                    {labelKind(it.kind)}
                  </StatusPill>
                  <span className={styles.insightCount}>{it.restarts.toLocaleString()} restarts</span>
                </div>
                <div className={styles.insightTitle}>{it.title}</div>
                <p className={styles.insightDetail}>
                  Pod <code className={styles.podCode}>{it.pod}</code> has restarted{' '}
                  <strong>{it.restarts.toLocaleString()} times</strong>. Status:{' '}
                  {it.ready ? 'Running (Ready)' : 'Running (Not Ready)'}.
                </p>
                <div className={styles.insightFoot}>
                  <code className={styles.podCode}>{it.pod}</code>
                  <Link to={`/incidents/INC-08472`} className={styles.viewRcaLink}>View RCA →</Link>
                </div>
              </article>
            ))}
          </Card>
        </div>

        {/* ----- Right column: AI Copilot ----- */}
        <div className={styles.colRight}>
          <Card
            title={<><span className={styles.diamond}>◆</span> AI Copilot</>}
          >
            <p className={styles.copilotIntro}>
              I'm your cluster copilot. Ask about <strong>incidents</strong>, <strong>cost throttling</strong>,
              or <strong>how to fix</strong> any issue.
            </p>
            <div className={styles.copilotPrompts}>
              {copilot.loading && <Skeleton lines={2} />}
              {copilot.data?.items.map((s) => (
                <button key={s.id} className={styles.copilotPrompt} type="button">
                  {s.prompt}
                </button>
              ))}
            </div>
            <div className={styles.copilotInput}>
              <input type="text" placeholder="Ask about your cluster…" />
              <button type="button" aria-label="Send" className={styles.copilotSend}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.round(diff / 60_000);
  if (m < 1)   return 'just now';
  if (m < 60)  return `${m}m ago`;
  if (m < 1440) return `${Math.round(m / 60)}h ago`;
  return `${Math.round(m / 1440)}d ago`;
}
function labelKind(k: string): string {
  if (k === 'restart-storm') return 'Restart storm';
  if (k === 'cost-throttle') return 'Cost throttle';
  if (k === 'cpu-saturation') return 'CPU saturation';
  if (k === 'memory-pressure') return 'Memory pressure';
  return k;
}
function Skeleton({ lines }: { lines: number }) {
  return (
    <div>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={styles.skel} style={{ width: `${60 + ((i * 17) % 30)}%` }} />
      ))}
    </div>
  );
}
function ErrorRow({ message }: { message: string }) {
  return <div className={styles.errRow}>Failed to load: {message}</div>;
}
