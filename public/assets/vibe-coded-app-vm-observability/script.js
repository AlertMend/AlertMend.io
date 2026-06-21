(function () {
  const MODES = {
    systemd: {
      title: 'systemd service',
      summary:
        'Most vibe-coded Node or Python apps on a Linux VM run as a systemd unit. Observability starts with knowing the service is active and reading its logs.',
      steps: [
        'Add a /health route to your app and curl it after deploy',
        'Check status: systemctl status your-app',
        'Tail logs: journalctl -u your-app -f',
        'Watch disk: df -h and memory: free -h weekly',
        'Set Restart=always in the unit file so crashes recover',
      ],
      tip: 'If SSH works but the site is down, the process probably exited. systemctl status tells you in one command.',
    },
    docker: {
      title: 'Docker / Compose',
      summary:
        'This is the most common pattern after an AI tool generates a Dockerfile. The container can be running while the app inside is broken, or while nginx returns 502 to users.',
      steps: [
        'Expose a health check in the image and hit it from outside the container',
        'docker ps shows running containers; docker logs -f shows app output',
        'Add restart: unless-stopped in compose',
        'Monitor host disk — Docker images and logs fill disks fast',
        'Pin image tags; latest pulls can break prod silently',
      ],
      tip: 'docker ps only proves the container started. An HTTP check on your public URL proves users can reach the app.',
    },
    pm2: {
      title: 'PM2 / Node process',
      summary:
        'Many AI-generated Node apps ship with PM2 on a bare VM. PM2 restarts crashes but does not tell you when memory grows or disk fills.',
      steps: [
        'pm2 start app.js --name myapp and pm2 save',
        'pm2 logs myapp for stdout/stderr',
        'pm2 monit for live CPU and memory per process',
        'Add an external uptime ping — PM2 can show online while nginx serves 502',
        'Enable pm2 startup so the app survives VM reboots',
      ],
      tip: 'PM2 keeps the process alive; it does not replace an uptime monitor or disk alerts on the VM itself.',
    },
  };

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
    if (panelTitle) panelTitle.textContent = 'Day 1: ' + mode.title;
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

  renderMode('systemd');

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
