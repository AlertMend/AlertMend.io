(function () {
  const MODES = {
    docker: {
      title: 'Docker Compose',
      summary:
        'Run Langfuse with Docker Compose: langfuse-web, langfuse-worker, Postgres, ClickHouse, Redis, and MinIO on a VM or single host. Default web port is 3000.',
      alertmendSteps: [
        'Connect the host or VM where your Compose stack runs',
        'Add a URL check on /api/public/ready for langfuse-web',
        'Add a second check on worker /api/health (port 3030)',
        'Auto-restart containers when checks fail repeatedly',
      ],
      tip: 'Use ?failIfDatabaseUnavailable=true on health checks when you want Postgres connectivity included, not just "process is up."',
      dashboardLabel: 'langfuse-compose',
      alertExample: 'Langfuse /api/public/ready failed: connection refused',
      metrics: { primary: '200 OK', primaryLabel: 'Ready check', primaryClass: 'metricValueOk', secondary: '88%', secondaryLabel: 'Host memory' },
    },
    kubernetes: {
      title: 'Kubernetes Helm',
      summary:
        'Deploy Langfuse with the community Helm chart: separate Deployments for langfuse-web and langfuse-worker behind Ingress. This is the typical production layout for self-hosted LLM observability.',
      alertmendSteps: [
        'Install the AlertMend agent in your cluster',
        'Add URL checks through the same Ingress your SDKs use',
        'Enable auto-restart when web or worker pods fail readiness',
        'Probe /api/public/health at the pod root path, not through a custom base path prefix',
      ],
      tip: 'Kubernetes liveness probes must hit /api/public/health on localhost inside the pod. Ingress base paths do not apply to probe URLs.',
      dashboardLabel: 'langfuse-prod',
      alertExample: 'Langfuse worker health failed: auto-remediation triggered',
      metrics: { primary: '200 OK', primaryLabel: 'Ready check', primaryClass: 'metricValueOk', secondary: '1', secondaryLabel: 'Pod restarts (1h)' },
    },
    cloud: {
      title: 'Langfuse Cloud',
      summary:
        'Use Langfuse Cloud for hosted LLM observability. You still need synthetic checks when your region endpoint fails, latency spikes, or hybrid apps lose connectivity.',
      alertmendSteps: [
        'Add a URL check on your Langfuse Cloud project endpoint',
        'Alert when ready checks fail or latency crosses your SLO',
        'Route incidents to Slack with project and environment context',
        'Document runbooks for failover if you mirror traces to self-hosted',
      ],
      tip: 'Managed Langfuse reduces ops, but your apps still need checks that prove trace ingestion works end to end.',
      dashboardLabel: 'langfuse-cloud',
      alertExample: 'Langfuse Cloud ready check failed: 503 from edge',
      metrics: { primary: '200 OK', primaryLabel: 'Ready check', primaryClass: 'metricValueOk', secondary: '1.1s', secondaryLabel: 'p95 API' },
    },
    worker: {
      title: 'Worker service',
      summary:
        'langfuse-worker handles async trace ingestion and background jobs. It exposes /api/health on port 3030 and validates database connectivity on every check.',
      alertmendSteps: [
        'Add a URL check on the worker /api/health endpoint',
        'Alert when worker checks fail even if the web UI loads',
        'Enable auto-restart on the worker Deployment or container',
        'Correlate worker failures with Postgres or ClickHouse alerts',
      ],
      tip: 'Many outages look like "Langfuse is fine" in the UI while the worker stopped ingesting. Always monitor the worker separately.',
      dashboardLabel: 'langfuse-worker',
      alertExample: 'Worker /api/health returned 503: DB unreachable',
      metrics: { primary: '503', primaryLabel: 'Worker health', primaryClass: 'metricValueWarn', secondary: '200 OK', secondaryLabel: 'Web ready' },
    },
    sdk: {
      title: 'SDK clients',
      summary:
        'Your apps use Langfuse Python or TypeScript SDKs to send traces. Failures show up as ingestion errors in app logs even when infra metrics look fine.',
      alertmendSteps: [
        'Add health checks on the Langfuse endpoint your SDK calls',
        'Alert on rising ingestion error rates in application logs',
        'Correlate with Langfuse pod restarts in AlertMend',
        'Enable restart runbooks on the Langfuse backend when client errors spike',
      ],
      tip: 'Monitor from the app and the cluster. SDK timeouts often mean worker or database pressure before synthetic checks fail.',
      dashboardLabel: 'llm-api',
      alertExample: 'Langfuse ingestion error rate > 8%',
      metrics: { primary: '8.2%', primaryLabel: 'SDK error rate', primaryClass: 'metricValueWarn', secondary: '200 OK', secondaryLabel: 'Backend ready' },
    },
  };

  const modeButtons = document.querySelectorAll('[data-mode-id]');
  const panelTitle = document.getElementById('mode-playbook-title');
  const panelSummary = document.getElementById('mode-playbook-summary');
  const panelSteps = document.getElementById('mode-playbook-steps');
  const panelTip = document.getElementById('mode-playbook-tip');
  const dashTitle = document.getElementById('dash-title');
  const dashAlert = document.getElementById('dash-alert');
  const dashAlertMeta = document.getElementById('dash-alert-meta');
  const metricPrimary = document.getElementById('metric-primary');
  const metricPrimaryLabel = document.getElementById('metric-primary-label');
  const metricSecondary = document.getElementById('metric-secondary');
  const metricSecondaryLabel = document.getElementById('metric-secondary-label');

  function renderMode(id) {
    const mode = MODES[id];
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
    if (panelTip) panelTip.textContent = mode.tip;
    if (dashTitle) dashTitle.textContent = 'AlertMend · ' + mode.dashboardLabel;
    if (dashAlert) dashAlert.textContent = mode.alertExample;
    if (dashAlertMeta) dashAlertMeta.textContent = mode.dashboardLabel + ' · Slack #incidents · 12s ago';
    if (metricPrimary) {
      metricPrimary.textContent = mode.metrics.primary;
      metricPrimary.className = 'metricValue ' + mode.metrics.primaryClass;
    }
    if (metricPrimaryLabel) metricPrimaryLabel.textContent = mode.metrics.primaryLabel;
    if (metricSecondary) metricSecondary.textContent = mode.metrics.secondary;
    if (metricSecondaryLabel) metricSecondaryLabel.textContent = mode.metrics.secondaryLabel;
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

  renderMode('kubernetes');


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