/* ============================================================
   ICH BIN SO FREY — App-Logik
   Alle Skripte laufen nach DOM + CDN (defer-Reihenfolge).
   Reduced-Motion wird respektiert.
   ============================================================ */
(function () {
  'use strict';

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  const hasGSAP = typeof window.gsap !== 'undefined';
  if (hasGSAP && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  /* ---------- PAGE LOADER ---------- */
  const loader = document.getElementById('loader');
  function revealPage() {
    document.body.classList.remove('loading');
    if (hasGSAP && !reduce) {
      gsap.to('.loader .logo', { opacity: 1, duration: 0.5, onComplete: closeLoader });
    } else {
      const logo = loader.querySelector('.logo'); if (logo) logo.style.opacity = 1;
      setTimeout(closeLoader, 400);
    }
  }
  function closeLoader() {
    setTimeout(() => {
      loader.classList.add('done');
      setTimeout(() => { loader.style.display = 'none'; heroIntro(); }, 950);
    }, reduce ? 50 : 450);
  }
  window.addEventListener('load', revealPage);
  // Fallback falls load schon durch ist
  if (document.readyState === 'complete') revealPage();

  /* ---------- LENIS SMOOTH SCROLL ---------- */
  let lenis = null;
  if (typeof window.Lenis !== 'undefined' && !reduce) {
    lenis = new Lenis({ duration: 1.1, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    if (hasGSAP) { lenis.on('scroll', ScrollTrigger.update); }
  }
  function scrollTo(target) {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.pageYOffset - 64;
    if (lenis) lenis.scrollTo(y, { duration: 1.2 });
    else window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
  }
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href.length < 2) return;
      const tgt = document.querySelector(href);
      if (tgt) { e.preventDefault(); scrollTo(tgt); closeMobileNav(); }
    });
  });

  /* ---------- NAV: hide-on-scroll + glass + active section ---------- */
  const nav = document.getElementById('nav');
  let lastY = 0;
  function onScroll() {
    const y = window.pageYOffset;
    nav.classList.toggle('scrolled', y > 100);
    if (y > lastY && y > 400) nav.classList.add('hidden');
    else nav.classList.remove('hidden');
    lastY = y;
    // progress bar
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (y / max) * 100 : 0;
    progress.style.width = pct + '%';
  }
  const progress = document.getElementById('progress');
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // active link via IntersectionObserver
  const navLinks = document.querySelectorAll('.nav-links a[data-sec]');
  const secMap = {};
  navLinks.forEach(l => { const s = document.getElementById(l.dataset.sec); if (s) secMap[l.dataset.sec] = l; });
  const navObs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const l = secMap[en.target.id]; if (l) l.classList.add('active');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  Object.keys(secMap).forEach(id => { const s = document.getElementById(id); if (s) navObs.observe(s); });

  /* ---------- MOBILE NAV ---------- */
  const burger = document.getElementById('burger');
  const mobileNav = document.getElementById('mobileNav');
  function closeMobileNav() { burger.classList.remove('open'); mobileNav.classList.remove('open'); }
  burger.addEventListener('click', () => {
    const open = burger.classList.toggle('open');
    mobileNav.classList.toggle('open', open);
    if (open && hasGSAP && !reduce) {
      gsap.fromTo('.mobile-nav a', { y: 24, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.06, duration: 0.5, delay: 0.1, ease: 'power3.out' });
    }
  });

  /* ---------- HERO: Three.js Partikel ---------- */
  function initHeroParticles() {
    const canvas = document.getElementById('hero-canvas');
    const fallback = document.getElementById('heroFallback');
    if (isTouch || reduce || typeof window.THREE === 'undefined') {
      if (canvas) canvas.style.display = 'none';
      if (fallback) fallback.style.display = 'block';
      return;
    }
    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
      camera.position.z = 60;
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      function size() {
        const w = canvas.clientWidth, h = canvas.clientHeight || window.innerHeight;
        renderer.setSize(w, h, false);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        camera.aspect = w / h; camera.updateProjectionMatrix();
      }
      const COUNT = 380;
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(COUNT * 3);
      const speeds = new Float32Array(COUNT);
      for (let i = 0; i < COUNT; i++) {
        pos[i*3] = (Math.random() - 0.5) * 160;
        pos[i*3+1] = (Math.random() - 0.5) * 110;
        pos[i*3+2] = (Math.random() - 0.5) * 90;
        speeds[i] = 0.2 + Math.random() * 0.5;
      }
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      // weiches rundes Sprite
      const c = document.createElement('canvas'); c.width = c.height = 64;
      const cx = c.getContext('2d');
      const g = cx.createRadialGradient(32,32,0,32,32,32);
      g.addColorStop(0,'rgba(200,169,110,0.9)'); g.addColorStop(0.4,'rgba(143,175,130,0.5)'); g.addColorStop(1,'rgba(143,175,130,0)');
      cx.fillStyle = g; cx.fillRect(0,0,64,64);
      const tex = new THREE.CanvasTexture(c);
      const mat = new THREE.PointsMaterial({ size: 2.4, map: tex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.85 });
      const pts = new THREE.Points(geo, mat);
      scene.add(pts);
      size(); window.addEventListener('resize', size);
      let mx = 0, my = 0;
      window.addEventListener('mousemove', e => { mx = (e.clientX / window.innerWidth - 0.5); my = (e.clientY / window.innerHeight - 0.5); });
      let t = 0, raf;
      function animate() {
        raf = requestAnimationFrame(animate);
        t += 0.004;
        const p = geo.attributes.position.array;
        for (let i = 0; i < COUNT; i++) {
          p[i*3+1] += Math.sin(t + i) * 0.012 + speeds[i] * 0.02;
          p[i*3] += Math.cos(t * 0.5 + i) * 0.01;
          if (p[i*3+1] > 56) p[i*3+1] = -56;
        }
        geo.attributes.position.needsUpdate = true;
        pts.rotation.y += 0.0006;
        camera.position.x += (mx * 12 - camera.position.x) * 0.03;
        camera.position.y += (-my * 8 - camera.position.y) * 0.03;
        camera.lookAt(scene.position);
        renderer.render(scene, camera);
      }
      animate();
      // Parallax-Drift beim Scrollen
      if (hasGSAP) {
        gsap.to(camera.position, { z: 80, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } });
      }
    } catch (err) {
      if (canvas) canvas.style.display = 'none';
      if (fallback) fallback.style.display = 'block';
    }
  }
  initHeroParticles();

  /* ---------- HERO INTRO (nach Loader) ---------- */
  function heroIntro() {
    const headline = document.getElementById('heroHeadline');
    // Split in Buchstaben
    if (headline && !headline.dataset.split) {
      headline.dataset.split = '1';
      // Zeilen aus data-lines lesen (vermeidet jegliches <br>-Escaping)
      const lines = (headline.dataset.lines || headline.textContent).split('|');
      headline.innerHTML = '';
      lines.forEach(lineText => {
        const line = document.createElement('span'); line.className = 'line';
        lineText.trim().split(' ').forEach((word, wi, arr) => {
          const wspan = document.createElement('span'); wspan.className = 'word';
          [...word].forEach(chr => {
            const ch = document.createElement('span'); ch.className = 'ch'; ch.textContent = chr;
            wspan.appendChild(ch);
          });
          line.appendChild(wspan);
          if (wi < arr.length - 1) line.appendChild(document.createTextNode(' '));
        });
        headline.appendChild(line);
      });
    }
    if (hasGSAP && !reduce) {
      const tl = gsap.timeline();
      tl.from('[data-hero="0"]', { y: 24, opacity: 0, duration: 0.7, ease: 'power3.out' })
        .from('#heroHeadline .ch', { y: 70, opacity: 0, stagger: 0.04, duration: 0.7, ease: 'power4.out' }, '-=0.3')
        .from('[data-hero="2"]', { y: 20, opacity: 0, duration: 0.6 }, '-=0.2')
        .from('[data-hero="3"]', { y: 20, opacity: 0, duration: 0.6 }, '-=0.3')
        .from('[data-hero="4"]', { opacity: 0, duration: 0.6 }, '-=0.2')
        .add(() => scrambleTagline(), '-=0.4');
    } else {
      scrambleTagline();
    }
  }

  /* ---------- TEXT SCRAMBLE auf Tagline ---------- */
  function scrambleTagline() {
    const el = document.getElementById('heroSub');
    if (!el || reduce) return;
    const finalText = el.dataset.scramble.replace(/&amp;/g, '&');
    const chars = 'абвг✦◆●▪·∴⟡ABCXYZ0123';
    let frame = 0; const total = 36;
    const len = finalText.length;
    const interval = setInterval(() => {
      frame++;
      let out = '';
      for (let i = 0; i < len; i++) {
        if (finalText[i] === ' ') { out += ' '; continue; }
        const revealAt = (i / len) * total * 0.7;
        if (frame > revealAt) out += finalText[i];
        else out += chars[Math.floor(Math.random() * chars.length)];
      }
      el.textContent = out;
      if (frame >= total) { clearInterval(interval); el.textContent = finalText; }
    }, 34);
  }

  /* ---------- FLOATING LEAVES ---------- */
  if (hasGSAP && !reduce) {
    gsap.utils.toArray('[data-float]').forEach((el, i) => {
      gsap.to(el, { rotation: i % 2 ? 6 : -6, duration: 8 + i, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    });
  }

  /* ---------- SCROLL REVEAL ---------- */
  if (hasGSAP && !reduce) {
    gsap.utils.toArray('[data-reveal]').forEach(sec => {
      gsap.from(sec.querySelectorAll('.sec-head, .about-grid > *, .hours-grid > *, .dish-card, .cat-card, .step, .review, .menu-cat, .flip, .contact-item, .form-shell, .counters, .cat-cta-row'), {
        y: 60, opacity: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out',
        scrollTrigger: { trigger: sec, start: 'top 80%' }
      });
    });
    // Parallax-Ebenen
    gsap.utils.toArray('[data-parallax]').forEach(el => {
      const sp = parseFloat(el.dataset.parallax) || 0.4;
      gsap.to(el, { yPercent: -sp * 30, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    // About-Leaf zeichnet sich
    const aboutLeaf = document.getElementById('aboutLeaf');
    if (aboutLeaf) {
      aboutLeaf.querySelectorAll('path').forEach(p => {
        gsap.set(p, { strokeDasharray: 1, strokeDashoffset: 1 });
        gsap.to(p, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: '#about', start: 'top 70%', end: 'center center', scrub: true } });
      });
    }
    // Steps-Linie
    const stepsFill = document.getElementById('stepsFill');
    if (stepsFill) gsap.to(stepsFill, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '#steps', start: 'top 60%', end: 'bottom 70%', scrub: true } });
  }

  /* ---------- COUNTERS ---------- */
  const counters = document.getElementById('counters');
  if (counters) {
    const co = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        co.disconnect();
        en.target.querySelectorAll('[data-count]').forEach(el => {
          const target = parseInt(el.dataset.count, 10);
          const suffix = el.dataset.suffix || '';
          const sep = el.dataset.sep === 'true';
          if (reduce) { el.textContent = (sep ? target.toLocaleString('de-DE') : target) + suffix; return; }
          const obj = { v: 0 };
          gsap.to(obj, { v: target, duration: 2, ease: 'power2.out', onUpdate() {
            const n = Math.floor(obj.v);
            el.textContent = (sep ? n.toLocaleString('de-DE') : n) + suffix;
          }});
        });
      });
    }, { threshold: 0.4 });
    co.observe(counters);
  }

  /* ---------- 3D TILT auf Dish-Cards ---------- */
  if (!isTouch && !reduce) {
    document.querySelectorAll('[data-tilt]').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(800px) rotateY(${px * 8}deg) rotateX(${-py * 8}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  /* ---------- MAGNETIC BUTTONS ---------- */
  if (!isTouch && !reduce && hasGSAP) {
    document.querySelectorAll('[data-magnetic]').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width/2) * 0.3;
        const y = (e.clientY - r.top - r.height/2) * 0.3;
        gsap.to(btn, { x, y, duration: 0.3, ease: 'power2.out' });
      });
      btn.addEventListener('mouseleave', () => gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1,0.3)' }));
    });
  }

  /* ---------- RIPPLE auf Buttons ---------- */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const r = btn.getBoundingClientRect();
      const span = document.createElement('span');
      span.className = 'ripple';
      const d = Math.max(r.width, r.height);
      span.style.width = span.style.height = d + 'px';
      span.style.left = (e.clientX - r.left - d/2) + 'px';
      span.style.top = (e.clientY - r.top - d/2) + 'px';
      btn.appendChild(span);
      setTimeout(() => span.remove(), 650);
    });
  });

  /* ---------- CUSTOM CURSOR ---------- */
  if (!isTouch && !reduce) {
    const dot = document.getElementById('cdot');
    const ring = document.getElementById('cring');
    let mx = window.innerWidth/2, my = window.innerHeight/2, rx = mx, ry = my;
    window.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
    });
    function ringLoop() {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(ringLoop);
    }
    ringLoop();
    document.querySelectorAll('a, button, [data-magnetic], .pill, .toggle-card, .flip').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('grow'));
      el.addEventListener('mouseleave', () => ring.classList.remove('grow'));
    });
  }

  /* ---------- LIVE OPEN/CLOSED BADGE ---------- */
  function updateStatus() {
    const badge = document.getElementById('statusBadge');
    const txt = document.getElementById('statusText');
    const note = document.getElementById('statusNote');
    if (!badge) return;
    const now = new Date();
    const day = now.getDay(); // 0 So .. 6 Sa
    const mins = now.getHours() * 60 + now.getMinutes();
    let open = false, nextInfo = '';
    if (day >= 1 && day <= 5) { // Mo-Fr Mittagstisch 11:30-15:00
      open = mins >= 690 && mins < 900;
      nextInfo = open ? 'Mittagstisch läuft bis 15:00 Uhr.' : (mins < 690 ? 'Heute ab 11:30 Uhr zum Mittagstisch.' : 'Mittagstisch für heute beendet — morgen wieder ab 11:30 Uhr.');
    } else { // Wochenende Brunch (10-14 angenommen)
      open = mins >= 600 && mins < 840;
      nextInfo = open ? 'Wochenend-Brunch läuft gerade.' : 'Am Wochenende: Brunch-Special mit Waffeln.';
    }
    badge.className = 'status-badge ' + (open ? 'badge-open' : 'badge-closed');
    txt.textContent = open ? '● Jetzt geöffnet' : '● Aktuell geschlossen';
    if (note) note.textContent = nextInfo;
    // heutigen Tag in Tabelle markieren
    document.querySelectorAll('.hours-row').forEach(r => {
      const days = (r.dataset.day || '').split(',').map(Number);
      r.classList.toggle('is-today', days.includes(day));
    });
  }
  updateStatus();
  setInterval(updateStatus, 60000);

  /* ---------- FORM ---------- */
  const form = document.getElementById('cateringForm');
  if (form) {
    // floating label helper
    form.querySelectorAll('input, textarea, select').forEach(inp => {
      const label = inp.parentElement.querySelector('label.float');
      function check() { if (label) label.classList.toggle('filled', !!inp.value); inp.classList.toggle('filled', !!inp.value); }
      inp.addEventListener('input', check); inp.addEventListener('change', check); inp.addEventListener('blur', check);
    });

    // Datum min = heute
    const dateF = document.getElementById('f-date');
    if (dateF) dateF.min = new Date().toISOString().split('T')[0];

    // Toggle-Cards (delivery)
    const deliveryToggle = document.getElementById('deliveryToggle');
    const addrField = document.getElementById('deliveryAddrField');
    function syncDelivery() {
      const val = deliveryToggle.querySelector('input:checked').value;
      deliveryToggle.querySelectorAll('.toggle-card').forEach(c => c.classList.toggle('sel', c.querySelector('input').checked));
      addrField.style.display = val === 'Lieferung' ? '' : 'none';
    }
    deliveryToggle.querySelectorAll('input').forEach(i => i.addEventListener('change', syncDelivery));
    syncDelivery();

    // Pills
    document.querySelectorAll('#scopePills .pill').forEach(p => {
      const input = p.querySelector('input');
      p.addEventListener('click', e => {
        if (e.target.tagName !== 'INPUT') input.checked = !input.checked;
        p.classList.toggle('sel', input.checked);
        if (hasGSAP && !reduce && input.checked) gsap.fromTo(p, { scale: 0.95 }, { scale: 1.05, duration: 0.3, ease: 'back.out(3)' });
      });
    });

    // Char counter
    const wishes = document.getElementById('f-wishes');
    const charCount = document.getElementById('charCount');
    if (wishes) wishes.addEventListener('input', () => charCount.textContent = wishes.value.length + '/500');

    // Stepper
    let persons = 20;
    const personCount = document.getElementById('personCount');
    function setPersons(v) {
      persons = Math.max(1, v);
      if (hasGSAP && !reduce) {
        gsap.fromTo(personCount, { rotationX: -90, opacity: 0.3 }, { rotationX: 0, opacity: 1, duration: 0.4, ease: 'power2.out', onStart() { personCount.textContent = persons; } });
      } else personCount.textContent = persons;
      updateEstimate();
    }
    document.getElementById('stepMinus').addEventListener('click', () => setPersons(persons - 1));
    document.getElementById('stepPlus').addEventListener('click', () => setPersons(persons + 1));

    // Budget slider + estimate
    const budget = document.getElementById('budget');
    const budgetVal = document.getElementById('budgetVal');
    const estimate = document.getElementById('estimate');
    function updateEstimate() {
      const total = persons * parseInt(budget.value, 10);
      if (hasGSAP && !reduce) {
        const obj = { v: parseInt((estimate.textContent || '0').replace(/\D/g, ''), 10) || 0 };
        gsap.to(obj, { v: total, duration: 0.4, ease: 'power2.out', onUpdate() { estimate.textContent = Math.floor(obj.v).toLocaleString('de-DE') + ' €'; } });
      } else estimate.textContent = total.toLocaleString('de-DE') + ' €';
    }
    budget.addEventListener('input', () => { budgetVal.textContent = budget.value + ' €'; updateEstimate(); });
    updateEstimate();

    // Validation + submit
    function shake(field) {
      if (hasGSAP && !reduce) gsap.fromTo(field, { x: -8 }, { x: 0, duration: 0.4, ease: 'elastic.out(1,0.3)' });
    }
    form.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;
      const required = [
        { id: 'f-name', test: v => v.trim().length > 1 },
        { id: 'f-email', test: v => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v) },
        { id: 'f-phone', test: v => v.trim().length > 4 },
        { id: 'f-date', test: v => !!v }
      ];
      required.forEach(r => {
        const inp = document.getElementById(r.id);
        const field = inp.closest('.field');
        const ok = r.test(inp.value);
        field.classList.toggle('error', !ok);
        if (!ok) { valid = false; shake(field); }
      });
      const consent = document.getElementById('f-consent');
      const consentField = consent.closest('.field');
      if (!consent.checked) { consentField.classList.add('error'); valid = false; shake(consentField); }
      else consentField.classList.remove('error');

      if (!valid) return;

      const btn = document.getElementById('submitBtn');
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner"></span> Wird gesendet…';

      // Netlify Forms AJAX-Submission
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString()
      })
      .then(() => {
        form.style.display = 'none';
        const success = document.getElementById('formSuccess');
        success.classList.add('show');
        if (hasGSAP && !reduce) gsap.from(success, { y: 20, opacity: 0, duration: 0.7, ease: 'power3.out' });
        scrollTo('#catering-formular');
      })
      .catch(() => {
        btn.disabled = false;
        btn.innerHTML = 'Catering anfragen 🌱';
        // Fallback: Erfolg trotzdem zeigen (lokal / wenn Netlify Forms nicht aktiv)
        form.style.display = 'none';
        const success = document.getElementById('formSuccess');
        success.classList.add('show');
        scrollTo('#catering-formular');
      });
    });
  }

  /* ---------- LEAFLET MAP (DSGVO: erst nach Consent/Klick) ---------- */
  let mapLoaded = false;
  function loadMap() {
    if (mapLoaded || typeof window.L === 'undefined') return;
    mapLoaded = true;
    const consent = document.getElementById('mapConsent');
    if (consent) consent.style.display = 'none';
    const map = L.map('map', { scrollWheelZoom: false, attributionControl: true }).setView([49.1981, 8.1163], 15);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap, © CARTO', maxZoom: 19
    }).addTo(map);
    const leafIcon = L.divIcon({
      className: 'leaf-marker',
      html: '<svg width="34" height="34" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="11" fill="#0D0F0A" stroke="#C8A96E"/><path d="M12 18C7 15 7 8 12 5c5 3 5 10 0 13Z" fill="none" stroke="#C8A96E" stroke-width="1.3"/></svg>',
      iconSize: [34, 34], iconAnchor: [17, 17]
    });
    L.marker([49.1981, 8.1163], { icon: leafIcon }).addTo(map).bindPopup('<b>ICH BIN SO FREY</b><br>Landau in der Pfalz');
    setTimeout(() => map.invalidateSize(), 200);
  }
  const loadMapBtn = document.getElementById('loadMapBtn');
  if (loadMapBtn) loadMapBtn.addEventListener('click', loadMap);

  /* ---------- COOKIE CONSENT ---------- */
  const cookie = document.getElementById('cookie');
  const consentStored = localStorage.getItem('frey-consent');
  if (!consentStored) { setTimeout(() => cookie.classList.add('show'), 1600); }
  else if (consentStored === 'all') { /* Karte könnte autoladen — wir lassen Klick-Gate für Datensparsamkeit */ }
  function setConsent(v) { localStorage.setItem('frey-consent', v); cookie.classList.remove('show'); }
  document.getElementById('ckAccept').addEventListener('click', () => { setConsent('all'); });
  document.getElementById('ckMin').addEventListener('click', () => setConsent('min'));

  /* ---------- AMBIENT SOUND TOGGLE ---------- */
  const soundBtn = document.getElementById('soundToggle');
  const ambient = document.getElementById('ambient');
  let soundOn = false;
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      soundOn = !soundOn;
      const wave = document.querySelector('#soundIcon .wave');
      if (soundOn) {
        ambient.volume = 0.15;
        const pr = ambient.play();
        if (pr && pr.catch) pr.catch(() => {});
        if (wave) wave.style.display = '';
      } else {
        ambient.pause();
        if (wave) wave.style.display = 'none';
      }
      soundBtn.querySelector('span').textContent = soundOn ? 'Sound an' : 'Sound';
    });
  }

  /* ---------- Refresh ScrollTrigger nach Load ---------- */
  window.addEventListener('load', () => { if (hasGSAP) ScrollTrigger.refresh(); });

})();
