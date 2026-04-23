import { Link } from 'react-router-dom';
import Icon from '../ui/Icon';
import styles from './FinalCTA.module.css';

export default function FinalCTA() {
  return (
    <section id="pricing" className="tight">
      <div className={`container reveal`}>
        <div className={styles.final}>
          <span className="sec-tag">Free cluster health check</span>
          <h2 className={styles.h2}>Find your cluster's weak spots, before they page you.</h2>
          <p className={styles.p}>
            On the call, AlertMend scans your live cluster end to end: workloads trending toward
            OOM, restart-prone pods, misconfigured limits, over-provisioned spend, unowned alerts.
            You walk away with a prioritized list of risks to fix, no incident required.
          </p>
          <div className={styles.cta}>
            <Link to="/contact" className="btn btn-primary btn-lg">
              Book a demo
              <Icon name="arrow" size={16} className="arrow" strokeWidth={2.5} />
            </Link>
            <a href="mailto:hello@alertmend.io" className="btn btn-ghost btn-lg">
              <Icon name="message" size={16} />
              Talk with us
            </a>
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
