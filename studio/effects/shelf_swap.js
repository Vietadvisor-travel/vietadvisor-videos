/* @effect shelf_swap
   @does: a wall of store shelves; one row of shoes in one colour sits on the shelves; on the first word that row slides off the shelves and out of frame, leaving them empty; on the second word a row of another shoe slides in from the other side and fills them
   @params: bg, a, b, go, go2, alab, blab, in, out
   @uses: any shelf plate + two cut-outs
   @tags: shelf,retail,distribution,swap,presence,store
   @born: nike-vs-adidas a0-07: Nike took its own shoes off the shelf, and Adidas sold the shoes it already had
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, paperDesk, rng, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.bg, 0, 1) || img(P.bg), k = clamp(t / Math.max(1, dur)); if (bg) cover(bg, { z: 1.08 + .14 * k, ox: (k - .5) * -.1, filter: `brightness(${P.dim || .38})` }); else { ctx.fillStyle = '#0d0f14'; ctx.fillRect(-W, -H, 3 * W, 3 * H); }
  const A = img(P.a), B = img(P.b), t1 = at(P.go || 0), t2 = at(P.go2 || P.go || 0), ka = clamp(p(t1, .9, 'in')), kb = clamp(p(t2, .9, 'out')), rows = [H * .36, H * .6], sw = W * .14;
  ctx.fillStyle = 'rgba(40,34,30,.95)'; ctx.fillRect(W * .04, H * .2, W * .92, H * .56); ctx.fillStyle = 'rgba(240,236,228,.9)'; rows.forEach(y => ctx.fillRect(W * .06, y + 34 * u, W * .88, 10 * u));
  rows.forEach((y, r) => { for (let i = 0; i < 6; i++) { const x = W * .12 + i * W * .145; if (A && ka < 1) { const xx = x - ka * W * 1.2 - i * ka * 40 * u; ctx.drawImage(A, xx - sw / 2, y + 34 * u - sw * A.height / A.width, sw, sw * A.height / A.width); }
    if (B && kb > 0) { const xx = x + (1 - kb) * W * 1.2 + i * (1 - kb) * 40 * u; ctx.drawImage(B, xx - sw / 2, y + 34 * u - sw * B.height / B.width, sw, sw * B.height / B.width); } } });
  if (P.alab && ka > 0 && kb <= 0) text(P.alab, W / 2, H * .14, { size: 52 * u, font: 'cond', col: '#ff6b5e', lw: 0, ls: 6 * u, a: clamp(ka * 3) }); if (P.blab && kb > 0) text(P.blab, W / 2, H * .14, { size: 52 * u, font: 'cond', col: '#7fb2ff', lw: 0, ls: 6 * u, a: kb });
  ctx.restore();
}
