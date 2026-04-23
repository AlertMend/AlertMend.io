import BrandLogo, { svgPornUrl } from '../ui/BrandLogo';
import styles from './Integrations.module.css';

type Integration = {
  name: string;
  src?: string;
  slug?: string;
  domain?: string;
};

const integrations: Integration[] = [
  { name: 'Kubernetes', slug: 'kubernetes', domain: 'kubernetes.io' },
  { name: 'AWS', src: svgPornUrl('aws'), domain: 'aws.amazon.com' },
  { name: 'Google Cloud', slug: 'googlecloud', domain: 'cloud.google.com' },
  { name: 'Azure', src: svgPornUrl('microsoft-azure'), domain: 'azure.microsoft.com' },
  { name: 'Prometheus', slug: 'prometheus', domain: 'prometheus.io' },
  { name: 'Grafana', slug: 'grafana', domain: 'grafana.com' },
  { name: 'Datadog', slug: 'datadog', domain: 'datadoghq.com' },
  { name: 'Victoria Metrics', slug: 'victoriametrics', domain: 'victoriametrics.com' },
  { name: 'Slack', src: svgPornUrl('slack'), domain: 'slack.com' },
  { name: 'MS Teams', src: svgPornUrl('microsoft-teams'), domain: 'microsoft.com' },
  { name: 'PagerDuty', slug: 'pagerduty', domain: 'pagerduty.com' },
  { name: 'Jira', slug: 'jira', domain: 'atlassian.com' },
  { name: 'SendGrid', src: svgPornUrl('sendgrid'), domain: 'sendgrid.com' },
  { name: 'Google Meet', slug: 'googlemeet', domain: 'meet.google.com' },
  { name: 'Jenkins', slug: 'jenkins', domain: 'jenkins.io' },
  { name: 'GitHub Actions', slug: 'githubactions', domain: 'github.com' },
  { name: 'GitLab CI', slug: 'gitlab', domain: 'gitlab.com' },
  { name: 'WhatsApp', slug: 'whatsapp', domain: 'whatsapp.com' },
];

export default function Integrations() {
  return (
    <section id="integrations" className="tight">
      <div className="container">
        <div className="sec-head reveal">
          <span className="sec-tag">Integrations</span>
          <h2>Wires into your stack. Doesn't replace it.</h2>
          <p>
            Ingest from Alertmanager, Datadog, Victoria Metrics, custom webhooks. Page through
            Slack, Teams, PagerDuty, WhatsApp, email, phone. File into Jira. Store in S3. Run
            anywhere.
          </p>
        </div>
        <div className={`${styles.grid} reveal`}>
          {integrations.map((i) => (
            <div key={i.name} className={styles.cell}>
              <span className={styles.logoChip}>
                <BrandLogo
                  src={i.src}
                  slug={i.slug}
                  domain={i.domain}
                  alt={i.name}
                  className={styles.logoImg}
                />
              </span>
              <span>{i.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
