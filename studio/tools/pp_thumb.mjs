// YouTube thumbnail from the same engine (1280×720 PNG). Write a one-beat story (or point at a beat of the episode):
//   node tools/pp_thumb.mjs stories/<slug>_thumb.story [--t 1.8] [--beat 1] → out/<slug>_thumb.png
// Thumbnail rules: one real face cut-out (expressive, BW, white border) · one number in gold · one red word or red X ·
// max 3 elements · readable at 160 px wide. Captions are hidden automatically.
import { launch } from './browser.mjs'; import fs from 'fs'; import path from 'path';
const [ep] = process.argv.slice(2); const opt = k => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : undefined; };
const browser = await launch(); const page = await browser.newPage(); await page.goto('file://' + process.cwd() + '/studio.html'); await page.evaluate(() => window.READY);
const url = await page.evaluate(([txt, t, beat]) => { const ep = SB.compile(txt); ep.scenes.forEach(s => { s.hideCaps = true; }); const c = document.getElementById('c'); c.width = 1920; c.height = 1080; W = 1920; H = 1080; ctx = c.getContext('2d'); loadEpisode(ep);
  renderEpisode(_starts[beat - 1] + t); const o = mkCanvas(1280, 720); o.getContext('2d').drawImage(c, 0, 0, 1280, 720); const small = mkCanvas(160, 90); small.getContext('2d').drawImage(c, 0, 0, 160, 90); return [o.toDataURL('image/png'), small.toDataURL('image/png')]; }, [fs.readFileSync(ep, 'utf8'), +(opt('t') || 1.8), +(opt('beat') || 1)]);
const base = 'out/' + path.basename(ep).replace(/\.\w+$/, ''); fs.writeFileSync(base + '_thumb.png', Buffer.from(url[0].split(',')[1], 'base64')); fs.writeFileSync(base + '_thumb_160.png', Buffer.from(url[1].split(',')[1], 'base64'));
console.log(base + '_thumb.png', '+', base + '_thumb_160.png (check readability at phone size)'); await browser.close();
