/* @effect folder_reveal
   @does: a closed kraft folder marked PRIVATE lies on the desk; on the word its flap lifts and a real document slides out of it toward the camera, so a private record becomes public
   @params: doc, crop, stamp, go, in, out
   @uses: any document id
   @tags: private,public,disclosure,folder,document,reveal
   @born: wework a2-09: one day, someone else gets to read it
*/
({ t, at, p, W, H, u, img, ctx, params: P, clamp, lerp, text, seam, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  ctx.fillStyle = '#15110d'; ctx.fillRect(-W, -H, 3 * W, 3 * H); const lg = ctx.createRadialGradient(W * .5, H * .45, 0, W * .5, H * .45, W * .7); lg.addColorStop(0, 'rgba(255,214,150,.14)'); lg.addColorStop(1, 'rgba(0,0,0,.55)'); ctx.fillStyle = lg; ctx.fillRect(0, 0, W, H);
  const fw = W * .5, fh = H * .56, fx = W / 2 - fw / 2, fy = H * .22, k = clamp(p(P.go || 0, 1.2, 'inOut')), im = img(P.doc);
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.55)'; ctx.shadowBlur = 40 * u; ctx.shadowOffsetY = 16 * u; ctx.fillStyle = '#b48a55'; ctx.fillRect(fx, fy, fw, fh); ctx.restore();
  if (im && im.width && k > 0) { const [c0, c1, c2, c3] = String(P.crop || '0,0,1,1').split(',').map(Number), sw = (c2 - c0) * im.width, sh = (c3 - c1) * im.height, s = Math.min(fw * .9 / sw, fh * .9 / sh) * lerp(1, 1.35, k), pw = sw * s, ph = sh * s, y = lerp(fy + fh * .5, H * .44, k);
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 30 * u; ctx.fillStyle = '#f7f5ef'; ctx.fillRect(W / 2 - pw / 2 - 10 * u, y - ph / 2 - 10 * u, pw + 20 * u, ph + 20 * u); ctx.shadowColor = 'transparent'; ctx.drawImage(im, c0 * im.width, c1 * im.height, sw, sh, W / 2 - pw / 2, y - ph / 2, pw, ph); ctx.restore(); }
  const fl = clamp(k * 1.6); ctx.save(); ctx.globalAlpha = 1 - fl; ctx.fillStyle = '#c69a62'; ctx.fillRect(fx, fy, fw, fh); ctx.strokeStyle = '#8a1e1a'; ctx.lineWidth = 6 * u; ctx.strokeRect(W / 2 - W * .12, H * .44 - H * .07, W * .24, H * .14); text(P.stamp || 'PRIVATE', W / 2, H * .44, { size: 84 * u, font: 'impact', col: '#8a1e1a', lw: 0 }); ctx.restore();
  ctx.restore();
}
