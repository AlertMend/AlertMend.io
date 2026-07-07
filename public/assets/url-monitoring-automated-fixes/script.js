(function () {
  const STATUS_MODES = {
    '500': {
      title: 'HTTP 500 Internal Server Error',
      summary:
        'The server received the request but the application crashed or threw an unhandled exception. Often follows a bad deploy or a dependency timeout.',
      steps: [
        'Check recent deploys and error rate spike timing',
        'Read pod logs for stack traces',
        'Auto-fix: rollout restart if errors started after deploy',
        'Rollback if restart does not clear 500 within 2 minutes',
        'Re-probe the public URL twice before closing',
      ],
      code: `# Diagnose
kubectl rollout history deployment/api -n production
kubectl logs -l app=api -n production --tail=100

# Auto-fix: restart
kubectl rollout restart deployment/api -n production
kubectl rollout status deployment/api -n production --timeout=120s

# Verify (external monitor runs the same check)
curl -sf -o /dev/null -w "%{http_code}\\n" https://api.example.com/health`,
      tip: 'Point your URL monitor at /healthz (public, shallow). Keep liveness probes process-only.',
      autoFix: 'Rollout restart · Rollback deployment',
    },
    '502': {
      title: 'HTTP 502 Bad Gateway',
      summary:
        'Ingress or load balancer could not get a valid upstream response. Often a deploy race: pod terminated while still in the endpoint pool.',
      steps: [
        'Check endpoints are non-empty and pods are Ready',
        'Read ingress controller logs for upstream errors',
        'Auto-fix: delete unhealthy pods; add preStop if deploy race',
        'Enable proxy-next-upstream retry on ingress',
        'Re-check the public URL, not in-cluster curl alone',
      ],
      code: `# Diagnose
kubectl get endpoints api-service -n production
kubectl get pods -l app=api -n production
kubectl logs -n ingress-nginx -l app.kubernetes.io/name=ingress-nginx --tail=50

# Fix deploy race: preStop + readiness (see YAML below)
kubectl delete pod -l app=api --field-selector=status.phase!=Running -n production

# Ingress: retry on 502
# nginx.ingress.kubernetes.io/proxy-next-upstream: "error timeout http_502"`,
      tip: 'See /blog/kubernetes-502-bad-gateway-error-fix for the full ingress playbook.',
      autoFix: 'Delete stuck pods · preStop sleep 5 · proxy-next-upstream',
    },
    '503': {
      title: 'HTTP 503 Service Unavailable',
      summary:
        'No healthy backends available. Empty endpoints, failing readiness probes, or all pods CrashLoopBackOff.',
      steps: [
        'kubectl get endpoints: empty ENDPOINTS means 503',
        'describe pod: readiness probe failures',
        'Auto-fix: rollout restart deployment',
        'Scale up if only one replica was overloaded',
        'Re-probe until 200 returns twice consecutively',
      ],
      code: `# Diagnose
kubectl get endpoints api-service -n production
kubectl describe pod -l app=api -n production | grep -A6 "Readiness"

# Auto-fix
kubectl rollout restart deployment/api -n production
kubectl scale deployment/api --replicas=3 -n production

# Verify
curl -sf https://api.example.com/health`,
      tip: 'Deep dive: /blog/503-no-healthy-upstream (nginx, Istio, Envoy variants).',
      autoFix: 'Rollout restart · Scale replicas up',
    },
    '504': {
      title: 'HTTP 504 Gateway Timeout',
      summary:
        'Proxy timed out waiting for upstream. Hung pod, slow DB, or ingress read timeout shorter than app latency.',
      steps: [
        'Compare p95 latency per pod vs ingress timeout',
        'Check DB and downstream dependency latency',
        'Auto-fix: restart hung pod; scale out if load-driven',
        'Tune ingress timeouts only after fixing root cause',
        'Confirm URL monitor p95 drops below baseline',
      ],
      code: `# Diagnose slow pod
kubectl top pods -l app=api -n production
kubectl logs -l app=api -n production --tail=50 | grep -i timeout

# Auto-fix hung replica
kubectl delete pod api-7d4f8b9c-xk2lm -n production

# Ingress timeout (after fixing app slowness)
# nginx.ingress.kubernetes.io/proxy-read-timeout: "120"`,
      tip: 'Alert when sustained p95 exceeds baseline x 1.5 for two windows, not a fixed 3s threshold.',
      autoFix: 'Delete hung pod · Scale out · Tune timeouts last',
    },
  };

  const PRESTOP_YAML = `lifecycle:
  preStop:
    exec:
      command: ["sh", "-c", "sleep 5"]
readinessProbe:
  httpGet:
    path: /healthz/ready
    port: 8080
  periodSeconds: 5
  failureThreshold: 2
livenessProbe:
  httpGet:
    path: /healthz/live
    port: 8080
  periodSeconds: 15
  failureThreshold: 3`;

  const statusButtons = document.querySelectorAll('[data-status-code]');
  const panelTitle = document.getElementById('status-playbook-title');
  const panelSummary = document.getElementById('status-playbook-summary');
  const panelSteps = document.getElementById('status-playbook-steps');
  const panelCode = document.getElementById('status-playbook-code');
  const panelTip = document.getElementById('status-playbook-tip');
  const panelAutoFix = document.getElementById('status-playbook-autofix');
  const mockStatus = document.getElementById('mock-status-code');
  const mockLabel = document.getElementById('mock-status-label');
  const mockDot = document.getElementById('mock-status-dot');

  function renderStatus(code) {
    const mode = STATUS_MODES[code];
    if (!mode) return;

    statusButtons.forEach((btn) => {
      const active = btn.getAttribute('data-status-code') === code;
      btn.classList.toggle('modeCardActive', active);
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
    });

    if (panelTitle) panelTitle.textContent = mode.title;
    if (panelSummary) panelSummary.textContent = mode.summary;
    if (panelSteps) {
      panelSteps.innerHTML = mode.steps.map((s) => '<li>' + s + '</li>').join('');
    }
    if (panelCode) {
      var codeText = mode.code;
      if (code === '502') codeText = mode.code + '\n\n# Deployment snippet\n' + PRESTOP_YAML;
      panelCode.textContent = codeText;
    }
    if (panelTip) panelTip.textContent = mode.tip;
    if (panelAutoFix) panelAutoFix.textContent = 'Safe auto-fix: ' + mode.autoFix;

    if (mockStatus) mockStatus.textContent = code;
    if (mockLabel) {
      mockLabel.textContent =
        code === '503'
          ? 'Service Unavailable'
          : code === '502'
            ? 'Bad Gateway'
            : code === '504'
              ? 'Gateway Timeout'
              : 'Internal Server Error';
      mockLabel.className = 'mockStatusLabel mockStatusLabelError';
    }
    if (mockDot) mockDot.className = 'mockStatusDot mockStatusDotError';
  }

  statusButtons.forEach((btn) => {
    btn.addEventListener('click', () => renderStatus(btn.getAttribute('data-status-code')));
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

  const recoverBtn = document.getElementById('mock-recover-btn');
  if (recoverBtn) {
    recoverBtn.addEventListener('click', () => {
      if (mockStatus) mockStatus.textContent = '200';
      if (mockLabel) {
        mockLabel.textContent = 'OK';
        mockLabel.className = 'mockStatusLabel mockStatusLabelOk';
      }
      if (mockDot) mockDot.className = 'mockStatusDot mockStatusDotOk';
    });
  }

  renderStatus('503');


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