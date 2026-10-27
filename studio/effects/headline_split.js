/* @effect headline_split
   @does: a headline number as an empty dashed bar over a real document; on their words the real parts fill the bar from the left as solid segments with their figures, so what is left empty is the gap between the headline and the money
   @params: in, out, bg, head, total, parts
   @uses: — (swap these ids for the new episode's own)
   @tags: headline,breakdown,parts,gap,money,myth
   @born: wework a4-02: the headline said 9.5 billion; only 6.5 was for the company
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, dur }) => {
  // a headline number as an empty dashed bar across a real document or picture; on their words the real parts fill the bar
  // from the left, each a solid segment with its figure and what it is (a loan can be hatched); what is left of the bar
  // stays empty, so the gap between the headline and the money is visible. params: bg, head (value^label), total,
  // parts (value^label^word^hatch ~ …), in, out
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.bg, 0, 1) || img(P.bg); ctx.fillStyle = '#0c0b0a'; ctx.fillRect(-W, -H, 3 * W, 3 * H);
  if (bg && bg.width) { const s = Math.max(W / bg.width, H / bg.height) * (1.05 + .03 * clamp(t / dur)); ctx.save(); ctx.filter = 'blur(5px) brightness(.4) grayscale(.35)'; ctx.drawImage(bg, W / 2 - bg.width * s / 2, H * .45 - bg.height * s / 2, bg.width * s, bg.height * s); ctx.restore(); }
  const [hv, hl] = String(P.head).split('^'), total = +(P.total || 1), bx = W * .08, bw = W * .84, by = H * .44, bh = H * .16;
  const ha = clamp(t / .5); text(hv, W / 2, H * .17, { size: 130 * u, font: 'impact', col: '#f4efe4', lw: 0, a: ha }); if (hl) text(hl, W / 2, H * .27, { size: 44 * u, font: 'cond', col: '#cfc3ab', lw: 0, ls: 4 * u, a: ha });
  ctx.save(); ctx.globalAlpha = ha; ctx.strokeStyle = '#efe6d2'; ctx.lineWidth = 4 * u; ctx.setLineDash([16 * u, 12 * u]); ctx.strokeRect(bx, by, bw * clamp(t / .7), bh); ctx.restore();
  const parts = String(P.parts || '').split('~').filter(Boolean).map(s => { const [v, l, w, h] = s.split('^'); return { v, l, w, h }; }); let x = bx; const cols = ['#f2c14e', '#e8a33c', '#9fd1e8', '#c7b9e8'];
  parts.forEach((pt, i) => { const val = parseFloat(String(pt.v).replace(/[^0-9.]/g, '')), w = bw * val / total, k = clamp(p(pt.w, .7, 'out5')); if (k <= 0) { x += w; return; }
    ctx.save(); ctx.fillStyle = cols[i % 4]; ctx.fillRect(x, by, w * k, bh); if (pt.h) { ctx.beginPath(); ctx.rect(x, by, w * k, bh); ctx.clip(); ctx.strokeStyle = 'rgba(20,16,10,.45)'; ctx.lineWidth = 6 * u; for (let d = -bh; d < w; d += 22 * u) { ctx.beginPath(); ctx.moveTo(x + d, by + bh); ctx.lineTo(x + d + bh, by); ctx.stroke(); } } ctx.restore();
    ctx.strokeStyle = '#0c0b0a'; ctx.lineWidth = 3 * u; ctx.strokeRect(x, by, w * k, bh);
    const a = clamp((k - .5) / .5), cx = x + w / 2; text(pt.v, cx, by + bh / 2, { size: Math.min(84, Math.max(40, w / u * .3)) * u, font: 'impact', col: '#1a1408', lw: 0, a });
    if (pt.l) text(pt.l, cx, by + bh + (i % 2 ? 110 : 54) * u, { size: 44 * u, font: 'cond', col: cols[i % 4], lw: 0, a }); x += w; });
  ctx.restore();
}
