/* @effect growth_stack
   @does: two stacks of plastic bricks on a real floor: one brick for the earlier year lands first, then on the word the later year's stack drops in brick by brick until it is as many times taller as the number says; a fraction of a brick shows the remainder
   @params: bg, a, b, go, alab, blab, brick, lab, in, out
   @uses: lego_cut_brick_* , any photo or clip as bg
   @tags: growth,multiple,scale,bricks,stack,revenue
   @born: lego a6-06: that's nearly twelve times its 2005 level
*/
({ t, at, p, W, H, u, img, clip, ctx, params: P, clamp, lerp, text, seam, cover, dur }) => {
  ctx.save(); seam(P.in || 'none', P.out || 'none');
  const bg = clip(P.bg, 0, 1) || img(P.bg); ctx.fillStyle = '#0d0b09'; ctx.fillRect(-W, -H, 3 * W, 3 * H); if (bg) cover(bg, { z: 1.06 + .12 * clamp(t / Math.max(1, dur)), filter: 'brightness(.4) blur(1px)' });
  const b = img(P.brick || 'lego_cut_brick_red'), bh = H * .058, floor = H * .9, A = +(P.a || 1), B = +(P.b || 11.8), t0 = at(P.go || 0);
  const stack = (n, cx, st) => { if (!b) return floor; const w = bh * b.width / b.height; let y = floor; for (let i = 0; i < Math.ceil(n); i++) { const s = st + i * .09; if (t < s) break; const frac = Math.min(1, n - i), yy = Math.min(y - bh * frac / 2, -bh + 3200 * u * Math.pow(t - s, 2));
      ctx.save(); ctx.beginPath(); ctx.rect(cx - w, yy - bh * frac / 2, w * 2, bh * frac); ctx.clip(); ctx.drawImage(b, cx - w / 2, yy + bh * frac / 2 - bh, w, bh); ctx.restore(); y -= bh * frac * .88; } return y; };
  const ya = stack(A, W * .3, .15), yb = stack(B, W * .66, t0);
  text(P.alab || '2005', W * .3, ya - 50 * u, { size: 64 * u, font: 'cond', col: '#f3ecdc', lw: 0, ls: 4 * u, a: clamp(p(.4, .4)) });
  const done = t0 + Math.ceil(B) * .09 + .25; text(P.blab || '2025', W * .66, yb - 50 * u, { size: 64 * u, font: 'cond', col: '#f2c14e', lw: 0, ls: 4 * u, a: clamp(p(done, .4)) });
  if (P.lab) text(P.lab, W * .86, H * .5, { size: 96 * u, font: 'impact', col: '#f2c14e', lw: 0, a: clamp(p(done, .4)) });
  ctx.restore();
}
