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

const slug = 'unable-to-get-local-issuer-certificate-npm'
const title = 'npm Local Issuer Certificate Fix'
const h1 = 'npm “Unable to Get Local Issuer Certificate”: Fix It Without Disabling SSL'
const description = 'Fix npm unable to get local issuer certificate safely: diagnose corporate proxies, private registries, cafile, NODE_EXTRA_CA_CERTS, and strict-ssl.'
const publishedDate = '2026-01-10'
const modifiedDate = '2026-07-11'
const category = 'Security'
const keywords = 'unable to get local issuer certificate npm, npm unable to get local issuer certificate, npm unable to get issuer cert locally, npm install unable to get local issuer certificate, NODE_EXTRA_CA_CERTS npm, npm cafile, npm strict-ssl, self signed certificate in certificate chain'
const canonical = `${SITE_URL}/blog/${slug}`
const calendly = calendlyUrl(slug)
const related = getRelatedPosts(slug, category)
const heroImage = `${SITE_URL}/assets/${slug}/hero.svg`

const faq = [
  {
    q: 'How do I fix “npm unable to get local issuer certificate”?',
    a: 'Find which registry npm is connecting to, confirm whether a corporate proxy or private registry is replacing the TLS certificate, then add the correct trusted CA using npm cafile or NODE_EXTRA_CA_CERTS. Keep strict-ssl enabled unless you are doing a short diagnostic test.',
  },
  {
    q: 'Should I run npm config set strict-ssl false?',
    a: 'No, not as a real fix. It disables certificate verification for npm traffic and can hide a man-in-the-middle or broken trust-chain problem. Use it only temporarily to prove the error is certificate validation, then turn it back on and install the right CA.',
  },
  {
    q: 'What is the difference between cafile and NODE_EXTRA_CA_CERTS?',
    a: 'npm cafile configures npm’s registry TLS trust for npm operations. NODE_EXTRA_CA_CERTS extends Node.js trusted CAs for Node processes that read it at startup. Some build tools and postinstall scripts use Node directly, so enterprise teams often need both.',
  },
  {
    q: 'Why does this happen only on my company Wi-Fi or VPN?',
    a: 'Enterprise TLS inspection proxies often present certificates signed by an internal corporate root CA. Browsers may trust that CA through the OS store, while npm or Node inside a terminal, Docker image, or CI runner may not.',
  },
  {
    q: 'How do I fix it in CI or Docker?',
    a: 'Install the corporate or private-registry CA into the image or runner, set npm cafile or NODE_EXTRA_CA_CERTS to the mounted PEM file, run npm ping against the configured registry, and keep strict-ssl true.',
  },
  {
    q: 'What does UNABLE_TO_GET_ISSUER_CERT_LOCALLY mean?',
    a: 'It means the TLS client could not build a trusted certificate chain from the server certificate to a root CA it trusts locally. In npm installs, that usually points to a missing corporate CA, private registry CA, stale CA bundle, or proxy configuration issue.',
  },
]

const howToSteps = [
  { name: 'Find the registry npm is using', text: 'Run npm config get registry and npm ping to identify the exact endpoint that fails.' },
  { name: 'Check whether a proxy or private registry is involved', text: 'Inspect npm proxy settings, HTTPS_PROXY, NO_PROXY, VPN state, and private-registry configuration.' },
  { name: 'Install the right trusted CA', text: 'Use npm cafile or NODE_EXTRA_CA_CERTS with the corporate or registry CA in PEM format.' },
  { name: 'Keep strict SSL enabled', text: 'Re-enable strict-ssl, rerun npm ping, then retry npm install or npm ci in the same environment.' },
]

const blogPosting = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: h1,
  description,
  image: heroImage,
  datePublished: publishedDate,
  dateModified: modifiedDate,
  author: dineshJsonLdAuthor(),
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
  name: 'How to fix npm unable to get local issuer certificate',
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
  <strong>✓ Checked against npm and Node.js docs</strong>
  <span class="dot">•</span>
  <span>Last reviewed ${modifiedDate}</span>
  <span class="dot">•</span>
  <span>Primary sources cited</span>
</div>

<article class="npmcert article-content">
  <section class="heroPanel" id="answer">
    <div class="heroGrid">
      <div class="answerCard">
        <span class="eyebrow">The safe answer</span>
        <h2>Do not disable npm SSL verification.</h2>
        <p>The npm error <strong>unable to get local issuer certificate</strong> means npm or a Node process could not build a trusted TLS certificate chain for the registry it is contacting.</p>
        <p>The right fix is to identify the registry/proxy/private CA, add the correct trusted CA, and verify the result with <code>npm ping</code> or the failing <code>npm install</code> command.</p>
        <div class="commandStack" aria-label="First commands to run">
          <div class="commandLine"><code>npm config get registry</code><span>which endpoint?</span></div>
          <div class="commandLine"><code>npm ping --registry=https://registry.npmjs.org/</code><span>can npm trust it?</span></div>
          <div class="commandLine"><code>npm config get cafile</code><span>custom CA?</span></div>
          <div class="commandLine"><code>node -p "process.versions.node"</code><span>which Node?</span></div>
        </div>
      </div>
      <div class="trustGraphic" aria-label="Certificate trust flow">
        <div class="miniTerminal">
          <div class="terminalChrome"><span></span><span></span><span></span></div>
          <div class="terminalBody">
            <div><span class="muted">$</span> npm install</div>
            <div class="error">request to https://registry.npmjs.org/ failed</div>
            <div class="error">reason: unable to get local issuer certificate</div>
          </div>
        </div>
        <div class="trustPath">
          <div class="trustNode"><strong>npm</strong><span>registry request</span></div>
          <div class="trustArrow">→</div>
          <div class="trustNode"><strong>TLS cert</strong><span>server or proxy</span></div>
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
    <a href="#ci-docker">CI &amp; Docker</a>
    <a href="#avoid">What not to do</a>
    <a href="#automation">Automate it</a>
    <a href="#sources">Sources</a>
    <a href="#faq">FAQ</a>
  </nav>

  <section class="sectionBlock" id="meaning">
    <h2 class="sectionTitle">What “unable to get local issuer certificate” means in npm</h2>
    <p class="bodyText">npm is trying to talk to a registry over HTTPS. During the TLS handshake, the server presents a certificate chain. npm/Node must be able to connect that chain back to a trusted root certificate. If the local trust store does not contain the issuer that signed the chain, npm fails with messages such as <strong>unable to get local issuer certificate</strong>, <strong>UNABLE_TO_GET_ISSUER_CERT_LOCALLY</strong>, or <strong>self signed certificate in certificate chain</strong>.</p>
    <div class="answerBox">
      <strong>TL;DR:</strong> the registry may be healthy and your package may be fine. The failing layer is trust: corporate proxy CA, private registry CA, stale CA bundle, Docker image CA store, or CI runner configuration.
    </div>
  </section>

  <section class="sectionBlock" id="decoder">
    <div class="decoderHeader">
      <div>
        <span class="eyebrow">Pick your environment</span>
        <h2 class="sectionTitle">Same npm error. Different real fix.</h2>
      </div>
      <p>Choose where the error appears. The command that fixes a laptop may not fix a Docker image or CI runner.</p>
    </div>
    <div class="scenarioTabs" role="tablist" aria-label="npm certificate scenarios">
      <button class="scenarioTab isActive" type="button" role="tab" aria-selected="true" data-scenario="local">Local machine</button>
      <button class="scenarioTab" type="button" role="tab" aria-selected="false" data-scenario="corp">Corporate proxy</button>
      <button class="scenarioTab" type="button" role="tab" aria-selected="false" data-scenario="private">Private registry</button>
      <button class="scenarioTab" type="button" role="tab" aria-selected="false" data-scenario="docker">Docker / CI</button>
    </div>
    <div class="scenarioPanel">
      <div class="scenarioTerminal" aria-live="polite">
        <span class="dim">$ observed failure</span>
        <strong data-scenario-output>npm ERR! request to https://registry.npmjs.org/ failed, reason: unable to get local issuer certificate</strong>
      </div>
      <div class="scenarioMeaning">
        <span class="eyebrow">Interpretation</span>
        <h3 data-scenario-title>Your Node/npm trust store cannot validate the registry chain.</h3>
        <p data-scenario-copy>Start by confirming the registry URL and whether the failure happens only on one machine, VPN, or network. If the public registry works elsewhere, the issue is local trust or proxy configuration.</p>
        <pre><code data-scenario-commands>npm config get registry
npm ping
npm config get cafile</code></pre>
        <p class="scenarioFix"><strong>Fix:</strong> <span data-scenario-fix>Update Node/npm if very old, check OS certificates, and add the correct CA only if your environment uses one.</span></p>
      </div>
    </div>
  </section>

  <section class="sectionBlock" id="safe-fix">
    <h2 class="sectionTitle">Safe fix checklist</h2>
    <p class="bodyText">Do these in order. The goal is to restore trust for the right certificate authority, not to silence TLS verification.</p>
    <div class="stepsGrid">
      <div class="stepCard">
        <span>1</span>
        <h3>Confirm the registry</h3>
        <p>Run <code>npm config get registry</code>. If it points to Artifactory, Verdaccio, Nexus, GitHub Packages, or another internal host, fix that host’s CA chain first.</p>
      </div>
      <div class="stepCard">
        <span>2</span>
        <h3>Check proxy settings</h3>
        <p>Look at <code>npm config get proxy</code>, <code>npm config get https-proxy</code>, <code>HTTPS_PROXY</code>, and <code>NO_PROXY</code>. A proxy can replace the certificate you see.</p>
      </div>
      <div class="stepCard">
        <span>3</span>
        <h3>Add the trusted CA</h3>
        <p>Ask security/IT for the corporate or registry root CA in PEM format, then configure npm with <code>npm config set cafile /path/to/ca.pem</code>.</p>
      </div>
      <div class="stepCard">
        <span>4</span>
        <h3>Verify with npm</h3>
        <p>Keep <code>strict-ssl=true</code>, then run <code>npm ping</code> and the original <code>npm install</code> or <code>npm ci</code> command in the same shell.</p>
      </div>
    </div>
    <div class="fixTableWrap">
      <table class="fixTable">
        <thead>
          <tr><th>Situation</th><th>Best fix</th><th>Why it works</th></tr>
        </thead>
        <tbody>
          <tr>
            <td data-label="Situation">Company laptop on VPN</td>
            <td data-label="Best fix"><code>npm config set cafile /path/to/company-root.pem</code></td>
            <td data-label="Why it works">npm trusts the CA that signs the proxy or internal registry certificate.</td>
          </tr>
          <tr>
            <td data-label="Situation">Node app or postinstall script fails</td>
            <td data-label="Best fix"><code>NODE_EXTRA_CA_CERTS=/path/to/company-root.pem</code></td>
            <td data-label="Why it works">Node processes can extend their known root CAs when they start.</td>
          </tr>
          <tr>
            <td data-label="Situation">Docker image fails but laptop works</td>
            <td data-label="Best fix">Install OS CA package and copy the corporate CA into the image.</td>
            <td data-label="Why it works">Containers have their own filesystem and trust store; your laptop trust does not automatically follow.</td>
          </tr>
          <tr>
            <td data-label="Situation">Private registry has incomplete chain</td>
            <td data-label="Best fix">Fix the registry certificate chain on the server or load the issuing CA.</td>
            <td data-label="Why it works">Clients need the full chain from leaf certificate to trusted issuer.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <section class="sectionBlock" id="ci-docker">
    <h2 class="sectionTitle">CI and Docker: why the fix disappears</h2>
    <p class="bodyText">A common trap: you fix npm on your laptop, then the build still fails in GitHub Actions, Jenkins, GitLab CI, or a Dockerfile. That is expected. The CI runner and container image have separate environment variables, npm config, and CA stores.</p>
    <div class="codeSplit">
      <div>
        <h3>Docker pattern</h3>
        <pre><code>FROM node:22-bookworm
COPY company-root.pem /ca/company-root.pem
ENV NODE_EXTRA_CA_CERTS=/ca/company-root.pem
RUN npm config set cafile /ca/company-root.pem
RUN npm ping
RUN npm ci</code></pre>
      </div>
      <div>
        <h3>CI pattern</h3>
        <pre><code>npm config get registry
printf "%s" "$COMPANY_ROOT_CA" > company-root.pem
export CA="$PWD/company-root.pem"
npm config set cafile "$CA"
export NODE_EXTRA_CA_CERTS="$CA"
npm ping
npm ci</code></pre>
      </div>
    </div>
    <div class="answerBox">
      <strong>Production rule:</strong> store the CA as a managed secret or baked image asset, not as an ad-hoc command typed by the on-call engineer during a failing deployment.
    </div>
  </section>

  <section class="sectionBlock" id="avoid">
    <h2 class="sectionTitle">What not to do</h2>
    <div class="antiPattern">
      <div>
        <span class="eyebrow">Anti-pattern</span>
        <h3><code>npm config set strict-ssl false</code></h3>
      </div>
      <p>That command may get a build moving, but it also tells npm to stop verifying registry certificates. It converts a trust-chain failure into a hidden supply-chain risk. If you use it for a minute to confirm the diagnosis, immediately undo it with <code>npm config set strict-ssl true</code> and implement the CA fix.</p>
    </div>
  </section>

  <section class="sectionBlock" id="automation">
    <h2 class="sectionTitle">How to automate this class of npm certificate failure</h2>
    <p class="bodyText">Certificate failures are good automation candidates because the evidence is repeatable: registry URL, npm config, proxy variables, Node version, container image, runner identity, certificate expiry, and the failing command. A useful automation should collect that evidence first, then choose a safe action.</p>
    <div class="automationFlow">
      <h3>From raw npm error to governed fix</h3>
      <div class="automationTrack">
        <div class="automationStep"><strong>Detect</strong><span>npm install/ci failed with issuer-certificate error in CI, Docker, VM, or build service.</span></div>
        <div class="automationArrow">→</div>
        <div class="automationStep"><strong>Diagnose</strong><span>Correlate registry, proxy, CA file, Node version, runner image, and recent network changes.</span></div>
        <div class="automationArrow">→</div>
        <div class="automationStep"><strong>Act safely</strong><span>Open a PR, update a CA bundle secret, restart a runner, or ask approval for trust-store changes.</span></div>
        <div class="automationArrow">→</div>
        <div class="automationStep"><strong>Verify</strong><span>Run npm ping and npm ci again, then attach root cause to Slack or WhatsApp.</span></div>
      </div>
    </div>
    <h3 class="sectionTitle subTitle">Start by automating the basic toil</h3>
    <p class="bodyText">The first automation does not need to blindly edit trust stores. Start with the boring but expensive work: collect evidence, classify whether this is proxy/private-registry/Docker/CI, suggest the safe fix, and keep approval gates for production trust changes.</p>
    <div class="automationCta">
      <p><strong>Want to automate npm certificate failures?</strong> Bring one real CI or Docker failure and we will map the evidence, guardrails, and first safe runbook.</p>
      <a class="ctaButton ctaButtonPrimary" href="${calendly}&intent=npm-cert-automation-review" target="_blank" rel="noopener noreferrer">Book a 20-min automation review →</a>
    </div>
    <p class="bodyText">For enterprise teams, AlertMend can run as a managed or self-hosted control plane, with on-call routing, Slack and WhatsApp workflows, VM/Kubernetes/CI visibility, approval gates, and local-model options. The point is not to bypass npm security; it is to preserve the evidence and turn repeated certificate toil into governed automation.</p>
  </section>

  <section class="sectionBlock" id="sources">
    <h2 class="sectionTitle">Primary sources checked</h2>
    <p class="bodyText">The recommendations above use official npm and Node.js behavior, not the common shortcut answer.</p>
    <ol class="sourceList">
      <li><a href="https://docs.npmjs.com/cli/v11/using-npm/config/#cafile" target="_blank" rel="noopener noreferrer">npm config: cafile</a></li>
      <li><a href="https://docs.npmjs.com/cli/v11/using-npm/config/#ca" target="_blank" rel="noopener noreferrer">npm config: ca</a></li>
      <li><a href="https://docs.npmjs.com/cli/v11/using-npm/config/#strict-ssl" target="_blank" rel="noopener noreferrer">npm config: strict-ssl</a></li>
      <li><a href="https://docs.npmjs.com/cli/v11/commands/npm-ping/" target="_blank" rel="noopener noreferrer">npm ping command</a></li>
      <li><a href="https://nodejs.org/api/cli.html#node_extra_ca_certsfile" target="_blank" rel="noopener noreferrer">Node.js CLI: NODE_EXTRA_CA_CERTS</a></li>
      <li><a href="https://nodejs.org/api/cli.html#--use-system-ca" target="_blank" rel="noopener noreferrer">Node.js CLI: --use-system-ca</a></li>
      <li><a href="https://nodejs.org/api/cli.html#--use-bundled-ca---use-openssl-ca" target="_blank" rel="noopener noreferrer">Node.js CLI: bundled and OpenSSL CA stores</a></li>
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
          <h2>Want certificate and CI failures to self-diagnose?</h2>
          <p>See how AlertMend can correlate npm logs, CI metadata, registry health, proxy settings, and safe remediation runbooks across your stack.</p>
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
