import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import StatusPill from '../components/StatusPill';
import { useFetch } from '../lib/useFetch';
import { api } from '../lib/api';
import styles from './RunbooksPage.module.css';

const CATEGORIES = [
  { id: '',              label: 'All' },
  { id: 'kubernetes',    label: 'Kubernetes' },
  { id: 'ingress',       label: 'Ingress' },
  { id: 'storage',       label: 'Storage' },
  { id: 'observability', label: 'Observability' },
];

export default function RunbooksPage() {
  const [category, setCategory] = useState('');
  const runbooks = useFetch(() => api.runbooks(category || undefined), [category]);

  return (
    <>
      <PageHeader
        eyebrow="Runbooks"
        title="Pre-approved playbooks"
        description="One-click runnable mitigations the AI Copilot can call when an incident matches a known pattern."
      />

      <div className={styles.filters}>
        {CATEGORIES.map((c) => (
          <button
            key={c.id || 'all'}
            type="button"
            className={`${styles.filter} ${category === c.id ? styles.filterActive : ''}`}
            onClick={() => setCategory(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {runbooks.loading && <Card title="Loading…" />}
        {runbooks.error && <Card title="Failed to load runbooks">{runbooks.error}</Card>}
        {runbooks.data?.items.map((r) => (
          <Card
            key={r.id}
            title={r.title}
            subtitle={r.description}
            trailing={<StatusPill tone="violet">~{r.estimatedMinutes} min</StatusPill>}
          >
            <div className={styles.metaRow}>
              <StatusPill>{r.category}</StatusPill>
              <span className={styles.stepsCount}>{r.steps.length} steps</span>
            </div>
            <ol className={styles.steps}>
              {r.steps.map((s, idx) => (
                <li key={idx}>
                  <span className={styles.stepIdx}>{idx + 1}</span>
                  <code className={styles.stepBody}>{s}</code>
                </li>
              ))}
            </ol>
          </Card>
        ))}
      </div>
    </>
  );
}
