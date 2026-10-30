/* @effect bar_breaks_line
   @does: a real photo dim behind; a dashed line marks a round threshold; on the word one bar rises from the floor, cracks straight through the dashed line, and the figure on top counts up and locks
   @params: bg, val, line, go, unit, lab, sub, in, out
   @uses: any photo
   @tags: record,threshold,profit,milestone,first,breakthrough
   @born: nike-vs-adidas a0-03: Adidas made EUR 1,008M of operating profit, its first billion-euro quarter
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, paperDesk, rng, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.bg, 0, 1) || img(P.bg), k = clamp(t / Math.max(1, dur)); if (bg) cover(bg, { z: 1.08 + .14 * k, ox: (k - .5) * -.1, filter: `brightness(${P.dim || .38})` }); else { ctx.fillStyle = '#0d0f14'; ctx.fillRect(-W, -H, 3 * W, 3 * H); }
  const v = +(P.val || 1008), L = +(P.line || 1000), mx = Math.max(v, L) * 1.25, t0 = at(P.go || 0), kv = P.nogrow ? 1 : clamp(p(t0, .9, 'out')), base = H * .8, top = H * .2, bx = P.b2lab ? W * .36 : W * .5, bw = W * .14, yl = lerp(base, top, L / mx), yv = lerp(base, top, v / mx * kv);
  ctx.setLineDash([16 * u, 12 * u]); ctx.strokeStyle = '#f2f4f8'; ctx.lineWidth = 4 * u; ctx.beginPath(); ctx.moveTo(W * .2, yl); ctx.lineTo(W * .8, yl); ctx.stroke(); ctx.setLineDash([]);
  text((P.unit || '') + L.toLocaleString('en-US') + (P.suf || ''), W * .76, yl - 30 * u, { size: 34 * u, font: 'cond', col: '#f2f4f8', lw: 0 });
  if (kv > 0) { ctx.fillStyle = '#f2c14e'; ctx.fillRect(bx - bw / 2, yv, bw, base - yv); if (yv < yl) { const r = rng(4); ctx.strokeStyle = '#fff'; ctx.lineWidth = 3 * u; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(bx + (r() - .5) * bw, yl); ctx.lineTo(bx + (r() - .5) * bw * 1.8, yl + (r() - .5) * 40 * u); ctx.stroke(); } }
    text((P.unit || '') + Math.round(v * kv).toLocaleString('en-US') + (P.suf || ''), bx, yv - 60 * u, { size: 96 * u, font: 'impact', col: '#f2c14e', lw: 0 }); }
  if (P.b2lab) { const k2 = clamp(p(at(P.go2 || 0), .5)), x2 = W * .64; ctx.fillStyle = '#8a8f99'; ctx.globalAlpha = k2; ctx.fillRect(x2 - bw / 2, base - 10 * u, bw, 10 * u); ctx.globalAlpha = 1; text(P.b2val || '0%', x2, base - 70 * u, { size: 96 * u, font: 'impact', col: '#c9ced8', lw: 0, a: k2 }); text(P.b2lab, x2, base + 40 * u, { size: 42 * u, font: 'cond', col: '#c9ced8', lw: 0, ls: 3 * u, a: k2 }); if (P.alab) text(P.alab, bx, base + 40 * u, { size: 42 * u, font: 'cond', col: '#f2c14e', lw: 0, ls: 3 * u }); }
  if (P.head) { const ks = clamp(p(at(P.go2 || 0), .35)); text(P.head, W / 2, H * .1, { size: 76 * u, font: 'impact', col: '#f2f4f8', lw: 0, ls: 4 * u, a: 1 - ks * .45 }); if (ks > 0) { ctx.strokeStyle = '#e5332a'; ctx.lineWidth = 10 * u; ctx.beginPath(); ctx.moveTo(W * .26, H * .1); ctx.lineTo(lerp(W * .26, W * .74, ks), H * .1); ctx.stroke(); } }
  if (P.lab) text(P.lab, W / 2, H * .1, { size: 46 * u, font: 'cond', col: '#f2f4f8', lw: 0, ls: 5 * u, a: clamp(p(t0 + .5, .4)) }); if (P.sub) text(P.sub, W * .78, H * .7, { size: 34 * u, font: 'cond', col: '#d4d8e0', lw: 0, a: clamp(p(t0 + .7, .4)) });
  ctx.restore();
}
