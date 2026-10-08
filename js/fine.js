/* =========================================================
   HOTMESS PASS® — fine.js · terms of feeling
   ========================================================= */
(() => {
  const { $, $$ } = HM;
  const G = HM.hasGsap;
  const MOTION = G && !HM.reduced;

  /* ---------- intro ---------- */
  if (MOTION) {
    const chars = HM.split($('#fpMast'), 'chars');
    gsap.timeline({ defaults: { ease: 'expo.out' } })
      .from(chars, { yPercent: -110, scaleY: 2.2, transformOrigin: '50% 0', duration: 1.1, stagger: 0.04 })
      .from('.fp-row span, .fp-lead', { autoAlpha: 0, y: 16, stagger: 0.08, duration: 0.7 }, 0.4);
    gsap.from('.doc', { y: 140, rotation: 2, autoAlpha: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.doc', start: 'top 85%' } });
    gsap.from('.mnote', { autoAlpha: 0, scale: 0.6, duration: 0.5, stagger: 0.1, ease: 'back.out(2)', scrollTrigger: { trigger: '.clauses', start: 'top 70%' } });
  }

  /* ---------- highlighter swipes in as you read ---------- */
  $$('.cl mark').forEach((m) => {
    if (!G) return m.classList.add('is-on');
    ScrollTrigger.create({ trigger: m, start: 'top 75%', once: true, onEnter: () => m.classList.add('is-on') });
  });

  /* ---------- the magnifier on the tiny clauses ---------- */
  const lens = $('#lens'), lensIn = $('#lensIn'), Z = 3.2;
  const tiny = $$('.cl').filter((c) => parseFloat(c.style.getPropertyValue('--fs')) <= 11);
  let current = null;
  tiny.forEach((c) => {
    c.addEventListener('pointerenter', (e) => {
      if (e.pointerType !== 'mouse') return;
      current = c;
      lensIn.innerHTML = '';
      const clone = c.cloneNode(true);
      clone.querySelectorAll('.mnote').forEach((n) => n.remove());
      clone.style.width = c.offsetWidth + 'px';
      clone.style.margin = 0;
      lensIn.appendChild(clone);
      lensIn.style.transform = `scale(${Z})`;
      lens.classList.add('is-on');
    });
    c.addEventListener('pointerleave', () => { current = null; lens.classList.remove('is-on'); });
  });
  window.addEventListener('pointermove', (e) => {
    if (!current) return;
    const r = current.getBoundingClientRect();
    lens.style.left = e.clientX + 'px'; lens.style.top = e.clientY + 'px';
    lensIn.style.left = 110 - (e.clientX - r.left) * Z + 'px';
    lensIn.style.top = 110 - (e.clientY - r.top) * Z + 'px';
  }, { passive: true });
  window.addEventListener('scroll', () => { if (current) { current = null; lens.classList.remove('is-on'); } }, { passive: true });

  /* ---------- "I agree" runs away four times ---------- */
  const box = $('#agreeBox'), chk = $('#agreeCheck'), inp = $('#agreeIn'), txt = $('#agreeTxt');
  const LINES = ['I have read and agree to feel things', 'are you sure?', 'you didn\'t read it', 'ok scroll up. read it.', 'fine. catch me.'];
  let tries = 0;
  const dodge = () => {
    if (tries >= 4 || inp.checked) return;
    tries++;
    txt.textContent = LINES[tries];
    const maxX = box.clientWidth - chk.offsetWidth - 10, maxY = box.clientHeight - chk.offsetHeight - 10;
    chk.style.left = Math.max(10, Math.random() * maxX) + 'px';
    chk.style.top = Math.max(10, Math.random() * maxY) + 'px';
    HM.beep(700 + tries * 200, 0.04, 0.03);
  };
  chk.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') dodge(); });
  chk.addEventListener('click', (e) => {
    if (tries < 4) { e.preventDefault(); dodge(); return; }
  });
  inp.addEventListener('change', () => {
    if (!inp.checked) return;
    txt.textContent = 'agreed. there was no other option.';
    const sig = $('#sig'); sig.hidden = false;
    if (MOTION) gsap.from(sig, { y: 30, autoAlpha: 0, duration: 0.7, ease: 'expo.out' });
    HM.scrollTo(sig);
  });

  /* ---------- signature pad ---------- */
  const pad = $('#sigPad'), ctx = pad.getContext('2d');
  let drawing = false, last = null, ink = 0;
  ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#1f2bd1';
  const pt = (e) => { const r = pad.getBoundingClientRect(); return { x: (e.clientX - r.left) * (pad.width / r.width), y: (e.clientY - r.top) * (pad.height / r.height), t: performance.now() }; };
  pad.addEventListener('pointerdown', (e) => { drawing = true; last = pt(e); pad.setPointerCapture(e.pointerId); });
  pad.addEventListener('pointermove', (e) => {
    if (!drawing) return;
    const p = pt(e), dist = Math.hypot(p.x - last.x, p.y - last.y), v = dist / Math.max(1, p.t - last.t);
    ctx.lineWidth = Math.max(1.6, 6 - v * 2.2);           // ballpoint: faster = thinner
    ctx.beginPath(); ctx.moveTo(last.x, last.y); ctx.lineTo(p.x, p.y); ctx.stroke();
    ink += dist; last = p;
  });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach((ev) => pad.addEventListener(ev, () => (drawing = false)));
  $('#sigClear').addEventListener('click', () => { ctx.clearRect(0, 0, pad.width, pad.height); ink = 0; });
  $('#sigOk').addEventListener('click', () => {
    if (ink < 120) { HM.toast('that\'s not a signature. that\'s a cry for help. sign properly.'); return; }
    const b = $('#bound'), d = new Date();
    $('#boundTxt').textContent = `contract TF-00 · signed ${d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}, ${d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} · no refunds`;
    b.hidden = false;
    $('#sigOk').disabled = true;
    HM.beep(80, 0.18, 0.2);
    if (MOTION) gsap.fromTo('.bound-st', { scale: 3, autoAlpha: 0, rotation: -40 }, { scale: 1, autoAlpha: 0.95, rotation: -8, duration: 0.35, ease: 'power4.in' });
    HM.toast('signed. you are now legally a hot mess.');
  });

  /* ---------- the cookie banner ---------- */
  const ck = $('#cookie'), no = $('#ckNo');
  if (HM.store.get('cookies', sessionStorage)) ck.hidden = true;
  else if (MOTION) gsap.from(ck, { yPercent: 160, duration: 0.9, delay: 1.4, ease: 'expo.out' });
  const NO = ['are you sure?', 'really?', 'you can\'t', 'it\'s tiny now', 'ok fine.'];
  let nos = 0;
  const closeCk = (msg) => {
    HM.store.set('cookies', '1', sessionStorage);
    HM.toast(msg);
    if (MOTION) gsap.to(ck, { yPercent: 200, duration: 0.6, ease: 'power3.in', onComplete: () => (ck.hidden = true) }); else ck.hidden = true;
  };
  $('#ckYes').addEventListener('click', () => closeCk('all feelings accepted. there\'s no going back.'));
  no.addEventListener('click', () => {
    if (nos >= NO.length - 1) return closeCk('rejection noted. feelings accepted anyway.');
    nos++;
    no.textContent = NO[nos];
    no.style.transform = `translate(${(Math.random() - 0.5) * 60}px, ${-Math.random() * 30}px) scale(${1 - nos * 0.17})`;
    HM.beep(400 - nos * 50, 0.05, 0.04);
  });
})();
