/* @effect swing_bar
   @does: over real footage one bar hangs below a zero line in red for the loss; on the word it swings up through zero and stands above it in gold for the profit, its number changing with it
   @params: bg, a, b, go, alab, blab, unit, in, out
   @uses: any clip or photo
   @tags: profit,loss,swing,turnaround,bar,result
   @born: lego a5-15: in 2005 LEGO made a profit again, 505 million kroner net
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.bg, 0, 1) || img(P.bg); ctx.fillStyle = '#0d0b09'; ctx.fillRect(-W, -H, 3 * W, 3 * H); if (bg) cover(bg, { z: 1.05 + .12 * clamp(t / Math.max(1, dur)), filter: 'brightness(.38)' });
  const A = +(P.a || -1931), B = +(P.b || 505), mx = Math.max(Math.abs(A), Math.abs(B)), zy = H * .42, sc = H * .34 / mx, k0 = clamp(p(.1, .6)), k = clamp(spring(P.go || 0, { stiff: 90, damp: 12 }), -0.1, 1.1);
  const v = t < at(P.go || 0) ? A * k0 : lerp(A, B, k), h = -v * sc, x = W * .5, bw = W * .16;
  ctx.strokeStyle = 'rgba(243,236,220,.6)'; ctx.lineWidth = 3 * u; ctx.beginPath(); ctx.moveTo(W * .2, zy); ctx.lineTo(W * .8, zy); ctx.stroke(); text('0', W * .18, zy, { size: 34 * u, font: 'cond', col: '#d8ccb6', lw: 0 });
  ctx.fillStyle = v < 0 ? '#c8322a' : '#e3b23c'; ctx.fillRect(x - bw / 2, Math.min(zy, zy + h), bw, Math.abs(h));
  const after = t >= at(P.go || 0) + .2, val = after ? B : A; text((val > 0 ? '+' : '−') + Math.abs(val).toLocaleString('en-US') + (P.unit || 'M'), x + bw * .9, zy + h + (v < 0 ? 40 * u : -40 * u), { size: 76 * u, font: 'impact', col: val > 0 ? '#f2c14e' : '#e2564b', lw: 0, align: 'left', a: after ? clamp(p(at(P.go || 0) + .2, .3)) : k0 });
  text(after ? (P.blab || '2005') : (P.alab || '2004'), x - bw * .9, zy + h + (v < 0 ? 40 * u : -40 * u), { size: 56 * u, font: 'cond', col: '#f3ecdc', lw: 0, align: 'right', ls: 4 * u });
  ctx.restore();
}
