/* @effect two_questions
   @does: the lesson as two numbered questions over real footage of what they are about; each question card slides in on its word and stays
   @params: in, out, bg, lab, qs
   @uses: — (swap these ids for the new episode's own)
   @tags: lesson,questions,takeaway,checklist,ending
   @born: wework a6-14: who set the price, and how much cash changed hands
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, dur }) => {
  // the lesson as two numbered questions over real footage of the thing they are about: each question card slides in
  // from the left on its word and stays; the footage behind is dimmed so the questions read. params: bg, qs (text^word ~ …), lab, in, out
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.bg, 0, 1) || img(P.bg); ctx.fillStyle = '#0c0b0a'; ctx.fillRect(-W, -H, 3 * W, 3 * H);
  if (bg && bg.width) { const s = Math.max(W / bg.width, H / bg.height) * (1.03 + .04 * clamp(t / dur)); ctx.save(); ctx.filter = 'brightness(.42)'; ctx.drawImage(bg, W / 2 - bg.width * s / 2, H / 2 - bg.height * s / 2, bg.width * s, bg.height * s); ctx.restore(); }
  if (P.lab) text(P.lab, W * .08, H * .16, { size: 48 * u, font: 'cond', col: '#d6b25e', lw: 0, align: 'left', ls: 6 * u, a: clamp(t / .5) });
  String(P.qs).split('~').forEach((s, i) => { const [q, w] = s.split('^'), k = clamp(spring(w || 0, { stiff: 160, damp: 20 }), 0, 1.04); if (k <= 0) return; const y = H * (.36 + i * .22), x = W * .08 - (1 - Math.min(1, k)) * W * .2;
    ctx.save(); ctx.globalAlpha = Math.min(1, k); ctx.fillStyle = 'rgba(14,13,12,.82)'; setFont(72 * u, 'impact'); const tw = ctx.measureText(q).width + 190 * u; ctx.fillRect(x, y - 64 * u, tw, 128 * u); ctx.fillStyle = '#f2c14e'; ctx.fillRect(x, y - 64 * u, 110 * u, 128 * u); ctx.restore();
    text(String(i + 1), x + 55 * u, y, { size: 84 * u, font: 'impact', col: '#1a1408', lw: 0, a: Math.min(1, k) }); text(q, x + 140 * u, y, { size: 72 * u, font: 'impact', col: '#f4efe4', lw: 0, align: 'left', a: Math.min(1, k) }); });
  ctx.restore();
}
