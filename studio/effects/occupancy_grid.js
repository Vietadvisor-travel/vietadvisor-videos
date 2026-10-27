/* @effect occupancy_grid
   @does: a real empty room behind and a block of 100 seats in front; on the word the occupied share lights gold seat by seat in a scatter while the percentage counts up
   @params: in, out, plate, pct, go, lab, sub
   @uses: — (swap these ids for the new episode's own)
   @tags: occupancy,percent,seats,utilisation,grid,empty
   @born: wework a5-04: its buildings were only 72 percent full
*/
({ t, at, p, stagger, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, rng, dur }) => {
  // a real empty room behind; a block of 100 seats (10 × 10) set in front of it; on the word the occupied share lights up
  // seat by seat in a random scatter and the percentage counts up beside it, the empty seats staying dark outlines.
  // params: plate, pct, go, lab, sub, in, out
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.plate, 0, 1) || img(P.plate); ctx.fillStyle = '#0c0b0a'; ctx.fillRect(-W, -H, 3 * W, 3 * H);
  if (bg && bg.width) { const s = Math.max(W / bg.width, H / bg.height) * (1.04 + .03 * clamp(t / dur)); ctx.save(); ctx.filter = 'blur(4px) brightness(.4)'; ctx.drawImage(bg, W / 2 - bg.width * s / 2, H / 2 - bg.height * s / 2, bg.width * s, bg.height * s); ctx.restore(); }
  const pct = +(P.pct || 72), r = rng(11), ord = Array.from({ length: 100 }, (_, i) => i).sort(() => r() - .5), on = new Set(ord.slice(0, pct)), k = clamp(p(P.go || 0, 1.4, 'inOut'));
  const gx = W * .1, gy = H * .16, cs = H * .066; let lit = 0;
  ord.forEach((i, rk) => { const x = gx + (i % 10) * cs, y = gy + Math.floor(i / 10) * cs, isOn = on.has(i), shown = isOn && rk / pct < k;
    if (shown) lit++; ctx.save(); if (shown) { ctx.fillStyle = '#f2c14e'; ctx.beginPath(); ctx.roundRect(x + cs * .12, y + cs * .12, cs * .76, cs * .76, 6 * u); ctx.fill(); } else { ctx.strokeStyle = 'rgba(239,230,210,.35)'; ctx.lineWidth = 2 * u; ctx.beginPath(); ctx.roundRect(x + cs * .12, y + cs * .12, cs * .76, cs * .76, 6 * u); ctx.stroke(); } ctx.restore(); });
  const a = clamp(t / .5); text(Math.round(pct * k) + '%', W * .7, H * .4, { size: 170 * u, font: 'impact', col: '#f2c14e', lw: 0, a });
  if (P.lab) text(P.lab, W * .7, H * .55, { size: 52 * u, font: 'cond', col: '#efe6d2', lw: 0, ls: 4 * u, a }); if (P.sub) text(P.sub, W * .7, H * .63, { size: 40 * u, font: 'cond', col: '#b9ad97', lw: 0, a });
  ctx.restore();
}
