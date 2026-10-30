/* @effect label_swap
   @does: a real product photo; a museum-style label sits under it with the name everyone remembers; on the first word the label flips over to the correct name; on the second word a word stamps across the top of the frame
   @params: pic, front, back, word, go, go2, in, out
   @uses: any product photo
   @tags: myth,correction,label,museum,ad,campaign
   @born: nike-vs-adidas a2-05: it was not the Air Jordan, it was the Air Ship; Nike turned the warning into an ad: banned
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, paperDesk, rng, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = img(P.pic), k = clamp(t / Math.max(1, dur)); if (bg) cover(bg, { z: 1.08 + .12 * k, oy: (k - .5) * .06, filter: 'brightness(.8)' });
  const t1 = at(P.go || 0), t2 = at(P.go2 || P.go || 0), kf = clamp(p(t1, .6, 'inOut')), sc = Math.abs(Math.cos(kf * Math.PI)), lw = W * .42, lh = H * .13, lx = W / 2, ly = H * .78;
  ctx.save(); ctx.translate(lx, ly); ctx.scale(1, sc); ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 20 * u; ctx.fillStyle = kf < .5 ? '#f2eee6' : '#1d1d20'; ctx.fillRect(-lw / 2, -lh / 2, lw, lh); ctx.shadowColor = 'transparent'; text(kf < .5 ? (P.front || '') : (P.back || ''), 0, 0, { size: 44 * u, font: 'cond', col: kf < .5 ? '#1d1d20' : '#f2c14e', lw: 0, ls: 3 * u }); ctx.restore();
  if (kf < .5 && t > t1 - .1) { ctx.strokeStyle = '#c0281e'; ctx.lineWidth = 6 * u; ctx.beginPath(); ctx.moveTo(lx - lw * .4, ly); ctx.lineTo(lx - lw * .4 + lw * .8 * clamp((t - t1 + .1) / .3), ly); ctx.stroke(); }
  const ks = clamp(spring(t2, { stiff: 320, damp: 16 }), 0, 1.15); if (t > t2 && P.word) { ctx.save(); ctx.translate(W / 2, H * .22); ctx.rotate(-.08); const s2 = lerp(2.4, 1, Math.min(1, ks)); ctx.scale(s2, s2); ctx.globalAlpha = clamp(ks * 1.4); ctx.strokeStyle = '#e63328'; ctx.lineWidth = 10 * u; ctx.strokeRect(-300 * u, -80 * u, 600 * u, 160 * u); text(P.word, 0, 4 * u, { size: 120 * u, font: 'impact', col: '#e63328', lw: 0, ls: 10 * u }); ctx.restore(); }
  ctx.restore();
}
