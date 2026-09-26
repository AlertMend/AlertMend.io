import { FileSearch, Users, Globe2 } from 'lucide-react'
import SEO from '../components/SEO'
import { PageHero, Section, CellGrid, CtaBand, ActionLink } from '../components/enterprise/PageKit'
import kit from '../components/enterprise/PageKit.module.css'
import { ensureUniqueMetaDescription } from '../utils/descriptionUtils'

const JOBS = [
  { title: 'Senior DevOps engineer', location: 'Singapore or remote', type: 'Full-time', department: 'Engineering' },
  { title: 'AI/ML engineer', location: 'Singapore or remote', type: 'Full-time', department: 'Engineering' },
  { title: 'Product manager', location: 'Singapore', type: 'Full-time', department: 'Product' },
  { title: 'Customer success manager', location: 'Remote', type: 'Full-time', department: 'Customer success' },
]

const WHY = [
  {
    icon: FileSearch,
    title: 'Hard, real problems',
    body: 'Root cause across data and infrastructure, safe automation, and AI that has to show its evidence.',
  },
  {
    icon: Users,
    title: 'Close to customers',
    body: 'Engineers talk to the data and platform teams who use what they build, every week.',
  },
  {
    icon: Globe2,
    title: 'Small team, wide scope',
    body: 'Singapore-based with remote colleagues. You will own features end to end.',
  },
]

export default function CareersPage() {
  const baseDescription =
    'Careers at AlertMend: open roles in engineering, product and customer success. Apply by email, or send your CV for future roles.'
  const uniqueDescription = ensureUniqueMetaDescription(baseDescription, 'careers', 'careers')

  return (
    <>
      <SEO
        title="Careers at AlertMend: Open Roles"
        description={uniqueDescription}
        keywords="AlertMend careers, DevOps jobs, SRE jobs, AI engineer jobs, data engineering jobs Singapore"
        canonical="/careers"
        breadcrumbData={{ items: [{ label: 'Careers' }] }}
      />

      <PageHero
        eyebrow="Careers"
        title="Help teams trust their data and their systems."
        lede="We are building observability that explains failures with evidence and fixes them with approval. We hire people who care about reliability and clear thinking."
        primary={{ label: 'See open roles', href: '#roles', external: true }}
      />

      <Section id="roles" eyebrow="Open roles" title={`${JOBS.length} open positions`}>
        <ul className={kit.rows}>
          {JOBS.map((job) => (
            <li key={job.title} className={kit.row}>
              <div>
                <h3 className={kit.rowTitle}>{job.title}</h3>
                <p className={kit.rowMeta}>{job.department}</p>
              </div>
              <p className={kit.rowMeta}>
                {job.location} · {job.type}
              </p>
              <ActionLink
                variant="text"
                action={{
                  label: 'Apply by email',
                  href: `mailto:careers@alertmend.io?subject=${encodeURIComponent(`Application: ${job.title}`)}`,
                }}
              />
            </li>
          ))}
        </ul>
      </Section>

      <Section alt eyebrow="Why AlertMend" title="What working here is like">
        <CellGrid items={WHY} />
      </Section>

      <CtaBand
        title="No role that fits?"
        lede="Send us your CV and a note on what you would like to work on."
        primary={{ label: 'Email careers@alertmend.io', href: 'mailto:careers@alertmend.io' }}
        secondary={{ label: 'About the team', href: '/about' }}
      />
    </>
  )
}
