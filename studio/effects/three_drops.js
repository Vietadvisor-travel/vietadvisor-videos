/* @effect three_drops
   @does: a dim real photo behind; three labelled bars stand at a zero line; one after another, fast, each drops below the line to its own depth with its percentage, the deepest last
   @params: bg, items, go, note, in, out
   @uses: any photo
   @tags: decline,quarter,results,segments,drop,breakdown
   @born: nike-vs-adidas a5-05: revenue down 4%, direct down 9%, Greater China down 26%
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, paperDesk, rng, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.bg, 0, 1) || img(P.bg), k = clamp(t / Math.max(1, dur)); if (bg) cover(bg, { z: 1.08 + .14 * k, ox: (k - .5) * -.1, filter: `brightness(${P.dim || .38})` }); else { ctx.fillStyle = '#0d0f14'; ctx.fillRect(-W, -H, 3 * W, 3 * H); }
  const I = (P.items || '').split('~').filter(Boolean).map(s => s.split('^')), t0 = at(P.go || 0), zy = H * .3, bw = W * .16, mx = Math.max(...I.map(q => Math.abs(+q[1])), 1);
  ctx.strokeStyle = '#f2f4f8'; ctx.lineWidth = 4 * u; ctx.beginPath(); ctx.moveTo(W * .1, zy); ctx.lineTo(W * .9, zy); ctx.stroke();
  I.forEach(([lab, v], i) => { const x = W * (.25 + i * .25), kk = clamp(p(t0 + i * .4, .6, 'out')), h = H * .42 * Math.abs(+v) / mx * kk; text(lab, x, zy - 46 * u, { size: 40 * u, font: 'cond', col: '#f2f4f8', lw: 0, ls: 3 * u }); ctx.fillStyle = '#ff4b3e'; ctx.fillRect(x - bw / 2, zy, bw, h); if (kk > .3) text(v + '%', x, zy + h + 54 * u, { size: 72 * u, font: 'impact', col: '#ff6b5e', lw: 0, a: clamp((kk - .3) * 2) }); });
  if (P.note) text(P.note, W / 2, H * .86, { size: 34 * u, font: 'cond', col: '#c9ced8', lw: 0, a: clamp(p(t0 + I.length * .4, .4)) });
  ctx.restore();
}
