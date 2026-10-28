/* @effect tower_compare
   @does: two towers of plastic bricks build themselves brick by brick over real footage, one per side; a side can stack two companies in two colours; each tower is as tall as its number, and the totals land on top
   @params: bg, l, r, unit, step, go, rgo, lab, in, out
   @uses: lego_cut_brick_red/yellow/blue/white, any clip or photo as bg
   @tags: comparison,revenue,scale,bricks,stack,rivals
   @born: lego a0-09: twenty years later LEGO was bigger than Mattel and Hasbro combined
*/
({ t, at, p, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, dur }) => {
  // l and r: NAME^value^brick(red|yellow|blue|white) joined with ~ (stacked bottom-up). step: value per brick. The left tower
  // builds from go, the right from rgo. unit: shown after totals. lab: one line at the top
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.bg, 0, 1) || img(P.bg); ctx.fillStyle = '#0b0a09'; ctx.fillRect(-W, -H, 3 * W, 3 * H); if (bg) cover(bg, { z: 1.06 + .1 * clamp(t / Math.max(1, dur)), filter: 'brightness(.42)' });
  const step = +(P.step || .5), bh = H * +(P.bh || .045), floor = H * .86;
  const tower = (spec, cx, t0) => { const parts = spec.split('~').map(s => s.split('^')); let i = 0, tot = 0, y = floor; const nAll = parts.reduce((a, q) => a + Math.round(+q[1] / step), 0);
    parts.forEach(([name, v, c], pi) => { const n = Math.round(+v / step), b = img('lego_cut_brick_' + (c || 'red')); const y0 = y;
      for (let j = 0; j < n; j++, i++) { const st = t0 + i * .07; if (t < st || !b) continue; const yy = Math.min(y - bh / 2, -bh + 3000 * u * Math.pow(t - st, 2)); const w = bh * b.width / b.height; ctx.drawImage(b, cx - w / 2, yy - bh / 2, w, bh); y -= bh * .86; }
      if (n && t > t0 + (i - 1) * .07 + .3) text(name, cx + (pi % 2 ? -1 : 1) * W * .135, (y0 + y) / 2, { size: 36 * u, font: 'cond', col: '#f3ecdc', lw: 0, ls: 3 * u, a: clamp(p(t0 + i * .07, .4)) });
      tot += +v; });
    const done = t0 + nAll * .07 + .2; if (t > done) text((P.pre || '$') + (Math.round(tot * 100) / 100) + (P.unit || 'B'), cx, y - 70 * u, { size: 88 * u, font: 'impact', col: '#f2c14e', lw: 0, a: clamp(p(done, .4)) }); };
  tower(P.l || 'A^5', W * .34, at(P.go || 0)); tower(P.r || 'B^10', W * .66, at(P.rgo || P.go || 0));
  if (P.lab) text(P.lab, W / 2, H * .1, { size: 50 * u, font: 'cond', col: '#f6efe2', lw: 0, ls: 6 * u, a: clamp(p(.2, .5)) });
  ctx.restore();
}
