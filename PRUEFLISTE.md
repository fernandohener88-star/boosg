# Ochs & Graf – Prüfliste vor dem Livegang

Die Website ist präsentationsfertig. Diese Punkte sollten vor der Veröffentlichung mit Ochs & Graf geklärt werden. Auf der Seite selbst ist nichts davon als Vermerk sichtbar.

## Mit dem Kunden klären
- [ ] **Adresse**: Der Prototyp nannte zwei Varianten (Cornichonstraße 5b oder Westbahnstraße 5). Verwendet wird jetzt überall Cornichonstraße 5b: Kontakt, Footer, Impressum, Karte und Routenlink.
- [ ] **Öffnungszeiten** oder Hinweis „Termine nach Vereinbarung“: bewusst weggelassen.
- [ ] **Stefan Mattern**: Ist er noch im Team? Er steht auf „Über uns“ als Tischlermeister.
- [ ] **Projekte mit Fotos** (Küche Schwarz & Eiche, Badmöbel, Treppe/Garderobe, Küche Eiche & Messing, Sideboard & Esstisch, Küche Weiß): Die Namen sind neutral gewählt. Falls die Fotos zu den bekannten Projekten gehören, lassen sie sich dort zuordnen. Die schwarze Küche, die Garderobe und der Spiegel passen vermutlich zum **Einfamilienhaus Bellheim** (Fischgrätparkett, Küche, Garderobe, Spiegel).
- [ ] **Ferienhaus Westerwald**: Die dunkle Küchenzeile wurde wegen des Dekors „Egger F627 PT“ diesem Projekt zugeordnet. Bitte bestätigen.
- [ ] **Partnerbetriebe**: namentlich nennen oder nicht (Abschnitt „Was wir selbst machen. Und mit wem.“).
- [ ] **Budgetstufen** im Anfrageformular (bis 5.000 € / 5–15 T€ / 15–30 T€ / über 30 T€): passen die?
- [ ] **Antwortzeit** nach einer Anfrage: Ein Versprechen wie „innerhalb von 48 Stunden“ lässt sich ergänzen.

## Vor dem Livegang technisch
- [ ] **Formularversand**: Das Formular prüft die Eingaben und zeigt eine Erfolgsmeldung, versendet aber noch nichts. Dafür muss ein Endpunkt angebunden werden, z. B. der Formulardienst des Hostings (Stelle `fsubmit` in `quelle/seite.dc.html`).
- [ ] **Impressum & Datenschutz** juristisch prüfen lassen. Das betrifft den Hosting-Anbieter, die Kammerangabe „Handwerkskammer der Pfalz“ und das Datum „Stand“.
- [ ] **Hosting**: Die Seite ist eine einzige Datei (`index.html`), die Routen laufen über `#/…`. Sie funktioniert ohne Server-Konfiguration auf jedem Webspace.
- [ ] **Fehlende Fotos**: Für Bücher Knecht, EFH Bellheim, EFH Landau, Teile vom Ferienhaus und die Team-Porträts stehen gestaltete Planskizzen und Monogramme. Echte Fotos ersetzen sie automatisch (siehe unten).

## Pflege: so kommen neue Fotos auf die Seite
1. Das Foto als `bilder/<bild-id>.webp` ablegen, z. B. `bilder/team-02.webp` für das Porträt von Marius oder `bilder/ref-02.webp` für Bücher Knecht.
2. In `bilder/bilder.json` unter `fotos` einen Alt-Text eintragen.
3. `python3 werkzeug/build.py` ausführen. Das Foto ersetzt dann die Skizze an diesem Platz.

| Bild-ID | Platz |
|---|---|
| TEAM-01 | Über uns, großes Bild oben (aktuell Waschtisch-Detail) |
| TEAM-02 / 03 / 04 | Porträts Marius / Yannik / Stefan (aktuell Monogramme) |
| REF-02 bis REF-05 | Bücher Knecht (Titel + 3 Galeriebilder) |
| REF-06 bis REF-10 | EFH Bellheim (Titel + 4 Galeriebilder) |
| REF-13 bis REF-15 | Ferienhaus Westerwald, Galerie |
| REF-16 bis REF-20 | EFH Landau (Titel + 4 Galeriebilder) |
| WEG-02 / WEG-03 | So arbeiten wir: 3D-Aufmaß / CAD-Planung |
| KONTAKT-01 | Kartenvorschau auf der Kontaktseite |
