/* =========================================================
   HOTMESS PASS® — issues.js · the archive
   ========================================================= */
(() => {
  const { $, $$ } = HM;
  const G = HM.hasGsap;
  const MOTION = G && !HM.reduced;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* =======================================================
     THE ISSUES — newest first, counting backwards
     ======================================================= */
  const ISSUES = [
    {
      n: '00', key: '00', title: 'THE IDENTITY ISSUE', status: 'current issue', img: 'img/INDEX/cover.jpg', pos: '50% 40%',
      lines: [['WHO ARE YOU', "when nobody's checking?"], ['12 SIGNS', "you're the main character (it's the trauma)"]], x: 'xoxo',
      letter: ["Welcome to issue 00. We asked a hundred girls who they were. Ninety-seven said “fine”. Three left the chat.", "This issue is for all of them. It comes with a pass, a barcode and no instructions. You'll figure it out. You always do, eventually, at 3AM."],
      feature: { title: 'proof of existence', quote: "I printed myself because nobody else was going to.", body: ["The first HOTMESS PASS was issued in a bathroom queue. No forms, no photos, just a girl writing her own name on the back of a receipt and calling it official.", "The bureau grew from there. Today it issues thousands of passes a night, all of them fake, all of them true. Nobody checks them. That's the point: the only person who needs to see it is you."] },
      list: { title: '12 signs you\'re the main character', items: ['you narrate your own walk home', 'the playlist starts when you do', 'you cried at a sunset (twice)', 'your ex has a whole arc', 'you dress for the bus like it\'s a red carpet', 'background characters keep looking at you'] },
      back: 'you are the product',
    },
    {
      n: '−1', key: 'm1', title: 'THE GHOST ISSUE', status: 'sold out · seen 1 week ago', img: 'img/ISSUES/issue-1.jpg', pos: '28% 22%',
      lines: [['SEEN', '1 week ago, and other love languages'], ['HOW TO LEAVE', 'without saying goodbye']], x: '✓✓ seen',
      letter: ["This issue almost didn't come out. The writers stopped replying around page four.", "We printed it anyway, with the blank pages left in. Read them slowly. That's where the good parts are."],
      feature: { title: 'the art of disappearing', quote: "I didn't leave. I just stopped loading.", body: ["Ghosting is the only magic trick everyone can do. No wand, no audience, just a phone face down and a silence that gets louder every day.", "We interviewed six professional ghosts. Five didn't show up. The sixth sent a voice note of someone breathing and then deleted it."] },
      list: { title: 'things that are still online', items: ['your last seen', 'the playlist you made for them', 'a draft from march', 'their mom\'s facebook', 'the hope (unfortunately)'] },
      back: 'gone, not forgotten',
    },
    {
      n: '−2', key: 'm2', title: 'THE DELULU ISSUE', status: 'sold out · manifested', img: 'img/ISSUES/issue-2.jpg', pos: '45% 30%',
      lines: [['MANIFEST HIM', 'in five easy steps'], ['IT\'S FATE', 'says the girl who planned it']], x: 'stars',
      letter: ["Everything in this issue is true if you believe it hard enough. We believed it very hard.", "The horoscopes were written by a girl who saw her crush's car once. They are 100% accurate."],
      feature: { title: 'delulu is the solulu', quote: "Reality is just a draft. I'm the editor.", body: ["Delusion gets a bad reputation. But who booked the dream job, moved to the big city and texted first? The delulu girls. Every time.", "Our cover star has been in a relationship for three years. The other person was informed last week. They're very happy together, she says, mostly."] },
      list: { title: 'signs it\'s meant to be', items: ['he liked a story from 2021', 'same coffee order (iced, as all people)', 'you both breathe air', 'he said "lol"', 'the universe (you) said so'] },
      back: 'it\'s giving fate',
    },
    {
      n: '−3', key: 'm3', title: 'THE 3AM ISSUE', status: 'sold out · after hours', img: 'img/ISSUES/issue-3.jpg', pos: '55% 30%',
      lines: [['THE FIELD GUIDE', 'to 3AM'], ['U UP?', 'a cultural history']], x: '03:12',
      letter: ["Nobody plans to be awake at 3AM. It just happens, like weather, like texting someone you shouldn't.", "This is a field guide. Keep it on your nightstand. Do not read it before midnight, it won't make sense."],
      feature: { title: 'the 3AM field guide', quote: "Nothing true has ever been said before midnight.", body: ["At 3AM the city belongs to bathroom mirrors, kebab shops and girls deciding to change their whole life by Monday.", "We spent a month awake to map it. Findings: every bad idea feels like a good one, every song is about you, and the group chat is always, always on."] },
      list: { title: 'what happens at 3AM', items: ['you reorganise your whole personality', 'you open the notes app and write a manifesto', 'you look up your ex\'s new girlfriend', 'you forgive everyone', 'you take it all back at 9AM'] },
      back: 'go to sleep (you won\'t)',
    },
    {
      n: '−4', key: 'm4', title: 'THE SITUATIONSHIP ISSUE', status: 'sold out · it\'s complicated', img: 'img/ISSUES/issue-4.jpg', pos: '40% 18%',
      lines: [['WHAT ARE WE?', 'an investigation'], ['READ 01:47', 'a short story']], x: 'what are we?',
      letter: ["We tried to define the theme of this issue for six months. We're still talking. It's not serious. It's not nothing.", "Read it, don't read it. No pressure. (Please read it.)"],
      feature: { title: 'what are we?', quote: "We're not dating. We just know each other's coffee order.", body: ["The situationship is the most popular relationship status of the decade. It has no anniversary, no label and no exit.", "Our investigation found that 84% of situationships end the same way they started: with a meme sent at 1:47AM and no follow-up question."] },
      list: { title: 'red flags (we ignored)', items: ['"i don\'t do labels"', 'only replies after 11PM', 'you met their dog, not their friends', 'their playlist is called "untitled"', '"let\'s see where it goes"'] },
      back: 'it\'s complicated',
    },
    {
      n: '−5', key: 'm5', title: 'THE MAIN CHARACTER ISSUE', status: 'first issue ever · limited', img: 'img/ISSUES/issue-5.jpg', pos: '60% 18%',
      lines: [['SLOW MOTION', 'wind machine included'], ['EVERYONE ELSE', 'is an extra']], x: 'ME.',
      letter: ["The very first HOTMESS. Twelve copies, all photocopied, all about one girl. She knows who she is.", "We started counting backwards from here, so technically this is the beginning and the end. Very her."],
      feature: { title: 'slow motion, please', quote: "If nobody filmed it, I'll film it myself.", body: ["The main character doesn't wait for the plot. She walks into the room like the soundtrack just dropped, and somehow it has.", "Is it exhausting? Yes. Is it iconic? Also yes. The bureau issued her the first pass ever printed. She laminated it twice."] },
      list: { title: 'main character starter pack', items: ['sunglasses indoors', 'a song for every exit', 'one tragic backstory (edited)', 'a nemesis who doesn\'t know', 'a window seat, always'] },
      back: 'everyone else is an extra',
    },
  ];

  const ADS = [
    ['LOST', 'my dignity, last seen at a house party on saturday. reward: none.', ''],
    ['FOUND', 'one (1) earring, a lot of feelings. both unclaimed.', 'hot'],
    ['FOR SALE', 'ex\'s hoodie. smells like regret. barely worn (every night).', ''],
    ['WANTED', 'someone who texts back. serious applicants only.', 'ink'],
    ['MISSING', 'my sense of self. if found, please keep it, i\'m fine.', ''],
    ['FREE', 'unsolicited advice from my mom. pick up any time.', 'hot'],
  ];

  /* =======================================================
     COVER BUILDER
     ======================================================= */
  function cover(is) {
    let x = '';
    if (is.key === 'm2') x = `<div class="mg-x">${[[12, 22], [70, 30], [80, 60], [18, 62], [48, 46]].map(([l, t]) => `<i style="left:${l}%;top:${t}%">★</i>`).join('')}</div><span class="mg-hand">it's fate</span>`;
    else if (is.x) x = `<span class="mg-x">${esc(is.x)}</span>`;
    return `
      <div class="mag cv-${is.key}" data-key="${is.key}">
        <div class="slot fill" data-img="${is.img}" data-pos="${is.pos || '50% 50%'}" data-alt="Cover photo for HOTMESS issue ${esc(is.n)}">
          <span class="slot-label">${is.img.split('/').pop()}<small>cover · vertical</small></span>
        </div>
        <div class="mg-top"><span>ISSUE ${esc(is.n)}</span><span>€0.00</span></div>
        <p class="mg-mast">HOTMESS</p>
        <p class="mg-line mg-l1"><b>${esc(is.lines[0][0])}</b>${esc(is.lines[0][1])}</p>
        <p class="mg-line mg-l2"><b>${esc(is.lines[1][0])}</b>${esc(is.lines[1][1])}</p>
        ${x}
        <span class="mg-num">${esc(is.n)}</span>
        <div class="mg-code"><svg class="barcode" data-code="ISSUE ${is.n.replace('−', '-')}" data-h="40" data-w="1.2"></svg></div>
      </div>`;
  }
  // after inserting covers: load photos + render barcodes
  function hydrate(root) {
    $$('svg.barcode:not([viewBox])', root).forEach(HM.barcode);
    $$('.slot[data-img]:not(.has-img)', root).forEach((slot) => {
      if (slot.dataset.loading) return; slot.dataset.loading = 1;
      const img = new Image(); img.alt = slot.dataset.alt || '';
      if (slot.dataset.pos) img.style.objectPosition = slot.dataset.pos;
      img.onload = () => { slot.prepend(img); slot.classList.add('has-img'); };
      img.src = slot.dataset.img;
    });
  }

  /* =======================================================
     01 · THE PILE — draggable, messy
     ======================================================= */
  const pileBox = $('#pileBox');
  pileBox.innerHTML = ISSUES.slice().reverse().map(cover).join('');
  hydrate(pileBox);
  const pileMags = $$('.mag', pileBox);
  const spots = [[54, 38], [66, 30], [44, 46], [74, 44], [58, 52], [36, 34]];
  pileMags.forEach((m, i) => {
    m.style.left = spots[i][0] + '%'; m.style.top = spots[i][1] + '%';
    m.style.rotate = (-14 + Math.random() * 28).toFixed(1) + 'deg';
    m.style.zIndex = i + 1;
  });
  if (window.Draggable) {
    let z = 20;
    pileMags.forEach((m) => Draggable.create(m, {
      bounds: '#pile',
      onPress() { m.style.zIndex = ++z; gsap.to(m, { scale: 1.06, duration: 0.2 }); },
      onRelease() { gsap.to(m, { scale: 1, duration: 0.6, ease: 'elastic.out(1, .4)' }); },
      onClick() { const k = m.dataset.key; openReader(ISSUES.findIndex((x) => x.key === k)); },
    }));
  }
  if (MOTION) {
    const chars = HM.split($('#isMast'), 'chars');
    gsap.timeline({ defaults: { ease: 'expo.out' } })
      .from(chars, { yPercent: -110, scaleY: 2.2, transformOrigin: '50% 0', duration: 1.1, stagger: 0.06 })
      .from('.is-row span', { autoAlpha: 0, y: 14, stagger: 0.1, duration: 0.6 }, 0.4)
      .from(pileMags, { y: () => -innerHeight, rotation: () => gsap.utils.random(-90, 90), duration: 1.2, stagger: 0.12 }, 0.4)
      .from('.pile-note, .pile-meta', { autoAlpha: 0, duration: 0.6 }, 1.4);
  }

  /* =======================================================
     02 · THE RACK — coverflow driven by scroll
     ======================================================= */
  const flow = $('#flow'), N = ISSUES.length;
  flow.innerHTML = ISSUES.map(cover).join('');
  hydrate(flow);
  const flowMags = $$('.mag', flow);
  $('#rackDots').innerHTML = ISSUES.map(() => '<i></i>').join('');
  const dots = $$('#rackDots i');
  let pos = 0, active = -1;

  function layout(f) {
    pos = f;
    const w = flowMags[0].offsetWidth;
    flowMags.forEach((m, i) => {
      const d = i - f, a = Math.abs(d), s = Math.sign(d);
      const x = a < 1 ? d * w * 0.75 : s * (w * 0.75 + (a - 1) * w * 0.32);
      const ry = a < 1 ? -d * 62 : -s * 62;
      const z = a < 1 ? -a * 220 : -220 - (a - 1) * 40;
      m.style.transform = `translate(-50%, -55%) translate3d(${x}px, 0, ${z}px) rotateY(${ry}deg)`;
      m.style.zIndex = 100 - Math.round(a * 10);
      m.style.filter = `brightness(${1 - Math.min(0.55, a * 0.25)})`;
    });
    const k = Math.round(f);
    if (k !== active) {
      active = k;
      const is = ISSUES[k];
      $('#riN').textContent = is.n; $('#riTitle').textContent = is.title; $('#riSub').textContent = is.status;
      flowMags.forEach((m, i) => m.classList.toggle('is-on', i === k));
      dots.forEach((d, i) => d.classList.toggle('is-on', i === k));
      if (MOTION) gsap.fromTo('.rack-info > *', { y: 10, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4, stagger: 0.05, overwrite: true });
      HM.beep(1300, 0.02, 0.02);
    }
  }

  let rackST;
  if (G) {
    rackST = ScrollTrigger.create({
      trigger: '#rack', start: 'top top', end: () => '+=' + innerHeight * 0.6 * (N - 1), pin: '#rackIn', scrub: true,
      snap: { snapTo: 1 / (N - 1), duration: { min: 0.2, max: 0.5 }, ease: 'power2.inOut' },
      onUpdate: (self) => layout(self.progress * (N - 1)),
    });
  }
  layout(0);
  const goTo = (i) => {
    i = Math.max(0, Math.min(N - 1, i));
    if (rackST) HM.scrollTo(rackST.start + (rackST.end - rackST.start) * (i / (N - 1)));
    else layout(i);
  };
  flowMags.forEach((m, i) => m.addEventListener('click', () => (i === active ? openReader(i) : goTo(i))));
  $('#riRead').addEventListener('click', () => openReader(active));
  // drag on the rack
  let dragX = null;
  flow.addEventListener('pointerdown', (e) => { dragX = e.clientX; });
  window.addEventListener('pointerup', (e) => {
    if (dragX === null) return;
    const dx = e.clientX - dragX; dragX = null;
    if (Math.abs(dx) > 40) goTo(active + (dx < 0 ? 1 : -1));
  });
  window.addEventListener('keydown', (e) => {
    if (reader.classList.contains('is-on')) return;
    const r = $('#rack').getBoundingClientRect();
    if (r.top > innerHeight * 0.5 || r.bottom < innerHeight * 0.5) return;
    if (e.key === 'ArrowRight') goTo(active + 1);
    if (e.key === 'ArrowLeft') goTo(active - 1);
    if (e.key === 'Enter') openReader(active);
  });
  window.addEventListener('resize', () => layout(pos));

  /* =======================================================
     READER — flip book
     ======================================================= */
  const reader = $('#reader'), book = $('#book');
  let leaves = [], flipped = 0, issue = null, single = false, side = 'right';

  const folio = (p, is) => `<div class="pp-folio"><span>HOTMESS · ISSUE ${esc(is.n)}</span><span>p.${String(p).padStart(2, '0')}</span></div>`;
  function pages(is) {
    const ads = ADS.slice().sort(() => Math.random() - 0.5).slice(0, 4);
    return [
      cover(is),
      `<div class="pp"><p class="pp-k">editor's letter</p><p class="pp-h">dear reader,</p><p class="pp-serif">${esc(is.letter[0])}</p><p class="pp-body">${esc(is.letter[1])}</p><p class="pp-sign">ghostly.grl ♥</p>${folio(2, is)}</div>`,
      `<div class="pp"><p class="pp-k">issue ${esc(is.n)} · ${esc(is.title.toLowerCase())}</p><p class="pp-h">contents</p><ul class="pp-toc">
        <li><span>p.02</span>editor's letter</li><li><span>p.05</span>${esc(is.feature.title)}</li><li><span>p.06</span>${esc(is.list.title)}</li><li><span>p.07</span>lost &amp; found</li><li><span>p.08</span>${esc(is.back)}</li></ul>${folio(3, is)}</div>`,
      `<div class="pp-photo"><div class="slot ${is.key === '00' ? 'ht' : ''}" data-img="${is.img}" data-pos="${is.pos || '50% 50%'}" data-alt="Full-page photo"><span class="slot-label">${is.img.split('/').pop()}<small>full page</small></span></div><p class="pp-cap">photographed at 3:12AM. nobody consented to the flash.</p></div>`,
      `<div class="pp"><p class="pp-k">feature</p><p class="pp-h">${esc(is.feature.title)}</p><p class="pp-quote">“${esc(is.feature.quote)}”</p><div class="pp-cols">${is.feature.body.map((b) => `<p>${esc(b)}</p>`).join('')}</div>${folio(5, is)}</div>`,
      `<div class="pp"><p class="pp-k">the list</p><p class="pp-h">${esc(is.list.title)}</p><ol class="pp-list">${is.list.items.map((t) => `<li>${esc(t)}</li>`).join('')}</ol>${folio(6, is)}</div>`,
      `<div class="pp"><p class="pp-k">classifieds</p><p class="pp-h">lost &amp; found</p><div class="pp-ads">${ads.map(([b, t, c]) => `<div class="pp-ad ${c}"><b>${b}</b>${esc(t)}</div>`).join('')}</div>${folio(7, is)}</div>`,
      `<div class="pp-back" style="--bg:${getComputedStyle(document.documentElement).getPropertyValue('--ink')}"><p class="pp-k" style="color:var(--hot)">back cover</p><p class="pp-h">${esc(is.back)}</p><div class="bc"><svg class="barcode" data-code="ISSUE ${is.n.replace('−', '-')}" data-h="60" data-w="2"></svg></div><p class="pp-k" style="color:#999">scan it at the bureau · scan.html</p></div>`,
    ];
  }

  function build(is) {
    const p = pages(is), L = p.length / 2;
    book.innerHTML = Array.from({ length: L }, (_, i) => `
      <div class="leaf" data-i="${i}">
        <div class="face front">${p[i * 2]}</div>
        <div class="face back">${p[i * 2 + 1]}</div>
      </div>`).join('');
    hydrate(book);
    leaves = $$('.leaf', book);
    flipped = 0; side = 'right';
    leaves.forEach((l, i) => { l.style.zIndex = L - i; l.style.transform = 'rotateY(0deg)'; });
    leaves.forEach((l) => l.addEventListener('click', (e) => {
      const back = e.target.closest('.face.back');
      back ? prev() : next();
    }));
  }

  function shift() {
    const L = leaves.length;
    let x;
    if (single) x = side === 'right' ? -25 : 25;
    else x = flipped === 0 ? -25 : flipped === L ? 25 : 0;
    if (G) gsap.to(book, { xPercent: x, duration: MOTION ? 0.9 : 0, ease: 'power3.inOut' });
    else book.style.translate = `${x}% 0`;
    const page = single ? (side === 'right' ? flipped * 2 : flipped * 2 - 1) : flipped * 2;
    const label = page === 0 ? 'cover' : page >= L * 2 - 1 ? 'back cover' : single ? `p.${String(page + 1).padStart(2, '0')}` : `p.${String(page).padStart(2, '0')}–${String(page + 1).padStart(2, '0')}`;
    $('#rdPage').textContent = label;
    $('#rdPrev').disabled = flipped === 0 && side === 'right';
    $('#rdNext').disabled = flipped === L && (!single || side === 'left');
  }

  function turn(leaf, toFlipped) {
    const L = leaves.length, i = +leaf.dataset.i;
    leaf.style.zIndex = L + 2;
    const done = () => { leaf.style.zIndex = toFlipped ? i + 1 : L - i; };
    HM.beep(500 + Math.random() * 200, 0.03, 0.02);
    if (!MOTION) { leaf.style.transform = `rotateY(${toFlipped ? -180 : 0}deg)`; return done(); }
    gsap.to(leaf, { rotationY: toFlipped ? -180 : 0, duration: 0.9, ease: 'power2.inOut', onComplete: done });
    // the page bends a little on the way
    gsap.fromTo(leaf, { skewY: 0 }, { skewY: toFlipped ? -3 : 3, duration: 0.45, yoyo: true, repeat: 1, ease: 'sine.inOut' });
  }

  function next() {
    const L = leaves.length;
    if (single && side === 'right' && flipped < L) { turn(leaves[flipped], true); flipped++; side = 'left'; return shift(); }
    if (single && side === 'left') { if (flipped === L) return; side = 'right'; return shift(); }
    if (flipped >= L) return;
    turn(leaves[flipped], true); flipped++; shift();
  }
  function prev() {
    if (single && side === 'left') { flipped--; turn(leaves[flipped], false); side = 'right'; return shift(); }
    if (single && side === 'right') { if (flipped === 0) return; side = 'left'; return shift(); }
    if (flipped <= 0) return;
    flipped--; turn(leaves[flipped], false); shift();
  }

  function openReader(i) {
    if (i < 0) return;
    issue = ISSUES[i];
    single = innerWidth < 860;
    build(issue);
    $('#rdTitle').textContent = `HOTMESS · ISSUE ${issue.n} · ${issue.title}`;
    shift();
    reader.classList.add('is-on'); reader.setAttribute('aria-hidden', 'false');
    HM.lenis?.stop();
    document.documentElement.style.overflow = 'hidden';
    if (MOTION) gsap.fromTo(book, { y: 200, rotationX: 40, autoAlpha: 0 }, { y: 0, rotationX: 0, autoAlpha: 1, duration: 0.9, ease: 'expo.out' });
    $('#rdClose').focus();
  }
  function closeReader() {
    reader.classList.remove('is-on'); reader.setAttribute('aria-hidden', 'true');
    HM.lenis?.start();
    document.documentElement.style.overflow = '';
  }
  $('#rdClose').addEventListener('click', closeReader);
  $('#rdNext').addEventListener('click', next);
  $('#rdPrev').addEventListener('click', prev);
  window.addEventListener('keydown', (e) => {
    if (!reader.classList.contains('is-on')) return;
    if (e.key === 'Escape') closeReader();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  });

  /* =======================================================
     SUBSCRIBE
     ======================================================= */
  if (MOTION) {
    gsap.from('.sub-title', { yPercent: 50, autoAlpha: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '.sub', start: 'top 70%' } });
    gsap.from('.sub-lead, .sub-btn', { y: 30, autoAlpha: 0, stagger: 0.1, duration: 0.8, ease: 'expo.out', scrollTrigger: { trigger: '.sub', start: 'top 60%' } });
  }
})();
