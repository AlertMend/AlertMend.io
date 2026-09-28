/** Shared homepage product catalog — hero stage + product list. */

/** Ids are enumerated so callers that key off a product — the Platform nav,
 *  SolutionPageTemplate's `highlightProduct`, PlatformBoardMock's
 *  `activeProduct` — are checked at compile time instead of silently missing
 *  at runtime. Add a product below and this union widens with it. */
export type HomeProductId =
  | 'k8s'
  | 'obs'
  | 'dataobs'
  | 'logs'
  | 'rca'
  | 'fix'
  | 'oncall'
  | 'finops'
  | 'mlops'

export type HomeProduct = {
  id: HomeProductId
  /** Short tab label in the hero console. */
  tab: string
  name: string
  line: string
  /** Terse variant of `line`, sized for the Platform nav menu column. */
  blurb: string
  to: string
  /** Which front door the product belongs to (nav/footer grouping). */
  group: 'infrastructure' | 'data'
}

export const HOME_PRODUCTS: readonly HomeProduct[] = [
  {
    id: 'k8s',
    tab: 'Kubernetes',
    name: 'Kubernetes monitoring & management',
    line: 'Every cluster on one overview, with incidents and RCA one click away.',
    blurb: 'Clusters, pods, nodes, health',
    to: '/kubernetes-management',
    group: 'infrastructure',
  },
  {
    id: 'obs',
    tab: 'Observability',
    name: 'Observability & APM',
    line: 'Metrics, logs, traces, and a live service map via OpenTelemetry + eBPF.',
    blurb: 'Metrics, logs and traces, unified',
    to: '/observability',
    group: 'infrastructure',
  },
  {
    id: 'logs',
    tab: 'Logs',
    name: 'Log management',
    line: 'SQL over your logs, fast at production volume.',
    blurb: 'SQL logs for Kubernetes and VMs',
    to: '/log-management',
    group: 'infrastructure',
  },
  {
    id: 'rca',
    tab: 'AI RCA',
    name: 'AI RCA',
    line: 'Root cause with cited evidence and a confidence score.',
    blurb: 'Evidence-backed root cause',
    to: '/ai-rca',
    group: 'infrastructure',
  },
  {
    id: 'fix',
    tab: 'RF',
    name: 'Remediation & runbooks',
    line: 'Approved remediation flows that fix incidents and post the summary back.',
    blurb: 'Approved workflows that act',
    to: '/auto-remediation',
    group: 'infrastructure',
  },
  {
    id: 'oncall',
    tab: 'On-call',
    name: 'On-call & incidents',
    line: 'Rotations and escalation. Every page arrives with context.',
    blurb: 'Schedules and escalation',
    to: '/on-call-management',
    group: 'infrastructure',
  },
  {
    id: 'finops',
    tab: 'FinOps',
    name: 'FinOps',
    line: 'Requested vs used, right-sizing with YAML preview and rollback.',
    blurb: 'Right-size spend, preview YAML',
    to: '/kubernetes-cost-optimization',
    group: 'infrastructure',
  },
  {
    id: 'mlops',
    tab: 'MLOps',
    name: 'GPU & MLOps',
    line: 'GPU fleets and ML pipelines, observed and triaged like the rest of your stack.',
    blurb: 'H100/A100 fleets, ML pipelines',
    to: '/gpu-mlops',
    group: 'infrastructure',
  },
  {
    id: 'dataobs',
    tab: 'Data',
    name: 'Data Observability',
    line: 'Turn your data quality policy into live checks on Snowflake and Oracle, with a read-only agent in your network.',
    blurb: 'Policy-driven data quality',
    to: '/data-observability',
    group: 'data',
  },
]
