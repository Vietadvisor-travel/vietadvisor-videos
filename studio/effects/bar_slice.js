/* @effect bar_slice
   @does: a dim real picture behind; one long horizontal bar stands for a total, its figure on it; on the word a slice at its end peels off, drops below and takes its own label, the main figure staying put
   @params: bg, total, part, go, tlab, plab, unit, in, out
   @uses: any photo or clip
   @tags: share,portion,one-off,split,donation,breakdown
   @born: nike-vs-adidas a4-10: Yeezy stock sold for about EUR 1.4B; EUR 260M set aside for charity
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, paperDesk, rng, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.bg, 0, 1) || img(P.bg), k = clamp(t / Math.max(1, dur)); if (bg) cover(bg, { z: 1.08 + .14 * k, ox: (k - .5) * -.1, filter: `brightness(${P.dim || .38})` }); else { ctx.fillStyle = '#0d0f14'; ctx.fillRect(-W, -H, 3 * W, 3 * H); }
  const T = +(P.total || 100), Pp = +(P.part || 20), t0 = at(P.go || 0), kp = clamp(p(t0, .8, 'inOut')), ka = clamp(p(.1, .8, 'out')), x0 = W * .12, bw = W * .76 * ka, y = H * .38, bh = H * .14, pw = W * .76 * Pp / T;
  ctx.fillStyle = '#f2c14e'; ctx.fillRect(x0, y, Math.max(0, bw - (ka >= 1 ? pw : 0)), bh); text(P.tlab || '', x0 + 30 * u, y - 40 * u, { size: 44 * u, font: 'cond', col: '#f2f4f8', lw: 0, ls: 4 * u, align: 'left' });
  if (ka >= 1) { const px = x0 + W * .76 - pw + kp * 20 * u, py = y + kp * H * .26; ctx.save(); ctx.translate(px + pw / 2, py + bh / 2); ctx.rotate(kp * .05); ctx.fillStyle = '#7fd1a8'; ctx.fillRect(-pw / 2, -bh / 2, pw, bh); ctx.restore(); if (kp > .5) text(P.plab || '', Math.min(px + pw / 2, W * .62), py + bh + 50 * u, { size: 44 * u, font: 'cond', col: '#bff0d4', lw: 0, ls: 3 * u, a: clamp((kp - .5) * 2) }); }
  ctx.restore();
}
