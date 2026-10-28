/* @effect hundred_parts
   @does: a hundred plastic bricks stand in a grid over a real photo of sorted parts; on the word most of them get a red one-use badge and sink away one after another, leaving only the few that are reused, lit in gold
   @params: bg, pct, go, lab, sub, in, out
   @uses: lego_cut_brick_* + any photo
   @tags: reuse,single-use,parts,percent,complexity,waste
   @born: lego a2-11: about ninety percent of the components were used in just one design
*/
({ t, at, p, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, rng, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.bg, 0, 1) || img(P.bg), k = clamp(t / Math.max(1, dur)); if (bg) cover(bg, { z: 1.1 + .12 * k, filter: 'brightness(.35) blur(2px)' });
  const ids = ['red', 'yellow', 'blue', 'white'].map(c => img('lego_cut_brick_' + c)), pct = +(P.pct || 90), t0 = at(P.go || 0), r = rng(5), order = [...Array(100).keys()].sort(() => r() - .5), rank = []; order.forEach((v, i) => rank[v] = i);
  const gw = W * .62, x0 = W * .19, y0 = H * .2, cw = gw / 10, chh = H * .062;
  for (let i = 0; i < 100; i++) { const b = ids[i % 4]; if (!b) continue; const c = i % 10, rr = Math.floor(i / 10), single = rank[i] < pct, st = t0 + rank[i] * .018, kk = single ? clamp((t - st) / .35) : 0;
    const x = x0 + c * cw + cw / 2, y = y0 + rr * chh + kk * H * .05, w = cw * .8, h = w * b.height / b.width; ctx.save(); ctx.globalAlpha = 1 - .72 * kk; ctx.drawImage(b, x - w / 2, y - h / 2, w, h); ctx.restore();
    if (kk > 0) { ctx.fillStyle = 'rgba(200,50,42,.9)'; ctx.beginPath(); ctx.arc(x + w * .35, y - h * .4, 12 * u, 0, 6.29); ctx.fill(); text('1', x + w * .35, y - h * .4, { size: 20 * u, font: 'impact', col: '#fff', lw: 0 }); }
    if (!single && t > t0 + 1.9) { ctx.strokeStyle = '#f2c14e'; ctx.lineWidth = 4 * u; ctx.strokeRect(x - w / 2 - 4 * u, y - h / 2 - 4 * u, w + 8 * u, h + 8 * u); } }
  const la = clamp(p(t0 + 1.9, .4)); if (P.lab) text(P.lab, W / 2, H * .1, { size: 60 * u, font: 'cond', col: '#f6efe2', lw: 0, ls: 5 * u, a: la }); if (P.sub) text(P.sub, W / 2, H * .84, { size: 34 * u, font: 'cond', col: '#d9cdb8', lw: 0, a: la });
  ctx.restore();
}
