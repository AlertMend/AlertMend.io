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

const slug = 'sigsegv-error'
const title = 'SIGSEGV Error (Signal 11): Causes and Fixes'
const h1 = 'SIGSEGV (Signal 11): Why Your Program Segfaults and How to Fix It'
const description = 'SIGSEGV (signal 11) is a segmentation fault. Debug it with gdb, AddressSanitizer, and core dumps, and fix exit code 139 in Docker and Kubernetes.'
const publishedDate = '2025-12-15'
const modifiedDate = '2026-07-15'
const category = 'Troubleshooting'
const keywords = 'sigsegv, signal 11, segmentation fault, segfault, exit code 139, sigsegv error, segmentation fault core dumped, sigsegv docker, sigsegv kubernetes, exit code 139 kubernetes, gdb segfault, addresssanitizer, null pointer dereference, use after free'
const canonical = `${SITE_URL}/blog/${slug}`
const calendly = calendlyUrl(slug)
const related = getRelatedPosts(slug, category)
const heroImage = `${SITE_URL}/assets/${slug}/sigsegv-hero.svg`
// Reuse the proven exit-code-126 error-post stylesheet and interactive JS (decoder tabs + FAQ toggles)
const styleHref = '/assets/exit-code-126/styles.css'
const scriptHref = '/assets/exit-code-126/script.js'
const author = {
  ...ARVIND_AUTHOR,
  role: 'Co-Founder & CEO',
  credLine: 'Kubestronaut and Kubernetes expert with 15+ years in infrastructure automation',
  linkedin: 'https://www.linkedin.com/in/arvind-rajpurohit-4a332523/',
}

const faq = [
  {
    q: 'What is a SIGSEGV error?',
    a: 'SIGSEGV is signal 11, a segmentation fault. The operating system sends it to a process that tried to read or write a memory address it is not allowed to touch, such as a null pointer or memory outside an allocation. The kernel terminates the process to protect the rest of the system, usually printing "Segmentation fault (core dumped)".',
  },
  {
    q: 'What is exit code 139?',
    a: 'Exit code 139 is how a shell or container reports a process killed by SIGSEGV. The convention is 128 plus the signal number, and SIGSEGV is signal 11, so 128 + 11 = 139. If you see exit code 139 in Docker, Kubernetes, or CI, the program segfaulted.',
  },
  {
    q: 'What causes a segmentation fault?',
    a: 'The common causes are dereferencing a null or uninitialized pointer, reading or writing past the end of an array or buffer, using memory after it was freed (a dangling pointer), infinite or very deep recursion that overflows the stack, and writing to read-only memory such as a string literal. In managed languages a segfault usually points at a bug in a native extension.',
  },
  {
    q: 'How do I debug a SIGSEGV error?',
    a: 'Enable core dumps with ulimit -c unlimited, reproduce the crash, then open the core in gdb with gdb ./app core and run bt for a backtrace to the exact faulting line. For memory bugs, rebuild with AddressSanitizer (gcc -g -fsanitize=address) or run under valgrind, which pinpoint use-after-free and out-of-bounds access with the source location.',
  },
  {
    q: 'What is the difference between exit code 139 and 137 (OOMKilled)?',
    a: 'Exit code 139 is SIGSEGV, an invalid memory access, which is a bug in the program or a native library. Exit code 137 is SIGKILL, most often an OOMKilled container that exceeded its memory limit. They look similar in a crash loop but need different fixes: 139 means debug the segfault, 137 means raise the memory limit or reduce usage.',
  },
  {
    q: 'Why does my Docker container exit with code 139?',
    a: 'The process inside the container received SIGSEGV. Beyond an ordinary application bug, a frequent container-specific cause is running an image built for a different CPU architecture under emulation (for example an amd64 image on an arm64 host, or the reverse), where native code segfaults. Check the image platform and the crashing binary, and reproduce with a debug build.',
  },
  {
    q: 'How do I fix exit code 139 in Kubernetes?',
    a: 'Find the crashing container, then read kubectl describe pod and the previous logs with kubectl logs POD --previous. Confirm the Last State shows Reason: Error and Exit Code: 139, which distinguishes a segfault from OOMKilled (137). Roll back the deploy that introduced it while you debug the binary with a core dump or an AddressSanitizer build.',
  },
  {
    q: 'Can a Python or Node program get a SIGSEGV?',
    a: 'Yes. Pure Python or JavaScript normally raises an exception rather than segfaulting, so a real SIGSEGV almost always comes from a native extension (for example a C library, numpy, or a native addon), a ctypes or FFI misuse, or recursion deep enough to overflow the C stack. In Python, enable the faulthandler module to print a traceback when the crash happens.',
  },
  {
    q: 'Why does my program only segfault sometimes, or only in a release build?',
    a: 'Because a segfault is undefined behavior, which is allowed to appear to work. A use-after-free reads fine until the freed memory is reused, an out-of-bounds read returns garbage when the next page happens to be mapped, and ASLR moves addresses every run. Optimized release builds reorder code and reuse stack slots, so an uninitialized read that was harmless in debug now faults. Make it deterministic with AddressSanitizer or MALLOC_PERTURB_.',
  },
  {
    q: 'How do I get a core dump from a container or distroless image?',
    a: 'The kernel writes cores using the host core_pattern, not the container, so setting ulimit inside the container is not enough. Check /proc/sys/kernel/core_pattern on the node; on systemd hosts use coredumpctl. For a distroless image with no shell, attach an ephemeral debug container that shares the process namespace (kubectl debug --target), and keep unstripped binaries or a debuginfo file so the backtrace has symbols instead of question marks.',
  },
  {
    q: 'What is the difference between SIGSEGV and SIGBUS?',
    a: 'SIGSEGV (signal 11) means the address itself was invalid or protected, such as a null or unmapped pointer. SIGBUS (signal 7) means the address was valid but the hardware could not complete the access, for example a misaligned access on a strict architecture, or reading past the end of a memory-mapped file after it was truncated or a tmpfs filled up. SIGBUS surfaces as exit code 135.',
  },
]

const howToSteps = [
  { name: 'Enable core dumps', text: 'Run ulimit -c unlimited and check /proc/sys/kernel/core_pattern so the kernel saves a core file when the process crashes.' },
  { name: 'Reproduce and open the core', text: 'Reproduce the SIGSEGV, then open the core in gdb with gdb ./app core and run bt for a backtrace to the faulting line.' },
  { name: 'Rebuild with a sanitizer', text: 'Rebuild with AddressSanitizer (gcc -g -fsanitize=address) or run under valgrind to locate use-after-free and out-of-bounds access.' },
  { name: 'Fix the memory bug and verify', text: 'Fix the null dereference, bounds error, or dangling pointer, then confirm the crash is gone under the sanitizer before shipping.' },
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
  name: 'How to debug a SIGSEGV segmentation fault',
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
        <p>Previously DevOps Team Lead at Roambee and Customer Success Engineer at Shoreline.io (acquired by NVIDIA), he has helped teams improve uptime, reduce cloud cost, and eliminate manual operations work. At AlertMend, Arvind focuses on safe autonomous remediation for Kubernetes, VM, storage, and production reliability incidents.</p>
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
  <strong>✓ Verified against the Linux signal(7) manual, glibc, GDB, AddressSanitizer, and Kubernetes docs</strong>
  <span class="dot">•</span>
  <span>Last reviewed ${modifiedDate}</span>
</div>

<article class="ec126 sigsegv">
  <section class="answerPanel" id="answer">
    <div class="answerGrid">
      <div class="tenSecond">
        <span class="eyebrow">The 10-second answer</span>
        <h2>SIGSEGV means: your program touched memory it does not own.</h2>
        <p><strong>SIGSEGV</strong> is signal 11, a segmentation fault. The kernel killed the process because it read or wrote an invalid or protected address. In a shell or container this shows up as <strong>exit code 139</strong> (128 + 11). Start by capturing a core dump and reading the backtrace.</p>
        <div class="quickCommandStack" aria-label="First commands to run">
          <div class="quickCommand"><code>echo $?</code><span>139 confirms SIGSEGV</span></div>
          <div class="quickCommand"><code>ulimit -c unlimited</code><span>enable core dumps</span></div>
          <div class="quickCommand"><code>gdb ./app core</code><span>then: bt</span></div>
          <div class="quickCommand"><code>dmesg | grep -i segfault</code><span>kernel fault line</span></div>
        </div>
      </div>
      <div class="signalCard" aria-label="SIGSEGV diagnostic flow">
        <div class="terminalWindow">
          <div class="terminalChrome"><span></span><span></span><span></span></div>
          <div class="terminalBody">
            <div><span class="muted">$</span> ./app</div>
            <div class="error">Segmentation fault (core dumped)</div>
            <div><span class="muted">$</span> echo $?</div>
            <div class="good">139</div>
          </div>
        </div>
        <div class="flowRail">
          <div class="flowNode"><strong>Bad access</strong><span>invalid address</span></div>
          <div class="flowArrow">→</div>
          <div class="flowNode"><strong>SIGSEGV</strong><span>signal 11</span></div>
          <div class="flowArrow">→</div>
          <div class="flowNode"><strong>Killed</strong><span>exit 139</span></div>
        </div>
      </div>
    </div>
  </section>

  <nav class="tocPills" aria-label="On this page">
    <a href="#meaning">Meaning</a>
    <a href="#faultline">Read the fault line</a>
    <a href="#decoder">Where it happens</a>
    <a href="#causes">Causes</a>
    <a href="#slippery">Why it is slippery</a>
    <a href="#debug">Debug it</a>
    <a href="#languages">By language</a>
    <a href="#containers">Docker &amp; Kubernetes</a>
    <a href="#prod-cores">Cores in production</a>
    <a href="#alertmend">Automate it</a>
    <a href="#faq">FAQ</a>
  </nav>

  <section class="sectionBlock" id="meaning">
    <h2 class="sectionTitle">What SIGSEGV and exit code 139 mean</h2>
    <p class="bodyText">A modern CPU and operating system give every process its own virtual address space, enforced by the Memory Management Unit. When a process reads or writes an address that is not mapped, or that it lacks permission for, the hardware raises a fault and the kernel delivers <strong>SIGSEGV</strong> (signal 11). The default action is to terminate the process, which is why you see <code>Segmentation fault (core dumped)</code>. This is a safety mechanism: the alternative is silent memory corruption.</p>
    <div class="answerBox">
      <strong>TL;DR:</strong> exit code 139 is not random. It always means signal 11 (SIGSEGV). The task is to find the exact line that touched bad memory, not to add a retry.
    </div>
    <p class="bodyText">When a shell, container runtime, or orchestrator reports a numeric exit code for a process killed by a signal, it uses <strong>128 + signal number</strong>. It helps to know the neighbours, because a crash loop can be any of them and each has a different fix.</p>
    <div class="comparisonTableWrap">
      <table class="comparisonTable">
        <thead>
          <tr><th>Exit code</th><th>Signal</th><th>Meaning</th><th>First move</th></tr>
        </thead>
        <tbody>
          <tr>
            <td data-label="Exit code"><strong>139</strong></td>
            <td data-label="Signal">SIGSEGV (11)</td>
            <td data-label="Meaning">Segmentation fault: invalid memory access.</td>
            <td data-label="First move">Core dump + gdb backtrace, or an AddressSanitizer build.</td>
          </tr>
          <tr>
            <td data-label="Exit code"><strong>137</strong></td>
            <td data-label="Signal">SIGKILL (9)</td>
            <td data-label="Meaning">Killed, most often OOMKilled at a memory limit.</td>
            <td data-label="First move">Check memory limit and usage, not the code first.</td>
          </tr>
          <tr>
            <td data-label="Exit code"><strong>134</strong></td>
            <td data-label="Signal">SIGABRT (6)</td>
            <td data-label="Meaning">abort(), failed assert, or glibc heap corruption check.</td>
            <td data-label="First move">Read the abort message, then the backtrace.</td>
          </tr>
          <tr>
            <td data-label="Exit code"><strong>135</strong></td>
            <td data-label="Signal">SIGBUS (7)</td>
            <td data-label="Meaning">Bad address alignment or a truncated mmap'd file.</td>
            <td data-label="First move">Check alignment and memory-mapped file sizes.</td>
          </tr>
          <tr>
            <td data-label="Exit code"><strong>136</strong></td>
            <td data-label="Signal">SIGFPE (8)</td>
            <td data-label="Meaning">Arithmetic error, typically integer divide by zero.</td>
            <td data-label="First move">Guard the divisor and integer overflow paths.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <section class="sectionBlock" id="faultline">
    <h2 class="sectionTitle">Read the one line the kernel already gave you</h2>
    <p class="bodyText">Before you reach for a debugger, the kernel usually logged a single line to the ring buffer. Reading it well answers "null or wild pointer, read or write, stack or heap" in seconds.</p>
    <div class="snippetBox"><span class="dim">$ dmesg | tail -1</span>
app[12903]: <span class="bad">segfault</span> at 0 ip 000055f6b2c0 sp 00007ffd1290 error 6 in app[556000+2000]</div>
    <div class="comparisonTableWrap">
      <table class="comparisonTable">
        <thead><tr><th>Field</th><th>What an experienced eye reads from it</th></tr></thead>
        <tbody>
          <tr><td data-label="Field"><code>at 0</code></td><td data-label="Reading">The faulting address. <code>at 0</code> is a textbook null dereference. A small value like <code>at 18</code> is a null struct pointer plus a field offset, so <code>ptr-&gt;field</code> where <code>ptr</code> is null. A giant address is a wild or corrupted pointer.</td></tr>
          <tr><td data-label="Field"><code>ip</code></td><td data-label="Reading">Instruction pointer: where the CPU was executing. Turn it into a source line without gdb: <code>addr2line -e ./app -f 0x55f6b2c0</code> (build with <code>-g</code>).</td></tr>
          <tr><td data-label="Field"><code>sp</code></td><td data-label="Reading">Stack pointer. If the faulting address sits at or just below <code>sp</code>, suspect a stack overflow from deep recursion, not a bad data pointer.</td></tr>
          <tr><td data-label="Field"><code>error 6</code></td><td data-label="Reading">A bitmask. Bit 0: 0 = page not present, 1 = protection. Bit 1: 0 = read, 1 = write. Bit 2: 1 = user mode. So <code>error 4</code> is a user read of unmapped memory, <code>error 6</code> is a user write to unmapped memory, and <code>error 7</code> is a write to read-only memory such as a string literal.</td></tr>
        </tbody>
      </table>
    </div>
  </section>

  <section class="decoderCard" id="decoder" aria-labelledby="decoder-title">
    <div class="decoderHeader">
      <div>
        <span class="eyebrow">Interactive decoder</span>
        <h2 id="decoder-title">Same signal, different context</h2>
        <p>Select where your SIGSEGV happened. The signal is the same; the evidence and the fix depend on the runtime.</p>
      </div>
      <span class="decoderBadge">No log upload</span>
    </div>
    <div class="decoderTabs" role="tablist" aria-label="SIGSEGV cases">
      <button class="decoderTab" type="button" data-case="native" role="tab" aria-selected="true">C / C++</button>
      <button class="decoderTab" type="button" data-case="managed" role="tab" aria-selected="false">Python / Node</button>
      <button class="decoderTab" type="button" data-case="docker" role="tab" aria-selected="false">Docker</button>
      <button class="decoderTab" type="button" data-case="k8s" role="tab" aria-selected="false">Kubernetes</button>
    </div>

    <div class="decoderPanel isActive" id="case-native" role="tabpanel">
      <div class="snippetBox"><span class="dim">// the classic null dereference</span>
char *p = NULL;
*p = 'x';   <span class="bad">// write through NULL -> SIGSEGV</span></div>
      <div class="interpretCard">
        <span class="eyebrow">Interpretation</span>
        <h3>Native code touched an address it should not have.</h3>
        <p>Null or uninitialized pointers, indexing past an array, and use-after-free are the usual culprits. Do not guess: a core dump names the exact line.</p>
        <div class="miniCommand">ulimit -c unlimited
./app                 # crashes, writes a core
gdb ./app core        # then, at the prompt:
(gdb) bt              # backtrace to the faulting frame</div>
        <p class="fixLine"><strong>Fix:</strong> add the missing null check or bounds check, or rebuild with <code>-fsanitize=address</code> to have the sanitizer point at the exact bad access.</p>
      </div>
    </div>

    <div class="decoderPanel" id="case-managed" role="tabpanel">
      <div class="snippetBox"><span class="dim">$ python app.py</span>
<span class="bad">Segmentation fault (core dumped)</span>
<span class="dim"># pure Python rarely segfaults on its own</span></div>
      <div class="interpretCard">
        <span class="eyebrow">Interpretation</span>
        <h3>A managed runtime segfault points at native code.</h3>
        <p>In Python or Node a real SIGSEGV almost always comes from a C extension, an FFI or ctypes misuse, or recursion deep enough to overflow the C stack. Turn on the native traceback.</p>
        <div class="miniCommand">python -X faulthandler app.py     # prints the C traceback on crash
# or inside the code:
import faulthandler; faulthandler.enable()</div>
        <p class="fixLine"><strong>Fix:</strong> update or rebuild the offending native module, correct the FFI call signature, or lower recursion depth. Reproduce against the extension in isolation.</p>
      </div>
    </div>

    <div class="decoderPanel" id="case-docker" role="tabpanel">
      <div class="snippetBox"><span class="dim">$ docker run myimage</span>
<span class="bad">Segmentation fault</span>
<span class="dim">$ docker inspect --format '{{.State.ExitCode}}' $(docker ps -lq)</span>
139</div>
      <div class="interpretCard">
        <span class="eyebrow">Interpretation</span>
        <h3>The process inside the container hit SIGSEGV.</h3>
        <p>Besides an ordinary bug, a common container cause is an image built for a different CPU architecture running under emulation, where native code segfaults. Check the platform and reproduce with a debug build.</p>
        <div class="miniCommand">docker image inspect myimage --format '{{.Os}}/{{.Architecture}}'
uname -m                                  # host architecture
docker run --rm -it --entrypoint sh myimage  # then run under gdb</div>
        <p class="fixLine"><strong>Fix:</strong> build the image for the node's platform (<code>--platform linux/amd64</code> or <code>linux/arm64</code>), or debug the crashing binary with a core dump inside the container.</p>
      </div>
    </div>

    <div class="decoderPanel" id="case-k8s" role="tabpanel">
      <div class="snippetBox"><span class="dim">$ kubectl get pod app-7f9c</span>
NAME       READY   STATUS             RESTARTS
app-7f9c   0/1     <span class="bad">CrashLoopBackOff</span>   6
<span class="dim">$ kubectl describe pod app-7f9c | grep -A2 'Last State'</span>
    Last State:  Terminated
      Reason: Error   Exit Code: 139</div>
      <div class="interpretCard">
        <span class="eyebrow">Interpretation</span>
        <h3>The container starts, segfaults, and restarts in a loop.</h3>
        <p>Exit Code 139 with Reason: Error is a segfault, which is different from Reason: OOMKilled (exit 137). Read the previous logs and check what deploy introduced it.</p>
        <div class="miniCommand">kubectl logs app-7f9c --previous
kubectl get pod app-7f9c -o jsonpath='{.status.containerStatuses[0].lastState.terminated.exitCode}'
kubectl rollout undo deploy/app        # stop the bleeding while you debug</div>
        <p class="fixLine"><strong>Fix:</strong> roll back the deploy that introduced the crash, then debug the binary with a core dump or an AddressSanitizer build before re-releasing.</p>
      </div>
    </div>
  </section>

  <section class="sectionBlock" id="causes">
    <h2 class="sectionTitle">The five causes behind most segfaults</h2>
    <p class="bodyText">Almost every SIGSEGV traces back to one of these memory mistakes. Each has a small reproducer and a direct fix.</p>
    <div class="stepsGrid">
      <div class="stepCard">
        <span>1</span>
        <h3>Null or uninitialized pointer</h3>
        <p>Reading or writing through a pointer that is <code>NULL</code> or was never set. Fix: initialize pointers and check before dereferencing.</p>
      </div>
      <div class="stepCard">
        <span>2</span>
        <h3>Out-of-bounds access</h3>
        <p>Indexing past the end of an array or buffer, including an off-by-one. Fix: validate lengths and use bounds-checked APIs.</p>
      </div>
      <div class="stepCard">
        <span>3</span>
        <h3>Use-after-free</h3>
        <p>Using a pointer after <code>free()</code>, or a double free. Fix: set pointers to <code>NULL</code> after freeing and own lifetimes clearly.</p>
      </div>
      <div class="stepCard">
        <span>4</span>
        <h3>Stack overflow</h3>
        <p>Infinite or very deep recursion, or a huge stack array. Fix: add a base case, bound the depth, or heap-allocate large buffers.</p>
      </div>
      <div class="stepCard">
        <span>5</span>
        <h3>Write to read-only memory</h3>
        <p>Modifying a string literal or a const mapping. Fix: copy into a writable buffer before mutating.</p>
      </div>
    </div>
  </section>

  <section class="sectionBlock" id="slippery">
    <h2 class="sectionTitle">Why the same bug crashes sometimes and not others</h2>
    <p class="bodyText">A segfault is undefined behavior, and undefined behavior is allowed to look like it works. A use-after-free often reads fine because the freed block has not been reused yet. An out-of-bounds read returns garbage instead of faulting when the neighbouring page happens to be mapped. This is why "works on my machine" and "only crashes in production" are real engineering facts, not excuses.</p>
    <div class="stepsGrid">
      <div class="stepCard"><span>1</span><h3>Debug vs release</h3><p>The optimizer reorders code, inlines frames, and reuses stack slots, so an uninitialized read that was harmless in a debug build faults in release.</p></div>
      <div class="stepCard"><span>2</span><h3>ASLR moves things</h3><p>Address space layout randomization changes addresses each run, so a wild pointer lands on a mapped page one time and an unmapped one the next.</p></div>
      <div class="stepCard"><span>3</span><h3>Heap layout and timing</h3><p>Under light load a freed allocation is still intact; under real traffic it gets reused, and only then does a use-after-free corrupt live data.</p></div>
      <div class="stepCard"><span>4</span><h3>Allocator differences</h3><p>A different glibc, jemalloc, or musl changes sizing and poisoning, so a bug that hides on your laptop surfaces in the container image.</p></div>
    </div>
    <div class="answerBox"><strong>Make "sometimes" into "always":</strong> run with <code>MALLOC_PERTURB_=42</code> and <code>MALLOC_CHECK_=3</code>, or rebuild with AddressSanitizer, which turns an intermittent crash into a deterministic report at the exact faulting line.</div>
  </section>

  <section class="sectionBlock" id="debug">
    <h2 class="sectionTitle">How to debug a SIGSEGV, in order</h2>
    <p class="bodyText">A segfault is one of the most debuggable failures there is, because the crash captures the exact machine state. Work from the core dump inward.</p>
    <div class="stepsGrid">
      <div class="stepCard">
        <span>1</span>
        <h3>Capture a core dump</h3>
        <p>Run <code>ulimit -c unlimited</code>, reproduce, and check <code>/proc/sys/kernel/core_pattern</code>. On systemd, use <code>coredumpctl list</code> and <code>coredumpctl gdb</code>.</p>
      </div>
      <div class="stepCard">
        <span>2</span>
        <h3>Read the backtrace</h3>
        <p><code>gdb ./app core</code>, then <code>bt full</code> for the call stack and locals, and <code>frame N</code> to inspect the faulting line. Build with <code>-g</code> for symbols.</p>
      </div>
      <div class="stepCard">
        <span>3</span>
        <h3>Rebuild with AddressSanitizer</h3>
        <p><code>gcc -g -fsanitize=address app.c -o app</code>. ASan reports use-after-free, heap and stack overflow with the allocation and access site.</p>
      </div>
      <div class="stepCard">
        <span>4</span>
        <h3>Or run under valgrind</h3>
        <p><code>valgrind --leak-check=full --track-origins=yes ./app</code> catches invalid reads and writes without a rebuild, at the cost of speed.</p>
      </div>
    </div>
    <div class="snippetBox"><span class="dim">$ gdb -q ./app core</span>
Program terminated with signal <span class="bad">SIGSEGV, Segmentation fault</span>.
#0  0x000055f in parse_row (r=0x0) at parser.c:88
88          return r-&gt;columns[0];
<span class="dim">(gdb) bt</span>
#0  parse_row (r=0x0)              at parser.c:88
#1  load_file (path=0x7ffd...)     at parser.c:142
#2  main (argc=2, argv=0x7ffd...)  at main.c:30
<span class="dim">(gdb) print r</span>
$1 = (Row *) 0x0</div>
    <div class="answerBox"><strong>Read it like an expert:</strong> the crash is at frame #0, but the bug is one frame up. <code>r</code> is <code>0x0</code>, so <code>parse_row</code> was handed a null Row by <code>load_file</code>, which returned NULL for a missing file that nobody checked. You fix the caller, not the line that happened to fault.</div>
    <div class="answerBox"><strong>Pick the right tool:</strong> gdb on a core shows WHERE it crashed, not always WHY. AddressSanitizer (a rebuild, roughly 2x slower) catches use-after-free and overflows at the exact site and is the fastest route to root cause. Valgrind needs no rebuild but runs 20 to 50x slower and shifts timing enough to hide race-related crashes. Reach for ASan first when you can rebuild, and valgrind when you cannot.</div>
    <div class="fixTableWrap">
      <table class="fixTable">
        <thead>
          <tr><th>Evidence</th><th>Likely cause</th><th>Confirm with</th><th>Safe fix</th></tr>
        </thead>
        <tbody>
          <tr>
            <td data-label="Evidence"><code>segfault at 0</code> in dmesg</td>
            <td data-label="Likely cause">Null pointer dereference.</td>
            <td data-label="Confirm with"><code>gdb bt</code>, look at the faulting pointer.</td>
            <td data-label="Safe fix">Initialize and null-check the pointer before use.</td>
          </tr>
          <tr>
            <td data-label="Evidence">ASan: <code>heap-use-after-free</code></td>
            <td data-label="Likely cause">Access through a freed/dangling pointer.</td>
            <td data-label="Confirm with">AddressSanitizer report (free site + use site).</td>
            <td data-label="Safe fix">Fix ownership; set pointer to NULL after free.</td>
          </tr>
          <tr>
            <td data-label="Evidence">ASan: <code>stack-buffer-overflow</code></td>
            <td data-label="Likely cause">Writing past a local array.</td>
            <td data-label="Confirm with">AddressSanitizer, or valgrind invalid write.</td>
            <td data-label="Safe fix">Bound the index; size buffers to the data.</td>
          </tr>
          <tr>
            <td data-label="Evidence">Very deep backtrace, same frame</td>
            <td data-label="Likely cause">Infinite recursion, stack overflow.</td>
            <td data-label="Confirm with"><code>gdb bt</code> shows the frame repeating.</td>
            <td data-label="Safe fix">Add a base case or convert to iteration.</td>
          </tr>
          <tr>
            <td data-label="Evidence">Crash only in a container</td>
            <td data-label="Likely cause">Wrong-architecture binary under emulation.</td>
            <td data-label="Confirm with">Compare image and host architecture.</td>
            <td data-label="Safe fix">Rebuild for the node platform.</td>
          </tr>
          <tr>
            <td data-label="Evidence">Segfault in a Python process</td>
            <td data-label="Likely cause">Bug in a native extension or FFI call.</td>
            <td data-label="Confirm with"><code>python -X faulthandler</code> traceback.</td>
            <td data-label="Safe fix">Update or fix the native module; correct FFI types.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <section class="sectionBlock" id="languages">
    <h2 class="sectionTitle">What a segfault looks like in each language</h2>
    <p class="bodyText">SIGSEGV means the same thing to the kernel everywhere, but each runtime dresses it up differently and each has a preferred first tool. If you are not writing C, the segfault is almost always in native code underneath you.</p>
    <div class="comparisonTableWrap">
      <table class="comparisonTable">
        <thead><tr><th>Language</th><th>How it surfaces</th><th>First tool</th></tr></thead>
        <tbody>
          <tr><td data-label="Language"><strong>C / C++</strong></td><td data-label="Surfaces">Segmentation fault (core dumped), exit 139.</td><td data-label="Tool">gdb on the core, or an AddressSanitizer rebuild.</td></tr>
          <tr><td data-label="Language"><strong>Go</strong></td><td data-label="Surfaces">A SIGSEGV with a goroutine stack, or "invalid memory address or nil pointer dereference".</td><td data-label="Tool">The built-in panic trace; <code>GOTRACEBACK=crash</code> for a full core.</td></tr>
          <tr><td data-label="Language"><strong>Rust</strong></td><td data-label="Surfaces">Safe code panics instead; a real SIGSEGV means <code>unsafe</code> or a C dependency over FFI.</td><td data-label="Tool"><code>RUST_BACKTRACE=1</code>, then gdb for the unsafe or FFI frame.</td></tr>
          <tr><td data-label="Language"><strong>Java / JVM</strong></td><td data-label="Surfaces">A fatal error with an <code>hs_err_pid</code> log, not a normal exception. Usually JNI or the JIT.</td><td data-label="Tool">The <code>hs_err_pid.log</code> file; it names the failing frame and library.</td></tr>
          <tr><td data-label="Language"><strong>Python</strong></td><td data-label="Surfaces">A bare "Segmentation fault"; the interpreter does not catch it.</td><td data-label="Tool"><code>python -X faulthandler</code> for the C traceback; suspect a native extension.</td></tr>
          <tr><td data-label="Language"><strong>Node.js</strong></td><td data-label="Surfaces">A segfault or abort with a V8 stack, often from a native addon.</td><td data-label="Tool"><code>--report-on-signal</code> or node-report; audit native addons.</td></tr>
        </tbody>
      </table>
    </div>
  </section>

  <section class="sectionBlock" id="containers">
    <h2 class="sectionTitle">Exit code 139 in Docker and Kubernetes</h2>
    <p class="bodyText">In a cluster you often see the symptom before the signal: a container in <strong>CrashLoopBackOff</strong> rather than the words "segmentation fault". The most important first step is to separate a segfault (139) from an OOMKilled container (137), because they lead to opposite fixes.</p>
    <div class="answerBox">
      <strong>139 vs 137:</strong> <code>Exit Code: 139</code> with <code>Reason: Error</code> is a segfault, so debug the binary. <code>Exit Code: 137</code> with <code>Reason: OOMKilled</code> means it hit the memory limit, so adjust limits or usage. Same crash loop, different root cause.
    </div>
    <div class="stepsGrid">
      <div class="stepCard">
        <span>1</span>
        <h3>Read previous logs</h3>
        <p><code>kubectl logs POD --previous</code> holds the output from the crashed container instance, often with the last thing it did before the fault.</p>
      </div>
      <div class="stepCard">
        <span>2</span>
        <h3>Confirm the exit code</h3>
        <p><code>kubectl describe pod POD</code> and check Last State. Exit Code 139 confirms SIGSEGV rather than OOM or a config error.</p>
      </div>
      <div class="stepCard">
        <span>3</span>
        <h3>Correlate the deploy</h3>
        <p>Did the crash start after a rollout or an image bump? A recent change is the fastest lead. Roll back to stop the loop while you debug.</p>
      </div>
      <div class="stepCard">
        <span>4</span>
        <h3>Get a core out of the pod</h3>
        <p>Set a writable <code>core_pattern</code> path on the node or an ephemeral debug container, then pull the core to analyze the binary with symbols.</p>
      </div>
    </div>
  </section>

  <section class="sectionBlock" id="prod-cores">
    <h2 class="sectionTitle">Getting a core out of production and distroless containers</h2>
    <p class="bodyText">The most common reason a production segfault stays unsolved is that no core was ever captured. Containers make this worse: the kernel writes the core using the host's <code>core_pattern</code>, not anything you set inside the container, so <code>ulimit -c unlimited</code> in the entrypoint is necessary but not sufficient.</p>
    <div class="stepsGrid">
      <div class="stepCard"><span>1</span><h3>core_pattern is host-wide</h3><p>Check <code>cat /proc/sys/kernel/core_pattern</code> on the node. On systemd hosts it pipes to systemd-coredump, so the core is in <code>coredumpctl list</code> and opens with <code>coredumpctl gdb</code>.</p></div>
      <div class="stepCard"><span>2</span><h3>Distroless has no shell</h3><p>You cannot run gdb inside a distroless image. Attach an ephemeral debug container that shares the process namespace: <code>kubectl debug -it POD --image=busybox --target=app</code>, or copy the core off the node.</p></div>
      <div class="stepCard"><span>3</span><h3>Snapshot a live process</h3><p>If a process is hung rather than crashed, <code>gcore PID</code> writes a core without killing it, so you can inspect state and let it keep running.</p></div>
      <div class="stepCard"><span>4</span><h3>Keep your symbols</h3><p>Production binaries are usually stripped, so <code>bt</code> shows <code>??</code>. Keep the unstripped binary or a <code>.debug</code> file, or wire up debuginfod, so the backtrace has names.</p></div>
    </div>
    <div class="answerBox"><strong>Treat cores as sensitive:</strong> a core dump is a snapshot of process memory and can contain tokens, keys, and customer data. Restrict who can read cores, scrub them before sharing, and think twice before uploading one, especially under compliance.</div>
  </section>

  <section class="sectionBlock" id="alertmend">
    <h2 class="sectionTitle">Automate SIGSEGV response: from crash loop to captured evidence</h2>
    <p class="bodyText">AlertMend does not fix your C bug, and no honest tool claims to. What it does is remove the blind, repetitive part of a production segfault: catching the crash loop the moment it starts, preserving the evidence before it is lost, and running the safe recovery so you are not debugging from scratch at 2 a.m.</p>
    <div class="alertmendFlow">
      <h3>AlertMend detection and recovery flow</h3>
      <p>AlertMend correlates the signal, exit code, previous logs, core-dump location, and recent deploy before it suggests or runs a recovery.</p>
      <div class="recoveryTrack">
        <div class="recoveryStep"><strong>Detect</strong><span>Exit 139, CrashLoopBackOff, restart count climbing, pod/service, and the deploy that preceded it.</span></div>
        <div class="recoveryArrow">→</div>
        <div class="recoveryStep"><strong>Classify</strong><span>Separate SIGSEGV (139) from OOMKilled (137) and SIGABRT (134), so the alert names the real problem.</span></div>
        <div class="recoveryArrow">→</div>
        <div class="recoveryStep"><strong>Preserve</strong><span>Capture previous logs and the core-dump path, and attach them to the incident before they rotate away.</span></div>
        <div class="recoveryArrow">→</div>
        <div class="recoveryStep"><strong>Recover</strong><span>Roll back the bad deploy or restart behind an approval gate, then confirm the pod is healthy.</span></div>
      </div>
    </div>
    <div class="answerBox">
      <strong>The practical goal:</strong> when a container starts segfaulting, the on-call engineer should get "exit 139 (SIGSEGV), started after deploy #482, previous logs and core attached, rollback ready to approve" in Slack or WhatsApp, not a bare CrashLoopBackOff alert.
    </div>
    <div class="automationCta">
      <p><strong>Want this on your stack?</strong> Bring one real exit-code-139 crash loop and we will map the evidence, the 139-vs-137 classification, and the first safe rollback runbook.</p>
      <a class="ctaButton ctaButtonPrimary" href="${calendly}&intent=automation-review" target="_blank" rel="noopener noreferrer">Book a 20-min automation review →</a>
    </div>
  </section>

  <section class="sectionBlock" id="sources">
    <h2 class="sectionTitle">Primary sources checked</h2>
    <p class="bodyText">The behavior above is based on primary documentation, not a generic answer.</p>
    <ol class="sourceList">
      <li><a href="https://man7.org/linux/man-pages/man7/signal.7.html" target="_blank" rel="noopener noreferrer">Linux manual: signal(7), signal numbers and default actions</a></li>
      <li><a href="https://man7.org/linux/man-pages/man5/core.5.html" target="_blank" rel="noopener noreferrer">Linux manual: core(5), core dump files and core_pattern</a></li>
      <li><a href="https://sourceware.org/gdb/current/onlinedocs/gdb" target="_blank" rel="noopener noreferrer">GDB documentation: backtraces and examining the stack</a></li>
      <li><a href="https://github.com/google/sanitizers/wiki/AddressSanitizer" target="_blank" rel="noopener noreferrer">AddressSanitizer: detecting memory errors</a></li>
      <li><a href="https://docs.python.org/3/library/faulthandler.html" target="_blank" rel="noopener noreferrer">Python docs: faulthandler for native tracebacks</a></li>
      <li><a href="https://kubernetes.io/docs/tasks/debug/debug-application/debug-running-pod/" target="_blank" rel="noopener noreferrer">Kubernetes docs: debug running pods</a></li>
    </ol>
  </section>

  <section class="sectionBlock" id="faq">
    <h2 class="sectionTitle">SIGSEGV FAQ</h2>
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
    <h2>Turn segfault crash loops into captured evidence</h2>
    <p>AlertMend watches for exit code 139 and CrashLoopBackOff, separates SIGSEGV from OOMKilled, attaches previous logs and the core-dump location, and routes an approved rollback across VMs, Kubernetes, and CI-driven services.</p>
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
          <p>See how AlertMend AI can catch crash loops, preserve evidence, and automate safe remediation across Kubernetes, VMs, and CI/CD. <a href="${calendly}" target="_blank" rel="noopener noreferrer">Book a demo. →</a></p>
        </div>
      </div>
      ${buildSidebarHtml(related, title)}
    </div>
  </div>
  <script src="${scriptHref}"></script>
  <script>${BLOG_SIGNUP_HANDLER_JS}</script>
</body>
</html>`

// Hero SVG for OG image (self-contained, no external refs)
const heroSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"><defs><linearGradient id="hg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1a0b0b"/><stop offset="1" stop-color="#3f0d0d"/></linearGradient></defs><rect width="1200" height="630" fill="url(#hg)"/><g transform="translate(80,80)"><circle cx="22" cy="22" r="22" fill="#dc2626"/><text x="22" y="30" font-size="22" font-weight="800" fill="#fff" text-anchor="middle">A</text><text x="56" y="30" font-size="24" font-weight="700" fill="#fff">AlertMend</text><text x="228" y="30" font-size="18" fill="#f0a0a0">· troubleshooting</text></g><text x="80" y="250" font-size="66" font-weight="800" fill="#fff">SIGSEGV (signal 11)</text><text x="80" y="316" font-size="31" font-weight="700" fill="#f87171">Segmentation fault · exit code 139</text><g font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="19"><rect x="80" y="368" width="1040" height="150" rx="14" fill="#200f0f" stroke="#4a1d1d"/><text x="108" y="406" fill="#fca5a5">$ ./app</text><text x="108" y="442" fill="#fecaca">Segmentation fault (core dumped)</text><text x="108" y="478" fill="#fca5a5">$ echo $?</text><text x="320" y="478" fill="#fecaca">139</text></g><text x="80" y="566" font-size="19" fill="#f0a0a0">alertmend.io · core dump, gdb, AddressSanitizer, and the exit-139 fix</text></svg>\n`

const assetDir = path.join(root, 'public/assets', slug)
fs.mkdirSync(assetDir, { recursive: true })
fs.writeFileSync(path.join(assetDir, 'sigsegv-hero.svg'), heroSvg)

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
