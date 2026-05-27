import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import StatusPill from '../components/StatusPill';
import { useFetch } from '../lib/useFetch';
import { api } from '../lib/api';
import styles from './AgentsPage.module.css';

export default function AgentsPage() {
  const agents = useFetch(() => api.agents());
  const c = agents.data?.counts;

  return (
    <>
      <PageHeader
        eyebrow="Agents"
        title="Cluster agents"
        description="One lightweight AlertMend agent per node — collects events, logs, and metrics."
        trailing={
          c && (
            <div className={styles.counts}>
              <StatusPill tone="green" dot>{c.healthy} healthy</StatusPill>
              <StatusPill tone="amber" dot>{c.degraded} degraded</StatusPill>
              <StatusPill tone="red" dot>{c.unhealthy} unhealthy</StatusPill>
            </div>
          )
        }
      />

      <Card bare>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Hostname</th>
              <th>Cluster</th>
              <th>Version</th>
              <th>Uptime</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {agents.loading && (
              <tr><td colSpan={5} className={styles.empty}>Loading…</td></tr>
            )}
            {agents.data?.items.map((a) => (
              <tr key={a.id}>
                <td><code className={styles.host}>{a.hostname}</code></td>
                <td>{a.cluster}</td>
                <td><code>{a.version}</code></td>
                <td>{formatHours(a.uptimeHours)}</td>
                <td>
                  <StatusPill
                    tone={a.status === 'healthy' ? 'green' : a.status === 'degraded' ? 'amber' : 'red'}
                    dot
                  >
                    {a.status}
                  </StatusPill>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}

function formatHours(h: number): string {
  if (h < 24) return `${h}h`;
  return `${Math.round(h / 24)}d ${h % 24}h`;
}
