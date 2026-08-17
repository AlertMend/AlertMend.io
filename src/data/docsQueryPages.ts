import type { DocPage } from './docsPages'

/**
 * Deep query-language docs: AT-QL, log SQL, resource aliases.
 * Grounded in auto_remediation server/libs/atql + logs UI.
 */

export const QUERY_DOCS: DocPage[] = [
  {
    slug: 'atql',
    title: 'AT-QL (AlertMend Query Language)',
    description:
      'AT-QL selects Kubernetes pods, nodes, and VMs for resource aliases, runbooks, and Remediation Flows. Operators, fields, and examples.',
    keywords: 'AT-QL, AlertMend Query Language, resource query, type IN (pod), crashlooping',
    lead: 'Query language for selecting workloads. Used in resource aliases, runbook targets, and RF resource queries. Not used for log search.',
    blocks: [
      {
        type: 'callout',
        tone: 'info',
        title: 'AT-QL is not log SQL',
        body: 'Logs use SELECT … FROM logs in /logs. AT-QL selects inventory (pods, nodes, VMs) for automation targeting.',
      },
      {
        type: 'h2',
        id: 'where',
        text: 'Where you use it',
      },
      {
        type: 'table',
        headers: ['Surface', 'UI / API'],
        rows: [
          ['Resource aliases', '/resources · Basic builder or AT Query Language tab'],
          ['Runbooks', '/rf/runbooks · step target: <AT-QL> or alias: "name"'],
          ['Remediation Flows', '/rf · action “Enter Resource Query”'],
          ['Validate / autocomplete', 'POST /resource_alias/atql/validate · /autocomplete · /translate'],
        ],
      },
      {
        type: 'h2',
        id: 'grammar',
        text: 'Grammar',
      },
      {
        type: 'code',
        lang: 'text',
        code: `query     := orExpr (LIMIT number)?
orExpr    := andExpr (OR andExpr)*
andExpr   := notExpr (AND notExpr)*
notExpr   := NOT notExpr | primary
primary   := '(' orExpr ')' | predicate
predicate := field operator operand`,
      },
      {
        type: 'p',
        text: 'Precedence (low to high): OR, then AND, then NOT. Parentheses change grouping.',
      },
      {
        type: 'h2',
        id: 'operators',
        text: 'Operators by field type',
      },
      {
        type: 'table',
        headers: ['Type', 'Operators'],
        rows: [
          ['string', '=  !=  ~  IN  NOT_IN'],
          ['number', '=  !=  <  <=  >  >=  RANGE  NOT_IN_RANGE'],
          ['boolean', '='],
          ['date', '=  >=  BETWEEN'],
        ],
      },
      {
        type: 'ul',
        items: [
          '~ is regex match (legacy like)',
          'Strings use "..." or \'...\' with \\\" and \\\\ escapes',
          'Date >= accepts durations like 5d, 1h, -30m (within the last …)',
          'Optional trailing LIMIT <n>',
          'Dynamic labels: agent_labels[\'some-key\']',
        ],
      },
      {
        type: 'h2',
        id: 'examples',
        text: 'Examples',
      },
      {
        type: 'code',
        lang: 'text',
        code: `type IN (pod) AND namespace = "prod" AND (cpu_15m > 80 OR memory_pct > 90) AND NOT name ~ "canary"`,
      },
      {
        type: 'code',
        lang: 'text',
        code: `type = "pod" AND (oom_killed = 1 OR restarts_1h > 3)
type = "pod" AND status = "Running" AND cpu_throttle_pct > 25
type IN (pod) AND crashlooping = true
type IN (pod) AND unhealthy = true
type IN (pod) AND memory_pct_1h > 90
type IN (node) AND (disk_pressure = 1 OR disk_pct > 90) AND NOT unschedulable = 1`,
      },
      {
        type: 'h2',
        id: 'health',
        text: 'Derived health booleans',
      },
      {
        type: 'table',
        headers: ['Field', 'Meaning'],
        rows: [
          ['crashlooping', 'restarts_1h > 3'],
          ['throttled', 'cpu_throttle_pct > 25'],
          ['oom_risk', 'OOMKilled or memory_pct > 90'],
          ['unhealthy', 'Any of the above, or cpu > 90'],
        ],
      },
      {
        type: 'h2',
        id: 'windows',
        text: 'Metric time windows',
      },
      {
        type: 'p',
        text: 'Suffix a metric with _<digits><s|m|h|d|w>, for example cpu_15m or memory_pct_1h.',
      },
      {
        type: 'callout',
        tone: 'warn',
        title: 'OR / NOT and ATQL_ENGINE',
        body: 'Full OR / NOT / grouping resolve end-to-end when ATQL_ENGINE=v2 on the control plane. The UI can still validate queries in shadow/legacy modes.',
      },
      {
        type: 'h2',
        id: 'next',
        text: 'Next',
      },
      {
        type: 'ul',
        items: [
          'AT-QL field reference for the full field list',
          'Create a resource alias to save and reuse a query',
          'Query logs for SELECT … FROM logs (separate language)',
        ],
      },
    ],
  },
  {
    slug: 'atql-fields',
    title: 'AT-QL field reference',
    description:
      'Complete AT-QL fields for pods, nodes, metrics, health flags, and aliases used in AlertMend resource queries.',
    keywords: 'AT-QL fields, memory_pct, cpu_15m, crashlooping, disk_pressure, namespace',
    lead: 'Field catalog for writing AT-QL predicates. Prefer type IN (pod) or type IN (node) to scope metrics.',
    blocks: [
      {
        type: 'h2',
        id: 'meta',
        text: 'Metadata (common)',
      },
      {
        type: 'table',
        headers: ['Field', 'Notes'],
        rows: [
          ['name', 'Resource name'],
          ['type', 'pod | node | vm | custom_agent'],
          ['status', 'Running | Pending | Succeeded | Failed'],
          ['namespace', 'Kubernetes namespace'],
          ['node / node_name', 'Node hosting the pod'],
          ['cluster', 'Cluster / agent scope'],
          ['creation_timestamp', 'Created time'],
        ],
      },
      {
        type: 'h2',
        id: 'pod-extra',
        text: 'Pod extras',
      },
      {
        type: 'ul',
        items: [
          'container / container_name',
          'restart_count',
        ],
      },
      {
        type: 'h2',
        id: 'pod-metrics',
        text: 'Pod metrics',
      },
      {
        type: 'ul',
        items: [
          'cpu, memory_pct, cpu_request_pct, memory_request_pct, cpu_throttle_pct',
          'restarts_1h, oom_killed',
          'error_rate, req_rate, p95_latency',
          'volume_pct, volume_inode_pct',
          'ingress_error_rate, ingress_p95_latency, ingress_req_rate',
        ],
      },
      {
        type: 'h2',
        id: 'node-metrics',
        text: 'Node metrics (type IN (node))',
      },
      {
        type: 'ul',
        items: [
          'cpu, memory_pct, disk_pct, inode_pct',
          'disk_read_bps, disk_write_bps, net_rx_bps, net_tx_bps',
          'load1, load5, load15',
          'pod_count, pods_pct',
          'not_ready, unschedulable, disk_pressure, memory_pressure, pid_pressure',
        ],
      },
      {
        type: 'h2',
        id: 'aliases',
        text: 'Common aliases',
      },
      {
        type: 'table',
        headers: ['Alias', 'Resolves to'],
        rows: [
          ['memory / mem', 'memory_pct'],
          ['restarts', 'restarts_1h'],
          ['oom', 'oom_killed'],
          ['cpu_pct', 'cpu'],
          ['cordoned', 'unschedulable'],
        ],
      },
      {
        type: 'h2',
        id: 'chips',
        text: 'UI quick chips',
      },
      {
        type: 'code',
        lang: 'text',
        code: `type IN (pod)
unhealthy = true
crashlooping = true
cpu_15m > 80
memory_pct > 90`,
      },
      {
        type: 'p',
        text: 'Placeholder in the editor: type IN (pod) AND namespace = "prod"',
      },
    ],
  },
  {
    slug: 'resource-aliases',
    title: 'Create a resource alias',
    description:
      'Step-by-step: create AlertMend resource aliases with the basic filter builder or AT-QL, preview matches, and use them in RF and runbooks.',
    keywords: 'resource alias, /resources, AT-QL, find_resources, resource query filter',
    lead: 'Save a named query so Remediation Flows and runbooks can target the same pods or nodes every time.',
    blocks: [
      {
        type: 'h2',
        id: 'create',
        text: 'Create in the UI',
      },
      {
        type: 'ol',
        items: [
          'Open Automation → Resource Alias (/resources).',
          'Click Add Resource Alias.',
          'Name: letters, numbers, underscore only (min 2). Optional description.',
          'Build the query in Basic mode (field pickers) or switch to AT Query Language.',
          'In AT-QL mode you can describe the intent in plain English and click Generate, then edit the query.',
          'Preview matching resources (POST /resource_alias/resource_alias_pods).',
          'Save. The alias stores query_array and optional atql_query.',
        ],
      },
      {
        type: 'h2',
        id: 'basic',
        text: 'Basic filter builder',
      },
      {
        type: 'p',
        text: 'Basic mode builds the same underlying filters without writing AT-QL. Operators depend on field type:',
      },
      {
        type: 'ul',
        items: [
          'string: equal (in), Not Equal (nin); free text uses like',
          'integer: eq, not_eq, less_than_or_eq, greater_than_or_eq, range, not_in_range',
          'date: within_the_last, between (minutes / hours / days / weeks)',
        ],
      },
      {
        type: 'p',
        text: 'Master fields come from resource_alias_master_data (static catalog plus labels[…], agent_labels[…], cluster, and AT-QL metrics/health).',
      },
      {
        type: 'h2',
        id: 'atql-tab',
        text: 'AT Query Language tab',
      },
      {
        type: 'code',
        lang: 'text',
        code: `type IN (pod) AND namespace = "payments" AND (crashlooping = true OR memory_pct > 90)`,
      },
      {
        type: 'p',
        text: 'The editor shows Valid / error from POST /resource_alias/atql/validate. Autocomplete: POST /resource_alias/atql/autocomplete. NL translate: POST /resource_alias/atql/translate.',
      },
      {
        type: 'h2',
        id: 'use',
        text: 'Use the alias in automation',
      },
      {
        type: 'table',
        headers: ['Mode', 'How'],
        rows: [
          ['Existing alias', 'RF action → Use Existing Resource Alias'],
          ['Inline query', 'RF action → Enter Resource Query (AT-QL string)'],
          ['From last action', 'RF action → Use from last action'],
          ['Runbook', 'alias: "my_alias" or target: <AT-QL> or from_previous'],
        ],
      },
      {
        type: 'h2',
        id: 'runtime',
        text: 'Runtime resolve modes',
      },
      {
        type: 'p',
        text: 'find_resources_v1 supports: resource_alias_name, resource_alias_query, resource_alias_json, use_from_last_action.',
      },
      {
        type: 'h2',
        id: 'apis',
        text: 'APIs',
      },
      {
        type: 'table',
        headers: ['Method', 'Path'],
        rows: [
          ['POST', '/resource_alias/create_resource_alias'],
          ['GET', '/resource_alias/get_resource_alias'],
          ['PUT', '/resource_alias/update_resource_alias/:uuid'],
          ['DELETE', '/resource_alias/delete_resource_alias/:uuid'],
          ['POST', '/resource_alias/resource_alias_pods'],
          ['GET', '/resource_alias/resource_alias_master_data'],
          ['POST', '/resource_alias/query_json'],
          ['POST', '/resource_alias/query_string'],
          ['POST', '/resource_alias/atql/validate'],
          ['POST', '/resource_alias/atql/autocomplete'],
          ['POST', '/resource_alias/atql/translate'],
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'Start narrow',
        body: 'Always include type IN (pod) or type IN (node) and a namespace (or label) before attaching the alias to a production RF with approvals.',
      },
    ],
  },
  {
    slug: 'logs-query',
    title: 'Query logs (SQL and filters)',
    description:
      'How to query AlertMend logs in /logs: filter mode, SELECT … FROM logs SQL, K8s vs VM vs OTEL fields, and API.',
    keywords: 'AlertMend logs SQL, SELECT FROM logs, severity, kubernetes_pod_name, log explorer',
    lead: 'Log search is SQL-style on FROM logs. It is a different language from AT-QL.',
    blocks: [
      {
        type: 'callout',
        tone: 'info',
        title: 'UI',
        body: 'Open /logs. Toggle SQL mode (default) or simple filter mode. Time range is controlled in the UI, not inside the query text.',
      },
      {
        type: 'h2',
        id: 'rules',
        text: 'Server rules',
      },
      {
        type: 'ul',
        items: [
          'Only SELECT statements',
          'Must contain FROM logs',
          'No semicolons, no URLs in the query',
          'Default if empty: SELECT * FROM logs',
          'source=ingester runs full SQL via the log pipeline; source=otel_logs uses the OTEL log path with a restricted filter set',
        ],
      },
      {
        type: 'h2',
        id: 'filter',
        text: 'Filter mode',
      },
      {
        type: 'p',
        text: 'Write predicates joined with lowercase and. The UI builds SELECT _timestamp, severity, message FROM logs WHERE <filter>.',
      },
      {
        type: 'code',
        lang: 'text',
        code: `severity = 'ERROR'
kubernetes_namespace_name = 'prod' and severity = 'WARN'
kubernetes_pod_name = 'api-server' and message = 'timeout'`,
      },
      {
        type: 'h2',
        id: 'sql',
        text: 'SQL mode (ingester / K8s)',
      },
      {
        type: 'code',
        lang: 'sql',
        code: `SELECT * FROM logs
WHERE severity = 'ERROR'
ORDER BY _timestamp DESC`,
      },
      {
        type: 'code',
        lang: 'sql',
        code: `SELECT _timestamp, kubernetes_pod_name, message
FROM logs
WHERE kubernetes_namespace_name = 'production'`,
      },
      {
        type: 'code',
        lang: 'sql',
        code: `SELECT * FROM logs
WHERE kubernetes_pod_name = 'checkout-api-7d9f8'
  AND severity = 'WARN'`,
      },
      {
        type: 'h2',
        id: 'defaults',
        text: 'Default SELECT shapes',
      },
      {
        type: 'table',
        headers: ['Stream', 'Default SELECT'],
        rows: [
          ['K8s', 'SELECT _timestamp, kubernetes_namespace_name, kubernetes_pod_name, message FROM logs'],
          ['VM', 'SELECT _timestamp, severity, message FROM logs'],
          ['App / OTEL', 'SELECT _timestamp, service, severity, message FROM logs'],
        ],
      },
      {
        type: 'h2',
        id: 'vm',
        text: 'VM extras',
      },
      {
        type: 'code',
        lang: 'sql',
        code: `SELECT * FROM logs
WHERE message LIKE '%timeout%'
   OR filename LIKE '%d0ca62b91ad5%'`,
      },
      {
        type: 'h2',
        id: 'otel',
        text: 'OTEL logs (restricted)',
      },
      {
        type: 'p',
        text: 'Looks like SQL, but only a subset of WHERE is honored. Supported filters: service, trace_id, message LIKE, filename LIKE. Column math, GROUP BY, and arbitrary WHERE are not executed.',
      },
      {
        type: 'code',
        lang: 'sql',
        code: `SELECT _timestamp, severity, message
FROM logs
WHERE service = 'checkout-api'`,
      },
      {
        type: 'h2',
        id: 'fields',
        text: 'Ingester fields (common)',
      },
      {
        type: 'p',
        text: '_timestamp, _log_id, severity, log_level, message, stream, host, host_id, service_name, source_path, filename, kubernetes_namespace_name, kubernetes_pod_name, kubernetes_pod_id, kubernetes_container_name, kubernetes_container_image, kubernetes_host, kubernetes_workload_name, kubernetes_workload_kind, trace_id, span_id, scope_name, agent_id, plus per-stream schema fields.',
      },
      {
        type: 'h2',
        id: 'otel-fields',
        text: 'OTEL fixed schema',
      },
      {
        type: 'p',
        text: '_timestamp, severity, message, service, namespace, trace_id, span_id, filename',
      },
      {
        type: 'h2',
        id: 'api',
        text: 'APIs',
      },
      {
        type: 'ul',
        items: [
          'GET /logs/streams',
          'GET /logs/streams/:agent_id/fields',
          'POST /logs/search (sql, agent_id, source, time range)',
          'POST /logs/download',
        ],
      },
    ],
  },
  {
    slug: 'runbook-as-code',
    title: 'Runbook-as-Code',
    description:
      'Author AlertMend runbooks as text: steps, AT-QL targets, aliases, on_fail, canary, and compile-to-RF behavior.',
    keywords: 'runbook DSL, runbook-as-code, target AT-QL, on_fail, canary',
    lead: 'Linear runbooks you can write as text. They compile to Remediation Flows under the hood.',
    blocks: [
      {
        type: 'h2',
        id: 'example',
        text: 'Example',
      },
      {
        type: 'code',
        lang: 'text',
        code: `runbook "restart_hot_pods"
on_fail: stop

step restart [command]
  target: type IN (pod) AND namespace = "prod" AND cpu_15m > 80
  canary: 1
  script:
    #!/bin/bash
    kubectl rollout restart deploy/$NAME
  end`,
      },
      {
        type: 'h2',
        id: 'targets',
        text: 'Target forms',
      },
      {
        type: 'ul',
        items: [
          'target: <AT-QL>',
          'alias: "my_alias"',
          'from_previous',
          'from_previous only_successful',
        ],
      },
      {
        type: 'h2',
        id: 'pipe',
        text: 'Pipe shorthand',
      },
      {
        type: 'code',
        lang: 'text',
        code: `step cordon [command]
  type IN (node) AND disk_pressure = 1 | run:
    #!/bin/bash
    echo "cordon $NODE_NAME"
  end`,
      },
      {
        type: 'h2',
        id: 'params',
        text: 'Parameters in AT-QL',
      },
      {
        type: 'p',
        text: 'Runbooks can interpolate params, for example namespace = "${RF.namespace}".',
      },
      {
        type: 'h2',
        id: 'vs-rf',
        text: 'Runbook vs RF',
      },
      {
        type: 'table',
        headers: ['', 'Runbook', 'Remediation Flow'],
        rows: [
          ['Structure', 'Ordered list', 'DAG with depends_on_actions'],
          ['Branching', 'on_fail: stop | continue | approve', 'Condition branches'],
          ['Authoring', 'Anyone / library / LLM', 'Expert visual editor'],
          ['Execution', 'Compiles to linear RF', 'Native RF engine'],
        ],
      },
      {
        type: 'p',
        text: 'UI: /rf/runbooks. Step types align with RF: command_execution, integration_message, approval, metrics, traces, incident.',
      },
    ],
  },
]
