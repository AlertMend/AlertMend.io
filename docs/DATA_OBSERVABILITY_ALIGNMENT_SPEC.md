# Data Observability site alignment — implementation spec

> **For Cursor / any coding agent.** Read `AGENTS.md` and `CLAUDE.md` first. This spec
> lists every change needed on alertmend.io so that a data-team visitor sees the same
> product on the website that they see in the app and in the sales demo.
> Owner: DQ go-to-market owner · Spec date: 2026-09-24 · Repo: `AlertMend.io`

---

## 0. Context and hard rules

**Why.** The Data Observability page and homepage mocks advertise features that the
data-quality product does not have (RCA, auto-fix, quarantine, dbt/BigQuery/Redshift/
Databricks/Postgres). They omit what it does have. Source of truth for what is built:
`auto_remediation/server/data-quality/README.md` and `COMPLETION_REPORT.md`.

**What the product really does today (only these may appear on data pages):**

| Capability | Status |
| --- | --- |
| Snowflake (direct, and via customer-hosted agent) | Built |
| Oracle connector | Built |
| Airflow and Oracle ODI pipeline runs linked to failed checks ("pipeline provenance") | Built |
| Power BI downstream lineage (which reports use a table) | Built |
| Policy-to-checks: upload a policy PDF (e.g. BCBS 239), AI proposes checks, each cites its clause | Built |
| Data Quality Copilot (proposes add/edit/route checks; user approves) | Built |
| 87-check catalog: completeness, uniqueness, validity, format, referential integrity, numeric, volume, freshness, anomaly (z-score), trend | Built |
| Quality score (severity-weighted; a failing check caps the score) | Built |
| Business glossary | Built |
| Slack / Teams alerts, incidents, escalation, noise control (cooldown, maintenance windows, flapping) | Built |
| Audit trail, check versioning, rollback, least-privilege grant script, retention | Built |
| Schema-change checks, distribution drift | **Not yet** |
| BigQuery, Redshift, Databricks, Postgres, dbt | **Not yet** |
| RCA with confidence score, auto-remediation, rollback, quarantine, data contracts enforcement | **Not for data quality** |

**Hard rules for every change in this spec**

1. Never add a data-quality claim that is not in the "Built" rows above.
2. Do not change infrastructure pages (Kubernetes, Observability, Logs, AI RCA, RF,
   On-call, FinOps, GPU) except where this spec says so.
3. No new routes. `/data-observability` and `/pricing` stay; add hash `#data` on pricing.
4. Use sample names only in mocks (`BANKING.CUSTOMER_ACCOUNTS`, `nightly_load`). No real customer names.
5. Certification wording: SOC 2 Type II and ISO 27001 are **in progress**; GDPR is **aligned**. Never "certified" or "compliant".
6. Keep existing design system, components and Tailwind/CSS-module conventions.

---

## 1. Task list (do in this order)

| ID | Priority | Task | Files |
| --- | --- | --- | --- |
| T1 | P0 | Rewrite Data Observability page content | `src/pages/DataObservabilityPage.tsx` |
| T2 | P0 | Rewrite data hero board mock | `src/components/mocks/PlatformBoardMock.tsx` (`DataObsBoard`) |
| T3 | P0 | Rewrite homepage data product mock | `src/components/sections/ProductList.tsx` (`DataObsMock`) |
| T4 | P0 | Update data product catalog entry + add `group` | `src/data/homeProducts.ts` |
| T5 | P1 | Split Platform menu into Infrastructure and Data | `src/components/layout/Nav.tsx` (+ `Nav.module.css`) |
| T6 | P1 | Group footer product links | `src/components/layout/Footer.tsx` |
| T7 | P1 | Add optional `afterSpotlight` slot to the solution template | `src/components/SolutionPageTemplate.tsx` |
| T8 | P1 | New homepage audience chooser | new `src/components/sections/AudienceChooser.tsx` + `.module.css`, `src/pages/HomePage.tsx` |
| T9 | P1 | Label homepage outcomes as infrastructure | `src/components/sections/Outcomes.tsx` |
| T10 | P1 | Data tab on pricing (behind a flag) | `src/pages/PricingPage.tsx` |
| T11 | P1 | Data section on Security page + certification wording | `src/pages/SecurityPage.tsx`, `src/pages/CompliancePage.tsx` |
| T12 | P2 | Second offer in final CTA | `src/components/sections/FinalCTA.tsx` |
| T13 | P2 | SEO text updates | pages listed in section 14 |

Ship T1–T4 as one PR ("P0: remove unsupported data claims"). T5–T11 as a second PR. T12–T13 as a third.

---

## 2. T1 — `src/pages/DataObservabilityPage.tsx`

Keep the component structure (`SolutionPageTemplate`). Replace **all** prop values as below.
Delete the `SpotlightPanel` function and replace it with `DqSpotlightPanel` (2.9).
Update the file's header comment to: "/data-observability — policy-driven data quality for regulated data teams."

Icons: import from `lucide-react` only what is used: `Plug, FileText, BellRing, ListChecks, TrendingUp, GitBranch, BarChart3, MessageSquare, Gauge, BellOff, ShieldCheck, Lock, History, KeyRound`.

### 2.1 SEO

```ts
seo={{
  title: 'Data Quality from Your Policy – Snowflake & Oracle | AlertMend',
  description:
    'Turn your data quality policy into live checks in days. Read-only agent in your network, pipeline and Power BI impact, and a full audit trail.',
  keywords:
    'data quality monitoring, data observability, data quality policy, BCBS 239 data quality, Snowflake data quality, Oracle data quality, data quality checks, data governance, Power BI lineage, AlertMend',
  canonical: '/data-observability',
}}
```

### 2.2 Hero

```tsx
badge="Data Observability"
headline={<>Your data quality policy, <Accent>live in days</Accent></>}
sub="Upload your policy, approve the checks AlertMend proposes, and monitor Snowflake and Oracle through a read-only agent inside your network. When a check fails, see the job that caused it and the reports it affects."
signupUrl={SIGNUP_URL}   // keep: https://app.alertmend.io/signup?service=data-observability
checks={['Checks from your policy', 'Read-only agent in your network', 'Every change approved and audited']}
highlightProduct="dataobs"
```

If the template's primary hero button text is generic ("Start free" / "Book a demo"), leave it. Do not add a playground link on this page (the playground is infra-only).

### 2.3 Explainer band (use the existing `explainer` prop)

Render three columns (reuse the grid pattern from `LogManagementPage`'s `SqlLogsExplainer`):

| Heading | Body |
| --- | --- |
| Policies stay on paper | Most data quality policies are written once and only partly monitored, because someone has to turn every clause into rules by hand. |
| Failures reach the report first | Business users often spot bad numbers before the data team does. |
| Auditors ask for proof | "Show me how this rule is enforced" takes days of spreadsheets. |

### 2.4 Steps

```ts
stepsHeading="From policy to live checks"
stepsSub="Connect once through an agent in your network, turn your policy into checks, and get alerts that show the cause and the impact."
steps={[
  { icon: Plug, title: 'Connect safely', sub: 'Agent in your network',
    spec: 'Read-only queries · credentials never leave your network · Snowflake and Oracle' },
  { icon: FileText, title: 'Upload your policy', sub: 'Checks proposed for you',
    spec: 'Each check names the clause it enforces · you approve every one' },
  { icon: BellRing, title: 'Monitor and alert', sub: 'Cause and impact',
    spec: 'Slack or Teams alert · failed Airflow or ODI job · affected Power BI reports' },
]}
```

Give the steps section `id="policy"` if the template allows passing an id; otherwise add an optional `stepsId?: string` prop in T7 and set it to `policy`.

### 2.5 Features (exactly these 8, in this order; first one `big: true`)

```ts
featuresHeading="What you get"
featuresSub="Policy-driven checks, clear causes and impact, and the controls a regulated data office needs."
features={[
  { icon: FileText, title: 'Policy to checks', big: true,
    body: 'Upload a policy or data contract as a PDF. AlertMend proposes checks, each linked to the clause it enforces, and nothing goes live until you approve it.',
    chips: ['BCBS 239', 'internal DQ policy', 'clause trace'] },
  { icon: ListChecks, title: '87 ready-made checks',
    body: 'Missing values, duplicates, formats, valid ranges, referential integrity, freshness, volume and more. Built in a guided wizard, no SQL needed.',
    chips: ['no-code', 'wizard'] },
  { icon: TrendingUp, title: 'Anomaly and trend checks',
    body: "Checks learn from each dataset's own history and flag unusual changes. Without enough history, a check waits instead of guessing.",
    chips: ['history', 'trend'] },
  { icon: GitBranch, title: 'See the cause',
    body: 'A failed Airflow or Oracle ODI run is linked to the check it broke, with the error message.',
    chips: ['Airflow', 'Oracle ODI'] },
  { icon: BarChart3, title: 'See the impact',
    body: 'See which Power BI reports use the affected data before anyone opens them.',
    chips: ['Power BI', 'lineage'] },
  { icon: MessageSquare, title: 'Data Quality Copilot',
    body: 'Ask in plain English to add, change or route checks. Every change is a proposal you approve.',
    chips: ['plain English', 'approve'] },
  { icon: Gauge, title: 'Quality score',
    body: 'One score per dataset and overall. A failing check caps the score, so an average never hides a problem.',
    chips: ['per dataset', 'overall'] },
  { icon: BellOff, title: 'Alerts without noise',
    body: 'Cooldowns, maintenance windows and flapping detection, with incidents and escalation when it matters.',
    chips: ['Slack', 'Teams'] },
]}
```

Give the "See the cause" card an anchor `id="pipelines"` if the template supports per-feature ids; if not, skip (the nav link in T5 then points to `/data-observability#policy`).

### 2.6 Works with

```tsx
worksWith={{
  heading: 'Works with your data stack today',
  body: (
    <p className="mt-3 text-[14px] leading-relaxed text-zinc-500">
      Snowflake and Oracle for checks, Airflow and Oracle ODI for pipeline runs, Power BI for
      report impact, and alerts in{' '}
      <Link to="/integrations/slack" className="font-medium text-violet-700 underline-offset-2 hover:underline">Slack</Link>{' '}or{' '}
      <Link to="/integrations/ms-teams" className="font-medium text-violet-700 underline-offset-2 hover:underline">Microsoft Teams</Link>.
      Databricks and Postgres are next.
    </p>
  ),
  items: [
    { label: 'Snowflake' }, { label: 'Oracle' }, { label: 'Airflow' },
    { label: 'Oracle ODI' }, { label: 'Power BI' }, { label: 'Slack' }, { label: 'Microsoft Teams' },
  ],
}}
```

Remove BigQuery, Redshift, Databricks, Postgres and dbt from `items`.
("Databricks and Postgres are next" may stay only while Product confirms they are on the roadmap; otherwise delete that sentence.)

### 2.7 Spotlight

```tsx
spotlight={{
  tag: 'Bad data at 06:12',
  title: 'A nightly load failed. The report was fixed before the 9am meeting.',
  body: 'The nightly ODI load stopped on an Oracle error. AlertMend failed the linked uniqueness check, named the job and the error, and listed the three Power BI reports that read the table.',
  steps: [
    'Uniqueness check fails on BANKING.CUSTOMER_ACCOUNTS',
    'Linked to ODI job nightly_load: ORA-01400',
    '3 Power BI reports flagged as affected',
    'Alert in Teams with the policy clause the check enforces',
  ],
  linkTo: '/security',
  linkLabel: 'How your data stays safe',
  panel: <DqSpotlightPanel />,
}}
```

### 2.8 After-spotlight sections (needs T7) and CTA

Pass `afterSpotlight={<><DqSecurityBand /><DqFaq /></>}`.

`DqSecurityBand` — heading "Built for regulated data", 6 items in a 3×2 grid:

| Icon | Title | Body |
| --- | --- | --- |
| Lock | Read-only by design | The agent refuses anything but read queries and caps query time. |
| KeyRound | Credentials stay home | The agent holds your warehouse credentials. AlertMend stores no warehouse secrets. |
| ShieldCheck | Outbound only | The agent connects out. No inbound ports are opened in your network. |
| ListChecks | Least privilege | A generated grant script sets up a read-only role. |
| History | Audit and rollback | Every check change is versioned with a reason and can be rolled back. |
| FileText | Business glossary | Link checks to the business terms your teams use. |

Under the grid, small text: "SOC 2 Type II and ISO 27001 are in progress." with a link to `/security`.

`DqFaq` — use native `<details>/<summary>` for accessibility:

| Question | Answer |
| --- | --- |
| Does our data leave our network? | No. The agent runs queries inside your network and sends back only results. |
| Does AI change our data or checks on its own? | No. It proposes checks. A person approves each one, and nothing writes to your data. |
| Which policies can we upload? | Any text-based PDF, such as BCBS 239, internal DQ standards or data contracts. |
| How long does setup take? | Connecting takes minutes. Most of the time goes into reviewing the proposed checks with your data owners. |
| Can we use it with our existing data quality tool? | Yes. It runs alongside your current tools. |
| How is it priced? | A plan price with unlimited checks and users. (Link "data pricing" to `/pricing#data` only after T10 is live; until then link to `/contact`.) |

CTA:

```ts
ctaHeading="See your policy turned into checks"
ctaSub="Book a 30-minute walkthrough on a sample banking policy, or start a pilot on your own data."
```

Add a one-line cross-link under the CTA if the template allows it, otherwise at the end of `DqFaq`:
"Also run Kubernetes or VMs? **See AlertMend for infrastructure →**" linking to `/observability`.

### 2.9 `DqSpotlightPanel` (replaces `SpotlightPanel`)

Same visual container as the old panel. Content:

- Header row: `BANKING.CUSTOMER_ACCOUNTS · Snowflake` and a red pill `1 check failing`.
- Rows (reuse the tone classes):
  - `uniqueness · account_id` → `98.7% (expected 100%)` — crit
  - `completeness · customer_id` → `100%` — ok (add an `ok` tone: `border-emerald-400/30 bg-emerald-500/10 text-emerald-300`)
  - `freshness` → `on time` — ok
- Violet box (reuse styles) with title **"Cause and impact"** (not "Root cause", no confidence %):
  "ODI job **nightly_load** failed with `ORA-01400`. 3 Power BI reports read this table. Policy: BCBS 239, Principle 3 (Accuracy and integrity)."

---

## 3. T2 — `DataObsBoard` in `src/components/mocks/PlatformBoardMock.tsx`

This is the hero visual for `highlightProduct="dataobs"`. Keep the layout and style classes; change data only.

- `kpiRow`: `datasets 42` (violet) · `checks 318` (ok) · `failing 3` (hot) · `quality 96` (warn). Remove "contracts".
- Tile 1 title "Checks by type", meta "Snowflake · live". `monitors` →
  `completeness 96/1`, `uniqueness 58/1`, `validity 74/0`, `freshness 42/1` (ok/bad). Tag: `from policy · BCBS 239`.
- Tile 2 title "Failing checks", meta "last 15m". Rows:
  - CRIT `Uniqueness` · `customer_accounts.account_id · 98.7%`
  - CRIT `Freshness` · `loans.daily_balance · 3h late`
  - WARN `Completeness` · `kyc.address · 2.1% missing`
  Replace the `View RCA` chip with `Job linked` on the first two rows and `Watching` on the third.
- Tile 3: replace the "AI RCA" tile. Title "Cause and impact", meta `ODI`.
  Text: "**nightly_load** failed (ORA-01400) · **3** Power BI reports affected". Chips: `Oracle ODI`, `Power BI`, `clause 3.2`. Tag: `approve in Teams`.
  Remove the `91%` confidence meta and the `styles.conf` usage.

Remove every occurrence of `stg_orders`, `updated_at`, `dbt`, `v4.12.1`, `contract`, `Schema drift`, `View RCA` from `DataObsBoard`.

## 4. T3 — `DataObsMock` in `src/components/sections/ProductList.tsx`

- `Console` meta: `Snowflake · 42 datasets`.
- KPIs: `Datasets 42 monitored` · `Failing 3 open` · `Checks 318 from policy` · `Quality 96 score`. Remove "Contracts 86 enforced".
- Panel head: `Failing checks` with `<em>2 jobs linked</em>` (replaces "2 with RCA").
- Rows: same three rows as T2 tile 2. Right-side `<em>`: `Job linked` / `Watching` (replace "View RCA").
- Remove `Schema drift`, `stg_orders`, `updated_at`.

## 5. T4 — `src/data/homeProducts.ts`

1. Add to the `HomeProduct` type:
   ```ts
   /** Which front door the product belongs to (nav/footer grouping). */
   group: 'infrastructure' | 'data'
   ```
2. Set `group: 'infrastructure'` on the eight infra products and `group: 'data'` on `dataobs`.
3. Update `dataobs`:
   ```ts
   line: 'Turn your data quality policy into live checks on Snowflake and Oracle, with a read-only agent in your network.',
   blurb: 'Policy-driven data quality',
   ```
4. Move the `dataobs` entry to the **end** of `HOME_PRODUCTS` so the homepage lists infra first and data last.
   Check `Hero`/`ProductList` for any index-based assumptions before moving; if the hero console depends on order, keep the order and only change the text.

## 6. T5 — `src/components/layout/Nav.tsx`

1. Change `PLATFORM_GROUPS` to:
   ```ts
   const PLATFORM_GROUPS: { label: string; ids: HomeProductId[] }[] = [
     { label: 'Observe', ids: ['k8s', 'obs', 'logs'] },
     { label: 'Respond', ids: ['rca', 'fix', 'oncall'] },
     { label: 'Operate', ids: ['finops', 'mlops'] },
     { label: 'Data', ids: ['dataobs'] },
   ];
   ```
2. Under the `Data` column, after the Data Observability item, render three small text links (same style as `megaItemDesc`, no icon):
   - "Policy to checks" → `/data-observability#policy`
   - "Data pricing" → `/pricing#data` (render only when `SHOW_DATA_PRICING` from T10 is true)
   - "Book the data demo" → `CALENDLY_URL` (external, `target="_blank" rel="noopener noreferrer"`)
3. Visually separate the Data column (e.g. left border using an existing border token). Update `Nav.module.css` so `.megaProducts` fits 4 columns (check the current grid-template-columns) without overflow at the existing breakpoints.
4. Mobile drawer (around line 353, `HOME_PRODUCTS.map`): render two headed lists, "Infrastructure" (`group === 'infrastructure'`) and "Data" (`group === 'data'`).
5. The `megaFeatured` card stays as is.

## 7. T6 — `src/components/layout/Footer.tsx`

Replace the single "Platform" column with two columns:
- `<h5>Infrastructure</h5>` → `HOME_PRODUCTS.filter(p => p.group === 'infrastructure')`
- `<h5>Data</h5>` → `HOME_PRODUCTS.filter(p => p.group === 'data')`

Keep the compliance block. `STANDARDS` chips stay, but the "In progress" note must remain visible next to them (it is today). Do not add any "certified" wording.

## 8. T7 — `src/components/SolutionPageTemplate.tsx`

Add two optional props, used only by the data page. No visual change for other pages.

```ts
/** Optional content rendered after the spotlight and before the CTA band. */
afterSpotlight?: ReactNode
/** Optional id for the steps section, for in-page anchors (e.g. "policy"). */
stepsId?: string
```

Render `afterSpotlight` inside a section with the same container/padding as the explainer band.
Set `id={p.stepsId}` on the steps `<section>` when provided.

## 9. T8 — Homepage audience chooser

Create `src/components/sections/AudienceChooser.tsx` + `AudienceChooser.module.css`, and render it in
`src/pages/HomePage.tsx` directly after `<Hero />` (before `<CustomerLogoStrip />`).

Layout: section with `className="tight"`, `container`, two equal cards in a 2-column grid; 1 column below 720px. Whole card is a `Link`. Use existing `sec-tag`, button and card styles.

| | Card 1 | Card 2 |
| --- | --- | --- |
| Tag | For platform & SRE teams | For data & governance teams |
| Heading | Find the cause and fix it, with approval | Your data quality policy, live in days |
| Body | Kubernetes, VMs and GPUs on one timeline. AI root cause with evidence, and fixes gated in Slack or Teams. | Turn your policy into checks on Snowflake and Oracle. See the job that caused a failure and the reports it affects. |
| Link text | Explore infrastructure → | Explore data quality → |
| Href | `/observability` | `/data-observability` |

Accessibility: each card has a visible focus state; the arrow is `aria-hidden`.

## 10. T9 — `src/components/sections/Outcomes.tsx`

Change `<span className="sec-tag">Outcomes</span>` to `Infrastructure outcomes`. Keep the h2 and numbers.

## 11. T10 — `src/pages/PricingPage.tsx`

1. Add at the top: `const SHOW_DATA_PRICING = false // flip to true after the CEO approves data pricing`.
2. When the flag is true, render a two-option segmented control above the plans: **Infrastructure** | **Data**.
   - State initialised from `window.location.hash === '#data'`; update the hash on change (`history.replaceState`).
   - Infrastructure shows the existing `plans` unchanged.
   - Data shows `dataPlans` (below).
3. `dataPlans` (no prices; limits marked TBD until approved):
   ```ts
   const dataPlans = [
     { name: 'Free', label: 'Free', description: 'Try it on your own data',
       features: ['1 connection', 'A few monitored datasets (TBD)', 'Unlimited checks and users', 'Policy to checks and Copilot', 'Slack and Teams alerts'],
       popular: false, buttonText: 'Start free', href: 'https://app.alertmend.io/signup?service=data-observability' },
     { name: 'Team', label: '', description: 'One data team, one project',
       features: ['More datasets (TBD)', 'Unlimited checks and users', 'Pipeline links (Airflow, ODI)', 'Power BI impact'],
       popular: true, buttonText: 'Talk to us', href: DEMO_URL },
     { name: 'Business', label: '', description: 'Several teams and domains',
       features: ['More datasets and connections (TBD)', 'Incidents and escalation', 'Audit export, versioning and rollback'],
       popular: false, buttonText: 'Talk to us', href: DEMO_URL },
     { name: 'Enterprise', label: '', description: 'Regulated, large estates',
       features: ['Unlimited datasets and connections', 'On-prem deployment', 'Custom SLAs', 'Security review support'],
       popular: false, buttonText: 'Talk to us', href: DEMO_URL },
   ]
   ```
4. Data tab heading: "One plan price. Unlimited checks." Sub: "Turn your whole policy into checks without the bill going up."
5. On the Infrastructure tab (flag on), add a small line under the plans: "Looking for data quality pricing? See the Data tab."
6. Reuse the existing plan card rendering; if cards don't support `href`, map button clicks the same way the existing plans do.

## 12. T11 — Security and Compliance pages

`src/pages/SecurityPage.tsx`: add a section titled **"Data Observability: how your data stays safe"** after "Data Protection", reusing the existing card/list styles:

| Title | Description |
| --- | --- |
| Credentials never leave your network | A customer-hosted agent holds your warehouse and BI credentials. AlertMend stores no warehouse secrets. |
| Read-only by design | AlertMend sends read-only SQL. The agent refuses anything that isn't a read query and caps query time. |
| Outbound only | The agent connects out to AlertMend. No inbound ports are opened in your network. |
| Least privilege | A generated grant script creates a read-only role with only the access checks need. |
| Audit and versioning | Every check change is versioned with a reason and can be rolled back. Secrets are redacted from the audit log. |
| Retention | Check results are kept for 90 days and the audit log for 1 year by default, both configurable. |

Add a button "Request our security pack" → `/contact`.

Wording fixes:
- `SecurityPage.tsx`: "GDPR-compliant data handling" → "GDPR-aligned data handling".
- `CompliancePage.tsx`: GDPR description → "Aligned with EU General Data Protection Regulation practices." Keep SOC 2 and ISO 27001 as in progress.
- `CompliancePage.tsx`: remove the HIPAA entry unless the founders confirm a documented HIPAA program (leave a `// TODO(founders): confirm HIPAA` comment if unsure, and hide it).

## 13. T12 — `src/components/sections/FinalCTA.tsx`

Keep the existing infrastructure health-check block unchanged. Add a second, smaller block below it (same section, a bordered row):

- Tag: `Data quality demo`
- Heading: `See a sample banking policy turned into live checks`
- Button: `Book the data demo` → `CALENDLY_URL` (external link attrs as existing)
- Meta chips: `Read-only agent` · `Checks cite the policy clause` · `Snowflake and Oracle`

## 14. T13 — SEO text

| File | Change |
| --- | --- |
| `DataObservabilityPage.tsx` | Done in 2.1 |
| `PricingPage.tsx` | `baseDescription` → "AlertMend pricing for Kubernetes and cloud ops, and data quality plans with unlimited checks. Compare plans and book a demo." SEO title → "AlertMend Pricing: Infrastructure and Data Quality Plans" |
| `HomePage.tsx` | Append to `baseDescription`: " Plus policy-driven data quality for regulated data teams." Add `data quality monitoring` to `keywords`. Keep title. |
| `SecurityPage.tsx` | Append to `baseDescription`: " Includes a read-only data agent that keeps warehouse credentials in your network." |

Run the existing meta-description checks (see `META_DESCRIPTION_TESTS.md`) so `ensureUniqueMetaDescription` still passes.

---

## 15. Acceptance criteria

**Automated (run all):**

```bash
npm run lint
npx tsc --noEmit
npm run build          # full pipeline incl. prerender
```

**Claim grep — review every match (see exceptions below):**

```bash
# Data Observability page
grep -n -i -E "bigquery|redshift|databricks|postgres|dbt|quarantine|confidence|stg_orders|updated_at|v4\.12\.1|root cause|rca|rollback|contract" \
  src/pages/DataObservabilityPage.tsx

# Hero board mock (only the DataObsBoard function)
sed -n '/function DataObsBoard/,/^}/p' src/components/mocks/PlatformBoardMock.tsx \
  | grep -n -i -E "dbt|stg_orders|updated_at|View RCA|contract|91%|RCA|Schema drift"

# Homepage product mock (only the DataObsMock function)
sed -n '/function DataObsMock/,/^}/p' src/components/sections/ProductList.tsx \
  | grep -n -i -E "dbt|stg_orders|updated_at|View RCA|contract|RCA|Schema drift"
```

The last two commands must print nothing.

Exceptions: "Databricks and Postgres are next" in 2.6 (if kept), "data contract" in the Policy-to-checks card and FAQ, and "rollback" in the security band (check versioning rollback) are allowed. Review any match by hand.

**Manual (run `npm run dev`):**

- [ ] `/data-observability`: hero, explainer, steps, 8 features, works-with, spotlight, security band, FAQ, CTA render at 375px, 768px and 1280px widths.
- [ ] Hero board and homepage data mock show no RCA, confidence, dbt or contract text.
- [ ] Platform menu shows 4 columns with Data last; mobile drawer shows Infrastructure and Data headings.
- [ ] Footer shows Infrastructure and Data columns.
- [ ] Homepage shows the audience chooser right after the hero; both cards link correctly and are keyboard-focusable.
- [ ] `/pricing` looks unchanged while `SHOW_DATA_PRICING = false`; with the flag set to true locally, `/pricing#data` opens the Data tab.
- [ ] `/security` shows the new Data Observability section; `/compliance` has no HIPAA entry and GDPR reads "aligned".
- [ ] Every button on `/data-observability` goes to Calendly, the data sign-up link, `/security`, `/contact` or `/observability`. None go to `demo.alertmend.io`.
- [ ] Infra pages (Kubernetes, Observability, Logs, AI RCA, RF, On-call, FinOps, GPU) look unchanged.

---

## 16. Out of scope for this repo (for the product team, `auto_remediation`)

- Data accounts: review whether the "Infrastructure" and "Automation" menu sections should show for `dashType === 'data_observability'` (`ui/src/layouts/full/vertical/sidebar/SidebarItems.tsx`).
- First-run empty state: "Connect a data source" (agent install) → "Upload a policy".
- Sample banking dataset + policy for trials.
- dbt shows as an option in `ui/src/views/data-quality/PipelinesTab.tsx` but there is no backend provider (`server/data-quality/pipelines/` has only Airflow and ODI) — hide it until built.
- Schema-change checks: when shipped, re-add "schema changes" to the data page in a follow-up PR.
