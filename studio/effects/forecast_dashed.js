/* @effect forecast_dashed
   @does: dim real footage of a warehouse; a zero line runs across the frame; on the word a dashed red outline of a bar drops below the line to a forecast figure, never filling in, labelled as a forecast with its condition
   @params: bg, val, go, lab, cond, in, out
   @uses: any clip
   @tags: forecast,risk,loss,warning,dashed,hypothetical
   @born: nike-vs-adidas a4-05: a forecast operating loss of EUR 700M in 2023 if the Yeezy stock went unsold
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, paperDesk, rng, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.bg, 0, 1) || img(P.bg), k = clamp(t / Math.max(1, dur)); if (bg) cover(bg, { z: 1.08 + .14 * k, ox: (k - .5) * -.1, filter: `brightness(${P.dim || .38})` }); else { ctx.fillStyle = '#0d0f14'; ctx.fillRect(-W, -H, 3 * W, 3 * H); }
  const t0 = at(P.go || 0), kv = clamp(p(t0, .8, 'out')), zy = H * .3, bw = W * .18, bx = W * .5, bh = H * .42 * kv;
  ctx.strokeStyle = '#f2f4f8'; ctx.lineWidth = 4 * u; ctx.beginPath(); ctx.moveTo(W * .15, zy); ctx.lineTo(W * .85, zy); ctx.stroke(); text('0', W * .13, zy, { size: 36 * u, font: 'cond', col: '#f2f4f8', lw: 0 });
  ctx.setLineDash([18 * u, 12 * u]); ctx.strokeStyle = '#ff4b3e'; ctx.lineWidth = 6 * u; ctx.strokeRect(bx - bw / 2, zy, bw, bh); ctx.setLineDash([]); ctx.fillStyle = 'rgba(255,75,62,.12)'; ctx.fillRect(bx - bw / 2, zy, bw, bh);
  const a = clamp(p(t0 + .3, .4)); text(P.val || '', bx, zy + bh + 60 * u, { size: 88 * u, font: 'impact', col: '#ff6b5e', lw: 0, a }); if (P.lab) text(P.lab, W * .78, zy + H * .16, { size: 44 * u, font: 'cond', col: '#f2f4f8', lw: 0, ls: 5 * u, a }); if (P.cond) text(P.cond, W * .78, zy + H * .23, { size: 36 * u, font: 'cond', col: '#c9ced8', lw: 0, a });
  ctx.restore();
}
