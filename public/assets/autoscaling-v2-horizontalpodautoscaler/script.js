(function () {
  var scenarios = {
    spike: {
      title: 'CPU spike',
      observe: 'CPU 140%',
      calculate: 'ceil(3 × 140/70)',
      recommend: '6 replicas',
      realize: '6 Ready',
      formula: '<span>desiredReplicas</span> = ceil(3 × 140 ÷ 70) = <strong>6</strong>',
      diagnosisTitle: 'Scale-up is working',
      diagnosis: 'HPA doubles the Deployment from 3 to 6 replicas. Verify the new pods become Ready and latency falls.'
    },
    unknown: {
      title: 'Metric unavailable',
      observe: 'CPU <unknown>',
      calculate: 'No valid ratio',
      recommend: 'No decision',
      realize: '3 remain',
      formula: '<span>desiredReplicas</span> = unavailable — metric query failed',
      diagnosisTitle: 'The loop stopped at the metric',
      diagnosis: 'Check ScalingActive, metrics.k8s.io, the adapter, selectors, and container resource requests. Restarting the app does not repair this path.'
    },
    pending: {
      title: 'Desired replicas, Pending pods',
      observe: 'CPU 163%',
      calculate: 'ceil(6 × 163/70)',
      recommend: '14 replicas',
      realize: '8 Ready · 6 Pending',
      formula: '<span>HPA result</span> = 14 desired; <strong>capacity result = 8 Ready</strong>',
      diagnosisTitle: 'HPA worked; scheduling did not',
      diagnosis: 'Inspect Pending pod Events, quotas, affinity, taints, and node-autoscaler limits. HPA cannot add nodes.'
    },
    down: {
      title: 'Load fell, replicas stayed high',
      observe: 'CPU 22%',
      calculate: 'ceil(12 × 22/70)',
      recommend: '4 replicas',
      realize: '12 during window',
      formula: '<span>raw recommendation</span> = 4; <strong>stabilized = 12</strong>',
      diagnosisTitle: 'Scale-down is being stabilized',
      diagnosis: 'Inspect the scale-down window, all configured metrics, missing-metric events, minReplicas, and scaleDown policies before changing the target.'
    }
  }

  var simulator = document.querySelector('[data-hpa-simulator]')
  var animationTimers = []

  function clearTimers() {
    animationTimers.forEach(function (timer) { window.clearTimeout(timer) })
    animationTimers = []
  }

  function animateLoop() {
    if (!simulator) return
    clearTimers()
    var nodes = simulator.querySelectorAll('[data-step]')
    nodes.forEach(function (node) { node.classList.remove('active') })
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      nodes.forEach(function (node) { node.classList.add('active') })
      return
    }
    nodes.forEach(function (node, index) {
      animationTimers.push(window.setTimeout(function () {
        node.classList.add('active')
      }, 160 + index * 420))
    })
  }

  function selectScenario(key) {
    if (!simulator || !scenarios[key]) return
    var data = scenarios[key]
    simulator.querySelector('[data-sim-title]').textContent = data.title
    simulator.querySelector('[data-observe]').textContent = data.observe
    simulator.querySelector('[data-calculate]').textContent = data.calculate
    simulator.querySelector('[data-recommend]').textContent = data.recommend
    simulator.querySelector('[data-realize]').textContent = data.realize
    simulator.querySelector('[data-formula]').innerHTML = data.formula
    simulator.querySelector('[data-diagnosis-title]').textContent = data.diagnosisTitle
    simulator.querySelector('[data-diagnosis]').textContent = data.diagnosis
    simulator.querySelectorAll('[data-scenario]').forEach(function (tab) {
      var selected = tab.getAttribute('data-scenario') === key
      tab.classList.toggle('active', selected)
      tab.setAttribute('aria-selected', selected ? 'true' : 'false')
    })
    animateLoop()
  }

  if (simulator) {
    simulator.querySelectorAll('[data-scenario]').forEach(function (tab) {
      tab.addEventListener('click', function () { selectScenario(tab.getAttribute('data-scenario')) })
    })
    simulator.querySelector('[data-sim-replay]').addEventListener('click', animateLoop)
    animateLoop()
  }

  document.querySelectorAll('.copyBtn').forEach(function (button) {
    button.addEventListener('click', async function () {
      var code = button.parentElement.querySelector('code')
      var label = button.querySelector('span')
      if (!code) return
      try {
        await navigator.clipboard.writeText(code.textContent || '')
        label.textContent = 'Copied'
        window.setTimeout(function () { label.textContent = 'Copy' }, 1600)
      } catch (_) {
        label.textContent = 'Select text'
      }
    })
  })

  document.querySelectorAll('[data-faq]').forEach(function (button) {
    button.addEventListener('click', function () {
      var answer = button.parentElement.querySelector('.faqAnswer')
      var opening = button.getAttribute('aria-expanded') !== 'true'
      button.setAttribute('aria-expanded', opening ? 'true' : 'false')
      answer.classList.toggle('open', opening)
    })
  })
})()
