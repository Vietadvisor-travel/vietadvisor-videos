/* @effect corner_banner
   @does: the camera travels across a real photo of a place; on the word a broad diagonal banner sweeps across its top corner like an estate agent's sold strip, the word big on it and the terms in a line under it
   @params: pic, word, terms, go, in, out
   @uses: any photo
   @tags: sold,sale,divest,deal,property,banner
   @born: lego a5-13: in July 2005 LEGO sold control of LEGOLAND for 375 million euros
*/
({ t, at, p, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.pic, 0, 1) || img(P.pic), k = clamp(t / Math.max(1, dur)); if (bg) cover(bg, { z: 1.15 + .06 * k, ox: (k - .5) * -.1, filter: 'brightness(.75)' });
  const t0 = at(P.go || 0), kb = clamp(p(t0, .45, 'out')); if (kb > 0) { ctx.save(); ctx.translate(W * .78, H * .26); ctx.rotate(.5); const L = W * .9 * kb, bh = 150 * u; ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 30 * u; ctx.fillStyle = '#c8281e'; ctx.fillRect(-L / 2, -bh / 2, L, bh); ctx.shadowColor = 'transparent'; ctx.fillStyle = '#f6efe2'; ctx.fillRect(-L / 2, -bh / 2 + 8 * u, L, 4 * u); ctx.fillRect(-L / 2, bh / 2 - 12 * u, L, 4 * u);
    text(P.word || 'SOLD', 0, -14 * u, { size: 90 * u, font: 'impact', col: '#fff', lw: 0, ls: 10 * u, a: clamp(kb * 2 - 1) }); ctx.restore(); }
  if (P.terms) text(P.terms, W * .42, H * .8, { size: 44 * u, font: 'cond', col: '#f6efe2', lw: 0, ls: 4 * u, a: clamp(p(t0 + .5, .4)) });
  ctx.restore();
}
