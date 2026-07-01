(function () {
  /* ===== Loader ===== */
  var loader = document.getElementById('loader');
  if (loader) { setTimeout(function () { loader.classList.add('is-hidden'); }, 1400); }

  /* ===== Cookie banner ===== */
  var cookieBanner = document.getElementById('cookie-banner');
  function cookieStored() {
    try { return localStorage.getItem('alamea_cookie'); } catch (e) { return null; }
  }
  function storeCookie(kind) {
    try { localStorage.setItem('alamea_cookie', kind); } catch (e) {}
  }
  if (cookieBanner) {
    if (!cookieStored()) {
      setTimeout(function () { cookieBanner.hidden = false; }, 1800);
    }
    var acceptAll = document.getElementById('cookie-accept-all');
    var acceptEssential = document.getElementById('cookie-accept-essential');
    if (acceptAll) {
      acceptAll.addEventListener('click', function () { storeCookie('all'); cookieBanner.hidden = true; });
    }
    if (acceptEssential) {
      acceptEssential.addEventListener('click', function () { storeCookie('essential'); cookieBanner.hidden = true; });
    }
  }

  /* ===== Starfield canvas ===== */
  var canvas = document.getElementById('alamea-stars');
  if (canvas) {
    var ctx = canvas.getContext('2d');
    var w, h, stars = [];
    var DPR = Math.min(window.devicePixelRatio || 1, 2);
    var mx = 0, my = 0;

    function resize() {
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * DPR; canvas.height = h * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      var count = Math.floor((w * h) / 6500);
      stars = [];
      for (var i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * w, y: Math.random() * h,
          r: Math.random() * 1.4 + 0.3,
          depth: Math.random() * 0.6 + 0.2,
          tw: Math.random() * Math.PI * 2,
          sp: Math.random() * 0.02 + 0.005,
          gold: Math.random() > 0.82
        });
      }
    }
    window.addEventListener('resize', resize);
    resize();

    window.addEventListener('mousemove', function (e) {
      mx = (e.clientX / w - 0.5); my = (e.clientY / h - 0.5);
    });

    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        s.tw += s.sp;
        var a = 0.35 + Math.sin(s.tw) * 0.4;
        var ox = mx * s.depth * 34, oy = my * s.depth * 34;
        ctx.beginPath();
        ctx.arc(s.x + ox, s.y + oy, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.gold
          ? 'rgba(232,199,126,' + Math.max(0, a) + ')'
          : 'rgba(244,239,230,' + Math.max(0, a * 0.85) + ')';
        ctx.fill();
      }
      requestAnimationFrame(draw);
    }
    draw();
  }

  /* ===== Scroll reveal ===== */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ===== Booking form ===== */
  var bookingForm = document.getElementById('booking-form');
  var bookingSuccess = document.getElementById('booking-success');
  if (bookingForm && bookingSuccess) {
    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(bookingForm)).toString()
      }).catch(function () {});
      bookingForm.hidden = true;
      bookingSuccess.hidden = false;
    });
  }

  /* ===== Newsletter form ===== */
  var newsletterForm = document.getElementById('newsletter-form');
  var newsletterSuccess = document.getElementById('newsletter-success');
  if (newsletterForm && newsletterSuccess) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(newsletterForm)).toString()
      }).catch(function () {});
      newsletterForm.hidden = true;
      newsletterSuccess.hidden = false;
    });
  }

  /* ===== Legal modal ===== */
  var legalOverlay = document.getElementById('legal-overlay');
  if (legalOverlay) {
    var legalModal = legalOverlay.querySelector('.legal-modal');
    var legalTitleEl = document.getElementById('legal-title');
    var legalBodyEl = document.getElementById('legal-body');

    var legalContent = {
      impressum: {
        title: 'Impressum',
        body:
          '<p>Angaben gemäß § 5 DDG (Digitale-Dienste-Gesetz)</p>' +
          '<p><strong>Alamea – Haus der Elemente</strong><br>' +
          'Inhaberin: Jutta Smyth<br>' +
          'Martin-Luther-Straße 15<br>' +
          '76829 Landau in der Pfalz</p>' +
          '<p>Telefon: <a href="tel:+496341703543">06341 703543</a></p>' +
          '<p><strong>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV:</strong><br>' +
          'Jutta Smyth, Anschrift wie oben</p>' +
          '<p><strong>EU-Streitschlichtung:</strong> Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit. Wir sind nicht verpflichtet und nicht bereit, an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>' +
          '<p class="footnote">Platzhalter-Entwurf – vor Veröffentlichung rechtlich prüfen lassen.</p>'
      },
      datenschutz: {
        title: 'Datenschutzerklärung',
        body:
          '<p><strong>1. Verantwortliche Stelle</strong><br>' +
          'Jutta Smyth, Alamea – Haus der Elemente, Martin-Luther-Straße 15, 76829 Landau in der Pfalz, Telefon 06341 703543.</p>' +
          '<p><strong>2. Erhebung und Verarbeitung</strong><br>' +
          'Wenn Sie über das Terminformular oder den Newsletter Kontakt aufnehmen, verarbeiten wir die von Ihnen angegebenen Daten (Name, Kontaktdaten, Terminwunsch) ausschließlich zur Bearbeitung Ihrer Anfrage. Rechtsgrundlage ist Art. 6 Abs. 1 lit. a und b DSGVO.</p>' +
          '<p><strong>3. Cookies</strong><br>' +
          'Wir setzen technisch notwendige Cookies. Optionale Statistik-Cookies werden nur mit Ihrer ausdrücklichen Einwilligung über das Cookie-Banner gesetzt. Sie können Ihre Einwilligung jederzeit widerrufen.</p>' +
          '<p><strong>4. Ihre Rechte</strong><br>' +
          'Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit sowie Widerspruch. Zudem besteht ein Beschwerderecht bei der zuständigen Aufsichtsbehörde.</p>' +
          '<p><strong>5. Speicherdauer</strong><br>' +
          'Ihre Daten werden gelöscht, sobald sie für den Zweck der Verarbeitung nicht mehr erforderlich sind und keine gesetzlichen Aufbewahrungsfristen entgegenstehen.</p>' +
          '<p class="footnote">Platzhalter-Entwurf – vor Veröffentlichung durch eine fachkundige Stelle finalisieren lassen.</p>'
      }
    };

    function openLegal(kind) {
      var data = legalContent[kind];
      if (!data) return;
      legalTitleEl.textContent = data.title;
      legalBodyEl.innerHTML = data.body;
      legalOverlay.hidden = false;
      if (cookieBanner) { cookieBanner.hidden = true; }
    }
    document.querySelectorAll('[data-legal]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        openLegal(el.getAttribute('data-legal'));
      });
    });
    legalOverlay.addEventListener('click', function () { legalOverlay.hidden = true; });
    legalModal.addEventListener('click', function (e) { e.stopPropagation(); });
    document.getElementById('legal-close').addEventListener('click', function () { legalOverlay.hidden = true; });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { legalOverlay.hidden = true; }
    });
  }
})();
