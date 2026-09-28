/** Homepage FAQ, shared by the FAQ section and the FAQPage JSON-LD. */
import type { Audience } from '../hooks/useAudience'

export type FaqItem = { q: string; a: string }

/** Honest answers only: every claim here is on a product page or the sales doc. */
export const HOME_FAQ: Record<Audience, FaqItem[]> = {
  data: [
    {
      q: 'Does our data leave our network?',
      a: 'No. The agent runs read-only queries inside your network and sends back only results. It holds your warehouse credentials, AlertMend stores no warehouse secrets, and no inbound ports are opened.',
    },
    {
      q: 'Does AI change our data or our checks on its own?',
      a: 'No. AlertMend proposes checks from your policy and a person approves each one. Nothing writes to your data, and every check change is versioned with a reason.',
    },
    {
      q: 'Which policies can we upload?',
      a: 'Any text-based PDF, such as BCBS 239, an internal data quality standard or a data contract. Each proposed check names the clause it enforces.',
    },
    {
      q: 'How long does setup take?',
      a: 'Connecting takes minutes. Most of the time goes into reviewing the proposed checks with your data owners.',
    },
    {
      q: 'Can we keep our current data quality tool?',
      a: 'Yes. AlertMend runs alongside your current tools.',
    },
    {
      q: 'How is it priced?',
      a: 'A plan price with unlimited checks and users.',
    },
  ],
  infra: [
    {
      q: 'We already have Datadog or Prometheus. Do we replace it?',
      a: 'No, keep it. AlertMend ingests alerts from Alertmanager, Datadog, Victoria Metrics and webhooks, then adds root cause and automated fixes on top. If AlertMend is down, your existing alerting path is unaffected.',
    },
    {
      q: 'Will AI change production on its own?',
      a: 'Not by default. The default is recommend, not execute. Automated fixes run only after approval in Slack, Teams, email or the product, every step is audited, and a verify step re-checks the service after the run.',
    },
    {
      q: 'We can’t send data to OpenAI.',
      a: 'Bring your own model: point inference at a self-hosted or private model. On-prem and air-gapped deployments are available on Enterprise.',
    },
    {
      q: 'What do we have to install?',
      a: 'One agent per cluster via Helm, with no per-pod SDK on the core path. VMs connect with a lightweight agent. The first root cause usually arrives within minutes of connecting.',
    },
    {
      q: 'Are we too small for this?',
      a: 'No. The free plan covers an individual end to end, and paid plans start at around ten VMs or a small cluster.',
    },
  ],
}

