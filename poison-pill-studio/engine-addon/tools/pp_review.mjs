// Automatic director's review sheets: renders a frame 0.45 s after EVERY visual event of EVERY beat (plus the first frame
// of each beat), tiles them 4×4 with labels → out/<slug>_review_01.jpg … Look at every sheet before making the film.
//   node tools/pp_review.mjs stories/<slug>.story [--max 64] [--beats 3-9]
import { launch } from './browser.mjs'; import fs from 'fs'; import path from 'path';
const [ep] = process.argv.slice(2); const opt = k => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : undefined; };
const max = +(opt('max') || 64); const [b0, b1] = (opt('beats') || '1-9999').split('-').map(Number); const base = 'out/' + path.basename(ep).replace(/\.\w+$/, '');
const browser = await launch(); const page = await browser.newPage(); page.on('pageerror', e => console.log('ERR:', e.message));
await page.goto('file://' + process.cwd() + '/studio.html'); await page.evaluate(() => window.READY);
const sheets = await page.evaluate(([txt, max, b0, b1]) => { const ep = SB.compile(txt); const c = document.getElementById('c'); c.width = 960; c.height = 540; W = 960; H = 540; ctx = c.getContext('2d'); loadEpisode(ep);
  const T = []; ep.scenes.forEach((s, i) => { const s0 = _starts[i]; if (i + 1 >= b0 && i + 1 <= b1) { T.push([s0 + .05, `b${i + 1} start`]); ((s.pp && s.pp.ev) || []).forEach(t => { if (t < s.dur) T.push([s0 + Math.min(s.dur - .05, t + .45), `b${i + 1} +${t.toFixed(1)}s`]); }); } });
  const pts = T.slice(0, max); const out = []; for (let k = 0; k < pts.length; k += 16) { const grp = pts.slice(k, k + 16); const cv = mkCanvas(4 * 480, Math.ceil(grp.length / 4) * 286); const o = cv.getContext('2d'); o.fillStyle = '#111'; o.fillRect(0, 0, cv.width, cv.height);
    grp.forEach(([t, lab], i) => { renderEpisode(t); const x = (i % 4) * 480, y = Math.floor(i / 4) * 286; o.drawImage(c, x, y, 480, 270); o.fillStyle = '#ddd'; o.font = '13px sans-serif'; o.fillText(`${lab}  @${t.toFixed(2)}s`, x + 4, y + 282); }); out.push(cv.toDataURL('image/jpeg', .82)); }
  return { out, n: pts.length, total: T.length }; }, [fs.readFileSync(ep, 'utf8'), max, b0, b1]);
sheets.out.forEach((u, i) => { const f = `${base}_review_${String(i + 1).padStart(2, '0')}.jpg`; fs.writeFileSync(f, Buffer.from(u.split(',')[1], 'base64')); console.log(f); });
console.log(`${sheets.n} of ${sheets.total} event frames` + (sheets.total > sheets.n ? ` — use --beats to page through the rest` : '')); await browser.close();
