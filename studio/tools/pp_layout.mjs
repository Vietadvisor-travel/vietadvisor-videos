// pp_layout — automatic layout QA: finds on-screen type that leaves the safe area or collides with other type.
// It hooks the canvas text calls while the engine draws each beat, so it measures what is really on the frame
// (custom scenes, build, hero, stamps, lower thirds, modes…), not what the storyboard intends.
//   node tools/pp_layout.mjs stories/<act>.story [--at .55,.9] [--safe .035] [--beats a-b]   → report + out/<act>_layout_NN.jpg (flagged beats, boxes drawn)
// Exit code 1 when anything is flagged. Gate (CLAUDE.md): 0 flags on every act before rendering.
import { launch } from './browser.mjs'; import fs from 'fs'; import path from 'path';
const [ep] = process.argv.slice(2); const opt = k => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : undefined; };
if (!ep) { console.log('usage: node tools/pp_layout.mjs stories/<act>.story [--at .55,.9] [--safe .035] [--beats a-b]'); process.exit(1); }
const fr = (opt('at') || '.55,.9').split(',').map(Number), safe = +(opt('safe') || .035); const [b0, b1] = (opt('beats') || '1-9999').split('-').map(Number);
const base = 'out/' + path.basename(ep).replace(/\.\w+$/, ''); fs.mkdirSync('out', { recursive: true });
const browser = await launch(); const page = await browser.newPage(); await page.goto('file://' + process.cwd() + '/studio.html'); await page.evaluate(() => window.READY);
const res = await page.evaluate(async ([txt, fr, safe, b0, b1]) => {
  const ep = SB.compile(txt); const c = document.getElementById('c'); c.width = 1920; c.height = 1080; W = 1920; H = 1080; ctx = c.getContext('2d'); loadEpisode(ep);
  const P = CanvasRenderingContext2D.prototype; let log = null;
  const hook = name => { const f = P[name]; P[name] = function (s, x, y, ...r) { if (log && this.canvas === c) { const str = String(s).trim(); const a = this.globalAlpha; if (str.length > 1 && /[A-Za-z0-9$€%]/.test(str) && a > .35) { const m = this.measureText(str); const w = m.width, asc = m.actualBoundingBoxAscent || 0, dsc = m.actualBoundingBoxDescent || 0;
        const al = this.textAlign, x0 = al === 'center' ? x - w / 2 : (al === 'right' || al === 'end') ? x - w : x; const T = this.getTransform(); const pts = [[x0, y - asc], [x0 + w, y - asc], [x0, y + dsc], [x0 + w, y + dsc]].map(([px, py]) => [T.a * px + T.c * py + T.e, T.b * px + T.d * py + T.f]);
        const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]); const bx = [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)]; if (bx[3] - bx[1] >= 16) log.push({ s: str, b: bx }); } } return f.call(this, s, x, y, ...r); }; };
  hook('fillText'); hook('strokeText');
  const out = []; for (const [i, s] of ep.scenes.entries()) { if (i + 1 < b0 || i + 1 > b1) continue; const flags = new Map(); let shot = null;
    for (const f of fr) { const t = _starts[i] + Math.min(s.dur - .05, Math.max(.05, f * s.dur)); await renderReady(t); log = []; renderEpisode(t); const L = log; log = null;
      const items = []; L.forEach(e => { const o = items.find(q => q.s === e.s && q.b[0] < e.b[2] + 4 && e.b[0] < q.b[2] + 4 && q.b[1] < e.b[3] + 4 && e.b[1] < q.b[3] + 4); if (!o) items.push({ s: e.s, b: [...e.b] }); else o.b = [Math.min(o.b[0], e.b[0]), Math.min(o.b[1], e.b[1]), Math.max(o.b[2], e.b[2]), Math.max(o.b[3], e.b[3])]; }); /* copies of one string drawn on top of each other (stroke + fill, motion trails) are one item */ const sx0 = W * safe, sy0 = H * safe, sx1 = W * (1 - safe), sy1 = H * (1 - safe); let bad = false;
      items.forEach(e => { const [x0, y0, x1, y1] = e.b; const cut = x0 < sx0 - 2 || x1 > sx1 + 2 || y0 < sy0 - 2 || y1 > sy1 + 2; if (cut && x1 > 0 && x0 < W && y1 > 0 && y0 < H) { flags.set('EDGE ' + e.s, `EDGE  "${e.s.slice(0, 40)}" leaves the safe area (${(f * 100) | 0}%)`); bad = true; } });
      for (let a = 0; a < items.length; a++) for (let b = a + 1; b < items.length; b++) { const A = items[a].b, B = items[b].b; const ix = Math.max(0, Math.min(A[2], B[2]) - Math.max(A[0], B[0])), iy = Math.max(0, Math.min(A[3], B[3]) - Math.max(A[1], B[1])); const area = r => (r[2] - r[0]) * (r[3] - r[1]); const ov = ix * iy / Math.max(1, Math.min(area(A), area(B)));
        if (ov > .2) { const k = 'OVER ' + [items[a].s, items[b].s].sort().join('|'); flags.set(k, `OVERLAP "${items[a].s.slice(0, 30)}" × "${items[b].s.slice(0, 30)}" (${Math.round(ov * 100)} %, at ${(f * 100) | 0}%)`); bad = true; } }
      if (bad && !shot) { const cv = document.createElement('canvas'); cv.width = 960; cv.height = 540; const o = cv.getContext('2d'); o.drawImage(c, 0, 0, 960, 540); o.strokeStyle = '#ff2d55'; o.lineWidth = 2; items.forEach(e => o.strokeRect(e.b[0] / 2, e.b[1] / 2, (e.b[2] - e.b[0]) / 2, (e.b[3] - e.b[1]) / 2)); o.strokeStyle = '#2dd4ff'; o.setLineDash([6, 6]); o.strokeRect(sx0 / 2, sy0 / 2, (sx1 - sx0) / 2, (sy1 - sy0) / 2); shot = cv.toDataURL('image/jpeg', .8); } }
    if (flags.size) out.push({ beat: i + 1, cap: ((s.captions || [])[0] || [])[2] || s.id, flags: [...flags.values()], shot }); }
  return out; }, [fs.readFileSync(ep, 'utf8'), fr, safe, b0, b1]);
res.forEach((r, k) => { console.log(`beat ${r.beat}  "${String(r.cap).slice(0, 60)}"`); r.flags.forEach(f => console.log('   ' + f)); if (r.shot) { const f = `${base}_layout_${String(r.beat).padStart(2, '0')}.jpg`; fs.writeFileSync(f, Buffer.from(r.shot.split(',')[1], 'base64')); console.log('   → ' + f); } });
console.log(`\n${ep}: ${res.length} beat(s) with layout problems${res.length ? '' : ' — CLEAN'}`);
await browser.close(); process.exit(res.length ? 1 : 0);
