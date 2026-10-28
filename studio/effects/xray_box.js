/* @effect xray_box
   @does: a real product box sits under the lamp; on the first word an x-ray band sweeps across it and the box turns translucent blue, showing gears and a motor inside and fibre-optic strands glowing; on the second word two bars rise beside it, what the parts cost towering over what the box sold for
   @params: box, inner, go, go2, a, b, src, in, out
   @uses: lego_cut_box + a parts photo
   @tags: cost,inside,components,xray,price,loss-making
   @born: lego a4-06: sets with a tiny motor or fibre-optic lights cost more to source than the box sold for
*/
({ t, at, p, W, H, u, img, ctx, params: P, clamp, lerp, text, seam, paperDesk, rng, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none'); paperDesk({ lx: .35, ly: .45 });
  const b = img(P.box || 'lego_cut_box'), inn = img(P.inner || 'lego_technic_gear'), k = clamp(t / Math.max(1, dur)), bw = W * .4, bh = b ? bw * b.height / b.width : H * .4, bx = W * .33 - bw / 2, by = H * .48 - bh / 2 - k * 10 * u, t0 = at(P.go || 0), kx = clamp(p(t0, 1, 'inOut'));
  if (b) { ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 40 * u; ctx.drawImage(b, bx, by, bw, bh); ctx.restore(); }
  if (kx > 0 && b) { ctx.save(); ctx.beginPath(); ctx.rect(bx, by, bw * kx, bh); ctx.clip(); ctx.filter = 'grayscale(1) brightness(.45) sepia(1) hue-rotate(170deg) saturate(5)'; ctx.drawImage(b, bx, by, bw, bh); ctx.filter = 'none';
    ctx.beginPath(); ctx.rect(bx + bw * .2, by + bh * .38, bw * .55, bh * .5); ctx.clip(); ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = .75; ctx.filter = 'grayscale(1) invert(1) brightness(.75)'; if (inn) { const s = Math.max(bw * .55 / inn.width, bh * .5 / inn.height); ctx.drawImage(inn, bx + bw * .475 - inn.width * s / 2, by + bh * .63 - inn.height * s / 2, inn.width * s, inn.height * s); } ctx.filter = 'none'; ctx.globalAlpha = 1;
    const r = rng(6); for (let i = 0; i < 22; i++) { const a = -Math.PI / 2 + (r() - .5) * 2.2, L = bh * (.2 + r() * .22), ph = (t * .8 + r()) % 1, sx = bx + bw * .47, sy = by + bh * .85; ctx.strokeStyle = `rgba(120,220,255,${(.5 + .5 * Math.sin(t * 4 + i)).toFixed(2)})`; ctx.lineWidth = 2 * u; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.quadraticCurveTo(sx + Math.cos(a) * L * .3, sy + Math.sin(a) * L * .7, sx + Math.cos(a) * L, sy + Math.sin(a) * L); ctx.stroke(); ctx.fillStyle = '#d6f6ff'; ctx.beginPath(); ctx.arc(sx + Math.cos(a) * L * ph, sy + Math.sin(a) * L * ph, 3 * u, 0, 6.29); ctx.fill(); }
    ctx.restore(); if (kx < 1) { ctx.fillStyle = 'rgba(160,230,255,.9)'; ctx.fillRect(bx + bw * kx - 3 * u, by - 10 * u, 6 * u, bh + 20 * u); } }
  const t2 = at(P.go2 || P.go || 0), ka = clamp(p(t2, .7, 'out')), base = H * .8, bwid = W * .09;
  [[P.a || 'WHAT THE PARTS COST', .52, '#ff6b5e', W * .69], [P.b || "WHAT THE BOX SOLD FOR", .26, '#f2c14e', W * .85]].forEach(([lab, hh, col, x]) => { const h = H * hh * ka; ctx.fillStyle = col; ctx.fillRect(x - bwid / 2, base - h, bwid, h); if (ka > 0) text(lab, x, base - h - 40 * u, { size: 28 * u, font: 'cond', col: '#f6efe2', lw: 0, ls: 2 * u, a: ka }); });
  if (P.src) text(P.src, W * .5, H * .1, { size: 26 * u, font: 'cond', col: '#cfc3ad', lw: 0, a: ka });
  ctx.restore();
}
