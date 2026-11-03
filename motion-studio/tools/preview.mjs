// Review ONE asset (new or existing) in a single image — the fast loop for making new assets.
//   node tools/preview.mjs char tour_guide      → expressions + poses + scale lineup with cast
//   node tools/preview.mjs prop banh_cuon       → 3 sizes, held by a character, on a table, at night
//   node tools/preview.mjs place night_market   → 16:9 day/night + 9:16 + character on the ground line
import { launch } from './browser.mjs'; import fs from 'fs';
const [kind, id, outArg] = process.argv.slice(2); const out = outArg || `out/preview_${kind}_${id}.jpg`; fs.mkdirSync('out', { recursive: true });
const browser = await launch();
const page = await browser.newPage(); page.on('pageerror', e => console.log('ERR:', e.message)); page.on('console', m => { if (/warn|no prop|missing/i.test(m.text()) && !/ERR_FILE/.test(m.text())) console.log(m.text()); });
await page.goto('file://' + process.cwd() + '/studio.html'); await page.evaluate(() => window.READY);
const d = await page.evaluate(([kind, id]) => {
  const bg = '#f3e6c4'; const done = (c) => c.toDataURL('image/jpeg', .88);
  if (kind === 'char') { if (!CHAR[id]) return 'ERR unknown character ' + id; const sp = CHAR[id].spec; return done(renderOff(2400, 1500, () => { ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H); T(CHAR[id].name + ' — ' + CHAR[id].desc, 30, 40, { size: 30, align: 'left', font: 'body', fill: C.ink, lw: 0 });
    ['neutral', 'joy', 'surprised', 'scared', 'angry', 'love', 'dizzy', 'cool'].forEach((e, i) => { person(110 + i * 200, 470, .9, sp, { t: 1.2, expr: e, noBlink: 1 }); T(e, 110 + i * 200, 505, { size: 20, font: 'body', fill: C.ink, lw: 0 }); });
    ['wave', 'point', 'cheer', 'walk', 'sit', 'photo', 'hold', 'thumbs'].forEach((p, i) => { person(110 + i * 200, 1000, .9, sp, { t: 1.2, pose: p, expr: 'happy', hold: p === 'hold' ? 'pho' : undefined, holdScale: .35, noBlink: 1 }); T(p, 110 + i * 200, 1035, { size: 20, font: 'body', fill: C.ink, lw: 0 }); });
    person(1860, 1000, .9, CHAR.dave.spec, { t: 1, noBlink: 1 }); person(2060, 1000, .9, CHAR.linh.spec, { t: 1, noBlink: 1 }); person(2260, 1000, .9, sp, { t: 1, noBlink: 1 }); T('scale vs cast', 2060, 1035, { size: 20, font: 'body', fill: C.ink, lw: 0 });
    drawProp('moto', 2050, 1400, .7, { spin: 0 }, 1); person(2022, 1374, .64, sp, { t: 1, pose: 'ride', headwear: { type: 'helmet', color: C.yel }, noShadow: 1 }); for (const [n, x] of [['16:9 on a place', 300]]) T(n, x, 1460, { size: 1, lw: 0 }); })); }
  if (kind === 'prop') { if (!PROP[id]) return 'ERR unknown prop ' + id; const p = PROP[id]; return done(renderOff(2400, 1100, () => { ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H); T(p.label + `  (w ${p.w}, h ${p.h})`, 30, 40, { size: 30, align: 'left', font: 'body', fill: C.ink, lw: 0 });
    [1.4, .8, .4].forEach((s, i) => drawProp(id, 260 + i * 340, 640, s * Math.min(1, 300 / p.w), {}, 1.2)); line(60, 642, 1100, 642, 2, 'rgba(0,0,0,.2)');
    person(1350, 1000, 1.2, CHAR.dave.spec, { t: 1.2, pose: 'hold', hold: id, holdScale: .4 * Math.min(1, 300 / p.w), expr: 'happy' });
    const c = renderOff(900, 560, () => { PLACE.night_market ? PLACE.night_market.draw(1, { t: 1, time: 'night' }) : PLACE.sidewalk.draw(1, { t: 1, time: 'night' }); drawProp(id, W * .5, PLACE.sidewalk.ground() - 20, .9 * Math.min(1, 300 / p.w), {}, 1.2); }); ctx.drawImage(c, 1460, 300); rr(1460, 300, 900, 560, 0, null, 3); T('in a night scene', 1910, 890, { size: 22, font: 'body', fill: C.ink, lw: 0 }); })); }
  if (kind === 'place') { if (!PLACE[id]) return 'ERR unknown place ' + id; return done(renderOff(2400, 1500, () => { ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H); T(PLACE[id].label, 30, 40, { size: 30, align: 'left', font: 'body', fill: C.ink, lw: 0 });
    const shot = (w, h, o, x, y, tw, label) => { const c = renderOff(w, h, () => { PLACE[id].draw(1.5, { t: 1.5, ...o }); const gy = PLACE[id].ground(); ctx.setLineDash([16, 10]); line(0, gy, W, gy, 3, '#ff00aa'); ctx.setLineDash([]); person(W * .35, gy, U() * 1.1, CHAR.dave.spec, { t: 1, expr: 'happy' }); person(W * .62, gy, U() * 1.1, CHAR.linh.spec, { t: 1, pose: 'wave', expr: 'joy' }); }); ctx.drawImage(c, x, y, tw, tw * h / w); rr(x, y, tw, tw * h / w, 0, null, 3); T(label, x, y + tw * h / w + 22, { size: 20, align: 'left', font: 'body', fill: C.ink, lw: 0 }); };
    shot(1920, 1080, {}, 30, 80, 800, '16:9 day (pink = ground line)'); shot(1920, 1080, { time: 'sunset' }, 850, 80, 800, '16:9 sunset'); shot(1920, 1080, { time: 'night' }, 30, 600, 800, '16:9 night'); shot(1920, 1080, { scroll: 900 }, 850, 600, 800, '16:9 scrolled (parallax check)'); shot(1080, 1920, {}, 1700, 80, 640, '9:16 day'); })); }
  return 'ERR kind must be char|prop|place';
}, [kind, id]);
if (d.startsWith('ERR')) console.log(d); else { fs.writeFileSync(out, Buffer.from(d.split(',')[1], 'base64')); console.log('preview:', out); }
await browser.close();
