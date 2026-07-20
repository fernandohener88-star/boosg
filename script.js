/* District Null41 — Tabs, Öffnungsstatus, Two-Click-Map */
(function () {
  'use strict';

  /* ---------- Menü-Tabs ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab[role="tab"]'));

  function selectTab(tab) {
    tabs.forEach(function (t) {
      var panel = document.getElementById(t.getAttribute('aria-controls'));
      var active = t === tab;
      t.setAttribute('aria-selected', active ? 'true' : 'false');
      if (panel) {
        panel.hidden = !active;
        if (active) {
          /* Fade-up-Animation bei jedem Wechsel neu anstoßen */
          panel.style.animation = 'none';
          void panel.offsetWidth;
          panel.style.animation = '';
        }
      }
    });
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () { selectTab(tab); });
  });

  /* Pfeiltasten-Navigation in der Tab-Leiste */
  var tablist = document.querySelector('.tabs[role="tablist"]');
  if (tablist) {
    tablist.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      var i = tabs.indexOf(document.activeElement);
      if (i === -1) return;
      var next = e.key === 'ArrowRight' ? (i + 1) % tabs.length : (i - 1 + tabs.length) % tabs.length;
      tabs[next].focus();
      selectTab(tabs[next]);
      e.preventDefault();
    });
  }

  /* "Zur ganzen Getränkekarte" öffnet den Drinks-Tab */
  document.querySelectorAll('[data-goto-tab]').forEach(function (link) {
    link.addEventListener('click', function () {
      var tab = document.getElementById('tab-' + link.getAttribute('data-goto-tab'));
      if (tab) selectTab(tab);
    });
  });

  /* ---------- Öffnungsstatus ---------- */
  /* 0 = Montag … 6 = Sonntag; null = Ruhetag */
  var hours = [
    [[11.5, 15], [17, 22]],
    null,
    [[11.5, 15], [17, 22]],
    [[11.5, 15], [17, 22]],
    [[11.5, 22]],
    [[11.5, 22]],
    [[11.5, 22]]
  ];

  function updateStatus() {
    var now = new Date();
    var day = (now.getDay() + 6) % 7;
    var t = now.getHours() + now.getMinutes() / 60;
    var todays = hours[day];
    var open = !!todays && todays.some(function (w) { return t >= w[0] && t < w[1]; });

    var badge = document.getElementById('open-status');
    if (badge) {
      badge.textContent = todays ? (open ? 'Jetzt geöffnet' : 'Aktuell geschlossen') : 'Heute Ruhetag';
      badge.classList.toggle('open', open);
      badge.classList.toggle('closed', !open);
    }
    document.querySelectorAll('.hrow').forEach(function (row) {
      row.classList.toggle('today', Number(row.getAttribute('data-day')) === day);
    });
  }
  updateStatus();
  setInterval(updateStatus, 60 * 1000);

  /* ---------- Two-Click Google Maps (DSGVO) ---------- */
  var mapBtn = document.getElementById('btn-load-map');
  if (mapBtn) {
    mapBtn.addEventListener('click', function () {
      var box = document.getElementById('map-consent');
      var wrap = document.createElement('div');
      wrap.className = 'map-frame';
      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.google.com/maps?q=' +
        encodeURIComponent('District Null41, Georg-Friedrich-Dentzel-Straße 11, 76829 Landau in der Pfalz') +
        '&output=embed';
      iframe.title = 'Karte: District Null41, Georg-Friedrich-Dentzel-Straße 11, 76829 Landau';
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      wrap.appendChild(iframe);
      box.replaceWith(wrap);
    });
  }
})();
