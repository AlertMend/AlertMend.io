/**
 * Documentation sidebar IA — task-first “how to use AlertMend”.
 * Order follows the day-to-day loop: install → observe → alert → diagnose → fix.
 */

export type DocsNavLink = {
  title: string
  href: string
  /** Mark pages that are still stub / coming soon in the hub only */
  draft?: boolean
}

export type DocsNavSection = {
  title: string
  items: DocsNavLink[]
}

export const DOCS_NAV: DocsNavSection[] = [
  {
    title: 'How to use',
    items: [
      { title: 'What AlertMend does', href: '/documentation/what-is-alertmend' },
      { title: 'Where to click (UI map)', href: '/documentation/platform-overview' },
      { title: 'Key terms', href: '/documentation/concepts' },
      { title: 'How it fits together', href: '/documentation/architecture' },
    ],
  },
  {
    title: 'Install',
    items: [
      { title: 'Connect a Kubernetes cluster', href: '/documentation/install-cluster-agent' },
      { title: 'Install the logs agent', href: '/documentation/install-logs-agent' },
      { title: 'Turn on auto-instrumentation', href: '/documentation/auto-instrumentation' },
      { title: 'Add VM & host collectors', href: '/documentation/install-vm-collectors' },
    ],
  },
  {
    title: 'Observe',
    items: [
      { title: 'Use observability', href: '/documentation/observability' },
      { title: 'Query metrics & dashboards', href: '/documentation/metrics' },
      { title: 'Search logs', href: '/documentation/logs' },
      { title: 'Query logs with SQL', href: '/documentation/logs-query' },
      { title: 'Inspect traces & APM', href: '/documentation/traces-apm' },
      { title: 'Enable Deep Visibility (eBPF)', href: '/documentation/deep-visibility' },
    ],
  },
  {
    title: 'Target workloads',
    items: [
      { title: 'Write AT-QL queries', href: '/documentation/atql' },
      { title: 'AT-QL field reference', href: '/documentation/atql-fields' },
      { title: 'Create a resource alias', href: '/documentation/resource-aliases' },
      { title: 'Author Runbook-as-Code', href: '/documentation/runbook-as-code' },
    ],
  },
  {
    title: 'Alert & on-call',
    items: [
      { title: 'Handle alerts & incidents', href: '/documentation/alerts-incidents' },
      { title: 'Create health policies', href: '/documentation/health-policies' },
      { title: 'Set on-call & escalations', href: '/documentation/on-call' },
    ],
  },
  {
    title: 'Diagnose',
    items: [
      { title: 'Run AI root cause analysis', href: '/documentation/ai-rca' },
      { title: 'Bring your own model', href: '/documentation/byom' },
    ],
  },
  {
    title: 'Fix & automate',
    items: [
      { title: 'Build a Remediation Flow', href: '/documentation/remediation-flows' },
      { title: 'Use runbooks', href: '/documentation/runbooks' },
      { title: 'Require approvals', href: '/documentation/approvals' },
      { title: 'Run commands & aliases', href: '/documentation/commands-aliases' },
      { title: 'Open a PR Fix & verify', href: '/documentation/pr-fix' },
    ],
  },
  {
    title: 'Connect tools',
    items: [
      { title: 'Integrations overview', href: '/documentation/integrations' },
      { title: 'Slack app for approval', href: '/documentation/slack-app-approval' },
      { title: 'Slack token & channel', href: '/documentation/slack-token-channel' },
      { title: 'Slack RCA channel', href: '/documentation/slack-rca-channel' },
      { title: 'MS Teams approval', href: '/documentation/ms-teams-approval' },
      { title: 'MS Teams in RF', href: '/documentation/ms-teams-rf' },
      { title: 'MS Teams incoming webhook', href: '/documentation/ms-teams-webhook' },
      { title: 'Datadog webhook', href: '/documentation/datadog-webhook' },
    ],
  },
  {
    title: 'Optimize & admin',
    items: [
      { title: 'Kubernetes FinOps', href: '/documentation/finops-kubernetes' },
      { title: 'AWS Cloud FinOps', href: '/documentation/finops-aws' },
      { title: 'VM predefined actions', href: '/documentation/alertmend-vm-actions' },
      { title: 'Users, RBAC & audit', href: '/documentation/rbac-audit' },
    ],
  },
]

/** Flat list of every href in the nav (for sitemap / prerender). */
export function allDocsHrefs(): string[] {
  return DOCS_NAV.flatMap((s) => s.items.map((i) => i.href))
}
