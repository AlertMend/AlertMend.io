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
})();