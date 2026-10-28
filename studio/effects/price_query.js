/* @effect price_query
   @does: the camera dollies along a real shelf of boxes; on the word paper price tags swing in on strings, one per box, each showing only a question mark
   @params: bg, go, tags, mark, lab, pan, in, out
   @uses: any photo of shelves, a store or a stock room
   @tags: price,cost,unknown,tags,shelf,store,question
   @born: lego a0-04: LEGO couldn't tell you what its own boxes cost
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, dur }) => {
  // tags: x,y pairs in picture fractions joined with ~ (they ride the dolly). mark: what the tags say (default ?)
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.bg, 0, 1) || img(P.bg), k = clamp(t / Math.max(1, dur)), pan = +(P.pan || .14), z = 1.28, ox = (k - .5) * -pan;
  if (bg) cover(bg, { z, ox, filter: 'brightness(.85)' });
  const tags = (P.tags || '.2,.4~.4,.45~.6,.38~.8,.5').split('~').map(s => s.split(',').map(Number));
  tags.forEach(([fx, fy], i) => { const sx = W / 2 + (fx - .5) * W * z + ox * W, sy = H / 2 + (fy - .5) * H * z, k2 = clamp(spring(at(P.go || 0) + i * .22, { stiff: 120, damp: 9 }), 0, 1.2);
    if (k2 <= 0) return; const sw = Math.sin((t - at(P.go || 0) - i * .22) * 5) * .25 * Math.exp(-1.6 * Math.max(0, t - at(P.go || 0) - i * .22));
    ctx.save(); ctx.translate(sx, sy - (1 - Math.min(1, k2)) * H * .35); ctx.rotate(sw); ctx.strokeStyle = '#efe6d2'; ctx.lineWidth = 2 * u; ctx.beginPath(); ctx.moveTo(0, -110 * u); ctx.lineTo(0, 0); ctx.stroke();
    ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 18 * u; ctx.shadowOffsetY = 8 * u; ctx.fillStyle = '#f4ecd9'; ctx.beginPath(); ctx.moveTo(-60 * u, 0); ctx.lineTo(60 * u, 0); ctx.lineTo(60 * u, 130 * u); ctx.lineTo(-60 * u, 130 * u); ctx.closePath(); ctx.fill(); ctx.shadowColor = 'transparent';
    ctx.fillStyle = '#2b241b'; ctx.beginPath(); ctx.arc(0, 18 * u, 7 * u, 0, Math.PI * 2); ctx.fill(); text(P.mark || '?', 0, 82 * u, { size: 92 * u, font: 'impact', col: '#c8322a', lw: 0 }); ctx.restore(); });
  if (P.lab) text(P.lab, W * .5, H * .12, { size: 56 * u, font: 'cond', col: '#f6efe2', lw: 0, ls: 6 * u, a: clamp(p(P.go || 0, .5)) });
  ctx.restore();
}
