/* =====================================================================
   SIGNATURE MOMENTS — hand-directed cinematic set pieces, one line each:
     # moment kind=pass place=hagiang hero=dave time=sunset
   Every moment has its own camera choreography, light, depth layers and
   sound. Use 1–2 per video at the emotional peaks (see film-language §11).
   kinds: pass lanterns downpour seasons steam train cave sunrise fireworks
          crossing window mapdive split
   ===================================================================== */
'use strict';
const MOMENTS = {};
const SMs = x => x * x * (3 - 2 * x);
// ---------- shared painterly helpers
function skyStops(stops, y0 = 0, y1 = H) { const g = ctx.createLinearGradient(0, y0, 0, y1); stops.forEach((c, i) => g.addColorStop(i / (stops.length - 1), c)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
function ridge(seed, y, amp, col, o = {}) { const u = U(), sc = (o.scroll || 0) * (o.f ?? 1), wl = (o.wl || 420) * u, step = 6 * u;
  ctx.beginPath(); ctx.moveTo(-10, H + 10); for (let x = -10; x <= W + 12; x += step) { const n = fbm((x + sc) / wl + seed * 13.1, 4) * (o.sharp ? 1.6 : 1); const yy = y - amp * (.55 + n * .9) - (o.peak ? Math.max(0, Math.sin((x + sc) / wl * 1.7 + seed)) * amp * .5 : 0); ctx.lineTo(x, yy); } ctx.lineTo(W + 12, H + 10); ctx.closePath();
  const g = ctx.createLinearGradient(0, y - amp * 1.6, 0, y + (o.depth || amp)); g.addColorStop(0, o.top || shade(col, .1)); g.addColorStop(1, o.bottom || shade(col, -.12)); ctx.fillStyle = g; ctx.fill();
  if (o.ink) { ctx.lineWidth = o.ink * u; ctx.strokeStyle = C.ink; ctx.lineJoin = 'round'; ctx.stroke(); } }
function sunDisk(x, y, r, col = '#fff2c4', halo = '#ffb36a') { glow(x, y, r * 7, halo, .5); glow(x, y, r * 2.4, col, .8); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fillStyle = col; ctx.fill(); }
function cloudPuff(x, y, s, col = '#ffffff', a = .9) { ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = col; ctx.beginPath(); for (const [dx, dy, r] of [[-1.1, .1, .55], [-.5, -.25, .7], [.2, -.35, .8], [.9, -.05, .6], [0, .15, .7]]) { ctx.moveTo(x + dx * s + r * s, y + dy * s); ctx.arc(x + dx * s, y + dy * s, r * s, 0, TAU); } ctx.fill(); ctx.globalAlpha *= .35; ctx.fillStyle = 'rgba(255,255,255,.9)'; ctx.beginPath(); ctx.ellipse(x - .1 * s, y - .45 * s, .7 * s, .22 * s, 0, 0, TAU); ctx.fill(); ctx.restore(); }
function birds(t, x0, y0, n = 5, s = 1) { const u = U(); ctx.save(); ctx.strokeStyle = 'rgba(30,24,30,.75)'; ctx.lineWidth = 3 * u * s; ctx.lineCap = 'round'; for (let i = 0; i < n; i++) { const x = x0 + i * 46 * u * s + t * 60 * u + Math.sin(i * 3) * 30 * u, y = y0 + Math.sin(i * 1.7) * 26 * u + Math.sin(t * 2 + i) * 6 * u, f = Math.sin(t * 9 + i * 1.3) * 9 * u * s; ctx.beginPath(); ctx.moveTo(x - 14 * u * s, y + f); ctx.quadraticCurveTo(x - 6 * u * s, y - 4 * u * s, x, y); ctx.quadraticCurveTo(x + 6 * u * s, y - 4 * u * s, x + 14 * u * s, y + f); ctx.stroke(); } ctx.restore(); }
function zoomAt(cx, cy, z, fn) { ctx.save(); ctx.translate(cx, cy); ctx.scale(z, z); ctx.translate(-cx, -cy); fn(); ctx.restore(); }
function grassFg(t, y, col = '#1d2a1c', blur = 6) { const u = U(); ctx.save(); if (blur) ctx.filter = `blur(${blur * u}px)`; ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-20, H + 20); for (let i = 0; i <= 60; i++) { const x = i / 60 * (W + 40) - 20, h = (60 + hash(i * 3.1) * 150) * u, sw = Math.sin(t * 1.6 + i * .7) * 10 * u; ctx.lineTo(x - 8 * u, y); ctx.lineTo(x + sw, y - h); ctx.lineTo(x + 8 * u, y); } ctx.lineTo(W + 20, H + 20); ctx.closePath(); ctx.fill(); ctx.restore(); }
function rider(x, y, s, id, t, o = {}) { const sp = (CHAR[id] || CHAR.dave).spec; ctx.save(); if (o.flip) { ctx.translate(x, 0); ctx.scale(-1, 1); ctx.translate(-x, 0); } drawProp('moto', x, y, s, { spin: t * 18, color: o.color || '#d9443a' }, t); person(x - 40 * s, y - 36 * s, s * .92, sp, { t, pose: 'ride', expr: o.expr || 'joy', headwear: { type: 'helmet', color: o.helmet || C.yel }, noShadow: 1, look: [1, 0] }); ctx.restore(); }
function reflectStreak(x, y, w, col, t, a = .6) { const u = U(); ctx.save(); ctx.globalCompositeOperation = 'screen'; for (let i = 0; i < 9; i++) { const yy = y + i * 14 * u, ww = w * (1 - i / 11) * (.7 + .3 * Math.sin(t * 3 + i * 1.9)), xx = x + Math.sin(t * 2.2 + i) * 6 * u; ctx.globalAlpha = a * (1 - i / 9); ctx.fillStyle = col; ctx.fillRect(xx - ww / 2, yy, ww, 5 * u); } ctx.restore(); }
function mchr(id, d = "dave") { return CHAR[id] ? id : d; }

// ---------- 1. PASS — rider climbs a hairpin road into a sunset range (Mã Pì Lèng, Hải Vân, Ô Quy Hồ)
MOMENTS.pass = { capY: .3, dur: 7, sfx: [[0, 'engine_loop'], [3.2, 'moto_pass'], [.1, 'whoosh_up']], render(lt, D, o) {
  const u = U(), p = lt / D, tm = o.time || 'sunset', night = tm === 'night';
  const crane = SMs(clamp(p * 1.2)); const camY = (1 - crane) * 260 * u; // crane up: start low, rise to reveal the range
  const S = { sunset: ['#3b3a78', '#a5577e', '#ff8f5e', '#ffd18a'], day: ['#4aa3e0', '#9fd4f0', '#e8f4ef', '#f9f0d8'], dawn: ['#6d86c9', '#e6a7b4', '#ffd6b0', '#fff2d8'], night: ['#070d24', '#142251', '#2d3f78', '#4a5d93'] }[tm] || [];
  skyStops(S, 0, H * .62);
  const sx = W * .68, sy = H * .36 + camY * .2; if (!night) { sunDisk(sx, sy, 54 * u, tm === 'day' ? '#fffbe8' : '#fff0c0', tm === 'day' ? '#fff4c8' : '#ff9a5a'); godRays(sx, sy, lt, { a: .14, n: 22, dir: Math.PI / 2, spread: .14, w: .025 }); } else { ctx.beginPath(); ctx.arc(sx, sy, 40 * u, 0, TAU); ctx.fillStyle = '#f4f0dc'; ctx.fill(); glow(sx, sy, 200 * u, '#cfd8ff', .35); }
  for (let i = 0; i < 6; i++) cloudPuff(((i * 380 * u + lt * 18 * u) % (W + 400 * u)) - 200 * u, H * (.12 + hash(i) * .2) + camY * .1, (50 + hash(i + 4) * 50) * u, tm === 'sunset' ? '#ffc6a0' : '#ffffff', .55);
  const sc = lt * 40 * u, cols = night ? ['#3a4a7a', '#2f3e68', '#253256', '#1c2744', '#141c33'] : tm === 'day' ? ['#a8c9d6', '#86b2b8', '#5f9a8c', '#3f7e5e', '#2c5f3f'] : ['#b78aa8', '#8f6a92', '#6a527c', '#463e63', '#2a2742'];
  for (let k = 0; k < 5; k++) { const y = H * (.5 + k * .085) + camY * (.35 + k * .2); ridge(k + 3, y, (190 - k * 18) * u, cols[k], { scroll: sc, f: .15 + k * .22, wl: 360 - k * 30, peak: k < 3, sharp: k === 1, ink: k > 2 ? 3 : 0 }); if (k < 4) hazeBand(y - 30 * u, 70 * u, night ? '#8090c0' : tm === 'day' ? '#ffffff' : '#ffb894', .28 - k * .05); }
  // hairpin road on the nearest slope: polyline far (top) → near (bottom)
  const base = H * .86 + camY * 1.1; const pts = []; for (let i = 0; i <= 80; i++) { const q = i / 80, d = q * q; pts.push([W * .5 + Math.sin(q * 9.4) * W * (.08 + .34 * d), base - (1 - d) * H * .3 + d * d * H * .16, 6 + 70 * d]); }
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; for (const [w, c] of [[1.25, C.ink], [1, night ? '#5a5f70' : '#8a8378'], [.06, '#f1e6c6']]) { for (let i = 1; i < pts.length; i++) { ctx.beginPath(); ctx.moveTo(pts[i - 1][0], pts[i - 1][1]); ctx.lineTo(pts[i][0], pts[i][1]); ctx.lineWidth = pts[i][2] * u * w + (w === 1.25 ? 2 * u : 0); ctx.strokeStyle = c; if (w < .1) ctx.setLineDash([14 * u, 18 * u]); ctx.stroke(); ctx.setLineDash([]); } } ctx.restore();
  // rider rides away up the road (near → far): position along pts reversed
  const q = clamp(.74 - SMs(clamp((lt - .2) / (D - .4))) * .66), i = Math.round(q * 80), [rx, ry, rw] = pts[i], nxt = pts[Math.max(0, i - 1)];
  const bs = rw / 70 * .8 * u; ctx.save(); const dir = nxt[0] < rx ? -1 : 1; rider(rx, ry - 4 * u, bs, mchr(o.hero), lt, { flip: dir < 0, helmet: o.helmet }); exhaust(rx - dir * 60 * bs, ry - 30 * bs, bs * 1.5, lt, 1); ctx.restore();
  if (!night) birds(lt, W * .1, H * .22 + camY * .1, 6, 1);
  grassFg(lt, H + 30 * u + camY * 1.6, night ? '#0b1020' : '#1f1d2a', 7);
} };

// ---------- 2. LANTERNS — flower lanterns released onto a night river (Hội An, Thu Bồn)
MOMENTS.lanterns = { dur: 7.5, sfx: [[.2, 'sparkle'], [2.4, 'choir']], render(lt, D, o) {
  const u = U(), p = lt / D, tilt = SMs(clamp(p * 1.4)) * 320 * u; // tilt down from the lantern strings to the water
  ctx.save(); ctx.translate(0, -tilt);
  skyStops(['#050a1e', '#0d1840', '#1d2a5e', '#2f3a6a'], 0, H * .7);
  for (let i = 0; i < 70; i++) { ctx.fillStyle = `rgba(255,255,240,${.3 + hash(i) * .6 * (.6 + .4 * Math.sin(lt * 3 + i))})`; ctx.fillRect(hash(i * 3) * W, hash(i * 7) * H * .4, 2.5 * u, 2.5 * u); }
  ctx.beginPath(); ctx.arc(W * .78, H * .14, 46 * u, 0, TAU); ctx.fillStyle = '#f5efd6'; ctx.fill(); glow(W * .78, H * .14, 260 * u, '#c9d4ff', .35);
  // strings of lanterns across the top
  for (let s = 0; s < 3; s++) { const y0 = H * (.08 + s * .09); ctx.beginPath(); ctx.moveTo(-20, y0); ctx.quadraticCurveTo(W / 2, y0 + 110 * u, W + 20, y0 - 10 * u); ctx.strokeStyle = '#1a1420'; ctx.lineWidth = 3 * u; ctx.stroke();
    for (let k = 1; k < 9; k++) { const q = k / 9, x = q * W, y = (1 - q) * (1 - q) * y0 + 2 * (1 - q) * q * (y0 + 110 * u) + q * q * (y0 - 10 * u); const col = pick(['#ff5a3a', '#ffb03a', '#ff3a6a', '#ffd84a', '#5ad0ff'], k + s); glow(x, y + 30 * u, 70 * u, col, .5); drawProp('lantern', x, y + 4 * u, (.32 - s * .05) * u, { color: col, glow: 1 }, lt + k); } }
  // old town silhouette with warm windows
  const hy = H * .58; ctx.fillStyle = '#120f1e'; for (let k = 0; k < 9; k++) { const x = k * W / 8 - 40 * u, w = W / 8 + 30 * u, h = (150 + hash(k) * 120) * u; ctx.fillRect(x, hy - h, w, h); ctx.beginPath(); ctx.moveTo(x - 20 * u, hy - h); ctx.lineTo(x + w / 2, hy - h - 60 * u); ctx.lineTo(x + w + 20 * u, hy - h); ctx.fill();
    for (let j = 0; j < 3; j++) { const wx = x + w * (.2 + j * .3), wy = hy - h * .55; ctx.fillStyle = '#ffb860'; ctx.fillRect(wx, wy, 22 * u, 30 * u); glow(wx + 11 * u, wy + 15 * u, 50 * u, '#ffa040', .4); ctx.fillStyle = '#120f1e'; } }
  // river
  const g = ctx.createLinearGradient(0, hy, 0, H + tilt); g.addColorStop(0, '#1b2350'); g.addColorStop(1, '#070b20'); ctx.fillStyle = g; ctx.fillRect(0, hy, W, H + tilt);
  for (let k = 0; k < 9; k++) reflectStreak(k * W / 8 - 10 * u, hy + 12 * u, 26 * u, '#ff9a40', lt + k, .35);
  // floating lanterns drifting downstream (perspective: farther = higher, smaller)
  const N = 22; for (let i = 0; i < N; i++) { const d = .15 + hash(i * 5.3) * .85, y = hy + 30 * u + d * d * (H + tilt - hy - 120 * u), x = ((hash(i * 2.1) * W * 1.4 + lt * (14 + 30 * d) * u) % (W * 1.4)) - W * .2, s = (.4 + d * 1.35) * u;
    if (i === 0) continue; floatLantern(x, y + Math.sin(lt * 1.5 + i) * 4 * u, s, lt + i, pick(['#ff6a4a', '#ffb84a', '#ff4a8a', '#ffe06a'], i)); }
  // the hero's lantern: set down at bottom centre, drifts out
  const rel = clamp((lt - 1.2) / 1.2), drift = clamp((lt - 2.4) / (D - 2.4));
  const hx = W * .5 + drift * W * .18, hy2 = H + tilt - 230 * u - drift * 260 * u, hs = (2.1 - drift * .9) * u; floatLantern(hx, hy2 - (1 - SMs(rel)) * 120 * u, hs, lt, '#ff5a3a');
  ctx.restore();
  // hands in the foreground silhouette (over-the-shoulder feel)
  if (false) { const a = 0; ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = '#0a0812'; for (const sd of [-1, 1]) { ctx.beginPath(); ctx.ellipse(W * .5 + sd * 110 * u, H - 120 * u + (1 - SMs(rel)) * -40 * u, 70 * u, 130 * u, sd * .5, 0, TAU); ctx.fill(); } ctx.restore(); }
} };
function floatLantern(x, y, s, t, col) { const u = U(); glow(x, y - 20 * s, 150 * s, col, .55); reflectStreak(x, y + 16 * s, 70 * s, col, t, .5);
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.lineWidth = 4; ctx.strokeStyle = '#2a1410';
  ctx.beginPath(); ctx.ellipse(0, 6, 62, 16, 0, 0, TAU); ctx.fillStyle = '#c9a36a'; ctx.fill(); ctx.stroke();
  for (let k = -2; k <= 2; k++) { ctx.beginPath(); ctx.moveTo(k * 22 - 16, 2); ctx.quadraticCurveTo(k * 24, -60 - Math.abs(k) * -10, k * 22 + 16, 2); ctx.closePath(); ctx.fillStyle = shade(col, .15 - Math.abs(k) * .05); ctx.fill(); ctx.stroke(); }
  const fl = 1 + Math.sin(t * 14) * .12; ctx.beginPath(); ctx.ellipse(0, -30, 7 * fl, 14 * fl, 0, 0, TAU); ctx.fillStyle = '#fff4b0'; ctx.fill(); ctx.restore(); glow(x, y - 30 * s, 40 * s, '#fff0a0', .8); }

// ---------- 3. DOWNPOUR — the sky turns, thunder, rain sweeps the street, people run
MOMENTS.downpour = { capY: .3, dur: 6.5, sfx: [[1.7, 'thunder'], [.0, 'wind'], [2.2, 'rain_burst']], render(lt, D, o) {
  const u = U(), place = placeOr(o.place, 'oldquarter'), P = PLACE[place]; const dark = SMs(clamp(lt / 1.6)), rain = SMs(clamp((lt - 1.9) / 1.0));
  const z = 1.02 + lt / D * .07; zoomAt(W / 2, H * .6, z, () => { const tg = LINT.tag; LINT.tag = 'bg'; P.draw(lt * 3, { t: lt * 3, time: 'day' }); LINT.tag = tg; });
  ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = `rgba(70,85,120,${dark * .62})`; ctx.fillRect(0, 0, W, H); ctx.restore();
  const g = ctx.createLinearGradient(0, 0, 0, H * .45); g.addColorStop(0, `rgba(20,24,40,${dark * .92})`); g.addColorStop(1, 'rgba(20,24,40,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H * .45);
  const gy = P.ground(); // people: stroll, then run for cover with umbrellas popping open
  const cast = String(o.cast || 'linh,kenji,cophovn,sofia').split(',').map(s => mchr(s.trim()));
  cast.forEach((id, i) => { const dir = i % 2 ? -1 : 1, run = clamp((lt - 2.0 - i * .15) / .4), x0 = W * (.2 + i * .2), x = x0 + dir * (lt * 30 * u + SMs(clamp((lt - 2) / 2.6)) * W * .95 * (i % 3 ? 1 : .6)); const s = (.62 + (i % 2) * .08) * u, y = gy + (i % 2 ? 26 : 4) * u;
    const umb = i % 2 === 0 && lt > 2.3; person(x, y, s, CHAR[id].spec, { t: lt + i, pose: umb ? 'holdUp' : run > .5 ? 'run' : 'walk', expr: run > .2 ? 'surprised' : 'neutral', flip: dir < 0, hold: umb ? 'umbrella' : undefined, holdScale: .6, holdOpts: { open: 1 } }); });
  const fl = lt > 1.7 && lt < 2.0 ? (1 - Math.abs(lt - 1.78) / .12) : lt > 2.05 && lt < 2.15 ? .5 : 0; if (fl > 0) { ctx.fillStyle = `rgba(235,240,255,${clamp(fl) * .85})`; ctx.fillRect(0, 0, W, H); ctx.save(); ctx.strokeStyle = `rgba(255,255,255,${clamp(fl)})`; ctx.lineWidth = 5 * u; ctx.beginPath(); let bx = W * .7, by = 0; ctx.moveTo(bx, by); for (let k = 0; k < 8; k++) { bx += (hash(k * 9) - .5) * 120 * u; by += H * .05; ctx.lineTo(bx, by); } ctx.stroke(); ctx.restore(); }
  if (rain > 0) { ctx.save(); ctx.globalAlpha = rain; drawWeather('rain', lt, P); ctx.globalAlpha = rain * .5; drawWeather('rain', lt + 3.3, P); ctx.restore(); hazeBand(gy - 200 * u, 220 * u, '#c8d2e6', .25 * rain); }
} };

// ---------- 4. SEASONS — terraced valley turns from green to gold as the sun arcs over (Mù Cang Chải, Sa Pa)
MOMENTS.seasons = { capY: .3, dur: 7, sfx: [[0, 'whoosh_up'], [3.4, 'sparkle']], render(lt, D, o) {
  const u = U(), p = SMs(clamp((lt - .6) / (D - 1.6))); const labels = String(o.labels || 'JUNE|SEPTEMBER').split('|');
  skyStops([mix('#5aa8e0', '#6f8fd0', p), mix('#bfe2f2', '#ffcf94', p), mix('#fff4dc', '#ffe9c4', p)], 0, H * .5);
  const ang = Math.PI * (1.1 - p * .8), sx = W * .5 + Math.cos(ang) * W * .55, sy = H * .42 - Math.sin(ang) * H * .3; sunDisk(sx, sy, 46 * u, '#fff6d6', p > .5 ? '#ffa860' : '#fff2c0');
  for (let i = 0; i < 5; i++) cloudPuff(((i * 300 * u + lt * 70 * u) % (W + 400 * u)) - 200 * u, H * (.1 + hash(i) * .16), (40 + hash(i * 2) * 40) * u, '#ffffff', .7);
  ridge(2, H * .5, 170 * u, mix('#86a9c0', '#b49aa0', p), { wl: 300, peak: 1 }); hazeBand(H * .46, 60 * u, '#ffffff', .4);
  ridge(5, H * .58, 150 * u, mix('#5e9070', '#8a8458', p), { wl: 340 }); hazeBand(H * .55, 50 * u, '#ffffff', .25);
  // terraces: nested contour bands; colour sweeps left → right with the season
  const cx = W * .5, top = H * .55, n = 16, z = 1 + lt / D * .08; zoomAt(W / 2, H * .75, z, () => {
    for (let k = 0; k < n; k++) { const q = k / n, y = top + q * H * .5, w = W * (.5 + q * .9); const sweep = clamp(p * 1.7 - (1 - q) * .55 - .05);
      const green = shade('#7fc25a', -q * .25 + (k % 2) * .05), gold = shade('#e6b93c', -q * .2 + (k % 2) * .05);
      ctx.beginPath(); const steps = 50; for (let i = 0; i <= steps; i++) { const a = i / steps, x = cx - w / 2 + a * w, yy = y - Math.sin(a * Math.PI) * 60 * u * (1 - q * .4) + Math.sin(a * 7 + k) * 8 * u; i ? ctx.lineTo(x, yy) : ctx.moveTo(x, yy); }
      ctx.lineTo(cx + w / 2, H + 50); ctx.lineTo(cx - w / 2, H + 50); ctx.closePath();
      const gr = ctx.createLinearGradient(cx - w / 2, 0, cx + w / 2, 0); const e = clamp(sweep); gr.addColorStop(0, e > 0 ? gold : green); gr.addColorStop(clamp(e - .07), e > 0 ? gold : green); gr.addColorStop(clamp(e + .07), green); gr.addColorStop(1, green); ctx.fillStyle = gr; ctx.fill();
      ctx.lineWidth = 3 * u; ctx.strokeStyle = shade(e > .5 ? '#a8862a' : '#4f8a3a', -.1); ctx.stroke(); }
    stiltHouse(W * .2, top + H * .2, .55 * u); });
  // month card that flips at the midpoint
  const lab = p < .5 ? labels[0] : (labels[1] || labels[0]); const flip = Math.abs(Math.cos(clamp((p - .5) * 8 + .5) * Math.PI)); T(lab, W / 2, H * .17, { size: 74 * u, fill: '#fff', lw: 14 * u, alpha: lt > .4 ? 1 : 0, scaleY: p > .4 && p < .6 ? flip : 1 });
} };

// ---------- 5. STEAM — the food hero shot: ingredients drop into the bowl, steam curls, slow push
MOMENTS.steam = { capY: .3, dur: 6, sfx: [[.9, 'splash'], [1.5, 'splash'], [2.1, 'clink'], [0, 'sizzle']], render(lt, D, o) {
  const u = U(), dish = PROP[o.dish] ? o.dish : 'pho', z = 1 + SMs(clamp(lt / D)) * .3, cy = H * (.5 + SMs(clamp(lt / D)) * .08);
  const bg = ctx.createRadialGradient(W / 2, H * .45, 0, W / 2, H * .45, H * .8); bg.addColorStop(0, '#5a3a24'); bg.addColorStop(1, '#140c08'); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 14; i++) glow(hash(i) * W + Math.sin(lt * .5 + i) * 60 * u - lt * 25 * u * (hash(i * 7) - .5), hash(i * 3) * H * .5 + Math.cos(lt * .4 + i) * 20 * u, (40 + hash(i * 5) * 90) * u, pick(['#ffb050', '#ff8a40', '#ffd890'], i), .22 + .1 * Math.sin(lt + i));
  ctx.save(); ctx.translate(W / 2, H / 2); ctx.rotate(Math.sin(lt * .6) * .012); ctx.translate(-W / 2, -H / 2);
  zoomAt(W / 2, cy, z, () => {
    ctx.save(); ctx.fillStyle = '#6b4226'; ctx.fillRect(0, H * .62, W, H); ctx.strokeStyle = 'rgba(30,16,8,.4)'; ctx.lineWidth = 3 * u; for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.moveTo(0, H * .64 + i * 40 * u); ctx.bezierCurveTo(W * .3, H * .64 + i * 40 * u + 10 * u, W * .6, H * .64 + i * 40 * u - 8 * u, W, H * .64 + i * 40 * u); ctx.stroke(); } ctx.restore();
    shadowBlob(W / 2, H * .68, 420 * u, .45); drawProp(dish, W / 2, H * .68, Math.min(3.4 * u, W * .95 / (PROP[dish].w || 300)), {}, lt);
    // ingredients falling in
    const drops = [[.7, '#4fa64a', 'leaf'], [.85, '#e23a2a', 'chili'], [1.0, '#4fa64a', 'leaf'], [1.25, '#f0e6a0', 'lime'], [1.4, '#4fa64a', 'leaf'], [1.6, '#e23a2a', 'chili']];
    drops.forEach(([t0, col, k], i) => { const tt = lt - t0; if (tt < -0.6) return; const fall = clamp((tt + .6) / .6), x = W / 2 + (hash(i * 4) - .5) * 260 * u, y = lerp(-80 * u, H * .58, fall * fall); if (fall >= 1) { if (tt < .35) { ctx.save(); ctx.globalAlpha = 1 - tt / .35; for (let j = 0; j < 6; j++) { const a = -Math.PI * (.15 + j * .14); ctx.beginPath(); ctx.arc(x + Math.cos(a) * tt * 220 * u, H * .58 + Math.sin(a) * tt * 200 * u + tt * tt * 600 * u, 7 * u, 0, TAU); ctx.fillStyle = '#e8c890'; ctx.fill(); } ctx.restore(); } return; }
      ctx.save(); ctx.translate(x, y); ctx.rotate(tt * 6 + i); ctx.fillStyle = col; ctx.strokeStyle = C.ink; ctx.lineWidth = 3 * u; ctx.beginPath(); if (k === 'leaf') ctx.ellipse(0, 0, 34 * u, 14 * u, 0, 0, TAU); else if (k === 'chili') { ctx.arc(0, 0, 14 * u, 0, TAU); } else { ctx.arc(0, 0, 26 * u, 0, Math.PI); ctx.closePath(); } ctx.fill(); ctx.stroke(); ctx.restore(); });
    // steam
    ctx.save(); ctx.globalCompositeOperation = 'screen'; for (let i = 0; i < 7; i++) { const ph = (lt * .35 + i / 7) % 1, x0 = W / 2 + (i - 3) * 50 * u; ctx.beginPath(); for (let k = 0; k <= 20; k++) { const q = k / 20, yy = H * .55 - q * H * .45 * (.4 + ph * .8), xx = x0 + Math.sin(q * 6 + lt * 1.5 + i) * 40 * u * q; k ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.lineWidth = (22 + i % 3 * 8) * u; ctx.lineCap = 'round'; ctx.strokeStyle = `rgba(255,240,220,${.16 * Math.sin(ph * Math.PI)})`; ctx.filter = `blur(${8 * u}px)`; ctx.stroke(); } ctx.restore();
  });
  ctx.restore();
  // rim light sweep
  ctx.save(); ctx.globalCompositeOperation = 'screen'; const sw = (lt / D) * W * 1.6 - W * .3, lg = ctx.createLinearGradient(sw - 200 * u, 0, sw + 200 * u, 0); lg.addColorStop(0, 'rgba(255,220,160,0)'); lg.addColorStop(.5, 'rgba(255,220,160,.12)'); lg.addColorStop(1, 'rgba(255,220,160,0)'); ctx.fillStyle = lg; ctx.fillRect(0, 0, W, H); ctx.restore();
} };

// ---------- 6. TRAIN — the train squeezes down a street of houses, people flatten against walls
MOMENTS.train = { capY: .3, dur: 6, sfx: [[.3, 'train_horn'], [2.6, 'train_pass'], [3.4, 'impact']], render(lt, D, o) {
  const u = U(), vx = W / 2, vy = H * .38, p = clamp(lt / 3.6), shake = lt > 2.8 && lt < 4.6 ? (Math.sin(lt * 70) * 6 * u) * (1 - Math.abs(lt - 3.6) / 1) : 0;
  ctx.save(); ctx.translate(shake, shake * .5);
  skyStops(['#7ab8de', '#cfe8f2', '#f4ecd6'], 0, vy);
  // houses both sides converging
  for (const sd of [-1, 1]) for (let k = 9; k >= 0; k--) { const q0 = ((k + 1) / 10) ** 2, q1 = (k / 10) ** 2; const xa = vx + sd * (30 * u + W * .62 * q0), xb = vx + sd * (30 * u + W * .62 * q1), ya = vy + (H * .92 - vy) * q0, yb = vy + (H * .92 - vy) * q1, ha = 80 * u + H * .9 * q0, hb = 80 * u + H * .9 * q1;
    const col = pick(['#f2c14e', '#8ac0d8', '#e88a6a', '#9ccf8a', '#f4e1b8', '#d97a7a'], k + (sd > 0 ? 3 : 0)); ctx.beginPath(); ctx.moveTo(xb, yb); ctx.lineTo(xa, ya); ctx.lineTo(xa, ya - ha); ctx.lineTo(xb, yb - hb); ctx.closePath(); fs(shade(col, sd > 0 ? -.1 : 0), 3 * u);
    ctx.save(); ctx.globalAlpha = .85; const mx = (xa + xb) / 2, my = (ya + yb) / 2 - (ha + hb) * .28, ww = Math.abs(xa - xb) * .45; rr(mx - ww / 2, my, ww, ww * .9, 3 * u, '#3f7a5a', 2 * u); ctx.restore(); }
  // track
  ctx.fillStyle = '#7a6f62'; ctx.beginPath(); ctx.moveTo(vx - 20 * u, vy); ctx.lineTo(vx + 20 * u, vy); ctx.lineTo(W * .78, H); ctx.lineTo(W * .22, H); ctx.closePath(); ctx.fill();
  for (let k = 0; k < 22; k++) { const q = (k / 22) ** 2, y = vy + (H - vy) * q, w = (40 + 460 * q) * u; ctx.fillStyle = '#4a3a2c'; ctx.fillRect(vx - w / 2, y, w, (3 + 20 * q) * u); }
  for (const sd of [-1, 1]) { ctx.beginPath(); ctx.moveTo(vx + sd * 8 * u, vy); ctx.lineTo(vx + sd * W * .17, H); ctx.lineWidth = 6 * u; ctx.strokeStyle = '#c9c4bc'; ctx.stroke(); }
  // people pressed to the walls (lean back when train is close)
  const close = SMs(clamp((lt - 1.8) / .8)); [['linh', -1, .9], ['kenji', 1, .85], ['cophovn', -1, .62], ['sofia', 1, .58]].forEach(([id, sd, d], i) => { if (!CHAR[id]) return; const y = vy + (H * .92 - vy) * d * d, x = vx + sd * (W * .2 + W * .25 * d * d), s = (.25 + d * .55) * u; person(x, y, s, CHAR[id].spec, { t: lt + i, pose: close > .3 ? 'scared' : (i % 2 ? 'photo' : 'point'), expr: close > .3 ? 'shocked' : 'joy', flip: sd > 0, rot: close * sd * .06, hold: undefined }); });
  // the train: grows from the vanishing point, fills frame, then passes (cut to blur)
  const tz = Math.pow(p, 2.2), tw = (60 + W * 1.1 * tz) * u / u, th = tw * 1.15, ty = vy + (H * .95 - vy) * tz;
  if (lt < 3.7) { ctx.save(); ctx.translate(vx, ty); const s = tw / 400; ctx.scale(s, s); ctx.lineWidth = 8; ctx.strokeStyle = C.ink;
    rr(-200, -460, 400, 460, 30, '#1f5f9a', 8); rr(-180, -430, 360, 160, 16, '#bfe3f2', 6); ctx.fillStyle = '#e8c33a'; ctx.fillRect(-200, -200, 400, 50); ctx.strokeRect(-200, -200, 400, 50);
    for (const sd of [-1, 1]) { ctx.beginPath(); ctx.arc(sd * 120, -90, 34, 0, TAU); ctx.fillStyle = '#fff6c0'; ctx.fill(); ctx.stroke(); } rr(-150, -40, 300, 40, 6, '#333', 6); ctx.restore();
    for (const sd of [-1, 1]) glow(vx + sd * 120 * tw / 400, ty - 90 * tw / 400, 160 * tw / 400 + 40 * u, '#fff4c0', .7); }
  else { const q = clamp((lt - 3.7) / (D - 3.7)); ctx.save(); ctx.fillStyle = '#1f5f9a'; ctx.fillRect(0, 0, W, H); for (let k = 0; k < 6; k++) { const x = ((k * 520 - q * 3800) % 3120 + 3120) % 3120 * u - 200 * u; rr(x, H * .25, 360 * u, 300 * u, 20 * u, '#bfe3f2', 6 * u); ctx.fillStyle = '#e8c33a'; ctx.fillRect(0, H * .6, W, 60 * u); } speedLines(lt, .8, -1); ctx.restore(); ctx.globalAlpha = 1; }
  ctx.restore();
  if (lt > 3.55 && lt < 3.75) { ctx.fillStyle = `rgba(255,255,255,${1 - Math.abs(lt - 3.65) / .1})`; ctx.fillRect(0, 0, W, H); }
} };

// ---------- 7. CAVE — a rowing boat glides out of a karst cave toward the light (Tràng An, Phong Nha)
MOMENTS.cave = { capY: .3, dur: 7, sfx: [[0, 'drip'], [2, 'drip'], [3.5, 'choir']], render(lt, D, o) {
  const u = U(), p = SMs(clamp(lt / D)), z = 1 + p * .55, mx = W * .5, my = H * .5;
  zoomAt(mx, my, z, () => {
    // outside world through the cave mouth
    skyStops(['#6cc0ea', '#bfe8f2', '#fff4d8'], H * .2, H * .62); ridge(1, H * .6, 220 * u, '#8fc0a8', { wl: 160, peak: 1, sharp: 1 }); ridge(4, H * .64, 160 * u, '#5f9a6a', { wl: 180, peak: 1, ink: 3 });
    ctx.fillStyle = '#7cbfb8'; ctx.fillRect(0, H * .62, W, H); hazeBand(H * .58, 90 * u, '#ffffff', .3);
    godRays(mx, my * .9, lt, { a: .35, n: 12, dir: Math.PI / 2, spread: .12, len: H });
    // cave rock with an organic opening
    ctx.save(); ctx.beginPath(); ctx.rect(-W, -H, W * 3, H * 3); ctx.moveTo(mx + W * .3, my); for (let i = 0; i <= 90; i++) { const a = i / 90 * TAU, r = (1 + Math.sin(a * 3 + 1) * .08 + Math.sin(a * 5 + 2) * .05 + Math.sin(a * 9) * .025) * W * .34; ctx.lineTo(mx + Math.cos(a) * r, my * 1.12 + Math.sin(a) * r * (a < Math.PI ? .2 : 1.05)); } ctx.closePath();
    const cg = ctx.createRadialGradient(mx, my, W * .3, mx, my, W * 1.1); cg.addColorStop(0, '#4a4740'); cg.addColorStop(.4, '#24221f'); cg.addColorStop(1, '#0c0b0a'); ctx.fillStyle = cg; ctx.fill('evenodd'); ctx.lineWidth = 6 * u; ctx.strokeStyle = C.ink; ctx.stroke(); ctx.restore();
    for (let i = 0; i < 14; i++) { const x = mx + (i - 7) * 70 * u, l = (60 + hash(i) * 140) * u, y0 = my * .62 + Math.abs(i - 7) * 18 * u; ctx.beginPath(); ctx.moveTo(x - 18 * u, y0 - 30 * u); ctx.lineTo(x, y0 + l * .5); ctx.lineTo(x + 18 * u, y0 - 30 * u); ctx.fillStyle = '#2a2723'; ctx.fill(); }
    // dark water with light reflection
    const wy = H * .64; const wg = ctx.createLinearGradient(0, wy, 0, H); wg.addColorStop(0, '#2c4a46'); wg.addColorStop(1, '#060a0a'); ctx.fillStyle = wg; ctx.fillRect(0, wy, W, H); reflectStreak(mx, wy + 8 * u, 300 * u, '#e8f6e8', lt, .45);
    // the boat: silhouette rower, back view, moving toward the light
    const bx = mx + Math.sin(lt * .5) * 20 * u, by = H * .82 - p * H * .1, bs = (1.1 - p * .45) * u; drawProp('sampan', bx, by, bs, {}, lt); person(bx + 30 * bs, by - 30 * bs, bs * .85, CHAR[mchr(o.hero, 'kenji')].spec, { t: lt, pose: 'paddle', view: 'back', headwear: { type: 'nonla' } }); person(bx - 70 * bs, by - 26 * bs, bs * .8, CHAR[mchr(o.guide, 'grandma')].spec, { t: lt + 1, pose: 'row', view: 'back', headwear: { type: 'nonla' } });
  });
  for (let i = 0; i < 5; i++) { const ph = (lt * .8 + hash(i)) % 1; ctx.fillStyle = `rgba(200,230,230,${.6 * (1 - ph)})`; ctx.beginPath(); ctx.arc(hash(i * 3) * W, ph * H * .6, 3 * u, 0, TAU); ctx.fill(); }
  if (lt > D - .8) { ctx.fillStyle = `rgba(255,252,240,${SMs((lt - D + .8) / .8) * .9})`; ctx.fillRect(0, 0, W, H); }
} };

// ---------- 8. SUNRISE — a figure on a rock watches the sun break the horizon (sea or mountains)
MOMENTS.sunrise = { capY: .3, dur: 7, sfx: [[.3, 'whoosh_up'], [3, 'choir']], render(lt, D, o) {
  const u = U(), p = SMs(clamp(lt / (D - .8))), sea = (o.over || 'mountains') === 'sea', hz = H * .6;
  skyStops([mix('#101a44', '#3d5fa8', p), mix('#3a3070', '#ff9a6a', p), mix('#6a4a7a', '#ffd89a', p), mix('#8a6a7a', '#fff2c8', p)], 0, hz);
  const sy = hz + 40 * u - p * H * .2; sunDisk(W * .5, sy, 62 * u, '#fff4d0', '#ff9850'); if (p > .25) godRays(W * .5, sy, lt, { a: .16 * p, n: 26, dir: -Math.PI / 2, spread: .12, w: .025 });
  for (let i = 0; i < 6; i++) { const x = ((i * 260 * u + lt * 25 * u) % (W + 300 * u)) - 150 * u, y = H * (.2 + hash(i) * .25); ctx.save(); ctx.globalAlpha = .7; cloudPuff(x, y, (50 + hash(i) * 40) * u, mix('#5a4a7a', '#ffb88a', p)); ctx.restore(); ctx.save(); ctx.beginPath(); ctx.ellipse(x, y + 22 * u, 90 * u, 10 * u, 0, 0, TAU); ctx.fillStyle = rgba('#ffe0a0', .5 * p); ctx.fill(); ctx.restore(); }
  if (sea) { ctx.fillStyle = mix('#1a2450', '#4a6a9a', p); ctx.fillRect(0, hz, W, H); reflectStreak(W * .5, hz + 6 * u, 220 * u, '#ffd890', lt, .7 * p + .1); for (let i = 0; i < 30; i++) { const y = hz + 20 * u + hash(i) * (H - hz), x = hash(i * 3) * W; line(x, y, x + 60 * u, y, 3 * u, rgba('#ffe0b0', .25 * p)); } }
  else { ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, hz + 60 * u); ctx.clip(); ctx.restore(); for (let k = 0; k < 4; k++) { ridge(k + 9, hz + k * 70 * u, (140 - k * 20) * u, mix(['#2a2a5a', '#24244c', '#1c1c3e', '#151530'][k], ['#9a7aa0', '#7a6090', '#5a4878', '#3a3058'][k], p), { wl: 300 - k * 40, peak: k < 2 }); if (k < 3) hazeBand(hz + k * 70 * u - 40 * u, 60 * u, mix('#3a3a6a', '#ffc8a0', p), .3); } }
  // rock + silhouette figure, back view, arms rising at the end
  ctx.fillStyle = '#100c18'; ctx.beginPath(); ctx.moveTo(-10, H); ctx.lineTo(-10, H * .86); ctx.quadraticCurveTo(W * .25, H * .8, W * .42, H * .84); ctx.quadraticCurveTo(W * .6, H * .9, W * .7, H); ctx.closePath(); ctx.fill();
  ctx.save(); ctx.filter = 'brightness(0.15) saturate(0.4)'; person(W * .3, H * .83, .7 * u, CHAR[mchr(o.hero, 'linh')].spec, { t: lt, view: 'back', pose: lt > D * .65 ? 'release' : 'stand', noShadow: 1 }); ctx.restore();
  birds(lt, W * .55, H * .32, 4, 1.1);
} };

// ---------- 9. FIREWORKS — Tết / New Year over a lake and skyline, crowd heads in the foreground
MOMENTS.fireworks = { dur: 6.5, sfx: [[.6, 'firework'], [1.5, 'firework'], [2.2, 'firework'], [3.1, 'firework'], [3.6, 'firework'], [4.4, 'firework'], [5.2, 'firework']], render(lt, D, o) {
  const u = U(), hz = H * (H > W ? .62 : .66), z = 1.05 - lt / D * .05;
  skyStops(['#04061a', '#0e1440', '#22205a'], 0, hz);
  const bursts = [[.6, .3, .2, '#ffd24a'], [1.5, .7, .16, '#ff4a6a'], [2.2, .45, .24, '#6af0ff'], [3.1, .22, .14, '#ff8a3a'], [3.6, .8, .26, '#c47aff'], [4.4, .5, .12, '#ffffff'], [5.2, .35, .22, '#ff4a4a']];
  const drawB = (mirror) => bursts.forEach(([t0, fx, fy, col], i) => { const tt = lt - t0; if (tt < -.6 || tt > 2.2) return; const cx = fx * W, cy = hz * (fy + .12) + 60 * u;
    if (tt < 0) { const q = 1 + tt / .6; ctx.fillStyle = '#fff6c0'; ctx.beginPath(); ctx.arc(cx, hz - (hz - cy) * q, 4 * u, 0, TAU); ctx.fill(); return; }
    const r = (1 - Math.exp(-tt * 3)) * 340 * u, a = clamp(1 - tt / 2.2); glow(cx, cy, r * 1.2, col, .25 * a); ctx.save(); ctx.globalCompositeOperation = 'screen';
    for (let k = 0; k < 46; k++) { const ang = k / 46 * TAU + i, rr2 = r * (.8 + hash(k + i * 50) * .25), x = cx + Math.cos(ang) * rr2, y = cy + Math.sin(ang) * rr2 + tt * tt * 40 * u; ctx.strokeStyle = rgba(col, a); ctx.lineWidth = 4 * u; ctx.beginPath(); ctx.moveTo(cx + Math.cos(ang) * rr2 * .7, cy + Math.sin(ang) * rr2 * .7 + tt * tt * 30 * u); ctx.lineTo(x, y); ctx.stroke(); if (hash(k * 7 + Math.floor(lt * 12)) > .5) { ctx.fillStyle = rgba('#ffffff', a); ctx.fillRect(x, y, 4 * u, 4 * u); } } ctx.restore(); });
  zoomAt(W / 2, H / 2, z, () => { drawB();
    // skyline: tower, pagoda roofs, trees (Hoàn Kiếm feel)
    ctx.fillStyle = '#0a0a1c'; for (let k = 0; k < 12; k++) { const x = k * W / 11 - 30 * u, h = (90 + hash(k * 4) * 220) * u, w = (70 + hash(k) * 60) * u; ctx.fillRect(x, hz - h, w, h); for (let j = 0; j < 6; j++) if (hash(k * 10 + j) > .5) { ctx.fillStyle = '#ffcf7a'; ctx.fillRect(x + 12 * u + (j % 2) * 30 * u, hz - h + 20 * u + Math.floor(j / 2) * 40 * u, 12 * u, 16 * u); ctx.fillStyle = '#0a0a1c'; } }
    pagoda(W * .5, hz + 10 * u, .5 * u, '#1a1424', '#120c1a');
    // lake reflection
    ctx.save(); const lg2 = ctx.createLinearGradient(0, hz, 0, H); lg2.addColorStop(0, '#1a1c4a'); lg2.addColorStop(1, '#080a22'); ctx.fillStyle = lg2; ctx.fillRect(0, hz, W, H); ctx.beginPath(); ctx.rect(0, hz, W, H); ctx.clip(); ctx.translate(0, hz * 2); ctx.scale(1, -1); ctx.globalAlpha = .55; drawB(); ctx.restore(); for (let i = 0; i < 40; i++) line(hash(i) * W, hz + 10 * u + hash(i * 3) * (H - hz), hash(i) * W + 80 * u, hz + 10 * u + hash(i * 3) * (H - hz), 3 * u, 'rgba(255,220,180,.12)'); });
  // crowd heads foreground (silhouette, a few phones up)
  ctx.fillStyle = '#020208'; for (let i = 0; i < 12; i++) { const x = i * W / 11 + Math.sin(i * 2) * 20 * u, y = H * .92 + hash(i) * 40 * u + Math.sin(lt * 2 + i) * 3 * u; ctx.beginPath(); ctx.arc(x, y, 62 * u, 0, TAU); ctx.fill(); ctx.fillRect(x - 90 * u, y + 40 * u, 180 * u, 200 * u); ctx.save(); ctx.strokeStyle = 'rgba(255,190,150,.35)'; ctx.lineWidth = 4 * u; ctx.beginPath(); ctx.arc(x, y, 60 * u, -2.6, -.5); ctx.stroke(); ctx.restore(); ctx.fillStyle = '#020208'; if (i % 4 === 1) { rr(x + 20 * u, y - 170 * u, 46 * u, 80 * u, 8 * u, '#111'); ctx.fillStyle = '#7ab0ff'; ctx.fillRect(x + 25 * u, y - 165 * u, 36 * u, 66 * u); ctx.fillStyle = '#05040c'; } }
} };

// ---------- 10. CROSSING — walk slowly through Hà Nội traffic, scooters flow around you
MOMENTS.crossing = { capY: .3, dur: 7, sfx: [[0, 'moto_pass'], [1.2, 'moto_pass'], [2.5, 'moto_pass'], [4, 'moto_pass'], [5, 'ding']], render(lt, D, o) {
  const u = U(), hero = mchr(o.hero, 'dave'), lanes = 6, top = H * (H > W ? .4 : .3), bot = H * .92;
  skyStops(['#a8c8d8', '#e8eae0'], 0, top); for (let k = 0; k < 7; k++) tubeHouse(k * W / 6 - 40 * u, top + 10 * u, W / 6, (220 + hash(k) * 160) * u, pick(['#f2c14e', '#e88a6a', '#8ac0d8', '#f4e1b8', '#d97a7a'], k), { u });
  ctx.fillStyle = '#6e6a66'; ctx.fillRect(0, top, W, H); for (let k = 0; k < 10; k++) { const y = top + (bot - top) * k / 10; ctx.fillStyle = '#f4efe2'; ctx.fillRect(W * .44, y, W * .12, 18 * u); }
  // hero walks from far kerb toward camera at a steady pace
  const hp = SMs(clamp((lt - .4) / (D - 1))), hy = lerp(top + 30 * u, bot + 40 * u, hp), hx = W * .5, hs = lerp(.42, .9, hp) * u;
  const items = [];
  for (let l = 0; l < lanes; l++) { const ly = top + (bot - top) * (l + .5) / lanes + 30 * u, ls = lerp(.3, .62, (l + .5) / lanes) * u, dir = l % 2 ? -1 : 1, sp = (220 + hash(l) * 120) * u;
    for (let k = 0; k < 4; k++) { const span = W + 700 * u; let x = ((hash(l * 10 + k) * span + dir * lt * sp) % span + span) % span - 350 * u; const dx = x - hx, near = Math.abs(ly - hy) < 140 * u; let off = 0; if (near && Math.abs(dx) < 260 * u) off = (1 - Math.abs(dx) / 260 / u) * 90 * u * (k % 2 ? 1 : -1); items.push({ y: ly + off, draw: () => rider(x, ly + off, ls, pick(['kenji', 'cophovn', 'barista', 'wei', 'sofia', 'grandma'], l + k), lt + k, { flip: dir < 0, color: pick(['#d9443a', '#3a7bd5', '#e8e2d6', '#2f2f2f', '#3fa36b'], l * 3 + k), helmet: pick([C.yel, '#3fa36b', '#e8e2d6', '#d9443a'], k + l), expr: 'neutral' }) }); } }
  items.push({ y: hy, draw: () => person(hx, hy, hs, CHAR[hero].spec, { t: lt, pose: 'walk', expr: lt > D - 1.5 ? 'joy' : 'nervous', look: [0, 1], yaw: 0 }) });
  items.sort((a, b) => a.y - b.y).forEach(it => it.draw());
  if (lt > D - 1.3) T('✓', hx + 140 * u, hy - 380 * hs / u, { size: 90 * u, fill: '#3fd07a', lw: 12 * u });
} };

// ---------- 11. WINDOW — landscape racing past a sleeper-bus / train window
MOMENTS.window = { capY: 0.8, dur: 6, sfx: [[0, 'engine_loop'], [2, 'whoosh']], render(lt, D, o) {
  const u = U(), tm = o.time || 'sunset', sc = lt * 900 * u, wx = W * .1, wy = H * .2, ww = W * .8, wh = H * .42;
  ctx.fillStyle = '#2a2a34'; ctx.fillRect(0, 0, W, H);
  ctx.save(); rr(wx, wy, ww, wh, 40 * u); ctx.clip();
  skyStops(tm === 'sunset' ? ['#5a4a8a', '#ff9a6a', '#ffd89a'] : ['#5fb8e8', '#cfeaf5', '#f6f1dc'], wy, wy + wh);
  if (tm === 'sunset') sunDisk(wx + ww * .7, wy + wh * .45, 40 * u);
  ridge(3, wy + wh * .7, 120 * u, tm === 'sunset' ? '#7a5a8a' : '#8ab8a8', { scroll: sc, f: .05, wl: 300, peak: 1 }); ridge(6, wy + wh * .8, 90 * u, tm === 'sunset' ? '#4a3a62' : '#5f9a6a', { scroll: sc, f: .2, wl: 200 });
  ctx.fillStyle = tm === 'sunset' ? '#c8a050' : '#8cc163'; ctx.fillRect(wx, wy + wh * .8, ww, wh); for (let k = 0; k < 12; k++) { const x = ((k * 160 * u - sc * .6) % (ww + 200 * u) + ww + 200 * u) % (ww + 200 * u) + wx - 100 * u; line(x, wy + wh * .82, x - 40 * u, wy + wh, 4 * u, 'rgba(60,90,40,.4)'); }
  for (let k = 0; k < 3; k++) { const x = ((k * 700 * u - sc * 2.4) % (ww + 900 * u) + ww + 900 * u) % (ww + 900 * u) + wx - 300 * u; ctx.save(); ctx.filter = `blur(${10 * u}px)`; ctx.fillStyle = '#1a1a20'; ctx.fillRect(x, wy, 30 * u, wh); ctx.restore(); }
  ctx.globalAlpha = .12; ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.moveTo(wx + ww * .1, wy); ctx.lineTo(wx + ww * .35, wy); ctx.lineTo(wx + ww * .15, wy + wh); ctx.lineTo(wx - ww * .1, wy + wh); ctx.fill(); ctx.restore();
  rr(wx, wy, ww, wh, 40 * u, null, 14 * u); ctx.lineWidth = 14 * u; ctx.strokeStyle = '#141418'; ctx.stroke();
  // curtain + passenger in profile, head bobbing with the road
  ctx.fillStyle = '#9a3a3a'; ctx.beginPath(); ctx.moveTo(wx - 20 * u, wy - 30 * u); ctx.quadraticCurveTo(wx + 60 * u + Math.sin(lt * 3) * 10 * u, wy + wh * .5, wx - 20 * u, wy + wh + 30 * u); ctx.lineTo(-10, wy + wh + 30 * u); ctx.lineTo(-10, wy - 30 * u); ctx.fill();
  const bob = Math.sin(lt * 8) * 3 * u + Math.sin(lt * 13) * 2 * u; person(W * .74, H * 1.18 + bob, 2.3 * u, CHAR[mchr(o.hero, 'linh')].spec, { t: lt, pose: o.pose || 'stand', expr: o.expr || 'love', flip: true, look: [-1, -.2], noShadow: 1, yaw: -.6 });
  ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = tm === 'sunset' ? 'rgba(255,170,100,.12)' : 'rgba(255,255,255,.06)'; ctx.fillRect(0, 0, W, H); ctx.restore();
} };

// ---------- 12. MAPDIVE — map of Việt Nam dives into a pin, clouds rush past, the place opens up
MOMENTS.mapdive = { dur: 6, sfx: [[0, 'map_whoosh'], [2.4, 'pin_drop'], [3.0, 'whoosh_down']], render(lt, D, o) {
  const u = U(), c = CITY[o.to] || CITY.hanoi, lon = c[1], lat = c[2], place = o.place && PLACE[o.place] ? o.place : null;
  const a = { lon: 105.6, lat: 16.2, k: H > W ? 30 : 46 }, b = { lon, lat, k: H > W ? 320 : 420 }; const p = SMs(clamp((lt - .3) / 2.4));
  if (lt < 3.4) { const v = mapCamLerp(a, b, p); vnMap({ ...v, t: lt, vnFill: 1 }); const [px, py] = mapProjector(v)(lon, lat); if (lt > 2.0) mapPin(px, py, lt - 2.0, o.label || c[0].toUpperCase(), 1.2 * U());
    // clouds rushing toward camera as the dive deepens
    for (let i = 0; i < 9; i++) { const ph = (lt * .55 + hash(i)) % 1, s = (.3 + ph * ph * 4.5) * 120 * u, x = W / 2 + (hash(i * 3) - .5) * W * ph * 2.2, y = H / 2 + (hash(i * 5) - .5) * H * ph * 1.6; ctx.save(); ctx.globalAlpha = clamp(p * 2) * Math.sin(ph * Math.PI) * .8 * (1 - clamp((lt - 2.6) / .5)); cloudPuff(x, y, s, '#ffffff', 1); ctx.restore(); } }
  // portal: the place opens from the pin
  const q = SMs(clamp((lt - 2.9) / .9)); if (q > 0) { ctx.save(); ctx.beginPath(); ctx.arc(W / 2, H / 2, q * Math.hypot(W, H) * .6, 0, TAU); ctx.clip(); const z = 1.12 - q * .1 + (lt - 2.9) * .015; zoomAt(W / 2, H * .55, z, () => { const tg = LINT.tag; LINT.tag = 'bg'; if (place) PLACE[place].draw(lt * 4, { t: lt * 4, time: o.time || 'day' }); else vista(lt, o.time || 'sunset'); LINT.tag = tg; }); ctx.restore(); if (q < 1) { ctx.beginPath(); ctx.arc(W / 2, H / 2, q * Math.hypot(W, H) * .6, 0, TAU); ctx.lineWidth = 14 * u; ctx.strokeStyle = '#fff'; ctx.stroke(); } }
} };

// painterly vista used when a dive or cut needs a generic landscape
function vista(lt, tm) { const u = U(); const S = { sunset: ['#3b3a78', '#a5577e', '#ff8f5e', '#ffd18a'], day: ['#4aa3e0', '#9fd4f0', '#e8f4ef', '#f9f0d8'], dawn: ['#6d86c9', '#e6a7b4', '#ffd6b0', '#fff2d8'] }[tm] || ['#4aa3e0', '#9fd4f0', '#e8f4ef', '#f9f0d8'];
  skyStops(S, 0, H * .6); if (tm !== 'day') sunDisk(W * .66, H * .38, 50 * u); const cols = tm === 'day' ? ['#a8c9d6', '#86b2b8', '#5f9a8c', '#3f7e5e', '#2c5f3f'] : ['#b78aa8', '#8f6a92', '#6a527c', '#463e63', '#2a2742'];
  for (let k = 0; k < 5; k++) { const y = H * (.5 + k * .1); ridge(k + 3, y, (190 - k * 18) * u, cols[k], { scroll: lt * 30 * u, f: .15 + k * .2, wl: 360 - k * 30, peak: k < 3, ink: k > 2 ? 3 : 0 }); if (k < 4) hazeBand(y - 30 * u, 70 * u, tm === 'day' ? '#ffffff' : '#ffb894', .25); } }

// ---------- 13. SPLIT — two places at once (top/bottom on 9:16, left/right on 16:9) with a sliding divider
MOMENTS.split = { dur: 6, sfx: [[.2, 'slide'], [.6, 'impact']], render(lt, D, o) {
  const u = U(), vert = H > W, A = placeOr(o.a, 'hanoi'), B = placeOr(o.b, 'saigon'), la = (o.labels || '').split('|'), e = E.back ? E.back(clamp(lt / .7)) : SMs(clamp(lt / .7)), wob2 = Math.sin(lt * 1.2) * .02;
  const cut = (vert ? H : W) * (.5 + wob2) * e + (vert ? H : W) * (1 - e);
  const side = (pl, clipFn, ox, hero, label, k) => { ctx.save(); ctx.beginPath(); clipFn(); ctx.clip(); ctx.translate(ox[0], ox[1]); const tg = LINT.tag; LINT.tag = 'bg'; PLACE[pl].draw(lt * 6 * (k ? -1 : 1), { t: lt * 6, time: k ? (o.timeB || 'night') : (o.timeA || 'day'), scroll: lt * 40 * u * (k ? -1 : 1) }); LINT.tag = tg; if (hero && CHAR[hero]) person(W * (k ? .62 : .38), PLACE[pl].ground(), .75 * u, CHAR[hero].spec, { t: lt + k, pose: k ? 'cheer' : 'point', expr: 'joy', flip: !!k }); ctx.restore(); };
  if (vert) { side(A, () => ctx.rect(0, 0, W, cut), [0, -(H - cut) * .5], o.heroA, la[0], 0); side(B, () => ctx.rect(0, cut, W, H), [0, cut * .5], o.heroB, la[1], 1); line(0, cut, W, cut, 12 * u, '#fff'); line(0, cut, W, cut, 4 * u, C.ink); }
  else { side(A, () => ctx.rect(0, 0, cut, H), [-(W - cut) * .5, 0], o.heroA, la[0], 0); side(B, () => ctx.rect(cut, 0, W, H), [cut * .5, 0], o.heroB, la[1], 1); line(cut, 0, cut, H, 12 * u, '#fff'); }
  const lp = E.back ? E.back(clamp((lt - .5) / .5)) : 1; if (la[0]) T(la[0], vert ? W / 2 : W * .25, vert ? cut * .16 : H * .14, { size: 70 * u * lp, fill: '#fff', lw: 14 * u }); if (la[1]) T(la[1], vert ? W / 2 : W * .75, vert ? cut + 150 * u : H * .14, { size: 70 * u * lp, fill: C.yel, lw: 14 * u });
  if (o.vs !== 'no') { const s = E.back ? E.back(clamp((lt - .7) / .4)) : 1; ctx.save(); ctx.translate(W / 2, vert ? cut : H / 2); ctx.scale(s, s); ctx.beginPath(); ctx.arc(0, 0, 70 * u, 0, TAU); ctx.fillStyle = C.brand; ctx.fill(); ctx.lineWidth = 8 * u; ctx.strokeStyle = C.ink; ctx.stroke(); ctx.restore(); T('VS', W / 2, (vert ? cut : H / 2) + 22 * u * s, { size: 60 * u * s, fill: '#fff', lw: 8 * u }); }
} };

// ---------- recipe
SB.recipes.moment = (o, b) => { const M = MOMENTS[o.kind]; if (!M) { console.warn('unknown moment kind', o.kind); return SB.recipes.raw ? null : null; }
  const { caps, end } = timeCaps(b.caps, num(o.capAt, .6), .15, b.capStyle); const dur = Math.max(num(o.dur, 0), end + .5, M.dur);
  const cy = o.capY !== undefined ? +o.capY : M.capY; return { dur, render: lt => M.render(lt, dur, o), captions: caps, sfx: M.sfx.filter(s => s[0] < dur), moment: o.kind, ...(cy ? { capY: { v: cy, h: Math.min(.88, cy + .02) } } : {}) }; };
const MOMENT_NAMES = Object.keys(MOMENTS);
TRANS.moment = ['fgwipe', 'lightleak', 'fade'];
