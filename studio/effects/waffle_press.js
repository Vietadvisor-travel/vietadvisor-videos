/* @effect waffle_press
   @does: a slab of rubber lies under a hot iron grid; on the word the grid presses down, steam rises, and when it lifts the rubber carries a waffle pattern, which then slides away as a finished sole
   @params: bg, sole, go, lab, sub, in, out
   @uses: nva_cut_sole + a rubber texture
   @tags: invention,sole,waffle,craft,prototype,innovation
   @born: nike-vs-adidas a1-09: Bowerman makes a new sole by pouring rubber into a waffle iron
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, paperDesk, rng, dur }) => {
  // a cast-iron waffle iron seen from above: rubber poured in its square cells, the hinged lid shuts, steam, the lid opens and a sole with square nubs lifts out
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.bg, 0, 1) || img(P.bg), k = clamp(t / Math.max(1, dur)); if (bg) cover(bg, { z: 1.1 + .1 * k, ox: (k - .5) * -.08, filter: `brightness(${P.dim || .3}) sepia(.4)` }); else { ctx.fillStyle = '#17120e'; ctx.fillRect(-W, -H, 3 * W, 3 * H); }
  const t0 = at(P.go || 0), T = t - t0, cx = W * .4, cy = H * .6, bw = W * .34, bh = H * .3, nx = 8, ny = 5, cw = bw * .86 / nx, chh = bh * .8 / ny;
  const pour = clamp(T / .4), lid = T < .4 ? 1 : T < .7 ? lerp(1, -1, clamp((T - .4) / .3)) : T < 1.2 ? -1 : lerp(-1, 1, clamp((T - 1.2) / .3)), lift = clamp((T - 1.5) / .6);
  const cells = (x0, y0, w, h, fill, edge) => { for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) { const x = x0 + w * .07 + i * w * .86 / nx, y = y0 + h * .1 + j * h * .8 / ny; ctx.fillStyle = fill; ctx.fillRect(x + 5 * u, y + 5 * u, w * .86 / nx - 10 * u, h * .8 / ny - 10 * u); ctx.fillStyle = edge; ctx.fillRect(x + 5 * u, y + 5 * u, w * .86 / nx - 10 * u, 4 * u); } };
  // base
  ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.fillRect(cx - bw / 2 + 16 * u, cy - bh / 2 + 22 * u, bw, bh); ctx.fillStyle = '#2f2f33'; ctx.fillRect(cx - bw / 2, cy - bh / 2, bw, bh); ctx.strokeStyle = '#5a5a60'; ctx.lineWidth = 5 * u; ctx.strokeRect(cx - bw / 2, cy - bh / 2, bw, bh);
  cells(cx - bw / 2, cy - bh / 2, bw, bh, '#17171a', '#3e3e44'); ctx.fillStyle = '#6b4a2a'; ctx.fillRect(cx - 50 * u, cy + bh / 2, 100 * u, 70 * u);
  if (pour > 0 && lift < 1) { ctx.save(); ctx.globalAlpha = pour * (1 - lift); ctx.fillStyle = '#0b0b0c'; ctx.beginPath(); ctx.ellipse(cx, cy, bw * .4 * Math.sqrt(pour), bh * .36 * Math.sqrt(pour), 0, 0, 6.29); ctx.fill(); ctx.restore(); }
  // hinge at the back edge; lid above it (open, underside up) or over the base (shut, top up)
  ctx.fillStyle = '#4a4a50'; ctx.fillRect(cx - bw * .3, cy - bh / 2 - 14 * u, 40 * u, 20 * u); ctx.fillRect(cx + bw * .3 - 40 * u, cy - bh / 2 - 14 * u, 40 * u, 20 * u);
  if (lid > 0) { const h = bh * lid, y0 = cy - bh / 2 - h; ctx.fillStyle = '#2a2a2e'; ctx.fillRect(cx - bw / 2, y0, bw, h); ctx.strokeStyle = '#5a5a60'; ctx.strokeRect(cx - bw / 2, y0, bw, h); ctx.save(); ctx.translate(0, y0); ctx.scale(1, lid); cells(cx - bw / 2, 0, bw, bh, '#151517', '#3a3a40'); ctx.restore(); ctx.fillStyle = '#6b4a2a'; ctx.fillRect(cx - 50 * u, y0 - 70 * u * lid, 100 * u, 70 * u * lid); }
  else { const h = bh * -lid; ctx.fillStyle = '#38383d'; ctx.fillRect(cx - bw / 2, cy - bh / 2, bw, h); ctx.strokeStyle = '#66666c'; ctx.strokeRect(cx - bw / 2, cy - bh / 2, bw, h); ctx.fillStyle = '#6b4a2a'; ctx.fillRect(cx - 50 * u, cy - bh / 2 + h, 100 * u, 70 * u * -lid); }
  if (T > .65 && T < 1.7) { const r = rng(Math.floor(t * 12)), ka = 1 - clamp((T - 1.2) / .5); ctx.fillStyle = `rgba(235,235,235,${.22 * ka})`; for (let i = 0; i < 18; i++) { ctx.beginPath(); ctx.arc(cx + (r() - .5) * bw, cy - bh / 2 - r() * 220 * u, (14 + r() * 36) * u, 0, 6.29); ctx.fill(); } }
  // the sole: heel, waist, forefoot, covered in square nubs
  if (lift > 0) { const sx = lerp(cx, W * .76, lift), sy = lerp(cy, H * .5, lift), s = lerp(.85, 1.1, lift), L = bw * .8 * s, Wd = bh * .62 * s; ctx.save(); ctx.translate(sx, sy); ctx.rotate(lerp(0, -.12, lift));
    ctx.beginPath(); ctx.moveTo(-L / 2, 0); ctx.bezierCurveTo(-L / 2, -Wd * .42, -L * .22, -Wd * .4, 0, -Wd * .3); ctx.bezierCurveTo(L * .2, -Wd * .26, L / 2, -Wd * .52, L / 2, 0); ctx.bezierCurveTo(L / 2, Wd * .52, L * .2, Wd * .3, 0, Wd * .3); ctx.bezierCurveTo(-L * .22, Wd * .36, -L / 2, Wd * .42, -L / 2, 0); ctx.closePath();
    ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 30 * u; ctx.fillStyle = '#26262a'; ctx.fill(); ctx.shadowColor = 'transparent'; ctx.clip(); const q = 30 * u * s; for (let x = -L / 2; x < L / 2; x += q * 1.5) for (let y = -Wd / 2; y < Wd / 2; y += q * 1.5) { ctx.fillStyle = '#3c3c42'; ctx.fillRect(x, y, q, q); ctx.fillStyle = '#5a5a62'; ctx.fillRect(x, y, q, 5 * u); } ctx.restore(); }
  const a = clamp(p(t0 + 1.8, .4)); if (P.lab) text(P.lab, W / 2, H * .12, { size: 60 * u, font: 'cond', col: '#f6efe2', lw: 0, ls: 5 * u, a: clamp(p(t0 + 1.2, .4)) }); if (P.sub) text(P.sub, W / 2, H * .85, { size: 42 * u, font: 'cond', col: '#e2d6c2', lw: 0, a });
  ctx.restore();
}
