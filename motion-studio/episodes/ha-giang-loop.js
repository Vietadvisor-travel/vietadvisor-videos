/* =====================================================================
   EPISODE — "The Hà Giang Loop, explained honestly"  (~92 s)
   Renders in 16:9 and 9:16 from the same file.
   Facts & prices: published 2026 guides, checked Oct 2026 (see SOURCES).
   ===================================================================== */
Object.assign(CITY, { quanba: ['Quản Bạ', 105.0, 23.07], yenminh: ['Yên Minh', 105.14, 23.12], lungcu: ['Lũng Cú', 105.32, 23.364], mapileng: ['Mã Pì Lèng', 105.40, 23.225], dugia: ['Du Già', 105.215, 22.935] });
const HG_ROUTE = (() => { // waypoints + small wiggles = hairpins
  const wp = [[104.98, 22.82], [105.0, 23.07], [105.14, 23.12], [105.25, 23.2], [105.32, 23.364], [105.362, 23.277], [105.40, 23.225], [105.408, 23.162], [105.215, 22.935], [104.98, 22.82]];
  const out = []; for (let i = 0; i < wp.length - 1; i++) { const [a, b] = [wp[i], wp[i + 1]]; const dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy); for (let j = 0; j < 24; j++) { const f = j / 24, w = Math.sin(f * Math.PI * (5 + i % 3 * 2)) * .012 * Math.sin(f * Math.PI); out.push([a[0] + dx * f - dy / d * w, a[1] + dy * f + dx / d * w]); } } out.push(wp[wp.length - 1]); return out; })();
const ROUTE_STOPS = ['hagiang', 'quanba', 'yenminh', 'lungcu', 'dongvan', 'mapileng', 'meovac', 'dugia'];
// "stage" = draw a fixed 1920×1080 design and cover-fit it into any format, keeping focus (fx,fy) in view
function stage(fx, fy, fn, zoom = 1) { const s = Math.max(W / 1920, H / 1080) * zoom, vw = W / 2 / s, vh = H / 2 / s; fx = clamp(fx, vw, 1920 - vw); fy = clamp(fy, vh, 1080 - vh);
  const pW = W, pH = H; ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(s, s); ctx.translate(-fx, -fy); W = 1920; H = 1080; try { fn(); } finally { W = pW; H = pH; ctx.restore(); } }
const ISV = () => H > W;
function terrainDoodles(P, o) { const u = U(), k = o.k; const r = rng(21);
  for (let i = 0; i < 70; i++) { const lo = 104.85 + r() * .75, la = 22.75 + r() * .7, sz = .6 + r() * .6; const [x, y] = P(lo, la); karstPeak(x, y, 40 * sz * k / 1100, 52 * sz * k / 1100, '#7aac5a', 3 * u); }
  const [cx, cy] = P(105.28, 23.47); T('CHINA', cx, cy, { size: 60 * u, fill: '#cdbb8c', lw: 0, ls: 14 * u }); }

// ---------------------------------------------------------------- custom scene renders
function renderTitle(lt) {
  const u = U(); burstBg(W / 2, H * .45, 18, lt * .25, C.red, '#c63a32');
  ctx.save(); ctx.globalAlpha = .9; star(W / 2, H * .45, Math.min(W, H) * .4 * E.back(clamp(lt / .4)), '#e8574c', 0, lt * .2); ctx.restore();
  ctx.save(); ctx.fillStyle = '#8f241f'; for (let i = 0; i < 16; i++) karstPeak(((i * 170 * u - lt * 120 * u) % (W + 300 * u) + W + 300 * u) % (W + 300 * u) - 150 * u, H, 220 * u, (140 + (i * 37 % 120)) * u, '#8f241f', 0); ctx.restore();
  const bp = inv(.9, 2.6, lt); if (bp > 0 && bp < 1) { const bx = lerp(-300 * u, W + 300 * u, bp); for (let i = 1; i < 6; i++) { ctx.save(); ctx.globalAlpha = .5 * (1 - i / 6); circ(bx - 160 * u - i * 70 * u, H - 90 * u, (24 - i * 2) * u, '#f2d7c9', 4 * u); ctx.restore(); }
    drawProp('moto', bx, H - 50 * u, .7 * u, { spin: lt * 25, shadow: false }, lt); person(bx - 28 * u, H - 75 * u, .64 * u, CHAR.dave.spec, { t: lt, pose: 'ride', expr: 'grin', headwear: { type: 'helmet', color: C.yel }, wind: 1, noShadow: 1 }); }
  const sz = ISV() ? 170 : 210;
  UI.title(1, { text: ISV() ? ['THE', 'HÀ GIANG', 'LOOP'] : ['THE HÀ GIANG', 'LOOP'], size: sz, x: W / 2, y: H * .42, accentLast: 1, at: 0, sub: 'explained honestly' }, lt);
  for (let i = 0; i < 6; i++) { const a = i * 1.1 + lt; sparkle(W / 2 + Math.cos(a) * W * .4, H * .45 + Math.sin(a * 1.3) * H * .35, (.8 + .4 * Math.sin(lt * 6 + i)) * u, lt * 2 + i); }
}
// ---- Mã Pì Lèng canyon (design-space 1920×1080, very tall world)
const WALL_L = y => lerp(760, 880, Math.pow(y / 3000, .8)) + noise1(y / 140) * 60 + noise1(y / 37) * 18;
const WALL_R = y => lerp(1420, 1120, Math.pow(y / 3000, .7)) + noise1(y / 150 + 40) * 70 + noise1(y / 41 + 9) * 18;
function canyonWall(side, col, edgeFn, top, seed, dark) {
  const xs = side < 0 ? -60 : 1980; const path = () => { ctx.moveTo(xs, top); for (let y = top; y <= 3250; y += 20) ctx.lineTo(edgeFn(y), y); ctx.lineTo(xs, 3250); ctx.closePath(); };
  ctx.beginPath(); path(); ctx.fillStyle = col; ctx.fill(); ctx.save(); ctx.beginPath(); path(); ctx.clip();
  for (let y = top; y < 3250; y += 40) { const ex = edgeFn(y), gw = 160, g = ctx.createLinearGradient(ex, 0, ex + side * gw, 0); g.addColorStop(0, dark); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(Math.min(ex, ex + side * gw), y, gw, 42); }
  const r = rng(seed); ctx.globalAlpha = .35;
  for (let y = top + 60; y < 3250; y += 55 + r() * 40) { ctx.beginPath(); for (let x = -60; x < 1980; x += 30) ctx.lineTo(x, y + noise1(x / 80 + y * .01) * 10); ctx.lineWidth = 4; ctx.strokeStyle = '#3d4a35'; ctx.stroke(); }
  for (let i = 0; i < 70; i++) { const y = top + r() * 3100, ex = edgeFn(y), x = ex + side * (20 + r() * 420), l = 60 + r() * 200; pline([[x, y], [x + (r() - .5) * 20, y + l * .5], [x + (r() - .5) * 30, y + l]], 3 + r() * 3, '#2f3a2a'); }
  ctx.globalAlpha = 1;
  for (let i = 0; i < 120; i++) { const y = top + 30 + r() * 3100, ex = edgeFn(y), x = ex + side * (10 + Math.pow(r(), 1.5) * 500), s_ = 10 + r() * 16, gc = r() < .5 ? '#5d9b4c' : '#4b8a43'; for (const [dx, dy, k] of [[0, 0, 1], [-.8, .4, .8], [.8, .4, .8]]) circ(x + dx * s_, y + dy * s_, s_ * k, C.ink, 0); for (const [dx, dy, k] of [[0, 0, 1], [-.8, .4, .8], [.8, .4, .8]]) circ(x + dx * s_, y + dy * s_, s_ * k - 4, gc, 0); }
  ctx.restore(); ctx.beginPath(); path(); fs(null, 7);
}
function innerWalls(f, colL, colR, shift, top) { const eL = y => lerp(800, 900, y / 3000) + shift + noise1(y / 120 + f * 9) * 40, eR = y => lerp(1340, 1090, y / 3000) - shift + noise1(y / 130 + f * 5) * 45;
  for (const [side, e, col] of [[-1, eL, colL], [1, eR, colR]]) { const xs = side < 0 ? -60 : 1980; ctx.beginPath(); ctx.moveTo(xs, top); for (let y = top; y <= 3250; y += 25) ctx.lineTo(e(y), y); ctx.lineTo(xs, 3250); ctx.closePath(); fs(col, 5); } }
function renderCanyon(lt) {
  const down = E.inOut(inv(1.9, 5.0, lt)), up = E.inOut(inv(6.25, 6.95, lt));
  const cy = lerp(lerp(540, 2620, down), 540, up) + (lt < 1.9 ? -lt * 10 : 0);
  const zf = E.inOut(inv(7.0, 7.6, lt)), z = lerp(1, 2.3, zf), fx = lerp(ISV() ? lerp(lerp(680, 1010, down), 680, up) : 960, 640, zf), fy = lerp(cy, 470, zf);
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#7fc8e8'); g.addColorStop(1, '#d9f0f2'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const s = Math.max(W / 1920, H / 1080) * z; const vh = H / 2 / s;
  const pW = W, pH = H; ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(s, s); ctx.translate(-fx, -fy); W = 1920; H = 1080; LW = 6;
  try {
    const layer = (f, fn) => { ctx.save(); ctx.translate(0, (fy - 540) * (1 - f)); fn(); ctx.restore(); };
    layer(.25, () => { range(31, 12, 3200, 700, 260, 430, 240, 380, '#a6c9c3', 0, 400, 4); drawProp('cloud', 400, 330, 1.2); drawProp('cloud', 1500, 270, 1); });
    const hz = ctx.createLinearGradient(0, 560, 0, 3000); hz.addColorStop(0, 'rgba(196,224,218,0)'); hz.addColorStop(.12, 'rgba(196,224,218,1)'); hz.addColorStop(1, '#a9d6c9'); ctx.fillStyle = hz; ctx.fillRect(-60, 560, 2040, 2700);
    layer(.5, () => innerWalls(.5, '#a3c4ad', '#97baa1', 60, 640));
    layer(.72, () => innerWalls(.72, '#86ad8f', '#7aa385', 20, 660));
    layer(.86, () => { innerWalls(.86, '#6c9877', '#618d6c', -20, 700); hazeBand(2000, 700, '#ebf8f5', .6); });
    const rv = 2900; ctx.beginPath(); ctx.moveTo(-60, rv); for (let x = -60; x <= 1980; x += 40) ctx.lineTo(x, rv + Math.sin(x / 200) * 20); ctx.lineTo(1980, 3300); ctx.lineTo(-60, 3300); ctx.closePath(); fs(C.river, 6);
    ctx.save(); ctx.globalAlpha = .7; for (let i = 0; i < 26; i++) { const x = (i * 97 + lt * 60) % 1000 + 700, y = rv + 40 + (i * 37) % 200; line(x, y, x + 40, y, 4, '#bff5ea'); } ctx.restore();
    drawProp('sampan', 980 + Math.sin(lt * .6) * 30, rv + 110, .5, { color: '#8a5a32' }, lt);
    person(1000 + Math.sin(lt * .6) * 30, rv + 92, .22, CHAR.fisher.spec, { t: lt, pose: 'wave', noShadow: 1 });
    karstPeak(1900, 600, 420, 560, '#5f8f5a', 6); karstPeak(1620, 590, 330, 430, '#6a9a62', 6); karstPeak(120, 640, 360, 380, '#5f8f5a', 6); karstPeak(420, 640, 260, 250, '#6a9a62', 6);
    canyonWall(-1, '#8f9c7c', WALL_L, 620, 11, 'rgba(30,40,25,.45)'); canyonWall(1, '#7f8f70', WALL_R, 560, 12, 'rgba(30,40,25,.5)');
    rr(-60, 600, 700, 46, 6, '#8b8782', 6); for (let x = 30; x < 640; x += 90) { rr(x, 568, 14, 34, 4, '#fff', 4); line(x + 7, 576, x + 7, 588, 5, C.red); }
    for (let i = 0; i < 5; i++) { const bx = 900 + Math.sin(lt * .5 + i) * 260 + i * 60, by = 1300 + i * 150 + Math.cos(lt + i) * 30; drawProp('bird', bx, by, 1, {}, lt + i); }
    const ra = clamp((lt - 2.0) / .5) * (1 - zf);
    if (ra > 0) { const rx = ISV() ? fx + 230 : 1700; ctx.save(); ctx.globalAlpha = ra; line(rx, 640, rx, 2880, 8, '#fff'); line(rx, 640, rx, 2880, 3, C.ink);
      [[660, 'Dave', '#fff'], [1150, 'far', '#fff'], [1650, 'farther', '#fff'], [2150, 'MUCH farther', C.yel], [2600, 'NOPE.', '#ff8a7a'], [2880, 'river', '#bff5ea']].forEach(([y, s_, c]) => { line(rx - 20, y, rx + 20, y, 8, C.ink); T(s_, rx - 40, y, { size: 46, fill: c, align: 'right' }); }); ctx.restore(); }
    drawProp('moto', 330, 616, .9, { spin: 0 }, lt);
    const o = { t: lt, expr: 'happy', look: [.7, .3] };
    if (lt > 2.0) { o.expr = 'surprised'; o.look = [.5, 1]; }
    if (lt > 6.9) { o.expr = 'scared'; o.pose = 'scared'; }
    person(650 + (lt > 6.9 ? Math.sin(lt * 60) * 3 : 0), 616, .82, CHAR.dave.spec, o);
  } finally { W = pW; H = pH; ctx.restore(); }
  const wb = Math.sin(inv(6.25, 6.95, lt) * Math.PI); if (wb > 0) { ctx.save(); ctx.globalAlpha = wb * .7; const r = rng(Math.floor(lt * 30)); for (let i = 0; i < 40; i++) { const x = r() * W, l = 200 + r() * 500, y = r() * H; line(x, y, x, y + l, 6 + r() * 10, 'rgba(255,255,255,.8)'); } ctx.restore(); }
}
// ---- Lũng Cú flag tower
function flagWave(x, y, w, h, t, faces, lt) {
  const N = 24, top = [], bot = []; const dyf = u => Math.sin(u * 5 - t * 6) * 18 * u, dxf = u => -Math.abs(Math.sin(u * 5 - t * 6)) * 6 * u;
  for (let i = 0; i <= N; i++) { const u = i / N; top.push([x + u * w + dxf(u), y + dyf(u)]); bot.push([x + u * w + dxf(u), y + h + dyf(u) * 1.05]); }
  ctx.beginPath(); top.forEach((p, i) => i ? ctx.lineTo(...p) : ctx.moveTo(...p)); for (let i = N; i >= 0; i--) ctx.lineTo(...bot[i]); ctx.closePath(); fs(C.red, 6);
  ctx.save(); ctx.clip(); for (let i = 0; i < N; i++) { const u = i / N, sh = Math.cos(u * 5 - t * 6) * u; ctx.fillStyle = sh > 0 ? `rgba(255,255,255,${sh * .12})` : `rgba(0,0,0,${-sh * .18})`; ctx.fillRect(x + u * w - 2, y - 60, w / N + 4, h + 120); } ctx.restore();
  star(x + w * .5, y + h * .5 + dyf(.5), h * .3, C.gold, 0);
  if (faces) { const cols = ['#f7c948', '#ffffff', '#ffd6a0', '#9ee08f', '#8fd3ff', '#ffb3c1', '#ffe08a']; for (let j = 0; j < 6; j++) for (let i = 0; i < 9; i++) { const k = j * 9 + i, s = pop(lt, faces + k * .028, .25); if (s <= 0) continue; const u = (i + .5) / 9, px = x + u * w + dxf(u), py = y + (j + .5) / 6 * h + dyf(u) * 1.02; ctx.save(); ctx.translate(px, py); ctx.scale(s, s); circ(0, 0, h / 6 * .38, cols[k % 7], 3); circ(-4, -2, 2, C.ink, 0); circ(4, -2, 2, C.ink, 0); ctx.beginPath(); ctx.arc(0, 2, 4, .2 * Math.PI, .8 * Math.PI); fs(null, 2); ctx.restore(); } }
}
function renderLungCu(lt) {
  const upP = E.inOut(inv(0, 2.3, lt)), back = E.inOut(inv(5.4, 6.3, lt));
  const cy = lerp(1250, 470, upP), z = lerp(1, ISV() ? 1 : .82, back), cx = lerp(960, ISV() ? 1060 : 1060, back);
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#5fb8e6'); g.addColorStop(1, '#d6f0f7'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const s = Math.max(W / 1920, H / 1080) * z; const pW = W, pH = H; ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(s, s); ctx.translate(-cx, -cy); W = 1920; H = 1080; LW = 6;
  try {
    const layer = (f, fn) => { ctx.save(); ctx.translate(0, (cy - 540) * (1 - f)); fn(); ctx.restore(); };
    layer(.2, () => { for (let i = 0; i < 5; i++) drawProp('cloud', (i * 520 + lt * 25) % 2600 - 400, 190 + (i % 2) * 120, 1.1); });
    layer(.5, () => range(31, 12, 3200, 1250, 300, 520, 240, 380, '#93c2b4', 0, 900, 4));
    layer(.8, () => range(32, 11, 2800, 1450, 260, 470, 260, 420, '#5f9f6c', 0, 300, 5));
    shaded(() => { ctx.moveTo(200, 1700); ctx.bezierCurveTo(600, 1300, 760, 960, 960, 950); ctx.bezierCurveTo(1160, 960, 1320, 1300, 1720, 1700); ctx.closePath(); }, '#5c9d58');
    pline([[960, 960], ...Array.from({ length: 8 }, (_, i) => [i % 2 ? 1050 - i * 6 : 880 + i * 6, 1000 + i * 70])], 10, '#efe6d0');
    sPoly([[870, 960], [895, 600], [1025, 600], [1050, 960]], '#e7dcc4'); for (let i = 0; i < 4; i++) sRR(940, 650 + i * 75, 40, 46, 20, '#5a4a40', { lw: 4 });
    sRR(870, 575, 180, 34, 6, '#c9b99a'); sPoly([[870, 575], [900, 540], [1020, 540], [1050, 575]], '#a53b30');
    line(960, 545, 960, 110, 10, C.ink); line(960, 545, 960, 110, 5, '#d0d0d0'); circ(960, 104, 10, C.gold, 4);
    flagWave(963, 120, 330, 220, lt, 3.55, lt);
    const dm = clamp((lt - 2.9) / .4);
    if (dm > 0) { ctx.save(); ctx.globalAlpha = dm; line(963, 80, 963 + 330 * dm, 80, 5, '#fff'); T('9 m', 963 + 165, 48, { size: 44 }); line(1320, 120, 1320, 120 + 220 * dm, 5, '#fff'); T('6 m', 1375, 230, { size: 44 }); ctx.restore();
      const bs = pop(lt, 3.25, .35); if (bs > 0) T('= 54 m²', 1480, 360, { size: 76, fill: C.yel, scale: bs, rot: -.06 });
      const es = pop(lt, 5.0, .35); if (es > 0) T('54 ethnic groups', 1500, 460, { size: 56, fill: '#fff', scale: es, rot: -.06 }); }
    const ds = pop(lt, 5.5, .35); if (ds > 0) person(1000, 575, .36 * ds, CHAR.dave.spec, { t: lt, pose: 'wave', expr: 'joy', noShadow: 1 });
  } finally { W = pW; H = pH; ctx.restore(); }
  const cs = pop(lt, 5.75, .4); const u = U();
  if (cs > 0) { const bx = ISV() ? W * .72 : W * .86, by = ISV() ? H * .62 : H * .7; ctx.save(); ctx.translate(bx + Math.sin(lt * 8) * 10 * u * (lt > 6.1), by); ctx.scale(cs * u, cs * u); ctx.rotate(-.05); sRR(-14, -20, 28, 280, 6, '#7a5232'); sPoly([[-170, -110], [110, -110], [190, -40], [110, 30], [-170, 30]], '#fff8e6', { lw: 7 }); T('CHINA', -20, -40, { size: 74, fill: C.red, lw: 0 }); ctx.restore(); }
}
// ---- Heaven's Gate overlay (rays + parting clouds + sign) — drawn over the hagiang place
function heavenGate(lt, S, L) {
  const u = U(), x = W * (ISV() ? .62 : .7), gy = PLACE.hagiang.ground();
  const gr = clamp((lt - 2.6) / .8); if (gr > 0) { ctx.save(); ctx.globalAlpha = gr * .55; ctx.translate(x, gy - 620 * u); for (let i = 0; i < 14; i++) { const a = -Math.PI / 2 + (i - 6.5) * .17 + Math.sin(lt * .8 + i) * .02; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a - .045) * 2000, -Math.sin(a - .045) * 2000); ctx.lineTo(Math.cos(a + .045) * 2000, -Math.sin(a + .045) * 2000); ctx.closePath(); ctx.fillStyle = '#fff6c4'; ctx.fill(); } ctx.restore();
    ctx.save(); ctx.globalAlpha = gr * .8; const rg = ctx.createRadialGradient(x, gy - 520 * u, 0, x, gy - 520 * u, 560 * u); rg.addColorStop(0, 'rgba(255,240,170,1)'); rg.addColorStop(1, 'rgba(255,240,170,0)'); ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const sp = E.out5(inv(2.2, 3.4, lt)); const sx = lerp(W + 400 * u, x, sp);
  ctx.save(); ctx.translate(sx, 0); sRR(-230 * u, gy - 330 * u, 26 * u, 330 * u, 6 * u, '#7a5232'); sRR(204 * u, gy - 330 * u, 26 * u, 330 * u, 6 * u, '#7a5232');
  sRR(-260 * u, gy - 520 * u, 520 * u, 220 * u, 18 * u, '#efe2c0', { lw: 8 * u }); T('CỔNG TRỜI', 0, gy - 456 * u, { size: 72 * u, font: 'body', weight: 900, fill: C.red, lw: 0 }); T('QUẢN BẠ', 0, gy - 392 * u, { size: 40 * u, font: 'body', fill: C.ink, lw: 0, ls: 6 * u }); T("HEAVEN'S GATE", 0, gy - 344 * u, { size: 30 * u, font: 'body', fill: '#7a6450', lw: 0, ls: 4 * u }); ctx.restore();
  const part = E.inOut(inv(2.4, 3.6, lt)); if (part < 1) { drawProp('cloud', x - 150 * u - part * 800 * u, gy - 330 * u, 2.1 * u); drawProp('cloud', x + 170 * u + part * 800 * u, gy - 250 * u, 2.3 * u); }
  if (lt > 3.1) UI.choir(clamp((lt - 3.1) / .4) * (1 - inv(7, 7.6, lt)), { x, y: gy - 700 * u, at: 3.1 }, lt);
}

// ---------------------------------------------------------------- the episode
window.EPISODE = {
  title: 'The Hà Giang Loop, explained honestly', fps: 30,
  sources: ['vietnamtourism.com/en/ha-giang-loop-the-honest-2026-guide (prices, licence, seasons) — checked Oct 2026', 'Lũng Cú flag: 54 m² for 54 ethnic groups'],
  scenes: [
    { id: 'map', dur: 7.2,
      layers: [{ type: 'map', view: [{ lon: 105.6, lat: 16.2, k: 46 }], camLerp: { t0: 1.5, t1: 4.8, a: { lon: 105.6, lat: 16.2, k: 46 }, b: { lon: 105.15, lat: 22.95, k: 640 } }, o: { pins: [{ lon: 104.98, lat: 22.82, label: 'HÀ GIANG', at: 4.3 }], vnFill: 1 } },
        { type: 'fn', screen: true, draw: (lt) => { const P = window._lastP; } }],
      captions: [[.1, 2.2, 'This is *Vietnam*.'], [2.4, 7.0, 'And way up at the very top… *Hà Giang*.']], shakes: [[4.75, 14, .45]], sfx: [[.0, 'map_whoosh'], [4.3, 'pin_drop'], [4.75, 'thud']] },
    { id: 'title', dur: 3.4, transition: { type: 'flash', dur: .5 }, render: renderTitle, shakes: [[.4, 22, .5]], sfx: [[0, 'impact'], [.9, 'moto_pass']] },
    { id: 'meet', dur: 8.4, transition: { type: 'ink', dur: .6 }, place: 'oldquarter', scroll: [{ t: 0, v: 0 }, { t: 8.4, v: 160 }],
      cam: [{ t: 0, x: .5, y: .5, z: 1 }, { t: 5.2, z: 1 }, { t: 5.6, z: 1.18, y: .55, ease: 'out5' }],
      layers: [
        { type: 'char', id: 'dave', x: .36, y: 'ground', dy: 40, s: 1.4, expr: 'bored', in: { type: 'drop', at: .1 }, keys: [{ t: 1.6, expr: 'bored' }, { t: 4.9, expr: 'neutral', look: [1, 0] }, { t: 5.5, expr: 'starstruck', pose: 'cheer' }], v: { x: .3, s: 1.05 } },
        { type: 'char', id: 'linh', x: .64, y: 'ground', dy: 40, s: 1.4, pose: 'wave', expr: 'happy', in: { type: 'slideR', at: 2.6, dur: .5 }, keys: [{ t: 3.6, pose: 'present', look: [-1, 0] }, { t: 5.5, pose: 'thumbs', expr: 'grin' }], v: { x: .72, s: 1.05 } },
        { type: 'ui', name: 'arrow', screen: true, at: .7, until: 2.4, o: { from: [W * .2, H * .25], to: [W * .33, H * .45], label: 'DAVE', bend: [-40, -40] }, v: { o: { from: [1080 * .18, 1920 * .3], to: [1080 * .27, 1920 * .5] } } },
        { type: 'ui', name: 'lower', screen: true, at: 3.0, until: 5.2, o: { name: 'Linh', role: 'your Vietadvisor local' } },
        { type: 'ui', name: 'bubble', screen: true, at: 3.7, until: 5.4, o: { x: .72, y: .3, text: 'Ever heard of\nthe Hà Giang Loop?', size: 46, tail: [-120, 150] }, v: { o: { x: .62, y: .36, size: 42 } } },
        { type: 'ui', name: 'bubble', screen: true, at: 6.0, o: { x: .3, y: .28, text: 'SIGN. ME. UP.', size: 64, color: C.brand, tail: [60, 160] }, v: { o: { x: .4, y: .3, size: 56 } } },
        { type: 'fn', screen: true, draw: (lt) => { const p = E.out5(inv(5.4, 5.8, lt)); if (p > 0) focusLines(W * .38, H * .45, lt, p * .8); } },
      ],
      captions: [[.2, 1.6, 'Meet *Dave*.'], [1.7, 3.2, 'Dave is in Hà Nội. Dave is… *bored*.'], [5.6, 8.2, 'Linh knows a 4-day motorbike loop that fixes that.']], shakes: [[.55, 12, .4], [5.5, 16, .5]], sfx: [[.1, 'fall'], [.55, 'thud'], [2.6, 'slide'], [5.5, 'gasp']] },
    { id: 'route', dur: 9.6, transition: { type: 'whip', dur: .45 },
      layers: [
        { type: 'map', view: [{ lon: 105.36, lat: 23.09, k: 1100 }, { t: 9.6, k: 1180 }], v: { view: [{ lon: 105.2, lat: 23.11, k: 900 }, { t: 9.6, k: 960 }] }, routeP: [{ p: 0 }, { t: .6, p: 0 }, { t: 6.4, p: 1, ease: 'sine' }], o: { route: HG_ROUTE, cities: ROUTE_STOPS, cityAt: { hagiang: .3, quanba: 1.2, yenminh: 1.9, lungcu: 3.0, dongvan: 3.6, mapileng: 4.0, meovac: 4.4, dugia: 5.4 }, labels: 0, vnColor: '#bcd98a', sea: '#e3cf9c', underlay: (P, o) => terrainDoodles(P, o) } },
        { type: 'fn', draw: (lt, S) => { const o = S._mapO; if (!o || !o._head || lt < .5) return; const u = U(); ctx.save(); ctx.translate(o._head[0], o._head[1] - 4 * u); if (Math.cos(o._dir) < 0) ctx.scale(-1, 1); drawProp('moto', 0, 0, .28 * u, { spin: lt * 20, shadow: false }, lt); person(-12 * u, -10 * u, .26 * u, CHAR.dave.spec, { t: lt, pose: 'ride', expr: 'grin', headwear: { type: 'helmet', color: C.yel }, noShadow: 1 }); ctx.restore(); } },
        { type: 'ui', name: 'stat', screen: true, at: 1.0, o: { x: .82, y: .22, big: '≈ 300–350 km', small: 'of mountain road', emoji: '🛣️' }, v: { until: 3.4, o: { x: .5, y: .2, s: .9 } } },
        { type: 'ui', name: 'stat', screen: true, at: 2.2, o: { x: .82, y: .4, big: '3–4 DAYS', small: '4 is the comfortable pace', emoji: '📅' }, v: { at: 3.6, until: 6.0, o: { x: .5, y: .2, s: .9 } } },
        { type: 'ui', name: 'stat', screen: true, at: 3.4, o: { x: .82, y: .58, big: '∞ HAIRPINS', small: 'give or take', emoji: '🌀' }, v: { at: 6.2, o: { x: .5, y: .2, s: .9 } } },
      ],
      captions: [[.3, 3.4, 'The loop: roughly *300–350 km* of mountain road out of Hà Giang city.'], [3.5, 6.6, 'Most people ride it in *3–4 days*. Four is the comfortable pace.'], [6.8, 9.4, 'Rule zero: don’t do it in 2 days.']], sfx: [[.6, 'pen_draw'], [1.0, 'pop'], [2.2, 'pop'], [3.4, 'pop']] },
    { id: 'how', dur: 11.6, transition: { type: 'slide', dur: .5 }, place: 'studio',
      layers: [
        { type: 'fn', draw: (lt) => { const u = U(); if (ISV()) { rr(0, H * .5 - 4 * u, W, 8 * u, 0, C.ink, 0); } else rr(W / 2 - 4 * u, 0, 8 * u, H, 0, C.ink, 0); } },
        { type: 'text', text: 'RIDE IT YOURSELF', x: .25, y: .1, size: 64, fill: '#fff', in: { type: 'pop', at: .2 }, v: { x: .5, y: .13, size: 58 } },
        { type: 'text', text: 'EASY RIDER', x: .75, y: .1, size: 64, fill: C.yel, in: { type: 'pop', at: .5 }, v: { x: .5, y: .57, size: 58 } },
        { type: 'char', id: 'dave', ride: 1, x: .27, y: .9, s: 1.1, expr: 'nervous', headwear: { type: 'helmet', color: C.yel }, speed: .4, keys: [{ t: 0, dx: 0 }], v: { x: .3, y: .45, s: .62 } },
        { type: 'char', id: 'easyrider', ride: 1, x: .76, y: .9, s: 1.1, expr: 'cool', speed: .6, v: { x: .34, y: .93, s: .66 } },
        { type: 'char', id: 'dave', x: .69, y: .9, s: .7, pose: 'thumbs', expr: 'joy', dy: -182, headwear: { type: 'helmet', color: C.yel }, noShadow: 1, v: { x: .27, y: .93, dy: -111, s: .42 } },
        { type: 'ui', name: 'price', screen: true, at: 1.4, o: { x: .25, y: .35, item: 'semi-auto bike, per day', vnd: '250k–400k ₫', usd: '$10–16', checked: 'Oct 2026', s: .85 }, v: { o: { x: .68, y: .27, s: .62 } } },
        { type: 'ui', name: 'price', screen: true, at: 2.4, o: { x: .75, y: .35, item: 'driver + bike, all-in, per day', vnd: '2–3.2M ₫', usd: '$80–125', checked: 'Oct 2026', s: .85 }, v: { o: { x: .68, y: .7, s: .62 } } },
        { type: 'ui', name: 'stamp', screen: true, at: 6.2, o: { x: .25, y: .5, text: 'NEED: 1968 IDP + A', size: 44, rot: -.12, color: C.red }, v: { o: { x: .5, y: .37 } } },
        { type: 'ui', name: 'punch', screen: true, at: 8.6, o: { x: .25, y: .6, text: 'FINE: 4–5M ₫', size: 64, fill: '#ff8a6a', life: 3 }, v: { o: { x: .5, y: .42, size: 56 } } },
      ],
      capY: { v: .5 }, captions: [[.3, 3.3, 'Two ways to ride it. *Rent a bike* yourself — or hire an *Easy Rider*.'], [3.4, 6.1, 'Easy Riders are local pros who drive while you just… look at things.'], [6.2, 8.5, 'Riding yourself? You need a *1968 IDP* with a motorbike endorsement.'], [8.6, 11.4, 'No valid licence = [4–5 million ₫] fine and the bike gets impounded.']], sfx: [[1.4, 'ding'], [2.4, 'ding'], [6.2, 'stamp'], [8.6, 'buzzer']] },
    { id: 'heaven', dur: 8.0, transition: { type: 'iris', dur: .6 }, place: 'hagiang', scroll: [{ t: 0, v: 0 }, { t: 2.6, v: 2300 }, { t: 4.0, v: 2700, ease: 'out' }, { t: 8, v: 2760 }],
      layers: [
        { type: 'fn', draw: heavenGate },
        { type: 'char', id: 'dave', ride: 1, x: .36, y: 'ground', dy: 40, s: 1.1, expr: 'grin', headwear: { type: 'helmet', color: C.yel }, keys: [{ t: 3.2, expr: 'starstruck' }], speed: 1, v: { x: .32, s: .9 } },
        { type: 'fn', screen: true, draw: (lt) => { const sp = lt < 2.6 ? 1 : 1 - E.out(inv(2.6, 3.8, lt)); if (sp > .1) speedLines(lt, sp * .6); } },
      ],
      captions: [[.2, 2.5, 'Day 1: north through Quản Bạ to *Heaven’s Gate*.'], [2.7, 5.2, 'The name is… not an exaggeration.'], [5.3, 7.8, 'Altitude: high. Dave’s jaw: *on the floor*.']], sfx: [[0, 'engine_loop'], [2.6, 'brake'], [3.1, 'choir']] },
    { id: 'mapileng', dur: 9.4, transition: { type: 'whip', dur: .45 }, render: renderCanyon,
      captions: [[.2, 2.4, 'Day 2: *Mã Pì Lèng Pass* — the stretch everyone comes for.'], [2.5, 5.8, 'The Nho Quế River is down there. *Waaaay* down there.'], [7.0, 9.2, 'Pull over to look. Never look while riding.']], shakes: [[7.0, 6, .5]], sfx: [[1.9, 'whoosh_down'], [6.25, 'whoosh_up'], [7.0, 'gulp']] },
    { id: 'lungcu', dur: 7.4, transition: { type: 'ink', dur: .6 }, render: renderLungCu,
      captions: [[.2, 2.8, 'Detour: *Lũng Cú Flag Tower*, Vietnam’s northernmost point.'], [2.9, 5.6, 'The flag is *54 m²* — one for each of Vietnam’s *54 ethnic groups*.'], [5.7, 7.2, 'China? Right over there.']], sfx: [[3.55, 'pop_cascade'], [5.75, 'boing']] },
    { id: 'homestay', dur: 9.2, capY: { v: .3 }, transition: { type: 'iris', dur: .6 }, place: 'homestay',
      cam: [{ t: 0, x: .5, y: .5, z: 1 }, { t: 9.2, z: 1.06 }],
      layers: [
        { type: 'char', id: 'dave', x: .38, y: 'ground', dy: 60, s: 1.15, pose: 'sitHold', hold: 'trada', holdScale: .3, expr: 'happy', keys: [{ t: 2.0, pose: 'toast', hold: null }, { t: 2.5, pose: 'sitHold' }, { t: 3.4, pose: 'toast', expr: 'tipsy' }, { t: 3.9, pose: 'sitHold' }, { t: 4.6, pose: 'toast', expr: 'dizzy' }, { t: 5.1, pose: 'sitHold' }], v: { x: .3, s: 1.3 } },
        { type: 'char', id: 'hmong_grandpa', x: .64, y: 'ground', dy: 60, s: 1.15, pose: 'sitHold', flip: 1, keys: [{ t: 2.0, pose: 'toast' }, { t: 2.5, pose: 'sitHold' }, { t: 3.4, pose: 'toast' }, { t: 3.9, pose: 'sitHold' }, { t: 4.6, pose: 'toast' }, { t: 5.1, pose: 'sitHold' }], v: { x: .72, s: 1.3 } },
        { type: 'fn', draw: (lt) => { const u = U(), gy = PLACE.homestay.ground() + 60 * u; const ty = gy - 10 * u, tw = Math.min(W * .36, 640 * u); rr(W / 2 - tw, ty, tw * 2, 400 * u, 0, '#8c5c33', 7 * u); sEll(W / 2, ty, tw, 60 * u, '#a8713f', { lw: 7 * u }); drawProp('ruou_ngo', W / 2, ty + 10 * u, .55 * u, {}, lt); drawProp('pho', W / 2 - tw * .55, ty + 14 * u, .38 * u, { steam: true }, lt); drawProp('comtam', W / 2 + tw * .55, ty + 14 * u, .42 * u, {}, lt);
          for (const c of [2.0, 3.4, 4.6]) { const d = lt - c; if (d > 0 && d < .7) { const s = E.out(clamp(d / .3)); ctx.save(); ctx.globalAlpha *= 1 - clamp((d - .3) / .4); for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; sparkle(W / 2 + Math.cos(a) * 120 * s * u, H * .4 + Math.sin(a) * 120 * s * u, .8 * u, a, C.yel); } ctx.restore(); } } } },
        { type: 'ui', name: 'punch', screen: true, at: 1.4, o: { x: .5, y: .17, text: 'MỘT, HAI, BA… DZÔ!', size: 96, font: 'body', life: 1.5 }, v: { o: { y: .26, size: 74 } } },
        { type: 'ui', name: 'price', screen: true, at: 5.6, o: { x: .8, y: .3, item: 'homestay, often incl. dinner', vnd: '300k–500k ₫', usd: '$12–20', checked: 'Oct 2026', s: .8 }, v: { o: { x: .5, y: .68, s: .7 } } },
      ],
      captions: [[.2, 2.6, 'Nights: family homestays, home cooking, and *“happy water”* — corn wine.'], [2.7, 5.4, 'It’s 30–40% alcohol. Toast politely. Small cups.'], [5.5, 9.0, 'Vietnam enforces a *zero* alcohol limit. No riding until it’s fully gone.']], shakes: [[2.0, 7, .25], [3.4, 7, .25], [4.6, 7, .25]], sfx: [[2.0, 'clink'], [3.4, 'clink'], [4.6, 'clink'], [5.6, 'ding']] },
    { id: 'when', dur: 9.0, capY: { v: .62 }, transition: { type: 'paper', dur: .6 }, place: 'studio', placeOpts: { color: '#f3e6c4' },
      layers: [
        { type: 'char', id: 'linh', x: .18, y: 'ground', dy: 30, s: 1.4, pose: 'present', expr: 'happy', in: { type: 'up', at: 0 }, keys: [{ t: 6.4, pose: 'point', expr: 'determined' }], v: { hide: 1 } },
        { type: 'text', text: 'WHEN TO GO', x: .62, y: .14, size: 96, fill: C.yel, in: { type: 'zoom', at: .2 }, v: { x: .5, y: .17, size: 86 } },
        { type: 'ui', name: 'checklist', screen: true, at: 1.0, o: { x: .42, y: .3, step: 1.3, s: .95, items: [{ text: 'Sep — green rice terraces' }, { text: 'Oct–Nov — buckwheat flowers (busiest)' }, { text: 'Mar–Apr — plum & pear blossoms' }, { text: 'Jun–Aug — landslide season', no: 1 }] }, v: { o: { x: .1, y: .3, s: 1, step: 1.3 } } },
      ],
      captions: [[.3, 3.3, 'Best windows: *September* to *November*, and *March–April*.'], [3.4, 6.2, 'October–November is the most beautiful — and the most crowded.'], [6.3, 8.8, 'June to August is landslide season. Skip it.']], sfx: [[1, 'tick'], [2.3, 'tick'], [3.6, 'tick'], [4.9, 'buzzer']] },
    { id: 'finale', dur: 7.6, transition: { type: 'flash', dur: .5 }, place: 'hagiang', placeOpts: { time: 'sunset' }, scroll: [{ t: 0, v: 0 }, { t: 7.6, v: 300 }],
      layers: [
        { type: 'particles', name: 'sparkles', a: .8 },
        { type: 'char', id: 'dave', x: .36, y: 'ground', s: 1.3, pose: 'thumbs', expr: 'cool', spec: { beard: { color: HAIR.brown, a: .6 } }, in: { type: 'up', at: 0, dur: .6 }, wind: 1, keys: [{ t: 2.2, x: .26 }], v: { x: .5, keys: [{ t: 2.2, x: .5 }], s: .85 } },
        { type: 'char', id: 'linh', x: .54, y: 'ground', s: 1.2, pose: 'cheer', expr: 'joy', in: { type: 'slideR', at: .6, dur: .5 }, keys: [{ t: 2.2, x: .44 }], v: { hide: 1 } },
        { type: 'ui', name: 'title', screen: true, at: 2.5, o: { text: ['HÀ GIANG', 'LOOP'], x: .73, y: .32, size: 130, rot: -.03, at: 2.5 }, v: { o: { x: .5, y: .22, size: 120 } } },
        { type: 'text', text: '4 days · ≈300–350 km · 0 regrets', x: .73, y: .56, size: 46, font: 'body', in: { type: 'pop', at: 3.0 }, v: { x: .5, y: .335, size: 40 } },
        { type: 'ui', name: 'cta', screen: true, at: 3.5, o: { x: .73, y: .7, top: 'Full route, prices & safety guide', text: 'vietadvisor.travel', s: .9 }, v: { o: { x: .5, y: .41, s: .75 } } },
      ],
      captions: [[.2, 2.2, 'Dave is no longer bored.']], sfx: [[2.5, 'impact'], [3.5, 'ding']] },
    { id: 'end', dur: 2.0, transition: { type: 'brand', dur: .6 }, layers: [{ type: 'ui', name: 'endFrame', screen: true, at: 0, always: 1, o: {} }] },
  ]
};
