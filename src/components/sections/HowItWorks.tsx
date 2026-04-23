import styles from './HowItWorks.module.css';

const steps = [
  {
    n: 1,
    title: 'Connect',
    body: 'Register Agents for EC2 / ECS / CloudWatch, add VMs over SSH, and connect Kubernetes clusters. Invite teammates with RBAC.',
  },
  {
    n: 2,
    title: 'Observe',
    body: 'Land on the cluster overview, drill into pods, query logs in SQL, build metric dashboards, watch APIs with synthetic checks.',
  },
  {
    n: 3,
    title: 'Respond',
    body: 'Alerts → Incidents → On-call. Filter rules route signal to the right channel. AI RCAs land in the Slack thread automatically.',
  },
  {
    n: 4,
    title: 'Automate & save',
    body: 'Runbooks run safe, approved fixes across pods or VM fleets. FinOps right-sizing applies YAML straight to the cluster.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how">
      <div className="container">
        <div className="sec-head reveal">
          <span className="sec-tag">How it works</span>
          <h2>The AIOps platform, end to end.</h2>
          <p>Four stages. One workspace. Connect what you already run, then automate the rest.</p>
        </div>
        <div className={`${styles.flow} reveal`}>
          {steps.map((s) => (
            <div key={s.n} className={styles.step}>
              <div className={styles.num}>{s.n}</div>
              <h4>{s.title}</h4>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
