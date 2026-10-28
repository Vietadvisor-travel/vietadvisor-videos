/* @effect mourning_frame
   @does: a real portrait fills the frame with the camera easing in; on the word its colour drains slowly and a black border draws itself round the picture, then a date types beside the name
   @params: pic, go, name, date, fx, fy, in, out
   @uses: any portrait photo
   @tags: death,portrait,memorial,date,person,loss
   @born: lego a1-12: Ole Kirk died a few weeks later
*/
({ t, at, p, W, H, u, img, ctx, params: P, clamp, lerp, text, seam, cover, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none'); ctx.fillStyle = '#0b0a09'; ctx.fillRect(-W, -H, 3 * W, 3 * H);
  const pic = img(P.pic), k = clamp(t / Math.max(1, dur)), kd = clamp(p(P.go || 0, 1.6, 'inOut')), fx = +(P.fx || .5), fy = +(P.fy || .4);
  const fw = W * .46, fh = H * .74, x = W * .36 - fw / 2, y = H * .46 - fh / 2;
  if (pic) { ctx.save(); ctx.beginPath(); ctx.rect(x, y, fw, fh); ctx.clip(); const s = Math.max(fw / pic.width, fh / pic.height) * (1.08 + .12 * k); ctx.filter = `grayscale(${kd.toFixed(2)}) brightness(${(1 - .25 * kd).toFixed(2)})`;
    ctx.drawImage(pic, x + fw / 2 - pic.width * s * fx, y + fh / 2 - pic.height * s * fy, pic.width * s, pic.height * s); ctx.restore(); }
  if (kd > 0) { const L = 2 * (fw + fh) * kd, P0 = [[x, y], [x + fw, y], [x + fw, y + fh], [x, y + fh], [x, y]]; ctx.strokeStyle = '#000'; ctx.lineWidth = 22 * u; ctx.beginPath(); ctx.moveTo(x, y); let left = L;
    for (let i = 1; i < 5 && left > 0; i++) { const d = Math.hypot(P0[i][0] - P0[i - 1][0], P0[i][1] - P0[i - 1][1]), f = Math.min(1, left / d); ctx.lineTo(lerp(P0[i - 1][0], P0[i][0], f), lerp(P0[i - 1][1], P0[i][1], f)); left -= d; } ctx.stroke(); }
  const a = clamp(p(at(P.go || 0) + .8, .5)); if (P.name) text(P.name, W * .78, H * .4, { size: 54 * u, font: 'cond', col: '#efe6d4', lw: 0, ls: 5 * u, a }); if (P.date) { const ch = Math.floor(P.date.length * clamp((t - at(P.go || 0) - 1) / .8)); text(P.date.slice(0, ch), W * .78, H * .52, { size: 72 * u, font: 'impact', col: '#f2ead9', lw: 0 }); }
  ctx.restore();
}
