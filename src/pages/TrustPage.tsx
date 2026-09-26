import { Link } from 'react-router-dom'
import { Bot, ClipboardCheck, KeyRound, ScrollText, ShieldCheck, UserCheck } from 'lucide-react'
import SEO from '../components/SEO'
import SovereigntySection from '../components/enterprise/SovereigntySection'
import styles from '../components/enterprise/Enterprise.module.css'
import { calendlyUrl } from '../lib/calendly'

const AI = [
  {
    icon: Bot,
    title: 'Bring your own model',
    body: 'Point AlertMend at a private or self-hosted model. Prompts, telemetry and data results never have to reach a public AI provider.',
  },
  {
    icon: UserCheck,
    title: 'AI proposes, people approve',
    body: 'AI proposes data quality checks and remediation steps. Nothing goes live or runs in production until an authorised person approves it.',
  },
  {
    icon: ClipboardCheck,
    title: 'Recommend, not execute, by default',
    body: 'Automated fixes start in recommend mode. When enabled, they run only after approval and are verified after they run.',
  },
]

const ACCESS = [
  {
    icon: KeyRound,
    title: 'Role-based access',
    body: 'Granular roles decide who can view, propose, approve and execute, across data checks and infrastructure actions.',
  },
  {
    icon: ScrollText,
    title: 'Complete audit trail',
    body: 'Every suggestion, approval, check change and executed step is recorded with who and when.',
  },
  {
    icon: ShieldCheck,
    title: 'Separation of duties',
    body: 'The person who proposes a change does not have to be the person who approves it; approval policies are yours to set.',
  },
]

const COMPLIANCE = [
  { name: 'SOC 2 Type II', status: 'In progress' },
  { name: 'ISO 27001', status: 'In progress' },
  { name: 'GDPR', status: 'Aligned' },
]

export default function TrustPage() {
  return (
    <>
      <SEO
        title="Trust Center: Security, Sovereignty & Compliance | AlertMend"
        description="How AlertMend keeps your data in your boundary: in-network agents, regional hosting, hybrid and air-gapped deployment, bring your own model, approvals and audit."
        canonical="/trust"
        keywords="AlertMend trust center, data sovereignty, data residency, air-gapped deployment, bring your own model, SOC 2, ISO 27001, GDPR"
        breadcrumbData={{ items: [{ label: 'Trust center' }] }}
      />

      <section className={styles.pageHero}>
        <div className={styles.wrap}>
          <span className={styles.eyebrow}>Trust center</span>
          <h1 className={styles.h1}>Your data, your boundary, your approval.</h1>
          <p className={styles.lede}>
            How AlertMend is deployed, what data it touches, how AI is used, and who can do what.
            Written for security reviewers, data protection officers and platform owners.
          </p>
          <div className={styles.heroCtas}>
            <a href={calendlyUrl('trust-center')} target="_blank" rel="noopener noreferrer" className={styles.btnPrimary}>
              Request security documentation
            </a>
            <Link to="/security" className={styles.btnSecondary}>
              Security practices
            </Link>
          </div>
        </div>
      </section>

      <SovereigntySection
        tone="light"
        eyebrow="Deployment and data residency"
        title="Four ways to run AlertMend."
        lede="Pick the model your security team and regulator require. The product, the audit trail and the approval model are the same in each."
        showMore={false}
      />

      <section className={styles.sectionAlt}>
        <div className={styles.wrap}>
          <div className={styles.head}>
            <div>
              <span className={styles.eyebrow}>AI and your data</span>
              <h2 className={styles.h2}>AI that stays accountable.</h2>
            </div>
            <p className={styles.lede}>
              AlertMend uses AI to find causes and propose checks and fixes. You choose the model, and
              people stay in control of every change.
            </p>
          </div>
          <div className={styles.grid3}>
            {AI.map((it) => (
              <div key={it.title} className={styles.cell}>
                <it.icon size={22} strokeWidth={1.5} className={styles.icon} />
                <h3 className={styles.cellTitle}>{it.title}</h3>
                <p className={styles.cellBody}>{it.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.wrap}>
          <div className={styles.head}>
            <div>
              <span className={styles.eyebrow}>Access and audit</span>
              <h2 className={styles.h2}>Who can do what, on the record.</h2>
            </div>
            <p className={styles.lede}>
              The same controls cover data quality checks and infrastructure actions.
            </p>
          </div>
          <div className={styles.grid3}>
            {ACCESS.map((it) => (
              <div key={it.title} className={styles.cell}>
                <it.icon size={22} strokeWidth={1.5} className={styles.icon} />
                <h3 className={styles.cellTitle}>{it.title}</h3>
                <p className={styles.cellBody}>{it.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.sectionAlt}>
        <div className={styles.wrap}>
          <div className={styles.head}>
            <div>
              <span className={styles.eyebrow}>Compliance</span>
              <h2 className={styles.h2}>Where we are today.</h2>
            </div>
            <p className={styles.lede}>
              We report status plainly. Ask us for the current control set and audit timelines.
            </p>
          </div>
          <div className={styles.grid3}>
            {COMPLIANCE.map((c) => (
              <div key={c.name} className={styles.cell}>
                <h3 className={styles.cellTitle}>{c.name}</h3>
                <span className={styles.tag}>{c.status}</span>
              </div>
            ))}
          </div>
          <p className={styles.cellBody} style={{ marginTop: 24 }}>
            More detail: <Link to="/compliance" style={{ color: '#6d28d9' }}>Compliance</Link> ·{' '}
            <Link to="/security" style={{ color: '#6d28d9' }}>Security practices</Link> ·{' '}
            <Link to="/privacy" style={{ color: '#6d28d9' }}>Privacy policy</Link>
          </p>
        </div>
      </section>

      <section className={styles.cta}>
        <div className={`${styles.wrap} ${styles.ctaInner}`}>
          <div>
            <h2 className={styles.h2}>Running a security review?</h2>
            <p className={styles.lede}>
              We will walk your security, data protection and platform teams through the deployment
              model that fits, and answer your questionnaire.
            </p>
          </div>
          <div className={styles.heroCtas} style={{ marginTop: 0 }}>
            <a href={calendlyUrl('trust-center-review')} target="_blank" rel="noopener noreferrer" className={styles.btnPrimary}>
              Book a security review
            </a>
            <Link to="/contact" className={styles.btnSecondary}>
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
