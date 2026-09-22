// Pitch mode – only loaded when ?pitch=1 is in the URL.
// Shows a floating tour button and a guided walkthrough.
// Remove at build time with VITE_PITCH=false (set in netlify.toml / .env.production).

const STOPS = [
  {
    selector: '.hero',
    today: 'Kein eigener Webauftritt. Im Google-Profil fehlt der Website-Link.',
    new: 'Eigene Website, technisch auf lokale Suchen wie „Kosmetikstudio Landau" optimiert.',
    label: 'Sichtbarkeit',
  },
  {
    selector: '#termin',
    today: 'Termine nur per Anruf. Während Behandlungen geht niemand ran.',
    new: 'Kundinnen schicken rund um die Uhr eine fertig formulierte Anfrage per WhatsApp.',
    label: 'Terminanfragen',
    action: () => document.getElementById('hero-termin')?.click(),
  },
  {
    selector: '#leistungen',
    today: 'Keine Behandlungsinfos online. Standardfragen kosten Telefonzeit.',
    new: 'Alle Leistungen, FAQ und Kontakt direkt auf der Seite.',
    label: 'Behandlungsmenü & FAQ',
  },
  {
    selector: '.section-bg-silk',
    today: 'Kein Online-Gutscheinverkauf.',
    new: 'Gutscheine online zusammenstellen und per WhatsApp anfragen.',
    label: 'Gutscheine',
  },
  {
    selector: '#kontakt',
    today: '10 Google-Bewertungen.',
    new: 'Bewertungsseite für einen QR- oder NFC-Aufsteller am Empfang.',
    label: 'Bewertungen',
  },
  {
    selector: '.action-bar',
    today: 'Keine mobile Schnellnavigation.',
    new: 'Anrufen, WhatsApp oder Termin mit einem Tipp – im Daumenbereich.',
    label: 'Mobile Aktionsleiste',
  },
  {
    selector: '.hero', // ROI calculator – shown as card
    label: 'Rechnen Sie selbst',
    calculator: true,
  },
];

let currentStop = 0;
let tourCard = null;

export function initPitch() {
  const btn = document.getElementById('pitch-btn');
  if (!btn) return;
  btn.addEventListener('click', startTour);
}

function startTour() {
  currentStop = 0;
  if (!tourCard) buildCard();
  showStop(0);
}

function buildCard() {
  tourCard = document.createElement('div');
  tourCard.setAttribute('role', 'dialog');
  tourCard.setAttribute('aria-label', 'Demo-Tour');
  tourCard.style.cssText = `
    position: fixed; bottom: 80px; left: 24px;
    width: min(360px, calc(100vw - 48px));
    background: rgba(20,18,16,.96);
    backdrop-filter: blur(24px);
    border: 1px solid rgba(201,169,110,.25);
    border-radius: 8px;
    padding: 24px;
    z-index: 9500;
    font-family: 'DM Sans', sans-serif;
    color: #F2EDE6;
    box-shadow: 0 24px 60px rgba(0,0,0,.6);
  `;
  document.body.appendChild(tourCard);
}

function showStop(i) {
  const stop = STOPS[i];
  if (!stop || !tourCard) return;

  // Scroll to section
  const target = document.querySelector(stop.selector);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    target.style.outline = '2px solid rgba(201,169,110,.5)';
    setTimeout(() => target.style.outline = '', 2000);
  }

  if (stop.calculator) {
    renderCalculator();
    return;
  }

  tourCard.innerHTML = `
    <p style="font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:#C9A96E;margin:0 0 10px;">${i + 1} / ${STOPS.length} · ${stop.label}</p>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px;">
      <div style="padding:14px;background:rgba(242,237,230,.04);border-radius:4px;border:1px solid rgba(242,237,230,.08);">
        <p style="font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:#6B5B4E;margin:0 0 8px;">Heute</p>
        <p style="font-size:13px;line-height:1.6;color:#9A8F83;margin:0;">${stop.today}</p>
      </div>
      <div style="padding:14px;background:rgba(201,169,110,.06);border-radius:4px;border:1px solid rgba(201,169,110,.2);">
        <p style="font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:#C9A96E;margin:0 0 8px;">Neu</p>
        <p style="font-size:13px;line-height:1.6;color:#F2EDE6;margin:0;">${stop.new}</p>
      </div>
    </div>
    <div style="display:flex;gap:10px;justify-content:flex-end;">
      ${i > 0 ? `<button id="pitch-prev" style="background:none;border:1px solid rgba(242,237,230,.15);color:#9A8F83;padding:9px 16px;border-radius:3px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;cursor:pointer;font-family:inherit;">← Zurück</button>` : ''}
      <button id="pitch-next" style="background:#C9A96E;border:none;color:#0F0D0B;padding:9px 18px;border-radius:3px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;cursor:pointer;font-family:inherit;">
        ${i < STOPS.length - 1 ? 'Weiter →' : 'Tour beenden'}
      </button>
    </div>
  `;

  document.getElementById('pitch-next')?.addEventListener('click', () => {
    if (i < STOPS.length - 1) { currentStop++; showStop(currentStop); }
    else closeTour();
  });
  document.getElementById('pitch-prev')?.addEventListener('click', () => {
    if (i > 0) { currentStop--; showStop(currentStop); }
  });

  if (stop.action) setTimeout(stop.action, 800);
}

function renderCalculator() {
  if (!tourCard) return;
  tourCard.innerHTML = `
    <p style="font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:#C9A96E;margin:0 0 12px;">${STOPS.length} / ${STOPS.length} · Rechnen Sie selbst</p>
    <p style="font-size:13px;color:#9A8F83;margin:0 0 16px;line-height:1.5;">Beispielrechnung mit Ihren eigenen Zahlen:</p>
    <div style="margin-bottom:14px;">
      <label style="font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#9A8F83;display:block;margin-bottom:6px;">Verpasste Anfragen pro Woche</label>
      <input id="pitch-missed" type="range" min="1" max="20" value="5" style="width:100%;accent-color:#C9A96E;">
      <p id="pitch-missed-v" style="font-size:13px;color:#C9A96E;margin:4px 0 0;text-align:right;">5 Anfragen</p>
    </div>
    <div style="margin-bottom:16px;">
      <label style="font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#9A8F83;display:block;margin-bottom:6px;">Ø Umsatz pro Termin</label>
      <input id="pitch-avg" type="range" min="20" max="200" value="60" step="5" style="width:100%;accent-color:#C9A96E;">
      <p id="pitch-avg-v" style="font-size:13px;color:#C9A96E;margin:4px 0 0;text-align:right;">60 €</p>
    </div>
    <div id="pitch-result" style="padding:14px;background:rgba(201,169,110,.08);border:1px solid rgba(201,169,110,.25);border-radius:4px;text-align:center;">
      <p style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#C9A96E;margin:0 0 4px;">Möglicher Umsatz pro Monat</p>
      <p id="pitch-calc-result" style="font-family:'Cormorant Garamond',serif;font-size:42px;font-style:italic;color:#F2EDE6;margin:0;">1.200 €</p>
    </div>
    <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:16px;">
      <button id="pitch-prev" style="background:none;border:1px solid rgba(242,237,230,.15);color:#9A8F83;padding:9px 16px;border-radius:3px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;cursor:pointer;font-family:inherit;">← Zurück</button>
      <button id="pitch-close" style="background:#C9A96E;border:none;color:#0F0D0B;padding:9px 18px;border-radius:3px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;cursor:pointer;font-family:inherit;">Tour beenden</button>
    </div>
  `;

  const calc = () => {
    const missed = parseInt(document.getElementById('pitch-missed')?.value || 5);
    const avg = parseInt(document.getElementById('pitch-avg')?.value || 60);
    const monthly = Math.round(missed * avg * 4.33);
    const el = document.getElementById('pitch-calc-result');
    if (el) el.textContent = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(monthly);
    const mv = document.getElementById('pitch-missed-v');
    const av = document.getElementById('pitch-avg-v');
    if (mv) mv.textContent = `${missed} Anfragen`;
    if (av) av.textContent = `${avg} €`;
  };

  document.getElementById('pitch-missed')?.addEventListener('input', calc);
  document.getElementById('pitch-avg')?.addEventListener('input', calc);
  document.getElementById('pitch-close')?.addEventListener('click', closeTour);
  document.getElementById('pitch-prev')?.addEventListener('click', () => { currentStop--; showStop(currentStop); });
  calc();
}

function closeTour() {
  tourCard?.remove();
  tourCard = null;
}
