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

mj=json.dumps(man,separators=(',',':'))
tj=json.dumps(tpl).replace('</','<\\u002F')
h=h[:mm.start(2)]+mj+h[mm.end(2):]
tm=get('template')
h=h[:tm.start(2)]+'\n'+tj+'\n  '+h[tm.end(2):]
open('index.html','w').write(h)
print('ok',imgmap,len(h))
