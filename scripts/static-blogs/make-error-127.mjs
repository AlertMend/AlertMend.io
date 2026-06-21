/**
 * Code-generated rich blog: make error 127 troubleshooting post.
 */
import {
  SITE_URL,
  esc,
  parseFrontmatter,
  getRelatedPosts,
  calendlyUrl,
  CHROME_INLINE_CSS,
  buildNavHtml,
  buildSidebarHtml,
  buildArticleHeader,
  writeStaticBlogOutputs,
} from '../static-blog-shared.mjs'

export async function build(slug) {
  const assetsBase = `/assets/${slug}`
  const canonical = `${SITE_URL}/blog/${slug}`

  const meta = parseFrontmatter(slug)
  const title = meta.title || 'make error 127 Complete Guide'
  const excerpt = meta.excerpt || ''
  const date = meta.date || '2026-01-10'
  const category = meta.category || 'Troubleshooting'
  const author = meta.author || 'AlertMend Team'
  const keywords =
    meta.keywords ||
    'makefile error 127, make error 127, error 127, exit code 127, exit status 127, gnu make error 127 command not found, make go no such file or directory'

  const relatedPosts = getRelatedPosts(slug, category)
  const postCalendlyUrl = calendlyUrl(slug)

  const EXIT_CODES = [
    ['Error 127', 'Command not found (missing binary or wrong PATH)', 'Install the tool or export PATH before re-running make'],
    ['Error 126', 'Command found but not executable', 'chmod +x on scripts; check file permissions'],
    ['Error 2', 'Recipe failed for another reason', 'Read compiler or script output above the make line'],
    ['Error 1', 'Generic non-zero exit from a command that ran', 'Debug the failing command, not make itself'],
  ]

  const DEBUG_STEPS = [
    ['Read the full make output', 'Find the line above Error 127. It names the missing binary (go, gcc, g++) and often the Makefile line number.'],
    ['Open the makefile at that line', 'Run make -n target for a dry run, or sed -n to print the recipe block.'],
    ['Confirm the binary exists', 'Run which go gcc g++ python3 and echo $PATH in the same shell environment make uses.'],
    ['Re-run with verbose make', 'make V=1 or make --debug=v helps when nested scripts hide the failing command.'],
  ]

  const COMMON_CAUSES = [
    [
      'Compiler not installed',
      'g++ or gcc missing on a fresh VM or minimal CI image.',
      'sudo apt install build-essential or dnf groupinstall "Development Tools".',
    ],
    [
      'make: go: No such file or directory',
      'Go project makefile calls go build but Go is not on PATH in CI or Docker.',
      'Install Go, use actions/setup-go, or a golang base image before RUN make.',
    ],
    [
      'Wrong PATH in make',
      'Interactive shell has /usr/local/go/bin; non-interactive sh used by make does not.',
      'Export PATH in the Makefile, CI job, or run PATH="/usr/local/go/bin:$PATH" make.',
    ],
    [
      'Typo in recipe or CC variable',
      'Unset CC or a typo yields sh: ccX: command not found.',
      'Run make -p or add $(info CC=$(CC)) temporarily to verify variables.',
    ],
    [
      'Alpine / musl mismatch',
      'Dockerfile uses alpine but the makefile assumes bash or GNU coreutils.',
      'apk add make gcc musl-dev bash before make in the image.',
    ],
    [
      'WSL vs Windows host',
      'Tools installed on Windows but make runs inside WSL without Linux binaries.',
      'Install gcc, make, and go inside WSL; export PATH in ~/.profile.',
    ],
  ]

  const FAQ = [
    [
      'What is makefile error 127?',
      'GNU make ran a recipe and the shell returned exit status 127 because a command in that recipe was not found. Fix the missing binary or PATH, not make itself.',
    ],
    [
      'What is the difference between make error 127 and exit code 127?',
      'They are the same underlying status. Exit code 127 is what bash returns for "command not found." Make error 127 is make reporting that the recipe shell exited with 127.',
    ],
    [
      'Why does GNU make say "command not found" but the tool works in my terminal?',
      'Your interactive shell loads .bashrc or .zprofile and adjusts PATH. Non-interactive shells used by make, CI, and cron may not. Export PATH in the Makefile, CI config, or job wrapper.',
    ],
    [
      'How do I fix make: go: No such file or directory?',
      'Install Go and ensure go is on PATH for the same user and environment that runs make. In CI, use an official setup action or a golang container image.',
    ],
    [
      'What does gnu make error 127 command not found mean?',
      'The shell could not execute a program named in the makefile recipe. Read the line above Error 127, install that tool, then run make again.',
    ],
  ]

  const MODES = [
    ['local', 'Local development', 'Laptop or workstation'],
    ['docker', 'Docker builds', 'Container images'],
    ['ci', 'CI / GitHub Actions', 'Pipeline agents'],
    ['wsl', 'WSL / Windows', 'Cross-platform shells'],
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
    name: 'Find which command triggered makefile error 127',
    description: excerpt,
    step: DEBUG_STEPS.map(([name, text], i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name,
      text,
    })),
  })

  const blogLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: excerpt,
    image: `https://www.alertmend.io${assetsBase}/make-error-127-hero.svg`,
    datePublished: date,
    dateModified: date,
    author: { '@type': 'Person', name: author },
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
  <meta property="og:image" content="https://www.alertmend.io${assetsBase}/make-error-127-hero.svg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(excerpt)}">
  <meta name="twitter:image" content="https://www.alertmend.io${assetsBase}/make-error-127-hero.svg">
  <script type="application/ld+json">${blogLd}</script>
  <script type="application/ld+json">${faqLd}</script>
  <script type="application/ld+json">${howToLd}</script>
  <link rel="stylesheet" href="${assetsBase}/styles.css">
  <style>${CHROME_INLINE_CSS}</style>
</head>
<body>
${buildNavHtml(slug, postCalendlyUrl)}

  <div class="main-container">
    <div class="content-wrapper">
      <div class="main-col">
${buildArticleHeader(title, author, date, category)}

    <div class="dl-blog">
      <section class="heroBand heroBandCompact">
        <p class="heroGuideLabel">Troubleshooting · GNU make exit status 127</p>
        <p class="seoTldr"><strong>TL;DR:</strong> Error 127 means a recipe command was not found on PATH. Read the line above <code>Error 127</code>, install the missing tool (go, gcc, g++, python3, etc.), or fix PATH, then run make again.</p>
      </section>

      <h2 class="sectionHead">What does error 127 mean in a makefile?</h2>
      <p class="bodyText">GNU make reports <strong>exit status 127</strong> when the shell cannot find a program named in the makefile recipe. This is not a make bug — make started the recipe; the shell failed.</p>
      <pre class="codeBlock"><code>/bin/sh: gcc: command not found
make: *** [Makefile:42: obj/main.o] Error 127</code></pre>
      <p class="bodyText">When the binary name appears in the make line itself:</p>
      <pre class="codeBlock"><code>make: go: No such file or directory
make: *** [Makefile:18: build] Error 127</code></pre>

      <h2 class="sectionHead">Exit status 127 vs other make errors</h2>
      <div class="diyWrap">
        <table class="compareTable">
          <thead><tr><th>Signal</th><th>Typical meaning</th><th>What to do</th></tr></thead>
          <tbody>
            ${EXIT_CODES.map(([s, m, a]) => `<tr><td>${esc(s)}</td><td>${esc(m)}</td><td class="diyHighlight">${esc(a)}</td></tr>`).join('\n            ')}
          </tbody>
        </table>
      </div>

      <h2 class="sectionHead">How to find which command triggered makefile error 127</h2>
      <div class="amFlow">
        ${DEBUG_STEPS.map(([t, b], i) => `<div class="amStep"><div class="amStepHead"><span class="amStepNum">${i + 1}</span></div><h3 class="amStepTitle">${esc(t)}</h3><p class="amStepBody">${esc(b)}</p></div>`).join('\n        ')}
      </div>

      <h2 class="sectionHead">Fixes by environment</h2>
      <p class="bodyText">The same root cause shows up differently on a laptop, in Docker, in CI, or under WSL.</p>
      <div class="modeGrid" role="tablist" aria-label="Build environment">
        ${MODES.map(([id, t, sub], i) => `<button type="button" role="tab" data-mode-id="${id}" class="modeCard${i === 0 ? ' modeCardActive' : ''}" aria-selected="${i === 0 ? 'true' : 'false'}"><span class="modeCardTitle">${esc(t)}</span><span class="modeCardSub">${esc(sub)}</span></button>`).join('\n        ')}
      </div>
      <div class="modePlaybook" role="tabpanel">
        <div class="modePlaybookHead">
          <h3 class="modePlaybookTitle" id="mode-playbook-title">Fix path: Local development</h3>
        </div>
        <p class="modePlaybookSummary" id="mode-playbook-summary"></p>
        <ul class="checkList" id="mode-playbook-steps"></ul>
        <div class="stepTip"><span id="mode-playbook-tip"></span></div>
      </div>

      <h2 class="sectionHead">GNU make error 127 command not found: common causes</h2>
      <div class="searchIssueGrid">
        ${COMMON_CAUSES.map(([term, desc, fix]) => `<div class="searchIssueCard"><h3 class="searchIssueTerm">${esc(term)}</h3><p class="searchIssueDesc">${esc(desc)}</p><p class="searchIssueAlert"><strong>Fix:</strong> ${esc(fix)}</p></div>`).join('\n        ')}
      </div>

      <h2 class="sectionHead">Makefile patterns that prevent error 127</h2>
      <pre class="codeBlock"><code>GO := $(shell command -v go 2>/dev/null)
ifndef GO
$(error go not found in PATH — install Go or export PATH)
endif</code></pre>
      <p class="bodyText">Document dependencies at the top of the Makefile: <code># Requires: gcc g++ make python3</code>.</p>

      <h2 class="sectionHead">FAQ</h2>
      <div class="faqList">
        ${FAQ.map(([q, a], i) => `<div class="faqItem"><button type="button" class="faqQuestion" data-faq-toggle aria-expanded="${i === 0 ? 'true' : 'false'}">${esc(q)}<svg class="faqChevron${i === 0 ? ' faqChevronOpen' : ''}" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 9l6 6 6-6"/></svg></button><div class="faqAnswer${i === 0 ? '' : ' hidden'}">${esc(a)}</div></div>`).join('\n        ')}
      </div>

      <div class="ctaBand">
        <div class="ctaBandTitle">Still stuck on makefile error 127?</div>
        <p class="ctaBandSub">Talk to an AlertMend engineer about your build setup, CI image, or PATH issues.</p>
        <div class="ctaBtnRow">
          <a href="${postCalendlyUrl}" class="ctaBtn" target="_blank" rel="noopener noreferrer">Talk to an expert →</a>
        </div>
      </div>
    </div>

    <div class="promo">
      <p><strong>Related:</strong> <a href="/blog/503-no-healthy-upstream">503 No Healthy Upstream</a> · <a href="/blog/debugging-kubernetes-oomkilled-exit-code-137-causes-and-solutions">Debugging Kubernetes OOMKilled Exit Code 137</a></p>
    </div>
      </div>

${buildSidebarHtml(relatedPosts)}
    </div>
  </div>

  <script src="${assetsBase}/script.js" defer></script>
</body>
</html>`

  writeStaticBlogOutputs(slug, html)
}
