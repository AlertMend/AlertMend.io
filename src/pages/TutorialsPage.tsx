import SEO from '../components/SEO'
import { PageHero, Section, CtaBand, ActionLink } from '../components/enterprise/PageKit'
import kit from '../components/enterprise/PageKit.module.css'
import { ensureUniqueMetaDescription } from '../utils/descriptionUtils'
import { calendlyUrl } from '../lib/calendly'

// Written guides from the docs. Add video links here when recordings exist.
const TUTORIALS = [
  { title: 'Connect your first Kubernetes cluster', level: 'Beginner', platform: 'Kubernetes', href: '/documentation/install-cluster-agent' },
  { title: 'Add VM and host collectors', level: 'Beginner', platform: 'Virtual machines', href: '/documentation/install-vm-collectors' },
  { title: 'Run AI root cause analysis', level: 'Beginner', platform: 'All platforms', href: '/documentation/ai-rca' },
  { title: 'Build a remediation flow with approvals', level: 'Intermediate', platform: 'All platforms', href: '/documentation/remediation-flows' },
  { title: 'Right-size Kubernetes spend', level: 'Intermediate', platform: 'Kubernetes', href: '/documentation/finops-kubernetes' },
  { title: 'Find savings in AWS', level: 'Intermediate', platform: 'AWS', href: '/documentation/finops-aws' },
]

export default function TutorialsPage() {
  const baseDescription =
    'Step-by-step AlertMend guides: connect a cluster or VMs, run AI root cause analysis, build approved remediation flows and right-size cloud spend.'
  const uniqueDescription = ensureUniqueMetaDescription(baseDescription, 'tutorials', 'tutorials')

  return (
    <>
      <SEO
        title="AlertMend Tutorials: Step-by-Step Guides"
        description={uniqueDescription}
        keywords="AlertMend tutorials, Kubernetes tutorial, root cause analysis tutorial, remediation flow tutorial"
        canonical="/tutorials"
        breadcrumbData={{ items: [{ label: 'Tutorials' }] }}
      />

      <PageHero
        eyebrow="Tutorials"
        title="Step-by-step guides for your first week."
        lede="Written walkthroughs for the most common first tasks, from connecting a cluster to approving your first automated fix."
      />

      <Section title="Guides">
        <ul className={kit.rows}>
          {TUTORIALS.map((t) => (
            <li key={t.href} className={kit.row}>
              <h3 className={kit.rowTitle}>{t.title}</h3>
              <p className={kit.rowMeta}>
                {t.platform} · {t.level}
              </p>
              <ActionLink action={{ label: 'Read guide', href: t.href }} variant="text" />
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand
        title="Want a guided setup?"
        lede="We will connect AlertMend to your environment with you in one session."
        primary={{ label: 'Book a session', href: calendlyUrl('tutorials-page') }}
        secondary={{ label: 'Documentation', href: '/documentation' }}
      />
    </>
  )
}
