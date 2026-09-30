import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import {
  AUTHOR_CRED_CSS,
  BLOG_SIGNUP_HANDLER_JS,
  CHROME_INLINE_CSS,
  DINESH_AUTHOR,
  SITE_URL,
  buildCredArticleHeader,
  buildNavHtml,
  buildSidebarHtml,
  calendlyUrl,
  dineshJsonLdAuthor,
  esc,
  getRelatedPosts,
  writeStaticBlogOutputs,
} from './static-blog-shared.mjs'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')

const slug = 'bigquery-data-quality-checks'
const title = 'BigQuery Data Quality: 12 SQL Monitors'
const h1 = 'BigQuery Data Quality: 12 Copy-Paste SQL Monitors'
const description = '12 copy-paste SQL checks for BigQuery data quality: freshness, volume, nulls, duplicates, and schema drift, plus how to run them on a schedule.'
const publishedDate = '2026-09-29'
const modifiedDate = '2026-09-29'
const category = 'Data Observability'
const keywords = 'bigquery data quality, bigquery data quality checks, bigquery data monitoring, bigquery freshness check, bigquery null check sql, bigquery duplicate rows sql, bigquery schema drift, data quality sql bigquery, bigquery information_schema, bigquery data observability'
const canonical = `${SITE_URL}/blog/${slug}`
const calendly = calendlyUrl(slug)
const related = getRelatedPosts(slug, category)
const heroImage = `${SITE_URL}/assets/${slug}/hero.svg`
const styleHref = '/assets/exit-code-126/styles.css'
const scriptHref = '/assets/exit-code-126/script.js'
const author = {
  ...DINESH_AUTHOR,
  role: 'AI agent automation expert',
  credLine: '12+ years in cloud infrastructure and incident automation',
}

// SQL monitors grouped by the 5 data-observability pillars. Backticks escaped for BigQuery table refs.
const PILLARS = [
  {
    pillar: 'Freshness', blurb: 'Is the table late? Freshness is the check that catches a pipeline that silently stopped.',
    monitors: [
      { n: 1, title: 'Table staleness', note: 'How long since the last row landed. The simplest and highest-value monitor.',
        sql: `SELECT TIMESTAMP_DIFF(CURRENT_TIMESTAMP(), MAX(updated_at), MINUTE) AS mins_stale
FROM \`your_project.your_dataset.orders\`;
-- alert when mins_stale > 360   (table is over 6 hours late)` },
      { n: 2, title: 'Partition freshness', note: "For date-partitioned tables, confirm today's partition exists and is not empty, using INFORMATION_SCHEMA.",
        sql: `SELECT partition_id, total_rows, last_modified_time
FROM \`your_project.your_dataset.INFORMATION_SCHEMA.PARTITIONS\`
WHERE table_name = 'orders'
ORDER BY partition_id DESC
LIMIT 3;
-- alert if the expected latest partition (e.g. today) is missing or total_rows = 0` },
    ],
  },
  {
    pillar: 'Volume', blurb: 'Row counts against a rolling baseline catch a half-loaded batch that freshness alone would miss.',
    monitors: [
      { n: 3, title: 'Volume vs a 7-day baseline', note: "Today's row count compared to the trailing week average catches a partial or doubled load.",
        sql: `WITH daily AS (
  SELECT DATE(created_at) AS d, COUNT(*) AS rows
  FROM \`your_project.your_dataset.orders\`
  WHERE created_at >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 8 DAY)
  GROUP BY d
)
SELECT
  (SELECT rows FROM daily WHERE d = CURRENT_DATE()) AS today_rows,
  ROUND(AVG(rows), 0) AS baseline_avg
FROM daily WHERE d < CURRENT_DATE();
-- alert if today_rows < 0.5 * baseline_avg   (a 50% volume drop)` },
      { n: 4, title: 'Silent zero-load', note: 'The specific case of an expected load that produced no rows at all.',
        sql: `SELECT COUNT(*) AS rows_today
FROM \`your_project.your_dataset.orders\`
WHERE DATE(created_at) = CURRENT_DATE();
-- alert if rows_today = 0 when a load was expected` },
    ],
  },
  {
    pillar: 'Quality and distribution', blurb: 'Null rates, ranges, and category drift catch bad values that land on time and in the right volume.',
    monitors: [
      { n: 5, title: 'Null rate on required columns', note: 'A spike in nulls on a column your dashboards depend on is a classic silent break. COUNTIF makes this a one-liner.',
        sql: `SELECT
  COUNTIF(customer_id IS NULL) / COUNT(*) AS null_rate_customer_id,
  COUNTIF(email IS NULL)       / COUNT(*) AS null_rate_email
FROM \`your_project.your_dataset.orders\`;
-- alert if any null_rate > 0.01   (over 1% unexpectedly null)` },
      { n: 6, title: 'Out-of-range values', note: 'Values that break a business rule, such as a negative or impossibly large amount.',
        sql: `SELECT COUNTIF(amount < 0 OR amount > 100000) AS out_of_range_rows
FROM \`your_project.your_dataset.orders\`;
-- alert if out_of_range_rows > 0` },
      { n: 7, title: 'Category drift', note: 'An unexpected or misspelled category value, often the first sign of an upstream change.',
        sql: `SELECT status, COUNT(*) AS n
FROM \`your_project.your_dataset.orders\`
WHERE status NOT IN ('pending','paid','shipped','refunded','cancelled')
GROUP BY status;
-- alert if any rows return   (a new or typo status appeared)` },
      { n: 8, title: 'Distribution shift', note: "A statistical check: today's average is more than three standard deviations from the trailing week.",
        sql: `WITH d AS (
  SELECT DATE(created_at) AS day, AVG(amount) AS avg_amt, STDDEV(amount) AS sd_amt
  FROM \`your_project.your_dataset.orders\`
  WHERE created_at >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 8 DAY)
  GROUP BY day
)
SELECT
  (SELECT avg_amt FROM d WHERE day = CURRENT_DATE()) AS today_avg,
  ROUND(AVG(avg_amt), 2) AS week_avg,
  ROUND(AVG(sd_amt), 2)  AS week_sd
FROM d WHERE day < CURRENT_DATE();
-- alert if ABS(today_avg - week_avg) > 3 * week_sd` },
    ],
  },
  {
    pillar: 'Uniqueness and integrity', blurb: 'Duplicate keys and orphaned rows are the errors that silently double revenue or break joins.',
    monitors: [
      { n: 9, title: 'Duplicate primary keys', note: 'The check that catches a re-run batch or a broken merge doubling your rows.',
        sql: `SELECT order_id, COUNT(*) AS copies
FROM \`your_project.your_dataset.orders\`
GROUP BY order_id
HAVING COUNT(*) > 1
ORDER BY copies DESC
LIMIT 100;
-- alert if any rows return` },
      { n: 10, title: 'Referential integrity', note: 'Orders whose customer_id has no matching customer: orphans that break every downstream join.',
        sql: `SELECT COUNT(*) AS orphan_orders
FROM \`your_project.your_dataset.orders\` o
LEFT JOIN \`your_project.your_dataset.customers\` c
  ON o.customer_id = c.customer_id
WHERE c.customer_id IS NULL;
-- alert if orphan_orders > 0` },
    ],
  },
  {
    pillar: 'Schema', blurb: 'A dropped or renamed column is the single most common cause of a model that stops landing. Watch INFORMATION_SCHEMA.',
    monitors: [
      { n: 11, title: 'Schema snapshot for drift', note: 'Capture the column set and types, then diff against a stored snapshot to catch drops, renames, and type changes.',
        sql: `SELECT column_name, data_type, is_nullable
FROM \`your_project.your_dataset.INFORMATION_SCHEMA.COLUMNS\`
WHERE table_name = 'orders'
ORDER BY ordinal_position;
-- diff this result against yesterday's snapshot; alert on any dropped column or type change` },
      { n: 12, title: 'Required columns present', note: 'The direct version: assert that the columns your pipeline depends on still exist. This is the dropped-updated_at case that stops a dbt model landing.',
        sql: `SELECT col AS missing_column
FROM UNNEST(['order_id','customer_id','amount','status','updated_at']) AS col
WHERE col NOT IN (
  SELECT column_name
  FROM \`your_project.your_dataset.INFORMATION_SCHEMA.COLUMNS\`
  WHERE table_name = 'orders'
);
-- alert if any missing_column returns   (a column your pipeline needs was dropped or renamed)` },
    ],
  },
]

const faq = [
  { q: 'How do I check data freshness in BigQuery?', a: 'Take the maximum of a reliable timestamp column and compare it to now: SELECT TIMESTAMP_DIFF(CURRENT_TIMESTAMP(), MAX(updated_at), MINUTE) FROM your_table, then alert when the result exceeds your expected load interval. For date-partitioned tables, query INFORMATION_SCHEMA.PARTITIONS and confirm the latest expected partition exists and has rows.' },
  { q: 'How do I find duplicate rows in BigQuery?', a: 'Group by the key that should be unique and keep the groups with more than one row: SELECT order_id, COUNT(*) FROM your_table GROUP BY order_id HAVING COUNT(*) > 1. If any rows return, you have duplicates, usually from a re-run batch or a broken merge. For whole-row duplicates, group by every column or a hash of the row.' },
  { q: 'How do I detect a schema change in BigQuery?', a: 'Query INFORMATION_SCHEMA.COLUMNS for the table to get its current column names, types, and nullability, and diff that against a stored snapshot from the last run. To assert specific columns exist, UNNEST an array of required column names and check which are not present. A dropped or renamed column is the most common reason a dbt model quietly stops landing.' },
  { q: 'What is the best way to monitor data quality in BigQuery?', a: 'Cover the five pillars: freshness, volume, quality and distribution, uniqueness and integrity, and schema. Start with freshness and volume because they catch the most incidents for the least effort, then add null-rate, duplicate, and schema checks on your most-consumed tables. Run the checks on a schedule and alert on results, rather than running them by hand.' },
  { q: 'How do I run these checks automatically?', a: 'Three common options: BigQuery scheduled queries that write results to a monitoring table you alert on; dbt tests (schema.yml plus singular SQL tests) run in your dbt job; or a data observability tool that runs the pillars as managed monitors. All three turn a one-off query into a repeating check with alerting.' },
  { q: 'Should I use SQL checks or dbt tests for BigQuery data quality?', a: 'Use both. dbt tests are ideal for checks that belong with a model in version control (not-null, unique, accepted-values, relationships) and run in CI and on every build. Standalone scheduled SQL is better for cross-table freshness and volume baselines that are not tied to a single model. The queries in this guide translate directly into dbt singular tests.' },
  { q: 'How do I monitor null rates across many columns in BigQuery?', a: 'COUNTIF is the tool: COUNTIF(col IS NULL) / COUNT(*) gives the null rate for one column, and you can compute several in one pass. For dozens of columns, generate the expression list from INFORMATION_SCHEMA.COLUMNS, or move the check into a data observability tool that profiles null rates per column automatically.' },
  { q: 'What is a good freshness or volume threshold?', a: 'Do not hardcode a guess. For freshness, base the threshold on the load interval plus a margin (a table loaded hourly might alert at 90 minutes). For volume, compare to a rolling baseline (the trailing 7 to 28 day average) and alert on a percentage deviation, so the threshold adapts as the table grows instead of firing on every busy day.' },
]

const blogPosting = {
  '@context': 'https://schema.org', '@type': 'TechArticle', headline: title, description, image: heroImage,
  datePublished: publishedDate, dateModified: modifiedDate, author: dineshJsonLdAuthor(),
  publisher: { '@type': 'Organization', name: 'AlertMend AI', logo: { '@type': 'ImageObject', url: `${SITE_URL}/logos/alertmend-logo.svg` } },
  mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
}
const faqJsonLd = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map((i) => ({ '@type': 'Question', name: i.q, acceptedAnswer: { '@type': 'Answer', text: i.a } })) }

function codeBlock(sql) { return `<div class="snippetBox">${esc(sql)}</div>` }

function authorCard() {
  return `
  <section class="authorBioCard" aria-label="About the author">
    <img src="/logos/dinesh.jpeg" alt="${esc(author.name)}" width="128" height="128" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
    <div class="authorBioFallback" aria-hidden="true">DA</div>
    <div class="authorBioContent">
      <h3>${esc(author.name)}</h3>
      <p class="authorBioRole">Cloud infrastructure and AI-driven incident automation</p>
      <div class="authorBioText">
        <p>${esc(author.name)} brings 12+ years of deep experience across cloud infrastructure and AI-driven automation, building systems that detect, diagnose, and recover from production and data incidents without waiting for a human.</p>
        <p>At AlertMend he works on data and infrastructure observability that correlates telemetry into root cause and runs governed recovery across warehouses, pipelines, VMs, and Kubernetes.</p>
      </div>
      <a class="authorBioLink" href="${author.linkedin}" target="_blank" rel="noopener noreferrer" aria-label="${esc(author.name)} on LinkedIn">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zM8.34 18V9.94H5.67V18h2.67zM7 8.76a1.55 1.55 0 1 0 0-3.1 1.55 1.55 0 0 0 0 3.1zM18.34 18v-4.42c0-2.37-1.27-3.47-2.96-3.47-1.36 0-1.97.75-2.31 1.28V9.94h-2.67V18h2.67v-4.5c0-.24.02-.48.09-.65.19-.48.63-.98 1.36-.98.96 0 1.35.73 1.35 1.8V18h2.82z"/></svg>
        <span>LinkedIn</span>
      </a>
    </div>
  </section>`
}

const pillarSections = PILLARS.map((p) => `
  <div class="pillarBlock">
    <h3 class="pillarTitle">${esc(p.pillar)}</h3>
    <p class="bodyText">${esc(p.blurb)}</p>
    ${p.monitors.map((m) => `
      <div class="monitor">
        <h4>${m.n}. ${esc(m.title)}</h4>
        <p class="monitorNote">${esc(m.note)}</p>
        ${codeBlock(m.sql)}
      </div>`).join('')}
  </div>`).join('')

const content = `
${buildCredArticleHeader(h1, publishedDate, category, author)}
<div class="proofStrip" aria-label="Article verification">
  <strong>✓ Copy-paste BigQuery Standard SQL, verified against INFORMATION_SCHEMA and the 5 data observability pillars</strong>
  <span class="dot">•</span>
  <span>Last reviewed ${modifiedDate}</span>
</div>

<article class="ec126 bqdq">
  <section class="answerPanel" id="answer">
    <div class="answerGrid">
      <div class="tenSecond">
        <span class="eyebrow">The 60-second version</span>
        <h2>Monitor BigQuery across five pillars, in plain SQL.</h2>
        <p>You do not need a tool to start. The 12 queries below cover the five things that break: <strong>freshness</strong> (is it late), <strong>volume</strong> (is the row count right), <strong>quality</strong> (are the values sane), <strong>uniqueness</strong> (any duplicates or orphans), and <strong>schema</strong> (did a column change). Start with freshness and volume, run them on a schedule, and alert on the results.</p>
        <div class="quickCommandStack" aria-label="The five pillars">
          <div class="quickCommand"><code>freshness</code><span>is the table late</span></div>
          <div class="quickCommand"><code>volume</code><span>row count vs baseline</span></div>
          <div class="quickCommand"><code>schema</code><span>did a column drop</span></div>
        </div>
      </div>
      <div class="signalCard" aria-label="A freshness check in BigQuery">
        <div class="terminalWindow">
          <div class="terminalChrome"><span></span><span></span><span></span></div>
          <div class="terminalBody">
            <div><span class="muted">--</span> is the table late?</div>
            <div>SELECT TIMESTAMP_DIFF(</div>
            <div>  CURRENT_TIMESTAMP(), MAX(updated_at), MINUTE)</div>
            <div>FROM orders;</div>
            <div class="error">mins_stale = 412   (over 6h late)</div>
          </div>
        </div>
        <div class="flowRail">
          <div class="flowNode"><strong>Check</strong><span>run the SQL</span></div>
          <div class="flowArrow">&rarr;</div>
          <div class="flowNode"><strong>Alert</strong><span>on the result</span></div>
          <div class="flowArrow">&rarr;</div>
          <div class="flowNode"><strong>Fix</strong><span>the real cause</span></div>
        </div>
      </div>
    </div>
  </section>

  <nav class="tocPills" aria-label="On this page">
    <a href="#pillars">The 5 pillars</a>
    <a href="#monitors">The 12 monitors</a>
    <a href="#schedule">Run on a schedule</a>
    <a href="#automate">From check to fix</a>
    <a href="#faq">FAQ</a>
  </nav>

  <section class="sectionBlock" id="pillars">
    <h2 class="sectionTitle">What to monitor: the five pillars in BigQuery</h2>
    <p class="bodyText">Good data quality coverage is not a hundred random assertions; it is the five categories of failure, applied to your most-consumed tables. Every monitor below maps to one of them, and each is one query you can paste into the BigQuery console right now.</p>
    <div class="comparisonTableWrap">
      <table class="comparisonTable">
        <thead><tr><th>Pillar</th><th>The question</th><th>BigQuery tools</th></tr></thead>
        <tbody>
          <tr><td data-label="Pillar"><strong>Freshness</strong></td><td data-label="Question">Is the table late?</td><td data-label="Tools"><code>MAX(ts)</code>, <code>TIMESTAMP_DIFF</code>, <code>INFORMATION_SCHEMA.PARTITIONS</code></td></tr>
          <tr><td data-label="Pillar"><strong>Volume</strong></td><td data-label="Question">Is the row count right?</td><td data-label="Tools"><code>COUNT(*)</code> vs a rolling baseline</td></tr>
          <tr><td data-label="Pillar"><strong>Quality</strong></td><td data-label="Question">Are the values sane?</td><td data-label="Tools"><code>COUNTIF</code>, range and category checks, <code>STDDEV</code></td></tr>
          <tr><td data-label="Pillar"><strong>Uniqueness</strong></td><td data-label="Question">Any duplicates or orphans?</td><td data-label="Tools"><code>GROUP BY ... HAVING COUNT(*) > 1</code>, <code>LEFT JOIN</code></td></tr>
          <tr><td data-label="Pillar"><strong>Schema</strong></td><td data-label="Question">Did a column change?</td><td data-label="Tools"><code>INFORMATION_SCHEMA.COLUMNS</code></td></tr>
        </tbody>
      </table>
    </div>
    <div class="answerBox"><strong>Note on the SQL:</strong> replace <code>your_project.your_dataset.orders</code> with your table, and <code>updated_at</code> / <code>created_at</code> with your real load and event timestamps. Each query ends with the alert condition as a comment.</div>
  </section>

  <section class="sectionBlock" id="monitors">
    <h2 class="sectionTitle">The 12 monitors</h2>
    <p class="bodyText">Grouped by pillar. Start at the top: freshness and volume catch the most incidents for the least effort.</p>
    ${pillarSections}
  </section>

  <section class="sectionBlock" id="schedule">
    <h2 class="sectionTitle">How to run these on a schedule</h2>
    <p class="bodyText">A query you run by hand is not monitoring. Turn each check into a repeating job that alerts on its result. Three common paths:</p>
    <div class="stepsGrid">
      <div class="stepCard"><span>1</span><h3>BigQuery scheduled queries</h3><p>Schedule each check and write its result to a monitoring table, then alert when a row breaches the threshold. Native to BigQuery, no extra tooling.</p></div>
      <div class="stepCard"><span>2</span><h3>dbt tests</h3><p>Put the model-bound checks (not-null, unique, accepted-values, relationships) in <code>schema.yml</code>, and the cross-table freshness and volume checks as singular SQL tests, so they run in CI and on every build.</p></div>
      <div class="stepCard"><span>3</span><h3>A data observability tool</h3><p>Run the five pillars as managed monitors with rolling baselines and alerting, so you are not hand-maintaining a dozen scheduled queries and their thresholds.</p></div>
    </div>
    <div class="answerBox"><strong>One rule that saves you later:</strong> alert on the <em>symptom that reaches a consumer</em> (a stale table, a null spike on a dashboard column), not on every internal metric. Alerting on everything is how teams end up ignoring the alerts.</div>
  </section>

  <section class="sectionBlock" id="automate">
    <h2 class="sectionTitle">From check to fix: closing the loop</h2>
    <p class="bodyText">SQL monitors tell you a table is late or a column dropped. The slow part in production is what comes next: figuring out <em>why</em>, at 2 a.m., across the pipeline and the platform under it. That is the gap AlertMend closes.</p>
    <p class="bodyText"><strong>AlertMend Data Observability</strong> runs these five pillars as managed monitors against BigQuery (with dbt and Snowflake context too), so you are not maintaining a dozen scheduled queries by hand. When a check fires, it produces an <strong>evidence-backed root cause</strong> (a product target of about 15 seconds at p50) that points at the real trigger, for example a dbt model that stopped landing after a deploy dropped <code>updated_at</code>, which is monitor 12 above. From there it proposes a <strong>governed, recommend-first fix</strong> that a human approves, with full audit, never a silent auto-change.</p>
    <div class="answerBox"><strong>The honest scope:</strong> AlertMend watches the data and the services and infrastructure beneath your pipeline, and supplies operational evidence (the checks, data SLAs, and downstream lineage). It is proven today on infrastructure incidents (Polymer Search, WareFlex, Decklar, AIVOS) and is expanding to data teams; for regulated estates the root-cause analysis can run self-hosted on your own model inside your network.</p>
    <div class="automationCta">
      <p><strong>Want the five pillars monitored for you, with root cause and a recommended fix when one fires?</strong> Bring one BigQuery table that keeps breaking and we will map the checks, the alerting, and the first recommend-first runbook.</p>
      <a class="ctaButton ctaButtonPrimary" href="${calendly}&intent=data-observability" target="_blank" rel="noopener noreferrer">Book a free consultation &rarr;</a>
    </div>
  </section>

  <section class="sectionBlock" id="sources">
    <h2 class="sectionTitle">References</h2>
    <ol class="sourceList">
      <li><a href="https://cloud.google.com/bigquery/docs/information-schema-columns" target="_blank" rel="noopener noreferrer">BigQuery docs: INFORMATION_SCHEMA.COLUMNS</a></li>
      <li><a href="https://cloud.google.com/bigquery/docs/information-schema-partitions" target="_blank" rel="noopener noreferrer">BigQuery docs: INFORMATION_SCHEMA.PARTITIONS</a></li>
      <li><a href="https://cloud.google.com/bigquery/docs/scheduling-queries" target="_blank" rel="noopener noreferrer">BigQuery docs: scheduling queries</a></li>
      <li><a href="/blog/snowflake-data-quality-checks">AlertMend: Snowflake data quality checks</a></li>
      <li><a href="/blog/data-quality-check-types">AlertMend: 10 types of data quality checks with SQL</a></li>
    </ol>
  </section>

  <section class="sectionBlock" id="faq">
    <h2 class="sectionTitle">BigQuery data quality FAQ</h2>
    <div class="faqList">
    ${faq.map((item, index) => `
      <div class="faqItem">
        <button type="button" class="faqQuestion" data-faq-toggle aria-expanded="${index === 0 ? 'true' : 'false'}">
          ${esc(item.q)}
          <svg class="faqChevron${index === 0 ? ' faqChevronOpen' : ''}" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
        </button>
        <div class="faqAnswer${index === 0 ? '' : ' hidden'}">${esc(item.a)}</div>
      </div>
    `).join('')}
    </div>
  </section>

  <section class="ctaBox">
    <h2>Stop hand-maintaining a dozen scheduled queries.</h2>
    <p>AlertMend runs freshness, volume, schema, quality, and lineage as managed monitors on BigQuery, gives evidence-backed root cause when a check fires, and routes a recommend-first fix, in one workspace that also watches the infrastructure beneath your pipelines.</p>
    <div class="ctaButtons">
      <a class="ctaButton ctaButtonPrimary" href="${calendly}" target="_blank" rel="noopener noreferrer">Book a free consultation</a>
      <a class="ctaButton ctaButtonSecondary" href="/blog/snowflake-data-quality-checks">Snowflake checks &rarr;</a>
    </div>
  </section>
  ${authorCard()}
</article>`

const extraCss = `
.pillarBlock{margin:1.4rem 0 1.6rem;}
.pillarTitle{font-size:1.15rem;color:var(--am-accent,#7c3aed);border-left:3px solid var(--am-accent,#7c3aed);padding-left:12px;margin:1.4rem 0 .5rem;}
.monitor{margin:1rem 0 1.2rem;}
.monitor h4{margin:0 0 .25rem;font-size:1.02rem;color:#18181b;}
.monitorNote{margin:0 0 .5rem;color:#52525b;font-size:.92rem;line-height:1.6;}
`

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)} | AlertMend AI</title>
  <meta name="description" content="${esc(description)}">
  <meta name="keywords" content="${esc(keywords)}">
  <meta name="author" content="${esc(author.name)}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
  <link rel="canonical" href="${canonical}">
  <link rel="icon" type="image/svg+xml" href="/logos/alertmend-logo.svg">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${canonical}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:image" content="${heroImage}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${heroImage}">
  <script type="application/ld+json">${JSON.stringify(blogPosting)}</script>
  <script type="application/ld+json">${JSON.stringify(faqJsonLd)}</script>
  <link rel="stylesheet" href="${styleHref}">
  <style>${CHROME_INLINE_CSS}${AUTHOR_CRED_CSS}${extraCss}</style>
</head>
<body>
${buildNavHtml(slug, calendly)}
  <div class="main-container">
    <div class="content-wrapper">
      <div class="main-col">
        ${content}
        <div class="promo">
          <p>Ready to turn data quality checks into resolved incidents, not just alerts?</p>
          <p>See how AlertMend AI monitors your warehouse across all five pillars, finds root cause, and automates safe remediation. <a href="${calendly}" target="_blank" rel="noopener noreferrer">Book a demo. &rarr;</a></p>
        </div>
      </div>
      ${buildSidebarHtml(related, title)}
    </div>
  </div>
  <script src="${scriptHref}"></script>
  <script>${BLOG_SIGNUP_HANDLER_JS}</script>
</body>
</html>`

const heroSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"><defs><linearGradient id="hg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0b132b"/><stop offset="1" stop-color="#12244a"/></linearGradient></defs><rect width="1200" height="630" fill="url(#hg)"/><g transform="translate(80,80)"><circle cx="22" cy="22" r="22" fill="#4285f4"/><text x="22" y="30" font-size="22" font-weight="800" fill="#fff" text-anchor="middle">A</text><text x="56" y="30" font-size="24" font-weight="700" fill="#fff">AlertMend</text><text x="228" y="30" font-size="18" fill="#8fb4f0">· data observability</text></g><text x="80" y="244" font-size="58" font-weight="800" fill="#fff">BigQuery Data Quality</text><text x="80" y="308" font-size="30" font-weight="700" fill="#8ab4f8">12 copy-paste SQL monitors.</text><g font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="19"><rect x="80" y="360" width="1040" height="158" rx="14" fill="#0e1a33" stroke="#26406e"/><text x="106" y="398" fill="#8ab4f8">freshness</text><text x="360" y="398" fill="#dce7fb">is the table late?</text><text x="106" y="434" fill="#8ab4f8">volume + quality</text><text x="360" y="434" fill="#dce7fb">row counts, nulls, duplicates</text><text x="106" y="472" fill="#8ab4f8">schema</text><text x="360" y="472" fill="#dce7fb">catch the dropped column that breaks dbt</text></g><text x="80" y="566" font-size="19" fill="#8fb4f0">alertmend.io · the 5 pillars, in plain BigQuery SQL</text></svg>\n`

const assetDir = path.join(root, 'public/assets', slug)
fs.mkdirSync(assetDir, { recursive: true })
fs.writeFileSync(path.join(assetDir, 'hero.svg'), heroSvg)

fs.writeFileSync(path.join(root, 'public/blog', `${slug}.md`), `---
title: "${title}"
excerpt: "${description}"
date: "${publishedDate}"
dateModified: "${modifiedDate}"
category: "${category}"
author: "${author.name}"
keywords: "${keywords}"
---

This post is published as a standalone page at [/blog/${slug}](/blog/${slug}).
`)

writeStaticBlogOutputs(slug, html)
const tl = title.length + 15
console.log(`✓ ${slug}  title+suffix ${tl}${tl < 30 || tl > 60 ? ' [LEN!]' : ''}  desc ${description.length}  monitors ${PILLARS.reduce((a, p) => a + p.monitors.length, 0)}  faqs ${faq.length}`)
