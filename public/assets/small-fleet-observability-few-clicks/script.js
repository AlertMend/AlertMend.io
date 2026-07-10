(function () {
  const MODES = {
    docker: {
      title: 'Docker Compose',
      summary:
        'A few services defined in compose.yml on one or two VMs. Containers restart with the compose stack. Logs live in docker logs until you centralize them.',
      alertmendSteps: [
        'Connect the VM that runs docker compose',
        'Enable container metrics, logs, and traces for api, worker, and db-facing services',
        'Add a URL check on the public hostname users hit',
        'Route failures to Slack and set primary / secondary on-call escalation',
      ],
      tip: 'Alert on container exit and restart count, not only host CPU. Compose can look healthy while one service is crash-looping.',
      dashboardLabel: 'compose-prod',
      alertExample: 'api container exited: Slack incident + escalate if unacked',
      metrics: {
        primary: '200 OK',
        primaryLabel: 'URL check',
        primaryClass: 'metricValueOk',
        secondary: '1',
        secondaryLabel: 'Container restarts (1h)',
      },
    },
    systemd: {
      title: 'Systemd + Docker',
      summary:
        'Host-level services under systemd (nginx, agents) plus app containers. You need both journalctl and docker logs when something breaks.',
      alertmendSteps: [
        'Connect each VM so host metrics and journal logs appear',
        'Attach container signals for the Docker workloads on those hosts',
        'Alert when a critical systemd unit goes inactive or a container exits',
        'Escalate to secondary if the primary does not acknowledge in Slack',
      ],
      tip: 'Treat nginx and the app container as one user path: URL check outside, unit and container health inside.',
      dashboardLabel: 'vm-systemd-prod',
      alertExample: 'nginx.service inactive on vm-01: on-call paged',
      metrics: {
        primary: 'active',
        primaryLabel: 'nginx.service',
        primaryClass: 'metricValueOk',
        secondary: '72%',
        secondaryLabel: 'Disk used',
      },
    },
    multi: {
      title: 'Multi-VM fleet',
      summary:
        'Three to four hosts with roles split across app, worker, and data. Incidents often span hosts, so one workspace beats four SSH sessions.',
      alertmendSteps: [
        'Connect all hosts into one AlertMend workspace',
        'Tag by role (app, worker, data) so alerts carry context',
        'Enable logs, metrics, and traces across the path users hit',
        'One on-call schedule covers the whole fleet with escalation',
      ],
      tip: 'Correlate by request id or service name. A worker on vm-03 can break an API that still looks up on vm-01.',
      dashboardLabel: 'fleet-4vm',
      alertExample: 'worker latency spike on vm-03: traces attached',
      metrics: {
        primary: '4/4',
        primaryLabel: 'Hosts online',
        primaryClass: 'metricValueOk',
        secondary: '3',
        secondaryLabel: 'Open incidents',
      },
    },
    hybrid: {
      title: 'Hybrid cloud VMs',
      summary:
        'Some hosts in a cloud provider, some on-prem or another region. Same failure modes, harder to see in one console without a unified layer.',
      alertmendSteps: [
        'Connect every VM regardless of cloud or on-prem location',
        'Keep the same log, metric, and trace pipeline in AlertMend',
        'Use synthetic URL checks from outside so regional outages still page you',
        'Escalate across time zones with a clear primary and secondary rotation',
      ],
      tip: 'Do not rely on a single cloud console. External checks plus unified signals catch cross-environment failures.',
      dashboardLabel: 'hybrid-fleet',
      alertExample: 'External URL check failed: escalate to secondary',
      metrics: {
        primary: '502',
        primaryLabel: 'URL check',
        primaryClass: 'metricValueWarn',
        secondary: '2',
        secondaryLabel: 'Escalation step',
      },
    },
  }

  const modeButtons = document.querySelectorAll('[data-mode-id]')
  const panelTitle = document.getElementById('mode-playbook-title')
  const panelSummary = document.getElementById('mode-playbook-summary')
  const panelSteps = document.getElementById('mode-playbook-steps')
  const panelTip = document.getElementById('mode-playbook-tip')
  const dashTitle = document.getElementById('dash-title')
  const dashAlert = document.getElementById('dash-alert')
  const dashAlertMeta = document.getElementById('dash-alert-meta')
  const metricPrimary = document.getElementById('metric-primary')
  const metricPrimaryLabel = document.getElementById('metric-primary-label')
  const metricSecondary = document.getElementById('metric-secondary')
  const metricSecondaryLabel = document.getElementById('metric-secondary-label')

  function renderMode(id) {
    const mode = MODES[id]
    if (!mode) return
    modeButtons.forEach((btn) => {
      const active = btn.getAttribute('data-mode-id') === id
      btn.classList.toggle('modeCardActive', active)
      btn.setAttribute('aria-selected', active ? 'true' : 'false')
    })
    if (panelTitle) panelTitle.textContent = 'Runbook: ' + mode.title
    if (panelSummary) panelSummary.textContent = mode.summary
    if (panelSteps) {
      panelSteps.innerHTML = mode.alertmendSteps.map((s) => '<li>' + s + '</li>').join('')
    }
    if (panelTip) panelTip.textContent = mode.tip
    if (dashTitle) dashTitle.textContent = 'AlertMend · ' + mode.dashboardLabel
    if (dashAlert) dashAlert.textContent = mode.alertExample
    if (dashAlertMeta) dashAlertMeta.textContent = mode.dashboardLabel + ' · Slack #oncall · 8s ago'
    if (metricPrimary) {
      metricPrimary.textContent = mode.metrics.primary
      metricPrimary.className = 'metricValue ' + mode.metrics.primaryClass
    }
    if (metricPrimaryLabel) metricPrimaryLabel.textContent = mode.metrics.primaryLabel
    if (metricSecondary) metricSecondary.textContent = mode.metrics.secondary
    if (metricSecondaryLabel) metricSecondaryLabel.textContent = mode.metrics.secondaryLabel
  }

  modeButtons.forEach((btn) => {
    btn.addEventListener('click', () => renderMode(btn.getAttribute('data-mode-id')))
  })

  document.querySelectorAll('[data-faq-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faqItem')
      const answer = item && item.querySelector('.faqAnswer')
      const chevron = btn.querySelector('.faqChevron')
      const open = btn.getAttribute('aria-expanded') === 'true'
      btn.setAttribute('aria-expanded', open ? 'false' : 'true')
      if (answer) answer.classList.toggle('hidden', open)
      if (chevron) chevron.classList.toggle('faqChevronOpen', !open)
    })
  })

  renderMode('docker')

  const signupForm = document.getElementById('blog-signup-form')
  const signupStatus = document.getElementById('blog-signup-status')
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault()
      const input = signupForm.querySelector('input[type="email"]')
      const button = signupForm.querySelector('button[type="submit"]')
      const email = input && input.value ? input.value.trim() : ''
      if (!email || !button || button.disabled) return
      const blogTitleEl = document.querySelector('.article-header h1, header.article-header--cred h1, h1')
      const blogTitle = (
        signupForm.getAttribute('data-blog-title') ||
        (blogTitleEl && blogTitleEl.textContent) ||
        document.title ||
        'this blog post'
      )
        .trim()
        .replace(/\s*\|\s*AlertMend.*$/i, '')
      const buttonLabel = button.textContent
      button.disabled = true
      button.textContent = 'Signing up…'
      if (signupStatus) {
        signupStatus.hidden = true
        signupStatus.textContent = ''
        signupStatus.className = 'signup-status'
      }
      try {
        const response = await fetch('https://api.alertmend.io/contact', {
          method: 'POST',
          headers: { Accept: 'application/json, text/plain, */*', 'Content-Type': 'application/json' },
          body: JSON.stringify({
            full_name: 'Blog subscriber',
            company: '',
            email,
            message:
              'Newsletter signup from the AlertMend blog post "' +
              blogTitle +
              '". Please add this email to the blog and product updates list.',
            source: 'blog_signup',
          }),
        })
        if (response.ok) {
          if (input) input.value = ''
          if (signupStatus) {
            signupStatus.hidden = false
            signupStatus.textContent = "Thanks! You're on the list."
            signupStatus.className = 'signup-status success'
          }
        } else {
          const data = await response.json().catch(() => ({}))
          if (signupStatus) {
            signupStatus.hidden = false
            signupStatus.textContent = data.error || data.message || 'Something went wrong. Please try again.'
            signupStatus.className = 'signup-status error'
          }
        }
      } catch {
        if (signupStatus) {
          signupStatus.hidden = false
          signupStatus.textContent = 'Network error. Please check your connection and try again.'
          signupStatus.className = 'signup-status error'
        }
      } finally {
        button.disabled = false
        button.textContent = buttonLabel || 'Sign up'
      }
    })
  }
})()
