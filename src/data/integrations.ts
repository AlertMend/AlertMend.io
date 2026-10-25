/**
 * Integration catalog.
 *
 * Each entry is the source of truth for the `/integrations` hub (catalog,
 * counts, coverage matrix), the per-integration detail page at
 * `/integrations/<slug>`, the prerendered routes and the sitemap. Counts on
 * the hub are computed from this array, so they cannot drift from the tiles.
 *
 * Logo strategy (re: the homepage opacity/contrast bug):
 *   `cdn.simpleicons.org/<slug>` returns a *monochrome black* SVG by default,
 *   which on a white logo chip reads as a faded silhouette — the visual
 *   "low-opacity" bug users were reporting. We prefer `svgporn` URLs (full
 *   brand color) when one exists for the brand, and fall back to a Simple
 *   Icons URL with an explicit brand-tinted hex when not. `domain` is kept
 *   as a third fallback so the favicon can stand in if both CDNs 404.
 */

import type { HomeProductId } from './homeProducts';

/** The three groups of the directory: what you monitor (data, infra) and where you respond. */
export type IntegrationLayer = 'data' | 'infra' | 'response';

/** Functionality: what kind of tool it is. The directory's primary filter. */
export type IntegrationCategory =
  | 'Data warehouses'
  | 'Databases'
  | 'ETL & data integration'
  | 'Orchestration'
  | 'Transformation'
  | 'BI & analytics'
  | 'Kubernetes & containers'
  | 'Cloud providers'
  | 'Hosts & VMs'
  | 'Monitoring & alerting'
  | 'Logs & tracing'
  | 'Caches & message queues'
  | 'API gateways'
  | 'GPU & ML'
  | 'Chat & collaboration'
  | 'Paging & on-call'
  | 'Ticketing'
  | 'Source control & CI/CD'
  | 'Webhooks & API';

export const integrationLayers: {
  id: IntegrationLayer;
  label: string;
  blurb: string;
  categories: IntegrationCategory[];
}[] = [
  {
    id: 'data',
    label: 'Data stack',
    blurb: 'Warehouses, databases, pipelines and BI. Checks run on the tables; pipelines and reports explain cause and impact.',
    categories: ['Data warehouses', 'Databases', 'ETL & data integration', 'Orchestration', 'Transformation', 'BI & analytics'],
  },
  {
    id: 'infra',
    label: 'Infrastructure',
    blurb: 'Clusters, clouds, VMs, the monitoring you already run, and the services and GPUs on top.',
    categories: [
      'Kubernetes & containers',
      'Cloud providers',
      'Hosts & VMs',
      'Monitoring & alerting',
      'Logs & tracing',
      'Caches & message queues',
      'API gateways',
      'GPU & ML',
    ],
  },
  {
    id: 'response',
    label: 'Response & automation',
    blurb: 'Where root causes, approvals, tickets and pull requests land, and how your own tools plug in.',
    categories: ['Chat & collaboration', 'Paging & on-call', 'Ticketing', 'Source control & CI/CD', 'Webhooks & API'],
  },
];

export const integrationCategories: IntegrationCategory[] = integrationLayers.flatMap((l) => l.categories);

export function layerOf(category: IntegrationCategory): IntegrationLayer {
  return integrationLayers.find((l) => l.categories.includes(category))?.id ?? 'infra';
}

/** How a connection is made. One method per integration; the hub explains each. */
export type ConnectionMethodId =
  | 'warehouse-role'
  | 'pipeline-api'
  | 'cluster-agent'
  | 'host-agent'
  | 'cloud-account'
  | 'signal-ingest'
  | 'app-install'
  | 'built-in';

export type ConnectionMethod = {
  id: ConnectionMethodId;
  name: string;
  /** Short label for tile badges. */
  short: string;
  summary: string;
  /** What the customer sets up or hands over. */
  provide: string;
  /** Which way traffic flows. */
  network: string;
  /** What AlertMend reads through this connection. */
  reads: string;
  /** What, if anything, AlertMend can change. */
  changes: string;
};

/* Claims here are checked against the product code (auto_remediation):
   read-only SQL guard + 120s statement timeout + query audit on warehouse
   connectors, outbound gRPC for the Helm agent, webhook auth by API key or
   bearer. Keep it that way: this block is what security reviewers read. */
export const connectionMethods: ConnectionMethod[] = [
  {
    id: 'warehouse-role',
    name: 'Read-only warehouse connection',
    short: 'Read-only role',
    summary: 'For warehouses and databases. Data quality checks run as read-only SQL against the tables you choose.',
    provide: 'A read-only role or user. AlertMend generates the grant script; for Snowflake it grants USAGE and SELECT only.',
    network: 'Direct from AlertMend, or through an AlertMend agent inside your network when the warehouse is private. The agent connects outbound.',
    reads: 'Metadata from INFORMATION_SCHEMA, and the aggregate results of your checks: row counts, null rates, latest timestamps, custom SQL. Column profiling samples rows only when you turn it on.',
    changes: 'Nothing. Every check must be a single SELECT or WITH statement, times out after 120 seconds by default and is written to a query audit log. Writing results back to your warehouse is a separate, opt-in export.',
  },
  {
    id: 'pipeline-api',
    name: 'Pipeline and BI metadata',
    short: 'Metadata API',
    summary: 'For orchestration, ELT and BI tools. Run status and lineage turn a failed check into a cause and an impact.',
    provide: 'An API credential per tool: an Airflow REST user, a dbt Cloud token, a Power BI service principal, read access to the ODI repository. dbt Core can upload run_results.json with an upload token instead.',
    network: 'AlertMend calls each tool’s API. dbt Core uploads results to AlertMend.',
    reads: 'Runs, task status, error messages, schedules, owners, and which reports read which tables.',
    changes: 'Nothing. AlertMend reads metadata; it does not modify your DAGs, jobs or reports.',
  },
  {
    id: 'cluster-agent',
    name: 'Kubernetes agent',
    short: 'Helm agent',
    summary: 'For clusters on EKS, GKE, AKS or your own hardware, and the workloads running on them. One Helm chart.',
    provide: 'helm install alertmend/alertmend-agent with your agent ID and key. The same chart can run the OpenTelemetry collector and eBPF Deep Visibility.',
    network: 'Outbound gRPC over TLS from the cluster. No inbound ports and no kubeconfig to share.',
    reads: 'Pods, deployments, nodes, PVCs, jobs and events; workload YAML; pod logs; metrics. With Deep Visibility: L4/L7 traffic, database wire spans and CPU profiles, without an SDK.',
    changes: 'Restart, scale, roll back or right-size, only through remediation flows you build. Flows recommend by default, wait for approval and record every step.',
  },
  {
    id: 'host-agent',
    name: 'VM agent or SSH',
    short: 'Host agent',
    summary: 'For EC2, GCE and on-prem VMs, and services such as databases and gateways running on them.',
    provide: 'One install script per role (host metrics, logs, app metrics), running in Docker. Or go agentless with an SSH key.',
    network: 'The agent sends data over an outbound connection. Agentless mode connects from AlertMend to the VM over SSH.',
    reads: 'Host and container metrics, the logs you choose to tail, and exporter metrics for services such as MySQL, Elasticsearch and Kong.',
    changes: 'Commands and service restarts from approved runbook steps, fanned out across the VMs that match.',
  },
  {
    id: 'cloud-account',
    name: 'Cloud account',
    short: 'Cloud credentials',
    summary: 'For cloud inventory, cost and native cloud metrics.',
    provide: 'Scoped cloud credentials: AWS access keys, or an IAM role on the host running the CloudWatch collector; a GCP service account; Azure credentials for Azure Monitor.',
    network: 'AlertMend, or the collector you deploy, calls the cloud provider’s APIs.',
    reads: 'Resource inventory and utilisation (EC2, ECS, RDS, load balancers, Elastic IPs), CloudWatch metrics, and cost signals.',
    changes: 'Nothing by default. Cleanup or resizing runs only as an approved runbook step.',
  },
  {
    id: 'signal-ingest',
    name: 'Alert webhooks and query APIs',
    short: 'Webhook + query',
    summary: 'For the monitoring you already run. Keep it; AlertMend adds root cause and remediation on top.',
    provide: 'Your workspace webhook URL with an API key or bearer token, set as a receiver in Alertmanager, Datadog, vmalert or any tool that posts JSON. Optional read-only query access (a PromQL endpoint, a Datadog API and application key) and OTLP export.',
    network: 'Your tools post alerts to AlertMend. Prometheus queries run through the in-cluster agent.',
    reads: 'Alert payloads, then the metrics, logs, traces and monitors an investigation needs.',
    changes: 'Nothing in your monitoring tool. If AlertMend is unavailable, your existing alerting path is unaffected.',
  },
  {
    id: 'app-install',
    name: 'App, token or OAuth',
    short: 'App / token',
    summary: 'For the places your team responds: chat, paging, tickets and code.',
    provide: 'A Slack app (bot token or OAuth), a Teams incoming webhook, API tokens for PagerDuty, Jira and SendGrid, a GitHub App or token, OAuth for Google Meet and Zoom.',
    network: 'AlertMend calls each tool’s API.',
    reads: 'Very little: channel lists, and messages only in channels you route to AlertMend.',
    changes: 'Only what the scope allows: post root causes and approval requests, create and update incidents and issues, open pull requests.',
  },
  {
    id: 'built-in',
    name: 'Built in',
    short: 'Built in',
    summary: 'Escalation channels AlertMend operates for you.',
    provide: 'Phone numbers. No credentials.',
    network: 'AlertMend delivers from its own accounts.',
    reads: 'Nothing.',
    changes: 'Nothing. It delivers escalation messages.',
  },
];

export function findConnectionMethod(id: ConnectionMethodId): ConnectionMethod {
  return connectionMethods.find((m) => m.id === id) ?? connectionMethods[0];
}

/** Per-method setup used when an integration has no hand-written steps. */
export const methodSetupSteps: Record<ConnectionMethodId, (name: string) => string[]> = {
  'warehouse-role': (name) => [
    `Create a read-only role for AlertMend in ${name}. AlertMend generates the grant script.`,
    `Add the connection in AlertMend: direct, or through an AlertMend agent if ${name} sits on a private network.`,
    'Pick the tables to monitor and approve the checks AlertMend proposes.',
    'Choose where alerts go: Slack or Microsoft Teams.',
  ],
  'pipeline-api': (name) => [
    `Create a read-only API credential in ${name}.`,
    'Add it in AlertMend’s data quality settings.',
    'Map jobs or reports to the tables they use, so a failed check names its cause and its impact.',
  ],
  'cluster-agent': (name) => [
    'Add the AlertMend Helm repository to the cluster.',
    'Install the agent with your agent ID and key: helm install alertmend/alertmend-agent.',
    `${name} signals appear once the agent is running. No extra credentials are needed.`,
    'Optional: turn on the OpenTelemetry collector and Deep Visibility in the same chart.',
  ],
  'host-agent': (name) => [
    'Run the AlertMend install script on each VM and choose the role: host metrics, logs or app metrics.',
    'Or add the VM in AlertMend with an SSH key for agentless mode.',
    `${name} metrics stream to AlertMend from the agent.`,
  ],
  'cloud-account': () => [
    'Create a scoped, read-only identity in your cloud account.',
    'Add it in AlertMend, or deploy the collector with it.',
    'Grant write permissions only if you want approved runbooks to clean up or resize resources.',
  ],
  'signal-ingest': (name) => [
    'Copy your workspace webhook URL and API key from AlertMend.',
    `Add it as a webhook or notification target in ${name}.`,
    'Optional: give AlertMend read-only query access for evidence during investigations.',
    'Send a test alert and check the root cause lands in Slack or Teams.',
  ],
  'app-install': (name) => [
    `Connect ${name} from AlertMend’s integrations settings, with a token or the OAuth flow.`,
    'Choose the channels, services or projects AlertMend may post to.',
    'Route alerts and approvals to it with filter rules.',
  ],
  'built-in': () => [
    'Add phone numbers to an escalation path in AlertMend.',
    'Choose which alerts escalate there.',
  ],
};

/** Integration type: how data moves between the tool and AlertMend. An integration can have several. */
export type DataFlow = 'read' | 'stream' | 'notify';

export const dataFlows: Record<
  DataFlow,
  { label: string; title: string; hint: string; who: string; timing: string; network: string }
> = {
  read: {
    label: 'Read access',
    title: 'AlertMend reads from it',
    hint: 'AlertMend connects with read-only credentials you scope, and reads on a schedule or during an investigation.',
    who: 'AlertMend, or its agent inside your network',
    timing: 'On a schedule, or during an investigation',
    network: 'Read-only credentials you create; private systems through an AlertMend agent',
  },
  stream: {
    label: 'Event stream',
    title: 'Sends events to AlertMend',
    hint: 'The tool, or an AlertMend agent in your environment, sends alerts, run results or telemetry as they happen.',
    who: 'Your tool, or the AlertMend agent',
    timing: 'As alerts fire, runs finish or telemetry arrives. History before setup is not included.',
    network: 'Outbound HTTPS or gRPC from your environment; no inbound ports',
  },
  notify: {
    label: 'Notifications & actions',
    title: 'AlertMend sends to it',
    hint: 'AlertMend delivers alerts, root causes, approval requests, tickets and pull requests into the tool.',
    who: 'AlertMend, through the tool’s API',
    timing: 'When an incident, approval or fix needs to reach people',
    network: 'A token or OAuth app scoped to the channels and projects you choose',
  },
};

export const dataFlowOrder: DataFlow[] = ['read', 'stream', 'notify'];

export type Integration = {
  slug: string;
  name: string;
  /** Primary functionality; drives grouping, breadcrumbs and related integrations. */
  category: IntegrationCategory;
  /** Other functionality filters this integration should appear under. */
  alsoIn?: IntegrationCategory[];
  /** One-line summary used on the directory tile + as the detail-page lede. */
  tagline: string;
  /** Detail-page longer description (1–2 short paragraphs). */
  description: string;
  /** Concrete capabilities the AlertMend ↔ <integration> link unlocks. */
  capabilities: string[];
  /** How it connects. Drives the method filter and the detail-page "How it connects" box. */
  connection: ConnectionMethodId;
  /** Integration types: read access, event stream and/or notifications & actions. */
  dataFlow: DataFlow[];
  /** AlertMend can change something here (always through approval-gated flows). */
  acts?: boolean;
  /** Credential or access you hand over. */
  auth: string;
  /** Protocol / API the connection uses. */
  transport: string;
  /** When data moves. */
  cadence: string;
  /** AlertMend product lines this integration feeds (coverage matrix + detail page). */
  products: HomeProductId[];
  /** What AlertMend reads from it. Falls back to the connection method's summary. */
  reads?: string[];
  /** Set to badge a tile as not generally available yet. */
  status?: 'coming-soon';
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
  /** Optional hand-written "How to connect" steps; otherwise the method's steps are used. */
  setupSteps?: string[];
  /** Optional FAQ; also emitted as FAQPage structured data. */
  faqs?: { q: string; a: string }[];
};

const svgporn = (slug: string) => `https://cdn.svgporn.com/logos/${slug}.svg`;

export const integrations: Integration[] = [
  /* ---------------------------------------------------------------- */
  /* Data stack · Warehouses & databases                              */
  /* ---------------------------------------------------------------- */
  {
    slug: 'snowflake',
    name: 'Snowflake',
    category: 'Data warehouses',
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
    connection: 'warehouse-role',
    dataFlow: ['read'],
    auth: 'Read-only role (USAGE + SELECT) from a generated grant script',
    transport: 'SQL over the Snowflake driver, from AlertMend or your in-network agent',
    cadence: 'On each check’s schedule',
    products: ['dataobs', 'rca', 'finops'],
    reads: [
      'Databases, schemas, tables and columns from INFORMATION_SCHEMA',
      'Aggregate check results: row counts, null rates, latest timestamps',
      'Results of custom SQL checks you write',
      'Row samples for profiling, only when you enable it',
    ],
    logoSrc: svgporn('snowflake-icon'),
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
    slug: 'databricks',
    name: 'Databricks',
    category: 'Data warehouses',
    alsoIn: ['Orchestration'],
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
    connection: 'warehouse-role',
    dataFlow: ['read'],
    auth: 'Service principal or token with read access to Unity Catalog',
    transport: 'SQL warehouse queries and the Jobs API',
    cadence: 'On each check’s schedule, including job runs',
    products: ['dataobs', 'rca', 'finops'],
    reads: [
      'Catalogs, schemas, tables and columns',
      'Aggregate check results on Delta tables',
      'Databricks Workflows and Delta Live Tables run status',
    ],
    logoSrc: svgporn('databricks-icon'),
    iconSlug: 'databricks',
    logoTint: 'FF3621',
    domain: 'databricks.com',
  },
  {
    slug: 'bigquery',
    name: 'BigQuery',
    category: 'Data warehouses',
    tagline: 'Dataset health and slot cost signals in one incident view.',
    description:
      'AlertMend reads BigQuery metadata and job history to catch stale tables, sudden volume drops, and schema breaks before dashboards go dark. Pair with GCP cloud signals when spend drifts too.',
    capabilities: [
      'Dataset and table freshness monitors',
      'Volume and null-rate anomaly detection',
      'Schema drift alerts with column-level evidence',
      'Links into Observability when query latency spikes',
    ],
    connection: 'warehouse-role',
    dataFlow: ['read'],
    auth: 'Service account with BigQuery access',
    transport: 'BigQuery API (SQL query jobs)',
    cadence: 'On each check’s schedule',
    products: ['dataobs', 'rca'],
    reads: [
      'Datasets, tables and columns from INFORMATION_SCHEMA',
      'Aggregate check results: row counts, null rates, latest timestamps',
    ],
    logoSrc: svgporn('google-bigquery'),
    iconSlug: 'googlebigquery',
    logoTint: '669DF6',
    domain: 'cloud.google.com',
  },
  {
    slug: 'redshift',
    name: 'Redshift',
    category: 'Data warehouses',
    tagline: 'Cluster table health for Redshift and Redshift Serverless.',
    description:
      'Watch Redshift tables for freshness, row-count anomalies, and schema changes. Evidence lands in the same RCA flow as the rest of your AWS estate.',
    capabilities: [
      'Table freshness and volume monitors',
      'Schema change detection',
      'Correlated with AWS CloudWatch when useful',
      'Approval-gated runbooks for quarantine paths',
    ],
    connection: 'warehouse-role',
    dataFlow: ['read'],
    auth: 'Read-only database user',
    transport: 'SQL over the Redshift endpoint',
    cadence: 'On each check’s schedule',
    products: ['dataobs', 'rca'],
    reads: ['Schemas, tables and columns', 'Aggregate check results on the tables you monitor'],
    logoSrc: svgporn('aws-redshift'),
    iconSlug: 'amazonredshift',
    logoTint: '8C4FFF',
    domain: 'aws.amazon.com',
  },
  {
    slug: 'postgres',
    name: 'Postgres',
    category: 'Databases',
    tagline: 'OLTP and warehouse-adjacent Postgres table health.',
    description:
      'Use a read-only role to watch critical Postgres tables for freshness, row-count drift, and schema changes. Fits ETL landing tables and reporting schemas that sit next to the warehouse.',
    capabilities: [
      'Freshness and volume monitors on key tables',
      'Schema drift detection',
      'Null-rate and custom SQL metric checks',
      'Same approval loop as warehouse sources',
    ],
    connection: 'warehouse-role',
    dataFlow: ['read', 'stream'],
    auth: 'Read-only database role',
    transport: 'SQL for checks; eBPF wire spans from the node agent',
    cadence: 'On each check’s schedule; spans stream continuously',
    products: ['dataobs', 'obs', 'rca'],
    reads: [
      'Schemas, tables and columns from INFORMATION_SCHEMA',
      'Aggregate check results on the tables you monitor',
      'On the infra side: Postgres wire spans from eBPF Deep Visibility',
    ],
    logoSrc: svgporn('postgresql'),
    domain: 'postgresql.org',
  },
  {
    slug: 'oracle',
    name: 'Oracle',
    category: 'Databases',
    alsoIn: ['Data warehouses'],
    tagline: 'Policy-driven data quality checks on Oracle, read-only.',
    description:
      'Monitor Oracle tables with checks proposed from your data quality policy. A read-only agent runs inside your network, and when a check fails AlertMend links it to the Oracle ODI job that loaded the data.',
    capabilities: [
      'Checks proposed from your policy, each citing its clause',
      'Read-only agent inside your network; no inbound ports',
      'Failures linked to the Oracle ODI job and its error',
      'Alerts in Slack or Microsoft Teams with cause and impact',
    ],
    connection: 'warehouse-role',
    dataFlow: ['read'],
    auth: 'Read-only Oracle user from a generated grant script',
    transport: 'SQL over Oracle Net, through your in-network agent',
    cadence: 'On each check’s schedule',
    products: ['dataobs', 'rca'],
    reads: ['Schemas, tables and columns from the data dictionary', 'Aggregate check results on the tables you monitor'],
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
    slug: 'mysql',
    name: 'MySQL',
    category: 'Databases',
    tagline: 'Table health checks on MySQL, MariaDB and Aurora, plus database signals in RCAs.',
    description:
      'Connect a read-only MySQL user to run data quality checks on the tables your reports depend on: freshness, row counts, null rates and schema changes. On the infrastructure side, the MySQL exporter and eBPF database spans feed query latency, replication and deadlock signals into root cause analysis.',
    capabilities: [
      'Freshness, volume and null-rate checks on MySQL, MariaDB and Aurora',
      'Schema drift alerts when columns change',
      'Replication lag, deadlock and buffer pool signals in RCAs',
      'Query-time cap on every check',
    ],
    connection: 'warehouse-role',
    dataFlow: ['read', 'stream'],
    auth: 'Read-only database user',
    transport: 'SQL for checks; MySQL exporter and eBPF spans for infra',
    cadence: 'On each check’s schedule; metrics stream continuously',
    products: ['dataobs', 'obs', 'rca'],
    reads: [
      'Schemas, tables and columns from INFORMATION_SCHEMA',
      'Aggregate check results on the tables you monitor',
      'Server metrics from the MySQL exporter',
    ],
    logoSrc: svgporn('mysql-icon'),
    iconSlug: 'mysql',
    logoTint: '4479A1',
    domain: 'mysql.com',
  },

  /* ---------------------------------------------------------------- */
  /* Data stack · Pipelines & transformation                          */
  /* ---------------------------------------------------------------- */
  {
    slug: 'dbt',
    name: 'dbt',
    category: 'Transformation',
    alsoIn: ['Orchestration'],
    tagline: 'Model and test metadata as evidence in data RCAs.',
    description:
      'Ingest dbt run and test results so a failed model or broken test becomes evidence in the AlertMend RCA, not a separate silent failure in CI.',
    capabilities: [
      'dbt Cloud and Core run metadata',
      'Failed test / model as RCA evidence',
      'Lineage hints for impacted downstream tables',
      'Pairs with warehouse freshness monitors',
    ],
    connection: 'pipeline-api',
    dataFlow: ['read', 'stream'],
    auth: 'dbt Cloud service token, or an upload token for dbt Core',
    transport: 'dbt Cloud API; dbt Core posts run_results.json',
    cadence: 'After every dbt run',
    products: ['dataobs', 'rca'],
    reads: [
      'dbt Cloud: jobs, runs, model and test results through the API',
      'dbt Core: run_results.json you upload with an upload token',
    ],
    logoSrc: svgporn('dbt-icon'),
    iconSlug: 'dbt',
    logoTint: 'FF694B',
    domain: 'getdbt.com',
  },
  {
    slug: 'airflow',
    name: 'Airflow',
    category: 'Orchestration',
    tagline: 'DAG failures correlated with warehouse table health.',
    description:
      'Connect Airflow metadata so DAG and task failures land beside the tables they write. When freshness drops after a failed run, the RCA cites both signals.',
    capabilities: [
      'DAG / task failure ingestion',
      'Correlation with warehouse freshness monitors',
      'Owner and schedule context on the incident',
      'Approval-gated retry or quarantine runbooks',
    ],
    connection: 'pipeline-api',
    dataFlow: ['read'],
    auth: 'Airflow REST API user',
    transport: 'Airflow stable REST API',
    cadence: 'DAG and task runs, checked on a schedule',
    products: ['dataobs', 'rca', 'k8s'],
    reads: ['DAGs, DAG runs and task instances through the Airflow REST API', 'Task errors, owners and schedules'],
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
    slug: 'oracle-odi',
    name: 'Oracle ODI',
    category: 'ETL & data integration',
    tagline: 'Link failed data checks to the ODI load that caused them.',
    description:
      'AlertMend reads the Oracle Data Integrator repository for session and step status. When a check on a table fails, the alert names the ODI load that wrote it, with the error message, so the data team starts from the cause instead of the symptom.',
    capabilities: [
      'ODI session and step status beside your data checks',
      'Error text from the failed step on the alert',
      'Pairs with Oracle and Snowflake table checks',
      'Downstream Power BI impact on the same alert',
    ],
    connection: 'pipeline-api',
    dataFlow: ['read'],
    auth: 'Read-only access to the ODI work repository',
    transport: 'SQL against the ODI repository',
    cadence: 'Sessions, checked on a schedule',
    products: ['dataobs', 'rca'],
    reads: ['ODI repository: sessions, steps, status and error messages'],
    domain: 'oracle.com',
    docsHref: '/data-observability',
  },
  {
    slug: 'airbyte',
    name: 'Airbyte',
    category: 'ETL & data integration',
    tagline: 'Airbyte sync failures next to the tables they load.',
    description:
      'Connect Airbyte so sync jobs and their status appear alongside the checks on destination tables. A late or failed sync becomes the cited cause when freshness or volume checks fail.',
    capabilities: [
      'Sync job status and history',
      'Correlation with freshness and volume checks',
      'Failed sync named as the root cause on the alert',
      'Slack or Teams routing per connection',
    ],
    connection: 'pipeline-api',
    dataFlow: ['read'],
    auth: 'Airbyte API key',
    transport: 'Airbyte API',
    cadence: 'Sync jobs, checked on a schedule',
    products: ['dataobs', 'rca'],
    reads: ['Connections, sync jobs, status and errors'],
    iconSlug: 'airbyte',
    logoTint: '615EFF',
    domain: 'airbyte.com',
  },
  {
    slug: 'oracle-goldengate',
    name: 'Oracle GoldenGate',
    category: 'ETL & data integration',
    tagline: 'Replication health for the tables GoldenGate feeds.',
    description:
      'AlertMend reads GoldenGate process status and lag so replication stalls show up next to the tables they feed. When a replicated table goes stale, the alert names the extract or replicat that stopped.',
    capabilities: [
      'Extract and replicat status and lag',
      'Stale-table alerts tied to the stalled process',
      'Pairs with Oracle table checks',
      'Alerts in Slack or Teams',
    ],
    connection: 'pipeline-api',
    dataFlow: ['read'],
    auth: 'GoldenGate admin user with read access',
    transport: 'GoldenGate Admin REST API',
    cadence: 'Process status and lag, checked on a schedule',
    products: ['dataobs', 'rca'],
    reads: ['Extract and replicat status, lag and errors'],
    domain: 'oracle.com',
  },
  {
    slug: 'fivetran',
    name: 'Fivetran',
    category: 'ETL & data integration',
    tagline: 'Fivetran sync status beside the tables it loads.',
    description:
      'Bring Fivetran connector syncs into AlertMend so a delayed or failed sync is cited when freshness or volume checks fail on its destination tables.',
    capabilities: [
      'Connector sync status and history',
      'Freshness checks linked to the sync that loads them',
      'Root cause names the failing connector',
      'Slack or Teams alerts with downstream impact',
    ],
    connection: 'pipeline-api',
    dataFlow: ['read'],
    auth: 'Fivetran API key',
    transport: 'Fivetran REST API',
    cadence: 'Sync status, checked on a schedule',
    products: ['dataobs', 'rca'],
    reads: ['Connectors, sync runs and errors'],
    domain: 'fivetran.com',
  },
  {
    slug: 'dagster',
    name: 'Dagster',
    category: 'Orchestration',
    tagline: 'Dagster runs and asset materialisations, linked to data checks.',
    description:
      'Connect Dagster so failed runs and missed materialisations sit next to the checks on the assets they produce. The alert names the run and the step that failed.',
    capabilities: [
      'Run and asset materialisation status',
      'Failed step and error on the alert',
      'Correlation with freshness checks',
      'Owner context for routing',
    ],
    connection: 'pipeline-api',
    dataFlow: ['read'],
    auth: 'Dagster API token',
    transport: 'Dagster GraphQL API',
    cadence: 'Runs, checked on a schedule',
    products: ['dataobs', 'rca'],
    reads: ['Runs, assets, materialisations and errors'],
    domain: 'dagster.io',
  },
  {
    slug: 'prefect',
    name: 'Prefect',
    category: 'Orchestration',
    tagline: 'Prefect flow runs correlated with table health.',
    description:
      'Prefect flow and task runs become evidence for data checks. When a table goes stale after a failed or crashed flow run, the alert cites the run and its state.',
    capabilities: [
      'Flow and task run states',
      'Crashed and failed runs cited as root cause',
      'Correlation with freshness and volume checks',
      'Alerts in Slack or Teams',
    ],
    connection: 'pipeline-api',
    dataFlow: ['read'],
    auth: 'Prefect API key',
    transport: 'Prefect REST API',
    cadence: 'Flow runs, checked on a schedule',
    products: ['dataobs', 'rca'],
    reads: ['Flow runs, task runs, states and errors'],
    iconSlug: 'prefect',
    logoTint: '024DFD',
    domain: 'prefect.io',
  },
  {
    slug: 'azure-data-factory',
    name: 'Azure Data Factory',
    category: 'ETL & data integration',
    tagline: 'Azure Data Factory pipeline runs next to your data checks.',
    description:
      'Read Azure Data Factory pipeline and activity runs so a failed copy or data flow activity is linked to the checks on the tables it writes.',
    capabilities: [
      'Pipeline and activity run status',
      'Failed activity and error on the alert',
      'Correlation with freshness and volume checks',
      'Pairs with Power BI impact',
    ],
    connection: 'pipeline-api',
    dataFlow: ['read'],
    auth: 'Service principal with Data Factory reader role',
    transport: 'Azure Resource Manager API',
    cadence: 'Pipeline runs, checked on a schedule',
    products: ['dataobs', 'rca'],
    reads: ['Pipeline runs, activity runs and errors'],
    logoSrc: svgporn('microsoft-azure'),
    domain: 'azure.microsoft.com',
  },
  {
    slug: 'aws-glue',
    name: 'AWS Glue',
    category: 'ETL & data integration',
    tagline: 'AWS Glue job runs linked to the tables they write.',
    description:
      'Glue job runs and crawler results become evidence for data checks on Redshift, S3-backed tables and the rest of your AWS data estate.',
    capabilities: [
      'Job run status and errors',
      'Crawler results and schema changes',
      'Correlation with freshness and schema checks',
      'Same RCA flow as your AWS infrastructure',
    ],
    connection: 'pipeline-api',
    dataFlow: ['read'],
    auth: 'IAM credentials with Glue read access',
    transport: 'AWS Glue API',
    cadence: 'Job runs, checked on a schedule',
    products: ['dataobs', 'rca'],
    reads: ['Jobs, job runs, crawlers and errors'],
    logoSrc: svgporn('aws-glue'),
    domain: 'aws.amazon.com',
  },
  {
    slug: 'informatica',
    name: 'Informatica',
    category: 'ETL & data integration',
    tagline: 'Informatica workflow failures cited in data RCAs.',
    description:
      'Read Informatica workflow and session runs so a failed mapping is named as the cause when checks fail on the tables it loads.',
    capabilities: [
      'Workflow and session run status',
      'Failed mapping and error on the alert',
      'Correlation with table checks',
      'Built for enterprise data offices',
    ],
    connection: 'pipeline-api',
    dataFlow: ['read'],
    auth: 'User with read access to run history',
    transport: 'Informatica REST API',
    cadence: 'Workflow runs, checked on a schedule',
    products: ['dataobs', 'rca'],
    reads: ['Workflow and session runs, status and errors'],
    domain: 'informatica.com',
  },
  {
    slug: 'talend',
    name: 'Talend',
    category: 'ETL & data integration',
    tagline: 'Talend job runs beside the table checks they affect.',
    description:
      'Talend job executions become evidence for data checks, so a failed or late job is cited when the tables it loads go stale or short.',
    capabilities: [
      'Job execution status and history',
      'Failed job named on the alert',
      'Correlation with freshness and volume checks',
      'Alerts in Slack or Teams',
    ],
    connection: 'pipeline-api',
    dataFlow: ['read'],
    auth: 'Talend Cloud API token',
    transport: 'Talend Cloud API',
    cadence: 'Job executions, checked on a schedule',
    products: ['dataobs', 'rca'],
    reads: ['Job executions, status and errors'],
    iconSlug: 'talend',
    logoTint: 'FF6D70',
    domain: 'talend.com',
  },
  {
    slug: 'matillion',
    name: 'Matillion',
    category: 'ETL & data integration',
    alsoIn: ['Transformation'],
    tagline: 'Matillion jobs linked to warehouse table health.',
    description:
      'Read Matillion job runs so a failed orchestration or transformation job is linked to the checks on the warehouse tables it builds.',
    capabilities: [
      'Job run status and errors',
      'Correlation with Snowflake, Databricks and Redshift checks',
      'Failed component named on the alert',
      'Alerts in Slack or Teams',
    ],
    connection: 'pipeline-api',
    dataFlow: ['read'],
    auth: 'Matillion API user',
    transport: 'Matillion API',
    cadence: 'Job runs, checked on a schedule',
    products: ['dataobs', 'rca'],
    reads: ['Job runs, components, status and errors'],
    iconSlug: 'matillion',
    logoTint: '19E57F',
    domain: 'matillion.com',
  },
  {
    slug: 'ssis',
    name: 'SQL Server Integration Services',
    category: 'ETL & data integration',
    tagline: 'SSIS package runs linked to the tables they load.',
    description:
      'Read SSIS package executions from the SSIS catalog so a failed package is cited when checks fail on its destination tables.',
    capabilities: [
      'Package execution status and messages',
      'Failed package named as the root cause',
      'Correlation with table checks',
      'Alerts in Slack or Teams',
    ],
    connection: 'pipeline-api',
    dataFlow: ['read'],
    auth: 'Read-only access to SSISDB',
    transport: 'SQL against the SSIS catalog',
    cadence: 'Package executions, checked on a schedule',
    products: ['dataobs', 'rca'],
    reads: ['Package executions, status and messages from the SSIS catalog'],
    domain: 'microsoft.com',
  },

  /* ---------------------------------------------------------------- */
  /* Data stack · BI & lineage                                        */
  /* ---------------------------------------------------------------- */
  {
    slug: 'power-bi',
    name: 'Power BI',
    category: 'BI & analytics',
    tagline: 'See which reports bad data affects, before anyone opens them.',
    description:
      'Connect Power BI so every failed data check shows the reports that read the affected table. Report owners hear about bad numbers before the morning meeting, not from a business user.',
    capabilities: [
      'Affected reports listed on every failed check',
      'Report impact included in Slack and Teams alerts',
      'Pairs with Snowflake and Oracle checks',
      'Lineage from table to report',
    ],
    connection: 'pipeline-api',
    dataFlow: ['read'],
    auth: 'Microsoft Entra service principal with read access to workspaces',
    transport: 'Power BI REST API',
    cadence: 'Lineage refreshed on a schedule',
    products: ['dataobs'],
    reads: ['Workspaces, datasets and reports, and the tables each one reads (via a service principal)'],
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
  {
    slug: 'oracle-analytics',
    name: 'Oracle Analytics',
    category: 'BI & analytics',
    tagline: 'See which Oracle Analytics content reads a failing table.',
    description:
      'Connect Oracle Analytics so failed checks list the workbooks and datasets that depend on the affected table, the same way Power BI impact works.',
    capabilities: [
      'Dataset and workbook lineage to source tables',
      'Impact listed on every failed check',
      'Owners told before the numbers are used',
      'Pairs with Oracle and ODI',
    ],
    connection: 'pipeline-api',
    dataFlow: ['read'],
    auth: 'Read-only service account',
    transport: 'Oracle Analytics REST API',
    cadence: 'Lineage refreshed on a schedule',
    products: ['dataobs'],
    reads: ['Datasets, workbooks and their source tables'],
    domain: 'oracle.com',
  },
  {
    slug: 'oracle-bi-publisher',
    name: 'Oracle BI Publisher',
    category: 'BI & analytics',
    tagline: 'Report job failures and the data behind them.',
    description:
      'AlertMend reads BI Publisher scheduled report jobs, so a failed or empty report run lands beside the data checks on the tables it queries.',
    capabilities: [
      'Scheduled report job status and history',
      'Failed runs correlated with table checks',
      'Report owners alerted with the cause',
      'Pairs with Oracle sources',
    ],
    connection: 'pipeline-api',
    dataFlow: ['read'],
    auth: 'Read-only BI Publisher user',
    transport: 'BI Publisher web services',
    cadence: 'Report jobs, checked on a schedule',
    products: ['dataobs', 'rca'],
    reads: ['Report jobs, schedules, status and errors'],
    domain: 'oracle.com',
  },
  {
    slug: 'tableau',
    name: 'Tableau',
    category: 'BI & analytics',
    tagline: 'Tableau dashboards affected by bad data, listed on the alert.',
    description:
      'Connect Tableau so each failed check lists the workbooks and data sources that read the affected table, and their owners hear first.',
    capabilities: [
      'Workbook and data source lineage to tables',
      'Affected dashboards on every failed check',
      'Owners included in routing',
      'Pairs with any monitored warehouse',
    ],
    connection: 'pipeline-api',
    dataFlow: ['read'],
    auth: 'Personal access token',
    transport: 'Tableau Metadata API',
    cadence: 'Lineage refreshed on a schedule',
    products: ['dataobs'],
    reads: ['Workbooks, data sources and their upstream tables'],
    logoSrc: svgporn('tableau-icon'),
    domain: 'tableau.com',
  },
  {
    slug: 'looker',
    name: 'Looker',
    category: 'BI & analytics',
    tagline: 'Looker explores and dashboards affected by a failed check.',
    description:
      'Read Looker models, explores and dashboards so a failing table shows its downstream Looker content and owners on the alert.',
    capabilities: [
      'Model, explore and dashboard lineage',
      'Affected content on every failed check',
      'Owners included in routing',
      'Pairs with BigQuery and Snowflake checks',
    ],
    connection: 'pipeline-api',
    dataFlow: ['read'],
    auth: 'API client ID and secret',
    transport: 'Looker API',
    cadence: 'Lineage refreshed on a schedule',
    products: ['dataobs'],
    reads: ['Models, explores, dashboards and their source tables'],
    logoSrc: svgporn('looker-icon'),
    domain: 'looker.com',
  },
  {
    slug: 'metabase',
    name: 'Metabase',
    category: 'BI & analytics',
    tagline: 'Metabase questions and dashboards that read a failing table.',
    description:
      'Connect Metabase so the questions and dashboards built on a failing table are listed on the alert, before someone screenshots the wrong number.',
    capabilities: [
      'Question and dashboard lineage to tables',
      'Affected content on every failed check',
      'Collection owners in routing',
      'Pairs with Postgres and MySQL checks',
    ],
    connection: 'pipeline-api',
    dataFlow: ['read'],
    auth: 'Metabase API key',
    transport: 'Metabase API',
    cadence: 'Lineage refreshed on a schedule',
    products: ['dataobs'],
    reads: ['Questions, dashboards and their source tables'],
    logoSrc: svgporn('metabase'),
    domain: 'metabase.com',
  },

  /* ---------------------------------------------------------------- */
  /* Infrastructure · Kubernetes & cloud                              */
  /* ---------------------------------------------------------------- */
  {
    slug: 'kubernetes',
    name: 'Kubernetes',
    category: 'Kubernetes & containers',
    tagline: 'Cluster-native incident triage, runbooks, and FinOps.',
    description:
      'AlertMend connects to any Kubernetes cluster (EKS, GKE, AKS, on-prem) over a read-only kubeconfig and a lightweight in-cluster agent. We watch pod events, CrashLoopBackOff/OOMKilled signals, scheduling failures, HPA lag, and node pressure, then page a structured RCA before your synthetic checks turn red.',
    capabilities: [
      '3,000+ pods on one dashboard with namespace/workload/owner roll-ups',
      'CrashLoopBackOff, OOMKilled, evicted, and scheduling-stall RCAs',
      'One-click YAML right-sizing apply for requests/limits',
      'Cluster-overview View RCA links straight from any pod',
    ],
    connection: 'cluster-agent',
    dataFlow: ['stream'],
    acts: true,
    auth: 'Agent ID and key in Helm values; in-cluster service account',
    transport: 'Outbound gRPC over TLS from the Helm agent',
    cadence: 'Continuous streaming',
    products: ['k8s', 'obs', 'logs', 'rca', 'fix', 'finops'],
    reads: [
      'Pods, deployments, nodes, PVCs, jobs and events',
      'Workload YAML and environment, as RCA evidence',
      'Pod logs and resource metrics',
      'With Deep Visibility: L4/L7 traffic, DB wire spans and CPU profiles',
    ],
    logoSrc: svgporn('kubernetes'),
    domain: 'kubernetes.io',
  },
  {
    slug: 'aws',
    name: 'AWS',
    category: 'Cloud providers',
    tagline: 'Connect EC2, ECS, RDS, ELB and Lambda. Observe and remediate.',
    description:
      'Register an AlertMend agent in your AWS account to watch CloudWatch metrics, ECS task health, EC2 status checks, and RDS performance signals. AlertMend can restart stuck ECS tasks, cordon unhealthy nodes, and surface FinOps right-sizing across EC2, RDS, ELB, and ECS, all with audited approvals.',
    capabilities: [
      'EC2 / ECS / RDS / ELB monitoring with CloudWatch ingestion',
      'Per-resource $/mo savings recommendations',
      'Auto-restart for stuck ECS tasks (auto-approval optional)',
      'Idle-instance cleanup with one-click Apply',
    ],
    connection: 'cloud-account',
    dataFlow: ['read'],
    acts: true,
    auth: 'IAM access keys, read-only for inventory and cost',
    transport: 'AWS APIs, called by AlertMend',
    cadence: 'Scheduled scans',
    products: ['finops', 'obs', 'rca', 'fix'],
    reads: [
      'EC2, ECS, RDS and load balancer inventory and utilisation',
      'Unused Elastic IPs and load balancers',
      'CloudWatch metrics through the collector',
    ],
    logoSrc: svgporn('aws'),
    domain: 'aws.amazon.com',
  },
  {
    slug: 'google-cloud',
    name: 'Google Cloud',
    category: 'Cloud providers',
    tagline: 'GKE, GCE, Cloud Run, BigQuery: full-stack visibility.',
    description:
      'AlertMend integrates with GCP via service-account credentials and GKE workload identity. We watch GKE pods, GCE VM groups, Cloud Run revisions, and budget alerts, and run remediations through cluster RBAC or VM-level SSH.',
    capabilities: [
      'GKE workload health + 50% cost reduction patterns from WareFlex',
      'GCE VM auto-recovery for stuck workloads',
      'Cloud Run revision rollback when error budget burns',
      'BigQuery slot and storage cost drift detection',
    ],
    connection: 'cloud-account',
    dataFlow: ['read', 'stream'],
    acts: true,
    auth: 'Service account; GKE and GCE through AlertMend agents',
    transport: 'Google Cloud APIs; AlertMend agents for GKE and GCE',
    cadence: 'Scheduled scans; agents stream continuously',
    products: ['k8s', 'finops', 'rca', 'fix'],
    reads: ['GKE workloads through the Kubernetes agent', 'GCE VM health through the host agent or SSH', 'Budget and cost signals'],
    logoSrc: svgporn('google-cloud'),
    domain: 'cloud.google.com',
  },
  {
    slug: 'azure',
    name: 'Azure',
    category: 'Cloud providers',
    tagline: 'AKS, VMSS, App Service, and Azure Monitor sources.',
    description:
      'AlertMend reads from Azure Monitor / Log Analytics and runs remediations through AKS RBAC and ARM. Health signals from VMSS, App Service plans, and AKS nodepools land in the same incident view as the rest of your fleet.',
    capabilities: [
      'AKS nodepool incidents with structured RCAs',
      'VMSS auto-heal with audited approvals',
      'App Service slot rollback on failed deploys',
      'Azure Monitor alert enrichment with live evidence',
    ],
    connection: 'cloud-account',
    dataFlow: ['read', 'stream'],
    acts: true,
    auth: 'Service principal; AKS through the Kubernetes agent',
    transport: 'Azure Monitor and Resource Manager APIs; AlertMend agent for AKS',
    cadence: 'Scheduled scans; agent streams continuously',
    products: ['k8s', 'rca', 'fix'],
    reads: ['AKS workloads through the Kubernetes agent', 'Azure Monitor and Log Analytics signals', 'VMSS and App Service health'],
    logoSrc: svgporn('microsoft-azure'),
    domain: 'azure.microsoft.com',
  },
  {
    slug: 'linux-vms',
    name: 'Linux VMs',
    category: 'Hosts & VMs',
    tagline: 'EC2, GCE and on-prem VMs: metrics, logs and approved fixes, with an agent or over SSH.',
    description:
      'Run a lightweight host agent (node-exporter and cAdvisor in Docker), or go agentless over SSH. AlertMend collects host and container metrics, tails the logs you choose, and runs approved runbook steps across a fleet: restart a service, clear a disk, fan a command out to every matching VM.',
    capabilities: [
      'Host agent or agentless SSH, per VM',
      'CPU, memory, disk and container metrics',
      'Fleet fan-out for approved runbook steps',
      'AIVOS: 90%+ of recurring VM failures auto-remediated',
    ],
    connection: 'host-agent',
    dataFlow: ['stream', 'read'],
    acts: true,
    auth: 'Host agent token, or an SSH key for agentless mode',
    transport: 'Host agent over an outbound connection, or agentless over SSH',
    cadence: 'Continuous with the agent; every poll over SSH',
    products: ['obs', 'logs', 'rca', 'fix'],
    reads: ['Host and container metrics', 'Logs you choose to tail', 'Output of approved runbook commands'],
    logoSrc: svgporn('linux-tux'),
    iconSlug: 'linux',
    logoTint: 'FCC624',
    domain: 'kernel.org',
    docsHref: '/documentation/alertmend-vm-actions',
  },

  /* ---------------------------------------------------------------- */
  /* Infrastructure · Metrics, logs & alerts                          */
  /* ---------------------------------------------------------------- */
  {
    slug: 'prometheus',
    name: 'Prometheus',
    category: 'Monitoring & alerting',
    tagline: 'Ingest alerts and PromQL series for evidence collection.',
    description:
      'Point Alertmanager at AlertMend over webhook, and connect any Prometheus endpoint for read-only PromQL queries. AlertMend uses series like `kube_pod_status_phase`, `node_memory_MemAvailable_bytes`, and `nvidia_smi_*` as evidence in every RCA.',
    capabilities: [
      'Alertmanager → AlertMend webhook ingestion',
      'PromQL queries for live RCA evidence',
      'Recording-rule-friendly: works with thanos/cortex',
      'GPU exporter (DCGM / nvidia_smi) supported out of the box',
    ],
    connection: 'signal-ingest',
    dataFlow: ['stream', 'read'],
    auth: 'Webhook URL and bearer token; PromQL through the cluster agent',
    transport: 'Alertmanager webhook; PromQL queries via the agent',
    cadence: 'Real time on alert; queries during an investigation',
    products: ['obs', 'rca', 'fix', 'mlops'],
    reads: ['Alertmanager alert payloads', 'PromQL series during an investigation, queried through the in-cluster agent'],
    logoSrc: svgporn('prometheus'),
    domain: 'prometheus.io',
  },
  {
    slug: 'alertmanager',
    name: 'Alertmanager',
    category: 'Monitoring & alerting',
    tagline: 'Every Alertmanager alert, triaged with a root cause in seconds.',
    description:
      'Add AlertMend as an Alertmanager webhook receiver. Each alert can start an AI RCA or trigger a remediation flow, and filter and routing rules decide who hears about it and where.',
    capabilities: [
      'Webhook receiver per workspace',
      'Alerts can trigger AI RCA or a remediation flow',
      'Filter and routing rules before anyone is paged',
      'Runs alongside your existing receivers',
    ],
    connection: 'signal-ingest',
    dataFlow: ['stream'],
    auth: 'Webhook URL and bearer token',
    transport: 'Alertmanager webhook receiver over HTTPS',
    cadence: 'Real time, as alerts fire',
    products: ['obs', 'rca', 'fix', 'oncall'],
    reads: ['Alert payloads: labels, annotations, status and timing'],
    logoSrc: svgporn('prometheus'),
    domain: 'prometheus.io',
    setupSteps: [
      'Copy your workspace webhook URL and API key from AlertMend integrations settings.',
      'Add a webhook receiver to your Alertmanager config that points at the URL, sending the key as a bearer token.',
      'Route the alerts you want triaged to that receiver. Your other receivers keep working.',
      'Fire a test alert. AlertMend opens an incident and posts the root cause to Slack or Teams.',
    ],
  },
  {
    slug: 'datadog',
    name: 'Datadog',
    category: 'Monitoring & alerting',
    alsoIn: ['Logs & tracing'],
    tagline: 'Triage Datadog monitors with live RCAs in 15 seconds.',
    description:
      'Wire any Datadog monitor through an AlertMend webhook to enrich the alert with logs, traces, and recent deploys before paging anyone. AlertMend authenticates back into Datadog with a read-only API key for evidence collection.',
    capabilities: [
      'Datadog Monitor → AlertMend webhook with full payload',
      'Read-only logs/metrics queries from Datadog for evidence',
      'Polymer Search shipped MTTR 45m → <5m on this exact path',
      'Bidirectional comments on the Datadog incident',
    ],
    connection: 'signal-ingest',
    dataFlow: ['stream', 'read'],
    auth: 'Webhook URL; Datadog API key and application key',
    transport: 'Datadog webhook; Datadog API for logs and monitors',
    cadence: 'Real time on alert; queries during an investigation',
    products: ['obs', 'logs', 'rca', 'fix'],
    reads: ['Monitor webhook payloads', 'Logs and triggered monitors, through an API key and application key'],
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
    slug: 'grafana',
    name: 'Grafana',
    category: 'Monitoring & alerting',
    tagline: 'Embed AlertMend RCAs alongside your dashboards.',
    description:
      'AlertMend ships a panel and a Slack-style RCA card you can drop into any Grafana dashboard. Linked RCAs become a click away from the panels your team already watches, so the on-call investigation starts from the chart.',
    capabilities: [
      'AlertMend panel plugin for Grafana 9+',
      'Deep links from any panel into an AlertMend RCA',
      'Synthetic check status and AlertMend incident overlay',
      'Single SSO with the rest of your Grafana org',
    ],
    connection: 'signal-ingest',
    dataFlow: ['stream'],
    auth: 'Webhook contact point URL',
    transport: 'Grafana alerting webhook',
    cadence: 'Real time, as alerts fire',
    products: ['obs', 'rca'],
    reads: ['Grafana alert notifications sent to your webhook URL'],
    logoSrc: svgporn('grafana'),
    logoTint: 'F46800',
    domain: 'grafana.com',
  },
  {
    slug: 'victoria-metrics',
    name: 'Victoria Metrics',
    category: 'Monitoring & alerting',
    tagline: 'High-cardinality metrics source for AlertMend RCAs.',
    description:
      'AlertMend talks to Victoria Metrics over the Prometheus HTTP API and ingests vmalert webhooks. Great fit for teams that have outgrown vanilla Prometheus and want fewer dropped series during peak load.',
    capabilities: [
      'vmalert → AlertMend webhook ingestion',
      'High-cardinality friendly evidence queries',
      'Works with vmagent remote-write topologies',
      'Compatible with Grafana Mimir / cortex deployments',
    ],
    connection: 'signal-ingest',
    dataFlow: ['stream', 'read'],
    auth: 'Webhook URL; Prometheus API endpoint',
    transport: 'vmalert webhook; Prometheus HTTP API',
    cadence: 'Real time on alert; queries during an investigation',
    products: ['obs', 'rca'],
    reads: ['vmalert alert payloads', 'Series queried over the Prometheus HTTP API during an investigation'],
    iconSlug: 'victoriametrics',
    logoTint: 'BB42BC',
    domain: 'victoriametrics.com',
  },
  {
    slug: 'cloudwatch',
    name: 'Amazon CloudWatch',
    category: 'Monitoring & alerting',
    alsoIn: ['Cloud providers'],
    tagline: 'CloudWatch metrics for EC2, RDS, ELB and more, as RCA evidence.',
    description:
      'Deploy the CloudWatch collector with Helm or Docker, using an IAM role on the host or access keys. It reads the CloudWatch metrics you choose and streams them to AlertMend, where they feed alerting and become evidence in root cause analysis.',
    capabilities: [
      'Collector via Helm or Docker',
      'IAM role on the host, or access keys',
      'Metric namespaces you choose, such as EC2, RDS and ELB',
      'Same alerting and RCA flow as Prometheus metrics',
    ],
    connection: 'cloud-account',
    dataFlow: ['read'],
    auth: 'IAM role on the collector host, or access keys',
    transport: 'Collector reads CloudWatch and streams to AlertMend over gRPC',
    cadence: 'Every collection interval',
    products: ['obs', 'rca', 'finops'],
    reads: ['CloudWatch metrics for the namespaces and resources you select'],
    logoSrc: svgporn('aws-cloudwatch'),
    domain: 'aws.amazon.com',
  },
  {
    slug: 'opentelemetry',
    name: 'OpenTelemetry',
    category: 'Logs & tracing',
    alsoIn: ['Monitoring & alerting'],
    tagline: 'Send OTLP traces, metrics and logs to AlertMend.',
    description:
      'The AlertMend observability collector is an OpenTelemetry Collector, bundled in the Helm chart or run in Docker on VMs. Point existing OTLP exporters at it, or use auto-instrumentation for Node.js and Python, and traces, metrics and logs land in the trace explorer and in RCA evidence.',
    capabilities: [
      'OTLP to the collector over gRPC or HTTP',
      'Auto-instrumentation for Node.js and Python',
      'Sampling and retention controls',
      'Traces correlated with logs in every RCA',
    ],
    connection: 'signal-ingest',
    dataFlow: ['stream'],
    auth: 'Ingest token',
    transport: 'OTLP over gRPC or HTTP to the collector',
    cadence: 'Continuous streaming',
    products: ['obs', 'logs', 'rca'],
    reads: ['The OTLP traces, metrics and logs you send'],
    logoSrc: svgporn('opentelemetry-icon'),
    domain: 'opentelemetry.io',
  },
  {
    slug: 'custom-webhooks',
    name: 'Webhooks & REST API',
    category: 'Webhooks & API',
    tagline: 'Connect anything that can send or receive JSON.',
    description:
      'Any tool that can POST JSON can start an AlertMend investigation or remediation flow through your workspace webhook URL, authenticated with an API key or bearer token. In the other direction, a REST API step lets a runbook call your own services, homegrown tools or internal APIs.',
    capabilities: [
      'Inbound webhook per workspace, with key or bearer auth',
      'Payloads can trigger RCA or a remediation flow',
      'REST API step inside runbooks for outbound calls',
      'Covers tools without a native integration',
    ],
    connection: 'signal-ingest',
    dataFlow: ['stream', 'notify'],
    acts: true,
    auth: 'Webhook URL with an API key or bearer token',
    transport: 'HTTPS JSON in; REST API step out',
    cadence: 'Real time',
    products: ['rca', 'fix', 'oncall'],
    reads: ['The JSON payloads you send'],
    iconSlug: 'json',
    logoTint: '000000',
    domain: 'alertmend.io',
  },

  /* ---------------------------------------------------------------- */
  /* Infrastructure · Services & middleware                           */
  /* ---------------------------------------------------------------- */
  {
    slug: 'elasticsearch',
    name: 'Elasticsearch',
    category: 'Databases',
    alsoIn: ['Logs & tracing'],
    tagline: 'Heap, shard and cluster health signals in every Elasticsearch RCA.',
    description:
      'The Elasticsearch exporter collects cluster, node and index metrics. AlertMend knows Elasticsearch failure modes, such as heap pressure and unassigned shards, and cites them as evidence when search latency or indexing breaks.',
    capabilities: [
      'Cluster, node and index metrics via exporter',
      'Heap pressure and shard allocation in RCAs',
      'Runs on Kubernetes or VMs',
      'Alert rules on any collected metric',
    ],
    connection: 'host-agent',
    dataFlow: ['stream'],
    auth: 'Exporter credentials with cluster monitor access',
    transport: 'Exporter on the host agent, sent over an outbound connection',
    cadence: 'Every scrape interval',
    products: ['obs', 'rca'],
    reads: ['Cluster, node and index stats'],
    logoSrc: svgporn('elasticsearch'),
    domain: 'elastic.co',
  },
  {
    slug: 'mongodb',
    name: 'MongoDB',
    category: 'Databases',
    tagline: 'MongoDB query spans without an SDK, plus replica health in RCAs.',
    description:
      'Deep Visibility (eBPF) on the AlertMend node agent decodes MongoDB wire traffic, so query spans and latency appear without changing application code. RCAs understand replica lag, oplog window and election storms.',
    capabilities: [
      'Query spans from the wire protocol, no SDK',
      'Replica lag, oplog and election signals in RCAs',
      'Slow queries linked to the calling service',
      'Works on any node running the agent',
    ],
    connection: 'cluster-agent',
    dataFlow: ['stream'],
    auth: 'None: the node agent sees traffic on the wire',
    transport: 'eBPF wire-protocol decoding on the node agent',
    cadence: 'Continuous',
    products: ['obs', 'rca'],
    reads: ['MongoDB wire-protocol spans: operation and latency'],
    logoSrc: svgporn('mongodb-icon'),
    domain: 'mongodb.com',
  },
  {
    slug: 'redis',
    name: 'Redis',
    category: 'Caches & message queues',
    tagline: 'Redis command spans and eviction signals, no client changes.',
    description:
      'eBPF wire decoding on the node agent turns Redis traffic into spans, linked to the services that call it. RCAs recognise eviction, memory pressure and AOF/RDB persistence issues.',
    capabilities: [
      'Command spans from the wire protocol, no SDK',
      'Eviction and memory pressure in RCAs',
      'AOF and RDB persistence issues recognised',
      'Latency linked to calling services',
    ],
    connection: 'cluster-agent',
    dataFlow: ['stream'],
    auth: 'None: the node agent sees traffic on the wire',
    transport: 'eBPF wire-protocol decoding on the node agent',
    cadence: 'Continuous',
    products: ['obs', 'rca'],
    reads: ['Redis wire-protocol spans: command and latency'],
    logoSrc: svgporn('redis'),
    domain: 'redis.io',
  },
  {
    slug: 'kafka',
    name: 'Kafka',
    category: 'Caches & message queues',
    tagline: 'Consumer lag, ISR shrink and partition skew, explained.',
    description:
      'AlertMend’s root cause analysis knows Kafka failure modes: consumer lag, ISR shrink and partition skew. Send alerts on your Kafka metrics to AlertMend and each one arrives with the likely cause and the services affected.',
    capabilities: [
      'Consumer lag and ISR shrink in RCAs',
      'Partition skew detection',
      'Affected producers and consumers on the incident',
      'Works with your existing Kafka exporters',
    ],
    connection: 'signal-ingest',
    dataFlow: ['stream', 'read'],
    auth: 'Webhook URL for alerts; metrics from your exporters',
    transport: 'Alert webhook; metrics via your Prometheus',
    cadence: 'Real time on alert',
    products: ['obs', 'rca', 'fix'],
    reads: ['Broker and consumer metrics from your exporters'],
    logoSrc: svgporn('kafka-icon'),
    iconSlug: 'apachekafka',
    logoTint: '231F20',
    domain: 'kafka.apache.org',
  },
  {
    slug: 'rabbitmq',
    name: 'RabbitMQ',
    category: 'Caches & message queues',
    tagline: 'Queue depth and unacked messages, with the cause.',
    description:
      'Alerts on RabbitMQ queue depth, unacked messages and consumer counts arrive with a root cause: a stuck consumer, a slow downstream service or a publisher spike.',
    capabilities: [
      'Queue depth and unacked messages in RCAs',
      'Stuck consumers identified',
      'Runbooks to restart consumers, with approval',
      'Works with the RabbitMQ Prometheus plugin',
    ],
    connection: 'signal-ingest',
    dataFlow: ['stream', 'read'],
    auth: 'Webhook URL for alerts; metrics from the Prometheus plugin',
    transport: 'Alert webhook; metrics via your Prometheus',
    cadence: 'Real time on alert',
    products: ['obs', 'rca', 'fix'],
    reads: ['Queue, consumer and node metrics from your exporters'],
    logoSrc: svgporn('rabbitmq-icon'),
    domain: 'rabbitmq.com',
  },
  {
    slug: 'cassandra',
    name: 'Cassandra',
    category: 'Databases',
    tagline: 'Compaction and tombstone signals for Cassandra incidents.',
    description:
      'Cassandra latency alerts arrive with Cassandra-specific causes, such as compaction backlog or tombstone-heavy reads, instead of a generic CPU chart.',
    capabilities: [
      'Compaction backlog in RCAs',
      'Tombstone-heavy reads identified',
      'Node and keyspace context on the incident',
      'Works with your existing exporters',
    ],
    connection: 'signal-ingest',
    dataFlow: ['stream', 'read'],
    auth: 'Webhook URL for alerts; metrics from your exporters',
    transport: 'Alert webhook; metrics via your Prometheus',
    cadence: 'Real time on alert',
    products: ['obs', 'rca'],
    reads: ['Node, keyspace and table metrics from your exporters'],
    iconSlug: 'apachecassandra',
    logoTint: '1287B1',
    domain: 'cassandra.apache.org',
  },
  {
    slug: 'kong',
    name: 'Kong',
    category: 'API gateways',
    tagline: 'Kong gateway latency, status codes and upstream health.',
    description:
      'The Kong exporter collects gateway latency, response codes and upstream health. When an API slows down or starts returning 5xx, the RCA shows whether the gateway or the upstream service is at fault.',
    capabilities: [
      'Gateway latency and status codes',
      'Upstream health per service',
      '5xx spikes traced to the upstream at fault',
      'Runs on Kubernetes or VMs',
    ],
    connection: 'host-agent',
    dataFlow: ['stream'],
    auth: 'Access to Kong’s status and metrics endpoint',
    transport: 'Exporter on the host agent, sent over an outbound connection',
    cadence: 'Every scrape interval',
    products: ['obs', 'rca'],
    reads: ['Gateway metrics: requests, latency, status codes, upstream health'],
    logoSrc: svgporn('kong-icon'),
    domain: 'konghq.com',
  },

  /* ---------------------------------------------------------------- */
  /* Infrastructure · GPU & MLOps                                     */
  /* ---------------------------------------------------------------- */
  {
    slug: 'nvidia-gpu',
    name: 'NVIDIA GPUs',
    category: 'GPU & ML',
    tagline: 'Per-GPU utilisation, MIG slices, ECC and thermal signals.',
    description:
      'AlertMend collects NVIDIA GPU metrics (utilisation, memory, MIG slices, ECC errors, temperature) from GPU nodes. Idle GPUs show up in FinOps, and CUDA OOM, thermal throttling and ECC errors are cited in RCAs.',
    capabilities: [
      'Per-GPU and per-MIG-slice utilisation',
      'ECC, thermal and CUDA OOM evidence in RCAs',
      'Idle GPU detection for FinOps',
      'DCGM exporter metrics supported',
    ],
    connection: 'cluster-agent',
    dataFlow: ['stream'],
    auth: 'Covered by the Kubernetes agent',
    transport: 'GPU metrics collected on GPU nodes, streamed outbound',
    cadence: 'Continuous',
    products: ['mlops', 'finops', 'rca'],
    reads: ['GPU utilisation, memory, temperature and ECC counters'],
    iconSlug: 'nvidia',
    logoTint: '76B900',
    domain: 'nvidia.com',
  },
  {
    slug: 'pytorch',
    name: 'PyTorch',
    category: 'GPU & ML',
    tagline: 'NCCL timeouts, NaN loss and dataloader stalls in DDP training.',
    description:
      'For distributed PyTorch training, AlertMend watches jobs for NCCL timeouts, NaN loss and dataloader stalls, and ties each one to the node, GPU or network issue underneath.',
    capabilities: [
      'NCCL timeout detection',
      'NaN loss and dataloader stall signals',
      'Training failures tied to GPU or node issues',
      'Alerts before a run burns a night of GPU time',
    ],
    connection: 'cluster-agent',
    dataFlow: ['stream'],
    auth: 'Covered by the Kubernetes agent',
    transport: 'Training job logs and metrics through the agent',
    cadence: 'Continuous',
    products: ['mlops', 'rca'],
    reads: ['Training job logs, metrics and pod state'],
    logoSrc: svgporn('pytorch-icon'),
    domain: 'pytorch.org',
  },
  {
    slug: 'ray',
    name: 'Ray',
    category: 'GPU & ML',
    tagline: 'Ray cluster and job health for training and serving.',
    description:
      'Ray jobs, actors and nodes appear next to the Kubernetes and GPU signals underneath them, so a failed training or serving job comes with its infrastructure cause.',
    capabilities: [
      'Job and actor failure signals',
      'Node and GPU context on every incident',
      'Works with KubeRay on Kubernetes',
      'Same RCA flow as the rest of the cluster',
    ],
    connection: 'cluster-agent',
    dataFlow: ['stream'],
    auth: 'Covered by the Kubernetes agent',
    transport: 'Ray job and node state through the agent',
    cadence: 'Continuous',
    products: ['mlops', 'rca'],
    reads: ['Ray job, actor and node state from your cluster'],
    iconSlug: 'ray',
    logoTint: '028CF0',
    domain: 'ray.io',
  },
  {
    slug: 'kubeflow',
    name: 'Kubeflow',
    category: 'GPU & ML',
    alsoIn: ['Orchestration', 'Kubernetes & containers'],
    tagline: 'Kubeflow pipelines and training jobs on the same incident view as the cluster.',
    description:
      'Kubeflow pipeline runs and training job pods are watched like any other workload, so a stuck step or failed trainer shows its cause: scheduling, GPU, image or OOM.',
    capabilities: [
      'Pipeline step and training job health',
      'Scheduling stalls and GPU contention in RCAs',
      'OOM and image pull failures caught by health policies',
      'Same remediation flows as other workloads',
    ],
    connection: 'cluster-agent',
    dataFlow: ['stream'],
    acts: true,
    auth: 'Covered by the Kubernetes agent',
    transport: 'Pipeline and training pods through the agent',
    cadence: 'Continuous',
    products: ['mlops', 'k8s', 'rca'],
    reads: ['Pipeline runs, training job pods and events'],
    domain: 'kubeflow.org',
  },
  {
    slug: 'mlflow',
    name: 'MLflow',
    category: 'GPU & ML',
    tagline: 'MLflow runs and metrics as context for training incidents.',
    description:
      'Read MLflow experiments and runs so a training incident shows which run, which parameters and which metrics went wrong, next to the GPU and node evidence.',
    capabilities: [
      'Run and experiment context on incidents',
      'Logged metrics as RCA evidence',
      'Pairs with PyTorch and GPU signals',
      'Read-only access to the tracking server',
    ],
    connection: 'pipeline-api',
    dataFlow: ['read'],
    auth: 'Tracking server token',
    transport: 'MLflow REST API',
    cadence: 'During an investigation',
    products: ['mlops', 'rca'],
    reads: ['Experiments, runs, parameters and logged metrics'],
    iconSlug: 'mlflow',
    logoTint: '0194E2',
    domain: 'mlflow.org',
  },
  {
    slug: 'vllm',
    name: 'vLLM',
    category: 'GPU & ML',
    tagline: 'vLLM inference health: p99 drift, KV-cache pressure and batch starvation.',
    description:
      'AlertMend reads vLLM serving metrics and recognises inference failure modes: p99 latency drift, KV-cache pressure and batch starvation. Each one is tied back to the GPU and pod underneath.',
    capabilities: [
      'p99 latency drift detection',
      'KV-cache pressure and queueing signals',
      'Batch starvation identified',
      'GPU and pod context on every incident',
    ],
    connection: 'cluster-agent',
    dataFlow: ['stream'],
    auth: 'Covered by the Kubernetes agent',
    transport: 'vLLM /metrics endpoint scraped in-cluster',
    cadence: 'Every scrape interval',
    products: ['mlops', 'obs', 'rca'],
    reads: ['vLLM metrics: latency, KV-cache usage, queue and batch stats'],
    iconSlug: 'vllm',
    logoTint: '30A2FF',
    domain: 'vllm.ai',
  },
  {
    slug: 'triton',
    name: 'NVIDIA Triton',
    category: 'GPU & ML',
    tagline: 'Triton inference latency, queueing and model health.',
    description:
      'Triton Inference Server metrics feed latency and queue-time alerts with model-level context, so a slow endpoint is traced to the model, the batch configuration or the GPU.',
    capabilities: [
      'Inference and queue latency per model',
      'Model load and availability status',
      'GPU context on every incident',
      'Same alerting as the rest of your stack',
    ],
    connection: 'cluster-agent',
    dataFlow: ['stream'],
    auth: 'Covered by the Kubernetes agent',
    transport: 'Triton metrics endpoint scraped in-cluster',
    cadence: 'Every scrape interval',
    products: ['mlops', 'obs', 'rca'],
    reads: ['Triton metrics: inference latency, queue time and model status'],
    iconSlug: 'nvidia',
    logoTint: '76B900',
    domain: 'nvidia.com',
  },
  {
    slug: 'argo-workflows',
    name: 'Argo Workflows',
    category: 'Orchestration',
    alsoIn: ['Kubernetes & containers', 'GPU & ML'],
    tagline: 'Failed Argo workflow pods caught by health policies, with the cause.',
    description:
      'The workflow-pod health policy watches Argo (and Airflow) worker pods. When a step fails, the alert carries the pod events, logs and the likely cause, and a remediation flow can retry it after approval.',
    capabilities: [
      'Workflow pod failures caught by health policy',
      'Pod events and logs as evidence',
      'Retry through an approved remediation flow',
      'Works for ML and data pipelines alike',
    ],
    connection: 'cluster-agent',
    dataFlow: ['stream'],
    acts: true,
    auth: 'Covered by the Kubernetes agent',
    transport: 'Workflow pods watched by the agent’s health policy',
    cadence: 'Continuous',
    products: ['k8s', 'mlops', 'fix'],
    reads: ['Workflow pods, status, events and logs'],
    logoSrc: svgporn('argo-icon'),
    domain: 'argoproj.github.io',
  },

  /* ---------------------------------------------------------------- */
  /* Response · Chat & paging                                         */
  /* ---------------------------------------------------------------- */
  {
    slug: 'slack',
    name: 'Slack',
    category: 'Chat & collaboration',
    tagline: 'AI RCAs land in the channel before the on-call opens their laptop.',
    description:
      'AlertMend posts RCAs into the channel of your choice and accepts approval reactions, slash-commands, and threaded follow-ups. Same Slack app handles routing rules, escalations, and runbook approvals.',
    capabilities: [
      'Slack-native RCA delivery with deep links to evidence',
      'Approval reactions (✅ / 🛑) for guarded runbook steps',
      '/alertmend slash-commands for ad-hoc triage',
      'Per-channel routing rules via filter rules',
    ],
    connection: 'app-install',
    dataFlow: ['notify', 'stream'],
    auth: 'Slack app bot token, or OAuth',
    transport: 'Slack Web API; Events API for channels you route',
    cadence: 'Real time',
    products: ['rca', 'fix', 'oncall', 'dataobs'],
    reads: ['Channel list, and messages only in channels you route to AlertMend'],
    logoSrc: svgporn('slack-icon'),
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
    category: 'Chat & collaboration',
    tagline: 'Adaptive cards, approvals, and runbook triggers in Teams.',
    description:
      'AlertMend ships a first-class Teams app with adaptive cards for RCAs, approvals, and runbook triggers. Works with both classic Teams and the new client; supports tenant-wide install via admin approval.',
    capabilities: [
      'Adaptive-card RCAs with embedded evidence',
      'Approval cards for guarded runbooks',
      'Channel routing per filter rule',
      'Tenant-wide install via Microsoft 365 admin center',
    ],
    connection: 'app-install',
    dataFlow: ['notify'],
    auth: 'Incoming webhook URL',
    transport: 'Teams incoming webhook with adaptive cards',
    cadence: 'Real time',
    products: ['rca', 'fix', 'oncall', 'dataobs'],
    reads: ['Nothing; AlertMend posts cards to the channel webhook'],
    logoSrc: svgporn('microsoft-teams'),
    domain: 'microsoft.com',
    docsHref: '/documentation/ms-teams-approval',
  },
  {
    slug: 'pagerduty',
    name: 'PagerDuty',
    category: 'Paging & on-call',
    tagline: 'Two-way sync: AlertMend RCAs onto PagerDuty incidents.',
    description:
      'Existing PagerDuty rotations stay your source of truth for who gets paged. AlertMend posts the RCA and remediation log onto the PagerDuty incident, and pulls back acknowledge/resolve state to keep the two views in sync.',
    capabilities: [
      'AlertMend RCA → PagerDuty incident note',
      'Bidirectional ack/resolve sync',
      'Routing keys per service / team',
      'Audit trail consolidated across both systems',
    ],
    connection: 'app-install',
    dataFlow: ['notify'],
    auth: 'PagerDuty API token',
    transport: 'PagerDuty REST API',
    cadence: 'Real time',
    products: ['oncall', 'rca'],
    reads: ['Nothing; AlertMend creates and updates incidents with an API token'],
    logoSrc: svgporn('pagerduty-icon'),
    logoTint: '06AC38',
    domain: 'pagerduty.com',
  },
  {
    slug: 'google-meet',
    name: 'Google Meet',
    category: 'Chat & collaboration',
    tagline: 'Spin up a war-room Meet from any AlertMend incident.',
    description:
      'High-severity incidents get a "Start war room" action that creates a Google Meet, posts the join link to the incident channel, and records the RCA timeline alongside the call.',
    capabilities: [
      'One-click Meet from any incident',
      'Join link posted to Slack / Teams automatically',
      'Calendar invite to the on-call group',
      'Attendance recorded on the incident timeline',
    ],
    connection: 'app-install',
    dataFlow: ['notify'],
    auth: 'Google OAuth (Calendar scope)',
    transport: 'Google Calendar API',
    cadence: 'When an incident opens a war room',
    products: ['oncall'],
    reads: ['Nothing; AlertMend creates meetings through OAuth'],
    iconSlug: 'googlemeet',
    logoTint: '00897B',
    domain: 'meet.google.com',
  },
  {
    slug: 'zoom',
    name: 'Zoom',
    category: 'Chat & collaboration',
    tagline: 'Start a Zoom war room from a high-severity incident.',
    description:
      'Connect Zoom with OAuth so an incident can open a meeting and post the join link to the incident channel, alongside the RCA and the timeline.',
    capabilities: [
      'Meeting created from the incident',
      'Join link posted to Slack or Teams',
      'OAuth connection, no shared passwords',
      'Same flow as Google Meet',
    ],
    connection: 'app-install',
    dataFlow: ['notify'],
    auth: 'Zoom OAuth',
    transport: 'Zoom API',
    cadence: 'When an incident opens a war room',
    products: ['oncall'],
    reads: ['Nothing; AlertMend creates meetings through OAuth'],
    logoSrc: svgporn('zoom-icon'),
    domain: 'zoom.us',
  },
  {
    slug: 'whatsapp',
    name: 'WhatsApp',
    category: 'Paging & on-call',
    tagline: 'WhatsApp paging for distributed engineering teams.',
    description:
      'Especially useful for global teams or co-location-heavy industries (logistics, IoT) where WhatsApp is the de-facto coordination channel. AlertMend pages directly to WhatsApp with a back-link to the full RCA.',
    capabilities: [
      'WhatsApp Business API delivery',
      'Acknowledge by reply',
      'Group routing per filter rule',
      'Same audit trail as Slack/Teams paging',
    ],
    connection: 'built-in',
    dataFlow: ['notify'],
    auth: 'None: you add phone numbers',
    transport: 'AlertMend’s WhatsApp Business account',
    cadence: 'Real time, by escalation path',
    products: ['oncall'],
    reads: ['Nothing; you add phone numbers to an escalation path'],
    logoSrc: svgporn('whatsapp-icon'),
    domain: 'whatsapp.com',
  },
  {
    slug: 'sendgrid',
    name: 'SendGrid',
    category: 'Paging & on-call',
    alsoIn: ['Chat & collaboration'],
    tagline: 'Email-channel paging and digest delivery via SendGrid.',
    description:
      'When you need email as a paging channel (for execs, broader stakeholders, or fallback when chat is down), AlertMend can deliver structured RCA emails through your SendGrid account.',
    capabilities: [
      'Branded HTML RCAs sent on incident open/resolve',
      'Daily/weekly digest emails for stakeholders',
      'DKIM/SPF respected, sent as your domain',
      'Per-recipient routing rules',
    ],
    connection: 'app-install',
    dataFlow: ['notify'],
    auth: 'SendGrid API key and sender address',
    transport: 'SendGrid Mail API',
    cadence: 'Real time, plus digests',
    products: ['oncall', 'dataobs'],
    reads: ['Delivery events only'],
    logoSrc: svgporn('sendgrid-icon'),
    domain: 'sendgrid.com',
  },

  /* ---------------------------------------------------------------- */
  /* Response · Ticketing, code & CI/CD                               */
  /* ---------------------------------------------------------------- */
  {
    slug: 'jira',
    name: 'Jira',
    category: 'Ticketing',
    tagline: 'File RCAs as Jira issues with one click, fields prefilled.',
    description:
      'Drop an AlertMend incident into Jira as a structured issue: summary, evidence, runbook log, and root-cause classification all go into the right fields. Works with Jira Cloud and Jira DC.',
    capabilities: [
      'One-click "File as Jira" from any AlertMend RCA',
      'Custom field mapping (severity, owner, RCA classification)',
      'Bidirectional comment sync',
      'Cloud + Data Center supported',
    ],
    connection: 'app-install',
    dataFlow: ['notify'],
    auth: 'Jira API token and account email',
    transport: 'Jira REST API',
    cadence: 'When an issue is filed or updated',
    products: ['rca', 'oncall', 'dataobs'],
    reads: ['Projects and issue types for the issues AlertMend creates'],
    logoSrc: svgporn('jira'),
    domain: 'atlassian.com',
  },
  {
    slug: 'github',
    name: 'GitHub',
    category: 'Source control & CI/CD',
    tagline: 'PR Fix: AI-generated pull requests from root cause findings.',
    description:
      'Connect a GitHub App, OAuth or a fine-scoped token, with a repository and base branch. When an RCA finds a fix that belongs in code or config, such as right-sized requests and limits, AlertMend opens a pull request (draft if you prefer) for your team to review and merge.',
    capabilities: [
      'Pull requests generated from RCA findings',
      'Draft PRs for review-first teams',
      'GitHub App, OAuth or token auth',
      'Right-sizing YAML delivered as a PR',
    ],
    connection: 'app-install',
    dataFlow: ['notify'],
    acts: true,
    auth: 'GitHub App, OAuth or a fine-scoped token',
    transport: 'GitHub REST API',
    cadence: 'When a root cause proposes a fix',
    products: ['rca', 'fix', 'finops'],
    reads: ['The repository files a proposed change touches'],
    logoSrc: svgporn('github-icon'),
    iconSlug: 'github',
    logoTint: '181717',
    domain: 'github.com',
    docsHref: '/documentation/pr-fix',
  },
  {
    slug: 'github-actions',
    name: 'GitHub Actions',
    category: 'Source control & CI/CD',
    tagline: 'Generate PRs from runbooks; correlate Actions to incidents.',
    description:
      'AlertMend can open a pull request directly from an RCA (for example, the right-sized requests/limits YAML) using a fine-scoped GitHub App. Workflow runs are also ingested as deploy events for evidence.',
    capabilities: [
      'GitHub App with least-privilege scopes',
      '"Generate PR" action straight from any RCA',
      'Actions workflow events as RCA evidence',
      'Auto-revert runbook for failed deploys',
    ],
    connection: 'app-install',
    dataFlow: ['stream', 'notify'],
    acts: true,
    auth: 'GitHub App',
    transport: 'Workflow events by webhook; GitHub API for pull requests',
    cadence: 'Real time',
    products: ['rca', 'fix'],
    reads: ['Workflow run events, as deploy evidence'],
    logoSrc: svgporn('github-actions'),
    logoTint: '2088FF',
    domain: 'github.com',
  },
  {
    slug: 'gitlab',
    name: 'GitLab CI',
    category: 'Source control & CI/CD',
    tagline: 'Pipeline-aware RCAs and merge-request remediation.',
    description:
      'Connect AlertMend to GitLab self-managed or .com via a project access token. Pipeline runs become deploy evidence, and AlertMend can open MRs against the right project from a paged incident.',
    capabilities: [
      'GitLab project access token for least-privilege auth',
      'Pipeline events as RCA evidence',
      '"Open MR" runbook for guarded fixes',
      'Self-managed and .com both supported',
    ],
    connection: 'app-install',
    dataFlow: ['stream', 'notify'],
    acts: true,
    auth: 'Project access token',
    transport: 'Pipeline webhooks; GitLab API',
    cadence: 'Real time',
    products: ['rca', 'fix'],
    reads: ['Pipeline events, as deploy evidence'],
    logoSrc: svgporn('gitlab-icon'),
    domain: 'gitlab.com',
  },
  {
    slug: 'jenkins',
    name: 'Jenkins',
    category: 'Source control & CI/CD',
    tagline: 'Correlate Jenkins deploys to incident root causes.',
    description:
      'AlertMend ingests Jenkins build webhooks and uses recent deploys as evidence in every RCA. When an incident correlates with a build, the RCA links straight back to the failing job and changeset.',
    capabilities: [
      'Jenkins build webhook ingestion',
      'Recent-deploy evidence in every RCA',
      'Auto-rollback runbook trigger from a paged incident',
      'Per-pipeline scope and routing',
    ],
    connection: 'signal-ingest',
    dataFlow: ['stream'],
    auth: 'Webhook URL and bearer token',
    transport: 'Build notifications by webhook',
    cadence: 'Real time, as builds finish',
    products: ['rca', 'fix'],
    reads: ['Build events you post to your webhook URL'],
    logoSrc: svgporn('jenkins'),
    domain: 'jenkins.io',
  },
];

export function findIntegrationBySlug(slug: string): Integration | undefined {
  return integrations.find((i) => i.slug === slug);
}

/** Every functionality filter an integration belongs to, primary first. */
export function categoriesOf(integration: Integration): IntegrationCategory[] {
  return [integration.category, ...(integration.alsoIn ?? [])];
}

/** Hand-written setup steps, or the connection method's generic ones. */
export function setupStepsFor(integration: Integration): string[] {
  return integration.setupSteps ?? methodSetupSteps[integration.connection](integration.name);
}
