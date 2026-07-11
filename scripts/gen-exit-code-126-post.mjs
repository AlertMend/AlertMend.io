import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import {
  ALERTMEND_TEAM,
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

const slug = 'exit-code-126'
const title = 'Exit Code 126: Meaning and Fixes'
const h1 = 'Exit Code 126: Command Found but Cannot Execute'
const description = 'Exit code 126 means a command was found but could not run. Fix permissions, shebangs, noexec mounts, Docker, npm, CI, and Kubernetes issues.'
const publishedDate = '2026-01-10'
const modifiedDate = '2026-07-11'
const category = 'Troubleshooting'
const keywords = 'exit code 126, exit status 126, bash exit code 126, command terminated with exit code 126, command invoked cannot execute, linux exit code 126, docker exit code 126, npm error code 126, process completed with exit code 126'
const canonical = `${SITE_URL}/blog/${slug}`
const calendly = calendlyUrl(slug)
const related = getRelatedPosts(slug, category)
const heroImage = `${SITE_URL}/assets/exit-code-126/exit-code-126-hero.svg`

const faq = [
  {
    q: 'What does exit code 126 mean?',
    a: 'In Bash-style shells, exit code 126 usually means the command was found but could not be executed. Common causes include missing execute permission, trying to execute a directory, a bad shebang, a noexec mount, or a binary built for the wrong OS or CPU architecture.',
  },
  {
    q: 'How do I fix exit code 126?',
    a: 'Read the command immediately before the failure, inspect the target with ls -l and file, check the shebang, confirm the interpreter exists, and verify the filesystem is not mounted noexec. Apply the smallest safe fix, then rerun in the same environment.',
  },
  {
    q: 'What is the difference between exit code 126 and 127?',
    a: '126 means the shell found something at that command path but could not invoke it. 127 means the command could not be found. Fix 126 by checking executability and invocation; fix 127 by checking PATH, installation, or command spelling.',
  },
  {
    q: 'What does Docker exit code 126 mean?',
    a: 'Docker documents exit code 126 as the contained command being present but not invokable. That can happen when CMD or ENTRYPOINT points at a directory, a non-executable file, a script with a bad interpreter, or an architecture-incompatible binary.',
  },
  {
    q: 'Why does GitHub Actions say process completed with exit code 126?',
    a: 'GitHub Actions is reporting the child process status. Find the step command above the message, then check whether the script or binary has execute permission in the repository and runner environment. For repo scripts, git update-index --chmod=+x often matters more than local chmod alone.',
  },
  {
    q: 'Is exit code 126 always a permission problem?',
    a: 'No. Permission denied is common, but 126 can also come from a directory being invoked, a noexec mount, a missing or invalid interpreter, CRLF line endings in a shebang, or a binary for the wrong platform.',
  },
]

const howToSteps = [
  { name: 'Identify the command', text: 'Find the exact command immediately before the exit-code message.' },
  { name: 'Inspect the target', text: 'Use ls -ld and file to check permissions, file type, and whether the path is a directory or binary.' },
  { name: 'Check the interpreter and filesystem', text: 'Read the shebang, confirm the interpreter exists, and check whether the filesystem is mounted noexec.' },
  { name: 'Apply the smallest safe fix', text: 'Fix execute bits, shebangs, repository mode, Docker command configuration, or architecture mismatch, then rerun in the same environment.' },
]

const blogPosting = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: title,
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

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to fix exit code 126',
  description,
  step: howToSteps.map((step, index) => ({
    '@type': 'HowToStep',
    position: index + 1,
    name: step.name,
    text: step.text,
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
        <p>Before AlertMend, he built scalable systems at Polymer Search and Roambee, and co-founded FutureApp e-schools. At AlertMend, he works on AI agents that correlate telemetry, diagnose root cause, and run governed recovery workflows across VMs, Kubernetes, CI/CD, and production services.</p>
      </div>
      <a class="authorBioLink" href="${DINESH_AUTHOR.linkedin}" target="_blank" rel="noopener noreferrer" aria-label="${esc(DINESH_AUTHOR.name)} on LinkedIn">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zM8.34 18V9.94H5.67V18h2.67zM7 8.76a1.55 1.55 0 1 0 0-3.1 1.55 1.55 0 0 0 0 3.1zM18.34 18v-4.42c0-2.37-1.27-3.47-2.96-3.47-1.36 0-1.97.75-2.31 1.28V9.94h-2.67V18h2.67v-4.5c0-.24.02-.48.09-.65.19-.48.63-.98 1.36-.98.96 0 1.35.73 1.35 1.8V18h2.82z"/></svg>
        <span>LinkedIn</span>
      </a>
    </div>
  </section>`
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
  <strong>✓ Verified against Bash, Docker, GNU, Git, and Kubernetes docs</strong>
  <span class="dot">•</span>
  <span>Last reviewed ${modifiedDate}</span>
</div>

<article class="ec126">
  <section class="answerPanel" id="answer">
    <div class="answerGrid">
      <div class="tenSecond">
        <span class="eyebrow">The 10-second answer</span>
        <h2>Exit code 126 means: found, but not executable.</h2>
        <p>If you see <strong>exit code 126</strong>, the shell or runtime usually found the command path, but could not invoke it. Start with the command immediately above the error, then check permissions, file type, shebang, mount options, and runtime architecture.</p>
        <div class="quickCommandStack" aria-label="First commands to run">
          <div class="quickCommand"><code>ls -ld ./script-or-command</code><span>mode + owner</span></div>
          <div class="quickCommand"><code>file ./script-or-command</code><span>script/binary/dir</span></div>
          <div class="quickCommand"><code>head -1 ./script-or-command</code><span>shebang</span></div>
          <div class="quickCommand"><code>command -v bash sh env</code><span>interpreter</span></div>
        </div>
      </div>
      <div class="signalCard" aria-label="Exit code 126 diagnostic flow">
        <div class="terminalWindow">
          <div class="terminalChrome"><span></span><span></span><span></span></div>
          <div class="terminalBody">
            <div><span class="muted">$</span> ./deploy.sh</div>
            <div class="error">bash: ./deploy.sh: Permission denied</div>
            <div><span class="muted">$</span> echo $?</div>
            <div class="good">126</div>
          </div>
        </div>
        <div class="flowRail">
          <div class="flowNode"><strong>Found</strong><span>path exists</span></div>
          <div class="flowArrow">→</div>
          <div class="flowNode"><strong>Blocked</strong><span>cannot invoke</span></div>
          <div class="flowArrow">→</div>
          <div class="flowNode"><strong>Fix</strong><span>smallest safe change</span></div>
        </div>
      </div>
    </div>
  </section>

  <nav class="tocPills" aria-label="On this page">
    <a href="#meaning">Meaning</a>
    <a href="#decoder">Decoder</a>
    <a href="#fix">Fix checklist</a>
    <a href="#docker-ci">Docker, npm, CI</a>
    <a href="#kubernetes">Kubernetes</a>
    <a href="#alertmend">Automate it</a>
    <a href="#sources">Sources</a>
    <a href="#faq">FAQ</a>
  </nav>

  <section class="sectionBlock" id="meaning">
    <h2 class="sectionTitle">What exit code 126 means in Bash and Linux</h2>
    <p class="bodyText">For a developer or SRE, the practical meaning is: <strong>the command exists, but the runtime could not execute it</strong>. Bash documents command lookup and execution separately: if a command is not found, Bash returns 127; if it is found but execution cannot proceed, you should investigate invocation problems rather than installation alone.</p>
    <div class="answerBox">
      <strong>TL;DR:</strong> Do not reinstall everything. First prove whether the target is executable by the same user, on the same filesystem, inside the same container or CI runner.
    </div>
    <div class="comparisonTableWrap">
      <table class="comparisonTable">
        <thead>
          <tr><th>Status</th><th>Plain English</th><th>Typical message</th><th>First fix</th></tr>
        </thead>
        <tbody>
          <tr>
            <td data-label="Status"><strong>126</strong></td>
            <td data-label="Plain English">Found, but cannot execute.</td>
            <td data-label="Typical message"><code>Permission denied</code>, <code>is a directory</code>, <code>bad interpreter</code>, <code>exec format error</code></td>
            <td data-label="First fix">Inspect mode, shebang, mount options, file type, and architecture.</td>
          </tr>
          <tr>
            <td data-label="Status"><strong>127</strong></td>
            <td data-label="Plain English">Command not found.</td>
            <td data-label="Typical message"><code>command not found</code>, <code>not found or does not exist</code></td>
            <td data-label="First fix">Fix PATH, install the tool, or correct command spelling.</td>
          </tr>
          <tr>
            <td data-label="Status"><strong>125</strong></td>
            <td data-label="Plain English">Docker itself failed before the container command ran.</td>
            <td data-label="Typical message">Bad Docker flag, daemon/runtime issue.</td>
            <td data-label="First fix">Fix the Docker invocation or daemon problem.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <section class="decoderCard" id="decoder" aria-labelledby="decoder-title">
    <div class="decoderHeader">
      <div>
        <span class="eyebrow">Interactive decoder</span>
        <h2 id="decoder-title">Same number, different root cause</h2>
        <p>Select the environment that produced exit code 126. The number is the clue; the surrounding message is the evidence.</p>
      </div>
      <span class="decoderBadge">No log upload</span>
    </div>
    <div class="decoderTabs" role="tablist" aria-label="Exit code 126 cases">
      <button class="decoderTab" type="button" data-case="bash" role="tab" aria-selected="true">Bash / Linux</button>
      <button class="decoderTab" type="button" data-case="docker" role="tab" aria-selected="false">Docker</button>
      <button class="decoderTab" type="button" data-case="ci" role="tab" aria-selected="false">npm / CI</button>
      <button class="decoderTab" type="button" data-case="k8s" role="tab" aria-selected="false">Kubernetes</button>
    </div>

    <div class="decoderPanel isActive" id="case-bash" role="tabpanel">
      <div class="snippetBox"><span class="dim">$ ./script.sh</span>
<span class="bad">bash: ./script.sh: Permission denied</span>
<span class="dim">$ echo $?</span>
126</div>
      <div class="interpretCard">
        <span class="eyebrow">Interpretation</span>
        <h3>The file is present, but not executable by this user.</h3>
        <p>Check the execute bit and parent directory access. Prefer a narrow permission change over <code>chmod 777</code>.</p>
        <div class="miniCommand">ls -l ./script.sh
chmod u+x ./script.sh
./script.sh</div>
        <p class="fixLine"><strong>Fix:</strong> add execute permission for the intended owner/group, or run it with an interpreter when that is the right contract: <code>bash ./script.sh</code>.</p>
      </div>
    </div>

    <div class="decoderPanel" id="case-docker" role="tabpanel">
      <div class="snippetBox"><span class="dim">$ docker run busybox /etc</span>
<span class="bad">Container command '/etc' could not be invoked.</span>
126</div>
      <div class="interpretCard">
        <span class="eyebrow">Interpretation</span>
        <h3>Docker could not invoke the contained command.</h3>
        <p>The command may be a directory, a script without execute permission, a broken entrypoint, or a binary built for another architecture.</p>
        <div class="miniCommand">docker image inspect IMAGE --format '{{json .Config.Entrypoint}} {{json .Config.Cmd}}'
docker run --rm --entrypoint sh IMAGE -lc 'ls -l /app && file /app/start'</div>
        <p class="fixLine"><strong>Fix:</strong> correct <code>ENTRYPOINT</code>/<code>CMD</code>, add execute permission during build, or rebuild for the target platform.</p>
      </div>
    </div>

    <div class="decoderPanel" id="case-ci" role="tabpanel">
      <div class="snippetBox"><span class="dim">Run npm run build</span>
<span class="bad">sh: ./scripts/build.sh: Permission denied</span>
<span class="dim">Error: Process completed with exit code 126.</span></div>
      <div class="interpretCard">
        <span class="eyebrow">Interpretation</span>
        <h3>The runner is reporting the child process status.</h3>
        <p>Local permission changes do not always survive Git. Store the executable bit in the repository when a CI runner must execute a script directly.</p>
        <div class="miniCommand">git update-index --chmod=+x scripts/build.sh
git commit -m "Mark build script executable"</div>
        <p class="fixLine"><strong>Fix:</strong> preserve executable mode in Git, or call the script through an explicit interpreter in <code>package.json</code> or the workflow.</p>
      </div>
    </div>

    <div class="decoderPanel" id="case-k8s" role="tabpanel">
      <div class="snippetBox"><span class="dim">$ kubectl logs app-7f9c</span>
<span class="bad">exec /app/start: permission denied</span>
<span class="dim">$ kubectl get pod app-7f9c</span>
CrashLoopBackOff</div>
      <div class="interpretCard">
        <span class="eyebrow">Interpretation</span>
        <h3>The container starts, then the entry command cannot run.</h3>
        <p>Look at the image entrypoint, mounted volumes, security context, and platform. A ConfigMap-mounted script may not behave like a file baked into the image.</p>
        <div class="miniCommand">kubectl describe pod POD
kubectl logs POD --previous
kubectl get pod POD -o jsonpath='{.spec.containers[0].command}'</div>
        <p class="fixLine"><strong>Fix:</strong> adjust image permissions, command/args, volume mount strategy, or image architecture, then redeploy safely.</p>
      </div>
    </div>
  </section>

  <section class="sectionBlock" id="fix">
    <h2 class="sectionTitle">How to fix exit code 126 safely</h2>
    <p class="bodyText">The fastest path is not “try chmod and hope.” Run the diagnosis in the same place the process failed: same user, same container, same CI runner, same filesystem.</p>
    <div class="stepsGrid">
      <div class="stepCard">
        <span>1</span>
        <h3>Find the producer</h3>
        <p>Read the command immediately before <code>exit code 126</code>. CI, npm, systemd, or Kubernetes may only be reporting a child process result.</p>
      </div>
      <div class="stepCard">
        <span>2</span>
        <h3>Check the target</h3>
        <p>Run <code>ls -ld</code> and <code>file</code>. You need to know whether it is a script, binary, symlink, directory, or wrong-platform executable.</p>
      </div>
      <div class="stepCard">
        <span>3</span>
        <h3>Validate the interpreter</h3>
        <p>Read the shebang. Confirm <code>/bin/bash</code>, <code>/usr/bin/env</code>, Python, Node, or sh exists in that runtime image or host.</p>
      </div>
      <div class="stepCard">
        <span>4</span>
        <h3>Fix the real blocker</h3>
        <p>Apply the smallest safe change: executable bit, Git mode, Docker command, CRLF cleanup, noexec mount policy, or architecture rebuild.</p>
      </div>
    </div>

    <div class="fixTableWrap">
      <table class="fixTable">
        <thead>
          <tr><th>Evidence</th><th>Likely cause</th><th>Confirm with</th><th>Safe fix</th></tr>
        </thead>
        <tbody>
          <tr>
            <td data-label="Evidence"><code>Permission denied</code></td>
            <td data-label="Likely cause">Missing execute bit or parent directory permission.</td>
            <td data-label="Confirm with"><code>ls -ld file parent-dir</code></td>
            <td data-label="Safe fix"><code>chmod u+x file</code> or correct ownership/group intentionally.</td>
          </tr>
          <tr>
            <td data-label="Evidence"><code>is a directory</code></td>
            <td data-label="Likely cause">Command points at a directory, not a file.</td>
            <td data-label="Confirm with"><code>file path</code></td>
            <td data-label="Safe fix">Point the command to an executable file inside the directory.</td>
          </tr>
          <tr>
            <td data-label="Evidence"><code>bad interpreter</code></td>
            <td data-label="Likely cause">Broken shebang, missing interpreter, or CRLF line endings.</td>
            <td data-label="Confirm with"><code>head -1 script</code></td>
            <td data-label="Safe fix">Fix the shebang, install the interpreter, or convert line endings.</td>
          </tr>
          <tr>
            <td data-label="Evidence"><code>Text file busy</code></td>
            <td data-label="Likely cause">A process is executing a file while deployment overwrites it.</td>
            <td data-label="Confirm with"><code>lsof file</code></td>
            <td data-label="Safe fix">Deploy atomically: write a new file and swap symlinks or releases.</td>
          </tr>
          <tr>
            <td data-label="Evidence"><code>Exec format error</code></td>
            <td data-label="Likely cause">Wrong OS/CPU binary, or script missing interpreter contract.</td>
            <td data-label="Confirm with"><code>file binary</code> and runtime architecture.</td>
            <td data-label="Safe fix">Rebuild for linux/amd64 or linux/arm64, or invoke the right interpreter.</td>
          </tr>
          <tr>
            <td data-label="Evidence">Works locally, fails in CI</td>
            <td data-label="Likely cause">Executable bit not stored in Git or different runner shell.</td>
            <td data-label="Confirm with"><code>git ls-files -s script</code></td>
            <td data-label="Safe fix"><code>git update-index --chmod=+x script</code> and commit it.</td>
          </tr>
          <tr>
            <td data-label="Evidence">Fails only from mounted path</td>
            <td data-label="Likely cause">Filesystem is mounted with <code>noexec</code>.</td>
            <td data-label="Confirm with"><code>mount</code> output for that path.</td>
            <td data-label="Safe fix">Move executable artifacts or change mount policy through approved ops flow.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <section class="sectionBlock" id="docker-ci">
    <h2 class="sectionTitle">Docker, npm, and CI: where 126 gets confusing</h2>
    <p class="bodyText">You may see the same failure phrased as <strong>command terminated with exit code 126</strong>, <strong>npm error code 126</strong>, or <strong>process completed with exit code 126</strong>. Those wrappers usually do not define the number; they report the program or container command that failed underneath.</p>
    <div class="answerBox">
      <strong>Docker:</strong> If Docker returns 126, inspect <code>ENTRYPOINT</code>, <code>CMD</code>, file mode, image platform, and whether a mounted file replaced an executable from the image.
    </div>
    <div class="answerBox">
      <strong>npm:</strong> npm often reports the exit code of the script command. Look inside <code>package.json</code>, then inspect the script file or binary that line invokes.
    </div>
    <div class="answerBox">
      <strong>GitHub Actions / CI:</strong> the runner message is a wrapper. Store executable mode in Git, avoid relying on a local-only chmod, and print <code>ls -l</code> during diagnosis.
    </div>
  </section>

  <section class="sectionBlock" id="kubernetes">
    <h2 class="sectionTitle">Kubernetes exit code 126 and CrashLoopBackOff</h2>
    <p class="bodyText">In Kubernetes, you may not see “exit code 126” first. You may see <strong>CrashLoopBackOff</strong>, then logs like <code>exec /app/start: permission denied</code>. The fix is still the same investigation, but you need to look through the pod specification and image, not only the shell.</p>
    <div class="stepsGrid">
      <div class="stepCard">
        <span>1</span>
        <h3>Read previous logs</h3>
        <p><code>kubectl logs POD --previous</code> often contains the real execution error from the failed container start.</p>
      </div>
      <div class="stepCard">
        <span>2</span>
        <h3>Inspect command and args</h3>
        <p>Compare the pod command/args with the image entrypoint and the file that actually exists in the container.</p>
      </div>
      <div class="stepCard">
        <span>3</span>
        <h3>Check mounts and security context</h3>
        <p>Mounted config, secret, or volume content may not have the same mode as files baked into the image.</p>
      </div>
      <div class="stepCard">
        <span>4</span>
        <h3>Verify platform</h3>
        <p>Confirm the image architecture matches the node architecture, especially on mixed arm64/amd64 clusters.</p>
      </div>
    </div>
  </section>

  <section class="sectionBlock" id="alertmend">
    <h2 class="sectionTitle">How to automate exit code 126: from alert to verified fix</h2>
    <p class="bodyText">A human can fix exit code 126 quickly when all the evidence is in one place. The hard part in production is collecting that evidence across CI, Docker, Kubernetes, VMs, logs, ownership, recent deploys, and the on-call channel at 2 a.m.</p>
    <div class="alertmendFlow">
      <h3>AlertMend diagnosis and recovery flow</h3>
      <p>AlertMend correlates the failure message, runtime context, deploy metadata, and safe runbook policy before suggesting or running a recovery.</p>
      <div class="recoveryTrack">
        <div class="recoveryStep"><strong>Detect</strong><span>Exit code, stderr, failed process, pod/job/service, runner, host, and recent deploy.</span></div>
        <div class="recoveryArrow">→</div>
        <div class="recoveryStep"><strong>Diagnose</strong><span>Classify permission, shebang, noexec, Docker command, Git executable bit, or architecture mismatch.</span></div>
        <div class="recoveryArrow">→</div>
        <div class="recoveryStep"><strong>Act safely</strong><span>Run approved checks, open a PR, restart a safe job, or request approval for risky changes.</span></div>
        <div class="recoveryArrow">→</div>
        <div class="recoveryStep"><strong>Verify</strong><span>Confirm the command runs, service health recovers, and the incident channel has root cause attached.</span></div>
      </div>
    </div>
    <h3 class="sectionTitle" style="font-size:1.35rem;margin-top:1.75rem;">Start by automating the basic toil</h3>
    <p class="bodyText">Exit code 126 is exactly the kind of incident where teams should not burn senior engineering time on repeatable checks. The first automation does not need to be risky auto-remediation. Start with the toil: collect evidence, classify the failure, suggest the safe fix, and only then decide whether to run it automatically or ask for approval.</p>
    <div class="stepsGrid">
      <div class="stepCard">
        <span>1</span>
        <h3>Collect the boring evidence</h3>
        <p>Capture stderr, exit code, command, user, working directory, container image, pod, runner, host, and recent deploy without asking an on-call engineer to paste commands.</p>
      </div>
      <div class="stepCard">
        <span>2</span>
        <h3>Run safe read-only checks</h3>
        <p>Automatically run checks like <code>ls -ld</code>, <code>file</code>, shebang inspection, Git mode lookup, Docker entrypoint inspection, and Kubernetes previous logs.</p>
      </div>
      <div class="stepCard">
        <span>3</span>
        <h3>Turn repeat fixes into runbooks</h3>
        <p>For known low-risk cases, open a PR for an executable bit, restart a failed job, or propose the exact Docker/Kubernetes change with context attached.</p>
      </div>
      <div class="stepCard">
        <span>4</span>
        <h3>Gate production actions</h3>
        <p>Keep approval for risky changes, but remove the manual diagnosis loop. The human should approve a clear fix, not rediscover the same root cause every week.</p>
      </div>
    </div>
    <div class="answerBox">
      <strong>The practical goal:</strong> if the same class of 126 failure happens again, the team should receive “likely root cause + evidence + safe next action” in Slack or WhatsApp, not a raw alert that sends someone back to a terminal.
    </div>
    <div class="automationCta">
      <p><strong>Want to automate this on your stack?</strong> Bring one real exit code 126 failure and we will map the evidence, guardrails, and first safe runbook.</p>
      <a class="ctaButton ctaButtonPrimary" href="${calendly}&intent=automation-review" target="_blank" rel="noopener noreferrer">Book a 20-min automation review →</a>
    </div>
    <p class="bodyText">For enterprise teams, AlertMend can run as a managed or self-hosted control plane, with approval gates for production remediation, on-call routing, Slack and WhatsApp workflows, and VM/Kubernetes visibility. The point is not to hide exit code 126; it is to preserve the evidence and turn the known fix into a governed automation.</p>
  </section>

  <section class="sectionBlock" id="sources">
    <h2 class="sectionTitle">Primary sources checked</h2>
    <p class="bodyText">The fixes above are based on primary documentation and operational behavior, not a generic “try chmod” answer.</p>
    <ol class="sourceList">
      <li><a href="https://www.gnu.org/software/bash/manual/bash.html#Command-Search-and-Execution" target="_blank" rel="noopener noreferrer">GNU Bash manual: command search and execution</a></li>
      <li><a href="https://www.gnu.org/software/bash/manual/bash.html#Exit-Status" target="_blank" rel="noopener noreferrer">GNU Bash manual: exit status</a></li>
      <li><a href="https://docs.docker.com/engine/containers/run/#exit-status" target="_blank" rel="noopener noreferrer">Docker docs: container exit status 125, 126, and 127</a></li>
      <li><a href="https://www.gnu.org/software/coreutils/manual/html_node/chmod-invocation.html" target="_blank" rel="noopener noreferrer">GNU Coreutils manual: chmod</a></li>
      <li><a href="https://git-scm.com/docs/git-update-index" target="_blank" rel="noopener noreferrer">Git docs: git update-index --chmod</a></li>
      <li><a href="https://kubernetes.io/docs/tasks/debug/debug-application/debug-running-pod/" target="_blank" rel="noopener noreferrer">Kubernetes docs: debug running pods</a></li>
    </ol>
  </section>

  <section class="sectionBlock" id="faq">
    <h2 class="sectionTitle">Exit code 126 FAQ</h2>
    <div class="faqList">
    ${faq.map((item, index) => `
      <div class="faqItem">
        <button type="button" class="faqQuestion" data-faq-toggle aria-expanded="${index === 0 ? 'true' : 'false'}">
          ${esc(item.q)}
          <svg class="faqChevron${index === 0 ? ' faqChevronOpen' : ''}" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
        </button>
        <div class="faqAnswer${index === 0 ? '' : ' hidden'}">${esc(item.a)}</div>
      </div>
    `).join('')}
    </div>
  </section>

  <section class="ctaBox">
    <h2>Want the basic toil handled automatically?</h2>
    <p>AlertMend can watch the logs, classify the 126 failure, attach the likely root cause, run safe read-only checks, and route the approved recovery path across VMs, Kubernetes, Docker, and CI-driven production services.</p>
    <div class="ctaButtons">
      <a class="ctaButton ctaButtonPrimary" href="${calendly}" target="_blank" rel="noopener noreferrer">Book a reliability review</a>
      <a class="ctaButton ctaButtonSecondary" href="/auto-remediation">See automated remediation</a>
    </div>
  </section>
  ${authorCard()}
</article>`

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)} | AlertMend AI</title>
  <meta name="description" content="${esc(description)}">
  <meta name="keywords" content="${esc(keywords)}">
  <meta name="author" content="${esc(DINESH_AUTHOR.name)}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
  <link rel="canonical" href="${canonical}">
  <link rel="icon" type="image/svg+xml" href="/logos/alertmend-logo.svg">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${canonical}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:image" content="${heroImage}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${heroImage}">
  <script type="application/ld+json">${JSON.stringify(blogPosting)}</script>
  <script type="application/ld+json">${JSON.stringify(faqJsonLd)}</script>
  <script type="application/ld+json">${JSON.stringify(howToJsonLd)}</script>
  <link rel="stylesheet" href="/assets/exit-code-126/styles.css">
  <style>${CHROME_INLINE_CSS}${AUTHOR_CRED_CSS}</style>
</head>
<body>
${buildNavHtml(slug, calendly)}
  <div class="main-container">
    <div class="content-wrapper">
      <div class="main-col">
        ${content}
        <div class="promo">
          <p>Ready to eliminate manual firefighting and achieve autonomous infrastructure operations?</p>
          <p>See how AlertMend AI can help you reduce incident toil and automate safe remediation across Kubernetes, VMs, and CI/CD. <a href="${calendly}" target="_blank" rel="noopener noreferrer">Book a demo. →</a></p>
        </div>
      </div>
      ${buildSidebarHtml(related, title)}
    </div>
  </div>
  <script src="/assets/exit-code-126/script.js"></script>
  <script>${BLOG_SIGNUP_HANDLER_JS}</script>
</body>
</html>`

fs.writeFileSync(path.join(root, 'public/blog', `${slug}.md`), `---
title: "${title}"
excerpt: "${description}"
date: "${publishedDate}"
dateModified: "${modifiedDate}"
category: "${category}"
author: "${DINESH_AUTHOR.name}"
keywords: "${keywords}"
---

This post is published as a standalone page at [/blog/${slug}](/blog/${slug}).
`)

writeStaticBlogOutputs(slug, html)
console.log(`✓ Wrote public/blog/${slug}.md`)
