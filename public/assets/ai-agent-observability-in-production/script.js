(function () {
  const MODES = {
    single: {
      title: 'Single LLM app',
      summary:
        'One service calling an LLM with a few tools: a chatbot, a copilot, or a RAG endpoint. In production it fails as the service crashing, hanging, or slowing to a crawl.',
      alertmendSteps: [
        'Connect the service where your agent runs in a few clicks',
        'Add a health check that confirms the agent actually answers, not just that the process is up',
        'Alert Slack on crashes, latency spikes, and restarts',
        'Auto-restart the service when it hangs or crashes',
      ],
      tip: 'Check a real end-to-end response, not just a ping. A service can be "up" and still return nothing useful.',
      dashboardLabel: 'copilot-prod',
      alertExample: 'Agent p95 latency 22s: service degrading',
      metrics: { primary: '22s', primaryLabel: 'p95 latency', primaryClass: 'metricValueWarn', secondary: '4.1%', secondaryLabel: 'Error rate' },
    },
    autonomous: {
      title: 'Autonomous agent',
      summary:
        'A long-running agent that plans and acts on its own. On the infrastructure side it fails as memory exhaustion, crashes, or a hung process that a basic check misses.',
      alertmendSteps: [
        'Connect the worker or cluster running the agent',
        'Watch the worker memory, CPU, and restarts, not just whether it is up',
        'Send the AI root-cause summary to Slack so on-call sees what happened',
        'Auto-restart the service when it hangs or the worker crashes',
      ],
      tip: 'A stuck run usually shows as pegged CPU or climbing memory. AlertMend alerts on that and restarts before it takes the box down.',
      dashboardLabel: 'agent-worker',
      alertExample: 'Worker OOMKilled: out of memory on large job',
      metrics: { primary: '92%', primaryLabel: 'Memory pressure', primaryClass: 'metricValueWarn', secondary: '3', secondaryLabel: 'Restarts (1h)' },
    },
    multi: {
      title: 'Multi-agent system',
      summary:
        'Several agent services handing off to each other. One that crashes or hangs stalls the whole chain, and it is hard to tell which service broke.',
      alertmendSteps: [
        'Connect every service in the agent graph',
        'Alert when any agent service crashes or stops responding',
        'Use AI root-cause analysis to point at the service that actually broke',
        'Auto-restart the failed service so the chain keeps moving',
      ],
      tip: 'Watch every service in the graph. A single crashed agent quietly stalls everything downstream.',
      dashboardLabel: 'agent-graph-prod',
      alertExample: 'Researcher agent crashed: chain stalled',
      metrics: { primary: '1', primaryLabel: 'Crashed service', primaryClass: 'metricValueWarn', secondary: '5', secondaryLabel: 'Restarts (1h)' },
    },
    mcp: {
      title: 'MCP tool server',
      summary:
        'Agents call tools over the Model Context Protocol. The agent is only as reliable as the tool backend, and an unresponsive backend looks like the agent "just stopping".',
      alertmendSteps: [
        'Add a health check on your MCP server endpoint',
        'Alert when the MCP endpoint slows down or errors',
        'Apply the same check to the service running underneath the tool',
        'Restart the backend automatically when it stops responding',
      ],
      tip: 'MCP is only as reliable as the backend behind it. Watch both the gateway and the service underneath.',
      dashboardLabel: 'mcp-gateway',
      alertExample: 'MCP endpoint error rate above 10%',
      metrics: { primary: '12%', primaryLabel: 'Endpoint error rate', primaryClass: 'metricValueWarn', secondary: '200 OK', secondaryLabel: 'Gateway health' },
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
    if (panelTitle) panelTitle.textContent = 'Playbook: ' + mode.title;
    if (panelSummary) panelSummary.textContent = mode.summary;
    if (panelSteps) {
      panelSteps.innerHTML = mode.alertmendSteps.map((s) => '<li>' + s + '</li>').join('');
    }
    if (panelTip) panelTip.textContent = mode.tip;
    if (dashTitle) dashTitle.textContent = 'AlertMend · ' + mode.dashboardLabel;
    if (dashAlert) dashAlert.textContent = mode.alertExample;
    if (dashAlertMeta) dashAlertMeta.textContent = mode.dashboardLabel + ' · Slack #incidents · 9s ago';
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

  renderMode('autonomous');

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
