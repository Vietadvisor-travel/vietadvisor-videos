/* @effect level_drain
   @does: a tall glass column full of bricks stands in front of dim footage; on the word the bricks pour out of a gap at its foot and the level sinks, leaving a dashed line where it was, while the value counts down and locks
   @params: bg, from, to, go, a, b, unit, lab, note, in, out
   @uses: lego_cut_brick_* + any clip or photo
   @tags: equity,drain,level,balance-sheet,shrink,reserve
   @born: lego a3-09: equity fell from about 4.9 billion kroner to under 3 billion
*/
({ t, at, p, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, rng, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.bg, 0, 1) || img(P.bg), k = clamp(t / Math.max(1, dur)); if (bg) cover(bg, { z: 1.1 + .1 * k, filter: 'brightness(.3) blur(3px)' });
  const from = +(P.from || 1), to = +(P.to || .5), t0 = at(P.go || 0), kv = clamp(p(t0, 1.6, 'inOut')), v = lerp(from, to, kv);
  const tw = W * .2, th = H * .58, tx = W * .3 - tw / 2, tb = H * .78, lvl = th * .92 * v / from, cols = ['red', 'yellow', 'blue', 'white'].map(c => img('lego_cut_brick_' + c)), bw = tw / 3, bh = bw * .55;
  ctx.save(); ctx.beginPath(); ctx.rect(tx, tb - lvl, tw, lvl); ctx.clip(); let i = 0; for (let y = tb - bh; y > tb - th; y -= bh) { for (let x = tx - (i % 2 ? bw / 2 : 0); x < tx + tw; x += bw) { const b = cols[(i * 7 + Math.floor(x)) % 4]; if (b) ctx.drawImage(b, x, y - bh * .4, bw, bw * b.height / b.width); } i++; } ctx.restore();
  ctx.strokeStyle = 'rgba(230,240,250,.7)'; ctx.lineWidth = 4 * u; ctx.strokeRect(tx, tb - th, tw, th); ctx.fillStyle = 'rgba(230,240,250,.08)'; ctx.fillRect(tx, tb - th, tw, th);
  if (t > t0) { ctx.setLineDash([10 * u, 8 * u]); ctx.strokeStyle = '#f2c14e'; ctx.lineWidth = 3 * u; ctx.beginPath(); ctx.moveTo(tx - 30 * u, tb - th * .92); ctx.lineTo(tx + tw + 30 * u, tb - th * .92); ctx.stroke(); ctx.setLineDash([]);
    if (kv < 1) { const r = rng(Math.floor(t * 30)); for (let j = 0; j < 8; j++) { const b = cols[j % 4]; if (!b) continue; const yy = tb + r() * H * .06, xx = tx + tw + r() * 90 * u; ctx.drawImage(b, xx, yy - 20 * u, bw * .6, bw * .6 * b.height / b.width); } } }
  const rx = W * .66, vv = v.toFixed(1); text(kv <= 0 ? (P.a || '') : (P.b || ''), rx, H * .3, { size: 46 * u, font: 'cond', col: '#efe4cf', lw: 0, ls: 5 * u });
  text((P.unit ? P.unit + ' ' : '') + vv + 'B', rx, H * .45, { size: 150 * u, font: 'impact', col: kv > 0 ? '#ff6b5e' : '#f6efe2', lw: 0 });
  if (P.lab) text(P.lab, rx, H * .57, { size: 36 * u, font: 'cond', col: '#d9cdb8', lw: 0, ls: 4 * u }); if (P.note) text(P.note, rx, H * .8, { size: 26 * u, font: 'cond', col: '#b9ad98', lw: 0 });
  ctx.restore();
}
