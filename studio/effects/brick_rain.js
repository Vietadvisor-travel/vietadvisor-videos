/* @effect brick_rain
   @does: plastic bricks of four colours rain into a real picture and pile up from the floor, more and more, while an optional counter runs from one number to another and locks on its final value
   @params: bg, go, n, rate, from, to, cnt, span, unit, lab, suf, in, out
   @uses: lego_cut_brick_red/yellow/blue/white, any photo or clip as bg
   @tags: bricks,pile,growth,count,catalogue,sprawl
   @born: lego a0-03: a company famous for precision lost count of its own parts
*/
({ t, at, p, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, rng, dur }) => {
  // bricks fall from the top on go and stack into a heap shape on the floor; n bricks over the beat. Optional counter:
  // from → to over span seconds starting at cnt, then holds the final value (suf, e.g. "+"). lab under the counter
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.bg, 0, 1) || img(P.bg); ctx.fillStyle = '#0b0a09'; ctx.fillRect(-W, -H, 3 * W, 3 * H);
  if (bg) cover(bg, { z: 1.08 + .14 * clamp(t / Math.max(1, dur)), filter: 'brightness(.5) blur(2px)' });
  const ids = ['lego_cut_brick_red', 'lego_cut_brick_yellow', 'lego_cut_brick_blue', 'lego_cut_brick_white'].map(i => img(i));
  const t0 = at(P.go || 0), n = +(P.n || 120), rate = +(P.rate || 26), r = rng(11);
  for (let i = 0; i < n; i++) { const st = t0 + i / rate + r() * .05, b = ids[i % 4], xx = r(), sz = (.05 + r() * .04) * H, rot0 = (r() - .5) * 2.4, rot1 = (r() - .5) * .5;
    if (t < st || !b) continue; const col = Math.abs(xx - .5) * 2, floorY = H - (H * .5) * (1 - col * col) * clamp(i / n * 1.6) - sz * .2 - r() * H * .06;
    const tau = t - st, fall = 2600 * u * tau * tau * .5, y = Math.min(floorY, -sz + fall), x = W * (.05 + xx * .9), rot = y >= floorY ? rot1 : rot0 * (1 - clamp(tau * 1.5)) + rot1;
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); const w = sz * b.width / b.height; ctx.drawImage(b, -w / 2, -sz / 2, w, sz); ctx.restore(); }
  if (P.to !== undefined) { const c0 = at(P.cnt || P.go || 0), k = clamp((t - c0) / +(P.span || 1.6)), e = 1 - Math.pow(1 - k, 3), v = Math.round(lerp(+(P.from || 0), +P.to, e));
    if (t > c0) { const s = v.toLocaleString('en-US') + (k >= 1 ? (P.suf || '') : ''); ctx.save(); ctx.fillStyle = 'rgba(8,7,6,.62)'; ctx.fillRect(W * .5 - 330 * u, H * .1, 660 * u, 230 * u); ctx.restore();
      text(s, W * .5, H * .1 + 105 * u, { size: 140 * u, font: 'impact', col: '#f2c14e', lw: 0 }); if (P.lab) text(P.lab, W * .5, H * .1 + 195 * u, { size: 44 * u, font: 'cond', col: '#f3ecdc', lw: 0, ls: 5 * u }); } }
  ctx.restore();
}
