/* @effect gift_tag_flip
   @does: over real footage a gift tag hangs on its string with one word on it; on the word the tag spins round on the string and its back reads what it really was, with its terms
   @params: clip, front, back, terms, go, in, out
   @uses: any clip or photo
   @tags: loan,gift,terms,reversal,tag,money
   @born: lego a5-07: not a gift, a loan, with interest, due in 2011
*/
({ t, at, p, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.clip, 0, 1) || img(P.clip); if (bg) cover(bg, { z: 1.05 + .1 * clamp(t / Math.max(1, dur)), filter: 'brightness(.5)' });
  const k = clamp(p(P.go || 0, .9, 'inOut')), ang = k * Math.PI, sx = Math.cos(ang), back = sx < 0, sway = Math.sin(t * 2.2) * .04, w = W * .3, h = H * .44, cx = W / 2, cy = H * .5;
  ctx.save(); ctx.strokeStyle = '#efe6d2'; ctx.lineWidth = 3 * u; ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, cy - h / 2); ctx.stroke(); ctx.translate(cx, cy - h / 2); ctx.rotate(sway); ctx.scale(Math.max(.02, Math.abs(sx)), 1);
  ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 30 * u; ctx.fillStyle = back ? '#f2ead9' : '#c8322a'; ctx.beginPath(); ctx.moveTo(-w / 2 + 40 * u, 0); ctx.lineTo(w / 2 - 40 * u, 0); ctx.lineTo(w / 2, 50 * u); ctx.lineTo(w / 2, h); ctx.lineTo(-w / 2, h); ctx.lineTo(-w / 2, 50 * u); ctx.closePath(); ctx.fill(); ctx.shadowColor = 'transparent';
  ctx.fillStyle = '#1b1712'; ctx.beginPath(); ctx.arc(0, 34 * u, 10 * u, 0, Math.PI * 2); ctx.fill();
  if (!back) text(P.front || 'GIFT', 0, h * .52, { size: 120 * u, font: 'impact', col: '#f6efe2', lw: 0 }); else { text(P.back || 'LOAN', 0, h * .38, { size: 120 * u, font: 'impact', col: '#c8322a', lw: 0 }); (P.terms || '').split('~').forEach((s, i) => text(s, 0, h * .6 + i * 52 * u, { size: 38 * u, font: 'cond', col: '#2a2219', lw: 0, ls: 2 * u })); }
  ctx.restore(); ctx.restore();
}
