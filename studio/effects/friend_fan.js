/* @effect friend_fan
   @does: one person installs an app: a single lit dot in the middle of the frame; on the word, lines shoot out to a ring of friends that light one after another, then fainter lines to their friends, so one consent visibly becomes many
   @params: bg, n, go, go2, lab, sub, ulab, in, out
   @uses: any dim plate
   @tags: network,friends,permission,data,spread,consent,graph
   @born: meta-cambridge-analytica-penalty a1: an app could read the friends of the person who installed it
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, rng, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.bg, 0, 1) || img(P.bg); if (bg) cover(bg, { z: 1.08, filter: 'brightness(.3) blur(3px)' }); else { ctx.fillStyle = '#0b0d12'; ctx.fillRect(-W, -H, 3 * W, 3 * H); }
  const cx = W / 2, cy = H * .52, n = +(P.n || 14), t0 = at(P.go || 0), t1 = at(P.go2 || 0) || t0 + 1.4, R1 = H * .22, R2 = H * .36, r = rng(9), k = clamp(t / Math.max(1, dur));
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(k * .25); ctx.translate(-cx, -cy);
  for (let i = 0; i < n; i++) { const a = i / n * 6.283, x = cx + Math.cos(a) * R1, y = cy + Math.sin(a) * R1, ki = clamp((t - t0 - i * .07) / .3);
    for (let j = 0; j < 4; j++) { const b = a + (j - 1.5) * .12, x2 = cx + Math.cos(b) * (R2 + r() * 50 * u), y2 = cy + Math.sin(b) * (R2 + r() * 50 * u), kj = clamp((t - t1 - (i * 4 + j) * .015) / .3); if (kj > 0) { ctx.strokeStyle = `rgba(127,178,255,${.25 * kj})`; ctx.lineWidth = 2 * u; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(lerp(x, x2, kj), lerp(y, y2, kj)); ctx.stroke(); ctx.fillStyle = `rgba(127,178,255,${.55 * kj})`; ctx.beginPath(); ctx.arc(x2, y2, 7 * u, 0, 6.29); ctx.fill(); } }
    if (ki > 0) { ctx.strokeStyle = `rgba(242,193,78,${.8 * ki})`; ctx.lineWidth = 3 * u; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(lerp(cx, x, ki), lerp(cy, y, ki)); ctx.stroke(); }
    ctx.fillStyle = ki > 0 ? '#f2c14e' : 'rgba(200,205,215,.35)'; ctx.beginPath(); ctx.arc(x, y, 14 * u, 0, 6.29); ctx.fill(); }
  ctx.restore();
  ctx.fillStyle = '#ff6b5e'; ctx.beginPath(); ctx.arc(cx, cy, 26 * u, 0, 6.29); ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 4 * u; ctx.stroke();
  if (P.ulab) text(P.ulab, cx, cy + 62 * u, { size: 40 * u, font: 'cond', col: '#ffd0c8', lw: 0, ls: 3 * u });
  if (P.lab) text(P.lab, W / 2, H * .1, { size: 56 * u, font: 'cond', col: '#f2f4f8', lw: 0, ls: 5 * u, a: clamp(p(t0 + .3, .4)) });
  if (P.sub) text(P.sub, W / 2, H * .1 + 62 * u, { size: 40 * u, font: 'cond', col: '#c9ced8', lw: 0, a: clamp(p(t1, .4)) });
  ctx.restore();
}
