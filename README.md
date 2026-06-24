# Vorbereitung Tracker

Persönlicher Trainings- und Ernährungs-Tracker für die 8-wöchige Fußball-Vorbereitung. Läuft als installierbare PWA komplett offline, auf einem Gerät, ohne Backend und ohne Login. Alle Haken, Gewichts-, Schlaf- und Readiness-Einträge werden lokal im Browser gespeichert (`localStorage`) und überleben Reload sowie App-Neustart.

Die Trainings- und Ernährungsinhalte stammen ausschließlich aus `plan-data.json` im Projektverzeichnis.

## Setup

```bash
npm install
npm run dev
```

Der Dev-Server läuft unter `http://localhost:5173`.

## Build

```bash
npm run build
```

Erzeugt eine statische Site in `dist/` (inkl. Service Worker + Manifest). Lokal prüfen mit:

```bash
npm run preview
```

## Auf dem Handy installieren

Die App muss einmal über HTTPS (oder `localhost`) im mobilen Browser geöffnet werden, z. B. per `npm run preview -- --host` im selben WLAN oder über ein beliebiges Static-Hosting von `dist/`.

**iPhone (Safari):**
1. Seite öffnen
2. Teilen-Symbol → „Zum Home-Bildschirm"
3. Hinzufügen — die App erscheint als eigenes Icon und startet danach offline

**Android (Chrome):**
1. Seite öffnen
2. Menü (⋮) → „App installieren" bzw. „Zum Startbildschirm hinzufügen"
3. Installieren — die App läuft danach offline als eigenständige App

Nach der ersten erfolgreichen Ladung cached der Service Worker App-Shell und Daten, sodass die App im Flugmodus normal weiterläuft.

## Daten zurücksetzen

Einstellungen (Zahnrad oben rechts) → „Alle Daten zurücksetzen" löscht alle lokalen Haken-, Gewichts-, Schlaf- und Readiness-Einträge auf diesem Gerät unwiderruflich. Die Trainings- und Ernährungsinhalte selbst (`plan-data.json`) sind davon nicht betroffen.
