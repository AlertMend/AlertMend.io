(function () {
  const FAILURE_MODES = {
    split: {
      title: 'UI up, backend down',
      summary: 'Open WebUI /health returns 200 while Ollama /api/tags fails. Users see login but chat errors on every message.',
      steps: ['curl WebUI /health and Ollama /api/tags', 'Confirm OLLAMA_BASE_URL from WebUI env', 'Auto-fix: restart Ollama backend', 'Re-probe /api/tags twice', 'Do not restart WebUI if UI check passes'],
      code: `curl -sf http://open-webui:8080/health
curl -sf http://ollama:11434/api/tags | jq '.models[].name'
kubectl rollout restart deployment/ollama -n inference`,
      tip: 'This is the #1 Open WebUI production failure mode.',
      mockCode: 'SPLIT',
      mockLabel: 'Backend down, UI OK',
      mockMeta: 'WebUI /health 200 · Ollama /api/tags FAIL',
    },
    url: {
      title: 'Wrong OLLAMA_BASE_URL',
      summary: 'WebUI points at localhost or wrong Docker network hostname. Works on laptop, fails in Compose or K8s.',
      steps: ['kubectl exec into WebUI pod: printenv OLLAMA_BASE_URL', 'Use http://ollama:11434 in Compose/K8s service DNS', 'Fix env, rollout restart open-webui', 'Verify from WebUI network namespace'],
      code: `kubectl exec -it deploy/open-webui -- printenv OLLAMA_BASE_URL
# Compose: OLLAMA_BASE_URL=http://ollama:11434
kubectl set env deployment/open-webui OLLAMA_BASE_URL=http://ollama.inference.svc:11434`,
      tip: 'Never use localhost in OLLAMA_BASE_URL inside containers.',
      mockCode: 'CONN',
      mockLabel: 'Connection refused',
      mockMeta: 'WebUI cannot reach OLLAMA_BASE_URL',
    },
    oom: {
      title: 'OOMKilled (backend)',
      summary: 'Ollama OOMKilled while Open WebUI stays healthy.',
      steps: ['describe ollama pod: OOMKilled', 'Raise limits', 'Restart Ollama', 'WebUI usually unchanged'],
      code: `kubectl describe pod -l app=ollama | grep OOMKilled
kubectl rollout restart deployment/ollama`,
      tip: { label: 'OOMKilled exit 137 guide', href: '/blog/debugging-kubernetes-oomkilled-exit-code-137-causes-and-solutions' },
      mockCode: '137',
      mockLabel: 'Ollama OOMKilled',
      mockMeta: 'WebUI OK · backend exit 137',
    },
    crashloop: {
      title: 'Backend CrashLoopBackOff',
      summary: 'Ollama crash-loops; WebUI may still show Ready.',
      steps: ['kubectl logs ollama --previous', 'Fix Ollama config/probes', 'See crashloop runbook'],
      code: `kubectl logs -l app=ollama --previous --tail=80`,
      tip: { label: 'CrashLoopBackOff fix guide', href: '/blog/kubernetes-crashloopbackoff-fix' },
      mockCode: 'CRASH',
      mockLabel: 'Ollama CrashLoop',
      mockMeta: 'WebUI Ready · ollama 0/1',
    },
  };

  const DEPLOY_MODES = {
    compose: {
      title: 'Docker Compose',
      summary: 'open-webui + ollama on same network.',
      alertmendSteps: ['Check :8080/health and ollama:11434/api/tags', 'Auto-restart ollama', 'Split-stack alert'],
      tip: 'OLLAMA_BASE_URL=http://ollama:11434',
    },
    kubernetes: {
      title: 'Kubernetes',
      summary: 'Split Deployments for WebUI and Ollama.',
      alertmendSteps: ['UI + backend checks', 'Restart ollama runbook', 'Deploy grace'],
      tip: 'Service DNS for OLLAMA_BASE_URL',
    },
    ingress: {
      title: 'Ingress split',
      summary: 'Public WebUI, internal Ollama.',
      alertmendSteps: ['External WebUI check', 'Internal Ollama check', 'Split-stack rule'],
      tip: 'Do not expose Ollama without auth',
    },
    gpu: {
      title: 'GPU node',
      summary: 'Ollama on GPU; WebUI on CPU.',
      alertmendSteps: ['OOM on ollama', 'Backend check', 'Node correlation'],
      tip: 'WebUI metrics miss backend OOM',
    },
    litellm: {
      title: 'LiteLLM in path',
      summary: 'WebUI → LiteLLM → Ollama.',
      alertmendSteps: ['Monitor all three layers', 'See LiteLLM guide'],
      tip: { label: 'Monitor LiteLLM guide', href: '/blog/monitor-litellm-using-alertmend' },
    },
  };

  function renderTip(el, tip) {
    if (!el) return;
    if (tip && typeof tip === 'object' && tip.href) {
      el.innerHTML = 'Related: <a href="' + tip.href + '">' + tip.label + '</a>';
      return;
    }
    el.textContent = tip || '';
  }

  const failureButtons = document.querySelectorAll('[data-failure-id]');
  const failureTitle = document.getElementById('failure-playbook-title');
  const failureSummary = document.getElementById('failure-playbook-summary');
  const failureSteps = document.getElementById('failure-playbook-steps');
  const failureCode = document.getElementById('failure-playbook-code');
  const failureTip = document.getElementById('failure-playbook-tip');
  const mockCode = document.getElementById('mock-status-code');
  const mockLabel = document.getElementById('mock-status-label');
  const mockDot = document.getElementById('mock-status-dot');
  const mockMeta = document.getElementById('mock-meta');
  const mockBarFill = document.getElementById('mock-bar-fill');
  const recoverBtn = document.getElementById('mock-recover-btn');

  let recovered = false;

  function renderFailure(id) {
    const mode = FAILURE_MODES[id];
    if (!mode) return;

    failureButtons.forEach((btn) => {
      const active = btn.getAttribute('data-failure-id') === id;
      btn.classList.toggle('modeCardActive', active);
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
    });

    if (failureTitle) failureTitle.textContent = mode.title;
    if (failureSummary) failureSummary.textContent = mode.summary;
    if (failureSteps) {
      failureSteps.innerHTML = mode.steps.map((s) => '<li>' + s + '</li>').join('');
    }
    if (failureCode) failureCode.textContent = mode.code;
    renderTip(failureTip, mode.tip);

    if (!recovered) {
      if (mockCode) mockCode.textContent = mode.mockCode;
      if (mockLabel) {
        mockLabel.textContent = mode.mockLabel;
        mockLabel.className = 'mockStatusLabel mockStatusLabelError';
      }
      if (mockDot) mockDot.className = 'mockStatusDot mockStatusDotError';
      if (mockMeta) mockMeta.textContent = mode.mockMeta;
      if (mockBarFill) mockBarFill.style.width = '72%';
    }
  }

  function setRecovered() {
    recovered = true;
    if (mockCode) mockCode.textContent = '200';
    if (mockLabel) {
      mockLabel.textContent = 'OK · UI + backend verified';
      mockLabel.className = 'mockStatusLabel mockStatusLabelOk';
    }
    if (mockDot) mockDot.className = 'mockStatusDot mockStatusDotOk';
    if (mockMeta) mockMeta.textContent = 'Verified 200 OK × 2 · auto-fix succeeded · Slack notified';
    if (mockBarFill) mockBarFill.style.width = '100%';
    if (recoverBtn) {
      recoverBtn.textContent = 'Recovered';
      recoverBtn.disabled = true;
    }
  }

  failureButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      recovered = false;
      if (recoverBtn) {
        recoverBtn.textContent = 'Simulate recovery';
        recoverBtn.disabled = false;
      }
      renderFailure(btn.getAttribute('data-failure-id'));
    });
  });

  if (recoverBtn) {
    recoverBtn.addEventListener('click', setRecovered);
  }

  const modeButtons = document.querySelectorAll('[data-mode-id]');
  const panelTitle = document.getElementById('mode-playbook-title');
  const panelSummary = document.getElementById('mode-playbook-summary');
  const panelSteps = document.getElementById('mode-playbook-steps');
  const panelTip = document.getElementById('mode-playbook-tip');

  function renderMode(id) {
    const mode = DEPLOY_MODES[id];
    if (!mode) return;
    modeButtons.forEach((btn) => {
      const active = btn.getAttribute('data-mode-id') === id;
      btn.classList.toggle('modeCardActive', active);
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    if (panelTitle) panelTitle.textContent = 'Runbook: ' + mode.title;
    if (panelSummary) panelSummary.textContent = mode.summary;
    if (panelSteps) {
      panelSteps.innerHTML = mode.alertmendSteps.map((s) => '<li>' + s + '</li>').join('');
    }
    renderTip(panelTip, mode.tip);
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

  const progressBar = document.getElementById('reading-progress');
  if (progressBar) {
    window.addEventListener(
      'scroll',
      () => {
        const doc = document.documentElement;
        const scrollTop = doc.scrollTop || document.body.scrollTop;
        const height = doc.scrollHeight - doc.clientHeight;
        progressBar.style.width = height > 0 ? (scrollTop / height) * 100 + '%' : '0%';
      },
      { passive: true }
    );
  }

  renderFailure('split');
  renderMode('kubernetes');

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
