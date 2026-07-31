/* ============================================================
   District Null41 — Interaktion
   Header-Zustand, Reveals, Mobile-Navigation, Karten-Tabs,
   Live-Öffnungsstatus.
   ============================================================ */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------------------------------------------------------
     Hero: Einblendung starten, sobald das Layout steht
     --------------------------------------------------------- */
  var hero = $('.hero');
  if (hero) requestAnimationFrame(function () { hero.classList.add('is-ready'); });

  /* ---------------------------------------------------------
     Header: Hintergrund ab dem ersten Scroll, Lesefortschritt
     --------------------------------------------------------- */
  var header   = $('#header');
  var progress = $('#progress');
  var sticky   = $('#sticky-call');
  var ticking  = false;

  /* Header-Höhe an CSS geben — davon hängen Sprungmarken und
     die klebende Karten-Navigation ab */
  function measureHeader() {
    if (!header) return;
    document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px');
  }
  measureHeader();
  window.addEventListener('resize', measureHeader);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measureHeader);

  function onScroll() {
    var y = window.pageYOffset;

    if (header) {
      var stuck = y > 24 || !hero;
      if (stuck !== header.classList.contains('is-stuck')) {
        header.classList.toggle('is-stuck', stuck);
        measureHeader();
      }
    }

    if (progress) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = 'scaleX(' + (max > 0 ? Math.min(y / max, 1) : 0) + ')';
    }

    /* Anruf-Leiste erst zeigen, wenn der Hero durch ist */
    if (sticky && hero) sticky.classList.toggle('is-visible', y > window.innerHeight * 0.75);

    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* ---------------------------------------------------------
     Reveals beim Hereinscrollen
     --------------------------------------------------------- */
  var revealables = $$('[data-reveal]');
  if (reduced || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
    revealables.forEach(function (el) { io.observe(el); });
  }

  /* ---------------------------------------------------------
     Mobile Navigation
     --------------------------------------------------------- */
  var toggle = $('#nav-toggle');
  var mnav   = $('#mobile-nav');

  function setNav(open) {
    if (!toggle || !mnav) return;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
    document.body.classList.toggle('nav-open', open);
    if (open) {
      mnav.hidden = false;
      requestAnimationFrame(function () { mnav.classList.add('is-open'); });
    } else {
      mnav.classList.remove('is-open');
      window.setTimeout(function () { if (!mnav.classList.contains('is-open')) mnav.hidden = true; }, 600);
    }
  }

  if (toggle && mnav) {
    toggle.addEventListener('click', function () {
      setNav(toggle.getAttribute('aria-expanded') !== 'true');
    });
    $$('a', mnav).forEach(function (a) { a.addEventListener('click', function () { setNav(false); }); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') setNav(false);
    });
  }

  /* ---------------------------------------------------------
     Karten-Tabs (Speisekarte)
     --------------------------------------------------------- */
  var tabs = $$('.tab[role="tab"]');

  if (tabs.length) {
    var keyOf = function (tab) { return tab.id.replace('tab-', ''); };

    var select = function (tab, focus, updateHash) {
      tabs.forEach(function (t) {
        var panel  = document.getElementById(t.getAttribute('aria-controls'));
        var active = t === tab;
        t.setAttribute('aria-selected', String(active));
        t.tabIndex = active ? 0 : -1;
        if (panel) panel.hidden = !active;
      });
      if (focus) tab.focus();
      if (updateHash && history.replaceState) history.replaceState(null, '', '#' + keyOf(tab));
      /* frisch eingeblendete Inhalte müssen ihre Reveals nachholen */
      $$('[data-reveal]', document.getElementById(tab.getAttribute('aria-controls')) || document)
        .forEach(function (el) { el.classList.add('is-in'); });
    };

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () { select(tab, false, true); });
    });

    var tablist = $('.menu-nav .wrap[role="tablist"]');
    if (tablist) {
      tablist.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        var i = tabs.indexOf(document.activeElement);
        if (i === -1) return;
        e.preventDefault();
        select(tabs[e.key === 'ArrowRight' ? (i + 1) % tabs.length : (i - 1 + tabs.length) % tabs.length], true, true);
      });
    }

    /* #sushi, #drinks … direkt anspringen — auch von der Startseite aus */
    var fromHash = function (scroll) {
      var key = (location.hash || '').replace('#', '');
      var tab = key && document.getElementById('tab-' + key);
      if (!tab) return;
      select(tab, false, false);
      if (scroll) {
        var nav = $('.menu-nav');
        if (nav) window.scrollTo({
          top: nav.offsetTop - (header ? header.offsetHeight : 0),
          behavior: reduced ? 'auto' : 'smooth'
        });
      }
    };
    fromHash(false);
    window.addEventListener('hashchange', function () { fromHash(true); });
  }

  /* ---------------------------------------------------------
     Öffnungsstatus — 0 = Montag … 6 = Sonntag, null = Ruhetag
     --------------------------------------------------------- */
  var badge = $('#open-status');
  if (badge) {
    var hours = [
      [[11.5, 15], [17, 22]],
      null,
      [[11.5, 15], [17, 22]],
      [[11.5, 15], [17, 22]],
      [[11.5, 22]],
      [[11.5, 22]],
      [[11.5, 22]]
    ];

    var update = function () {
      var now    = new Date();
      var day    = (now.getDay() + 6) % 7;
      var t      = now.getHours() + now.getMinutes() / 60;
      var todays = hours[day];
      var open   = !!todays && todays.some(function (w) { return t >= w[0] && t < w[1]; });

      badge.textContent = todays ? (open ? 'Jetzt geöffnet' : 'Aktuell geschlossen') : 'Heute Ruhetag';
      badge.classList.toggle('is-open', open);
      badge.classList.toggle('is-closed', !open);

      $$('.hrow').forEach(function (row) {
        row.classList.toggle('is-today', Number(row.getAttribute('data-day')) === day);
      });
    };

    update();
    window.setInterval(update, 60000);
  }
})();
