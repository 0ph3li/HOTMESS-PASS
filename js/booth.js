/* =========================================================
   HOTMESS PASS® — booth.js · booth 03
   ========================================================= */
(() => {
  const { $, $$ } = HM;
  const G = HM.hasGsap;
  const MOTION = G && !HM.reduced;

  const cam = $('#cam'), live = $('#live'), lctx = live.getContext('2d', { willReadFrequently: true });
  const shootBtn = $('#shoot'), led = $('#mcLed');
  let filter = 'xerox', source = null, stream = null, busy = false, frames = [];
  const LW = 480, LH = 360;
  live.width = LW; live.height = LH;

  /* ---------- intro: the curtain opens ---------- */
  if (MOTION) {
    const chars = HM.split($('#btMast'), 'chars');
    gsap.timeline({ delay: 0.2 })
      .to('.cl-l', { xPercent: -100, skewX: -6, duration: 1.6, ease: 'expo.inOut' }, 0)
      .to('.cl-r', { xPercent: 100, skewX: 6, duration: 1.6, ease: 'expo.inOut' }, 0)
      .from(chars, { yPercent: 110, autoAlpha: 0, duration: 1, stagger: 0.05, ease: 'expo.out' }, 0.8)
      .from('.bt-sub, .machine, .out, .bt-note', { y: 40, autoAlpha: 0, stagger: 0.1, duration: 0.9, ease: 'expo.out' }, 1);
  } else $$('.curtain').forEach((c) => c.remove());

  /* =======================================================
     FILTERS
     ======================================================= */
  const tmp = document.createElement('canvas'), tctx = tmp.getContext('2d', { willReadFrequently: true });
  function drawCover(ctx, src, W, H, mirror) {
    const sw = src.videoWidth || src.naturalWidth || src.width, sh = src.videoHeight || src.naturalHeight || src.height;
    if (!sw) return false;
    const r = W / H, ir = sw / sh;
    let sx = 0, sy = 0, cw = sw, ch = sh;
    if (ir > r) { cw = sh * r; sx = (sw - cw) / 2; } else { ch = sw / r; sy = (sh - ch) / 4; }
    ctx.save();
    if (mirror) { ctx.translate(W, 0); ctx.scale(-1, 1); }
    ctx.drawImage(src, sx, sy, cw, ch, 0, 0, W, H);
    ctx.restore();
    return true;
  }
  function render(ctx, W, H, src, f, mirror) {
    tmp.width = W; tmp.height = H;
    if (f === 'xerox') {
      tctx.filter = 'grayscale(1) contrast(1.6) brightness(1.1)';
      if (!drawCover(tctx, src, W, H, mirror)) return;
      tctx.filter = 'none';
      const d = tctx.getImageData(0, 0, W, H).data, s = Math.max(4, Math.round(W / 96));
      ctx.fillStyle = '#f4f1ea'; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#1a1918';
      for (let y = 0; y < H; y += s) for (let x = (y / s) % 2 ? s / 2 : 0; x < W; x += s) {
        const i = ((Math.min(H - 1, y + (s >> 1)) * W) + Math.min(W - 1, Math.round(x + s / 2))) * 4;
        const r = s * 0.66 * Math.pow(1 - d[i] / 255, 0.85);
        if (r > 0.3) { ctx.beginPath(); ctx.arc(x + s / 2, y + s / 2, r, 0, 7); ctx.fill(); }
      }
      return;
    }
    if (f === 'flash') {
      ctx.filter = 'brightness(1.35) contrast(1.15) saturate(1.25)';
      if (!drawCover(ctx, src, W, H, mirror)) return;
      ctx.filter = 'none';
      ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = 'rgba(255,63,164,.22)'; ctx.fillRect(0, 0, W, H);
      const g = ctx.createRadialGradient(W * 0.5, H * 0.42, 0, W * 0.5, H * 0.42, W * 0.5);
      g.addColorStop(0, 'rgba(255,255,255,.45)'); g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'multiply';
      const v = ctx.createRadialGradient(W / 2, H / 2, W * 0.3, W / 2, H / 2, W * 0.75);
      v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(60,0,30,.7)');
      ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'source-over';
      return;
    }
    if (f === 'digicam') {
      ctx.filter = 'saturate(1.4) contrast(1.08) brightness(1.05)';
      if (!drawCover(ctx, src, W, H, mirror)) return;
      ctx.filter = 'none';
      for (let i = 0; i < W * H / 60; i++) { ctx.fillStyle = `rgba(${Math.random() > 0.5 ? '255,255,255' : '0,0,0'},.08)`; ctx.fillRect(Math.random() * W, Math.random() * H, 1.5, 1.5); }
      const d = new Date(), p = (n) => String(n).padStart(2, '0');
      ctx.font = `${Math.round(H * 0.075)}px "Silkscreen", monospace`; ctx.textAlign = 'right';
      ctx.shadowColor = 'rgba(255,140,0,.9)'; ctx.shadowBlur = 8; ctx.fillStyle = '#ff9a1f';
      ctx.fillText(`'${p(d.getFullYear() % 100)} ${p(d.getMonth() + 1)} ${p(d.getDate())}`, W - W * 0.04, H - H * 0.05);
      ctx.shadowBlur = 0; ctx.textAlign = 'left';
      return;
    }
    // smudge: wet toner dragged across the face
    ctx.filter = 'brightness(1.2) contrast(1.1) saturate(1.2)';
    if (!drawCover(ctx, src, W, H, mirror)) return;
    ctx.filter = 'none';
    const cx = W / 2, cy = H * 0.42, rx = W * 0.17, ry = H * 0.28;
    tctx.clearRect(0, 0, W, H);
    tctx.filter = `blur(${W / 90}px)`;
    for (let i = 0; i < 18; i++) { const t = i / 17; tctx.globalAlpha = 0.2; tctx.drawImage(ctx.canvas, -rx * 1.1 * t + rx * 0.35, 0); }
    tctx.filter = 'none'; tctx.globalAlpha = 1;
    tctx.globalCompositeOperation = 'destination-in';
    tctx.save(); tctx.translate(cx, cy); tctx.scale(rx, ry);
    const g = tctx.createRadialGradient(0, 0, 0, 0, 0, 1.25);
    g.addColorStop(0, '#000'); g.addColorStop(0.65, 'rgba(0,0,0,.9)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    tctx.fillStyle = g; tctx.beginPath(); tctx.arc(0, 0, 1.25, 0, 7); tctx.fill(); tctx.restore();
    tctx.globalCompositeOperation = 'source-over';
    ctx.drawImage(tmp, 0, 0);
  }

  /* =======================================================
     SOURCES — camera, or borrowed faces from the site
     ======================================================= */
  const current = () => (source?.type === 'cam' ? cam : source?.list[source.i % source.list.length]);
  let raf;
  const loop = () => {
    const s = current();
    if (s && !busy) render(lctx, LW, LH, s, filter, source.type === 'cam');
    raf = requestAnimationFrame(loop);
  };
  const ready = () => {
    $('#mcOff').hidden = true; shootBtn.disabled = false; led.textContent = 'READY';
    cancelAnimationFrame(raf); loop();
  };
  $('#camBtn').addEventListener('click', async () => {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 1280 } }, audio: false });
      cam.srcObject = stream; await cam.play();
      source = { type: 'cam' }; ready();
    } catch (e) {
      HM.toast('no camera access. borrow a face instead ↓');
    }
  });
  $('#borrowBtn').addEventListener('click', async () => {
    const srcs = ['img/INDEX/pass-photo.jpg', 'img/INDEX/missing.jpg', 'img/SCAN/mirror.jpg', 'img/APPLY/officer.jpg'];
    const list = (await Promise.all(srcs.map((u) => new Promise((r) => { const i = new Image(); i.onload = () => r(i); i.onerror = () => r(null); i.src = u; })))).filter(Boolean);
    if (!list.length) return HM.toast('no faces to borrow. add some photos to img/.');
    source = { type: 'img', list, i: 0 }; ready();
    HM.toast('borrowed. she won\'t mind. (she will.)');
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden && stream) { stream.getTracks().forEach((t) => t.stop()); stream = null; source = null; $('#mcOff').hidden = false; shootBtn.disabled = true; } });

  $$('.flt').forEach((b) => b.addEventListener('click', () => {
    filter = b.dataset.f;
    $$('.flt').forEach((x) => { x.classList.toggle('is-on', x === b); x.setAttribute('aria-checked', x === b); });
    HM.beep(900, 0.03, 0.03);
  }));

  /* =======================================================
     SHOOT — 3·2·1, flash, ×4
     ======================================================= */
  let actx;
  const shutter = () => {
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      const b = actx.createBuffer(1, actx.sampleRate * 0.12, actx.sampleRate), d = b.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 3);
      const s = actx.createBufferSource(), g = actx.createGain(); g.gain.value = 0.25;
      s.buffer = b; s.connect(g).connect(actx.destination); s.start();
    } catch (e) {}
  };
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const count = $('#count'), pose = $('#pose'), filmCells = $$('#film i');

  shootBtn.addEventListener('click', async () => {
    if (busy || !source) return;
    busy = false; frames = [];
    shootBtn.disabled = true; $('#outActions').hidden = true;
    filmCells.forEach((c) => (c.style.backgroundImage = ''));
    for (let k = 0; k < 4; k++) {
      pose.textContent = `POSE ${k + 1} / 4`;
      led.textContent = `POSE ${k + 1}`;
      for (const n of [3, 2, 1]) {
        count.textContent = n; HM.beep(n === 1 ? 1200 : 800, 0.08, 0.05);
        if (MOTION) gsap.fromTo(count, { scale: 1.6, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.35, ease: 'back.out(2)' });
        await wait(650);
      }
      count.textContent = '';
      shutter();
      if (MOTION) gsap.fromTo('#flash', { opacity: 1 }, { opacity: 0, duration: 0.7, ease: 'power2.out' });
      const f = document.createElement('canvas'); f.width = 480; f.height = 360;
      render(f.getContext('2d'), 480, 360, current(), filter, source.type === 'cam');
      frames.push(f);
      filmCells[k].style.backgroundImage = `url(${f.toDataURL('image/jpeg', 0.7)})`;
      if (source.type === 'img') source.i++;
      busy = true; await wait(450); busy = false;
    }
    pose.textContent = ''; led.textContent = 'PRINTING';
    await wait(500);
    printStrip();
  });

  /* =======================================================
     THE STRIP
     ======================================================= */
  let stripURL = null;
  async function printStrip() {
    await Promise.all(['64px "Anton"', '18px "Space Mono"', '60px "Sedgwick Ave Display"'].map((f) => document.fonts.load(f)));
    const P = 30, FW = 480, FH = 360, GAP = 18, FOOT = 210;
    const W = FW + P * 2, H = P + 4 * FH + 3 * GAP + P + FOOT;
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const x = c.getContext('2d');
    x.fillStyle = '#f6f2ea'; x.fillRect(0, 0, W, H);
    frames.forEach((f, i) => x.drawImage(f, P, P + i * (FH + GAP)));
    const fy = P + 4 * FH + 3 * GAP + 26;
    x.fillStyle = '#0d0c0c'; x.font = '64px "Anton"'; x.fillText('HOTMESS PASS', P, fy + 56);
    const d = new Date();
    x.font = '16px "Space Mono"';
    x.fillText(`BOOTH 03 · ${d.toLocaleDateString('en-GB')} · ${d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`, P, fy + 88);
    const bc = document.createElement('canvas');
    JsBarcode(bc, 'BOOTH 03', { format: 'CODE128', width: 2, height: 50, margin: 10, displayValue: false, background: '#f6f2ea' });
    x.drawImage(bc, P - 10, fy + 104, 220, 220 * bc.height / bc.width);
    x.save(); x.translate(W - P - 40, fy + 120); x.rotate(-0.25);
    x.font = '60px "Sedgwick Ave Display"'; x.fillStyle = '#ff3fa4'; x.textAlign = 'right'; x.fillText('xoxo', 0, 0);
    x.restore();
    stripURL = c.toDataURL('image/png');

    const out = $('#outStrip');
    out.innerHTML = `<img src="${stripURL}" alt="Your photo booth strip, four photos and the HOTMESS PASS logo">`;
    const img = out.querySelector('img');
    await new Promise((r) => (img.complete ? r() : (img.onload = r)));
    HM.beep(2400, 0.02, 0.02);
    if (MOTION) {
      // printed out of the slot, line by line
      gsap.fromTo(img, { yPercent: -100 }, { yPercent: 0, duration: 2.4, ease: 'steps(24)', onUpdate() { if (Math.random() < 0.3) HM.beep(2200 + Math.random() * 600, 0.01, 0.015); } });
      await wait(2400);
      gsap.fromTo(img, { rotation: 0 }, { rotation: (Math.random() - 0.5) * 6, duration: 0.6, ease: 'elastic.out(1, .4)' });
    }
    $('#outActions').hidden = false;
    led.textContent = 'READY';
    shootBtn.disabled = false;
    if (innerWidth < 900) HM.scrollTo(out);
  }

  $('#dlStrip').addEventListener('click', () => {
    if (!stripURL) return;
    const a = document.createElement('a');
    a.href = stripURL; a.download = `hotmess-booth-${Date.now().toString(36)}.png`;
    document.body.appendChild(a); a.click(); a.remove();
    HM.toast('saved. frame it. or don\'t.');
  });
  $('#again').addEventListener('click', () => shootBtn.click());
})();
