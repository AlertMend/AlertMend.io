import { Link } from 'react-router-dom';
import Icon from '../ui/Icon';
import styles from './FinalCTA.module.css';

const CALENDLY_URL = 'https://calendly.com/hello-alertmend/30min';

export default function FinalCTA() {
  return (
    <section id="pricing" className="tight">
      <div className={`container reveal`}>
        <div className={styles.final}>
          <span className="sec-tag">Free infrastructure health check</span>
          <h2 className={styles.h2}>
            Find the incidents.{' '}
            <span className="hero-h-accent">Before they find you.</span>
          </h2>
          <p className={styles.p}>
            On the call, AlertMend reads your live infrastructure and hands you the things that
            are about to break: OOM-prone workloads, restart loops, broken limits, idle spend,
            unowned alerts. You leave with a prioritized fix list. No outage required.
          </p>
          <div className={styles.cta}>
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-lg"
            >
              Book a demo
              <Icon name="arrow" size={16} className="arrow" strokeWidth={2.5} />
            </a>
            <Link to="/contact" className="btn btn-ghost btn-lg">
              <Icon name="message" size={16} />
              Talk with us
            </Link>
          </div>
          <div className={styles.meta}>
            <span>
              <Icon name="check" size={14} strokeWidth={2.5} /> Read-only scan
            </span>
            <span>
              <Icon name="check" size={14} strokeWidth={2.5} /> Results in minutes
            </span>
            <span>
              <Icon name="check" size={14} strokeWidth={2.5} /> No tool replacement required
            </span>
            <span>
              <Icon name="check" size={14} strokeWidth={2.5} /> SOC-style RBAC &amp; audit
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
