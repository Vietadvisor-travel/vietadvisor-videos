/* @effect bag_tally
   @does: a real product photo fills the frame; on the word a pencil moves from item to item across it, ticking each one in turn, while a tally in the corner counts the items checked and locks
   @params: pic, pts, go, span, lab, in, out
   pts: x,y~x,y… (fractions of the frame)
   @uses: lego_cut_pencil + any photo with several items
   @tags: audit,check,one-by-one,review,costing,tally
   @born: lego a4-05: then designers finally went through the sets, one by one
*/
({ t, at, p, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.pic, 0, 1) || img(P.pic), k = clamp(t / Math.max(1, dur)); if (bg) cover(bg, { z: 1.08 + .06 * k, filter: 'brightness(.8)' });
  const pts = (P.pts || '.3,.5~.5,.5~.7,.5').split('~').map(s => s.split(',').map(Number)), n = pts.length, t0 = at(P.go || 0), span = +(P.span || 2), step = span / n;
  let done = 0, px = W * .9, py = H * .2;
  pts.forEach(([x, y], i) => { const st = t0 + i * step, kk = clamp((t - st - step * .5) / (step * .5)); const X = x * W, Y = y * H;
    if (t > st && t < st + step) { const m = clamp((t - st) / (step * .5)), [x0, y0] = i ? [pts[i - 1][0] * W, pts[i - 1][1] * H] : [W * .9, H * .2]; px = lerp(x0, X, m); py = lerp(y0, Y, m); if (kk > 0) { px = X + 30 * u * kk; py = Y - 20 * u * kk; } }
    if (kk > 0) { done++; ctx.strokeStyle = '#f2c14e'; ctx.lineWidth = 9 * u; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(X - 26 * u, Y); const k1 = Math.min(1, kk * 2); ctx.lineTo(X - 26 * u + 18 * u * k1, Y + 20 * u * k1); if (kk > .5) ctx.lineTo(X - 8 * u + 40 * u * (kk - .5) * 2, Y + 20 * u - 48 * u * (kk - .5) * 2); ctx.stroke(); } });
  if (t >= t0 + span) { px = pts[n - 1][0] * W + 30 * u; py = pts[n - 1][1] * H - 20 * u; }
  const pc = img('lego_cut_pencil'); if (pc && t > t0 - .3) { const pw = W * .26, ph = pw * pc.height / pc.width; ctx.drawImage(pc, px - .035 * pw, py - .01 * ph, pw, ph); }
  ctx.save(); ctx.fillStyle = 'rgba(10,8,6,.72)'; ctx.fillRect(W * .06, H * .08, W * .3, H * .18); ctx.restore();
  text(String(done) + ' / ' + n, W * .21, H * .15, { size: 84 * u, font: 'impact', col: '#f2c14e', lw: 0 }); if (P.lab) text(P.lab, W * .21, H * .225, { size: 32 * u, font: 'cond', col: '#efe4cf', lw: 0, ls: 4 * u });
  ctx.restore();
}
