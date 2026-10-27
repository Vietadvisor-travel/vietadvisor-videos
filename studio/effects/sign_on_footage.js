/* @effect sign_on_footage
   @does: real footage of a thing plays; on the word a physical placard on a post is planted into the scene from below and settles with a spring, carrying a short label (FOR SALE, CLOSED…) and a date under it
   @params: clip, sign, sub, go, x, y, in, out
   @uses: any clip or photo id
   @tags: sign,placard,for-sale,label,footage,literal
   @born: wework a3-18: the same day, the company put the jet up for sale
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const im = clip(P.clip, 0, 1) || img(P.clip); if (im) cover(im, { z: 1.04 + .05 * clamp(t / dur), filter: 'brightness(.9)' });
  const k = clamp(spring(P.go || 0, { stiff: 160, damp: 12 }), 0, 1.15), x = (+P.x || .7) * W, y = (+P.y || .42) * H + (1 - k) * H * .7, sw = W * .24, sh = H * .2;
  if (k > 0) { ctx.save(); ctx.translate(x, y); ctx.rotate((1 - Math.min(1, k)) * .1 + Math.sin(Math.max(0, t - at(P.go || 0)) * 9) * .03 * Math.exp(-3 * Math.max(0, t - at(P.go || 0))));
    ctx.fillStyle = '#6d5537'; ctx.fillRect(-9 * u, sh / 2, 18 * u, H); ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 30 * u; ctx.shadowOffsetY = 12 * u; ctx.fillStyle = '#d0342c'; ctx.fillRect(-sw / 2, -sh / 2, sw, sh); ctx.shadowColor = 'transparent'; ctx.fillStyle = '#f7f1e6'; ctx.fillRect(-sw / 2 + 12 * u, -sh / 2 + 12 * u, sw - 24 * u, sh - 24 * u);
    text(P.sign || 'FOR SALE', 0, -sh * .1, { size: 84 * u, font: 'impact', col: '#d0342c', lw: 0 }); if (P.sub) text(P.sub, 0, sh * .27, { size: 40 * u, font: 'cond', col: '#3a2f22', lw: 0 }); ctx.restore(); }
  ctx.restore();
}
