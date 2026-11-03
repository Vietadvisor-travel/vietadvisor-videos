// DIRECTOR REVIEW — watch the cut like an editor before the expensive render.
//   node tools/review.mjs stories/my.story            → report + out/my_review.jpg (animatic filmstrip)
// Renders a fast low-res animatic (4 fps), measures motion energy, detects cuts, then checks the
// film against the director checklist: hook energy, dead air, pacing, monotony, peaks, breathing room,
// coverage (CU per minute), light journey, caption density. Ends with a score and the top fixes.
import { launch } from './browser.mjs'; import fs from 'fs'; import path from 'path';
const ep = process.argv[2]; if (!ep) { console.log('usage: node tools/review.mjs stories/x.story'); process.exit(1); }
const base = 'out/' + path.basename(ep).replace(/\.\w+$/, ''); fs.mkdirSync('out', { recursive: true });
const FPS = 4, w = 216, h = 384;
const browser = await launch(); const page = await browser.newPage(); page.on('pageerror', e => console.log('ERR:', e.message));
await page.goto('file://' + process.cwd() + '/studio.html'); await page.evaluate(() => window.READY);
const data = await page.evaluate(([txt, w, h, FPS]) => {
  const ep = SB.compile(txt); const c = document.getElementById('c'); c.width = w; c.height = h; W = w; H = h; ctx = c.getContext('2d'); loadEpisode(ep);
  if (typeof postFrame === 'function') window.postFrame = () => false;
  const D = episodeDuration(), sm = mkCanvas(24, 42), sg = sm.getContext('2d', { willReadFrequently: true }); let prev = null; const energy = [], thumbs = [];
  let st = 0; const want = []; ep.scenes.forEach(s => { for (let k = 0; k < 6; k++) want.push(st + s.dur * (k + .5) / 6); st += s.dur; });
  for (let i = 0; i * (1 / FPS) < D; i++) { const t = i / FPS; renderEpisode(t); sg.drawImage(c, 0, 0, 24, 42); const d = sg.getImageData(0, 0, 24, 42).data; const g = new Float32Array(24 * 42); for (let j = 0; j < g.length; j++) g[j] = (d[j * 4] * .3 + d[j * 4 + 1] * .59 + d[j * 4 + 2] * .11) / 255;
    let e = 0; if (prev) { for (let j = 0; j < g.length; j++) e += Math.abs(g[j] - prev[j]); e /= g.length; } energy.push(+e.toFixed(4)); prev = g; }
  for (const t of want) { renderEpisode(t); const tc = mkCanvas(w / 2, h / 2); tc.getContext('2d').drawImage(c, 0, 0, w / 2, h / 2); thumbs.push(tc.toDataURL('image/jpeg', .7)); }
  st = 0; const scenes = ep.scenes.map(s0 => { const s = vmerge(s0); const r = { id: s.id, type: (s.id || '').replace(/^\d+_/, ''), start: st, dur: s.dur, moment: s.moment || null, place: s.place || null, time: (s.placeOpts || {}).time || (s.moment ? 'moment' : 'day'), trans: s.transition ? vmerge(s.transition).type : null,
    moves: (s.moves || []).map(m => m.type), cover: (s.coverage || []).map(c => [c.t, c.size]), caps: (s.captions || []).filter(c => !(c[3] && c[3].hide)).map(c => [c[0], c[1], String(c[2])]), fg: s.fg || null }; st += s.dur; return r; });
  return { D, energy, thumbs, scenes };
}, [fs.readFileSync(ep, 'utf8'), w, h, FPS]);
const { D, energy, scenes } = data;
// ---------------- analysis
const med = a => { const b = [...a].sort((x, y) => x - y); return b[Math.floor(b.length / 2)] || 0; };
const E = energy.slice(1), m = med(E) || .001; const issues = []; let score = 100; const add = (pts, sev, msg, fix) => { score -= pts; issues.push({ pts, sev, msg, fix }); };
const body = scenes.filter(s => s.type !== 'end');
// cuts = scene boundaries + coverage changes + energy spikes inside moments
const cuts = new Set(); body.forEach(s => { cuts.add(+s.start.toFixed(2)); s.cover.forEach(([t]) => t > 0 && cuts.add(+(s.start + t).toFixed(2))); });
energy.forEach((e, i) => { if (e > m * 7 && e > .06) cuts.add(+(i / FPS).toFixed(2)); });
const cutT = [...cuts].sort((a, b) => a - b).filter((t, i, a) => !i || t - a[i - 1] > .6); const shots = cutT.map((t, i) => (cutT[i + 1] ?? (D - (scenes.at(-1)?.type === 'end' ? scenes.at(-1).dur : 0))) - t).filter(x => x > .3);
const asl = shots.reduce((a, b) => a + b, 0) / Math.max(1, shots.length), sd = Math.sqrt(shots.reduce((a, b) => a + (b - asl) ** 2, 0) / Math.max(1, shots.length)), cv = sd / (asl || 1);
// 1 hook
const hookE = energy.slice(1, 1 + FPS * 1.5); const hookAvg = hookE.reduce((a, b) => a + b, 0) / Math.max(1, hookE.length); const firstCap = body[0]?.caps[0]?.[0] ?? 9;
if (hookAvg < m * .9) add(8, 'WARN', `hook is calm (first 1.5 s energy ${(hookAvg / m).toFixed(1)}× median)`, 'open on motion: a moment (crossing, train, downpour), cam=snap/whip, or a gag hit in the first second');
if (firstCap > .6) add(5, 'WARN', `first words land at ${firstCap.toFixed(1)} s`, 'put the hook line in the first 0.5 s (capAt=.2 on a moment)');
// 2 dead air
const capStarts = body.flatMap(s => s.caps.map(c => s.start + c[0]));
let run = 0, runStart = 0; energy.forEach((e, i) => { const t = i / FPS; const newCap = capStarts.some(c => c > t - 1 / FPS && c <= t); if (e < m * .3 && !newCap) { if (!run) runStart = t; run++; } else { if (run / FPS >= 2.25) { const s = body.find(s => runStart >= s.start && runStart < s.start + s.dur); if (s && s.type !== 'end') add(4, 'WARN', `dead air ${(run / FPS).toFixed(1)} s at ${runStart.toFixed(1)} s (${s.id})`, 'add a move (cam=breathe/arc), extras, weather, fg=…, a reaction cut, or trim dur'); } run = 0; } });
// 3 pacing
if (asl > 4.2) add(8, 'WARN', `average shot length ${asl.toFixed(1)} s — slow for vertical`, 'add shots="WS|MS|CU" coverage or split long beats; target 2–3.5 s');
if (asl < 1.3) add(5, 'WARN', `average shot length ${asl.toFixed(1)} s — frantic`, 'hold key images longer; give payoffs 3 s+');
if (cv < .3 && shots.length > 6) add(6, 'WARN', `shot lengths are metronomic (variation ${(cv * 100).toFixed(0)} %)`, 'mix quick cuts (1–1.5 s) with held shots (4–6 s) — rhythm, not a ticking clock');
// 4 monotony
const sizes = body.flatMap(s => s.cover.map(c => c[1])); for (let i = 2; i < sizes.length; i++) if (sizes[i] === sizes[i - 1] && sizes[i] === sizes[i - 2]) { add(3, 'INFO', `three ${sizes[i]} shots in a row`, 'change size by ≥2 steps between cuts'); break; }
const tr = body.map(s => s.trans).filter(Boolean); const trTop = Object.entries(tr.reduce((a, t) => (a[t] = (a[t] || 0) + 1, a), {})).sort((a, b) => b[1] - a[1])[0]; if (trTop && tr.length > 4 && trTop[1] / tr.length > .45) add(5, 'WARN', `transition "${trTop[0]}" used for ${trTop[1]}/${tr.length} cuts`, 'choose transitions by meaning (film-language §5); most cuts should be plain cuts');
const mv = body.flatMap(s => s.moves.filter(x => !['drift', 'handheld', 'follow', 'focus'].includes(x))); const mvTop = Object.entries(mv.reduce((a, t) => (a[t] = (a[t] || 0) + 1, a), {})).sort((a, b) => b[1] - a[1])[0]; if (mvTop && mv.length > 5 && mvTop[1] / mv.length > .5) add(4, 'INFO', `camera move "${mvTop[0]}" dominates (${mvTop[1]}/${mv.length})`, 'vary: crane, arc, vertigo for awe, snap/whip for comedy, still frames for weight');
const types = body.map(s => s.moment ? 'moment:' + s.moment : s.type); for (let i = 2; i < types.length; i++) if (types[i] === types[i - 1] && types[i] === types[i - 2]) { add(5, 'WARN', `three "${types[i]}" scenes in a row`, 'alternate information, character and spectacle'); break; }
// 5 peaks
const nMom = body.filter(s => s.moment).length; if (D > 40 && !nMom) add(10, 'WARN', 'no signature moment — the film has no visual peak', 'add 1–2 `# moment kind=…` at the emotional peaks (setpieces list)');
if (nMom > Math.max(3, body.length * .6)) add(6, 'WARN', `${nMom}/${body.length} scenes are set pieces — feels like a showreel`, 'put character/dialogue/info beats between the peaks; peaks need valleys');
// 6 breathing room
const dens = body.map(s => { const words = s.caps.reduce((a, c) => a + c[2].split(/\s+/).length, 0); return { s, wps: words / s.dur }; }); if (D > 55 && !dens.some(d => d.wps < 1.3)) add(5, 'INFO', 'no quiet beat — every scene is talking', 'give one 3–6 s image room to breathe (music up, no caption) after a dense run');
dens.filter(d => d.wps > 3.3).forEach(d => add(3, 'WARN', `${d.s.id} reads at ${d.wps.toFixed(1)} words/s`, 'cut words or extend dur; aim ≤2.8 words/s'));
// 7 coverage
const cu = sizes.filter(x => /^(CU|ECU|MCU)$/.test(x)).length; if (D > 45 && cu / (D / 60) < 1) add(5, 'INFO', `only ${cu} close shots for ${(D / 60).toFixed(1)} min`, 'at least one CU reaction per minute (shots="… CU <who>")');
// 8 light journey
const times = new Set(body.map(s => s.time)); if (body.length > 5 && times.size < 2) add(5, 'INFO', 'one light state for the whole film', 'move the light with the story: day → sunset payoff → night');
const fgN = body.filter(s => s.fg).length; if (D > 45 && !fgN) add(3, 'INFO', 'no foreground framing anywhere', 'add fg=leaves|wires|lanterns|bamboo|window on 1–2 scenes for depth');
score = Math.max(0, Math.round(score));
// ---------------- report
let out = `\nDIRECTOR REVIEW · ${path.basename(ep)} · ${D.toFixed(1)} s · ${body.length} scenes · ${shots.length} shots · ASL ${asl.toFixed(1)} s · rhythm ${(cv * 100).toFixed(0)} % · ${nMom} moments · light: ${[...times].join('/')}\n`;
out += `SCORE ${score}/100  ${score >= 85 ? '— ready to make' : score >= 70 ? '— good; fix the warnings for a better film' : '— revise before rendering'}\n`;
for (const i of issues.sort((a, b) => b.pts - a.pts)) out += `  ${i.sev.padEnd(4)} ${i.msg}\n        → ${i.fix}\n`;
if (!issues.length) out += '  no notes. \n';
// ---------------- filmstrip: one row per scene, 6 frames + energy bars
const strip = await page.evaluate(async ([thumbs, scenes, energy, FPS, w, h]) => { const tw = w / 2, th = h / 2, lab = 150, pad = 6, rowH = th + 30; const Wd = lab + 6 * (tw + pad) + pad, Hd = scenes.length * (rowH + pad) + pad;
  const c = mkCanvas(Wd, Hd), g = c.getContext('2d'); g.fillStyle = '#17120f'; g.fillRect(0, 0, Wd, Hd); const mx = Math.max(...energy.slice(1), .001);
  for (let r = 0; r < scenes.length; r++) { const s = scenes[r], y = pad + r * (rowH + pad); g.fillStyle = '#f3e6c4'; g.font = '700 14px "Be Vietnam Pro"'; g.fillText(s.id, 8, y + 18); g.font = '12px "Be Vietnam Pro"'; g.fillStyle = '#c9b89a'; g.fillText(`${s.start.toFixed(1)}s · ${s.dur.toFixed(1)}s`, 8, y + 36); g.fillText(s.moment ? 'moment: ' + s.moment : (s.cover.map(c => c[1]).join(' ') || '—'), 8, y + 54); g.fillText((s.trans || 'cut') + (s.fg ? ' · fg ' + s.fg : ''), 8, y + 72);
    for (let k = 0; k < 6; k++) { const im = new Image(); im.src = thumbs[r * 6 + k]; await im.decode(); g.drawImage(im, lab + pad + k * (tw + pad), y); }
    const i0 = Math.floor(s.start * FPS), i1 = Math.floor((s.start + s.dur) * FPS), bw = (6 * (tw + pad) - pad) / Math.max(1, i1 - i0); for (let i = i0; i < i1; i++) { const e = (energy[i] || 0) / mx, bh = Math.max(1, e * 24); g.fillStyle = e < .08 ? '#c0503a' : '#e8b04a'; g.fillRect(lab + pad + (i - i0) * bw, y + th + 28 - bh, Math.max(1, bw - 1), bh); } }
  return c.toDataURL('image/jpeg', .82); }, [data.thumbs, scenes, energy, FPS, w, h]);
fs.writeFileSync(base + '_review.jpg', Buffer.from(strip.split(',')[1], 'base64')); fs.writeFileSync(base + '_review.txt', out);
console.log(out + `filmstrip: ${base}_review.jpg (red bars = no motion)`);
await browser.close();
