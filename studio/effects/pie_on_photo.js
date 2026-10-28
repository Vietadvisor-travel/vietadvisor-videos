/* @effect pie_on_photo
   @does: a real photo of the thing being sold; a ring of shares is drawn round its centre, then on the word the share that was sold swings out of the ring and away while the kept shares stay lit with their owners
   @params: pic, slices, go, in, out
   @uses: any photo or clip
   @tags: stake,shares,sale,ownership,pie,percent
   @born: lego a5-14: LEGO and its family holding company kept thirty percent
*/
({ t, at, p, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, dur }) => {
  // slices: LABEL^percent^kept(1|0)^colour joined with ~
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.pic, 0, 1) || img(P.pic); if (bg) cover(bg, { z: 1.06 + .14 * clamp(t / Math.max(1, dur)), ox: (clamp(t / dur) - .5) * -.06, filter: 'brightness(.55)' });
  const S = (P.slices || 'SOLD^70^0^#7a7066~KEPT^30^1^#f2c14e').split('~').map(s => s.split('^')), cx = W / 2, cy = H * .52, R = H * .3, kd = clamp(p(.2, 1, 'inOut')), ko = clamp(p(P.go || 0, .9, 'inOut'));
  let a0 = -Math.PI / 2; S.forEach(([lab, pc, kept, col]) => { const sw = +pc / 100 * Math.PI * 2, a1 = a0 + sw * kd, mid = (a0 + a0 + sw) / 2, out = kept === '1' ? 0 : ko;
    const ox = Math.cos(mid) * out * W * .5, oy = Math.sin(mid) * out * H * .3; ctx.save(); ctx.globalAlpha = 1 - out * .7; ctx.fillStyle = col || '#f2c14e'; ctx.beginPath(); ctx.moveTo(cx + ox, cy + oy); ctx.arc(cx + ox, cy + oy, R, a0, a1); ctx.closePath(); ctx.fill(); ctx.strokeStyle = '#0d0b09'; ctx.lineWidth = 4 * u; ctx.stroke(); ctx.restore();
    if (kd >= 1) text(lab + ' ' + pc + '%', cx + ox + Math.cos(mid) * R * 1.32, cy + oy + Math.sin(mid) * R * 1.2, { size: 42 * u, font: 'cond', col: '#f6efe2', lw: 0, ls: 3 * u, a: kept === '1' ? clamp(p(P.go || 0, .5)) : 1 - out }); a0 += sw; });
  ctx.fillStyle = '#0d0b09'; ctx.beginPath(); ctx.arc(cx, cy, R * .42, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}
