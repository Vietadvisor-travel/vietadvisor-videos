/* =====================================================================
   FRAMING — foreground layers that put the camera *inside* the world.
   fg=leaves|bamboo|lanterns|window|door|wires|flowers|crowd|bokeh|grass|rain (combine with +)
   Drawn out of focus, darker, moving faster than the subject (parallax),
   so every shot gets a near / middle / far plane like a real lens.
   rays=yes|left|right — soft light shafts through the scene (dust in the air).
   ===================================================================== */
'use strict';
function fgPar(cam, k = 1.7) { const z = Math.min(cam.z || 1, 2.2); return { ox: clamp(-(cam.x - .5) * W * k * z, -W * .22, W * .22), oy: clamp(-(cam.y - .5) * H * k * .5 * z, -H * .08, H * .08), z: Math.min(1.5, Math.pow(z, .45)) }; }
function withFg(blur, a, fn) { ctx.save(); if (blur && !LINT.on) ctx.filter = `blur(${blur}px)`; ctx.globalAlpha *= a; fn(); ctx.restore(); }
const FG = {
  leaves(t, P, u, S) { const night = (S.placeOpts || {}).time === 'night'; const col = night ? '#0b1410' : '#1f3a22';
    withFg(9 * u, .95, () => { for (const [cx, cy, n, sd] of [[-40, -30, 16, 1], [W + 40, -10, 13, -1]]) for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * .7 + (sd < 0 ? Math.PI * .3 : 0), r = (160 + hash(i * 3 + sd) * 260) * u * P.z, sw = Math.sin(t * 1.3 + i) * .05;
      const x = cx + P.ox * 1.2 + Math.cos(a) * r * (sd > 0 ? 1 : -1) * .9, y = cy + P.oy + Math.sin(a) * r * .55; ctx.save(); ctx.translate(x, y); ctx.rotate(a * sd + sw + .4); ctx.fillStyle = shade(col, hash(i) * .12); ctx.beginPath(); ctx.ellipse(0, 0, 120 * u * P.z, 44 * u * P.z, 0, 0, TAU); ctx.fill(); ctx.restore(); } }); },
  bamboo(t, P, u) { withFg(10 * u, .95, () => { for (const [x0, n] of [[-30 * u, 3], [W - 90 * u, 2]]) for (let i = 0; i < n; i++) { const x = x0 + i * 55 * u + P.ox * 1.4, w = (34 + i * 8) * u * P.z, sw = Math.sin(t * .9 + i) * 8 * u;
    ctx.fillStyle = shade('#2d4a26', -i * .06); ctx.beginPath(); ctx.moveTo(x, H + 20); ctx.lineTo(x + sw, -20); ctx.lineTo(x + sw + w, -20); ctx.lineTo(x + w, H + 20); ctx.fill(); ctx.fillStyle = 'rgba(0,0,0,.35)'; for (let k = 0; k < 8; k++) ctx.fillRect(x + sw * (1 - k / 8) - 4 * u, k * H / 7 + 40 * u + P.oy, w + 8 * u, 7 * u); } }); },
  lanterns(t, P, u) { for (let i = 0; i < 6; i++) { const x = (i / 5) * W + P.ox * 1.5 + Math.sin(i * 2) * 60 * u, y = (40 + hash(i) * 220) * u + P.oy, r = (70 + hash(i * 5) * 60) * u * P.z, col = pick(['#ff5a3a', '#ffb03a', '#ff3a6a', '#ffd84a'], i);
    glow(x, y, r * 2.6, col, .45); withFg(14 * u, .85, () => { ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(x, y + Math.sin(t * 1.4 + i) * 6 * u, r * .8, r, 0, 0, TAU); ctx.fill(); }); } },
  bokeh(t, P, u, S) { const night = /night|sunset/.test((S.placeOpts || {}).time || ''); ctx.save(); ctx.globalCompositeOperation = 'screen'; for (let i = 0; i < 16; i++) { const x = ((hash(i) * W * 1.3 + P.ox * 1.8 + t * 6 * u) % (W * 1.3) + W * 1.3) % (W * 1.3) - W * .15, y = hash(i * 7) * H * .5 + P.oy, r = (30 + hash(i * 3) * 70) * u * P.z;
    const g = ctx.createRadialGradient(x, y, r * .6, x, y, r); const c = night ? pick(['#ffb050', '#ff7a50', '#ffd890'], i) : '#ffffff'; g.addColorStop(0, rgba(c, night ? .28 : .12)); g.addColorStop(.85, rgba(c, night ? .34 : .14)); g.addColorStop(1, rgba(c, 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); } ctx.restore(); },
  window(t, P, u) { const b = 70 * u; withFg(5 * u, 1, () => { ctx.fillStyle = '#1a1210'; ctx.beginPath(); ctx.rect(-50, -50, W + 100, H + 100); const ix = b + P.ox * .5, iy = b * 1.6 + P.oy * .5; ctx.roundRect ? ctx.roundRect(ix, iy, W - 2 * b, H - b * 3.6, 30 * u) : ctx.rect(ix, iy, W - 2 * b, H - b * 3.6); ctx.fill('evenodd');
    ctx.strokeStyle = '#3a2a20'; ctx.lineWidth = 16 * u; ctx.beginPath(); ctx.moveTo(W / 2 + P.ox * .5, iy); ctx.lineTo(W / 2 + P.ox * .5, iy + 80 * u); ctx.stroke(); }); },
  door(t, P, u) { withFg(6 * u, 1, () => { ctx.fillStyle = '#20140e'; ctx.fillRect(-20 + P.ox, -20, 120 * u, H + 40); ctx.fillRect(W - 100 * u + P.ox, -20, 140 * u, H + 40); ctx.fillRect(-20, -20, W + 40, 90 * u + P.oy); ctx.fillStyle = '#7a3a22'; for (let k = 0; k < 6; k++) ctx.fillRect(10 * u + P.ox, k * H / 6 + 20 * u, 70 * u, H / 6 - 40 * u); }); },
  wires(t, P, u) { withFg(3 * u, .95, () => { ctx.strokeStyle = '#141018'; ctx.lineCap = 'round'; for (let k = 0; k < 7; k++) { ctx.lineWidth = (5 + k % 3 * 3) * u; ctx.beginPath(); const y0 = (40 + k * 34) * u + P.oy; ctx.moveTo(-40, y0 + 60 * u); ctx.quadraticCurveTo(W * .5 + P.ox, y0 + 160 * u + Math.sin(t + k) * 4 * u, W + 40, y0 - 30 * u + k * 10 * u); ctx.stroke(); }
    ctx.fillStyle = '#141018'; ctx.fillRect(W * .82 + P.ox * 1.3, -20, 34 * u, H * .5); rr(W * .78 + P.ox * 1.3, 120 * u, 120 * u, 70 * u, 10 * u, '#141018'); }); },
  flowers(t, P, u) { withFg(8 * u, .95, () => { for (const [cx, cy, sd] of [[-20, H * .02, 1], [W + 20, H * .9, -1]]) { ctx.fillStyle = '#2f4a2a'; ctx.beginPath(); ctx.ellipse(cx + P.ox * 1.3, cy + P.oy, 260 * u * P.z, 170 * u * P.z, sd * .4, 0, TAU); ctx.fill();
    for (let i = 0; i < 26; i++) { const a = hash(i * 3 + sd) * TAU, r = hash(i * 5) * 230 * u * P.z; const x = cx + P.ox * 1.3 + Math.cos(a) * r, y = cy + P.oy + Math.sin(a) * r * .65; ctx.fillStyle = pick(['#e0457a', '#f06aa0', '#c83070', '#ff8ab8'], i); ctx.beginPath(); ctx.arc(x, y + Math.sin(t * 1.5 + i) * 3 * u, (22 + hash(i) * 18) * u * P.z, 0, TAU); ctx.fill(); } } }); },
  crowd(t, P, u) { withFg(8 * u, 1, () => { ctx.fillStyle = '#120e14'; for (let i = 0; i < 6; i++) { const x = i * W / 5 + P.ox * 1.5 + Math.sin(i * 3) * 40 * u, y = H - 40 * u + hash(i) * 60 * u + Math.sin(t * 2 + i) * 4 * u; ctx.beginPath(); ctx.arc(x, y - 140 * u, 90 * u * P.z, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(x, y + 60 * u, 190 * u * P.z, 140 * u, 0, 0, TAU); ctx.fill(); } }); },
  grass(t, P, u) { withFg(0, 1, () => grassFg(t, H + 30 * u + P.oy * .5, '#1c2a1a', 8)); },
  rain(t, P, u) { withFg(2 * u, .7, () => { ctx.strokeStyle = 'rgba(230,238,250,.5)'; ctx.lineWidth = 6 * u; ctx.beginPath(); for (let i = 0; i < 40; i++) { const x = (hash(i) * W * 1.2 + t * 260 * u) % (W * 1.2) - W * .1, y = (hash(i * 3) * H + t * 2400 * u) % H; ctx.moveTo(x, y); ctx.lineTo(x - 14 * u, y + 90 * u); } ctx.stroke(); }); },
};
function drawFg(kind, lt, cam, S, place) { const u = U(), P = fgPar(cam || { x: .5, y: .5, z: 1 }); const tag = LINT.tag; LINT.tag = 'fg';
  for (const k of String(kind).split('+')) if (FG[k]) FG[k](lt, P, u, S); LINT.tag = tag; }
function drawRaysFx(S, lt, place) { const tm = (S.placeOpts || {}).time || 'day', left = S.rays !== 'right';
  const col = tm === 'night' ? 'rgba(190,205,255,.55)' : tm === 'sunset' ? 'rgba(255,190,120,.8)' : 'rgba(255,246,206,.8)';
  godRays(left ? -W * .05 : W * 1.05, -H * .05, lt, { a: tm === 'night' ? .12 : .2, n: 9, dir: left ? Math.PI * .3 : Math.PI * .7, spread: .07, w: .03, color: col });
  const u = U(); ctx.save(); ctx.globalCompositeOperation = 'screen'; for (let i = 0; i < 26; i++) { const x = (hash(i) * W + Math.sin(lt * .3 + i) * 40 * u), y = (hash(i * 5) * H * .7 + lt * 10 * u * (hash(i) - .3)) % (H * .7); ctx.fillStyle = `rgba(255,240,210,${.25 + .25 * Math.sin(lt * 2 + i)})`; ctx.beginPath(); ctx.arc(x, y, (1.5 + hash(i * 2) * 2.5) * u, 0, TAU); ctx.fill(); } ctx.restore(); }
const FG_NAMES = Object.keys(FG);
