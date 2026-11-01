/* @effect equation_cut
   @does: a sum builds itself line by line on a dark slate, each line on its word, the result counted up in gold; on the last word a red pen strikes the result and writes the number actually decided beside it
   @params: bg, rows (TEXT^word~…), result, rgo, cut, cgo, lab, note, in, out
   @uses: any dim plate
   @tags: arithmetic,equation,multiply,count,result,strike,cut,penalty
   @born: meta-cambridge-analytica-penalty a6: statements times audience became 43,899,725 violations and a $219.5 billion ceiling cut to $25 billion
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, rng, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.bg, 0, 1) || img(P.bg), k = clamp(t / Math.max(1, dur)); if (bg) cover(bg, { z: 1.1 + .26 * Math.min(1, t / Math.max(1, dur)), ox: (Math.min(1, t / Math.max(1, dur)) - .5) * -.18, filter: 'brightness(.4) blur(1px)' }); else { ctx.fillStyle = '#0b0d12'; ctx.fillRect(-W, -H, 3 * W, 3 * H); }
  const R = (P.rows || '').split('~').filter(Boolean).map(s => s.split('^')), x0 = W * .14;
  ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(1 + .05 * k, 1 + .05 * k); ctx.translate(-W / 2, -H / 2);
  R.forEach(([s, w], i) => { const kr = clamp(p(at(w || 0), .45)); if (kr <= 0) return; text(s, x0 + (1 - kr) * 40 * u, H * (.24 + i * .12), { size: 62 * u, font: 'cond', col: '#e8ebf0', lw: 0, align: 'left', a: kr, ls: 2 * u }); });
  const ry = H * (.24 + R.length * .12) + 20 * u; if (P.result) { const kv = clamp(p(at(P.rgo || 0), .5)); if (kv > 0) { ctx.fillStyle = 'rgba(242,193,78,.85)'; ctx.fillRect(x0, ry - 70 * u, W * .72 * kv, 5 * u); text(P.result, x0, ry, { size: 104 * u, font: 'impact', col: '#f2c14e', lw: 0, align: 'left', a: kv }); }
    if (P.cut) { const kc = clamp(p(at(P.cgo || 0), .5)); if (kc > 0) { ctx.save(); ctx.font = `${104 * u}px Impact`; const tw = Math.min(W * .7, ctx.measureText(P.result).width * 1.05); ctx.restore(); ctx.strokeStyle = '#e5332a'; ctx.lineWidth = 12 * u; ctx.beginPath(); ctx.moveTo(x0 - 10 * u, ry - 6 * u); ctx.lineTo(x0 - 10 * u + (tw + 20 * u) * kc, ry - 14 * u); ctx.stroke();
      text(P.cut, x0 + tw * .55, ry + 120 * u, { size: 120 * u, font: 'impact', col: '#ff5a4e', lw: 0, align: 'left', a: clamp(kc * 2 - 1), rot: -.04 }); } } }
  ctx.restore();
  if (P.lab) text(P.lab, W / 2, H * .1, { size: 52 * u, font: 'cond', col: '#f2f4f8', lw: 0, ls: 4 * u });
  if (P.note) text(P.note, W / 2, H * .85, { size: 40 * u, font: 'cond', col: '#b9bec8', lw: 0 });
  ctx.restore();
}
