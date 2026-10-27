/* @effect cash_pile
   @does: real bundles of cash drop one after another onto a dark desk and stack into a pile while a counter runs up to the total; small tags on the pile name where the money came from
   @params: img, n, go, val, tags (~), lab, in, out
   @uses: a cash photo or clip frame
   @tags: money,cash,pile,count,payout,stack
   @born: wework a2-06: by that July he had taken out about seven hundred million dollars
*/
({ t, at, p, W, H, u, img, ctx, params: P, clamp, lerp, text, seam, drop, block, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  ctx.fillStyle = '#15110d'; ctx.fillRect(-W, -H, 3 * W, 3 * H); const lg = ctx.createRadialGradient(W * .4, H * .5, 0, W * .4, H * .5, W * .6); lg.addColorStop(0, 'rgba(255,214,150,.14)'); lg.addColorStop(1, 'rgba(0,0,0,.5)'); ctx.fillStyle = lg; ctx.fillRect(0, 0, W, H);
  const c = img(P.img), n = +(P.n || 21), gp = +(P.gap || .09), t0 = at(P.go || 0), bw = W * .1, bh = bw * .36, floor = H * .82; let shown = 0, row = 0, inRow = 0, perRow = 6;
  for (let i = 0; i < n; i++) { const td = t0 + i * gp; if (t < td) break; shown++; const r = Math.floor(i / perRow) , q = i % perRow, rowN = perRow - r; if (q >= rowN) continue; const x = W * .38 + (q - (rowN - 1) / 2) * bw * 1.02, yT = floor - bh * (r + .5) * 1.05, y = drop(td, yT - H * .6, yT, { bounce: .15 });
    block(c && c.width ? c : null, x, y, bw, bh, { depth: .45, skew: .4, side: '#1d2a1a' }); }
  const k = clamp((t - t0) / (n * gp + .3)), v = +(P.val || 700); text('$' + Math.round(v * k) + 'M', W * .76, H * .38, { size: 150 * u, font: 'impact', col: '#9fe0a8', lw: 0, a: clamp((t - t0) / .3) });
  if (P.lab) text(P.lab, W * .76, H * .5, { size: 44 * u, font: 'cond', col: '#efe6d2', lw: 0, ls: 3 * u, a: k });
  String(P.tags || '').split('~').filter(Boolean).forEach((tg, i) => { const a = clamp((k - .6 - i * .15) / .2); text(tg, W * .76, H * (.6 + i * .08), { size: 44 * u, font: 'cond', col: '#f2c14e', lw: 0, a }); });
  ctx.restore();
}
