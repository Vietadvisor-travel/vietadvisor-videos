/* @effect myth_strike
   @does: real footage plays dim; the popular version of a story types in as short lines, and on their words a red line strikes each one through while the true fact lands under it
   @params: clip, lines, in, out
   @uses: any clip
   @tags: myth,correction,strike,truth,footage,claim
   @born: lego a0-11: it never went bankrupt, and no hit toy saved it
*/
({ t, at, p, W, H, u, clip, img, ctx, params: P, clamp, lerp, text, seam, cover, dur }) => {
  // lines: CLAIM^word^TRUTH joined with ~ ; each claim types at the start (staggered), is struck on its word, the truth sets under it
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.clip, 0, 1) || img(P.clip); if (bg) cover(bg, { z: 1.05 + .12 * clamp(t / Math.max(1, dur)), filter: 'brightness(.45) saturate(.7)' });
  const L = (P.lines || 'CLAIM^word^TRUTH').split('~').map(s => s.split('^')), n = L.length;
  L.forEach(([c, w, tr], i) => { const y = H * (n === 1 ? .42 : .3 + i * .26), ty = .15 + i * .35, ch = Math.floor(clamp((t - ty) / .6) * c.length), s = c.slice(0, ch);
    text(s, W / 2, y, { size: 84 * u, font: 'impact', col: '#f3ecdc', lw: 0, ls: 2 * u });
    const ks = clamp(p(w, .35, 'out')); if (ks > 0) { ctx.save(); ctx.strokeStyle = '#d63a2f'; ctx.lineWidth = 11 * u; ctx.lineCap = 'round'; const hw = c.length * 25 * u; ctx.beginPath(); ctx.moveTo(W / 2 - hw, y - 6 * u); ctx.lineTo(W / 2 - hw + 2 * hw * ks, y + 4 * u); ctx.stroke(); ctx.restore(); }
    if (tr) text(tr, W / 2, y + 74 * u, { size: 44 * u, font: 'cond', col: '#f2c14e', lw: 0, ls: 4 * u, a: clamp(p(at(w) + .2, .4)) }); });
  ctx.restore();
}
