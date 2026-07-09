/**
 * VM monitoring + auto-remediation, positioned as complementary to Grafana/Prometheus.
 * Agentless SSH monitoring + runbook fan-out across a VM fleet. Two animations (disk
 * auto-remediation gauge + remediation flow), real node_exporter/PromQL/systemd depth,
 * thresholds, by-workload use cases, copyable auto-fix runbook. Honest per features doc.
 * Aligned to current standard (cred header, working signup, free consultation). No em dashes.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { SITE_URL, esc, CHROME_INLINE_CSS, AUTHOR_CRED_CSS, buildNavHtml, buildSidebarHtml, buildCredArticleHeader, calendlyUrl, appendBlogSignupHandler } from './static-blog-shared.mjs'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const DATE = '2026-07-08', MODIFIED = '2026-07-08'
const AUTHOR = 'Dinesh Agrawal'
const LINKEDIN = 'https://www.linkedin.com/in/dineshagrawal85/'
const ACCENT = '#d97706', ACCENT_DARK = '#451a03'
const SERVER = 'M3 4h18a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zm3 3.5h.01M9 7.5h.01M3 14h18a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1zm3 3.5h.01M9 17.5h.01'

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
  var vi = document.getElementById('vmInc'), vm = document.getElementById('vmMin'), vt = document.getElementById('vmToil');
  if (vi && vm && vt) {
    var oi = document.getElementById('outInc'), om = document.getElementById('outMin'), ot = document.getElementById('outToil');
    var hrs = document.getElementById('vmHrs'), days = document.getElementById('vmDays'), note = document.getElementById('vmNote');
    function vcalc() {
      var inc = +vi.value, min = +vm.value, toil = +vt.value;
      oi.textContent = inc; om.textContent = min + ' min'; ot.textContent = toil + ' hr';
      var monthly = ((inc * min / 60) + toil) * 4.33;
      var reclaim = Math.round(monthly * 0.85);
      var d = (reclaim / 8).toFixed(1);
      hrs.textContent = reclaim; days.textContent = d;
      note.innerHTML = 'About <b>' + reclaim + ' hours a month</b> a runbook hands back, roughly <b>' + d + ' working days</b>, plus the 3am wake-ups it removes.';
    }
    [vi, vm, vt].forEach(function (el) { el.addEventListener('input', vcalc); });
    vcalc();
  }
})();
`

const ANSWER_CARD_CSS = `
:root{--am-accent:${ACCENT};}
.instantFix{position:relative;margin-bottom:1rem;padding:1.15rem;overflow:hidden;border:1px solid #fcd9a5;border-radius:14px;background:#fff;box-shadow:0 8px 28px rgba(9,9,11,.05);}
.instantFixTop{display:flex;flex-direction:column;align-items:flex-start;gap:.35rem;margin-bottom:.6rem;}
.instantFixTop span{color:var(--am-accent);font-size:.65rem;font-weight:800;letter-spacing:.09em;text-transform:uppercase;}
.instantFixTop strong{color:#18181b;font-size:.95rem;line-height:1.45;}
.instantFix>p{margin:0 0 .9rem;max-width:680px;color:#3f3f46;font-size:1rem;line-height:1.6;}
.instantFixCommands{display:grid;grid-template-columns:max-content minmax(0,1fr);gap:.4rem .8rem;align-items:center;padding:.75rem;border-radius:8px;background:#18181b;}
.instantFixCommands code{color:#fcd9a5;font-size:.75rem;}
.instantFixCommands span{color:#a1a1aa;font-size:.72rem;}
.sectionHead{border-left:4px solid var(--am-accent);padding-left:14px;}
.heroGuideLabel{color:var(--am-accent);}
.bodyText a,.sourceList a,.faqAnswer a{color:var(--am-accent);}
.brandChip{display:inline-flex;align-items:center;gap:9px;margin:0 0 1.25rem;padding:6px 15px 6px 11px;border:1px solid #e4e4e7;border-radius:999px;background:#fff;}
.brandChip span{font-size:.82rem;font-weight:600;color:#52525b;}
.rbGrid{display:grid;grid-template-columns:1fr;gap:12px;margin:1.25rem 0 2rem;}
@media(min-width:720px){.rbGrid{grid-template-columns:repeat(2,1fr);}}
.rbCard{padding:18px;border:1px solid #e4e4e7;border-radius:10px;background:#fff;border-top:3px solid var(--am-accent);}
.rbCard h3{margin:0 0 4px;color:#18181b;font-size:1rem;}
.rbCard p{margin:0;color:#52525b;font-size:.88rem;line-height:1.6;}
.calloutBox{margin:1.5rem 0;padding:18px 20px;border-left:3px solid var(--am-accent);border-radius:0 10px 10px 0;background:#fff8ef;color:#3f3f46;line-height:1.7;}
.calloutBox strong{color:#18181b;}
.ctaInline{margin:1.6rem 0;padding:15px 18px;border-left:3px solid var(--am-accent);border-radius:0 10px 10px 0;background:#fffaf2;font-weight:600;color:#27272a;}
.ctaInline a{color:var(--am-accent);}
.flowDiagram svg,.gaugeFig svg{display:block;width:100%;height:auto;border:1px solid #e4e4e7;border-radius:12px;}
.flowDiagram figcaption,.gaugeFig figcaption{margin-top:9px;color:#71717a;font-size:.78rem;line-height:1.55;}
.authorBioCard{display:flex;gap:24px;align-items:flex-start;flex-wrap:wrap;padding-bottom:1rem;}
.authorBioCard h3{font-size:1.5rem;font-weight:800;color:#09090b;margin:0 0 4px;}
.authorBioRole{color:var(--am-accent);font-weight:600;margin:0 0 14px;}
.authorBioText{color:#3f3f46;line-height:1.75;}
.authorBioLink{display:inline-flex;align-items:center;gap:6px;margin-top:14px;color:#71717a;text-decoration:none;font-weight:600;}
.roiFacts{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:14px;margin:1.3rem 0;}
.roiFact{background:#fff8ef;border:1px solid #fcd9a5;border-radius:12px;padding:16px;}
.roiFact span{display:block;font-size:.72rem;font-weight:700;color:var(--am-accent);text-transform:uppercase;letter-spacing:.04em;}
.roiFact strong{display:block;font-size:1.3rem;font-weight:800;color:#09090b;margin:6px 0 3px;}
.roiFact em{font-style:normal;font-size:.85rem;color:#52525b;}
.roiCalc{border:1px solid #fcd9a5;border-radius:16px;padding:22px;background:#fffaf2;margin:1.3rem 0;}
.roiCalcTitle{font-weight:700;font-size:1.05rem;color:#09090b;margin:0 0 8px;}
.roiRow{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:16px 0 4px;}
.roiRow label{font-size:.9rem;color:#3f3f46;font-weight:600;}
.roiRow output{font-weight:800;color:var(--am-accent);font-variant-numeric:tabular-nums;}
.roiSlider{width:100%;accent-color:var(--am-accent);height:6px;cursor:pointer;margin:2px 0;}
.roiResult{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:20px;}
.roiResult div{background:#fff;border:1px solid #fcd9a5;border-radius:12px;padding:16px;text-align:center;}
.roiResult span{display:block;font-size:.78rem;color:#52525b;font-weight:600;}
.roiResult strong{display:block;font-size:1.85rem;font-weight:800;color:var(--am-accent);margin-top:4px;font-variant-numeric:tabular-nums;}
.roiNote{margin-top:14px;font-size:.88rem;color:#3f3f46;text-align:center;}
.roiNote b{color:#18181b;}
`

function codeBlock(code) { return `<pre class="codeBlock copyableCode"><code>${esc(code)}</code></pre>` }

function authorCard() {
  return `
          <hr style="margin:2.5rem 0 1.75rem;border:none;border-top:1px solid #e4e4e7;">
          <div class="authorBioCard">
            <img src="/logos/dinesh.jpeg" alt="${AUTHOR}" width="128" height="128" loading="lazy" style="width:128px;height:128px;border-radius:12px;object-fit:cover;border:1px solid #e4e4e7;flex-shrink:0;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
            <div style="display:none;width:128px;height:128px;border-radius:12px;border:1px solid #e4e4e7;background:#f4f4f5;align-items:center;justify-content:center;font-weight:800;font-size:2.25rem;color:#3f3f46;flex-shrink:0;">DA</div>
            <div style="flex:1;min-width:240px;">
              <h3>${AUTHOR}</h3>
              <p class="authorBioRole">Co-Founder at AlertMend.io</p>
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

// Animated disk gauge: healthy -> 92% critical -> runbook cleans -> recovered
function diskGauge() {
  const X = 60, W = 840, Y = 96, H = 46
  return `<figure class="gaugeFig">
      <svg class="dk-anim" viewBox="0 0 960 250" width="960" height="250" role="img" aria-label="A VM root disk climbs from healthy to 92 percent, putting the service at risk, until a runbook archives and cleans logs and the disk drops back to safe." font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" style="background:linear-gradient(180deg,#fffbf4,#fdf3e3);">
        <defs><style>@media (prefers-reduced-motion: no-preference){
          .dk-anim .d-fill{animation:dk-fill 7s ease-in-out infinite}
          @keyframes dk-fill{0%,20%{width:${(63/100)*W}px;fill:#16a34a}42%{width:${(92/100)*W}px;fill:#dc2626}64%{width:${(92/100)*W}px;fill:#dc2626}84%,100%{width:${(45/100)*W}px;fill:#16a34a}}
          .dk-anim .d-bad{animation:dk-bad 7s ease-in-out infinite}@keyframes dk-bad{0%,26%{opacity:0}44%,62%{opacity:1}78%,100%{opacity:0}}
          .dk-anim .d-fix{animation:dk-fix 7s ease-in-out infinite}@keyframes dk-fix{0%,66%{opacity:0}84%,96%{opacity:1}100%{opacity:0}}
        }</style></defs>
        <text x="${X}" y="72" font-size="15" font-weight="700" fill="#09090b">VM root disk usage (/)</text>
        <rect x="${X}" y="${Y}" width="${W}" height="${H}" rx="10" fill="#f1ede6" stroke="#e4e4e7"/>
        <rect class="d-fill" x="${X}" y="${Y}" width="${(63/100)*W}" height="${H}" rx="10" fill="#16a34a"/>
        <line x1="${X+(90/100)*W}" y1="${Y-8}" x2="${X+(90/100)*W}" y2="${Y+H+8}" stroke="#dc2626" stroke-width="2" stroke-dasharray="3 3"/><text x="${X+(90/100)*W}" y="${Y+H+26}" font-size="12" fill="#dc2626" text-anchor="middle">critical 90%</text>
        <g class="d-bad"><rect x="${X+W-270}" y="${Y-40}" width="270" height="30" rx="15" fill="#7f1d1d"/><text x="${X+W-135}" y="${Y-20}" font-size="13" font-weight="700" fill="#fff" text-anchor="middle">DISK 92% · service at risk</text></g>
        <g class="d-fix"><rect x="${X+W-300}" y="${Y-40}" width="300" height="30" rx="15" fill="#14532d"/><text x="${X+W-150}" y="${Y-20}" font-size="12.5" font-weight="700" fill="#fff" text-anchor="middle">RUNBOOK: archived + cleaned, recovered</text></g>
      </svg>
      <figcaption>A full disk is the most common way a VM takes a service down. Monitoring shows the climb; a runbook archives and cleans before it hits 100%, no human at 3am.</figcaption>
    </figure>`
}

// Animated remediation flow: alert -> ssh to host -> diagnose -> fix -> approve -> notify
function flowSvg() {
  const nodes = [
    ['Alert', 'Grafana or AlertMend', '#3f3f46', 0],
    ['SSH to the host', 'the VM the alert named', ACCENT, 1],
    ['Diagnose', 'what filled it / died', '#3f3f46', 0],
    ['Fix', 'archive+clean / restart', '#3f3f46', 0],
    ['Approve', 'before anything deletes', ACCENT, 2],
    ['Recovered', 'Slack, Jira, audit', '#16a34a', 0],
  ]
  const W = 160, GAP = 12, Y = 70, H = 92
  return `<figure class="flowDiagram" style="overflow-x:auto;">
      <svg class="vm-anim" viewBox="0 0 1032 220" width="1032" height="220" role="img" aria-label="A VM alert triggers a runbook that connects to the affected host over SSH, diagnoses the cause, fixes it, pauses for approval before anything destructive, then records the result." font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" style="min-width:1000px;background:linear-gradient(180deg,#fffbf4,#fdf3e3);">
        <defs>
          <marker id="vm-ar" markerWidth="9" markerHeight="9" refX="6.5" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L7,3 L0,6 Z" fill="${ACCENT}"/></marker>
          <style>@media (prefers-reduced-motion: no-preference){.vm-anim .vm-l{stroke-dasharray:7 6;animation:vm-f .8s linear infinite}@keyframes vm-f{to{stroke-dashoffset:-13}}}</style>
        </defs>
        <text x="16" y="34" font-size="15" font-weight="800" fill="#09090b">Alert to fix, agentless, across the fleet</text>
        <text x="16" y="54" font-size="12.5" fill="#71717a">Works with your existing Grafana alerts. A human signs off only on the destructive step.</text>
        ${nodes.map((n, i) => {
          const x = 16 + i * (W + GAP)
          const hot = n[3]
          const box = `<rect x="${x}" y="${Y}" width="${W}" height="${H}" rx="12" fill="${hot ? '#fff8ef' : '#fff'}" stroke="${hot ? ACCENT : '#e4e4e7'}" stroke-width="${hot ? 1.5 : 1}"/>` +
            `<circle cx="${x + 24}" cy="${Y + 26}" r="13" fill="${n[2]}" opacity="0.12"/><path d="${SERVER}" transform="translate(${x + 13},${Y + 13}) scale(0.72)" fill="none" stroke="${n[2]}" stroke-width="1.6" stroke-linecap="round"/>` +
            `<text x="${x + 44}" y="${Y + 31}" font-size="13.5" font-weight="800" fill="#18181b">${esc(n[0])}</text>` +
            `<text x="${x + 14}" y="${Y + 60}" font-size="11.5" fill="#52525b">${esc(n[1])}</text>` +
            (hot ? `<text x="${x + 14}" y="${Y + 78}" font-size="10" font-weight="800" fill="${ACCENT}">${hot === 1 ? 'AGENTLESS SSH' : 'HUMAN GATE'}</text>` : '')
          const arrow = i < nodes.length - 1 ? `<line class="vm-l" x1="${x + W}" y1="${Y + H / 2}" x2="${x + W + GAP}" y2="${Y + H / 2}" stroke="${ACCENT}" stroke-width="2.5" marker-end="url(#vm-ar)"/>` : ''
          return box + arrow
        }).join('')}
      </svg>
      <figcaption class="flowDiagramCaption">The fix runs on the exact host the alert named, with no agent to install, and fans out across every matching VM when the same problem hits the fleet.</figcaption>
    </figure>`
}

const INSTALL = `# The standard stack: node_exporter on each VM, scraped by Prometheus, graphed in Grafana
# 1. Run node_exporter as a systemd service on every VM (exposes metrics on :9100)
wget https://github.com/prometheus/node_exporter/releases/latest/download/node_exporter-*.linux-amd64.tar.gz
tar xzf node_exporter-*.tar.gz && sudo mv node_exporter-*/node_exporter /usr/local/bin/
sudo useradd -rs /bin/false node_exporter
# create /etc/systemd/system/node_exporter.service, then:
sudo systemctl enable --now node_exporter

# 2. Point Prometheus at the fleet
#   scrape_configs:
#     - job_name: node
#       static_configs:
#         - targets: ['vm1:9100','vm2:9100','vm3:9100']`

const PROMQL = `# Disk used % on the root filesystem
100 - (node_filesystem_avail_bytes{mountpoint="/"} * 100 / node_filesystem_size_bytes{mountpoint="/"})

# Memory used %
100 - (node_memory_MemAvailable_bytes * 100 / node_memory_MemTotal_bytes)

# Load average per core
node_load5 / count(count(node_cpu_seconds_total) by (cpu))

# A systemd unit that is not active (service is down)
node_systemd_unit_state{name="nginx.service", state="active"} == 0

# The node_exporter target is down (VM unreachable)
up{job="node"} == 0`

const CUSTOM = `# Is a specific container running, and is it healthy?
docker ps --filter name=web --format '{{.Names}} {{.Status}}'
docker inspect -f '{{.State.Health.Status}}' web        # healthy / unhealthy

# Is a specific process alive?
pgrep -fa "my-daemon"   ||   echo "process is down"
systemctl is-active my-app.service

# Is a container crash-looping on the host?
docker inspect -f '{{.RestartCount}}' web

# AlertMend runs checks like these as agentless custom monitors, alerts on the
# result, and a runbook can restart the container or process behind an approval.`

const RUNBOOK = `# Illustrative runbook: VM disk pressure (auto-remediate, fleet-wide)
trigger:
  on_alert: disk_used{mountpoint="/"} > 90%     # from your Grafana/Alertmanager or AlertMend
targets:
  vm: the host named in the alert                # chosen at runtime, agentless over SSH
steps:
  - ssh     df -h /   &&   du -sh /var/log/*      # confirm the cause on the host
  - branch  if logs_are_the_bulk:
      - approve  channel=slack                    # gate before anything deletes
      - ssh      archive /var/log/*.gz to s3  &&  truncate and rotate
  - branch  if a_service_died:
      - ssh      systemctl restart <unit>  &&  systemctl is-active <unit>
  - notify  slack summary (host, cause, GB reclaimed)  +  jira  +  audit log`

const CFG = {
  slug: 'vm-monitoring-and-automation',
  title: 'VM Monitoring and Auto-Remediation',
  h1: 'Linux VM Monitoring and Auto-Remediation (Alongside Your Grafana)',
  excerpt: 'Monitor Linux VMs (disk, memory, CPU, services, logs) with Grafana or agentless SSH, then auto-remediate the classic 3am failures with governed runbooks.',
  keywords: 'vm monitoring, linux vm monitoring, linux server monitoring, grafana vm monitoring, monitor vm with prometheus, node exporter, vm auto remediation, agentless server monitoring, ssh monitoring, server automation, monitor fleet of vms, AlertMend',
  category: 'Monitoring',
  signals: [
    ['Disk and inodes', 'A full / or /var crashes services and databases. Watch every mount, and inodes as well as bytes.'],
    ['Memory and swap', 'Low available memory and sustained swap-in mean thrashing, and eventually the OOM killer takes a process.'],
    ['CPU and load average', 'Sustained load above the core count, usually from a runaway process or a retry storm.'],
    ['Service and process health', 'Is the systemd unit active. Did nginx, PostgreSQL, or your app die or restart-loop.'],
    ['Containers and custom processes', 'Host metrics do not see inside the box. Watch the Docker containers and specific processes the VM runs: is your container up and healthy, is a critical process alive, and are restarts climbing.'],
    ['Log growth', 'A chatty app or missing rotation fills /var/log fast, and takes the disk with it.'],
    ['Certificate expiry', 'A TLS cert on the host that lapses takes the service down at the worst time.'],
    ['Reachability and reboots', 'Is the VM up and answering, and did it reboot or kernel-panic unexpectedly.'],
    ['Backups', 'For data VMs, that backups actually ran and can restore, not just that the job exited zero.'],
  ],
  alerts: [
    ['Disk filling', 'filesystem used > 80% (page at 90%), or inodes > 80%'],
    ['Memory pressure', 'available memory < 10% for 10m, or sustained swap-in'],
    ['High load', 'load5 per core > 1.5 for 10m'],
    ['Service down', 'a systemd unit is not active, or a process count drops to 0'],
    ['Log flood', 'a sharp rise in /var/log size or write rate'],
    ['Certificate expiring', 'host TLS cert expiry under 14 days'],
    ['VM unreachable', 'the node_exporter target is down or the host fails to ping'],
  ],
  useCases: [
    ['Web and app servers', 'Service health and restart-on-crash, disk for uploads and logs, response from outside.'],
    ['Databases on VMs', 'Disk for data and WAL, memory and connections, and verified backups.'],
    ['Batch and cron hosts', 'Job completion, output-disk headroom, and log rotation before it fills.'],
    ['Bastion and edge', 'Reachability, certificate expiry, and auth-log monitoring.'],
    ['Dev and staging fleets', 'Cheap fleet-wide monitoring, scheduled scale-down, and disk hygiene.'],
  ],
  failures: [
    ['Disk full at 3am', 'Logs or a runaway file filled the disk and the service is failing writes.', 'A runbook archives to S3 and truncates or rotates, behind an approval, before it hits 100%.'],
    ['A service crashed', 'A systemd unit died or is restart-looping, so the endpoint is down.', 'Restart the unit, confirm it is active, and escalate if it loops again.'],
    ['Memory leak and OOM', 'A process grows until the OOM killer takes it, dropping requests.', 'Restart the leaking process to recover, and alert with the RCA so the leak gets fixed.'],
    ['Certificate expired', 'A host TLS cert lapsed and clients now fail the handshake.', 'Alert well before expiry, and renew or rotate on a schedule.'],
    ['VM unreachable', 'The host stopped answering, from a kernel panic, network, or a hung box.', 'Escalate, collect diagnostics, and, where safe, trigger a reboot with approval.'],
    ['Package or config drift', 'A host fell behind on patches or drifted from the baseline.', 'Run the same check and fix across the fleet on a schedule, with a summary.'],
  ],
  faqs: [
    ['How do I monitor a Linux VM?', 'Watch disk and inodes, memory and swap, CPU and load, systemd service health, log growth, certificate expiry, and reachability. The common stack is node_exporter on each VM scraped by Prometheus and graphed in Grafana; the agentless alternative is monitoring over SSH so you do not install an exporter on every host.'],
    ['How do I monitor VMs with Grafana and Prometheus?', 'Run node_exporter as a systemd service on each VM (it exposes metrics on port 9100), add the hosts to your Prometheus scrape config, and build or import a Node Exporter dashboard in Grafana. Then alert on disk, memory, load, and service state through Alertmanager.'],
    ['What is node_exporter?', 'node_exporter is the Prometheus agent for host-level metrics: CPU, memory, disk, filesystem, network, and, with the systemd collector, service state. It is the standard way to get Linux VM metrics into Prometheus and Grafana.'],
    ['Can I monitor VMs without installing an agent?', 'Yes. AlertMend can monitor a fleet over SSH with no resident agent on each host, which avoids installing and maintaining an exporter everywhere. It also ingests alerts you already produce in Prometheus, Alertmanager, or Datadog.'],
    ['What should I alert on for a VM?', 'Disk used over 80% (page at 90%) and inodes over 80%, available memory under 10% or sustained swap, load per core over 1.5, any systemd unit that is not active, a log flood, a certificate under 14 days from expiry, and the host being unreachable.'],
    ['How do I auto-remediate a full disk on a VM?', 'Trigger a runbook when disk crosses 90%, confirm the cause over SSH, then archive logs to S3 and truncate or rotate behind an approval. AlertMend can run this across the exact host the alert named, and fan out across every matching VM.'],
    ['How do I monitor a whole fleet of VMs?', 'Scrape every host with node_exporter, or connect the fleet to AlertMend over SSH, then run one runbook that fans out across every matching VM for checks and fixes, instead of SSHing host by host.'],
    ['Does AlertMend replace Grafana?', 'No, it complements it. Keep your Grafana dashboards and Prometheus alerts; AlertMend adds the layer Grafana does not have, governed auto-remediation, plus agentless coverage for hosts you never instrumented.'],
    ['How do I automatically restart a crashed service on a VM?', 'A runbook can detect a systemd unit that is not active, restart it, confirm it is active again, and escalate if it keeps looping, with the whole action recorded for audit. systemd Restart=on-failure handles simple cases, but a runbook adds verification, escalation, and a record.'],
    ['How do I monitor Windows VMs?', 'Use windows_exporter (the Windows equivalent of node_exporter) to get metrics into Prometheus and Grafana. The same alerting and auto-remediation patterns apply, with PowerShell or WinRM in place of SSH for the fix steps.'],
    ['What port does node_exporter use?', 'node_exporter listens on port 9100 by default and exposes host metrics at /metrics. Point your Prometheus scrape config at host:9100 for each VM, and expose 9100 only to your Prometheus server rather than the public internet.'],
    ['How do I check disk usage on a Linux VM?', 'Use df -h to see usage per filesystem and du -sh /path/* to find what is consuming a directory. For monitoring, node_exporter exposes node_filesystem_avail_bytes and node_filesystem_size_bytes, so you can alert when a mount crosses 80% instead of checking by hand.'],
    ['How do I monitor CPU and memory on a Linux VM?', 'CPU comes from node_cpu_seconds_total (use rate to get utilization) and load from node_load1 and node_load5; memory comes from node_memory_MemAvailable_bytes against node_memory_MemTotal_bytes. Alert on sustained high load per core and on available memory dropping under about 10%.'],
    ['How do I monitor systemd services with Prometheus?', 'Enable the systemd collector in node_exporter, which exposes node_systemd_unit_state per unit and state. Alert when node_systemd_unit_state{name="your.service", state="active"} == 0 to catch a service that has died or failed to start.'],
    ['How do I monitor Docker containers running on a VM?', 'node_exporter host metrics do not see inside containers, so use cAdvisor to export per-container CPU, memory, and restart metrics to Prometheus, or run checks like docker ps and docker inspect. AlertMend can custom-monitor the specific containers you name over SSH, alert when one is unhealthy or crash-looping, and restart it with a runbook.'],
    ['How do I monitor a specific process on a Linux server?', 'Check that the process is alive with pgrep or systemctl is-active and alert when it is missing. node_exporter with the systemd collector covers services, and for an arbitrary process a custom check works. AlertMend can watch the exact processes you care about agentlessly and auto-restart a dead one behind an approval.'],
    ['How do I get alerted when a server goes down?', 'Alert on the node_exporter target being unreachable with up{job="node"} == 0, or on a ping or health check failing, and route it to Slack, email, or PagerDuty through Alertmanager. AlertMend can turn that same alert into a runbook that collects diagnostics and, where safe, triggers a reboot behind an approval.'],
    ['Can I monitor cloud VMs like EC2, Azure VM, or GCE?', 'Yes. Run node_exporter on the instance and scrape it with Prometheus the same way as any VM, or use the cloud provider metrics. AlertMend can also connect to cloud VMs over SSH agentlessly and ingest CloudWatch or Azure Monitor alerts, so you get monitoring plus remediation without an agent on every instance.'],
    ['What is agentless monitoring?', 'Agentless monitoring collects host data over an existing channel such as SSH or an API, instead of a resident agent installed on every machine. It removes the work of deploying and updating an exporter on each host, which matters most for large or short-lived fleets.'],
    ['How do I reduce VM alert noise?', 'Add a for-duration to alerts so a brief spike does not page, set thresholds off your real baseline, and deduplicate related alerts. AlertMend also normalizes alerts from Prometheus, Alertmanager, and Datadog into one funnel and attaches the root cause, so one incident is one notification rather than ten.'],
  ],
  sources: [
    ['Prometheus node_exporter', 'https://github.com/prometheus/node_exporter'],
    ['Prometheus: monitoring a Linux host', 'https://prometheus.io/docs/guides/node-exporter/'],
    ['Grafana: Node Exporter Full dashboard', 'https://grafana.com/grafana/dashboards/1860-node-exporter-full/'],
    ['systemd: service restart directives', 'https://www.freedesktop.org/software/systemd/man/systemd.service.html'],
  ],
}

function jsonLd() {
  const canonical = `${SITE_URL}/blog/${CFG.slug}`, img = `${SITE_URL}/assets/${CFG.slug}/hero.png`
  const article = { '@context': 'https://schema.org', '@type': 'TechArticle', headline: CFG.title, description: CFG.excerpt, image: img, datePublished: DATE, dateModified: MODIFIED, author: { '@type': 'Person', name: AUTHOR, jobTitle: 'Co-Founder at AlertMend.io', url: LINKEDIN, sameAs: [LINKEDIN] }, publisher: { '@type': 'Organization', name: 'AlertMend AI', logo: { '@type': 'ImageObject', url: `${SITE_URL}/logos/alertmend-logo.svg` } }, mainEntityOfPage: { '@type': 'WebPage', '@id': canonical } }
  const faq = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: CFG.faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) }
  return [article, faq].map((o) => `  <script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n')
}

function render() {
  const canonical = `${SITE_URL}/blog/${CFG.slug}`, cal = calendlyUrl(CFG.slug), img = `${SITE_URL}/assets/${CFG.slug}/hero.png`
  const related = [['cross-stack-incident-automation', 'Cross-Stack Incident Automation'], ['automate-ops-toil', 'Runbook Automation for Toil'], ['top-kubernetes-cost-management-solutions', 'Kubernetes Cost Management']]
  const relatedSidebar = [
    { slug: 'cross-stack-incident-automation', title: 'Automate Complex Incidents with Runbooks' },
    { slug: 'automate-ops-toil', title: 'Eliminate Toil with Runbook Automation' },
    { slug: 'gitlab-monitoring', title: 'GitLab Self-Hosted Monitoring' },
    { slug: 'odoo-monitoring', title: 'Odoo Monitoring and Auto-Recovery' },
    { slug: 'top-kubernetes-cost-management-solutions', title: 'Top Kubernetes Cost Management Solutions' },
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
      <div class="brandChip"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="${ACCENT}" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="${SERVER}"/></svg><span>VM and Linux server reliability</span></div>
      <div class="proofBar" style="display:flex;flex-wrap:wrap;gap:8px 16px;align-items:center;margin:-.75rem 0 1.5rem;color:#52525b;font-size:.82rem;">
        <span style="display:inline-flex;align-items:center;gap:6px;font-weight:700;color:#047857;"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>Works with your Grafana · agentless · governed with approvals</span>
        <span style="color:#d4d4d8;">&bull;</span><span>Last reviewed ${MODIFIED}</span>
        <span style="color:#d4d4d8;">&bull;</span><span>${CFG.sources.length} primary sources</span>
      </div>
    <div class="dl-blog">
      <section class="heroBand heroBandCompact">
        <p class="heroGuideLabel">VM monitoring and auto-remediation · works alongside Grafana</p>
        <div class="instantFix">
          <div class="instantFixTop"><span>THE 60-SECOND ANSWER</span><strong>Grafana shows you the VM problem. It does not fix it.</strong></div>
          <p>Monitor the six things that actually take a VM down (disk, memory, CPU, service health, logs, certs) with node_exporter and Grafana, or agentless over SSH. Then automate the fix for the recoverable ones, a full disk or a crashed service, with a governed runbook that acts on the exact host and fans out across the fleet.</p>
          <div class="instantFixCommands">
            <code>node_exporter :9100</code><span>metrics into Grafana</span>
            <code>disk &gt; 90% / unit not active</code><span>what to alert on</span>
            <code>runbook: ssh &rarr; fix &rarr; approve</code><span>the auto-remediation</span>
          </div>
        </div>
      </section>

      <nav class="articleToc" aria-label="On this page"><strong>On this page</strong>
        <a href="#gap">The gap Grafana leaves</a>
        <a href="#monitor">What to monitor</a>
        <a href="#how">How to monitor</a>
        <a href="#alerts">What to alert on</a>
        <a href="#failures">Classic VM failures</a>
        <a href="#automate">Automate the fix</a>
        <a href="#time-saved">Time saved</a>
        <a href="#usecases">By workload</a>
        <a href="#faq">FAQ</a>
      </nav>

      <h2 class="sectionHead" id="gap">You have Grafana. Here is what it is missing.</h2>
      <p class="bodyText">If you run VMs, you probably already have Grafana and Prometheus with node_exporter drawing beautiful graphs of CPU, memory, and disk. That is monitoring, and it is genuinely useful. But a dashboard is a spectator. When a disk crosses 90% at 3am or a service dies, Grafana lights up red and then waits for a human to SSH in and fix it. The gap is not visibility, it is remediation.</p>
      ${diskGauge()}
      <p class="bodyText">This guide covers both halves: the signals worth watching on a Linux VM and how to collect them, and then the part most stacks are missing, automating the fix for the failures that are safe to automate, so the 3am disk-full never becomes an outage.</p>

      <h2 class="sectionHead" id="monitor">What to monitor on a VM</h2>
      <p class="sectionSub">A VM is healthy on more than one axis. These are the signals that separate a green box from one about to page you.</p>
      <div class="rbGrid">${CFG.signals.map((r) => `<div class="rbCard"><h3>${esc(r[0])}</h3><p>${esc(r[1])}</p></div>`).join('')}</div>

      <h2 class="sectionHead" id="how">How to monitor: node_exporter, or agentless</h2>
      <p class="bodyText">The standard path is node_exporter on each VM, scraped by Prometheus and graphed in Grafana. If you would rather not install and maintain an exporter on every host, AlertMend can monitor the fleet over SSH with no resident agent, and ingest the alerts you already produce.</p>
      ${codeBlock(INSTALL)}
      <p class="bodyText">The queries that catch the failures that matter:</p>
      ${codeBlock(PROMQL)}
      <p class="bodyText">Host metrics stop at the operating system. If the VM runs Docker or a specific daemon, you also want to know that <em>your</em> container is up and your process is alive, not just that the box has spare CPU. cAdvisor exposes per-container metrics to Prometheus, and AlertMend can <strong>custom-monitor exactly the containers and processes you name</strong>, over SSH, with no extra exporter to install.</p>
      ${codeBlock(CUSTOM)}

      <h2 class="sectionHead" id="alerts">What to alert on</h2>
      <p class="sectionSub">Concrete thresholds worth paging on. Tune them to your baseline, but this is a sound default.</p>
      <div class="diyWrap"><table class="compareTable"><thead><tr><th>Alert</th><th>Condition and threshold</th></tr></thead><tbody>
        ${CFG.alerts.map((a) => `<tr><td>${esc(a[0])}</td><td class="diyHighlight">${esc(a[1])}</td></tr>`).join('\n        ')}
      </tbody></table></div>

      <h2 class="sectionHead" id="failures">The classic VM failures, and the fix</h2>
      <div class="searchIssueGrid">${CFG.failures.map(([t, d, f]) => `<div class="searchIssueCard"><h3 class="searchIssueTerm">${esc(t)}</h3><p class="searchIssueDesc">${esc(d)}</p><p class="searchIssueAlert"><strong>Auto-fix:</strong> ${esc(f)}</p></div>`).join('')}</div>

      <h2 class="sectionHead" id="automate">Automate the fix with a runbook</h2>
      <p class="bodyText">Monitoring tells you the disk is at 92%. A runbook does something about it. This one triggers on the same alert you already have, connects to the exact host over SSH, confirms the cause, and fixes the recoverable case behind an approval, then records everything.</p>
      ${flowSvg()}
      ${codeBlock(RUNBOOK)}
      <div class="calloutBox"><strong>Why agentless and runtime-targeted matter:</strong> there is no exporter or agent to install on every box, and the fix runs on whatever host the alert named, not a hardcoded list, so one runbook covers a fleet of three or three hundred. The full pattern is in <a href="/blog/cross-stack-incident-automation">cross-stack incident automation</a>, and the scheduled, fleet-wide hygiene version is in <a href="/blog/automate-ops-toil">runbook automation for toil</a>.</div>

      <div class="ctaInline">Already on Grafana and tired of the 3am SSH? <a href="${cal}" target="_blank" rel="noopener noreferrer">Book a free consultation &rarr;</a> and we will wire your worst recurring VM alert to an auto-fix runbook.</div>

      <h2 class="sectionHead" id="time-saved">The time this saves</h2>
      <p class="bodyText">Automating VM workflows is not abstract, it is measured in hours and 3am wake-ups. A disk-full that took 20 to 30 minutes of SSH work becomes an under-one-minute automated fix, and a fleet-wide task that scaled with your server count becomes a single scheduled pass.</p>
      <div class="roiFacts">
        <div class="roiFact"><span>Disk full at 3am</span><strong>~25 min &rarr; under 1 min</strong><em>and nobody wakes up</em></div>
        <div class="roiFact"><span>Disk hygiene, 200 VMs</span><strong>a morning &rarr; one pass</strong><em>fanned out, on a schedule</em></div>
        <div class="roiFact"><span>Crashed service</span><strong>~15 min &rarr; seconds</strong><em>auto-restart and verify</em></div>
      </div>
      <div class="roiCalc" role="group" aria-label="VM automation time-saved calculator">
        <p class="roiCalcTitle">Estimate the time you get back</p>
        <div class="roiRow"><label for="vmInc">Recoverable VM incidents per week</label><output id="outInc">8</output></div>
        <input class="roiSlider" type="range" id="vmInc" min="0" max="40" value="8" step="1" aria-label="Recoverable VM incidents per week">
        <div class="roiRow"><label for="vmMin">Minutes to fix each by hand</label><output id="outMin">25 min</output></div>
        <input class="roiSlider" type="range" id="vmMin" min="5" max="60" value="25" step="5" aria-label="Minutes to fix each incident by hand">
        <div class="roiRow"><label for="vmToil">Routine VM toil per week (patching, hygiene, certs)</label><output id="outToil">6 hr</output></div>
        <input class="roiSlider" type="range" id="vmToil" min="0" max="40" value="6" step="1" aria-label="Routine VM toil hours per week">
        <div class="roiResult"><div><span>Hours back / month</span><strong id="vmHrs">0</strong></div><div><span>Working days / month</span><strong id="vmDays">0</strong></div></div>
        <p class="roiNote" id="vmNote"></p>
      </div>
      <p class="bodyText">These are addressable hours, and a runbook reclaims most of them, since the recoverable fixes run in seconds without a human. The <a href="https://sre.google/sre-book/eliminating-toil/" target="_blank" rel="noopener noreferrer">SRE guideline</a> is to keep this kind of toil under half an engineer time; automating the safe cases is how you get back toward it.</p>

      <h2 class="sectionHead" id="time-saved">The time this saves</h2>
      <p class="bodyText">VM workflow automation is measured in hours and 3am wake-ups. A disk-full that took 20 to 30 minutes of SSH work becomes an under-one-minute automated fix, and a fleet-wide task that scaled with your server count becomes a single scheduled pass.</p>
      <div class="roiFacts">
        <div class="roiFact"><span>Disk full at 3am</span><strong>~25 min &rarr; under 1 min</strong><em>and nobody wakes up</em></div>
        <div class="roiFact"><span>Fleet disk hygiene, 200 VMs</span><strong>a morning &rarr; one pass</strong><em>fanned out, on a schedule</em></div>
        <div class="roiFact"><span>Crashed service</span><strong>~15 min &rarr; seconds</strong><em>auto-restart and verify</em></div>
      </div>
      <div class="roiCalc" role="group" aria-label="VM automation time-saved calculator">
        <p class="roiCalcTitle">Estimate the time you get back</p>
        <div class="roiRow"><label for="vmInc">Recoverable VM incidents per week</label><output id="outInc">8</output></div>
        <input class="roiSlider" type="range" id="vmInc" min="0" max="40" value="8" step="1" aria-label="Recoverable incidents per week">
        <div class="roiRow"><label for="vmMin">Minutes to fix each by hand</label><output id="outMin">25 min</output></div>
        <input class="roiSlider" type="range" id="vmMin" min="5" max="60" value="25" step="5" aria-label="Minutes per fix">
        <div class="roiRow"><label for="vmToil">Routine VM toil per week (patching, hygiene, certs)</label><output id="outToil">6 hr</output></div>
        <input class="roiSlider" type="range" id="vmToil" min="0" max="40" value="6" step="1" aria-label="Routine toil hours per week">
        <div class="roiResult"><div><span>Hours back / month</span><strong id="vmHrs">0</strong></div><div><span>Working days / month</span><strong id="vmDays">0</strong></div></div>
        <p class="roiNote" id="vmNote"></p>
      </div>
      <p class="bodyText">These are addressable hours; a runbook reclaims most of them, since the recoverable fixes run in seconds without a human. The <a href="https://sre.google/sre-book/eliminating-toil/" target="_blank" rel="noopener noreferrer">SRE guideline</a> is to keep this kind of toil under half an engineer time, and automating the safe cases is how you get back toward it.</p>

      <h2 class="sectionHead" id="usecases">Monitoring priorities by VM workload</h2>
      <p class="sectionSub">The signals are the same, but what hurts first depends on what the VM runs. Find your row.</p>
      <div class="diyWrap"><table class="compareTable"><thead><tr><th>Workload</th><th>Watch most closely</th></tr></thead><tbody>
        ${CFG.useCases.map((r) => `<tr><td>${esc(r[0])}</td><td class="diyHighlight">${esc(r[1])}</td></tr>`).join('\n        ')}
      </tbody></table></div>

      <h2 class="sectionHead" id="sources">Primary sources</h2>
      <ul class="sourceList">${CFG.sources.map(([l, u]) => `<li><a href="${u}" target="_blank" rel="noopener noreferrer">${esc(l)}</a></li>`).join('')}</ul>
      <div class="reviewPolicy"><strong>Method and disclosure:</strong> the metrics, queries, and thresholds above are drawn from the Prometheus node_exporter, Grafana, and systemd documentation linked in Primary sources, and can vary by distribution and version. AlertMend publishes this guide and may benefit if readers evaluate its product. Every command here works without AlertMend.</div>

      <h2 class="sectionHead" id="faq">VM monitoring FAQ</h2>
      <div class="faqList">${CFG.faqs.map(([q, a], i) => `<div class="faqItem"><button type="button" class="faqQuestion" data-faq-toggle aria-expanded="${i === 0 ? 'true' : 'false'}">${esc(q)}<svg class="faqChevron${i === 0 ? ' faqChevronOpen' : ''}" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 9l6 6 6-6"/></svg></button><div class="faqAnswer${i === 0 ? '' : ' hidden'}">${esc(a)}</div></div>`).join('')}</div>
${authorCard()}
      <div class="ctaBand">
        <div class="ctaBandTitle">Keep your Grafana. Add the auto-fix.</div>
        <p class="ctaBandSub">AlertMend watches your VMs agentlessly, ingests the alerts you already have, and runs governed runbooks that fix a full disk or a crashed service on the exact host, before it becomes an outage. The consultation is free and with no obligation.</p>
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
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"><defs><linearGradient id="hg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#100a04"/><stop offset="1" stop-color="${ACCENT_DARK}"/></linearGradient></defs><rect width="1200" height="630" fill="url(#hg)"/><g transform="translate(80,80)"><circle cx="22" cy="22" r="22" fill="${ACCENT}"/><text x="22" y="30" font-size="22" font-weight="800" fill="#fff" text-anchor="middle">A</text><text x="56" y="30" font-size="24" font-weight="700" fill="#fff">AlertMend</text><text x="228" y="30" font-size="18" fill="#c8a878">· VM reliability</text></g><path d="${SERVER}" transform="translate(980,66) scale(6)" fill="none" stroke="${ACCENT}" stroke-width="1.5"/><text x="80" y="248" font-size="56" font-weight="800" fill="#fff">VM Monitoring</text><text x="80" y="308" font-size="32" font-weight="700" fill="${ACCENT}">Watch it, then auto-fix it.</text><g font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="19"><rect x="80" y="360" width="1040" height="150" rx="14" fill="#1a140c" stroke="#3a2a15"/><text x="108" y="398" fill="#fbbf24">monitor</text><text x="300" y="398" fill="#f6e9d4">disk, memory, services, logs</text><text x="108" y="434" fill="#fbbf24">agentless</text><text x="300" y="434" fill="#f6e9d4">over SSH, works with your Grafana</text><text x="108" y="470" fill="#fbbf24">auto-fix</text><text x="300" y="470" fill="#f6e9d4">runbook on the exact host, at 3am</text></g><text x="80" y="560" font-size="19" fill="#c8a878">alertmend.io · monitor and auto-remediate your VM fleet</text></svg>\n`
}

const dir = path.join(root, 'public/blog', CFG.slug)
const assets = path.join(root, 'public/assets', CFG.slug)
fs.mkdirSync(dir, { recursive: true }); fs.mkdirSync(assets, { recursive: true })
fs.writeFileSync(path.join(dir, 'index.html'), render())
fs.writeFileSync(path.join(assets, 'script.js'), appendBlogSignupHandler(SCRIPT_JS))
fs.writeFileSync(path.join(assets, 'styles.css'), '/* base from make-error-127; accent + answer-card inlined in <style> */\n')
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
console.log(`✓ ${CFG.slug}  title+suffix ${tl}${tl < 30 || tl > 60 ? ' [LEN!]' : ''}  excerpt ${CFG.excerpt.length}  faqs ${CFG.faqs.length}`)
