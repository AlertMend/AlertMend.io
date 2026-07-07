(function () {
  const MODES = {
    lite: {
      title: 'Milvus Lite',
      summary:
        'Run Milvus Lite embedded in your Python app for local or small workloads. No separate cluster; vectors live in-process or on local disk.',
      alertmendSteps: [
        'Connect the host or VM where your Milvus Lite worker runs',
        'Alert on search errors in application logs',
        'Alert when memory use gets too high on the host',
        'Auto-restart the worker process when it crashes',
      ],
      tip: 'Milvus Lite is great for dev; in production, alert on process memory and search exceptions from your app.',
      dashboardLabel: 'rag-ingestion-app',
      alertExample: 'Milvus Lite search errors > 5%: log alert triggered',
      metrics: { primary: '0.4%', primaryLabel: 'Search error rate', primaryClass: 'metricValueOk', secondary: '76%', secondaryLabel: 'Host memory' },
    },
    standalone: {
      title: 'Standalone',
      summary:
        'Run Milvus standalone with Docker Compose or on a VM. Single binary style deployment with proxy, query, and data roles colocated or split.',
      alertmendSteps: [
        'Add a URL check on your Milvus proxy health endpoint',
        'Alert after two failed checks in a row',
        'Watch container or VM memory for query pressure',
        'Restart the Milvus service automatically if checks keep failing',
      ],
      tip: 'Point health checks at the same port your PyMilvus clients use for search, not only the metrics port on 9091.',
      dashboardLabel: 'milvus-standalone',
      alertExample: 'Milvus proxy health check failed: connection refused',
      metrics: { primary: '200 OK', primaryLabel: 'Health check', primaryClass: 'metricValueOk', secondary: '88%', secondaryLabel: 'Memory pressure' },
    },
    helm: {
      title: 'Kubernetes Helm',
      summary:
        'Deploy Milvus with the official Helm chart: query nodes, data nodes, index nodes, etcd, and object storage. This is the typical production layout for RAG at scale.',
      alertmendSteps: [
        'Install the AlertMend agent in your cluster',
        'Out-of-memory and crash events on Milvus pods show up with context',
        'Enable auto-restart when query nodes die from memory pressure',
        'Add a URL check through your Milvus proxy Ingress or Service',
      ],
      tip: 'Query nodes are the usual OOM culprit. Size memory for your largest collection and enable AlertMend on the query node Deployment first.',
      dashboardLabel: 'milvus-prod',
      alertExample: 'Milvus query node OOM: auto-remediation triggered',
      metrics: { primary: '200 OK', primaryLabel: 'Health check', primaryClass: 'metricValueOk', secondary: '1', secondaryLabel: 'Pod restarts (1h)' },
    },
    cloud: {
      title: 'Zilliz Cloud',
      summary:
        'Use Zilliz Cloud managed Milvus for hosted vector search. You still need alerts when endpoints fail, latency spikes, or hybrid apps lose connectivity.',
      alertmendSteps: [
        'Add a URL check on your Zilliz Cloud endpoint',
        'Alert when search latency crosses your RAG SLO',
        'Route incidents to Slack with collection and endpoint context',
        'Document runbooks for failover to a read replica or backup cluster if you run hybrid',
      ],
      tip: 'Managed Milvus reduces ops, but your app still needs synthetic checks that prove search works end to end.',
      dashboardLabel: 'zilliz-prod',
      alertExample: 'Milvus search p95 > 2s: latency warning',
      metrics: { primary: '200 OK', primaryLabel: 'Health check', primaryClass: 'metricValueOk', secondary: '1.2s', secondaryLabel: 'p95 search' },
    },
    pymilvus: {
      title: 'PyMilvus client',
      summary:
        'Your application uses PyMilvus to talk to a remote Milvus cluster. Failures show up as client timeouts and RAG retrieval errors even when infra metrics look fine.',
      alertmendSteps: [
        'Add health checks on the Milvus endpoint your app calls',
        'Alert on rising search error rates in app logs',
        'Correlate with Milvus pod restarts in AlertMend',
        'Enable restart runbooks on the Milvus backend when client timeouts spike',
      ],
      tip: 'Monitor from the app and the cluster. Client timeouts often mean query node pressure before synthetic health checks fail.',
      dashboardLabel: 'rag-api',
      alertExample: 'PyMilvus search timeout rate > 8%',
      metrics: { primary: '8.2%', primaryLabel: 'Client timeout rate', primaryClass: 'metricValueWarn', secondary: '200 OK', secondaryLabel: 'Backend health' },
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

  renderMode('helm');


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