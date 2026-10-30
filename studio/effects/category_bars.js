/* @effect category_bars
   @does: a dim real store photo behind; a short row of category bars stands on a baseline; on the word they grow one by one to their growth rates, one staying flat on the line, each locking with its figure
   @params: bg, items, go, note, lab, in, out
   @uses: any photo
   @tags: categories,growth,mix,breakdown,flat,comparison
   @born: nike-vs-adidas a5-11: Adidas footwear flat; apparel up 19%; Performance up 14%
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, paperDesk, rng, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.bg, 0, 1) || img(P.bg), k = clamp(t / Math.max(1, dur)); if (bg) cover(bg, { z: 1.08 + .14 * k, ox: (k - .5) * -.1, filter: `brightness(${P.dim || .38})` }); else { ctx.fillStyle = '#0d0f14'; ctx.fillRect(-W, -H, 3 * W, 3 * H); }
  const I = (P.items || '').split('~').filter(Boolean).map(s => s.split('^')), t0 = at(P.go || 0), by = H * .72, mx = Math.max(...I.map(q => +q[1]), 1), bw = W * .17;
  ctx.strokeStyle = '#f2f4f8'; ctx.lineWidth = 4 * u; ctx.beginPath(); ctx.moveTo(W * .1, by); ctx.lineTo(W * .9, by); ctx.stroke();
  I.forEach(([lab, v, col], i) => { const x = W * (.25 + i * .25), kk = clamp(p(t0 + i * .35, .6, 'out')), h = H * .42 * (+v) / mx * kk; ctx.fillStyle = col || '#f2c14e'; ctx.fillRect(x - bw / 2, by - Math.max(h, 6 * u), bw, Math.max(h, 6 * u)); text(lab, x, by + 50 * u, { size: 40 * u, font: 'cond', col: '#f2f4f8', lw: 0, ls: 3 * u }); if (kk > .3) text((+v > 0 ? '+' : '') + v + '%', x, by - h - 50 * u, { size: 72 * u, font: 'impact', col: col || '#f2c14e', lw: 0, a: clamp((kk - .3) * 2) }); });
  if (P.lab) text(P.lab, W / 2, H * .12, { size: 46 * u, font: 'cond', col: '#f2f4f8', lw: 0, ls: 5 * u }); if (P.note) text(P.note, W / 2, H * .85, { size: 34 * u, font: 'cond', col: '#c9ced8', lw: 0, a: clamp(p(t0 + 1, .4)) });
  ctx.restore();
}
