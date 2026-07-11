(function () {
  const tabs = Array.from(document.querySelectorAll('.decoderTab'));
  const panels = Array.from(document.querySelectorAll('.decoderPanel'));

  function activate(id) {
    tabs.forEach((tab) => {
      const selected = tab.dataset.case === id;
      tab.setAttribute('aria-selected', selected ? 'true' : 'false');
    });
    panels.forEach((panel) => {
      panel.classList.toggle('isActive', panel.id === `case-${id}`);
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => activate(tab.dataset.case));
  });

  document.querySelectorAll('[data-faq-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      const item = button.closest('.faqItem');
      const answer = item && item.querySelector('.faqAnswer');
      const chevron = button.querySelector('.faqChevron');
      const isOpen = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
      if (answer) answer.classList.toggle('hidden', isOpen);
      if (chevron) chevron.classList.toggle('faqChevronOpen', !isOpen);
    });
  });
})();
