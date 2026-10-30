/* @effect contract_rip
   @does: over a dim real photo, a card naming a partnership and its years lies centre frame; on the word it rips in two along a jagged line and the halves fall apart in opposite directions, an end date setting in the gap
   @params: bg, title, years, end, go, in, out
   @uses: any photo
   @tags: partnership,termination,split,deal,ended,break
   @born: nike-vs-adidas a4-02: in October 2022 Adidas ended its partnership with Ye
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, paperDesk, rng, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.bg, 0, 1) || img(P.bg), k = clamp(t / Math.max(1, dur)); if (bg) cover(bg, { z: 1.08 + .14 * k, ox: (k - .5) * -.1, filter: `brightness(${P.dim || .38})` }); else { ctx.fillStyle = '#0d0f14'; ctx.fillRect(-W, -H, 3 * W, 3 * H); }
  const t0 = at(P.go || 0), kr = clamp((t - t0) / 1.1), cw = W * .5, ch = H * .36, cx = W / 2, cy = H * .46, r = rng(9), pts = []; for (let y = -ch / 2; y <= ch / 2; y += ch / 10) pts.push([(r() - .5) * 40 * u, y]);
  const half = (side) => { ctx.save(); ctx.globalAlpha = 1 - clamp((kr - .45) * 2.2); const off = side * kr * W * .28, rot = side * kr * .25, dy = kr * kr * H * .3; ctx.translate(cx + off, cy + dy); ctx.rotate(rot); ctx.beginPath(); if (side < 0) { ctx.moveTo(-cw / 2, -ch / 2); pts.forEach(q => ctx.lineTo(q[0], q[1])); ctx.lineTo(-cw / 2, ch / 2); } else { ctx.moveTo(cw / 2, -ch / 2); pts.forEach(q => ctx.lineTo(q[0], q[1])); ctx.lineTo(cw / 2, ch / 2); } ctx.closePath(); ctx.clip();
    ctx.fillStyle = '#f4f1ea'; ctx.fillRect(-cw / 2, -ch / 2, cw, ch); ctx.strokeStyle = '#1d1d20'; ctx.lineWidth = 4 * u; ctx.strokeRect(-cw / 2 + 16 * u, -ch / 2 + 16 * u, cw - 32 * u, ch - 32 * u); text(P.title || '', 0, -ch * .08, { size: 66 * u, font: 'impact', col: '#1d1d20', lw: 0, ls: 4 * u }); text(P.years || '', 0, ch * .2, { size: 40 * u, font: 'cond', col: '#4a4a50', lw: 0, ls: 4 * u }); ctx.restore(); };
  half(-1); half(1); if (P.end) text(P.end, cx, H * .46, { size: 64 * u, font: 'impact', col: '#ff4b3e', lw: 0, ls: 5 * u, a: clamp((kr - .4) * 3) });
  ctx.restore();
}
