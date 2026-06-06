/* =====================================================================
   FAHRSCHULE DECK — interactions
   ===================================================================== */
(function () {
  "use strict";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(hover: none)").matches;

  /* ---------- Sticky nav morph ---------- */
  const nav = document.getElementById("nav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 30);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  const burger = document.getElementById("burger");
  const mobile = document.getElementById("mobile-menu");
  const toggleMenu = (open) => {
    burger.classList.toggle("open", open);
    mobile.classList.toggle("open", open);
    document.body.style.overflow = open ? "hidden" : "";
  };
  burger.addEventListener("click", () => toggleMenu(!mobile.classList.contains("open")));
  mobile.querySelectorAll("a").forEach((a, i) => {
    a.style.transitionDelay = 0.06 * i + 0.1 + "s";
    a.addEventListener("click", () => toggleMenu(false));
  });

  /* ---------- Hero headline stagger ---------- */
  const h1 = document.getElementById("hero-h1");
  if (h1) {
    const html = h1.innerHTML;
    // split into words, words into chars, preserving .y spans
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    h1.innerHTML = "";
    let idx = 0;
    const buildChars = (text, isYellow) => {
      text.split("").forEach((ch) => {
        if (ch === " ") { h1.appendChild(document.createTextNode(" ")); return; }
        const s = document.createElement("span");
        s.className = "char" + (isYellow ? " y" : "");
        s.textContent = ch;
        s.style.animationDelay = (idx * 0.028) + "s";
        idx++;
        h1.appendChild(s);
      });
    };
    tmp.childNodes.forEach((node) => {
      if (node.nodeType === 3) buildChars(node.textContent, false);
      else if (node.nodeName === "BR") h1.appendChild(document.createElement("br"));
      else buildChars(node.textContent, node.classList && node.classList.contains("y"));
    });
    requestAnimationFrame(() => h1.classList.add("go"));
    // safety net: guarantee the headline is visible even if CSS animations are throttled/paused
    setTimeout(() => h1.classList.add("shown"), reduceMotion ? 0 : 2400);
  }
  document.querySelectorAll(".hero-sub, .hero-ctas").forEach((el) => el.classList.add("go"));

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  /* ---------- Counter animation ---------- */
  const animateCount = (el) => {
    const target = +el.dataset.count;
    if (!target) { return; }
    const dur = 1400; const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { animateCount(e.target); countIO.unobserve(e.target); } });
  }, { threshold: 0.5 });
  document.querySelectorAll("[data-count]").forEach((el) => countIO.observe(el));

  /* ---------- 3D card tilt ---------- */
  if (!isTouch && !reduceMotion) {
    document.querySelectorAll(".klasse-card").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        const rx = (0.5 - py) * 9;
        const ry = (px - 0.5) * 9;
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
        card.style.setProperty("--mx", px * 100 + "%");
        card.style.setProperty("--my", py * 100 + "%");
      });
      card.addEventListener("mouseleave", () => { card.style.transform = ""; });
    });
  }

  /* ---------- Price tabs ---------- */
  const tabs = document.querySelectorAll(".tab");
  const panels = document.querySelectorAll(".tab-panel");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      panels.forEach((p) => p.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById(tab.dataset.panel).classList.add("active");
    });
  });

  /* ---------- Standorte switcher ---------- */
  const LOCATIONS = {
    steinweiler: {
      name: "Steinweiler", addr: "Kreuzgasse 8, 76872 Steinweiler",
      days: "Dienstag", info: "18:00 – 18:30 Uhr", lesson: "18:30 – 20:00 Uhr",
      lat: 49.1247, lng: 8.1413
    },
    bergzabern: {
      name: "Bad Bergzabern", addr: "Steinfelder Str. 6, 76887 Bad Bergzabern",
      days: "Montag & Donnerstag", info: "18:00 – 18:15 Uhr", lesson: "18:15 – 19:45 Uhr",
      lat: 49.1031, lng: 8.0061
    },
    landau: {
      name: "Landau", addr: "Westbahnstrasse 15, 76829 Landau in der Pfalz",
      days: "Di · Mi · Do", info: "17:00 – 17:30 Uhr", lesson: "17:30 – 19:00 Uhr",
      lat: 49.1980, lng: 8.1170, main: true
    },
    kandel: {
      name: "Kandel", addr: "Scheffelstraße 9, 76870 Kandel",
      days: "Montag", info: "18:00 – 18:30 Uhr", lesson: "18:30 – 20:00 Uhr",
      lat: 49.0833, lng: 8.1936, isNew: true
    }
  };

  const locTabs = document.querySelectorAll(".loc-tab");
  const detail = document.getElementById("loc-detail");
  let map = null, markers = {};

  const renderDetail = (key) => {
    const l = LOCATIONS[key];
    detail.classList.add("swapping");
    setTimeout(() => {
      detail.innerHTML = `
        <div class="ld-head">
          <h3>${l.name}</h3>
          ${l.main ? '<span class="pill owner">Hauptstandort</span>' : ""}
          ${l.isNew ? '<span class="badge-new">NEU · ab 06/2026</span>' : ""}
        </div>
        <div class="ld-addr">${l.addr}</div>
        <div class="ld-grid">
          <div class="ld-block">
            <div class="ld-k">Theoriestunden</div>
            <div class="ld-days">${l.days}</div>
          </div>
          <div class="ld-block">
            <div class="ld-k">Telefon</div>
            <div class="ld-v"><a href="tel:+4917622332266" style="color:var(--accent)">+49 176 22332266</a></div>
          </div>
          <div class="ld-block">
            <div class="ld-k">Info &amp; Anmeldung</div>
            <div class="ld-v">${l.info}</div>
          </div>
          <div class="ld-block">
            <div class="ld-k">Unterricht</div>
            <div class="ld-v">${l.lesson}</div>
          </div>
        </div>`;
      detail.classList.remove("swapping");
    }, 220);

    if (map && markers[key]) {
      map.flyTo([l.lat, l.lng], 13, { duration: 0.8 });
      markers[key].openPopup();
    }
  };

  locTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      locTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      renderDetail(tab.dataset.loc);
    });
  });
  // initial render (no fade flash on load)
  if (detail) {
    const initKey = (document.querySelector(".loc-tab.active") || {}).dataset
      ? document.querySelector(".loc-tab.active").dataset.loc
      : "landau";
    renderDetail(initKey);
    detail.classList.remove("swapping");
  }

  /* ---------- Leaflet map (consent-gated) ---------- */
  const consent = document.getElementById("map-consent");
  const loadMap = () => {
    if (map || typeof L === "undefined") return;
    map = L.map("leaflet-map", { scrollWheelZoom: false, attributionControl: true }).setView([49.14, 8.11], 11);
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; OpenStreetMap &copy; CARTO', maxZoom: 19
    }).addTo(map);
    const icon = L.divIcon({
      className: "deck-pin",
      html: '<div style="width:26px;height:26px;background:#F5C518;border:3px solid #0A0A0A;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 4px 12px rgba(0,0,0,.6)"></div>',
      iconSize: [26, 26], iconAnchor: [13, 26], popupAnchor: [0, -26]
    });
    Object.keys(LOCATIONS).forEach((key) => {
      const l = LOCATIONS[key];
      const m = L.marker([l.lat, l.lng], { icon }).addTo(map)
        .bindPopup(`<strong>Fahrschule Deck — ${l.name}</strong><br>${l.addr}`);
      markers[key] = m;
    });
    consent.classList.add("hide");
  };
  const consentBtn = document.getElementById("map-consent-btn");
  if (consentBtn) consentBtn.addEventListener("click", loadMap);

  /* ---------- Contact form ---------- */
  const form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      // honeypot
      if (form.querySelector('[name="bot-field"]').value) { e.preventDefault(); return; }
      // demo behaviour in preview: show success state, prevent navigation
      e.preventDefault();
      form.querySelectorAll(".field, .checkbox, button[type=submit]").forEach((el) => el.style.display = "none");
      document.getElementById("form-success").classList.add("show");
    });
  }

  /* ---------- Cursor glow ---------- */
  if (!isTouch && !reduceMotion) {
    const glow = document.getElementById("cursor-glow");
    if (glow) {
      window.addEventListener("mousemove", (e) => {
        glow.style.left = e.clientX + "px";
        glow.style.top = e.clientY + "px";
        glow.style.opacity = "1";
      });
      document.addEventListener("mouseleave", () => glow.style.opacity = "0");
    }
  }

  /* ---------- Legal accordion ---------- */
  document.querySelectorAll(".acc-head").forEach((head) => {
    head.addEventListener("click", () => {
      const acc = head.parentElement;
      const body = head.nextElementSibling;
      const open = acc.classList.toggle("open");
      body.style.maxHeight = open ? body.scrollHeight + "px" : "0";
    });
  });
  // open accordion when footer legal link clicked
  document.querySelectorAll('[data-legal]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href").slice(1);
      const acc = document.getElementById(id);
      if (acc && !acc.classList.contains("open")) {
        const head = acc.querySelector(".acc-head");
        setTimeout(() => head.click(), 400);
      }
    });
  });

  /* ---------- Cookie banner ---------- */
  const cookie = document.getElementById("cookie");
  if (cookie && !localStorage.getItem("deck-cookie-ok")) {
    setTimeout(() => cookie.classList.add("show"), 1400);
    document.getElementById("cookie-ok").addEventListener("click", () => {
      localStorage.setItem("deck-cookie-ok", "1");
      cookie.classList.remove("show");
    });
  }

  /* =====================================================================
     HERO CANVAS — autobahn light streaks (long-exposure feel)
     ===================================================================== */
  const canvas = document.getElementById("hero-canvas");
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext("2d");
    let W, H, dpr, streaks = [], raf, running = true;
    const COLORS_WARM = ["#F5C518", "#ffd24a", "#C9A10F"];
    const COLORS_WHITE = ["#ffffff", "#f0ede8", "#cfd6e0"];

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const horizon = () => H * 0.46;

    function makeStreak() {
      // lanes converge toward a vanishing point on the right-ish horizon
      const warm = Math.random() > 0.42;
      const laneT = Math.random();           // 0..1 vertical lane spread
      const y = horizon() + (laneT - 0.5) * H * 0.95;
      const speed = (0.6 + Math.random() * 1.8) * (warm ? 1 : 1.25);
      return {
        x: -Math.random() * W * 0.6,
        y,
        len: 90 + Math.random() * 320,
        h: (1.2 + Math.random() * 3.2) * (Math.abs(laneT - 0.5) + 0.3),
        speed: speed,
        color: warm ? COLORS_WARM[(Math.random() * COLORS_WARM.length) | 0] : COLORS_WHITE[(Math.random() * COLORS_WHITE.length) | 0],
        alpha: 0.15 + Math.random() * 0.55,
        warm
      };
    }
    const COUNT = window.innerWidth < 760 ? 26 : 60;
    for (let i = 0; i < COUNT; i++) { const s = makeStreak(); s.x = Math.random() * W; streaks.push(s); }

    function frame() {
      if (!running) return;
      // subtle trailing fade for long-exposure look
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(10,10,10,0.22)";
      ctx.fillRect(0, 0, W, H);

      ctx.globalCompositeOperation = "lighter";
      const hy = horizon();
      for (const s of streaks) {
        s.x += s.speed * (1 + (s.y - hy) / H * 0.6) * 2.4;
        if (s.x - s.len > W + 40) { Object.assign(s, makeStreak()); s.x = -s.len; }
        const grad = ctx.createLinearGradient(s.x - s.len, s.y, s.x, s.y);
        grad.addColorStop(0, "rgba(0,0,0,0)");
        grad.addColorStop(1, s.color);
        ctx.strokeStyle = grad;
        ctx.globalAlpha = s.alpha;
        ctx.lineWidth = s.h;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(s.x - s.len, s.y);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();
        // bright head
        ctx.globalAlpha = Math.min(1, s.alpha + 0.3);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.h * 0.9, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    }
    frame();

    let resizeT;
    window.addEventListener("resize", () => { clearTimeout(resizeT); resizeT = setTimeout(resize, 200); });
    document.addEventListener("visibilitychange", () => {
      running = !document.hidden;
      if (running) frame(); else cancelAnimationFrame(raf);
    });
  }
})();
