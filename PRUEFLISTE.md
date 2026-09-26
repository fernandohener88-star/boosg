# Ochs & Graf – offene Punkte vor dem Livegang

Die Website ist präsentationsfertig. Die folgenden Punkte kann nur der Kunde klären. Im Code sind sie mit **[PLATZHALTER]** markiert.

## Vom Kunden benötigt
- [ ] **Fotos von Marius und Yannik**, am besten zusammen in der Werkstatt. Das ist der wichtigste Vertrauensanker für einen lokalen Handwerksbetrieb und gehört auf die Startseite („Über uns“) und auf „Über uns“ (Titelbild).
- [ ] **Fotos der drei Projekte ohne Bilder:** Einfamilienhaus Bellheim, Einfamilienhaus Landau, Bücher Knecht. Solange keine Fotos da sind, stehen sie bewusst nur als Text unter „Weitere Projekte“.
- [ ] **Hosting-Anbieter** (Name, Anschrift) für die Datenschutzerklärung, Abschnitt 2 → `[PLATZHALTER: Name und Anschrift des Hosting-Anbieters]`.
- [ ] **Formular-Endpunkt:** Das Formular prüft die Eingaben und zeigt die Danke-Meldung, versendet aber erst, wenn in `werkzeug/build.py` statt `[PLATZHALTER-FORMULAR-ENDPUNKT]` eine echte Adresse steht, z. B. der Formulardienst des Hosters, Formspree oder ein kleines PHP-Skript.
- [ ] **Adresse bestätigen:** Überall steht Cornichonstraße 5b. Im alten Entwurf stand alternativ Westbahnstraße 5.
- [ ] **Stefan Mattern:** Ist er noch im Team?
- [ ] **Rechtsform:** Im alten Entwurf stand „GdbR“, jetzt steht überall „GbR“. Bitte bestätigen.
- [ ] **Impressum und Datenschutz** juristisch prüfen lassen (Kammer, Stand).

## Inhaltliche Vorschläge (nicht umgesetzt, brauchen Freigabe)
1. Zwei bis drei kurze **Kundenstimmen** mit Vorname und Ort.
2. **Preisorientierung** oder Hinweis wie „Aufmaß und Erstgespräch kostenlos“, falls das stimmt.
3. **Belegbare Zahl** statt allgemeiner Fakten, z. B. „über X Küchen seit 2019“.
4. Ort und Jahr zu den Fotoprojekten (Küche Schwarz & Eiche usw.). Das stärkt das lokale SEO.

## Technik
- **Hosting:** Den Ordner so hochladen, wie er ist (`index.html`, Unterordner, `assets/`, `404.html`, `sitemap.xml`, `robots.txt`, `.htaccess`). Bei Apache-Hostern (IONOS, Strato, all-inkl) greift die `.htaccess` automatisch: 404-Seite, Kompression, Caching, Sicherheits-Header.
- **Domain:** In `werkzeug/build.py` steht `DOMAIN = 'https://www.ochsundgraf.de/'`. Das wird für Canonical, Sitemap und die Vorschau beim Teilen verwendet.
- **Vorschau-Datei:** `dist/Ochs & Graf.html` enthält alle Seiten in einer Datei, zum Präsentieren ohne Server.

## Pflege
- **Texte, Projekte, Team:** `werkzeug/inhalte.py`
- **Neues Foto:**
  1. Als `bilder/ref-XX.webp` ablegen.
  2. Den Alt-Text in `bilder/bilder.json` eintragen.
  3. Die Bildvarianten mit `node werkzeug/bildvarianten.js bilder assets/img` erzeugen.
  4. Das Foto in `inhalte.py` dem Projekt zuordnen.
- **Neu bauen:** `python3 werkzeug/build.py`
