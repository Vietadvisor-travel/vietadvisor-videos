/* @effect price_pencil
   @does: the camera drifts across a real photo; on the word a pencil enters and writes a price across the picture in graphite, then rings it, and a short source line sets under it
   @params: pic, word, go, x, y, size, lab, src, in, out
   @uses: lego_cut_pencil + any photo
   @tags: price,valuation,sale,offer,advice,pencil
   @born: lego a3-12: the bankers recommended selling LEGO for about 1.7 billion dollars
*/
({ t, at, p, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.pic, 0, 1) || img(P.pic), k = clamp(t / Math.max(1, dur)); if (bg) cover(bg, { lock: 1, z: 1.15 + .08 * k, ox: (k - .5) * -.08, filter: 'brightness(.62)' });
  const t0 = at(P.go || 0), kw = clamp((t - t0) / 1.1), x = (+P.x || .5) * W, y = (+P.y || .45) * H, sz = (+P.size || 170) * u, s = P.word || '';
  ctx.font = `${sz}px "Patrick Hand", "Comic Sans MS", cursive`; const fw = ctx.measureText(s).width, x0 = x - fw / 2;
  if (kw > 0) { ctx.save(); ctx.beginPath(); ctx.rect(x0 - 20 * u, y - sz, (fw + 40 * u) * kw, sz * 2); ctx.clip(); text(s, x, y, { size: sz, font: 'hand', col: 'rgba(245,240,230,.95)', lw: 0 }); ctx.restore(); }
  const kr = clamp((t - t0 - 1.1) / .6); if (kr > 0) { ctx.strokeStyle = 'rgba(245,240,230,.9)'; ctx.lineWidth = 5 * u; ctx.beginPath(); ctx.ellipse(x, y, fw * .62, sz * .62, -.05, -1.6, -1.6 + 6.4 * kr); ctx.stroke(); }
  const pc = img('lego_cut_pencil'); if (pc && kw > 0 && t < t0 + 2.2) { const px = kr > 0 ? x + Math.cos(-1.6 + 6.4 * kr) * fw * .62 : x0 + fw * kw, py = kr > 0 ? y + Math.sin(-1.6 + 6.4 * kr) * sz * .62 : y + Math.sin(t * 30) * 10 * u, pw = W * .3, ph = pw * pc.height / pc.width; ctx.drawImage(pc, px - .035 * pw, py - .01 * ph, pw, ph); }
  const la = clamp(p(t0 + 1.3, .4)); if (P.lab) text(P.lab, W / 2, H * .12, { size: 54 * u, font: 'cond', col: '#f6efe2', lw: 0, ls: 6 * u, a: la }); if (P.src) text(P.src, W / 2, H * .82, { size: 38 * u, font: 'cond', col: '#f3ead8', lw: 0, a: la });
  ctx.restore();
}
