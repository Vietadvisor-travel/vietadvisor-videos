/* @effect post_quote
   @does: the real header of a published post sits at the top as evidence; below it the verbatim words light from grey to ink as the quote voice reads them, with the attribution and a voiced note
   @params: in, out, bg, doc, crop, size, q, go, span, by
   @uses: — (swap these ids for the new episode's own)
   @tags: quote,post,blog,verbatim,voiced,attribution
   @born: wework a5-13: Adam is a visionary leader who revolutionized … commercial real estate
*/
({ t, at, p, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, dur }) => {
  // the real header of a published post or article (its masthead, headline, byline and date) sits at the top as the
  // evidence; below it the verbatim words light from grey to ink as the quote voice reads them, with a VOICED tag and the
  // attribution; real footage of the subject plays dim behind. params: doc, crop (x0,y0,x1,y1), bg, q, go, span, by, size, in, out
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.bg, 0, 1) || img(P.bg); ctx.fillStyle = '#0d0c0b'; ctx.fillRect(-W, -H, 3 * W, 3 * H);
  if (bg && bg.width) { const s = Math.max(W / bg.width, H / bg.height) * (1.04 + .04 * clamp(t / dur)); ctx.save(); ctx.filter = 'blur(6px) brightness(.32)'; ctx.drawImage(bg, W / 2 - bg.width * s / 2, H / 2 - bg.height * s / 2, bg.width * s, bg.height * s); ctx.restore(); }
  const im = img(P.doc); let yq = H * .4; if (im && im.width) { const [c0, c1, c2, c3] = String(P.crop || '0,0,1,.35').split(',').map(Number), sw = (c2 - c0) * im.width, sh = (c3 - c1) * im.height, s = Math.min(W * .62 / sw, H * .3 / sh), pw = sw * s, ph = sh * s, x0 = W / 2 - pw / 2, y0 = H * .08, a = clamp(t / .5);
    ctx.save(); ctx.globalAlpha = a; ctx.shadowColor = 'rgba(0,0,0,.55)'; ctx.shadowBlur = 30 * u; ctx.shadowOffsetY = 12 * u; ctx.fillStyle = '#f7f5ef'; ctx.fillRect(x0 - 16 * u, y0 - 12 * u, pw + 32 * u, ph + 24 * u); ctx.shadowColor = 'transparent'; ctx.drawImage(im, c0 * im.width, c1 * im.height, sw, sh, x0, y0, pw, ph); ctx.restore(); yq = y0 + ph + H * .12; }
  const size = (+P.size || 54) * u, maxW = W * .78, lines = wrap(String(P.q), size, maxW, 'serif'), words = lines.map(l => l.split(' ')), n = words.flat().length, lit = clamp((t - at(P.go || 0)) / (+P.span || 4)) * n, lh = size * 1.3; let idx = 0;
  words.forEach((ws, li) => { setFont(size, 'serif'); const lw = ctx.measureText(lines[li]).width; let x = W / 2 - lw / 2; ws.forEach(w => { const on = clamp(lit - idx), c = Math.round(lerp(90, 244, on)); text(w, x, yq + li * lh, { size, font: 'serif', align: 'left', col: `rgb(${c},${Math.round(lerp(86, 237, on))},${Math.round(lerp(78, 222, on))})`, lw: 0 }); setFont(size, 'serif'); x += ctx.measureText(w + ' ').width; idx++; }); });
  const ba = clamp(p(P.go || 0, .5)); if (P.by) text(P.by, W / 2, yq + lines.length * lh + 20 * u, { size: 40 * u, font: 'cond', col: '#d6b25e', lw: 0, ls: 3 * u, a: ba });
  ctx.restore();
}
