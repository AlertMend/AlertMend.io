(function(){
  document.querySelectorAll('[data-faq-toggle]').forEach(function(button){
    button.addEventListener('click',function(){
      var item=button.closest('.faqItem'); var answer=item&&item.querySelector('.faqAnswer');
      var open=button.getAttribute('aria-expanded')==='true';
      button.setAttribute('aria-expanded',open?'false':'true');
      if(answer) answer.classList.toggle('hidden',open);
      var chevron=button.querySelector('.faqChevron');
      if(chevron) chevron.classList.toggle('faqChevronOpen',!open);
    });
  });
  var tabs=[].slice.call(document.querySelectorAll('[data-deploy-tab]'));
  tabs.forEach(function(tab){
    tab.addEventListener('click',function(){
      var target=tab.getAttribute('data-deploy-tab');
      tabs.forEach(function(t){ t.setAttribute('aria-selected',String(t===tab)); });
      document.querySelectorAll('[data-deploy-panel]').forEach(function(panel){
        panel.hidden=panel.getAttribute('data-deploy-panel')!==target;
      });
    });
  });
  document.querySelectorAll('.command').forEach(function(block){
    var button=block.querySelector('.copyCode'); var code=block.querySelector('code');
    if(!button||!code) return;
    button.addEventListener('click',async function(){
      try { await navigator.clipboard.writeText(code.textContent||''); button.textContent='Copied'; setTimeout(function(){button.textContent='Copy';},1400); }
      catch(e) { button.textContent='Select'; }
    });
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