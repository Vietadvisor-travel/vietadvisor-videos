/* @effect colour_halve
   @does: over real footage a wall of colour chips, one per shade in the range, fills the frame; on the word every other chip drops out of the wall and falls, leaving half the shades
   @params: clip, n, go, lab, in, out
   @uses: any clip
   @tags: colours,range,simplify,cut,half,palette
   @born: lego a5-10: the colours were cut roughly in half
*/
({ t, at, p, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, rng, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.clip, 0, 1) || img(P.clip); if (bg) cover(bg, { z: 1.05 + .1 * clamp(t / Math.max(1, dur)), filter: 'brightness(.4)' });
  const n = +(P.n || 100), cols = 20, rows = Math.ceil(n / cols), cw = W * .82 / cols, ch = H * .5 / rows, x0 = W * .09, y0 = H * .26, t0 = at(P.go || 0), r = rng(3);
  for (let i = 0; i < n; i++) { const c = i % cols, rw = Math.floor(i / cols), hue = (c / cols) * 330 + rw * 7, lit = 35 + rw * 9, goes = (i + rw) % 2 === 1, kk = clamp(p(.05 + i * .006, .3));
    let y = y0 + rw * ch, a = kk; if (goes && t > t0) { const tau = Math.max(0, t - t0 - r() * .5); y += tau * tau * 2600 * u; a *= clamp(1 - tau * .8); } else r();
    if (a <= 0 || y > H) continue; ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = `hsl(${hue % 360},70%,${lit}%)`; ctx.fillRect(x0 + c * cw + 3 * u, y + 3 * u, cw - 6 * u, ch - 6 * u); ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.fillRect(x0 + c * cw + 3 * u, y + 3 * u, cw - 6 * u, (ch - 6 * u) * .25); ctx.restore(); }
  if (P.lab) text(P.lab, W / 2, H * .14, { size: 56 * u, font: 'cond', col: '#f6efe2', lw: 0, ls: 6 * u, a: clamp(p(t0 + .4, .4)) });
  ctx.restore();
}
