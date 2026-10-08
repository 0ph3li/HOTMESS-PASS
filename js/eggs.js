/* =========================================================
   HOTMESS PASS® — eggs.js · things nobody asked for
   concept, design & code by ghostly.grl ♥
   ---------------------------------------------------------
   1. after hours (3–4AM, or ?3am)      5. screensaver (60s idle)
   2. voicemail (HM.voicemail)          6. right-click menu
   3. type "hotmess" anywhere           7. console note
   4. secret barcode in every footer
   ========================================================= */
(() => {
  const { $, $$ } = HM;
  const G = HM.hasGsap;
  const MOTION = G && !HM.reduced;
  const page = document.body.dataset.page || '';
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* =======================================================
     1 · AFTER HOURS — the site changes between 3 and 4AM
     ======================================================= */
  const force = /[?&]3am\b/.test(location.search);
  if (new Date().getHours() === 3 || force) {
    document.documentElement.classList.add('after-hours');
    document.body.insertAdjacentHTML('beforeend', `
      <div class="ah-tint" aria-hidden="true"></div>
      <div class="ah-badge mono" aria-hidden="true"><i></i>AFTER HOURS · <b id="ahClock">03:12</b></div>`);
    const tick = () => { const d = new Date(); $('#ahClock').textContent = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }); };
    tick(); setInterval(tick, 10000);
    setTimeout(() => HM.toast("it's 3AM. the bureau sees you. go to sleep (you won't)."), 1600);
  }

  /* =======================================================
     2 · VOICEMAIL — call 333-333-333 (or tear a tab)
     ======================================================= */
  const VM = [
    ['hi. you\'ve reached the bureau of emotional identity.', 'hey… it\'s me. i know it\'s late.', 'this is an automated message for: you.'],
    ['nobody is available to take your feelings right now.', 'i saw the flyer. i think i saw her. at the party. she looked… fine.', 'your pass has been found. it was in your other jacket.'],
    ['please leave a message after the tone. or don\'t. we\'ll know.', 'anyway. call me back. or don\'t. whatever.', 'it\'s been laminated. no refunds.'],
  ];
  let actx;
  const tone = (f, t0, d, v = 0.05, type = 'sine') => {
    const o = actx.createOscillator(), g = actx.createGain();
    o.type = type; o.frequency.value = f;
    g.gain.setValueAtTime(0, actx.currentTime + t0);
    g.gain.linearRampToValueAtTime(v, actx.currentTime + t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + t0 + d);
    o.connect(g).connect(actx.destination); o.start(actx.currentTime + t0); o.stop(actx.currentTime + t0 + d + 0.05);
  };
  HM.voicemail = (num = '333-333-333', variant) => {
    $('#vm')?.remove();
    const v = variant ?? Math.floor(Math.random() * 3);
    const lines = VM.map((l) => l[v]);
    document.body.insertAdjacentHTML('beforeend', `
      <div class="vm" id="vm" role="dialog" aria-modal="true" aria-label="Voicemail">
        <div class="vm-phone">
          <p class="vm-top mono"><span>calling</span><span class="blink">●</span></p>
          <p class="vm-num">${esc(num)}</p>
          <canvas class="vm-wave" width="560" height="90"></canvas>
          <div class="vm-tx mono" aria-live="polite"></div>
          <button type="button" class="vm-end mono">hang up ✕</button>
        </div>
      </div>`);
    const vm = $('#vm'), tx = $('.vm-tx', vm), cv = $('.vm-wave', vm), c = cv.getContext('2d');
    let talking = 0, alive = true, raf;
    const close = () => { alive = false; cancelAnimationFrame(raf); vm.remove(); HM.lenis?.start(); };
    $('.vm-end', vm).addEventListener('click', close);
    vm.addEventListener('click', (e) => { if (e.target === vm) close(); });
    document.addEventListener('keydown', function k(e) { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', k); } });
    HM.lenis?.stop();
    if (MOTION) gsap.from('.vm-phone', { y: 80, rotation: -6, autoAlpha: 0, duration: 0.6, ease: 'expo.out' });
    // waveform
    const draw = (t) => {
      c.clearRect(0, 0, cv.width, cv.height);
      c.fillStyle = '#ff3fa4';
      for (let x = 0; x < cv.width; x += 6) {
        const a = talking ? (0.25 + 0.75 * Math.abs(Math.sin(x * 0.05 + t / 90) * Math.sin(x * 0.013 + t / 300))) : 0.04;
        const h = a * cv.height * (0.6 + Math.random() * 0.4);
        c.fillRect(x, (cv.height - h) / 2, 3, h);
      }
      if (alive) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    // the call
    try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}
    const say = (text) => new Promise((res) => {
      const p = document.createElement('p'); tx.appendChild(p);
      let i = 0; talking = 1;
      const step = () => {
        if (!alive) return res();
        p.textContent = text.slice(0, ++i);
        if (actx && i % 2 === 0 && /[a-z]/i.test(text[i])) tone(180 + Math.random() * 140, 0, 0.07, 0.03, 'triangle');
        if (i < text.length) setTimeout(step, 38); else { talking = 0; setTimeout(res, 550); }
      };
      step();
    });
    (async () => {
      if (actx) { for (let r = 0; r < 2; r++) { tone(440, r * 1.2, 0.45, 0.05); tone(480, r * 1.2, 0.45, 0.05); } }
      await new Promise((r) => setTimeout(r, actx ? 2400 : 300));
      for (const l of lines) { if (!alive) return; await say(l); }
      if (actx && alive) tone(1000, 0.1, 0.5, 0.06);
      if (alive) { const p = document.createElement('p'); p.className = 'vm-beep'; p.textContent = '— BEEP —'; tx.appendChild(p); }
    })();
  };
  // every "call" number on the site rings
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-call], .m-call');
    if (!t) return;
    e.preventDefault();
    HM.voicemail(t.dataset.call || '333-333-333');
  });

  /* =======================================================
     3 · TYPE "hotmess" ANYWHERE — glitter + graffiti
     ======================================================= */
  let buf = '';
  document.addEventListener('keydown', (e) => {
    if (e.target.closest?.('input, textarea, [contenteditable]')) return;
    if (e.key.length !== 1) return;
    buf = (buf + e.key.toLowerCase()).slice(-7);
    if (buf === 'hotmess') { buf = ''; mess(); }
  });
  let glitterOn = 0;
  function mess() {
    HM.toast('✦ certified mess mode ✦');
    HM.beep(1200, 0.06); setTimeout(() => HM.beep(1800, 0.08), 90); setTimeout(() => HM.beep(2600, 0.1), 180);
    glitterOn = Date.now() + 15000;
    const tags = ['xoxo', 'hot mess', 'ghostly.grl', 'u r the product', 'delulu', '3AM', 'void'];
    for (let i = 0; i < 9; i++) {
      setTimeout(() => {
        const t = document.createElement('div');
        t.className = 'tag-spray';
        t.textContent = tags[Math.floor(Math.random() * tags.length)];
        t.style.left = Math.random() * 80 + 4 + 'vw';
        t.style.top = Math.random() * 80 + 6 + 'vh';
        t.style.rotate = (-25 + Math.random() * 50) + 'deg';
        t.style.fontSize = 40 + Math.random() * 70 + 'px';
        document.body.appendChild(t);
        if (MOTION) gsap.fromTo(t, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 0.6, ease: 'power1.inOut' });
        setTimeout(() => (MOTION ? gsap.to(t, { autoAlpha: 0, duration: 1.2, onComplete: () => t.remove() }) : t.remove()), 9000);
      }, i * 160);
    }
  }
  window.addEventListener('pointermove', (e) => {
    if (Date.now() > glitterOn) return;
    for (let i = 0; i < 2; i++) {
      const s = document.createElement('i');
      s.className = 'glitter';
      s.textContent = ['✦', '✧', '★', '·'][Math.floor(Math.random() * 4)];
      s.style.left = e.clientX + 'px'; s.style.top = e.clientY + 'px';
      s.style.color = ['#ff3fa4', '#ffffff', '#ffd6ef', '#e4ff3a'][Math.floor(Math.random() * 4)];
      document.body.appendChild(s);
      const dx = (Math.random() - 0.5) * 80, dy = 30 + Math.random() * 80;
      s.animate([{ transform: 'translate(-50%,-50%) scale(1)', opacity: 1 }, { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(.2) rotate(180deg)`, opacity: 0 }], { duration: 900 + Math.random() * 500, easing: 'cubic-bezier(.2,.6,.3,1)' }).onfinish = () => s.remove();
    }
  }, { passive: true });

  /* =======================================================
     4 · SECRET BARCODE — hidden in every footer
     ======================================================= */
  const sign = $('.ft-sign');
  if (sign && window.JsBarcode) {
    sign.insertAdjacentHTML('beforeend', ' <svg class="barcode secret-code" data-code="GHOSTLY.GRL WAS HERE" data-h="30" data-w="1" data-bg="#ecebe6" aria-label="a barcode. scan it."></svg>');
    HM.barcode($('.secret-code'));
  }

  /* =======================================================
     5 · SCREENSAVER — 60s idle, the pass bounces
     ======================================================= */
  if (page !== 'booth') {
    let idleT, saver = null, raf2;
    const arm = () => { clearTimeout(idleT); idleT = setTimeout(startSaver, 60000); };
    const stopSaver = () => { if (!saver) return; cancelAnimationFrame(raf2); saver.remove(); saver = null; };
    ['pointermove', 'keydown', 'wheel', 'touchstart', 'scroll'].forEach((ev) => window.addEventListener(ev, () => { stopSaver(); arm(); }, { passive: true }));
    arm();
    function startSaver() {
      if (document.hidden || $('.reader.is-on') || $('#vm')) return arm();
      document.body.insertAdjacentHTML('beforeend', `
        <div class="saver" id="saver" aria-hidden="true">
          <div class="sv-card" id="svCard"><b>HOTMESS</b><span>PASS®</span><i class="mono">still there?</i></div>
          <p class="sv-hits mono">corner hits: <b id="svHits">0</b></p>
        </div>`);
      saver = $('#saver');
      const card = $('#svCard'), colors = ['#ff3fa4', '#e4ff3a', '#2ef2ff', '#ffffff', '#e8231a', '#b9a7ff'];
      let x = Math.random() * (innerWidth - 260), y = Math.random() * (innerHeight - 160), vx = 2.2, vy = 1.8, ci = 0, hits = 0;
      const step = () => {
        const w = card.offsetWidth, h = card.offsetHeight;
        x += vx; y += vy;
        let bx = false, by = false;
        if (x <= 0 || x + w >= innerWidth) { vx *= -1; x = Math.max(0, Math.min(x, innerWidth - w)); bx = true; }
        if (y <= 0 || y + h >= innerHeight) { vy *= -1; y = Math.max(0, Math.min(y, innerHeight - h)); by = true; }
        if (bx || by) { ci = (ci + 1) % colors.length; card.style.background = colors[ci]; }
        if (bx && by) { hits++; $('#svHits').textContent = hits; HM.toast('IT HIT THE CORNER. you\'re welcome.'); }
        card.style.transform = `translate(${x}px, ${y}px)`;
        raf2 = requestAnimationFrame(step);
      };
      step();
    }
  }

  /* =======================================================
     6 · RIGHT-CLICK MENU (shift + right click = the normal one)
     ======================================================= */
  const ITEMS = [
    ['copy your identity', () => { navigator.clipboard?.writeText('U ARE THE PRODUCT').catch(() => {}); HM.toast('copied: U ARE THE PRODUCT'); }],
    ['report a feeling', () => (location.href = 'registry.html#report')],
    ['undo last text', () => HM.toast('too late. delivered 03:12. read 03:12.')],
    ['scan this page', () => (location.href = 'scan.html')],
    ['call the bureau', () => HM.voicemail('333-333-333')],
    ['view source of pain', () => HM.toast('it\'s you. it was always you. (also: ctrl+u)')],
  ];
  document.addEventListener('contextmenu', (e) => {
    if (e.shiftKey || e.target.closest('input, textarea, video, canvas')) return;
    e.preventDefault();
    $('#ctx')?.remove();
    document.body.insertAdjacentHTML('beforeend', `<ul class="ctx mono" id="ctx" role="menu">${ITEMS.map(([t], i) => `<li role="menuitem" tabindex="-1" data-i="${i}">${t}</li>`).join('')}<li class="ctx-hint">shift + right click = boring menu</li></ul>`);
    const m = $('#ctx');
    m.style.left = Math.min(e.clientX, innerWidth - m.offsetWidth - 8) + 'px';
    m.style.top = Math.min(e.clientY, innerHeight - m.offsetHeight - 8) + 'px';
    if (MOTION) gsap.from(m, { scale: 0.9, autoAlpha: 0, duration: 0.18, transformOrigin: '0 0' });
    HM.beep(900, 0.02, 0.02);
  });
  document.addEventListener('click', (e) => {
    const li = e.target.closest('#ctx li[data-i]');
    if (li) ITEMS[+li.dataset.i][1]();
    $('#ctx')?.remove();
  });
  window.addEventListener('scroll', () => $('#ctx')?.remove(), { passive: true });

  /* =======================================================
     7 · CONSOLE NOTE
     ======================================================= */
  console.log(
    '%c▌▌▐▌▌▐▐▌▌▐▌▐▐▌▌▌▐▌▐▐▌▌▐\n%cU ARE THE PRODUCT\n%cyou opened the console. that\'s very main character of you.\ntry: typing "hotmess" on the page · visiting at 3AM (or ?3am) · scanning the barcode in the footer · calling 333-333-333\n— ghostly.grl ♥',
    'font: 20px monospace; color: #ff3fa4', 'font: 900 22px "Inter Tight", sans-serif; color: #0d0c0c; background: #ff3fa4; padding: 4px 8px', 'font: 12px monospace; color: #888; line-height: 1.6'
  );
})();
