/* @effect dashed_forward
   @does: dim real footage behind; a solid line traces past years across the frame, then on the word it continues as a dashed line bending down into a shaded future zone labelled as guidance
   @params: bg, pts, go, labs, glab, in, out
   @uses: any clip
   @tags: guidance,forecast,outlook,future,decline,projection
   @born: nike-vs-adidas a5-06: Nike told investors to expect revenue to fall again this fiscal year
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, paperDesk, rng, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.bg, 0, 1) || img(P.bg), k = clamp(t / Math.max(1, dur)); if (bg) cover(bg, { z: 1.08 + .14 * k, ox: (k - .5) * -.1, filter: `brightness(${P.dim || .38})` }); else { ctx.fillStyle = '#0d0f14'; ctx.fillRect(-W, -H, 3 * W, 3 * H); }
  const pts = (P.pts || '.7,.5,.5,.32').split(',').map(Number), n = pts.length, labs = (P.labs || '').split('~'), x0 = W * .14, x1 = W * .86, yt = H * .2, yb = H * .74, X = i => lerp(x0, x1, i / (n - 1)), Y = v => lerp(yb, yt, v), t0 = at(P.go || 0), ks = clamp(t / 1.2), kd = clamp((t - t0) / .8);
  ctx.fillStyle = 'rgba(255,75,62,.12)'; ctx.fillRect(X(n - 2), yt - 20 * u, X(n - 1) - X(n - 2) + 40 * u, yb - yt + 40 * u);
  ctx.strokeStyle = '#f2f4f8'; ctx.lineWidth = 7 * u; ctx.beginPath(); for (let i = 0; i < n - 1; i++) { const f = clamp(ks * (n - 1) - i); if (i === 0) ctx.moveTo(X(0), Y(pts[0])); if (f > 0) ctx.lineTo(lerp(X(i), X(i + 1), f), lerp(Y(pts[i]), Y(pts[i + 1]), f)); } ctx.stroke();
  ctx.fillStyle = '#f2f4f8'; for (let i = 0; i < n - 1; i++) { ctx.beginPath(); ctx.arc(X(i), Y(pts[i]), 10 * u, 0, 6.29); ctx.fill(); if (labs[i]) text(labs[i], X(i), yb + 50 * u, { size: 36 * u, font: 'cond', col: '#c9ced8', lw: 0 }); }
  if (kd > 0) { ctx.setLineDash([18 * u, 12 * u]); ctx.strokeStyle = '#ff4b3e'; ctx.beginPath(); ctx.moveTo(X(n - 2), Y(pts[n - 2])); ctx.lineTo(lerp(X(n - 2), X(n - 1), kd), lerp(Y(pts[n - 2]), Y(pts[n - 1]), kd)); ctx.stroke(); ctx.setLineDash([]); if (labs[n - 1]) text(labs[n - 1], X(n - 1), yb + 50 * u, { size: 36 * u, font: 'cond', col: '#ff8a7a', lw: 0, a: kd }); }
  if (P.glab) text(P.glab, W * .6, yt - 50 * u, { size: 40 * u, font: 'cond', col: '#ff8a7a', lw: 0, ls: 3 * u, a: kd });
  ctx.restore();
}
