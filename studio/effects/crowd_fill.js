/* @effect crowd_fill
   @does: the camera looks down on a real park from above; on the word tiny walkers pour onto its paths in waves while a visitor count runs up past a dashed mark for what was expected and locks on its total
   @params: pic, n, go, to, est, lab, sub, in, out
   @uses: any aerial or high photo of a place
   @tags: crowd,visitors,count,park,demand,estimate
   @born: lego a2-03: the first season drew 625,000 people, about twice the estimate
*/
({ t, at, p, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, rng, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.pic, 0, 1) || img(P.pic), k = clamp(t / Math.max(1, dur)); if (bg) cover(bg, { z: 1.12 + .14 * k, ox: (k - .5) * -.08, filter: 'brightness(.75)' });
  const t0 = at(P.go || 0), n = +(P.n || 900), r = rng(31), kc = clamp((t - t0) / 2.2), shown = Math.floor(n * kc * (2 - kc));
  for (let i = 0; i < shown; i++) { const x0 = r() * W, y0 = H * .3 + r() * H * .65, ang = r() * 6.28, sp = (12 + r() * 20) * u, ph = r() * 6; const x = x0 + Math.cos(ang) * sp * (t - t0) * 2, y = y0 + Math.sin(ang) * sp * (t - t0); ctx.fillStyle = i % 3 ? 'rgba(255,236,190,.92)' : 'rgba(255,120,90,.9)'; ctx.fillRect(x, y + Math.sin(t * 8 + ph) * u, 4 * u, 6 * u); }
  const to = +(P.to || 625000), est = +(P.est || 312500), v = Math.round(lerp(0, to, kc * (2 - kc)));
  if (t > t0) { ctx.save(); ctx.fillStyle = 'rgba(8,7,6,.62)'; ctx.fillRect(W * .5 - 380 * u, H * .06, 760 * u, 260 * u); ctx.restore(); text(v.toLocaleString('en-US'), W * .5, H * .06 + 110 * u, { size: 140 * u, font: 'impact', col: '#f2c14e', lw: 0 }); if (P.lab) text(P.lab, W * .5, H * .06 + 200 * u, { size: 44 * u, font: 'cond', col: '#f6efe2', lw: 0, ls: 5 * u });
    const bx0 = W * .5 - 330 * u, bw = 660 * u, by = H * .06 + 236 * u; ctx.fillStyle = 'rgba(255,255,255,.2)'; ctx.fillRect(bx0, by, bw, 10 * u); ctx.fillStyle = '#f2c14e'; ctx.fillRect(bx0, by, bw * v / to, 10 * u); ctx.setLineDash([6 * u, 5 * u]); ctx.strokeStyle = '#fff'; ctx.lineWidth = 3 * u; ctx.beginPath(); ctx.moveTo(bx0 + bw * est / to, by - 14 * u); ctx.lineTo(bx0 + bw * est / to, by + 24 * u); ctx.stroke(); ctx.setLineDash([]);
    if (P.sub) text(P.sub, bx0 + bw * est / to, by + 50 * u, { size: 30 * u, font: 'cond', col: '#efe4cf', lw: 0 }); }
  ctx.restore();
}
