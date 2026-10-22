/* Cinematic "wow" set pieces — concept pass (Ep. 3 world). Each is a `# moment kind=…` with its own light, depth,
   weather, camera and art-directed typography (text placed and styled for the shot, not subtitles).
   wow_fleet  1306 — the royal wedding fleet sails south past layered mountains at golden hour
   wow_storm  1307 — the rescue: a small boat on a black wave, lightning reveals a Cham tower on the cliff
   wow_south  the March South — aerial over paddies, a line of settlers with lanterns walking south at dawn
   wow_morph  1698 → today — one river, two times: stilt village above, Sài Gòn skyline below */
(function () {
  const gl = (x, y, r, col, a = 1) => { const g = ctx.createRadialGradient(x, y, 0, x, y, Math.max(1, r)); g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha *= a; ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); ctx.restore(); };
  const lb = (a = 1) => { const V = H > W, h = V ? H * .07 : H * .1; ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, h); ctx.fillRect(0, H - h, W, h); ctx.restore(); };
  const vign = (k = .55) => { const g = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * .3, W / 2, H / 2, Math.hypot(W, H) * .62); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${k})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); };
  const lin = (stops, x0, y0, x1, y1) => { const g = ctx.createLinearGradient(x0, y0, x1, y1); stops.forEach(([o, c]) => g.addColorStop(o, c)); return g; };
  function title(txt, x, y, o = {}) { const u = U(); ctx.save(); ctx.globalAlpha *= o.a ?? 1; ctx.font = `${o.w || 900} ${(o.size || 120) * u}px ${o.font || FONT.display}`; ctx.textAlign = o.align || 'center'; ctx.textBaseline = 'middle';
    if (o.ls) ctx.letterSpacing = `${o.ls * u}px`; if (o.glow) { ctx.shadowColor = o.glow; ctx.shadowBlur = 40 * u; } ctx.fillStyle = o.fill || '#fff'; const mw = o.maxW ?? W * .86, tw = ctx.measureText(txt).width; if (tw > mw) { ctx.translate(x, y); ctx.scale(mw / tw, mw / tw); ctx.translate(-x, -y); } ctx.fillText(txt, x, y); ctx.restore(); }
  function silhouetteBoat(x, y, s, col, t, o = {}) { // royal boat with dragon prow, two sails, lanterns
    ctx.save(); ctx.translate(x, y + Math.sin(t * 1.3 + x) * 4 * s); ctx.rotate(Math.sin(t * 1.1 + x) * .02); ctx.fillStyle = col;
    ctx.beginPath(); ctx.moveTo(-160 * s, -10 * s); ctx.quadraticCurveTo(0, 40 * s, 170 * s, -12 * s); ctx.lineTo(210 * s, -70 * s); ctx.quadraticCurveTo(230 * s, -100 * s, 205 * s, -110 * s); ctx.quadraticCurveTo(195 * s, -80 * s, 175 * s, -40 * s); ctx.lineTo(150 * s, -30 * s); ctx.lineTo(-150 * s, -30 * s); ctx.lineTo(-185 * s, -60 * s); ctx.closePath(); ctx.fill();
    for (const [mx, h, w] of [[-40, 230, 120], [70, 180, 95]]) { ctx.fillRect((mx - 3) * s, -30 * s - h * s, 6 * s, h * s); ctx.beginPath(); ctx.moveTo(mx * s, -30 * s - h * s); ctx.quadraticCurveTo((mx + w * 1.1) * s, -30 * s - h * .55 * s, (mx + w * .15) * s, -40 * s); ctx.lineTo(mx * s, -40 * s); ctx.closePath(); ctx.globalAlpha = o.sail ?? .92; ctx.fill(); ctx.globalAlpha = 1; }
    ctx.fillRect(-90 * s, -70 * s, 120 * s, 40 * s); ctx.beginPath(); ctx.moveTo(-100 * s, -70 * s); ctx.lineTo(-30 * s, -95 * s); ctx.lineTo(40 * s, -70 * s); ctx.fill();
    if (o.lanterns) for (let i = 0; i < 6; i++) { const lx = (-130 + i * 50) * s, ly = -36 * s + Math.sin(i) * 3 * s; gl(lx, ly, 26 * s, 'rgba(255,170,80,.9)'); ctx.fillStyle = '#ffcf7a'; ctx.beginPath(); ctx.arc(lx, ly, 5 * s, 0, TAU); ctx.fill(); ctx.fillStyle = col; }
    ctx.restore(); }
  function mtn(seed, yBase, amp, col, wl, sc = 0) { const u = U(); ctx.beginPath(); ctx.moveTo(0, H); for (let x = 0; x <= W + 8; x += 8 * u) { const k = (x + sc) / (wl * u); const y = yBase - amp * u * (.55 + .45 * Math.sin(k * 1.7 + seed) * Math.cos(k * .63 + seed * 2.1) + .18 * Math.sin(k * 5.3 + seed)); ctx.lineTo(x, y); } ctx.lineTo(W, H); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); }

  // ---------- 1306 — the wedding fleet at golden hour
  MOMENTS.wow_fleet = { dur: 7, capY: .8, sfx: [[0, 'whoosh'], [1.2, 'choir']], render(lt, D, o) {
    const u = U(), V = H > W, z = 1.06 - lt * .008, cam = lt * 6 * u; ctx.save(); ctx.translate(W / 2, H * .55); ctx.scale(z, z); ctx.translate(-W / 2, -H * .55);
    const hz = H * (V ? .56 : .6); ctx.fillStyle = lin([[0, '#2b1d4f'], [.35, '#9b3f6e'], [.62, '#ff8a4c'], [1, '#ffd38a']], 0, 0, 0, hz); ctx.fillRect(0, 0, W, hz);
    const sx = W * .62, sy = hz - 40 * u; gl(sx, sy, 900 * u, 'rgba(255,170,90,.55)'); gl(sx, sy, 260 * u, 'rgba(255,240,200,.9)'); ctx.fillStyle = '#fff4d6'; ctx.beginPath(); ctx.arc(sx, sy, 95 * u, 0, TAU); ctx.fill();
    godRays(sx, sy, lt, { n: 12, spread: .3, dir: -Math.PI / 2, w: .03, a: .18 });
    for (const [i, c, a, f] of [[1, '#c4677a', 150, .2], [2, '#8e3f6a', 230, .35], [3, '#5a2752', 300, .55], [4, '#331a3d', 380, .8]]) { mtn(i * 3.3, hz + 10 * u - (4 - i) * 6 * u, a, c, 520 - i * 60, cam * f); hazeBand(hz - 20 * u, 70 * u, '#ffb27a', .35 - i * .06); }
    ctx.fillStyle = lin([[0, '#ff9a5a'], [.25, '#8a3b5e'], [1, '#1c1230']], 0, hz, 0, H); ctx.fillRect(0, hz, W, H - hz);
    for (let i = 0; i < 70; i++) { const y = hz + (i / 70) ** 1.6 * (H - hz), w = (30 + hash(i) * 160) * u * (1 + (y - hz) / H * 3); ctx.fillStyle = `rgba(255,${200 - i},${150 - i},${.5 * (1 - i / 70)})`; ctx.fillRect(sx - w / 2 + Math.sin(lt * 2 + i) * 10 * u, y, w, 3 * u); }
    const bx = W * (V ? .42 : .38) + lt * 14 * u, by = hz + (V ? 150 : 120) * u; silhouetteBoat(bx + 330 * u, by - 40 * u, .55 * u, '#2a1428', lt, { lanterns: 1 }); silhouetteBoat(bx - 360 * u, by - 30 * u, .45 * u, '#2a1428', lt + 1, { lanterns: 1 }); silhouetteBoat(bx, by, 1.05 * u, '#170b1c', lt + 2, { lanterns: 1 });
    ctx.save(); ctx.globalAlpha = .25; ctx.scale(1, -1); ctx.translate(0, -2 * by - 20 * u); silhouetteBoat(bx, by, 1.05 * u, '#170b1c', lt + 2); ctx.restore();
    for (let i = 0; i < 9; i++) { const ph = (lt * .12 + hash(i)) % 1, x = W * hash(i * 3) + Math.sin(lt + i) * 30 * u, y = hz * .3 + ph * hz * .4; ctx.strokeStyle = 'rgba(40,20,40,.8)'; ctx.lineWidth = 3 * u; ctx.beginPath(); ctx.moveTo(x - 12 * u, y); ctx.quadraticCurveTo(x - 5 * u, y - 7 * u * Math.sin(lt * 9 + i), x, y); ctx.quadraticCurveTo(x + 5 * u, y - 7 * u * Math.sin(lt * 9 + i), x + 12 * u, y); ctx.stroke(); }
    ctx.restore(); vign(.5); lb();
    const a = clamp((lt - .6) / .8); title('1306', W * .5, H * (V ? .18 : .2), { size: V ? 150 : 130, fill: '#fff1d6', a, ls: 30, glow: 'rgba(255,170,90,.8)' });
    title(V ? 'THE MOST EXPENSIVE' : 'THE MOST EXPENSIVE WEDDING GIFT IN HISTORY', W * .5, H * (V ? .245 : .29), { size: V ? 34 : 28, w: 700, fill: '#ffd7a8', a: clamp((lt - 1.4) / .8), ls: 8 }); if (V) title('WEDDING GIFT IN HISTORY', W * .5, H * .275, { size: 34, w: 700, fill: '#ffd7a8', a: clamp((lt - 1.7) / .8), ls: 8 });
    const sa = clamp((lt - 2.4) / .3); if (sa > 0) { ctx.save(); ctx.translate(W * (V ? .76 : .8), H * (V ? .34 : .4)); ctx.rotate(-.12); ctx.scale(1 + (1 - sa) * 1.5, 1 + (1 - sa) * 1.5); ctx.globalAlpha = sa; ctx.strokeStyle = '#d4261f'; ctx.lineWidth = 7 * u; ctx.strokeRect(-150 * u, -50 * u, 300 * u, 100 * u); ctx.strokeRect(-140 * u, -40 * u, 280 * u, 80 * u); title('2 PROVINCES', 0, 2 * u, { size: 40, fill: '#d4261f', ls: 2, maxW: 250 * u }); ctx.restore(); }
  } };

  // ---------- 1307 — the rescue at sea
  MOMENTS.wow_storm = { dur: 7, capY: .82, sfx: [[0, 'thunder'], [2.6, 'thunder']], render(lt, D, o) {
    const u = U(), V = H > W; const fl = Math.max(Math.exp(-((lt - .4) % 2.6) * 7) * ((lt % 2.6) > .4 ? 1 : 0), 0); const shake = fl * 8 * u;
    ctx.save(); ctx.translate((hash(Math.floor(lt * 30)) - .5) * shake, (hash(Math.floor(lt * 30) + 5) - .5) * shake);
    ctx.fillStyle = lin([[0, '#05060f'], [.6, '#0d1a2e'], [1, '#08111e']], 0, 0, 0, H); ctx.fillRect(-20, -20, W + 40, H + 40);
    for (let i = 0; i < 6; i++) cloudPuff(W * hash(i * 2) , H * (.06 + hash(i * 5) * .18), (260 + hash(i) * 200) * u, '#141c30', .9);
    if (fl > .05) { ctx.save(); ctx.globalAlpha = fl * .85; ctx.fillStyle = '#cfe0ff'; ctx.fillRect(-20, -20, W + 40, H * .55); ctx.restore();
      ctx.save(); ctx.strokeStyle = '#ffffff'; ctx.shadowColor = '#9fc0ff'; ctx.shadowBlur = 30 * u; ctx.lineWidth = 6 * u; ctx.globalAlpha = Math.min(1, fl * 2); ctx.beginPath(); let x = W * .78, y = 0; ctx.moveTo(x, y); for (let k = 0; k < 9; k++) { x += (hash(k + 11) - .5) * 90 * u; y += H * .045; ctx.lineTo(x, y); } ctx.stroke(); ctx.restore(); }
    // cliff + Cham tower, lit only by the flash
    const cy = H * (V ? .46 : .5); ctx.fillStyle = mix('#0a0f1c', '#3a4a6a', fl); ctx.beginPath(); ctx.moveTo(W * .58, H); ctx.lineTo(W * .62, cy + 40 * u); ctx.lineTo(W * .72, cy - 10 * u); ctx.lineTo(W, cy - 30 * u); ctx.lineTo(W, H); ctx.fill();
    const tx = W * .84, ty = cy - 30 * u, tc = mix('#0c1120', '#b4543a', fl * .9); ctx.fillStyle = tc; for (const [w, h, y0] of [[120, 120, 0], [96, 70, 120], [70, 55, 190], [44, 45, 245]]) ctx.fillRect(tx - w / 2 * u, ty - (y0 + h) * u, w * u, h * u); ctx.beginPath(); ctx.moveTo(tx - 22 * u, ty - 290 * u); ctx.lineTo(tx, ty - 340 * u); ctx.lineTo(tx + 22 * u, ty - 290 * u); ctx.fill();
    ctx.fillStyle = `rgba(255,190,110,${.25 + .5 * (1 - fl)})`; ctx.fillRect(tx - 12 * u, ty - 70 * u, 24 * u, 40 * u); gl(tx, ty - 50 * u, 60 * u, 'rgba(255,170,90,.5)');
    // the wave: a huge curling black wall, the boat riding its shoulder
    const wy = H * (V ? .66 : .7), sw = Math.sin(lt * .9) * 30 * u; ctx.fillStyle = lin([[0, '#1d3b52'], [.4, '#0b1a28'], [1, '#03070d']], 0, wy - 300 * u, 0, H); ctx.beginPath(); ctx.moveTo(-20, H); ctx.lineTo(-20, wy - 80 * u + sw); ctx.bezierCurveTo(W * .15, wy - 420 * u + sw, W * .38, wy - 380 * u, W * .44, wy - 250 * u); ctx.bezierCurveTo(W * .47, wy - 180 * u, W * .4, wy - 150 * u, W * .37, wy - 190 * u); ctx.bezierCurveTo(W * .5, wy - 60 * u, W * .7, wy - 40 * u, W + 20, wy - 10 * u); ctx.lineTo(W + 20, H); ctx.fill();
    for (let k = 0; k < 4; k++) { ctx.strokeStyle = `rgba(215,235,255,${.75 - k * .16})`; ctx.lineWidth = (18 - k * 4) * u; ctx.beginPath(); ctx.moveTo(W * .05, wy - 250 * u + sw + k * 14 * u); ctx.bezierCurveTo(W * .2, wy - 410 * u + sw + k * 14 * u, W * .38, wy - 375 * u + k * 10 * u, W * .44, wy - 250 * u + k * 8 * u); ctx.stroke(); }
    ctx.strokeStyle = 'rgba(120,170,210,.35)'; ctx.lineWidth = 3 * u; for (let k = 0; k < 7; k++) { ctx.beginPath(); ctx.moveTo(0, wy - 60 * u + k * 40 * u); ctx.bezierCurveTo(W * .3, wy - 120 * u + k * 40 * u, W * .6, wy - 10 * u + k * 30 * u, W, wy + k * 40 * u); ctx.stroke(); }
    for (let i = 0; i < 40; i++) { const x = W * (.3 + hash(i) * .2), y = wy - 250 * u - hash(i * 3) * 120 * u - ((lt * 200 + i * 37) % 160) * u; ctx.fillStyle = 'rgba(220,235,255,.6)'; ctx.beginPath(); ctx.arc(x, y, (2 + hash(i * 7) * 4) * u, 0, TAU); ctx.fill(); }
    const bx = W * .6, by = wy - 75 * u; ctx.save(); ctx.translate(bx, by + Math.sin(lt * 2.2) * 10 * u); ctx.rotate(-.22 + Math.sin(lt * 1.7) * .08); ctx.scale(1.7, 1.7); ctx.fillStyle = '#04070c'; ctx.beginPath(); ctx.moveTo(-90 * u, 0); ctx.quadraticCurveTo(0, 30 * u, 95 * u, -6 * u); ctx.lineTo(80 * u, -22 * u); ctx.lineTo(-80 * u, -18 * u); ctx.closePath(); ctx.fill();
    ctx.fillRect(-4 * u, -150 * u, 6 * u, 132 * u); ctx.beginPath(); ctx.moveTo(0, -150 * u); ctx.quadraticCurveTo(70 * u, -95 * u, 4 * u, -28 * u); ctx.fill(); for (const fx of [-50, -26]) { ctx.beginPath(); ctx.arc(fx * u, -34 * u, 9 * u, 0, TAU); ctx.fill(); ctx.fillRect((fx - 7) * u, -30 * u, 14 * u, 14 * u); }
    gl(40 * u, -40 * u, 70 * u, 'rgba(255,170,80,.9)'); ctx.fillStyle = '#ffd08a'; ctx.beginPath(); ctx.arc(40 * u, -40 * u, 7 * u, 0, TAU); ctx.fill(); ctx.restore();
    ctx.strokeStyle = 'rgba(170,200,240,.35)'; ctx.lineWidth = 2 * u; for (let i = 0; i < 160; i++) { const x = (hash(i * 1.7) * W * 1.3 + lt * 900 * u) % (W * 1.3) - W * .15, y = (hash(i * 4.1) * H + lt * 2400 * u) % H; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 18 * u, y + 46 * u); ctx.stroke(); }
    ctx.restore(); vign(.7); lb();
    const a = clamp((lt - 1) / .5); title('1307', W * (V ? .3 : .22), H * (V ? .2 : .24), { size: V ? 170 : 150, fill: '#e8f0ff', a, ls: 20, glow: 'rgba(140,180,255,.8)' });
    title('THE RESCUE', W * (V ? .3 : .22), H * (V ? .27 : .33), { size: 34, w: 700, fill: '#9fc0ff', a: clamp((lt - 1.6) / .5), ls: 16 });
  } };

  // ---------- the March South — aerial, dawn, settlers with lanterns
  MOMENTS.wow_south = { dur: 7, capY: .8, sfx: [[0, 'whoosh']], render(lt, D, o) {
    const u = U(), V = H > W, sc = 1.18 - lt * .02; ctx.save(); ctx.translate(W / 2, H / 2); ctx.rotate(-.12); ctx.scale(sc, sc); ctx.translate(-W / 2, -H / 2 - lt * 18 * u);
    ctx.fillStyle = '#1f3d2c'; ctx.fillRect(-W, -H, W * 3, H * 3);
    const cols = ['#4f8a3a', '#6aa443', '#3f7a3a', '#86b84a', '#5c9a3e', '#a7c45a'];
    const P = (c, r) => { const x = c * 165 * u, y = r * 118 * u; return [x + Math.sin(r * .7 + c * .3) * 38 * u + (hash(c * 13 + r * 7) - .5) * 30 * u, y + Math.sin(c * .9) * 22 * u + (hash(c * 5 + r * 11) - .5) * 26 * u]; };
    for (let r = -6; r < 22; r++) for (let c = -4; c < 10; c++) { const q = [P(c, r), P(c + 1, r), P(c + 1, r + 1), P(c, r + 1)], k = (r * 7 + c * 3 + 60) % 6, wet = hash(r * 3.1 + c * 7.7) > .62;
      ctx.beginPath(); q.forEach((p, i) => i ? ctx.lineTo(...p) : ctx.moveTo(...p)); ctx.closePath(); ctx.fillStyle = wet ? lin([[0, '#9fd0d8'], [1, '#4f8f9a']], q[0][0], q[0][1], q[2][0], q[2][1]) : cols[k]; ctx.fill(); ctx.lineWidth = 7 * u; ctx.strokeStyle = '#2c4f2a'; ctx.stroke(); ctx.lineWidth = 2 * u; ctx.strokeStyle = 'rgba(220,240,180,.35)'; ctx.stroke();
      if (!wet) { ctx.save(); ctx.clip(); ctx.strokeStyle = 'rgba(30,60,20,.18)'; ctx.lineWidth = 2 * u; for (let j = -6; j < 6; j++) { ctx.beginPath(); ctx.moveTo(q[0][0] + j * 14 * u, q[0][1]); ctx.lineTo(q[3][0] + j * 14 * u, q[3][1]); ctx.stroke(); } ctx.restore(); }
      else { ctx.save(); ctx.globalAlpha = .4; ctx.fillStyle = '#fff6e0'; ctx.beginPath(); ctx.ellipse((q[0][0] + q[2][0]) / 2, (q[0][1] + q[2][1]) / 2, 30 * u, 8 * u, -.3, 0, TAU); ctx.fill(); ctx.restore(); } }
    const dx = W * .52; ctx.fillStyle = '#c9b48a'; ctx.fillRect(dx - 14 * u, -H, 28 * u, H * 3); ctx.fillStyle = 'rgba(0,0,0,.18)'; ctx.fillRect(dx + 14 * u, -H, 8 * u, H * 3);
    for (let i = 0; i < 12; i++) { const y = -H * .2 + i * 165 * u + ((lt * 40 * u) % (165 * u)), x = dx + Math.sin(i * 1.3) * 3 * u; ctx.save(); ctx.translate(x, y); ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.beginPath(); ctx.ellipse(18 * u, 10 * u, 22 * u, 9 * u, .6, 0, TAU); ctx.fill();
      ctx.fillStyle = 'rgba(0,0,0,.28)'; ctx.beginPath(); ctx.ellipse(26 * u, 16 * u, 34 * u, 12 * u, .6, 0, TAU); ctx.fill();
      if (i % 3 !== 1) { ctx.strokeStyle = '#4a3420'; ctx.lineWidth = 4 * u; ctx.beginPath(); ctx.moveTo(-34 * u, 4 * u); ctx.lineTo(34 * u, -4 * u); ctx.stroke(); for (const d of [-1, 1]) { ctx.fillStyle = '#8a6a3a'; ctx.beginPath(); ctx.arc(d * 36 * u, -d * 4 * u, 11 * u, 0, TAU); ctx.fill(); ctx.fillStyle = '#6aa443'; ctx.beginPath(); ctx.arc(d * 36 * u, -d * 4 * u - 3 * u, 6 * u, 0, TAU); ctx.fill(); } }
      ctx.fillStyle = '#f0dca4'; ctx.beginPath(); ctx.arc(0, 0, 22 * u, 0, TAU); ctx.fill(); ctx.fillStyle = 'rgba(160,120,60,.35)'; ctx.beginPath(); ctx.arc(5 * u, 5 * u, 22 * u, 0, Math.PI); ctx.fill(); ctx.strokeStyle = 'rgba(120,90,40,.55)'; ctx.lineWidth = 2 * u; for (const rr of [8, 15]) { ctx.beginPath(); ctx.arc(0, 0, rr * u, 0, TAU); ctx.stroke(); }
      if (i % 2) { gl(16 * u, 14 * u, 34 * u, 'rgba(255,190,90,.8)'); ctx.fillStyle = '#ffd98a'; ctx.beginPath(); ctx.arc(16 * u, 14 * u, 4.5 * u, 0, TAU); ctx.fill(); } if (i % 5 === 2) { ctx.fillStyle = '#5a3e26'; ctx.beginPath(); ctx.ellipse(-2 * u, 30 * u, 20 * u, 12 * u, 0, 0, TAU); ctx.fill(); } ctx.restore(); }
    ctx.restore();
    for (let k = 0; k < 5; k++) { const y = H * (.2 + k * .17) + Math.sin(lt * .3 + k) * 20 * u, xo = ((lt * 30 * (k + 1)) % (W * 1.5)) - W * .25; ctx.save(); ctx.globalAlpha = .28; ctx.fillStyle = lin([[0, 'rgba(255,240,220,0)'], [.5, '#fff1dc'], [1, 'rgba(255,240,220,0)']], xo - W * .6, 0, xo + W * .6, 0); ctx.fillRect(0, y - 60 * u, W, 120 * u); ctx.restore(); }
    ctx.fillStyle = lin([[0, 'rgba(255,170,90,.35)'], [.5, 'rgba(255,170,90,0)']], 0, 0, W, H); ctx.fillRect(0, 0, W, H); vign(.6); lb();
    const a = clamp((lt - .8) / .8); title('700', W * .08, H * (V ? .2 : .26), { size: V ? 230 : 200, fill: '#fff6e0', a, glow: 'rgba(0,0,0,.6)', align: 'left' }); title('YEARS OF WALKING SOUTH', W * .09, H * (V ? .28 : .37), { size: V ? 30 : 26, w: 700, fill: '#ffe0a8', a: clamp((lt - 1.5) / .6), ls: 6, align: 'left', maxW: W * .6 });
    const q = clamp((lt - 2) / 1); if (q > 0) { ctx.save(); ctx.globalAlpha = q; ctx.strokeStyle = '#fff'; ctx.lineWidth = 4 * u; const ax = W * (V ? .88 : .9); ctx.beginPath(); ctx.moveTo(ax, H * .3); ctx.lineTo(ax, H * .3 + 160 * u * q); ctx.stroke(); ctx.beginPath(); ctx.moveTo(ax - 14 * u, H * .3 + 145 * u * q); ctx.lineTo(ax, H * .3 + 165 * u * q); ctx.lineTo(ax + 14 * u, H * .3 + 145 * u * q); ctx.stroke(); title('S', ax, H * .27, { size: 40, fill: '#fff' }); ctx.restore(); }
  } };

  // ---------- 1698 → today: one river, two times
  MOMENTS.wow_morph = { dur: 7, capY: .82, sfx: [[0, 'whoosh'], [2.2, 'slide']], render(lt, D, o) {
    const u = U(), V = H > W, cut = H * (.5 + Math.sin(lt * .5) * .015), drift = lt * 10 * u;
    // top: 1698 — Prey Nokor, stilt houses at dawn, sepia
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, cut); ctx.clip(); ctx.fillStyle = lin([[0, '#f3d9a6'], [.7, '#e9b77a'], [1, '#c98a52']], 0, 0, 0, cut); ctx.fillRect(0, 0, W, cut); gl(W * .3, cut * .55, 300 * u, 'rgba(255,230,170,.8)');
    const ry = cut * .78; mtn(2, ry - 10 * u, 60, '#b98a5c', 400, drift * .3); ctx.fillStyle = '#7a5a3a'; for (let i = 0; i < 9; i++) { const x = ((i * 150 + drift) % (W + 200)) - 100, h = (70 + hash(i) * 40) * u; for (let p = -1; p <= 1; p += 2) ctx.fillRect(x + p * 40 * u, ry - 30 * u, 6 * u, 60 * u); ctx.fillRect(x - 55 * u, ry - 30 * u - h * .4, 110 * u, h * .4); ctx.beginPath(); ctx.moveTo(x - 70 * u, ry - 30 * u - h * .4); ctx.lineTo(x, ry - 30 * u - h); ctx.lineTo(x + 70 * u, ry - 30 * u - h * .4); ctx.fill(); }
    for (let i = 0; i < 4; i++) { const x = ((i * 330 + drift * 1.8) % (W + 300)) - 150; ctx.fillStyle = '#5a3e26'; ctx.beginPath(); ctx.moveTo(x - 60 * u, ry + 30 * u); ctx.quadraticCurveTo(x, ry + 48 * u, x + 60 * u, ry + 30 * u); ctx.fill(); ctx.beginPath(); ctx.arc(x, ry + 18 * u, 9 * u, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.moveTo(x - 18 * u, ry + 12 * u); ctx.lineTo(x, ry - 2 * u); ctx.lineTo(x + 18 * u, ry + 12 * u); ctx.fill(); }
    ctx.fillStyle = 'rgba(120,80,40,.25)'; ctx.fillRect(0, ry + 10 * u, W, cut - ry); ctx.restore();
    // bottom: today — Sài Gòn at night, same river line
    ctx.save(); ctx.beginPath(); ctx.rect(0, cut, W, H - cut); ctx.clip(); ctx.fillStyle = lin([[0, '#0b0f2c'], [.6, '#24135a'], [1, '#0a0820']], 0, cut, 0, H); ctx.fillRect(0, cut, W, H - cut);
    const by = cut + (H - cut) * .62; for (let i = 0; i < 22; i++) { const x = ((i * 70 - drift * .8) % (W + 140)) - 70, h = (80 + hash(i * 3) * 260) * u * (i === 11 ? 1.8 : 1), w = (40 + hash(i * 5) * 50) * u; ctx.fillStyle = i === 11 ? '#2b3a8a' : `rgb(${30 + hash(i) * 30},${30 + hash(i) * 30},${70 + hash(i) * 50})`; ctx.fillRect(x - w / 2, by - h, w, h);
      for (let k = 0; k < h / (14 * u) - 1; k++) for (let j = 0; j < 3; j++) if (hash(i * 31 + k * 7 + j) > .45) { ctx.fillStyle = hash(i + k) > .8 ? '#ff7ad1' : '#ffd98a'; ctx.globalAlpha = .55 + .45 * Math.sin(lt * 2 + k + j); ctx.fillRect(x - w / 2 + (6 + j * (w - 12) / 3) , by - h + 8 * u + k * 14 * u, 5 * u, 6 * u); ctx.globalAlpha = 1; } }
    ctx.fillStyle = '#060818'; ctx.fillRect(0, by, W, H - by); for (let i = 0; i < 60; i++) { const x = hash(i * 2.2) * W, w = (20 + hash(i) * 80) * u; ctx.fillStyle = hash(i) > .7 ? 'rgba(255,122,209,.5)' : 'rgba(255,217,138,.45)'; ctx.fillRect(x + Math.sin(lt * 2 + i) * 6 * u, by + 8 * u + hash(i * 9) * (H - by) * .8, w, 3 * u); }
    ctx.restore();
    // the seam: a glowing time line + labels set on the river
    ctx.fillStyle = '#fff'; ctx.fillRect(0, cut - 3 * u, W, 6 * u); gl(W / 2, cut, 400 * u, 'rgba(255,255,255,.25)'); vign(.45); lb();
    title('1698', W * .14, cut - 70 * u, { size: V ? 92 : 80, align: 'left', fill: '#5a3a1e', a: clamp((lt - .4) / .5) }); title('PREY NOKOR', W * .14, cut - 20 * u, { size: 26, w: 700, align: 'left', fill: '#7a5230', ls: 10, a: clamp((lt - .8) / .5) });
    title('TODAY', W * .86, cut + 70 * u, { size: V ? 92 : 80, align: 'right', fill: '#ffffff', glow: 'rgba(255,122,209,.9)', a: clamp((lt - 1.6) / .5) }); title('SÀI GÒN', W * .86, cut + 120 * u, { size: 26, w: 700, align: 'right', fill: '#ff9ade', ls: 10, a: clamp((lt - 2) / .5) });
  } };
})();
