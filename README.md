# District Null41 — Landau in der Pfalz

Website für das Restaurant & die Cocktailbar **District Null41**
(Sushi · Moderne asiatische Küche · Cocktails), Georg-Friedrich-Dentzel-Straße 11,
76829 Landau in der Pfalz.

Umgesetzt nach dem Claude-Design-Handoff `project/District Null41.dc.html`.

## Aufbau

| Datei | Inhalt |
|---|---|
| `index.html` | Startseite: Hero, Konzept, Signature, Karten-Teaser, Lounge, Reservierung, Öffnungszeiten & Location, Instagram |
| `speisekarte.html` | Alle vier Karten (Speise · Sushi · Mittag · Getränke) als eigene Seite |
| `style.css` | Gesamtes Styling, Design-Tokens als CSS-Variablen |
| `script.js` | Header-Verhalten, Scroll-Reveals, Mobile-Navigation, Karten-Tabs, Öffnungsstatus |
| `assets/img/` | Bildmaterial |
| `project/` | Original-Design-Kontext aus Claude Design |

Die Speisekarte liegt bewusst **nicht** auf der Startseite. Diese verweist über
vier Teaser-Karten dorthin; die Links `speisekarte.html#speise`, `#sushi`,
`#mittag` und `#drinks` öffnen direkt die jeweilige Karte.

## Eigenständige Einzeldateien

`build-standalone.py` erzeugt zwei Dateien, in denen CSS, JavaScript und alle
Bilder eingebettet sind — zum Verschicken oder zum Öffnen ohne Server:

```bash
python3 build-standalone.py
```

→ `District-Null41.html` und `District-Null41-Speisekarte.html`.
Beide verlinken untereinander und müssen deshalb im selben Ordner liegen.
Nach Änderungen an den Quelldateien einfach neu bauen.

## Location statt Karten-Embed

Statt eines eingebetteten Google-Maps-Rahmens steht im Kontaktbereich ein
eigenes Location-Panel im Stil der Seite. Grund: Ein echter Karten-Embed bringt
immer die Beschriftungen des Anbieters mit (Kartendaten-Copyright,
Nutzungsbedingungen, „Fehler melden“, Tastatur-Kurzbefehle). Die dürfen aus
lizenzrechtlichen Gründen nicht entfernt oder überdeckt werden und passen
optisch nicht zum Rest.

Das Panel zeigt Adresse und Koordinaten und führt über **Route öffnen** direkt
in die Karten-App des Gasts — dort wird ohnehin navigiert. Nebeneffekt: keine
Datenübertragung an Dritte, also auch kein Cookie- bzw. Einwilligungsbanner.

## Hinweis zu den Bildern

Beim Übertragen aus dem Design-Projekt wurden 5 der 6 Bilder vom API-Limit
(256 KiB pro Datei) abgeschnitten. Vollständig vorhanden ist nur
`sashimi-teller.png`. Für die übrigen liegen unter `assets/img/` gleichnamige
Platzhalter im Marken-Look in den Originalmaßen:

- `chopsticks-lachs.png` (883×508)
- `lounge-purple.png` (1831×561) — Hero-Hintergrund
- `noodle-bowl.png` (402×521)
- `restaurant-bar.png` (879×521)
- `sake-set.png` (402×521)

Sobald die Originale vorliegen: Dateien gleichen Namens unter `assets/img/`
ersetzen und `build-standalone.py` erneut ausführen. Codeänderungen sind
nicht nötig.

## Offene Punkte

- Impressum und Datenschutz fehlen noch als Seiten.
- Die Domain in den `canonical`/`og`-Angaben, in `robots.txt` und `sitemap.xml`
  ist `districtnull41-landau.de` — bei abweichender Domain anpassen.
