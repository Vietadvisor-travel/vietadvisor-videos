/* @effect claim_vs_denial
   @does: two typed index cards on the desk: a claim lands with its source, then the answer lands beside it and a red line strikes the claim through; both verbatim
   @params: in, out, claim, reply, strike
   @uses: — (swap these ids for the new episode's own)
   @tags: claim,denial,quote,verbatim,contradiction,evidence
   @born: wework a6-03/04: partnering with Third Point / no commitment
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, dur }) => {
  // two typed index cards on the desk, a claim and the answer to it: the claim card lands first with its source; on its
  // word the answer card lands beside it and a red line strikes the claim through. Both quotes verbatim. params: claim
  // (text^source^word, word '-' = already on the desk), reply (text^source^word), strike (word), in, out
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  ctx.fillStyle = '#15110d'; ctx.fillRect(-W, -H, 3 * W, 3 * H); const lg = ctx.createRadialGradient(W * .5, H * .4, 0, W * .5, H * .4, W * .7); lg.addColorStop(0, 'rgba(255,214,150,.13)'); lg.addColorStop(1, 'rgba(0,0,0,.55)'); ctx.fillStyle = lg; ctx.fillRect(0, 0, W, H);
  const card = (spec, x, rot, col) => { const [q, src, w] = String(spec || '').split('^'); if (!q) return null; const k = w === '-' ? 1 : clamp(spring(w || 0, { stiff: 150, damp: 17 }), 0, 1.04); if (k <= 0) return null; const cw = W * .4, ch = H * .52, y = H * .44 - (1 - Math.min(1, k)) * H * .6;
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.shadowColor = 'rgba(0,0,0,.55)'; ctx.shadowBlur = 36 * u; ctx.shadowOffsetY = 14 * u; ctx.fillStyle = col; ctx.fillRect(-cw / 2, -ch / 2, cw, ch); ctx.shadowColor = 'transparent';
    const lines = wrap(q, 60 * u, cw * .82, 'serif'); lines.forEach((l, i) => text(l, -cw * .41, -ch * .26 + i * 76 * u, { size: 60 * u, font: 'serif', col: '#221c14', align: 'left', lw: 0 }));
    text(src, -cw * .41, ch * .36, { size: 40 * u, font: 'cond', col: '#6b604f', align: 'left', lw: 0 }); ctx.restore(); return { x, y, cw, ch, rot }; };
  const c1 = card(P.claim, W * .29, -.03, '#efe6d2'); card(P.reply, W * .71, .025, '#f6efe0');
  const sk = clamp(p(P.strike || 1e9, .5, 'inOut')); if (c1 && sk > 0) { ctx.save(); ctx.translate(c1.x, c1.y); ctx.rotate(c1.rot); ctx.strokeStyle = '#d0342c'; ctx.lineWidth = 10 * u; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-c1.cw * .42, -c1.ch * .1); ctx.lineTo(-c1.cw * .42 + c1.cw * .84 * sk, -c1.ch * .2 + c1.ch * .1 * sk); ctx.stroke(); ctx.restore(); }
  ctx.restore();
}
