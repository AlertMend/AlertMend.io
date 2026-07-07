(function () {
  const modeButtons = document.querySelectorAll('[data-mode-id]');
  const modePanels = document.querySelectorAll('[data-mode-panel]');

  function renderMode(id) {
    modeButtons.forEach((btn) => {
      const active = btn.getAttribute('data-mode-id') === id;
      btn.classList.toggle('modeCardActive', active);
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    modePanels.forEach((panel) => {
      panel.classList.toggle('hidden', panel.getAttribute('data-mode-panel') !== id);
    });
  }

  modeButtons.forEach((btn) => {
    btn.addEventListener('click', () => renderMode(btn.getAttribute('data-mode-id')));
  });

  renderMode('vps');

  /* ---- Capability showcase ---- */
  const capabilities = window.__CHAT_CAPABILITIES__ || [];
  const assetsBase = window.__OPENCLAW_ASSETS__ || '/assets/openclaw-cloud-infra-slack-telegram';
  const lobsterSrc = assetsBase + '/pixel-lobster.svg';
  const chatDemo = document.getElementById('chat-demo');
  const chatBody = document.getElementById('chat-demo-body');
  const chatApp = document.getElementById('chat-demo-app');
  const chatChannel = document.getElementById('chat-demo-channel');
  const promptEl = document.getElementById('prompt-preview');
  const promptWrap = document.getElementById('prompt-wrap');
  const promptSend = document.getElementById('prompt-send');
  const backstageEl = document.getElementById('backstage-steps');
  const backstageBox = document.getElementById('chat-backstage');
  const backstageSuccess = document.getElementById('backstage-success');
  const capPills = document.querySelectorAll('[data-cap-id]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let capIndex = 0;
  let playGen = 0;
  let autoTimer = null;
  let currentAutoMs = 16000;

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function nowTime() {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }

  function estimateDuration(cap) {
    let ms = 1200;
    ms += cap.prompt.length * (reducedMotion ? 8 : 32);
    cap.messages.forEach((msg, i) => {
      const len = msg.text.length;
      if (msg.role === 'user') {
        ms += reducedMotion ? 400 : len * 22 + 500;
        if (i === 0) ms += reducedMotion ? 300 : 900;
      } else {
        ms += reducedMotion ? 600 : len * 38 + rand(900, 1400);
        if (msg.action) ms += 500;
      }
    });
    return Math.max(Math.ceil(ms + 2200), 13000);
  }

  function setActivePill(id, durationMs) {
    capPills.forEach((btn) => {
      const active = btn.getAttribute('data-cap-id') === id;
      btn.classList.toggle('capabilityPillActive', active);
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
      const prog = btn.querySelector('.capabilityPillProgress');
      if (prog) {
        prog.style.animation = 'none';
        void prog.offsetWidth;
        if (active) {
          btn.style.setProperty('--cap-duration', durationMs + 'ms');
          prog.style.animation = '';
        }
      }
    });
  }

  function setAppTheme(app) {
    if (!chatDemo) return;
    const isSlack = app === 'Slack';
    chatDemo.classList.toggle('chatDemoSlack', isSlack);
    chatDemo.classList.toggle('chatDemoTelegram', !isSlack);
    if (chatApp) {
      chatApp.textContent = isSlack ? 'Slack' : 'Telegram';
      chatApp.classList.toggle('hidden', isSlack);
    }
    const slackLogo = document.getElementById('chat-slack-logo');
    const composer = document.getElementById('chat-composer');
    if (chatChannel) {
      chatChannel.textContent = isSlack ? '# infra-control' : 'OpenClaw Bot';
    }
    if (slackLogo) slackLogo.classList.toggle('hidden', !isSlack);
    if (composer) composer.classList.toggle('hidden', !isSlack);
  }

  function createAvatar(role) {
    if (role === 'bot') {
      const avatar = document.createElement('img');
      avatar.className = 'chatBotAvatar';
      avatar.src = lobsterSrc;
      avatar.alt = 'OpenClaw';
      avatar.width = 36;
      avatar.height = 36;
      return avatar;
    }
    const avatar = document.createElement('div');
    avatar.className = 'chatUserAvatar';
    avatar.setAttribute('aria-hidden', 'true');
    avatar.textContent = 'Y';
    return avatar;
  }

  function createMsgRow(role) {
    const row = document.createElement('div');
    row.className = 'chatMsg ' + (role === 'user' ? 'chatMsgUser' : 'chatMsgBot');
    row.appendChild(createAvatar(role));

    const content = document.createElement('div');
    content.className = 'chatMsgContent';

    const meta = document.createElement('div');
    meta.className = 'chatMsgMeta';
    const name = document.createElement('span');
    name.className = 'chatMsgName';
    name.textContent = role === 'user' ? 'You' : 'OpenClaw';
    const time = document.createElement('span');
    time.className = 'chatMsgTime';
    time.textContent = nowTime();
    meta.appendChild(name);
    meta.appendChild(time);

    const bubble = document.createElement('div');
    bubble.className = 'chatBubble ' + (role === 'user' ? 'chatBubbleUser' : 'chatBubbleBot');

    content.appendChild(meta);
    content.appendChild(bubble);
    row.appendChild(content);

    return { row, bubble };
  }

  function scrollChat() {
    if (!chatBody) return;
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: reducedMotion ? 'auto' : 'smooth' });
  }

  function renderBackstage(steps) {
    if (!backstageEl) return;
    backstageEl.innerHTML = (steps || [])
      .map(
        (text) =>
          '<li class="backstageStep"><span class="backstageStepDot" aria-hidden="true"></span><span class="backstageStepText">' +
          text +
          '</span></li>'
      )
      .join('');
    if (backstageSuccess) backstageSuccess.classList.add('hidden');
    if (backstageBox) backstageBox.classList.remove('backstageComplete');
  }

  function setBackstageStep(index) {
    if (!backstageEl) return;
    const items = backstageEl.querySelectorAll('.backstageStep');
    items.forEach((el, i) => {
      el.classList.remove('backstageStepActive', 'backstageStepDone');
      if (i < index) el.classList.add('backstageStepDone');
      else if (i === index) el.classList.add('backstageStepActive');
    });
  }

  function finishBackstage() {
    if (!backstageEl) return;
    backstageEl.querySelectorAll('.backstageStep').forEach((el) => {
      el.classList.remove('backstageStepActive');
      el.classList.add('backstageStepDone');
    });
    if (backstageBox) backstageBox.classList.add('backstageComplete');
    if (backstageSuccess) backstageSuccess.classList.remove('hidden');
  }

  async function fadeChatOut(gen) {
    if (!chatBody) return;
    chatBody.classList.add('chatDemoBodyFade');
    await sleep(reducedMotion ? 80 : 260);
    if (gen !== playGen) return;
    chatBody.innerHTML = '';
    chatBody.classList.remove('chatDemoBodyFade');
  }

  async function flashAppSwitch(gen) {
    if (!chatDemo || reducedMotion) return;
    chatDemo.classList.add('chatDemoSwitch');
    await sleep(220);
    if (gen !== playGen) return;
    chatDemo.classList.remove('chatDemoSwitch');
  }

  async function typePrompt(text, gen) {
    if (!promptEl || !promptWrap) return;
    promptWrap.classList.remove('promptSent');
    promptEl.classList.remove('promptDone');
    promptEl.textContent = '';
    if (promptSend) promptSend.classList.remove('promptSendBtnPulse');

    if (reducedMotion) {
      promptEl.textContent = '"' + text + '"';
      promptEl.classList.add('promptDone');
      return;
    }

    const quoted = '"' + text + '"';
    for (let i = 0; i <= quoted.length; i++) {
      promptEl.textContent = quoted.slice(0, i);
      await sleep(rand(22, 42));
      if (gen !== playGen) return;
    }
    promptEl.classList.add('promptDone');
    if (promptSend) {
      promptSend.classList.add('promptSendBtnPulse');
      await sleep(380);
      if (gen !== playGen) return;
    }
  }

  async function animateSend(gen) {
    if (!promptWrap || reducedMotion) {
      if (promptEl) promptEl.textContent = '';
      return;
    }
    promptWrap.classList.add('promptSending');
    await sleep(180);
    if (gen !== playGen) return;
    promptWrap.classList.remove('promptSending');
    promptWrap.classList.add('promptSent');
    if (promptEl) promptEl.textContent = '';
    if (promptSend) promptSend.classList.remove('promptSendBtnPulse');
    await sleep(120);
  }

  async function typeInBubble(bubble, text, gen) {
    if (reducedMotion) {
      bubble.textContent = text;
      bubble.classList.add('chatBubbleLanded');
      return;
    }
    bubble.textContent = '';
    for (let i = 0; i <= text.length; i++) {
      bubble.textContent = text.slice(0, i);
      if (i % 4 === 0) scrollChat();
      await sleep(rand(16, 34));
      if (gen !== playGen) return;
    }
    bubble.classList.add('chatBubbleLanded');
    scrollChat();
  }

  async function streamBotBubble(bubble, text, gen) {
    if (reducedMotion) {
      bubble.textContent = text;
      bubble.classList.add('chatBubbleLanded');
      return;
    }
    const words = text.split(' ');
    let out = '';
    bubble.textContent = '';
    for (let w = 0; w < words.length; w++) {
      out += (out ? ' ' : '') + words[w];
      bubble.textContent = out;
      scrollChat();
      await sleep(rand(28, 52));
      if (gen !== playGen) return;
    }
    bubble.classList.add('chatBubbleLanded');
  }

  async function showInlineTyping(gen) {
    if (!chatBody) return null;
    const row = document.createElement('div');
    row.className = 'chatMsg chatMsgBot chatTypingRow';
    row.innerHTML =
      '<img class="chatBotAvatar" src="' +
      lobsterSrc +
      '" alt="OpenClaw" width="36" height="36">' +
      '<div class="chatMsgContent">' +
      '<div class="chatMsgMeta"><span class="chatMsgName">OpenClaw</span><span class="chatMsgTime chatMsgTimeThinking">typing…</span></div>' +
      '<div class="chatTypingInline" aria-hidden="true"><span></span><span></span><span></span></div>' +
      '</div>';
    chatBody.appendChild(row);
    scrollChat();
    const duration = reducedMotion ? 400 : rand(1100, 1900);
    await sleep(duration);
    if (gen !== playGen) {
      row.remove();
      return null;
    }
    row.classList.add('chatTypingRowOut');
    await sleep(reducedMotion ? 0 : 180);
    row.remove();
    return row;
  }

  async function appendActionBadge(bubble, action, gen) {
    if (!action) return;
    await sleep(reducedMotion ? 0 : 200);
    if (gen !== playGen) return;
    const badge = document.createElement('span');
    badge.className = 'chatBubbleAction';
    badge.textContent = '▶ ' + action;
    bubble.appendChild(document.createElement('br'));
    bubble.appendChild(badge);
    requestAnimationFrame(() => badge.classList.add('chatBubbleActionPop'));
    scrollChat();
  }

  async function playUserMessage(text, gen, fromPrompt) {
    const { row, bubble } = createMsgRow('user');
    chatBody.appendChild(row);
    row.classList.add('chatMsgEnter');
    scrollChat();
    if (fromPrompt) await sleep(reducedMotion ? 100 : 280);
    await typeInBubble(bubble, text, gen);
    if (gen !== playGen) return;
    await sleep(reducedMotion ? 200 : rand(350, 550));
  }

  async function playBotMessage(msg, gen) {
    await showInlineTyping(gen);
    if (gen !== playGen) return;
    const { row, bubble } = createMsgRow('bot');
    chatBody.appendChild(row);
    row.classList.add('chatMsgEnter');
    await streamBotBubble(bubble, msg.text, gen);
    if (gen !== playGen) return;
    await appendActionBadge(bubble, msg.action, gen);
    await sleep(reducedMotion ? 300 : rand(500, 800));
  }

  async function playCapability(cap, gen) {
    if (!chatBody || !cap) return;

    currentAutoMs = estimateDuration(cap);
    await fadeChatOut(gen);
    if (gen !== playGen) return;

    setAppTheme(cap.app);
    await flashAppSwitch(gen);
    if (gen !== playGen) return;

    renderBackstage(cap.backstage);
    setActivePill(cap.id, currentAutoMs);
    capIndex = capabilities.findIndex((c) => c.id === cap.id);

    const steps = cap.backstage || [];
    let stepPtr = 0;
    const advanceStep = async () => {
      if (steps.length && stepPtr < steps.length) {
        setBackstageStep(stepPtr);
        stepPtr += 1;
        await sleep(reducedMotion ? 100 : 320);
      }
    };

    await typePrompt(cap.prompt, gen);
    if (gen !== playGen) return;
    await animateSend(gen);
    if (gen !== playGen) return;

    for (let m = 0; m < cap.messages.length; m++) {
      const msg = cap.messages[m];
      const isFirst = m === 0;

      if (msg.role === 'user') {
        if (isFirst) await advanceStep();
        await playUserMessage(msg.text, gen, isFirst);
        if (gen !== playGen) return;
        if (!isFirst && steps.length && stepPtr < steps.length) await advanceStep();
      } else {
        await advanceStep();
        await playBotMessage(msg, gen);
        if (gen !== playGen) return;
      }
    }

    if (steps.length) {
      while (stepPtr < steps.length) {
        setBackstageStep(stepPtr);
        stepPtr += 1;
        await sleep(reducedMotion ? 80 : 200);
      }
      finishBackstage();
    }

    await sleep(reducedMotion ? 800 : 2200);
  }

  function scheduleAuto() {
    if (autoTimer) clearTimeout(autoTimer);
    autoTimer = setTimeout(() => {
      capIndex = (capIndex + 1) % capabilities.length;
      startPlay(capabilities[capIndex]);
    }, currentAutoMs);
  }

  function startPlay(cap) {
    playGen += 1;
    const gen = playGen;
    if (autoTimer) clearTimeout(autoTimer);
    if (promptWrap) {
      promptWrap.classList.remove('promptSent', 'promptSending');
    }
    playCapability(cap, gen).then(() => {
      if (gen === playGen) scheduleAuto();
    });
  }

  capPills.forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-cap-id');
      const cap = capabilities.find((c) => c.id === id);
      if (cap) startPlay(cap);
    });
  });

  if (capabilities.length && chatBody) {
    startPlay(capabilities[0]);
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