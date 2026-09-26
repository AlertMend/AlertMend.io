import { Link } from 'react-router-dom';
import Icon from '../ui/Icon';
import { useAudience, type Audience } from '../../hooks/useAudience';
import styles from './FinalCTA.module.css';
import { trackHomeCta } from '../../utils/analytics';
import { calendlyUrl } from '../../lib/calendly';


type Offer = {
  tag: string;
  lead: string;
  accent: string;
  body: string;
  cta: string;
  meta: string[];
};

type CrossSell = {
  tag: string;
  heading: string;
  cta: string;
  href: string;
  meta: string[];
};

/** Main offer follows the audience; the other side is a smaller cross-sell row. */
const CONTENT: Record<Audience, { offer: Offer; cross: CrossSell }> = {
  data: {
    offer: {
      tag: 'Data quality demo',
      lead: 'See your policy.',
      accent: 'Turned into live checks.',
      body:
        'Bring a data quality policy, or use our sample banking policy. We turn it into proposed checks, each citing the clause it enforces, and show a failure traced to the job that caused it and the Power BI reports it affects.',
      cta: 'Book the data demo',
      meta: ['Read-only agent', 'Checks cite the policy clause', 'Snowflake and Oracle', 'Every change approved'],
    },
    cross: {
      tag: 'Also run Kubernetes or VMs?',
      heading: 'Get a free infrastructure health check on the same platform',
      cta: 'See infrastructure',
      href: '/observability',
      meta: ['Read-only scan', 'Results in minutes', 'No tool replacement'],
    },
  },
  infra: {
    offer: {
      tag: 'Free infrastructure health check',
      lead: 'Find the incidents.',
      accent: 'Before they find you.',
      body:
        'On the call, AlertMend reads your live infrastructure and hands you the things that are about to break: OOM-prone workloads, restart loops, broken limits, idle spend, unowned alerts. You leave with a prioritized fix list. No outage required.',
      cta: 'Book a demo',
      meta: ['Read-only scan', 'Results in minutes', 'No tool replacement required', 'RBAC & audit trail'],
    },
    cross: {
      tag: 'Data quality demo',
      heading: 'See a sample banking policy turned into live checks',
      cta: 'See data observability',
      href: '/data-observability',
      meta: ['Read-only agent', 'Checks cite the policy clause', 'Snowflake and Oracle'],
    },
  },
};

export default function FinalCTA() {
  const { audience } = useAudience();
  const { offer, cross } = CONTENT[audience];
  const CALENDLY_URL = calendlyUrl(`home-${audience}-final`);

  return (
    <section id="cta" className="tight">
      <div className={`container reveal`}>
        <div className={styles.final}>
          <span className="sec-tag">{offer.tag}</span>
          <h2 className={styles.h2}>
            {offer.lead}{' '}
            <span className="hero-h-accent">{offer.accent}</span>
          </h2>
          <p className={styles.p}>{offer.body}</p>
          <div className={styles.cta}>
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`btn btn-primary btn-lg ${styles.ctaPrimary}`}
              onClick={() => trackHomeCta(audience, 'final_primary', CALENDLY_URL)}
            >
              {offer.cta}
              <Icon name="arrow" size={16} className="arrow" strokeWidth={2.5} />
            </a>
            <Link
              to="/contact"
              className={`btn btn-ghost btn-lg ${styles.ctaGhost}`}
              onClick={() => trackHomeCta(audience, 'final_contact', '/contact')}
            >
              <Icon name="message" size={16} />
              Talk with us
            </Link>
          </div>
          <div className={styles.meta}>
            {offer.meta.map((m) => (
              <span key={m}>
                <Icon name="check" size={14} strokeWidth={2.5} /> {m}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.dataRow}>
          <div className={styles.dataCopy}>
            <span className={styles.dataTag}>{cross.tag}</span>
            <h3 className={styles.dataHeading}>{cross.heading}</h3>
          </div>
          <div className={styles.dataActions}>
            <Link
              to={cross.href}
              className={`btn btn-primary ${styles.dataCta}`}
              onClick={() => trackHomeCta(audience, 'final_cross_sell', cross.href)}
            >
              {cross.cta}
              <Icon name="arrow" size={14} className="arrow" strokeWidth={2.5} />
            </Link>
            <div className={styles.dataMeta}>
              {cross.meta.map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
