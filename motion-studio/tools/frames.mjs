// node tools/frames.mjs stories/x.story v "0.5,1,1.5,2.5" → out/<slug>_frames_v.jpg (frames at exact episode times)
import { launch } from './browser.mjs'; import fs from 'fs'; import path from 'path';
const [ep, fmt = 'v', times = '1,2,3'] = process.argv.slice(2); const base = 'out/' + path.basename(ep).replace(/\.\w+$/, ''); const [w, h] = fmt === 'v' ? [540, 960] : [960, 540];
const browser = await launch(); const page = await browser.newPage(); page.on('pageerror', e => console.log('ERR:', e.message));
await page.goto('file://' + process.cwd() + '/studio.html'); await page.evaluate(() => window.READY);
const url = await page.evaluate(async ([txt, w, h, ts]) => { const ep = SB.compile(txt); const c = document.getElementById('c'); c.width = w; c.height = h; W = w; H = h; ctx = c.getContext('2d'); loadEpisode(ep);
  const T = ts.split(',').map(Number), cols = Math.min(T.length, w < h ? 6 : 4), rows = Math.ceil(T.length / cols), tw = w / 2, th = h / 2; const out = mkCanvas(cols * tw, rows * (th + 16)); const o = out.getContext('2d'); o.fillStyle = '#111'; o.fillRect(0, 0, out.width, out.height);
  T.forEach((t, i) => { renderEpisode(t); const x = (i % cols) * tw, y = Math.floor(i / cols) * (th + 16); o.drawImage(c, x, y, tw, th); o.fillStyle = '#ccc'; o.font = '12px sans-serif'; o.fillText('@' + t + 's', x + 4, y + th + 12); }); return out.toDataURL('image/jpeg', .85); }, [fs.readFileSync(ep, 'utf8'), w, h, times]);
fs.writeFileSync(`${base}_frames_${fmt}.jpg`, Buffer.from(url.split(',')[1], 'base64')); console.log(`${base}_frames_${fmt}.jpg`); await browser.close();
