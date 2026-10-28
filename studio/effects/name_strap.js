/* @effect name_strap
   @does: a real photo of a person with the camera travelling across it toward the face; on the name a paper name card slides in at the top edge with the name and the role, and stays
   @params: pic, go, name, role, fx, fy, in, out
   @uses: any portrait photo
   @tags: person,name,introduction,portrait,role,camera
   @born: lego a2-06: in 1979 the founder's grandson Kjeld Kirk Kristiansen took charge
*/
({ t, at, p, spring, W, H, u, img, ctx, params: P, clamp, lerp, text, seam, cover, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const pic = img(P.pic), k = clamp(t / Math.max(1, dur)), e = k * k * (3 - 2 * k), fx = +(P.fx || .5), fy = +(P.fy || .4);
  if (pic) cover(pic, { z: lerp(1.05, 1.35, e), ox: lerp(0, (.5 - fx) * .3, e), oy: lerp(0, (.5 - fy) * .25, e), filter: 'brightness(.9)' });
  const kc = clamp(spring(P.go || 0, { stiff: 150, damp: 18 }), 0, 1.04); if (kc > 0) { const w = Math.max((P.name || '').length * 34, (P.role || '').length * 20) * u + 100 * u, x = W * .06 - (1 - Math.min(1, kc)) * (w + 80 * u), y = H * .1;
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 24 * u; ctx.shadowOffsetY = 10 * u; ctx.fillStyle = '#f2ead9'; ctx.fillRect(x, y, w, 150 * u); ctx.shadowColor = 'transparent'; ctx.fillStyle = '#c8322a'; ctx.fillRect(x, y, 12 * u, 150 * u); ctx.restore();
    text(P.name || '', x + 40 * u, y + 58 * u, { size: 60 * u, font: 'cond', col: '#1d1813', lw: 0, ls: 3 * u, align: 'left' }); if (P.role) text(P.role, x + 40 * u, y + 112 * u, { size: 38 * u, font: 'serif', col: '#4a3f33', lw: 0, align: 'left' }); }
  ctx.restore();
}
