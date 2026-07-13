import path from 'path'
import { fileURLToPath } from 'url'
import {
  AUTHOR_CRED_CSS,
  BLOG_SIGNUP_HANDLER_JS,
  CHROME_INLINE_CSS,
  ARVIND_AUTHOR,
  SITE_URL,
  buildNavHtml,
  buildSidebarHtml,
  calendlyUrl,
  esc,
  getRelatedPosts,
  writeStaticBlogOutputs,
} from './static-blog-shared.mjs'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')

const slug = 'qemu-exited-with-code-1'
const title = 'QEMU Exited Code 1 Fix'
const h1 = 'QEMU Exited with Code 1: Fix Proxmox VM Start Failures Safely'
const description = 'Fix Proxmox task error: start failed: QEMU exited with code 1. Diagnose image locks, storage, CPU, passthrough, permissions, and safe recovery.'
const publishedDate = '2026-01-10'
const modifiedDate = '2026-07-13'
const category = 'Virtualization'
const keywords = 'qemu exited with code 1, task error start failed qemu exited with code 1, proxmox qemu exited with code 1, start failed qemu exited with code 1, qemu exited from an error, is another process using the image, qemu process terminated unexpectedly exit status 1'
const canonical = `${SITE_URL}/blog/${slug}`
const calendly = calendlyUrl(slug)
const related = getRelatedPosts(slug, category)
const heroImage = `${SITE_URL}/assets/${slug}/hero.svg`
const author = {
  ...ARVIND_AUTHOR,
  role: 'Co-Founder & CEO',
  credLine: 'Kubestronaut and Kubernetes expert with 15+ years in infrastructure automation',
  linkedin: 'https://www.linkedin.com/in/arvind-rajpurohit-4a332523/',
}

const faq = [
  {
    q: 'What does “QEMU exited with code 1” mean in Proxmox?',
    a: 'It means the QEMU process failed while Proxmox was starting the VM. Code 1 is generic; the useful cause is usually in the task log or the line immediately above it, such as image lock, missing storage, bad VM config, KVM failure, passthrough conflict, or disk image error.',
  },
  {
    q: 'How do I fix “task error: start failed: QEMU exited with code 1”?',
    a: 'Open the Proxmox task log, read the first real QEMU error above the generic code 1 line, then check the matching layer: image lock, storage health, VM config, KVM modules, passthrough devices, or disk image integrity.',
  },
  {
    q: 'What does “is another process using the image” mean?',
    a: 'QEMU could not acquire the disk image write lock because another QEMU process, backup, migration, or stale process may still be using the image. Confirm the VM and disk are not active before clearing locks or running disk checks.',
  },
  {
    q: 'Should I run qm unlock immediately?',
    a: 'No. Run qm unlock only after confirming no backup, migration, snapshot, or QEMU process is actually using the VM. Unlocking the config while the disk is still in use can make the next action more dangerous.',
  },
  {
    q: 'Should I run qemu-img check or repair?',
    a: 'Only when the VM is stopped and no process is using the image. QEMU documentation warns against modifying images that are in use. Prefer a backup restore before repair options when data matters.',
  },
  {
    q: 'Why does restarting Proxmox sometimes appear to fix it?',
    a: 'A reboot can clear stale processes, storage sessions, or device ownership, but it does not explain the root cause. The better fix is to identify whether the failure was lock, storage, config, KVM, passthrough, or disk health.',
  },
]

const howToSteps = [
  { name: 'Read the Proxmox task log', text: 'Do not stop at code 1. Find the first specific QEMU or storage error above the generic task error line.' },
  { name: 'Identify the failure class', text: 'Classify the error as image lock, storage unavailable, bad VM config, KVM unavailable, passthrough busy, or disk image damage.' },
  { name: 'Run targeted checks', text: 'Use qm status, qm config, pvesm status, df, zpool, ceph, journalctl, lsof, or qemu-img only for the matching class.' },
  { name: 'Apply the safe fix and verify', text: 'Fix the underlying layer, then rerun the VM start and confirm the task log no longer reports the same root cause.' },
]

const blogPosting = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: h1,
  description,
  image: heroImage,
  datePublished: publishedDate,
  dateModified: modifiedDate,
  author: {
    '@type': 'Person',
    name: author.name,
    jobTitle: author.role,
    url: author.linkedin,
    sameAs: [author.linkedin],
  },
  publisher: {
    '@type': 'Organization',
    name: 'AlertMend AI',
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/logos/alertmend-logo.svg`,
    },
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': canonical,
  },
}

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to fix QEMU exited with code 1 in Proxmox',
  description,
  step: howToSteps.map((step, index) => ({
    '@type': 'HowToStep',
    position: index + 1,
    name: step.name,
    text: step.text,
  })),
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.a,
    },
  })),
}

function authorCard() {
  return `
  <section class="authorBioCard" aria-label="About the author">
    <img src="/logos/arvind.jpeg" alt="${esc(author.name)}" width="128" height="128" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
    <div class="authorBioFallback" aria-hidden="true">AR</div>
    <div class="authorBioContent">
      <h3>${esc(author.name)}</h3>
      <p class="authorBioRole">Co-Founder &amp; CEO</p>
      <div class="authorBioText">
        <p>Arvind is a Kubestronaut and Kubernetes expert with 15+ years of experience in infrastructure automation.</p>
        <p>Previously DevOps Team Lead at Roambee and Customer Success Engineer at Shoreline.io (acquired by NVIDIA), he has helped teams improve uptime, reduce cloud cost, and eliminate manual operations work. At AlertMend, Arvind focuses on safe autonomous remediation for Kubernetes, VM, storage, and production reliability incidents.</p>
      </div>
      <a class="authorBioLink" href="${author.linkedin}" target="_blank" rel="noopener noreferrer" aria-label="${esc(author.name)} on LinkedIn">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zM8.34 18V9.94H5.67V18h2.67zM7 8.76a1.55 1.55 0 1 0 0-3.1 1.55 1.55 0 0 0 0 3.1zM18.34 18v-4.42c0-2.37-1.27-3.47-2.96-3.47-1.36 0-1.97.75-2.31 1.28V9.94h-2.67V18h2.67v-4.5c0-.24.02-.48.09-.65.19-.48.63-.98 1.36-.98.96 0 1.35.73 1.35 1.8V18h2.82z"/></svg>
        <span>LinkedIn</span>
      </a>
    </div>
  </section>`
}

function faqHtml() {
  return faq.map((item, index) => `
    <div class="faqItem">
      <button class="faqQuestion" type="button" aria-expanded="${index === 0 ? 'true' : 'false'}">
        <span>${esc(item.q)}</span>
        <svg class="faqChevron${index === 0 ? ' faqChevronOpen' : ''}" width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <div class="faqAnswer" ${index === 0 ? '' : 'hidden'}>${esc(item.a)}</div>
    </div>`).join('')
}

const content = `
<header class="article-header article-header--cred">
  <h1>${esc(h1)}</h1>
  <p class="article-meta">${esc(publishedDate)} · ${esc(category)}</p>
</header>
<div class="proofStrip" aria-label="Article verification">
  <strong>✓ Checked against QEMU and Proxmox docs</strong>
  <span class="dot">•</span>
  <span>Last reviewed ${modifiedDate}</span>
  <span class="dot">•</span>
  <span>Sources cited</span>
</div>

<article class="qemuCode1 article-content">
  <section class="heroPanel" id="answer">
    <div class="heroGrid">
      <div class="answerCard">
        <span class="eyebrow">The 30-second answer</span>
        <h2>Code 1 is not the diagnosis. The line above it is.</h2>
        <p><strong>QEMU exited with code 1</strong> means the VM start process failed, but the real cause is usually one line earlier in the Proxmox task log: image lock, storage unavailable, bad config, KVM unavailable, passthrough conflict, or disk image damage.</p>
        <div class="logLine">TASK ERROR: start failed: QEMU exited with code 1<br>qemu: Failed to get "write" lock<br>Is another process using the image?</div>
        <p>Do not start with <code>qm unlock</code>, <code>kill -9</code>, or <code>qemu-img repair</code>. First prove what still owns the VM, disk, storage, or device.</p>
      </div>
      <div class="trustGraphic" aria-label="Proxmox QEMU failure flow">
        <div class="miniTerminal">
          <div class="terminalChrome"><span></span><span></span><span></span></div>
          <div class="terminalBody">
            <div><span class="muted">$</span> qm start 101</div>
            <div class="error">TASK ERROR: start failed</div>
            <div class="error">QEMU exited with code 1</div>
          </div>
        </div>
        <div class="trustPath">
          <div class="trustNode vmNode"><strong>Proxmox task</strong><span>start VM</span></div>
          <div class="trustArrow">→</div>
          <div class="trustNode"><strong>QEMU</strong><span>opens disk/device</span></div>
          <div class="trustArrow">→</div>
          <div class="trustNode dangerNode"><strong>real error</strong><span>read the log</span></div>
        </div>
      </div>
    </div>
  </section>

  <nav class="tocPills" aria-label="On this page">
    <a href="#meaning">Meaning</a>
    <a href="#decoder">Decoder</a>
    <a href="#safe-fix">Safe fix</a>
    <a href="#locks">Image locks</a>
    <a href="#avoid">Avoid</a>
    <a href="#automation">Automate it</a>
    <a href="#sources">Sources</a>
    <a href="#faq">FAQ</a>
  </nav>

  <section class="sectionBlock" id="meaning">
    <h2 class="sectionTitle">What “start failed: QEMU exited with code 1” means</h2>
    <p class="bodyText">In Proxmox, the web UI often shows a short wrapper error. The useful diagnosis is the first specific message from QEMU, storage, KVM, VFIO, or the host kernel. Treat code 1 as the smoke alarm, not the fire.</p>
    <div class="answerBox">
      <strong>Rule:</strong> copy the full task log before changing anything. If you only have “QEMU exited with code 1,” you do not yet have the cause.
    </div>
    <div class="decisionGrid">
      <div class="decisionCard">
        <h3>Most common</h3>
        <p><strong>Image lock or stale process</strong>: “Is another process using the image?”</p>
      </div>
      <div class="decisionCard">
        <h3>Most operational</h3>
        <p><strong>Storage unavailable</strong>: full disk, offline NFS/iSCSI, unhealthy Ceph, or ZFS issue.</p>
      </div>
      <div class="decisionCard">
        <h3>Most dangerous</h3>
        <p><strong>Disk image repair</strong>: only check or repair when the image is not in use.</p>
      </div>
    </div>
  </section>

  <section class="sectionBlock" id="decoder">
    <div class="decoderHeader">
      <div>
        <span class="eyebrow">Pick the real error</span>
        <h2 class="sectionTitle">Same code 1. Different fix.</h2>
      </div>
      <p>Select the clue from your task log. The generic code is the same, but the safe action changes completely.</p>
    </div>
    <div class="scenarioTabs" role="tablist" aria-label="QEMU exited with code 1 scenarios">
      <button class="scenarioTab isActive" type="button" role="tab" aria-selected="true" data-scenario="lock">Image in use</button>
      <button class="scenarioTab" type="button" role="tab" aria-selected="false" data-scenario="storage">Storage</button>
      <button class="scenarioTab" type="button" role="tab" aria-selected="false" data-scenario="config">Config</button>
      <button class="scenarioTab" type="button" role="tab" aria-selected="false" data-scenario="kvm">KVM/CPU</button>
      <button class="scenarioTab" type="button" role="tab" aria-selected="false" data-scenario="passthrough">Passthrough</button>
      <button class="scenarioTab" type="button" role="tab" aria-selected="false" data-scenario="disk">Disk image</button>
    </div>
    <div class="scenarioPanel">
      <div class="scenarioTerminal" aria-live="polite">
        <span class="dim">$ observed task log</span>
        <strong data-scenario-output>TASK ERROR: start failed: QEMU exited with code 1
qemu: Failed to get "write" lock
Is another process using the image?</strong>
      </div>
      <div class="scenarioMeaning">
        <span class="eyebrow">Interpretation</span>
        <h3 data-scenario-title>The disk image is already open or still locked by another process.</h3>
        <p data-scenario-copy>This usually happens after a stuck backup, migration, previous QEMU process, storage hiccup, or duplicate start. Do not repair the disk while something may still hold it.</p>
        <pre><code data-scenario-commands>qm status 101
qm config 101
ps -ef | grep "[q]emu-system.*101"
lsof | grep "vm-101-disk"</code></pre>
        <p class="scenarioFix"><strong>Fix:</strong> <span data-scenario-fix>Confirm no backup, migration, or QEMU process is active. Only then clear stale Proxmox locks or stop the stale process through the safest control path.</span></p>
      </div>
    </div>
  </section>

  <section class="sectionBlock" id="safe-fix">
    <h2 class="sectionTitle">Safe fix checklist</h2>
    <p class="bodyText">Run these checks in order. The goal is to avoid fixing the wrong layer under pressure.</p>
    <div class="stepsGrid">
      <div class="stepCard">
        <span>1</span>
        <h3>Save the task log</h3>
        <p>Copy the full Proxmox task output. The exact line above code 1 determines the fix.</p>
      </div>
      <div class="stepCard">
        <span>2</span>
        <h3>Check VM state</h3>
        <p>Run <code>qm status &lt;vmid&gt;</code>, inspect active jobs, and confirm this is not a backup, migration, or duplicate start.</p>
      </div>
      <div class="stepCard">
        <span>3</span>
        <h3>Check storage</h3>
        <p>Run <code>pvesm status</code>, <code>df -h</code>, and the storage-specific health command for ZFS, Ceph, NFS, or iSCSI.</p>
      </div>
      <div class="stepCard">
        <span>4</span>
        <h3>Check config and host</h3>
        <p>Run <code>qm config &lt;vmid&gt;</code>, then check KVM modules, bridges, passthrough devices, and disk paths.</p>
      </div>
    </div>
    <div class="fixTableWrap">
      <table class="fixTable">
        <thead>
          <tr><th>Log clue</th><th>First check</th><th>Safe action</th></tr>
        </thead>
        <tbody>
          <tr>
            <td data-label="Log clue">“Is another process using the image?”</td>
            <td data-label="First check"><code>qm status</code>, QEMU process, backup/migration task, <code>lsof</code></td>
            <td data-label="Safe action">Stop or wait for the real owner. Unlock only after proving no owner exists.</td>
          </tr>
          <tr>
            <td data-label="Log clue">“no space left” or storage offline</td>
            <td data-label="First check"><code>pvesm status</code>, <code>df -h</code>, ZFS/Ceph/NFS health</td>
            <td data-label="Safe action">Restore capacity or storage health before touching VM config.</td>
          </tr>
          <tr>
            <td data-label="Log clue">Bridge, ISO, disk path, or permission error</td>
            <td data-label="First check"><code>qm config &lt;vmid&gt;</code> and storage paths</td>
            <td data-label="Safe action">Fix the missing object or wrong VM option, then retry.</td>
          </tr>
          <tr>
            <td data-label="Log clue">KVM, VFIO, hostpci, USB, or GPU error</td>
            <td data-label="First check">Kernel logs, device ownership, IOMMU/VFIO binding</td>
            <td data-label="Safe action">Fix host capability or release the device before starting the VM.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <section class="sectionBlock" id="locks">
    <h2 class="sectionTitle">If the log says “is another process using the image”</h2>
    <p class="bodyText">This query showed up directly in Search Console, and it deserves a careful answer. Image-lock errors are where people most often make the situation worse by unlocking too early or running repair commands on an active disk.</p>
    <ul class="miniChecklist">
      <li><strong>Check the VM:</strong> <code>qm status &lt;vmid&gt;</code> should not report a running VM unless you are debugging a duplicate start.</li>
      <li><strong>Check Proxmox tasks:</strong> look for backup, snapshot, migration, replication, or restore work involving the same VM or storage.</li>
      <li><strong>Check QEMU processes:</strong> confirm no stale <code>qemu-system</code> process still references the VM ID or disk path.</li>
      <li><strong>Check disk owners:</strong> use <code>lsof</code> or storage-specific tooling to identify who has the disk open.</li>
      <li><strong>Only then unlock:</strong> use <code>qm unlock &lt;vmid&gt;</code> only after proving the lock is stale, not active protection.</li>
    </ul>
    <div class="answerBox">
      <strong>Important:</strong> QEMU’s own disk-image documentation warns not to modify images that are in use. That includes repair workflows. If the image may still be owned by a process, stop there and identify the owner first.
    </div>
  </section>

  <section class="sectionBlock" id="avoid">
    <h2 class="sectionTitle">What not to do first</h2>
    <div class="antiPattern">
      <div>
        <span class="eyebrow">Avoid the panic fix</span>
        <h3><code>qm unlock</code> + <code>kill -9</code> + repair</h3>
      </div>
      <p>Those commands may be valid in narrow cases, but they are not the first move. If a backup, migration, storage operation, or QEMU process is still legitimately using the image, forcing your way past the lock can risk data integrity.</p>
    </div>
  </section>

  <section class="sectionBlock" id="automation">
    <h2 class="sectionTitle">How you can automate QEMU code 1 diagnosis</h2>
    <p class="bodyText">This class of incident is perfect for automation because the useful evidence is structured: VM ID, Proxmox task log, VM config, storage status, running QEMU processes, host kernel logs, passthrough device state, and recent backup/migration jobs.</p>
    <div class="automationFlow">
      <h3>From generic code 1 to a safe fix</h3>
      <div class="automationTrack">
        <div class="automationStep"><strong>Detect</strong><span>VM start failed with QEMU code 1 in Proxmox, libvirt, or a VM automation job.</span></div>
        <div class="automationArrow">→</div>
        <div class="automationStep"><strong>Diagnose</strong><span>Classify image lock, storage, config, KVM, passthrough, or disk-image failure.</span></div>
        <div class="automationArrow">→</div>
        <div class="automationStep"><strong>Act safely</strong><span>Suggest wait, storage fix, config correction, device release, or approved unlock flow.</span></div>
        <div class="automationArrow">→</div>
        <div class="automationStep"><strong>Verify</strong><span>Retry start, attach root cause, and notify on-call through Slack or WhatsApp.</span></div>
      </div>
    </div>
    <h3 class="sectionTitle subTitle">Start by automating the basic toil</h3>
    <p class="bodyText">The first automation does not need to reboot hosts or repair disks. Start with evidence collection and classification. Make the agent say: “this is a stale image lock,” “this is storage full,” or “this is passthrough busy,” with the exact proof attached.</p>
    <div class="automationCta">
      <p><strong>Want to automate VM start failures?</strong> Bring one real Proxmox/QEMU incident and we will map the evidence, guardrails, and first safe runbook.</p>
      <a class="ctaButton ctaButtonPrimary" href="${calendly}&intent=qemu-code-1-automation-review" target="_blank" rel="noopener noreferrer">Book a 20-min automation review →</a>
    </div>
    <p class="bodyText">For enterprise teams, AlertMend can run as a managed or self-hosted control plane, with VM monitoring, on-call routing, Slack and WhatsApp workflows, approval gates, and local-model options. The goal is not to blindly restart VMs; it is to turn repeated virtualization toil into governed automation.</p>
  </section>

  <section class="sectionBlock" id="sources">
    <h2 class="sectionTitle">Primary sources checked</h2>
    <p class="bodyText">The guidance above is based on QEMU disk-image behavior and Proxmox/QEMU operational practice.</p>
    <ol class="sourceList">
      <li><a href="https://www.qemu.org/docs/master/tools/qemu-img.html" target="_blank" rel="noopener noreferrer">QEMU qemu-img documentation: image checks, repair options, and warnings about images in use</a></li>
      <li><a href="https://pve.proxmox.com/pve-docs/qm.1.html" target="_blank" rel="noopener noreferrer">Proxmox VE qm manual</a></li>
      <li><a href="https://pve.proxmox.com/wiki/Qemu/KVM_Virtual_Machines" target="_blank" rel="noopener noreferrer">Proxmox VE QEMU/KVM virtual machines documentation</a></li>
    </ol>
  </section>

  <section class="sectionBlock" id="faq">
    <h2 class="sectionTitle">FAQ</h2>
    <div class="faqList">
      ${faqHtml()}
    </div>
  </section>
</article>
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
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${canonical}">
  <link rel="icon" type="image/svg+xml" href="/logos/alertmend-logo.svg">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${esc(h1)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${heroImage}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(h1)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${heroImage}">
  <script type="application/ld+json">${JSON.stringify(blogPosting)}</script>
  <script type="application/ld+json">${JSON.stringify(howToJsonLd)}</script>
  <script type="application/ld+json">${JSON.stringify(faqJsonLd)}</script>
  <style>${CHROME_INLINE_CSS}${AUTHOR_CRED_CSS}</style>
  <link rel="stylesheet" href="/assets/${slug}/styles.css">
</head>
<body>
${buildNavHtml(slug, calendly)}
  <main class="main-container">
    <div class="content-wrapper">
      <div class="main-col">
        ${content}
        ${authorCard()}
        <div class="ctaBox">
          <h2>Want VM failures to self-diagnose before on-call jumps in?</h2>
          <p>See how AlertMend can correlate Proxmox task logs, VM config, storage health, QEMU processes, kernel logs, and safe remediation runbooks.</p>
          <div class="ctaButtons">
            <a class="ctaButton ctaButtonPrimary" href="${calendly}" target="_blank" rel="noopener noreferrer">Book a reliability review</a>
            <a class="ctaButton ctaButtonSecondary" href="https://app.alertmend.io/signup?service=remediation&source=blog-post&blog_slug=${slug}">Try AlertMend</a>
          </div>
        </div>
      </div>
      ${buildSidebarHtml(related, title)}
    </div>
  </main>
  <script src="/assets/${slug}/script.js"></script>
  <script>
  (function(){
${BLOG_SIGNUP_HANDLER_JS}
  })();
  </script>
</body>
</html>`

writeStaticBlogOutputs(slug, html)
console.log(`✓ Article source root: ${root}`)
