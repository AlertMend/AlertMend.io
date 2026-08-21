/**
 * Shared brand / vendor logos for Works-with grids, ProductList chips, and
 * any surface that names a third-party product.
 *
 * Prefer svgporn (full color). Fall back to Simple Icons + tint, then favicon.
 */

export type BrandLogoRef = {
  label: string
  /** Preferred full-color logo URL. */
  logoSrc?: string
  /** Simple Icons slug when svgporn is missing. */
  iconSlug?: string
  logoTint?: string
  domain: string
  /** Existing /integrations/<slug> when we have a detail page. */
  to?: string
}

const svg = (slug: string) => `https://cdn.svgporn.com/logos/${slug}.svg`

/** Lookup by display label (exact match used by Works-with items). */
export const BRAND_LOGOS: Record<string, BrandLogoRef> = {
  Kubernetes: {
    label: 'Kubernetes',
    logoSrc: svg('kubernetes'),
    domain: 'kubernetes.io',
    to: '/integrations/kubernetes',
  },
  EKS: {
    label: 'EKS',
    logoSrc: svg('aws-eks'),
    iconSlug: 'amazoneks',
    logoTint: 'FF9900',
    domain: 'aws.amazon.com',
    to: '/integrations/aws',
  },
  GKE: {
    label: 'GKE',
    logoSrc: svg('google-cloud'),
    domain: 'cloud.google.com',
    to: '/integrations/google-cloud',
  },
  AKS: {
    label: 'AKS',
    logoSrc: svg('microsoft-azure'),
    domain: 'azure.microsoft.com',
    to: '/integrations/azure',
  },
  Helm: {
    label: 'Helm',
    logoSrc: svg('helm'),
    domain: 'helm.sh',
    to: '/integrations/kubernetes',
  },
  'AWS ECS & EC2': {
    label: 'AWS ECS & EC2',
    logoSrc: svg('aws'),
    domain: 'aws.amazon.com',
    to: '/integrations/aws',
  },
  AWS: {
    label: 'AWS',
    logoSrc: svg('aws'),
    domain: 'aws.amazon.com',
    to: '/integrations/aws',
  },
  Prometheus: {
    label: 'Prometheus',
    logoSrc: svg('prometheus'),
    domain: 'prometheus.io',
    to: '/integrations/prometheus',
  },
  Datadog: {
    label: 'Datadog',
    logoSrc: svg('datadog'),
    domain: 'datadoghq.com',
    to: '/integrations/datadog',
  },
  Grafana: {
    label: 'Grafana',
    logoSrc: svg('grafana'),
    domain: 'grafana.com',
    to: '/integrations/grafana',
  },
  'Google Cloud': {
    label: 'Google Cloud',
    logoSrc: svg('google-cloud'),
    domain: 'cloud.google.com',
    to: '/integrations/google-cloud',
  },
  Azure: {
    label: 'Azure',
    logoSrc: svg('microsoft-azure'),
    domain: 'azure.microsoft.com',
    to: '/integrations/azure',
  },
  Slack: {
    label: 'Slack',
    logoSrc: svg('slack'),
    domain: 'slack.com',
    to: '/integrations/slack',
  },
  'Microsoft Teams': {
    label: 'Microsoft Teams',
    logoSrc: svg('microsoft-teams'),
    domain: 'microsoft.com',
    to: '/integrations/ms-teams',
  },
  Snowflake: {
    label: 'Snowflake',
    logoSrc: svg('snowflake'),
    iconSlug: 'snowflake',
    logoTint: '29B5E8',
    domain: 'snowflake.com',
    to: '/integrations/snowflake',
  },
  BigQuery: {
    label: 'BigQuery',
    logoSrc: svg('google-bigquery'),
    iconSlug: 'googlebigquery',
    logoTint: '669DF6',
    domain: 'cloud.google.com',
    to: '/integrations/bigquery',
  },
  Redshift: {
    label: 'Redshift',
    logoSrc: svg('aws-redshift'),
    iconSlug: 'amazonredshift',
    logoTint: '8C4FFF',
    domain: 'aws.amazon.com',
    to: '/integrations/redshift',
  },
  Databricks: {
    label: 'Databricks',
    logoSrc: svg('databricks'),
    iconSlug: 'databricks',
    logoTint: 'FF3621',
    domain: 'databricks.com',
    to: '/integrations/databricks',
  },
  Postgres: {
    label: 'Postgres',
    logoSrc: svg('postgresql'),
    domain: 'postgresql.org',
    to: '/integrations/postgres',
  },
  PostgreSQL: {
    label: 'PostgreSQL',
    logoSrc: svg('postgresql'),
    domain: 'postgresql.org',
    to: '/integrations/postgres',
  },
  dbt: {
    label: 'dbt',
    logoSrc: svg('dbt-icon'),
    iconSlug: 'dbt',
    logoTint: 'FF694B',
    domain: 'getdbt.com',
    to: '/integrations/dbt',
  },
  Airflow: {
    label: 'Airflow',
    logoSrc: svg('airflow-icon'),
    iconSlug: 'apacheairflow',
    logoTint: '017CEE',
    domain: 'airflow.apache.org',
    to: '/integrations/airflow',
  },
  Teams: {
    label: 'Teams',
    logoSrc: svg('microsoft-teams'),
    domain: 'microsoft.com',
    to: '/integrations/ms-teams',
  },
  EC2: {
    label: 'EC2',
    logoSrc: svg('aws'),
    domain: 'aws.amazon.com',
    to: '/integrations/aws',
  },
  RDS: {
    label: 'RDS',
    logoSrc: svg('aws'),
    domain: 'aws.amazon.com',
    to: '/integrations/aws',
  },
  ELB: {
    label: 'ELB',
    logoSrc: svg('aws'),
    domain: 'aws.amazon.com',
    to: '/integrations/aws',
  },
  Kubeflow: {
    label: 'Kubeflow',
    logoSrc: svg('kubeflow-icon'),
    iconSlug: 'kubeflow',
    logoTint: '0195E1',
    domain: 'kubeflow.org',
  },
  PagerDuty: {
    label: 'PagerDuty',
    logoSrc: svg('pagerduty'),
    domain: 'pagerduty.com',
    to: '/integrations/pagerduty',
  },
  Jira: {
    label: 'Jira',
    logoSrc: svg('jira'),
    domain: 'atlassian.com',
    to: '/integrations/jira',
  },
  GitHub: {
    label: 'GitHub',
    logoSrc: svg('github-icon'),
    iconSlug: 'github',
    logoTint: '181717',
    domain: 'github.com',
    to: '/integrations/github',
  },
}

/** Merge a Works-with item with the shared brand registry. */
export function withBrandLogo(item: {
  label: string
  to?: string
  logoSrc?: string
  iconSlug?: string
  logoTint?: string
  domain?: string
}): BrandLogoRef {
  const known = BRAND_LOGOS[item.label]
  return {
    label: item.label,
    logoSrc: item.logoSrc ?? known?.logoSrc,
    iconSlug: item.iconSlug ?? known?.iconSlug,
    logoTint: item.logoTint ?? known?.logoTint,
    domain: item.domain ?? known?.domain ?? `${item.label.toLowerCase().replace(/\s+/g, '')}.com`,
    to: item.to ?? known?.to,
  }
}
