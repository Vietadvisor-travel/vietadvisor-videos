/* @effect cut_out_word
   @does: a sheet of paper with a short list under a title; on the word one line is cut out of the sheet and falls out of frame, leaving a dark slot
   @params: in, out, lines, cut, go, title, note
   @uses: — (swap these ids for the new episode's own)
   @tags: accounting,exclusion,list,paper,cut,trick
   @born: wework a3-06: community-adjusted EBITDA left out costs like rent
*/
({ t, at, p, spring, W, H, u, img, ctx, params: P, clamp, lerp, text, seam, paper, drop, dur }) => {
  // a sheet of paper on the desk carries a short list under a title; on the word one line is cut out of the sheet and
  // falls away out of frame, leaving a dark slot where it was. params: title, lines (~), cut (line index), go, note, in, out
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  ctx.fillStyle = '#15110d'; ctx.fillRect(-W, -H, 3 * W, 3 * H); const lg = ctx.createRadialGradient(W * .5, H * .4, 0, W * .5, H * .4, W * .7); lg.addColorStop(0, 'rgba(255,214,150,.13)'); lg.addColorStop(1, 'rgba(0,0,0,.55)'); ctx.fillStyle = lg; ctx.fillRect(0, 0, W, H);
  const L = String(P.lines).split('~'), ci = +(P.cut || 1), pw = W * .56, lh = H * .12, ph = H * .2 + L.length * lh, x0 = W / 2 - pw / 2, y0 = H * .44 - ph / 2;
  const sheet = paper(Math.round(pw), Math.round(ph)); const k = clamp(p(P.go || 0, .25, 'out')), fall = Math.max(0, t - at(P.go || 0) - .25);
  ctx.save(); ctx.rotate(-.01); ctx.shadowColor = 'rgba(0,0,0,.55)'; ctx.shadowBlur = 40 * u; ctx.shadowOffsetY = 16 * u; ctx.drawImage(sheet, x0, y0); ctx.shadowColor = 'transparent';
  text(P.title || '', W / 2, y0 + H * .09, { size: 56 * u, font: 'cond', col: '#2a241c', lw: 0, ls: 3 * u });
  ctx.fillStyle = 'rgba(60,50,40,.4)'; ctx.fillRect(x0 + pw * .08, y0 + H * .15, pw * .84, 2 * u);
  L.forEach((l, i) => { const y = y0 + H * .2 + (i + .5) * lh; if (i === ci && k > 0) { ctx.fillStyle = '#0d0b09'; ctx.fillRect(x0 + pw * .06, y - lh * .42, pw * .88, lh * .84);
      if (fall < 2.5) { ctx.save(); const dy = 0.5 * 2600 * u * fall * fall, rot = fall * .5; ctx.translate(W / 2 + fall * 120 * u, y + dy); ctx.rotate(rot); ctx.drawImage(sheet, pw * .06, (y - lh * .42 - y0), pw * .88, lh * .84, -pw * .44, -lh * .42, pw * .88, lh * .84); ctx.strokeStyle = 'rgba(0,0,0,.25)'; ctx.lineWidth = 2 * u; ctx.setLineDash([10 * u, 8 * u]); ctx.strokeRect(-pw * .44, -lh * .42, pw * .88, lh * .84); text(l, 0, 0, { size: 64 * u, font: 'cond', col: '#b3261e', lw: 0 }); ctx.restore(); } }
    else { if (i === ci) { ctx.save(); ctx.strokeStyle = 'rgba(80,70,55,.55)'; ctx.lineWidth = 2 * u; ctx.setLineDash([10 * u, 8 * u]); ctx.strokeRect(x0 + pw * .06, y - lh * .42, pw * .88, lh * .84); ctx.restore(); }
      text(l, W / 2, y, { size: 64 * u, font: 'cond', col: i === ci ? '#b3261e' : '#2a241c', lw: 0 }); } });
  ctx.restore();
  if (P.note) text(P.note, W / 2, H * .84, { size: 40 * u, font: 'cond', col: '#b9ad97', lw: 0, a: clamp(t / .6) });
  ctx.restore();
}
