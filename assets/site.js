/* PhysioPfau — gemeinsame Skripte für alle Seiten
   Der Intro-Opener läuft bewusst ohne JavaScript (siehe assets/site.css),
   damit die Seite nie im Ladebild hängen bleiben kann. */

/* Abschnitte beim Scrollen einblenden.
   Die Startwerte (unsichtbar) setzt das CSS nur, wenn html.js gesetzt ist —
   fällt dieses Skript aus, bleiben alle Inhalte einfach sichtbar. */
(function () {
  var els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  if (!('IntersectionObserver' in window)) {
    for (var i = 0; i < els.length; i++) els[i].classList.add('in');
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
