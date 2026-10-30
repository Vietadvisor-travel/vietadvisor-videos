/* @effect arrow_bypass
   @does: over real footage, three boxes stand in a chain, BRAND to STORE to YOU, joined by arrows; on the word the middle box is crossed out and drops, and a single new arrow draws straight from the first box to the last
   @params: bg, a, m, b, go, lab, in, out
   @uses: any clip
   @tags: direct,middleman,disintermediation,channel,strategy,app
   @born: nike-vs-adidas a3-02: sell through Nike own app and stores, cut out the middlemen
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, paperDesk, rng, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.bg, 0, 1) || img(P.bg), k = clamp(t / Math.max(1, dur)); if (bg) cover(bg, { z: 1.08 + .14 * k, ox: (k - .5) * -.1, filter: `brightness(${P.dim || .38})` }); else { ctx.fillStyle = '#0d0f14'; ctx.fillRect(-W, -H, 3 * W, 3 * H); }
  const t0 = at(P.go || 0), kx = clamp((t - t0) / .4), kd = clamp((t - t0 - .3) / .6), ka = clamp((t - t0 - .6) / .7), y = H * .46, xs = [W * .2, W * .5, W * .8], bw = W * .2, bh = H * .16;
  const box = (x, y, lab, col, a) => { ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = 'rgba(12,14,20,.85)'; ctx.fillRect(x - bw / 2, y - bh / 2, bw, bh); ctx.strokeStyle = col; ctx.lineWidth = 4 * u; ctx.strokeRect(x - bw / 2, y - bh / 2, bw, bh); text(lab, x, y, { size: 52 * u, font: 'cond', col, lw: 0, ls: 5 * u }); ctx.restore(); };
  const arrow = (x0, y0, x1, y1, f, col) => { const x = lerp(x0, x1, f), yy = lerp(y0, y1, f); ctx.strokeStyle = col; ctx.lineWidth = 6 * u; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x, yy); ctx.stroke(); if (f > .95) { const an = Math.atan2(y1 - y0, x1 - x0); ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x1 - 26 * u * Math.cos(an - .4), y1 - 26 * u * Math.sin(an - .4)); ctx.lineTo(x1 - 26 * u * Math.cos(an + .4), y1 - 26 * u * Math.sin(an + .4)); ctx.fill(); } };
  arrow(xs[0] + bw / 2, y, xs[1] - bw / 2, y, 1, `rgba(220,224,232,${1 - kd})`); arrow(xs[1] + bw / 2, y, xs[2] - bw / 2, y, 1, `rgba(220,224,232,${1 - kd})`);
  box(xs[0], y, P.a || 'BRAND', '#f2f4f8', 1); box(xs[2], y, P.b || 'YOU', '#f2f4f8', 1); ctx.save(); ctx.translate(0, kd * kd * H * .5); ctx.rotate(kd * .2); box(xs[1], y, P.m || 'STORE', '#ff6b5e', 1 - kd * .6); if (kx > 0) { ctx.strokeStyle = '#ff4b3e'; ctx.lineWidth = 9 * u; ctx.beginPath(); ctx.moveTo(xs[1] - bw / 2, y - bh / 2); ctx.lineTo(lerp(xs[1] - bw / 2, xs[1] + bw / 2, kx), lerp(y - bh / 2, y + bh / 2, kx)); ctx.stroke(); } ctx.restore();
  if (ka > 0) { ctx.save(); ctx.beginPath(); ctx.moveTo(xs[0], y - bh / 2); const cx = lerp(xs[0], xs[2], ka); ctx.strokeStyle = '#f2c14e'; ctx.lineWidth = 7 * u; ctx.quadraticCurveTo((xs[0] + cx) / 2, y - H * .26, cx, y - bh / 2); ctx.stroke(); ctx.restore(); }
  if (P.lab) text(P.lab, W / 2, H * .82, { size: 48 * u, font: 'cond', col: '#f2f4f8', lw: 0, ls: 5 * u, a: ka });
  ctx.restore();
}
