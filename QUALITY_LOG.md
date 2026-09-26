# Qualitätsprotokoll – Website Ochs & Graf

Messung: Lighthouse 12, Mobil-Profil (gedrosselt), lokaler Server. Screenshots mit Playwright in 1440, 768 und 390 px.
Skala 1–10. „Agentur“ = Würde eine Top-Agentur das so ausliefern?

---

## Runde 0 – Ausgangslage (dunkle Einzelseiten-App aus dem Claude-Design-Export)

| Kategorie | Score | Begründung |
|---|---|---|
| Erster Eindruck | 5 | Größte Zeile ist der englische Slogan, was die Firma macht, steht klein darüber. Fast schwarze Seite wirkt nach Bar oder Agentur, nicht nach Schreinerei. |
| Design & Typografie | 6 | Ordentlich, aber dunkel und kühl. Helle Fotos wirken auf Schwarz grell. |
| Texte | 6 | Viele Agentur-Muster: Zahlenreihe „2019 / 2 / 3D / A–Z“, Laufband, Kürzel „PRJ-07“, „01/02“-Nummerierung. |
| Conversion | 6 | Vier Aktionen konkurrieren auf dem ersten Bildschirm (Kopf, 2 Hero-Knöpfe, feste Leiste). |
| Mobile | 5 | Doppelte Führung, Hero-Knopf von der Leiste verdeckt, 4,2 MB vor dem ersten Bild. |
| Performance | 2 | Lighthouse 26. Erster Inhalt nach 21,8 s, LCP 24,1 s, 4,2 MB. |
| SEO | 4 | Eine einzige URL mit Hash-Routen, ohne JavaScript kein Inhalt. Lighthouse zeigt 100, das ist aber irreführend. |
| Barrierefreiheit | 6 | Lighthouse 96, `lang` fehlt, alles hängt an JavaScript. |
| DSGVO | 7 | Schriften lokal, Karte als Zwei-Klick-Lösung. Hosting-Angaben fehlen. |
| Agentur | 4 | Technisch nicht auslieferbar. |

---

## Runde 1 – Neubau als statische Website

**Top 5:**
1. **Architektur neu:** echte Einzelseiten (HTML/CSS, 1 kleines Skript) statt 4,2-MB-App. Bilder in 480/960/1600 px mit `srcset`, Schriften auf Latein reduziert (390 → 105 KB).
2. **Design-Richtung „Werkstatt bei Tageslicht“:** heller Leinen-Grund, Walnuss-Schrift, ein Akzent nur für Anfragen. Das passt zu hellem Holz und zur Zielgruppe (Bauherren 30–60).
3. **ENTFERNT:** Bildwechsel-Karussell, Laufband, Zahlenreihe, Instagram-Kacheln (waren eigene Fotos, die als Posts getarnt waren), Planskizzen, Monogramme, Projektkürzel, feste Handy-Leiste. Skizzen-Projekte stehen jetzt ehrlich als Textliste „Weitere Projekte“.
4. **5-Sekunden-Test:** H1 sagt jetzt, was und wo: „Küchen, Bäder und Möbel nach Maß – aus unserer Werkstatt in Landau.“ Der Slogan steht nur noch im Fuß.
5. **Formular vereinfacht:** ein Schritt statt vier, Budget-Feld (erfundene Preisstufen) und doppelte Kontaktfelder entfernt. Telefonnummern stehen groß.

**Ergebnis:** Lighthouse Mobil: Performance 99–100, Barrierefreiheit 95–100, Best Practices 100, SEO 100. LCP 1,5–2,0 s, 116–238 KB pro Seite. Das ist deutlich besser als Runde 0.

---

## Runde 2 – Kritik am Neubau

| Kategorie | Score | Begründung |
|---|---|---|
| Erster Eindruck | 8 | Klar, was und wo. Aber die H1 läuft über 5 Zeilen, der Anfrage-Knopf klebt am unteren Rand. |
| Design & Typografie | 7,5 | Ruhig und warm. Aber Leistungen und „Ausgewählte Projekte“ sind zweimal dasselbe Bildraster, dieselbe Küche erscheint dreimal. |
| Texte | 8 | Echte Kundentexte, kaum Floskeln. |
| Conversion | 8 | Ein Hauptknopf, Telefonnummer im Hero. |
| Mobile | 7 | Startseite über 9.000 px lang, verwaiste Einzelkacheln bei 768 px, Formular-Abstände fehlen. |
| Performance | 10 | Lighthouse 99–100. |
| SEO | 9 | Einzelseiten, Meta, Canonical, Sitemap, JSON-LD. |
| Barrierefreiheit | 8 | Lighthouse meldet Kontrastfehler: abgedunkelte Schritte auf „So arbeiten wir“. |
| DSGVO | 8 | Hosting-Angabe fehlt (nur der Kunde weiß sie). Formular-Endpunkt offen. |
| Agentur | 7 | Solide, aber noch nicht fein genug. |

**Top 5:**
1. **ENTFERNT:** Bilder aus den Leistungen. Sie sind jetzt eine typografische Liste. Das Bildraster gibt es nur noch einmal (Projekte). Die Seite ist auf dem Handy etwa 30 % kürzer.
2. **Hero:** H1 kleiner (3 Zeilen), Spaltenverhältnis angepasst. Der Anfrage-Knopf steht jetzt sicher im ersten Bildschirm.
3. **Szene „Vom Scan zum Möbel“:** Kein Abdunkeln mehr (Kontrast). Fortschritt jetzt direkt an den Textblock gekoppelt, weil Bühne und Text vorher auseinanderliefen. Punkte kräftiger.
4. **Waisen beseitigt:** erste Referenz in voller Breite, Galerie-Regel für die letzte Einzelkachel, drei Projekte ab 700 px in einer Reihe.
5. **Formular:** Abstand der Einleitung repariert, auf dem Handy randlos.

**Ergebnis:** Lighthouse Mobil überall 99–100 / 100 / 100 / 100. Die Startseite ist klarer strukturiert und hat abwechselnde Sektionsformen: Liste, Bilder, Schritte, Zweispalter, dunkles Band. Das ist besser als Runde 1.

---

## Runde 3 – Kritik

| Kategorie | Score | Begründung |
|---|---|---|
| Erster Eindruck | 9 | Hero passt auf einen Bildschirm, Aussage und Aktion sofort klar. |
| Design & Typografie | 8,5 | Einheitlich. Kleinigkeiten: gleiches Foto auf Start und „Über uns“. |
| Texte | 8 | „Wofür wir stehen“ wiederholt fast wörtlich den Einleitungssatz. Füllzeile „Auch diese Projekte haben wir umgesetzt.“ |
| Conversion | 8,5 | Auf dem Handy ist die Telefonnummer erst im Menü erreichbar. Für Handwerker ist der Anruf aber der wichtigste Kontaktweg. |
| Mobile | 8,5 | Siehe Conversion. Hero-Text 5 Zeilen. |
| Performance | 10 | – |
| SEO | 9 | Vorschaubild zum Teilen als WebP im Hochformat. WhatsApp und Facebook bevorzugen JPEG 1200×630. |
| Barrierefreiheit | 10 | Tastatur, Fokus, Überschriften, Alt-Texte, ohne JS vollständig. |
| DSGVO | 8,5 | Wie oben. Sicherheits-Header fehlen. |
| Agentur | 8 | Fast. |

**Top 5:**
1. **ENTFERNT:** Abschnitt „Wofür wir stehen“ (Dopplung) und die Füllzeile bei „Weitere Projekte“.
2. **„Anrufen“ im Handy-Kopf.** Logo bleibt dabei einzeilig, der Zusatz „Schreinerei“ entfällt unter 480 px.
3. **Über-uns-Bild gewechselt** (Esstisch in der Werkstatt statt Dopplung von der Startseite).
4. **Teilen und Hosting:** `og.jpg` 1200×630, Twitter-Card, `.htaccess` mit 404-Seite, Kompression, Caching und Sicherheits-Headern.
5. **Hero-Text gekürzt** (5 → 4 Zeilen mobil), Formularfelder bündig ausgerichtet.

**Ergebnis:** Lighthouse Mobil 99–100 überall. Selbsttest: 1 H1 pro Seite, keine Überschriftensprünge, keine defekten Links, Lightbox und Menü per Tastatur, ohne JS vollständig, Einzeldatei fehlerfrei. Besser als Runde 2.

---

## Runde 4 – Kritik

| Kategorie | Score | Begründung |
|---|---|---|
| Erster Eindruck | 9 | – |
| Design & Typografie | 8,5 | Kleine Serifen-Überschriften (Cormorant 400) wirken bei 24–30 px dünn. Der Datei-Upload-Knopf im Formular ist browser-grau und fällt aus dem System. |
| Texte | 9 | Dopplungen entfernt, nur Kundentexte. |
| Conversion | 9 | Auf Projektseiten konkurrieren „Ähnliches Projekt anfragen“, „Alle Referenzen“ und „Nächstes Projekt“ um Aufmerksamkeit. |
| Mobile | 8,5 | Startseite noch 7.900 px, die drei Auswahl-Projekte im Hochformat nehmen am Handy je einen ganzen Bildschirm ein. „Anrufen“ im Kopf mit kleiner Tippfläche. |
| Performance | 10 | – |
| SEO | 9,5 | – |
| Barrierefreiheit | 9,5 | Leere Fehlerzeilen erzeugen Lücken. |
| DSGVO | 9 | Nur noch Kundendaten offen (Hoster), sauber als [PLATZHALTER] markiert. |
| Agentur | 8,5 | – |

**Top 5:**
1. **ENTFERNT:** doppelter Link „Alle Referenzen“ auf Projektseiten. Pro Seite gibt es jetzt genau eine Hauptaktion.
2. **Überschriften h3 in 500** statt 400 für bessere Lesbarkeit bei kleinen Größen.
3. **Datei-Upload** im Stil der Zweitknöpfe, leere Fehlerzeilen ausgeblendet, Feldabstände vereinheitlicht.
4. **Auswahl-Projekte mobil im Querformat** (4:3). Startseite mobil 7.924 → 7.399 px.
5. **„Anrufen“ im Handy-Kopf** mit 44 px Tippfläche.

**Ergebnis:** Lighthouse Mobil: alle 8 geprüften Seiten 99–100 / 100 / 100 / 100. Desktop: 100 / 100 / 100 / 100. Besser als Runde 3.

---

## Runde 5 – Kritik (Abschlussprüfung)

Was Lighthouse nicht misst, habe ich gezielt gesucht:

| Kategorie | Score | Begründung |
|---|---|---|
| Erster Eindruck | 9,5 | Aussage, Ort, Menschen, Aktion und Telefon auf dem ersten Bildschirm, mobil wie Desktop. |
| Design & Typografie | 9 | Ein System, zwei Schriften, ein Akzent, ein Radius, zwei Knopfarten. Echte Fotos der Inhaber würden die letzte Lücke schließen (Kundensache). |
| Texte | 9 | Ausschließlich Kundentexte, keine Floskeln, keine Statistiken ohne Quelle. |
| Conversion | 9,5 | Eine Hauptaktion pro Seite, Telefon überall mit einem Tipp erreichbar, Formular in einem Schritt. |
| Mobile | 9,5 | Kein festes Band, das Inhalte verdeckt. Hero passt auf einen Bildschirm, Menü bedienbar mit Esc und inert-Hintergrund. |
| Performance | 10 | Mobil 99–100, LCP 1,5–1,9 s, 113–297 KB pro Seite (vorher 4.196 KB). |
| SEO | 9,5 | Einzelseiten, Titel und Beschreibung je Seite, Canonical, Sitemap, robots, BreadcrumbList, LocalBusiness-JSON-LD, Teilen-Vorschau. |
| Barrierefreiheit | 10 | Fehler gefunden und behoben: Fokusring im dunklen Band hatte nur 2,55:1 Kontrast, jetzt 15:1. Filter-Ergebnis wird Screenreadern angesagt. |
| DSGVO | 9 | Keine Cookies, keine Tracker, Schriften lokal, Karte erst nach Einwilligung (widerrufbar). Offen: Hoster-Angabe (Kunde). |
| Agentur | 9 | Ja – mit den Kundenfotos der Inhaber wäre es eine 10. |

**Umgesetzt:**
1. Fokusring auf dunklem Grund hell (2,55 → 15,2:1).
2. **ENTFERNT:** Einblend-Animation im Hero. Der Inhalt steht sofort, ohne Verzögerung.
3. Mobiles Menü: Seite dahinter per `inert` gesperrt, Tastatur bleibt im Menü.
4. Filter: Ergebnis wird per `aria-live` angesagt („4 Projekte mit Fotos“).
5. `PRUEFLISTE.md` und `BRIEFING.md` auf den Neubau aktualisiert.

**Ergebnis:** Lighthouse Mobil Start 100 / 100 / 100 / 100, Referenzen 99 / 100 / 100 / 100. Alle Kategorien ≥ 9.

**Abbruch:** Eine weitere Runde fand nur noch Geschmacksfragen oder Punkte, die Kundeninhalte brauchen (Fotos der Inhaber, Kundenstimmen, Hoster, Formular-Endpunkt). Siehe `PRUEFLISTE.md`.

---

## Übersicht Start → Ende

| Kategorie | Runde 0 | Runde 5 |
|---|---|---|
| Erster Eindruck | 5 | 9,5 |
| Design & Typografie | 6 | 9 |
| Texte | 6 | 9 |
| Conversion | 6 | 9,5 |
| Mobile | 5 | 9,5 |
| Performance | 2 (LH 26) | 10 (LH 99–100) |
| SEO | 4 | 9,5 |
| Barrierefreiheit | 6 | 10 |
| DSGVO | 7 | 9 |
| Agentur | 4 | 9 |
