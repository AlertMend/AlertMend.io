import { Link } from 'react-router-dom'
import { CheckCircle2, Cloud, Globe2, Network, ServerCog } from 'lucide-react'
import styles from './Enterprise.module.css'

/**
 * Deployment & data sovereignty. Shared by the Data Observability page,
 * the Trust center and the homepage. Claims confirmed by AlertMend:
 * in-network agent, regional hosting, hybrid, on-prem / air-gapped, BYOM.
 * Keep regions unnamed here ("ask us for the current list").
 */
const MODELS = [
  {
    icon: Network,
    title: 'Agent in your network',
    body: 'A read-only agent runs inside your environment, holds the credentials and connects out only. For data quality, queries run where the data lives and only results leave.',
    tag: 'All plans',
  },
  {
    icon: Globe2,
    title: 'Regional hosting',
    body: 'Choose the region your AlertMend workspace is hosted in, so metadata and results stay within the jurisdiction your regulator expects. Ask us for the current list of regions.',
    tag: 'Data residency',
  },
  {
    icon: Cloud,
    title: 'Hybrid',
    body: 'AlertMend runs the control plane; the data plane stays in your own cloud account or VPC.',
    tag: 'Your VPC',
  },
  {
    icon: ServerCog,
    title: 'On-premises and air-gapped',
    body: 'Run the whole platform inside your own environment, including fully disconnected networks, with nothing leaving your boundary.',
    tag: 'Enterprise',
  },
]

const CONTROLS = [
  'Read-only by design: the agent refuses anything but read queries and caps query time',
  'Warehouse credentials stay with the agent; AlertMend stores no warehouse secrets',
  'Outbound-only connection; no inbound ports opened in your network',
  'Least-privilege role created by a generated grant script',
  'Bring your own model: AI runs on a private or self-hosted model you choose',
  'Every change versioned, approved and written to the audit trail',
]

type Props = {
  /** 'ink' renders on the dark navy band. */
  tone?: 'light' | 'ink'
  eyebrow?: string
  title?: string
  lede?: string
  showControls?: boolean
  showMore?: boolean
}

export default function SovereigntySection({
  tone = 'ink',
  eyebrow = 'Data sovereignty',
  title = 'Your data stays where your regulator expects it.',
  lede = 'Choose how AlertMend runs. Every option keeps raw data and credentials inside your boundary, and every option is backed by the same audit trail.',
  showControls = true,
  showMore = true,
}: Props) {
  return (
    <section className={tone === 'ink' ? styles.sectionInk : styles.section} id="sovereignty">
      <div className={styles.wrap}>
        <div className={styles.head}>
          <div>
            <span className={styles.eyebrow}>{eyebrow}</span>
            <h2 className={styles.h2}>{title}</h2>
          </div>
          <p className={styles.lede}>{lede}</p>
        </div>

        <div className={styles.grid4}>
          {MODELS.map((m) => (
            <div key={m.title} className={styles.cell}>
              <m.icon size={22} strokeWidth={1.5} className={styles.icon} />
              <h3 className={styles.cellTitle}>{m.title}</h3>
              <p className={styles.cellBody}>{m.body}</p>
              <span className={styles.tag}>{m.tag}</span>
            </div>
          ))}
        </div>

        {showControls && (
          <>
            <div style={{ height: 48 }} />
            <div className={styles.head} style={{ marginBottom: 24 }}>
              <div>
                <span className={styles.eyebrow}>Controls on every deployment</span>
              </div>
            </div>
            <ul className={styles.checks}>
              {CONTROLS.map((c) => (
                <li key={c}>
                  <CheckCircle2 size={17} strokeWidth={2} className={styles.checkIcon} />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </>
        )}

        {showMore && (
          <Link to="/trust" className={styles.more}>
            Visit the Trust center →
          </Link>
        )}
      </div>
    </section>
  )
}
