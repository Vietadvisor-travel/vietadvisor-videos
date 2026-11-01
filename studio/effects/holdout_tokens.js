/* @effect holdout_tokens
   @does: a row of state seals waits beside a settlement on the desk; on the word they slide one after another onto the paper and it is stamped signed, while one seal, named, stays out, lights gold and moves the other way toward a jury box
   @params: bg, n, hold, doc, go, go2, lab, jury, in, out
   @uses: any dim plate
   @tags: settlement,holdout,refuse,states,jury,one-against-many,signature
   @born: meta-cambridge-analytica-penalty a5: other states signed a settlement; New Mexico took its case to a jury
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, rng, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.bg, 0, 1) || img(P.bg), k = clamp(t / Math.max(1, dur)); if (bg) cover(bg, { z: 1.08, filter: 'brightness(.32) blur(2px)' }); else { ctx.fillStyle = '#0b0d12'; ctx.fillRect(-W, -H, 3 * W, 3 * H); }
  const n = +(P.n || 9), t0 = at(P.go || 0), t1 = at(P.go2 || 0) || t0 + 1.6, dx = W * .3, dy = H * .52, dw = W * .3, dh = H * .46;
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 30 * u; ctx.fillStyle = '#f2ead9'; ctx.fillRect(dx - dw / 2, dy - dh / 2, dw, dh); ctx.restore();
  text('SETTLEMENT', dx, dy - dh / 2 + 60 * u, { size: 52 * u, font: 'impact', col: '#1c1c20', lw: 0, ls: 4 * u }); text(P.doc || '', dx, dy - dh / 2 + 112 * u, { size: 40 * u, font: 'cond', col: '#4a4a50', lw: 0 });
  for (let i = 0; i < 6; i++) { ctx.fillStyle = 'rgba(28,28,32,.2)'; ctx.fillRect(dx - dw * .4, dy - dh * .12 + i * 30 * u, dw * .8, 4 * u); }
  const jx = W * .78, jy = H * .52; ctx.strokeStyle = 'rgba(242,193,78,.8)'; ctx.lineWidth = 4 * u; ctx.setLineDash([14 * u, 10 * u]); ctx.strokeRect(jx - 170 * u, jy - 130 * u, 340 * u, 260 * u); ctx.setLineDash([]); text(P.jury || 'JURY', jx, jy - 160 * u, { size: 48 * u, font: 'impact', col: '#f2c14e', lw: 0, ls: 4 * u });
  const seal = (x, y, col, lab, glow) => { if (glow) { const g = ctx.createRadialGradient(x, y, 10 * u, x, y, 90 * u); g.addColorStop(0, 'rgba(242,193,78,.5)'); g.addColorStop(1, 'rgba(242,193,78,0)'); ctx.fillStyle = g; ctx.fillRect(x - 90 * u, y - 90 * u, 180 * u, 180 * u); } ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, 34 * u, 0, 6.29); ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 3 * u; ctx.stroke(); if (lab) text(lab, x, y + 66 * u, { size: 40 * u, font: 'cond', col: '#f2c14e', lw: 0, ls: 3 * u }); };
  for (let i = 0; i < n; i++) { const sx = W * (.12 + i * .06), sy = H * .76, ki = clamp((t - t0 - i * .18) / .5), ex = dx + ((i % 5) - 2) * 70 * u, ey = dy + dh * .3 + Math.floor(i / 5) * 60 * u; seal(lerp(sx, ex, ki), lerp(sy, ey, ki) - Math.sin(ki * 3.14) * 80 * u, '#6d7380', '', false); }
  const kh = clamp(p(t1, 1.0, 'inOut')), hx = lerp(W * (.12 + n * .06), jx, kh), hy = lerp(H * .76, jy, kh); seal(hx, hy, kh > 0 ? '#f2c14e' : '#6d7380', P.hold || 'NEW MEXICO', kh > 0);
  const kst = clamp(spring(t0 + n * .18 + .3, { stiff: 300, damp: 16 }), 0, 1.15); if (t > t0 + n * .18 + .3) { ctx.save(); ctx.translate(dx, dy + dh * .02); ctx.rotate(-.12); ctx.scale(lerp(2, 1, Math.min(1, kst)), lerp(2, 1, Math.min(1, kst))); ctx.strokeStyle = '#2f6f3e'; ctx.lineWidth = 7 * u; ctx.strokeRect(-150 * u, -46 * u, 300 * u, 92 * u); text('SIGNED', 0, 2 * u, { size: 64 * u, font: 'impact', col: '#2f6f3e', lw: 0, ls: 6 * u }); ctx.restore(); }
  if (P.lab) text(P.lab, W / 2, H * .1, { size: 56 * u, font: 'cond', col: '#f2f4f8', lw: 0, ls: 4 * u });
  ctx.restore();
}
