"""Inhalte der Website – Texte, Projekte, Team. Hier pflegen, dann `python3 werkzeug/build.py`.

Bilder: Die Kennungen (z. B. "REF-27") entsprechen den Dateien in bilder/ (ref-27.webp).
Alt-Texte stehen in bilder/bilder.json.
"""

NAV = [
    ('weg', 'So arbeiten wir', 'so-arbeiten-wir/'),
    ('ref', 'Referenzen', 'referenzen/'),
    ('ueber', 'Über uns', 'ueber-uns/'),
    ('kontakt', 'Kontakt', 'kontakt/'),
]

LEISTUNGEN = [
    {'t': 'Küchen nach Maß', 'filter': 'kueche', 'bild': 'REF-27',
     'd': 'Grifflos, mit Kochinsel oder Kaffeebar – geplant per 3D-Aufmaß und gebaut für genau euren Raum.'},
    {'t': 'Badmöbel & Waschtische', 'filter': 'bad', 'bild': 'REF-21',
     'd': 'Waschtische aus Massivholz mit gezinkten Schubkästen – vom Gäste-WC bis zum Doppelwaschtisch.'},
    {'t': 'Möbel & Massivholztische', 'filter': 'moebel', 'bild': 'REF-37',
     'd': 'Esstische, Deckplatten, Holzfußgestelle und Einzelstücke, gefertigt in unserer Werkstatt.'},
    {'t': 'Innenausbau', 'filter': 'innenausbau', 'bild': 'REF-38',
     'd': 'Treppen, Garderoben, Einbauschränke, Türen und Parkett – alles aus einer Hand.'},
]

FILTER = [('alle', 'Alle'), ('kueche', 'Küche'), ('bad', 'Bad'), ('moebel', 'Möbel'), ('innenausbau', 'Innenausbau'), ('gewerbe', 'Gewerbe')]

SCHRITTE = [
    {'t': '3D-Aufmaß',
     'kurz': 'Wir erfassen euren Raum millimetergenau – mit allen Längen, Nischen und Winkeln.',
     'd': 'Durch einen hohen Digitalisierungsgrad können wir maximal vorplanen und vorproduzieren. Mit unserem 3D-Aufmaßgerät erfassen wir Räume, ganze Wohnungen oder Häuser millimetergenau – mit allen Längen, Flächen, Raumhöhen, Nischen und Winkeln.'},
    {'t': 'CAD-Planung',
     'kurz': 'Aus dem Aufmaß entsteht ein virtueller Raum, den wir gemeinsam mit euch einrichten.',
     'd': 'Aus dem 3D-Aufmaß entstehen in unserer CAD-Software virtuelle Räume, die wir gemeinsam mit euch mit individuellen Möbeln, Küchen und Wohnzimmereinrichtungen füllen. So habt ihr vorab eine genaue Vorstellung eures Innenausbaus.'},
    {'t': 'Produktion',
     'kurz': 'Massivholz und alles Individuelle fertigen wir selbst, Standardteile kommen von regionalen Partnern.',
     'd': 'Wir sind spezialisiert auf Massivholzarbeiten: Esstische, Deckplatten, Holzfußgestelle und Waschtische fertigen wir individuell für euch an. Für Standardprodukte wie Küchenkorpusse arbeiten wir mit regionalen Betrieben zusammen. Die Individualisierung – etwa Gravurfräsungen, integrierte LEDs oder besondere Ausschnitte – passiert in unseren eigenen Hallen.'},
    {'t': 'Montage',
     'kurz': 'Wir bauen bei euch ein – sauber, schnell und persönlich.',
     'd': 'Vom Entwurf bis zur Montage in eurem Zuhause – alles aus einer Hand.'},
]

# Projekte mit Fotos. bilder: [(Bild-ID, Bildunterschrift), …] – das erste ist das Titelbild.
PROJEKTE = [
    {'slug': 'kueche-schwarz-eiche', 't': 'Küche Schwarz & Eiche', 'art': 'Küche', 'kat': ['kueche'],
     'kurz': 'Grifflose Küche in Mattschwarz mit Kochinsel und einer Kaffeebar aus Eiche.',
     'd': 'Grifflose Küche in Mattschwarz mit Kochinsel und raumhoher Hochschrankwand. Eine offene Nische aus Eiche wird zur Kaffeebar – warmes Holz als Kontrast zu den ruhigen, dunklen Flächen.',
     'meta': 'Grifflose Küche in Mattschwarz mit Kochinsel und Kaffeebar aus Eiche – eine Referenz der Schreinerei Ochs & Graf aus Landau.',
     'eck': [('Leistung', 'Küche mit Kochinsel und Hochschrankwand'), ('Material', 'Fronten in Mattschwarz, Nische in Eiche'), ('Details', 'Grifflos, Kaffeebar, flächenbündige Einbaugeräte')],
     'bilder': [('REF-27', 'Kaffeebar aus Eiche in der Hochschrankwand'), ('REF-28', 'Hochschrankwand mit Einbaubackofen'), ('REF-29', 'Kochinsel auf Fischgrätparkett')]},
    {'slug': 'badmoebel-waschtische', 't': 'Badmöbel & Waschtische', 'art': 'Bad', 'kat': ['bad'],
     'kurz': 'Waschtische aus Eiche massiv – vom Gäste-WC bis zum Doppelwaschtisch.',
     'd': 'Waschtische nach Maß: Eiche massiv, grifflose Fronten und Schubkästen mit sichtbarer Zinkung – vom Gäste-WC mit Altholzplatte bis zum Doppelwaschtisch.',
     'meta': 'Waschtische und Badmöbel aus Eiche massiv mit gezinkten Schubkästen – Referenzen der Schreinerei Ochs & Graf aus Landau.',
     'eck': [('Leistung', 'Badmöbel und Waschtische nach Maß'), ('Material', 'Eiche massiv, Altholz'), ('Details', 'Grifflose Fronten, gezinkte Schubkästen, Aufsatzbecken')],
     'bilder': [('REF-21', 'Doppelwaschtisch mit grifflosen Schubkästen'), ('REF-22', 'Eiche massiv mit Steinbecken und gezinktem Schubkasten'), ('REF-23', 'Waschtisch mit Eichenplatte und offenem Eckregal'), ('REF-24', 'Gäste-WC mit Waschtischplatte aus Altholz')]},
    {'slug': 'treppe-garderobe-schrank', 't': 'Treppe, Garderobe & Schrank', 'art': 'Innenausbau', 'kat': ['innenausbau'],
     'kurz': 'Faltwerktreppe aus Eiche, Garderobenbank, Einbauschrank und Spiegel.',
     'd': 'Innenausbau aus einem Guss: eine Faltwerktreppe aus Eiche mit Wandleuchten, dazu Garderobenbank, Einbauschrank und ein Spiegel mit Eichenrahmen.',
     'meta': 'Faltwerktreppe aus Eiche, Garderobe und Einbauschrank – Innenausbau der Schreinerei Ochs & Graf aus Landau.',
     'eck': [('Leistung', 'Treppe, Garderobe, Einbauschrank, Spiegel'), ('Material', 'Eiche, weiße Fronten'), ('Details', 'Faltwerk-Optik, Wandleuchten entlang der Treppe')],
     'bilder': [('REF-38', 'Faltwerktreppe mit weißem Geländer'), ('REF-41', 'Garderobenbank mit Schubkästen'), ('REF-40', 'Stufen mit Wandleuchte'), ('REF-39', 'Treppenauge mit Hängeleuchten'), ('REF-43', 'Spiegel mit Eichenrahmen'), ('REF-42', 'Einbauschrank innen')]},
    {'slug': 'kueche-eiche-messing', 't': 'Küche Eiche & Messing', 'art': 'Küche', 'kat': ['kueche'],
     'kurz': 'Fronten aus Eiche, Spüle und Griffleisten aus Messing.',
     'd': 'Fronten aus Eiche, Spüle, Armatur und Griffleisten in Messing, eine helle Arbeitsplatte und ein LED-Band unter den Hängeschränken. Die Schneidebretter mit eingefrästem Logo kommen aus unserer Werkstatt.',
     'meta': 'Küche mit Eichenfronten, Messingspüle und Griffleisten aus Messing – eine Referenz der Schreinerei Ochs & Graf aus Landau.',
     'eck': [('Leistung', 'Küche'), ('Material', 'Eiche, Messing'), ('Details', 'Griffleisten in Messing, LED-Unterbauleuchten, Gravur im Holz')],
     'bilder': [('WEG-05', 'Küchenzeile mit Messingspüle und Griffleisten'), ('REF-26', 'Schneidebretter mit eingefrästem Logo')]},
    {'slug': 'sideboard-esstisch', 't': 'Sideboard & Esstisch', 'art': 'Möbel', 'kat': ['moebel'],
     'kurz': 'Ein Sideboard auf alten Turnbock-Beinen und ein Esstisch aus Eiche massiv.',
     'd': 'Einzelstücke aus unserer Werkstatt: ein Sideboard mit gebogenen Korpussen auf alten Turnbock-Beinen – mit Hängeregister im Auszug – und ein Esstisch aus Eiche massiv auf schwarzem Stahlgestell.',
     'meta': 'Sideboard auf Turnbock-Beinen und Esstisch aus Eiche massiv mit Stahlgestell – Möbel nach Maß von Ochs & Graf aus Landau.',
     'eck': [('Leistung', 'Möbel und Massivholztische'), ('Material', 'Eiche, Stahl, Beine eines alten Turnbocks'), ('Details', 'Gebogene Korpusse, Auszug mit Hängeregister, massive Tischplatte')],
     'bilder': [('REF-35', 'Sideboard auf Turnbock-Beinen'), ('REF-36', 'Auszug mit Hängeregister'), ('REF-37', 'Esstisch aus Eiche massiv mit Stahlgestell')]},
    {'slug': 'kueche-weiss-theke', 't': 'Küche Weiß mit Theke', 'art': 'Küche', 'kat': ['kueche'],
     'kurz': 'Offene, grifflose Küche mit Theke und integriertem Weinkühlschrank.',
     'd': 'Offene Küche in Weiß: grifflos, mit Theke zum Essbereich, integriertem Weinkühlschrank, Glasrückwand und einem LED-Band unter den Hängeschränken.',
     'meta': 'Weiße grifflose Küche mit Theke und Weinkühlschrank – eine Referenz der Schreinerei Ochs & Graf aus Landau.',
     'eck': [('Leistung', 'Offene Küche mit Theke'), ('Material', 'Weiße Fronten, Glasrückwand'), ('Details', 'Grifflos, Weinkühlschrank, LED-Unterbauleuchten')],
     'bilder': [('REF-30', 'Theke mit integriertem Weinkühlschrank'), ('REF-31', 'Küchenzeile mit Glasrückwand')]},
    {'slug': 'ferienhaus-westerwald', 't': 'Ferienhaus Westerwald', 'art': 'Küche · Innenausbau', 'kat': ['kueche', 'innenausbau'],
     'kurz': 'Ein 50-m²-Häuschen, umgebaut zum Wochenendhaus.',
     'd': 'Umbau eines 50-m²-Häuschens zum Wochenendhaus. Erholung pur mitten im Westerwald.',
     'meta': 'Umbau eines 50-m²-Häuschens zum Wochenendhaus im Westerwald – Innenausbau und Küche von Ochs & Graf.',
     'eck': [('Ort', 'Westerwald'), ('Art', 'Umbau zum Wochenendhaus'), ('Fläche', 'ca. 50 m²')],
     'bilder': [('REF-12', 'Küchenzeile mit rundem Eichentisch'), ('REF-11', 'Küchenzeile im Ferienhaus')]},
]

# Echte Projekte, zu denen noch keine Fotos vorliegen – bewusst ohne Bild.
WEITERE = [
    {'t': 'Einfamilienhaus Bellheim', 'art': 'Neubau · Bellheim', 'kat': ['kueche', 'bad', 'innenausbau'],
     'd': 'Umsetzung eines Neubaus: Fischgrätparkett, Küche, Garderobe, Waschtisch, Türen, Spiegel.'},
    {'t': 'Einfamilienhaus Landau', 'art': 'Innenausbau · Landau', 'kat': ['innenausbau'],
     'd': 'Modernes Einfamilienhaus in Anlehnung an den Bauhaus-Stil. Fokus auf hochwertige Materialien, gerade Linien, klare Kanten.'},
    {'t': 'Bücher Knecht', 'art': 'Gewerbe · Landau', 'kat': ['gewerbe', 'moebel'],
     'd': 'Modulares Wandsystem und mobile Warenpräsentation für den Buchladen. Variabel. Schlicht. Nachhaltig.'},
]

AUSWAHL = ['badmoebel-waschtische', 'treppe-garderobe-schrank', 'sideboard-esstisch']

TEAM = [
    {'name': 'Marius Landgraf', 'rolle': 'Inhaber · Tischlermeister', 'quals': ['Meister im Tischler-Handwerk (Bachelor Professional)', 'Fotograf'],
     'tel': '+4917682042302', 'tel_anz': '0176 82042302'},
    {'name': 'Yannik Mosthaf', 'rolle': 'Inhaber · Tischlermeister', 'quals': ['Meister im Tischler-Handwerk (Bachelor Professional)', 'Wirtschaftsingenieur (B.Eng.)'],
     'tel': '+491749353078', 'tel_anz': '0174 9353078'},
    {'name': 'Stefan Mattern', 'rolle': 'Tischlermeister', 'quals': ['Meister im Tischler-Handwerk (Bachelor Professional)'], 'tel': '', 'tel_anz': ''},
]

CHRONIK = [
    ('09 / 2019', 'Start in die Selbstständigkeit', 'Zuerst als Parkettleger und für den Einbau genormter Baufertigteile – schon während der Meisterschule.'),
    ('09 / 2020', 'Meistertitel', 'Mit dem Meistertitel wird aus dem Start offiziell eine Schreinerei.'),
    ('Heute', 'Für die Südpfalz', 'Küchen, Möbel und Innenausbau für Landau und die ganze Südpfalz.'),
]

DETAILS = [
    ('REF-26', 'Schneidebretter aus Eiche mit eingefrästem Logo'),
    ('REF-36', 'Auszug mit Hängeregister in einem Sideboard'),
    ('REF-24', 'Waschtischplatte aus Altholz im Gäste-WC'),
]

BEREICHE = ['Küche', 'Bad', 'Möbel / Tisch', 'Einbauschrank', 'Parkett / Boden', 'Treppe / Türen', 'Sonstiges']


def projekt(slug):
    return next(p for p in PROJEKTE if p['slug'] == slug)
