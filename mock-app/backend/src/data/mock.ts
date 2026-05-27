/**
 * In-memory seed data for the AlertMend mock API. Everything here is
 * intentionally deterministic — no DB, no clock, no randomness — so
 * the mock UI looks identical across reloads, demos, and screenshots.
 *
 * The shapes are designed to back the screens the marketing hero
 * already shows (cluster overview, RCA modal, restart-storm insights,
 * AI copilot prompts) so the mock app feels like the real product.
 */

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
  sources: ('datadog' | 'prometheus' | 'pagerduty' | 'newrelic')[];
}

export interface RcaCheck {
  id: string;
  label: string;
  detail?: string;
}

export interface DiffHunk {
  file: string;
  added: number;
  removed: number;
  patch: string;
}

export interface RootCause {
  text: string;
  confidence: number;
}

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
  kind: 'restart-storm' | 'cost-throttle' | 'cpu-saturation' | 'memory-pressure';
  title: string;
  pod: string;
  namespace: string;
  restarts: number;
  status: 'running' | 'not-ready' | 'unknown';
  ready: boolean;
}

export interface Runbook {
  id: string;
  title: string;
  description: string;
  category: 'kubernetes' | 'ingress' | 'storage' | 'observability';
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
  topic: 'incidents' | 'cost' | 'how-to-fix' | 'healthy-nodes';
}

export const clusters: Cluster[] = [
  {
    id: 'prod-us-east-1',
    name: 'prod-us-east-1',
    provider: 'aws',
    region: 'us-east-1',
    agents: 18,
    unhealthyAgents: 4,
    lastUpdatedAt: '2026-05-21T05:35:00Z',
  },
  {
    id: 'prod-eu-west-1',
    name: 'prod-eu-west-1',
    provider: 'aws',
    region: 'eu-west-1',
    agents: 12,
    unhealthyAgents: 0,
    lastUpdatedAt: '2026-05-21T05:35:00Z',
  },
  {
    id: 'staging-us-west-2',
    name: 'staging-us-west-2',
    provider: 'aws',
    region: 'us-west-2',
    agents: 6,
    unhealthyAgents: 1,
    lastUpdatedAt: '2026-05-21T05:34:30Z',
  },
];

export const incidents: Incident[] = [
  {
    id: 'INC-08472',
    number: 8472,
    title: 'log-ingester',
    pod: 'log-ingester-7d9b4f8c5d-x2k7p',
    namespace: 'platform-logging',
    cluster: 'prod-us-east-1',
    reason: 'CrashLoopBackOff',
    restarts: 50,
    exitCode: 137,
    severity: 'P1',
    status: 'firing',
    firedAt: '2026-05-21T04:48:00Z',
    onCall: '@alex (auto-paged)',
    sources: ['datadog', 'prometheus'],
  },
  {
    id: 'INC-08471',
    number: 8471,
    title: 'am-dashboard',
    pod: 'am-dashboard-5486c48f54-nvwmg',
    namespace: 'default',
    cluster: 'prod-us-east-1',
    reason: 'RestartStorm',
    restarts: 2062,
    exitCode: 1,
    severity: 'P2',
    status: 'investigating',
    firedAt: '2026-05-21T04:36:00Z',
    onCall: '@maya',
    sources: ['datadog'],
  },
  {
    id: 'INC-08470',
    number: 8470,
    title: 'istio-ingressgateway',
    pod: 'istio-ingressgateway-675649c455-859m',
    namespace: 'istio-system',
    cluster: 'prod-us-east-1',
    reason: 'NotReady',
    restarts: 11,
    exitCode: 0,
    severity: 'P2',
    status: 'firing',
    firedAt: '2026-05-21T04:22:00Z',
    onCall: '@oncall',
    sources: ['prometheus', 'pagerduty'],
  },
  {
    id: 'INC-08469',
    number: 8469,
    title: 'redis-cache',
    pod: 'redis-cache-0',
    namespace: 'platform-cache',
    cluster: 'staging-us-west-2',
    reason: 'OOMKilled',
    restarts: 6,
    exitCode: 137,
    severity: 'P3',
    status: 'resolved',
    firedAt: '2026-05-21T02:11:00Z',
    onCall: '@alex',
    sources: ['datadog'],
  },
];

export const rcas: Rca[] = [
  {
    incidentId: 'INC-08472',
    resolvedInSeconds: 14.2,
    checks: [
      { id: 'evidence',     label: 'Pulled pod events, logs, metrics from the last 15m' },
      { id: 'cluster',      label: 'Cross-checked cluster state and recent deploys' },
      { id: 'pattern',      label: 'Matched failure pattern: ephemeral-storage eviction' },
      { id: 'sibling-pods', label: 'Drafted fix and validated against 3 sibling pods' },
    ],
    diff: {
      file: 'deploy/log-ingester/values.yaml',
      added: 4,
      removed: 1,
      patch:
        '- ephemeralStorage: 1Gi\n' +
        '+ ephemeralStorage: 4Gi\n' +
        '+ logRotation:\n' +
        '+   maxSize: 100Mi\n' +
        '+   keep: 5\n',
    },
    rootCause: {
      text:
        'Pod exceeded its ephemeral-storage: 1Gi limit due to log buildup. ' +
        'Kubelet evicted the pod, triggering restart loop. Sibling pods on ' +
        'the same node are trending toward the same threshold.',
      confidence: 0.94,
    },
    recentActivity: [
      { at: '2m ago',  label: 'Pod evicted · ephemeral-storage' },
      { at: '9m ago',  label: 'Restart attempt #49' },
      { at: '47m ago', label: 'Deploy v2.31.4' },
    ],
  },
  {
    incidentId: 'INC-08471',
    resolvedInSeconds: 21.7,
    checks: [
      { id: 'evidence', label: 'Collected dashboard server logs from the last 30m' },
      { id: 'cluster',  label: 'Identified panic on missing migration column' },
      { id: 'history',  label: 'Matched against 2 prior incidents on this service' },
      { id: 'mitigation', label: 'Drafted hotfix branch with column backfill' },
    ],
    diff: {
      file: 'services/am-dashboard/db/migrations/20260520_add_team_id.sql',
      added: 6,
      removed: 0,
      patch:
        '+ ALTER TABLE incidents ADD COLUMN team_id UUID;\n' +
        '+ UPDATE incidents SET team_id = (\n' +
        '+   SELECT id FROM teams WHERE slug = \'default\' LIMIT 1\n' +
        '+ );\n' +
        '+ ALTER TABLE incidents ALTER COLUMN team_id SET NOT NULL;\n',
    },
    rootCause: {
      text:
        'Deploy v3.12.0 introduced a query referencing incidents.team_id ' +
        'before the column was backfilled. The dashboard pod panics on ' +
        'startup, triggering the restart storm.',
      confidence: 0.88,
    },
    recentActivity: [
      { at: '4m ago',  label: 'Restart attempt #2,062' },
      { at: '23m ago', label: 'Deploy v3.12.0' },
      { at: '1h ago',  label: 'Schema migration started' },
    ],
  },
];

export const insights: Insight[] = [
  {
    id: 'insight-log-ingester',
    kind: 'restart-storm',
    title: 'log-ingester-7d9b4f8c5d-x2k7p',
    pod: 'platform-logging/log-ingester-7d9b4f8c5d-x2k7p',
    namespace: 'platform-logging',
    restarts: 47,
    status: 'running',
    ready: true,
  },
  {
    id: 'insight-am-dashboard',
    kind: 'restart-storm',
    title: 'am-dashboard-5486c48f54-nvwmg',
    pod: 'default/am-dashboard-5486c48f54-nvwmg',
    namespace: 'default',
    restarts: 2062,
    status: 'running',
    ready: true,
  },
  {
    id: 'insight-istio',
    kind: 'restart-storm',
    title: 'istio-ingressgateway-675649c455-859m',
    pod: 'istio-system/istio-ingressgateway-675649c455-859m',
    namespace: 'istio-system',
    restarts: 11,
    status: 'not-ready',
    ready: false,
  },
];

export const runbooks: Runbook[] = [
  {
    id: 'rb-crashloop',
    title: 'CrashLoopBackOff recovery',
    description: 'Triage steps for pods stuck in a CrashLoopBackOff. Covers events, logs, ephemeral-storage, image pull, and quick rollback.',
    category: 'kubernetes',
    steps: [
      'kubectl describe pod <pod> -n <namespace>',
      'kubectl logs <pod> -n <namespace> --previous',
      'Check kubelet ephemeral-storage and node disk pressure',
      'Inspect the most recent Deployment rollout',
      'Roll back with kubectl rollout undo if a fresh deploy is the cause',
    ],
    estimatedMinutes: 6,
  },
  {
    id: 'rb-restart-storm',
    title: 'Restart storm — high restart count',
    description: 'Mitigate runaway restart loops without losing production traffic.',
    category: 'kubernetes',
    steps: [
      'Scale the deployment to 0 if data corruption is suspected',
      'Lock the service behind a feature flag',
      'Promote a healthy revision via kubectl rollout undo',
      'Open an incident with the on-call team',
    ],
    estimatedMinutes: 8,
  },
  {
    id: 'rb-ingress-5xx',
    title: 'Ingress 5xx burst',
    description: 'Diagnose 5xx error bursts at the ingress (Istio / nginx / ALB).',
    category: 'ingress',
    steps: [
      'Confirm the burst on the ingress dashboard (golden signals)',
      'Check upstream pod readiness probes',
      'Look for connection pool / timeout configuration drift',
      'Drain unhealthy upstream pods',
    ],
    estimatedMinutes: 10,
  },
  {
    id: 'rb-pvc-pressure',
    title: 'PVC near capacity',
    description: 'Free up space on a PersistentVolumeClaim before it triggers eviction.',
    category: 'storage',
    steps: [
      'Identify the heaviest paths inside the volume',
      'Add a log-rotation sidecar if logs are the culprit',
      'Resize the PVC online (if the storage class supports it)',
      'Schedule a follow-up to right-size the volume',
    ],
    estimatedMinutes: 12,
  },
];

export const agents: Agent[] = [
  { id: 'agent-1', cluster: 'prod-us-east-1', hostname: 'ip-10-0-12-43.ec2',  status: 'healthy',  version: '2.14.1', uptimeHours: 312 },
  { id: 'agent-2', cluster: 'prod-us-east-1', hostname: 'ip-10-0-12-44.ec2',  status: 'healthy',  version: '2.14.1', uptimeHours: 312 },
  { id: 'agent-3', cluster: 'prod-us-east-1', hostname: 'ip-10-0-12-45.ec2',  status: 'degraded', version: '2.14.0', uptimeHours: 18  },
  { id: 'agent-4', cluster: 'prod-us-east-1', hostname: 'ip-10-0-12-46.ec2',  status: 'unhealthy', version: '2.13.9', uptimeHours: 2 },
  { id: 'agent-5', cluster: 'prod-eu-west-1', hostname: 'ip-10-1-3-21.ec2',   status: 'healthy',  version: '2.14.1', uptimeHours: 248 },
  { id: 'agent-6', cluster: 'staging-us-west-2', hostname: 'ip-10-2-7-9.ec2', status: 'healthy',  version: '2.14.1', uptimeHours: 96  },
];

export const deployments: Deployment[] = [
  { id: 'dep-1', service: 'azure-ip-masq-agent',  fromVersion: 'v0.1.13-2', toVersion: 'v0.1.13-3', result: 'success',     finishedAt: '2026-05-21T04:05:00Z' },
  { id: 'dep-2', service: 'am-dashboard',         fromVersion: 'v3.11.4',   toVersion: 'v3.12.0',   result: 'rolled-back', finishedAt: '2026-05-21T05:10:00Z' },
  { id: 'dep-3', service: 'log-ingester',         fromVersion: 'v2.31.3',   toVersion: 'v2.31.4',   result: 'success',     finishedAt: '2026-05-21T04:50:00Z' },
  { id: 'dep-4', service: 'istio-ingressgateway', fromVersion: '1.21.0',    toVersion: '1.21.2',    result: 'success',     finishedAt: '2026-05-21T03:20:00Z' },
];

export const copilotSuggestions: CopilotSuggestion[] = [
  { id: 'cs-1', prompt: 'How many pods are active?',           topic: 'incidents' },
  { id: 'cs-2', prompt: 'List all healthy Nodes for this cluster.', topic: 'healthy-nodes' },
  { id: 'cs-3', prompt: 'What is driving cost throttling today?',   topic: 'cost' },
  { id: 'cs-4', prompt: 'Show me how to fix the log-ingester loop.', topic: 'how-to-fix' },
];
