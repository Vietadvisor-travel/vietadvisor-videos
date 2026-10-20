// Beat contact sheet: one ROW per beat, frames at fixed fractions of the beat (default 4: .12 .42 .72 .96), so you see how
// every beat EVOLVES (start → middle → payoff → handover) — the sheet critics and the director read first.
//   node tools/pp_sheet.mjs stories/<slug>.story [--fmt h|v] [--at .12,.42,.72,.96] [--beats 3-9]   → out/<slug>_sheet_<fmt>_NN.jpg
import { launch } from './browser.mjs'; import fs from 'fs'; import path from 'path';
const [ep] = process.argv.slice(2); const opt = k => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : undefined; };
if (!ep) { console.log('usage: node tools/pp_sheet.mjs stories/<slug>.story [--fmt h|v] [--at .12,.42,.72,.96] [--beats a-b]'); process.exit(1); }
const fmt = opt('fmt') || 'h'; const fr = (opt('at') || '.12,.42,.72,.96').split(',').map(Number); const [b0, b1] = (opt('beats') || '1-9999').split('-').map(Number);
const base = 'out/' + path.basename(ep).replace(/\.\w+$/, ''); fs.mkdirSync('out', { recursive: true });
const browser = await launch(); const page = await browser.newPage(); const errs = []; page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (/PP:|pp_cam|pp_sets|Error/.test(m.text())) errs.push(m.text()); });
await page.goto('file://' + process.cwd() + '/studio.html'); await page.evaluate(() => window.READY);
const res = await page.evaluate(([txt, fmt, fr, b0, b1]) => { const ep = SB.compile(txt); const c = document.getElementById('c'); const [w, h] = fmt === 'v' ? [540, 960] : [960, 540]; c.width = w; c.height = h; W = w; H = h; ctx = c.getContext('2d'); loadEpisode(ep);
  const rows = []; ep.scenes.forEach((s, i) => { if (i + 1 < b0 || i + 1 > b1) return; rows.push({ i, t0: _starts[i], dur: s.dur, cap: ((s.captions || [])[0] || [])[2] || s.id }); });
  const tw = fmt === 'v' ? 216 : 384, th = fmt === 'v' ? 384 : 216, lab = 18, per = 6, out = [];
  for (let k = 0; k < rows.length; k += per) { const grp = rows.slice(k, k + per); const cv = mkCanvas(fr.length * tw, grp.length * (th + lab)); const o = cv.getContext('2d'); o.fillStyle = '#111'; o.fillRect(0, 0, cv.width, cv.height);
    grp.forEach((r, j) => fr.forEach((f, q) => { const t = r.t0 + Math.min(r.dur - .04, Math.max(.04, f * r.dur)); renderEpisode(t); const x = q * tw, y = j * (th + lab); o.drawImage(c, x, y, tw, th); o.fillStyle = '#ddd'; o.font = '12px sans-serif'; o.fillText(q === 0 ? `b${r.i + 1}  ${String(r.cap).slice(0, 40)}` : `${(f * 100) | 0}%  @${t.toFixed(1)}s`, x + 4, y + th + 13); }));
    out.push(cv.toDataURL('image/jpeg', .84)); }
  return out; }, [fs.readFileSync(ep, 'utf8'), fmt, fr, b0, b1]);
res.forEach((u, i) => { const f = `${base}_sheet_${fmt}_${String(i + 1).padStart(2, '0')}.jpg`; fs.writeFileSync(f, Buffer.from(u.split(',')[1], 'base64')); console.log(f); });
if (errs.length) console.log('ENGINE MESSAGES:\n  ' + [...new Set(errs)].slice(0, 20).join('\n  '));
await browser.close();
