(function () {
  const MODES = {
    local: {
      title: 'Local development',
      summary:
        'Error 127 on your laptop usually means gcc, go, or another recipe command is not installed or not on PATH in the non-interactive shell make uses.',
      steps: [
        'Read the line above Error 127 in the terminal output',
        'Run which gcc go g++ python3 to see what is missing',
        'Install build-essential (Linux) or Xcode CLI tools (macOS)',
        'Restart the terminal and run make clean && make',
      ],
      tip: 'Interactive shells load .bashrc; make uses /bin/sh without your profile. Export PATH before make if tools live in /usr/local/go/bin.',
    },
    docker: {
      title: 'Docker builds',
      summary:
        'Error 127 in docker build means the image never had the tool your Makefile calls — minimal images often lack gcc, make, or language SDKs.',
      steps: [
        'Find the failing RUN make line in the Dockerfile build log',
        'Use a base image that includes your toolchain (golang:, node:, buildpack-deps)',
        'Or RUN apt-get install -y build-essential before make',
        'Re-build with --no-cache after changing base image',
      ],
      tip: 'Alpine images need apk add make gcc musl-dev bash when makefiles assume GNU bash.',
    },
    ci: {
      title: 'CI / GitHub Actions',
      summary:
        'makefile error 127 in CI means the job image differs from your laptop: go or gcc exists locally but not on the runner.',
      steps: [
        'Open the CI log and note the Makefile line number in the error',
        'Add setup-go, setup-node, or apt install build-essential to the job',
        'Pin tool versions in the workflow YAML',
        'Use the same base image across all build jobs',
      ],
      tip: 'Cache the toolchain in the Docker image layer, not only in a setup step that some jobs skip.',
    },
    wsl: {
      title: 'WSL / Windows',
      summary:
        'Install gcc, make, and go inside WSL, not only on the Windows host. Native Windows error 127 is a different Win32 code.',
      steps: [
        'Confirm you are building inside WSL or MSYS2, not cmd.exe',
        'sudo apt install build-essential golang-go (Debian-based WSL)',
        'Verify with which gcc && gcc --version before make',
        'Keep PATH exports in ~/.profile so non-interactive make sees them',
      ],
      tip: 'If the tool works in an interactive WSL shell but make still fails, PATH is not exported for sh -c recipes.',
    },
  };

  const COMMAND_SCENARIOS = {
    uv: {
      command: 'uv',
      error: '/bin/sh: uv: command not found',
      diagnosis: 'Missing command: uv',
      body: 'The Makefile calls uv, but that executable is absent from the environment or outside PATH.',
      check: `command -v uv
printf '%s\\n' "$PATH"`,
      fix: 'Install uv in the same CI image or shell that runs make, then verify with command -v uv.',
    },
    go: {
      command: 'go',
      error: 'make: go: No such file or directory',
      diagnosis: 'Missing command: go',
      body: 'Go exists on another machine or shell profile, but not in the current make, container, or CI environment.',
      check: `command -v go
go version
printf '%s\\n' "$PATH"`,
      fix: 'Install Go in that environment and export its bin directory before make starts.',
    },
    compiler: {
      command: 'gcc',
      error: '/bin/sh: gcc: command not found',
      diagnosis: 'Missing compiler toolchain',
      body: 'The compiler is missing—common in fresh VMs, minimal containers, and runtime-only images.',
      check: `command -v gcc g++
gcc --version
g++ --version`,
      fix: 'Install the platform build toolchain, then verify both compiler commands in the failing environment.',
    },
    node: {
      command: 'npm',
      error: '/bin/sh: vite: command not found',
      diagnosis: 'Missing Node or project-local binary',
      body: 'Node dependencies or binaries are missing. Local npm scripts resolve node_modules/.bin, while a direct Makefile recipe may not.',
      check: `command -v node npm
test -x node_modules/.bin/vite
npm exec vite -- --version`,
      fix: 'Install Node and dependencies; invoke local tools with npm exec, npx, or an npm script.',
    },
    path: {
      command: './script',
      error: '/bin/sh: ./build.sh: not found',
      diagnosis: 'Missing path or interpreter',
      body: 'The file may be absent, the working directory may differ, CRLF may corrupt the shebang, or the shebang interpreter may not exist.',
      check: `pwd
ls -l ./build.sh
file ./build.sh
head -1 ./build.sh`,
      fix: 'Correct the path or shebang/interpreter first. Use chmod only when the file exists and the error is permission denied (126).',
    },
  };

  const commandButtons = [...document.querySelectorAll('[data-command-id]')];
  const commandError = document.getElementById('command-error-line');
  const commandTitle = document.getElementById('command-diagnosis-title');
  const commandBody = document.getElementById('command-diagnosis-body');
  const commandCheck = document.getElementById('command-check');
  const commandFix = document.getElementById('command-fix');

  function renderCommand(id, focusButton = false) {
    const scenario = COMMAND_SCENARIOS[id];
    if (!scenario) return;
    commandButtons.forEach((button) => {
      const active = button.getAttribute('data-command-id') === id;
      button.classList.toggle('commandTabActive', active);
      button.setAttribute('aria-selected', active ? 'true' : 'false');
      button.tabIndex = active ? 0 : -1;
      if (active && focusButton) button.focus();
    });
    if (commandError) commandError.textContent = scenario.error;
    if (commandTitle) commandTitle.textContent = scenario.diagnosis;
    if (commandBody) commandBody.textContent = scenario.body;
    if (commandCheck) commandCheck.textContent = scenario.check;
    if (commandFix) commandFix.textContent = scenario.fix;
  }

  commandButtons.forEach((button, index) => {
    button.addEventListener('click', () => renderCommand(button.getAttribute('data-command-id')));
    button.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      let next = index;
      if (event.key === 'ArrowLeft') next = (index - 1 + commandButtons.length) % commandButtons.length;
      if (event.key === 'ArrowRight') next = (index + 1) % commandButtons.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = commandButtons.length - 1;
      renderCommand(commandButtons[next].getAttribute('data-command-id'), true);
    });
  });

  const modeButtons = document.querySelectorAll('[data-mode-id]');
  const panelTitle = document.getElementById('mode-playbook-title');
  const panelSummary = document.getElementById('mode-playbook-summary');
  const panelSteps = document.getElementById('mode-playbook-steps');
  const panelTip = document.getElementById('mode-playbook-tip');

  function renderMode(id) {
    const mode = MODES[id];
    if (!mode) return;
    modeButtons.forEach((btn) => {
      const active = btn.getAttribute('data-mode-id') === id;
      btn.classList.toggle('modeCardActive', active);
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    if (panelTitle) panelTitle.textContent = 'Fix: ' + mode.title;
    if (panelSummary) panelSummary.textContent = mode.summary;
    if (panelSteps) {
      panelSteps.innerHTML = mode.steps.map((s) => '<li>' + s + '</li>').join('');
    }
    if (panelTip) panelTip.textContent = mode.tip;
  }

  modeButtons.forEach((btn) => {
    btn.addEventListener('click', () => renderMode(btn.getAttribute('data-mode-id')));
  });

  document.querySelectorAll('[data-faq-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faqItem');
      const answer = item && item.querySelector('.faqAnswer');
      const chevron = btn.querySelector('.faqChevron');
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', open ? 'false' : 'true');
      if (answer) answer.classList.toggle('hidden', open);
      if (chevron) chevron.classList.toggle('faqChevronOpen', !open);
    });
  });

  renderMode('local');
  renderCommand('uv');

  const signupForm = document.getElementById('blog-signup-form');
  const signupStatus = document.getElementById('blog-signup-status');
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = signupForm.querySelector('input[type="email"]');
      const button = signupForm.querySelector('button[type="submit"]');
      const email = input && input.value ? input.value.trim() : '';
      if (!email || !button) return;

      button.disabled = true;
      button.textContent = 'Signing up…';
      if (signupStatus) {
        signupStatus.hidden = true;
        signupStatus.textContent = '';
        signupStatus.className = 'signup-status';
      }

      try {
        const response = await fetch('https://api.alertmend.io/contact', {
          method: 'POST',
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            full_name: 'Blog subscriber',
            company: '',
            email,
            message:
              'Newsletter signup from the AlertMend blog. Please add this email to the blog and product updates list.',
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
        } else {
          const data = await response.json().catch(() => ({}));
          if (signupStatus) {
            signupStatus.hidden = false;
            signupStatus.textContent = data.error || data.message || 'Something went wrong. Please try again.';
            signupStatus.className = 'signup-status error';
          }
        }
      } catch {
        if (signupStatus) {
          signupStatus.hidden = false;
          signupStatus.textContent = 'Network error. Please check your connection and try again.';
          signupStatus.className = 'signup-status error';
        }
      } finally {
        button.disabled = false;
        button.textContent = 'Sign up';
      }
    });
  }
})();
