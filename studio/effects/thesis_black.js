/* @effect thesis_black
   @does: the channel's thesis on black: one or two lines of large serif type arrive word by word with a short blur-in and hold dead still, one word in the accent
   @params: in, out, lines, size, go, span, hi, sub
   @uses: — (swap these ids for the new episode's own)
   @tags: thesis,ending,type,black,stillness,signature
   @born: wework a6-11/12: it rented for years and sold by the month
*/
({ t, at, p, W, H, u, ctx, params: P, clamp, lerp, text, seam, dur }) => {
  // the channel's thesis on black: one or two lines of large serif type arrive word by word (a short blur-in, no movement)
  // and then hold dead still; one word can carry the accent. params: lines (~), go, span, hi (the accented word), sub, in, out
  ctx.save(); seam(P.in || 'none', P.out || 'none'); ctx.fillStyle = '#080706'; ctx.fillRect(-W, -H, 3 * W, 3 * H);
  const L = String(P.lines).split('~'), size = (+P.size || 92) * u, lh = size * 1.25, all = L.map(l => l.split(' ')), n = all.flat().length, k = clamp((t - at(P.go || 0)) / (+P.span || 2)) * n; let idx = 0;
  all.forEach((ws, li) => { setFont(size, 'serif'); const lw = ctx.measureText(L[li]).width; let x = W / 2 - lw / 2; const y = H * .45 - (L.length - 1) * lh / 2 + li * lh;
    ws.forEach(w => { const a = clamp(k - idx), clean = w.replace(/[^A-Za-z]/g, '').toLowerCase(); ctx.save(); if (a < 1) ctx.filter = `blur(${((1 - a) * 6 * u).toFixed(1)}px)`; text(w, x, y, { size, font: 'serif', align: 'left', col: P.hi && clean === String(P.hi).toLowerCase() ? '#f2c14e' : '#f4efe4', lw: 0, a }); ctx.restore(); setFont(size, 'serif'); x += ctx.measureText(w + ' ').width; idx++; }); });
  if (P.sub) text(P.sub, W / 2, H * .45 + L.length * lh / 2 + 40 * u, { size: 44 * u, font: 'cond', col: '#a99d87', lw: 0, ls: 4 * u, a: clamp(k - n + 1) });
  ctx.restore();
}
