/* =========================================================
   HOTMESS PASS® — apply.js · form HM-00
   ========================================================= */
(() => {
  const { $, $$ } = HM;
  const G = HM.hasGsap;
  const MOTION = G && !HM.reduced;

  /* =======================================================
     DATA
     ======================================================= */
  const CLASSES = {
    hotmess: { label: 'HOT MESS®', status: 'CERTIFIED', desc: 'certified. glitter, regret, a great story.', access: 'every bathroom after 2AM', side: 'glitter, regret, a great story', note: "she's a lot. approve her." },
    delulu: { label: 'DELULU', status: 'SELF-ISSUED', desc: 'the delusion is the solution. it says so on the card.', access: 'parallel universes, his close friends', side: 'manifesting (aggressively)', note: 'she thinks this is fate. let her.' },
    situationship: { label: 'SITUATIONSHIP', status: 'TEMPORARY, FOREVER', desc: "valid until someone asks “what are we?”", access: '“what are we?” (denied)', side: 'read at 01:47', note: 'unclear. approve anyway.' },
    main: { label: 'MAIN CHARACTER', status: 'LIMITED EDITION', desc: 'slow motion is on. everyone else is an extra.', access: 'slow motion, wind machine', side: 'everyone else is an extra', note: 'she walked in like it was a music video.' },
    ghost: { label: 'GHOST(ED)', status: 'REVOKED', desc: 'you were never here. we issued you anyway.', access: 'nowhere. you were never here.', side: 'seen 1 week ago', note: 'who? approve. whatever.' },
  };
  const QUESTIONS = [
    { q: "it's 3AM. <em>where are you?</em>", o: [
      ['crying in someone else\'s bathroom', 'hotmess'], ['rewatching our 2019 stories', 'delulu'], ['typing “u up?” and deleting it', 'situationship'],
      ['on a rooftop. wind in my hair. no reason.', 'main'], ['nowhere. offline. gone.', 'ghost']] },
    { q: 'last text you <em>didn\'t</em> send:', o: [
      ["“i'm actually not okay”", 'hotmess'], ["“we're literally soulmates btw”", 'delulu'], ['“i miss u”', 'situationship'],
      ["“whatever. i'm the moment.”", 'main'], ['“…”', 'ghost']] },
    { q: 'your <em>toxic</em> trait:', o: [
      ['3 drinks = new personality', 'hotmess'], ['i can fix him', 'delulu'], ['never asking “what are we?”', 'situationship'],
      ['every room is my red carpet', 'main'], ['leaving without saying bye', 'ghost']] },
    { q: 'pick a <em>weapon:</em>', o: [
      ['yesterday\'s eyeliner', 'hotmess'], ['a playlist about him', 'delulu'], ['“lol”', 'situationship'],
      ['lip gloss and a slow walk', 'main'], ['read receipts: off', 'ghost']] },
    { q: 'how are you, <em>honestly?</em>', o: [
      ['fine (lying)', 'hotmess'], ['manifesting', 'delulu'], ["it's complicated", 'situationship'],
      ['iconic, thank you', 'main'], ['…do i have to answer', 'ghost']] },
    { q: 'what do you want <em>from the bureau?</em>', o: [
      ['a new personality', 'hotmess'], ['a sign', 'delulu'], ['closure', 'situationship'],
      ['a spotlight', 'main'], ['proof that i exist', 'ghost']] },
  ];
  const TOTAL = QUESTIONS.length + 1;

  const state = { page: 0, name: '', photo: null, answers: [], ticket: null };

  /* =======================================================
     01 · WAITING ROOM — intro + ticket dispenser
     ======================================================= */
  const mastChars = HM.split($('#wMast'), 'chars');
  const serving = $('#serving'), takeBtn = $('#takeBtn'), ticket = $('#ticket');
  const pad4 = (n) => String(n).padStart(4, '0');

  if (MOTION) {
    gsap.timeline({ defaults: { ease: 'expo.out' } })
      .from('.a-wait .slot', { scale: 1.3, filter: 'blur(12px) brightness(1.8)', duration: 2 }, 0)
      .from(mastChars, { yPercent: -110, scaleY: 2.2, transformOrigin: '50% 0', duration: 1.1, stagger: 0.07 }, 0.1)
      .from('.w-row span, .w-lead', { autoAlpha: 0, y: 20, duration: 0.8, stagger: 0.1 }, 0.5)
      .from('.dispenser', { y: 200, rotation: 8, autoAlpha: 0, duration: 1.2 }, 0.4)
      .from('.w-note', { autoAlpha: 0, duration: 0.6 }, 1.2);
    // idle "now serving" flicker
    gsap.to(serving, { opacity: 0.55, duration: 0.08, repeat: -1, yoyo: true, repeatDelay: 2.4, ease: 'steps(1)' });
  }

  function giveTicket(n, animate) {
    state.ticket = pad4(n);
    $('#ticketNo').textContent = state.ticket;
    $('#sheetTicket').textContent = '#' + state.ticket;
    const tc = $('#ticketCode'); tc.dataset.code = 'HM-' + state.ticket; HM.barcode(tc);
    takeBtn.disabled = true; takeBtn.classList.add('is-pressed');
    const done = () => { serving.textContent = state.ticket; $('#goDesk').classList.add('is-on'); };
    if (!animate || !MOTION) {
      gsap?.set?.(ticket, { clipPath: 'inset(0% 0 0% 0)', y: 4, rotation: 3 });
      if (!G) ticket.style.clipPath = 'none';
      return done();
    }
    // the ticket prints out of the slot, then the board catches up with you
    const from = parseInt(serving.textContent, 10), steps = Math.min(6, n - from);
    gsap.timeline()
      .to(ticket, { clipPath: 'inset(0% 0 0% 0)', duration: 0.9, ease: 'steps(9)' })
      .to(ticket, { y: 6, rotation: 3, duration: 0.6, ease: 'elastic.out(1, .4)' })
      .call(() => {
        let i = 0;
        const tick = () => {
          i++;
          serving.textContent = pad4(i === steps ? n : from + Math.round((i / steps) * (n - from)));
          HM.beep(i === steps ? 1700 : 900, 0.06, 0.05);
          if (i < steps) setTimeout(tick, 380); else done();
        };
        setTimeout(tick, 300);
      });
  }
  takeBtn.addEventListener('click', () => {
    const n = Math.random() < 0.35 ? 666 : 663 + Math.floor(Math.random() * 30);
    HM.store.set('ticket', n, sessionStorage);
    HM.beep(400, 0.08);
    giveTicket(n, true);
  });
  const kept = HM.store.get('ticket', sessionStorage);
  if (kept) giveTicket(+kept, false);

  /* =======================================================
     02 · THE FORM
     ======================================================= */
  const pagesEl = $('#pages');
  const X = '<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M6 7 L34 33"/><path d="M33 6 L8 34"/></svg>';

  // page 1: who's applying
  pagesEl.insertAdjacentHTML('beforeend', `
    <div class="page" data-p="0">
      <span class="q-n">01 / ${pad4(TOTAL).slice(2)}</span>
      <p class="q">who's <em>applying?</em></p>
      <div class="p1">
        <div class="field">
          <label for="fName">full name (or the one you use at 3AM)</label>
          <input id="fName" maxlength="14" placeholder="write here">
          <small>it goes on the card. no @, no emojis.</small>
          <button type="button" class="next" id="next0">next page →</button>
        </div>
        <label class="staple" data-cursor="add photo">
          <div class="slot light" id="fPhotoSlot"><span class="slot-label">staple a photo<small>optional · stays on your device</small></span></div>
          <span class="hand">click to add</span>
          <input type="file" id="fPhoto" accept="image/*">
        </label>
      </div>
    </div>`);
  // question pages
  QUESTIONS.forEach((item, i) => {
    pagesEl.insertAdjacentHTML('beforeend', `
      <div class="page" data-p="${i + 1}" hidden>
        <span class="q-n">${pad4(i + 2).slice(2)} / ${pad4(TOTAL).slice(2)}</span>
        <p class="q">${item.q}</p>
        <div role="group">
          ${item.o.map(([t, k]) => `<button type="button" class="opt" data-k="${k}"><span class="box">${X}</span><span>${t}</span></button>`).join('')}
        </div>
      </div>`);
  });
  const pages = $$('.page', pagesEl);

  function show(n, dir = 1) {
    const cur = pages[state.page], nxt = pages[n];
    state.page = n;
    $('#pageNo').textContent = `PAGE ${n + 1} OF ${TOTAL}`;
    $('#progBar').style.width = (n / TOTAL) * 100 + '%';
    $('#backBtn').hidden = n === 0;
    if (cur === nxt) return;
    if (!MOTION) { cur.hidden = true; nxt.hidden = false; return; }
    gsap.timeline()
      .to(cur, { x: -80 * dir, rotation: -4 * dir, autoAlpha: 0, duration: 0.35, ease: 'power3.in' })
      .call(() => { cur.hidden = true; nxt.hidden = false; })
      .fromTo(nxt, { x: 80 * dir, rotation: 4 * dir, autoAlpha: 0 }, { x: 0, rotation: 0, autoAlpha: 1, duration: 0.6, ease: 'expo.out' })
      .from(nxt.querySelectorAll('.opt'), { x: 30, autoAlpha: 0, stagger: 0.05, duration: 0.4, ease: 'expo.out' }, '-=0.45');
  }

  const fName = $('#fName');
  const goFromName = () => {
    state.name = fName.value.trim();
    if (!state.name) {
      HM.toast('the bureau needs a name. any name.');
      if (MOTION) gsap.fromTo(fName, { x: -8 }, { x: 0, duration: 0.5, ease: 'elastic.out(1, .3)' });
      fName.focus(); return;
    }
    show(1);
  };
  $('#next0').addEventListener('click', goFromName);
  fName.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); goFromName(); } });
  $('#form').addEventListener('submit', (e) => e.preventDefault());
  $('#backBtn').addEventListener('click', () => state.page > 0 && show(state.page - 1, -1));

  // photo → downscaled jpeg, kept in memory (and in this browser only)
  $('#fPhoto').addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0]; if (!file) return;
    const fr = new FileReader();
    fr.onload = () => {
      const im = new Image();
      im.onload = () => {
        const s = Math.min(1, 520 / Math.max(im.width, im.height));
        const c = document.createElement('canvas'); c.width = Math.round(im.width * s); c.height = Math.round(im.height * s);
        c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
        state.photo = c.toDataURL('image/jpeg', 0.85);
        putPhoto($('#fPhotoSlot'), state.photo);
        HM.toast('photo stapled. it never leaves your device.');
      };
      im.src = fr.result;
    };
    fr.readAsDataURL(file);
  });
  function putPhoto(slot, src) {
    let img = slot.querySelector(':scope > img');
    if (!img) { img = document.createElement('img'); img.alt = 'Your photo'; slot.prepend(img); }
    img.src = src; slot.classList.add('has-img');
  }

  // answers
  pagesEl.addEventListener('click', (e) => {
    const opt = e.target.closest('.opt'); if (!opt || opt.disabled) return;
    const page = opt.closest('.page'), p = +page.dataset.p;
    page.querySelectorAll('.opt').forEach((o) => { o.classList.toggle('is-on', o === opt); });
    state.answers[p - 1] = opt.dataset.k;
    HM.beep(1200, 0.03, 0.03);
    page.querySelectorAll('.opt').forEach((o) => (o.disabled = true));
    setTimeout(() => {
      page.querySelectorAll('.opt').forEach((o) => (o.disabled = false));
      if (p < QUESTIONS.length) show(p + 1); else process();
    }, 700);
  });

  function decide() {
    const order = ['hotmess', 'delulu', 'situationship', 'main', 'ghost'];
    const tally = Object.fromEntries(order.map((k) => [k, 0]));
    state.answers.forEach((k) => tally[k]++);
    const max = Math.max(...Object.values(tally));
    const top = order.filter((k) => tally[k] === max);
    return top[Math.floor(Math.random() * top.length)];
  }

  /* =======================================================
     PROCESSING — stamps
     ======================================================= */
  const proc = $('#process'), paper = $('#pPaper'), pStatus = $('#pStatus');
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  async function process() {
    $('#progBar').style.width = '100%';
    const key = decide();
    state.cls = key;
    if (!state.ticket) giveTicket(663 + Math.floor(Math.random() * 30), false);
    $('#pNote').textContent = CLASSES[key].note;
    $$('.p-stamp', paper).forEach((s) => s.remove());
    gsap?.set?.('#pNote', { autoAlpha: 0 });
    proc.classList.add('is-on'); proc.setAttribute('aria-hidden', 'false');
    HM.lenis?.stop();
    if (MOTION) gsap.fromTo(paper, { y: 120, rotation: -6, autoAlpha: 0 }, { y: 0, rotation: 1.5, autoAlpha: 1, duration: 0.7, ease: 'expo.out' });

    const stamps = [
      ['RECEIVED', '', 'checking your feelings…'],
      ['REVIEWED', 'ink', 'comparing you to your ex…'],
      ['JUDGED', 'pink', 'consulting the group chat…'],
      ['APPROVED*', '', 'approved. barely.'],
    ];
    await wait(MOTION ? 700 : 0);
    for (const [txt, cls, status] of stamps) {
      pStatus.textContent = status;
      const s = document.createElement('div');
      s.className = 'p-stamp ' + cls;
      s.innerHTML = `${txt}<small>BEI · window 3 · #${state.ticket}</small>`;
      s.style.left = 6 + Math.random() * 42 + '%';
      s.style.top = 14 + Math.random() * 40 + '%';
      paper.appendChild(s);
      const rot = -22 + Math.random() * 44;
      if (MOTION) {
        gsap.fromTo(s, { scale: 3, rotation: rot - 20, autoAlpha: 0 }, { scale: 1, rotation: rot, autoAlpha: 0.9, duration: 0.26, ease: 'power4.in' });
        await wait(260);
        HM.beep(80, 0.16, 0.2);
        gsap.fromTo(paper, { x: -7 }, { x: 0, duration: 0.4, ease: 'elastic.out(1, .3)' });
      } else s.style.transform = `rotate(${rot}deg)`;
      await wait(MOTION ? 650 : 0);
    }
    if (MOTION) gsap.to('#pNote', { autoAlpha: 1, duration: 0.5 });
    await wait(MOTION ? 1500 : 0);
    issue(key);
  }

  /* =======================================================
     03 · ISSUED
     ======================================================= */
  const ascii = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\x20-\x7e]/g, '').trim();
  let thornsDone = false;

  function issue(key) {
    const c = CLASSES[key], now = new Date(), d2 = (n) => String(n).padStart(2, '0');
    const name = state.name || 'unknown';
    $('#rClass').textContent = c.label;
    $('#rDesc').textContent = c.desc;
    $('#rName').textContent = name.toUpperCase();
    $('#rSig').textContent = name.toLowerCase();
    $('#rNo').textContent = 'No: #' + state.ticket;
    $('#rIssued').textContent = `${d2(now.getDate())}/${d2(now.getMonth() + 1)}/${d2(now.getFullYear() % 100)}`;
    $('#rDate').textContent = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    $('#rClassF').textContent = c.label;
    $('#rStatus').textContent = c.status;
    $('#rAccess').textContent = c.access;
    $('#rSide').textContent = c.side;
    if (state.photo) putPhoto($('#rPhoto'), state.photo);
    const code = `HM-${state.ticket} ${ascii(name).toUpperCase() || 'UNKNOWN'} ${key.toUpperCase()}`;
    const rc = $('#rCode'); rc.dataset.code = code; HM.barcode(rc);
    $('#rCodeTxt').textContent = code;
    if (!thornsDone) { HM.thorns($('.r-back .thorns'), 7, 4); HM.thorns($('.r-front .idc-ghost'), 21, 3); thornsDone = true; }


    const res = $('#result');
    res.hidden = false;
    proc.classList.remove('is-on'); proc.setAttribute('aria-hidden', 'true');
    HM.lenis?.start();
    if (G) ScrollTrigger.refresh();
    HM.scrollTo(res);

    if (!MOTION) return;
    const chars = HM.split($('#rClass'), 'chars');
    gsap.timeline({ delay: 0.5, defaults: { ease: 'expo.out' } })
      .from('.r-kicker', { autoAlpha: 0, y: 20, duration: 0.6 })
      .from(chars, { yPercent: 120, rotate: () => gsap.utils.random(-30, 30), autoAlpha: 0, duration: 1, stagger: 0.04 }, 0.1)
      .from('.r-desc', { autoAlpha: 0, filter: 'blur(8px)', duration: 0.8 }, 0.5)
      .from('.r-front', { y: -500, rotation: -40, autoAlpha: 0, duration: 1.2 }, 0.6)
      .from('.r-back', { y: -500, rotation: 40, autoAlpha: 0, duration: 1.2 }, 0.75)
      .add(HM.spray($('.r-spray'), 1.2), 1.4)
      .from('.r-actions > *, .r-small', { y: 20, autoAlpha: 0, stagger: 0.08, duration: 0.6 }, 1.6);
  }

  $('#retakeBtn').addEventListener('click', () => {
    state.answers = [];
    $$('.opt').forEach((o) => o.classList.remove('is-on'));
    $('#result').hidden = true;
    pages.forEach((p, i) => { p.hidden = i !== 0; if (G) gsap.set(p, { clearProps: 'all' }); });
    state.page = 0; show(0);
    if (G) ScrollTrigger.refresh();
    HM.scrollTo('#desk');
  });

  /* =======================================================
     DOWNLOAD — draw both sides of the pass on a canvas
     ======================================================= */
  const loadImg = (src) => new Promise((r) => { if (!src) return r(null); const i = new Image(); i.onload = () => r(i); i.onerror = () => r(null); i.src = src; });
  function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
  function dots(ctx, W, H, spots) {
    for (let y = 4; y < H; y += 7) for (let x = 4; x < W; x += 7) {
      let a = 0;
      spots.forEach(([cx, cy, rx, ry]) => { const d = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2; a = Math.max(a, 1 - d); });
      if (a <= 0) continue;
      ctx.fillStyle = `rgba(13,12,12,${0.16 * a})`; ctx.beginPath(); ctx.arc(x, y, 1.1, 0, 7); ctx.fill();
    }
  }
  function fit(ctx, txt, max, size, font) {
    let s = size; ctx.font = font.replace('{s}', s);
    while (ctx.measureText(txt).width > max && s > 8) { s -= 1; ctx.font = font.replace('{s}', s); }
  }
  function cardFront(ctx, photo, d) {
    rr(ctx, 0, 0, 600, 378, 18); ctx.fillStyle = '#f3efe4'; ctx.fill(); ctx.save(); ctx.clip();
    dots(ctx, 600, 378, [[48, 348, 180, 170], [420, 38, 210, 150]]);
    // ghost thorns
    ctx.globalAlpha = 0.1; drawThorns(ctx, $('.r-front .idc-ghost')); ctx.globalAlpha = 1;
    ctx.fillStyle = '#2c2b2b'; ctx.font = '800 16px "Inter Tight"'; ctx.fillText('ID: #H0TM3SS', 30, 44); ctx.fillText('No: #' + d.ticket, 30, 62);
    ctx.fillStyle = '#f2a6cf'; ctx.font = '97px "Instrument Serif"'; ctx.textAlign = 'center'; ctx.letterSpacing = '-4px'; ctx.fillText('hotmess', 408, 80); ctx.letterSpacing = '0px'; ctx.textAlign = 'left';
    ctx.fillStyle = '#2c2b2b'; ctx.font = '800 15px "Inter Tight"'; ctx.fillText('ID', 262, 100); ctx.fillRect(286, 95, 84, 1.5); ctx.fillText('PASS', 378, 100);
    // photo
    ctx.fillStyle = '#cfcac0'; ctx.fillRect(30, 90, 180, 225);
    if (photo) {
      const r = 180 / 225, ir = photo.width / photo.height; let sx = 0, sy = 0, sw = photo.width, sh = photo.height;
      if (ir > r) { sw = sh * r; sx = (photo.width - sw) / 2; } else { sh = sw / r; sy = (photo.height - sh) / 2; }
      ctx.drawImage(photo, sx, sy, sw, sh, 30, 90, 180, 225);
    } else { ctx.fillStyle = '#77736f'; ctx.font = '400 12px "Space Mono"'; ctx.textAlign = 'center'; ctx.fillText('NO PHOTO.', 120, 198); ctx.fillText('VERY GHOST.', 120, 214); ctx.textAlign = 'left'; }
    ctx.strokeStyle = 'rgba(13,12,12,.3)'; ctx.strokeRect(30.5, 90.5, 179, 224);
    // fields
    const field = (x, y, dt, dd) => {
      ctx.fillStyle = '#2c2b2b'; ctx.font = '700 17px "Inter Tight"'; ctx.fillText(dt, x, y);
      ctx.fillStyle = '#3b3a3a'; fit(ctx, dd, 160, 28, '900 {s}px "Inter Tight"'); ctx.fillText(dd, x, y + 30);
    };
    field(240, 166, 'name:', d.name.toUpperCase()); field(418, 166, 'issued:', d.issued);
    field(240, 238, 'class:', d.cls.label); field(418, 238, 'status:', d.cls.status);
    ctx.fillStyle = '#e8231a'; ctx.font = '800 15px "Inter Tight"'; ctx.textAlign = 'right'; ctx.fillText('*the manufacture of this feeling is prohibited*', 576, 316);
    ctx.fillStyle = '#2c2b2b'; ctx.font = '700 19px "Inter Tight"'; ctx.fillText(d.date, 576, 352); ctx.textAlign = 'left';
    ctx.save(); ctx.translate(36, 352); ctx.rotate(-8 * Math.PI / 180); ctx.fillStyle = '#1f2bd1'; fit(ctx, d.name.toLowerCase(), 200, 48, '{s}px "Pinyon Script"'); ctx.fillText(d.name.toLowerCase(), 0, 0); ctx.restore();
    ctx.restore();
  }
  function drawThorns(ctx, svg) {
    if (!svg) return;
    ctx.save(); ctx.strokeStyle = '#3a2621'; ctx.fillStyle = '#3a2621'; ctx.lineWidth = 3.2; ctx.lineCap = 'round';
    svg.querySelectorAll('path').forEach((p) => ctx.stroke(new Path2D(p.getAttribute('d'))));
    svg.querySelectorAll('polygon').forEach((p) => {
      const pts = p.getAttribute('points').trim().split(/\s+/).map((s) => s.split(',').map(Number));
      ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.fill();
    });
    ctx.restore();
  }
  function cardBack(ctx, d) {
    rr(ctx, 0, 0, 600, 378, 18); ctx.fillStyle = '#f3efe4'; ctx.fill(); ctx.save(); ctx.clip();
    dots(ctx, 600, 378, [[48, 348, 180, 170], [420, 38, 210, 150]]);
    ctx.fillStyle = '#f2a6cf'; ctx.font = '200px "Instrument Serif"'; ctx.textAlign = 'center'; ctx.letterSpacing = '-10px'; ctx.fillText('hotmess', 300, 288); ctx.letterSpacing = '0px'; ctx.textAlign = 'left';
    drawThorns(ctx, $('.r-back .thorns'));
    // access box
    ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.fillRect(30, 30, 330, 64);
    ctx.fillStyle = '#77736f'; ctx.font = '400 11px "Space Mono"'; ctx.fillText('ACCESS', 42, 52); ctx.fillText('SIDE EFFECTS', 42, 78);
    ctx.fillStyle = '#2c2b2b'; fit(ctx, d.cls.access, 210, 15, '800 {s}px "Inter Tight"'); ctx.fillText(d.cls.access, 140, 53);
    fit(ctx, d.cls.side, 210, 15, '800 {s}px "Inter Tight"'); ctx.fillText(d.cls.side, 140, 79);
    // barcode
    const bc = document.createElement('canvas');
    JsBarcode(bc, d.code, { format: 'CODE128', width: 2, height: 60, margin: 22, displayValue: false, background: '#ffffff' });
    const bw = 230, bh = bw * (bc.height / bc.width);
    ctx.fillStyle = '#fff'; ctx.fillRect(600 - 30 - bw, 378 - 30 - bh - 14, bw, bh + 14);
    ctx.drawImage(bc, 600 - 30 - bw, 378 - 30 - bh - 14, bw, bh);
    ctx.fillStyle = '#2c2b2b'; ctx.font = '400 9px "Space Mono"'; ctx.textAlign = 'center'; ctx.fillText(d.code, 600 - 30 - bw / 2, 378 - 34); ctx.textAlign = 'left';
    ctx.restore();
  }

  $('#dlBtn').addEventListener('click', async () => {
    const btn = $('#dlBtn'); btn.disabled = true;
    try {
      await Promise.all(['800 16px "Inter Tight"', '900 28px "Inter Tight"', '97px "Instrument Serif"', '48px "Pinyon Script"', '11px "Space Mono"', '64px "Anton"'].map((f) => document.fonts.load(f)));
      const now = new Date(), d2 = (n) => String(n).padStart(2, '0');
      const name = state.name || 'unknown', cls = CLASSES[state.cls || 'hotmess'];
      const d = {
        name, cls, ticket: state.ticket || '0666',
        issued: `${d2(now.getDate())}/${d2(now.getMonth() + 1)}/${d2(now.getFullYear() % 100)}`,
        date: now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        code: $('#rCodeTxt').textContent,
      };
      const photo = await loadImg(state.photo);
      const S = 2, W = 1300, H = 1760;
      const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
      const ctx = cv.getContext('2d');
      ctx.fillStyle = '#ff3fa4'; ctx.fillRect(0, 0, W, H);
      for (let y = 0; y < H; y += 9) for (let x = (y / 9) % 2 ? 4 : 0; x < W; x += 9) { ctx.fillStyle = 'rgba(13,12,12,.07)'; ctx.fillRect(x, y, 2, 2); }
      ctx.fillStyle = '#0d0c0c'; ctx.font = '120px "Anton"'; ctx.fillText('HOTMESS PASS', 60, 150);
      ctx.font = '400 20px "Space Mono"'; ctx.fillText(`ISSUED TO ${ascii(name).toUpperCase() || 'UNKNOWN'} · TICKET #${d.ticket} · ${d.issued}`, 64, 195);
      const card = (fn, x, y, rot) => {
        ctx.save(); ctx.translate(x + 550, y + 346); ctx.rotate(rot * Math.PI / 180); ctx.translate(-550, -346);
        ctx.shadowColor = 'rgba(0,0,0,.35)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 20;
        rr(ctx, 0, 0, 1100, 693, 33); ctx.fillStyle = '#f3efe4'; ctx.fill(); ctx.shadowColor = 'transparent';
        ctx.scale(1100 / 600, 1100 / 600); fn(); ctx.restore();
      };
      card(() => cardFront(ctx, photo, d), 100, 250, -2.5);
      card(() => cardBack(ctx, d), 100, 980, 2.5);
      ctx.fillStyle = '#0d0c0c'; ctx.font = '400 18px "Space Mono"';
      ctx.fillText('NOT A REAL DOCUMENT. A REAL FEELING. — BUREAU OF EMOTIONAL IDENTITY', 64, H - 50);
      ctx.textAlign = 'right'; ctx.font = '40px "Pinyon Script"'; ctx.fillText('ghostly.grl ♥', W - 64, H - 46); ctx.textAlign = 'left';
      void S;
      const blob = await new Promise((r) => cv.toBlob(r, 'image/png'));
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `hotmess-pass-${(ascii(name).toLowerCase().replace(/\s+/g, '-') || 'unknown')}.png`;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
      HM.toast('saved. laminate responsibly.');
    } catch (err) {
      HM.toast('the printer is having a moment. try again.');
      console.error(err);
    }
    btn.disabled = false;
  });

  /* =======================================================
     SCROLL — the desk slides over the waiting room
     ======================================================= */
  if (MOTION) {
    const st = { trigger: '#desk', start: 'top bottom', end: 'top top', scrub: true };
    gsap.fromTo('.a-wait .pg-in', { scale: 1, rotation: 0, '--dim': 0 }, { scale: 0.9, rotation: -2.5, '--dim': 0.65, ease: 'none', immediateRender: false, scrollTrigger: st });
    gsap.fromTo('#desk', { rotation: 3 }, { rotation: 0, ease: 'power1.out', scrollTrigger: { ...st } });
    gsap.from('#sheet', { y: 140, rotation: 6, autoAlpha: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '#desk', start: 'top 45%' } });
  }
  show(0);
})();
