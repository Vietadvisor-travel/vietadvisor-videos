/* @effect label_swap
   @does: a real product photo; a museum-style label sits under it with the name everyone remembers; on the first word the label flips over to the correct name; on the second word a word stamps across the top of the frame
   @params: pic, front, back, word, go, go2, in, out
   @uses: any product photo
   @tags: myth,correction,label,museum,ad,campaign
   @born: nike-vs-adidas a2-05: it was not the Air Jordan, it was the Air Ship; Nike turned the warning into an ad: banned
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, paperDesk, rng, dur }) => {
  // the label of a famous product is struck, then slides off it to a dark gap where the thing really meant stands as a silhouette
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const t1 = at(P.go || 0), t2 = at(P.go2 || P.go || 0), ks = clamp(p(t1 + .35, .9, 'inOut')), bg = img(P.pic), k = clamp(t / Math.max(1, dur));
  if (bg) cover(bg, { z: 1.08 + .1 * k, ox: -.16 * ks, oy: (k - .5) * .05, filter: `brightness(${lerp(.82, .42, ks)}) saturate(${lerp(1, .5, ks)})` });
  const gx = W * .72, gw = W * .44; if (ks > 0) { ctx.fillStyle = `rgba(10,10,12,${.92 * ks})`; ctx.fillRect(lerp(W, gx - gw / 2, ks), 0, gw + 40 * u, H);
    const S = img(P.sil); if (S) { const sw = gw * .72, sh = sw * S.height / S.width; ctx.save(); ctx.globalAlpha = clamp(ks * 1.5 - .3); ctx.filter = 'brightness(0) invert(.42)'; ctx.drawImage(S, gx - sw / 2, H * .5 - sh / 2, sw, sh); ctx.filter = 'none'; ctx.strokeStyle = 'rgba(242,193,78,.8)'; ctx.setLineDash([12 * u, 10 * u]); ctx.lineWidth = 3 * u; ctx.strokeRect(gx - sw / 2 - 20 * u, H * .5 - sh / 2 - 20 * u, sw + 40 * u, sh + 40 * u); ctx.restore(); }
    if (P.note) text(P.note, gx, H * .5 - gw * .32, { size: 40 * u, font: 'cond', col: '#c9ced8', lw: 0, ls: 2 * u, a: clamp(ks * 2 - 1) }); }
  const lw = W * .4, lh = H * .12, lx = lerp(W * .36, gx, ks), ly = H * .76;
  ctx.save(); ctx.translate(lx, ly); ctx.rotate(lerp(-.02, .015, ks)); ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 20 * u; ctx.fillStyle = ks > .5 ? '#1d1d20' : '#f2eee6'; ctx.fillRect(-lw / 2, -lh / 2, lw, lh); ctx.shadowColor = 'transparent';
  if (ks > .5) { ctx.strokeStyle = '#f2c14e'; ctx.lineWidth = 3 * u; ctx.strokeRect(-lw / 2, -lh / 2, lw, lh); }
  text(ks > .5 ? (P.back || '') : (P.front || ''), 0, 0, { size: 50 * u, font: 'cond', col: ks > .5 ? '#f2c14e' : '#1d1d20', lw: 0, ls: 3 * u });
  if (ks <= .5 && t > t1) { ctx.strokeStyle = '#c0281e'; ctx.lineWidth = 8 * u; ctx.beginPath(); ctx.moveTo(-lw * .42, 0); ctx.lineTo(-lw * .42 + lw * .84 * clamp((t - t1) / .3), 0); ctx.stroke(); } ctx.restore();
  const kb = clamp(spring(t2, { stiff: 320, damp: 16 }), 0, 1.15); if (t > t2 && P.word) { ctx.save(); ctx.translate(W * .36, H * .2); ctx.rotate(-.08); const s2 = lerp(2.2, 1, Math.min(1, kb)); ctx.scale(s2, s2); ctx.globalAlpha = clamp(kb * 1.4); ctx.fillStyle = 'rgba(20,6,6,.55)'; ctx.fillRect(-280 * u, -76 * u, 560 * u, 152 * u); ctx.strokeStyle = '#e63328'; ctx.lineWidth = 10 * u; ctx.strokeRect(-280 * u, -76 * u, 560 * u, 152 * u); text(P.word, 0, 4 * u, { size: 116 * u, font: 'impact', col: '#e63328', lw: 0, ls: 10 * u }); ctx.restore(); }
  ctx.restore();
}
