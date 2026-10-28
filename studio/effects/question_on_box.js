/* @effect question_on_box
   @does: a closed box sits on the dark desk under the lamp; on the first word its lid lifts and a paper slip rises out of it; on the second word a question writes itself across the slip in pencil, line by line
   @params: box, go, go2, q, lab, in, out
   @uses: lego_cut_box or any box cut-out
   @tags: question,lesson,audience,cost,checklist,box
   @born: lego a6-11: when a company you love keeps adding things, ask: can anyone say what each one costs?
*/
({ t, at, p, W, H, u, img, ctx, params: P, clamp, lerp, text, seam, paperDesk, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none'); paperDesk({ lx: .5, ly: .55 });
  const b = img(P.box || 'lego_cut_box'), k = clamp(t / Math.max(1, dur)), bw = W * .26, bh = b ? bw * b.height / b.width : H * .3, bx = W / 2 - bw / 2, by = H * .86 - bh, t1 = at(P.go || 0), t2 = at(P.go2 || P.go || 0), ku = clamp(p(t1, .9, 'out'));
  const sw = W * .62, sh = H * .34, sy = lerp(by + bh * .3, H * .1, ku);
  if (ku > 0) { ctx.save(); ctx.translate(W / 2, sy + sh / 2); ctx.rotate(lerp(.05, -.015, ku)); ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 30 * u; ctx.fillStyle = '#f4eee0'; ctx.fillRect(-sw / 2, -sh / 2, sw, sh); ctx.shadowColor = 'transparent';
    const L = (P.q || '').split('~'), n = L.length; L.forEach((s, i) => { const kk = clamp((t - t2 - i * .7) / .7); if (kk <= 0) return; ctx.save(); ctx.beginPath(); ctx.rect(-sw / 2, -sh / 2, sw * (.08 + .9 * kk), sh); ctx.clip(); text(s, 0, -sh / 2 + sh * (i + 1) / (n + 1), { size: 84 * u, font: 'hand', col: '#2a241c', lw: 0 }); ctx.restore(); }); ctx.restore(); }
  if (b) { ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 40 * u; ctx.drawImage(b, bx, by, bw, bh); ctx.restore(); }
  if (P.lab) text(P.lab, W * .14, H * .5, { size: 40 * u, font: 'cond', col: '#f2c14e', lw: 0, ls: 6 * u, a: clamp(p(0, .4)) });
  ctx.restore();
}
