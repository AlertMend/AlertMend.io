import { Link } from 'react-router-dom'
import Icon from '../ui/Icon'
import { useAudience } from '../../hooks/useAudience'
import styles from './TrustStrip.module.css'

/** Security & deployment facts for regulated buyers. Certifications are
 *  "in progress" — never present SOC 2 / ISO 27001 as achieved. */
export default function TrustStrip() {
  const { audience } = useAudience()
  const items = [
    {
      icon: 'shield' as const,
      title: 'Read-only by default',
      body:
        audience === 'data'
          ? 'The agent refuses anything but read queries and caps query time.'
          : 'Nothing changes in your environment until someone approves it.',
    },
    {
      icon: 'cube' as const,
      title: 'SaaS, hybrid or on-prem',
      body: 'Keep the data plane in your VPC, or run everything on-prem on Enterprise.',
    },
    {
      icon: 'brain' as const,
      title: 'Bring your own model',
      body: 'Point AI at a private or self-hosted model. Air-gapped is supported.',
    },
    {
      icon: 'shieldCheck' as const,
      title: 'RBAC and full audit',
      body: 'Granular roles, and every action logged with who and when.',
    },
  ]

  return (
    <section className={styles.section} id="security">
      <div className="container">
        <div className={styles.top}>
          <div>
            <span className="sec-tag">Security & deployment</span>
            <h2 className={styles.h2}>Built for teams that answer to auditors.</h2>
          </div>
          <Link to="/security" className={styles.badges}>
            <span>SOC 2 Type II</span>
            <span>ISO 27001</span>
            <em>in progress · GDPR-aligned →</em>
          </Link>
        </div>
        <div className={styles.grid}>
          {items.map((it) => (
            <div key={it.title} className={styles.item}>
              <Icon name={it.icon} size={16} strokeWidth={1.6} className={styles.icon} />
              <strong>{it.title}</strong>
              <p>{it.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
