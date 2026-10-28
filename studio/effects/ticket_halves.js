/* @effect ticket_halves
   @does: a big cinema ticket for the first film lies on the dark desk over a dim real page, its gross printed on it; on the word a second ticket for the sequel slides in beside it and tears in two, the torn half falling away, its smaller gross on the half that stays
   @params: bg, a, av, b, bv, go, src, in, out
   @uses: any page or photo behind
   @tags: sequel,decline,hit,box-office,film,half
   @born: lego a6-03: the sequel, five years later, made less than half of that
*/
({ t, at, p, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, rng, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.bg, 0, 1) || img(P.bg), k = clamp(t / Math.max(1, dur)); if (bg) cover(bg, { z: 1.15 + .08 * k, filter: 'brightness(.25) blur(3px)' });
  const tw = W * .4, th = H * .34, t0 = at(P.go || 0), ks = clamp(p(t0 - .5, .5, 'out')), kt = clamp((t - t0) / 1);
  const ticket = (cx, cy, rot, title, val, w, col) => { ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot); ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 30 * u; ctx.fillStyle = col; ctx.beginPath(); ctx.rect(-tw / 2, -th / 2, w, th); ctx.fill(); ctx.shadowColor = 'transparent';
    ctx.strokeStyle = 'rgba(60,40,20,.5)'; ctx.setLineDash([8 * u, 8 * u]); ctx.lineWidth = 3 * u; ctx.beginPath(); ctx.moveTo(-tw / 2 + tw * .72, -th / 2); ctx.lineTo(-tw / 2 + tw * .72, th / 2); ctx.stroke(); ctx.setLineDash([]);
    ctx.save(); ctx.beginPath(); ctx.rect(-tw / 2, -th / 2, w, th); ctx.clip(); text('ADMIT ONE', -tw / 2 + tw * .25, -th * .3, { size: 26 * u, font: 'cond', col: '#5a3a20', lw: 0, ls: 8 * u }); text(title, -tw / 2 + tw * .25, -th * .06, { size: 36 * u, font: 'cond', col: '#2a1c10', lw: 0, ls: 3 * u }); text(val, -tw / 2 + tw * .25, th * .24, { size: 66 * u, font: 'impact', col: '#a3261c', lw: 0 }); ctx.restore(); ctx.restore(); };
  ticket(W * .28, H * .42, -.04, P.a || 'FIRST FILM', P.av || '', tw, '#efd9a6');
  if (ks > 0) { const cx = lerp(W * 1.3, W * .74, ks), cy = H * .46; ticket(cx, cy, .03, P.b || 'SEQUEL', P.bv || '', tw * lerp(1, .5, clamp(kt * 3)), '#e9d3a0');
    if (kt > 0) { ctx.save(); ctx.translate(cx + tw * .25 * 0 + kt * 60 * u, cy + kt * kt * H * .9); ctx.rotate(.03 + kt * .6); ctx.fillStyle = '#e9d3a0'; ctx.fillRect(0, -th / 2, tw / 2, th); ctx.restore(); } }
  if (P.src) text(P.src, W / 2, H * .8, { size: 28 * u, font: 'cond', col: '#cfc3ad', lw: 0, a: ks });
  ctx.restore();
}
