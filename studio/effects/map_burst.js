/* @effect map_burst
   @does: from a pin on a real map the camera pulls back while lines shoot out from it in every direction, one after another, and a counter runs to the number of places reached
   @params: map, x, y, n, go, lab, in, out
   @uses: any map image or clip (a globe)
   @tags: map,spread,export,countries,count,growth,lines
   @born: lego a2-01: by 1966 LEGO was sold in forty-two countries
*/
({ t, at, p, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, rng, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const m = clip(P.map, 0, 1) || img(P.map), x = +(P.x || .5), y = +(P.y || .5), k = clamp(t / Math.max(1, dur));
  ctx.fillStyle = '#0d0b09'; ctx.fillRect(-W, -H, 3 * W, 3 * H);
  if (m) { const s = Math.max(W / m.width, H / m.height) * lerp(2.4, 1.0, k * k * (3 - 2 * k)); ctx.save(); ctx.filter = 'brightness(.8) saturate(.8)'; ctx.drawImage(m, W / 2 - x * m.width * s, H / 2 - y * m.height * s, m.width * s, m.height * s); ctx.restore(); }
  const n = +(P.n || 42), t0 = at(P.go || 0), r = rng(9), cx = W / 2, cy = H / 2; let c = 0;
  for (let i = 0; i < n; i++) { const st = t0 + i * .045, a = r() * Math.PI * 2, len = (.3 + r() * .65) * W * .6, kk = clamp((t - st) / .5); if (kk <= 0) continue; c++;
    const ex = cx + Math.cos(a) * len * kk, ey = cy + Math.sin(a) * len * kk * .62; ctx.save(); ctx.strokeStyle = 'rgba(242,193,78,.75)'; ctx.lineWidth = 3 * u; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.quadraticCurveTo((cx + ex) / 2, (cy + ey) / 2 - 60 * u, ex, ey); ctx.stroke();
    if (kk >= 1) { ctx.fillStyle = '#f2c14e'; ctx.beginPath(); ctx.arc(ex, ey, 7 * u, 0, Math.PI * 2); ctx.fill(); } ctx.restore(); }
  ctx.fillStyle = '#d6332b'; ctx.beginPath(); ctx.arc(cx, cy, 14 * u, 0, Math.PI * 2); ctx.fill();
  if (t > t0) { text(String(c), W / 2, H * .2, { size: 170 * u, font: 'impact', col: '#f2c14e', lw: 0 }); if (P.lab) text(P.lab, W / 2, H * .2 + 110 * u, { size: 48 * u, font: 'cond', col: '#f6efe2', lw: 0, ls: 6 * u }); }
  ctx.restore();
}
