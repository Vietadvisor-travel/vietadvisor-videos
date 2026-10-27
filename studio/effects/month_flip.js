/* @effect month_flip
   @does: a split-flap calendar runs from one month to another on the word, slows and locks on the end month in gold; the gap sets under it over dimmed footage
   @params: from, to, in, out, bg, go, lab, sub
   @uses: — (swap these ids for the new episode's own)
   @tags: time,calendar,countdown,gap,dates,flap
   @born: wework a0-13: WeWork only filed for bankruptcy fifteen months later
*/
({ t, at, p, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, ease }) => {
  // a split-flap calendar tile runs from one month to another on the word, flicking fast then slowing and locking on the
  // end month; the gap sets under it. Footage of the place it is about sits behind, dimmed. params: from, to (YYYY-MM), go, lab, sub, bg, in, out
  const M = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const [y0, m0] = String(P.from).split('-').map(Number), [y1, m1] = String(P.to).split('-').map(Number), n = (y1 - y0) * 12 + (m1 - m0);
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.bg, 0, 1) || img(P.bg); ctx.fillStyle = '#0c0b0a'; ctx.fillRect(-W, -H, 3 * W, 3 * H);
  if (bg && bg.width) { const s = Math.max(W / bg.width, H / bg.height) * 1.08; ctx.save(); ctx.filter = 'blur(6px) brightness(.38) grayscale(.4)'; ctx.drawImage(bg, W / 2 - bg.width * s / 2, H / 2 - bg.height * s / 2, bg.width * s, bg.height * s); ctx.restore(); }
  const k = clamp((t - at(P.go || 0)) / 1.6), e = 1 - Math.pow(1 - k, 3), i = Math.min(n, Math.floor(e * n + .0001)), fr = e * n - i;
  const mm = (m0 - 1 + i) % 12, yy = y0 + Math.floor((m0 - 1 + i) / 12), lab = M[mm] + ' ' + yy;
  const tw = W * .46, th = H * .3, cx = W / 2, cy = H * .4;
  [[-1, 1], [1, 1]].forEach(([s]) => { ctx.fillStyle = '#1c1b19'; ctx.beginPath(); ctx.roundRect(cx - tw / 2, s < 0 ? cy - th / 2 : cy + 3 * u, tw, th / 2 - 3 * u, 14 * u); ctx.fill(); });
  text(lab, cx, cy, { size: 150 * u, font: 'impact', col: i === n ? '#f2c14e' : '#f1ece2', lw: 0 });
  if (i < n && fr > .05) { const f = Math.cos(fr * Math.PI); ctx.save(); ctx.fillStyle = `rgba(28,27,25,${(.85 * (1 - Math.abs(f))).toFixed(2)})`; ctx.fillRect(cx - tw / 2, cy - th / 2 * Math.abs(f), tw, th / 2 * Math.abs(f)); ctx.restore(); }
  ctx.fillStyle = '#0c0b0a'; ctx.fillRect(cx - tw / 2, cy - 2 * u, tw, 4 * u);
  const la = clamp((t - at(P.go || 0) - 1.5) / .4); if (P.lab) text(P.lab, cx, H * .68, { size: 72 * u, font: 'cond', col: '#f1ece2', lw: 0, ls: 6 * u, a: la });
  if (P.sub) text(P.sub, cx, H * .77, { size: 40 * u, font: 'cond', col: '#b8ad98', lw: 0, a: la });
  ctx.restore();
}
