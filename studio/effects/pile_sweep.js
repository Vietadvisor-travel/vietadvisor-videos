/* @effect pile_sweep
   @does: a big heap of plastic bricks fills a real picture; on the word a sweep clears most of them out of the frame, the rest settle, and a counter runs down from one number to another and locks
   @params: bg, n, keep, go, from, to, lab, pre, suf, in, out
   @uses: lego_cut_brick_* , any photo or clip as bg
   @tags: cut,reduce,simplify,bricks,count,rescue
   @born: lego a5-09: the parts library was cut back to about seven thousand
*/
({ t, at, p, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, rng, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.bg, 0, 1) || img(P.bg); ctx.fillStyle = '#0d0b09'; ctx.fillRect(-W, -H, 3 * W, 3 * H); if (bg) cover(bg, { z: 1.06 + .1 * clamp(t / Math.max(1, dur)), filter: 'brightness(.45) blur(2px)' });
  const ids = ['lego_cut_brick_red', 'lego_cut_brick_yellow', 'lego_cut_brick_blue', 'lego_cut_brick_white'].map(i => img(i)), r = rng(17), n = +(P.n || 140), keep = +(P.keep || .45), t0 = at(P.go || 0);
  for (let i = 0; i < n; i++) { const b = ids[i % 4], xx = r(), sz = (.05 + r() * .04) * H, col = Math.abs(xx - .5) * 2, x = W * (.04 + xx * .92), y = H - (H * .55) * (1 - col * col) * r() - sz * .3, rot = (r() - .5) * 2.4, stays = r() < keep, d = r();
    if (!b) continue; let ox = 0, oy = 0, rr = rot, jig = Math.sin(t * 3 + i) * 1.5 * u; if (!stays) { const tau = Math.max(0, t - t0 - d * .5); ox = tau * tau * 4200 * u; oy = -tau * 300 * u + tau * tau * 900 * u; rr += tau * 6; } else if (t > t0) { oy = clamp((t - t0 - .4) / .6) * H * .06 * (1 - col); }
    if (x + ox > W + 200 * u) continue; ctx.save(); ctx.translate(x + ox + jig, y + oy); ctx.rotate(rr); const w = sz * b.width / b.height; ctx.drawImage(b, -w / 2, -sz / 2, w, sz); ctx.restore(); }
  const k = clamp((t - t0) / 1.4), e = 1 - Math.pow(1 - k, 3), v = Math.round(lerp(+(P.from || 12000), +(P.to || 7000), t > t0 ? e : 0)), s = (P.pre || '') + v.toLocaleString('en-US') + (t <= t0 ? (P.suf || '+') : '');
  ctx.save(); ctx.fillStyle = 'rgba(8,7,6,.62)'; ctx.fillRect(W * .5 - 330 * u, H * .08, 660 * u, 230 * u); ctx.restore(); text(s, W * .5, H * .08 + 105 * u, { size: 140 * u, font: 'impact', col: t > t0 ? '#f2c14e' : '#f3ecdc', lw: 0 }); if (P.lab) text(P.lab, W * .5, H * .08 + 195 * u, { size: 44 * u, font: 'cond', col: '#f3ecdc', lw: 0, ls: 5 * u });
  ctx.restore();
}
