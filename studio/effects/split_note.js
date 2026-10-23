/* @effect split_note
   @does: a real banknote (or any picture) splits along a ragged line into two shares; the left share stays in the light with its label, the right share slides behind frosted glass and a padlock closes over it on the word
   @params: img, cut, lab1, lab2, at, lock, in, out
   @uses: a banknote or money image (img)
   @tags: money, split, locked, trap, share, ratio
   @born: onecoin v2 (60 % cash, 40 % locked in the system)
*/
({ t, at, p, W, H, u, img, ctx, params: P, clamp, lerp, seam, paperDesk, text, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none'); paperDesk({ lx: .5, ly: .45 });
  const c = img(P.img); if (!c) { ctx.restore(); return; } const cut = +(P.cut || .6), h = H * .62, w = Math.min(W * .74, h * c.width / c.height), x0 = W / 2 - w / 2, y0 = H * .42 - h / 2;
  const k = clamp(p(P.at || 0, .9, 'inOut')), lk = P.lock ? clamp(p(P.lock, .4, 'out')) : 0, off = k * W * .09;
  const edge = side => { ctx.beginPath(); const r = [0, .4, .2, .7, .1, .55, .3, .8, .15, .5, .35]; if (side < 0) { ctx.moveTo(x0, y0); r.forEach((q, i) => ctx.lineTo(x0 + w * cut + (q - .4) * 18 * u, y0 + h * i / (r.length - 1))); ctx.lineTo(x0, y0 + h); }
    else { ctx.moveTo(x0 + w, y0); r.forEach((q, i) => ctx.lineTo(x0 + w * cut + (q - .4) * 18 * u, y0 + h * i / (r.length - 1))); ctx.lineTo(x0 + w, y0 + h); } ctx.closePath(); };
  ctx.save(); ctx.translate(-off * .4, 0); edge(-1); ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 30 * u; ctx.fillStyle = '#000'; ctx.fill(); ctx.restore(); ctx.clip(); ctx.drawImage(c, x0, y0, w, h); ctx.restore();
  ctx.save(); ctx.translate(off, 0); edge(1); ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 30 * u; ctx.fillStyle = '#000'; ctx.fill(); ctx.restore(); ctx.clip();
  ctx.filter = `blur(${(6 * k).toFixed(1)}px) grayscale(${k.toFixed(2)}) brightness(${(1 - .45 * k).toFixed(2)})`; ctx.drawImage(c, x0, y0, w, h); ctx.filter = 'none';
  ctx.fillStyle = `rgba(200,215,230,${.18 * k})`; ctx.fillRect(x0, y0, w, h); ctx.restore();
  if (lk > 0) { const lx = x0 + w * (cut + (1 - cut) / 2) + off, ly = H * .42, s = 1 + (1 - lk) * .4; ctx.save(); ctx.translate(lx, ly); ctx.scale(s, s); ctx.globalAlpha = lk; ctx.strokeStyle = '#e8c77e'; ctx.lineWidth = 12 * u; ctx.beginPath(); ctx.arc(0, -30 * u, 34 * u, Math.PI, 0); ctx.stroke(); ctx.fillStyle = '#e8c77e'; ctx.beginPath(); ctx.roundRect(-55 * u, -30 * u, 110 * u, 90 * u, 12 * u); ctx.fill(); ctx.fillStyle = '#1a140e'; ctx.beginPath(); ctx.arc(0, 8 * u, 11 * u, 0, 7); ctx.fill(); ctx.fillRect(-4 * u, 8 * u, 8 * u, 26 * u); ctx.restore(); }
  const la = clamp(p(P.at || 0, .5, 'out'));
  if (la > 0) { ctx.save(); ctx.globalAlpha = la; text(P.lab1 || '', x0 + w * cut / 2 - off * .4, y0 + h + 64 * u, { size: 56 * u, font: 'impact', col: '#f1e9d8', lw: 0 }); text(P.lab2 || '', x0 + w * (cut + (1 - cut) / 2) + off, y0 + h + 64 * u, { size: 56 * u, font: 'impact', col: '#8f8676', lw: 0 }); ctx.restore(); }
  ctx.restore();
}
