/**
 * Integration catalog.
 *
 * Each entry is the source of truth for both the homepage `Integrations`
 * grid and the per-integration detail page at `/integrations/<slug>`.
 *
 * Logo strategy (re: the homepage opacity/contrast bug):
 *   `cdn.simpleicons.org/<slug>` returns a *monochrome black* SVG by default,
 *   which on a white logo chip reads as a faded silhouette — the visual
 *   "low-opacity" bug users were reporting. We prefer `svgporn` URLs (full
 *   brand color) when one exists for the brand, and fall back to a Simple
 *   Icons URL with an explicit brand-tinted hex when not. `domain` is kept
 *   as a third fallback so the favicon can stand in if both CDNs 404.
 */

export type IntegrationCategory =
  | 'Observability'
  | 'Cloud'
  | 'Incident & On-call'
  | 'Collaboration'
  | 'CI/CD'
  | 'Issue tracking';

export type Integration = {
  slug: string;
  name: string;
  category: IntegrationCategory;
  /** One-line summary used on the homepage tile + as the detail-page lede. */
  tagline: string;
  /** Detail-page longer description (1–2 short paragraphs). */
  description: string;
  /** Concrete capabilities the AlertMend ↔ <integration> link unlocks. */
  capabilities: string[];
  /** Direct logo URL (preferred — guarantees brand color). */
  logoSrc?: string;
  /** Simple Icons slug (fallback rendering, always pair with `logoTint` when used). */
  iconSlug?: string;
  /** Hex color (no leading #) used to tint Simple Icons output. */
  logoTint?: string;
  /** Domain for the favicon fallback when neither URL resolves. */
  domain: string;
  /** Optional in-app docs path or external setup guide. */
  docsHref?: string;
};

const svgporn = (slug: string) => `https://cdn.svgporn.com/logos/${slug}.svg`;

export const integrations: Integration[] = [
  {
    slug: 'kubernetes',
    name: 'Kubernetes',
    category: 'Observability',
    tagline: 'Cluster-native incident triage, runbooks, and FinOps.',
    description:
      'AlertMend connects to any Kubernetes cluster (EKS, GKE, AKS, on-prem) over a read-only kubeconfig and a lightweight in-cluster agent. We watch pod events, CrashLoopBackOff/OOMKilled signals, scheduling failures, HPA lag, and node pressure, then page a structured RCA before your synthetic checks turn red.',
    capabilities: [
      '3,000+ pods on one dashboard with namespace/workload/owner roll-ups',
      'CrashLoopBackOff, OOMKilled, evicted, and scheduling-stall RCAs',
      'One-click YAML right-sizing apply for requests/limits',
      'Cluster-overview View RCA links straight from any pod',
    ],
    logoSrc: svgporn('kubernetes'),
    domain: 'kubernetes.io',
  },
  {
    slug: 'aws',
    name: 'AWS',
    category: 'Cloud',
    tagline: 'Connect EC2, ECS, RDS, ELB, Lambda — observe and remediate.',
    description:
      'Register an AlertMend agent in your AWS account to watch CloudWatch metrics, ECS task health, EC2 status checks, and RDS performance signals. AlertMend can restart stuck ECS tasks, cordon unhealthy nodes, and surface FinOps right-sizing across EC2, RDS, ELB, and ECS — all with audited approvals.',
    capabilities: [
      'EC2 / ECS / RDS / ELB monitoring with CloudWatch ingestion',
      'Per-resource $/mo savings recommendations',
      'Auto-restart for stuck ECS tasks (auto-approval optional)',
      'Idle-instance cleanup with one-click Apply',
    ],
    logoSrc: svgporn('aws'),
    domain: 'aws.amazon.com',
  },
  {
    slug: 'google-cloud',
    name: 'Google Cloud',
    category: 'Cloud',
    tagline: 'GKE, GCE, Cloud Run, BigQuery — full-stack visibility.',
    description:
      'AlertMend integrates with GCP via service-account credentials and GKE workload identity. We watch GKE pods, GCE VM groups, Cloud Run revisions, and budget alerts — and run remediations through cluster RBAC or VM-level SSH.',
    capabilities: [
      'GKE workload health + 50% cost reduction patterns from WareFlex',
      'GCE VM auto-recovery for stuck workloads',
      'Cloud Run revision rollback when error budget burns',
      'BigQuery slot and storage cost drift detection',
    ],
    logoSrc: svgporn('google-cloud'),
    domain: 'cloud.google.com',
  },
  {
    slug: 'azure',
    name: 'Azure',
    category: 'Cloud',
    tagline: 'AKS, VMSS, App Service, and Azure Monitor sources.',
    description:
      'AlertMend reads from Azure Monitor / Log Analytics and runs remediations through AKS RBAC and ARM. Health signals from VMSS, App Service plans, and AKS nodepools land in the same incident view as the rest of your fleet.',
    capabilities: [
      'AKS nodepool incidents with structured RCAs',
      'VMSS auto-heal with audited approvals',
      'App Service slot rollback on failed deploys',
      'Azure Monitor alert enrichment with live evidence',
    ],
    logoSrc: svgporn('microsoft-azure'),
    domain: 'azure.microsoft.com',
  },
  {
    slug: 'prometheus',
    name: 'Prometheus',
    category: 'Observability',
    tagline: 'Ingest alerts and PromQL series for evidence collection.',
    description:
      'Point Alertmanager at AlertMend over webhook, and connect any Prometheus endpoint for read-only PromQL queries. AlertMend uses series like `kube_pod_status_phase`, `node_memory_MemAvailable_bytes`, and `nvidia_smi_*` as evidence in every RCA.',
    capabilities: [
      'Alertmanager → AlertMend webhook ingestion',
      'PromQL queries for live RCA evidence',
      'Recording-rule-friendly: works with thanos/cortex',
      'GPU exporter (DCGM / nvidia_smi) supported out of the box',
    ],
    logoSrc: svgporn('prometheus'),
    domain: 'prometheus.io',
  },
  {
    slug: 'grafana',
    name: 'Grafana',
    category: 'Observability',
    tagline: 'Embed AlertMend RCAs alongside your dashboards.',
    description:
      'AlertMend ships a panel and a Slack-style RCA card you can drop into any Grafana dashboard. Linked RCAs become a click away from the panels your team already watches, so the on-call investigation starts from the chart.',
    capabilities: [
      'AlertMend panel plugin for Grafana 9+',
      'Deep links from any panel into an AlertMend RCA',
      'Synthetic check status and AlertMend incident overlay',
      'Single SSO with the rest of your Grafana org',
    ],
    logoSrc: svgporn('grafana'),
    logoTint: 'F46800',
    domain: 'grafana.com',
  },
  {
    slug: 'datadog',
    name: 'Datadog',
    category: 'Observability',
    tagline: 'Triage Datadog monitors with live RCAs in 15 seconds.',
    description:
      'Wire any Datadog monitor through an AlertMend webhook to enrich the alert with logs, traces, and recent deploys before paging anyone. AlertMend authenticates back into Datadog with a read-only API key for evidence collection.',
    capabilities: [
      'Datadog Monitor → AlertMend webhook with full payload',
      'Read-only logs/metrics queries from Datadog for evidence',
      'Polymer Search shipped MTTR 45m → <5m on this exact path',
      'Bidirectional comments on the Datadog incident',
    ],
    logoSrc: svgporn('datadog'),
    domain: 'datadoghq.com',
    docsHref: '/documentation/datadog-webhook',
  },
  {
    slug: 'victoria-metrics',
    name: 'Victoria Metrics',
    category: 'Observability',
    tagline: 'High-cardinality metrics source for AlertMend RCAs.',
    description:
      'AlertMend talks to Victoria Metrics over the Prometheus HTTP API and ingests vmalert webhooks. Great fit for teams that have outgrown vanilla Prometheus and want fewer dropped series during peak load.',
    capabilities: [
      'vmalert → AlertMend webhook ingestion',
      'High-cardinality friendly evidence queries',
      'Works with vmagent remote-write topologies',
      'Compatible with Grafana Mimir / cortex deployments',
    ],
    iconSlug: 'victoriametrics',
    logoTint: 'BB42BC',
    domain: 'victoriametrics.com',
  },
  {
    slug: 'slack',
    name: 'Slack',
    category: 'Collaboration',
    tagline: 'AI RCAs land in the channel before the on-call opens their laptop.',
    description:
      'AlertMend posts RCAs into the channel of your choice and accepts approval reactions, slash-commands, and threaded follow-ups. Same Slack app handles routing rules, escalations, and runbook approvals.',
    capabilities: [
      'Slack-native RCA delivery with deep links to evidence',
      'Approval reactions (✅ / 🛑) for guarded runbook steps',
      '/alertmend slash-commands for ad-hoc triage',
      'Per-channel routing rules via filter rules',
    ],
    logoSrc: svgporn('slack'),
    domain: 'slack.com',
    docsHref: '/documentation/slack-app-approval',
  },
  {
    slug: 'ms-teams',
    name: 'Microsoft Teams',
    category: 'Collaboration',
    tagline: 'Adaptive cards, approvals, and runbook triggers in Teams.',
    description:
      'AlertMend ships a first-class Teams app with adaptive cards for RCAs, approvals, and runbook triggers. Works with both classic Teams and the new client; supports tenant-wide install via admin approval.',
    capabilities: [
      'Adaptive-card RCAs with embedded evidence',
      'Approval cards for guarded runbooks',
      'Channel routing per filter rule',
      'Tenant-wide install via Microsoft 365 admin center',
    ],
    logoSrc: svgporn('microsoft-teams'),
    domain: 'microsoft.com',
    docsHref: '/documentation/ms-teams-approval',
  },
  {
    slug: 'pagerduty',
    name: 'PagerDuty',
    category: 'Incident & On-call',
    tagline: 'Two-way sync: AlertMend RCAs onto PagerDuty incidents.',
    description:
      'Existing PagerDuty rotations stay your source of truth for who gets paged. AlertMend posts the RCA and remediation log onto the PagerDuty incident, and pulls back acknowledge/resolve state to keep the two views in sync.',
    capabilities: [
      'AlertMend RCA → PagerDuty incident note',
      'Bidirectional ack/resolve sync',
      'Routing keys per service / team',
      'Audit trail consolidated across both systems',
    ],
    logoSrc: svgporn('pagerduty'),
    logoTint: '06AC38',
    domain: 'pagerduty.com',
  },
  {
    slug: 'jira',
    name: 'Jira',
    category: 'Issue tracking',
    tagline: 'File RCAs as Jira issues with one click — fields prefilled.',
    description:
      'Drop an AlertMend incident into Jira as a structured issue: summary, evidence, runbook log, and root-cause classification all go into the right fields. Works with Jira Cloud and Jira DC.',
    capabilities: [
      'One-click "File as Jira" from any AlertMend RCA',
      'Custom field mapping (severity, owner, RCA classification)',
      'Bidirectional comment sync',
      'Cloud + Data Center supported',
    ],
    logoSrc: svgporn('jira'),
    domain: 'atlassian.com',
  },
  {
    slug: 'sendgrid',
    name: 'SendGrid',
    category: 'Collaboration',
    tagline: 'Email-channel paging and digest delivery via SendGrid.',
    description:
      'When you need email as a paging channel — for execs, broader stakeholders, or fallback when chat is down — AlertMend can deliver structured RCA emails through your SendGrid account.',
    capabilities: [
      'Branded HTML RCAs sent on incident open/resolve',
      'Daily/weekly digest emails for stakeholders',
      'DKIM/SPF respected — sent as your domain',
      'Per-recipient routing rules',
    ],
    logoSrc: svgporn('sendgrid'),
    domain: 'sendgrid.com',
  },
  {
    slug: 'google-meet',
    name: 'Google Meet',
    category: 'Collaboration',
    tagline: 'Spin up a war-room Meet from any AlertMend incident.',
    description:
      'High-severity incidents get a "Start war room" action that creates a Google Meet, posts the join link to the incident channel, and records the RCA timeline alongside the call.',
    capabilities: [
      'One-click Meet from any incident',
      'Join link posted to Slack / Teams automatically',
      'Calendar invite to the on-call group',
      'Attendance recorded on the incident timeline',
    ],
    iconSlug: 'googlemeet',
    logoTint: '00897B',
    domain: 'meet.google.com',
  },
  {
    slug: 'jenkins',
    name: 'Jenkins',
    category: 'CI/CD',
    tagline: 'Correlate Jenkins deploys to incident root causes.',
    description:
      'AlertMend ingests Jenkins build webhooks and uses recent deploys as evidence in every RCA. When an incident correlates with a build, the RCA links straight back to the failing job and changeset.',
    capabilities: [
      'Jenkins build webhook ingestion',
      'Recent-deploy evidence in every RCA',
      'Auto-rollback runbook trigger from a paged incident',
      'Per-pipeline scope and routing',
    ],
    logoSrc: svgporn('jenkins'),
    domain: 'jenkins.io',
  },
  {
    slug: 'github-actions',
    name: 'GitHub Actions',
    category: 'CI/CD',
    tagline: 'Generate PRs from runbooks; correlate Actions to incidents.',
    description:
      'AlertMend can open a pull request directly from an RCA — for example, the right-sized requests/limits YAML — using a fine-scoped GitHub App. Workflow runs are also ingested as deploy events for evidence.',
    capabilities: [
      'GitHub App with least-privilege scopes',
      '"Generate PR" action straight from any RCA',
      'Actions workflow events as RCA evidence',
      'Auto-revert runbook for failed deploys',
    ],
    logoSrc: svgporn('github-actions'),
    logoTint: '2088FF',
    domain: 'github.com',
  },
  {
    slug: 'gitlab',
    name: 'GitLab CI',
    category: 'CI/CD',
    tagline: 'Pipeline-aware RCAs and merge-request remediation.',
    description:
      'Connect AlertMend to GitLab self-managed or .com via a project access token. Pipeline runs become deploy evidence, and AlertMend can open MRs against the right project from a paged incident.',
    capabilities: [
      'GitLab project access token for least-privilege auth',
      'Pipeline events as RCA evidence',
      '"Open MR" runbook for guarded fixes',
      'Self-managed and .com both supported',
    ],
    logoSrc: svgporn('gitlab'),
    domain: 'gitlab.com',
  },
  {
    slug: 'whatsapp',
    name: 'WhatsApp',
    category: 'Incident & On-call',
    tagline: 'WhatsApp paging for distributed engineering teams.',
    description:
      'Especially useful for global teams or co-location-heavy industries (logistics, IoT) where WhatsApp is the de-facto coordination channel. AlertMend pages directly to WhatsApp with a back-link to the full RCA.',
    capabilities: [
      'WhatsApp Business API delivery',
      'Acknowledge by reply',
      'Group routing per filter rule',
      'Same audit trail as Slack/Teams paging',
    ],
    logoSrc: svgporn('whatsapp'),
    domain: 'whatsapp.com',
  },
];

export const integrationCategories: IntegrationCategory[] = [
  'Observability',
  'Cloud',
  'Incident & On-call',
  'Collaboration',
  'CI/CD',
  'Issue tracking',
];

export function findIntegrationBySlug(slug: string): Integration | undefined {
  return integrations.find((i) => i.slug === slug);
}
