(function () {
  const FAILURE_MODES = {
    oom: {
      title: 'Runbook: OOMKilled',
      summary:
        'Kubernetes killed the Ollama container when memory or GPU VRAM limits were exceeded. Models get evicted. The next request pays a cold-start penalty unless you restart cleanly.',
      steps: [
        'kubectl describe pod: Last State Terminated, Reason OOMKilled, Exit Code 137',
        'Check memory limits vs model size and num_parallel',
        'Auto-fix: rollout restart deployment/ollama',
        'If OOM repeats within 15 min, raise limits or use smaller quantization',
        'Re-probe /api/tags until primary model appears twice',
      ],
      code: `# Diagnose
kubectl describe pod -l app=ollama -n inference | grep -A8 "Last State"
kubectl top pod -l app=ollama -n inference

# Auto-fix
kubectl rollout restart deployment/ollama -n inference
kubectl rollout status deployment/ollama -n inference --timeout=180s

# Verify model loaded
curl -sf http://ollama.inference.svc:11434/api/tags | jq '.models[].name'`,
      tip: { href: '/blog/debugging-kubernetes-oomkilled-exit-code-137-causes-and-solutions', label: 'OOMKilled exit 137 runbook' },
      autoFix: 'Rollout restart · Scale replicas · Lower num_parallel',
      mockCode: 'FAIL',
      mockLabel: 'Connection refused',
      mockMeta: 'Exit 137 on ollama-7d4f8b · 2 consecutive failures · auto-fix eligible',
    },
    timeout: {
      title: 'Runbook: Generate timeout',
      summary:
        '/api/tags returns 200 but POST /api/generate hangs or times out. Common when GPU is wedged, the model was evicted, or queue depth spikes under load.',
      steps: [
        'curl /api/tags and /api/generate with num_predict=1',
        'Check GPU utilization and dmesg on the node',
        'Auto-fix: delete the wedged pod (StatefulSet) or rollout restart',
        'Add inference smoke to external monitor, not tags alone',
        'Alert on sustained p99 before users notice slow chat',
      ],
      code: `# Diagnose
curl -sf http://ollama:11434/api/tags | jq '.models | length'
time curl -sf http://ollama:11434/api/generate -d '{
  "model": "llama3.2", "prompt": "ping", "stream": false,
  "options": { "num_predict": 1 }
}'

kubectl exec -it ollama-0 -n inference -- nvidia-smi

# Auto-fix wedged replica
kubectl delete pod ollama-0 -n inference`,
      tip: 'Tags-only monitors miss this. Add a lightweight /api/generate smoke check.',
      autoFix: 'Delete wedged pod · Rollout restart · Scale out',
      mockCode: 'TIMEOUT',
      mockLabel: 'Generate > 30s',
      mockMeta: '/api/tags 200 OK · generate smoke failed · auto-fix eligible',
    },
    proxy502: {
      title: 'Runbook: 502 / 504 from proxy',
      summary:
        'Nginx, Ingress, or Caddy returns 502/504 while Ollama restarts or while upstream timeouts are shorter than model load time.',
      steps: [
        'curl in-cluster Service vs public inference URL',
        'Check endpoints and readiness during rollout',
        'Auto-fix: rollout restart with preStop sleep on proxy path',
        'Tune proxy-read-timeout only after fixing root cause',
        'Monitor the public URL, not only localhost:11434',
      ],
      code: `# Diagnose
curl -sf http://ollama.inference.svc:11434/api/tags
curl -v https://inference.example.com/api/tags

kubectl get endpoints ollama -n inference
kubectl logs -n ingress-nginx -l app.kubernetes.io/name=ingress-nginx --tail=40

# Auto-fix
kubectl rollout restart deployment/ollama -n inference`,
      tip: { href: '/blog/kubernetes-502-bad-gateway-error-fix', label: '502 Bad Gateway runbook' },
      autoFix: 'Rollout restart · preStop sleep · Fix upstream timeouts last',
      mockCode: '502',
      mockLabel: 'Bad Gateway',
      mockMeta: 'Public URL 502 · in-cluster 200 · proxy path failure',
    },
    crashloop: {
      title: 'Runbook: CrashLoopBackOff',
      summary:
        'Pod never stays Ready. Often probe too aggressive before model load, missing model pull, bad OLLAMA_MODELS env, or insufficient startupProbe failureThreshold.',
      steps: [
        'kubectl logs previous container for pull or config errors',
        'describe pod: probe failures vs OOM vs ImagePullBackOff',
        'Lengthen startupProbe failureThreshold for large models',
        'Auto-fix: rollback last deploy if crash started after rollout',
        'Re-probe after initialDelaySeconds + model load window',
      ],
      code: `# Diagnose
kubectl logs -l app=ollama -n inference --previous --tail=80
kubectl describe pod -l app=ollama -n inference | grep -A6 "Liveness\\|Readiness\\|Startup"

# Rollback if deploy-related
kubectl rollout undo deployment/ollama -n inference
kubectl rollout status deployment/ollama -n inference --timeout=180s`,
      tip: 'Use startupProbe with failureThreshold 30+ when models load from PVC on first boot.',
      autoFix: 'Rollback deploy · Lengthen startupProbe · Fix image pull',
      mockCode: 'CRASH',
      mockLabel: 'CrashLoopBackOff',
      mockMeta: '0/1 Ready · probe failed 6 times · rollback eligible',
    },
  };

  const DEPLOY_MODES = {
    docker: {
      title: 'Docker / Compose',
      summary:
        'Run Ollama with docker run or Compose on a single host. Default API port is 11434. Mount a volume at /root/.ollama so models survive container restarts.',
      alertmendSteps: [
        'Connect the host where Ollama runs',
        'Add a URL check on http://host:11434/api/tags',
        'Add optional generate smoke for inference verification',
        'Auto-restart the container when checks fail twice consecutively',
      ],
      tip: 'Give health checks a long grace after pull or load of large models. A 7B model on a fresh volume can take 60-120 seconds.',
    },
    kubernetes: {
      title: 'Kubernetes',
      summary:
        'Deploy Ollama as a Deployment or StatefulSet with a PVC for model cache, GPU resource limits, and probes on /api/tags. Typical layout behind Open WebUI or internal chat APIs.',
      alertmendSteps: [
        'Install the AlertMend agent in your cluster',
        'Add URL checks through the same Ingress or Service your apps use',
        'Enable auto-restart on the Ollama Deployment or StatefulSet',
        'Set deploy grace periods so model cold-start does not false-alarm',
      ],
      tip: 'Probe /api/tags with startupProbe. Readiness should wait until your primary model appears in the tags list.',
    },
    systemd: {
      title: 'systemd on VM',
      summary:
        'Run ollama serve as a systemd unit on a GPU VM or bare-metal host. Common for single-tenant inference behind a reverse proxy or LiteLLM gateway.',
      alertmendSteps: [
        'Connect the VM in AlertMend',
        'Add a URL check on your public inference URL',
        'Alert on process crash or systemd restart loops',
        'Auto-restart the ollama service when health checks fail',
      ],
      tip: 'Monitor through the same hostname and TLS cert your clients use. A local-only check misses reverse proxy misconfiguration.',
    },
    gpu: {
      title: 'GPU scheduling',
      summary:
        'Schedule Ollama on GPU nodes with nvidia.com/gpu limits, tolerations for GPU taints, and optional KEDA scaling. Watch for OOMKilled when VRAM and container memory limits disagree.',
      alertmendSteps: [
        'Enable OOMKilled and CrashLoopBackOff alerts on Ollama pods',
        'Add URL checks on the inference Service and public URL',
        'Auto-restart pods after OOM with Slack context (model name, node)',
        'Warn when GPU utilization drops to zero during expected traffic',
      ],
      tip: 'Exit code 137 almost always means memory limits, not application bugs. Fix limits before you tune probe intervals.',
    },
    openwebui: {
      title: 'Open WebUI stack',
      summary:
        'Open WebUI fronts Ollama for team chat. The UI can load while the Ollama backend is down or still loading models. Monitor both layers.',
      alertmendSteps: [
        'Add a URL check on Open WebUI /health',
        'Add a separate check on the Ollama /api/tags endpoint your stack uses',
        'Alert when UI is up but Ollama checks fail',
        'Auto-restart the Ollama backend Deployment when inference checks fail',
      ],
      tip: 'Users report "the chat is broken" when Open WebUI loads but Ollama timed out. Check the backend your OLLAMA_BASE_URL points at.',
    },
  };

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

    const panel = document.getElementById('failure-playbook-panel');
    const activeTab = document.getElementById('failure-tab-' + id);
    if (panel && activeTab) panel.setAttribute('aria-labelledby', activeTab.id);

    if (failureTitle) failureTitle.textContent = mode.title;
    if (failureSummary) failureSummary.textContent = mode.summary;
    if (failureSteps) {
      failureSteps.innerHTML = mode.steps.map((s) => '<li>' + s + '</li>').join('');
    }
    if (failureCode) failureCode.textContent = mode.code;
    if (failureTip) {
      if (mode.tip && typeof mode.tip === 'object' && mode.tip.href) {
        failureTip.innerHTML =
          'Related: <a href="' + mode.tip.href + '">' + mode.tip.label + '</a>';
      } else if (typeof mode.tip === 'string' && mode.tip) {
        failureTip.textContent = mode.tip;
      } else {
        failureTip.textContent = '';
      }
    }
    const footer = failureTip && failureTip.closest('.playbookFooter');
    if (footer) footer.hidden = !(failureTip && failureTip.innerHTML.trim());

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
      mockLabel.textContent = 'OK · llama3.2 loaded';
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
    const panel = document.getElementById('mode-playbook-panel');
    const activeTab = document.getElementById('mode-tab-' + id);
    if (panel && activeTab) panel.setAttribute('aria-labelledby', activeTab.id);
    if (panelTitle) panelTitle.textContent = 'Runbook: ' + mode.title;
    if (panelSummary) panelSummary.textContent = mode.summary;
    if (panelSteps) {
      panelSteps.innerHTML = mode.alertmendSteps.map((s) => '<li>' + s + '</li>').join('');
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

  renderFailure('oom');
  renderMode('kubernetes');

  const amTabs = document.querySelectorAll('[data-am-screen]');
  const amScreens = {
    connect: document.getElementById('am-screen-connect'),
    check: document.getElementById('am-screen-check'),
    runbook: document.getElementById('am-screen-runbook'),
  };
  const amTitle = document.getElementById('am-console-title');
  const amTitles = {
    connect: 'AlertMend · Clusters',
    check: 'AlertMend · URL checks',
    runbook: 'AlertMend · Runbooks',
  };

  function renderAmScreen(id) {
    amTabs.forEach((btn) => {
      const active = btn.getAttribute('data-am-screen') === id;
      btn.classList.toggle('amConsoleTabActive', active);
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    Object.keys(amScreens).forEach((key) => {
      const el = amScreens[key];
      if (el) el.classList.toggle('hidden', key !== id);
    });
    if (amTitle && amTitles[id]) amTitle.textContent = amTitles[id];
  }

  amTabs.forEach((btn) => {
    btn.addEventListener('click', () => renderAmScreen(btn.getAttribute('data-am-screen')));
  });


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