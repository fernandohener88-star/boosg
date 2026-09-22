# TODO – Offene Punkte (mit Inhaberin klären)

Diese Punkte müssen **vor dem Go-Live** mit der Inhaberin besprochen werden.
Alle Angaben, die noch fehlen, sind im Code mit `TODO` markiert.

---

## Pflicht (ohne diese Angaben kein Go-Live)

| # | Thema | Was wird benötigt | Wo im Code |
|---|-------|-------------------|------------|
| 1 | **Telefonnummer bestätigen** | Stimmt `0176 80540425` noch? | `src/data/site.js` → `phone` |
| 2 | **Impressum** | Vollständiges Impressum (Name, Anschrift, USt-IdNr. falls vorhanden) | `impressum.html` erstellen |
| 3 | **Datenschutzerklärung** | Datenschutzerklärung nach DSGVO | `datenschutz.html` erstellen |
| 4 | **Preise** | Preisliste für alle Behandlungen | `src/data/treatments.js` → jedes `price: null` |
| 5 | **Behandlungsdauer** | Ungefähre Dauer je Behandlung | `src/data/treatments.js` → jedes `duration: null` |

---

## Wichtig (verbessert SEO und Trust stark)

| # | Thema | Was wird benötigt | Wo im Code |
|---|-------|-------------------|------------|
| 6 | **Google Place-ID** | Place-ID aus Google Business (für Bewertungslink) | `bewertung.html` + `src/data/site.js` → `googlePlaceId` |
| 7 | **E-Mail-Adresse** | Öffentliche Kontakt-E-Mail (optional, kann auch weggelassen werden) | `src/data/site.js` → `email` |
| 8 | **Instagram-Handle** | @username falls vorhanden | `src/data/site.js` → `instagram` |
| 9 | **Name der Inhaberin** | Vorname/Name für die About-Sektion | `src/data/site.js` → `ownerName` |
| 10 | **FAQ-Antworten** | Antworten auf die 4 offenen FAQ-Fragen | `src/data/treatments.js` → FAQ-Einträge mit `answer: null` |

---

## Optional (nice to have)

| # | Thema | Was wird benötigt |
|---|-------|-------------------|
| 11 | **Öffnungszeiten** | Feste Öffnungszeiten (falls gewünscht auf der Website) |
| 12 | **Hochwertige Fotos** | Eigene Bilder von Behandlungen, Studio, Ergebnissen |
| 13 | **WhatsApp-Nachricht testen** | Termin-Anfrage einmal komplett durchklicken und testen |
| 14 | **Gutschein-Ablauf** | Wie sollen Gutscheine funktionieren? (Vorab-Zahlung, Abholung, Versand?) |

---

## Nach Go-Live

- Google Business: Website-Link eintragen
- Ggf. Weiterleitung alte URL → neue URL einrichten
- Ersten Bewertungs-QR-Code drucken und aufstellen
