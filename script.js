/* ============================================================
   BAGAGE BURGER — Interactions
   ============================================================ */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Scroll progress + nav state ---------- */
  var nav = document.querySelector('.nav');
  var progress = document.getElementById('progress');
  function onScroll() {
    var st = window.scrollY || document.documentElement.scrollTop;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = (h > 0 ? (st / h) * 100 : 0) + '%';
    if (nav) nav.classList.toggle('solid', st > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var burger = document.querySelector('.burger-btn');
  var mobile = document.querySelector('.mobile-menu');
  var scrim = document.querySelector('.scrim');
  function setMenu(open) {
    if (!burger) return;
    burger.classList.toggle('open', open);
    mobile.classList.toggle('open', open);
    scrim.classList.toggle('show', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (burger) {
    burger.addEventListener('click', function () { setMenu(!mobile.classList.contains('open')); });
    scrim.addEventListener('click', function () { setMenu(false); });
    mobile.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  }

  /* ---------- Reveal on scroll ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        var el = e.target;
        var delay = parseInt(el.getAttribute('data-delay') || '0', 10);
        setTimeout(function () { el.classList.add('in'); }, reduce ? 0 : delay);
        io.unobserve(el);
      }
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal, .reveal-l, .reveal-r, .phil__card').forEach(function (el) { io.observe(el); });

  /* ---------- Menu tabs ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.menu__tab'));
  var panels = document.querySelectorAll('.menu__panel');
  var ink = document.querySelector('.menu__ink');
  function moveInk(tab) {
    if (!ink || !tab) return;
    ink.style.width = tab.offsetWidth + 'px';
    ink.style.transform = 'translateX(' + tab.offsetLeft + 'px)';
  }
  function activate(name, tab) {
    tabs.forEach(function (t) { t.classList.toggle('active', t === tab); });
    panels.forEach(function (p) { p.classList.toggle('active', p.getAttribute('data-panel') === name); });
    moveInk(tab);
    // re-run reveal for newly shown rows
    var active = document.querySelector('.menu__panel.active');
    if (active) active.querySelectorAll('.reveal, .reveal-l, .reveal-r').forEach(function (el) { el.classList.add('in'); });
    showToast(name);
  }
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () { activate(tab.getAttribute('data-tab'), tab); });
  });
  // init
  var first = tabs.find ? tabs.find(function (t) { return t.classList.contains('active'); }) : tabs.filter(function(t){return t.classList.contains('active');})[0];
  if (!first) first = tabs[0];
  if (first) { requestAnimationFrame(function(){ moveInk(first); }); }
  window.addEventListener('resize', function () {
    var act = document.querySelector('.menu__tab.active');
    moveInk(act);
  });

  /* ---------- Toast on tab change ---------- */
  var toast;
  var toastTimer;
  function showToast(text) {
    if (reduce) return;
    if (!toast) {
      toast = document.createElement('div');
      toast.style.cssText = 'position:fixed;left:50%;bottom:30px;transform:translate(-50%,20px);z-index:9500;background:#16140f;border:1px solid #34302a;color:#f5f0e8;font-family:"Space Mono",monospace;font-size:12px;letter-spacing:.18em;text-transform:uppercase;padding:11px 22px;opacity:0;transition:opacity .3s,transform .3s;pointer-events:none;';
      document.body.appendChild(toast);
    }
    toast.textContent = text;
    requestAnimationFrame(function () { toast.style.opacity = '1'; toast.style.transform = 'translate(-50%,0)'; });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.style.opacity = '0'; toast.style.transform = 'translate(-50%,20px)'; }, 1100);
  }

  /* ---------- Open / closed badge (live) ---------- */
  // Mo-Sa 11:30-22:00 ; So 17:00-22:00
  function isOpen(d) {
    var day = d.getDay(); // 0 Sun .. 6 Sat
    var mins = d.getHours() * 60 + d.getMinutes();
    if (day === 0) return mins >= 17 * 60 && mins < 22 * 60;
    return mins >= 11 * 60 + 30 && mins < 22 * 60;
  }
  function refreshBadges() {
    var open = isOpen(new Date());
    document.querySelectorAll('[data-openbadge]').forEach(function (b) {
      b.classList.toggle('open', open);
      b.classList.toggle('closed', !open);
      var t = b.querySelector('.txt');
      if (t) t.textContent = open ? 'Jetzt geöffnet' : 'Jetzt geschlossen';
    });
  }
  refreshBadges();
  setInterval(refreshBadges, 30000);

  // highlight today's hours row
  (function () {
    var day = new Date().getDay();
    var rowSel = (day === 0) ? '[data-hours="so"]' : '[data-hours="mosa"]';
    var row = document.querySelector(rowSel);
    if (row) row.classList.add('now');
  })();

  /* ---------- Custom cursor ---------- */
  if (!reduce && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var dot = document.querySelector('.cursor-dot');
    var ring = document.querySelector('.cursor-ring');
    if (dot && ring) {
      var mx = window.innerWidth / 2, my = window.innerHeight / 2;
      var rx = mx, ry = my;
      window.addEventListener('mousemove', function (e) {
        mx = e.clientX; my = e.clientY;
        dot.style.left = mx + 'px'; dot.style.top = my + 'px';
      });
      (function loop() {
        rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
        ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
        requestAnimationFrame(loop);
      })();
      document.querySelectorAll('a, button, .mrow, .phil__card').forEach(function (el) {
        el.addEventListener('mouseenter', function () { ring.classList.add('hot'); });
        el.addEventListener('mouseleave', function () { ring.classList.remove('hot'); });
      });
    }
  }

  /* ---------- Hero parallax (desktop) ---------- */
  if (!reduce && window.matchMedia('(hover: hover) and (min-width: 900px)').matches) {
    var hero = document.querySelector('.hero');
    var heroBg = document.querySelector('.hero__bg');
    var emblem = document.querySelector('.hero__emblem');
    if (hero && heroBg) {
      hero.addEventListener('mousemove', function (e) {
        var cx = (e.clientX / window.innerWidth - 0.5);
        var cy = (e.clientY / window.innerHeight - 0.5);
        heroBg.style.transform = 'translate3d(' + (-cx * 26) + 'px,' + (-cy * 26) + 'px,0)';
        if (emblem) emblem.style.transform = 'translateY(-50%) translate3d(' + (cx * 30) + 'px,' + (cy * 30) + 'px,0)';
      });
    }
  }

  /* ---------- Smooth anchor offset for sticky nav ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (ev) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      ev.preventDefault();
      var y = target.getBoundingClientRect().top + window.scrollY - 64;
      window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
    });
  });
})();
