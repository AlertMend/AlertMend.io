/**
 * Search-led, source-checked guide to exit code 5.
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
  const canonical = `${SITE_URL}/blog/${slug}`
  const meta = parseFrontmatter(slug)
  const title = meta.title || 'Exit Code 5: Meaning and Fixes by Program'
  const h1Title = 'Exit Code 5: What It Means and How to Fix It'
  const excerpt = meta.excerpt || ''
  const date = meta.date || '2026-01-10'
  const dateModified = meta.dateModified || date
  const category = meta.category || 'Troubleshooting'
  const author = meta.author || 'AlertMend Team'
  const keywords = meta.keywords || 'exit code 5, pytest exit code 5, curl exit code 5, Windows error 5'
  const relatedPosts = getRelatedPosts(slug, category)
  const postCalendlyUrl = calendlyUrl(slug)

  const FAQ = [
    ['What does exit code 5 mean?', 'It depends on the program that returned it. pytest uses 5 for no tests collected, curl uses 5 for an unresolved proxy, and Windows system error 5 means access denied. Identify the executable before choosing a fix.'],
    ['How do I fix pytest exit code 5?', 'First confirm whether zero collected tests is expected. If not, inspect pytest collection, file names, test paths, markers, and configuration. If an empty suite is intentionally successful, handle that policy explicitly instead of hiding genuine collection mistakes.'],
    ['What does exit code 5 mean on Linux?', 'Linux does not assign one universal meaning to process exit status 5. The program or script defines it. Read that program’s stderr and official exit-code documentation.'],
    ['What is curl exit code 5?', 'curl exit code 5 means it could not resolve the proxy. Check proxy environment variables, the proxy hostname, DNS, and whether the job should bypass that proxy.'],
    ['Is Windows error 5 always access denied?', 'Windows system error 5, ERROR_ACCESS_DENIED, means access is denied. A Windows application that merely exits with process status 5 may define that status differently, so preserve the program name and message.'],
    ['Why did GitHub Actions say process completed with exit code 5?', 'GitHub Actions is reporting the child process status, not defining it. Find the command immediately above the message, then use that command’s documentation. pytest is a common source of status 5 in CI.'],
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
    name: 'Diagnose exit code 5',
    description: excerpt,
    step: [
      ['Identify the executable', 'Find the command immediately before the exit-code message.'],
      ['Preserve stderr', 'Capture the program output instead of relying on the number alone.'],
      ['Use program-specific documentation', 'Interpret status 5 using the executable’s official exit-code reference.'],
      ['Fix and verify', 'Correct the identified cause and rerun the same command in the same environment.'],
    ].map(([name, text], i) => ({ '@type': 'HowToStep', position: i + 1, name, text })),
  })

  const blogLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: excerpt,
    image: `${SITE_URL}/assets/${slug}/exit-code-5-hero.svg`,
    datePublished: date,
    dateModified,
    author: { '@type': 'Organization', name: author },
    publisher: {
      '@type': 'Organization',
      name: 'AlertMend AI',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logos/alertmend-logo.svg` },
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
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
  <link rel="canonical" href="${canonical}">
  <link rel="icon" type="image/svg+xml" href="/logos/alertmend-logo.svg">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${canonical}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(excerpt)}">
  <meta property="og:image" content="${SITE_URL}/assets/${slug}/exit-code-5-hero.svg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(excerpt)}">
  <meta name="twitter:image" content="${SITE_URL}/assets/${slug}/exit-code-5-hero.svg">
  <script type="application/ld+json">${blogLd}</script>
  <script type="application/ld+json">${faqLd}</script>
  <script type="application/ld+json">${howToLd}</script>
  <link rel="stylesheet" href="/assets/make-error-127/styles.css">
  <link rel="stylesheet" href="/assets/exit-code-5/styles.css">
  <style>${CHROME_INLINE_CSS}</style>
</head>
<body>
${buildNavHtml(slug, postCalendlyUrl)}
  <div class="main-container">
    <div class="content-wrapper">
      <div class="main-col">
${buildArticleHeader(h1Title, author, date, category)}
      <div style="display:flex;flex-wrap:wrap;gap:8px 16px;align-items:center;margin:-0.75rem 0 1.75rem;font-size:0.85rem;color:#52525b;">
        <span style="display:inline-flex;align-items:center;gap:6px;font-weight:600;color:#047857;"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>Verified against official pytest, curl &amp; Microsoft docs</span>
        <span style="color:#d4d4d8;">•</span>
        <span>Last reviewed ${esc(dateModified)}</span>
        <span style="color:#d4d4d8;">•</span>
        <span>4 primary sources cited</span>
      </div>
    <div class="dl-blog">
      <section class="heroBand heroBandCompact">
        <p class="heroGuideLabel">Program-specific troubleshooting · primary sources checked ${esc(dateModified)}</p>
        <div class="instantFix">
          <div class="instantFixTop"><span>THE 10-SECOND ANSWER</span><strong>Exit code 5 does not have one universal meaning.</strong></div>
          <p>Find the program that returned it. For <strong>pytest</strong>5 means no tests were collected. For <strong>curl</strong>it means the proxy hostname could not be resolved. Windows <strong>system error 5</strong> means access denied. On Linux, another program may define 5 differently.</p>
          <div class="instantFixCommands">
            <code>command; printf 'exit=%s\\n' "$?"</code><span>preserve the producer</span>
            <code>command 2&gt;&amp;1 | tee failure.log</code><span>capture the message</span>
            <code>type -a command</code><span>confirm the executable</span>
          </div>
          <div class="manualProof">
            <a href="https://docs.pytest.org/en/stable/reference/exit-codes.html" target="_blank" rel="noopener noreferrer">pytest: exit code 5 → no tests collected ↗</a>
            <a href="https://curl.se/docs/manpage.html#EXIT-CODES" target="_blank" rel="noopener noreferrer">curl: exit code 5 → proxy unresolved ↗</a>
            <a href="https://learn.microsoft.com/en-us/windows/win32/debug/system-error-codes--0-499-" target="_blank" rel="noopener noreferrer">Windows error 5 → access denied ↗</a>
          </div>
        </div>
        <aside class="immediateDiagnosis" aria-labelledby="exit-five-diagnosis">
          <div class="diagnosisHeading">
            <span class="diagnosisEyebrow">Immediate diagnosis</span>
            <strong id="exit-five-diagnosis">Identify who returned the 5</strong>
          </div>
          <ol class="diagnosisSteps">
            <li><span>1</span><p>Read the command immediately before the exit-code message.</p></li>
            <li><span>2</span><p>Keep its stderr, the text usually contains more information than the number.</p></li>
            <li><span>3</span><p>Apply that program’s documented meaning, then rerun it in the same environment.</p></li>
          </ol>
          <p class="diagnosisCaution"><strong>Do not start with permissions.</strong> That is correct for Windows system error 5, but wrong for pytest and curl.</p>
        </aside>
      </section>

      <nav class="articleToc" aria-label="On this page">
        <strong>Fix it by producer</strong>
        <a href="#meaning">Meanings by program</a>
        <a href="#pytest">pytest: no tests collected</a>
        <a href="#curl">curl: could not resolve proxy</a>
        <a href="#windows">Windows: access denied</a>
        <a href="#linux">Linux and CI</a>
        <a href="#sources">Primary sources</a>
      </nav>

      <h2 class="sectionHead" id="meaning">Exit code 5 meanings by program</h2>
      <p class="bodyText">Exit code 5 has no universal definition. Identify the program that returned it, then use that program’s meaning and diagnostic path.</p>
      <div class="exitTableWrap">
        <table class="exitMeaningTable">
          <thead><tr><th>Program</th><th>Meaning</th><th>First check</th><th>Recommended fix</th></tr></thead>
          <tbody>
            <tr>
              <td data-label="Program"><strong>pytest</strong></td>
              <td data-label="Meaning">No tests were collected.</td>
              <td data-label="First check"><code>pytest --collect-only -q</code></td>
              <td data-label="Recommended fix">Correct discovery paths, naming patterns, markers, or configuration.</td>
            </tr>
            <tr>
              <td data-label="Program"><strong>curl</strong></td>
              <td data-label="Meaning">The proxy hostname could not be resolved.</td>
              <td data-label="First check"><code>env | grep -i _proxy</code></td>
              <td data-label="Recommended fix">Correct the proxy setting or restore DNS visibility in the failing environment.</td>
            </tr>
            <tr>
              <td data-label="Program"><strong>Windows system error 5</strong></td>
              <td data-label="Meaning">Access is denied (<code>ERROR_ACCESS_DENIED</code>).</td>
              <td data-label="First check">Verify the effective account and denied resource.</td>
              <td data-label="Recommended fix">Grant only the required permission to the correct identity.</td>
            </tr>
            <tr>
              <td data-label="Program"><strong>systemd service</strong></td>
              <td data-label="Meaning">The <code>ExecStart</code> process returned status 5.</td>
              <td data-label="First check"><code>journalctl -u &lt;service&gt;</code></td>
              <td data-label="Recommended fix">Use the service’s own logs and documentation to diagnose its status.</td>
            </tr>
            <tr>
              <td data-label="Program"><strong>Linux or CI</strong></td>
              <td data-label="Meaning">Application-defined; the wrapper does not define 5.</td>
              <td data-label="First check">Read the command and stderr immediately above the message.</td>
              <td data-label="Recommended fix">Apply the producing program’s documented meaning and rerun in the same environment.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 class="sectionHead" id="pytest">pytest exit code 5: no tests were collected</h2>
      <p class="bodyText">pytest’s official exit-code reference defines status 5 as <strong>no tests collected</strong>. It does not mean tests failed, and it does not mean access was denied.</p>

      <section class="verifiedLab" aria-labelledby="verified-lab-title">
        <div class="verifiedLabHead">
          <div>
            <span>REPRODUCIBLE LAB</span>
            <h3 id="verified-lab-title">Trigger exit code 5, then fix it</h3>
          </div>
          <p>Verified July 4, 2026 · Python 3.12.13 · pytest 9.1.1</p>
        </div>
        <div class="verifiedLabGrid">
          <div class="labStep">
            <span class="labStepNumber">1</span>
            <strong>Run pytest in an empty directory</strong>
            <pre><code>mkdir exit-code-5-lab
cd exit-code-5-lab
pytest -q
printf 'exit=%s\\n' "$?"</code></pre>
            <div class="labOutput"><span>Observed output</span><code>no tests ran in 0.00s
exit=5</code></div>
          </div>
          <div class="labStep">
            <span class="labStepNumber">2</span>
            <strong>Add one discoverable test and rerun</strong>
            <pre><code>printf 'def test_smoke():\\n    assert True\\n' &gt; test_smoke.py
pytest -q
printf 'exit=%s\\n' "$?"</code></pre>
            <div class="labOutput labOutputSuccess"><span>Observed output</span><code>1 passed in 0.00s
exit=0</code></div>
          </div>
        </div>
        <p class="labConclusion"><strong>What changed:</strong> pytest itself was healthy. Adding a test that matched its discovery rules changed collection from zero tests to one test, so the documented exit status changed from 5 to 0.</p>
      </section>

      <pre class="codeBlock copyableCode"><code>pytest --collect-only -q
pytest -vv path/to/tests
pytest --trace-config</code></pre>
      <div class="searchIssueGrid">
        <div class="searchIssueCard"><h3 class="searchIssueTerm">Wrong discovery path</h3><p class="searchIssueDesc">CI starts in a different working directory, or the test path no longer exists.</p><p class="searchIssueAlert"><strong>Check:</strong> print <code>pwd</code>list the test directory, and pass the intended path explicitly.</p></div>
        <div class="searchIssueCard"><h3 class="searchIssueTerm">Names do not match</h3><p class="searchIssueDesc">Files, classes, or functions no longer match configured collection patterns.</p><p class="searchIssueAlert"><strong>Check:</strong> compare names with <code>python_files</code><code>python_classes</code>and <code>python_functions</code>.</p></div>
        <div class="searchIssueCard"><h3 class="searchIssueTerm">Markers or selection removed everything</h3><p class="searchIssueDesc"><code>-m</code><code>-k</code>ignore rules, or changed configuration selects an empty set.</p><p class="searchIssueAlert"><strong>Check:</strong> rerun collection without filters and inspect deselected counts.</p></div>
        <div class="searchIssueCard"><h3 class="searchIssueTerm">Empty is intentional</h3><p class="searchIssueDesc">A matrix shard or optional package legitimately has no tests.</p><p class="searchIssueAlert"><strong>Policy:</strong> handle that case explicitly. Do not append <code>|| true</code>which also hides real failures.</p></div>
      </div>
      <aside class="expertNote">
        <span>THE DETAIL MOST GUIDES MISS</span>
        <strong>“No tests collected” is a test-selection result, not a test failure.</strong>
        <p>Decide whether zero tests violates your pipeline contract. If tests were expected, status 5 is valuable evidence of broken discovery. If an empty shard is valid, encode that exception narrowly and preserve every other non-zero status.</p>
      </aside>

      <h3 class="subHead">When an empty test shard is intentionally valid</h3>
      <p class="bodyText">Keep pytest’s other failure codes intact. This shell pattern converts only status 5, and only after your team has decided that zero tests is valid for this job:</p>
      <pre class="codeBlock copyableCode"><code>set +e
pytest
status=$?
set -e

if [ "$status" -eq 5 ]; then
  echo "No tests collected; empty shard is allowed"
  exit 0
fi

exit "$status"</code></pre>
      <p class="bodyText"><strong>Do not use <code>pytest || true</code>.</strong> It also turns real test failures, interrupted runs, usage errors, and internal pytest errors into false successes.</p>

      <h2 class="sectionHead" id="curl">curl exit code 5: could not resolve proxy</h2>
      <p class="bodyText">curl assigns exit code 5 to a proxy hostname resolution failure. This differs from curl code 6, which means the destination host could not be resolved.</p>
      <pre class="codeBlock copyableCode"><code>env | grep -i '_proxy'
curl -v https://example.com/
getent hosts proxy.example.internal
curl --noproxy '*' https://example.com/   # diagnostic only</code></pre>
      <p class="bodyText">Check misspelled proxy variables, DNS visibility inside the container or runner, and whether uppercase and lowercase proxy variables differ. Do not permanently bypass a required enterprise proxy just to make the command green.</p>

      <h2 class="sectionHead" id="windows">Windows system error 5: access is denied</h2>
      <p class="bodyText">Microsoft defines Win32 system error 5 (<code>ERROR_ACCESS_DENIED</code>hexadecimal <code>0x5</code>) as “Access is denied.” Diagnose the denied resource and the effective identity before elevating privileges.</p>
      <pre class="codeBlock copyableCode"><code>whoami
whoami /groups
icacls "C:\\path\\to\\resource"
Get-Acl "C:\\path\\to\\resource" | Format-List</code></pre>
      <p class="bodyText"><strong>Safer fix order:</strong> confirm the file, directory, registry key, service, or network share being denied; verify the account that actually runs the process; grant only the required permission; then rerun. “Run as Administrator” is a diagnostic test, not a durable least-privilege design.</p>

      <h2 class="sectionHead" id="linux">Exit code 5 on Linux, Docker, and CI</h2>
      <p class="bodyText">Linux does not reserve process status 5 for one universal condition. A shell reports the status supplied by the program. In GitHub Actions, “Process completed with exit code 5” is similarly a wrapper message: the command above it owns the meaning.</p>
      <pre class="codeBlock copyableCode"><code>set -o pipefail
your-command 2&gt;&amp;1 | tee failure.log
status=\${PIPESTATUS[0]}
printf 'producer=%s status=%s\\n' "your-command" "$status"
exit "$status"</code></pre>
      <p class="bodyText">In Docker or Kubernetes, inspect the container command, application logs, termination message, and image version. Do not assume a security-context problem unless the application also reports a denied operation.</p>
      <p class="bodyText"><strong>systemd services:</strong> when <code>systemctl status</code> shows <code>code=exited, status=5</code>that is the status your <code>ExecStart</code> process returned, systemd does not define it. Run <code>journalctl -u &lt;service&gt;</code> to read what the program itself reported, and confirm the <code>ExecStart</code> path exists and the service user has access. In legacy LSB init scripts, exit 5 conventionally meant the program is not installed.</p>

      <h2 class="sectionHead">How to diagnose and recover from exit code 5 automatically</h2>
      <p class="bodyText">A reliable automated diagnosis must preserve context the number cannot provide. AlertMend’s incident model correlates the executable, stderr, runtime identity, environment variables, image or runner, and recent changes before recommending a response.</p>
      <div class="alertmendMethod">
        <div><span>1</span><strong>Identify</strong><p>Record the process that returned 5, not only the wrapper message.</p></div>
        <div><span>2</span><strong>Correlate</strong><p>Attach stderr, identity, proxy state, test selection, runtime, and recent changes.</p></div>
        <div><span>3</span><strong>Explain</strong><p>Map the evidence to that program’s documented meaning and show the reasoning.</p></div>
        <div><span>4</span><strong>Verify</strong><p>Run an approved recovery or route the evidence, then confirm the next execution.</p></div>
      </div>
      <p class="bodyText productDisclosure"><strong>Control remains explicit:</strong> recovery actions can require approval, and every action should be verified against the subsequent run. AlertMend is available as a managed service or self-hosted for enterprises that need operational data and remediation controls to remain inside their environment.</p>

      <h2 class="sectionHead" id="sources">Primary sources and scope</h2>
      <ul class="sourceList">
        <li><a href="https://docs.pytest.org/en/stable/reference/exit-codes.html" target="_blank" rel="noopener noreferrer">pytest documentation: Exit codes</a>pytest defines 5 as no tests collected.</li>
        <li><a href="https://curl.se/docs/manpage.html#EXIT-CODES" target="_blank" rel="noopener noreferrer">curl man page: Exit codes</a>curl defines 5 as could not resolve proxy.</li>
        <li><a href="https://learn.microsoft.com/en-us/windows/win32/debug/system-error-codes--0-499-" target="_blank" rel="noopener noreferrer">Microsoft: System Error Codes 0–499</a>Win32 error 5 is <code>ERROR_ACCESS_DENIED</code>.</li>
        <li><a href="https://pubs.opengroup.org/onlinepubs/9699919799/utilities/exit.html" target="_blank" rel="noopener noreferrer">POSIX: exit utility</a>a process supplies an exit status to its shell.</li>
      </ul>
      <div class="reviewPolicy"><strong>Review methodology:</strong> Meanings are tied to the named program and checked against primary documentation. The pytest reproduction was executed in a disposable environment using Python 3.12.13 and pytest 9.1.1 on July 4, 2026; output is reproduced above. Product behavior can change, so check the version running in your environment.</div>
      <div class="reviewPolicy disclosureNote"><strong>Disclosure:</strong> AlertMend publishes this guide and may benefit if readers evaluate its product. Every diagnostic command and manual fix in this article works without AlertMend.</div>

      <h2 class="sectionHead">The correct diagnosis order</h2>
      <ol class="diagnosisOrder">
        <li><strong>Name the producer.</strong><span>pytest, curl, a Windows API, systemd’s child process, or another application.</span></li>
        <li><strong>Keep the message.</strong><span>Preserve stderr and the command immediately above the exit-code wrapper.</span></li>
        <li><strong>Use the producer’s definition.</strong><span>Do not import the Windows “access denied” meaning into unrelated tools.</span></li>
        <li><strong>Change one cause and rerun.</strong><span>Verify the same command in the same runtime, identity, image, and working directory.</span></li>
      </ol>
      <p class="bodyText conclusionText"><strong>Bottom line:</strong> exit code 5 is not a diagnosis. The program name plus its error message is the diagnosis path.</p>

      <h2 class="sectionHead" id="faq">FAQ</h2>
      <div class="faqList">
        ${FAQ.map(([q, a], i) => `<div class="faqItem"><button type="button" class="faqQuestion" data-faq-toggle aria-expanded="${i === 0 ? 'true' : 'false'}">${esc(q)}<svg class="faqChevron${i === 0 ? ' faqChevronOpen' : ''}" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 9l6 6 6-6"/></svg></button><div class="faqAnswer${i === 0 ? '' : ' hidden'}">${esc(a)}</div></div>`).join('')}
      </div>

      <div class="ctaBand">
        <div class="ctaBandTitle">Bring one unexplained exit-code incident.</div>
        <p class="ctaBandSub">See AlertMend identify the producer, correlate the surrounding runtime evidence, and propose or execute an approved recovery, without treating every 5 as the same failure.</p>
        <div class="ctaBtnRow"><a href="${postCalendlyUrl}" class="ctaBtn" target="_blank" rel="noopener noreferrer">Walk through the failure →</a></div>
      </div>
    </div>
    <div class="promo"><p><strong>Related:</strong> <a href="/blog/make-error-127">Make Error 127</a> · <a href="/blog/debugging-kubernetes-oomkilled-exit-code-137-causes-and-solutions">Exit Code 137</a></p></div>
      </div>
${buildSidebarHtml(relatedPosts)}
    </div>
  </div>
  <script src="/assets/exit-code-5/script.js" defer></script>
</body>
</html>`

  writeStaticBlogOutputs(slug, html)
}
