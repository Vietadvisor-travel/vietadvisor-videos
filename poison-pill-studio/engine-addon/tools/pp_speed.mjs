// pp_speed — how long does each beat take to render? (ms per frame at 1920×1080, measured in the real renderer)
// Finds the slow beats before a long render; the full render time ≈ Σ(beat ms × beat frames) / jobs.
//   node tools/pp_speed.mjs stories/<file>.story [--n 6] [--scale 1]
import { launch } from './browser.mjs'; import fs from 'fs';
const [ep] = process.argv.slice(2); const opt = k => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : undefined; };
const n = +(opt('n') || 6), sc = +(opt('scale') || 1), fps = +(opt('fps') || 30);
const browser = await launch(); const page = await browser.newPage(); page.on('pageerror', e => console.log('ERR:', e.message));
await page.goto('file://' + process.cwd() + '/studio.html'); await page.evaluate(() => window.READY);
const res = await page.evaluate(([txt, n, sc]) => { const ep = window.EPISODE = SB.compile(txt); const c = document.getElementById('c'); c.width = Math.round(1920 * sc); c.height = Math.round(1080 * sc); W = c.width; H = c.height; ctx = c.getContext('2d'); loadEpisode(ep);
  return ep.scenes.map((s, i) => { const t0 = _starts[i]; renderEpisode(t0 + .05); const ts = []; for (let k = 0; k < n; k++) { const t = t0 + s.dur * (k + .5) / n; const a = performance.now(); renderEpisode(t); c.toDataURL('image/jpeg', .9); ts.push(performance.now() - a); }
    const fx = ((s.pp && s.pp.bg) || '') + ' ' + (txt.split(/\n/).filter(l => /^#\s*cine/.test(l))[i] || '').replace(/.*fx="([a-z0-9]+):.*/, '$1').slice(0, 20); return { i: i + 1, dur: s.dur, ms: ts.reduce((a, b) => a + b, 0) / n, max: Math.max(...ts), what: fx.trim() }; }); }, [fs.readFileSync(ep, 'utf8'), n, sc]);
await browser.close(); let total = 0;
console.log('beat  dur(s)  ms/frame  max   what'); res.forEach(r => { total += r.ms * r.dur * fps; console.log(String(r.i).padEnd(5), r.dur.toFixed(1).padStart(6), r.ms.toFixed(0).padStart(9), r.max.toFixed(0).padStart(5), ' ', r.what, r.ms > 250 ? '  ← SLOW' : ''); });
console.log(`\nestimated render (1 job, ${fps} fps): ${(total / 1000 / 60).toFixed(1)} min for ${(res.reduce((a, r) => a + r.dur, 0) / 60).toFixed(1)} min of film — divide by --jobs`);
