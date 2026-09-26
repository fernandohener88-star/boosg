// Erzeugt Bildvarianten (480/960/1600 px, WebP) aus bilder/ nach assets/img/.
// Aufruf: NODE_PATH=<pfad zu playwright-core> node werkzeug/bildvarianten.js bilder assets/img
const { chromium } = require('playwright-core'); const fs=require('fs'), path=require('path');
(async () => {
  const [quelle, ziel] = process.argv.slice(2);
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const p = await b.newPage();
  const out = {};
  for (const f of fs.readdirSync(quelle).filter(f => /\.(webp|png|jpe?g)$/i.test(f))) {
    const id = f.replace(/\.[^.]+$/, '');
    const data = 'data:image/webp;base64,' + fs.readFileSync(path.join(quelle, f)).toString('base64');
    const res = await p.evaluate(async ([data]) => {
      const im = new Image(); im.src = data; await im.decode();
      const W = im.naturalWidth, H = im.naturalHeight, r = [];
      for (const w of [480, 960, 1600]) {
        const ww = Math.min(w, W); if (r.length && ww === r[r.length - 1].w) continue;
        const c = document.createElement('canvas'); c.width = ww; c.height = Math.round(H * ww / W);
        const x = c.getContext('2d'); x.imageSmoothingQuality = 'high'; x.drawImage(im, 0, 0, c.width, c.height);
        r.push({ w: ww, h: c.height, d: c.toDataURL('image/webp', ww <= 480 ? 0.72 : 0.78) });
      }
      return { W, H, r };
    }, [data]);
    out[id] = { w: res.W, h: res.H, varianten: res.r.map(v => v.w) };
    for (const v of res.r) fs.writeFileSync(path.join(ziel, `${id}-${v.w}.webp`), Buffer.from(v.d.split(',')[1], 'base64'));
  }
  fs.writeFileSync(path.join(ziel, 'masse.json'), JSON.stringify(out, null, 1));
  await b.close();
})();
