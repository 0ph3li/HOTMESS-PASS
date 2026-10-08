/* =========================================================
   HOTMESS PASS® — core.js (shared by every page)
   concept, design & code by ghostly.grl ♥
   ========================================================= */
(() => {
  const HM = (window.HM = {});
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  HM.$ = $; HM.$$ = $$;
  HM.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  HM.fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  HM.hasGsap = typeof window.gsap !== 'undefined';

  // tiny storage wrapper: never throws (private mode, blocked storage…)
  HM.store = {
    get(k, s = localStorage) { try { return s.getItem('hm-' + k); } catch (e) { return null; } },
    set(k, v, s = localStorage) { try { s.setItem('hm-' + k, v); } catch (e) {} },
  };

  if (HM.hasGsap) {
    gsap.registerPlugin(ScrollTrigger);
    if (window.Draggable) gsap.registerPlugin(Draggable);
  }

  /* ---------- smooth scroll ---------- */
  if (window.Lenis && !HM.reduced) {
    HM.lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    if (HM.hasGsap) {
      HM.lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((t) => HM.lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (t) => { HM.lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }
  HM.scrollTo = (target) => {
    if (HM.lenis) HM.lenis.scrollTo(target, { duration: 1.4 });
    else (typeof target === 'string' ? $(target) : target)?.scrollIntoView({ behavior: 'smooth' });
  };
  $$('[data-scrollto]').forEach((a) => a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (!id || !id.startsWith('#')) return;
    e.preventDefault();
    HM.scrollTo(id === '#top' ? 0 : id);
  }));

  /* ---------- clock ---------- */
  const clock = $('#clock');
  const tick = () => {
    const d = new Date();
    if (clock) clock.textContent = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };
  tick(); setInterval(tick, 1000);

  /* ---------- header: solid + hide on scroll down ---------- */
  const hdr = $('#hdr');
  let lastY = 0;
  const onScroll = () => {
    const y = window.scrollY;
    hdr?.classList.toggle('is-solid', y > 40);
    hdr?.classList.toggle('is-hidden', y > 300 && y > lastY && !document.body.classList.contains('menu-open'));
    lastY = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- mobile menu ---------- */
  const burger = $('#burger'), menu = $('#menu');
  const setMenu = (open) => {
    document.body.classList.toggle('menu-open', open);
    burger?.setAttribute('aria-expanded', open);
    menu?.setAttribute('aria-hidden', !open);
    if (HM.lenis) open ? HM.lenis.stop() : HM.lenis.start();
  };
  burger?.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
  $$('#menu a').forEach((a) => a.addEventListener('click', () => setMenu(false)));

  /* ---------- toast ---------- */
  let toastT;
  HM.toast = (msg, ms = 2600) => {
    const t = $('#toast'); if (!t) return;
    t.innerHTML = msg; t.classList.add('is-on');
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('is-on'), ms);
  };

  // pages still being built: say so instead of a 404
  $$('[data-soon]').forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault();
    HM.toast('✦ this office opens soon — page in progress');
  }));

  /* ---------- image slots: drop a file at data-img and it shows up ---------- */
  $$('.slot').forEach((slot) => {
    if (slot.dataset.ratio) slot.style.setProperty('--ratio', slot.dataset.ratio.replace('/', ' / '));
    const src = slot.dataset.img; if (!src) return;
    const img = new Image();
    img.decoding = 'async';
    img.alt = slot.dataset.alt || '';
    if (slot.dataset.pos) img.style.objectPosition = slot.dataset.pos;
    img.onload = () => {
      slot.prepend(img);
      slot.classList.add('has-img');
      slot.dispatchEvent(new CustomEvent('slot:loaded', { detail: { img } }));
      if (HM.hasGsap) ScrollTrigger.refresh();
    };
    img.src = src;
  });

  // run fn once the slot's photo is in, whether it already loaded or not
  HM.onSlot = (slot, fn) => {
    const img = slot.classList.contains('has-img') && slot.querySelector(':scope > img');
    if (img) fn(img); else slot.addEventListener('slot:loaded', (e) => fn(e.detail.img), { once: true });
  };

  /* ---------- real, scannable barcodes (Code 128) ---------- */
  HM.barcode = (svg) => {
    if (!window.JsBarcode) return;
    const d = svg.dataset;
    const w = parseFloat(d.w || 2);
    JsBarcode(svg, d.code, {
      format: 'CODE128',
      width: w,
      height: parseFloat(d.h || 80),
      margin: Math.round(w * 11),      // quiet zone ≥ 10 modules, keeps it scannable
      displayValue: false,
      lineColor: d.color || '#0c0b0d',
      background: d.bg || '#ffffff',
    });
    // make it responsive: keep the geometry, drop the fixed px size
    const vw = svg.getAttribute('width'), vh = svg.getAttribute('height');
    svg.setAttribute('viewBox', `0 0 ${parseFloat(vw)} ${parseFloat(vh)}`);
    svg.removeAttribute('width'); svg.removeAttribute('height');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.setAttribute('role', 'img');
  };
  $$('svg.barcode').forEach(HM.barcode);

  /* ---------- marquees (speed up with scroll velocity) ---------- */
  if (HM.hasGsap && !HM.reduced) {
    $$('.mq-track').forEach((track) => {
      const speed = parseFloat(track.dataset.speed || 1);
      const tw = speed > 0
        ? gsap.to(track, { xPercent: -50, duration: 26 / speed, ease: 'none', repeat: -1 })
        : gsap.fromTo(track, { xPercent: -50 }, { xPercent: 0, duration: 26 / -speed, ease: 'none', repeat: -1 });
      ScrollTrigger.create({
        trigger: track, start: 'top bottom', end: 'bottom top',
        onUpdate: (self) => {
          const v = Math.min(Math.abs(self.getVelocity()) / 300, 6);
          gsap.to(tw, { timeScale: 1 + v, duration: 0.2, overwrite: true });
          gsap.to(tw, { timeScale: 1, duration: 1.2, delay: 0.2, ease: 'power2.out' });
        },
      });
    });
  }

  /* ---------- cursor ---------- */
  const cursor = $('#cursor'), cLabel = $('#cursorLabel');
  if (cursor && HM.fine && !HM.reduced) {
    let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y;
    window.addEventListener('pointermove', (e) => {
      x = e.clientX; y = e.clientY;
      document.body.classList.add('has-cursor');
    }, { passive: true });
    document.addEventListener('mouseleave', () => document.body.classList.remove('has-cursor'));
    const loop = () => {
      cx += (x - cx) * 0.22; cy += (y - cy) * 0.22;
      cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      requestAnimationFrame(loop);
    };
    loop();
    document.addEventListener('pointerover', (e) => {
      const t = e.target.closest('[data-cursor]');
      cursor.classList.toggle('is-big', !!t);
      cursor.classList.toggle('is-link', !t && !!e.target.closest('a, button, input, [data-drag]'));
      if (t) cLabel.textContent = t.dataset.cursor;
    });
  }

  /* ---------- magnetic buttons ---------- */
  if (HM.fine && HM.hasGsap && !HM.reduced) {
    $$('[data-magnetic]').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * 0.3, y: (e.clientY - r.top - r.height / 2) * 0.4, duration: 0.4, ease: 'power3.out' });
      });
      el.addEventListener('pointerleave', () => gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, .4)' }));
    });
  }

  /* ---------- draggable stickers ---------- */
  if (window.Draggable) {
    let z = 10;
    $$('[data-drag]').forEach((el) => Draggable.create(el, {
      bounds: el.offsetParent || document.body,
      onPress() { el.style.zIndex = ++z; gsap.to(el, { scale: 1.12, duration: 0.2 }); },
      onRelease() { gsap.to(el, { scale: 1, duration: 0.6, ease: 'elastic.out(1, .35)' }); },
    }));
  }


  /* ---------- shared SVG filters (spray paint, grungy logo) ---------- */
  if (!document.getElementById('f-spray')) {
    document.body.insertAdjacentHTML('beforeend', `<svg width="0" height="0" style="position:absolute" aria-hidden="true">
      <filter id="f-spray" x="-10%" y="-20%" width="120%" height="140%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="7"/><feGaussianBlur stdDeviation=".6"/></filter>
      <filter id="f-grunge" x="-5%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".035 .09" numOctaves="3" seed="4" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="18"/></filter>
    </svg>`);
  }

  /* ---------- spray paint tag: draws itself, then drips ---------- */
  const SVGNS = 'http://www.w3.org/2000/svg';
  HM.prepSpray = (svg) => {
    const txt = svg.querySelector('.spray-txt'), g = svg.querySelector('.drips');
    if (!txt || !g || g.childNodes.length) return;
    let bb; try { bb = txt.getBBox(); } catch (e) { return; }
    const n = 5 + Math.round(bb.width / 160);
    for (let i = 0; i < n; i++) {
      const r = document.createElementNS(SVGNS, 'rect');
      const w = 4 + Math.random() * 5;
      r.setAttribute('x', bb.x + 20 + Math.random() * (bb.width - 40));
      r.setAttribute('y', bb.y + bb.height * (0.45 + Math.random() * 0.2));
      r.setAttribute('width', w); r.setAttribute('rx', w / 2);
      r.setAttribute('height', 20 + Math.random() * 90);
      g.appendChild(r);
    }
  };
  HM.spray = (svg, d = 1.6) => {
    HM.prepSpray(svg);
    const txt = svg.querySelector('.spray-txt'), drips = svg.querySelectorAll('.drips rect');
    if (!HM.hasGsap || HM.reduced) { txt.style.strokeDashoffset = 0; txt.style.fillOpacity = 1; return null; }
    return gsap.timeline()
      .fromTo(txt, { strokeDashoffset: 1800 }, { strokeDashoffset: 0, duration: d, ease: 'power1.inOut' })
      .to(txt, { fillOpacity: 1, duration: 0.4 }, '-=0.5')
      .fromTo(drips, { scaleY: 0 }, { scaleY: 1, duration: 1.6, ease: 'power2.out', stagger: 0.12 }, '-=0.3');
  };

  /* ---------- thorn vines with spikes, generated (seeded) ---------- */
  HM.thorns = (svg, seed = 1, n = 4) => {
    if (!svg) return;
    let s = seed;
    const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
    for (let i = 0; i < n; i++) {
      const p = document.createElementNS(SVGNS, 'path');
      const y0 = rnd() * 378, y1 = rnd() * 378;
      p.setAttribute('d', `M-40 ${y0} C ${150 + rnd() * 120} ${y0 - 260 + rnd() * 520}, ${300 + rnd() * 120} ${y1 - 260 + rnd() * 520}, 640 ${y1}`);
      svg.appendChild(p);
      const L = p.getTotalLength();
      for (let l = 16; l < L; l += 20 + rnd() * 16) {
        const a = p.getPointAtLength(l), b = p.getPointAtLength(Math.min(L, l + 1));
        const tx = b.x - a.x, ty = b.y - a.y, k = Math.hypot(tx, ty) || 1;
        const ux = tx / k, uy = ty / k, side = rnd() > 0.5 ? 1 : -1, len = 10 + rnd() * 12;
        const poly = document.createElementNS(SVGNS, 'polygon');
        poly.setAttribute('points', `${a.x - ux * 4},${a.y - uy * 4} ${a.x + ux * 4},${a.y + uy * 4} ${a.x - uy * len * side + ux * 6},${a.y + ux * len * side + uy * 6}`);
        svg.appendChild(poly);
      }
    }
  };

  /* ---------- text split helper ---------- */
  HM.split = (el, type = 'chars') => {
    const text = el.textContent;
    el.setAttribute('aria-label', text.trim());
    el.innerHTML = '';
    const out = [];
    if (type === 'chars') {
      [...text].forEach((c) => {
        const s = document.createElement('span');
        s.className = 'ch'; s.setAttribute('aria-hidden', 'true');
        s.textContent = c === ' ' ? ' ' : c;
        el.appendChild(s); out.push(s);
      });
    } else {
      text.trim().split(/\s+/).forEach((w) => {
        const s = document.createElement('span');
        s.className = 'w'; s.setAttribute('aria-hidden', 'true'); s.textContent = w;
        el.appendChild(s); el.appendChild(document.createTextNode(' ')); out.push(s);
      });
    }
    return out;
  };

  /* ---------- tiny synth beep (scanner) ---------- */
  let actx;
  HM.beep = (freq = 1850, dur = 0.12, vol = 0.08) => {
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      const o = actx.createOscillator(), g = actx.createGain();
      o.type = 'square'; o.frequency.value = freq;
      g.gain.setValueAtTime(vol, actx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + dur);
      o.connect(g).connect(actx.destination);
      o.start(); o.stop(actx.currentTime + dur);
    } catch (e) {}
  };

  // titles that call you back
  const title = document.title;
  document.addEventListener('visibilitychange', () => {
    document.title = document.hidden ? 'come back ♥ we kept your pass' : title;
  });

  if (document.fonts && HM.hasGsap) document.fonts.ready.then(() => ScrollTrigger.refresh());
})();
