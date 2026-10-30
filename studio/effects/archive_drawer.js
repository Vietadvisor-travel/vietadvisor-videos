/* @effect archive_drawer
   @does: a dark wall of archive drawers fills the frame; on the word one drawer slides out toward us and the real photo inside rises into the light, a label tag hanging from the drawer front
   @params: pic, tag, go, lab, in, out
   @uses: any photo
   @tags: archive,heritage,classic,revival,old,vault
   @born: nike-vs-adidas a4-06: he sold what Adidas already had
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, paperDesk, rng, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  ctx.fillStyle = '#121214'; ctx.fillRect(-W, -H, 3 * W, 3 * H); const k = clamp(t / Math.max(1, dur)), t0 = at(P.go || 0), ko = clamp(p(t0, 1, 'out')), dw = W * .22, dh = H * .17;
  ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(1 + .06 * k, 1 + .06 * k); ctx.translate(-W / 2 + (k - .5) * -W * .04, -H / 2);
  for (let r = 0; r < 6; r++) for (let c = 0; c < 5; c++) { const x = W * .5 + (c - 2) * dw * 1.04, y = H * .1 + r * dh * 1.06; ctx.fillStyle = '#26262a'; ctx.fillRect(x - dw / 2, y, dw, dh); ctx.strokeStyle = '#3a3a40'; ctx.lineWidth = 3 * u; ctx.strokeRect(x - dw / 2, y, dw, dh); ctx.fillStyle = '#7a7a82'; ctx.fillRect(x - 30 * u, y + dh * .45, 60 * u, 10 * u); }
  ctx.restore(); const im = img(P.pic); if (ko > 0) { const ka = clamp((t - t0 - 1) / Math.max(1, dur - t0 - 1)), s = lerp(1, 2.6, ko) + 1.1 * ka, x = W / 2 + (ka - .5) * W * .2 * ko, y = lerp(H * .52, H * .5, ko) - ka * 30 * u, w = dw * s, h = dh * s; ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.8)'; ctx.shadowBlur = 50 * u; ctx.fillStyle = '#34343a'; ctx.fillRect(x - w / 2, y - h / 2, w, h); ctx.restore();
    if (im) { const ih = h * .92, iw = Math.min(w * .9, ih * im.width / im.height); ctx.save(); ctx.globalAlpha = clamp((ko - .3) * 2); ctx.drawImage(im, x - iw / 2, y - ih / 2 - ko * 40 * u, iw, ih); ctx.restore(); }
    if (P.tag) { ctx.save(); ctx.translate(Math.min(x + w / 2 - 40 * u, W * .9), Math.min(y + h / 2, H * .76)); ctx.rotate(.15); const tw = (P.tag.length * 21 + 50) * u; ctx.fillStyle = '#e8d9b0'; ctx.fillRect(-tw + 60 * u, 0, tw, 64 * u); text(P.tag, -tw / 2 + 60 * u, 32 * u, { size: 40 * u, font: 'cond', col: '#2a2418', lw: 0, ls: 2 * u }); ctx.restore(); } }
  if (P.lab) text(P.lab, W / 2, H * .1, { size: 52 * u, font: 'cond', col: '#f2f4f8', lw: 0, ls: 6 * u, a: clamp(p(t0 + .8, .4)) });
  ctx.restore();
}
