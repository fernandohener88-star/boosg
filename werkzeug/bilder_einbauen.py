import re,json,base64,gzip,uuid,os,glob
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
h=open('index.html').read()
def get(t):
    m=re.search(r'(<script type="__bundler/%s">)(.*?)(</script>)'%t,h,re.S); return m
mm=get('manifest'); man=json.loads(mm.group(2))
tm=get('template'); tpl=json.loads(tm.group(2))
def dec(e):
    b=base64.b64decode(e['data']); return gzip.decompress(b) if e.get('compressed') else b
PH='7774c18a-81d2-4e65-a0ff-0cfebb95c4bd'
ph=dec(man[PH]).decode()

# 1) Platzhalter-Komponente: echtes Bild zeigen, wenn fuer die ID eines hinterlegt ist
if 'OG_IMAGES' not in ph:
    ph=ph.replace('<figcaption','<img src="{{ src }}" alt="{{ alt }}" loading="lazy" decoding="async" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:{{ disp }};z-index:2;">\n  <figcaption',1)
    ph=ph.replace("      imgId: p.imgId ?? 'IMG-00',",
      "      imgId: p.imgId ?? 'IMG-00',\n      src: ((typeof window !== 'undefined' && window.OG_IMAGES) || {})[p.imgId] || '',\n      disp: ((typeof window !== 'undefined' && window.OG_IMAGES) || {})[p.imgId] ? 'block' : 'none',",1)
    assert 'OG_IMAGES' in ph and '{{ src }}' in ph
man[PH]={**man[PH],'compressed':False,'data':base64.b64encode(ph.encode()).decode()}

# 2) Bilder aus bilder/ als Assets einbetten (Dateiname = Bild-ID)
imgmap={}
old={}
m=re.search(r'window\.OG_IMAGES = (\{.*?\});',tpl)
if m: old=json.loads(m.group(1))
for f in sorted(glob.glob('bilder/*.webp')):
    iid=os.path.basename(f)[:-5].upper()
    u=old.get(iid) or str(uuid.uuid4())
    man[u]={'mime':'image/webp','compressed':False,'data':base64.b64encode(open(f,'rb').read()).decode()}
    imgmap[iid]=u
# Aliase: eine Bilddatei fuer mehrere Platzhalter-IDs (bilder/aliase.json)
if os.path.exists('bilder/aliase.json'):
    for a,z in json.load(open('bilder/aliase.json')).items(): imgmap[a]=imgmap[z]
scr='<script>window.OG_IMAGES = %s;</script>'%json.dumps(imgmap)
if m: tpl=re.sub(r'<script>window\.OG_IMAGES = \{.*?\};</script>',lambda _:scr,tpl)
else: tpl=tpl.replace('<script src="979fe9ab',scr+'\n<script src="979fe9ab',1)

# 3) Referenzprojekt Badmoebel
if "'PRJ-05'" not in tpl:
    new = """,
    { id: 'PRJ-05', slug: 'badmoebel-waschtische', t: 'Badmöbel & Waschtische', ort: 'Südpfalz', cats: ['Bad'],
      tags: 'MASSIVHOLZ · WASCHTISCHE · BADMÖBEL',
      d: 'Waschtische und Badmöbel nach Maß: Eiche massiv, grifflose Fronten, Schubkästen mit Zinkenverbindung – vom Gäste-WC bis zum Doppelwaschtisch.',
      img: 'REF-21', motif: 'Doppelwaschtisch aus Eiche mit Aufsatzbecken', alt: 'Doppelwaschtisch aus Eiche mit Aufsatzbecken von Ochs und Graf',
      gallery: ['REF-22', 'REF-23', 'REF-24'],
      gm: ['Waschtisch aus Eiche mit Steinbecken und gezinkten Schubkästen', 'Waschtisch mit Eichenplatte und offenem Regal', 'Gäste-WC: Waschtischplatte aus Altholz'],
      specs: [
        { k: 'ORT', v: '[PRÜFEN]' }, { k: 'TYP', v: 'Badmöbel, Waschtische' },
        { k: 'MATERIALIEN', v: 'Eiche massiv, Altholz [PRÜFEN]' },
        { k: 'MERKMALE', v: 'Grifflose Fronten, gezinkte Schubkästen, Aufsatzbecken' },
        { k: 'JAHR', v: '[PRÜFEN]' }
      ],
      links: [{ t: 'Badmöbel', href: '/badmoebel/' }, { t: 'Möbel nach Maß', href: '/moebel-massivholztische/' }] }
  ];
  FILTERS"""
    tpl,n=re.subn(r"\n  \];\n  FILTERS",lambda _:new,tpl,count=1); assert n==1

# 4) Referenzprojekt Kueche Eiche & Messing
if "'PRJ-06'" not in tpl:
    new = """,
    { id: 'PRJ-06', slug: 'kueche-eiche-messing', t: 'Küche Eiche & Messing', ort: '[PRÜFEN]', cats: ['Wohnen', 'Küche'],
      tags: 'KÜCHE · EICHENFRONTEN · MESSING',
      d: 'Küche mit Fronten in Eiche, Griffleisten und Spüle in Messing, heller Arbeitsplatte und indirekter Beleuchtung. Die Schneidebretter aus Eiche fertigen wir gleich mit.',
      img: 'REF-25', motif: 'Küchenzeile mit Eichenfronten und Messingspüle', alt: 'Küche mit Eichenfronten und Messingarmatur von Ochs und Graf',
      gallery: ['REF-26'],
      gm: ['Detail: Schneidebretter aus Eiche mit Ochs-&-Graf-Gravur'],
      specs: [
        { k: 'ORT', v: '[PRÜFEN]' }, { k: 'TYP', v: 'Küche' },
        { k: 'MATERIALIEN', v: 'Eiche, Messing, Arbeitsplatte [PRÜFEN]' },
        { k: 'MERKMALE', v: 'Griffleisten in Messing, LED-Beleuchtung, Schneidebretter mit Gravur' },
        { k: 'JAHR', v: '[PRÜFEN]' }
      ],
      links: [{ t: 'Küchen', href: '/kuechen/' }] }
  ];
  FILTERS"""
    tpl,n=re.subn(r"\n  \];\n  FILTERS",lambda _:new,tpl,count=1); assert n==1

# 5) Referenzprojekt Kueche Schwarz & Eiche
if "'PRJ-07'" not in tpl:
    new = """,
    { id: 'PRJ-07', slug: 'kueche-schwarz-eiche', t: 'Küche Schwarz & Eiche', ort: '[PRÜFEN]', cats: ['Wohnen', 'Küche'],
      tags: 'KÜCHE · MATTSCHWARZ · EICHE · FISCHGRÄTPARKETT',
      d: 'Grifflose Küche in Mattschwarz mit Kochinsel und Hochschrankwand. Eine offene Nische aus Eiche wird zur Kaffeebar, darunter liegt Fischgrätparkett in Eiche.',
      img: 'REF-27', motif: 'Hochschrankwand in Mattschwarz mit Kaffeenische aus Eiche', alt: 'Schwarze Küche mit Kaffeenische aus Eiche von Ochs und Graf',
      gallery: ['REF-28', 'REF-29'],
      gm: ['Kaffeebar: offene Nische aus Eiche in der Hochschrankwand', 'Kochinsel mit grifflosen Fronten auf Fischgrätparkett'],
      specs: [
        { k: 'ORT', v: '[PRÜFEN]' }, { k: 'TYP', v: 'Küche mit Kochinsel' },
        { k: 'MATERIALIEN', v: 'Fronten Mattschwarz, Eiche, Arbeitsplatte [PRÜFEN]' },
        { k: 'MERKMALE', v: 'Grifflos, Kaffeenische aus Eiche, Fischgrätparkett' },
        { k: 'JAHR', v: '[PRÜFEN]' }
      ],
      links: [{ t: 'Küchen', href: '/kuechen/' }, { t: 'Innenausbau', href: '/innenausbau/' }] }
  ];
  FILTERS"""
    tpl,n=re.subn(r"\n  \];\n  FILTERS",lambda _:new,tpl,count=1); assert n==1

# 6) Referenzprojekt Kueche Weiss mit Theke
if "'PRJ-08'" not in tpl:
    new = """,
    { id: 'PRJ-08', slug: 'kueche-weiss-theke', t: 'Küche Weiß mit Theke', ort: '[PRÜFEN]', cats: ['Wohnen', 'Küche'],
      tags: 'KÜCHE · GRIFFLOS · THEKE · WEINKÜHLSCHRANK',
      d: 'Offene Küche in Weiß, grifflos, mit Theke zum Wohnbereich, integriertem Weinkühlschrank und LED-Band unter den Hängeschränken.',
      img: 'REF-30', motif: 'Weiße grifflose Küche mit Theke und Weinkühlschrank', alt: 'Weiße grifflose Küche mit Theke und Weinkühlschrank von Ochs und Graf',
      gallery: [],
      gm: [],
      specs: [
        { k: 'ORT', v: '[PRÜFEN]' }, { k: 'TYP', v: 'Offene Küche mit Theke' },
        { k: 'MATERIALIEN', v: 'Fronten Weiß, Arbeitsplatte [PRÜFEN]' },
        { k: 'MERKMALE', v: 'Grifflos, integrierter Weinkühlschrank, LED-Unterbauleuchten' },
        { k: 'JAHR', v: '[PRÜFEN]' }
      ],
      links: [{ t: 'Küchen', href: '/kuechen/' }] }
  ];
  FILTERS"""
    tpl,n=re.subn(r"\n  \];\n  FILTERS",lambda _:new,tpl,count=1); assert n==1

mj=json.dumps(man,separators=(',',':'))
tj=json.dumps(tpl).replace('</','<\\u002F')
h=h[:mm.start(2)]+mj+h[mm.end(2):]
tm=get('template')
h=h[:tm.start(2)]+'\n'+tj+'\n  '+h[tm.end(2):]
open('index.html','w').write(h)
print('ok',imgmap,len(h))
