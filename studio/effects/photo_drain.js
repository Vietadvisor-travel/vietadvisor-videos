/* @effect photo_drain
   @does: a framed portrait on a dark wall above a title plate; on the word the photo drains grey and slides out of the frame, leaving the empty frame and the plate
   @params: cap, in, out, pic, go, plate, date, stay (1 = the drained photo stays in the frame)
   @uses: — (swap these ids for the new episode's own)
   @tags: exit,resignation,removal,portrait,frame,ceo
   @born: wework a3-17: Adam Neumann resigned as CEO
*/
({ t, at, p, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, dur }) => {
  // a framed portrait hangs on a dark wall with its title plate; on the word the photo drains to grey and slides down out of
  // its frame, leaving the frame empty and the plate still there; a date sets beside it. params: pic, plate, go, date, in, out
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const wall = ctx.createLinearGradient(0, 0, 0, H); wall.addColorStop(0, '#1d1a16'); wall.addColorStop(1, '#0d0b09'); ctx.fillStyle = wall; ctx.fillRect(-W, -H, 3 * W, 3 * H);
  const lg = ctx.createRadialGradient(W * .4, H * .2, 0, W * .4, H * .2, W * .6); lg.addColorStop(0, 'rgba(255,220,170,.16)'); lg.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = lg; ctx.fillRect(0, 0, W, H);
  const im = clip(P.pic, 0, 1) || img(P.pic), fw = W * .3, fh = H * .6, fx = W * .4 - fw / 2, fy = H * .1, k = clamp(p(P.go || 0, 1.1, 'inOut')), dr = clamp(p(P.go || 0, .5, 'out'));
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 40 * u; ctx.shadowOffsetY = 14 * u; ctx.fillStyle = '#2b2219'; ctx.fillRect(fx - 26 * u, fy - 26 * u, fw + 52 * u, fh + 52 * u); ctx.restore();
  ctx.fillStyle = '#0a0908'; ctx.fillRect(fx, fy, fw, fh);
  if (im && im.width && (k < 1 || P.stay)) { ctx.save(); ctx.beginPath(); ctx.rect(fx, fy, fw, fh); ctx.clip(); const s = Math.max(fw / im.width, fh / im.height) * (1.02 + .03 * clamp(t / dur)); ctx.filter = `grayscale(${dr.toFixed(2)}) brightness(${(1 - .3 * dr).toFixed(2)})`; ctx.drawImage(im, fx + fw / 2 - im.width * s / 2, fy + fh / 2 - im.height * s / 2 + (P.stay ? 0 : k * k * fh * 1.05), im.width * s, im.height * s); ctx.restore(); }
  ctx.strokeStyle = '#8a6d45'; ctx.lineWidth = 6 * u; ctx.strokeRect(fx - 10 * u, fy - 10 * u, fw + 20 * u, fh + 20 * u);
  ctx.fillStyle = '#b89a62'; ctx.fillRect(W * .4 - 150 * u, fy + fh + 50 * u, 300 * u, 70 * u); text(P.plate || 'CEO', W * .4, fy + fh + 85 * u, { size: 48 * u, font: 'cond', col: '#2a2014', lw: 0, ls: 8 * u });
  if (P.cap) text(P.cap, W * .74, H * .56, { size: 40 * u, font: 'cond', col: '#c9bda6', lw: 0, a: clamp(p(P.go || 0, .5)) });
  if (P.date) text(P.date, W * .74, H * .45, { size: 84 * u, font: 'impact', col: '#f2ead9', lw: 0, a: clamp(p(P.go || 0, .5)) });
  ctx.restore();
}
