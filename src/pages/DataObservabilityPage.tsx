import { useEffect, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Plug,
  FileText,
  BellRing,
  ListChecks,
  TrendingUp,
  GitBranch,
  MessageSquare,
  Gauge,
  BellOff,
  ShieldCheck,
  Lock,
  History,
  KeyRound,
  CheckCircle2,
  Clock3,
  Scale,
  Eye,
} from 'lucide-react'
import SEO from '../components/SEO'
import GovernanceSection from '../components/enterprise/GovernanceSection'
import SovereigntySection from '../components/enterprise/SovereigntySection'
import { LineageImpact, PolicyContract } from '../components/enterprise/DataDepth'
import PlatformBoardMock from '../components/mocks/PlatformBoardMock'
import PlatformBoardStage from '../components/mocks/PlatformBoardStage'
import BrandLogo from '../components/ui/BrandLogo'
import { withBrandLogo } from '../data/brandLogos'
import { ensureUniqueMetaDescription } from '../utils/descriptionUtils'
import styles from './DataObservabilityPage.module.css'
import { calendlyUrl } from '../lib/calendly'

/**
 * /data-observability — dedicated data observability product page.
 */

const DEMO_URL = calendlyUrl('data-observability-page')
const SIGNUP_URL = 'https://app.alertmend.io/signup?service=data-observability'

const PROOF = [
  { value: '87', label: 'Check types ready', hint: 'No SQL required' },
  { value: 'Policy → checks', label: 'From your PDF', hint: 'Clause cited on every check' },
  { value: 'Read-only', label: 'Agent in your network', hint: 'Credentials never leave' },
  { value: 'Cause + impact', label: 'In one alert', hint: 'Job + Power BI reports' },
]

const PILLARS = [
  {
    icon: Eye,
    title: 'Monitor',
    body: 'Freshness, volume, schema changes, uniqueness, completeness, validity, anomalies and trends across the datasets and pipelines that matter.',
    points: ['87 ready-made checks', 'History-aware anomalies', 'Quality score that cannot hide a fail'],
  },
  {
    icon: FileText,
    title: 'Govern',
    body: 'Start from the policy you already have. Every live check names the clause it enforces.',
    points: ['Upload BCBS 239 or internal DQ PDFs', 'Approve before anything goes live', 'Business glossary links'],
  },
  {
    icon: GitBranch,
    title: 'Trace',
    body: 'When a check fails, see the pipeline job that broke and the reports that will show the wrong number.',
    points: ['Airflow and Oracle ODI', 'Power BI downstream lineage', 'Slack or Teams with context'],
  },
  {
    icon: ShieldCheck,
    title: 'Trust',
    body: 'Built for regulated data offices: outbound-only agent, least privilege, versioning and rollback.',
    points: ['No warehouse secrets in AlertMend', 'Audit trail on every change', 'SOC 2 / ISO in progress'],
  },
]

const STEPS = [
  {
    n: '01',
    icon: Plug,
    title: 'Connect safely',
    body: 'Install a read-only agent in your network. Point it at your warehouse. Credentials stay on your side.',
  },
  {
    n: '02',
    icon: FileText,
    title: 'Upload your policy',
    body: 'AlertMend proposes checks from the PDF. Each one cites its clause. Nothing monitors until you approve.',
  },
  {
    n: '03',
    icon: BellRing,
    title: 'Watch and act',
    body: 'Failing checks page Slack or Teams with the failed job and affected Power BI reports.',
  },
]

const DEEP = [
  {
    id: 'policy',
    eyebrow: 'Policy to checks',
    title: 'Your written rules become live observability',
    body: 'Upload BCBS 239, an internal DQ standard, or a data contract PDF. AlertMend proposes the checks, each linked to the clause it enforces. You approve every one. Auditors get a trail instead of a scavenger hunt.',
    chips: ['BCBS 239', 'Internal DQ policy', 'Clause trace', 'Human approve'],
    visual: 'policy',
  },
  {
    id: 'pipelines',
    eyebrow: 'Cause and impact',
    title: 'Know the job and the report before 9am',
    body: 'A uniqueness fail on BANKING.CUSTOMER_ACCOUNTS is not just a red badge. It is linked to the ODI or Airflow run that broke, with the error message, and the Power BI reports that read the table.',
    chips: ['Airflow', 'Oracle ODI', 'Power BI', 'Teams / Slack'],
    visual: 'impact',
  },
  {
    id: 'copilot',
    eyebrow: 'Copilot',
    title: 'Ask in English. Approve every change.',
    body: 'Add, edit or route checks in plain language. The Copilot only proposes. A person still has to approve. Nothing writes to your warehouse data.',
    chips: ['Plain English', 'Proposals only', 'Full audit'],
    visual: 'copilot',
  },
]

const FEATURES = [
  {
    icon: ListChecks,
    title: '87 ready-made checks',
    body: 'Completeness, uniqueness, validity, format, referential integrity, numeric, volume, freshness, anomaly and trend, built in a wizard.',
  },
  {
    icon: TrendingUp,
    title: 'Anomaly and trend',
    body: 'Checks learn each dataset’s history. Without enough history, a check waits instead of guessing.',
  },
  {
    icon: Gauge,
    title: 'Quality score',
    body: 'One score per dataset and overall. A failing check caps the score so averages cannot hide a problem.',
  },
  {
    icon: MessageSquare,
    title: 'Data Quality Copilot',
    body: 'Propose add, edit or route in plain English. Every change stays a proposal until you approve.',
  },
  {
    icon: BellOff,
    title: 'Alerts without noise',
    body: 'Cooldowns, maintenance windows and flapping detection, with incidents and escalation when it matters.',
  },
  {
    icon: History,
    title: 'Version and rollback',
    body: 'Every check change is versioned with a reason and can be rolled back.',
  },
]

const STACK = [
  'Snowflake',
  'Oracle',
  'BigQuery',
  'Redshift',
  'Databricks',
  'Postgres',
  'dbt',
  'Airflow',
  'Oracle ODI',
  'Power BI',
  'Slack',
  'Microsoft Teams',
] as const

function StackLogo({ label }: { label: string }) {
  const brand = withBrandLogo({ label })
  return (
    <BrandLogo
      src={brand.logoSrc}
      slug={brand.iconSlug}
      tint={brand.logoTint}
      domain={brand.domain}
      alt=""
      className={styles.stackLogo}
    />
  )
}

const SECURITY = [
  {
    icon: Lock,
    title: 'Read-only by design',
    body: 'The agent refuses anything but read queries and caps query time.',
  },
  {
    icon: KeyRound,
    title: 'Credentials stay home',
    body: 'The agent holds warehouse credentials. AlertMend stores none.',
  },
  {
    icon: ShieldCheck,
    title: 'Outbound only',
    body: 'The agent connects out. No inbound ports in your network.',
  },
  {
    icon: ListChecks,
    title: 'Least privilege',
    body: 'A generated grant script sets up a read-only role.',
  },
]

const FAQS: { q: string; a: ReactNode }[] = [
  {
    q: 'Is this data observability or data quality?',
    a: 'Both. You get monitored checks across datasets, plus governance: policy-to-checks, clause citations, approvals and an audit trail.',
  },
  {
    q: 'Does our data leave our network?',
    a: 'No. The agent runs queries inside your network and sends back only results.',
  },
  {
    q: 'Does AI change our data or checks on its own?',
    a: 'No. It proposes checks. A person approves each one. Nothing writes to your data.',
  },
  {
    q: 'Which policies can we upload?',
    a: 'Any text-based PDF: BCBS 239, internal DQ standards or data contracts.',
  },
  {
    q: 'How long does setup take?',
    a: 'Connecting takes minutes. Most of the time is reviewing proposed checks with data owners.',
  },
  {
    q: 'Can we use it beside our current DQ tool?',
    a: 'Yes. It runs alongside existing tools.',
  },
  {
    q: 'How is it priced?',
    a: (
      <>
        A plan price with unlimited checks and users.{' '}
        <Link to="/pricing#data">See data pricing</Link>.
      </>
    ),
  },
]

function IncidentPanel() {
  const rows = [
    { metric: 'uniqueness · account_id', value: '98.7% (expected 100%)', tone: 'crit' as const },
    { metric: 'completeness · customer_id', value: '100%', tone: 'ok' as const },
    { metric: 'freshness', value: 'on time', tone: 'ok' as const },
  ]
  return (
    <div className={styles.incidentPanel}>
      <div className={styles.incidentHead}>
        <span>BANKING.CUSTOMER_ACCOUNTS · Snowflake</span>
        <b>1 check failing</b>
      </div>
      <div className={styles.incidentRows}>
        {rows.map((r) => (
          <div key={r.metric} className={r.tone === 'crit' ? styles.rowCrit : styles.rowOk}>
            <span>{r.metric}</span>
            <strong>{r.value}</strong>
          </div>
        ))}
      </div>
      <div className={styles.incidentCause}>
        <span>Cause and impact</span>
        <p>
          ODI job <b>nightly_load</b> failed with <code>ORA-01400</code>. 3 Power BI reports read
          this table. Policy: BCBS 239, Principle 3.
        </p>
      </div>
    </div>
  )
}

function DeepVisual({ kind }: { kind: string }) {
  if (kind === 'policy') {
    return (
      <div className={styles.mockCard}>
        <div className={styles.mockLabel}>Policy upload · BCBS 239</div>
        <div className={styles.mockList}>
          {[
            ['Principle 3 · Accuracy', 'Uniqueness on account_id', 'Proposed'],
            ['Principle 3 · Integrity', 'Completeness on customer_id', 'Approved'],
            ['Principle 4 · Timeliness', 'Freshness · daily_balance', 'Proposed'],
          ].map(([clause, check, state]) => (
            <div key={check} className={styles.mockRow}>
              <div>
                <strong>{check}</strong>
                <span>{clause}</span>
              </div>
              <em className={state === 'Approved' ? styles.stateOk : styles.stateWait}>{state}</em>
            </div>
          ))}
        </div>
      </div>
    )
  }
  if (kind === 'impact') {
    return (
      <div className={styles.mockCard}>
        <div className={styles.mockLabel}>Failing check · last 15m</div>
        <div className={styles.mockList}>
          <div className={styles.mockRow}>
            <div>
              <strong>Uniqueness · account_id</strong>
              <span>customer_accounts · 98.7%</span>
            </div>
            <em className={styles.stateHot}>Job linked</em>
          </div>
          <div className={styles.mockImpact}>
            <p>
              <b>nightly_load</b> · ORA-01400
            </p>
            <p>3 Power BI reports affected</p>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className={styles.mockCard}>
      <div className={styles.mockLabel}>Copilot · proposal</div>
      <div className={styles.mockChat}>
        <p className={styles.mockUser}>Add a freshness check on loans.daily_balance for BCBS Principle 4</p>
        <p className={styles.mockBot}>
          Proposed: freshness · loans.daily_balance · max lag 2h · cites Principle 4. Awaiting
          approval.
        </p>
      </div>
      <div className={styles.mockActions}>
        <span>Reject</span>
        <strong>Approve</strong>
      </div>
    </div>
  )
}

export default function DataObservabilityPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  const baseDescription =
    'Data observability from your quality policy. Live checks across Snowflake, BigQuery, Redshift, Databricks, Oracle and Postgres, plus dbt, Airflow, Power BI impact, and a read-only agent in your network.'
  const description = ensureUniqueMetaDescription(
    baseDescription,
    'data-observability',
    'data-observability',
  )

  return (
    <div className={styles.page}>
      <SEO
        title="Data Observability, Governance & Sovereignty | AlertMend"
        description={description}
        keywords="data observability, data quality monitoring, Snowflake, BigQuery, Redshift, Databricks, Postgres, dbt, Airflow, Power BI, AlertMend"
        canonical="/data-observability"
      />

      {/* ---- Hero ---- */}
      <section className={styles.hero}>
        <div className={styles.heroWash} aria-hidden />
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <span className={styles.badge}>
              <i className={styles.badgeDot} />
              Data quality · Governance · Sovereignty
            </span>
            <h1 className={styles.h1}>
              See bad data before the dashboard does,{' '}
              <span className={styles.accent}>from the policy you already have</span>
            </h1>
            <p className={styles.lede}>
              AlertMend turns written data quality rules into live checks across your warehouse and
              lakehouse. When something fails, you get the pipeline job and the Power BI reports in
              one alert, with credentials that never leave your network.
            </p>
            <div className={styles.heroCtas}>
              <a
                href={DEMO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.btnPrimary}
              >
                Book a data demo <ArrowRight className={styles.btnIcon} />
              </a>
              <a
                href={SIGNUP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.btnSecondary}
              >
                Start free
              </a>
            </div>
            <ul className={styles.heroChecks}>
              {[
                'Checks cite the policy clause',
                'Read-only agent in your network',
                'Every change approved and audited',
              ].map((t) => (
                <li key={t}>
                  <CheckCircle2 size={15} strokeWidth={2.2} />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.heroVisual}>
            <PlatformBoardStage split>
              <PlatformBoardMock activeProduct="dataobs" />
            </PlatformBoardStage>
          </div>
        </div>
      </section>

      {/* ---- Proof ---- */}
      <section className={styles.proof}>
        <div className={styles.wrap}>
          <div className={styles.proofGrid}>
            {PROOF.map((p) => (
              <div key={p.label} className={styles.proofItem}>
                <strong>{p.value}</strong>
                <span>{p.label}</span>
                <em>{p.hint}</em>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Pillars ---- */}
      <section className={styles.section}>
        <div className={styles.wrap}>
          <header className={styles.secHead}>
            <span className="sec-tag">What data observability means here</span>
            <h2>Monitor. Govern. Trace. Trust.</h2>
            <p>
              Not another check farm. Observability that starts from policy, stays in your network,
              and tells you what broke and who will notice.
            </p>
          </header>
          <div className={styles.pillarGrid}>
            {PILLARS.map((p) => (
              <article key={p.title} className={styles.pillar}>
                <span className={styles.pillarIcon}>
                  <p.icon size={18} strokeWidth={1.7} />
                </span>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
                <ul>
                  {p.points.map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <LineageImpact />

      <PolicyContract />

      <GovernanceSection />

      <SovereigntySection />

      {/* ---- How it works ---- */}
      <section className={styles.sectionAlt} id="policy">
        <div className={styles.wrap}>
          <header className={styles.secHead}>
            <span className="sec-tag">How it works</span>
            <h2>From policy PDF to live checks</h2>
            <p>Connect once. Approve the proposals. Get alerts that carry cause and impact.</p>
          </header>
          <div className={styles.steps}>
            {STEPS.map((s) => (
              <article key={s.n} className={styles.step}>
                <div className={styles.stepTop}>
                  <span className={styles.stepNum}>{s.n}</span>
                  <span className={styles.pillarIcon}>
                    <s.icon size={16} strokeWidth={1.7} />
                  </span>
                </div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Deep dives ---- */}
      <section className={styles.section}>
        <div className={styles.wrapNarrow}>
          {DEEP.map((d, i) => (
            <article
              key={d.id}
              id={d.id === 'pipelines' ? 'pipelines' : undefined}
              className={`${styles.deep} ${i % 2 === 1 ? styles.deepFlip : ''}`}
            >
              <div className={styles.deepCopy}>
                <span className={styles.deepEyebrow}>{d.eyebrow}</span>
                <h2>{d.title}</h2>
                <p>{d.body}</p>
                <div className={styles.chips}>
                  {d.chips.map((c) => (
                    <span key={c}>{c}</span>
                  ))}
                </div>
              </div>
              <DeepVisual kind={d.visual} />
            </article>
          ))}
        </div>
      </section>

      {/* ---- Feature grid ---- */}
      <section className={styles.sectionAlt}>
        <div className={styles.wrap}>
          <header className={styles.secHead}>
            <span className="sec-tag">Capability set</span>
            <h2>Everything a regulated data office needs to run checks</h2>
            <p>Built capabilities only. No vaporware connectors or auto-remediation of your data.</p>
          </header>
          <div className={styles.featureGrid}>
            {FEATURES.map((f) => (
              <article key={f.title} className={styles.feature}>
                <span className={styles.pillarIcon}>
                  <f.icon size={16} strokeWidth={1.7} />
                </span>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Incident story ---- */}
      <section className={styles.story}>
        <div className={styles.wrap}>
          <div className={styles.storyGrid}>
            <div>
              <span className={styles.storyTag}>Bad data at 06:12</span>
              <h2>The nightly load failed. The report was fixed before the meeting.</h2>
              <p>
                The ODI load stopped on an Oracle error. AlertMend failed the linked uniqueness
                check, named the job and the error, and listed the three Power BI reports that read
                the table.
              </p>
              <ol className={styles.storySteps}>
                {[
                  'Uniqueness check fails on BANKING.CUSTOMER_ACCOUNTS',
                  'Linked to ODI job nightly_load: ORA-01400',
                  '3 Power BI reports flagged as affected',
                  'Alert in Teams with the policy clause',
                ].map((t, i) => (
                  <li key={t}>
                    <span>{i + 1}</span>
                    {t}
                  </li>
                ))}
              </ol>
              <Link to="/security" className={styles.storyLink}>
                How your data stays safe <ArrowRight size={16} />
              </Link>
            </div>
            <IncidentPanel />
          </div>
        </div>
      </section>

      {/* ---- Stack ---- */}
      <section className={styles.section}>
        <div className={styles.wrap}>
          <div className={styles.stackLayout}>
            <div>
              <span className="sec-tag">Works with</span>
              <h2 className={styles.stackH2}>Your data stack</h2>
              <p className={styles.stackBody}>
                Warehouses and lakes for checks. dbt and Airflow for pipelines. Power BI for
                report impact. Alerts where your team already works.
              </p>
            </div>
            <div className={styles.stackGrid}>
              {STACK.map((label) => (
                <span key={label} className={styles.stackItem}>
                  <StackLogo label={label} />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---- Security ---- */}
      <section className={styles.sectionAlt}>
        <div className={styles.wrap}>
          <header className={styles.secHead}>
            <span className="sec-tag">Built for regulated data</span>
            <h2>Enterprise controls without moving your warehouse</h2>
            <p>
              Banks and operators need proof. AlertMend is designed so secrets stay home and every
              change is auditable.
            </p>
          </header>
          <div className={styles.securityGrid}>
            {SECURITY.map((s) => (
              <article key={s.title} className={styles.securityCard}>
                <span className={styles.pillarIcon}>
                  <s.icon size={16} strokeWidth={1.7} />
                </span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </article>
            ))}
          </div>
          <div className={styles.securityExtra}>
            <div className={styles.valueRow}>
              <span>
                <Clock3 size={16} strokeWidth={1.7} /> Live in minutes, not quarters
              </span>
              <span>
                <Scale size={16} strokeWidth={1.7} /> Clause-citable checks
              </span>
              <span>
                <ShieldCheck size={16} strokeWidth={1.7} /> SOC 2 Type II &amp; ISO 27001 in progress
              </span>
            </div>
            <Link to="/security" className={styles.storyLink}>
              Read the security model <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ---- FAQ ---- */}
      <section className={styles.section}>
        <div className={styles.wrapTight}>
          <header className={styles.secHead}>
            <span className="sec-tag">FAQ</span>
            <h2>Questions data teams ask first</h2>
          </header>
          <div className={styles.faq}>
            {FAQS.map((f) => (
              <details key={f.q} className={styles.faqItem}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
          <p className={styles.crossLink}>
            Also run Kubernetes or VMs?{' '}
            <Link to="/observability">See AlertMend for infrastructure →</Link>
          </p>
        </div>
      </section>

      {/* ---- CTA ---- */}
      <section className={styles.ctaBand}>
        <div className={styles.wrapTight}>
          <h2>See a banking policy turned into live checks</h2>
          <p>
            Thirty minutes on a sample BCBS-style policy, or a pilot on your own warehouse data.
          </p>
          <div className={styles.heroCtas}>
            <a
              href={DEMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnPrimary}
            >
              Book the data demo <ArrowRight className={styles.btnIcon} />
            </a>
            <Link to="/contact" className={styles.btnSecondary}>
              Talk with us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
