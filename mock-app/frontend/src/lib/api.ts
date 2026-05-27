/**
 * Tiny typed fetch wrapper around the mock backend. Every endpoint is
 * GET-only so this file doesn't expose POST/PUT/DELETE — if you find
 * yourself reaching for those, it's a sign that the mock surface
 * should grow rather than that this client should bend.
 */

const BASE = '/api';

export type Severity = 'P1' | 'P2' | 'P3';
export type IncidentStatus = 'firing' | 'investigating' | 'resolved';

export interface Cluster {
  id: string;
  name: string;
  provider: 'aws' | 'gcp' | 'azure' | 'on-prem';
  region: string;
  agents: number;
  unhealthyAgents: number;
  lastUpdatedAt: string;
}

export interface Incident {
  id: string;
  number: number;
  title: string;
  pod: string;
  namespace: string;
  cluster: string;
  reason: string;
  restarts: number;
  exitCode: number;
  severity: Severity;
  status: IncidentStatus;
  firedAt: string;
  onCall: string;
  sources: string[];
}

export interface RcaCheck { id: string; label: string; detail?: string }
export interface DiffHunk { file: string; added: number; removed: number; patch: string }
export interface RootCause { text: string; confidence: number }
export interface Rca {
  incidentId: string;
  resolvedInSeconds: number;
  checks: RcaCheck[];
  diff: DiffHunk;
  rootCause: RootCause;
  recentActivity: Array<{ at: string; label: string }>;
}

export interface Insight {
  id: string;
  kind: string;
  title: string;
  pod: string;
  namespace: string;
  restarts: number;
  status: string;
  ready: boolean;
}

export interface Runbook {
  id: string;
  title: string;
  description: string;
  category: string;
  steps: string[];
  estimatedMinutes: number;
}

export interface Agent {
  id: string;
  cluster: string;
  hostname: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  version: string;
  uptimeHours: number;
}

export interface Deployment {
  id: string;
  service: string;
  fromVersion: string;
  toVersion: string;
  result: 'success' | 'rolled-back' | 'failed';
  finishedAt: string;
}

export interface CopilotSuggestion {
  id: string;
  prompt: string;
  topic: string;
}

interface List<T> { items: T[]; total: number }
interface IncidentList extends List<Incident> {
  counts: { firing: number; investigating: number; resolved: number };
}
interface AgentList extends List<Agent> {
  counts: { healthy: number; degraded: number; unhealthy: number };
}

async function get<T>(path: string, params?: Record<string, string | undefined>): Promise<T> {
  const url = new URL(BASE + path, window.location.origin);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') url.searchParams.set(k, v);
    }
  }
  const res = await fetch(url.toString(), { headers: { accept: 'application/json' } });
  if (!res.ok) {
    throw new Error(`GET ${path} failed: ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as T;
}

export const api = {
  health:           () => get<{ ok: boolean; service: string; version: string }>('/health'),
  clusters:         () => get<List<Cluster>>('/clusters'),
  cluster:          (id: string) => get<Cluster>(`/clusters/${id}`),
  incidents:        (params?: { status?: IncidentStatus; severity?: Severity; cluster?: string }) =>
                      get<IncidentList>('/incidents', params),
  incident:         (id: string) => get<Incident>(`/incidents/${id}`),
  rca:              (id: string) => get<Rca>(`/incidents/${id}/rca`),
  insights:         () => get<List<Insight> & { live: boolean }>('/insights'),
  runbooks:         (category?: string) => get<List<Runbook>>('/runbooks', { category }),
  runbook:          (id: string) => get<Runbook>(`/runbooks/${id}`),
  agents:           (params?: { cluster?: string; status?: string }) => get<AgentList>('/agents', params),
  deployments:      () => get<List<Deployment>>('/deployments'),
  copilot:          () => get<List<CopilotSuggestion>>('/copilot/suggestions'),
};
