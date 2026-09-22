# GO-LIVE Checkliste

Schritt für Schritt bis zur Live-Schaltung.

---

## 1. Inhalt fertigstellen (→ TODO.md)

- [ ] Impressum erstellen (`impressum.html`)
- [ ] Datenschutzerklärung erstellen (`datenschutz.html`)
- [ ] Preise in `src/data/treatments.js` eintragen
- [ ] Behandlungsdauer eintragen
- [ ] FAQ-Antworten eintragen
- [ ] Telefonnummer bestätigen
- [ ] WhatsApp-Anfrage einmal komplett durchklicken und testen

---

## 2. Domain & Hosting (Netlify)

- [ ] Netlify-Account anlegen / vorhandenen verwenden
- [ ] Repository mit Netlify verbinden (`fernandohener88-star/boosg`, Branch `ACCENT_aesthetic_studio`)
- [ ] Domain `accent-studio-landau.de` in Netlify eintragen
- [ ] SSL-Zertifikat aktivieren (Netlify macht das automatisch via Let's Encrypt)
- [ ] Build prüfen: `npm run build` muss ohne Fehler durchlaufen

---

## 3. SEO & Google

- [ ] Google Search Console: Website anmelden
- [ ] `sitemap.xml` in Search Console einreichen
- [ ] Google Business Profil: Website-Link auf `https://www.accent-studio-landau.de/` setzen
- [ ] Google Place-ID herausfinden und in `bewertung.html` eintragen (→ TODO Punkt 6)
- [ ] Bewertungslink testen: `/bewertung/` → Button öffnet Google-Bewertungsformular

---

## 4. Finale Qualitätskontrolle

- [ ] Website auf Handy (iOS + Android) testen
- [ ] Termin-Anfrage komplett durchklicken (WhatsApp öffnet sich mit vorausgefülltem Text)
- [ ] Alle Bilder laden (keine Platzhalter)
- [ ] Keine `TODO`-Texte sichtbar auf der Seite
- [ ] Impressum- und Datenschutz-Links funktionieren
- [ ] `https://www.accent-studio-landau.de/bewertung/` öffnet Bewertungsbooster

---

## 5. Nach Go-Live

- [ ] Bewertungs-QR-Code erstellen (URL: `https://www.accent-studio-landau.de/bewertung/`)
- [ ] QR-Code ausdrucken und am Empfang aufstellen
- [ ] Instagram-Profil verlinken (falls vorhanden, → `src/data/site.js` → `instagram`)
- [ ] Erster Monat: Google Analytics / Search Console auf Fehler prüfen

---

## Notfall-Kontakt

Bei technischen Fragen zum Code oder zur Netlify-Konfiguration:
Entwickler kontaktieren oder dieses `README.md` als Ausgangspunkt nutzen.
