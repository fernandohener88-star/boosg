/* Ochs & Graf — kleines, abhängigkeitsfreies Skript.
   Alles ist progressive Verbesserung: ohne JavaScript bleibt jede Seite vollständig nutzbar. */
(function () {
  "use strict";
  var ruhig = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Einzeldatei-Version: Seiten per Hash umschalten ---------- */
  var seiten = document.querySelectorAll("[data-route]");
  if (seiten.length) {
    var zeige = function () {
      var h = (location.hash || "#/").replace(/^#/, "");
      var ziel = null;
      seiten.forEach(function (s) { if (s.getAttribute("data-route") === h) ziel = s; });
      if (!ziel) seiten.forEach(function (s) { if (s.getAttribute("data-route") === "/") ziel = s; });
      seiten.forEach(function (s) { s.hidden = s !== ziel; });
      document.title = ziel.getAttribute("data-titel");
      document.querySelectorAll(".nav a, .menue a").forEach(function (a) {
        var r = a.getAttribute("href").replace(/^#/, "");
        var aktiv = r !== "/" && h.indexOf(r) === 0;
        if (aktiv) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
      });
      window.scrollTo(0, 0);
      starteSeite(ziel);
    };
    window.addEventListener("hashchange", zeige);
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest("a[data-filter]");
      if (a) sessionStorage.setItem("og-filter", a.getAttribute("data-filter"));
    });
    zeige();
  } else {
    starteSeite(document);
  }

  /* ---------- Kopf und Menü ---------- */
  var kopf = document.querySelector(".kopf");
  var aufScroll = function () { if (kopf) kopf.classList.toggle("ist-gescrollt", window.scrollY > 8); };
  window.addEventListener("scroll", aufScroll, { passive: true }); aufScroll();

  var mk = document.querySelector(".menue-knopf"), menue = document.getElementById("menue");
  if (mk && menue) {
    var setze = function (auf) {
      mk.setAttribute("aria-expanded", String(auf));
      mk.querySelector(".menue-knopf__text").textContent = auf ? "Schließen" : "Menü";
      menue.hidden = !auf;
      document.body.style.overflow = auf ? "hidden" : "";
    };
    mk.addEventListener("click", function () { setze(mk.getAttribute("aria-expanded") !== "true"); });
    menue.addEventListener("click", function (e) { if (e.target.closest("a")) setze(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !menue.hidden) { setze(false); mk.focus(); } });
  }

  function starteSeite(wurzel) {
    filter(wurzel); lightbox(wurzel); szene(wurzel); karte(wurzel); formular(wurzel);
  }

  /* ---------- Referenzen filtern ---------- */
  function filter(w) {
    var leiste = w.querySelector(".filter");
    if (!leiste || leiste.dataset.an) return;
    leiste.dataset.an = "1"; leiste.hidden = false;
    var knoepfe = leiste.querySelectorAll("button");
    var eintraege = w.querySelectorAll("[data-kat]");
    var wende = function (k) {
      knoepfe.forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.k === k)); });
      eintraege.forEach(function (e) { e.hidden = k !== "alle" && e.dataset.kat.split(" ").indexOf(k) < 0; });
      var weitere = w.querySelector(".weitere-block");
      if (weitere) weitere.hidden = !weitere.querySelector("li:not([hidden])");
    };
    knoepfe.forEach(function (b) { b.addEventListener("click", function () { wende(b.dataset.k); }); });
    var start = (location.hash.match(/^#([a-z]+)$/) || [])[1] || sessionStorage.getItem("og-filter");
    sessionStorage.removeItem("og-filter");
    wende(start && leiste.querySelector('[data-k="' + start + '"]') ? start : "alle");
  }

  /* ---------- Lightbox für Projektgalerien ---------- */
  function lightbox(w) {
    var dlg = w.querySelector(".lightbox");
    if (!dlg || dlg.dataset.an || typeof dlg.showModal !== "function") return;
    dlg.dataset.an = "1";
    var bilder = [].slice.call(w.querySelectorAll(".galerie button"));
    var img = dlg.querySelector("img"), zahl = dlg.querySelector(".lightbox__zahl"), i = 0;
    var zeig = function (n) {
      i = (n + bilder.length) % bilder.length;
      var q = bilder[i].querySelector("img");
      img.src = q.dataset.gross || q.currentSrc || q.src; img.alt = q.alt;
      zahl.textContent = (i + 1) + " / " + bilder.length + " · " + q.alt;
    };
    bilder.forEach(function (b, n) { b.addEventListener("click", function () { zeig(n); dlg.showModal(); }); });
    dlg.querySelector("[data-zu]").addEventListener("click", function () { dlg.close(); });
    dlg.querySelector("[data-vor]").addEventListener("click", function () { zeig(i + 1); });
    dlg.querySelector("[data-zurueck]").addEventListener("click", function () { zeig(i - 1); });
    dlg.addEventListener("keydown", function (e) { if (e.key === "ArrowRight") zeig(i + 1); if (e.key === "ArrowLeft") zeig(i - 1); });
    var x0 = null;
    dlg.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    dlg.addEventListener("touchend", function (e) { if (x0 === null) return; var d = e.changedTouches[0].clientX - x0; if (Math.abs(d) > 50) zeig(i + (d < 0 ? 1 : -1)); x0 = null; });
  }

  /* ---------- Szene „Vom Scan zum Möbel“ ---------- */
  function szene(w) {
    var el = w.querySelector(".szene");
    if (!el || el.dataset.an) return;
    el.dataset.an = "1";
    var cv = el.querySelector("canvas"), phase = el.querySelector(".szene__phase");
    var schritte = [].slice.call(el.querySelectorAll(".szene__schritte li"));
    var namen = ["3D-Aufmaß · Punktwolke", "CAD · Drahtmodell", "Produktion · Flächen", "Montage"];
    var sc = baue(window.innerWidth < 900 ? 2600 : 6000), prog = 0, pd = 0, raf = null, sichtbar = false, akt = -1;

    function baue(n) {
      var W = 4.6, H = 2.6, D = 3.4;
      var boxes = [
        { a: [.4, 0, 0], b: [3.6, .9, .62], f: [196, 160, 118] },
        { a: [.4, 1.5, 0], b: [3.6, 2.2, .36], f: [170, 134, 94] },
        { a: [3.6, 0, 0], b: [4.2, 2.2, .62], f: [120, 98, 76] }
      ];
      var quads = [{ o: [0, 0, 0], u: [W, 0, 0], v: [0, 0, D], w: 1 }, { o: [0, 0, 0], u: [W, 0, 0], v: [0, H, 0], w: 1 }, { o: [0, 0, 0], u: [0, 0, D], v: [0, H, 0], w: 1 }];
      var faces = [];
      boxes.forEach(function (bx) {
        var a = bx.a, b = bx.b;
        [{ o: [a[0], a[1], b[2]], u: [b[0] - a[0], 0, 0], v: [0, b[1] - a[1], 0], s: 1 },
         { o: [a[0], b[1], a[2]], u: [b[0] - a[0], 0, 0], v: [0, 0, b[2] - a[2]], s: 1.1 },
         { o: [b[0], a[1], a[2]], u: [0, 0, b[2] - a[2]], v: [0, b[1] - a[1], 0], s: .8 }].forEach(function (q) {
          quads.push({ o: q.o, u: q.u, v: q.v, w: 2.2 }); faces.push({ q: q, f: bx.f });
        });
      });
      var fl = function (q) { var c = [q.u[1] * q.v[2] - q.u[2] * q.v[1], q.u[2] * q.v[0] - q.u[0] * q.v[2], q.u[0] * q.v[1] - q.u[1] * q.v[0]]; return Math.hypot(c[0], c[1], c[2]) * q.w; };
      var tot = quads.reduce(function (s, q) { return s + fl(q); }, 0), C = [W / 2, H / 2, D / 2], pts = [];
      var seed = 7, rnd = function () { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
      quads.forEach(function (q) {
        var k = Math.round(n * fl(q) / tot);
        for (var i = 0; i < k; i++) { var r1 = rnd(), r2 = rnd(); pts.push([q.o[0] + q.u[0] * r1 + q.v[0] * r2 - C[0], q.o[1] + q.u[1] * r1 + q.v[1] * r2 - C[1], q.o[2] + q.u[2] * r1 + q.v[2] * r2 - C[2]]); }
      });
      pts.sort(function (p, q) { return (p[0] + p[1] * .35) - (q[0] + q[1] * .35); });
      var sub = function (p) { return [p[0] - C[0], p[1] - C[1], p[2] - C[2]]; };
      var edges = [[[0, 0, 0], [W, 0, 0]], [[0, 0, 0], [0, 0, D]], [[W, 0, 0], [W, 0, D]], [[0, 0, D], [W, 0, D]], [[0, 0, 0], [0, H, 0]], [[W, 0, 0], [W, H, 0]], [[0, 0, D], [0, H, D]], [[0, H, 0], [W, H, 0]], [[0, H, 0], [0, H, D]]];
      boxes.forEach(function (bx) {
        var a = bx.a, b = bx.b, c = [[a[0], a[1], a[2]], [b[0], a[1], a[2]], [b[0], b[1], a[2]], [a[0], b[1], a[2]], [a[0], a[1], b[2]], [b[0], a[1], b[2]], [b[0], b[1], b[2]], [a[0], b[1], b[2]]];
        [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]].forEach(function (e) { edges.push([c[e[0]], c[e[1]]]); });
      });
      return {
        pts: pts, W: W, H: H, edges: edges.map(function (e) { return [sub(e[0]), sub(e[1])]; }),
        faces: faces.map(function (f) { var q = f.q; return { f: f.f, s: q.s, poly: [q.o, [q.o[0] + q.u[0], q.o[1] + q.u[1], q.o[2] + q.u[2]], [q.o[0] + q.u[0] + q.v[0], q.o[1] + q.u[1] + q.v[1], q.o[2] + q.u[2] + q.v[2]], [q.o[0] + q.v[0], q.o[1] + q.v[1], q.o[2] + q.v[2]]].map(sub) }; })
      };
    }

    function zeichne(p, t) {
      var dpr = Math.min(2, window.devicePixelRatio || 1), cw = cv.clientWidth, ch = cv.clientHeight;
      if (!cw || !ch) return;
      if (cv.width !== Math.round(cw * dpr)) { cv.width = Math.round(cw * dpr); cv.height = Math.round(ch * dpr); }
      var x = cv.getContext("2d"); x.setTransform(dpr, 0, 0, dpr, 0, 0); x.clearRect(0, 0, cw, ch);
      var ang = .52 + (t && !ruhig ? Math.sin(t * .0003) * .1 : 0) + p * .04, ca = Math.cos(ang), sa = Math.sin(ang), ct = Math.cos(.5), st = Math.sin(.5);
      var s = Math.min(cw / (sc.W * 1.4), ch / (sc.H * 2.2)), cx = cw / 2, cy = ch * .52;
      var P = function (q) { var xr = q[0] * ca - q[2] * sa, zr = q[0] * sa + q[2] * ca; return [cx + xr * s, cy - (q[1] * ct - zr * st) * s, q[1] * st + zr * ct]; };
      var cl = function (v) { return Math.max(0, Math.min(1, v)); }, scan = cl(p), cad = cl(p - 1), prod = cl(p - 2);
      if (prod > 0) {
        sc.faces.map(function (f) { var pp = f.poly.map(P); return { f: f, pp: pp, z: (pp[0][2] + pp[1][2] + pp[2][2] + pp[3][2]) / 4 }; }).sort(function (a, b) { return a.z - b.z; }).forEach(function (o) {
          var c = o.f.f, k = o.f.s;
          x.fillStyle = "rgba(" + Math.min(255, c[0] * k | 0) + "," + Math.min(255, c[1] * k | 0) + "," + Math.min(255, c[2] * k | 0) + "," + (prod * .95).toFixed(3) + ")";
          x.beginPath(); o.pp.forEach(function (q, i) { i ? x.lineTo(q[0], q[1]) : x.moveTo(q[0], q[1]); }); x.closePath(); x.fill();
        });
      }
      if (cad > 0) {
        x.strokeStyle = "rgba(31,27,22," + (.2 + cad * .55 - prod * .3).toFixed(3) + ")"; x.lineWidth = 1; x.beginPath();
        sc.edges.forEach(function (e) { var a = P(e[0]), b = P(e[1]); x.moveTo(a[0], a[1]); x.lineTo(a[0] + (b[0] - a[0]) * cad, a[1] + (b[1] - a[1]) * cad); });
        x.stroke();
      }
      var n = Math.floor(sc.pts.length * Math.min(1, scan * 1.04)), pa = .85 * (1 - cad * .55) * (1 - prod * .85);
      if (pa > .02) { x.fillStyle = "rgba(31,27,22," + pa.toFixed(3) + ")"; for (var i = 0; i < n; i++) { var q = P(sc.pts[i]); x.fillRect(q[0], q[1], 1.6, 1.6); } }
    }

    /* Fortschritt direkt aus den Textblöcken: Schritt i ist aktiv, solange seine Lesezeile
       (unterhalb der klebenden Bühne) im Block liegt. */
    function messe() {
      var vh = window.innerHeight, buehne = el.querySelector(".szene__buehne").getBoundingClientRect();
      var oben = window.innerWidth < 900 ? buehne.bottom : 0, ref = oben + (vh - oben) * .5, p = 0;
      schritte.forEach(function (li) { var r = li.getBoundingClientRect(); p += Math.max(0, Math.min(1, (ref - r.top) / Math.max(1, r.height))); });
      prog = Math.min(4, p);
      var s = Math.max(0, Math.min(3, Math.floor(p)));
      if (s !== akt) {
        akt = s;
        schritte.forEach(function (li, i) { li.classList.toggle("ist-aktiv", i === s); });
        el.classList.toggle("ist-fertig", s === 3);
        phase.textContent = namen[s];
      }
      if (ruhig || !sichtbar) zeichne(prog);
    }
    function tick(t) { if (!sichtbar) { raf = null; return; } pd += (prog - pd) * .1; zeichne(pd, t); raf = requestAnimationFrame(tick); }
    window.addEventListener("scroll", messe, { passive: true });
    window.addEventListener("resize", function () { messe(); zeichne(pd); });
    if ("IntersectionObserver" in window && !ruhig) {
      new IntersectionObserver(function (es) { sichtbar = es[0].isIntersecting; if (sichtbar && !raf) raf = requestAnimationFrame(tick); }).observe(cv);
    }
    messe(); zeichne(prog);
  }

  /* ---------- Karte: Google Maps erst nach Einwilligung ---------- */
  function karte(w) {
    var k = w.querySelector(".karte");
    var widerruf = w.querySelector("[data-karte-widerruf]");
    var erlaubt = function () { try { return localStorage.getItem("og-karte") === "1"; } catch (e) { return false; } };
    if (widerruf && !widerruf.dataset.an) {
      widerruf.dataset.an = "1";
      var text = function () { widerruf.textContent = erlaubt() ? "Einwilligung für Google Maps widerrufen" : "Keine Einwilligung für Google Maps erteilt"; widerruf.disabled = !erlaubt(); };
      widerruf.addEventListener("click", function () { try { localStorage.removeItem("og-karte"); } catch (e) {} text(); });
      text();
    }
    if (!k || k.dataset.an) return;
    k.dataset.an = "1";
    var lade = function () {
      var f = document.createElement("iframe");
      f.src = k.dataset.src; f.title = "Karte: Ochs & Graf, Cornichonstraße 5b, Landau in der Pfalz"; f.loading = "lazy"; f.referrerPolicy = "no-referrer-when-downgrade";
      k.querySelector(".karte__hinweis").replaceWith(f);
    };
    var b = k.querySelector("[data-karte-laden]");
    if (b) b.addEventListener("click", function () { try { localStorage.setItem("og-karte", "1"); } catch (e) {} lade(); });
    if (erlaubt()) lade();
  }

  /* ---------- Anfrageformular ---------- */
  function formular(w) {
    var f = w.querySelector("form.anfrage");
    if (!f || f.dataset.an) return;
    f.dataset.an = "1"; f.noValidate = true;
    var meld = function (feld, text) {
      var e = f.querySelector('[data-fehler="' + feld + '"]'); if (e) e.textContent = text || "";
      var i = f.elements[feld]; if (i && i.setAttribute) i.setAttribute("aria-invalid", text ? "true" : "false");
    };
    var dateien = f.querySelector('input[type="file"]'), dInfo = f.querySelector("[data-dateien]");
    if (dateien && dInfo) dateien.addEventListener("change", function () { dInfo.textContent = dateien.files.length ? dateien.files.length + " Datei(en) ausgewählt" : ""; });
    f.addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (f.elements.website.value) return;
      var ok = true, erste = null;
      var pruefe = function (feld, bed, text) { meld(feld, bed ? "" : text); if (!bed) { ok = false; erste = erste || feld; } };
      pruefe("bereich", f.querySelectorAll('input[name="bereich"]:checked').length > 0, "Bitte wählt mindestens einen Bereich.");
      pruefe("ort", f.elements.ort.value.trim().length >= 3, "Bitte gebt PLZ oder Ort an.");
      pruefe("name", f.elements.name.value.trim().length >= 2, "Bitte gebt euren Namen an.");
      pruefe("tel", f.elements.tel.value.replace(/\D/g, "").length >= 6, "Bitte gebt eine Telefonnummer an.");
      pruefe("mail", /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.elements.mail.value.trim()), "Bitte gebt eine gültige E-Mail-Adresse an.");
      pruefe("dsgvo", f.elements.dsgvo.checked, "Bitte bestätigt den Datenschutzhinweis.");
      if (!ok) { var el = f.elements[erste]; (el && el.focus ? el : (el && el[0])).focus(); return; }
      var ziel = f.getAttribute("action") || "";
      var fertig = function () {
        var d = w.querySelector(".danke");
        d.querySelector("[data-name]").textContent = f.elements.name.value.trim().split(" ")[0];
        f.hidden = true; d.hidden = false; d.focus();
      };
      /* Versand erst aktiv, wenn ein echter Endpunkt eingetragen ist (siehe PRUEFLISTE.md). */
      if (/^https?:\/\//.test(ziel)) {
        fetch(ziel, { method: "POST", body: new FormData(f), headers: { Accept: "application/json" } }).then(fertig, function () { alert("Die Anfrage konnte nicht gesendet werden. Bitte ruft uns an: 06341 7005116"); });
      } else fertig();
    });
    f.addEventListener("input", function (e) { if (e.target.name) meld(e.target.name, ""); });
  }
})();
