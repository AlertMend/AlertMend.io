import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Clock3,
  BarChart3,
  Columns,
  ListChecks,
  TrendingUp,
  Workflow,
  GitBranch,
  Briefcase,
  Activity,
  ScrollText,
  Boxes,
  Server,
  Cpu,
  DollarSign,
  BellRing,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useAudience } from '../../hooks/useAudience'
import styles from './Coverage.module.css'

type Signal = { icon: LucideIcon; title: string; body: string }

const DATA: Signal[] = [
  { icon: Clock3, title: 'Freshness', body: 'Late or missing loads, measured against the SLA in your policy.' },
  { icon: BarChart3, title: 'Volume', body: 'Row counts against each table’s own baseline.' },
  { icon: Columns, title: 'Schema changes', body: 'Dropped, renamed or retyped columns before consumers break.' },
  { icon: ListChecks, title: 'Data quality checks', body: 'Completeness, uniqueness, validity and referential integrity.' },
  { icon: TrendingUp, title: 'Anomaly detection', body: 'History-aware checks for values, nulls and distributions.' },
  { icon: Workflow, title: 'Pipeline and job monitoring', body: 'Airflow, dbt and ODI runs linked to the tables they build.' },
  { icon: GitBranch, title: 'Lineage', body: 'From the source and pipeline job to every report that reads the table.' },
  { icon: Briefcase, title: 'Impact analysis', body: 'Which reports and teams would see the wrong numbers, flagged before they do.' },
]

const INFRA: Signal[] = [
  { icon: Activity, title: 'Metrics, traces and APM', body: 'SLOs, service health and a trace explorer on one timeline.' },
  { icon: ScrollText, title: 'Logs', body: 'Live pod logs in an incident, and history you can query with SQL.' },
  { icon: Boxes, title: 'Kubernetes', body: 'Workloads, nodes and health policies across every cluster.' },
  { icon: Server, title: 'VMs and cloud', body: 'EC2, ECS, RDS and on-prem hosts beside your clusters.' },
  { icon: Cpu, title: 'GPU fleets', body: 'Utilisation, MIG slices, training and inference health.' },
  { icon: DollarSign, title: 'Cost', body: 'Right-sizing for Kubernetes, AWS and idle GPUs.' },
  { icon: BellRing, title: 'On-call', body: 'Schedules, escalation and alerts that arrive with the cause.' },
]

function Column({
  label,
  title,
  items,
  href,
  cta,
  active,
}: {
  label: string
  title: string
  items: Signal[]
  href: string
  cta: string
  active: boolean
}) {
  return (
    <div className={`${styles.col} ${active ? styles.colActive : ''}`}>
      <span className={styles.label}>{label}</span>
      <h3 className={styles.colTitle}>{title}</h3>
      <ul className={styles.list}>
        {items.map((s) => (
          <li key={s.title}>
            <s.icon className={styles.icon} size={18} strokeWidth={1.75} aria-hidden="true" />
            <div>
              <p className={styles.itemTitle}>{s.title}</p>
              <p className={styles.itemBody}>{s.body}</p>
            </div>
          </li>
        ))}
      </ul>
      <Link to={href} className={styles.more}>
        {cta} <ArrowRight size={15} aria-hidden="true" />
      </Link>
    </div>
  )
}

export default function Coverage() {
  const { audience } = useAudience()
  const data = (
    <Column
      key="data"
      label="Data observability"
      title="Know when the numbers are wrong, and why."
      items={DATA}
      href="/data-observability"
      cta="Explore data observability"
      active={audience === 'data'}
    />
  )
  const infra = (
    <Column
      key="infra"
      label="Infrastructure observability"
      title="Know what broke in production, and why."
      items={INFRA}
      href="/observability"
      cta="Explore infrastructure observability"
      active={audience === 'infra'}
    />
  )

  return (
    <section className={styles.section} id="coverage">
      <div className={styles.wrap}>
        <div className={styles.head}>
          <div>
            <span className={styles.eyebrow}>What AlertMend watches</span>
            <h2 className={styles.h2}>Data and infrastructure, observed side by side.</h2>
          </div>
          <p className={styles.lede}>
            The signals data teams and platform teams each need, in one product. Both share one AI engine for root cause
            and remediation, so when bad data is caused by the platform underneath, you see and fix it in one place.
          </p>
        </div>
        <div className={styles.cols}>{audience === 'infra' ? [infra, data] : [data, infra]}</div>
      </div>
    </section>
  )
}
