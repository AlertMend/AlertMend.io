(function () {
  const MODES = {
    single: {
      title: 'Single LLM app',
      summary:
        'One service calling an LLM with a few tools: a chatbot, a copilot, or a RAG endpoint. Failures usually show up as timeouts, empty answers, or a spiking token bill.',
      alertmendSteps: [
        'Connect the service where your agent runs in a few clicks',
        'Add a health check that confirms the agent actually answers, not just that the process is up',
        'Alert Slack on tool-call errors, latency spikes, and token-cost jumps',
        'Auto-restart the service when it hangs or crashes',
      ],
      tip: 'Check a real end-to-end response, not just a ping. An agent can be "up" and still return nothing useful.',
      dashboardLabel: 'copilot-prod',
      alertExample: 'Agent p95 latency 22s: tool call timing out',
      metrics: { primary: '22s', primaryLabel: 'p95 latency', primaryClass: 'metricValueWarn', secondary: '4.1%', secondaryLabel: 'Tool error rate' },
    },
    autonomous: {
      title: 'Autonomous agent',
      summary:
        'A long-running agent that plans and acts on its own. The dangerous failures are silent: infinite loops, runaway tool calls, and token blowups that only surface on the invoice.',
      alertmendSteps: [
        'Connect the worker or cluster running the agent',
        'Trace every run so loops and abnormal token use show up as anomalies',
        'Send the AI root-cause summary to Slack so someone can see why it stalled',
        'Auto-restart the service when a run hangs or the agent crashes',
      ],
      tip: 'Traces make a looping run obvious: it runs far longer and burns more tokens than normal, so AlertMend alerts before it spends all night.',
      dashboardLabel: 'agent-worker',
      alertExample: 'Agent run looping: 180+ steps, far above normal',
      metrics: { primary: '180+', primaryLabel: 'Steps this run', primaryClass: 'metricValueWarn', secondary: '$41', secondaryLabel: 'Token cost / run' },
    },
    multi: {
      title: 'Multi-agent system',
      summary:
        'Several agents handing off to each other. One slow or failing agent stalls the whole chain, and the root cause is hard to find across handoffs.',
      alertmendSteps: [
        'Connect every service in the agent graph',
        'Trace the handoffs across agents and alert when the chain stalls',
        'Use AI root-cause analysis to point at the agent that actually broke',
        'Auto-restart the failed agent so the chain keeps moving',
      ],
      tip: 'Watch the handoffs, not just each agent. Most multi-agent outages hide in the gaps between them.',
      dashboardLabel: 'agent-graph-prod',
      alertExample: 'Handoff to researcher agent failing: chain stalled',
      metrics: { primary: '3', primaryLabel: 'Stalled handoffs', primaryClass: 'metricValueWarn', secondary: '61%', secondaryLabel: 'Run success rate' },
    },
    mcp: {
      title: 'MCP tool server',
      summary:
        'Agents call tools over the Model Context Protocol. The agent is only as reliable as the tool backend, and timeouts there look like the agent "just stopping".',
      alertmendSteps: [
        'Add a health check on your MCP server endpoint',
        'Alert when tool calls start timing out or erroring',
        'Apply the same check to the service running underneath the tool',
        'Restart the backend automatically when timeouts spike',
      ],
      tip: 'MCP is only as reliable as the tool behind it. Watch both the gateway and the service underneath.',
      dashboardLabel: 'mcp-gateway',
      alertExample: 'MCP tool search timeout rate above 10%',
      metrics: { primary: '12%', primaryLabel: 'Tool timeout rate', primaryClass: 'metricValueWarn', secondary: '200 OK', secondaryLabel: 'Gateway health' },
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
