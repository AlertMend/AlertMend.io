/** Shared homepage product catalog — hero stage + product list. */

export type HomeProduct = {
  id: string
  /** Short tab label in the hero console. */
  tab: string
  name: string
  line: string
  to: string
}

export const HOME_PRODUCTS: HomeProduct[] = [
  {
    id: 'k8s',
    tab: 'Kubernetes',
    name: 'Kubernetes management',
    line: 'Every cluster on one overview — incidents with RCA one click away.',
    to: '/kubernetes-management',
  },
  {
    id: 'obs',
    tab: 'Observability',
    name: 'Observability & APM',
    line: 'Metrics, logs, traces, and a live service map via OpenTelemetry + eBPF.',
    to: '/observability',
  },
  {
    id: 'logs',
    tab: 'Logs',
    name: 'Log management',
    line: 'SQL over your logs — fast at production volume.',
    to: '/log-management',
  },
  {
    id: 'rca',
    tab: 'AI RCA',
    name: 'AI RCA',
    line: 'Root cause with cited evidence and a confidence score.',
    to: '/ai-rca',
  },
  {
    id: 'fix',
    tab: 'RF',
    name: 'RF · Remediation',
    line: 'Approved remediation flows that fix incidents and post the summary back.',
    to: '/auto-remediation',
  },
  {
    id: 'oncall',
    tab: 'On-call',
    name: 'On-call & incidents',
    line: 'Rotations and escalation — every page arrives with context.',
    to: '/on-call-management',
  },
  {
    id: 'finops',
    tab: 'FinOps',
    name: 'FinOps',
    line: 'Requested vs used, right-sizing with YAML preview and rollback.',
    to: '/kubernetes-cost-optimization',
  },
]
