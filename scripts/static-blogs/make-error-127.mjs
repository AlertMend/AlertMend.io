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
  const title = meta.title || 'Make Error 127: Command Not Found Fix'
  const h1Title = 'Make Error 127: Meaning, Diagnosis & Fixes'
  const excerpt = meta.excerpt || ''
  const date = meta.date || '2026-01-10'
  const dateModified = meta.dateModified || date
  const category = meta.category || 'Troubleshooting'
  const author = meta.author || 'AlertMend Team'
  const keywords =
    meta.keywords ||
    'make error 127, makefile error 127, error 127 makefile, gnu make error 127 command not found manual, exit code 127, exit status 127, make go no such file or directory, uv no such file or directory, npm error code 127'

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
      'Error 127 in the make output is the recipe shell status: command not found. GNU make itself normally exits with status 2 after encountering an error. The printed recipe status and the final make-process status are related but not identical.',
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
    [
      'Why does uv sync fail with make Error 127?',
      'The recipe calls uv, but uv is not installed or is outside PATH in the environment running make. Run command -v uv and make -n for the target, then install uv in the same CI image, container, or user environment.',
    ],
    [
      'Is Windows error 127 the same as shell exit status 127?',
      'Not necessarily. Native Windows error codes, installer errors, and game errors can reuse the number 127 with unrelated meanings. This guide covers GNU make and POSIX-style shells where 127 means command not found.',
    ],
  ]

  const MODES = [
    ['local', 'Local development', 'Laptop or workstation'],
    ['docker', 'Docker builds', 'Container images'],
    ['ci', 'CI / GitHub Actions', 'Pipeline agents'],
    ['wsl', 'WSL / Windows', 'Cross-platform shells'],
  ]

  const DIAGNOSIS_SCENARIOS = [
    ['uv', 'uv: not found', 'uv', 'The Makefile calls uv, but that executable is absent from the environment or outside PATH.', 'Install uv in the same CI image or shell that runs make, then verify with command -v uv.'],
    ['go', 'go: No such file', 'go', 'Go exists on another machine or shell profile, but not in the current make, container, or CI environment.', 'Install Go in that environment and export its bin directory before make starts.'],
    ['compiler', 'gcc / g++ not found', 'gcc', 'The compiler toolchain is missing, common in minimal VMs and runtime-only container images.', 'Install the platform build toolchain, then verify gcc --version and g++ --version.'],
    ['node', 'npm / vite not found', 'npm', 'Node dependencies or binaries are missing. Local npm scripts may resolve node_modules/.bin while direct Makefile recipes do not.', 'Install Node and dependencies; invoke local tools with npm exec, npx, or an npm script.'],
    ['path', './script: not found', './script', 'The path is wrong, the file is absent, line endings broke the shebang, or the shebang interpreter does not exist.', 'Check ls -l, file, head -1, and the interpreter path before changing permissions.'],
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
    dateModified,
    author: { '@type': 'Organization', name: author },
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
${buildArticleHeader(h1Title, author, date, category)}

    <div class="dl-blog">
      <section class="heroBand heroBandCompact">
        <p class="heroGuideLabel">GNU make + shell troubleshooting · primary sources checked ${esc(dateModified)}</p>
        <div class="instantFix">
          <div class="instantFixTop"><span>THE 10-SECOND ANSWER</span><strong>Make worked. A recipe command did not.</strong></div>
          <p><strong>Make Error 127</strong> means the shell could not find a command used by a Makefile recipe. The missing name is usually on the line immediately above <code>Error 127</code>.</p>
          <div class="instantFixCommands">
            <code>make -n &lt;target&gt;</code><span>see the recipe</span>
            <code>command -v &lt;name&gt;</code><span>find the binary</span>
            <code>printf '%s\n' "$PATH"</code><span>inspect make's PATH</span>
          </div>
          <div class="manualProof">
            <a href="https://www.gnu.org/software/bash/manual/html_node/Exit-Status.html" target="_blank" rel="noopener noreferrer">Bash manual: command not found → 127 ↗</a>
            <a href="https://www.gnu.org/software/make/manual/html_node/Errors.html" target="_blank" rel="noopener noreferrer">GNU make manual: Error NN is the recipe program’s status ↗</a>
          </div>
        </div>
        <aside class="immediateDiagnosis" aria-labelledby="immediate-diagnosis-title">
          <div class="diagnosisHeading">
            <span class="diagnosisEyebrow">Immediate diagnosis</span>
            <strong id="immediate-diagnosis-title">Find the missing recipe command</strong>
          </div>
          <ol class="diagnosisSteps">
            <li><span>1</span><p>Read the command immediately above <code>Error 127</code>.</p></li>
            <li><span>2</span><p>Run <code>command -v &lt;command&gt;</code> in the same environment that runs <code>make</code>.</p></li>
            <li><span>3</span><p>If it returns nothing, install that command or correct the environment’s <code>PATH</code>.</p></li>
          </ol>
          <p class="diagnosisCaution"><strong>Avoid false fixes:</strong> reinstalling <code>make</code> will not restore a missing recipe command, and <code>make -i</code> only suppresses the failure.</p>
        </aside>
      </section>

      <nav class="articleToc" aria-label="On this page">
        <strong>Fix it by intent</strong>
        <a href="#meaning">Meaning and GNU manual answer</a>
        <a href="#diagnose">Find the missing command</a>
        <a href="#examples">uv, Go, gcc, npm and script fixes</a>
        <a href="#environments">Local, Docker, CI and WSL</a>
        <a href="#prevent">Prevent Error 127</a>
        <a href="#sources">Primary sources</a>
      </nav>

      <h2 class="sectionHead" id="meaning">What does Make Error 127 mean?</h2>
      <p class="bodyText">GNU make runs recipe lines through a shell, normally <code>/bin/sh</code> unless the Makefile sets <code>SHELL</code>. When that shell cannot locate a command, it returns status <strong>127</strong>. GNU make then prints the recipe failure as <code>Error 127</code> and stops the affected target.</p>
      <pre class="codeBlock"><code>/bin/sh: gcc: command not found
make: *** [Makefile:42: obj/main.o] Error 127</code></pre>
      <p class="bodyText">When the binary name appears in the make line itself:</p>
      <pre class="codeBlock"><code>make: go: No such file or directory
make: *** [Makefile:18: build] Error 127</code></pre>

      <aside class="expertNote">
        <span>THE DETAIL MOST GUIDES MISS</span>
        <strong>The printed 127 and make’s own exit status are different layers.</strong>
        <p><code>Error 127</code> is the recipe shell’s status. GNU make itself normally returns <code>2</code> after it encounters an error. In CI, the log may show the missing command as 127 while the make process is reported as exit code 2.</p>
        <div><a href="https://www.gnu.org/software/make/manual/html_node/Errors.html" target="_blank" rel="noopener noreferrer">GNU make recipe errors ↗</a><a href="https://www.gnu.org/software/make/manual/make.html" target="_blank" rel="noopener noreferrer">GNU make process statuses ↗</a></div>
      </aside>

      <h2 class="sectionHead">Exit status 127 vs other make errors</h2>
      <div class="diyWrap">
        <table class="compareTable">
          <thead><tr><th>Signal</th><th>Typical meaning</th><th>What to do</th></tr></thead>
          <tbody>
            ${EXIT_CODES.map(([s, m, a]) => `<tr><td>${esc(s)}</td><td>${esc(m)}</td><td class="diyHighlight">${esc(a)}</td></tr>`).join('\n            ')}
          </tbody>
        </table>
      </div>

      <h2 class="sectionHead" id="diagnose">How to find which command triggered Makefile Error 127</h2>
      <div class="amFlow">
        ${DEBUG_STEPS.map(([t, b], i) => `<div class="amStep"><div class="amStepHead"><span class="amStepNum">${i + 1}</span></div><h3 class="amStepTitle">${esc(t)}</h3><p class="amStepBody">${esc(b)}</p></div>`).join('\n        ')}
      </div>

      <section class="commandClinic" id="examples">
        <div class="commandClinicHead">
          <div><span>INTERACTIVE COMMAND CLINIC</span><h2>Match the line above Error 127</h2></div>
          <p>The final make line is only the messenger. Select the command the shell could not find.</p>
        </div>
        <div class="commandTabs" role="tablist" aria-label="Missing command examples">
          ${DIAGNOSIS_SCENARIOS.map(([id, label], i) => `<button type="button" role="tab" data-command-id="${id}" class="commandTab${i === 0 ? ' commandTabActive' : ''}" aria-selected="${i === 0 ? 'true' : 'false'}">${esc(label)}</button>`).join('\n          ')}
        </div>
        <div class="commandDiagnosis" role="tabpanel">
          <div class="terminalSnippet"><span>$ make install</span><code id="command-error-line">/bin/sh: uv: command not found</code><code>make: *** [Makefile:43: install] Error 127</code></div>
          <div class="commandAnswer">
            <span>ROOT CAUSE</span>
            <strong id="command-diagnosis-title">Missing command: uv</strong>
            <p id="command-diagnosis-body">${esc(DIAGNOSIS_SCENARIOS[0][3])}</p>
            <pre><code id="command-check">command -v uv
printf '%s\n' "$PATH"</code></pre>
            <p class="commandFix"><strong>Fix:</strong> <span id="command-fix">${esc(DIAGNOSIS_SCENARIOS[0][4])}</span></p>
          </div>
        </div>
      </section>

      <aside class="expertNote expertNoteCompact">
        <span>ALERTMEND FIELD NOTE</span>
        <strong>Run the check inside the failing environment.</strong>
        <p><code>command -v go</code> on your laptop proves nothing about a Docker build stage, CI runner, Kubernetes Job, cron environment, or another user’s shell. Environment mismatch is the recurring cause behind “it works in my terminal.”</p>
      </aside>

      <h2 class="sectionHead" id="environments">Fixes by environment</h2>
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

      <h2 class="sectionHead" id="prevent">Makefile patterns that prevent Error 127</h2>
      <pre class="codeBlock"><code>GO := $(shell command -v go 2>/dev/null)
ifndef GO
$(error go not found in PATH, install Go or export PATH)
endif</code></pre>
      <p class="bodyText">Document dependencies at the top of the Makefile: <code># Requires: gcc g++ make python3</code>.</p>

      <h2 class="sectionHead">How to diagnose and recover from Error 127 automatically</h2>
      <p class="bodyText">A local compiler error is a developer task. Error 127 becomes an operations problem when it breaks CI runners, deployment hooks, cron jobs, containers, Kubernetes Jobs, or production automation. AlertMend correlates the failed process with its runtime environment and recent changes so responders see the missing command, PATH, image, and deployment context together.</p>
      <div class="alertmendMethod">
        <div><span>1</span><strong>Detect</strong><p>Capture exit 127 and the command immediately above it.</p></div>
        <div><span>2</span><strong>Compare</strong><p>Contrast PATH, image, package state, and last-known-good run.</p></div>
        <div><span>3</span><strong>Explain</strong><p>Name the missing binary or interpreter and the environment mismatch.</p></div>
        <div><span>4</span><strong>Recover safely</strong><p>Run an approved fix or route exact evidence to the owner, then verify the job.</p></div>
      </div>
      <p class="bodyText productDisclosure"><strong>Deployment control:</strong> AlertMend is available as a managed service or self-hosted for enterprises that need operational data and automation to remain inside their environment.</p>

      <h2 class="sectionHead" id="sources">Primary sources and technical notes</h2>
      <ul class="sourceList">
        <li><a href="https://www.gnu.org/software/bash/manual/html_node/Exit-Status.html" target="_blank" rel="noopener noreferrer">Bash Reference Manual: Exit Status</a>command not found returns 127; found but not executable returns 126.</li>
        <li><a href="https://www.gnu.org/software/bash/manual/html_node/Command-Search-and-Execution.html" target="_blank" rel="noopener noreferrer">Bash: Command Search and Execution</a>how functions, builtins, and PATH are searched.</li>
        <li><a href="https://www.gnu.org/software/make/manual/html_node/Errors.html" target="_blank" rel="noopener noreferrer">GNU make: Errors in Recipes</a>make reports the status returned by a program invoked in a recipe.</li>
        <li><a href="https://www.gnu.org/software/make/manual/html_node/Choosing-the-Shell.html" target="_blank" rel="noopener noreferrer">GNU make: Choosing the Shell</a>recipes use <code>/bin/sh</code> by default when the Makefile does not set <code>SHELL</code>.</li>
        <li><a href="https://docs.docker.com/engine/containers/run/#exit-status" target="_blank" rel="noopener noreferrer">Docker: container exit status</a>Docker also reserves 127 for a container command that cannot be found.</li>
      </ul>
      <div class="reviewPolicy"><strong>Scope:</strong> This guide covers GNU make and POSIX-style shell status 127. Native Windows, game, installer, telephone, and unrelated application “error 127” codes can mean something else. AlertMend publishes this guide and may benefit if readers evaluate its product; every command-level explanation above works without AlertMend.</div>

      <h2 class="sectionHead" id="faq">FAQ</h2>
      <div class="faqList">
        ${FAQ.map(([q, a], i) => `<div class="faqItem"><button type="button" class="faqQuestion" data-faq-toggle aria-expanded="${i === 0 ? 'true' : 'false'}">${esc(q)}<svg class="faqChevron${i === 0 ? ' faqChevronOpen' : ''}" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 9l6 6 6-6"/></svg></button><div class="faqAnswer${i === 0 ? '' : ' hidden'}">${esc(a)}</div></div>`).join('\n        ')}
      </div>

      <div class="ctaBand">
        <div class="ctaBandTitle">Bring one failing automation run.</div>
        <p class="ctaBandSub">See AlertMend connect exit 127 to the missing command, PATH, runtime image, and recent change, then route or execute the approved recovery and verify the next run.</p>
        <div class="ctaBtnRow">
          <a href="${postCalendlyUrl}" class="ctaBtn" target="_blank" rel="noopener noreferrer">Walk through the failure →</a>
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
