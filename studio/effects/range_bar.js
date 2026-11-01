/* @effect range_bar
   @does: one tall bar rises from a floor for the most the law allowed, its figure on top; then, each on its word, the asks are drawn to the same scale on it: a gold bracket for a range, a thin red line for a small number, each with its label beside it, so the gap between them is seen, not read
   @params: bg, max, maxlab, go, marks (LO^HI^LABEL^word^colour~…), unit, lab, in, out
   @uses: any dim plate
   @tags: scale,range,ask,penalty,comparison,bracket,proportion,law
   @born: meta-cambridge-analytica-penalty a6-04: the law allowed $219.5B; the state asked $35-40B; Meta asked $3.45B
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const k = clamp(t / Math.max(1, dur)), bg = P.bg ? (clip(P.bg, 0, 1) || img(P.bg)) : null;
  ctx.fillStyle = '#0c0b0a'; ctx.fillRect(-W, -H, 3 * W, 3 * H); if (bg) cover(bg, { z: 1.1 + .26 * k, ox: (k - .5) * -.2, filter: 'brightness(.42) saturate(.6)' });
  const mx = +(P.max || 100), fy = H * .84, top = H * .2, bh = fy - top, bx = W * .3, bw = W * .13, g = clamp(p(P.go || 0, 1.0, 'out5')), y = v => fy - bh * v / mx;
  // camera: drifts down the bar toward the small asks as they land
  const marks = String(P.marks || '').split('~').filter(Boolean).map(s => s.split('^')), last = marks.length ? clamp(p(marks[marks.length - 1][3] || 0, 1.4, 'inOut')) : 0;
  ctx.save(); const z = 1 + .12 * last; ctx.translate(bx + bw / 2, fy); ctx.scale(z, z); ctx.translate(-(bx + bw / 2), -fy);
  ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.fillRect(W * .12, fy, W * .76, 4 * u);
  const h = bh * g; const gr = ctx.createLinearGradient(0, fy - h, 0, fy); gr.addColorStop(0, '#f0d28a'); gr.addColorStop(1, '#7a6432'); ctx.fillStyle = gr; ctx.fillRect(bx, fy - h, bw, h);
  for (let i = 1; i < 10; i++) { const yy = fy - bh * i / 10; if (yy < fy - h) break; ctx.fillStyle = 'rgba(8,6,4,.35)'; ctx.fillRect(bx, yy - 1.5 * u, bw, 3 * u); }
  marks.forEach(([lo, hi, lab, w, col]) => { const a = clamp(p(w || 0, .5, 'out')); if (a <= 0) return; const y0 = y(+lo), y1 = y(+hi), c = col || '#e8c77e';
    ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = c; if (Math.abs(y0 - y1) > 6 * u) { ctx.globalAlpha = a * .55; ctx.fillRect(bx - 18 * u, y1, bw + 36 * u, y0 - y1); ctx.globalAlpha = a; ctx.fillRect(bx + bw + 18 * u, y1, 6 * u, y0 - y1); } else ctx.fillRect(bx - 18 * u, y0 - 4 * u, bw + 36 * u, 8 * u);
    ctx.fillRect(bx + bw + 18 * u, (y0 + y1) / 2 - 2 * u, 70 * u, 4 * u); ctx.restore();
    text(lab, bx + bw + 104 * u, (y0 + y1) / 2, { size: 54 * u, font: 'impact', col: c, lw: 0, align: 'left', a }); });
  ctx.restore();
  if (P.maxlab) text(P.maxlab, bx + bw + 40 * u, top + 10 * u, { size: 58 * u, font: 'impact', col: '#f6efe2', lw: 0, align: 'left', a: clamp(g * 1.4 - .4) });
  if (P.lab) text(P.lab, W / 2, H * .09, { size: 48 * u, font: 'cond', col: '#cbbfa8', lw: 0, ls: 6 * u, a: clamp(p(P.go || 0, .4)) });
  ctx.restore();
}
