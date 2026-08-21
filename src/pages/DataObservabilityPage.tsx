import {
  Database, Activity, FileCheck, Brain, Bell, ShieldCheck,
  GitBranch, Workflow, Search,
} from 'lucide-react'
import SolutionPageTemplate, { Accent } from '../components/SolutionPageTemplate'
import { Link } from 'react-router-dom'

/**
 * /data-observability — soda.io-style data quality monitoring.
 *
 * Warehouse / lake / pipeline health (freshness, volume, schema, anomalies),
 * not infra Observability & APM. Teach the data problem first, then AlertMend
 * as evidence-backed RCA and approval-gated remediation when bad data lands.
 */

const SIGNUP_URL = 'https://app.alertmend.io/signup?service=data-observability'

function SpotlightPanel() {
  const monitors = [
    { metric: 'freshness', value: '47m late', tone: 'crit' as const },
    { metric: 'row count', value: '−38% vs baseline', tone: 'warn' as const },
    { metric: 'null rate · amount', value: '12.4%', tone: 'crit' as const },
    { metric: 'schema', value: 'column dropped', tone: 'warn' as const },
  ]
  const toneCls = {
    crit: 'border-rose-400/30 bg-rose-500/10 text-rose-300',
    warn: 'border-amber-400/30 bg-amber-500/10 text-amber-300',
  }

  return (
    <div className="rounded-[10px] border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-white/55">analytics.orders · warehouse</span>
        <span className="rounded-md border border-rose-400/30 bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-300">
          3 anomalies
        </span>
      </div>
      <div className="mt-4 space-y-2">
        {monitors.map((m) => (
          <div
            key={m.metric}
            className={`flex items-center justify-between rounded-lg border px-3 py-2 ${toneCls[m.tone]}`}
          >
            <span className="font-mono text-[11px] text-zinc-200">{m.metric}</span>
            <span className="font-mono text-[11px] font-semibold">{m.value}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-lg border border-violet-400/25 bg-violet-500/10 p-4">
        <div className="text-xs font-bold text-violet-300">Root cause · confidence 91%</div>
        <p className="mt-1.5 text-sm leading-relaxed text-zinc-200">
          Downstream dbt model <b className="text-white">stg_orders</b> stopped landing after
          deploy <b className="text-white">v4.12.1</b> dropped the <span className="font-mono text-[11.5px]">updated_at</span> column.
        </p>
      </div>
    </div>
  )
}

export default function DataObservabilityPage() {
  return (
    <SolutionPageTemplate
      seo={{
        title: 'Data Observability: Freshness, Volume & Anomalies | AlertMend',
        description:
          'Monitor warehouse and lake tables for freshness, volume, schema drift and anomalies without a check per dataset. Data contracts, Slack alerts, and evidence-backed RCA when bad data hits pipelines.',
        keywords:
          'data observability, data quality, freshness monitoring, schema drift, anomaly detection, data contracts, warehouse monitoring, lakehouse, dbt, Snowflake, BigQuery, AlertMend',
        canonical: '/data-observability',
      }}
      badge="Data Observability"
      headline={
        <>
          Catch bad data <Accent>before</Accent> it reaches the dashboard
        </>
      }
      sub="Freshness, volume, schema, and null rates across every table, watched automatically. When something breaks a pipeline, AlertMend cites the evidence and proposes a fix you approve in Slack or Teams."
      signupUrl={SIGNUP_URL}
      checks={['No check per table', 'Contracts for producers & consumers', 'Host in your VPC']}
      highlightProduct="dataobs"
      worksWith={{
        heading: 'Connects to your warehouse, lake, and pipelines',
        body: (
          <>
            <p className="mt-3 text-[14px] leading-relaxed text-zinc-500">
              Snowflake, BigQuery, Redshift, Databricks, Postgres, plus dbt and Airflow metadata.
              Monitors land on the tables those pipelines write. This is data health, not the
              metrics/logs/traces surface in{' '}
              <Link
                to="/observability"
                className="font-medium text-violet-700 underline-offset-2 hover:underline"
              >
                Observability &amp; APM
              </Link>
              .
            </p>
            <p className="mt-3 text-[14px] leading-relaxed text-zinc-500">
              When an anomaly fires, pages go to{' '}
              <Link
                to="/integrations/slack"
                className="font-medium text-violet-700 underline-offset-2 hover:underline"
              >
                Slack
              </Link>{' '}
              or{' '}
              <Link
                to="/integrations/ms-teams"
                className="font-medium text-violet-700 underline-offset-2 hover:underline"
              >
                Microsoft Teams
              </Link>{' '}
              with citations, then remediation waits for approval.
            </p>
          </>
        ),
        items: [
          { label: 'Snowflake' },
          { label: 'BigQuery' },
          { label: 'Redshift' },
          { label: 'Databricks' },
          { label: 'Postgres' },
          { label: 'dbt' },
          { label: 'Airflow' },
          { label: 'Slack' },
          { label: 'Microsoft Teams' },
        ],
      }}
      stepsHeading="From warehouse to a fix you approved"
      stepsSub="Connect sources once, let monitors learn the baseline, then act on anomalies with the same approval loop as the rest of AlertMend."
      steps={[
        {
          icon: Database,
          title: 'Connect',
          sub: 'Warehouse, lake, pipeline',
          spec: 'Snowflake · BigQuery · Redshift · Databricks · Postgres, plus dbt and Airflow metadata',
        },
        {
          icon: Activity,
          title: 'Monitor',
          sub: 'Metrics that learn',
          spec: 'freshness · volume · schema · null rates · custom metrics, with adaptive thresholds',
        },
        {
          icon: Workflow,
          title: 'Act',
          sub: 'Alert, RCA, approve',
          spec: 'Slack or Teams page with citations · quarantine path · remediation gated by approval',
        },
      ]}
      featuresHeading="Data health without a check farm"
      featuresSub="Observability & APM watches infra signals. Data Observability watches the tables those pipelines write."
      features={[
        {
          icon: Activity,
          title: 'Metric monitors at scale',
          body: 'Turn on freshness, row count, schema and completeness across hundreds of tables in one step. No hand-written check per dataset.',
          chips: ['freshness', 'volume', 'schema'],
          big: true,
        },
        {
          icon: Brain,
          title: 'AI anomaly detection',
          body: 'Baselines learn seasonality and trend. Flag expected vs anomalous so the model tightens over time instead of paging on every dip.',
          chips: ['adaptive', 'feedback'],
        },
        {
          icon: FileCheck,
          title: 'Data contracts',
          body: 'Producers and consumers share explicit expectations. Versioned proposals, diffs, and enforcement at the source before bad rows spread.',
          chips: ['contracts', 'Git + UI'],
        },
        {
          icon: Search,
          title: 'Historical baseline',
          body: 'Backfill metadata so day one already shows patterns, not a blank chart waiting for weeks of training.',
          chips: ['backfill', 'trends'],
        },
        {
          icon: Bell,
          title: 'Slack & Teams alerts',
          body: 'Opt-in notifications when deviations matter. Every page arrives with the table, metric, and linked evidence.',
          chips: ['Slack', 'Teams'],
        },
        {
          icon: ShieldCheck,
          title: 'Failed-record quarantine',
          body: 'Rows that break a contract or trip an anomaly can land in a quarantine table in your warehouse, not silently in dashboards.',
          chips: ['quarantine', 'your cloud'],
        },
        {
          icon: GitBranch,
          title: 'Evidence-backed RCA',
          body: 'Correlate deploy, dbt run, and metric history into a cited root cause with a confidence score, the same RCA surface as infra incidents.',
          chips: ['citations', 'confidence'],
        },
        {
          icon: Workflow,
          title: 'Approval-gated remediation',
          body: 'Suggest a contract update, pipeline rollback, or quarantine rule. Nothing runs until someone approves in Slack or Teams.',
          chips: ['approve', 'audit'],
        },
      ]}
      spotlight={{
        tag: 'Bad data at 06:12',
        title: 'orders went stale after a dbt deploy',
        body: 'AlertMend flagged freshness and null-rate anomalies on analytics.orders, tied them to a schema change in stg_orders, and handed the on-call a cited RCA with a contract update ready to approve.',
        steps: [
          'Freshness lag and null spike on analytics.orders',
          'Correlated with dbt deploy v4.12.1 and missing updated_at',
          'Root cause written with metric and change citations',
          'Contract update and quarantine rule proposed in Slack',
        ],
        linkTo: '/ai-rca',
        linkLabel: 'See how AI RCA works',
        panel: <SpotlightPanel />,
      }}
      ctaHeading="Point AlertMend at your warehouse"
      ctaSub="Connect a data source and see freshness, volume and schema monitors live, with the same RCA and approval loop as the rest of your stack."
    />
  )
}
