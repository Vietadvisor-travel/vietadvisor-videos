/* @effect tax_chain
   @does: one new brick drops into the middle of a real picture; on each named cost a heavy tag clamps onto it with a chain, and the brick sinks a little lower with every tag it has to carry
   @params: bg, chips, go, brick, lab, in, out
   @uses: lego_cut_brick_* , any photo or clip as bg
   @tags: complexity,cost,overhead,tax,burden,mechanism
   @born: lego a4-13: every new piece charges the whole system, the mould, the colour, the supplier, the shelf space
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, drop, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.bg, 0, 1) || img(P.bg); ctx.fillStyle = '#0d0b09'; ctx.fillRect(-W, -H, 3 * W, 3 * H); if (bg) cover(bg, { z: 1.06 + .12 * clamp(t / Math.max(1, dur)), filter: 'brightness(.38)' });
  const C = (P.chips || 'MOULD@mould~COLOUR@colour').split('~').map(s => s.split('@')), b = img(P.brick || 'lego_cut_brick_yellow'), t0 = at(P.go || 0);
  let sink = 0; C.forEach(([, w]) => { sink += clamp(spring(w, { stiff: 120, damp: 12 }), 0, 1.1) * H * .025; });
  const cx = W / 2, cy = drop(t0, -H * .3, H * .4, { bounce: .2, g: 3800 }) + sink, bh = H * .15;
  if (b && t > t0) { const w = bh * b.width / b.height; ctx.drawImage(b, cx - w / 2, cy - bh / 2, w, bh); }
  C.forEach(([lab, w], i) => { const k = clamp(spring(w, { stiff: 150, damp: 13 }), 0, 1.1); if (k <= 0) return; const ang = -Math.PI * .85 + i * (Math.PI * .7 / Math.max(1, C.length - 1)), R = W * .3, tx = cx + Math.cos(ang) * R * .9, ty = cy + Math.abs(Math.sin(ang)) * R * .3 + H * .02;
    const px = lerp(cx, tx, Math.min(1, k)), py = lerp(cy, ty, Math.min(1, k)); ctx.save(); ctx.strokeStyle = '#bfb6a6'; ctx.setLineDash([10 * u, 6 * u]); ctx.lineWidth = 4 * u; ctx.beginPath(); ctx.moveTo(cx, cy + bh * .3); ctx.lineTo(px, py - 30 * u); ctx.stroke(); ctx.restore();
    ctx.save(); ctx.fillStyle = '#2b2620'; ctx.strokeStyle = '#e3b23c'; ctx.lineWidth = 3 * u; const tw = lab.length * 26 * u + 50 * u; ctx.fillRect(px - tw / 2, py - 32 * u, tw, 64 * u); ctx.strokeRect(px - tw / 2, py - 32 * u, tw, 64 * u); ctx.restore(); text(lab, px, py, { size: 40 * u, font: 'cond', col: '#f3ecdc', lw: 0, ls: 3 * u }); });
  if (P.lab) text(P.lab, W / 2, H * .1, { size: 56 * u, font: 'cond', col: '#f2c14e', lw: 0, ls: 6 * u, a: clamp(p(t0 + .3, .4)) });
  ctx.restore();
}
