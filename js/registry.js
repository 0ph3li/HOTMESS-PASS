/* =========================================================
   HOTMESS PASS® — registry.js · lost & found
   ========================================================= */
(() => {
  const { $, $$ } = HM;
  const G = HM.hasGsap;
  const MOTION = G && !HM.reduced;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* =======================================================
     THE WALL
     ======================================================= */
  const WALL = [
    { id: 'm1', t: 'missing', what: 'my sense of self', where: 'the group chat, 2:04AM', img: 'img/REGISTRY/lost-1.jpg' },
    { id: 'f1', t: 'found', what: 'one earring, gold heart', where: 'bathroom sink, floor −1' },
    { id: 'p1', t: 'pass', code: 'HM-0412', cls: 'DELULU', where: 'lost at a concert, front row' },
    { id: 'e1', t: 'feeling', what: 'a crush, slightly used', where: 'unclaimed since march' },
    { id: 'm2', t: 'missing', what: 'the girl i was in 2019', where: 'a tumblr archive', img: 'img/REGISTRY/lost-2.jpg' },
    { id: 'f2', t: 'found', what: "a voice note i shouldn't have sent", where: 'his inbox, 3:12AM' },
    { id: 'e2', t: 'feeling', what: '3 unread apologies', where: 'unclaimed since forever' },
    { id: 'p2', t: 'pass', code: 'HM-0087', cls: 'GHOST(ED)', where: 'never found. never looked.' },
    { id: 'm3', t: 'missing', what: 'my best friend', where: 'the other side of the club', img: 'img/REGISTRY/lost-3.jpg' },
    { id: 'f3', t: 'found', what: 'closure (expired)', where: 'the back of a drawer' },
    { id: 'e3', t: 'feeling', what: 'the urge to text him', where: 'every night, 1AM' },
    { id: 'p3', t: 'pass', code: 'HM-0233', cls: 'MAIN CHARACTER', where: 'left in a taxi, wind machine on' },
    { id: 'm4', t: 'missing', what: 'my dignity', where: 'house party, saturday', img: 'img/REGISTRY/lost-4.jpg' },
    { id: 'f4', t: 'found', what: "a lighter that isn't mine", where: 'my bag, every single time' },
    { id: 'e4', t: 'feeling', what: 'butterflies (dead?)', where: 'since the second date' },
  ];
  const readMine = () => { try { return JSON.parse(HM.store.get('registry') || '[]'); } catch (e) { return []; } };
  const readClaimed = () => { try { return JSON.parse(HM.store.get('claimed') || '[]'); } catch (e) { return []; } };
  let claimed = readClaimed();

  const rot = () => (-5 + Math.random() * 10).toFixed(1);
  function card(d, mine) {
    const x = mine ? `<button type="button" class="it-x" data-del="${d.id}" aria-label="Take it down">✕</button>` : '';
    const tape = `<span class="tape" style="--r:${rot()}deg; top:-12px; left:${20 + Math.random() * 40}%"></span>`;
    if (d.t === 'missing') {
      const photo = d.photo
        ? `<div class="slot has-img"><img src="${d.photo}" alt="Photo on the flyer"></div>`
        : `<div class="slot light" data-img="${d.img || ''}"><span class="slot-label">${(d.img || 'photo').split('/').pop()}<small>4:5</small></span></div>`;
      return `<article class="it" data-t="missing" data-id="${d.id}" ${mine ? 'data-mine' : ''} style="--r:${rot()}deg">${tape}${x}
        <div class="fly">
          <p class="fly-h">MISSING</p>
          <div class="fly-photo">${photo}<span class="smudge"></span></div>
          <p class="fly-q">have you seen:</p>
          <p class="fly-what">${esc(d.what)}</p>
          <p class="fly-where">last seen: ${esc(d.where)}</p>
          <div class="tabs">${Array.from({ length: 7 }, () => '<button type="button" class="tab" aria-label="Tear off a tab with the phone number">333-333-333</button>').join('')}</div>
        </div></article>`;
    }
    if (d.t === 'found') return `<article class="it" data-t="found" data-id="${d.id}" ${mine ? 'data-mine' : ''} style="--r:${rot()}deg">${tape}${x}
        <div class="note-f"><p class="k">FOUND:</p><p class="w">${esc(d.what)}</p><p class="s">where: ${esc(d.where)} · ask at window 3</p></div></article>`;
    if (d.t === 'pass') return `<article class="it" data-t="pass" data-id="${d.id}" style="--r:${rot()}deg">${tape}
        <div class="lp"><div class="lp-h"><b>hotmess</b><span>${esc(d.code)}</span></div>
          <dl><dt>holder:</dt><dd>anonymous</dd><dt>class:</dt><dd>${esc(d.cls)}</dd><dt>note:</dt><dd>${esc(d.where)}</dd></dl>
          <div class="lp-code"><svg class="barcode" data-code="${esc(d.code)}" data-h="34" data-w="1.4"></svg></div>
          <span class="lp-st">LOST</span></div></article>`;
    const isC = claimed.includes(d.id);
    return `<article class="it" data-t="feeling" data-id="${d.id}" ${mine ? 'data-mine' : ''} style="--r:${rot()}deg">${tape}${x}
        <div class="feel"><p class="k">unclaimed feeling</p><p class="w">${esc(d.what)}</p><p class="s">${esc(d.where)}</p>
          ${isC ? '<span class="claimed-st">CLAIMED</span>' : `<button type="button" class="claim" data-claim="${d.id}">claim it</button>`}</div></article>`;
  }

  const wallBox = $('#wallBox');
  function render() {
    const mine = readMine();
    wallBox.innerHTML = mine.map((d) => card(d, true)).join('') + WALL.map((d) => card(d, false)).join('');
    $$('svg.barcode', wallBox).forEach(HM.barcode);
    $$('.slot[data-img]', wallBox).forEach((slot) => {
      if (!slot.dataset.img) return;
      const im = new Image(); im.alt = 'Photo on the flyer';
      im.onload = () => { slot.prepend(im); slot.classList.add('has-img'); };
      im.src = slot.dataset.img;
    });
    $('#claimedN').textContent = claimed.length;
    filter();
  }

  /* ---------- filter + search ---------- */
  let mode = 'all';
  function filter() {
    const q = $('#search').value.trim().toLowerCase();
    let n = 0;
    $$('.it', wallBox).forEach((it) => {
      const okT = mode === 'all' || (mode === 'yours' ? it.hasAttribute('data-mine') : it.dataset.t === mode);
      const okQ = !q || it.textContent.toLowerCase().includes(q);
      it.classList.toggle('is-hidden', !(okT && okQ));
      if (okT && okQ) n++;
    });
    $('#wallEmpty').hidden = n > 0;
    if (G) ScrollTrigger.refresh();
  }
  $('#search').addEventListener('input', filter);
  $$('.chip').forEach((c) => c.addEventListener('click', () => {
    mode = c.dataset.f;
    $$('.chip').forEach((x) => { x.classList.toggle('is-on', x === c); x.setAttribute('aria-checked', x === c); });
    filter();
  }));

  /* ---------- wall interactions ---------- */
  wallBox.addEventListener('click', (e) => {
    const tab = e.target.closest('.tab');
    if (tab) {
      tab.classList.add('is-torn');
      const ghost = tab.cloneNode(true); ghost.classList.remove('is-torn');
      const r = tab.getBoundingClientRect();
      Object.assign(ghost.style, { position: 'fixed', left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px', zIndex: 150, pointerEvents: 'none', border: '1px dashed #999' });
      document.body.appendChild(ghost);
      HM.beep(300, 0.05, 0.05);
      if (MOTION) gsap.to(ghost, { y: innerHeight * 0.7, x: (Math.random() - 0.5) * 200, rotation: (Math.random() - 0.5) * 720, autoAlpha: 0, duration: 1.4, ease: 'power2.in', onComplete: () => ghost.remove() });
      else ghost.remove();
      setTimeout(() => HM.voicemail('333-333-333', 1), 600);
      return;
    }
    const cl = e.target.closest('[data-claim]');
    if (cl) {
      claimed = [...new Set([...claimed, cl.dataset.claim])];
      HM.store.set('claimed', JSON.stringify(claimed));
      const st = document.createElement('span'); st.className = 'claimed-st'; st.textContent = 'CLAIMED';
      cl.replaceWith(st);
      if (MOTION) gsap.fromTo(st, { scale: 3, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.3, ease: 'power4.in', onComplete: () => HM.beep(90, 0.15, 0.18) });
      $('#claimedN').textContent = claimed.length;
      HM.toast('claimed. it\'s yours now. no returns.');
      return;
    }
    const del = e.target.closest('[data-del]');
    if (del) {
      const it = del.closest('.it');
      const kill = () => { HM.store.set('registry', JSON.stringify(readMine().filter((d) => d.id !== del.dataset.del))); render(); };
      if (MOTION) gsap.to(it, { y: 60, rotation: 25, autoAlpha: 0, duration: 0.5, ease: 'power2.in', onComplete: kill }); else kill();
      HM.toast('taken down. found, or forgotten.');
    }
  });

  /* =======================================================
     REPORT A LOSS — live preview + paste
     ======================================================= */
  const form = $('#rpForm'), what = $('#rpWhat'), where = $('#rpWhere'), prev = $('#rpPrev');
  let photo = null;
  const draft = () => ({
    id: 'u' + Date.now().toString(36), t: form.querySelector('input[name=t]:checked').value,
    what: what.value.trim() || (what.placeholder), where: where.value.trim() || where.placeholder, photo,
  });
  const preview = () => {
    prev.innerHTML = card(draft(), false).replace('class="claim"', 'class="claim" disabled');
    $$('.tab', prev).forEach((t) => (t.disabled = true));
  };
  form.addEventListener('input', preview);
  form.addEventListener('change', preview);
  $('#rpPhoto').addEventListener('change', (e) => {
    const f = e.target.files && e.target.files[0]; if (!f) return;
    const fr = new FileReader();
    fr.onload = () => {
      const im = new Image();
      im.onload = () => {
        const s = Math.min(1, 360 / Math.max(im.width, im.height)), c = document.createElement('canvas');
        c.width = Math.round(im.width * s); c.height = Math.round(im.height * s);
        c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
        photo = c.toDataURL('image/jpeg', 0.8);
        form.querySelector('input[value=missing]').checked = true;
        preview();
      };
      im.src = fr.result;
    };
    fr.readAsDataURL(f);
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!what.value.trim()) { HM.toast('what did you lose? be specific. or vague. but say something.'); what.focus(); return; }
    const d = draft();
    const mine = [d, ...readMine()].slice(0, 12);
    try { HM.store.set('registry', JSON.stringify(mine)); } catch (err) {}
    what.value = ''; where.value = ''; photo = null; $('#rpPhoto').value = ''; preview();
    render();
    HM.scrollTo('#wall');
    const it = $(`.it[data-id="${d.id}"]`);
    if (it && MOTION) {
      // wheat-paste: it unrolls onto the wall, a bit wet
      gsap.fromTo(it, { clipPath: 'inset(0 0 100% 0)', filter: 'brightness(1.3) blur(1px)' }, { clipPath: 'inset(0 0 0% 0)', filter: 'brightness(1) blur(0px)', duration: 1.2, delay: 0.9, ease: 'power2.inOut' });
    }
    HM.toast('pasted on the wall. someone will see it. (you.)');
  });
  preview();

  /* =======================================================
     INTRO
     ======================================================= */
  render();
  if (location.hash === '#report') setTimeout(() => HM.scrollTo('#report'), 400);
  if (MOTION) {
    const chars = HM.split($('#rgMast'), 'chars');
    gsap.timeline({ defaults: { ease: 'expo.out' } })
      .from(chars, { yPercent: -110, scaleY: 2.2, transformOrigin: '50% 0', duration: 1.1, stagger: 0.05 })
      .from('.rg-row span', { autoAlpha: 0, y: 14, stagger: 0.08, duration: 0.6 }, 0.4)
      .from('.rg-note', { autoAlpha: 0, rotation: -20, duration: 0.8 }, 0.8)
      .from('.mug', { y: -300, rotation: -30, autoAlpha: 0, duration: 1.1 }, 0.6);
    $$('.rg-stats b[data-count]').forEach((el) => {
      const o = { v: 0 };
      gsap.to(o, { v: +el.dataset.count, duration: 2, ease: 'expo.out', delay: 0.6, onUpdate: () => (el.textContent = Math.round(o.v)) });
    });
    ScrollTrigger.batch('.wall .it', {
      start: 'top 92%', once: true,
      onEnter: (els) => gsap.from(els, { clipPath: 'inset(0 0 100% 0)', y: 30, duration: 0.9, stagger: 0.08, ease: 'power3.out' }),
    });
  } else $$('.rg-stats b[data-count]').forEach((el) => (el.textContent = el.dataset.count));
})();
