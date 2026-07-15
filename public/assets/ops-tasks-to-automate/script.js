(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.classList.add('js-anim');

  // time-saved calculator with count-up
  var t = document.getElementById('i-tasks'), r = document.getElementById('i-runs'), m = document.getElementById('i-mins');
  if (t && r && m) {
    var ct = document.getElementById('c-tasks'), cr = document.getElementById('c-runs'), cm = document.getElementById('c-mins');
    var ow = document.getElementById('o-week'), om = document.getElementById('o-month'), oy = document.getElementById('o-year');
    var raf;
    function put(el, v, dec) { el.textContent = dec ? (v < 10 ? v.toFixed(1) : Math.round(v)) : Math.round(v); }
    function values() {
      var tasks = +t.value, runs = +r.value, mins = +m.value;
      ct.textContent = tasks; cr.textContent = runs; cm.textContent = mins;
      var wk = tasks * runs * mins * 0.85 / 60;
      return { week: wk, month: wk * 4.33, year: wk * 52 / 8 };
    }
    function setNow() { var v = values(); put(ow, v.week, true); put(om, v.month, false); put(oy, v.year, false); }
    function countUp() {
      var v = values();
      if (reduce || !window.requestAnimationFrame) { put(ow, v.week, true); put(om, v.month, false); put(oy, v.year, false); return; }
      var start = null, dur = 650;
      cancelAnimationFrame(raf);
      function step(now) {
        if (start === null) start = now;
        var p = Math.min(1, (now - start) / dur), e = 1 - Math.pow(1 - p, 3);
        put(ow, v.week * e, true); put(om, v.month * e, false); put(oy, v.year * e, false);
        if (p < 1) raf = requestAnimationFrame(step);
      }
      raf = requestAnimationFrame(step);
    }
    [t, r, m].forEach(function (el) { el.addEventListener('input', setNow); });
    var calcEl = document.querySelector('.calc');
    if (calcEl && !reduce && 'IntersectionObserver' in window) {
      ow.textContent = '0'; om.textContent = '0'; oy.textContent = '0';
      var seen = false;
      var cio = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting && !seen) { seen = true; countUp(); cio.disconnect(); } }); }, { threshold: 0.4 });
      cio.observe(calcEl);
    } else { setNow(); }
  }

  // reveal-on-scroll, with a safety net so content is never left hidden if IO does not fire
  var revs = document.querySelectorAll('.revealUp');
  function revealAll() { revs.forEach(function (el) { el.classList.add('in'); el.style.opacity = '1'; el.style.transform = 'none'; }); }
  if (reduce || !('IntersectionObserver' in window)) {
    revealAll();
  } else {
    var rio = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); rio.unobserve(en.target); } }); }, { threshold: 0.12 });
    revs.forEach(function (el) { rio.observe(el); });
    setTimeout(revealAll, 2000);
  }

  document.querySelectorAll('[data-faq-toggle]').forEach(function (b) {
    b.addEventListener('click', function () {
      var item = b.closest('.faqItem'); var answer = item && item.querySelector('.faqAnswer'); var chev = b.querySelector('.faqChevron');
      var open = b.getAttribute('aria-expanded') === 'true';
      b.setAttribute('aria-expanded', open ? 'false' : 'true');
      if (answer) answer.classList.toggle('hidden', open); if (chev) chev.classList.toggle('faqChevronOpen', !open);
    });
  });
  document.querySelectorAll('.copyableCode').forEach(function (block) {
    var code = block.querySelector('code'); if (!code) return;
    var btn = document.createElement('button'); btn.type = 'button'; btn.className = 'codeCopyButton'; btn.textContent = 'Copy';
    btn.addEventListener('click', async function () { try { await navigator.clipboard.writeText(code.textContent || ''); btn.textContent = 'Copied'; setTimeout(function () { btn.textContent = 'Copy'; }, 1600); } catch (e) { btn.textContent = 'Select text'; } });
    block.appendChild(btn);
  });

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