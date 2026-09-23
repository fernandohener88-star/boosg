/* Planskizzen fuer Bildplaetze ohne Foto.
   Jede Skizze ist reines SVG im Markenstil (Kupfer auf Blueprint-Raster).
   Striche zeichnen sich per CSS-Scroll-Animation selbst (siehe .og-plan im Seiten-CSS).
   Sobald fuer einen Platz ein Foto in bilder/ liegt, ersetzt es die Skizze automatisch. */
(function () {
  'use strict';

  function rnd(seed) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function r(v) { return Math.round(v * 10) / 10; }
  function esc(t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

  /* ---------- Zeichen-Baukasten ---------- */
  function B(w, h) { this.w = w || 800; this.h = h || 560; this.a = []; this.n = 0; }
  B.prototype.path = function (d, k) {
    var i = this.n++;
    this.a.push('<path class="s' + (k ? ' ' + k : '') + '" pathLength="1" style="--i:' + Math.min(i, 60) + '" d="' + d + '"/>');
    return this;
  };
  B.prototype.line = function (x1, y1, x2, y2, k) { return this.path('M' + r(x1) + ' ' + r(y1) + 'L' + r(x2) + ' ' + r(y2), k); };
  B.prototype.poly = function (pts, zu, k) {
    var d = pts.map(function (p, i) { return (i ? 'L' : 'M') + r(p[0]) + ' ' + r(p[1]); }).join('');
    return this.path(d + (zu ? 'Z' : ''), k);
  };
  B.prototype.rect = function (x, y, w, h, k) { return this.path('M' + r(x) + ' ' + r(y) + 'h' + r(w) + 'v' + r(h) + 'h' + r(-w) + 'Z', k); };
  B.prototype.kreis = function (cx, cy, q, k) {
    return this.path('M' + r(cx - q) + ' ' + r(cy) + 'a' + r(q) + ' ' + r(q) + ' 0 1 0 ' + r(2 * q) + ' 0a' + r(q) + ' ' + r(q) + ' 0 1 0 ' + r(-2 * q) + ' 0', k);
  };
  B.prototype.bogen = function (x1, y1, q, x2, y2, k) { return this.path('M' + r(x1) + ' ' + r(y1) + 'A' + r(q) + ' ' + r(q) + ' 0 0 1 ' + r(x2) + ' ' + r(y2), k); };
  B.prototype.flaeche = function (pts, k) {
    this.a.push('<path class="f' + (k ? ' ' + k : '') + '" d="' + pts.map(function (p, i) { return (i ? 'L' : 'M') + r(p[0]) + ' ' + r(p[1]); }).join('') + 'Z"/>');
    return this;
  };
  B.prototype.text = function (x, y, t, k, anker) {
    this.a.push('<text class="t' + (k ? ' ' + k : '') + '" x="' + r(x) + '" y="' + r(y) + '"' + (anker ? ' text-anchor="' + anker + '"' : '') + '>' + esc(t) + '</text>');
    return this;
  };
  B.prototype.punkt = function (x, y, q, o) {
    this.a.push('<circle class="p" cx="' + r(x) + '" cy="' + r(y) + '" r="' + q + '" opacity="' + r(o) + '"/>');
    return this;
  };
  /* Masslinie mit Hilfslinien und Schraegstrichen */
  B.prototype.mass = function (x1, y1, x2, y2, label, ab) {
    ab = ab || 0;
    var hor = Math.abs(y2 - y1) < Math.abs(x2 - x1);
    if (hor) {
      var y = y1 + ab;
      this.line(x1, y1 + (ab > 0 ? 4 : -4), x1, y + (ab > 0 ? 6 : -6), 'm').line(x2, y2 + (ab > 0 ? 4 : -4), x2, y + (ab > 0 ? 6 : -6), 'm');
      this.line(x1 - 6, y, x2 + 6, y, 'm').line(x1 - 4, y + 4, x1 + 4, y - 4, 'm').line(x2 - 4, y + 4, x2 + 4, y - 4, 'm');
      if (label) this.text((x1 + x2) / 2, y - 7, label, 'tm', 'middle');
    } else {
      var x = x1 + ab;
      this.line(x1 + (ab > 0 ? 4 : -4), y1, x + (ab > 0 ? 6 : -6), y1, 'm').line(x2 + (ab > 0 ? 4 : -4), y2, x + (ab > 0 ? 6 : -6), y2, 'm');
      this.line(x, y1 - 6, x, y2 + 6, 'm').line(x - 4, y1 + 4, x + 4, y1 - 4, 'm').line(x - 4, y2 + 4, x + 4, y2 - 4, 'm');
      if (label) this.a.push('<text class="t tm" text-anchor="middle" transform="translate(' + r(ab > 0 ? x + 18 : x - 8) + ' ' + r((y1 + y2) / 2) + ') rotate(-90)">' + esc(label) + '</text>');
    }
    return this;
  };
  /* 45-Grad-Schraffur, auf ein Rechteck begrenzt */
  B.prototype.schraffur = function (x, y, w, h, s, k) {
    for (var c = s; c < w + h; c += s) {
      var ax = Math.min(c, w), bx = Math.max(0, c - h);
      this.line(x + ax, y + c - ax, x + bx, y + c - bx, k || 'h');
    }
    return this;
  };
  /* Holzmaserung als weiche Wellenlinien */
  B.prototype.maserung = function (x, y, w, h, n, seed, senkrecht) {
    var R = rnd(seed || 7);
    for (var i = 1; i <= n; i++) {
      var d = '';
      if (!senkrecht) {
        var yy = y + h * i / (n + 1), amp = h / (n + 1) * (0.25 + R() * 0.35);
        d = 'M' + r(x + 4) + ' ' + r(yy);
        for (var s = 1; s <= 4; s++) d += 'Q' + r(x + w * (s - .5) / 4) + ' ' + r(yy + (s % 2 ? amp : -amp)) + ' ' + r(x + w * s / 4 - (s === 4 ? 4 : 0)) + ' ' + r(yy);
      } else {
        var xx = x + w * i / (n + 1), am = w / (n + 1) * (0.25 + R() * 0.35);
        d = 'M' + r(xx) + ' ' + r(y + 4);
        for (var t = 1; t <= 4; t++) d += 'Q' + r(xx + (t % 2 ? am : -am)) + ' ' + r(y + h * (t - .5) / 4) + ' ' + r(xx) + ' ' + r(y + h * t / 4 - (t === 4 ? 4 : 0));
      }
      this.path(d, 'h');
    }
    return this;
  };
  B.prototype.boden = function (x1, x2, y) {
    this.line(x1, y, x2, y, 'd');
    for (var x = x1 + 10; x < x2; x += 16) this.line(x, y + 1, x - 9, y + 10, 'h');
    return this;
  };
  B.prototype.svg = function () {
    return '<svg viewBox="0 0 ' + this.w + ' ' + this.h + '" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">' + this.a.join('') + '</svg>';
  };

  /* Isometrische Projektion */
  function iso(ox, oy, s) {
    var c = Math.cos(Math.PI / 6), si = Math.sin(Math.PI / 6);
    return function (x, y, z) { return [ox + (x - z) * c * s, oy - y * s + (x + z) * si * s]; };
  }
  function box(b, P, x0, y0, z0, x1, y1, z1, k) {
    var c = [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]].map(function (q) { return P(q[0], q[1], q[2]); });
    b.poly([c[4], c[5], c[6], c[7]], true, k);           // Front
    b.poly([c[7], c[6], c[2], c[3]], true, k);           // Deckel
    b.poly([c[5], c[1], c[2], c[6]], true, k);           // Seite
    return c;
  }

  /* ---------- Skizzen ---------- */
  var Z = {};

  Z.kueche = function (b) {
    var G = 480;
    b.boden(40, 760, G);
    // Unterschraenke
    var x0 = 70, x1 = 560, top = 318;
    b.rect(x0, top, x1 - x0, G - 12 - top);
    b.rect(x0 + 8, G - 12, x1 - x0 - 16, 12, 'd');
    b.rect(x0 - 6, top - 14, x1 - x0 + 12, 14);                  // Arbeitsplatte bis Hochschrank
    [0, 1, 2, 3, 4].forEach(function (i) { if (i) b.line(x0 + i * 98, top, x0 + i * 98, G - 12, 'd'); });
    b.line(x0, top + 52, x0 + 98, top + 52, 'd').line(x0, top + 104, x0 + 98, top + 104, 'd');
    b.line(x0 + 294, top + 74, x0 + 392, top + 74, 'd');
    // Griffmulden
    [0, 1, 2, 3, 4].forEach(function (i) { b.line(x0 + i * 98 + 30, top + 8, x0 + i * 98 + 68, top + 8, 'd'); });
    // Spuele und Armatur
    b.path('M' + (x0 + 168) + ' ' + (top - 14) + 'v-46q0-14 16-14h10q10 0 10 12v8', 'd');
    b.rect(x0 + 120, top - 16, 120, 3, 'd');
    // Kochfeld
    b.line(x0 + 330, top - 16, x0 + 440, top - 16, 'd');
    // Haengeschraenke
    b.rect(x0, 118, 392, 104);
    [1, 2, 3].forEach(function (i) { b.line(x0 + i * 98, 118, x0 + i * 98, 222, 'd'); });
    b.line(x0 + 6, 226, x0 + 386, 226, 'tc');                        // LED-Band
    // Hochschrank mit Backofen
    b.rect(560 + 12, 92, 168, G - 12 - 92);
    b.rect(572 + 8, G - 12, 152, 12, 'd');
    b.rect(572 + 24, 214, 120, 96, 'd').rect(572 + 36, 238, 96, 60, 'h');
    b.line(572 + 84, 92, 572 + 84, 206, 'd').line(572 + 84, 318, 572 + 84, G - 12, 'd');
    b.maserung(x0, top, 98, G - 12 - top, 3, 11, true);
    // Masse
    b.mass(x0, G, 740, G, 'LÄNGE NACH AUFMASS', 34);
    b.mass(740, 92, 740, G, 'RAUMHÖHE', 30);
  };

  Z.cad = function (b) {
    var P = iso(360, 250, 92);
    // Raum
    b.poly([P(0, 0, 0), P(5, 0, 0), P(5, 0, 3.6), P(0, 0, 3.6)], true, 'd');
    b.line.apply(b, P(0, 0, 0).concat(P(0, 2.6, 0))).line.apply(b, P(5, 0, 0).concat(P(5, 2.6, 0)).concat(['d']));
    b.line.apply(b, P(0, 2.6, 0).concat(P(5, 2.6, 0)).concat(['d']));
    b.line.apply(b, P(0, 0, 0).concat(P(0, 0, 3.6)).concat(['d']));
    b.line.apply(b, P(0, 2.6, 0).concat(P(0, 2.6, 3.6)).concat(['d']));
    // Korpusse
    box(b, P, .4, 0, 0, 3.6, .9, .62);
    box(b, P, .4, 1.5, 0, 3.6, 2.2, .36);
    box(b, P, 3.6, 0, 0, 4.3, 2.2, .62);
    // Frontteilung
    [1.2, 2, 2.8].forEach(function (x) { b.line.apply(b, P(x, 0, .62).concat(P(x, .9, .62)).concat(['d'])); b.line.apply(b, P(x, 1.5, .36).concat(P(x, 2.2, .36)).concat(['d'])); });
    b.line.apply(b, P(3.6, 1.1, .62).concat(P(4.3, 1.1, .62)).concat(['d']));
    // Kochinsel
    box(b, P, 1.2, 0, 1.9, 3.2, .9, 2.8);
    // Masse (isometrisch)
    var a = P(.4, 0, 3.9), e = P(4.3, 0, 3.9);
    b.line(a[0], a[1], e[0], e[1], 'm').text((a[0] + e[0]) / 2 - 20, (a[1] + e[1]) / 2 + 22, '3.900', 'tm', 'middle');
    // CAD-Oberflaeche
    b.rect(24, 24, 752, 512, 'd');
    b.line(24, 56, 776, 56, 'd');
    [60, 108, 156, 204].forEach(function (x) { b.rect(x - 14, 32, 28, 16, 'h'); });
    b.text(250, 45, 'KÜCHE_V3.DWG', 'tm');
    b.text(40, 84, 'EBENEN', 'tc').text(40, 104, '■ KORPUS', 'tm').text(40, 122, '■ FRONTEN', 'tm').text(40, 140, '■ GERÄTE', 'tm').text(40, 158, '□ MASSE', 'tm');
    b.line(560, 400, 620, 400, 'tc').line(590, 370, 590, 430, 'tc').rect(584, 394, 12, 12, 'tc');
    b.text(760, 522, 'X 2.450   Y 0.900   Z 0.620', 'tm', 'end');
    var g = [60, 510];
    b.line(g[0], g[1], g[0] + 34, g[1] - 20, 'tc').line(g[0], g[1], g[0] - 30, g[1] - 18, 'd').line(g[0], g[1], g[0], g[1] - 40, 'd');
  };

  Z.punktwolke = function (b) {
    var P = iso(430, 250, 66), R = rnd(42);
    function flaeche(o, u, v, n, kraft) {
      for (var i = 0; i < n; i++) {
        var s = R(), t = R(), q = P(o[0] + u[0] * s + v[0] * t, o[1] + u[1] * s + v[1] * t, o[2] + u[2] * s + v[2] * t);
        b.punkt(q[0], q[1], 1 + R() * 1.1, (kraft || .55) * (.45 + R() * .55));
      }
    }
    function kante(a, e, n) {
      for (var i = 0; i < n; i++) { var t = R(), q = P(a[0] + (e[0] - a[0]) * t, a[1] + (e[1] - a[1]) * t, a[2] + (e[2] - a[2]) * t); b.punkt(q[0] + (R() - .5) * 2, q[1] + (R() - .5) * 2, 1.2, .95); }
    }
    // Raumkanten als dichte Punktreihen, Flaechen als lockere Wolke
    [[[0, 0, 0], [4.6, 0, 0]], [[0, 0, 0], [0, 0, 3.4]], [[0, 0, 0], [0, 2.6, 0]], [[4.6, 0, 0], [4.6, 2.6, 0]], [[0, 2.6, 0], [4.6, 2.6, 0]], [[0, 2.6, 0], [0, 2.6, 3.4]], [[0, 0, 3.4], [0, 2.6, 3.4]]].forEach(function (k) { kante(k[0], k[1], 90); });
    flaeche([0, 0, 0], [4.6, 0, 0], [0, 0, 3.4], 260, .38);
    flaeche([0, 0, 0], [4.6, 0, 0], [0, 2.6, 0], 220, .34);
    flaeche([0, 0, 0], [0, 0, 3.4], [0, 2.6, 0], 180, .3);
    [[.4, 0, .62, 3.2, .9], [.4, 1.5, .36, 3.2, .7], [3.6, 0, .62, .6, 2.2]].forEach(function (k) {
      flaeche([k[0], k[1], k[2]], [k[3], 0, 0], [0, k[4], 0], 150, .95);
      flaeche([k[0], k[1] + k[4], 0], [k[3], 0, 0], [0, 0, k[2]], 50, .8);
      kante([k[0], k[1], k[2]], [k[0] + k[3], k[1], k[2]], 40); kante([k[0], k[1] + k[4], k[2]], [k[0] + k[3], k[1] + k[4], k[2]], 40);
    });
    // Scanner auf Stativ mit Messstrahlen
    var s = P(2.4, 0, 2.3), k = P(2.4, 1.2, 2.3);
    b.line(s[0], s[1], k[0], k[1] + 10, 'd').line(s[0] - 26, s[1] + 12, k[0], k[1] + 34, 'd').line(s[0] + 26, s[1] + 12, k[0], k[1] + 34, 'd');
    b.rect(k[0] - 11, k[1] - 12, 22, 22).kreis(k[0], k[1] - 1, 5, 'tc');
    [P(0, 2.2, 0), P(4.6, 1.8, 0), P(0, .5, 3.1), P(3.9, 1.1, .62)].forEach(function (z) { b.line(k[0], k[1] - 1, z[0], z[1], 'h'); });
    b.text(40, 530, '3D-AUFMASS · PUNKTWOLKE · MILLIMETERGENAU', 'tm');
  };

  Z.wandsystem = function (b) {
    var G = 480, R = rnd(5);
    b.boden(30, 770, G);
    var xs = [70, 190, 310, 430, 550, 670];
    xs.forEach(function (x, i) { b.rect(x, 96, 12, G - 96); if (i < xs.length - 1) b.line(x + 12, 110, xs[i + 1], 110, 'h'); });
    b.rect(670 + 12, 96, 48, G - 96, 'd');
    var boeden = [[150, 250, 350, 430], [180, 290, 390], [130, 220, 310, 400], [200, 330, 430], [160, 270, 380]];
    boeden.forEach(function (lst, i) {
      var x = xs[i] + 12, w = xs[i + 1] - x;
      lst.forEach(function (y) {
        b.rect(x, y, w, 8);
        var cx = x + 6;
        while (cx < x + w - 14) {
          var bw = 6 + R() * 10, bh = 30 + R() * 34;
          if (R() > .82) { b.poly([[cx, y], [cx + bh * .5, y - bh * .86], [cx + bh * .5 + bw, y - bh * .86 + 4], [cx + bw + 2, y]], false, 'd'); cx += bh * .5 + bw + 6; }
          else { b.rect(cx, y - bh, bw, bh, 'd'); cx += bw + 1.5; }
          if (R() > .9) cx += 16;
        }
      });
    });
    b.mass(xs[1], 96, xs[2], 96, 'MODULRASTER', -24);
    // mobiler Tisch davor
    b.rect(280, 420, 170, 34).line(290, 454, 290, 470, 'd').line(440, 454, 440, 470, 'd').kreis(290, 474, 6, 'd').kreis(440, 474, 6, 'd');
  };

  Z.modul = function (b) {
    var P = iso(300, 330, 70);
    var c = box(b, P, 0, 0, 0, .12, 3.4, .5);
    box(b, P, 1.9, 0, 0, 2.02, 3.4, .5);
    [.6, 1.4, 2.2, 3].forEach(function (y) { box(b, P, .12, y, .02, 1.9, y + .08, .48, 'd'); });
    // Detail-Kreis
    var d = P(1.96, 2.24, .25);
    b.kreis(d[0], d[1], 22, 'tc');
    b.line(d[0] + 20, d[1] - 10, 590, 170, 'd');
    b.kreis(650, 190, 92);
    b.rect(598, 140, 22, 110, 'd').rect(620, 180, 110, 18, 'd');
    b.line(620, 189, 668, 189, 'tc').line(612, 150, 612, 240, 'h');
    b.kreis(640, 189, 4, 'tc').kreis(690, 189, 4, 'tc');
    b.text(650, 312, 'DETAIL A', 'tc', 'middle');
    void c;
  };

  Z.mobil = function (b) {
    var P = iso(330, 330, 110);
    box(b, P, 0, .25, 0, 2.2, 1.05, 1.1);
    [.55, 1.1, 1.65].forEach(function (x) { b.line.apply(b, P(x, .25, 1.1).concat(P(x, 1.05, 1.1)).concat(['d'])); });
    box(b, P, .1, 1.05, .1, 1, 1.35, 1, 'd');
    box(b, P, 1.2, 1.05, .2, 2.05, 1.2, .9, 'd');
    [[.15, .15], [2.05, .15], [.15, .95], [2.05, .95]].forEach(function (q) { var p = P(q[0], .12, q[1]); b.kreis(p[0], p[1], 9, 'd'); b.line.apply(b, P(q[0], .25, q[1]).concat(P(q[0], .2, q[1])).concat(['d'])); });
    var a = P(2.6, 0, .55), e = P(3.4, 0, .55);
    b.line(a[0], a[1], e[0], e[1], 'tc').line(e[0] - 12, e[1] - 12, e[0], e[1], 'tc').line(e[0] - 16, e[1] + 4, e[0], e[1], 'tc');
  };

  Z.grundriss = function (b, v) {
    function wand(x, y, w, h) { b.rect(x, y, w, h); b.schraffur(x, y, w, h, 7); }
    var W = 14;
    if (v === 'laden') {
      wand(80, 90, 640, W); wand(80, 90, W, 390); wand(706, 90, W, 390);
      wand(80, 466, 220, W); wand(420, 466, 300, W);
      b.line(300, 470, 420, 470, 'd').line(300, 476, 420, 476, 'd');
      b.bogen(300, 466, 60, 360, 406, 'd').line(300, 466, 300, 406, 'd');
      for (var x = 110; x < 690; x += 58) b.rect(x, 108, 52, 30, 'd');
      for (var y = 150; y < 440; y += 58) b.rect(98, y, 30, 52, 'd');
      [[250, 250], [370, 230], [490, 270], [330, 350]].forEach(function (q) { b.rect(q[0], q[1], 70, 46); b.line(q[0] + 80, q[1] + 23, q[0] + 104, q[1] + 23, 'tc'); });
      b.poly([[560, 380], [690, 380], [690, 440], [660, 440], [660, 410], [560, 410]], true);
      b.text(400, 160, 'WANDSYSTEM', 'tm', 'middle').text(400, 330, 'MOBILE TISCHE', 'tm', 'middle').text(625, 460, 'THEKE', 'tm', 'middle').text(360, 512, 'EINGANG', 'tm', 'middle');
    } else if (v === 'ferienhaus') {
      wand(170, 80, 460, W); wand(170, 80, W, 420); wand(616, 80, W, 420); wand(170, 486, 460, W);
      wand(420, 94, W, 190); wand(184, 270, 160, W); wand(420, 330, W, 156);
      b.bogen(344, 284, 56, 400, 340, 'd').line(344, 284, 344, 340, 'd');
      b.rect(446, 110, 150, 150, 'd').rect(456, 120, 60, 130, 'h');
      b.rect(196, 100, 150, 30).line(196, 115, 346, 115, 'd').kreis(236, 115, 8, 'd').kreis(300, 115, 8, 'd');
      b.rect(196, 300, 36, 170, 'd').rect(270, 380, 120, 70).kreis(330, 415, 30, 'd');
      b.rect(450, 350, 140, 100, 'd').rect(466, 364, 108, 40, 'h');
      b.line(300, 80, 380, 80, 'tc').line(630, 160, 630, 240, 'tc').line(170, 360, 170, 440, 'tc');
      b.text(260, 210, 'KOCHEN', 'tm', 'middle').text(300, 470, 'WOHNEN', 'tm', 'middle').text(520, 300, 'SCHLAFEN', 'tm', 'middle').text(520, 470, 'BAD', 'tm', 'middle');
      b.mass(170, 500, 630, 500, 'CA. 50 M² WOHNFLÄCHE', 30);
    } else {
      wand(60, 70, 680, W); wand(60, 70, W, 420); wand(726, 70, W, 420); wand(60, 476, 680, W);
      // Fischgraetmuster
      var d = 26, h = 12;
      for (var row = 0; row < 16; row++) {
        for (var col = 0; col < 13; col++) {
          var ox = 110 + col * d * 1.1, oy = 110 + row * h * 2 + (col % 2 ? h : 0);
          if (ox > 520 || oy > 440) continue;
          b.line(ox, oy, ox + d * .7, oy + d * .7, col % 2 ? 'h' : 'd');
        }
      }
      b.rect(560, 120, 150, 70).rect(560, 240, 64, 180).rect(640, 250, 70, 120, 'd');
      b.line(560, 155, 710, 155, 'd');
      b.text(300, 460, 'FISCHGRÄTPARKETT', 'tc', 'middle').text(635, 110, 'KÜCHE', 'tm', 'middle').text(675, 400, 'GARDEROBE', 'tm', 'middle');
    }
  };

  Z.haus = function (b, v) {
    var G = 470;
    b.boden(20, 780, G);
    if (v === 'satteldach') {
      b.poly([[230, G], [230, 250], [570, 250], [570, G]], false);
      b.poly([[200, 262], [400, 110], [600, 262]], false);
      for (var i = 1; i < 9; i++) b.line(400 - i * 22, 110 + i * 16.7, 400 + i * 22, 110 + i * 16.7, 'h');
      b.rect(470, 130, 30, 70).rect(290, 330, 70, 90, 'd').line(325, 330, 325, 420, 'h').line(290, 375, 360, 375, 'h');
      b.rect(420, 310, 70, G - 310, 'd').kreis(478, 395, 3, 'tc');
      b.rect(370, 190, 60, 40, 'd');
      [[110, 330, 70], [690, 350, 56], [760, 390, 38]].forEach(function (t) { b.kreis(t[0], t[1], t[2], 'd'); b.line(t[0], t[1] + t[2], t[0], G, 'd'); });
    } else {
      b.rect(140, 250, 360, G - 250).rect(360, 140, 320, 150);
      b.rect(170, 300, 150, 150, 'd').line(245, 300, 245, 450, 'h');
      b.rect(390, 170, 260, 60, 'd'); [455, 520, 585].forEach(function (x) { b.line(x, 170, x, 230, 'h'); });
      b.rect(360, 330, 110, G - 330, 'd');
      b.line(140, 250, 360, 250, 'd').line(680, 290, 680, 310, 'd');
      b.line(360, 290, 680, 290);
      b.rect(520, 300, 16, G - 300, 'd');
      b.mass(140, G, 680, G, 'KLARE KANTEN', 34);
    }
  };

  Z.treppe = function (b) {
    var G = 490, n = 11, sx = 44, sy = 32, x0 = 110;
    b.boden(30, 770, G);
    var pts = [[x0, G]], inn = [];
    for (var i = 0; i < n; i++) { pts.push([x0 + i * sx, G - (i + 1) * sy]); pts.push([x0 + (i + 1) * sx, G - (i + 1) * sy]); }
    b.poly(pts, false);
    for (var j = 0; j < n; j++) { inn.push([x0 + j * sx + 8, G - (j + 1) * sy + 8]); inn.push([x0 + (j + 1) * sx + 8, G - (j + 1) * sy + 8]); }
    b.poly([[x0 + 8, G]].concat(inn), false, 'd');
    for (var k = 0; k < n; k += 2) b.rect(x0 + k * sx + 14, G - (k + 1) * sy - 70, 10, 10, 'tc');
    b.line(x0 + 30, G - 120, x0 + n * sx + 30, G - n * sy - 120, 'd');
    b.line(x0 + 30, G - 120, x0 + 30, G - 26, 'd').line(x0 + n * sx + 30, G - n * sy - 120, x0 + n * sx + 30, G - n * sy - 26, 'd');
    b.line(x0 + n * sx, G - n * sy, 740, G - n * sy);
    b.mass(x0 + 3 * sx, G - 3 * sy, x0 + 4 * sx, G - 3 * sy, 'AUFTRITT', -48);
    b.mass(x0 + 7 * sx, G - 6 * sy, x0 + 7 * sx, G - 7 * sy, 'STEIGUNG', 54);
  };

  Z.garderobe = function (b) {
    var G = 480;
    b.boden(40, 760, G);
    b.rect(220, 90, 150, 210); b.maserung(220, 90, 150, 210, 4, 3, true);
    b.rect(220, 300, 380, 22);
    b.rect(232, 322, 356, G - 322 - 8); b.line(410, 322, 410, G - 8, 'd');
    b.line(290, 340, 350, 340, 'd').line(470, 340, 530, 340, 'd');
    b.rect(370, 90, 230, 14, 'd');
    [410, 460, 510, 560].forEach(function (x) { b.path('M' + x + ' 150v18q0 10 10 10', 'd'); b.kreis(x, 146, 4, 'tc'); });
    b.mass(220, 90, 600, 90, 'NISCHE NACH MASS', -26);
  };

  Z.waschtisch = function (b) {
    b.line(40, 500, 760, 500, 'd');
    b.rect(160, 300, 480, 110); b.line(400, 300, 400, 410, 'd');
    b.line(250, 316, 310, 316, 'd').line(490, 316, 550, 316, 'd');
    b.maserung(160, 300, 480, 110, 3, 9);
    b.path('M210 300q0-46 60-46h60q60 0 60 46', '');
    b.path('M410 300q0-46 60-46h60q60 0 60 46', '');
    b.path('M290 190h30v24', 'd').path('M490 190h30v24', 'd');
    b.rect(200, 60, 400, 110); b.line(210, 70, 590, 70, 'tc');
    b.mass(160, 410, 640, 410, 'WASCHTISCH NACH MASS', 34);
  };

  Z.tuer = function (b) {
    b.rect(300, 60, 200, 330); b.rect(312, 72, 176, 318, 'd');
    b.line(462, 230, 482, 230).kreis(462, 230, 4, 'tc');
    b.line(120, 390, 680, 390);
    var d = 34, h = 14;
    for (var col = 0; col < 16; col++) {
      for (var row = 0; row < 4; row++) {
        var ox = 130 + col * d * .75, oy = 404 + row * h * 2 + (col % 2 ? h : 0);
        if (ox > 650) continue;
        b.line(ox, oy, ox + (col % 2 ? -d * .6 : d * .6), oy + d * .6, col % 2 ? 'h' : 'd');
      }
    }
    b.text(400, 540, 'FISCHGRÄTPARKETT · DRAUFSICHT', 'tm', 'middle');
  };

  Z.einbauten = function (b) {
    var G = 480;
    b.boden(30, 770, G);
    b.rect(80, 80, 640, G - 80 - 10);
    [180, 280, 380, 520, 620].forEach(function (x) { b.line(x, 80, x, G - 10, 'd'); });
    b.rect(380, 200, 140, 150, 'tc'); b.line(380, 280, 520, 280, 'd'); b.line(386, 206, 514, 206, 'tc');
    b.line(80, 170, 380, 170, 'd').line(520, 170, 720, 170, 'd');
    b.rect(86, G - 10, 628, 10, 'h');
    b.mass(80, 80, 720, 80, 'FLÄCHENBÜNDIG · SCHATTENFUGEN', -26);
  };

  Z.detail = function (b, v) {
    if (v === 'fuge') {
      b.rect(120, 80, 110, 400); b.schraffur(120, 80, 110, 400, 12);
      b.rect(250, 80, 38, 400); b.maserung(250, 80, 38, 400, 2, 4, true);
      b.rect(300, 80, 38, 400); b.maserung(300, 80, 38, 400, 2, 6, true);
      b.line(288, 80, 288, 480, 'tc').line(300, 80, 300, 480, 'tc');
      b.rect(232, 180, 18, 60, 'd').rect(232, 320, 18, 60, 'd');
      b.mass(288, 240, 300, 240, 'FUGE', -120);
      b.line(294, 250, 470, 250, 'd').text(480, 254, 'SCHATTENFUGE', 'tc');
      b.line(270, 380, 470, 380, 'd').text(480, 384, 'WANDANSCHLUSS', 'tm');
    } else {
      var x0 = 140, y0 = 110, w = 520, h = 330;
      b.rect(x0, y0, w, 90); b.maserung(x0, y0, w, 90, 3, 21);
      var tails = [[190, 250], [310, 370], [430, 490], [550, 610]];
      var p = [[x0, y0 + 90]];
      tails.forEach(function (t) { p.push([t[0] + 12, y0 + 90]); p.push([t[0], y0 + 180]); p.push([t[1], y0 + 180]); p.push([t[1] - 12, y0 + 90]); });
      p.push([x0 + w, y0 + 90]);
      b.poly(p, false);
      b.rect(x0, y0 + 180, w, h - 180); b.maserung(x0, y0 + 180, w, h - 180, 3, 22);
      tails.forEach(function (t) { b.schraffur(t[0] + 6, y0 + 118, t[1] - t[0] - 12, 56, 9); });
      b.text(400, 480, 'SCHWALBENSCHWANZ-ZINKUNG', 'tc', 'middle');
    }
  };

  Z.raum = function (b) {
    var vx = 400, vy = 250;
    b.rect(250, 150, 300, 200);
    [[0, 0, 250, 150], [800, 0, 550, 150], [0, 560, 250, 350], [800, 560, 550, 350]].forEach(function (l) { b.line(l[0], l[1], l[2], l[3]); });
    for (var i = 1; i < 9; i++) { var x = i * 100; b.line(x, 560, vx + (x - vx) * .38, 350, 'h'); }
    b.poly([[60, 150], [190, 190], [190, 330], [60, 350]], true, 'd');
    b.rect(290, 290, 220, 60, 'd'); b.line(290, 320, 510, 320, 'h');
    b.line(400, 150, 400, 200, 'd').path('M384 200h32l-6 16h-20Z', 'tc');
    b.rect(600, 200, 110, 260, 'd');
    void vy;
  };

  Z.karte = function (b) {
    var R = rnd(17);
    b.rect(20, 20, 760, 520, 'd');
    b.path('M20 330C150 300 230 360 360 330S560 250 780 290', 'tc');
    b.path('M20 346C150 316 230 376 360 346S560 266 780 306', 'tc');
    b.path('M60 520C200 400 300 260 420 200S640 80 760 40');
    b.path('M20 150C180 170 330 230 470 250S700 300 780 320');
    b.path('M240 20C260 160 300 300 290 540', '');
    for (var i = 0; i < 16; i++) {
      var x = 60 + R() * 680, y = 60 + R() * 440, l = 40 + R() * 90, a = R() * Math.PI;
      b.line(x, y, x + Math.cos(a) * l, y + Math.sin(a) * l, 'd');
    }
    b.path('M20 250L780 205', 'd');
    for (var t = 40; t < 780; t += 30) { var yy = 250 - (t - 20) * 45 / 760; b.line(t, yy - 5, t, yy + 5, 'h'); }
    var px = 430, py = 238;
    b.path('M' + px + ' ' + py + 'c-14-18-22-28-22-40a22 22 0 1 1 44 0c0 12-8 22-22 40Z', 'tc');
    b.kreis(px, py - 40, 7, 'tc');
    b.text(px + 32, py - 44, 'OCHS & GRAF', 'tc').text(px + 32, py - 26, 'CORNICHONSTRASSE 5B', 'tm');
    b.text(600, 330, 'QUEICH', 'tm');
    b.path('M720 60l12 30-12-8-12 8Z', 'd').text(720, 112, 'N', 'tm', 'middle');
    b.text(40, 520, 'LANDAU IN DER PFALZ · LAGEPLAN UNMASSSTÄBLICH', 'tm');
  };

  Z.monogramm = function (b, v) {
    b.w = 600; b.h = 800;
    b.a.push('<text class="mg" x="300" y="470" text-anchor="middle">' + esc(v) + '</text>');
    b.line(150, 560, 450, 560);
    for (var i = 0; i <= 30; i++) b.line(150 + i * 10, 560, 150 + i * 10, 560 - (i % 10 === 0 ? 24 : i % 5 === 0 ? 15 : 8), i % 5 ? 'h' : 'd');
  };

  /* ---------- Zuordnung Bildplatz → Skizze ---------- */
  var PLAENE = {
    'REF-02': ['wandsystem', '', 'Modulares Wandsystem', '01/04'],
    'REF-03': ['modul', '', 'Wandmodul im Detail', '02/04'],
    'REF-04': ['mobil', '', 'Mobile Warenpräsentation', '03/04'],
    'REF-05': ['grundriss', 'laden', 'Verkaufsraum', '04/04'],
    'REF-06': ['grundriss', 'efh', 'Wohnraum mit Fischgrätparkett', '01/05'],
    'REF-07': ['kueche', '', 'Küche', '02/05'],
    'REF-08': ['garderobe', '', 'Garderobe', '03/05'],
    'REF-09': ['waschtisch', '', 'Waschtisch & Spiegel', '04/05'],
    'REF-10': ['tuer', '', 'Innentür & Fischgrätparkett', '05/05'],
    'REF-13': ['grundriss', 'ferienhaus', 'Grundriss', '01/03'],
    'REF-14': ['detail', 'fuge', 'Detail Innenausbau', '02/03'],
    'REF-15': ['haus', 'satteldach', 'Außenansicht', '03/03'],
    'REF-16': ['haus', 'bauhaus', 'Bauhaus-Kubatur', '01/05'],
    'REF-17': ['einbauten', '', 'Flächenbündige Einbauten', '02/05'],
    'REF-18': ['treppe', '', 'Treppe', '03/05'],
    'REF-19': ['detail', 'zinken', 'Materialdetail', '04/05'],
    'REF-20': ['raum', '', 'Wohnraum', '05/05'],
    'WEG-02': ['punktwolke', '', '3D-Aufmaß · Punktwolke', 'SCHRITT 01'],
    'WEG-03': ['cad', '', 'CAD-Planung', 'SCHRITT 02'],
    'KONTAKT-01': ['karte', '', 'Lageplan Landau', ''],
    'TEAM-02': ['monogramm', 'ML', '', ''],
    'TEAM-03': ['monogramm', 'YM', '', ''],
    'TEAM-04': ['monogramm', 'SM', '', '']
  };

  var cache = {};
  window.OG_PLAN = function (React, id) {
    var p = PLAENE[id];
    if (!p || !Z[p[0]]) return null;
    if (!cache[id]) {
      var b = new B();
      try { Z[p[0]](b, p[1]); } catch (e) { return null; }
      cache[id] = { html: b.svg(), titel: p[2], blatt: p[3], typ: p[0] };
    }
    var c = cache[id];
    return {
      el: React.createElement('div', { className: 'og-plan og-plan-' + c.typ, dangerouslySetInnerHTML: { __html: c.html } }),
      titel: c.titel, blatt: c.blatt, typ: c.typ
    };
  };
})();
