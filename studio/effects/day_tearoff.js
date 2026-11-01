/* @effect day_tearoff
   @does: a desk tear-off calendar under a lamp; from the word its pages are torn off one a day and fly out of frame, the count of days building beside it, until the last date stays, ringed in red with what finally happened
   @params: bg, from, to, month, go, span, lab, sub, in, out
   @uses: any dim plate
   @tags: days,silence,waiting,calendar,count,delay,dates
   @born: meta-cambridge-analytica-penalty a3: Zuckerberg said nothing for five days
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, rng, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.bg, 0, 1) || img(P.bg); if (bg) cover(bg, { z: 1.1, filter: 'brightness(.35) blur(3px)' }); else { ctx.fillStyle = '#0b0d12'; ctx.fillRect(-W, -H, 3 * W, 3 * H); }
  const a = +(P.from || 16), b = +(P.to || 21), n = b - a, t0 = at(P.go || 0), span = +(P.span || 2.5), step = span / n, cx = W * .36, cy = H * .5, cw = W * .26, ch = H * .5;
  const gone = Math.max(0, Math.min(n, Math.floor((t - t0) / step) + (t >= t0 ? 1 : 0)));
  const page = (d, x, y, rot, alpha) => { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.globalAlpha = alpha; ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 24 * u; ctx.fillStyle = '#f3efe6'; ctx.fillRect(-cw / 2, -ch / 2, cw, ch); ctx.shadowColor = 'transparent'; ctx.fillStyle = '#c8281e'; ctx.fillRect(-cw / 2, -ch / 2, cw, ch * .2);
    text(P.month || 'MAR', 0, -ch / 2 + ch * .1, { size: 48 * u, font: 'impact', col: '#fff', lw: 0, ls: 4 * u }); text(String(d), 0, ch * .1, { size: 220 * u, font: 'impact', col: '#1c1c20', lw: 0 }); ctx.restore(); };
  page(Math.min(b, a + gone), cx, cy, 0, 1);
  if (gone < n || t < t0 + span + step) for (let i = 0; i < gone; i++) { const tt = t - t0 - i * step; if (tt > 1.2) continue; const kf = clamp(tt / 1.2); page(a + i, cx + kf * W * .5, cy - Math.sin(kf * 3) * H * .2 + kf * kf * H * .6, kf * 1.6, 1 - kf); }
  const days = Math.min(n, gone); if (t >= t0) text(days + (days === 1 ? ' DAY' : ' DAYS'), W * .7, H * .42, { size: 120 * u, font: 'impact', col: '#f2f4f8', lw: 0 });
  if (gone >= n) { const kr = clamp(p(t0 + span, .5)); ctx.strokeStyle = '#ff4b3e'; ctx.lineWidth = 8 * u; ctx.beginPath(); ctx.ellipse(cx, cy + ch * .1, cw * .42, ch * .3, -.1, 0, 6.29 * kr); ctx.stroke();
    if (P.lab) text(P.lab, W * .7, H * .58, { size: 60 * u, font: 'cond', col: '#ff6b5e', lw: 0, ls: 4 * u, a: kr }); }
  if (P.sub) text(P.sub, W * .7, H * .66, { size: 40 * u, font: 'cond', col: '#c9ced8', lw: 0, a: clamp(p(t0, .4)) });
  ctx.restore();
}
