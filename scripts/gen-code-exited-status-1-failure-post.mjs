import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import {
  AUTHOR_CRED_CSS,
  BLOG_SIGNUP_HANDLER_JS,
  CHROME_INLINE_CSS,
  ARVIND_AUTHOR,
  SITE_URL,
  buildCredArticleHeader,
  buildNavHtml,
  buildSidebarHtml,
  calendlyUrl,
  esc,
  getRelatedPosts,
  writeStaticBlogOutputs,
} from './static-blog-shared.mjs'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')

const slug = 'code-exited-status-1-failure'
const title = 'Fix code=exited, status=1/failure (systemd)'
const h1 = 'code=exited, status=1/failure: Fix a systemd Service That Will Not Start'
const description = 'A systemd service failed with code=exited, status=1/failure. Read journalctl to find the real error and fix docker, nginx, apache, or mysql start failures.'
const publishedDate = '2026-01-10'
const modifiedDate = '2026-07-16'
const category = 'Troubleshooting'
const keywords = 'code=exited status=1/failure, code exited status 1 failure, status=1/failure, main process exited code=exited status=1/failure, control process exited code=exited, active: failed (result: exit-code), failed with result exit-code, systemd service failed, journalctl -xeu, docker.service failed, nginx service failed, exit code 1, exit status 1, what is exit code 1, kubernetes exit code 1, github actions exit code 1'
const canonical = `${SITE_URL}/blog/${slug}`
const calendly = calendlyUrl(slug)
const related = getRelatedPosts(slug, category)
const heroImage = `${SITE_URL}/assets/${slug}/hero.svg`
const styleHref = '/assets/exit-code-126/styles.css'
const scriptHref = '/assets/exit-code-126/script.js'
const author = {
  ...ARVIND_AUTHOR,
  role: 'Co-Founder & CEO',
  credLine: 'Kubestronaut and Kubernetes expert with 15+ years in infrastructure automation',
  linkedin: 'https://www.linkedin.com/in/arvind-rajpurohit-4a332523/',
}

const ROUTER_CSS = `
.ctxRouter{display:grid;grid-template-columns:1fr;gap:10px;margin:1.25rem 0 .5rem;}
@media(min-width:640px){.ctxRouter{grid-template-columns:1fr 1fr;}}
@media(min-width:980px){.ctxRouter{grid-template-columns:1fr 1fr 1fr;}}
.ctxCard{display:block;padding:14px 16px;border:1px solid #e4e4e7;border-radius:12px;background:#fff;text-decoration:none;transition:border-color .15s ease,box-shadow .15s ease,transform .15s ease;}
.ctxCard:hover{border-color:#c4b5fd;box-shadow:0 8px 24px rgba(9,9,11,.06);transform:translateY(-1px);}
.ctxCard b{display:block;color:#18181b;font-size:.95rem;}
.ctxCard>span{display:block;color:#52525b;font-size:.83rem;line-height:1.45;margin:3px 0 9px;}
.ctxCard code{display:inline-block;font-size:.74rem;color:#7c3aed;background:#f5f3ff;padding:2px 8px;border-radius:6px;}
`

const faq = [
  {
    q: 'What does code=exited, status=1/failure mean?',
    a: 'It is how systemd reports that a service process ended on its own with a non-zero exit code, in this case exit code 1. code=exited means the process was not killed by a signal, it returned an error itself. status=1/failure is the exit code and its label. The number is generic, so the actual reason is in the service log, which you read with journalctl.',
  },
  {
    q: 'What does status=1/failure actually tell me?',
    a: 'Very little on its own. Exit code 1 is the catch-all "something went wrong" code, so status=1/failure only confirms the process failed, not why. The real cause, a config syntax error, a port already in use, a permission problem, or a missing file, is printed by the program in the journal just above the systemd failure line.',
  },
  {
    q: 'How do I fix code=exited, status=1/failure?',
    a: 'Run journalctl -xeu SERVICE and read the last error the program printed before it exited, which is the real cause. Then fix that specific problem: validate the config (nginx -t, apachectl configtest), free the port, correct file permissions or the ExecStart path, and start the service again. Do not just restart in a loop; the exit code will stay 1 until the underlying error is fixed.',
  },
  {
    q: 'What is the journalctl command to see why a service failed?',
    a: 'Use journalctl -xeu SERVICE (for example journalctl -xeu docker). The -u filters to that unit, -e jumps to the end, and -x adds explanatory help text. journalctl -u SERVICE -n 80 --no-pager also works well for grabbing the last 80 lines. Read upward from the "Failed with result exit-code" line to the program error above it.',
  },
  {
    q: 'Why does docker.service fail with code=exited, status=1/failure?',
    a: 'The dockerd process started and then exited 1. The most common causes are an invalid /etc/docker/daemon.json (bad JSON stops the daemon), a storage-driver or overlay problem, a port or socket already in use, or a corrupted state directory. Run journalctl -xeu docker, and try running dockerd in the foreground to see the exact error it prints.',
  },
  {
    q: 'Nginx, Apache, or MySQL will not start with status=1/failure. What do I check?',
    a: 'Validate the config first: nginx -t for nginx, apachectl configtest or httpd -t for Apache. For a web server, check whether port 80 or 443 is already taken with ss -ltnp. For MySQL or MariaDB, check the data directory ownership and disk space and read /var/log/mysql/error.log. Each of these prints a specific error that the generic status=1/failure hides.',
  },
  {
    q: 'What is the difference between code=exited and code=killed?',
    a: 'code=exited means the process chose to exit and returned an exit code, so status=1/failure is your own program failing. code=killed means the kernel or systemd terminated it with a signal, for example code=killed, signal=KILL is often an out-of-memory kill, and signal=SEGV is a segmentation fault. The two point at very different root causes.',
  },
  {
    q: 'What does exit code 1 mean in general?',
    a: 'Exit code 1 is the conventional "general error" status. Unlike specific codes, it does not identify the problem: 0 is success, 2 is shell misuse, 126 means found but not executable, 127 means command not found, and 128 plus N means killed by signal N (137 is an OOM or SIGKILL, 139 is a segfault). A bare 1 always requires reading the actual error message.',
  },
  {
    q: 'What does exit code 1 mean in Docker or Kubernetes?',
    a: 'It means the main process inside the container exited with code 1, an application error rather than an infrastructure kill. In Docker, docker inspect shows the exit code and docker logs shows why. In Kubernetes it appears as a container that keeps restarting into CrashLoopBackOff with Exit Code 1; read kubectl logs POD --previous to see the application error, and note this is different from 137 (OOMKilled).',
  },
  {
    q: 'What does "Error: Process completed with exit code 1" mean in GitHub Actions?',
    a: 'The runner is reporting that the command in that step exited 1. The wrapper does not define the error; the failing tool does. Scroll up in the step log to the last real error, for example a failed test, a compilation error (exit status 1), or a lint failure, and fix that. The exit code 1 is just the runner passing along the child process result.',
  },
  {
    q: 'What does "active: failed (result: exit-code)" mean?',
    a: 'It is the systemd unit summary that accompanies code=exited, status=1/failure. result: exit-code means the unit failed because a process returned a non-zero exit status, as opposed to result: signal, result: timeout, or result: oom-kill. It confirms the failure category and points you to the journal for the specific exit code and message.',
  },
  {
    q: 'What does "id returned 1 exit status" or "ld returned 1 exit status" mean?',
    a: 'It is a linker error from gcc or g++ (Dev-C++ shows it as "Id returned 1 exit status"). The compiler finished, but the linker failed, so nothing built. The real reason is the line just above it, usually "undefined reference to ...", which means a missing source file, a library you forgot to link with -l, or a missing main() function. Fix that reference and it links.',
  },
  {
    q: 'On Render it says "exited with status 1 while running your code". How do I fix it?',
    a: 'Your app or build command on Render exited with code 1, an application error rather than a Render fault. Open the deploy or runtime log and read the real error above that line: a missing environment variable, a wrong start command, a package that failed to install, or a runtime version mismatch. Reproduce it locally by running the exact same start or build command, fix the underlying error, and redeploy.',
  },
]

const howToSteps = [
  { name: 'Read the journal', text: 'Run journalctl -xeu SERVICE and find the last error the program printed before systemd reported the failure.' },
  { name: 'Identify the real cause', text: 'Classify it: config syntax error, port already in use, permission denied, missing ExecStart path, or an application error.' },
  { name: 'Validate and fix', text: 'Validate config (nginx -t, apachectl configtest), free the port, fix permissions or the ExecStart path, then correct the specific problem.' },
  { name: 'Restart and confirm', text: 'systemctl restart SERVICE and confirm Active: active (running); the exit code stays 1 until the underlying error is fixed.' },
]

const blogPosting = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: title,
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
    logo: { '@type': 'ImageObject', url: `${SITE_URL}/logos/alertmend-logo.svg` },
  },
  mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map((item) => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: item.a } })),
}

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to fix code=exited, status=1/failure in systemd',
  description,
  step: howToSteps.map((step, index) => ({ '@type': 'HowToStep', position: index + 1, name: step.name, text: step.text })),
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
        <p>Previously DevOps Team Lead at Roambee and Customer Success Engineer at Shoreline.io (acquired by NVIDIA), he has helped teams improve uptime, reduce cloud cost, and eliminate manual operations work. At AlertMend, Arvind focuses on safe autonomous remediation for systemd services, Kubernetes, VMs, and production reliability incidents.</p>
      </div>
      <a class="authorBioLink" href="${author.linkedin}" target="_blank" rel="noopener noreferrer" aria-label="${esc(author.name)} on LinkedIn">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zM8.34 18V9.94H5.67V18h2.67zM7 8.76a1.55 1.55 0 1 0 0-3.1 1.55 1.55 0 0 0 0 3.1zM18.34 18v-4.42c0-2.37-1.27-3.47-2.96-3.47-1.36 0-1.97.75-2.31 1.28V9.94h-2.67V18h2.67v-4.5c0-.24.02-.48.09-.65.19-.48.63-.98 1.36-.98.96 0 1.35.73 1.35 1.8V18h2.82z"/></svg>
        <span>LinkedIn</span>
      </a>
    </div>
  </section>`
}

const content = `
${buildCredArticleHeader(h1, publishedDate, category, author)}
<div class="proofStrip" aria-label="Article verification">
  <strong>✓ Verified against systemd, journalctl, Docker, and the service docs for nginx, Apache, and MySQL</strong>
  <span class="dot">•</span>
  <span>Last reviewed ${modifiedDate}</span>
</div>

<article class="ec126 codeexited">
  <section class="answerPanel" id="answer">
    <div class="answerGrid">
      <div class="tenSecond">
        <span class="eyebrow">The 10-second answer</span>
        <h2>status=1/failure is generic. The real error is in the journal.</h2>
        <p><strong>code=exited, status=1/failure</strong> means a systemd service process exited on its own with exit code 1. The number only says "it failed", not why. Read the journal, and the actual cause, a bad config, a taken port, a permission problem, is one screen up.</p>
        <div class="quickCommandStack" aria-label="First commands to run">
          <div class="quickCommand"><code>systemctl status SERVICE</code><span>state + last lines</span></div>
          <div class="quickCommand"><code>journalctl -xeu SERVICE</code><span>the real error</span></div>
          <div class="quickCommand"><code>journalctl -u SERVICE -n 80 --no-pager</code><span>last 80 lines</span></div>
          <div class="quickCommand"><code>systemctl cat SERVICE</code><span>check ExecStart</span></div>
        </div>
      </div>
      <div class="signalCard" aria-label="systemd failure diagnostic flow">
        <div class="terminalWindow">
          <div class="terminalChrome"><span></span><span></span><span></span></div>
          <div class="terminalBody">
            <div><span class="muted">$</span> systemctl status docker</div>
            <div class="error">Active: failed (result: exit-code)</div>
            <div>Process: 8123 ExecStart=/usr/bin/dockerd</div>
            <div class="error">   (code=exited, status=1/FAILURE)</div>
          </div>
        </div>
        <div class="flowRail">
          <div class="flowNode"><strong>Exited 1</strong><span>process, not signal</span></div>
          <div class="flowArrow">→</div>
          <div class="flowNode"><strong>Journal</strong><span>the real error</span></div>
          <div class="flowArrow">→</div>
          <div class="flowNode"><strong>Fix</strong><span>that specific cause</span></div>
        </div>
      </div>
    </div>
  </section>

  <section class="sectionBlock" id="pick" style="margin-top:1.5rem;">
    <h2 class="sectionTitle">Where did you see it?</h2>
    <p class="bodyText">The same "exited with code 1" turns up in systemd, Docker, CI, a compiler, or a PaaS deploy. The rule never changes: <strong>exit code 1 is generic, so the real error is printed right next to it, not in the number.</strong> Jump to your situation and the command that surfaces the real error.</p>
    <div class="ctxRouter" aria-label="Pick your context">
      <a class="ctxCard" href="#journal"><b>A systemd service</b><span>nginx, docker, mysql, or apache will not start</span><code>journalctl -xeu NAME</code></a>
      <a class="ctxCard" href="#containers"><b>A Docker container</b><span>the container exits immediately</span><code>docker logs NAME</code></a>
      <a class="ctxCard" href="#containers"><b>A Kubernetes pod</b><span>CrashLoopBackOff with exit code 1</span><code>kubectl logs POD --previous</code></a>
      <a class="ctxCard" href="#ci"><b>A CI / CD build</b><span>"process completed with exit code 1"</span><code>read the failing step</code></a>
      <a class="ctxCard" href="#program"><b>A command or compiler</b><span>a script, gcc, python, or node exited 1</span><code>run it directly</code></a>
      <a class="ctxCard" href="#ci"><b>A Render or PaaS deploy</b><span>"exited with status 1 while running your code"</span><code>read the deploy log</code></a>
    </div>
  </section>

  <nav class="tocPills" aria-label="On this page">
    <a href="#pick">Where you saw it</a>
    <a href="#meaning">Meaning</a>
    <a href="#journal">Read the journal</a>
    <a href="#decoder">By service</a>
    <a href="#causes">Fix checklist</a>
    <a href="#exit1">Exit code 1</a>
    <a href="#program">A command or script</a>
    <a href="#containers">Docker &amp; Kubernetes</a>
    <a href="#ci">CI, PaaS &amp; builds</a>
    <a href="#alertmend">Automate it</a>
    <a href="#faq">FAQ</a>
  </nav>

  <section class="sectionBlock" id="meaning">
    <h2 class="sectionTitle">What code=exited, status=1/failure means</h2>
    <p class="bodyText">When a unit fails, systemd summarizes it as <code>Active: failed (result: exit-code)</code> and prints the process line <code>code=exited, status=1/FAILURE</code>. Two things matter here. <strong>code=exited</strong> means the process ended by itself and returned a code, it was not killed by a signal. <strong>status=1</strong> is that exit code, and 1 is the generic "general error" value. So this message tells you the service failed, but deliberately does not tell you why. That is the journal's job.</p>
    <div class="answerBox">
      <strong>TL;DR:</strong> do not act on the number. status=1/failure is the same for a typo in a config file, a port conflict, and a missing directory. Read the program's own error in <code>journalctl -xeu</code> and fix that.
    </div>
    <p class="bodyText">The <code>result:</code> field is the useful classifier. It tells you which family of failure you are in before you even open the log.</p>
    <div class="comparisonTableWrap">
      <table class="comparisonTable">
        <thead>
          <tr><th>result</th><th>systemd shows</th><th>What happened</th><th>First move</th></tr>
        </thead>
        <tbody>
          <tr>
            <td data-label="result"><strong>exit-code</strong></td>
            <td data-label="shows"><code>code=exited, status=1/failure</code></td>
            <td data-label="happened">The process exited non-zero on its own.</td>
            <td data-label="move">Read the app error in journalctl (this page).</td>
          </tr>
          <tr>
            <td data-label="result"><strong>signal</strong></td>
            <td data-label="shows"><code>code=killed, signal=SEGV</code></td>
            <td data-label="happened">Killed by a signal, a crash or an external kill.</td>
            <td data-label="move">Check for a segfault or an external stop.</td>
          </tr>
          <tr>
            <td data-label="result"><strong>oom-kill</strong></td>
            <td data-label="shows"><code>code=killed, signal=KILL</code></td>
            <td data-label="happened">The kernel killed it for using too much memory.</td>
            <td data-label="move">Check dmesg and raise or bound memory.</td>
          </tr>
          <tr>
            <td data-label="result"><strong>timeout</strong></td>
            <td data-label="shows"><code>timeout</code></td>
            <td data-label="happened">It did not start or stop within the time limit.</td>
            <td data-label="move">Fix the hang or raise TimeoutStartSec.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <section class="sectionBlock" id="journal">
    <h2 class="sectionTitle">The journal is where the answer already is</h2>
    <p class="bodyText">The single most common mistake is restarting the service and rereading the same generic failure line. The fix is to read what the program itself said just before it exited. <code>journalctl -xeu SERVICE</code> shows exactly that, with <code>-u</code> filtering to the unit, <code>-e</code> jumping to the end, and <code>-x</code> adding help text.</p>
    <div class="snippetBox"><span class="dim">$ journalctl -xeu nginx</span>
nginx[4412]: <span class="bad">nginx: [emerg] bind() to 0.0.0.0:80 failed (98: Address already in use)</span>
nginx[4412]: nginx: configuration file /etc/nginx/nginx.conf test failed
systemd[1]: nginx.service: Main process exited, <span class="bad">code=exited, status=1/FAILURE</span>
systemd[1]: nginx.service: Failed with result 'exit-code'.</div>
    <div class="answerBox"><strong>Read it bottom-up:</strong> the last two lines are systemd's generic verdict. The line that matters is the one above them, from the program itself: <code>bind() to 0.0.0.0:80 failed (Address already in use)</code>. That is the real bug. status=1/failure was just the messenger.</div>
  </section>

  <section class="decoderCard" id="decoder" aria-labelledby="decoder-title">
    <div class="decoderHeader">
      <div>
        <span class="eyebrow">Interactive decoder</span>
        <h2 id="decoder-title">Same failure line, different service</h2>
        <p>Pick the service that failed. status=1/failure looks identical for all of them; the cause and the fix do not.</p>
      </div>
      <span class="decoderBadge">No log upload</span>
    </div>
    <div class="decoderTabs" role="tablist" aria-label="Service cases">
      <button class="decoderTab" type="button" data-case="docker" role="tab" aria-selected="true">docker</button>
      <button class="decoderTab" type="button" data-case="nginx" role="tab" aria-selected="false">nginx</button>
      <button class="decoderTab" type="button" data-case="apache" role="tab" aria-selected="false">apache / httpd</button>
      <button class="decoderTab" type="button" data-case="mysql" role="tab" aria-selected="false">mysql / mariadb</button>
    </div>

    <div class="decoderPanel isActive" id="case-docker" role="tabpanel">
      <div class="snippetBox"><span class="dim">$ journalctl -xeu docker</span>
dockerd[8123]: <span class="bad">unable to configure the Docker daemon with file /etc/docker/daemon.json: invalid character</span>
systemd[1]: docker.service: Main process exited, code=exited, <span class="bad">status=1/FAILURE</span></div>
      <div class="interpretCard">
        <span class="eyebrow">Interpretation</span>
        <h3>dockerd read a broken daemon.json and refused to start.</h3>
        <p>Invalid JSON in <code>/etc/docker/daemon.json</code> is the classic cause, followed by storage-driver and socket problems. Run the daemon in the foreground to see the exact error.</p>
        <div class="miniCommand">sudo dockerd --debug            # run in foreground, read the error
python3 -m json.tool /etc/docker/daemon.json   # validate the JSON
sudo ss -ltnp | grep -E ':2375|docker'          # port/socket in use</div>
        <p class="fixLine"><strong>Fix:</strong> correct the JSON syntax in <code>daemon.json</code> (or move it aside), fix the storage driver, then <code>systemctl restart docker</code>.</p>
      </div>
    </div>

    <div class="decoderPanel" id="case-nginx" role="tabpanel">
      <div class="snippetBox"><span class="dim">$ nginx -t</span>
<span class="bad">nginx: [emerg] bind() to 0.0.0.0:80 failed (98: Address already in use)</span>
nginx: configuration file /etc/nginx/nginx.conf test failed</div>
      <div class="interpretCard">
        <span class="eyebrow">Interpretation</span>
        <h3>A config error or a taken port stopped nginx.</h3>
        <p>Two dominant causes: a syntax or path error in the config, or port 80/443 already held by another process (often Apache or a stale nginx).</p>
        <div class="miniCommand">sudo nginx -t                    # validate config, see the exact line
sudo ss -ltnp | grep -E ':80|:443'   # who holds the port
sudo systemctl restart nginx</div>
        <p class="fixLine"><strong>Fix:</strong> resolve the line <code>nginx -t</code> names, or stop whatever owns the port, then restart.</p>
      </div>
    </div>

    <div class="decoderPanel" id="case-apache" role="tabpanel">
      <div class="snippetBox"><span class="dim">$ apachectl configtest       # or: httpd -t</span>
<span class="bad">AH00526: Syntax error on line 12 of /etc/apache2/sites-enabled/site.conf</span>
<span class="bad">(98)Address already in use: AH00072: make_sock: could not bind to address 0.0.0.0:80</span></div>
      <div class="interpretCard">
        <span class="eyebrow">Interpretation</span>
        <h3>apache2 or httpd failed its config test or could not bind.</h3>
        <p>On RHEL and Fedora the unit is <code>httpd.service</code>; on Debian and Ubuntu it is <code>apache2.service</code>. SELinux can also block a non-standard port or docroot.</p>
        <div class="miniCommand">sudo apachectl configtest        # Debian/Ubuntu
sudo httpd -t                     # RHEL/Fedora
sudo ss -ltnp | grep ':80'
sudo journalctl -xeu apache2      # or httpd</div>
        <p class="fixLine"><strong>Fix:</strong> correct the named config line, free port 80, and on RHEL check SELinux with <code>ausearch -m avc</code> if the config is valid but it still fails.</p>
      </div>
    </div>

    <div class="decoderPanel" id="case-mysql" role="tabpanel">
      <div class="snippetBox"><span class="dim">$ journalctl -xeu mysql        # or mariadb / mysqld</span>
mysqld[6001]: <span class="bad">[ERROR] InnoDB: Cannot open datafile './ibdata1'</span>
mysqld[6001]: <span class="bad">[ERROR] Aborting</span>
systemd[1]: mysql.service: Main process exited, code=exited, <span class="bad">status=1/FAILURE</span></div>
      <div class="interpretCard">
        <span class="eyebrow">Interpretation</span>
        <h3>The database aborted during startup.</h3>
        <p>Usual causes: wrong ownership on the data directory, a full disk, a corrupt InnoDB file, or port 3306 already in use. The real error is in the MySQL error log, not the systemd line.</p>
        <div class="miniCommand">sudo tail -n 40 /var/log/mysql/error.log
ls -ld /var/lib/mysql            # should be owned by mysql:mysql
df -h /var/lib/mysql             # is the disk full?
sudo ss -ltnp | grep ':3306'</div>
        <p class="fixLine"><strong>Fix:</strong> restore ownership (<code>chown -R mysql:mysql /var/lib/mysql</code>), free disk space, or recover the corrupt table, then restart.</p>
      </div>
    </div>
  </section>

  <section class="sectionBlock" id="causes">
    <h2 class="sectionTitle">The fix checklist: what status=1/failure is usually hiding</h2>
    <p class="bodyText">Across services, the error in the journal almost always maps to one of these. Match the message to the row.</p>
    <div class="fixTableWrap">
      <table class="fixTable">
        <thead>
          <tr><th>Message in the journal</th><th>Real cause</th><th>Confirm with</th><th>Safe fix</th></tr>
        </thead>
        <tbody>
          <tr>
            <td data-label="Message"><code>syntax error</code>, <code>[emerg]</code>, <code>unexpected</code></td>
            <td data-label="Cause">Bad config file.</td>
            <td data-label="Confirm"><code>nginx -t</code>, <code>apachectl configtest</code>, validate JSON/YAML</td>
            <td data-label="Fix">Fix the named line, then reload.</td>
          </tr>
          <tr>
            <td data-label="Message"><code>Address already in use</code>, <code>bind() failed</code></td>
            <td data-label="Cause">Port already taken.</td>
            <td data-label="Confirm"><code>ss -ltnp | grep :PORT</code></td>
            <td data-label="Fix">Stop the other process or change the port.</td>
          </tr>
          <tr>
            <td data-label="Message"><code>Permission denied</code>, <code>cannot open</code></td>
            <td data-label="Cause">File/dir permissions or SELinux.</td>
            <td data-label="Confirm"><code>ls -l</code>, <code>ausearch -m avc</code></td>
            <td data-label="Fix">Fix ownership/mode, or the SELinux context.</td>
          </tr>
          <tr>
            <td data-label="Message"><code>No such file or directory</code></td>
            <td data-label="Cause">Wrong ExecStart path or missing dependency file.</td>
            <td data-label="Confirm"><code>systemctl cat SERVICE</code></td>
            <td data-label="Fix">Correct the ExecStart path or install what is missing.</td>
          </tr>
          <tr>
            <td data-label="Message">Exits instantly, no clear error</td>
            <td data-label="Cause">App fails fast on bad env or arguments.</td>
            <td data-label="Confirm">Run the ExecStart command by hand in a shell.</td>
            <td data-label="Fix">Fix the environment, arguments, or the app error.</td>
          </tr>
          <tr>
            <td data-label="Message"><code>disk full</code>, <code>No space left</code></td>
            <td data-label="Cause">Filesystem is full.</td>
            <td data-label="Confirm"><code>df -h</code></td>
            <td data-label="Fix">Reclaim space, then restart the service.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <section class="sectionBlock" id="exit1">
    <h2 class="sectionTitle">What exit code 1 means, and what it does not</h2>
    <p class="bodyText">The <code>1</code> in status=1/failure is the same exit code 1 you see everywhere: a shell command, a script, a build. It is the conventional "general error" value, which is exactly why it is unhelpful on its own. Knowing its neighbours helps you tell a generic app error from a more specific failure.</p>
    <div class="comparisonTableWrap">
      <table class="comparisonTable">
        <thead>
          <tr><th>Exit code</th><th>Meaning</th></tr>
        </thead>
        <tbody>
          <tr><td data-label="Code"><strong>0</strong></td><td data-label="Meaning">Success.</td></tr>
          <tr><td data-label="Code"><strong>1</strong></td><td data-label="Meaning">General, unspecified error (this one). Read the message.</td></tr>
          <tr><td data-label="Code"><strong>2</strong></td><td data-label="Meaning">Misuse of a shell builtin, or bad arguments.</td></tr>
          <tr><td data-label="Code"><strong>126</strong></td><td data-label="Meaning">Command found but not executable.</td></tr>
          <tr><td data-label="Code"><strong>127</strong></td><td data-label="Meaning">Command not found.</td></tr>
          <tr><td data-label="Code"><strong>128 + N</strong></td><td data-label="Meaning">Killed by signal N: 137 = SIGKILL/OOM, 139 = SIGSEGV.</td></tr>
        </tbody>
      </table>
    </div>
    <div class="answerBox"><strong>Key point:</strong> a systemd service showing status=1/failure is failing at the application layer, not being killed by the system. If you instead see status=137 or a signal, that is a different investigation (memory or a crash).</div>
  </section>

  <section class="sectionBlock" id="program">
    <h2 class="sectionTitle">A command, script, or compiler that exited 1</h2>
    <p class="bodyText">When a command, build, or wrapper reports exit status 1, it is passing along the failure of whatever it ran. The universal move is to run the failing thing directly and read the real error printed just above the "exit status 1" line.</p>
    <div class="stepsGrid">
      <div class="stepCard">
        <span>1</span>
        <h3>Run it directly</h3>
        <p>make, npm, and CI steps hide the output. Run the exact underlying command in your own shell and read its real stderr, not the wrapper's exit code.</p>
      </div>
      <div class="stepCard">
        <span>2</span>
        <h3>gcc / g++: ld returned 1 exit status</h3>
        <p><code>collect2: error: ld returned 1 exit status</code> (Dev-C++ shows "Id returned 1 exit status") is a linker failure. The real cause is the <code>undefined reference</code> line above it: a missing source file, a missing <code>-l</code> library, or no <code>main()</code>.</p>
      </div>
      <div class="stepCard">
        <span>3</span>
        <h3>Python: returned non-zero exit status 1</h3>
        <p><code>subprocess.CalledProcessError: returned non-zero exit status 1</code> means the command you called failed. Run that command by itself, or capture and print its stderr, to see the real error.</p>
      </div>
      <div class="stepCard">
        <span>4</span>
        <h3>Node: child process exited with code 1</h3>
        <p>A spawned child failed. Do not just check the exit code; pipe or log the child's stderr so you can read the message it printed before exiting.</p>
      </div>
    </div>
    <div class="answerBox"><strong>make users:</strong> <code>make: *** [target] Error 1</code> is make reporting that a recipe command exited 1. The real error is the compiler or shell output above that line, not make itself.</div>
  </section>

  <section class="sectionBlock" id="containers">
    <h2 class="sectionTitle">Exit code 1 in Docker and Kubernetes</h2>
    <p class="bodyText">The same "exited 1" shows up in containers, just phrased differently. It still means the main process returned a general error, not that the platform killed it.</p>
    <div class="stepsGrid">
      <div class="stepCard">
        <span>1</span>
        <h3>Docker</h3>
        <p><code>docker inspect --format '{{.State.ExitCode}}' CID</code> shows 1, and <code>docker logs CID</code> shows the application error that caused it.</p>
      </div>
      <div class="stepCard">
        <span>2</span>
        <h3>Kubernetes</h3>
        <p>A pod restarts into <strong>CrashLoopBackOff</strong> with Exit Code 1. Read <code>kubectl logs POD --previous</code> for the real error.</p>
      </div>
      <div class="stepCard">
        <span>3</span>
        <h3>Not the same as 137</h3>
        <p>Exit 1 is an app error you can fix in the app. Exit 137 (OOMKilled) means raise the memory limit or reduce usage instead.</p>
      </div>
      <div class="stepCard">
        <span>4</span>
        <h3>Docker running as a service</h3>
        <p>If <code>docker.service</code> itself is status=1/failure, that is the daemon, not your container. Use the docker tab in the decoder above.</p>
      </div>
    </div>
  </section>

  <section class="sectionBlock" id="ci">
    <h2 class="sectionTitle">CI, PaaS deploys, and build tools: exit status 1</h2>
    <p class="bodyText">You may meet exit code 1 as <strong>Error: Process completed with exit code 1</strong> in CI, <strong>exited with status 1 while running your code</strong> on a PaaS like Render, <strong>compilation error: exit status 1</strong>, or <strong>command terminated with exit code 1</strong>. These wrappers do not define the error; they report the tool or app that failed underneath.</p>
    <div class="answerBox"><strong>GitHub Actions:</strong> the runner passes along the child exit code. Scroll up in the step to the last real error, a failed test, a lint failure, or a compiler error, and fix that, not the runner message.</div>
    <div class="answerBox"><strong>Render and other PaaS:</strong> "exited with status 1 while running your code" (or "while building your code") means your start or build command exited 1, an application error, not a platform fault. Read the deploy log above that line for the real cause: a missing environment variable, a wrong start command, a failed install, or a runtime version mismatch. Reproduce it locally with the exact same command.</div>
    <div class="answerBox"><strong>Build tools:</strong> a Next.js build worker, a Go or Rust compile, or a bundler that exits 1 printed the real error just above. <code>exit status 1</code> from a compiler almost always has the file and line right before it.</div>
  </section>

  <section class="sectionBlock" id="alertmend">
    <h2 class="sectionTitle">Automate the response: from failed service to the real cause</h2>
    <p class="bodyText">A human fixes status=1/failure quickly once they read the journal. The slow part in production is noticing the service is down, pulling the right log, and separating the generic systemd line from the real application error, often at 2 a.m. That is the repetitive work worth automating.</p>
    <div class="alertmendFlow">
      <h3>AlertMend detection and recovery flow</h3>
      <p>AlertMend watches unit state, reads the journal, extracts the real error, and runs a governed recovery.</p>
      <div class="recoveryTrack">
        <div class="recoveryStep"><strong>Detect</strong><span>Unit failed (result: exit-code), restart count climbing, service and host, and the recent change.</span></div>
        <div class="recoveryArrow">→</div>
        <div class="recoveryStep"><strong>Read</strong><span>Pull journalctl -xeu and lift the program's real error above the generic status=1/failure line.</span></div>
        <div class="recoveryArrow">→</div>
        <div class="recoveryStep"><strong>Classify</strong><span>Config error, port conflict, permission, missing path, or app error, so the alert names the cause.</span></div>
        <div class="recoveryArrow">→</div>
        <div class="recoveryStep"><strong>Recover</strong><span>Restart, roll back the change, or open a fix behind an approval gate, then confirm the unit is active.</span></div>
      </div>
    </div>
    <div class="answerBox">
      <strong>The practical goal:</strong> when a service goes to failed (result: exit-code), the on-call engineer should receive "nginx down: bind() to :80 failed, port held by apache2, restart ready to approve" in Slack or WhatsApp, not a bare "service failed" alert that sends them back to the terminal.
    </div>
    <div class="automationCta">
      <p><strong>Want this on your stack?</strong> Bring one real status=1/failure service and we will map the journal parsing, the classification, and the first safe restart or rollback runbook.</p>
      <a class="ctaButton ctaButtonPrimary" href="${calendly}&intent=automation-review" target="_blank" rel="noopener noreferrer">Book a 20-min automation review →</a>
    </div>
  </section>

  <section class="sectionBlock" id="sources">
    <h2 class="sectionTitle">Primary sources checked</h2>
    <p class="bodyText">The behavior above is based on primary documentation and real service output.</p>
    <ol class="sourceList">
      <li><a href="https://www.freedesktop.org/software/systemd/man/latest/systemctl.html" target="_blank" rel="noopener noreferrer">systemd docs: systemctl and unit result codes</a></li>
      <li><a href="https://www.freedesktop.org/software/systemd/man/latest/journalctl.html" target="_blank" rel="noopener noreferrer">systemd docs: journalctl</a></li>
      <li><a href="https://tldp.org/LDP/abs/html/exitcodes.html" target="_blank" rel="noopener noreferrer">Advanced Bash Scripting Guide: exit codes with special meanings</a></li>
      <li><a href="https://docs.docker.com/config/daemon/" target="_blank" rel="noopener noreferrer">Docker docs: configure and troubleshoot the daemon</a></li>
      <li><a href="https://kubernetes.io/docs/tasks/debug/debug-application/debug-running-pod/" target="_blank" rel="noopener noreferrer">Kubernetes docs: debug running pods</a></li>
    </ol>
  </section>

  <section class="sectionBlock" id="faq">
    <h2 class="sectionTitle">code=exited, status=1/failure FAQ</h2>
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
    <h2>Turn "service failed" alerts into the real root cause</h2>
    <p>AlertMend watches systemd units, reads journalctl the moment a service fails, lifts the real error above the generic status=1/failure line, and routes an approved restart or rollback across VMs, containers, and Kubernetes.</p>
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
  <meta name="author" content="${esc(author.name)}">
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
  <link rel="stylesheet" href="${styleHref}">
  <style>${CHROME_INLINE_CSS}${AUTHOR_CRED_CSS}${ROUTER_CSS}</style>
</head>
<body>
${buildNavHtml(slug, calendly)}
  <div class="main-container">
    <div class="content-wrapper">
      <div class="main-col">
        ${content}
        <div class="promo">
          <p>Ready to eliminate manual firefighting and achieve autonomous infrastructure operations?</p>
          <p>See how AlertMend AI reads journals, classifies the real cause, and automates safe remediation across systemd services, Kubernetes, and VMs. <a href="${calendly}" target="_blank" rel="noopener noreferrer">Book a demo. →</a></p>
        </div>
      </div>
      ${buildSidebarHtml(related, title)}
    </div>
  </div>
  <script src="${scriptHref}"></script>
  <script>${BLOG_SIGNUP_HANDLER_JS}</script>
</body>
</html>`

const heroSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"><defs><linearGradient id="hg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0b1220"/><stop offset="1" stop-color="#231a05"/></linearGradient></defs><rect width="1200" height="630" fill="url(#hg)"/><g transform="translate(80,80)"><circle cx="22" cy="22" r="22" fill="#f59e0b"/><text x="22" y="30" font-size="22" font-weight="800" fill="#111" text-anchor="middle">A</text><text x="56" y="30" font-size="24" font-weight="700" fill="#fff">AlertMend</text><text x="228" y="30" font-size="18" fill="#d6b877">· troubleshooting</text></g><text x="80" y="238" font-size="52" font-weight="800" fill="#fff">code=exited, status=1/failure</text><text x="80" y="300" font-size="30" font-weight="700" fill="#fbbf24">Fix a systemd service that will not start.</text><g font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="18"><rect x="80" y="352" width="1040" height="166" rx="14" fill="#161616" stroke="#3a3320"/><text x="106" y="388" fill="#fca5a5">Active: failed (result: exit-code)</text><text x="106" y="422" fill="#e6d6a8">Process: ExecStart=/usr/bin/dockerd (code=exited, status=1/FAILURE)</text><text x="106" y="462" fill="#7dd3fc">$ journalctl -xeu docker</text><text x="106" y="496" fill="#d1d5db">the real error is one line up, not in status=1</text></g><text x="80" y="566" font-size="19" fill="#d6b877">alertmend.io · read the journal, fix the real cause, automate the recovery</text></svg>\n`

const assetDir = path.join(root, 'public/assets', slug)
fs.mkdirSync(assetDir, { recursive: true })
fs.writeFileSync(path.join(assetDir, 'hero.svg'), heroSvg)

fs.writeFileSync(path.join(root, 'public/blog', `${slug}.md`), `---
title: "${title}"
excerpt: "${description}"
date: "${publishedDate}"
dateModified: "${modifiedDate}"
category: "${category}"
author: "${author.name}"
keywords: "${keywords}"
---

This post is published as a standalone page at [/blog/${slug}](/blog/${slug}).
`)

writeStaticBlogOutputs(slug, html)
const tl = title.length + 15
console.log(`✓ ${slug}  title+suffix ${tl}${tl < 30 || tl > 60 ? ' [LEN!]' : ''}  desc ${description.length}  faqs ${faq.length}`)
