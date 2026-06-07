/* ============================================================
   TIMES LANDAU — app.js
   ============================================================ */
(function () {
  'use strict';
  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- LIVE OPEN/CLOSED BADGE ---------------- */
  function isOpen() {
    const now = new Date();
    const mins = now.getHours() * 60 + now.getMinutes();
    return mins >= 630 || mins < 120; // 10:30–02:00
  }
  function paintStatus() {
    const open = isOpen();
    [['statusBadge', 'statusDot', 'statusText'], ['statusBadge2', 'statusDot2', 'statusText2']]
      .forEach(([b, d, t]) => {
        const badge = document.getElementById(b);
        const txt = document.getElementById(t);
        if (!badge || !txt) return;
        badge.classList.toggle('open', open);
        badge.classList.toggle('closed', !open);
        txt.textContent = open ? 'Jetzt geöffnet' : 'Aktuell geschlossen';
      });
  }
  paintStatus();
  setInterval(paintStatus, 30000);

  /* ---------------- NAV ---------------- */
  const nav = $('#nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 60);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const burger = $('#hamburger'), navLinks = $('#navLinks');
  burger.addEventListener('click', () => {
    const open = burger.classList.toggle('open');
    navLinks.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
  });
  $$('#navLinks a').forEach(a => a.addEventListener('click', () => {
    burger.classList.remove('open'); navLinks.classList.remove('open');
    burger.setAttribute('aria-expanded', false);
  }));

  /* ---------------- CUSTOM CURSOR ---------------- */
  if (window.matchMedia('(pointer:fine)').matches) {
    document.body.classList.add('has-cursor');
    const dot = $('#cursorDot'), ring = $('#cursorRing');
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    window.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
    });
    (function loop() {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    })();
    document.addEventListener('mouseover', e => {
      if (e.target.closest('a,button,.tab,.gal,image-slot')) ring.classList.add('is-hover');
    });
    document.addEventListener('mouseout', e => {
      if (e.target.closest('a,button,.tab,.gal,image-slot')) ring.classList.remove('is-hover');
    });
  }

  /* ---------------- DRINKS DATA + TABS ---------------- */
  const MENU = {
    klassiker: [
      ['Mojito', 'Havana Rum, Limette, Minze, Soda', '9,50'],
      ['Caipirinha', 'Cachaça, Limette, brauner Rohrzucker', '9,50'],
      ['Gin Basil Smash', 'Gin, frisches Basilikum, Zitrone', '10,50'],
      ['Whiskey Sour', 'Bourbon, Zitrone, Eiweiß, Angostura', '10,50'],
      ['Aperol Spritz', 'Aperol, Prosecco, Soda, Orange', '8,90'],
      ['Negroni', 'Gin, Campari, roter Wermut', '10,50'],
    ],
    signature: [
      ['Times Gold', 'Champagner, Passionsfrucht, Vanille, Goldstaub', '14,50'],
      ['Königstraße 26', 'Bourbon, Amaro, Espresso, Orangenöl', '12,90'],
      ['Neon Sour', 'Mezcal, Mango, Chili, Limette', '12,50'],
      ['Pfalz Spritz', 'Riesling-Sekt, Holunder, Minze', '10,90'],
      ['Final Whistle', 'Spiced Rum, Ananas, Ingwer, Limette', '11,90'],
      ['Lounge No. 7', 'Vodka, Litschi, Rose, Prosecco', '11,50'],
    ],
    champagner: [
      ['Moët & Chandon Impérial', 'Brut · 0,75 l', '89,00'],
      ['Moët Glas', 'Brut · 0,1 l', '12,50'],
      ['Veuve Clicquot', 'Brut Yellow Label · 0,75 l', '99,00'],
      ['Hausmarke Sekt', 'Riesling Brut · Weingut Autenrieth · 0,1 l', '6,90'],
      ['Prosecco Frizzante', '0,1 l', '5,50'],
      ['Rosé Champagner', 'Glas · 0,1 l', '14,90'],
    ],
    soft: [
      ['Coca-Cola / Zero', '0,3 l', '3,90'],
      ['Fritz-Limo', 'diverse Sorten · 0,33 l', '3,90'],
      ['Red Bull', '0,25 l', '4,50'],
      ['San Pellegrino', 'still / sprudelnd · 0,5 l', '4,50'],
      ['Hausgemachte Limonade', 'Limette-Minze oder Mango', '4,90'],
      ['Frischer Orangensaft', '0,3 l', '4,50'],
    ],
    shisha: [
      ['Klassik Kopf', 'Premium-Tabak, freie Sortenwahl', '15,00'],
      ['Times Signature Kopf', 'Hauseigene Mischung des Abends', '18,00'],
      ['Fruchtkopf', 'auf frischer Ananas oder Melone', '21,00'],
      ['Kopfwechsel', 'frische Kohle & neuer Tabak', '8,00'],
      ['Premium Linie', 'Dark Side / Al Fakher Select', '19,00'],
      ['Eisschlauch', 'Aufpreis für gekühlten Rauch', '3,00'],
    ],
  };

  const drinksGrid = $('#drinksGrid');
  function renderDrinks(key) {
    drinksGrid.innerHTML = '';
    (MENU[key] || []).forEach((d, i) => {
      const el = document.createElement('div');
      el.className = 'drink';
      el.innerHTML = `<div class="drink__info"><h4>${d[0]}</h4><p>${d[1]}</p></div>
        <span class="drink__dots"></span><span class="drink__price">${d[2]} €</span>`;
      drinksGrid.appendChild(el);
      setTimeout(() => el.classList.add('show'), 40 * i);
    });
  }
  const tabs = $$('#barTabs .tab'), ink = $('#tabsInk');
  function moveInk(tab) {
    ink.style.left = tab.offsetLeft + 'px';
    ink.style.width = tab.offsetWidth + 'px';
  }
  tabs.forEach(tab => tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('is-active'));
    tab.classList.add('is-active');
    moveInk(tab);
    renderDrinks(tab.dataset.tab);
  }));
  renderDrinks('klassiker');
  requestAnimationFrame(() => moveInk(tabs[0]));
  window.addEventListener('resize', () => moveInk($('#barTabs .tab.is-active')));

  /* ---------------- EVENTS DATA ---------------- */
  const EVENTS = [
    { tag: 'Champions League', date: 'Di · 09.06', title: 'Halbfinale', sub: 'Hinspiel', time: '21:00', live: true },
    { tag: 'Bundesliga', date: 'Sa · 13.06', title: 'Topspiel', sub: 'Konferenz', time: '15:30', live: true },
    { tag: 'Formel 1', date: 'So · 14.06', title: 'GP Kanada', sub: 'Rennen', time: '20:00', live: true },
    { tag: 'Boxen', date: 'Sa · 20.06', title: 'Fight Night', sub: 'Main Card', time: '23:00', live: false },
  ];
  const eg = $('#eventsGrid');
  EVENTS.forEach(e => {
    const c = document.createElement('article');
    c.className = 'ev reveal';
    c.innerHTML = `
      <div class="ev__top"><span class="ev__tag">${e.tag}</span><span class="ev__date">${e.date}</span></div>
      <h3 class="ev__title">${e.title}<span>${e.sub}</span></h3>
      <div class="ev__meta">${e.time} Uhr ${e.live ? '<span class="ev__live"><span class="live-dot"></span>Live</span>' : ''}</div>
      <a href="#reserve" class="ev__cta">Jetzt Platz sichern →</a>`;
    eg.appendChild(c);
  });

  /* ---------------- REVIEWS DATA ---------------- */
  const REVIEWS = [
    { t: 'Tolle Atmosphäre, super Cocktails und alle Spiele live — der beste Spot in Landau!', n: 'Max M.', d: 'Mai 2024' },
    { t: 'Beste Sportsbar der Pfalz. Riesige Screens, freundliches Personal und eine top Shisha-Auswahl.', n: 'Selina K.', d: 'April 2024' },
    { t: 'Champions-League-Finale hier geschaut — Gänsehaut-Stimmung. Komme definitiv wieder!', n: 'Daniel R.', d: 'März 2024' },
  ];
  const rg = $('#reviewsGrid');
  REVIEWS.forEach(r => {
    const c = document.createElement('article');
    c.className = 'review reveal';
    c.innerHTML = `<div class="review__stars">★★★★★</div>
      <p class="review__text">„${r.t}"</p>
      <div class="review__by"><span class="review__name">${r.n}</span><span class="review__date">${r.d}</span></div>`;
    rg.appendChild(c);
  });

  /* ---------------- GALLERY ---------------- */
  const masonry = $('#masonry');
  const GAL = [
    ['Cocktail-Kreation', 380], ['Bar bei Nacht', 480], ['Live-Spiel Stimmung', 340],
    ['Lounge-Ecke', 440], ['Shisha-Setup', 360], ['Champagner-Moment', 420],
    ['Theke & Barkeeper', 380], ['Screens & Fans', 460], ['Signature Drink', 350],
    ['Außenansicht', 410], ['Lounge bei Kerzenlicht', 380], ['Anstoß', 440],
  ];
  GAL.forEach((g, i) => {
    const fig = document.createElement('figure');
    fig.className = 'gal';
    fig.dataset.index = i;
    fig.innerHTML = `<image-slot id="gal${i}" shape="rect" fit="cover" style="height:${g[1]}px"
        placeholder="${g[0]}"></image-slot><div class="gal__over"></div>`;
    masonry.appendChild(fig);
  });

  /* ---------------- LIGHTBOX ---------------- */
  const lb = $('#lightbox'), lbStage = $('#lbStage');
  let lbIndex = 0;
  function openLB(i) {
    lbIndex = (i + GAL.length) % GAL.length;
    const slot = document.getElementById('gal' + lbIndex);
    const shadowImg = slot && slot.shadowRoot && slot.shadowRoot.querySelector('img[part="image"]');
    const src = shadowImg && shadowImg.getAttribute('src');
    lbStage.innerHTML = src
      ? `<img src="${src}" alt="${GAL[lbIndex][0]}">`
      : `<image-slot shape="rect" fit="contain" placeholder="${GAL[lbIndex][0]} — Bild hier ablegen"></image-slot>`;
    lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false');
  }
  function closeLB() { lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true'); }
  masonry.addEventListener('click', e => {
    const fig = e.target.closest('.gal');
    // only open lightbox via overlay click, so the drop-zone stays usable
    if (fig && e.target.closest('.gal__over')) openLB(+fig.dataset.index);
  });
  $('#lbClose').addEventListener('click', closeLB);
  $('#lbPrev').addEventListener('click', () => openLB(lbIndex - 1));
  $('#lbNext').addEventListener('click', () => openLB(lbIndex + 1));
  lb.addEventListener('click', e => { if (e.target === lb) closeLB(); });
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLB();
    if (e.key === 'ArrowLeft') openLB(lbIndex - 1);
    if (e.key === 'ArrowRight') openLB(lbIndex + 1);
  });

  /* ---------------- MAP CONSENT (DSGVO 2-click) ---------------- */
  $('#loadMap').addEventListener('click', () => {
    const map = $('#mapConsent').parentElement;
    map.innerHTML = `<iframe title="Karte Times Landau" loading="lazy"
      src="https://www.openstreetmap.org/export/embed.html?bbox=8.108%2C49.193%2C8.127%2C49.203&layer=mapnik&marker=49.1978%2C8.1175"></iframe>`;
  });

  /* ---------------- LENIS SMOOTH SCROLL ---------------- */
  let lenis = null;
  if (window.Lenis && !reduce) {
    lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    window.__lenis = lenis;
    function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    // anchor links through lenis
    $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id.length > 1 && $(id)) { e.preventDefault(); lenis.scrollTo(id, { offset: -70 }); }
    }));
  }

  /* ---------------- REVEALS (IntersectionObserver) ---------------- */
  function animateCount(el) {
    const target = +el.dataset.count;
    const start = performance.now(), dur = 1400;
    function step(now) {
      const p = Math.min(1, (now - start) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * e);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        const el = en.target;
        if (el.classList.contains('reveal')) el.classList.add('in');
        if (el.classList.contains('hl')) el.classList.add('lit');
        if (el.hasAttribute('data-count')) animateCount(el);
        obs.unobserve(el);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    $$('.reveal, .hl, [data-count]').forEach(el => io.observe(el));
    // failsafe: if anything is still hidden after load (e.g. tab was
    // backgrounded so IO never fired), reveal everything.
    window.addEventListener('load', () => setTimeout(() => {
      $$('.reveal:not(.in)').forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.top < innerHeight) el.classList.add('in');
      });
    }, 1200));
  } else {
    $$('.reveal').forEach(el => el.classList.add('in'));
    $$('.hl').forEach(el => el.classList.add('lit'));
    $$('[data-count]').forEach(el => el.textContent = el.dataset.count);
  }

  /* ---------------- HERO PARTICLES (Three.js) ---------------- */
  function initParticles() {
    const canvas = $('#heroCanvas');
    if (!window.THREE || reduce) return;
    const hero = $('.hero');
    let W = hero.clientWidth, H = hero.clientHeight;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(W, H);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100);
    camera.position.z = 30;

    const COUNT = 80;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(COUNT * 3);
    const spd = new Float32Array(COUNT);
    const col = new Float32Array(COUNT * 3);
    const gold = new THREE.Color('#C9A84C'), neon = new THREE.Color('#FF6B1A');
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 70;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 46;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30;
      spd[i] = 0.008 + Math.random() * 0.022;
      const c = Math.random() > 0.55 ? gold : neon;
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));

    // soft round sprite
    const cv = document.createElement('canvas'); cv.width = cv.height = 64;
    const cx = cv.getContext('2d');
    const grd = cx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grd.addColorStop(0, 'rgba(255,255,255,1)');
    grd.addColorStop(0.3, 'rgba(255,255,255,.6)');
    grd.addColorStop(1, 'rgba(255,255,255,0)');
    cx.fillStyle = grd; cx.fillRect(0, 0, 64, 64);
    const tex = new THREE.CanvasTexture(cv);

    const mat = new THREE.PointsMaterial({
      size: 1.5, map: tex, vertexColors: true, transparent: true,
      opacity: 0.9, depthWrite: false, blending: THREE.AdditiveBlending,
    });
    const points = new THREE.Points(geo, mat);
    scene.add(points);

    let tx = 0, ty = 0;
    window.addEventListener('mousemove', e => {
      tx = (e.clientX / innerWidth - 0.5);
      ty = (e.clientY / innerHeight - 0.5);
    });

    function animate() {
      const arr = geo.attributes.position.array;
      for (let i = 0; i < COUNT; i++) {
        arr[i * 3 + 1] += spd[i];
        arr[i * 3] += Math.sin(Date.now() * 0.0004 + i) * 0.004;
        if (arr[i * 3 + 1] > 24) arr[i * 3 + 1] = -24;
      }
      geo.attributes.position.needsUpdate = true;
      camera.position.x += (tx * 6 - camera.position.x) * 0.04;
      camera.position.y += (-ty * 4 - camera.position.y) * 0.04;
      camera.lookAt(scene.position);
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    animate();
    window.addEventListener('resize', () => {
      W = hero.clientWidth; H = hero.clientHeight;
      camera.aspect = W / H; camera.updateProjectionMatrix();
      renderer.setSize(W, H);
    });
  }
  initParticles();
})();
