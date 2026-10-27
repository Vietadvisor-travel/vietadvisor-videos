/* @effect headline_vs_real
   @does: a ledger of the film's numbers: each row lands on its word with an empty dashed bar for the headline figure and a solid bar for the money that really moved, both at true scale, so the same gap repeats down the page
   @params: rows (label^headline^real^headline number^real number^word ~ …), max, title, in, out
   @uses: none (drawn on a dark desk)
   @tags: comparison,headline,reality,ledger,pattern,bars
   @born: wework a4-14: a big headline, then a smaller real number. Again.
*/
({ t, at, p, W, H, u, ctx, params: P, clamp, lerp, text, seam, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none'); ctx.fillStyle = '#12100d'; ctx.fillRect(-W, -H, 3 * W, 3 * H);
  const rows = String(P.rows).split('~').map(s => { const [l, hs, rs, hv, rv, w] = s.split('^'); return { l, hs, rs, hv: +hv, rv: +rv, w }; }), mx = +(P.max || Math.max(...rows.map(r => r.hv))), x0 = W * .3, bw = W * .58, rh = H * .64 / rows.length;
  if (P.title) text(P.title, W / 2, H * .08, { size: 48 * u, font: 'cond', col: '#d6b25e', lw: 0, ls: 5 * u, a: clamp(t / .5) });
  rows.forEach((r, i) => { const k = clamp(p(r.w || 0, .6, 'out5')); if (k <= 0) return; const y = H * .18 + rh * (i + .5);
    text(r.l, x0 - 30 * u, y, { size: 44 * u, font: 'cond', col: '#efe6d2', lw: 0, align: 'right', a: k });
    ctx.save(); ctx.globalAlpha = k; ctx.strokeStyle = 'rgba(239,230,210,.7)'; ctx.setLineDash([12 * u, 9 * u]); ctx.lineWidth = 3 * u; ctx.strokeRect(x0, y - rh * .3, bw * r.hv / mx * k, rh * .6); ctx.restore();
    const kr = clamp(p(r.w || 0, 1.1, 'inOut') * 1.4 - .4); ctx.fillStyle = '#f2c14e'; ctx.fillRect(x0, y - rh * .3, bw * r.rv / mx * kr, rh * .6);
    text(r.hs + (kr > .5 ? '  →  ' + r.rs : ''), x0 + bw * r.hv / mx + 16 * u, y, { size: 44 * u, font: 'impact', col: '#cfc3ab', lw: 0, align: 'left', a: k });  });
  ctx.restore();
}
