/* @effect said_did_scale
   @does: a beam balance over a dim picture: one pan carries what a company said, the other what can be proved it did; on each word a weight drops into its pan and the beam tips, then settles level with a question mark, the viewer's call
   @params: bg, l, r, lgo, rgo, q, in, out
   @uses: any dim plate
   @tags: scale,balance,question,ending,choice,said,did,justice
   @born: meta-cambridge-analytica-penalty a8: should a company pay for what it says, or only for what it did?
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, rng, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.bg, 0, 1) || img(P.bg); if (bg) cover(bg, { z: 1.1 + .35 * Math.min(1, t / Math.max(1, dur)), ox: (Math.min(1, t / Math.max(1, dur)) - .5) * -.24, filter: 'brightness(.5) blur(1px)' }); else { ctx.fillStyle = '#0b0d12'; ctx.fillRect(-W, -H, 3 * W, 3 * H); }
  const kl = clamp(spring(at(P.lgo || 0), { stiff: 120, damp: 9 }), 0, 1.2), kr = clamp(spring(at(P.rgo || 0), { stiff: 120, damp: 9 }), 0, 1.2), ang = (.16 * Math.min(1, kl) - .16 * Math.min(1, kr));
  const cx = W / 2, cy = H * .36, L = W * .3; ctx.strokeStyle = '#d9c9a3'; ctx.lineWidth = 10 * u; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx, H * .82); ctx.stroke(); ctx.fillStyle = '#d9c9a3'; ctx.fillRect(cx - 120 * u, H * .82, 240 * u, 18 * u);
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(ang); ctx.lineWidth = 8 * u; ctx.beginPath(); ctx.moveTo(-L, 0); ctx.lineTo(L, 0); ctx.stroke(); ctx.restore();
  [[-1, P.l, kl], [1, P.r, kr]].forEach(([s, lab, kk]) => { const px = cx + Math.cos(ang) * L * s, py = cy + Math.sin(ang) * L * s; ctx.strokeStyle = 'rgba(217,201,163,.8)'; ctx.lineWidth = 3 * u; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px - 120 * u, py + 170 * u); ctx.moveTo(px, py); ctx.lineTo(px + 120 * u, py + 170 * u); ctx.stroke();
    ctx.fillStyle = '#d9c9a3'; ctx.beginPath(); ctx.ellipse(px, py + 176 * u, 150 * u, 22 * u, 0, 0, 6.29); ctx.fill();
    if (kk > 0) { const wy = py + 150 * u - (1 - Math.min(1, kk)) * 300 * u; ctx.fillStyle = s < 0 ? '#7fb2ff' : '#ff6b5e'; ctx.fillRect(px - 70 * u, wy - 60 * u, 140 * u, 60 * u); }
    text(lab || '', px, py + 250 * u, { size: 52 * u, font: 'impact', col: s < 0 ? '#9cc4ff' : '#ff8a80', lw: 0, ls: 3 * u, a: clamp(kk * 2) }); });
  const kq = clamp(p(Math.max(at(P.lgo || 0), at(P.rgo || 0)) + .8, .5)); if (P.q) text(P.q, cx, H * .12, { size: 60 * u, font: 'cond', col: '#f2f4f8', lw: 0, ls: 3 * u, a: kq });
  ctx.restore();
}
