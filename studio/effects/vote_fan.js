/* @effect vote_fan
   @does: voting power as cards: one ordinary share holds one ballot; the founder's share fans out into N ballot cards on the word
   @params: in, out, bg, n, llab, go, rlab, lab
   @uses: — (swap these ids for the new episode's own)
   @tags: governance,votes,control,shares,founder,cards
   @born: wework a3-13: Neumann's shares carried twenty votes each
*/
({ t, at, p, spring, stagger, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, dur }) => {
  // voting power as cards in a hand: on the left one ordinary share card holds one ballot; on the right the founder's share
  // card fans out into N ballot cards on the word, the count setting above them. params: bg, n, go, lab, rlab, llab, in, out
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.bg, 0, 1) || img(P.bg); ctx.fillStyle = '#0c0b0a'; ctx.fillRect(-W, -H, 3 * W, 3 * H);
  if (bg && bg.width) { const s = Math.max(W / bg.width, H / bg.height) * (1.04 + .03 * clamp(t / dur)); ctx.save(); ctx.filter = 'blur(7px) brightness(.35)'; ctx.drawImage(bg, W / 2 - bg.width * s / 2, H / 2 - bg.height * s / 2, bg.width * s, bg.height * s); ctx.restore(); }
  const n = +(P.n || 20), cw = W * .11, ch = cw * 1.45, card = (x, y, rot, col, lab, a = 1) => { ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(rot); ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 16 * u; ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(-cw / 2, -ch, cw, ch, 8 * u); ctx.fill(); ctx.shadowColor = 'transparent'; ctx.strokeStyle = 'rgba(0,0,0,.3)'; ctx.lineWidth = 2 * u; ctx.stroke(); if (lab) text(lab, 0, -ch * .5, { size: 48 * u, font: 'impact', col: '#1c1812', lw: 0 }); ctx.restore(); };
  const a0 = clamp(t / .5); card(W * .24, H * .74, 0, '#efe6d2', '1', a0); text(P.llab || 'ONE ORDINARY SHARE', W * .24, H * .29, { size: 44 * u, font: 'cond', col: '#efe6d2', lw: 0, a: a0 });
  for (let i = 0; i < n; i++) { const k = stagger(i, n, P.go || 0, .7, .45), ang = lerp(0, (i / (n - 1) - .5) * 2.1, k); card(W * .66, H * .74, ang, i === n - 1 ? '#f2c14e' : '#e8c26a', i === n - 1 && k > .9 ? String(n) : i === 0 && k < .1 ? '1' : '', i === 0 ? a0 : clamp(k * 3)); }
  text(P.rlab || "THE FOUNDER'S SHARE", W * .66, H * .29, { size: 44 * u, font: 'cond', col: '#f2c14e', lw: 0, a: a0 });
  const la = clamp(p(P.go || 0, .5, 'out')); if (P.lab) text(P.lab, W * .5, H * .15, { size: 84 * u, font: 'impact', col: '#f2c14e', lw: 0, a: la });
  ctx.restore();
}
