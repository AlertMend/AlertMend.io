(function () {
  const scenarios = {
    alertmanager: {
      output: 'Prometheus fires HighErrorRate\nAlertmanager groups + routes\nWebhook receiver sends to AlertMend',
      title: 'Use Alertmanager routing to send only actionable alerts to the escalation layer.',
      copy: 'Keep Alertmanager for grouping, inhibition, and routing. Add a webhook receiver for high-urgency routes that need WhatsApp and phone call escalation.',
      commands: 'receivers:\n- name: alertmend-escalation\n  webhook_configs:\n  - url: https://api.alertmend.io/webhooks/alertmanager\n\nroute:\n  receiver: default\n  routes:\n  - matchers: [severity=\"critical\"]\n    receiver: alertmend-escalation',
      fix: 'Do not send every warning to a call. Send critical, customer-impacting, or unacknowledged alerts into the escalation path.',
    },
    grafana: {
      output: 'Grafana alert rule fires\nNotification policy chooses contact point\nWebhook contact point calls escalation API',
      title: 'Use Grafana contact points and notification policies as the first router.',
      copy: 'Grafana can keep owning alert rules and dashboards. The escalation layer should receive the clean incident payload, dedupe it, and decide WhatsApp versus call.',
      commands: 'Contact point: Webhook\nURL: https://api.alertmend.io/webhooks/grafana\n\nPolicy:\nseverity=critical → webhook escalation\nteam=payments → payments on-call\nrepeat interval: 30m',
      fix: 'Keep dashboards in Grafana. Move human wake-up logic into a policy that understands severity, owner, business hours, and acknowledgment.',
    },
    datadog: {
      output: 'Datadog monitor enters Alert\nWebhook integration posts monitor payload\nEscalation policy starts WhatsApp + call flow',
      title: 'Use Datadog webhooks when the monitor needs a human response path.',
      copy: 'Datadog remains the monitor source. The webhook hands AlertMend the monitor, tags, service, runbook URL, and escalation metadata.',
      commands: '@webhook-alertmend-escalation\n\nPayload fields:\nmonitor_id, title, service, env,\nseverity, tags, runbook_url,\ntriggered_at',
      fix: 'Route only monitors with real action requirements. Dashboards and low-priority monitor noise should stay out of phone-call escalation.',
    },
    cloudwatch: {
      output: 'CloudWatch alarm changes to ALARM\nSNS or automation target receives the state change\nEscalation starts if impact rules match',
      title: 'Use CloudWatch alarm actions for AWS-native signals.',
      copy: 'CloudWatch alarms can notify through actions. Put a small normalization layer between AWS alarms and people so one noisy metric does not create ten calls.',
      commands: 'Alarm action → SNS topic\nSNS → webhook/Lambda/AlertMend endpoint\n\nInclude:\nAlarmName, NewStateValue,\nRegion, Account, Trigger,\nRunbookURL',
      fix: 'Composite alarms and tags help reduce noise before escalation. The call path should receive the incident, not every underlying metric breach.',
    },
    generic: {
      output: 'Existing tool sends webhook/email\nAlertMend normalizes severity + owner\nEscalates by WhatsApp, call, or both',
      title: 'Any tool that can send a webhook or email can feed the escalation path.',
      copy: 'This is useful for older Nagios/Icinga/Zabbix setups, uptime monitors, custom scripts, and SaaS tools that do not have native WhatsApp or call escalation.',
      commands: 'POST /webhooks/generic\n{\n  "title": "Checkout API down",\n  "severity": "critical",\n  "service": "checkout",\n  "owner": "payments",\n  "runbook": "https://..."\n}',
      fix: 'Normalize payloads before paging people. The escalation layer should know owner, urgency, dedupe key, and the next safe action.',
    },
  };

  const output = document.querySelector('[data-scenario-output]');
  const title = document.querySelector('[data-scenario-title]');
  const copy = document.querySelector('[data-scenario-copy]');
  const commands = document.querySelector('[data-scenario-commands]');
  const fix = document.querySelector('[data-scenario-fix]');
  const tabs = Array.from(document.querySelectorAll('[data-scenario]'));

  function activateScenario(key) {
    const scenario = scenarios[key] || scenarios.alertmanager;
    if (output) output.textContent = scenario.output;
    if (title) title.textContent = scenario.title;
    if (copy) copy.textContent = scenario.copy;
    if (commands) commands.textContent = scenario.commands;
    if (fix) fix.textContent = scenario.fix;

    tabs.forEach((tab) => {
      const active = tab.getAttribute('data-scenario') === key;
      tab.classList.toggle('isActive', active);
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => activateScenario(tab.getAttribute('data-scenario')));
  });

  document.querySelectorAll('.faqQuestion').forEach((button) => {
    button.addEventListener('click', () => {
      const answer = button.parentElement && button.parentElement.querySelector('.faqAnswer');
      const chevron = button.querySelector('.faqChevron');
      const nextExpanded = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded', nextExpanded ? 'true' : 'false');
      if (answer) answer.hidden = !nextExpanded;
      if (chevron) chevron.classList.toggle('faqChevronOpen', nextExpanded);
    });
  });
})();
