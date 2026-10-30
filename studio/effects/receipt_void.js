/* @effect receipt_void
   @does: a paper receipt for a famous legend prints out line by line over a dim picture; on the word a red stamp slams across it saying what the record shows, and the receipt curls
   @params: bg, lines, stamp, go, src, in, out
   @uses: any photo
   @tags: myth,legend,fact-check,receipt,void,debunk
   @born: nike-vs-adidas a2-04: the legend says Nike paid a fine every game; ESPN found no evidence it ever paid one
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, paperDesk, rng, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.bg, 0, 1) || img(P.bg), k = clamp(t / Math.max(1, dur)); if (bg) cover(bg, { z: 1.08 + .14 * k, ox: (k - .5) * -.1, filter: `brightness(${P.dim || .38})` }); else { ctx.fillStyle = '#0d0f14'; ctx.fillRect(-W, -H, 3 * W, 3 * H); }
  const L = (P.lines || '').split('~'), w = W * .3, x = W * .5, y0 = H * .14, lh = 62 * u, kp = clamp(t / 1.6), shown = Math.floor(L.length * kp + .999);
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 30 * u; ctx.fillStyle = '#f4f1ea'; const hh = (L.length + 1) * lh * kp + 40 * u; ctx.fillRect(x - w / 2, y0, w, hh); ctx.restore();
  ctx.fillStyle = '#f4f1ea'; for (let i = 0; i < 14; i++) { ctx.beginPath(); ctx.moveTo(x - w / 2 + i * w / 14, y0 + hh); ctx.lineTo(x - w / 2 + (i + .5) * w / 14, y0 + hh + 14 * u); ctx.lineTo(x - w / 2 + (i + 1) * w / 14, y0 + hh); ctx.fill(); }
  L.slice(0, shown).forEach((s, i) => { ctx.font = `${36 * u}px "Courier New", monospace`; ctx.fillStyle = '#2a2a2a'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(s, x, y0 + 50 * u + i * lh); });
  const t0 = at(P.go || 0), ks = clamp(spring(t0, { stiff: 300, damp: 16 }), 0, 1.15); if (t > t0) { ctx.save(); ctx.translate(x, H * .62); ctx.rotate(-.06); const sc = lerp(2.2, 1, Math.min(1, ks)); ctx.scale(sc, sc); ctx.globalAlpha = clamp(ks * 1.4) * .92; ctx.strokeStyle = '#c0281e'; ctx.lineWidth = 8 * u; ctx.strokeRect(-280 * u, -60 * u, 560 * u, 120 * u); text(P.stamp || 'VOID', 0, 0, { size: 62 * u, font: 'impact', col: '#c0281e', lw: 0, ls: 4 * u }); ctx.restore(); }
  if (P.src) text(P.src, x, H * .84, { size: 36 * u, font: 'cond', col: '#e8e4dc', lw: 0, a: clamp(p(t0 + .4, .4)) });
  ctx.restore();
}
