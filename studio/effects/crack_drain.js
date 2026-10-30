/* @effect crack_drain
   @does: a bright real building under a push-in; on the first word its colour drains to grey, and on the second a crack runs across the picture like breaking glass, branching as it goes
   @params: pic, go, go2, x0, y0, x1, y1, lab, in, out
   @uses: a real photo of the place
   @tags: crisis,disaster,crack,break,building,drain,shock
   @born: nike-vs-adidas a4: Adidas, meanwhile, had its own disaster
*/
({ t, at, p, spring, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, rng, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.pic, 0, 1) || img(P.pic), k = clamp(t / Math.max(1, dur)), kg = clamp(p(at(P.go || 0), 1.2, 'inOut')), t2 = at(P.go2 || P.go || 0), kc = clamp(p(t2, .5, 'out'));
  if (bg) cover(bg, { z: 1.08 + .14 * k, ox: (k - .5) * -.06, filter: `saturate(${lerp(1.05, 0, kg)}) brightness(${lerp(.9, .55, kg)}) contrast(${lerp(1, 1.15, kg)})` });
  if (kc > 0) { const r = rng(7), a = [+(P.x0 || .08) * W, +(P.y0 || .3) * H], b = [+(P.x1 || .92) * W, +(P.y1 || .62) * H], n = 14, pts = [a]; for (let i = 1; i < n; i++) { const f = i / n; pts.push([lerp(a[0], b[0], f) + (r() - .5) * 40 * u, lerp(a[1], b[1], f) + (r() - .5) * 90 * u]); } pts.push(b);
    const m = Math.max(1, Math.floor(kc * n)); const draw = (w, col) => { ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineJoin = 'miter'; ctx.beginPath(); ctx.moveTo(...pts[0]); for (let i = 1; i <= m; i++) ctx.lineTo(...pts[i]); ctx.stroke(); };
    draw(22 * u, 'rgba(0,0,0,.6)'); draw(8 * u, 'rgba(255,255,255,.95)');
    for (let i = 2; i < m; i += 2) { const [x, y] = pts[i], ang = (r() - .5) * 2.4 + (i % 4 ? 1.2 : -1.2), len = (60 + r() * 140) * u; ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.lineWidth = 5 * u; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(ang) * len, y + Math.sin(ang) * len); ctx.stroke(); }
    const fl = clamp(1 - (t - t2) / .25); if (fl > 0) { ctx.fillStyle = `rgba(255,255,255,${.35 * fl})`; ctx.fillRect(0, 0, W, H); } }
  if (P.lab) text(P.lab, W / 2, H * .12, { size: 64 * u, font: 'impact', col: '#f6efe2', lw: 0, ls: 6 * u, a: clamp(p(t2 + .2, .4)) });
  ctx.restore();
}
