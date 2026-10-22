/* =====================================================================
   PLACES — parallax backgrounds of Vietnam. Responsive to any W×H.
   PLACE[id].draw(t, o)  o = { scroll: px pan (parallax), time: 'day'|'sunset'|'night' }
   PLACE[id].ground(o)   → y where characters should stand.
   Unit u = min(W,H)/1080 so 16:9 and 9:16 share the same scale; extra
   height in vertical becomes sky.
   ===================================================================== */
'use strict';
const U = () => Math.min(W, H) / 1080 * (H > W ? 1.25 : 1);
const HB = () => H - (H > W ? H * .17 : 0); // baseline: vertical lifts the scene into the safe zone
function defPlace(id, label, desc, gOff, draw, extra = {}) { PLACE[id] = { id, label, desc, gOff, draw, ground: () => HB() - gOff * U(), ...extra }; }
const SKY = {
  day: ['#5fb8e8', '#bfe8f5', '#f6f1dc'], sunset: ['#5b4b8a', '#ff8a5c', '#ffd28a'], night: ['#0d1638', '#1d2f66', '#3a4f86'], dawn: ['#8fb0e0', '#f8c8b8', '#fff0d0'], cave: ['#14171c', '#232a2e', '#2e3a36']
};
function sky(o, horizon) {
  const k = SKY[o.time || 'day'] || SKY.day; const g = ctx.createLinearGradient(0, 0, 0, horizon);
  g.addColorStop(0, k[0]); g.addColorStop(.65, k[1]); g.addColorStop(1, k[2]); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const u = U(), t = o.t || 0;
  if (o.time === 'night') { const r = rng(11); for (let i = 0; i < 120; i++) { const x = r() * W, y = r() * horizon * .8; circ(x, y, (1 + r() * 2.2) * u * (.7 + .3 * Math.sin(t * 3 + i)), '#fff', 0); } drawProp('moon', W * .78, horizon * .32, u * 1.1); }
  else if (o.time === 'sunset') { const sy = horizon - 60 * u; const sg = ctx.createRadialGradient(W * .7, sy, 0, W * .7, sy, 520 * u); sg.addColorStop(0, 'rgba(255,240,180,.9)'); sg.addColorStop(1, 'rgba(255,200,120,0)'); ctx.fillStyle = sg; ctx.fillRect(0, 0, W, H); circ(W * .7, sy, 120 * u, '#fff1b0', 0); }
  else if (o.time !== 'cave' && o.sun !== false) { circ(W * .82, horizon * .22, 70 * u, '#fff4b8', 0); }
  if (o.time !== 'night' && o.time !== 'cave' && o.clouds !== false) for (let i = 0; i < 6; i++) { const span = W + 600 * u; const x = ((i * 520 * u + t * 14 * u - (o.scroll || 0) * .08) % span + span) % span - 300 * u; drawProp('cloud', x, horizon * (.25 + (i % 3) * .14), u * (.8 + (i % 2) * .3), o.time === 'sunset' ? { color: '#ffe0c8' } : {}); }
}
// repeat a layer horizontally with parallax factor f
function layerRep(span, f, scroll, fn) { const off = ((-(scroll || 0) * f) % span + span) % span - span; for (let x = off; x < W + span; x += span) fn(x); }
function range(seed, n, span, base, hMin, hMax, wMin, wMax, col, f, scroll, lw) {
  const r = rng(seed), pk = []; for (let i = 0; i < n; i++) pk.push([(i + r() * .7) * span / n, lerp(hMin, hMax, r()), lerp(wMin, wMax, r())]);
  layerRep(span, f, scroll, x0 => pk.forEach(([x, h, w]) => karstPeak(x0 + x, base, w, h, col, lw)));
}
function hazeBand(y, h, col, a = .5) { const g = ctx.createLinearGradient(0, y - h, 0, y + h); g.addColorStop(0, rgba(col, 0)); g.addColorStop(.5, rgba(col, a)); g.addColorStop(1, rgba(col, 0)); ctx.fillStyle = g; ctx.fillRect(0, y - h, W, h * 2); }
function timeTint(o) { if (o.time === 'night') { ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = 'rgba(70,90,170,.55)'; ctx.fillRect(0, 0, W, H); ctx.restore(); } if (o.time === 'sunset') { ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = 'rgba(255,170,130,.35)'; ctx.fillRect(0, 0, W, H); ctx.restore(); } }
function water(y, col, o, f = 1) { const u = U(), t = o.t || 0; ctx.fillStyle = col; ctx.fillRect(0, y, W, H - y); line(0, y, W, y, LW, C.ink);
  ctx.save(); ctx.globalAlpha = .55; for (let i = 0; i < 40; i++) { const r = hash(i), x = ((r * W * 1.3 + t * 30 * u * (i % 2 ? 1 : -1) - (o.scroll || 0) * f) % (W * 1.3) + W * 1.3) % (W * 1.3) - W * .15, yy = y + 20 * u + hash(i + 9) * (H - y - 30 * u); line(x, yy, x + (40 + r * 60) * u, yy, 4 * u, shade(col, .18)); } ctx.restore(); }
function tubeHouse(x, gy, w, h, col, o = {}) {
  const u = o.u || 1;
  sRR(x, gy - h, w, h, 4 * u, col, { lw: 5 * u, inner: () => { // windows / shutters per floor
    const floors = Math.max(1, Math.round(h / (110 * u)));
    for (let f = 0; f < floors; f++) { const fy = gy - h + 24 * u + f * (h / floors); if (f === floors - 1 && o.shop) continue; sRR(x + w * .22, fy, w * .56, h / floors * .52, 3 * u, o.shutter || '#4f8a6a', { lw: 4 * u, inner: () => { for (let k = 1; k < 4; k++) line(x + w * .22, fy + k * h / floors * .13, x + w * .78, fy + k * h / floors * .13, 2 * u, 'rgba(0,0,0,.25)'); } }); if (o.balcony && f < floors - 1) { rr(x + w * .12, fy + h / floors * .55, w * .76, 8 * u, 2 * u, '#3a3a3a', 3 * u); for (let k = 0; k < 6; k++) line(x + w * .14 + k * w * .14, fy + h / floors * .55, x + w * .14 + k * w * .14, fy + h / floors * .55 - 26 * u, 2.5 * u, '#3a3a3a'); } }
    if (o.shop) { rr(x + w * .1, gy - 110 * u, w * .8, 110 * u, 2 * u, o.shopCol || '#3a2a22', 4 * u); if (o.awning) sPoly([[x - 6 * u, gy - 120 * u], [x + w + 6 * u, gy - 120 * u], [x + w + 14 * u, gy - 92 * u], [x - 14 * u, gy - 92 * u]], o.awning, { lw: 4 * u }); }
  } });
  if (o.roof === 'tile') { sPoly([[x - 12 * u, gy - h], [x + w + 12 * u, gy - h], [x + w - 6 * u, gy - h - 40 * u], [x + 6 * u, gy - h - 40 * u]], '#a8452a', { lw: 5 * u, inner: () => { for (let k = 0; k < 8; k++) line(x + k * w / 7, gy - h, x + k * w / 7, gy - h - 40 * u, 2 * u, 'rgba(0,0,0,.25)'); } }); }
  if (o.sign) { sRR(x + w * .08, gy - 150 * u, w * .84, 34 * u, 4 * u, o.signCol || C.red, { lw: 4 * u }); T(o.sign, x + w / 2, gy - 133 * u, { size: 20 * u, font: 'body', fill: o.signText || C.gold, lw: 0 }); }
}
function roadGround(gy, o, col = '#7d7a76') { const u = U(); rr(-20, gy - 10 * u, W + 40, H - gy + 30 * u, 0, col, LW); ctx.setLineDash([60 * u, 50 * u]); ctx.lineDashOffset = (o.scroll || 0); line(0, gy + (H - gy) * .45, W, gy + (H - gy) * .45, 6 * u, '#f3e9c6'); ctx.setLineDash([]); }

// ---------------------------------------------------------------- 1. HÀ GIANG
defPlace('hagiang', 'Hà Giang — karst highlands & hairpin road', 'Layered limestone karsts, Mã Pì Lèng-style switchbacks, terraced slopes, mountain road in foreground.', 190, (t, o) => {
  const u = U(), gy = HB() - 190 * u, s = o.scroll || 0; LW = 5 * u;
  sky({ ...o, t }, gy - 200 * u);
  range(31, 12, 3200 * u, gy - 260 * u, 260 * u, 430 * u, 240 * u, 380 * u, o.time === 'night' ? '#4a5a7a' : '#a9cfc6', .1, s, 4 * u);
  hazeBand(gy - 300 * u, 90 * u, '#ffffff', .35);
  range(32, 11, 2800 * u, gy - 120 * u, 200 * u, 380 * u, 260 * u, 420 * u, o.time === 'night' ? '#3a4a66' : '#6aaa75', .3, s, 5 * u);
  // switchback road on the mid hill
  layerRep(2800 * u, .3, s, x0 => { ctx.save(); ctx.translate(x0 + 1400 * u, gy - 130 * u); ctx.beginPath(); for (let i = 0; i < 6; i++) ctx.lineTo((i % 2 ? 110 : -110) * u * (1 - i * .08), -i * 38 * u); ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.lineWidth = 12 * u; ctx.strokeStyle = 'rgba(43,29,22,.8)'; ctx.stroke(); ctx.lineWidth = 6 * u; ctx.strokeStyle = '#e8e0d0'; ctx.stroke(); ctx.restore(); });
  ctx.fillStyle = o.time === 'night' ? '#4a6a4a' : '#8cc163'; ctx.fillRect(0, gy - 110 * u, W, 200 * u);
  for (let i = 0; i < 6; i++) { const y = gy - 100 * u + i * 16 * u; ctx.beginPath(); for (let x = -20; x <= W + 20; x += 40) ctx.lineTo(x, y + Math.sin((x + s * .6) * .01 + i) * 6 * u); ctx.lineWidth = 3 * u; ctx.strokeStyle = 'rgba(60,110,50,.5)'; ctx.stroke(); }
  roadGround(gy, o);
  for (let i = 0; i < 10; i++) { const span = W + 400 * u; const x = ((i * 260 * u - s) % span + span) % span - 100 * u; rr(x, gy - 34 * u, 14 * u, 32 * u, 4 * u, '#fff', 4 * u); line(x + 7 * u, gy - 26 * u, x + 7 * u, gy - 14 * u, 5 * u, C.red); }
  timeTint(o);
});
// ---------------------------------------------------------------- 2. HẠ LONG
defPlace('halong', 'Vịnh Hạ Long / Lan Hạ — karst islets at sea', 'Emerald bay with hundreds of limestone islets, cruise junks with orange sails.', 260, (t, o) => {
  const u = U(), sea = HB() - 420 * u, s = o.scroll || 0; LW = 5 * u;
  sky({ ...o, t }, sea);
  range(41, 14, 3000 * u, sea + 10 * u, 180 * u, 340 * u, 120 * u, 220 * u, '#b8d4cc', .1, s, 4 * u);
  hazeBand(sea, 60 * u, '#ffffff', .5);
  water(sea, o.time === 'night' ? '#1f4a6a' : '#3fb5b8', { ...o, t }, .5);
  range(42, 7, 2600 * u, sea + 120 * u, 260 * u, 460 * u, 180 * u, 300 * u, '#6aa07a', .4, s, 5 * u);
  layerRep(2600 * u, .55, s, x0 => drawProp('junk', x0 + 900 * u, sea + 170 * u + Math.sin(t) * 3 * u, .55 * u, {}, t));
  range(43, 4, 3000 * u, sea + 330 * u, 380 * u, 600 * u, 260 * u, 360 * u, '#4f8a5f', .8, s, 6 * u);
  layerRep(3000 * u, .8, s, x0 => drawProp('basketboat', x0 + 1700 * u, HB() - 120 * u, .8 * u, {}, t));
  timeTint(o);
});
// ---------------------------------------------------------------- 3. HỘI AN
defPlace('hoian', 'Hội An — old town & lantern river', 'Mustard-yellow shophouses, tiled roofs, strings of silk lanterns, Thu Bồn river with lantern boats.', 170, (t, o) => {
  const u = U(), gy = HB() - 170 * u, s = o.scroll || 0; LW = 5 * u; const night = o.time === 'night' || o.time === 'sunset';
  sky({ ...o, t, clouds: !night }, gy - 300 * u);
  const cols = ['#f2c14e', '#eab83a', '#f5cf6a', '#e6a93a'];
  layerRep(1600 * u, .6, s, x0 => { for (let i = 0; i < 5; i++) tubeHouse(x0 + i * 320 * u, gy - 90 * u, 300 * u, 430 * u, cols[i % 4], { u, roof: 'tile', shutter: '#3f7f6a', shop: 1, shopCol: '#5a3a22', balcony: i % 2 }); });
  // lantern strings
  layerRep(1600 * u, .6, s, x0 => { for (let k = 0; k < 2; k++) { const y0 = gy - 470 * u + k * 80 * u; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo(x0 + 800 * u, y0 + 90 * u, x0 + 1600 * u, y0); ctx.lineWidth = 3 * u; ctx.strokeStyle = C.ink; ctx.stroke(); for (let i = 1; i < 16; i++) { const p = i / 16, x = x0 + p * 1600 * u, y = (1 - p) * (1 - p) * y0 + 2 * (1 - p) * p * (y0 + 90 * u) + p * p * y0; drawProp('lantern', x, y + 120 * u * .45, .45 * u, { color: ['#e8402a', '#f6b62e', '#e8337a', '#3fa36b', '#7a4fa0'][(i + k) % 5], ph: i, glow: night }, t); } } });
  // river
  water(gy - 80 * u, night ? '#1f3a5a' : '#4aa3b8', { ...o, t }, .6);
  if (night) for (let i = 0; i < 12; i++) { const x = ((i * 190 * u + t * 20 * u - s * .8) % (W + 200 * u) + W + 200 * u) % (W + 200 * u) - 100 * u, y = gy - 70 * u + (i % 3) * 40 * u; const g = ctx.createRadialGradient(x, y, 0, x, y, 40 * u); g.addColorStop(0, 'rgba(255,200,90,.8)'); g.addColorStop(1, 'rgba(255,200,90,0)'); ctx.fillStyle = g; ctx.fillRect(x - 40 * u, y - 40 * u, 80 * u, 80 * u); circ(x, y, 8 * u, '#ffd36a', 3 * u); }
  layerRep(2000 * u, .9, s, x0 => drawProp('sampan', x0 + 600 * u, gy - 10 * u, .7 * u, { color: '#3a6a9a' }, t));
  rr(-20, gy, W + 40, H - gy + 20, 0, '#c9a87a', LW); // quay
  timeTint({ ...o, time: o.time === 'night' ? 'nightsoft' : o.time });
  if (o.time === 'night') { ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = 'rgba(90,90,160,.35)'; ctx.fillRect(0, 0, W, H); ctx.restore(); }
});
// ---------------------------------------------------------------- 4. SA PA
defPlace('sapa', 'Sa Pa — rice terraces & Fansipan', 'Curving rice terraces down valley slopes (green in summer, gold Sep–Oct), cloud sea, Fansipan peak.', 160, (t, o) => {
  const u = U(), gy = HB() - 160 * u, s = o.scroll || 0; LW = 5 * u; const gold = o.season === 'gold';
  sky({ ...o, t }, gy - 380 * u);
  layerRep(3000 * u, .08, s, x0 => { sPoly([[x0 + 200 * u, gy - 380 * u], [x0 + 560 * u, gy - 640 * u], [x0 + 700 * u, gy - 600 * u], [x0 + 900 * u, gy - 820 * u], [x0 + 1000 * u, gy - 740 * u], [x0 + 1120 * u, gy - 790 * u], [x0 + 1700 * u, gy - 380 * u]], '#8aa8b8', { lw: 4 * u }); sPoly([[x0 + 900 * u, gy - 820 * u], [x0 + 980 * u, gy - 760 * u], [x0 + 860 * u, gy - 760 * u]], '#fff', { lw: 3 * u }); });
  hazeBand(gy - 390 * u, 80 * u, '#ffffff', .8);
  const cols = gold ? ['#e8c048', '#d8a832', '#f0cc5a', '#c9a030'] : ['#8cc84a', '#7ab840', '#9ad45a', '#6aa838'];
  for (let L = 0; L < 3; L++) { const f = .2 + L * .3; const base = gy - 380 * u + L * 110 * u;
    layerRep(1400 * u, f, s, x0 => { for (let i = 0; i < 9; i++) { const y = base + i * 30 * u; shaded(() => { ctx.moveTo(x0 - 20 * u, y + 60 * u); ctx.bezierCurveTo(x0 + 300 * u, y - 40 * u - i * 4 * u, x0 + 1000 * u, y + 40 * u, x0 + 1420 * u, y - 10 * u); ctx.lineTo(x0 + 1420 * u, y + 30 * u); ctx.bezierCurveTo(x0 + 1000 * u, y + 70 * u, x0 + 300 * u, y - 10 * u, x0 - 20 * u, y + 90 * u); ctx.closePath(); }, cols[(i + L) % 4], { lw: 3 * u, hi: null }); } }); }
  rr(-20, gy - 6 * u, W + 40, H - gy + 30, 0, '#a8784a', LW);
  for (let i = 0; i < 8; i++) { const x = ((i * 300 * u - s) % (W + 300 * u) + W + 300 * u) % (W + 300 * u) - 100 * u; drawProp('rice', x, gy + 10 * u, .5 * u, {}, t); }
  timeTint(o);
});
// ---------------------------------------------------------------- 5. PHONG NHA
defPlace('phongnha', 'Phong Nha – Kẻ Bàng — giant cave', 'Cathedral-sized cave: skylight beam, stalactites, underground river with boat.', 170, (t, o) => {
  const u = U(), gy = HB() - 170 * u, s = o.scroll || 0; LW = 5 * u;
  sky({ time: 'cave', t }, H);
  // light beam
  ctx.save(); const bx = W * .62; const g = ctx.createLinearGradient(bx, 0, bx - 200 * u, H); g.addColorStop(0, 'rgba(255,250,210,.75)'); g.addColorStop(1, 'rgba(255,250,210,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(bx - 120 * u, 0); ctx.lineTo(bx + 160 * u, 0); ctx.lineTo(bx + 60 * u, H); ctx.lineTo(bx - 520 * u, H); ctx.closePath(); ctx.fill(); ctx.restore();
  circ(bx + 20 * u, 0, 150 * u, '#fffbe0', 0);
  // jungle at skylight
  for (let i = 0; i < 9; i++) sCirc(bx - 140 * u + i * 36 * u, 18 * u + (i % 2) * 14 * u, 30 * u, '#4f9f4a', { lw: 4 * u });
  // stalactites
  layerRep(1400 * u, .3, s, x0 => { const r = rng(5); for (let i = 0; i < 18; i++) { const x = x0 + r() * 1400 * u, h = (60 + r() * 260) * u, w = (20 + r() * 50) * u; sPoly([[x - w, -10], [x + w, -10], [x + w * .1, h]], '#5a6a62', { lw: 4 * u }); } });
  // cave walls
  shaded(() => { ctx.moveTo(-20, 0); ctx.lineTo(W * .25, 0); ctx.bezierCurveTo(W * .1, H * .3, W * .18, H * .6, -20, H * .8); ctx.closePath(); }, '#3c4a44', { lw: 6 * u });
  shaded(() => { ctx.moveTo(W + 20, 0); ctx.lineTo(W * .8, 0); ctx.bezierCurveTo(W * .95, H * .3, W * .85, H * .6, W + 20, H * .75); ctx.closePath(); }, '#3c4a44', { lw: 6 * u });
  // stalagmites
  layerRep(1600 * u, .6, s, x0 => { const r = rng(7); for (let i = 0; i < 8; i++) { const x = x0 + r() * 1600 * u, h = (80 + r() * 220) * u, w = (30 + r() * 50) * u; karstPeak(x, gy - 60 * u, w * 2, h, '#6e7a70', 4 * u); } });
  water(gy - 60 * u, '#1f6a6a', { ...o, t }, .8);
  layerRep(2200 * u, 1, s, x0 => drawProp('sampan', x0 + 900 * u, gy + 40 * u, .8 * u, { color: '#3a5a6a' }, t));
});
// ---------------------------------------------------------------- 6. HÀ NỘI — Hoàn Kiếm
defPlace('hanoi', 'Hà Nội — Hoàn Kiếm Lake & Turtle Tower', 'Lake with Tháp Rùa on its islet, red Thê Húc bridge, willows, Old Quarter roofs behind.', 160, (t, o) => {
  const u = U(), gy = HB() - 160 * u, s = o.scroll || 0, lake = gy - 260 * u; LW = 5 * u;
  sky({ ...o, t }, lake);
  layerRep(1700 * u, .15, s, x0 => { for (let i = 0; i < 10; i++) { const h = (120 + hash(i) * 160) * u; sRR(x0 + i * 170 * u, lake - h, 150 * u, h + 10, 4 * u, ['#d8c8a8', '#e8d8b0', '#c8b898', '#f0e0c0'][i % 4], { lw: 4 * u, inner: () => { for (let k = 0; k < 3; k++) rr(x0 + i * 170 * u + 20 * u + k * 40 * u, lake - h + 20 * u, 24 * u, 30 * u, 2 * u, '#7a8a9a', 0); } }); } });
  for (let i = 0; i < 10; i++) { const x = ((i * 210 * u - s * .3) % (W + 300 * u) + W + 300 * u) % (W + 300 * u) - 150 * u; drawProp('tree', x, lake + 10 * u, .7 * u, { color: '#5a9a4a' }, t); }
  water(lake, o.time === 'night' ? '#1f3f5a' : '#5fa8a0', { ...o, t }, .3);
  // Turtle Tower on islet
  layerRep(2400 * u, .35, s, x0 => { const x = x0 + 1300 * u, y = lake + 90 * u; sEll(x, y, 150 * u, 26 * u, '#6a9a5a', { lw: 5 * u }); drawProp('tree', x - 110 * u, y, .45 * u, {}, t);
    for (let k = 0; k < 3; k++) { const w = (110 - k * 26) * u, h = (70 - k * 10) * u, yy = y - 10 * u - k * 66 * u; sRR(x - w / 2, yy - h, w, h, 4 * u, '#d8c8a0', { lw: 4 * u, inner: () => { for (let j = -1; j <= 1; j++) { ctx.beginPath(); ctx.arc(x + j * w * .28, yy - h * .2, w * .09, Math.PI, 0); ctx.lineTo(x + j * w * .28 + w * .09, yy); ctx.lineTo(x + j * w * .28 - w * .09, yy); ctx.fillStyle = '#5a4a3a'; ctx.fill(); } } }); sPoly([[x - w / 2 - 10 * u, yy - h], [x + w / 2 + 10 * u, yy - h], [x, yy - h - 18 * u]], '#9a6a4a', { lw: 4 * u }); } });
  // Thê Húc bridge
  layerRep(2400 * u, .6, s, x0 => { const x = x0 + 300 * u, y = lake + 150 * u; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 260 * u, y - 120 * u, x + 520 * u, y); ctx.lineWidth = 36 * u; ctx.strokeStyle = C.ink; ctx.stroke(); ctx.lineWidth = 26 * u; ctx.strokeStyle = '#d8302a'; ctx.stroke(); for (let k = 0; k <= 10; k++) { const p = k / 10, bx = x + p * 520 * u, by = (1 - p) * (1 - p) * y + 2 * (1 - p) * p * (y - 120 * u) + p * p * y; line(bx, by - 14 * u, bx, by - 40 * u, 5 * u, '#d8302a'); } });
  rr(-20, gy - 4 * u, W + 40, H - gy + 30, 0, '#b8b2a6', LW);
  for (let i = 0; i < 6; i++) { const x = ((i * 360 * u - s) % (W + 360 * u) + W + 360 * u) % (W + 360 * u) - 100 * u; willow(x, gy, u, t); }
  timeTint(o);
});
function willow(x, gy, u, t) { sRR(x - 12 * u, gy - 260 * u, 24 * u, 260 * u, 8 * u, '#6b4a2a', { lw: 5 * u }); for (let k = 0; k < 14; k++) { const xx = x - 120 * u + k * 18 * u, sw = Math.sin(t * 1.5 + k) * 8 * u; ctx.beginPath(); ctx.moveTo(x, gy - 260 * u); ctx.quadraticCurveTo(xx, gy - 300 * u, xx + sw, gy - 120 * u + (k % 3) * 20 * u); ctx.lineWidth = 7 * u; ctx.strokeStyle = '#6aaa4a'; ctx.stroke(); } sEll(x, gy - 270 * u, 130 * u, 50 * u, '#5a9a3a', { lw: 5 * u }); }
// ---------------------------------------------------------------- 7. HÀ NỘI OLD QUARTER STREET
defPlace('oldquarter', 'Hà Nội Old Quarter — tube houses & wires', 'Narrow colourful tube houses, tangled power lines, shop signs, parked motorbikes.', 150, (t, o) => {
  const u = U(), gy = HB() - 150 * u, s = o.scroll || 0; LW = 5 * u;
  sky({ ...o, t }, gy - 500 * u);
  const cols = ['#f2c14e', '#e88a6a', '#8ac0d8', '#f0e0c0', '#a8d08a', '#e8b0c8', '#f5cf6a'];
  const signs = ['PHỞ', 'CÀ PHÊ', 'BÚN CHẢ', 'BIA HƠI', 'HOMESTAY', 'BÁNH MÌ', 'XÔI'];
  layerRep(1890 * u, .9, s, x0 => { for (let i = 0; i < 7; i++) { const h = (420 + (i * 97 % 220)) * u; tubeHouse(x0 + i * 270 * u, gy, 250 * u, h, cols[i], { u, shop: 1, shutter: ['#3f7f6a', '#2f5f8a', '#7a4a2a'][i % 3], balcony: 1, sign: signs[i], signCol: [C.red, '#2f5fb0', '#1f6a3a'][i % 3], awning: i % 2 ? '#e8402a' : null }); } });
  // wires
  ctx.save(); for (let k = 0; k < 6; k++) { ctx.beginPath(); const y0 = gy - 380 * u + k * 14 * u; ctx.moveTo(0, y0); for (let x = 0; x <= W; x += 120 * u) ctx.quadraticCurveTo(x + 60 * u, y0 + 26 * u + (k % 3) * 8 * u, x + 120 * u, y0); ctx.lineWidth = 2.5 * u; ctx.strokeStyle = '#1f1a18'; ctx.stroke(); } ctx.restore();
  rr(-20, gy - 6 * u, W + 40, H - gy + 30, 0, '#8a8680', LW); rr(-20, gy - 6 * u, W + 40, 24 * u, 0, '#b8b2a6', 4 * u);
  layerRep(1600 * u, 1, s, x0 => { drawProp('moto', x0 + 200 * u, gy + 70 * u, .55 * u, { color: '#2f6fb0', spin: 0 }, t); drawProp('scooter', x0 + 700 * u, gy + 70 * u, .55 * u, { color: '#f2f2f2', spin: 0 }, t); drawProp('stool', x0 + 1120 * u, gy + 60 * u, .45 * u); drawProp('stool', x0 + 1200 * u, gy + 60 * u, .45 * u, { color: '#3a7bd5' }); });
  timeTint(o);
});
// ---------------------------------------------------------------- 8. TRAIN STREET
defPlace('trainstreet', 'Hà Nội Train Street', 'Railway squeezed between houses; cafés on the tracks. Safety note: follow local rules — access is often restricted.', 120, (t, o) => {
  const u = U(), gy = HB() - 120 * u, s = o.scroll || 0, vp = [W / 2, gy - 360 * u]; LW = 5 * u;
  sky({ ...o, t, clouds: true }, vp[1]);
  // perspective houses both sides
  for (const sd of [-1, 1]) for (let k = 0; k < 6; k++) { const p0 = k / 6, p1 = (k + 1) / 6; const x0 = lerp(sd < 0 ? 0 : W, vp[0] + sd * 140 * u, p0 * .9), x1 = lerp(sd < 0 ? 0 : W, vp[0] + sd * 140 * u, p1 * .9); const h0 = lerp(H * .95, 300 * u, p0), h1 = lerp(H * .95, 300 * u, p1); const yb0 = lerp(H, gy - 300 * u, p0 * .9) , yb1 = lerp(H, gy - 300 * u, p1 * .9);
    sPoly([[x0, yb0], [x1, yb1], [x1, yb1 - h1], [x0, yb0 - h0]], ['#f2c14e', '#8ac0d8', '#e88a6a', '#a8d08a', '#f0e0c0', '#e8b0c8'][(k + (sd > 0 ? 3 : 0)) % 6], { lw: 4 * u }); }
  // tracks
  ctx.fillStyle = '#8a7a6a'; ctx.beginPath(); ctx.moveTo(W * .3, H); ctx.lineTo(vp[0] - 30 * u, vp[1] + 60 * u); ctx.lineTo(vp[0] + 30 * u, vp[1] + 60 * u); ctx.lineTo(W * .7, H); ctx.closePath(); fs('#8a7a6a', 4 * u);
  for (let k = 0; k < 14; k++) { const p = Math.pow(k / 14, 1.6); const y = lerp(H, vp[1] + 60 * u, p), w = lerp(W * .42, 70 * u, p); line(W / 2 - w / 2, y, W / 2 + w / 2, y, lerp(10, 3, p) * u, '#5a4a3a'); }
  for (const sd of [-1, 1]) line(W / 2 + sd * W * .14, H, vp[0] + sd * 14 * u, vp[1] + 60 * u, 6 * u, '#c8ccd0');
  timeTint(o);
});
// ---------------------------------------------------------------- 9. SÀI GÒN skyline
defPlace('saigon', 'Sài Gòn — skyline & river', 'Landmark 81 and Bitexco-style towers over the Saigon River; best at night.', 200, (t, o) => {
  const u = U(), gy = HB() - 200 * u, s = o.scroll || 0, river = gy - 120 * u; LW = 5 * u; const night = o.time === 'night';
  sky({ ...o, t }, river);
  layerRep(2200 * u, .2, s, x0 => {
    const bcol = night ? '#2a3456' : '#9ab0c8';
    for (let i = 0; i < 14; i++) { const h = (160 + hash(i * 3) * 260) * u; sRR(x0 + i * 150 * u, river - h, 120 * u, h, 3 * u, shade(bcol, (i % 3) * .05), { lw: 4 * u, inner: () => { for (let r = 0; r < h / (30 * u); r++) for (let c = 0; c < 3; c++) if (hash(i * 50 + r * 7 + c) > (night ? .45 : .7)) rr(x0 + i * 150 * u + 16 * u + c * 32 * u, river - h + 14 * u + r * 30 * u, 18 * u, 14 * u, 1, night ? '#ffd36a' : '#d8e6f0', 0); } }); }
    // Landmark 81 (stepped tall tower)
    const lx = x0 + 1500 * u; for (let k = 0; k < 5; k++) { const w = (130 - k * 18) * u, h = (720 - k * 110) * u; sRR(lx - w / 2, river - h, w, h, 4 * u, night ? '#3a4a7a' : '#b8c8dc', { lw: 4 * u }); } line(lx, river - 720 * u, lx, river - 790 * u, 5 * u);
    // Bitexco-style tower with helipad
    const bx = x0 + 700 * u; sPoly([[bx - 60 * u, river], [bx + 60 * u, river], [bx + 34 * u, river - 560 * u], [bx - 34 * u, river - 560 * u]], night ? '#34406a' : '#a8bcd0', { lw: 4 * u }); sEll(bx + 40 * u, river - 440 * u, 70 * u, 14 * u, night ? '#5a6a9a' : '#d0dce8', { lw: 4 * u });
  });
  water(river, night ? '#1a2a4a' : '#5a8a9a', { ...o, t }, .4);
  if (night) for (let i = 0; i < 30; i++) { const x = hash(i) * W, y = river + 20 * u + hash(i + 3) * 80 * u; line(x, y, x + 40 * u, y, 4 * u, ['#ffd36a', '#ff7aa8', '#7ad8ff'][i % 3]); }
  rr(-20, gy - 6 * u, W + 40, H - gy + 30, 0, '#9a9690', LW);
  for (let i = 0; i < 6; i++) { const x = ((i * 380 * u - s) % (W + 380 * u) + W + 380 * u) % (W + 380 * u) - 100 * u; drawProp('palm', x, gy + 4 * u, .55 * u, {}, t); }
  timeTint({ ...o, time: night ? 'x' : o.time });
});
// ---------------------------------------------------------------- 10. BẾN THÀNH
defPlace('benthanh', 'Sài Gòn — Bến Thành Market', 'Iconic market facade with central clock tower; motorbike traffic in front.', 150, (t, o) => {
  const u = U(), gy = HB() - 150 * u, s = o.scroll || 0, x = W / 2 - (s * .5) % (W * 2) * 0; LW = 5 * u;
  sky({ ...o, t }, gy - 400 * u);
  const fw = Math.min(W * .95, 1500 * u);
  sRR(x - fw / 2, gy - 300 * u, fw, 300 * u, 6 * u, '#f0e6c8', { inner: () => { for (let i = 0; i < 10; i++) { const ax = x - fw / 2 + 60 * u + i * (fw - 120 * u) / 9; ctx.beginPath(); ctx.arc(ax, gy - 140 * u, 40 * u, Math.PI, 0); ctx.lineTo(ax + 40 * u, gy); ctx.lineTo(ax - 40 * u, gy); ctx.closePath(); fs('#5a4a3a', 4 * u); } } });
  rr(x - fw / 2 - 10 * u, gy - 310 * u, fw + 20 * u, 22 * u, 4 * u, '#d8c8a0', 4 * u);
  // clock tower
  sRR(x - 110 * u, gy - 560 * u, 220 * u, 560 * u, 6 * u, '#f6ecd0', { inner: () => { ctx.beginPath(); ctx.arc(x, gy - 160 * u, 60 * u, Math.PI, 0); ctx.lineTo(x + 60 * u, gy); ctx.lineTo(x - 60 * u, gy); ctx.closePath(); fs('#5a4a3a', 4 * u); } });
  sCirc(x, gy - 440 * u, 56 * u, '#fffdf7', { lw: 5 * u }); const hr = t * .2, mn = t * 2; line(x, gy - 440 * u, x + Math.cos(hr - 1.5) * 30 * u, gy - 440 * u + Math.sin(hr - 1.5) * 30 * u, 6 * u); line(x, gy - 440 * u, x + Math.cos(mn) * 44 * u, gy - 440 * u + Math.sin(mn) * 44 * u, 4 * u);
  sPoly([[x - 130 * u, gy - 560 * u], [x + 130 * u, gy - 560 * u], [x, gy - 640 * u]], '#a8452a', { lw: 5 * u });
  sRR(x - 200 * u, gy - 360 * u, 400 * u, 56 * u, 6 * u, '#2f5fb0', { lw: 5 * u }); T('CHỢ BẾN THÀNH', x, gy - 332 * u, { size: 34 * u, font: 'body', fill: '#fff', lw: 0 });
  rr(-20, gy - 6 * u, W + 40, H - gy + 30, 0, '#7d7a76', LW);
  layerRep(1400 * u, 1, s + t * 200 * u, x0 => { drawProp('moto', x0 + 200 * u, gy + 100 * u, .5 * u, { color: '#e8402a' }, t); drawProp('scooter', x0 + 800 * u, gy + 100 * u, .5 * u, { color: '#3fa36b' }, t); });
  timeTint(o);
});
// ---------------------------------------------------------------- 11. MEKONG floating market
defPlace('mekong', 'Mekong Delta — Cái Răng floating market', 'Wide brown river, wooden boats piled with fruit, "cây bẹo" poles showing what each boat sells, coconut palms.', 0, (t, o) => {
  const u = U(), river = HB() - 520 * u, s = o.scroll || 0; LW = 5 * u;
  sky({ ...o, t }, river);
  layerRep(1800 * u, .15, s, x0 => { for (let i = 0; i < 10; i++) drawProp('palm', x0 + i * 180 * u, river + 6 * u, (.45 + hash(i) * .2) * u, {}, t); });
  water(river, o.time === 'night' ? '#3a3a3a' : '#b08a5a', { ...o, t }, .5);
  layerRep(2000 * u, .6, s, x0 => { for (let i = 0; i < 3; i++) { const bx = x0 + 300 * u + i * 650 * u, by = river + (140 + i * 90) * u; ctx.save(); ctx.translate(bx, by + Math.sin(t * 1.5 + i) * 4 * u); ctx.scale(u, u);
    line(40, -40, 50, -300, 6, '#7a5a32'); drawProp(['durian', 'dragonfruit', 'coconut'][i], 50, -300, .35);
    shaded(() => { ctx.moveTo(-200, -60); ctx.quadraticCurveTo(-170, 0, 0, 0); ctx.quadraticCurveTo(180, 0, 220, -70); ctx.quadraticCurveTo(0, -46, -200, -60); ctx.closePath(); }, '#2f6a8a');
    for (let k = 0; k < 8; k++) sCirc(-120 + k * 30, -66 - (k % 2) * 16, 22, ['#f6b62e', '#7cb53c', '#e8337a', '#e0303a'][k % 4], { lw: 4 });
    circ(170, -54, 14, '#fff', 3); circ(170, -54, 6, C.red, 0); ctx.restore(); } });
  timeTint(o);
}, { ground: () => HB() - 160 * U() });
// ---------------------------------------------------------------- 12. HUẾ
defPlace('hue', 'Huế — Imperial Citadel (Ngọ Môn gate)', 'Noon Gate: stone base with three arches, two-tier yellow-roofed Five-Phoenix pavilion.', 150, (t, o) => {
  const u = U(), gy = HB() - 150 * u, x = W / 2; LW = 5 * u;
  sky({ ...o, t }, gy - 380 * u);
  const fw = Math.min(W * .98, 1400 * u);
  sRR(x - fw / 2, gy - 260 * u, fw, 260 * u, 4 * u, '#b8a890', { inner: () => { for (let r = 0; r < 8; r++) for (let c = 0; c < 30; c++) rr(x - fw / 2 + c * 48 * u + (r % 2) * 24 * u, gy - 260 * u + r * 32 * u, 46 * u, 30 * u, 2, null, 1.5 * u, 'rgba(0,0,0,.18)'); for (const k of [-1, 0, 1]) { const ax = x + k * 220 * u, w = (k ? 60 : 80) * u; ctx.beginPath(); ctx.arc(ax, gy - 120 * u, w, Math.PI, 0); ctx.lineTo(ax + w, gy); ctx.lineTo(ax - w, gy); ctx.closePath(); fs('#3a2a22', 4 * u); } } });
  for (const tier of [0, 1]) { const w = (tier ? 520 : 820) * u, y = gy - 260 * u - tier * 150 * u; sRR(x - w / 2 + 40 * u, y - 110 * u, w - 80 * u, 110 * u, 4 * u, '#c8382a', { inner: () => { for (let c = 0; c < 12; c++) line(x - w / 2 + 60 * u + c * (w - 120 * u) / 11, y - 110 * u, x - w / 2 + 60 * u + c * (w - 120 * u) / 11, y, 6 * u, '#8a2a1a'); } });
    shaded(() => { ctx.moveTo(x - w / 2 - 40 * u, y - 100 * u); ctx.quadraticCurveTo(x - w / 2, y - 120 * u, x - w / 2 + 40 * u, y - 170 * u); ctx.lineTo(x + w / 2 - 40 * u, y - 170 * u); ctx.quadraticCurveTo(x + w / 2, y - 120 * u, x + w / 2 + 40 * u, y - 100 * u); ctx.closePath(); }, '#f2b632', { lw: 5 * u }); }
  for (let i = 0; i < 2; i++) drawProp('flag_vn', x + (i ? 1 : -1) * fw * .42, gy - 260 * u, .55 * u, {}, t + i);
  rr(-20, gy - 6 * u, W + 40, H - gy + 30, 0, '#c8bfae', LW);
  timeTint(o);
});
// ---------------------------------------------------------------- 13. ĐÀ LẠT
defPlace('dalat', 'Đà Lạt — pine hills & lake', 'Cool highland city: pine-covered hills, misty lake, flower gardens, colourful villas.', 160, (t, o) => {
  const u = U(), gy = HB() - 160 * u, lake = gy - 200 * u, s = o.scroll || 0; LW = 5 * u;
  sky({ ...o, t }, lake - 100 * u);
  layerRep(1600 * u, .12, s, x0 => { sSmooth([[x0 - 100 * u, lake], [x0 + 300 * u, lake - 340 * u], [x0 + 800 * u, lake - 260 * u], [x0 + 1300 * u, lake - 380 * u], [x0 + 1700 * u, lake]], '#7aa890', { lw: 4 * u }); });
  layerRep(1400 * u, .25, s, x0 => { for (let i = 0; i < 14; i++) drawProp('pine', x0 + i * 100 * u, lake - 60 * u + (i % 3) * 20 * u, (.45 + (i % 2) * .15) * u, {}, t); for (let i = 0; i < 3; i++) { const vx = x0 + 200 * u + i * 420 * u; sRR(vx, lake - 140 * u, 120 * u, 90 * u, 4 * u, ['#f2e0e8', '#e0f0e8', '#f8e8c0'][i], { lw: 4 * u }); sPoly([[vx - 14 * u, lake - 140 * u], [vx + 134 * u, lake - 140 * u], [vx + 60 * u, lake - 200 * u]], '#c8452a', { lw: 4 * u }); } });
  hazeBand(lake - 60 * u, 60 * u, '#ffffff', .6);
  water(lake, '#7ab0b8', { ...o, t }, .3);
  rr(-20, gy - 6 * u, W + 40, H - gy + 30, 0, '#8aba5a', LW);
  for (let i = 0; i < 16; i++) { const x = ((i * 130 * u - s) % (W + 200 * u) + W + 200 * u) % (W + 200 * u) - 60 * u; for (let k = 0; k < 4; k++) sCirc(x + k * 18 * u, gy + 20 * u - (k % 2) * 10 * u, 11 * u, ['#ff7aa8', '#ffd23a', '#c58aff', '#fff'][(i + k) % 4], { lw: 3 * u }); }
  timeTint(o);
});
// ---------------------------------------------------------------- 14. NINH BÌNH
defPlace('ninhbinh', 'Ninh Bình — Tràng An river & karsts', '"Hạ Long on land": rowing boats on a calm river between rice fields and towering karsts.', 0, (t, o) => {
  const u = U(), river = HB() - 380 * u, s = o.scroll || 0; LW = 5 * u;
  sky({ ...o, t }, river - 100 * u);
  range(51, 10, 2600 * u, river, 300 * u, 520 * u, 180 * u, 280 * u, '#8fbf9a', .12, s, 4 * u);
  hazeBand(river - 60 * u, 60 * u, '#ffffff', .4);
  range(52, 6, 2400 * u, river + 20 * u, 400 * u, 640 * u, 240 * u, 340 * u, '#5f9a68', .35, s, 5 * u);
  ctx.fillStyle = '#a8d06a'; ctx.fillRect(0, river - 10 * u, W, 50 * u); line(0, river - 10 * u, W, river - 10 * u, LW);
  water(river + 40 * u, '#4f9fa0', { ...o, t }, .6);
  layerRep(1800 * u, .8, s, x0 => drawProp('sampan', x0 + 700 * u, river + 210 * u, .8 * u, { color: '#8a6a4a' }, t));
  timeTint(o);
}, { ground: () => HB() - 170 * U() });
// ---------------------------------------------------------------- 15. ĐÀ NẴNG — Golden Bridge
defPlace('danang', 'Đà Nẵng — Golden Bridge (Bà Nà Hills)', 'Gold-railed walkway held up by two giant moss-covered stone hands, above the clouds.', 300, (t, o) => {
  const u = U(), gy = HB() - 300 * u; LW = 5 * u;
  sky({ ...o, t }, gy);
  for (let i = 0; i < 5; i++) drawProp('cloud', ((i * 480 * u + t * 10 * u) % (W + 400 * u)) - 200 * u, gy + 200 * u + (i % 2) * 60 * u, 1.6 * u);
  range(61, 6, 2200 * u, gy + 300 * u, 300 * u, 500 * u, 400 * u, 600 * u, '#5f9a68', .2, o.scroll || 0, 5 * u);
  const by = (p) => (1 - p) * (1 - p) * (gy - 40 * u) + 2 * (1 - p) * p * (gy + 80 * u) + p * p * (gy - 40 * u);
  const hands = [[.3, 1], [.7, -1]], stone = '#8f948a';
  const hand = (p, fl, part) => { const hx = p * W, hy = by(p) + 30 * u; ctx.save(); ctx.translate(hx, hy); ctx.scale(1.25 * u * fl, 1.25 * u);
    const moss = () => { for (let i = 0; i < 14; i++) circ(-90 + hash(i + p * 10) * 180, -20 + hash(i + 5) * 300, 8 + hash(i + 2) * 12, '#6f8f5a', 0); };
    if (part === 'back') { sRR(-80, 20, 160, 400, 60, stone, { inner: moss }); sEll(0, 20, 120, 64, stone, { inner: moss }); sEll(-118, -6, 30, 62, stone, {}, -.5); }
    else { for (let k = 0; k < 4; k++) { const fx = -78 + k * 52; sRR(fx - 22, -80 + Math.abs(k - 1.5) * 12, 44, 110, 22, stone, { inner: () => { circ(fx, -40, 9, '#6f8f5a', 0); } }); line(fx - 12, -50 + Math.abs(k - 1.5) * 12, fx + 12, -50 + Math.abs(k - 1.5) * 12, 3, 'rgba(0,0,0,.3)'); } }
    ctx.restore(); };
  hands.forEach(([p, fl]) => hand(p, fl, 'back'));
  // bridge curve
  ctx.beginPath(); ctx.moveTo(-20, gy - 40 * u); ctx.quadraticCurveTo(W / 2, gy + 80 * u, W + 20, gy - 40 * u); ctx.lineWidth = 46 * u; ctx.strokeStyle = C.ink; ctx.stroke(); ctx.lineWidth = 36 * u; ctx.strokeStyle = '#e8b832'; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-20, gy - 90 * u); ctx.quadraticCurveTo(W / 2, gy + 30 * u, W + 20, gy - 90 * u); ctx.lineWidth = 8 * u; ctx.strokeStyle = '#f6d36a'; ctx.stroke();
  for (let k = 0; k <= 30; k++) { const p = k / 30, x = p * W, y = by(p); line(x, y - 20 * u, x, y - 50 * u, 4 * u, '#f6d36a'); }
  hands.forEach(([p, fl]) => hand(p, fl, 'front'));
  timeTint(o);
}, { ground: () => HB() - 330 * U() });
// ---------------------------------------------------------------- 16. MŨI NÉ
defPlace('muine', 'Mũi Né — red & white sand dunes', 'Rolling dunes in orange-red and white, wind ripples, ATV tracks, big sky.', 120, (t, o) => {
  const u = U(), gy = HB() - 120 * u, s = o.scroll || 0; LW = 5 * u;
  sky({ ...o, t }, gy - 300 * u);
  for (const [f, base, col, amp] of [[.1, gy - 280 * u, '#f6d8a8', 120], [.3, gy - 160 * u, '#eab070', 160], [.6, gy - 40 * u, '#d8763a', 140]]) { ctx.beginPath(); ctx.moveTo(0, H); for (let x = 0; x <= W; x += 20) ctx.lineTo(x, base - (Math.sin((x + s * f) * .003 / u) * .5 + .5) * amp * u - Math.sin((x + s * f) * .007 / u) * 30 * u); ctx.lineTo(W, H); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ctx.lineWidth = LW; ctx.strokeStyle = C.ink; ctx.stroke();
    ctx.save(); ctx.clip(); ctx.globalAlpha = .3; for (let k = 0; k < 10; k++) { ctx.beginPath(); for (let x = 0; x <= W; x += 30) ctx.lineTo(x, base + k * 24 * u + Math.sin(x * .02 + k) * 5 * u); ctx.lineWidth = 3 * u; ctx.strokeStyle = shade(col, -.2); ctx.stroke(); } ctx.restore(); }
  timeTint(o);
});
// ---------------------------------------------------------------- 17. PHÚ QUỐC beach
defPlace('phuquoc', 'Phú Quốc — beach', 'Turquoise sea, white sand, leaning coconut palms; sunset is the signature shot.', 170, (t, o) => {
  const u = U(), gy = HB() - 170 * u, sea = gy - 260 * u, s = o.scroll || 0; LW = 5 * u;
  sky({ ...o, t }, sea);
  water(sea, o.time === 'sunset' ? '#e8946a' : '#36c0c8', { ...o, t }, .2);
  for (let k = 0; k < 3; k++) { const y = gy - 60 * u + k * 6 * u + Math.sin(t * 1.5 + k) * 8 * u; ctx.beginPath(); for (let x = 0; x <= W; x += 20) ctx.lineTo(x, y + Math.sin(x * .01 + t * 2 + k) * 6 * u); ctx.lineWidth = 6 * u; ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.stroke(); }
  ctx.beginPath(); ctx.moveTo(0, H); ctx.lineTo(0, gy - 40 * u); for (let x = 0; x <= W; x += 40) ctx.lineTo(x, gy - 40 * u + Math.sin(x * .004) * 20 * u); ctx.lineTo(W, H); ctx.closePath(); fs('#f6e6c0', LW);
  layerRep(1500 * u, 1, s, x0 => { ctx.save(); ctx.translate(x0 + 200 * u, gy + 40 * u); ctx.rotate(-.12); drawProp('palm', 0, 0, .9 * u, {}, t); ctx.restore(); drawProp('umbrella', x0 + 900 * u, gy + 60 * u, .7 * u, { color: '#3fa3d8' }); });
  timeTint(o);
});
// ---------------------------------------------------------------- 18. HOMESTAY interior
defPlace('homestay', 'Highland homestay — wooden interior at night', 'Wooden walls, hanging lamp, window to the stars, hanging corn, low table.', 180, (t, o) => {
  const u = U(), gy = HB() - 180 * u; LW = 5 * u;
  ctx.fillStyle = '#3b2418'; ctx.fillRect(0, 0, W, H);
  for (let i = -1; i < W / (160 * u) + 1; i++) { rr(i * 160 * u, -10, 160 * u, H + 20, 0, i % 2 ? '#8a5a35' : '#7d4f2e', 4 * u); line(i * 160 * u + 40 * u, 200 * u + (i * 37 % 300) * u, i * 160 * u + 40 * u, 260 * u + (i * 37 % 300) * u, 3 * u, '#5e3a20'); }
  const wx = W * .12, wy = gy - 620 * u; rr(wx, wy, 360 * u, 280 * u, 10 * u, '#14234a', 8 * u);
  ctx.save(); ctx.beginPath(); ctx.rect(wx, wy, 360 * u, 280 * u); ctx.clip(); circ(wx + 270 * u, wy + 80 * u, 46 * u, '#fff6c8', 0); circ(wx + 292 * u, wy + 68 * u, 40 * u, '#14234a', 0); const r = rng(3); for (let i = 0; i < 25; i++) circ(wx + r() * 360 * u, wy + r() * 200 * u, (2 + r() * 2.5) * u, '#fff', 0); for (let i = 0; i < 4; i++) karstPeak(wx + 30 * u + i * 110 * u, wy + 282 * u, 140 * u, (120 + i % 2 * 50) * u, '#0c1630', 0); ctx.restore();
  line(wx + 180 * u, wy, wx + 180 * u, wy + 280 * u, 8 * u); line(wx, wy + 140 * u, wx + 360 * u, wy + 140 * u, 8 * u); rr(wx, wy, 360 * u, 280 * u, 10 * u, null, 9 * u);
  line(W * .7, 120 * u, W * .7 + 300 * u, 120 * u, 6 * u, '#5e3a20'); for (let i = 0; i < 5; i++) { line(W * .7 + 40 * u + i * 55 * u, 120 * u, W * .7 + 40 * u + i * 55 * u, 160 * u, 4 * u, '#7a5232'); sEll(W * .7 + 40 * u + i * 55 * u, 210 * u + (i % 2) * 20 * u, 18 * u, 46 * u, C.yel2, { lw: 4 * u }); }
  line(W / 2, -20, W / 2, 150 * u, 4 * u);
  const lg = ctx.createRadialGradient(W / 2, 200 * u, 0, W / 2, 200 * u, 900 * u); lg.addColorStop(0, 'rgba(255,200,110,.55)'); lg.addColorStop(1, 'rgba(255,170,80,0)'); ctx.fillStyle = lg; ctx.fillRect(0, 0, W, H);
  sPoly([[W / 2 - 60 * u, 200 * u], [W / 2 + 60 * u, 200 * u], [W / 2 + 30 * u, 150 * u], [W / 2 - 30 * u, 150 * u]], '#e0a040', { lw: 5 * u }); circ(W / 2, 212 * u, 16 * u, '#fff3b0', 4 * u);
  rr(-20, gy, W + 40, H - gy + 20, 0, '#5e3a20', LW);
}, { night: true });
// ---------------------------------------------------------------- 19. STREET CAFÉ / sidewalk
defPlace('sidewalk', 'Sidewalk café — plastic stools culture', 'Pavement café: tiny plastic stools, low tables, a tree, a shop front, scooters passing.', 150, (t, o) => {
  const u = U(), gy = HB() - 150 * u, s = o.scroll || 0; LW = 5 * u;
  sky({ ...o, t }, gy - 500 * u);
  layerRep(1500 * u, .5, s, x0 => { tubeHouse(x0, gy - 60 * u, 500 * u, 520 * u, '#f2c14e', { u, shop: 1, sign: 'CÀ PHÊ', signCol: '#1f6a3a', awning: '#e8402a', balcony: 1 }); tubeHouse(x0 + 520 * u, gy - 60 * u, 460 * u, 600 * u, '#8ac0d8', { u, shop: 1, sign: 'TẠP HOÁ', signCol: C.red, balcony: 1 }); tubeHouse(x0 + 1000 * u, gy - 60 * u, 500 * u, 480 * u, '#e88a6a', { u, shop: 1, sign: 'PHỞ BÒ', signCol: '#2f5fb0', awning: '#3fa36b' }); });
  rr(-20, gy - 60 * u, W + 40, 60 * u, 0, '#c9b49a', LW); for (let x = 0; x < W; x += 60 * u) line(x - ((s * .5) % (60 * u)), gy - 60 * u, x - ((s * .5) % (60 * u)) - 20 * u, gy, 2 * u, 'rgba(0,0,0,.2)');
  rr(-20, gy, W + 40, H - gy + 20, 0, '#7d7a76', LW);
  for (let i = 0; i < 2; i++) drawProp('tree', ((i * 900 * u - s * .5) % (W + 400 * u) + W + 400 * u) % (W + 400 * u) - 100 * u, gy - 40 * u, 1.1 * u, { color: '#4f9a4a' }, t);
  timeTint(o);
});
// ---------------------------------------------------------------- 20. VILLAGE countryside
defPlace('village', 'Northern countryside — rice fields & village gate', 'Flat green paddies, buffalo, bamboo, an old village gate and pagoda roof.', 150, (t, o) => {
  const u = U(), gy = HB() - 150 * u, s = o.scroll || 0; LW = 5 * u;
  sky({ ...o, t }, gy - 300 * u);
  layerRep(2000 * u, .15, s, x0 => { for (let i = 0; i < 8; i++) drawProp('bamboo', x0 + i * 250 * u, gy - 260 * u, .55 * u, {}, t); sRR(x0 + 1200 * u, gy - 430 * u, 200 * u, 170 * u, 4 * u, '#e8d8b0', { lw: 4 * u }); shaded(() => { ctx.moveTo(x0 + 1170 * u, gy - 420 * u); ctx.quadraticCurveTo(x0 + 1180 * u, gy - 470 * u, x0 + 1150 * u, gy - 490 * u); ctx.lineTo(x0 + 1450 * u, gy - 490 * u); ctx.quadraticCurveTo(x0 + 1420 * u, gy - 470 * u, x0 + 1430 * u, gy - 420 * u); ctx.closePath(); }, '#9a4a2a', { lw: 4 * u }); });
  for (let i = 0; i < 4; i++) { const y = gy - 260 * u + i * 70 * u; rr(-20, y, W + 40, 70 * u, 0, ['#9ad45a', '#8cc84a', '#a8dc6a', '#7ab840'][i], 4 * u); ctx.save(); ctx.globalAlpha = .35; for (let x = 0; x < W; x += 24 * u) line(x, y + 10 * u, x + 6 * u, y + 60 * u, 2 * u, '#4f8a3a'); ctx.restore(); }
  layerRep(2400 * u, .6, s, x0 => drawProp('buffalo', x0 + 1600 * u, gy - 110 * u, .5 * u, {}, t));
  rr(-20, gy, W + 40, H - gy + 20, 0, '#b8905a', LW);
  timeTint(o);
});
// ---------------------------------------------------------------- 21. STUDIO (brand explainer background)
defPlace('studio', 'Studio — brand explainer background', 'Warm paper background with soft rotating burst; for talking-head explainers, title cards, lists.', 160, (t, o) => {
  const u = U(); ctx.fillStyle = o.color || C.paper; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.globalAlpha = .45; const cx = W / 2, cy = H * .48, n = 18; ctx.fillStyle = o.color2 || '#fbf0d4'; for (let i = 0; i < n; i++) { const a = t * .08 + i * TAU / n; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, Math.hypot(W, H), a, a + Math.PI / n); ctx.closePath(); ctx.fill(); } ctx.restore();
  if (o.floor !== false) { const gy = HB() - 160 * u; rr(-20, gy, W + 40, H - gy + 20, 0, o.floor || '#e2cf9f', 5 * u); ctx.save(); ctx.globalAlpha = .25; rr(-20, gy, W + 40, 14 * u, 0, '#fff', 0); ctx.restore(); }
});
