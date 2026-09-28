import {
  Columns,
  Workflow,
  Database,
  FileBarChart2,
  Users,
  Check,
} from 'lucide-react'
import styles from './Enterprise.module.css'
import dd from './DataDepth.module.css'

/* Feedback sections for /data-observability: lineage and impact analysis
   (with business impact) and policy as the data contract. */

/* ---------------- Lineage and impact ---------------- */

type NodeState = 'ok' | 'cause' | 'fail' | 'impact'
const LINEAGE: { col: string; nodes: { name: string; kind: string; state: NodeState }[] }[] = [
  {
    col: 'Source',
    nodes: [
      { name: 'CORE_BANKING', kind: 'Oracle', state: 'ok' },
      { name: 'TRADES_FEED', kind: 'SFTP drop', state: 'ok' },
    ],
  },
  {
    col: 'Pipeline',
    nodes: [
      { name: 'positions_nightly', kind: 'Airflow DAG', state: 'cause' },
      { name: 'customer_load', kind: 'ODI job', state: 'ok' },
    ],
  },
  {
    col: 'Warehouse',
    nodes: [
      { name: 'FINANCE.DAILY_POSITIONS', kind: 'Snowflake table', state: 'fail' },
      { name: 'BANKING.ACCOUNTS', kind: 'Snowflake table', state: 'ok' },
    ],
  },
  {
    col: 'Reports',
    nodes: [
      { name: 'Liquidity risk', kind: 'Power BI', state: 'impact' },
      { name: 'Daily P&L', kind: 'Power BI', state: 'impact' },
      { name: 'Regulatory returns', kind: 'Power BI', state: 'impact' },
    ],
  },
]

const STATE_LABEL: Record<NodeState, string> = {
  ok: 'Healthy',
  cause: 'Root cause',
  fail: 'Check failed',
  impact: 'Affected',
}

export function LineageImpact() {
  return (
    <section className={styles.sectionAlt} id="lineage">
      <div className={styles.wrap}>
        <div className={styles.head}>
          <div>
            <span className={styles.eyebrow}>Lineage and impact analysis</span>
            <h2 className={styles.h2}>Upstream cause. Downstream impact. Before anyone asks.</h2>
          </div>
          <p className={styles.lede}>
            When a check fails, AlertMend walks the lineage both ways: up to the job that broke the table, and down to the
            reports that will show the wrong number. When the platform underneath is the cause,
            AI root cause analysis shows that too, with a fix your team approves.
          </p>
        </div>

        <div className={dd.lineage} role="img" aria-label="Lineage example: the Airflow DAG positions_nightly caused a failed check on FINANCE.DAILY_POSITIONS, which affects three Power BI reports.">
          {LINEAGE.map((c, ci) => (
            <div key={c.col} className={dd.lcol}>
              <span className={dd.lcolLabel}>{c.col}</span>
              {c.nodes.map((n) => (
                <div key={n.name} className={`${dd.node} ${dd[n.state]}`}>
                  <span className={dd.nodeKind}>
                    {ci === 3 ? <FileBarChart2 size={13} aria-hidden="true" /> : <Database size={13} aria-hidden="true" />}
                    {n.kind}
                  </span>
                  <span className={dd.nodeName}>{n.name}</span>
                  {n.state !== 'ok' && <span className={dd.nodeState}>{STATE_LABEL[n.state]}</span>}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className={`${styles.grid4} ${dd.impactGrid}`}>
          <div className={styles.cell}>
            <span className={styles.icon}><Workflow size={20} strokeWidth={1.75} aria-hidden="true" /></span>
            <h3 className={styles.cellTitle}>Upstream cause</h3>
            <p className={styles.cellBody}>The DAG, dbt model or ODI job behind the failure, with its error and run history.</p>
          </div>
          <div className={styles.cell}>
            <span className={styles.icon}><FileBarChart2 size={20} strokeWidth={1.75} aria-hidden="true" /></span>
            <h3 className={styles.cellTitle}>Downstream impact</h3>
            <p className={styles.cellBody}>Every Power BI report that reads the table, flagged as affected until the data is fixed.</p>
          </div>
          <div className={styles.cell}>
            <span className={styles.icon}><Users size={20} strokeWidth={1.75} aria-hidden="true" /></span>
            <h3 className={styles.cellTitle}>Business impact</h3>
            <p className={styles.cellBody}>The alert lists the business reports at risk, so the people who rely on them hear first.</p>
          </div>
          <div className={styles.cell}>
            <span className={styles.icon}><Columns size={20} strokeWidth={1.75} aria-hidden="true" /></span>
            <h3 className={styles.cellTitle}>Schema change impact</h3>
            <p className={styles.cellBody}>A dropped or retyped column is flagged with the reports that read the table.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------- Policy as the data contract ---------------- */

const CONTRACT = [
  { clause: '4.2', expectation: 'Positions are loaded by 06:00 every business day', check: 'Freshness · SLA 06:00', owner: 'Treasury data' },
  { clause: '4.5', expectation: 'Column set and types of DAILY_POSITIONS do not change without notice', check: 'Schema change', owner: 'Treasury data' },
  { clause: '5.1', expectation: 'Every account has exactly one ACCOUNT_ID', check: 'Uniqueness + completeness', owner: 'Core banking' },
  { clause: '5.3', expectation: 'Daily row count stays within the normal range', check: 'Volume vs baseline', owner: 'Core banking' },
]

export function PolicyContract() {
  return (
    <section className={styles.section} id="contracts">
      <div className={styles.wrap}>
        <div className={styles.head}>
          <div>
            <span className={styles.eyebrow}>Data contracts</span>
            <h2 className={styles.h2}>Your policy is the data contract.</h2>
          </div>
          <p className={styles.lede}>
            Producers and consumers agree expectations once, in the policy or contract document you already keep.
            AlertMend turns each clause into a live check with an owner, so a breach is caught and routed, not discovered
            in a meeting.
          </p>
        </div>

        <div className={dd.tableWrap}>
          <table className={dd.table}>
            <thead>
              <tr>
                <th scope="col">Clause</th>
                <th scope="col">Expectation</th>
                <th scope="col">Live check</th>
                <th scope="col">Owner</th>
              </tr>
            </thead>
            <tbody>
              {CONTRACT.map((r) => (
                <tr key={r.clause}>
                  <td className={dd.mono} data-label="Clause">§{r.clause}</td>
                  <td data-label="Expectation">{r.expectation}</td>
                  <td data-label="Live check">
                    <span className={dd.checkPill}>{r.check}</span>
                  </td>
                  <td data-label="Owner">{r.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ul className={`${styles.checks} ${dd.contractPoints}`}>
          <li><Check className={styles.checkIcon} size={16} aria-hidden="true" />Every check cites the clause it enforces</li>
          <li><Check className={styles.checkIcon} size={16} aria-hidden="true" />Owners approve checks before they go live</li>
          <li><Check className={styles.checkIcon} size={16} aria-hidden="true" />Schema changes flagged before consumers break</li>
          <li><Check className={styles.checkIcon} size={16} aria-hidden="true" />Every check change versioned for audit</li>
        </ul>
      </div>
    </section>
  )
}
