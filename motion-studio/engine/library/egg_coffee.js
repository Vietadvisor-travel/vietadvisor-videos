/* Ep. 2 — egg coffee: Hà Nội 1946 hotel bar, back kitchen, 1946 street with tram, today's café; props. */
(function () {
  // one-point interior shell; returns back-wall rectangle
  function roomShell(u, gy, wall, floor, o = {}) {
    const vx = W / 2, bw = W * (o.bw || .66), bh = (gy - H * .05) * .9, bx = vx - bw / 2, by = gy - bh;
    ctx.fillStyle = shade(wall, -.16); ctx.fillRect(0, 0, W, H);
    sPoly([[0, H], [bx, gy], [bx + bw, gy], [W, H]], floor, { lw: 4 * u });
    for (let k = 1; k < 12; k++) line(bx + bw * k / 12, gy, W * k / 12, H, 2 * u, shade(floor, -.16));
    for (let k = 1; k < 6; k++) { const q = (k / 6) ** 1.7, y = gy + (H - gy) * q; line(lerp(bx, 0, q), y, lerp(bx + bw, W, q), y, 2 * u, shade(floor, -.1)); }
    sPoly([[0, 0], [bx, by], [bx, gy], [0, H]], shade(wall, -.07), { lw: 4 * u });
    sPoly([[W, 0], [bx + bw, by], [bx + bw, gy], [W, H]], shade(wall, -.1), { lw: 4 * u });
    sRR(bx, by, bw, bh, 0, wall, { lw: 4 * u });
    sPoly([[0, 0], [W, 0], [bx + bw, by], [bx, by]], shade(wall, -.24), { lw: 4 * u, hi: null });
    return { vx, bw, bh, bx, by };
  }
  // window on the left side wall (perspective quad); q1..q2 along the wall, v1..v2 up the wall
  function sideWindow(R, gy, u, q1, q2, v1, v2, paneCol, frameCol, onPane) {
    const top = q => R.by * q, bot = q => H + (gy - H) * q, X = q => R.bx * q, Y = (q, v) => lerp(bot(q), top(q), v);
    const P = [[X(q1), Y(q1, v2)], [X(q2), Y(q2, v2)], [X(q2), Y(q2, v1)], [X(q1), Y(q1, v1)]];
    poly(P, paneCol, 0); if (onPane) { ctx.save(); ctx.beginPath(); P.forEach((p, i) => i ? ctx.lineTo(...p) : ctx.moveTo(...p)); ctx.closePath(); ctx.clip(); onPane(P); ctx.restore(); }
    poly(P, null, 7 * u); const qm = (q1 + q2) / 2; line(X(qm), Y(qm, v1), X(qm), Y(qm, v2), 5 * u, frameCol); line(X(q1), Y(q1, (v1 + v2) / 2), X(q2), Y(q2, (v1 + v2) / 2), 5 * u, frameCol);
    return P;
  }
  function rug(u, gy, R, col, q0 = .2, q1 = .85, wd = .34) { const y0 = gy + (H - gy) * q0, y1 = gy + (H - gy) * q1, w0 = lerp(R.bw, W, q0) * wd, w1 = lerp(R.bw, W, q1) * wd;
    sPoly([[W / 2 - w0 / 2, y0], [W / 2 + w0 / 2, y0], [W / 2 + w1 / 2, y1], [W / 2 - w1 / 2, y1]], col, { lw: 4 * u });
    poly([[W / 2 - w0 * .4, y0 + 10 * u], [W / 2 + w0 * .4, y0 + 10 * u], [W / 2 + w1 * .4, y1 - 12 * u], [W / 2 - w1 * .4, y1 - 12 * u]], null, 3 * u); }
  function barStool(x, y, u, s = 1) { const k = u * s; for (const d of [-1, 1]) line(x + d * 26 * k, y, x + d * 16 * k, y - 150 * k, 7 * k, '#3a2418'); line(x - 22 * k, y - 60 * k, x + 22 * k, y - 60 * k, 5 * k, '#3a2418');
    sEll(x, y - 158 * k, 46 * k, 16 * k, '#8a2e22', { lw: 4 * k }); }
  function ceilingFan(x, y, u, t, col = '#5a3a22') {
    line(x, y - 70 * u, x, y, 5 * u, C.ink);
    for (let k = 0; k < 4; k++) { const a = t * 6.5 + k * TAU / 4, dx = Math.cos(a) * 120 * u, dy = Math.sin(a) * 120 * u * .26;
      sEll(x + dx / 2, y + dy / 2, 66 * u, 12 * u, col, { lw: 4 * u }, Math.atan2(dy, dx)); }
    sCirc(x, y, 18 * u, '#b8893a', { lw: 4 * u });
  }
  function pendant(x, y, u, t, on, col = '#ffd27a', sw = 0) { const xx = x + Math.sin(t * 1.3) * sw * u; line(x, 0, xx, y, 3 * u, C.ink); if (on) glow(xx, y + 20 * u, 210 * u, col, .5);
    sPoly([[xx - 34 * u, y + 22 * u], [xx + 34 * u, y + 22 * u], [xx + 16 * u, y - 6 * u], [xx - 16 * u, y - 6 * u]], '#3f5a48', { lw: 4 * u }); circ(xx, y + 26 * u, 10 * u, on ? '#fff3c4' : '#e8e2d0', 3 * u); }
  function frame(x, y, w, h, u, kind) { sRR(x - 8 * u, y - 8 * u, w + 16 * u, h + 16 * u, 4 * u, '#6e4325', { lw: 4 * u }); rr(x, y, w, h, 2 * u, '#d9c39a', 3 * u);
    ctx.save(); ctx.globalAlpha = .55; if (kind === 'man') { circ(x + w / 2, y + h * .38, w * .2, '#7a5a3a', 0); rr(x + w * .22, y + h * .6, w * .56, h * .4, w * .2, '#7a5a3a', 0); } else { rr(x + w * .1, y + h * .55, w * .8, h * .35, 4 * u, '#7a5a3a', 0); circ(x + w * .7, y + h * .3, w * .12, '#7a5a3a', 0); } ctx.restore(); }

  // ---------------------------------------------------------------- 1946 hotel bar
  defPlace('metropole_bar', 'Hà Nội 1946 — hotel bar at night', 'Dark-wood hotel bar: gilt mirror, shelves of bottles, back-bar cabinet, brass lamps, ceiling fan, shuttered window to the night street.', 170, (t, o) => {
    const u = U(), gy = HB() - 170 * u, night = o.time !== 'day'; LW = 5 * u; const wall = '#6b4329';
    const R = roomShell(u, gy, wall, '#3d2617'); const { bx, by, bw, bh, vx } = R;
    for (let k = 0; k <= 8; k++) line(bx + bw * k / 8, by + bh * .55, bx + bw * k / 8, gy, 3 * u, shade(wall, -.22));
    rr(bx, by + bh * .53, bw, 12 * u, 0, shade(wall, .14), 3 * u);
    const mx = bx + bw * .1, mw = bw * .8, my = by + bh * .07, mh = bh * .27;
    sRR(mx - 16 * u, my - 16 * u, mw + 32 * u, mh + 32 * u, 12 * u, '#b9853e', { lw: 5 * u });
    rr(mx, my, mw, mh, 6 * u, '#34424a', 4 * u);
    ctx.save(); ctx.globalAlpha = .16; ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.moveTo(mx + mw * .18, my); ctx.lineTo(mx + mw * .34, my); ctx.lineTo(mx + mw * .2, my + mh); ctx.lineTo(mx + mw * .04, my + mh); ctx.closePath(); ctx.fill(); ctx.restore();
    T('BAR', vx, my + mh * .55, { size: 58 * u, font: 'display', fill: '#f3d38a', lw: 6 * u });
    for (let s2 = 0; s2 < 2; s2++) { const sy = my + mh + 70 * u + s2 * bh * .12; rr(mx - 24 * u, sy, mw + 48 * u, 11 * u, 3 * u, '#8a5a32', 3 * u);
      for (let i = 0; i < 12; i++) { const x = mx + (i + .5) * mw / 12, hg = (46 + hash(i * 13 + s2 * 7) * 40) * u, c = ['#2f6b45', '#7a2b22', '#c99a3a', '#3a5a8a', '#d8c27a'][Math.floor(hash(i * 5 + s2 * 3) * 5)];
        sRR(x - 12 * u, sy - hg, 24 * u, hg, 7 * u, c, { lw: 3.5 * u }); rr(x - 4.5 * u, sy - hg - 15 * u, 9 * u, 17 * u, 3 * u, shade(c, -.12), 3 * u);
        ctx.save(); ctx.globalAlpha = night ? .4 : .25; rr(x - 7 * u, sy - hg + 8 * u, 4 * u, hg * .5, 2 * u, '#fff8e0', 0); ctx.restore(); } }
    const cy = gy - bh * .16; sRR(bx + bw * .03, cy, bw * .94, bh * .16, 6 * u, '#4f2d1b', { lw: 5 * u }); rr(bx + bw * .01, cy - 16 * u, bw * .98, 20 * u, 6 * u, '#9a6338', 4 * u);
    for (let k = 0; k < 5; k++) rr(bx + bw * .07 + k * bw * .175, cy + 18 * u, bw * .145, bh * .16 - 34 * u, 6 * u, shade('#4f2d1b', .07), 3 * u);
    for (let k = 0; k < 3; k++) drawProp('caphe_phin', bx + bw * (.24 + k * .26), cy - 14 * u, .32 * u, {}, t);
    for (const lx of [bx + bw * .055, bx + bw * .945]) { const ly = by + bh * .2; if (night) glow(lx, ly, 190 * u, '#ffc66a', .6); line(lx, ly + 16 * u, lx, ly + 64 * u, 5 * u, '#7a5a2a');
      sPoly([[lx - 28 * u, ly + 20 * u], [lx + 28 * u, ly + 20 * u], [lx + 16 * u, ly - 16 * u], [lx - 16 * u, ly - 16 * u]], '#f3d38a', { lw: 4 * u }); }
    sideWindow(R, gy, u, .22, .8, .32, .78, night ? '#18284f' : '#9fd0e6', '#2e4a3a', P => { if (night) { glow(P[1][0] - 20 * u, P[1][1] + 60 * u, 60 * u, '#fff3c4', .7); circ(P[1][0] - 20 * u, P[1][1] + 60 * u, 12 * u, '#fff3c4', 0); }
      for (let k = 0; k < 3; k++) rr(P[0][0] + k * 40 * u, P[3][1] - (90 + k * 30) * u, 34 * u, 200 * u, 2 * u, night ? '#2a3550' : '#c9b48a', 0); });
    ceilingFan(vx, by - 10 * u, u, t);
    rug(u, gy, R, '#7a2b22'); barStool(W * .1, gy + (H - gy) * .62, u, H > W ? 1.15 : .9); barStool(W * .9, gy + (H - gy) * .62, u, H > W ? 1.15 : .9);
    if (night) { ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = 'rgba(150,100,70,.22)'; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  }, { surface: 'floor' });

  // ---------------------------------------------------------------- 1946 back kitchen
  defPlace('giang_kitchen', 'Hà Nội 1946 — hotel back kitchen', 'Tiled back room: shelves of jars and egg baskets, charcoal stove with a steaming kettle, swinging bulb, work table.', 170, (t, o) => {
    const u = U(), gy = HB() - 170 * u, night = o.time !== 'day'; LW = 5 * u; const wall = '#d2bd95';
    const R = roomShell(u, gy, wall, '#6e4c30', { bw: .7 }); const { bx, by, bw, bh, vx } = R;
    const ty = by + bh * .5; for (let r = 0; r < 6; r++) for (let c = 0; c < 14; c++) rr(bx + c * bw / 14, ty + r * (gy - ty) / 6, bw / 14, (gy - ty) / 6, 0, (r + c) % 2 ? '#e8e0c8' : '#9cc0a8', 1.5 * u);
    for (let s2 = 0; s2 < 2; s2++) { const sy = by + bh * (.2 + s2 * .17), sx = bx + bw * .05; rr(sx, sy, bw * .42, 10 * u, 2 * u, '#7a4f2c', 3 * u);
      for (let i = 0; i < 5; i++) { const x = sx + 30 * u + i * bw * .08, c = ['#b9784c', '#e8d9b0', '#5f8f5a', '#c8a050'][(i + s2) % 4]; sRR(x - 18 * u, sy - 52 * u, 36 * u, 52 * u, 10 * u, c, { lw: 3.5 * u }); rr(x - 20 * u, sy - 60 * u, 40 * u, 10 * u, 3 * u, shade(c, -.2), 3 * u); } }
    { const x = bx + bw * .86, y = by + bh * .4; drawProp('basket', x, y, .7 * u, {}, t); for (let i = 0; i < 7; i++) sEll(x - 50 * u + (i % 4) * 32 * u + (i > 3 ? 16 * u : 0), y - 40 * u - (i > 3 ? 18 * u : 0), 15 * u, 19 * u, '#f6ead2', { lw: 3 * u }); }
    { const x = bx + bw * .86, y = gy - bh * .02; sRR(x - 90 * u, y - 160 * u, 180 * u, 160 * u, 8 * u, '#9a4e33', { lw: 5 * u }); for (let r = 0; r < 4; r++) line(x - 90 * u, y - 40 * u * r, x + 90 * u, y - 40 * u * r, 2 * u, shade('#9a4e33', -.2));
      rr(x - 50 * u, y - 120 * u, 100 * u, 50 * u, 10 * u, '#2b1d16', 3 * u); glow(x, y - 95 * u, 80 * u, '#ff8a3a', .55 + .1 * Math.sin(t * 9)); ell(x, y - 98 * u, 34 * u, 10 * u, '#ff9a4a', 0);
      sCirc(x, y - 205 * u, 48 * u, '#6f7b80', { lw: 5 * u }); line(x + 40 * u, y - 210 * u, x + 85 * u, y - 240 * u, 9 * u, C.ink); line(x + 40 * u, y - 210 * u, x + 85 * u, y - 240 * u, 4 * u, '#6f7b80'); steamFx(x + 90 * u, y - 250 * u, t, 3, 1.2 * u); }
    { const ww = bw * .2, wx = vx + bw * .03, wy = by + bh * .07; rr(wx, wy, ww, bh * .22, 4 * u, night ? '#18284f' : '#a8d6ee', 6 * u); line(wx + ww / 2, wy, wx + ww / 2, wy + bh * .22, 4 * u); if (night) drawProp('moon', wx + ww * .7, wy + bh * .07, .32 * u, {}, t); }
    const tY = gy - bh * .2; sRR(bx + bw * .2, tY, bw * .6, 26 * u, 6 * u, '#a06a3c', { lw: 5 * u }); rr(bx + bw * .24, tY + 26 * u, 16 * u, bh * .2 - 26 * u, 3 * u, '#7a4f2c', 4 * u); rr(bx + bw * .76 - 16 * u, tY + 26 * u, 16 * u, bh * .2 - 26 * u, 3 * u, '#7a4f2c', 4 * u);
    drawProp('egg_whisk_bowl', bx + bw * .34, tY, .42 * u, {}, t); for (let i = 0; i < 3; i++) sEll(bx + bw * (.6 + i * .045), tY - 16 * u, 14 * u, 18 * u, '#f6ead2', { lw: 3 * u });
    pendant(vx - bw * .12, by + bh * .06, u, t, night, '#ffd27a', 22);
    rug(u, gy, R, '#b89a5a', .25, .8, .3);
    { const y = gy + (H - gy) * .6; drawProp('basket', W * .11, y, (H > W ? .9 : .7) * u, {}, t); for (let i = 0; i < 5; i++) sEll(W * .11 - 44 * u + i * 22 * u, y - 46 * u - (i % 2) * 10 * u, 13 * u, 16 * u, '#f6ead2', { lw: 3 * u });
      sRR(W * .84, y - 70 * u, 120 * u, 70 * u, 6 * u, '#9a6338', { lw: 4 * u }); line(W * .84, y - 35 * u, W * .84 + 120 * u, y - 35 * u, 3 * u); }
    if (night) { ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = 'rgba(140,110,90,.2)'; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  }, { surface: 'floor' });

  // ---------------------------------------------------------------- 1946 street with tram
  function tram(x, y, u, t) { const w = 460 * u, h = 200 * u; line(x + w * .5, y - h - 6 * u, x + w * .62, y - h - 120 * u, 5 * u, C.ink);
    sRR(x, y - h, w, h * .55, 14 * u, '#f0e2b6', { lw: 5 * u }); sRR(x, y - h * .45, w, h * .45, 10 * u, '#c8402e', { lw: 5 * u }); rr(x - 8 * u, y - h - 16 * u, w + 16 * u, 22 * u, 10 * u, '#8a2e22', 4 * u);
    for (let i = 0; i < 6; i++) rr(x + 24 * u + i * 72 * u, y - h + 18 * u, 54 * u, 62 * u, 6 * u, '#3d5560', 3.5 * u);
    T('3', x + w * .9, y - h * .25, { size: 40 * u, font: 'display', fill: '#f3d38a', lw: 5 * u });
    for (const wx of [x + 70 * u, x + w - 70 * u]) { sCirc(wx, y, 26 * u, '#3a3330', { lw: 4 * u }); const a = t * 6; line(wx, y, wx + Math.cos(a) * 18 * u, y + Math.sin(a) * 18 * u, 3 * u, '#9aa1a8'); } }
  defPlace('hanoi1946', 'Hà Nội 1946 — colonial street with tram', 'Ochre colonial facades with green shutters, trees, lamp posts, overhead tram wire, a red-and-cream tram rattling past, cobbled road with rails.', 190, (t, o) => {
    const u = U(), gy = HB() - 190 * u, s = o.scroll || 0; LW = 5 * u;
    sky({ ...o, t }, gy - 380 * u);
    layerRep(1800 * u, .15, s, x0 => { for (let i = 0; i < 9; i++) { const h = (120 + hash(i * 3) * 140) * u; rr(x0 + i * 200 * u, gy - 300 * u - h, 190 * u, h, 3 * u, shade('#c9b49a', hash(i) * .12 - .06), 3 * u); sPoly([[x0 + i * 200 * u - 10 * u, gy - 300 * u - h], [x0 + i * 200 * u + 95 * u, gy - 360 * u - h], [x0 + i * 200 * u + 200 * u, gy - 300 * u - h]], '#a8584a', { lw: 3 * u, hi: null }); } });
    hazeBand(gy - 300 * u, 90 * u, '#fff3d8', .45);
    const V = H > W, bH = (V ? 760 : 470) * u;
    layerRep(2300 * u, .45, s, x0 => { for (let i = 0; i < 3; i++) colonial(x0 + i * 760 * u + 40 * u, gy - 70 * u, 700 * u, bH, pick(['#eec36a', '#f0d48a', '#e2b05a'], i), u); });
    rr(-20, gy - 80 * u, W + 40, 20 * u, 0, '#d8c8a8', 4 * u);
    layerRep(900 * u, .6, s, x0 => { const lx = x0 + 120 * u; line(lx, gy - 70 * u, lx, gy - 470 * u, 9 * u, C.ink); line(lx, gy - 70 * u, lx, gy - 470 * u, 4 * u, '#3a4a40'); sPoly([[lx - 22 * u, gy - 470 * u], [lx + 22 * u, gy - 470 * u], [lx + 14 * u, gy - 520 * u], [lx - 14 * u, gy - 520 * u]], '#e8d9a0', { lw: 4 * u });
      drawProp('tree', x0 + 560 * u, gy - 60 * u, 1.15 * u, { color: '#6aa84a' }, t); });
    ctx.beginPath(); ctx.moveTo(-20, gy - 560 * u); ctx.quadraticCurveTo(W / 2, gy - 520 * u, W + 20, gy - 560 * u); ctx.lineWidth = 3 * u; ctx.strokeStyle = C.ink; ctx.stroke();
    const ts = V ? 1.35 : 1, span = W + 1100 * u * ts, tx = ((t * 150 * u - s * .7) % span + span) % span - 560 * u * ts; ctx.save(); ctx.translate(tx, gy - 30 * u); ctx.scale(ts, ts); tram(0, 0, u, t); ctx.restore();
    rr(-20, gy - 6 * u, W + 40, H - gy + 30, 0, '#a09482', LW);
    for (let r = 0; r < 5; r++) for (let c = 0; c < 26; c++) { const x = (c + (r % 2) * .5) * W / 24 - ((s * (.8 + r * .05)) % (W / 24)), y = gy + 16 * u + r * 30 * u; ctx.beginPath(); ctx.arc(x, y, 16 * u, Math.PI, 0); ctx.lineWidth = 2 * u; ctx.strokeStyle = shade('#a09482', -.15); ctx.stroke(); }
    line(0, gy + 26 * u, W, gy + 26 * u, 6 * u, '#6d655a'); line(0, gy + 60 * u, W, gy + 60 * u, 6 * u, '#6d655a');
    if (V) { const ry = gy + (H - gy) * .42; rr(-20, ry, W + 40, (H - gy) * .14, 0, '#8d8272', 4 * u); line(0, ry + 20 * u, W, ry + 20 * u, 7 * u, '#5d564c'); line(0, ry + (H - gy) * .14 - 20 * u, W, ry + (H - gy) * .14 - 20 * u, 7 * u, '#5d564c');
      for (let k = 0; k < 14; k++) { const x = ((k * 110 * u - s * 1.1) % (W + 110 * u) + W + 110 * u) % (W + 110 * u) - 55 * u; rr(x, ry + 16 * u, 26 * u, (H - gy) * .14 - 32 * u, 3 * u, '#6e5a44', 3 * u); }
      drawProp('cyclo', W * .86 - s * .9 % W, H - (H - gy) * .22, .75 * u, {}, t); }
    ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = 'rgba(255,215,160,.2)'; ctx.fillRect(0, 0, W, H); ctx.restore();
    timeTint(o);
  }, { surface: 'pavement' });

  // ---------------------------------------------------------------- today: the café
  defPlace('cafe_giang', 'Hà Nội today — old egg-coffee café', 'Warm yellow café: framed old photos, chalk menu, staircase, tiny stools and low tables, ceiling fan, doorway with scooters passing.', 170, (t, o) => {
    const u = U(), gy = HB() - 170 * u, night = o.time === 'night'; LW = 5 * u; const wall = '#e6b85c';
    const R = roomShell(u, gy, wall, '#7a4b2c', { bw: .64 }); const { bx, by, bw, bh, vx } = R;
    { const dx = bx + bw * .62, dw = bw * .32, dy = by + bh * .2, dh = bh * .8; rr(dx, dy, dw, dh, 4 * u, night ? '#1c2a4a' : '#bfe3f2', 6 * u);
      ctx.save(); ctx.beginPath(); ctx.rect(dx, dy, dw, dh); ctx.clip(); rr(dx, dy + dh * .78, dw, dh * .22, 0, '#8d8a85', 3 * u);
      for (let k = 0; k < 2; k++) { const px = dx + ((t * (180 + k * 70) * u + k * 300 * u) % (dw + 300 * u)) - 150 * u, py = dy + dh * .88 - k * 14 * u; sRR(px, py - 40 * u, 110 * u, 34 * u, 12 * u, ['#d94b3a', '#3a7bd5'][k], { lw: 3.5 * u }); circ(px + 18 * u, py, 14 * u, C.ink, 0); circ(px + 92 * u, py, 14 * u, C.ink, 0); circ(px + 64 * u, py - 58 * u, 16 * u, ['#f2c94c', '#ffffff'][k], 3 * u); }
      ctx.restore(); rr(dx - 10 * u, dy - 12 * u, dw + 20 * u, 16 * u, 3 * u, '#6e4325', 4 * u); }
    frame(bx + bw * .07, by + bh * .14, bw * .14, bh * .17, u, 'man'); frame(bx + bw * .25, by + bh * .18, bw * .12, bh * .13, u, 'street');
    { const mx = bx + bw * .08, my = by + bh * .4, mw = bw * .44, mh = bh * .25; sRR(mx - 10 * u, my - 10 * u, mw + 20 * u, mh + 20 * u, 6 * u, '#7a4f2c', { lw: 4 * u }); rr(mx, my, mw, mh, 4 * u, '#2f4a3a', 3 * u);
      ['CÀ PHÊ TRỨNG', 'CÀ PHÊ ĐEN', 'CA CAO TRỨNG'].forEach((l, i) => T(l, mx + mw / 2, my + mh * (.26 + i * .27), { size: Math.min(34 * u, mw / 9), font: 'body', fill: '#f4efe0', lw: 0 })); }
    for (let k = 0; k < 7; k++) { const sx = lerp(R.bx * .95, R.bx * .1, k / 7), sy = lerp(gy - 10 * u, by + bh * .1, k / 7); sRR(sx - 60 * u, sy - 22 * u, 90 * u, 26 * u, 4 * u, '#8a5a32', { lw: 3.5 * u }); }
    sPoly([[R.bx * .98, gy - 10 * u], [R.bx * .1, by + bh * .1], [R.bx * .1, by + bh * .1 + 40 * u], [R.bx * .98, gy + 30 * u]], '#6e4325', { lw: 4 * u });
    line(R.bx * .98, gy - 120 * u, R.bx * .12, by + bh * .1 - 100 * u, 6 * u, '#5a3a22'); for (let k = 0; k < 7; k++) { const q = k / 6; line(lerp(R.bx * .98, R.bx * .12, q), lerp(gy - 120 * u, by + bh * .1 - 100 * u, q), lerp(R.bx * .95, R.bx * .1, q), lerp(gy - 10 * u, by + bh * .1, q), 3 * u, '#5a3a22'); }
    for (const [x, y, s2, c] of [[W * .1, gy + (H - gy) * .55, .9, C.red], [W * .24, gy + (H - gy) * .3, .7, '#3a7bd5'], [W * .9, gy + (H - gy) * .55, .9, '#3a7bd5'], [W * .77, gy + (H - gy) * .3, .7, C.red]]) drawProp('stool', x, y, s2 * .5 * u, { color: c }, t);
    drawProp('table_low', W * .17, gy + (H - gy) * .5, .5 * u, {}, t); drawProp('table_low', W * .83, gy + (H - gy) * .5, .5 * u, {}, t);
    drawProp('caphe_trung_bath', W * .17, gy + (H - gy) * .5 - 56 * u, .32 * u, {}, t);
    ceilingFan(vx, by - 10 * u, u, t, '#7a4f2c'); pendant(bx + bw * .2, by + bh * .02, u, t, true, '#ffd27a', 0); pendant(bx + bw * .8, by + bh * .02, u, t, true, '#ffd27a', 0);
    timeTint(o);
  }, { surface: 'floor' });

  // ---------------------------------------------------------------- props
  defProp('egg_whisk_bowl', 'food', 'Egg yolk being whisked in a bowl', 220, 200, (o, t) => {
    const a = Math.sin(t * 16) * .45;
    sEll(0, -96, 104, 26, '#f7f2e6', { lw: 5 });
    ctx.save(); ctx.beginPath(); ctx.ellipse(0, -96, 96, 21, 0, 0, TAU); ctx.clip(); sSmooth([[-90, -88], [-50, -112 - 6 * Math.sin(t * 8)], [0, -122], [50, -110 + 6 * Math.sin(t * 8)], [90, -88], [0, -72]], '#f6d27a', { lw: 3 }); ctx.restore();
    sPoly([[-104, -96], [104, -96], [72, -16], [-72, -16]], '#f7f2e6'); ell(0, -14, 56, 10, '#e8e2d0', 4);
    ctx.save(); ctx.translate(10, -104); ctx.rotate(a - .5); line(0, 0, 0, -120, 9, C.ink); line(0, 0, 0, -120, 5, '#b8893a');
    for (const k of [-1, 0, 1]) { ctx.beginPath(); ctx.ellipse(k * 6, 30, 14 + Math.abs(k) * 8, 34, 0, 0, TAU); ctx.lineWidth = 3; ctx.strokeStyle = '#9aa1a8'; ctx.stroke(); } ctx.restore();
    for (let i = 0; i < 4; i++) { const p = (t * 1.6 + i * .25) % 1; ctx.save(); ctx.globalAlpha = 1 - p; circ(-40 + i * 26 + Math.sin(t * 5 + i) * 10, -120 - p * 60, 5, '#fff3c4', 0); ctx.restore(); }
  }, { gripY: 120 });
  defProp('caphe_trung_bath', 'food', 'Egg coffee standing in a bowl of hot water', 220, 190, (o, t) => {
    sEll(0, -40, 108, 26, '#f4efe6', { lw: 5 }); sPoly([[-108, -40], [108, -40], [80, 0], [-80, 0]], '#f4efe6'); ctx.save(); ctx.globalAlpha = .7; ell(0, -42, 92, 18, '#a9c7cf', 0); ctx.restore();
    sPoly([[-46, -150], [46, -150], [36, -46], [-36, -46]], '#fbf7ee'); ell(0, -150, 46, 12, '#f2cc6e', 5); ctx.save(); ctx.globalAlpha = .5; ell(-10, -152, 16, 4, '#c7883e', 0); ctx.restore();
    line(30, -160, 76, -214, 8, C.ink); line(30, -160, 76, -214, 4, '#c9ccd0'); ell(80, -218, 9, 6, '#c9ccd0', 3);
    if (o.steam !== false) { steamFx(-10, -170, t, 3, .9); steamFx(-80, -60, t + 1.3, 2, .6); }
  }, { gripY: 90 });
})();
