import Icon from '../ui/Icon';
import styles from './Pains.module.css';

/* "Inline thin icon" pattern — Icon at 16px / strokeWidth 1.6 rendered
   directly above the title, no surrounding plate. The cards now read as
   editorial column-heads (think Linear/Vercel) rather than ten brightly
   colored badges fighting for attention. */
const ICON_SIZE = 16;
const ICON_STROKE = 1.6;

const pains: { ico: React.ReactNode; title: string; body: string }[] = [
  {
    ico: <Icon name="eye" size={ICON_SIZE} strokeWidth={ICON_STROKE} />,
    title: 'Observability as an afterthought',
    body: 'Endpoints and services go live before anyone can really see them. Logs and metrics sit in different consoles.',
  },
  {
    ico: <Icon name="bolt" size={ICON_SIZE} strokeWidth={ICON_STROKE} />,
    title: 'Alert noise & paging fatigue',
    body: 'Alertmanager, Datadog, custom webhooks, all firing into one Slack channel with no correlation or routing.',
  },
  {
    ico: <Icon name="activity" size={ICON_SIZE} strokeWidth={ICON_STROKE} />,
    title: 'Kubernetes complexity outpaces the team',
    body: 'CrashLoopBackOff, OOMKilled, scheduling failures. Every incident becomes a kubectl scavenger hunt.',
  },
  {
    ico: <Icon name="clock" size={ICON_SIZE} strokeWidth={ICON_STROKE} />,
    title: 'On-call burns out the best engineers',
    body: 'No structured rotations, no escalation paths, no audit trail. Your senior SRE is the human pager.',
  },
  {
    ico: <Icon name="dollar" size={ICON_SIZE} strokeWidth={ICON_STROKE} />,
    title: 'Cloud bills nobody can explain',
    body: 'Over-provisioned requests, idle EC2, forgotten RDS, while finance asks why spend doubled this quarter.',
  },
  {
    ico: <Icon name="message" size={ICON_SIZE} strokeWidth={ICON_STROKE} />,
    title: 'Tribal knowledge in shell history',
    body: "Recovery steps live in someone's terminal scrollback. New engineers re-learn every fire drill.",
  },
  {
    ico: <Icon name="gitBranch" size={ICON_SIZE} strokeWidth={ICON_STROKE} />,
    title: 'Traces stop at the pod boundary',
    body: 'A request slows down and you can only guess where. No distributed trace, no span waterfall — just latency graphs that never point at the culprit.',
  },
  {
    ico: <Icon name="layers" size={ICON_SIZE} strokeWidth={ICON_STROKE} />,
    title: 'Metrics, logs and traces live in silos',
    body: 'Three tools, three tabs, three query languages. Correlating a spike to the log line and the failing span is a manual scavenger hunt.',
  },
  {
    ico: <Icon name="eye" size={ICON_SIZE} strokeWidth={ICON_STROKE} />,
    title: 'Dashboards, but no answers',
    body: 'Walls of graphs that show what changed but never why. At 3am you need a root cause, not another panel to stare at.',
  },
];

export default function Pains() {
  return (
    <section id="why" className="zone-cool">
      <div className="container">
        <div className="sec-head reveal">
          <span className="sec-tag">The problem</span>
          <h2>Scaling is easy. Keeping everything reliable is not.</h2>
          <p>
            Every launch adds another surface to watch. Downtime hurts revenue and renewals. Waste in
            the cloud quietly eats margin. Shipping slows when teams spend nights replaying the same
            incidents instead of building what you sold on the roadmap.
          </p>
        </div>
        <div className={`${styles.grid} reveal`}>
          {pains.map((p) => (
            <div key={p.title} className={styles.pain}>
              <span className={styles.ico}>{p.ico}</span>
              <h4>{p.title}</h4>
              <p>{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
