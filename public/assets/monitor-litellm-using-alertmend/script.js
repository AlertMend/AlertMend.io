(function () {
  const FAILURE_MODES = {
    backend: {
      title: 'Backend down (Ollama / vLLM)',
      summary:
        'LiteLLM liveness passes while Ollama /api/tags or vLLM /v1/models fails. Users get 502/503 from the gateway even though the proxy pod is Running.',
      steps: [
        'curl LiteLLM /health/readiness and backend /api/tags or /v1/models',
        'kubectl get pods -l app=ollama (or vllm)',
        'Auto-fix: restart backend Deployment first',
        'Then rollout restart deployment/litellm if readiness still fails',
        'Re-probe both layers twice',
      ],
      code: `# Gateway
curl -sf http://litellm:4000/health/readiness
curl -sf http://litellm:4000/health/liveliness

# Backend Ollama
curl -sf http://ollama:11434/api/tags | jq '.models[].name'

# Auto-fix backend first
kubectl rollout restart deployment/ollama -n inference
kubectl rollout restart deployment/litellm -n inference`,
      tip: 'See /blog/monitor-ollama-using-alertmend and /blog/monitor-vllm-using-alertmend',
      autoFix: 'Restart backend · Then gateway · Verify readiness',
      mockCode: 'FAIL',
      mockLabel: 'Readiness failed',
      mockMeta: 'Liveliness OK · Ollama /api/tags down · auto-fix eligible',
    },
    readiness: {
      title: 'Readiness fail, liveness OK',
      summary:
        'Kubernetes marks the pod Ready incorrectly if only liveness is probed. External clients hit a gateway that cannot route.',
      steps: [
        'Point readiness at /health/readiness, liveness at /health/liveliness',
        'Enable background health checks when supported',
        'AlertMend external check on public /health/readiness',
        'Auto-fix: rollout restart litellm after backend is healthy',
        'Verify /v1/models on public URL',
      ],
      code: `curl -sf http://litellm:4000/health/liveliness
curl -sf http://litellm:4000/health/readiness

kubectl describe pod -l app=litellm | grep -A10 "Readiness"`,
      tip: 'Never use the same shallow path for liveness and readiness on LiteLLM.',
      autoFix: 'Fix probe paths · Restart proxy',
      mockCode: '503',
      mockLabel: 'Not ready',
      mockMeta: 'Readiness 503 · liveliness 200 · routing blocked',
    },
    auth: {
      title: 'Provider 401 / auth',
      summary:
        'OpenAI, Azure, or Anthropic keys expired or rotated. LiteLLM logs auth errors; pod may stay up while cloud routes fail.',
      steps: [
        'Check LiteLLM logs for 401/403 from providers',
        'Verify Secret keys mounted in Deployment',
        'Test provider with curl outside LiteLLM',
        'Update Secret, rollout restart',
        'Alert on sustained provider errors in logs',
      ],
      code: `kubectl logs -l app=litellm --tail=80 | grep -i "401\\|403\\|auth"

kubectl get secret litellm-secrets -o jsonpath='{.data}' | jq 'keys'

kubectl rollout restart deployment/litellm`,
      tip: 'Rotate keys in staging first; AlertMend deploy grace after Secret update.',
      autoFix: 'Fix Secret · Rollout restart · No blind key purge',
      mockCode: '401',
      mockLabel: 'Provider auth',
      mockMeta: 'OpenAI route 401 · gateway pod Running',
    },
    timeout: {
      title: '504 gateway timeout',
      summary:
        'Ingress timeout shorter than LITELLM_REQUEST_TIMEOUT or backend model load. Short prompts work; long RAG batches fail.',
      steps: [
        'Compare ingress proxy-read-timeout vs LITELLM_REQUEST_TIMEOUT',
        'curl timed inference through public URL',
        'Fix backend cold start (Ollama keep_alive, vLLM startupProbe)',
        'Raise ingress timeout only after backend is healthy',
        'Baseline latency alert in AlertMend',
      ],
      code: `curl -v --max-time 120 https://llm.example.com/v1/chat/completions \\
  -H 'Content-Type: application/json' \\
  -d '{"model":"gpt-4","messages":[{"role":"user","content":"ping"}],"max_tokens":1}'`,
      tip: 'See /blog/kubernetes-502-bad-gateway-error-fix for ingress timeout patterns.',
      autoFix: 'Fix backend · Tune timeouts last',
      mockCode: 'TIMEOUT',
      mockLabel: '504 Gateway Timeout',
      mockMeta: 'Public URL > 60s · in-cluster OK',
    },
  };

  const DEPLOY_MODES = {
    docker: {
      title: 'Docker / Compose',
      summary: 'LiteLLM container on port 4000 routing to Ollama on 11434. Common local and single-VM stacks.',
      alertmendSteps: [
        'Connect the host',
        'URL check on http://host:4000/health/readiness',
        'Separate check on http://host:11434/api/tags',
        'Auto-restart backend then gateway on failure',
      ],
      tip: 'Compose service names differ from K8s DNS — use the hostname your litellm config references.',
    },
    kubernetes: {
      title: 'Kubernetes',
      summary: 'litellm Deployment behind Ingress, Ollama or vLLM in inference namespace.',
      alertmendSteps: [
        'Install AlertMend agent',
        'External check on Ingress /health/readiness',
        'Backend check on inference Service',
        'Coordinated restart runbooks',
      ],
      tip: 'Probe readiness at /health/readiness on port 4000.',
    },
    helm: {
      title: 'Helm / manifest',
      summary: 'Helm values for litellm config.yaml, secrets, and Redis/Postgres sidecars.',
      alertmendSteps: [
        'Connect after helm install',
        'Check public gateway URL post-upgrade',
        'Alert on readiness fail after helm revision',
        'Rollback runbook tied to release',
      ],
      tip: 'Validate config.yaml model list matches backend URLs after every upgrade.',
    },
    redis: {
      title: 'Redis / DB',
      summary: 'LiteLLM with Redis for rate limits or Postgres for spend logs. DB blip can fail readiness.',
      alertmendSteps: [
        'Monitor Redis/Postgres connectivity in readiness',
        'Alert on DB connection errors in logs',
        'Restart litellm after DB recovery',
        'Do not auto-delete DB PVCs',
      ],
      tip: 'Correlate readiness failures with Redis pod restarts.',
    },
    multi: {
      title: 'Multi-provider',
      summary: 'Routes to OpenAI, Azure, Ollama, and vLLM. One provider down may fail readiness or specific routes only.',
      alertmendSteps: [
        'Per-route smoke tests when possible',
        'Log alerts on provider-specific errors',
        'Background health checks enabled',
        'Warn before page on single-provider outage',
      ],
      tip: 'Enable fallback models in config but still monitor each critical route.',
    },
  };

  const failureButtons = document.querySelectorAll('[data-failure-id]');
  const failureTitle = document.getElementById('failure-playbook-title');
  const failureSummary = document.getElementById('failure-playbook-summary');
  const failureSteps = document.getElementById('failure-playbook-steps');
  const failureCode = document.getElementById('failure-playbook-code');
  const failureTip = document.getElementById('failure-playbook-tip');
  const failureAutoFix = document.getElementById('failure-playbook-autofix');
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
    if (failureSteps) failureSteps.innerHTML = mode.steps.map((s) => '<li>' + s + '</li>').join('');
    if (failureCode) failureCode.textContent = mode.code;
    if (failureTip) failureTip.textContent = mode.tip;
    if (failureAutoFix) failureAutoFix.textContent = 'Safe auto-fix: ' + mode.autoFix;
    if (!recovered) {
      if (mockCode) mockCode.textContent = mode.mockCode;
      if (mockLabel) { mockLabel.textContent = mode.mockLabel; mockLabel.className = 'mockStatusLabel mockStatusLabelError'; }
      if (mockDot) mockDot.className = 'mockStatusDot mockStatusDotError';
      if (mockMeta) mockMeta.textContent = mode.mockMeta;
      if (mockBarFill) mockBarFill.style.width = '72%';
    }
  }

  function setRecovered() {
    recovered = true;
    if (mockCode) mockCode.textContent = '200';
    if (mockLabel) { mockLabel.textContent = 'OK · readiness passed'; mockLabel.className = 'mockStatusLabel mockStatusLabelOk'; }
    if (mockDot) mockDot.className = 'mockStatusDot mockStatusDotOk';
    if (mockMeta) mockMeta.textContent = 'Gateway + backend verified · Slack notified';
    if (mockBarFill) mockBarFill.style.width = '100%';
    if (recoverBtn) { recoverBtn.textContent = 'Recovered'; recoverBtn.disabled = true; }
  }

  failureButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      recovered = false;
      if (recoverBtn) { recoverBtn.textContent = 'Simulate recovery'; recoverBtn.disabled = false; }
      renderFailure(btn.getAttribute('data-failure-id'));
    });
  });
  if (recoverBtn) recoverBtn.addEventListener('click', setRecovered);

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
    if (panelSteps) panelSteps.innerHTML = mode.alertmendSteps.map((s) => '<li>' + s + '</li>').join('');
    if (panelTip) panelTip.textContent = mode.tip;
  }

  modeButtons.forEach((btn) => btn.addEventListener('click', () => renderMode(btn.getAttribute('data-mode-id'))));

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

  renderFailure('backend');
  renderMode('kubernetes');

  const amTabs = document.querySelectorAll('[data-am-screen]');
  const amScreens = { connect: document.getElementById('am-screen-connect'), check: document.getElementById('am-screen-check'), runbook: document.getElementById('am-screen-runbook') };
  const amTitle = document.getElementById('am-console-title');
  const amTitles = { connect: 'AlertMend · Clusters', check: 'AlertMend · URL checks', runbook: 'AlertMend · Runbooks' };
  function renderAmScreen(id) {
    amTabs.forEach((btn) => {
      const active = btn.getAttribute('data-am-screen') === id;
      btn.classList.toggle('amConsoleTabActive', active);
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    Object.keys(amScreens).forEach((key) => { const el = amScreens[key]; if (el) el.classList.toggle('hidden', key !== id); });
    if (amTitle && amTitles[id]) amTitle.textContent = amTitles[id];
  }
  amTabs.forEach((btn) => btn.addEventListener('click', () => renderAmScreen(btn.getAttribute('data-am-screen'))));


  const signupForm = document.getElementById('blog-signup-form');
  const signupStatus = document.getElementById('blog-signup-status');
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = signupForm.querySelector('input[type="email"]');
      const button = signupForm.querySelector('button[type="submit"]');
      const email = input && input.value ? input.value.trim() : '';
      if (!email || !button || button.disabled) return;
      const blogTitleEl = document.querySelector('.article-header h1, header.article-header--cred h1, h1');
      const blogTitle = (signupForm.getAttribute('data-blog-title') || (blogTitleEl && blogTitleEl.textContent) || document.title || 'this blog post').trim().replace(/\s*\|\s*AlertMend.*$/i, '');
      const buttonLabel = button.textContent;
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
          headers: { Accept: 'application/json, text/plain, */*', 'Content-Type': 'application/json' },
          body: JSON.stringify({
            full_name: 'Blog subscriber',
            company: '',
            email,
            message: 'Newsletter signup from the AlertMend blog post "' + blogTitle + '". Please add this email to the blog and product updates list.',
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
        button.textContent = buttonLabel || 'Sign up';
      }
    });
  }
})();