import { Lock, KeyRound, ScrollText, ShieldCheck, Server, Eye, ArrowUpRight, GitBranch, Clock3, Database } from 'lucide-react'
import SEO from '../components/SEO'
import { PageHero, Section, CellGrid, CtaBand } from '../components/enterprise/PageKit'
import styles from '../components/enterprise/Enterprise.module.css'
import { ensureUniqueMetaDescription } from '../utils/descriptionUtils'
import { calendlyUrl } from '../lib/calendly'

// TODO(founders): confirm AES-256 at rest, mandatory MFA and the penetration
// testing cadence before a security review relies on this page.
const PLATFORM = [
  {
    icon: Lock,
    title: 'Encryption',
    body: 'Data is encrypted in transit and at rest using AES-256.',
  },
  {
    icon: KeyRound,
    title: 'Role-based access',
    body: 'Roles decide who can view, propose, approve and execute, for data checks and infrastructure actions alike.',
  },
  {
    icon: ScrollText,
    title: 'Audit logging',
    body: 'Every suggestion, approval, change and executed step is recorded with who did it and when.',
  },
  {
    icon: ShieldCheck,
    title: 'Compliance programmes',
    body: 'SOC 2 Type II and ISO 27001 are in progress. Data handling is aligned with GDPR.',
  },
]

const DATA_AGENT = [
  {
    icon: Server,
    title: 'Credentials stay in your network',
    body: 'A customer-hosted agent holds warehouse and BI credentials. AlertMend stores no warehouse secrets.',
  },
  {
    icon: Eye,
    title: 'Read-only by design',
    body: 'The agent refuses anything that is not a read query and caps query time.',
  },
  {
    icon: ArrowUpRight,
    title: 'Outbound only',
    body: 'The agent connects out to AlertMend. No inbound ports are opened in your network.',
  },
  {
    icon: Database,
    title: 'Least privilege',
    body: 'A generated grant script creates a read-only role with only the access your checks need.',
  },
  {
    icon: GitBranch,
    title: 'Versioned changes',
    body: 'Every check change is versioned with a reason and can be rolled back. Secrets are redacted from the audit log.',
  },
  {
    icon: Clock3,
    title: 'Retention you control',
    body: 'Check results are kept for 90 days and the audit log for one year by default. Both are configurable.',
  },
]

const PRACTICES = [
  'Multi-factor authentication required',
  'Regular security audits and penetration testing',
  'Automated vulnerability scanning',
  'Secure API endpoints with rate limiting',
  'Regular automated backups',
  'Documented data retention policies',
]

export default function SecurityPage() {
  const baseDescription =
    'AlertMend security: encryption, role-based access, audit logs, a read-only data agent that keeps credentials in your network, and SOC 2 Type II and ISO 27001 programmes in progress.'
  const uniqueDescription = ensureUniqueMetaDescription(baseDescription, 'security', 'security')

  return (
    <>
      <SEO
        title="Security at AlertMend: Controls and Practices"
        description={uniqueDescription}
        keywords="AlertMend security, read-only data agent, RBAC, audit log, encryption, SOC 2, ISO 27001, GDPR"
        canonical="/security"
        breadcrumbData={{ items: [{ label: 'Security' }] }}
      />

      <PageHero
        eyebrow="Security"
        title="Controls built for production data."
        lede="How AlertMend protects your credentials, your data and your systems, from the agent in your network to approvals and audit."
        primary={{ label: 'Request security documentation', href: calendlyUrl('security-page') }}
        secondary={{ label: 'Trust center', href: '/trust' }}
      />

      <Section eyebrow="Platform" title="Platform controls">
        <CellGrid items={PLATFORM} cols={4} />
      </Section>

      <Section
        alt
        eyebrow="Data observability"
        title="How your data stays safe"
        lede="For data quality, a customer-hosted agent keeps credentials in your network and only runs read queries."
      >
        <CellGrid items={DATA_AGENT} />
      </Section>

      <Section eyebrow="Operations" title="Security practices">
        <ul className={styles.checks}>
          {PRACTICES.map((p) => (
            <li key={p}>
              <ShieldCheck className={styles.checkIcon} size={16} aria-hidden="true" />
              {p}
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand
        title="Running a security review?"
        lede="We will walk your team through architecture, data flows and controls, and share our documentation."
        primary={{ label: 'Request documentation', href: calendlyUrl('security-page-cta') }}
        secondary={{ label: 'Compliance status', href: '/compliance' }}
      />
    </>
  )
}
