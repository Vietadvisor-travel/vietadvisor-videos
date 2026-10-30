/* @effect advice_note
   @does: the camera travels across a real photo; on the word a yellow note slaps onto the picture, slightly turned, and one word writes itself on it in pencil, with a small source line under it
   @params: pic, word, go, x, y, src, in, out
   @uses: any photo or clip
   @tags: advice,note,recommendation,handwriting,decision,sell
   @born: lego a0-08: bankers advised the family to sell the company
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.pic, 0, 1) || img(P.pic), k = clamp(t / Math.max(1, dur)); if (bg) cover(bg, { z: 1.18, ox: (k - .5) * -.14, filter: 'brightness(.88)' });
  const SH = img(P.obj); if (SH) { const ko = clamp(p(P.go || 0, .5)), ow = W * .3, oh = ow * SH.height / SH.width, ox = W * +(P.ox || .36), oy = H * +(P.oy || .7); const gl = ctx.createRadialGradient(ox, oy - oh / 2, 20 * u, ox, oy - oh / 2, ow); gl.addColorStop(0, `rgba(255,236,190,${.5 * ko})`); gl.addColorStop(1, 'rgba(255,236,190,0)'); ctx.fillStyle = gl; ctx.fillRect(ox - ow * 1.2, oy - oh * 2, ow * 2.4, oh * 2.6);
    ctx.save(); ctx.globalAlpha = ko; ctx.fillStyle = 'rgba(0,0,0,.5)'; ctx.beginPath(); ctx.ellipse(ox, oy, ow * .42, 14 * u, 0, 0, 6.29); ctx.fill(); if (P.ofilter) ctx.filter = P.ofilter; ctx.drawImage(SH, ox - ow / 2, oy - oh - (1 - ko) * 60 * u, ow, oh); ctx.filter = 'none'; ctx.restore(); if (P.olab) text(P.olab, ox, oy + 50 * u, { size: 42 * u, font: 'cond', col: '#f6efe2', lw: 0, ls: 3 * u, a: ko }); }
  const kn = clamp(spring(P.go || 0, { stiff: 220, damp: 16 }), 0, 1.08); if (kn > 0) { const x = (+P.x || .64) * W, y = (+P.y || .4) * H, s = W * +(P.ns || .2);
    ctx.save(); ctx.translate(x, y); ctx.rotate(-.06); ctx.scale(lerp(1.4, 1, Math.min(1, kn)), lerp(1.4, 1, Math.min(1, kn))); ctx.shadowColor = 'rgba(0,0,0,.45)'; ctx.shadowBlur = 24 * u; ctx.shadowOffsetY = 12 * u; ctx.fillStyle = '#f6e27a'; ctx.fillRect(-s / 2, -s / 2, s, s); ctx.shadowColor = 'transparent';
    ctx.fillStyle = 'rgba(0,0,0,.06)'; ctx.fillRect(-s / 2, -s / 2, s, s * .14); const w = P.word || 'SELL.', kw = clamp(p(at(P.go || 0) + .15, .9, 'lin')), ch = Math.ceil(w.length * kw);
    w.slice(0, ch).split('/').forEach((ln, li, A) => text(ln, 0, s * .06 + (li - (A.length - 1) / 2) * s * .26, { size: s * (A.length > 2 ? .13 : A.length > 1 ? .18 : .3), font: 'hand', col: '#2b2620', lw: 0 })); ctx.restore(); }
  if (P.src) text(P.src, W * .5, H * .12, { size: 36 * u, font: 'cond', col: '#f6efe2', lw: 0, ls: 2 * u, a: clamp(p(at(P.go || 0) + .4, .4)) });
  ctx.restore();
}
