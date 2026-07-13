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

const slug = 'git-config-global-http-sslbackend-schannel'
const title = 'git http.sslBackend schannel Fix'
const h1 = 'git config --global http.sslBackend schannel: What It Does and How to Fix Errors'
const description = 'Learn what git config --global http.sslBackend schannel does, when to use it on Windows, and how to fix unsupported ssl backend schannel safely.'
const publishedDate = '2026-01-10'
const modifiedDate = '2026-07-12'
const category = 'DevOps'
const keywords = 'git config --global http.sslbackend schannel, git config schannel, git schannel, http.sslbackend schannel, git http.sslbackend, unsupported ssl backend schannel, supported ssl backends gnutls, supported ssl backends openssl, http.sslcainfo'
const canonical = `${SITE_URL}/blog/${slug}`
const calendly = calendlyUrl(slug)
const related = getRelatedPosts(slug, category)
const heroImage = `${SITE_URL}/assets/${slug}/hero.svg`

const faq = [
  {
    q: 'What does git config --global http.sslBackend schannel do?',
    a: 'It tells Git to use the Schannel SSL backend, which is the Windows Secure Channel backend used through libcurl. In practice, Git for Windows can then use certificates trusted by the Windows certificate store instead of only a separate OpenSSL-style CA bundle.',
  },
  {
    q: 'When should I use http.sslBackend schannel?',
    a: 'Use it on Git for Windows when your company root CA or proxy CA is already trusted by Windows and Git HTTPS commands fail because Git is using a different CA store.',
  },
  {
    q: 'How do I fix “fatal: unsupported ssl backend schannel”?',
    a: 'That Git build does not support schannel. Run git config --global --unset http.sslBackend, then use a backend your Git supports, such as openssl or gnutls, with the correct CA store or http.sslCAInfo setting.',
  },
  {
    q: 'Should I set http.sslVerify false instead?',
    a: 'No. Git verifies SSL certificates by default. Turning verification off hides the actual trust problem and weakens HTTPS protection. Install the right CA or choose the correct SSL backend instead.',
  },
  {
    q: 'What is http.schannelUseSSLCAInfo?',
    a: 'With schannel, Git normally avoids letting http.sslCAInfo override the Windows certificate store. http.schannelUseSSLCAInfo changes that behavior when you intentionally want Git to use a CA bundle with schannel.',
  },
  {
    q: 'Does schannel work in Linux, WSL, or Docker?',
    a: 'Usually no. Schannel is the Windows Secure Channel backend. Linux, WSL, and containers normally use OpenSSL or GnuTLS builds, so install the CA in that environment or configure http.sslCAInfo.',
  },
]

const howToSteps = [
  { name: 'Check the current backend', text: 'Run git config --show-origin --get-all http.sslBackend to see whether schannel, openssl, or another backend is configured and where it came from.' },
  { name: 'Use schannel only on supported Git for Windows builds', text: 'Set git config --global http.sslBackend schannel when the Windows certificate store contains the CA Git needs.' },
  { name: 'Undo unsupported schannel settings', text: 'If Git says schannel is unsupported, unset http.sslBackend and use the CA strategy for the supported backend.' },
  { name: 'Verify without weakening SSL', text: 'Keep http.sslVerify true and rerun git ls-remote, clone, fetch, or push in the same environment.' },
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
    ...dineshJsonLdAuthor(),
    jobTitle: 'AI agent automation expert',
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
  name: 'How to use git http.sslBackend schannel safely',
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
    <img src="/logos/dinesh.jpeg" alt="${esc(DINESH_AUTHOR.name)}" width="128" height="128" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
    <div class="authorBioFallback" aria-hidden="true">DA</div>
    <div class="authorBioContent">
      <h3>${esc(DINESH_AUTHOR.name)}</h3>
      <p class="authorBioRole">Co-Founder &amp; CTO at AlertMend AI</p>
      <div class="authorBioText">
        <p>${esc(DINESH_AUTHOR.name)} is a software engineer, entrepreneur, and AI agent automation expert focused on autonomous infrastructure operations.</p>
        <p>Before AlertMend, he built scalable systems at Polymer Search and Roambee, and co-founded FutureApp e-schools. At AlertMend, he works on AI agents that correlate logs, deploy metadata, runtime context, and safe runbooks so teams can turn repeat production failures into governed automation.</p>
      </div>
      <a class="authorBioLink" href="${DINESH_AUTHOR.linkedin}" target="_blank" rel="noopener noreferrer" aria-label="${esc(DINESH_AUTHOR.name)} on LinkedIn">
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
${buildCredArticleHeader(
  h1,
  publishedDate,
  category,
  {
    ...DINESH_AUTHOR,
    role: 'AI agent automation expert',
    credLine: '12+ years in cloud infrastructure and incident automation',
  }
)}
<div class="proofStrip" aria-label="Article verification">
  <strong>✓ Checked against Git, curl, and Microsoft docs</strong>
  <span class="dot">•</span>
  <span>Last reviewed ${modifiedDate}</span>
  <span class="dot">•</span>
  <span>Sources cited</span>
</div>

<article class="schannel article-content">
  <section class="heroPanel" id="answer">
    <div class="heroGrid">
      <div class="answerCard">
        <span class="eyebrow">The short answer</span>
        <h2>Use schannel only when your Git build supports Windows certificate trust.</h2>
        <p><code>git config --global http.sslBackend schannel</code> tells Git to use the Windows Secure Channel TLS backend, commonly through Git for Windows and libcurl.</p>
        <p>It helps when Windows already trusts your company or proxy CA. It does not fix Linux, WSL, Docker, or Git builds that only support <code>openssl</code> or <code>gnutls</code>.</p>
        <div class="commandStack" aria-label="First commands to run">
          <div class="commandLine"><code>git config --show-origin --get-all http.sslBackend</code><span>current setting</span></div>
          <div class="commandLine"><code>git config --global http.sslBackend schannel</code><span>Windows fix</span></div>
          <div class="commandLine"><code>git config --global --unset http.sslBackend</code><span>undo bad setting</span></div>
          <div class="commandLine"><code>git ls-remote &lt;url&gt;</code><span>verify</span></div>
        </div>
      </div>
      <div class="trustGraphic" aria-label="Git schannel trust flow">
        <div class="miniTerminal">
          <div class="terminalChrome"><span></span><span></span><span></span></div>
          <div class="terminalBody">
            <div><span class="muted">$</span> git config --global http.sslBackend schannel</div>
            <div class="error">fatal: unsupported ssl backend 'schannel'</div>
            <div class="error">supported ssl backends: gnutls</div>
          </div>
        </div>
        <div class="trustPath">
          <div class="trustNode windowsNode"><strong>Windows store</strong><span>trusted roots</span></div>
          <div class="trustArrow">→</div>
          <div class="trustNode"><strong>Schannel</strong><span>if supported</span></div>
          <div class="trustArrow">→</div>
          <div class="trustNode trustBroken"><strong>Wrong build?</strong><span>unset it</span></div>
        </div>
      </div>
    </div>
  </section>

  <nav class="tocPills" aria-label="On this page">
    <a href="#meaning">Meaning</a>
    <a href="#decision">Decision</a>
    <a href="#decoder">Decoder</a>
    <a href="#safe-fix">Safe fixes</a>
    <a href="#avoid">Avoid</a>
    <a href="#automation">Automate it</a>
    <a href="#sources">Sources</a>
    <a href="#faq">FAQ</a>
  </nav>

  <section class="sectionBlock" id="meaning">
    <h2 class="sectionTitle">What <code>http.sslBackend = schannel</code> means</h2>
    <p class="bodyText">Git uses libcurl for HTTPS operations such as clone, fetch, and push. The <code>http.sslBackend</code> setting chooses which TLS backend libcurl should use when that Git build supports runtime backend selection. On Windows, <code>schannel</code> means Secure Channel, the Windows TLS stack that can use the Windows certificate store.</p>
    <div class="answerBox">
      <strong>TL;DR:</strong> On Git for Windows, schannel can be the clean fix for corporate certificates already trusted by Windows. On unsupported builds, it is not a fix — it becomes the error.
    </div>
  </section>

  <section class="sectionBlock" id="decision">
    <h2 class="sectionTitle">Should you set schannel?</h2>
    <div class="decisionGrid">
      <div class="decisionCard">
        <h3>Yes</h3>
        <p><strong>Use it</strong> on Git for Windows when Windows already trusts the company root CA and Git HTTPS commands do not.</p>
      </div>
      <div class="decisionCard">
        <h3>No</h3>
        <p><strong>Do not use it</strong> on Linux, WSL, Docker, most CI images, or any Git build reporting supported backends as only <code>openssl</code> or <code>gnutls</code>.</p>
      </div>
      <div class="decisionCard">
        <h3>Maybe</h3>
        <p><strong>Be careful</strong> when <code>http.sslCAInfo</code> is set. With schannel, Git normally avoids letting that bundle replace Windows trust unless configured otherwise.</p>
      </div>
    </div>
  </section>

  <section class="sectionBlock" id="decoder">
    <div class="decoderHeader">
      <div>
        <span class="eyebrow">Pick your failure</span>
        <h2 class="sectionTitle">Same setting. Different real fix.</h2>
      </div>
      <p>The command is useful only in the right environment. Select the symptom you actually see.</p>
    </div>
    <div class="scenarioTabs" role="tablist" aria-label="Git schannel scenarios">
      <button class="scenarioTab isActive" type="button" role="tab" aria-selected="true" data-scenario="windows">Windows Git</button>
      <button class="scenarioTab" type="button" role="tab" aria-selected="false" data-scenario="unsupported">Unsupported</button>
      <button class="scenarioTab" type="button" role="tab" aria-selected="false" data-scenario="ca">Corporate CA</button>
      <button class="scenarioTab" type="button" role="tab" aria-selected="false" data-scenario="openssl">OpenSSL/GnuTLS</button>
      <button class="scenarioTab" type="button" role="tab" aria-selected="false" data-scenario="revoke">Revocation</button>
    </div>
    <div class="scenarioPanel">
      <div class="scenarioTerminal" aria-live="polite">
        <span class="dim">$ observed result</span>
        <strong data-scenario-output>git config --global http.sslBackend schannel
git ls-remote https://github.com/org/repo.git
# Git uses Windows certificate trust</strong>
      </div>
      <div class="scenarioMeaning">
        <span class="eyebrow">Interpretation</span>
        <h3 data-scenario-title>Use schannel when Git for Windows should trust the Windows certificate store.</h3>
        <p data-scenario-copy>This is the common corporate Windows fix: the company root CA is already trusted by Windows, and Git should use that same trust store instead of a separate OpenSSL CA bundle.</p>
        <pre><code data-scenario-commands>git config --global http.sslBackend schannel
git config --global http.sslVerify true
git ls-remote https://github.com/org/repo.git</code></pre>
        <p class="scenarioFix"><strong>Fix:</strong> <span data-scenario-fix>Good fit for Git for Windows when the Windows Trusted Root store already contains the CA that signs your proxy or repository certificate.</span></p>
      </div>
    </div>
  </section>

  <section class="sectionBlock" id="safe-fix">
    <h2 class="sectionTitle">Safe fix checklist</h2>
    <p class="bodyText">Follow this order so you fix the trust path instead of hiding the error.</p>
    <div class="stepsGrid">
      <div class="stepCard">
        <span>1</span>
        <h3>Find the source</h3>
        <p>Run <code>git config --show-origin --get-all http.sslBackend</code>. If the bad setting came from global config, unset it globally; if it came from system config, fix it through your managed Git image or endpoint policy.</p>
      </div>
      <div class="stepCard">
        <span>2</span>
        <h3>Match the OS</h3>
        <p>Use <code>schannel</code> for supported Git for Windows builds. Use OS trust or <code>http.sslCAInfo</code> for OpenSSL/GnuTLS environments.</p>
      </div>
      <div class="stepCard">
        <span>3</span>
        <h3>Keep verification on</h3>
        <p>Keep <code>http.sslVerify=true</code>. If Git cannot verify the server, add the correct CA or choose the correct backend.</p>
      </div>
      <div class="stepCard">
        <span>4</span>
        <h3>Verify with Git</h3>
        <p>Run <code>git ls-remote &lt;url&gt;</code> in the same terminal, runner, WSL distro, or container that failed.</p>
      </div>
    </div>
    <div class="fixTableWrap">
      <table class="fixTable">
        <thead>
          <tr><th>Symptom</th><th>Best fix</th><th>Why it works</th></tr>
        </thead>
        <tbody>
          <tr>
            <td data-label="Symptom">Windows Git cannot trust corporate proxy</td>
            <td data-label="Best fix"><code>git config --global http.sslBackend schannel</code></td>
            <td data-label="Why it works">Git uses the same Windows certificate trust that your browser and endpoint policy use.</td>
          </tr>
          <tr>
            <td data-label="Symptom">Unsupported backend: gnutls</td>
            <td data-label="Best fix"><code>git config --global --unset http.sslBackend</code></td>
            <td data-label="Why it works">Removes a Windows-only backend from a Git build that cannot use it.</td>
          </tr>
          <tr>
            <td data-label="Symptom">Unsupported backend: openssl</td>
            <td data-label="Best fix">Unset schannel, then set <code>http.sslCAInfo</code> to a PEM CA bundle if needed.</td>
            <td data-label="Why it works">OpenSSL-style Git expects a file or OS CA path, not the Windows Schannel backend.</td>
          </tr>
          <tr>
            <td data-label="Symptom">Revocation check error</td>
            <td data-label="Best fix">Fix CRL/OCSP access; only then consider <code>http.schannelCheckRevoke=false</code> with approval.</td>
            <td data-label="Why it works">Revocation failures are not the same as missing-issuer failures.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <section class="sectionBlock" id="avoid">
    <h2 class="sectionTitle">What not to do</h2>
    <div class="antiPattern">
      <div>
        <span class="eyebrow">Anti-pattern</span>
        <h3><code>git config --global http.sslVerify false</code></h3>
      </div>
      <p>That may silence the error, but it also disables Git certificate verification. The safer fix is to use the backend your Git supports and make the right CA trusted by that environment.</p>
    </div>
  </section>

  <section class="sectionBlock" id="automation">
    <h2 class="sectionTitle">How you can automate this Git SSL toil</h2>
    <p class="bodyText">This problem is repetitive because the evidence is easy to collect: OS, Git version, config origin, configured backend, supported backend error, remote URL, proxy variables, CA path, and the exact TLS failure. That makes it a strong candidate for safe automation.</p>
    <div class="automationFlow">
      <h3>From Git SSL error to governed fix</h3>
      <div class="automationTrack">
        <div class="automationStep"><strong>Detect</strong><span>Clone, fetch, pull, or CI checkout fails with schannel, OpenSSL, GnuTLS, or local issuer errors.</span></div>
        <div class="automationArrow">→</div>
        <div class="automationStep"><strong>Diagnose</strong><span>Collect Git config origin, OS, backend, proxy, CA path, runner image, and certificate chain.</span></div>
        <div class="automationArrow">→</div>
        <div class="automationStep"><strong>Act safely</strong><span>Suggest unset, schannel, CA bundle, or runner-image fix with approval gates.</span></div>
        <div class="automationArrow">→</div>
        <div class="automationStep"><strong>Verify</strong><span>Run git ls-remote or the CI checkout again and attach the root cause to Slack or WhatsApp.</span></div>
      </div>
    </div>
    <h3 class="sectionTitle subTitle">Start by automating the basic toil</h3>
    <p class="bodyText">You do not need to start with auto-editing every developer laptop. Start with evidence collection and classification: Windows Schannel fix, unsupported backend undo, CA bundle missing, or revocation check issue.</p>
    <div class="automationCta">
      <p><strong>Want to automate Git SSL failures?</strong> Bring one real laptop, WSL, or CI failure and we will map the evidence, guardrails, and first safe runbook.</p>
      <a class="ctaButton ctaButtonPrimary" href="${calendly}&intent=git-sslbackend-automation-review" target="_blank" rel="noopener noreferrer">Book a 20-min automation review →</a>
    </div>
    <p class="bodyText">For enterprise teams, AlertMend can run as a managed or self-hosted control plane, with on-call routing, Slack and WhatsApp workflows, VM/CI visibility, approval gates, and local-model options. The point is not to bypass TLS; it is to remove the repeated manual diagnosis around Git SSL failures.</p>
  </section>

  <section class="sectionBlock" id="sources">
    <h2 class="sectionTitle">Primary sources checked</h2>
    <p class="bodyText">The recommendations above are based on Git, curl, and Microsoft documentation.</p>
    <ol class="sourceList">
      <li><a href="https://git-scm.com/docs/git-config" target="_blank" rel="noopener noreferrer">Git config documentation: http.sslBackend, http.sslCAInfo, http.sslVerify, and schannel options</a></li>
      <li><a href="https://curl.se/docs/sslcerts.html" target="_blank" rel="noopener noreferrer">curl SSL CA certificates: native vs file-based trust stores</a></li>
      <li><a href="https://learn.microsoft.com/en-us/windows/win32/secauthn/secure-channel" target="_blank" rel="noopener noreferrer">Microsoft Secure Channel documentation</a></li>
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
  <meta name="author" content="${esc(DINESH_AUTHOR.name)}">
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
          <h2>Want Git and CI SSL failures to self-diagnose?</h2>
          <p>See how AlertMend can correlate Git config, runner metadata, certificate chains, proxy settings, and safe remediation runbooks across developer and CI environments.</p>
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
