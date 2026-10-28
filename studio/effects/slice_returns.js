/* @effect slice_returns
   @does: one bar of sales per year stands on a real floor; on its word each bar fills its operating-profit share from the bottom in gold, year after year, with the share written beside it
   @params: bg, rows, go, lab, in, out
   @uses: any photo or clip as bg
   @tags: margin,profit,share,years,durability,bars
   @born: lego a6-07: between a quarter and a third of its sales came back as operating profit
*/
({ t, at, p, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, dur }) => {
  // rows: YEAR^percent joined with ~ ; they fill one after another from go
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.bg, 0, 1) || img(P.bg); ctx.fillStyle = '#0d0b09'; ctx.fillRect(-W, -H, 3 * W, 3 * H); if (bg) cover(bg, { z: 1.06 + .12 * clamp(t / Math.max(1, dur)), ox: (clamp(t / dur) - .5) * -.05, filter: 'brightness(.38)' });
  const R = (P.rows || '2010^31.1~2015^34.2').split('~').map(s => s.split('^')), n = R.length, bw = W * .1, gap = W * .6 / Math.max(1, n - 1), x0 = W * .2, floor = H * .78, bh = H * .5, t0 = at(P.go || 0);
  R.forEach(([y, pc], i) => { const x = n === 1 ? W / 2 : x0 + i * gap, ka = clamp(p(.1 + i * .12, .5)), kf = clamp(p(t0 + i * .35, .7));
    ctx.fillStyle = 'rgba(243,236,220,.18)'; ctx.fillRect(x - bw / 2, floor - bh * ka, bw, bh * ka); ctx.strokeStyle = 'rgba(243,236,220,.5)'; ctx.lineWidth = 2 * u; ctx.strokeRect(x - bw / 2, floor - bh * ka, bw, bh * ka);
    const fh = bh * (+pc / 100) * kf; ctx.fillStyle = '#e3b23c'; ctx.fillRect(x - bw / 2, floor - fh, bw, fh);
    text(y, x, floor + 40 * u, { size: 40 * u, font: 'cond', col: '#efe4cf', lw: 0, a: ka }); if (kf > 0) text(pc + '%', x, floor - fh - 36 * u, { size: 50 * u, font: 'impact', col: '#f2c14e', lw: 0, a: kf }); });
  if (P.lab) text(P.lab, W / 2, H * .12, { size: 50 * u, font: 'cond', col: '#f6efe2', lw: 0, ls: 5 * u, a: clamp(p(.2, .5)) });
  ctx.restore();
}
