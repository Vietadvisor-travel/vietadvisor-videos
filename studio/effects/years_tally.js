/* @effect years_tally
   @does: the camera travels across a real photo of a place with nobody in it; on the word chalk tally marks scratch themselves across the picture in bundles of five, one per year, very fast, until the total, and a short line sets under them
   @params: pic, n, go, span, lab, in, out
   @uses: any photo
   @tags: years,tally,count,absence,time,duration
   @born: lego a2-05: for forty-six years, LEGO's worlds had had no people in them
*/
({ t, at, p, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, rng, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.pic, 0, 1) || img(P.pic), k = clamp(t / Math.max(1, dur)); if (bg) cover(bg, { z: 1.2, ox: (k - .5) * -.16, filter: 'brightness(.6)' });
  const n = +(P.n || 46), t0 = at(P.go || 0), span = +(P.span || 1.8), shown = Math.floor(n * clamp((t - t0) / span)), r = rng(8), gw = W * .07, x0 = W * .12, y0 = H * .32;
  ctx.strokeStyle = 'rgba(250,246,236,.92)'; ctx.lineWidth = 6 * u; ctx.lineCap = 'round';
  for (let i = 0; i < shown; i++) { const g = Math.floor(i / 5), j = i % 5, row = Math.floor(g / 5), col = g % 5, gx = x0 + col * gw * 1.55, gy = y0 + row * H * .2; ctx.beginPath();
    if (j < 4) { const x = gx + j * gw * .24; ctx.moveTo(x + (r() - .5) * 4 * u, gy); ctx.lineTo(x + (r() - .5) * 4 * u, gy + H * .12); } else { ctx.moveTo(gx - gw * .1, gy + H * .1); ctx.lineTo(gx + gw * .85, gy + H * .02); } ctx.stroke(); }
  if (P.lab) text(P.lab, W * .5, H * .86 - 30 * u, { size: 64 * u, font: 'impact', col: '#f6efe2', lw: 0, a: clamp(p(t0 + span, .4)) });
  if (P.lab2) text(P.lab2, W * .5, H * .14, { size: 54 * u, font: 'impact', col: '#f2c14e', lw: 0, ls: 3 * u, a: clamp(p(at(P.at2 || 0), .4)) });
  ctx.restore();
}
