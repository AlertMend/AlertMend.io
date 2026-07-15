/**
 * Cookbook satellite to the toil hub (automate-ops-toil). Recipe-driven: 12 concrete
 * daily ops tasks, each with a copy-paste runbook, the trigger to use, and the time it
 * gives back. Different search intent ("what to automate", "automation examples") and
 * links UP to the pillar. Honest per features_april_2026.md. No em dashes.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { SITE_URL, esc, CHROME_INLINE_CSS, AUTHOR_CRED_CSS, buildNavHtml, buildSidebarHtml, buildCredArticleHeader, calendlyUrl, appendBlogSignupHandler } from './static-blog-shared.mjs'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const DATE = '2026-07-15', MODIFIED = '2026-07-15'
const AUTHOR = 'Dinesh Agrawal'
const LINKEDIN = 'https://www.linkedin.com/in/dineshagrawal85/'
const ACCENT = '#2563eb', ACCENT_DARK = '#172554'

const SCRIPT_JS = `(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.classList.add('js-anim');

  // time-saved calculator with count-up
  var t = document.getElementById('i-tasks'), r = document.getElementById('i-runs'), m = document.getElementById('i-mins');
  if (t && r && m) {
    var ct = document.getElementById('c-tasks'), cr = document.getElementById('c-runs'), cm = document.getElementById('c-mins');
    var ow = document.getElementById('o-week'), om = document.getElementById('o-month'), oy = document.getElementById('o-year');
    var raf;
    function put(el, v, dec) { el.textContent = dec ? (v < 10 ? v.toFixed(1) : Math.round(v)) : Math.round(v); }
    function values() {
      var tasks = +t.value, runs = +r.value, mins = +m.value;
      ct.textContent = tasks; cr.textContent = runs; cm.textContent = mins;
      var wk = tasks * runs * mins * 0.85 / 60;
      return { week: wk, month: wk * 4.33, year: wk * 52 / 8 };
    }
    function setNow() { var v = values(); put(ow, v.week, true); put(om, v.month, false); put(oy, v.year, false); }
    function countUp() {
      var v = values();
      if (reduce || !window.requestAnimationFrame) { put(ow, v.week, true); put(om, v.month, false); put(oy, v.year, false); return; }
      var start = null, dur = 650;
      cancelAnimationFrame(raf);
      function step(now) {
        if (start === null) start = now;
        var p = Math.min(1, (now - start) / dur), e = 1 - Math.pow(1 - p, 3);
        put(ow, v.week * e, true); put(om, v.month * e, false); put(oy, v.year * e, false);
        if (p < 1) raf = requestAnimationFrame(step);
      }
      raf = requestAnimationFrame(step);
    }
    [t, r, m].forEach(function (el) { el.addEventListener('input', setNow); });
    var calcEl = document.querySelector('.calc');
    if (calcEl && !reduce && 'IntersectionObserver' in window) {
      ow.textContent = '0'; om.textContent = '0'; oy.textContent = '0';
      var seen = false;
      var cio = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting && !seen) { seen = true; countUp(); cio.disconnect(); } }); }, { threshold: 0.4 });
      cio.observe(calcEl);
    } else { setNow(); }
  }

  // reveal-on-scroll, with a safety net so content is never left hidden if IO does not fire
  var revs = document.querySelectorAll('.revealUp');
  function revealAll() { revs.forEach(function (el) { el.classList.add('in'); el.style.opacity = '1'; el.style.transform = 'none'; }); }
  if (reduce || !('IntersectionObserver' in window)) {
    revealAll();
  } else {
    var rio = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); rio.unobserve(en.target); } }); }, { threshold: 0.12 });
    revs.forEach(function (el) { rio.observe(el); });
    setTimeout(revealAll, 2000);
  }

  document.querySelectorAll('[data-faq-toggle]').forEach(function (b) {
    b.addEventListener('click', function () {
      var item = b.closest('.faqItem'); var answer = item && item.querySelector('.faqAnswer'); var chev = b.querySelector('.faqChevron');
      var open = b.getAttribute('aria-expanded') === 'true';
      b.setAttribute('aria-expanded', open ? 'false' : 'true');
      if (answer) answer.classList.toggle('hidden', open); if (chev) chev.classList.toggle('faqChevronOpen', !open);
    });
  });
  document.querySelectorAll('.copyableCode').forEach(function (block) {
    var code = block.querySelector('code'); if (!code) return;
    var btn = document.createElement('button'); btn.type = 'button'; btn.className = 'codeCopyButton'; btn.textContent = 'Copy';
    btn.addEventListener('click', async function () { try { await navigator.clipboard.writeText(code.textContent || ''); btn.textContent = 'Copied'; setTimeout(function () { btn.textContent = 'Copy'; }, 1600); } catch (e) { btn.textContent = 'Select text'; } });
    block.appendChild(btn);
  });
})();
`

const ANSWER_CARD_CSS = `
:root{--am-accent:${ACCENT};}
.instantFix{position:relative;margin-bottom:1rem;padding:1.15rem;overflow:hidden;border:1px solid #bfdbfe;border-radius:14px;background:#fff;box-shadow:0 8px 28px rgba(9,9,11,.05);}
.instantFixTop{display:flex;flex-direction:column;align-items:flex-start;gap:.35rem;margin-bottom:.6rem;}
.instantFixTop span{color:var(--am-accent);font-size:.65rem;font-weight:800;letter-spacing:.09em;text-transform:uppercase;}
.instantFixTop strong{color:#18181b;font-size:.95rem;line-height:1.45;}
.instantFix>p{margin:0 0 .9rem;max-width:680px;color:#3f3f46;font-size:1rem;line-height:1.6;}
.instantFixCommands{display:grid;grid-template-columns:max-content minmax(0,1fr);gap:.4rem .8rem;align-items:center;padding:.75rem;border-radius:8px;background:#18181b;}
.instantFixCommands code{color:#93c5fd;font-size:.75rem;}
.instantFixCommands span{color:#a1a1aa;font-size:.72rem;}
.sectionHead{border-left:4px solid var(--am-accent);padding-left:14px;}
.heroGuideLabel{color:var(--am-accent);}
.bodyText a,.sourceList a,.faqAnswer a{color:var(--am-accent);}
.brandChip{display:inline-flex;align-items:center;gap:9px;margin:0 0 1.25rem;padding:6px 15px 6px 11px;border:1px solid #e4e4e7;border-radius:999px;background:#fff;}
.brandChip span{font-size:.82rem;font-weight:600;color:#52525b;}
.calloutBox{margin:1.5rem 0;padding:18px 20px;border-left:3px solid var(--am-accent);border-radius:0 10px 10px 0;background:#eff6ff;color:#3f3f46;line-height:1.7;}
.calloutBox strong{color:#18181b;}
.ctaInline{margin:1.6rem 0;padding:15px 18px;border-left:3px solid var(--am-accent);border-radius:0 10px 10px 0;background:#f5f9ff;font-weight:600;color:#27272a;}
.ctaInline a{color:var(--am-accent);}
.pillarLink{display:flex;gap:12px;align-items:flex-start;margin:1.25rem 0 1.75rem;padding:14px 16px;border:1px solid #bfdbfe;border-radius:12px;background:#eff6ff;}
.pillarLink svg{flex-shrink:0;margin-top:2px;}
.pillarLink p{margin:0;color:#3f3f46;font-size:.92rem;line-height:1.6;}
.pillarLink a{color:var(--am-accent);font-weight:700;}
.recipeLegend{display:flex;flex-wrap:wrap;gap:8px 18px;margin:.5rem 0 1.5rem;font-size:.82rem;color:#71717a;}
.recipeLegend b{color:#3f3f46;}
.rgroup{margin:2.25rem 0 0;}
.rgroupHead{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;margin:0 0 .25rem;}
.rgroupHead h3{margin:0;font-size:1.22rem;color:#09090b;font-weight:800;}
.rgroupHead span{font-size:.85rem;color:#71717a;}
.recipe{margin:14px 0;padding:18px;border:1px solid #e4e4e7;border-radius:12px;background:#fff;border-left:4px solid var(--am-accent);transition:transform .18s ease,box-shadow .18s ease;}
.recipe:hover{transform:translateY(-2px);box-shadow:0 10px 30px rgba(37,99,235,.10);}
.recipeTop{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:.55rem;}
.recipeNum{display:grid;place-items:center;width:1.9rem;height:1.9rem;border-radius:8px;background:#dbeafe;color:var(--am-accent);font-weight:800;font-size:.9rem;flex-shrink:0;}
.recipe h4{margin:0;font-size:1.08rem;color:#18181b;flex:1;min-width:180px;font-weight:800;}
.recipeTrigger{font-size:.66rem;font-weight:800;letter-spacing:.06em;text-transform:uppercase;padding:3px 9px;border-radius:999px;white-space:nowrap;}
.recipeTrigger.sched{background:#eff6ff;color:#2563eb;}
.recipeTrigger.alert{background:#fef2f2;color:#dc2626;}
.recipeManual{margin:0 0 .7rem;color:#52525b;font-size:.92rem;line-height:1.62;}
.recipeManual b{color:#3f3f46;}
.recipeFoot{display:flex;flex-wrap:wrap;gap:8px 16px;align-items:center;margin-top:.75rem;}
.recipeSaved{display:inline-flex;align-items:center;gap:6px;font-size:.83rem;font-weight:700;color:#047857;}
.recipeGuard{display:inline-flex;align-items:center;gap:6px;font-size:.8rem;color:#71717a;}
.calc{margin:1.75rem 0;padding:20px;border:1px solid #e4e4e7;border-radius:14px;background:linear-gradient(180deg,#f8fbff,#eef4ff);}
.calcHead{font-weight:800;color:#18181b;margin-bottom:.9rem;font-size:1.05rem;}
.calcRow{display:grid;grid-template-columns:1fr;gap:5px;margin:.75rem 0;}
.calcRow label{font-size:.86rem;color:#3f3f46;font-weight:600;display:flex;justify-content:space-between;gap:10px;}
.calcRow output{color:var(--am-accent);font-weight:800;}
.calcRow input[type=range]{width:100%;accent-color:var(--am-accent);}
.calcOut{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:1.1rem;}
.calcStat{text-align:center;padding:14px 8px;background:#fff;border:1px solid #e4e4e7;border-radius:10px;}
.calcStat span{display:block;font-size:1.85rem;font-weight:800;color:var(--am-accent);line-height:1;}
.calcStat label{font-size:.7rem;color:#71717a;text-transform:uppercase;letter-spacing:.05em;font-weight:700;margin-top:6px;display:block;}
.calcNote{margin:.9rem 0 0;font-size:.78rem;color:#a1a1aa;}
.authorBioCard{display:flex;gap:24px;align-items:flex-start;flex-wrap:wrap;padding-bottom:1rem;}
.authorBioCard h3{font-size:1.5rem;font-weight:800;color:#09090b;margin:0 0 4px;}
.authorBioRole{color:var(--am-accent);font-weight:600;margin:0 0 14px;}
.authorBioText{color:#3f3f46;line-height:1.75;}
.authorBioLink{display:inline-flex;align-items:center;gap:6px;margin-top:14px;color:#71717a;text-decoration:none;font-weight:600;}
@media (prefers-reduced-motion: no-preference){
  .js-anim .revealUp{opacity:0;transform:translateY(16px);transition:opacity .55s ease,transform .55s ease;}
  .js-anim .revealUp.in{opacity:1;transform:none;}
}
.storyGrid{display:grid;grid-template-columns:1fr;gap:16px;margin:1.25rem 0 .5rem;}
@media(min-width:820px){.storyGrid{grid-template-columns:repeat(2,1fr);}}
.storyCard{padding:20px;border:1px solid #e4e4e7;border-radius:14px;background:#fff;box-shadow:0 8px 28px rgba(9,9,11,.05);}
.storyTag{display:inline-block;font-size:.66rem;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--am-accent);background:#eff6ff;padding:3px 9px;border-radius:999px;margin-bottom:.6rem;}
.storyCard h4{margin:0 0 .55rem;font-size:1.12rem;color:#18181b;font-weight:800;}
.storyScene{margin:0 0 1rem;color:#3f3f46;font-size:.94rem;line-height:1.65;}
.storyScene b{color:#18181b;}
.storyCompare{display:grid;grid-template-columns:1fr;gap:10px;margin-bottom:.9rem;}
@media(min-width:520px){.storyCompare{grid-template-columns:1fr 1fr;}}
.storyCol{padding:12px 14px;border-radius:10px;}
.storyCol span{display:block;font-size:.66rem;font-weight:800;letter-spacing:.05em;text-transform:uppercase;margin-bottom:5px;}
.storyCol p{margin:0;font-size:.86rem;line-height:1.6;}
.storyCol.bad{background:#fef2f2;}.storyCol.bad span{color:#dc2626;}.storyCol.bad p{color:#7f1d1d;}
.storyCol.good{background:#eff6ff;}.storyCol.good span{color:#2563eb;}.storyCol.good p{color:#1e3a8a;}
.storyPayoff{display:inline-flex;align-items:center;gap:7px;font-size:.86rem;font-weight:700;color:#047857;}
`

const BOLT = 'M13 3v7h6l-8 11v-7H5l8-11z'
const CLOCK = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>'
const SHIELD = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z"/></svg>'

function authorCard() {
  return `
          <hr style="margin:2.5rem 0 1.75rem;border:none;border-top:1px solid #e4e4e7;">
          <div class="authorBioCard">
            <img src="/logos/dinesh.jpeg" alt="${AUTHOR}" width="128" height="128" loading="lazy" style="width:128px;height:128px;border-radius:12px;object-fit:cover;border:1px solid #e4e4e7;flex-shrink:0;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
            <div style="display:none;width:128px;height:128px;border-radius:12px;border:1px solid #e4e4e7;background:#f4f4f5;align-items:center;justify-content:center;font-weight:800;font-size:2.25rem;color:#3f3f46;flex-shrink:0;">DA</div>
            <div style="flex:1;min-width:240px;">
              <h3>${AUTHOR}</h3>
              <p class="authorBioRole">12+ years in cloud infrastructure and AI-driven incident automation</p>
              <div class="authorBioText">
                <p style="margin:0 0 10px;">${AUTHOR} brings 12+ years of deep experience across cloud and AI-driven automation, building systems that detect, diagnose, and fix production incidents without waiting for a human.</p>
                <p style="margin:0;">At AlertMend.io he focuses on autonomous, self-healing operations, turning manual cloud firefighting into workflows that predict, remediate, and learn.</p>
              </div>
              <a class="authorBioLink" href="${LINKEDIN}" target="_blank" rel="noopener noreferrer" aria-label="${AUTHOR} on LinkedIn">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zM8.34 18V9.94H5.67V18h2.67zM7 8.76a1.55 1.55 0 1 0 0-3.1 1.55 1.55 0 0 0 0 3.1zM18.34 18v-4.42c0-2.37-1.27-3.47-2.96-3.47-1.36 0-1.97.75-2.31 1.28V9.94h-2.67V18h2.67v-4.5c0-.24.02-.48.09-.65.19-.48.63-.98 1.36-.98.96 0 1.35.73 1.35 1.8V18h2.82z"/></svg>
                <span>LinkedIn</span>
              </a>
            </div>
          </div>`
}

function quadrantSvg() {
  return `<figure class="flowDiagram" style="overflow-x:auto;">
      <svg class="cb-anim" viewBox="0 0 720 300" width="720" height="300" role="img" aria-label="A two by two grid for deciding what to automate first. Horizontal axis: how often you do a task, rarely to daily. Vertical axis: how long each run takes, quick to slow. Top right, frequent and slow, is automate first. Bottom right, frequent and quick, is worth automating because it adds up. Top left, rare but risky, automate for safety. Bottom left, rare and quick, can stay manual." font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" style="display:block;min-width:660px;border-radius:12px;border:1px solid #e4e4e7;background:#fff;">
        <defs><style>@media (prefers-reduced-motion: no-preference){.cb-anim .cb-hot{animation:cb-p 2.6s ease-in-out infinite}@keyframes cb-p{0%,100%{opacity:.16}50%{opacity:.30}}}</style></defs>
        <text x="110" y="22" font-size="12.5" font-weight="800" fill="#09090b">Where to start: automate the top-right first</text>
        <rect class="cb-hot" x="410" y="34" width="290" height="118" rx="10" fill="${ACCENT}"/>
        <rect x="410" y="34" width="290" height="118" rx="10" fill="none" stroke="${ACCENT}" stroke-width="1.5"/>
        <rect x="110" y="34" width="290" height="118" rx="10" fill="#f4f4f5"/>
        <rect x="110" y="162" width="290" height="118" rx="10" fill="#fafafa"/>
        <rect x="410" y="162" width="290" height="118" rx="10" fill="#eff6ff"/>
        <text x="555" y="82" text-anchor="middle" font-size="14.5" font-weight="800" fill="#1d4ed8">Automate first</text>
        <text x="555" y="105" text-anchor="middle" font-size="11.5" fill="#3f3f46">frequent + mechanical</text>
        <text x="555" y="123" text-anchor="middle" font-size="11" fill="#71717a">the biggest time back</text>
        <text x="255" y="84" text-anchor="middle" font-size="13.5" font-weight="700" fill="#52525b">Automate for safety</text>
        <text x="255" y="106" text-anchor="middle" font-size="11" fill="#71717a">rare, but risky or error-prone</text>
        <text x="555" y="214" text-anchor="middle" font-size="13.5" font-weight="700" fill="#2563eb">Automate, it adds up</text>
        <text x="555" y="236" text-anchor="middle" font-size="11" fill="#52525b">quick, but done constantly</text>
        <text x="255" y="214" text-anchor="middle" font-size="13.5" font-weight="700" fill="#a1a1aa">Leave it manual</text>
        <text x="255" y="236" text-anchor="middle" font-size="11" fill="#a1a1aa">rare and quick</text>
        <text x="100" y="46" text-anchor="end" font-size="10.5" fill="#a1a1aa">Slow</text>
        <text x="100" y="278" text-anchor="end" font-size="10.5" fill="#a1a1aa">Quick</text>
        <text x="255" y="296" text-anchor="middle" font-size="10.5" fill="#a1a1aa">Rarely</text>
        <text x="555" y="296" text-anchor="middle" font-size="10.5" fill="#a1a1aa">Daily</text>
        <text x="22" y="158" text-anchor="middle" font-size="11.5" font-weight="700" fill="#71717a" transform="rotate(-90 22 158)">Time per run</text>
      </svg>
      <figcaption class="flowDiagramCaption">You do not have to automate everything. Start in the top-right, where a task is both frequent and time-consuming, and work down.</figcaption>
    </figure>`
}

// The shape every recipe shares: trigger -> check -> act (fan-out) -> approve if destructive -> record
function sharedShapeSvg() {
  const nodes = [
    ['Trigger', 'a schedule or an alert', '#3f3f46', false, ''],
    ['Check', 'measure the real state', '#3f3f46', false, ''],
    ['Act', 'run the fix, fanned out', ACCENT, true, 'FLEET FAN-OUT'],
    ['Approve', 'only if destructive', ACCENT, true, 'HUMAN GATE'],
    ['Record', 'audit trail + notify', '#16a34a', false, ''],
  ]
  const W = 190, GAP = 14, Y = 70, H = 92
  return `<figure class="flowDiagram" style="overflow-x:auto;">
      <svg class="cbflow" viewBox="0 0 1032 200" width="1032" height="200" role="img" aria-label="Every recipe follows the same five steps: a trigger from a schedule or an alert, a check of the real state, the action fanned out across the fleet, an approval only when the step is destructive, and a recorded audit trail plus a notification." font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" style="display:block;min-width:1000px;border-radius:12px;border:1px solid #e4e4e7;background:linear-gradient(180deg,#f8fbff,#eef4ff);">
        <defs>
          <marker id="cbf-ar" markerWidth="9" markerHeight="9" refX="6.5" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L7,3 L0,6 Z" fill="${ACCENT}"/></marker>
          <style>@media (prefers-reduced-motion: no-preference){.cbflow .cbf-l{stroke-dasharray:7 6;animation:cbf-f .8s linear infinite}@keyframes cbf-f{to{stroke-dashoffset:-13}}}</style>
        </defs>
        <text x="18" y="34" font-size="15" font-weight="800" fill="#09090b">Every recipe is the same five steps</text>
        <text x="18" y="54" font-size="12.5" fill="#71717a">Learn the shape once and all twelve read the same. A human signs off only on the destructive step.</text>
        ${nodes.map((n, i) => {
          const x = 18 + i * (W + GAP)
          const accent = n[3]
          const box = `<rect x="${x}" y="${Y}" width="${W}" height="${H}" rx="12" fill="${accent ? '#eff6ff' : '#fff'}" stroke="${accent ? ACCENT : '#e4e4e7'}" stroke-width="${accent ? 1.5 : 1}"/>` +
            `<circle cx="${x + 24}" cy="${Y + 26}" r="13" fill="${n[2]}" opacity="0.12"/><path d="${BOLT}" transform="translate(${x + 15},${Y + 15}) scale(0.8)" fill="${n[2]}"/>` +
            `<text x="${x + 44}" y="${Y + 31}" font-size="13.5" font-weight="800" fill="#18181b">${esc(n[0])}</text>` +
            `<text x="${x + 14}" y="${Y + 60}" font-size="11.5" fill="#52525b">${esc(n[1])}</text>` +
            (n[4] ? `<text x="${x + 14}" y="${Y + 80}" font-size="10" font-weight="800" fill="${ACCENT}">${esc(n[4])}</text>` : '')
          const arrow = i < nodes.length - 1 ? `<line class="cbf-l" x1="${x + W}" y1="${Y + H / 2}" x2="${x + W + GAP}" y2="${Y + H / 2}" stroke="${ACCENT}" stroke-width="2.5" marker-end="url(#cbf-ar)"/>` : ''
          return box + arrow
        }).join('')}
      </svg>
      <figcaption class="flowDiagramCaption">Trigger, check, act, approve if destructive, record. The twelve recipes below are all variations on these five steps.</figcaption>
    </figure>`
}

function codeBlock(code) { return `<pre class="codeBlock copyableCode"><code>${esc(code)}</code></pre>` }

const RECIPES = [
  {
    id: 'keep', group: 'Keep it running', blurb: 'Alert-triggered fixes for the things that break during the day.',
    items: [
      { n: 1, title: 'Free up a disk before it pages you', type: 'alert',
        manual: 'You get paged for a full volume, SSH in, hunt for the biggest files, delete, and restart whatever fell over.',
        saved: '~25 min per incident, and no 2am page',
        guard: 'Approval before it deletes at scale',
        runbook: `trigger: disk_used(/) > 85%            # or a nightly cron
steps:
  - run     du -sh /var/log/* | sort -h | tail
  - s3      archive /var/log/*.gz  ->  s3://logs-archive/$host/
  - approve channel=slack                # the next step deletes
  - run     truncate -s 0 /var/log/*.log ; docker system prune -f
  - notify  slack: "$host reclaimed <gb>G, back to <used>%"` },
      { n: 2, title: 'Restart a stuck service or worker', type: 'alert',
        manual: 'You notice a health check gone red or a queue backing up, SSH in, restart the process, and watch it recover.',
        saved: '~15 min per occurrence',
        guard: 'Escalates to on-call if the restart does not recover it',
        runbook: `trigger: healthcheck(app) fails x3      # ~90s window
steps:
  - run     journalctl -u app -n 50       # capture the why first
  - run     systemctl restart app
  - check   healthcheck(app) == ok
  - branch  if still failing:
      - notify slack @oncall "$host: restart did not recover app"` },
      { n: 3, title: 'Recover a CrashLoopBackOff pod', type: 'alert',
        manual: 'You see restart counts climbing, run describe and logs, then delete the pod or roll back the deploy by hand.',
        saved: '~20 min per incident',
        guard: 'Rolls back only the affected deployment',
        runbook: `trigger: pod.restarts > 5 in 10m
steps:
  - run     kubectl describe pod $pod ; kubectl logs $pod --previous --tail=80
  - branch  if it looks like a bad deploy:
      - run    kubectl rollout undo deploy/$deploy
    else:
      - run    kubectl delete pod $pod           # reschedule clean
  - notify  slack: pod, node, action taken` },
      { n: 4, title: 'Absorb a queue backlog', type: 'alert',
        manual: 'Traffic spikes, the queue grows, and you manually scale workers up, then remember to scale them back down later.',
        saved: '~30 min, and a missed SLA avoided',
        guard: 'Scales back to baseline automatically',
        runbook: `trigger: queue_depth(orders) > 5000 for 5m
steps:
  - run     kubectl scale deploy/worker --replicas=12
  - wait    until queue_depth < 500          # max 20m
  - run     kubectl scale deploy/worker --replicas=3
  - notify  slack: peak depth, drain time, replicas used` },
    ],
  },
  {
    id: 'prevent', group: 'Prevent the 3am page', blurb: 'Scheduled hygiene that stops the incident before it happens.',
    items: [
      { n: 5, title: 'Renew TLS certificates before they expire', type: 'sched',
        manual: 'You track expiry dates in a spreadsheet, renew by hand, reload the web server, and hope you did not miss one.',
        saved: '~1 hour a month, and the outage a lapsed cert causes',
        guard: null,
        runbook: `trigger: cron 0 6 * * *                 # daily
steps:
  - check   for host in endpoints: days_to_expiry(host)
  - branch  if days_to_expiry < 14:
      - run    certbot renew            # or re-issue via ACM
      - run    nginx -t && systemctl reload nginx
      - check  new cert served, expiry > 60d
  - notify  slack: renewed hosts + next-to-expire watchlist` },
      { n: 6, title: 'Verify backups actually restore', type: 'sched',
        manual: 'You trust the backup job exited zero, and find out it was broken only when you actually need to restore.',
        saved: 'a silent backup failure, caught before you need it',
        guard: 'Pages on-call if the test restore fails',
        runbook: `trigger: cron 0 3 * * 0                 # weekly
steps:
  - run     restore latest dump  ->  scratch database
  - check   row counts and checksums within tolerance
  - run     drop scratch database
  - branch  if check failed: page @oncall   # silent backup = real risk
  - notify  slack: PASS/FAIL, restore time, rows verified` },
      { n: 7, title: 'Run nightly database maintenance', type: 'sched',
        manual: 'You occasionally kill a long query and run VACUUM by hand, usually after the database has already slowed down.',
        saved: '~20 min a day, and the slow-query incident it prevents',
        guard: null,
        runbook: `trigger: cron 0 2 * * *                 # nightly, low traffic
steps:
  - run     terminate queries where state=active and runtime > 30m
  - run     VACUUM (ANALYZE)
  - run     REINDEX INDEX CONCURRENTLY <bloated_index>
  - notify  slack: dead tuples reclaimed, longest query killed` },
      { n: 8, title: 'Rotate and ship logs off the box', type: 'sched',
        manual: 'Logs fill the disk, you rotate and gzip by hand, then copy them somewhere before the volume fills again.',
        saved: 'a recurring disk-full page, gone',
        guard: null,
        runbook: `trigger: cron 30 1 * * *
steps:
  - run     gzip $(find /var/log -name '*.log' -mtime +1)
  - s3      sync /var/log/*.gz  ->  s3://logs/$host/   # then remove shipped
  - run     find /var/log -name '*.gz' -mtime +7 -delete
  - check   disk_used(/) after, report reclaimed` },
    ],
  },
  {
    id: 'idle', group: 'Stop paying for idle', blurb: 'Scheduled sweeps that hand money back to FinOps.',
    items: [
      { n: 9, title: 'Power down idle dev and staging overnight', type: 'sched',
        manual: 'Non-production runs all night because nobody remembers to stop it, and the monthly bill shows it.',
        saved: '~65% of non-prod compute cost',
        guard: null,
        runbook: `trigger: cron 0 20 * * 1-5  (stop)  /  0 8 * * 1-5  (start)
steps:
  - check   instances tag:env=nonprod, state=running
  - run     stop them              # the morning job starts them back
  - notify  slack: stopped N instances, saved ~<X> per night` },
      { n: 10, title: 'Delete orphaned volumes and old snapshots', type: 'sched',
        manual: 'Unattached volumes and stale snapshots pile up until a quarterly cost review that rarely actually happens.',
        saved: 'real monthly spend, and hours of cleanup',
        guard: 'Approval before anything is deleted',
        runbook: `trigger: cron 0 4 * * 1                 # weekly
steps:
  - check   volumes status=available + snapshots older than 30d
  - approve channel=slack                # deletion needs a human
  - run     delete approved volumes and snapshots
  - notify  slack: reclaimed ~<X>/mo, deleted IDs (audited)` },
      { n: 11, title: 'Prune Docker on CI runners and hosts', type: 'sched',
        manual: 'A runner disk fills with dead images and build cache, builds fail with no space left, and someone SSHes in.',
        saved: 'broken builds from a full runner, prevented',
        guard: null,
        runbook: `trigger: disk_used(/) > 80% on ci-runners   # or nightly
steps:
  - run     docker system prune -af --volumes --filter "until=168h"
  - run     docker builder prune -af
  - notify  slack: "$host reclaimed <gb>G of image and build cache"` },
    ],
  },
  {
    id: 'see', group: 'See it without logging in', blurb: 'Scheduled visibility, pushed to where the team already is.',
    items: [
      { n: 12, title: 'Send a morning fleet-health digest', type: 'sched',
        manual: 'You open three dashboards every morning to piece together whether anything actually needs your attention today.',
        saved: '~15 min a day per person, and earlier awareness',
        guard: null,
        runbook: `trigger: cron 0 8 * * 1-5
steps:
  - gather  hosts up/down, pods crashlooping, certs < 30d,
            last backup status, idle-resource spend
  - format  one card, red items first
  - notify  slack #ops   (+ WhatsApp to the on-call lead, optional)` },
    ],
  },
]

const CFG = {
  slug: 'ops-tasks-to-automate',
  title: '12 Daily Ops Tasks You Can Automate',
  h1: 'The Ops Automation Cookbook: 12 Daily Tasks You Can Stop Doing by Hand',
  excerpt: 'A practical cookbook of 12 repetitive ops tasks worth automating, each with a copy-paste runbook, the trigger to use, and the time it gives back.',
  keywords: 'tasks to automate, devops automation examples, what to automate, repetitive ops tasks, automation ideas, sysadmin automation, runbook examples, automate repetitive tasks, ops automation, disk cleanup automation, cert renewal automation, AlertMend',
  category: 'Automation',
  faqs: [
    ['Which ops tasks should I automate first?', 'Start with the work that is frequent, mechanical, and low-judgment: freeing a full disk, restarting a stuck service, renewing certificates, pruning Docker on CI runners, and sweeping idle cloud spend. These run the same way every time, so a runbook covers them cleanly and you feel the time saved immediately. Leave the rare, high-judgment tasks for later.'],
    ['How do I know a task is worth automating?', 'Score it on three things: how often you do it, how long each run takes, and how much judgment it needs. Anything you do weekly or more, that takes real time, and that follows the same steps every time is a strong candidate. A task you touch once a quarter that needs careful thought each time usually is not, unless it is risky enough that a scripted, audited version is safer than doing it by hand.'],
    ['Is it safe to auto-remediate production?', 'Yes, when the automation is governed. Low-risk, reversible steps like a restart or a log rotation can run unattended. Anything destructive or customer-impacting pauses for a Slack, Microsoft Teams, or Email approval before it runs, permissions are scoped with RBAC, and every host touched and command run is recorded. That combination is usually safer than a human doing the same thing by hand at 2am.'],
    ['What is the difference between this and a cron job with a bash script?', 'A cron script runs one command on one host with no branching, no fleet fan-out, no approval gate, and no record of what happened. A runbook checks a condition first, fans the same action out across every matching host or pod in one run, pauses for a human only where the risk is real, and logs every step, without you maintaining the glue code and keeping the on-call knowledge in one person head.'],
    ['Can I start with just one runbook?', 'Yes, and you should. Pick the single task that wakes you up or eats the most of your week, automate that one end to end, and prove it. Once it is running and audited, the same engine covers the next task, then the next. There is no need to automate all twelve at once.'],
    ['How long does it take to set up a runbook?', 'Most take from a few minutes to about an hour. Runbooks are built visually on a canvas from reusable steps, so a disk-cleanup or cert-renewal flow is quick to assemble, test on one host, and then roll out across the fleet. The time goes into deciding the guardrails, not writing glue code.'],
    ['Do these need an agent installed on every server?', 'No. AlertMend runs the host-level recipes agentlessly over SSH, and reaches Kubernetes, cloud APIs, databases, and messaging through connectors. There is no per-server agent to install, update, or secure, which is one less thing to maintain on the fleet you are trying to simplify.'],
    ['Should a runbook be triggered by a schedule or an alert?', 'Both, depending on the task. Hygiene work like cert checks, log rotation, and idle-resource sweeps runs on a schedule so it happens before anything breaks. Reactive work like recovering a crashlooping pod or absorbing a queue backlog is triggered by the alert you already have. The same runbook engine handles either trigger.'],
    ['How do approvals work for the destructive tasks?', 'A step marked as requiring approval pauses the run and posts to Slack, Microsoft Teams, or Email with the context and the exact action it wants to take. It proceeds only after an authorized person signs off, and the approval is recorded with the rest of the audit trail. Deleting volumes, dropping data, or cleaning at fleet scale are the usual places to gate.'],
    ['Does automating these tasks replace my monitoring?', 'No, it complements it. Monitoring and dashboards tell you something is wrong or drifting. These runbooks are the layer that acts on that signal: they take the alert or the schedule and do the fix, the cleanup, or the report. You keep Grafana, Prometheus, or whatever you use today, and add the hands that respond to it.'],
    ['Can it send the morning health digest to Slack or WhatsApp?', 'Yes. A scheduled report can gather host, pod, certificate, backup, and cost status into one card and push it to Slack, Microsoft Teams, or Email on a calendar, and route a copy to WhatsApp for the on-call lead. The team sees the state of production without opening three dashboards every morning.'],
    ['How much time can I realistically save?', 'It depends on how many of these you still do by hand and how often, but teams commonly reclaim on the order of a day a week once the recurring recipes are automated. Use the calculator above with your own numbers: even a handful of tasks, done a few times a week, adds up to weeks of engineering time over a year.'],
  ],
}

function jsonLd() {
  const canonical = `${SITE_URL}/blog/${CFG.slug}`, img = `${SITE_URL}/assets/${CFG.slug}/hero.png`
  const article = { '@context': 'https://schema.org', '@type': 'TechArticle', headline: CFG.title, description: CFG.excerpt, image: img, datePublished: DATE, dateModified: MODIFIED, author: { '@type': 'Person', name: AUTHOR, jobTitle: 'Co-Founder at AlertMend.io', url: LINKEDIN, sameAs: [LINKEDIN] }, publisher: { '@type': 'Organization', name: 'AlertMend AI', logo: { '@type': 'ImageObject', url: `${SITE_URL}/logos/alertmend-logo.svg` } }, mainEntityOfPage: { '@type': 'WebPage', '@id': canonical } }
  const faq = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: CFG.faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) }
  return [article, faq].map((o) => `  <script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n')
}

function recipeHtml(it) {
  const badge = it.type === 'alert' ? 'ON ALERT' : 'SCHEDULED'
  const guard = it.guard ? `<span class="recipeGuard">${SHIELD} ${esc(it.guard)}</span>` : ''
  return `<div class="recipe">
        <div class="recipeTop"><span class="recipeNum">${it.n}</span><h4>${esc(it.title)}</h4><span class="recipeTrigger ${it.type}">${badge}</span></div>
        <p class="recipeManual"><b>By hand today:</b> ${esc(it.manual)}</p>
        ${codeBlock(it.runbook)}
        <div class="recipeFoot"><span class="recipeSaved">${CLOCK} ${esc(it.saved)}</span>${guard}</div>
      </div>`
}

function render() {
  const canonical = `${SITE_URL}/blog/${CFG.slug}`, cal = calendlyUrl(CFG.slug), img = `${SITE_URL}/assets/${CFG.slug}/hero.png`
  const related = [['automate-ops-toil', 'Runbook Automation for Toil'], ['cross-stack-incident-automation', 'Cross-Stack Incident Automation'], ['vm-monitoring-and-automation', 'VM Monitoring and Auto-Remediation']]
  const relatedSidebar = [
    { slug: 'automate-ops-toil', title: 'Runbook Automation for Toil (the strategy)' },
    { slug: 'cross-stack-incident-automation', title: 'Automate Complex Incidents with Runbooks' },
    { slug: 'vm-monitoring-and-automation', title: 'Linux VM Monitoring and Auto-Remediation' },
    { slug: 'top-kubernetes-cost-management-solutions', title: 'Top Kubernetes Cost Management Solutions' },
    { slug: 'gpu-monitoring', title: 'GPU Monitoring: Detect Idle and Recover' },
  ]
  const stories = [
    { tag: 'E-commerce · peak traffic · recipe 1', title: 'The 2am disk that almost took down checkout',
      scene: 'It is 2:11am on the busiest sales night of the year. A noisy deploy triples log volume and <b>/var on the checkout tier hits 98%</b>. Orders start failing with 500s at the worst possible moment.',
      without: 'The page fires, on-call wakes up, connects to the right host, finds the runaway log, and truncates it. Fifteen minutes, most of it just getting to a terminal, and every minute is lost orders at peak.',
      with: 'At 85% the runbook had already archived the logs to S3, truncated, pruned Docker, and posted "checkout-3 reclaimed 22G, back to 41%" to Slack. The 500s never started and nobody woke up.',
      payoff: 'MTTR from ~15 minutes to ~40 seconds, and zero lost checkout minutes' },
    { tag: 'SaaS · reliability · recipe 5', title: 'The certificate nobody was watching',
      scene: 'A wildcard cert on the API gateway is set to expire Sunday at 03:00. It lives in three places and one spreadsheet, and the one that matters is not on the spreadsheet. <b>No one is looking.</b>',
      without: 'Monday morning every mobile client fails TLS, support lights up, and the team burns the first hour of the week finding which cert lapsed instead of shipping.',
      with: 'Every morning a scheduled runbook checked days-to-expiry across all endpoints. It saw 12 days left, re-issued, reloaded nginx, verified the new cert was being served, and posted the next-to-expire watchlist. The Monday outage simply never happened.',
      payoff: 'A full TLS outage avoided, and about an hour a month of manual tracking gone' },
  ]
  const industries = [
    ['E-commerce and retail', 'Disk-before-peak, queue backlog, overnight non-prod, morning digest', 'Uptime during a traffic spike is revenue, and non-production idles all weekend on the bill.'],
    ['SaaS and B2B platforms', 'Cert renewal, CrashLoopBackOff recovery, DB maintenance, backup verify', 'Reliability is the product, so the quiet failures are the ones that churn customers.'],
    ['Fintech and regulated', 'Backup-restore verification, approval-gated cleanup, certificate checks', 'Auditors want proof a restore actually works and a record of who approved what.'],
    ['Agencies and MSPs', 'All twelve, fanned out across every client environment', 'One runbook maintained once and run against dozens of tenants is the whole margin.'],
    ['AI and ML platforms', 'Idle-GPU sweep, disk and log hygiene on training boxes, queue scaling', 'Idle accelerators are the budget, and training logs fill a disk fast.'],
  ]
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(CFG.title)} | AlertMend AI</title>
  <meta name="description" content="${esc(CFG.excerpt)}">
  <meta name="keywords" content="${esc(CFG.keywords)}">
  <meta name="author" content="${AUTHOR}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <link rel="canonical" href="${canonical}">
  <link rel="icon" type="image/svg+xml" href="/logos/alertmend-logo.svg">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${canonical}">
  <meta property="og:title" content="${esc(CFG.title)}">
  <meta property="og:description" content="${esc(CFG.excerpt)}">
  <meta property="og:image" content="${img}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(CFG.title)}">
  <meta name="twitter:description" content="${esc(CFG.excerpt)}">
  <meta name="twitter:image" content="${img}">
${jsonLd()}
  <link rel="stylesheet" href="/assets/make-error-127/styles.css">
  <link rel="stylesheet" href="/assets/${CFG.slug}/styles.css">
  <style>${CHROME_INLINE_CSS}${AUTHOR_CRED_CSS}${ANSWER_CARD_CSS}</style>
</head>
<body>
${buildNavHtml(CFG.slug, cal)}
  <div class="main-container">
    <div class="content-wrapper">
      <div class="main-col">
${buildCredArticleHeader(CFG.h1, DATE, CFG.category)}
      <div class="proofBar" style="display:flex;flex-wrap:wrap;gap:8px 16px;align-items:center;margin:0 0 1.5rem;color:#52525b;font-size:.82rem;">
        <span style="display:inline-flex;align-items:center;gap:6px;font-weight:700;color:#047857;"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>12 runbooks you can copy, each agentless, governed, and audited</span>
        <span style="color:#d4d4d8;">&bull;</span><span>Last reviewed ${MODIFIED}</span>
      </div>
    <div class="dl-blog">
      <section class="heroBand heroBandCompact">
        <p class="heroGuideLabel">AlertMend automation · daily tasks, done for you</p>
        <div class="instantFix">
          <div class="instantFixTop"><span>THE 60-SECOND ANSWER</span><strong>Automate the tasks that are frequent, mechanical, and low-judgment first.</strong></div>
          <p>You do not need to automate everything. Start with the recurring work that is the same every time: freeing a full disk, renewing a certificate, restarting a stuck worker, sweeping idle cloud spend. Below are 12 of them, each written as a runbook you can copy, with the trigger to use and the time it gives back.</p>
          <div class="instantFixCommands">
            <code>frequent + mechanical</code><span>automate first</span>
            <code>rare + risky</code><span>automate for safety</span>
            <code>rare + quick</code><span>leave it manual</span>
          </div>
        </div>
      </section>

      <div class="pillarLink">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${ACCENT}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
        <p>This is the recipe book. For the strategy behind it, why toil scales with your fleet, how fan-out works, and how to govern automated cleanup, read the pillar: <a href="/blog/automate-ops-toil">Runbook Automation for Toil</a>.</p>
      </div>

      <nav class="articleToc" aria-label="On this page"><strong>On this page</strong>
        <a href="#pick">Where to start</a>
        <a href="#recipes">The 12 recipes</a>
        <a href="#stories">In the real world</a>
        <a href="#industry">By industry</a>
        <a href="#calc">Your time back</a>
        <a href="#how">How AlertMend runs them</a>
        <a href="#faq">FAQ</a>
      </nav>

      <h2 class="sectionHead" id="pick">Not what to automate. What to automate first.</h2>
      <p class="bodyText">The mistake is trying to automate everything at once, or automating the interesting thing instead of the frequent thing. The tasks that pay back first are the ones that are both routine and time-consuming: you do them constantly, they follow the same steps every time, and they need almost no judgment. Plot your work on two axes, how often you do it and how long each run takes, and the priority order falls out on its own.</p>
      ${quadrantSvg()}
      <div class="recipeLegend"><span><b>How to read each recipe:</b></span><span><b>By hand today</b> = the manual version</span><span><b>ON ALERT</b> or <b>SCHEDULED</b> = the trigger</span><span><b>runbook</b> = copy it</span><span>${CLOCK} = the time it gives back</span></div>

      <h2 class="sectionHead" id="recipes">The 12 recipes</h2>
      <p class="sectionSub">Each one is a real piece of daily ops work, written as a runbook you can lift. The config is illustrative; the real runbook is visual, versioned, and fanned out across your fleet.</p>
      ${sharedShapeSvg()}
      ${RECIPES.map((g) => `<div class="rgroup" id="${g.id}">
        <div class="rgroupHead"><h3>${esc(g.group)}</h3><span>${esc(g.blurb)}</span></div>
        ${g.items.map(recipeHtml).join('\n        ')}
      </div>`).join('\n      ')}

      <div class="ctaInline">Which of these does your team still do by hand? <a href="${cal}" target="_blank" rel="noopener noreferrer">Book a free consultation &rarr;</a> and we will turn your worst one into a runbook.</div>

      <h2 class="sectionHead" id="stories">Two of these, on the day they mattered</h2>
      <p class="sectionSub">The recipes look small on paper. Here is what they are worth when it counts.</p>
      <div class="storyGrid">
        ${stories.map((s) => `<div class="storyCard revealUp">
          <span class="storyTag">${esc(s.tag)}</span>
          <h4>${esc(s.title)}</h4>
          <p class="storyScene">${s.scene}</p>
          <div class="storyCompare">
            <div class="storyCol bad"><span>Without automation</span><p>${esc(s.without)}</p></div>
            <div class="storyCol good"><span>With the runbook</span><p>${esc(s.with)}</p></div>
          </div>
          <div class="storyPayoff">${CLOCK} ${esc(s.payoff)}</div>
        </div>`).join('\n        ')}
      </div>

      <h2 class="sectionHead" id="industry">Which recipes matter most, by industry</h2>
      <p class="sectionSub">All twelve are universal, but the ones that pay back first depend on what you run.</p>
      <div class="diyWrap"><table class="compareTable"><thead><tr><th>Industry</th><th>Start with these</th><th>Why</th></tr></thead><tbody>
        ${industries.map((r) => `<tr><td>${esc(r[0])}</td><td class="diyHighlight">${esc(r[1])}</td><td>${esc(r[2])}</td></tr>`).join('\n        ')}
      </tbody></table></div>

      <h2 class="sectionHead" id="calc">Add up your week</h2>
      <p class="bodyText">Any single recipe looks small. The point is that they repeat, every day, across every host. Put in how many of these your team still does by hand, how often, and how long each takes, and see the time an automated version gives back.</p>
      <div class="calc">
        <div class="calcHead">Time saved with AlertMend automation</div>
        <div class="calcRow"><label>Tasks you still do by hand <output id="c-tasks">8</output></label><input type="range" id="i-tasks" min="1" max="12" value="8" aria-label="Number of tasks you still do by hand"></div>
        <div class="calcRow"><label>Times each is done per week <output id="c-runs">5</output></label><input type="range" id="i-runs" min="1" max="40" value="5" aria-label="Times each task is done per week"></div>
        <div class="calcRow"><label>Minutes a single run takes <output id="c-mins">12</output></label><input type="range" id="i-mins" min="2" max="45" value="12" aria-label="Minutes a single run takes"></div>
        <div class="calcOut">
          <div class="calcStat"><span id="o-week">0</span><label>hours / week</label></div>
          <div class="calcStat"><span id="o-month">0</span><label>hours / month</label></div>
          <div class="calcStat"><span id="o-year">0</span><label>work-days / year</label></div>
        </div>
        <p class="calcNote">Assumes automation removes about 85% of the hands-on time. The sliders are yours to adjust.</p>
      </div>

      <h2 class="sectionHead" id="how">How AlertMend runs all twelve</h2>
      <p class="bodyText">Every recipe above follows the same shape: a trigger, a check, an action, an optional approval on the destructive step, and a recorded result. AlertMend runs the host-level ones agentlessly over SSH, and reaches Kubernetes, cloud APIs, databases, and messaging through connectors, so there is no per-server agent to install or maintain. A step can fan out across every host or pod that matches, so one runbook covers three servers today and three hundred next year without a rewrite.</p>
      <p class="bodyText">The parts that make it safe to run against production are built in. Destructive steps pause for a Slack, Microsoft Teams, or Email approval, permissions are scoped with RBAC, and every host touched, command run, and file removed is recorded, so a scheduled sweep is auditable rather than a black box. That is the difference between a cron script you are afraid to trust and automation you are happy to leave running. For the reactive side of the same engine, recovering a crashlooping service or a stuck deploy the moment an alert fires, see <a href="/blog/cross-stack-incident-automation">cross-stack incident automation</a>, and for the host layer specifically, <a href="/blog/vm-monitoring-and-automation">VM monitoring and auto-remediation</a>.</p>
      <div class="calloutBox"><strong>The payoff:</strong> a single "clean the disk over 85%" recipe covers your whole backend fleet in one scheduled pass, with nobody watching and a human signing off only before it deletes. Multiply that by the eleven others and you are handing your team back a meaningful slice of every week.</div>

      <h2 class="sectionHead" id="faq">Ops automation FAQ</h2>
      <div class="faqList">${CFG.faqs.map(([q, a], i) => `<div class="faqItem"><button type="button" class="faqQuestion" data-faq-toggle aria-expanded="${i === 0 ? 'true' : 'false'}">${esc(q)}<svg class="faqChevron${i === 0 ? ' faqChevronOpen' : ''}" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 9l6 6 6-6"/></svg></button><div class="faqAnswer${i === 0 ? '' : ' hidden'}">${esc(a)}</div></div>`).join('')}</div>
${authorCard()}
      <div class="ctaBand">
        <div class="ctaBandTitle">Pick one task. We will turn it into a runbook.</div>
        <p class="ctaBandSub">Bring the recurring task your team does by hand every week, the disk sweep, the cert renewal, the idle-resource cleanup, the morning health check. We will turn it into an AlertMend runbook, fanned out across your fleet, with an approval gate on the destructive steps and a full audit trail. The consultation is free and with no obligation.</p>
        <div class="ctaBtnRow"><a href="${cal}" class="ctaBtn" target="_blank" rel="noopener noreferrer">Book a free consultation &rarr;</a></div>
      </div>
    </div>
    <div class="promo"><p><strong>Related:</strong> ${related.map(([s, l]) => `<a href="/blog/${s}">${esc(l)}</a>`).join(' &middot; ')}</p></div>
      </div>
${buildSidebarHtml(relatedSidebar, CFG.h1)}
    </div>
  </div>
  <script src="/assets/${CFG.slug}/script.js" defer></script>
</body>
</html>
`
}

function heroSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"><defs><linearGradient id="hg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0b1220"/><stop offset="1" stop-color="${ACCENT_DARK}"/></linearGradient></defs><rect width="1200" height="630" fill="url(#hg)"/><g transform="translate(80,80)"><circle cx="22" cy="22" r="22" fill="${ACCENT}"/><text x="22" y="30" font-size="22" font-weight="800" fill="#fff" text-anchor="middle">A</text><text x="56" y="30" font-size="24" font-weight="700" fill="#fff">AlertMend</text><text x="228" y="30" font-size="18" fill="#93a4c8">· automation cookbook</text></g><path d="${BOLT}" transform="translate(980,70) scale(6)" fill="${ACCENT}"/><text x="80" y="248" font-size="58" font-weight="800" fill="#fff">The Ops Automation Cookbook</text><text x="80" y="312" font-size="31" font-weight="700" fill="${ACCENT}">12 daily tasks you can stop doing by hand.</text><g font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="19"><rect x="80" y="366" width="1040" height="150" rx="14" fill="#101a2e" stroke="#24324f"/><text x="108" y="404" fill="#93c5fd">trigger</text><text x="320" y="404" fill="#dbe6ff">a schedule or the alert you already have</text><text x="108" y="440" fill="#93c5fd">act</text><text x="320" y="440" fill="#dbe6ff">the same fix, fanned out across the fleet</text><text x="108" y="476" fill="#93c5fd">govern</text><text x="320" y="476" fill="#dbe6ff">approval on destructive steps + full audit</text></g><text x="80" y="566" font-size="19" fill="#93a4c8">alertmend.io · each recipe is a runbook you can copy</text></svg>\n`
}

const dir = path.join(root, 'public/blog', CFG.slug)
const assets = path.join(root, 'public/assets', CFG.slug)
fs.mkdirSync(dir, { recursive: true }); fs.mkdirSync(assets, { recursive: true })
fs.writeFileSync(path.join(dir, 'index.html'), render())
fs.writeFileSync(path.join(assets, 'script.js'), appendBlogSignupHandler(SCRIPT_JS))
fs.writeFileSync(path.join(assets, 'styles.css'), '/* base from make-error-127; accent + answer-card + recipes + calc inlined in <style> */\n')
fs.writeFileSync(path.join(assets, 'hero.svg'), heroSvg())
fs.writeFileSync(path.join(root, 'public/blog', `${CFG.slug}.md`), `---
title: "${CFG.title}"
excerpt: "${CFG.excerpt}"
date: "${DATE}"
dateModified: "${MODIFIED}"
category: "${CFG.category}"
author: "${AUTHOR}"
keywords: "${CFG.keywords}"
---

This post is published as a rich interactive page at [/blog/${CFG.slug}](/blog/${CFG.slug}).
`)
const tl = CFG.title.length + 15
const totalRecipes = RECIPES.reduce((a, g) => a + g.items.length, 0)
console.log(`✓ ${CFG.slug}  title+suffix ${tl}${tl < 30 || tl > 60 ? ' [LEN!]' : ''}  excerpt ${CFG.excerpt.length}  recipes ${totalRecipes}  faqs ${CFG.faqs.length}`)
