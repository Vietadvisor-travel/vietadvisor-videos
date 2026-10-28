/* @effect year_ruler
   @does: the camera travels across a real photo; a wooden ruler slides in across the lower frame with years marked on its ticks, and a red pencil line runs along it from the first year to the last, ending on a short label
   @params: bg, y0, y1, go, span, lab, in, out
   @uses: lego_cut_ruler, any photo or clip
   @tags: years,duration,ruler,measure,timeline,history
   @born: lego a1-05: for its first twenty-eight years LEGO was a wood company
*/
({ t, at, p, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.bg, 0, 1) || img(P.bg), k = clamp(t / Math.max(1, dur)); if (bg) cover(bg, { z: 1.22, ox: (k - .5) * -.16, filter: 'brightness(.72)' });
  const r = img('lego_cut_ruler'), y = H * .68, x0 = W * .1, x1 = W * .9, kr = clamp(p(.1, .7));
  ctx.save(); ctx.translate(-(1 - kr) * W, 0); ctx.shadowColor = 'rgba(0,0,0,.55)'; ctx.shadowBlur = 24 * u; ctx.shadowOffsetY = 10 * u; ctx.fillStyle = '#d8b884'; ctx.fillRect(x0 - 30 * u, y - 46 * u, x1 - x0 + 60 * u, 92 * u); ctx.shadowColor = 'transparent';
  if (r) { ctx.save(); ctx.beginPath(); ctx.rect(x0 - 30 * u, y - 46 * u, x1 - x0 + 60 * u, 92 * u); ctx.clip(); ctx.globalAlpha = .55; ctx.translate((x0 + x1) / 2, y); ctx.rotate(-.58); ctx.drawImage(r, -r.width * .5, -r.height * .5); ctx.restore(); }
  const Y0 = +(P.y0 || 1932), Y1 = +(P.y1 || 1960), n = Y1 - Y0; ctx.strokeStyle = '#3b2a16'; ctx.lineWidth = 2 * u;
  for (let i = 0; i <= n; i++) { const x = lerp(x0, x1, i / n), big = (Y0 + i) % 5 === 0 || i === 0 || i === n; ctx.beginPath(); ctx.moveTo(x, y - 46 * u); ctx.lineTo(x, y - 46 * u + (big ? 34 : 16) * u); ctx.stroke(); if (big) text(String(Y0 + i), x, y + 14 * u, { size: 28 * u, font: 'cond', col: '#2b1d0e', lw: 0 }); }
  const kk = clamp(p(P.go || 0, +(P.span || 1.6), 'inOut')); if (kk > 0) { ctx.strokeStyle = '#c8322a'; ctx.lineWidth = 7 * u; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x0, y - 58 * u); ctx.lineTo(lerp(x0, x1, kk), y - 58 * u); ctx.stroke(); }
  ctx.restore(); if (P.lab) text(P.lab, W / 2, H * .5, { size: 92 * u, font: 'impact', col: '#f6efe2', lw: 0, a: clamp(p(at(P.go || 0) + +(P.span || 1.6), .4)) });
  ctx.restore();
}
