// QA in one command: text rules + visual collision checks for 16:9 and 9:16, plus ONE contact-sheet image.
//   node tools/lint.mjs stories/my.story [--out out/my]     → prints a short report, writes out/my_sheet.jpg
import { launch } from './browser.mjs'; import fs from 'fs'; import path from 'path';
const ep = process.argv[2]; const oi = process.argv.indexOf('--out'); const outBase = oi > 0 ? process.argv[oi + 1] : 'out/' + path.basename(ep).replace(/\.\w+$/, '');
fs.mkdirSync(path.dirname(outBase), { recursive: true });
const browser = await launch();
const page = await browser.newPage(); page.on('pageerror', e => console.log('ERR:', e.message));
const isStory = /\.(story|txt)$/.test(ep);
await page.goto('file://' + process.cwd() + '/studio.html' + (isStory ? '' : '?ep=' + encodeURIComponent(ep)), { timeout: 180000 }); await page.evaluate(() => window.READY);
const voi = process.argv.indexOf('--vo'); const VO = voi > 0 && fs.existsSync(process.argv[voi + 1]) ? JSON.parse(fs.readFileSync(process.argv[voi + 1], 'utf8')) : null;
const ENVP = voi > 0 ? path.join(path.dirname(process.argv[voi + 1]), 'envs.json') : null; const ENV = ENVP && fs.existsSync(ENVP) ? JSON.parse(fs.readFileSync(ENVP, 'utf8')) : null; const VISP = ENVP && ENVP.replace(/envs\.json$/, 'visemes.json'); const VIS = VISP && fs.existsSync(VISP) ? JSON.parse(fs.readFileSync(VISP, 'utf8')) : null;
if (isStory) await page.evaluate(([t, vo, env, vis]) => { window.VOENV = env; window.VOVIS = vis; window.EPISODE = SB.compile(t, vo ? { vo } : {}); }, [fs.readFileSync(ep, 'utf8'), VO, ENV, VIS]);
await page.addScriptTag({ path: 'engine/lint.js' });
const tiles = []; let report = '';
const FMTS = process.argv.includes('--both') ? [[1080, 1920, '9x16'], [1920, 1080, '16x9']] : process.argv.includes('--16x9') ? [[1920, 1080, '16x9']] : [[1080, 1920, '9x16']];
for (const [w, h, f] of FMTS) {
  const r = await page.evaluate(([w, h]) => { const c = document.getElementById('c'); c.width = w; c.height = h; W = w; H = h; ctx = c.getContext('2d'); loadEpisode(window.EPISODE); return lintEpisode(); }, [w, h]);
  report += `\n[${f}] ${r.summary.duration}s · ${r.summary.scenes} scenes · ${r.summary.errors} errors · ${r.summary.warnings} warnings · ${r.summary.info} info\n`;
  for (const i of r.issues.filter(i => f === FMTS[0][2] || !/caption too|banned|price|transition|over 12|camera move|end frame|first 0.4/.test(i.msg))) report += `  ${i.sev.toUpperCase().padEnd(5)} ${String(i.t).padStart(6)}s ${i.scene.padEnd(14)} ${i.msg}${i.n > 1 ? ` (×${i.n})` : ''}\n`;
  // one frame per scene at 55% of its length
  const dv = FMTS.length === 1 ? 4 : 5; const shots = await page.evaluate(([w, h, dv]) => { const res = []; let st = 0; for (const s of EP.scenes) { const t = st + s.dur * .55; renderEpisode(t); const c = mkCanvas(w / dv, h / dv); c.getContext('2d').drawImage(document.getElementById('c'), 0, 0, w / dv, h / dv); res.push({ id: s.id, t: +t.toFixed(1), d: c.toDataURL('image/jpeg', .8) }); st += s.dur; } return res; }, [w, h, dv]);
  tiles.push({ f, w: w / dv, h: h / dv, shots });
}
// compose contact sheet: 16:9 tiles 6 per row, then 9:16 tiles 12 per row
const sheet = await page.evaluate(async (tiles) => { const pad = 8, lab = 20, perRow = r => r.f === '16x9' ? 6 : (tiles.length === 1 ? 8 : 12); let Wd = 0, Hd = pad; for (const r of tiles) { const n = perRow(r), rows = Math.ceil(r.shots.length / n); Wd = Math.max(Wd, n * (r.w + pad) + pad); Hd += rows * (r.h + lab + pad) + pad; }
  const c = mkCanvas(Wd, Hd), g = c.getContext('2d'); g.fillStyle = '#1b1512'; g.fillRect(0, 0, Wd, Hd); let y = pad;
  for (const r of tiles) { const n = perRow(r); for (let i = 0; i < r.shots.length; i++) { const s = r.shots[i], x = pad + (i % n) * (r.w + pad), yy = y + Math.floor(i / n) * (r.h + lab + pad); const im = new Image(); im.src = s.d; await im.decode(); g.drawImage(im, x, yy + lab); g.fillStyle = '#f3e6c4'; g.font = '700 14px "Be Vietnam Pro"'; g.fillText(`${s.id} @${s.t}s`, x, yy + 15); } y += Math.ceil(r.shots.length / n) * (r.h + lab + pad) + pad; }
  return c.toDataURL('image/jpeg', .82); }, tiles);
fs.writeFileSync(outBase + '_sheet.jpg', Buffer.from(sheet.split(',')[1], 'base64'));
// ---- variety: every video should have its own shape (compared with the other stories in the same folder)
if (isStory) { const beatsOf = txt => [...txt.matchAll(/^#\s*(\w+)(.*)$/gm)].map(m => ({ type: m[1].toLowerCase() + (m[1].toLowerCase() === 'moment' ? ':' + ((m[2].match(/kind=(\w+)/) || [])[1] || '') : ''), place: (m[2].match(/place=(\w+)/) || [])[1] }));
  const fmtOf = txt => ((txt.match(/^format\s*:\s*(\w+)/m) || [])[1] || 'explainer'); const me = fs.readFileSync(ep, 'utf8'), mb = beatsOf(me), mt = mb.map(b => b.type).filter(t => t !== 'end');
  const lcs = (a, b) => { const d = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0)); for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) d[i][j] = a[i - 1] === b[j - 1] ? d[i - 1][j - 1] + 1 : Math.max(d[i - 1][j], d[i][j - 1]); return d[a.length][b.length]; };
  let v = '';
  const csOf = txt => ((txt.match(/^charstyle\s*:\s*(\w+)/m) || [])[1] || ({ explainer: 'chibi', countdown: 'toy', myth: 'flat', food: 'storybook', history: 'ink', guide: 'flat', versus: 'paper', story: 'storybook', night: 'noir', quiz: 'toy' })[fmtOf(txt)] || 'chibi');
  { const dir = path.dirname(ep), others = fs.readdirSync(dir).filter(f => /\.story$/.test(f) && path.join(dir, f) !== ep).map(f => ({ f, st: fs.statSync(path.join(dir, f)).mtimeMs, cs: csOf(fs.readFileSync(path.join(dir, f), 'utf8')) })).sort((a, b) => b.st - a.st);
    if (others[0] && others[0].cs === csOf(me)) v += `  INFO  variety  same character style "${csOf(me)}" as ${others[0].f} — set charstyle: (storybook flat paper ink anime toy noir retro chibi nutshell)\n`; }
  for (let i = 2; i < mt.length; i++) if (mt[i] === mt[i - 1] && mt[i] === mt[i - 2] && !['countdown', 'chapter'].includes(mt[i])) v += `  WARN  variety  three "${mt[i]}" beats in a row — break it up (gag, stat, quiz, montage…)\n`;
  for (let i = 2; i < mb.length; i++) if (mb[i].place && mb[i].place === mb[i - 1].place && mb[i].place === mb[i - 2].place) v += `  INFO  variety  place "${mb[i].place}" three scenes in a row\n`;
  if (mt.length >= 8 && new Set(mt).size < 5) v += `  WARN  variety  only ${new Set(mt).size} beat types in ${mt.length} beats — use more of the beat library\n`;
  const dir = path.dirname(ep); for (const f of fs.readdirSync(dir).filter(f => /\.story$/.test(f) && path.join(dir, f) !== ep)) { const ot = fs.readFileSync(path.join(dir, f), 'utf8'); const obt = beatsOf(ot).map(b => b.type).filter(t => t !== 'end'); const sim = 2 * lcs(mt, obt) / Math.max(1, mt.length + obt.length);
    if (sim > .75) v += `  WARN  variety  ${Math.round(sim * 100)}% same beat structure as ${f} — choose another format/structure (references/directing.md)\n`;
    else if (fmtOf(ot) === fmtOf(me) && mt.slice(0, 3).join() === obt.slice(0, 3).join()) v += `  INFO  variety  same format and opening as ${f} — vary the hook\n`; }
  const reg = fs.existsSync('engine/library/images.json') ? JSON.parse(fs.readFileSync('engine/library/images.json', 'utf8')) : {};
  const used = [...me.matchAll(/(?:photo|img)=(\w+)/g)].map(m => m[1]).concat([...me.matchAll(/photos="([^"]+)"/g)].flatMap(m => m[1].split('|').map(s => s.trim())));
  for (const id of used) { if (!reg[id]) v += `  ERROR photo    sticker "${id}" not found — python3 tools/sticker.py make <photo> ${id}\n`; else if (/^https?:/.test(reg[id].from || '') && !(reg[id].credit && reg[id].license)) v += `  WARN  photo    "${id}" came from the web without credit/licence\n`; }
  // ---- format (Oct 2026): visual-first — show what is said; no talking-head film
  { const hs = [...me.matchAll(/^#\s*(\w+)(.*)$/gm)].filter(m => !['end', 'chapter'].includes(m[1])); const talky = hs.filter(m => ['talk', 'intro', 'dialogue', 'social', 'hook'].includes(m[1]) || (m[1] === 'price' && /hero=/.test(m[2])) || /\bhost=/.test(m[2]));
    if (hs.length && talky.length / hs.length > .15) v += `  ERROR format   ${talky.length}/${hs.length} beats are a character standing and talking — max 15 %. Draw what the line is about: # vis kind=hero|explode|vs|receipt|grid|bars|macro|daycycle, map/route, street3d, moments (references/vis-format.md)\n`;
    for (let i = 1; i < talky.length; i++) if (hs.indexOf(talky[i]) === hs.indexOf(talky[i - 1]) + 1) { v += `  ERROR format   two talking beats in a row (${talky[i - 1][1]} → ${talky[i][1]}) — cut to the thing being talked about\n`; break; }
    if (/\bcapY=/.test(me)) v += `  WARN  caption  capY= is ignored — captions are fixed small at the bottom band (captions.md)\n`; }
  // ---- cinema: lettering, angles, sound beats (references/cinematography.md, typography.md, sound-music.md)
  { const heads = [...me.matchAll(/^#\s*(\w+)(.*)$/gm)].filter(m => m[1] !== 'end'); const art = heads.filter(m => /\bart=/.test(m[2])), fx = new Set(art.map(m => (m[2].match(/artfx=(\w+)/) || [, 'slam'])[1]));
    if (heads.length >= 8 && art.length < Math.floor(heads.length / 6)) v += `  WARN  cinema   only ${art.length} art-directed lettering beats for ${heads.length} beats — add art= on the big claims (typography.md)\n`;
    if (fx.size > 4) v += `  WARN  cinema   ${fx.size} lettering looks (${[...fx].join(' ')}) — pick 2–3 so the film feels designed\n`;
    const cams = heads.map(m => (m[2].match(/\bcam=(\w+)/) || [])[1] ? m[1] + ':' + (m[2].match(/\bcam=(\w+)/) || [])[1] : null);
    for (let i = 1; i < cams.length; i++) if (cams[i] && cams[i] === cams[i - 1]) v += `  WARN  cinema   beats ${i} and ${i + 1} use the same angle (${cams[i]}) — change angle, size or side\n`;
    if (heads.length >= 10 && !/\bdrop=|art=[^\n]*artfx=(slam|mask|stamp|split|gold)|variant=film|kind=(map3d|fleet3d|wow_)/.test(me)) v += `  INFO  cinema   no silence-before-the-hit moment — give the biggest reveal a drop= or a slam/mask title\n`;
    if (!/^\/\/\s*colou?r:/m.test(me)) v += `  INFO  cinema   no // colour: script line in the treatment (cinematography.md §5)\n`; }
  if (v) report += `\n[variety]\n` + v; }
console.log(report.trim().replace(/\[(16x9|9x16)\] ([\d.]+s · \d+ scenes · )(\d+) errors/g, (m, f, a, e) => m) + `\nsheet: ${outBase}_sheet.jpg`);
await browser.close();
