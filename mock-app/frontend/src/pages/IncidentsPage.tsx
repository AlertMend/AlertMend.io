import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import StatusPill from '../components/StatusPill';
import { useFetch } from '../lib/useFetch';
import { api, type IncidentStatus } from '../lib/api';
import styles from './IncidentsPage.module.css';

const STATUSES: { id: '' | IncidentStatus; label: string }[] = [
  { id: '',              label: 'All' },
  { id: 'firing',        label: 'Firing' },
  { id: 'investigating', label: 'Investigating' },
  { id: 'resolved',      label: 'Resolved' },
];

export default function IncidentsPage() {
  const [status, setStatus] = useState<'' | IncidentStatus>('');
  const incidents = useFetch(
    () => api.incidents(status ? { status } : undefined),
    [status],
  );
  const counts = incidents.data?.counts;

  return (
    <>
      <PageHeader
        eyebrow="Incidents"
        title="Active and recent incidents"
        description="Auto-paged from Datadog, Prometheus, and PagerDuty across all linked clusters."
        trailing={
          counts && (
            <div className={styles.counts}>
              <StatusPill tone="red">{counts.firing} firing</StatusPill>
              <StatusPill tone="amber">{counts.investigating} investigating</StatusPill>
              <StatusPill tone="green">{counts.resolved} resolved</StatusPill>
            </div>
          )
        }
      />

      <div className={styles.filters}>
        {STATUSES.map((s) => (
          <button
            key={s.id || 'all'}
            type="button"
            className={`${styles.filter} ${status === s.id ? styles.filterActive : ''}`}
            onClick={() => setStatus(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>

      <Card bare>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Incident</th>
              <th>Reason</th>
              <th>Cluster</th>
              <th>Restarts</th>
              <th>Severity</th>
              <th>Status</th>
              <th>Fired</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {incidents.loading && (
              <tr><td colSpan={8} className={styles.empty}>Loading…</td></tr>
            )}
            {incidents.error && (
              <tr><td colSpan={8} className={styles.error}>Failed to load: {incidents.error}</td></tr>
            )}
            {!incidents.loading && incidents.data?.items.length === 0 && (
              <tr><td colSpan={8} className={styles.empty}>No incidents match this filter.</td></tr>
            )}
            {incidents.data?.items.map((i) => (
              <tr key={i.id}>
                <td>
                  <div className={styles.idCell}>
                    <code className={styles.id}>{i.id}</code>
                    <span className={styles.pod}>{i.pod}</span>
                  </div>
                </td>
                <td><span className={styles.reason}>{i.reason}</span></td>
                <td>{i.cluster}</td>
                <td><code className={styles.num}>{i.restarts.toLocaleString()}</code></td>
                <td><StatusPill tone={i.severity === 'P1' ? 'red' : i.severity === 'P2' ? 'amber' : 'neutral'}>{i.severity}</StatusPill></td>
                <td>
                  <StatusPill
                    tone={i.status === 'firing' ? 'red' : i.status === 'investigating' ? 'amber' : 'green'}
                    dot
                  >
                    {i.status}
                  </StatusPill>
                </td>
                <td>{new Date(i.firedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                <td className={styles.actionCell}>
                  <Link to={`/incidents/${i.id}`} className={styles.action}>View RCA →</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}
