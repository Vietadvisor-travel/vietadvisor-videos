/* @effect quarter_bars
   @does: a row of period bars under a dashed record line; the earlier bars stand from frame 0, the last one grows on the word and is the only one to crack through the line; a "first ever" tag lands on the second word and the change sits between first and last
   @params: bg, bars (LABEL^value~…), line, go, go2, unit, suf, lab, tag, chg, in, out
   @uses: any dim plate
   @tags: bars,quarters,record,first,line,profit,history
   @born: nike-vs-adidas a5: Adidas's first billion-euro quarter ever
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, rng, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.bg, 0, 1) || img(P.bg), k = clamp(t / Math.max(1, dur)); if (bg) cover(bg, { z: 1.08 + .12 * k, ox: (k - .5) * -.1, filter: `brightness(${P.dim || .3}) blur(1px)` }); else { ctx.fillStyle = '#0d0f14'; ctx.fillRect(-W, -H, 3 * W, 3 * H); }
  const B = (P.bars || '').split('~').filter(Boolean).map(s => s.split('^')), n = B.length, L = +(P.line || 1000), mx = Math.max(L, ...B.map(b => +b[1])) * 1.22, base = H * .78, top = H * .2, t0 = at(P.go || 0), kv = clamp(p(t0, .9, 'out')), bw = W * .16;
  const yOf = v => lerp(base, top, v / mx), yl = yOf(L), fmt = v => (P.unit || '') + Math.round(v).toLocaleString('en-US') + (P.suf || '');
  ctx.setLineDash([16 * u, 12 * u]); ctx.strokeStyle = '#f2f4f8'; ctx.lineWidth = 4 * u; ctx.beginPath(); ctx.moveTo(W * .12, yl); ctx.lineTo(W * .88, yl); ctx.stroke(); ctx.setLineDash([]);
  text(fmt(L), W * .12, yl - 32 * u, { size: 42 * u, font: 'cond', col: '#f2f4f8', lw: 0, align: 'left' });
  ctx.strokeStyle = 'rgba(242,244,248,.8)'; ctx.lineWidth = 3 * u; ctx.beginPath(); ctx.moveTo(W * .12, base); ctx.lineTo(W * .88, base); ctx.stroke();
  const xs = B.map((_, i) => W * (n > 1 ? lerp(.3, .7, i / (n - 1)) : .5));
  B.forEach(([lab, v], i) => { const last = i === n - 1, kk = last ? kv : 1, y = yOf(+v * kk), x = xs[i]; ctx.fillStyle = last ? '#f2c14e' : '#8a8f99'; ctx.fillRect(x - bw / 2, y, bw, base - y);
    if (last && y < yl) { const r = rng(4); ctx.strokeStyle = '#fff'; ctx.lineWidth = 3 * u; for (let j = 0; j < 6; j++) { ctx.beginPath(); ctx.moveTo(x + (r() - .5) * bw, yl); ctx.lineTo(x + (r() - .5) * bw * 1.8, yl + (r() - .5) * 40 * u); ctx.stroke(); } }
    if (kk > 0) text(fmt(+v * kk), x, y - 56 * u, { size: 84 * u, font: 'impact', col: last ? '#f2c14e' : '#d4d8e0', lw: 0 }); text(lab, x, base + 44 * u, { size: 44 * u, font: 'cond', col: '#f2f4f8', lw: 0, ls: 3 * u }); });
  if (P.chg && n > 1) text(P.chg, (xs[0] + xs[n - 1]) / 2, lerp(yOf(+B[0][1]), base, .5), { size: 64 * u, font: 'impact', col: '#7fd1a8', lw: 0, a: clamp(p(t0 + .6, .4)) });
  if (P.tag) { const kt = clamp(spring(at(P.go2 || P.go || 0), { stiff: 300, damp: 16 }), 0, 1.15); if (kt > 0) { ctx.save(); ctx.translate(xs[n - 1] + bw * .82, top - 50 * u); ctx.rotate(-.06); ctx.scale(lerp(1.8, 1, Math.min(1, kt)), lerp(1.8, 1, Math.min(1, kt))); ctx.fillStyle = '#c8281e'; ctx.fillRect(-190 * u, -44 * u, 380 * u, 88 * u); text(P.tag, 0, 2 * u, { size: 56 * u, font: 'impact', col: '#fff', lw: 0, ls: 4 * u }); ctx.restore(); } }
  if (P.lab) text(P.lab, W / 2, H * .08, { size: 48 * u, font: 'cond', col: '#f2f4f8', lw: 0, ls: 5 * u });
  ctx.restore();
}
