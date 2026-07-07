(function () {
  document.querySelectorAll('[data-faq-toggle]').forEach((b) => {
    b.addEventListener('click', () => {
      const item = b.closest('.faqItem'); const answer = item && item.querySelector('.faqAnswer'); const chev = b.querySelector('.faqChevron');
      const open = b.getAttribute('aria-expanded') === 'true';
      b.setAttribute('aria-expanded', open ? 'false' : 'true');
      if (answer) answer.classList.toggle('hidden', open); if (chev) chev.classList.toggle('faqChevronOpen', !open);
    });
  });
  document.querySelectorAll('.copyableCode').forEach((block) => {
    const code = block.querySelector('code'); if (!code) return;
    const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'codeCopyButton'; btn.textContent = 'Copy';
    btn.addEventListener('click', async () => { try { await navigator.clipboard.writeText(code.textContent || ''); btn.textContent = 'Copied'; setTimeout(() => { btn.textContent = 'Copy'; }, 1600); } catch { btn.textContent = 'Select text'; } });
    block.appendChild(btn);
  });
  var G = document.getElementById('roiGpus'), R = document.getElementById('roiRate'), I = document.getElementById('roiIdle');
  if (G && R && I) {
    var oG = document.getElementById('outGpus'), oR = document.getElementById('outRate'), oI = document.getElementById('outIdle');
    var moEl = document.getElementById('roiMo'), yrEl = document.getElementById('roiYr'), rcEl = document.getElementById('roiReclaim');
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var prev = { mo: 0, yr: 0 };
    function fmt(n) { return '$' + Math.round(n).toLocaleString('en-US'); }
    function countUp(el, to, from) {
      if (reduce) { el.textContent = fmt(to); return; }
      var t0 = performance.now();
      function step(t) { var k = Math.min(1, (t - t0) / 500); var e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; el.textContent = fmt(from + (to - from) * e); if (k < 1) requestAnimationFrame(step); }
      requestAnimationFrame(step);
    }
    function calc() {
      var g = +G.value, r = +R.value, i = +I.value;
      oG.textContent = g; oR.textContent = '$' + r.toFixed(2); oI.textContent = i + '%';
      var m = g * r * 730 * (i / 100), y = m * 12;
      countUp(moEl, m, prev.mo); countUp(yrEl, y, prev.yr); prev.mo = m; prev.yr = y;
      rcEl.innerHTML = 'Recover even half with idle detection and reclaim: <b>' + fmt(m * 0.5) + '/mo</b> back, <b>' + fmt(y * 0.5) + '/yr</b>.';
    }
    [G, R, I].forEach(function (el) { el.addEventListener('input', calc); });
    calc();
  }
})();
