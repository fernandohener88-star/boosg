# AUDIT.md – ACCENT aesthetic studio

Stand: 2026-09-21 · Ausgangsbasis: branch `ACCENT_aesthetic_studio`

---

## 1 · Projektstruktur (Ist)

| Element | Ist | Soll |
|---|---|---|
| Format | Statisches HTML, kein Build-Tool | Vite + Vanilla-JS-Module |
| Dateigröße | `index.html` 36 KB, 661 Zeilen | Vite bündelt, HTML klein |
| Bilder | 6 × PNG in `img/` | AVIF + WebP, `<picture>`, 3 Breiten |
| Fonts | Google Fonts CDN | Self-hosted via `@fontsource` |
| JS-Libraries | keine (plain IntersectionObserver) | gsap + ScrollTrigger + SplitText, lenis, three |
| Deployment | Netlify, `netlify.toml` vorhanden | bleibt Netlify |

---

## 2 · Daten & Rechtliches

| Befund | Schwere | Geplante Lösung |
|---|---|---|
| JSON-LD `aggregateRating` vorhanden | KRITISCH | entfernen (Google-Richtlinie) |
| JSON-LD `openingHours: Mo-Sa 09:00-18:00` unbestätigt | KRITISCH | entfernen, in TODO |
| JSON-LD `geo` fehlt | HOCH | auf 49.19606 / 8.11356 setzen |
| Stat „100% Weiterempfehlung" unbelegt | KRITISCH | durch „10 von 10 mit 5 Sternen" ersetzen |
| Trust-Bar „Ihre Nr. 1 in Landau" | HOCH | entfernen (UWG) |
| Kontakt „Mo–Sa · bis 18:00 Uhr" unbestätigt | HOCH | → „Termine nach Vereinbarung" |
| Footer „Mo–Sa: bis 18:00 Uhr" | HOCH | entfernen, TODO |
| Karte „Premium-Behandlungen / Nur bei ACCENT" | MITTEL | entfernen bis Inhaberin bestätigt |
| © 2024 statisch | NIEDRIG | dynamisch per JS |

---

## 3 · Design

| Befund | Schwere | Geplante Lösung |
|---|---|---|
| Helles Creme-Design (`#FBF8F3`) statt dunklem Premium | HOCH | komplettes Design-Overhaul Phase 2 |
| Gold-Ton `#A98C66` statt `#C9A96E` | HOCH | Phase 2 |
| Kein Rosé-Akzent `#B8766A` | MITTEL | Phase 2 |
| Versal-Labels über jeder Sektion (Template-Optik) | MITTEL | max. 2–3 gezielt, Phase 2 |
| `→` an Buttons, generische Texte | NIEDRIG | Phase 2 |
| Kein Three.js-Objekt | HOCH | Serum-Tropfen Phase 3 |
| Kein Glow-Reveal-System für Bilder | HOCH | Phase 2 |
| Keine horizontale Leistungs-Sektion Desktop | MITTEL | Phase 4B |
| Cursor nur Crosshair, kein Magnet/Ring | NIEDRIG | Phase 2 |

---

## 4 · Typografie

| Befund | Schwere | Geplante Lösung |
|---|---|---|
| Google Fonts CDN – DSGVO-Problem | KRITISCH | `@fontsource` lokal, Phase 1 |
| Keine SplitText-H1/H2-Reveal-Animationen | MITTEL | Phase 1/2 |
| `text-wrap: balance/pretty` fehlt | NIEDRIG | Phase 2 |
| Fließtext max-width nicht konsequent 70 Zeichen | NIEDRIG | Phase 2 |

---

## 5 · Performance

| Befund | Schwere | Geplante Lösung |
|---|---|---|
| PNG statt AVIF/WebP | HOCH | sharp / vite-imagetools, Phase 2 |
| Google Fonts: 2 Render-blocking Requests | HOCH | Self-hosted, Phase 1 |
| Kein `<link rel="preload">` für Hero-Font-Schnitt | MITTEL | Phase 1 |
| Preloader 1,0 s Delay → schadet LCP | HOCH | entfernen, Phase 1 |
| Keine Code-Splitting (alles inline) | MITTEL | Vite bündelt, Phase 1 |
| Three.js nicht lazy geladen | – | Phase 3 (import() nach LCP) |

---

## 6 · Fehlende Sektionen (Briefing-Soll vs. Ist)

| Sektion | Status |
|---|---|
| Header | ✅ vorhanden, aber keine Hide/Show-on-Scroll-Logik |
| Hero | ✅ vorhanden, ohne 3D-Tropfen |
| Vertrauensband | ✅ vorhanden |
| Studio | ✅ vorhanden |
| Leistungen | ✅ vorhanden, aber ohne horizontales Desktop-Layout |
| **Ihr erster Termin** | ❌ fehlt |
| **Stimmen (Testimonials)** | ❌ fehlt (nur ein Zitat im About) |
| **Gutscheine** | ❌ fehlt |
| **FAQ** | ❌ fehlt |
| Kontakt | ✅ vorhanden |
| Footer | ✅ vorhanden |

---

## 7 · Verkaufs-Features (alle fehlend)

- ❌ Termin-Wizard (Drawer/Panel + WhatsApp Deep Link)
- ❌ Behandlungsmenü (`treatments.js`)
- ❌ Gutschein-Konfigurator (3D-Karte)
- ❌ Bewertungs-Booster (`/bewertung/`)
- ❌ Live-Status (öffnet um / schließt um)
- ❌ Pitch-Modus (`?pitch=1`)
- ❌ Mobile Aktionsleiste (fixiert, Daumenbereich)

---

## 8 · SEO & Barrierefreiheit

| Befund | Schwere | Geplante Lösung |
|---|---|---|
| OG-Bild fehlt | MITTEL | Phase 5 |
| Favicon nur Emoji-SVG | NIEDRIG | vollständiges Set Phase 5 |
| Kein Skip-Link | MITTEL | Phase 5 |
| Kein sichtbarer Focus-Ring | HOCH | Phase 5 |
| Alt-Texte verbesserbar | NIEDRIG | Phase 2 |
| ARIA für Wizard/Drawer fehlt | – | Phase 4 |

---

## 9 · DSGVO

| Befund | Schwere | Geplante Lösung |
|---|---|---|
| Google Fonts von CDN geladen | KRITISCH | Self-hosted, Phase 1 |
| Kein Google Maps Embed (gut!) | ✅ – | SVG-Karte + Route-Link bleibt |
| Kein Tracking, keine Cookies | ✅ – | kein Banner nötig |
| Impressum/Datenschutz als Platzhalter | MITTEL | TODO mit Inhaberin |

---

## Changelog (wird nach jeder Phase ergänzt)

| Phase | Datum | Notizen |
|---|---|---|
| 0 | 2026-09-21 | Audit erstellt |
