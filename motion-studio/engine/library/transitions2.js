/* TRANSITIONS II — motion-graphics transitions that connect scenes by meaning (Oct 2026).
   Use the content: zoom INTO the cup and come out in the café; the round bowl becomes the round sun; coffee floods
   the frame; the scene bursts into confetti that settles as the next one. All take (A, B, p, t, c, tr).
   Story: trans=<name> tc=x,y (focus in the outgoing frame, 0–1)  tc2=x,y (focus in the incoming frame)  tcol=#hex  tdur=s
   zoomthru · match · liquid · burst · blobs · spin · slices · cube · ripple · bloom · stripes2 · drop */
'use strict';
(function () {
  const TR2 = window.TR2_DUR = { zoomthru: .9, match: .8, liquid: 1.0, burst: .8, blobs: .9, spin: .7, slices: .7, cube: .8, ripple: .9, bloom: .8, stripes2: .7, drop: .8 };
  const P = (c, d) => c || [W * (d ? d[0] : .5), H * (d ? d[1] : .5)];
  const c2 = tr => tr && tr.center2 ? [tr.center2[0] * W, tr.center2[1] * H] : null;
  const draw = (img, cx, cy, k, rot = 0, a = 1) => { ctx.save(); ctx.globalAlpha *= a; ctx.translate(cx, cy); ctx.rotate(rot); ctx.scale(k, k); ctx.drawImage(img, -cx, -cy); ctx.restore(); };
  // zoom INTO a point of A (cup, window, bowl) — B is revealed inside a growing round portal at that point, then fills
  FX.zoomthru = (A, B, p, t, c, tr) => { const [x, y] = P(c), [x2, y2] = c2(tr) || [W / 2, H / 2]; const e = E.in(clamp(p / .7)); draw(A, x, y, 1 + e * 9);
    const r = Math.hypot(W, H) * E.inOut(clamp((p - .25) / .75)); if (r > 1) { ctx.save(); ctx.beginPath(); const cx = lerp(x, W / 2, E.inOut(p)), cy = lerp(y, H / 2, E.inOut(p)); ctx.arc(cx, cy, r, 0, TAU); ctx.clip(); draw(B, x2, y2, lerp(1.6, 1, E.out(p))); ctx.restore();
      ctx.save(); ctx.globalAlpha = .5 * (1 - p); ctx.lineWidth = 14 * U(); ctx.strokeStyle = '#fff'; ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.stroke(); ctx.restore(); } };
  // shared-element match: A's focus scales/moves onto B's focus while they cross-dissolve (round bowl → round sun)
  FX.match = (A, B, p, t, c, tr) => { const [x, y] = P(c), [x2, y2] = c2(tr) || [W / 2, H / 2]; const e = E.inOut(p); const kA = lerp(1, 1.8, e), kB = lerp(.55, 1, e);
    ctx.save(); ctx.translate(lerp(0, x2 - x, e), lerp(0, y2 - y, e)); draw(A, x, y, kA, 0, 1 - E.in(clamp((p - .3) / .5))); ctx.restore(); ctx.save(); ctx.translate(lerp(x - x2, 0, e), lerp(y - y2, 0, e)); draw(B, x2, y2, kB, 0, E.out(clamp((p - .25) / .5))); ctx.restore(); };
  // liquid flood: a wavy fill (coffee, broth, beer) rises and drains, revealing B
  FX.liquid = (A, B, p, t, c, tr) => { const col = (tr && tr.col) || '#6a3a1e'; const up = p < .55, q = up ? E.inOut(p / .55) : E.inOut((p - .55) / .45); ctx.drawImage(up ? A : B, 0, 0);
    const lvl = up ? lerp(H * 1.1, -H * .1, q) : lerp(-H * .1, -H * 1.3, q); const wave = (yy, amp, ph) => { ctx.beginPath(); ctx.moveTo(0, H * 2); ctx.lineTo(0, yy); for (let x = 0; x <= W; x += W / 24) ctx.lineTo(x, yy + Math.sin(x / W * 7 + t * 6 + ph) * amp); ctx.lineTo(W, H * 2); ctx.closePath(); };
    const u = U(); ctx.save(); wave(lvl + 40 * u, 26 * u, 2); ctx.fillStyle = shade(col, .18); ctx.fill(); wave(lvl, 34 * u, 0); ctx.fillStyle = col; ctx.fill(); if (!up) { ctx.save(); wave(lvl, 34 * u, 0); ctx.clip(); ctx.restore(); } ctx.restore();
    if (!up) { ctx.save(); wave(lvl, 34 * u, 0); ctx.clip(); ctx.restore(); } const r = rng(3); ctx.save(); ctx.globalAlpha = .5; for (let i = 0; i < 18; i++) circ(r() * W, lvl + r() * H * .6, (4 + r() * 12) * u, '#fff', 0); ctx.restore(); };
  // burst: A shatters into soft tiles flying outward from the focus, B behind them settles in
  FX.burst = (A, B, p, t, c) => { const [x, y] = P(c); draw(B, W / 2, H / 2, lerp(1.25, 1, E.out(p))); const n = 9, m = 16, tw = W / n, th = H / m, e = E.in(p); const r = rng(7);
    for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) { const cx = (i + .5) * tw, cy = (j + .5) * th, dx = cx - x, dy = cy - y, d = Math.hypot(dx, dy) + 1, sp = (1.2 + r()) * Math.max(W, H) * e, rot = (r() - .5) * 6 * e; const k = 1 - e * .6; if (k <= 0) continue;
      ctx.save(); ctx.translate(cx + dx / d * sp, cy + dy / d * sp); ctx.rotate(rot); ctx.scale(k, k); ctx.globalAlpha = 1 - E.in(clamp(p * 1.2)); ctx.drawImage(A, i * tw, j * th, tw, th, -tw / 2, -th / 2, tw + 1, th + 1); ctx.restore(); } };
  // blobs: nutshell colour bubbles sweep across and pop away (pure motion-graphics wipe)
  FX.blobs = (A, B, p, t, c, tr) => { ctx.drawImage(p < .5 ? A : B, 0, 0); const cols = ['#ffb84d', '#ff7a59', '#4fc3a1', '#5aa9e6', '#9b7bd6']; const R = Math.hypot(W, H);
    cols.forEach((cl, k) => { const s = clamp((p - k * .06) / .5), e = clamp((p - .45 - k * .05) / .45); const r = R * .62 * E.out(s) * (1 - E.in(e)); if (r < 1) return; const a = k * 1.3; circ(W / 2 + Math.cos(a) * W * .25 * (1 - s), H / 2 + Math.sin(a) * H * .2 * (1 - s), r, cl, 0); }); };
  // spin: A spins away and shrinks, B spins in from big (energy, "meanwhile")
  FX.spin = (A, B, p) => { const e = E.inOut(p); if (p < .5) draw(A, W / 2, H / 2, lerp(1, .2, E.in(p * 2)), lerp(0, 1.4, E.in(p * 2))); else draw(B, W / 2, H / 2, lerp(2.4, 1, E.out(p * 2 - 1)), lerp(-1.2, 0, E.out(p * 2 - 1))); ctx.save(); ctx.globalAlpha = Math.sin(p * Math.PI) * .3; ctx.fillStyle = '#fff6e0'; ctx.fillRect(0, 0, W, H); ctx.restore(); };
  // slices: diagonal bands slide out alternately
  FX.slices = (A, B, p) => { ctx.drawImage(B, 0, 0); const n = 7, e = E.inOut(p); for (let k = 0; k < n; k++) { const off = (k % 2 ? 1 : -1) * W * 1.3 * E.in(clamp(e * 1.4 - k * .05)); ctx.save(); ctx.beginPath(); const y0 = H * k / n - H * .1, y1 = H * (k + 1) / n - H * .1; ctx.moveTo(-W, y0 + W * .2); ctx.lineTo(W * 2, y0 - W * .2); ctx.lineTo(W * 2, y1 - W * .2 + 1); ctx.lineTo(-W, y1 + W * .2 + 1); ctx.closePath(); ctx.clip(); ctx.drawImage(A, off, 0); ctx.restore(); } };
  // cube: the frame rotates like a box face (A left, B from right)
  FX.cube = (A, B, p) => { const e = E.inOut(p); const wa = W * (1 - e), wb = W * e; ctx.fillStyle = '#0b0c2a'; ctx.fillRect(0, 0, W, H);
    ctx.save(); ctx.globalAlpha = 1 - e * .5; ctx.drawImage(A, 0, 0, W, H, 0, H * .04 * e, wa, H * (1 - .08 * e)); ctx.restore(); ctx.save(); ctx.globalAlpha = .5 + e * .5; ctx.drawImage(B, 0, 0, W, H, wa, H * .04 * (1 - e), wb, H * (1 - .08 * (1 - e))); ctx.restore(); };
  // ripple: a drop lands at the focus, rings spread, B inside the rings
  FX.ripple = (A, B, p, t, c) => { const [x, y] = P(c); ctx.drawImage(A, 0, 0); const R = Math.hypot(W, H) * E.inOut(p); ctx.save(); ctx.beginPath(); ctx.arc(x, y, R, 0, TAU); ctx.clip(); ctx.drawImage(B, 0, 0); ctx.restore();
    for (let k = 0; k < 3; k++) { const rr2 = R - k * 60 * U(); if (rr2 > 0) { ctx.save(); ctx.globalAlpha = (1 - p) * (.6 - k * .15); ctx.lineWidth = (10 - k * 3) * U(); ctx.strokeStyle = '#fff'; ctx.beginPath(); ctx.arc(x, y, rr2, 0, TAU); ctx.stroke(); ctx.restore(); } } };
  // bloom: the focus flares into warm light (lantern, sun, neon) and the light becomes B
  FX.bloom = (A, B, p, t, c, tr) => { const [x, y] = P(c); const col = (tr && tr.col) || '#ffd98a'; ctx.drawImage(p < .5 ? A : B, 0, 0); const a = Math.sin(p * Math.PI) * .8; const g = ctx.createRadialGradient(x, y, 0, x, y, Math.hypot(W, H) * (.2 + a * .9)); g.addColorStop(0, rgba(col, a)); g.addColorStop(.6, rgba(col, a * .8)); g.addColorStop(1, rgba(col, 0)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); };
  // stripes2: coloured bars wipe across in sequence (brand colours)
  FX.stripes2 = (A, B, p) => { ctx.drawImage(p < .5 ? A : B, 0, 0); const cols = ['#ff7a59', '#ffb84d', '#4fc3a1', '#5aa9e6']; cols.forEach((cl, k) => { const s = E.inOut(clamp((p - k * .07) / .55)), e = E.inOut(clamp((p - .4 - k * .07) / .55)); const x0 = lerp(-W, 0, s) + lerp(0, W, e); rr(x0, 0, W, H, 0, cl, 0); }); };
  // drop: B falls in from above with a bounce, A sinks (gravity gag)
  FX.drop = (A, B, p) => { ctx.drawImage(A, 0, E.in(clamp(p / .6)) * H * .3); const b = E.bounce(clamp((p - .1) / .9)); ctx.save(); ctx.translate(0, (1 - b) * -H); ctx.drawImage(B, 0, 0); ctx.restore(); };
})();
