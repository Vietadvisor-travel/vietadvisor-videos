/* @effect led_quote
   @does: dim real footage of money being counted; a black LED board hangs over it; on the word one big amber word clicks up on the board, then the verbatim quote lights word by word in amber dots as the quote voice reads it, attribution beneath
   @params: bg, head, go, q, span, by, in, out
   @uses: any clip
   @tags: quote,cash,priority,verbatim,ceo,board
   @born: lego a5-04: his first job wasn't strategy, it was cash
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.bg, 0, 1) || img(P.bg), k = clamp(t / Math.max(1, dur)); if (bg) cover(bg, { z: 1.1 + .08 * k, filter: 'brightness(.35)' });
  const bx = W * .1, by = H * .12, bw = W * .8, bh = H * .66; ctx.fillStyle = 'rgba(8,8,8,.9)'; ctx.fillRect(bx, by, bw, bh); ctx.strokeStyle = '#2a2a2a'; ctx.lineWidth = 8 * u; ctx.strokeRect(bx, by, bw, bh);
  ctx.fillStyle = 'rgba(255,170,40,.05)'; for (let x = bx + 8 * u; x < bx + bw; x += 18 * u) ctx.fillRect(x, by + 8 * u, 3 * u, bh - 16 * u); for (let y = by + 8 * u; y < by + bh; y += 18 * u) ctx.fillRect(bx + 8 * u, y, bw - 16 * u, 3 * u);
  const t0 = at(P.go || 0), kh = t > t0 ? Math.min(1.1, spring(t0, { stiff: 300, damp: 18 })) : 0, glow = (s, x, y, sz, a) => { ctx.save(); ctx.shadowColor = 'rgba(255,160,30,.9)'; ctx.shadowBlur = 18 * u; text(s, x, y, { size: sz, font: 'impact', col: `rgba(255,180,50,${a})`, lw: 0, ls: 4 * u }); ctx.restore(); };
  if (P.head && kh > 0) glow(P.head, W / 2, by + bh * .2, 110 * u * kh, 1);
  const words = (P.q || '').split(' '), kq = clamp((t - t0 - .9) / +(P.span || 6)), lit = kq > 0 ? Math.floor(words.length * kq) + 1 : 0, sz = 62 * u, xl = bx + 60 * u; ctx.font = `${sz}px Impact, "Oswald", sans-serif`; let x = xl, y = by + bh * .4;
  words.forEach((w, i) => { const ww = ctx.measureText(w + ' ').width * 1.04; if (x + ww > bx + bw - 50 * u) { x = xl; y += sz * 1.3; } ctx.save(); if (i < lit) { ctx.fillStyle = 'rgba(255,140,20,.35)'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(w, x + 2 * u, y + 2 * u); } ctx.fillStyle = i < lit ? '#ffb43a' : 'rgba(255,180,60,.1)'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(w, x, y); ctx.restore(); x += ww; });
  if (P.by) text(P.by, W / 2, by + bh + 40 * u, { size: 28 * u, font: 'cond', col: '#d9cdb8', lw: 0, a: clamp(kq * 4) });
  ctx.restore();
}
