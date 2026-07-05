(function () {
  document.querySelectorAll('[data-faq-toggle]').forEach((b) => {
    b.addEventListener('click', () => {
      const item = b.closest('.faqItem'); const answer = item && item.querySelector('.faqAnswer'); const chev = b.querySelector('.faqChevron');
      const open = b.getAttribute('aria-expanded') === 'true';
      b.setAttribute('aria-expanded', open ? 'false' : 'true');
      if (answer) answer.classList.toggle('hidden', open); if (chev) chev.classList.toggle('faqChevronOpen', !open);
    });
  });
  const inc = document.getElementById('in-incidents'), hrs = document.getElementById('in-hours'), rate = document.getElementById('in-rate'), share = document.getElementById('in-share');
  const current = {};
  const money = (n) => '$' + Math.round(n).toLocaleString();
  function animateNum(id, to, isMoney) {
    const el = document.getElementById(id); if (!el) return;
    const from = current[id] || 0; current[id] = to; const start = performance.now(), dur = 450;
    function step(now){ const p = Math.min(1,(now-start)/dur); const e = 1-Math.pow(1-p,3); const v = from+(to-from)*e; el.textContent = isMoney?money(v):Math.round(v).toLocaleString(); if(p<1) requestAnimationFrame(step); }
    requestAnimationFrame(step);
  }
  function calc(){ if(!inc) return; const i=+inc.value,h=+hrs.value,r=+rate.value,s=+share.value/100;
    document.getElementById('roi-incidents').textContent=i; document.getElementById('roi-hours').textContent=h; document.getElementById('roi-rate').textContent='$'+r; document.getElementById('roi-share').textContent=(s*100)+'%';
    const hoursSaved=i*h*s, month=hoursSaved*r; animateNum('roi-hoursSaved',hoursSaved,false); animateNum('roi-month',month,true); animateNum('roi-year',month*12,true); }
  [inc,hrs,rate,share].forEach((el)=>el&&el.addEventListener('input',calc)); if(inc) calc();
  document.querySelectorAll('.copyableCode').forEach((block)=>{ const code=block.querySelector('code'); if(!code) return; const btn=document.createElement('button'); btn.type='button'; btn.className='codeCopyButton'; btn.textContent='Copy'; btn.addEventListener('click', async()=>{ try{ await navigator.clipboard.writeText(code.textContent||''); btn.textContent='Copied'; setTimeout(()=>btn.textContent='Copy',1600);}catch{btn.textContent='Select text';} }); block.appendChild(btn); });
})();
