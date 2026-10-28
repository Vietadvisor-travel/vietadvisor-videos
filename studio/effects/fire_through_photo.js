/* @effect fire_through_photo
   @does: a real photo of the thing that burned; on the word real flames rise from the bottom of the frame through it, the picture blackening and curling behind the fire line as it climbs
   @params: pic, fire, go, span, lab, in, out
   @uses: any photo + a fire clip
   @tags: fire,destruction,loss,history,turning-point,burn
   @born: lego a1-13: in February 1960 a fire hit the wooden-toy workshop
*/
({ t, at, p, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const pic = img(P.pic), f = clip(P.fire, 0, 1), k = clamp(t / Math.max(1, dur)), kf = clamp(p(P.go || 0, +(P.span || 2.4), 'inOut')), line = H * (1.05 - kf * 1.1);
  if (pic) cover(pic, { z: 1.12 + .08 * k, ox: (k - .5) * -.06, filter: `brightness(${(1 - .55 * kf).toFixed(2)}) sepia(${(.5 * kf).toFixed(2)})` });
  if (kf > 0) { const g = ctx.createLinearGradient(0, line - H * .25, 0, line + H * .1); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(.7, 'rgba(20,8,2,.85)'); g.addColorStop(1, 'rgba(5,2,0,.97)'); ctx.fillStyle = g; ctx.fillRect(0, line - H * .25, W, H * 1.4);
    if (f) { ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.beginPath(); ctx.rect(0, line - H * .55, W, H * .9); ctx.clip(); const s = Math.max(W / f.width, H * .9 / f.height); for (let i = 0; i < 2; i++) ctx.drawImage(f, i * W / 2 - W * .1, line - H * .55, W * .7, f.height * s * .9); ctx.restore(); } }
  if (P.lab) text(P.lab, W / 2, H * .12, { size: 60 * u, font: 'cond', col: '#ffe2b0', lw: 0, ls: 6 * u, a: clamp(p(at(P.go || 0) + .6, .4)) });
  ctx.restore();
}
