(function () {
  const MODES = {
    startup: {
      title: 'Startup / single cluster',
      summary:
        'One or two clusters, a small team, and a cloud bill that just started to hurt. Goal: catch waste early and fix it fast, without standing up a monitoring stack you have to maintain.',
      alertmendSteps: [
        'Connect AlertMend in a few clicks for instant cost visibility and alerts',
        'Let it flag idle nodes, over-provisioned pods, and orphaned resources',
        'Turn on rightsizing so fixes apply automatically, out of the box',
        'Add native autoscalers as a free baseline underneath',
      ],
      tip: 'AlertMend pays for itself fast: rightsizing your most expensive namespace often covers the cost in the first month.',
      dashboardLabel: 'startup-prod',
      alertExample: 'Cluster CPU utilization below 40% for 6h',
      metrics: { primary: '38%', primaryLabel: 'Cluster utilization', primaryClass: 'metricValueWarn', secondary: '$1.2k', secondaryLabel: 'Idle cost (mo)' },
    },
    scaleup: {
      title: 'Scale-up / multi-team',
      summary:
        'Several teams share clusters and nobody owns the bill. Goal: chargeback so each team sees its spend, plus continuous rightsizing as workloads change weekly.',
      alertmendSteps: [
        'Use Kubecost for team and namespace chargeback reports',
        'Run Goldilocks to surface rightsizing recommendations',
        'Add Karpenter for Spot-aware, consolidated node provisioning',
        'Let AlertMend alert and remediate when requests drift from usage',
      ],
      tip: 'Enforce per-team ResourceQuota so one workload cannot quietly consume the cluster and the budget.',
      dashboardLabel: 'platform-shared',
      alertExample: 'team-checkout requested CPU 3.1x actual usage',
      metrics: { primary: '2.4x', primaryLabel: 'Requested vs used', primaryClass: 'metricValueWarn', secondary: '54%', secondaryLabel: 'Spot coverage' },
    },
    enterprise: {
      title: 'Enterprise / many clusters',
      summary:
        'Dozens of clusters across regions and accounts. Manual tuning no longer scales. Goal: automated optimization and guardrails that hold without a human watching dashboards.',
      alertmendSteps: [
        'Standardize allocation with Kubecost or OpenCost across clusters',
        'Automate rightsizing and bin-packing with a FinOps platform',
        'Set cost guardrails that block over-provisioned workloads in CI',
        'Run AlertMend for continuous detection and auto-remediation at fleet scale',
      ],
      tip: 'Make cost a CI/CD check. Catching an over-provisioned deployment in review is far cheaper than finding it on the bill.',
      dashboardLabel: 'fleet-global',
      alertExample: 'Idle cost across fleet up 18% week over week',
      metrics: { primary: '12%', primaryLabel: 'Idle cost of total', primaryClass: 'metricValueOk', secondary: '47', secondaryLabel: 'Clusters watched' },
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
    if (dashAlertMeta) dashAlertMeta.textContent = mode.dashboardLabel + ' · Slack #finops · 12s ago';
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

  renderMode('scaleup');


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