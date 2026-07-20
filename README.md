# District Null41 — Landau in der Pfalz

One-Page-Website für das Restaurant & die Cocktailbar **District Null41**
(Sushi · Moderne asiatische Küche · Cocktails), Georg-Friedrich-Dentzel-Straße 11, 76829 Landau.

Implementiert nach dem Claude-Design-Handoff `project/District Null41.dc.html`.

## Struktur

- `index.html` — komplette One-Page-Site (Hero, Konzept, Signature, 4 Menükarten als Tabs, Lounge-Marquee, Reservierung, Öffnungszeiten mit Live-Status, DSGVO-Two-Click-Map, Instagram-Grid, Footer, mobile Sticky-Call-Bar)
- `style.css` — komplettes Styling (Design-Tokens aus dem Handoff)
- `script.js` — Tab-Umschaltung, „Jetzt geöffnet“-Status, Two-Click-Karte
- `assets/img/` — Bildmaterial
- `project/` — Original-Design-Kontext aus Claude Design

## Hinweis zu den Bildern

Beim Übertragen aus dem Design-Projekt wurden 5 der 6 Bilder vom API-Limit
(256 KiB pro Datei) abgeschnitten. Vollständig übernommen ist nur
`sashimi-teller.png`. Für die übrigen liegen unter `assets/img/` gleichnamige,
im Marken-Look gestaltete Platzhalter in den Originalmaßen:

- `chopsticks-lachs.png` (883×508)
- `lounge-purple.png` (1831×561) — Hero-Hintergrund
- `noodle-bowl.png` (402×521)
- `restaurant-bar.png` (879×521)
- `sake-set.png` (402×521)

Sobald die Originale vorliegen, einfach die Dateien unter `assets/img/`
gleichen Namens ersetzen — es sind keine Codeänderungen nötig.

## Offene Punkte

- Impressum & Datenschutz sind wie im Design als Platzhalter-Anker verlinkt
  (`#impressum`, `#datenschutz`) und brauchen noch Inhalte/Seiten.
- Domain in `index.html` (canonical/og), `robots.txt` und `sitemap.xml` ist
  `districtnull41-landau.de` — bei anderer Domain anpassen.
