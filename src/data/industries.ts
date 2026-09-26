/**
 * Industry content for /industries and the homepage band.
 * Regulatory references describe what the regulation asks for; they are
 * not claims of certification. No HIPAA claim (not confirmed).
 */
export type Industry = {
  id: string
  name: string
  short: string
  headline: string
  intro: string
  challenges: string[]
  data: string[]
  infra: string[]
  deployment: string
  links?: { label: string; to: string }[]
}

export const INDUSTRIES: Industry[] = [
  {
    id: 'financial-services',
    name: 'Banking & financial services',
    short: 'Prove risk data quality against BCBS 239 and keep regulatory reports on time.',
    headline: 'Risk data you can defend to a supervisor.',
    intro:
      'Banks are expected to show that risk data is accurate, complete and timely, and that the controls behind it actually run. AlertMend turns your data quality policy into live, approved checks and keeps the evidence.',
    challenges: [
      'BCBS 239 expects accurate, complete and timely risk data, with controls you can evidence',
      'Regulatory and board reports depend on overnight loads that fail quietly',
      'Data quality policies are written once and only partly monitored',
      'Core data often lives on Oracle, behind strict network and residency rules',
    ],
    data: [
      'Checks proposed from your policy, each citing the BCBS 239 principle or internal clause it enforces',
      'Freshness checks timed to reporting deadlines, with the failed ODI or Airflow job named in the alert',
      'Power BI reports flagged before the morning meeting',
      'Versioned, approved check changes for audit',
    ],
    infra: [
      'Incident root cause with evidence and a confidence score',
      'Fixes that run only after approval, with separation of duties and a full audit trail',
    ],
    deployment: 'Run in your region, in your VPC, or fully on-premises, with your own AI model.',
    links: [{ label: 'BCBS 239 data quality controls', to: '/blog/bcbs-239-data-quality-controls' }],
  },
  {
    id: 'insurance',
    name: 'Insurance',
    short: 'Trustworthy actuarial, claims and reporting data, with controls you can evidence.',
    headline: 'Data quality behind every reserve and report.',
    intro:
      'Solvency II expects the data used for technical provisions to be appropriate, complete and accurate. Claims, policy and actuarial data move through many pipelines before they reach a model or a regulatory return.',
    challenges: [
      'Actuarial and reserving models are only as good as their input data',
      'Claims and policy data arrive from many systems and brokers, in different formats',
      'Regulatory reporting cycles leave little time to find and fix bad data',
      'Auditors ask how data quality is controlled, not only whether it is',
    ],
    data: [
      'Completeness, validity and reconciliation checks on claims, policy and actuarial tables',
      'Checks linked to the clauses of your data quality standard',
      'Late or partial loads traced to the pipeline job that caused them',
      'Report impact shown before figures are signed off',
    ],
    infra: [
      'Root cause for platform incidents across Kubernetes, VMs and cloud',
      'Approved, audited remediation for recurring failures',
    ],
    deployment: 'Keep policyholder data in your environment with regional hosting or on-premises deployment.',
  },
  {
    id: 'healthcare',
    name: 'Healthcare & life sciences',
    short: 'Data integrity for clinical, operational and research data, without moving sensitive data.',
    headline: 'Data integrity where the stakes are highest.',
    intro:
      'Clinical, claims and research data must be complete, accurate and traceable, and sensitive records should never leave the environments built to protect them. AlertMend monitors data where it lives.',
    challenges: [
      'Sensitive records cannot be copied into third-party tools',
      'Data integrity expectations (such as ALCOA+ in regulated life-sciences work) need evidence',
      'Operational dashboards depend on feeds from many clinical and business systems',
      'Security reviews require clear answers on access, audit and AI use',
    ],
    data: [
      'Read-only checks that run inside your network; only results leave',
      'Completeness, validity and freshness checks on critical feeds',
      'Every check approved by a data owner and versioned',
      'Bring your own model, so AI never runs on a public provider',
    ],
    infra: [
      'Root cause across the systems that serve clinical and operational apps',
      'Human-approved fixes with a full audit trail',
    ],
    deployment: 'Deploy on-premises or air-gapped when data must never leave your boundary.',
  },
  {
    id: 'public-sector',
    name: 'Public sector',
    short: 'Sovereign deployment, full audit and human approval for citizen data and critical services.',
    headline: 'Sovereign by design.',
    intro:
      'Public bodies need to keep citizen data within national borders, show who changed what, and keep humans in control of automated actions. AlertMend runs where you need it and records every step.',
    challenges: [
      'Citizen data must stay within the country or within government networks',
      'Services must stay available with small operations teams',
      'Automated actions need human approval and a clear record',
      'Procurement and security reviews demand clear deployment and AI answers',
    ],
    data: [
      'Data quality checks that run inside your network',
      'Policy-driven controls with approval and version history',
      'Impact on downstream reports before they are published',
    ],
    infra: [
      'Evidence-backed root cause for service incidents',
      'Remediation that waits for approval, recorded with who and when',
    ],
    deployment: 'Regional hosting, on-premises or fully air-gapped, with your own AI model.',
  },
]
