/* @effect revenue_strip
   @does: long bars each stand for a whole year of a company's money (revenue, profit); on its word the share a penalty takes out of each bar lights red from the end, with the percentage set on the cut, so a record fine is measured against what the company makes
   @params: bg, bars (LABEL^pct^word~…), lab, note, in, out
   @uses: any dim plate
   @tags: fine,share,percent,revenue,profit,scale,penalty,bars
   @born: meta-cambridge-analytica-penalty a4: the $5 billion FTC penalty was 9 % of a year's revenue and 23 % of its profit
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, rng, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.bg, 0, 1) || img(P.bg); if (bg) cover(bg, { z: 1.08, filter: 'brightness(.32) blur(2px)' }); else { ctx.fillStyle = '#0b0d12'; ctx.fillRect(-W, -H, 3 * W, 3 * H); }
  const B = (P.bars || '').split('~').filter(Boolean).map(s => s.split('^')), x0 = W * .08, x1 = W * .92, bh = H * .1;
  B.forEach(([lab, pct, w], i) => { const y = H * (.32 + i * .24), kg = clamp(p(.2 + i * .2, .8, 'out')), kr = clamp(p(at(w || 0), .8, 'out')), xe = lerp(x0, x1, kg), cut = x1 - (x1 - x0) * (+pct / 100) * kr;
    ctx.fillStyle = '#3c4a66'; ctx.fillRect(x0, y, xe - x0, bh); if (kr > 0) { ctx.fillStyle = '#e5332a'; ctx.fillRect(cut, y, x1 - cut, bh); }
    text(lab, x0, y - 34 * u, { size: 44 * u, font: 'cond', col: '#f2f4f8', lw: 0, ls: 3 * u, align: 'left', a: kg });
    if (kr > 0) text(pct + '%', Math.max(cut - 30 * u, x0 + 120 * u), y + bh / 2, { size: 84 * u, font: 'impact', col: '#ff6b5e', lw: 0, align: 'right', a: clamp(kr * 2) }); });
  if (P.lab) text(P.lab, W / 2, H * .1, { size: 56 * u, font: 'cond', col: '#f2f4f8', lw: 0, ls: 4 * u });
  if (P.note) text(P.note, W / 2, H * .84, { size: 40 * u, font: 'cond', col: '#b9bec8', lw: 0 });
  ctx.restore();
}
