/* @effect roll_call_strike
   @does: over dim real footage, a list of names stands in two columns; one after another, fast, a red line strikes each name and it dims, until the last one, then a short line sets under the list
   @params: bg, names, go, span, lab, in, out
   @uses: any clip
   @tags: cut,list,partners,exit,names,strike
   @born: nike-vs-adidas a3-03: Nike walked away from Belk, Dillards, Zappos and other stores
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, paperDesk, rng, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.bg, 0, 1) || img(P.bg), k = clamp(t / Math.max(1, dur)); if (bg) cover(bg, { z: 1.08 + .14 * k, ox: (k - .5) * -.1, filter: `brightness(${P.dim || .38})` }); else { ctx.fillStyle = '#0d0f14'; ctx.fillRect(-W, -H, 3 * W, 3 * H); }
  const N = (P.names || '').split('~').filter(Boolean), t0 = at(P.go || 0), span = +(P.span || 1.8), cols = 2, per = Math.ceil(N.length / cols), cx = [W * .3, W * .7], y0 = H * .22, lh = H * .11;
  N.forEach((s, i) => { const c = Math.floor(i / per), r = i % per, x = cx[c], y = y0 + r * lh, ka = clamp((t - i * .06) / .3), st = t0 + span * i / N.length, kk = clamp((t - st) / .25); if (ka <= 0) return;
    text(s, x, y, { size: 56 * u, font: 'cond', col: kk > 0 ? `rgba(242,244,248,${(1 - .55 * kk).toFixed(2)})` : '#f2f4f8', lw: 0, ls: 4 * u, a: ka });
    if (kk > 0) { const w = s.length * 30 * u; ctx.strokeStyle = '#ff4b3e'; ctx.lineWidth = 7 * u; ctx.beginPath(); ctx.moveTo(x - w / 2, y); ctx.lineTo(x - w / 2 + w * kk, y); ctx.stroke(); } });
  if (P.lab) text(P.lab, W / 2, H * .82, { size: 40 * u, font: 'cond', col: '#c9ced8', lw: 0, ls: 4 * u, a: clamp(p(t0 + span, .4)) });
  ctx.restore();
}
