"""Baut index.html (eine Datei, offline lauffaehig) aus den Quellen.

Quellen:
  quelle/seite.dc.html          Seiten-Template + Logik (Claude-Design-Format)
  quelle/ImagePlaceholder.dc.html  Bild-Komponente (Foto > Planskizze)
  quelle/plaene.js              Planskizzen fuer Bildplaetze ohne Foto
  bilder/*.webp + bilder.json   Fotos, Alt-Texte, Zuordnung zu Bildplaetzen

Schriften, Laufzeit und React stammen aus dem bestehenden Bundle in index.html.
Aufruf:  python3 werkzeug/build.py
"""
import base64, glob, json, os, re, uuid

WURZEL = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
os.chdir(WURZEL)

PLATZHALTER_UUID = '7774c18a-81d2-4e65-a0ff-0cfebb95c4bd'
MIMES = {'.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg'}

html = open('index.html', encoding='utf-8').read()


def block(name):
    m = re.search(r'(<script type="__bundler/%s">)(.*?)(</script>)' % name, html, re.S)
    assert m, name
    return m


manifest = json.loads(block('manifest').group(2))
alt_tpl = json.loads(block('template').group(2))

# Bisherige Bild-UUIDs wiederverwenden, damit Diffs klein bleiben
alte_ids = {}
m = re.search(r'window\.OG_IMAGES = (\{.*?\});', alt_tpl)
if m:
    for k, v in json.loads(m.group(1)).items():
        alte_ids[k] = v['u'] if isinstance(v, dict) else v

# 1) Alte Bilder aus dem Manifest entfernen
manifest = {u: e for u, e in manifest.items() if not e['mime'].startswith('image/')}

# 2) Fotos einbetten
meta = json.load(open('bilder/bilder.json', encoding='utf-8'))
fotos = meta.get('fotos', {})
bilder = {}
for f in sorted(glob.glob('bilder/*')):
    stamm, ext = os.path.splitext(os.path.basename(f))
    if ext.lower() not in MIMES:
        continue
    iid = stamm.upper()
    u = alte_ids.get(iid) or str(uuid.uuid4())
    daten = base64.b64encode(open(f, 'rb').read()).decode()
    manifest[u] = {'mime': MIMES[ext.lower()], 'compressed': False, 'data': daten}
    eintrag = {'u': u}
    eintrag.update(fotos.get(iid, {}))
    bilder[iid] = eintrag
for platz, foto in meta.get('zuordnung', {}).items():
    if platz not in bilder:
        assert foto in bilder, 'Zuordnung %s -> %s: Foto fehlt' % (platz, foto)
        bilder[platz] = dict(bilder[foto], von=foto)

# 3) Bild-Komponente
manifest[PLATZHALTER_UUID] = {
    'mime': 'text/html', 'compressed': False,
    'data': base64.b64encode(open('quelle/ImagePlaceholder.dc.html', 'rb').read()).decode()}

# 4) Template: Bilddaten + Planskizzen einsetzen
tpl = open('quelle/seite.dc.html', encoding='utf-8').read()
plaene = open('quelle/plaene.js', encoding='utf-8').read()
assert '</script' not in plaene
daten = ('<script>window.OG_IMAGES = %s;</script>\n<script>\n%s\n</script>'
         % (json.dumps(bilder, ensure_ascii=False), plaene))
assert tpl.count('<!--OG_DATEN-->') == 1
tpl = tpl.replace('<!--OG_DATEN-->', daten)

# 5) Zurueck ins Bundle schreiben
titel = re.search(r'<title>(.*?)</title>', tpl).group(1)
mj = json.dumps(manifest, separators=(',', ':'))
tj = json.dumps(tpl, ensure_ascii=False).replace('</', '<\\u002F')
mm = block('manifest')
html = html[:mm.start(2)] + mj + html[mm.end(2):]
tm = block('template')
html = html[:tm.start(2)] + '\n' + tj + '\n  ' + html[tm.end(2):]
html = re.sub(r'(<head>\s*<meta charset="utf-8">\s*<title>).*?(</title>)',
              lambda x: x.group(1) + titel + x.group(2), html, count=1)
open('index.html', 'w', encoding='utf-8').write(html)
print('index.html: %.2f MB, %d Bilder/Plaetze' % (len(html.encode()) / 1e6, len(bilder)))
