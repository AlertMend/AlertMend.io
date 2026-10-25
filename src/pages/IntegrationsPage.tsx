import { useCallback, useEffect, useMemo, useRef, useState, type MouseEvent, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ArrowDown,
  Search,
  CheckCircle2,
  Plus,
  X,
  SlidersHorizontal,
  ExternalLink,
} from 'lucide-react'
import SEO from '../components/SEO'
import BrandLogo from '../components/ui/BrandLogo'
import AlertMendIcon from '../components/ui/AlertMendIcon'
import ConnectionSpec, { FlowBadge, FlowIcon } from '../components/integrations/ConnectionSpec'
import { CtaBand } from '../components/enterprise/PageKit'
import ent from '../components/enterprise/Enterprise.module.css'
import {
  integrations,
  integrationLayers,
  integrationCategories,
  connectionMethods,
  dataFlows,
  dataFlowOrder,
  categoriesOf,
  findConnectionMethod,
  findIntegrationBySlug,
  layerOf,
  setupStepsFor,
  type ConnectionMethodId,
  type DataFlow,
  type Integration,
  type IntegrationCategory,
  type IntegrationLayer,
} from '../data/integrations'
import { HOME_PRODUCTS, type HomeProductId } from '../data/homeProducts'
import { calendlyUrl } from '../lib/calendly'
import styles from './IntegrationsPage.module.css'

/**
 * /integrations — directory for every integration in src/data/integrations.ts.
 *
 * Modelled on the catalogs buyers already know (Datadog, Segment, Airbyte):
 *   1. Hero with counts by data flow.
 *   2. The three integration types (read access, event stream, notifications &
 *      actions) explained, each with a one-click filter.
 *   3. Directory: facet sidebar (integration type, functionality, connection method),
 *      search, tiles that open a details panel (how it connects, setup, overview).
 *   4. Connection methods in detail, coverage, data handling, FAQ.
 * Every count is computed from the catalog so the page cannot contradict itself.
 * Tiles are real links to /integrations/<slug>, so crawlers and new-tab clicks
 * still reach the full page; a plain click opens the panel instead.
 */

const DEMO_URL = calendlyUrl('integrations-page')
const SIGNUP_URL = 'https://app.alertmend.io/signup'
const REQUEST_EMAIL = 'hello@alertmend.io'

const requestHref = (name?: string) =>
  `mailto:${REQUEST_EMAIL}?subject=${encodeURIComponent(
    name ? `Integration request: ${name}` : 'Integration request',
  )}`

/** Functionality scope: a whole group (data stack / infra / response) or one category. */
type Scope = { kind: 'all' } | { kind: 'layer'; id: IntegrationLayer } | { kind: 'category'; id: IntegrationCategory }

type Filters = {
  query: string
  scope: Scope
  flows: DataFlow[]
  methods: ConnectionMethodId[]
}

const EMPTY: Filters = { query: '', scope: { kind: 'all' }, flows: [], methods: [] }

function inScope(i: Integration, scope: Scope) {
  if (scope.kind === 'all') return true
  if (scope.kind === 'layer') return categoriesOf(i).some((c) => layerOf(c) === scope.id)
  return categoriesOf(i).includes(scope.id)
}

function matchesQuery(i: Integration, query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return true
  const method = findConnectionMethod(i.connection)
  return [
    i.name,
    i.slug,
    ...categoriesOf(i),
    i.tagline,
    i.auth,
    i.transport,
    method.name,
    ...i.dataFlow.map((f) => dataFlows[f].label),
  ]
    .join(' ')
    .toLowerCase()
    .includes(q)
}

/** Apply every filter except the ones named in `skip`, so facet counts show what
 *  you would get by picking that option (standard faceted search). */
function applyFilters(f: Filters, skip: Partial<Record<'scope' | 'flows' | 'methods', true>> = {}) {
  return integrations.filter(
    (i) =>
      matchesQuery(i, f.query) &&
      (skip.scope || inScope(i, f.scope)) &&
      (skip.flows || f.flows.length === 0 || f.flows.some((fl) => i.dataFlow.includes(fl))) &&
      (skip.methods || f.methods.length === 0 || f.methods.includes(i.connection)),
  )
}


/* ---------- Coverage matrix ---------- */

const PRODUCT_SHORT: Record<HomeProductId, string> = {
  dataobs: 'Data observability',
  k8s: 'Kubernetes',
  obs: 'APM',
  logs: 'Logs',
  rca: 'AI RCA',
  fix: 'Remediation',
  oncall: 'On-call',
  finops: 'FinOps',
  mlops: 'GPU & MLOps',
}
const MATRIX_PRODUCTS: HomeProductId[] = ['dataobs', 'k8s', 'obs', 'logs', 'rca', 'fix', 'oncall', 'finops', 'mlops']
const productById = Object.fromEntries(HOME_PRODUCTS.map((p) => [p.id, p])) as Record<
  HomeProductId,
  (typeof HOME_PRODUCTS)[number]
>

/* ---------- Data handling ---------- */

const HANDLING = [
  {
    title: 'Read when connected',
    tone: 'read' as const,
    items: [
      'Warehouse metadata from INFORMATION_SCHEMA, and the aggregate results of your checks: row counts, null rates, latest timestamps, custom SQL',
      'Pipeline and BI run status, errors, owners and table-to-report lineage',
      'Kubernetes object state, events, workload YAML, pod logs and metrics',
      'The alerts, metrics, logs and traces you route to AlertMend',
    ],
  },
  {
    title: 'Only when you turn it on',
    tone: 'optin' as const,
    items: [
      'Row samples for column profiling',
      'Writing check results back to a table in your warehouse',
      'Runbook actions such as restart, scale, roll back, right-size or run a command',
      'Pull requests and tickets opened from a root cause',
    ],
  },
  {
    title: 'Guardrails on every connection',
    tone: 'guard' as const,
    items: [
      'Warehouse checks must be a single SELECT or WITH statement; anything else is rejected',
      'Warehouse queries time out after 120 seconds by default, and every query is logged',
      'Agents connect outbound over TLS; the Kubernetes agent needs no inbound ports',
      'Remediation recommends by default, waits for approval and re-checks health afterwards',
      'Roles decide who can view, propose, approve and execute; every step is audited',
      'Bring your own model: AI analysis can run on a model you host',
    ],
  },
]

const DEPLOYMENT = [
  { title: 'SaaS', body: 'The default. Connect sources and start in minutes.' },
  { title: 'Agent in your network', body: 'Private warehouses and clusters connect outbound through an AlertMend agent.' },
  { title: 'Hybrid', body: 'AlertMend runs the control plane; the data plane stays in your cloud account.' },
  { title: 'On-prem and air-gapped', body: 'The whole platform inside your boundary, with your own model. Enterprise.' },
]

const FAQS = [
  {
    q: 'How does data move between our tools and AlertMend?',
    a: 'In one or more of three ways, and every integration lists which. With read access, AlertMend connects using read-only credentials you create, for example running checks on Snowflake or reading task runs from Airflow. With an event stream, your tool or an AlertMend agent sends alerts, run results or telemetry as they happen, for example an Alertmanager webhook or the Kubernetes agent. With notifications and actions, AlertMend sends root causes, approval requests, tickets or pull requests to tools such as Slack, Jira or GitHub.',
  },
  {
    q: 'Do we have to open inbound ports?',
    a: 'No. Event streams and agents connect outbound from your environment over TLS, and read access to private systems runs through an AlertMend agent inside your network, which also connects outbound. The one exception is agentless VM monitoring over SSH; use the host agent if you prefer not to allow it.',
  },
  {
    q: 'Do we have to replace Datadog, Prometheus or our current data quality tool?',
    a: 'No. AlertMend sits on top of the tools you run. It ingests their alerts and adds root cause analysis, impact and approved remediation. If AlertMend is unavailable, your existing alerting path keeps working.',
  },
  {
    q: 'Does AlertMend write to our warehouse?',
    a: 'Not when it runs checks. Every check query must be a single SELECT or WITH statement and is time-capped and logged. Writing results back to your warehouse is a separate export you switch on.',
  },
  {
    q: 'Can AlertMend change things in our cluster or cloud?',
    a: 'Only through remediation flows you build. They start in recommend mode, wait for approval in Slack, Teams, email or the product, record every step and re-check health after a fix.',
  },
  {
    q: 'What if our tool is not listed?',
    a: 'Any tool that can post JSON can send events to AlertMend through your workspace webhook, and runbooks can call any REST API. Tell us what you use and we will prioritise a native integration.',
  },
  {
    q: 'Do integrations cost extra?',
    a: 'No. Every plan, including the free Playground, includes unlimited integrations.',
  },
]

/* ---------- Page ---------- */

export default function IntegrationsPage() {
  const [filters, setFilters] = useState<Filters>(EMPTY)
  const [selected, setSelected] = useState<Integration | null>(null)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const lastTile = useRef<HTMLElement | null>(null)

  const update = (patch: Partial<Filters>) => setFilters((f) => ({ ...f, ...patch }))
  const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v])

  /* Deep links, applied after hydration so the prerendered HTML shows the full directory:
     ?for=data|infra|response · ?category=<name> · ?mode=read|stream|notify · ?integration=<slug> */
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const next: Filters = { ...EMPTY }
      const forParam = params.get('for')?.toLowerCase()
      if (forParam === 'data' || forParam === 'data-observability') next.scope = { kind: 'layer', id: 'data' }
      else if (forParam === 'infra' || forParam === 'platform' || forParam === 'sre') next.scope = { kind: 'layer', id: 'infra' }
      else if (forParam === 'response') next.scope = { kind: 'layer', id: 'response' }
      const cat = integrationCategories.find((c) => c.toLowerCase() === params.get('category')?.toLowerCase())
      if (cat) next.scope = { kind: 'category', id: cat }
      const flows = (params.get('mode') ?? '').split(',').filter((f): f is DataFlow => f in dataFlows)
      if (flows.length) next.flows = flows
      const methods = (params.get('method') ?? '')
        .split(',')
        .filter((m): m is ConnectionMethodId => connectionMethods.some((c) => c.id === m))
      if (methods.length) next.methods = methods
      setFilters(next)
      const slug = params.get('integration')
      const found = slug ? findIntegrationBySlug(slug) : undefined
      if (found) setSelected(found)
    } catch {
      /* ignore */
    }
  }, [])

  /* Mirror filters and the open panel into the URL so any view can be shared or linked
     from a sales page. history.replaceState (not the router) so the page does not re-scroll.
     Skipped until the deep-link effect above has run, so it cannot wipe incoming params. */
  const hydrated = useRef(false)
  useEffect(() => {
    if (!hydrated.current) {
      hydrated.current = true
      return
    }
    try {
      const url = new URL(window.location.href)
      for (const k of ['for', 'category', 'mode', 'method', 'integration']) url.searchParams.delete(k)
      if (filters.scope.kind === 'layer') url.searchParams.set('for', filters.scope.id)
      if (filters.scope.kind === 'category') url.searchParams.set('category', filters.scope.id)
      if (filters.flows.length) url.searchParams.set('mode', filters.flows.join(','))
      if (filters.methods.length) url.searchParams.set('method', filters.methods.join(','))
      if (selected) url.searchParams.set('integration', selected.slug)
      window.history.replaceState(window.history.state, '', url.toString())
    } catch {
      /* ignore */
    }
  }, [filters.scope, filters.flows, filters.methods, selected])

  const visible = useMemo(() => applyFilters(filters), [filters])
  const scopeCounts = useMemo(() => applyFilters(filters, { scope: true }), [filters])
  const flowCounts = useMemo(() => applyFilters(filters, { flows: true }), [filters])
  const methodCounts = useMemo(() => applyFilters(filters, { methods: true }), [filters])

  const activeCount =
    (filters.scope.kind === 'all' ? 0 : 1) + filters.flows.length + filters.methods.length + (filters.query ? 1 : 0)

  const scrollToDirectory = () =>
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  const showFlow = (flow: DataFlow) => {
    setFilters({ ...EMPTY, flows: [flow] })
    scrollToDirectory()
  }

  const openDetails = (e: MouseEvent<HTMLAnchorElement>, i: Integration) => {
    // Let modified clicks (new tab / window) follow the real link.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
    e.preventDefault()
    lastTile.current = e.currentTarget
    setSelected(i)
  }

  const closeDetails = useCallback(() => {
    setSelected(null)
    lastTile.current?.focus()
  }, [])

  /* Group by primary functionality when browsing everything; flat grid once a
     single functionality is picked (so multi-category tools appear once either way). */
  const grouped =
    filters.scope.kind === 'category'
      ? [{ cat: filters.scope.id, items: visible }]
      : integrationCategories
          .map((cat) => ({ cat, items: visible.filter((i) => i.category === cat) }))
          .filter((g) => g.items.length > 0)

  const scopeLabel =
    filters.scope.kind === 'all'
      ? null
      : filters.scope.kind === 'layer'
        ? integrationLayers.find((l) => l.id === (filters.scope as { id: IntegrationLayer }).id)?.label
        : filters.scope.id

  /* Filter facets: rendered in the desktop sidebar, and in a full-screen drawer on mobile. */
  const facets = (
    <>
        <div className={styles.facet}>
          <h3 className={styles.facetHead}>Integration type</h3>
          {dataFlowOrder.map((f) => {
            const n = flowCounts.filter((i) => i.dataFlow.includes(f)).length
            return (
              <label key={f} className={styles.check}>
                <input
                  type="checkbox"
                  checked={filters.flows.includes(f)}
                  onChange={() => update({ flows: toggle(filters.flows, f) })}
                />
                <span className={styles.checkFlow}>
                  <FlowIcon flow={f} />
                  {dataFlows[f].label}
                </span>
                <span className={styles.checkHint}>{dataFlows[f].title}</span>
                <span className={styles.count}>{n}</span>
              </label>
            )
          })}
          <a href="#how-it-works" className={styles.facetHelp} onClick={() => setFiltersOpen(false)}>
            What do these types mean?
          </a>
        </div>

        <div className={styles.facet}>
          <h3 className={styles.facetHead}>Functionality</h3>
          <ScopeButton
            label="All integrations"
            count={scopeCounts.length}
            active={filters.scope.kind === 'all'}
            onClick={() => update({ scope: { kind: 'all' } })}
          />
          {integrationLayers.map((l) => (
            <div key={l.id} className={styles.scopeGroup}>
              <ScopeButton
                label={l.label}
                strong
                count={scopeCounts.filter((i) => inScope(i, { kind: 'layer', id: l.id })).length}
                active={filters.scope.kind === 'layer' && filters.scope.id === l.id}
                onClick={() => update({ scope: { kind: 'layer', id: l.id } })}
              />
              {l.categories.map((c) => (
                <ScopeButton
                  key={c}
                  label={c}
                  indent
                  count={scopeCounts.filter((i) => categoriesOf(i).includes(c)).length}
                  active={filters.scope.kind === 'category' && filters.scope.id === c}
                  onClick={() => update({ scope: { kind: 'category', id: c } })}
                />
              ))}
            </div>
          ))}
        </div>

        <div className={styles.facet}>
          <h3 className={styles.facetHead}>Connection method</h3>
          {connectionMethods.map((m) => {
            const n = methodCounts.filter((i) => i.connection === m.id).length
            return (
              <label key={m.id} className={styles.check}>
                <input
                  type="checkbox"
                  checked={filters.methods.includes(m.id)}
                  onChange={() => update({ methods: toggle(filters.methods, m.id) })}
                />
                <span className={styles.checkLabel}>{m.name}</span>
                <span className={styles.count}>{n}</span>
              </label>
            )
          })}
        </div>
    </>
  )

  return (
    <>
      <SEO
        title="Integrations: Data Stack, Kubernetes, Cloud & Alerting | AlertMend"
        description={`Connect ${integrations.length} tools to AlertMend: Snowflake, Databricks, dbt, Airflow, Power BI, Kubernetes, AWS, Prometheus, Datadog, Slack, PagerDuty and more. Filter by category and integration type, and see exactly how each one connects.`}
        canonical="/integrations"
        keywords="AlertMend integrations, data observability integrations, Snowflake data quality, Databricks monitoring, dbt, Airflow, Fivetran, Power BI lineage, Tableau, Kubernetes monitoring, AWS, Prometheus, Alertmanager, Datadog, OpenTelemetry, Slack, Microsoft Teams, PagerDuty, Jira, GitHub"
        breadcrumbData={{ items: [{ label: 'Integrations' }] }}
        extraStructuredData={[
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'AlertMend integrations',
            numberOfItems: integrations.length,
            itemListElement: integrations.map((i, idx) => ({
              '@type': 'ListItem',
              position: idx + 1,
              name: i.name,
              url: `https://alertmend.io/integrations/${i.slug}`,
            })),
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQS.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          },
        ]}
      />

      {/* ---------- Hero ---------- */}
      <section className={styles.hero}>
        <div className={ent.wrap}>
          <span className={ent.eyebrow}>Integrations</span>
          <h1 className={styles.h1}>Connect your data stack and infrastructure. See exactly how.</h1>
          <p className={styles.heroLede}>
            {integrations.length} integrations across warehouses, pipelines, BI, Kubernetes, clouds, monitoring
            and the tools your team responds in. Each one documents the access it needs, how data moves, what
            AlertMend reads, and whether it can make changes.
          </p>
          <div className={ent.heroCtas}>
            <a href="#catalog" className={ent.btnPrimary}>
              Browse the directory <ArrowDown size={16} aria-hidden="true" />
            </a>
            <a href={requestHref()} className={ent.btnSecondary}>
              Request an integration
            </a>
          </div>

          <dl className={styles.stats}>
            {[
              { label: 'Integrations', value: String(integrations.length), hint: 'Across data, infrastructure and response' },
              { label: 'Categories', value: String(integrationCategories.length), hint: 'From warehouses to paging' },
              { label: 'Connection methods', value: String(connectionMethods.length), hint: 'Agents, read-only roles, webhooks, apps' },
              { label: 'Typical setup', value: 'Minutes', hint: 'Per source, with a documented scope' },
            ].map((st) => (
              <div key={st.label} className={styles.stat}>
                <dt>{st.label}</dt>
                <dd>
                  <span className={styles.statNum}>{st.value}</span>
                  <span className={styles.statHint}>{st.hint}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------- Integration types ---------- */}
      <section className={ent.sectionAlt} id="how-it-works">
        <div className={ent.wrap}>
          <div className={ent.head}>
            <div>
              <span className={ent.eyebrow}>How integrations work</span>
              <h2 className={ent.h2}>Three integration types, each with a defined scope.</h2>
            </div>
            <p className={ent.lede}>
              Every integration is one or more of these. Datadog, for example, sends its alerts to AlertMend as
              an event stream, and AlertMend reads its logs while it investigates.
            </p>
          </div>

          <div className={styles.flowCards}>
            {dataFlowOrder.map((f) => {
              const info = dataFlows[f]
              const users = integrations.filter((i) => i.dataFlow.includes(f))
              return (
                <div key={f} className={styles.flowCard}>
                  <div>
                    <FlowIcon flow={f} size={18} />
                    <h3 className={styles.flowCardTitle}>{info.label}</h3>
                    <p className={styles.flowCardSub}>{info.title}</p>
                  </div>
                  <FlowMini flow={f} />
                  <p className={styles.flowCardHint}>{info.hint}</p>
                  <dl className={styles.flowCardFacts}>
                    <div>
                      <dt>Who connects</dt>
                      <dd>{info.who}</dd>
                    </div>
                    <div>
                      <dt>When</dt>
                      <dd>{info.timing}</dd>
                    </div>
                    <div>
                      <dt>Access</dt>
                      <dd>{info.network}</dd>
                    </div>
                  </dl>
                  <div className={styles.flowCardUsers}>
                    {users.slice(0, 7).map((u) => (
                      <span key={u.slug} className={styles.flowCardLogo} title={u.name}>
                        <BrandLogo
                          src={u.logoSrc}
                          slug={u.iconSlug}
                          tint={u.logoTint}
                          domain={u.domain}
                          alt={u.name}
                          className={styles.flowCardLogoImg}
                        />
                      </span>
                    ))}
                  </div>
                  <button type="button" className={styles.flowCardBtn} onClick={() => showFlow(f)}>
                    View {users.length} integrations
                    <ArrowRight size={15} aria-hidden="true" />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ---------- Directory ---------- */}
      <section className={`${ent.section} ${styles.catalogSection}`} id="catalog">
        <div className={ent.wrap}>
          <div className={styles.dirHead}>
            <div>
              <span className={ent.eyebrow}>Directory</span>
              <h2 className={ent.h2}>Find your tool.</h2>
            </div>
            <label className={styles.search}>
              <Search size={17} aria-hidden="true" className={styles.searchIcon} />
              <span className={styles.srOnly}>Search integrations</span>
              <input
                type="search"
                value={filters.query}
                onChange={(e) => update({ query: e.target.value })}
                placeholder="Search Snowflake, Airflow, webhook, OAuth…"
                className={styles.searchInput}
              />
              {filters.query && (
                <button type="button" className={styles.searchClear} onClick={() => update({ query: '' })} aria-label="Clear search">
                  <X size={15} />
                </button>
              )}
            </label>
          </div>

          <div className={styles.dir}>
            {/* ----- Facets: sidebar on desktop, Filters button + drawer on mobile ----- */}
            <button
              type="button"
              className={styles.filtersToggle}
              aria-haspopup="dialog"
              onClick={() => setFiltersOpen(true)}
            >
              <SlidersHorizontal size={16} aria-hidden="true" />
              Filters{activeCount > 0 ? ` (${activeCount})` : ''}
            </button>

            <aside className={styles.sidebar} aria-label="Filter integrations">
              {facets}
            </aside>

            {/* ----- Results ----- */}
            <div className={styles.results}>
              <div className={styles.resultBar}>
                <span aria-live="polite">
                  Showing <strong>{visible.length}</strong> of {integrations.length}
                </span>
                {scopeLabel && (
                  <ActiveChip label={scopeLabel} onRemove={() => update({ scope: { kind: 'all' } })} />
                )}
                {filters.flows.map((f) => (
                  <ActiveChip key={f} label={dataFlows[f].label} onRemove={() => update({ flows: toggle(filters.flows, f) })} />
                ))}
                {filters.methods.map((m) => (
                  <ActiveChip
                    key={m}
                    label={findConnectionMethod(m).name}
                    onRemove={() => update({ methods: toggle(filters.methods, m) })}
                  />
                ))}
                {activeCount > 0 && (
                  <button type="button" className={styles.resetLink} onClick={() => setFilters(EMPTY)}>
                    Clear all
                  </button>
                )}
              </div>

              {visible.length === 0 ? (
                <div className={styles.empty}>
                  <h3>{filters.query ? `No integration matches “${filters.query}”.` : 'No integration matches these filters.'}</h3>
                  <p>
                    Any tool that can post JSON can send events to AlertMend through a webhook today, and
                    runbooks can call any REST API.
                  </p>
                  <div className={ent.heroCtas}>
                    <a href={requestHref(filters.query || undefined)} className={ent.btnPrimary}>
                      Request {filters.query ? `“${filters.query}”` : 'an integration'}
                    </a>
                    <Link to="/integrations/custom-webhooks" className={ent.btnSecondary}>
                      Use webhooks & REST
                    </Link>
                  </div>
                </div>
              ) : (
                grouped.map((g) => (
                  <div key={g.cat} className={styles.group}>
                    <div className={styles.groupHead}>
                      <h3>{g.cat}</h3>
                      <span>{g.items.length}</span>
                    </div>
                    <ul className={styles.grid}>
                      {g.items.map((i) => (
                        <li key={i.slug}>
                          <Tile integration={i} onOpen={openDetails} />
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              )}

              {visible.length > 0 && (
                <a href={requestHref(filters.query || undefined)} className={styles.requestTile}>
                  <Plus size={18} aria-hidden="true" />
                  <span>
                    <strong>Don’t see your tool?</strong> Tell us what you run. Meanwhile, any tool that can post
                    JSON can send events to AlertMend through a webhook.
                  </span>
                  <ArrowRight size={16} aria-hidden="true" />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Connection methods ---------- */}
      <section className={ent.sectionAlt} id="methods">
        <div className={ent.wrap}>
          <div className={ent.head}>
            <div>
              <span className={ent.eyebrow}>Connection methods in detail</span>
              <h2 className={ent.h2}>{connectionMethods.length} ways to connect, each with a clear scope.</h2>
            </div>
            <p className={ent.lede}>
              For your security review. Every integration uses one of these methods; read across a row to see
              what you hand over, which way traffic flows, what AlertMend reads, and whether it can change
              anything.
            </p>
          </div>

          <div className={styles.methods} role="table" aria-label="Connection methods">
            <div className={styles.methodHead} role="row">
              <span role="columnheader">Method</span>
              <span role="columnheader">You provide</span>
              <span role="columnheader">Network</span>
              <span role="columnheader">AlertMend reads</span>
              <span role="columnheader">Can it change anything?</span>
            </div>
            {connectionMethods.map((m) => {
              const users = integrations.filter((i) => i.connection === m.id)
              const flows = dataFlowOrder.filter((f) => users.some((u) => u.dataFlow.includes(f)))
              return (
                <div key={m.id} className={styles.methodRow} role="row" id={`method-${m.id}`}>
                  <div className={styles.methodName} role="cell">
                    <h3>{m.name}</h3>
                    <p>{m.summary}</p>
                    <div className={styles.methodFlows}>
                      {flows.map((f) => (
                        <FlowBadge key={f} flow={f} />
                      ))}
                    </div>
                    <div className={styles.methodUsers}>
                      {users.slice(0, 6).map((u) => (
                        <Link key={u.slug} to={`/integrations/${u.slug}`} title={u.name} className={styles.methodLogo}>
                          <BrandLogo
                            src={u.logoSrc}
                            slug={u.iconSlug}
                            tint={u.logoTint}
                            domain={u.domain}
                            alt={u.name}
                            className={styles.methodLogoImg}
                          />
                        </Link>
                      ))}
                      {users.length > 6 && (
                        <button
                          type="button"
                          className={styles.methodMore}
                          onClick={() => {
                            setFilters({ ...EMPTY, methods: [m.id] })
                            scrollToDirectory()
                          }}
                        >
                          +{users.length - 6}
                        </button>
                      )}
                    </div>
                  </div>
                  <MethodCell label="You provide" text={m.provide} />
                  <MethodCell label="Network" text={m.network} />
                  <MethodCell label="AlertMend reads" text={m.reads} />
                  <MethodCell label="Can it change anything?" text={m.changes} emphasis />
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ---------- Coverage matrix ---------- */}
      <section className={ent.section} id="coverage">
        <div className={ent.wrap}>
          <div className={ent.head}>
            <div>
              <span className={ent.eyebrow}>What each connection powers</span>
              <h2 className={ent.h2}>One connection, several products.</h2>
            </div>
            <p className={ent.lede}>
              Connecting a source once feeds every AlertMend product that can use it. Numbers show how many
              integrations of each kind feed each product.
            </p>
          </div>

          <div className={styles.matrixWrap}>
            <table className={styles.matrix}>
              <thead>
                <tr>
                  <th scope="col">Functionality</th>
                  {MATRIX_PRODUCTS.map((p) => (
                    <th key={p} scope="col">
                      <Link to={productById[p].to}>{PRODUCT_SHORT[p]}</Link>
                    </th>
                  ))}
                </tr>
              </thead>
              {integrationLayers.map((l) => (
                <tbody key={l.id}>
                  <tr className={styles.matrixGroup}>
                    <th scope="rowgroup" colSpan={MATRIX_PRODUCTS.length + 1}>
                      {l.label}
                    </th>
                  </tr>
                  {l.categories.map((cat) => {
                    const items = integrations.filter((i) => categoriesOf(i).includes(cat))
                    return (
                      <tr key={cat}>
                        <th scope="row">
                          <button
                            type="button"
                            className={styles.matrixRowLink}
                            onClick={() => {
                              setFilters({ ...EMPTY, scope: { kind: 'category', id: cat } })
                              scrollToDirectory()
                            }}
                          >
                            {cat}
                          </button>
                        </th>
                        {MATRIX_PRODUCTS.map((p) => {
                          const n = items.filter((i) => i.products.includes(p)).length
                          return (
                            <td key={p}>
                              {n > 0 ? (
                                <span
                                  className={n === items.length ? styles.dotFull : styles.dot}
                                  title={`${n} of ${items.length} ${cat} integrations feed ${productById[p].name}`}
                                >
                                  {n}
                                </span>
                              ) : (
                                <span className={styles.dotNone} aria-label="none">
                                  ·
                                </span>
                              )}
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })}
                </tbody>
              ))}
            </table>
          </div>
        </div>
      </section>

      {/* ---------- Data handling ---------- */}
      <section className={ent.sectionInk} id="data-handling">
        <div className={ent.wrap}>
          <div className={ent.head}>
            <div>
              <span className={ent.eyebrow}>What AlertMend reads and changes</span>
              <h2 className={ent.h2}>Read-only where it watches. Approval where it acts.</h2>
            </div>
            <p className={ent.lede}>
              The same rules hold across every integration, so your security review covers all of them at
              once.
            </p>
          </div>

          <div className={styles.handling}>
            {HANDLING.map((h) => (
              <div key={h.title} className={styles.handlingCol}>
                <h3 className={styles[`handling_${h.tone}`]}>{h.title}</h3>
                <ul>
                  {h.items.map((item) => (
                    <li key={item}>
                      <CheckCircle2 size={16} strokeWidth={2} aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className={styles.deploy}>
            <span className={styles.deployHead}>Where it runs</span>
            <ul>
              {DEPLOYMENT.map((d) => (
                <li key={d.title}>
                  <strong>{d.title}</strong>
                  <span>{d.body}</span>
                </li>
              ))}
            </ul>
            <Link to="/trust" className={ent.more}>
              Visit the Trust center →
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className={ent.section} id="faq">
        <div className={ent.wrap}>
          <div className={ent.head}>
            <div>
              <span className={ent.eyebrow}>FAQ</span>
              <h2 className={ent.h2}>Integration questions.</h2>
            </div>
          </div>
          <dl className={styles.faq}>
            {FAQS.map((f) => (
              <div key={f.q}>
                <dt>{f.q}</dt>
                <dd>{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <CtaBand
        title="Connect your first source today."
        lede="Start free with one cluster or one warehouse, or walk through your stack with us."
        primary={{ label: 'Book a demo', href: DEMO_URL }}
        secondary={{ label: 'Start free', href: SIGNUP_URL }}
      />

      {/* Portal: the page sits inside a stacking context below the fixed nav. Only
          ever mounted after a click or deep link, so the prerender never touches document. */}
      {selected && createPortal(<DetailsPanel integration={selected} onClose={closeDetails} />, document.body)}
      {filtersOpen &&
        createPortal(
          <FilterDrawer
            onClose={() => setFiltersOpen(false)}
            onClear={activeCount > 0 ? () => setFilters(EMPTY) : undefined}
            resultCount={visible.length}
            onShow={() => {
              setFiltersOpen(false)
              scrollToDirectory()
            }}
          >
            {facets}
          </FilterDrawer>,
          document.body,
        )}
    </>
  )
}

/* ---------- Pieces ---------- */

function Tile({
  integration: i,
  onOpen,
}: {
  integration: Integration
  onOpen: (e: MouseEvent<HTMLAnchorElement>, i: Integration) => void
}) {
  const flows = dataFlowOrder.filter((f) => i.dataFlow.includes(f))
  return (
    <a
      href={`/integrations/${i.slug}`}
      className={styles.tile}
      onClick={(e) => onOpen(e, i)}
      aria-haspopup="dialog"
      title={i.tagline}
    >
      {i.status === 'coming-soon' && <span className={styles.soon}>Coming soon</span>}
      <span className={styles.tileTypes} aria-hidden="true">
        {flows.map((f) => (
          <span key={f} title={dataFlows[f].label}>
            <FlowIcon flow={f} size={13} />
          </span>
        ))}
      </span>
      <span className={styles.tileLogo}>
        <BrandLogo
          src={i.logoSrc}
          slug={i.iconSlug}
          tint={i.logoTint}
          domain={i.domain}
          alt=""
          className={styles.tileLogoImg}
        />
      </span>
      <span className={styles.tileName}>{i.name}</span>
      <span className={styles.srOnly}>
        {i.category}. {flows.map((f) => dataFlows[f].label).join(', ')}.
      </span>
      <span className={styles.tileHint} aria-hidden="true">
        View details <ArrowRight size={12} />
      </span>
    </a>
  )
}

function ScopeButton({
  label,
  count,
  active,
  onClick,
  strong,
  indent,
}: {
  label: string
  count: number
  active: boolean
  onClick: () => void
  strong?: boolean
  indent?: boolean
}) {
  return (
    <button
      type="button"
      className={`${styles.scope} ${active ? styles.scopeActive : ''} ${strong ? styles.scopeStrong : ''} ${indent ? styles.scopeIndent : ''}`}
      aria-pressed={active}
      onClick={onClick}
      disabled={count === 0 && !active}
    >
      <span>{label}</span>
      <span className={styles.count}>{count}</span>
    </button>
  )
}

function ActiveChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className={styles.activeChip}>
      {label}
      <button type="button" onClick={onRemove} aria-label={`Remove filter ${label}`}>
        <X size={13} />
      </button>
    </span>
  )
}

/** Small tool ⇄ AlertMend diagram for the integration-type cards. */
function FlowMini({ flow }: { flow: DataFlow }) {
  const caption =
    flow === 'read' ? 'Read-only queries' : flow === 'stream' ? 'Events as they happen' : 'Alerts, approvals, tickets'
  return (
    <div className={styles.mini} aria-hidden="true">
      <span className={styles.miniNode}>Your tool</span>
      <span className={styles.miniLane}>
        <span className={flow === 'notify' ? styles.miniArrowOut : styles.miniArrowIn} />
        <span className={styles.miniCaption}>{caption}</span>
      </span>
      <span className={`${styles.miniNode} ${styles.miniNodeAm}`}>
        <AlertMendIcon className={styles.miniIcon} />
        AlertMend
      </span>
    </div>
  )
}

/** Esc closes, body scroll locks while open, focus starts on the close button. */
function useModal(onClose: () => void) {
  const closeRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [onClose])
  return closeRef
}

/** Full-screen filter drawer for small screens (Segment / Fivetran pattern). */
function FilterDrawer({
  children,
  onClose,
  onClear,
  onShow,
  resultCount,
}: {
  children: ReactNode
  onClose: () => void
  onClear?: () => void
  onShow: () => void
  resultCount: number
}) {
  const closeRef = useModal(onClose)
  return (
    <div className={styles.drawer} role="dialog" aria-modal="true" aria-labelledby="filter-drawer-title">
      <div className={styles.drawerHead}>
        <h2 id="filter-drawer-title">Filters</h2>
        <button ref={closeRef} type="button" className={styles.panelClose} onClick={onClose} aria-label="Close filters">
          <X size={18} />
        </button>
      </div>
      <div className={styles.drawerBody}>{children}</div>
      <div className={styles.drawerFoot}>
        {onClear && (
          <button type="button" className={styles.resetLink} onClick={onClear}>
            Clear all
          </button>
        )}
        <button type="button" className={ent.btnPrimary} onClick={onShow}>
          Show {resultCount} results
        </button>
      </div>
    </div>
  )
}

type Tab = 'connect' | 'setup' | 'overview'

/** Right-hand details panel (Datadog / Segment style). Esc, the close button or
 *  the backdrop closes it; focus moves into the panel and back to the tile. */
function DetailsPanel({ integration: i, onClose }: { integration: Integration; onClose: () => void }) {
  const [tab, setTab] = useState<Tab>('connect')
  const closeRef = useModal(onClose)

  useEffect(() => {
    setTab('connect')
  }, [i.slug])

  const tabs: { id: Tab; label: string }[] = [
    { id: 'connect', label: 'How it connects' },
    { id: 'setup', label: 'Setup' },
    { id: 'overview', label: 'What you get' },
  ]

  return (
    <div className={styles.panelRoot}>
      <div className={styles.backdrop} onClick={onClose} />
      <div className={styles.panel} role="dialog" aria-modal="true" aria-labelledby="integration-panel-title">
        <div className={styles.panelHead}>
          <span className={styles.panelLogo}>
            <BrandLogo
              src={i.logoSrc}
              slug={i.iconSlug}
              tint={i.logoTint}
              domain={i.domain}
              alt=""
              className={styles.panelLogoImg}
            />
          </span>
          <div className={styles.panelTitleWrap}>
            <h2 id="integration-panel-title" className={styles.panelTitle}>
              {i.name}
            </h2>
            <div className={styles.panelCats}>
              {categoriesOf(i).map((c) => (
                <span key={c}>{c}</span>
              ))}
            </div>
          </div>
          <button ref={closeRef} type="button" className={styles.panelClose} onClick={onClose} aria-label="Close details">
            <X size={18} />
          </button>
        </div>
        <p className={styles.panelLede}>{i.tagline}</p>

        <div className={styles.tabs} role="tablist" aria-label={`${i.name} details`}>
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={tab === t.id}
              aria-controls={`tabpanel-${t.id}`}
              className={tab === t.id ? styles.tabActive : styles.tab}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className={styles.panelBody} role="tabpanel" id={`tabpanel-${tab}`} aria-labelledby={`tab-${tab}`}>
          {tab === 'connect' && <ConnectionSpec integration={i} showSetup={false} />}

          {tab === 'setup' && (
            <>
              <ol className={styles.panelSteps}>
                {setupStepsFor(i).map((step, n) => (
                  <li key={step}>
                    <span className={styles.panelStepNum}>{n + 1}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
              {i.docsHref && (
                <Link to={i.docsHref} className={styles.panelDocs}>
                  Read the setup guide <ArrowRight size={14} aria-hidden="true" />
                </Link>
              )}
            </>
          )}

          {tab === 'overview' && (
            <>
              <p className={styles.panelText}>{i.description}</p>
              <ul className={styles.panelCaps}>
                {i.capabilities.map((c) => (
                  <li key={c}>
                    <CheckCircle2 size={16} strokeWidth={2} aria-hidden="true" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
              {i.faqs && i.faqs.length > 0 && (
                <dl className={styles.panelFaq}>
                  {i.faqs.map((f) => (
                    <div key={f.q}>
                      <dt>{f.q}</dt>
                      <dd>{f.a}</dd>
                    </div>
                  ))}
                </dl>
              )}
              <div className={styles.panelPowers}>
                <span>Powers</span>
                {i.products.map((id) => (
                  <Link key={id} to={productById[id].to}>
                    {productById[id].name}
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>

        <div className={styles.panelFoot}>
          <Link to={`/integrations/${i.slug}`} className={ent.btnPrimary}>
            Open full page <ExternalLink size={15} aria-hidden="true" />
          </Link>
          <a href={DEMO_URL} target="_blank" rel="noopener noreferrer" className={ent.btnSecondary}>
            Book a demo
          </a>
        </div>
      </div>
    </div>
  )
}

function MethodCell({ label, text, emphasis }: { label: string; text: string; emphasis?: boolean }) {
  return (
    <div className={emphasis ? styles.methodCellEm : styles.methodCell} role="cell">
      <span className={styles.methodCellLabel}>{label}</span>
      <p>{text}</p>
    </div>
  )
}
