/* @effect book_open
   @does: a real book cover lies on a dark desk under the lamp; on the word the cover swings open on its spine and the right-hand page shows a span of years written in pencil, a ribbon marker dropping across it
   @params: doc, go, line1, line2, src, in, out
   @uses: any book cover image
   @tags: book,study,research,years,evidence,analysis
   @born: lego a4-07: one study later did the maths for 1993 to 2002
*/
({ t, at, p, W, H, u, img, ctx, params: P, clamp, lerp, text, seam, paperDesk, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none'); { const _c = clamp(t / Math.max(1, dur)), _s = 1.01 + .06 * _c * _c * (3 - 2 * _c); ctx.translate(W / 2, H / 2); ctx.scale(_s, _s); ctx.translate(-W / 2 + (_c - .5) * -W * .03, -H / 2); } paperDesk({ lx: .5, ly: .45 });
  const c = img(P.doc), k = clamp(t / Math.max(1, dur)), t0 = at(P.go || 0), ko = clamp(p(t0, 1, 'inOut')), ch = H * .64, cw = c ? Math.min(W * .3, ch * c.width / c.height) : W * .3, sx = lerp(W / 2 - cw / 2, W / 2, ko), y = H * .44 - ch / 2 - k * 8 * u;
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 40 * u; ctx.shadowOffsetY = 18 * u; ctx.fillStyle = '#f1eadb'; ctx.fillRect(sx, y + 4 * u, cw, ch - 8 * u); ctx.restore();
  if (ko > .4) { const a = clamp((ko - .4) / .4); ctx.strokeStyle = 'rgba(90,80,70,.2)'; ctx.lineWidth = 2 * u; for (let i = 0; i < 12; i++) { ctx.beginPath(); ctx.moveTo(sx + cw * .1, y + ch * (.2 + i * .055)); ctx.lineTo(sx + cw * .9, y + ch * (.2 + i * .055)); ctx.stroke(); }
    if (P.line1) text(P.line1, sx + cw / 2, y + ch * .36, { size: 76 * u, font: 'hand', col: '#3a2f22', lw: 0, a }); if (P.line2) text(P.line2, sx + cw / 2, y + ch * .55, { size: 46 * u, font: 'hand', col: '#9b2a20', lw: 0, a: clamp(a * 2 - 1) });
    ctx.fillStyle = '#9b2a20'; ctx.fillRect(sx + cw * .78, y - 10 * u, 18 * u, ch * .75 * a); }
  const ang = ko * Math.PI, sxk = Math.cos(ang); if (c) { ctx.save(); ctx.translate(sx, y); ctx.scale(sxk, 1); if (sxk >= 0) ctx.drawImage(c, 0, 0, cw, ch); else { ctx.fillStyle = '#2b2622'; ctx.fillRect(0, 0, cw, ch); } ctx.restore(); }
  if (P.src) text(P.src, W / 2, H * .79, { size: 28 * u, font: 'cond', col: '#d9cdb8', lw: 0, a: clamp(p(t0 + .8, .4)) });
  ctx.restore();
}
