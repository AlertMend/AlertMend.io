import type { ReactNode } from 'react'
import { QUERY_DOCS } from './docsQueryPages'

/**
 * Structured doc article content rendered by DocArticle + DocsLayout.
 * Keep copy grounded in shipped product (auto_remediation). No em dashes.
 */

export type DocBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; id?: string; text: string }
  | { type: 'h3'; id?: string; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'callout'; tone?: 'info' | 'warn' | 'tip'; title: string; body: string | string[] }
  | { type: 'code'; lang?: string; code: string }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'jsx'; node: ReactNode }

export type DocPage = {
  slug: string
  title: string
  description: string
  keywords: string
  /** Short subtitle under H1 */
  lead: string
  blocks: DocBlock[]
}

export const DOCS_PAGES: DocPage[] = [
  // ---------------------------------------------------------------------------
  // Get started
  // ---------------------------------------------------------------------------
  {
    slug: 'what-is-alertmend',
    title: 'What AlertMend does',
    description:
      'How to use AlertMend day to day: install agents, watch signals, run AI RCA, and approve fixes in one UI.',
    keywords: 'AlertMend, how to use AlertMend, Kubernetes agent, AI RCA, remediation flow',
    lead: 'Install agents, watch metrics/logs/traces, investigate with AI RCA, then approve a fix in the same product.',
    blocks: [
      {
        type: 'p',
        text: 'AlertMend is how you run incident response on Kubernetes (and hybrid VMs). Install agents in your clusters, point them at a control plane you own or operate, then work in one UI: observability, alerts, AI root cause analysis, and approved remediation.',
      },
      {
        type: 'p',
        text: 'Typical day: an alert fires, you open correlated logs/metrics/traces, read a cited root-cause writeup, then restart, scale, or open a PR Fix after approval, without bouncing across five tools.',
      },
      {
        type: 'h2',
        id: 'parts',
        text: 'Two parts',
      },
      {
        type: 'table',
        headers: ['Part', 'Where it runs', 'Job'],
        rows: [
          ['Control plane', 'Your VPC, VM, or cluster', 'UI, HTTP API, gRPC master, RCA engine, RF engine, MongoDB, Redis, Victoria Metrics, traces and logs stores'],
          ['Cluster agent (Helm)', 'Each Kubernetes cluster', 'Inventory, RF/command execution, metrics collectors, OTLP collector; optional logs agent and eBPF Deep Visibility'],
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'Self-host',
        body: 'You can keep the control plane and data stores in your environment. Agents dial out to your master URL with global.agentId and global.key.',
      },
      {
        type: 'h2',
        id: 'incident',
        text: 'What happens on an incident',
      },
      {
        type: 'ol',
        items: [
          'An alert arrives (Alertmanager, Datadog webhook, custom webhook, health policy, metric alert, cron, or system webhook).',
          'AlertMend pulls related traces, logs, metrics, Kubernetes events, and recent deploys.',
          'AI RCA writes a root cause with evidence citations and a confidence score (UI: /rca).',
          'You approve a Remediation Flow step or PR Fix in Slack, Teams webhook, or the UI.',
          'The agent runs the action (scale, restart, apply, script). Verify and audit are recorded.',
        ],
      },
      {
        type: 'h2',
        id: 'modules',
        text: 'Main modules',
      },
      {
        type: 'table',
        headers: ['Module', 'UI routes', 'What you get'],
        rows: [
          ['Observability', '/service-map, /apm-analysis, /metrics-dashboard, /logs, /observability, /cpu-profiling', 'Metrics (Victoria Metrics), SQL logs, traces, service map, APM, eBPF Deep Visibility'],
          ['Alerting & on-call', '/alerts-feed, /incidents, /on-call, /schedules, /escalation-paths', 'Feed, health policies, incidents, rotations, escalations'],
          ['AI RCA', '/rca', 'Evidence-backed investigation; optional BYOM (azure_openai | ollama | anthropic_foundry)'],
          ['Automation', '/rf, /rf/runbooks, /commands, /agents', 'Commands, aliases, runbooks, Remediation Flows, approvals'],
          ['FinOps', '/cost-optimizations, /cloud-cost-optimizations', 'Kubernetes right-sizing and AWS cost findings'],
          ['Govern', '/users, /system-audit, /security', 'RBAC, workspace, audit trail'],
        ],
      },
      {
        type: 'h2',
        id: 'stores',
        text: 'Data stores',
      },
      {
        type: 'ul',
        items: [
          'Victoria Metrics: time-series metrics (AlertMend Metrics / PromQL)',
          'Traces store: distributed traces for APM and RCA',
          'Log store: historical search and live investigation tails',
          'MongoDB + Redis: control-plane state, sessions, queues',
        ],
      },
      {
        type: 'h2',
        id: 'not',
        text: 'What it is not',
      },
      {
        type: 'ul',
        items: [
          'Not a blind auto-healer. Risky steps wait for an approval action unless you explicitly remove the gate.',
          'Not only a dashboard. The point is RCA plus an executable next step (RF, runbook, or PR Fix).',
          'Not a requirement to rip out Datadog or Prometheus. Webhooks and metrics integrations sit beside them.',
        ],
      },
      {
        type: 'h2',
        id: 'next',
        text: 'Next step',
      },
      {
        type: 'p',
        text: 'Install the cluster agent from Connect a Kubernetes cluster. You need Agent ID, Key, and Master URL from Add Cluster in the UI, then verify with kubectl -n alertmend get pods.',
      },
    ],
  },
  {
    slug: 'platform-overview',
    title: 'Where to click (UI map)',
    description:
      'How to use the AlertMend UI: routes for observability, alerts, RCA, automation, FinOps, on-call, and admin.',
    keywords: 'AlertMend UI routes, how to use AlertMend, product map, remediation flows',
    lead: 'After the agent is connected, use this map to open the right screen for each job.',
    blocks: [
      {
        type: 'p',
        text: 'Day-to-day work lives in the AlertMend UI once the cluster agent shows Running. Match the job below to a route.',
      },
      {
        type: 'h2',
        id: 'areas',
        text: 'Open by job',
      },
      {
        type: 'table',
        headers: ['If you need to…', 'Open route'],
        rows: [
          ['See live health and KPIs', '/dashboard'],
          ['Service dependencies and live traffic', '/service-map'],
          ['APM / RED / span drill-down', '/apm-analysis'],
          ['Query metrics (PromQL / panels)', '/metrics-dashboard'],
          ['Search logs', '/logs'],
          ['CPU flamegraphs / profiling', '/cpu-profiling'],
          ['Observability hub', '/observability'],
          ['Live alert stream', '/alerts-feed'],
          ['Incidents with ownership', '/incidents'],
          ['AI root cause', '/rca'],
          ['Build or run remediation', '/rf'],
          ['Linear runbooks', '/rf/runbooks'],
          ['Reusable commands', '/commands'],
          ['Connected agents', '/agents'],
          ['On-call who is up', '/on-call'],
          ['Schedules / rotations', '/schedules'],
          ['Escalation chains', '/escalation-paths'],
          ['Kubernetes right-sizing', '/cost-optimizations'],
          ['AWS cloud cost findings', '/cloud-cost-optimizations'],
          ['Users and roles', '/users'],
          ['Audit trail', '/system-audit'],
          ['Security settings', '/security'],
        ],
      },
      {
        type: 'h2',
        id: 'agents',
        text: 'What the agent installs',
      },
      {
        type: 'table',
        headers: ['Component', 'In primary chart?', 'Role'],
        rows: [
          ['AlertMend Agent', 'Yes', 'gRPC to master; inventory; RF / command execution'],
          ['K8s + node metrics collectors', 'Yes', 'Cluster and node metrics into Victoria Metrics'],
          ['OTLP collector', 'Yes (otlpCollector.enabled, default on)', 'Traces and app metrics export'],
          ['Logs agent', 'No (separate chart alertmend-logs-agent)', 'Log shipping into AlertMend'],
          ['Auto-instrumentation operator', 'No (follow-up)', 'CRD autoinstrumentations.instrumentation.alertmend.io'],
          ['Deep Visibility (eBPF)', 'Optional with node path', 'L4/L7 flows, DB wire, CPU profiles'],
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'Start here after install',
        body: [
          'Confirm pods: kubectl -n alertmend get pods',
          'Confirm cluster in /agents',
          'Open /service-map, then enable logs and auto-instrumentation if you need full APM depth',
        ],
      },
      {
        type: 'h2',
        id: 'pillars',
        text: 'Operating loop',
      },
      {
        type: 'ol',
        items: [
          'Observe: /service-map, /metrics-dashboard, /logs, /apm-analysis',
          'Alert: /alerts-feed, health policies, /incidents',
          'Diagnose: /rca with evidence tools',
          'Automate: /rf, /rf/runbooks, /commands with approval gates',
          'Optimize: /cost-optimizations, /cloud-cost-optimizations',
        ],
      },
    ],
  },
  {
    slug: 'concepts',
    title: 'Key terms',
    description:
      'Glossary of AlertMend terms: Remediation Flow (RF), runbook, command, resource alias, AT-QL, approval, agent, BYOM, and more.',
    keywords: 'AlertMend RF, runbook, AT-QL, approval, agent, BYOM glossary',
    lead: 'Shared vocabulary used across the UI, API, and docs.',
    blocks: [
      {
        type: 'p',
        text: 'These terms appear in the RF editor, RCA panel, agent install, and audit trail. Learn them once and the rest of the product reads consistently.',
      },
      {
        type: 'h2',
        id: 'automation',
        text: 'Automation',
      },
      {
        type: 'table',
        headers: ['Term', 'Meaning'],
        rows: [
          ['Remediation Flow (RF)', 'Visual DAG of actions with depends_on_actions. Power-user automation path. UI: /rf'],
          ['Runbook', 'Linear steps that compile to an RF. Easier authoring and library sharing. UI: /rf/runbooks'],
          ['Command', 'Reusable shell or Kubernetes operation used inside RF and runbook steps. UI: /commands'],
          ['Resource alias', 'Named target set saved at /resources (Basic filters or AT-QL)'],
          ['AT-QL', 'AlertMend Query Language for pods/nodes/VMs. Not log SQL. See AT-QL docs'],
          ['Log SQL', 'SELECT … FROM logs in /logs (filter mode or SQL mode). Separate from AT-QL'],
          ['Approval', 'Human gate (Slack, Teams webhook, or UI) before a risky RF step continues. Action type: approval'],
          ['Trigger', 'What starts an RF: alert_manager | custom_webhook | datadog_webhook | cron | system_webhook'],
          ['RF action types', 'command_execution | approval | metrics | traces | integration | integration_message | incident'],
          ['RF execution', 'One run instance with history, downloads, and audit'],
          ['Playbook catalog', 'Seeded RF templates for common day-2 Kubernetes ops'],
          ['Remediation policy', 'Blocks destructive patterns such as kubectl delete, helm uninstall, rm -rf unless explicitly allowed'],
        ],
      },
      {
        type: 'h2',
        id: 'observe',
        text: 'Observability & agents',
      },
      {
        type: 'table',
        headers: ['Term', 'Meaning'],
        rows: [
          ['Agent / master', 'Cluster agent connects to the control plane over gRPC using agentId + key + masterUrl'],
          ['AlertMend Metrics', 'Victoria Metrics backed store used by /metrics-dashboard and PromQL'],
          ['OTLP collector', 'In-cluster collector that exports traces and app metrics (otlpCollector.enabled)'],
          ['Deep Visibility', 'eBPF-based observability: flows, L7, DB wire, CPU (/cpu-profiling)'],
          ['Auto-instrumentation', 'CRD autoinstrumentations.instrumentation.alertmend.io; annotate inject-nodejs / inject-python / inject-java / inject-dotnet'],
        ],
      },
      {
        type: 'h2',
        id: 'rca-ops',
        text: 'RCA, incidents, governance',
      },
      {
        type: 'table',
        headers: ['Term', 'Meaning'],
        rows: [
          ['AI RCA', 'Evidence-backed root cause with confidence. UI: /rca'],
          ['BYOM', 'Bring your own model via rca_llm / RCA_LLM_PROVIDER: azure_openai | ollama | anthropic_foundry'],
          ['PR Fix', 'Suggested GitHub pull request from an RCA'],
          ['Verify fix', 'Post-remediation RED or SLO re-check after an RF runs'],
          ['Health policy', 'Native Kubernetes condition rules (rule_types: availability, deploy, job, node, pvc, workflow_pod)'],
          ['Workspace', 'Tenant boundary with its own agents, RFs, and users'],
          ['System audit', 'Who did what, when, across approvals and admin actions. UI: /system-audit'],
        ],
      },
    ],
  },
  {
    slug: 'architecture',
    title: 'How it fits together',
    description:
      'How AlertMend control plane, agents, collectors, metrics stores, and the UI connect.',
    keywords: 'AlertMend architecture, gRPC agent, Victoria Metrics, OTLP',
    lead: 'Control plane in your environment. Agents in your clusters. Telemetry stays where you put it.',
    blocks: [
      {
        type: 'h2',
        id: 'planes',
        text: 'Two planes',
      },
      {
        type: 'table',
        headers: ['Plane', 'Components'],
        rows: [
          ['Control plane', 'AlertMend server (HTTP API + gRPC master), React UI, MongoDB, Redis, Victoria Metrics (metrics), traces store, logs store, RCA + RF engines'],
          ['Data plane', 'Cluster agent, exec-agent, metrics and node collectors, OTLP collector, optional logs agent, optional eBPF Deep Visibility, optional auto-instrumentation operator'],
        ],
      },
      {
        type: 'h2',
        id: 'stores',
        text: 'Stores',
      },
      {
        type: 'table',
        headers: ['Store', 'Signals', 'Used by'],
        rows: [
          ['Victoria Metrics', 'Metrics / PromQL', '/metrics-dashboard, metric alerts, RF metrics actions'],
          ['Traces store', 'Distributed traces', '/apm-analysis, service map, RCA evidence'],
          ['Log store', 'Historical and live logs', '/logs, RCA evidence'],
          ['MongoDB', 'Config, RF defs, users, incidents', 'Control plane API'],
          ['Redis', 'Queues, sessions, short-lived state', 'Master and workers'],
        ],
      },
      {
        type: 'h2',
        id: 'flow',
        text: 'Request paths',
      },
      {
        type: 'ol',
        items: [
          'Agents dial the master gRPC endpoint with global.agentId and global.key from Helm values.',
          'Alerts arrive on workspace webhooks and can match RF triggers (alert_manager, datadog_webhook, custom_webhook, cron, system_webhook).',
          'OTLP traffic authenticates at the gateway and lands in the traces store and Victoria Metrics (spanmetrics / app metrics). Logs arrive through the logs agent.',
          'RF steps resolve targets (aliases / AT-QL), dispatch to the agent or exec-agent, then record completion and audit.',
          'RCA gathers evidence tools (pod yaml/events/logs, eBPF traces, OTel traces, CPU profile, metrics) and calls the configured LLM provider.',
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'Self-host first',
        body: 'You can run the control plane on a VM or in Kubernetes. Customer clusters only need the agent chart and optional collectors. Agents never require inbound cluster exposure to the public internet if they can dial the master URL.',
      },
      {
        type: 'h2',
        id: 'trust',
        text: 'Trust boundaries',
      },
      {
        type: 'ul',
        items: [
          'Agent auth: agentId + key per cluster registration',
          'Destructive commands blocked by remediation policy (kubectl delete, helm uninstall, rm -rf, and similar)',
          'Approval actions pause RF until Slack / Teams webhook / UI accepts',
          'System audit at /system-audit records who approved and what ran',
        ],
      },
      {
        type: 'h2',
        id: 'related',
        text: 'Related docs',
      },
      {
        type: 'ul',
        items: [
          'Connect a Kubernetes cluster (Helm install)',
          'Bring your own model (rca_llm / RCA_LLM_PROVIDER)',
          'Users, RBAC & audit',
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // Install
  // ---------------------------------------------------------------------------
  {
    slug: 'install-cluster-agent',
    title: 'Connect a Kubernetes cluster',
    description:
      'Install the AlertMend Kubernetes agent with Helm. One chart deploys the agent, metrics collectors, and OTel export.',
    keywords: 'AlertMend Helm, install agent, Kubernetes agent, OTel collector, alertmend-agent',
    lead: 'Three required values: global.agentId, global.key, and global.masterUrl. Everything else inherits from global.*.',
    blocks: [
      {
        type: 'h2',
        id: 'prereqs',
        text: 'Prerequisites',
      },
      {
        type: 'ul',
        items: [
          'Helm 3 and kubectl pointed at the target cluster',
          'Agent ID, Key, and Master URL from AlertMend UI → Add Cluster (or /agents)',
          'Outbound network from the cluster to the master URL (gRPC) and OTLP gateway if enabled',
        ],
      },
      {
        type: 'h2',
        id: 'what',
        text: 'What the chart deploys',
      },
      {
        type: 'table',
        headers: ['Component', 'Role'],
        rows: [
          ['AlertMend Agent', 'gRPC connection to the master; inventory and RF / command execution'],
          ['K8s metrics collector', 'metrics-server + kube-state-metrics path into Victoria Metrics'],
          ['Node metrics collector', 'DaemonSet + node-exporter (and GPU when present)'],
          ['OTLP collector', 'Traces and app metrics export (otlpCollector.enabled, on by default)'],
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'Not in this chart',
        body: [
          'Logs: install alertmend-logs-agent as a separate release',
          'Auto-instrumentation: separate operator + CRD (requires cert-manager)',
          'Deep Visibility eBPF: enable via onboarding / agent values when available for your tenant',
        ],
      },
      {
        type: 'h2',
        id: 'install',
        text: 'Install from the Helm repo',
      },
      {
        type: 'code',
        lang: 'bash',
        code: `helm repo add alertmend https://alertmendcharts.z29.web.core.windows.net
helm repo update

helm install alertmend-agent alertmend/alertmend-agent \\
  -n alertmend --create-namespace \\
  --set global.agentId=<YOUR_AGENT_ID> \\
  --set global.key=<YOUR_KEY> \\
  --set global.masterUrl=<YOUR_MASTER_URL>`,
      },
      {
        type: 'h2',
        id: 'values',
        text: 'Key Helm values',
      },
      {
        type: 'table',
        headers: ['Value', 'Required', 'Purpose'],
        rows: [
          ['global.agentId', 'Yes', 'Cluster registration ID from Add Cluster'],
          ['global.key', 'Yes', 'Agent auth key'],
          ['global.masterUrl', 'Yes', 'Control plane gRPC / master URL'],
          ['global.imageRegistry', 'No', 'Rebrand or mirror images (example: myco.azurecr.io)'],
          ['otlpCollector.enabled', 'No', 'Toggle OTLP collector (default true)'],
        ],
      },
      {
        type: 'h3',
        id: 'values-file',
        text: 'Production values file',
      },
      {
        type: 'code',
        lang: 'yaml',
        code: `global:
  agentId: "<YOUR_AGENT_ID>"
  key: "<YOUR_KEY>"
  masterUrl: "<YOUR_MASTER_URL>"
  # imageRegistry: "myco.azurecr.io"

otlpCollector:
  enabled: true`,
      },
      {
        type: 'code',
        lang: 'bash',
        code: `helm install alertmend-agent alertmend/alertmend-agent \\
  -n alertmend --create-namespace -f my-values.yaml`,
      },
      {
        type: 'h2',
        id: 'verify',
        text: 'Verify',
      },
      {
        type: 'code',
        lang: 'bash',
        code: `kubectl -n alertmend get pods
kubectl -n alertmend get deploy,ds
kubectl -n alertmend logs deploy/alertmend-agent-agent --tail=100`,
      },
      {
        type: 'ol',
        items: [
          'All pods in namespace alertmend should be Running (or Completed for one-shot jobs).',
          'Open /agents in the UI and confirm the cluster shows connected.',
          'Open /service-map or /metrics-dashboard and wait for first scrape / traffic.',
        ],
      },
      {
        type: 'h2',
        id: 'opts',
        text: 'Useful operations',
      },
      {
        type: 'code',
        lang: 'bash',
        code: `# Disable OTel export
helm upgrade alertmend-agent alertmend/alertmend-agent -n alertmend --reuse-values \\
  --set otlpCollector.enabled=false

# Mirror images
helm upgrade alertmend-agent alertmend/alertmend-agent -n alertmend --reuse-values \\
  --set global.imageRegistry=myco.azurecr.io

# Uninstall
helm uninstall alertmend-agent -n alertmend`,
      },
      {
        type: 'callout',
        tone: 'warn',
        title: 'Credentials',
        body: 'Treat global.key like a secret. Prefer a sealed values file or CI secret injection. Rotate from the UI if a key leaks.',
      },
    ],
  },
  {
    slug: 'install-logs-agent',
    title: 'Install the logs agent',
    description:
      'Install AlertMend logs collection as a separate Helm release using the same agent credentials.',
    keywords: 'AlertMend logs agent, Helm logs, Kubernetes log collection, alertmend-logs-agent',
    lead: 'Logs are not part of the umbrella agent chart. Install alertmend-logs-agent with the same three credentials.',
    blocks: [
      {
        type: 'p',
        text: 'The primary alertmend-agent chart does not ship cluster log collection. Install the logs agent as its own Helm release so you can scale, upgrade, or omit logs independently.',
      },
      {
        type: 'h2',
        id: 'prereqs',
        text: 'Prerequisites',
      },
      {
        type: 'ul',
        items: [
          'Primary cluster agent already installed and connected (/agents)',
          'Same global.agentId, global.key, and global.masterUrl as the primary install',
          'Helm repo: https://alertmendcharts.z29.web.core.windows.net',
        ],
      },
      {
        type: 'h2',
        id: 'install',
        text: 'Install',
      },
      {
        type: 'code',
        lang: 'bash',
        code: `helm repo add alertmend https://alertmendcharts.z29.web.core.windows.net
helm repo update

helm install alertmend-logs alertmend/alertmend-logs-agent \\
  -n alertmend \\
  --set global.agentId=<YOUR_AGENT_ID> \\
  --set global.key=<YOUR_KEY> \\
  --set global.masterUrl=<YOUR_MASTER_URL>`,
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'Namespace',
        body: 'Use the same namespace as the primary agent (alertmend) unless your networking policy requires otherwise.',
      },
      {
        type: 'h2',
        id: 'verify',
        text: 'Verify',
      },
      {
        type: 'code',
        lang: 'bash',
        code: `kubectl -n alertmend get pods | grep -i log
kubectl -n alertmend logs -l app.kubernetes.io/name=alertmend-logs-agent --tail=50`,
      },
      {
        type: 'ol',
        items: [
          'Confirm log agent pods are Running.',
          'Open /logs in the UI and search a known namespace or pod.',
          'Trigger a test incident and confirm logs appear as RCA evidence.',
        ],
      },
      {
        type: 'h2',
        id: 'where',
        text: 'Where logs land',
      },
      {
        type: 'table',
        headers: ['Surface', 'Route / store'],
        rows: [
          ['Log search UI', '/logs'],
          ['Backend store', 'AlertMend log store'],
          ['RCA evidence', '/rca pulls related log windows'],
          ['Live pod logs', 'Also available via cluster agent during investigations'],
        ],
      },
      {
        type: 'h2',
        id: 'uninstall',
        text: 'Uninstall',
      },
      {
        type: 'code',
        lang: 'bash',
        code: `helm uninstall alertmend-logs -n alertmend`,
      },
    ],
  },
  {
    slug: 'auto-instrumentation',
    title: 'Auto-instrumentation',
    description:
      'Enable zero-code application spans with the AlertMend AutoInstrumentation CRD and OpenTelemetry Operator.',
    keywords:
      'AlertMend auto-instrumentation, AutoInstrumentation CRD, OpenTelemetry Operator, inject-nodejs',
    lead: 'Zero-code, code-level spans. Not in the primary agent install. Opt in per workload with language annotations after the operator is installed.',
    blocks: [
      {
        type: 'callout',
        tone: 'warn',
        title: 'Not included in the primary agent install',
        body: 'helm install alertmend-agent does not create the AutoInstrumentation CRD. Install the operator as a follow-up. cert-manager is required for webhook TLS.',
      },
      {
        type: 'h2',
        id: 'what',
        text: 'What you get',
      },
      {
        type: 'ul',
        items: [
          'CRD: autoinstrumentations.instrumentation.alertmend.io',
          'OpenTelemetry Operator + AlertMend instrumentation operator',
          'Per-pod injection via annotations for Node.js, Python, Java, and .NET',
          'Spans exported through the in-cluster OTLP collector into the AlertMend traces store',
        ],
      },
      {
        type: 'h2',
        id: 'wizard',
        text: 'From the onboarding wizard (recommended)',
      },
      {
        type: 'ol',
        items: [
          'Install the primary cluster agent and confirm /agents shows connected.',
          'Run Install AlertMend AutoInstrumentation CRD (operator + injection) from onboarding.',
          'Confirm cert-manager is present in the cluster before the webhook installs.',
          'Annotate workloads to opt in (see below).',
        ],
      },
      {
        type: 'h2',
        id: 'manual',
        text: 'Manual Helm',
      },
      {
        type: 'code',
        lang: 'bash',
        code: `# Requires cert-manager already installed in the cluster
helm upgrade --install alertmend-instrumentation-operator \\
  alertmend/alertmend-instrumentation-operator -n alertmend \\
  --set image.registry=alertmendagent.azurecr.io \\
  --set certManager.enabled=true \\
  --set gateway.service=alertmend-k8s-agent-otlp-collector

helm upgrade alertmend-k8s-agent alertmend/alertmend-agent -n alertmend --reuse-values \\
  --set otlp-collector.instrumentation.enabled=true \\
  --set otlp-collector.instrumentation.crd.enabled=true`,
      },
      {
        type: 'h2',
        id: 'verify',
        text: 'Verify operator + CRD',
      },
      {
        type: 'code',
        lang: 'bash',
        code: `kubectl get crd autoinstrumentations.instrumentation.alertmend.io
kubectl get autoinstrumentation -A
kubectl -n alertmend get pods | grep -i instrument`,
      },
      {
        type: 'h2',
        id: 'annotate',
        text: 'Opt in workloads',
      },
      {
        type: 'p',
        text: 'Annotate pods (or the owning Deployment/StatefulSet template) so the mutating webhook injects the language agent.',
      },
      {
        type: 'table',
        headers: ['Language', 'Annotation (typical)'],
        rows: [
          ['Node.js', 'instrumentation.alertmend.io/inject-nodejs: "true"'],
          ['Python', 'instrumentation.alertmend.io/inject-python: "true"'],
          ['Java', 'instrumentation.alertmend.io/inject-java: "true"'],
          ['.NET', 'instrumentation.alertmend.io/inject-dotnet: "true"'],
        ],
      },
      {
        type: 'code',
        lang: 'bash',
        code: `kubectl -n payments annotate deploy/payments-api \\
  instrumentation.alertmend.io/inject-nodejs=true --overwrite

kubectl -n payments rollout restart deploy/payments-api`,
      },
      {
        type: 'h2',
        id: 'see',
        text: 'Where spans show up',
      },
      {
        type: 'ul',
        items: [
          '/apm-analysis for service and endpoint RED + waterfalls',
          '/service-map for edges from live traffic',
          '/rca evidence tools for OTel traces during incidents',
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'Enterprise networking',
        body: 'Open the firewall allowlist for the OTLP gateway host your tenant uses. Confirm otlpCollector.enabled=true on the primary agent.',
      },
    ],
  },
  {
    slug: 'install-vm-collectors',
    title: 'VM & host collectors',
    description:
      'Install AlertMend collectors on VMs and hosts for app metrics, CloudWatch, VM host monitoring, and logs.',
    keywords: 'AlertMend VM agent, host collector, CloudWatch collector, app metrics, install.sh',
    lead: 'Hybrid estates use the host installer with Agent ID and Master URL. Kubernetes is not required on the box.',
    blocks: [
      {
        type: 'p',
        text: 'For non-Kubernetes workloads, AlertMend ships an installer that supports app-metrics, cloudwatch, vm-host, and logs collector types. Create or reuse an agent registration in the UI to get Agent ID and Master URL.',
      },
      {
        type: 'h2',
        id: 'types',
        text: 'Collector types',
      },
      {
        type: 'table',
        headers: ['Type', 'What it collects'],
        rows: [
          ['app-metrics', 'MySQL, MongoDB, Redis, Postgres, Elasticsearch, Cassandra style exporters'],
          ['cloudwatch', 'AWS metric discovery jobs into AlertMend Metrics'],
          ['vm-host', 'Host and Docker monitoring for VMs'],
          ['logs', 'Host-side log shipping when you are not on the K8s logs agent'],
        ],
      },
      {
        type: 'h2',
        id: 'install',
        text: 'Install shape',
      },
      {
        type: 'code',
        lang: 'bash',
        code: `# Follow the current installer flags from your tenant /agents onboarding
./install.sh --type vm-host \\
  --agent-id <YOUR_AGENT_ID> \\
  --master-url <YOUR_MASTER_URL>

./install.sh --type app-metrics \\
  --agent-id <YOUR_AGENT_ID> \\
  --master-url <YOUR_MASTER_URL>

./install.sh --type cloudwatch \\
  --agent-id <YOUR_AGENT_ID> \\
  --master-url <YOUR_MASTER_URL>

./install.sh --type logs \\
  --agent-id <YOUR_AGENT_ID> \\
  --master-url <YOUR_MASTER_URL>`,
      },
      {
        type: 'h2',
        id: 'verify',
        text: 'Verify',
      },
      {
        type: 'ol',
        items: [
          'Confirm the collector service/process is running on the host.',
          'Open /agents and confirm the VM/host agent is connected.',
          'Check /metrics-dashboard for host or app series, or /logs for host logs.',
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'Remediation on VMs',
        body: 'Predefined VM actions for remediation are documented under VM predefined actions. Pair collectors with RF command_execution steps scoped to the host agent.',
      },
      {
        type: 'h2',
        id: 'related',
        text: 'Related UI',
      },
      {
        type: 'ul',
        items: [
          '/agents for registration status',
          '/metrics-dashboard for host and app metrics',
          '/cloud-cost-optimizations when CloudWatch / AWS FinOps is enabled',
          '/documentation/alertmend-vm-actions for action catalogs',
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // Observability
  // ---------------------------------------------------------------------------
  {
    slug: 'observability',
    title: 'Observability overview',
    description:
      'AlertMend observability: metrics, logs, traces, service map, and Deep Visibility on one timeline.',
    keywords: 'AlertMend observability, OpenTelemetry, service map, APM, Victoria Metrics',
    lead: 'Metrics, logs, and distributed traces correlated for Kubernetes-first incident work.',
    blocks: [
      {
        type: 'p',
        text: 'Observability in AlertMend is built so a click in the service map lands on the exact trace, log line, and metric window. Metrics use Victoria Metrics. Logs and traces land in AlertMend stores you control.',
      },
      {
        type: 'h2',
        id: 'signals',
        text: 'Signals → routes → stores',
      },
      {
        type: 'table',
        headers: ['Signal', 'UI route', 'Store', 'How it arrives'],
        rows: [
          ['Service graph / live traffic', '/service-map', 'Traces + eBPF/OTel', 'OTLP + Deep Visibility L4/L7'],
          ['APM / RED / waterfalls', '/apm-analysis', 'Traces store', 'OTLP (+ auto-instrumentation)'],
          ['Metrics / PromQL', '/metrics-dashboard', 'Victoria Metrics', 'Node/K8s collectors, spanmetrics, Prometheus remote'],
          ['Logs', '/logs', 'Log store', 'alertmend-logs-agent or host logs collector'],
          ['CPU profiles', '/cpu-profiling', 'Deep Visibility', 'eBPF CPU'],
          ['Hub', '/observability', 'All', 'Entry point across signals'],
        ],
      },
      {
        type: 'h2',
        id: 'enable',
        text: 'What to enable',
      },
      {
        type: 'ol',
        items: [
          'Primary agent with otlpCollector.enabled=true for traces and app metrics.',
          'alertmend-logs-agent for historical log search.',
          'Auto-instrumentation CRD + language annotations for code-level spans.',
          'Deep Visibility when you need zero-SDK L7 / DB wire / CPU truth.',
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'Start here after agent install',
        body: 'Confirm the cluster in /agents, open /service-map, then add logs and auto-instrumentation if APM looks thin.',
      },
      {
        type: 'h2',
        id: 'rca',
        text: 'How observability feeds RCA',
      },
      {
        type: 'p',
        text: 'When an alert opens /rca, evidence tools pull pod yaml/events/logs, eBPF traces, OTel traces, CPU profile, and metrics onto one ledger. Gaps in collection show up as missing evidence, not as a failed RCA product feature.',
      },
    ],
  },
  {
    slug: 'metrics',
    title: 'Metrics & dashboards',
    description:
      'AlertMend Metrics (Victoria Metrics) dashboards, PromQL explorer, and metric alerting.',
    keywords: 'AlertMend Metrics, Victoria Metrics, PromQL, metric alerts, metrics-dashboard',
    lead: 'Per-cluster dashboards, metric alerts, and direct PromQL on Victoria Metrics.',
    blocks: [
      {
        type: 'p',
        text: 'AlertMend Metrics is backed by Victoria Metrics. Cluster and node collectors from the primary Helm chart scrape into it. OTLP spanmetrics and optional Prometheus / Victoria Metrics integrations can feed the same store.',
      },
      {
        type: 'h2',
        id: 'ui',
        text: 'UI surfaces',
      },
      {
        type: 'table',
        headers: ['Surface', 'Route', 'Use'],
        rows: [
          ['Metrics dashboard', '/metrics-dashboard', 'Panels, drill-downs, saved views'],
          ['Observability hub', '/observability', 'Jump across signals'],
          ['Service map health', '/service-map', 'RPS / error / latency edges'],
          ['APM RED', '/apm-analysis', 'Endpoint-level rates and latency'],
        ],
      },
      {
        type: 'h2',
        id: 'sources',
        text: 'Metric sources',
      },
      {
        type: 'ul',
        items: [
          'K8s metrics collector (kube-state-metrics / metrics-server path)',
          'Node metrics collector (node-exporter, GPU when present)',
          'OTLP collector spanmetrics / app metrics (otlpCollector.enabled)',
          'Integrations: PROMETHEUS, VICTORIAMETRICS (AlertMend Metrics)',
          'VM / host collectors (app-metrics, vm-host, cloudwatch)',
        ],
      },
      {
        type: 'h2',
        id: 'alerts',
        text: 'Metric alerts',
      },
      {
        type: 'p',
        text: 'Use PromQL or template rules for threshold pages. Metric alerts enter the same /alerts-feed and /incidents paths as webhooks, and can match RF triggers (for example system_webhook or alert_manager style bindings depending on how the rule is published).',
      },
      {
        type: 'h2',
        id: 'verify',
        text: 'Verify collection',
      },
      {
        type: 'code',
        lang: 'bash',
        code: `kubectl -n alertmend get pods
# Confirm metrics collector / node exporter pods are Running
# Then open /metrics-dashboard and run a simple PromQL check
# example: up or kube_pod_info`,
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'RF metrics action',
        body: 'Remediation Flows can include action type metrics to gate continue/fail on a PromQL or RED check before later steps.',
      },
    ],
  },
  {
    slug: 'logs',
    title: 'Logs',
    description:
      'Collect and search Kubernetes and host logs in AlertMend for incidents and AI RCA.',
    keywords: 'AlertMend logs, log search, SQL logs, alertmend-logs-agent',
    lead: 'Live pod logs for investigations plus historical SQL search for RCA and audits.',
    blocks: [
      {
        type: 'p',
        text: 'Logs are a first-class RCA evidence source. Historical search requires the separate alertmend-logs-agent chart (or a host logs collector). Live pod log tails can also come from the cluster agent during an investigation.',
      },
      {
        type: 'h2',
        id: 'ui',
        text: 'UI',
      },
      {
        type: 'table',
        headers: ['Capability', 'Where'],
        rows: [
          ['Search / streams / time range', '/logs'],
          ['Field explorer and download', '/logs'],
          ['RCA evidence window', '/rca'],
          ['Store', 'AlertMend log store'],
        ],
      },
      {
        type: 'h2',
        id: 'query',
        text: 'How to query',
      },
      {
        type: 'p',
        text: 'Use filter mode or SQL mode (SELECT … FROM logs). Full syntax, field lists, and OTEL restrictions are in Query logs (SQL). AT-QL is not used here.',
      },
      {
        type: 'code',
        lang: 'sql',
        code: `SELECT _timestamp, kubernetes_pod_name, message
FROM logs
WHERE kubernetes_namespace_name = 'production'
  AND severity = 'ERROR'
ORDER BY _timestamp DESC`,
      },
      {
        type: 'h2',
        id: 'install',
        text: 'Install path',
      },
      {
        type: 'code',
        lang: 'bash',
        code: `helm install alertmend-logs alertmend/alertmend-logs-agent \\
  -n alertmend \\
  --set global.agentId=<YOUR_AGENT_ID> \\
  --set global.key=<YOUR_KEY> \\
  --set global.masterUrl=<YOUR_MASTER_URL>

kubectl -n alertmend get pods | grep -i log`,
      },
      {
        type: 'h2',
        id: 'features',
        text: 'What you can do',
      },
      {
        type: 'ul',
        items: [
          'Historical search across namespaces and workloads',
          'Live pod logs via the cluster agent during investigations',
          'OTLP logs correlated with traces where enabled',
          'Streams, field explorer, download, and time-range filters',
          'Log pipelines for processing and routing (tenant-dependent)',
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'RCA tip',
        body: 'If /rca reports missing log evidence, verify the logs agent pods first. Trace-only RCA is weaker on CrashLoop and config failures.',
      },
      {
        type: 'h2',
        id: 'host',
        text: 'Non-Kubernetes hosts',
      },
      {
        type: 'p',
        text: 'Use the VM installer with --type logs when the workload is not on the K8s logs agent. See VM & host collectors.',
      },
    ],
  },
  {
    slug: 'traces-apm',
    title: 'Traces & APM',
    description:
      'Distributed traces and APM analysis in AlertMend via OpenTelemetry and eBPF.',
    keywords: 'AlertMend APM, traces, OpenTelemetry, span waterfall, service-map, apm-analysis',
    lead: 'Follow one request across hops with p50/p95/p99, errors, and slow spans highlighted.',
    blocks: [
      {
        type: 'p',
        text: 'Traces land in the AlertMend traces store. You get service maps from live traffic, APM analysis for RED and waterfalls, and first-class RCA evidence when an alert fires.',
      },
      {
        type: 'h2',
        id: 'routes',
        text: 'Routes',
      },
      {
        type: 'table',
        headers: ['View', 'Route', 'Use'],
        rows: [
          ['Service map', '/service-map', 'Dependencies, RPS, error edges'],
          ['APM analysis', '/apm-analysis', 'Services, endpoints, RED, waterfalls'],
          ['Observability hub', '/observability', 'Cross-signal entry'],
          ['RCA', '/rca', 'Pull related OTel / eBPF spans as evidence'],
        ],
      },
      {
        type: 'h2',
        id: 'ingest',
        text: 'How traces ingest',
      },
      {
        type: 'ol',
        items: [
          'Keep otlpCollector.enabled=true on the primary agent chart.',
          'Optionally install auto-instrumentation and annotate inject-nodejs / inject-python / inject-java / inject-dotnet.',
          'Optionally enable Deep Visibility for L7 / DB wire without SDKs.',
          'Confirm spans in /apm-analysis within a few minutes of traffic.',
        ],
      },
      {
        type: 'h2',
        id: 'verify',
        text: 'Verify',
      },
      {
        type: 'code',
        lang: 'bash',
        code: `kubectl -n alertmend get pods
# Confirm OTLP collector pod is Running
# Generate traffic, then open /apm-analysis and /service-map`,
      },
      {
        type: 'h2',
        id: 'rf',
        text: 'RF traces action',
      },
      {
        type: 'p',
        text: 'Remediation Flows support action type traces to fetch or assert on span data mid-flow (for example, confirm error rate dropped after a restart before posting the summary).',
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'SDK vs auto vs eBPF',
        body: [
          'Manual OTLP SDK: richest custom attributes',
          'Auto-instrumentation CRD: zero-code language agents',
          'Deep Visibility: kernel/L7 truth without touching the app image',
        ],
      },
    ],
  },
  {
    slug: 'deep-visibility',
    title: 'Deep Visibility (eBPF)',
    description:
      'AlertMend Deep Visibility uses eBPF for L4 flows, L7 HTTP/gRPC, database wire spans, and CPU flamegraphs.',
    keywords: 'AlertMend eBPF, Deep Visibility, CPU profiling, service graph, cpu-profiling',
    lead: 'Zero-instrumentation dependency and latency truth from the kernel side.',
    blocks: [
      {
        type: 'p',
        text: 'Deep Visibility uses eBPF to observe traffic and CPU without shipping an SDK in every service. It complements OTLP auto-instrumentation rather than replacing it.',
      },
      {
        type: 'h2',
        id: 'signals',
        text: 'What it captures',
      },
      {
        type: 'table',
        headers: ['Signal', 'Use'],
        rows: [
          ['L4 TCP flows', 'Service graph CALLS edges, RPS, RTT'],
          ['L7 HTTP/gRPC', 'Method, path, status (cleartext and TLS uprobes where supported)'],
          ['Database wire', 'MongoDB, Postgres, Redis, MySQL spans without an SDK'],
          ['CPU flamegraphs', '/cpu-profiling per workload'],
          ['Exception groups', 'Aggregated for RCA evidence'],
        ],
      },
      {
        type: 'h2',
        id: 'ui',
        text: 'UI routes',
      },
      {
        type: 'ul',
        items: [
          '/service-map for eBPF-backed edges',
          '/apm-analysis when eBPF spans are correlated',
          '/cpu-profiling for flamegraphs',
          '/rca evidence tools for eBPF traces and CPU profile',
        ],
      },
      {
        type: 'h2',
        id: 'enable',
        text: 'How it ships',
      },
      {
        type: 'p',
        text: 'Deep Visibility typically rides with the node metrics path as an eBPF sidecar or DaemonSet component. Enable it from cluster onboarding options or agent values for your tenant, then verify node pods in the alertmend namespace.',
      },
      {
        type: 'code',
        lang: 'bash',
        code: `kubectl -n alertmend get pods -o wide
# Confirm node / deep-visibility related DaemonSet pods are Running on worker nodes`,
      },
      {
        type: 'callout',
        tone: 'warn',
        title: 'Kernel requirements',
        body: 'eBPF features depend on node kernel version and privileges. If L7 or TLS uprobes are missing on older kernels, you still get L4 flows; add auto-instrumentation for code-level spans.',
      },
      {
        type: 'h2',
        id: 'rca',
        text: 'RCA evidence tools',
      },
      {
        type: 'ul',
        items: [
          'eBPF traces for dependency and latency truth',
          'CPU profile for hot stacks during incidents',
          'Combine with OTel traces, pod logs, and metrics on the same /rca timeline',
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // Alerting & on-call
  // ---------------------------------------------------------------------------
  {
    slug: 'alerts-incidents',
    title: 'Alerts & incidents',
    description:
      'AlertMend alerts feed, filtering, webhook triggers, and incident management.',
    keywords: 'AlertMend alerts, incidents, Alertmanager, Datadog webhook, alerts-feed',
    lead: 'Ingest alerts, dedupe noise, open incidents, and attach RCA and remediation.',
    blocks: [
      {
        type: 'h2',
        id: 'ingress',
        text: 'How alerts enter',
      },
      {
        type: 'table',
        headers: ['Source', 'RF trigger type (when wired to RF)', 'Notes'],
        rows: [
          ['Prometheus Alertmanager', 'alert_manager', 'Workspace webhook URL from integrations'],
          ['Datadog monitors', 'datadog_webhook', 'See Datadog webhook docs'],
          ['Custom systems', 'custom_webhook', 'Arbitrary JSON webhook'],
          ['Scheduled jobs', 'cron', 'Time-based RF starts'],
          ['Internal / platform', 'system_webhook', 'Health policy and system-originated events'],
          ['Metric alerts', '(via alert / system path)', 'PromQL / template rules on Victoria Metrics'],
          ['Health policies', 'system_webhook (typical)', 'Native K8s condition rules'],
        ],
      },
      {
        type: 'h2',
        id: 'ui',
        text: 'UI surfaces',
      },
      {
        type: 'table',
        headers: ['Surface', 'Route'],
        rows: [
          ['Live alert stream', '/alerts-feed'],
          ['Incidents', '/incidents'],
          ['AI RCA from an incident', '/rca'],
          ['Escalation paths', '/escalation-paths'],
          ['On-call who is up', '/on-call'],
        ],
      },
      {
        type: 'h2',
        id: 'loop',
        text: 'Typical loop',
      },
      {
        type: 'ol',
        items: [
          'Alert lands in /alerts-feed (webhook, metric rule, or health policy).',
          'Deduping / filtering reduces noise; related alerts open or update an /incidents record.',
          'Open /rca for evidence-backed root cause.',
          'Matched RF triggers can start remediation (still gated by approval actions you define).',
          'Post summary back via integration or integration_message actions.',
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'RF incident action',
        body: 'Action type incident can create or update incident records from inside a flow so chat approvals and execution stay attached to the same ticket.',
      },
      {
        type: 'h2',
        id: 'setup',
        text: 'Wire Alertmanager (shape)',
      },
      {
        type: 'code',
        lang: 'yaml',
        code: `# Alertmanager receiver pointing at your workspace webhook
receivers:
  - name: alertmend
    webhook_configs:
      - url: "https://<YOUR_MASTER_HOST>/api/webhooks/alertmanager/<WORKSPACE_TOKEN>"
        send_resolved: true`,
      },
    ],
  },
  {
    slug: 'health-policies',
    title: 'Health policies',
    description:
      'Kubernetes health policies in AlertMend for pods, nodes, PVCs, jobs, and deploys.',
    keywords:
      'AlertMend health policy, rule_types, availability, CrashLoopBackOff, workflow_pod',
    lead: 'Native Kubernetes condition rules that raise incidents without waiting on external alert rules.',
    blocks: [
      {
        type: 'p',
        text: 'Health policies watch cluster state continuously via the connected agent. They surface as cards and incidents with drill-down into pod and node evidence, then feed the same RCA and RF paths as webhook alerts.',
      },
      {
        type: 'h2',
        id: 'rule-types',
        text: 'rule_types',
      },
      {
        type: 'table',
        headers: ['rule_type', 'Watches', 'Example failure modes'],
        rows: [
          ['availability', 'Workload readiness / restarts', 'CrashLoopBackOff, OOMKilled restart storms'],
          ['deploy', 'Rollouts', 'Stuck Progressing, unavailable replicas'],
          ['job', 'Batch Jobs / CronJobs', 'BackoffLimitExceeded, failed jobs'],
          ['node', 'Node conditions', 'NotReady, DiskPressure, MemoryPressure'],
          ['pvc', 'PersistentVolumeClaims', 'Pending binds, filesystem full signals'],
          ['workflow_pod', 'Workflow / pipeline pods', 'Argo/Tekton-style pod failures (tenant-dependent)'],
        ],
      },
      {
        type: 'h2',
        id: 'ops',
        text: 'Operate policies',
      },
      {
        type: 'ul',
        items: [
          'Toggle severity and enabled state operationally',
          'Scope per cluster / agent',
          'Open resulting noise in /alerts-feed and correlated /incidents',
          'Attach RF via system_webhook or explicit bindings',
        ],
      },
      {
        type: 'h2',
        id: 'investigate',
        text: 'Investigate a hit',
      },
      {
        type: 'ol',
        items: [
          'Open the health policy card or /alerts-feed entry.',
          'Drill into pod yaml, events, and logs (RCA evidence tools).',
          'Run /rca for a cited root cause.',
          'Execute a runbook or RF (for example restart + verify) behind approval.',
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'Why use health policies',
        body: 'They catch Kubernetes failure modes that never got an Alertmanager rule. Pair with webhook alerts for app SLOs; use health policies for cluster day-2 truth.',
      },
    ],
  },
  {
    slug: 'on-call',
    title: 'On-call & escalations',
    description:
      'AlertMend on-call schedules, escalation paths, and chat-native paging with RCA attached.',
    keywords: 'AlertMend on-call, escalation-paths, schedules, Slack paging',
    lead: 'Timezone-aware rotations and escalation chains that page with context, not just a title.',
    blocks: [
      {
        type: 'h2',
        id: 'routes',
        text: 'UI routes',
      },
      {
        type: 'table',
        headers: ['Surface', 'Route'],
        rows: [
          ['Who is on-call now', '/on-call'],
          ['Schedules / rotations', '/schedules'],
          ['Escalation paths', '/escalation-paths'],
          ['Incidents', '/incidents'],
          ['Alerts feed', '/alerts-feed'],
        ],
      },
      {
        type: 'h2',
        id: 'building',
        text: 'Build an on-call setup',
      },
      {
        type: 'ol',
        items: [
          'Create users in /users and confirm notification contacts.',
          'Define a schedule in /schedules (follow-the-sun, weekly, overrides).',
          'Create an escalation path in /escalation-paths with wait timers and backup steps.',
          'Bind the path to alert routes, health policies, or RF notification steps.',
          'Page via Slack, Teams webhook, email (SendGrid), PagerDuty, or other shipped integrations.',
        ],
      },
      {
        type: 'h2',
        id: 'page',
        text: 'What a good page includes',
      },
      {
        type: 'ul',
        items: [
          'Alert title, severity, and service',
          'Link to /incidents and /rca when investigation started',
          'Optional ready runbook or RF approve buttons when Slack / Teams approval is configured',
          'Acknowledge from chat when policies allow',
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'Chat-native loop',
        body: 'Combine escalation paths with RF action type approval so the same human who got paged can approve the fix without opening a second tool, then audit lands in /system-audit.',
      },
      {
        type: 'h2',
        id: 'monitors',
        text: 'API / URL monitors',
      },
      {
        type: 'p',
        text: 'Where enabled, API monitors for URL and endpoint checks feed the same alert and escalation machinery. Treat them like any other ingress into /alerts-feed.',
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // AI RCA
  // ---------------------------------------------------------------------------
  {
    slug: 'ai-rca',
    title: 'Run AI root cause analysis',
    description:
      'How to run AlertMend AI RCA: correlate traces, logs, metrics, and Kubernetes events into a cited root cause.',
    keywords: 'AlertMend AI RCA, how to use RCA, root cause analysis, evidence citations, /rca',
    lead: 'Open /rca from an alert or incident. Typical cases land near about 15 seconds; every report cites evidence.',
    blocks: [
      {
        type: 'p',
        text: 'Use AI RCA when you need a cited root-cause narrative with confidence scoring and a next step (runbook, RF, or PR Fix). Start at /rca.',
      },
      {
        type: 'h2',
        id: 'loop',
        text: 'How an investigation runs',
      },
      {
        type: 'ol',
        items: [
          'Correlate the alert to service, cluster, time window, and related incident.',
          'Gather evidence with tools: pod yaml/events/logs, eBPF traces, OTel traces, CPU profile, metrics, and recent deploys.',
          'Build one evidence ledger keyed by service, trace id, and time.',
          'Call the configured LLM provider (default or BYOM).',
          'Write root cause, confidence, and suggested remediation.',
          'Offer PR Fix, run an approved runbook/RF, or post to Slack / Teams.',
        ],
      },
      {
        type: 'h2',
        id: 'evidence',
        text: 'Evidence tools',
      },
      {
        type: 'table',
        headers: ['Tool / signal', 'Why it matters'],
        rows: [
          ['Pod YAML', 'Misconfig, probes, resource limits'],
          ['Kubernetes events', 'OOMKilled, FailedScheduling, backoff'],
          ['Pod / app logs', 'Exception text and error bursts (via logs agent)'],
          ['OTel traces', 'Slow spans and error hops (/apm-analysis)'],
          ['eBPF traces', 'L7 / DB wire truth without SDKs'],
          ['CPU profile', 'Hot stacks (/cpu-profiling)'],
          ['Metrics', 'RED / saturation from Victoria Metrics'],
          ['Change / deploy intel', 'Correlate regressions to rollouts'],
        ],
      },
      {
        type: 'h2',
        id: 'outputs',
        text: 'Outputs',
      },
      {
        type: 'ul',
        items: [
          'Root-cause narrative with citations back to evidence',
          'Confidence score',
          'Suggested remediation steps',
          'Optional GitHub PR Fix',
          'Optional RF / runbook launch behind approval',
          'Optional post to Slack (SLACK, SLACK-AI-BOT) or Teams webhook',
        ],
      },
      {
        type: 'callout',
        tone: 'warn',
        title: 'Suggest, approve, execute',
        body: 'Remediation is gated by policy. RCA suggests; RF approval actions decide; the agent executes. Default posture is audited automation, not blind auto-heal.',
      },
      {
        type: 'h2',
        id: 'byom',
        text: 'Model providers',
      },
      {
        type: 'p',
        text: 'Configure BYOM with rca_llm / RCA_LLM_PROVIDER: azure_openai | ollama | anthropic_foundry. See Bring your own model.',
      },
    ],
  },
  {
    slug: 'byom',
    title: 'Bring your own model',
    description:
      'Configure AlertMend RCA to use Azure OpenAI, Anthropic Foundry, or local Ollama for regulated and air-gapped environments.',
    keywords:
      'AlertMend BYOM, Ollama, Azure OpenAI, Anthropic Foundry, rca_llm, RCA_LLM_PROVIDER',
    lead: 'Point RCA inference at the model endpoint your security team already trusts.',
    blocks: [
      {
        type: 'p',
        text: 'AlertMend RCA supports multiple LLM providers through control-plane configuration. Telemetry stays in your metrics, traces, and logs stores; only prompts and tool summaries go to the model endpoint you configure.',
      },
      {
        type: 'h2',
        id: 'providers',
        text: 'Supported providers',
      },
      {
        type: 'table',
        headers: ['Provider value', 'Typical use'],
        rows: [
          ['azure_openai', 'Enterprise default on Azure; private endpoint friendly'],
          ['ollama', 'Local or air-gapped inference'],
          ['anthropic_foundry', 'Anthropic models via Foundry-style hosting'],
        ],
      },
      {
        type: 'h2',
        id: 'config',
        text: 'Configuration keys',
      },
      {
        type: 'p',
        text: 'Exact keys live in server config under rca_llm (and environment equivalents such as RCA_LLM_PROVIDER). Prefer secrets management over committing credentials to git.',
      },
      {
        type: 'code',
        lang: 'yaml',
        code: `# Shape only. Match field names to your control-plane version.
rca_llm:
  provider: azure_openai   # azure_openai | ollama | anthropic_foundry
  endpoint: "https://<your-endpoint>"
  api_key: "<from-secret>"
  model: "<deployment-or-model-name>"`,
      },
      {
        type: 'code',
        lang: 'bash',
        code: `# Environment-style override used by some deployments
export RCA_LLM_PROVIDER=ollama
# plus provider-specific endpoint / model env vars from your ops packet`,
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'Data residency',
        body: 'With ollama or a private azure_openai / anthropic_foundry endpoint, inference stays in your boundary. Source telemetry still follows your metrics, traces, and logs placement.',
      },
      {
        type: 'h2',
        id: 'verify',
        text: 'Verify',
      },
      {
        type: 'ol',
        items: [
          'Set provider and credentials on the control plane; restart server workers if required.',
          'Open /rca on a known incident and confirm the report completes.',
          'Check server logs for provider errors (auth, quota, model not found).',
          'Confirm /system-audit still records downstream approvals and RF runs (BYOM does not bypass governance).',
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // Automation
  // ---------------------------------------------------------------------------
  {
    slug: 'remediation-flows',
    title: 'Build a Remediation Flow',
    description:
      'How to build and run AlertMend Remediation Flows: visual DAGs with triggers, actions, approvals, and audit.',
    keywords:
      'AlertMend RF, how to build remediation flow, alert_manager, command_execution, /rf',
    lead: 'Author a visual automation from alert to fix: triggers, branches, approvals, Kubernetes actions, verify.',
    blocks: [
      {
        type: 'p',
        text: 'Build a Remediation Flow as a DAG of typed actions with dependencies in /rf. Prefer runbooks (/rf/runbooks) when you want linear steps that compile to RF.',
      },
      {
        type: 'h2',
        id: 'triggers',
        text: 'Choose a trigger type',
      },
      {
        type: 'table',
        headers: ['trigger', 'Starts when'],
        rows: [
          ['alert_manager', 'Prometheus Alertmanager webhook matches'],
          ['custom_webhook', 'Your system posts to a custom webhook'],
          ['datadog_webhook', 'Datadog monitor webhook matches'],
          ['cron', 'Schedule fires'],
          ['system_webhook', 'Internal / health-policy / platform event'],
        ],
      },
      {
        type: 'h2',
        id: 'actions',
        text: 'Action types',
      },
      {
        type: 'table',
        headers: ['action', 'Role'],
        rows: [
          ['command_execution', 'Run a command / predefined action on agent targets'],
          ['approval', 'Pause for Slack, Teams webhook, or UI approve/reject'],
          ['metrics', 'Evaluate metrics / PromQL gate'],
          ['traces', 'Fetch or assert on trace / APM signals'],
          ['integration', 'Call a configured integration'],
          ['integration_message', 'Post a message/card to chat or ticket systems'],
          ['incident', 'Create or update an incident record'],
        ],
      },
      {
        type: 'h2',
        id: 'anatomy',
        text: 'Anatomy',
      },
      {
        type: 'ul',
        items: [
          'Triggers select when the flow starts',
          'Actions form a DAG via depends_on_actions',
          'Resource aliases / AT-QL resolve targets for command_execution',
          'Execution history with downloads and per-step status',
          'Audit of who approved and what ran (/system-audit)',
        ],
      },
      {
        type: 'h2',
        id: 'policy',
        text: 'Remediation policy (safety)',
      },
      {
        type: 'callout',
        tone: 'warn',
        title: 'Destructive patterns blocked',
        body: 'Remediation policy blocks commands such as kubectl delete, helm uninstall, rm -rf, and similar destructive shells unless explicitly allowed by policy. Prefer scale, restart, patch, and verify patterns.',
      },
      {
        type: 'h2',
        id: 'ui',
        text: 'Where to work',
      },
      {
        type: 'table',
        headers: ['Task', 'Route'],
        rows: [
          ['RF list / editor', '/rf'],
          ['Runbooks (compile to RF)', '/rf/runbooks'],
          ['Commands library', '/commands'],
          ['Agents / targets', '/agents'],
          ['Approvals queue', 'Dashboard waiting-for-approval + Slack/Teams'],
        ],
      },
      {
        type: 'h2',
        id: 'example',
        text: 'Example path',
      },
      {
        type: 'ol',
        items: [
          'Trigger: alert_manager on sev>=2 for payments.',
          'Action: incident create/update.',
          'Action: optional traces/metrics gather.',
          'Action: approval in Slack.',
          'Action: command_execution (scale / restart).',
          'Action: metrics verify window.',
          'Action: integration_message summary to #oncall.',
        ],
      },
    ],
  },
  {
    slug: 'runbooks',
    title: 'Runbooks',
    description:
      'AlertMend runbooks: linear steps that compile to Remediation Flows, with library sharing and safe targeting.',
    keywords: 'AlertMend runbooks, compile to RF, playbook library, /rf/runbooks',
    lead: 'Write the steps in order. AlertMend compiles them into an RF the engine already understands.',
    blocks: [
      {
        type: 'p',
        text: 'Runbooks are the linear authoring path for common incident fixes. Under the hood they compile to a Remediation Flow so triggers, approvals, execution history, and audit stay consistent.',
      },
      {
        type: 'h2',
        id: 'ui',
        text: 'UI',
      },
      {
        type: 'ul',
        items: [
          'Author and browse: /rf/runbooks',
          'Compiled / power-user graph: /rf',
          'Shared commands used by steps: /commands',
        ],
      },
      {
        type: 'h2',
        id: 'author',
        text: 'Authoring loop',
      },
      {
        type: 'ol',
        items: [
          'Create a runbook with a clear name (for example restart-crashlooping-payments).',
          'Add ordered steps: gather, approval, command_execution, metrics verify, notify.',
          'Bind targets via resource aliases / AT-QL (keep namespace + labels tight).',
          'Compile / save to RF and attach a trigger (alert_manager, datadog_webhook, cron, …).',
          'Dry-run in a non-prod cluster, then enable for production with approval required.',
        ],
      },
      {
        type: 'h2',
        id: 'safety',
        text: 'Safety rails',
      },
      {
        type: 'ul',
        items: [
          'Same remediation policy as RF (blocks kubectl delete, helm uninstall, rm -rf, etc.)',
          'Approval steps before mutating command_execution',
          'Max targets / canary style limits where configured',
          'Verify step after mutate; keep rollback armed when available',
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'When to edit the RF graph',
        body: 'Stay in runbooks for linear fixes. Switch to the RF editor when you need branches, fan-out, or complex depends_on_actions.',
      },
      {
        type: 'h2',
        id: 'library',
        text: 'Library and playbooks',
      },
      {
        type: 'p',
        text: 'Use the playbook catalog for seeded day-2 templates, then clone into your workspace library so teams share the same restart, scale, and verify patterns.',
      },
    ],
  },
  {
    slug: 'approvals',
    title: 'Approvals',
    description:
      'Human approval gates for AlertMend Remediation Flows via Slack, Teams webhook, and the UI.',
    keywords: 'AlertMend approval, Slack approve, remediation gate, action approval',
    lead: 'Nothing risky continues until the right human says yes.',
    blocks: [
      {
        type: 'p',
        text: 'Add an action with type approval in an RF or runbook. When the flow reaches that step, AlertMend notifies the configured channel or UI and waits before later command_execution steps run.',
      },
      {
        type: 'h2',
        id: 'channels',
        text: 'Approval channels',
      },
      {
        type: 'table',
        headers: ['Channel', 'How'],
        rows: [
          ['Slack', 'SLACK / Slack app: approve or reject from the message (see Slack app for approval)'],
          ['Microsoft Teams', 'TEAMS_WEBHOOK Adaptive Cards / notify path (MSTEAMS OAuth may be disabled)'],
          ['UI', 'Dashboard waiting-for-approval queue'],
        ],
      },
      {
        type: 'h2',
        id: 'flow',
        text: 'Runtime behavior',
      },
      {
        type: 'ol',
        items: [
          'RF hits an approval action.',
          'integration_message / Slack or Teams notify posts the card with context (alert, RCA link, planned commands).',
          'On-call approves or rejects.',
          'On approve, depends_on_actions unlocks command_execution (and later verify).',
          'Decision is written to /system-audit with actor and timestamp.',
        ],
      },
      {
        type: 'callout',
        tone: 'warn',
        title: 'Do not skip in production',
        body: 'You can build RFs without approval actions. For production mutates, keep an approval gate. Remediation policy alone is not a substitute for human review of blast radius.',
      },
      {
        type: 'h2',
        id: 'setup',
        text: 'Setup docs',
      },
      {
        type: 'ul',
        items: [
          'Slack app for approval',
          'Slack token & channel',
          'MS Teams approval',
          'MS Teams incoming webhook',
          'MS Teams in RF',
        ],
      },
    ],
  },
  {
    slug: 'commands-aliases',
    title: 'Commands & resource aliases',
    description:
      'Reusable AlertMend commands and resource aliases with AT-QL targeting for remediation.',
    keywords: 'AlertMend commands, resource alias, AT-QL, command_execution',
    lead: 'Define the action once. Point it at dynamic targets with aliases and AT-QL.',
    blocks: [
      {
        type: 'p',
        text: 'Commands wrap shell and Kubernetes operations used by RF and runbook steps (action type command_execution). Resource aliases name a static or query-driven target set so the same command can run safely across environments.',
      },
      {
        type: 'h2',
        id: 'ui',
        text: 'UI',
      },
      {
        type: 'ul',
        items: [
          'Commands library: /commands',
          'Used from RF editor: /rf',
          'Targets resolved against connected agents: /agents',
        ],
      },
      {
        type: 'h2',
        id: 'commands',
        text: 'Commands',
      },
      {
        type: 'ul',
        items: [
          'Reusable units: restart deployment, scale replicas, patch resources, run a scripted check',
          'Large catalogs of predefined actions for Kubernetes and VM/cloud targets',
          'Subject to remediation policy (destructive patterns blocked)',
        ],
      },
      {
        type: 'h2',
        id: 'aliases',
        text: 'Resource aliases & AT-QL',
      },
      {
        type: 'p',
        text: 'Create aliases at /resources with the Basic filter builder or AT-QL. Full create flow and APIs: Create a resource alias. Language reference: AT-QL and AT-QL field reference.',
      },
      {
        type: 'table',
        headers: ['Concept', 'Meaning'],
        rows: [
          ['Resource alias', 'Named target set saved at /resources'],
          ['AT-QL', 'Query language over pods/nodes/VMs (not log SQL)'],
          ['RF targeting', 'Existing alias | Enter Resource Query | use from last action'],
          ['Runtime', 'find_resources_v1 modes: name, query, json, from last action'],
        ],
      },
      {
        type: 'code',
        lang: 'text',
        code: `type IN (pod) AND namespace = "payments" AND (crashlooping = true OR memory_pct > 90)`,
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'Start narrow',
        body: 'Scope aliases tightly (cluster + namespace + labels or AT-QL) before you attach them to production RFs. Pair every mutating command_execution with an approval action.',
      },
      {
        type: 'h2',
        id: 'policy',
        text: 'Policy reminders',
      },
      {
        type: 'ul',
        items: [
          'Blocked examples: kubectl delete, helm uninstall, rm -rf',
          'Prefer: kubectl rollout restart, kubectl scale, controlled patch apply',
          'Verify with metrics/traces actions after mutate',
        ],
      },
    ],
  },
  {
    slug: 'pr-fix',
    title: 'Open a PR Fix & verify',
    description:
      'How to open a GitHub PR Fix from AlertMend RCA and verify remediations after RF execution.',
    keywords: 'AlertMend PR Fix, how to use PR Fix, GitHub, verify fix, remediation',
    lead: 'Use PR Fix when you want review before merge. Use verify after you apply a live fix.',
    blocks: [
      {
        type: 'h2',
        id: 'pr',
        text: 'How to open a PR Fix',
      },
      {
        type: 'p',
        text: 'From an RCA at /rca, open a suggested pull request against the repo that owns the failing workload. Requires the GITHUB integration (token, OAuth, or GitHub App).',
      },
      {
        type: 'ol',
        items: [
          'Complete an RCA with a concrete config or manifest recommendation.',
          'Choose Generate PR / PR Fix.',
          'Review the diff in GitHub (limits, probes, pool size, etc.).',
          'Merge through your normal CODEOWNERS / CI path.',
          'Confirm rollout and watch /apm-analysis or /metrics-dashboard.',
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'When to prefer PR Fix',
        body: 'Use PR Fix for durable config changes. Use RF command_execution for immediate mitigation (restart/scale), then follow with a PR so the fix survives the next deploy.',
      },
      {
        type: 'h2',
        id: 'verify',
        text: 'Verify fix',
      },
      {
        type: 'p',
        text: 'After an RF runs, add metrics or traces actions to re-check RED or SLO signals over a verify window. If verification fails, keep rollback armed so the previous state can return.',
      },
      {
        type: 'table',
        headers: ['Step', 'Action type', 'Example'],
        rows: [
          ['Mitigate', 'command_execution', 'Scale pool 20 → 50 / restart deploy'],
          ['Gate', 'metrics', 'p99 < 300ms for 5m'],
          ['Optional', 'traces', 'Error spans cleared on checkout'],
          ['Notify', 'integration_message', 'Post success/fail to Slack'],
        ],
      },
      {
        type: 'h2',
        id: 'audit',
        text: 'Audit',
      },
      {
        type: 'p',
        text: 'PR links, approvals, command results, and verify outcomes should be attributable in /system-audit and the RF execution history.',
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // Integrations
  // ---------------------------------------------------------------------------
  {
    slug: 'integrations',
    title: 'Integrations overview',
    description:
      'AlertMend integrations catalog: Slack, Teams webhook, Datadog, Alertmanager, PagerDuty, Jira, GitHub, and more.',
    keywords:
      'AlertMend integrations, SLACK, DATADOG, PAGERDUTY, GITHUB, TEAMS_WEBHOOK',
    lead: 'Connect the tools you already run. Prefer shipped integrations over coming-soon placeholders.',
    blocks: [
      {
        type: 'h2',
        id: 'shipped',
        text: 'Shipped integrations',
      },
      {
        type: 'table',
        headers: ['Integration key', 'Typical use'],
        rows: [
          ['SLACK', 'Notifications, RCA delivery, RF approvals'],
          ['SLACK-AI-BOT', 'AI/RCA assistant style Slack bot flows'],
          ['TEAMS_WEBHOOK', 'Adaptive cards / notify without full OAuth'],
          ['PAGERDUTY', 'Incident sync / paging'],
          ['PROMETHEUS', 'Metrics store / alert ingress adjacency'],
          ['VICTORIAMETRICS', 'AlertMend Metrics store'],
          ['DATADOG', 'Monitor webhooks that trigger RF (datadog_webhook)'],
          ['JIRA', 'Tickets from RF integration actions'],
          ['SENDGRID', 'Email'],
          ['GOOGLEMEET', 'War-room / meeting links'],
          ['GITHUB', 'PR Fix'],
        ],
      },
      {
        type: 'h2',
        id: 'status',
        text: 'Disabled / coming soon',
      },
      {
        type: 'table',
        headers: ['Key', 'Status', 'Notes'],
        rows: [
          ['MSTEAMS', 'Disabled', 'Prefer TEAMS_WEBHOOK for notify and approval cards'],
          ['CLOUDWATCH', 'Coming soon', 'Use VM cloudwatch collector for metrics discovery today'],
          ['AZUREMONITOR', 'Coming soon', 'Track release notes for GA'],
          ['GRAFANA', 'Coming soon', 'Use PromQL in /metrics-dashboard meanwhile'],
        ],
      },
      {
        type: 'h2',
        id: 'rf',
        text: 'Using integrations inside RF',
      },
      {
        type: 'ul',
        items: [
          'action type integration: call the configured integration',
          'action type integration_message: post a message/card',
          'action type approval: wait on Slack / Teams webhook / UI',
          'Triggers: alert_manager, datadog_webhook, custom_webhook, cron, system_webhook',
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'Teams OAuth',
        body: 'Full Microsoft Teams OAuth messaging (MSTEAMS) may be disabled in the catalog. The incoming webhook path (TEAMS_WEBHOOK) is the reliable notify and approval-card route today.',
      },
      {
        type: 'h2',
        id: 'howto',
        text: 'How-to pages',
      },
      {
        type: 'ul',
        items: [
          'Slack app for approval',
          'Slack token & channel',
          'Slack RCA channel',
          'MS Teams approval',
          'MS Teams in RF',
          'MS Teams incoming webhook',
          'Datadog webhook',
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // Optimize & govern
  // ---------------------------------------------------------------------------
  {
    slug: 'finops-kubernetes',
    title: 'Kubernetes FinOps',
    description:
      'AlertMend Kubernetes cost optimization: requested vs used, right-sizing recommendations, YAML preview, and approvals.',
    keywords: 'AlertMend FinOps, Kubernetes cost, right-sizing, /cost-optimizations',
    lead: 'See spend by namespace and workload, then apply right-sizing behind approval.',
    blocks: [
      {
        type: 'p',
        text: 'Kubernetes FinOps uses metrics already flowing into Victoria Metrics (requested vs used CPU/memory) to recommend safer requests/limits. Work the queue at /cost-optimizations.',
      },
      {
        type: 'h2',
        id: 'ui',
        text: 'UI',
      },
      {
        type: 'table',
        headers: ['Task', 'Route'],
        rows: [
          ['Right-sizing queue', '/cost-optimizations'],
          ['Supporting metrics', '/metrics-dashboard'],
          ['Apply via RF / approval', '/rf'],
        ],
      },
      {
        type: 'h2',
        id: 'loop',
        text: 'Optimization loop',
      },
      {
        type: 'ol',
        items: [
          'Confirm metrics collectors are healthy (kubectl -n alertmend get pods).',
          'Open /cost-optimizations and filter by cluster / namespace.',
          'Inspect requested versus used and the recommendation.',
          'Preview YAML diff for requests/limits.',
          'Apply to cluster behind approval, or open a GitHub PR (PR Fix style) for GitOps.',
          'Watch /metrics-dashboard or /apm-analysis for regressions; roll back if needed.',
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'Safety',
        body: 'Treat right-sizing like any other mutate: approval action, narrow alias scope, verify after apply. Remediation policy still blocks destructive delete/uninstall patterns.',
      },
      {
        type: 'h2',
        id: 'inputs',
        text: 'What it needs',
      },
      {
        type: 'ul',
        items: [
          'Connected cluster agent with metrics collectors',
          'Enough historical usage in Victoria Metrics for stable recommendations',
          'Optional GITHUB integration if you prefer PR apply over live patch',
        ],
      },
    ],
  },
  {
    slug: 'finops-aws',
    title: 'AWS Cloud FinOps',
    description:
      'AlertMend AWS Cloud FinOps for EC2, ECS, RDS, ELB, and unused EIP style findings.',
    keywords: 'AlertMend AWS FinOps, EC2 cost, ECS cost, RDS, /cloud-cost-optimizations',
    lead: 'Cloud line items next to the same workspace that runs your Kubernetes ops.',
    blocks: [
      {
        type: 'p',
        text: 'AWS Cloud FinOps surfaces waste and right-sizing candidates for cloud resources beside your Kubernetes FinOps queue. Primary UI: /cloud-cost-optimizations.',
      },
      {
        type: 'h2',
        id: 'findings',
        text: 'Common finding areas',
      },
      {
        type: 'ul',
        items: [
          'EC2 underutilized or oversized instances',
          'ECS service sizing',
          'RDS capacity and idle patterns',
          'ELB / load balancer waste',
          'Unused EIP style cleanup candidates',
        ],
      },
      {
        type: 'h2',
        id: 'data',
        text: 'Data inputs',
      },
      {
        type: 'table',
        headers: ['Input', 'Status / path'],
        rows: [
          ['CloudWatch collector (--type cloudwatch)', 'Available via VM / host installer for metric discovery'],
          ['CLOUDWATCH integration key', 'Coming soon in the integrations catalog'],
          ['Recommendations → remediation', 'Where actions exist, feed approved RF command_execution'],
        ],
      },
      {
        type: 'h2',
        id: 'loop',
        text: 'Operate findings',
      },
      {
        type: 'ol',
        items: [
          'Install or connect AWS metric discovery (cloudwatch collector) for the accounts you care about.',
          'Open /cloud-cost-optimizations and triage by service and savings estimate.',
          'Validate blast radius with owners.',
          'Apply via approved automation when an action exists, or ticket via JIRA integration.',
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'Beside Kubernetes FinOps',
        body: 'Use /cost-optimizations for in-cluster requests/limits and /cloud-cost-optimizations for AWS account waste. Same workspace, same audit model.',
      },
    ],
  },
  {
    slug: 'rbac-audit',
    title: 'Users, RBAC & audit',
    description:
      'AlertMend users, role-based access, workspaces, and system audit trail.',
    keywords: 'AlertMend RBAC, system audit, workspace, SSO, /users, /system-audit',
    lead: 'Separate duties with roles. Keep an audit trail of approvals and admin actions.',
    blocks: [
      {
        type: 'h2',
        id: 'routes',
        text: 'UI routes',
      },
      {
        type: 'table',
        headers: ['Surface', 'Route'],
        rows: [
          ['Users and roles', '/users'],
          ['System audit', '/system-audit'],
          ['Security settings', '/security'],
          ['Agents (who can install/connect)', '/agents'],
        ],
      },
      {
        type: 'h2',
        id: 'model',
        text: 'Access model',
      },
      {
        type: 'ul',
        items: [
          'Workspaces are tenant boundaries: agents, RFs, incidents, and users are scoped',
          'Roles grant resource-scoped permissions (view vs mutate vs approve)',
          'Optional Google and Microsoft SSO on the control plane',
          'Super Admin for MSP and multi-tenant operations where enabled',
        ],
      },
      {
        type: 'h2',
        id: 'audit',
        text: 'What gets audited',
      },
      {
        type: 'table',
        headers: ['Event class', 'Examples'],
        rows: [
          ['Approvals', 'RF approval action accept/reject with actor and time'],
          ['Execution', 'command_execution results and verify outcomes'],
          ['Admin', 'User/role changes, integration credential updates'],
          ['Security', 'SSO linkage, sensitive setting changes at /security'],
        ],
      },
      {
        type: 'h2',
        id: 'practices',
        text: 'Recommended practices',
      },
      {
        type: 'ol',
        items: [
          'Separate who can edit RFs from who can approve production mutates.',
          'Require approval actions on any command_execution that changes prod.',
          'Rotate agent keys (global.key) when people leave or a values file leaks.',
          'Review /system-audit during incident retrospectives and access reviews.',
        ],
      },
      {
        type: 'callout',
        tone: 'warn',
        title: 'Remediation policy is not RBAC',
        body: 'Blocking kubectl delete / helm uninstall / rm -rf is a command policy. RBAC still decides which humans can create flows, approve steps, and manage users.',
      },
    ],
  },
  ...QUERY_DOCS,
]
