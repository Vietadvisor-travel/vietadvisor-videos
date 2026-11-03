/* EP.8 — Hoi An's lantern boat. House format v11: no mascot, no standing cast; every shot is a bespoke illustration of its
   subject with its own camera — macro lantern, aerial river, isometric booth, POV phone + balance scale, macro water release,
   water-level moonrise, riverfront dusk-to-night queue, macro ticket punch, flood cutaway, rotating lantern save card.
   `# vis kind=ha act=hook|river|booth|phone|release|moon|clock|ticket|flood|route|photo|rules|tease` */
'use strict';
(function () {
  if (!window.VIS || !VIS.K || !window.TOON) { console.warn('ep8_hoian needs vis + toontype'); return; }
  const K = VIS.K;
  const P = (lt, a, d = .4) => clamp((lt - a) / d);
  const T0 = (c, k, d) => c && c[k] ? c[k][0] + .05 : d;
  const T1 = (c, k, d) => c && c[k] ? c[k][1] : d;
  const cap = (o, key, def) => (o[key] != null ? +o[key] : def);
  const vy = (a, b) => H * (H > W ? a : b);
  let LT = 0;
  const LCOL = ['#e2452e', '#ffb02e', '#c43a8a', '#2fb5a8', '#ffd34a', '#7a4ad6'];

  // ---------- shared painters
  function night(top = '#0b0d33', mid = '#24206a', bot = '#5a3a7a') { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, top); g.addColorStop(.55, mid); g.addColorStop(1, bot); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
  function stars(n = 60, a = 1) { const u = U(), r = rng(9); for (let i = 0; i < n; i++) { ctx.globalAlpha = a * (.25 + .55 * Math.abs(Math.sin(LT * 1.3 + i))); circ(r() * W, r() * H * .45, (1 + r() * 2) * u, '#ffffff', 0); } ctx.globalAlpha = 1; }
  // a silk lantern seen from the side (x, y = centre), radius r, lit 0..1
  function silk(x, y, r, col, lit, sw = 0) { const u = U(); ctx.save(); ctx.translate(x, y); ctx.rotate(sw); line(0, -r * 1.5, 0, -r * 1.05, 3 * u, '#2a1a10');
    if (lit > 0) glow(0, 0, r * 3.2, col, .45 * lit);
    const g = ctx.createRadialGradient(0, r * .1, r * .1, 0, 0, r * 1.1); g.addColorStop(0, shade(col, .25 * lit + .05)); g.addColorStop(1, shade(col, -.12 + .1 * lit)); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(0, 0, r * .92, r, 0, 0, TAU); ctx.fill();
    ctx.save(); ctx.globalAlpha = .28; for (let k = -2; k <= 2; k++) { ctx.beginPath(); ctx.ellipse(0, 0, Math.abs(k) * r * .22 + .5, r, 0, 0, TAU); ctx.lineWidth = 2 * u; ctx.strokeStyle = '#3a1a10'; ctx.stroke(); } ctx.restore();
    rr(-r * .45, -r * 1.08, r * .9, r * .16, r * .05, '#c9962a', 0); rr(-r * .45, r * .92, r * .9, r * .16, r * .05, '#c9962a', 0);
    for (let t = -2; t <= 2; t++) line(t * r * .12, r * 1.08, t * r * .12 + Math.sin(LT * 3 + t) * 4 * u, r * 1.6, 2.5 * u, shade(col, -.15));
    ctx.restore(); }
  // floating lotus lantern on water
  function lotus(x, y, s, col, a = 1) { const u = U() * s; ctx.save(); ctx.globalAlpha *= a; glow(x, y - 8 * u, 70 * u, '#ffcf6a', .5); ell(x, y + 4 * u, 34 * u, 8 * u, 'rgba(255,210,120,.25)', 0);
    for (let k = -2; k <= 2; k++) { ctx.save(); ctx.translate(x + k * 9 * u, y); ctx.rotate(k * .32); ell(0, -10 * u, 9 * u, 16 * u, col, 0); ctx.restore(); }
    circ(x, y - 18 * u, 4 * u, '#fff6c0', 0); glow(x, y - 20 * u, 26 * u, '#fff2a0', .7); ctx.restore(); }
  function water(y0, col1 = '#14164a', col2 = '#06072a') { const u = U(), g = ctx.createLinearGradient(0, y0, 0, H); g.addColorStop(0, col1); g.addColorStop(1, col2); ctx.fillStyle = g; ctx.fillRect(0, y0, W, H - y0);
    for (let i = 0; i < 26; i++) { const yy = y0 + Math.pow((i + 1) / 26, 1.6) * (H - y0), x = ((i * 213 + LT * (20 + i % 5 * 8)) * u) % (W + 200 * u) - 100 * u; ctx.save(); ctx.globalAlpha = .18; rr(x, yy, (60 + i * 6) * u, 3 * u, 2 * u, '#a8b4ff', 0); ctx.restore(); } }
  // front elevation of a row of Hoi An shophouses on a baseline y, height scale k
  function houses(y, k, lit = 1, seed = 3) { const u = U(), r = rng(seed); let x = -20 * u; let i = 0; while (x < W) { const w = (170 + r() * 90) * u * k, h = (230 + r() * 120) * u * k, col = ['#f2c94c', '#e9b949', '#f0d36a', '#e8a94a'][i % 4];
      rr(x, y - h, w, h, 0, col, 0); ctx.fillStyle = 'rgba(80,40,10,.12)'; ctx.fillRect(x, y - h, w * .08, h);
      poly([[x - 14 * u * k, y - h], [x + w / 2, y - h - 60 * u * k], [x + w + 14 * u * k, y - h]], '#a8432f', 0); rr(x - 14 * u * k, y - h - 6 * u, w + 28 * u * k, 12 * u * k, 0, '#7a2f22', 0);
      rr(x + w * .15, y - h * .55, w * .7, h * .4, 4 * u, lit > .5 ? '#ffcf7a' : '#5a4a3a', 0); if (lit > 0) glow(x + w / 2, y - h * .35, w * .7, '#ffb84d', .35 * lit);
      rr(x + w * .2, y - h * .92, w * .22, h * .22, 3 * u, '#6a3a2a', 0); rr(x + w * .58, y - h * .92, w * .22, h * .22, 3 * u, '#6a3a2a', 0);
      x += w + 6 * u * k; i++; } }
  function lanternString(y, sag, n, lit, u, sw = 1) { ctx.save(); ctx.beginPath(); ctx.moveTo(-20, y); ctx.quadraticCurveTo(W / 2, y + sag, W + 20, y); ctx.lineWidth = 2.5 * u; ctx.strokeStyle = 'rgba(20,10,30,.8)'; ctx.stroke(); ctx.restore();
    for (let m = 1; m < n; m++) { const f = m / n, x = lerp(-20, W + 20, f), yy = y + 4 * f * (1 - f) * sag + 30 * u; silk(x, yy, 26 * u, LCOL[m % 6], lit, Math.sin(LT * 2 + m) * .08 * sw); } }
  function hand(x, y, s, rot, skin = '#f0c2a0') { const u = U() * s; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); rr(-40 * u, -10 * u, 80 * u, 140 * u, 30 * u, '#3a7ae8', 0); ell(0, -20 * u, 46 * u, 40 * u, skin, 0); for (let f = 0; f < 4; f++) rr(-34 * u + f * 18 * u, -86 * u, 15 * u, 52 * u, 8 * u, skin, 0); rr(30 * u, -40 * u, 14 * u, 40 * u, 7 * u, skin, 0); ctx.restore(); }
  function boatTop(x, y, s, ang, lt) { const u = U() * s; ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ell(0, 0, 70 * u, 20 * u, '#6a3a22', 0); ell(0, 0, 58 * u, 13 * u, '#8a5232', 0); circ(-40 * u, 0, 9 * u, '#e9c48a', 0); for (const sx of [-1, 1]) { const a = Math.sin(lt * 3) * .4; ctx.save(); ctx.translate(-40 * u, sx * 12 * u); ctx.rotate(sx * (1.2 + a)); rr(0, -2 * u, 46 * u, 4 * u, 2 * u, '#c9a070', 0); ctx.restore(); }
    circ(10 * u, 0, 7 * u, '#ffcf6a', 0); glow(10 * u, 0, 40 * u, '#ffcf6a', .5); ctx.restore(); }
  function boatSide(x, y, s, lt) { const u = U() * s; ctx.save(); ctx.translate(x, y + Math.sin(lt * 2) * 3 * u); ctx.beginPath(); ctx.moveTo(-170 * u, -36 * u); ctx.quadraticCurveTo(0, 30 * u, 170 * u, -36 * u); ctx.lineTo(150 * u, -6 * u); ctx.quadraticCurveTo(0, 40 * u, -150 * u, -6 * u); ctx.closePath(); ctx.fillStyle = '#5a2e1a'; ctx.fill(); rr(-140 * u, -40 * u, 280 * u, 8 * u, 4 * u, '#8a5232', 0);
    silk(110 * u, -110 * u, 18 * u, '#e2452e', 1); line(110 * u, -140 * u, 110 * u, -36 * u, 3 * u, '#2a1a10'); ctx.restore(); }

  // ---------- acts
  const ACT = {};
  // HOOK: macro — a match lights the candle inside a red silk lantern; whip out to an aerial river
  ACT.hook = (o, c, dur, R) => ({ sfx: [[.25, 'foley_snap'], [.45, 'whoosh_fire'], [R.tW, 'whoosh_big'], [R.tW + .3, 'amb_river']], draw: lt => { const u = U(); if (lt < R.tW + .4) {} ACT.river(o, c, dur, R, true).draw(lt); } });
  function ecuLantern(lt, R) { const u = U(), q = clamp((lt - R.tW) / .35); if (q >= 1) return; ctx.save(); const k = lerp(1, 6, E.in(q)); ctx.translate(W / 2, H * .45); ctx.scale(k, k); ctx.translate(-W / 2, -H * .45); ctx.globalAlpha = 1 - E.in(q);
    night('#05051a', '#140c2a', '#2a1020'); const lit = E.out(P(lt, .45, .6)), r = Math.min(W * .34, H * .2);
    for (let b = 0; b < 12; b++) { const bx = ((b * 197) % W), by = H * (.12 + (b * 61 % 100) / 260); ctx.save(); ctx.globalAlpha = .25 * lit; circ(bx, by, (30 + b % 4 * 20) * u, LCOL[b % 6], 0); ctx.restore(); }
    silk(W / 2, H * .45, r, '#e2452e', lit, Math.sin(lt * 2) * .04);
    if (lit > 0) { const fl = 1 + Math.sin(lt * 30) * .08; ell(W / 2, H * .45 + r * .5, 10 * u * fl, 18 * u * fl, '#fff3b0', 0); }
    const mx = lerp(W * .9, W / 2 + 30 * u, E.out(P(lt, 0, .45))), my = lerp(H * .8, H * .45 + r * .62, E.out(P(lt, 0, .45))); if (lt < .9) { ctx.save(); ctx.globalAlpha = 1 - P(lt, .6, .3); line(mx, my, mx + 120 * u, my + 160 * u, 8 * u, '#d9b48a'); circ(mx, my, 10 * u, '#8a2a1a', 0); if (lt > .25) { glow(mx, my - 10 * u, 60 * u, '#ffb02e', .8); ell(mx, my - 16 * u, 9 * u, 18 * u, '#ffd34a', 0); } ctx.restore(); }
    ctx.restore(); if (q > 0) { const r2 = rng(7); ctx.save(); ctx.globalAlpha = Math.sin(q * Math.PI) * .6; for (let k2 = 0; k2 < 26; k2++) { const a = r2() * TAU, d = (100 + r2() * 600) * u; line(W / 2 + Math.cos(a) * d, H / 2 + Math.sin(a) * d, W / 2 + Math.cos(a) * (d + 300 * u), H / 2 + Math.sin(a) * (d + 300 * u), 4 * u, '#ffffff'); } ctx.restore(); } }
  // RIVER: aerial top-down map of the Hoai river, two bridges, rowing boats, drifting lanterns, a 20-minute route
  ACT.river = (o, c, dur, R, isHook) => { const tR = T0(c, cap(o, 'routeCap', 1), 3);
    return { sfx: [[.1, 'amb_river'], [tR + .3, 'ui_pin_drop']], draw: lt => { const u = U(), v = H > W; ctx.save(); const rot = isHook ? -.25 + lt * .02 : -.12 + lt * .015, z = isHook ? 1.15 - lt * .015 : 1 + lt * .02; ctx.translate(W / 2, H / 2); ctx.rotate(rot); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2);
      ctx.fillStyle = '#2a2140'; ctx.fillRect(-W, -H, W * 3, H * 3); const ry = H * .5, rh = (v ? 380 : 240) * u, rs = v ? .7 : .9;
      // banks: rows of roofs from above
      const r = rng(4); for (const side of [-1, 1]) for (let row = 0; row < 6; row++) { let x = -W * .6 + (row % 2) * 60 * u; while (x < W * 1.6) { const w = (110 + r() * 80) * u * rs, h = (90 + r() * 40) * u * rs, y = side < 0 ? ry - rh / 2 - 30 * u - (row + 1) * (h + 22 * u) : ry + rh / 2 + 30 * u + row * (h + 22 * u);
        rr(x, y, w, h, 6 * u, '#a8432f', 0); line(x + w / 2, y, x + w / 2, y + h, 3 * u, '#7a2f22'); for (let tl = 1; tl < 5; tl++) line(x, y + tl * h / 5, x + w, y + tl * h / 5, 1.5 * u, 'rgba(60,20,10,.35)'); glow(x + w / 2, y + h + 10 * u, 60 * u, '#ffb84d', .18); x += w + 18 * u; } }
      for (let s2 = 0; s2 < 8; s2++) { const yy = s2 % 2 ? ry - rh / 2 - 260 * u - s2 * 40 * u : ry + rh / 2 + 200 * u + s2 * 30 * u; for (let k = 0; k < 14; k++) { const x = -W * .5 + k * 160 * u + s2 * 30 * u; circ(x, yy, 7 * u, LCOL[(k + s2) % 6], 0); glow(x, yy, 30 * u, LCOL[(k + s2) % 6], .35); } }
      // the river
      ctx.fillStyle = '#7a6a5a'; ctx.fillRect(-W, ry - rh / 2 - 26 * u, W * 3, 26 * u); ctx.fillRect(-W, ry + rh / 2, W * 3, 26 * u);
      { const g = ctx.createLinearGradient(0, ry - rh / 2, 0, ry + rh / 2); g.addColorStop(0, '#16285a'); g.addColorStop(.5, '#1d3a72'); g.addColorStop(1, '#16285a'); ctx.fillStyle = g; ctx.fillRect(-W, ry - rh / 2, W * 3, rh); }
      for (let i = 0; i < 30; i++) { const x = ((i * 157 + lt * 30) * u) % (W * 2) - W * .5, y = ry - rh / 2 + ((i * 37) % 100) / 100 * rh; ctx.save(); ctx.globalAlpha = .2; rr(x, y, 50 * u, 2 * u, 1 * u, '#a8c4ff', 0); ctx.restore(); }
      // two bridges
      for (const bx of [W * .12, W * .9]) { rr(bx - 40 * u, ry - rh / 2 - 40 * u, 80 * u, rh + 80 * u, 10 * u, '#6a4a3a', 0); rr(bx - 30 * u, ry - rh / 2 - 40 * u, 60 * u, rh + 80 * u, 6 * u, '#8a6a52', 0); }
      // floating lanterns drifting
      for (let i = 0; i < 40; i++) { const x = ((i * 97 + lt * (10 + i % 4 * 5)) * u) % (W * 1.2) - W * .1, y = ry - rh * .4 + ((i * 53) % 100) / 100 * rh * .8; lotus(x, y, .45, LCOL[i % 6]); }
      // boats rowing, one follows the route
      for (let b = 0; b < 4; b++) { const x = ((b * 420 + lt * 40) * u) % (W * 1.3) - W * .15; boatTop(x, ry + (b % 2 ? -1 : 1) * rh * .22, .9, 0, lt + b); }
      if (!isHook && lt > tR) { const q = P(lt, tR, 4); ctx.save(); ctx.setLineDash([16 * u, 12 * u]); ctx.lineWidth = 5 * u; ctx.strokeStyle = '#ffd34a'; ctx.beginPath(); ctx.moveTo(W * .16, ry + rh * .05); ctx.bezierCurveTo(W * .4, ry - rh * .35, W * .65, ry + rh * .35, W * .86, ry - rh * .05); ctx.stroke(); ctx.restore(); const bt = E.inOut(q); const bx = Math.pow(1 - bt, 3) * W * .16 + 3 * Math.pow(1 - bt, 2) * bt * W * .4 + 3 * (1 - bt) * bt * bt * W * .65 + bt * bt * bt * W * .86, by = Math.pow(1 - bt, 3) * (ry + rh * .05) + 3 * Math.pow(1 - bt, 2) * bt * (ry - rh * .35) + 3 * (1 - bt) * bt * bt * (ry + rh * .35) + bt * bt * bt * (ry - rh * .05); boatTop(bx, by, 1.3, 0, lt); }
      ctx.restore(); { const vg = ctx.createRadialGradient(W / 2, H / 2, H * .25, W / 2, H / 2, H * .75); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(5,3,20,.55)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H); } } }; };
  // BOOTH: isometric diorama of a riverside ticket kiosk; hands pay, coins drop, a ticket pops
  ACT.booth = (o, c, dur) => { const t = k => T0(c, k, .3 + k * 3);
    return { sfx: [[t(1) + .3, 'foley_coins'], [t(1) + .9, 'ui_counter'], [t(2) + .3, 'foley_coin_drop'], [t(2) + .8, 'foley_paper']], draw: lt => { const u = U(), v = H > W; night('#1a1440', '#3a2a6a', '#6a3a5a');
      const cx = W / 2, cy = H * (v ? .6 : .62), s = (v ? 1.25 : 1.05) * u, iso = (x, y, z) => [cx + (x - y) * .87 * s, cy + (x + y) * .5 * s - z * s];
      const face = (pts, col) => { ctx.fillStyle = col; ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath(); ctx.fill(); };
      face([iso(-420, -420, 0), iso(420, -420, 0), iso(420, 420, 0), iso(-420, 420, 0)], '#4a3a5a'); for (let i = -4; i <= 4; i++) { const a = iso(i * 100, -420, 0), b = iso(i * 100, 420, 0); line(a[0], a[1], b[0], b[1], 1.5 * u, 'rgba(255,255,255,.06)'); }
      { const a = iso(-420, 180, 0), b = iso(420, 180, 0), c2 = iso(420, 420, 0), d = iso(-420, 420, 0); face([a, b, c2, d], '#1d3a72'); for (let i = 0; i < 12; i++) lotus(lerp(a[0], c2[0], ((i * .17 + lt * .02) % 1)), lerp(a[1], c2[1], (i * .23) % 1) + 20 * u, .5, LCOL[i % 6]); }
      // kiosk: box 200x160x220
      const X = -100, Y = -80, w = 200, d = 160, h = 220; face([iso(X, Y + d, 0), iso(X + w, Y + d, 0), iso(X + w, Y + d, h), iso(X, Y + d, h)], '#c98a52'); face([iso(X + w, Y, 0), iso(X + w, Y + d, 0), iso(X + w, Y + d, h), iso(X + w, Y, h)], '#a86a3a');
      face([iso(X - 30, Y - 30, h), iso(X + w + 30, Y - 30, h), iso(X + w + 30, Y + d + 30, h), iso(X - 30, Y + d + 30, h)], '#a8432f'); face([iso(X - 30, Y + d + 30, h), iso(X + w + 30, Y + d + 30, h), iso(X + w + 30, Y + d + 30, h - 26), iso(X - 30, Y + d + 30, h - 26)], '#7a2f22');
      { const a = iso(X + 20, Y + d, 70), b = iso(X + w - 20, Y + d, 70), c2 = iso(X + w - 20, Y + d, 190), d2 = iso(X + 20, Y + d, 190); face([a, b, c2, d2], '#ffcf7a'); glow((a[0] + c2[0]) / 2, (a[1] + c2[1]) / 2, 200 * u, '#ffb84d', .4); }
      // price board leaning on the kiosk
      { const p0 = iso(X + w + 10, Y + d + 40, 0); ctx.save(); ctx.translate(p0[0] + 60 * u, p0[1] - 200 * u); ctx.rotate(-.05); const bw = (v ? 380 : 340) * u, bh = (v ? 250 : 220) * u; rr(10 * u, 12 * u, bw, bh, 16 * u, 'rgba(10,5,30,.4)', 0); rr(0, 0, bw, bh, 16 * u, '#fff6e0', 0); T('BOAT · PER BOAT', bw / 2, 34 * u, { size: 24 * u, font: 'heavy', fill: '#8a84c8', lw: 0 });
        const q1 = E.back(P(lt, t(1) + .2, .4)), q2 = E.back(P(lt, t(2) + .2, .4)); if (q1 > 0) T('1–3 PEOPLE  170K', bw / 2, 96 * u, { size: 34 * u * q1, font: 'heavy', fill: '#e2452e', lw: 0 }); if (q2 > 0) T('4–5 PEOPLE  220K', bw / 2, 156 * u, { size: 34 * u * q2, font: 'heavy', fill: '#2f6fd0', lw: 0 }); ctx.restore(); }
      for (let m = 0; m < 3; m++) { const a = iso(X - 30 + m * 120, Y + d + 30, h - 26); silk(a[0], a[1] + 50 * u, 22 * u, LCOL[m], 1, Math.sin(lt * 2 + m) * .1); }
      // hands + coins at the window
      const win = iso(X + w / 2, Y + d + 20, 70); const reach = E.out(P(lt, t(1), .6)) * (1 - E.in(P(lt, t(1) + 1.6, .5))); hand(win[0] - 160 * u + reach * 90 * u, win[1] + 140 * u - reach * 60 * u, v ? 1.1 : .9, -.6);
      for (let k = 0; k < 5; k++) { const tt = t(1) + .5 + k * .12, q = P(lt, tt, .35); if (q > 0) { const yy = lerp(win[1] - 20 * u, win[1] + 30 * u, E.bounce(q)); ell(win[0] - 40 * u + k * 16 * u, yy, 14 * u, 6 * u, '#ffd34a', 0); } }
      { const q = E.back(P(lt, t(2) + .7, .5)); if (q > 0) { ctx.save(); ctx.translate(win[0] + 40 * u, win[1] - 40 * u - q * 70 * u); ctx.rotate(-.15); rr(-60 * u, -30 * u, 120 * u, 60 * u, 6 * u, '#ffe0a0', 0); T('TICKET', 0, 2 * u, { size: 20 * u, font: 'heavy', fill: '#8a3a1a', lw: 0 }); ctx.restore(); } }
      stars(30, .6); } }; };
  // PHONE: POV phone with a per-person listing, then a balance scale weighs online vs booth
  ACT.phone = (o, c, dur) => { const t = k => T0(c, k, .3 + k * 3); const tS = t(cap(o, 'scaleCap', 2));
    return { sfx: [[t(0) + .3, 'ui_click'], [t(1) + .2, 'ui_tick'], [t(1) + .6, 'ui_tick'], [tS + .1, 'whoosh_down'], [tS + .9, 'impact_metal_light']], draw: lt => { const u = U(), v = H > W; night('#141238', '#2a2460', '#4a2a5a');
      const out = E.inOut(P(lt, tS - .3, .7)); const pw = (v ? 400 : 330) * u, ph = pw * 1.9, px = W / 2 - pw / 2 - out * W * .8, py = H * (v ? .24 : .16) + Math.sin(lt * 1.2) * 6 * u;
      if (out < 1) { ctx.save(); ctx.translate(px + pw / 2, py + ph / 2); ctx.rotate(-.04 - out * .4); ctx.translate(-pw / 2, -ph / 2); rr(-14 * u, -14 * u, pw + 28 * u, ph + 28 * u, 60 * u, '#1b1838', 0); rr(0, 0, pw, ph, 48 * u, '#f6f4ff', 0); rr(pw * .32, 18 * u, pw * .36, 26 * u, 13 * u, '#1b1838', 0);
        rr(30 * u, 80 * u, pw - 60 * u, pw * .62, 24 * u, '#1d3a72', 0); for (let i = 0; i < 6; i++) lotus(60 * u + i * (pw - 120 * u) / 5, 80 * u + pw * .45, .7, LCOL[i]); silk(pw * .7, 80 * u + pw * .2, 30 * u, '#e2452e', 1);
        T('Lantern Boat Ride', pw / 2, 120 * u + pw * .62, { size: 38 * u, font: 'heavy', fill: '#1b1838', lw: 0 }); T('★★★★☆  ·  20 min', pw / 2, 170 * u + pw * .62, { size: 26 * u, font: 'heavy', fill: '#8a84c8', lw: 0 });
        T('$8–10', pw / 2, 236 * u + pw * .62, { size: 60 * u, font: 'toon', fill: '#e2452e', lw: 0 }); T('per person', pw / 2, 288 * u + pw * .62, { size: 26 * u, font: 'heavy', fill: '#2a2350', lw: 0 });
        const n = lt > t(1) + .5 ? 2 : 1; rr(30 * u, 330 * u + pw * .62, pw - 60 * u, 80 * u, 40 * u, '#ffd34a', 0); T(n === 2 ? '2 PEOPLE · $16–21' : '1 PERSON · $8–10', pw / 2, 370 * u + pw * .62, { size: 32 * u, font: 'heavy', fill: '#1b1838', lw: 0 });
        ctx.restore(); if (lt > t(1) && lt < t(1) + 1.2) { const q = P(lt, t(1), .3); ctx.save(); ctx.globalAlpha = 1 - P(lt, t(1) + .8, .4); circ(W / 2 + 120 * u - out * W * .8, py + ph * .86, 40 * u * q, 'rgba(255,255,255,.5)', 0); ctx.restore(); hand(W / 2 + 150 * u - out * W * .8, py + ph * .86 + 120 * u, v ? 1.1 : .9, -.2); } }
      if (out > 0) { // balance scale
        const sx = W / 2, sy = H * (v ? .46 : .36), tilt = E.out(P(lt, tS + .6, 1)) * .32 + Math.sin(lt * 2) * .01; const arm = (v ? 290 : 420) * u; ctx.save(); ctx.globalAlpha = out;
        rr(sx - 14 * u, sy, 28 * u, (v ? 520 : 440) * u, 10 * u, '#c9962a', 0); ell(sx, sy + (v ? 520 : 440) * u, 160 * u, 30 * u, '#8a6a2a', 0); circ(sx, sy, 24 * u, '#ffd34a', 0);
        ctx.save(); ctx.translate(sx, sy); ctx.rotate(-tilt); rr(-arm, -8 * u, arm * 2, 16 * u, 8 * u, '#ffd34a', 0); ctx.restore();
        const ends = [-1, 1].map(sd => [sx + Math.cos(tilt) * arm * sd, sy - Math.sin(-tilt) * arm * sd * -1]);
        ends.forEach(([ex, ey], i) => { const yy = ey + (i === 0 ? 1 : -1) * Math.sin(tilt) * arm + 200 * u; line(ex, ey - Math.sin(tilt) * arm * (i === 0 ? -1 : 1), ex - 90 * u, yy, 3 * u, '#c9962a'); line(ex, ey - Math.sin(tilt) * arm * (i === 0 ? -1 : 1), ex + 90 * u, yy, 3 * u, '#c9962a'); ell(ex, yy, 120 * u, 26 * u, '#c9962a', 0);
          if (i === 0) { rr(ex - 60 * u, yy - 130 * u, 120 * u, 120 * u, 20 * u, '#1b1838', 0); rr(ex - 50 * u, yy - 120 * u, 100 * u, 100 * u, 14 * u, '#f6f4ff', 0); T('$16–21', ex, yy - 70 * u, { size: 30 * u, font: 'toon', fill: '#e2452e', lw: 0 }); }
          else { for (let k = 0; k < 4; k++) ell(ex - 40 * u + k * 26 * u, yy - 14 * u - (k % 2) * 10 * u, 18 * u, 7 * u, '#ffd34a', 0); rr(ex - 50 * u, yy - 80 * u, 100 * u, 46 * u, 6 * u, '#ffe0a0', 0); T('$6.50', ex, yy - 57 * u, { size: 26 * u, font: 'toon', fill: '#8a3a1a', lw: 0 }); } });
        ctx.restore(); }
      stars(30, .5); } }; };
  // RELEASE: macro at water level — a pole lowers a lotus lantern, ripples spread, it drifts away
  ACT.release = (o, c, dur) => { const t1 = T0(c, 1, 3);
    return { sfx: [[.4, 'foley_cloth'], [1.4, 'nature_splash_small'], [t1 + .3, 'foley_coins']], draw: lt => { const u = U(), v = H > W; night('#05061e', '#141648', '#2a2a66'); const wy = H * (v ? .5 : .48);
      houses(wy - 4 * u, v ? .7 : .6, 1, 7); for (let i = 0; i < 9; i++) { ctx.save(); ctx.globalAlpha = .25; rr(i * W / 8, wy, 60 * u, H - wy, 0, LCOL[i % 6], 0); ctx.restore(); }
      water(wy, '#1a1a5a', '#05061e');
      for (let i = 0; i < 14; i++) { const x = ((i * 157 + lt * (14 + i % 3 * 6)) * u) % (W + 100 * u) - 50 * u, y = wy + 60 * u + ((i * 41) % 100) / 100 * (H * .3), s = .5 + (y - wy) / H * 1.6; lotus(x, y, s, LCOL[i % 6]); }
      const down = E.inOut(P(lt, .2, 1.2)), drift = Math.max(0, lt - 1.5); const lx = W * .5 + drift * 40 * u, ly = lerp(wy + 40 * u, H * (v ? .66 : .7), down) + (lt > 1.4 ? Math.sin(lt * 2) * 4 * u : 0);
      if (lt < 2.6) { ctx.save(); ctx.globalAlpha = 1 - P(lt, 2, .6); line(W * .95, -20 * u, lx + 20 * u, ly - 30 * u, 10 * u, '#8a6a42'); line(lx + 20 * u, ly - 30 * u, lx, ly - 22 * u, 4 * u, '#5a4a32'); ctx.restore(); }
      if (lt > 1.4) for (let k = 0; k < 4; k++) { const q = ((lt - 1.4) * .5 + k / 4) % 1; ctx.save(); ctx.globalAlpha = (1 - q) * .6; ctx.lineWidth = 3 * u; ctx.strokeStyle = '#ffe0a0'; ctx.beginPath(); ctx.ellipse(lx, ly + 6 * u, 40 * u + q * 260 * u, 10 * u + q * 60 * u, 0, 0, TAU); ctx.stroke(); ctx.restore(); }
      lotus(lx, ly, v ? 3 : 2.6, '#ffb02e'); } }; };
  // MOON: water-level view, a full moon rises over the rooftops, street lights switch off one by one, lanterns flood the river
  ACT.moon = (o, c, dur) => { const tOff = T0(c, 0, .3) + 1.6, tFill = T0(c, cap(o, 'fillCap', 1), 4);
    return { sfx: [[.2, 'magic_shimmer'], [tOff, 'ui_switch'], [tOff + .5, 'ui_switch'], [tOff + 1, 'ui_switch'], [tFill + .2, 'crowd_ooh']], draw: lt => { const u = U(), v = H > W; const wy = H * (v ? .56 : .6);
      night('#070824', '#1a1650', '#3a2a6a'); stars(80);
      const my = lerp(wy + 40 * u, H * (v ? .2 : .2), E.out(P(lt, 0, 3.5))), mr = (v ? 150 : 120) * u; glow(W * .62, my, mr * 4, '#fff2c8', .35); circ(W * .62, my, mr, '#fff6dc', 0); circ(W * .62 - mr * .3, my - mr * .2, mr * .2, '#f2e6c4', 0); circ(W * .62 + mr * .35, my + mr * .3, mr * .14, '#f2e6c4', 0);
      const off = k => P(lt, tOff + k * .25, .2); houses(wy, v ? .85 : .75, 1, 11);
      for (let k = 0; k < 8; k++) { const x = W * (.06 + k * .125), y = wy - (v ? 160 : 140) * u; const on = 1 - off(k); rr(x - 4 * u, y, 8 * u, 160 * u, 3 * u, '#2a2050', 0); circ(x, y, 14 * u, on > .5 ? '#fff6c0' : '#4a4a6a', 0); if (on > 0) glow(x, y, 120 * u, '#fff2c0', .5 * on); }
      water(wy, '#1d1d5c', '#06072a'); { ctx.save(); ctx.globalAlpha = .5; for (let i = 0; i < 18; i++) rr(W * .62 - (60 - i * 3) * u + Math.sin(lt * 2 + i) * 10 * u, wy + 20 * u + i * 26 * u, (120 - i * 5) * u, 5 * u, 3 * u, '#fff2c8', 0); ctx.restore(); }
      const n = Math.floor(8 + 60 * E.inOut(P(lt, tFill, 3))); for (let i = 0; i < n; i++) { const x = ((i * 113 + lt * (8 + i % 5 * 4)) * u) % (W + 100 * u) - 50 * u, y = wy + 40 * u + ((i * 67) % 100) / 100 * (H - wy - 80 * u), s = .4 + (y - wy) / H * 2; lotus(x, y, s, LCOL[i % 6]); }
      for (let b = 0; b < 2; b++) boatSide(((b * 700 + lt * 50) * u) % (W + 500 * u) - 250 * u, wy + (v ? 260 : 170) * u + b * 60 * u, v ? 1 : .8, lt + b); } }; };
  // CLOCK: the riverfront from dusk to night; a queue of silhouettes on the dock shrinks as the clock runs to 8:30
  ACT.clock = (o, c, dur) => { const t1 = T0(c, 1, 3.5);
    return { sfx: [[.2, 'crowd_murmur'], [t1 - .3, 'ui_tick'], [t1, 'ui_tick'], [t1 + .3, 'magic_chime_up']], draw: lt => { const u = U(), v = H > W; const h = lt < t1 ? lerp(18, 19, P(lt, 0, t1)) : lerp(19, 20.5, P(lt, t1 - .3, 1.2)); const nf = clamp((h - 18) / 1.5);
      const sky = (a, b) => shade(a, 0) ; const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, nf > .5 ? '#0b0d33' : '#4b3f95'); g.addColorStop(.55, nf > .5 ? '#24206a' : '#d27a9a'); g.addColorStop(1, nf > .5 ? '#5a3a7a' : '#ffb07a'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); if (nf > .5) stars(50, (nf - .5) * 2);
      const wy = H * (v ? .58 : .62); houses(wy, v ? .8 : .7, Math.min(1, nf * 1.5 + .3), 5); lanternString(wy - (v ? 460 : 380) * u, 70 * u, 10, Math.min(1, nf * 1.5 + .3), u);
      water(wy, '#2a2a6a', '#0a0a2a'); rr(0, wy - 10 * u, W, 26 * u, 0, '#6a5a4a', 0);
      const qn = Math.round(lerp(16, 3, P(lt, t1, 1.2))); for (let i = 0; i < qn; i++) { const x = W * .12 + i * (v ? 44 : 50) * u, y = wy - 10 * u, b = Math.abs(Math.sin(lt * 3 + i)) * 3 * u; ctx.fillStyle = 'rgba(20,12,40,.92)'; circ(x, y - 96 * u - b, 16 * u, 'rgba(20,12,40,.92)', 0); rr(x - 15 * u, y - 80 * u - b, 30 * u, 80 * u + b, 12 * u, 'rgba(20,12,40,.92)', 0); }
      // tower clock
      const cx = W * (v ? .8 : .84), cy = H * (v ? .3 : .26), cr = (v ? 110 : 90) * u; rr(cx - cr * .7, cy - cr * 1.2, cr * 1.4, cr * 3, 14 * u, '#c98a52', 0); circ(cx, cy, cr, '#fff6e0', 0); for (let k = 0; k < 12; k++) { const a = k / 12 * TAU; line(cx + Math.cos(a) * cr * .78, cy + Math.sin(a) * cr * .78, cx + Math.cos(a) * cr * .9, cy + Math.sin(a) * cr * .9, 4 * u, '#2a2350'); }
      const hr = (h % 12) / 12 * TAU - Math.PI / 2, mn = (h % 1) * TAU - Math.PI / 2; line(cx, cy, cx + Math.cos(hr) * cr * .5, cy + Math.sin(hr) * cr * .5, 8 * u, '#2a2350'); line(cx, cy, cx + Math.cos(mn) * cr * .75, cy + Math.sin(mn) * cr * .75, 5 * u, '#e2452e'); circ(cx, cy, 8 * u, '#2a2350', 0);
      boatSide(((lt * 60) * u) % (W + 400 * u) - 200 * u, wy + (v ? 200 : 140) * u, v ? .9 : .75, lt); } }; };
  // TICKET: macro of the Ancient Town ticket; a punch bites a hole; "SEPARATE" stamp
  ACT.ticket = (o, c, dur) => { const t1 = T0(c, 1, 3);
    return { sfx: [[.6, 'foley_click_mech'], [t1 + .2, 'impact_thump']], draw: lt => { const u = U(), v = H > W; night('#2a1a40', '#4a2a5a', '#6a3a4a'); for (let i = 0; i < 16; i++) { ctx.save(); ctx.globalAlpha = .25; circ((i * 173) % W, H * (.1 + ((i * 61) % 100) / 130), (40 + i % 4 * 26) * u, LCOL[i % 6], 0); ctx.restore(); }
      const tw = v ? W * .86 : 900 * u, th = tw * .46, tx = W / 2 - tw / 2, ty = H * (v ? .4 : .3) + Math.sin(lt * 1.3) * 6 * u; ctx.save(); ctx.translate(W / 2, ty + th / 2); ctx.rotate(-.06 + Math.sin(lt * .7) * .02); ctx.translate(-W / 2, -(ty + th / 2));
      rr(tx + 12 * u, ty + 16 * u, tw, th, 18 * u, 'rgba(10,5,30,.4)', 0); rr(tx, ty, tw, th, 18 * u, '#ffe9b8', 0); rr(tx, ty, tw * .3, th, 18 * u, '#a8432f', 0); for (let k = 0; k < 12; k++) circ(tx + tw * .3, ty + 16 * u + k * (th - 32 * u) / 11, 6 * u, '#2a1a40', 0);
      silk(tx + tw * .15, ty + th * .48, th * .22, '#ffd34a', 1); T('HOI AN', tx + tw * .65, ty + th * .25, { size: 54 * u, font: 'toon', fill: '#a8432f', lw: 0 }); T('ANCIENT TOWN', tx + tw * .65, ty + th * .45, { size: 40 * u, font: 'heavy', fill: '#5a2a1a', lw: 0 }); T('120,000 VND', tx + tw * .65, ty + th * .7, { size: 48 * u, font: 'toon', fill: '#2a2350', lw: 0 });
      const pq = P(lt, .6, .15); if (lt > .75) circ(tx + tw * .92, ty + th * .2, 20 * u, '#2a1a40', 0); ctx.restore();
      if (lt < 1.2) { const py = lerp(-200 * u, ty - 40 * u, E.out(P(lt, .1, .5))) + (lt > .6 && lt < .8 ? 30 * u : 0); rr(tx + tw * .92 - 50 * u, py - 160 * u, 100 * u, 180 * u, 20 * u, '#8a84c8', 0); rr(tx + tw * .92 - 14 * u, py + 10 * u, 28 * u, 40 * u, 6 * u, '#5a5490', 0); }
      if (lt > .75 && lt < 1.6) for (let k = 0; k < 6; k++) { const q = P(lt, .75, .8); ctx.save(); ctx.globalAlpha = 1 - q; circ(tx + tw * .92 + Math.cos(k) * 60 * u * q, ty + th * .2 + Math.sin(k) * 60 * u * q - 30 * u, 6 * u, '#ffe9b8', 0); ctx.restore(); } } }; };
  // FLOOD: cutaway of the riverbank steps; the water rises step by step, tied boats bob, a gauge climbs
  ACT.flood = (o, c, dur) => ({ sfx: [[.2, 'amb_monsoon'], [1, 'nature_thunder_far'], [2.2, 'nature_splash']], draw: lt => { const u = U(), v = H > W; const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#3a4a6a'); g.addColorStop(1, '#6a7a8a'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 90; i++) { const x = ((i * 89) % W + lt * 300 * u) % W, y = ((i * 131) % H + lt * 1400 * u) % H; line(x, y, x - 8 * u, y + 30 * u, 2 * u, 'rgba(220,230,255,.35)'); }
    const base = H * (v ? .78 : .82); houses(base - (v ? 520 : 400) * u, v ? .7 : .6, .4, 13); for (let s = 0; s < 7; s++) rr(0, base - (v ? 520 : 400) * u + s * (v ? 74 : 57) * u, W * (.25 + s * .11), (v ? 74 : 57) * u, 0, s % 2 ? '#8a7a6a' : '#7a6a5a', 0);
    const lvl = lerp(base, base - (v ? 420 : 320) * u, E.inOut(P(lt, .3, Math.max(2, dur - 1)))); { const wg = ctx.createLinearGradient(0, lvl, 0, H); wg.addColorStop(0, 'rgba(120,100,70,.92)'); wg.addColorStop(1, 'rgba(70,60,40,.97)'); ctx.fillStyle = wg; ctx.beginPath(); ctx.moveTo(0, H); for (let x = 0; x <= W; x += 20 * u) ctx.lineTo(x, lvl + Math.sin(x / (60 * u) + lt * 3) * 8 * u); ctx.lineTo(W, H); ctx.closePath(); ctx.fill(); }
    for (let b = 0; b < 2; b++) { const bx = W * (.62 + b * .22); line(bx, lvl - 10 * u, W * (.5 + b * .1), base - (v ? 520 : 400) * u + 100 * u, 2 * u, '#2a2a2a'); boatSide(bx, lvl, v ? .7 : .55, lt + b * 2); }
    const gx = W * (v ? .14 : .1); rr(gx - 10 * u, base - (v ? 620 : 480) * u, 20 * u, (v ? 640 : 500) * u, 4 * u, '#f6f2ff', 0); for (let m = 0; m < 10; m++) { const y = base - m * (v ? 60 : 46) * u; line(gx, y, gx + (m % 2 ? 24 : 40) * u, y, 4 * u, '#e2452e'); } } });
  // ROUTE (YouTube): board at one bridge, get off at the other — the aerial again with two pins
  ACT.route = (o, c, dur) => { const base = ACT.river(Object.assign({}, o, { routeCap: 0 }), c, dur); return { sfx: base.sfx.concat([[.4, 'ui_pin_drop'], [T0(c, 1, 3), 'ui_pin_drop']]), draw: lt => base.draw(lt) }; };
  // PHOTO (YouTube): POV through a phone camera; blurry while moving, sharp when the boat stops
  ACT.photo = (o, c, dur) => { const tS = T0(c, 1, 3);
    return { sfx: [[tS + .6, 'ui_shutter'], [tS + 1.2, 'ui_shutter']], draw: lt => { const u = U(), v = H > W; const wy = H * (v ? .52 : .56); const blur = lt < tS ? 10 : 10 * (1 - P(lt, tS, .6));
      ctx.save(); if (blur > .3) ctx.filter = `blur(${blur * u}px)`; night('#0b0d33', '#24206a', '#4a2a6a'); houses(wy, v ? .8 : .7, 1, 17); lanternString(wy - (v ? 420 : 340) * u, 60 * u, 9, 1, u); water(wy); for (let i = 0; i < 20; i++) lotus(((i * 133 + (lt < tS ? lt * 80 : tS * 80)) * u) % W, wy + 50 * u + ((i * 47) % 100) / 100 * (H * .3), .9, LCOL[i % 6]); ctx.restore();
      const fw = W * (v ? .86 : .7), fh = H * (v ? .5 : .6), fx = W / 2 - fw / 2, fy = H * (v ? .2 : .15); ctx.save(); ctx.lineWidth = 5 * u; ctx.strokeStyle = 'rgba(255,255,255,.85)'; for (const [x, y, dx, dy] of [[fx, fy, 1, 1], [fx + fw, fy, -1, 1], [fx, fy + fh, 1, -1], [fx + fw, fy + fh, -1, -1]]) { ctx.beginPath(); ctx.moveTo(x + dx * 60 * u, y); ctx.lineTo(x, y); ctx.lineTo(x, y + dy * 60 * u); ctx.stroke(); } ctx.restore();
      circ(W / 2, fy + fh + (v ? 140 : 90) * u, 44 * u, 'rgba(255,255,255,.9)', 0); if (lt > tS + .6 && lt < tS + .8) { ctx.save(); ctx.globalAlpha = .7; ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H); ctx.restore(); } } }; };
  // RULES: one big hexagonal lantern turns; each panel carries a rule and lights up on its line
  ACT.rules = (o, c, dur) => { const t = k => T0(c, k, .3 + k * 2.5);
    return { sfx: [[t(0) + .2, 'magic_chime_up'], [t(1) + .2, 'magic_chime_up'], [t(2) + .2, 'magic_chime_up']], draw: lt => { const u = U(), v = H > W; night('#0b0d33', '#24206a', '#5a3a7a'); stars(60);
      for (let i = 0; i < 18; i++) { const x = ((i * 157) % W), y = H * .9 - ((lt * (20 + i % 4 * 8) * u + i * 90 * u) % (H * .9)); ctx.save(); ctx.globalAlpha = .6; glow(x, y, 40 * u, '#ffb84d', .4); rr(x - 10 * u, y - 14 * u, 20 * u, 26 * u, 6 * u, '#ffcf6a', 0); ctx.restore(); }
      const k = lt < t(1) ? 0 : lt < t(2) ? 1 : 2, turn = k + E.inOut(P(lt, [t(0), t(1), t(2)][k] - .5, .5)) * 0; const cx = W / 2, cy = H * (v ? .5 : .5), R = (v ? 330 : 260) * u, Hh = R * 1.4;
      const ang = -k * TAU / 6 + (lt < t(1) ? -(1 - E.out(P(lt, t(0) - .2, .8))) : lt < t(2) ? -(1 - E.out(P(lt, t(1) - .2, .8))) * TAU / 6 : -(1 - E.out(P(lt, t(2) - .2, .8))) * TAU / 6) + Math.sin(lt) * .03;
      glow(cx, cy, R * 2.4, '#ffb02e', .35); const labels = (o.items || 'BUY AT THE BOOTH|PER BOAT, NOT PER PERSON|CASH FOR A LANTERN').split('|');
      const faces = []; for (let i = 0; i < 6; i++) { const a0 = ang + i * TAU / 6, a1 = a0 + TAU / 6, x0 = cx + Math.sin(a0) * R, x1 = cx + Math.sin(a1) * R, z = Math.cos(a0 + TAU / 12); faces.push([z, x0, x1, i]); }
      faces.sort((a, b) => a[0] - b[0]).forEach(([z, x0, x1, i]) => { if (x1 <= x0) return; const lit = i === k ? 1 : .55; ctx.fillStyle = shade(LCOL[i % 6], -.25 + z * .2 + (i === k ? .1 : 0)); ctx.fillRect(x0, cy - Hh / 2, x1 - x0, Hh); if (i < 3 && z > .4) { ctx.save(); ctx.beginPath(); ctx.rect(x0, cy - Hh / 2, x1 - x0, Hh); ctx.clip(); const words = labels[i].split(' '), lines = []; let cur = ''; words.forEach(w => { if ((cur + ' ' + w).trim().length > 9) { lines.push(cur.trim()); cur = w; } else cur += ' ' + w; }); lines.push(cur.trim()); lines.forEach((ln, j) => T(ln, (x0 + x1) / 2, cy + (j - (lines.length - 1) / 2) * 62 * u, { size: 50 * u * Math.min(1, (x1 - x0) / (R * .95)), font: 'toon', fill: '#fff6e0', stroke: '#1b1530', lw: 8 * u })); ctx.restore(); } });
      rr(cx - R * 1.05, cy - Hh / 2 - 40 * u, R * 2.1, 44 * u, 14 * u, '#c9962a', 0); rr(cx - R * 1.05, cy + Hh / 2 - 4 * u, R * 2.1, 44 * u, 14 * u, '#c9962a', 0); line(cx, cy - Hh / 2 - 40 * u, cx, 0, 4 * u, '#2a1a10');
      for (let tt = -3; tt <= 3; tt++) line(cx + tt * 22 * u, cy + Hh / 2 + 40 * u, cx + tt * 22 * u + Math.sin(lt * 3 + tt) * 6 * u, cy + Hh / 2 + 160 * u, 4 * u, '#e2452e'); } }; };
  // TEASE: aerial of a turquoise bay — Phu Quoc
  ACT.tease = (o, c, dur) => ({ sfx: [[.1, 'amb_waves']], draw: lt => { const u = U(), v = H > W; const g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#1ab3c8'); g.addColorStop(.55, '#54d8d0'); g.addColorStop(1, '#bff2e4'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(1 + lt * .03, 1 + lt * .03); ctx.translate(-W / 2, -H / 2); const sx = W * .62; ctx.fillStyle = '#f6e3b0'; ctx.beginPath(); ctx.moveTo(sx, 0); for (let y = 0; y <= H; y += 20 * u) ctx.lineTo(sx + Math.sin(y / (180 * u)) * 60 * u, y); ctx.lineTo(W, H); ctx.lineTo(W, 0); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#3f9a5a'; ctx.beginPath(); ctx.moveTo(W * .82, 0); for (let y = 0; y <= H; y += 20 * u) ctx.lineTo(W * .82 + Math.sin(y / (150 * u) + 1) * 50 * u, y); ctx.lineTo(W, H); ctx.lineTo(W, 0); ctx.closePath(); ctx.fill(); for (let p = 0; p < 10; p++) { const py = p * H / 9; circ(W * .84 + Math.sin(p) * 30 * u, py, 46 * u, '#2f7a4a', 0); }
    for (let wv = 0; wv < 6; wv++) { const q = ((lt * .3 + wv / 6) % 1); ctx.save(); ctx.globalAlpha = (1 - q) * .7; ctx.lineWidth = 6 * u; ctx.strokeStyle = '#ffffff'; ctx.beginPath(); for (let y = 0; y <= H; y += 20 * u) { const x = sx - 20 * u - q * 160 * u + Math.sin(y / (180 * u)) * 60 * u; y ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); ctx.restore(); }
    for (let b = 0; b < 3; b++) boatTop(((b * 300 + lt * 30) * u) % (W * .55), H * (.3 + b * .2), 1.2, .1, lt); ctx.restore(); } });

  // ---------- lettering (TOON), big words first
  const LET = {};
  const big = (txt, a, out, o2 = {}) => (o, c, lt) => TOON.word(txt, W / 2, vy(o2.y || .26, o2.yh || .16), Object.assign({ size: H > W ? 120 : 108, lt, at: a, out, enter: 'slam', idle: 'wobble', fill: ['#fff3a0', '#ffb84d'] }, o2));
  LET.hook = (o, c, lt, R) => { const v = H > W, t1 = T0(c, 1, 3.5), t2 = T0(c, 2, 6.5);
    TOON.word('$6 OR $20?', W / 2, vy(.26, .2), { size: v ? 140 : 130, lt, at: R.tW + .3, out: t2 - .1, enter: 'slam', idle: 'wobble', fill: ['#fff3a0', '#ffb84d'] });
    TOON.word('SAME BOAT.', W / 2, vy(.26, .2), { size: v ? 120 : 110, lt, at: t2 + .1, enter: 'pop', idle: 'bounce', fill: ['#ffffff', '#ffe0c8'] });
    TOON.word('SAME RIVER.', W / 2, vy(.34, .32), { size: v ? 100 : 90, lt, at: t2 + .9, enter: 'pop', idle: 'bounce', fill: ['#c8ffe8', '#4fc3a1'] });
    if (lt < R.tW + .4) ecuLantern(lt, R); };
  LET.river = (o, c, lt) => { const v = H > W, tR = T0(c, cap(o, 'routeCap', 1), 3);
    TOON.word('HOAI RIVER', W / 2, vy(.2, .14), { size: v ? 110 : 100, lt, at: T0(c, 0, .3) + .2, out: tR - .1, enter: 'drop', idle: 'wave', fill: ['#ffffff', '#cfe8ff'] });
    TOON.word('20 MIN', W / 2, vy(.2, .14), { size: v ? 140 : 120, lt, at: tR + .3, enter: 'slam', idle: 'wobble' });
    TOON.word('4 PM – 9:30 PM', W / 2, vy(.8 - .52, .26), { size: v ? 70 : 64, lt, at: tR + 1.2, enter: 'pop', idle: 'none', fill: ['#ffffff', '#ffe0c8'] }); };
  LET.booth = (o, c, lt) => { const v = H > W; TOON.word('PER BOAT', W / 2, vy(.17, .12), { size: v ? 120 : 108, lt, at: T0(c, 0, .3) + .3, enter: 'slam', idle: 'wobble', fill: ['#fff3a0', '#ffb84d'] }); };
  LET.phone = (o, c, lt) => { const v = H > W, t = k => T0(c, k, .3 + k * 3), tS = t(cap(o, 'scaleCap', 2));
    TOON.word('PER PERSON', W / 2, vy(.17, .1), { size: v ? 110 : 100, lt, at: t(0) + .3, out: tS - .1, enter: 'drop', idle: 'wobble', fill: ['#ffd0c0', '#ff6a4a'] });
    TOON.word('3× MORE', W / 2, vy(.17, .12), { size: v ? 140 : 120, lt, at: tS + 1.2, enter: 'slam', idle: 'wobble', fill: ['#fff3a0', '#ffb84d'] }); };
  LET.release = (o, c, lt) => { const v = H > W, t1 = T0(c, 1, 3);
    TOON.word('NOT INCLUDED', W / 2, vy(.18, .14), { size: v ? 110 : 100, lt, at: T0(c, 0, .3) + .4, out: t1 - .1, enter: 'slam', idle: 'wobble', fill: ['#ffd0c0', '#ff6a4a'] });
    TOON.word('5–15K', W / 2, vy(.18, .14), { size: v ? 150 : 130, lt, at: t1 + .2, enter: 'drop', idle: 'bounce' }); };
  LET.moon = (o, c, lt) => { const v = H > W, tF = T0(c, cap(o, 'fillCap', 1), 4);
    TOON.word('LIGHTS OFF', W / 2, vy(.12, .1), { size: v ? 110 : 100, lt, at: T0(c, 0, .3) + 1.8, out: tF - .1, enter: 'pop', idle: 'wobble', fill: ['#ffffff', '#cfd8ff'] });
    TOON.word('FULL MOON', W / 2, vy(.12, .1), { size: v ? 120 : 108, lt, at: tF + .2, enter: 'drop', idle: 'wave', fill: ['#fff6dc', '#ffd98a'] }); };
  LET.clock = (o, c, lt) => { const v = H > W, t1 = T0(c, 1, 3.5);
    TOON.word('6–7 PM: BUSIEST', W * (v ? .5 : .42), vy(.13, .12), { size: v ? 90 : 84, lt, at: T0(c, 0, .3) + .3, out: t1 - .1, enter: 'pop', idle: 'wobble', fill: ['#ffd0c0', '#ff6a4a'] });
    TOON.word('8:30: SHORT QUEUE', W * (v ? .5 : .42), vy(.13, .12), { size: v ? 84 : 80, lt, at: t1 + .4, enter: 'slam', idle: 'bounce', fill: ['#c8ffe8', '#4fc3a1'] }); };
  LET.ticket = (o, c, lt) => { const v = H > W, t1 = T0(c, 1, 3);
    TOON.word('SEPARATE', W / 2, vy(.26, .14), { size: v ? 120 : 108, lt, at: t1 + .2, enter: 'slam', idle: 'wobble', fill: ['#ffd0c0', '#ff6a4a'] }); TOON.burst('PUNCH!', W * .78, vy(.34, .22), { lt, at: .7, out: 1.6, r: 90, col: '#ffffff', rot: .15 }); };
  LET.flood = (o, c, lt) => { const v = H > W; TOON.word('OCT – NOV', W / 2, vy(.16, .12), { size: v ? 130 : 116, lt, at: .3, enter: 'drop', idle: 'wobble', fill: ['#ffffff', '#cfe8ff'] }); TOON.word('NO BOATS', W / 2, vy(.25, .24), { size: v ? 100 : 92, lt, at: 2, enter: 'slam', idle: 'wobble', fill: ['#ffd0c0', '#ff6a4a'] }); };
  LET.route = (o, c, lt) => { const v = H > W, t1 = T0(c, 1, 3); TOON.word('ON HERE…', W * .3, vy(.2, .14), { size: v ? 90 : 84, lt, at: .5, enter: 'pop', idle: 'bounce' }); TOON.word('…OFF THERE', W * .7, vy(.3, .26), { size: v ? 90 : 84, lt, at: t1 + .2, enter: 'pop', idle: 'bounce', fill: ['#c8ffe8', '#4fc3a1'] }); };
  LET.photo = (o, c, lt) => { const v = H > W, tS = T0(c, 1, 3); TOON.word('NIGHT MODE', W / 2, vy(.14, .1), { size: v ? 100 : 92, lt, at: .3, out: tS - .1, enter: 'drop', idle: 'wobble', fill: ['#ffffff', '#cfe8ff'] }); TOON.word('SHOOT WHEN STOPPED', W / 2, vy(.14, .1), { size: v ? 80 : 76, lt, at: tS + .3, enter: 'pop', idle: 'bounce', fill: ['#fff3a0', '#ffb84d'] }); };
  LET.rules = (o, c, lt) => { const v = H > W; TOON.word('SAVE THIS', W / 2, vy(.12, .08), { size: v ? 100 : 80, lt, at: .2, enter: 'drop', idle: 'bounce', fill: ['#ffffff', '#ffe0e8'] }); };
  LET.tease = (o, c, lt) => { const v = H > W; TOON.word('NEXT:', W * .32, vy(.14, .14), { size: v ? 70 : 60, lt, at: .2, enter: 'pop', idle: 'none', fill: ['#ffffff', '#e0fff8'] }); TOON.word('PHU QUOC', W * .32, vy(.22, .26), { size: v ? 120 : 120, lt, at: .5, enter: 'drop', idle: 'wave', fill: ['#fff3a0', '#ffb84d'], maxW: .6 }); };

  K.ha = (o, c, Pal, dur, i) => { const R = {}; if (o.act === 'hook' || !o.act) R.tW = Math.min(1.3, T0(c, 0, .3) + 1.2);
    const A = (ACT[o.act] || ACT.hook)(o, c, dur, R); const sfx = A.sfx.slice();
    return { sfx, draw: lt => { LT = lt; const u = U(); ctx.save(); const z = 1 + .03 * Math.sin(lt * .5) + .025 * lt / Math.max(4, dur); ctx.translate(W / 2 + Math.sin(lt * .37) * 10 * u, H / 2); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2); A.draw(lt); ctx.restore();
      (LET[o.act] || (() => {}))(o, c, lt, R); } }; };
})();
