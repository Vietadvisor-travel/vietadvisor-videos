/* @effect map_dive
   @does: a real map zooms continuously toward one town; a pin drops on the word, then a circle opens from the pin into a real photo of the place, which keeps drifting
   @params: map, x, y, go, iris, photo, lab, sub, in, out
   @uses: any map image + any photo or clip of the place
   @tags: map,place,origin,zoom,pin,iris
   @born: lego a1-01: a carpenter's workshop in the Danish village of Billund
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const m = img(P.map), x = +(P.x || .5), y = +(P.y || .5), k = clamp(t / Math.max(1, dur));
  if (m) { const s = Math.max(W / m.width, H / m.height) * lerp(1.05, 2.4, k * k * (3 - 2 * k)); ctx.save(); ctx.filter = 'saturate(.8)'; ctx.drawImage(m, W / 2 - x * m.width * s, H / 2 - y * m.height * s, m.width * s, m.height * s); ctx.restore(); }
  const kp = clamp(spring(P.go || 0, { stiff: 170, damp: 13 }), 0, 1.1); if (kp > 0) { ctx.save(); ctx.translate(W / 2, H / 2 - (1 - Math.min(1, kp)) * H * .3); ctx.fillStyle = '#d6332b'; ctx.beginPath(); ctx.arc(0, -46 * u, 26 * u, Math.PI, 0); ctx.lineTo(0, 0); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, -46 * u, 9 * u, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    if (P.lab) text(P.lab, W / 2, H / 2 + 60 * u, { size: 56 * u, font: 'cond', col: '#1e1a15', lw: 0, ls: 6 * u, a: clamp(p(P.go || 0, .4)) }); }
  if (P.iris) { const ki = clamp(p(P.iris, .7, 'inOut')); if (ki > 0) { const ph = clip(P.photo, 0, 1) || img(P.photo); ctx.save(); ctx.beginPath(); ctx.arc(W / 2, H / 2 - 46 * u, ki * W * .62, 0, Math.PI * 2); ctx.clip();
    if (ph) cover(ph, { z: 1.12 + .1 * clamp((t - at(P.iris)) / 3), ox: -.03 * clamp((t - at(P.iris)) / 3) }); ctx.restore(); if (P.sub) text(P.sub, W / 2, H * .14, { size: 50 * u, font: 'cond', col: '#f6efe2', lw: 0, ls: 6 * u, a: clamp(p(at(P.iris) + .5, .4)) }); } }
  ctx.restore();
}
