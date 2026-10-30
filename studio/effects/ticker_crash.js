/* @effect ticker_crash
   @does: dim market screens behind; a price line draws itself left to right across the frame, wobbles, then plunges; on the word a red price tag snaps to the lowest point and a date line sets under it
   @params: bg, pts, low, go, lab, sub, in, out
   @uses: any finance clip
   @tags: stock,crash,price,low,market,chart
   @born: nike-vs-adidas a0-01: Nike stock touched $31.97 on 2 October 2026
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, paperDesk, rng, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.bg, 0, 1) || img(P.bg), k = clamp(t / Math.max(1, dur)); if (bg) cover(bg, { z: 1.08 + .14 * k, ox: (k - .5) * -.1, filter: `brightness(${P.dim || .38})` }); else { ctx.fillStyle = '#0d0f14'; ctx.fillRect(-W, -H, 3 * W, 3 * H); }
  const pts = (P.pts || '.8,.7,.75,.62,.55,.5,.42,.3,.12').split(',').map(Number), n = pts.length, x0 = W * .1, x1 = W * .86, y0 = H * .22, y1 = H * .78, kd = clamp(t / Math.max(.8, Math.min(2.4, dur * .45)));
  ctx.strokeStyle = 'rgba(255,255,255,.12)'; ctx.lineWidth = 2 * u; for (let i = 0; i < 5; i++) { const y = lerp(y0, y1, i / 4); ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke(); }
  const m = Math.max(2, Math.floor(kd * (n - 1) * 10) + 1); ctx.strokeStyle = '#ff4b3e'; ctx.lineWidth = 7 * u; ctx.lineJoin = 'round'; ctx.beginPath();
  for (let j = 0; j < m; j++) { const f = j / ((n - 1) * 10), i = Math.min(n - 2, Math.floor(f * (n - 1))), r = f * (n - 1) - i, v = lerp(pts[i], pts[i + 1], r), x = lerp(x0, x1, f), y = lerp(y1, y0, v); j ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
  const t0 = at(P.go || 0), ks = clamp(spring(t0, { stiff: 260, damp: 16 }), 0, 1.1); if (t > t0 && kd >= 1) { const x = x1, y = lerp(y1, y0, pts[n - 1]); ctx.fillStyle = '#ff4b3e'; ctx.beginPath(); ctx.arc(x, y, 14 * u, 0, 6.29); ctx.fill();
    ctx.save(); ctx.translate(x - 40 * u, y - 110 * u); ctx.scale(ks, ks); ctx.fillStyle = '#ff4b3e'; ctx.fillRect(-260 * u, -60 * u, 300 * u, 120 * u); text(P.low || '', -110 * u, 4 * u, { size: 84 * u, font: 'impact', col: '#fff', lw: 0 }); ctx.restore(); }
  if (P.lab) text(P.lab, W * .48, H * .12, { size: 46 * u, font: 'cond', col: '#f2f4f8', lw: 0, ls: 5 * u }); if (P.sub) text(P.sub, W * .48, H * .86, { size: 36 * u, font: 'cond', col: '#c9ced8', lw: 0, a: clamp(p(t0 + .4, .4)) });
  ctx.restore();
}
