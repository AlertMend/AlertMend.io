import { useAudience, type Audience } from '../../hooks/useAudience'
import styles from './PilotPlan.module.css'
import { trackHomeCta } from '../../utils/analytics'
import { calendlyUrl } from '../../lib/calendly'


type Step = { when: string; title: string; body: string }

const PLANS: Record<Audience, { heading: string; sub: string; steps: Step[]; success: string; cta: string }> = {
  data: {
    heading: 'Policy to live checks in minutes.',
    sub: 'Connect, upload your policy, approve the checks. Your data owners stay in the loop.',
    steps: [
      { when: 'Minute 1', title: 'Connect read-only', body: 'Install the agent in your network. A generated grant script sets up a read-only role.' },
      { when: 'Minutes later', title: 'Upload your policy', body: 'AlertMend reads the PDF and proposes checks, each citing the clause it enforces.' },
      { when: 'On approval', title: 'Checks go live', body: 'Approve the checks you want. Failures reach Teams or Slack with the job that caused them and the Power BI reports affected.' },
    ],
    success: 'You finish with live checks traced to your policy, and a record of every approval.',
    cta: 'Plan a data pilot',
  },
  infra: {
    heading: 'Two weeks, one cluster, real alerts.',
    sub: 'A pilot on your own environment, read-only until you approve a change.',
    steps: [
      { when: 'Day 0–1', title: 'Connect', body: 'Helm install on one cluster and wire your existing alerts. First root cause in minutes.' },
      { when: 'Days 1–7', title: 'Observe and diagnose', body: 'Real incidents arrive with evidence-backed root cause in Slack or Teams.' },
      { when: 'Week 2', title: 'Respond and automate', body: 'Turn on three automated fixes for your noisiest alerts, and review cost findings.' },
    ],
    success: 'Success is measured together: MTTR down, root-cause confidence up, and cost findings you can act on.',
    cta: 'Plan a pilot',
  },
}

export default function PilotPlan() {
  const { audience } = useAudience()
  const plan = PLANS[audience]
  const CALENDLY_URL = calendlyUrl(`home-${audience}-pilot`)

  return (
    <section className={styles.section} id="pilot">
      <div className="container">
        <div className={`sec-head ${styles.head}`}>
          <span className="sec-tag">How a pilot works</span>
          <h2>{plan.heading}</h2>
          <p>{plan.sub}</p>
        </div>
        <ol className={styles.steps}>
          {plan.steps.map((s, i) => (
            <li key={s.title} className={styles.step}>
              <span className={styles.num}>{i + 1}</span>
              <em>{s.when}</em>
              <strong>{s.title}</strong>
              <p>{s.body}</p>
            </li>
          ))}
        </ol>
        <div className={styles.foot}>
          <p>{plan.success}</p>
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            onClick={() => trackHomeCta(audience, 'pilot', CALENDLY_URL)}
          >
            {plan.cta}
          </a>
        </div>
      </div>
    </section>
  )
}
