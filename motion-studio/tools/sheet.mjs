// CONTACT SHEET — look at the real frames before rendering.  node tools/sheet.mjs stories/x.story [v|h] [perScene=3]
// Renders perScene frames per scene at 540×960 (v) or 960×540 (h) and tiles them → out/<slug>_sheet_<fmt>.jpg
import { launch } from './browser.mjs'; import fs from 'fs'; import path from 'path';
const [ep, fmt = 'v', per = '3'] = process.argv.slice(2); const base = 'out/' + path.basename(ep).replace(/\.\w+$/, '');
const [w, h] = fmt === 'v' ? [540, 960] : [960, 540];
const browser = await launch(); const page = await browser.newPage(); page.on('pageerror', e => console.log('ERR:', e.message)); page.on('console', m => { if (/warn|unknown|no prop/i.test(m.text())) console.log('PAGE:', m.text()); });
await page.goto('file://' + process.cwd() + '/studio.html'); await page.evaluate(() => window.READY);
const url = await page.evaluate(async ([txt, w, h, per]) => {
  const ep = SB.compile(txt); const c = document.getElementById('c'); c.width = w; c.height = h; W = w; H = h; ctx = c.getContext('2d'); loadEpisode(ep);
  const ts = []; let st = 0; ep.scenes.forEach(s => { for (let k = 0; k < per; k++) ts.push([st + s.dur * (k + 1) / (per + .4), s.id]); st += s.dur; });
  const cols = Math.min(ts.length, w < h ? 6 : 4), rows = Math.ceil(ts.length / cols), tw = w / 2, th = h / 2;
  const out = mkCanvas(cols * tw, rows * (th + 18)); const o = out.getContext('2d'); o.fillStyle = '#111'; o.fillRect(0, 0, out.width, out.height);
  for (let i = 0; i < ts.length; i++) { renderEpisode(ts[i][0]); const x = (i % cols) * tw, y = Math.floor(i / cols) * (th + 18); o.drawImage(c, x, y, tw, th); o.fillStyle = '#ccc'; o.font = '12px sans-serif'; o.fillText(ts[i][1] + ' @' + ts[i][0].toFixed(1) + 's', x + 4, y + th + 13); }
  return out.toDataURL('image/jpeg', .85);
}, [fs.readFileSync(ep, 'utf8'), w, h, +per]);
fs.writeFileSync(`${base}_sheet_${fmt}.jpg`, Buffer.from(url.split(',')[1], 'base64')); console.log('sheet:', `${base}_sheet_${fmt}.jpg`); await browser.close();
