/* EP.7 — the Ha Giang Loop as a little animated film. Dave rides 350 km of karst mountains and counts every dong.
   Illustrated sets: three parallax karst layers + haze, a road that scrolls under the bike, terraces, a sleeper bus at night,
   a rental shop, a checkpoint, a clay homestay, Ma Pi Leng canyon, a bus cabin at night, Hoi An lanterns.
   A paper receipt clipped top-left counts up (keys spent= / adds="amount@caption|…").
   `# vis kind=hg act=hook|bus|rent|check|ride|stay|pass|rider|sum|budget|rules|tease` */
'use strict';
(function () {
  if (!window.VIS || !VIS.K || !window.NUTWORLD || !window.TOON) { console.warn('ep7_hagiang needs vis + nutworld + toontype'); return; }
  const K = VIS.K, NW = window.NUTWORLD;
  const ch = id => (CHAR[id] || CHAR.dave).spec;
  const P = (lt, a, d = .4) => clamp((lt - a) / d);
  const T0 = (c, k, d) => c && c[k] ? c[k][0] + .05 : d;
  const T1 = (c, k, d) => c && c[k] ? c[k][1] : d;
  const cap = (o, key, def) => (o[key] != null ? +o[key] : def);
  const fmt = n => Math.round(n).toLocaleString('en-US');
  let LT = 0;
  function geo() { const u = U(), v = H > W; const near = H * (v ? .72 : .82); return { u, v, hz: H * (v ? .44 : .47), near, rT: near - 62 * u, rB: near + 46 * u, k: u * (v ? 1.12 : 1.15), s: u * (v ? 1.08 : 1.2) }; }

  // ---------- palettes per time of day
  const PAL = {
    day: { sky: ['#2f66c8', '#62aee8', '#bfe6fb'], far: '#93abe0', mid: '#7d97d8', near: '#4f9a78', haze: '#eef8ff', grass: ['#7cc874', '#3f8f5c'], road: '#4b4a80', drop: ['#3f8a5c', '#24543e'], sun: 'sun' },
    dawn: { sky: ['#4b3f95', '#d27a9a', '#ffc08a'], far: '#c095c4', mid: '#8a64a8', near: '#4f6a86', haze: '#ffd8c8', grass: ['#7ab07a', '#3f6f5c'], road: '#4a4278', drop: ['#3f6a5c', '#26403e'], sun: 'low' },
    sunset: { sky: ['#3b2b7b', '#ff7272', '#ffb878'], far: '#d08aa0', mid: '#94508e', near: '#433d72', haze: '#ffc8a8', grass: ['#8a9a62', '#4a5a4a'], road: '#3e3468', drop: ['#3a3a5a', '#22223a'], sun: 'low' },
    night: { sky: ['#070a26', '#141650', '#2a2a7a'], far: '#2e2e72', mid: '#22225a', near: '#171744', haze: '#3c3c86', grass: ['#2a4a5a', '#18283e'], road: '#22224e', drop: ['#16243a', '#0c1426'], sun: 'moon' },
    mist: { sky: ['#4f6ea8', '#86a8d4', '#c4d8ee'], far: '#7f96c2', mid: '#55689a', near: '#6a9a8a', haze: '#f4f8ff', grass: ['#8ac08a', '#4f8a6a'], road: '#56588a', drop: ['#4f7a6a', '#2e4e48'], sun: 'none' }
  };
  function skyFill(time) { const p = PAL[time] || PAL.day, u = U(), g0 = ctx.createLinearGradient(0, 0, 0, H * .75); g0.addColorStop(0, p.sky[0]); g0.addColorStop(.55, p.sky[1]); g0.addColorStop(1, p.sky[2]); ctx.fillStyle = g0; ctx.fillRect(0, 0, W, H);
    if (p.sun === 'sun') { glow(W * .78, H * .12, 220 * u, '#fff6c8', .3); circ(W * .78, H * .12, 54 * u, '#fffbe6', 0); }
    if (p.sun === 'low') { glow(W * .7, H * .36, 380 * u, '#ffd08a', .55); circ(W * .7, H * .36, 70 * u, '#ffe9b8', 0); }
    if (p.sun === 'moon') { const r = rng(5); for (let i = 0; i < 70; i++) { ctx.globalAlpha = .3 + .5 * Math.abs(Math.sin(LT * 1.5 + i)); circ(r() * W, r() * H * .45, (1 + r() * 2.2) * u, '#ffffff', 0); } ctx.globalAlpha = 1; glow(W * .8, H * .1, 200 * u, '#cfd8ff', .35); circ(W * .8, H * .1, 44 * u, '#f4f6ff', 0); circ(W * .8 + 16 * u, H * .1 - 8 * u, 40 * u, p.sky[0], 0); }
    if (time !== 'night') { for (let b = 0; b < 5; b++) { const x = ((LT * (55 + b * 14) * u + b * 310 * u) % (W + 200 * u)) - 100 * u, y = H * (.07 + b * .022) + Math.sin(LT * 2 + b) * 10 * u, f = Math.sin(LT * 12 + b) * 10 * u; ctx.save(); ctx.lineWidth = 4 * u; ctx.strokeStyle = 'rgba(30,25,70,.55)'; ctx.beginPath(); ctx.moveTo(x - 18 * u, y - f); ctx.quadraticCurveTo(x - 8 * u, y - 6 * u, x, y); ctx.quadraticCurveTo(x + 8 * u, y - 6 * u, x + 18 * u, y - f); ctx.stroke(); ctx.restore(); } } }

  // ---------- karst layers (cached, seamless wrap)
  const KC = {};
  function karstLayer(time, li) { const key = time + li + 'x' + W + 'x' + H; if (KC[key]) return KC[key]; const g = geo(), u = g.u, p = PAL[time] || PAL.day; const cw = Math.ceil(W * 2), cv = mkCanvas(cw, H), prev = ctx; ctx = cv.getContext('2d');
    try { const col = [p.far, p.mid, p.near][li], base = g.hz + [0, (g.v ? 90 : 60), (g.v ? 230 : 150)][li] * u, hMax = [(g.v ? 560 : 400), (g.v ? 470 : 330), (g.v ? 380 : 270)][li] * u, r = rng(31 + li * 7);
      const cones = []; let x = 0; while (x < cw) { const w = (150 + r() * 230) * u * (1 + li * .2), h = hMax * (.45 + r() * .55); cones.push([x, w, h]); x += w * (.45 + r() * .3); }
      const cone = (cx, w, h, fill) => { ctx.beginPath(); ctx.moveTo(cx - w / 2, base + 4 * u); ctx.bezierCurveTo(cx - w * .48, base - h * .55, cx - w * .3, base - h, cx, base - h); ctx.bezierCurveTo(cx + w * .3, base - h, cx + w * .48, base - h * .55, cx + w / 2, base + 4 * u); ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); };
      for (const off of [-cw, 0, cw]) cones.forEach(([cx, w, h]) => { const gr = ctx.createLinearGradient(0, base - h, 0, base); gr.addColorStop(0, shade(col, .06)); gr.addColorStop(1, col); cone(cx + off, w, h, gr); ctx.save(); ctx.globalAlpha = .16; cone(cx + off - w * .12, w * .55, h * .96, '#ffffff'); ctx.restore(); });
      ctx.fillStyle = col; ctx.fillRect(0, base, cw, H - base);
      if (li === 2) { // terraces + little trees on the near slope
        for (let j = 0; j < 9; j++) { const y = base + 30 * u + j * 26 * u; ctx.beginPath(); for (let xx = 0; xx <= cw; xx += 40 * u) { const yy = y + Math.sin(xx / (260 * u) * TAU / 2 + j) * 12 * u; xx ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.lineWidth = 6 * u; ctx.strokeStyle = shade(col, .08 + (j % 2) * .04); ctx.stroke(); }
        for (let t = 0; t < 26; t++) { const tx = r() * cw, ty = base + r() * 200 * u; circ(tx, ty, (14 + r() * 14) * u, shade(col, -.06), 0); } }
    } finally { ctx = prev; } return (KC[key] = cv); }
  function mountains(time, off, fog = 0) { const g = geo(), u = g.u, p = PAL[time] || PAL.day; [0, 1, 2].forEach(li => { const cv = karstLayer(time, li), cw = cv.width, sp = [.06, .14, .3][li], x = -(((off * sp) % cw) + cw) % cw; ctx.drawImage(cv, x, 0); if (x + cw < W) ctx.drawImage(cv, x + cw, 0);
      if (li < 2) { const yb = g.hz + [0, (g.v ? 90 : 60)][li] * u, hg = ctx.createLinearGradient(0, yb - 120 * u, 0, yb + 40 * u); hg.addColorStop(0, rgba(p.haze, 0)); hg.addColorStop(1, rgba(p.haze, .55)); ctx.fillStyle = hg; ctx.fillRect(0, yb - 120 * u, W, 160 * u); } });
    ctx.save(); ctx.globalAlpha = .28 + fog * .5; for (let m = 0; m < 4; m++) { const x = ((LT * 26 + m * 420) * u + off * .1) % (W + 700 * u) - 350 * u; ell(x, g.hz + (g.v ? 130 : 90) * u + m * 22 * u, 320 * u, 34 * u, p.haze, 0); } ctx.restore(); }
  // ground: slope band, road with scrolling dashes and guard posts, drop below
  function ground(time, off, o = {}) { const g = geo(), u = g.u, p = PAL[time] || PAL.day; const top = g.hz + (g.v ? 230 : 150) * u + 160 * u;
    { const gg = ctx.createLinearGradient(0, top, 0, g.rT); gg.addColorStop(0, p.grass[0]); gg.addColorStop(1, p.grass[1]); ctx.fillStyle = gg; ctx.fillRect(0, Math.min(top, g.rT - 40 * u), W, g.rT - Math.min(top, g.rT - 40 * u) + 2); }
    for (let t = 0; t < 9; t++) { const x = (((t * 260 * u - off * .6) % (W + 300 * u)) + W + 300 * u) % (W + 300 * u) - 150 * u, y = g.rT - 14 * u; circ(x, y - 40 * u, 46 * u, shade(p.grass[1], -.05), 0); circ(x + 34 * u, y - 24 * u, 32 * u, shade(p.grass[1], .04), 0); rr(x - 5 * u, y - 10 * u, 10 * u, 16 * u, 3 * u, '#5a3a2a', 0); }
    ctx.fillStyle = p.road; ctx.fillRect(0, g.rT, W, g.rB - g.rT); rr(0, g.rT - 6 * u, W, 8 * u, 0, shade(p.road, .14), 0);
    const dl = 90 * u, gap = 70 * u; for (let x = -((off % (dl + gap)) + dl + gap) % (dl + gap); x < W; x += dl + gap) rr(x, (g.rT + g.rB) / 2 - 3 * u, dl, 6 * u, 3 * u, 'rgba(255,255,255,.75)', 0);
    { const dg = ctx.createLinearGradient(0, g.rB, 0, H); dg.addColorStop(0, p.drop[0]); dg.addColorStop(1, p.drop[1]); ctx.fillStyle = dg; ctx.fillRect(0, g.rB, W, H - g.rB); }
    if (o.posts !== false) { const st = 170 * u; for (let x = -((off % st) + st) % st; x < W + st; x += st) { rr(x, g.rB - 8 * u, 16 * u, 46 * u, 4 * u, '#f6f2ff', 0); rr(x, g.rB - 8 * u, 16 * u, 12 * u, 3 * u, '#e2452e', 0); } }
    for (let t = 0; t < 14; t++) { const x = (((t * 137 * u - off * 1.2) % W) + W) % W, y = g.rB + 60 * u + (t % 4) * 50 * u; ell(x, y, 22 * u, 8 * u, shade(p.drop[0], .06), 0); } }
  // a rider on a motorbike (+ optional passenger); facing right unless flip
  function bike(x, y, k, lt, o = {}) { const u = U(), spin = o.still ? 0 : lt * (o.spin ?? 12), bob = o.still ? 0 : Math.sin(lt * 22 + (o.ph || 0)) * 2.2 * u;
    ctx.save(); if (o.flip) { ctx.translate(x, 0); ctx.scale(-1, 1); ctx.translate(-x, 0); } if (o.lean) { ctx.translate(x, y); ctx.rotate(o.lean); ctx.translate(-x, -y); }
    if (!o.still) for (let pf = 0; pf < 4; pf++) { const q = ((lt * 2.4 + pf / 4) % 1); ctx.save(); ctx.globalAlpha = .35 * (1 - q); circ(x - 120 * k - q * 140 * k, y - 40 * k - q * 20 * k, (12 + q * 26) * k, '#ffffff', 0); ctx.restore(); }
    drawProp('moto', x, y + 4 * u, k * .7, { spin, color: o.col || '#e2452e' }, lt);
    if (o.light) { ctx.save(); const lg = ctx.createRadialGradient(x + 70 * k, y - 80 * k, 0, x + 70 * k, y - 80 * k, 360 * k); lg.addColorStop(0, 'rgba(255,246,190,.7)'); lg.addColorStop(1, 'rgba(255,246,190,0)'); ctx.fillStyle = lg; ctx.beginPath(); ctx.moveTo(x + 70 * k, y - 80 * k); ctx.lineTo(x + 460 * k, y - 170 * k); ctx.lineTo(x + 460 * k, y + 20 * k); ctx.closePath(); ctx.fill(); ctx.restore(); }
    if (o.pass) person(x - 104 * k, y - 34 * k + bob, k * .6, ch(o.pass), { t: lt + 1, pose: 'ride', expr: o.passExpr || 'joy', headwear: { type: 'helmet', color: o.passHelmet || '#ffd34a' } });
    if (o.who !== null) person(x - 28 * k, y - 22 * k + bob, k * .64, ch(o.who || 'dave'), { t: lt, pose: 'ride', expr: o.expr || 'joy', headwear: { type: 'helmet', color: o.helmet || '#ffd34a' } });
    ctx.restore(); }
  function fgLeaves(lt) { const u = U(); ctx.save(); ctx.filter = `blur(${8 * u}px)`; ctx.globalAlpha = .85; for (const [x, sd] of [[0, 1], [W, -1]]) { circ(x + sd * 30 * u, H * .99, 150 * u, '#2e6a4a', 0); circ(x + sd * 140 * u, H * 1.03, 110 * u, '#3f8a5a', 0); ell(x + sd * 80 * u, H * .92, 46 * u, 86 * u, '#4fa05a', 0, sd * .5 + Math.sin(lt) * .05); } ctx.restore(); }
  function motes(lt, n = 16, col = '#fff6e0') { const u = U(), r = rng(29); for (let i = 0; i < n; i++) { ctx.globalAlpha = .12 + r() * .25; circ((r() * W + lt * (8 + r() * 14) * u) % W, (r() * H - lt * (5 + r() * 8) * u + H * 4) % H, (1.5 + r() * 3.5) * u, col, 0); } ctx.globalAlpha = 1; }
  function cam(z, fx, fy, shake, fn) { ctx.save(); ctx.translate(fx + shake, fy + shake * .4); ctx.scale(z, z); ctx.translate(-fx, -fy); fn(); ctx.restore(); }
  function sign(x, y, w, h, lines, o = {}) { const u = U(); if (o.post !== false) rr(x + w / 2 - 6 * u, y + h - 4 * u, 12 * u, o.post || 80 * u, 3 * u, '#5a3a2a', 0); rr(x + 6 * u, y + 8 * u, w, h, 12 * u, 'rgba(20,15,50,.35)', 0); rr(x, y, w, h, 12 * u, o.bg || '#fff6e0', 0);
    lines.forEach((ln, i) => T(ln, x + w / 2, y + h * (i + .5) / lines.length + 2 * u, { size: (o.size || 30) * u * (i === 0 && o.big ? 1.25 : 1), font: o.font || 'heavy', fill: i === 0 ? (o.c1 || '#e2452e') : (o.c2 || '#2a2350'), lw: 0 })); }

  // ---------- running receipt (top-left)
  function tally(o, c, lt) { if (o.spent == null) return; const u = U(), v = H > W, adds = String(o.adds || '').split('|').filter(Boolean).map(s => { const [a, k] = s.split('@'); return [+a, +k]; });
    const total = +o.spent, base = total - adds.reduce((s, a) => s + a[0], 0); let val = base, pop = 0, last = null;
    adds.forEach(([a, k]) => { const t = T0(c, k, .6) + .35, q = E.out(P(lt, t, .7)); val += a * q; if (lt > t && lt < t + 1.6) { pop = Math.max(pop, 1); last = [a, t]; } });
    const x = W * (v ? .05 : .025), y = H * (v ? .085 : .045), w = (v ? 330 : 300) * u, h = (v ? 128 : 110) * u, sw = Math.sin(lt * 1.6) * .02;
    ctx.save(); ctx.translate(x + w / 2, y); ctx.rotate(sw - .03); ctx.translate(-w / 2, 0);
    rr(8 * u, 10 * u, w, h, 6 * u, 'rgba(20,15,50,.28)', 0); ctx.fillStyle = '#fffdf4'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(w, 0); ctx.lineTo(w, h); for (let zx = w; zx > 0; zx -= 22 * u) { ctx.lineTo(zx - 11 * u, h - 10 * u); ctx.lineTo(zx - 22 * u, h); } ctx.closePath(); ctx.fill();
    rr(w / 2 - 50 * u, -18 * u, 100 * u, 30 * u, 8 * u, '#2a2350', 0); rr(w / 2 - 34 * u, -26 * u, 68 * u, 14 * u, 6 * u, '#8a84c8', 0);
    T('SPENT SO FAR', w / 2, 30 * u, { size: 20 * u, font: 'heavy', fill: '#8a84c8', lw: 0 }); const big = pop ? 1 + .12 * Math.sin(Math.min(1, (lt - last[1]) / .5) * Math.PI) : 1;
    T(fmt(Math.round(val / 1000) * 1000) + ' VND', w / 2, 74 * u, { size: (v ? 38 : 34) * u * big, font: 'toon', fill: '#2a2350', lw: 0 }); ctx.restore();
    if (last) { const q = clamp((lt - last[1]) / 1.4); ctx.save(); ctx.globalAlpha = 1 - E.in(q); T((last[0] > 0 ? '+' : '−') + fmt(Math.abs(last[0])), x + w + (v ? 150 : 140) * u, y + h * .5 - q * 30 * u, { size: (v ? 46 : 40) * u, font: 'toon', fill: last[0] > 0 ? '#ffd34a' : '#6fe0a8', stroke: '#1b1530', lw: 9 * u }); ctx.restore(); } }

  // ---------- painters for the sets
  function sleeperBus(x, y, len, lt, o = {}) { const u = U(), hgt = 300 * u, top = y - hgt - 40 * u, spin = o.still ? 0 : lt * 9; ctx.save();
    if (o.beam) { const lg = ctx.createRadialGradient(x + len, y - 70 * u, 0, x + len, y - 70 * u, 700 * u); lg.addColorStop(0, 'rgba(255,240,180,.55)'); lg.addColorStop(1, 'rgba(255,240,180,0)'); ctx.fillStyle = lg; ctx.beginPath(); ctx.moveTo(x + len, y - 80 * u); ctx.lineTo(x + len + 800 * u, y - 200 * u); ctx.lineTo(x + len + 800 * u, y + 40 * u); ctx.closePath(); ctx.fill(); }
    rr(x, top, len, hgt, 46 * u, o.col || '#f2f0fa', 0); rr(x, top + hgt * .62, len, hgt * .12, 0, '#e2452e', 0); rr(x, top + hgt * .74, len, hgt * .05, 0, '#ffd34a', 0);
    const n = 6, ww = (len - 140 * u) / n; for (let r2 = 0; r2 < 2; r2++) for (let i = 0; i < n; i++) { const wx = x + 40 * u + i * ww, wy = top + 26 * u + r2 * hgt * .3; rr(wx, wy, ww - 14 * u, hgt * .24, 12 * u, o.night ? '#ffd88a' : '#9fd0f0', 0); if (o.night) glow(wx + ww / 2, wy + hgt * .12, 90 * u, '#ffcf7a', .25); }
    rr(x + len - 110 * u, top + 30 * u, 90 * u, hgt * .5, 20 * u, '#2a3a6a', 0); circ(x + len - 16 * u, top + hgt * .8, 14 * u, '#fff6c0', 0);
    for (const bx of [.2, .78]) { circ(x + len * bx, y - 40 * u, 48 * u, '#211c48', 0); const a = spin; ctx.save(); ctx.translate(x + len * bx, y - 40 * u); ctx.rotate(a); rr(-20 * u, -4 * u, 40 * u, 8 * u, 3 * u, '#8a84c8', 0); ctx.restore(); circ(x + len * bx, y - 40 * u, 14 * u, '#8a84c8', 0); }
    ctx.restore(); return { top, hgt, ww, n }; }
  function shop(x, y, w, h, time) { const u = U(); rr(x, y - h, w, h, 10 * u, '#f0c98a', 0); rr(x, y - h, w, 40 * u, 0, '#c96b4a', 0); for (let i = 0; i < 9; i++) rr(x + i * w / 9, y - h + 40 * u, w / 9, 50 * u, 0, i % 2 ? '#ffffff' : '#e2452e', 0); rr(x + w * .1, y - h * .6, w * .8, h * .6, 6 * u, '#3a2a4a', 0); glow(x + w / 2, y - h * .3, 220 * u, '#ffcf7a', time === 'dawn' ? .3 : .12);
    rr(x + w * .12, y - h - 90 * u, w * .76, 80 * u, 12 * u, '#2a2350', 0); T('MOTORBIKE RENTAL', x + w / 2, y - h - 50 * u, { size: 34 * u, font: 'heavy', fill: '#ffd34a', lw: 0 }); }
  function homestay(x, y, s, lt) { const u = U() * s; ctx.save(); ctx.translate(x, y); rr(-330 * u, -260 * u, 660 * u, 260 * u, 8 * u, '#c98a52', 0); for (let i = 0; i < 6; i++) line(-320 * u, -230 * u + i * 40 * u, 320 * u, -230 * u + i * 40 * u, 3 * u, 'rgba(90,50,20,.25)');
    poly([[-380 * u, -250 * u], [0, -400 * u], [380 * u, -250 * u]], '#3a2f4a', 0); for (let i = 0; i < 14; i++) line(-360 * u + i * 52 * u, -258 * u, -20 * u + i * 3 * u, -392 * u, 3 * u, 'rgba(255,255,255,.08)');
    rr(-70 * u, -190 * u, 140 * u, 190 * u, 6 * u, '#ffcf7a', 0); glow(0, -100 * u, 260 * u, '#ffb84d', .45); rr(-230 * u, -190 * u, 90 * u, 70 * u, 6 * u, '#ffcf7a', 0); rr(140 * u, -190 * u, 90 * u, 70 * u, 6 * u, '#ffcf7a', 0);
    line(0, -400 * u, 0, -330 * u, 2 * u, '#2a2350'); circ(0, -322 * u, 10 * u, '#fff3b0', 0); glow(0, -322 * u, 80 * u, '#ffd98a', .5); ctx.restore(); }
  function stoneFence(y, u) { for (let x = 0; x < W; x += 60 * u) { ell(x + 30 * u, y - 20 * u, 34 * u, 22 * u, '#6a6488', 0); ell(x + 6 * u, y - 46 * u, 26 * u, 18 * u, '#7a7498', 0); } }
  function canyon(time, lt, zoom) { const g = geo(), u = g.u, p = PAL[time] || PAL.mist; const ry = g.rT - (g.v ? 470 : 300) * u; // river line far below
    const wall = (pts, c0, c1) => { const gr = ctx.createLinearGradient(0, H * .1, 0, ry + 60 * u); gr.addColorStop(0, c0); gr.addColorStop(1, c1); ctx.fillStyle = gr; ctx.beginPath(); pts.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.closePath(); ctx.fill(); };
    ctx.fillStyle = '#2f4a6a'; ctx.fillRect(W * .3, ry - 10 * u, W * .4, H - ry);
    wall([[0, H * .14], [W * .2, H * .2], [W * .3, ry - 120 * u], [W * .37, ry - 30 * u], [W * .43, ry + 14 * u], [W * .43, H], [0, H]], '#566ea6', '#24324f');
    wall([[W, H * .1], [W * .78, H * .2], [W * .7, ry - 140 * u], [W * .63, ry - 30 * u], [W * .57, ry + 14 * u], [W * .57, H], [W, H]], '#46598f', '#1c2844');
    ctx.save(); ctx.globalAlpha = .22; for (let i = 0; i < 9; i++) { const y = H * .22 + i * (ry - H * .22) / 9; line(W * (.02 + i * .03), y, W * (.2 + i * .022), y + 18 * u, 5 * u, '#c8d8f0'); line(W * (.98 - i * .03), y + 10 * u, W * (.8 - i * .02), y + 26 * u, 5 * u, '#c8d8f0'); } ctx.restore();
    for (let i = 0; i < 12; i++) { const side = i % 2, x = side ? W * (.66 + (i * .037) % .3) : W * (.04 + (i * .041) % .28), y = H * .24 + ((i * 97) % 100) / 100 * (ry - H * .3); circ(x, y, (16 + i % 3 * 8) * u, '#3f7a5a', 0); }
    ctx.beginPath(); for (let x = W * .36; x <= W * .64; x += 8 * u) { const yy = ry + Math.sin(x / (60 * u) + lt * .5) * 6 * u; x === W * .36 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy); } ctx.lineWidth = 30 * u; ctx.strokeStyle = '#3fc8c0'; ctx.stroke(); ctx.lineWidth = 6 * u; ctx.strokeStyle = 'rgba(255,255,255,.45)'; ctx.stroke();
    const bx = W * .42 + ((lt * 14 * u) % (W * .16)), by = ry + Math.sin(bx / (60 * u) + lt * .5) * 6 * u; ell(bx, by - 2 * u, 22 * u, 7 * u, '#e2452e', 0); rr(bx - 6 * u, by - 16 * u, 12 * u, 10 * u, 2 * u, '#fff6e0', 0); ctx.save(); ctx.globalAlpha = .5; line(bx - 26 * u, by + 4 * u, bx - 60 * u, by + 7 * u, 3 * u, '#ffffff'); ctx.restore();
    return { bx, by, ry }; }
  function fogBank(a, lt) { if (a <= 0) return; const u = U(); ctx.save(); for (let i = 0; i < 9; i++) { const x = W * 1.3 - ((lt * 60 * u + i * 260 * u) % (W * 1.8)), y = H * (.3 + (i % 4) * .14); ctx.globalAlpha = a * .55; ell(x, y, 420 * u, 130 * u, '#f6f8ff', 0); } ctx.globalAlpha = a * .45; ctx.fillStyle = '#eef3fb'; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  function pump(x, y, u) { rr(x - 40 * u, y - 210 * u, 80 * u, 210 * u, 14 * u, '#e2452e', 0); rr(x - 28 * u, y - 190 * u, 56 * u, 40 * u, 6 * u, '#2a2350', 0); T('FUEL', x, y - 170 * u, { size: 18 * u, font: 'heavy', fill: '#ffd34a', lw: 0 }); rr(x - 50 * u, y - 236 * u, 100 * u, 30 * u, 10 * u, '#ffd34a', 0); }
  function booth(x, y, u) { rr(x - 70 * u, y - 260 * u, 140 * u, 260 * u, 10 * u, '#f2f0fa', 0); rr(x - 70 * u, y - 260 * u, 140 * u, 40 * u, 6 * u, '#2f6fd0', 0); rr(x - 50 * u, y - 200 * u, 100 * u, 70 * u, 8 * u, '#9fd0f0', 0); T('CHECKPOINT', x, y - 240 * u, { size: 18 * u, font: 'heavy', fill: '#fff', lw: 0 }); }
  function lanternsRow(y, lt, u, n = 9) { ctx.save(); ctx.beginPath(); ctx.moveTo(-20, y); ctx.quadraticCurveTo(W / 2, y + 80 * u, W + 20, y); ctx.lineWidth = 3 * u; ctx.strokeStyle = 'rgba(30,25,70,.85)'; ctx.stroke();
    for (let m = 1; m < n; m++) { const f = m / n, x = lerp(-20, W + 20, f), yy = y + 4 * f * (1 - f) * 80 * u; const sw = Math.sin(lt * 2 + m) * .08; ctx.save(); ctx.translate(x, yy); ctx.rotate(sw); line(0, 0, 0, 26 * u, 2 * u, 'rgba(30,25,70,.85)'); const cl = ['#e2452e', '#ffd34a', '#ff7a59', '#4fc3a1'][m % 4]; glow(0, 56 * u, 80 * u, cl, .3); ell(0, 56 * u, 26 * u, 32 * u, cl, 0); ctx.restore(); } ctx.restore(); }

  // ---------- the acts
  const ACT = {};
  // HOOK: odometer ECU → whip out → Dave rides the mountain road; an easy rider passes the other way
  ACT.hook = (o, c, dur, R) => { const tW = R.tW, t1 = T0(c, 1, 4), t2 = T0(c, 2, 7);
    return { sfx: [[0, 'vehicle_moto_rev'], [tW, 'whoosh_by'], [tW + .25, 'vehicle_moto_pass'], [t1 + .3, 'foley_tape'], [t1 + 1.6, 'vehicle_moto_horn'], [t2 + .3, 'foley_paper']], draw: lt => { const g = geo(), u = g.u, tm = o.time || 'day';
      const rs = 420 * u, off = lt * rs; skyFill(tm); mountains(tm, off); ground(tm, off);
      { const bx = (((W * 1.4 - (lt - t1) * 620 * u) % (W * 2)) + W * 2) % (W * 2) - W * .3; if (lt > t1 - .5) bike(bx, g.rT + 22 * u, g.k * .62, lt, { flip: true, who: 'easyrider', pass: 'kenji', helmet: '#5f6f3f', col: '#3a7ae8', ph: 2 }); }
      const dx = lerp(-W * .35, W * .44, E.out(P(lt, tW - .1, 1.1))); bike(dx, g.near, g.k, lt, { expr: lt > t2 ? 'grin' : 'joy', lean: Math.sin(lt * 1.3) * .04 });
      fgLeaves(lt); motes(lt, 12); } }; };
  function ecuOdo(lt, R) { const u = U(), q = clamp((lt - R.tW) / .35); if (q >= 1) return; ctx.save(); const k = lerp(1, 5, E.in(q)); ctx.translate(W / 2, H * .45); ctx.scale(k, k); ctx.translate(-W / 2, -H * .45); ctx.globalAlpha = 1 - E.in(q);
    const g0 = ctx.createRadialGradient(W / 2, H * .45, 10, W / 2, H * .45, H * .7); g0.addColorStop(0, '#3a3a7a'); g0.addColorStop(1, '#14143a'); ctx.fillStyle = g0; ctx.fillRect(0, 0, W, H);
    const cx = W / 2, cy = H * .45, r = Math.min(W * .38, H * .22), jit = Math.sin(lt * 60) * 2 * u; circ(cx, cy + jit, r * 1.08, '#2a2350', 0); circ(cx, cy + jit, r, '#f6f2ff', 0); circ(cx, cy + jit, r * .9, '#1b1838', 0);
    for (let i = 0; i <= 12; i++) { const a = Math.PI * .8 + i / 12 * Math.PI * 1.4; line(cx + Math.cos(a) * r * .78, cy + jit + Math.sin(a) * r * .78, cx + Math.cos(a) * r * .88, cy + jit + Math.sin(a) * r * .88, (i % 3 ? 4 : 8) * u, i > 9 ? '#ff6a4a' : '#ffffff'); }
    const na = Math.PI * .8 + (.25 + .55 * E.out(clamp(lt / R.tW)) + Math.sin(lt * 18) * .03) * Math.PI * 1.4; line(cx, cy + jit, cx + Math.cos(na) * r * .74, cy + jit + Math.sin(na) * r * .74, 10 * u, '#ff6a4a'); circ(cx, cy + jit, 18 * u, '#ff6a4a', 0);
    const km = Math.round(350 * E.inOut(clamp(lt / (R.tW - .15)))); rr(cx - r * .42, cy + jit + r * .28, r * .84, r * .3, 10 * u, '#0d0b22', 0); T(String(km).padStart(3, '0') + ' KM', cx, cy + jit + r * .43, { size: r * .2, font: 'toon', fill: '#ffd34a', lw: 0 });
    glow(cx, cy, r * 1.6, '#7aa0ff', .18); ctx.restore();
    if (q > 0) { const r2 = rng(7); ctx.save(); ctx.globalAlpha = Math.sin(q * Math.PI) * .6; for (let k2 = 0; k2 < 26; k2++) { const a = r2() * TAU, d = (100 + r2() * 600) * u; line(W / 2 + Math.cos(a) * d, H / 2 + Math.sin(a) * d, W / 2 + Math.cos(a) * (d + 300 * u), H / 2 + Math.sin(a) * (d + 300 * u), 4 * u, '#ffffff'); } ctx.restore(); } }
  // BUS: night sleeper bus over moonlit karst, Dave asleep in a cabin, arrival at 4 am
  ACT.bus = (o, c, dur) => { const tA = T0(c, cap(o, 'arriveCap', 1), 4), tS = T0(c, cap(o, 'stayCap', 2), 7);
    return { sfx: [[.2, 'amb_night_village'], [tA - .6, 'vehicle_bus_brake'], [tA + .2, 'ui_tick'], [tS + .3, 'vehicle_bus_horn']], draw: lt => { const g = geo(), u = g.u; const sp = 1 - E.inOut(P(lt, tA - 1, 1.2)); const off = (lt < tA ? lt : tA - .5 + (lt - tA) * 0) * 300 * u * (lt < tA - 1 ? 1 : 1);
      const roll = 300 * u * Math.min(lt, tA - .4) - 150 * u * Math.max(0, Math.min(lt, tA) - (tA - 1)); skyFill('night'); mountains('night', roll); ground('night', roll, { posts: true });
      if (lt > tS) { ctx.save(); ctx.globalAlpha = .35 * E.inOut(P(lt, tS, 2)); const dg = ctx.createLinearGradient(0, 0, 0, H * .5); dg.addColorStop(0, 'rgba(255,150,120,0)'); dg.addColorStop(1, 'rgba(255,170,130,.8)'); ctx.fillStyle = dg; ctx.fillRect(0, 0, W, H * .5); ctx.restore(); }
      const len = g.v ? W * .82 : 900 * u, bx = W * .5 - len / 2 + Math.sin(lt * 7) * 1.5 * u * sp; const b = sleeperBus(bx, g.near + 10 * u, len, lt, { night: true, beam: true, still: lt > tA });
      // Dave asleep in the lower window #2
      const wx = bx + 40 * u + 2 * b.ww, wy = b.top + 26 * u + b.hgt * .3; ctx.save(); ctx.beginPath(); ctx.roundRect(wx, wy, b.ww - 14 * u, b.hgt * .24, 12 * u); ctx.clip(); const bobY = Math.sin(lt * 7) * 2 * u * sp; rr(wx + 70 * u, wy + b.hgt * .1 + bobY, b.ww, 44 * u, 16 * u, '#4fc3a1', 0); circ(wx + 46 * u, wy + b.hgt * .13 + bobY, 30 * u, '#ffd0a8', 0); ell(wx + 46 * u, wy + b.hgt * .13 - 22 * u + bobY, 30 * u, 14 * u, '#8a4a2a', 0); line(wx + 34 * u, wy + b.hgt * .14 + bobY, wx + 42 * u, wy + b.hgt * .14 + bobY, 3 * u, '#2a2350'); line(wx + 52 * u, wy + b.hgt * .14 + bobY, wx + 60 * u, wy + b.hgt * .14 + bobY, 3 * u, '#2a2350'); ctx.restore();
      for (let i = 0; i < 3; i++) { const q = ((lt * .7 + i / 3) % 1); ctx.save(); ctx.globalAlpha = 1 - q; T('z', wx + 70 * u + q * 60 * u, wy - q * 90 * u, { size: (26 + q * 20) * u, font: 'toon', fill: '#ffffff', lw: 0 }); ctx.restore(); }
      motes(lt, 10, '#cfd8ff'); b.dx = wx; } }; };
  // RENT: rental shop, two bikes with boards, Dave picks, snaps scratches, permit stamp
  ACT.rent = (o, c, dur) => { const t = k => T0(c, k, .4 + k * 3); const tP = t(cap(o, 'pickCap', 2)), tF = t(cap(o, 'photoCap', 3)), tM = t(cap(o, 'permitCap', 4));
    return { sfx: [[t(0) + .3, 'foley_steps'], [tP + .2, 'vehicle_moto_start'], [tF + .4, 'ui_shutter'], [tF + .9, 'ui_shutter'], [tF + 1.4, 'ui_shutter'], [tM + .5, 'impact_thump']], draw: lt => { const g = geo(), u = g.u; skyFill('dawn'); mountains('dawn', lt * 12 * u); ground('dawn', 0, { posts: false });
      shop(W * (g.v ? .52 : .6), g.rT + 4 * u, W * (g.v ? .46 : .3), (g.v ? 360 : 300) * u, 'dawn');
      const ax = W * (g.v ? .26 : .3), bxx = W * (g.v ? .7 : .62), yy = g.near; const picked = lt > tP;
      sign(ax - 150 * u, yy - (g.v ? 560 : 470) * u, 300 * u, 110 * u, ['XR150', '450K / DAY'], { size: 32, post: 60 * u, c1: '#e2452e', big: true }); sign(bxx - 150 * u, yy - (g.v ? 560 : 470) * u, 300 * u, 110 * u, ['SEMI-AUTO', '200K / DAY'], { size: 30, post: 60 * u, c1: '#2f6fd0', big: true });
      const kk = g.k * .8; drawProp('moto', bxx, yy + 4 * u, kk * .7, { spin: 0, color: '#2f6fd0' }, lt);
      if (!picked) drawProp('moto', ax, yy + 4 * u, kk * .7, { spin: 0, color: '#e2452e' }, lt);
      person(W * (g.v ? .9 : .86), yy + 6 * u, g.s * .95, ch('easyrider'), { t: lt, pose: lt > tM ? 'holdUp' : lt > t(1) && lt < tP ? 'point' : 'present', hold: lt > tM ? 'passport' : undefined, holdScale: .5, expr: 'happy', flip: true });
      if (picked && lt < tF) { const rev = Math.sin(lt * 30) * 2 * u; bike(ax + rev, yy, kk, lt, { still: true, expr: 'starstruck' }); }
      else if (!picked) { const walk = E.out(P(lt, t(0), 1.6)); const px = lerp(-W * .1, W * (g.v ? .46 : .46), walk); person(px, yy + 6 * u, g.s, ch('dave'), { t: lt * (walk < 1 ? 2 : 1), pose: walk < 1 ? 'walk' : lt < t(1) ? 'point' : 'think', expr: lt < t(1) ? 'happy' : 'thinking', flip: lt > t(0) + 1.6 && lt < t(1) } ); }
      if (lt > tF) { drawProp('moto', ax, yy + 4 * u, kk * .7, { spin: 0, color: '#e2452e' }, lt); const ph = lt < tM; person(ax + (ph ? 200 : 210) * u, yy + 6 * u, g.s, ch('dave'), { t: lt, pose: ph ? 'photo' : 'holdUp', hold: ph ? undefined : 'passport', holdScale: .5, expr: ph ? 'determined' : 'grin', flip: ph });
        if (ph) [[-.18, -60], [.12, -120], [.3, -40]].forEach(([fx, fy], i) => { const tt = tF + .4 + i * .5; if (lt > tt) { const q = P(lt, tt, .25); ctx.save(); ctx.globalAlpha = .9; ctx.lineWidth = 6 * u; ctx.strokeStyle = '#ff3b3b'; ctx.beginPath(); ctx.arc(ax + fx * 300 * u, yy + fy * u, 36 * u * q, 0, TAU); ctx.stroke(); ctx.restore(); if (lt < tt + .15) { ctx.save(); ctx.globalAlpha = .6; ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H); ctx.restore(); } } }); }
      fgLeaves(lt); motes(lt, 10, '#ffe0c8'); } }; };
  // CHECK: checkpoint, Dave stops, pats pockets, finds licence, barrier lifts
  ACT.check = (o, c, dur) => { const t = k => T0(c, k, .3 + k * 2.5); const tStop = t(0) + .9, tOk = t(cap(o, 'okCap', 3));
    return { sfx: [[t(0) + .2, 'vehicle_moto_pass'], [tStop - .2, 'vehicle_skid'], [t(0) + 1.3, 'cartoon_tweet'], [t(1) + .3, 'foley_rummage'], [t(2), 'hit_slam'], [tOk + .2, 'cartoon_tada'], [tOk + 1, 'vehicle_moto_rev']], draw: lt => { const g = geo(), u = g.u;
      const moving = lt < tStop, leave = P(lt, tOk + 1.1, 1.4); const roll = (lt < tStop ? lt : tStop) * 380 * u * (1 - .5 * P(lt, tStop - .8, .8)) + E.in(leave) * 900 * u; skyFill('day'); mountains('day', roll); ground('day', roll);
      const bxo = W * (g.v ? .74 : .72) - (roll - tStop * 300 * u) * 0; booth(bxo, g.rT + 6 * u, u * (g.v ? 1.1 : 1));
      { const lift = E.back(P(lt, tOk + .4, .6)); ctx.save(); ctx.translate(bxo - 70 * u, g.rT - 70 * u); ctx.rotate(-lift * 1.3); for (let s2 = 0; s2 < 7; s2++) rr(-s2 * 70 * u - 70 * u, -10 * u, 70 * u, 20 * u, 0, s2 % 2 ? '#ffffff' : '#e2452e', 0); ctx.restore(); }
      person(W * (g.v ? .6 : .6), g.near + 6 * u, g.s, ch('police'), { t: lt, pose: lt > tOk ? 'thumbs' : lt > t(0) + 1 && lt < t(2) ? 'point' : 'hips', expr: lt > tOk ? 'happy' : lt > t(2) ? 'smug' : 'neutral', flip: true });
      const bx = moving ? lerp(-W * .3, W * .26, E.out(P(lt, t(0), tStop - t(0)))) : W * .26 + E.in(leave) * W * 1.2;
      if (lt < tStop || lt > tOk + 1) bike(bx, g.near, g.k * .9, lt, { expr: lt > tOk ? 'grin' : 'happy', still: !moving && lt < tOk + 1.1 });
      else { drawProp('moto', W * .26, g.near + 4 * u, g.k * .9 * .7, { spin: 0, color: '#e2452e' }, lt); const pat = lt > t(1) && lt < tOk; const sw = Math.floor(lt * 3) % 2; person(W * (g.v ? .4 : .4), g.near + 6 * u, g.s, ch('dave'), { t: lt, pose: lt > tOk ? 'holdUp' : pat ? (sw ? 'shrug' : 'think') : lt > t(2) ? 'scared' : 'stand', hold: lt > tOk ? 'passport' : undefined, holdScale: .5, expr: lt > tOk ? 'joy' : lt > t(2) ? 'shocked' : pat ? 'nervous' : 'surprised', headwear: { type: 'helmet', color: '#ffd34a' } });
        if (pat || (lt > t(2) && lt < tOk)) for (let d = 0; d < 3; d++) { const q = ((lt * 1.4 + d / 3) % 1); ctx.save(); ctx.globalAlpha = 1 - q; ell(W * .4 + (d - 1) * 50 * u, g.near - 330 * u * (g.s / u / 1.25) + q * 60 * u, 8 * u, 13 * u, '#7fd0ff', 0); ctx.restore(); } }
      fgLeaves(lt); motes(lt, 8); } }; };
  // RIDE: the open road, hairpins on the slope, fuel stop, lunch
  ACT.ride = (o, c, dur) => { const tF = T0(c, cap(o, 'fuelCap', 1), 4), tL = o.lunchCap != null ? T0(c, +o.lunchCap, 9) : 999;
    return { sfx: [[.1, 'vehicle_moto_pass'], [tF - .6, 'vehicle_moto_idle'], [tF + .5, 'food_pour_beer'], [tF + .9, 'cartoon_gulp'], [tL + .2, 'food_bowl_set']], draw: lt => { const g = geo(), u = g.u; const stopAt = tF; const roll = lt < stopAt - 1.2 ? lt * 440 * u : (stopAt - 1.2) * 440 * u + 440 * u * (1.2 * E.out(P(lt, stopAt - 1.2, 1.2)) * .5);
      skyFill('day'); mountains('day', roll + lt * 30 * u); ground('day', roll);
      // hairpin road on the slope with a tiny rider climbing it
      { const sy = g.hz + (g.v ? 290 : 200) * u, xs = W * .1, xe = W * .9; ctx.save(); ctx.lineWidth = 12 * u; ctx.strokeStyle = 'rgba(80,70,130,.7)'; ctx.lineJoin = 'round'; ctx.beginPath(); const pts = []; for (let i = 0; i < 6; i++) { pts.push([i % 2 ? xe : xs, sy + i * 26 * u]); } pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke(); ctx.restore();
        const f = (lt * .08) % 1, seg = Math.floor(f * 5), sf = f * 5 - seg, a = pts[5 - seg], b2 = pts[4 - seg]; circ(lerp(a[0], b2[0], sf), lerp(a[1], b2[1], sf) - 6 * u, 7 * u, '#e2452e', 0); }
      const px = W * .62 + (stopAt - 1.2) * 0 - Math.max(0, (roll - (stopAt - 1.2) * 440 * u)) * 0; if (lt > stopAt - 1.6) { const sx = lerp(W * 1.3, W * (g.v ? .74 : .66), E.out(P(lt, stopAt - 1.4, 1.4))); pump(sx, g.rT + 4 * u, u * (g.v ? 1.1 : 1)); if (lt > stopAt + .2) { person(sx + 90 * u, g.rT + 8 * u, g.s * .8, ch('cyclo'), { t: lt, pose: 'hold', expr: 'happy', flip: true }); ctx.save(); ctx.lineWidth = 8 * u; ctx.strokeStyle = '#2a2350'; ctx.beginPath(); ctx.moveTo(sx - 20 * u, g.rT - 120 * u); ctx.quadraticCurveTo(sx - 120 * u, g.rT - 30 * u, W * .44 + 30 * u, g.near - 110 * u); ctx.stroke(); ctx.restore(); } }
      if (lt > tL) { const q = E.back(P(lt, tL, .5)); NW.table(W * .2, g.rT + 4 * u, u * .9 * q, '#ff6a4a'); drawProp('pho', W * .2, g.rT - 66 * u, u * .5 * q, {}, lt); for (let s2 = 0; s2 < 3; s2++) { const qq = ((lt * .6 + s2 / 3) % 1); ctx.save(); ctx.globalAlpha = (1 - qq) * .5 * q; circ(W * .2 + (s2 - 1) * 20 * u, g.rT - 110 * u - qq * 80 * u, (10 + qq * 16) * u, '#ffffff', 0); ctx.restore(); } }
      const still = lt > stopAt - .1; bike(W * .44, g.near, g.k, lt, { still, expr: still ? 'happy' : 'joy', lean: still ? 0 : Math.sin(lt * 1.6) * .05 });
      fgLeaves(lt); motes(lt, 10); } }; };
  // STAY: clay homestay at night, dinner, corn wine, tea
  ACT.stay = (o, c, dur) => { const t = k => T0(c, k, .4 + k * 3); const tD = t(cap(o, 'dinnerCap', 1)), tW2 = t(cap(o, 'wineCap', 2)), tT = t(cap(o, 'teaCap', 3));
    return { sfx: [[.1, 'amb_crickets'], [t(0) + .5, 'foley_door_open'], [tD + .2, 'food_bowl_set'], [tD + .6, 'food_chopsticks'], [tW2 + .3, 'food_pour_tea'], [tT + .3, 'food_cup_clink'], [tT + .8, 'crowd_laugh']], draw: lt => { const g = geo(), u = g.u; skyFill('night'); mountains('night', 40 * u * lt * .2);
      { const gg = ctx.createLinearGradient(0, g.hz + 300 * u, 0, H); gg.addColorStop(0, '#2a3a5a'); gg.addColorStop(1, '#141a32'); ctx.fillStyle = gg; ctx.fillRect(0, g.hz + (g.v ? 380 : 260) * u, W, H); }
      homestay(W * .5, g.near - (g.v ? 150 : 110) * u, g.v ? 1.15 : .9, lt); stoneFence(g.near - (g.v ? 150 : 110) * u, u);
      for (let f = 0; f < 10; f++) { const fx = (Math.sin(lt * .4 + f * 1.7) * .5 + .5) * W, fy = g.hz + (g.v ? 300 : 200) * u + Math.cos(lt * .5 + f) * 80 * u; ctx.save(); ctx.globalAlpha = .4 + .6 * Math.abs(Math.sin(lt * 3 + f)); glow(fx, fy, 22 * u, '#e8ff8a', .7); circ(fx, fy, 3 * u, '#f6ffc0', 0); ctx.restore(); }
      // the table and family
      const ty = g.near + (g.v ? 40 : 20) * u; rr(W * .22, ty - 70 * u, W * .56, 26 * u, 10 * u, '#8a5a3a', 0); rr(W * .26, ty - 46 * u, 18 * u, 60 * u, 4 * u, '#6a4028', 0); rr(W * .72, ty - 46 * u, 18 * u, 60 * u, 4 * u, '#6a4028', 0); glow(W * .5, ty - 90 * u, 300 * u, '#ffb84d', .25);
      if (lt > tD) { const q = E.back(P(lt, tD, .4)); [[.34, 'bowl_rice'], [.5, 'bowl_rice'], [.62, 'bowl_rice']].forEach(([fx, pr], i) => { const qq = E.back(P(lt, tD + i * .15, .4)); drawProp(pr, W * fx, ty - 76 * u, u * .38 * qq, {}, lt); }); ell(W * .44, ty - 82 * u, 60 * u * q, 18 * u * q, '#4fae5a', 0); for (let s2 = 0; s2 < 3; s2++) { const qq = ((lt * .6 + s2 / 3) % 1); ctx.save(); ctx.globalAlpha = (1 - qq) * .4; circ(W * .44 + (s2 - 1) * 24 * u, ty - 110 * u - qq * 90 * u, (10 + qq * 18) * u, '#ffffff', 0); ctx.restore(); } }
      const sitY = ty + 10 * u; person(W * .2, sitY, g.s * .95, ch('hmong_grandpa'), { t: lt, pose: lt > tW2 && lt < tT + .4 ? 'holdUp' : lt > tT + .4 ? 'clap' : 'sit', hold: lt > tW2 && lt < tT + .4 ? 'ruou_ngo' : undefined, holdScale: .5, expr: lt > tT ? 'laugh' : 'happy' });
      person(W * .8, sitY, g.s * .95, ch('hmong_woman'), { t: lt, pose: lt < tD + .6 && lt > t(0) ? 'present' : 'sit', expr: lt > tT ? 'laugh' : 'happy', flip: true });
      person(W * .5, sitY + 4 * u, g.s, ch('dave'), { t: lt, pose: lt > tT ? 'sitHold' : lt > tW2 + .5 ? 'shrug' : lt > tD ? 'eat' : 'sit', hold: lt > tT ? 'trada' : undefined, holdScale: .4, expr: lt > tT ? 'happy' : lt > tW2 + .5 ? 'nervous' : lt > tD ? 'yummy' : 'happy' });
      motes(lt, 8, '#ffd98a'); } }; };
  // PASS: Ma Pi Leng canyon, river and boat far below, fog rolls in
  ACT.pass = (o, c, dur) => { const tB = T0(c, cap(o, 'boatCap', 1), 3), tG = T0(c, cap(o, 'fogCap', 2), 6), tL = o.lungCap != null ? T0(c, +o.lungCap, 9) : 999;
    return { sfx: [[.1, 'amb_bamboo_wind'], [tB + .3, 'vehicle_boat_engine'], [tG - .2, 'nature_wind_gust'], [tG + .8, 'vehicle_moto_idle']], draw: lt => { const g = geo(), u = g.u; const slow = 1 - .7 * E.inOut(P(lt, tG, 1.2)); const roll = lt * 260 * u * (lt < tG ? 1 : 1) - Math.max(0, lt - tG) * 260 * u * (1 - slow);
      skyFill('mist'); { const p = PAL.mist; ctx.fillStyle = p.far; ctx.beginPath(); ctx.moveTo(0, g.hz + 40 * u); for (let x = 0; x <= W; x += 40 * u) ctx.lineTo(x, g.hz - 60 * u - Math.abs(Math.sin(x / (260 * u))) * 160 * u); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath(); ctx.fill(); }
      const zb = 1 + .25 * E.inOut(P(lt, tB, 1)) * (1 - E.inOut(P(lt, tG - 1, 1))); let boat; cam(zb, W * .5, g.rT - (g.v ? 470 : 300) * u, 0, () => { boat = canyon('mist', lt); if (lt > tL - .3) { const fx = W * .84, fy = g.hz - 90 * u; poly([[fx - 60 * u, fy + 70 * u], [fx, fy - 30 * u], [fx + 60 * u, fy + 70 * u]], '#7d8fb8', 0); rr(fx - 6 * u, fy - 110 * u, 12 * u, 90 * u, 3 * u, '#f2f0fa', 0); rr(fx + 6 * u, fy - 110 * u, 50 * u, 30 * u, 3 * u, '#e2452e', 0); circ(fx + 31 * u, fy - 95 * u, 6 * u, '#ffd34a', 0); } });
      // the cliff road in the foreground
      ctx.fillStyle = '#5a6a8a'; ctx.beginPath(); ctx.moveTo(0, g.rT - 80 * u); ctx.quadraticCurveTo(W * .5, g.rT - 120 * u, W, g.rT - 70 * u); ctx.lineTo(W, g.rT); ctx.lineTo(0, g.rT); ctx.closePath(); ctx.fill();
      ctx.fillStyle = PAL.mist.road; ctx.fillRect(0, g.rT, W, g.rB - g.rT); { const dl = 90 * u, gp = 70 * u; for (let x = -((roll % (dl + gp)) + dl + gp) % (dl + gp); x < W; x += dl + gp) rr(x, (g.rT + g.rB) / 2 - 3 * u, dl, 6 * u, 3 * u, 'rgba(255,255,255,.75)', 0); }
      { const st = 170 * u; for (let x = -((roll % st) + st) % st; x < W + st; x += st) { rr(x, g.rB - 8 * u, 16 * u, 46 * u, 4 * u, '#f6f2ff', 0); rr(x, g.rB - 8 * u, 16 * u, 12 * u, 3 * u, '#e2452e', 0); } }
      { const dg = ctx.createLinearGradient(0, g.rB, 0, H); dg.addColorStop(0, 'rgba(70,90,120,.9)'); dg.addColorStop(1, 'rgba(40,50,80,.95)'); ctx.fillStyle = dg; ctx.fillRect(0, g.rB + 38 * u, W, H); }
      const fog = E.inOut(P(lt, tG, 1.5)); fogBank(fog * .7, lt); bike(W * .42, g.near, g.k, lt, { expr: lt > tG ? 'determined' : 'starstruck', light: lt > tG + .4, spin: 12 * slow }); motes(lt, 8, '#ffffff'); ACT.pass._boat = boat; ACT.pass._z = zb; } }; };
  // RIDER (YouTube): what if no licence → easy rider, Dave on the back; a roadside helmet check
  ACT.rider = (o, c, dur) => { const t = k => T0(c, k, .3 + k * 3); const tOn = t(1), tRule = t(cap(o, 'ruleCap', 3));
    return { sfx: [[t(0) + .4, 'cartoon_poof'], [tOn + .2, 'vehicle_moto_start'], [tOn + .8, 'vehicle_moto_pass'], [tRule + .3, 'cartoon_tweet'], [t(4) + .2, 'magic_coin']], draw: lt => { const g = geo(), u = g.u; const go = lt > tOn; const roll = go ? (lt - tOn) * 420 * u : 0; skyFill('day'); mountains('day', roll + lt * 20 * u); ground('day', roll);
      if (!go) { const pf = P(lt, t(0) + .4, .5); person(W * .45, g.near + 6 * u, g.s, ch('dave'), { t: lt, pose: lt < t(0) + .4 ? 'holdUp' : 'shrug', hold: lt < t(0) + .4 ? 'passport' : undefined, holdScale: .5, expr: lt < t(0) + .4 ? 'happy' : 'sad' }); if (pf > 0 && pf < 1) { ctx.save(); ctx.globalAlpha = 1 - pf; for (let k2 = 0; k2 < 8; k2++) { const a = k2 / 8 * TAU; circ(W * .45 + 90 * u + Math.cos(a) * 60 * u * pf, g.near - 300 * u + Math.sin(a) * 60 * u * pf, 22 * u * (1 - pf), '#ffffff', 0); } ctx.restore(); }
        const ex = lerp(W * 1.3, W * .72, E.out(P(lt, t(0) + 1, 1.2))); bike(ex, g.near, g.k * .9, lt, { flip: true, who: 'easyrider', helmet: '#5f6f3f', col: '#3a7ae8', still: lt > t(0) + 2.2 }); }
      else bike(W * .48, g.near, g.k, lt, { who: 'easyrider', helmet: '#5f6f3f', col: '#3a7ae8', pass: 'dave', passExpr: 'joy', lean: Math.sin(lt * 1.4) * .04 });
      if (lt > tRule - .4) { const qx = lerp(W * 1.2, W * .84, E.out(P(lt, tRule - .4, 1))); person(qx - Math.max(0, lt - tRule - 2.5) * 500 * u, g.rT + 6 * u, g.s * .8, ch('police'), { t: lt, pose: 'thumbs', expr: 'happy', flip: true }); }
      fgLeaves(lt); motes(lt, 10); } }; };
  // SUM: night bus cabin, Dave unrolls a receipt that keeps going
  ACT.sum = (o, c, dur) => { const t = k => T0(c, k, .3 + k * 3);
    return { sfx: [[.1, 'amb_room_tone'], [t(0) + .4, 'foley_paper_flutter'], [t(0) + 1.4, 'foley_paper'], [t(cap(o, 'totalCap', 1)) + .1, 'ui_counter'], [t(cap(o, 'usdCap', 2)) + .2, 'hit_slam'], [t(cap(o, 'usdCap', 2)) + 1.6, 'crowd_laugh']], draw: lt => { const g = geo(), u = g.u;
      // the window: night mountains scroll past
      const wx = W * (g.v ? .08 : .12), wy = H * (g.v ? .3 : .26), ww = W * (g.v ? .84 : .76), wh = H * (g.v ? .22 : .3); ctx.fillStyle = '#2a2a5a'; ctx.fillRect(0, 0, W, H); ctx.save(); ctx.beginPath(); ctx.roundRect(wx, wy, ww, wh, 30 * u); ctx.clip(); skyFill('night'); ctx.translate(0, -(g.hz - wy - wh * .7)); mountains('night', lt * 520 * u); ctx.restore(); rr(wx - 12 * u, wy - 12 * u, ww + 24 * u, 24 * u, 12 * u, '#3a3a72', 0); rr(wx - 12 * u, wy + wh - 12 * u, ww + 24 * u, 24 * u, 12 * u, '#3a3a72', 0);
      for (let i = 0; i < 2; i++) { const lx = W * (.2 + i * .6); glow(lx, H * .1, 160 * u, '#ffcf7a', .25); rr(lx - 30 * u, H * .08, 60 * u, 16 * u, 8 * u, '#ffe0a0', 0); }
      // berth
      const by2 = g.near + 20 * u; rr(W * .06, by2 - 40 * u, W * .88, 60 * u, 20 * u, '#5a4a9a', 0); rr(W * .06, by2 + 20 * u, W * .88, H - by2, 0, '#3a2f6a', 0); rr(W * .1, by2 - 70 * u, W * .3, 40 * u, 16 * u, '#f6f2ff', 0);
      const sway = Math.sin(lt * 2.2) * 4 * u; const tTot = t(cap(o, 'totalCap', 1)), tUsd = t(cap(o, 'usdCap', 2));
      person(W * .32, by2 - 20 * u + sway * .3, g.s, ch('dave'), { t: lt, pose: lt > tUsd + 1.2 ? 'cheer' : 'sitHold', hold: lt > tUsd + 1.2 ? undefined : 'ticket', holdScale: .5, expr: lt > tUsd + 1.2 ? 'laugh' : lt > tTot ? 'surprised' : 'thinking' });
      // the receipt ribbon
      const len = E.out(P(lt, t(0) + .3, Math.max(2, tTot - t(0)))) * (H * (g.v ? .77 : .86) - (by2 - 230 * u)); const rx = W * .44, ry0 = by2 - 230 * u; ctx.save(); ctx.translate(rx, ry0); ctx.rotate(-.08 + Math.sin(lt * 2) * .02); rr(0, 0, 150 * u, len, 4 * u, '#fffdf4', 0);
      const items = (o.items || 'BUS 350K|XR150 1.8M|PERMIT 230K|FUEL 250K|BEDS 950K|BOAT 150K|FLAG TOWER 35K|FOOD 1.17M|BUS 350K').split('|'); items.forEach((it, i) => { const iy = 30 * u + i * 44 * u; if (iy < len - 20 * u) T(it, 75 * u, iy, { size: 18 * u, font: 'heavy', fill: '#2a2350', lw: 0 }); }); ctx.restore();
      motes(lt, 6, '#ffd98a'); } }; };
  // BUDGET (YouTube): three swaps — bike, bed, bus — the receipt counts down
  ACT.budget = (o, c, dur) => { const t = k => T0(c, k, .3 + k * 2.5);
    return { sfx: [[t(1) + .3, 'magic_poof'], [t(2) + .3, 'magic_poof'], [t(3) + .3, 'vehicle_bus_horn'], [t(4) + .2, 'cartoon_tada']], draw: lt => { const g = geo(), u = g.u; skyFill('day'); mountains('day', lt * 30 * u); ground('day', lt * 30 * u, { posts: true });
      const sw = E.back(P(lt, t(1) + .3, .5)); const ax = W * (g.v ? .3 : .3), yy = g.near; drawProp('moto', ax, yy + 4 * u, g.k * .8 * .7 * (sw > .5 ? 1 : 1), { spin: 0, color: sw > .5 ? '#2f6fd0' : '#e2452e' }, lt); if (lt > t(1) + .3 && lt < t(1) + .7) { ctx.save(); ctx.globalAlpha = 1 - P(lt, t(1) + .3, .4); circ(ax, yy - 80 * u, 160 * u * P(lt, t(1) + .3, .4), '#ffffff', 0); ctx.restore(); }
      if (lt > t(2) + .2) { const q = E.back(P(lt, t(2) + .2, .5)), bx2 = W * (g.v ? .72 : .66); ctx.save(); ctx.translate(bx2, yy); ctx.scale(q, q); rr(-110 * u, -320 * u, 14 * u, 320 * u, 4 * u, '#8a5a3a', 0); rr(96 * u, -320 * u, 14 * u, 320 * u, 4 * u, '#8a5a3a', 0); for (const by3 of [-90, -250]) { rr(-110 * u, by3 * u, 220 * u, 24 * u, 6 * u, '#8a5a3a', 0); rr(-104 * u, (by3 - 26) * u, 208 * u, 28 * u, 10 * u, '#f6f2ff', 0); rr(-104 * u, (by3 - 26) * u, 60 * u, 28 * u, 10 * u, '#ffd0a8', 0); } ctx.restore(); }
      if (lt > t(3)) { const bxx = lerp(W * 1.2, -W * 1.2, P(lt, t(3), 3.2)); sleeperBus(bxx, g.rT + 10 * u, 520 * u, lt, { col: '#cfe8ff' }); }
      person(W * .5, yy + 6 * u, g.s, ch('dave'), { t: lt, pose: lt > t(4) ? 'cheer' : lt > t(1) ? 'thumbs' : 'think', expr: lt > t(4) ? 'joy' : lt > t(1) ? 'grin' : 'thinking' });
      fgLeaves(lt); motes(lt, 8); } }; };
  // RULES: cash, ATM signpost, easy rider pulls up
  ACT.rules = (o, c, dur) => { const t = k => T0(c, k, .3 + k * 3);
    return { sfx: [[t(0) + .3, 'foley_coins'], [t(1) + .2, 'trans_pop_in'], [t(1) + .5, 'trans_pop_in'], [t(1) + .8, 'trans_pop_in'], [t(2) + .3, 'vehicle_moto_pass'], [t(2) + 1.2, 'vehicle_moto_horn']], draw: lt => { const g = geo(), u = g.u; skyFill('day'); mountains('day', lt * 16 * u); ground('day', 0);
      const px = W * (g.v ? .76 : .74), py = g.rT + 2 * u; rr(px - 8 * u, py - (g.v ? 520 : 440) * u, 16 * u, (g.v ? 520 : 440) * u, 4 * u, '#5a3a2a', 0);
      ['ATM  HA GIANG', 'ATM  DONG VAN', 'ATM  MEO VAC'].forEach((s, i) => { const q = E.back(P(lt, t(1) + .2 + i * .3, .4)); if (q <= 0) return; ctx.save(); ctx.translate(px, py - ((g.v ? 480 : 410) - i * 90) * u); ctx.scale(q, q); const dir = -1; const w = (g.v ? 250 : 300) * u; poly([[0, -32 * u], [dir * w, -32 * u], [dir * (w + 34 * u), 0], [dir * w, 32 * u], [0, 32 * u]], ['#2f6fd0', '#4fc3a1', '#e2452e'][i], 0); T(s, dir * w / 2, 2 * u, { size: 28 * u, font: 'heavy', fill: '#ffffff', lw: 0 }); ctx.restore(); });
      drawProp('moto', W * .2, g.near + 4 * u, g.k * .8 * .7, { spin: 0, color: '#e2452e' }, lt);
      person(W * .42, g.near + 6 * u, g.s, ch('dave'), { t: lt, pose: lt > t(2) + 1.4 ? 'wave' : lt > t(1) ? 'point' : 'holdUp', hold: lt < t(1) ? 'money' : undefined, holdScale: .55, expr: 'happy', flip: lt > t(1) && lt < t(2) + 1.4 ? false : false });
      if (lt > t(2)) { const ex = lerp(W * 1.4, W * (g.v ? .82 : .78), E.out(P(lt, t(2), 1.3))); bike(ex, g.near + 30 * u, g.k * .9, lt, { flip: true, who: 'easyrider', helmet: '#5f6f3f', col: '#3a7ae8', still: lt > t(2) + 1.3, expr: 'happy' }); }
      fgLeaves(lt); motes(lt, 8); } }; };
  // TEASE: Hoi An at dusk, lanterns on the river, Dave in a little boat
  ACT.tease = (o, c, dur) => ({ sfx: [[.1, 'amb_river'], [.6, 'magic_chime_up']], draw: lt => { const g = geo(), u = g.u; skyFill('sunset');
    const hy = g.near - (g.v ? 140 : 90) * u; for (let i = 0; i < 9; i++) { const hx = i * W / 8 - 40 * u, hh = (180 + (i * 53 % 90)) * u; rr(hx, hy - hh, W / 8 + 6 * u, hh, 4 * u, ['#f2c94c', '#e8b84a', '#f0d06a'][i % 3], 0); poly([[hx - 14 * u, hy - hh], [hx + W / 16, hy - hh - 50 * u], [hx + W / 8 + 20 * u, hy - hh]], '#8a3a2a', 0); rr(hx + 30 * u, hy - hh * .55, 40 * u, 50 * u, 6 * u, '#ffcf7a', 0); }
    lanternsRow(hy - (g.v ? 330 : 260) * u, lt, u); { const wg = ctx.createLinearGradient(0, hy, 0, H); wg.addColorStop(0, '#3a2a6a'); wg.addColorStop(1, '#1a1440'); ctx.fillStyle = wg; ctx.fillRect(0, hy, W, H - hy); }
    for (let i = 0; i < 12; i++) { const lx = ((i * 173 * u + lt * 30 * u) % (W + 100 * u)) - 50 * u, ly = hy + 40 * u + (i % 4) * 60 * u + Math.sin(lt * 2 + i) * 4 * u, cl = ['#ffd34a', '#ff7a59', '#e2452e'][i % 3]; glow(lx, ly, 50 * u, cl, .45); poly([[lx - 14 * u, ly], [lx, ly - 18 * u], [lx + 14 * u, ly]], cl, 0); }
    const bxx = lerp(-W * .2, W * .45, E.out(P(lt, .2, 2.5))), byy = g.near + 10 * u + Math.sin(lt * 2) * 4 * u; ctx.save(); ctx.translate(bxx, byy); ctx.beginPath(); ctx.moveTo(-170 * u, -40 * u); ctx.quadraticCurveTo(0, 40 * u, 170 * u, -40 * u); ctx.lineTo(150 * u, -10 * u); ctx.quadraticCurveTo(0, 50 * u, -150 * u, -10 * u); ctx.closePath(); ctx.fillStyle = '#6a3a2a'; ctx.fill(); ctx.restore();
    person(bxx, byy - 10 * u, g.s * .9, ch('dave'), { t: lt, pose: 'holdUp', hold: 'lantern', holdScale: .45, expr: 'starstruck' }); motes(lt, 14, '#ffd98a'); } });

  // ---------- lettering per act (TOON), big words first
  const LET = {};
  const vy = (v, a, b) => H * (v ? a : b);
  LET.hook = (o, c, lt, R) => { const v = H > W, u = U(), g = geo(); const t1 = T0(c, 1, 4), t2 = T0(c, 2, 7), e0 = T1(c, 0, 3.5);
    const tU = Math.max(R.tW + 1.4, e0 - 1.4); TOON.word('UNDER $200?', W / 2, vy(v, .26, .2), { size: v ? 120 : 110, lt, at: tU, out: t1 - .1, enter: 'slam', idle: 'wobble', fill: ['#fff3a0', '#ffb84d'] });
    TOON.tape(W * .12, vy(v, .41, .38), W * .88, vy(v, .41, .38), '350 KM', { lt, at: t1 + .2, out: t2 - .1, size: v ? 96 : 84 }); TOON.word('4 DAYS', W / 2, vy(v, .26, .2), { size: v ? 110 : 96, lt, at: t1 + 1.3, out: t2 - .1, enter: 'pop', idle: 'bounce', fill: ['#ffffff', '#bfe3ff'] });
    TOON.word('COUNT IT!', W / 2, vy(v, .26, .2), { size: v ? 110 : 100, font: 'comic', lt, at: t2 + .2, enter: 'wave', idle: 'wave', fill: ['#ffffff', '#ffe0a0'] });
    TOON.nametag('DAVE', W * (v ? .2 : .24), vy(v, .36, .34), W * .4, g.near - 300 * u, { lt, at: R.tW + .3, out: tU - .1 });
    if (lt < R.tW + .4) ecuOdo(lt, R); };
  LET.bus = (o, c, lt) => { const v = H > W, u = U(); const tA = T0(c, cap(o, 'arriveCap', 1), 4), tS = T0(c, cap(o, 'stayCap', 2), 7);
    TOON.word('NIGHT BUS', W / 2, vy(v, .26, .2), { size: v ? 110 : 100, lt, at: T0(c, 0, .3) + .3, out: tA - .1, enter: 'drop', idle: 'bounce', fill: ['#ffffff', '#cfd8ff'] });
    TOON.word('4:00 AM', W / 2, vy(v, .26, .2), { size: v ? 130 : 116, lt, at: tA + .1, out: tS - .1, enter: 'drop', idle: 'wobble', fill: ['#fff3a0', '#ffb84d'] });
    if (o.stdCap != null) TOON.burst('STANDARD 250K', W * .24, vy(v, .36, .34), { lt, at: T0(c, +o.stdCap, 3) + .2, out: tA - .2, r: 96, col: '#4fc3a1', rot: -.08 });
    TOON.bubble('Sleep till 8!', W * .68, vy(v, .36, .34), W * .7, vy(v, .5, .55), { lt, at: tS + .4, size: 46 }); };
  LET.rent = (o, c, lt) => { const v = H > W, u = U(), g = geo(); const t = k => T0(c, k, .4 + k * 3); const tP = t(cap(o, 'pickCap', 2)), tF = t(cap(o, 'photoCap', 3)), tM = t(cap(o, 'permitCap', 4));
    TOON.word('HA GIANG CITY', W / 2, vy(v, .26, .14), { size: v ? 92 : 84, lt, at: t(0) + .2, out: tP - .1, enter: 'drop', idle: 'bounce', fill: ['#ffffff', '#ffe0c8'] });
    TOON.word('XR150!', W / 2, vy(v, .26, .14), { size: v ? 120 : 110, font: 'comic', lt, at: tP + .2, out: tF - .1, enter: 'slam', idle: 'wobble' });
    TOON.word('$50–300 FEES', W / 2, vy(v, .26, .14), { size: v ? 100 : 90, lt, at: tF + .3, out: tM - .1, enter: 'pop', idle: 'wobble', fill: ['#ffffff', '#ffd0d0'] });
    ['SNAP!', 'SNAP!', 'SNAP!'].forEach((s, i) => TOON.burst(s, W * (.22 + i * .2), vy(v, .31, .29), { lt, at: tF + .4 + i * .5, out: tF + .9 + i * .5, r: 70, col: '#ffffff', rot: (i - 1) * .2 }));
    TOON.word('PERMIT 230K', W / 2, vy(v, .26, .14), { size: v ? 104 : 94, lt, at: tM + .3, enter: 'slam', idle: 'bounce', fill: ['#c8ffe8', '#4fc3a1'] });
    TOON.burst('STAMP!', W * .74, vy(v, .33, .3), { lt, at: tM + .5, out: tM + 1.5, r: 90, col: '#ff6a4a', rot: .15 }); };
  LET.check = (o, c, lt) => { const v = H > W, u = U(), g = geo(); const t = k => T0(c, k, .3 + k * 2.5), tOk = t(cap(o, 'okCap', 3));
    TOON.word('VALID LICENCE?', W / 2, vy(v, .26, .16), { size: v ? 100 : 92, lt, at: t(1) + .2, out: t(2) - .1, enter: 'drop', idle: 'wobble', fill: ['#ffffff', '#cfe8ff'] });
    TOON.word('FINE: MILLIONS', W / 2, vy(v, .26, .16), { size: v ? 104 : 96, lt, at: t(2), out: tOk - .1, enter: 'slam', idle: 'wobble', fill: ['#ffd0c0', '#ff6a4a'] });
    TOON.word('NO INSURANCE', W / 2, vy(v, .335, .27), { size: v ? 70 : 64, lt, at: t(2) + .7, out: tOk - .1, enter: 'pop', idle: 'none', fill: ['#ffffff', '#ffd0d0'] });
    TOON.bubble('Licence?', W * .7, vy(v, .38, .36), W * .62, g.near - 300 * u, { lt, at: t(0) + 1.1, out: t(1) + 1.2, size: 48 });
    TOON.burst('SKRRT!', W * .14, vy(v, .44, .44), { lt, at: t(0) + .7, out: t(0) + 1.5, r: 80, col: '#ffffff', rot: -.15 });
    TOON.burst('PHEW!', W * .5, vy(v, .3, .3), { lt, at: tOk + .2, out: tOk + 1.8, r: 110, col: '#4fc3a1', rot: .1 }); };
  LET.ride = (o, c, lt) => { const v = H > W, u = U(); const tF = T0(c, cap(o, 'fuelCap', 1), 4);
    TOON.word('DAY 1', W / 2, vy(v, .26, .14), { size: v ? 130 : 116, lt, at: T0(c, 0, .3) + .1, out: tF - .1, enter: 'drop', idle: 'bounce' });
    TOON.tape(W * .12, vy(v, .41, .33), W * .88, vy(v, .41, .33), '100 KM', { lt, at: T0(c, 0, .3) + 1, out: tF - .2, size: v ? 84 : 76 });
    TOON.word('11 LITRES', W / 2, vy(v, .26, .14), { size: v ? 110 : 100, lt, at: tF + .3, out: o.lunchCap != null ? T0(c, +o.lunchCap, 9) - .1 : null, enter: 'pop', idle: 'wobble', fill: ['#fff3a0', '#ffb84d'] });
    TOON.burst('GLUG GLUG', W * .78, vy(v, .3, .3), { lt, at: tF + .6, out: tF + 2.2, r: 96, col: '#ffd34a', rot: .12 });
    if (o.lunchCap != null) TOON.word('PHO 40–60K', W / 2, vy(v, .26, .14), { size: v ? 100 : 90, lt, at: T0(c, +o.lunchCap, 9) + .3, enter: 'pop', idle: 'bounce', fill: ['#ffffff', '#ffe0a0'] }); };
  LET.stay = (o, c, lt) => { const v = H > W, u = U(), g = geo(); const t = k => T0(c, k, .4 + k * 3); const tD = t(cap(o, 'dinnerCap', 1)), tW2 = t(cap(o, 'wineCap', 2)), tT = t(cap(o, 'teaCap', 3));
    TOON.word('3 NIGHTS', W / 2, vy(v, .26, .12), { size: v ? 110 : 96, lt, at: t(0) + .2, out: tD - .1, enter: 'drop', idle: 'bounce', fill: ['#fff3a0', '#ffb84d'] });
    TOON.word('100–150K', W / 2, vy(v, .26, .12), { size: v ? 110 : 96, lt, at: tD + .3, out: tW2 - .1, enter: 'pop', idle: 'wobble', fill: ['#ffffff', '#ffe0c8'] });
    TOON.word('LIMIT: 0', W / 2, vy(v, .26, .12), { size: v ? 130 : 116, lt, at: tW2 + .6, out: tT - .1, enter: 'slam', idle: 'wobble', fill: ['#ffd0c0', '#ff6a4a'] });
    TOON.bubble('Welcome!', W * .8, vy(v, .44, .4), W * .8, g.near - 280 * u, { lt, at: t(0) + .7, out: tD, size: 44 });
    TOON.bubble('Tea, please!', W * .5, vy(v, .44, .4), W * .5, g.near - 260 * u, { lt, at: tT + .3, size: 46 }); };
  LET.pass = (o, c, lt) => { const v = H > W, u = U(), g = geo(); const tB = T0(c, cap(o, 'boatCap', 1), 3), tG = T0(c, cap(o, 'fogCap', 2), 6);
    TOON.word('MA PI LENG', W / 2, vy(v, .26, .12), { size: v ? 120 : 108, lt, at: T0(c, 0, .3) + .1, out: tB - .1, enter: 'drop', idle: 'wave', fill: ['#ffffff', '#cfe8ff'] });
    const b = ACT.pass._boat, z = ACT.pass._z || 1; if (b) { const cx = W * .5, cy = g.rT - (g.v ? 470 : 300) * u, bx = cx + (b.bx - cx) * z, by = cy + (b.by - cy) * z; TOON.nametag('BOAT 150K', bx + (v ? 40 : 160) * u, by - (v ? 220 : 170) * u, bx, by - 16 * u, { lt, at: tB + .3, out: tG - .2, size: v ? 64 : 58 }); }
    if (o.lungCap != null) TOON.nametag('FLAG TOWER 35K', W * (v ? .6 : .68), vy(v, .3, .24), W * .84, g.hz - 180 * u, { lt, at: T0(c, +o.lungCap, 9) + .3, out: tG - .2, size: v ? 56 : 52 });
    TOON.word('RIDE SLOW', W / 2, vy(v, .26, .12), { size: v ? 120 : 108, lt, at: tG + .8, enter: 'slam', idle: 'wobble', fill: ['#ffffff', '#ffe0a0'] });
    TOON.tape(W * .52, g.near - 40 * u, W * .78, g.near - 40 * u, '10 M', { lt, at: tG + 1.4, size: v ? 70 : 64 }); };
  LET.rider = (o, c, lt) => { const v = H > W, u = U(), g = geo(); const t = k => T0(c, k, .3 + k * 3), tRule = t(cap(o, 'ruleCap', 3));
    TOON.word('NO LICENCE?', W / 2, vy(v, .26, .14), { size: v ? 110 : 100, lt, at: t(0) + .2, out: t(1) - .1, enter: 'slam', idle: 'wobble', fill: ['#ffd0c0', '#ff6a4a'] });
    TOON.word('EASY RIDER', W / 2, vy(v, .26, .14), { size: v ? 120 : 108, lt, at: t(1) + .3, out: t(2) - .1, enter: 'drop', idle: 'bounce' });
    TOON.word('$190–230', W / 2, vy(v, .26, .14), { size: v ? 120 : 108, lt, at: t(2) + .3, out: tRule - .1, enter: 'pop', idle: 'wobble', fill: ['#fff3a0', '#ffb84d'] });
    TOON.word('APRIL 2026', W / 2, vy(v, .26, .14), { size: v ? 110 : 100, lt, at: tRule + .2, out: t(4) - .1, enter: 'drop', idle: 'bounce', fill: ['#ffffff', '#cfe8ff'] });
    TOON.bubble('Helmets? OK!', W * .8, vy(v, .38, .36), W * .84, g.rT - 260 * u, { lt, at: tRule + .8, out: t(4) - .2, size: 44 });
    TOON.word('≈ $280–320', W / 2, vy(v, .26, .14), { size: v ? 120 : 108, lt, at: t(4) + .3, enter: 'slam', idle: 'wobble', fill: ['#fff3a0', '#ffb84d'] });
    TOON.burst('+ TIP', W * .8, vy(v, .32, .3), { lt, at: t(4) + 1, r: 80, col: '#ffd34a', rot: .12 }); };
  LET.sum = (o, c, lt) => { const v = H > W, u = U(), g = geo(); const t = k => T0(c, k, .3 + k * 3), tTot = t(cap(o, 'totalCap', 1)), tUsd = t(cap(o, 'usdCap', 2));
    if (o.foodCap != null) TOON.word('FOOD 1.17M', W / 2, vy(v, .26, .14), { size: v ? 100 : 90, lt, at: t(+o.foodCap) + .3, out: tTot - .1, enter: 'pop', idle: 'wobble', fill: ['#ffffff', '#ffe0c8'] });
    TOON.word('5,285,000 VND', W / 2, vy(v, .26, .14), { size: v ? 104 : 96, lt, at: tTot + .2, out: tUsd - .1, enter: 'drop', idle: 'bounce', fill: ['#fff3a0', '#ffb84d'] });
    TOON.word('≈ $203', W / 2, vy(v, .26, .14), { size: v ? 150 : 130, lt, at: tUsd + .1, enter: 'slam', idle: 'wobble', fill: ['#fff3a0', '#ffb84d'] });
    TOON.burst('+$3', W * .76, vy(v, .34, .36), { lt, at: tUsd + .9, r: 80, col: '#ff6a4a', rot: .15 });
    TOON.bubble('Worth it!', W * .3, vy(v, .44, .44), W * .32, g.near - 320 * u, { lt, at: tUsd + 1.4, size: 48 }); };
  LET.budget = (o, c, lt) => { const v = H > W, u = U(); const t = k => T0(c, k, .3 + k * 2.5);
    TOON.word('CHEAPER?', W / 2, vy(v, .26, .14), { size: v ? 120 : 108, lt, at: t(0) + .2, out: t(1) - .1, enter: 'slam', idle: 'wobble' });
    TOON.word('SEMI-AUTO', W / 2, vy(v, .26, .14), { size: v ? 104 : 96, lt, at: t(1) + .3, out: t(2) - .1, enter: 'pop', idle: 'bounce', fill: ['#c8ffe8', '#4fc3a1'] });
    TOON.word('DORM BEDS', W / 2, vy(v, .26, .14), { size: v ? 104 : 96, lt, at: t(2) + .3, out: t(3) - .1, enter: 'pop', idle: 'bounce', fill: ['#c8ffe8', '#4fc3a1'] });
    TOON.word('STANDARD BUS', W / 2, vy(v, .26, .14), { size: v ? 100 : 92, lt, at: t(3) + .3, out: t(4) - .1, enter: 'pop', idle: 'bounce', fill: ['#c8ffe8', '#4fc3a1'] });
    TOON.word('≈ $141', W / 2, vy(v, .26, .14), { size: v ? 150 : 130, lt, at: t(4) + .2, enter: 'slam', idle: 'wobble', fill: ['#fff3a0', '#ffb84d'] }); };
  LET.rules = (o, c, lt) => { const v = H > W, u = U(); const t = k => T0(c, k, .3 + k * 3);
    TOON.word('3M VND CASH', W / 2, vy(v, .26, .14), { size: v ? 110 : 100, lt, at: t(0) + .2, out: t(1) - .1, enter: 'slam', idle: 'wobble', fill: ['#fff3a0', '#ffb84d'] });
    TOON.word('ATMS: 3 TOWNS', W / 2, vy(v, .26, .14), { size: v ? 96 : 88, lt, at: t(1) + .1, out: t(2) - .1, enter: 'pop', idle: 'bounce', fill: ['#ffffff', '#cfe8ff'] });
    TOON.word(o.last || 'TIP $10–20 / DAY', W / 2, vy(v, .26, .14), { size: v ? 92 : 84, lt, at: t(2) + .3, enter: 'drop', idle: 'bounce', fill: ['#c8ffe8', '#4fc3a1'] }); };
  LET.tease = (o, c, lt) => { const v = H > W; TOON.word('NEXT:', W / 2, vy(v, .14, .12), { size: v ? 70 : 60, lt, at: .2, enter: 'pop', idle: 'none', fill: ['#ffffff', '#ffe0e8'] }); TOON.word('HOI AN', W / 2, vy(v, .22, .22), { size: v ? 150 : 130, lt, at: .5, enter: 'drop', idle: 'wave', fill: ['#fff3a0', '#ff9a6a'] }); };

  K.hg = (o, c, Pal, dur, i) => { const R = {}; if (o.act === 'hook' || !o.act) { R.tW = Math.min(1.3, T0(c, 0, .3) + 1.2); }
    const A = (ACT[o.act] || ACT.hook)(o, c, dur, R); const sfx = A.sfx.slice(); if (o.act === 'hook' || !o.act) { [.2, .6, 1].forEach(t => sfx.push([t, 'ui_tick'])); sfx.push([R.tW, 'whoosh']); }
    if (o.spent != null && o.adds) String(o.adds).split('|').forEach(s => { const k = +s.split('@')[1]; sfx.push([T0(c, k, .6) + .35, 'magic_coin']); });
    return { sfx, draw: lt => { LT = lt; const u = U(); ctx.save(); const z = 1 + .035 * Math.sin(lt * .5) + .02 * lt / Math.max(4, dur); ctx.translate(W / 2 + Math.sin(lt * .37) * 10 * u, H / 2); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2); A.draw(lt); ctx.restore();
      (LET[o.act] || (() => {}))(o, c, lt, R); tally(o, c, lt); } }; };
})();
