/* @effect timeline_pins
   @does: a single time line runs across the frame; real documents are pinned onto it at their dates on their words, each with its date and what it was, and a bracket measures the gap between the first two
   @params: items (doc^crop x0,y0,x1,y1^x^date^label^word ~ …), gap, gapat, in, out
   @uses: any document ids
   @tags: timeline,dates,sequence,documents,gap,before-after
   @born: wework a0-14: the comeback started before the crash had even finished
*/
({ t, at, p, spring, W, H, u, img, ctx, params: P, clamp, lerp, text, seam, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  ctx.fillStyle = '#12100d'; ctx.fillRect(-W, -H, 3 * W, 3 * H);
  const ly = H * .66, lk = clamp(t / .8); ctx.fillStyle = '#d9cfbd'; ctx.fillRect(W * .06, ly - 2 * u, W * .88 * lk, 4 * u);
  const items = String(P.items).split('~').map(s => { const [doc, crop, x, date, lab, w] = s.split('^'); return { doc, crop, x: +x, date, lab, w }; });
  items.forEach((it, i) => { const k = clamp(spring(it.w || 0, { stiff: 150, damp: 17 }), 0, 1.05); if (k <= 0) return; const x = it.x * W, im = img(it.doc);
    ctx.fillStyle = '#f2c14e'; ctx.beginPath(); ctx.arc(x, ly, 12 * u, 0, 7); ctx.fill(); text(it.date, x, ly + 56 * u, { size: 52 * u, font: 'impact', col: '#f4efe4', lw: 0, a: Math.min(1, k) }); if (it.lab) text(it.lab, x, ly + 112 * u, { size: 40 * u, font: 'cond', col: i ? '#ff8a7a' : '#f2c14e', lw: 0, ls: 3 * u, a: Math.min(1, k) });
    if (im && im.width) { const [c0, c1, c2, c3] = String(it.crop || '0,0,1,.45').split(',').map(Number), sw = (c2 - c0) * im.width, sh = (c3 - c1) * im.height, s = Math.min(W * .36 / sw, H * .36 / sh), pw = sw * s, ph = sh * s, y = ly - 40 * u - ph / 2 - (1 - Math.min(1, k)) * H * .3;
      ctx.save(); ctx.translate(x, y); ctx.rotate((i % 2 ? 1 : -1) * .02); ctx.shadowColor = 'rgba(0,0,0,.55)'; ctx.shadowBlur = 30 * u; ctx.shadowOffsetY = 12 * u; ctx.fillStyle = '#f7f5ef'; ctx.fillRect(-pw / 2 - 12 * u, -ph / 2 - 12 * u, pw + 24 * u, ph + 24 * u); ctx.shadowColor = 'transparent'; ctx.drawImage(im, c0 * im.width, c1 * im.height, sw, sh, -pw / 2, -ph / 2, pw, ph); ctx.restore(); ctx.strokeStyle = '#d9cfbd'; ctx.lineWidth = 2 * u; ctx.beginPath(); ctx.moveTo(x, ly); ctx.lineTo(x, ly - 40 * u); ctx.stroke(); } });
  const g = P.gapat ? clamp(p(P.gapat, .6, 'inOut')) : 0; if (g > 0 && items.length > 1) { const x0 = items[0].x * W, x1 = lerp(x0, items[1].x * W, g), by = H * .1; ctx.strokeStyle = '#f2c14e'; ctx.lineWidth = 4 * u; ctx.beginPath(); ctx.moveTo(x0, by + 20 * u); ctx.lineTo(x0, by); ctx.lineTo(x1, by); ctx.lineTo(x1, by + 20 * u); ctx.stroke(); if (P.gap) text(P.gap, (x0 + items[1].x * W) / 2, by + 50 * u, { size: 48 * u, font: 'impact', col: '#f2c14e', lw: 0, a: g }); }
  ctx.restore();
}
