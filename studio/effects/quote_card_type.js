/* @effect quote_card_type
   @does: a white statement sheet slides up over dim footage; the verbatim words type onto it as the quote voice reads them, one key phrase underlined, and the attribution sets at its foot
   @params: bg, q, go, span, hl, by, in, out
   @uses: any clip or photo
   @tags: statement,quote,verbatim,press-release,official,words
   @born: nike-vs-adidas a4-03: the Adidas statement of 25 October 2022
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, paperDesk, rng, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.bg, 0, 1) || img(P.bg), k = clamp(t / Math.max(1, dur)); if (bg) cover(bg, { z: 1.08 + .14 * k, ox: (k - .5) * -.1, filter: `brightness(${P.dim || .3})` }); else { ctx.fillStyle = '#0d0f14'; ctx.fillRect(-W, -H, 3 * W, 3 * H); }
  const t0 = at(P.go || 0), ks = clamp(p(t0 - .5, .5, 'out')), w = W * .66, h = H * .6, x = W / 2 - w / 2, y = lerp(H, H * .14, ks);
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 40 * u; ctx.fillStyle = '#f6f6f3'; ctx.fillRect(x, y, w, h); ctx.restore();
  const words = (P.q || '').split(' '), n = Math.floor(words.length * clamp((t - t0) / +(P.span || 4))), sz = 54 * u; ctx.font = `${sz}px Georgia, serif`; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; let xx = x + 60 * u, yy = y + 90 * u;
  words.forEach((wd, i) => { const ww = ctx.measureText(wd + ' ').width; if (xx + ww > x + w - 60 * u) { xx = x + 60 * u; yy += sz * 1.35; } if (i < n) { ctx.fillStyle = '#16161a'; ctx.fillText(wd, xx, yy); if (P.hl && P.hl.split(' ').includes(wd.replace(/[^a-z-]/gi, ''))) { ctx.fillStyle = '#c0281e'; ctx.fillRect(xx, yy + sz * .55, ctx.measureText(wd).width, 5 * u); } } xx += ww; });
  if (P.by) text(P.by, W / 2, y + h - 50 * u, { size: 36 * u, font: 'cond', col: '#4a4a50', lw: 0, ls: 3 * u, a: clamp(p(t0 + .4, .4)) });
  ctx.restore();
}
