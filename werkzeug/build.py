"""Baut die Website von Ochs & Graf.

Ausgabe 1 (Hosting):   index.html, <seite>/index.html, 404.html, sitemap.xml, robots.txt
                       – echte Einzelseiten, Bilder als Dateien mit srcset, kein Framework.
Ausgabe 2 (Vorschau):  dist/Ochs & Graf.html – alle Seiten in einer Datei, offline lauffähig.

Quellen: werkzeug/inhalte.py (Texte, Projekte), assets/ (CSS, JS, Schriften, Bilder).
Aufruf:  python3 werkzeug/build.py
"""
import base64, html, json, os, re, sys

WURZEL = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.insert(0, os.path.dirname(__file__))
os.chdir(WURZEL)
import inhalte as I  # noqa: E402

DOMAIN = 'https://www.ochsundgraf.de/'
MASSE = json.load(open('assets/img/masse.json', encoding='utf-8'))
FOTOS = json.load(open('bilder/bilder.json', encoding='utf-8'))['fotos']
e = lambda t: html.escape(str(t), quote=True)


class Ausgabe:
    """Kapselt, wie Links, Bilder und Assets in der jeweiligen Ausgabe geschrieben werden."""

    def __init__(self, einzeldatei, route=''):
        self.einzeldatei, self.route = einzeldatei, route
        self.bilder_genutzt = set()

    def link(self, ziel):
        if self.einzeldatei:
            return '#/' + ziel
        pre = '../' * self.route.count('/')
        return (pre + ziel) or './'

    def asset(self, pfad):
        return ('../' * self.route.count('/')) + 'assets/' + pfad

    def bild(self, bid, sizes='100vw', eager=False, alt=None, klasse='', gross=False):
        key = bid.lower()
        m = MASSE[key]
        foto = FOTOS.get(bid.upper(), {})
        alt = foto.get('alt', '') if alt is None else alt
        stil = ' style="object-position:%s"' % foto['pos'] if foto.get('pos') else ''
        lade = ' loading="eager" fetchpriority="high"' if eager else ' loading="lazy"'
        k = f' class="{klasse}"' if klasse else ''
        mittel = max(v for v in m['varianten'] if v <= 960) if any(v <= 960 for v in m['varianten']) else m['varianten'][0]
        if self.einzeldatei:
            self.bilder_genutzt.add(key)
            return '<img data-b="%s-%s" alt="%s" width="%s" height="%s" decoding="async"%s%s>' % (key, mittel, e(alt), m['w'], m['h'], k, stil)
        pfad = lambda v: self.asset('img/%s-%s.webp' % (key, v))
        srcset = ', '.join('%s %sw' % (pfad(v), v) for v in m['varianten'])
        gr = ' data-gross="%s"' % pfad(m['varianten'][-1]) if gross else ''
        return ('<img src="%s" srcset="%s" sizes="%s" alt="%s" width="%s" height="%s" decoding="async"%s%s%s%s>'
                % (pfad(mittel), srcset, sizes, e(alt), m['w'], m['h'], lade, k, stil, gr))


# ---------------------------------------------------------------- Bausteine

def kopf(A, aktiv):
    cur = ' aria-current="page"'
    nav = ''.join('<a href="%s"%s>%s</a>' % (A.link(z), cur if k == aktiv else '', t) for k, t, z in I.NAV)
    menue = ''.join(f'<a href="{A.link(z)}">{t}</a>' for k, t, z in [('start', 'Start', '')] + I.NAV)
    return f'''<a class="skip" href="#inhalt">Zum Inhalt springen</a>
<header class="kopf">
  <div class="huelle kopf__innen">
    <a class="marke" href="{A.link('')}" aria-label="Ochs &amp; Graf – Startseite"><span class="marke__name">Ochs &amp; Graf</span><span class="marke__zusatz">Schreinerei</span></a>
    <nav class="nav" aria-label="Hauptnavigation">{nav}</nav>
    <a class="kopf__tel" href="tel:+4963417005116">06341 7005116</a>
    <a class="knopf kopf__knopf" href="{A.link('kontakt/')}">Projekt anfragen</a>
    <a class="kopf__anruf" href="tel:+4963417005116" aria-label="Anrufen: 06341 7005116">Anrufen</a>
    <button class="menue-knopf" type="button" aria-expanded="false" aria-controls="menue"><span class="menue-knopf__text">Menü</span><span class="menue-knopf__striche" aria-hidden="true"></span></button>
  </div>
</header>
<div class="menue" id="menue" hidden>
  <nav aria-label="Menü">{menue}</nav>
  <div class="menue__kontakt">
    <span>Direkt anrufen</span>
    <a href="tel:+491749353078">Yannik · 0174 9353078</a>
    <a href="tel:+4917682042302">Marius · 0176 82042302</a>
    <a href="mailto:info@ochsundgraf.de">info@ochsundgraf.de</a>
  </div>
</div>'''


def fuss(A):
    leist = ''.join(f'<li><a href="{A.link("referenzen/")}{"" if A.einzeldatei else "#" + l["filter"]}" data-filter="{l["filter"]}">{l["t"]}</a></li>' for l in I.LEISTUNGEN)
    return f'''<footer class="fuss">
  <div class="huelle">
    <div class="fuss__raster">
      <div>
        <span class="marke__name">Ochs &amp; Graf</span>
        <address>M. Landgraf &amp; Y. Mosthaf GbR<br>Cornichonstraße 5b · 76829 Landau in der Pfalz<br><a href="tel:+4963417005116">06341 7005116</a> · <a href="mailto:info@ochsundgraf.de">info@ochsundgraf.de</a></address>
      </div>
      <div><h2>Leistungen</h2><ul>{leist}</ul></div>
      <div><h2>Einzugsgebiet</h2><p>Landau und die Südpfalz – Bellheim, Edenkoben, Bad Bergzabern, Annweiler, Herxheim, Germersheim, Neustadt. Auf Anfrage auch überregional.</p></div>
    </div>
    <div class="fuss__unten">
      <span>© 2026 Ochs &amp; Graf · The Wood. The Better.</span>
      <span><a href="https://www.instagram.com/ochsundgraf/" rel="noopener">Instagram</a> · <a href="{A.link('impressum/')}">Impressum</a> · <a href="{A.link('datenschutz/')}">Datenschutz</a></span>
    </div>
  </div>
</footer>'''


def abschluss(A):
    return f'''<section class="abschluss" aria-labelledby="abschluss-t">
  <div class="huelle">
    <h2 id="abschluss-t">Habt ihr ein Projekt im Kopf?</h2>
    <p class="lead">Erzählt uns kurz, was ihr vorhabt. Wir melden uns persönlich und kommen zum Aufmaß zu euch.</p>
    <div class="aktionen"><a class="knopf" href="{A.link('kontakt/')}">Projekt anfragen</a></div>
    <div class="abschluss__tel">
      <div>Yannik Mosthaf<a href="tel:+491749353078">0174 9353078</a></div>
      <div>Marius Landgraf<a href="tel:+4917682042302">0176 82042302</a></div>
      <div>Werkstatt<a href="tel:+4963417005116">06341 7005116</a></div>
    </div>
  </div>
</section>'''


def pfad(A, teile):
    li = ''.join(f'<li><a href="{A.link(z)}">{t}</a></li>' if z is not None else f'<li aria-current="page">{t}</li>' for t, z in teile)
    return f'<nav aria-label="Brotkrumen"><ol class="pfad">{li}</ol></nav>'


def projektkarte(A, p, sizes, h='h3'):
    return f'''<a class="projekt" href="{A.link('referenzen/' + p['slug'] + '/')}" data-kat="{' '.join(p['kat'])}">
  <div class="projekt__bild">{A.bild(p['bilder'][0][0], sizes, alt='')}</div>
  <span class="projekt__art">{p['art']}</span>
  <{h}>{p['t']}</{h}>
  <p>{p['kurz']}</p>
</a>'''


# ---------------------------------------------------------------- Seiten

def seite_start(A):
    leist = ''.join(f'''<a class="leistung" href="{A.link('referenzen/')}{'' if A.einzeldatei else '#' + l['filter']}" data-filter="{l['filter']}"><h3>{l['t']}</h3><p>{l['d']}</p><span class="leistung__mehr">Projekte ansehen →</span></a>''' for l in I.LEISTUNGEN)
    auswahl = ''.join(projektkarte(A, I.projekt(s), '(min-width: 1000px) 33vw, (min-width: 700px) 50vw, 100vw') for s in I.AUSWAHL)
    schritte = ''.join(f'<li><h3>{s["t"]}</h3><p>{s["kurz"]}</p></li>' for s in I.SCHRITTE)
    return f'''<section class="einstieg">
  <div class="huelle einstieg__raster">
    <div class="einblenden">
      <span class="vorzeile">Schreinerei · Landau in der Pfalz</span>
      <h1>Küchen, Bäder und Möbel nach Maß – aus unserer Werkstatt in Landau.</h1>
      <p class="lead">Wir sind Marius Landgraf und Yannik Mosthaf, zwei Tischlermeister. Vom 3D-Aufmaß bis zur Montage bekommt ihr bei uns alles aus einer Hand.</p>
      <div class="aktionen"><a class="knopf" href="{A.link('kontakt/')}">Projekt anfragen</a><a class="textlink" href="{A.link('referenzen/')}">Referenzen ansehen</a></div>
      <p class="einstieg__tel">Lieber direkt sprechen? <a href="tel:+4963417005116">06341 7005116</a></p>
    </div>
    <div class="einstieg__bild einblenden einblenden--2">{A.bild('REF-28', '(min-width: 900px) 45vw, 100vw', eager=True)}</div>
  </div>
  <div class="huelle">
    <ul class="fakten">
      <li><strong>Meisterbetrieb</strong>Zwei Tischlermeister</li>
      <li><strong>Seit 2019</strong>Selbstständig in Landau</li>
      <li><strong>Südpfalz</strong>Und auf Anfrage überregional</li>
    </ul>
  </div>
</section>

<section class="sektion" aria-labelledby="leist-t">
  <div class="huelle">
    <div class="kopfzeile">
      <h2 id="leist-t">Was wir für euch bauen</h2>
      <p class="text">Wir sind spezialisiert auf Massivholz. Standardteile wie Küchenkorpusse kommen von regionalen Partnern – alles Individuelle entsteht in unseren eigenen Hallen.</p>
    </div>
    <div class="leistungen">{leist}</div>
  </div>
</section>

<section class="sektion" aria-labelledby="ausw-t">
  <div class="huelle">
    <div class="kopfzeile">
      <h2 id="ausw-t">Ausgewählte Projekte</h2>
      <p><a class="textlink" href="{A.link('referenzen/')}">Alle Referenzen</a></p>
    </div>
    <div class="projekte projekte--drei">{auswahl}</div>
  </div>
</section>

<section class="sektion" aria-labelledby="ablauf-t">
  <div class="huelle">
    <div class="kopfzeile">
      <h2 id="ablauf-t">So läuft ein Projekt bei uns</h2>
      <p class="text">Durch das 3D-Aufmaß und die CAD-Planung wisst ihr vorher genau, was ihr bekommt. Und wir sind bei der Montage schnell wieder raus.</p>
    </div>
    <ol class="schritte">{schritte}</ol>
    <p style="margin-top:48px"><a class="textlink" href="{A.link('so-arbeiten-wir/')}">Mehr zu unserer Arbeitsweise</a></p>
  </div>
</section>

<section class="sektion" aria-labelledby="wir-t">
  <div class="huelle zweispalter">
    {A.bild('REF-22', '(min-width: 900px) 50vw, 100vw')}
    <div>
      <span class="vorzeile">Über uns</span>
      <h2 id="wir-t">„Arbeit macht Bock.“</h2>
      <p class="text">Marius und Yannik haben sich 2019 noch während der Meisterschule selbstständig gemacht – zuerst als Parkettleger, seit dem Meistertitel 2020 als Schreinerei. Was die beiden verbindet: die gleichen Vorstellungen von Qualität, Arbeitsweise und Kundenkontakt.</p>
      <a class="textlink" href="{A.link('ueber-uns/')}">Mehr über uns</a>
    </div>
  </div>
</section>

{abschluss(A)}'''


def seite_weg(A):
    schr = ''.join(f'''<li><span class="nr">Schritt {i + 1} von 4</span><h2>{s["t"]}</h2><p>{s["d"]}</p></li>''' for i, s in enumerate(I.SCHRITTE))
    return f'''<section class="seitenkopf">
  <div class="huelle">
    {pfad(A, [('Start', ''), ('So arbeiten wir', None)])}
    <h1>Vom 3D-Aufmaß bis zur Montage</h1>
    <p class="lead">Wir sind eine kleine Schreinerei und lieben das Arbeiten mit Massivholz. Mit unserem Netzwerk an Partnerbetrieben lagern wir einzelne Produktionsschritte aus und konzentrieren uns auf das traditionelle Schreinerhandwerk. Gleichzeitig arbeiten wir mit moderner Technik: 3D-Aufmaß, CAD-Software und CNC-Maschinen.</p>
  </div>
</section>

<section aria-label="Vom Scan zum Möbel – vier Schritte">
  <div class="huelle szene">
    <div class="szene__buehne" aria-hidden="true">
      <div class="szene__rahmen">
        <canvas></canvas>
        {A.bild('WEG-05', '(min-width: 900px) 55vw, 100vw', alt='', klasse='szene__foto')}
        <span class="szene__phase">3D-Aufmaß · Punktwolke</span>
      </div>
    </div>
    <ol class="szene__schritte">{schr}</ol>
  </div>
</section>

<section class="sektion" aria-labelledby="wer-t">
  <div class="huelle">
    <div class="kopfzeile"><h2 id="wer-t">Was wir selbst machen – und mit wem</h2></div>
    <div class="listen">
      <div><h3>In unseren Hallen</h3><ul><li>Esstische, Deckplatten, Holzfußgestelle und Waschtische</li><li>Gravurfräsungen</li><li>Integrierte LEDs</li><li>Besondere Ausschnitte</li></ul></div>
      <div><h3>Mit regionalen Partnern</h3><ul><li>Küchenkorpusse und weitere Standardfertigung</li><li>Netzwerk regionaler Betriebe</li></ul></div>
    </div>
  </div>
</section>

{abschluss(A)}'''


def seite_referenzen(A):
    filt = ''.join(f'<button type="button" data-k="{k}" aria-pressed="false">{t}</button>' for k, t in I.FILTER)
    karten = ''.join(projektkarte(A, p, '(min-width: 700px) 50vw, 100vw' if i else '100vw', 'h2') for i, p in enumerate(I.PROJEKTE))
    weitere = ''.join(f'''<li data-kat="{' '.join(p['kat'])}"><div><span class="projekt__art">{p['art']}</span><h3>{p['t']}</h3></div><p>{p['d']}</p></li>''' for p in I.WEITERE)
    return f'''<section class="seitenkopf">
  <div class="huelle">
    {pfad(A, [('Start', ''), ('Referenzen', None)])}
    <h1>Referenzen aus Landau und der Südpfalz</h1>
    <p class="lead">Schaut gerne, an welchen Projekten wir zuletzt gearbeitet haben. Ist was für euch dabei? Dann meldet euch per Telefon, Mail oder Kontaktformular.</p>
  </div>
</section>
<section class="sektion" style="padding-top:0" aria-label="Projekte">
  <div class="huelle">
    <div class="filter" role="group" aria-label="Projekte filtern" hidden>{filt}</div>
    <div class="projekte projekte--gross">{karten}</div>
    <div class="weitere-block" style="margin-top:var(--sektion)">
      <div class="kopfzeile"><h2>Weitere Projekte</h2></div>
      <ul class="weitere">{weitere}</ul>
    </div>
  </div>
</section>
{abschluss(A)}'''


def seite_projekt(A, p, naechstes):
    eck = ''.join(f'<div><dt>{k}</dt><dd>{v}</dd></div>' for k, v in p['eck'])
    gal = ''.join(f'''<figure><button type="button" aria-label="Bild vergrößern: {e(c)}">{A.bild(b, '(min-width: 700px) ' + ('100vw' if i == 0 else '50vw') + ', 100vw', eager=(i == 0), alt=FOTOS.get(b, {}).get('alt', c), gross=True)}</button><figcaption>{c}</figcaption></figure>''' for i, (b, c) in enumerate(p['bilder']))
    return f'''<section class="seitenkopf">
  <div class="huelle">
    {pfad(A, [('Start', ''), ('Referenzen', 'referenzen/'), (p['t'], None)])}
    <span class="vorzeile">{p['art']}</span>
    <h1>{p['t']}</h1>
    <div class="kopfzeile" style="margin:0;align-items:start">
      <p class="lead">{p['d']}</p>
      <dl class="eckdaten">{eck}</dl>
    </div>
  </div>
</section>
<section class="sektion" style="padding-top:0" aria-label="Bilder">
  <div class="huelle">
    <div class="galerie">{gal}</div>
    <div class="aktionen" style="margin:56px 0 var(--sektion)"><a class="knopf" href="{A.link('kontakt/')}">Ähnliches Projekt anfragen</a><a class="textlink" href="{A.link('referenzen/')}">Alle Referenzen</a></div>
    <a class="naechstes" href="{A.link('referenzen/' + naechstes['slug'] + '/')}"><span>Nächstes Projekt</span><strong>{naechstes['t']} →</strong></a>
  </div>
</section>
<dialog class="lightbox" aria-label="Bildansicht">
  <div class="lightbox__buehne">
    <div class="lightbox__kopf"><span class="lightbox__zahl"></span><button type="button" data-zu>Schließen</button></div>
    <div class="lightbox__bild"><img alt=""></div>
    <div class="lightbox__fuss"><button type="button" data-zurueck>← Zurück</button><button type="button" data-vor>Weiter →</button></div>
  </div>
</dialog>'''


def seite_ueber(A):
    team = ''.join(f'''<li><h3>{m['name']}</h3><p class="rolle">{m['rolle']}</p><ul>{''.join(f'<li>{q}</li>' for q in m['quals'])}</ul>{f'<a href="tel:{m["tel"]}">{m["tel_anz"]}</a>' if m['tel'] else ''}</li>''' for m in I.TEAM)
    chronik = ''.join(f'<li><time>{c[0]}</time><h3>{c[1]}</h3><p>{c[2]}</p></li>' for c in I.CHRONIK)
    det = ''.join(f'<figure>{A.bild(b, "(min-width: 700px) 33vw, 100vw")}<figcaption>{c}</figcaption></figure>' for b, c in I.DETAILS)
    return f'''<section class="seitenkopf">
  <div class="huelle">
    {pfad(A, [('Start', ''), ('Über uns', None)])}
    <h1>Zwei Tischlermeister aus Landau</h1>
    <p class="lead">Zwei Meister im Tischler-Handwerk mit einer Vision: gleiche Vorstellungen von Qualität, Arbeitsweise, Zusammenarbeit und Kundenkontakt. Arbeit macht Bock.</p>
  </div>
</section>
<div class="huelle breitbild">{A.bild('REF-37', '100vw', eager=True)}</div>
<section class="sektion" aria-labelledby="team-t">
  <div class="huelle">
    <div class="kopfzeile"><h2 id="team-t">Das Team</h2></div>
    <ul class="team">{team}</ul>
  </div>
</section>
<section class="sektion" aria-labelledby="chronik-t">
  <div class="huelle">
    <div class="kopfzeile"><h2 id="chronik-t">Von der Meisterschule zur Schreinerei</h2></div>
    <ol class="chronik">{chronik}</ol>
  </div>
</section>
<section class="sektion" aria-labelledby="detail-t">
  <div class="huelle">
    <div class="kopfzeile"><h2 id="detail-t">Handwerk im Detail</h2><p class="text">Gefertigt in unserer Werkstatt in Landau.</p></div>
    <div class="details">{det}</div>
  </div>
</section>
{abschluss(A)}'''


def seite_kontakt(A):
    bereiche = ''.join(f'<label><input type="checkbox" name="bereich" value="{b}"><span>{b}</span></label>' for b in I.BEREICHE)
    return f'''<section class="seitenkopf">
  <div class="huelle">
    {pfad(A, [('Start', ''), ('Kontakt', None)])}
    <h1>Projekt anfragen</h1>
    <p class="lead">Ruft uns an oder schreibt uns kurz, was ihr vorhabt. Wir melden uns persönlich bei euch.</p>
  </div>
</section>
<section class="sektion" style="padding-top:0" aria-label="Kontakt">
  <div class="huelle kontakt">
    <div>
      <ul class="direkt">
        <li><span>Yannik Mosthaf, Tischlermeister</span><a href="tel:+491749353078">0174 9353078</a></li>
        <li><span>Marius Landgraf, Tischlermeister</span><a href="tel:+4917682042302">0176 82042302</a></li>
        <li><span>Werkstatt</span><a href="tel:+4963417005116">06341 7005116</a></li>
        <li><span>E-Mail</span><a href="mailto:info@ochsundgraf.de">info@ochsundgraf.de</a></li>
      </ul>
      <address class="anschrift">Ochs &amp; Graf – M. Landgraf &amp; Y. Mosthaf GbR<br>Cornichonstraße 5b<br>76829 Landau in der Pfalz</address>
      <div class="karte" data-src="https://www.google.com/maps?q=Cornichonstra%C3%9Fe+5b,+76829+Landau+in+der+Pfalz&amp;z=15&amp;output=embed">
        <div class="karte__hinweis">
          <p>Die Karte wird von Google Maps geladen. Dabei werden Daten an Google übertragen – mehr dazu in der <a href="{A.link('datenschutz/')}">Datenschutzerklärung</a>.</p>
          <div class="aktionen"><button class="knopf knopf--leise" type="button" data-karte-laden>Karte laden</button><a class="textlink" href="https://www.google.com/maps/dir/?api=1&amp;destination=Cornichonstra%C3%9Fe%205b%2C%2076829%20Landau" rel="noopener">Route planen</a></div>
        </div>
      </div>
    </div>
    <div class="formular">
      <form class="anfrage" method="post" action="[PLATZHALTER-FORMULAR-ENDPUNKT]" enctype="multipart/form-data">
        <h2>Eure Anfrage</h2>
        <p>Dauert etwa eine Minute. Pflichtfelder sind markiert.</p>
        <div class="honig" aria-hidden="true"><label>Website <input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>
        <fieldset class="feld"><legend>Was plant ihr? <span class="hinweis">(Pflicht, mehrere möglich)</span></legend><div class="wahl">{bereiche}</div><span class="fehler" data-fehler="bereich"></span></fieldset>
        <div class="feld"><label for="f-details">Erzählt uns von eurem Projekt <span class="hinweis">(optional)</span></label><textarea id="f-details" name="details" placeholder="Raum, ungefähre Maße, Material, Wünsche …"></textarea></div>
        <div class="zwei">
          <div class="feld"><label for="f-ort">PLZ und Ort <span class="hinweis">(Pflicht)</span></label><input id="f-ort" name="ort" type="text" autocomplete="postal-code" required><span class="fehler" data-fehler="ort"></span></div>
          <div class="feld"><label for="f-zeit">Zeitraum</label><select id="f-zeit" name="zeitraum"><option>So bald wie möglich</option><option>In 3–6 Monaten</option><option>Später</option><option>Noch offen</option></select></div>
        </div>
        <div class="feld"><label for="f-fotos">Fotos oder Grundriss <span class="hinweis">(optional)</span></label><input id="f-fotos" name="upload" type="file" multiple accept="image/*,.pdf"><span class="fehler" style="color:var(--grau)" data-dateien></span></div>
        <div class="feld"><label for="f-name">Name <span class="hinweis">(Pflicht)</span></label><input id="f-name" name="name" type="text" autocomplete="name" required><span class="fehler" data-fehler="name"></span></div>
        <div class="zwei">
          <div class="feld"><label for="f-tel">Telefon <span class="hinweis">(Pflicht)</span></label><input id="f-tel" name="tel" type="tel" autocomplete="tel" required><span class="fehler" data-fehler="tel"></span></div>
          <div class="feld"><label for="f-mail">E-Mail <span class="hinweis">(Pflicht)</span></label><input id="f-mail" name="mail" type="email" autocomplete="email" required><span class="fehler" data-fehler="mail"></span></div>
        </div>
        <div class="feld"><label for="f-rueck">Wann erreichen wir euch am besten? <span class="hinweis">(optional)</span></label><input id="f-rueck" name="rueckruf" type="text" placeholder="z. B. werktags ab 17 Uhr"></div>
        <label class="einwilligung"><input type="checkbox" name="dsgvo" required><span>Ich bin einverstanden, dass meine Angaben zur Bearbeitung der Anfrage verwendet werden. Details in der <a href="{A.link('datenschutz/')}">Datenschutzerklärung</a>.</span></label>
        <span class="fehler" data-fehler="dsgvo"></span>
        <button class="knopf" type="submit">Anfrage senden</button>
      </form>
      <div class="danke" hidden tabindex="-1" role="status">
        <h2>Danke, <span data-name></span> – wir melden uns.</h2>
        <p class="text">So geht es weiter:</p>
        <ol><li>Wir melden uns persönlich bei euch.</li><li>Wir vereinbaren einen Termin für das 3D-Aufmaß.</li><li>Ihr bekommt CAD-Entwurf und Angebot.</li></ol>
      </div>
    </div>
  </div>
</section>'''


def seite_impressum(A):
    return f'''<section class="seitenkopf"><div class="huelle">{pfad(A, [('Start', ''), ('Impressum', None)])}<div class="recht"><h1>Impressum</h1><div class="recht__text">
<h2>Angaben gemäß § 5 DDG</h2><p><strong>Ochs &amp; Graf – M. Landgraf &amp; Y. Mosthaf GbR</strong><br>Cornichonstraße 5b<br>76829 Landau in der Pfalz</p><p>Vertreten durch die Gesellschafter Marius Landgraf und Yannik Mosthaf.</p>
<h2>Kontakt</h2><p>Telefon: <a href="tel:+4963417005116">06341 7005116</a><br>E-Mail: <a href="mailto:info@ochsundgraf.de">info@ochsundgraf.de</a></p>
<h2>Umsatzsteuer</h2><p>Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG: DE326507308</p>
<h2>Berufsbezeichnung und Kammer</h2><p>Berufsbezeichnung: Tischlermeister (Meister im Tischler-Handwerk), verliehen in der Bundesrepublik Deutschland.<br>Zuständige Kammer: Handwerkskammer der Pfalz, Kaiserslautern.<br>Berufsrechtliche Regelung: Gesetz zur Ordnung des Handwerks (Handwerksordnung).</p>
<h2>Verantwortlich für den Inhalt</h2><p>Marius Landgraf und Yannik Mosthaf, Anschrift wie oben (§ 18 Abs. 2 MStV).</p>
<h2>Verbraucherstreitbeilegung</h2><p>Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
<h2>Bildnachweis</h2><p>Alle Projektfotos: Ochs &amp; Graf.</p>
</div></div></div></section>'''


def seite_datenschutz(A):
    return f'''<section class="seitenkopf"><div class="huelle">{pfad(A, [('Start', ''), ('Datenschutz', None)])}<div class="recht"><div><h1>Datenschutz</h1><p class="lead" style="margin-top:24px">Kurz gesagt: kein Tracking, keine Cookies, keine eingebetteten Dienste ohne eure Einwilligung.</p></div><div class="recht__text">
<h2>1. Verantwortliche Stelle</h2><p><strong>Ochs &amp; Graf – M. Landgraf &amp; Y. Mosthaf GbR</strong>, Cornichonstraße 5b, 76829 Landau in der Pfalz, Telefon 06341 7005116, <a href="mailto:info@ochsundgraf.de">info@ochsundgraf.de</a></p>
<h2>2. Aufruf der Website</h2><p>Beim Aufruf verarbeitet unser Hosting-Anbieter [PLATZHALTER: Name und Anschrift des Hosting-Anbieters] technisch notwendige Daten (z. B. IP-Adresse, Datum und Uhrzeit, abgerufene Seite, Browsertyp), um die Website auszuliefern und ihre Sicherheit zu gewährleisten. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Die Protokolle werden nach kurzer Zeit gelöscht.</p><p>Schriften und Bilder liegen auf unserem eigenen Server. Wir setzen keine Analyse- oder Werbedienste ein und keine Cookies.</p>
<h2>3. Kontakt und Projektanfrage</h2><p>Wenn ihr uns per Telefon, E-Mail oder über das Anfrageformular kontaktiert, verarbeiten wir eure Angaben (z. B. Name, Kontaktdaten, Projektbeschreibung, freiwillig hochgeladene Fotos oder Grundrisse) ausschließlich zur Bearbeitung eurer Anfrage. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO. Die Daten werden gelöscht, sobald sie nicht mehr erforderlich sind und keine gesetzlichen Aufbewahrungspflichten bestehen.</p>
<h2>4. Google Maps (Zwei-Klick-Lösung)</h2><p>Die Karte auf der Kontaktseite wird erst geladen, wenn ihr auf „Karte laden“ klickt. Erst dann werden Daten (u. a. eure IP-Adresse) an Google Ireland Limited bzw. Google LLC (USA) übertragen. Rechtsgrundlage ist eure Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO. Eure Entscheidung speichern wir nur lokal in eurem Browser.</p><p><button class="knopf knopf--leise" type="button" data-karte-widerruf>Einwilligung für Google Maps widerrufen</button></p>
<h2>5. Links zu Instagram</h2><p>Wir verlinken auf unser Instagram-Profil. Das sind einfache Links, keine eingebetteten Inhalte: Daten werden erst übertragen, wenn ihr einen Link anklickt.</p>
<h2>6. Eure Rechte</h2><p>Ihr habt das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung, auf Datenübertragbarkeit sowie auf Widerspruch. Eine Einwilligung könnt ihr jederzeit für die Zukunft widerrufen. Außerdem könnt ihr euch bei einer Aufsichtsbehörde beschweren, z. B. beim Landesbeauftragten für den Datenschutz und die Informationsfreiheit Rheinland-Pfalz.</p>
<p style="margin-top:32px;font-size:14px">Stand: September 2026</p>
</div></div></div></section>'''


# ---------------------------------------------------------------- Seitenliste

def seitenliste():
    s = [
        ('', 'start', 'Ochs & Graf – Schreinerei in Landau | Küchen, Bäder & Möbel nach Maß',
         'Schreinerei Ochs & Graf in Landau: Küchen, Badmöbel, Massivholztische und Innenausbau nach Maß – vom 3D-Aufmaß bis zur Montage. Zwei Tischlermeister für die Südpfalz.', seite_start, None),
        ('so-arbeiten-wir/', 'weg', 'So arbeiten wir: 3D-Aufmaß, CAD & Montage | Ochs & Graf',
         'Vom 3D-Aufmaß über die CAD-Planung und die Produktion in Landau bis zur Montage bei euch – so arbeitet die Schreinerei Ochs & Graf.', seite_weg, 'So arbeiten wir'),
        ('referenzen/', 'ref', 'Referenzen – Schreinerprojekte in Landau & Südpfalz | Ochs & Graf',
         'Küchen, Badmöbel, Treppen und Möbel nach Maß: ausgewählte Projekte der Schreinerei Ochs & Graf aus Landau und der Südpfalz.', seite_referenzen, 'Referenzen'),
        ('ueber-uns/', 'ueber', 'Über uns – Tischlermeister aus Landau | Ochs & Graf',
         'Marius Landgraf und Yannik Mosthaf: zwei Tischlermeister, eine Schreinerei in Landau in der Pfalz – seit 2019.', seite_ueber, 'Über uns'),
        ('kontakt/', 'kontakt', 'Projekt anfragen – Kontakt | Schreinerei Ochs & Graf, Landau',
         'Projekt anfragen bei Ochs & Graf: telefonisch oder über das Anfrageformular. Cornichonstraße 5b, 76829 Landau in der Pfalz.', seite_kontakt, 'Kontakt'),
        ('impressum/', None, 'Impressum | Ochs & Graf', 'Impressum der Schreinerei Ochs & Graf, Landau in der Pfalz.', seite_impressum, 'Impressum'),
        ('datenschutz/', None, 'Datenschutz | Ochs & Graf', 'Datenschutzerklärung der Schreinerei Ochs & Graf, Landau in der Pfalz.', seite_datenschutz, 'Datenschutz'),
    ]
    for i, p in enumerate(I.PROJEKTE):
        nx = I.PROJEKTE[(i + 1) % len(I.PROJEKTE)]
        s.append((f'referenzen/{p["slug"]}/', 'ref', f'{p["t"]} – Referenz | Ochs & Graf', p['meta'],
                  (lambda A, p=p, nx=nx: seite_projekt(A, p, nx)), p['t']))
    return s


def jsonld(route, krumen_titel):
    betrieb = {
        '@context': 'https://schema.org', '@type': 'HomeAndConstructionBusiness', '@id': DOMAIN + '#betrieb',
        'name': 'Ochs & Graf', 'legalName': 'Ochs & Graf – M. Landgraf & Y. Mosthaf GbR', 'slogan': 'The Wood. The Better.',
        'description': 'Schreinerei in Landau in der Pfalz: Küchen, Badmöbel, Massivholztische und Innenausbau nach Maß.',
        'url': DOMAIN, 'telephone': '+49 6341 7005116', 'email': 'info@ochsundgraf.de', 'foundingDate': '2019',
        'image': DOMAIN + 'assets/img/og.jpg',
        'address': {'@type': 'PostalAddress', 'streetAddress': 'Cornichonstraße 5b', 'postalCode': '76829', 'addressLocality': 'Landau in der Pfalz', 'addressRegion': 'Rheinland-Pfalz', 'addressCountry': 'DE'},
        'areaServed': ['Landau in der Pfalz', 'Südpfalz'],
        'founder': [{'@type': 'Person', 'name': 'Marius Landgraf', 'jobTitle': 'Tischlermeister'}, {'@type': 'Person', 'name': 'Yannik Mosthaf', 'jobTitle': 'Tischlermeister'}],
        'sameAs': ['https://www.instagram.com/ochsundgraf/'],
    }
    if not route:
        return [betrieb]
    teile = [('Start', DOMAIN)]
    if route.startswith('referenzen/') and route != 'referenzen/':
        teile.append(('Referenzen', DOMAIN + 'referenzen/'))
    teile.append((krumen_titel, DOMAIN + route))
    return [{'@context': 'https://schema.org', '@type': 'BreadcrumbList', 'itemListElement': [
        {'@type': 'ListItem', 'position': i + 1, 'name': n, 'item': u} for i, (n, u) in enumerate(teile)]}]


FAVICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='8' fill='%231F1B16'/%3E%3Ctext x='32' y='43' font-family='Georgia,serif' font-size='30' text-anchor='middle' fill='%23F5F1EA'%3EO%26amp%3BG%3C/text%3E%3C/svg%3E"


def dokument(A, titel, beschreibung, route, koerper, ld, extra_kopf=''):
    ld_html = ''.join(f'<script type="application/ld+json">{json.dumps(x, ensure_ascii=False)}</script>' for x in ld)
    return f'''<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(titel)}</title>
<meta name="description" content="{e(beschreibung)}">
<link rel="canonical" href="{DOMAIN}{route}">
<meta name="theme-color" content="#F5F1EA">
<meta property="og:type" content="website">
<meta property="og:locale" content="de_DE">
<meta property="og:site_name" content="Ochs &amp; Graf">
<meta property="og:title" content="{e(titel)}">
<meta property="og:description" content="{e(beschreibung)}">
<meta property="og:url" content="{DOMAIN}{route}">
<meta property="og:image" content="{DOMAIN}assets/img/og.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="{FAVICON}">
{extra_kopf}{ld_html}
</head>
<body>
{koerper}
</body>
</html>
'''


def baue_hosting():
    routen = []
    for route, aktiv, titel, beschr, fn, krume in seitenliste():
        A = Ausgabe(False, route)
        kopfteil = (f'<link rel="preload" href="{A.asset("fonts/cormorant-400.woff2")}" as="font" type="font/woff2" crossorigin>\n'
                    f'<link rel="preload" href="{A.asset("fonts/instrument.woff2")}" as="font" type="font/woff2" crossorigin>\n'
                    f'<link rel="stylesheet" href="{A.asset("site.css")}">\n<script src="{A.asset("site.js")}" defer></script>\n')
        koerper = f'{kopf(A, aktiv)}\n<main id="inhalt">\n{fn(A)}\n</main>\n{fuss(A)}'
        ziel = os.path.join(route, 'index.html') if route else 'index.html'
        os.makedirs(os.path.dirname(ziel) or '.', exist_ok=True)
        open(ziel, 'w', encoding='utf-8').write(dokument(A, titel, beschr, route, koerper, jsonld(route, krume), kopfteil))
        routen.append(route)
    # 404 mit absoluten Pfaden (wird vom Server unter beliebiger Adresse ausgeliefert)
    A = Ausgabe(False, '')
    A.link = lambda z: '/' + z
    A.asset = lambda p: '/assets/' + p
    k = ('<link rel="stylesheet" href="/assets/site.css">\n<script src="/assets/site.js" defer></script>\n<meta name="robots" content="noindex">\n')
    body = f'''{kopf(A, None)}<main id="inhalt"><section class="seitenkopf"><div class="huelle"><h1>Diese Seite gibt es nicht.</h1><p class="lead" style="margin-bottom:36px">Vielleicht hat sich die Adresse geändert. Hier geht es weiter:</p><div class="aktionen"><a class="knopf" href="/">Zur Startseite</a><a class="textlink" href="/referenzen/">Referenzen ansehen</a></div></div></section></main>{fuss(A)}'''
    open('404.html', 'w', encoding='utf-8').write(dokument(A, 'Seite nicht gefunden | Ochs & Graf', 'Diese Seite gibt es nicht.', '404.html', body, [], k))
    open('sitemap.xml', 'w', encoding='utf-8').write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + ''.join(f'  <url><loc>{DOMAIN}{r}</loc></url>\n' for r in routen) + '</urlset>\n')
    open('robots.txt', 'w', encoding='utf-8').write(f'User-agent: *\nAllow: /\n\nSitemap: {DOMAIN}sitemap.xml\n')
    return routen


def baue_einzeldatei():
    css = open('assets/site.css', encoding='utf-8').read()
    for f in ('cormorant-400', 'cormorant-400i', 'instrument'):
        b64 = base64.b64encode(open(f'assets/fonts/{f}.woff2', 'rb').read()).decode()
        css = css.replace(f'url("fonts/{f}.woff2")', f'url(data:font/woff2;base64,{b64})')
    js = open('assets/site.js', encoding='utf-8').read()
    teile, genutzt = [], set()
    for route, aktiv, titel, beschr, fn, krume in seitenliste():
        A = Ausgabe(True, route)
        inhalt = fn(A)
        genutzt |= A.bilder_genutzt
        teile.append(f'<div data-route="/{route}" data-titel="{e(titel)}" hidden>\n{inhalt}\n</div>')
    A = Ausgabe(True, '')
    bilder = {}
    for k in sorted(genutzt):
        m = MASSE[k]
        mittel = max((v for v in m['varianten'] if v <= 960), default=m['varianten'][0])
        bilder[f'{k}-{mittel}'] = base64.b64encode(open(f'assets/img/{k}-{mittel}.webp', 'rb').read()).decode()
    lader = ('(function(){var B=' + json.dumps(bilder) + ',U={};'
             'function url(k){if(!U[k]){var s=atob(B[k]),a=new Uint8Array(s.length);for(var i=0;i<s.length;i++)a[i]=s.charCodeAt(i);U[k]=URL.createObjectURL(new Blob([a],{type:"image/webp"}));}return U[k];}'
             'document.querySelectorAll("img[data-b]").forEach(function(i){i.src=url(i.getAttribute("data-b"));});})();')
    js = js.replace('i.src = q.dataset.gross || q.currentSrc || q.src', 'i.src = q.currentSrc || q.src')
    koerper = f'{kopf(A, None)}\n<main id="inhalt">\n' + '\n'.join(teile) + f'\n</main>\n{fuss(A)}\n<script>{lader}</script>\n<script>{js}</script>'
    os.makedirs('dist', exist_ok=True)
    doc = dokument(A, 'Ochs & Graf – Schreinerei in Landau', 'Vorschau der Website von Ochs & Graf.', '', koerper,
                   jsonld('', None), f'<style>{css}</style>\n')
    open('dist/Ochs & Graf.html', 'w', encoding='utf-8').write(doc)
    return len(doc.encode())


if __name__ == '__main__':
    r = baue_hosting()
    groesse = baue_einzeldatei()
    print(f'{len(r)} Seiten gebaut · Einzeldatei {groesse / 1e6:.2f} MB')
