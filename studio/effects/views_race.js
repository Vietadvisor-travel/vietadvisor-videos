/* @effect views_race
   @does: a phone feed plays dim behind; two horizontal bars race from the left with view counters, one far ahead of the other, and each locks with its label; a source line marks the figures as reported
   @params: bg, a, av, b, bv, max, go, src, in, out
   @uses: any clip
   @tags: views,attention,ads,race,comparison,marketing
   @born: nike-vs-adidas a5-02: Nike Rip the Script passed 66M YouTube views in under a week; Adidas stayed under 7M
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, paperDesk, rng, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.bg, 0, 1) || img(P.bg), k = clamp(t / Math.max(1, dur)); if (bg) cover(bg, { z: 1.08 + .14 * k, ox: (k - .5) * -.1, filter: `brightness(${P.dim || .38})` }); else { ctx.fillStyle = '#0d0f14'; ctx.fillRect(-W, -H, 3 * W, 3 * H); }
  const t0 = at(P.go || 0), kv = clamp(p(t0, 1.4, 'out')), mx = +(P.max || 70), x0 = W * .12, L = W * .7;
  [[P.a, +(P.av || 0), H * .36, '#ff6b5e'], [P.b, +(P.bv || 0), H * .58, '#7fb2ff']].forEach(([lab, v, y, col]) => { const w = L * v / mx * kv; ctx.fillStyle = 'rgba(255,255,255,.1)'; ctx.fillRect(x0, y, L, H * .1); ctx.fillStyle = col; ctx.fillRect(x0, y, w, H * .1);
    text(lab || '', x0, y - 36 * u, { size: 42 * u, font: 'cond', col: '#f2f4f8', lw: 0, ls: 3 * u, align: 'left' }); text((v < 10 ? (v * kv).toFixed(1) : Math.round(v * kv)) + 'M', x0 + Math.max(w, 60 * u) + 90 * u, y + H * .05, { size: 64 * u, font: 'impact', col, lw: 0 }); });
  if (P.src) text(P.src, W / 2, H * .82, { size: 34 * u, font: 'cond', col: '#c9ced8', lw: 0, a: clamp(p(t0 + .6, .4)) });
  ctx.restore();
}
