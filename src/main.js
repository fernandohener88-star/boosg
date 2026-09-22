// Self-hosted fonts
import '@fontsource/cormorant-garamond/300.css';
import '@fontsource/cormorant-garamond/300-italic.css';
import '@fontsource/cormorant-garamond/400.css';
import '@fontsource/cormorant-garamond/400-italic.css';
import '@fontsource/dm-sans/300.css';
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initScroll, glowReveal, dur, ease } from './motion.js';
import { site, reviews, giftCardAmounts, seasons } from './data/site.js';

gsap.registerPlugin(ScrollTrigger);

// ── Boot ─────────────────────────────────────────────────────────
async function boot() {
  // Dynamic copyright year
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = `© ${new Date().getFullYear()} ACCENT aesthetic studio`;

  // Eroeffnung zuerst – vor dem Nachladen von Lenis, damit zwischen
  // Aufbau und Ablauf der Zeitleiste keine Ladezeit liegt.
  playIntro();

  // Smooth scroll + Lenis
  await initScroll();

  initHeader();
  initCursor();
  initReveals();
  initGlowReveals();
  initCounters();
  initNav();
  initWizard();
  initTestimonials();
  initGiftCard();
  initActiveNav();
  initActionBar();
  initPitch();

  // Deep link: #termin in URL opens wizard on load
  if (window.location.hash === '#termin') openWizard();

  // Query param: ?behandlung=manikuere pre-selects treatment
  const params = new URLSearchParams(window.location.search);
  const preSelect = params.get('behandlung');
  if (preSelect) preSelectTreatment(preSelect);
}

// ── Header hide/show on scroll ────────────────────────────────────
function initHeader() {
  const h = document.getElementById('site-header');
  if (!h) return;
  let lastY = 0;
  let ticking = false;

  const update = () => {
    const y = window.scrollY;
    if (y > 80) {
      h.classList.add('glass');
    } else {
      h.classList.remove('glass');
    }
    if (y > 300) {
      if (y > lastY + 4) {
        h.classList.add('hidden');
      } else if (y < lastY - 4) {
        h.classList.remove('hidden');
      }
    } else {
      h.classList.remove('hidden');
    }
    lastY = y;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
}

// ── Custom cursor ─────────────────────────────────────────────────
function initCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const dot = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  document.body.style.cursor = 'none';
  let tx = -100, ty = -100, rx = -100, ry = -100;

  window.addEventListener('mousemove', (e) => { tx = e.clientX; ty = e.clientY; });

  let isHover = false;
  const setHover = (v) => {
    isHover = v;
    ring.style.width = v ? '56px' : '36px';
    ring.style.height = v ? '56px' : '36px';
    ring.style.borderColor = v ? 'rgba(201,169,110,.7)' : 'rgba(201,169,110,.4)';
  };

  document.querySelectorAll('a, button, [data-cursor]').forEach((el) => {
    el.addEventListener('mouseenter', () => setHover(true));
    el.addEventListener('mouseleave', () => setHover(false));
  });

  const loop = () => {
    rx += (tx - rx) * 0.12;
    ry += (ty - ry) * 0.12;
    dot.style.left = tx + 'px';
    dot.style.top = ty + 'px';
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(loop);
  };
  loop();
}

// ── Scroll reveals ────────────────────────────────────────────────
function initReveals() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;

  if (prefersReduced || !('IntersectionObserver' in window)) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });

  els.forEach((el) => {
    el.classList.add('reveal');
    io.observe(el);
  });
}

// ── Glow-reveal images ────────────────────────────────────────────
function initGlowReveals() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wraps = document.querySelectorAll('[data-glow-reveal]');
  if (!wraps.length) return;

  if (prefersReduced || !('IntersectionObserver' in window)) {
    wraps.forEach((w) => {
      gsap.set(w, { clipPath: 'inset(0 0 0 0)' });
    });
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const wrap = entry.target;
      const img = wrap.querySelector('img');
      if (img) glowReveal(wrap, img);
      io.unobserve(wrap);
    });
  }, { threshold: 0.08 });

  // Set initial hidden state right before observing (fail-safe: images visible if JS never runs)
  wraps.forEach((w) => {
    w.style.clipPath = 'inset(100% 0 0 0)';
    io.observe(w);
  });
}

// ── Animated counters ─────────────────────────────────────────────
function initCounters() {
  const els = document.querySelectorAll('[data-count]');
  if (!els.length || !('IntersectionObserver' in window)) return;

  const animate = (el) => {
    const end = parseFloat(el.dataset.count);
    const dec = parseInt(el.dataset.dec || '0', 10);
    const start = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - start) / 1400);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (end * eased).toFixed(dec).replace('.', ',');
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { animate(e.target); io.unobserve(e.target); }
    });
  }, { threshold: 0.5 });

  els.forEach((el) => io.observe(el));
}

// ── Mobile nav / hamburger ────────────────────────────────────────
function initNav() {
  const btn = document.getElementById('hamburger');
  const nav = document.getElementById('mobile-nav');
  if (!btn || !nav) return;

  const open = () => {
    btn.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    nav.classList.add('open');
    nav.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    nav.classList.remove('open');
    nav.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  btn.addEventListener('click', () => btn.classList.contains('open') ? close() : open());
  nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
}

// ── Active nav highlight ──────────────────────────────────────────
function initActiveNav() {
  const sections = ['studio', 'leistungen', 'galerie', 'kontakt'];
  const links = document.querySelectorAll('.nav-link');

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const id = entry.target.id;
      const link = [...links].find((l) => l.getAttribute('href') === `#${id}`);
      if (link) link.classList.toggle('active', entry.isIntersecting);
    });
  }, { threshold: 0.5 });

  sections.forEach((id) => {
    const el = document.getElementById(id);
    if (el) io.observe(el);
  });
}

// ── Testimonials carousel ─────────────────────────────────────────
function initTestimonials() {
  const textEl = document.getElementById('quote-text');
  const authorEl = document.getElementById('quote-author');
  const dots = document.querySelectorAll('.qdot');
  if (!textEl || !authorEl || !dots.length) return;

  const show = (i) => {
    const r = reviews[i];
    if (!r) return;
    textEl.textContent = `„${r.text}"`;
    authorEl.textContent = r.badge ? `${r.author} · ${r.badge}` : r.author;
    dots.forEach((d, j) => {
      d.classList.toggle('active', j === i);
      d.setAttribute('aria-selected', j === i ? 'true' : 'false');
    });
  };

  dots.forEach((d) => {
    d.addEventListener('click', () => show(parseInt(d.dataset.q, 10)));
  });

  // Auto-rotate
  let idx = 0;
  setInterval(() => {
    idx = (idx + 1) % reviews.length;
    show(idx);
  }, 6000);
}

// ── Gift card configurator ────────────────────────────────────────
function initGiftCard() {
  const scene = document.getElementById('gift-card-scene');
  const amtDisplay = document.getElementById('gift-display-amt');
  const amtBtns = document.querySelectorAll('.gift-amt-btn');
  const requestBtn = document.getElementById('gift-request-btn');
  const seasonHint = document.getElementById('season-hint');

  let selectedAmt = 50;

  // Season hint
  if (seasonHint) {
    const now = new Date();
    const m = now.getMonth() + 1;
    const d = now.getDate();
    let hint = '';
    if (m === 11 || m === 12) hint = seasons.christmas.label;
    else if (m === 2 && d <= 14) hint = seasons.valentines.label;
    else if (m === 5) hint = seasons.mothersDay.label;
    if (hint) { seasonHint.textContent = hint; seasonHint.classList.add('visible'); }
  }

  amtBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      selectedAmt = parseInt(btn.dataset.amt, 10);
      amtBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      if (amtDisplay) amtDisplay.innerHTML = `${selectedAmt}&nbsp;€`;
    });
  });

  // 3D tilt on mouse
  if (scene) {
    scene.addEventListener('mousemove', (e) => {
      const rect = scene.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const rotY = ((e.clientX - cx) / (rect.width / 2)) * 10;
      const rotX = -((e.clientY - cy) / (rect.height / 2)) * 6;
      scene.querySelector('.gift-card-inner').style.transform =
        `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });
    scene.addEventListener('mouseleave', () => {
      scene.querySelector('.gift-card-inner').style.transform = '';
    });
    scene.addEventListener('click', () => scene.classList.toggle('flipped'));
  }

  // WhatsApp request
  if (requestBtn) {
    requestBtn.addEventListener('click', () => {
      const text = [
        'Hallo ACCENT-Team,',
        `ich möchte gerne einen Gutschein über ${selectedAmt} € anfragen.`,
        'Bitte melden Sie sich bei mir.',
      ].join('\n');
      window.open(`https://wa.me/4917680540425?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
    });
  }
}

// ── Termin Wizard ─────────────────────────────────────────────────
let wizardStep = 0;
const wizardData = { services: [], days: [], daytime: '', name: '', phone: '', note: '', firstVisit: false };

function openWizard(preService) {
  const overlay = document.getElementById('termin');
  const drawer = document.getElementById('wizard-drawer');
  if (!overlay || !drawer) return;
  overlay.classList.add('open');
  drawer.classList.add('open');
  document.body.style.overflow = 'hidden';
  drawer.focus();
  renderDayChips();
  if (preService) preSelectTreatment(preService);
  // Update URL without navigation
  history.pushState(null, '', '#termin');
}

function closeWizard() {
  const overlay = document.getElementById('termin');
  const drawer = document.getElementById('wizard-drawer');
  if (!overlay || !drawer) return;
  overlay.classList.remove('open');
  drawer.classList.remove('open');
  document.body.style.overflow = '';
  history.pushState(null, '', window.location.pathname + window.location.search);
}

function renderDayChips() {
  const container = document.getElementById('day-chips');
  if (!container) return;
  container.innerHTML = '';
  const dayNames = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
  const monthNames = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
  const now = new Date();
  for (let i = 1; i <= 14; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    const label = `${dayNames[d.getDay()]}, ${d.getDate()}. ${monthNames[d.getMonth()]}`;
    const btn = document.createElement('button');
    btn.className = 'day-chip';
    btn.dataset.day = label;
    btn.innerHTML = `${dayNames[d.getDay()]}<small>${d.getDate()}. ${monthNames[d.getMonth()]}</small>`;
    btn.addEventListener('click', () => {
      btn.classList.toggle('selected');
      const idx = wizardData.days.indexOf(label);
      if (idx >= 0) wizardData.days.splice(idx, 1);
      else wizardData.days.push(label);
    });
    container.appendChild(btn);
  }
}

function preSelectTreatment(key) {
  const map = { manikuere: 'Maniküre', pediküre: 'Pediküre', gesicht: 'Gesichtsbehandlung', augenbrauen: 'Augenbrauen', nageldesign: 'Nagel-Design' };
  const name = map[key.toLowerCase()] || key;
  const chip = [...document.querySelectorAll('.chip[data-service]')].find((c) => c.dataset.service === name);
  if (chip) {
    chip.classList.add('selected');
    if (!wizardData.services.includes(name)) wizardData.services.push(name);
  }
}

function setWizardStep(n) {
  document.querySelectorAll('.wizard-step').forEach((s, i) => s.classList.toggle('active', i === n));
  document.querySelectorAll('.wizard-step-dot').forEach((d, i) => {
    d.classList.toggle('done', i < n);
    d.classList.toggle('current', i === n);
  });
  const back = document.getElementById('wizard-back');
  const next = document.getElementById('wizard-next');
  if (back) back.disabled = n === 0;
  if (next) {
    next.textContent = n === 3 ? 'Schließen' : 'Weiter';
    next.style.display = n === 3 ? 'none' : '';
  }
  if (n === 3) buildSummary();
  wizardStep = n;

  // Announce step change for screen readers
  const body = document.getElementById('wizard-body');
  if (body) body.setAttribute('aria-live', 'polite');
}

function buildSummary() {
  const el = document.getElementById('wizard-summary');
  const waLink = document.getElementById('wizard-wa');
  if (!el) return;
  const lines = [
    'Hallo ACCENT-Team,',
    'ich möchte gerne einen Termin anfragen:',
    wizardData.services.length ? `• Behandlung: ${wizardData.services.join(', ')}` : '',
    wizardData.days.length ? `• Wunschtag: ${wizardData.days.join(' oder ')}${wizardData.daytime ? `, ${wizardData.daytime}` : ''}` : '',
    wizardData.name ? `• Name: ${wizardData.name}` : '',
    wizardData.phone ? `• Telefon: ${wizardData.phone}` : '',
    wizardData.note ? `• Nachricht: ${wizardData.note}` : '',
    wizardData.firstVisit ? 'Ich bin zum ersten Mal bei Ihnen.' : '',
  ].filter(Boolean);
  el.textContent = lines.join('\n');
  if (waLink) {
    waLink.href = `https://wa.me/4917680540425?text=${encodeURIComponent(lines.join('\n'))}`;
  }
}

function validateStep(n) {
  if (n === 2) {
    let ok = true;
    const name = document.getElementById('wz-name');
    const phone = document.getElementById('wz-phone');
    const fName = document.getElementById('field-name');
    const fPhone = document.getElementById('field-phone');
    if (!name?.value.trim()) { fName?.classList.add('has-error'); ok = false; }
    else fName?.classList.remove('has-error');
    if (!phone?.value.trim()) { fPhone?.classList.add('has-error'); ok = false; }
    else fPhone?.classList.remove('has-error');
    if (ok) {
      wizardData.name = name.value.trim();
      wizardData.phone = phone.value.trim();
      wizardData.note = document.getElementById('wz-note')?.value.trim() || '';
      wizardData.firstVisit = document.getElementById('wz-first')?.checked || false;
    }
    return ok;
  }
  return true;
}

function initWizard() {
  // Chip selection
  document.querySelectorAll('.chip[data-service]').forEach((chip) => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('selected');
      const s = chip.dataset.service;
      const idx = wizardData.services.indexOf(s);
      if (idx >= 0) wizardData.services.splice(idx, 1);
      else wizardData.services.push(s);
    });
  });
  document.querySelectorAll('.chip[data-time]').forEach((chip) => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.chip[data-time]').forEach((c) => c.classList.remove('selected'));
      chip.classList.add('selected');
      wizardData.daytime = chip.dataset.time;
    });
  });

  // Next
  document.getElementById('wizard-next')?.addEventListener('click', () => {
    if (wizardStep === 3) { closeWizard(); return; }
    if (!validateStep(wizardStep)) return;
    setWizardStep(wizardStep + 1);
  });

  // Back
  document.getElementById('wizard-back')?.addEventListener('click', () => {
    if (wizardStep > 0) setWizardStep(wizardStep - 1);
  });

  // Close
  document.getElementById('wizard-close')?.addEventListener('click', closeWizard);
  document.getElementById('termin')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeWizard();
  });

  // Keyboard trap
  document.getElementById('wizard-drawer')?.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeWizard();
  });

  // Open triggers
  document.querySelectorAll('[href="#termin"], [data-open-wizard]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      openWizard(el.dataset.openWizard);
    });
  });

  // Mobile action bar termin btn
  document.getElementById('ab-termin-btn')?.addEventListener('click', () => openWizard());
}

// ── Action bar (hide near footer) ────────────────────────────────
function initActionBar() {
  const bar = document.getElementById('action-bar');
  if (!bar) return;
  const footer = document.querySelector('footer');
  if (!footer) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => bar.classList.toggle('bar-hidden', e.isIntersecting));
  }, { threshold: 0.1 });
  io.observe(footer);
}

// ── Pitch mode ────────────────────────────────────────────────────
function initPitch() {
  const params = new URLSearchParams(window.location.search);
  if (!params.has('pitch')) return;
  document.body.classList.add('pitch');
  sessionStorage.setItem('pitch', '1');

  // Lazy-load pitch module
  import('./pitch.js').then((m) => m.initPitch?.()).catch(() => {});
}

// ── Card tilt ─────────────────────────────────────────────────────
document.querySelectorAll('.card').forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
    card.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
  });
});

// ── Three.js serum droplet (Phase 3) – lazy loaded ───────────────
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const requestIdleCallback = window.requestIdleCallback || ((cb) => setTimeout(cb, 100));
  requestIdleCallback(() => {
    import('./droplet.js').catch(() => {});
  });
}

boot();


// ── Eroeffnung beim Laden ─────────────────────────────────────────
// Ablauf und Zeitpunkte stecken vollstaendig im CSS (siehe index.html).
// Das ist bewusst so: Eine Zeitleiste im Skript wuerde die beim Laden
// vergangene Zeit nachholen und waere sofort vorbei. Hier bleibt nur
// das Ueberspringen per Klick.
function playIntro() {
  const intro = document.getElementById('intro');
  if (!intro || !document.documentElement.classList.contains('intro-active')) return;
  intro.addEventListener('click', () => {
    document.documentElement.classList.remove('intro-active');
    intro.remove();
  });
}
