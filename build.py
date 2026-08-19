#!/usr/bin/env python3
"""
PhysioPfau — Seiten-Generator.

Baut aus den Inhalts-Dateien in pages/ und der gemeinsamen Hülle unten
die fertigen HTML-Seiten im Projektordner.

Aufruf:  python3 build.py

Gemeinsame Teile (Kopfbereich, Navigation, Fußzeile, Impressum,
Datenschutz, Cookie-Banner) werden NUR hier gepflegt. Danach einmal
build.py ausführen — alle Seiten übernehmen die Änderung.
"""

import os
import re

ROOT = os.path.dirname(os.path.abspath(__file__))

# ─────────────────────────── Seiten ───────────────────────────

PAGES = [
    {
        "file":  "index.html",
        "src":   "start.html",
        "title": "PhysioPfau – Physiotherapie | Landau in der Pfalz",
        "desc":  "PhysioPfau – Ihre Physiotherapiepraxis in Landau in der Pfalz. "
                 "Individuelle, ganzheitliche Behandlung in ruhiger Atmosphäre.",
        "nav":   "start",
        "intro": True,
    },
    {
        "file":  "praxis.html",
        "src":   "praxis.html",
        "title": "Über die Praxis – PhysioPfau | Landau in der Pfalz",
        "desc":  "Lernen Sie die Praxis PhysioPfau in Landau in der Pfalz kennen — "
                 "fachliche Kompetenz, menschliche Wärme und Zeit für Sie.",
        "nav":   "praxis",
    },
    {
        "file":  "leistungen.html",
        "src":   "leistungen.html",
        "title": "Leistungen – PhysioPfau | Landau in der Pfalz",
        "desc":  "Krankengymnastik, Manuelle Therapie, CMD-Therapie und Manuelle "
                 "Lymphdrainage bei PhysioPfau in Landau in der Pfalz.",
        "nav":   "leistungen",
    },
    {
        "file":  "anfahrt.html",
        "src":   "anfahrt.html",
        "title": "Anfahrt & Parken – PhysioPfau | Landau in der Pfalz",
        "desc":  "So finden Sie zu PhysioPfau in Landau in der Pfalz: Adresse, "
                 "Parkmöglichkeiten, Bus & Bahn und Barrierefreiheit.",
        "nav":   "anfahrt",
    },
    {
        "file":  "termin.html",
        "src":   "termin.html",
        "title": "Termin anfragen – PhysioPfau | Landau in der Pfalz",
        "desc":  "Fragen Sie unkompliziert einen Termin bei PhysioPfau in Landau "
                 "in der Pfalz an — wir melden uns innerhalb von 24 Stunden.",
        "nav":   "termin",
        "alpine_extra": " sent:false,",
    },
]

# ─────────────────────────── Bausteine ───────────────────────────

PEACOCK = """<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round" class="{cls}">
            <path d="M12 13L5 4M12 13L9 3M12 13L12 3M12 13L15 3M12 13L19 4"/>
            <circle cx="5" cy="4" r="0.8" fill="currentColor" stroke="none"/>
            <circle cx="9" cy="3" r="0.8" fill="currentColor" stroke="none"/>
            <circle cx="12" cy="3" r="0.8" fill="currentColor" stroke="none"/>
            <circle cx="15" cy="3" r="0.8" fill="currentColor" stroke="none"/>
            <circle cx="19" cy="4" r="0.8" fill="currentColor" stroke="none"/>
            <ellipse cx="12" cy="17" rx="3" ry="2.5"/>
            <circle cx="12" cy="11" r="1.5"/>
            <path d="M11 9.5L10.5 8M12 9.5L12 8M13 9.5L13.5 8"/>
          </svg>"""

ARROW = ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" '
         'class="w-4 h-4"><path d="M5 12h14M13 6l6 6-6 6"/></svg>')

NAV_ITEMS = [
    ("start",      "index.html",      "Start"),
    ("praxis",     "praxis.html",     "Über die Praxis"),
    ("leistungen", "leistungen.html", "Leistungen"),
    ("anfahrt",    "anfahrt.html",    "Anfahrt"),
]

HEAD = """<!doctype html>
<!-- Automatisch erzeugt von build.py — gemeinsame Teile bitte dort ändern. -->
<html lang="de">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{title}</title>
  <meta name="description" content="{desc}" />

  <script src="https://cdn.tailwindcss.com"></script>
  <script src="assets/tailwind.config.js"></script>
  <script defer src="https://unpkg.com/alpinejs@3.13.5/dist/cdn.min.js"></script>

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Manrope:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="assets/site.css" />
  <script>document.documentElement.className+=' js';</script>
{head_extra}</head>

<body class="bg-cream-50 text-ink antialiased" x-data="{{ mobile:false,{alpine_extra} cookie: !localStorage.getItem('cookie_ok'), impressum:false, datenschutz:false }}">
"""

# Läuft im <head>, noch bevor der Overlay im DOM steht: markiert die Seite
# beim zweiten Aufruf in derselben Sitzung, damit das Intro gar nicht
# erst aufblitzt. Reines Extra — ohne dieses Skript läuft das Intro normal.
INTRO_HEAD = """  <script>try{if(sessionStorage.getItem('pp_intro')==='1'){document.documentElement.className+=' intro-seen';}else{sessionStorage.setItem('pp_intro','1');}}catch(e){}</script>
"""

INTRO = """
  <!-- ─────────────── INTRO ─────────────── -->
  <div id="intro-overlay" aria-hidden="true">
    <span class="intro-mark">
      """ + PEACOCK.format(sw="1.4", cls="") + """
    </span>
    <p class="intro-name">PhysioPfau</p>
    <p class="intro-sub">Physiotherapie · Landau in der Pfalz</p>
  </div>
"""


def build_header(active):
    desktop_nav = "\n".join(
        '        <a href="{href}" class="nav-link{act}">{label}</a>'.format(
            href=href, label=label, act=" active" if key == active else "")
        for key, href, label in NAV_ITEMS
    )

    mobile_nav = "\n".join(
        """        <a href="{href}" class="group flex items-center justify-between py-5 border-b border-cream-50/10">
          <div class="flex items-center gap-4">
            <span class="font-serif italic text-[13px] text-sage-400">{num:02d}</span>
            <span class="font-serif text-[32px] {color} group-hover:text-sage-200 transition-colors duration-200">{label}</span>
          </div>
          <span class="w-9 h-9 rounded-full border border-cream-50/20 grid place-items-center text-cream-50/50 group-hover:bg-cream-50 group-hover:text-sage-900 group-hover:border-cream-50 transition-all duration-200">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="w-4 h-4"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </span>
        </a>""".format(href=href, num=i + 1, label=label,
                       color="text-sage-200" if key == active else "text-cream-50")
        for i, (key, href, label) in enumerate(NAV_ITEMS)
    )

    return """
  <!-- ─────────────── NAVIGATION ─────────────── -->
  <header class="fixed top-0 inset-x-0 z-40" x-data="{{ scrolled:false }}"
          x-init="window.addEventListener('scroll', () => scrolled = window.scrollY > 20)">

    <!-- Info-Leiste -->
    <div class="hidden md:block bg-sage-900 text-cream-100/65">
      <div class="max-w-7xl mx-auto px-6 lg:px-10 h-9 flex items-center justify-between text-[11.5px]">
        <div class="flex items-center gap-5">
          <span class="flex items-center gap-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" class="w-3.5 h-3.5 text-sage-400"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
            Mo – Fr · 08 – 19 Uhr
          </span>
          <span class="hidden lg:flex items-center gap-2 text-cream-100/45">
            <span class="dot"></span>
            Sa · nach Vereinbarung
          </span>
        </div>
        <div class="flex items-center gap-5">
          <a href="anfahrt.html" class="flex items-center gap-2 hover:text-cream-50 transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5 text-sage-400"><path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/></svg>
            Anfahrt
          </a>
          <a href="tel:+4900000000" class="flex items-center gap-2 hover:text-cream-50 transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" class="w-3.5 h-3.5 text-sage-400"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"/></svg>
            [Telefon Platzhalter]
          </a>
          <a href="mailto:info@physiopfau.de" class="hidden lg:flex items-center gap-2 hover:text-cream-50 transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5 text-sage-400"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>
            [E-Mail Platzhalter]
          </a>
        </div>
      </div>
    </div>

    <!-- Hauptnavigation -->
    <div class="transition-all duration-500"
         :class="scrolled ? 'bg-cream-50 shadow-md border-b border-sage-100' : 'bg-cream-50/85 backdrop-blur border-b border-sage-100/50'">
      <div class="max-w-7xl mx-auto px-6 lg:px-10 h-[72px] flex items-center justify-between">
        <a href="index.html" class="flex items-center gap-2.5 group">
          <span class="relative inline-flex items-center justify-center w-9 h-9 rounded-full bg-sage-600 text-cream-50">
            {peacock_sm}
            <span class="absolute inset-0 rounded-full ring-1 ring-sage-300/50 animate-breathe"></span>
          </span>
          <span class="leading-tight">
            <span class="block font-serif text-[22px] text-sage-800 -mb-0.5">PhysioPfau</span>
            <span class="block text-[10px] uppercase tracking-eyebrow text-sage-500 font-medium">Landau in der Pfalz</span>
          </span>
        </a>

        <nav class="hidden md:flex items-center gap-9">
{desktop_nav}
        </nav>

        <div class="flex items-center gap-3">
          <a href="termin.html" class="btn-primary hidden sm:inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13.5px] font-medium">
            Termin vereinbaren
            {arrow}
          </a>
          <button @click="mobile=true" aria-label="Menü öffnen" class="md:hidden w-10 h-10 grid place-items-center rounded-full border border-sage-200">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="w-5 h-5"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
          </button>
        </div>
      </div>
    </div>
  </header>

  <!-- Mobiles Menü (außerhalb des Headers wegen iOS fixed-in-fixed) -->
  <div x-show="mobile"
       x-transition:enter="transition duration-250 ease-out"
       x-transition:enter-start="opacity-0 -translate-y-3"
       x-transition:enter-end="opacity-100 translate-y-0"
       x-transition:leave="transition duration-200 ease-in"
       x-transition:leave-start="opacity-100 translate-y-0"
       x-transition:leave-end="opacity-0 -translate-y-3"
       @keydown.escape.window="mobile=false"
       class="md:hidden fixed inset-0 z-[60] flex flex-col bg-sage-900" style="display:none">

    <div class="flex items-center justify-between h-[72px] px-6 border-b border-cream-50/10 shrink-0">
      <div class="flex items-center gap-2.5">
        <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-sage-600 text-cream-50">
          {peacock_xs}
        </span>
        <span class="font-serif text-[20px] text-cream-50">PhysioPfau</span>
      </div>
      <button @click="mobile=false" aria-label="Menü schließen" class="w-10 h-10 grid place-items-center rounded-full border border-cream-50/20 text-cream-50 hover:bg-cream-50/10 transition">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="w-5 h-5"><path d="M6 6l12 12M18 6 6 18"/></svg>
      </button>
    </div>

    <div class="flex-1 overflow-y-auto px-6 py-6 flex flex-col justify-between">
      <nav class="flex flex-col">
{mobile_nav}
      </nav>
      <div class="pb-4 pt-6">
        <a href="termin.html" class="w-full bg-cream-50 text-sage-900 font-medium rounded-full py-4 text-[15px] flex items-center justify-center gap-2 hover:bg-cream-100 transition">
          Termin vereinbaren
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="w-4 h-4"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </a>
        <div class="mt-5 flex items-center justify-center gap-2 text-[12px] text-cream-50/35 eyebrow">
          <span>Physiotherapie</span><span class="dot bg-cream-50/30"></span><span>Landau in der Pfalz</span>
        </div>
      </div>
    </div>
  </div>
""".format(
        desktop_nav=desktop_nav,
        mobile_nav=mobile_nav,
        arrow=ARROW,
        peacock_sm=PEACOCK.format(sw="1.5", cls="w-4 h-4"),
        peacock_xs=PEACOCK.format(sw="1.5", cls="w-3.5 h-3.5"),
    )


FOOTER = """
  <!-- ─────────────── FUSSZEILE ─────────────── -->
  <footer class="bg-sage-900 text-cream-100">
    <div class="max-w-7xl mx-auto px-6 lg:px-10 pt-20 pb-10">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div class="lg:col-span-5">
          <div class="flex items-center gap-2.5">
            <span class="inline-flex items-center justify-center w-9 h-9 rounded-full bg-sage-600 text-cream-50">
              """ + PEACOCK.format(sw="1.5", cls="w-4 h-4") + """
            </span>
            <span class="font-serif text-[24px]">PhysioPfau</span>
          </div>
          <p class="mt-5 font-serif text-2xl leading-snug text-cream-100/95 max-w-sm">
            Ihre Gesundheit in <span class="italic">besten Händen.</span>
          </p>
          <div class="mt-6 flex items-center gap-3">
            <a href="https://www.instagram.com/physiopfau/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" class="w-10 h-10 rounded-full grid place-items-center border border-cream-100/20 hover:bg-cream-100 hover:text-sage-900 transition">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="w-4 h-4"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>
            </a>
            <a href="#" aria-label="Facebook" class="w-10 h-10 rounded-full grid place-items-center border border-cream-100/20 hover:bg-cream-100 hover:text-sage-900 transition">
              <svg viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4"><path d="M13 22v-8h3l.5-4H13V7.5c0-1.1.3-1.9 2-1.9h2V2.2C16.7 2.1 15.6 2 14.3 2 11.6 2 10 3.6 10 6.7V10H7v4h3v8h3z"/></svg>
            </a>
          </div>
        </div>

        <div class="lg:col-span-2">
          <div class="eyebrow text-sage-300">Navigation</div>
          <ul class="mt-5 space-y-3 text-[14.5px]">
            <li><a href="index.html" class="hover:text-cream-50 text-cream-100/80">Startseite</a></li>
            <li><a href="praxis.html" class="hover:text-cream-50 text-cream-100/80">Über die Praxis</a></li>
            <li><a href="leistungen.html" class="hover:text-cream-50 text-cream-100/80">Leistungen</a></li>
            <li><a href="anfahrt.html" class="hover:text-cream-50 text-cream-100/80">Anfahrt</a></li>
            <li><a href="termin.html" class="hover:text-cream-50 text-cream-100/80">Termin</a></li>
          </ul>
        </div>

        <div class="lg:col-span-3">
          <div class="eyebrow text-sage-300">Kontakt</div>
          <ul class="mt-5 space-y-3 text-[14.5px] text-cream-100/80">
            <li>Lazarettstraße 1</li>
            <li>76829 Landau in der Pfalz</li>
            <li>Tel: <span class="text-cream-100">[Telefon Platzhalter]</span></li>
            <li>E-Mail: <span class="text-cream-100">[E-Mail Platzhalter]</span></li>
          </ul>
        </div>

        <div class="lg:col-span-2">
          <div class="eyebrow text-sage-300">Rechtliches</div>
          <ul class="mt-5 space-y-3 text-[14.5px]">
            <li><button @click="impressum=true" class="hover:text-cream-50 text-cream-100/80 transition-colors">Impressum</button></li>
            <li><button @click="datenschutz=true" class="hover:text-cream-50 text-cream-100/80 transition-colors">Datenschutzerklärung</button></li>
          </ul>
        </div>
      </div>

      <div class="mt-16 pt-6 border-t border-cream-100/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[12.5px] text-cream-100/55">
        <span>© 2025 PhysioPfau · Alle Rechte vorbehalten.</span>
        <span>Webdesign by <a href="https://bisnero.de" target="_blank" rel="noopener noreferrer" class="text-cream-100/80 hover:text-cream-50 transition-colors underline underline-offset-2">Bisnero</a></span>
      </div>
    </div>
  </footer>
"""

MODALS = """
  <!-- ─────────────── IMPRESSUM ─────────────── -->
  <div x-show="impressum" x-transition.opacity @keydown.escape.window="impressum=false"
       class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" style="display:none">
    <div class="absolute inset-0 bg-sage-900/55 backdrop" @click="impressum=false"></div>
    <div x-show="impressum"
         x-transition:enter="transition transform duration-400 ease-out"
         x-transition:enter-start="opacity-0 translate-y-5 scale-[0.98]"
         x-transition:enter-end="opacity-100 translate-y-0 scale-100"
         class="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-cream-50 rounded-3xl shadow-lift border border-sage-100">
      <div class="sticky top-0 bg-cream-50 flex items-center justify-between px-7 py-5 border-b border-sage-100 z-10">
        <h2 class="font-serif text-2xl text-sage-800">Impressum</h2>
        <button @click="impressum=false" aria-label="Schließen" class="w-9 h-9 grid place-items-center rounded-full border border-sage-200 hover:bg-sage-50 transition">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="w-4 h-4"><path d="M6 6l12 12M18 6 6 18"/></svg>
        </button>
      </div>
      <div class="px-7 py-7 text-[14.5px] text-sage-700 leading-relaxed space-y-5">
        <div>
          <p class="eyebrow text-sage-500 mb-2">Angaben gemäß § 5 TMG</p>
          <p><strong class="text-sage-800">[Vollständiger Name]</strong><br/>
          PhysioPfau<br/>Lazarettstraße 1<br/>76829 Landau in der Pfalz</p>
        </div>
        <div>
          <p class="eyebrow text-sage-500 mb-2">Kontakt</p>
          <p>Telefon: <span class="text-sage-800">[Telefon Platzhalter]</span><br/>
          E-Mail: <span class="text-sage-800">[E-Mail Platzhalter]</span></p>
        </div>
        <div>
          <p class="eyebrow text-sage-500 mb-2">Berufsbezeichnung &amp; Aufsicht</p>
          <p>Berufsbezeichnung: Physiotherapeut/in<br/>
          Zuständige Kammer: <span class="text-sage-800">[Kammer Platzhalter]</span><br/>
          Aufsichtsbehörde: <span class="text-sage-800">[Behörde Platzhalter]</span><br/>
          Berufsrechtliche Regelungen: Masseur- und Physiotherapeutengesetz (MPhG)</p>
        </div>
        <div>
          <p class="eyebrow text-sage-500 mb-2">Umsatzsteuer-ID</p>
          <p>Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG:<br/>
          <span class="text-sage-800">[USt-ID Platzhalter]</span></p>
        </div>
        <div>
          <p class="eyebrow text-sage-500 mb-2">Haftung für Inhalte</p>
          <p>Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen.</p>
        </div>
        <div>
          <p class="eyebrow text-sage-500 mb-2">Haftung für Links</p>
          <p>Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.</p>
        </div>
        <div>
          <p class="eyebrow text-sage-500 mb-2">Urheberrecht</p>
          <p>Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- ─────────────── DATENSCHUTZ ─────────────── -->
  <div x-show="datenschutz" x-transition.opacity @keydown.escape.window="datenschutz=false"
       class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" style="display:none">
    <div class="absolute inset-0 bg-sage-900/55 backdrop" @click="datenschutz=false"></div>
    <div x-show="datenschutz"
         x-transition:enter="transition transform duration-400 ease-out"
         x-transition:enter-start="opacity-0 translate-y-5 scale-[0.98]"
         x-transition:enter-end="opacity-100 translate-y-0 scale-100"
         class="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-cream-50 rounded-3xl shadow-lift border border-sage-100">
      <div class="sticky top-0 bg-cream-50 flex items-center justify-between px-7 py-5 border-b border-sage-100 z-10">
        <h2 class="font-serif text-2xl text-sage-800">Datenschutzerklärung</h2>
        <button @click="datenschutz=false" aria-label="Schließen" class="w-9 h-9 grid place-items-center rounded-full border border-sage-200 hover:bg-sage-50 transition">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="w-4 h-4"><path d="M6 6l12 12M18 6 6 18"/></svg>
        </button>
      </div>
      <div class="px-7 py-7 text-[14.5px] text-sage-700 leading-relaxed space-y-6">
        <div>
          <p class="eyebrow text-sage-500 mb-2">1. Verantwortliche Person</p>
          <p><strong class="text-sage-800">[Vollständiger Name]</strong><br/>
          PhysioPfau · Lazarettstraße 1 · 76829 Landau in der Pfalz<br/>
          E-Mail: <span class="text-sage-800">[E-Mail Platzhalter]</span><br/>
          Telefon: <span class="text-sage-800">[Telefon Platzhalter]</span></p>
        </div>
        <div>
          <p class="eyebrow text-sage-500 mb-2">2. Erhebung und Verarbeitung personenbezogener Daten</p>
          <p>Wir erheben personenbezogene Daten nur, wenn Sie uns diese im Rahmen einer Kontaktaufnahme oder Terminanfrage freiwillig mitteilen. Die Daten werden ausschließlich zur Bearbeitung Ihrer Anfrage sowie zur Terminvereinbarung verwendet und nicht an Dritte weitergegeben.</p>
        </div>
        <div>
          <p class="eyebrow text-sage-500 mb-2">3. Cookies</p>
          <p>Diese Website verwendet technisch notwendige Cookies, um den Betrieb der Seite zu gewährleisten. Es werden keine Tracking- oder Analyse-Cookies eingesetzt. Mit dem Klick auf „Akzeptieren“ im Cookie-Banner stimmen Sie der Verwendung dieser technisch notwendigen Cookies zu. Ihre Einwilligung wird in Ihrem Browser gespeichert (localStorage) und kann jederzeit durch Löschen des Browser-Caches widerrufen werden.</p>
        </div>
        <div>
          <p class="eyebrow text-sage-500 mb-2">4. Kontaktformular &amp; Terminanfragen</p>
          <p>Wenn Sie uns per Formular oder E-Mail kontaktieren, werden Ihre Angaben (Name, E-Mail, Telefon, Nachricht) zur Bearbeitung der Anfrage und für den Fall von Anschlussfragen gespeichert. Die Daten werden ohne Ihre Einwilligung nicht an Dritte weitergegeben. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Vertragsanbahnung).</p>
        </div>
        <div>
          <p class="eyebrow text-sage-500 mb-2">5. Ihre Rechte (DSGVO)</p>
          <p>Sie haben jederzeit das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung sowie Datenübertragbarkeit Ihrer bei uns gespeicherten Daten (Art. 15–20 DSGVO). Wenden Sie sich dazu an: <span class="text-sage-800">[E-Mail Platzhalter]</span>. Zudem haben Sie das Recht, sich bei einer Aufsichtsbehörde zu beschweren.</p>
        </div>
        <div>
          <p class="eyebrow text-sage-500 mb-2">6. Hosting</p>
          <p>Diese Website wird bei Netlify (Netlify, Inc., 512 2nd Street, Suite 200, San Francisco, CA 94107, USA) gehostet. Beim Aufruf der Seite werden von Netlify automatisch Server-Logs erhoben (IP-Adresse, Uhrzeit, aufgerufene Seite). Weitere Informationen: <a href="https://www.netlify.com/privacy/" target="_blank" rel="noopener" class="underline hover:text-sage-900">netlify.com/privacy</a>.</p>
        </div>
        <div>
          <p class="eyebrow text-sage-500 mb-2">7. Bilder</p>
          <p>Die auf dieser Website verwendeten Fotos sind eigene Aufnahmen der Praxis PhysioPfau und unterliegen dem Urheberrecht der Betreiberin.</p>
        </div>
        <div>
          <p class="eyebrow text-sage-500 mb-2">8. Aktualität</p>
          <p>Stand: Mai 2025. Wir behalten uns vor, diese Datenschutzerklärung bei Bedarf anzupassen.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- ─────────────── COOKIE-BANNER ─────────────── -->
  <div x-show="cookie"
       x-transition:enter="transition transform duration-500 ease-out"
       x-transition:enter-start="opacity-0 translate-y-4"
       x-transition:enter-end="opacity-100 translate-y-0"
       x-transition:leave="transition duration-300 ease-in"
       x-transition:leave-start="opacity-100 translate-y-0"
       x-transition:leave-end="opacity-0 translate-y-4"
       class="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-2xl bg-cream-50 border border-sage-100 rounded-2xl shadow-lift px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
       style="display:none">
    <div class="flex-1 text-[13.5px] text-sage-700/90 leading-relaxed">
      Diese Website verwendet Cookies, um Ihnen die bestmögliche Erfahrung zu bieten. Weitere Informationen finden Sie in unserer
      <button @click="datenschutz=true" class="underline hover:text-sage-900 transition-colors">Datenschutzerklärung</button>.
    </div>
    <button @click="cookie=false; localStorage.setItem('cookie_ok','1')"
            class="btn-primary shrink-0 rounded-full px-6 py-2.5 text-[13.5px] font-medium whitespace-nowrap">
      Akzeptieren
    </button>
  </div>

  <script src="assets/site.js"></script>
</body>
</html>
"""


def main():
    pages_dir = os.path.join(ROOT, "pages")
    written = []

    for page in PAGES:
        with open(os.path.join(pages_dir, page["src"]), encoding="utf-8") as fh:
            content = fh.read()

        html = (
            HEAD.format(
                title=page["title"],
                desc=page["desc"],
                alpine_extra=page.get("alpine_extra", ""),
                head_extra=INTRO_HEAD if page.get("intro") else "",
            )
            + (INTRO if page.get("intro") else "")
            + build_header(page["nav"])
            + "\n"
            + content.rstrip()
            + "\n"
            + FOOTER
            + MODALS
        )

        out = os.path.join(ROOT, page["file"])
        with open(out, "w", encoding="utf-8") as fh:
            fh.write(html)
        written.append((page["file"], len(html)))

    for name, size in written:
        print("  {:<18} {:>7,} Bytes".format(name, size))
    print("\n{} Seiten erzeugt.".format(len(written)))


if __name__ == "__main__":
    main()
