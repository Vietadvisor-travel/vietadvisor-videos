/* @effect brick_drop
   @does: one plastic brick falls into a real picture from above, lands on a surface in it with a small bounce, a dust puff and a click, while the camera keeps pushing in; a short label sets beside it
   @params: bg, go, x, y, h, brick, lab, sub, lx, move, z, in, out
   @uses: lego_cut_brick_red (or any brick cut-out), any photo or clip as bg
   @tags: motif,brick,drop,carrier,object,landing
   @born: lego a0-12: it was saved by counting
*/
({ t, at, p, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, drop, dur }) => {
  // the film's carrier: the same brick, same size, same drop, landing in a new world each act. params: bg, go, x, y (landing
  // point, fractions), h (brick height, fraction of H), brick (cut-out id), lab, sub, lx (label x), move (in|right|left), z
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const k = clamp(t / Math.max(1, dur)), z = +(P.z || .2), mv = P.move || 'in';
  const bg = clip(P.bg, 0, 1) || img(P.bg); ctx.fillStyle = '#0b0a09'; ctx.fillRect(-W, -H, 3 * W, 3 * H);
  if (bg) cover(bg, { z: 1.06 + z * k, ox: mv === 'right' ? (k - .5) * -z * .5 : mv === 'left' ? (k - .5) * z * .5 : 0, filter: 'brightness(.82)' });
  const b = img(P.brick || 'lego_cut_brick_red'), t0 = Math.min(at(P.go || 0), dur * .3), x = (+P.x || .5) * W, y = (+P.y || .62) * H, h = (+P.h || .16) * H;
  if (b) { const yy = drop(t0, -h * 1.2, y, { bounce: .22, g: 4200 }), land = t > t0 && yy >= y - 1, tl = t0 + Math.sqrt(2 * (y + h * 1.2) / (4200 * u));
    const near = clamp((yy + h) / (y + h)), sq = t > tl ? 1 - .08 * Math.exp(-14 * (t - tl)) * Math.cos(30 * (t - tl)) : 1;
    ctx.save(); ctx.globalAlpha = .45 * near; ctx.fillStyle = '#000'; ctx.beginPath(); ctx.ellipse(x, y + h * .42, h * 1.3 * (0.5 + near * .5), h * .16, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    if (t > t0 && t < tl) for (let i = 1; i <= 3; i++) { ctx.save(); ctx.globalAlpha = .12 / i; ctx.translate(x, yy - i * h * .18); ctx.drawImage(b, -h * b.width / b.height / 2, -h / 2, h * b.width / b.height, h); ctx.restore(); }
    if (t > t0) { ctx.save(); ctx.translate(x, yy + h / 2); ctx.scale(1 / sq, sq); ctx.drawImage(b, -h * b.width / b.height / 2, -h, h * b.width / b.height, h); ctx.restore(); }
    if (P.lab) { const a = clamp(p(tl + .15, .4)), lx = (+P.lx || .5) * W; text(P.lab, lx, H * .16, { size: 64 * u, font: 'cond', col: '#f6efe2', lw: 0, ls: 6 * u, a }); if (P.sub) text(P.sub, lx, H * .16 + 58 * u, { size: 40 * u, font: 'serif', col: '#e2d6c2', lw: 0, a }); } }
  ctx.restore();
}
