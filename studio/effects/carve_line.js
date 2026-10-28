/* @effect carve_line
   @does: the camera travels through a real or AI-plate room; a plank of wood crosses the frame and a short line is carved into it letter by letter while wood chips fly off the chisel point
   @params: bg, line, go, span, sub, in, out
   @uses: any plate + lego_el_wood_workbench (wood texture)
   @tags: motto,carving,wood,craft,words,origin
   @born: lego a1-04: his motto, from 1936, only the best is good enough
*/
({ t, at, p, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, rng, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.bg, 0, 1) || img(P.bg), k = clamp(t / Math.max(1, dur)); if (bg) cover(bg, { z: 1.2, ox: (k - .5) * -.14, filter: 'brightness(.6)' });
  const wood = img('lego_el_wood_workbench'), py = H * .5, ph = H * .2, kp = clamp(p(.1, .6));
  ctx.save(); ctx.translate((1 - kp) * W, 0); ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 30 * u; ctx.shadowOffsetY = 14 * u; ctx.fillStyle = '#b98a55'; ctx.fillRect(W * .04, py - ph / 2, W * .92, ph); ctx.shadowColor = 'transparent';
  if (wood) { ctx.save(); ctx.beginPath(); ctx.rect(W * .04, py - ph / 2, W * .92, ph); ctx.clip(); ctx.globalAlpha = .9; ctx.drawImage(wood, W * .04, py - ph * 2, W * .92, ph * 4); ctx.restore(); }
  const L = P.line || 'ONLY THE BEST IS GOOD ENOUGH', t0 = at(P.go || 0), span = +(P.span || 1.8), kc = clamp((t - t0) / span), n = Math.floor(L.length * kc), sz = Math.min(90 * u, W * .8 / (L.length * .62)), x0 = W / 2 - L.length * sz * .31;
  const s = L.slice(0, n); text(s, x0 + 2 * u, py + 3 * u, { size: sz, font: 'serif', col: 'rgba(255,240,215,.35)', lw: 0, align: 'left' }); text(s, x0, py, { size: sz, font: 'serif', col: '#3b2414', lw: 0, align: 'left' });
  if (kc > 0 && kc < 1) { const r = rng(Math.floor(t * 30)), tipx = x0 + n * sz * .62; for (let i = 0; i < 9; i++) { ctx.fillStyle = 'rgba(230,200,150,.9)'; ctx.fillRect(tipx + (r() - .3) * 80 * u, py - ph * .3 - r() * 90 * u, 6 * u, 3 * u); } }
  ctx.restore(); if (P.sub) text(P.sub, W / 2, py + ph * .9, { size: 40 * u, font: 'cond', col: '#f6efe2', lw: 0, ls: 4 * u, a: clamp(p(t0 + span, .4)) });
  ctx.restore();
}
