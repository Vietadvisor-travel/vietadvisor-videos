/* @effect choice_cards
   @does: two cards are dealt onto a real table, a picture and a word on each, one option per card; on the first word the left card lifts into the light, on the second the right one, and both then settle level, waiting for the viewer to choose
   @params: bg, a, alab, asub, b, blab, bsub, go, go2, lab, in, out
   @uses: any two photos + any background
   @tags: choice,decision,audience,dilemma,question,either-or
   @born: lego a6-14: would you have sold LEGO to the highest bidder, or lent it the money?
*/
({ t, at, p, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.bg, 0, 1) || img(P.bg), k = clamp(t / Math.max(1, dur)); if (bg) cover(bg, { z: 1.12 + .08 * k, ox: (k - .5) * .06, filter: 'brightness(.35)' });
  const t1 = at(P.go || 0), t2 = at(P.go2 || P.go || 0), cw = W * .28, ch = H * .58, kd = clamp(p(0, .7, 'out'));
  const card = (im, cx, lab, sub, lift, a) => { const y = H * .47 - lift * 30 * u; ctx.save(); ctx.translate(cx, lerp(H * 1.3, y, kd)); ctx.globalAlpha = a; ctx.shadowColor = 'rgba(0,0,0,.65)'; ctx.shadowBlur = 30 * u + lift * 30 * u; ctx.fillStyle = '#f2ece0'; ctx.fillRect(-cw / 2, -ch / 2, cw, ch); ctx.shadowColor = 'transparent';
    if (im) { const iw = cw - 30 * u, ih = ch * .58, s = Math.max(iw / im.width, ih / im.height); ctx.save(); ctx.beginPath(); ctx.rect(-iw / 2, -ch / 2 + 15 * u, iw, ih); ctx.clip(); ctx.drawImage(im, -im.width * s / 2, -ch / 2 + 15 * u + ih / 2 - im.height * s / 2, im.width * s, im.height * s); ctx.restore(); }
    text(lab, 0, ch * .22, { size: 76 * u, font: 'impact', col: '#1e1912', lw: 0, ls: 4 * u }); if (sub) text(sub, 0, ch * .36, { size: 28 * u, font: 'cond', col: '#5a4c3a', lw: 0 }); ctx.restore(); };
  const la = clamp(p(t1, .4)) - clamp(p(t2, .4)) * .6 , lb = clamp(p(t2, .4)), settle = clamp(p(t2 + 1, .6));
  card(clip(P.a, 0, 1) || img(P.a), W * .3, P.alab || '', P.asub, lerp(la, 0, settle), 1); card(clip(P.b, 0, 1) || img(P.b), W * .7, P.blab || '', P.bsub, lerp(lb, 0, settle), 1);
  text('OR', W / 2, H * .47, { size: 60 * u, font: 'impact', col: '#f2c14e', lw: 0, a: kd });
  if (P.lab) text(P.lab, W / 2, H * .1, { size: 40 * u, font: 'cond', col: '#efe4cf', lw: 0, ls: 5 * u });
  ctx.restore();
}
