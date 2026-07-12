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

const slug = 'gitlab-unable-to-get-local-issuer-certificate'
const title = 'GitLab Local Issuer Certificate Fix'
const h1 = 'GitLab “Unable to Get Local Issuer Certificate”: Fix Git Clone, Runner, and CI Safely'
const description = 'Fix GitLab unable to get local issuer certificate safely: diagnose Git clone, Runner, CI, custom CA chains, sslCAInfo, and trusted-certs.'
const publishedDate = '2026-01-10'
const modifiedDate = '2026-07-12'
const category = 'DevOps'
const keywords = 'gitlab unable to get local issuer certificate, gitlab ssl certificate problem unable to get local issuer certificate, unable to get local issuer certificate gitlab, GitLab Runner custom CA, git http.sslCAInfo, GitLab trusted-certs, GIT_SSL_NO_VERIFY'
const canonical = `${SITE_URL}/blog/${slug}`
const calendly = calendlyUrl(slug)
const related = getRelatedPosts(slug, category)
const heroImage = `${SITE_URL}/assets/${slug}/hero.svg`

const faq = [
  {
    q: 'How do I fix GitLab unable to get local issuer certificate?',
    a: 'Find the exact actor that fails: your Git client, GitLab Runner, job container, or self-managed GitLab server. Verify the GitLab certificate chain, then install the issuing CA into that actor’s trust store or configure Git with a scoped http.sslCAInfo path. Keep SSL verification enabled.',
  },
  {
    q: 'Should I set git config --global http.sslVerify false?',
    a: 'No. That disables certificate verification for Git traffic and can hide a broken trust chain or man-in-the-middle risk. Use it only as a short diagnostic in a controlled environment, then restore http.sslVerify true and install the correct CA.',
  },
  {
    q: 'Why does GitLab work in my browser but git clone fails?',
    a: 'Browsers, Git, GitLab Runner, and containers may use different trust stores. Your browser may trust the company root CA through the OS, while Git or the runner image does not.',
  },
  {
    q: 'How do I fix this in GitLab Runner?',
    a: 'Install the custom CA where the runner expects it, commonly /etc/gitlab-runner/certs/gitlab.example.com.crt, or configure tls-ca-file. For Docker and Kubernetes executors, also make the CA available to the helper or job container that performs Git operations.',
  },
  {
    q: 'What is the difference between GitLab trusted-certs and Git sslCAInfo?',
    a: 'GitLab trusted-certs helps a self-managed GitLab instance trust certificates when GitLab itself connects outward. Git sslCAInfo tells a Git client which CA file to use when verifying a GitLab HTTPS remote.',
  },
  {
    q: 'What if a proxy causes “self signed certificate in certificate chain”?',
    a: 'Treat the proxy as part of the certificate chain. Ask security or IT for the proxy’s root CA in PEM format, install it in the failing environment, and verify with GIT_CURL_VERBOSE or openssl before rerunning the build.',
  },
]

const howToSteps = [
  { name: 'Identify the failing actor', text: 'Confirm whether the error comes from a laptop Git command, GitLab Runner, Docker or Kubernetes job image, or the GitLab server itself.' },
  { name: 'Inspect the certificate chain', text: 'Use openssl s_client and Git verbose logging to see the server certificate, issuer, proxy behavior, and trust failure.' },
  { name: 'Install the correct CA', text: 'Add the corporate, private, or intermediate CA to the trust store used by the failing actor, or configure Git http.sslCAInfo for the GitLab URL.' },
  { name: 'Verify without disabling SSL', text: 'Run git ls-remote, rerun the pipeline in the same runner/container, and keep http.sslVerify true.' },
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
  name: 'How to fix GitLab unable to get local issuer certificate',
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
  <strong>✓ Checked against GitLab + Git docs</strong>
  <span class="dot">•</span>
  <span>Last reviewed ${modifiedDate}</span>
  <span class="dot">•</span>
  <span>Sources cited</span>
</div>

<article class="gitlabcert article-content">
  <section class="heroPanel" id="answer">
    <div class="heroGrid">
      <div class="answerCard">
        <span class="eyebrow">The safe answer</span>
        <h2>Do not disable Git SSL verification.</h2>
        <p>The GitLab error <strong>unable to get local issuer certificate</strong> means Git, GitLab Runner, or a CI container cannot build a trusted TLS chain to the GitLab host.</p>
        <p>The right fix is to identify which environment is failing, add the correct trusted CA there, and verify with the same Git command or pipeline that failed.</p>
        <div class="commandStack" aria-label="First commands to run">
          <div class="commandLine"><code>git remote -v</code><span>which host?</span></div>
          <div class="commandLine"><code>git ls-remote https://gitlab.example.com/group/repo.git</code><span>trust test</span></div>
          <div class="commandLine"><code>git config --show-origin --get http.sslCAInfo</code><span>custom CA?</span></div>
          <div class="commandLine"><code>GIT_CURL_VERBOSE=1 git ls-remote &lt;url&gt;</code><span>evidence</span></div>
        </div>
      </div>
      <div class="trustGraphic" aria-label="GitLab certificate trust flow">
        <div class="miniTerminal">
          <div class="terminalChrome"><span></span><span></span><span></span></div>
          <div class="terminalBody">
            <div><span class="muted">$</span> git clone https://gitlab.example.com/group/app.git</div>
            <div class="error">SSL certificate problem:</div>
            <div class="error">unable to get local issuer certificate</div>
          </div>
        </div>
        <div class="trustPath">
          <div class="trustNode gitlabNode"><strong>Git client</strong><span>clone, fetch, push</span></div>
          <div class="trustArrow">→</div>
          <div class="trustNode"><strong>GitLab TLS</strong><span>server or proxy</span></div>
          <div class="trustArrow">→</div>
          <div class="trustNode trustBroken"><strong>CA missing</strong><span>chain fails</span></div>
        </div>
      </div>
    </div>
  </section>

  <nav class="tocPills" aria-label="On this page">
    <a href="#meaning">Meaning</a>
    <a href="#decoder">Decoder</a>
    <a href="#safe-fix">Safe fix</a>
    <a href="#runner-ci">Runner &amp; CI</a>
    <a href="#avoid">What not to do</a>
    <a href="#automation">Automate it</a>
    <a href="#sources">Sources</a>
    <a href="#faq">FAQ</a>
  </nav>

  <section class="sectionBlock" id="meaning">
    <h2 class="sectionTitle">What this GitLab certificate error means</h2>
    <p class="bodyText">Git is trying to reach a GitLab HTTPS remote. During the TLS handshake, the server or a corporate proxy presents a certificate chain. Git must be able to connect that chain back to a CA it trusts locally. If the issuer is missing, Git fails before it can clone, fetch, push, or download CI dependencies.</p>
    <div class="answerBox">
      <strong>TL;DR:</strong> do not reinstall GitLab, do not reinstall Git, and do not turn off SSL verification as the fix. Find the environment that lacks the CA: laptop, runner service, helper image, job container, or self-managed GitLab server.
    </div>
    <div class="twoColumnNote">
      <div class="noteCard">
        <h3>Common messages</h3>
        <p><code>SSL certificate problem: unable to get local issuer certificate</code>, <code>server certificate verification failed</code>, <code>x509: certificate signed by unknown authority</code>, or <code>self signed certificate in certificate chain</code>.</p>
      </div>
      <div class="noteCard">
        <h3>Common causes</h3>
        <p>Private GitLab CA, corporate TLS inspection proxy, incomplete server certificate chain, GitLab Runner missing the CA, or Docker/Kubernetes job images with a different CA bundle.</p>
      </div>
    </div>
  </section>

  <section class="sectionBlock" id="decoder">
    <div class="decoderHeader">
      <div>
        <span class="eyebrow">Pick the failing environment</span>
        <h2 class="sectionTitle">Same GitLab error. Different real fix.</h2>
      </div>
      <p>Choose where the error appears. A fix for your laptop may not fix GitLab Runner, Docker executor, or a self-managed GitLab server.</p>
    </div>
    <div class="scenarioTabs" role="tablist" aria-label="GitLab certificate scenarios">
      <button class="scenarioTab isActive" type="button" role="tab" aria-selected="true" data-scenario="clone">Git clone</button>
      <button class="scenarioTab" type="button" role="tab" aria-selected="false" data-scenario="runner">GitLab Runner</button>
      <button class="scenarioTab" type="button" role="tab" aria-selected="false" data-scenario="docker">Docker / K8s CI</button>
      <button class="scenarioTab" type="button" role="tab" aria-selected="false" data-scenario="server">Self-managed server</button>
    </div>
    <div class="scenarioPanel">
      <div class="scenarioTerminal" aria-live="polite">
        <span class="dim">$ observed failure</span>
        <strong data-scenario-output>git clone https://gitlab.example.com/group/app.git
fatal: unable to access ...
SSL certificate problem: unable to get local issuer certificate</strong>
      </div>
      <div class="scenarioMeaning">
        <span class="eyebrow">Interpretation</span>
        <h3 data-scenario-title>The Git client cannot trust the certificate chain for the GitLab host.</h3>
        <p data-scenario-copy>Start with the exact remote URL and the certificate chain Git sees. If a browser works but Git fails, the local Git/cURL trust store or a corporate proxy is usually the difference.</p>
        <pre><code data-scenario-commands>git remote -v
git ls-remote https://gitlab.example.com/group/app.git
git config --show-origin --get http.sslCAInfo
GIT_CURL_VERBOSE=1 git ls-remote https://gitlab.example.com/group/app.git</code></pre>
        <p class="scenarioFix"><strong>Fix:</strong> <span data-scenario-fix>Install the issuing CA into the OS or Git trust store, or scope http.sslCAInfo to the GitLab URL. Keep http.sslVerify enabled.</span></p>
      </div>
    </div>
  </section>

  <section class="sectionBlock" id="safe-fix">
    <h2 class="sectionTitle">Safe fix checklist</h2>
    <p class="bodyText">Use this order. It keeps the system secure and avoids the classic “it works on my laptop but fails in CI” loop.</p>
    <div class="stepsGrid">
      <div class="stepCard">
        <span>1</span>
        <h3>Identify who failed</h3>
        <p>Was it a developer shell, GitLab Runner service, helper image, job container, Kubernetes executor, or GitLab itself connecting outward?</p>
      </div>
      <div class="stepCard">
        <span>2</span>
        <h3>Inspect the chain</h3>
        <p>Run <code>openssl s_client -showcerts</code> with the GitLab hostname and compare the issuer with the CA available to the failing environment.</p>
      </div>
      <div class="stepCard">
        <span>3</span>
        <h3>Add the correct CA</h3>
        <p>Install the corporate, private, or intermediate CA into the right trust store. For Git, prefer a scoped <code>http.sslCAInfo</code> when you cannot update the OS store.</p>
      </div>
      <div class="stepCard">
        <span>4</span>
        <h3>Verify safely</h3>
        <p>Run <code>git ls-remote</code> or the original CI job again in the same environment. Keep <code>http.sslVerify=true</code>.</p>
      </div>
    </div>
    <div class="fixTableWrap">
      <table class="fixTable">
        <thead>
          <tr><th>Situation</th><th>Best fix</th><th>Why it works</th></tr>
        </thead>
        <tbody>
          <tr>
            <td data-label="Situation">Local Git clone fails</td>
            <td data-label="Best fix"><code>git config --global http."https://gitlab.example.com/".sslCAInfo /path/to/company-root.pem</code></td>
            <td data-label="Why it works">Only Git requests to that GitLab host use the internal CA file.</td>
          </tr>
          <tr>
            <td data-label="Situation">GitLab Runner fails before script starts</td>
            <td data-label="Best fix">Install the CA under <code>/etc/gitlab-runner/certs/</code> or configure <code>tls-ca-file</code>.</td>
            <td data-label="Why it works">The runner can verify GitLab while preparing, cloning, or fetching sources.</td>
          </tr>
          <tr>
            <td data-label="Situation">Docker or Kubernetes job image fails</td>
            <td data-label="Best fix">Bake or mount the CA into the image and refresh the image CA bundle.</td>
            <td data-label="Why it works">Containers do not automatically inherit the host or runner trust store.</td>
          </tr>
          <tr>
            <td data-label="Situation">Self-managed GitLab serves incomplete chain</td>
            <td data-label="Best fix">Install the full certificate chain in the correct order on the GitLab server.</td>
            <td data-label="Why it works">Clients can build a complete path from the leaf certificate to a trusted issuer.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <section class="sectionBlock" id="runner-ci">
    <h2 class="sectionTitle">GitLab Runner and CI: the fix has to be in the same environment</h2>
    <p class="bodyText">GitLab certificate failures are sneaky because more than one component may touch GitLab: the runner service, the helper image that fetches sources, and the job container that runs your build. Fix the one that actually makes the failing HTTPS request.</p>
    <div class="codeSplit">
      <div>
        <h3>Runner service pattern</h3>
        <pre><code>sudo mkdir -p /etc/gitlab-runner/certs
sudo cp company-root-ca.pem \
  /etc/gitlab-runner/certs/gitlab.example.com.crt
sudo gitlab-runner restart
sudo gitlab-runner verify</code></pre>
      </div>
      <div>
        <h3>Job container pattern</h3>
        <pre><code>cp company-root-ca.pem \
  /usr/local/share/ca-certificates/company-root-ca.crt
update-ca-certificates
git config --global http.sslVerify true
git ls-remote "$CI_REPOSITORY_URL"</code></pre>
      </div>
    </div>
    <div class="answerBox">
      <strong>Production rule:</strong> store the CA as a managed runner secret, image asset, or configuration-management item. Do not rely on an on-call engineer pasting a one-off certificate command during a broken deployment.
    </div>
  </section>

  <section class="sectionBlock" id="avoid">
    <h2 class="sectionTitle">What not to do</h2>
    <div class="antiPattern">
      <div>
        <span class="eyebrow">Anti-pattern</span>
        <h3><code>git config --global http.sslVerify false</code></h3>
      </div>
      <p>That command can make the error disappear, but it also tells Git to stop verifying certificates. It turns a useful security failure into invisible risk. If you use it briefly to prove the diagnosis, immediately undo it with <code>git config --global http.sslVerify true</code> and install the CA properly.</p>
    </div>
  </section>

  <section class="sectionBlock" id="automation">
    <h2 class="sectionTitle">How you can automate GitLab certificate failures</h2>
    <p class="bodyText">This is a strong automation candidate because the evidence is structured: repository URL, runner ID, executor type, container image, proxy variables, certificate issuer, certificate expiry, CA file path, and recent network or GitLab certificate changes.</p>
    <div class="automationFlow">
      <h3>From raw GitLab error to governed fix</h3>
      <div class="automationTrack">
        <div class="automationStep"><strong>Detect</strong><span>Clone, fetch, push, or pipeline failed with local issuer or unknown authority error.</span></div>
        <div class="automationArrow">→</div>
        <div class="automationStep"><strong>Diagnose</strong><span>Correlate Git remote, runner, executor, image, proxy config, CA bundle, and certificate chain.</span></div>
        <div class="automationArrow">→</div>
        <div class="automationStep"><strong>Act safely</strong><span>Open a PR, update runner config, refresh a CA secret, or ask approval for trust-store changes.</span></div>
        <div class="automationArrow">→</div>
        <div class="automationStep"><strong>Verify</strong><span>Rerun git ls-remote or the pipeline and attach the root cause to Slack or WhatsApp.</span></div>
      </div>
    </div>
    <h3 class="sectionTitle subTitle">Start by automating the basic toil</h3>
    <p class="bodyText">The first automation does not need to blindly change certificates. Start with the expensive boring work: collect evidence, classify whether this is local Git, Runner, job image, proxy, or server chain, suggest the safe fix, and keep approval gates for production trust changes.</p>
    <div class="automationCta">
      <p><strong>Want to automate GitLab certificate failures?</strong> Bring one real runner or CI failure and we will map the evidence, guardrails, and first safe runbook.</p>
      <a class="ctaButton ctaButtonPrimary" href="${calendly}&intent=gitlab-cert-automation-review" target="_blank" rel="noopener noreferrer">Book a 20-min automation review →</a>
    </div>
    <p class="bodyText">For enterprise teams, AlertMend can run as a managed or self-hosted control plane, with on-call routing, Slack and WhatsApp workflows, VM/Kubernetes/CI visibility, approval gates, and local-model options. The point is not to bypass TLS; it is to preserve evidence and turn repeated certificate toil into governed automation.</p>
  </section>

  <section class="sectionBlock" id="sources">
    <h2 class="sectionTitle">Primary sources checked</h2>
    <p class="bodyText">The recommendations above are based on GitLab and Git documentation, not the unsafe shortcut answer.</p>
    <ol class="sourceList">
      <li><a href="https://docs.gitlab.com/runner/configuration/tls-self-signed/" target="_blank" rel="noopener noreferrer">GitLab Runner: self-signed certificates or custom CAs</a></li>
      <li><a href="https://docs.gitlab.com/omnibus/settings/ssl/" target="_blank" rel="noopener noreferrer">GitLab Linux package SSL and trusted-certs settings</a></li>
      <li><a href="https://git-scm.com/docs/git-config" target="_blank" rel="noopener noreferrer">Git config: http.sslVerify and http.sslCAInfo</a></li>
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
          <h2>Want GitLab and CI failures to self-diagnose?</h2>
          <p>See how AlertMend can correlate GitLab logs, runner metadata, certificate chains, proxy settings, and safe remediation runbooks across your stack.</p>
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
