/* @effect tile_multiply
   @does: one real photo of a part fills the frame; on the word it splits into two tiles, then four, eight, sixteen… each tile another real part photo, while a counter runs from one number to another and locks
   @params: tiles, go, steps, from, to, suf, lab, in, out
   @uses: any set of part / product photos
   @tags: proliferation,parts,count,doubling,complexity,catalogue
   @born: lego a2-10: designers went from about six thousand different parts to more than twelve thousand
*/
({ t, at, p, W, H, u, img, ctx, params: P, clamp, lerp, text, seam, cover, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none'); ctx.fillStyle = '#0d0b09'; ctx.fillRect(-W, -H, 3 * W, 3 * H); ctx.save(); { const kc = clamp(t / Math.max(1, dur)); ctx.translate(W / 2, H / 2); ctx.scale(1.08 + .1 * kc, 1.08 + .1 * kc); ctx.translate(-W / 2 + (kc - .5) * -W * .08, -H / 2); }
  const T = (P.tiles || '').split('~').filter(Boolean), t0 = at(P.go || 0), steps = +(P.steps || 6), kk = clamp((t - t0) / 2.6), lv = Math.min(steps, Math.floor(kk * steps)), fr = kk * steps - lv;
  const cols = Math.pow(2, Math.ceil(lv / 2)), rows = Math.pow(2, Math.floor(lv / 2)), cw = W / cols, ch = H / rows;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const im = img(T[(r * cols + c) % T.length]); if (!im) continue; const s = Math.max(cw / im.width, ch / im.height) * (1.05 + .05 * Math.sin(t + r + c)); ctx.save(); ctx.beginPath(); ctx.rect(c * cw + 2 * u, r * ch + 2 * u, cw - 4 * u, ch - 4 * u); ctx.clip(); ctx.filter = 'brightness(.62)' + (P.hue ? ` hue-rotate(${Math.round(clamp(p(at(P.hue), .8)) * ((r * 7 + c * 3) % 12) * 30)}deg) saturate(${1 + clamp(p(at(P.hue), .8))})` : ''); ctx.drawImage(im, c * cw + cw / 2 - im.width * s / 2, r * ch + ch / 2 - im.height * s / 2, im.width * s, im.height * s); ctx.restore(); }
  if (lv < steps && t > t0) { ctx.fillStyle = `rgba(255,240,200,${(.25 * (1 - fr)).toFixed(2)})`; ctx.fillRect(0, 0, W, H); }
  if (t > t0 && P.count !== 'off') { const v = Math.round(lerp(+(P.from || 6000), +(P.to || 12000), clamp(kk * 1.05))); ctx.save(); ctx.fillStyle = 'rgba(8,7,6,.72)'; ctx.fillRect(W * .5 - 330 * u, H * .36, 660 * u, 230 * u); ctx.restore();
    text(v.toLocaleString('en-US') + (kk >= .95 ? (P.suf || '') : ''), W * .5, H * .36 + 105 * u, { size: 140 * u, font: 'impact', col: '#f2c14e', lw: 0 }); if (P.lab) text(P.lab, W * .5, H * .36 + 195 * u, { size: 44 * u, font: 'cond', col: '#f6efe2', lw: 0, ls: 5 * u }); }
  ctx.restore(); if (P.lab && P.count === 'off') { const a = clamp(p(at(P.go || 0) + .3, .4)); ctx.fillStyle = `rgba(8,7,6,${.7 * a})`; ctx.fillRect(0, H * .06, W, 110 * u); text(P.lab, W / 2, H * .06 + 55 * u, { size: 58 * u, font: 'cond', col: '#f6efe2', lw: 0, ls: 5 * u, a }); }
  ctx.restore();
}
