import { Link } from 'react-router-dom';
import Icon from '../ui/Icon';
import styles from './Outcomes.module.css';

/**
 * Three real outcome metrics with customer attribution.
 *
 * Numbers are sourced directly from `/SALES.md` and `src/data/caseStudies.ts`,
 * not marketing approximations. Each tile links to the underlying case study
 * so the proof is one click away from the metric.
 *
 * Customer order is intentional: largest delta first (90% MTTR), then the
 * cost-efficiency story (50% GKE), then the operational-time story (70%).
 * That sequence lines up with how engineering buyers triage a vendor —
 * "does it actually move the needle?" → "does it pay for itself?" → "will
 * my team get hours back?"
 */
type Metric = {
  /** Display value of the metric. Kept as a string so we can format the
   *  glyph/unit explicitly (e.g. "%", "×", "hr/wk"). */
  value: string;
  /** Suffix glyph rendered smaller and tinted, alongside the value. */
  suffix?: string;
  /** One-line metric label. Tense it as past-results, not promises. */
  label: string;
  /** Concrete context that turns the number into a story. */
  context: string;
  customer: string;
  /** Customer descriptor (industry / scale) for the attribution line. */
  customerNote: string;
  /** Anchor href to the underlying case study so users can verify the claim. */
  caseStudyHref: string;
  /** Quoted line from the customer that backs the metric. */
  quote: string;
  /** Quoted speaker's name + title. */
  attribution: string;
  /** Initials for the speaker's avatar chip. */
  initials: string;
};

const metrics: Metric[] = [
  {
    value: '90',
    suffix: '%',
    label: 'MTTR reduction',
    context: 'From 45 min to under 5 min on Datadog-routed ECS incidents.',
    customer: 'Polymer Search',
    customerNote: 'AI / SaaS — ECS, SQS, Lambda, Datadog',
    caseStudyHref:
      '/case-studies/auto-remediation-case-studies-polymer-search',
    quote:
      'AlertMend streamlined our incident management. Faster resolutions, less manual work, and a more focused team.',
    attribution: 'Yasser Ansari, CEO, Polymer Search',
    initials: 'YA',
  },
  {
    value: '50',
    suffix: '%',
    label: 'cut in cloud spend',
    context:
      'GKE bill halved in the first week — 41% compute, 94% storage savings — with zero performance regression.',
    customer: 'WareFlex',
    customerNote: 'Logistics infra — Kubernetes / GKE',
    caseStudyHref:
      '/case-studies/kubernetes-cost-optimization-case-studies-wareflex',
    quote:
      "Within a week, AlertMend cut our GKE costs in half, cleaned up unused storage, and right-sized workloads, all without touching a single YAML file. It's like having an AI-powered infra co-pilot that just works.",
    attribution: 'Rajnish Sharma, Founder & CEO, WareFlex',
    initials: 'RS',
  },
  {
    value: '70',
    suffix: '%',
    label: 'less time on investigation',
    context:
      '15–20 engineering hours/week reclaimed across 3,000+ pods on a single dashboard.',
    customer: 'Decklar',
    customerNote: 'IoT logistics — Kubernetes at scale, Silicon Valley HQ',
    caseStudyHref:
      '/case-studies/kubernetes-cost-optimization-case-studies-rombee',
    quote:
      "AlertMend became our control tower for Kubernetes. It pinpoints root causes and saves hours of manual debugging every week. Managing 3,000+ pods doesn't feel chaotic anymore.",
    attribution: 'Shailesh Mangal, CTO, Decklar',
    initials: 'SM',
  },
];

export default function Outcomes() {
  return (
    <section id="outcomes" className="zone-soft">
      <div className="container">
        <div className="sec-head reveal">
          <span className="sec-tag">Outcomes</span>
          <h2>Real numbers, real customers.</h2>
          <p>
            Three production teams. Three metrics that moved the business after they
            switched the lights on. Each one links to the case study so you can verify the claim.
          </p>
        </div>

        <div className={`${styles.grid} reveal`}>
          {metrics.map((m) => (
            <article key={m.customer} className={styles.tile}>
              <div className={styles.tileHead}>
                <span className={styles.numberWrap}>
                  <span className={styles.number}>{m.value}</span>
                  {m.suffix && <span className={styles.suffix}>{m.suffix}</span>}
                </span>
                <span className={styles.label}>{m.label}</span>
              </div>

              <p className={styles.context}>{m.context}</p>

              <blockquote className={styles.quote}>
                <span className={styles.qmark}>&ldquo;</span>
                <p>{m.quote}</p>
                <footer className={styles.who}>
                  <span className={styles.av}>{m.initials}</span>
                  <span className={styles.whoText}>
                    <span className={styles.name}>{m.attribution}</span>
                    <span className={styles.role}>{m.customerNote}</span>
                  </span>
                </footer>
              </blockquote>

              <Link to={m.caseStudyHref} className={styles.caseLink}>
                Read the {m.customer} case study
                <Icon name="arrow" size={12} className="arrow" strokeWidth={2.5} />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
