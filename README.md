# Bisnero — Website

Eine einzelne Datei: [`index.html`](index.html). Kein Build, kein Framework, kein
Paketmanager. Hochladen reicht.

Sie führt die beiden Entwürfe zusammen: das Design und der Aufbau der alten
`index.html` (dunkle Fläche, Cyan-Gold-Akzente, Glasflächen, Sora + Manrope),
die Inhalte und Bewegungen der neuen `Bisnero.html` (echte Südpfalz-Projekte im
3D-Rad, Vorher/Nachher-Regler, Startsequenz, Telemetrie, Magnet-Knöpfe).

## Aufbau

| Abschnitt | Was passiert |
|---|---|
| 01 Start | Höhenlinien-Feld auf einem Canvas, Zeilen laufen unter einer Maske hoch, Kennzahlen zählen sich hoch |
| 02 Arbeiten | Sieben Projekte auf einem 3D-Rad: ziehen, wischen, Pfeiltasten, Scrollen dreht es weiter |
| 03 Beweis | Vorher/Nachher zum Ziehen, drei Kennzahlen zählen beim Hereinscrollen |
| 04 Leistungen | Zeilen mit Farbstrich beim Überfahren, dazu eine Vorschaukarte am Zeiger |
| 05 Ablauf | Zeitstrahl, der sich beim Scrollen füllt |
| 06 Preise | Drei Karten, die sich unter dem Zeiger neigen |
| 07 Fragen | Akkordeon, immer nur eine Antwort offen |
| 08 Kontakt | Formular mit schwebenden Beschriftungen, Prüfung und Bot-Falle |

## Vor dem Livegang anpassen

Alles Nötige steht im Kommentarblock ganz oben in `index.html`. Kurz:

1. **Kontakt** — im `SITE`-Block am Anfang des unteren `script`:
   `telefon`, `email`, `adresse`, `antwortzeit`.
2. **Formular** — `SITE.formEndpoint` setzen (z. B. Formspree). Solange das Feld
   leer ist, läuft das Formular im Demo-Modus: es zeigt die Bestätigung an und
   **versendet nichts**.
3. **Preise** — Abschnitt 06, `data-preis="start"` und `data-preis="premium"`.
4. **Dauern** — Abschnitt 05, die vier `<span data-dauer>`.
5. **Zahlen im Beweis** — Abschnitt 03, die drei `data-to`. Die stehenden Werte
   (1.2 s, 98, 3×) sind Platzhalter. Nur echte Werte eintragen.
6. **Rechtliches** — Impressum und Datenschutz verlinken, sie zeigen auf `#`.

## Screenshots einsetzen

Die Projektkarten und der Vergleich sind so gebaut, dass ein Bild einfach
darübergelegt wird. Ordner `bilder/` anlegen und die Datei am Element angeben:

```html
<!-- Projektkarte -->
<div class="wcard" style="--shot:url(bilder/district-null41.jpg)">

<!-- Vergleich -->
<div class="proof-side proof-before" style="--shot-before:url(bilder/vorher.jpg)">
<div class="proof-side proof-after"  style="--shot-after:url(bilder/nachher.jpg)">
```

Ohne Bild bleibt der gezeichnete Platzhalter stehen — nichts bricht.

## Technik

* GSAP + ScrollTrigger + Lenis über CDN. Sonst nichts: kein Tailwind, kein
  three.js. Das Feld im Kopfbereich ist selbst gezeichnet.
* Fällt ein CDN aus, hebt ein Notausgang nach 2,6 Sekunden alle Startzustände
  auf: die Seite ist vollständig lesbar, Akkordeon und Formular arbeiten weiter.
* Ohne JavaScript zeigt `noscript` die Seite direkt an.
* `prefers-reduced-motion` schaltet Startbild, Canvas und 3D-Rad ab; das Rad
  wird zu einer Reihe zum Wischen.
* Der eigene Zeiger misst sich selbst: läuft die Seite auf dem Gerät nicht
  flüssig, kommt der echte Mauszeiger zurück.
