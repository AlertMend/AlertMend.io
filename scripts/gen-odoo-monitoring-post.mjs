/**
 * Evidence-led Odoo monitoring and auto-recovery guide.
 * Sources focus on Odoo 19, PostgreSQL, Docker, and AlertMend's documented
 * VM/API monitoring and governed runbook capabilities.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import {
  SITE_URL, esc, CHROME_INLINE_CSS, buildNavHtml, buildSidebarHtml,
  buildCredArticleHeader, buildAuthorCredLine, calendlyUrl, signupUrl, AUTHOR_CRED_CSS,
} from './static-blog-shared.mjs'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const ODOO_LOGO = (() => { try { return (fs.readFileSync(path.join(root, 'public/logos/brand/odoo.svg'), 'utf8').match(/d="([^"]+)"/) || [null, ''])[1] } catch { return '' } })()
const slug = 'odoo-monitoring'
const date = '2026-07-06'
const title = 'Odoo Monitoring and Auto-Recovery'
const h1 = 'Odoo Monitoring: Keep Odoo Running with Health Checks and Auto-Recovery'
const excerpt = 'Monitor Odoo, PostgreSQL, workers, cron jobs, storage, and proxies, then safely auto-recover common failures with checks, runbooks, and verification.'
const canonical = `${SITE_URL}/blog/${slug}`
const image = `${SITE_URL}/assets/${slug}/hero.png`
const alertmendLogo = `data:image/svg+xml;base64,${fs.readFileSync(path.join(root, 'public/alertmend-logo.svg')).toString('base64')}`
const calendly = calendlyUrl(slug)
const signup = signupUrl(slug)

const related = [
  { slug: 'url-monitoring-automated-fixes', title: 'URL Monitoring with Automated Fixes' },
  { slug: '503-no-healthy-upstream', title: '503 No Healthy Upstream: Fix Guide' },
  { slug: 'make-error-127', title: 'Make Error 127: Command Not Found' },
  { slug: 'best-1-click-logging-and-metrics-tools', title: 'Best Logging and Metrics Tools' },
  { slug: 'datadog-alternatives', title: 'Best Datadog Alternatives' },
  { slug: 'pagerduty-alternatives', title: 'Best PagerDuty Alternatives' },
]

const faqItems = [
  ['What is the best Odoo monitoring tool?', 'The best choice depends on the failure you need to catch. An Odoo module can expose cron and application context, an external uptime monitor can detect a complete outage, and infrastructure monitoring can explain host or PostgreSQL failures. For self-hosted Odoo, the strongest design combines outside-in checks with runtime evidence and governed recovery instead of relying on one green dashboard.'],
  ['What should I monitor in Odoo?', 'Monitor the customer journey, reverse proxy, Odoo process and workers, PostgreSQL readiness and saturation, CPU and memory, disk and inode capacity, filestore access, cron freshness, certificate expiry, error rates, and backup restorability. A green process alone does not prove that users can log in or complete business operations.'],
  ['Why is my Odoo instance slow?', 'Odoo slowness usually traces to the database or the workers: slow PostgreSQL queries and missing indexes, autovacuum falling behind, too few workers for the traffic, or workers being recycled under memory pressure. Start by checking PostgreSQL pg_stat_activity for long-running queries, your worker count against concurrent users, and host CPU and memory. A slow page with healthy workers almost always points at the database.'],
  ['How many workers should I configure in Odoo?', 'A common starting point is (CPU cores x 2) + 1 HTTP workers, with cron workers set separately via max_cron_threads. Each worker serves one request at a time, so too few workers make requests queue under load, while too many exhaust RAM and PostgreSQL connections. Tune limit_memory_hard, limit_time_cpu, and limit_request alongside the worker count.'],
  ['How do I fix "FATAL: sorry, too many clients already" in Odoo?', 'That PostgreSQL error means Odoo opened more connections than max_connections allows, usually because HTTP workers, cron, and longpolling together exceed the limit. Reduce the Odoo worker count or raise PostgreSQL max_connections, and for high worker counts put a pooler such as PgBouncer in front of the database. Size max_connections with headroom, since each worker can hold more than one connection.'],
  ['Why is Odoo returning a 502 or 503 error?', 'A 502 or 503 in front of Odoo almost always means the reverse proxy has no healthy backend: the Odoo service is down, workers are crash-looping on the memory limit, or the instance is overloaded. Confirm the Odoo service is running, check the log for workers killed at limit_memory_hard, and verify nginx is proxying to the correct ports (8069 for web, 8072 for longpolling).'],
  ['Where are Odoo log files located?', 'Odoo logs to stdout by default, or to the file set by logfile in odoo.conf, commonly /var/log/odoo/odoo-server.log on a package install. In Docker, read them with docker logs on the Odoo container. Raise log_level to info or debug in odoo.conf when you need more detail while diagnosing an issue.'],
  ['Why is Odoo live chat or longpolling not working?', 'Discuss, notifications, and live chat depend on the longpolling and websocket port, 8072 by default. When they break, the reverse proxy is usually not forwarding /longpolling and /websocket to port 8072, or the longpolling worker is not running. Check the nginx location blocks and confirm Odoo is in multiprocessing mode with workers enabled, since longpolling needs it.'],
  ['Why does Odoo memory usage keep growing?', 'Odoo workers accumulate memory as they serve requests, which is why limit_memory_soft and limit_memory_hard exist to recycle a worker before it grows too large. A steady climb usually points at a heavy report, a large import, or a leaking custom module. If workers are being killed at limit_memory_hard under normal load, raise the limits or add workers and RAM.'],
  ['How do I restart the Odoo service?', 'On a systemd install use sudo systemctl restart odoo, matching the service name you configured, and in Docker use docker restart or docker compose restart on the Odoo service. After a restart, wait for workers to become ready and check the login page rather than assuming an up process means users can work. AlertMend can run this as an approved runbook and verify the user-facing endpoint before closing the incident.'],
  ['How do I monitor Odoo POS?', 'Odoo POS runs partly in the browser and syncs orders back to the server, so monitor the POS and web workers, the longpolling endpoint, and the payment terminal integration, and alert on failed or delayed order sync. In-store sales can stop when the POS backend or its sync is degraded even while the main website looks healthy.'],
  ['How do I monitor Odoo e-commerce and website?', 'Check the storefront and checkout URLs from outside, the product and stock sync between website and inventory, the longpolling updates, and payment gateway callbacks. A working homepage does not prove customers can add to cart, pay, and have stock decrement correctly, so test the full purchase path, not just uptime.'],
  ['Does Odoo have a built-in health-check endpoint?', 'Do not assume every supported Odoo deployment exposes a database-aware health endpoint. A reliable design uses a lightweight HTTP check, a PostgreSQL readiness check, and, when practical, a small custom authenticated or application-specific probe that verifies the business path you actually depend on.'],
  ['Can AlertMend restart Odoo automatically?', 'Yes, on connected VMs or containers where you configure an approved runbook. The safe pattern is to confirm the failure, check PostgreSQL and disk state, restart only the affected Odoo service, wait for readiness, and verify the user-facing endpoint before closing the incident.'],
  ['Can every Odoo failure be auto-fixed?', 'No. Process crashes, some worker hangs, dependency startup races, and controlled disk housekeeping are often good automation candidates. Database corruption, failed migrations, unknown custom-module errors, and destructive storage operations should stop for human review.'],
  ['How do I monitor Odoo in Docker?', 'Add health checks for PostgreSQL and Odoo, persist both PostgreSQL data and the Odoo data directory, use service_healthy dependency conditions, set a bounded restart policy, and monitor the public URL independently of container state.'],
  ['How do I monitor Odoo cron jobs?', 'Track the expected completion time of critical scheduled actions, alert on missed or repeatedly failing runs, and inspect Odoo logs. Odoo 19 documents that repeated cron errors can cause executions to be skipped and eventually the scheduled action to be deactivated.'],
  ['Is the guide limited to Odoo 19?', 'The architecture and monitoring model also apply to many self-hosted Odoo 17 and 18 deployments, but command-line defaults and behavior can differ. Verify every limit and option against the documentation for your deployed major version.'],
  ['Does this cover Odoo Online and Odoo.sh?', 'The deepest host, process, PostgreSQL, and runbook controls apply to self-hosted Odoo on VMs, Docker, or Kubernetes. Odoo Online and Odoo.sh abstract more of the infrastructure, so external journey checks, application signals, and escalation remain useful while host-level remediation may not be available.'],
]

const sources = [
  ['Odoo 19 system configuration', 'https://www.odoo.com/documentation/19.0/administration/on_premise/deploy.html'],
  ['Odoo 19 command-line reference', 'https://www.odoo.com/documentation/19.0/developer/reference/cli.html'],
  ['Odoo 19 source installation', 'https://www.odoo.com/documentation/19.0/administration/on_premise/source.html'],
  ['Odoo 19 bugfix updates', 'https://www.odoo.com/documentation/19.0/administration/on_premise/update.html'],
  ['Odoo 19 scheduled actions', 'https://www.odoo.com/documentation/19.0/developer/reference/backend/actions.html'],
  ['Odoo 19 backup workflow', 'https://www.odoo.com/documentation/19.0/administration/odoo_sh/getting_started/create.html'],
  ['Official Odoo Docker image', 'https://hub.docker.com/_/odoo/'],
  ['PostgreSQL monitoring activity', 'https://www.postgresql.org/docs/current/monitoring.html'],
  ['PostgreSQL pg_isready', 'https://www.postgresql.org/docs/current/app-pg-isready.html'],
  ['Docker Compose startup order and health checks', 'https://docs.docker.com/compose/how-tos/startup-order/'],
]

const customCss = `
  .odooBlog { --odoo: #714b67; --odoo-soft: #f7f3f6; }
  .brandChip { display:inline-flex; align-items:center; gap:9px; margin:0 0 1.1rem; padding:6px 15px 6px 11px; border:1px solid #e4e4e7; border-radius:999px; background:#fff; }
  .brandChip svg { display:block; flex:0 0 auto; }
  .brandChip span { font-size:.82rem; font-weight:600; color:#52525b; }
  .article-header--cred { margin-bottom:1.5rem; }
  .article-header--cred .authorCredLine--top { margin:0 0 .45rem; }
  .article-header--cred .article-meta { font-size:.875rem; color:#6b7280; margin:0; }
  .authorCredLine { font-size:.875rem; line-height:1.55; color:#71717a; }
  .authorCredLine a, .authorCredLine .authorCredName { color:#3f3f46; font-weight:600; text-decoration:none; }
  .authorCredLine a:hover { color:#6d28d9; }
  .proofBar { display:flex; flex-wrap:wrap; gap:8px 16px; align-items:center; margin:-.75rem 0 1.5rem; color:#52525b; font-size:.82rem; }
  .proofBar .checked { display:inline-flex; align-items:center; gap:6px; color:#047857; font-weight:700; }
  .proofBar .dot { color:#d4d4d8; }
  .answerCard { margin:1.25rem 0 2rem; padding:22px; border:1px solid #d4d4d8; border-radius:10px; background:#fff; box-shadow:0 8px 28px rgba(9,9,11,.05); }
  .answerEyebrow { color:#6d28d9; font-size:.72rem; font-weight:800; letter-spacing:.1em; text-transform:uppercase; }
  .answerCard h2 { margin:6px 0 10px; color:#09090b; font-size:1.32rem; line-height:1.25; letter-spacing:-.02em; }
  .answerCard p { margin:0; color:#3f3f46; line-height:1.72; }
  .answerCard strong { color:#18181b; }
  .coverageNote { margin:1.5rem 0; padding:18px 20px; border-left:3px solid #7c3aed; border-radius:0 8px 8px 0; background:#f5f3ff; color:#3f3f46; }
  .coverageNote strong { color:#18181b; }
  .coverageFormula { display:block; margin-top:10px; padding:10px 12px; border:1px solid #ddd6fe; border-radius:6px; background:#fff; color:#5b21b6; font:600 .86rem ui-monospace,SFMono-Regular,Menlo,monospace; }
  .stackFigure { margin:1.5rem 0 2rem; }
  .stackFigure svg { width:100%; height:auto; display:block; border:1px solid #e4e4e7; border-radius:10px; background:#fafafa; }
  .stackFigure figcaption { margin-top:9px; color:#71717a; font-size:.78rem; line-height:1.55; }
  .monitorGrid { display:grid; grid-template-columns:1fr; gap:12px; margin:1.25rem 0 2rem; }
  @media (min-width:720px) { .monitorGrid { grid-template-columns:repeat(2,1fr); } }
  .monitorCard { padding:19px; border:1px solid #e4e4e7; border-radius:9px; background:#fff; }
  .monitorTop { display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:8px; }
  .monitorCard h3 { margin:0; color:#18181b; font-size:1rem; }
  .signalBadge { flex:0 0 auto; padding:3px 7px; border-radius:999px; background:#f4f4f5; color:#52525b; font-size:.68rem; font-weight:800; letter-spacing:.05em; text-transform:uppercase; }
  .monitorCard p { margin:0; color:#52525b; font-size:.87rem; line-height:1.62; }
  .monitorCard a, .deployPanel a { color:#6d28d9; font-weight:650; text-decoration:none; }
  .monitorCard a:hover, .deployPanel a:hover { text-decoration:underline; }
  .monitorCard code { padding:.08em .3em; border-radius:4px; background:#f4f4f5; font-size:.86em; }
  .deployChooser { margin:1.4rem 0 2rem; border:1px solid #d4d4d8; border-radius:10px; overflow:hidden; background:#fff; }
  .deployTabs { display:flex; gap:0; padding:8px; border-bottom:1px solid #e4e4e7; background:#fafafa; overflow-x:auto; }
  .deployTab { appearance:none; border:0; border-radius:6px; padding:9px 14px; background:transparent; color:#52525b; font:inherit; font-size:.83rem; font-weight:700; cursor:pointer; white-space:nowrap; }
  .deployTab[aria-selected="true"] { background:#18181b; color:#fff; }
  .deployPanel { padding:20px; }
  .deployPanel h3 { margin:0 0 7px; color:#18181b; font-size:1rem; }
  .deployPanel p { margin:0 0 14px; color:#52525b; font-size:.88rem; line-height:1.65; }
  .command { position:relative; margin:12px 0; padding:16px 52px 16px 16px; border-radius:8px; background:#18181b; color:#e4e4e7; overflow:auto; }
  .command code { white-space:pre; font:500 .82rem/1.65 ui-monospace,SFMono-Regular,Menlo,monospace; }
  .copyCode { position:absolute; top:10px; right:10px; border:1px solid #3f3f46; border-radius:5px; padding:5px 8px; background:#27272a; color:#d4d4d8; font-size:.7rem; cursor:pointer; }
  .recoveryTable td:nth-child(3) { min-width:155px; }
  .autoSafe, .autoGate, .autoHuman { display:inline-flex; align-items:center; padding:3px 7px; border-radius:999px; font-size:.7rem; font-weight:800; white-space:nowrap; }
  .autoSafe { color:#047857; background:#ecfdf5; }
  .autoGate { color:#92400e; background:#fffbeb; }
  .autoHuman { color:#991b1b; background:#fef2f2; }
  .runbook { margin:1.5rem 0 2rem; padding:22px; border:1px solid #c4b5fd; border-radius:10px; background:linear-gradient(135deg,#faf8ff,#fff); }
  .runbookSteps { display:grid; grid-template-columns:1fr; gap:0; list-style:none; margin:16px 0 0; padding:0; }
  @media (min-width:720px) { .runbookSteps { grid-template-columns:repeat(5,1fr); } }
  .runbookSteps li { position:relative; padding:15px 12px; border:1px solid #e4e4e7; background:#fff; }
  .runbookSteps li:first-child { border-radius:7px 7px 0 0; }
  .runbookSteps li:last-child { border-radius:0 0 7px 7px; }
  @media (min-width:720px) {
    .runbookSteps li + li { border-left:0; }
    .runbookSteps li:first-child { border-radius:7px 0 0 7px; }
    .runbookSteps li:last-child { border-radius:0 7px 7px 0; }
  }
  .runbookNum { display:block; color:#7c3aed; font-size:.7rem; font-weight:900; letter-spacing:.08em; }
  .runbookSteps strong { display:block; margin:3px 0; color:#18181b; font-size:.85rem; }
  .runbookSteps span:last-child { color:#71717a; font-size:.73rem; line-height:1.45; }
  .guardrails { display:grid; grid-template-columns:1fr; gap:10px; margin:1.2rem 0 2rem; }
  @media (min-width:720px) { .guardrails { grid-template-columns:repeat(3,1fr); } }
  .guardrail { padding:17px; border:1px solid #e4e4e7; border-radius:8px; background:#fafafa; }
  .guardrail strong { display:block; margin-bottom:5px; color:#18181b; font-size:.88rem; }
  .guardrail p { margin:0; color:#52525b; font-size:.8rem; line-height:1.55; }
  .finalCta { margin:2.5rem 0 1.5rem; padding:28px; border-radius:10px; background:#09090b; color:#fff; }
  .finalCta h2 { margin:0 0 8px; color:#fff; font-size:1.5rem; }
  .finalCta p { margin:0 0 18px; color:#c4c4c8; line-height:1.65; }
  .ctaActions { display:flex; flex-wrap:wrap; gap:10px; }
  .ctaPrimary, .ctaSecondary { display:inline-flex; padding:10px 15px; border-radius:6px; font-size:.86rem; font-weight:800; text-decoration:none; }
  .ctaPrimary { background:#fff; color:#09090b; }
  .ctaSecondary { border:1px solid #3f3f46; color:#fff; }
  .sourceIntro { color:#71717a; font-size:.82rem; }
  @media (prefers-reduced-motion:no-preference) {
    .odooFlow .flowLine { stroke-dasharray:8 7; animation:odoo-flow .9s linear infinite; }
    .odooFlow .heartbeat { transform-box:fill-box; transform-origin:center; animation:odoo-pulse 2.2s ease-in-out infinite; }
    .odooFlow .recovered { animation:odoo-ok 3.8s ease-in-out infinite; }
    @keyframes odoo-flow { to { stroke-dashoffset:-15; } }
    @keyframes odoo-pulse { 0%,100% { transform:scale(1); } 50% { transform:scale(1.045); } }
    @keyframes odoo-ok { 0%,35% { opacity:.28; } 55%,100% { opacity:1; } }
  }
  @media (max-width:560px) {
    .answerCard, .runbook { padding:17px; }
    .deployPanel { padding:16px; }
    .proofBar .dot { display:none; }
  }
`

const scriptJs = `(function(){
  document.querySelectorAll('[data-faq-toggle]').forEach(function(button){
    button.addEventListener('click',function(){
      var item=button.closest('.faqItem'); var answer=item&&item.querySelector('.faqAnswer');
      var open=button.getAttribute('aria-expanded')==='true';
      button.setAttribute('aria-expanded',open?'false':'true');
      if(answer) answer.classList.toggle('hidden',open);
      var chevron=button.querySelector('.faqChevron');
      if(chevron) chevron.classList.toggle('faqChevronOpen',!open);
    });
  });
  var tabs=[].slice.call(document.querySelectorAll('[data-deploy-tab]'));
  tabs.forEach(function(tab){
    tab.addEventListener('click',function(){
      var target=tab.getAttribute('data-deploy-tab');
      tabs.forEach(function(t){ t.setAttribute('aria-selected',String(t===tab)); });
      document.querySelectorAll('[data-deploy-panel]').forEach(function(panel){
        panel.hidden=panel.getAttribute('data-deploy-panel')!==target;
      });
    });
  });
  document.querySelectorAll('.command').forEach(function(block){
    var button=block.querySelector('.copyCode'); var code=block.querySelector('code');
    if(!button||!code) return;
    button.addEventListener('click',async function(){
      try { await navigator.clipboard.writeText(code.textContent||''); button.textContent='Copied'; setTimeout(function(){button.textContent='Copy';},1400); }
      catch(e) { button.textContent='Select'; }
    });
  });
})();`

function faqHtml() {
  return `<div class="faqList">${faqItems.map(([question, answer], index) => `
        <div class="faqItem">
          <button type="button" class="faqQuestion" data-faq-toggle aria-expanded="${index === 0 ? 'true' : 'false'}">${esc(question)}<svg class="faqChevron${index === 0 ? ' faqChevronOpen' : ''}" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></button>
          <div class="faqAnswer${index === 0 ? '' : ' hidden'}">${esc(answer)}</div>
        </div>`).join('')}
      </div>`
}

function recoveryFlowSvg() {
  return `<figure class="stackFigure">
        <svg class="odooFlow" viewBox="0 0 960 330" role="img" aria-label="AlertMend monitors the Odoo request path, diagnoses a failure, runs an approved recovery, and verifies service health.">
          <defs>
            <marker id="odooArrow" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#7c3aed"/></marker>
            <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="5" stdDeviation="7" flood-color="#18181b" flood-opacity=".08"/></filter>
          </defs>
          <text x="42" y="36" fill="#71717a" font-size="12" font-weight="800" letter-spacing="1.3">THE ODOO REQUEST PATH</text>
          <g filter="url(#softShadow)">
            <rect x="42" y="62" width="150" height="76" rx="10" fill="#fff" stroke="#e4e4e7"/>
            <text x="117" y="92" text-anchor="middle" fill="#18181b" font-size="15" font-weight="800">Nginx / TLS</text>
            <text x="117" y="114" text-anchor="middle" fill="#71717a" font-size="11">proxy + websocket</text>
            <rect x="222" y="62" width="150" height="76" rx="10" fill="#fff" stroke="#d8b4fe"/>
            <text x="297" y="92" text-anchor="middle" fill="#714b67" font-size="17" font-weight="850">Odoo</text>
            <text x="297" y="114" text-anchor="middle" fill="#71717a" font-size="11">HTTP + cron workers</text>
            <rect x="402" y="62" width="150" height="76" rx="10" fill="#fff" stroke="#e4e4e7"/>
            <text x="477" y="92" text-anchor="middle" fill="#18181b" font-size="15" font-weight="800">PostgreSQL</text>
            <text x="477" y="114" text-anchor="middle" fill="#71717a" font-size="11">queries + connections</text>
            <rect x="582" y="62" width="150" height="76" rx="10" fill="#fff" stroke="#e4e4e7"/>
            <text x="657" y="92" text-anchor="middle" fill="#18181b" font-size="15" font-weight="800">Filestore</text>
            <text x="657" y="114" text-anchor="middle" fill="#71717a" font-size="11">attachments + reports</text>
          </g>
          <line class="flowLine" x1="194" y1="100" x2="218" y2="100" stroke="#7c3aed" stroke-width="2.5" marker-end="url(#odooArrow)"/>
          <line class="flowLine" x1="374" y1="100" x2="398" y2="100" stroke="#7c3aed" stroke-width="2.5" marker-end="url(#odooArrow)"/>
          <line class="flowLine" x1="554" y1="100" x2="578" y2="100" stroke="#7c3aed" stroke-width="2.5" marker-end="url(#odooArrow)"/>
          <g class="heartbeat" filter="url(#softShadow)">
            <rect x="760" y="54" width="160" height="92" rx="12" fill="#faf5ff" stroke="#c4b5fd"/>
            <circle cx="790" cy="82" r="17" fill="#fff"/>
            <image href="${alertmendLogo}" x="779" y="69" width="22" height="26" preserveAspectRatio="xMidYMid meet"/>
            <text x="816" y="87" fill="#5b21b6" font-size="15" font-weight="800">AlertMend</text>
            <text x="840" y="116" text-anchor="middle" fill="#6d28d9" font-size="11">signals + dependency context</text>
          </g>
          <path class="flowLine" d="M840 150 C840 188 710 180 620 207" fill="none" stroke="#7c3aed" stroke-width="2.5" marker-end="url(#odooArrow)"/>
          <g filter="url(#softShadow)">
            <rect x="68" y="210" width="170" height="72" rx="10" fill="#fff" stroke="#e4e4e7"/>
            <text x="153" y="238" text-anchor="middle" fill="#18181b" font-size="14" font-weight="800">1 · Confirm</text>
            <text x="153" y="260" text-anchor="middle" fill="#71717a" font-size="11">repeat the failing check</text>
            <rect x="250" y="210" width="170" height="72" rx="10" fill="#fff" stroke="#e4e4e7"/>
            <text x="335" y="238" text-anchor="middle" fill="#18181b" font-size="14" font-weight="800">2 · Diagnose</text>
            <text x="335" y="260" text-anchor="middle" fill="#71717a" font-size="11">DB, disk, memory, logs</text>
            <rect x="432" y="210" width="170" height="72" rx="10" fill="#fff" stroke="#e4e4e7"/>
            <text x="517" y="238" text-anchor="middle" fill="#18181b" font-size="14" font-weight="800">3 · Recover</text>
            <text x="517" y="260" text-anchor="middle" fill="#71717a" font-size="11">approved narrow action</text>
            <rect class="recovered" x="614" y="210" width="278" height="72" rx="10" fill="#ecfdf5" stroke="#86efac"/>
            <text x="753" y="238" text-anchor="middle" fill="#047857" font-size="14" font-weight="800">4 · Verify before closing</text>
            <text x="753" y="260" text-anchor="middle" fill="#047857" font-size="11">HTTP + database + business path healthy</text>
          </g>
          <line class="flowLine" x1="240" y1="246" x2="246" y2="246" stroke="#7c3aed" stroke-width="2.5" marker-end="url(#odooArrow)"/>
          <line class="flowLine" x1="422" y1="246" x2="428" y2="246" stroke="#7c3aed" stroke-width="2.5" marker-end="url(#odooArrow)"/>
          <line class="flowLine" x1="604" y1="246" x2="610" y2="246" stroke="#16a34a" stroke-width="2.5" marker-end="url(#odooArrow)"/>
          <text x="42" y="315" fill="#71717a" font-size="11">A restart is not a diagnosis. Recovery is complete only after the customer-facing path works again.</text>
        </svg>
        <figcaption>AlertMend can collect the infrastructure and endpoint evidence, execute a policy-approved runbook, and test the service again. The exact actions depend on your deployment and permissions.</figcaption>
      </figure>`
}

function heroSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <defs><linearGradient id="hg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0b0b14"/><stop offset="1" stop-color="#241b4d"/></linearGradient></defs>
  <rect width="1200" height="630" fill="url(#hg)"/>
  <g transform="translate(80,76)"><circle cx="25" cy="25" r="25" fill="#fff"/><image href="${alertmendLogo}" x="8" y="6" width="34" height="38" preserveAspectRatio="xMidYMid meet"/><text x="64" y="33" font-size="24" font-weight="750" fill="#fff">AlertMend</text><text x="236" y="33" font-size="18" fill="#8b82b8">· Odoo reliability guide</text></g>
  <text x="80" y="230" font-size="68" font-weight="850" fill="#fff">Odoo Monitoring</text>
  <text x="80" y="302" font-size="54" font-weight="800" fill="#fff">that detects, fixes, and verifies</text>
  <text x="80" y="368" font-size="27" fill="#c4b5fd">Odoo · PostgreSQL · workers · cron · proxy · storage</text>
  <g font-size="20" font-weight="700">
    <rect x="80" y="450" width="260" height="50" rx="25" fill="#12111f" stroke="#312b57"/><text x="210" y="481" fill="#e9e3ff" text-anchor="middle">Layered health checks</text>
    <rect x="370" y="450" width="240" height="50" rx="25" fill="#12111f" stroke="#312b57"/><text x="490" y="481" fill="#e9e3ff" text-anchor="middle">Safe auto-recovery</text>
    <rect x="640" y="450" width="286" height="50" rx="25" fill="#12111f" stroke="#312b57"/><text x="783" y="481" fill="#e9e3ff" text-anchor="middle">Evidence-backed runbooks</text>
  </g>
  <text x="80" y="574" font-size="20" fill="#8b82b8">alertmend.io · Keep the business system running, not merely the process</text>
</svg>\n`
}

const blogPosting = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: title,
  description: excerpt,
  image,
  datePublished: date,
  dateModified: date,
  author: { '@type': 'Person', name: 'Dinesh Agrawal', jobTitle: 'Co-Founder at AlertMend.io', url: 'https://www.linkedin.com/in/dineshagrawal85/', sameAs: ['https://www.linkedin.com/in/dineshagrawal85/'] },
  publisher: {
    '@type': 'Organization',
    name: 'AlertMend AI',
    logo: { '@type': 'ImageObject', url: `${SITE_URL}/logos/alertmend-logo.svg` },
  },
  mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
  proficiencyLevel: 'Intermediate',
  dependencies: 'Odoo 17–19 self-hosted, PostgreSQL, and a reverse proxy or container platform',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map(([question, answer]) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: { '@type': 'Answer', text: answer },
  })),
}

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)} | AlertMend AI</title>
  <meta name="description" content="${esc(excerpt)}">
  <meta name="keywords" content="Odoo monitoring, Odoo health check, Odoo uptime monitoring, Odoo auto recovery, Odoo PostgreSQL monitoring, Odoo workers, Odoo cron monitoring">
  <meta name="author" content="Dinesh Agrawal">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <link rel="canonical" href="${canonical}">
  <link rel="icon" type="image/svg+xml" href="/logos/alertmend-logo.svg">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${canonical}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(excerpt)}">
  <meta property="og:image" content="${image}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(excerpt)}">
  <meta name="twitter:image" content="${image}">
  <script type="application/ld+json">${JSON.stringify(blogPosting)}</script>
  <script type="application/ld+json">${JSON.stringify(faqSchema)}</script>
  <link rel="stylesheet" href="/assets/make-error-127/styles.css">
  <link rel="stylesheet" href="/assets/${slug}/styles.css">
  <style>${CHROME_INLINE_CSS}</style>
</head>
<body>
${buildNavHtml(slug, calendly)}
  <div class="main-container">
    <div class="content-wrapper">
      <main class="main-col">
${buildCredArticleHeader(h1, date, 'Monitoring')}
        <div class="brandChip"><svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="${ODOO_LOGO}" fill="#714b67"/></svg><span>Monitoring guide for Odoo</span></div>
        <div class="proofBar">
          <span class="checked"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6"><path d="M20 6 9 17l-5-5"/></svg>Checked against Odoo 19 documentation</span>
          <span class="dot">•</span><span>Self-hosted VM, Docker, and Kubernetes</span>
          <span class="dot">•</span><span>${sources.length} primary sources</span>
        </div>

        <article class="dl-blog odooBlog">
          <section class="answerCard" aria-labelledby="short-answer">
            <span class="answerEyebrow">The 60-second answer</span>
            <h2 id="short-answer">Monitor the transaction path, not only the Odoo process.</h2>
            <p>A production Odoo check should prove that <strong>the public URL answers, Odoo can reach PostgreSQL, workers are responsive, the filestore is writable, and critical scheduled actions are still advancing</strong>. Safe automation can recover a stopped or wedged service, handle a dependency startup race, or run approved disk housekeeping. It must verify the business path afterward and stop when the evidence points to corruption, a failed migration, or an unknown custom-module error.</p>
          </section>

          <nav class="articleToc" aria-label="On this page">
            <strong>On this page</strong>
            <a href="#architecture">What keeps Odoo available</a>
            <a href="#monitor">What to monitor</a>
            <a href="#tools">Which monitoring approach to use</a>
            <a href="#checks">Copy-paste health checks</a>
            <a href="#failures">Common failures and safe fixes</a>
            <a href="#runbook">Auto-recovery runbook</a>
            <a href="#alertmend">Odoo monitoring with AlertMend</a>
            <a href="#by-industry">By industry</a>
            <a href="#faq">FAQ</a>
          </nav>

          <div class="coverageNote">
            <strong>About the “95% of failures” goal:</strong> no honest guide can guarantee a universal percentage without your incident history. Use the matrix below as a starting hypothesis, then calculate coverage from your own production incidents.
            <span class="coverageFormula">automation coverage = safely auto-resolved recurring incidents ÷ all actionable Odoo incidents × 100</span>
          </div>

          <h2 class="sectionHead" id="architecture">What actually keeps Odoo available</h2>
          <p class="bodyText">Odoo is not one process with one green light. A user request commonly crosses TLS and a reverse proxy, reaches an Odoo HTTP worker, queries PostgreSQL, and may read an attachment from the filestore. Background work depends on cron workers. Live Chat and websocket traffic need their own proxy path in multi-process deployments. <a href="https://www.odoo.com/documentation/19.0/administration/on_premise/deploy.html" target="_blank" rel="noopener noreferrer">Odoo’s deployment documentation</a> explicitly recommends a reverse proxy, HTTPS, multi-process mode with appropriate limits, and correct websocket routing.</p>
          ${recoveryFlowSvg()}

          <p class="bodyText">That architecture creates two traps. First, <code>systemctl is-active odoo</code> can be green while every worker is saturated or the database is unreachable. Second, a successful HTTP request to a generic page may not prove that the intended database or a business workflow works. The monitoring design must therefore move from shallow to deep checks.</p>

          <h2 class="sectionHead" id="monitor">The Odoo monitoring checklist</h2>
          <p class="sectionSub">Use four layers: user journey, application, dependencies, and recoverability.</p>
          <div class="monitorGrid">
            <section class="monitorCard"><div class="monitorTop"><h3>1. Customer journey</h3><span class="signalBadge">Outside-in</span></div><p>Check the public HTTPS URL, expected status and page content, latency, TLS expiry, login availability, and one read-only business action where possible.</p></section>
            <section class="monitorCard"><div class="monitorTop"><h3>2. Odoo runtime</h3><span class="signalBadge">Application</span></div><p>Watch process state, worker count, restarts, request latency, 5xx rate, Python tracebacks, memory, CPU, open files, and Odoo’s worker-recycling events.</p></section>
            <section class="monitorCard"><div class="monitorTop"><h3>3. PostgreSQL</h3><span class="signalBadge">Database</span></div><p>Check <code>pg_isready</code>active and waiting sessions, connection utilization, long transactions, lock waits, query latency, dead tuples, replication lag where used, and storage headroom.</p></section>
            <section class="monitorCard"><div class="monitorTop"><h3>4. Proxy and websocket</h3><span class="signalBadge">Edge</span></div><p>Track Nginx or load-balancer 499/502/503/504 rates, upstream connect time, read timeouts, certificate expiry, and the <code>/websocket/</code> route.</p></section>
            <section class="monitorCard"><div class="monitorTop"><h3>5. Storage and filestore</h3><span class="signalBadge">Durability</span></div><p>Alert on disk bytes and inodes, PostgreSQL/WAL growth, log growth, filestore mount availability, write errors, and backup age. Never “clean” the Odoo filestore as routine disk remediation.</p></section>
            <section class="monitorCard"><div class="monitorTop"><h3>6. Scheduled actions</h3><span class="signalBadge">Freshness</span></div><p>Measure the last successful run and duration of critical cron jobs. <a href="https://www.odoo.com/documentation/19.0/developer/reference/backend/actions.html" target="_blank" rel="noopener noreferrer">Odoo 19 documents</a> skip and deactivation behavior after repeated failures, so silence can be a failure signal.</p></section>
            <section class="monitorCard"><div class="monitorTop"><h3>7. Deployment health</h3><span class="signalBadge">Change</span></div><p>Correlate failures with image, package, custom-addon, configuration, and database changes. Track module import errors and keep a tested rollback path for the current major version.</p></section>
            <section class="monitorCard"><div class="monitorTop"><h3>8. Recovery proof</h3><span class="signalBadge">Resilience</span></div><p>Test restore procedures, not just backup completion. <a href="https://www.odoo.com/documentation/19.0/administration/odoo_sh/getting_started/create.html" target="_blank" rel="noopener noreferrer">Odoo’s backup workflow</a> offers a ZIP format that includes the filestore; a database-only restore can leave attachments missing.</p></section>
          </div>

          <h2 class="sectionHead" id="tools">Odoo module, uptime monitor, or infrastructure monitoring?</h2>
          <p class="bodyText">This is the gap many Odoo monitoring pages miss: an in-database module can provide excellent application context, but it cannot reliably report that Odoo or PostgreSQL is completely unreachable. Conversely, a generic uptime service can prove the URL is down but usually cannot tell whether the cause is a worker, database connection, disk, proxy, or failed deployment.</p>
          <div class="diyWrap">
            <table class="compareTable">
              <thead><tr><th>Approach</th><th>What it sees well</th><th>Blind spot</th><th>Best use</th></tr></thead>
              <tbody>
                <tr><td>Odoo monitoring module</td><td>Cron history, application records, internal configuration</td><td>Cannot report reliably when the whole runtime or database is down</td><td>Deep application context</td></tr>
                <tr><td>External uptime monitor</td><td>Public availability, latency, TLS, response content</td><td>Limited root-cause evidence and no host-level action</td><td>Independent outage detection</td></tr>
                <tr><td>Metrics and log stack</td><td>Detailed trends, dashboards, queries, capacity</td><td>Recovery still depends on a human or separate automation</td><td>Investigation and long-term analysis</td></tr>
                <tr><td>AlertMend operations loop</td><td>Endpoint, VM or Kubernetes evidence, incidents, runbooks, verification</td><td>Requires scoped access and policy design for safe actions</td><td>Detection through governed recovery</td></tr>
              </tbody>
            </table>
          </div>
          <p class="bodyText"><strong>The practical answer is layered:</strong> keep useful Odoo-native telemetry, test the service from outside, observe its infrastructure and PostgreSQL dependency, and automate only the repeatable responses whose preconditions you can prove.</p>

          <h2 class="sectionHead" id="checks">Copy-paste checks for VM, Docker, and Kubernetes</h2>
          <p class="bodyText">Choose the deployment model closest to production. Replace service names, database names, namespaces, and URLs. These checks are diagnostic building blocks, not permission to restart a database blindly.</p>

          <section class="deployChooser" aria-label="Odoo deployment checks">
            <div class="deployTabs" role="tablist" aria-label="Deployment type">
              <button class="deployTab" type="button" role="tab" aria-selected="true" data-deploy-tab="vm">Linux VM</button>
              <button class="deployTab" type="button" role="tab" aria-selected="false" data-deploy-tab="docker">Docker Compose</button>
              <button class="deployTab" type="button" role="tab" aria-selected="false" data-deploy-tab="kubernetes">Kubernetes</button>
            </div>
            <div class="deployPanel" role="tabpanel" data-deploy-panel="vm">
              <h3>Linux VM: confirm every dependency before touching the service</h3>
              <p>The service name varies by package and version. The URL check includes the intended database so a healthy database selector does not create a false positive.</p>
              <div class="command"><button class="copyCode" type="button">Copy</button><code>systemctl is-active --quiet odoo &amp;&amp; echo "odoo service: active"
curl -fsS --max-time 10 "https://odoo.example.com/web/login?db=production" &gt;/dev/null
pg_isready -h 127.0.0.1 -p 5432 -d production -U odoo
df -P /var/lib/odoo /var/lib/postgresql
journalctl -u odoo --since "15 minutes ago" --no-pager | tail -n 200</code></div>
            </div>
            <div class="deployPanel" role="tabpanel" data-deploy-panel="docker" hidden>
              <h3>Docker Compose: running is not the same as ready</h3>
              <p><a href="https://docs.docker.com/compose/how-tos/startup-order/" target="_blank" rel="noopener noreferrer">Docker documents</a> that Compose starts dependencies in order but does not wait for readiness unless you use a health check with <code>service_healthy</code>.</p>
              <div class="command"><button class="copyCode" type="button">Copy</button><code>services:
  db:
    image: postgres:16
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U odoo -d postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
  web:
    image: odoo:19.0
    depends_on:
      db:
        condition: service_healthy
        restart: true
    restart: unless-stopped
    volumes:
      - odoo-data:/var/lib/odoo</code></div>
            </div>
            <div class="deployPanel" role="tabpanel" data-deploy-panel="kubernetes" hidden>
              <h3>Kubernetes: separate startup, readiness, and liveness</h3>
              <p>Use a database-aware startup gate, a readiness check that removes unhealthy pods from service, and a conservative liveness check. A custom Odoo health controller is preferable when you need to prove database and filestore access.</p>
              <div class="command"><button class="copyCode" type="button">Copy</button><code>kubectl -n odoo get deploy,pods,svc
kubectl -n odoo logs deploy/odoo --since=15m --all-containers
kubectl -n odoo exec deploy/odoo -- \
  pg_isready -h postgres -p 5432 -d production -U odoo
kubectl -n odoo top pods
kubectl -n odoo get events --sort-by=.lastTimestamp | tail -n 40</code></div>
            </div>
          </section>

          <h3 class="subsectionHead">A useful PostgreSQL saturation query</h3>
          <p class="bodyText">PostgreSQL’s <a href="https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-ACTIVITY-VIEW" target="_blank" rel="noopener noreferrer"><code>pg_stat_activity</code></a> exposes one row per server process. Run a read-only summary to see whether Odoo is failing because the database is unavailable, saturated, blocked, or simply slow.</p>
          <div class="command"><button class="copyCode" type="button">Copy</button><code>SELECT state, wait_event_type, wait_event, count(*) AS sessions
FROM pg_stat_activity
WHERE datname = 'production'
GROUP BY state, wait_event_type, wait_event
ORDER BY sessions DESC;</code></div>

          <h2 class="sectionHead" id="failures">Common Odoo failures: what can safely auto-fix?</h2>
          <p class="sectionSub">The right automation is narrow, evidence-driven, bounded, and reversible.</p>
          <div class="diyWrap">
            <table class="compareTable recoveryTable">
              <thead><tr><th>Failure pattern</th><th>Evidence to confirm</th><th>Automation level</th><th>Safe first response</th></tr></thead>
              <tbody>
                <tr><td>Odoo process stopped</td><td>Service inactive; DB ready; disk healthy</td><td><span class="autoSafe">Auto-fix</span></td><td>Start Odoo, wait, then verify HTTPS and database path.</td></tr>
                <tr><td>Workers wedged / repeated 502 or 504</td><td>Public check fails; process exists; worker or timeout evidence in logs</td><td><span class="autoSafe">Auto-fix</span></td><td>One controlled service restart with cooldown and post-check.</td></tr>
                <tr><td>Odoo started before PostgreSQL was ready</td><td><code>pg_isready</code> transitions to healthy; Odoo retains connection errors</td><td><span class="autoSafe">Auto-fix</span></td><td>Wait for DB readiness, then restart only Odoo.</td></tr>
                <tr><td>Container or pod repeatedly crashes</td><td>Exit code, OOM status, events, recent image/config change</td><td><span class="autoGate">Conditional</span></td><td>Restart once if configuration is unchanged; otherwise roll back with approval.</td></tr>
                <tr><td>Memory pressure / OOM</td><td>Kernel or pod OOM evidence; worker RSS; request correlation</td><td><span class="autoGate">Conditional</span></td><td>Recycle affected runtime and page the owner; tune workers and limits after evidence review.</td></tr>
                <tr><td>Log volume fills disk</td><td>Filesystem and inode pressure; logs are the proven growth source</td><td><span class="autoGate">Conditional</span></td><td>Rotate or archive approved log paths. Never delete PostgreSQL or filestore data.</td></tr>
                <tr><td>PostgreSQL connection saturation</td><td>Session counts, wait states, long transactions, max-connection headroom</td><td><span class="autoGate">Approval required</span></td><td>Identify the owner and query first. Terminating sessions can interrupt business transactions.</td></tr>
                <tr><td>Critical cron action missed</td><td>Expected completion absent; repeated exception or timeout</td><td><span class="autoGate">Approval required</span></td><td>Fix the cause before rerunning; only rerun jobs known to be idempotent.</td></tr>
                <tr><td>TLS certificate near expiry</td><td>Expiry window and renewal status</td><td><span class="autoSafe">Auto-fix</span></td><td>Run the approved renewal path, reload the proxy, and verify the certificate served.</td></tr>
                <tr><td>Failed custom module or database migration</td><td>Import/registry traceback immediately after a change</td><td><span class="autoHuman">Human review</span></td><td>Stop restart loops, preserve evidence, and execute the tested release rollback.</td></tr>
                <tr><td>Database corruption or missing filestore</td><td>PostgreSQL/storage errors or attachment mismatch</td><td><span class="autoHuman">Human review</span></td><td>Isolate writes and follow the tested restore or database recovery procedure.</td></tr>
              </tbody>
            </table>
          </div>

          <p class="bodyText">Notice what is missing: “restart everything.” Restarting PostgreSQL together with Odoo can turn a recoverable application failure into interrupted transactions or a longer database recovery. Deleting the oldest directory under <code>/var/lib/odoo</code> can destroy attachments. A credible runbook encodes the checks that prevent those mistakes.</p>
          <aside class="answerCard">
            <span class="answerEyebrow">The automation opportunity</span>
            <h2>These are not eleven unrelated incidents. They are a decision tree.</h2>
            <p>Once your recurring signatures, preconditions, actions, and verification checks are explicit, they can become a governed AlertMend runbook instead of a document an engineer must rediscover during every outage. Unknown or data-risk conditions still stop and page a human.</p>
          </aside>

          <h2 class="sectionHead" id="runbook">The production-safe Odoo auto-recovery runbook</h2>
          <section class="runbook">
            <span class="answerEyebrow">Recommended control loop</span>
            <ol class="runbookSteps">
              <li><span class="runbookNum">01</span><strong>Detect</strong><span>Require repeated failure or corroborating signals.</span></li>
              <li><span class="runbookNum">02</span><strong>Diagnose</strong><span>Collect URL, DB, disk, memory, logs, and recent changes.</span></li>
              <li><span class="runbookNum">03</span><strong>Decide</strong><span>Match a known signature and check guardrails.</span></li>
              <li><span class="runbookNum">04</span><strong>Recover</strong><span>Run one narrow, approved action with a timeout.</span></li>
              <li><span class="runbookNum">05</span><strong>Verify</strong><span>Prove the customer path works; otherwise escalate.</span></li>
            </ol>
          </section>

          <h3 class="subsectionHead">Guardrails that turn a shell script into reliable automation</h3>
          <div class="guardrails">
            <div class="guardrail"><strong>Bound the blast radius</strong><p>Target one service, pod, or host. Never fan out a restart across every Odoo node unless the policy explicitly requires it.</p></div>
            <div class="guardrail"><strong>Use a cooldown</strong><p>Allow one attempt, then suppress repeats for a defined window. Restart loops erase evidence and increase downtime.</p></div>
            <div class="guardrail"><strong>Require preconditions</strong><p>For an Odoo restart, prove PostgreSQL is ready and storage has headroom before acting.</p></div>
            <div class="guardrail"><strong>Protect data paths</strong><p>Explicitly deny deletion under PostgreSQL data, WAL, Odoo filestore, custom addons, and backup locations.</p></div>
            <div class="guardrail"><strong>Verify deeply</strong><p>A green PID is insufficient. Re-run the external URL and database-aware check after recovery.</p></div>
            <div class="guardrail"><strong>Leave an audit trail</strong><p>Record evidence, command, approver, output, elapsed time, and verification result on the incident.</p></div>
          </div>

          <h2 class="sectionHead" id="alertmend">How to monitor and auto-recover Odoo with AlertMend</h2>
          <p class="bodyText">For self-hosted Odoo, AlertMend can combine an external API monitor with VM or Kubernetes signals and an approved runbook. The important sales claim is not “AI fixes everything.” It is that the evidence, decision, action, verification, escalation, and audit trail can live in one operational loop.</p>
          <div class="monitorGrid">
            <section class="monitorCard"><div class="monitorTop"><h3>Connect the runtime</h3><span class="signalBadge">Day 1</span></div><p>Register the Odoo VM through SSH-based monitoring or an agent-managed path, or connect the Kubernetes cluster. Collect CPU, memory, disk, service, container, events, logs, and deployment context.</p></section>
            <section class="monitorCard"><div class="monitorTop"><h3>Add the user-facing check</h3><span class="signalBadge">Outside-in</span></div><p>Create an HTTPS monitor for the intended Odoo database and expected response. Configure frequency, timeout, success codes or body conditions, severity, and escalation.</p></section>
            <section class="monitorCard"><div class="monitorTop"><h3>Encode the diagnostic tree</h3><span class="signalBadge">Evidence</span></div><p>Query service state, PostgreSQL readiness, disk and inodes, memory pressure, recent Odoo and proxy logs, and recent deployment changes before selecting an action.</p></section>
            <section class="monitorCard"><div class="monitorTop"><h3>Run governed recovery</h3><span class="signalBadge">Action</span></div><p>Execute commands on a connected VM or pod, branch on results, require Slack or Teams approval for risky paths, and post a closing summary after verification.</p></section>
            <section class="monitorCard"><div class="monitorTop"><h3>Escalate the unknowns</h3><span class="signalBadge">On-call</span></div><p>Route failed recovery, unknown signatures, or data-risk conditions into incidents and on-call. WhatsApp escalation is available where configured alongside team channels.</p></section>
            <section class="monitorCard"><div class="monitorTop"><h3>Keep enterprise control</h3><span class="signalBadge">Deployment</span></div><p>Use managed or self-hosted AlertMend, RBAC, approvals, and audit trails. Confirm the deployment model and integrations included in your workspace and contract.</p></section>
          </div>

          <h3 class="subsectionHead">An example AlertMend decision tree</h3>
          <div class="command"><button class="copyCode" type="button">Copy</button><code>IF public_check fails twice
  collect: Odoo service, pg_isready, disk, memory, recent logs, last deploy

IF PostgreSQL is ready AND disk is healthy AND Odoo is inactive
  start Odoo
  wait up to 60 seconds
  verify public URL + database-aware check

ELSE IF Odoo is active AND known worker-hang signature matches
  restart Odoo once
  verify; enforce 30-minute cooldown

ELSE IF disk pressure is caused only by approved log paths
  request approval → archive/rotate logs → verify free space → restart if needed

ELSE
  declare incident → attach evidence → page the Odoo owner
</code></div>

          <h2 class="sectionHead">Thresholds worth starting with</h2>
          <p class="bodyText">Treat these as starting points, then tune them against workload and error-budget data. Static universal thresholds produce noise.</p>
          <div class="diyWrap">
            <table class="compareTable">
              <thead><tr><th>Signal</th><th>Starting alert</th><th>Why it matters</th></tr></thead>
              <tbody>
                <tr><td>Public HTTPS check</td><td>2–3 consecutive failures</td><td>Avoids acting on one transient probe failure.</td></tr>
                <tr><td>p95 request latency</td><td>Above your SLO for 5–10 minutes</td><td>Detects saturation before a full outage.</td></tr>
                <tr><td>5xx / 502 / 504 rate</td><td>Burn-rate or sustained percentage</td><td>Separates customer impact from raw CPU usage.</td></tr>
                <tr><td>Filesystem capacity</td><td>Warning at 75–80%; critical at 90%</td><td>Leaves time to understand whether logs, WAL, or filestore is growing.</td></tr>
                <tr><td>Inodes</td><td>Same staged headroom as bytes</td><td>A filesystem can be “full” with free bytes remaining.</td></tr>
                <tr><td>PostgreSQL connections</td><td>Sustained utilization above 70–80%</td><td>Preserves headroom for admin and recovery connections.</td></tr>
                <tr><td>Critical cron freshness</td><td>Expected finish + normal maximum duration</td><td>Detects silent billing, email, inventory, or integration lag.</td></tr>
                <tr><td>Certificate expiry</td><td>30, 14, and 7 days</td><td>Creates multiple opportunities to repair renewal before outage.</td></tr>
              </tbody>
            </table>
          </div>

          <h2 class="sectionHead">What this architecture will not hide</h2>
          <p class="bodyText">Custom modules change the failure surface. A module can introduce expensive computed fields, slow SQL, unsafe cron behavior, memory growth, or registry failures after deployment. Odoo’s own sizing examples assume fields and SQL are well designed. Monitor custom code as a first-class dependency, correlate incidents with releases, and keep the current rollback artifact available.</p>
          <p class="bodyText">Also separate an <a href="https://www.odoo.com/documentation/19.0/administration/on_premise/update.html" target="_blank" rel="noopener noreferrer"><em>update</em> within the current Odoo major version</a> from a database <em>upgrade</em> to a new major version. Odoo documents these as different operations; a major-version database upgrade is not a safe automatic incident response.</p>

          <h2 class="sectionHead" id="by-industry">Odoo monitoring priorities by industry</h2>
          <p class="sectionSub">Odoo runs very different workloads depending on the business, so the failure that hurts first shifts by industry. The underlying checks are the same; the priority order changes.</p>
          <div class="diyWrap"><table class="compareTable"><thead><tr><th>Industry / workload</th><th>Watch most closely</th><th>What downtime costs</th></tr></thead><tbody>
            <tr><td>Retail and POS</td><td>POS session workers, web and longpolling endpoints, payment terminal link, offline order sync</td><td class="diyHighlight">Lost in-store sales, checkout queues</td></tr>
            <tr><td>E-commerce and website</td><td>Storefront and checkout URLs, product and stock sync, longpolling, payment gateway callbacks</td><td class="diyHighlight">Abandoned carts, lost online orders</td></tr>
            <tr><td>Manufacturing and MRP</td><td>Scheduled actions for MRP runs, PostgreSQL performance for BoM explosions, work-order throughput</td><td class="diyHighlight">Stalled production planning, late builds</td></tr>
            <tr><td>Wholesale and distribution</td><td>Stock moves, barcode and scanner endpoints, reordering cron, EDI and API integrations</td><td class="diyHighlight">Delayed shipping and fulfillment</td></tr>
            <tr><td>Services and accounting</td><td>Invoicing, recurring cron for subscriptions and reminders, email and longpolling</td><td class="diyHighlight">Billing delays, cash-flow impact</td></tr>
          </tbody></table></div>
          <p class="bodyText">Whatever the industry, the monitoring model is the same: outside-in journey checks plus workers, PostgreSQL, cron, and longpolling. What changes is which failure hurts first, so alert thresholds and recovery runbooks should lead with the module that business depends on.</p>

          <h2 class="sectionHead" id="faq">Odoo monitoring FAQ</h2>
          ${faqHtml()}

          <section class="finalCta">
            <h2>See Odoo fail, and recover, before your users open a ticket.</h2>
            <p>Bring one recurring Odoo incident. We’ll map its evidence, guardrails, recovery command, verification check, and escalation path into an AlertMend proof of value.</p>
            <div class="ctaActions">
              <a class="ctaPrimary" href="${calendly}" target="_blank" rel="noopener noreferrer">Book an Odoo reliability review</a>
              <a class="ctaSecondary" href="${signup}">Start with AlertMend</a>
            </div>
          </section>

          <h2 class="sectionHead">Primary sources</h2>
          <p class="sourceIntro">Product behavior and defaults can change. These sources were reviewed on ${date}; verify options against your deployed Odoo and PostgreSQL versions.</p>
          <ol class="sourceList">
            ${sources.map(([label, url]) => `<li><a href="${url}" target="_blank" rel="noopener noreferrer">${esc(label)}</a></li>`).join('\n            ')}
          </ol>

          <hr style="margin:2.5rem 0 1.75rem;border:none;border-top:1px solid #e4e4e7;">
          <div class="authorBioCard" style="display:flex;gap:24px;align-items:flex-start;flex-wrap:wrap;padding-bottom:1rem;">
            <img src="/logos/dinesh.jpeg" alt="Dinesh Agrawal" width="128" height="128" loading="lazy" style="width:128px;height:128px;border-radius:12px;object-fit:cover;border:1px solid #e4e4e7;flex-shrink:0;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
            <div style="display:none;width:128px;height:128px;border-radius:12px;border:1px solid #e4e4e7;background:#f4f4f5;align-items:center;justify-content:center;font-weight:800;font-size:2.25rem;color:#3f3f46;flex-shrink:0;">DA</div>
            <div style="flex:1;min-width:240px;">
              <h3 style="font-size:1.5rem;font-weight:800;color:#09090b;margin:0 0 4px;">Dinesh Agrawal</h3>
              <p style="color:#7c3aed;font-weight:600;margin:0 0 14px;">Co-Founder at AlertMend.io</p>
              <div style="color:#3f3f46;line-height:1.75;">
                <p style="margin:0 0 10px;">Dinesh Agrawal brings 12+ years of deep experience across cloud and AI-driven automation, building systems that detect, diagnose, and fix production incidents without waiting for a human.</p>
                <p style="margin:0;">At AlertMend.io he focuses on autonomous, self-healing operations, turning manual cloud firefighting into workflows that predict, remediate, and learn.</p>
              </div>
              <a href="https://www.linkedin.com/in/dineshagrawal85/" target="_blank" rel="noopener noreferrer" aria-label="Dinesh Agrawal on LinkedIn" style="display:inline-flex;align-items:center;gap:6px;margin-top:14px;color:#71717a;text-decoration:none;font-weight:600;">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zM8.34 18V9.94H5.67V18h2.67zM7 8.76a1.55 1.55 0 1 0 0-3.1 1.55 1.55 0 0 0 0 3.1zM18.34 18v-4.42c0-2.37-1.27-3.47-2.96-3.47-1.36 0-1.97.75-2.31 1.28V9.94h-2.67V18h2.67v-4.5c0-.24.02-.48.09-.65.19-.48.63-.98 1.36-.98.96 0 1.35.73 1.35 1.8V18h2.82z"/></svg>
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </article>

        <p class="promo">Want AlertMend to monitor the entire Odoo path and run governed recovery? <a href="${calendly}" target="_blank" rel="noopener noreferrer">Book a practical reliability review →</a></p>
      </main>
${buildSidebarHtml(related)}
    </div>
  </div>
  <script src="/assets/make-error-127/script.js"></script>
  <script src="/assets/${slug}/script.js"></script>
</body>
</html>
`

const assetsDir = path.join(root, 'public/assets', slug)
const blogDir = path.join(root, 'public/blog', slug)
fs.mkdirSync(assetsDir, { recursive: true })
fs.mkdirSync(blogDir, { recursive: true })
fs.writeFileSync(path.join(assetsDir, 'styles.css'), customCss)
fs.writeFileSync(path.join(assetsDir, 'script.js'), scriptJs)
fs.writeFileSync(path.join(assetsDir, 'hero.svg'), heroSvg())
fs.writeFileSync(path.join(blogDir, 'index.html'), html)
fs.writeFileSync(path.join(root, 'public/blog', `${slug}.md`), `---
title: "${title}"
excerpt: "${excerpt}"
date: "${date}"
category: "Monitoring"
author: "Dinesh Agrawal"
tags: ["Odoo", "Monitoring", "Auto-remediation", "PostgreSQL"]
keywords: "Odoo monitoring, Odoo health check, Odoo uptime monitoring, Odoo auto recovery, Odoo PostgreSQL monitoring"
---

This guide is published as a rich interactive page at [/blog/${slug}](/blog/${slug}).
`)

console.log(`✓ ${slug}`)
console.log(`  HTML: public/blog/${slug}/index.html`)
console.log(`  Hero: public/assets/${slug}/hero.svg`)
