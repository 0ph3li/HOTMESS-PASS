/* =========================================================
   HOTMESS PASS® — home.js · issue 00, poster stack
   ========================================================= */
(() => {
  const { $, $$ } = HM;
  const G = HM.hasGsap;
  const MOTION = G && !HM.reduced;
  const body = document.body;
  const hold = (pg) => Math.max(0, pg.offsetHeight - 2 * innerHeight);

  /* =======================================================
     LOADER · identity check
     ======================================================= */
  const loader = $('#loader');
  const seen = HM.store.get('seen', sessionStorage);

  function runLoader() {
    return new Promise((done) => {
      if (!G || HM.reduced || seen) { loader.remove(); return done(); }
      HM.store.set('seen', '1', sessionStorage);

      const now = new Date();
      $('#ldTime').textContent = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

      // fake barcode bars
      const bars = $('#ldBars');
      for (let i = 0; i < 46; i++) {
        const b = document.createElement('i');
        b.style.width = [1, 2, 2, 3, 4, 6][Math.floor(Math.random() * 6)] + 'px';
        b.style.marginRight = [1, 2, 3, 5][Math.floor(Math.random() * 4)] + 'px';
        if (Math.random() < 0.08) b.style.background = 'var(--hot)';
        bars.appendChild(b);
      }
      const strips = $('#ldStrips');
      for (let i = 0; i < 10; i++) strips.appendChild(document.createElement('i'));

      const msgs = ['VERIFYING SUBJECT', 'MEASURING DELULU LEVELS', 'CHECKING EMOTIONAL DAMAGE', 'COUNTING UNSENT TEXTS', 'LAMINATING'];
      const pct = { v: 0 };
      const msg = $('#ldMsg'), pctEl = $('#ldPct');

      gsap.timeline({ onComplete: () => { loader.remove(); } })
        .to('#ldBars i', { scaleY: 1, duration: 0.5, ease: 'expo.out', stagger: { each: 0.018, from: 'random' } })
        .to(pct, {
          v: 100, duration: 1.7, ease: 'power2.inOut',
          onUpdate() {
            const v = Math.round(pct.v);
            pctEl.textContent = String(v).padStart(2, '0');
            msg.textContent = msgs[Math.min(msgs.length - 1, Math.floor(v / 21))];
          },
        }, 0.2)
        .to('#ldBars i', { scaleY: () => 0.2 + Math.random() * 0.8, duration: 0.25, ease: 'none', repeat: 5, yoyo: true, stagger: { each: 0.006, from: 'random' } }, 0.5)
        .call(() => { $('#ldGranted').style.visibility = 'visible'; HM.beep(1850, 0.09); })
        .from('#ldGranted span', { yPercent: 100, skewY: 8, duration: 0.45, ease: 'expo.out', stagger: 0.06 })
        .from('#ldGranted small', { autoAlpha: 0, duration: 0.2 }, '<0.2')
        .to({}, { duration: 0.35 })
        .call(() => {
          // swap: the pink screen becomes strips that peel away
          loader.style.background = 'transparent';
          $$('.loader-top, .loader-mid, .loader-bot, #ldGranted', loader).forEach((el) => (el.style.visibility = 'hidden'));
          gsap.set('#ldStrips i', { scaleY: 1, transformOrigin: '50% 100%' });
          done();
        })
        .to('#ldStrips i', { scaleY: 0, duration: 0.8, ease: 'expo.inOut', stagger: { each: 0.05, from: 'center' } });
    });
  }

  const spray = HM.spray, prepSpray = HM.prepSpray;
  if (!MOTION) $$('.spray-txt').forEach((t) => { t.style.strokeDashoffset = 0; t.style.fillOpacity = 1; });
  HM.thorns($('.idc-back .thorns'), 7, 4);
  HM.thorns($('.idc-ghost'), 21, 3);

  /* =======================================================
     THE PASS · dates, name, drag
     ======================================================= */
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  $('#idDate').textContent = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${pad(now.getFullYear() % 100)}`;
  $('#idLong').textContent = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  // the card starts blank: you write yourself onto it on the post-it
  const nameIn = $('#nameIn');
  const idFor = (name) => { let h = 7; for (const c of name) h = (h * 31 + c.charCodeAt(0)) % 9973; return 'No: #' + String(h).padStart(4, '0'); };
  const nameEl = $('#idName'), sigEl = $('#idSig'), noEl = $('#idNo');
  const writeName = (raw) => {
    const name = raw.trim().slice(0, 14);
    nameEl.textContent = name ? name.toUpperCase() : '__________';
    sigEl.textContent = name.toLowerCase();
    noEl.textContent = name ? idFor(name.toLowerCase()) : 'No: #00/∞';
    nameEl.classList.toggle('is-blank', !name);
  };
  writeName('');
  nameIn.value = '';
  nameIn.addEventListener('input', () => {
    writeName(nameIn.value);
    HM.beep(2600 + Math.random() * 400, 0.012, 0.015);
  });
  $('#nameForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const v = nameIn.value.trim();
    if (!v) { HM.toast('no name? very ghost class of you.'); nameIn.focus(); return; }
    writeName(v);
    HM.beep(1400, 0.06); setTimeout(() => HM.beep(2100, 0.08), 90);
    HM.toast(`printed. welcome to the system, ${v.toLowerCase()}.`);
    if (!MOTION) return;
    // laminate: the signature writes itself, the card bumps, a flash crosses it
    gsap.timeline()
      .fromTo(sigEl, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 0.9, ease: 'power1.inOut' })
      .fromTo('.idc-front', { scale: 1 }, { scale: 1.05, duration: 0.15, yoyo: true, repeat: 1 }, 0)
      .fromTo(nameEl, { filter: 'blur(6px)', autoAlpha: 0 }, { filter: 'blur(0px)', autoAlpha: 1, duration: 0.5 }, 0);
  });

  if (window.Draggable) {
    let z = 10;
    $$('[data-desk]').forEach((el) => {
      Draggable.create(el, {
        bounds: el.closest('.pg-in'),
        onPress() { el.style.zIndex = ++z; gsap.to(el, { scale: 1.04, rotationX: 0, rotationY: 0, duration: 0.25 }); },
        onRelease() { gsap.to(el, { scale: 1, duration: 0.7, ease: 'elastic.out(1, .4)' }); },
      });
      if (!HM.fine || !el.classList.contains('idc')) return;
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        gsap.to(el, { rotationY: ((e.clientX - r.left) / r.width - 0.5) * 18, rotationX: -((e.clientY - r.top) / r.height - 0.5) * 14, transformPerspective: 900, duration: 0.4 });
      });
      el.addEventListener('pointerleave', () => gsap.to(el, { rotationX: 0, rotationY: 0, duration: 0.8, ease: 'elastic.out(1, .5)' }));
    });
  }

  /* =======================================================
     YOU ARE THE PRODUCT · scan
     ======================================================= */
  const code = $('#yCode'), out = $('#yRead');
  let scanning = false;
  const lines = [
    ['&gt; scanning…', 500],
    ['&gt; code 128 · 17 chars · checksum ok', 450],
    ['&gt; decoded: <b>U ARE THE PRODUCT</b>', 700],
    ['&gt; price: your attention. stock: unlimited.', 0],
  ];
  const TAGS = ['YOUR ATTENTION', 'YOUR DATA', '3AM THOUGHTS', 'YOUR FACE', 'SCREEN TIME 9H', 'YOUR EX (USED)'];
  let scans = 0;
  const scan = async () => {
    if (scanning) return; scanning = true;
    code.classList.add('is-scanning'); code.classList.remove('is-ok');
    out.innerHTML = '';
    if (MOTION) gsap.fromTo('#mainCode g rect', { scaleY: 1 }, { scaleY: () => 0.3 + Math.random() * 0.7, transformOrigin: '50% 100%', duration: 0.08, repeat: 7, yoyo: true, ease: 'steps(1)', stagger: { each: 0.002, from: 'random' } });
    for (const [l, wait] of lines) {
      const p = document.createElement('span'); p.style.display = 'block'; p.innerHTML = l; out.appendChild(p);
      if (MOTION) gsap.from(p, { autoAlpha: 0, x: -10, duration: 0.25 });
      if (l.includes('decoded')) {
        HM.beep(1850, 0.12);
        code.classList.remove('is-scanning'); code.classList.add('is-ok');
        sell();
      }
      await new Promise((r) => setTimeout(r, wait));
    }
    setTimeout(() => { code.classList.remove('is-ok'); scanning = false; }, 1200);
  };
  // every scan sells another piece of you: the missing girl gets FOUND, then tagged
  function sell() {
    const flyer = $('#missing');
    if (MOTION) gsap.fromTo('#product .pg-in', { filter: 'brightness(2.2)' }, { filter: 'brightness(1)', duration: 0.6, ease: 'power2.out' });
    if (!scans) {
      const st = document.createElement('div');
      st.className = 'sold-stamp'; st.innerHTML = 'FOUND.<small>for sale · BEI</small>';
      flyer.appendChild(st);
      if (MOTION) gsap.fromTo(st, { scale: 3, autoAlpha: 0, rotation: -40 }, { scale: 1, autoAlpha: 0.9, rotation: -16, duration: 0.3, ease: 'power4.in', onComplete: () => HM.beep(80, 0.18, 0.2) });
      $('.m-title', flyer).classList.add('is-crossed');
    }
    const tag = document.createElement('div');
    tag.className = 'price-tag';
    tag.innerHTML = `<b>€${(Math.random() * 9 + 0.99).toFixed(2)}</b><span>${TAGS[scans % TAGS.length]}</span>`;
    tag.style.left = 6 + Math.random() * 56 + '%';
    tag.style.top = 18 + Math.random() * 50 + '%';
    flyer.appendChild(tag);
    const rot = -18 + Math.random() * 36;
    if (MOTION) {
      gsap.fromTo(tag, { y: -160, rotation: rot - 60, autoAlpha: 0 }, { y: 0, rotation: rot, autoAlpha: 1, duration: 0.7, ease: 'back.out(2)', delay: scans ? 0 : 0.3 });
      gsap.fromTo(flyer, { x: 10 }, { x: 0, duration: 0.6, ease: 'elastic.out(1, .3)' });
    } else tag.style.rotate = rot + 'deg';
    scans++;
    if (scans === 1) HM.toast('sold. scan again, there\'s more of you left.');
    if (scans === TAGS.length) HM.toast('fully sold out. congrats, you\'re trending.');
  }
  code.addEventListener('click', scan);
  code.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); scan(); } });

  /* =======================================================
     MISSING · smudged photocopy
     ======================================================= */
  // like the vibes flyer: bright washed photocopy, the face smudged away
  const pix = { k: 1 };                       // 1 = fully smudged, 0 = clear
  const mSlot = $('.m-photo');
  const face = (mSlot.dataset.face || '0.5,0.4,0.15,0.2').split(',').map(Number); // cx, cy, rx, ry (fractions of the source)
  let drawPix = () => {};
  HM.onSlot(mSlot, (img) => {
    const cv = document.createElement('canvas'), ctx = cv.getContext('2d');
    mSlot.appendChild(cv);
    drawPix = () => {
      const w = mSlot.clientWidth, h = mSlot.clientHeight; if (!w) return;
      const dpr = Math.min(2, devicePixelRatio || 1);
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      const W = cv.width, H = cv.height;
      // cover-fit the source
      const iw = img.naturalWidth, ih = img.naturalHeight, ir = iw / ih, r = W / H;
      let sx = 0, sy = 0, sW = iw, sH = ih;
      if (ir > r) { sW = ih * r; sx = (iw - sW) / 2; } else { sH = iw / r; sy = (ih - sH) / 2; }
      // tighter crop around the head, like a flyer photo
      const zoom = parseFloat(mSlot.dataset.zoom || 1);
      const nW = sW / zoom, nH = sH / zoom;
      sx = Math.min(iw - nW, Math.max(0, face[0] * iw - nW / 2));
      sy = Math.min(ih - nH, Math.max(0, face[1] * ih - nH * 0.45));
      sW = nW; sH = nH;
      ctx.filter = 'brightness(1.3) contrast(1.18) saturate(1.35)';
      ctx.drawImage(img, sx, sy, sW, sH, 0, 0, W, H);
      ctx.filter = 'none';
      // face ellipse in canvas space
      const cx = ((face[0] * iw - sx) / sW) * W, cy = ((face[1] * ih - sy) / sH) * H;
      const rx = (face[2] * iw / sW) * W, ry = (face[3] * ih / sH) * H;
      const k = pix.k; if (k < 0.02) return;
      // smudge: the face gets dragged sideways like wet toner under a thumb
      const base = document.createElement('canvas'); base.width = W; base.height = H;
      base.getContext('2d').drawImage(cv, 0, 0);
      const sm = document.createElement('canvas'); sm.width = W; sm.height = H;
      const s2 = sm.getContext('2d');
      s2.filter = `blur(${(W / 90) * k}px)`;
      const steps = 22, reach = rx * 1.1 * k;
      for (let i = 0; i < steps; i++) {
        const t = i / (steps - 1);
        s2.globalAlpha = 0.16 + 0.1 * (1 - t);
        s2.drawImage(base, -reach * t + reach * 0.35, Math.sin(t * 3) * ry * 0.06 * k);
      }
      s2.filter = 'none'; s2.globalAlpha = 1;
      // a few toner streaks
      s2.globalCompositeOperation = 'source-atop';
      for (let i = 0; i < 6; i++) {
        const yy = cy - ry * 0.7 + (i / 5) * ry * 1.4;
        s2.fillStyle = i % 2 ? 'rgba(255,255,255,.18)' : 'rgba(40,30,35,.10)';
        s2.fillRect(cx - rx * 1.4, yy, rx * 2.8, ry * 0.05 + (i % 3));
      }
      // keep it to the face, soft edges
      s2.globalCompositeOperation = 'destination-in';
      s2.save(); s2.translate(cx, cy); s2.scale(rx, ry);
      const g = s2.createRadialGradient(0, 0, 0, 0, 0, 1.25);
      g.addColorStop(0, `rgba(0,0,0,${k})`); g.addColorStop(0.65, `rgba(0,0,0,${k * 0.9})`); g.addColorStop(1, 'rgba(0,0,0,0)');
      s2.fillStyle = g; s2.beginPath(); s2.arc(0, 0, 1.25, 0, 7); s2.fill(); s2.restore();
      ctx.drawImage(sm, 0, 0);
    };
    drawPix();
    window.addEventListener('resize', drawPix);
  });
  // rub it: the cursor is a wet thumb that drags the toner around
  const missing = $('#missing');
  let last = null;
  mSlot.addEventListener('pointermove', (e) => {
    const cv = mSlot.querySelector('canvas'); if (!cv) return;
    const r = cv.getBoundingClientRect(), sx = cv.width / r.width;
    const p = { x: (e.clientX - r.left) * sx, y: (e.clientY - r.top) * sx };
    if (last) {
      const ctx = cv.getContext('2d'), R = cv.width * 0.07;
      const dx = p.x - last.x, dy = p.y - last.y, dist = Math.hypot(dx, dy), steps = Math.max(1, Math.ceil(dist / (R * 0.25)));
      const brush = document.createElement('canvas'); brush.width = brush.height = Math.ceil(R * 2);
      const b = brush.getContext('2d');
      for (let i = 1; i <= steps; i++) {
        const fx = last.x + (dx * (i - 1)) / steps, fy = last.y + (dy * (i - 1)) / steps;
        const tx = last.x + (dx * i) / steps, ty = last.y + (dy * i) / steps;
        b.globalCompositeOperation = 'copy';
        b.drawImage(cv, fx - R, fy - R, R * 2, R * 2, 0, 0, R * 2, R * 2);
        b.globalCompositeOperation = 'destination-in';
        const g = b.createRadialGradient(R, R, 0, R, R, R);
        g.addColorStop(0, 'rgba(0,0,0,.75)'); g.addColorStop(1, 'rgba(0,0,0,0)');
        b.fillStyle = g; b.fillRect(0, 0, R * 2, R * 2);
        ctx.drawImage(brush, tx - R, ty - R);
      }
    }
    last = p;
  });
  mSlot.addEventListener('pointerleave', () => { last = null; });
  mSlot.addEventListener('dblclick', () => drawPix());

  /* =======================================================
     SLICES · build strips (photo or placeholder)
     ======================================================= */
  const slicer = $('#slicer'), N = 16;
  let slices = [];
  const buildSlices = (src) => {
    slices.forEach((s) => s.remove());
    slices = [];
    for (let i = 0; i < N; i++) {
      const s = document.createElement('div');
      s.className = 'slice' + (src ? '' : ' ph');
      s.style.left = (i * 100) / N + '%'; s.style.width = 100 / N + 0.15 + '%';
      if (src) {
        const im = document.createElement('img');
        im.src = src; im.alt = '';
        im.style.left = -i * 100 + '%'; im.style.width = N * 100 + '%';
        s.appendChild(im);
      }
      slicer.appendChild(s); slices.push(s);
    }
    if (MOTION) sliceScene();
  };
  let sliceTl;
  function sliceScene() {
    sliceTl?.scrollTrigger?.kill(); sliceTl?.kill();
    const pg = $('#slice');
    sliceTl = gsap.timeline({ scrollTrigger: { trigger: pg, start: 'top 25%', end: () => '+=' + (innerHeight * 0.25 + hold(pg) * 0.85), scrub: 0.6 } })
      .fromTo(slices, { yPercent: (i) => [-60, 40, -25, 70, -45, 15, -70, 35][i % 8], scaleY: 1.25 },
        { yPercent: 0, scaleY: 1, ease: 'power2.out', stagger: { each: 0.03, from: 'edges' } })
      .fromTo('.sl-mast', { scaleY: 0.4, transformOrigin: '50% 0' }, { scaleY: 1, ease: 'power2.out' }, 0)
      .from('.sl-row span', { autoAlpha: 0, y: 20, stagger: 0.2 }, 0.2);
  }
  buildSlices(null);
  HM.onSlot(slicer, (img) => buildSlices(img.src));

  /* IDENTITY · fill the word with a photo if there is one */
  const word = $('#iwWord');
  if (word.dataset.img) {
    const im = new Image();
    im.onload = () => { word.style.backgroundImage = `url("${word.dataset.img}")`; word.style.backgroundSize = 'cover'; };
    im.src = word.dataset.img;
  }
  const wordLetters = HM.split(word, 'chars');
  wordLetters.forEach((l) => l.classList.add('l'));
  word.style.position = 'relative';

  /* =======================================================
     SCENES
     ======================================================= */
  const mast = $('#mast');
  const mastChars = HM.split(mast, 'chars');

  function intro() {
    body.classList.remove('is-loading');
    if (!MOTION) return;
    gsap.timeline({ defaults: { ease: 'expo.out' } })
      .from('#cover .slot', { scale: 1.35, filter: 'blur(14px) brightness(2)', duration: 2.2 }, 0)
      .from(mastChars, { yPercent: -110, scaleY: 2.4, transformOrigin: '50% 0', duration: 1.2, stagger: { each: 0.06, from: 'center' } }, 0.1)
      .from('.cv-row span', { autoAlpha: 0, y: -10, stagger: 0.1, duration: 0.6 }, 0.6)
      .from('.cv-line', { autoAlpha: 0, x: (i) => (i ? 40 : -40), duration: 1, stagger: 0.15 }, 0.8)
      .from('.cv-code, .cv-whisper', { autoAlpha: 0, y: 20, duration: 0.8, stagger: 0.1 }, 1)
      .add(spray($('.spray-cover'), 1.4), 1.1);
  }

  function scenes() {
    if (!MOTION) return;
    const pgs = $$('.pg');

    /* --- the stack: incoming poster tilts in, the one below sinks --- */
    [...pgs, $('#contents')].forEach((pg, i) => {
      if (i === 0) return;
      const prev = pgs[i - 1].querySelector('.pg-in');
      const st = { trigger: pg, start: 'top bottom', end: 'top top', scrub: true };
      gsap.fromTo(prev, { scale: 1, rotation: 0, '--dim': 0 }, { scale: 0.9, rotation: i % 2 ? -2.5 : 2.5, '--dim': 0.65, ease: 'none', immediateRender: false, scrollTrigger: st });
      const self = pg.querySelector('.pg-in') || pg;
      gsap.fromTo(self, { rotation: i % 2 ? 4 : -4 }, { rotation: 0, ease: 'power1.out', scrollTrigger: { ...st } });
    });

    /* --- 01 cover: masthead stretches as you stay --- */
    const cover = $('#cover');
    gsap.timeline({ scrollTrigger: { trigger: cover, start: 'top top', end: () => '+=' + hold(cover), scrub: true } })
      .to(mast, { scaleY: 1.5, ease: 'none' }, 0)
      .fromTo('#cover .slot', { scale: 1 }, { scale: 1.12, ease: 'none', immediateRender: false }, 0)
      .to('.cv-row', { y: () => mast.offsetHeight * 0.5, ease: 'none' }, 0);

    /* --- 02 lost: focus pulls, the outline draws, the sentence lands --- */
    const lost = $('#lost'), says = HM.split($('#lostSays'), 'words');
    gsap.timeline({ scrollTrigger: { trigger: lost, start: 'top 50%', end: () => '+=' + (innerHeight * 0.5 + hold(lost) * 0.8), scrub: 0.5 } })
      .fromTo('.lost-photo', { '--blur': '60px' }, { '--blur': '14px', ease: 'none', duration: 1 }, 0)
      .to('.lost-word text', { strokeDashoffset: 0, ease: 'none', stagger: 0.15, duration: 0.8 }, 0)
      .to('.lost-word text', { fill: 'rgba(255,255,255,.12)', duration: 0.3 }, 0.8)
      .from(says, { yPercent: 120, autoAlpha: 0, rotate: 6, stagger: 0.05, duration: 0.4, ease: 'power3.out' }, 0.45)
      .from('.lost-foot span', { autoAlpha: 0, stagger: 0.05, duration: 0.2 }, 0.8);

    /* --- 03 desk: everything gets dealt onto the table --- */
    const desk = $('#desk');
    gsap.timeline({ scrollTrigger: { trigger: desk, start: 'top 35%' } })
      .from('.desk-title', { autoAlpha: 0, x: -40, duration: 0.6, ease: 'expo.out' })
      .from('#desk [data-desk]', { y: () => -innerHeight * 1.1, rotation: () => gsap.utils.random(-50, 50), duration: 1.1, ease: 'expo.out', stagger: 0.14 }, 0.1)
      .add(spray($('.spray-desk'), 1.2), 0.9)
      .fromTo('.void-stamp', { scale: 3, autoAlpha: 0 }, { scale: 1, autoAlpha: 0.85, duration: 0.3, ease: 'power4.in', onComplete: () => HM.beep(90, 0.18, 0.2) }, 1.9)
      .to('#desk .pg-in', { x: 'random(-6, 6)', duration: 0.05, repeat: 5, yoyo: true, ease: 'none' }, 2.2)
      .set('#desk .pg-in', { x: 0 });

    /* --- 04 product: posters get slapped up, bars print --- */
    const bars = $$('#mainCode g rect');
    gsap.timeline({ scrollTrigger: { trigger: '#product', start: 'top 40%' } })
      .from('#yatp', { x: -120, rotation: -8, autoAlpha: 0, duration: 0.9, ease: 'expo.out' })
      .from('.y-you', { yPercent: 80, scaleY: 2, autoAlpha: 0, duration: 0.6, ease: 'power4.out' }, 0.15)
      .from('.y-are', { xPercent: -30, autoAlpha: 0, duration: 0.5 }, 0.3)
      .from(bars, { scaleY: 0, transformOrigin: '50% 100%', duration: 0.6, ease: 'expo.out', stagger: { each: 0.008, from: 'random' } }, 0.35)
      .from('.y-product', { yPercent: -60, scaleY: 0.2, autoAlpha: 0, duration: 0.8, ease: 'elastic.out(1, .5)' }, 0.7)
      .from('#missing', { x: 160, y: 60, rotation: 20, autoAlpha: 0, duration: 1, ease: 'expo.out' }, 0.5)
      .from('.m-scrawl', { scale: 0, rotation: -40, duration: 0.5, ease: 'back.out(3)' }, 1.3);

    /* --- 06 identity: dive into the T --- */
    const wpg = $('#word');
    const T = wordLetters[4];
    const origin = () => `${T.offsetLeft + T.offsetWidth / 2}px ${word.offsetHeight * 0.42}px`;
    gsap.timeline({ scrollTrigger: { trigger: wpg, start: 'top top', end: () => '+=' + hold(wpg), scrub: 0.6, invalidateOnRefresh: true } })
      .fromTo(word, { scale: 1, transformOrigin: origin }, { scale: 90, transformOrigin: origin, ease: 'power3.in', duration: 1 })
      .to('#iwAfter', { opacity: 1, duration: 0.15 }, 0.92)
      .fromTo('.iw-small', { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.15 }, 1.0)
      .fromTo('.iw-big', { yPercent: 40, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.25 }, 1.05)
      .to({}, { duration: 0.25 });

    /* --- contents --- */
    gsap.from('.ct-title', { yPercent: 60, autoAlpha: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '#contents', start: 'top 50%' } });
    gsap.from('.ct-list a', { x: -80, autoAlpha: 0, duration: 0.9, ease: 'expo.out', stagger: 0.09, scrollTrigger: { trigger: '.ct-list', start: 'top 80%' } });
    const ctaSpray = $('.spray-cta');
    ScrollTrigger.create({ trigger: ctaSpray, start: 'top 85%', once: true, onEnter: () => spray(ctaSpray, 1.8) });
  }

  /* text scramble on the contents strips */
  const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&*!?0123456789';
  $$('[data-scramble]').forEach((a) => {
    const span = a.querySelector('span'), orig = span.textContent;
    let raf;
    a.addEventListener('pointerenter', () => {
      if (HM.reduced) return;
      let f = 0; cancelAnimationFrame(raf);
      const step = () => {
        span.textContent = [...orig].map((c, i) => (c === ' ' || i < f / 2 ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)])).join('');
        if (f++ < orig.length * 2) raf = requestAnimationFrame(step); else span.textContent = orig;
      };
      step();
    });
  });

  /* =======================================================
     GO
     ======================================================= */
  const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
  Promise.all([runLoader(), fontsReady]).then(() => {
    $$('.spray').forEach(prepSpray);
    intro(); scenes();
    if (G) ScrollTrigger.refresh();
  });
})();
