(function () {
  const MODES = {
    library: {
      title: 'Python library',
      summary:
        'Install with pip install docling and call DocumentConverter inside your Python service, worker, or notebook pipeline. No separate HTTP server; Docling runs in-process.',
      alertmendSteps: [
        'Connect the cluster or VM where your Docling worker runs',
        'Alert on conversion errors in logs',
        'Alert when memory use gets too high',
        'Auto-restart the worker when it crashes',
      ],
      tip: 'Wrap convert() calls with timing metrics so AlertMend log alerts can fire on slow or failed parses.',
      dashboardLabel: 'app-ingestion-worker',
      alertExample: 'ConversionError rate > 5%: log alert triggered',
      metrics: { primary: '0.3%', primaryLabel: 'Job / error rate', primaryClass: 'metricValueOk', secondary: '82%', secondaryLabel: 'Memory pressure' },
    },
    cli: {
      title: 'CLI & batch jobs',
      summary:
        'Run docling from the shell for one-off conversions or schedule batch jobs via CronJob, Airflow, or CI pipelines. Exit code and job duration are your primary signals.',
      alertmendSteps: [
        'Connect the cluster where your scheduled Docling jobs run',
        'Alert when a batch job fails or misses its window',
        'Send job details to Slack so someone can investigate',
        'Optionally retry the job automatically after cleanup',
      ],
      tip: 'Use AlertMend Kubernetes alerts on CronJob failure events, or wire CI/webhook notifications for pipeline failures.',
      dashboardLabel: 'docling-batch-cron',
      alertExample: 'CronJob docling-nightly failed: 3 consecutive misses',
      metrics: { primary: '1 fail', primaryLabel: 'Job / error rate', primaryClass: 'metricValueWarn', secondary: '82%', secondaryLabel: 'Memory pressure' },
    },
    serve: {
      title: 'Docling Serve',
      summary:
        'Run the FastAPI server from docling-serve as a standalone API via pip, Docker (quay.io/docling-project/docling-serve), or on a VM. Default port is 5001 with a /health endpoint.',
      alertmendSteps: [
        'Add a URL check on your Docling API ready endpoint',
        'Alert after two failed checks in a row',
        'Optionally run a small test conversion on a schedule',
        'Restart the container automatically if checks keep failing',
      ],
      tip: 'GPU images (docling-serve-cu*) need explicit version tags; pin the image and alert on CUDA OOM separately.',
      dashboardLabel: 'docling-serve-prod',
      alertExample: 'Docling Serve /health failed: 502 from load balancer',
      metrics: { primary: '200 OK', primaryLabel: 'Health check', primaryClass: 'metricValueOk', secondary: '82%', secondaryLabel: 'Memory pressure' },
    },
    kubernetes: {
      title: 'Kubernetes',
      summary:
        'Deploy docling-serve containers as a Deployment or StatefulSet behind a Service and Ingress. Combine HTTP checks with pod-level Kubernetes observability.',
      alertmendSteps: [
        'Install the AlertMend agent in your cluster',
        'Out-of-memory and crash events on Docling show up with context',
        'Enable auto-restart when a Docling pod dies from memory pressure',
        'Add a URL check through the same address your apps use',
      ],
      tip: 'Set memory limits with headroom: Docling images are 4–9 GB and spike on 100+ page PDFs.',
      dashboardLabel: 'docling-prod',
      alertExample: 'Docling pod OOMKilled: auto-remediation triggered',
      metrics: { primary: '200 OK', primaryLabel: 'Health check', primaryClass: 'metricValueOk', secondary: '2', secondaryLabel: 'Pod restarts (1h)' },
    },
    mcp: {
      title: 'MCP server',
      summary:
        'Expose Docling to AI agents via the Model Context Protocol (MCP). Agents call document tools over stdio or HTTP depending on your MCP transport setup.',
      alertmendSteps: [
        'Add a health check on your agent gateway if it is HTTP-based',
        'Alert when tool calls start timing out',
        'Apply the same Docling health check to the parser running underneath',
        'Restart the backend when timeouts spike',
      ],
      tip: 'MCP is only as reliable as the Docling backend. Check both the agent gateway and the parser underneath.',
      dashboardLabel: 'docling-mcp-gateway',
      alertExample: 'MCP tool docling_parse timeout rate > 10%',
      metrics: { primary: '200 OK', primaryLabel: 'Health check', primaryClass: 'metricValueOk', secondary: '82%', secondaryLabel: 'Memory pressure' },
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
})();
