(function () {
  const faqButtons = document.querySelectorAll('.faqQuestion');
  faqButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const answer = button.parentElement.querySelector('.faqAnswer');
      const isOpen = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!isOpen));
      if (answer) answer.hidden = isOpen;
    });
  });

  const queryButtons = document.querySelectorAll('[data-query]');
  const queryText = document.querySelector('[data-query-text]');
  const resultText = document.querySelector('[data-result-text]');
  queryButtons.forEach((button) => {
    button.addEventListener('click', () => {
      queryButtons.forEach((item) => item.classList.remove('isActive'));
      button.classList.add('isActive');
      if (queryText) queryText.textContent = button.getAttribute('data-query') || '';
      if (resultText) resultText.textContent = button.getAttribute('data-result') || '';
    });
  });
})();
