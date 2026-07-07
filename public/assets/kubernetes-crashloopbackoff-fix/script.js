(function () {
  document.querySelectorAll('.codeBlockWrap').forEach((wrap) => {
    const btn = wrap.querySelector('.codeCopyBtn')
    const code = wrap.querySelector('code')
    const toast = wrap.querySelector('.codeCopyToast')
    if (!btn || !code) return

    btn.addEventListener('click', async () => {
      const text = code.textContent || ''
      try {
        await navigator.clipboard.writeText(text)
        btn.classList.add('copied')
        if (toast) {
          toast.textContent = 'Copied!'
          toast.classList.add('visible')
        }
        const label = btn.querySelector('.codeCopyLabel')
        if (label) label.textContent = 'Copied!'
        setTimeout(() => {
          btn.classList.remove('copied')
          if (toast) toast.classList.remove('visible')
          if (label) label.textContent = 'Copy'
        }, 2000)
      } catch {
        if (toast) {
          toast.textContent = 'Copy failed'
          toast.classList.add('visible')
          setTimeout(() => toast.classList.remove('visible'), 2000)
        }
      }
    })
  })

  document.querySelectorAll('[data-faq-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faqItem')
      const answer = item && item.querySelector('.faqAnswer')
      const chevron = btn.querySelector('.faqChevron')
      const open = btn.getAttribute('aria-expanded') === 'true'
      btn.setAttribute('aria-expanded', open ? 'false' : 'true')
      if (answer) answer.classList.toggle('faqAnswerCollapsed', open)
      if (chevron) chevron.classList.toggle('faqChevronOpen', !open)
    })
  })

  const signupForm = document.getElementById('blog-signup-form')
  const signupStatus = document.getElementById('blog-signup-status')
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault()
      const input = signupForm.querySelector('input[type="email"]')
      const button = signupForm.querySelector('button[type="submit"]')
      const email = input && input.value ? input.value.trim() : ''
      if (!email || !button) return

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
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            full_name: 'Blog subscriber',
            company: '',
            email,
            message:
              'Newsletter signup from the AlertMend blog. Please add this email to the blog and product updates list.',
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
        button.textContent = 'Sign up'
      }
    })
  }

  const signupForm = document.getElementById('blog-signup-form');
  const signupStatus = document.getElementById('blog-signup-status');
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = signupForm.querySelector('input[type="email"]');
      const button = signupForm.querySelector('button[type="submit"]');
      const email = input && input.value ? input.value.trim() : '';
      if (!email || !button || button.disabled) return;
      const blogTitleEl = document.querySelector('.article-header h1, header.article-header--cred h1, h1');
      const blogTitle = (signupForm.getAttribute('data-blog-title') || (blogTitleEl && blogTitleEl.textContent) || document.title || 'this blog post').trim().replace(/\s*\|\s*AlertMend.*$/i, '');
      const buttonLabel = button.textContent;
      button.disabled = true;
      button.textContent = 'Signing up…';
      if (signupStatus) {
        signupStatus.hidden = true;
        signupStatus.textContent = '';
        signupStatus.className = 'signup-status';
      }
      try {
        const response = await fetch('https://api.alertmend.io/contact', {
          method: 'POST',
          headers: { Accept: 'application/json, text/plain, */*', 'Content-Type': 'application/json' },
          body: JSON.stringify({
            full_name: 'Blog subscriber',
            company: '',
            email,
            message: 'Newsletter signup from the AlertMend blog post "' + blogTitle + '". Please add this email to the blog and product updates list.',
            source: 'blog_signup',
          }),
        });
        if (response.ok) {
          if (input) input.value = '';
          if (signupStatus) {
            signupStatus.hidden = false;
            signupStatus.textContent = "Thanks! You're on the list.";
            signupStatus.className = 'signup-status success';
          }
        } else {
          const data = await response.json().catch(() => ({}));
          if (signupStatus) {
            signupStatus.hidden = false;
            signupStatus.textContent = data.error || data.message || 'Something went wrong. Please try again.';
            signupStatus.className = 'signup-status error';
          }
        }
      } catch {
        if (signupStatus) {
          signupStatus.hidden = false;
          signupStatus.textContent = 'Network error. Please check your connection and try again.';
          signupStatus.className = 'signup-status error';
        }
      } finally {
        button.disabled = false;
        button.textContent = buttonLabel || 'Sign up';
      }
    });
  }
})();