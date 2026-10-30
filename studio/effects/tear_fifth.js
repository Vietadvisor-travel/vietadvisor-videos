/* @effect tear_fifth
   @does: a real picture lies on the desk as a big print; on the word it tears along a ragged vertical line and the last fifth of it peels away and falls out of frame, the numbers of the cut setting in the gap it leaves
   @params: pic, go, frac, lab, sub, in, out
   @uses: any photo
   @tags: cut,costs,jobs,shrink,restructuring,tear
   @born: lego a5-07: costs were cut by a fifth, more than 1.5 billion kroner, and about a thousand jobs went
*/
({ t, at, p, W, H, u, img, ctx, params: P, clamp, lerp, text, seam, paperDesk, rng, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none'); paperDesk({ lx: .45, ly: .45 });
  const im = img(P.pic), k = clamp(t / Math.max(1, dur)), t0 = at(P.go || 0), kt = clamp((t - t0) / 1.1), fr = +(P.frac || .2), pw = W * .74, ph = im ? Math.min(H * .7, pw * im.height / im.width) : H * .6, px = W * .07 + (k - .5) * W * +(P.travel || .01), py = H * .46 - ph / 2, cutX = pw * (1 - fr);
  if (!im) { ctx.restore(); return; } const r = rng(21), pts = []; for (let y = 0; y <= ph; y += ph / 16) pts.push([cutX + (r() - .5) * 26 * u, y]);
  const piece = (left) => { ctx.beginPath(); if (left) { ctx.moveTo(0, 0); pts.forEach(q => ctx.lineTo(q[0], q[1])); ctx.lineTo(0, ph); } else { ctx.moveTo(pw, 0); pts.forEach(q => ctx.lineTo(q[0], q[1])); ctx.lineTo(pw, ph); } ctx.closePath(); };
  const sc = Math.max(pw / im.width, ph / im.height);
  ctx.save(); ctx.translate(px, py); ctx.shadowColor = 'rgba(0,0,0,.55)'; ctx.shadowBlur = 30 * u; piece(true); ctx.fillStyle = '#efe8da'; ctx.fill(); ctx.shadowColor = 'transparent'; ctx.save(); piece(true); ctx.clip(); ctx.drawImage(im, pw / 2 - im.width * sc / 2, ph / 2 - im.height * sc / 2, im.width * sc, im.height * sc); ctx.restore(); ctx.restore();
  ctx.save(); ctx.translate(px + kt * 120 * u, py + kt * kt * H * 1.1); ctx.rotate(kt * .5); ctx.shadowColor = 'rgba(0,0,0,.55)'; ctx.shadowBlur = 30 * u; piece(false); ctx.fillStyle = '#efe8da'; ctx.fill(); ctx.shadowColor = 'transparent'; ctx.save(); piece(false); ctx.clip(); ctx.drawImage(im, pw / 2 - im.width * sc / 2, ph / 2 - im.height * sc / 2, im.width * sc, im.height * sc); ctx.restore(); ctx.restore();
  const la = clamp(p(t0 + .7, .4)), gx = px + cutX + (W - px - cutX) / 2; if (P.lab) text(P.lab, gx, H * .4, { size: 92 * u, font: 'impact', col: '#ff6b5e', lw: 0, a: la }); if (P.sub) P.sub.split('~').forEach((s, i) => text(s, gx, H * .5 + i * 60 * u, { size: 42 * u, font: 'cond', col: '#f6efe2', lw: 0, ls: 2 * u, a: la }));
  ctx.restore();
}
