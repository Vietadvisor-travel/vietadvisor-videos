/* Cinematic camera angles in flat style (Ep. 4 world: crossing the street in Hà Nội). Flat colours, no 3D engine —
   the drama comes from the ANGLE: perspective, scale contrast, foreground framing, depth staging.
   shot_worm    worm's-eye from the asphalt: a wall of headlights rushing at the lens, Dave tiny and frozen
   shot_bird    god's-eye over the intersection: a river of scooters flowing around Dave like fish around a stone
   shot_ots     over-the-shoulder: the back of Dave's head huge in frame, the street of lights waiting ahead
   shot_street  one-point perspective down an Old Quarter street at dusk, the rule written as a neon sign in the scene
   shot_eyes    extreme close-up: Dave's eyes, headlights reflected, a bead of sweat */
(function () {
  const lin = (st, x0, y0, x1, y1) => { const g = ctx.createLinearGradient(x0, y0, x1, y1); st.forEach(([o, c]) => g.addColorStop(o, c)); return g; };
  const gl = (x, y, r, col, a = 1) => { const g = ctx.createRadialGradient(x, y, 0, x, y, Math.max(1, r)); g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha *= a; ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); ctx.restore(); };
  const lb = () => { const h = H > W ? H * .06 : H * .09; ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, h); ctx.fillRect(0, H - h, W, h); };
  function word(txt, x, y, o = {}) { const u = U(); ctx.save(); ctx.translate(x, y); if (o.rot) ctx.rotate(o.rot); if (o.skew) ctx.transform(1, 0, o.skew, 1, 0, 0); ctx.globalAlpha *= o.a ?? 1; ctx.font = `${o.w || 900} ${(o.size || 100) * u}px ${FONT.display}`; ctx.textAlign = o.align || 'center'; ctx.textBaseline = 'middle'; if (o.ls) ctx.letterSpacing = `${o.ls * u}px`;
    const mw = o.maxW ?? W * .86, tw = ctx.measureText(txt).width; if (tw > mw) ctx.scale(mw / tw, mw / tw); if (o.stroke) { ctx.lineWidth = o.stroke * u; ctx.strokeStyle = o.strokeCol || '#111'; ctx.lineJoin = 'round'; ctx.strokeText(txt, 0, 0); } if (o.glow) { ctx.shadowColor = o.glow; ctx.shadowBlur = 30 * u; } ctx.fillStyle = o.fill || '#fff'; ctx.fillText(txt, 0, 0); ctx.restore(); }
  // front view of a scooter + rider (flat), s = scale, lit = headlight on
  // ---- scooter + rider, drawn properly: front (toward camera) and back (away). Units: 1 = ~1 cm at s=1; ground at y=0.
  const SK = ['#f2c9a0', '#e3b088', '#c98f66', '#a8714c'];
  function shadeC(c, k) { return typeof shade === 'function' ? shade(c, k) : c; }
  function helmetF(y, hc, o) { // helmet seen from the front: shell, brim, visor, strap
    ctx.fillStyle = hc; ctx.beginPath(); ctx.ellipse(0, y, 40, 38, 0, Math.PI * 1.02, Math.PI * 1.98); ctx.lineTo(40, y + 8); ctx.quadraticCurveTo(0, y + 2, -40, y + 8); ctx.closePath(); ctx.fill();
    ctx.fillStyle = shadeC(hc, -.18); ctx.beginPath(); ctx.ellipse(0, y + 6, 44, 9, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.beginPath(); ctx.ellipse(-14, y - 22, 14, 8, -.4, 0, Math.PI * 2); ctx.fill(); }
  function faceF(y, sk, o) { ctx.fillStyle = sk; ctx.beginPath(); ctx.ellipse(0, y + 26, 27, 25, 0, 0, Math.PI * 2); ctx.fill();
    if (o.mask) { ctx.fillStyle = o.mask; ctx.beginPath(); ctx.moveTo(-26, y + 26); ctx.quadraticCurveTo(0, y + 18, 26, y + 26); ctx.quadraticCurveTo(24, y + 50, 0, y + 52); ctx.quadraticCurveTo(-24, y + 50, -26, y + 26); ctx.fill(); ctx.strokeStyle = 'rgba(0,0,0,.25)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-26, y + 28); ctx.lineTo(-40, y + 18); ctx.moveTo(26, y + 28); ctx.lineTo(40, y + 18); ctx.stroke(); }
    ctx.fillStyle = '#1b1410'; for (const d of [-1, 1]) { ctx.beginPath(); ctx.ellipse(d * 10, y + 20, 3.6, 4.6, 0, 0, Math.PI * 2); ctx.fill(); }
    ctx.strokeStyle = '#1b1410'; ctx.lineWidth = 3; for (const d of [-1, 1]) { ctx.beginPath(); ctx.moveTo(d * 4, y + 12); ctx.lineTo(d * 16, y + 11 - (o.brow || 0)); ctx.stroke(); } }
  function scooterFront(x, y, s, col, t, o = {}) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); const lean = Math.sin(t * 2.3 + x * .01) * .03; ctx.rotate(lean);
    const dark = shadeC(col, -.22), lite = shadeC(col, .18), sk = o.skin || SK[(Math.abs(x | 0) >> 3) % 4];
    ctx.fillStyle = 'rgba(0,0,0,.28)'; ctx.beginPath(); ctx.ellipse(0, 3, 64, 12, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#17171c'; ctx.beginPath(); ctx.roundRect(-12, -46, 24, 48, 10); ctx.fill(); ctx.fillStyle = '#3a3a44'; ctx.fillRect(-6, -44, 12, 40);   // tyre
    ctx.fillStyle = dark; ctx.beginPath(); ctx.moveTo(-22, -46); ctx.quadraticCurveTo(0, -64, 22, -46); ctx.lineTo(18, -36); ctx.quadraticCurveTo(0, -46, -18, -36); ctx.fill();          // fender
    // knees + shoes either side of the leg shield
    ctx.fillStyle = o.pants || '#2c3342'; for (const d of [-1, 1]) { ctx.beginPath(); ctx.ellipse(d * 46, -112, 15, 22, d * .2, 0, Math.PI * 2); ctx.fill(); } ctx.fillStyle = '#222'; for (const d of [-1, 1]) { ctx.beginPath(); ctx.ellipse(d * 40, -50, 14, 7, 0, 0, Math.PI * 2); ctx.fill(); }
    // leg shield: shaped, two-tone, chrome trim, amber indicators
    ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-30, -52); ctx.bezierCurveTo(-46, -90, -40, -132, -26, -150); ctx.lineTo(26, -150); ctx.bezierCurveTo(40, -132, 46, -90, 30, -52); ctx.quadraticCurveTo(0, -42, -30, -52); ctx.fill();
    ctx.fillStyle = dark; ctx.beginPath(); ctx.moveTo(30, -52); ctx.bezierCurveTo(46, -90, 40, -132, 26, -150); ctx.lineTo(14, -150); ctx.bezierCurveTo(26, -126, 30, -90, 18, -50); ctx.fill();
    ctx.fillStyle = lite; ctx.beginPath(); ctx.moveTo(-24, -60); ctx.bezierCurveTo(-36, -92, -30, -126, -18, -144); ctx.lineTo(-10, -144); ctx.bezierCurveTo(-22, -120, -24, -90, -14, -58); ctx.fill();
    ctx.strokeStyle = '#d9dde6'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-26, -150); ctx.lineTo(26, -150); ctx.stroke();
    // handlebar cowl, headlight, indicators, mirrors
    ctx.fillStyle = shadeC(col, -.08); ctx.beginPath(); ctx.roundRect(-46, -176, 92, 30, 14); ctx.fill(); ctx.fillStyle = '#26262e'; ctx.fillRect(-66, -168, 132, 8); for (const d of [-1, 1]) { ctx.fillStyle = '#1e1e24'; ctx.beginPath(); ctx.roundRect(d * 66 - 9, -172, 18, 16, 6); ctx.fill(); }
    ctx.fillStyle = '#fff7dc'; ctx.beginPath(); ctx.roundRect(-20, -170, 40, 18, 8); ctx.fill(); ctx.fillStyle = '#ffb02e'; for (const d of [-1, 1]) { ctx.beginPath(); ctx.roundRect(d * 34 - 6, -166, 12, 9, 3); ctx.fill(); }
    ctx.strokeStyle = '#2a2a30'; ctx.lineWidth = 3; for (const d of [-1, 1]) { ctx.beginPath(); ctx.moveTo(d * 44, -176); ctx.lineTo(d * 60, -206); ctx.stroke(); ctx.fillStyle = '#c9ccd6'; ctx.beginPath(); ctx.ellipse(d * 62, -212, 12, 8, d * .35, 0, Math.PI * 2); ctx.fill(); }
    // rider torso, arms to the grips, hands, collar
    const sh = o.shirt || '#3b6fb0'; ctx.fillStyle = sh; ctx.beginPath(); ctx.moveTo(-40, -176); ctx.quadraticCurveTo(-46, -232, -30, -250); ctx.lineTo(30, -250); ctx.quadraticCurveTo(46, -232, 40, -176); ctx.closePath(); ctx.fill();
    ctx.fillStyle = shadeC(sh, -.15); ctx.fillRect(-2, -248, 4, 70); for (const d of [-1, 1]) { ctx.strokeStyle = sh; ctx.lineWidth = 17; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(d * 32, -238); ctx.quadraticCurveTo(d * 64, -212, d * 64, -176); ctx.stroke(); ctx.fillStyle = sk; ctx.beginPath(); ctx.arc(d * 64, -170, 9, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = sk; ctx.fillRect(-9, -258, 18, 12);
    if (o.passenger) { ctx.save(); ctx.translate(26, -40); ctx.scale(.9, .9); ctx.fillStyle = o.passenger; ctx.beginPath(); ctx.roundRect(-30, -232, 60, 70, 18); ctx.fill(); helmetF(-266, '#f2f2f2', o); faceF(-266, SK[1], { mask: '#7fb3d9' }); ctx.restore(); }
    helmetF(-290, o.helmet || '#e8c33a', o); faceF(-290, sk, o); ctx.restore();
    if (o.lit !== false) { gl(x, y - 161 * s, 190 * s, 'rgba(255,238,190,.9)'); gl(x, y - 161 * s, 46 * s, 'rgba(255,255,255,1)'); } }
  function scooterBack(x, y, s, col, t, o = {}) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(Math.sin(t * 2.1 + x * .01) * .03);
    const dark = shadeC(col, -.22), lite = shadeC(col, .15);
    ctx.fillStyle = 'rgba(0,0,0,.28)'; ctx.beginPath(); ctx.ellipse(0, 3, 60, 11, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#17171c'; ctx.beginPath(); ctx.roundRect(-13, -44, 26, 46, 10); ctx.fill();
    ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-44, -50); ctx.bezierCurveTo(-56, -84, -46, -118, -30, -128); ctx.lineTo(30, -128); ctx.bezierCurveTo(46, -118, 56, -84, 44, -50); ctx.quadraticCurveTo(0, -38, -44, -50); ctx.fill();
    ctx.fillStyle = dark; ctx.beginPath(); ctx.moveTo(44, -50); ctx.bezierCurveTo(56, -84, 46, -118, 30, -128); ctx.lineTo(22, -128); ctx.bezierCurveTo(34, -110, 40, -80, 30, -48); ctx.fill(); ctx.fillStyle = lite; ctx.fillRect(-36, -122, 10, 60);
    ctx.fillStyle = '#ff3030'; ctx.beginPath(); ctx.roundRect(-26, -96, 52, 14, 6); ctx.fill(); ctx.fillStyle = '#ffb02e'; for (const d of [-1, 1]) { ctx.beginPath(); ctx.roundRect(d * 36 - 6, -94, 12, 9, 3); ctx.fill(); }
    ctx.fillStyle = '#f4f4f0'; ctx.beginPath(); ctx.roundRect(-24, -76, 48, 24, 3); ctx.fill(); ctx.fillStyle = '#222'; ctx.font = '900 11px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('29-B1', 0, -66); ctx.fillText(o.plate || '123.45', 0, -55);
    ctx.fillStyle = '#2a2a30'; ctx.fillRect(-34, -134, 68, 8); ctx.fillStyle = o.pants || '#2c3342'; for (const d of [-1, 1]) { ctx.beginPath(); ctx.ellipse(d * 44, -112, 13, 24, d * -.15, 0, Math.PI * 2); ctx.fill(); }
    const sh = o.shirt || '#3b6fb0'; ctx.fillStyle = sh; ctx.beginPath(); ctx.moveTo(-42, -126); ctx.quadraticCurveTo(-50, -206, -32, -232); ctx.lineTo(32, -232); ctx.quadraticCurveTo(50, -206, 42, -126); ctx.closePath(); ctx.fill(); ctx.fillStyle = shadeC(sh, -.14); ctx.beginPath(); ctx.moveTo(0, -230); ctx.quadraticCurveTo(10, -180, 0, -128); ctx.lineTo(-4, -128); ctx.quadraticCurveTo(4, -180, -4, -230); ctx.fill();
    if (o.passenger) { ctx.fillStyle = o.passenger; ctx.beginPath(); ctx.roundRect(-30, -196, 60, 72, 18); ctx.fill(); ctx.fillStyle = '#f2f2f2'; ctx.beginPath(); ctx.arc(0, -214, 30, 0, Math.PI * 2); ctx.fill(); }
    const hc = o.helmet || '#e8c33a'; ctx.fillStyle = hc; ctx.beginPath(); ctx.arc(0, -262, 38, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = shadeC(hc, -.18); ctx.beginPath(); ctx.arc(0, -262, 38, .15, Math.PI - .15); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.3)'; ctx.beginPath(); ctx.ellipse(-12, -278, 13, 8, -.4, 0, Math.PI * 2); ctx.fill();
    ctx.restore(); if (o.lit !== false) { gl(x, y - 89 * s, 110 * s, 'rgba(255,50,50,.75)'); gl(x, y - 89 * s, 30 * s, 'rgba(255,160,160,1)'); } }
  window.scooterFrontPublic = (x, y, s, col, t, o = {}) => o.back ? scooterBack(x, y, s, col, t, o) : scooterFront(x, y, s, col, t, o);
  // top-down scooter (for the god's-eye)
  function scooterTop(x, y, ang, s, col, helmet) { ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(s, s);
    ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.beginPath(); ctx.ellipse(6, 6, 46, 16, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#1b1b22'; ctx.fillRect(-48, -5, 14, 10); ctx.fillRect(34, -5, 14, 10);
    ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(-36, -14, 72, 28, 12); ctx.fill(); ctx.fillStyle = '#2a2a33'; ctx.fillRect(22, -26, 6, 52);
    ctx.fillStyle = helmet; ctx.beginPath(); ctx.arc(-4, 0, 15, 0, TAU); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.beginPath(); ctx.arc(-8, -4, 6, 0, TAU); ctx.fill();
    ctx.fillStyle = '#fff6d8'; ctx.beginPath(); ctx.arc(38, 0, 4, 0, TAU); ctx.fill(); ctx.restore(); gl(x + Math.cos(ang) * 60 * s, y + Math.sin(ang) * 60 * s, 70 * s, 'rgba(255,240,190,.35)'); }
  const COLS = ['#d23b3b', '#2f7fd1', '#f0f0f0', '#2c2c35', '#e88a2e', '#3aa37a', '#8c55c9', '#e2c43c'], HEL = ['#e8c33a', '#f2f2f2', '#d23b3b', '#2c6fd1', '#1f1f26', '#ff8fc0'];
  const DAVE = () => CHAR.dave ? CHAR.dave.spec : null;

  // ---------- worm's-eye
  MOMENTS.shot_worm = { dur: 6, capY: .82, sfx: [[0, 'moto_pass'], [1.2, 'scooter_horn']], render(lt, D, o) {
    const u = U(), V = H > W, hz = H * (V ? .36 : .42), vx = W * .5;
    ctx.fillStyle = lin([[0, '#1a1840'], [.6, '#c2547a'], [1, '#ff9f5a']], 0, 0, 0, hz); ctx.fillRect(0, 0, W, hz);
    // tube houses towering, converging up (low camera → verticals lean in)
    for (const side of [-1, 1]) for (let i = 5; i >= 0; i--) { const x0 = vx + side * (W * .06 + i * W * .1), lean = side * (W * .02 + i * W * .075), top = H * .02 + (5 - i) * H * .012, w = W * .1;
      ctx.fillStyle = ['#e4b25a', '#d77c5a', '#5aa3a0', '#e8d6a8', '#c95a6a', '#7fa36a'][(i + (side > 0 ? 3 : 0)) % 6]; ctx.beginPath(); ctx.moveTo(x0, hz + 4); ctx.lineTo(x0 + side * w, hz + 4); ctx.lineTo(x0 + side * w - lean * 1.4, top); ctx.lineTo(x0 - lean, top); ctx.closePath(); ctx.fill();
      ctx.fillStyle = 'rgba(30,20,40,.35)'; for (let k = 0; k < 6; k++) { const yy = hz - (k + 1) * (hz - top) / 7; const xa = x0 - lean * (1 - (yy - top) / (hz - top)), xb = x0 + side * w - lean * 1.4 * (1 - (yy - top) / (hz - top)); ctx.fillRect(Math.min(xa, xb) + Math.abs(xb - xa) * .2, yy, Math.abs(xb - xa) * .6, 14 * u); } }
    for (let i = 0; i < 9; i++) { ctx.strokeStyle = 'rgba(20,16,30,.8)'; ctx.lineWidth = 2.5 * u; ctx.beginPath(); ctx.moveTo(0, H * .05 + i * 18 * u); ctx.quadraticCurveTo(W / 2, H * .12 + i * 22 * u, W, H * .04 + i * 16 * u); ctx.stroke(); }   // wires
    // asphalt, seen from the ground: lane marks rushing toward us
    ctx.fillStyle = lin([[0, '#3a3348'], [1, '#14121c']], 0, hz, 0, H); ctx.beginPath(); ctx.moveTo(0, H); ctx.lineTo(0, hz); ctx.lineTo(W, hz); ctx.lineTo(W, H); ctx.fill();
    for (let i = 0; i < 8; i++) { const ph = ((lt * .9 + i / 8) % 1), z = ph * ph, y = hz + z * (H - hz), w = 6 * u + z * 80 * u, h = 4 * u + z * 120 * u; ctx.fillStyle = '#f2e6b8'; ctx.globalAlpha = .8; ctx.fillRect(vx - w / 2, y, w, h); ctx.globalAlpha = 1; }
    // Dave far away, tiny, on the centre line
    if (DAVE()) person(vx, hz + 40 * u, .32 * u, DAVE(), { t: lt, pose: 'scared', expr: 'shocked' });
    // a wall of scooters — back rows small, front row huge, rushing past the lens
    const rows = [[.18, 7], [.32, 6], [.5, 5], [.75, 4]]; rows.forEach(([d, n], r) => { for (let i = 0; i < n; i++) { const ph = (lt * (.25 + r * .12) + i / n + r * .3) % 1, x = lerp(-W * .2, W * 1.2, (i + .5) / n + (ph - .5) * .25 * (r % 2 ? 1 : -1)), y = hz + d * (H - hz) * 1.05; scooterFront(x, y, d * 1.25 * u, COLS[(i * 3 + r) % 8], lt, { helmet: HEL[(i + r) % 6], shirt: COLS[(i * 5 + r * 2) % 8], mask: i % 3 ? null : '#9ab' }); } });
    const big = 1.6 + Math.sin(lt * 2) * .05, bx = W * (.78 - lt * .06), by = H * 1.02; scooterFront(bx, by, big * u, '#d23b3b', lt, { helmet: '#f2f2f2' });
    ctx.save(); ctx.globalAlpha = .25; ctx.filter = 'blur(6px)'; scooterFront(bx - 60 * u, by, big * u, '#d23b3b', lt, { lit: false }); ctx.restore();
    lb(); const a = clamp((lt - .5) / .4); word('RULE #1', W * .5, H * (V ? .2 : .2), { size: V ? 140 : 120, fill: '#fff', a, stroke: 18, strokeCol: '#1a1030', rot: -.06 }); word('NEVER RUN.', W * .5, H * (V ? .27 : .3), { size: V ? 80 : 70, fill: '#ffd34a', a: clamp((lt - .9) / .4), stroke: 14, strokeCol: '#1a1030', rot: -.06 });
  } };

  // ---------- god's-eye
  MOMENTS.shot_bird = { dur: 6, capY: .82, sfx: [[0, 'whoosh']], render(lt, D, o) {
    const u = U(), V = H > W, cx = W / 2, cy = H * .5, rot = lt * .05; ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot); ctx.scale(1.1 - lt * .015, 1.1 - lt * .015); ctx.translate(-cx, -cy);
    ctx.fillStyle = '#2b2a35'; ctx.fillRect(-W, -H, W * 3, H * 3); const rw = 420 * u;
    ctx.fillStyle = '#e2c79a'; for (const [x, y] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { ctx.beginPath(); ctx.roundRect(cx + (x > 0 ? rw / 2 : -W * 2), cy + (y > 0 ? rw / 2 : -H * 2), W * 2 - rw / 2 + W, H * 2, 40 * u); ctx.fill(); }
    for (const [x, y] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) for (let k = 0; k < 6; k++) { ctx.fillStyle = ['#c95a4a', '#e4a24a', '#5a8aa0', '#8aa05a', '#b06a9a', '#d8cfa8'][(k + x + 3 * y + 9) % 6]; const bx = cx + x * (rw / 2 + 30 * u + k * 130 * u) - (x < 0 ? 110 * u : 0), by = cy + y * (rw / 2 + 40 * u) - (y < 0 ? 140 * u : 0); ctx.fillRect(bx, by, 110 * u, 140 * u); ctx.fillStyle = 'rgba(0,0,0,.15)'; ctx.fillRect(bx, by + 120 * u, 110 * u, 20 * u); }
    ctx.strokeStyle = '#f2f2f2'; ctx.lineWidth = 10 * u; for (let k = -4; k <= 4; k++) { ctx.beginPath(); ctx.moveTo(cx - rw / 2 - 20 * u, cy + k * 40 * u); ctx.lineTo(cx - rw / 2 - 120 * u, cy + k * 40 * u); ctx.stroke(); }
    // the flow: scooters stream on curved paths that bend around Dave
    for (let i = 0; i < 70; i++) { const lane = (i % 7) - 3, dir = i % 2 ? 1 : -1, ph = ((lt * (.07 + (i % 5) * .012) * dir) + hash(i * 3.7)) % 1, p = (ph + 1) % 1;
      const horiz = i % 3 !== 0; let x, y, a; if (horiz) { x = lerp(-W * .3, W * 1.3, dir > 0 ? p : 1 - p); const dx = x - cx; y = cy + lane * 46 * u + Math.sign(lane || 1) * 120 * u * Math.exp(-(dx * dx) / (2 * (150 * u) ** 2)); a = dir > 0 ? 0 : Math.PI; } else { y = lerp(-H * .3, H * 1.3, dir > 0 ? p : 1 - p); const dy = y - cy; x = cx + lane * 46 * u + Math.sign(lane || 1) * 120 * u * Math.exp(-(dy * dy) / (2 * (150 * u) ** 2)); a = dir > 0 ? Math.PI / 2 : -Math.PI / 2; }
      scooterTop(x, y, a, .9 * u, COLS[i % 8], HEL[i % 6]); }
    // Dave from above: hat, shoulders, a spotlight ring of calm
    ctx.strokeStyle = 'rgba(255,220,90,.7)'; ctx.lineWidth = 5 * u; ctx.setLineDash([16 * u, 12 * u]); ctx.lineDashOffset = -lt * 40; ctx.beginPath(); ctx.arc(cx, cy, 90 * u, 0, TAU); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = '#3aa3a0'; ctx.beginPath(); ctx.ellipse(cx, cy, 34 * u, 20 * u, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#9b6a3a'; ctx.beginPath(); ctx.arc(cx, cy, 22 * u, 0, TAU); ctx.fill(); ctx.fillStyle = '#7a4f28'; ctx.beginPath(); ctx.arc(cx, cy, 12 * u, 0, TAU); ctx.fill();
    ctx.restore(); lb();
    const a = clamp((lt - .6) / .4); word('THEY FLOW', W * .5, H * (V ? .18 : .16), { size: V ? 96 : 84, fill: '#fff', a, stroke: 14, strokeCol: '#151320' }); word('AROUND YOU', W * .5, H * (V ? .24 : .25), { size: V ? 96 : 84, fill: '#ffd34a', a: clamp((lt - 1) / .4), stroke: 14, strokeCol: '#151320' });
  } };

  // ---------- over-the-shoulder
  MOMENTS.shot_ots = { dur: 6, capY: .82, sfx: [[0, 'heartbeat']], render(lt, D, o) {
    const u = U(), V = H > W, hz = H * .48, fo = clamp((lt - 1.5) / 1.5);
    ctx.fillStyle = lin([[0, '#14123a'], [.7, '#6a2f6a'], [1, '#e2746a']], 0, 0, 0, hz); ctx.fillRect(0, 0, W, hz); ctx.fillStyle = '#18161f'; ctx.fillRect(0, hz, W, H - hz);
    for (let i = 0; i < 14; i++) { const x = (i / 13) * W, h = (120 + hash(i) * 220) * u; ctx.fillStyle = '#231d3a'; ctx.fillRect(x - 40 * u, hz - h, 80 * u, h); for (let k = 0; k < 6; k++) if (hash(i * 9 + k) > .4) { ctx.fillStyle = hash(i + k) > .7 ? '#ff7ad1' : '#ffcf6a'; ctx.fillRect(x - 30 * u + (k % 2) * 34 * u, hz - h + 20 * u + Math.floor(k / 2) * 40 * u, 22 * u, 16 * u); } }
    ctx.save(); ctx.filter = `blur(${(1 - fo) * 6 * u}px)`;      // rack focus: the street sharpens as he decides
    for (let r = 0; r < 4; r++) for (let i = 0; i < 9; i++) { const d = .25 + r * .16, x = ((i / 8) * W * 1.4 - W * .2 + lt * (r % 2 ? -60 : 60) * u * (1 + r)) % (W * 1.4) - W * .1, y = hz + d * (H - hz) * .55; gl(x, y - 30 * u * d, 70 * u * d * 3, 'rgba(255,230,170,.9)'); ctx.fillStyle = 'rgba(255,90,90,.9)'; ctx.beginPath(); ctx.arc(x + 30 * u * d, y - 20 * u * d, 6 * u * d * 2, 0, TAU); ctx.fill(); }
    ctx.restore();
    // the shoulder: huge, dark, out of focus in the foreground (Dave's back, hat, ear)
    ctx.save(); ctx.filter = `blur(${2 + fo * 5}px)`; const bx = W * (V ? .2 : .25), by = H * 1.0;
    ctx.fillStyle = '#2b7f7c'; ctx.beginPath(); ctx.ellipse(bx, by, W * .42, H * .2, 0, Math.PI, 0); ctx.fill();
    ctx.fillStyle = '#f0c9a0'; ctx.beginPath(); ctx.ellipse(bx + 20 * u, by - H * .26, 120 * u, 140 * u, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = '#9b6a3a'; ctx.beginPath(); ctx.ellipse(bx + 20 * u, by - H * .34, 230 * u, 60 * u, -.05, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(bx + 20 * u, by - H * .37, 130 * u, 90 * u, 0, Math.PI, 0); ctx.fill();
    ctx.fillStyle = '#e8b890'; ctx.beginPath(); ctx.ellipse(bx + 140 * u, by - H * .26, 24 * u, 40 * u, .2, 0, TAU); ctx.fill(); ctx.restore();
    lb(); word('…', W * .7, H * .4, { size: 160, fill: '#fff', a: clamp((lt - .3) / .4) * (1 - clamp((lt - 2) / .4)) });
    const a = clamp((lt - 2.2) / .5); word('WALK SLOW.', W * (V ? .62 : .66), H * (V ? .3 : .3), { size: V ? 92 : 80, fill: '#fff', a, glow: 'rgba(255,200,120,.9)' }); word('WALK STEADY.', W * (V ? .62 : .66), H * (V ? .36 : .4), { size: V ? 70 : 62, fill: '#ffd34a', a: clamp((lt - 2.8) / .5), glow: 'rgba(255,200,120,.9)' });
  } };

  // ---------- one-point perspective street with the rule as a neon sign
  MOMENTS.shot_street = { dur: 6, capY: .82, sfx: [[0, 'whoosh']], render(lt, D, o) {
    const u = U(), V = H > W, vx = W * .5, vy = H * .46, push = 1 + lt * .05; ctx.save(); ctx.translate(vx, vy); ctx.scale(push, push); ctx.translate(-vx, -vy);
    ctx.fillStyle = lin([[0, '#20184a'], [1, '#e0806a']], 0, 0, 0, vy); ctx.fillRect(0, 0, W, vy + 2);
    const P = (x, y, z) => [vx + (x - vx) / z, vy + (y - vy) / z];
    for (let k = 14; k >= 1; k--) { const z0 = k * .55 + .4, z1 = (k - 1) * .55 + .4; for (const side of [-1, 1]) { const xo = vx + side * W * .5; const col = ['#e4b25a', '#d77c5a', '#5aa3a0', '#e8d6a8', '#c95a6a', '#7fa36a', '#e89a6a'][(k * 3 + (side > 0 ? 2 : 0)) % 7];
        const a = P(xo, H * 1.1, z0), b = P(xo, -H * .6 - (k % 3) * 120 * u, z0), c = P(xo, -H * .6 - (k % 3) * 120 * u, z1), d = P(xo, H * 1.1, z1); ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.lineTo(...c); ctx.lineTo(...d); ctx.fill(); ctx.fillStyle = 'rgba(20,10,30,.18)'; ctx.fill();
        for (let f = 0; f < 4; f++) { const y = H * .9 - f * 260 * u, wa = P(xo, y, lerp(z0, z1, .25)), wb = P(xo, y - 120 * u, lerp(z0, z1, .75)); ctx.fillStyle = f === 0 ? `rgba(255,${200 - k * 6},120,${.8})` : 'rgba(40,30,60,.5)'; ctx.fillRect(Math.min(wa[0], wb[0]), wb[1], Math.abs(wb[0] - wa[0]), Math.abs(wa[1] - wb[1])); } } }
    ctx.fillStyle = '#26222f'; const r1 = P(vx - W * .5, H * 1.1, .4), r2 = P(vx + W * .5, H * 1.1, .4); ctx.beginPath(); ctx.moveTo(...r1); ctx.lineTo(vx - 6, vy); ctx.lineTo(vx + 6, vy); ctx.lineTo(...r2); ctx.fill();
    for (let k = 0; k < 18; k++) { const z = ((k * .45 + 6 - lt * 1.2) % 8) + .45, s = 1 / z; const x = vx + (k % 2 ? 1 : -1) * W * .14 * s, y = vy + (H * .62) * s; gl(x, y - 80 * u * s, 120 * u * s, 'rgba(255,240,200,.8)'); }
    for (let i = 0; i < 6; i++) { ctx.strokeStyle = 'rgba(15,10,25,.85)'; ctx.lineWidth = 3 * u; ctx.beginPath(); const a = P(vx - W * .5, -H * .2 + i * 60 * u, .5), b = P(vx + W * .5, -H * .25 + i * 70 * u, .5); ctx.moveTo(...a); ctx.quadraticCurveTo(vx, a[1] + 120 * u, ...b); ctx.stroke(); }
    // the neon sign hanging off the right facade, in perspective
    const sx = W * .7, sy = H * .32, on = (Math.floor(lt * 6) % 9 !== 0) ? 1 : .35; ctx.save(); ctx.translate(sx, sy); ctx.transform(1, -.18, 0, 1, 0, 0); ctx.fillStyle = '#1a1028'; ctx.beginPath(); ctx.roundRect(-120 * u, -95 * u, 240 * u, 190 * u, 18 * u); ctx.fill(); ctx.strokeStyle = `rgba(255,90,200,${on})`; ctx.lineWidth = 6 * u; ctx.shadowColor = '#ff5ac8'; ctx.shadowBlur = 30 * u; ctx.stroke(); ctx.shadowBlur = 0;
    word('RULE', 0, -48 * u, { size: 64, fill: `rgba(255,140,220,${on})`, glow: '#ff5ac8', maxW: 260 * u }); word('#2', 0, 32 * u, { size: 110, fill: `rgba(120,240,255,${on})`, glow: '#4ae0ff', maxW: 260 * u }); ctx.restore();
    ctx.restore(); lb();
    const a = clamp((lt - 1) / .5); word('NO SUDDEN STOPS', W * .5, H * (V ? .2 : .16), { size: V ? 78 : 70, fill: '#fff', a, stroke: 12, strokeCol: '#1a1030', ls: 4 });
  } };

  // ---------- extreme close-up on the eyes
  MOMENTS.shot_eyes = { dur: 4, capY: .82, sfx: [[0, 'heartbeat']], render(lt, D, o) {
    const u = U(), V = H > W, z = 1 + lt * .04; ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2);
    ctx.fillStyle = '#f2c9a0'; ctx.fillRect(0, 0, W, H); ctx.fillStyle = 'rgba(220,120,90,.25)'; ctx.beginPath(); ctx.ellipse(W * .5, H * .7, W * .6, H * .2, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = '#9b6a3a'; ctx.fillRect(0, 0, W, H * .18); ctx.fillStyle = '#7a4f28'; for (let i = 0; i < 12; i++) { ctx.beginPath(); ctx.moveTo(i * W / 11, H * .18); ctx.lineTo(i * W / 11 + 40 * u, H * .24); ctx.lineTo(i * W / 11 + 80 * u, H * .18); ctx.fill(); }
    for (const d of [-1, 1]) { const ex = W * (.5 + d * .24), ey = H * .45, rx = W * .2, ry = H * .1 * (1 - .9 * Math.max(0, Math.sin((lt - 2.6) * 8)) * (lt > 2.6 && lt < 3 ? 1 : 0));
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(ex, ey, rx, ry, 0, 0, TAU); ctx.fill(); ctx.lineWidth = 10 * u; ctx.strokeStyle = '#2a1a12'; ctx.stroke();
      ctx.save(); ctx.beginPath(); ctx.ellipse(ex, ey, rx, ry, 0, 0, TAU); ctx.clip(); const px = ex + Math.sin(lt * 7) * 30 * u; ctx.fillStyle = '#4a2f1c'; ctx.beginPath(); ctx.arc(px, ey, ry * .95, 0, TAU); ctx.fill(); ctx.fillStyle = '#120a06'; ctx.beginPath(); ctx.arc(px, ey, ry * .5, 0, TAU); ctx.fill();
      for (let k = 0; k < 4; k++) { const hx = px - ry * .5 + k * ry * .32, hy = ey - ry * .1 + Math.sin(k + lt * 3) * 6 * u; gl(hx, hy, 40 * u, 'rgba(255,240,190,1)'); ctx.fillStyle = '#fffbe8'; ctx.beginPath(); ctx.arc(hx, hy, 7 * u, 0, TAU); ctx.fill(); } ctx.restore();
      ctx.fillStyle = '#5a3a22'; ctx.beginPath(); ctx.ellipse(ex, ey - ry - 50 * u + (lt > 1 ? -20 * u : 0), rx * .9, 16 * u, d * -.15, 0, TAU); ctx.fill(); }
    const sw = clamp((lt - .8) / 1.6); ctx.fillStyle = '#bfe6ff'; ctx.beginPath(); const sx = W * .86, sy = H * (.3 + sw * .2); ctx.moveTo(sx, sy - 40 * u); ctx.quadraticCurveTo(sx + 26 * u, sy, sx, sy + 24 * u); ctx.quadraticCurveTo(sx - 26 * u, sy, sx, sy - 40 * u); ctx.fill();
    ctx.restore(); lb(); word('BEEP BEEP BEEP', W * .5, H * (V ? .74 : .8), { size: V ? 64 : 56, fill: '#ffd34a', stroke: 12, strokeCol: '#1a1030', a: clamp((lt - .5) / .3), rot: Math.sin(lt * 30) * .02 });
  } };
})();
