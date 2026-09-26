import { useState } from 'react'
import { Linkedin, FileSearch, UserCheck, Server, Layers } from 'lucide-react'
import SEO from '../components/SEO'
import { PageHero, Section, CellGrid, CtaBand } from '../components/enterprise/PageKit'
import styles from '../components/enterprise/Enterprise.module.css'
import kit from '../components/enterprise/PageKit.module.css'
import { ensureUniqueMetaDescription } from '../utils/descriptionUtils'
import { calendlyUrl } from '../lib/calendly'

const PRINCIPLES = [
  {
    icon: FileSearch,
    title: 'Evidence before opinions',
    body: 'Every alert, root cause and failed data check links to the query, log or policy clause behind it.',
  },
  {
    icon: UserCheck,
    title: 'People approve changes',
    body: 'AI proposes checks and fixes. Nothing reaches production until an authorised person approves it.',
  },
  {
    icon: Server,
    title: 'Your data stays yours',
    body: 'Agents run in your network, read only what they need and connect outbound. On-premises when required.',
  },
  {
    icon: Layers,
    title: 'One engine, two teams',
    body: 'Data and platform teams share one timeline, one approval flow and one audit trail.',
  },
]

type Person = {
  name: string
  role: string
  initials: string
  photo?: string
  bio: string
  linkedin?: string
}

const FOUNDERS: Person[] = [
  {
    name: 'Arvind Rajpurohit',
    role: 'Co-founder & CEO',
    initials: 'AR',
    photo: '/logos/arvind.jpeg',
    bio: 'Kubestronaut and DevOps engineer with over 15 years in infrastructure. Previously DevOps team lead at Roambee and customer success engineer at Shoreline.io (acquired by NVIDIA).',
    linkedin: 'https://www.linkedin.com/in/arvind-rajpurohit-4a332523/',
  },
  {
    name: 'Dinesh Agrawal',
    role: 'Co-founder & CTO',
    initials: 'DA',
    photo: '/logos/dinesh.jpeg',
    bio: 'Software engineer and founder focused on scalable systems. Previously at Polymer Search and Roambee, and co-founder of FutureApp e-schools.',
    linkedin: 'https://www.linkedin.com/in/dineshagrawal85/',
  },
]

// TODO(founders): advisors are hidden until full names, titles and consent
// to be listed are confirmed. Add them here in the same shape as FOUNDERS.
const ADVISORS: Person[] = []

function PersonCard({ person }: { person: Person }) {
  const [broken, setBroken] = useState(false)
  return (
    <div className={kit.person}>
      {person.photo && !broken ? (
        <img
          src={person.photo}
          alt={person.name}
          className={kit.avatar}
          width={88}
          height={88}
          loading="lazy"
          onError={() => setBroken(true)}
        />
      ) : (
        <div className={kit.avatar} aria-hidden="true">
          {person.initials}
        </div>
      )}
      <div>
        <h3 className={kit.personName}>{person.name}</h3>
        <p className={kit.personRole}>{person.role}</p>
        <p className={kit.personBio}>{person.bio}</p>
        {person.linkedin && (
          <a
            href={person.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className={kit.textLink}
            aria-label={`${person.name} on LinkedIn`}
          >
            <Linkedin size={15} aria-hidden="true" /> LinkedIn
          </a>
        )}
      </div>
    </div>
  )
}

export default function AboutPage() {
  const baseDescription =
    'AlertMend builds data observability and infrastructure observability with AI root cause analysis and approved, automated fixes. Meet the founders.'
  const uniqueDescription = ensureUniqueMetaDescription(baseDescription, 'about', 'about')

  return (
    <>
      <SEO
        title="About AlertMend: The Team and What We Believe"
        description={uniqueDescription}
        keywords="About AlertMend, AlertMend founders, data observability company, infrastructure observability company"
        canonical="/about"
        breadcrumbData={{ items: [{ label: 'About' }] }}
      />

      <PageHero
        eyebrow="About"
        title="We build the system that tells you what broke, why, and what to do next."
        lede="AlertMend watches data and infrastructure in one place, explains every failure with evidence, and fixes it only after your team approves."
      />

      <Section>
        <div className={kit.split}>
          <div>
            <span className={styles.eyebrow}>Our story</span>
            <h2 className={styles.h2}>Why we started</h2>
          </div>
          <div className={kit.prose}>
            <p>
              AlertMend started after years of on-call rotations, 3 a.m. incidents and reports that went out with numbers
              nobody could explain. The tools of the day could say that something was wrong. They could not say why, or
              what a safe fix looked like.
            </p>
            <p>
              We built one engine that connects metrics, logs, traces, pipeline runs and data quality checks, proposes a
              root cause with the evidence attached, and runs a fix only when a named person approves it, with rollback
              and a full audit trail.
            </p>
            <p>
              Today data teams use it to turn written policy into live checks, and platform teams use it to cut time to
              resolution and cloud spend.
            </p>
          </div>
        </div>
      </Section>

      <Section alt eyebrow="Principles" title="How we build" lede="Four rules that shape every feature we ship.">
        <CellGrid items={PRINCIPLES} cols={4} />
      </Section>

      <Section eyebrow="Leadership" title="Founders">
        <div className={kit.people}>
          {FOUNDERS.map((p) => (
            <PersonCard key={p.name} person={p} />
          ))}
        </div>
      </Section>

      {ADVISORS.length > 0 && (
        <Section alt eyebrow="Advisors" title="Advisors">
          <div className={kit.people}>
            {ADVISORS.map((p) => (
              <PersonCard key={p.name} person={p} />
            ))}
          </div>
        </Section>
      )}

      <CtaBand
        title="See AlertMend on your own stack."
        lede="30 minutes with the founders. Bring a data policy or a noisy cluster."
        primary={{ label: 'Book a demo', href: calendlyUrl('about-page') }}
        secondary={{ label: 'Careers', href: '/careers' }}
      />
    </>
  )
}
