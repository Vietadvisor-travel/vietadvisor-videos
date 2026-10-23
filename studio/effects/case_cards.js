/* @effect case_cards
   @does: a line-up of case files lands on the investigator's desk one per sentence: each card drops in with weight, carrying a name, a role and the sentence in large type; earlier cards stay, the newest is lit; one slot can stay an empty dashed card (never tried)
   @params: rows, show, go, empty, title, in, out
   @uses: none (typeset)
   @tags: sentences, verdicts, line-up, cast, consequences, desk
   @born: onecoin v2 (so line up the sentences)
*/
({ t, at, p, W, H, u, ctx, params: P, clamp, lerp, seam, paperDesk, paper, drop, text, dur }) => {
  // rows: NAME/role/TERM~…  (slash-separated fields)  · show: cards already on the desk · go: cue word of the new card (or 99 for none)
  ctx.save(); seam(P.in || 'none', P.out || 'none'); paperDesk({ lx: .5, ly: .5 });
  const rows = String(P.rows).split('~').map(r => r.split('/')), show = +(P.show || 0), t0 = at(P.go || 99), em = P.empty !== undefined ? +P.empty : -1, n = rows.length;
  const cols = 3, cw = W * .27, ch = H * .34, gx = W * .5 - cw * 1.08, gy = H * .3, k = clamp((t - t0) / Math.max(.6, dur * .4)), z = lerp(1.07, 1, k * k * (3 - 2 * k));
  if (P.title) text(P.title, W / 2, H * .08, { size: 44 * u, font: 'cond', col: '#cbbfa8', lw: 0, ls: 6 * u });
  const nx = gx + (show % cols) * cw * 1.08, ny = gy + Math.floor(show / cols) * ch * 1.12 + H * .06, pk = show < n ? (1 - Math.abs(1 - 2 * Math.min(1, k * 1.2)) * 0 + k) : 0, ox = (W / 2 - nx) * .07 * pk, oy = (H * .52 - ny) * .06 * pk;
  ctx.translate(W / 2 + ox, H * .52 + oy); ctx.scale(z, z); ctx.translate(-W / 2, -H * .52);
  rows.forEach((r, i) => { const cx = gx + (i % cols) * cw * 1.08, cy = gy + Math.floor(i / cols) * ch * 1.12 + H * .06, isNew = i === show, here = i < show || (isNew && t >= t0);
    const isEmpty = i === em; ctx.save();
    if (!here) { ctx.strokeStyle = 'rgba(203,191,168,.18)'; ctx.setLineDash([8 * u, 8 * u]); ctx.lineWidth = 2 * u; ctx.strokeRect(cx - cw / 2, cy - ch / 2, cw, ch); ctx.setLineDash([]); text(r[0], cx, cy, { size: 44 * u, font: 'cond', col: 'rgba(203,191,168,.35)', lw: 0 }); ctx.restore(); return; }
    const y = isNew ? drop(t0, cy - H * .9, cy, { bounce: .18 }) : cy, rot = isNew ? lerp(.12, ((i * 37) % 7 - 3) * .01, clamp((t - t0) / .5)) : ((i * 37) % 7 - 3) * .01, dim = isNew ? 1 : .62;
    ctx.translate(cx, y); ctx.rotate(rot); ctx.globalAlpha = dim;
    if (isEmpty) { ctx.strokeStyle = '#e8c77e'; ctx.setLineDash([12 * u, 9 * u]); ctx.lineWidth = 4 * u; ctx.strokeRect(-cw / 2, -ch / 2, cw, ch); ctx.setLineDash([]); }
    else { ctx.shadowColor = 'rgba(0,0,0,.55)'; ctx.shadowBlur = 30 * u; ctx.shadowOffsetY = 14 * u; ctx.drawImage(paper(Math.round(cw), Math.round(ch), { tint: '#e6dfd0' }), -cw / 2, -ch / 2, cw, ch); ctx.shadowColor = 'transparent'; ctx.fillStyle = '#7a1f1f'; ctx.fillRect(-cw / 2, -ch / 2, cw, 10 * u); }
    const ink = isEmpty ? '#e8c77e' : '#1f1a14'; text(r[0], 0, -ch * .3, { size: 52 * u, font: 'impact', col: ink, lw: 0 }); if (r[1]) text(r[1], 0, -ch * .12, { size: 40 * u, font: 'serif', col: isEmpty ? '#cbbfa8' : '#5b5145', lw: 0 });
    if (r[2]) text(r[2], 0, ch * .2, { size: 96 * u, font: 'impact', col: isEmpty ? '#e8c77e' : '#8f1d1d', lw: 0 }); ctx.restore(); });
  ctx.restore();
}
