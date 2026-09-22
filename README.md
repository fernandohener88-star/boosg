# ACCENT aesthetic studio – Website

Premium-Website für ACCENT aesthetic studio, Landau in der Pfalz.

## Tech-Stack

- **Vite** (Build-Tool + Dev-Server)
- **GSAP + ScrollTrigger + SplitText** (Animationen)
- **Lenis** (Smooth Scroll)
- **Three.js** (3D Serum-Tropfen, lazy-geladen)
- **@fontsource** (Cormorant Garamond + DM Sans, self-hosted, DSGVO-konform)
- **Netlify** (Hosting, CDN, Deploy)

## Starten (Entwicklung)

```bash
npm install
npm run dev
```

Öffne http://localhost:3000

## Build (Produktion)

```bash
npm run build
```

Ausgabe in `dist/`. Wird von Netlify automatisch nach jedem Push auf `main` gebaut.

## Wo was bearbeiten

### Inhalte (Texte, Preise, Kontakt)

| Was | Datei |
|-----|-------|
| Name, Telefon, Adresse, Social | `src/data/site.js` |
| Behandlungen + Preise + FAQ | `src/data/treatments.js` |
| Bewertungen (Homepage) | `src/data/site.js` → `reviews` |
| Geschenkgutschein-Beträge | `src/data/site.js` → `giftCardAmounts` |

### Bilder

Bilder liegen in `public/img/`. Einfach ersetzen – gleicher Dateiname, gleiches Format.

| Datei | Verwendung |
|-------|-----------|
| `studio-lounge.png` | Hero-Bild |
| `studio-room.png` | Studio-Sektion |
| `nails-lilac.png` | Galerie |
| `nails-magenta.png` | Galerie |
| `nails-mauve.png` | Galerie |
| `og-image.jpg` | Social-Media-Vorschau (1200×630) |

### Struktur (HTML-Sektionen)

Alle Sektionen sind in `index.html`. Reihenfolge von oben:

1. `.hero` – Willkommen + Termin-Button
2. `#studio` – Über das Studio
3. `#leistungen` – Behandlungen
4. `.section-bg-silk` – Geschenkgutscheine
5. `#galerie` – Bildergalerie
6. `#bewertungen` – Kundenbewertungen
7. `[aria-labelledby="faq-h2"]` – FAQ
8. `#kontakt` – Kontakt + Bewertungs-CTA

### Termin-Wizard (WhatsApp)

Die Behandlungs-Liste im Wizard kommt aus `src/data/treatments.js`.
WhatsApp-Nummer: `src/data/site.js` → `whatsapp`.

## Seiten

| URL | Datei | Zweck |
|-----|-------|-------|
| `/` | `index.html` | Hauptseite |
| `/bewertung/` | `bewertung.html` | Bewertungsbooster (noindex) |
| `/impressum` | _zu erstellen_ | Pflichtangabe |
| `/datenschutz` | _zu erstellen_ | Pflichtangabe |

## Netlify-Konfiguration

Alle Einstellungen in `netlify.toml`:
- Build-Befehl und Ausgabe-Verzeichnis
- Sicherheits-Header (CSP, HSTS, etc.)
- Cache-Regeln
- URL-Weiterleitungen

## Pitch-Modus (Demo)

URL-Parameter `?pitch=1` aktiviert eine geführte Tour durch die Seite (nur für Demo-Zwecke).
Wird in der Produktion **nicht** angezeigt – nur wenn die URL explizit `?pitch=1` enthält.
