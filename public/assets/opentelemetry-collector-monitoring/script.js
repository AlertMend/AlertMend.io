(function () {
  const symptomButtons = Array.from(document.querySelectorAll('.symptomButton'));
  const symptomPanels = Array.from(document.querySelectorAll('.symptomPanel'));

  symptomButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.getAttribute('data-symptom');
      symptomButtons.forEach((item) => {
        const active = item === button;
        item.classList.toggle('isActive', active);
        item.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
      symptomPanels.forEach((panel) => {
        const active = panel.getAttribute('data-symptom-panel') === id;
        panel.classList.toggle('isActive', active);
        panel.hidden = !active;
      });
    });
  });

  const copyButton = document.querySelector('[data-copy-config]');
  const configBlock = document.getElementById('starterConfig');
  if (copyButton && configBlock && navigator.clipboard) {
    copyButton.addEventListener('click', async () => {
      const original = copyButton.textContent;
      try {
        await navigator.clipboard.writeText(configBlock.innerText.trim());
        copyButton.textContent = 'Copied';
        setTimeout(() => { copyButton.textContent = original || 'Copy'; }, 1600);
      } catch {
        copyButton.textContent = 'Copy failed';
        setTimeout(() => { copyButton.textContent = original || 'Copy'; }, 1600);
      }
    });
  }

  document.querySelectorAll('.faqQuestion').forEach((button) => {
    button.addEventListener('click', () => {
      const answer = button.parentElement.querySelector('.faqAnswer');
      const chevron = button.querySelector('.faqChevron');
      const isOpen = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
      if (answer) answer.hidden = isOpen;
      if (chevron) chevron.classList.toggle('faqChevronOpen', !isOpen);
    });
  });
})();
