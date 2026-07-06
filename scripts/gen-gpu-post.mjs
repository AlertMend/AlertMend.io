/**
 * GPU monitoring post: monitor GPUs, detect idle spend, catch stalled workloads,
 * and auto-recover failures. Reuses make-error-127 rich CSS.
 * AlertMend GPU capability (per features_april_2026.md): per-GPU util/mem/ECC/thermal/MIG,
 * $/hr burn + idle detection, training/inference signals, AI RCA, and governed recovery.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { SITE_URL, esc, CHROME_INLINE_CSS, buildNavHtml, buildSidebarHtml, buildArticleHeader, calendlyUrl } from './static-blog-shared.mjs'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const ALERTMEND_LOGO_DATA_URI = `data:image/svg+xml;base64,${fs.readFileSync(path.join(root, 'public/alertmend-logo.svg')).toString('base64')}`
const DATE = '2026-01-10', MODIFIED = '2026-07-05', CAT = 'GPU'

const SCRIPT_JS = `(function () {
  document.querySelectorAll('[data-faq-toggle]').forEach((b) => {
    b.addEventListener('click', () => {
      const item = b.closest('.faqItem'); const answer = item && item.querySelector('.faqAnswer'); const chev = b.querySelector('.faqChevron');
      const open = b.getAttribute('aria-expanded') === 'true';
      b.setAttribute('aria-expanded', open ? 'false' : 'true');
      if (answer) answer.classList.toggle('hidden', open); if (chev) chev.classList.toggle('faqChevronOpen', !open);
    });
  });
  document.querySelectorAll('.copyableCode').forEach((block) => {
    const code = block.querySelector('code'); if (!code) return;
    const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'codeCopyButton'; btn.textContent = 'Copy';
    btn.addEventListener('click', async () => { try { await navigator.clipboard.writeText(code.textContent || ''); btn.textContent = 'Copied'; setTimeout(() => { btn.textContent = 'Copy'; }, 1600); } catch { btn.textContent = 'Select text'; } });
    block.appendChild(btn);
  });
  var G = document.getElementById('roiGpus'), R = document.getElementById('roiRate'), I = document.getElementById('roiIdle');
  if (G && R && I) {
    var oG = document.getElementById('outGpus'), oR = document.getElementById('outRate'), oI = document.getElementById('outIdle');
    var moEl = document.getElementById('roiMo'), yrEl = document.getElementById('roiYr'), rcEl = document.getElementById('roiReclaim');
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var prev = { mo: 0, yr: 0 };
    function fmt(n) { return '$' + Math.round(n).toLocaleString('en-US'); }
    function countUp(el, to, from) {
      if (reduce) { el.textContent = fmt(to); return; }
      var t0 = performance.now();
      function step(t) { var k = Math.min(1, (t - t0) / 500); var e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; el.textContent = fmt(from + (to - from) * e); if (k < 1) requestAnimationFrame(step); }
      requestAnimationFrame(step);
    }
    function calc() {
      var g = +G.value, r = +R.value, i = +I.value;
      oG.textContent = g; oR.textContent = '$' + r.toFixed(2); oI.textContent = i + '%';
      var m = g * r * 730 * (i / 100), y = m * 12;
      countUp(moEl, m, prev.mo); countUp(yrEl, y, prev.yr); prev.mo = m; prev.yr = y;
      rcEl.innerHTML = 'Recover even half with idle detection and reclaim: <b>' + fmt(m * 0.5) + '/mo</b> back, <b>' + fmt(y * 0.5) + '/yr</b>.';
    }
    [G, R, I].forEach(function (el) { el.addEventListener('input', calc); });
    calc();
  }
})();
`

const EXTRA_CSS = `.roiFacts{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:14px;margin:1.3rem 0;}
.roiFact{background:linear-gradient(180deg,#faf9ff,#f3f1fb);border:1px solid #e4e4e7;border-radius:12px;padding:16px;}
.roiFact span{display:block;font-size:.74rem;font-weight:700;color:#7c3aed;text-transform:uppercase;letter-spacing:.04em;}
.roiFact strong{display:block;font-size:1.5rem;font-weight:800;color:#09090b;margin:6px 0 3px;font-variant-numeric:tabular-nums;}
.roiFact em{font-style:normal;font-size:.85rem;color:#52525b;}
.roiCalc{border:1px solid #ddd6fe;border-radius:16px;padding:22px;background:#faf5ff;margin:1.3rem 0;}
.roiCalcTitle{font-weight:700;font-size:1.05rem;color:#09090b;margin:0 0 8px;}
.roiRow{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:16px 0 4px;}
.roiRow label{font-size:.9rem;color:#3f3f46;font-weight:600;}
.roiRow output{font-weight:800;color:#6d28d9;font-variant-numeric:tabular-nums;}
.roiCalc input[type=range]{width:100%;accent-color:#7c3aed;height:6px;cursor:pointer;}
.roiResult{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:20px;}
.roiResult div{background:#fff;border:1px solid #e9d5ff;border-radius:12px;padding:16px;text-align:center;}
.roiResult span{display:block;font-size:.78rem;color:#52525b;font-weight:600;}
.roiResult strong{display:block;font-size:1.85rem;font-weight:800;color:#7c3aed;margin-top:4px;font-variant-numeric:tabular-nums;}
.roiReclaim{margin-top:14px;font-size:.9rem;color:#3f3f46;text-align:center;}
.roiReclaim b{color:#047857;}
.ctaInline{margin:1.3rem 0;padding:14px 18px;border-left:3px solid #7c3aed;background:#faf5ff;border-radius:0 10px 10px 0;font-weight:600;color:#3f3f46;}
.ctaInline a{color:#6d28d9;text-decoration:underline;}
.sourceNote{font-size:.82rem;color:#71717a;margin:.6rem 0 0;}
.sourceNote a{color:#6d28d9;}
`

// animated GPU utilization gauge: busy -> idle (burning $) -> recovered
function gpuGauge() {
  const X = 60, W = 840, Y = 96, H = 46
  const px = (p) => X + (p / 100) * W
  return `<figure class="flowDiagram">
      <svg class="gp-anim" viewBox="0 0 960 250" width="960" height="250" role="img" aria-label="A GPU running at healthy utilization drops to near zero while still allocated, so it burns money idle, until monitoring alerts and the workload is reclaimed or restarted." font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" style="display:block;width:100%;height:auto;border-radius:12px;border:1px solid #e4e4e7;background:linear-gradient(180deg,#faf9ff,#f3f1fb);">
        <defs><style>@media (prefers-reduced-motion: no-preference){
          .gp-anim .g-fill { animation: gp-fill 7s ease-in-out infinite; }
          @keyframes gp-fill { 0%,26% { width:${(72 / 100) * W}px; fill:#16a34a } 44% { width:${(3 / 100) * W}px; fill:#dc2626 } 66% { width:${(3 / 100) * W}px; fill:#dc2626 } 86%,100% { width:${(68 / 100) * W}px; fill:#16a34a } }
          .gp-anim .g-badge { animation: gp-badge 7s ease-in-out infinite; }
          @keyframes gp-badge { 0%,30% { opacity:0 } 46%,64% { opacity:1 } 80%,100% { opacity:0 } }
        }</style></defs>
        <text x="${X}" y="72" font-size="15" font-weight="700" fill="#09090b">GPU utilization (H100 · $/hr running either way)</text>
        <rect x="${X}" y="${Y}" width="${W}" height="${H}" rx="10" fill="#eef0f4" stroke="#e4e4e7"/>
        <rect class="g-fill" x="${X}" y="${Y}" width="${(72 / 100) * W}" height="${H}" rx="10" fill="#16a34a"/>
        <line x1="${px(15)}" y1="${Y - 8}" x2="${px(15)}" y2="${Y + H + 8}" stroke="#f59e0b" stroke-width="2" stroke-dasharray="3 3"/><text x="${px(15)}" y="${Y + H + 26}" font-size="12" fill="#f59e0b" text-anchor="middle">idle floor 15%</text>
        <g class="g-badge"><rect x="${X + W - 250}" y="${Y - 40}" width="250" height="30" rx="15" fill="#7f1d1d"/><text x="${X + W - 125}" y="${Y - 20}" font-size="13" font-weight="700" fill="#fff" text-anchor="middle">IDLE · still billing $/hr</text></g>
      </svg>
      <figcaption class="flowDiagramCaption">A GPU that drops below the idle floor while still allocated costs the same as one at full load. Catching it early is where the savings and the reliability both live.</figcaption>
    </figure>`
}

// recovery flow: idle / stalled / crash -> AlertMend -> notify + act -> recovered
function recoveryFlow() {
  return `<figure class="flowDiagram">
      <svg class="gr-anim" viewBox="0 0 970 240" width="970" height="240" role="img" aria-label="A GPU goes idle, stalls, or crashes; AlertMend detects it and runs AI root-cause analysis; then it notifies the team and auto-recovers or reclaims the GPU." font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" style="display:block;width:100%;height:auto;border-radius:12px;border:1px solid #e4e4e7;background:linear-gradient(180deg,#faf9ff,#f3f1fb);">
        <defs>
          <marker id="gr-ar" markerWidth="9" markerHeight="9" refX="6.5" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L7,3 L0,6 Z" fill="#7c3aed"/></marker>
          <style>@media (prefers-reduced-motion: no-preference){ .gr-anim .r-flow{ stroke-dasharray:8 6; animation: gr-f .8s linear infinite } @keyframes gr-f{ to{ stroke-dashoffset:-14 } } .gr-anim .r-am{ transform-box:fill-box; transform-origin:center; animation: gr-p 2.4s ease-in-out infinite } @keyframes gr-p{ 0%,100%{ transform:scale(1) } 50%{ transform:scale(1.07) } } }</style>
        </defs>
        <rect x="16" y="60" width="200" height="120" rx="12" fill="#fff" stroke="#fecaca"/>
        <text x="116" y="88" font-size="14" font-weight="700" fill="#b91c1c" text-anchor="middle">GPU problem</text>
        <text x="116" y="112" font-size="12" fill="#52525b" text-anchor="middle">idle &amp; billing</text>
        <text x="116" y="132" font-size="12" fill="#52525b" text-anchor="middle">stalled mid-run</text>
        <text x="116" y="152" font-size="12" fill="#52525b" text-anchor="middle">crash / OOM at 3am</text>
        <line class="r-flow" x1="218" y1="120" x2="378" y2="120" stroke="#7c3aed" stroke-width="2.5" marker-end="url(#gr-ar)"/>
        <g class="r-am"><rect x="384" y="52" width="210" height="136" rx="16" fill="#faf5ff" stroke="#ddd6fe"/><image href="/logos/alertmend-logo.svg" x="404" y="70" width="38" height="38" preserveAspectRatio="xMidYMid meet"/><text x="452" y="94" font-size="15" font-weight="700" fill="#09090b">AlertMend</text><text x="404" y="132" font-size="12" fill="#6d28d9">Detects idle, stall, crash,</text><text x="404" y="150" font-size="12" fill="#6d28d9">runs AI root-cause,</text><text x="404" y="168" font-size="12" fill="#6d28d9">notifies and acts.</text></g>
        <line class="r-flow" x1="596" y1="120" x2="756" y2="120" stroke="#16a34a" stroke-width="2.5" marker-end="url(#gr-ar)"/>
        <rect x="760" y="60" width="196" height="120" rx="12" fill="#ecfdf5" stroke="#a7f3d0"/>
        <text x="858" y="96" font-size="14" font-weight="700" fill="#047857" text-anchor="middle">Recovered</text>
        <text x="858" y="120" font-size="12" fill="#059669" text-anchor="middle">reclaimed if idle</text>
        <text x="858" y="140" font-size="12" fill="#059669" text-anchor="middle">restarted if stalled</text>
        <text x="858" y="160" font-size="12" fill="#059669" text-anchor="middle">back online if crashed</text>
      </svg>
      <figcaption class="flowDiagramCaption">Whatever the trigger, the loop is the same: detect, diagnose, then notify and act, reclaim an idle GPU, restart a stalled worker, or bring a crashed one back.</figcaption>
    </figure>`
}

function codeBlock(code) { return `<pre class="codeBlock copyableCode"><code>${esc(code)}</code></pre>` }

function jsonLd(cfg) {
  const canonical = `${SITE_URL}/blog/${cfg.slug}`, img = `${SITE_URL}/assets/${cfg.slug}/hero.png`
  const blog = { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: cfg.title, description: cfg.excerpt, image: img, datePublished: DATE, dateModified: MODIFIED, author: { '@type': 'Organization', name: 'AlertMend Team' }, publisher: { '@type': 'Organization', name: 'AlertMend AI', logo: { '@type': 'ImageObject', url: `${SITE_URL}/logos/alertmend-logo.svg` } }, mainEntityOfPage: { '@type': 'WebPage', '@id': canonical } }
  const faq = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: cfg.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) }
  const howto = { '@context': 'https://schema.org', '@type': 'HowTo', name: 'Monitor GPUs for idle, stalled, and failed workloads', description: cfg.excerpt, step: cfg.diagnose.map(([name, text], i) => ({ '@type': 'HowToStep', position: i + 1, name, text })) }
  return [blog, faq, howto].map((o) => `  <script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n')
}

function render(cfg) {
  const canonical = `${SITE_URL}/blog/${cfg.slug}`, cal = calendlyUrl(cfg.slug), img = `${SITE_URL}/assets/${cfg.slug}/hero.png`
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(cfg.title)} | AlertMend AI</title>
  <meta name="description" content="${esc(cfg.excerpt)}">
  <meta name="keywords" content="${esc(cfg.keywords)}">
  <meta name="author" content="AlertMend Team">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <link rel="canonical" href="${canonical}">
  <link rel="icon" type="image/svg+xml" href="/logos/alertmend-logo.svg">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${canonical}">
  <meta property="og:title" content="${esc(cfg.title)}">
  <meta property="og:description" content="${esc(cfg.excerpt)}">
  <meta property="og:image" content="${img}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(cfg.title)}">
  <meta name="twitter:description" content="${esc(cfg.excerpt)}">
  <meta name="twitter:image" content="${img}">
${jsonLd(cfg)}
  <link rel="stylesheet" href="/assets/make-error-127/styles.css">
  <link rel="stylesheet" href="/assets/${cfg.slug}/styles.css">
  <style>${CHROME_INLINE_CSS}</style>
</head>
<body>
${buildNavHtml(cfg.slug, cal)}
  <div class="main-container">
    <div class="content-wrapper">
      <div class="main-col">
${buildArticleHeader(cfg.h1, 'AlertMend Team', DATE, CAT)}
      <div style="display:flex;flex-wrap:wrap;gap:8px 16px;align-items:center;margin:-0.75rem 0 1.75rem;font-size:0.85rem;color:#52525b;">
        <span style="display:inline-flex;align-items:center;gap:6px;font-weight:600;color:#047857;"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>Verified against NVIDIA DCGM and GPU Operator docs</span>
        <span style="color:#d4d4d8;">•</span><span>Last reviewed ${MODIFIED}</span>
        <span style="color:#d4d4d8;">•</span><span>${cfg.sources.length} primary sources cited</span>
      </div>
    <div class="dl-blog">
      <section class="heroBand heroBandCompact">
        <p class="heroGuideLabel">GPU and MLOps reliability · primary sources checked ${MODIFIED}</p>
        <div class="instantFix">
          <div class="instantFixTop"><span>THE 10-SECOND ANSWER</span><strong>GPU monitoring has to answer three questions, then act on them.</strong></div>
          <p>Is the GPU actually busy? Is the <em>right</em> workload using it, or has it stalled? And did it just die? A GPU bills the same whether it is at 100% or 0%, so idle, stalled, and crashed all cost money until something notices and acts.</p>
          <div class="instantFixCommands">
            <code>nvidia-smi --query-gpu=utilization.gpu,memory.used --format=csv</code><span>is it busy?</span>
            <code>dcgmi dmon</code><span>live health &amp; throttle</span>
            <code>kubectl describe node &lt;gpu-node&gt;</code><span>allocation vs use</span>
          </div>
          <div class="manualProof">
            <a href="https://docs.nvidia.com/datacenter/dcgm/latest/" target="_blank" rel="noopener noreferrer">NVIDIA DCGM: GPU telemetry ↗</a>
            <a href="https://github.com/NVIDIA/dcgm-exporter" target="_blank" rel="noopener noreferrer">dcgm-exporter: GPU metrics for Prometheus ↗</a>
          </div>
        </div>
        <aside class="immediateDiagnosis">
          <div class="diagnosisHeading"><span class="diagnosisEyebrow">Immediate diagnosis</span><strong>Busy, stalled, or dead?</strong></div>
          <ol class="diagnosisSteps">
            <li><span>1</span><p>Read <code>utilization.gpu</code>: sustained near 0% while allocated means idle or stalled, not healthy.</p></li>
            <li><span>2</span><p>Check the workload that holds the GPU: is the pod <code>Running</code> but doing no GPU work?</p></li>
            <li><span>3</span><p>Check crashes and throttling: restarts, <code>Xid</code> errors, and temperature before you blame the model.</p></li>
          </ol>
          <p class="diagnosisCaution"><strong>Avoid the false read:</strong> a pod in <code>Running</code> state does not mean the GPU is working. Utilization, not pod status, is the truth.</p>
        </aside>
      </section>

      <nav class="articleToc" aria-label="On this page"><strong>On this page</strong>${cfg.toc.map(([a, l]) => `<a href="#${a}">${esc(l)}</a>`).join('')}</nav>

      <h2 class="sectionHead" id="what">What GPU monitoring must catch</h2>
      ${cfg.intro.map((p) => `<p class="bodyText">${p}</p>`).join('\n      ')}

      ${gpuGauge()}

      <h2 class="sectionHead" id="signals">The signals that matter</h2>
      <p class="sectionSub">GPU health is more than one number. These are the signals that separate a busy GPU from an expensive idle one, and a healthy one from a failing one.</p>
      <div class="diyWrap"><table class="compareTable"><thead><tr><th>Signal</th><th>What it tells you</th><th>Watch for</th></tr></thead><tbody>
        ${cfg.signals.map((r) => `<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td><td class="diyHighlight">${esc(r[2])}</td></tr>`).join('\n        ')}
      </tbody></table></div>

      <h2 class="sectionHead" id="diagnose">How to diagnose it</h2>
      <div class="amFlow">${cfg.diagnose.map(([t, b], i) => `<div class="amStep"><div class="amStepHead"><span class="amStepNum">${i + 1}</span></div><h3 class="amStepTitle">${esc(t)}</h3><p class="amStepBody">${b}</p></div>`).join('')}</div>

      <h2 class="sectionHead" id="scenarios">The three problems, and what to do</h2>
      <div class="searchIssueGrid">${cfg.scenarios.map(([term, desc, fix]) => `<div class="searchIssueCard"><h3 class="searchIssueTerm">${esc(term)}</h3><p class="searchIssueDesc">${desc}</p><p class="searchIssueAlert"><strong>Action:</strong> ${fix}</p></div>`).join('')}</div>

      <h2 class="sectionHead" id="setup">Set up GPU monitoring</h2>
      <p class="bodyText">The standard stack is NVIDIA DCGM exported to Prometheus, plus the GPU Operator to manage drivers and the device plugin. Then alert on utilization, memory, and thermal, not just node health.</p>
      ${codeBlock(cfg.setupCode)}
      <p class="bodyText">The rule that catches idle and stalled GPUs is the same: alert when utilization stays below a floor for a window, and separately when it drops mid-run. A pod that is <code>Running</code> is not evidence the GPU is working.</p>

      <h2 class="sectionHead" id="prevent">Prevent idle and silent stalls</h2>
      ${cfg.prevent.map((p) => (p.startsWith('CODE:') ? codeBlock(p.slice(5)) : `<p class="bodyText">${p}</p>`)).join('\n      ')}

      <h2 class="sectionHead" id="cost">What idle and stalled GPUs actually cost</h2>
      <p class="bodyText">A GPU bills the same at 0% utilization as at 100%. Assume a representative on-demand H100 at <strong>$3 per GPU-hour</strong>set your own rate below; on-demand rates run roughly $2.50–$12 depending on provider and commitment:</p>
      <div class="roiFacts">
        <div class="roiFact"><span>1 idle H100</span><strong>≈ $2,190/mo</strong><em>$72 a day for zero work</em></div>
        <div class="roiFact"><span>16 GPUs, 20% idle</span><strong>≈ $7,000/mo</strong><em>~$84k a year, produced nothing</em></div>
        <div class="roiFact"><span>Stall caught in minutes</span><strong>vs next morning</strong><em>hours of GPU-time saved each time</em></div>
      </div>
      <div class="roiCalc" role="group" aria-label="Idle GPU waste calculator">
        <p class="roiCalcTitle">Estimate your idle GPU waste</p>
        <div class="roiRow"><label for="roiGpus">GPUs in your fleet</label><output id="outGpus">8</output></div>
        <input class="roiSlider" type="range" id="roiGpus" min="1" max="256" value="8" step="1" aria-label="Number of GPUs">
        <div class="roiRow"><label for="roiRate">$ per GPU-hour</label><output id="outRate">$3.00</output></div>
        <input class="roiSlider" type="range" id="roiRate" min="1" max="15" value="3" step="0.5" aria-label="Dollars per GPU-hour">
        <div class="roiRow"><label for="roiIdle">Idle / wasted share</label><output id="outIdle">25%</output></div>
        <input class="roiSlider" type="range" id="roiIdle" min="5" max="60" value="25" step="1" aria-label="Percent idle">
        <div class="roiResult"><div><span>Wasted / month</span><strong id="roiMo">$0</strong></div><div><span>Wasted / year</span><strong id="roiYr">$0</strong></div></div>
        <p class="roiReclaim" id="roiReclaim"></p>
      </div>
      <p class="sourceNote">Hourly GPU rates vary widely by provider, region, and commitment, representative <a href="https://aws.amazon.com/ec2/instance-types/p5/" target="_blank" rel="noopener noreferrer">on-demand H100</a> pricing is used for illustration; plug in your real rate. The point is not the exact number: idle and stalled GPUs are pure waste, and they are invisible to any check that only asks "is the pod running?"</p>
      <div class="ctaInline">Want your actual number, not an estimate? <a href="${cal}" target="_blank" rel="noopener noreferrer">Get a read-only GPU idle-spend audit →</a></div>

      ${recoveryFlow()}

      <h2 class="sectionHead" id="automate">Monitor, notify, and act with AlertMend</h2>
      <p class="bodyText">${cfg.amIntro}</p>
      <div class="alertmendMethod">${cfg.amSteps.map(([t, b], i) => `<div><span>${i + 1}</span><strong>${esc(t)}</strong><p>${b}</p></div>`).join('')}</div>
      <p class="bodyText productDisclosure"><strong>Deployment control:</strong> AlertMend runs as a managed service or self-hosted, so GPU telemetry and remediation stay inside your environment. Every command in this guide works without AlertMend.</p>

      <h2 class="sectionHead" id="sources">Primary sources and scope</h2>
      <ul class="sourceList">${cfg.sources.map(([u, l, n]) => `<li><a href="${u}" target="_blank" rel="noopener noreferrer">${esc(l)}</a>${n}</li>`).join('')}</ul>
      <div class="reviewPolicy"><strong>Method and disclosure:</strong> GPU signals and tooling above are drawn from NVIDIA's DCGM, GPU Operator, and device-plugin documentation, linked in Primary sources. Behavior varies by driver and hardware, so confirm on the versions you run. AlertMend publishes this guide and may benefit if readers evaluate its product.</div>

      <h2 class="sectionHead" id="faq">FAQ</h2>
      <div class="faqList">${cfg.faq.map(([q, a], i) => `<div class="faqItem"><button type="button" class="faqQuestion" data-faq-toggle aria-expanded="${i === 0 ? 'true' : 'false'}">${esc(q)}<svg class="faqChevron${i === 0 ? ' faqChevronOpen' : ''}" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 9l6 6 6-6"/></svg></button><div class="faqAnswer${i === 0 ? '' : ' hidden'}">${esc(a)}</div></div>`).join('')}</div>

      <div class="ctaBand">
        <div class="ctaBandTitle">Find your idle GPUs before the invoice does.</div>
        <p class="ctaBandSub">Get a read-only GPU idle-spend audit: which GPUs are idle and what they cost per hour, which workloads are stalled, and which nodes are crash-prone, no outage, no tool rip-out, just a prioritized fix list.</p>
        <div class="ctaBtnRow"><a href="${cal}" class="ctaBtn" target="_blank" rel="noopener noreferrer">Get your GPU idle-spend audit →</a></div>
      </div>
    </div>
    <div class="promo"><p><strong>Related:</strong> ${cfg.related.map(([s, l]) => `<a href="/blog/${s}">${esc(l)}</a>`).join(' · ')}</p></div>
      </div>
${buildSidebarHtml(cfg.relatedSidebar)}
    </div>
  </div>
  <script src="/assets/${cfg.slug}/script.js" defer></script>
</body>
</html>
`
}

function heroSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"><defs><linearGradient id="hg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0b0b14"/><stop offset="1" stop-color="#241b4d"/></linearGradient></defs><rect width="1200" height="630" fill="url(#hg)"/><g transform="translate(80,76)"><circle cx="25" cy="25" r="25" fill="#fff"/><image href="${ALERTMEND_LOGO_DATA_URI}" x="8" y="6" width="34" height="38" preserveAspectRatio="xMidYMid meet"/><text x="64" y="33" font-size="24" font-weight="700" fill="#fff">AlertMend</text><text x="236" y="33" font-size="18" fill="#8b82b8">· GPU &amp; MLOps reliability</text></g><text x="80" y="238" font-size="66" font-weight="800" fill="#fff">GPU Monitoring</text><text x="80" y="306" font-size="40" font-weight="700" fill="#c4b5fd">Detect idle. Catch stalls. Auto-recover.</text><g font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="20"><rect x="80" y="360" width="1040" height="150" rx="14" fill="#12111f" stroke="#312b57"/><text x="108" y="398" fill="#a78bfa">idle</text><text x="260" y="398" fill="#e9e3ff">0% util, still billing $/hr → reclaim</text><text x="108" y="434" fill="#a78bfa">stalled</text><text x="260" y="434" fill="#e9e3ff">pod Running, GPU doing nothing → restart</text><text x="108" y="470" fill="#a78bfa">crashed</text><text x="260" y="470" fill="#e9e3ff">CUDA OOM / throttle at 3am → auto-recover</text></g><text x="80" y="560" font-size="20" fill="#8b82b8">alertmend.io · Monitor GPUs, then actually do something about it</text></svg>\n`
}

const cfg = {
  slug: 'gpu-monitoring',
  title: 'GPU Monitoring: Detect Idle and Recover',
  h1: 'GPU Monitoring: Detect Idle GPUs, Stalls, and Failures',
  excerpt: 'GPU monitoring that acts: catch idle GPUs burning money, workloads that stopped using the GPU, and crashes at 3am, then alert and auto-recover.',
  keywords: 'gpu monitoring, gpu monitoring kubernetes, idle gpu, gpu utilization, monitor gpu usage, dcgm exporter, nvidia gpu operator, gpu cost, cuda out of memory, gpu observability, gpu auto recovery, AlertMend',
  toc: [['what', 'What to catch'], ['signals', 'Signals that matter'], ['diagnose', 'Diagnose'], ['scenarios', 'Idle, stalled, crashed'], ['setup', 'Set up monitoring'], ['prevent', 'Prevent'], ['cost', 'Cost & ROI'], ['automate', 'Monitor and act'], ['sources', 'Sources']],
  intro: [
    'A GPU is the most expensive thing in your cluster, and it bills by the hour whether it is training a model or sitting at zero percent utilization. That single fact is why GPU monitoring is different from ordinary monitoring: the goal is not only to know a GPU is <em>up</em>but to know it is <em>earning its cost</em>and to do something the moment it is not.',
    'Three failures waste GPU money and reliability, and a good setup catches all three. An <strong>idle</strong> GPU is allocated but doing no work. A <strong>stalled</strong> GPU is worse: the pod looks <code>Running</code>but the training step hung or the inference queue stopped, so it burns money while producing nothing. And a <strong>crashed</strong> GPU, a CUDA out-of-memory, a thermal throttle, a driver fault at 3am, takes the workload down until someone notices. Monitoring that only charts utilization tells you these happened; monitoring that acts stops them.',
  ],
  signals: [
    ['Utilization %', 'Whether the GPU is actually doing compute', 'Sustained near 0% while allocated = idle or stalled'],
    ['GPU memory used', 'Whether the workload fits and is active', 'Near-full = OOM risk; near-zero on a running pod = stalled'],
    ['Temperature / SM clock', 'Thermal health and throttling', 'High temp with dropping clocks = throttled, slow but "up"'],
    ['ECC / Xid errors', 'Hardware faults', 'Rising ECC or Xid = a node to cordon before it takes jobs down'],
    ['Power draw ($/hr)', 'What the GPU is costing right now', 'High cost with low utilization = money burning idle'],
    ['Tokens/s or step time', 'Whether inference or training is progressing', 'Flatlined mid-run = a stall a node-up check will miss'],
  ],
  diagnose: [
    ['Read real utilization', 'Run <code>nvidia-smi --query-gpu=utilization.gpu,memory.used,temperature.gpu,power.draw --format=csv</code> or <code>dcgmi dmon</code>. Sustained low utilization on an allocated GPU is the signal, whatever the pod says.'],
    ['Tie the GPU to its workload', 'Find which pod holds the GPU (<code>kubectl describe node</code> shows <code>nvidia.com/gpu</code> allocation) and confirm that workload is actually doing GPU work, not just running.'],
    ['Check for stalls mid-run', 'For training, watch step time and tokens/s; a flatline while the process lives is a stall (dataloader, NCCL, or checkpoint), not a healthy idle.'],
    ['Rule out hardware', 'Check temperature, SM clock, ECC, and <code>Xid</code> errors in <code>dmesg</code> or DCGM. Thermal throttle and hardware faults masquerade as "slow" rather than "down".'],
  ],
  scenarios: [
    ['Idle GPU, still billing', 'The GPU is allocated but utilization sits near zero, a finished job that never released, an oversized reservation, or a forgotten notebook, while it costs full price per hour.', 'Alert on utilization below a floor for a window, then notify the owner and reclaim: scale the workload down, preempt it, or free the reservation.'],
    ['Stalled workload (pod up, GPU idle)', 'The pod is <code>Running</code> but the GPU stopped working: a hung dataloader, an NCCL timeout, or a stuck inference queue. A node-up check stays green while the run produces nothing.', 'Detect utilization dropping to zero mid-run and restart the worker, or resume training from the last checkpoint.'],
    ['Crash or OOM at 3am', 'A CUDA out-of-memory, a thermal throttle, or a driver fault kills the worker while the API in front still looks fine, and nobody is awake to restart it.', 'Auto-recover: restart the worker, cordon a throttling or faulting node, and evict a bad rank, then confirm it is serving again.'],
    ['Underutilized inference', 'A model server holds a whole GPU but runs at low batch, or KV-cache pressure throttles throughput while utilization looks partial.', 'Right-size with MIG or time-slicing to pack more work per GPU, and alert on throughput drift, not just up/down.'],
    ['Thermal throttling', 'The GPU is busy but temperature is high and clocks are dropping, so it is slow rather than down, and jobs quietly take longer and cost more.', 'Alert on temperature and SM-clock drop, and cordon the node so new jobs avoid it until cooling is fixed.'],
    ['Hardware fault (GPU falls off)', 'ECC or Xid errors rise, or the GPU disappears from the node, taking any job scheduled there down with it.', 'Alert on ECC/Xid, cordon the node automatically, and reschedule the workload onto healthy GPUs.'],
  ],
  setupCode: '# 1. NVIDIA GPU Operator installs drivers, device plugin, and DCGM exporter\nhelm repo add nvidia https://helm.ngc.nvidia.com/nvidia\nhelm install gpu-operator nvidia/gpu-operator -n gpu-operator --create-namespace\n\n# 2. Confirm dcgm-exporter is exposing GPU metrics to Prometheus\nkubectl get pods -n gpu-operator -l app=nvidia-dcgm-exporter\n\n# 3. Alert on an idle GPU (utilization under 15% for 30m), PromQL\n#    DCGM_FI_DEV_GPU_UTIL is the per-GPU utilization gauge\navg_over_time(DCGM_FI_DEV_GPU_UTIL[30m]) < 15\n\n# 4. Alert on a stall: a pod holds the GPU (dcgm-exporter --kubernetes adds pod/namespace\n#    labels) but utilization has been near zero for 10m, "Running" is not "working"\navg_over_time(DCGM_FI_DEV_GPU_UTIL{pod!=""}[10m]) < 5',
  prevent: [
    'The durable fixes are packing and timeouts. Use MIG or time-slicing so a single job cannot hoard a whole GPU, set idle timeouts on notebooks and dev jobs so forgotten sessions release the hardware, and make your health checks verify <em>work</em> (tokens/s, step progress), not just that the process is alive.',
    'CODE:# Idle-timeout a Jupyter/dev workload with a liveness probe on real GPU work\n# (pseudocode: fail the probe if utilization has been ~0 for N minutes)\nlivenessProbe:\n  exec:\n    command: ["/bin/sh","-c","test $(gpu_util_last_10m) -gt 3"]\n  periodSeconds: 60\n  failureThreshold: 10',
    'Then alert on the two conditions that catch the expensive cases early: utilization below a floor for a sustained window (idle), and utilization dropping sharply mid-run while the workload still lives (stall).',
  ],
  amIntro: 'Charts tell you a GPU went idle or died; they do not reclaim it or restart it. AlertMend watches per-GPU utilization, memory, temperature, ECC, and hourly burn across your fleet, ties each GPU to the workload and cost behind it, and turns that into action.',
  amSteps: [
    ['Detect', 'Catch idle GPUs below a utilization floor, stalls where a running pod stops using the GPU, and crashes, OOMs, or thermal throttling, with the hourly burn attached.'],
    ['Correlate', 'Tie the GPU to its workload, its $/hr cost, and recent changes, so the alert says which job on which node, not just "GPU busy".'],
    ['Explain', 'Run AI root-cause analysis on GPU failures, CUDA OOM, NCCL timeout, thermal throttle, training stalled, with the evidence and the fix.'],
    ['Notify and act', 'Notify the owner of an idle GPU to reclaim it, or run an approved runbook, restart a stalled worker, resume from checkpoint, cordon a throttling node, and confirm recovery.'],
  ],
  sources: [
    ['https://docs.nvidia.com/datacenter/dcgm/latest/', 'NVIDIA Data Center GPU Manager (DCGM)', 'the standard for GPU telemetry: utilization, memory, ECC, thermal, and health.'],
    ['https://github.com/NVIDIA/dcgm-exporter', 'NVIDIA dcgm-exporter', 'exports DCGM metrics (for example DCGM_FI_DEV_GPU_UTIL) to Prometheus.'],
    ['https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/latest/index.html', 'NVIDIA GPU Operator', 'manages drivers, the Kubernetes device plugin, and DCGM in-cluster.'],
    ['https://developer.nvidia.com/nvidia-system-management-interface', 'nvidia-smi', 'the command-line tool for per-GPU utilization, memory, temperature, and power.'],
  ],
  faq: [
    ['How do I monitor GPU usage in Kubernetes?', 'Install the NVIDIA GPU Operator, which deploys the driver, device plugin, and DCGM exporter, then scrape DCGM metrics into Prometheus and alert on them. Key metrics include per-GPU utilization (DCGM_FI_DEV_GPU_UTIL), memory used, temperature, and ECC errors. Alert on low utilization for idle GPUs and on utilization collapsing mid-run for stalls.'],
    ['How do I detect idle GPUs?', 'Alert when GPU utilization stays below a floor (for example under 15%) for a sustained window while the GPU is still allocated. An idle GPU costs the same per hour as a busy one, so catching it early is the biggest single GPU saving. AlertMend flags idle GPUs with their hourly burn and can notify the owner to reclaim them.'],
    ['Why is my GPU at 0% utilization but the pod is running?', 'The workload has stalled: a hung dataloader, an NCCL timeout, a stuck inference queue, or a job that finished but never exited. A pod in Running state does not mean the GPU is working. Watch utilization and step progress, not pod status, and restart the worker or resume from a checkpoint when it flatlines.'],
    ['How do I monitor GPU temperature and thermal throttling?', 'DCGM and nvidia-smi expose temperature and SM clock. Thermal throttling shows up as high temperature with dropping clocks: the GPU stays "up" but runs slower and costs more per unit of work. Alert on temperature thresholds and clock drops, and cordon the affected node so new jobs avoid it.'],
    ['What is DCGM and dcgm-exporter?', 'DCGM (NVIDIA Data Center GPU Manager) is the standard toolkit for GPU telemetry and health, and dcgm-exporter publishes those metrics to Prometheus. Together with the GPU Operator they are the usual way to monitor NVIDIA GPUs in Kubernetes.'],
    ['How do I get alerted when a GPU job fails at night?', 'Alert on the failure signals, worker restarts, CUDA out-of-memory, Xid errors, and utilization dropping to zero, and wire an auto-recovery action so the fix does not wait for a human. AlertMend can restart the worker, resume from checkpoint, or cordon a faulting node automatically and confirm it is serving again.'],
    ['How do I reduce idle GPU costs?', 'Find idle GPUs with a utilization-floor alert, pack workloads with MIG or time-slicing so one job cannot hoard a whole GPU, set idle timeouts on notebooks and dev jobs, and reclaim finished or oversized reservations. AlertMend surfaces idle GPUs with their $/hr cost so reclaiming them is a one-step action, not a hunt.'],
  ],
  related: [['gpu-reliability-for-llm-workloads', 'GPU Reliability for LLM Workloads'], ['monitor-vllm-using-alertmend', 'Monitor vLLM in Production'], ['top-kubernetes-cost-management-solutions', 'Kubernetes Cost Management']],
  relatedSidebar: [
    { slug: 'gpu-reliability-for-llm-workloads', title: 'GPU Reliability for LLM Workloads' },
    { slug: 'monitor-vllm-using-alertmend', title: 'How to Monitor vLLM in Production' },
    { slug: 'monitor-ollama-using-alertmend', title: 'How to Monitor Ollama in Production' },
    { slug: 'ai-agent-observability-in-production', title: 'AI Agent Observability in Production' },
    { slug: 'top-kubernetes-cost-management-solutions', title: 'Top Kubernetes Cost Management Solutions' },
    { slug: 'reduce-mttr-for-ai-agents', title: 'Reduce MTTR for AI Agents' },
    { slug: 'best-1-click-logging-and-metrics-tools', title: '9 Best Logging & Metrics Tools' },
  ],
}

const dir = path.join(root, 'public/blog', cfg.slug)
const assets = path.join(root, 'public/assets', cfg.slug)
fs.mkdirSync(dir, { recursive: true }); fs.mkdirSync(assets, { recursive: true })
fs.writeFileSync(path.join(dir, 'index.html'), render(cfg))
fs.writeFileSync(path.join(assets, 'script.js'), SCRIPT_JS)
fs.writeFileSync(path.join(assets, 'styles.css'), '/* base styles come from make-error-127 */\n' + EXTRA_CSS)
fs.writeFileSync(path.join(assets, 'hero.svg'), heroSvg())
fs.writeFileSync(path.join(root, 'public/blog', `${cfg.slug}.md`), `---
title: "${cfg.title}"
excerpt: "${cfg.excerpt}"
date: "${DATE}"
dateModified: "${MODIFIED}"
category: "${CAT}"
author: "AlertMend Team"
keywords: "${cfg.keywords}"
---

This post is published as a rich interactive page at [/blog/${cfg.slug}](/blog/${cfg.slug}).
`)
console.log(`✓ ${cfg.slug}  (title+suffix ${cfg.title.length + 15}, excerpt ${cfg.excerpt.length})`)
