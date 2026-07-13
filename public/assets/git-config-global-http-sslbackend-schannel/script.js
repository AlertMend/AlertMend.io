(function () {
  const scenarios = {
    windows: {
      output: 'git config --global http.sslBackend schannel\ngit ls-remote https://github.com/org/repo.git\n# Git uses Windows certificate trust',
      title: 'Use schannel when Git for Windows should trust the Windows certificate store.',
      copy: 'This is the common corporate Windows fix: the company root CA is already trusted by Windows, and Git should use that same trust store instead of a separate OpenSSL CA bundle.',
      commands: 'git config --global http.sslBackend schannel\ngit config --global http.sslVerify true\ngit ls-remote https://github.com/org/repo.git',
      fix: 'Good fit for Git for Windows when the Windows Trusted Root store already contains the CA that signs your proxy or repository certificate.',
    },
    unsupported: {
      output: \"fatal: unsupported ssl backend 'schannel'.\nsupported ssl backends: gnutls\",
      title: 'Your Git build does not support schannel.',
      copy: 'Schannel is a Windows Secure Channel backend. Linux, WSL, containers, and some packaged Git builds may support gnutls or openssl instead. In that case, remove the schannel setting.',
      commands: 'git config --show-origin --get http.sslBackend\ngit config --global --unset http.sslBackend\ngit config --show-origin --get-all http.sslBackend\ngit ls-remote <url>',
      fix: 'Unset schannel, then use the CA strategy for the backend your Git actually supports: OS trust, http.sslCAInfo, or the distro CA store.',
    },
    ca: {
      output: 'SSL certificate problem: unable to get local issuer certificate',
      title: 'Schannel only helps if Windows trusts the issuing CA.',
      copy: 'If a corporate proxy or private Git server presents a certificate signed by an internal CA, that CA must be trusted by Windows for schannel to work.',
      commands: 'certmgr.msc\n# Trusted Root Certification Authorities\n# add company-root-ca.cer through IT policy or approved admin flow\ngit ls-remote <url>',
      fix: 'Install the company or private root CA into the Windows trust store through your normal security process, then keep SSL verification enabled.',
    },
    openssl: {
      output: \"fatal: unsupported ssl backend 'schannel'.\nsupported ssl backends: openssl\",
      title: 'Use OpenSSL-style CA configuration when OpenSSL is the supported backend.',
      copy: 'If Git says only openssl is supported, schannel cannot be used. Point Git at the correct PEM bundle or install the CA into the environment’s CA store.',
      commands: 'git config --global --unset http.sslBackend\ngit config --global http.sslCAInfo /path/to/company-root.pem\ngit config --global http.sslVerify true\ngit ls-remote <url>',
      fix: 'Use a PEM CA bundle with http.sslCAInfo or the system CA store; do not force schannel on a build that does not support it.',
    },
    revoke: {
      output: 'schannel: next InitializeSecurityContext failed\nunknown error while checking certificate revocation',
      title: 'Revocation errors are different from issuer errors.',
      copy: 'Schannel performs certificate revocation checks. If the only failure is revocation-status lookup and your security team approves, use the narrow Git revocation setting instead of disabling all SSL verification.',
      commands: 'git config --global http.schannelCheckRevoke false\n# only for approved revocation-check failures\ngit config --global http.sslVerify true',
      fix: 'Prefer fixing CRL/OCSP network access. Use schannelCheckRevoke=false only for the specific revocation failure and only with approval.',
    },
  };

  const output = document.querySelector('[data-scenario-output]');
  const title = document.querySelector('[data-scenario-title]');
  const copy = document.querySelector('[data-scenario-copy]');
  const commands = document.querySelector('[data-scenario-commands]');
  const fix = document.querySelector('[data-scenario-fix]');
  const tabs = Array.from(document.querySelectorAll('[data-scenario]'));

  function activateScenario(key) {
    const scenario = scenarios[key] || scenarios.windows;
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
