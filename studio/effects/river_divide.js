/* @effect river_divide
   @does: the camera drifts across a real view of a town by water; on the word a line draws itself along the river, the frame on each side tints a different colour and a name sets on each side
   @params: pic, pts, go, alab, blab, lab, in, out
   @uses: any landscape photo
   @tags: divide,split,town,rivalry,border,feud
   @born: nike-vs-adidas a1-06: the town splits with them, one factory on each side of the river
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, paperDesk, rng, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = img(P.pic), k = clamp(t / Math.max(1, dur)); if (bg) cover(bg, { z: 1.12 + .1 * k, ox: (k - .5) * -.1, filter: 'brightness(.75) sepia(.3)' });
  const pts = (P.pts || '0,.62~.3,.58~.6,.64~1,.6').split('~').map(s => s.split(',').map(Number)), t0 = at(P.go || 0), kd = clamp((t - t0) / 1.2), ka = clamp(p(t0 + 1, .6));
  ctx.save(); ctx.globalAlpha = .28 * ka; ctx.fillStyle = '#3a6fd8'; ctx.beginPath(); ctx.moveTo(0, 0); pts.forEach(q => ctx.lineTo(q[0] * W, q[1] * H)); ctx.lineTo(W, 0); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#d83a3a'; ctx.beginPath(); ctx.moveTo(0, H); pts.forEach(q => ctx.lineTo(q[0] * W, q[1] * H)); ctx.lineTo(W, H); ctx.closePath(); ctx.fill(); ctx.restore();
  ctx.strokeStyle = '#f2f4f8'; ctx.lineWidth = 7 * u; ctx.setLineDash([22 * u, 12 * u]); ctx.beginPath(); pts.forEach((q, i) => { const x = Math.min(q[0], kd) * W; i ? ctx.lineTo(x, q[1] * H) : ctx.moveTo(x, q[1] * H); }); ctx.stroke(); ctx.setLineDash([]);
  if (P.alab) text(P.alab, W * .5, H * .26, { size: 70 * u, font: 'impact', col: '#cfe0ff', lw: 0, ls: 6 * u, a: ka }); if (P.blab) text(P.blab, W * .5, H * .78, { size: 70 * u, font: 'impact', col: '#ffd2cc', lw: 0, ls: 6 * u, a: ka });
  if (P.lab) text(P.lab, W * .5, H * .12, { size: 40 * u, font: 'cond', col: '#f6efe2', lw: 0, ls: 4 * u, a: ka });
  ctx.restore();
}
