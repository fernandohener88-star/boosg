(function () {
  'use strict';

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cleanupSmoke = null;

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  function initReveal() {
    var els = document.querySelectorAll('[data-reveal]');
    if (reduced || !('IntersectionObserver' in window)) {
      els.forEach(function (e) { e.classList.add('sc-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('sc-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (e) { io.observe(e); });
    setTimeout(function () { els.forEach(function (e) { e.classList.add('sc-in'); }); }, 2500);
  }

  function initScroll() {
    var header = document.getElementById('sc-header');
    var sticky = document.getElementById('sc-sticky');
    var onScroll = function () {
      var y = window.scrollY || 0;
      if (header) header.classList.toggle('sc-scrolled', y > 40);
      if (sticky) sticky.classList.toggle('sc-visible', y > window.innerHeight * 0.85);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function initStatus() {
    var update = function () {
      var wrap = document.getElementById('sc-status');
      var text = document.getElementById('sc-status-text');
      if (!wrap || !text) return;
      var now = new Date();
      var day = now.getDay(); // 0 Sun .. 6 Sat
      var mins = now.getHours() * 60 + now.getMinutes();
      var open = 17 * 60; // 17:00
      var closeFor = function (d) { return (d === 5 || d === 6) ? 2 * 60 : 1 * 60; }; // Fri/Sat -> 02:00 else 01:00
      var prevDay = (day + 6) % 7;
      var isOpen = false;
      if (mins < closeFor(prevDay)) isOpen = true; // still in previous night
      else if (mins >= open) isOpen = true; // tonight's session started
      text.textContent = isOpen ? 'Jetzt geöffnet' : 'Öffnet um 17:00 Uhr';
      wrap.classList.toggle('is-closed', !isOpen);
    };
    update();
    setInterval(update, 30000);
  }

  function initCookie() {
    var banner = document.getElementById('sc-cookie');
    if (!banner) return;
    var stored = null;
    try { stored = localStorage.getItem('sc_cookie_consent'); } catch (e) {}
    if (!stored) setTimeout(function () { banner.classList.add('sc-visible'); }, 1200);
    var close = function (val) {
      try { localStorage.setItem('sc_cookie_consent', val); } catch (e) {}
      banner.classList.remove('sc-visible');
    };
    var all = document.getElementById('sc-cookie-all');
    var ess = document.getElementById('sc-cookie-ess');
    if (all) all.addEventListener('click', function () { close('all'); });
    if (ess) ess.addEventListener('click', function () { close('essential'); });
  }

  function initTilt() {
    if (reduced) return;
    document.querySelectorAll('[data-tilt]').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = 'perspective(900px) rotateY(' + (px * 5).toFixed(2) + 'deg) rotateX(' + (-py * 5).toFixed(2) + 'deg) translateY(-4px)';
        card.style.boxShadow = '0 24px 50px -18px rgba(0,0,0,.75), 0 0 28px -10px rgba(255,100,184,.35)';
        card.style.borderColor = 'rgba(255,143,207,.4)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
        card.style.boxShadow = '';
        card.style.borderColor = '';
      });
    });
  }

  function initSmoke() {
    var canvas = document.getElementById('sc-smoke');
    if (!canvas || reduced) return;
    var tries = 0;
    var start = function () {
      if (!window.THREE) { if (tries++ < 40) { setTimeout(start, 150); } return; }
      var THREE = window.THREE;
      var host = canvas.parentElement;
      var W = host.clientWidth, H = host.clientHeight;
      var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
      renderer.setSize(W, H);
      var scene = new THREE.Scene();
      var camera = new THREE.PerspectiveCamera(60, W / H, 1, 1000);
      camera.position.z = 320;

      var tc = document.createElement('canvas'); tc.width = tc.height = 256;
      var g = tc.getContext('2d');
      var grd = g.createRadialGradient(128, 128, 0, 128, 128, 128);
      grd.addColorStop(0, 'rgba(255,255,255,0.9)');
      grd.addColorStop(0.35, 'rgba(255,255,255,0.4)');
      grd.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = grd; g.fillRect(0, 0, 256, 256);
      var tex = new THREE.CanvasTexture(tc);

      var colors = [0xff64b8, 0xc9874a, 0xff8fcf, 0x9a5fae];
      var geo = new THREE.PlaneGeometry(300, 300);
      var group = new THREE.Group();
      var N = Math.min(26, Math.max(14, Math.floor(W / 55)));
      var parts = [];
      for (var i = 0; i < N; i++) {
        var mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.05 + Math.random() * 0.06, depthWrite: false, blending: THREE.AdditiveBlending, color: colors[i % colors.length] });
        var m = new THREE.Mesh(geo, mat);
        m.position.set((Math.random() - 0.5) * W * 0.9, (Math.random() - 0.5) * H * 1.1, (Math.random() - 0.5) * 260 - 40);
        m.rotation.z = Math.random() * Math.PI * 2;
        var s = 0.7 + Math.random() * 1.3; m.scale.set(s, s, s);
        parts.push({ m: m, rot: (Math.random() - 0.5) * 0.0016, vy: 0.06 + Math.random() * 0.12 });
        group.add(m);
      }
      scene.add(group);

      var mx = 0, my = 0, raf = null, visible = true;
      var onMove = function (e) { mx = (e.clientX / window.innerWidth - 0.5); my = (e.clientY / window.innerHeight - 0.5); };
      window.addEventListener('mousemove', onMove, { passive: true });

      var resize = function () { W = host.clientWidth; H = host.clientHeight; renderer.setSize(W, H); camera.aspect = W / H; camera.updateProjectionMatrix(); };
      window.addEventListener('resize', resize);

      var tick = function () {
        parts.forEach(function (p) {
          p.m.rotation.z += p.rot;
          p.m.position.y += p.vy;
          if (p.m.position.y > H * 0.6 + 160) p.m.position.y = -H * 0.6 - 160;
        });
        group.rotation.y += ((mx * 0.18) - group.rotation.y) * 0.04;
        group.rotation.x += ((my * 0.1) - group.rotation.x) * 0.04;
        renderer.render(scene, camera);
        raf = visible ? requestAnimationFrame(tick) : null;
      };

      var io = ('IntersectionObserver' in window) ? new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          visible = en.isIntersecting;
          if (visible && !raf) raf = requestAnimationFrame(tick);
        });
      }, { threshold: 0 }) : null;
      if (io) io.observe(host);

      tick();
      cleanupSmoke = function () {
        if (raf) cancelAnimationFrame(raf);
        if (io) io.disconnect();
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('resize', resize);
      };
    };
    start();
  }

  function initHamburger() {
    var btn = document.querySelector('.sc-hamburger');
    var nav = document.querySelector('.sc-mobile-nav');
    var header = document.getElementById('sc-header');
    if (!btn || !nav) return;
    var mobileLinks = nav.querySelectorAll('.sc-mobile-link, .sc-mobile-cta');
    function close() {
      btn.setAttribute('aria-expanded', 'false');
      btn.classList.remove('is-open');
      nav.classList.remove('is-open');
      nav.setAttribute('aria-hidden', 'true');
      if (header) header.classList.remove('sc-nav-open');
    }
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      if (open) { close(); } else {
        btn.setAttribute('aria-expanded', 'true');
        btn.classList.add('is-open');
        nav.classList.add('is-open');
        nav.setAttribute('aria-hidden', 'false');
        if (header) header.classList.add('sc-nav-open');
      }
    });
    mobileLinks.forEach(function (link) { link.addEventListener('click', close); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  ready(function () {
    initReveal();
    initScroll();
    initStatus();
    initCookie();
    initTilt();
    initSmoke();
    initHamburger();
  });

  window.addEventListener('beforeunload', function () { if (cleanupSmoke) cleanupSmoke(); });
})();
