/* @effect myth_strike
   @does: real footage plays dim; the popular version of a story types in as short lines, and on their words a red line strikes each one through while the true fact lands under it
   @params: clip, lines, doc (a real page shown as a clipping above the lines), crop, in, out
   @uses: any clip
   @tags: myth,correction,strike,truth,footage,claim
   @born: lego a0-11: it never went bankrupt, and no hit toy saved it
*/
({ t, at, p, W, H, u, clip, img, ctx, params: P, clamp, lerp, text, seam, cover, dur }) => {
  // lines: CLAIM^word^TRUTH joined with ~ ; each claim types at the start (staggered), is struck on its word, the truth sets under it
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.clip, 0, 1) || img(P.clip); if (bg) cover(bg, { z: 1.05 + .12 * clamp(t / Math.max(1, dur)), filter: 'brightness(.45) saturate(.7)' });
  if (P.doc) { const im = img(P.doc); if (im && im.width) { const [c0, c1, c2, c3] = String(P.crop || '0,0,1,.3').split(',').map(Number), sw = (c2 - c0) * im.width, sh = (c3 - c1) * im.height, kk = clamp(t / Math.max(1, dur)), sc = Math.min(W * .74 / sw, H * .36 / sh) * (1 + .06 * kk), pw = sw * sc, ph = sh * sc, cx = W / 2 + (kk - .5) * -40 * u, cy = H * .27;
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(-.012); ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 40 * u; ctx.shadowOffsetY = 16 * u; ctx.fillStyle = '#f7f5ef'; ctx.fillRect(-pw / 2 - 16 * u, -ph / 2 - 16 * u, pw + 32 * u, ph + 32 * u); ctx.shadowColor = 'transparent'; ctx.drawImage(im, c0 * im.width, c1 * im.height, sw, sh, -pw / 2, -ph / 2, pw, ph); ctx.restore(); } }
  const L = (P.lines || 'CLAIM^word^TRUTH').split('~').map(s => s.split('^')), n = L.length;
  L.forEach(([c, w, tr], i) => { const y = P.doc ? H * (.6 + i * .2) : H * (n === 1 ? .42 : .3 + i * .26), ty = .15 + i * .35, ch = Math.floor(clamp((t - ty) / .6) * c.length), s = c.slice(0, ch);
    text(s, W / 2, y, { size: 84 * u, font: 'impact', col: '#f3ecdc', lw: 0, ls: 2 * u });
    const ks = clamp(p(w, .35, 'out')); if (ks > 0) { ctx.save(); ctx.strokeStyle = '#d63a2f'; ctx.lineWidth = 11 * u; ctx.lineCap = 'round'; const hw = c.length * 25 * u; ctx.beginPath(); ctx.moveTo(W / 2 - hw, y - 6 * u); ctx.lineTo(W / 2 - hw + 2 * hw * ks, y + 4 * u); ctx.stroke(); ctx.restore(); }
    if (tr) text(tr, W / 2, y + 74 * u, { size: 44 * u, font: 'cond', col: '#f2c14e', lw: 0, ls: 4 * u, a: clamp(p(at(w) + .2, .4)) }); });
  ctx.restore();
}
