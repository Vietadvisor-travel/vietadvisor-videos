/* @effect views_flip
   @does: carries a two-bar race across the cut at its final values; on the word the winner's bar drains, swings down through a zero line and becomes a different, falling number with a new label: what the lead turned into
   @params: bg, a, av, b, bv, max, go, alab2, aval2, sub, in, out
   @uses: the same plate as the race before it
   @tags: carrier,bars,flip,attention,sales,reversal,views
   @born: nike-vs-adidas a5: Nike won the attention. Then it reported the quarter
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, rng, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.bg, 0, 1) || img(P.bg), k = clamp(t / Math.max(1, dur)); if (bg) cover(bg, { z: 1.22 + .1 * k, ox: (k - .5) * -.1, filter: `brightness(${lerp(.38, .24, k)})` }); else { ctx.fillStyle = '#0d0f14'; ctx.fillRect(-W, -H, 3 * W, 3 * H); }
  const t0 = at(P.go || 0), kf = clamp(p(t0, 1.0, 'inOut')), mx = +(P.max || 70), x0 = W * .12, L = W * .7;
  // B stays as it was; A drains then turns into the new number
  const yb = H * .58; ctx.fillStyle = 'rgba(255,255,255,.1)'; ctx.fillRect(x0, yb, L, H * .1); ctx.fillStyle = '#7fb2ff'; ctx.globalAlpha = lerp(1, .45, kf); ctx.fillRect(x0, yb, L * +P.bv / mx, H * .1); ctx.globalAlpha = 1;
  text(P.b || '', x0, yb - 36 * u, { size: 42 * u, font: 'cond', col: '#f2f4f8', lw: 0, ls: 3 * u, align: 'left', a: lerp(1, .45, kf) });
  const ya = H * .36, wA = L * +P.av / mx * clamp(1 - kf * 2); ctx.fillStyle = 'rgba(255,255,255,.1)'; ctx.fillRect(x0, ya, L, H * .1);
  if (kf < .5) { ctx.fillStyle = '#ff6b5e'; ctx.fillRect(x0, ya, wA, H * .1); text(P.a || '', x0, ya - 36 * u, { size: 42 * u, font: 'cond', col: '#f2f4f8', lw: 0, ls: 3 * u, align: 'left' }); text(P.av + 'M', x0 + Math.max(wA, 60 * u) + 90 * u, ya + H * .05, { size: 64 * u, font: 'impact', col: '#ff6b5e', lw: 0 }); }
  else { const kd = clamp(kf * 2 - 1), zx = x0 + L * .5, w = L * .3 * kd; ctx.strokeStyle = '#f2f4f8'; ctx.lineWidth = 4 * u; ctx.beginPath(); ctx.moveTo(zx, ya - 30 * u); ctx.lineTo(zx, ya + H * .13); ctx.stroke(); text('0', zx, ya - 56 * u, { size: 40 * u, font: 'cond', col: '#f2f4f8', lw: 0 });
    ctx.fillStyle = '#e5332a'; ctx.fillRect(zx - w, ya, w, H * .1); text(P.alab2 || '', zx + 30 * u, ya + H * .05, { size: 46 * u, font: 'cond', col: '#f2f4f8', lw: 0, ls: 3 * u, align: 'left', a: kd }); text(P.aval2 || '', zx - w - 30 * u, ya + H * .05, { size: 80 * u, font: 'impact', col: '#ff5a4e', lw: 0, align: 'right', a: kd }); }
  if (P.sub) text(P.sub, W / 2, H * .13, { size: 56 * u, font: 'cond', col: '#f2f4f8', lw: 0, ls: 4 * u, a: clamp(p(t0 + .6, .4)) });
  ctx.restore();
}
