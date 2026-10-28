/* @effect profit_vs_value
   @does: over a dim real picture, one profit bar per year rises above a zero line, year after year (a loss year dips below in red); then on the word a second line, value, starts from zero and sinks under them all to its final figure
   @params: bg, years, loss, go, vgo, vlab, val, lab, in, out
   @uses: any photo or clip as bg
   @tags: profit,value,economic-value,paradox,decade,chart
   @born: lego a4-11: LEGO reported profits in almost every one of those years, yet destroyed about 1.6 billion dollars of value
*/
({ t, at, p, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.bg, 0, 1) || img(P.bg); ctx.fillStyle = '#0d0b09'; ctx.fillRect(-W, -H, 3 * W, 3 * H); if (bg) cover(bg, { z: 1.06 + .12 * clamp(t / Math.max(1, dur)), filter: 'brightness(.3) blur(2px)' });
  const [y0, y1] = (P.years || '1993,2002').split(',').map(Number), n = y1 - y0 + 1, loss = (P.loss || '1998').split(',').map(Number), zx0 = W * .12, zx1 = W * .88, zy = H * .46, t0 = at(P.go || 0);
  ctx.strokeStyle = 'rgba(243,236,220,.5)'; ctx.lineWidth = 2 * u; ctx.beginPath(); ctx.moveTo(zx0, zy); ctx.lineTo(zx1, zy); ctx.stroke(); text('0', zx0 - 30 * u, zy, { size: 32 * u, font: 'cond', col: '#cfc4b0', lw: 0 });
  for (let i = 0; i < n; i++) { const yr = y0 + i, x = lerp(zx0 + 40 * u, zx1 - 40 * u, i / (n - 1)), kk = clamp(p(t0 + i * .12, .4)), l = loss.includes(yr), h = (l ? -.06 : .12 + .05 * Math.sin(i * 1.7)) * H * kk;
    ctx.fillStyle = l ? '#c8322a' : '#e3b23c'; ctx.fillRect(x - 22 * u, zy - Math.max(h, 0), 44 * u, Math.abs(h)); if (kk > 0) text(String(yr), x, zy + (l ? H * .1 : 34 * u), { size: 28 * u, font: 'cond', col: '#e8dcc6', lw: 0, a: kk }); }
  text(P.lab || 'PROFIT, EACH YEAR', W * .5, H * .1, { size: 46 * u, font: 'cond', col: '#e3b23c', lw: 0, ls: 5 * u, a: clamp(p(t0, .4)) });
  const kv = clamp(p(P.vgo || 0, 2.2, 'inOut')); if (kv > 0) { const pts = []; for (let i = 0; i <= 40; i++) { const f = i / 40; pts.push([lerp(zx0, zx1, f), zy + Math.pow(f, 1.3) * H * .28 + Math.sin(f * 9) * 8 * u]); }
    const m = Math.max(2, Math.floor(pts.length * kv)); ctx.save(); ctx.strokeStyle = '#7fc4e8'; ctx.lineWidth = 8 * u; ctx.lineCap = 'round'; ctx.beginPath(); pts.slice(0, m).forEach((q, i) => i ? ctx.lineTo(...q) : ctx.moveTo(...q)); ctx.stroke(); ctx.restore();
    const e = pts[m - 1]; if (kv > .5) text(P.vlab || 'VALUE', e[0] - 30 * u, e[1] - 40 * u, { size: 40 * u, font: 'cond', col: '#7fc4e8', lw: 0, ls: 4 * u, align: 'right' }); if (kv >= 1 && P.val) text(P.val, zx1 - 40 * u, zy + H * .28 + 70 * u, { size: 80 * u, font: 'impact', col: '#7fc4e8', lw: 0, align: 'right' }); }
  ctx.restore();
}
