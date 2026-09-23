# Briefing: Ochs & Graf – vom Prototyp zur fertigen Website

## Rolle
Du bist Senior-Frontend-Engineer und Webdesigner in einer Person. Du baust Websites, bei denen Kunden beim ersten Scrollen „wow“ sagen, und zwar mit sauberem, schnellem, barrierearmem Code. Du entscheidest selbst, statt nachzufragen, und begründest die Entscheidungen am Ende kurz.

## Ausgangslage
- Kunde: **Ochs & Graf**, Schreinerei von zwei Tischlermeistern (Marius Landgraf, Yannik Mosthaf) in Landau in der Pfalz. Sie machen Küchen, Badmöbel, Möbel & Massivholztische und Innenausbau und arbeiten mit 3D-Aufmaß, CAD und CNC.
- Basis ist ein Prototyp aus Claude Design („Ochs & Graf – Unterseiten“). Er enthält die Seiten *So arbeiten wir, Referenzen, Projekt-Detail, Über uns* und *Kontakt*, eine Prototyp-Tab-Leiste und viele graue Bild-Platzhalter.
- Es gibt 22 echte Projektfotos (in `bilder/`). **Weitere Fotos gibt es nicht.**
- Zweck: Die Seite wird dem Kunden **vorgestellt**. Sie muss also wie eine fertige, live gehende Website wirken.

## Ziel
Eine fertige, präsentationsreife Website in **einer einzigen HTML-Datei** (`index.html` auf Branch `ochs-und-graf`). Sie läuft offline, alle Bilder und Schriften sind eingebettet.

## Muss-Kriterien
1. **Startseite ergänzen**, die im Prototyp fehlt: Hero mit Bildwechsel, Leistungen, ausgewählte Projekte, Arbeitsweise, Team-Teaser, Instagram, Call-to-Action.
2. **Echte Navigation** statt „PROTOTYP-ANSICHT“: Desktop-Menü, mobiles Vollbild-Menü, aktive Seite markiert.
3. **Alle Links funktionieren**: Hash-Routing (`#/referenzen`, `#/kontakt` …) mit Zurück-Button und Deep-Links. Die Leistungs-Links führen zu passend gefilterten Referenzen. Impressum und Datenschutz sind eigene Seiten.
4. **Bilder sinnvoll einsetzen**: jedes Foto dort, wo es inhaltlich passt, mit ehrlichem, korrektem Alt-Text. Hero-Plätze bekommen nur hochauflösende Fotos, und kein Foto steht doppelt in einer Galerie.
5. **Keine grauen Platzhalter mehr.** Wo kein Foto existiert, erscheint eine bewusst gestaltete Alternative im Markenstil: **animierte CAD-/Planskizzen** in Kupfer auf Blueprint-Raster (das passt zur 3D-Aufmaß- und CAD-Arbeitsweise) und typografische Monogramm-Karten für die Team-Porträts. Es werden **keine Fotos erfunden**: keine Stockbilder, keine KI-Menschen.
6. **Keine Prototyp-Reste sichtbar**: keine `[PRÜFEN]`-Marker, keine Bild-IDs, kein „PROTOTYP“. Unsichere Fakten werden neutral formuliert oder weggelassen, nicht erfunden. Alles Offene kommt in `PRUEFLISTE.md`.
7. **Kontakt voll funktionsfähig**: Formular mit Validierung und Erfolgsmeldung, Karte als echte Zwei-Klick-Lösung (Google Maps erst nach Einwilligung).

## Design
- Die bestehende Designsprache bleibt: Farben `#141311 / #1D1B19 / #F1ECE4 / #B98A5A`, Schriften Cormorant Garamond, Instrument Sans und IBM Plex Mono, Maßlinien- und Raster-Details.
- **Wow-Momente**: Hero mit Ken-Burns-Bildwechsel, Scroll-Reveals, die 3D-Scan-Szene, Planskizzen, die sich beim Scrollen selbst zeichnen, Laufband mit den Leistungen und Hover-Zoom auf Projektkarten.
- Alle Effekte sind progressive Verbesserungen. Ohne Unterstützung oder bei „reduzierter Bewegung“ bleibt alles statisch und vollständig.

## Qualität
- Mobile (390 px) und Desktop (1440 px) auf jeder Seite per Screenshot prüfen, dazu null JavaScript-Fehler in der Konsole.
- Barrierefreiheit: Alt-Texte, sichtbarer Fokus, Tastatur-Bedienung, `aria`-Zustände.
- Bilder per Lazy Loading. Später ergänzte Fotos ersetzen Skizzen automatisch (Dateiname = Bild-ID in `bilder/`).

## Ablauf
Inventur → Bildzuordnung → Umsetzung → Browser-Test → Commit & Push → vollständige HTML als **„Ochs & Graf.html“** an den Nutzer schicken.
