/* @effect price_path_level
   @does: a share price draws its whole path along a year ruler (rise, record, fall); on the word a dashed level runs from today's low straight back to the year it last stood there, and the gap reads as years lost
   @params: bg, pts (y0:v,…), y0, y1, low, peak, go, lab, back, in, out
   @uses: any dim plate; values 0–1 of the chart height
   @tags: stock,price,chart,history,low,level,years
   @born: nike-vs-adidas a0: an intraday low not seen in thirteen years
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, rng, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.bg, 0, 1) || img(P.bg), k = clamp(t / Math.max(1, dur)); if (bg) cover(bg, { z: 1.1 + .08 * k, ox: (k - .5) * -.08, filter: 'brightness(.25) blur(6px)' }); else { ctx.fillStyle = '#0d0f14'; ctx.fillRect(-W, -H, 3 * W, 3 * H); }
  const Y0 = +(P.y0 || 2013), Y1 = +(P.y1 || 2026), x0 = W * .1, x1 = W * .86, yT = H * .2, yB = H * .7, X = y => lerp(x0, x1, (y - Y0) / (Y1 - Y0));
  const pts = (P.pts || '2013:.1,2026:.1').split(',').map(s => s.split(':').map(Number)), kd = clamp(t / Math.min(1.6, dur * .3));
  // ruler: a tick every year, a label every few, all ≥ 40 px
  ctx.strokeStyle = 'rgba(242,244,248,.7)'; ctx.lineWidth = 3 * u; ctx.beginPath(); ctx.moveTo(x0, yB + 40 * u); ctx.lineTo(x1, yB + 40 * u); ctx.stroke();
  for (let y = Y0; y <= Y1; y++) { const x = X(y), big = y === Y0 || y === Y1 || (y - Y0) % 4 === 0; ctx.beginPath(); ctx.moveTo(x, yB + 40 * u); ctx.lineTo(x, yB + (big ? 70 : 56) * u); ctx.stroke(); if (big && y !== Y1 - 1) text(String(y), x, yB + 104 * u, { size: 44 * u, font: 'cond', col: '#e8ebf0', lw: 0 }); }
  // the path, drawn left to right
  const yZ = yB - 60 * u, P2 = pts.map(([y, v]) => [X(y), lerp(yZ, yT, v)]); let L = 0; const seg = []; for (let i = 1; i < P2.length; i++) { const d = Math.hypot(P2[i][0] - P2[i - 1][0], P2[i][1] - P2[i - 1][1]); seg.push(d); L += d; }
  let left = L * kd; ctx.strokeStyle = '#f2f4f8'; ctx.lineWidth = 6 * u; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(...P2[0]); for (let i = 1; i < P2.length && left > 0; i++) { const f = Math.min(1, left / seg[i - 1]); ctx.lineTo(lerp(P2[i - 1][0], P2[i][0], f), lerp(P2[i - 1][1], P2[i][1], f)); left -= seg[i - 1]; } ctx.stroke();
  const top = P2.reduce((a, b) => b[1] < a[1] ? b : a); if (P.peak && kd > .7) text(P.peak, top[0], top[1] - 44 * u, { size: 42 * u, font: 'cond', col: '#c9ced8', lw: 0, ls: 2 * u, a: clamp((kd - .7) * 4) });
  const end = P2[P2.length - 1], t0 = at(P.go || 0), kl = clamp(p(t0, .9, 'inOut'));
  if (kd >= 1) { ctx.fillStyle = '#ff4b3e'; ctx.beginPath(); ctx.arc(end[0], end[1], 14 * u, 0, 6.29); ctx.fill(); if (P.low) text(P.low, end[0] + 10 * u, end[1] + 50 * u, { size: 64 * u, font: 'impact', col: '#ff4b3e', lw: 0, align: 'right' }); }
  if (kl > 0) { const st = P2[0]; ctx.save(); ctx.setLineDash([18 * u, 12 * u]); ctx.strokeStyle = '#ff4b3e'; ctx.lineWidth = 5 * u; ctx.beginPath(); ctx.moveTo(end[0], end[1]); ctx.lineTo(lerp(end[0], st[0], kl), end[1]); ctx.stroke(); ctx.restore();
    ctx.fillStyle = 'rgba(255,75,62,.16)'; ctx.fillRect(st[0], end[1], (end[0] - st[0]) * kl, yB + 40 * u - end[1]); if (kl >= 1) { ctx.fillStyle = '#ff4b3e'; ctx.beginPath(); ctx.arc(st[0], end[1], 12 * u, 0, 6.29); ctx.fill(); }
    if (P.back) text(P.back, (st[0] + end[0]) / 2, end[1] - 56 * u, { size: 60 * u, font: 'impact', col: '#ff6b5e', lw: 0, ls: 4 * u, a: clamp(kl * 2 - 1) }); }
  if (P.lab) text(P.lab, W / 2, H * .1, { size: 50 * u, font: 'cond', col: '#f2f4f8', lw: 0, ls: 5 * u });
  ctx.restore();
}
