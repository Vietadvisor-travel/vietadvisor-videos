/* @effect ember_quote
   @does: a real photo of the speaker stands as a print on the left; the verbatim words light up one by one on the right as the quote voice reads them, while embers rise from the bottom of the frame and the light warms
   @params: pic, q, go, span, name, src, fire, in, out
   @uses: a portrait + an embers/sparks clip
   @tags: quote,warning,crisis,fire,burning-platform,verbatim
   @born: lego a3-04: Knudstorp's June 2003 warning, "on a burning platform"
*/
({ t, at, p, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, paperDesk, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none'); ctx.fillStyle = '#0c0907'; ctx.fillRect(-W, -H, 3 * W, 3 * H);
  const t0 = at(P.go || 0), span = +(P.span || 6), kq = clamp((t - t0) / span), f = clip(P.fire, 0, 1);
  if (f) { ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = .35 + .5 * kq; const s = Math.max(W / f.width, H / f.height); ctx.drawImage(f, W / 2 - f.width * s / 2, H - f.height * s, f.width * s, f.height * s); ctx.restore(); }
  const g = ctx.createRadialGradient(W * .5, H * 1.1, 0, W * .5, H * 1.1, H * 1.1); g.addColorStop(0, `rgba(255,110,30,${(.12 + .2 * kq).toFixed(2)})`); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const im = img(P.pic); if (im) { const w = W * .25, h = Math.min(H * .62, w * im.height / im.width), k = clamp(t / Math.max(1, dur)); ctx.save(); ctx.translate(W * .2, H * .4 - k * 10 * u); ctx.rotate(-.02); ctx.fillStyle = '#efe8da'; ctx.shadowColor = 'rgba(0,0,0,.7)'; ctx.shadowBlur = 30 * u; ctx.fillRect(-w / 2 - 12 * u, -h / 2 - 12 * u, w + 24 * u, h + 24 * u); ctx.shadowColor = 'transparent'; const sc = Math.max(w / im.width, h / im.height); ctx.beginPath(); ctx.rect(-w / 2, -h / 2, w, h); ctx.clip(); ctx.drawImage(im, -im.width * sc / 2, -h / 2, im.width * sc, im.height * sc); ctx.restore();
    if (P.name) text(P.name, W * .2, H * .4 + h / 2 + 60 * u, { size: 34 * u, font: 'cond', col: '#f2c14e', lw: 0, ls: 3 * u }); }
  const words = (P.q || '').split(' '), sz = 58 * u, mw = W * .52, xl = W * .39; ctx.font = `${sz}px Georgia, serif`; let x = xl, y = H * .2, lit = Math.floor(words.length * kq) + (kq > 0 ? 1 : 0);
  words.forEach((w, i) => { const ww = ctx.measureText(w + ' ').width; if (x + ww > xl + mw) { x = xl; y += sz * 1.35; } ctx.fillStyle = i < lit ? '#fbf3e3' : 'rgba(251,243,227,.22)'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(w, x, y); x += ww; });
  if (P.src) text(P.src, xl + mw / 2, Math.min(H * .84, y + 80 * u), { size: 28 * u, font: 'cond', col: '#bfb39e', lw: 0 });
  ctx.restore();
}
