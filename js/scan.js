/* =========================================================
   HOTMESS PASS® — scan.js · scanner T-03
   ========================================================= */
(() => {
  const { $, $$ } = HM;
  const G = HM.hasGsap;
  const MOTION = G && !HM.reduced;

  const vf = $('#vf'), video = $('#video'), freeze = $('#freeze'), msg = $('#vfMsg');
  const camBtn = $('#camBtn'), receipt = $('#receipt'), led = $('#led');
  const say = (t) => (msg.innerHTML = '&gt; ' + t);

  /* =======================================================
     DATA
     ======================================================= */
  const CLASSES = {
    HOTMESS: { label: 'HOT MESS®', status: 'CERTIFIED', access: 'every bathroom after 2AM', note: "she's a lot. approved.", m: [['glitter', 94], ['regret', 71], ['great stories', 100]] },
    DELULU: { label: 'DELULU', status: 'SELF-ISSUED', access: 'parallel universes', note: 'fate, apparently.', m: [['delusion', 99], ['manifesting', 88], ['reality', 7]] },
    SITUATIONSHIP: { label: 'SITUATIONSHIP', status: 'TEMPORARY, FOREVER', access: '“what are we?” (denied)', note: 'unclear. valid anyway.', m: [['clarity', 3], ['mixed signals', 96], ['read receipts', 100]] },
    MAIN: { label: 'MAIN CHARACTER', status: 'LIMITED EDITION', access: 'slow motion, wind machine', note: 'everyone else is an extra.', m: [['spotlight', 100], ['humility', 9], ['wind in hair', 87]] },
    GHOST: { label: 'GHOST(ED)', status: 'REVOKED', access: 'nowhere', note: 'who? anyway.', m: [['presence', 2], ['last seen', 63], ['replies', 0]] },
  };
  const QUIPS = ['still more stable than your ex', 'contains 0% closure', 'would text back', 'has better boundaries than you', 'emotionally available (suspicious)', 'probably gluten free'];

  const hash = (s) => { let h = 2166136261; for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; };

  function interpret(raw, format) {
    const v = raw.trim(), V = v.toUpperCase(), fmt = (format || 'CODE 128').replace(/_/g, ' ').toUpperCase();
    if (V === 'U ARE THE PRODUCT' || V === 'YOU ARE THE PRODUCT') return {
      fmt, v, verdict: 'PRODUCT CONFIRMED', sub: 'you were always for sale', stamp: 'SOLD',
      rows: [['SUBJECT', 'YOU'], ['STATUS', 'FOR SALE'], ['PRICE', 'YOUR ATTENTION'], ['STOCK', 'UNLIMITED'], ['OWNER', 'EVERYONE BUT YOU']],
      meters: [['attention left', 4], ['data sold', 100], ['self worth (est.)', 61]], hand: 'thank you for being consumed ♥',
    };
    const m = V.match(/^HM-(\d{4})(?:\s+(.+?)\s+(HOTMESS|DELULU|SITUATIONSHIP|MAIN|GHOST))?$/);
    if (m && m[3]) {
      const c = CLASSES[m[3]];
      return {
        fmt, v, verdict: 'IDENTITY VERIFIED*', sub: '*as a ' + c.label.replace('®', '').toLowerCase(), stamp: 'VALID',
        rows: [['HOLDER', m[2]], ['CLASS', c.label], ['TICKET', '#' + m[1]], ['STATUS', c.status], ['ACCESS', c.access]],
        meters: c.m, hand: c.note,
      };
    }
    if (m) return {
      fmt, v, verdict: 'INCOMPLETE', sub: 'window 3 is still waiting for you', stamp: 'PENDING',
      rows: [['TICKET', '#' + m[1]], ['STATUS', 'IN QUEUE'], ['WAIT', 'FOREVER-ISH']],
      meters: [['patience', 12], ['commitment', 30]], hand: 'go finish your application →', link: 'apply.html',
    };
    if (V === 'ISSUE 00') return {
      fmt, v, verdict: 'MAGAZINE DETECTED', sub: 'the identity issue', stamp: 'READ ME',
      rows: [['TITLE', 'HOTMESS'], ['ISSUE', '00'], ['THEME', 'THE IDENTITY ISSUE'], ['PRICE', '€0.00 (priceless)']],
      meters: [['about you', 100], ['fact checked', 0]], hand: "go read it. it's about you.",
    };
    if (V === 'GHOSTLY.GRL WAS HERE') return {
      fmt, v, verdict: 'CREATOR DETECTED', sub: 'you found the signature. nobody looks at footers.', stamp: '♥ OG',
      rows: [['SUBJECT', 'GHOSTLY.GRL'], ['ROLE', 'concept, design & code'], ['STATUS', 'STILL UP AT 3AM'], ['REWARD', 'bragging rights'], ['NEXT', 'type "hotmess" on any page']],
      meters: [['coffee', 100], ['sleep', 3], ['love for this site', 100]], hand: 'thanks for looking closer ♥',
    };
    const h = hash(V), pct = (n) => (h >> n) % 101;
    return {
      fmt, v, verdict: 'NOT A PERSON. PROBABLY.', sub: 'unknown object, analysed anyway', stamp: 'NOT YOU',
      rows: [['OBJECT', 'UNKNOWN'], ['IS IT YOU?', 'NO (99.2%)'], ['VIBE', ['NEUTRAL', 'CHAOTIC', 'CLINGY', 'COLD', 'ICONIC'][h % 5]]],
      meters: [['delulu', pct(3)], ['regret', pct(7)], ['main character energy', pct(11)], ['emotional damage', pct(15)]],
      hand: QUIPS[h % QUIPS.length],
    };
  }

  /* =======================================================
     PRINTER
     ======================================================= */
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  let printing;
  function print(r) {
    const now = new Date(), d2 = (n) => String(n).padStart(2, '0');
    const stamp = `${d2(now.getDate())}/${d2(now.getMonth() + 1)}/${d2(now.getFullYear() % 100)} ${d2(now.getHours())}:${d2(now.getMinutes())}`;
    const line = (a, b) => `<p class="rc-line"><span>${esc(a)}</span><span>${esc(b)}</span></p>`;
    const sep = '<p class="rc-sep"></p>';
    const asciiOk = /^[\x20-\x7e]{1,48}$/.test(r.v);
    receipt.innerHTML = [
      '<p class="rc-head">BUREAU OF EMOTIONAL IDENTITY</p>',
      `<p class="rc-c">SCANNER T-03 · ${stamp}</p>`, sep,
      line('FORMAT', r.fmt), line('DATA', r.v), sep,
      ...r.rows.map(([a, b]) => line(a, b)), sep,
      ...r.meters.map(([a, n]) => `<p class="rc-line"><span>${esc(a.toUpperCase())}</span><span>${n}%</span></p><p class="rc-bar"><i data-v="${n}%" style="--v:${n}%"></i></p>`), sep,
      `<p class="rc-verdict">${esc(r.verdict)}<small>${esc(r.sub)}</small></p>`,
      asciiOk ? '<div class="rc-code"><svg class="barcode" id="rcCode"></svg></div>' : '',
      r.link ? `<p class="rc-hand"><a href="${r.link}">${esc(r.hand)}</a></p>` : `<p class="rc-hand">${esc(r.hand)}</p>`,
      sep, '<p class="rc-c">no refunds. no returns. no closure.</p>',
      `<span class="rc-stamp">${esc(r.stamp)}</span>`,
    ].join('');
    if (asciiOk) {
      const svg = $('#rcCode'); svg.dataset.code = r.v; svg.dataset.h = 50; svg.dataset.w = 1.4; svg.dataset.bg = '#fbfaf5'; HM.barcode(svg);
    }
    led.classList.add('is-on');
    const lines = $$('p, .rc-code', receipt);
    if (!MOTION) { led.classList.remove('is-on'); return; }
    printing?.kill();
    printing = gsap.timeline({ onComplete: () => led.classList.remove('is-on') })
      .fromTo(receipt, { yPercent: -100 }, { yPercent: 0, duration: lines.length * 0.09, ease: `steps(${lines.length})` })
      .from(lines, { autoAlpha: 0, duration: 0.05, stagger: 0.09 }, 0)
      .fromTo($$('.rc-bar i', receipt), { '--v': '0%' }, { '--v': (i, el) => el.dataset.v, duration: 0.6, stagger: 0.1, ease: 'power2.out' }, '-=0.6')
      .from('.rc-stamp', { scale: 3, autoAlpha: 0, duration: 0.25, ease: 'power4.in', onComplete: () => HM.beep(90, 0.15, 0.18) });
    // printer chatter
    let n = 0; const tick = setInterval(() => { HM.beep(2400 + Math.random() * 600, 0.015, 0.02); if (++n > lines.length) clearInterval(tick); }, 90);
  }

  /* =======================================================
     LOG (this device only)
     ======================================================= */
  const hist = $('#hist');
  const readLog = () => { try { return JSON.parse(HM.store.get('scans') || '[]'); } catch (e) { return []; } };
  function renderLog() {
    const log = readLog();
    hist.innerHTML = log.length ? log.map((s) => `<li><span class="mono">${esc(s.t)}</span><span>${esc(s.v)}</span><b>${esc(s.r)}</b></li>`).join('') : '<li class="mono hist-empty">nothing scanned yet.</li>';
  }
  function log(v, r) {
    const d = new Date(), t = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const l = [{ t, v, r }, ...readLog()].slice(0, 8);
    HM.store.set('scans', JSON.stringify(l)); renderLog();
  }
  renderLog();

  /* =======================================================
     HIT
     ======================================================= */
  let paused = false;
  function hit(value, format, source) {
    if (paused || !value) return;
    paused = true;
    const r = interpret(value, format);
    HM.beep(1850, 0.12);
    vf.classList.add('is-hit');
    if (source === 'camera' && video.videoWidth) {
      freeze.width = video.videoWidth; freeze.height = video.videoHeight;
      freeze.getContext('2d').drawImage(video, 0, 0);
      vf.classList.add('is-frozen');
    }
    if (MOTION) gsap.fromTo('#flash', { opacity: 0.9 }, { opacity: 0, duration: 0.6, ease: 'power2.out' });
    say(`decoded: <b>${esc(value)}</b>`);
    $('#hudMode').textContent = 'MODE: ' + r.stamp;
    print(r);
    log(value, r.verdict);
    if (innerWidth < 960 && source !== 'board') HM.scrollTo('#printer');
    setTimeout(() => {
      paused = false; vf.classList.remove('is-hit', 'is-frozen');
      $('#hudMode').textContent = stream || zx ? 'MODE: LIVE' : 'MODE: IDLE';
      if (stream || zx) say('scanning… hold it still');
    }, 3200);
  }

  /* =======================================================
     DECODERS — native BarcodeDetector, ZXing as fallback
     ======================================================= */
  const WANT = ['code_128', 'ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_39', 'qr_code'];
  let decoder;
  async function getDecoder() {
    if (decoder) return decoder;
    if ('BarcodeDetector' in window) {
      try {
        const sup = await BarcodeDetector.getSupportedFormats();
        const f = WANT.filter((x) => sup.includes(x));
        if (f.includes('code_128')) return (decoder = { type: 'native', det: new BarcodeDetector({ formats: f }) });
      } catch (e) {}
    }
    if (!window.ZXing) {
      await new Promise((res, rej) => {
        const s = document.createElement('script');
        s.src = 'https://unpkg.com/@zxing/library@0.21.3/umd/index.min.js';
        s.onload = res; s.onerror = rej; document.head.appendChild(s);
      });
    }
    return (decoder = { type: 'zxing', reader: new ZXing.BrowserMultiFormatReader() });
  }

  /* camera */
  let stream = null, zx = false, loopT, recT, recStart;
  async function startCam() {
    say('asking for the camera…');
    try {
      const d = await getDecoder();
      if (d.type === 'native') {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 } }, audio: false });
        video.srcObject = stream; await video.play();
        const loop = async () => {
          if (!stream) return;
          if (!paused && video.readyState >= 2) {
            try { const r = await d.det.detect(video); if (r[0]) hit(r[0].rawValue, r[0].format, 'camera'); } catch (e) {}
          }
          loopT = setTimeout(loop, 180);
        };
        loop();
      } else {
        zx = true;
        await d.reader.decodeFromVideoDevice(null, video, (res) => { if (res && !paused) hit(res.getText(), ZXing.BarcodeFormat[res.getBarcodeFormat()], 'camera'); });
      }
      vf.classList.add('is-live'); camBtn.classList.add('is-on'); camBtn.querySelector('span').textContent = 'stop camera';
      $('#hudMode').textContent = 'MODE: LIVE';
      say('scanning… hold it still');
      recStart = Date.now();
      recT = setInterval(() => {
        const s = Math.floor((Date.now() - recStart) / 1000), d2 = (n) => String(n).padStart(2, '0');
        $('#recTime').textContent = `${d2(Math.floor(s / 3600))}:${d2(Math.floor(s / 60) % 60)}:${d2(s % 60)}`;
      }, 500);
    } catch (e) {
      stopCam();
      say('camera blocked. upload a photo or type it instead.');
      HM.toast('no camera access. the bureau respects your boundaries.');
    }
  }
  function stopCam() {
    clearTimeout(loopT); clearInterval(recT);
    stream?.getTracks().forEach((t) => t.stop()); stream = null;
    if (zx && decoder?.reader) decoder.reader.reset(); zx = false;
    video.srcObject = null;
    vf.classList.remove('is-live'); camBtn.classList.remove('is-on'); camBtn.querySelector('span').textContent = 'open camera';
    $('#hudMode').textContent = 'MODE: IDLE';
  }
  camBtn.addEventListener('click', () => (stream || zx ? (stopCam(), say('scanner idle')) : startCam()));
  document.addEventListener('visibilitychange', () => { if (document.hidden && (stream || zx)) { stopCam(); say('paused. you left.'); } });

  /* upload */
  $('#fileIn').addEventListener('change', async (e) => {
    const file = e.target.files && e.target.files[0]; if (!file) return;
    e.target.value = '';
    say('reading the photo…');
    const url = URL.createObjectURL(file);
    const img = new Image();
    await new Promise((r) => { img.onload = r; img.onerror = r; img.src = url; });
    freeze.width = img.naturalWidth || 1; freeze.height = img.naturalHeight || 1;
    freeze.getContext('2d').drawImage(img, 0, 0);
    vf.classList.add('is-frozen');
    try {
      const d = await getDecoder();
      let val = null, fmt = null;
      if (d.type === 'native') {
        const r = await d.det.detect(img); if (r[0]) { val = r[0].rawValue; fmt = r[0].format; }
      } else {
        try { const r = await d.reader.decodeFromImageUrl(url); val = r.getText(); fmt = ZXing.BarcodeFormat[r.getBarcodeFormat()]; } catch (err) {}
      }
      if (val) hit(val, fmt, 'upload');
      else { say('nothing found. hold it straighter, girl.'); setTimeout(() => vf.classList.remove('is-frozen'), 2500); }
    } catch (err) { say('the scanner is having a moment.'); }
    URL.revokeObjectURL(url);
  });

  /* type it */
  $('#typeForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const v = $('#typeIn').value.trim(); if (!v) return;
    hit(v, 'TYPED', 'typed'); $('#typeIn').value = '';
  });

  /* =======================================================
     THINGS TO SCAN
     ======================================================= */
  HM.barcode($('#ticketCode'));
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-scan]'); if (!b) return;
    HM.scrollTo('#scanner');
    setTimeout(() => hit(b.dataset.scan, 'CODE 128', 'board'), HM.lenis ? 900 : 100);
  });

  /* =======================================================
     INTRO
     ======================================================= */
  if (MOTION) {
    const chars = HM.split($('#scBig'), 'chars');
    gsap.timeline({ defaults: { ease: 'expo.out' } })
      .from(chars, { yPercent: 110, scaleY: 2, transformOrigin: '50% 100%', duration: 1.1, stagger: 0.07 })
      .from('.sc-title em', { autoAlpha: 0, x: -40, duration: 1 }, 0.3)
      .from('.sc-lead', { autoAlpha: 0, y: 20, duration: 0.8 }, 0.4)
      .from('.vf', { clipPath: 'inset(50% 0 50% 0)', duration: 1.2, ease: 'expo.inOut' }, 0.3)
      .from('.vf-box i', { scale: 2.5, autoAlpha: 0, duration: 0.6, stagger: 0.08 }, 1.1)
      .from('.ctrls > *, .printer', { y: 30, autoAlpha: 0, stagger: 0.1, duration: 0.8 }, 0.6);
    gsap.from('.th-item', { y: 120, rotation: (i) => [-14, 10, -8][i], autoAlpha: 0, duration: 1.1, stagger: 0.12, ease: 'expo.out', scrollTrigger: { trigger: '.th-board', start: 'top 80%' } });
    gsap.from('.th-title', { yPercent: 60, autoAlpha: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.th-title', start: 'top 85%' } });
  }
})();
