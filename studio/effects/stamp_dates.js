/* @effect stamp_dates
   @does: the camera travels across a real photo of a building; on each named word a rubber date stamp slams onto the picture in ink, the second beside the first, and a pencil arrow then joins them with the gap written over it
   @params: pic, stamps, gap, in, out
   stamps: TEXT^word~TEXT^word
   @uses: any photo
   @tags: dates,tenure,timeline,insider,gap,stamp
   @born: lego a3-05: he had joined LEGO less than two years before
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.pic, 0, 1) || img(P.pic), k = clamp(t / Math.max(1, dur)); if (bg) cover(bg, { z: 1.2, ox: (k - .5) * -.14, filter: 'brightness(.6) sepia(.25)' });
  const S = (P.stamps || '').split('~').filter(Boolean).map(s => s.split('^')), xs = [W * .3, W * .7], y = H * +(P.y || .42);
  S.forEach(([lab, w], i) => { const st = at(w); if (t < st) return; const ks = spring(st, { stiff: 420, damp: 20 }), sc = lerp(1.8, 1, Math.min(1, ks)); ctx.save(); ctx.translate(xs[i] || W / 2, y); ctx.rotate(i ? .06 : -.07); ctx.scale(sc, sc); ctx.globalAlpha = clamp(ks * 2) * .92;
    const sw2 = Math.max(400, lab.length * 36 + 80) * u; ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 24 * u; ctx.fillStyle = '#c8281e'; ctx.fillRect(-sw2 / 2, -62 * u, sw2, 124 * u); ctx.shadowColor = 'transparent'; ctx.strokeStyle = '#f6efe2'; ctx.lineWidth = 3 * u; ctx.strokeRect(-sw2 / 2 + 12 * u, -50 * u, sw2 - 24 * u, 100 * u); text(lab, 0, 4 * u, { size: 62 * u, font: 'impact', col: '#fff', lw: 0, ls: 6 * u }); ctx.restore(); });
  if (S.length > 1) { const st = at(S[1][1]) + .5, ka = clamp((t - st) / .6); if (ka > 0) { ctx.strokeStyle = 'rgba(250,246,236,.92)'; ctx.lineWidth = 5 * u; ctx.beginPath(); ctx.moveTo(xs[0], y + 110 * u); ctx.quadraticCurveTo(W / 2, y + 190 * u, lerp(xs[0], xs[1], ka), y + 110 * u); ctx.stroke(); if (P.gap) text(P.gap, W / 2, y + 230 * u, { size: 60 * u, font: 'hand', col: '#faf6ec', lw: 0, a: clamp(ka * 2 - 1) }); } }
  ctx.restore();
}
