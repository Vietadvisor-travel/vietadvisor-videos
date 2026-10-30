/* @effect corner_banner
   @does: the camera travels across a real photo of a place; on the word a broad diagonal banner sweeps across its top corner like an estate agent's sold strip, the word big on it and the terms in a line under it
   @params: pic, word, terms, go, in, out
   @uses: any photo
   @tags: sold,sale,divest,deal,property,banner
   @born: lego a5-13: in July 2005 LEGO sold control of LEGOLAND for 375 million euros
*/
({ t, at, p, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.pic, 0, 1) || img(P.pic), k = clamp(t / Math.max(1, dur)); if (bg && P.card) { ctx.fillStyle = '#121214'; ctx.fillRect(-W, -H, 3 * W, 3 * H); const s = 1 + .2 * k, ch = H * .62 * s, cw = ch * bg.width / bg.height; ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.7)'; ctx.shadowBlur = 40 * u; ctx.fillStyle = '#f2eee6'; ctx.fillRect(W / 2 - cw / 2 - 16 * u, H * .44 - ch / 2 - 16 * u, cw + 32 * u, ch + 32 * u); ctx.restore(); ctx.drawImage(bg, W / 2 - cw / 2, H * .44 - ch / 2, cw, ch); } else if (bg) cover(bg, { z: 1.15 + .06 * k, ox: (k - .5) * -.1, filter: 'brightness(.75)' });
  const t0 = at(P.go || 0), kb = clamp(p(t0, .45, 'out')); if (kb > 0) { ctx.save(); ctx.translate(W * +(P.bx || .7), H * +(P.by || .3)); ctx.rotate(.42); const L = W * +(P.bl || .5) * kb, bh = 130 * u; ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 30 * u; ctx.fillStyle = '#c8281e'; ctx.fillRect(-L / 2, -bh / 2, L, bh); ctx.shadowColor = 'transparent'; ctx.fillStyle = '#f6efe2'; ctx.fillRect(-L / 2, -bh / 2 + 8 * u, L, 4 * u); ctx.fillRect(-L / 2, bh / 2 - 12 * u, L, 4 * u);
    text(P.word || 'SOLD', 0, -14 * u, { size: 76 * u, font: 'impact', col: '#fff', lw: 0, ls: 6 * u, a: clamp(kb * 2 - 1) }); ctx.restore(); }
  if (P.terms) text(P.terms, W * .5, H * .8, { size: 44 * u, font: 'cond', col: '#f6efe2', lw: 0, ls: 4 * u, a: clamp(p(t0 + .5, .4)) });
  ctx.restore();
}
