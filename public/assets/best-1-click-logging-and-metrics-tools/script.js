(function () {
  // FAQ accordion
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

  // ROI calculator with count-up animation
  const inc = document.getElementById('in-incidents');
  const hrs = document.getElementById('in-hours');
  const rate = document.getElementById('in-rate');
  const share = document.getElementById('in-share');
  const current = {};

  function money(n) { return '$' + Math.round(n).toLocaleString(); }

  function animateNum(id, to, isMoney) {
    const el = document.getElementById(id);
    if (!el) return;
    const from = current[id] || 0;
    current[id] = to;
    const start = performance.now();
    const dur = 450;
    function step(now) {
      const p = Math.min(1, (now - start) / dur);
      const ease = 1 - Math.pow(1 - p, 3);
      const val = from + (to - from) * ease;
      el.textContent = isMoney ? money(val) : Math.round(val).toLocaleString();
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function calcRoi() {
    if (!inc) return;
    const incidents = +inc.value, hours = +hrs.value, r = +rate.value, s = +share.value / 100;
    document.getElementById('roi-incidents').textContent = incidents;
    document.getElementById('roi-hours').textContent = hours;
    document.getElementById('roi-rate').textContent = '$' + r;
    document.getElementById('roi-share').textContent = (s * 100) + '%';
    const hoursSaved = incidents * hours * s;
    const month = hoursSaved * r;
    animateNum('roi-hoursSaved', hoursSaved, false);
    animateNum('roi-month', month, true);
    animateNum('roi-year', month * 12, true);
  }
  [inc, hrs, rate, share].forEach((el) => el && el.addEventListener('input', calcRoi));
  if (inc) calcRoi();

  // Setup-effort bars grow in when scrolled into view (progressive enhancement)
  const chart = document.querySelector('.se-anim');
  if (chart && 'IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const bars = [...chart.querySelectorAll('rect')].filter((r) => r.getAttribute('fill') !== 'none');
    bars.forEach((b) => { b.style.transformBox = 'fill-box'; b.style.transformOrigin = 'left center'; });
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        bars.forEach((b, i) => {
          b.style.transition = 'none';
          b.style.transform = 'scaleX(0)';
          requestAnimationFrame(() => {
            b.style.transition = 'transform .8s cubic-bezier(.2,.8,.2,1) ' + (i * 0.06) + 's';
            b.style.transform = 'scaleX(1)';
          });
        });
        io.disconnect();
      });
    }, { threshold: 0.35 });
    io.observe(chart);
  }

  // Newsletter signup


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