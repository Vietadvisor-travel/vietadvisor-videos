/* @effect pie_on_photo
   @does: a real photo of the thing being sold; a ring of shares is drawn round its centre, then on the word the share that was sold swings out of the ring and away while the kept shares stay lit with their owners
   @params: pic, slices, go, mid, in, out
   @uses: any photo or clip
   @tags: stake,shares,sale,ownership,pie,percent
   @born: lego a5-14: LEGO and its family holding company kept thirty percent
*/
({ t, at, p, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, dur }) => {
  // slices: LABEL^percent^kept(1|0)^colour joined with ~
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.pic, 0, 1) || img(P.pic); if (bg) cover(bg, { z: 1.06 + .14 * clamp(t / Math.max(1, dur)), ox: (clamp(t / dur) - .5) * -.06, filter: 'brightness(.55)' });
  const S = (P.slices || 'SOLD^70^0^#7a7066~KEPT^30^1^#f2c14e').split('~').map(s => s.split('^')), cx = W / 2, cy = H * .52, R = H * .3, kd = clamp(p(.2, 1, 'inOut')), ko = clamp(p(P.go || 0, .9, 'inOut'));
  const F = P.from ? [+P.from, 100 - +P.from] : null; let a0 = -Math.PI / 2; S.forEach(([lab, pc0, kept, col], si) => { const pc = F ? Math.round(lerp(F[si], +pc0, ko)) : +pc0, show = F && ko < .5 ? F[si] : +pc0, sw = pc / 100 * Math.PI * 2, a1 = a0 + sw * kd, mid = (a0 + a0 + sw) / 2, out = kept === '1' ? .05 * ko : 0;
    const ox = Math.cos(mid) * out * W * .5, oy = Math.sin(mid) * out * H * .3; ctx.save(); ctx.fillStyle = kept === '1' ? (col || '#f2c14e') : (col || '#6d7380'); ctx.beginPath(); ctx.moveTo(cx + ox, cy + oy); ctx.arc(cx + ox, cy + oy, R, a0, a1); ctx.closePath(); ctx.fill(); ctx.strokeStyle = '#0d0b09'; ctx.lineWidth = 4 * u; ctx.stroke(); ctx.restore();
    if (kd >= 1) { const lx = cx + Math.cos(mid) * R * 1.12, ly = cy + Math.sin(mid) * R * 1.08; text(lab + ' ' + show + '%', lx + (Math.cos(mid) > 0 ? 24 : -24) * u, ly, { size: 44 * u, font: 'cond', col: kept === '1' ? '#f6efe2' : '#c9ced8', lw: 0, ls: 3 * u, align: Math.cos(mid) > 0 ? 'left' : 'right' }); } a0 += sw; });
  ctx.fillStyle = '#0d0b09'; ctx.beginPath(); ctx.arc(cx, cy, R * .42, 0, Math.PI * 2); ctx.fill(); if (P.mid) P.mid.split('~').forEach((m, i) => text(m, cx, cy + (i - .5) * 64 * u + (P.mid.includes('~') ? 0 : 27 * u), { size: (i ? 40 : 64) * u, font: i ? 'cond' : 'impact', col: '#f2c14e', lw: 0, a: clamp(p(P.go || 0, .5)) }));
  ctx.restore();
}
