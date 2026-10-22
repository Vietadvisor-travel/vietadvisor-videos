// pp_looksheet — the same story rendered in every look (rows = looks, columns = beats, mid-beat frame) → out/pp_looks.jpg
//   node tools/pp_looksheet.mjs stories/<file>.story [--looks dossier,tech,...] [--at .6]
import { launch } from './browser.mjs'; import fs from 'fs'; import { execFileSync } from 'child_process';
const [ep] = process.argv.slice(2); const opt = k => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : undefined; };
const at = +(opt('at') || .62); const browser = await launch(); const page = await browser.newPage(); page.on('pageerror', e => console.log('ERR:', e.message));
await page.goto('file://' + process.cwd() + '/studio.html'); await page.evaluate(() => window.READY);
const looks = opt('looks') ? opt('looks').split(',') : await page.evaluate(() => Object.keys(window.PPCINE.LOOKS));
const txt = fs.readFileSync(ep, 'utf8').replace(/^\s*look\s*:.*$/im, ''); fs.mkdirSync('out/looks', { recursive: true }); const files = [];
for (const L of looks) { const urls = await page.evaluate(([t, at]) => { const ep = window.EPISODE = SB.compile(t); const c = document.getElementById('c'); c.width = 640; c.height = 360; W = c.width; H = c.height; ctx = c.getContext('2d'); loadEpisode(ep);
    return ep.scenes.map((s, i) => { renderEpisode(_starts[i] + .05); renderEpisode(_starts[i] + s.dur * at); return c.toDataURL('image/jpeg', .85); }); }, ['look: ' + L + '\n' + txt, at]);
  urls.forEach((u, i) => { const f = `out/looks/${L}_${i}.jpg`; fs.writeFileSync(f, Buffer.from(u.split(',')[1], 'base64')); files.push([L, i, f]); }); console.log('look', L, 'ok'); }
await browser.close(); fs.writeFileSync('out/looks/list.json', JSON.stringify({ looks, files }));
try { execFileSync('python3', ['-c', `import json;from PIL import Image,ImageDraw
d=json.load(open('out/looks/list.json'));L=d['looks'];n=max(f[1] for f in d['files'])+1
S=Image.new('RGB',(110+n*644,len(L)*364),'#222');D=ImageDraw.Draw(S)
for l,i,f in d['files']:
  r=L.index(l);S.paste(Image.open(f),(110+i*644,r*364))
for r,l in enumerate(L): D.text((8,r*364+170),l,fill='#fff')
S.save('out/pp_looks.jpg',quality=85)`]); console.log('→ out/pp_looks.jpg'); } catch (e) { console.log('montage failed (needs python3 + PIL)', e.message); }
