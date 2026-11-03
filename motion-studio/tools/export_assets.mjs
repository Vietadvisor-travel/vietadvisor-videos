// Export every asset as PNG (transparent, cropped) + reference sheets + catalog JSON.
//   node tools/export_assets.mjs pkg/assets
import { launch } from './browser.mjs'; import fs from 'fs'; import path from 'path';
const OUT = process.argv[2] || 'pkg/assets';
const browser = await launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
page.on('pageerror', e => console.log('ERR:', e.message));
await page.goto('file://' + process.cwd() + '/studio.html'); await page.evaluate(() => window.READY);
await page.evaluate(() => {
  // render fn into a w×h transparent canvas; crop to content (+pad); return dataURL
  window.snap = (w, h, fn, crop = true, bg = null, pad = 16) => {
    const c = renderOff(w, h, () => { if (bg) { ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H); } fn(); });
    if (!crop) return c.toDataURL('image/png');
    const d = c.getContext('2d').getImageData(0, 0, w, h).data; let x0 = w, y0 = h, x1 = 0, y1 = 0;
    for (let y = 0; y < h; y += 2) for (let x = 0; x < w; x += 2) if (d[(y * w + x) * 4 + 3] > 8) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    x0 = Math.max(0, x0 - pad); y0 = Math.max(0, y0 - pad); x1 = Math.min(w, x1 + pad); y1 = Math.min(h, y1 + pad);
    const o = mkCanvas(x1 - x0, y1 - y0); o.getContext('2d').drawImage(c, -x0, -y0); return o.toDataURL('image/png');
  };
});
const save = (rel, d) => { const f = path.join(OUT, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, Buffer.from(d.split(',')[1], 'base64')); };
const catalog = await page.evaluate(() => ({
  characters: Object.values(CHAR).map(c => ({ id: c.id, name: c.name, group: c.group, desc: c.desc })),
  expressions: EXPR_NAMES, poses: POSE_NAMES,
  props: Object.values(PROP).map(p => ({ name: p.name, cat: p.cat, label: p.label })),
  places: Object.values(PLACE).map(p => ({ id: p.id, label: p.label, desc: p.desc })),
  ui: Object.keys(UI), transitions: TRANSITIONS, particles: Object.keys(PARTICLES), cameraMoves: MOVE_NAMES, cities: Object.keys(CITY),
}));
fs.mkdirSync(OUT, { recursive: true }); fs.writeFileSync(path.join(OUT, 'catalog.json'), JSON.stringify(catalog, null, 2));
// ---- characters: individual PNG (neutral, wave), expression sheet, pose sheet
for (const ch of catalog.characters) {
  save(`characters/${ch.id}.png`, await page.evaluate(id => snap(1000, 1100, () => person(500, 1000, 2, CHAR[id].spec, { t: 1.05, noBlink: 1 })), ch.id));
  save(`characters/${ch.id}_wave.png`, await page.evaluate(id => snap(1100, 1100, () => person(500, 1000, 2, CHAR[id].spec, { t: 1.05, pose: 'wave', expr: 'joy', noBlink: 1 })), ch.id));
  save(`characters/expressions/${ch.id}_expressions.png`, await page.evaluate(id => snap(2600, 1640, () => {
    ctx.fillStyle = '#f3e6c4'; ctx.fillRect(0, 0, W, H); T(CHAR[id].name + ' — expressions', 40, 50, { size: 44, align: 'left', fill: C.ink, lw: 0 });
    EXPR_NAMES.forEach((e, i) => { const col = i % 9, row = Math.floor(i / 9); ctx.save(); ctx.beginPath(); ctx.rect(col * 285 + 20, row * 520 + 90, 270, 500); ctx.clip(); person(col * 285 + 155, row * 520 + 640, 1.25, CHAR[id].spec, { t: 1.3, expr: e, noBlink: 1 }); ctx.restore(); T(e, col * 285 + 155, row * 520 + 570, { size: 28, font: 'body', fill: '#fff', lw: 6 }); });
  }, false), ch.id));
}
save('reference_sheets/03_poses_linh.png', await page.evaluate(() => snap(2700, 1400, () => { ctx.fillStyle = '#f3e6c4'; ctx.fillRect(0, 0, W, H); T('POSES — any character can use any pose', 40, 50, { size: 44, align: 'left', fill: C.ink, lw: 0 }); POSE_NAMES.forEach((p, i) => { const col = i % 14, row = Math.floor(i / 14); person(100 + col * 190, 560 + row * 640, .95, CHAR.linh.spec, { t: 1.3, pose: p, expr: 'happy', noBlink: 1 }); T(p, 100 + col * 190, 600 + row * 640, { size: 24, font: 'body', fill: C.ink, lw: 0 }); }); }, false)));
save('reference_sheets/03_poses_dave.png', await page.evaluate(() => snap(2700, 1400, () => { ctx.fillStyle = '#f3e6c4'; ctx.fillRect(0, 0, W, H); T('POSES — Dave', 40, 50, { size: 44, align: 'left', fill: C.ink, lw: 0 }); POSE_NAMES.forEach((p, i) => { const col = i % 14, row = Math.floor(i / 14); person(100 + col * 190, 560 + row * 640, .95, CHAR.dave.spec, { t: 1.3, pose: p, expr: 'grin', noBlink: 1 }); T(p, 100 + col * 190, 600 + row * 640, { size: 24, font: 'body', fill: C.ink, lw: 0 }); }); }, false)));
// cast lineups by group
for (const [grp, title] of [['host', 'HOST'], ['tourist', 'TOURISTS — one per market language'], ['local', 'LOCALS'], ['ethnic', 'ETHNIC MINORITIES — northern highlands & beyond']]) {
  const ids = catalog.characters.filter(c => c.group === grp).map(c => c.id);
  save(`reference_sheets/01_cast_${grp}.png`, await page.evaluate(([ids, title]) => { const n = ids.length, cols = Math.min(n, 8), rows = Math.ceil(n / cols); return snap(cols * 320 + 80, rows * 640 + 140, () => { ctx.fillStyle = '#f3e6c4'; ctx.fillRect(0, 0, W, H); T(title, 40, 56, { size: 48, align: 'left', fill: C.ink, lw: 0 });
    ids.forEach((id, i) => { const x = 200 + (i % cols) * 320, y = 640 + Math.floor(i / cols) * 640; person(x, y, 1.2, CHAR[id].spec, { t: 1.05, noBlink: 1 }); const [n1, n2] = CHAR[id].name.split(' ('); T(n1, x, y + 44, { size: 28, font: 'body', fill: C.ink, lw: 0 }); if (n2) T('(' + n2, x, y + 80, { size: 22, font: 'body', fill: C.inkSoft, lw: 0 }); }); }, false); }, [ids, title]));
}
save('reference_sheets/01_cast_all.png', await page.evaluate(() => snap(3000, 1500, () => { ctx.fillStyle = '#f3e6c4'; ctx.fillRect(0, 0, W, H); const ids = Object.keys(CHAR); T('VIETADVISOR CAST — size & proportion lineup', 40, 56, { size: 48, align: 'left', fill: C.ink, lw: 0 }); ids.forEach((id, i) => { const col = i % 16, row = Math.floor(i / 16); person(110 + col * 180, 640 + row * 680, .95, CHAR[id].spec, { t: 1, noBlink: 1 }); T(CHAR[id].name.split(' (')[0], 110 + col * 180, 680 + row * 680, { size: 20, font: 'body', fill: C.ink, lw: 0 }); }); }, false)));
save('reference_sheets/02_expressions_dave.png', await page.evaluate(() => snap(2600, 1640, () => { ctx.fillStyle = '#f3e6c4'; ctx.fillRect(0, 0, W, H); T('EXPRESSIONS — shared by every character', 40, 50, { size: 44, align: 'left', fill: C.ink, lw: 0 }); EXPR_NAMES.forEach((e, i) => { const col = i % 9, row = Math.floor(i / 9); ctx.save(); ctx.beginPath(); ctx.rect(col * 285 + 20, row * 520 + 90, 270, 500); ctx.clip(); person(col * 285 + 155, row * 520 + 640, 1.25, CHAR.dave.spec, { t: 1.3, expr: e, noBlink: 1 }); ctx.restore(); T(e, col * 285 + 155, row * 520 + 570, { size: 28, font: 'body', fill: '#fff', lw: 6 }); }); }, false)));
// ---- props
for (const p of catalog.props) save(`props/${p.cat}/${p.name}.png`, await page.evaluate(n => { const p = PROP[n]; const s = Math.min(900 / p.w, 900 / p.h, 2.4); return snap(1400, 1400, () => drawProp(n, 700, 1150, s, {}, 1.2)); }, p.name));
for (const cat of [...new Set(catalog.props.map(p => p.cat))]) save(`reference_sheets/04_props_${cat}.png`, await page.evaluate(cat => { const names = Object.values(PROP).filter(p => p.cat === cat).map(p => p.name); const cols = 6, cell = 380; return snap(cols * cell, Math.ceil(names.length / cols) * cell + 100, () => { ctx.fillStyle = '#f3e6c4'; ctx.fillRect(0, 0, W, H); T('PROPS — ' + cat.toUpperCase(), 40, 50, { size: 44, align: 'left', fill: C.ink, lw: 0 }); ctx.translate(0, 90); names.forEach((n, i) => { const p = PROP[n], cx = (i % cols) * cell + cell / 2, cy = Math.floor(i / cols) * cell + cell * .76; drawProp(n, cx, cy, Math.min(cell * .8 / p.w, cell * .62 / p.h), {}, 1.2); const lab = p.label.length > 30 ? p.label.split(' (')[0] : p.label; T(lab, cx, cy + 40, { size: 22, font: 'body', fill: C.ink, lw: 0 }); }); }, false); }, cat));
// ---- places: 16:9 and 9:16, day + variants
for (const pl of catalog.places) {
  save(`places/16x9/${pl.id}.png`, await page.evaluate(id => snap(1920, 1080, () => PLACE[id].draw(1, { t: 1 }), false), pl.id));
  save(`places/9x16/${pl.id}.png`, await page.evaluate(id => snap(1080, 1920, () => PLACE[id].draw(1, { t: 1 }), false), pl.id));
}
for (const [id, time] of [['hoian', 'night'], ['saigon', 'night'], ['hagiang', 'sunset'], ['phuquoc', 'sunset'], ['halong', 'sunset'], ['hanoi', 'night']]) save(`places/16x9/${id}_${time}.png`, await page.evaluate(([id, time]) => snap(1920, 1080, () => PLACE[id].draw(1, { t: 1, time }), false), [id, time]));
save('reference_sheets/05_places.png', await page.evaluate(() => snap(2600, 2440, () => { ctx.fillStyle = '#f3e6c4'; ctx.fillRect(0, 0, W, H); T('PLACES — parallax backgrounds (each also renders 9:16, day / sunset / night)', 40, 50, { size: 40, align: 'left', fill: C.ink, lw: 0 }); ctx.translate(0, 80); placeSheet(Object.keys(PLACE), 4, 620, 349, 1920, 1080, {}); }, false)));
// ---- map, UI samples, transitions
save('reference_sheets/06_map.png', await page.evaluate(() => snap(1920, 1080, () => { vnMap({ lon: 106, lat: 16, k: 46, t: 1, cities: ['hanoi', 'hagiang', 'sapa', 'halong', 'hue', 'danang', 'hoian', 'dalat', 'hcmc', 'cantho', 'phuquoc'] }); }, false)));
save('reference_sheets/07_ui_kit.png', await page.evaluate(() => snap(1920, 1080, () => { PLACE.studio.draw(1, { t: 1 }); const t = 5;
  UI.title(1, { text: ['TITLE CARD'], x: 480, y: 130, size: 110, at: 0, sub: 'subtitle ribbon' }, t);
  UI.price(1, { x: 1450, y: 170, item: 'phở bò, street stall', vnd: '45.000 ₫', usd: '$1.80', checked: 'Oct 2026', s: .9 }, t);
  UI.stat(1, { x: 470, y: 440, big: '≈ 300–350 km', small: 'stat card', emoji: '🛣️', s: .9 }, t);
  UI.bubble(1, { x: 1450, y: 450, text: 'Speech bubble!', size: 52, tail: [-120, 120] }, t);
  UI.stamp(1, { x: 1450, y: 640, text: 'STAMP', at: 0 }, t);
  UI.checklist(1, { x: 140, y: 620, items: [{ text: 'Checklist item' }, { text: 'Avoid this', no: 1 }], step: .1 }, t);
  UI.cta(1, { x: 1450, y: 820, top: 'Call to action', text: 'vietadvisor.travel', s: .8 }, t);
  vaLogo(960, 560, .7); UI.lower(1, { name: 'Lower third', role: 'name + role' });
  caption('Captions: *highlight* and [price accent]', 0, 9, 5, { y: 1040 });
}, false)));
save('reference_sheets/08_brand_endframe.png', await page.evaluate(() => snap(1920, 1080, () => UI.endFrame(1, {}, 1), false)));
save('reference_sheets/08_brand_endframe_9x16.png', await page.evaluate(() => snap(1080, 1920, () => UI.endFrame(1, {}, 1), false)));
save('brand/vietadvisor_lockup.png', await page.evaluate(() => snap(1400, 400, () => vaLogo(700, 200, 1.4, { tag: 'Vietnam, from people who live here' })))); save('brand/vietadvisor_mark.png', await page.evaluate(() => snap(400, 400, () => vaMark(200, 210, 3))));

save('reference_sheets/00_style_card.png', await page.evaluate(() => snap(2400, 1500, () => {
  ctx.fillStyle = '#f3e6c4'; ctx.fillRect(0, 0, W, H);
  T('VIETADVISOR — STYLE CARD', 60, 70, { size: 64, align: 'left', fill: C.ink, lw: 0 }); T('Bold warm-ink outlines · cel shading (highlight top-left, purple-ish shadow bottom-right) · chibi proportions · warm paper world', 60, 130, { size: 28, align: 'left', font: 'body', fill: C.inkSoft, lw: 0 });
  const sw = [['ink', C.ink], ['paper', C.paper], ['cream', C.cream], ['BRAND', C.brand], ['flag red', C.red], ['star gold', C.gold], ['yellow', C.yel], ['sky', C.sky], ['sea', C.sea], ['river', C.river], ['leaf', C.leaf], ['karst', C.karst]];
  sw.forEach(([n, c], i) => { const x = 60 + (i % 6) * 190, y = 190 + Math.floor(i / 6) * 170; sRR(x, y, 160, 100, 16, c, { lw: 5 }); T(n, x + 80, y + 124, { size: 22, font: 'body', fill: C.ink, lw: 0 }); T(c.toUpperCase(), x + 80, y + 150, { size: 18, font: 'body', fill: C.inkSoft, lw: 0 }); });
  Object.values(SKIN).forEach((c, i) => { sCirc(80 + i * 70, 560, 28, c, { lw: 4 }); }); T('skin tones', 60, 610, { size: 22, font: 'body', align: 'left', fill: C.ink, lw: 0 });
  Object.values(HAIR).forEach((c, i) => { sCirc(620 + i * 64, 560, 26, c, { lw: 4 }); }); T('hair', 600, 610, { size: 22, font: 'body', align: 'left', fill: C.ink, lw: 0 });
  // shading demo
  T('Cel shading', 60, 690, { size: 34, align: 'left', fill: C.ink, lw: 0 }); sCirc(150, 820, 80, C.teal); sRR(280, 740, 160, 160, 30, C.orange); sEll(560, 820, 90, 70, C.yel); karstPeak(760, 900, 160, 200, C.karst);
  // typography
  T('Baloo 2 ExtraBold — titles', 60, 1010, { size: 30, align: 'left', font: 'body', fill: C.inkSoft, lw: 0 }); T('HÀ GIANG LOOP', 60, 1090, { size: 110, align: 'left', fill: C.yel, shadow: 8 });
  T('Be Vietnam Pro ExtraBold — captions', 60, 1190, { size: 30, align: 'left', font: 'body', fill: C.inkSoft, lw: 0 }); T('A street bowl runs about', 60, 1262, { size: 50, font: 'body', align: 'left', lw: 13 }); T('45,000 ₫', 680, 1262, { size: 50, font: 'body', align: 'left', fill: '#ff8a6a', lw: 13 }); T('(~$1.80).', 940, 1262, { size: 50, font: 'body', align: 'left', lw: 13 });
  T('ฮาซาง · 하장 루프 · ハザン・ループ · 河江环线 — auto fallback (Kanit / Noto Sans)', 60, 1360, { size: 36, align: 'left', font: 'body', fill: C.ink, lw: 0 });
  // proportions
  T('Proportions', 1300, 690 - 470, { size: 34, align: 'left', fill: C.ink, lw: 0 });
  person(1450, 1100, 1.6, CHAR.dave.spec, { t: 1, noBlink: 1 }); person(1800, 1100, 1.6, CHAR.linh.spec, { t: 1, pose: 'wave', expr: 'joy', noBlink: 1 }); person(2120, 1100, 1.6, CHAR.kid.spec, { t: 1, pose: 'cheer', expr: 'laugh', noBlink: 1 });
  for (const [y, l] of [[1100, 'feet 0'], [1100 - 168, 'hip'], [1100 - 352, 'shoulder'], [1100 - 480, 'eye line'], [1100 - 640, 'top']]) { ctx.setLineDash([10, 8]); line(1260, y, 2340, y, 2, 'rgba(43,29,22,.35)'); ctx.setLineDash([]); T(l, 1260, y - 14, { size: 18, align: 'left', font: 'body', fill: C.inkSoft, lw: 0 }); }
  T('Adult ≈ 400 u · head r 84 · eyes big with 2 highlights · same eye style for every ethnicity', 1300, 1180, { size: 24, align: 'left', font: 'body', fill: C.ink, lw: 0 });
  T('No pure black · no gradients on characters · no realism · no real logos · no stereotypes', 1300, 1230, { size: 24, align: 'left', font: 'body', fill: C.brand, lw: 0 });
}, false)));
console.log(JSON.stringify({ chars: catalog.characters.length, props: catalog.props.length, places: catalog.places.length }));
await browser.close();
