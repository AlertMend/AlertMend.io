import styles from './Outcomes.module.css';

const quotes = [
  {
    body: "AlertMend became our control tower for Kubernetes. It pinpoints root causes and saves hours of manual debugging every week. Managing 3,000+ pods doesn't feel chaotic anymore.",
    initials: 'SM',
    name: 'Shailesh Mangal',
    role: 'CTO, Decklar',
  },
  {
    body: "Within a week, AlertMend cut our GKE costs in half, cleaned up unused storage, and right-sized workloads, all without touching a single YAML file. It's like having an AI-powered infra co-pilot that just works.",
    initials: 'RS',
    name: 'Rajnish Sharma',
    role: 'Founder & CEO, WareFlex',
  },
  {
    body: 'AlertMend streamlined our incident management. Faster resolutions, less manual work, and a more focused team. Peace of mind is invaluable.',
    initials: 'YA',
    name: 'Yasser Ansari',
    role: 'CEO, Polymer Search',
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
