# Was noch fehlt: Impressum, Datenschutz & Pflichtangaben

Checkliste für die Website **District Null41**. Hak ab, was du hast — für alles
Abgehakte kann ich die Seiten direkt bauen.

> Das hier ist eine Sammel- und Orientierungsliste, keine Rechtsberatung. Die
> fertigen Texte sollte am Ende jemand prüfen, der dafür geradesteht — Anwalt,
> Steuerberater oder zumindest ein aktueller, seriöser Generator (z. B.
> e-recht24, Dr. Schwenke). Was hier steht, deckt den üblichen Fall eines
> gastronomischen Betriebs ab.

---

## A · Angaben fürs Impressum

Pflicht nach § 5 DDG (das frühere § 5 TMG — viele Vorlagen zitieren noch die
alte Norm, das ist seit Mai 2024 überholt).

### Immer nötig

- [ ] **Vollständiger Name des Betreibers**
      Einzelunternehmen: Vor- und Nachname der Person.
      Gesellschaft: exakte Firmierung inkl. Rechtsform, wie im Handelsregister
      eingetragen (z. B. „District Null41 GmbH").
- [ ] **Ladungsfähige Anschrift** — Straße, Hausnummer, PLZ, Ort.
      Ein Postfach reicht nicht. Ist die Betreiberadresse dieselbe wie die
      Restaurantadresse (Georg-Friedrich-Dentzel-Straße 11)?
- [ ] **Telefonnummer** (0 63 41 / 93 04 42 0 — bestätigen)
- [ ] **E-Mail-Adresse** — Pflicht. Ist `info@districtnull41-landau.de`
      eingerichtet und wird gelesen?
- [ ] **Zuständige Aufsichtsbehörde**
      Gastronomie mit Alkoholausschank ist erlaubnispflichtig, deshalb muss die
      Behörde rein, die die Gaststättenerlaubnis erteilt hat — voraussichtlich
      Stadtverwaltung Landau in der Pfalz, Ordnungs- bzw. Gewerbeamt. Bitte
      Name und Anschrift genau wie auf deiner Erlaubnis.

### Je nach Rechtsform / Situation

- [ ] **Geschäftsführer / Vertretungsberechtigte** — bei GmbH, UG, AG
- [ ] **Handelsregister**: Registergericht + Registernummer (z. B. Amtsgericht
      Landau, HRB 12345) — falls eingetragen
- [ ] **Umsatzsteuer-Identifikationsnummer** nach § 27a UStG (Format DE…)
      ⚠️ Nur die USt-IdNr., **nicht** die Steuernummer vom Finanzamt.
      Wenn keine USt-IdNr. vorhanden: Punkt einfach weglassen.
- [ ] **Berufsbezeichnung & Kammer** — bei Gaststättengewerbe i. d. R. Hinweis
      auf das Gaststättengesetz (GastG), Bundesrepublik Deutschland
- [ ] **Verantwortlich nach § 18 Abs. 2 MStV** — nur nötig, wenn später
      redaktionelle Inhalte dazukommen (Blog, News, Magazin). Aktuell nicht.
- [ ] **Verbraucherschlichtung (§ 36 VSBG)** — Pflichtangabe ab mehr als
      10 Beschäftigten: Erklärung, ob ihr bereit seid, an einem
      Schlichtungsverfahren teilzunehmen. Wie viele Mitarbeitende habt ihr?

### Nicht mehr aufnehmen

- ❌ **Link zur EU-Plattform für Online-Streitbeilegung (OS/ODR).**
      Die Plattform wurde zum 20. Juli 2025 eingestellt. Ältere Vorlagen
      enthalten den Link noch — bitte rauslassen, wenn du eine benutzt.

---

## B · Angaben für die Datenschutzerklärung

Pflicht nach Art. 13 DSGVO.

- [ ] **Verantwortlicher** — Name, Anschrift, E-Mail (meist identisch mit dem
      Impressum)
- [ ] **Datenschutzbeauftragter** — für ein Restaurant in aller Regel **nicht**
      nötig (erst ab 20 Personen, die ständig automatisiert Daten verarbeiten).
      Bitte trotzdem kurz gegenchecken.
- [ ] **Hosting-Anbieter**: Wer hostet die Seite? (Netlify? Strato? IONOS?
      All-Inkl?) Name und Anschrift des Anbieters werden genannt.
- [ ] **Auftragsverarbeitungsvertrag (AVV/DPA)** mit dem Hoster — muss
      abgeschlossen sein. Bei US-Anbietern wie Netlify zusätzlich: Hinweis auf
      Drittlandtransfer und EU-US Data Privacy Framework.
- [ ] **Server-Logfiles** — welche Daten der Hoster protokolliert (IP, Browser,
      Zeitpunkt) und wie lange er sie speichert. Steht in der Doku des Hosters.
- [ ] **Kontaktaufnahme** — was mit Daten passiert, wenn jemand anruft oder
      eine E-Mail schreibt, und wie lange ihr sie aufbewahrt.
- [ ] **Aufsichtsbehörde für Beschwerden**: Der Landesbeauftragte für den
      Datenschutz und die Informationsfreiheit Rheinland-Pfalz, Mainz.
- [ ] **Betroffenenrechte** — Auskunft, Berichtigung, Löschung, Einschränkung,
      Datenübertragbarkeit, Widerspruch, Beschwerderecht. Das ist Standardtext,
      den liefert jeder Generator.

### Gute Nachricht: Was die Seite **nicht** tut

Das verkürzt die Datenschutzerklärung deutlich und spart ein Cookie-Banner:

- Kein Google-Maps-Embed (nur ein Link zur Karten-App)
- Keine Analyse-Tools, kein Tracking, kein Facebook-Pixel
- Keine Cookies, kein LocalStorage
- Kein Instagram-Embed, nur ein normaler Link
- Kein Kontakt- oder Reservierungsformular

**→ Solange das so bleibt, brauchst du kein Consent-Banner.** Sobald ein
Reservierungstool, Analytics oder ein Social-Media-Embed dazukommt, ändert sich
das und wir brauchen ein Einwilligungs-Banner.

---

## C · Zwei technische Punkte, die ich für dich lösen sollte

- [ ] **Google Fonts lokal hosten** ⚠️ *wichtig*
      Die Seite lädt die Schriften aktuell von `fonts.googleapis.com`. Dabei
      wandert die IP-Adresse deiner Besucher zu Google in die USA — das LG
      München hat so einen Fall 2022 abgemahnt-tauglich gemacht. Fix: Ich lege
      die Schriftdateien mit auf den Server, dann verlässt kein Datenpaket mehr
      deine Domain. Sag Bescheid, dann mache ich das — dauert nicht lang.
- [ ] **HTTPS/SSL-Zertifikat** auf der Live-Domain aktiv (bei Netlify,
      Cloudflare & Co. automatisch dabei)
- [ ] **Domain bestätigen**: Ich habe überall `districtnull41-landau.de`
      eingetragen (canonical, Open Graph, Sitemap, robots.txt). Stimmt die, oder
      wird es eine andere?

---

## D · Gastronomie-Pflichtangaben zur Karte

- [ ] **Allergene & Zusatzstoffe (LMIV)**
      Aktuell steht unter der Karte nur, dass euer Service Auskunft gibt. Für
      lose abgegebene Speisen ist mündliche Auskunft zulässig, aber sie muss
      durch eine **schriftliche Dokumentation** im Betrieb gestützt sein, und
      der Hinweis darauf muss deutlich sichtbar sein.
      Sauberer und kundenfreundlicher: Zusatzstoffe direkt an den Gerichten
      kennzeichnen (die üblichen Fußnoten ¹ ² ³ für Farbstoff, Konservierung,
      Geschmacksverstärker … sowie die 14 Allergengruppen).
      **Was ich brauche:** eure Allergen-/Zusatzstofftabelle, dann baue ich die
      Kennzeichnung in die Karte ein.
- [ ] **Füllmengen bei Getränken (PAngV)**
      Bei Bier, Säften und Wasser stehen die Mengen schon dabei. Bei den
      **Cocktails, dem Aperitif und dem Sake fehlen sie noch** — dort muss die
      Füllmenge dran (z. B. „Null41 Sour 0,25 l"). Schick mir die Mengen, dann
      trage ich sie ein.
- [ ] **Preise aktuell?** Die Karte kommt 1:1 aus dem Design-Entwurf. Bitte
      einmal komplett gegenlesen — Preise auf der Website müssen stimmen.

---

## E · Material, das ich noch von dir brauche

- [ ] **Die 5 fehlenden Fotos** — beim Transfer aus dem Design-Tool wurden sie
      abgeschnitten, aktuell sind Platzhalter drin:
      `chopsticks-lachs.png`, `lounge-purple.png`, `noodle-bowl.png`,
      `restaurant-bar.png`, `sake-set.png`
- [ ] **Ein starkes Opener-Foto** für den Seitenanfang — Hochformat ca. 4:5,
      mindestens 1000 × 1250 px (aktuell steht dort der Sashimi-Teller)
- [ ] **Bildrechte**: Wer hat die Fotos gemacht, und habt ihr die Nutzungsrechte
      für die Website? Falls ein Fotograf beauftragt war, will er evtl. im
      Impressum genannt werden.
- [ ] **Personen auf Fotos?** Wenn Gäste oder Mitarbeitende erkennbar sind,
      braucht ihr deren schriftliche Einwilligung.
- [ ] **Logo** als Vektordatei (SVG/AI/EPS), falls vorhanden — aktuell ist der
      Schriftzug rein typografisch gesetzt.

---

## F · Später, falls es dazukommt

- [ ] **Online-Reservierung** (OpenTable, Quandoo, Formular): braucht dann einen
      eigenen Absatz in der Datenschutzerklärung, meist einen AVV mit dem
      Anbieter — und je nach Tool ein Cookie-Banner.
- [ ] **Newsletter**: Double-Opt-in, Nachweis der Einwilligung, AVV mit dem
      Versanddienst, Widerrufshinweis in jeder Mail.
- [ ] **Gutscheinverkauf online**: dann greift Fernabsatzrecht — AGB,
      Widerrufsbelehrung, Widerrufsformular, Button-Lösung („zahlungspflichtig
      bestellen").
- [ ] **Google Business Profil** pflegen (Öffnungszeiten, Fotos, Speisekarten-
      Link) — kein Rechtsthema, aber für die lokale Auffindbarkeit mehr wert
      als jede SEO-Maßnahme auf der Seite selbst.

---

## Wenn du mir das schickst

Sobald **A** und **B** stehen, baue ich `impressum.html` und `datenschutz.html`
im Stil der Seite und setze die Links in den Footer beider Seiten — das
Impressum muss von jeder Seite aus mit einem Klick erreichbar sein. Bis die
Seiten Inhalt haben, verlinke ich sie bewusst nicht: ein halbfertiges Impressum
ist schlechter als noch keins.

Für **C** brauche ich nur dein Go, das kann ich sofort erledigen.
