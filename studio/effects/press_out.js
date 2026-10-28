/* @effect press_out
   @does: real footage of a moulding press working; on the word plastic bricks pop out of the press one after another, each a different colour, and fall into a neat row on the floor of the frame; a short label sets
   @params: clip, go, n, lab, in, out
   @uses: any press or machine clip + lego_cut_brick_* cut-outs
   @tags: factory,moulding,plastic,bricks,production,limits
   @born: lego a1-15: from then on LEGO made one thing, plastic bricks, in limited shapes and limited colours
*/
({ t, at, p, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, drop, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.clip, 0, 1) || img(P.clip), k = clamp(t / Math.max(1, dur)); if (bg) cover(bg, { z: 1.08 + .1 * k, filter: 'brightness(.62)' });
  const ids = ['red', 'yellow', 'blue', 'white'].map(c => img('lego_cut_brick_' + c)), n = +(P.n || 4), t0 = at(P.go || 0), bh = H * .1, floor = H * .82;
  for (let i = 0; i < n; i++) { const b = ids[i % 4], st = t0 + i * .32; if (!b || t < st) continue; const w = bh * b.width / b.height, tx = W * (.5 + (i - (n - 1) / 2) * .2), tau = t - st;
    const x = lerp(W * .5, tx, clamp(tau / .5)), y = tau < .5 ? H * .42 - 260 * u * tau + 1600 * u * tau * tau : drop(st + .5, H * .42 - 130 * u + 400 * u * 0, floor - bh / 2, { bounce: .25 }); ctx.drawImage(b, x - w / 2, Math.min(y, floor - bh / 2) - bh / 2, w, bh); }
  if (P.lab) text(P.lab, W / 2, H * .13, { size: 60 * u, font: 'cond', col: '#f6efe2', lw: 0, ls: 6 * u, a: clamp(p(t0 + n * .32, .4)) });
  ctx.restore();
}
