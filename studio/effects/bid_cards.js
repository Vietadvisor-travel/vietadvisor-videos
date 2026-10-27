/* @effect bid_cards
   @does: a real report of an offer lies dim across the frame; bid cards are raised into the frame one after another on their words, each higher than the last, the earlier one dimming
   @params: in, out, doc, crop, cards
   @uses: — (swap these ids for the new episode's own)
   @tags: bid,auction,offer,buyback,numbers,escalation
   @born: wework a6-02: reported at more than 500 million, then 650 million
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, dur }) => {
  // a real report of an offer lies dim across the frame; bid cards (like an auction paddle's number) are raised into the
  // frame one after another on their words, each higher than the last, with its date and source; the earlier card stays
  // behind, dimmer. params: doc, crop, cards (value^label^word ~ …), in, out
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  ctx.fillStyle = '#12100d'; ctx.fillRect(-W, -H, 3 * W, 3 * H);
  const im = img(P.doc); if (im && im.width) { const [c0, c1, c2, c3] = String(P.crop || '0,0,1,1').split(',').map(Number), sw = (c2 - c0) * im.width, sh = (c3 - c1) * im.height, s = W * .9 / sw, pw = sw * s, ph = sh * s;
    ctx.save(); ctx.translate(W / 2, H * .3); ctx.rotate(-.02); ctx.filter = 'brightness(.62)'; ctx.fillStyle = '#f7f5ef'; ctx.fillRect(-pw / 2 - 20 * u, -ph / 2 - 16 * u, pw + 40 * u, ph + 32 * u); ctx.drawImage(im, c0 * im.width, c1 * im.height, sw, sh, -pw / 2, -ph / 2, pw, ph); ctx.restore(); }
  const cards = String(P.cards).split('~').map(s => { const [v, l, w] = s.split('^'); return { v, l, w }; }), n = cards.length;
  cards.forEach((c, i) => { const k = clamp(spring(c.w, { stiff: 140, damp: 15 }), 0, 1.06); if (k <= 0) return; const later = cards.slice(i + 1).some(d => t > at(d.w)), x = W * (n > 1 ? lerp(.3, .7, i / (n - 1)) : .5), y = H * .72 + (1 - Math.min(1, k)) * H * .5, cw = W * .3, ch = H * .3;
    ctx.save(); ctx.globalAlpha = later ? .55 : 1; ctx.translate(x, y); ctx.rotate((i - (n - 1) / 2) * .05); ctx.fillStyle = '#6d5537'; ctx.fillRect(-12 * u, ch * .3, 24 * u, H * .3); ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 30 * u; ctx.shadowOffsetY = 12 * u; ctx.fillStyle = i === n - 1 ? '#f2c14e' : '#efe6d2'; ctx.beginPath(); ctx.roundRect(-cw / 2, -ch / 2, cw, ch, 16 * u); ctx.fill(); ctx.shadowColor = 'transparent';
    text(c.v, 0, -ch * .08, { size: 110 * u, font: 'impact', col: '#1a1408', lw: 0 }); if (c.l) text(c.l, 0, ch * .3, { size: 40 * u, font: 'cond', col: '#4a3e2c', lw: 0 }); ctx.restore(); });
  ctx.restore();
}
