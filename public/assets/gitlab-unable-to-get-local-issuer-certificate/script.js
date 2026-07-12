(function () {
  const scenarios = {
    clone: {
      output: 'git clone https://gitlab.example.com/group/app.git\nfatal: unable to access ...\nSSL certificate problem: unable to get local issuer certificate',
      title: 'The Git client cannot trust the certificate chain for the GitLab host.',
      copy: 'Start with the exact remote URL and the certificate chain Git sees. If a browser works but Git fails, the local Git/cURL trust store or a corporate proxy is usually the difference.',
      commands: 'git remote -v\ngit ls-remote https://gitlab.example.com/group/app.git\ngit config --show-origin --get http.sslCAInfo\nGIT_CURL_VERBOSE=1 git ls-remote https://gitlab.example.com/group/app.git',
      fix: 'Install the issuing CA into the OS or Git trust store, or scope http.sslCAInfo to the GitLab URL. Keep http.sslVerify enabled.',
    },
    runner: {
      output: 'Running with gitlab-runner...\nFetching changes...\nfatal: unable to access ...\nserver certificate verification failed',
      title: 'GitLab Runner is a separate trust boundary.',
      copy: 'A runner does not automatically inherit your laptop trust. The runner service, helper image, and job image may each need the corporate or private CA.',
      commands: 'sudo mkdir -p /etc/gitlab-runner/certs\nsudo cp company-root-ca.pem /etc/gitlab-runner/certs/gitlab.example.com.crt\nsudo gitlab-runner restart\nsudo gitlab-runner verify',
      fix: 'Use the GitLab Runner custom CA path or tls-ca-file, then rerun the failing pipeline in the same runner environment.',
    },
    docker: {
      output: 'Running in Docker executor\nfatal: unable to access ...\nx509: certificate signed by unknown authority',
      title: 'The job container has its own CA bundle.',
      copy: 'Docker and Kubernetes executors often fail after the runner is fixed because the actual job image does not trust the same CA. Bake or mount the CA into the image used by the job.',
      commands: 'cp company-root-ca.pem /usr/local/share/ca-certificates/company-root-ca.crt\nupdate-ca-certificates\ngit config --global http.sslVerify true\ngit ls-remote "$CI_REPOSITORY_URL"',
      fix: 'Mount or bake the CA into the runner/job image and verify with git ls-remote before the build step.',
    },
    server: {
      output: 'GitLab self-managed HTTPS enabled\nclients report: unable to get local issuer certificate',
      title: 'The GitLab server may be presenting an incomplete or private chain.',
      copy: 'For a self-managed GitLab instance, check that the HTTPS certificate chain is complete and ordered correctly. For internal CAs, distribute the CA to clients and runner environments.',
      commands: 'openssl s_client -showcerts -connect gitlab.example.com:443 -servername gitlab.example.com </dev/null\nsudo cp company-root-ca.pem /etc/gitlab/trusted-certs/\nsudo gitlab-ctl reconfigure',
      fix: 'Serve the full certificate chain on GitLab and put internal CAs in the right trusted-certs location for GitLab outbound trust.',
    },
  };

  const output = document.querySelector('[data-scenario-output]');
  const title = document.querySelector('[data-scenario-title]');
  const copy = document.querySelector('[data-scenario-copy]');
  const commands = document.querySelector('[data-scenario-commands]');
  const fix = document.querySelector('[data-scenario-fix]');
  const tabs = Array.from(document.querySelectorAll('[data-scenario]'));

  function activateScenario(key) {
    const scenario = scenarios[key] || scenarios.clone;
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
