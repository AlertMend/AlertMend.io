(function () {
  const scenarios = {
    local: {
      output: 'npm ERR! request to https://registry.npmjs.org/ failed,\nreason: unable to get local issuer certificate',
      title: 'Your local Node/npm trust store cannot validate the registry chain.',
      copy: 'Start by confirming the registry URL and whether the failure happens only on one machine, VPN, or network. If the public registry works elsewhere, the issue is local trust or proxy configuration.',
      commands: 'npm config get registry\nnpm ping\nnpm config get cafile',
      fix: 'Update very old Node/npm versions if needed, check OS certificates, and add the correct CA only if your environment uses one.',
    },
    corp: {
      output: 'npm ERR! request to https://registry.npmjs.org/ failed,\nreason: self signed certificate in certificate chain',
      title: 'A corporate TLS inspection proxy is probably signing the certificate.',
      copy: 'Browsers may trust the company root CA through the OS store, while npm or Node in your terminal may not. Ask IT or security for the root CA in PEM format.',
      commands: 'npm config get proxy\nnpm config get https-proxy\nnpm config set cafile /path/to/company-root.pem\nnpm config set strict-ssl true\nnpm ping',
      fix: 'Trust the corporate root CA through npm cafile and, when Node tools also fail, NODE_EXTRA_CA_CERTS.',
    },
    private: {
      output: 'npm ERR! request to https://npm.company.internal/ failed,\nreason: unable_to_get_issuer_cert_locally',
      title: 'The private registry certificate chain is not trusted by this machine.',
      copy: 'Private registries often use an internal CA or a chain that is incomplete from the client point of view. Fix the server chain when possible; otherwise distribute the issuing CA.',
      commands: 'npm config get registry\nnpm ping --registry=https://npm.company.internal/\nnpm config set cafile /path/to/registry-ca.pem',
      fix: 'Make the private registry present a complete chain, or configure the internal issuing CA for npm and Node.',
    },
    docker: {
      output: 'RUN npm ci\nnpm ERR! reason: unable to get local issuer certificate',
      title: 'The container or CI runner does not inherit your laptop trust store.',
      copy: 'Docker images and hosted runners have their own CA bundles, environment variables, and npm config. A fix in your shell does not automatically travel with the build.',
      commands: 'COPY company-root.pem /ca/company-root.pem\nENV NODE_EXTRA_CA_CERTS=/ca/company-root.pem\nRUN npm config set cafile /ca/company-root.pem\nRUN npm ping\nRUN npm ci',
      fix: 'Install the CA into the image or runner, set npm cafile, export NODE_EXTRA_CA_CERTS where needed, and verify with npm ping before npm ci.',
    },
  };

  const output = document.querySelector('[data-scenario-output]');
  const title = document.querySelector('[data-scenario-title]');
  const copy = document.querySelector('[data-scenario-copy]');
  const commands = document.querySelector('[data-scenario-commands]');
  const fix = document.querySelector('[data-scenario-fix]');
  const tabs = Array.from(document.querySelectorAll('[data-scenario]'));

  function activateScenario(key) {
    const scenario = scenarios[key] || scenarios.local;
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
