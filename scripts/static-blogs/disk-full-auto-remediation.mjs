/**
 * Code-generated rich blog: disk full auto-remediation use case.
 */
import {
  SITE_URL,
  esc,
  parseFrontmatter,
  getRelatedPosts,
  calendlyUrl,
  signupUrl,
  CHROME_INLINE_CSS,
  buildNavHtml,
  buildSidebarHtml,
  DINESH_AUTHOR,
  dineshJsonLdAuthor,
  AUTHOR_CRED_CSS,
  writeStaticBlogOutputs,
} from '../static-blog-shared.mjs'

export async function build(slug) {
  const assetsBase = `/assets/${slug}`
  const canonical = `${SITE_URL}/blog/${slug}`
  const heroImage = `${assetsBase}/hero.svg`

  const meta = parseFrontmatter(slug)
  const title = meta.title || 'Disk Full Auto-Remediation Playbook'
  const excerpt =
    meta.excerpt ||
    'A production playbook for turning disk space alerts into safe, audited fixes across Linux, Docker, Kubernetes, and cloud volumes.'
  const date = meta.date || '2026-07-19'
  const category = meta.category || 'Auto-Remediation'
  const author = meta.author || DINESH_AUTHOR.name
  const keywords =
    meta.keywords ||
    'disk full auto remediation, disk space alert automation, automated disk cleanup, linux disk full fix, kubernetes diskpressure remediation'

  const relatedPosts = getRelatedPosts(slug, category)
  const postCalendlyUrl = calendlyUrl(slug)
  const postSignupUrl = signupUrl(slug, 'blog-disk-full')

  const SOURCE_LINKS = [
    ['Kubernetes node-pressure eviction', 'https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/'],
    ['Docker prune command reference', 'https://docs.docker.com/reference/cli/docker/system/prune/'],
    ['systemd journalctl vacuum options', 'https://www.freedesktop.org/software/systemd/man/latest/journalctl.html'],
    ['PostgreSQL WAL documentation', 'https://www.postgresql.org/docs/current/wal-internals.html'],
  ]

  const FILL_SOURCES = [
    ['Application logs', 'A noisy app writes faster than logrotate or retention can handle.', 'Rotate, compress, or lower retention for known log paths.'],
    ['systemd journal', 'Journald grows quietly on long-lived VMs.', 'Vacuum by age or size after reading journal disk usage.'],
    ['Docker images and build cache', 'Old layers, stopped containers, and build cache pile up after deploys.', 'Prune unused images and build cache with age filters.'],
    ['Kubernetes node ephemeral storage', 'Pods, logs, and image layers push a node into DiskPressure.', 'Identify noisy pods and let kubelet or a guarded runbook recover space.'],
    ['Database WAL or archive logs', 'PostgreSQL, MySQL, and backup jobs can fill storage fast.', 'Treat as guarded. Never delete database files blindly.'],
    ['Backups and exports', 'Nightly dumps, failed upload retries, and old reports sit in local storage.', 'Delete only through an explicit retention policy.'],
    ['Inodes', 'Millions of small files make a volume unusable even when GB remain.', 'Measure inode usage and remove known cache trees.'],
    ['Temporary caches', 'Build directories, package caches, and temp files accumulate on workers.', 'Clean known paths owned by the service or CI job.'],
  ]

  const LADDERS = [
    [
      '1',
      'Confirm pressure',
      'Read disk %, inode %, growth rate, mount point, filesystem type, and whether the host or pod is still writable.',
      'Always automatic',
    ],
    [
      '2',
      'Find the growth path',
      'Run read-only checks for top directories, log sizes, Docker usage, journal usage, and node events.',
      'Always automatic',
    ],
    [
      '3',
      'Clean known-safe waste',
      'Vacuum old journals, rotate logs, remove stale temp files, and prune unused container images with age filters.',
      'Automatic with limits',
    ],
    [
      '4',
      'Ask before risky cleanup',
      'Backups, uploads, database files, active logs, and unknown directories require approval with evidence attached.',
      'Approval gate',
    ],
    [
      '5',
      'Expand storage if allowed',
      'For cloud disks, request a volume expansion when cleanup cannot bring the mount below the safe threshold.',
      'Policy controlled',
    ],
    [
      '6',
      'Verify and report',
      'Check disk is below threshold, services are healthy, pods are Ready, and the incident has an audit trail.',
      'Always automatic',
    ],
  ]

  const GREAT_SYSTEM_SIGNALS = [
    [
      'It finds the writer, not just the mount',
      'A useful response names the process, pod, job, log path, image cache, journal, backup task, or database component that is actually growing.',
    ],
    [
      'It separates safe waste from business data',
      'Old rotated logs and stale build cache are not the same as uploads, database WAL, Docker volumes, or backup archives.',
    ],
    [
      'It has a stop condition',
      'A runbook should know the maximum it can delete, the minimum free-space target, and when to ask a human instead of continuing.',
    ],
    [
      'It proves recovery',
      'The incident is not closed when the cleanup command exits. It is closed when disk, service health, pod readiness, and user-facing checks are green.',
    ],
  ]

  const MATURITY_LEVELS = [
    ['Level 0', 'Dashboard only', 'Someone notices a red panel and starts guessing.'],
    ['Level 1', 'Disk alert', 'The team knows a threshold crossed, but still investigates manually.'],
    ['Level 2', 'Auto-diagnosis', 'Every alert arrives with mount, growth path, owner, and recent change context.'],
    ['Level 3', 'Gated cleanup', 'Known-safe cleanup runs automatically. Risky actions ask approval with evidence.'],
    ['Level 4', 'Verified recovery', 'The system cleans, expands, escalates, verifies, and leaves an audit trail.'],
  ]

  const POLICY_MATRIX = [
    [
      'Run automatically',
      'Journal vacuum, old rotated logs, stale CI temp directories, unused Docker images, build cache with age filters',
      'Allowlisted path, owner match, age check, max deletion size, free-space target, rollback-safe',
    ],
    [
      'Ask for approval',
      'Cloud volume expansion, service restart, backup cleanup, large directory cleanup, container volume cleanup',
      'Attach evidence, predicted impact, command preview, owner, and cost or risk note',
    ],
    [
      'Keep human-only',
      'Database WAL deletion, unknown mount points, customer uploads, compliance archives, encrypted volumes',
      'Escalate with diagnosis. Do not hide the danger behind a button.',
    ],
  ]

  const READER_OUTCOMES = [
    ['Faster first response', 'The on-call starts with the likely cause, not a blank terminal.'],
    ['Less repeat toil', 'The same safe cleanup path runs every time the same alert pattern appears.'],
    ['Better incident notes', 'Every action, command, approval, and verification result is posted back to the channel.'],
    ['More trust in automation', 'Engineers can see why AlertMend acted, when it stopped, and what it refused to touch.'],
  ]

  const COMMANDS = [
    ['Linux host', 'df -hT\n\ndf -ih\n\ndu -xhd1 /var 2>/dev/null | sort -h'],
    ['systemd journal', 'journalctl --disk-usage\n\njournalctl --rotate\n\njournalctl --vacuum-time=7d'],
    ['Docker', 'docker system df -v\n\ndocker image prune -f --filter "until=168h"\n\ndocker builder prune -f --filter "until=168h"'],
    ['Kubernetes node', 'kubectl describe node <node-name>\n\nkubectl get events -A --field-selector reason=Evicted\n\nkubectl get pods -A -o wide | grep <node-name>'],
  ]

  const DO_NOT_AUTOMATE = [
    ['Deleting unknown directories', 'A full disk can hide customer uploads, active app data, or mounted volumes.', 'Only clean allowlisted paths with owner, age, and pattern checks.'],
    ['Deleting database WAL or archive files', 'You can break recovery, replication, or point-in-time restore.', 'Escalate to the database runbook or expand storage first.'],
    ['Pruning Docker volumes by default', 'Volumes may contain durable application data.', 'Prune images and build cache first. Gate volume deletion.'],
    ['Restarting services before space is recovered', 'Restart can fail if the process needs write space to boot.', 'Recover disk first, then restart only when the service check needs it.'],
    ['Shrinking retention globally', 'A quick retention change can destroy forensic data across every host.', 'Change retention through policy, not an emergency one-liner.'],
  ]

  const ALERTMEND_STEPS = [
    ['Receive', 'Datadog, Prometheus, Grafana, CloudWatch, New Relic, or a URL check sends the disk alert.'],
    ['Diagnose', 'AlertMend checks mount point, growth path, process owner, container context, node state, and recent deploys.'],
    ['Decide', 'The runbook classifies actions as safe, approval-gated, or human-only.'],
    ['Act', 'It rotates logs, vacuums journal, prunes stale images, expands volume, or asks approval when risk is real.'],
    ['Verify', 'It confirms free space, service health, pod readiness, and posts the result back to the incident channel.'],
  ]

  const AUTOMATION_CANDIDATES = [
    ['Great first runbook', 'journal vacuum, old compressed logs, stale Docker images, CI temp directories, known cache paths'],
    ['Approval-gated', 'backup deletion, volume expansion, service restart, container volume cleanup, large directory cleanup'],
    ['Human-only by default', 'database WAL, customer uploads, unknown mount points, encrypted volumes, compliance evidence'],
  ]

  const FAQ = [
    [
      'Can disk full remediation work with Datadog, Prometheus, Grafana, or CloudWatch?',
      'Yes. AlertMend does not need to replace your monitoring stack. It receives the alert, runs the diagnostic checks, chooses a safe runbook path, escalates when needed, and verifies the disk recovered.',
    ],
    [
      'Is it safe to automate disk cleanup in production?',
      'It is safe when the automation is constrained. Read-only diagnosis can run automatically. Known-safe cleanup can run with size and age limits. Risky paths such as backups, customer uploads, database files, and Docker volumes should require approval.',
    ],
    [
      'What disk cleanup can be automated first?',
      'Start with systemd journal vacuum, old rotated logs, stale temp directories, unused Docker images, and build cache cleanup with age filters. These are common, repeatable, and easy to verify after the runbook finishes.',
    ],
    [
      'Should I use docker system prune in production?',
      'Use caution. Docker pruning is useful, but avoid broad cleanup that removes volumes or data you still need. Prefer targeted image and build cache pruning with age filters, then gate anything that can delete durable data.',
    ],
    [
      'Can AlertMend handle Kubernetes DiskPressure?',
      'Yes. AlertMend can correlate node DiskPressure, pod eviction events, image layer usage, pod logs, and the owning workload, then route the incident or run an approved cleanup path.',
    ],
    [
      'Can AlertMend expand a cloud volume automatically?',
      'It can be policy-controlled. Many teams allow automatic expansion for specific hosts or volumes, while requiring approval for databases, regulated data, or cost-sensitive environments.',
    ],
    [
      'How do we avoid deleting the wrong files?',
      'Use an allowlist, owner labels, minimum age checks, maximum deletion size, dry-run evidence, approval gates, and post-action verification. A runbook should know exactly which paths it is allowed to touch.',
    ],
    [
      'What is the best CTA for a disk full automation project?',
      'Bring your noisiest disk alert and the last incident transcript. AlertMend can map which steps should be automatic, approval-gated, or human-only before anything runs in production.',
    ],
  ]

  const faqLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map(([q, a]) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  })

  const howToLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to automate disk full incident response safely',
    description: excerpt,
    step: LADDERS.map(([position, name, text]) => ({
      '@type': 'HowToStep',
      position: Number(position),
      name,
      text,
    })),
  })

  const blogLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: excerpt,
    image: `https://www.alertmend.io${heroImage}`,
    datePublished: date,
    dateModified: date,
    author: dineshJsonLdAuthor(),
    publisher: {
      '@type': 'Organization',
      name: 'AlertMend AI',
      logo: { '@type': 'ImageObject', url: 'https://www.alertmend.io/logos/alertmend-logo.svg' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
  })

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)} | AlertMend AI</title>
  <meta name="description" content="${esc(excerpt)}">
  <meta name="keywords" content="${esc(keywords)}">
  <meta name="author" content="${esc(author)}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <link rel="canonical" href="${canonical}">
  <link rel="icon" type="image/svg+xml" href="/logos/alertmend-logo.svg">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${canonical}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(excerpt)}">
  <meta property="og:image" content="https://www.alertmend.io${heroImage}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(excerpt)}">
  <meta name="twitter:image" content="https://www.alertmend.io${heroImage}">
  <script type="application/ld+json">${blogLd}</script>
  <script type="application/ld+json">${howToLd}</script>
  <script type="application/ld+json">${faqLd}</script>
  <style>
${CHROME_INLINE_CSS}
${AUTHOR_CRED_CSS}
    .main-container{padding-top:88px;}
    .article-header{margin-bottom:1.25rem;}
    .article-header h1{font-size:clamp(2.05rem,4vw,3.6rem);max-width:900px;}
    .topAuthorLine{display:flex;align-items:center;gap:13px;margin:0 0 .65rem;}
    .topAuthorLine img{width:46px;height:46px;border-radius:999px;object-fit:cover;margin:0;box-shadow:none;border:1px solid #e5e7eb;}
    .topAuthorName{display:inline-flex;color:#111827;font-weight:850;text-decoration:none;font-size:.98rem;line-height:1.25;}
    .topAuthorName:hover{color:#7c3aed;text-decoration:none;}
    .topAuthorDesc{margin:2px 0 0;color:#6b7280;font-size:.9rem;line-height:1.35;}
    .content-wrapper{gap:36px;}
    .main-col{max-width:960px;}
    .df-blog{display:flex;flex-direction:column;gap:44px;}
    .df-blog a{color:#7c3aed;font-weight:700;text-decoration:none;}
    .df-blog a:hover{text-decoration:underline;}
    .credStrip{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin:0 0 24px;}
    .credItem{border:1px solid #e5e7eb;border-radius:16px;background:#fff;padding:14px;box-shadow:0 8px 24px rgba(15,23,42,.045);}
    .credLabel{display:block;font-size:.72rem;line-height:1;text-transform:uppercase;letter-spacing:.13em;color:#7c3aed;font-weight:950;margin-bottom:8px;}
    .credText{display:block;font-size:.92rem;line-height:1.45;color:#374151;font-weight:760;}
    .heroUseCase{position:relative;overflow:hidden;border:1px solid #ddd6fe;border-radius:24px;background:linear-gradient(135deg,#09090b 0%,#1f1237 54%,#4c1d95 100%);color:#fff;padding:26px 28px;box-shadow:0 22px 58px rgba(15,23,42,.13);}
    .heroUseCase:before{content:"";position:absolute;inset:auto -20% -55% 18%;height:240px;background:radial-gradient(circle,rgba(167,139,250,.26),rgba(124,58,237,0));pointer-events:none;}
    .heroTop{position:relative;display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;margin-bottom:22px;}
    .topicPill{display:inline-flex;align-items:center;gap:9px;padding:7px 12px;border-radius:999px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.16);font-weight:850;font-size:.85rem;text-transform:uppercase;letter-spacing:.08em;color:#ede9fe;}
    .guidePill{font-size:.72rem;text-transform:uppercase;letter-spacing:.16em;color:#ddd6fe;font-weight:800;}
    .heroGrid{position:relative;display:grid;grid-template-columns:minmax(0,1fr) minmax(280px,.78fr);gap:26px;align-items:center;}
    .heroCopy h2{font-size:clamp(1.8rem,2.7vw,2.65rem);line-height:1.08;letter-spacing:-.04em;color:#fff;margin:0 0 16px;max-width:620px;}
    .heroCopy p{font-size:1.02rem;line-height:1.62;color:#ede9fe;max-width:590px;margin:0 0 20px;}
    .heroActions{display:flex;flex-wrap:wrap;gap:12px;}
    .heroBtn{display:inline-flex;align-items:center;justify-content:center;border-radius:999px;padding:11px 16px;font-weight:900;text-decoration:none;font-size:.92rem;}
    .heroBtnPrimary{background:#fff;color:#09090b!important;}
    .heroBtnSecondary{border:1px solid rgba(255,255,255,.26);color:#fff!important;background:rgba(255,255,255,.06);}
    .incidentPanel{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.18);border-radius:20px;padding:16px;backdrop-filter:blur(8px);}
    .incidentHeader{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px;}
    .incidentTitle{font-size:.72rem;text-transform:uppercase;letter-spacing:.13em;color:#ddd6fe;font-weight:900;}
    .incidentStatus{display:inline-flex;align-items:center;gap:6px;border-radius:999px;background:rgba(34,197,94,.14);border:1px solid rgba(134,239,172,.34);padding:5px 8px;color:#bbf7d0;font-weight:800;font-size:.72rem;}
    .statusDot{width:7px;height:7px;border-radius:999px;background:#22c55e;box-shadow:0 0 0 5px rgba(34,197,94,.12);}
    .diskGauge{background:#08070f;border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:15px;margin-bottom:10px;}
    .gaugeTop{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:10px;gap:10px;}
    .mountName{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;color:#d1d5db;font-weight:800;font-size:.84rem;}
    .mountValue{font-size:2.15rem;line-height:1;font-weight:950;color:#fff;letter-spacing:-.04em;}
    .barTrack{height:10px;border-radius:999px;background:#312e81;overflow:hidden;}
    .barFill{height:100%;border-radius:999px;background:linear-gradient(90deg,#7c3aed,#c4b5fd);animation:diskPulse 4s ease-in-out infinite;}
    .gaugeNote{color:#d8b4fe;margin-top:10px;font-size:.82rem;line-height:1.45;font-weight:700;}
    .evidenceRows{display:grid;gap:7px;}
    .evidenceRow{display:grid;grid-template-columns:58px 1fr auto;gap:8px;align-items:center;background:rgba(255,255,255,.075);border:1px solid rgba(255,255,255,.11);border-radius:12px;padding:8px 10px;color:#ede9fe;font-size:.8rem;line-height:1.35;}
    .evidenceRow strong{color:#fff;}
    .evidenceRow code{background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.14);color:#fff;}
    .sectionIntro{max-width:760px;}
    .eyebrow{font-size:.82rem;line-height:1;text-transform:uppercase;letter-spacing:.18em;color:#7c3aed;font-weight:950;margin:0 0 14px;}
    .sectionIntro h2,.splitCopy h2,.sourcesSection h2,.faqSection h2,.maturityBox h2{font-size:clamp(1.45rem,2.2vw,2.25rem);line-height:1.16;letter-spacing:-.03em;color:#09090b;margin:0 0 16px;}
    .sectionIntro p,.splitCopy p,.bodyText{font-size:1.08rem;line-height:1.8;color:#4b5563;margin:0 0 18px;}
    .callout{border:1px solid #ddd6fe;border-radius:20px;background:linear-gradient(135deg,#faf7ff,#fff);padding:22px;margin-top:18px;}
    .callout strong{color:#111827;}
    .signalGrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin-top:18px;}
    .signalCard{background:#fff;border:1px solid #e5e7eb;border-radius:18px;padding:20px;box-shadow:0 12px 32px rgba(15,23,42,.055);}
    .signalCard h3{font-size:1.05rem;color:#111827;margin:0 0 8px;}
    .signalCard p{font-size:.97rem;line-height:1.68;color:#4b5563;margin:0;}
    .scopeBox{border:1px solid #e5e7eb;border-radius:22px;background:#fff;padding:22px;box-shadow:0 12px 34px rgba(15,23,42,.055);}
    .scopeBox h2{font-size:clamp(1.45rem,2.2vw,2.2rem);line-height:1.16;letter-spacing:-.03em;color:#09090b;margin:0 0 12px;}
    .scopeGrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin-top:16px;}
    .scopeCard{border:1px solid #e5e7eb;border-radius:16px;background:#fafafa;padding:16px;}
    .scopeCard strong{display:block;color:#111827;margin-bottom:8px;font-size:1rem;}
    .scopeCard p{margin:0;color:#4b5563;font-size:.96rem;line-height:1.65;}
    .maturityBox{border:1px solid #ddd6fe;border-radius:24px;background:linear-gradient(135deg,#faf7ff,#fff);padding:22px;margin-top:18px;}
    .maturityTrack{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px;margin-top:16px;}
    .maturityStep{background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:14px;min-height:145px;}
    .maturityStep span{display:inline-flex;border-radius:999px;background:#ede9fe;color:#5b21b6;font-size:.75rem;font-weight:950;padding:5px 8px;margin-bottom:12px;}
    .maturityStep h3{font-size:.96rem;line-height:1.25;color:#111827;margin:0 0 8px;}
    .maturityStep p{font-size:.86rem;line-height:1.55;color:#4b5563;margin:0;}
    .sourceGrid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;}
    .sourceCard{background:#fff;border:1px solid #e5e7eb;border-radius:18px;padding:18px;box-shadow:0 10px 30px rgba(15,23,42,.05);}
    .sourceCard h3{font-size:1.04rem;color:#111827;margin:0 0 8px;}
    .sourceCard p{font-size:.95rem;line-height:1.65;color:#4b5563;margin:0;}
    .ladder{display:grid;gap:14px;}
    .ladderItem{display:grid;grid-template-columns:64px minmax(0,1fr) 150px;gap:18px;align-items:start;padding:20px;border:1px solid #e5e7eb;border-radius:20px;background:#fff;box-shadow:0 12px 32px rgba(15,23,42,.055);}
    .ladderNum{width:42px;height:42px;border-radius:14px;background:#7c3aed;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:950;}
    .ladderItem h3{font-size:1.12rem;line-height:1.25;color:#111827;margin:0 0 6px;}
    .ladderItem p{font-size:.98rem;line-height:1.65;color:#4b5563;margin:0;}
    .ladderBadge{justify-self:end;border-radius:999px;background:#f5f3ff;border:1px solid #ddd6fe;color:#5b21b6;padding:7px 10px;font-weight:850;font-size:.78rem;text-align:center;}
    .policyTable{overflow:hidden;border:1px solid #e5e7eb;border-radius:22px;background:#fff;box-shadow:0 12px 34px rgba(15,23,42,.055);}
    .policyRow{display:grid;grid-template-columns:190px minmax(0,1fr) minmax(0,1fr);border-top:1px solid #e5e7eb;}
    .policyRow:first-child{border-top:none;}
    .policyCell{padding:18px;line-height:1.65;color:#4b5563;}
    .policyCell strong{display:block;color:#111827;font-size:1rem;margin-bottom:6px;}
    .policyHeader .policyCell{background:#111827;color:#fff;font-weight:950;text-transform:uppercase;letter-spacing:.12em;font-size:.78rem;}
    .split{display:grid;grid-template-columns:minmax(0,.92fr) minmax(300px,1.08fr);gap:28px;align-items:start;}
    .commandStack{display:grid;gap:14px;}
    .commandCard{background:#111827;color:#e5e7eb;border-radius:18px;padding:18px;border:1px solid #27272a;}
    .commandCard h3{color:#fff;font-size:1rem;margin:0 0 12px;}
    .commandCard pre{margin:0;background:transparent;border:none;color:#e5e7eb;padding:0;white-space:pre-wrap;font-size:.86rem;line-height:1.6;}
    .dangerGrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;}
    .dangerCard{border:1px solid #fecaca;border-radius:18px;background:#fff7f7;padding:18px;}
    .dangerCard h3{font-size:1.02rem;color:#991b1b;margin:0 0 8px;}
    .dangerCard p{font-size:.96rem;line-height:1.65;color:#4b5563;margin:0 0 10px;}
    .safeLine{font-size:.9rem;font-weight:850;color:#166534;}
    .alertmendFlow{border-radius:26px;border:1px solid #ddd6fe;background:linear-gradient(135deg,#faf7ff 0%,#fff 52%,#f5f3ff 100%);padding:26px;}
    .flowHeader{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-bottom:20px;}
    .flowHeader h2{font-size:clamp(1.45rem,2.3vw,2.3rem);line-height:1.16;color:#09090b;letter-spacing:-.03em;margin:0;}
    .logoLockup{display:flex;align-items:center;gap:10px;font-weight:900;color:#4c1d95;}
    .logoLockup img{width:36px;height:36px;margin:0;box-shadow:none;border-radius:0;}
    .flowGraphic{border:1px solid #ddd6fe;border-radius:24px;background:#fff;padding:20px;margin:0 0 18px;box-shadow:0 16px 44px rgba(76,29,149,.08);}
    .flowGraphicTop{display:grid;grid-template-columns:1fr 42px 1fr 42px 1fr;gap:10px;align-items:center;margin-bottom:14px;}
    .flowGraphicNode{min-height:122px;border:1px solid #e5e7eb;border-radius:20px;background:linear-gradient(180deg,#fff,#fafafa);padding:16px;display:flex;flex-direction:column;gap:8px;justify-content:center;}
    .flowGraphicNode strong{font-size:1rem;color:#111827;}
    .flowGraphicNode span{font-size:.9rem;line-height:1.5;color:#4b5563;}
    .flowGraphicNode.alertNode{border-color:#fecaca;background:linear-gradient(180deg,#fff7f7,#fff);}
    .flowGraphicNode.alertmendNode{border-color:#ddd6fe;background:linear-gradient(180deg,#f5f3ff,#fff);}
    .flowGraphicNode.verifyNode{border-color:#bbf7d0;background:linear-gradient(180deg,#f0fdf4,#fff);}
    .flowGraphicArrow{height:3px;border-radius:999px;background:#a78bfa;position:relative;}
    .flowGraphicArrow:after{content:"";position:absolute;right:-1px;top:50%;width:10px;height:10px;border-top:3px solid #a78bfa;border-right:3px solid #a78bfa;transform:translateY(-50%) rotate(45deg);}
    .flowBranches{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:12px;}
    .flowBranch{border:1px solid #e5e7eb;border-radius:18px;background:#fff;padding:14px;}
    .flowBranch strong{display:block;color:#111827;font-size:.96rem;margin-bottom:6px;}
    .flowBranch span{display:block;color:#4b5563;font-size:.88rem;line-height:1.5;}
    .flowCaption{margin:14px 0 0;color:#5b21b6;font-size:.94rem;line-height:1.6;font-weight:800;}
    .flowSteps{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:12px;}
    .flowStep{background:#fff;border:1px solid #e5e7eb;border-radius:18px;padding:17px;position:relative;min-height:164px;}
    .flowStep:after{content:"";position:absolute;right:-12px;top:50%;width:12px;height:2px;background:#a78bfa;}
    .flowStep:last-child:after{display:none;}
    .flowStep h3{font-size:1rem;color:#111827;margin:0 0 8px;}
    .flowStep p{font-size:.92rem;line-height:1.58;color:#4b5563;margin:0;}
    .candidateGrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;}
    .candidateCard{border:1px solid #e5e7eb;border-radius:20px;background:#fff;padding:20px;}
    .candidateCard h3{font-size:1.08rem;color:#111827;margin:0 0 10px;}
    .candidateCard p{font-size:.98rem;line-height:1.7;color:#4b5563;margin:0;}
    .outcomeGrid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;}
    .outcomeCard{background:#fff;border:1px solid #e5e7eb;border-radius:18px;padding:18px;box-shadow:0 10px 28px rgba(15,23,42,.05);}
    .outcomeCard h3{font-size:1rem;color:#111827;margin:0 0 8px;}
    .outcomeCard p{font-size:.92rem;line-height:1.62;color:#4b5563;margin:0;}
    .ctaBand{border-radius:26px;background:#09090b;color:#fff;padding:30px;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:24px;align-items:center;}
    .ctaBand h2{font-size:clamp(1.5rem,2.4vw,2.35rem);line-height:1.16;letter-spacing:-.03em;margin:0 0 12px;color:#fff;}
    .ctaBand p{font-size:1.05rem;line-height:1.7;color:#d4d4d8;margin:0;}
    .ctaBand a{background:#fff;color:#09090b!important;border-radius:999px;padding:14px 18px;text-decoration:none;font-weight:950;white-space:nowrap;}
    .faqList{display:grid;gap:12px;}
    .faqItem{border:1px solid #e5e7eb;border-radius:16px;background:#fff;padding:16px 18px;}
    .faqItem summary{cursor:pointer;font-weight:900;color:#111827;}
    .faqItem p{font-size:.98rem;line-height:1.72;color:#4b5563;margin:12px 0 0;}
    .sourceList{display:grid;gap:10px;padding-left:0;list-style:none;}
    .sourceList li{margin:0;}
    .authorBioCard{display:grid;grid-template-columns:96px minmax(0,1fr);gap:22px;align-items:start;border:1px solid #e5e7eb;border-radius:24px;background:#fff;padding:24px;box-shadow:0 14px 40px rgba(15,23,42,.06);}
    .authorBioCard img{width:96px;height:96px;object-fit:cover;border-radius:999px;margin:0;box-shadow:none;}
    .authorBioCard h2{font-size:1.45rem;line-height:1.2;color:#111827;margin:0 0 4px;}
    .authorBioRole{color:#7c3aed;font-weight:850;margin:0 0 12px;}
    .authorBioText{font-size:.98rem;line-height:1.72;color:#4b5563;margin:0;}
    .authorBioLink{display:inline-flex;margin-top:12px;color:#7c3aed;font-weight:850;text-decoration:none;}
    @keyframes diskPulse{0%,100%{width:78%;}50%{width:91%;}}
    @media (prefers-reduced-motion:reduce){.barFill{animation:none;width:86%;}}
    @media (max-width:900px){
      .heroGrid,.split,.ctaBand{grid-template-columns:1fr;}
      .credStrip,.sourceGrid,.candidateGrid,.signalGrid,.outcomeGrid,.scopeGrid{grid-template-columns:1fr 1fr;}
      .maturityTrack{grid-template-columns:1fr 1fr;}
      .policyRow{grid-template-columns:1fr;}
      .flowGraphicTop{grid-template-columns:1fr;gap:10px;}
      .flowGraphicArrow{height:24px;width:3px;justify-self:center;}
      .flowGraphicArrow:after{right:auto;left:50%;top:auto;bottom:-2px;transform:translateX(-50%) rotate(135deg);}
      .flowBranches{grid-template-columns:1fr;}
      .flowSteps{grid-template-columns:1fr 1fr;}
      .flowStep:after{display:none;}
      .ladderItem{grid-template-columns:48px 1fr;}
      .ladderBadge{grid-column:2;justify-self:start;}
    }
    @media (max-width:640px){
      .main-container{padding:80px 16px 48px;}
      .heroUseCase{padding:24px;border-radius:22px;}
      .heroTop{margin-bottom:24px;}
      .topAuthorLine{align-items:flex-start;}
      .topAuthorLine img{width:42px;height:42px;}
      .credStrip,.sourceGrid,.candidateGrid,.dangerGrid,.flowSteps,.signalGrid,.outcomeGrid,.maturityTrack,.scopeGrid{grid-template-columns:1fr;}
      .authorBioCard{grid-template-columns:1fr;}
      .authorBioCard img{width:82px;height:82px;}
      .evidenceRow{grid-template-columns:1fr;}
      .article-header h1{font-size:2.05rem;}
    }
  </style>
</head>
<body>
${buildNavHtml(slug, postCalendlyUrl)}
  <div class="main-container">
    <div class="content-wrapper">
      <main class="main-col">
        <header class="article-header article-header--cred">
          <h1>${esc(title)}</h1>
          <div class="topAuthorLine">
            <img src="/logos/dinesh.jpeg" alt="Dinesh Agrawal">
            <div>
              <a class="topAuthorName" href="${DINESH_AUTHOR.linkedin}" target="_blank" rel="noopener noreferrer">Dinesh Agrawal</a>
              <p class="topAuthorDesc">Cloud infrastructure and AI incident automation</p>
            </div>
          </div>
          <p class="article-meta">${esc(date)} · ${esc(category)}</p>
        </header>
        <article class="df-blog">
          <section class="credStrip" aria-label="Article credibility notes">
            <div class="credItem">
              <span class="credLabel">Reviewed against</span>
              <span class="credText">Kubernetes, Docker, systemd, PostgreSQL docs</span>
            </div>
            <div class="credItem">
              <span class="credLabel">Default posture</span>
              <span class="credText">Read-only first, cleanup second, verification last</span>
            </div>
            <div class="credItem">
              <span class="credLabel">Production scope</span>
              <span class="credText">Linux, VMs, Docker, Kubernetes, cloud volumes</span>
            </div>
            <div class="credItem">
              <span class="credLabel">Last reviewed</span>
              <span class="credText">${esc(date)}</span>
            </div>
          </section>

          <section class="heroUseCase" aria-label="Disk full auto-remediation overview">
            <div class="heroTop">
              <div class="topicPill">Production playbook</div>
              <div class="guidePill">Disk full incident response</div>
            </div>
            <div class="heroGrid">
              <div class="heroCopy">
                <h2>Turn disk alerts into verified fixes.</h2>
                <p>A 90% disk alert is the warning before writes fail, pods get evicted, or databases stop accepting WAL. The fix is not “delete something.” The fix is diagnose, clean only known-safe waste, and verify recovery.</p>
                <div class="heroActions">
                  <a class="heroBtn heroBtnPrimary" href="#safe-ladder">See the safe remediation ladder</a>
                  <a class="heroBtn heroBtnSecondary" href="#inspect-first">What to inspect first</a>
                </div>
              </div>
              <div class="incidentPanel" aria-label="Example disk incident">
                <div class="incidentHeader">
                  <div class="incidentTitle">Live incident</div>
                  <div class="incidentStatus"><span class="statusDot"></span> recovery verified</div>
                </div>
                <div class="diskGauge">
                  <div class="gaugeTop"><span class="mountName">prod-vm-3:/var</span><span class="mountValue">91%</span></div>
                  <div class="barTrack"><div class="barFill"></div></div>
                  <div class="gaugeNote">Diagnosis found 18 GB old logs and 11 GB stale images.</div>
                </div>
                <div class="evidenceRows">
                  <div class="evidenceRow"><strong>Detect</strong><span>Disk above threshold and still rising</span><code>91%</code></div>
                  <div class="evidenceRow"><strong>Act</strong><span>Vacuum journal, rotate logs, prune stale images</span><code>safe</code></div>
                  <div class="evidenceRow"><strong>Verify</strong><span>Disk below threshold, service health green</span><code>63%</code></div>
                </div>
              </div>
            </div>
          </section>

          <section class="sectionIntro">
            <h2>When disk usage hits 90%, find the writer before deleting anything.</h2>
            <p>The first response should answer four questions: which mount is full, whether inodes are full, which path is growing, and whether the data is safe waste or business data.</p>
            <p>A safe remediation workflow follows that order every time: read-only diagnosis first, known-safe cleanup second, approval gates for risky paths, and verification before the incident is closed.</p>
            <div class="callout"><strong>Good automation does not ask “what can I delete?” It asks “what evidence proves this cleanup is safe?”</strong></div>
            <div class="signalGrid">
              ${GREAT_SYSTEM_SIGNALS.map(([name, text]) => `
              <div class="signalCard">
                <h3>${esc(name)}</h3>
                <p>${esc(text)}</p>
              </div>`).join('')}
            </div>
            <div class="maturityBox">
              <p class="eyebrow">Automation maturity</p>
              <h2>Move from alerting to verified recovery.</h2>
              <div class="maturityTrack">
                ${MATURITY_LEVELS.map(([level, name, text]) => `
                <div class="maturityStep">
                  <span>${esc(level)}</span>
                  <h3>${esc(name)}</h3>
                  <p>${esc(text)}</p>
                </div>`).join('')}
              </div>
            </div>
          </section>

          <section class="scopeBox">
            <p class="eyebrow">Scope and safety</p>
            <h2>Use this playbook for repeat disk alerts, not unknown data loss events.</h2>
            <p class="bodyText">A credible disk remediation workflow starts with boundaries. This playbook is for production teams that already have disk alerts and want the repeatable response to become safer, faster, and auditable.</p>
            <div class="scopeGrid">
              <div class="scopeCard">
                <strong>Good fit</strong>
                <p>Known hosts, Kubernetes nodes, Docker workers, CI machines, log-heavy services, cache directories, and cloud volumes where the team can define safe cleanup policy.</p>
              </div>
              <div class="scopeCard">
                <strong>Not automatic by default</strong>
                <p>Database WAL, unknown mount points, customer uploads, compliance archives, encrypted volumes, and any path where the owner or retention policy is unclear.</p>
              </div>
            </div>
          </section>

          <section>
            <div class="sectionIntro">
              <p class="eyebrow">Why disks fill</p>
              <h2>The root cause is usually boring. The outage is not.</h2>
              <p>Disk incidents feel simple until the wrong cleanup breaks something more important than the original alert. The first job of an automation system is classification.</p>
            </div>
            <div class="sourceGrid">
              ${FILL_SOURCES.map(([name, why, fix]) => `
              <div class="sourceCard">
                <h3>${esc(name)}</h3>
                <p>${esc(why)}</p>
                <p><strong>${esc(fix)}</strong></p>
              </div>`).join('')}
            </div>
          </section>

          <section class="split" id="inspect-first">
            <div class="splitCopy">
              <p class="eyebrow">What to inspect</p>
              <h2>The first runbook should be read-only.</h2>
              <p>Before cleanup, collect evidence. Which mount is full? Is inode usage the issue? Which directory grew? Is this a host log problem, a Docker layer problem, a Kubernetes node pressure problem, or a database retention problem?</p>
              <p>These checks are safe to run automatically whenever a disk alert fires. They turn a raw percentage into a diagnosis the on-call can trust.</p>
            </div>
            <div class="commandStack">
              ${COMMANDS.map(([name, commands]) => `
              <div class="commandCard">
                <h3>${esc(name)}</h3>
                <pre><code>${esc(commands)}</code></pre>
              </div>`).join('')}
            </div>
          </section>

          <section id="safe-ladder">
            <div class="sectionIntro">
              <p class="eyebrow">Safe remediation ladder</p>
              <h2>Automate the boring steps. Gate the risky ones.</h2>
              <p>This is the pattern that makes disk auto-remediation credible for production teams.</p>
            </div>
            <div class="ladder">
              ${LADDERS.map(([num, name, text, badge]) => `
              <div class="ladderItem">
                <div class="ladderNum">${esc(num)}</div>
                <div>
                  <h3>${esc(name)}</h3>
                  <p>${esc(text)}</p>
                </div>
                <div class="ladderBadge">${esc(badge)}</div>
              </div>`).join('')}
            </div>
          </section>

          <section>
            <div class="sectionIntro">
              <p class="eyebrow">Production policy</p>
              <h2>The best disk automation has rules before it has commands.</h2>
              <p>This is where most simple scripts fail. A serious remediation tool needs clear policy about what can run by itself, what needs approval, and what should remain human-only.</p>
            </div>
            <div class="policyTable">
              <div class="policyRow policyHeader">
                <div class="policyCell">Decision</div>
                <div class="policyCell">Typical actions</div>
                <div class="policyCell">Required guardrails</div>
              </div>
              ${POLICY_MATRIX.map(([decision, actions, guardrails]) => `
              <div class="policyRow">
                <div class="policyCell"><strong>${esc(decision)}</strong></div>
                <div class="policyCell">${esc(actions)}</div>
                <div class="policyCell">${esc(guardrails)}</div>
              </div>`).join('')}
            </div>
          </section>

          <section>
            <div class="sectionIntro">
              <p class="eyebrow">Risk control</p>
              <h2>What should never be automated blindly?</h2>
              <p>The fastest way to lose trust in auto-remediation is to delete the wrong thing. A serious system draws a hard line between known-safe waste and business data.</p>
            </div>
            <div class="dangerGrid">
              ${DO_NOT_AUTOMATE.map(([name, risk, safe]) => `
              <div class="dangerCard">
                <h3>${esc(name)}</h3>
                <p>${esc(risk)}</p>
                <div class="safeLine">${esc(safe)}</div>
              </div>`).join('')}
            </div>
          </section>

          <section class="alertmendFlow">
            <div class="flowHeader">
              <h2>How AlertMend turns a disk alert into a verified fix</h2>
              <div class="logoLockup"><img src="/logos/alertmend-logo.svg" alt="" aria-hidden="true"> AlertMend</div>
            </div>
            <div class="flowGraphic" aria-label="Disk alert to verified recovery flow">
              <div class="flowGraphicTop">
                <div class="flowGraphicNode alertNode">
                  <strong>Disk alert fires</strong>
                  <span>Datadog, Prometheus, Grafana, CloudWatch, or New Relic reports a full mount or Kubernetes DiskPressure.</span>
                </div>
                <div class="flowGraphicArrow" aria-hidden="true"></div>
                <div class="flowGraphicNode alertmendNode">
                  <strong>AlertMend diagnoses and chooses policy</strong>
                  <span>It finds the growth path, owner, workload, recent changes, and whether the action is safe, gated, or human-only.</span>
                </div>
                <div class="flowGraphicArrow" aria-hidden="true"></div>
                <div class="flowGraphicNode verifyNode">
                  <strong>Recovery is verified</strong>
                  <span>Disk drops below threshold, services stay healthy, pod readiness is checked, and the incident note is posted.</span>
                </div>
              </div>
              <div class="flowBranches">
                <div class="flowBranch">
                  <strong>Safe cleanup</strong>
                  <span>Vacuum journal, rotate logs, prune stale images, clear known temp paths.</span>
                </div>
                <div class="flowBranch">
                  <strong>Approval gate</strong>
                  <span>Ask before backups, volume expansion, service restart, or large directory cleanup.</span>
                </div>
                <div class="flowBranch">
                  <strong>Human-only</strong>
                  <span>Escalate database WAL, customer uploads, unknown mounts, or compliance archives.</span>
                </div>
              </div>
              <p class="flowCaption">The important part: every branch ends with verification and an audit trail, not just a command output.</p>
            </div>
            <div class="flowSteps">
              ${ALERTMEND_STEPS.map(([name, text]) => `
              <div class="flowStep">
                <h3>${esc(name)}</h3>
                <p>${esc(text)}</p>
              </div>`).join('')}
            </div>
          </section>

          <section>
            <div class="sectionIntro">
              <p class="eyebrow">What changes for the team</p>
              <h2>This is where automation becomes easy to justify.</h2>
              <p>One clean recovery saves an incident. A well-defined policy removes a recurring on-call task from the team’s calendar. That is the real return: fewer repeated pages, cleaner handoffs, and safer production changes.</p>
            </div>
            <div class="outcomeGrid">
              ${READER_OUTCOMES.map(([name, text]) => `
              <div class="outcomeCard">
                <h3>${esc(name)}</h3>
                <p>${esc(text)}</p>
              </div>`).join('')}
            </div>
          </section>

          <section>
            <div class="sectionIntro">
              <p class="eyebrow">Where to start</p>
              <h2>Your first production runbook should be narrow.</h2>
              <p>Do not automate every cleanup action on day one. Pick one noisy disk alert, define the safe paths, add approval gates, and prove the recovery loop end to end.</p>
            </div>
            <div class="candidateGrid">
              ${AUTOMATION_CANDIDATES.map(([name, text]) => `
              <div class="candidateCard">
                <h3>${esc(name)}</h3>
                <p>${esc(text)}</p>
              </div>`).join('')}
            </div>
          </section>

          <section class="ctaBand">
            <div>
              <h2>Bring us your noisiest disk alert.</h2>
              <p>We will map which steps should be automatic, approval-gated, or human-only before anything touches production.</p>
            </div>
            <a href="${postCalendlyUrl}" target="_blank" rel="noopener noreferrer">Book a remediation review</a>
          </section>

          <section class="sourcesSection">
            <h2>Primary sources checked</h2>
            <ul class="sourceList">
              ${SOURCE_LINKS.map(([label, href]) => `<li><a href="${href}" target="_blank" rel="noopener noreferrer">${esc(label)}</a></li>`).join('')}
            </ul>
          </section>

          <section class="faqSection">
            <h2>FAQ</h2>
            <div class="faqList">
              ${FAQ.map(([q, a]) => `
              <details class="faqItem">
                <summary>${esc(q)}</summary>
                <p>${esc(a)}</p>
              </details>`).join('')}
            </div>
          </section>

          <section class="authorBioCard" aria-label="About the author">
            <img src="/logos/dinesh.jpeg" alt="Dinesh Agrawal">
            <div>
              <p class="eyebrow">About the author</p>
              <h2>Dinesh Agrawal</h2>
              <p class="authorBioRole">Cloud infrastructure and AI incident automation</p>
              <p class="authorBioText">Dinesh is a software engineer and entrepreneur focused on production operations, AI-driven remediation, and practical runbook automation. He has 12+ years of experience across cloud infrastructure and product engineering, with previous work at Polymer Search and Roambee, and as Co-Founder of FutureApp e-schools.</p>
              <a class="authorBioLink" href="${DINESH_AUTHOR.linkedin}" target="_blank" rel="noopener noreferrer">View LinkedIn profile</a>
            </div>
          </section>
        </article>
      </main>
      ${buildSidebarHtml(relatedPosts, title)}
    </div>
  </div>
  <script>
    (() => {
      const signupForm = document.getElementById('blog-signup-form');
      const signupStatus = document.getElementById('blog-signup-status');
      if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
          e.preventDefault();
          const input = signupForm.querySelector('input[type="email"]');
          const button = signupForm.querySelector('button[type="submit"]');
          const email = input && input.value ? input.value.trim() : '';
          if (!email || !button || button.disabled) return;
          const buttonLabel = button.textContent;
          button.disabled = true;
          button.textContent = 'Signing up...';
          if (signupStatus) {
            signupStatus.hidden = true;
            signupStatus.textContent = '';
            signupStatus.className = 'signup-status';
          }
          try {
            const response = await fetch('https://api.alertmend.io/contact', {
              method: 'POST',
              headers: { Accept: 'application/json, text/plain, */*', 'Content-Type': 'application/json' },
              body: JSON.stringify({
                full_name: 'Blog subscriber',
                company: '',
                email,
                message: 'Newsletter signup from the AlertMend blog post "${esc(title)}". Please add this email to the blog and product updates list.',
                source: 'blog_signup',
              }),
            });
            if (response.ok) {
              if (input) input.value = '';
              if (signupStatus) {
                signupStatus.hidden = false;
                signupStatus.textContent = "Thanks! You're on the list.";
                signupStatus.className = 'signup-status success';
              }
            } else if (signupStatus) {
              signupStatus.hidden = false;
              signupStatus.textContent = 'Something went wrong. Please try again.';
              signupStatus.className = 'signup-status error';
            }
          } catch {
            if (signupStatus) {
              signupStatus.hidden = false;
              signupStatus.textContent = 'Network error. Please check your connection and try again.';
              signupStatus.className = 'signup-status error';
            }
          } finally {
            button.disabled = false;
            button.textContent = buttonLabel || 'Sign up';
          }
        });
      }
    })();
  </script>
</body>
</html>`

  writeStaticBlogOutputs(slug, html)
}
