import styles from './Outcomes.module.css';

const quotes = [
  {
    body: "RCAs land in the Slack thread before the on-call engineer finishes opening their laptop. We've cut MTTR by an order of magnitude on Kubernetes incidents.",
    initials: 'PE',
    name: 'Platform Engineering Lead',
    role: 'B2B SaaS · 40 services',
  },
  {
    body: 'The right-sizing recommendations with one-click YAML apply paid for the platform in the first month. Our Kubernetes spend dropped 38%.',
    initials: 'DI',
    name: 'Director of Infrastructure',
    role: 'FinTech · multi-region EKS',
  },
  {
    body: 'We replaced four tools with AlertMend (alerting, incident, on-call rotations, and runbooks) and our team finally stopped fighting the toolchain.',
    initials: 'SR',
    name: 'Staff SRE',
    role: 'Healthcare · regulated workload',
  },
];

export default function Outcomes() {
  return (
    <section id="outcomes">
      <div className="container">
        <div className="sec-head reveal">
          <span className="sec-tag">Outcomes</span>
          <h2>What teams say after they switch the lights on.</h2>
        </div>
        <div className={`${styles.row} reveal`}>
          {quotes.map((q) => (
            <div key={q.initials} className={styles.quote}>
              <span className={styles.qmark}>&ldquo;</span>
              <p>{q.body}</p>
              <div className={styles.who}>
                <div className={styles.av}>{q.initials}</div>
                <div>
                  <div className={styles.name}>{q.name}</div>
                  <div className={styles.role}>{q.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
