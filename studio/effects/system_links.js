/* @effect system_links
   @does: real footage of many separate pieces plays; on the word gold threads draw themselves between the pieces one after another, joining them into one network, and a short label sets
   @params: clip, pts, go, lab, in, out
   @uses: any clip or photo with several objects
   @tags: system,network,compatibility,links,connection,whole
   @born: lego a1-07: what LEGO added wasn't the brick, it was a system
*/
({ t, at, p, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, dur }) => {
  // pts: x,y pairs (frame fractions) joined with ~ ; links run in order and back to the first
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.clip, 0, 1) || img(P.clip), k = clamp(t / Math.max(1, dur)); if (bg) cover(bg, { z: 1.06 + .1 * k, filter: 'brightness(.8)' });
  const pts = (P.pts || '.2,.6~.4,.5~.6,.62~.8,.48').split('~').map(s => s.split(',').map(Number)).map(([x, y]) => [x * W, y * H]), t0 = at(P.go || 0), n = pts.length;
  for (let i = 0; i < n; i++) { const a = pts[i], b = pts[(i + 1) % n], kk = clamp((t - t0 - i * .18) / .35); if (kk <= 0) continue; ctx.strokeStyle = 'rgba(242,193,78,.9)'; ctx.lineWidth = 4 * u; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(lerp(a[0], b[0], kk), lerp(a[1], b[1], kk)); ctx.stroke(); }
  pts.forEach(([x, y], i) => { const kk = clamp((t - t0 - i * .18) / .25); if (kk <= 0) return; ctx.fillStyle = '#f2c14e'; ctx.beginPath(); ctx.arc(x, y, 10 * u * kk, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = 'rgba(242,193,78,.5)'; ctx.lineWidth = 3 * u; ctx.beginPath(); ctx.arc(x, y, 22 * u * kk, 0, Math.PI * 2); ctx.stroke(); });
  if (P.lab) text(P.lab, W / 2, H * .14, { size: 76 * u, font: 'impact', col: '#f6efe2', lw: 0, a: clamp(p(t0 + n * .18, .4)) });
  ctx.restore();
}
