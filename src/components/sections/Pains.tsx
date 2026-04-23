import Icon from '../ui/Icon';
import styles from './Pains.module.css';

const pains: { ico: React.ReactNode; title: string; body: string }[] = [
  {
    ico: <Icon name="eye" size={22} />,
    title: 'Observability as an afterthought',
    body: 'Endpoints and services go live before anyone can really see them. Logs and metrics sit in different consoles.',
  },
  {
    ico: <Icon name="bolt" size={22} />,
    title: 'Alert noise & paging fatigue',
    body: 'Alertmanager, Datadog, custom webhooks, all firing into one Slack channel with no correlation or routing.',
  },
  {
    ico: <Icon name="activity" size={22} />,
    title: 'Kubernetes complexity outpaces the team',
    body: 'CrashLoopBackOff, OOMKilled, scheduling failures. Every incident becomes a kubectl scavenger hunt.',
  },
  {
    ico: <Icon name="clock" size={22} />,
    title: 'On-call burns out the best engineers',
    body: 'No structured rotations, no escalation paths, no audit trail. Your senior SRE is the human pager.',
  },
  {
    ico: <Icon name="dollar" size={22} />,
    title: 'Cloud bills nobody can explain',
    body: 'Over-provisioned requests, idle EC2, forgotten RDS, while finance asks why spend doubled this quarter.',
  },
  {
    ico: <Icon name="message" size={22} />,
    title: 'Tribal knowledge in shell history',
    body: "Recovery steps live in someone's terminal scrollback. New engineers re-learn every fire drill.",
  },
  {
    ico: <Icon name="cpu" size={22} />,
    title: 'GPU fleets are flying blind',
    body: 'CUDA OOM, NCCL timeouts, MIG slices unaccounted for. Half the H100s are idle while the other half throttle, and nobody can prove it.',
  },
  {
    ico: <Icon name="workflow" size={22} />,
    title: 'ML pipelines stall silently',
    body: 'A Kubeflow DAG hangs at step 7. A vLLM replica drifts on p99. Nobody pages until the data scientist files a ticket.',
  },
  {
    ico: <Icon name="trending" size={22} />,
    title: "Training runs you can't trust",
    body: 'Loss diverges, gradients NaN, dataloader stalls. You burn $14k of GPU hours before someone checks Weights & Biases.',
  },
];

export default function Pains() {
  return (
    <section id="why">
      <div className="container">
        <div className="sec-head reveal">
          <span className="sec-tag">The problem</span>
          <h2>The Bigger Your Cloud Gets, the Harder It Is to Run.</h2>
          <p>
            More services. More clusters. More alerts. Every new layer of scale lands on the same
            small platform team.
          </p>
        </div>
        <div className={`${styles.grid} reveal`}>
          {pains.map((p) => (
            <div key={p.title} className={styles.pain}>
              <div className={styles.icoBox}>{p.ico}</div>
              <h4>{p.title}</h4>
              <p>{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
