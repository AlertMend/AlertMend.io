(function () {
  const FAILURE_MODES = {
    auth: {
      title: 'Unauthorized',
      summary:
        'Failed to pull image: unauthorized. Private registry without valid imagePullSecrets, or expired ECR/GCR token.',
      steps: [
        'Run kubectl describe pod and read Events for unauthorized or authentication required',
        'Confirm the regcred secret exists in the namespace',
        'Refresh the docker-registry secret (ECR tokens expire every 12 hours)',
        'Patch the ServiceAccount or add imagePullSecrets to the Deployment',
        'kubectl rollout restart deployment/<name>',
      ],
      code: `# Confirm the error
kubectl describe pod <pod> -n <ns> | grep -i unauthorized
kubectl get secret -n <ns> | grep -E 'regcred|ecr'

# Full ECR refresh + IRSA setup → see "AWS ECR" section (#aws-ecr)
# GCR / Artifact Registry → see "GCR / Artifact Registry" section (#gcr-ar)`,
      tip: 'On EKS, prefer IRSA over long-lived pull secrets. No 12-hour expiry cliff.',
      autoFix: 'Human refreshes secret or enables IRSA, then rollout restart and verify Running.',
    },
    tag: {
      title: 'Wrong tag (manifest unknown)',
      summary:
        'Events: manifest unknown or 404 Not Found. Image tag in Deployment does not exist in the registry.',
      steps: [
        'Run kubectl describe pod and confirm manifest unknown in Events',
        'Compare Deployment image: tag with registry tags (ECR, GCR, Docker Hub)',
        'Fix image: in manifest or helm values',
        'kubectl apply or helm upgrade, then rollout status',
      ],
      code: `kubectl get deploy <name> -n <ns> \\
  -o jsonpath='{.spec.template.spec.containers[0].image}{"\\n"}'

# List ECR tags:
aws ecr list-images --repository-name myapp --region us-east-1

# After fixing tag in manifest:
kubectl apply -f deployment.yaml
kubectl rollout status deployment/<name> -n <ns>`,
      tip: 'Pin immutable tags or digests in CI. Never rely on :latest in production.',
      autoFix: 'Human fixes tag in manifest. Verify rollout reaches Running.',
    },
    init: {
      title: 'Init container pull',
      summary:
        'Init container image cannot pull, so the main container never starts',
      steps: [
        'Run kubectl describe pod and check the Init Containers section in Events',
        'Identify which init image failed (often a migration or wait-for-it image)',
        'Fix init image reference or add imagePullSecrets to pod spec',
        'Init containers need the same pull secrets as the main app',
      ],
      code: `kubectl describe pod <pod> | grep -A8 "Init Containers"
kubectl get pod <pod> -o jsonpath='{.spec.initContainers[*].image}{"\\n"}'

# Fix init image in Deployment spec, then:
kubectl rollout restart deployment/<name> -n <ns>`,
      tip: 'Fix the init image before debugging the main app. It blocks everything.',
      autoFix: 'Human fixes init image reference, then rollout restart.',
    },
    rate: {
      title: 'Rate limit (Docker Hub)',
      summary:
        'toomanyrequests: rate limit exceeded. Anonymous Docker Hub pulls hit 100/6h per IP. Common on node scale-up.',
      steps: [
        'Confirm toomanyrequests in describe Events',
        'Create Docker Hub authenticated pull secret',
        'Patch default ServiceAccount in the namespace',
        'Long-term: mirror images to ECR/GCR/Artifact Registry',
      ],
      code: `# Confirm rate limit in Events
kubectl describe pod <pod> -n <ns> | grep -i toomanyrequests

# Full Docker Hub auth + ServiceAccount patch → see "Docker Hub" section (#docker-hub)`,
      tip: 'Mirror public images to a private registry. That removes Docker Hub as a dependency.',
      autoFix: 'Human adds auth secret or mirror. Rollout restart on new nodes.',
    },
  };

  const HASH_TO_MODE = {
    unauthorized: 'auth',
    'wrong-tag': 'tag',
    'rate-limit': 'rate',
    'init-container': 'init',
  };

  const failureButtons = document.querySelectorAll('[data-failure-id]');
  const jumpButtons = document.querySelectorAll('[data-jump-failure]');
  const failureTitle = document.getElementById('failure-playbook-title');
  const failureSummary = document.getElementById('failure-playbook-summary');
  const failureSteps = document.getElementById('failure-playbook-steps');
  const failureCode = document.getElementById('failure-playbook-code');
  const failureTip = document.getElementById('failure-playbook-tip');
  const failureAutoFix = document.getElementById('failure-playbook-autofix');

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
    if (failureTip) failureTip.textContent = mode.tip;
    if (failureAutoFix) failureAutoFix.textContent = 'Typical fix: ' + mode.autoFix;
  }

  function jumpToFailure(id) {
    renderFailure(id);
    const zone = document.getElementById('registry-playbook');
    if (zone) zone.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  failureButtons.forEach((btn) =>
    btn.addEventListener('click', () => renderFailure(btn.getAttribute('data-failure-id')))
  );

  jumpButtons.forEach((btn) =>
    btn.addEventListener('click', () => jumpToFailure(btn.getAttribute('data-jump-failure')))
  );

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
  renderFailure(modeFromHash || 'auth');

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
          body: JSON.stringify({ full_name: 'Blog subscriber', email, message: 'Blog signup', source: 'blog_signup' }),
        });
        if (response.ok && signupStatus) {
          signupStatus.hidden = false;
          signupStatus.textContent = "Thanks! You're on the list.";
          signupStatus.className = 'signup-status success';
        }
      } catch { /* ignore */ }
      finally { button.disabled = false; button.textContent = 'Sign up'; }
    });
  }
})();
