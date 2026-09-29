import { BookOpen, FileCheck2, GitBranch, History, Gauge, UserCheck, Database, FileBarChart2 } from 'lucide-react'
import styles from './Enterprise.module.css'
import wb from './GovernanceSection.module.css'

/**
 * Data governance capabilities of AlertMend Data Observability.
 * Every item maps to a feature described on /data-observability.
 */
const ITEMS = [
  {
    icon: FileCheck2,
    title: 'Policy-to-control traceability',
    body: 'Upload your data quality policy or data contract. Each proposed check cites the clause it enforces, so every control traces back to the rule it exists for.',
  },
  {
    icon: UserCheck,
    title: 'Ownership and approval',
    body: 'Data owners approve every check before it goes live. Changes requested in plain English through the Data Quality Copilot are proposals, never silent edits.',
  },
  {
    icon: History,
    title: 'Versioned, reversible changes',
    body: 'Every check change is versioned with who made it and why, and can be rolled back. Audit export is available on Business and Enterprise plans.',
  },
  {
    icon: GitBranch,
    title: 'Lineage to cause and impact',
    body: 'A failed check is linked to the Airflow or Oracle ODI job that caused it and to the Power BI reports that read the table.',
  },
  {
    icon: BookOpen,
    title: 'Business glossary',
    body: 'Link checks to the business terms your teams already use, so a failure is described in the language of the data owner, not only the table name.',
  },
  {
    icon: Gauge,
    title: 'Scores that cannot hide failures',
    body: 'A quality score per dataset and overall. A failing critical check caps the score, so an average never masks a problem.',
  },
]

export default function GovernanceSection() {
  return (
    <section className={styles.section} id="governance">
      <div className={styles.wrap}>
        <div className={styles.head}>
          <div>
            <span className={styles.eyebrow}>Data governance</span>
            <h2 className={styles.h2}>Governance you can show an auditor.</h2>
          </div>
          <p className={styles.lede}>
            For any clause in your policy, show the checks that enforce it, who approved them, and
            when they last passed. Quality monitoring becomes evidence, not a quarterly spreadsheet.
          </p>
        </div>
        <div className={styles.grid3}>
          {ITEMS.map((it) => (
            <div key={it.title} className={styles.cell}>
              <it.icon size={22} strokeWidth={1.5} className={styles.icon} />
              <h3 className={styles.cellTitle}>{it.title}</h3>
              <p className={styles.cellBody}>{it.body}</p>
            </div>
          ))}
        </div>

        <div className={wb.writeBack}>
          <div className={wb.wbHead}>
            <h3 className={wb.wbTitle}>Results written back to your own systems</h3>
            <span className={styles.tag}>Business and Enterprise</span>
          </div>
          <div className={wb.wbGrid}>
            <div className={wb.wbItem}>
              <Database size={20} strokeWidth={1.6} className={styles.icon} aria-hidden="true" />
              <div>
                <h4 className={wb.wbItemTitle}>In your warehouse</h4>
                <p className={styles.cellBody}>
                  Check results, quality scores, incidents and lineage are written to tables you own. Build your own
                  reports, join them to your data and keep the history in your own systems.
                </p>
              </div>
            </div>
            <div className={wb.wbItem}>
              <FileBarChart2 size={20} strokeWidth={1.6} className={styles.icon} aria-hidden="true" />
              <div>
                <h4 className={wb.wbItemTitle}>In Power BI</h4>
                <p className={styles.cellBody}>
                  The quality status of the data behind each report is pushed to Power BI, so business users see a
                  failing check where they already work.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
