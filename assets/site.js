/* PhysioPfau — gemeinsame Skripte für alle Seiten */

/* Intro-Opener: nur auf der Startseite und nur einmal pro Browser-Sitzung */
(function () {
  var overlay = document.getElementById('intro-overlay');
  if (!overlay) return;

  var seen = false;
  try { seen = sessionStorage.getItem('intro_seen') === '1'; } catch (e) {}

  if (seen) {
    overlay.style.display = 'none';
    return;
  }

  try { sessionStorage.setItem('intro_seen', '1'); } catch (e) {}

  setTimeout(function () {
    overlay.style.transition = 'opacity .5s ease';
    overlay.style.opacity = '0';
    setTimeout(function () { overlay.style.display = 'none'; }, 520);
  }, 1600);
})();

/* Abschnitte beim Scrollen einblenden */
(function () {
  var els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  if (!('IntersectionObserver' in window)) {
    els.forEach(function (el) { el.classList.add('in'); });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(function (el) { io.observe(el); });
})();
