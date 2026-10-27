/* @effect money_fork
   @does: one source of money (a real photo on the left) and two destinations (real photos on the right); on their words an arrow draws from the source to each destination carrying its amount, so one headline sum visibly forks into two different uses
   @params: src, srclab, a, b (img^label^amount^word), note, in, out
   @uses: any photo ids
   @tags: money,flow,split,fork,diagram,where-it-went
   @born: wework a1-17: only one billion of that was new money; the other billion bought shares
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  ctx.fillStyle = '#12100d'; ctx.fillRect(-W, -H, 3 * W, 3 * H); const lg = ctx.createRadialGradient(W * .45, H * .45, 0, W * .45, H * .45, W * .7); lg.addColorStop(0, 'rgba(255,214,150,.1)'); lg.addColorStop(1, 'rgba(0,0,0,.5)'); ctx.fillStyle = lg; ctx.fillRect(0, 0, W, H);
  const pic = (id, x, y, w, h, a, f) => { const im = clip(id, 0, 1) || img(id); if (!im || !im.width || a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 30 * u; ctx.shadowOffsetY = 12 * u; ctx.fillStyle = '#efe6d2'; ctx.fillRect(x - w / 2 - 10 * u, y - h / 2 - 10 * u, w + 20 * u, h + 20 * u); ctx.shadowColor = 'transparent'; ctx.beginPath(); ctx.rect(x - w / 2, y - h / 2, w, h); ctx.clip(); const s = Math.max(w / im.width, h / im.height); if (f) ctx.filter = f; ctx.drawImage(im, x - im.width * s / 2, y - im.height * s / 2 - im.height * s * .08, im.width * s, im.height * s); ctx.restore(); };
  const sx = W * .2, sy = H * .44, a0 = clamp(t / .5); pic(P.src, sx, sy, W * .24, H * .42, a0); if (P.srclab) text(P.srclab, sx, sy + H * .27, { size: 48 * u, font: 'cond', col: '#efe6d2', lw: 0, ls: 3 * u, a: a0 });
  [['a', H * .25, '#f2c14e'], ['b', H * .64, '#9fd1e8']].forEach(([k, ty, col]) => { const [id, lab, amt, w] = String(P[k] || '').split('^'); if (!id) return; const g = clamp(p(w || 0, .9, 'inOut')); if (g <= 0) return; const tx = W * .74;
    const x0 = sx + W * .13, y0 = sy, x1 = tx - W * .13, y1 = ty, mx = lerp(x0, x1, .5); ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 9 * u; ctx.lineCap = 'round'; ctx.beginPath(); const N = 30; for (let i = 0; i <= N * g; i++) { const f = i / N, x = lerp(x0, x1, f), y = lerp(y0, y1, f * f * (3 - 2 * f)); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); ctx.restore();
    const pa = clamp((g - .7) / .3); pic(id, tx, ty, W * .2, H * .26, pa); if (lab) text(lab, tx, ty + H * .17, { size: 44 * u, font: 'cond', col, lw: 0, ls: 3 * u, a: pa }); if (amt) text(amt, mx, lerp(y0, y1, .5) - 46 * u, { size: 84 * u, font: 'impact', col, lw: 0, a: clamp((g - .3) / .4) }); });
  if (P.note) text(P.note, W * .5, H * .08, { size: 40 * u, font: 'cond', col: '#b9ad97', lw: 0, a: a0 });
  ctx.restore();
}
