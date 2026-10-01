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
  | 'Data'
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
  /** Optional search title and keywords for the detail page. */
  seoTitle?: string;
  seoKeywords?: string;
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
  /** Optional "How to connect" steps shown on the detail page. */
  setupSteps?: string[];
  /** Optional FAQ; also emitted as FAQPage structured data. */
  faqs?: { q: string; a: string }[];
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
    tagline: 'Connect EC2, ECS, RDS, ELB and Lambda. Observe and remediate.',
    description:
      'Register an AlertMend agent in your AWS account to watch CloudWatch metrics, ECS task health, EC2 status checks, and RDS performance signals. AlertMend can restart stuck ECS tasks, cordon unhealthy nodes, and surface FinOps right-sizing across EC2, RDS, ELB, and ECS, all with audited approvals.',
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
    tagline: 'GKE, GCE, Cloud Run, BigQuery: full-stack visibility.',
    description:
      'AlertMend integrates with GCP via service-account credentials and GKE workload identity. We watch GKE pods, GCE VM groups, Cloud Run revisions, and budget alerts, and run remediations through cluster RBAC or VM-level SSH.',
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
    setupSteps: [
      'In AlertMend, copy your webhook URL from the integrations settings.',
      'In Datadog, add a webhook (Integrations → Webhooks) that points to the AlertMend URL.',
      'Add the webhook as a notification (@webhook-alertmend) on the monitors you want AlertMend to investigate.',
      'Trigger a test alert. AlertMend correlates it into an incident and posts the root cause to Slack or Teams.',
    ],
    faqs: [
      { q: 'Do we have to replace Datadog?', a: 'No. Keep Datadog for monitoring. AlertMend ingests its alerts and adds root cause and approved fixes on top.' },
      { q: 'What happens if AlertMend is down?', a: 'Your existing Datadog alerting path is unaffected; AlertMend sits on top of your stack, not in front of it.' },
    ],
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
    setupSteps: [
      'Create a Slack app for your workspace and add the bot scopes listed in the setup guide.',
      'Install the app to your workspace and copy the bot token.',
      'Create or pick a channel for incidents and root-cause reports, invite the AlertMend bot, and copy the channel ID.',
      'Add the token and channel ID in AlertMend. Approvals for remediation flows can now happen in that channel.',
    ],
    faqs: [
      { q: 'Can fixes run without approval?', a: 'The default is recommend, not execute. Remediation flows wait for an approval in Slack, Teams, email or the product.' },
      { q: 'Is every approval recorded?', a: 'Yes. Each suggestion, approval and executed step is written to the audit trail with who and when.' },
    ],
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
    tagline: 'File RCAs as Jira issues with one click, fields prefilled.',
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
      'When you need email as a paging channel (for execs, broader stakeholders, or fallback when chat is down), AlertMend can deliver structured RCA emails through your SendGrid account.',
    capabilities: [
      'Branded HTML RCAs sent on incident open/resolve',
      'Daily/weekly digest emails for stakeholders',
      'DKIM/SPF respected, sent as your domain',
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
      'AlertMend can open a pull request directly from an RCA (for example, the right-sized requests/limits YAML) using a fine-scoped GitHub App. Workflow runs are also ingested as deploy events for evidence.',
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
  {
    slug: 'snowflake',
    name: 'Snowflake',
    category: 'Data',
    tagline: 'Snowflake data observability, data quality and cost optimization.',
    seoTitle: 'Snowflake Data Observability & Data Quality | AlertMend',
    seoKeywords: 'Snowflake data observability, Snowflake data quality, Snowflake cost optimization, Snowflake FinOps, data freshness, schema drift, anomaly detection, data lineage, AlertMend',
    description:
      'Connect with a read-only role to monitor table freshness, volume, schema drift and null rates. When a pipeline breaks a data contract, AlertMend sends a root cause analysis. Snowflake FinOps shows where warehouse spend goes and how to cut it.',
    capabilities: [
      'Data quality monitoring: freshness, volume and anomaly detection',
      'Schema drift detection on critical tables',
      'Snowflake cost optimization: warehouse, compute and workload spend',
      'Slack / Teams paging with evidence citations',
      'Approval-gated quarantine or remediations',
    ],
    logoSrc: svgporn('snowflake'),
    iconSlug: 'snowflake',
    logoTint: '29B5E8',
    domain: 'snowflake.com',
    docsHref: '/data-observability',
    setupSteps: [
      'Install the AlertMend agent inside your network. It connects out to AlertMend, so no inbound ports are opened.',
      'Run the generated grant script to create a read-only Snowflake role for the agent. The agent keeps the credentials; AlertMend stores no warehouse secrets.',
      'Upload your data quality policy (for example BCBS 239 or an internal standard). AlertMend proposes checks, each citing the clause it enforces.',
      'Approve the checks you want. Nothing goes live until a person approves it, and every change is versioned.',
      'Choose where alerts go: Slack or Microsoft Teams, with the failing job and affected reports attached.',
    ],
    faqs: [
      { q: 'Does AlertMend write to Snowflake?', a: 'No. The agent refuses anything but read queries and caps query time.' },
      { q: 'Do our Snowflake credentials leave our network?', a: 'No. The agent inside your network holds them and sends back only query results.' },
      { q: 'How many checks can we run?', a: 'Checks and users are unlimited on every data plan. Plans are priced by monitored datasets.' },
    ],
  },
  {
    slug: 'bigquery',
    name: 'BigQuery',
    category: 'Data',
    tagline: 'Dataset health and slot cost signals in one incident view.',
    description:
      'AlertMend reads BigQuery metadata and job history to catch stale tables, sudden volume drops, and schema breaks before dashboards go dark. Pair with GCP cloud signals when spend drifts too.',
    capabilities: [
      'Dataset and table freshness monitors',
      'Volume and null-rate anomaly detection',
      'Schema drift alerts with column-level evidence',
      'Links into Observability when query latency spikes',
    ],
    logoSrc: svgporn('google-bigquery'),
    iconSlug: 'googlebigquery',
    logoTint: '669DF6',
    domain: 'cloud.google.com',
  },
  {
    slug: 'redshift',
    name: 'Redshift',
    category: 'Data',
    tagline: 'Cluster table health for Redshift and Redshift Serverless.',
    description:
      'Watch Redshift tables for freshness, row-count anomalies, and schema changes. Evidence lands in the same RCA flow as the rest of your AWS estate.',
    capabilities: [
      'Table freshness and volume monitors',
      'Schema change detection',
      'Correlated with AWS CloudWatch when useful',
      'Approval-gated runbooks for quarantine paths',
    ],
    logoSrc: svgporn('aws-redshift'),
    iconSlug: 'amazonredshift',
    logoTint: '8C4FFF',
    domain: 'aws.amazon.com',
  },
  {
    slug: 'databricks',
    name: 'Databricks',
    category: 'Data',
    tagline: 'Databricks data observability, data quality and cost optimization.',
    seoTitle: 'Databricks Data Observability & Data Quality | AlertMend',
    seoKeywords: 'Databricks data observability, Databricks data quality, Databricks cost optimization, Databricks FinOps, Delta tables, Unity Catalog, data pipeline monitoring, schema drift, AlertMend',
    description:
      'Connect Unity Catalog or workspace metadata to monitor Delta tables for freshness, volume and schema drift. Databricks FinOps shows cluster and job spend. Failed jobs and broken producers get the same cited RCA as infra incidents.',
    capabilities: [
      'Delta / Unity Catalog table monitors',
      'Data pipeline monitoring with job and anomaly correlation',
      'Databricks cost optimization: cluster, job and workload spend',
      'Contract checks for producers and consumers',
      'Slack / Teams approvals for remediations',
    ],
    logoSrc: svgporn('databricks'),
    iconSlug: 'databricks',
    logoTint: 'FF3621',
    domain: 'databricks.com',
  },
  {
    slug: 'postgres',
    name: 'Postgres',
    category: 'Data',
    tagline: 'OLTP and warehouse-adjacent Postgres table health.',
    description:
      'Use a read-only role to watch critical Postgres tables for freshness, row-count drift, and schema changes. Fits ETL landing tables and reporting schemas that sit next to the warehouse.',
    capabilities: [
      'Freshness and volume monitors on key tables',
      'Schema drift detection',
      'Null-rate and custom SQL metric checks',
      'Same approval loop as warehouse sources',
    ],
    logoSrc: svgporn('postgresql'),
    domain: 'postgresql.org',
  },
  {
    slug: 'dbt',
    name: 'dbt',
    category: 'Data',
    tagline: 'Model and test metadata as evidence in data RCAs.',
    description:
      'Ingest dbt run and test results so a failed model or broken test becomes evidence in the AlertMend RCA, not a separate silent failure in CI.',
    capabilities: [
      'dbt Cloud and Core run metadata',
      'Failed test / model as RCA evidence',
      'Lineage hints for impacted downstream tables',
      'Pairs with warehouse freshness monitors',
    ],
    logoSrc: svgporn('dbt-icon'),
    iconSlug: 'dbt',
    logoTint: 'FF694B',
    domain: 'getdbt.com',
  },
  {
    slug: 'airflow',
    name: 'Airflow',
    category: 'Data',
    tagline: 'DAG failures correlated with warehouse table health.',
    description:
      'Connect Airflow metadata so DAG and task failures land beside the tables they write. When freshness drops after a failed run, the RCA cites both signals.',
    capabilities: [
      'DAG / task failure ingestion',
      'Correlation with warehouse freshness monitors',
      'Owner and schedule context on the incident',
      'Approval-gated retry or quarantine runbooks',
    ],
    logoSrc: svgporn('airflow-icon'),
    iconSlug: 'apacheairflow',
    logoTint: '017CEE',
    domain: 'airflow.apache.org',
    docsHref: '/data-observability',
    setupSteps: [
      'Connect AlertMend to your Airflow metadata so DAG and task runs are visible next to your data checks.',
      'Map the DAGs that load the tables you monitor.',
      'When a check fails, AlertMend links it to the Airflow task that loaded the table, with the error, so the alert names the cause.',
    ],
    faqs: [
      { q: 'Do we need to change our DAGs?', a: 'No. AlertMend reads run metadata; it does not modify your DAGs.' },
      { q: 'Can a failed task page someone?', a: 'Yes. Failures can alert Slack or Teams and escalate through incidents and escalation on the plans that include them.' },
    ],
  },
  {
    slug: 'oracle',
    name: 'Oracle',
    category: 'Data',
    tagline: 'Policy-driven data quality checks on Oracle, read-only.',
    description:
      'Monitor Oracle tables with checks proposed from your data quality policy. A read-only agent runs inside your network, and when a check fails AlertMend links it to the Oracle ODI job that loaded the data.',
    capabilities: [
      'Checks proposed from your policy, each citing its clause',
      'Read-only agent inside your network; no inbound ports',
      'Failures linked to the Oracle ODI job and its error',
      'Alerts in Slack or Microsoft Teams with cause and impact',
    ],
    logoSrc: svgporn('oracle'),
    iconSlug: 'oracle',
    logoTint: 'F80000',
    domain: 'oracle.com',
    docsHref: '/data-observability',
    setupSteps: [
      'Install the AlertMend agent inside your network. It connects out only.',
      'Run the generated grant script to create a read-only Oracle role for the agent.',
      'Upload your data quality policy and approve the checks AlertMend proposes.',
      'Connect Oracle ODI so failed loads are linked to the checks they break.',
    ],
    faqs: [
      { q: 'Does AlertMend change data in Oracle?', a: 'No. The agent only runs read queries and caps query time.' },
      { q: 'Where do Oracle credentials live?', a: 'With the agent inside your network. AlertMend stores no warehouse secrets.' },
    ],
  },
  {
    slug: 'power-bi',
    name: 'Power BI',
    category: 'Data',
    tagline: 'See which reports bad data affects, before anyone opens them.',
    description:
      'Connect Power BI so every failed data check shows the reports that read the affected table. Report owners hear about bad numbers before the morning meeting, not from a business user.',
    capabilities: [
      'Affected reports listed on every failed check',
      'Report impact included in Slack and Teams alerts',
      'Pairs with Snowflake and Oracle checks',
      'Lineage from table to report',
    ],
    logoSrc: svgporn('microsoft-power-bi'),
    iconSlug: 'powerbi',
    logoTint: 'F2C811',
    domain: 'powerbi.microsoft.com',
    docsHref: '/data-observability',
    setupSteps: [
      'Connect AlertMend to your Power BI workspace so it can read which reports use which tables.',
      'Monitor the source tables in Snowflake or Oracle with checks from your policy.',
      'When a check fails, the alert lists the Power BI reports that read that table.',
    ],
    faqs: [
      { q: 'Does AlertMend change our reports?', a: 'No. It reads report-to-table lineage to show impact.' },
    ],
  },
];

export const integrationCategories: IntegrationCategory[] = [
  'Observability',
  'Data',
  'Cloud',
  'Incident & On-call',
  'Collaboration',
  'CI/CD',
  'Issue tracking',
];

export function findIntegrationBySlug(slug: string): Integration | undefined {
  return integrations.find((i) => i.slug === slug);
}
