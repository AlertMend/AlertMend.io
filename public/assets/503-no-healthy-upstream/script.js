(function () {
  const PROBE_YAML = `readinessProbe:
  httpGet:
    path: /ready
    port: 8080
  periodSeconds: 5
  failureThreshold: 3
startupProbe:
  httpGet:
    path: /health
    port: 8080
  failureThreshold: 30
  periodSeconds: 10`;

  const FAILURE_MODES = {
    endpoints: {
      title: 'Empty endpoints',
      summary:
        'kubectl get endpoints shows <none>. The Service selector does not match any Ready pods, or every pod failed readiness. The proxy has nothing to forward to.',
      steps: [
        'kubectl get endpoints <service> -n <ns> — confirm ENDPOINTS column is empty',
        'kubectl get pods -l <selector> — check Ready column (0/N means readiness failing)',
        'kubectl describe svc <service> — verify selector labels match pod labels',
        'Fix label mismatch or readiness probe so at least one pod becomes Ready',
        'Watch endpoints repopulate: kubectl get endpoints -w',
      ],
      code: `# Diagnose empty endpoints
kubectl get endpoints <service-name> -n <namespace>
kubectl get svc <service-name> -n <namespace> -o yaml | grep -A5 selector
kubectl get pods -n <namespace> --show-labels | grep app=<label>

# If labels mismatch:
kubectl label pod <pod-name> app=<label> --overwrite`,
      code2: `# If pods exist but not Ready — check readiness Events:
kubectl describe pod <pod-name> | grep -A10 "Readiness"`,
      tip: 'Empty endpoints during rollout is normal for seconds. If it lasts minutes, readiness or selector is broken.',
      autoFix: 'Fix selector or readiness probe, then verify endpoints list pod IPs.',
    },
    probes: {
      title: 'Readiness probe failing',
      summary:
        'Pods show Running but never become Ready — exactly the HELM UPGRADE war story. Kubernetes removes non-Ready pods from Service endpoints even when containers are alive. The most common cause: readiness hits /ready (503) while liveness hits /health (200) because the app is not fully initialized or a dependency is down.',
      steps: [
        'kubectl describe pod <pod> | grep -A10 "Readiness" — look for Readiness probe failed: HTTP probe failed with statuscode: 503',
        'Understand /ready vs /health: liveness only checks the process is alive; readiness gates traffic. They can return different status codes on different paths.',
        'kubectl exec <pod> -- curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/ready — test the exact probe path from inside the pod',
        'kubectl get deploy <name> -o jsonpath=\'{.spec.template.spec.containers[0].readinessProbe}\' — verify probe path, port, and thresholds match what the app serves',
        'Fix the readiness endpoint in application code or correct readinessProbe.path in the Deployment spec, then kubectl rollout restart',
        'Watch endpoints repopulate: kubectl get endpoints <svc> -w',
      ],
      code: `# Sample Events — Helm upgrade war story
kubectl describe pod api-7d4f8b9c6d-xk2lm -n production | grep -A10 "Readiness"
# Events:
#   Warning  Unhealthy  3m  kubelet  Readiness probe failed:
#     HTTP probe failed with statuscode: 503, path: /ready

# /ready vs /health — test from inside the pod
kubectl exec api-7d4f8b9c6d-xk2lm -n production -- \\
  sh -c 'curl -s -o /dev/null -w "/ready=%{http_code}\\n" http://localhost:8080/ready; \\
         curl -s -o /dev/null -w "/health=%{http_code}\\n" http://localhost:8080/health'
# /ready=503  /health=200  → app not ready on /ready; fix app or probe path`,
      code2: `# Check probe definition in Deployment
kubectl get deploy api -n production -o jsonpath='{.spec.template.spec.containers[0].readinessProbe}' | jq .

# Correct configuration — separate liveness from readiness:
${PROBE_YAML}`,
      footnote:
        'Deep dive: <a href="/blog/kubernetes-crashloopbackoff-fix">CrashLoopBackOff runbook</a> for startupProbe patterns on slow-start apps.',
      tip: 'If readiness flaps (pods alternate Ready/NotReady), increase failureThreshold or fix the underlying dependency. Flapping readiness causes intermittent 503.',
      autoFix:
        'Fix the readiness endpoint or correct readinessProbe.path · kubectl rollout restart · kubectl get endpoints <svc> -w until IPs appear',
    },
    rollout: {
      title: 'Rollout drained all backends',
      summary:
        'During a rolling update, old pods terminate before new pods pass readiness when minReadySeconds=0 and new pods start slower than maxUnavailable allows. The endpoint list drains to zero — the BLACK FRIDAY war story pattern during HPA scale-ups when new pods pass liveness but not readiness.',
      steps: [
        'kubectl rollout status deployment/<name> — look for stalled rollout with 0 available replicas',
        'kubectl get deploy <name> -o yaml — inspect maxUnavailable, maxSurge, and minReadySeconds',
        'kubectl get events --sort-by=.lastTimestamp — correlate 503 start with rollout or HPA scale event',
        'kubectl rollout undo deployment/<name> — immediate rollback to last-known-good ReplicaSet',
        'Tune strategy: maxUnavailable: 0, maxSurge: 1 for zero-downtime; minReadySeconds: 30 so new pods stabilize before old ones terminate',
        'Fix deployment spec (startup probe, resource requests) before re-deploying',
      ],
      code: `# Stalled rollout — 0 available replicas
kubectl rollout status deployment/api -n production
# Waiting for deployment "api" rollout to finish: 0 of 3 updated replicas are available...

kubectl get deploy api -n production -o jsonpath='{.spec.strategy.rollingUpdate}{"\\n"}minReadySeconds: {.spec.minReadySeconds}{"\\n"}'
# {"maxUnavailable":1,"maxSurge":1}
# minReadySeconds: 0`,
      code2: `# Rollback to restore traffic (Black Friday war story)
kubectl rollout undo deployment/api -n production
kubectl rollout status deployment/api -n production

# Watch endpoints during scale events
kubectl get endpoints api -n production -w`,
      tip: 'During HPA scale-ups, the same drain can happen if new pods don\'t pass readiness before the scheduler recalculates. Watch kubectl get endpoints -w during scale events.',
      autoFix:
        'kubectl rollout undo to restore traffic immediately · Fix minReadySeconds, startup probe, and resource requests before re-deploying',
    },
    network: {
      title: 'NetworkPolicy block',
      summary:
        'Pods are Ready and endpoints list IPs, but the ingress controller cannot reach pod IP:port. A NetworkPolicy that allowed staging\'s ingress namespace may block production\'s — different namespace labels. This is the NETWORKPOLICY war story: worked Friday in staging, 503 Monday in prod.',
      steps: [
        'kubectl get networkpolicy -n <ns> — list policies that may block ingress → pod traffic',
        'Confirm pods are Ready and endpoints populated — this failure mode is connectivity, not readiness',
        'kubectl exec -n ingress-nginx <ingress-pod> -- curl -s -o /dev/null -w "%{http_code}" http://<pod-ip>:8080/health — returns 000 when NetworkPolicy blocks',
        'Compare staging vs prod ingress namespace labels — policies are namespace-scoped',
        'Update NetworkPolicy to allow traffic from the ingress controller namespace or pod labels',
        'Re-test curl from ingress pod, then confirm public URL returns 200',
      ],
      code: `# List NetworkPolicies (NETWORKPOLICY war story)
kubectl get networkpolicy -n production
# NAME              POD-SELECTOR   AGE
# deny-all-ingress  app=api        3d
# allow-staging     app=api        3d

# Test from ingress controller — blocked returns 000
kubectl exec -n ingress-nginx ingress-nginx-abc12 -- \\
  curl -s -o /dev/null -w "%{http_code}" http://10.244.2.18:8080/health
# 000  ← connection refused/timeout (NetworkPolicy block)

# Service DNS test (may also fail if policy blocks ingress namespace)
kubectl exec -n ingress-nginx ingress-nginx-abc12 -- \\
  curl -s -o /dev/null -w "%{http_code}" http://api.production.svc.cluster.local:8080/health`,
      code2: `# Corrected NetworkPolicy — allow ingress-nginx traffic
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-ingress
  namespace: production
spec:
  podSelector:
    matchLabels:
      app: backend
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          kubernetes.io/metadata.name: ingress-nginx
    ports:
    - port: 8080`,
      tip: 'NetworkPolicy is namespace-scoped. Staging and prod often have different ingress controller namespaces or labels. Always test connectivity from the actual ingress pod, not from your laptop.',
      autoFix:
        'Update NetworkPolicy to allow ingress controller namespace · Verify with kubectl exec curl test · Confirm endpoints + HTTP 200',
    },
    mesh: {
      title: 'Mesh ejection (Istio / Envoy)',
      summary:
        'Istio OutlierDetection ejects hosts after consecutive 5xx errors. kubectl get endpoints still shows IPs (Kubernetes considers pods Ready) but Envoy\'s cluster reports healthy_hosts: 0. This is the ISTIO CANARY war story: three endpoint IPs, zero healthy upstream at the mesh layer.',
      steps: [
        'kubectl get endpoints <svc> — IPs still listed (Kubernetes layer is healthy)',
        'istioctl proxy-config cluster <ingress-pod> --fqdn <svc>.<ns>.svc.cluster.local — check healthy_hosts: 0 and outlier_detection settings',
        'kubectl get destinationrule -n <ns> -o yaml | grep -A10 outlierDetection — review consecutive5xxErrors and baseEjectionTime',
        'Temporarily disable ejection: patch DestinationRule to set consecutive5xxErrors: 1000 (stop-the-bleeding, not permanent)',
        'Fix upstream 5xx errors (app bug, resource limits, dependency failure), then re-enable outlier detection with tuned thresholds',
        'During canary: istioctl proxy-config endpoint to see per-host ejection status',
      ],
      code: `# ISTIO CANARY war story — endpoints exist, healthy_hosts: 0
kubectl get endpoints api -n production
# ENDPOINTS: 10.244.1.42:8080,10.244.2.18:8080,10.244.3.9:8080

istioctl proxy-config cluster \\
  istio-ingressgateway-7d8f9b-xyz.istio-system \\
  --fqdn api.production.svc.cluster.local -o json | \\
  jq '.[] | select(.name | contains("api")) | {name, healthy_hosts: .host_statuses | map(select(.health_status.healthy)) | length, outlier_detection}'
# healthy_hosts: 0
# outlier_detection: {consecutive_5xx: 5, interval: "10s", base_ejection_time: "30s"}`,
      code2: `# Check DestinationRule outlier detection
kubectl get destinationrule api -n production -o yaml | grep -A10 outlierDetection

# Temporarily disable ejection (restore traffic while fixing app)
kubectl patch destinationrule api -n production --type=merge -p '
spec:
  trafficPolicy:
    outlierDetection:
      consecutive5xxErrors: 1000'

# Re-enable after fixing upstream 5xx — do not leave disabled permanently`,
      tip: 'During canary deployments, outlier ejection can eject the canary after a few errors, making it look like the canary has zero traffic. Check istioctl proxy-config endpoint to see ejection status per host.',
      autoFix:
        'Fix upstream 5xx errors causing ejection · Tune outlierDetection thresholds · Re-enable ejection after app is stable',
    },
  };

  const HASH_TO_MODE = {
    'empty-endpoints': 'endpoints',
    'readiness-probe': 'probes',
    'playbook-readiness': 'probes',
    'fix-readiness-probes-that-drain-endpoints': 'probes',
    rollout: 'rollout',
    'playbook-rollout': 'rollout',
    network: 'network',
    'playbook-networkpolicy': 'network',
    mesh: 'mesh',
    'playbook-mesh': 'mesh',
    'failure-playbook': 'endpoints',
  };

  const MODE_TO_HASH = {
    endpoints: 'failure-playbook',
    probes: 'playbook-readiness',
    rollout: 'playbook-rollout',
    network: 'playbook-networkpolicy',
    mesh: 'playbook-mesh',
  };

  const LIFECYCLE_STATES = {
    healthy: {
      endpointCount: '2 ready endpoints',
      podA: 'Running · Ready',
      podB: 'Running · Ready',
      status: 'HTTP 200',
      title: 'Traffic reaches two healthy pods',
      text: 'Both readiness probes pass, so Kubernetes publishes both Pod IPs as ready Service endpoints.',
      expert: 'Edge check is healthy, two ready endpoints exist, and both readiness probes are passing.',
      action: 'Action: establish the healthy baseline and watch for state changes.',
    },
    readiness: {
      endpointCount: '1 ready endpoint',
      podA: 'Running · Ready',
      podB: 'Running · NotReady',
      status: 'HTTP 200',
      title: 'The probe fails before the outage',
      text: 'pod-b is still Running, but its failed readiness probe removes it from normal Service traffic. One endpoint remains.',
      expert: 'Probe Events identify pod-b, the failing path, status code, and first-failure time while traffic still succeeds.',
      action: 'Action: diagnose before the last healthy endpoint disappears.',
    },
    empty: {
      endpointCount: '0 ready endpoints',
      podA: 'Running · NotReady',
      podB: 'Running · NotReady',
      status: 'HTTP 503',
      title: 'No healthy upstream',
      text: 'Both containers run, but neither is Ready. The Service has no ready backend and the proxy has nowhere to send the request.',
      expert: 'The external 503, zero ready endpoints, and failed probes form one causal chain. Restarting ingress would not change it.',
      action: 'Action: fix readiness or roll back the change, then verify endpoints and URL health.',
    },
    blocked: {
      endpointCount: '2 endpoints · unreachable',
      podA: 'Running · Ready',
      podB: 'Running · Ready',
      status: 'HTTP 503',
      title: 'Endpoints exist, but the network path fails',
      text: 'Kubernetes publishes both pods, yet NetworkPolicy or a port mismatch blocks ingress-to-backend traffic. Test from the ingress pod.',
      expert: 'Ready endpoints rule out an empty pool at the Kubernetes layer; failed ingress-to-pod connectivity moves the fault to network or port configuration.',
      action: 'Action: attach the policy diff, require approval for changes, and verify reachability.',
    },
    recovered: {
      endpointCount: '2 ready endpoints',
      podA: 'Running · Ready',
      podB: 'Running · Ready',
      status: 'HTTP 200',
      title: 'Endpoints repopulate and traffic recovers',
      text: 'The repaired readiness path passes, both Pod IPs return to the Service, and the same request succeeds.',
      expert: 'The causal signals reverse in order: probes pass, endpoints repopulate, and consecutive edge checks return 200.',
      action: 'Action: close only after recovery holds and preserve the evidence in the incident timeline.',
    },
  };

  const ALERTMEND_MODE_INSIGHTS = {
    endpoints: {
      sees: 'Endpoint count fell to zero while workload objects still exist. The decisive split is selector mismatch versus failed readiness.',
      automates: 'Collect Service selectors, Pod labels, readiness Events, and the last deployment change. Remediation stays gated until the mismatch is proven.',
    },
    probes: {
      sees: 'Containers are Running, Pod Ready is false, and probe Events name the failing path, port, status code, and first-failure time.',
      automates: 'Correlate the probe failure with the rollout diff. Restart only after a known-good configuration exists; otherwise recommend rollback or require approval.',
    },
    rollout: {
      sees: 'Endpoint count reached zero immediately after a ReplicaSet change, while the previous revision had healthy endpoints.',
      automates: 'A guarded rollout undo is eligible when the deploy-to-drain sequence is unambiguous and recovery verification is configured.',
    },
    network: {
      sees: 'Ready endpoints exist, but a request from the ingress network path cannot reach Pod IP:port. Restarting pods would not change the evidence.',
      automates: 'Attach the relevant NetworkPolicy and namespace-label diff. Policy changes require approval; AlertMend verifies reachability after the change.',
    },
    mesh: {
      sees: 'Kubernetes endpoints remain Ready while Envoy reports no healthy hosts or UH. That isolates the failure to the mesh health model.',
      automates: 'Surface DestinationRule, recent 5xx history, and ejected hosts. Threshold changes remain approval-gated; recovery is verified at both mesh and URL layers.',
    },
  };

  const lifecycleStage = document.querySelector('.lifecycleStage');
  const lifecycleButtons = [...document.querySelectorAll('[data-lifecycle-state]')];
  const endpointCount = lifecycleStage && lifecycleStage.querySelector('.endpointCount');
  const podAStatus = lifecycleStage && lifecycleStage.querySelector('.lifecyclePodOne small');
  const podBStatus = lifecycleStage && lifecycleStage.querySelector('.lifecyclePodTwo small');
  const lifecycleStatus = lifecycleStage && lifecycleStage.querySelector('.lifecycleStatusCode');
  const lifecycleTitle = lifecycleStage && lifecycleStage.querySelector('.lifecycleResultTitle');
  const lifecycleText = lifecycleStage && lifecycleStage.querySelector('.lifecycleResultText');
  const lifecycleExpertText = lifecycleStage && lifecycleStage.querySelector('.lifecycleExpertText');
  const lifecycleExpertAction = lifecycleStage && lifecycleStage.querySelector('.lifecycleExpertAction');

  function renderLifecycle(id, focusButton = false) {
    const state = LIFECYCLE_STATES[id];
    if (!state || !lifecycleStage) return;
    lifecycleStage.setAttribute('data-lifecycle-current', id);
    lifecycleButtons.forEach((button) => {
      const active = button.getAttribute('data-lifecycle-state') === id;
      button.classList.toggle('lifecycleTabActive', active);
      button.setAttribute('aria-selected', active ? 'true' : 'false');
      button.tabIndex = active ? 0 : -1;
      if (active && focusButton) button.focus();
    });
    if (endpointCount) endpointCount.textContent = state.endpointCount;
    if (podAStatus) podAStatus.textContent = state.podA;
    if (podBStatus) podBStatus.textContent = state.podB;
    if (lifecycleStatus) lifecycleStatus.textContent = state.status;
    if (lifecycleTitle) lifecycleTitle.textContent = state.title;
    if (lifecycleText) lifecycleText.textContent = state.text;
    if (lifecycleExpertText) lifecycleExpertText.textContent = state.expert;
    if (lifecycleExpertAction) lifecycleExpertAction.textContent = state.action;
  }

  lifecycleButtons.forEach((button, index) => {
    button.addEventListener('click', () => renderLifecycle(button.getAttribute('data-lifecycle-state')));
    button.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      let next = index;
      if (event.key === 'ArrowLeft') next = (index - 1 + lifecycleButtons.length) % lifecycleButtons.length;
      if (event.key === 'ArrowRight') next = (index + 1) % lifecycleButtons.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = lifecycleButtons.length - 1;
      renderLifecycle(lifecycleButtons[next].getAttribute('data-lifecycle-state'), true);
    });
  });

  const failureButtons = document.querySelectorAll('.modeGrid [data-failure-id]');
  const failureTitle = document.getElementById('failure-playbook-title');
  const failureSummary = document.getElementById('failure-playbook-summary');
  const failureSteps = document.getElementById('failure-playbook-steps');
  const failureCode = document.getElementById('failure-playbook-code');
  const failureCode2 = document.getElementById('failure-playbook-code-2');
  const failureFootnote = document.getElementById('failure-playbook-footnote');
  const failureTip = document.getElementById('failure-playbook-tip');
  const failureAutoFix = document.getElementById('failure-playbook-autofix');
  const failureAlertMendSees = document.getElementById('failure-playbook-alertmend-sees');
  const failureAlertMendAutomates = document.getElementById('failure-playbook-alertmend-automates');

  function renderFailure(id) {
    const mode = FAILURE_MODES[id];
    if (!mode) return;
    failureButtons.forEach((btn) => {
      const active = btn.getAttribute('data-failure-id') === id;
      btn.classList.toggle('modeCardActive', active);
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    if (failureTitle) failureTitle.textContent = mode.title;
    if (failureSummary) failureSummary.textContent = mode.summary;
    if (failureSteps) failureSteps.innerHTML = mode.steps.map((s) => '<li>' + s + '</li>').join('');
    if (failureCode) failureCode.textContent = mode.code;
    if (failureCode2) {
      if (mode.code2) {
        failureCode2.textContent = mode.code2;
        failureCode2.hidden = false;
      } else {
        failureCode2.textContent = '';
        failureCode2.hidden = true;
      }
    }
    if (failureFootnote) {
      if (mode.footnote) {
        failureFootnote.innerHTML = mode.footnote;
        failureFootnote.hidden = false;
      } else {
        failureFootnote.innerHTML = '';
        failureFootnote.hidden = true;
      }
    }
    if (failureTip) failureTip.textContent = mode.tip;
    if (failureAutoFix) failureAutoFix.textContent = 'Typical fix: ' + mode.autoFix;
    const insight = ALERTMEND_MODE_INSIGHTS[id];
    if (failureAlertMendSees && insight) failureAlertMendSees.textContent = insight.sees;
    if (failureAlertMendAutomates && insight) failureAlertMendAutomates.textContent = insight.automates;
  }

  function jumpToFailure(id) {
    renderFailure(id);
    const hash = MODE_TO_HASH[id];
    if (hash && history.replaceState) {
      history.replaceState(null, '', '#' + hash);
    }
    const zone = document.getElementById('failure-playbook');
    if (zone) zone.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  failureButtons.forEach((btn) =>
    btn.addEventListener('click', () => jumpToFailure(btn.getAttribute('data-failure-id')))
  );

  document.querySelectorAll('[data-jump-failure]').forEach((el) => {
    el.addEventListener('click', (e) => {
      const id = el.getAttribute('data-jump-failure');
      if (!id) return;
      if (el.tagName === 'A') e.preventDefault();
      jumpToFailure(id);
    });
  });

  document.querySelectorAll('.codeBlockWrap').forEach((wrap) => {
    const btn = wrap.querySelector('.codeCopyBtn');
    const code = wrap.querySelector('code');
    if (!btn || !code) return;
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(code.textContent || '');
        btn.classList.add('copied');
        const label = btn.querySelector('.codeCopyLabel');
        if (label) label.textContent = 'Copied';
        setTimeout(() => {
          btn.classList.remove('copied');
          if (label) label.textContent = 'Copy';
        }, 2000);
      } catch { /* ignore */ }
    });
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

  const hash = window.location.hash.replace(/^#/, '');
  const modeFromHash = HASH_TO_MODE[hash];
  if (failureButtons.length) {
    renderFailure(modeFromHash || 'endpoints');
    if (modeFromHash && modeFromHash !== 'endpoints') {
      const zone = document.getElementById('failure-playbook');
      if (zone) setTimeout(() => zone.scrollIntoView({ block: 'start' }), 100);
    }
  }

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
      try {
        const response = await fetch('https://api.alertmend.io/contact', {
          method: 'POST',
          headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify({
            full_name: 'Blog subscriber',
            email,
            message: 'Blog signup from 503 upstream runbook',
            source: 'blog_signup',
          }),
        });
        if (response.ok && signupStatus) {
          signupStatus.hidden = false;
          signupStatus.textContent = "Thanks! You're on the list.";
          signupStatus.className = 'signup-status success';
        }
      } catch { /* ignore */ }
      finally {
        button.disabled = false;
        button.textContent = 'Sign up';
      }
    });
  }
})();
