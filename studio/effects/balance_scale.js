/* @effect balance_scale
   @does: a beam scale over a real picture; one pan is loaded on its word, then the other, and the beam tips by the true ratio of the two values
   @params: in, out, bg, lv, rv, lat, rat, l, r
   @uses: — (swap these ids for the new episode's own)
   @tags: comparison,ratio,scale,weight,mismatch,numbers
   @born: wework a3-10: against that, contracted membership revenue of about four billion
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, dur }) => {
  // a beam scale stands over a real picture; one pan is loaded on its word, then the other, and the beam tips by the true
  // ratio of the two values (spring settle), each pan carrying its figure and what it is. params: bg, l, r (value^label),
  // lv, rv (numbers for the ratio), lat, rat, in, out
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.bg, 0, 1) || img(P.bg); ctx.fillStyle = '#0c0b0a'; ctx.fillRect(-W, -H, 3 * W, 3 * H);
  if (bg && bg.width) { const s = Math.max(W / bg.width, H / bg.height) * (1.04 + .03 * clamp(t / dur)); ctx.save(); ctx.filter = 'blur(6px) brightness(.36) grayscale(.3)'; ctx.drawImage(bg, W / 2 - bg.width * s / 2, H / 2 - bg.height * s / 2, bg.width * s, bg.height * s); ctx.restore(); }
  const lv = +(P.lv || 1), rv = +(P.rv || 1), la = clamp(spring(P.lat || 0, { stiff: 120, damp: 14 }), 0, 1.2), ra = clamp(spring(P.rat || 0, { stiff: 120, damp: 14 }), 0, 1.2);
  const tilt = (la * lv - ra * rv) / Math.max(lv, rv) * .26, cx = W / 2, cy = H * .3, arm = W * .3;
  ctx.fillStyle = '#c9b48a'; ctx.fillRect(cx - 6 * u, cy, 12 * u, H * .5); ctx.beginPath(); ctx.moveTo(cx - 90 * u, H * .8); ctx.lineTo(cx + 90 * u, H * .8); ctx.lineTo(cx + 40 * u, H * .76); ctx.lineTo(cx - 40 * u, H * .76); ctx.fill();
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(-tilt); ctx.fillStyle = '#e2cf9f'; ctx.fillRect(-arm, -7 * u, arm * 2, 14 * u); ctx.restore(); ctx.fillStyle = '#e2cf9f'; ctx.beginPath(); ctx.arc(cx, cy, 16 * u, 0, 7); ctx.fill();
  [[-1, P.l, la, '#f2c14e'], [1, P.r, ra, '#9fd1e8']].forEach(([sd, spec, a, col]) => { const ex = cx + sd * arm * Math.cos(tilt), ey = cy - sd * arm * Math.sin(tilt), py = ey + H * .2;
    ctx.strokeStyle = '#d6c79f'; ctx.lineWidth = 3 * u; ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(ex - W * .09, py); ctx.moveTo(ex, ey); ctx.lineTo(ex + W * .09, py); ctx.stroke();
    ctx.fillStyle = '#d6c79f'; ctx.beginPath(); ctx.ellipse(ex, py, W * .11, 22 * u, 0, 0, Math.PI); ctx.fill();
    if (a > 0) { const [v, lab] = String(spec).split('^'); const aa = Math.min(1, a); text(v, ex, py - 70 * u - (1 - aa) * 60 * u, { size: 96 * u, font: 'impact', col, lw: 0, a: aa }); if (lab) text(lab, ex, py + 70 * u, { size: 44 * u, font: 'cond', col: '#efe6d2', lw: 0, a: aa }); } });
  ctx.restore();
}
