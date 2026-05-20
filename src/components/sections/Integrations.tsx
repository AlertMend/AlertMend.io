import { Link } from 'react-router-dom';
import BrandLogo from '../ui/BrandLogo';
import { integrations } from '../../data/integrations';
import styles from './Integrations.module.css';

export default function Integrations() {
  return (
    <section id="integrations" className="tight">
      <div className="container">
        <div className="sec-head reveal">
          <span className="sec-tag">Integrations</span>
          <h2>
            You bring the stack. We bring the{' '}
            <span className="hero-h-accent">autonomy</span>.
          </h2>
          <p>
            Ingest from Alertmanager, Datadog, Victoria Metrics, custom webhooks. Page through
            Slack, Teams, PagerDuty, WhatsApp, email, phone. File into Jira. Store in S3. Run
            anywhere.
          </p>
        </div>
        <div className={`${styles.grid} reveal`}>
          {integrations.map((i) => (
            <Link
              key={i.slug}
              to={`/integrations/${i.slug}`}
              className={styles.cell}
              aria-label={`${i.name} integration — ${i.tagline}`}
            >
              <span className={styles.logoChip}>
                <BrandLogo
                  src={i.logoSrc}
                  slug={i.iconSlug}
                  tint={i.logoTint}
                  domain={i.domain}
                  alt={i.name}
                  className={styles.logoImg}
                />
              </span>
              <span className={styles.cellName}>{i.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
